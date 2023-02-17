import type { IH5PContentType } from "h5p-types";
import { H5PContentType, registerContentType } from "h5p-utils";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { ContentIdContext } from "use-h5p";
import { VocabularyDrill } from "./components/VocabularyDrill/VocabularyDrill";
import "./index.scss";
import { Params } from "./types/types";
import { isNil } from "./utils/type.utils";

class VocabularyDrillContentType
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
    const { contentId } = this;

    const root = createRoot(containerElement);
    root.render(
      <React.StrictMode>
        <ContentIdContext.Provider value={contentId}>
          <VocabularyDrill title={title} context={this} />
        </ContentIdContext.Provider>
      </React.StrictMode>,
    );

    containerElement.classList.add("h5p-vocabulary-drill");
  }
}

registerContentType("VocabularyDrill", VocabularyDrillContentType);
