import { expect, test } from 'vitest';
import { countWords } from './words';

test('counts words, ** is a space', () => {
  expect(countWords('a **b**, c')).toBe(4);
  expect(countWords('  ')).toBe(0);
});

test('counts whitespace-separated tokens', () => {
  expect(countWords('')).toBe(0);
  expect(countWords('   \n\t ')).toBe(0);
  expect(countWords('one')).toBe(1);
  expect(countWords('  two   words\nand\tmore ')).toBe(4);
});

test('a ** marker on its own is not a word', () => expect(countWords('a ** b **')).toBe(2));
