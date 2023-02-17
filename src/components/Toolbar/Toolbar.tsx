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
  return (
    <div className="h5p-vocabulary-drill-toolbar">
      <p>{title}</p>
      {enableSettings && (
        {/* TODO: Translate */ }
        {/* TODO: Open what? */ }
        <button type="button" aria-label="Open" onClick={toggleShowSettings} />
      )}
    </div>
  );
};
