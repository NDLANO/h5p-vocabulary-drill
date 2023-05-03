import { LanguageCode, LanguageModeType } from '../types/types';
import { useTranslation } from '../hooks/useTranslation/useTranslation';

export const getLanguageModeAria = (
  languageMode: LanguageModeType,
  sourceLanguageCode: string,
  targetLanguageCode: string
): string => {
  const { t } = useTranslation();
  const ariaLabel = t('languageModeAria');
  const sourceLanguage = t(`lang_${sourceLanguageCode as LanguageCode}`);
  const targetLanguage = t(`lang_${targetLanguageCode as LanguageCode}`);

  switch (languageMode) {
    case LanguageModeType.Source:
      return ariaLabel.replaceAll('@sourceLanguage', sourceLanguage).replaceAll('@targetLanguage', targetLanguage);
    case LanguageModeType.Target:
    default:
      return ariaLabel.replaceAll('@sourceLanguage', targetLanguage).replaceAll('@targetLanguage', sourceLanguage);
  }
};
