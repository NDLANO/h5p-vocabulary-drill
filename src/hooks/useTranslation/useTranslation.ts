import { useTranslation as useH5PTranslation } from 'use-h5p';
import type { TranslationKey } from '../../types/types';

export const useTranslation = () => {
  const { t } = useH5PTranslation();

  return {
    ...useH5PTranslation,
    t: (key: TranslationKey) => t(key),
  };
};
