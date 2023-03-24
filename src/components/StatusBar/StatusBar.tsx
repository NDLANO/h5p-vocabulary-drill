import React, { FC } from 'react';
import { ProgressBar } from '../ProgressBar/ProgressBar';

type StatusBarProps = {
  page: number;
  totalPages: number;
  score: number | null;
  maxScore: number | null;
  showNextButton: boolean;
  disableNextButton: boolean;
  onNext: () => void;
};

export const StatusBar: FC<StatusBarProps> = ({
  page,
  totalPages,
  score,
  maxScore,
  showNextButton,
  disableNextButton,
  onNext
}) => {
  // TODO: Translate "Next"
  return (
    <>
      <ProgressBar page={page} totalPages={totalPages} />
      <div className="h5p-vocabulary-drill-status">
        {score != null ? <div className="h5p-vocabulary-drill-status-score">
          <span>Score: </span>
          <span className="h5p-vocabulary-drill-status-number">{score}</span>
          <span className="h5p-vocabulary-drill-status-divider"> / </span>
          <span className="h5p-vocabulary-drill-status-number">{maxScore}</span>
        </div> : null}
        <div>
          <span className="h5p-vocabulary-drill-status-number">{page}</span>
          <span className="h5p-vocabulary-drill-status-divider"> / </span>
          <span className="h5p-vocabulary-drill-status-number">{totalPages}</span>
        </div>
        {showNextButton ?
          <button
            type="button"
            className="h5p-vocabulary-drill-next"
            onClick={onNext}
            disabled={disableNextButton}
          >
            Next
          </button>
          : null}
      </div>
    </>
  );
};