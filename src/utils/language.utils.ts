import { LanguageCode, LanguageModeType } from '../types/types';
import { useTranslation } from '../hooks/useTranslation/useTranslation';

export const getLanguageModeAria = (
  languageMode: LanguageModeType,
  ariaText: string,
  sourceLanguageCode: string,
  targetLanguageCode: string
): string => {
  const { t } = useTranslation();
  const sourceLanguage = t(`lang_${sourceLanguageCode as LanguageCode}`);
  const targetLanguage = t(`lang_${targetLanguageCode as LanguageCode}`);

  switch (languageMode) {
    case LanguageModeType.Source:
      return ariaText.replaceAll('@sourceLanguage', sourceLanguage).replaceAll('@targetLanguage', targetLanguage);
    case LanguageModeType.Target:
    default:
      return ariaText.replaceAll('@sourceLanguage', targetLanguage).replaceAll('@targetLanguage', sourceLanguage);
  }
};
