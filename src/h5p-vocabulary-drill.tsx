import type {
  IH5PContentType,
  IH5PQuestionType,
  XAPIDefinition,
  XAPIEvent,
} from 'h5p-types';
import { H5PResumableContentType, registerContentType } from 'h5p-utils';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ContentIdContext, L10nContext } from 'use-h5p';
import { VocabularyDrill } from './components/VocabularyDrill/VocabularyDrill';
import './index.scss';
import { AnswerModeType, LanguageModeType, Params } from './types/types';
import { isNil } from './utils/type.utils';

type State = {
  activeAnswerMode?: AnswerModeType;
  activeLanguageMode?: LanguageModeType;
};

class VocabularyDrillContentType
  extends H5PResumableContentType<Params, State>
  implements IH5PContentType<Params>, IH5PQuestionType {
  private activeContentType: IH5PQuestionType | undefined;

  attach($container: JQuery<HTMLElement>) {
    const containerElement = $container.get(0);

    if (isNil(containerElement)) {
      throw new Error(
        'H5P.VocabularyDrill: Found no containing element to attach content to.',
      );
    }

    const title = this.extras?.metadata.title ?? '';
    const { contentId, params } = this;
    const { l10n } = params;

    const root = createRoot(containerElement);
    root.render(
      <React.StrictMode>
        <L10nContext.Provider value={l10n}>
          <ContentIdContext.Provider value={contentId}>
            <VocabularyDrill
              title={title}
              context={this}
              onChangeContentType={(contentType) => {
                this.activeContentType = contentType;
                this.resize();
              }}
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

  getXAPIData(): {
    statement: XAPIDefinition;
    children?: XAPIEvent[] | undefined;
    } {
    if (!this.activeContentType) {
      return {} as {
        statement: XAPIDefinition;
      };
    }

    return this.activeContentType.getXAPIData();
  }

  getCurrentState(): State | undefined {
    return this.state;
  }

  /**
   * Resize the iframe viewport.
   */
  private resize() {
    this.trigger('resize');
  }
}

registerContentType('VocabularyDrill', VocabularyDrillContentType);
