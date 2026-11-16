import { expect, test } from 'vitest';
import { getEntries, type AvailableSummary } from '../content/registry';
import { tracks } from '../content/tracks';
import { spot } from '../art/figures/spots';
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

test('Router’s card is its spot, drawn for a lesson that has no home track yet, and does not throw', () => {
  const entry = { available: true, key: 'router', slug: 'router' } as unknown as AvailableSummary;
  expect(() => lessonFigure(entry)).not.toThrow();
  expect(lessonFigure(entry)).toContain('lm-router');
  expect(lessonFigure(entry)).toBe(spot('router'));
});

test.each(['arp', 'ports', 'nat', 'ip-address', 'mac-address', 'tcp-udp', 'packets', 'load-balancers'] as const)('%s’s card is its spot, drawn for a lesson that has no home track yet, and does not throw', (slug) => {
  const entry = { available: true, key: slug, slug } as unknown as AvailableSummary;
  expect(() => lessonFigure(entry)).not.toThrow();
  expect(lessonFigure(entry)).toBe(spot(slug));
});

test('5b: the Switch lesson’s card is the switch spot', () => {
  expect(lessonFigure({ available: true, key: 'switch', slug: 'switch' } as unknown as AvailableSummary)).toBe(spot('switch'));
});
