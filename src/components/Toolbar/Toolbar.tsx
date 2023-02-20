import React from 'react';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';

type ToolbarProps = {
  title: string;
  enableSettings: boolean;
  showSettings: boolean;
  toggleShowSettings: () => void;
};

export const Toolbar: React.FC<ToolbarProps> = ({
  title,
  enableSettings,
  showSettings,
  toggleShowSettings,
}) => {
  const { t } = useTranslation();

  const openSettingsLabel = t('openSettingsAriaLabel');
  const closeSettingsLabel = t('closeSettingsAriaLabel');

  return (
    <div className="h5p-vocabulary-drill-toolbar">
      <p>{title}</p>
      {enableSettings && (
        <button type="button" aria-label={showSettings ? closeSettingsLabel : openSettingsLabel} onClick={toggleShowSettings} />
      )}
    </div>
  );
};
