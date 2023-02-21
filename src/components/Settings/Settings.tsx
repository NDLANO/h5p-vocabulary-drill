import React from 'react';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';

type SettingsProps = {
  enableAnswerMode: boolean;
  enableLanguageMode: boolean;
  showSettings: boolean;
  toggleShowSettings: () => void;
  handleAnswerModeChange: () => void;
  handleLanguageModeChange: () => void;
};

export const Settings: React.FC<SettingsProps> = ({
  showSettings,
  toggleShowSettings,
  enableAnswerMode,
  enableLanguageMode,
  handleAnswerModeChange,
  handleLanguageModeChange,
}) => {
  const { t } = useTranslation();

  const answerModeText = t('answerModeLabel');
  const languageModeText = t('languageModeLabel');

  return (
    <div
      className={`h5p-vocabulary-drill-settings ${showSettings ? 'visible' : ''
      }`}
    >
      <div className="h5p-vocabulary-drill-settings-top">
        <button type="button" aria-label="close" onClick={toggleShowSettings} />
      </div>
      <div className="h5p-vocabulary-drill-settings-container">
        {enableAnswerMode && (
          <button type="button" onClick={handleAnswerModeChange}>
            <p>{answerModeText}</p>
          </button>
        )}
        {enableLanguageMode && (
          <button type="button" onClick={handleLanguageModeChange}>
            <p>{languageModeText}</p>
          </button>
        )}
      </div>
    </div>
  );
};
