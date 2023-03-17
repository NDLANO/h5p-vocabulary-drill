import { IH5PQuestionType, H5PExtrasWithState } from 'h5p-types';
import { H5P, H5PResumableContentType } from 'h5p-utils';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useContentId } from 'use-h5p';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import {
  AnswerModeType,
  ChildContentType,
  LanguageModeType,
  Params,
  State,
} from '../../types/types';
import { findLibraryInfo, libraryToString } from '../../utils/h5p.utils';
import { isNil } from '../../utils/type.utils';
import { parseWords } from '../../utils/word.utils';
import { Toolbar } from '../Toolbar/Toolbar';

type VocabularyDrillProps = {
  title: string;
  params: Params;
  previousState: State | undefined;
  onChangeContentType: (
    type: AnswerModeType,
    contentType: ChildContentType,
  ) => void;
  onChangeLanguageMode: (languageMode: LanguageModeType) => void;
};

export const VocabularyDrill: FC<VocabularyDrillProps> = ({
  title,
  params,
  previousState,
  onChangeContentType,
  onChangeLanguageMode,
}) => {
  const {
    behaviour,
    description,
    words,
    overallFeedback,
    blanksl10n,
    dragtextl10n,
  } = params;

  const {
    autoCheck,
    randomize,
    showTips,
    numberOfWordsToShow,
    enableSwitchAnswerModeButton,
    enableSwitchWordsButton,
  } = behaviour;

  const initialAnswerMode =
    previousState?.activeAnswerMode ?? (behaviour.answerMode as AnswerModeType);
  const initialLanguageMode =
    previousState?.activeLanguageMode ?? LanguageModeType.Target;

  const { t } = useTranslation();
  const contentId = useContentId();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [activeAnswerMode, setActiveAnswerMode] = useState(initialAnswerMode);
  const [activeLanguageMode, setActiveLanguageMode] =
    useState(initialLanguageMode);
  const [hasWords, setHasWords] = useState(true);
  const [disableTools, setDisableTools] = useState(false);

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

        const extras = {
          previousState: previousState?.[activeAnswerMode],
        } as H5PExtrasWithState<unknown>;

        let activeContentType: ChildContentType;
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
              undefined,
              extras,
            ) as unknown as ChildContentType;

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
              undefined,
              extras,
            ) as unknown as IH5PQuestionType & H5PResumableContentType;

            break;
          }

          default: {
            throw new Error(`H5P.VocabularyDrill: Invalid answer mode '${activeAnswerMode}'`);
          }
        }

        // TODO: Use xAPI event type from h5p-types
        activeContentType.on('xAPI', (event: any) => {
          if (event.getVerb() === 'answered') {
            setDisableTools(true);
          }
          else {
            // TODO: Enable tools on Retry
            setDisableTools(false);
          }
        });

        onChangeContentType(activeAnswerMode, activeContentType);
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
        disableTools={disableTools}
        enableAnswerMode={enableSwitchAnswerModeButton}
        enableLanguageMode={enableSwitchWordsButton}
        onAnswerModeChange={handleAnswerModeChange}
        onLanguageModeChange={handleLanguageModeChange}
      />
      <div ref={wrapperRef} />
    </div>
  ) : (
    <div className="h5p-vd-empty-state">{t('noValidWords')}</div>
  );
};
