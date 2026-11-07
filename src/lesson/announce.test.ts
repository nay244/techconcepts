import { expect, test, vi } from 'vitest';
import { validateLesson } from '../content/define';
import dhcp from '../content/lessons/networking/dhcp';
import type { Lesson } from '../content/schema';
import { makeLesson, makeUnitWithTwoTableChanges } from '../content/test-fixtures';
import { createPlaybackReducer, type PlaybackState } from '../engine/playback';
import { deriveState, positionOf, stepEvents, type Position } from '../engine/timeline';
import { stepAnnouncement } from './announce';

// The fixtures validate on their own parts, and the real DHCP lesson on its own.
vi.mock('../art/scenes/parts', async (importOriginal) => ({
  FIGURE_PARTS: (await import('../content/test-fixtures')).withFixtureParts(
    (await importOriginal<typeof import('../art/scenes/parts')>()).FIGURE_PARTS,
  ),
}));

/** Positions: 0 Overview, 1 Neighbor Hello, 2 Neighbor Reply (m2, t-add), 3 Table Lookup (t-match, n1), 4 Lost Message. */
const FIXTURE: Lesson = validateLesson(makeLesson()).lesson;
/** The same, with Neighbor Reply playing m2, t-add, t-check and Table Lookup t-match, t-recheck, n1. */
const TWO: Lesson = validateLesson(makeLesson({ units: [makeUnitWithTwoTableChanges()] })).lesson;

/** What the live region says at a step after its first `played` events. */
function said(lesson: Lesson, position: Position, played: number): string {
  const derived = deriveState(lesson, position, played);
  if (derived.slot.kind !== 'step') throw new Error(`Position ${position} is not a step.`);
  return stepAnnouncement(lesson.units[derived.unit]!.steps[derived.slot.step - 1]!.title, derived);
}

test('before any event plays, a step says its title alone', () => {
  expect(said(FIXTURE, 2, 0)).toBe('Neighbor Reply');
  expect(said(FIXTURE, 3, 0)).toBe('Table Lookup');
});

test("a message's words come after the title, and a table change after them, not instead of them", () => {
  expect(said(FIXTURE, 2, 1)).toBe('Neighbor Reply. The router answers the laptop.');
  expect(said(FIXTURE, 2, 2)).toBe('Neighbor Reply. The router answers the laptop. The router remembers the laptop.');
});

test('with no row played yet, the title is followed by the table changes so far', () => {
  expect(said(FIXTURE, 3, 1)).toBe('Table Lookup. The router finds the laptop in its table.');
  expect(said(TWO, 3, 2)).toBe('Table Lookup. The router finds the laptop in its table. The row is still there.');
});

test('a row played after a table change is the latest thing said: the change before it is not repeated', () => {
  expect(said(FIXTURE, 3, 2)).toBe('Table Lookup. The router already knows the laptop.');
  expect(said(TWO, 3, 3)).toBe('Table Lookup. The router already knows the laptop.');
});

test('two table changes in a row are both said, in order, each as its own sentence', () => {
  // t-check's summary has no full stop, so one is added before the next sentence; the last part is left as written.
  expect(said(TWO, 2, 3)).toBe(
    'Neighbor Reply. The router answers the laptop. The router remembers the laptop. The router checks the row it wrote',
  );
  expect(said(TWO, 2, 2)).toBe('Neighbor Reply. The router answers the laptop. The router remembers the laptop.');
});

/** What the live region says for a playback state of `TWO`. */
const sayState = (s: PlaybackState) => said(TWO, s.position, s.eventIndex);

test('a jump (go, next or prev) says only where it lands, even after steps full of table changes', () => {
  const reducer = createPlaybackReducer(TWO);
  // Table Lookup played through, as a hand-played step leaves it.
  const played: PlaybackState = { position: 3, eventIndex: 3, mode: 'idle', ended: false, speed: 1 };
  expect(sayState(reducer(played, { type: 'next' }))).toBe('Lost Message');
  expect(sayState(reducer(played, { type: 'prev' }))).toBe('Neighbor Reply');
  expect(sayState(reducer(played, { type: 'go', position: 3 }))).toBe('Table Lookup');
});

test('Pause, which plays the rest of the step at once, says it by the same rule', () => {
  const reducer = createPlaybackReducer(TWO);
  // A run part way through Neighbor Reply: only its message has played.
  const running: PlaybackState = { position: 2, eventIndex: 1, mode: 'run', ended: false, speed: 1 };
  expect(sayState(running)).toBe('Neighbor Reply. The router answers the laptop.');
  const paused = reducer(running, { type: 'toggle' });
  expect(paused.mode).toBe('idle');
  expect(sayState(paused)).toBe(
    'Neighbor Reply. The router answers the laptop. The router remembers the laptop. The router checks the row it wrote',
  );
});

test("DHCP's Acknowledge, once played, says the ACK and then what the lease table wrote down", () => {
  const ack = positionOf(dhcp, 0, 'step', dhcp.units[0]!.steps.findIndex((s) => s.id === 'acknowledge') + 1);
  const all = stepEvents(dhcp, ack).length;
  expect(said(dhcp, ack, all)).toBe(
    'DHCP Acknowledge. The router confirms: 192.168.1.100 is the laptop’s for 24 hours. ' +
      'The router writes down that 192.168.1.100 belongs to the laptop for 24 hours.',
  );
});
