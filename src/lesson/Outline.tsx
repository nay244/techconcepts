import { useEffect, useId, useRef, useState } from 'react';
import type { LessonSummary } from '../content/registry';
import type { Lesson, Unit } from '../content/schema';
import { positionOf, type Position } from '../engine/timeline';
import { byPart, STATUS_TEXT } from '../lib/entries';
import { STATUS_WORDS } from '../lib/hub';
import type { LessonProgress, ProgressData } from '../progress/store';
import { LEARN_SUB, LEARN_TITLE } from './Explanation';
import { questionsTitle } from './Practice';

export interface OutlineProps {
  lesson: Lesson;
  position: Position;
  /** The unit at the current position, counting from 0. */
  current: number;
  /** The units the learner has opened on this page (always including the current one); kept in memory only. */
  seen: ReadonlySet<number>;
  onGo(position: Position): void;
  /** Every lesson the track plans, written or not, in track order. */
  entries: LessonSummary[];
  /** The key of the lesson on this page. */
  currentKey: string;
  progress: ProgressData;
}

type Filter = 'all' | NonNullable<Unit['group']>;
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'core', label: 'Core' },
  { id: 'app', label: 'Apps' },
  { id: 'security', label: 'Security' },
];

interface ItemProps {
  target: Position;
  position: Position;
  title: string;
  sub?: string;
  /** The step's number in its mark; Overview, Learn and Practice show a dot instead. */
  number?: number;
  onGo(position: Position): void;
}

/** One place in the lesson: done before the current one (a check), current (marigold and `aria-current`), or ahead. */
function Item({ target, position, title, sub, number, onGo }: ItemProps) {
  const state = target < position ? 'done' : target === position ? 'current' : undefined;
  return (
    <li>
      <button
        type="button"
        className="outline__item"
        data-state={state}
        aria-current={state === 'current' ? 'step' : undefined}
        onClick={() => onGo(target)}
      >
        <span className="outline__mark" data-dot={number === undefined ? '' : undefined} aria-hidden="true">
          {state === 'done' ? '✓' : number}
        </span>
        <span className="outline__title">{title}</span>
        {sub === undefined ? null : (
          <>
            {' '}
            <span className="outline__sub">{sub}</span>
          </>
        )}
      </button>
    </li>
  );
}

/** A label between the outline's places, for the eye. */
function Group({ label }: { label: string }) {
  return (
    <li className="outline__group" aria-hidden="true">
      {label}
    </li>
  );
}

// ---------------------------------------------------------------- the track's lessons

function statusOf(progress: ProgressData, key: string): LessonProgress['status'] | null {
  return Object.hasOwn(progress.lessons, key) ? progress.lessons[key]!.status : null;
}

function LessonLink({ entry, current, status }: { entry: LessonSummary; current: boolean; status: LessonProgress['status'] | null }) {
  const body = (
    <>
      <span className="outline__lesson-n" aria-hidden="true">
        {entry.number}
      </span>
      <span className="outline__lesson-title">{entry.title}</span>
      {entry.available ? (
        status === null ? null : (
          <span className="outline__lesson-status" data-status={status}>
            <span className="sr-only">, </span>
            {STATUS_TEXT[status]}
          </span>
        )
      ) : (
        <span className="outline__lesson-status" data-status="soon">
          <span className="sr-only">, </span>
          {STATUS_WORDS['not-ready']}
        </span>
      )}
    </>
  );
  return entry.available ? (
    <a className="outline__lesson" href={entry.url} aria-current={current ? 'page' : undefined}>
      {body}
    </a>
  ) : (
    <span className="outline__lesson" data-available="false">
      {body}
    </span>
  );
}

interface AllLessonsProps extends Pick<OutlineProps, 'entries' | 'currentKey' | 'progress'> {
  open: boolean;
  onClose(): void;
}

/** "All N lessons": the track's lessons by part, in a modal dialog, with ✓ Done or In progress in words. */
function AllLessons({ entries, currentKey, progress, open, onClose }: AllLessonsProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const box = dialog.current;
    if (box === null) return;
    // jsdom has no showModal; the attribute alone is enough there.
    if (open && !box.open) {
      if (typeof box.showModal === 'function') box.showModal();
      else box.setAttribute('open', '');
    } else if (!open && box.open) {
      if (typeof box.close === 'function') box.close();
      else box.removeAttribute('open');
    }
  }, [open]);

  return (
    <dialog
      ref={dialog}
      className="outline__dialog"
      aria-labelledby={titleId}
      onClose={onClose}
      // A click on the backdrop lands on the dialog itself; its body fills the box.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="outline__dialog-body">
        <div className="outline__dialog-head">
          <h2 id={titleId}>{`All ${entries.length} lessons`}</h2>
          <button type="button" className="cbtn" onClick={onClose}>
            <span aria-hidden="true">×</span> Close
          </button>
        </div>
        {open
          ? byPart(entries).map((part) => (
              <section key={part.title} className="outline__part">
                <h3>{part.title}</h3>
                <ol>
                  {part.entries.map((entry) => (
                    <li key={entry.key}>
                      <LessonLink entry={entry} current={entry.key === currentKey} status={statusOf(progress, entry.key)} />
                    </li>
                  ))}
                </ol>
              </section>
            ))
          : null}
      </div>
    </dialog>
  );
}

// ---------------------------------------------------------------- the outline

/**
 * The left column. A lesson of one unit lists its Overview (its sub line is the
 * unit's purpose), its Watch steps (title and plain sub line), Learn and
 * Practice. A lesson of many units (lesson
 * 1's protocols) lists one row per unit, filtered by group, with the current
 * unit opened to show its parts and a check on the others the learner has
 * opened here. Below, "All N lessons" opens the track's list.
 */
export function Outline({ lesson, position, current, seen, onGo, entries, currentKey, progress }: OutlineProps) {
  const headId = useId();
  const [filter, setFilter] = useState<Filter>('all');
  const [listOpen, setListOpen] = useState(false);
  const many = lesson.units.length > 1;

  /** One unit's places. In a lesson of many units they sit, shorter, under the unit's row. */
  function parts(u: number) {
    const unit = lesson.units[u]!;
    const at = (kind: 'overview' | 'learn' | 'practice') => positionOf(lesson, u, kind);
    const item = { position, onGo };
    const steps = unit.steps.map((step, i) => (
      <Item
        key={step.id}
        {...item}
        target={positionOf(lesson, u, 'step', i + 1)}
        title={step.title}
        sub={many ? undefined : step.sub}
        number={i + 1}
      />
    ));
    if (many) {
      return (
        <>
          <Item {...item} target={at('overview')} title="Overview" />
          <Group label={`Watch · ${unit.steps.length}`} />
          {steps}
          <Group label="Learn & Practice" />
          <Item {...item} target={at('learn')} title="Learn" />
          <Item {...item} target={at('practice')} title="Practice" />
        </>
      );
    }
    return (
      <>
        <Item {...item} target={at('overview')} title="Overview" sub={unit.purpose} />
        <Group label={`Watch · ${unit.steps.length} ${unit.steps.length === 1 ? 'step' : 'steps'}`} />
        {steps}
        <Group label="Learn" />
        <Item {...item} target={at('learn')} title={LEARN_TITLE} sub={LEARN_SUB} />
        <Group label="Practice" />
        <Item {...item} target={at('practice')} title={questionsTitle(unit.practice.length)} sub="Just for you, nothing is scored" />
      </>
    );
  }

  return (
    <nav className="console__panel console__outline" aria-labelledby={headId} data-units={many ? 'many' : 'one'}>
      <h2 id={headId} className="console__ptitle outline__head">
        {many ? `${lesson.units.length} protocols` : 'This lesson'}
      </h2>
      {many ? (
        <>
          <div className="outline__filters" role="group" aria-label="Filter">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
          <ol className="outline__list outline__list--units">
            {lesson.units.map((unit, u) => {
              // A filter never hides the unit the learner is in.
              if (filter !== 'all' && unit.group !== filter && u !== current) return null;
              const state = u === current ? 'current' : seen.has(u) ? 'seen' : undefined;
              return (
                <li key={unit.id}>
                  <button
                    type="button"
                    className="outline__unit"
                    aria-current={state === 'current' ? 'true' : undefined}
                    data-state={state}
                    onClick={() => onGo(positionOf(lesson, u, 'overview'))}
                  >
                    <span className="outline__unit-n" aria-hidden="true">
                      {state === 'seen' ? '✓' : String(u + 1).padStart(2, '0')}
                    </span>{' '}
                    <span className="outline__unit-name">{unit.name}</span>{' '}
                    <span className="outline__unit-purpose">{unit.purpose}</span>
                    {state === 'seen' ? <span className="sr-only">, seen</span> : null}
                  </button>
                  {state === 'current' ? <ol className="outline__parts">{parts(u)}</ol> : null}
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <ol className="outline__list">{parts(0)}</ol>
      )}
      <hr />
      <button type="button" className="outline__all" aria-haspopup="dialog" onClick={() => setListOpen(true)}>
        <span aria-hidden="true">▸ </span>
        {`All ${entries.length} lessons`}
      </button>
      <AllLessons entries={entries} currentKey={currentKey} progress={progress} open={listOpen} onClose={() => setListOpen(false)} />
    </nav>
  );
}

export default Outline;
