import { expect, test, vi } from 'vitest';
import { backedPartsOf, citedPartsOf } from '../cited';
import { validateLesson } from '../define';
import type { Lesson } from '../schema';
import { cite, defineSources } from '../sources';
import { FIXTURE_SOURCES, makeCitedLesson } from '../test-fixtures';
import { claimSheet, renderSheet } from './sheet';

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

test('the sheet renders every key and the hash', () => {
  const sheet = sheetOf();
  const text = renderSheet(sheet);
  expect(text).toContain(sheet.hash);
  for (const item of sheet.items) expect(text).toContain(item.key);
});
