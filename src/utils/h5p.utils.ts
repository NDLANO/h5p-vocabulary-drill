import type { H5PEvent, H5PLibrary } from 'h5p-types';
import libraryConfig from '../../library.json';
import { H5PContentType } from 'h5p-utils';
import { decode } from 'he';

type H5PContentTypeExtended = H5PContentType & {
  bubblingUpwards?: boolean;
}

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

// Bubble H5PEvents up to main H5P instance.
export const bubbleUp = (
  origin: H5PContentType,
  eventName: string,
  target: H5PContentTypeExtended
) => {
  origin.on(eventName, (event: H5PEvent) => {
    // Prevent target from sending event back down
    target.bubblingUpwards = true;

    // Trigger event
    target.trigger(eventName, event);

    // Reset
    target.bubblingUpwards = false;
  });
};

// Bubble H5PEvents down from main H5P instance.
export const bubbleDown = (
  origin: H5PContentTypeExtended,
  eventName: string, targets:
  Array<H5PContentType>
) => {
  origin.on(eventName, (event: H5PEvent) => {
    if (origin.bubblingUpwards) {
      return; // Prevent send event back down.
    }

    targets.forEach((target) => {
      target.trigger(eventName, event);
    });
  });
};
