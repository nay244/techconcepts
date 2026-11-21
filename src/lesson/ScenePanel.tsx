import { useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { FigureId } from '../art/scenes/types';
import type { SceneEvent, Unit } from '../content/schema';
import type { PlaybackState } from '../engine/playback';
import type { DerivedState } from '../engine/timeline';
import { sceneViewOf, type PanelMark, type PlayOptions, type SceneDriver, type SceneView } from '../scenes/driver';
import { DRIVERS } from '../scenes/drivers';
import { SequenceView } from '../scenes/SequenceView';
import { UnitPanel } from './panels/UnitPanel';

export interface ScenePanelProps {
  unit: Unit;
  /** The lesson's figure, drawn at build time: the page's static slot, holding one `svg[data-figure]`. */
  figure: ReactNode;
  /** What the figure's driver reads at runtime (`DrawnFigure.data`). */
  figureData: unknown;
  derived: DerivedState;
  playback: PlaybackState;
  reducedMotion: boolean;
  /**
   * Where the lesson's table stands when it is not under the scene: an element in the guide. Null keeps it under the
   * scene. It is one panel either way: the same component, drawn into another place.
   */
  panelHome?: HTMLElement | null;
}

type View = 'network' | 'sequence';

/** The marks a play has reported, with the playback state that play was started for. */
interface Marks {
  for: PlaybackState | null;
  list: readonly PanelMark[];
}

/** The row being read: a panel marks it current while the driver reads it (the rules panel, `aria-current="true"` on `data-state="check"`). */
export const READ_ROW = '.tpanel tbody tr[aria-current="true"], .rpanel tbody tr[aria-current="true"]';
/** The row that decided, to bring into view (in the Table tab, and in the guide's table): the table's marked row, or the rule that allowed or denied. */
export const MARKED_ROW = '.tpanel [data-highlight], .rpanel [data-state="allow"], .rpanel [data-state="deny"]';
/** The connection a landed reply belongs to. */
export const KNOWN_CHIP = '.rpanel__chip[data-known]';

/** The table box the reader has taken by hand, and the box the follow last found drawn. */
export interface Hold {
  held: Element | null;
  drawn: Element | null;
}

/**
 * Keeps one row of a lesson's table in its own box: the row being read, else the row the step marked, else the connection a
 * reply belongs to (in that order, the first that exists). Only the box's `scrollTop` is set, so it moves at once and the page
 * and the guide never move. A box that is not drawn is left alone. A box the reader has taken (`hold`) is left alone while it
 * is the same box and was drawn at the last commit; a box that was remade, moved or hidden since is followed again.
 */
export function keepRowInView(root: ParentNode, hold?: Hold): void {
  let row: HTMLElement | null = null;
  for (const selector of [READ_ROW, MARKED_ROW, KNOWN_CHIP]) {
    row = root.querySelector<HTMLElement>(selector);
    if (row !== null) break;
  }
  const box = row?.closest<HTMLElement>('.tpanel, .rpanel');
  if (row === null || box == null) return;
  const p = box.getBoundingClientRect();
  if (p.height === 0) {
    if (hold !== undefined && hold.drawn === box) hold.drawn = null;
    return;
  }
  if (hold !== undefined) {
    if (hold.drawn !== box) hold.held = null;
    hold.drawn = box;
    if (hold.held === box) return;
  }
  const r = row.getBoundingClientRect();
  const first = row.matches('tbody tr:first-child');
  if (r.height > p.height - 8) {
    // A row too tall for its box with 4px either side: its top first, so the box does not flip between its two ends.
    if (r.top < p.top && first) box.scrollTop = 0;
    else if (Math.abs(r.top - (p.top + 4)) > 0.5) box.scrollTop += r.top - (p.top + 4);
  } else if (r.top < p.top && first) box.scrollTop = 0;
  else if (r.top < p.top) box.scrollTop -= p.top - r.top + 4;
  else if (r.bottom > p.bottom) box.scrollTop += r.bottom - p.bottom + 4;
}

const HAND_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

const NO_MARK_LIST: readonly PanelMark[] = [];
const NO_MARKS: Marks = { for: null, list: NO_MARK_LIST };

/** Says what went wrong in a driver, while the site is being built; the learner's page carries on either way. */
function report(error: unknown): void {
  if (import.meta.env.DEV) console.error('The scene driver could not play an event.', error);
}

/** Starts a play, catching a driver that fails, whether it throws or its promise rejects: the scene stays as `show` left it. */
function playSafely(d: SceneDriver, event: SceneEvent, view: SceneView, o: PlayOptions): void {
  try {
    d.play(event, view, o).catch(report);
  } catch (error) {
    report(error);
  }
}

/**
 * The scene: its title, the Network / Sequence switch when the unit has both
 * views, the figure (or the Sequence view), and the unit's panel under it.
 *
 * The figure is the page's static markup; its driver moves it. On every change
 * the driver shows the settled scene for the derived state. While an event is
 * pending, the driver plays it in the wait that playback makes, and each new
 * playback state (a tick, a move, a pause, a new speed) aborts the running play
 * first, because it also restarts that wait. The Sequence view leaves the
 * hidden figure alone; coming back to Network shows it settled as it now stands,
 * and the event in flight is not replayed.
 *
 * A play is always stopped before its driver goes: when the console leaves the
 * page, and when new figure data remakes the driver (which then shows the
 * scene as it stands, again without a replay).
 */
export function ScenePanel({ unit, figure, figureData, derived, playback, reducedMotion, panelHome = null }: ScenePanelProps) {
  const titleId = useId();
  const [chosen, setChosen] = useState<View>('network');
  const hasSequence = unit.scene.views.length > 1;
  const view: View = hasSequence ? chosen : 'network';
  const [marks, setMarks] = useState<Marks>(NO_MARKS);

  // The figure's driver, made once the figure is on the page and let go when it leaves.
  const figureBox = useRef<HTMLDivElement>(null);
  const driver = useRef<SceneDriver | null>(null);
  // The running play's controller, so the driver's cleanup can stop it first: React runs this layout effect's cleanup before the play effect's.
  const running = useRef<AbortController | null>(null);
  // This and the play effect below are layout effects, not passive ones, on purpose: a timer's update (Play all's tick) commits
  // in the Default lane, and a passive effect would then run a frame later, so the words would paint a frame before the figure.
  // As layout effects the figure is shown and its play started in the same commit as the words. Keep them in this order, and keep them layout effects.
  useLayoutEffect(() => {
    const svg = figureBox.current?.querySelector<SVGSVGElement>('svg[data-figure]');
    const id = svg?.getAttribute('data-figure');
    if (svg == null || id == null || !Object.hasOwn(DRIVERS, id)) return;
    const made = DRIVERS[id as FigureId].create(svg, figureData);
    driver.current = made;
    return () => {
      running.current?.abort();
      driver.current = null;
      made.destroy();
    };
  }, [figureData]);

  const scene = useMemo(() => sceneViewOf(unit, derived), [unit, derived]);
  // `pendingEvent(lesson, playback)`, from what is already derived: `derived.events` is the step's events.
  const pending = playback.mode === 'step' || playback.mode === 'run' ? (derived.events[playback.eventIndex] ?? null) : null;

  // The playback state the latest play was started for. A play starts once per state, so a return to Network does not replay.
  // `figureData` is here because new data remakes the driver (the effect above), and the new driver must show the scene too.
  const playedFor = useRef<PlaybackState | null>(null);
  const hold = useRef<Hold>({ held: null, drawn: null });
  // A layout effect, in the same commit as the words (see the driver's effect above); declared after it, so it finds the driver made.
  useLayoutEffect(() => {
    const isNew = playedFor.current !== playback;
    playedFor.current = playback;
    // A new playback state with an event to play (the next event, Replay, a new speed, Resume) lets the reader's table go.
    // Before the guards below: the Sequence view and a missing driver start no play, but the reader's hold still ends.
    if (isNew && pending !== null) hold.current.held = null;
    const d = driver.current;
    if (d === null || view !== 'network') return;
    d.show(scene);
    if (pending === null || !isNew) return;

    const controller = new AbortController();
    const { signal } = controller;
    running.current = controller;
    playSafely(d, pending, scene, {
      speed: playback.speed,
      reducedMotion,
      signal,
      onMark: (mark) => {
        if (signal.aborted) return;
        setMarks((m) => ({ for: playback, list: m.for === playback ? [...m.list, mark] : [mark] }));
      },
    });
    return () => {
      controller.abort();
      if (running.current === controller) running.current = null;
      setMarks(NO_MARKS);
    };
  }, [view, scene, playback, pending, reducedMotion, figureData]);

  // The event's marks go with its play: they show only while that very play is on, so the render that applies the event
  // (or moves the learner on) already has none, before the cleanup above has cleared them.
  const shownMarks = view === 'network' && marks.for === playback ? marks.list : NO_MARK_LIST;

  // The row that has just played, if this step played it (as the log's fresh row).
  const latest = derived.log.at(-1);
  const current = latest !== undefined && derived.events.some((e) => e.id === latest.eventId) ? latest : null;

  // The table's own box keeps one row in view, wherever the table is drawn (the guide, the Table tab, under the scene), in the
  // commit of every mark, tick and event: Play all advances on a timer, and a passive effect could run a frame after the row is
  // painted. A layout effect with no dependency list, declared after the play effect, so a let-go there comes first. Only the
  // box's own scroll moves: the page and the guide never do. A resize that changes the box is not followed until the next commit.
  const sectionRef = useRef<HTMLElement>(null);
  const place = useRef(`${derived.slot.unit}/${derived.slot.kind}/${derived.slot.step}`);
  useLayoutEffect(() => {
    // The console moved to another place: compared by value, here, so the commit that lands it already follows.
    const here = `${derived.slot.unit}/${derived.slot.kind}/${derived.slot.step}`;
    if (place.current !== here) {
      place.current = here;
      hold.current.held = null;
    }
    const root = panelHome ?? sectionRef.current;
    if (root !== null) keepRowInView(root, hold.current);
  });

  // The reader takes the table with a wheel, a touch, a press or a scrolling key on its box. A scroll made by script does not.
  const take = (target: EventTarget) => {
    const box = target instanceof Element ? target.closest('.tpanel, .rpanel') : null;
    if (box !== null) hold.current = { held: box, drawn: box };
  };
  const takeKey = (event: KeyboardEvent) => {
    if (HAND_KEYS.has(event.key)) take(event.target);
  };

  const panel = <UnitPanel panel={unit.scene.panel} derived={derived} marks={shownMarks} playing={pending} />;

  return (
    <section
      ref={sectionRef}
      className="console__panel console__stage"
      aria-labelledby={titleId}
      onWheel={(e) => take(e.target)}
      onTouchStart={(e) => take(e.target)}
      onPointerDown={(e) => take(e.target)}
      onKeyDown={takeKey}
    >
      <div className="stage__head">
        {hasSequence ? (
          <div className="stage__views" role="group" aria-label="View">
            <button type="button" aria-pressed={view === 'network'} onClick={() => setChosen('network')}>
              Network
            </button>
            <button type="button" aria-pressed={view === 'sequence'} onClick={() => setChosen('sequence')}>
              Sequence
            </button>
          </div>
        ) : null}
        <h2 id={titleId} className="console__ptitle stage__title">
          {unit.scene.title}
        </h2>
      </div>
      <div className="console__scene">
        <div ref={figureBox} className="stage__figure" hidden={view !== 'network'}>
          {figure}
        </div>
        {view === 'sequence' ? <SequenceView parties={unit.scene.parties} rows={derived.log} current={current} /> : null}
      </div>
      {panelHome === null ? panel : createPortal(panel, panelHome)}
    </section>
  );
}
