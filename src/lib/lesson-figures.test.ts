import { expect, test } from 'vitest';
import { getEntries, getLesson } from '../content/registry';
import { tracks } from '../content/tracks';
import { LESSON_FIGURES, figureOfKey } from './lesson-figures';

test('the map holds every lesson that has been written, with the drawing its file names', () => {
  const written = new Set(tracks.flatMap((t) => getEntries(t.id)).filter((e) => e.available).map((e) => e.key));
  expect(new Set(Object.keys(LESSON_FIGURES))).toStrictEqual(written);
  expect(written.size).toBe(30);
  for (const key of written) expect(LESSON_FIGURES[key], key).toBe(getLesson(key)!.figure);
});

test('a key the map does not know has no drawing, and a prototype name is not a key', () => {
  expect(figureOfKey('nope')).toBeUndefined();
  expect(figureOfKey('constructor')).toBeUndefined();
});
