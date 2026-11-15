import { expect, test } from 'vitest';
import { POOL_HEALTH_WORDS } from '../art/scenes/pool-parts';
import { batch3Fixtures, POOL_ADDRESSES, POOL_BALANCER } from './batch3-fixtures';
import { checkStructure } from './define';
import { claimSheet } from './factcheck/sheet';
import type { Cue, Lesson, MessageEvent, NoteEvent, SceneEvent, TableEvent } from './schema';
import { lessonSchema } from './schema';
import { SOURCES } from './sources';
import { drawPool } from '../art/scenes/pool';

// D13c / B15c (prototypes/d13-load-balancers.md §5 and §8; prototypes/d13-load-balancers-cases.md, V1 to V4, H2, H13 and
// C1), with the real figure parts. Each mutation gives exactly the issues listed.

const events = (l: Lesson): SceneEvent[] => l.units[0]!.steps.flatMap((s) => s.events);
const event = (l: Lesson, id: string): SceneEvent => events(l).find((e) => e.id === id)!;
const message = (l: Lesson, id: string): MessageEvent => event(l, id) as MessageEvent;
const issues = (mutate: (l: Lesson) => void = () => {}): string[] => {
  const lesson = batch3Fixtures.pool();
  mutate(lesson);
  return checkStructure(lesson);
};
const W = (n: number, id: string, kind = 'message') => `Unit "${batch3Fixtures.pool().units[0]!.id}", step "step-${n}": ${kind} "${id}"`;
const note = (id: string, ...cues: Cue[]): NoteEvent => ({ type: 'note', id, log: { time: '—', source: '—', destination: '—', protocol: '—', info: 'i', size: '—' }, plain: 'p', cues });
const set = (l: Lesson, id: string, o: Partial<MessageEvent>) => Object.assign(message(l, id), o);
const onRoute = (from: string, to: string) => `rides from "${from}" to "${to}", a way the pool figure does not have.`;

// ---- V1, V3: these pass

test('V1: the fixture passes the real validator and the schema', () => {
  expect(issues()).toEqual([]);
  expect(lessonSchema.safeParse(batch3Fixtures.pool()).success).toBe(true);
});

test('V3: all nine reader-to-server routes, a check, an answer, a skip of another server and a no-answer on a note pass', () => {
  for (const r of ['laptop', 'reader2', 'reader3']) {
    for (const s of ['a', 'b', 'c']) expect(issues((l) => set(l, 's1-req', { from: r, to: s })), `${r}>${s}`).toEqual([]);
  }
  expect(issues((l) => set(l, 's3-chk-a', { to: 'c' }))).toEqual([]);
  expect(issues((l) => set(l, 's3-ok-a', { from: 'c' }))).toEqual([]);
  expect(issues((l) => set(l, 's2-req-c', { cues: [{ cue: 'skip', arg: 'a' }] }))).toEqual([]);
  expect(issues((l) => (l.units[0]!.steps[2]!.events[3] = note('s3-quiet-1', { cue: 'no-answer', arg: 'c' })))).toEqual([]);
});

// ---- V2: refused, one issue each

test('V2: a way the figure does not have: the balancer named in a request, a reply to a reader, a server to a server', () => {
  expect(issues((l) => set(l, 's1-req', { to: 'balancer' }))).toEqual([`${W(1, 's1-req')} ${onRoute('laptop', 'balancer')}`]);
  expect(issues((l) => set(l, 's3-chk-a', { from: 'a', to: 'b' }))).toEqual([`${W(3, 's3-chk-a')} ${onRoute('a', 'b')}`]);
  expect(issues((l) => set(l, 's3-ok-a', { to: 'laptop' }))).toEqual([`${W(3, 's3-ok-a')} ${onRoute('a', 'laptop')}`]);
  expect(issues((l) => set(l, 's3-chk-a', { to: 'laptop' }))).toEqual([`${W(3, 's3-chk-a')} ${onRoute('balancer', 'laptop')}`]);
  expect(issues((l) => set(l, 's2-req-b', { from: 'reader2', to: 'balancer' }))).toEqual([`${W(2, 's2-req-b')} ${onRoute('reader2', 'balancer')}`]);
});

test('V2: skip names no server d, skip and no-answer need an arg', () => {
  expect(issues((l) => set(l, 's4-req-c', { cues: [{ cue: 'skip', arg: 'd' }] }))).toEqual([`${W(4, 's4-req-c')}: cue "skip" takes "a", "b" or "c", not "d".`]);
  expect(issues((l) => set(l, 's4-req-c', { cues: [{ cue: 'skip' }] }))).toEqual([`${W(4, 's4-req-c')}: cue "skip" needs an arg.`]);
  expect(issues((l) => (event(l, 's3-quiet-1') as NoteEvent).cues = [{ cue: 'no-answer', arg: 'balancer' }])).toEqual([`${W(3, 's3-quiet-1', 'note')}: cue "no-answer" takes "a", "b" or "c", not "balancer".`]);
  expect(issues((l) => (event(l, 's3-quiet-1') as NoteEvent).cues = [{ cue: 'no-answer' }])).toEqual([`${W(3, 's3-quiet-1', 'note')}: cue "no-answer" needs an arg.`]);
});

// ---- V4 (E27): a cue where the driver ignores it, and a message that does not arrive

test('V4: skip on a note, a check, an answer, or on the server the request goes to', () => {
  expect(issues((l) => (event(l, 's3-quiet-1') as NoteEvent).cues = [{ cue: 'skip', arg: 'b' }])).toEqual([`${W(3, 's3-quiet-1', 'note')}: cue "skip" is for a reader's request; a note sends none.`]);
  expect(issues((l) => set(l, 's5-chk-1', { cues: [{ cue: 'skip', arg: 'a' }] }))).toEqual([`${W(5, 's5-chk-1')}: cue "skip" is for a reader's request; a message from "balancer" passes over no server.`]);
  expect(issues((l) => set(l, 's5-ok-1', { cues: [{ cue: 'skip', arg: 'a' }] }))).toEqual([`${W(5, 's5-ok-1')}: cue "skip" is for a reader's request; a message from "b" passes over no server.`]);
  expect(issues((l) => set(l, 's4-req-c', { cues: [{ cue: 'skip', arg: 'c' }] }))).toEqual([`${W(4, 's4-req-c')}: cue "skip" passes over "c", the server the request goes to.`]);
  expect(issues((l) => set(l, 's1-req', { cues: [{ cue: 'skip', arg: 'a' }] }))).toEqual([`${W(1, 's1-req')}: cue "skip" passes over "a", the server the request goes to.`]);
});

test('V4: no-answer on a message, and a message that is dropped or blocked', () => {
  expect(issues((l) => set(l, 's5-chk-1', { cues: [{ cue: 'no-answer', arg: 'b' }] }))).toEqual([`${W(5, 's5-chk-1')}: cue "no-answer" is for a note; a message sends something.`]);
  expect(issues((l) => set(l, 's1-req', { outcome: 'dropped', dropAt: 0.5 }))).toEqual([`${W(1, 's1-req')} is dropped, but the pool figure draws every message arriving; say it in words.`]);
  expect(issues((l) => set(l, 's1-req', { outcome: 'blocked' }))).toEqual([`${W(1, 's1-req')} is blocked, but the pool figure draws every message arriving; say it in words.`]);
  expect(issues((l) => set(l, 's1-req', { outcome: 'delivered' }))).toEqual([]);
});

test('V4: the new rules are the pool’s alone: another figure’s lesson keeps its own', () => {
  // A skip or no-answer cue is not a cue of the other figures, so the rules cannot be reached there; a delivered message passes on each.
  for (const make of [batch3Fixtures.switch, batch3Fixtures.packets]) expect(checkStructure(make())).toEqual([]);
});

// ---- H13 (E37): what the figure reads from the panel, held by the fixture (and the lesson's test after it)

const panel = () => {
  const p = batch3Fixtures.pool().units[0]!.scene.panel!;
  if (p.type !== 'table') throw new Error('a table panel');
  return p.table;
};

test('H13: the panel is the table "pool", keyed server, with the four columns and the rows A, B, C', () => {
  const t = panel();
  expect(t.id).toBe('pool');
  expect(t.keyColumn).toBe('server');
  expect(t.columns.map((c) => c.key)).toEqual(['server', 'address', 'health', 'requests']);
  expect(t.initialRows.map((r) => r.server)).toEqual(['A', 'B', 'C']);
  expect(t.markLabel).toBe('unhealthy');
});

test('H13: every Health cell, initial or updated, is one of the figure’s four words; every Requests cell a whole number 0 to 4', () => {
  const l = batch3Fixtures.pool();
  const rows = [...panel().initialRows, ...events(l).filter((e): e is TableEvent => e.type === 'table').map((e) => e.row!)];
  expect(rows).toHaveLength(3 + 11);
  for (const r of rows) {
    expect(Object.hasOwn(POOL_HEALTH_WORDS, r.health!), r.health).toBe(true);
    expect(r.requests).toMatch(/^[0-4]$/);
  }
  for (const e of events(l).filter((x): x is TableEvent => x.type === 'table')) expect(e.table).toBe('pool');
});

test('H13: every tag, lower-cased, is request, check or ok', () => {
  for (const e of events(batch3Fixtures.pool())) if (e.type === 'message') expect(['request', 'check', 'ok']).toContain(e.tag.toLowerCase());
});

// ---- H2 (E26): the figure's fixed words and the lesson's cells say the same thing

test('E26: the Address cells equal the callouts’; requests go to the balancer’s address; checks and answers use each server’s address and :80', () => {
  const { svg } = drawPool();
  const l = batch3Fixtures.pool();
  for (const [s, addr] of Object.entries(POOL_ADDRESSES)) {
    expect(svg).toContain(addr);
    expect(panel().initialRows.find((r) => r.server === s)!.address).toBe(addr);
  }
  expect(svg).toContain('203.0.113.80');
  expect(POOL_BALANCER).toBe('203.0.113.80:80');
  for (const e of events(l)) {
    if (e.type !== 'message') continue;
    const server = (e.from === 'balancer' ? e.to : e.from).toUpperCase() as keyof typeof POOL_ADDRESSES;
    if (e.tag === 'REQUEST') expect(e.log.destination).toBe('203.0.113.80:80');
    else if (e.tag === 'CHECK') expect(e.log).toMatchObject({ source: '—', destination: `${POOL_ADDRESSES[server]}:80` });
    else expect(e.log).toMatchObject({ source: `${POOL_ADDRESSES[server]}:80`, destination: '—' });
  }
});

// ---- C1: the claim sheet carries what the driver draws from

test('C1: the skip, its three no-answer notes and the marked "1 check passed" update are on the claim sheet; `fast` is not', () => {
  const sheet = JSON.stringify(claimSheet(batch3Fixtures.pool(), SOURCES));
  expect(sheet).toContain('"cue":"skip","arg":"b"');
  expect(sheet.split('"cue":"no-answer","arg":"b"').length - 1).toBe(3);
  expect(sheet).toContain('1 check passed');
  expect(sheet).not.toContain('fast');
});
