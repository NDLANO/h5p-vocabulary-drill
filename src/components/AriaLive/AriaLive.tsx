import React from 'react';
import { useAriaLive } from '../../hooks/useAriaLive/useAriaLive';

export const AriaLive: React.FC = () => {
  const { ariaLiveText } = useAriaLive();

  return (
    <div aria-live="polite" className="visually-hidden">
      {ariaLiveText}
    </div>
  );
};