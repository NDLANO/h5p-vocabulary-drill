import { H5P } from 'h5p-utils';
import React, { FC } from 'react';
import { ScoreBar } from "../ScoreBar/ScoreBar";

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
  // TODO: fix label, helpText, and scoreExplanation
  // TODO: translate 'Restart'
  const overallFeedback = (H5P as any).Question.determineOverallFeedback(overallFeedbacks, score / maxScore) ?? 'Your score is';
  return (
    <div className="h5p-vocabulary-drill-score-page">
      <h2>{overallFeedback}</h2>
      <ScoreBar
        maxScore={maxScore}
        score={score}
        label=''
        helpText=''
        scoreExplanation=''
      />
      <button
        type="button"
        className="h5p-joubelui-button h5p-vocabulary-drill-restart"
        onClick={onRestart}
      >
        Restart
      </button>
    </div>
  );
};
