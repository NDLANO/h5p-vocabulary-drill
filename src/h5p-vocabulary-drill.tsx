import type {
  IH5PContentType,
  IH5PQuestionType,
  XAPIDefinition,
  XAPIEvent,
} from 'h5p-types';
import { H5PContentType, registerContentType } from 'h5p-utils';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ContentIdContext } from 'use-h5p';
import { VocabularyDrill } from './components/VocabularyDrill/VocabularyDrill';
import './index.scss';
import { Params } from './types/types';
import { isNil } from './utils/type.utils';

class VocabularyDrillContentType
  extends H5PContentType<Params>
  implements IH5PContentType<Params>, IH5PQuestionType {
  private activeContentType: IH5PQuestionType | undefined;

  attach($container: JQuery<HTMLElement>) {
    const containerElement = $container.get(0);

    if (isNil(containerElement)) {
      throw new Error(
        'H5P.VocabularyDrill: Found no containing element to attach content to.',
      );
    }

    // TODO: Translate
    const title = this.extras?.metadata.title ?? 'Vocabulary drill';
    const { contentId } = this;

    const root = createRoot(containerElement);
    root.render(
      <React.StrictMode>
        <ContentIdContext.Provider value={contentId}>
          <VocabularyDrill
            title={title}
            context={this}
            onChangeContentType={(contentType) => {
              this.activeContentType = contentType;
            }}
          />
        </ContentIdContext.Provider>
      </React.StrictMode>,
    );

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
}

registerContentType('VocabularyDrill', VocabularyDrillContentType);
