import type { Lesson } from '../schema';
import { SOURCES, type SourceRegistry } from '../sources';
import { checkPair, checkReport, reportPath } from './gate';
import { pageText } from './pagetext';
import { checkQuotes, stampItems, type SourceFile } from './quotecheck';
import { parseReport } from './report';
import { itemsToJudge, nearPass, recheckMessages, recheckPath, renderRecheck, RECHECK_MAX_ITEMS } from './recheck';
import { claimSheet, itemHashes, limitsHash, renderSheet, type ClaimSheet } from './sheet';

/**
 * `npm run fact-check -- <slug>` prints a lesson's claim sheet for the fact-checker, `-- <slug> --check` checks the
 * report it wrote (fact-checker design §6, §8), and `-- <slug> --quotes <folder>` looks for every passage the report
 * quotes in the source files saved in the folder, and writes the record into the report when all are found (and the
 * items record, when the report's hash is the sheet's). `-- <slug> --stamp` writes only the items record, for a report
 * that predates it. The targeted re-check (docs/content-model.md §8) has its own forms: `-- <slug> --recheck` prints the
 * re-check sheet, and `--recheck --quotes <folder>` and `--recheck --check` do the same for the re-check report as
 * the plain forms do for the full one. `scripts/fact-check.mjs` runs this module through Vite.
 *
 * The real lessons are read here without the registry: the registry runs the build gate when it loads, and the gate
 * refuses a cited lesson that has no report yet, so the registry cannot hand over the very lesson that needs one. Only
 * the asked-for lesson's file is loaded, so a lesson still being written cannot stop another from being checked.
 * The report files are read the same way, by glob, so this module needs no Node types.
 */

/** The canary lesson (Task 6): real sources, planted faults, never on the site, and never read by the build gate. */
export const CANARY_SLUG = 'fact-check-canary';
export const canaryReportPath = 'docs/fact-checks/canary/fact-check-canary.md';
export const canaryRecheckPath = 'docs/fact-checks/canary/fact-check-canary.recheck.md';

export interface FactCheckDeps {
  getLesson(slug: string): Promise<Lesson | undefined>;
  sources: SourceRegistry;
  /** A file's text, by its path from the repository root; `undefined` when there is no such file. */
  readFile(path: string): string | undefined;
  loadCanary(): Promise<{ lesson: Lesson; sources: SourceRegistry } | undefined>;
  /** The files in a folder, with their text; `undefined` when there is no such folder. Only the script can read one. */
  readFolder?(folder: string): SourceFile[] | undefined;
  /** Writes a file, by its path from the repository root. Only the script can write one. */
  writeFile?(path: string, text: string): void;
  /** Today, as YYYY-MM-DD. */
  today?(): string;
}

const USAGE = [
  'Usage: npm run fact-check -- <slug> [--check | --quotes <folder>]',
  '       npm run fact-check -- <slug> --stamp',
  '       npm run fact-check -- <slug> --recheck [--check | --quotes <folder>]',
].join('\n');

const localDay = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

/** Glob keys are paths from this file; the rest of the tooling names files by their path from the repository root. */
const fromRoot = (globbed: Record<string, string>, prefix: string): Record<string, string> =>
  Object.fromEntries(Object.entries(globbed).map(([path, text]) => [path.slice(prefix.length), text]));

const lessonModules = import.meta.glob<Lesson>(['../lessons/*.ts', '!../lessons/*.test.ts'], { import: 'default' });
const files = fromRoot(import.meta.glob<string>('../../../docs/fact-checks/**/*.md', { query: '?raw', import: 'default', eager: true }), '../../../');
const canaryModule = import.meta.glob<{ CANARY_LESSON: Lesson; CANARY_SOURCES: SourceRegistry }>('./canary/lesson.ts');

export const DEFAULT_DEPS: FactCheckDeps = {
  getLesson: async (slug) => {
    const path = `../lessons/${slug}.ts`;
    return Object.hasOwn(lessonModules, path) ? lessonModules[path]!() : undefined;
  },
  sources: SOURCES,
  readFile: (path) => (Object.hasOwn(files, path) ? files[path] : undefined),
  loadCanary: async () => {
    const load = canaryModule['./canary/lesson.ts'];
    if (load === undefined) return undefined;
    const { CANARY_LESSON, CANARY_SOURCES } = await load();
    return { lesson: CANARY_LESSON, sources: CANARY_SOURCES };
  },
};

export async function runFactCheck(args: string[], deps: FactCheckDeps = DEFAULT_DEPS): Promise<{ code: number; out: string }> {
  const check = args.includes('--check');
  const stamp = args.includes('--stamp');
  const recheck = args.includes('--recheck');
  const at = args.indexOf('--quotes');
  const folder = at < 0 ? undefined : args[at + 1];
  if (at >= 0 && (check || folder === undefined || folder.startsWith('-'))) return { code: 1, out: USAGE };
  if (stamp && (check || recheck || at >= 0)) return { code: 1, out: USAGE };
  const rest = args.filter((a, i) => a !== '--check' && a !== '--quotes' && a !== '--stamp' && a !== '--recheck' && (at < 0 || i !== at + 1));
  const [slug] = rest;
  if (slug === undefined || rest.length !== 1 || slug.startsWith('-')) return { code: 1, out: USAGE };

  let lesson: Lesson;
  let sources = deps.sources;
  let path = reportPath(slug);
  let rePath = recheckPath(slug);
  if (slug === CANARY_SLUG) {
    const canary = await deps.loadCanary();
    if (canary === undefined) return { code: 1, out: 'The canary lesson does not exist yet.' };
    ({ lesson, sources } = canary);
    path = canaryReportPath;
    rePath = canaryRecheckPath;
  } else {
    const found = await deps.getLesson(slug);
    if (found === undefined) return { code: 1, out: `No lesson "${slug}".` };
    lesson = found;
  }

  const sheet = claimSheet(lesson, sources);
  if (stamp) return stampReport(deps, sheet, path);
  if (recheck && !check && folder === undefined) return printRecheck(deps, sheet, path, rePath);
  if (recheck && check) {
    const reRaw = deps.readFile(rePath);
    if (reRaw === undefined) return { code: 1, out: `no re-check report at ${rePath}; run the fact-checker on the lesson as a re-check (docs/content-model.md §8).` };
    const issues = checkPair(sheet, deps.readFile(path), reRaw, path, rePath);
    return issues.length === 0 ? { code: 0, out: `Report OK: ${path} and ${rePath}` } : { code: 1, out: issues.join('\n') };
  }
  if (folder !== undefined) {
    const { readFolder, writeFile } = deps;
    if (readFolder === undefined || writeFile === undefined) return { code: 1, out: 'The quote check needs to read and write files; run it with npm run fact-check.' };
    const found = readFolder(folder);
    if (found === undefined) return { code: 1, out: `No folder "${folder}".` };
    const where = recheck ? rePath : path;
    const raw = deps.readFile(where);
    if (raw === undefined) return { code: 1, out: recheck ? `no re-check report at ${rePath}; write it first (docs/content-model.md §8).` : checkReport(sheet, raw, path).join('\n') };
    const result = checkQuotes({ raw, sheet, files: found, today: (deps.today ?? localDay)(), pageText, recheck });
    if (result.report === undefined) return { code: 1, out: result.issues.join('\n') };
    writeFile(where, result.report);
    const done = `Quotes OK: ${result.record.count} quotes in ${Object.keys(result.record.files).length} sources; record written to ${where}`;
    if (recheck) return { code: 0, out: done };
    return {
      code: 0,
      out: result.items === undefined ? `${done}, but no items record: the report's hash is not the lesson's, so run --stamp at the commit it was checked on if a re-check may follow` : `${done}, with the items record (${Object.keys(result.items).length} items) and the limits hash`,
    };
  }
  if (!check) return { code: 0, out: `${renderSheet(sheet)}\nWrite your report to: ${path}` };
  const issues = checkReport(sheet, deps.readFile(path), path);
  return issues.length === 0 ? { code: 0, out: `Report OK: ${path}` } : { code: 1, out: issues.join('\n') };
}

/** `--stamp`: writes the items record into a full report whose hash is the sheet's hash, and changes nothing else. */
function stampReport(deps: FactCheckDeps, sheet: ClaimSheet, path: string): { code: number; out: string } {
  if (deps.writeFile === undefined) return { code: 1, out: 'Stamping needs to write a file; run it with npm run fact-check.' };
  const raw = deps.readFile(path);
  if (raw === undefined) return { code: 1, out: checkReport(sheet, raw, path).join('\n') };
  const { header, issues } = parseReport(raw);
  if (header === undefined) return { code: 1, out: issues.map((i) => `${path}: cannot be read: ${i}`).join('\n') };
  if (header.slug !== sheet.slug) return { code: 1, out: `${path}: is the report for "${header.slug}", not "${sheet.slug}"; fix its slug or its file name.` };
  if (header.hash !== sheet.hash) {
    return {
      code: 1,
      out: `${path}: the lesson has changed since it was checked (report ${header.hash.slice(0, 12)}…, lesson ${sheet.hash.slice(0, 12)}…); the items record describes the lesson as it was checked, so run --stamp at the commit it was checked on, or run a full check (docs/content-model.md §8).`,
    };
  }
  const items = itemHashes(sheet);
  deps.writeFile(path, stampItems(raw, items, limitsHash(sheet.overrides)));
  return { code: 0, out: `Stamped: the items record (${Object.keys(items).length} items) and the limits hash are written to ${path}` };
}

/** `--recheck`: the re-check sheet, or why there can be none. */
function printRecheck(deps: FactCheckDeps, sheet: ClaimSheet, path: string, rePath: string): { code: number; out: string } {
  const refuse = (out: string) => ({ code: 1, out });
  const raw = deps.readFile(path);
  if (raw === undefined) return refuse(`no full fact-check report at ${path}; a re-check is made against a full check, so run the fact-checker on the lesson first (docs/content-model.md §8).`);
  const { header, issues } = parseReport(raw);
  if (header === undefined) return refuse(issues.map((i) => `${path}: cannot be read: ${i}`).join('\n'));
  if (header.slug !== sheet.slug) return refuse(`${path}: is the report for "${header.slug}", not "${sheet.slug}"; fix its slug or its file name.`);
  if (header.items === undefined || header.limits === undefined) return refuse(recheckMessages.noItems(path, sheet.slug));
  const near = nearPass(header.verdicts);
  if (!near.ok) return refuse(recheckMessages.notNearPass(path, near));
  if (header.hash === sheet.hash) {
    return refuse(`Nothing changed since the full check (${path} has the lesson's hash); there is nothing to re-check. Check the report with npm run fact-check -- ${sheet.slug} --check.`);
  }
  if (header.limits !== limitsHash(sheet.overrides)) return refuse(recheckMessages.overrides(path, limitsHash(sheet.overrides), header.limits));
  const judging = itemsToJudge(header.items, sheet);
  if (judging.judge.length > RECHECK_MAX_ITEMS) return refuse(recheckMessages.tooMany(path, judging.judge.length));
  return { code: 0, out: renderRecheck(sheet, header.hash, judging, rePath) };
}
