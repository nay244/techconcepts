import type { ReactNode } from 'react';
import type { Fact, Lesson } from '../content/schema';
import { positionLabel, type DerivedState, type Sections } from '../engine/timeline';
import { wrapAtDots } from '../lib/wrapAtDots';
import { eventCard, kindLabel, type EventCard } from './eventCard';
import './lesson.css';

export interface ExplanationPanelProps {
  lesson: Lesson;
  sections: Sections;
  position: number;
  state: DerivedState;
  /** An actor's name for the event card's route, for example "Laptop". */
  actorLabel(id: string): string;
  /** Shown on the Overview only: the console's "Resume at step 3" button or "Finished" marker. */
  resume?: ReactNode;
  /** Shown at Try it, Check yourself and the Recap, which bring their own panels. */
  children?: ReactNode;
}

function FactList({ facts }: { facts: Fact[] }) {
  if (facts.length === 0) return null;
  return (
    <dl className="explain__facts">
      {facts.map((fact, i) => (
        <div key={i} className="explain__fact">
          <dt>{fact.label}</dt>
          <dd>{wrapAtDots(fact.value)}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The message that has just played. Its kind is told by a word as well as the
 * accent colour, and a dropped message carries a "Dropped" label and a dashed edge.
 */
function EventCardView({ card, kindWord }: { card: EventCard; kindWord: string }) {
  return (
    <div
      className="event-card"
      role="group"
      aria-label="Latest message"
      data-kind={card.kind}
      data-outcome={card.dropped ? 'dropped' : 'delivered'}
    >
      <p className="event-card__head">
        <span className="event-card__label">{card.label}</span>
        <span className="kind-tag">
          <span className="kind-dot" data-kind={card.kind} aria-hidden="true" />
          {kindWord}
        </span>
        {card.dropped ? <span className="dropped-flag">Dropped</span> : null}
      </p>
      <p className="event-card__route">{card.route}</p>
      <p className="event-card__summary">{card.summary}</p>
      <p className="event-card__meta">{card.meta}</p>
    </div>
  );
}

/**
 * The right-hand panel: the Overview or the current step. At Try it, Check
 * yourself and the Recap it shows `children` instead, so the console picks
 * which of those panels goes in.
 *
 * The Overview and steps (and, at the other positions, a hidden line naming where the learner is)
 * sit in a polite live region that stays in the page
 * as the learner moves about, so a new step, and each message as it plays, is
 * announced. A region added with its content already in it would not be.
 */
export function ExplanationPanel({ lesson, sections, position, state, actorLabel, resume, children }: ExplanationPanelProps) {
  const overview = position === 0;
  const step = position >= 1 && position <= sections.stepCount ? lesson.steps[position - 1] : undefined;
  const legend = lesson.scene.type === 'flow' ? lesson.scene.legend : [];
  const card = step === undefined ? null : eventCard(state, actorLabel);

  // Focus does not move when the position changes, so at the positions with a panel of their own
  // the live region says where the learner has got to. (The Subnetting canvas has its own
  // role="status", but that speaks only after the learner compares two addresses, never on a move.)
  const cue =
    overview || step !== undefined
      ? ''
      : position === sections.tryIt
        ? `Try it. ${lesson.tryIt.prompt}`
        : positionLabel(lesson, position);

  return (
    <div className="explain">
      <div className="explain__live" aria-live="polite">
        {overview ? (
          <>
            <p className="explain__hook">{lesson.overview.hook}</p>
            <h2 className="explain__name">{lesson.overview.name}</h2>
            <p className="explain__full-name">{lesson.overview.fullName}</p>
            <p className="explain__description">{lesson.overview.description}</p>
            <FactList facts={lesson.overview.facts} />
          </>
        ) : null}
        {step !== undefined ? (
          <>
            <p className="explain__eyebrow">{`STEP ${position} OF ${sections.stepCount}`}</p>
            <h2 className="explain__title">{step.title}</h2>
            <p className="explain__subtitle">{step.subtitle}</p>
            <p className="explain__narrative">{step.narrative}</p>
            {card === null ? null : <EventCardView card={card} kindWord={kindLabel(card.kind, legend)} />}
            <FactList facts={step.facts} />
          </>
        ) : null}
        {!overview && step === undefined ? <p className="sr-only">{cue}</p> : null}
      </div>
      {overview ? resume : null}
      {!overview && step === undefined ? children : null}
    </div>
  );
}

export default ExplanationPanel;
