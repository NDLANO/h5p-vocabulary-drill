import { IH5PQuestionType } from 'h5p-types';
import { H5P, H5PContentType } from 'h5p-utils';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useContentId } from 'use-h5p';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import { AnswerModeType, LanguageModeType, Params } from '../../types/types';
import { findLibraryInfo, libraryToString } from '../../utils/h5p.utils';
import { isNil } from '../../utils/type.utils';
import { parseWords } from '../../utils/word.utils';
import { Settings } from '../Settings/Settings';
import { Toolbar } from '../Toolbar/Toolbar';

type VocabularyDrillProps = {
  title: string;
  context: H5PContentType<Params>;
  onChangeContentType: (contentType: IH5PQuestionType) => void;
};

export const VocabularyDrill: FC<VocabularyDrillProps> = ({
  title,
  context,
  onChangeContentType,
}) => {
  const { t } = useTranslation();
  const { params } = context;
  const { behaviour, description, words, overallFeedback, blanksl10n, dragtextl10n } = params;
  const {
    autoCheck,
    randomize,
    showTips,
    numberOfWordsToShow,
    enableSwitchAnswerModeButton,
    enableSwitchWordsButton,
  } = behaviour;
  const initialAnswerMode = behaviour.answerMode as AnswerModeType;
  const contentId = useContentId();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [activeAnswerMode, setActiveAnswerMode] = useState(initialAnswerMode);
  const [activeLanguageMode, setActiveLanguageMode] = useState(
    LanguageModeType.Target,
  );
  const [hasWords, setHasWords] = useState(true);

  const dragTextLibraryInfo = findLibraryInfo('H5P.DragText');
  const fillInTheBlanksLibraryInfo = findLibraryInfo('H5P.Blanks');

  const enableSettings =
    enableSwitchAnswerModeButton || enableSwitchWordsButton;

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

  const toggleShowSettings = (): void => {
    setShowSettings(!showSettings);
  };

  const handleAnswerModeChange = (): void => {
    if (activeAnswerMode === AnswerModeType.DragText) {
      setActiveAnswerMode(AnswerModeType.FillIn);
    }
    else {
      setActiveAnswerMode(AnswerModeType.DragText);
    }
    toggleShowSettings();
  };

  const handleLanguageModeChange = (): void => {
    if (activeLanguageMode === LanguageModeType.Target) {
      setActiveLanguageMode(LanguageModeType.Source);
    }
    else {
      setActiveLanguageMode(LanguageModeType.Target);
    }
    toggleShowSettings();
  };

  useEffect(() => {
    (() => {
      const wrapper = wrapperRef.current;

      if (!wrapper) {
        return;
      }

      const addRunnable = () => {
        const parsedWords = parseWords(
          words,
          randomize,
          showTips,
          numberOfWordsToShow,
          activeAnswerMode,
          activeLanguageMode,
        );

        if (parsedWords.length === 0) {
          setHasWords(false);
          return;
        }

        let activeContentType: IH5PQuestionType;
        switch (activeAnswerMode) {
          case AnswerModeType.DragText: {
            const params = {
              taskDescription: description,
              textField: parsedWords,
              behaviour: {
                instantFeedback: autoCheck,
                ...behaviour,
              },
              overallFeedback,
              checkAnswer: dragtextl10n.checkAnswer,
              submitAnswer: dragtextl10n.submitAnswer,
              tryAgain: dragtextl10n.tryAgain,
              showSolution: dragtextl10n.showSolution,
              dropZoneIndex: dragtextl10n.dropZoneIndex,
              empty: dragtextl10n.empty,
              contains: dragtextl10n.contains,
              ariaDraggableIndex: dragtextl10n.ariaDraggableIndex,
              tipLabel: dragtextl10n.tipLabel,
              correctText: dragtextl10n.correctText,
              incorrectText: dragtextl10n.incorrectText,
              resetDropTitle: dragtextl10n.resetDropTitle,
              resetDropDescription: dragtextl10n.resetDropDescription,
              grabbed: dragtextl10n.grabbed,
              cancelledDragging: dragtextl10n.cancelledDragging,
              correctAnswer: dragtextl10n.correctAnswer,
              feedbackHeader: dragtextl10n.feedbackHeader,
              scoreBarLabel: dragtextl10n.scoreBarLabel,
              a11yCheck: dragtextl10n.a11yCheck,
              a11yShowSolution: dragtextl10n.a11yShowSolution,
              a11yRetry: dragtextl10n.a11yRetry,
            };

            activeContentType = H5P.newRunnable(
              {
                library: libraryToString(dragTextLibraryInfo),
                params,
              },
              contentId,
              H5P.jQuery(wrapper),
            ) as unknown as IH5PQuestionType;

            break;
          }

          case AnswerModeType.FillIn: {
            const params = {
              text: description,
              questions: [parsedWords],
              behaviour,
              overallFeedback,
              showSolutions: blanksl10n.showSolutions,
              tryAgain: blanksl10n.tryAgain,
              checkAnswer: blanksl10n.checkAnswer,
              submitAnswer: blanksl10n.submitAnswer,
              notFilledOut: blanksl10n.notFilledOut,
              answerIsCorrect: blanksl10n.answerIsCorrect,
              answerIsWrong: blanksl10n.answerIsWrong,
              answeredCorrectly: blanksl10n.answeredCorrectly,
              answeredIncorrectly: blanksl10n.answeredIncorrectly,
              solutionLabel: blanksl10n.solutionLabel,
              inputLabel: blanksl10n.inputLabel,
              inputHasTipLabel: blanksl10n.inputHasTipLabel,
              tipLabel: blanksl10n.tipLabel,
              scoreBarLabel: blanksl10n.scoreBarLabel,
              a11yCheck: blanksl10n.a11yCheck,
              a11yShowSolution: blanksl10n.a11yShowSolution,
              a11lyRetry: blanksl10n.a11yRetry,
              a11yCheckingModeHeader: blanksl10n.a11yCheckingModeHeader,
            };

            activeContentType = H5P.newRunnable(
              {
                library: libraryToString(fillInTheBlanksLibraryInfo),
                params,
              },
              contentId,
              H5P.jQuery(wrapper),
            ) as unknown as IH5PQuestionType;

            break;
          }

          default: {
            throw new Error('H5P.VocabularyDrill: Invalid answer mode');
          }
        }

        onChangeContentType(activeContentType);
      };

      const removeRunnable = (): void => {
        if (wrapper) {
          wrapper.replaceChildren();
          wrapper.className = '';
        }
      };

      removeRunnable();
      addRunnable();
    })();
  }, [activeAnswerMode, activeLanguageMode]);

  return hasWords ? (
    <div>
      {enableSettings && (
        <Settings
          showSettings={showSettings}
          toggleShowSettings={toggleShowSettings}
          enableAnswerMode={enableSwitchAnswerModeButton}
          enableLanguageMode={enableSwitchWordsButton}
          handleAnswerModeChange={handleAnswerModeChange}
          handleLanguageModeChange={handleLanguageModeChange}
        />
      )}
      <Toolbar
        title={title}
        enableSettings={enableSettings}
        showSettings={showSettings}
        toggleShowSettings={toggleShowSettings}
      />
      <div ref={wrapperRef} />
    </div>
  ) : (
    <div className="h5p-vd-empty-state">
      {t('noValidWords')}
    </div>
  );
};
