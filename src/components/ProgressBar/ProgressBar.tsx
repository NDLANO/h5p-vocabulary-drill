import { H5P } from 'h5p-utils';
import React, { FC, useEffect, useRef } from 'react';

type ProgressBarProps = {
  page: number;
  totalPages: number;
};

export const ProgressBar: FC<ProgressBarProps> = ({
  page, totalPages
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const disableAria = true; // Page progress is also available in StatusBar
  const progressBar = useRef(new H5P.JoubelProgressbar(totalPages, { disableAria }));
  progressBar.current.setProgress(page);

  useEffect(() => {
    if (ref.current && !ref.current.firstChild) {
      progressBar.current.appendTo(ref.current);
    }
  }, [ref.current]);

  return (
    <div ref={ref} className="h5p-vocabulary-drill-progressbar" />
  );
};