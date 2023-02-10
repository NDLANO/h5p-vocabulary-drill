import React from "react";

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
  const answerModeText = "Change answer mode"; // TODO: Translate
  const languageModeText = "Change language"; // TODO: Translate

  return (
    <div
      className={`h5p-vocabulary-drill-settings ${
        showSettings ? "visible" : ""
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
