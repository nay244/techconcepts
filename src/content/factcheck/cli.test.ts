import { expect, test, vi } from 'vitest';
import { validateLesson } from '../define';
import { FIXTURE_SOURCES, makeCitedLesson } from '../test-fixtures';
import { CANARY_SLUG, type FactCheckDeps, canaryReportPath, runFactCheck } from './cli';
import { claimSheet } from './sheet';
import { reportFor } from './test-helpers';

// The real FIGURE_PARTS is empty until each figure is built; the stand-in has the fixture's places and cues. Real lessons
// would fail against it, so the tests that read them are in cli.defaults.test.ts.
vi.mock('../../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../test-fixtures')).FIXTURE_PARTS }));

const cited = () => validateLesson(makeCitedLesson(), FIXTURE_SOURCES);
const SLUG = cited().slug;

/** The real commands, with the fixture lesson as the only lesson and `files` as the only files. */
function deps(files: Record<string, string> = {}, edit: Partial<FactCheckDeps> = {}): FactCheckDeps {
  return {
    getLesson: async (slug) => (slug === SLUG ? cited() : undefined),
    sources: FIXTURE_SOURCES,
    readFile: (path) => (Object.hasOwn(files, path) ? files[path] : undefined),
    loadCanary: async () => undefined,
    ...edit,
  };
}

test('an unknown slug fails', async () => {
  expect(await runFactCheck(['no-such-lesson'], deps())).toEqual({ code: 1, out: 'No lesson "no-such-lesson".' });
});

test('no arguments prints usage and fails', async () => {
  const run = await runFactCheck([], deps());
  expect(run.code).toBe(1);
  expect(run.out).toContain('Usage: npm run fact-check -- <slug> [--check]');
  expect((await runFactCheck([SLUG, '--fix'], deps())).out).toContain('Usage:');
});

test('printing a cited lesson gives its sheet and report path', async () => {
  const run = await runFactCheck([SLUG], deps());
  expect(run.code).toBe(0);
  expect(run.out).toContain(claimSheet(cited(), FIXTURE_SOURCES).hash);
  expect(run.out).toContain(`Write your report to: docs/fact-checks/${SLUG}.md`);
});

test('--check with a matching report passes, and with none fails', async () => {
  const path = `docs/fact-checks/${SLUG}.md`;
  const passing = reportFor(claimSheet(cited(), FIXTURE_SOURCES));
  expect(await runFactCheck([SLUG, '--check'], deps({ [path]: passing }))).toEqual({ code: 0, out: `Report OK: ${path}` });
  const missing = await runFactCheck([SLUG, '--check'], deps());
  expect(missing.code).toBe(1);
  expect(missing.out).toContain('no fact-check report');
});

test('--check lists every issue, one per line', async () => {
  const path = `docs/fact-checks/${SLUG}.md`;
  const failing = reportFor(claimSheet(cited(), FIXTURE_SOURCES), (h) => {
    h.verdicts[Object.keys(h.verdicts)[0]!] = '❌';
    h.sources[0]!.current = false;
  });
  const run = await runFactCheck([SLUG, '--check'], deps({ [path]: failing }));
  expect(run.code).toBe(1);
  expect(run.out.split('\n')).toEqual([expect.stringContaining('did not pass'), expect.stringContaining('is not current')]);
});

test('the canary before it exists fails', async () => {
  expect(await runFactCheck([CANARY_SLUG], deps())).toEqual({ code: 1, out: 'The canary lesson does not exist yet.' });
});

test('the canary is checked against its own sources and report path', async () => {
  const canary = { lesson: { ...cited(), slug: CANARY_SLUG }, sources: FIXTURE_SOURCES };
  const run = await runFactCheck([CANARY_SLUG], deps({}, { sources: {}, loadCanary: async () => canary }));
  expect(run.code).toBe(0);
  expect(run.out).toContain(`Write your report to: ${canaryReportPath}`);
  expect(run.out).toContain('`rfc-example`');
});
