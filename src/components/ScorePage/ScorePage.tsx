import { H5P } from 'h5p-utils';
import React, { useEffect, useRef, type FC } from 'react';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import './ScorePage.scss';

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
  const focusRef = useRef<HTMLDivElement>(null);
  const resultScreenRef = useRef<HTMLDivElement>(null);
  const restartButtonRef = useRef<HTMLDivElement>(null);
  const restartText = t('restart');
  const feedbackText = t('feedbackText');
  const scoreTemplate = t('scoreTemplate');

  // @ts-expect-error h5p-types does not support H5P.Components (yet?)
  const resultScreenDOM = H5P.Components.ResultScreen({
    header: feedbackText,
    scoreHeader: scoreTemplate.replace('@score', score.toString()).replace('@total', maxScore.toString()),
    questionGroups: [],
  });

  // @ts-expect-error h5p-types does not support H5P.Components (yet?)
  const restartButtonDOM = H5P.Components.Button({
    class: 'h5p-vocabulary-drill-restart',
    icon: 'retry',
    styleType: 'secondary',
    label: restartText,
    onClick: onRestart,
  });

  // Make sure focus is set when page is loaded
  useEffect(() => {
    focusRef.current?.focus();
  }, []);

  useEffect(() => {
    if (resultScreenRef.current) {
      resultScreenRef.current.replaceChildren(resultScreenDOM);
    }
  }, [resultScreenDOM]);

  useEffect(() => {
    if (restartButtonRef.current) {
      restartButtonRef.current.replaceChildren(restartButtonDOM);
    }
  }, [restartButtonDOM]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const overallFeedback = (H5P as any).Question.determineOverallFeedback(overallFeedbacks, score / maxScore);
  return (
    <div ref={focusRef} tabIndex={-1} className="h5p-vocabulary-drill-score-page">
      <div ref={resultScreenRef} />
      {overallFeedback && <div className="h5p-vocabulary-drill-score-page-feedback-text">{overallFeedback}</div>}
      <div ref={restartButtonRef} />
    </div>
  );
};
