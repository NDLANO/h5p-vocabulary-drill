declare const json: {
  "title": "Vocabulary Drill",
  "machineName": "H5P.VocabularyDrill",
  "majorVersion": 1,
  "minorVersion": 0,
  "patchVersion": 12,
  "runnable": 1,
  "license": "MIT",
  "author": "NDLA",
  "embedTypes": ["iframe"],
  "preloadedDependencies": [
    {
      "machineName": "H5P.Blanks",
      "majorVersion": 1,
      "minorVersion": 14
    },
    {
      "machineName": "H5P.DragText",
      "majorVersion": 1,
      "minorVersion": 10
    }
  ],
  "editorDependencies": [
    {
      "machineName": "H5PEditor.CSVToText",
      "majorVersion": 1,
      "minorVersion": 0
    },
    {
      "machineName": "H5PEditor.RadioGroup",
      "majorVersion": 1,
      "minorVersion": 1
    }
  ],
  "preloadedJs": [
    {
      "path": "dist/h5p-vocabulary-drill.js"
    },
    {
      "path": "dist/vendor.js"
    }
  ]
}

export default json;