import type { Board, Cue, MessageEvent, NoteEvent, SceneEvent, Unit } from '../content/schema';
import type { TableState } from '../engine/tables';
import type { AppliedCue, DerivedState } from '../engine/timeline';

/**
 * What a figure shows at a moment of the lesson, settled: the unit's layers and
 * labels, and what has been applied so far. Built from the derived state, so
 * stepping back, jumping or pausing always shows the same thing a fresh
 * derivation would.
 */
export interface SceneView {
  /** The unit being shown, counting from 0. */
  unit: number;
  /** The figure's swappable layers this unit shows (`unit.scene.layers`). */
  layers: string[];
  /** Words the figure shows on its parts, by part id (`unit.scene.labels`). */
  labels: Record<string, string>;
  /**
   * Cues already in place as the unit starts (`unit.scene.start`), the same at
   * every position of the unit: the figure shows them under the cues that have
   * played. Empty for a unit that gives none.
   */
  start: Cue[];
  /**
   * What the latest step so far says the scene is doing as it starts
   * (`step.status`), or null: none at the Overview, or before any step sets one.
   * A step that sets none keeps the one before it. A status cue that has played
   * wins over it.
   */
  status: string | null;
  cues: AppliedCue[];
  tables: Record<string, TableState>;
  board: Board | null;
  /** The last applied event of the current step, or null. */
  active: SceneEvent | null;
  /**
   * The latest message or note of the current step that has been applied, or
   * null: what the scene shows as having just happened. A table event a
   * message brings with it (Firewalls' remembered connection) does not take
   * its place: while that table event lands, `active` is the table event and
   * `landed` is still the message.
   */
  landed: MessageEvent | NoteEvent | null;
}

/** The latest message or note of the current step that has been applied, or null (`SceneView.landed`). */
export function landedEvent(derived: DerivedState): MessageEvent | NoteEvent | null {
  const played = derived.active === null ? 0 : derived.events.indexOf(derived.active) + 1;
  for (let i = played - 1; i >= 0; i -= 1) {
    const event = derived.events[i]!;
    if (event.type !== 'table') return event;
  }
  return null;
}

/** The scene view for a unit at a derived moment. */
export function sceneViewOf(unit: Unit, derived: DerivedState): SceneView {
  const { kind, step } = derived.slot;
  // The steps that have started: none at the Overview, every one at Learn and Practice.
  const started = kind === 'overview' ? 0 : kind === 'step' ? step : unit.steps.length;
  const status = unit.steps.slice(0, started).reduce<string | null>((latest, s) => s.status ?? latest, null);
  return {
    unit: derived.unit,
    layers: unit.scene.layers,
    labels: unit.scene.labels,
    start: unit.scene.start,
    status,
    cues: derived.cues,
    tables: derived.tables,
    board: derived.board,
    active: derived.active,
    landed: landedEvent(derived),
  };
}

/**
 * Moves one figure's parts. The figure's SVG is drawn at build time; the driver
 * only finds its named parts, moves them and toggles their classes.
 *
 * - `show` draws the settled scene, with no motion: everything applied in
 *   `view`, nothing in flight. It is called on every change, and after any play
 *   is aborted, so it must clear whatever a play left behind.
 * - `play` animates one event from the settled `view` (the event is not in it
 *   yet). Each segment takes its 1× time divided by `speed`, so the whole play
 *   fits the wait that playback makes (`DriverModule.duration`). Under reduced
 *   motion nothing travels or pulses, but the event's end state still shows.
 *   Once `signal` aborts, play must not touch the figure again: it resolves,
 *   and `show` follows. It never rejects on an abort.
 *   After every `await`, play returns at once if `o.signal.aborted`, and
 *   never touches the figure after that.
 *   The one write an abort still makes is `animate`'s own `frame(1)` for the
 *   tween it cuts short, which runs inside the abort itself, before `show`.
 *   An `animate` started on a signal that is already aborted calls nothing.
 * - `destroy` lets go of the figure when the console leaves the page.
 */
export interface SceneDriver {
  show(view: SceneView): void;
  play(event: SceneEvent, view: SceneView, o: PlayOptions): Promise<void>;
  destroy(): void;
}

/** A row of the panel under the scene, as the driver reads it (Firewalls' rule list). */
export interface PanelMark {
  row: number;
  state: 'check' | 'miss' | 'allow' | 'deny';
}

export interface PlayOptions {
  speed: number;
  reducedMotion: boolean;
  signal: AbortSignal;
  /** Called as the play reads each row of the panel, in reading order. */
  onMark?: (m: PanelMark) => void;
}

/** One figure's driver: how to make it, and how long each event plays. */
export interface DriverModule {
  create(root: SVGSVGElement, data: unknown): SceneDriver;
  /**
   * How long `event` plays, in ms at 1×: the sum of the mockup's waits and
   * tweens for that event, including the gap after it. Playback waits this long
   * (divided by the speed) before it applies the event.
   */
  duration(event: SceneEvent, data: unknown): number;
}
