import {
  sourceAndTargetSeparator,
  tipSeparator,
  variantSeparator,
  wordsSeparator,
} from '../constants/separators';
import { AnswerModeType, LanguageModeType } from '../types/types';

export const filterWord = (wordsAndTip: string): string => {
  const [wordAndVariant, _tip] = wordsAndTip.split(tipSeparator);
  const [word, _variant] = wordAndVariant.split(variantSeparator);

  return word;
};

const filterOutTip = (wordsAndTip: string): string => {
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

const getRandomWords = (wordsList: string[]): string[] => {
  return wordsList.concat().sort(() => 0.5 - Math.random());
};

export const pickWords = (
  words: Array<string>,
  page: number,
  pageSize: number,
): Array<string> => {
  return words.slice(page * pageSize, pageSize + page * pageSize);
};

/**
 * Creates a word string for the H5P.Blanks content type.
 * H5P.Blanks expects the input as an HTML string on the format `source *target*`.
 * In order to show the word on a seperate line, we wrap the string in a <p> tag.
 */
const createFillInString = (source: string, target: string): string => {
  return `<p>${source} *${target}*</p>`;
};

/**
 * Creates a word string for the H5P.DragText content type.
 * H5P.DragText expects the input as a string on the format `source *target*`.
 * In order to show the word on a seperate line, we add a newline character.
 */
const createDragTextString = (source: string, target: string): string => {
  return `${source} *${target}*\n`;
};

/**
 * Filters the source and target word and creates a word string for the chosen
 * H5P content type (defined by answerMode) using createFillInString or
 * createDragTextString.
 */
const createSourceAndTargetString = (
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

/**
 * Trim every word and variant in either source or target string.
 */
const trimWordAndVariants = (sourceOrTarget: string): string => {
  const segments = sourceOrTarget.split(tipSeparator);

  segments[0] = segments[0]
    .split(variantSeparator)
    .map((word) => word.trim())
    .join(variantSeparator);

  return segments.join(tipSeparator);
};

/**
 * Separates the source and target from a list of words, and based on the
 * user's settings returns the words as a string that can be used by the
 * chosen H5P content type (defined by answerMode).
 */
export const parseSourceAndTarget = (
  wordsList: string[],
  showTips: boolean,
  answerMode: AnswerModeType,
  languageMode?: LanguageModeType,
): string => {
  const answerModeFillIn = answerMode === AnswerModeType.FillIn;
  const languageModeSource = languageMode === LanguageModeType.Source;

  const sourceAndTargetList = wordsList
    .filter(Boolean)
    .map((word) => word.split(sourceAndTargetSeparator));

  const newWordsList = sourceAndTargetList.map((sourceAndTarget) => {
    let [source, target] = sourceAndTarget;
    source = trimWordAndVariants(source);
    target = trimWordAndVariants(target);

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

  const parsedWords = newWordsList.join('');

  return parsedWords;
};

/**
 * Takes in a string of words, validates and parses the words based on
 * the user's settings, and returns the parsed words as a string.
 */
export const parseWords = (
  words: string | undefined,
  randomize: boolean,
): string[] => {
  if (!words) {
    return [];
  }

  let wordsList = words.split(wordsSeparator);

  if (randomize) {
    wordsList = getRandomWords(wordsList);
  }

  return wordsList;
};
