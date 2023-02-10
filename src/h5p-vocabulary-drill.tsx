import type {
  DeepReadonly,
  IH5PContentType,
  InferParamsFromSemantics,
} from "h5p-types";
import { H5PContentType, registerContentType } from "h5p-utils";
import { isNil } from "./utils";
import semantics from "../semantics.json";
import "./index.scss";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App/App";

type Params = InferParamsFromSemantics<DeepReadonly<typeof semantics>>;

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

    const root = createRoot(containerElement);
    root.render(
      <React.StrictMode>
        <App context={this} />
      </React.StrictMode>,
    );

    containerElement.classList.add("h5p-vocabulary-drill");
  }
}

registerContentType("VocabularyDrill", VocabularyDrill);
