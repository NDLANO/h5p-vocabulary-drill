import { Library } from "h5p-types";
import { preloadedDependencies } from "../library.json";
import semantics from "../semantics.json";
import {
  sourceAndTargetSeparator,
  tipSeparator,
  variantSeparator,
  wordsSeparator,
} from "./constants/separators";
import { AnswerModeType, LanguageModeType } from "./types/types";

export const isNil = <T>(
  value: T | null | undefined,
): value is null | undefined => {
  return value == null;
};

export const findLibraryInfo = (
  libraryName: string,
):
  | Pick<Library, "machineName" | "majorVersion" | "minorVersion">
  | undefined => {
  return preloadedDependencies.find(
    library => library.machineName === libraryName,
  );
};

export const libraryToString = ({
  machineName,
  majorVersion,
  minorVersion,
}: Pick<Library, "machineName" | "majorVersion" | "minorVersion">): string => {
  return `${machineName} ${majorVersion}.${minorVersion}`;
};

// By using `semantics` we let `unplugin-json-dts` know that we want it to
// generate `semantics.json.d.ts. This is a hack and should be avoided in
// the future.
() => semantics;

export const filterWord = (wordsAndTip: string): string => {
  const [wordAndVariant, _tip] = wordsAndTip.split(tipSeparator);
  const [word, _variant] = wordAndVariant.split(variantSeparator);

  return word;
};

export const filterOutTip = (wordsAndTip: string): string => {
  const [wordAndVariant, _tip] = wordsAndTip.split(tipSeparator);

  return wordAndVariant;
};

export const filterOutVariant = (wordsAndTip: string): string => {
  const [wordAndVariant, tip] = wordsAndTip.split(tipSeparator);
  const [word, variant] = wordAndVariant.split(variantSeparator);

  const hasVariant = !!variant;
  const hasTip = !!tip;

  if (hasVariant && hasTip) {
    return [word, tip].join(tipSeparator);
  }

  if (hasVariant) {
    return word;
  }

  return wordsAndTip;
};

export const getRandomWords = (wordsList: string[]): string[] => {
  return wordsList.concat().sort(() => 0.5 - Math.random());
};

export const getNumberOfWords = (
  wordsList: string[],
  numberOfWordsToGet: number,
): string[] => {
  return wordsList.concat().slice(0, numberOfWordsToGet);
};

export const createFillInString = (source: string, target: string): string => {
  return `<p>${source} *${target}*</p>`;
};

export const createDragTextString = (
  source: string,
  target: string,
): string => {
  return `${source} *${target}*\n`;
};

export const parseWords = (
  words: string | undefined,
  randomize: boolean,
  showTips: boolean,
  numberOfWordsToShow: number | undefined,
  answerMode: AnswerModeType,
  languageMode?: LanguageModeType,
): string => {
  if (!words) {
    return "";
  }
  let newWords = "";
  let newWordsList: string[] = [];
  let wordsList = words.split(wordsSeparator);
  const validNumberOfWords =
    numberOfWordsToShow &&
    numberOfWordsToShow > 0 &&
    numberOfWordsToShow <= wordsList.length;

  if (randomize) {
    wordsList = getRandomWords(wordsList);
  }

  if (validNumberOfWords) {
    wordsList = getNumberOfWords(wordsList, numberOfWordsToShow);
  }

  newWordsList = parseSourceAndTarget(
    wordsList,
    showTips,
    answerMode,
    languageMode,
  );

  newWords = newWordsList.join("");
  return newWords;
};

export const parseSourceAndTarget = (
  wordsList: string[],
  showTips: boolean,
  answerMode: AnswerModeType,
  languageMode?: LanguageModeType,
): string[] => {
  let newWordsList: string[] = [];
  const answerModeFillIn = answerMode === AnswerModeType.FillIn;
  const languageModeSource = languageMode === LanguageModeType.Source;

  const sourceAndTargetList = wordsList
    .filter(Boolean)
    .map(word => word.split(sourceAndTargetSeparator));

  newWordsList = sourceAndTargetList.map(sourceAndTarget => {
    const [source, target] = sourceAndTarget;

    if (languageModeSource) {
      return createSourceAndTargetString(
        target,
        source,
        showTips,
        answerModeFillIn,
      );
    }

    return createSourceAndTargetString(
      source,
      target,
      showTips,
      answerModeFillIn,
    );
  });

  return newWordsList;
};

export const createSourceAndTargetString = (
  source: string,
  target: string,
  showTips: boolean,
  answerModeFillIn: boolean,
): string => {
  const filteredSource = filterWord(source);
  const filteredTarget = showTips
    ? filterOutVariant(target)
    : filterWord(target);
  const filteredTargetFillIn = showTips ? target : filterOutTip(target);

  if (answerModeFillIn) {
    return createFillInString(filteredSource, filteredTargetFillIn);
  }

  return createDragTextString(filteredSource, filteredTarget);
};
