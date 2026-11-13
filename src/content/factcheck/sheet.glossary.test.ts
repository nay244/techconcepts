import { expect, test, vi } from 'vitest';
import { validateLesson } from '../define';
import { makeGroup, statement } from '../glossary-fixtures';
import type { Lesson } from '../schema';
import { cite } from '../sources';
import { FIXTURE_SOURCES, makeCitedLesson } from '../test-fixtures';
import { sha256 } from './sha256';
import { canonical, claimSheet, groupSheet, itemHash, itemHashes, renderSheet } from './sheet';

// The group sheet (docs/glossary-path-spec.md §3, E8 to E10; plan.md A3.x).

vi.mock('../../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../test-fixtures')).FIXTURE_PARTS }));

const lesson = (edit: (l: ReturnType<typeof makeCitedLesson>) => void = () => {}): Lesson => {
  const l = makeCitedLesson();
  edit(l);
  return validateLesson(l, FIXTURE_SOURCES);
};
const sheet = (group = makeGroup(), lessons: Lesson[] = [lesson()]) => groupSheet(group, FIXTURE_SOURCES, lessons);
const keysOf = (s = sheet()) => s.items.map((i) => i.key);

test('A3.1 a one-sense entry gives names, statements, then lessons; a two-sense entry gives names, then each sense in file order', () => {
  expect(keysOf()).toEqual([
    'entry "lease": names',
    'entry "lease": statement "lease-1"',
    'entry "lease": statement "lease-2"',
    'entry "lease": lessons',
    'entry "renewal": names',
    'entry "renewal", sense "dhcp": label',
    'entry "renewal", sense "dhcp": statement "renewal-dhcp-1"',
    'entry "renewal", sense "dhcp": lessons',
    'entry "renewal", sense "contracts": label',
    'entry "renewal", sense "contracts": statement "renewal-contracts-1"',
  ]);
  const kinds = Object.fromEntries(sheet().items.map((i) => [i.key, i.kind]));
  expect(kinds['entry "lease": names']).toBe('unbacked');
  expect(kinds['entry "lease": statement "lease-1"']).toBe('claim');
  expect(kinds['entry "lease": lessons']).toBe('tie');
  expect(kinds['entry "renewal", sense "dhcp": label']).toBe('unbacked');
});

test('A3.2 an entry or sense with no lessons has no lessons item; an entry with no spellings has only its term in names', () => {
  const s = sheet();
  expect(keysOf(s)).not.toContain('entry "renewal", sense "contracts": lessons');
  expect(s.items.find((i) => i.key === 'entry "renewal": names')!.content).toEqual({ names: ['Renewal'] });
  expect(s.items.find((i) => i.key === 'entry "lease": names')!.content).toEqual({ names: ['Lease', 'Address lease'] });
});

test('E9 item content: a claim is its text and place; a label is its label; a tie holds { lesson, term, name, idea }', () => {
  const items = Object.fromEntries(sheet().items.map((i) => [i.key, i]));
  expect(items['entry "lease": statement "lease-2"']!.content).toEqual({ text: 'It ends unless the device renews it.', place: 2 });
  expect(items['entry "renewal", sense "contracts": label']!.content).toEqual({ label: 'In contracts' });
  expect(items['entry "lease": lessons']).toMatchObject({
    kind: 'tie',
    content: { lessons: [{ lesson: 'cited-lesson', term: 'term-2', name: 'Lease', idea: 'An address lent for a set time' }] },
    cite: [],
    traces: [],
  });
  expect(items['entry "lease": names']).toMatchObject({ cite: [], traces: [] });
});

test('A3.3 the sheet is glossary/<id>, has no overrides, and its hash is the lesson hash function of its body', () => {
  const s = sheet();
  expect(s.slug).toBe('glossary/pilot');
  expect(s.overrides).toEqual([]);
  expect(s.hash).toBe(sha256(canonical({ slug: s.slug, items: s.items, sources: s.sources, overrides: [] })));
  expect(s.hash).toMatch(/^[0-9a-f]{64}$/);
});

test('A3.4 swapping statements 1 and 2 changes both claims item hashes; renaming a term changes only its names item', () => {
  const before = itemHashes(sheet());
  const swapped = itemHashes(sheet(makeGroup((i) => i.entries[0]!.definition!.reverse())));
  expect(swapped['entry "lease": statement "lease-1"']).not.toBe(before['entry "lease": statement "lease-1"']);
  expect(swapped['entry "lease": statement "lease-2"']).not.toBe(before['entry "lease": statement "lease-2"']);
  const renamed = itemHashes(sheet(makeGroup((i) => (i.entries[0]!.term = 'Address loan'))));
  const changed = Object.keys(before).filter((k) => before[k] !== renamed[k]);
  expect(changed).toEqual(['entry "lease": names']);
});

test('A3.5 a tied lesson term\'s idea or name changes the tie item and the hash; its title, or an untied term, changes neither', () => {
  const base = sheet();
  const idea = sheet(makeGroup(), [lesson((l) => (l.units[0]!.learn.terms[1]!.idea = 'A loan of an address'))]);
  expect(idea.hash).not.toBe(base.hash);
  expect(itemHash(idea.items.find((i) => i.key === 'entry "lease": lessons')!)).not.toBe(itemHash(base.items.find((i) => i.key === 'entry "lease": lessons')!));
  const name = sheet(makeGroup(), [lesson((l) => (l.units[0]!.learn.terms[1]!.name = 'Address lease'))]);
  expect(name.hash).not.toBe(base.hash);
  expect(sheet(makeGroup(), [lesson((l) => (l.title = 'Another title'))]).hash).toBe(base.hash);
  expect(sheet(makeGroup(), [lesson((l) => (l.units[0]!.learn.terms[0]!.idea = 'Something else entirely'))]).hash).toBe(base.hash);
});

test('A3.6 sources holds only cited sources, sorted by id; editing a cited source changes the hash, an uncited one does not', () => {
  const group = makeGroup((i) => i.entries[1]!.senses![1]!.definition[0]!.cite = [cite('vendor-example', 'x', { sources: FIXTURE_SOURCES, url: 'https://learn.microsoft.com/example#x', }), cite('rfc-example', '3.1', { sources: FIXTURE_SOURCES })]);
  const s = groupSheet(group, FIXTURE_SOURCES, [lesson()]);
  expect(s.sources.map((x) => x.id)).toEqual(['rfc-example', 'vendor-example']);
  const edited = { ...FIXTURE_SOURCES, 'rfc-example': { ...FIXTURE_SOURCES['rfc-example']!, title: 'Example Protocol, revised' } };
  expect(groupSheet(makeGroup(), edited, [lesson()]).hash).not.toBe(sheet().hash);
  const other = { ...FIXTURE_SOURCES, 'vendor-example': { ...FIXTURE_SOURCES['vendor-example']!, title: 'Another page' } };
  expect(groupSheet(makeGroup(), other, [lesson()]).hash).toBe(sheet().hash);
});

test('A3.7 and A3.8 a tie prints one line a lesson term, its kind is tie, and the lines are as the spec writes them', () => {
  const out = renderSheet(sheet());
  expect(out).toContain('### entry "lease": lessons\n\nKind: tie\n\n- `cited-lesson` term `term-2`: Lease — An address lent for a set time\n');
  expect(out).toContain('# Claim sheet: glossary/pilot');
  expect(out).toContain('## Limit overrides\n\n- None.');
  const tie = out.slice(out.indexOf('### entry "lease": lessons'), out.indexOf('### entry "renewal": names'));
  expect(tie).not.toContain('```json');
});

test('a tie\'s idea keeps its bold markers as the lesson wrote them (it is the lesson\'s text)', () => {
  const s = sheet(makeGroup(), [lesson((l) => (l.units[0]!.learn.terms[1]!.idea = 'A **lent** address'))]);
  expect(renderSheet(s)).toContain('term `term-2`: Lease — A **lent** address');
});

test('E8 a tie to a lesson or term that does not exist throws, naming the entry or sense and the pair', () => {
  expect(() => groupSheet(makeGroup(), FIXTURE_SOURCES, [])).toThrow('entry "lease": ties lesson "cited-lesson", term "term-2", which does not exist');
  expect(() => groupSheet(makeGroup((i) => (i.entries[1]!.senses![0]!.lessons![0]!.term = 'term-9')), FIXTURE_SOURCES, [lesson()])).toThrow(
    'entry "renewal", sense "dhcp": ties lesson "cited-lesson", term "term-9", which does not exist',
  );
});

test('E10 entries are listed by id, so moving an entry in its file changes nothing; moving a statement inside an entry does', () => {
  const swapped = makeGroup((i) => i.entries.reverse());
  expect(sheet(swapped).hash).toBe(sheet().hash);
  expect(keysOf(sheet(swapped))).toEqual(keysOf());
  expect(sheet(makeGroup((i) => i.entries[0]!.definition!.reverse())).hash).not.toBe(sheet().hash);
});

test('A3.9 adding a group changes no lesson hash, and the lesson sheet has no tie or group item', () => {
  const before = claimSheet(lesson(), FIXTURE_SOURCES).hash;
  sheet();
  expect(claimSheet(lesson(), FIXTURE_SOURCES).hash).toBe(before);
  expect(claimSheet(lesson(), FIXTURE_SOURCES).items.some((i) => i.kind === 'tie')).toBe(false);
});

test('a group with a statement of 3 places and a statement id order keep place 1 to 3', () => {
  const s = sheet(makeGroup((i) => (i.entries[0]!.definition = ['a', 'b', 'c'].map((k) => statement(`s-${k}`, 'Short.')))));
  expect(s.items.filter((i) => i.kind === 'claim' && i.key.startsWith('entry "lease"')).map((i) => (i.content as { place: number }).place)).toEqual([1, 2, 3]);
});
