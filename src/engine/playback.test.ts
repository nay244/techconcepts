// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { validateLesson } from '../content/define';
import { fixtureLesson, fixturePlaygroundLesson } from '../content/test-fixtures';
import {
  createPlaybackReducer,
  EVENT_DURATION_MS,
  initialPlayback,
  usePlayback,
  type PlaybackAction,
  type PlaybackState,
} from './playback';
import { deriveState, sectionsFor } from './timeline';

const L = validateLesson(fixtureLesson()).lesson;
const S = sectionsFor(4);
const r = createPlaybackReducer(L);

/** Applies actions in order, starting from `from`. */
const run = (from: PlaybackState, ...actions: PlaybackAction[]): PlaybackState => actions.reduce(r, from);

afterEach(() => {
  vi.useRealTimers();
});

// ---------------------------------------------------------------- brief scenarios

test('stale tick is ignored', () => {
  let s = r(initialPlayback(), { type: 'next' }); // position 1, playing
  s = r(s, { type: 'jump', position: 3 });
  expect(r(s, { type: 'tick', position: 1 })).toEqual(s);
});

test('tick advances and pauses at the step boundary', () => {
  let s = r(initialPlayback(), { type: 'next' });
  s = r(s, { type: 'tick', position: 1 });
  expect(s).toMatchObject({ position: 1, eventIndex: 1, playing: false });
});

test('mashing next/prev clamps and matches fresh derivation', () => {
  let s = initialPlayback();
  for (let i = 0; i < 20; i++) s = r(s, { type: 'next' });
  expect(s.position).toBe(7);
  for (let i = 0; i < 20; i++) s = r(s, { type: 'prev' });
  expect(s.position).toBe(0);
  s = r(s, { type: 'jump', position: 2 });
  s = r(s, { type: 'prev' });
  expect(deriveState(L, s.position, s.eventIndex, s.tryItChoice)).toEqual(deriveState(L, 1, 1, null));
});

test('play at a step boundary moves on', () =>
  expect(r(initialPlayback(), { type: 'play' })).toMatchObject({ position: 1, playing: true }));

test('try-it choice only at try-it position and resets on leave', () => {
  expect(r(initialPlayback(), { type: 'chooseTryIt', choiceId: 'c1' }).tryItChoice).toBeNull();
  let s = r(initialPlayback(), { type: 'jump', position: 5 });
  s = r(s, { type: 'chooseTryIt', choiceId: 'c1' });
  expect(s).toMatchObject({ tryItChoice: 'c1', playing: true });
  expect(r(s, { type: 'next' }).tryItChoice).toBeNull();
});

// ---------------------------------------------------------------- initial state

test('playback starts at the overview, paused, at normal speed, with no choice', () => {
  expect(initialPlayback()).toEqual({ position: 0, eventIndex: 0, playing: false, speed: 1, tryItChoice: null });
});

test('every call to initialPlayback gives a fresh object', () => {
  expect(initialPlayback()).not.toBe(initialPlayback());
});

// ---------------------------------------------------------------- play, pause, toggle

test('play inside a step resumes where it stopped', () => {
  const mid = { ...initialPlayback(), position: 2, eventIndex: 1 };
  expect(r(mid, { type: 'play' })).toEqual({ ...mid, playing: true });
});

test('play when the step is finished moves to the next position and starts it', () => {
  const finished = { ...initialPlayback(), position: 1, eventIndex: 1 };
  expect(r(finished, { type: 'play' })).toMatchObject({ position: 2, eventIndex: 0, playing: true });
});

test('play at the last position does nothing', () => {
  const end = run(initialPlayback(), { type: 'jump', position: S.max });
  expect(r(end, { type: 'play' })).toEqual(end);
});

test('play at Try it before a choice moves on, because there is nothing to play', () => {
  const tryIt = run(initialPlayback(), { type: 'jump', position: S.tryIt });
  expect(r(tryIt, { type: 'play' })).toMatchObject({ position: S.check, playing: false });
});

test('pause stops playing and keeps the place', () => {
  const playing = run(initialPlayback(), { type: 'jump', position: 2 }, { type: 'tick', position: 2 });
  expect(playing).toMatchObject({ playing: true, eventIndex: 1 });
  expect(r(playing, { type: 'pause' })).toEqual({ ...playing, playing: false });
});

test('toggle pauses when playing and plays when paused', () => {
  const playing = run(initialPlayback(), { type: 'jump', position: 2 });
  const paused = r(playing, { type: 'toggle' });
  expect(paused).toEqual({ ...playing, playing: false });
  expect(r(paused, { type: 'toggle' })).toEqual(playing);
});

test('toggle on a finished step moves on, as play does', () => {
  const finished = { ...initialPlayback(), position: 1, eventIndex: 1 };
  expect(r(finished, { type: 'toggle' })).toEqual(r(finished, { type: 'play' }));
});

// ---------------------------------------------------------------- tick

test('tick steps through a multi-event step and pauses only after the last event', () => {
  let s = run(initialPlayback(), { type: 'jump', position: 2 }); // three events
  const seen: [number, boolean][] = [[s.eventIndex, s.playing]];
  for (let i = 0; i < 3; i++) {
    s = r(s, { type: 'tick', position: 2 });
    seen.push([s.eventIndex, s.playing]);
  }
  expect(seen).toEqual([
    [0, true],
    [1, true],
    [2, true],
    [3, false],
  ]);
});

test('tick is ignored while paused', () => {
  const paused = { ...initialPlayback(), position: 2, eventIndex: 1 };
  expect(r(paused, { type: 'tick', position: 2 })).toBe(paused);
});

test('tick never runs past the end of the step', () => {
  const end = { ...initialPlayback(), position: 1, eventIndex: 1, playing: true };
  expect(r(end, { type: 'tick', position: 1 })).toMatchObject({ eventIndex: 1, playing: false });
});

test('tick keeps the speed and the Try it choice', () => {
  const s = run(
    initialPlayback(),
    { type: 'speed', speed: 2 },
    { type: 'jump', position: S.tryIt },
    { type: 'chooseTryIt', choiceId: 'c2' },
    { type: 'tick', position: S.tryIt },
  );
  expect(s).toMatchObject({ speed: 2, tryItChoice: 'c2', eventIndex: 1, playing: false });
});

// ---------------------------------------------------------------- next, jump, prev

test('next enters a step with events playing, and a section without events paused', () => {
  expect(r(initialPlayback(), { type: 'next' })).toMatchObject({ position: 1, eventIndex: 0, playing: true });
  const lastStep = run(initialPlayback(), { type: 'jump', position: 4 });
  expect(r(lastStep, { type: 'next' })).toMatchObject({ position: S.tryIt, eventIndex: 0, playing: false });
  expect(r(r(lastStep, { type: 'next' }), { type: 'next' })).toMatchObject({ position: S.check, playing: false });
});

test('next restarts the position from its first event', () => {
  const mid = { ...initialPlayback(), position: 1, eventIndex: 1, speed: 0.5 as const };
  expect(r(mid, { type: 'next' })).toEqual({ ...mid, position: 2, eventIndex: 0, playing: true });
});

test('next at the last position stays there', () => {
  const end = run(initialPlayback(), { type: 'jump', position: S.max });
  expect(r(end, { type: 'next' })).toMatchObject({ position: S.max, eventIndex: 0, playing: false });
});

test('jump goes straight to a position and clamps into range', () => {
  expect(r(initialPlayback(), { type: 'jump', position: 3 })).toMatchObject({ position: 3, eventIndex: 0, playing: true });
  expect(r(initialPlayback(), { type: 'jump', position: 999 })).toMatchObject({ position: S.max, playing: false });
  expect(r(initialPlayback(), { type: 'jump', position: -4 })).toMatchObject({ position: 0, playing: false });
});

test('jump to the overview, Check or Recap does not start playing', () => {
  for (const position of [0, S.check, S.recap]) {
    expect(r(run(initialPlayback(), { type: 'jump', position: 2 }), { type: 'jump', position })).toMatchObject({
      position,
      playing: false,
    });
  }
});

test('prev lands at the end of the previous position, paused', () => {
  const s = run(initialPlayback(), { type: 'jump', position: 3 }, { type: 'prev' });
  expect(s).toMatchObject({ position: 2, eventIndex: 3, playing: false });
});

test('prev from the first step shows the overview, and prev at the overview stays there', () => {
  const overview = run(initialPlayback(), { type: 'jump', position: 1 }, { type: 'prev' });
  expect(overview).toMatchObject({ position: 0, eventIndex: 0, playing: false });
  expect(r(overview, { type: 'prev' })).toEqual(overview);
});

test('prev from Check shows Try it with no choice, because choices reset when you leave', () => {
  let s = run(initialPlayback(), { type: 'jump', position: S.tryIt }, { type: 'chooseTryIt', choiceId: 'c1' });
  s = run(s, { type: 'next' }, { type: 'prev' });
  expect(s).toMatchObject({ position: S.tryIt, eventIndex: 0, playing: false, tryItChoice: null });
});

test('prev from Try it lands at the end of the last step', () => {
  const s = run(initialPlayback(), { type: 'jump', position: S.tryIt }, { type: 'prev' });
  expect(s).toMatchObject({ position: 4, eventIndex: 1, playing: false });
});

test('every reachable state derives without error and the event index stays in range', () => {
  let s = initialPlayback();
  const actions: PlaybackAction[] = [
    { type: 'next' },
    { type: 'tick', position: 1 },
    { type: 'jump', position: 2 },
    { type: 'tick', position: 2 },
    { type: 'prev' },
    { type: 'play' },
    { type: 'replay' },
    { type: 'jump', position: S.tryIt },
    { type: 'chooseTryIt', choiceId: 'c2' },
    { type: 'tick', position: S.tryIt },
    { type: 'next' },
    { type: 'prev' },
    { type: 'toggle' },
    { type: 'jump', position: 99 },
  ];
  for (const a of actions) {
    s = r(s, a);
    expect(() => deriveState(L, s.position, s.eventIndex, s.tryItChoice)).not.toThrow();
    expect(s.position).toBeGreaterThanOrEqual(0);
    expect(s.position).toBeLessThanOrEqual(S.max);
  }
});

// ---------------------------------------------------------------- replay

test('replay restarts the current position and plays it', () => {
  const done = { ...initialPlayback(), position: 2, eventIndex: 3 };
  expect(r(done, { type: 'replay' })).toEqual({ ...done, eventIndex: 0, playing: true });
});

test('replay where there is nothing to play stays paused', () => {
  expect(r(initialPlayback(), { type: 'replay' })).toEqual(initialPlayback());
});

test('replay at Try it plays the chosen variant again and keeps the choice', () => {
  let s = run(initialPlayback(), { type: 'jump', position: S.tryIt }, { type: 'chooseTryIt', choiceId: 'c1' });
  s = run(s, { type: 'tick', position: S.tryIt }, { type: 'replay' });
  expect(s).toMatchObject({ tryItChoice: 'c1', eventIndex: 0, playing: true });
});

// ---------------------------------------------------------------- speed

test('speed changes only the speed', () => {
  const mid = { ...initialPlayback(), position: 2, eventIndex: 1, playing: true };
  expect(r(mid, { type: 'speed', speed: 0.5 })).toEqual({ ...mid, speed: 0.5 });
  expect(r(mid, { type: 'speed', speed: 2 })).toEqual({ ...mid, speed: 2 });
});

// ---------------------------------------------------------------- Try it

test('choosing a variant starts it from the beginning', () => {
  const atTryIt = run(initialPlayback(), { type: 'jump', position: S.tryIt });
  expect(r(atTryIt, { type: 'chooseTryIt', choiceId: 'c2' })).toEqual({
    ...atTryIt,
    tryItChoice: 'c2',
    eventIndex: 0,
    playing: true,
  });
});

test('choosing again after one finished switches to the new variant and plays it', () => {
  let s = run(initialPlayback(), { type: 'jump', position: S.tryIt }, { type: 'chooseTryIt', choiceId: 'c1' });
  s = run(s, { type: 'tick', position: S.tryIt });
  expect(s).toMatchObject({ playing: false, eventIndex: 1 });
  expect(r(s, { type: 'chooseTryIt', choiceId: 'c2' })).toMatchObject({ tryItChoice: 'c2', eventIndex: 0, playing: true });
});

test('an unknown choice id is ignored', () => {
  const atTryIt = run(initialPlayback(), { type: 'jump', position: S.tryIt });
  expect(r(atTryIt, { type: 'chooseTryIt', choiceId: 'nope' })).toBe(atTryIt);
});

test('choosing is ignored anywhere but the Try it position', () => {
  for (const position of [0, 1, 4, S.check, S.recap]) {
    const s = run(initialPlayback(), { type: 'jump', position });
    expect(r(s, { type: 'chooseTryIt', choiceId: 'c1' })).toBe(s);
  }
});

test('leaving Try it by any route forgets the choice', () => {
  const chosen = run(initialPlayback(), { type: 'jump', position: S.tryIt }, { type: 'chooseTryIt', choiceId: 'c1' });
  for (const action of [{ type: 'next' }, { type: 'prev' }, { type: 'jump', position: 1 }] as PlaybackAction[]) {
    expect(r(chosen, action).tryItChoice).toBeNull();
  }
});

test('jumping to the Try it position you are already on replays the chosen variant', () => {
  const chosen = run(initialPlayback(), { type: 'jump', position: S.tryIt }, { type: 'chooseTryIt', choiceId: 'c1' });
  const done = r(chosen, { type: 'tick', position: S.tryIt });
  expect(r(done, { type: 'jump', position: S.tryIt })).toMatchObject({ tryItChoice: 'c1', eventIndex: 0, playing: true });
});

test('a playground lesson has no choices and nothing to play in its steps', () => {
  const P = validateLesson(fixturePlaygroundLesson()).lesson;
  const rp = createPlaybackReducer(P);
  let s = rp(initialPlayback(), { type: 'jump', position: 2 });
  expect(s).toMatchObject({ position: 2, playing: false });
  s = rp(s, { type: 'jump', position: sectionsFor(4).tryIt });
  expect(rp(s, { type: 'chooseTryIt', choiceId: 'c1' })).toBe(s);
  expect(rp(s, { type: 'play' })).toMatchObject({ position: sectionsFor(4).check, playing: false });
});

// ---------------------------------------------------------------- usePlayback

test('event durations', () => expect(EVENT_DURATION_MS).toEqual({ message: 1200, table: 700 }));

test('while playing, a message event ticks after its duration', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => usePlayback(L));
  act(() => result.current[1]({ type: 'next' })); // step 1: one message
  expect(result.current[0]).toMatchObject({ position: 1, playing: true, eventIndex: 0 });
  expect(vi.getTimerCount()).toBe(1);

  act(() => {
    vi.advanceTimersByTime(EVENT_DURATION_MS.message - 1);
  });
  expect(result.current[0].eventIndex).toBe(0);
  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(result.current[0]).toMatchObject({ eventIndex: 1, playing: false });
  expect(vi.getTimerCount()).toBe(0);
});

test('a table event waits for its own, shorter duration', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => usePlayback(L));
  act(() => result.current[1]({ type: 'jump', position: 3 })); // step 3: one table event
  act(() => {
    vi.advanceTimersByTime(EVENT_DURATION_MS.table - 1);
  });
  expect(result.current[0].eventIndex).toBe(0);
  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(result.current[0]).toMatchObject({ eventIndex: 1, playing: false });
});

test('speed divides the wait', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => usePlayback(L));
  act(() => result.current[1]({ type: 'speed', speed: 2 }));
  act(() => result.current[1]({ type: 'next' }));
  act(() => {
    vi.advanceTimersByTime(EVENT_DURATION_MS.message / 2);
  });
  expect(result.current[0].eventIndex).toBe(1);

  act(() => result.current[1]({ type: 'speed', speed: 0.5 }));
  act(() => result.current[1]({ type: 'jump', position: 3 }));
  act(() => {
    vi.advanceTimersByTime(EVENT_DURATION_MS.table * 2 - 1);
  });
  expect(result.current[0].eventIndex).toBe(0);
  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(result.current[0].eventIndex).toBe(1);
});

test('it keeps playing through a multi-event step, one timer at a time', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => usePlayback(L));
  act(() => result.current[1]({ type: 'jump', position: 2 })); // message, message, table
  for (const [wait, index, playing] of [
    [EVENT_DURATION_MS.message, 1, true],
    [EVENT_DURATION_MS.message, 2, true],
    [EVENT_DURATION_MS.table, 3, false],
  ] as const) {
    expect(vi.getTimerCount()).toBe(1);
    act(() => {
      vi.advanceTimersByTime(wait);
    });
    expect(result.current[0]).toMatchObject({ eventIndex: index, playing });
  }
  expect(vi.getTimerCount()).toBe(0);
});

test('pausing cancels the pending tick', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => usePlayback(L));
  act(() => result.current[1]({ type: 'next' }));
  act(() => result.current[1]({ type: 'pause' }));
  expect(vi.getTimerCount()).toBe(0);
  act(() => {
    vi.advanceTimersByTime(10_000);
  });
  expect(result.current[0]).toMatchObject({ eventIndex: 0, playing: false });
});

test('any state change restarts the wait, so an old timer never fires into the new position', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => usePlayback(L));
  act(() => result.current[1]({ type: 'next' })); // timer for step 1
  act(() => {
    vi.advanceTimersByTime(EVENT_DURATION_MS.message - 100);
  });
  act(() => result.current[1]({ type: 'jump', position: 4 })); // fresh timer for step 4
  act(() => {
    vi.advanceTimersByTime(200); // the step-1 timer would have fired here
  });
  expect(result.current[0]).toMatchObject({ position: 4, eventIndex: 0, playing: true });
  expect(vi.getTimerCount()).toBe(1);
  act(() => {
    vi.advanceTimersByTime(EVENT_DURATION_MS.message);
  });
  expect(result.current[0]).toMatchObject({ position: 4, eventIndex: 1, playing: false });
});

test('unmounting cancels the pending tick', () => {
  vi.useFakeTimers();
  const { result, unmount } = renderHook(() => usePlayback(L));
  act(() => result.current[1]({ type: 'next' }));
  expect(vi.getTimerCount()).toBe(1);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});

test('nothing is scheduled while paused', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => usePlayback(L));
  expect(result.current[0]).toEqual(initialPlayback());
  expect(vi.getTimerCount()).toBe(0);
});
