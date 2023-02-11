import { useTranslation as useH5PTranslation } from "use-h5p";
import { TranslationKey } from "../../types/types";

export const useTranslation = () => {
  const { t } = useH5PTranslation();

  return {
    t: (key: TranslationKey) => t(key),
  };
};
