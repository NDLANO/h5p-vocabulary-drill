import { AnswerModeType, LanguageModeType } from '../types/types';
import {
  filterOutVariant,
  filterWord,
  parseSourceAndTarget,
  pickWords,
  parseWords,
} from './word.utils';

describe('Vocabulary drill utils', () => {
  describe(filterWord.name, () => {
    it('should return empty when empty', () => {
      const word = '';

      const expected = '';
      const actual = filterWord(word);

      expect(actual).toBe(expected);
    });

    it('should return word when it has no variant or tip', () => {
      const word = 'shell';

      const expected = 'shell';
      const actual = filterWord(word);

      expect(actual).toBe(expected);
    });

    it('should filter out correct word when it has no tip', () => {
      const word = 'sheet/paper';

      const expected = 'sheet';
      const actual = filterWord(word);

      expect(actual).toBe(expected);
    });

    it('should filter out correct word when it has no variant', () => {
      const word = 'fire:f__e';

      const expected = 'fire';
      const actual = filterWord(word);

      expect(actual).toBe(expected);
    });

    it('should filter out correct word when it has a tip with character reveal', () => {
      const word = 'ocean/sea:o___n';

      const expected = 'ocean';
      const actual = filterWord(word);

      expect(actual).toBe(expected);
    });

    it('should filter out correct word when it has a tip with several words', () => {
      const word = 'sky:has clouds on it';

      const expected = 'sky';
      const actual = filterWord(word);

      expect(actual).toBe(expected);
    });
  });

  describe(filterOutVariant.name, () => {
    it('should return empty when epmty', () => {
      const word = '';

      const expected = '';
      const actual = filterOutVariant(word);

      expect(actual).toBe(expected);
    });

    it('should return word when it has no variant or tip', () => {
      const word = 'shell';

      const expected = 'shell';
      const actual = filterOutVariant(word);

      expect(actual).toBe(expected);
    });

    it('should return word and tip from word when it has no variant', () => {
      const word = 'fire:f__e';

      const expected = 'fire:f__e';
      const actual = filterOutVariant(word);

      expect(actual).toBe(expected);
    });

    it('should filter out variant from word when it has no tip', () => {
      const word = 'sheet/paper';

      const expected = 'sheet';
      const actual = filterOutVariant(word);

      expect(actual).toBe(expected);
    });

    it('should filter out variant from word when it has a tip with character reveal', () => {
      const word = 'ocean/sea:o___n';

      const expected = 'ocean:o___n';
      const actual = filterOutVariant(word);

      expect(actual).toBe(expected);
    });

    it('should filter out variant from word when it has a tip with several words', () => {
      const word = 'ocean/sea:a lot of water';

      const expected = 'ocean:a lot of water';
      const actual = filterOutVariant(word);

      expect(actual).toBe(expected);
    });
  });

  describe(parseSourceAndTarget.name, () => {
    it('should return empty string when words are undefined', () => {
      const words: string[] = [];
      const showTips = true;

      const expected = '';
      const actualFillIn = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.FillIn,
      );
      const actualFillInTarget = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.FillIn,
        LanguageModeType.Target,
      );
      const actualDragText = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.DragText,
      );
      const actualDragTextTarget = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.DragText,
        LanguageModeType.Target,
      );

      expect(actualFillIn).toBe(expected);
      expect(actualFillInTarget).toBe(expected);
      expect(actualDragText).toBe(expected);
      expect(actualDragTextTarget).toBe(expected);
    });

    it('should return empty string when words are empty', () => {
      const words: string[] = [];
      const showTips = true;

      const expected = '';
      const actualFillIn = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.FillIn,
      );
      const actualFillInTarget = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.FillIn,
        LanguageModeType.Target,
      );
      const actualDragText = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.DragText,
      );
      const actualDragTextTarget = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.DragText,
        LanguageModeType.Target,
      );

      expect(actualFillIn).toBe(expected);
      expect(actualFillInTarget).toBe(expected);
      expect(actualDragText).toBe(expected);
      expect(actualDragTextTarget).toBe(expected);
    });

    it('should parse one word correct (fillIn)', () => {
      const words = ['ocean,sjø'];
      const showTips = true;

      const expected = '<p><span>ocean</span> *sjø*</p>';
      const actual = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.FillIn,
      );

      expect(actual).toBe(expected);
    });

    it('should parse one word correct (dragText)', () => {
      const words = ['fire,ild'];
      const showTips = true;

      const expected = 'fire *ild*';
      const actual = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.DragText,
      );

      expect(actual).toBe(expected);
    });

    it('should parse one word correct with variant (fillIn)', () => {
      const words = ['ocean/sea,sjø/hav'];
      const showTips = true;

      const expected = '<p><span>ocean</span> *sjø/hav*</p>';
      const actual = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.FillIn,
      );

      expect(actual).toBe(expected);
    });

    it('should parse one word correct with variant (dragText)', () => {
      const words = ['fire/heat,ild/brann'];
      const showTips = true;

      const expected = 'fire *ild*';
      const actual = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.DragText,
      );

      expect(actual).toBe(expected);
    });

    it('should parse one word correct with variant and tip (fillIn)', () => {
      const words = ['ocean/sea:boats go on it,sjø/hav:båter kjører på det'];
      const showTips = true;

      const expected = '<p><span>ocean</span> *sjø/hav:båter kjører på det*</p>';
      const actual = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.FillIn
      );

      expect(actual).toBe(expected);
    });

    it('should parse one word correct with variant and tip (dragText)', () => {
      const words = ['fire/heat:f__e,ild/brann:i_d'];
      const showTips = true;

      const expected = 'fire *ild:i_d*';
      const actual = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.DragText
      );

      expect(actual).toBe(expected);
    });

    it('should parse several words correct (fillIn)', () => {
      const words = ['ocean,sjø', 'fire,ild', 'sky,himmel'];
      const showTips = true;

      const expected = '<p><span>ocean</span> *sjø*<span>fire</span> *ild*<span>sky</span> *himmel*</p>';
      const actual = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.FillIn
      );

      expect(actual).toBe(expected);
    });

    it('should parse several words correct (dragText)', () => {
      const words = ['ocean,sjø', 'fire,ild', 'sky,himmel'];
      const showTips = true;

      const expected = 'ocean *sjø*fire *ild*sky *himmel*';
      const actual = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.DragText,
      );

      expect(actual).toBe(expected);
    });

    it('should parse several words correct with variants (fillIn)', () => {
      const words =
        ['ocean/sea,sjø/hav', 'fire/heat,ild/brann', 'sky/cloud,himmel/sky'];
      const showTips = true;

      const expected =
        '<p><span>ocean</span> *sjø/hav*<span>fire</span> *ild/brann*<span>sky</span> *himmel/sky*</p>';
      const actual = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.FillIn,
      );

      expect(actual).toBe(expected);
    });

    it('should parse several words correct with variants (dragText)', () => {
      const words =
        ['ocean/sea,sjø/hav', 'fire/heat,ild/brann', 'sky/cloud,himmel/sky'];
      const showTips = true;

      const expected = 'ocean *sjø*fire *ild*sky *himmel*';
      const actual = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.DragText,
      );

      expect(actual).toBe(expected);
    });

    it('should parse several words correct with variants and tips (fillIn)', () => {
      const words =
        ['ocean/sea:boats go on it,sjø/hav:båter kjører på det', 'fire/heat:very varm,ild/brann:veldig varmt', 'sky/cloud:above us,himmel/sky:over oss'];
      const showTips = true;

      const expected =
        '<p><span>ocean</span> *sjø/hav:båter kjører på det*<span>fire</span> *ild/brann:veldig varmt*<span>sky</span> *himmel/sky:over oss*</p>';
      const actual = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.FillIn,
      );

      expect(actual).toBe(expected);
    });

    it('should parse several words correct with variants and tips (dragText)', () => {
      const words =
        ['ocean/sea:boats go on it,sjø/hav:båter kjører på det', 'fire/heat:very varm,ild/brann:veldig varmt', 'sky/cloud:above us,himmel/sky:over oss'];
      const showTips = true;

      const expected =
        'ocean *sjø:båter kjører på det*fire *ild:veldig varmt*sky *himmel:over oss*';
      const actual = parseSourceAndTarget(
        words,
        showTips,
        AnswerModeType.DragText,
      );

      expect(actual).toBe(expected);
    });
  });

  describe(pickWords.name, () => {
    it('should page a list of strings with zero indexed page', () => {
      const page = 1;
      const pageSize = 2;
      const words = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

      const expected = ['c', 'd'];
      const actual = pickWords(words, page, pageSize);

      expect(actual).toEqual(expected);
    });

    it('should handle page sizes greater than the number of remaining elements', () => {
      const page = 1;
      const pageSize = 8;
      const words = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

      const expected = ['i', 'j'];
      const actual = pickWords(words, page, pageSize);

      expect(actual).toEqual(expected);
    });

    it('should handle page indexes greater than the number of pages', () => {
      const page = 100;
      const pageSize = 2;
      const words = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

      const expected: Array<string> = [];
      const actual = pickWords(words, page, pageSize);

      expect(actual).toEqual(expected);
    });
  });

  describe(parseWords.name, () => {
    it('should remove empty hints from words', () => {
      const words = 'ocean/sea:,sjø/hav:båter kjører på det\nfire/heat:very varm,ild/brann:';

      const expected = ['ocean/sea,sjø/hav:båter kjører på det', 'fire/heat:very varm,ild/brann'];
      const actual = parseWords(words, false);

      expect(actual).toEqual(expected);
    });

    it('should remove words not matching the pattern, e.g. missing source or target', () => {
      const words = 'ocean/sea\n,ild/brann';

      const expected: string[] = [];
      const actual = parseWords(words, false);

      expect(actual).toEqual(expected);
    });
  });
});
