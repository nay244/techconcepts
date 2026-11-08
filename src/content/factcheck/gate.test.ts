import { expect, test, vi } from 'vitest';
import { validateLesson } from '../define';
import { SOURCES } from '../sources';
import { FIXTURE_SOURCES, liftedFixture, makeCitedLesson } from '../test-fixtures';
import { checkFactChecks, checkReport, reportPath } from './gate';
import { claimSheet } from './sheet';
import { reportFor } from './test-helpers';

// The real FIGURE_PARTS is empty until each figure is built; the stand-in has the fixture's places and cues.
vi.mock('../../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../test-fixtures')).FIXTURE_PARTS }));

const lesson = () => validateLesson(makeCitedLesson(), FIXTURE_SOURCES);
const sheet = () => claimSheet(lesson(), FIXTURE_SOURCES);
const PATH = 'docs/fact-checks/cited-lesson.md';
/** The registry's glob keys reports by their path from src/content. */
const GLOB = '../../docs/fact-checks/cited-lesson.md';
const gate = (raw: string | undefined) => checkFactChecks([lesson()], raw === undefined ? {} : { [GLOB]: raw }, FIXTURE_SOURCES);
const firstKey = () => sheet().items[0]!.key;

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
