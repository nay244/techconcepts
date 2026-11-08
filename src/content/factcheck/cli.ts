import type { Lesson } from '../schema';
import { SOURCES, type SourceRegistry } from '../sources';
import { checkReport, reportPath } from './gate';
import { claimSheet, renderSheet } from './sheet';

/**
 * `npm run fact-check -- <slug>` prints a lesson's claim sheet for the fact-checker, and `-- <slug> --check` checks the
 * report it wrote (fact-checker design §6, §8). `scripts/fact-check.mjs` runs this module through Vite.
 *
 * The real lessons are read here without the registry: the registry runs the build gate when it loads, and the gate
 * refuses a cited lesson that has no report yet, so the registry cannot hand over the very lesson that needs one. Only
 * the asked-for lesson's file is loaded, so a lesson still being written cannot stop another from being checked.
 * The report files are read the same way, by glob, so this module needs no Node types.
 */

/** The canary lesson (Task 6): real sources, planted faults, never on the site, and never read by the build gate. */
export const CANARY_SLUG = 'fact-check-canary';
export const canaryReportPath = 'docs/fact-checks/canary/fact-check-canary.md';

export interface FactCheckDeps {
  getLesson(slug: string): Promise<Lesson | undefined>;
  sources: SourceRegistry;
  /** A file's text, by its path from the repository root; `undefined` when there is no such file. */
  readFile(path: string): string | undefined;
  loadCanary(): Promise<{ lesson: Lesson; sources: SourceRegistry } | undefined>;
}

const USAGE = 'Usage: npm run fact-check -- <slug> [--check]';

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
  const rest = args.filter((a) => a !== '--check');
  const [slug] = rest;
  if (slug === undefined || rest.length !== 1 || slug.startsWith('-')) return { code: 1, out: USAGE };

  let lesson: Lesson;
  let sources = deps.sources;
  let path = reportPath(slug);
  if (slug === CANARY_SLUG) {
    const canary = await deps.loadCanary();
    if (canary === undefined) return { code: 1, out: 'The canary lesson does not exist yet.' };
    ({ lesson, sources } = canary);
    path = canaryReportPath;
  } else {
    const found = await deps.getLesson(slug);
    if (found === undefined) return { code: 1, out: `No lesson "${slug}".` };
    if (found.origin === 'legacy') {
      return { code: 1, out: `"${slug}" is still on the legacy list; move it to the cited shape before checking it (docs/content-model.md §4).` };
    }
    lesson = found;
  }

  const sheet = claimSheet(lesson, sources);
  if (!check) return { code: 0, out: `${renderSheet(sheet)}\nWrite your report to: ${path}` };
  const issues = checkReport(sheet, deps.readFile(path), path);
  return issues.length === 0 ? { code: 0, out: `Report OK: ${path}` } : { code: 1, out: issues.join('\n') };
}
