import { H5P } from 'h5p-utils';
import React, { FC } from 'react';
import { ScoreBar } from '../ScoreBar/ScoreBar';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';

type ScorePageProps = {
  score: number;
  maxScore: number;
  overallFeedbacks: {}[] | undefined;
  onRestart: () => void;
};

export const ScorePage: FC<ScorePageProps> = ({
  score,
  maxScore,
  overallFeedbacks,
  onRestart,
}) => {
  const { t } = useTranslation();
  const feedbackText = t('feedbackText');
  const restartText = t('restart');

  const overallFeedback = (H5P as any).Question.determineOverallFeedback(overallFeedbacks, score / maxScore);
  const feedback = overallFeedback !== '' ? overallFeedback : feedbackText;
  return (
    <div className="h5p-vocabulary-drill-score-page">
      <h3>{feedback}</h3>
      <ScoreBar
        maxScore={maxScore}
        score={score}
      />
      <button
        type="button"
        className="h5p-joubelui-button h5p-vocabulary-drill-restart"
        onClick={onRestart}
      >
        {restartText}
      </button>
    </div>
  );
};
