import { H5P } from 'h5p-utils';
import React, { FC, useEffect } from 'react';

type ScoreBarProps = {
  maxScore: number,
  score: number,
  label: string,
  helpText: string,
  scoreExplanation: string,
};

export const ScoreBar: FC<ScoreBarProps> = ({
  maxScore,
  score,
  label,
  helpText,
  scoreExplanation,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const scoreBar = (H5P as any).JoubelUI.createScoreBar(maxScore, label, helpText, scoreExplanation);
  scoreBar.setScore(score);

  useEffect(() => {
    if (ref.current && !ref.current.firstChild) {
      scoreBar.appendTo(ref.current);
    }
  }, [ref.current]);

  return (
    <div ref={ref} className="h5p-vocabulary-drill-score-bar" />
  );
};