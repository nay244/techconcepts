// @vitest-environment jsdom
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { drawSubnet } from '../../art/scenes/subnet';
import { parseIPv4 } from '../../engine/net/ipv4';
import { sameSubnet } from '../../engine/net/subnet';
import { initialPlayback } from '../../engine/playback';
import { deriveState, positionOf } from '../../engine/timeline';
import { BitsBoard } from '../../lesson/panels/BitsBoard';
import { ScenePanel } from '../../lesson/ScenePanel';
import { lessonNumbers, lessonTitles } from '../../test/lesson-references';
import { showSweep } from '../../test/show-sweep';
import { checkStructure } from '../define';
import { checkStated, learnerProse } from '../helpers/subnet-events';
import { getEntries } from '../registry';
import type { Lesson, NoteEvent } from '../schema';
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

test('Subnetting validates', () => {
  expect(checkStructure(subnetting)).toEqual([]);
  expect(subnetting.units).toHaveLength(1);
  expect(unit.steps).toHaveLength(6);
  expect(events).toHaveLength(17);
  expect(unit.practice).toHaveLength(3);
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
  expect(getEntries('networking').find((e) => e.slug === 'subnetting')).toMatchObject({ number: 8, available: true });
  expect(unit).toMatchObject({
    name: 'Subnetting',
    fullName: 'Cutting one network into smaller ones',
    purpose: 'One network, cut into four',
    osi: { layers: [3], cite: [] },
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

/**
 * The mockup's log rows, from FIGS/subnet-lesson.mjs: worked out, value, prefix, in plain words, as it draws them:
 * an empty prefix is a dash (`e.prefix || '–'`).
 */
const MOCKUP_ROWS = [
  ['Address', '192.168.1.10', '–', 'The Sales laptop’s address, in bits'],
  ['Network portion', '192.168.1', '–', 'Which network: the same for the whole office'],
  ['Host portion', '10', '–', 'Which device: the laptop'],
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

test('show draws every moment of the lesson, forwards, backwards and jumping, as a fresh driver draws it', () => {
  // Each position (the Overview, 6 steps, Learn, Practice) and each of the 17 events once more.
  expect(showSweep(subnetting)).toBe(9 + 17);
});

test('the log is “Working”, with the mockup’s columns: words where it has words, and its widths', () => {
  const log = unit.scene.log;
  expect(log.title).toBe('Working');
  expect(log.columns.map((c) => [c.key, c.label, c.width ?? null, c.prose ?? false, c.strong ?? false])).toEqual([
    ['worked', 'Worked out', 176, true, true],
    ['value', 'Value', 190, false, true],
    ['prefix', 'Prefix', 76, false, false],
    ['plain', 'In plain words', null, true, false],
  ]);
  // The mockup's three glyphs, each explained in words.
  expect(log.legend).toEqual([
    { kind: 'request', label: 'Worked out' },
    { kind: 'response', label: 'Sent' },
    { kind: 'broadcast', label: 'Broadcast' },
  ]);
  // The empty log speaks for the whole lesson, from the Overview on, as the mockup's does.
  expect(log.idle).toBe('Nothing worked out yet. Press Play, or pick a step.');
  expect(unit.steps.filter((s) => s.idle !== undefined)).toEqual([]);
});

test('each row’s glyph says what the figure does with it: a ring is a broadcast, a route is sent, the rest are worked out', () => {
  const glyphs = Object.fromEntries(notes.map((e) => [e.id, e.glyph]));
  // As subnet-v1.html's events: its two broadcast addresses ring, and its three deliveries ride a route.
  expect(Object.entries(glyphs).filter(([, g]) => g === 'broadcast').map(([id]) => id)).toEqual(['broadcast-24', 'broadcast-26']);
  expect(Object.entries(glyphs).filter(([, g]) => g === 'response').map(([id]) => id)).toEqual(['same-subnet', 'different-subnet', 'usable-30']);
  expect(Object.values(glyphs).filter((g) => g === 'request')).toHaveLength(12);
  for (const e of notes) {
    const cues = (e.cues ?? []).map((c) => c.cue);
    expect(e.glyph, e.id).toBe(cues.includes('ring') ? 'broadcast' : cues.includes('route') ? 'response' : 'request');
  }
  // Before the mask shows, the Prefix column says so with a dash, as the mockup's does.
  expect(notes.filter((e) => e.log.prefix === '–').map((e) => e.id)).toEqual(['address', 'network-part', 'host-part']);
  expect(notes.filter((e) => e.log.prefix === '')).toEqual([]);
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

/**
 * The fields that hold a bare value, which the lesson works out with the engine
 * rather than states in a sentence: the scene's title, the facts, and Practice's
 * number options. Each is the mockup's value (FIGS/subnet-lesson.mjs), by place.
 */
const COMPUTED: Record<string, string> = {
  'scene.title': 'Office network · 192.168.1.0/24',
  'overview.facts.0.value': '192.168.1.0/24',
  'overview.facts.1.value': '255.255.255.0',
  'overview.facts.2.value': '2 to the power of the host bits, minus 2',
  'steps.portions.facts.0.value': '192.168.1.10',
  'steps.portions.facts.1.value': '192.168.1 (the first 24 bits)',
  'steps.portions.facts.2.value': '10 (the last 8 bits)',
  'steps.portions.facts.3.value': '32 bits, in four groups of 8',
  'steps.subnet-mask.facts.0.value': '255.255.255.0',
  'steps.subnet-mask.facts.1.value': '11111111.11111111.11111111.00000000',
  'steps.subnet-mask.facts.2.value': '/24 (24 ones)',
  'steps.subnet-mask.facts.3.value': '192.168.1.10/24',
  'steps.network-broadcast.facts.0.value': '192.168.1.0',
  'steps.network-broadcast.facts.1.value': '192.168.1.255',
  'steps.network-broadcast.facts.2.value': '254 (2⁸ − 2)',
  'steps.network-broadcast.facts.3.value': '192.168.1.1 to 192.168.1.254',
  'steps.borrowing-bits.facts.0.value': '255.255.255.192 (/26)',
  'steps.borrowing-bits.facts.1.label': 'Cut from one /24',
  'steps.borrowing-bits.facts.1.value': '4 subnets of 64 addresses',
  'steps.borrowing-bits.facts.2.value': '192.168.1.64 to 192.168.1.127',
  'steps.borrowing-bits.facts.3.value': '62 (192.168.1.65 to 192.168.1.126)',
  'steps.local-remote.facts.0.value': '192.168.1.10, in 192.168.1.0/26',
  'steps.local-remote.facts.1.value': '192.168.1.20: same subnet, sent directly',
  'steps.local-remote.facts.2.value': '192.168.1.70: in 192.168.1.64/26, sent via the router',
  'steps.local-remote.facts.3.value': '192.168.1.1',
  'steps.point-to-point.facts.0.value': '255.255.255.252 (/30)',
  'steps.point-to-point.facts.1.value': '203.0.113.4 to 203.0.113.7',
  'steps.point-to-point.facts.2.value': '2 (203.0.113.5 and 203.0.113.6)',
  'learn.facts.0.label': '/25',
  'learn.facts.0.value': '128 addresses, 126 usable',
  'learn.facts.1.label': '/26',
  'learn.facts.1.value': '64 addresses, 62 usable',
  'learn.facts.2.label': '/27',
  'learn.facts.2.value': '32 addresses, 30 usable',
  'learn.facts.3.label': '/28',
  'learn.facts.3.value': '16 addresses, 14 usable',
  'learn.facts.4.label': '/29',
  'learn.facts.4.value': '8 addresses, 6 usable',
  'learn.facts.5.label': '/30',
  'learn.facts.5.value': '4 addresses, 2 usable',
  'learn.facts.6.value': 'RFC 950 (subnets), RFC 4632 (CIDR), RFC 3021 (/31 links)',
  'practice.usable-26.options.0.text': '64',
  'practice.usable-26.options.1.text': '62',
  'practice.usable-26.options.2.text': '30',
};

/** Numbers in the words that are not the engine's to work out, by place: a street, standards, the lesson's own steps, named ranges. */
const NOT_COMPUTED: [string, string][] = [
  ['steps.portions.narrative', '12 Oak Street'],
  ['overview.facts.3.value', '192.168.x.x'],
  ['overview.facts.3.value', '203.0.113.x'],
  ['overview.facts.4.value', 'RFC 950'],
  ['overview.facts.4.value', 'RFC 4632'],
  ['steps.point-to-point.deep', 'RFC 3021'],
  ['learn.pattern.note', 'Steps 2 and 3'],
];

/**
 * Every number a learner reads in `lesson` that nothing accounts for, by place:
 * a computed field must be the mockup's value, and in any other place each
 * number must sit inside a stated phrase pinned to that place (or a pinned
 * number that is not the engine's).
 */
function uncovered(lesson: Lesson): string[] {
  return learnerProse(lesson).flatMap(({ place, text }) => {
    if (Object.hasOwn(COMPUTED, place)) return text === COMPUTED[place] ? [] : [`${place}: “${text}”, not “${COMPUTED[place]}”`];
    const phrases = [
      ...STATED.filter((s) => (typeof s.at === 'string' ? [s.at] : s.at).includes(place)).map((s) => s.text),
      ...NOT_COMPUTED.filter(([at]) => at === place).map(([, phrase]) => phrase),
    ];
    const covered: [number, number][] = [];
    for (const phrase of phrases) {
      for (let at = text.indexOf(phrase); at !== -1; at = text.indexOf(phrase, at + 1)) covered.push([at, at + phrase.length]);
    }
    return [...text.matchAll(/\d+(?:\.\d+)*/g)]
      .filter((m) => !covered.some(([from, to]) => m.index >= from && m.index + m[0].length <= to))
      .map((m) => `${place}: ${m[0]} in “${text}”`);
  });
}

/** What the build-time check and the coverage check find wrong in `lesson`. */
function problemsIn(lesson: Lesson): string[] {
  const found = uncovered(lesson);
  try {
    checkStated(lesson, STATED);
  } catch (error) {
    found.push((error as Error).message);
  }
  return found;
}

/** The object and key that hold a `learnerProse` place in the lesson's unit: steps, events and questions by id, the rest by key or index. */
function holderOf(lesson: Lesson, place: string): { parent: Record<string, unknown>; key: string } {
  const path = place.split('.');
  const key = path.pop()!;
  let node: unknown = lesson.units[0];
  for (let i = 0; i < path.length; i += 1) {
    const name = path[i]!;
    node = (node as Record<string, unknown>)[name];
    if (name === 'steps' || name === 'events' || name === 'practice') {
      i += 1;
      node = (node as { id: string }[]).find((x) => x.id === path[i]);
    }
    if (node === undefined) throw new Error(`No ${place} in the lesson.`);
  }
  return { parent: node as Record<string, unknown>, key };
}

/** A copy of the lesson with `from` changed to `to` at `place`. */
function changed(place: string, from: string, to: string): Lesson {
  const copy = structuredClone(subnetting);
  let { parent, key } = holderOf(copy, place);
  // Learn's statements and a Go deeper's paragraphs are lists: the change goes in the item that holds `from`.
  const list = parent[key];
  if (Array.isArray(list)) [parent, key] = [list.find((item: { text: string }) => item.text.includes(from)) ?? {}, 'text'];
  const text = parent[key] as string;
  expect(text, place).toContain(from);
  parent[key] = text.replace(from, to);
  return copy;
}

test('every number in narratives and facts is one the engine computes', () => {
  expect(() => checkStated(subnetting, STATED)).not.toThrow();
  // Every place the check names, and every computed field, is a place the learner reads.
  const places = learnerProse(subnetting).map((p) => p.place);
  expect(STATED.flatMap((s) => (typeof s.at === 'string' ? [s.at] : s.at)).filter((at) => !places.includes(at))).toEqual([]);
  expect(Object.keys(COMPUTED).filter((at) => !places.includes(at))).toEqual([]);
  // Every number the learner reads is accounted for in its own place.
  expect(uncovered(subnetting)).toEqual([]);

  // One number changed in a narrative, a log row's plain words or a question's feedback: the build-time check throws.
  expect(() => checkStated(changed('steps.network-broadcast.narrative', '192.168.1.255', '192.168.1.254'), STATED)).toThrow(
    /steps\.network-broadcast\.narrative should say “Set every host bit to 1 and you get 192\.168\.1\.255”/,
  );
  expect(() => checkStated(changed('steps.borrowing-bits.events.subnets-26.plain', '.128', '.127'), STATED)).toThrow(/\.128/);
  expect(() => checkStated(changed('practice.usable-26.options.1.feedback', '62 are left', '60 are left'), STATED)).toThrow(/62/);
});

/**
 * Wrong numbers that once passed both checks (the review's mutations, the
 * first seven), and others like them: each swaps one valid number for another.
 */
const MUTATIONS: [place: string, from: string, to: string][] = [
  ['steps.network-broadcast.facts.0.value', '192.168.1.0', '192.168.1.255'],
  ['steps.network-broadcast.facts.1.value', '192.168.1.255', '192.168.1.0'],
  ['steps.local-remote.facts.3.value', '192.168.1.1', '192.168.1.0'],
  ['overview.facts.0.value', '192.168.1.0/24', '192.168.1.0/25'],
  ['scene.title', '192.168.1.0/24', '192.168.1.0/26'],
  ['practice.usable-26.options.0.text', '64', '62'],
  ['practice.usable-26.options.2.text', '30', '64'],
  ['steps.local-remote.facts.3.value', '192.168.1.1', '192.168.1.2'],
  ['overview.facts.1.value', '255.255.255.0', '255.255.255.128'],
  ['steps.portions.facts.0.value', '192.168.1.10', '192.168.1.11'],
  ['learn.facts.0.label', '/25', '/26'],
  ['steps.borrowing-bits.facts.3.value', '192.168.1.126', '192.168.1.125'],
  ['steps.borrowing-bits.deep', '62 of them usable', '64 of them usable'],
  ['practice.why-30.options.2.text', 'exactly 2 usable', 'exactly 4 usable'],
];

test.each(MUTATIONS)('a copy with %s changed from %s to %s is caught, at that place', (place, from, to) => {
  const problems = problemsIn(changed(place, from, to));
  expect(problems.join('\n')).toContain(place);
});
