import React from 'react';
import he from 'he';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import { AnswerModeType } from '../../types/types';
import { Combobox } from '../Combobox/Combobox';
import { H5P } from 'h5p-utils';

type ToolbarProps = {
  title: string;
  activeAnswerMode: AnswerModeType;
  enableAnswerMode: boolean;
  enableLanguageMode: boolean;
  onAnswerModeChange: () => void;
  onLanguageModeChange: () => void;
  disableTools: boolean;
};

export const Toolbar: React.FC<ToolbarProps> = ({
  title,
  activeAnswerMode,
  enableAnswerMode,
  enableLanguageMode,
  onAnswerModeChange,
  onLanguageModeChange,
  disableTools,
}) => {
  const { t } = useTranslation();

  const id = `h5p-vocabulary-drill-answermode-combobox-${H5P.createUUID()}`;

  const enableTools = enableAnswerMode || enableLanguageMode;

  const answerModeOptions = [
    { value: AnswerModeType.FillIn, label: t('fillInLabel'), className: 'h5p-vocabulary-drill-fill-in' },
    { value: AnswerModeType.DragText, label: t('dragTextLabel'), className: 'h5p-vocabulary-drill-drag-text' },
  ];

  const answerModeAriaLiveText = t('changedAnswerModeAria');

  return (
    <div className="h5p-vocabulary-drill-toolbar">
      <p>{he.decode(title)}</p>
      {enableTools && (
        <div className="h5p-vocabulary-drill-toolbar-tools">
          {enableAnswerMode && (
            <Combobox
              id={id}
              className="h5p-vocabulary-drill-combobox"
              label={t('answerModeLabel')}
              active={activeAnswerMode}
              options={answerModeOptions}
              onChange={onAnswerModeChange}
              disabled={disableTools}
              ariaLiveText={answerModeAriaLiveText}
            />
          )}
          {enableLanguageMode && (
            <button
              type="button"
              className="h5p-vocabulary-drill-language-mode"
              onClick={onLanguageModeChange}
              disabled={disableTools}
            >
              {t('languageModeLabel')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
