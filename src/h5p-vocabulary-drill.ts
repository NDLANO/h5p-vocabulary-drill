import type {
  DeepReadonly,
  IH5PContentType,
  InferParamsFromSemantics,
} from "h5p-types";
import { H5P, H5PContentType, registerContentType } from "h5p-utils";
import { findLibraryInfo, isNil, libraryToString, parseWords } from "./utils";
import semantics from "../semantics.json";
import "./index.css";

type Params = InferParamsFromSemantics<DeepReadonly<typeof semantics>>;

class VocabularyDrill
  extends H5PContentType<Params>
  implements IH5PContentType<Params>
{
  attach($container: JQuery<HTMLElement>) {
    const { contentId } = this;
    const { answerMode } = this.params.behaviour ?? {};

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

    // TODO: translate
    const title = this.extras?.metadata.title ?? "Vocabulary drill";
    const toolbar = VocabularyDrill.createToolbar(title);
    
    containerElement.appendChild(toolbar);
    containerElement.appendChild(this.wrapper);
    containerElement.classList.add("h5p-vocabulary-drill");

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

  private static createToolbar(title: string): HTMLDivElement {
    const nodeTitle = document.createTextNode(title);
    const titleElement = document.createElement("p");
    titleElement.appendChild(nodeTitle);

    const toolbar = document.createElement("div");
    toolbar.classList.add("h5p-vocabulary-drill-toolbar");
    toolbar.appendChild(titleElement);

    const button = document.createElement("button");
    toolbar.appendChild(button);
    return toolbar;
  }
}

registerContentType("VocabularyDrill", VocabularyDrill);
