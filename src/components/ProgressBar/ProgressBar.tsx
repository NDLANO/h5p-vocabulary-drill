import React, { FC, useEffect, useState } from 'react';

type ProgressBarProps = {
  page: number;
  totalPages: number;
};

export const ProgressBar: FC<ProgressBarProps> = ({ page, totalPages }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress((page / totalPages) * 100);
  }, [page, totalPages]);

  return (
    <div className="h5p-vocabulary-drill-progressbar">
      <div
        className="h5p-vocabulary-drill-progressbar-front"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};