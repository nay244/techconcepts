import { expect, test } from 'vitest';
import { drawFigure } from '../art/scenes';
import { getLesson } from '../content/registry';
import type { Lesson } from '../content/schema';
import { liftedFixture, makeTwoUnitLesson } from '../content/test-fixtures';
import { internetTrack, networkingTrack } from '../content/tracks';
import { positionOf, resumeLabel, slotsFor } from '../engine/timeline';
import { STATUS_WORDS } from './hub';
import { firstSentence, homeTrackCards, insideSheet, osiLitAt, resumePlaces } from './home';

const lesson = (slug: string): Lesson => {
  const found = getLesson(slug);
  if (found === undefined) throw new Error(`no ${slug}`);
  return found;
};
const DHCP = lesson('dhcp');
const HTTP = lesson('what-is-http');
const OSI = lesson('osi-model');

test('the track card carries the first sentence of the description, or all of it when it has one sentence', () => {
  expect(firstSentence(networkingTrack.description)).toBe(
    'How devices find each other and talk: addresses, switches and routers, the web, and the tools that protect and scale it.',
  );
  expect(firstSentence(internetTrack.description)).toBe(
    'Meet the 14 protocols the internet runs on, from HTTP and DNS to email, SSH and TLS, one short lesson each.',
  );
  expect(firstSentence('One sentence only.')).toBe('One sentence only.');
  expect(firstSentence('No full stop at all')).toBe('No full stop at all');
  expect(firstSentence('First. Second. Third.')).toBe('First.');
});

test('Home’s track cards: the two tracks with lessons in order, then A+, each linking to its panel on Tracks', () => {
  const cards = homeTrackCards();
  expect(cards.map((c) => c.id)).toEqual(['how-the-internet-works', 'networking', 'comptia-a-plus']);
  expect(cards.map((c) => c.href)).toEqual(['/tracks#how-the-internet-works', '/tracks#networking', '/tracks#comptia-a-plus']);
  expect(cards.map((c) => c.cover)).toEqual(['web', 'networking', 'aplus']);
  expect(cards.map((c) => c.title)).toEqual(['How the Internet Works', 'Networking Concepts', 'CompTIA A+']);
});

test('a track with every lesson ready counts them; one with some ready says how many of how many', () => {
  const [internet, networking] = homeTrackCards();
  expect(internet).toMatchObject({
    count: '14 lessons',
    go: 'See the lessons →',
    ready: true,
    chips: [
      { text: 'Beginner', plain: false },
      { text: 'Start here', plain: true },
    ],
    blurb: 'Meet the 14 protocols the internet runs on, from HTTP and DNS to email, SSH and TLS, one short lesson each.',
  });
  expect(networking).toMatchObject({
    count: '4 of 19 lessons ready',
    go: 'See the lessons →',
    ready: true,
    chips: [{ text: 'Beginner', plain: false }],
    blurb: 'How devices find each other and talk: addresses, switches and routers, the web, and the tools that protect and scale it.',
  });
});

test('A+ has no lessons yet: it says Not ready yet, its planned blurb, and that lessons are on the way', () => {
  const aplus = homeTrackCards()[2]!;
  expect(aplus).toMatchObject({
    count: 'Lessons on the way',
    go: 'See the track',
    ready: false,
    chips: [{ text: STATUS_WORDS['not-ready'], plain: true }],
    blurb: 'Hardware, operating systems, networking and troubleshooting, mapped to the A+ exam objectives.',
  });
  expect(aplus.chips[0]!.text).toBe('Not ready yet');
});

test('the inside sheet is OSI Model’s: its place in the track, its Overview words and its first three steps', () => {
  const sheet = insideSheet();
  const unit = OSI.units[0]!;
  expect(sheet.label).toBe('Networking Concepts · lesson 1');
  expect(sheet.title).toBe('OSI Model');
  expect(sheet.url).toBe('/networking/osi-model');
  expect(sheet.hook).toBe(unit.overview.hook);
  expect(sheet.scene).toBe(unit.scene.title);
  expect(sheet.steps).toEqual([
    { n: '01', title: 'Application Layer', sub: 'The message enters at the top' },
    { n: '02', title: 'Presentation Layer', sub: 'Both ends agree how the data is written' },
    { n: '03', title: 'Session Layer', sub: 'Opens the conversation and keeps it in order' },
  ]);
  expect(sheet.steps).toEqual(unit.steps.slice(0, 3).map((s, i) => ({ n: `0${i + 1}`, title: s.title, sub: s.sub })));
});

test('the inside sheet’s part links open the lesson at its first step, its Learn and its Practice', () => {
  const { parts } = insideSheet();
  expect(parts).toEqual({
    watch: '/networking/osi-model?step=1',
    learn: `/networking/osi-model?step=${positionOf(OSI, 0, 'learn')}`,
    practice: `/networking/osi-model?step=${positionOf(OSI, 0, 'practice')}`,
  });
  // OSI Model has ten steps after its Overview: Learn is position 11 and Practice 12.
  expect(parts.learn).toBe('/networking/osi-model?step=11');
  expect(parts.practice).toBe('/networking/osi-model?step=12');
});

test('the inside sheet’s figure is the lesson’s own, with its words written in and the first step’s block lit', () => {
  const { figure } = insideSheet();
  expect(figure).toMatch(/^<svg data-figure="osi"/);
  expect(figure).toContain('>APPLICATION</tspan>');
  expect(figure).toContain('>Your laptop</text>');
  // One block lit, layer 7 on the laptop, and the laptop's callout current.
  expect(figure.match(/class="osi-L on"/g)).toHaveLength(1);
  expect(figure).toContain('<g class="osi-L on" id="osi-L-laptop-7"><g class="iso-solid" data-lit=""');
  expect(figure).toContain('<g class="osi-call focus" id="osi-call-laptop">');
  expect(figure.match(/class="osi-call focus"/g)).toHaveLength(1);
});

test('lighting the OSI figure: a layer cue lights its block and its machine’s callout; other cues are left alone', () => {
  const svg = drawFigure('osi').svg;
  const lit = osiLitAt(svg, [
    { cue: 'layer', arg: 'server:3' },
    { cue: 'peer', arg: '4' },
  ]);
  expect(lit.match(/class="osi-L on"/g)).toHaveLength(1);
  expect(lit).toMatch(/<g class="osi-L on" id="osi-L-server-3"><g class="iso-solid" data-lit=""/);
  expect(lit).toContain('<g class="osi-call focus" id="osi-call-server">');
  // Nothing else changes: the lit figure is the drawn one with those three attributes added.
  const unlit = lit
    .replace('<g class="osi-L on" id="osi-L-server-3"><g class="iso-solid" data-lit=""', '<g class="osi-L" id="osi-L-server-3"><g class="iso-solid"')
    .replace('<g class="osi-call focus" id="osi-call-server">', '<g class="osi-call" id="osi-call-server">');
  expect(unlit).toBe(svg);
});

test('lighting a block the figure does not have is refused by name', () => {
  const svg = drawFigure('osi').svg;
  expect(() => osiLitAt(svg, [{ cue: 'layer', arg: 'router:7' }])).toThrow(/osi-L-router-7/);
});

test('each place reads after "You’re on" and before "in <lesson>"; a step keeps resumeLabel’s words', () => {
  const places = resumePlaces(DHCP);
  expect(places).toEqual([
    'the Overview',
    'step 1 of 5',
    'step 2 of 5',
    'step 3 of 5',
    'step 4 of 5',
    'step 5 of 5',
    'the Learn part',
    'the Practice part',
  ]);
  slotsFor(DHCP).forEach((slot, p) => {
    if (slot.kind === 'step') expect(places[p]).toBe(resumeLabel(DHCP, p));
  });
});

test('in a lesson of many units the unit’s name says which part', () => {
  const two = liftedFixture(makeTwoUnitLesson());
  expect(resumePlaces(two)).toEqual([
    'the Alpha Overview',
    'Alpha step 1 of 5',
    'Alpha step 2 of 5',
    'Alpha step 3 of 5',
    'Alpha step 4 of 5',
    'Alpha step 5 of 5',
    'the Alpha Learn part',
    'the Alpha Practice part',
    'the Beta Overview',
    'Beta step 1 of 5',
    'Beta step 2 of 5',
    'Beta step 3 of 5',
    'Beta step 4 of 5',
    'Beta step 5 of 5',
    'the Beta Learn part',
    'the Beta Practice part',
  ]);
});

test('a How the Internet Works lesson is one unit, so its places read like DHCP’s, with no unit name', () => {
  const places = resumePlaces(HTTP);
  expect(places).toHaveLength(slotsFor(HTTP).length);
  expect(places[0]).toBe('the Overview');
  expect(places[1]).toBe(`step 1 of ${HTTP.units[0]!.steps.length}`);
  expect(places.at(-1)).toBe('the Practice part');
});
