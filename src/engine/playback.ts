import { useEffect, useEffectEvent, useMemo, useReducer, type Dispatch } from 'react';
import type { Lesson, SceneEvent } from '../content/schema';
import { slotsFor, stepEvents, type Position } from './timeline';

/** The speed button's values, in the order a click cycles through them. */
export const SPEEDS = [0.5, 1, 1.5, 2] as const;
export type Speed = (typeof SPEEDS)[number];

/** How long a run holds on a finished step before the next one, in ms at 1×. */
export const HOLD_MS = 2600;

/** How long an event takes to play, in ms at 1×. The lesson's driver supplies it, because scenes time events by route length. */
export type DurationOf = (e: SceneEvent) => number;

/**
 * What playback is doing:
 * - `'idle'`: nothing is playing.
 * - `'step'`: a step reached by hand plays once.
 * - `'run'`: Play is running the unit's steps, and this one is playing.
 * - `'hold'`: the run has finished this step and waits before the next.
 */
export type Mode = 'idle' | 'step' | 'run' | 'hold';

export interface PlaybackState {
  position: Position;
  /** How many of the step's events have been applied. While a step plays, the next one is pending. */
  eventIndex: number;
  mode: Mode;
  /** A run has finished the unit's last step, so Play reads Replay and starts the unit over. */
  ended: boolean;
  speed: Speed;
}

export type PlaybackAction =
  | { type: 'go'; position: Position }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'toggle' }
  /** Ends the pending event's wait. It names the event it was set for, so a late one is ignored. */
  | { type: 'tick'; position: Position; eventIndex: number }
  /** Ends a hold. It names the step it was set for, so a late one is ignored. */
  | { type: 'holdDone'; position: Position }
  | { type: 'cycleSpeed' };

export function initialPlayback(): PlaybackState {
  return { position: 0, eventIndex: 0, mode: 'idle', ended: false, speed: 1 };
}

/**
 * The rules for playing a lesson, after the mockups. Moving by hand (`go`,
 * `next`, `prev`) stops any run and plays that step once. Play (`toggle`) runs
 * every step of the current unit, from the current step or else the unit's
 * first, holding between steps; during a run it pauses with the step shown
 * complete. The state is only a cursor: what the scene shows comes from
 * `deriveState(lesson, position, eventIndex)`.
 */
export function createPlaybackReducer(lesson: Lesson): (s: PlaybackState, a: PlaybackAction) => PlaybackState {
  const slots = slotsFor(lesson);
  const last = slots.length - 1;
  const eventCount = (p: Position) => stepEvents(lesson, p).length;

  /** A hand move. A position out of range (or not a whole number) is read as the nearest one, as the timeline does. */
  function go(s: PlaybackState, target: Position): PlaybackState {
    const position = Number.isNaN(target) ? 0 : Math.min(Math.max(Math.trunc(target), 0), last);
    return { ...s, position, eventIndex: 0, mode: eventCount(position) > 0 ? 'step' : 'idle', ended: false };
  }

  /** The run plays the step at `position` from its first event. */
  function runFrom(s: PlaybackState, position: Position): PlaybackState {
    return settle({ ...s, position, eventIndex: 0, mode: 'run', ended: false });
  }

  /**
   * Once every event of the step has been applied: a hand-played step idles,
   * and a run holds before the unit's next step, or ends after its last one.
   * A step with no events is complete the moment it starts.
   */
  function settle(s: PlaybackState): PlaybackState {
    if (s.eventIndex < eventCount(s.position)) return s;
    if (s.mode === 'step') return { ...s, mode: 'idle' };
    const next = slots[s.position + 1];
    return next?.kind === 'step' && next.unit === slots[s.position]!.unit
      ? { ...s, mode: 'hold' }
      : { ...s, mode: 'idle', ended: true };
  }

  function toggle(s: PlaybackState): PlaybackState {
    if (s.mode === 'run' || s.mode === 'hold') return { ...s, mode: 'idle', eventIndex: eventCount(s.position) };
    const slot = slots[s.position]!;
    if (slot.kind === 'step' && !s.ended) return runFrom(s, s.position);
    // The Overview, Learn, Practice or a finished run: start from the unit's first step.
    const first = slots.findIndex((x) => x.unit === slot.unit && x.kind === 'step');
    return first === -1 ? s : runFrom(s, first);
  }

  return (s, a) => {
    switch (a.type) {
      case 'go':
        return go(s, a.position);
      case 'next':
        return go(s, s.position + 1);
      case 'prev':
        return go(s, s.position - 1);
      case 'toggle':
        return toggle(s);
      case 'tick':
        if ((s.mode !== 'step' && s.mode !== 'run') || a.position !== s.position || a.eventIndex !== s.eventIndex) return s;
        return settle({ ...s, eventIndex: s.eventIndex + 1 });
      case 'holdDone':
        return s.mode === 'hold' && a.position === s.position ? runFrom(s, s.position + 1) : s;
      case 'cycleSpeed':
        return { ...s, speed: SPEEDS[(SPEEDS.indexOf(s.speed) + 1) % SPEEDS.length]! };
    }
  };
}

/** The Play button's label. */
export function playLabel(lesson: Lesson, s: PlaybackState): 'Play' | 'Pause' | 'Replay' | 'Watch again' {
  if (s.mode === 'run' || s.mode === 'hold') return 'Pause';
  const kind = slotsFor(lesson)[s.position]?.kind;
  if (kind === 'learn' || kind === 'practice') return 'Watch again';
  return s.ended ? 'Replay' : 'Play';
}

/** During a hold, the step it leads to and how long it lasts: the top bar fills that step's segment over `ms`. */
export function holding(s: PlaybackState): { next: Position; ms: number } | null {
  return s.mode === 'hold' ? { next: s.position + 1, ms: HOLD_MS / s.speed } : null;
}

/**
 * The event playing now: the scene animates it during its wait, and the tick
 * that ends the wait applies it. Null when nothing is playing.
 */
export function pendingEvent(lesson: Lesson, s: PlaybackState): SceneEvent | null {
  if (s.mode !== 'step' && s.mode !== 'run') return null;
  return stepEvents(lesson, s.position)[s.eventIndex] ?? null;
}

/**
 * Playback state for a lesson. It waits out the pending event
 * (`durationOf(event) / speed`) and then ticks, and waits out a hold
 * (`HOLD_MS / speed`) and then ends it. The wait is cancelled and restarted on
 * every state change and cancelled on unmount. Reduced motion changes no wait:
 * the scene skips its motion, but a run keeps its pace.
 */
export function usePlayback(lesson: Lesson, durationOf: DurationOf): [PlaybackState, Dispatch<PlaybackAction>] {
  const reducer = useMemo(() => createPlaybackReducer(lesson), [lesson]);
  const [state, dispatch] = useReducer(reducer, undefined, initialPlayback);
  // Read when a wait starts, so a new durationOf on each render does not restart the wait.
  const msAt1x = useEffectEvent((event: SceneEvent) => durationOf(event));

  useEffect(() => {
    const { position, eventIndex, speed } = state;
    const hold = holding(state);
    if (hold !== null) {
      const timer = setTimeout(() => dispatch({ type: 'holdDone', position }), hold.ms);
      return () => clearTimeout(timer);
    }
    const event = pendingEvent(lesson, state);
    if (event === null) return;
    const timer = setTimeout(() => dispatch({ type: 'tick', position, eventIndex }), msAt1x(event) / speed);
    return () => clearTimeout(timer);
  }, [lesson, state]);

  return [state, dispatch];
}
