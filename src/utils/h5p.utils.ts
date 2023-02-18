import { Library } from 'h5p-types';
import libraryConfig from '../../library.json';

export const findLibraryInfo = (
  libraryName: string,
):
  | Pick<Library, 'machineName' | 'majorVersion' | 'minorVersion'>
  | undefined => {
  return libraryConfig.preloadedDependencies.find(
    (library) => library.machineName === libraryName,
  );
};

export const libraryToString = ({
  machineName,
  majorVersion,
  minorVersion,
}: Pick<Library, 'machineName' | 'majorVersion' | 'minorVersion'>): string => {
  return `${machineName} ${majorVersion}.${minorVersion}`;
};
