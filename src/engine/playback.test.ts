// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import type { Lesson, SceneEvent } from '../content/schema';
import { liftedFixture, makeTwoUnitLesson } from '../content/test-fixtures';
import {
  createPlaybackReducer,
  HOLD_MS,
  holding,
  initialPlayback,
  canReplay,
  forwardButton,
  pendingEvent,
  playButton,
  prefersReducedMotion,
  SPEEDS,
  usePlayback,
  type PlaybackAction,
  type PlaybackState,
} from './playback';
import { deriveState, stepEvents } from './timeline';

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
  return liftedFixture(input);
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
  expect(initialPlayback()).toEqual({ position: 0, eventIndex: 0, mode: 'idle', speed: 1 });
  expect(playButton(initialPlayback()).words).toBe('Play all');
});

test('go plays that step once, then idles', () => {
  const s = apply(initialPlayback(), go(2));
  expect(s).toEqual({ position: 2, eventIndex: 0, mode: 'step', speed: 1 });
  const { end, trace } = playOut(s);
  expect(trace).toEqual(['step 2:0', 'step 2:1', 'idle 2:2']);
  expect(playButton(end).words).toBe('Play all');

  // The Overview, Learn and Practice have nothing to play.
  for (const position of [0, 6, 7, 8]) {
    expect(apply(s, go(position))).toEqual({ position, eventIndex: 0, mode: 'idle', speed: 1 });
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

test('toggle from idle runs every step of the unit with a hold between, then stops idle on the last step', () => {
  const started = apply(initialPlayback(), toggle);
  expect(started).toEqual({ position: 1, eventIndex: 0, mode: 'run', speed: 1 });
  expect(playButton(started)).toEqual({ words: 'Pause', icon: 'pause' });

  const { end, trace } = playOut(started);
  expect(trace).toEqual([
    'run 1:0', 'hold 1:1',
    'run 2:0', 'run 2:1', 'hold 2:2',
    'run 3:0', 'run 3:1', 'hold 3:2',
    'run 4:0', 'hold 4:1',
    'run 5:0', 'idle 5:1',
  ]);
  // The run stops at the unit's last step: it never moves on to Learn.
  expect(end).toEqual({ position: 5, eventIndex: 1, mode: 'idle', speed: 1 });
  expect(playButton(end)).toEqual({ words: 'Play all', icon: 'play' });

  // A hold names the step it leads to and lasts HOLD_MS at 1×.
  const held = apply(started, tick(started));
  expect(held.mode).toBe('hold');
  expect(playButton(held).words).toBe('Pause');
  expect(holding(held)).toEqual({ next: 2, ms: 2600 });
  expect(HOLD_MS).toBe(2600);

  // Play all runs the unit again from its first step.
  expect(apply(end, toggle)).toEqual(started);
});

test('toggle during a run pauses with the current step complete', () => {
  const started = apply(initialPlayback(), toggle);
  const midStep = apply(started, tick(started), { type: 'holdDone', position: 1 }); // run 2:0
  const oneIn = apply(midStep, tick(midStep));
  expect(at(oneIn)).toBe('run 2:1');

  const paused = apply(oneIn, toggle);
  expect(paused).toEqual({ position: 2, eventIndex: 2, mode: 'idle', speed: 1 });
  expect(playButton(paused).words).toBe('Play all');
  expect(pendingEvent(L, paused)).toBeNull();

  // Pausing in a hold keeps the step that just finished.
  const held = apply(oneIn, tick(oneIn));
  expect(at(held)).toBe('hold 2:2');
  expect(apply(held, toggle)).toEqual(paused);
  expect(holding(apply(held, toggle))).toBeNull();

  // Play all after a pause starts again from the unit's first step: there is no resume.
  expect(apply(paused, toggle)).toEqual({ position: 1, eventIndex: 0, mode: 'run', speed: 1 });
  // And Play all during a hand-played step runs from the unit's first step too.
  expect(apply(initialPlayback(), go(3), toggle)).toMatchObject({ position: 1, eventIndex: 0, mode: 'run' });
});

test('toggle on Learn and Practice runs from step 1, and reads Play all', () => {
  for (const position of [6, 7]) {
    const s = apply(initialPlayback(), go(position));
    expect(playButton(s).words).toBe('Play all');
    expect(apply(s, toggle)).toEqual({ position: 1, eventIndex: 0, mode: 'run', speed: 1 });
  }
  // In the second unit, it runs that unit's own first step.
  expect(apply(initialPlayback(), go(14), toggle)).toMatchObject({ position: 9 });
  // The Overview says Play all, and runs the unit's first step.
  expect(playButton(apply(initialPlayback(), go(8))).words).toBe('Play all');
});

test('a hand move during a hold stops the run, and the late holdDone is ignored', () => {
  const started = apply(initialPlayback(), toggle);
  const held = apply(started, tick(started));
  expect(at(held)).toBe('hold 1:1');

  const moved = apply(held, { type: 'next' });
  expect(moved).toEqual({ position: 2, eventIndex: 0, mode: 'step', speed: 1 });
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
  expect(started).toEqual({ position: 9, eventIndex: 0, mode: 'hold', speed: 1 });
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
  expect(end).toMatchObject({ position: 13, mode: 'idle' });
  expect(playButton(end).words).toBe('Play all');

  // By hand, such a step simply shows, idle.
  expect(apply(initialPlayback(), go(9))).toEqual({ position: 9, eventIndex: 0, mode: 'idle', speed: 1 });
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
  expect(where()).toBe('idle 1:1'); // Play all ran from step 1, and Pause showed it complete
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

test('reduced motion leaves every duration of a run unchanged', () => {
  // The hook still takes only the lesson and the durations: it reads the setting itself, when a hand move is dispatched.
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

// ---------------------------------------------------------------- D14: one step at a time, replay, the buttons

test('an instant hand move lands the step complete and idle; a plain one plays it', () => {
  expect(apply(initialPlayback(), { type: 'go', position: 3, instant: true })).toEqual({ position: 3, eventIndex: 2, mode: 'idle', speed: 1 });
  expect(apply(initialPlayback(), { type: 'next', instant: true })).toMatchObject({ position: 1, eventIndex: 1, mode: 'idle' });
  expect(apply(initialPlayback(), go(3), { type: 'prev', instant: true })).toMatchObject({ position: 2, eventIndex: 2, mode: 'idle' });
  // Learn has no events: complete is 0.
  expect(apply(initialPlayback(), { type: 'go', position: 6, instant: true })).toMatchObject({ eventIndex: 0, mode: 'idle' });
  // It stops a run too.
  const started = apply(initialPlayback(), toggle);
  expect(apply(started, { type: 'next', instant: true })).toMatchObject({ position: 2, eventIndex: 2, mode: 'idle' });
  expect(apply(initialPlayback(), go(3))).toMatchObject({ eventIndex: 0, mode: 'step' });
});

test('replay plays the current step again from its first event, in place, and stops a run', () => {
  const played = playOut(apply(initialPlayback(), go(3))).end;
  expect(at(played)).toBe('idle 3:2');
  expect(r(played, { type: 'replay' })).toEqual({ position: 3, eventIndex: 0, mode: 'step', speed: 1 });
  // Mid-play it starts over.
  const mid = apply(initialPlayback(), go(3), { type: 'tick', position: 3, eventIndex: 0 });
  expect(at(mid)).toBe('step 3:1');
  expect(at(r(mid, { type: 'replay' }))).toBe('step 3:0');
  // During a run it stops the run and keeps the position; the step then idles, never moving on.
  const midRun = apply(initialPlayback(), toggle, tick(apply(initialPlayback(), toggle)), { type: 'holdDone', position: 1 });
  expect(at(midRun)).toBe('run 2:0');
  const replayed = r(midRun, { type: 'replay' });
  expect(at(replayed)).toBe('step 2:0');
  expect(playOut(replayed).trace.at(-1)).toBe('idle 2:2');
  // During a hold it replays the step that just finished, not the next.
  const held = apply(initialPlayback(), toggle, tick(apply(initialPlayback(), toggle)));
  expect(at(held)).toBe('hold 1:1');
  expect(at(r(held, { type: 'replay' }))).toBe('step 1:0');
  expect(r(replayed, { type: 'holdDone', position: 2 })).toBe(replayed);
  // Pause in a hold keeps the step.
  expect(at(r(held, toggle))).toBe('idle 1:1');
});

test('replay is enabled on a Watch step with at least one event, and nowhere else', () => {
  const enabled = [1, 2, 3, 4, 5, 10, 11, 12].filter((p) => canReplay(L, { ...initialPlayback(), position: p }));
  expect(enabled).toEqual([1, 2, 3, 4, 5, 10, 11, 12]);
  // The Overview, Learn, Practice and a step with no events.
  for (const p of [0, 6, 7, 8, 9, 13, 14, 15]) expect(canReplay(L, { ...initialPlayback(), position: p })).toBe(false);
  // Pressing it where there is nothing to replay changes nothing.
  const s = apply(initialPlayback(), go(9));
  expect(r(s, { type: 'replay' })).toBe(s);
  const learn = apply(initialPlayback(), go(6));
  expect(r(learn, { type: 'replay' })).toBe(learn);
});

test('Play all runs from the unit’s first step and stops on its last, never crossing into the next unit', () => {
  const s = apply(initialPlayback(), go(4), toggle);
  expect(at(s)).toBe('run 1:0');
  const { end } = playOut(s);
  expect(at(end)).toBe('idle 5:1');
  // From the second unit's Practice it runs the second unit.
  expect(at(apply(initialPlayback(), go(15), toggle))).toBe('hold 9:0');
});

test('the play button says Pause only while a run is going', () => {
  const started = apply(initialPlayback(), toggle);
  expect(playButton(started).words).toBe('Pause');
  expect(playButton(apply(started, tick(started))).words).toBe('Pause'); // hold
  expect(playButton(apply(initialPlayback(), go(3))).words).toBe('Play all'); // a step's own play
  expect(playButton(apply(started, { type: 'replay' })).words).toBe('Play all');
});

test('the forward button reads Next step everywhere but the last Practice', () => {
  const end = { next: { url: '/t/next' }, number: 3, total: 9 };
  for (let p = 0; p <= 14; p++) {
    expect(forwardButton(L, { ...initialPlayback(), position: p }, end)).toEqual({ words: 'Next step', disabled: false });
  }
  // Unit 1's Practice (7) leads to unit 2's Overview, even with a next lesson ready.
  expect(forwardButton(L, { ...initialPlayback(), position: 7 }, end).words).toBe('Next step');
  // The lesson's last Practice: a next lesson, its address.
  expect(forwardButton(L, { ...initialPlayback(), position: 15 }, end)).toEqual({ words: 'Next lesson', disabled: false, href: '/t/next' });
  // The track's last lesson, and the last ready one.
  expect(forwardButton(L, { ...initialPlayback(), position: 15 }, { next: null, number: 9, total: 9 })).toEqual({
    words: 'Next lesson',
    disabled: true,
    reason: 'There is no next lesson: this is the track’s last.',
  });
  expect(forwardButton(L, { ...initialPlayback(), position: 15 }, { next: null, number: 3, total: 9 })).toEqual({
    words: 'Next lesson',
    disabled: true,
    reason: 'No next lesson is ready yet.',
  });
});

test('prefersReducedMotion reads the setting each time, and is false without matchMedia', () => {
  vi.stubGlobal('matchMedia', undefined);
  expect(prefersReducedMotion()).toBe(false);
  let reduce = true;
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: reduce && q.includes('prefers-reduced-motion'), media: q }));
  expect(prefersReducedMotion()).toBe(true);
  reduce = false;
  expect(prefersReducedMotion()).toBe(false);
});

test('under reduced motion a hand move through the hook lands complete with no timer; replay and Play all keep their waits', () => {
  let reduce = true;
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: reduce && q.includes('prefers-reduced-motion'), media: q }));
  const { dispatch, wait, where, state } = renderPlayback();
  dispatch(go(3));
  expect(where()).toBe('idle 3:2');
  expect(vi.getTimerCount()).toBe(0);
  expect(state().eventIndex).toBe(stepEvents(L, 3).length);
  dispatch({ type: 'next' });
  expect(where()).toBe('idle 4:1');
  dispatch({ type: 'prev' });
  expect(where()).toBe('idle 3:2');
  // Replay keeps its waits.
  dispatch({ type: 'replay' });
  expect(where()).toBe('step 3:0');
  wait(1000);
  expect(where()).toBe('step 3:1');
  wait(1000);
  expect(where()).toBe('idle 3:2');
  // The setting turned off: the next hand move plays with its waits.
  reduce = false;
  dispatch(go(2));
  expect(where()).toBe('step 2:0');
  expect(vi.getTimerCount()).toBe(1);
});

test('Pause during a run through the hook leaves nothing waiting; Play all after it starts at the first step', () => {
  const { dispatch, wait, where } = renderPlayback();
  dispatch(go(3));
  dispatch(toggle);
  expect(where()).toBe('run 1:0');
  wait(1000);
  dispatch(toggle); // the hold after step 1
  expect(where()).toBe('idle 1:1');
  expect(vi.getTimerCount()).toBe(0);
  wait(30_000);
  expect(where()).toBe('idle 1:1');
  dispatch(toggle);
  expect(where()).toBe('run 1:0');
});
