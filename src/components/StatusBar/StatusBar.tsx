import { H5P } from 'h5p-utils';
import React, { useEffect, useRef, type FC } from 'react';
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

  const nextClassList = 'h5p-theme-next';
  const buttonNextRef = useRef<HTMLDivElement>(null);
  const finishClassList = 'h5p-theme-finish';
  const buttonFinishRef = useRef<HTMLDivElement>(null);
  const showFinishButton = !showNextButton && !scorePage;

  // @ts-expect-error h5p-types does not support H5P.Components (yet?)
  const buttonNext = H5P.Components.Button({
    styleType: 'nav',
    label: nextText,
    icon: 'next',
    classes: disableNextButton ? `${nextClassList}` : `${nextClassList} h5p-disabled`,
    disabled: disableNextButton,
    onClick: onNext,
  });

  // @ts-expect-error h5p-types does not support H5P.Components (yet?)
  const buttonFinish = H5P.Components.Button({
    styleType: 'nav',
    label: finishText,
    icon: 'show-results',
    classes: showFinishButton ? `${finishClassList}` : `${finishClassList} display-none`,
    disabled: disableNextButton,
    onClick: onShowResults,
  });

  useEffect(() => {
    buttonNextRef.current?.replaceChildren(buttonNext);
  }, [buttonNext]);

  useEffect(() => {
    buttonFinishRef.current?.replaceChildren(buttonFinish);
  }, [buttonFinish]);

  return (
    <>
      <ProgressBar page={page} totalPages={totalPages} />
      <div className="h5p-vocabulary-drill-status">
        {score != null && !scorePage ? (
          <div className="h5p-vocabulary-drill-status-score">
            <span className="h5p-vocabulary-drill-status-label" aria-hidden="true">{scoreLabel}: </span>
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
        {showNextButton && <div ref={buttonNextRef} /> }
        {showFinishButton && <div ref={buttonFinishRef} /> }
      </div>
    </>
  );
};
