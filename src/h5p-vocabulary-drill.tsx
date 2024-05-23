import type {
  IH5PContentType,
  IH5PQuestionType,
  XAPIData,
  XAPIVerb,
} from 'h5p-types';
import { H5PResumableContentType, registerContentType } from 'h5p-utils';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ContentIdContext, H5PContext, L10nContext } from 'use-h5p';
import { VocabularyDrill } from './components/VocabularyDrill/VocabularyDrill';
import './index.scss';
import {
  AnswerModeType,
  type InstanceConnector,
  type LanguageModeType,
  type Params,
  type State,
  type SubContentType,
} from './types/types';
import { isNil } from './utils/type.utils';
import XAPIUtils from './utils/xapi.utils';
import { parseWords } from './utils/word.utils';
import { shuffleArray } from './utils/utils';
import { getDefaultParams } from './utils/semantics.utils';

class VocabularyDrillContentType
  extends H5PResumableContentType<Params, State>
  implements IH5PContentType<Params>, IH5PQuestionType {
  private activeContentType: SubContentType | undefined;
  private xAPIUtils: XAPIUtils | undefined;
  private wasAnswerGiven: boolean = this.extras?.previousState ? true : false;
  private wasReset: boolean = false;
  private resetInstance: () => void = (() => { });
  private getScoreInstance: () => number = (() => 0);
  private getMaxScoreInstance: () => number = (() => 0);
  private words: string[] = [];
  private wordsOrder: number[] = [];

  constructor(params: Params, contentId: string, extras?: any) {
    super(params, contentId, extras);

    this.prepareWords();
  }

  attach($container: JQuery<HTMLElement>) {
    const containerElement = $container.get(0);

    if (isNil(containerElement)) {
      throw new Error(
        'H5P.VocabularyDrill: Found no containing element to attach content to.',
      );
    }

    const { contentId, extras, params } = this;

    const sanitizedParams = { ...getDefaultParams(), ...params };

    this.xAPIUtils = new XAPIUtils({
      context: this,
      description: sanitizedParams.description,
      title: extras?.metadata.title,
    });

    const title = extras?.metadata.title ?? '';

    const root = createRoot(containerElement);

    root.render(
      <React.StrictMode>
        <L10nContext.Provider value={sanitizedParams.l10n}>
          <H5PContext.Provider value={this}>
            <ContentIdContext.Provider value={contentId}>
              <VocabularyDrill
                title={title}
                params={sanitizedParams}
                words={this.words}
                previousState={this.state}
                onInitalized={(params: InstanceConnector) => {
                  this.handleInitialized(params);
                }}
                onChangeContentType={(answerMode, contentType) =>
                  this.handleChangeContentType(answerMode, contentType)
                }
                onChangeLanguageMode={(languageMode) =>
                  this.handleLanguageModeChange(languageMode)
                }
                onTrigger={(verb: XAPIVerb) =>
                  this.xAPIUtils?.triggerXAPIEvent(verb)
                }
                onResetTask={() => this.resetTask()}
                onPageChange={(page) => this.handlePageChange(page)}
                getCurrentState={() => {
                  return this.state;
                }}
              />
            </ContentIdContext.Provider>
          </H5PContext.Provider>
        </L10nContext.Provider>
      </React.StrictMode>,
    );

    // Resize the iframe viewport after React has rendered.
    window.requestAnimationFrame(() => {
      this.resize();
    });

    containerElement.classList.add('h5p-vocabulary-drill');
  }

  getAnswerGiven(): boolean {
    if (!this.activeContentType) {
      return false;
    }

    // Needs to remain true until explicitly reset
    this.wasAnswerGiven = this.wasAnswerGiven ||
      this.activeContentType.getAnswerGiven();

    return this.wasAnswerGiven;
  }

  getScore(): number {
    return this.getScoreInstance();
  }

  getMaxScore(): number {
    return this.getMaxScoreInstance();
  }

  showSolutions(): void {
    console.warn('showSolutions not implemented');
  }

  resetTask(): void {
    if (!this.activeContentType) {
      return;
    }

    this.prepareWords();
    if (this.state?.activeAnswerMode) {
      this.setState({
        [this.state.activeAnswerMode]: undefined
      });
    }

    this.resetInstance();

    this.wasReset = true;
    this.wasAnswerGiven = false;
  }

  getXAPIData(): XAPIData {
    const xAPIEvent = this.xAPIUtils!.createXAPIEvent('completed');

    // Not a valid xAPI value (!), but H5P uses it for reporting
    xAPIEvent.data.statement.object.definition.interactionType = 'compound';

    const childrenData: Array<XAPIData> = this.activeContentType
      ? [this.activeContentType.getXAPIData()]
      : [];

    return {
      statement: xAPIEvent?.data.statement,
      children: childrenData,
    };
  }

  getCurrentState(): State | undefined {
    if (!this.getAnswerGiven()) {
      // Requires {} to delete the previous state on the H5P integration
      return this.wasReset ? {} : undefined;
    }

    const currentState = {
      ...this.state,
      wordsOrder: this.wordsOrder,
    };

    const contentTypeState = this.activeContentType?.getCurrentState?.();
    if (
      typeof contentTypeState === 'object' &&
      contentTypeState !== null &&
      this.state?.activeAnswerMode
    ) {
      currentState[this.state.activeAnswerMode] = contentTypeState;
    }

    return currentState;
  }

  private prepareWords() {
    this.words = parseWords(this.params.words, false);

    if (this.extras?.previousState?.wordsOrder) {
      this.wordsOrder = this.extras.previousState.wordsOrder;
    }
    else {
      this.wordsOrder = [...Array(this.words.length).keys()];
      if ((this.params.behaviour.poolSize ?? 0) > 0) {
        this.wordsOrder = shuffleArray(this.wordsOrder)
          .slice(0, this.params.behaviour.poolSize ?? Infinity);
      }
      else if (this.params.behaviour.randomize) {
        this.wordsOrder = shuffleArray(this.wordsOrder);
      }
    }

    this.words = this.wordsOrder.map((orderItem) => {
      return this.words[orderItem];
    });
  }

  /**
   * Resize the iframe viewport.
   */
  private resize() {
    this.trigger('resize');
  }

  private setState(state: Partial<State>) {
    if (typeof state === 'object' && !Object.keys(state).length) {
      this.state = {};
      return;
    }

    this.state = {
      ...this.state,
      ...state,
    };

    if (!this.state) {
      return;
    }

    Object.keys(this.state).forEach((key) => {
      const value = this.state?.[key as keyof State];
      if (value === undefined) {
        delete this.state?.[key as keyof State];
      }
    });
  }

  private handleInitialized(params: InstanceConnector): void {
    // Workaround to using React to allow calling the child component's methods
    this.resetInstance = params.resetInstance;
    this.getScoreInstance = params.getScoreInstance;
    this.getMaxScoreInstance = params.getMaxScoreInstance;
  }

  private handleChangeContentType(
    answerMode: AnswerModeType,
    contentType: SubContentType,
  ): void {
    this.activeContentType = contentType;

    this.setState({
      activeAnswerMode: answerMode,
      [answerMode]: contentType.getCurrentState?.(),
    });

    this.resize();
  }

  private handleLanguageModeChange(languageMode: LanguageModeType): void {
    this.setState({ activeLanguageMode: languageMode });
  }

  private handlePageChange(page: number): void {
    const newState: State = {
      page,
      score:
        (this.state?.score ?? 0) + (this.activeContentType?.getScore() ?? 0),
    };

    Object.values(AnswerModeType).forEach((answerMode) => {
      newState[answerMode] = undefined;
    });

    this.setState(newState);
  }
}

registerContentType('VocabularyDrill', VocabularyDrillContentType);
