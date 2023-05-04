import { H5P } from 'h5p-utils';
import React, { FC, useEffect, useRef } from 'react';

type ScoreBarProps = {
  maxScore: number,
  score: number,
};

export const ScoreBar: FC<ScoreBarProps> = ({
  maxScore,
  score,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const scoreBar = useRef((H5P as any).JoubelUI.createScoreBar(maxScore));
  scoreBar.current.setScore(score);

  useEffect(() => {
    if (ref.current && !ref.current.firstChild) {
      scoreBar.current.appendTo(ref.current);
    }
  }, [ref.current]);

  return (
    <div ref={ref} />
  );
};