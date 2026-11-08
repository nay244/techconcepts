import type { Lesson } from '../schema';
import type { SourceRegistry } from '../sources';
import { parseReport } from './report';
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
