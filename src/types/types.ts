import type { H5PLibraryInfo, IH5PQuestionType, InferParamsFromSemantics } from 'h5p-types';
import { H5PResumableContentType } from 'h5p-utils';
import semantics from '../../semantics.json';

export enum AnswerModeType {
  FillIn = 'fillIn',
  DragText = 'dragText',
}

export enum LanguageModeType {
  Source = 'source',
  Target = 'target',
}

export type Params = InferParamsFromSemantics<typeof semantics>;
export type TranslationKey = keyof Params['l10n'];
export type LanguageCode = Params['sourceLanguage'];
export type Translations = Record<TranslationKey, string>;

export type BlanksTranslationKey = keyof Params['blanksl10n'];
export type BlanksTranslations = Record<BlanksTranslationKey, string>;

export type DragTextTranslationKey = keyof Params['dragtextl10n'];
export type DragTextTranslations = Record<DragTextTranslationKey, string>;

export type State = {
  activeAnswerMode?: AnswerModeType;
  activeLanguageMode?: LanguageModeType;
  page?: number;
  score?: number;
  wordsOrder?: Array<number>;

  [AnswerModeType.DragText]?: unknown;
  [AnswerModeType.FillIn]?: unknown;
};

export type SubContentType = IH5PQuestionType & H5PResumableContentType &
  { libraryInfo: H5PLibraryInfo };

export type InstanceConnector = {
  resetInstance: () => void;
  getScoreInstance: () => number;
  getMaxScoreInstance: () => number;
};
