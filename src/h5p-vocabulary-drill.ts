import type { IH5PContentType } from "h5p-types";
import { H5P, H5PContentType, registerContentType } from "h5p-utils";
import { findLibraryInfo, isNil, libraryToString, parseWords } from "./utils";

type Params = {
  behaviour: {
    answerMode: "fillIn" | "dragText";
    enableSwitchAnswerModeButton: boolean;
  },
  description: string,
  overallFeedback: [],
  words: string
};

class VocabularyDrill
  extends H5PContentType<Params>
  implements IH5PContentType<Params>
{
  attach($container: JQuery<HTMLElement>) {
    const { contentId } = this;
    const { answerMode } = this.params.behaviour;

    const dragTextLibraryInfo = findLibraryInfo("H5P.DragText");
    const fillInTheBlanksLibraryInfo = findLibraryInfo("H5P.Blanks");
    const containerElement = $container.get(0);

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

    if (isNil(containerElement)) {
      throw new Error(
        "H5P.VocabularyDrill: Found no containing element to attach content to.",
      );
    }

    containerElement.appendChild(this.wrapper);

    switch (answerMode) {
      case "dragText": {
        H5P.newRunnable(
          {
            library: libraryToString(dragTextLibraryInfo),
            params: {
              taskDescription: this.params.description,
              textField: parseWords(this.params.words, answerMode),
              behaviour: this.params.behaviour,
              overallFeedback: this.params.overallFeedback
            },
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
            params: {
              text: this.params.description,
              questions: [parseWords(this.params.words, answerMode)],
              behaviour: this.params.behaviour,
              overallFeedback: this.params.overallFeedback
            },
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
