import type {
  IH5PContentType,
  IH5PQuestionType,
  XAPIDefinition,
} from 'h5p-types';
import { H5PResumableContentType, registerContentType } from 'h5p-utils';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ContentIdContext, L10nContext } from 'use-h5p';
import { VocabularyDrill } from './components/VocabularyDrill/VocabularyDrill';
import './index.scss';
import type {
  AnswerModeType,
  ChildContentType,
  LanguageModeType,
  Params,
  State,
} from './types/types';
import { isNil } from './utils/type.utils';

class VocabularyDrillContentType
  extends H5PResumableContentType<Params, State>
  implements IH5PContentType<Params>, IH5PQuestionType {
  private activeContentType: ChildContentType | undefined;

  attach($container: JQuery<HTMLElement>) {
    const containerElement = $container.get(0);

    if (isNil(containerElement)) {
      throw new Error(
        'H5P.VocabularyDrill: Found no containing element to attach content to.',
      );
    }

    const { contentId, extras, params } = this;

    const title = extras?.metadata.title ?? '';
    const { l10n } = params;

    const root = createRoot(containerElement);
    root.render(
      <React.StrictMode>
        <L10nContext.Provider value={l10n}>
          <ContentIdContext.Provider value={contentId}>
            <VocabularyDrill
              title={title}
              params={params}
              previousState={this.state}
              onChangeContentType={(answerMode, contentType) =>
                this.handleChangeContentType(answerMode, contentType)
              }
              onChangeLanguageMode={(languageMode) =>
                this.handleLanguageModeChange(languageMode)
              }
            />
          </ContentIdContext.Provider>
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

    return this.activeContentType.getAnswerGiven();
  }

  getScore(): number {
    if (!this.activeContentType) {
      return 0;
    }

    return this.activeContentType.getScore();
  }

  getMaxScore(): number {
    if (!this.activeContentType) {
      return 0;
    }

    return this.activeContentType.getMaxScore();
  }

  showSolutions(): void {
    if (!this.activeContentType) {
      return;
    }

    this.activeContentType.showSolutions();
  }

  resetTask(): void {
    if (!this.activeContentType) {
      return;
    }

    this.activeContentType.resetTask();
  }

  getXAPIData() {
    if (!this.activeContentType) {
      return {} as {
        statement: XAPIDefinition;
      };
    }

    return this.activeContentType.getXAPIData();
  }

  getCurrentState(): State | undefined {
    const contentTypeState = this.activeContentType?.getCurrentState?.();
    if (
      typeof contentTypeState !== 'object' ||
      contentTypeState == null ||
      !this.state?.activeAnswerMode
    ) {
      return this.state;
    }

    return {
      ...this.state,
      [this.state.activeAnswerMode]: contentTypeState,
    };
  }

  /**
   * Resize the iframe viewport.
   */
  private resize() {
    this.trigger('resize');
  }

  private setState(state: Partial<State>) {
    this.state = {
      ...this.state,
      ...state,
    };
  }

  private handleChangeContentType(
    answerMode: AnswerModeType,
    contentType: ChildContentType,
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
}

registerContentType('VocabularyDrill', VocabularyDrillContentType);
