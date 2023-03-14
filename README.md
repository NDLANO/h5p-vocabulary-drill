# [WIP] h5p-vocabulary-drill

H5P.VocabularyDrill is a content type specialized for glossary tests.
It lets students answer glossary tests by text or by dragging words in the correct place.

## Answer modes

There are two answer modes available, they are based on content types [H5P.Blanks](https://github.com/h5p/h5p-blanks) (Fill in the Blanks) and [H5P.DragText](https://github.com/h5p/h5p-drag-text) (Drag the Words). The editor has the option to allow the end user to change answer mode, or if only one answer mode should be available.

### Fill in

In "Fill in" mode, each `source` word is listed together with an empty text input field in which the student types in the answer.

<!-- TODO: Add image -->

### Drag text

In "Drag text" mode, `source` words are listed on the left, while `target` words are listed on the right.
The student drags the `target` words to their corresponding translations.

<!-- TODO: Add image -->

## CSV

It's possible to mass import words with a CSV file.
Either comma (Apple Numbers, Google Sheets) and semicolon (Microsoft Excel) can be used as CSV delimiter.
Each row must be divided into four columns:

1. The `source` word
1. A `source` hint (an empty string is supported)
1. The `target` word
1. A `target` hint (an empty string is supported)

## Options

| Option | Description |
|--------|-------------|
| Switch modes | Lets the student switch between answer modes |
| Switch languages | Lets the student change what language is on the left - the `source` or the `target` |

## Install

Download the latest release from [the releases page](https://github.com/NDLANO/h5p-vocabulary-drill/releases).
The release file also includes every project that H5P.VocabularyDrill depends on.
