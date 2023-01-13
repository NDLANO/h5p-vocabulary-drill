import type { IH5PContentType } from "h5p-types";
import { H5P, H5PContentType, registerContentType } from "h5p-utils";

type Params = {
  answerMode: "fillIn" | "dragText";
  enableSwitchAnswerModeButton: boolean;
};

class VocabularyDrill
  extends H5PContentType<Params>
  implements IH5PContentType<Params>
{
  attach() {
    const { contentId } = this;
    const { answerMode } = this.params;

    const dragTextContentType = (H5P as any).DragText;
    const fillInTheBlanksContentType = (H5P as any).Blanks;

    switch (answerMode) {
      case "dragText": {
        H5P.newRunnable(
          dragTextContentType,
          contentId,
          H5P.jQuery(this.wrapper),
        );

        break;
      }

      case "fillIn":
      default: {
        fillInTheBlanksContentType.params = {};

        H5P.newRunnable(
          fillInTheBlanksContentType,
          contentId,
          H5P.jQuery(this.wrapper),
        );

        break;
      }
    }
  }
}

registerContentType("VocabularyDrill", VocabularyDrill);
