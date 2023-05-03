import React, { FC } from 'react';
import { ScoreBar } from "../ScoreBar/ScoreBar";

type ScorePageProps = {
  score: number;
  maxScore: number;
  onRestart: () => void;
};

export const ScorePage: FC<ScorePageProps> = ({
  score,
  maxScore,
  onRestart,
}) => {
  // TODO: fix label, helpText, and scoreExplanation
  // TODO: translate 'Restart'
  return (
    <div className="h5p-vocabulary-drill-score-page">
      <h2>Great job!</h2>
      <ScoreBar
        maxScore={maxScore}
        score={score}
        label=''
        helpText=''
        scoreExplanation='' />
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
