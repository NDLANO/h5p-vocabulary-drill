import { Library } from "h5p-types";
import { preloadedDependencies } from "../library.json";
import semantics from "../semantics.json";

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

const filterWord = (word: string): string => {
  const variantIndex = word.indexOf("/");
  const tipsIndex = word.indexOf(":");

  if (variantIndex > 0) {
    return word.substring(0, variantIndex);
  } else if (tipsIndex > 0) {
    return word.substring(0, tipsIndex);
  }
  return word;
};

const filterOutVariant = (word: string): string => {
  const variantIndex = word.indexOf("/");
  const tipsIndex = word.indexOf(":");

  if (variantIndex > 0 && tipsIndex > 0) {
    const toRemove = word.substring(variantIndex, tipsIndex);
    return word.split(toRemove).join("");
  } else if (variantIndex > 0) {
    return word.substring(0, variantIndex);
  }
  return word;
};

export const parseWords = (
  words: string | undefined,
  contentType: "fillIn" | "dragText",
  sourceOrTarget?: "source" | "target",
): string => {
  if (!words) {
    return "";
  }
  let newWords = "";
  let newWordsList: string[] = [];
  const fillIn = contentType === "fillIn";
  const source = sourceOrTarget === "source";

  const wordsList = words.split("\n");
  const sourceAndTargetList = wordsList
    .filter(Boolean)
    .map(word => word.split(","));

  if (source) {
    newWordsList = sourceAndTargetList.map(word => {
      const sourceWord = filterOutVariant(word[0]);
      const targetWord = filterWord(word[1]);
      if (fillIn) {
        return `<p>${targetWord} *${word[0]}*</p>`;
      }
      return `${targetWord} *${sourceWord}*\n`;
    });
  } else {
    newWordsList = sourceAndTargetList.map(word => {
      const sourceWord = filterWord(word[0]);
      const targetWord = filterOutVariant(word[1]);
      if (fillIn) {
        return `<p>${sourceWord} *${word[1]}*</p>`;
      }
      return `${sourceWord} *${targetWord}*\n`;
    });
  }

  newWords = newWordsList.join("");
  return newWords;
};
