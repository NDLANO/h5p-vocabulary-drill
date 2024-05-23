import type { BlanksTranslations, DragTextTranslations, Translations } from '../types/types';

/**
 * Default translations for the Vocabulary Drill.
 */
export const defaultTranslations: Translations = {
  noValidWords: 'No valid words found. Please check your words and try again.',
  dragTextDropzoneAria: 'Drop the translation of @sourceWord here.',
  fillInLabel: 'Fill in',
  dragTextLabel: 'Drag text',
  answerModeLabel: 'Change answer mode',
  languageModeLabel: 'Swap languages',
  changedAnswerModeAria: 'Changed answer mode to @option.',
  languageModeAria: 'Swap language from @sourceLanguage to @targetLanguage',
  changedLanguageModeAria: 'Swapped language from @sourceLanguage to @targetLanguage',
  next: 'Next',
  finish: 'Finish',
  restart: 'Restart',
  scoreLabel: 'Score',
  scoreBarLabel: 'You got @score out of @maxScore points',
  pageNumberLabel: 'Page @page of @totalPages',
  feedbackText: 'Your total score',
  lang_en: 'English',
  lang_fr: 'French',
  lang_de: 'German',
  lang_sme: 'Northern Sámi',
  lang_nb: 'Norwegian bokmål',
  lang_nn: 'Norwegian nynorsk',
  lang_sma: 'Southern Sámi',
  lang_es: 'Spanish',
};

/**
 * Default translations for Blanks.
 */
export const blanksDefaultTranslations: BlanksTranslations = {
  showSolutions: 'Show solution',
  tryAgain: 'Retry',
  checkAnswer: 'Check',
  submitAnswer: 'Submit',
  notFilledOut: 'Please fill in all blanks to view solution',
  answerIsCorrect: '\':ans\' is correct',
  answerIsWrong: '\':ans\' is wrong',
  answeredCorrectly: 'Answered correctly',
  answeredIncorrectly: 'Answered incorrectly',
  solutionLabel: 'Correct answer',
  inputLabel: 'Blank input @num of @total',
  inputHasTipLabel: 'Tip available',
  tipLabel: 'Tip',
  scoreBarLabel: 'You got :num out of :total points',
  a11yCheck: 'Check the answers. The responses will be marked as correct, incorrect, or unanswered.',
  a11yShowSolution: 'Show the solution. The task will be marked with its correct solution.',
  a11yRetry: 'Retry the task. Reset all responses and start the task over again.',
  a11yCheckingModeHeader: 'Checking mode',
};

/**
 * Default translations for Drag Text.
 */
export const dragTextDefaultTranslations: DragTextTranslations = {
  checkAnswer: 'Check',
  submitAnswer: 'Submit',
  tryAgain: 'Retry',
  showSolution: 'Show solution',
  dropZoneIndex: 'Drop zone @index',
  empty: 'Drop Zone @index is empty.',
  contains: 'Drop Zone @index contains draggable @draggable.',
  ariaDraggableIndex: '@index of @count draggables.',
  tipLabel: 'Show tip',
  correctText: 'Correct!',
  incorrectText: 'Incorrect!',
  resetDropTitle: 'Reset drop',
  resetDropDescription: 'Are you sure you want to reset this drop zone?',
  grabbed: 'Draggable is grabbed.',
  cancelledDragging: 'Cancelled dragging.',
  correctAnswer: 'Correct answer',
  feedbackHeader: 'Feedback',
  scoreBarLabel: 'You got :num out of :total points',
  a11yCheck: 'Check the answers. The responses will be marked as correct, incorrect, or unanswered.',
  a11yShowSolution: 'Show the solution. The task will be marked with its correct solution.',
  a11yRetry: 'Retry the task. Reset all responses and start the task over again.',
};