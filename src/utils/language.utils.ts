import { LanguageModeType } from '../types/types';

export const getLanguageModeAria = (
  languageMode: LanguageModeType,
  ariaText: string,
  sourceLanguage: string,
  targetLanguage: string,
): string => {
  switch (languageMode) {
    case LanguageModeType.Source:
      return ariaText.replaceAll('@sourceLanguage', sourceLanguage).replaceAll('@targetLanguage', targetLanguage);
    case LanguageModeType.Target:
    default:
      return ariaText.replaceAll('@sourceLanguage', targetLanguage).replaceAll('@targetLanguage', sourceLanguage);
  }
};
