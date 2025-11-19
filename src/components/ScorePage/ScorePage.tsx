import { H5P } from 'h5p-utils';
import React, { useEffect, type FC } from 'react';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import { ScoreBar } from '../ScoreBar/ScoreBar';

type ScorePageProps = {
  score: number;
  maxScore: number;
  overallFeedbacks: object[] | undefined;
  onRestart: () => void;
};

export const ScorePage: FC<ScorePageProps> = ({
  score,
  maxScore,
  overallFeedbacks,
  onRestart,
}) => {
  const { t } = useTranslation();
  const focusRef = React.useRef<HTMLDivElement>(null);
  const feedbackText = t('feedbackText');
  const restartText = t('restart');

  // TODO: Why was this not properly typed to begin with?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const overallFeedback = (H5P as any).Question.determineOverallFeedback(overallFeedbacks, score / maxScore);
  const feedback = overallFeedback !== '' ? overallFeedback : feedbackText;

  // Make sure focus is set when page is loaded
  useEffect(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  }, [focusRef.current]);

  return (
    <div ref={focusRef} tabIndex={-1} className="h5p-vocabulary-drill-score-page">
      <h3>{feedback}</h3>
      <ScoreBar
        maxScore={maxScore}
        score={score}
      />
      <button
        className="h5p-joubelui-button h5p-vocabulary-drill-restart"
        onClick={onRestart}
      >
        {restartText}
      </button>
    </div>
  );
};
