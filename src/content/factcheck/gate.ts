import type { GlossaryGroup } from '../glossary-group';
import type { Lesson, Track } from '../schema';
import type { SourceRegistry } from '../sources';
import { keysMissingQuotes } from './quotecheck';
import { parseQuotes, quotesDigest, type QuoteMode } from './quotes';
import { parseRecheck, parseReport, type RecheckHeader, type ReportHeader } from './report';
import { itemsToJudge, matchBase, nearPass, recheckMessages, recheckPath, RECHECK_MAX_ITEMS } from './recheck';
import { claimSheet, groupSheet, isGroupSlug, limitsHash, type ClaimSheet } from './sheet';

/**
 * The build gate (fact-checker design §7): a lesson builds only with a current report in which every item passes.
 * Every issue names the report's path and says what to do.
 *
 * A lesson changed since its full check may carry a targeted re-check beside it (`recheck.ts`): the pair is read by
 * `checkPair`, and a lesson with no re-check file is read exactly as it always was.
 */

const AGAIN = 'run the fact-checker on it again (docs/content-model.md §8)';

/** What a message calls the thing a report is about: "lesson", or "group" for a glossary group (docs/glossary-path-spec.md, E7). */
const noun = (slug: string): string => (isGroupSlug(slug) ? 'group' : 'lesson');

/** "the lesson has changed since it was checked (report …, lesson …)", or the glossary group's form. Shared with the command's `--stamp`. */
export const changedSinceChecked = (path: string, sheet: ClaimSheet, report: string): string =>
  isGroupSlug(sheet.slug)
    ? `${path}: the glossary group "${sheet.slug.slice('glossary/'.length)}" has changed since it was checked (report ${report.slice(0, 12)}…, group ${sheet.hash.slice(0, 12)}…); ${AGAIN}.`
    : `${path}: the lesson has changed since it was checked (report ${report.slice(0, 12)}…, lesson ${sheet.hash.slice(0, 12)}…); ${AGAIN}.`;

/** Where a lesson's report lives: by slug, since a lesson is shared between tracks. */
export function reportPath(slug: string): string {
  return `docs/fact-checks/${slug}.md`;
}

/** What is wrong with one lesson's report, given its claim sheet; empty when the report is current and passes. */
export function checkReport(sheet: ClaimSheet, raw: string | undefined, path: string): string[] {
  if (raw === undefined) return [`${sheet.slug}: no fact-check report at ${path}; run the fact-checker on it (docs/content-model.md §8).`];
  const { header, issues } = parseReport(raw);
  if (header === undefined) return issues.map((i) => `${path}: cannot be read: ${i}`);
  if (header.slug !== sheet.slug) return [`${path}: is the report for "${header.slug}", not "${sheet.slug}"; fix its slug or its file name.`];
  if (header.hash !== sheet.hash) {
    return [changedSinceChecked(path, sheet, header.hash)];
  }
  const problems: string[] = [];
  const keys = new Set(sheet.items.map((i) => i.key));
  for (const key of keys) if (!Object.hasOwn(header.verdicts, key)) problems.push(`${path}: no verdict for ${key}; ${AGAIN}.`);
  for (const key of Object.keys(header.verdicts)) {
    if (!keys.has(key)) problems.push(`${path}: a verdict for ${key}, which the ${noun(sheet.slug)} does not have; ${AGAIN}.`);
  }
  const failed = Object.entries(header.verdicts).filter(([key, v]) => keys.has(key) && v !== '✅');
  if (failed.length > 0) {
    problems.push(`${path}: ${failed.length} item(s) did not pass: ${failed.map(([key, v]) => `${v} ${key}`).join('; ')}. Fix the ${noun(sheet.slug)}, then ${AGAIN}.`);
  }
  const checked = new Map(header.sources.map((s) => [s.id, s]));
  for (const s of sheet.sources) {
    const found = checked.get(s.id);
    if (found === undefined) problems.push(`${path}: does not say whether source "${s.id}" is current; ${AGAIN}.`);
    else if (!found.current) problems.push(`${path}: source "${s.id}" is not current${found.note ? ` (${found.note})` : ''}; cite its current version, then ${AGAIN}.`);
  }
  return [...problems, ...quoteProblems(sheet, raw, header, path)];
}

/**
 * What is wrong with a report's quotes: they read, the header's record says the quote check passed them, the record
 * still matches them, and every passing item with citations has one. The gate never reads a source, so it never
 * imports the quote check's page reader. `mode` says how the report is read (`QuoteMode`): a full report beside a
 * re-check is `recorded`, held only to its own record, since the lesson it was checked against is gone.
 */
function quoteProblems(sheet: ClaimSheet, raw: string, header: Pick<ReportHeader, 'checked' | 'quotes' | 'verdicts'> | RecheckHeader, path: string, mode: QuoteMode = 'full'): string[] {
  const parsed = parseQuotes(raw, sheet, mode);
  if (parsed.quotes === undefined) return parsed.issues.map((i) => `${path}: its quotes cannot be read: ${i}.`);
  const quotes = parsed.quotes;
  const run = `run npm run fact-check -- ${sheet.slug}${mode === 'recheck' ? ' --recheck' : ''} --quotes <folder of the sources> (docs/content-model.md §8)`;
  const record = header.quotes;
  if (record === undefined) return [`${path}: the quotes have not been confirmed against the sources (the header has no quotes record); ${run}.`];
  const problems: string[] = [];
  const digest = quotesDigest(quotes);
  if (record.digest !== digest) {
    problems.push(
      `${path}: a quote changed after the quote check last passed (the record has ${record.count} quote${record.count === 1 ? '' : 's'}, digest ${record.digest.slice(0, 12)}…; the report has ${quotes.length}, digest ${digest.slice(0, 12)}…); ${run} again.`,
    );
  } else if (record.count !== quotes.length) {
    problems.push(`${path}: the record's count (${record.count}) is not the number of quotes in the report (${quotes.length}); ${run} again.`);
  }
  const named = new Set(quotes.map((q) => q.source));
  const hashed = new Set(Object.keys(record.files));
  const missing = [...named].filter((id) => !hashed.has(id));
  const extra = [...hashed].filter((id) => !named.has(id));
  if (missing.length > 0 || extra.length > 0) {
    const parts = [
      ...(missing.length > 0 ? [`no file hash for ${missing.join(', ')}, which a quote names`] : []),
      ...(extra.length > 0 ? [`a file hash for ${extra.join(', ')}, which no quote names`] : []),
    ];
    problems.push(`${path}: the quote record's files do not match the sources the quotes name (${parts.join('; ')}); ${run} again.`);
  }
  if (record.checked < header.checked) {
    problems.push(`${path}: the quote check was last run on ${record.checked}, before the report was checked on ${header.checked}; ${run} again.`);
  }
  if (mode !== 'recorded') {
    const unquoted = keysMissingQuotes(sheet, header.verdicts, quotes);
    if (unquoted.length > 0) {
      problems.push(`${path}: ${unquoted.length} item(s) that pass have no quote: ${unquoted.join('; ')}. Each item with citations needs at least one; write them, then ${run}.`);
    }
  }
  return problems;
}

/**
 * What is wrong with a full report and the re-check beside it, given the claim sheet as it is now. The lesson has
 * changed since the full check, and the build accepts it only when (docs/content-model.md §8):
 * 1. the re-check belongs to this full report (`base`) and this sheet (`hash`);
 * 2. the full report has an `items` record with a `limits` hash, and was a near-pass;
 * 3. the re-check's verdict keys are exactly the items to judge (`itemsToJudge`), at most 12;
 * 4. every re-check verdict passes, and the full report's verdict passes for every item not re-checked;
 * 5. the lesson's limit overrides hash to the full report's `limits`;
 * 6. every source on the sheet is current: in the re-check's list when a re-checked item cites it, else in the full report's;
 * 7. the re-check's quotes can be read, sit under items it judged, and its quote record is right;
 * 8. the full report's own quote record still matches its quotes.
 * A re-check that does not belong (another `base`), or that sits beside a full report which is current, is refused.
 */
export function checkPair(sheet: ClaimSheet, fullRaw: string | undefined, recheckRaw: string, path: string, rePath: string): string[] {
  if (fullRaw === undefined) {
    return [...checkReport(sheet, undefined, path), `${rePath}: a re-check needs the full report it was made against, which is missing; ${AGAIN}.`];
  }
  const full = parseReport(fullRaw);
  if (full.header === undefined) return full.issues.map((i) => `${path}: cannot be read: ${i}`);
  const fh = full.header;
  if (fh.slug !== sheet.slug) return [`${path}: is the report for "${fh.slug}", not "${sheet.slug}"; fix its slug or its file name.`];
  if (fh.hash === sheet.hash) {
    return [`${rePath}: sits beside a full report that is current (${path}), so it is out of date and is refused; remove it.`, ...checkReport(sheet, fullRaw, path)];
  }
  const re = parseRecheck(recheckRaw);
  if (re.header === undefined) return re.issues.map((i) => `${rePath}: cannot be read: ${i}`);
  const rh = re.header;
  if (rh.slug !== sheet.slug) return [`${rePath}: is the re-check for "${rh.slug}", not "${sheet.slug}"; fix its slug or its file name.`];
  if (rh.base !== fh.hash) {
    return [
      `${rePath}: does not belong to ${path}: its base (${rh.base.slice(0, 12)}…) is not that report's hash (${fh.hash.slice(0, 12)}…); it was made against another full check, so remove it, or run the re-check again against this one.`,
    ];
  }
  if (rh.hash !== sheet.hash) return [recheckMessages.changedSince(rePath, rh.hash, sheet.hash, sheet.slug)];

  const problems: string[] = [];
  const keys = new Set(sheet.items.map((i) => i.key));
  const rechecked = new Set(Object.keys(rh.verdicts));

  // 2
  if (fh.items === undefined || fh.limits === undefined) problems.push(recheckMessages.noItems(path, sheet.slug));
  const near = nearPass(fh.verdicts);
  if (!near.ok) problems.push(recheckMessages.notNearPass(path, near, sheet.slug));
  // 3
  if (fh.items !== undefined) {
    const judge = itemsToJudge(fh.items, sheet).judge;
    for (const key of judge) if (!rechecked.has(key)) problems.push(`${rePath}: no verdict for ${key}, an item to judge; run the re-check again, against the same full check (docs/content-model.md §8).`);
    for (const key of rechecked) {
      if (!judge.includes(key)) {
        problems.push(`${rePath}: a verdict for ${key}, which is not an item to judge (it has not changed and traces to nothing that has); take it out, then run the --recheck commands again.`);
      }
    }
    if (judge.length > RECHECK_MAX_ITEMS) problems.push(recheckMessages.tooMany(rePath, judge.length));
  }
  // 4
  const failed = Object.entries(rh.verdicts).filter(([key, v]) => keys.has(key) && v !== '✅');
  if (failed.length > 0) {
    problems.push(`${rePath}: ${failed.length} item(s) did not pass: ${failed.map(([key, v]) => `${v} ${key}`).join('; ')}. Fix the ${noun(sheet.slug)}, then run the re-check again, against the same full check (docs/content-model.md §8).`);
  }
  // An item that moved (an inserted part shifted its index) is judged in the full report under the key it had there.
  const was = fh.items === undefined ? new Map<string, string>() : matchBase(fh.items, sheet);
  for (const key of keys) {
    if (rechecked.has(key)) continue;
    const there = was.get(key) ?? key;
    const named = there === key ? key : `${key} (${there} in the full report)`;
    if (!Object.hasOwn(fh.verdicts, there)) problems.push(`${path}: no verdict for ${named}; ${AGAIN}.`);
    else if (fh.verdicts[there] !== '✅') {
      problems.push(`${path}: ${named} did not pass the full check (${fh.verdicts[there]}) and has not changed since; fix it, then run the re-check again (docs/content-model.md §8).`);
    }
  }
  // 5
  if (fh.limits !== undefined && fh.limits !== limitsHash(sheet.overrides)) problems.push(recheckMessages.overrides(rePath, limitsHash(sheet.overrides), fh.limits, sheet.slug));
  // 6
  const reChecked = new Map(rh.sources.map((s) => [s.id, s]));
  const fullChecked = new Map(fh.sources.map((s) => [s.id, s]));
  for (const s of sheet.sources) {
    const viaRecheck = sheet.items.some((item) => rechecked.has(item.key) && item.cite.some((c) => c.source === s.id));
    const where = viaRecheck ? rePath : path;
    const found = (viaRecheck ? reChecked : fullChecked).get(s.id);
    const again = viaRecheck ? 'run the re-check again, against the same full check (docs/content-model.md §8)' : AGAIN;
    if (found === undefined) problems.push(`${where}: does not say whether source "${s.id}" is current; ${again}.`);
    else if (!found.current) problems.push(`${where}: source "${s.id}" is not current${found.note ? ` (${found.note})` : ''}; cite its current version, then ${again}.`);
  }
  // 7 and 8
  return [...problems, ...quoteProblems(sheet, recheckRaw, rh, rePath, 'recheck'), ...quoteProblems(sheet, fullRaw, fh, path, 'recorded')];
}

/**
 * The day a lesson passed its fact check: the full report's, or, when a re-check beside it makes the pair pass, the later
 * of the two. `null` when there is no readable full report.
 */
export function checkedDate(sheet: ClaimSheet, fullRaw: string | undefined, recheckRaw: string | undefined): string | null {
  const full = fullRaw === undefined ? undefined : parseReport(fullRaw).header;
  if (full === undefined) return null;
  if (recheckRaw === undefined || checkPair(sheet, fullRaw, recheckRaw, reportPath(sheet.slug), recheckPath(sheet.slug)).length > 0) return full.checked;
  const re = parseRecheck(recheckRaw).header!;
  return re.checked > full.checked ? re.checked : full.checked;
}

/** The slug a report's path names: its file name without `.md`, or without `.recheck.md` for a re-check. */
const slugOf = (path: string, suffix = '.md'): string => {
  const name = path.slice(path.lastIndexOf('/') + 1);
  return name.endsWith(suffix) ? name.slice(0, -suffix.length) : name;
};

/**
 * Every issue with the fact checks of these lessons. `reports` is the registry's glob of `docs/fact-checks/*.md`, and
 * `rechecks` its glob of `docs/fact-checks/*.recheck.md`, each keyed by path; a report or a re-check no lesson
 * owns is an issue too. A lesson with no re-check is read as it always was.
 */
export function checkFactChecks(lessons: readonly Lesson[], reports: Record<string, string>, sources: SourceRegistry, rechecks: Record<string, string> = {}): string[] {
  const bySlug = new Map(Object.entries(reports).map(([path, raw]) => [slugOf(path), raw]));
  const reBySlug = new Map(Object.entries(rechecks).map(([path, raw]) => [slugOf(path, '.recheck.md'), raw]));
  const issues = lessons.flatMap((l) => {
    const sheet = claimSheet(l, sources);
    const recheck = reBySlug.get(l.slug);
    return recheck === undefined ? checkReport(sheet, bySlug.get(l.slug), reportPath(l.slug)) : checkPair(sheet, bySlug.get(l.slug), recheck, reportPath(l.slug), recheckPath(l.slug));
  });
  const owned = new Set(lessons.map((l) => l.slug));
  for (const slug of bySlug.keys()) {
    if (!owned.has(slug)) issues.push(`${reportPath(slug)}: a fact-check report with no cited lesson "${slug}"; delete it, or fix its file name.`);
  }
  for (const slug of reBySlug.keys()) {
    if (!owned.has(slug)) issues.push(`${recheckPath(slug)}: a re-check report with no cited lesson "${slug}"; delete it, or fix its file name.`);
  }
  return issues;
}

/**
 * Where a glossary group's reports live: in a folder of their own, so a group and a lesson of one name never meet
 * (`reportPath` and `recheckPath` of the sheet's slug `glossary/<id>` give the same).
 */
export const GLOSSARY_REPORT_DIR = 'docs/fact-checks/glossary/';

/**
 * Every issue with the fact checks of these glossary groups, as `checkFactChecks` reads a lesson's: `reports` is the
 * registry's glob of `docs/fact-checks/glossary/*.md` (not the re-checks), `rechecks` its glob of `*.recheck.md` there,
 * each keyed by path. A report or re-check no group owns is an issue too. A group whose ties name a lesson or term that
 * does not exist is reported by name, not thrown.
 */
export function checkGlossaryFactChecks(
  groups: readonly GlossaryGroup[],
  lessons: readonly Lesson[],
  reports: Record<string, string>,
  sources: SourceRegistry,
  rechecks: Record<string, string> = {},
): string[] {
  const bySlug = new Map(Object.entries(reports).map(([path, raw]) => [slugOf(path), raw]));
  const reBySlug = new Map(Object.entries(rechecks).map(([path, raw]) => [slugOf(path, '.recheck.md'), raw]));
  const issues = groups.flatMap((g) => {
    let sheet: ClaimSheet;
    try {
      sheet = groupSheet(g, sources, lessons);
    } catch (e) {
      return [`glossary group "${g.id}": ${(e as Error).message}`];
    }
    const path = reportPath(sheet.slug);
    const recheck = reBySlug.get(g.id);
    return recheck === undefined ? checkReport(sheet, bySlug.get(g.id), path) : checkPair(sheet, bySlug.get(g.id), recheck, path, recheckPath(sheet.slug));
  });
  const owned = new Set(groups.map((g) => g.id));
  for (const id of bySlug.keys()) {
    if (!owned.has(id)) issues.push(`${reportPath(`glossary/${id}`)}: a fact-check report with no glossary group "${id}"; delete it, or fix its file name.`);
  }
  for (const id of reBySlug.keys()) {
    if (!owned.has(id)) issues.push(`${recheckPath(`glossary/${id}`)}: a re-check report with no glossary group "${id}"; delete it, or fix its file name.`);
  }
  return issues;
}

const NO_PATH = 'has no fact-check path yet: the build refuses';
const DECISION = 'until one is built (docs/direction.md, decision 2.16)';

/**
 * Content of a kind no fact-check covers yet is refused outright: every objective mapping of a certification track. It
 * carries citations, but there is no claim sheet for it; the path is built by the job that first needs one. (Glossary
 * entries have their path: `checkGlossaryFactChecks`.) `tracks` is an argument so a test can pass some.
 */
export function checkUnpathedKinds(tracks: readonly Track[]): string[] {
  const issues: string[] = [];
  for (const t of tracks) {
    if (t.type !== 'certification') continue;
    for (const part of t.parts) {
      for (const l of part.lessons) {
        for (const o of l.objectives) issues.push(`track "${t.id}", lesson "${l.slug}", objective ${o.exam} ${o.objective} ${NO_PATH} objective mappings ${DECISION}`);
      }
    }
  }
  return issues;
}
