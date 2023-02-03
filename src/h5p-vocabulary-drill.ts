import type {
  DeepReadonly,
  IH5PContentType,
  InferParamsFromSemantics,
} from "h5p-types";
import { H5P, H5PContentType, registerContentType } from "h5p-utils";
import { findLibraryInfo, isNil, libraryToString, parseWords } from "./utils";
import semantics from "../semantics.json";
import "./index.scss";
import { blanksClassName, dragTextClassName } from "./constants/classes";
import { AnswerModeType, GuessModeType } from "./types/types";

type Params = InferParamsFromSemantics<DeepReadonly<typeof semantics>>;

class VocabularyDrill
  extends H5PContentType<Params>
  implements IH5PContentType<Params>
{
  static answerMode: AnswerModeType | undefined;
  static guessMode: GuessModeType | undefined;

  attach($container: JQuery<HTMLElement>) {
    const { contentId, wrapper, params } = this;

    const containerElement = $container.get(0);

    if (isNil(containerElement)) {
      throw new Error(
        "H5P.VocabularyDrill: Found no containing element to attach content to.",
      );
    }

    // TODO: translate
    const title = this.extras?.metadata.title ?? "Vocabulary drill";
    const toolbar = VocabularyDrill.createToolbar(
      title,
      () => this.handleAnswerClick(),
      () => this.handleGuessClick(),
    );

    containerElement.appendChild(toolbar);
    containerElement.appendChild(wrapper);
    containerElement.classList.add("h5p-vocabulary-drill");

    VocabularyDrill.addRunnable(wrapper, contentId, params);
  }

  private static createToolbar(
    title: string,
    handleAnswerClick: () => void,
    handleGuessClick: () => void,
  ): HTMLDivElement {
    const nodeTitle = document.createTextNode(title);
    const titleElement = document.createElement("p");
    titleElement.appendChild(nodeTitle);

    const toolbar = document.createElement("div");
    toolbar.classList.add("h5p-vocabulary-drill-toolbar");
    toolbar.appendChild(titleElement);

    const nodeAnswerMode = document.createTextNode("Mode");
    const buttonAnswerModeLabel = document.createElement("p");
    buttonAnswerModeLabel.appendChild(nodeAnswerMode);

    const buttonAnswerMode = document.createElement("button");
    buttonAnswerMode.addEventListener("click", handleAnswerClick);
    buttonAnswerMode.appendChild(buttonAnswerModeLabel);

    const nodeGuessMode = document.createTextNode("Guess");
    const buttonGuessModeLabel = document.createElement("p");
    buttonGuessModeLabel.appendChild(nodeGuessMode);

    const buttonGuessMode = document.createElement("button");
    buttonGuessMode.addEventListener("click", handleGuessClick);
    buttonGuessMode.appendChild(buttonGuessModeLabel);

    toolbar.appendChild(buttonAnswerMode);
    toolbar.appendChild(buttonGuessMode);
    return toolbar;
  }

  private async handleAnswerClick(): Promise<void> {
    const newAnswerMode =
      VocabularyDrill.answerMode === AnswerModeType.FillIn
        ? AnswerModeType.DragText
        : AnswerModeType.FillIn;

    VocabularyDrill.removeRunnable(this.wrapper);
    VocabularyDrill.addRunnable(
      this.wrapper,
      this.contentId,
      this.params,
      newAnswerMode,
    );
  }

  private async handleGuessClick(): Promise<void> {
    const newGuessMode =
      VocabularyDrill.guessMode === GuessModeType.Target
        ? GuessModeType.Source
        : GuessModeType.Target;

    VocabularyDrill.removeRunnable(this.wrapper);
    VocabularyDrill.addRunnable(
      this.wrapper,
      this.contentId,
      this.params,
      VocabularyDrill.answerMode,
      newGuessMode,
    );
  }

  private static addRunnable(
    wrapper: HTMLElement,
    contentId: string,
    params: Params,
    chosenAnswerMode?: AnswerModeType,
    chosenGuessMode?: GuessModeType,
  ): void {
    const { behaviour, description, words, overallFeedback } = params;
    const initialAnswerMode = behaviour.answerMode as AnswerModeType;

    this.answerMode = chosenAnswerMode ?? initialAnswerMode;
    this.guessMode = chosenGuessMode ?? GuessModeType.Target;

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

    switch (this.answerMode) {
      case AnswerModeType.DragText: {
        H5P.newRunnable(
          {
            library: libraryToString(dragTextLibraryInfo),
            params: {
              taskDescription: description,
              textField: parseWords(words, this.answerMode, this.guessMode),
              behaviour,
              overallFeedback,
            },
          },
          contentId,
          H5P.jQuery(wrapper),
        );

        break;
      }

      case AnswerModeType.FillIn: {
        H5P.newRunnable(
          {
            library: libraryToString(fillInTheBlanksLibraryInfo),
            params: {
              text: description,
              questions: [parseWords(words, this.answerMode, this.guessMode)],
              behaviour,
              overallFeedback,
            },
          },
          contentId,
          H5P.jQuery(wrapper),
        );

        break;
      }
    }
  }

  private static removeRunnable(wrapper: HTMLElement): void {
    wrapper.replaceChildren();

    if (this.answerMode === AnswerModeType.FillIn) {
      wrapper.classList.remove(blanksClassName);
    }
    if (this.answerMode === AnswerModeType.DragText) {
      wrapper.classList.remove(dragTextClassName);
    }
  }
}

registerContentType("VocabularyDrill", VocabularyDrill);
