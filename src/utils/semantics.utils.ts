import { blanksDefaultTranslations, defaultTranslations, dragTextDefaultTranslations } from '../constants/defaultTranslations';
import { AnswerModeType, type Params } from '../types/types';

export const getDefaultParams = (): Required<Params> => {
  /*
   * Setting optional parameters to `undefined` is a workaround to h5p-types in
   * version 5.2.0 that expects all parameters to be defined.
   */
  return {
    description: undefined,
    sourceLanguage: 'en',
    targetLanguage: 'nb',
    overallFeedback: undefined,
    words: undefined,
    l10n: defaultTranslations,
    blanksl10n: blanksDefaultTranslations,
    dragtextl10n: dragTextDefaultTranslations,
    behaviour: {
      enableRetry: true,
      enableSolutionsButton: true,
      autoCheck: false,
      caseSensitive: true,
      showSolutionsRequiresInput: true,
      acceptSpellingErrors: false,
      randomize: false,
      showTips: false,
      answerMode: AnswerModeType.FillIn,
      enableSwitchAnswerModeButton: false,
      enableSwitchWordsButton: false,
      poolSize: undefined,
      numberOfWordsToShow: undefined,
    },
  };
};
