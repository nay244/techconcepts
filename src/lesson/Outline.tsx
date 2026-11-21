import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { LessonSummary } from '../content/registry';
import type { Lesson, Unit } from '../content/schema';
import { positionOf, type Position } from '../engine/timeline';
import { byPart, STATUS_TEXT } from '../lib/entries';
import { STATUS_WORDS } from '../lib/hub';
import type { LessonProgress, ProgressData } from '../progress/store';
import { ChangeMarks } from './TopBar';
import type { Wait } from './useLessonChange';

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
  trackTitle: string;
  trackUrl: string;
  /** The lesson's number in the track, counting planned lessons too, and the track's total: "Lesson 9 of 20". */
  number: number;
  total: number;
  /** The lessons sheet (the dialog, under 1100px wide): open or not, and how it closes. */
  sheetOpen: boolean;
  onSheetClose(): void;
  /** A lesson change on its way: the row going gets its mark, and the sheet its signal and tape. */
  wait?: Wait | null;
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
  /** The step's number in its mark; Overview, Learn and Practice show a dot instead. */
  number?: number;
  onGo(position: Position): void;
}

/** One place in the lesson: done before the current one (a check), current (marigold and `aria-current`), or ahead. */
function Item({ target, position, title, number, onGo }: ItemProps) {
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

function LessonLink({ entry, current, status, going }: { entry: LessonSummary; current: boolean; status: LessonProgress['status'] | null; going: boolean }) {
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
    <a className="outline__lesson" href={entry.url} aria-current={current ? 'page' : undefined} data-going={going ? '' : undefined}>
      {body}
    </a>
  ) : (
    <span className="outline__lesson" data-available="false">
      {body}
    </span>
  );
}

/** How many of the track's lessons the reader has finished: "in progress" is not done. */
function doneCount(entries: LessonSummary[], progress: ProgressData): number {
  return entries.filter((entry) => statusOf(progress, entry.key) === 'finished').length;
}

const CHEVRON = (
  <svg className="part__chev" viewBox="0 0 9 9" aria-hidden="true" focusable="false">
    <path d="M2.5 1l4 3.5-4 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface TrackPartsProps extends Pick<OutlineProps, 'entries' | 'currentKey' | 'progress'> {
  /** Every part open and none a button (the lessons sheet); else only the part with this lesson is open and the rest fold. */
  all?: boolean;
  /** The key of the row a lesson change is going to. */
  going?: string | null;
  /** The parts the reader has had open as this lesson's: they stay open when it is not (a `details`, open). */
  carried?: ReadonlySet<string>;
}

/**
 * The track's parts, each with its name and "2 of 4" (a "✓" in the done colour once every lesson is done), and its
 * lessons: number, title, and "✓ Done" or "In progress". The part that holds this lesson is open and a plain heading;
 * every other part is a `<details>` (closed, and working without JavaScript), unless `all`.
 */
export function TrackParts({ entries, currentKey, progress, all = false, going = null, carried }: TrackPartsProps) {
  return (
    <>
      {byPart(entries).map((part) => {
        const done = doneCount(part.entries, progress);
        const whole = done === part.entries.length;
        const holdsThis = part.entries.some((entry) => entry.key === currentKey);
        const count = (
          <span className="part__count" data-all={whole ? '' : undefined}>
            {`${whole ? '✓ ' : ''}${done} of ${part.entries.length}`}
          </span>
        );
        const rows = (
          <ol>
            {part.entries.map((entry) => (
              <li key={entry.key}>
                <LessonLink entry={entry} current={entry.key === currentKey} status={statusOf(progress, entry.key)} going={entry.key === going} />
              </li>
            ))}
          </ol>
        );
        if (all || holdsThis) {
          return (
            <section key={part.title} className="part" data-here={holdsThis ? '' : undefined}>
              <h3 className="part__head">
                {CHEVRON}
                <span className="part__name">{part.title}</span>
                {count}
              </h3>
              {rows}
            </section>
          );
        }
        return (
          <details key={part.title} className="part" open={carried?.has(part.title) ? true : undefined}>
            <summary>
              {CHEVRON}
              <span className="part__name">{part.title}</span>
              {count}
            </summary>
            {rows}
          </details>
        );
      })}
    </>
  );
}

/** The cable: one segment a lesson, green when done, orange for this one, dashed ahead; then "6 of 20 done". */
function TrackGot({ entries, currentKey, progress }: Pick<OutlineProps, 'entries' | 'currentKey' | 'progress'>) {
  return (
    <p className="track__got">
      <span className="cable" aria-hidden="true">
        {entries.map((entry) => (
          <i key={entry.key} data-s={entry.key === currentKey ? 'here' : statusOf(progress, entry.key) === 'finished' ? 'done' : undefined} />
        ))}
      </span>
      <span>{`${doneCount(entries, progress)} of ${entries.length} done`}</span>
    </p>
  );
}

interface SheetProps extends Pick<OutlineProps, 'entries' | 'currentKey' | 'progress' | 'trackTitle' | 'trackUrl' | 'wait'> {
  open: boolean;
  onClose(): void;
}

/**
 * The lessons sheet, under 1100px wide: a modal dialog from the bar's "9 of 20" button, with the track's head
 * ("Tracks /", its name, the strip) and the same parts as the column, every one open.
 */
function LessonsSheet({ entries, currentKey, progress, trackTitle, trackUrl, open, onClose, wait = null }: SheetProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // A layout effect: a lesson opened in place closes the sheet in the frame that shows the lesson, never a frame later.
  useLayoutEffect(() => {
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
      className="sheet outline__dialog"
      aria-labelledby={titleId}
      onClose={onClose}
      // A click on the backdrop lands on the dialog itself; its body fills the box.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="sheet__body outline__dialog-body">
        <div className="sheet__bar outline__dialog-head">
          <h2 id={titleId}>{`All ${entries.length} lessons`}</h2>
          <button type="button" className="cbtn" onClick={onClose}>
            <span aria-hidden="true">×</span> Close
          </button>
          {open && wait !== null ? <ChangeMarks wait={wait} /> : null}
        </div>
        {open ? (
          <>
            <div className="track__head">
              <p className="track__crumb">
                <a href="/tracks">Tracks</a> <span aria-hidden="true">/</span>
              </p>
              <p className="track__title">
                <a href={trackUrl}>{trackTitle}</a>
              </p>
              <TrackGot entries={entries} currentKey={currentKey} progress={progress} />
            </div>
            <div className="track__list">
              <TrackParts entries={entries} currentKey={currentKey} progress={progress} all going={wait?.going ?? null} />
            </div>
          </>
        ) : null}
      </div>
    </dialog>
  );
}

// ---------------------------------------------------------------- the track column

/**
 * The left column at 1100px and up: this lesson's name (the page's `h1`) with "Lesson 9 of 20" on its line, the track's
 * strip and "6 of 20 done", then the track's lessons by part in a `nav`; the head stays and the list scrolls inside
 * the column, with this lesson in view on load. A lesson of many units lists them (with the filters) above the parts.
 * The lessons sheet (the dialog) lives here too: it is the same list for the widths with no column.
 */
export function Outline({ lesson, position, current, seen, onGo, entries, currentKey, progress, trackTitle, trackUrl, number, total, sheetOpen, onSheetClose, wait = null }: OutlineProps) {
  const [filter, setFilter] = useState<Filter>('all');
  // A lesson opened in place: the filter starts again, and the part that held the old lesson stays open as a fold.
  const [shownLesson, setShownLesson] = useState(lesson);
  const [shownKey, setShownKey] = useState(currentKey);
  const [carried, setCarried] = useState<ReadonlySet<string>>(() => new Set());
  if (shownLesson !== lesson) {
    setShownLesson(lesson);
    setFilter('all');
  }
  if (shownKey !== currentKey) {
    setShownKey(currentKey);
    const before = entries.find((e) => e.key === shownKey);
    if (before !== undefined) setCarried((c) => new Set(c).add(before.partTitle));
  }
  const many = lesson.units.length > 1;
  const list = useRef<HTMLDivElement>(null);

  // On load the lesson's row is wholly in the list's view (the list scrolls when a part of four lessons does not fit).
  useEffect(() => {
    const box = list.current;
    const row = box?.querySelector<HTMLElement>('[aria-current="page"]');
    if (box == null || row == null) return;
    const top = row.offsetTop - box.offsetTop;
    if (top < box.scrollTop) box.scrollTop = top - 8;
    else if (top + row.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = top + row.offsetHeight - box.clientHeight + 8;
  }, [currentKey]);

  /** One unit's places. In a lesson of many units they sit, shorter, under the unit's row. */
  function parts(u: number) {
    const unit = lesson.units[u]!;
    const at = (kind: 'overview' | 'learn' | 'practice') => positionOf(lesson, u, kind);
    const item = { position, onGo };
    return (
      <>
        <Item {...item} target={at('overview')} title="Overview" />
        <Group label={`Watch · ${unit.steps.length}`} />
        {unit.steps.map((step, i) => (
          <Item key={step.id} {...item} target={positionOf(lesson, u, 'step', i + 1)} title={step.title} number={i + 1} />
        ))}
        <Group label="Learn & Practice" />
        <Item {...item} target={at('learn')} title="Learn" />
        <Item {...item} target={at('practice')} title="Practice" />
      </>
    );
  }

  return (
    <>
      <div className="console__panel console__track" data-units={many ? 'many' : 'one'}>
        <div className="track__head">
          <div className="track__lesson">
            {/* A title too long for the column is cut short with an ellipsis; the whole of it stays in the heading. */}
            <h1 className="top__name" title={lesson.title}>
              {lesson.title}
            </h1>
            <span className="top__of">{`Lesson ${number} of ${total}`}</span>
          </div>
          <TrackGot entries={entries} currentKey={currentKey} progress={progress} />
        </div>
        {many ? (
          <div className="track__units">
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
          </div>
        ) : null}
        <nav className="track__nav" aria-label={`${trackTitle}, the track's lessons`}>
          <div ref={list} className="track__list">
            <TrackParts entries={entries} currentKey={currentKey} progress={progress} going={wait?.going ?? null} carried={carried} />
          </div>
        </nav>
      </div>
      <LessonsSheet
        entries={entries}
        currentKey={currentKey}
        progress={progress}
        trackTitle={trackTitle}
        trackUrl={trackUrl}
        open={sheetOpen}
        onClose={onSheetClose}
        wait={wait}
      />
    </>
  );
}

export default Outline;
