import type {
  DeepReadonly,
  IH5PContentType,
  InferParamsFromSemantics,
} from "h5p-types";
import { H5P, H5PContentType, registerContentType } from "h5p-utils";
import {
  findLanguageName,
  findLibraryInfo,
  isNil,
  libraryToString,
  parseWords,
} from "./utils";
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
  private static settingsAnswerMode: AnswerModeType | undefined;
  private static settingsLanguageMode: LanguageModeType | undefined;

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
        () => this.handleSubmit(settings),
        () => this.handleClose(settings),
        params,
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
    handleSubmit: () => void,
    handleClose: () => void,
    params: Params,
  ): HTMLDivElement {
    const { sourceLanguage, targetLanguage } = params;
    const {
      answerMode,
      enableSwitchAnswerModeButton,
      enableSwitchWordsButton,
    } = params.behaviour;

    this.settingsAnswerMode =
      this.activeAnswerMode ?? (answerMode as AnswerModeType);
    this.settingsLanguageMode =
      this.activeLanguageMode ?? LanguageModeType.Target;

    const settings = document.createElement("div");
    settings.classList.add("h5p-vocabulary-drill-settings");

    const buttonClose = document.createElement("button");
    buttonClose.addEventListener("click", handleClose);

    const top = document.createElement("div");
    top.classList.add("h5p-vocabulary-drill-settings-top");
    top.appendChild(buttonClose);

    const container = document.createElement("div");
    container.classList.add("h5p-vocabulary-drill-settings-container");

    if (enableSwitchAnswerModeButton) {
      const label = "Answer Mode"; // TODO: Translate
      const option1text = "Fill in"; // TODO: Translate
      const option2text = "Drag text"; // TODO: Translate

      const answerModeWrapper = this.createSelectField(
        label,
        AnswerModeType.FillIn,
        option1text,
        AnswerModeType.DragText,
        option2text,
        this.settingsAnswerMode,
        (e: { target: HTMLSelectElement }) =>
          (this.settingsAnswerMode = e.target.value as AnswerModeType),
      );
      container.appendChild(answerModeWrapper);
    }

    if (enableSwitchWordsButton) {
      const label = "Language mode"; // TODO: Translate

      const languageModeWrapper = this.createSelectField(
        label,
        LanguageModeType.Target,
        findLanguageName(targetLanguage),
        LanguageModeType.Source,
        findLanguageName(sourceLanguage),
        this.settingsLanguageMode,
        (e: { target: HTMLSelectElement }) =>
          (this.settingsLanguageMode = e.target.value as LanguageModeType),
      );
      container.appendChild(languageModeWrapper);
    }

    // TODO: translate
    const submitNode = document.createTextNode("Change settings");
    const submitLabel = document.createElement("p");
    submitLabel.appendChild(submitNode);

    const submitButton = document.createElement("button");
    submitButton.addEventListener("click", handleSubmit);
    submitButton.appendChild(submitLabel);

    container.appendChild(submitButton);

    settings.appendChild(top);
    settings.appendChild(container);

    return settings;
  }

  private static createSelectField(
    labelText: string,
    option1value: string,
    option1text: string,
    option2value: string,
    option2text: string,
    active: any,
    eventListener: any,
  ): HTMLDivElement {
    const option1 = document.createElement("option");
    option1.value = option1value;
    option1.text = option1text;
    if (active === option1.value) {
      option1.selected = true;
    }

    const option2 = document.createElement("option");
    option2.value = option2value;
    option2.text = option2text;
    if (active === option2.value) {
      option2.selected = true;
    }

    const label = document.createElement("label");
    label.textContent = labelText;

    const select = document.createElement("select");
    select.appendChild(option1);
    select.appendChild(option2);
    select.addEventListener("change", eventListener);

    const wrapper = document.createElement("div");
    wrapper.classList.add("h5p-vocabulary-drill-settings-select");
    wrapper.appendChild(label);
    wrapper.appendChild(select);

    return wrapper;
  }

  private handleClose(settings: HTMLDivElement | undefined): void {
    settings?.classList.toggle("visible");
    VocabularyDrill.settingsAnswerMode = VocabularyDrill.activeAnswerMode;
    VocabularyDrill.settingsLanguageMode = VocabularyDrill.activeLanguageMode;
  }

  private handleSubmit(settings: HTMLDivElement | undefined): void {
    const newAnswerMode =
      VocabularyDrill.settingsAnswerMode ?? VocabularyDrill.activeAnswerMode;
    const newLanguageMode =
      VocabularyDrill.settingsLanguageMode ??
      VocabularyDrill.activeLanguageMode;

    VocabularyDrill.removeRunnable(this.wrapper);
    VocabularyDrill.addRunnable(
      this.wrapper,
      this.contentId,
      this.params,
      newAnswerMode,
      newLanguageMode,
    );

    this.handleClose(settings);
  }

  private static addRunnable(
    wrapper: HTMLElement,
    contentId: string,
    params: Params,
    answerMode?: AnswerModeType,
    languageMode?: LanguageModeType,
  ): void {
    const { behaviour, description, words, overallFeedback } = params;
    const { autoCheck, randomize, showTips, numberOfWordsToShow } = behaviour;
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
                randomize,
                showTips,
                numberOfWordsToShow,
                this.activeAnswerMode,
                this.activeLanguageMode,
              ),
              behaviour: {
                instantFeedback: autoCheck,
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
                  randomize,
                  showTips,
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
