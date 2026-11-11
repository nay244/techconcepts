import { describe, expect, test, vi } from 'vitest';
import { validateLesson } from '../define';
import type { Lesson } from '../schema';
import { FIXTURE_SOURCES, makeCitedLesson } from '../test-fixtures';
import { CANARY_SLUG, type FactCheckDeps, canaryReportPath, canaryRecheckPath, runFactCheck } from './cli';
import { itemsToJudge } from './recheck';
import { parseRecheck, parseReport } from './report';
import { claimSheet, itemHashes } from './sheet';
import { recheckReportFor, recordedReportFor, stampedReportFor, type LooseHeader } from './test-helpers';

vi.mock('../../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../test-fixtures')).FIXTURE_PARTS }));

// G4: the commands --stamp, --recheck, --recheck --quotes <folder> and --recheck --check.

const lessonA = (): Lesson => validateLesson(makeCitedLesson(), FIXTURE_SOURCES);
const unit = (l: Lesson) => l.units[0]!;
const reword = (l: Lesson) => { unit(l).learn.facts[2]!.value = 'A single device on the local network'; };
const SLUG = lessonA().slug;
const FULL = `docs/fact-checks/${SLUG}.md`;
const RE = `docs/fact-checks/${SLUG}.recheck.md`;
const sheetA = () => claimSheet(lessonA(), FIXTURE_SOURCES);
const lessonB = (edit: (l: Lesson) => void = reword): Lesson => { const l = lessonA(); edit(l); return l; };
const sheetB = (edit?: (l: Lesson) => void) => claimSheet(lessonB(edit), FIXTURE_SOURCES);

/** The commands with `lesson` as the only lesson and `files` as the only files; what is written is collected. */
function setup(files: Record<string, string | undefined>, lesson: Lesson = lessonB(), more: Partial<FactCheckDeps> = {}) {
  const written: Record<string, string> = {};
  const folder = [
    { name: 'rfc-example.txt', text: 'Some Filler words. here' },
    { name: 'vendor-example.txt', text: 'Filler words.' },
  ];
  const deps: FactCheckDeps = {
    getLesson: async (slug) => (slug === SLUG ? lesson : undefined),
    sources: FIXTURE_SOURCES,
    readFile: (path) => (Object.hasOwn(files, path) ? files[path] : undefined),
    loadCanary: async () => undefined,
    readFolder: (dir) => (dir === 'tmp' ? folder : undefined),
    writeFile: (to, text) => void (written[to] = text),
    today: () => '2026-11-11',
    ...more,
  };
  return { deps, written };
}
const full = (edit?: (h: LooseHeader) => void) => stampedReportFor(sheetA(), edit);
const judgedBy = (fullRaw: string, sheet = sheetB()) => itemsToJudge(parseReport(fullRaw).header!.items!, sheet).judge;
const recheck = (fullRaw = full(), edit?: (h: LooseHeader) => void, sheet = sheetB()) => recheckReportFor(sheet, sheetA().hash, judgedBy(fullRaw, sheet), edit);

describe('--stamp', () => {
  const plain = () => recordedReportFor(sheetB());

  test('stamp 1: it writes the items record into a report whose hash is the sheet\'s hash, and nothing else changes', async () => {
    const { deps, written } = setup({ [FULL]: plain() });
    const run = await runFactCheck([SLUG, '--stamp'], deps);
    expect(run).toEqual({ code: 0, out: `Stamped: the items record (${sheetB().items.length} items) is written to ${FULL}` });
    expect(Object.keys(written)).toEqual([FULL]);
    expect(parseReport(written[FULL]!).header!.items).toEqual(itemHashes(sheetB()));
    expect(written[FULL]!.replace(/,\n {2}"items": \{[\s\S]*?\n {2}\}(?=\n\})/, '')).toBe(plain());
  });

  test('stamp 2: it refuses unless the report\'s hash is the sheet\'s hash now, and says what to do', async () => {
    const { deps, written } = setup({ [FULL]: full() });
    const run = await runFactCheck([SLUG, '--stamp'], deps);
    expect(run.code).toBe(1);
    expect(run.out).toContain(`${FULL}: the lesson has changed since it was checked`);
    expect(run.out).toContain('at the commit it was checked on');
    expect(run.out).toContain('full check');
    expect(written).toEqual({});
  });

  test('stamp 3: no report, an unreadable report and another lesson\'s report are refused', async () => {
    const none = await runFactCheck([SLUG, '--stamp'], setup({}).deps);
    expect(none.code).toBe(1);
    expect(none.out).toContain('no fact-check report');
    const bad = await runFactCheck([SLUG, '--stamp'], setup({ [FULL]: '# nothing' }).deps);
    expect(bad.out).toContain('cannot be read');
    const other = await runFactCheck([SLUG, '--stamp'], setup({ [FULL]: recordedReportFor(sheetB(), (h) => { h.slug = 'other'; }) }).deps);
    expect(other.out).toContain('is the report for "other"');
  });

  test('stamp 4: it takes no other flag', async () => {
    const { deps } = setup({ [FULL]: plain() });
    for (const args of [['--stamp', '--check'], ['--stamp', '--recheck'], ['--stamp', '--quotes', 'tmp']]) {
      expect((await runFactCheck([SLUG, ...args], deps)).out, args.join(' ')).toContain('Usage:');
    }
  });

  test('stamp 5: it needs to write, a stamped report stamps to the same text, and a legacy lesson is refused', async () => {
    const { deps: d } = setup({ [FULL]: plain() });
    const { writeFile: _, ...noWriter } = d;
    expect((await runFactCheck([SLUG, '--stamp'], noWriter)).code).toBe(1);
    const again = setup({ [FULL]: stampedReportFor(sheetB()) });
    expect((await runFactCheck([SLUG, '--stamp'], again.deps)).code).toBe(0);
    expect(again.written[FULL]).toBe(stampedReportFor(sheetB()));
    const legacy = { ...lessonB(), origin: 'legacy' } as unknown as Lesson;
    expect((await runFactCheck([SLUG, '--stamp'], setup({ [FULL]: plain() }, legacy).deps)).out).toContain('legacy');
  });
});

describe('--recheck prints the re-check sheet', () => {
  test('recheck 1: the sheet, the lesson\'s hash, the full report\'s hash as base, and the path to write', async () => {
    const { deps } = setup({ [FULL]: full() });
    const run = await runFactCheck([SLUG, '--recheck'], deps);
    expect(run.code).toBe(0);
    expect(run.out).toContain(`Hash: \`${sheetB().hash}\``);
    expect(run.out).toContain(`Base: \`${sheetA().hash}\``);
    expect(run.out).toContain(`Write your report to: ${RE}`);
    for (const key of judgedBy(full())) expect(run.out).toContain(`### ${key}`);
    expect(run.out).toContain('Context (no verdict)');
  });

  test('recheck 2: it refuses when there is no full report, and says to run a full check', async () => {
    const run = await runFactCheck([SLUG, '--recheck'], setup({}).deps);
    expect(run.code).toBe(1);
    expect(run.out).toContain(`no full fact-check report at ${FULL}`);
    expect(run.out).toContain('run the fact-checker');
  });

  test('recheck 3: it refuses when the full report has no items record, and says to stamp it at the commit it was checked on', async () => {
    const noItems = recordedReportFor(sheetA());
    const run = await runFactCheck([SLUG, '--recheck'], setup({ [FULL]: noItems }).deps);
    expect(run.code).toBe(1);
    expect(run.out).toContain('has no items record');
    expect(run.out).toContain(`npm run fact-check -- ${SLUG} --stamp`);
    expect(run.out).toContain('at the commit it was checked on');
    expect(run.out).toContain('full check');
  });

  test('recheck 4: it refuses when the full check was not a near-pass: more than 3 items not passing', async () => {
    const keys = sheetA().items.slice(0, 4).map((i) => i.key);
    const run = await runFactCheck([SLUG, '--recheck'], setup({ [FULL]: full((h) => { for (const k of keys) h.verdicts[k] = '⚠️'; }) }).deps);
    expect(run.code).toBe(1);
    expect(run.out).toContain('was not a near-pass');
    expect(run.out).toContain('4 items did not pass');
    expect(run.out).toContain('run a full check');
  });

  test('recheck 5: it refuses when any item is wrong (❌), however few did not pass', async () => {
    const run = await runFactCheck([SLUG, '--recheck'], setup({ [FULL]: full((h) => { h.verdicts.title = '❌'; }) }).deps);
    expect(run.code).toBe(1);
    expect(run.out).toContain('was not a near-pass');
    expect(run.out).toContain('1 wrong (❌)');
  });

  test('recheck 6: it refuses when more than 12 items would be judged, and says how many', async () => {
    const many = (l: Lesson) => { for (const t of unit(l).learn.terms) t.idea += '!'; for (const f of unit(l).learn.facts) f.value += '!'; for (const x of unit(l).learn.lead) x.text += '!'; unit(l).learn.why[0]!.text += '!'; };
    const n = itemsToJudge(itemHashes(sheetA()), sheetB(many)).judge.length;
    expect(n).toBeGreaterThan(12);
    const run = await runFactCheck([SLUG, '--recheck'], setup({ [FULL]: full() }, lessonB(many)).deps);
    expect(run.code).toBe(1);
    expect(run.out).toContain(`${n} items to judge, more than 12`);
    expect(run.out).toContain('run a full check');
  });

  test('recheck 7: it refuses when the lesson\'s limit overrides changed', async () => {
    const run = await runFactCheck([SLUG, '--recheck'], setup({ [FULL]: full() }, lessonB((l) => { reword(l); l.overrides = [{ limit: 'steps' as const, max: 12, reason: 'Two units are one idea.' }]; })).deps);
    expect(run.code).toBe(1);
    expect(run.out).toContain('limit overrides');
    expect(run.out).toContain('run a full check');
  });

  test('recheck 8: it refuses when nothing changed: the full report\'s hash is the sheet\'s hash', async () => {
    const run = await runFactCheck([SLUG, '--recheck'], setup({ [FULL]: stampedReportFor(sheetB()) }).deps);
    expect(run.code).toBe(1);
    expect(run.out).toContain('Nothing changed');
    expect(run.out).toContain(`npm run fact-check -- ${SLUG} --check`);
  });

  test('recheck 9: an unreadable full report, or another lesson\'s, is named', async () => {
    expect((await runFactCheck([SLUG, '--recheck'], setup({ [FULL]: '# nothing' }).deps)).out).toContain('cannot be read');
    expect((await runFactCheck([SLUG, '--recheck'], setup({ [FULL]: full((h) => { h.slug = 'other'; }) }).deps)).out).toContain('is the report for "other"');
  });

  test('recheck 10: a lesson that changed only by an item taken out has nothing to judge, and the sheet says so', async () => {
    const cut = (l: Lesson) => { unit(l).learn.terms.splice(1, 1); };
    const run = await runFactCheck([SLUG, '--recheck'], setup({ [FULL]: full() }, lessonB(cut)).deps);
    expect(run.code).toBe(0);
    expect(run.out).toContain('No item changed');
    expect(run.out).toContain(`Write your report to: ${RE}`);
  });
});

describe('--recheck --quotes <folder>', () => {
  test('recheck quotes 1: it writes its record into the re-check report, and says so', async () => {
    const raw = recheck(full(), (h) => { delete h.quotes; });
    const { deps, written } = setup({ [FULL]: full(), [RE]: raw });
    const run = await runFactCheck([SLUG, '--recheck', '--quotes', 'tmp'], deps);
    expect(run).toEqual({ code: 0, out: `Quotes OK: 1 quotes in 1 sources; record written to ${RE}` });
    expect(Object.keys(written)).toEqual([RE]);
    expect(parseRecheck(written[RE]!).header!.quotes).toMatchObject({ checked: '2026-11-11', count: 1 });
    expect(written[RE]).not.toContain('"items"');
  });

  test('recheck quotes 2: a quote under a key it did not judge is refused, and nothing is written', async () => {
    const s = sheetB();
    const other = s.items.find((i) => i.cite.length > 0 && !judgedBy(full()).includes(i.key))!;
    const raw = recheck(full(), (h) => { delete h.quotes; }) + `\n### ${other.key} — ✅\n\n- \`${other.cite[0]!.source}\` §${other.cite[0]!.section}\n  > Filler words.\n`;
    const { deps, written } = setup({ [FULL]: full(), [RE]: raw });
    const run = await runFactCheck([SLUG, '--recheck', '--quotes', 'tmp'], deps);
    expect(run.code).toBe(1);
    expect(run.out).toContain('not an item this re-check judged');
    expect(written).toEqual({});
  });

  test('recheck quotes 3: no re-check report, a missing folder and an unreadable report are named', async () => {
    expect((await runFactCheck([SLUG, '--recheck', '--quotes', 'tmp'], setup({ [FULL]: full() }).deps)).out).toContain(`no re-check report at ${RE}`);
    expect((await runFactCheck([SLUG, '--recheck', '--quotes', 'nowhere'], setup({ [FULL]: full(), [RE]: recheck() }).deps)).out).toBe('No folder "nowhere".');
    expect((await runFactCheck([SLUG, '--recheck', '--quotes', 'tmp'], setup({ [FULL]: full(), [RE]: '# nothing' }).deps)).out).toContain('it has no header');
  });

  test('recheck quotes 4: a quote not in its source is not found, as in a full report', async () => {
    const { deps, written } = setup({ [FULL]: full(), [RE]: recheck(full(), (h) => { delete h.quotes; }) }, lessonB(), { readFolder: () => [{ name: 'rfc-example.txt', text: 'Nothing' }, { name: 'vendor-example.txt', text: 'Nothing' }] });
    const run = await runFactCheck([SLUG, '--recheck', '--quotes', 'tmp'], deps);
    expect(run.out).toContain('is not found in rfc-example.txt');
    expect(written).toEqual({});
  });

  test('recheck quotes 5: it needs a folder, and takes no --check or --stamp with it', async () => {
    const { deps } = setup({});
    for (const args of [['--recheck', '--quotes'], ['--recheck', '--quotes', 'tmp', '--check'], ['--recheck', '--quotes', 'tmp', '--stamp']]) {
      expect((await runFactCheck([SLUG, ...args], deps)).out, args.join(' ')).toContain('Usage:');
    }
  });
});

describe('--recheck --check', () => {
  test('recheck check 1: a passing pair prints Report OK, naming both files', async () => {
    const run = await runFactCheck([SLUG, '--recheck', '--check'], setup({ [FULL]: full(), [RE]: recheck() }).deps);
    expect(run).toEqual({ code: 0, out: `Report OK: ${FULL} and ${RE}` });
  });

  test('recheck check 2: a failing pair prints every problem, one per line', async () => {
    const raw = recheck(full(), (h) => { h.verdicts[Object.keys(h.verdicts)[0]!] = '⚠️'; h.sources = []; });
    const run = await runFactCheck([SLUG, '--recheck', '--check'], setup({ [FULL]: full(), [RE]: raw }).deps);
    expect(run.code).toBe(1);
    expect(run.out.split('\n')).toEqual([expect.stringContaining('did not pass'), expect.stringContaining('does not say whether source')]);
  });

  test('recheck check 3: no re-check report fails, and says to make one', async () => {
    const run = await runFactCheck([SLUG, '--recheck', '--check'], setup({ [FULL]: full() }).deps);
    expect(run.code).toBe(1);
    expect(run.out).toContain(`no re-check report at ${RE}`);
  });

  test('recheck check 4: a re-check beside a full report that is current is refused', async () => {
    const run = await runFactCheck([SLUG, '--recheck', '--check'], setup({ [FULL]: stampedReportFor(sheetB()), [RE]: recheck() }).deps);
    expect(run.code).toBe(1);
    expect(run.out).toContain('sits beside a full report that is current');
  });

  test('recheck check 5: no full report fails', async () => {
    const run = await runFactCheck([SLUG, '--recheck', '--check'], setup({ [RE]: recheck() }).deps);
    expect(run.code).toBe(1);
    expect(run.out).toContain('no fact-check report');
  });
});

describe('the canary', () => {
  test('canary 1: --recheck works for the canary slug, with the canary\'s own folder for both files', async () => {
    const lesson = { ...lessonB(), slug: CANARY_SLUG };
    const base = { ...lessonA(), slug: CANARY_SLUG };
    const a = claimSheet(base, FIXTURE_SOURCES);
    const raw = stampedReportFor(a);
    const { deps } = setup({ [canaryReportPath]: raw }, lesson, { sources: {}, loadCanary: async () => ({ lesson, sources: FIXTURE_SOURCES }) });
    const run = await runFactCheck([CANARY_SLUG, '--recheck'], deps);
    expect(run.code).toBe(0);
    expect(canaryRecheckPath).toBe('docs/fact-checks/canary/fact-check-canary.recheck.md');
    expect(run.out).toContain(`Write your report to: ${canaryRecheckPath}`);
    expect(run.out).toContain(`Base: \`${a.hash}\``);
  });

  test('canary 2: --recheck --check reads the canary\'s files', async () => {
    const lesson = { ...lessonB(), slug: CANARY_SLUG };
    const a = claimSheet({ ...lessonA(), slug: CANARY_SLUG }, FIXTURE_SOURCES);
    const b = claimSheet(lesson, FIXTURE_SOURCES);
    const fullRaw = stampedReportFor(a);
    const re = recheckReportFor(b, a.hash, itemsToJudge(itemHashes(a), b).judge);
    const { deps } = setup({ [canaryReportPath]: fullRaw, [canaryRecheckPath]: re }, lesson, { loadCanary: async () => ({ lesson, sources: FIXTURE_SOURCES }) });
    expect(await runFactCheck([CANARY_SLUG, '--recheck', '--check'], deps)).toEqual({ code: 0, out: `Report OK: ${canaryReportPath} and ${canaryRecheckPath}` });
  });
});

describe('the quote check on a full report says what it did about the items record', () => {
  const quoting = () => recordedReportFor(sheetB(), (h) => { delete h.quotes; });

  test('quote line 1: when the report\'s hash is the sheet\'s, the line says the items record was written, and the report has it', async () => {
    const { deps, written } = setup({ [FULL]: quoting() });
    const run = await runFactCheck([SLUG, '--quotes', 'tmp'], deps);
    const count = sheetB().items.filter((i) => i.cite.length > 0).length;
    expect(run).toEqual({ code: 0, out: `Quotes OK: ${count} quotes in 2 sources; record written to ${FULL}, with the items record (${sheetB().items.length} items)` });
    expect(parseReport(written[FULL]!).header!.items).toEqual(itemHashes(sheetB()));
  });

  test('quote line 2: when it is not, the line says there is no items record, and why', async () => {
    const stale = recordedReportFor(sheetB(), (h) => { delete h.quotes; h.hash = 'f'.repeat(64); });
    const { deps, written } = setup({ [FULL]: stale });
    const run = await runFactCheck([SLUG, '--quotes', 'tmp'], deps);
    expect(run.code).toBe(0);
    expect(run.out).toContain('no items record: the report\'s hash is not the lesson\'s');
    expect(parseReport(written[FULL]!).header!.items).toBeUndefined();
  });
});
