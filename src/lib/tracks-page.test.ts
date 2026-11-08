import { expect, test } from 'vitest';
import { trackCards } from './tracks-page';

test('Networking first, then A+', () => {
  expect(trackCards().map((c) => c.id)).toEqual(['networking', 'comptia-a-plus']);
});

test('a ready track links to its page, with its counts and type', () => {
  expect(trackCards()[0]).toMatchObject({
    href: '/networking',
    kind: 'Concept track · Beginner',
    count: '20 lessons · 4 ready',
    flag: null,
    planned: 20,
    cover: 'networking',
  });
  expect(trackCards()[0]!.blurb).toBe(
    'How devices find each other and talk: addresses, switches and routers, the web, and the tools that protect and scale it.',
  );
  // The progress island reads the ready lessons' last positions, as Home's card does.
  expect(Object.keys(trackCards()[0]!.known)).toHaveLength(4);
});

test('a planned track is no link, says so, and has no progress', () => {
  expect(trackCards()[1]).toMatchObject({
    href: null,
    kind: 'Certification track · Beginner',
    count: 'No lessons yet',
    flag: 'Being written',
    known: {},
    planned: 0,
    cover: 'aplus',
  });
  expect(trackCards()[1]!.blurb).toBe('Hardware, operating systems, networking and troubleshooting, mapped to the A+ exam objectives.');
});
