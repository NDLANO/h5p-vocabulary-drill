import { useContext } from 'react';
import { AriaLiveContext } from '../../contexts/AriaLiveContext';

export const useAriaLive = () => {
  return useContext(AriaLiveContext);
};
