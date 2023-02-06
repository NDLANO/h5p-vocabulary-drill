import { filterOutVariant, filterWord, parseWords } from "./utils";

describe("Vocabulary drill utils", () => {
  describe(filterWord.name, () => {
    it("should return empty when empty", () => {
      const word = "";

      const expected = "";
      const actual = filterWord(word);

      expect(actual).toBe(expected);
    });

    it("should return word when it has no variant or tip", () => {
      const word = "shell";

      const expected = "shell";
      const actual = filterWord(word);

      expect(actual).toBe(expected);
    });

    it("should filter out correct word when it has no tip", () => {
      const word = "sheet/paper";

      const expected = "sheet";
      const actual = filterWord(word);

      expect(actual).toBe(expected);
    });

    it("should filter out correct word when it has no variant", () => {
      const word = "fire:f__e";

      const expected = "fire";
      const actual = filterWord(word);

      expect(actual).toBe(expected);
    });

    it("should filter out correct word when it has a tip with character reveal", () => {
      const word = "ocean/sea:o___n";

      const expected = "ocean";
      const actual = filterWord(word);

      expect(actual).toBe(expected);
    });

    it("should filter out correct word when it has a tip with several words", () => {
      const word = "sky:has clouds on it";

      const expected = "sky";
      const actual = filterWord(word);

      expect(actual).toBe(expected);
    });
  });

  describe(filterOutVariant.name, () => {
    it("should return empty when epmty", () => {
      const word = "";

      const expected = "";
      const actual = filterOutVariant(word);

      expect(actual).toBe(expected);
    });

    it("should return word when it has no variant or tip", () => {
      const word = "shell";

      const expected = "shell";
      const actual = filterOutVariant(word);

      expect(actual).toBe(expected);
    });

    it("should return word and tip from word when it has no variant", () => {
      const word = "fire:f__e";

      const expected = "fire:f__e";
      const actual = filterOutVariant(word);

      expect(actual).toBe(expected);
    });

    it("should filter out variant from word when it has no tip", () => {
      const word = "sheet/paper";

      const expected = "sheet";
      const actual = filterOutVariant(word);

      expect(actual).toBe(expected);
    });

    it("should filter out variant from word when it has a tip with character reveal", () => {
      const word = "ocean/sea:o___n";

      const expected = "ocean:o___n";
      const actual = filterOutVariant(word);

      expect(actual).toBe(expected);
    });

    it("should filter out variant from word when it has a tip with several words", () => {
      const word = "ocean/sea:a lot of water";

      const expected = "ocean:a lot of water";
      const actual = filterOutVariant(word);

      expect(actual).toBe(expected);
    });
  });

  describe(parseWords.name, () => {
    it("should return empty string when words are undefined", () => {
      const words = undefined;

      const expected = "";
      const actualFillIn = parseWords(words, "fillIn");
      const actualFillInTarget = parseWords(words, "fillIn", "target");
      const actualDragText = parseWords(words, "dragText");
      const actualDragTextTarget = parseWords(words, "dragText", "target");

      expect(actualFillIn).toBe(expected);
      expect(actualFillInTarget).toBe(expected);
      expect(actualDragText).toBe(expected);
      expect(actualDragTextTarget).toBe(expected);
    });

    it("should return empty string when words are empty", () => {
      const words = "";

      const expected = "";
      const actualFillIn = parseWords(words, "fillIn");
      const actualFillInTarget = parseWords(words, "fillIn", "target");
      const actualDragText = parseWords(words, "dragText");
      const actualDragTextTarget = parseWords(words, "dragText", "target");

      expect(actualFillIn).toBe(expected);
      expect(actualFillInTarget).toBe(expected);
      expect(actualDragText).toBe(expected);
      expect(actualDragTextTarget).toBe(expected);
    });

    it("should parse one word correct (fillIn)", () => {
      const words = "ocean,sjø";

      const expected = "<p>ocean *sjø*</p>";
      const actual = parseWords(words, "fillIn");

      expect(actual).toBe(expected);
    });

    it("should parse one word correct (dragText)", () => {
      const words = "fire,ild";

      const expected = "fire *ild*\n";
      const actual = parseWords(words, "dragText");

      expect(actual).toBe(expected);
    });

    it("should parse one word correct with variant (fillIn)", () => {
      const words = "ocean/sea,sjø/hav";

      const expected = "<p>ocean *sjø/hav*</p>";
      const actual = parseWords(words, "fillIn");

      expect(actual).toBe(expected);
    });

    it("should parse one word correct with variant (dragText)", () => {
      const words = "fire/heat,ild/brann";

      const expected = "fire *ild*\n";
      const actual = parseWords(words, "dragText");

      expect(actual).toBe(expected);
    });

    it("should parse one word correct with variant and tip (fillIn)", () => {
      const words = "ocean/sea:boats go on it,sjø/hav:båter kjører på det";

      const expected = "<p>ocean *sjø/hav:båter kjører på det*</p>";
      const actual = parseWords(words, "fillIn");

      expect(actual).toBe(expected);
    });

    it("should parse one word correct with variant and tip (dragText)", () => {
      const words = "fire/heat:f__e,ild/brann:i_d";

      const expected = "fire *ild:i_d*\n";
      const actual = parseWords(words, "dragText");

      expect(actual).toBe(expected);
    });

    it("should parse several words correct (fillIn)", () => {
      const words = "ocean,sjø\nfire,ild\nsky,himmel";

      const expected = "<p>ocean *sjø*</p><p>fire *ild*</p><p>sky *himmel*</p>";
      const actual = parseWords(words, "fillIn");

      expect(actual).toBe(expected);
    });

    it("should parse several words correct (dragText)", () => {
      const words = "ocean,sjø\nfire,ild\nsky,himmel";

      const expected = "ocean *sjø*\nfire *ild*\nsky *himmel*\n";
      const actual = parseWords(words, "dragText");

      expect(actual).toBe(expected);
    });

    it("should parse several words correct with variants (fillIn)", () => {
      const words =
        "ocean/sea,sjø/hav\nfire/heat,ild/brann\nsky/cloud,himmel/sky";

      const expected =
        "<p>ocean *sjø/hav*</p><p>fire *ild/brann*</p><p>sky *himmel/sky*</p>";
      const actual = parseWords(words, "fillIn");

      expect(actual).toBe(expected);
    });

    it("should parse several words correct with variants (dragText)", () => {
      const words =
        "ocean/sea,sjø/hav\nfire/heat,ild/brann\nsky/cloud,himmel/sky";

      const expected = "ocean *sjø*\nfire *ild*\nsky *himmel*\n";
      const actual = parseWords(words, "dragText");

      expect(actual).toBe(expected);
    });

    it("should parse several words correct with variants and tips (fillIn)", () => {
      const words =
        "ocean/sea:boats go on it,sjø/hav:båter kjører på det\nfire/heat:very varm,ild/brann:veldig varmt\nsky/cloud:above us,himmel/sky:over oss";

      const expected =
        "<p>ocean *sjø/hav:båter kjører på det*</p><p>fire *ild/brann:veldig varmt*</p><p>sky *himmel/sky:over oss*</p>";
      const actual = parseWords(words, "fillIn");

      expect(actual).toBe(expected);
    });

    it("should parse several words correct with variants and tips (dragText)", () => {
      const words =
        "ocean/sea:boats go on it,sjø/hav:båter kjører på det\nfire/heat:very varm,ild/brann:veldig varmt\nsky/cloud:above us,himmel/sky:over oss";

      const expected =
        "ocean *sjø:båter kjører på det*\nfire *ild:veldig varmt*\nsky *himmel:over oss*\n";
      const actual = parseWords(words, "dragText");

      expect(actual).toBe(expected);
    });
  });
});
