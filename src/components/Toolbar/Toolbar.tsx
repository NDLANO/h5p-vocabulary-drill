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

  const enableTools = enableAnswerMode || enableLanguageMode;

  const getSelectedAnswerMode = (): string => {
    if (activeAnswerMode === AnswerModeType.FillIn) {
      return 'h5p-vocabulary-drill-fill-in';
    }
    return 'h5p-vocabulary-drill-drag-text';
  };

  return (
    <div className="h5p-vocabulary-drill-toolbar">
      <p>{title}</p>
      {enableTools &&
        <div className="h5p-vocabulary-drill-toolbar-tools">
          {enableAnswerMode && (
            <div className={`h5p-vocabulary-drill-toolbar-select ${getSelectedAnswerMode()}`}>
              <label className="visually-hidden" htmlFor="answerMode">{t('answerModeLabel')}</label>
              <select
                id="answerMode"
                name="answerMode"
                onChange={handleAnswerModeChange}
              >
                <option
                  value={AnswerModeType.FillIn}
                  selected={AnswerModeType.FillIn === activeAnswerMode}
                >
                  {t('fillInLabel')}
                </option>
                <option
                  value={AnswerModeType.DragText}
                  selected={AnswerModeType.DragText === activeAnswerMode}
                >
                  {t('dragTextLabel')}
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
      }
    </div>
  );
};
