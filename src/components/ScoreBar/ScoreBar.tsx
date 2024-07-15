import { H5P } from 'h5p-utils';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';

type ScoreBarProps = {
  maxScore: number,
  score: number,
};

export const ScoreBar: React.FC<ScoreBarProps> = ({
  maxScore,
  score,
}) => {
  const { t } = useTranslation();
  const scoreBarLabel = t('scoreBarLabel').replaceAll('@score', score.toString()).replaceAll('@maxScore', maxScore.toString());

  const ref = useRef<HTMLDivElement>(null);

  const scoreBar = useRef(H5P.JoubelUI.createScoreBar(maxScore, scoreBarLabel));
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
