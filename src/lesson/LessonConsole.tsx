import { useCallback, useEffect, useId, useMemo, useRef, useState, type Dispatch, type ReactNode } from 'react';
import type { AvailableSummary, LessonSummary } from '../content/registry';
import type { FlowScene, Lesson, PlaygroundPreset, SceneEvent } from '../content/schema';
import { usePlayback, type PlaybackAction, type PlaybackState } from '../engine/playback';
import { currentEvents, deriveState, parseStepParam, resumeLabel, sectionsFor, type DerivedState, type Sections } from '../engine/timeline';
import { recordVisit, resumePosition } from '../progress/store';
import { useProgress } from '../progress/useProgress';
import NetworkView from '../scenes/flow/NetworkView';
import SequenceView from '../scenes/flow/SequenceView';
import Inspector from '../scenes/inspector/Inspector';
import SubnetCanvas from '../scenes/playground/subnet/SubnetCanvas';
import SubnetReadout from '../scenes/playground/subnet/SubnetReadout';
import { useSubnetPlayground } from '../scenes/playground/subnet/useSubnetPlayground';
import DeviceTablePanel from '../scenes/table/DeviceTablePanel';
import CheckYourself from './CheckYourself';
import EventLog from './EventLog';
import ExplanationPanel from './ExplanationPanel';
import Outline from './Outline';
import PlaybackControls from './PlaybackControls';
import RecapPanel from './RecapPanel';
import TopBar from './TopBar';
import TryItPanel from './TryItPanel';
import { useInspector } from './useInspector';
import { useLessonShortcuts } from './useLessonShortcuts';
import { useReducedMotion } from './useReducedMotion';
import './console.css';

export interface LessonConsoleProps {
  trackId: string;
  trackTitle: string;
  lesson: Lesson;
  entry: AvailableSummary;
  /** Every lesson the track plans, written or not: the "19" in "Lesson 9 of 19". */
  total: number;
  prev: AvailableSummary | null;
  next: AvailableSummary | null;
  nextPlanned: boolean;
  /** Every entry of the track, in order. */
  entries: LessonSummary[];
}

type View = FlowScene['views'][number];
const VIEW_LABEL: Record<View, string> = { network: 'Network', sequence: 'Sequence' };

const isAvailable = (entry: LessonSummary): entry is AvailableSummary => entry.available;

/**
 * The preset the playground shows at a position: each step's own; the first
 * step's on the Overview; the last step's at Try it, Check yourself and the Recap.
 */
function presetAt(lesson: Lesson, sections: Sections, position: number): PlaygroundPreset {
  const step = lesson.steps[Math.min(Math.max(position, 1), sections.stepCount) - 1];
  // Validation gives every step of a playground lesson a preset; this fallback is never reached by a valid lesson.
  return step?.preset ?? { address: '192.168.1.10', prefix: 24 };
}

/**
 * The id of the latest event of the current position that touched `tableId`.
 * Keying the table panel on it remounts the panel for each such event, so its
 * row pulse plays again even when two events in a row mark the same row.
 */
function lastTableEvent(events: SceneEvent[], played: number, tableId: string): string {
  for (let i = Math.min(played, events.length) - 1; i >= 0; i -= 1) {
    const event = events[i]!;
    if (event.type === 'table' && event.table === tableId) return event.id;
  }
  return 'none';
}

/**
 * Scrolls the centre panel, and nothing else, just far enough to show the row a
 * table event points at. The tables sit under the stage and the centre scrolls,
 * so on a short screen the rule or lease a step is about could be out of sight.
 * Where the centre does not scroll (one column on a phone, where the page does),
 * the row is left alone.
 */
function revealHighlightedRow(centre: HTMLElement, instant: boolean): void {
  const row = centre.querySelector<HTMLElement>('.device-table tr[data-highlight]');
  // A row that is not drawn (the inspector hides the scene) has no position to scroll to.
  if (row === null || row.offsetParent === null || getComputedStyle(centre).overflowY === 'visible') return;
  const rowBox = row.getBoundingClientRect();
  const room = centre.getBoundingClientRect();
  const above = rowBox.top - room.top;
  const below = rowBox.bottom - room.bottom;
  if (above >= 0 && below <= 0) return;
  // Whole pixels, rounded outwards, so the row is not left a fraction of a pixel short.
  const top = centre.scrollTop + (above < 0 ? Math.floor(above) : Math.ceil(below));
  centre.scrollTo({ top, behavior: instant ? 'auto' : 'smooth' });
}

function FinishedMarker() {
  return (
    <p className="console__finished">
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
        <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Finished
    </p>
  );
}

interface PlaygroundPanelsProps {
  preset: PlaygroundPreset;
  locked: boolean;
  position: number;
  dispatch: Dispatch<PlaybackAction>;
  /** The explanation. It goes between the canvas and the readout, the order a phone shows them in. */
  children: ReactNode;
}

/**
 * A playground lesson's grid cells in reading order: the canvas (centre), the
 * explanation, then the readout under the step buttons (bottom). The canvas and
 * the readout share one playground state, which starts over at every position,
 * so each position starts from its own preset and Try it's edits are dropped as
 * soon as the learner leaves it: nothing about Try it is kept (spec §10.5).
 * Only that state starts over (ruling R22): the cells stay mounted, so the
 * explanation's live region is never replaced.
 */
function PlaygroundPanels({ preset, locked, position, dispatch, children }: PlaygroundPanelsProps) {
  const state = useSubnetPlayground(preset, locked, position);
  return (
    <>
      <div className="console__center">
        <div className="console__stage" data-view="playground">
          <SubnetCanvas state={state} />
        </div>
      </div>
      {children}
      <div className="console__log">
        <div className="console__log-head">
          <p className="console__label" aria-hidden="true">
            Current values
          </p>
          {/* Nothing plays in a playground, so the steps are all there is to move through (ruling R29). */}
          <div className="console__controls">
            <PlaybackControls variant="steps" dispatch={dispatch} />
          </div>
        </div>
        <div className="console__log-body">
          <SubnetReadout state={state} />
        </div>
      </div>
    </>
  );
}

interface FlowLogProps {
  scene: FlowScene;
  derived: DerivedState;
  state: PlaybackState;
  hasEvents: boolean;
  dispatch: Dispatch<PlaybackAction>;
  onOpenPacket(packetId: string, n: number): void;
}

/** The bottom cell of a flow lesson: the playback controls over the event log. */
function FlowLog({ scene, derived, state, hasEvents, dispatch, onOpenPacket }: FlowLogProps) {
  return (
    <div className="console__log">
      <div className="console__log-head">
        <p className="console__label" aria-hidden="true">
          Event log
        </p>
        <div className="console__controls">
          <PlaybackControls state={state} hasEvents={hasEvents} dispatch={dispatch} />
        </div>
      </div>
      <div className="console__log-body">
        <EventLog state={derived} showTableColumn={scene.tables.length > 0} legend={scene.legend} onOpenPacket={onOpenPacket} />
      </div>
    </div>
  );
}

/**
 * The lesson page: top bar, outline, scene, explanation and event log, wired to
 * one playback state. It renders the Overview first, as the server did, and
 * only then follows a `?step=` link. Progress is recorded on every move.
 *
 * Keys (`useLessonShortcuts`): Space plays or pauses, → and ← move between
 * positions, Esc closes the inspector. The packet inspector's state and its
 * focus handling are in `useInspector`.
 */
export function LessonConsole({ trackId, trackTitle, lesson, entry, total, prev, next, nextPlanned, entries }: LessonConsoleProps) {
  const sections = useMemo(() => sectionsFor(lesson.steps.length), [lesson]);
  const [state, dispatch] = usePlayback(lesson);
  const { position, eventIndex, tryItChoice } = state;
  const derived = useMemo(() => deriveState(lesson, position, eventIndex, tryItChoice), [lesson, position, eventIndex, tryItChoice]);
  const events = currentEvents(lesson, position, tryItChoice);
  const reducedMotion = useReducedMotion();
  const scene = lesson.scene;
  const flow = scene.type === 'flow' ? scene : null;
  const trackUrl = `/${trackId}`;

  const actorLabel = useCallback(
    (id: string) => (lesson.scene.type === 'flow' ? (lesson.scene.actors.find((a) => a.id === id)?.label ?? id) : id),
    [lesson],
  );

  // ---------------------------------------------------------------- progress

  // Stable while the entries are, so the progress hook is not handed a new object on every render.
  const known = useMemo(() => Object.fromEntries(entries.filter(isAvailable).map((e) => [e.key, e.maxPosition])), [entries]);
  const progress = useProgress(known);
  const { update } = progress;
  const [deepLinked, setDeepLinked] = useState(false);

  // After the first render, which matched the server's Overview, follow a ?step= link.
  useEffect(() => {
    const target = parseStepParam(window.location.search, sections);
    if (target === null) return;
    setDeepLinked(true);
    dispatch({ type: 'jump', position: target });
  }, [sections, dispatch]);

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
      <button type="button" className="console__resume" onClick={() => dispatch({ type: 'jump', position: resumeAt })}>
        {`Resume at ${resumeLabel(resumeAt, sections.stepCount)}`}
      </button>
    );
  }

  // ---------------------------------------------------------------- inspector

  const explanation = useRef<HTMLElement>(null);
  const inspector = useInspector({ lesson, position, log: derived.log, dispatch, fallbackFocus: explanation });
  const { open } = inspector;

  // ---------------------------------------------------------------- outline drawer

  const [outlineOpen, setOutlineOpen] = useState(false);
  const drawer = useRef<HTMLDialogElement>(null);
  const drawerTitle = useId();

  useEffect(() => {
    const dialog = drawer.current;
    if (dialog === null) return;
    // jsdom has no showModal; the attribute alone is enough there.
    if (outlineOpen && !dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    } else if (!outlineOpen && dialog.open) {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }
  }, [outlineOpen]);

  const jump = useCallback((target: number) => dispatch({ type: 'jump', position: target }), [dispatch]);
  const jumpFromDrawer = useCallback(
    (target: number) => {
      setOutlineOpen(false);
      jump(target);
    },
    [jump],
  );

  // ---------------------------------------------------------------- keyboard

  useLessonShortcuts({ dispatch, canPlay: flow !== null, inspectorOpen: open !== null, closeInspector: inspector.close });

  // ---------------------------------------------------------------- view and explanation

  const [view, setView] = useState<View>(flow?.views[0] ?? 'network');
  // Only a change of view fades in; the first paint does not, and nothing fades under reduced motion.
  const [viewChanged, setViewChanged] = useState(false);
  const chooseView = (next: View) => {
    if (next === view) return;
    setView(next);
    setViewChanged(true);
  };

  useEffect(() => {
    // A new position starts reading from the top.
    if (explanation.current !== null) explanation.current.scrollTop = 0;
  }, [position]);

  let panel: ReactNode = null;
  if (position === sections.tryIt) {
    const done = tryItChoice !== null && !state.playing && eventIndex >= events.length;
    panel = (
      <TryItPanel
        tryIt={lesson.tryIt}
        chosen={tryItChoice}
        done={done}
        onChoose={(choiceId) => dispatch({ type: 'chooseTryIt', choiceId })}
      />
    );
  } else if (position === sections.check) {
    panel = <CheckYourself questions={lesson.check} />;
  } else if (position === sections.recap) {
    panel = <RecapPanel lesson={lesson} prev={prev} next={next} nextPlanned={nextPlanned} trackUrl={trackUrl} />;
  }

  // ---------------------------------------------------------------- flow centre

  const centre = useRef<HTMLDivElement>(null);
  // One string that changes whenever a table event plays, as the table panels' keys do.
  const tableEvents = flow === null ? '' : flow.tables.map((table) => lastTableEvent(events, eventIndex, table.id)).join('|');
  useEffect(() => {
    if (tableEvents !== '' && open === null && centre.current !== null) revealHighlightedRow(centre.current, reducedMotion);
  }, [tableEvents, position, view, open, reducedMotion]);

  let flowCenter: ReactNode = null;
  if (flow !== null) {
    const packetRows = derived.log.filter((row) => row.packet !== undefined);
    const index = open === null ? -1 : packetRows.findIndex((row) => row.n === open.n);
    const before = index > 0 ? packetRows[index - 1] : undefined;
    const after = index >= 0 ? packetRows[index + 1] : undefined;
    const openLogRow = open === null ? null : (derived.log.find((row) => row.n === open.n) ?? null);
    const packet = open === null ? undefined : flow.packets[open.packetId];

    flowCenter = (
      <div className="console__center" ref={centre}>
        {/* Hidden, not unmounted, under the inspector: the view keeps its scroll and the control that opened it. */}
        <div className="console__scene" hidden={open !== null}>
          {flow.views.length > 1 ? (
            <div className="console__views" role="group" aria-label="View">
              {flow.views.map((v) => (
                <button key={v} type="button" className="console__view" aria-pressed={v === view} onClick={() => chooseView(v)}>
                  {VIEW_LABEL[v]}
                </button>
              ))}
            </div>
          ) : null}
          <div key={view} className="console__stage" data-view={view} data-fade={viewChanged && !reducedMotion ? 'true' : undefined}>
            {view === 'network' ? (
              <NetworkView
                scene={flow}
                state={derived}
                reducedMotion={reducedMotion}
                speed={state.speed}
                onOpenPacket={inspector.openPacketFromScene}
              />
            ) : (
              <SequenceView scene={flow} state={derived} onOpenPacket={inspector.openPacketFromScene} />
            )}
          </div>
          {flow.tables.length > 0 ? (
            <div className="console__tables">
              {flow.tables.map((table) => (
                <DeviceTablePanel
                  key={`${table.id}:${lastTableEvent(events, eventIndex, table.id)}`}
                  table={table}
                  actorLabel={actorLabel(table.actor)}
                  state={derived.tables[table.id]!}
                />
              ))}
            </div>
          ) : null}
        </div>
        {open !== null && packet !== undefined ? (
          <div className="console__inspector" ref={inspector.boxRef}>
            <Inspector
              key={open.n}
              packet={packet}
              row={openLogRow}
              onClose={inspector.close}
              onPrev={before === undefined ? undefined : () => inspector.showRow(before, 'Previous packet')}
              onNext={after === undefined ? undefined : () => inspector.showRow(after, 'Next packet')}
            />
          </div>
        ) : null}
      </div>
    );
  }

  // ---------------------------------------------------------------- page

  const explain = (
    <section ref={explanation} className="console__explain" aria-label="Explanation" tabIndex={0}>
      <ExplanationPanel lesson={lesson} sections={sections} position={position} state={derived} actorLabel={actorLabel} resume={resume}>
        {panel}
      </ExplanationPanel>
    </section>
  );

  const outlineProps = {
    lesson,
    sections,
    position,
    entries,
    currentKey: entry.key,
    progress: progress.data,
  };

  return (
    <div className="console" data-scene={scene.type}>
      <TopBar
        lesson={lesson}
        trackTitle={trackTitle}
        trackUrl={trackUrl}
        number={entry.number}
        total={total}
        position={position}
        outlineOpen={outlineOpen}
        onOpenOutline={() => setOutlineOpen(true)}
      />

      <div className="console__outline">
        <Outline {...outlineProps} onJump={jump} />
      </div>

      <main id="main" className="console__main">
        {flow !== null ? (
          <>
            {flowCenter}
            {explain}
            <FlowLog
              scene={flow}
              derived={derived}
              state={state}
              hasEvents={events.length > 0}
              dispatch={dispatch}
              onOpenPacket={inspector.openPacket}
            />
          </>
        ) : (
          <PlaygroundPanels
            preset={presetAt(lesson, sections, position)}
            locked={position !== sections.tryIt}
            position={position}
            dispatch={dispatch}
          >
            {explain}
          </PlaygroundPanels>
        )}
      </main>

      <dialog
        ref={drawer}
        className="console__drawer"
        aria-labelledby={drawerTitle}
        onClose={() => setOutlineOpen(false)}
        // A click on the backdrop lands on the dialog itself; its content fills the box.
        onClick={(event) => {
          if (event.target === event.currentTarget) setOutlineOpen(false);
        }}
      >
        <div className="console__drawer-body">
          <div className="console__drawer-head">
            <h2 id={drawerTitle} className="console__drawer-title">
              Contents
            </h2>
            <button type="button" className="console__drawer-close" onClick={() => setOutlineOpen(false)}>
              <span aria-hidden="true">×</span> Close
            </button>
          </div>
          {outlineOpen ? <Outline {...outlineProps} onJump={jumpFromDrawer} /> : null}
        </div>
      </dialog>
    </div>
  );
}

export default LessonConsole;
