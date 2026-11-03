import { describe, expect, test } from 'vitest';
import type { Actor, FlowScene, MessageEvent } from '../../content/schema';
import { CHIP_LIFT, arrowSpan, chipAlign, chipSpot, pathFor } from './geometry';

const actor = (id: string, x: number, y: number): Actor => ({ id, kind: 'router', label: id, addresses: [], x, y });

const scene: FlowScene = {
  type: 'flow',
  views: ['network'],
  actors: [actor('a', 0, 0), actor('r', 500, 0), actor('b', 1000, 300), actor('c', 1000, 600)],
  links: [],
  tables: [],
  packets: {},
  legend: [],
};

const message = (overrides: Partial<MessageEvent> = {}): MessageEvent => ({
  type: 'message',
  id: 'm',
  from: 'a',
  to: ['b'],
  src: '192.0.2.1',
  dst: '192.0.2.2',
  protocol: 'Demo',
  kind: 'request',
  label: 'Hello',
  summary: 'A test message.',
  size: 10,
  time: 0,
  ...overrides,
});

test('pathFor runs from the sender, through the via actors in order, to the target', () => {
  expect(pathFor(scene, message({ via: ['r'] }), 'b')).toEqual([
    { x: 0, y: 0 },
    { x: 500, y: 0 },
    { x: 1000, y: 300 },
  ]);
});

test('pathFor goes straight from sender to target when there is no via', () => {
  expect(pathFor(scene, message(), 'b')).toEqual([
    { x: 0, y: 0 },
    { x: 1000, y: 300 },
  ]);
});

test('pathFor ends at the requested target, so each target of a broadcast gets its own path', () => {
  const broadcast = message({ to: ['b', 'c'], via: ['r'] });
  expect(pathFor(scene, broadcast, 'c').at(-1)).toEqual({ x: 1000, y: 600 });
  expect(pathFor(scene, broadcast, 'b').at(-1)).toEqual({ x: 1000, y: 300 });
});

test('pathFor skips an actor id the scene does not have instead of throwing', () => {
  expect(pathFor(scene, message({ via: ['nope'] }), 'b')).toEqual([
    { x: 0, y: 0 },
    { x: 1000, y: 300 },
  ]);
});

test('chipSpot lifts the chip above the device so it does not hide the icon', () => {
  expect(chipSpot({ x: 500, y: 300 })).toEqual({ x: 500, y: 300 - CHIP_LIFT });
});

test('chipSpot keeps the chip inside the canvas for a device near the top', () => {
  const spot = chipSpot({ x: 500, y: 20 });
  expect(spot.y).toBeGreaterThan(0);
  expect(spot.x).toBe(500);
});

test('chipAlign centres a chip, except near a side edge where it grows inward', () => {
  expect(chipAlign({ x: 500, y: 100 })).toBe('center');
  expect(chipAlign({ x: 90, y: 100 })).toBe('start');
  expect(chipAlign({ x: 920, y: 100 })).toBe('end');
  expect(chipAlign({ x: 150, y: 100 })).toBe('center');
  expect(chipAlign({ x: 850, y: 100 })).toBe('center');
});

describe('arrowSpan', () => {
  // Lifelines 0 to 3 are a, r, b and c.
  const span = (from: string, to: string[]) => arrowSpan(scene.actors, { from, to });

  test('runs left to right from a sender to a target on its right', () => {
    expect(span('a', ['b'])).toEqual({ lo: 0, hi: 2, direction: 'right', stops: [] });
  });

  test('runs right to left when the target is on the left', () => {
    expect(span('b', ['a'])).toEqual({ lo: 0, hi: 2, direction: 'left', stops: [] });
  });

  test('runs to the farthest target and dots the nearer ones it reaches', () => {
    expect(span('a', ['c', 'r'])).toEqual({ lo: 0, hi: 3, direction: 'right', stops: [1] });
    expect(span('c', ['a', 'b'])).toEqual({ lo: 0, hi: 3, direction: 'left', stops: [2] });
  });

  test('has a head at both ends when the sender sits between its targets', () => {
    expect(span('r', ['a', 'c'])).toEqual({ lo: 0, hi: 3, direction: 'both', stops: [] });
  });

  test('is a loop when the only target is the sender', () => {
    expect(span('r', ['r'])).toEqual({ lo: 1, hi: 1, direction: 'self', stops: [] });
  });

  test('does not count the sender as one of its own targets', () => {
    expect(span('a', ['a', 'b'])).toEqual({ lo: 0, hi: 2, direction: 'right', stops: [] });
  });

  test('counts a repeated target once', () => {
    expect(span('a', ['c', 'c', 'r', 'r'])).toEqual({ lo: 0, hi: 3, direction: 'right', stops: [1] });
  });

  test('leaves out a target the scene does not have', () => {
    expect(span('a', ['ghost', 'b'])).toEqual({ lo: 0, hi: 2, direction: 'right', stops: [] });
  });
});
