import { useEffect, useMemo, useReducer, type Dispatch } from 'react';
import type { Lesson } from '../content/schema';
import { currentEvents, sectionsFor, type Position } from './timeline';

type Speed = 0.5 | 1 | 2;

export interface PlaybackState {
  position: Position;
  /** How many of the position's events have played. */
  eventIndex: number;
  playing: boolean;
  speed: Speed;
  /** The Try it variant being shown. Only ever set at the Try it position. */
  tryItChoice: string | null;
}

export type PlaybackAction =
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'toggle' }
  /** Carries the position the timer was set for, so a late tick from a position the learner has left is ignored. */
  | { type: 'tick'; position: Position }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'jump'; position: Position }
  | { type: 'replay' }
  | { type: 'speed'; speed: Speed }
  | { type: 'chooseTryIt'; choiceId: string };

/** How long each kind of event stays on screen at normal speed. */
export const EVENT_DURATION_MS = { message: 1200, table: 700 } as const;

export function initialPlayback(): PlaybackState {
  return { position: 0, eventIndex: 0, playing: false, speed: 1, tryItChoice: null };
}

/**
 * The rules for moving through a lesson. The state is only a cursor: what the
 * scene shows comes from `deriveState(lesson, position, eventIndex, tryItChoice)`.
 */
export function createPlaybackReducer(lesson: Lesson): (s: PlaybackState, a: PlaybackAction) => PlaybackState {
  const sections = sectionsFor(lesson.steps.length);
  const tryItDef = lesson.tryIt;
  const eventsAt = (position: Position, choice: string | null) => currentEvents(lesson, position, choice);

  /** The Try it choice survives only while the learner stays where they are. */
  const choiceAfterMove = (s: PlaybackState, position: Position) => (position === s.position ? s.tryItChoice : null);

  /** Goes to `target` (kept within range), starts it from its first event, and plays it if it has any. */
  function moveTo(s: PlaybackState, target: Position): PlaybackState {
    const position = Math.min(Math.max(0, target), sections.max);
    const tryItChoice = choiceAfterMove(s, position);
    return { ...s, position, eventIndex: 0, tryItChoice, playing: eventsAt(position, tryItChoice).length > 0 };
  }

  function play(s: PlaybackState): PlaybackState {
    if (s.eventIndex < eventsAt(s.position, s.tryItChoice).length) return s.playing ? s : { ...s, playing: true };
    // Nothing left here: carry on to the next position, unless this is the last.
    return s.position < sections.max ? moveTo(s, s.position + 1) : s;
  }

  function pause(s: PlaybackState): PlaybackState {
    return s.playing ? { ...s, playing: false } : s;
  }

  return (s, a) => {
    switch (a.type) {
      case 'play':
        return play(s);
      case 'pause':
        return pause(s);
      case 'toggle':
        return s.playing ? pause(s) : play(s);
      case 'tick': {
        if (!s.playing || a.position !== s.position) return s;
        const length = eventsAt(s.position, s.tryItChoice).length;
        const eventIndex = Math.min(s.eventIndex + 1, length);
        return { ...s, eventIndex, playing: eventIndex < length };
      }
      case 'next':
        return moveTo(s, s.position + 1);
      case 'jump':
        // A position that is not a whole number cannot be meant; leave the cursor where it is.
        return Number.isInteger(a.position) ? moveTo(s, a.position) : s;
      case 'prev': {
        const position = Math.max(0, s.position - 1);
        const tryItChoice = choiceAfterMove(s, position);
        // Land on the finished state of the previous position, paused.
        return { ...s, position, eventIndex: eventsAt(position, tryItChoice).length, tryItChoice, playing: false };
      }
      case 'replay':
        return { ...s, eventIndex: 0, playing: eventsAt(s.position, s.tryItChoice).length > 0 };
      case 'speed':
        return { ...s, speed: a.speed };
      case 'chooseTryIt': {
        if (s.position !== sections.tryIt || tryItDef.mode !== 'choices') return s;
        const choice = tryItDef.choices.find((c) => c.id === a.choiceId);
        if (choice === undefined) return s;
        return { ...s, tryItChoice: choice.id, eventIndex: 0, playing: choice.events.length > 0 };
      }
    }
  };
}

/**
 * Playback state for a lesson. While playing it waits out the current event
 * (its duration at the chosen speed) and then ticks. The wait is cancelled and
 * restarted on every state change and cancelled on unmount.
 */
export function usePlayback(lesson: Lesson): [PlaybackState, Dispatch<PlaybackAction>] {
  const reducer = useMemo(() => createPlaybackReducer(lesson), [lesson]);
  const [state, dispatch] = useReducer(reducer, undefined, initialPlayback);

  useEffect(() => {
    if (!state.playing) return;
    const next = currentEvents(lesson, state.position, state.tryItChoice)[state.eventIndex];
    if (next === undefined) return;
    const position = state.position;
    const timer = setTimeout(() => dispatch({ type: 'tick', position }), EVENT_DURATION_MS[next.type] / state.speed);
    return () => clearTimeout(timer);
  }, [lesson, state]);

  return [state, dispatch];
}
