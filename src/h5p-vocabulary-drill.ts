import type { IH5PContentType } from "h5p-types";
import { H5P, H5PContentType, registerContentType } from "h5p-utils";
import { findLibraryInfo, isNil, libraryToString } from "./utils";

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

    const dragTextLibraryInfo = findLibraryInfo("H5P.DragText");
    const fillInTheBlanksLibraryInfo = findLibraryInfo("H5P.Blanks");

    if (isNil(dragTextLibraryInfo)) {
      throw new Error(
        "H5P.VocabularyDrill: H5P.DragText is missing in the list of preloaded dependencies",
      );
    }

    if (isNil(fillInTheBlanksLibraryInfo)) {
      throw new Error(
        "H5P.VocabularyDrill: H5P.Blanks is missing in the list of preloaded dependencies",
      );
    }

    switch (answerMode) {
      case "dragText": {
        H5P.newRunnable(
          {
            library: libraryToString(dragTextLibraryInfo),
            params: {},
          },
          contentId,
          H5P.jQuery(this.wrapper),
        );

        break;
      }

      case "fillIn":
      default: {
        H5P.newRunnable(
          {
            library: libraryToString(fillInTheBlanksLibraryInfo),
            params: {},
          },
          contentId,
          H5P.jQuery(this.wrapper),
        );

        break;
      }
    }
  }
}

registerContentType("VocabularyDrill", VocabularyDrill);
