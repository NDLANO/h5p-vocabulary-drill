import React from "react";
import { VocabularyDrill } from "../VocabularyDrill/VocabularyDrill";

type AppProps = {
  context: any;
};

export const App: React.FC<AppProps> = ({ context }) => {
  return <VocabularyDrill context={context} />;
};
