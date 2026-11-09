import { expect, test } from 'vitest';
import { getEntries, type AvailableSummary } from '../content/registry';
import { tracks } from '../content/tracks';
import { lessonFigure } from './figures';

test('every ready lesson of every track has a card figure', () => {
  let checked = 0;
  for (const track of tracks) {
    for (const entry of getEntries(track.id)) {
      if (!entry.available) continue;
      expect(lessonFigure(track.id, entry)).toContain('<svg');
      checked++;
    }
  }
  expect(checked).toBeGreaterThan(0);
});

test('a ready Networking lesson with no figure throws, naming it', () => {
  const entry = { available: true, key: 'mystery', slug: 'mystery' } as unknown as AvailableSummary;
  expect(() => lessonFigure('networking', entry)).toThrow('The mystery lesson is ready and has no figure for its card.');
});
