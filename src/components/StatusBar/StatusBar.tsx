import React, { type FC } from 'react';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import { ProgressBar } from '../ProgressBar/ProgressBar';

type StatusBarProps = {
  page: number;
  totalPages: number;
  score: number | null;
  totalScore: number | null;
  showNextButton: boolean;
  disableNextButton: boolean;
  onNext: () => void;
  onShowResults: () => void;
};

export const StatusBar: FC<StatusBarProps> = ({
  page,
  totalPages,
  score,
  totalScore,
  showNextButton,
  disableNextButton,
  onNext,
  onShowResults,
}) => {
  const { t } = useTranslation();
  const scoreLabel = t('scoreLabel');
  const scoreBarLabel = t('scoreBarLabel').replaceAll('@score', score?.toString() ?? '0').replaceAll('@maxScore', totalScore?.toString() ?? '0');
  const pageNumberLabel = t('pageNumberLabel').replaceAll('@page', page.toString()).replaceAll('@totalPages', totalPages.toString());
  const nextText = t('next');
  const finishText = t('finish');

  const scorePage = page === totalPages;
  return (
    <>
      <ProgressBar page={page} totalPages={totalPages} />
      <div className="h5p-vocabulary-drill-status">
        {score != null && !scorePage ? (
          <div className="h5p-vocabulary-drill-status-score">
            <span aria-hidden="true">{scoreLabel}: </span>
            <span className="h5p-vocabulary-drill-status-number" aria-hidden="true">{score}</span>
            <span className="h5p-vocabulary-drill-status-divider" aria-hidden="true"> / </span>
            <span className="h5p-vocabulary-drill-status-number" aria-hidden="true">{totalScore}</span>
            <p className="visually-hidden">{scoreLabel}: {scoreBarLabel}</p>
          </div>
        ) : null}
        <div className="h5p-vocabulary-drill-status-pages">
          <span className="h5p-vocabulary-drill-status-number" aria-hidden="true">{page}</span>
          <span className="h5p-vocabulary-drill-status-divider" aria-hidden="true"> / </span>
          <span className="h5p-vocabulary-drill-status-number" aria-hidden="true">{totalPages}</span>
          <p className="visually-hidden">{pageNumberLabel}</p>
        </div>
        {showNextButton ?
          <button
            className="h5p-vocabulary-drill-next"
            onClick={onNext}
            disabled={disableNextButton}
          >
            {nextText}
          </button>
          : null}
        {!showNextButton && !scorePage ?
          <button
            className="h5p-vocabulary-drill-next"
            onClick={onShowResults}
            disabled={disableNextButton}
          >
            {finishText}
          </button>
          : null}
      </div>
    </>
  );
};