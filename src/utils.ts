import { Library } from "h5p-types";
import { preloadedDependencies } from "../library.json";
import semantics from "../semantics.json";
import {
  sourceAndTargetSeparator,
  tipSeparator,
  variantSeparator,
  wordsSeparator,
} from "./constants/separators";

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

export const parseWords = (
  words: string | undefined,
  answerMode: "fillIn" | "dragText",
  wordMode?: "source" | "target",
): string => {
  if (!words) {
    return "";
  }
  let newWords = "";
  let newWordsList: string[] = [];
  const answerModeFillIn = answerMode === "fillIn";
  const wordModeSource = wordMode === "source";

  const wordsList = words.split(wordsSeparator);
  const sourceAndTargetList = wordsList
    .filter(Boolean)
    .map(word => word.split(sourceAndTargetSeparator));

  if (wordModeSource) {
    newWordsList = sourceAndTargetList.map(sourceAndTarget => {
      const [source, target] = sourceAndTarget;

      const filteredSource = filterOutVariant(source);
      const filteredTarget = filterWord(target);

      if (answerModeFillIn) {
        return `<p>${filteredTarget} *${source}*</p>`;
      }
      return `${filteredTarget} *${filteredSource}*\n`;
    });
  } else {
    newWordsList = sourceAndTargetList.map(sourceAndTarget => {
      const [source, target] = sourceAndTarget;

      const filteredSource = filterWord(source);
      const filteredTarget = filterOutVariant(target);

      if (answerModeFillIn) {
        return `<p>${filteredSource} *${target}*</p>`;
      }
      return `${filteredSource} *${filteredTarget}*\n`;
    });
  }

  newWords = newWordsList.join("");
  return newWords;
};
