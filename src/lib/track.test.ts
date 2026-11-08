import { expect, test } from 'vitest';
import { CERT_TAGS } from '../content/certs';
import { buildEntries, getEntries, getLesson, type AvailableSummary } from '../content/registry';
import type { Lesson } from '../content/schema';
import { liftedFixture, makeLesson, makeTwoUnitLesson } from '../content/test-fixtures';
import { internetTrack, networkingTrack } from '../content/tracks';
import { positionOf, slotsFor } from '../engine/timeline';
import { cardPlaces, nextUps, presentTags, trackParts, type ReadyLesson } from './track';

const entries = getEntries('networking');
const lessonOf = (e: AvailableSummary): Lesson => getLesson(e.slug)!;
const DHCP = getLesson('dhcp')!;
const SUBNETTING = getLesson('subnetting')!;

test('the six parts in order, each with its number, its title, its lessons and how many are ready', () => {
  const parts = trackParts(networkingTrack, entries, lessonOf);
  expect(parts.map((p) => [p.n, p.title, p.ready, p.lessons.length])).toEqual([
    [1, 'The big picture', 0, 2],
    [2, 'Addresses & the local network', 0, 4],
    [3, 'Getting between networks', 2, 3],
    [4, 'Talking across the internet', 0, 4],
    [5, 'The web', 0, 2],
    [6, 'Protecting & scaling traffic', 1, 4],
  ]);
  // Every planned lesson once, numbered across the track with two digits.
  const all = parts.flatMap((p) => p.lessons);
  expect(all.map((l) => l.n)).toEqual(Array.from({ length: 19 }, (_, i) => String(i + 1).padStart(2, '0')));
  expect(all.filter((l) => l.ready).map((l) => l.title)).toEqual(['Subnetting', 'DHCP', 'Firewalls']);
  expect(all[0]).toEqual({ ready: false, key: 'osi-model', n: '01', title: 'OSI Model' });
});

test('How the Internet Works: six parts, every lesson ready, numbered 01 to 14', () => {
  const parts = trackParts(internetTrack, getEntries('how-the-internet-works'), lessonOf);
  expect(parts.map((p) => [p.n, p.title, p.ready, p.lessons.length])).toEqual([
    [1, 'Loading a web page', 2, 2],
    [2, 'Getting the data there', 3, 3],
    [3, 'Behind the scenes', 3, 3],
    [4, 'Email', 3, 3],
    [5, 'Files and remote control', 2, 2],
    [6, 'The seal', 1, 1],
  ]);
  const all = parts.flatMap((p) => p.lessons);
  expect(all.map((l) => l.n)).toEqual(Array.from({ length: 14 }, (_, i) => String(i + 1).padStart(2, '0')));
  // No exam tags until each lesson's audit maps them, so a card has nothing in its list.
  const http = all[0] as ReadyLesson;
  expect(http).toMatchObject({ key: 'what-is-http', title: 'HTTP', url: '/how-the-internet-works/what-is-http', tags: [], meta: [] });
});

test('a ready lesson carries its card: words, link and exams', () => {
  const all = trackParts(networkingTrack, entries, lessonOf).flatMap((p) => p.lessons);
  const subnetting = all.find((l) => l.ready) as ReadyLesson;
  expect(subnetting).toMatchObject({
    ready: true,
    key: 'subnetting',
    n: '07',
    number: 7,
    title: 'Subnetting',
    url: '/networking/subnetting',
    subtitle: SUBNETTING.subtitle,
    summary: SUBNETTING.summary,
    tags: ['network-plus', 'ccna'],
  });
  expect(subnetting.meta).toEqual(['CompTIA Network+', 'Cisco CCNA']);
  expect(subnetting.metaLabel).toBe('Exams');
  expect(subnetting.places).toEqual(cardPlaces(SUBNETTING));

  const dhcp = all.find((l) => l.title === 'DHCP') as ReadyLesson;
  expect(dhcp.meta).toEqual(['CompTIA A+', 'CompTIA Network+', 'Cisco CCNA', 'Helpdesk']);
  expect(dhcp.metaLabel).toBe('Exams');
  expect(dhcp.places).toHaveLength(slotsFor(DHCP).length);
});

test('a lesson of several units counts its protocols before its exams', () => {
  // No ready lesson has several units since the split, so a two-unit fixture stands in as HTTP.
  const two = liftedFixture(makeTwoUnitLesson({ slug: 'what-is-http', title: 'HTTP' }));
  const tour = buildEntries(internetTrack, { 'what-is-http': two }, () => 'how-the-internet-works');
  const http = trackParts(internetTrack, tour, () => two)[0]!.lessons[0] as ReadyLesson;
  expect(http).toMatchObject({ key: 'what-is-http', n: '01', url: '/how-the-internet-works/what-is-http' });
  expect(http.meta).toEqual(['2 protocols', ...two.certTags.map((t) => CERT_TAGS[t])]);
  expect(http.metaLabel).toBe('Protocols and exams');
  expect(http.places).toEqual(cardPlaces(two));
});

test('the protocols chip counts the units of whatever lesson has several', () => {
  const two = liftedFixture(makeTwoUnitLesson({ slug: 'dhcp', title: 'DHCP' }));
  const fixtureEntries = entries.map((e) => (e.slug === 'dhcp' && e.available ? { ...e, units: 2 } : e));
  const all = trackParts(networkingTrack, fixtureEntries, (e) => (e.slug === 'dhcp' ? two : lessonOf(e))).flatMap((p) => p.lessons);
  const dhcp = all.find((l) => l.title === 'DHCP') as ReadyLesson;
  expect(dhcp.meta.slice(0, 1)).toEqual(['2 protocols']);
  expect(dhcp.metaLabel).toBe('Protocols and exams');
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
  const lesson = liftedFixture(makeTwoUnitLesson());
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

  const two = liftedFixture(makeTwoUnitLesson());
  expect(nextUps(two)[positionOf(two, 1, 'step', 1)]).toBe(two.units[1]!.steps[0]!.sub);
});

test('a lesson the registry lists as ready but the page cannot find stops the build by name', () => {
  const one = liftedFixture(makeLesson({ slug: 'dhcp', title: 'DHCP' }));
  expect(() =>
    trackParts(networkingTrack, entries.slice(1), (e) => (e.slug === 'dhcp' ? one : lessonOf(e))),
  ).toThrow('The networking track lists "osi-model", which has no entry.');
});
