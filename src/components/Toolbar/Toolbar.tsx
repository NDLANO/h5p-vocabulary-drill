import React from 'react';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import { AnswerModeType } from '../../types/types';

type ToolbarProps = {
  title: string;
  activeAnswerMode: AnswerModeType;
  enableAnswerMode: boolean;
  enableLanguageMode: boolean;
  onAnswerModeChange: () => void;
  onLanguageModeChange: () => void;
};

export const Toolbar: React.FC<ToolbarProps> = ({
  title,
  activeAnswerMode,
  enableAnswerMode,
  enableLanguageMode,
  onAnswerModeChange,
  onLanguageModeChange,
}) => {
  const { t } = useTranslation();

  const enableTools = enableAnswerMode || enableLanguageMode;

  const classes = {
    [AnswerModeType.FillIn]: 'h5p-vocabulary-drill-fill-in',
    [AnswerModeType.DragText]: 'h5p-vocabulary-drill-drag-text',
  };

  return (
    <div className="h5p-vocabulary-drill-toolbar">
      <p>{title}</p>
      {enableTools &&
        <div className="h5p-vocabulary-drill-toolbar-tools">
          {enableAnswerMode && (
            <div className={`h5p-vocabulary-drill-toolbar-select ${classes[activeAnswerMode]}`}>
              <label className="visually-hidden" htmlFor="answerMode">{t('answerModeLabel')}</label>
              <select
                id="answerMode"
                name="answerMode"
                onChange={onAnswerModeChange}
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
            <button type="button" className="h5p-vocabulary-drill-language-mode" onClick={onLanguageModeChange}>
              {t('languageModeLabel')}
            </button>
          )}
        </div>
      }
    </div>
  );
};
