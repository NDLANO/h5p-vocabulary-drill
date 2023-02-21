import React from 'react';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import { AnswerModeType, LanguageModeType } from '../../types/types';
import { findLanguageName } from '../../utils/language.utils';

type SettingsProps = {
  showSettings: boolean;
  toggleShowSettings: () => void;
  activeAnswerMode: AnswerModeType;
  activeLanguageMode: LanguageModeType;
  enableAnswerMode: boolean;
  enableLanguageMode: boolean;
  sourceLanguage: string;
  targetLanguage: string;
  handleSumbit: (
    answerMode: AnswerModeType,
    languageMode: LanguageModeType,
  ) => void;
};

export const Settings: React.FC<SettingsProps> = ({
  showSettings,
  toggleShowSettings,
  activeAnswerMode,
  activeLanguageMode,
  enableAnswerMode,
  enableLanguageMode,
  sourceLanguage,
  targetLanguage,
  handleSumbit,
}) => {
  const { t } = useTranslation();
  const [settingsAnswerMode, setSettingsAnswerMode] =
    React.useState<AnswerModeType>(activeAnswerMode);
  const [settingsLanguageMode, setSettingsLanguageMode] =
    React.useState<LanguageModeType>(activeLanguageMode);

  const sumbitButtonText = 'Submit'; // TODO: Translate
  const fillInText = 'Fill in'; // TODO: Translate
  const dragTextText = 'Drag text'; // TODO: Translate

  const sourceText = findLanguageName(sourceLanguage);
  const targetText = findLanguageName(targetLanguage);

  const handleAnswerModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    const answerMode = event.target.value as AnswerModeType;
    setSettingsAnswerMode(answerMode);
  };

  const handleLanguageModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    const languageMode = event.target.value as LanguageModeType;
    setSettingsLanguageMode(languageMode);
  };

  const handleClose = (): void => {
    setSettingsAnswerMode(activeAnswerMode);
    setSettingsLanguageMode(activeLanguageMode);
    toggleShowSettings();
  };

  const getSelectedAnswerMode = (answerMode: AnswerModeType): boolean => {
    return answerMode === settingsAnswerMode;
  };

  const getSelectedLanguageMode = (languageMode: LanguageModeType): boolean => {
    return languageMode === settingsLanguageMode;
  };

  return (
    <div
      className={`h5p-vocabulary-drill-settings ${showSettings ? 'visible' : ''
      }`}
    >
      <div className="h5p-vocabulary-drill-settings-top">
        <button type="button" aria-label="close" onClick={handleClose} />
      </div>
      <div className="h5p-vocabulary-drill-settings-container">
        {enableAnswerMode && (
          <div className="h5p-vocabulary-drill-settings-select">
            <label htmlFor="answerMode">{t('answerModeLabel')}</label>
            <select
              id="answerMode"
              name="answerMode"
              onChange={handleAnswerModeChange}
            >
              <option
                value={AnswerModeType.FillIn}
                selected={getSelectedAnswerMode(AnswerModeType.FillIn)}
              >
                {fillInText}
              </option>
              <option
                value={AnswerModeType.DragText}
                selected={getSelectedAnswerMode(AnswerModeType.DragText)}
              >
                {dragTextText}
              </option>
            </select>
          </div>
        )}
        {enableLanguageMode && (
          <div className="h5p-vocabulary-drill-settings-select">
            <label htmlFor="languageMode">{t('languageModeLabel')}</label>
            <select
              id="languageMode"
              name="languageMode"
              onChange={handleLanguageModeChange}
            >
              <option
                value={LanguageModeType.Target}
                selected={getSelectedLanguageMode(LanguageModeType.Target)}
              >
                {targetText}
              </option>
              <option
                value={LanguageModeType.Source}
                selected={getSelectedLanguageMode(LanguageModeType.Source)}
              >
                {sourceText}
              </option>
            </select>
          </div>
        )}
        <button
          type="button"
          onClick={() => handleSumbit(settingsAnswerMode, settingsLanguageMode)}
        >
          <p>{sumbitButtonText}</p>
        </button>
      </div>
    </div>
  );
};
