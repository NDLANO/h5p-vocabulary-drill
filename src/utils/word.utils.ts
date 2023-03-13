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

const getNumberOfWords = (
  wordsList: string[],
  numberOfWordsToGet: number,
): string[] => {
  return wordsList.concat().slice(0, numberOfWordsToGet);
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
 * Separates the source and target from a list of words, and based on the 
 * user's settings returns the words as a string that can be used by the 
 * chosen H5P content type (defined by answerMode).
 */
const parseSourceAndTarget = (
  wordsList: string[],
  showTips: boolean,
  answerMode: AnswerModeType,
  languageMode?: LanguageModeType,
): string[] => {
  const answerModeFillIn = answerMode === AnswerModeType.FillIn;
  const languageModeSource = languageMode === LanguageModeType.Source;

  const sourceAndTargetList = wordsList
    .filter(Boolean)
    .map((word) => word.split(sourceAndTargetSeparator));

  const newWordsList = sourceAndTargetList.map((sourceAndTarget) => {
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

/** 
 * Takes in a string of words, validates and parses the words based on 
 * the user's settings, and returns the parsed words as a string.
 */
export const parseWords = (
  words: string | undefined,
  randomize: boolean,
  showTips: boolean,
  numberOfWordsToShow: number | undefined,
  answerMode: AnswerModeType,
  languageMode?: LanguageModeType,
): string => {
  if (!words) {
    return '';
  }

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

  const newWordsList = parseSourceAndTarget(
    wordsList,
    showTips,
    answerMode,
    languageMode,
  );

  const parsedWords = newWordsList.join('');

  return parsedWords;
};
