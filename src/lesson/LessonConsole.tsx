import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AvailableSummary, LessonSummary } from '../content/registry';
import type { Lesson } from '../content/schema';
import { usePlayback, type DurationOf } from '../engine/playback';
import { deriveState, parseStepParam, resumeLabel, type Position } from '../engine/timeline';
import { knownFrom } from '../lib/entries';
import { recordVisit, resumePosition } from '../progress/store';
import { useProgress } from '../progress/useProgress';
import { Explanation } from './Explanation';
import { LogPanel } from './LogPanel';
import { Outline } from './Outline';
import { PlaybackControls } from './PlaybackControls';
import { TopBar } from './TopBar';
import { useLessonShortcuts } from './useLessonShortcuts';
import { useReducedMotion } from './useReducedMotion';
import './console.css';

export interface LessonConsoleProps {
  trackId: string;
  trackTitle: string;
  lesson: Lesson;
  entry: AvailableSummary;
  /** Every lesson the track plans, written or not: the "20" in "Lesson 10 of 20". */
  total: number;
  /** The next ready lesson in the track, or null when this is the last one. */
  next: AvailableSummary | null;
  /** Every entry of the track, in order. */
  entries: LessonSummary[];
  /** The scene's figure, drawn at build time (the page's named slot). */
  figure?: ReactNode;
  /** What the figure's driver needs at runtime. Unused until the scene host arrives (Task 9). */
  figureData?: unknown;
}

/** Every event takes a second until the scene's driver says how long it really takes (Task 9). */
const durationOf: DurationOf = () => 1000;

/** What the log says while it is empty, unless the step says otherwise. */
const IDLE = 'Nothing has happened yet. Press Play to start.';

function FinishedMarker() {
  return (
    <p className="explain__finished">
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
        <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Finished
    </p>
  );
}

/**
 * The lesson page: the top bar, the outline, the scene, the explanation and
 * the log with its playback controls, all driven by one playback state. It
 * renders the Overview first, as the server did, and only then follows a
 * `?step=` link. Every move is recorded as progress; Practice is never saved.
 *
 * Keys (`useLessonShortcuts`): Space plays or pauses, → and ← move. A polite
 * live region says each step's title and, as it plays, its latest message.
 */
export function LessonConsole({ trackId, trackTitle, lesson, entry, total, next, entries, figure }: LessonConsoleProps) {
  const [state, dispatch] = usePlayback(lesson, durationOf);
  const { position, eventIndex } = state;
  const derived = useMemo(() => deriveState(lesson, position, eventIndex), [lesson, position, eventIndex]);
  const { slot } = derived;
  const unit = lesson.units[derived.unit]!;
  const reducedMotion = useReducedMotion();
  const trackUrl = `/${trackId}`;
  const go = useCallback((target: Position) => dispatch({ type: 'go', position: target }), [dispatch]);

  useLessonShortcuts({
    toggle: () => dispatch({ type: 'toggle' }),
    next: () => dispatch({ type: 'next' }),
    prev: () => dispatch({ type: 'prev' }),
  });

  // ---------------------------------------------------------------- progress

  // Stable while the entries are, so the progress hook is not handed a new object on every render.
  const known = useMemo(() => knownFrom(entries), [entries]);
  const progress = useProgress(known);
  const { update } = progress;
  const [deepLinked, setDeepLinked] = useState(false);

  // After the first render, which matched the server's Overview, follow a ?step= link.
  useEffect(() => {
    const target = parseStepParam(window.location.search, lesson);
    if (target === null) return;
    setDeepLinked(true);
    dispatch({ type: 'go', position: target });
  }, [lesson, dispatch]);

  // Keyed on the position, never on the progress data: every update hands out a new data object.
  useEffect(() => {
    update((d) => recordVisit(d, entry.key, position, entry.maxPosition, new Date()));
  }, [update, entry.key, entry.maxPosition, position]);

  const record = Object.hasOwn(progress.data.lessons, entry.key) ? progress.data.lessons[entry.key] : undefined;
  const resumeAt = deepLinked ? null : resumePosition(progress.data, entry.key);
  let resume: ReactNode = null;
  if (record?.status === 'finished') resume = <FinishedMarker />;
  else if (resumeAt !== null) {
    resume = (
      <button type="button" className="cbtn explain__resume" onClick={() => go(resumeAt)}>
        {`Resume at ${resumeLabel(lesson, resumeAt)}`}
      </button>
    );
  }

  // ---------------------------------------------------------------- what the step says

  // The latest log row, if this step played it: it pulses once and is announced.
  const latest = derived.log.at(-1);
  const fresh = latest !== undefined && derived.events.some((e) => e.id === latest.eventId) ? latest : null;
  const step = slot.kind === 'step' ? unit.steps[slot.step - 1]! : null;
  const announcement = step === null ? resumeLabel(lesson, position) : fresh === null ? step.title : `${step.title}. ${fresh.plain}`;
  // A step may say what its empty log means; elsewhere the unit's first step speaks for it.
  const idle = (step === null ? unit.steps[0]?.idle : step.idle) ?? IDLE;

  return (
    <div className="console">
      <TopBar
        lesson={lesson}
        trackTitle={trackTitle}
        trackUrl={trackUrl}
        number={entry.number}
        total={total}
        state={state}
        reducedMotion={reducedMotion}
        entries={entries}
        currentKey={entry.key}
        progress={progress.data}
      />
      <Outline lesson={lesson} position={position} onGo={go} entries={entries} currentKey={entry.key} progress={progress.data} />
      <main id="main" className="console__main">
        {/* The scene host (Task 9) replaces this box's contents. */}
        <div className="console__panel console__stage">
          <div className="console__scene">{figure ?? null}</div>
        </div>
        <Explanation
          lesson={lesson}
          position={position}
          resume={resume}
          next={next}
          number={entry.number}
          total={total}
          trackUrl={trackUrl}
          onGo={go}
        />
        <LogPanel
          log={unit.scene.log}
          rows={derived.log}
          idle={idle}
          fresh={fresh?.eventId ?? null}
          controls={<PlaybackControls lesson={lesson} state={state} dispatch={dispatch} />}
        />
      </main>
      <p className="sr-only" aria-live="polite" data-announce="">
        {announcement}
      </p>
    </div>
  );
}

export default LessonConsole;
