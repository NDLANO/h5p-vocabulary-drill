import { DeepReadonly, InferParamsFromSemantics } from "h5p-types";
import semantics from "../../semantics.json";

export enum AnswerModeType {
  FillIn = "fillIn",
  DragText = "dragText",
}

export enum LanguageModeType {
  Source = "source",
  Target = "target",
}

export type Params = InferParamsFromSemantics<DeepReadonly<typeof semantics>>;
export type TranslationKey = keyof Params["l10n"];
