import { describe, expect, test, vi } from 'vitest';
import { validateLesson } from '../define';
import type { Lesson } from '../schema';
import { FIXTURE_SOURCES, makeCitedLesson } from '../test-fixtures';
import { CANARY_SLUG, type FactCheckDeps, canaryReportPath, runFactCheck } from './cli';
import { keysNeedingQuotes } from './quotes';
import { parseReport } from './report';
import { claimSheet } from './sheet';
import { recordedReportFor, reportFor } from './test-helpers';

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
  expect(run.out).toContain('Usage: npm run fact-check -- <slug> [--check | --quotes <folder>]');
  expect((await runFactCheck([SLUG, '--fix'], deps())).out).toContain('Usage:');
  expect((await runFactCheck([SLUG, '--quotes'], deps())).out).toContain('Usage:');
  expect((await runFactCheck([SLUG, '--quotes', '--check'], deps())).out).toContain('Usage:');
  expect((await runFactCheck([SLUG, '--quotes', 'a', '--check'], deps())).out).toContain('Usage:');
});

test('printing a cited lesson gives its sheet and report path', async () => {
  const run = await runFactCheck([SLUG], deps());
  expect(run.code).toBe(0);
  expect(run.out).toContain(claimSheet(cited(), FIXTURE_SOURCES).hash);
  expect(run.out).toContain(`Write your report to: docs/fact-checks/${SLUG}.md`);
});

test('--check with a matching report passes, and with none fails', async () => {
  const path = `docs/fact-checks/${SLUG}.md`;
  const passing = recordedReportFor(claimSheet(cited(), FIXTURE_SOURCES));
  expect(await runFactCheck([SLUG, '--check'], deps({ [path]: passing }))).toEqual({ code: 0, out: `Report OK: ${path}` });
  const missing = await runFactCheck([SLUG, '--check'], deps());
  expect(missing.code).toBe(1);
  expect(missing.out).toContain('no fact-check report');
});

test('--check lists every issue, one per line', async () => {
  const path = `docs/fact-checks/${SLUG}.md`;
  const failing = recordedReportFor(claimSheet(cited(), FIXTURE_SOURCES), (h) => {
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

describe('--quotes <folder>', () => {
  const path = `docs/fact-checks/${SLUG}.md`;
  const sheet = () => claimSheet(cited(), FIXTURE_SOURCES);
  /** A passing report whose every cited item quotes its first citation with `Filler words.`. */
  const quoting = () => {
    const lines = keysNeedingQuotes(sheet()).flatMap((key) => {
      const c = sheet().items.find((i) => i.key === key)!.cite[0]!;
      return ['', `### ${key} — ✅`, '', `- \`${c.source}\` §${c.section}`, '  > Filler words.'];
    });
    return reportFor(sheet()) + lines.join('\n') + '\n';
  };
  const folder = [
    { name: 'rfc-example.txt', text: 'Some Filler words. here' },
    { name: 'vendor-example.html', text: '<p>Filler <b>words</b>.</p>' },
  ];
  /** Deps that serve `folder` at `dir`, collect what is written, and have a fixed date. */
  function quoteDeps(report: string | undefined, files = folder) {
    const written: Record<string, string> = {};
    return {
      written,
      deps: deps(report === undefined ? {} : { [path]: report }, {
        readFolder: (dir) => (dir === 'tmp' ? files : undefined),
        writeFile: (to, text) => void (written[to] = text),
        today: () => '2026-11-11',
      }),
    };
  }

  test('success writes the record (and the items record, as the report\'s hash is the sheet\'s) into the report and says so on one line', async () => {
    const { deps: d, written } = quoteDeps(quoting());
    const run = await runFactCheck([SLUG, '--quotes', 'tmp'], d);
    const count = keysNeedingQuotes(sheet()).length;
    expect(run).toEqual({ code: 0, out: `Quotes OK: ${count} quotes in 2 sources; record written to ${path}, with the items record (${sheet().items.length} items) and the limits hash` });
    expect(Object.keys(written)).toEqual([path]);
    expect(parseReport(written[path]!).header!.quotes).toMatchObject({ checked: '2026-11-11', count });
  });

  test('a failure lists the problems, exits 1, and writes nothing', async () => {
    const { deps: d, written } = quoteDeps(quoting(), [{ name: 'rfc-example.txt', text: 'Nothing here' }, folder[1]!]);
    const run = await runFactCheck([SLUG, '--quotes', 'tmp'], d);
    expect(run.code).toBe(1);
    expect(run.out).toContain('is not found in rfc-example.txt');
    expect(written).toEqual({});
  });

  test('a missing folder, a missing report and a missing reader fail', async () => {
    expect(await runFactCheck([SLUG, '--quotes', 'nowhere'], quoteDeps(quoting()).deps)).toEqual({ code: 1, out: 'No folder "nowhere".' });
    const none = await runFactCheck([SLUG, '--quotes', 'tmp'], quoteDeps(undefined).deps);
    expect(none.code).toBe(1);
    expect(none.out).toContain('no fact-check report');
    expect((await runFactCheck([SLUG, '--quotes', 'tmp'], deps())).code).toBe(1);
  });

  test('a legacy lesson is refused', async () => {
    const legacy = { ...cited(), origin: 'legacy' } as unknown as Lesson;
    const { deps: d } = quoteDeps(quoting());
    const run = await runFactCheck([SLUG, '--quotes', 'tmp'], { ...d, getLesson: async () => legacy });
    expect(run.code).toBe(1);
    expect(run.out).toContain('legacy');
  });
});
