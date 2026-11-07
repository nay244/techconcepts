import { expect, test, vi } from 'vitest';
import { validateLesson } from '../content/define';
import { getEntries, getLesson, type AvailableSummary } from '../content/registry';
import type { Lesson } from '../content/schema';
import { makeLesson, makeTwoUnitLesson } from '../content/test-fixtures';
import { networkingTrack } from '../content/tracks';
import { positionOf, slotsFor } from '../engine/timeline';
import { cardPlaces, nextUps, presentTags, trackParts, type ReadyLesson } from './track';

// The real lessons and the small fixtures both validate: the fixtures' stand-in parts are added to the real ones.
vi.mock('../art/scenes/parts', async (importOriginal) => ({
  FIGURE_PARTS: (await import('../content/test-fixtures')).withFixtureParts(
    (await importOriginal<typeof import('../art/scenes/parts')>()).FIGURE_PARTS,
  ),
}));

const entries = getEntries('networking');
const lessonOf = (e: AvailableSummary): Lesson => getLesson('networking', e.slug)!;
const DHCP = getLesson('networking', 'dhcp')!;
const INTERNET = getLesson('networking', 'how-the-internet-works')!;

test('the six parts in order, each with its number, its title, its lessons and how many are ready', () => {
  const parts = trackParts(networkingTrack, entries, lessonOf);
  expect(parts.map((p) => [p.n, p.title, p.ready, p.lessons.length])).toEqual([
    [1, 'The big picture', 1, 3],
    [2, 'Addresses & the local network', 0, 4],
    [3, 'Getting between networks', 2, 3],
    [4, 'Talking across the internet', 0, 4],
    [5, 'The web', 0, 2],
    [6, 'Protecting & scaling traffic', 1, 4],
  ]);
  // Every planned lesson once, numbered across the track with two digits.
  const all = parts.flatMap((p) => p.lessons);
  expect(all.map((l) => l.n)).toEqual(Array.from({ length: 20 }, (_, i) => String(i + 1).padStart(2, '0')));
  expect(all.filter((l) => l.ready).map((l) => l.title)).toEqual(['How the Internet Works', 'Subnetting', 'DHCP', 'Firewalls']);
  expect(all[1]).toEqual({ ready: false, key: 'networking/osi-model', n: '02', title: 'OSI Model' });
});

test('a ready lesson carries its card: words, link, minutes, protocols for a lesson of several units, and exams', () => {
  const all = trackParts(networkingTrack, entries, lessonOf).flatMap((p) => p.lessons);
  const internet = all[0] as ReadyLesson;
  expect(internet).toMatchObject({
    ready: true,
    key: 'networking/how-the-internet-works',
    n: '01',
    number: 1,
    title: 'How the Internet Works',
    url: '/networking/how-the-internet-works',
    subtitle: 'The protocols behind every page',
    summary: INTERNET.summary,
    tags: ['a-plus', 'network-plus', 'security-plus', 'ccna', 'helpdesk'],
  });
  // 96 minutes and 14 protocols are counted from the lesson, not written in.
  expect(internet.meta).toEqual(['96 min', '14 protocols', 'CompTIA A+', 'CompTIA Network+', 'CompTIA Security+', 'Cisco CCNA', 'Helpdesk']);
  expect(internet.places).toEqual(cardPlaces(INTERNET));

  const dhcp = all.find((l) => l.title === 'DHCP') as ReadyLesson;
  expect(dhcp.meta).toEqual(['8 min', 'CompTIA A+', 'CompTIA Network+', 'Cisco CCNA', 'Helpdesk']);
  expect(dhcp.places).toHaveLength(slotsFor(DHCP).length);
});

test('the protocols chip counts the units of whatever lesson has several', () => {
  const two = validateLesson(makeTwoUnitLesson({ slug: 'dhcp', title: 'DHCP' })).lesson;
  const fixtureEntries = entries.map((e) => (e.slug === 'dhcp' && e.available ? { ...e, units: 2, minutes: 9 } : e));
  const all = trackParts(networkingTrack, fixtureEntries, (e) => (e.slug === 'dhcp' ? two : lessonOf(e))).flatMap((p) => p.lessons);
  expect((all.find((l) => l.title === 'DHCP') as ReadyLesson).meta.slice(0, 2)).toEqual(['9 min', '2 protocols']);
});

test('the exam chips are the tags some ready lesson carries, in the usual order', () => {
  expect(presentTags(entries)).toEqual(['a-plus', 'network-plus', 'security-plus', 'ccna', 'helpdesk', 'soc-analyst']);
});

test('each position of a one-unit lesson says which part it is in, and how far through Watch', () => {
  const places = cardPlaces(DHCP);
  expect(places[positionOf(DHCP, 0, 'overview')]).toEqual({ parts: ['', '', ''], note: 'Overview' });
  expect(places[positionOf(DHCP, 0, 'step', 3)]).toEqual({ parts: ['now', '', ''], note: 'Watch, step 3 of 5' });
  expect(places[positionOf(DHCP, 0, 'learn')]).toEqual({ parts: ['done', 'now', ''], note: 'Learn' });
  expect(places[positionOf(DHCP, 0, 'practice')]).toEqual({ parts: ['done', 'done', 'now'], note: 'Practice' });
});

test('in a lesson of several units each place names its unit', () => {
  const lesson = validateLesson(makeTwoUnitLesson()).lesson;
  const places = cardPlaces(lesson);
  expect(places).toHaveLength(slotsFor(lesson).length);
  expect(places[positionOf(lesson, 0, 'step', 2)]).toEqual({ parts: ['now', '', ''], note: 'Alpha: Watch, step 2 of 5' });
  expect(places[positionOf(lesson, 1, 'overview')]).toEqual({ parts: ['', '', ''], note: 'Beta: Overview' });
  expect(places[positionOf(lesson, 1, 'learn')]).toEqual({ parts: ['done', 'now', ''], note: 'Beta: Learn' });
});

test('what comes next is the step’s own sub-heading at a step, and nothing elsewhere', () => {
  const next = nextUps(DHCP);
  expect(next).toHaveLength(slotsFor(DHCP).length);
  expect(next[positionOf(DHCP, 0, 'step', 3)]).toBe('The laptop says yes, please');
  expect(next[positionOf(DHCP, 0, 'overview')]).toBeNull();
  expect(next[positionOf(DHCP, 0, 'learn')]).toBeNull();
  expect(next[positionOf(DHCP, 0, 'practice')]).toBeNull();

  const two = validateLesson(makeTwoUnitLesson()).lesson;
  expect(nextUps(two)[positionOf(two, 1, 'step', 1)]).toBe(two.units[1]!.steps[0]!.sub);
});

test('a lesson the registry lists as ready but the page cannot find stops the build by name', () => {
  const one = validateLesson(makeLesson({ slug: 'dhcp', title: 'DHCP' })).lesson;
  expect(() =>
    trackParts(networkingTrack, entries.slice(1), (e) => (e.slug === 'dhcp' ? one : lessonOf(e))),
  ).toThrow('The networking track lists "how-the-internet-works", which has no entry.');
});
