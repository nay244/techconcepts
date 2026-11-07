import { expect, test } from 'vitest';
import { osiHeading } from './TopBar';

test('osiHeading names a single layer, and joins several with "and"', () => {
  expect(osiHeading([7])).toBe('OSI layer 7, Application');
  expect(osiHeading([2])).toBe('OSI layer 2, Data link');
  expect(osiHeading([4, 3, 3])).toBe('OSI layers 3 and 4');
  expect(osiHeading([2, 3, 4])).toBe('OSI layers 2, 3 and 4');
  expect(osiHeading([])).toBeNull();
});

test('osiHeading without names gives a single layer as its number only, as lesson 1 says it', () => {
  expect(osiHeading([7], { named: false })).toBe('OSI layer 7');
  expect(osiHeading([6], { named: false })).toBe('OSI layer 6');
  expect(osiHeading([3, 4], { named: false })).toBe('OSI layers 3 and 4');
  expect(osiHeading([], { named: false })).toBeNull();
});
