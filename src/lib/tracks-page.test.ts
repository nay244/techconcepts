import { expect, test } from 'vitest';
import { trackCards } from './tracks-page';

const card = (id: string) => trackCards().find((c) => c.id === id)!;

test('How the Internet Works first, then Networking, then A+', () => {
  expect(trackCards().map((c) => c.id)).toEqual(['how-the-internet-works', 'networking', 'comptia-a-plus']);
});

test('How the Internet Works wears the web cover, with all 14 lessons ready', () => {
  expect(card('how-the-internet-works')).toMatchObject({
    href: '/how-the-internet-works',
    kind: 'Concept track · Beginner',
    count: '14 lessons · 14 ready',
    cover: 'web',
    planned: 14,
  });
  expect(card('how-the-internet-works').blurb).toBe(
    'Meet the 14 protocols the internet runs on, from HTTP and DNS to email, SSH and TLS, one short lesson each.',
  );
  expect(Object.keys(card('how-the-internet-works').known)).toHaveLength(14);
});

test('a ready track links to its page, with its counts and type', () => {
  expect(card('networking')).toMatchObject({
    href: '/networking',
    kind: 'Concept track · Beginner',
    count: '19 lessons · 3 ready',
    flag: null,
    planned: 19,
    cover: 'networking',
  });
  expect(card('networking').blurb).toBe(
    'How devices find each other and talk: addresses, switches and routers, the web, and the tools that protect and scale it.',
  );
  // The progress island reads the ready lessons' last positions, as Home's card does.
  expect(Object.keys(card('networking').known)).toHaveLength(3);
});

test('a planned track is no link, says so, and has no progress', () => {
  expect(card('comptia-a-plus')).toMatchObject({
    href: null,
    kind: 'Certification track · Beginner',
    count: 'No lessons yet',
    flag: 'Being written',
    known: {},
    planned: 0,
    cover: 'aplus',
  });
  expect(card('comptia-a-plus').blurb).toBe('Hardware, operating systems, networking and troubleshooting, mapped to the A+ exam objectives.');
});

test('the first track is where to start', () => {
  expect(trackCards().map((c) => c.start)).toEqual([true, false, false]);
});
