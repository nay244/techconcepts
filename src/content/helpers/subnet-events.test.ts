import { expect, test } from 'vitest';
import { makeLesson } from '../test-fixtures';
import type { Board, Lesson } from '../schema';
import { calc, checkStated, subnetValue, type Shown } from './subnet-events';

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
    cues,
  });
  // Before the mask shows, the prefix column is empty, and a note without cues has none.
  expect(calc({ id: 'a', row: 'Address', shown: 'address', plain: 'The address', board: laptop(null) })).toEqual({
    type: 'note',
    id: 'a',
    log: { worked: 'Address', value: '192.168.1.10', prefix: '' },
    plain: 'The address',
    board: laptop(null),
  });
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

test('checkStated passes when every stated number is in the text and is the engine’s', () => {
  const lesson = makeLesson();
  lesson.units[0]!.steps[0]!.narrative = 'At /26 the subnet has 62 usable addresses, from 192.168.1.65 to 192.168.1.126.';
  const stated = [
    { text: 'has 62 usable', value: () => `has ${subnetValue('usable-count', laptop(26))} usable` },
    { text: 'from 192.168.1.65', value: () => 'from 192.168.1.65' },
  ];
  expect(() => checkStated(lesson as Lesson, stated)).not.toThrow();
});

test('checkStated throws when a stated number differs from the engine’s, or is missing from the text', () => {
  const lesson = makeLesson() as Lesson;
  lesson.units[0]!.steps[0]!.narrative = 'At /26 the subnet has 64 usable addresses, from 192.168.1.65 to 192.168.1.126.';
  const wrong = { text: 'has 64 usable', value: () => `has ${subnetValue('usable-count', laptop(26))} usable` };
  expect(() => checkStated(lesson, [wrong])).toThrow(/has 64 usable.*has 62 usable/);
  const missing = { text: '192.168.1.127', value: () => subnetValue('broadcast', { ...laptop(26), addr: '192.168.1.70' }) };
  expect(() => checkStated(lesson, [missing])).toThrow(/192\.168\.1\.127/);
});

test('checkStated finds a number only as a whole number, not inside a longer one', () => {
  const lesson = makeLesson() as Lesson;
  lesson.units[0]!.steps[0]!.narrative = 'The laptop is 192.168.1.10/24 and the printer is 192.168.1.200.';
  const stated = (text: string) => [{ text, value: () => text }];
  expect(() => checkStated(lesson, stated('192.168.1.10'))).not.toThrow();
  expect(() => checkStated(lesson, stated('/24'))).not.toThrow();
  // (The fixture's router is 192.168.1.1, so .2 is the address that sits only inside a longer one.)
  expect(() => checkStated(lesson, stated('192.168.1.2'))).toThrow(/192\.168\.1\.2\b/);
  expect(() => checkStated(lesson, stated('192.168.1.20'))).toThrow(/192\.168\.1\.20\b/);
  expect(() => checkStated(lesson, stated('168.1.10'))).toThrow(/168\.1\.10/);
});
