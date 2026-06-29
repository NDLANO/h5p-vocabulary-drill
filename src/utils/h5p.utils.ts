import type { H5PEvent, H5PLibrary } from 'h5p-types';
import libraryConfig from '../../library.json';
import { H5PContentType } from 'h5p-utils';
import { decode } from 'he';
import semantics from '../../semantics.json';

type H5PContentTypeExtended = H5PContentType & {
  bubblingUpwards?: boolean;
}

type SemanticsEntry = {
  name?: unknown;
  default?: unknown;
  type?: unknown;
  fields?: SemanticsEntry[];
};

/**
 * Get default values from semantics fields.
 * @param {SemanticsEntry[]} start Start semantics field.
 * @returns {Record<string, unknown>} Default values from semantics.
 */
export const getSemanticsDefaults = (start: SemanticsEntry[] = semantics as SemanticsEntry[]): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};

  if (!Array.isArray(start)) {
    return defaults; // Must be array, root or list
  }

  start.forEach((entry) => {
    if (typeof entry.name !== 'string') {
      return;
    }

    if (typeof entry.default !== 'undefined') {
      defaults[entry.name] = entry.default;
    }
    if (entry.type === 'list') {
      defaults[entry.name] = []; // Does not set defaults within list items!
    }
    else if (entry.type === 'group' && entry.fields) {
      const groupDefaults = getSemanticsDefaults(entry.fields);
      if (Object.keys(groupDefaults).length) {
        defaults[entry.name] = groupDefaults;
      }
    }
  });

  return defaults;
};

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
