import {
  sourceAndTargetSeparator,
  tipSeparator,
  variantSeparator,
  wordsSeparator,
} from '../constants/separators';
import { AnswerModeType, LanguageModeType, type LanguageCode } from '../types/types';

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
 * Picks a random set of words from the list of words.
 */
export const pickRandomWords = (
  words: Array<string>,
  pageSize: number,
): Array<string> => {
  const randomWords = getRandomWords(words);
  return randomWords.slice(0, pageSize);
};

/**
 * Creates a word string for the H5P.Blanks content type.
 * H5P.Blanks expects the input as an HTML string on the format `source *target*`.
 * A span tag is used to wrap the source word, and add styling to it.
 * In order to show the word on a seperate line, the string can be wrapped in a <p> tag.
 */

const createFillInString = (source: string, target: string, sourceLanguage?: LanguageCode): string => {
  if (!sourceLanguage) {
    return `<span>${source}</span> *${target}*`;
  }
  return `<span lang="${sourceLanguage}">${source}</span> *${target}*`;
};

/**
 * Creates a word string for the H5P.DragText content type.
 * H5P.DragText expects the input as a string on the format `source *target*`.
 * In order to show the word on a seperate line, a newline character '\n' can be added.
 */
const createDragTextString = (source: string, target: string): string => {
  return `${source} *${target}*`;
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
  sourceLanguage?: LanguageCode,
): string => {
  const filteredSource = filterWord(source);
  const filteredTarget = showTips
    ? filterOutVariant(target)
    : filterWord(target);
  const filteredTargetFillIn = showTips ? target : filterOutTip(target);

  if (answerModeFillIn) {
    return createFillInString(filteredSource, filteredTargetFillIn, sourceLanguage);
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
  sourceLanguage?: LanguageCode,
  targetLanguage?: LanguageCode,
): string => {
  const answerModeFillIn = answerMode === AnswerModeType.FillIn;
  const languageModeSource = languageMode === LanguageModeType.Source;

  /*
   * CSV import needs to follow pattern like water/sea:w___r,vann/hav:v__n
   * with optional tips separated by colon and optional word variants
   * separated by forward slash
   */

  // Cannot use `(\w|\d)+`, because of chars like ø or we'd need to use unicode
  const patternWord = `[^\\${variantSeparator}\\${tipSeparator}\\${sourceAndTargetSeparator}]+`;
  const patternVariants = `(\\${variantSeparator}${patternWord})*`;
  const patternTip = '(:[^,\n]+)?';
  const patternSourceOrTarget = `${patternWord}${patternVariants}${patternTip}`;
  const regExpCSV = new RegExp(`^${patternSourceOrTarget}\\${sourceAndTargetSeparator}${patternSourceOrTarget}$`);

  const sourceAndTargetList = wordsList
    .filter(Boolean)
    .filter((word) => regExpCSV.test(word.trim()))
    .map((word) => word.trim().split(sourceAndTargetSeparator));

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
        targetLanguage,
      );
    }

    return createSourceAndTargetString(
      source,
      target,
      showTips,
      answerModeFillIn,
      sourceLanguage,
    );
  });

  const parsedWords = newWordsList.join('');

  if (answerModeFillIn && parsedWords.length > 0) {
    return `<p>${parsedWords}</p>`;
  }

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

  let wordsList = words.split(wordsSeparator)
    .filter((word) => !!word.trim())
    // Remove empty hints
    .map((word) => word.replace(/:,/g, ',').replace(/:$/g, ''));

  if (randomize) {
    wordsList = getRandomWords(wordsList);
  }

  return wordsList;
};
