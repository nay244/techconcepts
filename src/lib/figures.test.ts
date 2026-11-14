import { expect, test } from 'vitest';
import { getEntries, type AvailableSummary } from '../content/registry';
import { tracks } from '../content/tracks';
import { lessonFigure } from './figures';

test('every ready lesson of every track has a card figure', () => {
  let checked = 0;
  for (const track of tracks) {
    for (const entry of getEntries(track.id)) {
      if (!entry.available) continue;
      expect(lessonFigure(entry)).toContain('<svg');
      checked++;
    }
  }
  expect(checked).toBeGreaterThan(0);
});

test('a shared lesson wears the same figure on every track that lists it', () => {
  const dns = (id: string) => getEntries(id).find((e): e is AvailableSummary => e.available && e.slug === 'what-is-dns')!;
  expect(() => lessonFigure(dns('networking'))).not.toThrow();
  expect(lessonFigure(dns('networking'))).toBe(lessonFigure(dns('how-the-internet-works')));
  expect(lessonFigure(dns('networking'))).toContain('DNS');
});

test('a ready Networking lesson with no figure throws, naming it', () => {
  const entry = { available: true, key: 'mystery', slug: 'mystery' } as unknown as AvailableSummary;
  expect(() => lessonFigure(entry)).toThrow('The mystery lesson is ready and has no figure for its card.');
});
