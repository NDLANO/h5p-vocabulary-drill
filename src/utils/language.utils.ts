import { Languages } from '../constants/languages';

export const findLanguageName = (code: string): string => {
  return Languages.find((lang) => lang.code === code)?.name ?? code;
};