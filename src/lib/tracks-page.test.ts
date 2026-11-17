// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { stripLongest, trackCards, type PlannedTrackCard, type ReadyTrackCard } from './tracks-page';

const ready = (id: string) => trackCards().find((c): c is ReadyTrackCard => c.ready && c.id === id)!;

test('How the Internet Works first, then Networking, then A+', () => {
  expect(trackCards().map((c) => c.id)).toEqual(['how-the-internet-works', 'networking', 'comptia-a-plus']);
});

test('How the Internet Works links to its page, with all 14 lessons ready and its own cover', () => {
  const card = ready('how-the-internet-works');
  expect(card).toMatchObject({ ready: true, title: 'How the Internet Works', href: '/how-the-internet-works' });
  expect(card.blurb).toBe('Meet the 14 protocols the internet runs on, from HTTP and DNS to email, SSH and TLS, one short lesson each.');
  expect(card.entries).toHaveLength(14);
  expect(Object.keys(card.known)).toHaveLength(14);
  // The card wears the track's cover, not a figure for each lesson (D18 §7): the page no longer sends 34 figures.
  expect(card.cover).toBe('web');
  expect(card).not.toHaveProperty('figures');
  expect(card.stripLongest).toBe('14 of 14 lessons done');
});

test('a track with lessons lists every lesson, and wears its own cover', () => {
  const card = ready('networking');
  expect(card).toMatchObject({ ready: true, title: 'Networking Concepts', href: '/networking' });
  expect(card.blurb).toBe(
    'How devices find each other and talk: addresses, switches and routers, the web, and the tools that protect and scale it.',
  );
  expect(card.entries).toHaveLength(20);
  // The progress island reads the ready lessons' last positions, as the track page does: all 20 are ready.
  expect(Object.keys(card.known)).toHaveLength(20);
  expect(card.cover).toBe('networking');
  expect(card).not.toHaveProperty('figures');
  expect(card.stripLongest).toBe('20 of 20 lessons done');
});

test('a planned track is no link, has no lessons, and wears its cover', () => {
  const card = trackCards().find((c) => c.id === 'comptia-a-plus') as PlannedTrackCard;
  expect(card).toEqual({
    ready: false,
    id: 'comptia-a-plus',
    title: 'CompTIA A+',
    blurb: 'Hardware, operating systems, networking and troubleshooting, mapped to the A+ exam objectives.',
    cover: 'aplus',
  });
});

test('the page sends no lesson figure: tracks-page.ts no longer reads lessonFigure', () => {
  expect(readFileSync('src/lib/tracks-page.ts', 'utf8')).not.toContain('lessonFigure');
});

test('a track with a lesson not ready has the widest strip words with the ready count (E3)', () => {
  // The strip's words grow by a digit as lessons are done and by " · R ready" while some are not ready; the longest form is what the page reserves.
  const entries = ready('networking').entries.map((e, i) => (i < 3 ? e : ({ ...e, available: false } as typeof e)));
  expect(stripLongest(entries)).toBe('20 of 20 lessons done · 3 ready');
});
