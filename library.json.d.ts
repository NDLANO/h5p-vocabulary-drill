export const title : "Vocabulary Drill";
export const machineName : "H5P.VocabularyDrill";
export const majorVersion : 1;
export const minorVersion : 0;
export const patchVersion : 0;
export const runnable : 1;
export const license : "MIT";
export const author : "NDLA";
export const preloadedDependencies : [
	{
		machineName: "H5P.Blanks",
		majorVersion: 1,
		minorVersion: 14
	},
	{
		machineName: "H5P.DragText",
		majorVersion: 1,
		minorVersion: 10
	}
];
export const editorDependencies : [
	{
		machineName: "H5PEditor.CSVToText",
		majorVersion: 1,
		minorVersion: 0
	},
	{
		machineName: "H5PEditor.RadioGroup",
		majorVersion: 1,
		minorVersion: 1
	}
];
export const preloadedCss : [
	{
		path: "dist/h5p-vocabulary-drill.css"
	}
];
export const preloadedJs : [
	{
		path: "dist/h5p-vocabulary-drill.js"
	}
];
declare const $defaultExport: {
	title: typeof title,
	machineName: typeof machineName,
	majorVersion: typeof majorVersion,
	minorVersion: typeof minorVersion,
	patchVersion: typeof patchVersion,
	runnable: typeof runnable,
	license: typeof license,
	author: typeof author,
	preloadedDependencies: typeof preloadedDependencies,
	editorDependencies: typeof editorDependencies,
	preloadedCss: typeof preloadedCss,
	preloadedJs: typeof preloadedJs
};

export default $defaultExport;