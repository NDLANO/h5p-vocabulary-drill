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

type VocabularyDrillProps = {
  title: string;
  params: Params;
  previousState: State | undefined;
  onChangeContentType: (
    type: AnswerModeType,
    contentType: SubContentType,
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
): SubContentType {
  const activeContentType = H5P.newRunnable(
    {
      library: libraryToString(libraryInfo),
      params: contentTypeParams,
    },
    contentId,
    H5P.jQuery(wrapper),
    undefined,
    extras,
  ) as unknown as SubContentType;

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
): SubContentType {
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
  const fillInWords = parseSourceAndTarget(words, showTips, AnswerModeType.FillIn, languageMode);

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

  const activeContentType = useRef<SubContentType | undefined>(undefined);

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
    const newMaxScore = maxScore + (activeContentType.current?.getMaxScore() ?? 0);

    setScore(newScore);
    setMaxScore(newMaxScore);

    // If all answers are correct, show the score page
    if (!multiplePages && (newScore === newMaxScore)) {
      handleShowResults();
    }
  };

  const handleRetry = (): void => {
    setDisableTools(false);
    setDisableNextButton(true);

    setScore(score - (activeContentType.current?.getScore() ?? 0));
    setMaxScore(maxScore - (activeContentType.current?.getMaxScore() ?? 0));
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

          // Give subcontent's statement time to be triggered first
          window.requestAnimationFrame(() => {
            onTrigger('completed');
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

  h5pMainInstance.trigger('resize');

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
