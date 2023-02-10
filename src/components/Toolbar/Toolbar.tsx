import React from "react";

type ToolbarProps = {
  title: string;
  toggleShowSettings: () => void;
};

export const Toolbar: React.FC<ToolbarProps> = ({
  title,
  toggleShowSettings,
}) => {
  return (
    <div className="h5p-vocabulary-drill-toolbar">
      <p>{title}</p>
      <button type="button" aria-label="Open" onClick={toggleShowSettings} />
    </div>
  );
};
