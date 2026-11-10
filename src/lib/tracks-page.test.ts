import { expect, test } from 'vitest';
import { trackCards, type PlannedTrackCard, type ReadyTrackCard } from './tracks-page';

const ready = (id: string) => trackCards().find((c): c is ReadyTrackCard => c.ready && c.id === id)!;

test('How the Internet Works first, then Networking, then A+', () => {
  expect(trackCards().map((c) => c.id)).toEqual(['how-the-internet-works', 'networking', 'comptia-a-plus']);
});

test('How the Internet Works links to its page, with all 14 lessons ready and a figure for each', () => {
  const card = ready('how-the-internet-works');
  expect(card).toMatchObject({ ready: true, title: 'How the Internet Works', href: '/how-the-internet-works' });
  expect(card.blurb).toBe('Meet the 14 protocols the internet runs on, from HTTP and DNS to email, SSH and TLS, one short lesson each.');
  expect(card.entries).toHaveLength(14);
  expect(Object.keys(card.known)).toHaveLength(14);
  expect(card.figures.map((f) => f.slot)).toEqual(Array.from({ length: 14 }, (_, i) => `art${i + 1}`));
  for (const { svg } of card.figures) expect(svg).toMatch(/^<svg/);
});

test('a track with some lessons ready lists every lesson, and a figure for each ready one', () => {
  const card = ready('networking');
  expect(card).toMatchObject({ ready: true, title: 'Networking Concepts', href: '/networking' });
  expect(card.blurb).toBe(
    'How devices find each other and talk: addresses, switches and routers, the web, and the tools that protect and scale it.',
  );
  expect(card.entries).toHaveLength(19);
  // The progress island reads the ready lessons' last positions, as the track page does.
  expect(Object.keys(card.known)).toHaveLength(4);
  const readyNumbers = card.entries.filter((e) => e.available).map((e) => `art${e.number}`);
  expect(card.figures.map((f) => f.slot)).toEqual(readyNumbers);
  for (const { svg } of card.figures) expect(svg).toMatch(/^<svg/);
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
