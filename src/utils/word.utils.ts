import { Languages } from '../constants/languages';
import {
  sourceAndTargetSeparator,
  tipSeparator,
  variantSeparator,
  wordsSeparator,
} from '../constants/separators';
import { AnswerModeType, LanguageModeType } from '../types/types';

export const findLanguageName = (code: string): string => {
  return Languages.find(lang => lang.code === code)?.name ?? code;
};

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

const createFillInString = (source: string, target: string): string => {
  return `<p>${source} *${target}*</p>`;
};

const createDragTextString = (source: string, target: string): string => {
  return `${source} *${target}*\n`;
};

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
