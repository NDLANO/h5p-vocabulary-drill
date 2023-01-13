import { Library } from "h5p-types";
import library from "../library.json";

export const isNil = <T>(value: T | null | undefined): value is null | undefined => {
  return value == null;
};

export const findLibraryInfo = (
  libraryName: string,
):
  | Pick<Library, "machineName" | "majorVersion" | "minorVersion">
  | undefined => {
  const { machineName, majorVersion, minorVersion } =
    library.preloadedDependencies.find(
      library => library.machineName === libraryName,
    ) ?? {};
  if (isNil(machineName) || isNil(majorVersion) || isNil(minorVersion)) {
    return undefined;
  }

  return {
    machineName,
    majorVersion,
    minorVersion,
  };
};

export const libraryToString = ({
  machineName,
  majorVersion,
  minorVersion,
}: Pick<Library, "machineName" | "majorVersion" | "minorVersion">): string => {
  return `${machineName} ${majorVersion}.${minorVersion}`;
};
