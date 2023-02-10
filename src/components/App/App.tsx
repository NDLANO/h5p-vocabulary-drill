import { H5PContentType } from "h5p-utils";
import React from "react";
import { Params } from "../../types/types";
import { VocabularyDrill } from "../VocabularyDrill/VocabularyDrill";

type AppProps = {
  title: string;
  contentId: string;
  context: H5PContentType<Params>;
};

export const App: React.FC<AppProps> = ({ title, contentId, context }) => {
  return (
    <VocabularyDrill title={title} contentId={contentId} context={context} />
  );
};
