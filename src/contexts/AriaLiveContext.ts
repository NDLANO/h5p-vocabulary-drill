import { createContext } from 'react';

type AriaLiveContext = {
  ariaLiveText: string;
  setAriaLiveText: (str: string) => void;
}

export const AriaLiveContext = createContext<AriaLiveContext>({ 
  ariaLiveText: '',
  setAriaLiveText: () => {},
});
