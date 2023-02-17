import { H5P, H5PContentType } from "h5p-utils";
import React, { FC, useEffect, useRef, useState } from "react";
import { useContentId } from "use-h5p";
import { AnswerModeType, LanguageModeType, Params } from "../../types/types";
import { findLibraryInfo, libraryToString } from "../../utils/h5p.utils";
import { isNil } from "../../utils/type.utils";
import { parseWords } from "../../utils/word.utils";
import { Settings } from "../Settings/Settings";
import { Toolbar } from "../Toolbar/Toolbar";

type VocabularyDrillProps = {
  title: string;
  context: H5PContentType<Params>;
};

export const VocabularyDrill: FC<VocabularyDrillProps> = ({
  title,
  context,
}) => {
  const { params } = context;
  const { behaviour, description, words, overallFeedback } = params;
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

  const dragTextLibraryInfo = findLibraryInfo("H5P.DragText");
  const fillInTheBlanksLibraryInfo = findLibraryInfo("H5P.Blanks");

  const enableSettings =
    enableSwitchAnswerModeButton || enableSwitchWordsButton;

  if (isNil(dragTextLibraryInfo)) {
    throw new Error(
      "H5P.VocabularyDrill: H5P.DragText is missing in the list of preloaded dependencies",
    );
  }

  if (isNil(fillInTheBlanksLibraryInfo)) {
    throw new Error(
      "H5P.VocabularyDrill: H5P.Blanks is missing in the list of preloaded dependencies",
    );
  }

  const handleAnswerModeChange = (): void => {
    if (activeAnswerMode === AnswerModeType.DragText) {
      setActiveAnswerMode(AnswerModeType.FillIn);
    } else {
      setActiveAnswerMode(AnswerModeType.DragText);
    }
    toggleShowSettings();
  };

  const handleLanguageModeChange = (): void => {
    if (activeLanguageMode === LanguageModeType.Target) {
      setActiveLanguageMode(LanguageModeType.Source);
    } else {
      setActiveLanguageMode(LanguageModeType.Target);
    }
    toggleShowSettings();
  };

  const toggleShowSettings = (): void => {
    setShowSettings(!showSettings);
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

        switch (activeAnswerMode) {
          case AnswerModeType.DragText: {
            H5P.newRunnable(
              {
                library: libraryToString(dragTextLibraryInfo),
                params: {
                  taskDescription: description,
                  textField: parsedWords,
                  behaviour: {
                    instantFeedback: autoCheck,
                    ...behaviour,
                  },
                  overallFeedback,
                },
              },
              contentId,
              H5P.jQuery(wrapper),
            );

            break;
          }

          case AnswerModeType.FillIn: {
            H5P.newRunnable(
              {
                library: libraryToString(fillInTheBlanksLibraryInfo),
                params: {
                  text: description,
                  questions: [parsedWords],
                  behaviour,
                  overallFeedback,
                },
              },
              contentId,
              H5P.jQuery(wrapper),
            );

            break;
          }

          default: {
            throw new Error("H5P.VocabularyDrill: Invalid answer mode");
          }
        }
      };

      const removeRunnable = (): void => {
        if (wrapper) {
          wrapper.replaceChildren();
          wrapper.className = "";
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
        toggleShowSettings={toggleShowSettings}
      />
      <div ref={wrapperRef} />
    </div>
  ) : (
    <div className="h5p-vd-empty-state">
      {/* TODO: Translate */}
      No valid words found. Please check your words and try again.
    </div>
  );
};
