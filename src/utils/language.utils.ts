import { LanguageCode, LanguageModeType } from '../types/types';
import { useTranslation } from '../hooks/useTranslation/useTranslation';

export const getLanguageModeAria = (
  languageMode: LanguageModeType,
  ariaText: string,
  sourceLanguageCode: LanguageCode,
  targetLanguageCode: LanguageCode,
): string => {
  const { t } = useTranslation();
  const sourceLanguage = t(`lang_${sourceLanguageCode}`);
  const targetLanguage = t(`lang_${targetLanguageCode}`);

  switch (languageMode) {
    case LanguageModeType.Source:
      return ariaText.replaceAll('@sourceLanguage', sourceLanguage).replaceAll('@targetLanguage', targetLanguage);
    case LanguageModeType.Target:
    default:
      return ariaText.replaceAll('@sourceLanguage', targetLanguage).replaceAll('@targetLanguage', sourceLanguage);
  }
};
