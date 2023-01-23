declare const $defaultExport: [
	{
		label: "Task description",
		name: "description",
		description: "A guide telling the user how to answer this task.",
		type: "text",
		optional: true
	},
	{
		label: "Source language",
		name: "sourceLanguage",
		description: "Choose the language of the source words.",
		type: "select",
		options: [
			{
				value: "de",
				label: "Dutch"
			},
			{
				value: "en",
				label: "English"
			},
			{
				value: "fr",
				label: "French"
			},
			{
				value: "nb",
				label: "Norwegian bokmål"
			},
			{
				value: "nn",
				label: "Norwegian nynorsk"
			},
			{
				value: "es",
				label: "Spanish"
			}
		],
		"default": "en"
	},
	{
		label: "Target language",
		name: "targetLanguage",
		description: "Choose the language of the target words.",
		type: "select",
		options: [
			{
				value: "de",
				label: "Dutch"
			},
			{
				value: "en",
				label: "English"
			},
			{
				value: "fr",
				label: "French"
			},
			{
				value: "nb",
				label: "Norwegian bokmål"
			},
			{
				value: "nn",
				label: "Norwegian nynorsk"
			},
			{
				value: "es",
				label: "Spanish"
			}
		],
		"default": "nb"
	},
	{
		label: "Words",
		name: "words",
		type: "text",
		optional: true,
		widget: "csv-to-text",
		description: "Add words by uploading a CSV-file or write them in the text field.",
		important: {
			description: "<ul><li>Source and target words are separated with a comma (,).</li><li>Alternative answers are separated with a forward slash (/).</li><li>You may add a textual tip, using a colon (:) in front of the tip.</li></ul>",
			example: "water/sea:w___r,vann/hav:v__n"
		}
	},
	{
		name: "overallFeedback",
		type: "group",
		label: "Overall Feedback",
		importance: "low",
		expanded: true,
		fields: [
			{
				name: "overallFeedback",
				type: "list",
				widgets: [
					{
						name: "RangeList",
						label: "Default"
					}
				],
				importance: "high",
				label: "Define custom feedback for any score range",
				description: "Click the \"Add range\" button to add as many ranges as you need. Example: 0-20% Bad score, 21-91% Average Score, 91-100% Great Score!",
				entity: "range",
				min: 1,
				defaultNum: 1,
				optional: true,
				field: {
					label: "Overall Feedback",
					name: "overallFeedback",
					type: "group",
					importance: "low",
					fields: [
						{
							name: "from",
							type: "number",
							label: "Score Range",
							min: 0,
							max: 100,
							"default": 0,
							unit: "%"
						},
						{
							name: "to",
							type: "number",
							min: 0,
							max: 100,
							"default": 100,
							unit: "%"
						},
						{
							name: "feedback",
							type: "text",
							label: "Feedback for defined score range",
							importance: "low",
							placeholder: "Fill in the feedback",
							optional: true
						}
					]
				}
			}
		]
	},
	{
		label: "Localization",
		name: "l10n",
		type: "group",
		fields: [
		]
	},
	{
		name: "behaviour",
		type: "group",
		label: "Behavioural settings",
		importance: "low",
		description: "These options will let you control how the task behaves.",
		fields: [
			{
				label: "Enable \"Retry\"",
				importance: "low",
				name: "enableRetry",
				type: "boolean",
				"default": true
			},
			{
				label: "Enable \"Show solution\" button",
				importance: "low",
				name: "enableSolutionsButton",
				type: "boolean",
				"default": true
			},
			{
				label: "Automatically check answers after input",
				importance: "low",
				name: "autoCheck",
				type: "boolean",
				"default": false
			},
			{
				name: "caseSensitive",
				importance: "low",
				type: "boolean",
				"default": true,
				label: "Case sensitive",
				description: "Makes sure the user input has to be exactly the same as the answer."
			},
			{
				label: "Require all fields to be answered before the solution can be viewed",
				importance: "low",
				name: "showSolutionsRequiresInput",
				type: "boolean",
				"default": true
			},
			{
				name: "acceptSpellingErrors",
				type: "boolean",
				label: "Accept minor spelling errors",
				importance: "low",
				description: "If activated, an answer will also count as correct with minor spelling errors (3-9 characters: 1 spelling error, more than 9 characters: 2 spelling errors). This option is only valid if the answer mode is set to Fill in",
				"default": false
			},
			{
				label: "Randomize",
				name: "randomize",
				type: "boolean",
				"default": true
			},
			{
				label: "Show tips",
				name: "showTips",
				type: "boolean",
				"default": false
			},
			{
				label: "Answer mode",
				name: "answerMode",
				type: "select",
				widget: "radioGroup",
				alignment: "horizontal",
				options: [
					{
						label: "Fill in",
						value: "fillIn"
					},
					{
						label: "Drag text",
						value: "dragText"
					}
				],
				"default": "fillIn"
			},
			{
				name: "enableSwitchAnswerModeButton",
				type: "boolean",
				label: "Enable \"Switch answer mode\" button",
				importance: "low",
				description: "Allow the end user to switch between modes \"Fill in\" and \"Drag text\".",
				"default": false
			},
			{
				name: "enableSwitchWordsButton",
				type: "boolean",
				label: "Enable \"Switch words\" button",
				importance: "low",
				description: "Allow the end user to switch between source and target words.",
				"default": false
			}
		]
	}
];
export default $defaultExport;