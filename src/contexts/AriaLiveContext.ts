import { createContext } from 'react';

type AriaLiveContext = {
  ariaLiveText: string | null;
  setAriaLiveText: (str: string | null) => void;
}

export const AriaLiveContext = createContext<AriaLiveContext>({ 
  ariaLiveText: null,
  setAriaLiveText: () => {},
});
