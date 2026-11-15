// @vitest-environment jsdom
import { expect, test } from 'vitest';
import { lessonNumbers } from '../../test/lesson-references';
import { showSweep } from '../../test/show-sweep';
import { checkStructure } from '../define';
import ip from './ip-address';

const unit = ip.units[0]!;
const events = unit.steps.flatMap((s) => s.events);

test('IP Address validates on the subnet figure with the bits board, 5 steps and 2 questions', () => {
  expect(checkStructure(ip)).toEqual([]);
  expect(ip.figure).toBe('subnet');
  expect(unit.scene.panel).toEqual({ type: 'bits' });
  expect(unit.steps).toHaveLength(5);
  expect(unit.practice).toHaveLength(2);
  expect(unit.scene.views).toEqual(['network']);
});

test('every event is a note whose board has no prefix, so the board draws no marks', () => {
  expect(events.length).toBe(7);
  for (const e of events) {
    expect(e.type).toBe('note');
    if (e.type === 'note') expect(e.board?.prefix).toBeNull();
  }
});

test('the log is the Addresses log with its Address, Kind and plain-words columns', () => {
  expect(unit.scene.log.title).toBe('Addresses');
  expect(unit.scene.log.columns.map((c) => [c.key, c.label])).toEqual([['addr', 'Address'], ['kind', 'Kind'], ['plain', 'In plain words']]);
});

test('no text points at another lesson by number', () => {
  expect(lessonNumbers(ip)).toEqual([]);
});

test('show draws every moment of the lesson as a fresh driver draws it', () => {
  expect(showSweep(ip)).toBe(8 + events.length);
});
