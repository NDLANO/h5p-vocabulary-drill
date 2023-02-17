import React from "react";

type ToolbarProps = {
  title: string;
  enableSettings: boolean;
  toggleShowSettings: () => void;
};

export const Toolbar: React.FC<ToolbarProps> = ({
  title,
  enableSettings,
  toggleShowSettings,
}) => {
  // TODO: Translate aria-label
  // TODO: Open what? ref aria-label="Open"
  return (
    <div className="h5p-vocabulary-drill-toolbar">
      <p>{title}</p>
      {enableSettings && (
        <button type="button" aria-label="Open" onClick={toggleShowSettings} />
      )}
    </div>
  );
};
