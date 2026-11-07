import { z } from 'zod';
import { statementIssue } from './cited';
import { slugSchema, text } from './primitives';
import { statementSchema } from './schema';
import { checkCitation, SOURCES, type SourceRegistry } from './sources';

/**
 * The glossary (direction doc §6.5): terms, each with a cited definition (§3.1). A definition is one or more
 * statements; each cites a primary source at its section or is flagged as an analogy, never both, and at least one
 * cites. Entries arrive with the lessons that cite them (§10 tasks 4–6); the page and the term links are §10 task 7.
 */

export const glossaryEntrySchema = z.strictObject({ id: slugSchema, term: text, definition: z.array(statementSchema).min(1) });
export type GlossaryEntry = z.infer<typeof glossaryEntrySchema>;

/**
 * Validates every entry against `sources` and returns them: unique ids, terms unique ignoring case, every statement
 * cited or an analogy, at least one cited statement per entry, and every citation sound for content. Throws one Error
 * listing every issue.
 */
export function defineGlossary(entries: GlossaryEntry[], sources: SourceRegistry = SOURCES): GlossaryEntry[] {
  const issues: string[] = [];
  const glossary: GlossaryEntry[] = [];
  const ids = new Set<string>();
  /** The first entry for each term, by the term in lower case. */
  const terms = new Map<string, GlossaryEntry>();
  for (const [i, raw] of entries.entries()) {
    const name = `entry ${typeof raw?.id === 'string' ? `"${raw.id}"` : `#${i + 1}`}`;
    const parsed = glossaryEntrySchema.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const where = issue.path.join('.');
        issues.push(where === '' ? `${name}: ${issue.message}` : `${name}: ${where} ${issue.message}`);
      }
      continue;
    }
    const e = parsed.data;
    glossary.push(e);
    if (ids.has(e.id)) issues.push(`Duplicate glossary id "${e.id}"; give each entry its own id.`);
    ids.add(e.id);
    const key = e.term.trim().toLowerCase();
    const same = terms.get(key);
    if (same === undefined) terms.set(key, e);
    else {
      issues.push(
        `entry "${e.id}" defines "${e.term}", which entry "${same.id}" already defines as "${same.term}"; terms are unique ignoring case, so keep one entry per term.`,
      );
    }
    for (const [j, s] of e.definition.entries()) {
      const problem = statementIssue(s);
      if (problem !== undefined) issues.push(`${name}: definition[${j}] ("${s.id}"): ${problem}`);
    }
    if (!e.definition.some((s) => s.cite.length > 0)) {
      issues.push(`${name}: the definition needs at least one cited statement; an analogy alone cannot define a term.`);
    }
    for (const [j, s] of e.definition.entries()) {
      for (const [n, c] of s.cite.entries()) {
        for (const problem of checkCitation(c, sources, 'content')) issues.push(`${name}: definition[${j}] ("${s.id}"), citation ${n + 1}: ${problem}`);
      }
    }
  }
  if (issues.length > 0) throw new Error(`Invalid glossary:\n- ${issues.join('\n- ')}`);
  return glossary;
}

/** Empty until the lessons that cite its terms arrive (direction doc §10 tasks 4–6). */
export const GLOSSARY: GlossaryEntry[] = defineGlossary([]);
