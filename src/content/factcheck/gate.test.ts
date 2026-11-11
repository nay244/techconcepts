import { expect, test, vi } from 'vitest';
import { validateLesson } from '../define';
import { SOURCES } from '../sources';
import type { GlossaryEntry } from '../glossary';
import { FIXTURE_SOURCES, liftedFixture, makeCertTrack, makeCitedLesson } from '../test-fixtures';
import { checkFactChecks, checkReport, checkUnpathedKinds, reportPath } from './gate';
import { claimSheet } from './sheet';
import { recordedReportFor as reportFor, reportFor as bareReportFor } from './test-helpers';
import { parseReport } from './report';

// The real FIGURE_PARTS is empty until each figure is built; the stand-in has the fixture's places and cues.
vi.mock('../../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../test-fixtures')).FIXTURE_PARTS }));

const lesson = () => validateLesson(makeCitedLesson(), FIXTURE_SOURCES);
const sheet = () => claimSheet(lesson(), FIXTURE_SOURCES);
const PATH = 'docs/fact-checks/cited-lesson.md';
/** The registry's glob keys reports by their path from src/content. */
const GLOB = '../../docs/fact-checks/cited-lesson.md';
const gate = (raw: string | undefined) => checkFactChecks([lesson()], raw === undefined ? {} : { [GLOB]: raw }, FIXTURE_SOURCES);
const firstKey = () => sheet().items[0]!.key;

const RUN = 'npm run fact-check -- cited-lesson --quotes <folder of the sources>';
/** The quote blocks of a recorded report (heading, bullet, passage) as lines, to take one out. */
const firstBlock = (raw: string) => /\n### [^\n]* — ✅\n\n- [^\n]*\n  > [^\n]*\n/.exec(raw)![0];

test('the report path is by slug', () => {
  expect(reportPath('cited-lesson')).toBe(PATH);
});

test('a current all-pass report is clean', () => {
  expect(gate(reportFor(sheet()))).toEqual([]);
  expect(checkReport(sheet(), reportFor(sheet()), PATH)).toEqual([]);
});

test('a cited lesson with no report fails', () => {
  expect(gate(undefined)).toEqual([expect.stringContaining(`no fact-check report at ${PATH}`)]);
});

test('a stale hash fails', () => {
  expect(gate(reportFor(sheet(), (h) => { h.hash = 'b'.repeat(64); }))).toEqual([expect.stringContaining('changed since it was checked')]);
});

test('a missing key fails', () => {
  const key = firstKey();
  expect(gate(reportFor(sheet(), (h) => { delete h.verdicts[key]; }))).toEqual([expect.stringContaining(`no verdict for ${key}`)]);
});

test('an extra key fails', () => {
  expect(gate(reportFor(sheet(), (h) => { h.verdicts['units[0].nowhere'] = '✅'; }))).toEqual([expect.stringContaining('units[0].nowhere')]);
});

test('a ⚠️ or ❌ verdict fails and names the key', () => {
  for (const verdict of ['⚠️', '❌']) {
    const key = firstKey();
    const issues = gate(reportFor(sheet(), (h) => { h.verdicts[key] = verdict; }));
    expect(issues, verdict).toEqual([expect.stringContaining(key)]);
    expect(issues[0], verdict).toContain('did not pass');
  }
});

test('a verdict that is not exactly one of the three fails', () => {
  for (const verdict of ['⚠', '✔', 'ok', 'pass', 'OK', '']) {
    const key = firstKey();
    expect(gate(reportFor(sheet(), (h) => { h.verdicts[key] = verdict; })), JSON.stringify(verdict)).not.toEqual([]);
  }
});

test('a source marked not current fails', () => {
  const issues = gate(reportFor(sheet(), (h) => { h.sources[0]!.current = false; }));
  expect(issues).toEqual([expect.stringContaining('not current')]);
});

test('a cited source missing from the header fails', () => {
  const issues = gate(reportFor(sheet(), (h) => { h.sources = h.sources.slice(1); }));
  expect(issues).toEqual([expect.stringContaining('does not say whether')]);
});

test('a header slug that differs fails', () => {
  expect(gate(reportFor(sheet(), (h) => { h.slug = 'another-lesson'; }))).toEqual([expect.stringContaining('another-lesson')]);
});

test('an unreadable report fails', () => {
  expect(gate('# Fact check\n\nNo header.\n')).toEqual([expect.stringContaining('cannot be read')]);
});

test('an orphan report fails', () => {
  const issues = checkFactChecks([lesson()], { [GLOB]: reportFor(sheet()), '../../docs/fact-checks/gone.md': 'anything' }, FIXTURE_SOURCES);
  expect(issues).toEqual([expect.stringContaining('docs/fact-checks/gone.md')]);
});

test('legacy lessons need no report', () => {
  expect(checkFactChecks([liftedFixture()], {}, FIXTURE_SOURCES)).toEqual([]);
});

test('no reports and no cited lessons is clean', () => {
  expect(checkFactChecks([], {}, SOURCES)).toEqual([]);
});

// ---------------------------------------------------------------- the quote record

test('a report with no quote record has not had its quotes confirmed', () => {
  const issues = gate(bareReportFor(sheet()));
  expect(issues).toEqual([expect.stringContaining(`${PATH}: the quotes have not been confirmed`)]);
  expect(issues[0]).toContain(RUN);
  expect(issues[0]).toContain('docs/content-model.md §8');
});

test('a form problem under a claim is named with the report path', () => {
  const issues = gate(reportFor(sheet()) + '\n### nonsense heading\n');
  expect(issues).toEqual([expect.stringMatching(/^docs\/fact-checks\/cited-lesson\.md: .*"### nonsense heading" is not a claim heading/)]);
});

test('a header problem is not reported twice', () => {
  expect(gate('# Fact check\n\nNo header.\n')).toHaveLength(1);
});

test('a quote whose word changed after the record fails the digest', () => {
  const issues = gate(reportFor(sheet()).replace('Filler words.', 'Other words.'));
  expect(issues).toEqual([expect.stringContaining('a quote changed after the quote check last passed')]);
  expect(issues[0]).toContain(PATH);
  expect(issues[0]).toContain(RUN);
});

test('a quote added after the record fails the count', () => {
  const s = sheet();
  const last = s.items.filter((i) => i.cite.length > 0).at(-1)!.cite[0]!;
  const raw = reportFor(s) + `- \`${last.source}\` §${last.section}\n  > More words.\n`;
  const issues = gate(raw);
  expect(issues).toEqual([expect.stringContaining('a quote changed after the quote check last passed')]);
  expect(issues[0]).toMatch(/the record has \d+ quotes?, digest [0-9a-f]{12}…; the report has \d+, digest/);
});

test('a source file missing from the record, and one it should not have, are named', () => {
  const ids = [...new Set(sheet().items.flatMap((i) => i.cite.slice(0, 1).map((c) => c.source)))];
  const missing = gate(reportFor(sheet(), (h) => { delete (h.quotes as { files: Record<string, string> }).files[ids[0]!]; }));
  expect(missing).toEqual([expect.stringContaining(`no file hash for ${ids[0]}`)]);
  const extra = gate(reportFor(sheet(), (h) => { (h.quotes as { files: Record<string, string> }).files['no-such-source'] = 'a'.repeat(64); }));
  expect(extra).toEqual([expect.stringContaining('no-such-source, which no quote names')]);
  expect(extra[0]).toContain(RUN);
});

test('a record dated before the report fails', () => {
  const issues = gate(reportFor(sheet(), (h) => { (h.quotes as { checked: string }).checked = '2026-11-07'; }));
  expect(issues).toEqual([expect.stringContaining('quote check was last run on 2026-11-07, before the report was checked on 2026-11-08')]);
  expect(gate(reportFor(sheet(), (h) => { (h.quotes as { checked: string }).checked = '2026-11-09'; }))).toEqual([]);
});

test('a passing claim with citations and no quote fails, naming the key', () => {
  const raw = reportFor(sheet());
  const key = /### ([^\n]*) — ✅/.exec(firstBlock(raw))![1]!;
  const issues = gate(raw.replace(firstBlock(raw), '\n'));
  expect(issues).toContainEqual(expect.stringContaining(`item(s) that pass have no quote: ${key}`));
  expect(parseReport(raw).header!.quotes).toBeDefined();
});

// ---------------------------------------------------------------- kinds with no fact-check path yet

const entry = (id: string): GlossaryEntry => ({ id, term: id, definition: [] });

test('no glossary entries and no objective mappings give no problem', () => {
  expect(checkUnpathedKinds([], [])).toEqual([]);
});

test('a glossary entry is refused with its id', () => {
  expect(checkUnpathedKinds([entry('router')], [])).toEqual([
    'glossary entry "router" has no fact-check path yet: the build refuses glossary entries until one is built (docs/direction.md, decision 2.16)',
  ]);
});

test('an objective mapping is refused, naming its track, lesson and objective', () => {
  const issues = checkUnpathedKinds([], [makeCertTrack()]);
  expect(issues).toEqual([
    expect.stringContaining('track "example-cert", lesson "lesson-a", objective EX-101 2.6 has no fact-check path yet'),
    expect.stringContaining('track "example-cert", lesson "lesson-b", objective EX-101 2.7 has no fact-check path yet'),
  ]);
  expect(issues[0]).toContain('the build refuses objective mappings until one is built (docs/direction.md, decision 2.16)');
});
