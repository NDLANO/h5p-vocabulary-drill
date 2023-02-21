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

  return (
    <div className="h5p-vocabulary-drill-toolbar">
      <p>{title}</p>
      {enableSettings && (
        <button type="button" aria-label={showSettings ? t('closeSettingsLabel') : t('openSettingsLabel')} onClick={toggleShowSettings} />
      )}
    </div>
  );
};
