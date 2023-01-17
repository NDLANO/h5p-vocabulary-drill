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

export const parseWords = (
  words: string,
  contentType: "fillIn" | "dragText",
  sourceOrTarget?: "source" | "target"
): string => {
  let newWords = "";
  let newWordsList: string[] = [];
  const fillIn = contentType === "fillIn";
  const source = sourceOrTarget && sourceOrTarget === "source";

  const wordsList = words.split("\n");
  const sourceAndTargetList = wordsList.map(word => word.split("|"));

  if (source) {
    newWordsList = sourceAndTargetList.map(word => {
      const tipsIndex = word[1].indexOf(":");
      const word1 = word[1].substring(0, tipsIndex);
      if (fillIn) {
        return `<p>${word1} *${word[0]}*</p>`
      }
      return `${word1} *${word[0]}*\n`
    });
  } 
  else {
    newWordsList = sourceAndTargetList.map(word => {
      const tipsIndex = word[0].indexOf(":");
      const word0 = word[0].substring(0, tipsIndex);
      if (fillIn) {
        return `<p>${word0} *${word[1]}*</p>`
      }
      return `${word0} *${word[1]}*\n`
    });
  }

  newWords = newWordsList.join("");
  return newWords;
};
