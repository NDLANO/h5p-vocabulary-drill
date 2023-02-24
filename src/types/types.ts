import { DeepReadonly, InferParamsFromSemantics } from 'h5p-types';
import semantics from '../../semantics.json';

export enum AnswerModeType {
  FillIn = 'fillIn',
  DragText = 'dragText',
}

export enum LanguageModeType {
  Source = 'source',
  Target = 'target',
}

export type Params = InferParamsFromSemantics<DeepReadonly<typeof semantics>>;
export type TranslationKey = keyof Params['l10n'];

// By using `semantics` we let `unplugin-json-dts` know that we want it to
// generate `semantics.json.d.ts. This is a hack and should be avoided in
// the future.
// TODO: Remove this hack when `unplugin-json-dts` starts generating types
// for JSON files that are imported in type scope.
semantics;
