import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { along, animate, easeInOut } from './motion';

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

test('an animate started on an aborted signal settles on frame(1) at once', async () => {
  const frame = vi.fn();
  const controller = new AbortController();
  controller.abort();
  const p = animate(1000, frame, { reducedMotion: false, signal: controller.signal });
  expect(frame.mock.calls).toEqual([[1]]);
  expect(waiting.size).toBe(0);
  expect(await settled(p)).toBe(true);
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
