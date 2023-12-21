import type { H5PExtrasWithState, H5PLibrary, XAPIEvent, XAPIVerb } from 'h5p-types';
import { H5P, H5PContentType } from 'h5p-utils';
import React, { useEffect, useRef, useState, type FC } from 'react';
import { useContentId, useH5PInstance } from 'use-h5p';
import { AriaLiveContext } from '../../contexts/AriaLiveContext';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import {
  AnswerModeType,
  LanguageModeType,
  type Params,
  type State,
  type SubContentType,
} from '../../types/types';
import { bubbleUp, bubbleDown, findLibraryInfo, libraryToString, sanitizeRecord } from '../../utils/h5p.utils';
import { isNil } from '../../utils/type.utils';
import { parseSourceAndTarget, parseWords, pickRandomWords, pickWords } from '../../utils/word.utils';
import { AriaLive } from '../AriaLive/AriaLive';
import { ScorePage } from '../ScorePage/ScorePage';
import { StatusBar } from '../StatusBar/StatusBar';
import { Toolbar } from '../Toolbar/Toolbar';

/*
 * Missing in IH5PContentType in h5p-types. FixedSubContentType can be replaced
 * by SubContentType once the type definitions are updated in h5p-types.
 */
type FixedSubContentType = SubContentType & {
  libraryInfo: {
    machineName: string,
    majorVersion: string,
    minorVersion: string,
    versionedName: string,
    versionedNameNoSpaces: string,
  };
}

type VocabularyDrillProps = {
  title: string;
  params: Params;
  previousState: State | undefined;
  onChangeContentType: (
    type: AnswerModeType,
    contentType: FixedSubContentType,
  ) => void;
  onChangeLanguageMode: (languageMode: LanguageModeType) => void;
  onTrigger: (event: XAPIVerb) => void;
  onPageChange: (page: number) => void;
};

function attachContentType(
  contentId: string,
  extras: H5PExtrasWithState<unknown>,
  libraryInfo: Pick<
    H5PLibrary,
    'machineName' | 'majorVersion' | 'minorVersion'
  >,
  wrapper: HTMLElement,
  contentTypeParams: Record<string, unknown>,
  h5pMainInstance: H5PContentType
): FixedSubContentType {
  const activeContentType = H5P.newRunnable(
    {
      library: libraryToString(libraryInfo),
      params: contentTypeParams,
    },
    contentId,
    H5P.jQuery(wrapper),
    undefined,
    extras,
  ) as unknown as FixedSubContentType;

  // Forward resize events from main instance to subcontent instance and v. v.
  if (activeContentType) {
    bubbleUp(activeContentType, 'resize', h5pMainInstance);
    bubbleDown(h5pMainInstance, 'resize', [activeContentType]);
  }

  return activeContentType;
}

function createDragText(
  params: Params,
  contentId: string,
  words: string[],
  showTips: boolean,
  languageMode: LanguageModeType,
  extras: H5PExtrasWithState<unknown>,
  libraryInfo: Pick<
    H5PLibrary,
    'machineName' | 'majorVersion' | 'minorVersion'
  >,
  wrapper: HTMLElement,
  h5pMainInstance: H5PContentType
): FixedSubContentType {
  const dragTextWords = parseSourceAndTarget(words, showTips, AnswerModeType.DragText, languageMode);

  const dragTextParams = {
    taskDescription: params.description,
    textField: dragTextWords,
    behaviour: {
      instantFeedback: params.behaviour.autoCheck,
      ...params.behaviour,
    },
    overallFeedback: params.overallFeedback,
    ...sanitizeRecord(params.dragtextl10n),
  };

  const activeContentType = attachContentType(
    contentId,
    extras,
    libraryInfo,
    wrapper,
    dragTextParams,
    h5pMainInstance
  );

  return activeContentType;
}

function createFillIn(
  params: Params,
  contentId: string,
  words: string[],
  showTips: boolean,
  languageMode: LanguageModeType,
  extras: H5PExtrasWithState<unknown>,
  libraryInfo: Pick<
    H5PLibrary,
    'machineName' | 'majorVersion' | 'minorVersion'
  >,
  wrapper: HTMLElement,
  h5pMainInstance: H5PContentType
) {
  const { sourceLanguage, targetLanguage } = params;
  const fillInWords = parseSourceAndTarget(words, showTips, AnswerModeType.FillIn, languageMode, sourceLanguage, targetLanguage);

  const fillInParams = {
    text: params.description,
    questions: [fillInWords],
    behaviour: params.behaviour,
    overallFeedback: params.overallFeedback,
    ...sanitizeRecord(params.blanksl10n),
  };

  return attachContentType(
    contentId,
    extras,
    libraryInfo,
    wrapper,
    fillInParams,
    h5pMainInstance
  );
}

export const VocabularyDrill: FC<VocabularyDrillProps> = ({
  title,
  params,
  previousState,
  onChangeContentType,
  onChangeLanguageMode,
  onTrigger,
  onPageChange,
}) => {
  const { behaviour, sourceLanguage, targetLanguage, overallFeedback } = params;

  const {
    answerMode,
    enableSwitchAnswerModeButton,
    enableSwitchWordsButton,
    enableSolutionsButton,
    enableRetry,
    randomize,
    showTips,
  } = behaviour;

  const initialAnswerMode =
    previousState?.activeAnswerMode ?? (answerMode as AnswerModeType);
  const initialLanguageMode =
    previousState?.activeLanguageMode ?? LanguageModeType.Target;

  const { t } = useTranslation();
  const contentId = useContentId();
  const h5pMainInstance = useH5PInstance();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [activeAnswerMode, setActiveAnswerMode] = useState(initialAnswerMode);
  const [activeLanguageMode, setActiveLanguageMode] =
    useState(initialLanguageMode);
  const [hasWords, setHasWords] = useState(true);
  const [page, setPage] = useState(previousState?.page ?? 0);
  const [score, setScore] = useState(previousState?.score ?? 0);
  const [maxScore, setMaxScore] = useState(previousState?.maxScore ?? 0);
  const [disableTools, setDisableTools] = useState(false);
  const [disableNextButton, setDisableNextButton] = useState(true);
  const [ariaLiveText, setAriaLiveText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const activeContentType = useRef<FixedSubContentType | undefined>(undefined);

  // If previous state set, word must not be randomized to keep previous order
  const words = useRef(
    parseWords(
      params.words,
      randomize && !previousState?.[activeAnswerMode],
    ),
  );

  const totalNumberOfWords = words.current.length;

  const numberOfWordsToShow =
    behaviour.numberOfWordsToShow &&
      behaviour.numberOfWordsToShow > 0 &&
      behaviour.numberOfWordsToShow <= totalNumberOfWords
      ? behaviour.numberOfWordsToShow
      : totalNumberOfWords;

  const totalPages = Math.ceil(totalNumberOfWords / numberOfWordsToShow) + 1; // add 1 for score page
  const multiplePages = (totalPages - 1) > 1; // subtract 1 for score page
  const showNextButton = (page + 1) * numberOfWordsToShow < totalNumberOfWords;

  const pickedWords = multiplePages || !randomize ? pickWords(words.current, page, numberOfWordsToShow) : pickRandomWords(words.current, numberOfWordsToShow);

  const dragTextLibraryInfo = findLibraryInfo('H5P.DragText');
  const fillInTheBlanksLibraryInfo = findLibraryInfo('H5P.Blanks');

  if (isNil(dragTextLibraryInfo)) {
    throw new Error(
      'H5P.VocabularyDrill: H5P.DragText is missing in the list of preloaded dependencies',
    );
  }

  if (isNil(fillInTheBlanksLibraryInfo)) {
    throw new Error(
      'H5P.VocabularyDrill: H5P.Blanks is missing in the list of preloaded dependencies',
    );
  }

  const handleAnswerModeChange = (): void => {
    const newAnswerMode =
      activeAnswerMode === AnswerModeType.DragText
        ? AnswerModeType.FillIn
        : AnswerModeType.DragText;

    setActiveAnswerMode(newAnswerMode);
  };

  const handleLanguageModeChange = (): void => {
    const newLanguageMode =
      activeLanguageMode === LanguageModeType.Target
        ? LanguageModeType.Source
        : LanguageModeType.Target;

    setActiveLanguageMode(newLanguageMode);
    onChangeLanguageMode(newLanguageMode);
  };

  const handleShowResults = () => {
    const newPage = page + 1;

    setShowResults(true);
    setPage(newPage);
  };

  const handleAnswered = () => {
    setDisableTools(true);
    setDisableNextButton(false);

    const newScore = score + (activeContentType.current?.getScore() ?? 0);
    setScore(newScore);

    // If retrying, the maxScore is already set
    let newMaxScore = maxScore;
    if (!isRetrying) {
      newMaxScore = maxScore + (activeContentType.current?.getMaxScore() ?? 0);
      setMaxScore(newMaxScore);
    }

    setIsRetrying(false);

    // If all answers are correct, show the score page
    if (!multiplePages && (newScore === newMaxScore)) {
      handleShowResults();
    }
  };

  const handleRetry = (): void => {
    setIsRetrying(true);
    setDisableTools(false);
    setDisableNextButton(true);

    setScore(score - (activeContentType.current?.getScore() ?? 0));
  };

  const handleShowSolution = (): void => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    const target = activeLanguageMode === LanguageModeType.Target;

    if (activeAnswerMode === AnswerModeType.FillIn) {
      wrapper.querySelectorAll('.h5p-question-content .h5p-correct-answer').forEach((element) => {
        element.setAttribute('lang', target ? targetLanguage : sourceLanguage);
        // If we want the solution to be read out loud, we need to remove the aria-hidden attribute
        element.removeAttribute('aria-hidden');
      });
    }
    else {
      wrapper.querySelectorAll('.h5p-question-content .h5p-drag-show-solution-container').forEach((element) => {
        if (element.lastChild) {
          const span = document.createElement('span');
          span.textContent = element.lastChild.textContent;
          span.setAttribute('lang', target ? targetLanguage : sourceLanguage);
          element.replaceChild(span, element.lastChild);
        }
      });
    }
  };

  /**
   * Handles the interaction event for the DragText content type.
   * Sets the language attribute of draggable elements based on the active language mode.
   */
  const handleInteracted = (): void => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }
    if (activeAnswerMode !== AnswerModeType.DragText) {
      return;
    }

    const target = activeLanguageMode === LanguageModeType.Target;

    wrapper.querySelectorAll('.h5p-drag-droppable-words .ui-draggable').forEach((element) => {
      element?.setAttribute('lang', target ? targetLanguage : sourceLanguage);
    });
  };

  const createRunnable = () => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    const addRunnable = () => {
      if (pickedWords.length === 0) {
        setHasWords(false);
        return;
      }

      const extras = {
        previousState: previousState?.[activeAnswerMode],
      } as H5PExtrasWithState<unknown>;

      switch (activeAnswerMode) {
        case AnswerModeType.DragText: {
          activeContentType.current = createDragText(
            params,
            contentId,
            pickedWords,
            showTips,
            activeLanguageMode,
            extras,
            dragTextLibraryInfo,
            wrapper,
            h5pMainInstance
          );
          break;
        }

        case AnswerModeType.FillIn: {
          activeContentType.current = createFillIn(
            params,
            contentId,
            pickedWords,
            showTips,
            activeLanguageMode,
            extras,
            fillInTheBlanksLibraryInfo,
            wrapper,
            h5pMainInstance
          );
          break;
        }

        default: {
          throw new Error(
            `H5P.VocabularyDrill: Invalid answer mode '${activeAnswerMode}'`,
          );
        }
      }

      // Remove previous state once used to start with clean slate after resets
      previousState = undefined;

      activeContentType.current.on('xAPI', (event: XAPIEvent) => {
        if (event.getVerb() === 'answered') {
          handleAnswered();

          if (enableRetry) {
            // Wait for the retry button to be added to the DOM
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                // The retry button is not always added to the DOM at this point when DragText
                // is used, so we need to wait for the next animation frame to be sure
                requestAnimationFrame(() => {
                  const retryButton = wrapper.querySelector('button.h5p-question-try-again');
                  retryButton?.addEventListener('click', handleRetry, { once: true });
                });
              });
            });
          }

          if (enableSolutionsButton) {
            // Wait for the show solution button to be added to the DOM
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                // The show solution button is not always added to the DOM at this point when DragText
                // is used, so we need to wait for the next animation frame to be sure
                requestAnimationFrame(() => {
                  const showSolutionButton = wrapper.querySelector('button.h5p-question-show-solution');
                  showSolutionButton?.addEventListener('click', handleShowSolution, { once: true });
                });
              });
            });
          }

          // Give subcontent's statement time to be triggered first
          window.requestAnimationFrame(() => {
            onTrigger('completed');
          });
        }
        if (event.getVerb() === 'interacted' && activeAnswerMode === AnswerModeType.DragText) {
          // Wait for the draggable element to be added to the DOM before setting the lang attribute
          requestAnimationFrame(() => {
            handleInteracted();
          });
        }
      });

      onChangeContentType(activeAnswerMode, activeContentType.current);

    };

    const removeRunnable = (): void => {
      if (wrapper) {
        wrapper.replaceChildren();
        wrapper.className = '';
      }
    };

    // Remove previous resize listener
    activeContentType.current?.off('resize');

    // Remove previous xAPIEvent listener
    activeContentType.current?.off('xAPI');

    removeRunnable();
    addRunnable();
  };

  // Fighting against React.StrictMode to not re-create runnable on remount
  let shouldCreateRunnable = true;
  useEffect(() => {
    if (!shouldCreateRunnable) {
      return;
    }
    if (showResults) {
      return;
    }

    shouldCreateRunnable = false;
    createRunnable();
  }, [activeAnswerMode, activeLanguageMode, page]);

  const handleNext = () => {
    const newPage = page + 1;

    setPage(newPage);
    onPageChange(newPage);

    setDisableNextButton(true);
    setDisableTools(false);

    // Make sure the first element on the new page is focused
    if (activeAnswerMode === AnswerModeType.DragText) {
      (activeContentType.current as any).$introduction.parent().focus();
    }
    else if (activeAnswerMode === AnswerModeType.FillIn) {
      (activeContentType.current as any).a11yHeader.focus();
    }
  };

  const handleRestart = () => {
    activeContentType.current?.resetTask();
    setShowResults(false);
    setPage(0);
    setScore(0);
    setMaxScore(0);
    setDisableNextButton(true);
    setDisableTools(false);
  };

  /**
   * Adds lang attributes to the source and target words.
   */
  const addLanguageAttributes = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    const target = activeLanguageMode === LanguageModeType.Target;

    // Add lang attributes to Blanks
    if (activeAnswerMode === AnswerModeType.FillIn) {
      wrapper.querySelectorAll('.h5p-question-content input').forEach((element) => {
        element.setAttribute('lang', target ? targetLanguage : sourceLanguage);
      });
    }
    else {
      // Add lang attributes to DragText
      wrapper.querySelectorAll('.h5p-drag-droppable-words span').forEach((element) => {
        element.setAttribute('lang', target ? sourceLanguage : targetLanguage);
      });

      wrapper.querySelectorAll('.h5p-drag-draggables-container .ui-draggable').forEach((element) => {
        // Only add lang attribute to the first <span>, otherwise the a11y descriptive text
        // on the second <span> might get the wrong language.
        (element.firstChild as HTMLSpanElement).setAttribute('lang', target ? targetLanguage : sourceLanguage);
      });
    }
  };

  /**
   * Adds grid titles to the top of the grid.
   */
  const addGridTitles = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    const targetLabel = t(`lang_${targetLanguage}`);
    const sourceLabel = t(`lang_${sourceLanguage}`);

    const target = activeLanguageMode === LanguageModeType.Target;

    const targetTitleElement = document.createElement('div');
    targetTitleElement.className = 'h5p-vocabulary-drill-grid-title';
    targetTitleElement.textContent = target ? targetLabel : sourceLabel;

    const sourceTitleElement = document.createElement('div');
    sourceTitleElement.className = 'h5p-vocabulary-drill-grid-title';
    sourceTitleElement.textContent = target ? sourceLabel : targetLabel;

    let gridContainer: HTMLElement | null = null;
    if (activeAnswerMode === AnswerModeType.FillIn) {
      // Get Blanks container
      gridContainer = wrapper.querySelector('.h5p-question-content p');
    }
    else {
      // Get DragText container
      gridContainer = wrapper.querySelector('.h5p-drag-droppable-words');
    }

    if (gridContainer) {
      gridContainer.prepend(targetTitleElement);
      gridContainer.prepend(sourceTitleElement);
    }
  };

  const overrideDraggableHandling = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    if (activeContentType.current?.libraryInfo?.machineName !== 'H5P.DragText') {
      return;
    }

    const instance = activeContentType.current;

    /*
     * Ignoring TypeScript errors here for not having to go down the rabbit hole
     * of extending the type definitions for content types (which would change)
     * frequently and of also having to extend the type definitions for jQuery
     * regarding jQueryUI.
     */
    wrapper.querySelectorAll('.h5p-drag-droppable-words .ui-droppable')
      .forEach((element) => {
        // @ts-ignore
        H5P.jQuery(element).droppable({
          tolerance: 'touch',
          over: (event: Event) => {
            // @ts-ignore
            instance.droppables?.forEach((droppable) => {
              if (droppable.getElement() !== event.target) {
                droppable.$dropzone.droppable({ disabled: true });
              }
            });
          },
          out: () => {
            // @ts-ignore
            instance.droppables?.forEach((droppable) => {
              droppable.$dropzone.droppable({ disabled: false });
            });
          }
        });

        H5P.jQuery(element).on('drop', () => {
          // @ts-ignore
          instance.droppables?.forEach((droppable) => {
            droppable.$dropzone.droppable({ disabled: false });
          });
        });
      });
  };

  h5pMainInstance.trigger('resize');

  useEffect(() => {
    addLanguageAttributes();
    addGridTitles();
    // Obsolete once https://h5ptechnology.atlassian.net/browse/HFP-3847 is done and released
    overrideDraggableHandling();
  }, [activeLanguageMode, activeAnswerMode, wrapperRef, page]);

  return (
    <AriaLiveContext.Provider value={{ ariaLiveText, setAriaLiveText }}>
      {hasWords ? (
        <div>
          <Toolbar
            title={title}
            activeAnswerMode={activeAnswerMode}
            activeLanguageMode={activeLanguageMode}
            enableAnswerMode={enableSwitchAnswerModeButton}
            enableLanguageMode={enableSwitchWordsButton}
            onAnswerModeChange={handleAnswerModeChange}
            onLanguageModeChange={handleLanguageModeChange}
            sourceLanguageCode={sourceLanguage}
            targetLanguageCode={targetLanguage}
            disableTools={disableTools}
          />
          {!showResults && <div ref={wrapperRef} />}
          {showResults && (
            <ScorePage
              score={score}
              maxScore={maxScore}
              overallFeedbacks={overallFeedback as {}[]}
              onRestart={handleRestart}
            />
          )}
          {multiplePages && (
            <StatusBar
              page={page + 1}
              totalPages={totalPages}
              score={score}
              totalScore={totalNumberOfWords}
              showNextButton={showNextButton}
              disableNextButton={disableNextButton}
              onNext={handleNext}
              onShowResults={handleShowResults}
            />
          )}
        </div>
      ) : (
        <div className="h5p-vd-empty-state">{t('noValidWords')}</div>
      )}
      <AriaLive />
    </AriaLiveContext.Provider>
  );
};
