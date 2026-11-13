import { describe, expect, test, vi } from 'vitest';
import { validateLesson } from '../define';
import { makeGroup } from '../glossary-fixtures';
import type { GlossaryGroup } from '../glossary-group';
import { FIXTURE_SOURCES, makeCitedLesson } from '../test-fixtures';
import { canaryGroupRecheckPath, canaryGroupReportPath, type FactCheckDeps, runFactCheck } from './cli';
import { itemsToJudge } from './recheck';
import { parseRecheck, parseReport } from './report';
import { sha256 } from './sha256';
import { groupSheet } from './sheet';
import { recheckReportFor, recordedReportFor, reportQuoting, stampedReportFor } from './test-helpers';

// Every command form for a glossary group (docs/glossary-path-spec.md §4; plan.md A4.x), through runFactCheck as the lesson forms are.

vi.mock('../../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../test-fixtures')).FIXTURE_PARTS }));

const lesson = () => validateLesson(makeCitedLesson(), FIXTURE_SOURCES);
const edited = () => makeGroup((i) => (i.entries[0]!.definition![1]!.text = 'It ends unless the device renews it in time.'));
const sheetA = () => groupSheet(makeGroup(), FIXTURE_SOURCES, [lesson()]);
const sheetB = () => groupSheet(edited(), FIXTURE_SOURCES, [lesson()]);
const PATH = 'docs/fact-checks/glossary/pilot.md';
const RE = 'docs/fact-checks/glossary/pilot.recheck.md';

function setup(files: Record<string, string | undefined>, group: GlossaryGroup | undefined = makeGroup(), more: Partial<FactCheckDeps> = {}) {
  const written: Record<string, string> = {};
  const calls = { group: vi.fn(), lesson: vi.fn() };
  const deps: FactCheckDeps = {
    getLesson: async (slug) => (calls.lesson(slug), slug === 'cited-lesson' ? lesson() : undefined),
    getGlossaryGroup: async (id) => (calls.group(id), id === 'pilot' ? group : undefined),
    sources: FIXTURE_SOURCES,
    readFile: (path) => (Object.hasOwn(files, path) ? files[path] : undefined),
    loadCanary: async () => undefined,
    readFolder: (dir) => (dir === 'tmp' ? [{ name: 'rfc-example.txt', text: 'Some Filler words. here' }] : undefined),
    writeFile: (to, text) => void (written[to] = text),
    today: () => '2026-11-13',
    ...more,
  };
  return { deps, written, calls };
}

test('A4.1 printing a group gives its sheet and where to write the report', async () => {
  const { deps } = setup({});
  const run = await runFactCheck(['glossary/pilot'], deps);
  expect(run.code).toBe(0);
  expect(run.out).toContain('# Claim sheet: glossary/pilot');
  expect(run.out).toContain(`Hash: \`${sheetA().hash}\``);
  expect(run.out.endsWith(`Write your report to: ${PATH}`)).toBe(true);
});

describe('A4.2 unknown targets', () => {
  test('an unknown group, and forms that are not a group id, never load a lesson', async () => {
    const { deps, calls } = setup({});
    expect(await runFactCheck(['glossary/nope'], deps)).toEqual({ code: 1, out: 'No glossary group "nope".' });
    for (const bad of ['glossary/', 'glossary/../cited-lesson', 'glossary/Pilot', 'glossary/a/b']) {
      const run = await runFactCheck([bad], deps);
      expect(run.code, bad).toBe(1);
      expect(run.out, bad).toMatch(/^No glossary group "/);
    }
    expect(calls.group).toHaveBeenCalledTimes(1);
    expect(calls.group).toHaveBeenCalledWith('nope');
    expect(calls.lesson).not.toHaveBeenCalled();
  });
  test('the word glossary alone is a lesson slug, and a lesson slug still prints the lesson sheet', async () => {
    const { deps } = setup({});
    expect(await runFactCheck(['glossary'], deps)).toEqual({ code: 1, out: 'No lesson "glossary".' });
    const run = await runFactCheck(['cited-lesson'], deps);
    expect(run.code).toBe(0);
    expect(run.out).toContain('Write your report to: docs/fact-checks/cited-lesson.md');
  });
  test('only the asked-for group is loaded, and each tied lesson once', async () => {
    const { deps, calls } = setup({});
    await runFactCheck(['glossary/pilot'], deps);
    expect(calls.group.mock.calls).toEqual([['pilot']]);
    expect(calls.lesson.mock.calls).toEqual([['cited-lesson']]);
  });
});

test('A4.3 --check: a passing report is OK; a header slug without the prefix is refused', async () => {
  expect(await runFactCheck(['glossary/pilot', '--check'], setup({ [PATH]: recordedReportFor(sheetA()) }).deps)).toEqual({ code: 0, out: `Report OK: ${PATH}` });
  const run = await runFactCheck(['glossary/pilot', '--check'], setup({ [PATH]: recordedReportFor(sheetA(), (h) => (h.slug = 'pilot')) }).deps);
  expect(run).toEqual({ code: 1, out: `${PATH}: is the report for "pilot", not "glossary/pilot"; fix its slug or its file name.` });
  expect((await runFactCheck(['glossary/pilot', '--check'], setup({}).deps)).out).toContain(`no fact-check report at ${PATH}`);
});

describe('A4.4 --quotes', () => {
  test('writes the record with items (one per sheet key) and limits = the hash of []', async () => {
    const { deps, written } = setup({ [PATH]: reportQuoting(sheetA()) });
    const run = await runFactCheck(['glossary/pilot', '--quotes', 'tmp'], deps);
    expect(run.code, run.out).toBe(0);
    const header = parseReport(written[PATH]!).header!;
    expect(Object.keys(header.items!)).toEqual(sheetA().items.map((i) => i.key));
    expect(header.limits).toBe(sha256('[]'));
    expect(header.quotes!.count).toBe(sheetA().items.filter((i) => i.cite.length > 0).length);
  });
  test('a quote under a names, label or tie heading is refused: it cites nothing', async () => {
    for (const key of ['entry "lease": names', 'entry "renewal", sense "dhcp": label', 'entry "lease": lessons']) {
      const raw = `${reportQuoting(sheetA())}\n### ${key} — ✅\n\n- \`rfc-example\` §2.1\n  > Filler words.\n`;
      const run = await runFactCheck(['glossary/pilot', '--quotes', 'tmp'], setup({ [PATH]: raw }).deps);
      expect(run.code, key).toBe(1);
      expect(run.out, key).toContain('this item cites nothing');
    }
  });
});

describe('A4.5 --stamp', () => {
  test('writes items and limits at the sheet\'s hash, and refuses at another hash in the group\'s words', async () => {
    const plain = recordedReportFor(sheetA());
    const { deps, written } = setup({ [PATH]: plain });
    expect((await runFactCheck(['glossary/pilot', '--stamp'], deps)).code).toBe(0);
    const header = parseReport(written[PATH]!).header!;
    expect(header.limits).toBe(sha256('[]'));
    expect(Object.keys(header.items!)).toHaveLength(sheetA().items.length);
    const stale = setup({ [PATH]: plain }, edited());
    const run = await runFactCheck(['glossary/pilot', '--stamp'], stale.deps);
    expect(run.code).toBe(1);
    expect(run.out).toMatch(/^docs\/fact-checks\/glossary\/pilot\.md: the glossary group "pilot" has changed since it was checked \(report [0-9a-f]{12}…, group [0-9a-f]{12}…\); the items record describes the group as it was checked, so run --stamp at the commit it was checked on, or run a full check \(docs\/content-model\.md §8\)\.$/);
  });
});

describe('A4.6 --recheck', () => {
  const full = () => stampedReportFor(sheetA());
  const judged = () => itemsToJudge(parseReport(full()).header!.items!, sheetB()).judge;
  const re = () => recheckReportFor(sheetB(), sheetA().hash, judged());

  test('prints the re-check sheet with the whole entry, and no Learn context', async () => {
    const run = await runFactCheck(['glossary/pilot', '--recheck'], setup({ [PATH]: full() }, edited()).deps);
    expect(run.code, run.out).toBe(0);
    expect(run.out).toContain('# Re-check sheet: glossary/pilot');
    expect(run.out).toContain('## Items to judge (4)');
    for (const key of ['entry "lease": names', 'entry "lease": statement "lease-1"', 'entry "lease": statement "lease-2"', 'entry "lease": lessons']) expect(run.out).toContain(`### ${key}`);
    expect(run.out).not.toContain('### entry "renewal"');
    expect(run.out).not.toContain('Learn parts, as context');
    expect(run.out).not.toContain('Where the items to judge sit');
    expect(run.out).toContain('Judge only the items below: those that changed since the full check, and every item of an entry any of whose items changed or was taken out. Every other item keeps its verdict from the full check.');
    expect(run.out.trimEnd().endsWith(`Write your report to: ${RE}`)).toBe(true);
  });
  test('refuses when nothing changed, when the full report is not a near-pass, and in the group\'s words', async () => {
    expect((await runFactCheck(['glossary/pilot', '--recheck'], setup({ [PATH]: full() }).deps)).out).toContain('Nothing changed since the full check');
    expect((await runFactCheck(['glossary/pilot', '--recheck'], setup({ [PATH]: full() }).deps)).out).toContain("has the group's hash");
    const bad = stampedReportFor(sheetA(), (h) => Object.keys(h.verdicts).slice(0, 4).forEach((k) => (h.verdicts[k] = '⚠️')));
    const run = await runFactCheck(['glossary/pilot', '--recheck'], setup({ [PATH]: bad }, edited()).deps);
    expect(run.out).toContain('the full check was not a near-pass (4 items did not pass, 0 wrong (❌); a re-check needs at most 3 not passing and none wrong); fix the group, then run a full check');
    expect((await runFactCheck(['glossary/pilot', '--recheck'], setup({}, edited()).deps)).out).toContain('so run the fact-checker on the group first');
  });
  test('refuses more than 12 items', async () => {
    const big = makeGroup((i) => {
      i.entries[0]!.also = undefined;
      i.entries[1]!.senses!.push({ id: 'third', label: 'Third', definition: ['a', 'b', 'c'].map((k) => ({ id: `t-${k}`, text: 'Short.', cite: i.entries[0]!.definition![0]!.cite })), lessons: [{ lesson: 'cited-lesson', term: 'term-1' }] });
      i.entries[1]!.senses![0]!.definition = ['a', 'b', 'c'].map((k) => ({ id: `u-${k}`, text: 'Short.', cite: i.entries[0]!.definition![0]!.cite }));
      i.entries[1]!.senses![1]!.definition = ['a', 'b', 'c'].map((k) => ({ id: `v-${k}`, text: 'Short.', cite: i.entries[0]!.definition![0]!.cite }));
    });
    const sheet = groupSheet(big, FIXTURE_SOURCES, [lesson()]);
    expect(sheet.items.filter((i) => i.key.startsWith('entry "renewal"')).length).toBeGreaterThan(12);
    const bigFull = stampedReportFor(groupSheet(makeGroup(), FIXTURE_SOURCES, [lesson()]));
    const run = await runFactCheck(['glossary/pilot', '--recheck'], setup({ [PATH]: bigFull }, big).deps);
    expect(run.out).toMatch(/\d+ items to judge, more than 12; a re-check is for a few changed items/);
  });
  test('--recheck --quotes writes the re-check record, and --recheck --check passes the pair', async () => {
    const files = { [PATH]: full(), [RE]: re() };
    const quoted = setup(files, edited());
    expect((await runFactCheck(['glossary/pilot', '--recheck', '--quotes', 'tmp'], quoted.deps)).code).toBe(0);
    expect(parseRecheck(quoted.written[RE]!).header!.quotes).toBeDefined();
    expect(await runFactCheck(['glossary/pilot', '--recheck', '--check'], setup(files, edited()).deps)).toEqual({ code: 0, out: `Report OK: ${PATH} and ${RE}` });
    expect((await runFactCheck(['glossary/pilot', '--recheck', '--check'], setup({ [PATH]: full() }, edited()).deps)).out).toContain('run the fact-checker on the group as a re-check');
  });
});

describe('the canary group', () => {
  test('A4.7 it comes through its own dep, points to its own report, and the canary lesson is untouched', async () => {
    const canary = makeGroup((i) => (i.id = 'fact-check-canary'));
    const { deps, calls } = setup({}, undefined, { loadCanaryGroup: async () => ({ group: canary, sources: FIXTURE_SOURCES, lessons: [lesson()] }) });
    const run = await runFactCheck(['glossary/fact-check-canary'], deps);
    expect(run.code).toBe(0);
    expect(run.out.endsWith(`Write your report to: ${canaryGroupReportPath}`)).toBe(true);
    expect(calls.group).not.toHaveBeenCalled();
    expect(canaryGroupReportPath).toBe('docs/fact-checks/canary/glossary-fact-check-canary.md');
    expect(canaryGroupRecheckPath).toBe('docs/fact-checks/canary/glossary-fact-check-canary.recheck.md');
    expect((await runFactCheck(['fact-check-canary'], deps)).out).toBe('The canary lesson does not exist yet.');
  });
  test('with no canary group, it says so', async () => {
    expect(await runFactCheck(['glossary/fact-check-canary'], setup({}).deps)).toEqual({ code: 1, out: 'The canary glossary group does not exist yet.' });
  });
});

test('A4.8 a tie to a missing lesson gives a message naming the entry and the pair, not a TypeError', async () => {
  const { deps } = setup({}, makeGroup((i) => (i.entries[0]!.lessons = [{ lesson: 'what-is-nope', term: 'term-2' }])));
  expect(await runFactCheck(['glossary/pilot'], deps)).toEqual({ code: 1, out: 'entry "lease": ties lesson "what-is-nope", term "term-2", which does not exist; fix the tie.' });
});

test('A4.9 the usage text and the script\'s header name glossary/<id>', async () => {
  expect((await runFactCheck([], setup({}).deps)).out).toContain('glossary/<group>');
  expect(Object.values(import.meta.glob<string>('../../../scripts/fact-check.mjs', { query: '?raw', import: 'default', eager: true }))[0]!).toContain('glossary/<id>');
});
