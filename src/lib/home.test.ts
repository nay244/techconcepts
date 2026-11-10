import { expect, test } from 'vitest';
import { drawFigure } from '../art/scenes';
import { getEntries, getLesson } from '../content/registry';
import type { Lesson } from '../content/schema';
import { positionOf } from '../engine/timeline';
import { STATUS_WORDS } from './hub';
import { homeTrackCards, insideSheet, osiLitAt } from './home';

const lesson = (slug: string): Lesson => {
  const found = getLesson(slug);
  if (found === undefined) throw new Error(`no ${slug}`);
  return found;
};
const OSI = lesson('osi-model');

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

test('the inside sheet refuses a lesson that is not ready in the track, by name', () => {
  const planned = getEntries('networking').find((e) => !e.available);
  if (planned === undefined) throw new Error('Networking has no lesson still to come.');
  expect(() => insideSheet('networking', planned.slug)).toThrow(new RegExp(`networking/${planned.slug}.*not ready`));
  // Ready, but in another track only.
  expect(() => insideSheet('how-the-internet-works', 'osi-model')).toThrow(/how-the-internet-works\/osi-model.*not ready/);
  expect(() => insideSheet('no-such-track', 'osi-model')).toThrow(/not ready/);
});

test('the inside sheet refuses a lesson drawn on another figure, since it lights the OSI one', () => {
  expect(() => insideSheet('networking', 'dhcp')).toThrow(/OSI figure.*dhcp draws "dhcp"/);
});

test('the inside sheet refuses to show more Watch steps than the lesson has', () => {
  const steps = OSI.units[0]!.steps.length;
  expect(() => insideSheet('networking', 'osi-model', steps)).not.toThrow();
  expect(() => insideSheet('networking', 'osi-model', steps + 1)).toThrow(RangeError);
  expect(() => insideSheet('networking', 'osi-model', steps + 1)).toThrow(`has ${steps} Watch steps; the sheet shows ${steps + 1}`);
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
