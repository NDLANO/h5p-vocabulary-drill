import React, { FC } from 'react';

type ProgressBarProps = {
  page: number;
  totalPages: number;
};

export const ProgressBar: FC<ProgressBarProps> = ({
  page, totalPages
}) => {
  const progress = (page / Math.max(1, totalPages)) * 100;
  // TODO: Add a11y support
  return (
    <div className="h5p-vocabulary-drill-progressbar">
      <div
        className="h5p-vocabulary-drill-progressbar-front"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};