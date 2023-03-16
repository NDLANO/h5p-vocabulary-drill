import { IH5PQuestionType } from 'h5p-types';
import { H5P, H5PContentType, H5PResumableContentType } from 'h5p-utils';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useContentId } from 'use-h5p';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import { AnswerModeType, LanguageModeType, Params } from '../../types/types';
import { findLibraryInfo, libraryToString } from '../../utils/h5p.utils';
import { isNil } from '../../utils/type.utils';
import { parseWords } from '../../utils/word.utils';
import { Toolbar } from '../Toolbar/Toolbar';

type VocabularyDrillProps = {
  title: string;
  context: H5PContentType<Params>;
  onChangeContentType: (
    contentType: IH5PQuestionType & H5PResumableContentType,
  ) => void;
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
  const [activeAnswerMode, setActiveAnswerMode] = useState(initialAnswerMode);
  const [activeLanguageMode, setActiveLanguageMode] = useState(
    LanguageModeType.Target,
  );
  const [hasWords, setHasWords] = useState(true);

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
    if (activeAnswerMode === AnswerModeType.DragText) {
      setActiveAnswerMode(AnswerModeType.FillIn);
    }
    else {
      setActiveAnswerMode(AnswerModeType.DragText);
    }
  };

  const handleLanguageModeChange = (): void => {
    if (activeLanguageMode === LanguageModeType.Target) {
      setActiveLanguageMode(LanguageModeType.Source);
    }
    else {
      setActiveLanguageMode(LanguageModeType.Target);
    }
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

        let activeContentType: IH5PQuestionType & H5PResumableContentType;
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
              ...dragtextl10n,
            };

            activeContentType = H5P.newRunnable(
              {
                library: libraryToString(dragTextLibraryInfo),
                params,
              },
              contentId,
              H5P.jQuery(wrapper),
            ) as unknown as IH5PQuestionType & H5PResumableContentType;

            break;
          }

          case AnswerModeType.FillIn: {
            const params = {
              text: description,
              questions: [parsedWords],
              behaviour,
              overallFeedback,
              ...blanksl10n,
            };

            activeContentType = H5P.newRunnable(
              {
                library: libraryToString(fillInTheBlanksLibraryInfo),
                params,
              },
              contentId,
              H5P.jQuery(wrapper),
            ) as unknown as IH5PQuestionType & H5PResumableContentType;

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
      <Toolbar
        title={title}
        activeAnswerMode={activeAnswerMode}
        enableAnswerMode={enableSwitchAnswerModeButton}
        enableLanguageMode={enableSwitchWordsButton}
        onAnswerModeChange={handleAnswerModeChange}
        onLanguageModeChange={handleLanguageModeChange}
      />
      <div ref={wrapperRef} />
    </div>
  ) : (
    <div className="h5p-vd-empty-state">
      {t('noValidWords')}
    </div>
  );
};
