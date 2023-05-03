import React from 'react';
import he from 'he';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import { useAriaLive } from '../../hooks/useAriaLive/useAriaLive';
import { AnswerModeType, LanguageModeType } from '../../types/types';
import { Combobox } from '../Combobox/Combobox';
import { H5P } from 'h5p-utils';
import { getLanguageModeAria } from '../../utils/language.utils';

type ToolbarProps = {
  title: string;
  activeAnswerMode: AnswerModeType;
  activeLanguageMode: LanguageModeType;
  enableAnswerMode: boolean;
  enableLanguageMode: boolean;
  onAnswerModeChange: () => void;
  onLanguageModeChange: () => void;
  sourceLanguageCode: string;
  targetLanguageCode: string;
  disableTools: boolean;
};

export const Toolbar: React.FC<ToolbarProps> = ({
  title,
  activeAnswerMode,
  activeLanguageMode,
  enableAnswerMode,
  enableLanguageMode,
  onAnswerModeChange,
  onLanguageModeChange,
  sourceLanguageCode,
  targetLanguageCode,
  disableTools,
}) => {
  const { t } = useTranslation();
  const { setAriaLiveText } = useAriaLive();

  const id = `h5p-vocabulary-drill-answermode-combobox-${H5P.createUUID()}`;

  const enableTools = enableAnswerMode || enableLanguageMode;

  const answerModeOptions = [
    { value: AnswerModeType.FillIn, label: t('fillInLabel'), className: 'h5p-vocabulary-drill-fill-in' },
    { value: AnswerModeType.DragText, label: t('dragTextLabel'), className: 'h5p-vocabulary-drill-drag-text' },
  ];

  const answerModeAriaLiveText = t('changedAnswerModeAria');
  const languageModeAriaLiveText = getLanguageModeAria(activeLanguageMode, t('changedLanguageModeAria'), sourceLanguageCode, targetLanguageCode);
  const languageModeAria = getLanguageModeAria(activeLanguageMode, t('languageModeAria'), sourceLanguageCode, targetLanguageCode);

  const handleLanguageModeClick = () => {
    onLanguageModeChange();
    setAriaLiveText(languageModeAriaLiveText);
  };

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
              onClick={handleLanguageModeClick}
              disabled={disableTools}
              aria-label={languageModeAria}
            >
              {t('languageModeLabel')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
