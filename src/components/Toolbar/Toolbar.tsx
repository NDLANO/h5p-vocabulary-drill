import React from 'react';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import { AnswerModeType } from '../../types/types';

type ToolbarProps = {
  title: string;
  activeAnswerMode: AnswerModeType;
  enableAnswerMode: boolean;
  enableLanguageMode: boolean;
  handleAnswerModeChange: () => void;
  handleLanguageModeChange: () => void;
};

export const Toolbar: React.FC<ToolbarProps> = ({
  title,
  activeAnswerMode,
  enableAnswerMode,
  enableLanguageMode,
  handleAnswerModeChange,
  handleLanguageModeChange,
}) => {
  const { t } = useTranslation();

  const fillInText = 'Fill in'; // TODO: Translate
  const dragTextText = 'Drag text'; // TODO: Translate

  const getSelectedAnswerMode = (answerMode: AnswerModeType): boolean => {
    return answerMode === activeAnswerMode;
  };

  return (
    <div className="h5p-vocabulary-drill-toolbar">
      <p>{title}</p>
      <div className="h5p-vocabulary-drill-toolbar-buttons">
        {enableAnswerMode && (
          <div className="h5p-vocabulary-drill-toolbar-select">
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
          <button type="button" className="h5p-vocabulary-drill-language-mode" onClick={handleLanguageModeChange}>
            {t('languageModeLabel')}
          </button>
        )}
      </div>
    </div>
  );
};
