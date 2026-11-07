import { Fragment, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import type { AvailableSummary } from '../content/registry';
import type { Fact, Lesson, Source, Unit } from '../content/schema';
import { positionOf, type Position, type Slot } from '../engine/timeline';
import { wrapAtDots } from '../lib/wrapAtDots';
import { placeLabel } from './placeLabel';
import { Practice, questionsTitle, type Picks } from './Practice';
import { Rich } from './Rich';

/** Learn's title and sub line; the outline lists Learn by them too. */
export const LEARN_TITLE = 'What happened and why';
export const LEARN_SUB = 'In plain words, then the names';

export interface ExplanationProps {
  lesson: Lesson;
  position: Position;
  /** What the position shows, and its unit (the console's derived state). */
  slot: Slot;
  unit: Unit;
  /** Shown on the lesson's first Overview: the "Resume at …" button or the "Finished" marker. */
  resume?: ReactNode;
  /** The next ready lesson in the track, or null when this is the last one. */
  next: AvailableSummary | null;
  /** This lesson's number in the track, and how many lessons the track plans. */
  number: number;
  total: number;
  trackUrl: string;
  onGo(position: Position): void;
  /** The current unit's Practice picks, which the console keeps in memory. */
  picked: Picks;
  onPick(questionId: string, option: number): void;
  /** The panel itself, so the console can move focus to it after a jump. */
  panelRef?: RefObject<HTMLElement | null>;
}

/** 'Watch · Step 2 of 5', 'Overview'; in a lesson of many units the unit's name leads: 'DNS · Step 2 of 5'. */
function kicker(lesson: Lesson, unit: Unit, slot: Slot): string {
  const where = placeLabel(unit, slot);
  if (lesson.units.length > 1) return `${unit.name} · ${where}`;
  return slot.kind === 'step' ? `Watch · ${where}` : where;
}

function Facts({ facts }: { facts: Fact[] }) {
  if (facts.length === 0) return null;
  return (
    <dl className="explain__facts">
      {facts.map((fact, i) => (
        <Fragment key={i}>
          <dt>{fact.label}</dt>
          <dd>{wrapAtDots(fact.value)}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

function Sources({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;
  return (
    <>
      <p className="explain__label explain__label--sources">Sources</p>
      <ul className="explain__sources">
        {sources.map((source) => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noopener">
              {source.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

interface GoDeeperProps {
  open: boolean;
  onToggle(open: boolean): void;
  children: ReactNode;
}

/** Exam-level detail, closed until the learner opens it. */
function GoDeeper({ open, onToggle, children }: GoDeeperProps) {
  return (
    <details className="explain__deeper" open={open} onToggle={(event) => onToggle(event.currentTarget.open)}>
      <summary>
        <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
          <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Go deeper</span>
        <small>the technical details</small>
      </summary>
      <div className="explain__deeper-body">{children}</div>
    </details>
  );
}

/** "Lessons 18 to 20 are coming soon." after the last ready lesson, or nothing when the track ends here. */
function comingSoon(number: number, total: number): ReactNode {
  const after = total - number;
  if (after <= 0) return null;
  return after === 1 ? (
    <>
      {` Lesson ${total} is `}
      <b>coming soon</b>.
    </>
  ) : (
    <>
      {` Lessons ${number + 1} to ${total} are `}
      <b>coming soon</b>.
    </>
  );
}

/** 'How a router remembers…' as the end of a sentence: 'how a router remembers….' */
function asClause(purpose: string): string {
  const clause = purpose.charAt(0).toLowerCase() + purpose.slice(1);
  return /[.!?]$/.test(clause) ? clause : `${clause}.`;
}

interface EndRowProps extends Pick<ExplanationProps, 'lesson' | 'next' | 'number' | 'total' | 'trackUrl'> {
  unit: number;
  /** Goes to the next unit; the button that did it leaves with the old position. */
  onJump(position: Position): void;
}

/**
 * The way on from Practice: the next unit in a lesson of many, else the next
 * ready lesson in the track, else back to the track.
 */
function EndRow({ lesson, unit, next, number, total, trackUrl, onJump }: EndRowProps) {
  const following = lesson.units[unit + 1];
  if (following !== undefined) {
    return (
      <div className="explain__end">
        <p>
          Next: <b>{following.name}</b>, {asClause(following.purpose)}
        </p>
        <button type="button" className="cbtn" onClick={() => onJump(positionOf(lesson, unit + 1, 'overview'))}>
          {`Go to ${following.name}`}
        </button>
      </div>
    );
  }
  if (next !== null) {
    return (
      <div className="explain__end">
        <p>
          That’s the whole lesson. Next ready lesson: <b>{next.title}</b>, lesson {next.number}.
        </p>
        <a className="cbtn" href={next.url}>
          {`Go to ${next.title}`}
        </a>
      </div>
    );
  }
  return (
    <div className="explain__end">
      <p>
        That’s the whole lesson, and the last ready one for now.
        {comingSoon(number, total)}
      </p>
      <a className="cbtn" href={trackUrl}>
        Back to the track
      </a>
    </div>
  );
}

/**
 * The right-hand panel: the Overview, a Watch step, Learn or Practice for the
 * current position. It scrolls inside itself and starts from the top at every
 * new position. Go deeper is closed until the learner opens it, and stays as
 * they left it from one position to the next.
 */
export function Explanation(props: ExplanationProps) {
  const { lesson, position, slot, unit, resume, next, number, total, trackUrl, onGo, picked, onPick, panelRef } = props;
  const [deeperOpen, setDeeperOpen] = useState(false);

  const ownPanel = useRef<HTMLElement>(null);
  const panel = panelRef ?? ownPanel;
  useEffect(() => {
    if (panel.current !== null) panel.current.scrollTop = 0;
  }, [panel, position]);

  /** After the end row's jump, focus lands on this panel, not on the page. */
  function jump(target: Position): void {
    onGo(target);
    panel.current?.focus();
  }

  let body: ReactNode;
  if (slot.kind === 'overview') {
    const { hook, description, facts } = unit.overview;
    body = (
      <>
        {position === 0 ? resume : null}
        <p className="explain__narr explain__hook">
          <Rich text={hook} />
        </p>
        <h2 className="explain__title">{unit.name}</h2>
        <p className="explain__full">{unit.fullName}</p>
        <p className="explain__narr">
          <Rich text={description} />
        </p>
        <p className="explain__flow">
          This lesson: <b>Watch</b>
          <i aria-hidden="true">›</i>
          <b>Learn</b>
          <i aria-hidden="true">›</i>
          <b>Practice</b>
        </p>
        <h3 className="explain__label">Quick facts</h3>
        <Facts facts={facts} />
      </>
    );
  } else if (slot.kind === 'step') {
    const step = unit.steps[slot.step - 1]!;
    body = (
      <>
        <h2 className="explain__title">{step.title}</h2>
        <p className="explain__sub">{step.sub}</p>
        <p className="explain__narr">
          <Rich text={step.narrative} />
        </p>
        <GoDeeper open={deeperOpen} onToggle={setDeeperOpen}>
          <p>
            <Rich text={step.deep} />
          </p>
          <Facts facts={step.facts} />
        </GoDeeper>
      </>
    );
  } else if (slot.kind === 'learn') {
    const learn = unit.learn;
    body = (
      <>
        <h2 className="explain__title">{LEARN_TITLE}</h2>
        <p className="explain__sub">{LEARN_SUB}</p>
        <p className="explain__narr">
          <Rich text={learn.lead} />
        </p>
        <ol className="explain__terms" aria-label="Terms">
          {learn.terms.map((term, i) => (
            <li key={i}>
              <span className="explain__idea">
                <Rich text={term.idea} />
              </span>
              <span className="explain__term">{term.name}</span>
            </li>
          ))}
        </ol>
        <div className="explain__pattern">
          <p className="explain__pattern-names">
            {learn.pattern.names.map((name, i) => (
              <Fragment key={i}>
                {i > 0 ? <i aria-hidden="true">›</i> : null}
                <span>{name}</span>
              </Fragment>
            ))}
          </p>
          <p className="explain__pattern-note">
            <Rich text={learn.pattern.note} />
          </p>
        </div>
        <p className="explain__narr">
          <Rich text={learn.why} />
        </p>
        <GoDeeper open={deeperOpen} onToggle={setDeeperOpen}>
          <p>
            <Rich text={learn.deep} />
          </p>
          <Facts facts={learn.facts} />
          <Sources sources={unit.references} />
        </GoDeeper>
      </>
    );
  } else {
    body = (
      <>
        <h2 className="explain__title">{questionsTitle(unit.practice.length)}</h2>
        <p className="explain__sub">Just for you. Nothing is scored or saved.</p>
        <Practice questions={unit.practice} picked={picked} onPick={onPick} />
        <EndRow lesson={lesson} unit={slot.unit} next={next} number={number} total={total} trackUrl={trackUrl} onJump={jump} />
      </>
    );
  }

  return (
    <section ref={panel} className="console__panel console__explain" aria-label="Explanation" tabIndex={0}>
      <p className="explain__kicker">{kicker(lesson, unit, slot)}</p>
      {body}
    </section>
  );
}

export default Explanation;
