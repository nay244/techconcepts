import { expect, test, vi } from 'vitest';
import { backedPartsOf, citedPartsOf } from '../cited';
import { validateLesson } from '../define';
import type { Lesson } from '../schema';
import { cite, defineSources } from '../sources';
import { FIXTURE_SOURCES, makeCitedLesson } from '../test-fixtures';
import { sha256 } from './sha256';
import { claimSheet, itemHash, itemHashes, renderSheet, type SheetItem } from './sheet';

// The real FIGURE_PARTS is empty until each figure is built; the stand-in has the fixture's places and cues.
vi.mock('../../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../test-fixtures')).FIXTURE_PARTS }));

const lesson = (): Lesson => validateLesson(makeCitedLesson(), FIXTURE_SOURCES);
const sheetOf = (l: Lesson = lesson()) => claimSheet(l, FIXTURE_SOURCES);
const unit = (l: Lesson) => l.units[0]!;

test('every cited part is a claim item', () => {
  const l = lesson();
  const claims = sheetOf(l).items.filter((i) => i.kind === 'claim').map((i) => i.key);
  expect(claims).toEqual(citedPartsOf(l).filter((p) => p.analogy !== true).map((p) => p.at));
});

test('every backed part, prompt, title and name is an item', () => {
  const l = lesson();
  const keys = sheetOf(l).items.map((i) => i.key);
  const wanted = [
    ...backedPartsOf(l).map((p) => p.at),
    'title',
    'units[0].name',
    'units[0].osi',
    ...unit(l).practice.map((q, i) => `units[0].practice[${i}].prompt (question "${q.id}")`),
  ];
  for (const key of wanted) expect(keys).toContain(key);
});

test('keys are unique', () => {
  const keys = sheetOf().items.map((i) => i.key);
  expect(new Set(keys).size).toBe(keys.length);
});

test('an example part is an example item and a trace keeps its targets', () => {
  const items = sheetOf().items;
  expect(items.find((i) => i.key === 'units[0].scene.packets.p1 (packet "p1")')).toMatchObject({ kind: 'traced', traces: ['term-1', 'fact-3'] });
  expect(items.find((i) => i.key === 'units[0].overview.facts[0] (Overview fact "Example address")')).toMatchObject({
    kind: 'example',
    traces: [],
    content: { label: 'Example address', value: '192.0.2.10' },
  });
  expect(items.find((i) => i.key === 'units[0].overview.hookBacking (the Overview hook)')?.kind).toBe('analogy');
});

test('a Practice option says whether it is the answer', () => {
  const items = sheetOf().items;
  expect(items.find((i) => i.key === 'units[0].practice[0].options[0] (question "q1")')?.content).toMatchObject({ right: true });
  expect(items.find((i) => i.key === 'units[0].practice[0].options[1] (question "q1")')?.content).toMatchObject({ right: false });
});

/** The same value with every object's keys in reverse order, at every depth. */
function reversedKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(reversedKeys);
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(Object.entries(value).reverse().map(([k, v]) => [k, reversedKeys(v)]));
  }
  return value;
}

test('hash ignores key order', () => {
  const l = lesson();
  expect(claimSheet(reversedKeys(l) as Lesson, FIXTURE_SOURCES).hash).toBe(sheetOf(l).hash);
  expect(sheetOf(l).hash).toMatch(/^[0-9a-f]{64}$/);
});

/** A copy of the fixture with one change made to it. */
function changed(edit: (l: Lesson) => void): Lesson {
  const l = structuredClone(lesson());
  edit(l);
  return l;
}

const firstMessage = (l: Lesson) => {
  for (const step of unit(l).steps) for (const e of step.events) if (e.type === 'message') return e;
  throw new Error('the fixture has a message');
};

test('display-only changes keep the hash', () => {
  const before = sheetOf().hash;
  const edits: [string, (l: Lesson) => void][] = [
    ['a log column width', (l) => { unit(l).scene.log.columns[0]!.width = 120; }],
    ['a message drop point', (l) => { firstMessage(l).dropAt = 0.5; }],
    ['the scene views', (l) => { unit(l).scene.views = ['network']; }],
    ['the figure', (l) => { l.figure = 'net-map'; }],
  ];
  for (const [what, edit] of edits) expect(sheetOf(changed(edit)).hash, what).toBe(before);
});

test('content changes change the hash', () => {
  const before = sheetOf().hash;
  const edits: [string, (l: Lesson) => void][] = [
    ['a Learn statement', (l) => { unit(l).learn.lead[0]!.text = 'A lease is an address lent for a while.'; }],
    [
      'a table row',
      (l) => {
        const panel = unit(l).scene.panel;
        if (panel?.type !== 'table') throw new Error('the fixture has a table panel');
        panel.table.initialRows = [{ ip: '192.0.2.20', holder: 'Printer', state: 'Lent' }];
      },
    ],
    ['a message outcome', (l) => { firstMessage(l).outcome = 'dropped'; }],
    ['a citation', (l) => { unit(l).learn.lead[0]!.cite.push(cite('vendor-example', 'Leases', { sources: FIXTURE_SOURCES, url: 'https://learn.microsoft.com/example#leases' })); }],
  ];
  for (const [what, edit] of edits) expect(sheetOf(changed(edit)).hash, what).not.toBe(before);
  const retitled = defineSources(Object.values(FIXTURE_SOURCES).map((s) => (s.id === 'rfc-example' ? { ...s, title: 'Example Protocol, revised' } : s)));
  expect(claimSheet(lesson(), retitled).hash, 'a cited source').not.toBe(before);
});

const firstNote = (l: Lesson) => {
  for (const step of unit(l).steps) for (const e of step.events) if (e.type === 'note') return e;
  throw new Error('the fixture has a note');
};

test('words and marks the figure shows change the hash', () => {
  const before = sheetOf().hash;
  const edits: [string, (l: Lesson) => void][] = [
    ['a cue’s words', (l) => { firstNote(l).cues = [{ cue: 'status', arg: 'Free' }]; }],
    ['a cue added', (l) => { firstMessage(l).cues = [{ cue: 'glow' }, { cue: 'status', arg: 'Lent' }]; }],
    ['a start cue', (l) => { unit(l).scene.start = [{ cue: 'status', arg: 'Lent' }]; }],
    ['a figure layer', (l) => { unit(l).scene.layers = ['firewall']; }],
    ['a note’s icon', (l) => { firstNote(l).glyph = 'request'; }],
    ['a board’s highlighted bits', (l) => { firstNote(l).board = { addr: '192.0.2.10', who: 'Laptop', prefix: 24, pick: 'net' }; }],
  ];
  for (const [what, edit] of edits) expect(sheetOf(changed(edit)).hash, what).not.toBe(before);
});

test('keys the author chooses are kept, even when a setting shares their name', () => {
  const before = sheetOf().hash;
  const edits: [string, (l: Lesson) => void][] = [
    ['a log cell keyed id', (l) => { firstMessage(l).log = { ...firstMessage(l).log, id: 'R1' }; }],
    ['a log cell keyed width', (l) => { firstMessage(l).log = { ...firstMessage(l).log, width: 'Wide' }; }],
    ['a figure label keyed glyph', (l) => { unit(l).scene.labels = { glyph: 'Router' }; }],
    [
      'a table row cell keyed cite',
      (l) => {
        const panel = unit(l).scene.panel;
        if (panel?.type !== 'table') throw new Error('the fixture has a table panel');
        panel.table.initialRows = [{ ip: '192.0.2.20', cite: 'RFC' }];
      },
    ],
  ];
  for (const [what, edit] of edits) expect(sheetOf(changed(edit)).hash, what).not.toBe(before);
});

test('a new field left empty keeps the hash', () => {
  const before = sheetOf().hash;
  const loose = (o: object) => o as Record<string, unknown>;
  const edits: [string, (l: Lesson) => void][] = [
    ['an empty list on a step', (l) => { loose(unit(l).steps[0]!).extra = []; }],
    ['an empty record on an event', (l) => { loose(firstMessage(l)).extra = {}; }],
    ['no figure labels written out', (l) => { unit(l).scene.labels = {}; }],
  ];
  for (const [what, edit] of edits) expect(sheetOf(changed(edit)).hash, what).toBe(before);
});

test('the sheet renders every key and the hash', () => {
  const sheet = sheetOf();
  const text = renderSheet(sheet);
  expect(text).toContain(sheet.hash);
  for (const item of sheet.items) expect(text).toContain(item.key);
});

test('the rendered sheet prints each citation as a quote bullet to copy, and the hash is the one before the change', () => {
  const sheet = sheetOf();
  const text = renderSheet(sheet);
  const item = sheet.items.find((i) => i.cite.length > 0)!;
  const c = item.cite[0]!;
  expect(text).toContain(`- \`${c.source}\` §${c.section}\n  ${c.label}: ${c.url}`);
  expect(sheet.hash).toBe('8030bdf5881458e6b0116a075ca2a4b72d3a51429150e316545070458f63df37');
});

// G4: an item's own hash, for the targeted re-check (plan.md, "Targeted re-checks").

const anItem = (): SheetItem => sheetOf().items.find((i) => i.kind === 'claim' && i.cite.length > 1)!;
const withCite = (item: SheetItem, edit: (c: SheetItem['cite'][number]) => void): SheetItem => {
  const copy = structuredClone(item);
  edit(copy.cite[0]!);
  return copy;
};

test('item hash 1: an item\'s hash is 64 lowercase hex, and the same item under another key has the same hash', () => {
  const item = anItem();
  expect(itemHash(item)).toMatch(/^[0-9a-f]{64}$/);
  expect(itemHash({ ...item, key: 'units[7].elsewhere' })).toBe(itemHash(item));
});

test('item hash 2: it is the SHA-256 of the canonical form of the kind, words, citations and traces, without the key', () => {
  const item = anItem();
  expect(itemHash(item)).toBe(sha256(JSON.stringify(sortedDeep({ kind: item.kind, content: item.content, cite: item.cite, traces: item.traces }))));
});

/** The reference form: every object's keys sorted, and empty lists, empty records and undefined left out. */
function sortedDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortedDeep);
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, sortedDeep((value as Record<string, unknown>)[k])] as const)
        .filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0) && !(typeof v === 'object' && v !== null && !Array.isArray(v) && Object.keys(v).length === 0)),
    );
  }
  return value;
}

test('item hash 3: the kind, the words, each part of a citation and the traces each change it', () => {
  const item = anItem();
  const before = itemHash(item);
  const traced = sheetOf().items.find((i) => i.kind === 'traced' && i.traces.length > 1)!;
  const edits: [string, SheetItem][] = [
    ['the kind', { ...item, kind: 'analogy' }],
    ['the words', { ...item, content: { text: 'Other words.' } }],
    ['a citation source', withCite(item, (c) => { c.source = 'another-source'; })],
    ['a citation section', withCite(item, (c) => { c.section = '9.9'; })],
    ['a citation url', withCite(item, (c) => { c.url = 'https://example.org/x'; })],
    ['a citation label', withCite(item, (c) => { c.label = 'Another label'; })],
    ['a citation defining marker', withCite(item, (c) => { c.defining = c.defining === true ? undefined : true; })],
    ['a citation removed', { ...item, cite: item.cite.slice(1) }],
  ];
  for (const [what, changedItem] of edits) expect(itemHash(changedItem), what).not.toBe(before);
  expect(itemHash({ ...traced, traces: [...traced.traces].reverse() }), 'the traces').not.toBe(itemHash(traced));
  expect(itemHash({ ...traced, traces: traced.traces.slice(1) }), 'a trace removed').not.toBe(itemHash(traced));
});

test('item hash 4: a display-only setting leaves it as it was, and an empty list or record is left out', () => {
  const before = itemHashes(sheetOf());
  const edit = (l: Lesson) => { unit(l).scene.log.columns[0]!.width = 120; unit(l).scene.views = ['network']; };
  expect(itemHashes(sheetOf(changed(edit)))).toEqual(before);
  const item = anItem();
  expect(itemHash({ ...item, traces: [] })).toBe(itemHash(item));
});

test('item hash 5: itemHashes has one hash for every key of the sheet', () => {
  const sheet = sheetOf();
  const hashes = itemHashes(sheet);
  expect(Object.keys(hashes)).toEqual(sheet.items.map((i) => i.key));
  for (const item of sheet.items) expect(hashes[item.key]).toBe(itemHash(item));
});

test('the sheet\'s own hash and its rendering are as they were before item hashes: not a character changed', () => {
  const sheet = sheetOf();
  expect(sheet.hash).toBe('8030bdf5881458e6b0116a075ca2a4b72d3a51429150e316545070458f63df37');
  expect(sha256(renderSheet(sheet))).toBe('32e3de812eeb45839d9bd889b05180d5b0b7920d9800a9cc8429b10843489f56');
});
