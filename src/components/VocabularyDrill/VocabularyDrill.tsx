import { H5PExtrasWithState, H5PLibrary, XAPIEvent, XAPIVerb } from 'h5p-types';
import { H5P } from 'h5p-utils';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useContentId } from 'use-h5p';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import {
  AnswerModeType,
  SubContentType,
  LanguageModeType,
  Params,
  State,
} from '../../types/types';
import { findLibraryInfo, libraryToString, sanitizeRecord } from '../../utils/h5p.utils';
import { isNil } from '../../utils/type.utils';
import { parseWords, pickWords, parseSourceAndTarget, pickRandomWords } from '../../utils/word.utils';
import { StatusBar } from '../StatusBar/StatusBar';
import { Toolbar } from '../Toolbar/Toolbar';
import { AriaLiveContext } from '../../contexts/AriaLiveContext';
import { AriaLive } from '../AriaLive/AriaLive';

type VocabularyDrillProps = {
  title: string;
  params: Params;
  previousState: State | undefined;
  onChangeContentType: (
    type: AnswerModeType,
    contentType: SubContentType,
  ) => void;
  onChangeLanguageMode: (languageMode: LanguageModeType) => void;
  onResize: () => void;
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
  );
}

export const VocabularyDrill: FC<VocabularyDrillProps> = ({
  title,
  params,
  previousState,
  onChangeContentType,
  onChangeLanguageMode,
  onResize,
  onTrigger,
  onPageChange,
}) => {
  const { behaviour } = params;

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

  const enableMultiplePages = false;

  const { t } = useTranslation();
  const contentId = useContentId();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [activeAnswerMode, setActiveAnswerMode] = useState(initialAnswerMode);
  const [activeLanguageMode, setActiveLanguageMode] =
    useState(initialLanguageMode);
  const [hasWords, setHasWords] = useState(true);
  const [page, setPage] = useState(/* previousState?.page ?? */ 0);
  const [score, setScore] = useState(previousState?.score ?? 0);
  const [maxScore, setMaxScore] = useState(previousState?.maxScore ?? 0);
  const [disableTools, setDisableTools] = useState(false);
  const [disableNextButton, setDisableNextButton] = useState(true);
  const [ariaLiveText, setAriaLiveText] = useState<string | null>(null);

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

  const pickedWords = enableMultiplePages || !randomize ? pickWords(words.current, page, numberOfWordsToShow) : pickRandomWords(words.current, numberOfWordsToShow);

  const totalPages = Math.ceil(totalNumberOfWords / numberOfWordsToShow);
  const multiplePages = totalPages > 1;
  const showNextButton = (page + 1) * numberOfWordsToShow < totalNumberOfWords;

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

  const handleRetry = (): void => {
    setDisableTools(false);
    setDisableNextButton(true);
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

      activeContentType.current?.on('resize', () => {
        onResize();
      });

      activeContentType.current.on('xAPI', (event: XAPIEvent) => {
        if (event.getVerb() === 'answered') {
          setDisableTools(true);
          setDisableNextButton(false);

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

    shouldCreateRunnable = false;
    createRunnable();
  }, [activeAnswerMode, activeLanguageMode, page]);

  const handleNext = () => {
    const newPage = page + 1;

    setPage(newPage);
    onPageChange(newPage);

    setScore(score + (activeContentType.current?.getScore() ?? 0));
    setMaxScore(maxScore + (activeContentType.current?.getMaxScore() ?? 0));

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

  // Resize can be required if !hasWords and plain div is rendered
  onResize();

  return (
    <AriaLiveContext.Provider value={{ ariaLiveText, setAriaLiveText }}>
      {hasWords ? (
        <div>
          <Toolbar
            title={title}
            activeAnswerMode={activeAnswerMode}
            enableAnswerMode={enableSwitchAnswerModeButton}
            enableLanguageMode={enableSwitchWordsButton}
            onAnswerModeChange={handleAnswerModeChange}
            onLanguageModeChange={handleLanguageModeChange}
            disableTools={disableTools}
          />
          <div ref={wrapperRef} />
          {enableMultiplePages && multiplePages && (
            <StatusBar page={page + 1} totalPages={totalPages} score={score} totalScore={totalNumberOfWords} showNextButton={showNextButton} disableNextButton={disableNextButton} onNext={handleNext} />
          )}
        </div>
      ) : (
        <div className="h5p-vd-empty-state">{t('noValidWords')}</div>
      )}
      <AriaLive />
    </AriaLiveContext.Provider>
  );
};
