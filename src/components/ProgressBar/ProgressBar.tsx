import React, { FC } from 'react';

type ProgressBarProps = {
  page: number;
  totalPages: number;
};

export const ProgressBar: FC<ProgressBarProps> = ({
  page, totalPages
}) => {
  const progress = (page / totalPages) * 100;

  return (
    <div className="h5p-vocabulary-drill-progressbar">
      <div
        className="h5p-vocabulary-drill-progressbar-front"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};