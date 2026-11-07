import { expect, test } from 'vitest';
import { makeLesson } from '../test-fixtures';
import type { Board, Lesson } from '../schema';
import { calc, checkStated, learnerProse, subnetValue, type Shown } from './subnet-events';

const laptop = (prefix: number | null, more: Partial<Board> = {}): Board => ({ addr: '192.168.1.10', who: 'Laptop', prefix, ...more });
const link: Board = { addr: '203.0.113.6', who: 'Office router', prefix: 30, mask: true };

test.each<[Shown, Board, string]>([
  ['address', laptop(null), '192.168.1.10'],
  ['network-part', laptop(24), '192.168.1'],
  ['host-part', laptop(24), '10'],
  ['mask', laptop(24), '255.255.255.0'],
  ['mask', laptop(26), '255.255.255.192'],
  ['mask', link, '255.255.255.252'],
  ['prefix', laptop(24), '/24'],
  ['network', laptop(24), '192.168.1.0'],
  ['network', { ...laptop(26), addr: '192.168.1.70' }, '192.168.1.64'],
  ['network', link, '203.0.113.4'],
  ['broadcast', laptop(24), '192.168.1.255'],
  ['broadcast', { ...laptop(26), addr: '192.168.1.70' }, '192.168.1.127'],
  ['usable-count', laptop(24), '254'],
  ['usable-count', laptop(26), '62'],
  ['subnets', laptop(26, { borrow: 24 }), '4 × 64 addresses'],
  ['compared', laptop(26, { third: { who: 'Printer', addr: '192.168.1.20', mode: 'cmp' } }), '192.168.1.20'],
  ['usable-pair', { ...link, third: { who: 'Provider', addr: '203.0.113.5', mode: 'cmp' } }, '203.0.113.5 and .6'],
])('subnetValue(%s) of %j is %s', (shown, board, value) => {
  expect(subnetValue(shown, board)).toBe(value);
});

test('subnetValue refuses what the board cannot answer', () => {
  // No prefix yet: nothing to split the address at.
  expect(() => subnetValue('network', laptop(null))).toThrow(/prefix/);
  // The portions are whole numbers of the dotted address only on a byte boundary.
  expect(() => subnetValue('network-part', laptop(26))).toThrow(/26/);
  // Subnets are counted from where the borrowing starts.
  expect(() => subnetValue('subnets', laptop(26))).toThrow(/borrow/);
  // There is nothing to compare with.
  expect(() => subnetValue('compared', laptop(26))).toThrow(/third/);
  // A pair needs exactly two usable addresses.
  expect(() => subnetValue('usable-pair', laptop(24))).toThrow(/254/);
  expect(() => subnetValue('address', { ...laptop(24), addr: '192.168.1.300' })).toThrow(/192\.168\.1\.300/);
});

test('calc makes a note whose log row is worked out by the engine', () => {
  const board = laptop(26, { borrow: 24, mask: true, pick: 'borrow' });
  const cues = [{ cue: 'cut' }];
  expect(calc({ id: 'mask-26', row: 'Subnet mask', shown: 'mask', plain: '2 host bits borrowed for the network', board, cues })).toEqual({
    type: 'note',
    id: 'mask-26',
    log: { worked: 'Subnet mask', value: '255.255.255.192', prefix: '/26' },
    plain: '2 host bits borrowed for the network',
    board,
    glyph: 'request',
    cues,
  });
  // Before the mask shows, the prefix column is a dash, and a note without cues has none.
  expect(calc({ id: 'a', row: 'Address', shown: 'address', plain: 'The address', board: laptop(null) })).toEqual({
    type: 'note',
    id: 'a',
    log: { worked: 'Address', value: '192.168.1.10', prefix: '–' },
    plain: 'The address',
    board: laptop(null),
    glyph: 'request',
  });
});

test('calc draws a ring as a broadcast and a route as sent, and anything else as worked out', () => {
  const note = (cues: { cue: string; arg?: string }[]) =>
    calc({ id: 'x', row: 'Address', shown: 'address', plain: 'x', board: laptop(24, { mask: true }), cues }).glyph;
  expect(note([{ cue: 'ring', arg: 'all' }, { cue: 'glow', arg: 'laptop' }])).toBe('broadcast');
  expect(note([{ cue: 'route', arg: 'local' }, { cue: 'busy', arg: 'printer' }])).toBe('response');
  expect(note([{ cue: 'pulse', arg: 'onenet' }])).toBe('request');
  expect(note([])).toBe('request');
});

test('calc throws when a network or broadcast row on the board is not the engine’s', () => {
  const net = (addr: string): Board => laptop(24, { mask: true, third: { who: 'Network', addr, mode: 'net' } });
  const bcast = (addr: string): Board => laptop(24, { mask: true, third: { who: 'Broadcast', addr, mode: 'bcast' } });
  const note = (board: Board) => () => calc({ id: 'x', row: 'Network address', shown: 'network', plain: 'x', board });
  expect(note(net('192.168.1.0'))).not.toThrow();
  expect(note(bcast('192.168.1.255'))).not.toThrow();
  expect(note(net('192.168.1.1'))).toThrow(/192\.168\.1\.1.*192\.168\.1\.0/);
  expect(note(bcast('192.168.1.254'))).toThrow(/192\.168\.1\.254.*192\.168\.1\.255/);
  // A compared address is the learner's to pick, so any valid one will do.
  expect(note(laptop(24, { third: { who: 'Printer', addr: '192.168.1.20', mode: 'cmp' } }))).not.toThrow();
  expect(note(laptop(24, { third: { who: 'Printer', addr: '192.168.1', mode: 'cmp' } }))).toThrow(/192\.168\.1\b/);
});

test('calc throws when the board shows the mask before it has a prefix', () => {
  // The schema lets a board say `mask` with a null prefix, so `calc` is where it stops: the log would read "/null".
  const note = (board: Board) => () => calc({ id: 'mask-x', row: 'Subnet mask', shown: 'address', plain: 'x', board });
  expect(note(laptop(null, { mask: true }))).toThrow(/mask-x.*Laptop.*prefix/);
  expect(note(laptop(null))).not.toThrow();
  expect(note(laptop(24, { mask: true }))).not.toThrow();
});

/** The fixture lesson, its first step's narrative set to `narrative`. */
function lessonSaying(narrative: string): Lesson {
  const lesson = makeLesson() as Lesson;
  lesson.units[0]!.steps[0]!.narrative = narrative;
  return lesson;
}
const NARRATIVE = 'steps.hello.narrative';

test('learnerProse names every place a learner reads words, and leaves out log cells, boards, ids and urls', () => {
  const lesson = makeLesson() as Lesson;
  const places = learnerProse(lesson).map((p) => p.place);
  expect(places).toEqual(
    expect.arrayContaining([
      'title',
      'summary',
      'scene.title',
      'overview.hook',
      'overview.facts.0.value',
      NARRATIVE,
      'steps.hello.deep',
      'steps.hello.facts.0.label',
      'steps.reuse.events.t-match.summary',
      'steps.reuse.events.n1.plain',
      'learn.terms.1.name',
      'learn.pattern.note',
      'learn.facts.1.value',
      'practice.q1.prompt',
      'practice.q1.options.1.text',
      'practice.q1.options.1.feedback',
    ]),
  );
  const texts = learnerProse(lesson).map((p) => p.text);
  // The note's log cell, the event ids, the reference urls: none of it is prose.
  expect(texts).not.toContain('192.168.1.1');
  expect(texts).not.toContain('n1');
  expect(texts.some((t) => t.startsWith('https://'))).toBe(false);
});

test('checkStated passes when each stated phrase is the engine’s and stands in the place it names', () => {
  const lesson = lessonSaying('At /26 the subnet has 62 usable addresses, from 192.168.1.65 to 192.168.1.126.');
  const stated = [
    { at: NARRATIVE, text: 'has 62 usable', value: () => `has ${subnetValue('usable-count', laptop(26))} usable` },
    { at: NARRATIVE, text: 'from 192.168.1.65', value: () => 'from 192.168.1.65' },
  ];
  expect(() => checkStated(lesson, stated)).not.toThrow();
});

test('checkStated throws when a stated number differs from the engine’s, or its phrase is not in its place', () => {
  const lesson = lessonSaying('At /26 the subnet has 64 usable addresses, from 192.168.1.65 to 192.168.1.126.');
  const wrong = { at: NARRATIVE, text: 'has 64 usable', value: () => `has ${subnetValue('usable-count', laptop(26))} usable` };
  expect(() => checkStated(lesson, [wrong])).toThrow(/has 64 usable.*has 62 usable/);
  // The message names the place, the number and the words it expected there.
  const missing = {
    at: NARRATIVE,
    text: 'to 192.168.1.127',
    value: () => `to ${subnetValue('broadcast', { ...laptop(26), addr: '192.168.1.70' })}`,
  };
  expect(() => checkStated(lesson, [missing])).toThrow(/steps\.hello\.narrative.*“to 192\.168\.1\.127”.*192\.168\.1\.127/);
  // A place the lesson does not have.
  expect(() => checkStated(lesson, [{ ...wrong, at: 'steps.nowhere.narrative', text: 'has 62 usable' }])).toThrow(
    /steps\.nowhere\.narrative/,
  );
});

test('checkStated finds a phrase only in the place it names, and only in what the learner reads', () => {
  const lesson = lessonSaying('The laptop is 192.168.1.10.');
  const phrase = { text: 'The laptop is 192.168.1.10.', value: () => 'The laptop is 192.168.1.10.' };
  expect(() => checkStated(lesson, [{ ...phrase, at: NARRATIVE }])).not.toThrow();
  // Written somewhere else: the deep text is not the narrative.
  expect(() => checkStated(lesson, [{ ...phrase, at: 'steps.hello.deep' }])).toThrow(/steps\.hello\.deep/);
  // Written in a second place it does not name: each place it stands for is named.
  lesson.units[0]!.steps[0]!.deep = 'The laptop is 192.168.1.10. It says hello.';
  expect(() => checkStated(lesson, [{ ...phrase, at: NARRATIVE }])).toThrow(/also in steps\.hello\.deep/);
  expect(() => checkStated(lesson, [{ ...phrase, at: [NARRATIVE, 'steps.hello.deep'] }])).not.toThrow();
  // A log cell is not prose: the fixture's note logs 192.168.1.1, and no learner text states it.
  const logged = { at: 'steps.reuse.events.n1.plain', text: '192.168.1.1', value: () => '192.168.1.1' };
  expect(() => checkStated(lesson, [logged])).toThrow(/steps\.reuse\.events\.n1\.plain/);
});

test('checkStated finds a number only as a whole number, not inside a longer one', () => {
  // Addresses the fixture uses nowhere else, so only the narrative can hold them.
  const lesson = lessonSaying('The laptop is 10.0.0.10/24 and the printer is 10.0.0.200.');
  const stated = (text: string) => [{ at: NARRATIVE, text, value: () => text }];
  expect(() => checkStated(lesson, stated('10.0.0.10'))).not.toThrow();
  expect(() => checkStated(lesson, stated('/24'))).not.toThrow();
  expect(() => checkStated(lesson, stated('10.0.0.2'))).toThrow(/10\.0\.0\.2\b/);
  expect(() => checkStated(lesson, stated('10.0.0.20'))).toThrow(/10\.0\.0\.20\b/);
  expect(() => checkStated(lesson, stated('0.0.10'))).toThrow(/0\.0\.10/);
});
