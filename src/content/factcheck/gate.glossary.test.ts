import { describe, expect, test, vi } from 'vitest';
import { validateLesson } from '../define';
import { makeGroup } from '../glossary-fixtures';
import type { GlossaryGroup } from '../glossary-group';
import { FIXTURE_SOURCES, makeCitedLesson } from '../test-fixtures';
import { changedSinceChecked, checkFactChecks, checkGlossaryFactChecks, checkPair, checkReport, checkedDate } from './gate';
import { itemsToJudge, recheckPath } from './recheck';
import { parseReport } from './report';
import { groupSheet } from './sheet';
import { recheckReportFor, recordedReportFor, reportFor, stampedReportFor, type LooseHeader } from './test-helpers';

// The gate for a glossary group (docs/glossary-path-spec.md §5; plan.md A5.x; E7).

vi.mock('../../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../test-fixtures')).FIXTURE_PARTS }));

const lesson = () => validateLesson(makeCitedLesson(), FIXTURE_SOURCES);
const sheetOf = (g: GlossaryGroup = makeGroup()) => groupSheet(g, FIXTURE_SOURCES, [lesson()]);
const PATH = 'docs/fact-checks/glossary/pilot.md';
const RE = 'docs/fact-checks/glossary/pilot.recheck.md';
/** The registry's glob keys, by path from src/content. */
const GLOB = (name: string) => `../../docs/fact-checks/glossary/${name}`;
const gate = (raw: string | undefined, group = makeGroup(), re?: string) =>
  checkGlossaryFactChecks([group], [lesson()], { ...(raw === undefined ? {} : { [GLOB('pilot.md')]: raw }) }, FIXTURE_SOURCES, re === undefined ? {} : { [GLOB('pilot.recheck.md')]: re });
const passing = () => recordedReportFor(sheetOf());
const firstBlock = (raw: string) => /\n### [^\n]* — ✅\n\n- [^\n]*\n  > [^\n]*\n/.exec(raw)![0];

describe('A5.1 refuse', () => {
  test('a passing report is clean', () => {
    expect(gate(passing())).toEqual([]);
    expect(checkReport(sheetOf(), passing(), PATH)).toEqual([]);
  });
  test('no report', () => expect(gate(undefined)).toEqual([`glossary/pilot: no fact-check report at ${PATH}; run the fact-checker on it (docs/content-model.md §8).`]));
  test('a stale report names the glossary group (E7)', () => {
    const stale = recordedReportFor(sheetOf(makeGroup((i) => (i.entries[0]!.definition![0]!.text = 'A different sentence.'))));
    const issues = gate(stale);
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatch(/^docs\/fact-checks\/glossary\/pilot\.md: the glossary group "pilot" has changed since it was checked \(report [0-9a-f]{12}…, group [0-9a-f]{12}…\); run the fact-checker on it again \(docs\/content-model\.md §8\)\.$/);
  });
  test('a ⚠️ verdict, a missing key and an unknown key are refused, in the group\'s words', () => {
    const key = 'entry "lease": statement "lease-1"';
    expect(gate(recordedReportFor(sheetOf(), (h) => (h.verdicts[key] = '⚠️')))[0]).toContain(`1 item(s) did not pass: ⚠️ ${key}. Fix the group, then run the fact-checker on it again`);
    expect(gate(recordedReportFor(sheetOf(), (h) => delete h.verdicts[key]))).toContainEqual(expect.stringContaining(`no verdict for ${key}`));
    expect(gate(recordedReportFor(sheetOf(), (h) => (h.verdicts['entry "ghost": names'] = '✅')))).toContainEqual(
      expect.stringContaining('a verdict for entry "ghost": names, which the group does not have'),
    );
  });
  test('a cited source missing from sources, or not current', () => {
    expect(gate(recordedReportFor(sheetOf(), (h) => (h.sources = [])))).toContainEqual(expect.stringContaining('does not say whether source "rfc-example" is current'));
    expect(gate(recordedReportFor(sheetOf(), (h) => ((h.sources[0] as { current: boolean }).current = false)))).toContainEqual(expect.stringContaining('source "rfc-example" is not current'));
  });
  test('no quotes record; an edited quote; a passing cited item with no quote', () => {
    const run = 'run npm run fact-check -- glossary/pilot --quotes <folder of the sources>';
    expect(gate(reportFor(sheetOf()))).toEqual([expect.stringContaining('no quotes record')]);
    expect(gate(passing().replace('Filler words.', 'Other words.'))).toContainEqual(expect.stringContaining('a quote changed after the quote check last passed'));
    const without = gate(passing().replace(firstBlock(passing()), '\n'));
    expect(without).toContainEqual(expect.stringContaining(`item(s) that pass have no quote: entry "lease": statement "lease-1"`));
    expect(without.join('\n')).toContain(run);
  });
  test('a header slug of pilot instead of glossary/pilot', () => {
    expect(gate(recordedReportFor(sheetOf(), (h) => (h.slug = 'pilot')))).toEqual([`${PATH}: is the report for "pilot", not "glossary/pilot"; fix its slug or its file name.`]);
  });
  test('a quote under a names, label or tie heading is refused (it cites nothing)', () => {
    const raw = passing() + '\n### entry "lease": names — ✅\n\n- `rfc-example` §2.1\n  > Some words.\n';
    expect(gate(raw)).toContainEqual(expect.stringContaining('its quotes cannot be read'));
  });
});

describe('A5.2 orphans', () => {
  test('an orphan report and an orphan re-check name their folder', () => {
    const issues = checkGlossaryFactChecks([makeGroup()], [lesson()], { [GLOB('pilot.md')]: passing(), [GLOB('old.md')]: 'x' }, FIXTURE_SOURCES, { [GLOB('old.recheck.md')]: 'x' });
    expect(issues).toEqual([
      'docs/fact-checks/glossary/old.md: a fact-check report with no glossary group "old"; delete it, or fix its file name.',
      'docs/fact-checks/glossary/old.recheck.md: a re-check report with no glossary group "old"; delete it, or fix its file name.',
    ]);
  });
  test('pilot.recheck.md in the reports is not the full report of a group pilot.recheck, and pilot keeps its own', () => {
    const issues = checkGlossaryFactChecks([makeGroup()], [lesson()], { [GLOB('pilot.md')]: passing(), [GLOB('pilot.recheck.md')]: 'x' }, FIXTURE_SOURCES);
    expect(issues).toEqual(['docs/fact-checks/glossary/pilot.recheck.md: a fact-check report with no glossary group "pilot.recheck"; delete it, or fix its file name.']);
  });
});

describe('A5.3 a re-check pair', () => {
  const edited = () => makeGroup((i) => (i.entries[0]!.definition![1]!.text = 'It ends unless the device renews it in time.'));
  const full = () => stampedReportFor(sheetOf());
  const re = (raw = full(), edit?: (h: LooseHeader) => void) => {
    const sheet = sheetOf(edited());
    return recheckReportFor(sheet, parseReport(raw).header!.hash, itemsToJudge(parseReport(raw).header!.items!, sheet).judge, edit);
  };
  test('a pair whose re-check judges the whole changed entry passes', () => {
    const sheet = sheetOf(edited());
    const judge = itemsToJudge(parseReport(full()).header!.items!, sheet).judge;
    expect(judge).toEqual(sheet.items.filter((i) => i.key.startsWith('entry "lease"')).map((i) => i.key));
    expect(gate(full(), edited(), re())).toEqual([]);
    expect(checkedDate(sheet, full(), re())).toBe('2026-11-11');
  });
  test('a re-check that leaves an item of the entry out, or judges another entry\'s, is refused', () => {
    const key = 'entry "lease": names';
    expect(gate(full(), edited(), re(full(), (h) => delete h.verdicts[key]))).toContainEqual(expect.stringContaining(`no verdict for ${key}, an item to judge`));
    expect(gate(full(), edited(), re(full(), (h) => (h.verdicts['entry "renewal": names'] = '✅')))).toContainEqual(expect.stringContaining('a verdict for entry "renewal": names, which is not an item to judge'));
  });
  test('a failing re-check names the group', () => {
    const key = 'entry "lease": names';
    expect(gate(full(), edited(), re(full(), (h) => (h.verdicts[key] = '❌'))).join('\n')).toContain('did not pass: ❌ entry "lease": names. Fix the group, then run the re-check again');
  });
  test('the re-check\'s changed-since message names the group, and the lesson form is as it was', () => {
    const other = makeGroup((i) => (i.entries[0]!.definition![1]!.text = 'Yet another sentence.'));
    expect(gate(full(), other, re())).toEqual([expect.stringMatching(/^docs\/fact-checks\/glossary\/pilot\.recheck\.md: the glossary group "pilot" changed since it was re-checked \(re-check [0-9a-f]{12}…, group [0-9a-f]{12}…\); run the re-check again/)]);
  });
  test('a re-check beside a full report that is current is refused', () => {
    expect(checkPair(sheetOf(), full(), re(), PATH, RE)[0]).toContain('sits beside a full report that is current');
  });
});

describe('A5.4 a group and a lesson of one name', () => {
  test('neither is an orphan of the other, and each reads its own path', () => {
    const l = lesson();
    const g = makeGroup((i) => (i.id = l.slug));
    const groupRaw = recordedReportFor(groupSheet(g, FIXTURE_SOURCES, [l]));
    const lessonIssues = checkFactChecks([l], { [`../../docs/fact-checks/${l.slug}.md`]: 'x' }, FIXTURE_SOURCES);
    expect(lessonIssues.join('\n')).not.toContain('glossary');
    const groupIssues = checkGlossaryFactChecks([g], [l], { [GLOB(`${l.slug}.md`)]: groupRaw }, FIXTURE_SOURCES);
    expect(groupIssues).toEqual([]);
  });
});

test('E7 the lesson forms of the messages are byte for byte', () => {
  const l = lesson();
  const sheet = { slug: l.slug, hash: 'a'.repeat(64) } as Parameters<typeof changedSinceChecked>[1];
  expect(changedSinceChecked('docs/fact-checks/x.md', sheet, 'b'.repeat(64))).toBe(
    'docs/fact-checks/x.md: the lesson has changed since it was checked (report bbbbbbbbbbbb…, lesson aaaaaaaaaaaa…); run the fact-checker on it again (docs/content-model.md §8).',
  );
  expect(recheckPath('glossary/pilot')).toBe(RE);
});
