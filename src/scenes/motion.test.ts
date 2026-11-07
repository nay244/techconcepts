import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { along, animate, easeInOut, wait } from './motion';

/** Animation frames run only when a test says so: `frameAt(ms)` runs the waiting callbacks at that time. */
let waiting = new Map<number, FrameRequestCallback>();
let nextId = 1;
let now = 0;

function frameAt(ms: number): void {
  now = ms;
  const callbacks = [...waiting.values()];
  waiting = new Map();
  for (const cb of callbacks) cb(ms);
}

beforeEach(() => {
  waiting = new Map();
  nextId = 1;
  now = 0;
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    const id = nextId++;
    waiting.set(id, cb);
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => waiting.delete(id));
  vi.spyOn(performance, 'now').mockImplementation(() => now);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** True once the promise has settled, checked after the microtasks queued so far have run. */
async function settled(p: Promise<unknown>): Promise<boolean> {
  let done = false;
  void p.then(() => (done = true));
  await Promise.resolve();
  await Promise.resolve();
  return done;
}

test('animate under reduced motion calls frame(1) once and resolves at once', async () => {
  const frame = vi.fn();
  const p = animate(800, frame, { reducedMotion: true, signal: new AbortController().signal });
  expect(frame.mock.calls).toEqual([[1]]);
  expect(waiting.size).toBe(0);
  expect(await settled(p)).toBe(true);
});

test('an aborted animate settles on frame(1)', async () => {
  const frame = vi.fn();
  const controller = new AbortController();
  const p = animate(1000, frame, { reducedMotion: false, signal: controller.signal });
  frameAt(250);
  expect(frame).toHaveBeenLastCalledWith(0.25);
  expect(await settled(p)).toBe(false);

  controller.abort();
  expect(frame).toHaveBeenLastCalledWith(1);
  expect(await settled(p)).toBe(true);
  // Nothing moves after the abort: no frame is waiting, and a late one would change nothing.
  expect(waiting.size).toBe(0);
  const calls = frame.mock.calls.length;
  frameAt(600);
  expect(frame.mock.calls.length).toBe(calls);
});

test('an animate started on an aborted signal calls nothing and resolves at once', async () => {
  const controller = new AbortController();
  controller.abort();
  // The panel has already settled the figure with show, so a late frame(1) would paint over it.
  for (const reducedMotion of [false, true]) {
    const frame = vi.fn();
    const p = animate(1000, frame, { reducedMotion, signal: controller.signal });
    expect(frame).not.toHaveBeenCalled();
    expect(waiting.size).toBe(0);
    expect(await settled(p)).toBe(true);
  }
});

test('animate with no time calls frame(1) once and resolves at once', async () => {
  const frame = vi.fn();
  const p = animate(0, frame, { reducedMotion: false, signal: new AbortController().signal });
  expect(frame.mock.calls).toEqual([[1]]);
  expect(waiting.size).toBe(0);
  expect(await settled(p)).toBe(true);
});

/** A play written as the driver contract asks: two tweens, then the part lands, returning at once after each await once aborted. */
async function contractPlay(writes: string[], o: { reducedMotion: boolean; signal: AbortSignal }): Promise<void> {
  await animate(100, (k) => writes.push(`a ${k}`), o);
  if (o.signal.aborted) return;
  await animate(100, (k) => writes.push(`b ${k}`), o);
  if (o.signal.aborted) return;
  writes.push('land');
}

test('a play that follows the contract writes nothing once it is aborted, mid-tween or between two awaits', async () => {
  // Aborted mid-tween: the tween ends on frame(1) inside the abort itself, before show runs, and nothing follows.
  const mid: string[] = [];
  const first = new AbortController();
  now = 0;
  const p = contractPlay(mid, { reducedMotion: false, signal: first.signal });
  frameAt(0);
  frameAt(50);
  first.abort();
  expect(mid).toEqual(['a 0', 'a 0.5', 'a 1']);
  await p;
  frameAt(500);
  expect(mid).toEqual(['a 0', 'a 0.5', 'a 1']);

  // Aborted after the first tween has finished, before the play has gone on to the second.
  const between: string[] = [];
  const second = new AbortController();
  now = 1000;
  const q = contractPlay(between, { reducedMotion: false, signal: second.signal });
  frameAt(1050);
  frameAt(1100);
  second.abort();
  await q;
  frameAt(2000);
  expect(between).toEqual(['a 0.5', 'a 1']);
  expect(waiting.size).toBe(0);

  // Not aborted, it runs to the end.
  const whole: string[] = [];
  await contractPlay(whole, { reducedMotion: true, signal: new AbortController().signal });
  expect(whole).toEqual(['a 1', 'b 1', 'land']);
});

test('animate runs from 0 to 1 over its time, frame by frame, then resolves', async () => {
  const frame = vi.fn();
  const p = animate(400, frame, { reducedMotion: false, signal: new AbortController().signal });
  frameAt(0);
  frameAt(100);
  frameAt(300);
  expect(await settled(p)).toBe(false);
  frameAt(420);
  expect(frame.mock.calls.map(([k]) => k)).toEqual([0, 0.25, 0.75, 1]);
  expect(await settled(p)).toBe(true);
  expect(waiting.size).toBe(0);
});

test('easeInOut starts and ends slowly, and is halfway at the middle', () => {
  expect(easeInOut(0)).toBe(0);
  expect(easeInOut(0.5)).toBe(0.5);
  expect(easeInOut(1)).toBe(1);
  expect(easeInOut(0.1)).toBeLessThan(0.1);
  expect(easeInOut(0.9)).toBeGreaterThan(0.9);
  expect(easeInOut(-1)).toBe(0);
  expect(easeInOut(2)).toBe(1);
});

test('along finds the point a share of the way along a path, by length', () => {
  const path: [number, number][] = [
    [0, 0],
    [30, 0],
    [30, 10],
  ];
  // 40 long: the corner is at 0.75.
  expect(along(path, 0)).toEqual([0, 0]);
  expect(along(path, 0.5)).toEqual([20, 0]);
  expect(along(path, 0.75)).toEqual([30, 0]);
  expect(along(path, 0.875)).toEqual([30, 5]);
  expect(along(path, 1)).toEqual([30, 10]);
  expect(along(path, 1.5)).toEqual([30, 10]);
  expect(along(path, -1)).toEqual([0, 0]);
  expect(along([[4, 5]], 0.5)).toEqual([4, 5]);
  expect(() => along([], 0.5)).toThrow(RangeError);
});

test('along always returns a new point, never one of the path’s own', () => {
  const path: [number, number][] = [
    [0, 0],
    [30, 0],
  ];
  const end = along(path, 1);
  expect(end).toEqual([30, 0]);
  expect(end).not.toBe(path[1]);
  expect(along(path, 0)).not.toBe(path[0]);
  const single: [number, number][] = [[4, 5]];
  expect(along(single, 0.5)).not.toBe(single[0]);
});

test('wait resolves after its time, and not before', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  try {
    const p = wait(450, new AbortController().signal);
    await vi.advanceTimersByTimeAsync(449);
    expect(await settled(p)).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(await settled(p)).toBe(true);
  } finally {
    vi.useRealTimers();
  }
});

test('wait resolves at once on an abort, and leaves no timer behind', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  try {
    const controller = new AbortController();
    const p = wait(1000, controller.signal);
    await vi.advanceTimersByTimeAsync(300);
    expect(await settled(p)).toBe(false);
    controller.abort();
    expect(await settled(p)).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  } finally {
    vi.useRealTimers();
  }
});

test('wait on a signal already aborted resolves at once and sets no timer', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  try {
    const controller = new AbortController();
    controller.abort();
    const p = wait(1000, controller.signal);
    expect(vi.getTimerCount()).toBe(0);
    expect(await settled(p)).toBe(true);
  } finally {
    vi.useRealTimers();
  }
});
