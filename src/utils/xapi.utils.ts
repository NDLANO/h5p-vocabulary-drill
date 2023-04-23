import { H5P } from 'h5p-utils';
import {
  IH5PContentType,
  IH5PQuestionType,
  XAPIDefinition,
  XAPIEvent,
  XAPIInteractionType,
  XAPIVerb,
} from 'h5p-types';

const DEFAULT_DESCRIPTION = 'Vocabulary Drill';

export default class XAPIUtils {
  context: IH5PContentType & IH5PQuestionType;
  description?: string;
  title?: string;

  constructor(params: {
    context: IH5PContentType & IH5PQuestionType;
    description?: string;
    title?: string;
  }) {
    this.context = params.context;
    this.description = params.description;
    this.title = params.title;
  }

  triggerXAPIEvent(verb: XAPIVerb) {
    const xAPIEvent = this.createXAPIEvent(verb);
    this.context.trigger(xAPIEvent);
  }

  createXAPIEvent(verb: XAPIVerb): XAPIEvent {
    const xAPIEvent = this.context.createXAPIEventTemplate(verb, undefined);

    xAPIEvent.data.statement.object.definition = {
      ...xAPIEvent.data.statement.object.definition,
      ...this.getXAPIDefinition(),
    };

    if (verb === 'completed' || verb === 'answered') {
      xAPIEvent.setScoredResult(
        this.context.getScore(),
        this.context.getMaxScore(),
        this.context,
        true,
        this.context.getScore() === this.context.getMaxScore(),
      );
    }

    return xAPIEvent;
  }

  getXAPIDefinition(): XAPIDefinition {
    return {
      name: { 'en-US': this.getTitle() },
      description: { 'en-US': this.getDescription() },
      type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
      interactionType: 'other' satisfies XAPIInteractionType,
    };
  }

  getTitle(): string {
    return H5P.createTitle(this.title ?? DEFAULT_DESCRIPTION);
  }

  getDescription(): string {
    return this.description ?? DEFAULT_DESCRIPTION;
  }
}
