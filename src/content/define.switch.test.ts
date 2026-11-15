import { expect, test } from 'vitest';
import { SWITCH_DEVICES, SWITCH_PLUGS } from '../art/scenes/switch-parts';
import { batch3Fixtures } from './batch3-fixtures';
import { checkStructure } from './define';
import { claimSheet } from './factcheck/sheet';
import type { Cue, Lesson, MessageEvent, NoteEvent, SceneEvent, TableEvent } from './schema';
import { lessonSchema } from './schema';
import { SOURCES } from './sources';

// D13b / B15b (prototypes/d13-switch.md §5 and §8; prototypes/d13-switch-cases.md, cases 6a to 6f, H2, H3, H4, H7, H9, H10
// and the claim sheet), with the real figure parts. Each mutation gives exactly the issues listed.

const events = (l: Lesson): SceneEvent[] => l.units[0]!.steps.flatMap((s) => s.events);
const event = (l: Lesson, id: string): MessageEvent => events(l).find((e) => e.id === id) as MessageEvent;
const issues = (mutate: (l: Lesson) => void = () => {}): string[] => {
  const lesson = batch3Fixtures.switch();
  mutate(lesson);
  return checkStructure(lesson);
};
const step = (n: number) => `step "step-${n}"`;
const W = (n: number, id: string) => `Unit "${batch3Fixtures.switch().units[0]!.id}", ${step(n)}: message "${id}"`;
const note = (id: string, ...cues: Cue[]): NoteEvent => ({ type: 'note', id, log: { time: '—', source: '—', destination: '—', protocol: '—', info: 'i', size: '—' }, plain: 'p', cues });

// ---- 6a: these pass

test('6a: the fixture passes; so do flood with plug, a TV-to-printer frame and a broadcast from the laptop', () => {
  expect(issues()).toEqual([]);
  expect(issues((l) => (event(l, 's5-frame').cues = [{ cue: 'flood' }, { cue: 'plug', arg: 'laptop 5' }]))).toEqual([]);
  expect(issues((l) => Object.assign(event(l, 's3-frame'), { from: 'tv', to: 'printer' }))).toEqual([]);
  expect(issues((l) => Object.assign(event(l, 's3-frame'), { from: 'laptop', to: 'all', kind: 'broadcast' }))).toEqual([]);
});

// ---- 6b: refused, one issue each

test('6b: a frame from all, to its own sender, or to a place not on the figure', () => {
  expect(issues((l) => Object.assign(event(l, 's3-frame'), { from: 'all' }))).toEqual([`${W(3, 's3-frame')} rides from "all" to "laptop", a way the switch figure does not have.`]);
  expect(issues((l) => Object.assign(event(l, 's3-frame'), { to: 'printer' }))).toEqual([`${W(3, 's3-frame')} rides from "printer" to "printer", a way the switch figure does not have.`]);
  expect(issues((l) => Object.assign(event(l, 's3-frame'), { to: 'phone' }))).toEqual([
    `${W(3, 's3-frame')} is sent to "phone", which the switch figure does not have.`,
    `${W(3, 's3-frame')} rides from "printer" to "phone", a way the switch figure does not have.`,
  ]);
});

test('6b: a broadcast is sent to all, and a frame to all is a broadcast', () => {
  expect(issues((l) => Object.assign(event(l, 's4-frame'), { to: 'tv' }))).toEqual([`${W(4, 's4-frame')} is a broadcast, so it is sent to "all".`]);
  const toAll = `${W(1, 's1-frame')} is sent to "all", so its kind is "broadcast".`;
  expect(issues((l) => Object.assign(event(l, 's1-frame'), { to: 'all', cues: [] }))).toEqual([toAll]);
  expect(issues((l) => Object.assign(event(l, 's4-frame'), { kind: 'control' }))).toEqual([`${W(4, 's4-frame')} is sent to "all", so its kind is "broadcast".`]);
  expect(issues((l) => Object.assign(event(l, 's1-frame'), { to: 'all' }))).toEqual([toAll]);
});

test('6b: a broadcast with flood, flood with an arg, and plug with no arg or the wrong one', () => {
  expect(issues((l) => (event(l, 's4-frame').cues = [{ cue: 'flood' }]))).toEqual([`${W(4, 's4-frame')} is a broadcast, which floods by itself; leave out "flood".`]);
  expect(issues((l) => (event(l, 's1-frame').cues = [{ cue: 'flood', arg: 'x' }]))).toEqual([`${W(1, 's1-frame')}: cue "flood" is a flag and takes no arg.`]);
  expect(issues((l) => (event(l, 's5-frame').cues = [{ cue: 'plug' }]))).toEqual([`${W(5, 's5-frame')}: cue "plug" needs an arg.`]);
  for (const arg of ['laptop 2', 'tv 5', 'laptop  5']) {
    expect(issues((l) => (event(l, 's5-frame').cues = [{ cue: 'plug', arg }])), arg).toEqual([`${W(5, 's5-frame')}: cue "plug" takes "laptop 5", not "${arg}".`]);
  }
});

test('6b: a scene start with any cue, and a layer named in scene.layers', () => {
  expect(issues((l) => (l.units[0]!.scene.start = [{ cue: 'flood' }]))).toHaveLength(1);
  expect(issues((l) => (l.units[0]!.scene.start = [{ cue: 'flood' }]))[0]).toContain('the scene has a start, but the switch figure takes none');
  expect(issues((l) => (l.units[0]!.scene.layers = ['x']))).toHaveLength(1);
});

// ---- 6c, H2: a note

test('6c: a note with flood or plug gives the cue’s issue and the note’s; a note after a frame is refused (H2)', () => {
  const where = `Unit "${batch3Fixtures.switch().units[0]!.id}", ${step(2)}: note "n"`;
  const noteIssue = `${where} is a note; the switch figure draws frames only, so say it in the step's words.`;
  const addNote = (n: NoteEvent) => (l: Lesson) => l.units[0]!.steps[1]!.events.push(n);
  expect(issues(addNote(note('n', { cue: 'flood' })))).toEqual([noteIssue, `${where}: cue "flood" is for a message; a note sends no frame.`]);
  expect(issues(addNote(note('n', { cue: 'plug', arg: 'laptop 5' })))).toEqual([noteIssue, `${where}: cue "plug" is for a message; a note sends no frame.`]);
  expect(issues(addNote(note('n', { cue: 'plug', arg: 'tv 5' })))).toEqual([
    `${where}: cue "plug" takes "laptop 5", not "tv 5".`,
    noteIssue,
    `${where}: cue "plug" is for a message; a note sends no frame.`,
  ]);
  // After step 3's frame the note would leave step 3 settled with no trace and no verdict.
  const after = (l: Lesson) => l.units[0]!.steps[2]!.events.splice(1, 0, note('n3'));
  expect(issues(after)).toEqual([`Unit "${batch3Fixtures.switch().units[0]!.id}", ${step(3)}: note "n3" is a note; the switch figure draws frames only, so say it in the step's words.`]);
});

// ---- 6d, H3: dropped

test('6d: a dropped frame is refused, once', () => {
  expect(issues((l) => Object.assign(event(l, 's3-frame'), { outcome: 'dropped', dropAt: 0.5 }))).toEqual([`${W(3, 's3-frame')} is dropped, but the switch figure draws no drop; say it in words.`]);
});

// ---- 6e, H7: a second plug

test('6e: a second `plug laptop 5` is refused; the first stays fine', () => {
  const second = (l: Lesson) => l.units[0]!.steps[4]!.events.splice(1, 0, { ...event(l, 's5-frame'), id: 's5-again' } as MessageEvent);
  expect(issues(second)).toEqual([`${W(5, 's5-again')}: cue "plug" moves the laptop to port 5, where it already is.`]);
});

// ---- 6f: untouched elsewhere

test('6f: every lesson of the site still validates, the seven that send a broadcast to one place among them', () => {
  const found = import.meta.glob<{ default: Lesson }>(['./lessons/*.ts', '!./lessons/*.test.ts'], { eager: true });
  const slugs = Object.keys(found).map((f) => f.replace('./lessons/', '').replace('.ts', ''));
  for (const slug of ['dhcp', 'what-is-dhcp', 'arp', 'ip-address', 'mac-address', 'subnetting', 'what-is-ip']) expect(slugs).toContain(slug);
  for (const [file, mod] of Object.entries(found)) expect(checkStructure(mod.default), file).toEqual([]);
});

// ---- the unit is a lesson the schema accepts

test('the fixture parses', () => {
  expect(() => lessonSchema.parse(batch3Fixtures.switch())).not.toThrow();
});

// ---- H4, H9: the table, the cables and the tags agree

const tableOf = (l: Lesson) => {
  const panel = l.units[0]!.scene.panel!;
  if (panel.type !== 'table') throw new Error('a table panel');
  return panel.table;
};

test('H4a: the panel is the MAC table the figure reads: id, key, columns, empty, by', () => {
  const t = tableOf(batch3Fixtures.switch());
  expect(t.id).toBe('mac-table');
  expect(t.keyColumn).toBe('mac');
  expect(t.columns.map((c) => [c.key, c.label])).toEqual([['port', 'Port'], ['mac', 'MAC address']]);
  expect(t.initialRows).toEqual([]);
  expect(t.by).toBe('kept by the switch');
  for (const e of events(batch3Fixtures.switch())) if (e.type === 'table') expect(e.table, e.id).toBe('mac-table');
});

test('H4b: every added or updated row is one of the four MACs, on the port its device is plugged into by then', () => {
  const l = batch3Fixtures.switch();
  const ports: Record<string, number> = { ...SWITCH_PLUGS };
  const byMac = Object.fromEntries(Object.entries(SWITCH_DEVICES).map(([d, m]) => [m, d]));
  for (const e of events(l)) {
    if (e.type === 'message') for (const c of e.cues ?? []) if (c.cue === 'plug') ports['laptop'] = Number(c.arg!.split(' ')[1]);
    if (e.type !== 'table' || (e.op !== 'add' && e.op !== 'update')) continue;
    const mac = e.op === 'add' ? e.row!['mac']! : e.key!;
    const port = e.row!['port']!;
    expect(Object.keys(byMac), e.id).toContain(mac);
    expect(port, e.id).toMatch(/^[1-5]$/);
    expect(Number(port), e.id).toBe(ports[byMac[mac]!]);
  }
});

test('H4c: a frame has `flood` exactly when its step’s look-up finds no row; without it the key is the receiver’s MAC', () => {
  const l = batch3Fixtures.switch();
  for (const s of l.units[0]!.steps) {
    const matches = s.events.filter((e): e is TableEvent => e.type === 'table' && e.op === 'match');
    for (const e of s.events) {
      if (e.type !== 'message' || e.kind === 'broadcast') continue;
      const flood = (e.cues ?? []).some((c) => c.cue === 'flood');
      expect(matches.some((m) => m.key === ''), `${e.id} flood`).toBe(flood);
      if (!flood) expect(matches.map((m) => m.key), e.id).toContain(SWITCH_DEVICES[e.to as keyof typeof SWITCH_DEVICES]);
    }
  }
});

test('H9: every message’s tag is TO ALL for a broadcast and FRAME otherwise', () => {
  for (const e of events(batch3Fixtures.switch())) if (e.type === 'message') expect(e.tag, e.id).toBe(e.kind === 'broadcast' ? 'TO ALL' : 'FRAME');
});

// ---- the claim sheet

test('the claim sheet carries the cues of a frame, and a changed cue changes its hash', () => {
  const sheetOf = (mutate: (l: Lesson) => void = () => {}) => {
    const l = batch3Fixtures.switch();
    mutate(l);
    return claimSheet(l, SOURCES);
  };
  const base = sheetOf();
  const cuesOf = (id: string) => (base.items.find((i) => i.key.includes(`(event "${id}")`))!.content as { cues?: Cue[] }).cues;
  expect(cuesOf('s1-frame')).toEqual([{ cue: 'flood' }]);
  expect(cuesOf('s5-frame')).toEqual([{ cue: 'plug', arg: 'laptop 5' }]);
  expect(sheetOf((l) => (event(l, 's1-frame').cues = [])).hash).not.toBe(base.hash);
  expect(sheetOf((l) => (event(l, 's3-frame').cues = [{ cue: 'flood' }])).hash).not.toBe(base.hash);
  expect(
    sheetOf((l) => {
      event(l, 's5-frame').cues = [];
      event(l, 's4-frame').cues = [{ cue: 'plug', arg: 'laptop 5' }];
    }).hash,
  ).not.toBe(base.hash);
});
