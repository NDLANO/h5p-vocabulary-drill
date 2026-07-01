import { H5P } from 'h5p-utils';
import React, { useEffect, useRef } from 'react';
import './ProgressBar.scss';

type ProgressBarProps = {
  page: number;
  totalPages: number;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  page, totalPages
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // @ts-expect-error h5p-types does not support H5P.Components (yet?)
  const progressBar = H5P.Components.ProgressBar({
    progressLength: totalPages
  });
  progressBar.updateProgressBar(page - 1);

  useEffect(() => {
    ref.current?.replaceChildren(progressBar);
  }, [progressBar]);

  return (
    <div ref={ref} className="h5p-vocabulary-drill-progressbar" />
  );
};
