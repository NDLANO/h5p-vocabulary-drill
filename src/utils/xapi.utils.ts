import { H5P } from 'h5p-utils';
import {
  IH5PContentType,
  IH5PQuestionType,
  XAPIDefinition,
  XAPIEvent,
  XAPIInteractionType,
  XAPIVerb,
} from 'h5p-types';

/*
 * XAPIDefition in h5p-types is not correct: Does not require
 * `correctResponsesPattern` as it depends on interaction type
 * see https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#interaction-activities
 */
type XAPIDefinitionFixed = Omit<XAPIDefinition, 'correctResponsesPattern'>;

// XAPIEvent in h5p-types is not correct, setScoredResult is not correct
type XAPIEventFixed = Omit<XAPIEvent, 'setScoredResult'> & {
  setScoredResult(
    score: number,
    maxScore: number,
    instance: IH5PContentType, // H5PObject in XAPIEvent
    completion: boolean, // number in XAPIEvent
    success: boolean, // number in XAPIEvent
  ): void
}

const DEFAULT_DESCRIPTION = 'Vocabulary Drill';

export default class XAPIUtils {
  context: IH5PContentType & IH5PQuestionType;
  description?: string;
  title?: string;

  constructor(params: {
    context: IH5PContentType & IH5PQuestionType
    description?: string,
    title?: string
  }) {
    this.context = params.context;
    this.description = params.description;
    this.title = params.title;
  }

  triggerXAPIEvent(verb: XAPIVerb) {
    const xAPIEvent = this.createXAPIEvent(verb);
    this.context.trigger(xAPIEvent);
  }

  createXAPIEvent(verb: XAPIVerb): XAPIEventFixed {
    const xAPIEvent = this.context.createXAPIEventTemplate(verb, undefined) as unknown as XAPIEventFixed;

    xAPIEvent.data.statement.object.definition = {
      ...xAPIEvent.data.statement.object.definition,
      ...this.getXAPIDefinition()
    };

    if (verb === 'completed' || verb === 'answered') {
      xAPIEvent.setScoredResult(
        this.context.getScore(),
        this.context.getMaxScore(),
        this.context,
        true,
        this.context.getScore() === this.context.getMaxScore()
      );
    }

    return xAPIEvent;
  }

  getXAPIDefinition(): XAPIDefinitionFixed {
    return {
      name: { 'en-US': this.getTitle() },
      description: { 'en-US': this.getDescription() },
      type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
      interactionType: 'other' as XAPIInteractionType
    };
  };

  getTitle(): string {
    return H5P.createTitle(this.title ?? DEFAULT_DESCRIPTION);
  }

  getDescription(): string {
    return this.description ?? DEFAULT_DESCRIPTION;
  }
}
