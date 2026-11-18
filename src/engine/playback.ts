import { useCallback, useEffect, useEffectEvent, useMemo, useReducer, type Dispatch } from 'react';
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
 * - `'step'`: a step reached by hand, or replayed, plays once.
 * - `'run'`: Play all is running the unit's steps, and this one is playing.
 * - `'hold'`: the run has finished this step and waits before the next.
 */
export type Mode = 'idle' | 'step' | 'run' | 'hold';

export interface PlaybackState {
  position: Position;
  /** How many of the step's events have been applied. While a step plays, the next one is pending. */
  eventIndex: number;
  mode: Mode;
  speed: Speed;
}

/**
 * A hand move (`go`, `next`, `prev`) says whether the step lands complete at once (`instant`, true when the reader asked
 * for reduced motion at the moment of the move; left out, false). `usePlayback`'s dispatch fills it in.
 */
export type PlaybackAction =
  | { type: 'go'; position: Position; instant?: boolean }
  | { type: 'next'; instant?: boolean }
  | { type: 'prev'; instant?: boolean }
  /** Play all from the unit's first step, or Pause while a run is going. */
  | { type: 'toggle' }
  /** Plays the current Watch step again from its first message, with its waits. A hand action: it stops a run. */
  | { type: 'replay' }
  /** Ends the pending event's wait. It names the event it was set for, so a late one is ignored. */
  | { type: 'tick'; position: Position; eventIndex: number }
  /** Ends a hold. It names the step it was set for, so a late one is ignored. */
  | { type: 'holdDone'; position: Position }
  | { type: 'cycleSpeed' };

export function initialPlayback(): PlaybackState {
  return { position: 0, eventIndex: 0, mode: 'idle', speed: 1 };
}

/**
 * The rules for playing a lesson, after the mockups. Moving by hand (`go`,
 * `next`, `prev`) stops any run and plays that step once (or lands it complete
 * when `instant`). Play all (`toggle`) runs every step of the current unit
 * from the unit's first, holding between steps; during a run it pauses with
 * the step shown complete. `replay` plays the current step again. The state is only a cursor: what the scene shows comes from
 * `deriveState(lesson, position, eventIndex)`.
 */
export function createPlaybackReducer(lesson: Lesson): (s: PlaybackState, a: PlaybackAction) => PlaybackState {
  const slots = slotsFor(lesson);
  const last = slots.length - 1;
  const eventCount = (p: Position) => stepEvents(lesson, p).length;

  /** A hand move. A position out of range (or not a whole number) is read as the nearest one, as the timeline does. */
  function go(s: PlaybackState, target: Position, instant = false): PlaybackState {
    const position = Number.isNaN(target) ? 0 : Math.min(Math.max(Math.trunc(target), 0), last);
    const count = eventCount(position);
    if (instant) return { ...s, position, eventIndex: count, mode: 'idle' };
    return { ...s, position, eventIndex: 0, mode: count > 0 ? 'step' : 'idle' };
  }

  /** The run plays the step at `position` from its first event. */
  function runFrom(s: PlaybackState, position: Position): PlaybackState {
    return settle({ ...s, position, eventIndex: 0, mode: 'run' });
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
      : { ...s, mode: 'idle' };
  }

  function toggle(s: PlaybackState): PlaybackState {
    if (s.mode === 'run' || s.mode === 'hold') return { ...s, mode: 'idle', eventIndex: eventCount(s.position) };
    // Play all: from the unit's first step, wherever the reader is in the unit.
    const slot = slots[s.position]!;
    const first = slots.findIndex((x) => x.unit === slot.unit && x.kind === 'step');
    return first === -1 ? s : runFrom(s, first);
  }

  return (s, a) => {
    switch (a.type) {
      case 'go':
        return go(s, a.position, a.instant);
      case 'next':
        return go(s, s.position + 1, a.instant);
      case 'prev':
        return go(s, s.position - 1, a.instant);
      case 'toggle':
        return toggle(s);
      case 'replay':
        return canReplay(lesson, s) ? { ...s, eventIndex: 0, mode: 'step' } : s;
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

/** Whether the step at the current position has anything to replay: a Watch step with at least one event. */
export function canReplay(lesson: Lesson, s: PlaybackState): boolean {
  return slotsFor(lesson)[s.position]?.kind === 'step' && stepEvents(lesson, s.position).length > 0;
}

/** The play button's words and icon: Pause only while a run is going (playing a step or holding), else Play all. */
export function playButton(s: PlaybackState): { words: 'Play all' | 'Pause'; icon: 'play' | 'pause' } {
  return s.mode === 'run' || s.mode === 'hold' ? { words: 'Pause', icon: 'pause' } : { words: 'Play all', icon: 'play' };
}

/** What the lesson's end looks like from the page: the next ready lesson, if any, and this lesson's number among the track's total. */
export interface LessonEnd {
  next: { url: string; title: string } | null;
  number: number;
  total: number;
}

/** The words the forward button can show: the full form where there is room, the short form where there is not. */
export interface ForwardWords {
  full: string;
  short: string;
}

export interface ForwardButton {
  /** What it says in each form. */
  words: ForwardWords;
  /**
   * Its accessible name, which starts with the words shown (WCAG 2.5.3) and adds what they leave out: "Next: DHCP
   * Acknowledge, step 4" under the full form, "Next: step 4, DHCP Acknowledge" under the short one.
   */
  names: ForwardWords;
  /** Its tooltip: the name, with " (→)" where the key does the same; the reason when it is disabled. */
  titles: ForwardWords;
  /** Nothing to go to: the button stays in its slot and does nothing. */
  disabled: boolean;
  /** The next lesson's address, at Practice when one is ready. */
  href?: string;
  /** Why it is disabled, for its title. */
  reason?: string;
}

const same = (text: string): ForwardWords => ({ full: text, short: text });

/**
 * The forward button's words and what it leads to: the place it goes to, named ("Next: DHCP Acknowledge", "Next:
 * step 4" where there is less room, "Next: Learn", "Next: Practice"); at the last Practice "Next lesson: Ports", to the
 * next ready lesson, or disabled with its reason. A following unit is named like any other place (no lesson has one).
 * → does what the button does wherever `href` is undefined and it is not disabled.
 */
export function forwardButton(lesson: Lesson, s: PlaybackState, end: LessonEnd): ForwardButton {
  const slots = slotsFor(lesson);
  const target = slots[s.position + 1];
  if (target !== undefined) {
    const unit = lesson.units[target.unit]!;
    let words: ForwardWords;
    let names: ForwardWords;
    if (target.kind === 'step') {
      const title = unit.steps[target.step - 1]!.title;
      words = { full: `Next: ${title}`, short: `Next: step ${target.step}` };
      names = { full: `Next: ${title}, step ${target.step}`, short: `Next: step ${target.step}, ${title}` };
    } else if (target.kind === 'learn') {
      words = same('Next: Learn');
      names = words;
    } else if (target.kind === 'practice') {
      words = same('Next: Practice');
      names = words;
    } else {
      words = same(`Next: ${unit.name}`);
      names = same(`Next: ${unit.name}, Overview`);
    }
    return { words, names, titles: { full: `${names.full} (→)`, short: `${names.short} (→)` }, disabled: false };
  }
  if (end.next !== null) {
    return {
      words: { full: `Next lesson: ${end.next.title}`, short: 'Next lesson' },
      names: same(`Next lesson: ${end.next.title}`),
      titles: same(`Next lesson: ${end.next.title}`),
      disabled: false,
      href: end.next.url,
    };
  }
  const reason = end.number === end.total ? 'There is no next lesson: this is the track’s last.' : 'No next lesson is ready yet.';
  return { words: same('Next lesson'), names: same('Next lesson'), titles: same(reason), disabled: true, reason };
}

/** Whether the reader has asked for reduced motion, right now. False where `matchMedia` is missing. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
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
 * every state change and cancelled on unmount. Reduced motion changes no wait
 * of a run or a replay, but a hand move (`go`, `next`, `prev`) lands its step
 * complete at once: the returned dispatch reads the setting at the moment of the
 * move and carries it as `instant`.
 */
export function usePlayback(lesson: Lesson, durationOf: DurationOf): [PlaybackState, Dispatch<PlaybackAction>] {
  const reducer = useMemo(() => createPlaybackReducer(lesson), [lesson]);
  const [state, rawDispatch] = useReducer(reducer, undefined, initialPlayback);
  const dispatch = useCallback<Dispatch<PlaybackAction>>(
    (action) => {
      if (action.type === 'go' || action.type === 'next' || action.type === 'prev') {
        rawDispatch({ ...action, instant: action.instant ?? prefersReducedMotion() });
      } else rawDispatch(action);
    },
    [],
  );
  // Read when a wait starts, so a new durationOf on each render does not restart the wait.
  const msAt1x = useEffectEvent((event: SceneEvent) => durationOf(event));

  useEffect(() => {
    const { position, eventIndex, speed } = state;
    const hold = holding(state);
    if (hold !== null) {
      const timer = setTimeout(() => rawDispatch({ type: 'holdDone', position }), hold.ms);
      return () => clearTimeout(timer);
    }
    const event = pendingEvent(lesson, state);
    if (event === null) return;
    const timer = setTimeout(() => rawDispatch({ type: 'tick', position, eventIndex }), msAt1x(event) / speed);
    return () => clearTimeout(timer);
  }, [lesson, state]);

  return [state, dispatch];
}
