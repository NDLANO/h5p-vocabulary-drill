import type { H5PLibrary } from 'h5p-types';
import libraryConfig from '../../library.json';
import { decode } from 'he';

export const findLibraryInfo = (
  libraryName: string,
):
  | Pick<H5PLibrary, 'machineName' | 'majorVersion' | 'minorVersion'>
  | undefined => {
  return libraryConfig.preloadedDependencies.find(
    (library) => library.machineName === libraryName,
  );
};

export const libraryToString = ({
  machineName,
  majorVersion,
  minorVersion,
}: Pick<
  H5PLibrary,
  'machineName' | 'majorVersion' | 'minorVersion'
>): string => {
  return `${machineName} ${majorVersion}.${minorVersion}`;
};

// Required to sanitize H5P text field values will be HTML encoded
export const sanitizeRecord = <TRec extends Record<string, string>>(
  record: TRec,
): TRec => {
  const output = record;
  const entries: [keyof typeof record, string][] = Object.entries(record);

  for (const [key, value] of entries) {
    output[key] = decode(value) as TRec[keyof TRec];
  }

  return output;
};
