import type { H5PFieldText, IH5PContentType } from "h5p-types";
import { H5P, H5PContentType, registerContentType } from "h5p-utils";

class VocabularyDrill extends H5PContentType<H5PFieldText> implements IH5PContentType {
  attach($wrapper: JQuery<HTMLElement>) {
    const wrapper = $wrapper.get(0);

    const dragTextContentType = (H5P as any).DragText;
    const fillInTheBlanksContentType = (H5P as any).Blanks;
  }
}

registerContentType("VocabularyDrill", VocabularyDrill);
