import { z } from 'zod';
import { twoSourceIssue } from './cited';
import { slugSchema, text } from './primitives';
import { checkCitation, citationSchema, SOURCES, type Citation, type SourceRegistry } from './sources';

/**
 * A glossary group (docs/glossary-path-spec.md, docs/content-model.md §6): terms, each with a cited definition. A group is
 * a file of its own, `src/content/glossary-groups/<group>.ts`, written with `defineGlossaryGroup`, and is fact-checked as
 * a lesson is (`factcheck/sheet.ts`, `groupSheet`). Entries are checked in groups of about a dozen.
 *
 * This file holds the group's shape and the rules inside one group. `glossary.ts` loads the group files (which import
 * this file, so it cannot load them itself) and checks the rules that span groups. The rules that tie an entry to a
 * lesson's term need the lessons, so they are the registry's (`registry.ts`).
 */

/** A definition is at most this many words, all its statements together; there is no override (CLAUDE.md, "a limit is met by trimming"). */
export const GLOSSARY_DEFINITION_WORDS = 60;
/** A sense's label is at most this many words. */
export const GLOSSARY_LABEL_WORDS = 6;
/** A definition has at least one and at most this many statements. */
export const GLOSSARY_MAX_STATEMENTS = 3;

const statementSchema = z.strictObject({ id: slugSchema, text, cite: z.array(citationSchema).default([]) });
const tieSchema = z.strictObject({ lesson: slugSchema, term: slugSchema });
const senseSchema = z.strictObject({ id: slugSchema, label: text, definition: z.array(statementSchema), lessons: z.array(tieSchema).optional() });
const entrySchema = z.strictObject({
  id: slugSchema,
  term: text,
  also: z.array(text).optional(),
  definition: z.array(statementSchema).optional(),
  senses: z.array(senseSchema).optional(),
  lessons: z.array(tieSchema).optional(),
});
const groupSchema = z.strictObject({ id: slugSchema, entries: z.array(entrySchema) });

export type GlossaryStatement = z.infer<typeof statementSchema>;
/** A lesson's Learn term an entry or a sense is tied to. */
export type LessonTie = z.infer<typeof tieSchema>;
export type GlossarySense = z.infer<typeof senseSchema>;
export type GlossaryEntry = z.infer<typeof entrySchema>;
export type GlossaryGroup = z.infer<typeof groupSchema>;
/** What a group file writes: a statement may leave out nothing but is refused without a citation, so `cite` is checked, not defaulted. */
export type GlossaryGroupInput = z.input<typeof groupSchema>;

/** One definition of an entry: the entry's own, or one sense's. */
export interface GlossaryPart {
  /** The sense, for an entry with senses; `undefined` for an entry with one. */
  sense?: { id: string; label: string };
  definition: GlossaryStatement[];
  lessons: LessonTie[];
  /** `lessons` as written: `undefined` when the key is left out (so an empty list can be told from none). */
  written?: LessonTie[];
}

/** The definitions of an entry, in the order written: one for an entry with a single sense, else one per sense. */
export function partsOf(entry: GlossaryEntry): GlossaryPart[] {
  if (entry.senses !== undefined) return entry.senses.map((s) => ({ sense: { id: s.id, label: s.label }, definition: s.definition, lessons: s.lessons ?? [], written: s.lessons }));
  return [{ definition: entry.definition ?? [], lessons: entry.lessons ?? [], written: entry.lessons }];
}

/** The words of a piece of text: runs of non-space characters. */
export const glossaryWords = (value: string): number => value.match(/\S+/g)?.length ?? 0;

/** A name compared ignoring case and outer spaces. */
export const nameKey = (value: string): string => value.trim().toLowerCase();

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const idOf = (value: unknown): string | undefined => (isRecord(value) && typeof value.id === 'string' ? value.id : undefined);

/** "entry "ttl", sense "ip", statement "s-1": id must be ..." from a zod issue: the owner by ids read from the input, then the property path. */
function describeIssue(path: PropertyKey[], message: string, input: unknown): string {
  const owners: string[] = [];
  const props: string[] = [];
  let here: unknown = input;
  const OWNERS: Record<string, string> = { entries: 'entry', senses: 'sense', definition: 'statement' };
  for (let i = 0; i < path.length; i++) {
    const key = path[i]!;
    here = isRecord(here) || Array.isArray(here) ? (here as Record<PropertyKey, unknown>)[key] : undefined;
    const next = path[i + 1];
    if (typeof key === 'string' && Object.hasOwn(OWNERS, key) && typeof next === 'number') {
      const item = (here as unknown[] | undefined)?.[next];
      owners.push(`${OWNERS[key]} ${idOf(item) === undefined ? `#${next + 1}` : `"${idOf(item)}"`}`);
      here = item;
      i++;
    } else props.push(typeof key === 'number' ? `[${key}]` : props.length === 0 ? String(key) : `.${String(key)}`);
  }
  const where = [owners.join(', '), props.join('')].filter((p) => p !== '').join(': ');
  return where === '' ? message : `${where} ${message}`;
}

/** The groups `defineGlossaryGroup` made, with the source list each was checked against (a group cannot bring a list of its own). */
const definedAgainst = new WeakMap<object, SourceRegistry>();

/** The source list `defineGlossaryGroup` checked a group against, or `undefined` for a group it did not make. */
export const definedGroupWith = (group: unknown): SourceRegistry | undefined => (typeof group === 'object' && group !== null ? definedAgainst.get(group) : undefined);

/** A group's own name for messages. */
const named = (id: unknown): string => (typeof id === 'string' ? `Glossary group "${id}"` : 'Glossary group');

/**
 * Validates one group against `sources` and returns it parsed (the rules of docs/glossary-path-spec.md §2, 1 to 10).
 * Throws one Error listing every issue, each naming the group, the entry and the part. The registry's `GLOSSARY_GROUPS`
 * accepts only a group made here against the real `SOURCES` (`groupsFromModules`), so another list is for tests and the canary.
 */
export function defineGlossaryGroup(input: GlossaryGroupInput, sources: SourceRegistry = SOURCES): GlossaryGroup {
  const parsed = groupSchema.safeParse(input);
  const issues: string[] = [];
  if (!parsed.success) {
    for (const issue of parsed.error.issues) issues.push(describeIssue(issue.path, issue.message, input));
    throw new Error(`${named(idOf(input))} is invalid:\n- ${issues.join('\n- ')}`);
  }
  const group = parsed.data;
  const statementIds = new Map<string, string>();
  const entryIds = new Set<string>();

  for (const e of group.entries) {
    const at = `entry "${e.id}"`;
    if (entryIds.has(e.id)) issues.push(`${at}: Duplicate entry id "${e.id}" in the group; give each entry its own id.`);
    entryIds.add(e.id);

    // Plain text.
    const plain = (where: string, value: string) => {
      if (value.includes('**')) issues.push(`${where}: has "**"; glossary text is plain, so take the bold markers out.`);
    };
    plain(`${at}: term`, e.term);
    for (const [j, a] of (e.also ?? []).entries()) plain(`${at}: also[${j}]`, a);

    // The names.
    if (e.also !== undefined && e.also.length === 0) issues.push(`${at}: also is empty; leave it out, or list another spelling.`);
    const seen = new Set<string>([nameKey(e.term)]);
    for (const a of e.also ?? []) {
      if (nameKey(a) === nameKey(e.term)) issues.push(`${at}: the spelling "${a}" is the entry's own term; list only other spellings.`);
      else if (seen.has(nameKey(a))) issues.push(`${at}: the spelling "${a}" is listed twice, ignoring case; keep one.`);
      seen.add(nameKey(a));
    }

    // One definition or senses.
    const hasDefinition = e.definition !== undefined;
    const hasSenses = e.senses !== undefined;
    if (hasDefinition && hasSenses) issues.push(`${at}: has both definition and senses; an entry has one or the other.`);
    if (!hasDefinition && !hasSenses) issues.push(`${at}: has neither definition nor senses; give it a definition, or two or more senses.`);
    if (e.senses !== undefined && e.senses.length < 2) issues.push(`${at}: senses has ${e.senses.length} item${e.senses.length === 1 ? '' : 's'}; an entry with senses has at least 2 (with one sense, write a definition).`);
    if (hasSenses && e.lessons !== undefined) issues.push(`${at}: lessons sits on the entry, which has senses; put lessons on the sense it ties.`);

    if (e.senses !== undefined) {
      const labels = new Set<string>();
      const ids = new Set<string>();
      for (const s of e.senses) {
        const sat = `${at}, sense "${s.id}"`;
        if (ids.has(s.id)) issues.push(`${sat}: Duplicate sense id "${s.id}" in the entry; give each sense its own id.`);
        ids.add(s.id);
        plain(`${sat}: label`, s.label);
        const words = glossaryWords(s.label);
        if (words > GLOSSARY_LABEL_WORDS) issues.push(`${sat}: the label is ${words} words; the limit is ${GLOSSARY_LABEL_WORDS}.`);
        if (labels.has(nameKey(s.label))) issues.push(`${sat}: the label "${s.label}" is already another sense's label of this entry, ignoring case; give each sense its own.`);
        labels.add(nameKey(s.label));
      }
    }

    const parts = partsOf(e);
    for (const part of parts) {
      const pat = part.sense === undefined ? at : `${at}, sense "${part.sense.id}"`;
      const n = part.definition.length;
      if ((hasDefinition || hasSenses) && (n < 1 || n > GLOSSARY_MAX_STATEMENTS)) {
        issues.push(`${pat}: the definition has ${n} statement${n === 1 ? '' : 's'}; a definition has 1 to ${GLOSSARY_MAX_STATEMENTS}.`);
      }
      const words = part.definition.reduce((sum, s) => sum + glossaryWords(s.text), 0);
      if (words > GLOSSARY_DEFINITION_WORDS) {
        issues.push(`${pat}: the definition is ${words} words; the limit is ${GLOSSARY_DEFINITION_WORDS} (GLOSSARY_DEFINITION_WORDS), so trim it.`);
      }
      for (const s of part.definition) {
        const sat = `${pat}, statement "${s.id}"`;
        plain(sat, s.text);
        const first = statementIds.get(s.id);
        if (first !== undefined) issues.push(`${sat}: Duplicate statement id "${s.id}" in the group (also ${first}); give each statement its own id.`);
        else statementIds.set(s.id, pat);
        if (s.cite.length === 0) issues.push(`${sat}: no citation; every statement of a glossary definition cites its sources.`);
        else {
          const problem = twoSourceIssue(s.cite, sources);
          if (problem !== undefined) issues.push(`${sat}: ${problem}`);
        }
        for (const [n2, c] of s.cite.entries()) {
          for (const problem of checkCitation(c, sources, 'content')) issues.push(`${sat}, citation ${n2 + 1}: ${problem}`);
        }
      }
      const pairs = new Set<string>();
      if (part.written !== undefined && part.written.length === 0) issues.push(`${pat}: lessons is empty; leave it out, or tie a lesson's term.`);
      for (const t of part.lessons) {
        const key = `${t.lesson}\n${t.term}`;
        if (pairs.has(key)) issues.push(`${pat}: the tie to term "${t.term}" of lesson "${t.lesson}" is listed twice; keep one.`);
        pairs.add(key);
      }
    }
  }

  if (issues.length > 0) throw new Error(`${named(group.id)} is invalid:\n- ${issues.join('\n- ')}`);
  definedAgainst.set(group, sources);
  return group;
}

/** Every name an entry is listed or found under: its term, then each spelling. */
export const namesOf = (e: GlossaryEntry): string[] => [e.term, ...(e.also ?? [])];
