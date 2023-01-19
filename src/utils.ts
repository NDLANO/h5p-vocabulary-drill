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
