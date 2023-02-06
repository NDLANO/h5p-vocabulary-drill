import type {
  DeepReadonly,
  IH5PContentType,
  InferParamsFromSemantics,
} from "h5p-types";
import { H5P, H5PContentType, registerContentType } from "h5p-utils";
import { findLibraryInfo, isNil, libraryToString, parseWords } from "./utils";
import semantics from "../semantics.json";
import "./index.scss";
import { AnswerModeType, LanguageModeType } from "./types/types";

type Params = InferParamsFromSemantics<DeepReadonly<typeof semantics>>;

class VocabularyDrill
  extends H5PContentType<Params>
  implements IH5PContentType<Params>
{
  private static activeAnswerMode: AnswerModeType | undefined;
  private static activeLanguageMode: LanguageModeType | undefined;

  attach($container: JQuery<HTMLElement>) {
    const { contentId, wrapper, params } = this;
    const { enableSwitchAnswerModeButton, enableSwitchWordsButton } =
      params.behaviour;

    const enableSettings =
      enableSwitchAnswerModeButton || enableSwitchWordsButton;

    const containerElement = $container.get(0);

    if (isNil(containerElement)) {
      throw new Error(
        "H5P.VocabularyDrill: Found no containing element to attach content to.",
      );
    }

    // TODO: translate
    const title = this.extras?.metadata.title ?? "Vocabulary drill";

    let settings: HTMLDivElement | undefined;

    if (enableSettings) {
      settings = VocabularyDrill.createSettings(
        () => this.handleAnswerModeChange(),
        () => this.handleLanguageModeChange(),
        enableSwitchAnswerModeButton,
        enableSwitchWordsButton,
      );

      containerElement.appendChild(settings);
    }

    const toolbar = VocabularyDrill.createToolbar(title, settings);

    containerElement.appendChild(toolbar);
    containerElement.appendChild(wrapper);
    containerElement.classList.add("h5p-vocabulary-drill");

    VocabularyDrill.addRunnable(wrapper, contentId, params);
  }

  private static createToolbar(
    title: string,
    settingsDiv: HTMLDivElement | undefined,
  ): HTMLDivElement {
    const nodeTitle = document.createTextNode(title);
    const titleElement = document.createElement("p");
    titleElement.appendChild(nodeTitle);

    const toolbar = document.createElement("div");
    toolbar.classList.add("h5p-vocabulary-drill-toolbar");
    toolbar.appendChild(titleElement);

    if (settingsDiv) {
      const button = document.createElement("button");
      button.addEventListener("click", () =>
        settingsDiv.classList.toggle("visible"),
      );

      toolbar.appendChild(button);
    }

    return toolbar;
  }

  private static createSettings(
    handleAnswerModeChange: () => void,
    handleLanguageModeChange: () => void,
    enableAnswerMode: boolean,
    enableLanguageMode: boolean,
  ): HTMLDivElement {
    const settings = document.createElement("div");
    settings.classList.add("h5p-vocabulary-drill-settings");

    const buttonClose = document.createElement("button");
    buttonClose.addEventListener("click", () =>
      settings.classList.toggle("visible"),
    );

    const top = document.createElement("div");
    top.classList.add("h5p-vocabulary-drill-settings-top");
    top.appendChild(buttonClose);

    const container = document.createElement("div");
    container.classList.add("h5p-vocabulary-drill-settings-container");

    if (enableAnswerMode) {
      // TODO: translate
      const nodeAnswerMode = document.createTextNode("Change answer mode");
      const buttonAnswerModeLabel = document.createElement("p");
      buttonAnswerModeLabel.appendChild(nodeAnswerMode);

      const buttonAnswerMode = document.createElement("button");
      buttonAnswerMode.addEventListener("click", handleAnswerModeChange);
      buttonAnswerMode.addEventListener("click", () =>
        settings.classList.toggle("visible"),
      );
      buttonAnswerMode.appendChild(buttonAnswerModeLabel);

      container.appendChild(buttonAnswerMode);
    }

    if (enableLanguageMode) {
      // TODO: translate
      const nodeLanguageMode = document.createTextNode("Change language");
      const buttonLanguageModeLabel = document.createElement("p");
      buttonLanguageModeLabel.appendChild(nodeLanguageMode);

      const buttonLanguageMode = document.createElement("button");
      buttonLanguageMode.addEventListener("click", handleLanguageModeChange);
      buttonLanguageMode.addEventListener("click", () =>
        settings.classList.toggle("visible"),
      );
      buttonLanguageMode.appendChild(buttonLanguageModeLabel);

      container.appendChild(buttonLanguageMode);
    }

    settings.appendChild(top);
    settings.appendChild(container);

    return settings;
  }

  private handleAnswerModeChange(): void {
    const newAnswerMode =
      VocabularyDrill.activeAnswerMode === AnswerModeType.FillIn
        ? AnswerModeType.DragText
        : AnswerModeType.FillIn;

    VocabularyDrill.removeRunnable(this.wrapper);
    VocabularyDrill.addRunnable(
      this.wrapper,
      this.contentId,
      this.params,
      newAnswerMode,
      VocabularyDrill.activeLanguageMode,
    );
  }

  private handleLanguageModeChange(): void {
    const newLanguageMode =
      VocabularyDrill.activeLanguageMode === LanguageModeType.Target
        ? LanguageModeType.Source
        : LanguageModeType.Target;

    VocabularyDrill.removeRunnable(this.wrapper);
    VocabularyDrill.addRunnable(
      this.wrapper,
      this.contentId,
      this.params,
      VocabularyDrill.activeAnswerMode,
      newLanguageMode,
    );
  }

  private static addRunnable(
    wrapper: HTMLElement,
    contentId: string,
    params: Params,
    answerMode?: AnswerModeType,
    languageMode?: LanguageModeType,
  ): void {
    const { behaviour, description, words, overallFeedback } = params;
    const { numberOfWordsToShow } = behaviour;
    const initialAnswerMode = behaviour.answerMode as AnswerModeType;

    this.activeAnswerMode = answerMode ?? initialAnswerMode;
    this.activeLanguageMode = languageMode ?? LanguageModeType.Target;

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

    switch (this.activeAnswerMode) {
      case AnswerModeType.DragText: {
        H5P.newRunnable(
          {
            library: libraryToString(dragTextLibraryInfo),
            params: {
              taskDescription: description,
              textField: parseWords(
                words,
                numberOfWordsToShow,
                this.activeAnswerMode,
                this.activeLanguageMode,
              ),
              behaviour: {
                instantFeedback: behaviour.autoCheck,
                ...behaviour,
              },
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
              questions: [
                parseWords(
                  words,
                  numberOfWordsToShow,
                  this.activeAnswerMode,
                  this.activeLanguageMode,
                ),
              ],
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
    wrapper.className = "";
  }
}

registerContentType("VocabularyDrill", VocabularyDrill);
