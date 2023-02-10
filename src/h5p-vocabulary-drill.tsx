import type { IH5PContentType } from "h5p-types";
import { H5PContentType, registerContentType } from "h5p-utils";
import { isNil } from "./utils";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App/App";
import { Params } from "./types/types";
import "./index.scss";

class VocabularyDrill
  extends H5PContentType<Params>
  implements IH5PContentType<Params>
{
  attach($container: JQuery<HTMLElement>) {
    const containerElement = $container.get(0);

    if (isNil(containerElement)) {
      throw new Error(
        "H5P.VocabularyDrill: Found no containing element to attach content to.",
      );
    }

    // TODO: Translate
    const title = this.extras?.metadata.title ?? "Vocabulary drill";

    const root = createRoot(containerElement);
    root.render(
      <React.StrictMode>
        <App title={title} contentId={this.contentId} context={this} />
      </React.StrictMode>,
    );

    containerElement.classList.add("h5p-vocabulary-drill");
  }
}

registerContentType("VocabularyDrill", VocabularyDrill);
