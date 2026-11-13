import { describe, expect, test, vi } from 'vitest';
import { validateLesson } from '../define';
import { makeGroup, statement } from '../glossary-fixtures';
import type { GlossaryGroupInput } from '../glossary-group';
import { FIXTURE_SOURCES, makeCitedLesson } from '../test-fixtures';
import { itemsToJudge, renderRecheck } from './recheck';
import { claimSheet, groupSheet, itemHashes } from './sheet';

// The re-check of a glossary group judges a whole entry (docs/glossary-path-spec.md §6, E6; plan.md A6.x).

vi.mock('../../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../test-fixtures')).FIXTURE_PARTS }));

const lesson = (edit: (l: ReturnType<typeof makeCitedLesson>) => void = () => {}) => {
  const l = makeCitedLesson();
  edit(l);
  return validateLesson(l, FIXTURE_SOURCES);
};
type Entries = GlossaryGroupInput['entries'];
const base = (): Entries => [
  { id: 'a', term: 'A', also: ['Alpha'], definition: [statement('a-1', 'One.'), statement('a-2', 'Two.'), statement('a-3', 'Three.')], lessons: [{ lesson: 'cited-lesson', term: 'term-1' }] },
  { id: 'ttl', term: 'TTL', definition: [statement('ttl-1', 'Hops.')] },
  { id: 'ttl-dns', term: 'TTL in DNS', definition: [statement('ttl-dns-1', 'Seconds.')] },
  {
    id: 'request',
    term: 'Request',
    senses: [
      { id: 'dhcp', label: 'In DHCP', definition: [statement('r-d-1', 'Asking.')], lessons: [{ lesson: 'cited-lesson', term: 'term-2' }] },
      { id: 'http', label: 'In HTTP', definition: [statement('r-h-1', 'Fetching.')] },
    ],
  },
  { id: 'b', term: 'B', definition: [statement('b-1', 'Bee.')] },
  { id: 'c', term: 'C', definition: [statement('c-1', 'See.')] },
];
const sheetOf = (edit: (e: Entries) => void = () => {}, l = lesson()) =>
  groupSheet(
    makeGroup((i) => {
      i.entries = base();
      edit(i.entries);
    }),
    FIXTURE_SOURCES,
    [l],
  );
const find = (e: Entries, id: string) => e.find((x) => x.id === id)!;
const judging = (edit: (e: Entries) => void, l = lesson()) => itemsToJudge(itemHashes(sheetOf()), sheetOf(edit, l));
const entryKeys = (id: string) => sheetOf().items.map((i) => i.key).filter((k) => k.startsWith(`entry "${id}"`));

describe('the entry rule', () => {
  test('A6.1 editing statement 2 judges all five of the entry\'s items and nothing of another entry', () => {
    const j = judging((e) => (find(e, 'a').definition![1]!.text = 'Two, reworded.'));
    expect(j.changed).toEqual(['entry "a": statement "a-2"']);
    expect(j.judge).toEqual(entryKeys('a'));
    expect(j.judge).toHaveLength(5);
    expect(j.pulled).toEqual(entryKeys('a').filter((k) => k !== 'entry "a": statement "a-2"'));
  });
  test('A6.2 taking statement 3 out pulls the entry\'s remaining items; the removed key is not judged', () => {
    const j = judging((e) => find(e, 'a').definition!.pop());
    expect(j.changed).toEqual([]);
    expect(j.judge).toEqual(['entry "a": names', 'entry "a": statement "a-1"', 'entry "a": statement "a-2"', 'entry "a": lessons']);
    expect(j.judge).not.toContain('entry "a": statement "a-3"');
  });
  test('A6.3 the prefix is the whole id: editing ttl does not pull ttl-dns, and a sense pulls both senses', () => {
    const j = judging((e) => (find(e, 'ttl').definition![0]!.text = 'Hop count.'));
    expect(j.judge).toEqual(entryKeys('ttl'));
    expect(j.judge.some((k) => k.startsWith('entry "ttl-dns"'))).toBe(false);
    const s = judging((e) => (find(e, 'request').senses![1]!.definition[0]!.text = 'Getting.'));
    expect(s.changed).toEqual(['entry "request", sense "http": statement "r-h-1"']);
    expect(s.judge).toEqual(entryKeys('request'));
    expect(s.judge).toContain('entry "request", sense "dhcp": label');
    expect(s.judge).toContain('entry "request": names');
  });
  test('A6.4 editing a tied lesson term\'s idea changes that tie and pulls its whole entry', () => {
    const j = judging(() => {}, lesson((l) => (l.units[0]!.learn.terms[1]!.idea = 'A loan of an address')));
    expect(j.changed).toEqual(['entry "request", sense "dhcp": lessons']);
    expect(j.judge).toEqual(entryKeys('request'));
  });
  test('A6.5 renaming entry a to a2 changes every a2 item and pulls nothing else', () => {
    const j = judging((e) => {
      find(e, 'a').id = 'a2';
      find(e, 'a2').definition = find(e, 'a2').definition!.map((s, n) => ({ ...s, id: `a2-${n + 1}` }));
    });
    expect(j.changed.every((k) => k.startsWith('entry "a2"'))).toBe(true);
    expect(j.judge).toEqual(j.changed);
    expect(j.judge.some((k) => !k.startsWith('entry "a2"'))).toBe(false);
  });
  test('A6.6 no lesson rule on a group: a changed names item does not pull the other entries\' names and labels', () => {
    const j = judging((e) => (find(e, 'a').term = 'A, renamed'));
    expect(j.changed).toEqual(['entry "a": names']);
    expect(j.judge).toEqual(entryKeys('a'));
    expect(j.judge).not.toContain('entry "request", sense "dhcp": label');
    expect(j.judge).not.toContain('entry "b": names');
  });
  test('A6.7 a three-sense entry with three statements each is 16 items: one change judges them all, over the cap of 12', () => {
    const j = judging((e) => {
      const r = find(e, 'request');
      r.senses = ['x', 'y', 'z'].map((s) => ({ id: s, label: `Sense ${s}`, definition: ['1', '2', '3'].map((n) => statement(`${s}-${n}`, 'Short.')), lessons: [{ lesson: 'cited-lesson', term: s === 'x' ? 'term-2' : 'term-1' }] }));
    });
    expect(j.judge.filter((k) => k.startsWith('entry "request"'))).toHaveLength(1 + 3 * (1 + 3 + 1));
    expect(j.judge.length).toBeGreaterThan(12);
  });
  test('A6.8 editing a source cited by two entries pulls both entries whole', () => {
    const before = itemHashes(sheetOf());
    const edited = { ...FIXTURE_SOURCES, 'rfc-example': { ...FIXTURE_SOURCES['rfc-example']!, title: 'Example Protocol, second edition' } };
    const sheet = groupSheet(makeGroup((i) => (i.entries = base())), edited, [lesson()]);
    const j = itemsToJudge(before, sheet);
    for (const id of ['a', 'ttl', 'ttl-dns', 'request', 'b', 'c']) expect(j.judge).toEqual(expect.arrayContaining(entryKeys(id)));
  });
  test('nothing changed, nothing judged', () => expect(judging(() => {})).toEqual({ changed: [], pulled: [], judge: [] }));
});

describe('the re-check sheet of a group', () => {
  test('A6.9 it has no Learn context and no list section, and its intro states the entry rule', () => {
    const before = itemHashes(sheetOf());
    const sheet = sheetOf((e) => (find(e, 'a').definition![0]!.text = 'One, reworded.'));
    const out = renderRecheck(sheet, 'f'.repeat(64), itemsToJudge(before, sheet), 'docs/fact-checks/glossary/pilot.recheck.md');
    expect(out).not.toContain('## Learn parts, as context');
    expect(out).not.toContain('## Where the items to judge sit');
    expect(out).not.toContain('Context (no verdict)');
    expect(out).toContain('Judge only the items below: those that changed since the full check, and every item of an entry any of whose items changed or was taken out. Every other item keeps its verdict from the full check.');
    expect(out).toContain('### entry "a": names');
    expect(out).toContain('- `cited-lesson` term `term-1`:');
  });
});

describe('A6.10 no entry rule on a lesson', () => {
  test('a lesson fixture with one changed Learn part judges what the lesson rules say, and no key starts with entry', () => {
    const l = lesson();
    const before = itemHashes(claimSheet(l, FIXTURE_SOURCES));
    const changed = structuredClone(l);
    changed.units[0]!.learn.facts[2]!.value = 'A single device on the local network';
    const j = itemsToJudge(before, claimSheet(changed, FIXTURE_SOURCES));
    expect(j.changed).toEqual(['units[0].learn.facts[2] ("fact-3")']);
    expect(j.pulled).toEqual(expect.arrayContaining(['title', 'units[0].name', 'units[0].scene.packets.p1 (packet "p1")']));
    const unrelated = structuredClone(l);
    unrelated.units[0]!.steps[0]!.facts[1]!.value = 'Nobody';
    expect(itemsToJudge(before, claimSheet(unrelated, FIXTURE_SOURCES)).judge).toEqual(['units[0].steps[0].facts[1] (step "request", fact "Sent to")']);
  });
});
