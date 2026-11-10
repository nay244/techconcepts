import { expect, test } from 'vitest';
import { stampDate, stampWords } from './stamp';

test('a checked lesson says the day it was checked and how many sources it rests on', () => {
  expect(stampWords({ checked: '2026-11-08', sources: 6 })).toBe('Checked 8 Nov 2026, 6 sources');
});

test('a lesson not checked yet says so, in the same place', () => {
  expect(stampWords({ checked: null, sources: 2 })).toBe('Not checked yet, 2 sources');
  expect(stampWords({ checked: null, sources: 1 })).toBe('Not checked yet, 1 source');
});

test('a card leaves the sources out', () => {
  expect(stampWords({ checked: '2026-01-31', sources: 6 }, { sources: false })).toBe('Checked 31 Jan 2026');
  expect(stampWords({ checked: null, sources: 2 }, { sources: false })).toBe('Not checked yet');
});

test('a date that is not one is refused, not printed', () => {
  expect(() => stampDate('2026-13-01')).toThrow(RangeError);
});
