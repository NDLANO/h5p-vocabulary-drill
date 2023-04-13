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
  const comboRef = React.useRef<HTMLDivElement>(null);
  const option1Ref = React.useRef<HTMLDivElement>(null);
  const option2Ref = React.useRef<HTMLDivElement>(null);

  const [openMenu, setOpenMenu] = React.useState(false);
  const [currentfocus, setCurrentFocus] = React.useState<HTMLDivElement | null>(null);

  const enableTools = enableAnswerMode || enableLanguageMode;

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
    setCurrentFocus(comboRef.current);
  };

  /* handle onkeyDown */
  const handleOpenMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(event.key);

    const combofocus = currentfocus === comboRef.current;
    const option1focus = currentfocus === option1Ref.current;
    const option2focus = currentfocus === option2Ref.current;


    if (!currentfocus || combofocus) {
      if (event.key === ' ' || event.key === 'Enter') {
        handleOpenMenu();
        return;
      }

      if (openMenu) {
        if (event.key === 'ArrowDown') {
          setCurrentFocus(option1Ref.current);
        }
      }
      return;
    }

    if (option1focus) {
      if (event.key === 'ArrowDown') {
        setCurrentFocus(option2Ref.current);
      }
    }

    if (option2focus) {
      if (event.key === 'ArrowUp') {
        setCurrentFocus(option1Ref.current);
      }
    }

  };

  const handleOptionClick = (mode: AnswerModeType) => {
    if (activeAnswerMode !== mode) {
      onAnswerModeChange();
    }
    setOpenMenu(false);
  };

  const classes = {
    [AnswerModeType.FillIn]: 'h5p-vocabulary-drill-fill-in',
    [AnswerModeType.DragText]: 'h5p-vocabulary-drill-drag-text',
  };

  const activeModeLabel = {
    [AnswerModeType.FillIn]: t('fillInLabel'),
    [AnswerModeType.DragText]: t('dragTextLabel'),
  };

  const answerModes = [
    { value: AnswerModeType.FillIn, label: t('fillInLabel') },
    { value: AnswerModeType.DragText, label: t('dragTextLabel') },
  ];

  const comboClass = `h5p-vocabulary-drill-toolbar-select ${classes[activeAnswerMode]} ${disableTools ? 'disabled' : ''}`;
  console.log(comboClass, answerModes);
  return (
    <div className="h5p-vocabulary-drill-toolbar">
      <p>{title}</p>
      {enableTools && (
        <div className="h5p-vocabulary-drill-toolbar-tools">
          {enableAnswerMode && (
            <div>
              <label id="answer-mode-label1" className="visually-hidden combo-label" htmlFor="answerMode">
                {t('answerModeLabel')}
              </label>
              <div className={`combo ${openMenu ? 'open' : ''}`}>
                <div
                  aria-controls="listbox1"
                  aria-expanded="false"
                  aria-haspopup="listbox"
                  aria-labelledby="answer-mode-label1"
                  id="combo1"
                  className="combo-input"
                  role="combobox"
                  tabIndex={0}
                  aria-activedescendant=""
                  onClick={handleOpenMenu}
                  onKeyDown={handleOpenMenuKeyDown}
                  ref={comboRef}
                >
                  {activeModeLabel[activeAnswerMode]}
                </div>
                <div
                  role="listbox"
                  className="combo-menu"
                  id="answer-mode-listbox1"
                  aria-aria-labelledby="answer-mode-label1"
                  onChange={onAnswerModeChange}
                  tabIndex={-1}
                >
                  <div role="option" ref={option1Ref} id="answer-mode-combo1" className={`combo-option ${currentfocus === option1Ref.current ? "option-current" : ""}`} aria-selected={activeAnswerMode === AnswerModeType.FillIn} onClick={() => handleOptionClick(AnswerModeType.FillIn)}>
                    {t('fillInLabel')}
                  </div>
                  <div role="option" ref={option2Ref} id="answer-mode-combo2" className={`combo-option ${currentfocus === option2Ref.current ? "option-current" : ""}`} aria-selected={activeAnswerMode === AnswerModeType.DragText} onClick={() => handleOptionClick(AnswerModeType.DragText)}>
                    {t('dragTextLabel')}
                  </div>
                </div>
              </div>
            </div>
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
