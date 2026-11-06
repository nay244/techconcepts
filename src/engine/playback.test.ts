// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { validateLesson } from '../content/define';
import type { Lesson, SceneEvent } from '../content/schema';
import { makeTwoUnitLesson } from '../content/test-fixtures';
import {
  createPlaybackReducer,
  HOLD_MS,
  holding,
  initialPlayback,
  pendingEvent,
  playLabel,
  SPEEDS,
  usePlayback,
  type PlaybackAction,
  type PlaybackState,
} from './playback';
import { deriveState, stepEvents } from './timeline';

// The real FIGURE_PARTS stays empty until each figure is built, so the fixtures
// validate against the stand-in parts.
vi.mock('../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../content/test-fixtures')).FIXTURE_PARTS }));

/**
 * Two units of five steps. Alpha keeps the fixture's events: step 1 m1; 2 m2,
 * t-add; 3 t-match, n1; 4 m3; 5 m4. Beta's first and last steps have none, as
 * lesson 1's first steps have none. Positions: alpha 0 Overview, 1–5 steps,
 * 6 Learn, 7 Practice; beta 8 Overview, 9–13 steps, 14 Learn, 15 Practice.
 */
function fixture(): Lesson {
  const input = makeTwoUnitLesson();
  const beta = input.units[1]!;
  beta.steps[0]!.events = [];
  beta.steps[4]!.events = [];
  return validateLesson(input).lesson;
}

const L = fixture();
const r = createPlaybackReducer(L);

/** Applies actions in order, starting from `from`. */
const apply = (from: PlaybackState, ...actions: PlaybackAction[]): PlaybackState => actions.reduce(r, from);
const go = (position: number): PlaybackAction => ({ type: 'go', position });
const tick = (s: PlaybackState): PlaybackAction => ({ type: 'tick', position: s.position, eventIndex: s.eventIndex });
const toggle: PlaybackAction = { type: 'toggle' };
const cycleSpeed: PlaybackAction = { type: 'cycleSpeed' };

/** 'run 2:1' for a run at position 2 with one event applied. */
const at = (s: PlaybackState) => `${s.mode} ${s.position}:${s.eventIndex}`;

/**
 * Lets every wait end, as the hook would: ticks the pending event or ends the
 * hold until nothing is waiting. Returns where it stopped and every state on the way.
 */
function playOut(from: PlaybackState): { end: PlaybackState; trace: string[] } {
  let s = from;
  const trace = [at(s)];
  for (;;) {
    if (holding(s) !== null) s = r(s, { type: 'holdDone', position: s.position });
    else if (pendingEvent(L, s) !== null) s = r(s, tick(s));
    else return { end: s, trace };
    trace.push(at(s));
  }
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

// ---------------------------------------------------------------- the reducer

test('playback starts at the Overview, idle, at 1×', () => {
  expect(initialPlayback()).toEqual({ position: 0, eventIndex: 0, mode: 'idle', ended: false, speed: 1 });
  expect(playLabel(L, initialPlayback())).toBe('Play');
});

test('go plays that step once, then idles', () => {
  const s = apply(initialPlayback(), go(2));
  expect(s).toEqual({ position: 2, eventIndex: 0, mode: 'step', ended: false, speed: 1 });
  const { end, trace } = playOut(s);
  expect(trace).toEqual(['step 2:0', 'step 2:1', 'idle 2:2']);
  expect(end).toMatchObject({ ended: false });
  expect(playLabel(L, end)).toBe('Play');

  // The Overview, Learn and Practice have nothing to play.
  for (const position of [0, 6, 7, 8]) {
    expect(apply(s, go(position))).toEqual({ position, eventIndex: 0, mode: 'idle', ended: false, speed: 1 });
  }
});

test('go, next and prev move by one and keep to the lesson', () => {
  const s = apply(initialPlayback(), go(3));
  expect(apply(s, { type: 'next' })).toMatchObject({ position: 4, eventIndex: 0, mode: 'step' });
  expect(apply(s, { type: 'prev' })).toMatchObject({ position: 2, eventIndex: 0, mode: 'step' });
  expect(apply(s, go(99))).toMatchObject({ position: 15, mode: 'idle' });
  expect(apply(s, go(-4))).toMatchObject({ position: 0, mode: 'idle' });
  expect(apply(s, go(15), { type: 'next' })).toMatchObject({ position: 15, mode: 'idle' });
  expect(apply(s, go(0), { type: 'prev' })).toMatchObject({ position: 0, mode: 'idle' });
  // A position that is not a whole number is read as the timeline reads it.
  expect(apply(s, go(2.7))).toMatchObject({ position: 2, mode: 'step' });
  expect(apply(s, go(Number.NaN))).toMatchObject({ position: 0, mode: 'idle' });
});

test('toggle from idle runs every step of the unit with a hold between, then ends with Replay', () => {
  const started = apply(initialPlayback(), toggle);
  expect(started).toEqual({ position: 1, eventIndex: 0, mode: 'run', ended: false, speed: 1 });
  expect(playLabel(L, started)).toBe('Pause');

  const { end, trace } = playOut(started);
  expect(trace).toEqual([
    'run 1:0', 'hold 1:1',
    'run 2:0', 'run 2:1', 'hold 2:2',
    'run 3:0', 'run 3:1', 'hold 3:2',
    'run 4:0', 'hold 4:1',
    'run 5:0', 'idle 5:1',
  ]);
  // The run stops at the unit's last step: it never moves on to Learn.
  expect(end).toEqual({ position: 5, eventIndex: 1, mode: 'idle', ended: true, speed: 1 });
  expect(playLabel(L, end)).toBe('Replay');

  // A hold names the step it leads to and lasts HOLD_MS at 1×.
  const held = apply(started, tick(started));
  expect(held.mode).toBe('hold');
  expect(playLabel(L, held)).toBe('Pause');
  expect(holding(held)).toEqual({ next: 2, ms: 2600 });
  expect(HOLD_MS).toBe(2600);

  // Replay runs the unit again from its first step.
  expect(apply(end, toggle)).toEqual(started);
});

test('toggle during a run pauses with the current step complete', () => {
  const started = apply(initialPlayback(), toggle);
  const midStep = apply(started, tick(started), { type: 'holdDone', position: 1 }); // run 2:0
  const oneIn = apply(midStep, tick(midStep));
  expect(at(oneIn)).toBe('run 2:1');

  const paused = apply(oneIn, toggle);
  expect(paused).toEqual({ position: 2, eventIndex: 2, mode: 'idle', ended: false, speed: 1 });
  expect(playLabel(L, paused)).toBe('Play');
  expect(pendingEvent(L, paused)).toBeNull();

  // Pausing in a hold keeps the step that just finished.
  const held = apply(oneIn, tick(oneIn));
  expect(at(held)).toBe('hold 2:2');
  expect(apply(held, toggle)).toEqual(paused);
  expect(holding(apply(held, toggle))).toBeNull();

  // Play again runs on from the start of that step.
  expect(apply(paused, toggle)).toEqual({ position: 2, eventIndex: 0, mode: 'run', ended: false, speed: 1 });
  // And Play during a hand-played step starts a run from it.
  expect(apply(initialPlayback(), go(3), toggle)).toMatchObject({ position: 3, eventIndex: 0, mode: 'run' });
});

test('toggle on Learn runs from step 1 and the label was Watch again', () => {
  for (const position of [6, 7]) {
    const s = apply(initialPlayback(), go(position));
    expect(playLabel(L, s)).toBe('Watch again');
    expect(apply(s, toggle)).toEqual({ position: 1, eventIndex: 0, mode: 'run', ended: false, speed: 1 });
  }
  // In the second unit, it runs that unit's own first step.
  expect(apply(initialPlayback(), go(14), toggle)).toMatchObject({ position: 9 });
  // The Overview says Play.
  expect(playLabel(L, apply(initialPlayback(), go(8)))).toBe('Play');
});

test('a hand move during a hold stops the run, and the late holdDone is ignored', () => {
  const started = apply(initialPlayback(), toggle);
  const held = apply(started, tick(started));
  expect(at(held)).toBe('hold 1:1');

  const moved = apply(held, { type: 'next' });
  expect(moved).toEqual({ position: 2, eventIndex: 0, mode: 'step', ended: false, speed: 1 });
  expect(r(moved, { type: 'holdDone', position: 1 })).toBe(moved);

  // Going back by hand stops it too.
  const back = apply(held, { type: 'prev' });
  expect(at(back)).toBe('idle 0:0');
  expect(r(back, { type: 'holdDone', position: 1 })).toBe(back);

  // holdDone outside a hold, or for another position, changes nothing.
  expect(r(held, { type: 'holdDone', position: 2 })).toBe(held);
  expect(r(started, { type: 'holdDone', position: 1 })).toBe(started);
});

test('a stale tick from another position or eventIndex is ignored', () => {
  const s = apply(initialPlayback(), go(2), { type: 'tick', position: 2, eventIndex: 0 });
  expect(at(s)).toBe('step 2:1');
  expect(r(s, { type: 'tick', position: 1, eventIndex: 1 })).toBe(s);
  expect(r(s, { type: 'tick', position: 3, eventIndex: 1 })).toBe(s);
  expect(r(s, { type: 'tick', position: 2, eventIndex: 0 })).toBe(s);
  expect(r(s, { type: 'tick', position: 2, eventIndex: 2 })).toBe(s);

  // Nothing is waiting in idle or a hold, so a tick there is stale as well.
  const idle = apply(s, tick(s));
  expect(at(idle)).toBe('idle 2:2');
  expect(r(idle, { type: 'tick', position: 2, eventIndex: 2 })).toBe(idle);
  const started = apply(initialPlayback(), toggle);
  const held = apply(started, tick(started));
  expect(r(held, { type: 'tick', position: 1, eventIndex: 1 })).toBe(held);
});

test('cycleSpeed goes 1 → 1.5 → 2 → 0.5 → 1 and leaves the run alone', () => {
  expect(SPEEDS).toEqual([0.5, 1, 1.5, 2]);
  const started = apply(initialPlayback(), toggle);
  const s = apply(started, tick(started), { type: 'holdDone', position: 1 }, { type: 'tick', position: 2, eventIndex: 0 });
  expect(at(s)).toBe('run 2:1');

  const speeds = [s.speed];
  let next = s;
  for (let i = 0; i < 4; i++) {
    next = r(next, cycleSpeed);
    speeds.push(next.speed);
    expect(next).toEqual({ ...s, speed: next.speed });
  }
  expect(speeds).toEqual([1, 1.5, 2, 0.5, 1]);

  // A hold keeps going too, and gets shorter at a faster speed.
  const held = apply(s, tick(s));
  expect(holding(apply(held, cycleSpeed, cycleSpeed))).toEqual({ next: 3, ms: 1300 });
});

test('the pending event is the one not yet applied, and null between steps', () => {
  const [m2, tAdd] = stepEvents(L, 2);
  let s = apply(initialPlayback(), go(2));
  expect(pendingEvent(L, s)).toBe(m2);
  expect(deriveState(L, s.position, s.eventIndex).log.map((row) => row.eventId)).not.toContain('m2');

  s = r(s, tick(s));
  expect(pendingEvent(L, s)).toBe(tAdd);
  expect(deriveState(L, s.position, s.eventIndex).log.map((row) => row.eventId)).toContain('m2');

  s = r(s, tick(s));
  expect(at(s)).toBe('idle 2:2');
  expect(pendingEvent(L, s)).toBeNull();

  // In a run, nothing is pending during a hold, at the end, or off a step.
  const started = apply(initialPlayback(), toggle);
  expect(pendingEvent(L, started)).toBe(stepEvents(L, 1)[0]);
  expect(pendingEvent(L, apply(started, tick(started)))).toBeNull();
  expect(pendingEvent(L, playOut(started).end)).toBeNull();
  for (const position of [0, 6, 7]) expect(pendingEvent(L, apply(initialPlayback(), go(position)))).toBeNull();
});

test('a step with no events completes at once in a run', () => {
  // Beta's first step has no events: the run holds on it, then carries on.
  const started = apply(initialPlayback(), go(8), toggle);
  expect(started).toEqual({ position: 9, eventIndex: 0, mode: 'hold', ended: false, speed: 1 });
  expect(holding(started)).toEqual({ next: 10, ms: 2600 });

  // Its last step has none either: the run ends the moment it gets there.
  const { end, trace } = playOut(started);
  expect(trace).toEqual([
    'hold 9:0',
    'run 10:0', 'run 10:1', 'hold 10:2',
    'run 11:0', 'run 11:1', 'hold 11:2',
    'run 12:0', 'hold 12:1',
    'idle 13:0',
  ]);
  expect(end).toMatchObject({ ended: true });
  expect(playLabel(L, end)).toBe('Replay');

  // By hand, such a step simply shows, idle.
  expect(apply(initialPlayback(), go(9))).toEqual({ position: 9, eventIndex: 0, mode: 'idle', ended: false, speed: 1 });
});

test('toggle in a unit with no steps changes nothing', () => {
  // Validation never lets this through (a unit needs 4–6 steps), so it is built by hand.
  const empty: Lesson = { ...L, units: [{ ...L.units[0]!, steps: [] }] };
  const re = createPlaybackReducer(empty);
  for (const position of [0, 1, 2]) {
    const s = re(initialPlayback(), go(position));
    expect(re(s, toggle)).toBe(s);
  }
});

// ---------------------------------------------------------------- the hook

/** Renders the hook with fake timers and every event lasting 1000 ms at 1×. */
function renderPlayback() {
  vi.useFakeTimers();
  const durationOf = vi.fn((_: SceneEvent) => 1000);
  const hook = renderHook(() => usePlayback(L, durationOf));
  return {
    ...hook,
    durationOf,
    state: () => hook.result.current[0],
    where: () => at(hook.result.current[0]),
    dispatch: (a: PlaybackAction) => act(() => hook.result.current[1](a)),
    wait: (ms: number) => act(() => vi.advanceTimersByTime(ms)),
  };
}

test('timers: each event waits durationOf(event)/speed ms and a hold waits 2600/speed', () => {
  const { dispatch, wait, where, state, durationOf, unmount } = renderPlayback();
  expect(where()).toBe('idle 0:0');

  dispatch(toggle);
  expect(where()).toBe('run 1:0');
  expect(durationOf).toHaveBeenLastCalledWith(stepEvents(L, 1)[0]);
  wait(999);
  expect(where()).toBe('run 1:0');
  wait(1);
  expect(where()).toBe('hold 1:1');
  wait(2599);
  expect(where()).toBe('hold 1:1');
  wait(1);
  expect(where()).toBe('run 2:0');

  // At 2×: 500 ms an event, 1300 ms a hold.
  dispatch(cycleSpeed);
  dispatch(cycleSpeed);
  expect(state().speed).toBe(2);
  wait(499);
  expect(where()).toBe('run 2:0');
  wait(1);
  expect(where()).toBe('run 2:1');
  expect(durationOf).toHaveBeenLastCalledWith(stepEvents(L, 2)[1]);
  wait(500);
  expect(where()).toBe('hold 2:2');
  wait(1299);
  expect(where()).toBe('hold 2:2');
  wait(1);
  expect(where()).toBe('run 3:0');

  // At 0.5×: 2000 ms an event, 5200 ms a hold.
  dispatch(cycleSpeed);
  expect(state().speed).toBe(0.5);
  wait(1999);
  expect(where()).toBe('run 3:0');
  wait(1);
  expect(where()).toBe('run 3:1');
  wait(2000);
  expect(where()).toBe('hold 3:2');
  wait(5199);
  expect(where()).toBe('hold 3:2');
  wait(1);
  expect(where()).toBe('run 4:0');

  // A hand move cancels the wait and starts the new step's own.
  wait(1500);
  dispatch(go(2));
  expect(vi.getTimerCount()).toBe(1);
  wait(1999);
  expect(where()).toBe('step 2:0');
  wait(1);
  expect(where()).toBe('step 2:1');

  // Nothing waits when idle, and unmounting clears a pending wait.
  dispatch(toggle);
  dispatch(toggle);
  expect(where()).toBe('idle 2:2');
  expect(vi.getTimerCount()).toBe(0);
  dispatch(toggle);
  expect(vi.getTimerCount()).toBe(1);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});

test('a re-render with a new durationOf keeps the current wait and times the next one', () => {
  vi.useFakeTimers();
  const hook = renderHook(({ ms }) => usePlayback(L, () => ms), { initialProps: { ms: 1000 } });
  const where = () => at(hook.result.current[0]);
  act(() => hook.result.current[1](toggle));
  act(() => vi.advanceTimersByTime(600));
  hook.rerender({ ms: 1000 });
  act(() => vi.advanceTimersByTime(400));
  expect(where()).toBe('hold 1:1');

  hook.rerender({ ms: 400 });
  act(() => vi.advanceTimersByTime(2600));
  expect(where()).toBe('run 2:0');
  act(() => vi.advanceTimersByTime(400));
  expect(where()).toBe('run 2:1');
});

test('reduced motion leaves every duration unchanged', () => {
  // The hook takes the lesson and the durations, and nothing about motion.
  expect(usePlayback.length).toBe(2);

  vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('prefers-reduced-motion'), media: q }));
  const { dispatch, wait, where } = renderPlayback();
  dispatch(toggle);
  wait(999);
  expect(where()).toBe('run 1:0');
  wait(1);
  expect(where()).toBe('hold 1:1');
  wait(2599);
  expect(where()).toBe('hold 1:1');
  wait(1);
  expect(where()).toBe('run 2:0');
});
