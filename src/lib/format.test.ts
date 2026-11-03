import { expect, test } from 'vitest';
import { formatBytes, formatTime } from './format';

test('formatTime gives three decimals and a trailing s', () => {
  expect(formatTime(0.024)).toBe('0.024s');
  expect(formatTime(0)).toBe('0.000s');
  expect(formatTime(43200)).toBe('43200.000s');
});

test('formatBytes counts bytes below 1024', () => {
  expect(formatBytes(0)).toBe('0 B');
  expect(formatBytes(342)).toBe('342 B');
  expect(formatBytes(1023)).toBe('1023 B');
});

test('formatBytes switches to KB with one decimal from 1024', () => {
  expect(formatBytes(1024)).toBe('1.0 KB');
  expect(formatBytes(13107)).toBe('12.8 KB');
});
