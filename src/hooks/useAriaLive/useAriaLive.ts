export const useAriaLive = (ariaLiveText: string): void => {
  const ariaLiveElement = document.querySelector('#h5p-vocabulary-drill-aria-live');

  if (ariaLiveElement) {
    ariaLiveElement.textContent = ariaLiveText;
  }
};
