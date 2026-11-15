import { expect, test } from 'vitest';
import { batch3Fixtures } from './batch3-fixtures';
import { deriveState, positionOf } from '../engine/timeline';
import { checkStructure } from './define';
import { claimSheet, DISPLAY_ONLY, itemHashes } from './factcheck/sheet';
import type { Cue, Lesson, MessageEvent, NoteEvent, SceneEvent } from './schema';
import { lessonSchema } from './schema';
import { SOURCES } from './sources';

// D13 / B15a's validator rules (prototypes/d13-packets-cases.md, attack cases 20a to 20u; E2, E3, E4, E11, E12), with the real figure parts.

const unit = (l: Lesson) => l.units[0]!;
const events = (l: Lesson): SceneEvent[] => unit(l).steps.flatMap((s) => s.events);
const packets = (mutate: (l: Lesson) => void = () => {}): string[] => {
  const lesson = batch3Fixtures.packets();
  mutate(lesson);
  return checkStructure(lesson);
};
const msg = (o: Partial<MessageEvent> & { id: string }): MessageEvent => ({
  type: 'message',
  from: 'web',
  to: 'laptop',
  tag: 'A',
  kind: 'response',
  log: { time: '—', source: 'x', destination: 'y', protocol: 'TCP', info: 'i', size: '—' },
  plain: 'A message.',
  ...o,
});
const note = (id: string, ...cues: Cue[]): NoteEvent => ({ type: 'note', id, log: { time: '—', source: 'x', destination: '—', protocol: 'TCP', info: 'i', size: '—' }, plain: 'A note.', cues });
const park = (arg: string): Cue => ({ cue: 'park', arg });
const unparkLaptop: Cue = { cue: 'unpark', arg: 'laptop' };
/** The fixture with its events replaced by `list` in one step (no table events, so the panel stays valid). */
const only =
  (...list: SceneEvent[]) =>
  (l: Lesson): void => {
    unit(l).steps = [{ ...unit(l).steps[0]!, events: list }];
  };
const refused = (mutate: (l: Lesson) => void, pattern: RegExp) => {
  const out = packets(mutate);
  expect(out.length, pattern.source).toBeGreaterThan(0);
  expect(out.join('\n')).toMatch(pattern);
};

test('the Packets fixture passes the structural check with the real figure parts, and the lesson schema', () => {
  expect(packets()).toEqual([]);
  expect(() => lessonSchema.parse(batch3Fixtures.packets())).not.toThrow();
});

test('20a to 20d: the place, the bay and the tag of a park cue', () => {
  const ok = (arg: string) => packets(only(note('n', park(arg))));
  expect(ok('laptop 1 X')).toEqual([]);
  refused(only(note('n', park('moon 1 X'))), /"moon", which has no bays/);
  refused(only(note('n', park('laptop 5 X'))), /bay 5, but laptop has 4 bays/);
  refused(only(note('n', park('web 0 X'))), /needs "<place> <bay> <TAG>"/);
  expect(ok('laptop 4 X')).toEqual([]);
  expect(ok('web 4 X')).toEqual([]);
  refused(only(note('n', park('b 2 X'))), /bay 2, but b has one bay/);
  expect(ok('b 1 X')).toEqual([]);
  refused(only(note('n', park('laptop 10 X'))), /needs "<place> <bay> <TAG>"/);
  refused(only(note('n', park('laptop 1'))), /needs "<place> <bay> <TAG>"/);
  refused(only(note('n', park('laptop 1  X'))), /a space at its start or end/);
  refused(only(note('n', park('laptop 1 X '))), /a space at its start or end/);
  refused(only(note('n', park(`laptop 1 ${'x'.repeat(17)}`))), /a tag of 17 characters; the limit is 16/);
  expect(ok(`laptop 1 ${'x'.repeat(16)}`)).toEqual([]);
  // Counted by code points, as the map's tag is: sixteen letters with an accent are sixteen.
  expect(ok(`laptop 1 ${'é'.repeat(16)}`)).toEqual([]);
  expect(ok(`laptop 1 ${'😀'.repeat(16)}`)).toEqual([]);
  refused(only(note('n', park(`laptop 1 ${'😀'.repeat(17)}`))), /17 characters/);
});

test('20e, 20f: two tags never share a bay; one tag is never parked twice; a send frees the bay', () => {
  refused(only(note('a', park('web 1 A')), note('b', park('web 1 B'))), /bay 1 at web already holds "A"/);
  expect(packets(only(note('a', park('web 1 A')), msg({ id: 'm', tag: 'A', cues: [park('laptop 1 A')] }), note('b', park('web 1 B'))))).toEqual([]);
  refused(only(note('a', park('web 1 A')), note('b', park('web 2 A'))), /"A" is already parked at web/);
  // The story's own piece 1: the web server, then the laptop by riding.
  expect(packets()).toEqual([]);
});

test('20g to 20j: a parked tag only moves by riding, and a message parks only its own tag where it lands', () => {
  refused(only(note('a', park('b 1 A')), msg({ id: 'm', from: 'b', tag: 'A', cues: [park('web 1 A')] })), /not at "web"/);
  expect(packets(only(note('a', park('b 1 A')), msg({ id: 'm', from: 'b', tag: 'A', cues: [park('laptop 1 A')] })))).toEqual([]);
  refused(only(note('a', park('web 1 A')), msg({ id: 'm', tag: 'A' })), /must park it again/);
  expect(packets(only(note('a', park('web 1 A')), msg({ id: 'm', tag: 'A', cues: [park('laptop 1 A')] })))).toEqual([]);
  refused(only(note('a', park('b 1 A')), msg({ id: 'm', tag: 'A', cues: [park('laptop 2 A')] })), /"A" is parked at b; a parked tag only moves by riding from there/);
  refused(only(msg({ id: 'm', tag: 'B', cues: [park('laptop 1 A')] })), /parks only its own tag \("B"\), not "A"/);
  // A note may park only a tag that is not parked already.
  refused(only(msg({ id: 'm', tag: 'A', cues: [park('laptop 1 A')] }), note('n', park('web 1 A'))), /"A" is already parked at laptop/);
});

test('20k to 20n: via', () => {
  const via = (id: string, o: Partial<MessageEvent>) => only(msg({ id, ...o }));
  expect(packets(via('m', { via: 'd' }))).toEqual([]);
  expect(packets(via('m', { via: 'isp' }))).toEqual([]);
  for (const bad of ['laptop', 'router', 'web']) refused(via('m', { via: bad }), /is not an internet router/);
  refused(via('m', { from: 'c', via: 'c' }), /where the message is sent from/);
  refused(via('m', { from: 'web', to: 'b', via: 'b' }), /where the message is sent to/);
  refused(via('m', { via: 'd', outcome: 'dropped', dropAt: 0.5 }), /a dropped message cannot go "via"/);
  // The no-op is accepted (E12); a joined route that passes a router twice is not.
  expect(packets(via('m', { via: 'c' }))).toEqual([]);
  expect(packets(via('m', { via: 'b' }))).toEqual([]);
  refused(via('m', { from: 'laptop', to: 'resolver', via: 'd' }), /passes router isp twice/);
});

test('20k: via is net-map only', () => {
  const lesson = batch3Fixtures.packets();
  lesson.figure = 'dhcp';
  unit(lesson).scene.layers = [];
  unit(lesson).scene.labels = {};
  unit(lesson).scene.start = [];
  unit(lesson).steps = [{ ...unit(lesson).steps[0]!, events: [msg({ id: 'm', from: 'laptop', to: 'router', via: 'd', cues: [] })] }];
  expect(checkStructure(lesson).join('\n')).toMatch(/"via" is for the network map/);
});

test('20o: a note carries park or unpark, never both, and not with a drop', () => {
  refused(only(note('a', park('web 1 A')), note('n', park('web 2 B'), unparkLaptop)), /both "park" and "unpark"/);
  expect(packets(only(note('a', park('laptop 1 A')), note('n', unparkLaptop)))).toEqual([]);
  refused(only(note('n', park('web 1 A'), { cue: 'drop', arg: 'b' })), /"drop" with "park" or "unpark"/);
});

test('20p, 20q: the laptop’s column and the web server’s deck need what they stand beside', () => {
  const phone = (l: Lesson) => (unit(l).scene.start = [...unit(l).scene.start, { cue: 'show', arg: 'phone' }]);
  const one = note('n', park('laptop 1 A'));
  refused((l) => (only(one)(l), phone(l)), /lies where the phone does/);
  expect(packets((l) => (only(note('n', park('b 1 A')))(l), phone(l)))).toEqual([]);
  refused((l) => (only(one)(l), (unit(l).scene.labels.router = 'Home router')), /home router's callout/);
  refused((l) => (only(note('n', park('web 1 A')))(l), (unit(l).scene.layers = ['smtp:mail'])), /needs a layer that draws the web server/);
  expect(packets((l) => (only(note('n', park('web 1 A')))(l), (unit(l).scene.layers = ['https:web'])))).toEqual([]);
});

test('20r: park and unpark are for events, a note for unpark, a delivered message for park', () => {
  refused((l) => (unit(l).scene.start = [...unit(l).scene.start, park('web 1 A')]), /the start cannot park a tag/);
  refused(only(note('a', park('laptop 1 A')), msg({ id: 'm', tag: 'B', cues: [unparkLaptop] })), /"unpark" is for a note/);
  refused(only(msg({ id: 'm', tag: 'A', outcome: 'dropped', dropAt: 0.5, cues: [park('laptop 1 A')] })), /is for a message that is delivered/);
  refused(only(note('n', unparkLaptop)), /nothing to take/);
  refused(only(msg({ id: 'm', tag: 'A', cues: [park('laptop 1 A'), { cue: 'page', arg: 'text' }] })), /takes no "page" cue/);
});

test('20s: unpark takes the laptop and no other place', () => {
  refused(only(note('a', park('web 1 A')), note('n', { cue: 'unpark', arg: 'web' })), /takes "laptop", not "web"/);
});

test('20u: the bays follow step order across steps', () => {
  const lesson = batch3Fixtures.packets();
  // Step 4's piece 3 moved before step 1's cut note: no tag is parked yet, and the later rides break.
  const steps = unit(lesson).steps;
  [steps[0], steps[1]] = [steps[1]!, steps[0]!];
  expect(checkStructure(lesson).join('\n')).toMatch(/is already parked at|is parked at|must park it again|already holds|nothing to take/);
  const bad = batch3Fixtures.packets();
  const s4 = unit(bad).steps[3]!.events;
  (s4[0] as MessageEvent).cues = [(s4[0] as MessageEvent).cues!.find((q) => q.cue === 'status')!];
  expect(checkStructure(bad).join('\n')).toMatch(/with the parked tag "PIECE 3", and must park it again/);
});

test('every event of the Packets fixture is as the spec lists it (§3)', () => {
  const e = events(batch3Fixtures.packets());
  expect(e.map((x) => x.id)).toEqual(['s1-req', 's1-cut', 's2-p1', 's2-t1', 's3-p2', 's4-p3', 's4-t3', 's4-p4', 's4-t4', 's4-p2', 's4-t2', 's5-order', 's5-done']);
  const via = e.filter((x): x is MessageEvent => x.type === 'message' && x.via !== undefined);
  expect(via.map((x) => [x.tag, x.via])).toEqual([['PIECE 3', 'd'], ['PIECE 4', 'd']]);
});

// ---------------------------------------------------------------- the claim sheet (beyond the checks)

test('the way a piece went and the bay it parks in are part of what a reader sees: they are in the claim sheet and change its hash', () => {
  const sheetOf = (mutate: (l: Lesson) => void = () => {}) => {
    const lesson = batch3Fixtures.packets();
    mutate(lesson);
    return claimSheet(lesson, SOURCES);
  };
  const base = sheetOf();
  const text = JSON.stringify(base.items);
  expect(text).toContain('"via":"d"');
  expect(text).toContain('"cue":"park","arg":"laptop 3 PIECE 3"');
  expect(DISPLAY_ONLY).not.toContain('via');
  const piece3 = (l: Lesson): MessageEvent => events(l).find((e) => e.id === 's4-p3') as MessageEvent;
  expect(sheetOf((l) => (piece3(l).via = 'c')).hash).not.toBe(base.hash);
  expect(sheetOf((l) => (piece3(l).cues = piece3(l).cues!.map((q) => (q.cue === 'park' ? { ...q, arg: 'laptop 2 PIECE 3' } : q)))).hash).not.toBe(base.hash);
  expect(Object.keys(itemHashes(base)).length).toBeGreaterThan(0);
});

test('18a: the log has eight rows by the end, every one TCP, every time and size a dash, and PIECE 3 is one row', () => {
  const lesson = batch3Fixtures.packets();
  const log = deriveState(lesson, positionOf(lesson, 0, 'step', 5), 2).log;
  expect(log.map((r) => [r.type, r.tag, r.from, r.to])).toEqual([
    ['message', 'REQUEST', 'laptop', 'web'],
    ['note', null, null, null],
    ['message', 'PIECE 1', 'web', 'laptop'],
    ['message', 'PIECE 2', 'web', 'b'],
    ['message', 'PIECE 3', 'web', 'laptop'],
    ['message', 'PIECE 4', 'web', 'laptop'],
    ['message', 'PIECE 2', 'b', 'laptop'],
    ['note', null, null, null],
  ]);
  for (const r of log) {
    expect(r.cells.protocol).toBe('TCP');
    expect(r.cells.time).toBe('—');
    expect(r.cells.size).toBe('—');
  }
});
