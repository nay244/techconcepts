import { flushSync } from 'react-dom';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AvailableSummary, LessonSummary } from '../content/registry';
import type { Lesson, Panel } from '../content/schema';
import { forwardButton, usePlayback } from '../engine/playback';
import { appliedEvents, deriveState, parseStepParam, resumeLabel, slotsFor, type Position } from '../engine/timeline';
import { knownFrom } from '../lib/entries';
import { STATUS_WORDS } from '../lib/hub';
import type { LessonDefinition } from '../lib/glossary';
import { recordVisit, resumePosition } from '../progress/store';
import { useProgress } from '../progress/useProgress';
import { DRIVERS } from '../scenes/drivers';
import { Explanation } from './Explanation';
import { LogPanel } from './LogPanel';
import { Outline } from './Outline';
import { PlaybackControls } from './PlaybackControls';
import type { Picks } from './Practice';
import { ScenePanel } from './ScenePanel';
import { TopBar } from './TopBar';
import { stepAnnouncement } from './announce';
import { useLessonShortcuts } from './useLessonShortcuts';
import { useMediaQuery } from './useMediaQuery';
import { useReducedMotion } from './useReducedMotion';
import './console.css';

/** What a phone shows under the scene: the words, the event log, or the lesson's own table. */
type Tab = 'explain' | 'log' | 'table';
const TABS: readonly { id: Tab; label: string }[] = [
  { id: 'explain', label: 'Explain' },
  { id: 'log', label: 'Log' },
];

/** The windows where the log and the table are always on screen and there are no tabs (console.css, "tablets"). */
const TABLET_SIDEWAYS = '(min-width: 900px) and (max-width: 1099px) and (orientation: landscape) and (min-height: 600px)';

/** The fourth tab's name, by what the unit's panel is. The message strip (OSI Model) has none: it stays under the scene. */
const PANEL_TAB: Partial<Record<Panel['type'], string>> = { table: 'Table', rules: 'Rules', bits: 'Bits' };

/**
 * The id of the latest applied event of the current step that changed the unit's panel, or null when none has: a row
 * of the table added, changed or matched; for the rule list, a visit checked against it, a connection remembered or a
 * reply matched to one. The bits board never changes it: its tab is not marked.
 */
function panelChange(panel: Panel | null, derived: ReturnType<typeof deriveState>): string | null {
  if (panel === null) return null;
  const changed = appliedEvents(derived).findLast((e) => {
    if (panel.type === 'table') return e.type === 'table' && e.table === panel.table.id;
    if (panel.type === 'rules') {
      if (e.type === 'table') return e.table === panel.rules.id || e.table === panel.conns.id;
      return e.type === 'message' && (e.check?.table === panel.rules.id || e.known?.table === panel.conns.id);
    }
    return false;
  });
  return changed?.id ?? null;
}

/** The row that decided, to bring into view when the tab opens: the table's marked row, or the rule that allowed or denied. */
const MARKED_ROW = '.tpanel [data-highlight], .rpanel [data-state="allow"], .rpanel [data-state="deny"]';

export interface LessonConsoleProps {
  trackId: string;
  trackTitle: string;
  lesson: Lesson;
  entry: AvailableSummary;
  /** Every lesson the track plans, written or not: the "20" in "Lesson 10 of 20". */
  total: number;
  /** The next ready lesson in the track, or null when this is the last one. */
  next: AvailableSummary | null;
  /** The next lesson's figure markup, drawn at build time, or null when there is no next lesson. */
  nextFigure: string | null;
  /** Every entry of the track, in order. */
  entries: LessonSummary[];
  /** The glossary's definitions for this lesson's terms, by term id (`definitionsFor`); left out, no term has one. */
  definitions?: Record<string, LessonDefinition>;
  /** The scene's figure, drawn at build time (the page's named slot). */
  figure?: ReactNode;
  /** What the figure's driver needs at runtime (`DrawnFigure.data`). */
  figureData?: unknown;
  /** Opens a page: "Next lesson" at the last Practice. Left out, the browser's own navigation; tests hand in their own. */
  navigate?: (url: string) => void;
}

/** What the log says while it is empty, unless the step says otherwise. */
const IDLE = 'Nothing has happened yet. Press Play to start.';

const NO_PICKS: Picks = {};

function FinishedMarker() {
  return (
    <p className="explain__finished">
      {STATUS_WORDS.done}
    </p>
  );
}

/**
 * The lesson page: the lesson's bar with its timeline, the track's lessons, the scene, the guide (the explanation, the
 * lesson's table, the playback controls) and the log, all driven by one playback state. It
 * renders the Overview first, as the server did, and only then follows a
 * `?step=` link. Every move is recorded as progress; Practice is never saved.
 *
 * Keys (`useLessonShortcuts`): Space plays all or pauses, → does what the forward button does wherever it stays in the lesson, ← goes back. A polite
 * live region says each step's title and, as it plays, its latest message,
 * then any table changes since (`stepAnnouncement`).
 *
 * Two things live in memory only, for as long as the page is open: the units
 * the learner has opened (a many-unit lesson's list ticks them) and the Practice picks, per
 * unit, so a visit elsewhere does not clear them.
 */
export function LessonConsole({ trackId, trackTitle, lesson, entry, total, next, nextFigure, entries, definitions, figure, figureData, navigate = (url) => window.location.assign(url) }: LessonConsoleProps) {
  // Each event waits as long as the figure's driver takes to play it.
  const [state, dispatch] = usePlayback(lesson, (e) => DRIVERS[lesson.figure].duration(e, figureData));
  const { position, eventIndex } = state;
  const derived = useMemo(() => deriveState(lesson, position, eventIndex), [lesson, position, eventIndex]);
  const { slot } = derived;
  const unit = lesson.units[derived.unit]!;
  const reducedMotion = useReducedMotion();
  const trackUrl = `/${trackId}`;
  const go = useCallback((target: Position) => dispatch({ type: 'go', position: target }), [dispatch]);

  // A jump whose button leaves with the old position (Resume, the end row's next unit) hands focus to the explanation.
  const explanation = useRef<HTMLElement>(null);
  const jump = useCallback(
    (target: Position) => {
      go(target);
      explanation.current?.focus();
    },
    [go],
  );

  // ---------------------------------------------------------------- the phone's tabs

  // On a phone, and on a tablet upright or under 900px wide, the scene stays put and one part shows under it
  // (console.css). On a tablet on its side there are no tabs; the log and the table are always on show,
  // so a chosen Log or Table shows the explanation there. From 1100px the buttons are hidden and this state changes
  // nothing.
  const consoleEl = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<Tab>('explain');
  const panelTab = unit.scene.panel === null ? undefined : PANEL_TAB[unit.scene.panel.type];
  // A unit without a table of its own (the next unit of a lesson) cannot keep its tab.
  useEffect(() => {
    if (tab === 'table' && panelTab === undefined) setTab('explain');
  }, [tab, panelTab]);
  // The last change the reader has seen in the panel: the tab says when there is one they have not. Not stored.
  const change = panelTab === undefined ? null : panelChange(unit.scene.panel, derived);
  const [changeSeen, setChangeSeen] = useState<string | null>(null);
  useEffect(() => {
    if (tab !== 'table' || change === null) return;
    setChangeSeen(change);
    consoleEl.current?.querySelector(MARKED_ROW)?.scrollIntoView?.({ block: 'nearest' });
  }, [tab, change]);
  // On a tablet on its side (900 to 1099px wide) the log and the lesson's table are on screen with the scene, so its
  // tabs are not shown: a reader who arrives with another one chosen (by turning the screen) lands on Explain.
  useEffect(() => {
    const sideways = window.matchMedia?.(TABLET_SIDEWAYS);
    if (!sideways) return;
    const settle = () => {
      if (sideways.matches) setTab((t) => (t === 'log' || t === 'table' ? 'explain' : t));
    };
    settle();
    sideways.addEventListener('change', settle);
    return () => sideways.removeEventListener('change', settle);
  }, []);
  const tabs = panelTab === undefined ? TABS : [...TABS, { id: 'table' as const, label: panelTab }];
  /** Going to a following unit's Overview shows the words for it. */
  const goFromOutline = useCallback(
    (target: Position) => {
      go(target);
      setTab('explain');
    },
    [go],
  );
  /** Learn and Practice are for reading: the phone gives the words more of the screen. */
  const reading = slot.kind === 'learn' || slot.kind === 'practice';

  // ---------------------------------------------------------------- where the lesson's table is

  // In a window 1100px wide and 890px tall or more, while watching, the lesson's table stands in the guide, between the
  // words and the controls (the scene's drawing then has the whole scene). Elsewhere it stays under the scene. The server
  // and the first render say "under the scene", as does the page without JavaScript.
  const [guideTable, setGuideTable] = useState<HTMLElement | null>(null);
  const roomForTable = useMediaQuery('(min-width: 1100px) and (min-height: 890px)');
  const tableInGuide = roomForTable && (slot.kind === 'overview' || slot.kind === 'step') && unit.scene.panel?.type !== 'labels';
  // The forward button shows its short form wherever the guide has less than the full form's room (under 1100px wide).
  const shortForward = useMediaQuery('(max-width: 1099px)');
  const [sheetOpen, setSheetOpen] = useState(false);

  // ---------------------------------------------------------------- in memory only

  /** Whether the log is open while reading Learn or Practice on a desktop; folded to its head until the reader opens it. */
  const [logOpen, setLogOpen] = useState(false);
  const toggleLog = useCallback(() => setLogOpen((open) => !open), []);

  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set([0]));
  useEffect(() => {
    setSeen((before) => (before.has(derived.unit) ? before : new Set(before).add(derived.unit)));
  }, [derived.unit]);

  /** Unit id to that unit's Practice picks. */
  const [picks, setPicks] = useState<Readonly<Record<string, Picks>>>({});
  const unitPicks = Object.hasOwn(picks, unit.id) ? picks[unit.id]! : NO_PICKS;
  const pick = useCallback(
    (questionId: string, option: number) =>
      setPicks((before) => ({ ...before, [unit.id]: { ...(Object.hasOwn(before, unit.id) ? before[unit.id] : {}), [questionId]: option } })),
    [unit.id],
  );

  // The forward button, and → with it wherever the button stays in the lesson. At the last Practice "Next lesson" opens
  // the next lesson, or does nothing when there is none; a key never leaves the page.
  const forward = forwardButton(lesson, state, { next, number: entry.number, total });
  const pressForward = () => {
    if (forward.disabled) return;
    if (forward.href !== undefined) navigate(forward.href);
    else if (slot.kind === 'practice') {
      // A following unit: its Overview, with the words showing on a phone and focus on them (the end row's jump).
      // Committed first: on a phone the words are hidden until the Explain tab shows, and a hidden panel cannot take focus.
      flushSync(() => goFromOutline(position + 1));
      explanation.current?.focus();
    } else dispatch({ type: 'next' });
  };
  useLessonShortcuts({
    toggle: () => dispatch({ type: 'toggle' }),
    next: () => {
      if (forward.href === undefined && !forward.disabled) pressForward();
    },
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
    // The first unit was only on screen for the server's render: the link's unit is the first one seen.
    // (This runs after the effect above that marks the first unit, so it replaces it.)
    setSeen(new Set([slotsFor(lesson)[target]!.unit]));
    dispatch({ type: 'go', position: target });
  }, [lesson, dispatch]);

  // Keyed on the position, never on the progress data: every update hands out a new data object.
  useEffect(() => {
    update((d) => recordVisit(d, entry.key, entry.trackId, position, entry.maxPosition, new Date()));
  }, [update, entry.key, entry.trackId, entry.maxPosition, position]);

  const record = Object.hasOwn(progress.data.lessons, entry.key) ? progress.data.lessons[entry.key] : undefined;
  const resumeAt = deepLinked ? null : resumePosition(progress.data, entry.key);
  let resume: ReactNode = null;
  if (record?.status === 'finished') resume = <FinishedMarker />;
  else if (resumeAt !== null) {
    resume = (
      <button type="button" className="cbtn explain__resume" onClick={() => jump(resumeAt)}>
        {`Resume at ${resumeLabel(lesson, resumeAt)}`}
      </button>
    );
  }

  // ---------------------------------------------------------------- what the step says

  // The latest log row, if this step played it: it pulses once.
  const latest = derived.log.at(-1);
  const fresh = latest !== undefined && derived.events.some((e) => e.id === latest.eventId) ? latest : null;
  const step = slot.kind === 'step' ? unit.steps[slot.step - 1]! : null;
  // At a step: its title, the latest row it has played, then any table changes since (stepAnnouncement). Elsewhere: the
  // place's name.
  const announcement = step === null ? resumeLabel(lesson, position) : stepAnnouncement(step.title, derived);
  // A step may say what its empty log means (How the Internet Works' quiet first steps); otherwise, and always at the Overview,
  // the unit's log says it, as the mockups' log does before anything has played.
  const idle = (step === null ? undefined : step.idle) ?? unit.scene.log.idle ?? IDLE;

  return (
    <div ref={consoleEl} className="console" data-tab={tab} data-reading={reading ? '' : undefined} data-log={reading && logOpen ? 'open' : undefined}>
      <TopBar
        lesson={lesson}
        trackTitle={trackTitle}
        trackUrl={trackUrl}
        number={entry.number}
        total={total}
        state={state}
        slot={slot}
        unit={unit}
        reducedMotion={reducedMotion}
        onGo={go}
        onOpenLessons={() => setSheetOpen(true)}
      />
      <Outline
        lesson={lesson}
        position={position}
        current={derived.unit}
        seen={seen}
        onGo={goFromOutline}
        entries={entries}
        currentKey={entry.key}
        progress={progress.data}
        trackTitle={trackTitle}
        trackUrl={trackUrl}
        number={entry.number}
        total={total}
        sheetOpen={sheetOpen}
        onSheetClose={() => setSheetOpen(false)}
      />
      <main id="main" className="console__main">
        <ScenePanel
          unit={unit}
          figure={figure ?? null}
          figureData={figureData}
          derived={derived}
          playback={state}
          reducedMotion={reducedMotion}
          panelHome={tableInGuide ? guideTable : null}
        />
        <div className="console__tabs" role="group" aria-label="Show">
          {tabs.map(({ id, label }) => {
            const marked = id === 'table' && tab !== 'table' && change !== null && change !== changeSeen;
            return (
              <button key={id} type="button" aria-pressed={tab === id} aria-label={marked ? `${label}, changed` : undefined} onClick={() => setTab(id)}>
                {label}
                {marked ? <span className="tab__mark" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
        <div className="console__panel console__guide">
          <Explanation
            lesson={lesson}
            position={position}
            slot={slot}
            unit={unit}
            panelRef={explanation}
            picked={unitPicks}
            onPick={pick}
            resume={resume}
            next={next}
            nextFigure={nextFigure}
            number={entry.number}
            total={total}
            trackUrl={trackUrl}
            definitions={definitions}
            onGo={go}
          />
          <div ref={setGuideTable} className="guide__table" />
          <div className="guide__foot">
            <PlaybackControls lesson={lesson} state={state} dispatch={dispatch} unit={unit} forward={forward} short={shortForward} onForward={pressForward} />
            <p className="keys">
              <kbd>Space</kbd>
              <span>play all or pause</span>
              <kbd>←</kbd>
              <span>back</span>
              <kbd>→</kbd>
              <span>next</span>
            </p>
          </div>
        </div>
        <LogPanel
          log={unit.scene.log}
          rows={derived.log}
          idle={idle}
          fresh={fresh?.eventId ?? null}
          fold={{ open: logOpen, onToggle: toggleLog }}
        />
      </main>
      <p className="sr-only" aria-live="polite" data-announce="">
        {announcement}
      </p>
    </div>
  );
}

export default LessonConsole;
