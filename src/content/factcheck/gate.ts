import type { GlossaryEntry } from '../glossary';
import type { Lesson, Track } from '../schema';
import type { SourceRegistry } from '../sources';
import { keysMissingQuotes } from './quotecheck';
import { parseQuotes, quotesDigest } from './quotes';
import { parseReport, type ReportHeader } from './report';
import { claimSheet, type ClaimSheet } from './sheet';

/**
 * The build gate (fact-checker design §7): a lesson in the cited shape builds only with a current report in which
 * every item passes. Lessons still on the legacy list are exempt until they move across (direction doc §10 tasks
 * 4–6). Every issue names the report's path and says what to do.
 */

const AGAIN = 'run the fact-checker on it again (docs/content-model.md §8)';

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
    return [`${path}: the lesson has changed since it was checked (report ${header.hash.slice(0, 12)}…, lesson ${sheet.hash.slice(0, 12)}…); ${AGAIN}.`];
  }
  const problems: string[] = [];
  const keys = new Set(sheet.items.map((i) => i.key));
  for (const key of keys) if (!Object.hasOwn(header.verdicts, key)) problems.push(`${path}: no verdict for ${key}; ${AGAIN}.`);
  for (const key of Object.keys(header.verdicts)) {
    if (!keys.has(key)) problems.push(`${path}: a verdict for ${key}, which the lesson does not have; ${AGAIN}.`);
  }
  const failed = Object.entries(header.verdicts).filter(([key, v]) => keys.has(key) && v !== '✅');
  if (failed.length > 0) {
    problems.push(`${path}: ${failed.length} item(s) did not pass: ${failed.map(([key, v]) => `${v} ${key}`).join('; ')}. Fix the lesson, then ${AGAIN}.`);
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
 * imports the quote check's page reader.
 */
function quoteProblems(sheet: ClaimSheet, raw: string, header: ReportHeader, path: string): string[] {
  const parsed = parseQuotes(raw, sheet);
  if (parsed.quotes === undefined) return parsed.issues.map((i) => `${path}: its quotes cannot be read: ${i}.`);
  const quotes = parsed.quotes;
  const run = `run npm run fact-check -- ${sheet.slug} --quotes <folder of the sources> (docs/content-model.md §8)`;
  const record = header.quotes;
  if (record === undefined) return [`${path}: the quotes have not been confirmed against the sources (the header has no quotes record); ${run}.`];
  const problems: string[] = [];
  const digest = quotesDigest(quotes);
  if (record.count !== quotes.length || record.digest !== digest) {
    problems.push(
      `${path}: a quote changed after the quote check last passed (the record has ${record.count} quote${record.count === 1 ? '' : 's'}, digest ${record.digest.slice(0, 12)}…; the report has ${quotes.length}, digest ${digest.slice(0, 12)}…); ${run} again.`,
    );
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
  const unquoted = keysMissingQuotes(sheet, header.verdicts, quotes);
  if (unquoted.length > 0) {
    problems.push(`${path}: ${unquoted.length} item(s) that pass have no quote: ${unquoted.join('; ')}. Each item with citations needs at least one; write them, then ${run}.`);
  }
  return problems;
}

/** The slug a report's path names: its file name without `.md`. */
const slugOf = (path: string): string => path.slice(path.lastIndexOf('/') + 1).replace(/\.md$/, '');

/**
 * Every issue with the fact checks of these lessons. `reports` is the registry's glob of `docs/fact-checks/*.md`,
 * keyed by path; a report no cited lesson owns is an issue too.
 */
export function checkFactChecks(lessons: readonly Lesson[], reports: Record<string, string>, sources: SourceRegistry): string[] {
  const bySlug = new Map(Object.entries(reports).map(([path, raw]) => [slugOf(path), raw]));
  const cited = lessons.filter((l) => l.origin === 'cited');
  const issues = cited.flatMap((l) => checkReport(claimSheet(l, sources), bySlug.get(l.slug), reportPath(l.slug)));
  const owned = new Set(cited.map((l) => l.slug));
  for (const slug of bySlug.keys()) {
    if (!owned.has(slug)) issues.push(`${reportPath(slug)}: a fact-check report with no cited lesson "${slug}"; delete it, or fix its file name.`);
  }
  return issues;
}

const NO_PATH = 'has no fact-check path yet: the build refuses';
const DECISION = 'until one is built (docs/direction.md, decision 2.16)';

/**
 * Content of a kind no fact-check covers yet is refused outright: every glossary entry and every objective mapping of a
 * certification track. Both carry citations, but there is no claim sheet for them; the path is built by the job that
 * first needs one. `glossary` and `tracks` are arguments so a test can pass some.
 */
export function checkUnpathedKinds(glossary: readonly GlossaryEntry[], tracks: readonly Track[]): string[] {
  const issues = glossary.map((e) => `glossary entry "${e.id}" ${NO_PATH} glossary entries ${DECISION}`);
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
