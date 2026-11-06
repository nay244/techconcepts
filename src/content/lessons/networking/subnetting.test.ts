import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { drawSubnet } from '../../../art/scenes/subnet';
import { parseIPv4 } from '../../../engine/net/ipv4';
import { sameSubnet } from '../../../engine/net/subnet';
import { initialPlayback } from '../../../engine/playback';
import { deriveState, positionOf } from '../../../engine/timeline';
import { BitsBoard } from '../../../lesson/panels/BitsBoard';
import { ScenePanel } from '../../../lesson/ScenePanel';
import { lessonNumbers, lessonTitles } from '../../../test/lesson-references';
import { validateLesson } from '../../define';
import { countUnitWords, estimateMinutes } from '../../estimate';
import { checkStated } from '../../helpers/subnet-events';
import { getEntries } from '../../registry';
import type { Fact, Lesson, NoteEvent, Unit } from '../../schema';
import subnetting, { STATED } from './subnetting';

const unit = subnetting.units[0]!;
const events = unit.steps.flatMap((s) => s.events);
const notes = events.filter((e): e is NoteEvent => e.type === 'note');
const ip = (text: string): number => {
  const parsed = parseIPv4(text);
  if (!parsed.ok) throw new Error(text);
  return parsed.value;
};
const noteById = (id: string): NoteEvent => notes.find((e) => e.id === id)!;

test('Subnetting validates and takes 10 minutes', () => {
  expect(() => validateLesson(subnetting)).not.toThrow();
  expect(subnetting.units).toHaveLength(1);
  expect(unit.steps).toHaveLength(6);
  expect(events).toHaveLength(17);
  expect(unit.practice).toHaveLength(3);
  expect(estimateMinutes(subnetting)).toBe(10);
  // The mockup's words, all of them. FIGS/minutes.mjs counts 1178: it turns each <b> tag into a space, so the
  // punctuation after 9 bold terms ("**subnet mask**:") counts as a word of its own. The site counts the same words as 1169.
  expect(countUnitWords(unit)).toBe(1169);
});

test('the lesson is lesson 8, Subnetting, on the office figure with the bits board', () => {
  expect(subnetting).toMatchObject({
    slug: 'subnetting',
    title: 'Subnetting',
    subtitle: 'Splitting networks into smaller ones',
    level: 'beginner',
    certTags: ['network-plus', 'ccna'],
    summary:
      'See how one big network is cut into smaller ones, how many devices fit in each, and how a device tells whether another device is its neighbour.',
    figure: 'subnet',
  });
  expect(getEntries('networking').find((e) => e.slug === 'subnetting')).toMatchObject({ number: 8, available: true, minutes: 10 });
  expect(unit).toMatchObject({
    name: 'Subnetting',
    fullName: 'Cutting one network into smaller ones',
    purpose: 'One network, cut into four',
    osiLayers: [3],
  });
  expect(unit.references.map((r) => r.label)).toEqual([
    'RFC 950: Internet Standard Subnetting Procedure',
    'RFC 4632: Classless Inter-domain Routing (CIDR)',
  ]);
  expect(unit.scene.title).toBe('Office network · 192.168.1.0/24');
  expect(unit.scene.panel).toEqual({ type: 'bits' });
});

test('step titles are the technical terms, in order, and the pattern names the four things worked out', () => {
  expect(unit.steps.map((s) => [s.title, s.sub])).toEqual([
    ['Network and Host Portions', 'Which network, then which device'],
    ['Subnet Mask', 'A number marks where the network ends'],
    ['Network and Broadcast Addresses', 'Two addresses are kept back'],
    ['Borrowing Bits', 'Move the line right for smaller networks'],
    ['Local vs. Remote Delivery', 'Same subnet: direct. Different: the router'],
    ['Point-to-Point Subnet', 'A /30 holds exactly two devices'],
  ]);
  expect(unit.learn.pattern.names).toEqual(['Subnet Mask', 'Network Address', 'Broadcast Address', 'Usable Addresses']);
});

test('the pattern note’s steps are the ones that work at those prefixes', () => {
  expect(unit.learn.pattern.note).toContain('Steps 2 and 3 did it for a /24, step 4 for a /26 and step 6 for a /30.');
  const prefixes = (step: number) => [...new Set(unit.steps[step - 1]!.events.map((e) => (e.type === 'note' ? e.board?.prefix : null)))];
  expect([prefixes(2), prefixes(3), prefixes(4), prefixes(6)]).toEqual([[24], [24], [26], [30]]);
});

/** The mockup's log rows, from FIGS/subnet-lesson.mjs: worked out, value, prefix, in plain words. */
const MOCKUP_ROWS = [
  ['Address', '192.168.1.10', '', 'The Sales laptop’s address, in bits'],
  ['Network portion', '192.168.1', '', 'Which network: the same for the whole office'],
  ['Host portion', '10', '', 'Which device: the laptop'],
  ['Subnet mask', '255.255.255.0', '/24', '24 ones, then 8 zeros'],
  ['Prefix length', '/24', '/24', 'Written 192.168.1.10/24'],
  ['Network address', '192.168.1.0', '/24', 'Host bits all 0: the network’s own name'],
  ['Broadcast address', '192.168.1.255', '/24', 'Host bits all 1: the whole floor hears it'],
  ['Usable addresses', '254', '/24', '256 addresses, minus those two: .1 to .254'],
  ['Subnet mask', '255.255.255.192', '/26', '2 host bits borrowed for the network'],
  ['Subnets', '4 × 64 addresses', '/26', 'Starting at .0, .64, .128 and .192'],
  ['Network address', '192.168.1.64', '/26', 'The Design PC, .70, has 01 in the borrowed bits'],
  ['Broadcast address', '192.168.1.127', '/26', 'Host bits all 1: only Design hears it'],
  ['Same subnet', '192.168.1.20', '/26', 'Network parts match: straight to the printer'],
  ['Different subnet', '192.168.1.70', '/26', 'Network parts differ: sent via the router'],
  ['Subnet mask', '255.255.255.252', '/30', '30 network bits, 2 host bits'],
  ['Network address', '203.0.113.4', '/30', 'Broadcast is 203.0.113.7, so two are left'],
  ['Usable addresses', '203.0.113.5 and .6', '/30', 'One for each end of the link'],
];

test('subnetValue gives the mockup values for every event', () => {
  expect(notes).toHaveLength(17);
  expect(notes.map((e) => [e.log.worked, e.log.value, e.log.prefix, e.plain])).toEqual(MOCKUP_ROWS);
});

/** The mockup's fx for each event, as cues: a flag alone, a text cue with its arg. */
const MOCKUP_CUES = [
  ['glow laptop', 'focus sales'],
  ['one-net', 'pulse onenet'],
  ['glow laptop', 'focus sales'],
  [],
  ['pulse onenet'],
  ['pulse onenet'],
  ['ring all', 'glow laptop', 'focus sales'],
  [],
  ['cut'],
  ['pulse pads'],
  ['glow pc', 'focus design'],
  ['ring design', 'glow pc', 'focus design'],
  ['route local', 'busy printer', 'focus sales'],
  ['route remote', 'busy pc', 'focus router'],
  ['link', 'focus router'],
  ['pulse link'],
  ['route link', 'busy provider', 'focus provider'],
];

test('each event carries the mockup’s fx as cues, and the figure has every part they name', () => {
  expect(notes.map((e) => (e.cues ?? []).map((c) => (c.arg === undefined ? c.cue : `${c.cue} ${c.arg}`)))).toEqual(MOCKUP_CUES);
  const { svg } = drawSubnet();
  const ids = new Set([...svg.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]));
  const partFor: Record<string, (arg: string) => string> = {
    glow: (arg) => `sn-glow-${arg}`,
    focus: (arg) => `sn-call-${arg}`,
    ring: (arg) => `sn-ring-${arg}`,
    route: (arg) => `sn-tag-${arg}`,
    busy: (arg) => (arg === 'pc' ? 'sn-glow-pc' : `sn-busy-${arg}`),
    pulse: (arg) => ({ onenet: 'sn-onenet', link: 'sn-link', pads: 'sn-padline-sales' })[arg] ?? arg,
  };
  for (const { cue, arg } of notes.flatMap((e) => e.cues ?? [])) {
    if (arg !== undefined) expect(ids.has(partFor[cue]!(arg)), `${cue} ${arg}`).toBe(true);
  }
});

test('the log is “Working”, with the mockup’s columns: words where it has words, and its widths', () => {
  const log = unit.scene.log;
  expect(log.title).toBe('Working');
  expect(log.columns.map((c) => [c.key, c.label, c.width ?? null, c.prose ?? false])).toEqual([
    ['worked', 'Worked out', 176, true],
    ['value', 'Value', 190, false],
    ['prefix', 'Prefix', 76, false],
    ['plain', 'In plain words', null, true],
  ]);
  // Every row is something worked out, so the one glyph the log draws is explained as that.
  expect(log.legend).toEqual([{ kind: 'note', label: 'Worked out' }]);
  expect(unit.steps[0]!.idle).toBe('Nothing worked out yet. Press Play, or pick a step.');
});

test('192.168.1.10 and 192.168.1.70 are in different /26 subnets, and the text says so', () => {
  expect(sameSubnet(ip('192.168.1.10'), ip('192.168.1.70'), 26)).toBe(false);
  expect(sameSubnet(ip('192.168.1.10'), ip('192.168.1.70'), 24)).toBe(true);
  expect(sameSubnet(ip('192.168.1.10'), ip('192.168.1.20'), 26)).toBe(true);

  // The log: each compared address is marked same or different, as the engine says.
  for (const e of notes.filter((n) => n.board?.third?.mode === 'cmp' && n.board.addr.startsWith('192.168.1.'))) {
    const same = sameSubnet(ip(e.board!.addr), ip(e.board!.third!.addr), e.board!.prefix!);
    expect(e.log.worked, e.id).toBe(same ? 'Same subnet' : 'Different subnet');
  }
  const different = noteById('different-subnet');
  expect(different.board).toMatchObject({ addr: '192.168.1.10', prefix: 26, third: { addr: '192.168.1.70', mode: 'cmp' } });
  expect(different.plain).toBe('Network parts differ: sent via the router');
  // The board under the scene says so too.
  expect(renderToStaticMarkup(createElement(BitsBoard, { board: different.board! }))).toContain(
    '/26: the network parts differ, so it’s another subnet',
  );
  // So do the narration and Practice.
  const delivery = unit.steps[4]!;
  expect(delivery.narrative).toContain('The Design PC, 192.168.1.70, doesn’t match');
  const question = unit.practice.find((q) => q.prompt.includes('192.168.1.70'))!;
  expect(question.options[question.answer]!.text).toBe('To the router, because the network parts differ.');
});

test('the lesson hides the Sequence toggle', () => {
  expect(unit.scene.views).toEqual(['network']);
  const derived = deriveState(subnetting, positionOf(subnetting, 0, 'step', 1), 0);
  const html = renderToStaticMarkup(
    createElement(ScenePanel, { unit, figure: null, figureData: null, derived, playback: initialPlayback(), reducedMotion: false }),
  );
  expect(html).not.toContain('Sequence');
  expect(html).not.toContain('aria-pressed');
  expect(html).toContain('Office network · 192.168.1.0/24');
  expect(html).toContain('The address in bits');
});

test('the lesson points at other lessons by name, and each is a lesson of the track', () => {
  expect(lessonNumbers(subnetting)).toEqual([]);
  const titles = getEntries('networking').map((e) => e.title);
  expect(lessonTitles(subnetting)).toEqual(['IP Address', 'Router']);
  for (const title of lessonTitles(subnetting)) expect(titles).toContain(title);
});

// ------------------------------------------------------------------ the numbers

/** The words a learner reads, where numbers are stated: everything but ids, data and the engine's own log cells. */
function proseOf(u: Unit): string[] {
  const facts = (list: Fact[]) => list.flatMap((f) => [f.label, f.value]);
  return [
    u.scene.title,
    u.overview.hook,
    u.overview.description,
    ...facts(u.overview.facts),
    ...u.steps.flatMap((s) => [
      s.title,
      s.sub,
      s.narrative,
      s.deep,
      ...facts(s.facts),
      ...s.events.flatMap((e) => (e.type === 'table' ? [] : [e.plain])),
    ]),
    u.learn.lead,
    ...u.learn.terms.flatMap((t) => [t.idea, t.name]),
    ...u.learn.pattern.names,
    u.learn.pattern.note,
    u.learn.why,
    u.learn.deep,
    ...facts(u.learn.facts),
    ...u.practice.flatMap((q) => [q.prompt, ...q.options.flatMap((o) => [o.text, o.feedback])]),
  ];
}

/** Numbers in the text that are not the engine's to work out: a street, standards, the lesson's own steps, named ranges. */
const NOT_COMPUTED = [
  '12 Oak Street',
  'RFC 950',
  'RFC 4632',
  'RFC 3021',
  'Steps 2 and 3',
  'step 4',
  'step 6',
  '192.168.x.x',
  '203.0.113.x',
];

/** The numbers in `text` that no stated phrase (or phrase that is not the engine's) covers. */
function uncovered(text: string, phrases: string[]): string[] {
  const covered: [number, number][] = [];
  for (const phrase of phrases) {
    for (let at = text.indexOf(phrase); at !== -1; at = text.indexOf(phrase, at + 1)) covered.push([at, at + phrase.length]);
  }
  return [...text.matchAll(/\d+(?:\.\d+)*/g)]
    .filter((m) => !covered.some(([from, to]) => m.index >= from && m.index + m[0].length <= to))
    .map((m) => `${m[0]} in “${text}”`);
}

/** A copy of the lesson with `from` changed to `to` in the one string of `pick`. */
function changed(pick: (u: Unit) => { parent: Record<string, unknown>; key: string }, from: string, to: string): Lesson {
  const copy = structuredClone(subnetting);
  const { parent, key } = pick(copy.units[0]!);
  const text = parent[key] as string;
  expect(text).toContain(from);
  parent[key] = text.replace(from, to);
  return copy;
}

test('every number in narratives and facts is one the engine computes', () => {
  expect(() => checkStated(subnetting, STATED)).not.toThrow();
  // Every number the learner reads is in a stated phrase, so a wrong one stops the build.
  const phrases = [...STATED.map((s) => s.text), ...NOT_COMPUTED];
  expect(proseOf(unit).flatMap((text) => uncovered(text, phrases))).toEqual([]);

  // One number changed, in a narrative, a fact, a log row's words or a question: each copy throws.
  const reserved = (u: Unit) => ({ parent: u.steps[2]! as unknown as Record<string, unknown>, key: 'narrative' });
  expect(() => checkStated(changed(reserved, '192.168.1.255', '192.168.1.254'), STATED)).toThrow(/192\.168\.1\.255/);
  const designRange = (u: Unit) => ({ parent: u.steps[3]!.facts[3]! as unknown as Record<string, unknown>, key: 'value' });
  expect(() => checkStated(changed(designRange, '192.168.1.126', '192.168.1.125'), STATED)).toThrow(/192\.168\.1\.126/);
  const subnets = (u: Unit) => ({ parent: u.steps[3]!.events[1]! as unknown as Record<string, unknown>, key: 'plain' });
  expect(() => checkStated(changed(subnets, '.128', '.127'), STATED)).toThrow(/\.128/);
  const usable = (u: Unit) => ({ parent: u.practice[0]!.options[1]! as unknown as Record<string, unknown>, key: 'feedback' });
  expect(() => checkStated(changed(usable, '62 are left', '60 are left'), STATED)).toThrow(/62/);
});
