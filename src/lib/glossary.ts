// The glossary page's data (prototypes/d9-glossary.md §9, as prototypes/d9a-glossary-independent.md §3 amends it), worked out when the site is
// built. A pure function: its inputs are arguments, so tests give it fixtures and the pages give it the real ones
// (`glossary-site.ts`). It keeps no copy of any word of an entry.
import { partsOf, type GlossaryEntry, type GlossaryGroup, type GlossaryPart } from '../content/glossary-group';
import type { Lesson } from '../content/schema';
import type { SourceRegistry } from '../content/sources';
import { stampDate } from './stamp';

/** A ready lesson, as the glossary needs it. */
export interface GlossaryLesson {
  lesson: Lesson;
  /** The titles of the tracks that list the lesson. */
  tracks: string[];
}

export interface GlossaryInput {
  groups: readonly GlossaryGroup[];
  lessons: readonly GlossaryLesson[];
  /** Every track's title, in the order of `tracks` (the site's order). */
  trackTitles: readonly string[];
  sources: SourceRegistry;
  /** Each group's check date ('YYYY-MM-DD'), or null when it has none (`astro dev` with a missing report). */
  dates: Readonly<Record<string, string | null>>;
}

export interface SourceLink {
  /** The source's short name: the link's words. */
  short: string;
  /** The first place the definition cites in that source. */
  url: string;
  /** Every different place cited, joined by "; ". */
  places: string;
}

/** One definition: an entry's own, or one sense's. */
export interface Definition {
  /** The sense's label as written; `undefined` for an entry with one definition. */
  label: string | undefined;
  text: string;
  sources: SourceLink[];
  /** The tracks whose lessons describe the term, in site order; empty when no lesson is tied. */
  tracks: string[];
}

export interface GlossaryItem {
  kind: 'entry' | 'pointer';
  /** The anchor: an entry's own id, or a pointer's, made from its spelling. */
  id: string;
  /** The name filed under: the term, or the spelling. */
  name: string;
  /** For an entry, its other spellings; empty for a pointer. */
  also: string[];
  /** The entry the item is, or points to. */
  entryId: string;
  entryTerm: string;
  /** Empty for a pointer. */
  definitions: Definition[];
}

export interface GlossaryLetter {
  letter: string;
  id: string;
  items: GlossaryItem[];
}

export interface GlossaryKey {
  letter: string;
  id: string;
  /** Whether a letter with an item stands behind it; a key that is not live is dashed and not a link. */
  live: boolean;
}

/** What Learn shows of an entry's definition under a lesson's term (`Explanation`'s `definitions` prop). */
export interface LessonDefinition {
  label?: string;
  text: string;
  /** Short names, in the order of the page's Sources line. */
  sources: string[];
}

export interface GlossaryData {
  letters: GlossaryLetter[];
  keys: GlossaryKey[];
  /** The page's stamp; `null` when no group has a date or there is no entry. */
  stamp: { count: number; date: string } | null;
  /** Keyed `{lesson slug}/{term id}`. */
  lessonMap: Record<string, LessonDefinition>;
}

/** The digit group's letter. */
export const DIGITS = '0–9';
/** From this many letters with an item the keys are the whole alphabet. */
export const FULL_ALPHABET_FROM = 13;

const RESERVED = new Set(['main', 'menu', 'menu-panel', 'theme-toggle', 'letters']);
const isReserved = (id: string): boolean => RESERVED.has(id) || id.startsWith('letter-');
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const COLLATOR = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
const byCodeUnits = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

/** A name's sort key: leading characters that are neither letters nor digits dropped. */
const sortKeyOf = (name: string): string => name.replace(/^[^\p{L}\p{N}]+/u, '');

/** The letter an item is filed under: its sort key's first character, accent removed; a digit files under "0–9". */
function letterOf(name: string): string {
  const first = sortKeyOf(name).normalize('NFD').charAt(0).replace(/\p{M}/gu, '');
  if (/^[a-z]$/i.test(first)) return first.toUpperCase();
  if (/^[0-9]$/.test(first)) return DIGITS;
  throw new Error(`The glossary name "${name}" has no letter a to z or digit to file it under; give it one.`);
}

/** "Time to Live" as `time-to-live`: lower case, accents removed, each run of other characters one hyphen. */
function slugOf(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug === '' ? 'term' : slug;
}

/** The stamp's words: "10 terms checked, the latest on 13 Nov 2026"; "1 term checked on 13 Nov 2026". */
export function stampLine({ count, date }: { count: number; date: string }): string {
  return count === 1 ? `1 term checked on ${stampDate(date)}` : `${count} terms checked, the latest on ${stampDate(date)}`;
}

/** The sources of one definition (rule 5): one for each different source id, in the order first cited. */
function sourcesOf(part: GlossaryPart, sources: SourceRegistry, where: string): SourceLink[] {
  const cited = new Map<string, { url: string; labels: string[] }>();
  for (const statement of part.definition) {
    for (const c of statement.cite) {
      const seen = cited.get(c.source);
      if (seen === undefined) cited.set(c.source, { url: c.url, labels: [c.label] });
      else if (!seen.labels.includes(c.label)) seen.labels.push(c.label);
    }
  }
  const links: SourceLink[] = [];
  for (const [id, { url, labels }] of cited) {
    const entry = Object.hasOwn(sources, id) ? sources[id] : undefined;
    if (entry === undefined) throw new Error(`${where}: cites the source "${id}", which is not in the source list.`);
    const twin = links.find((l) => l.short === entry.short);
    if (twin !== undefined) throw new Error(`${where}: cites two different sources with the short name "${entry.short}"; the page could not tell their links apart.`);
    links.push({ short: entry.short, url, places: labels.join('; ') });
  }
  return links;
}

/** The tracks of one definition (rule 6): every track that lists a tied lesson, each once, in the order of `trackTitles`. */
function tracksOf(part: GlossaryPart, lessons: readonly GlossaryLesson[], trackTitles: readonly string[], where: string): string[] {
  const found = new Set<string>();
  for (const tie of part.lessons) {
    const ready = lessons.find((l) => l.lesson.slug === tie.lesson);
    if (ready === undefined) throw new Error(`${where}: ties lesson "${tie.lesson}", which is not a ready lesson; fix the tie.`);
    if (!ready.lesson.units.some((u) => u.learn.terms.some((t) => t.id === tie.term))) throw new Error(`${where}: ties term "${tie.term}" of lesson "${tie.lesson}", which is not a term of its Learn; fix the tie.`);
    for (const title of ready.tracks) {
      if (!trackTitles.includes(title)) throw new Error(`${where}: lesson "${tie.lesson}" is listed by the track "${title}", which is not one of the site's tracks.`);
      found.add(title);
    }
  }
  return trackTitles.filter((title) => found.has(title));
}

/** The glossary as the page and the lessons draw it. */
export function glossaryData({ groups, lessons, trackTitles, sources, dates }: GlossaryInput): GlossaryData {
  const entries: GlossaryEntry[] = groups.flatMap((g) => g.entries);

  // Entry ids are their own; a reserved one cannot be an anchor.
  for (const e of entries) {
    if (isReserved(e.id)) throw new Error(`The glossary entry id "${e.id}" is reserved by the page (main, menu, menu-panel, theme-toggle, letters, letter-…); give the entry another id.`);
  }

  interface Filed {
    item: Omit<GlossaryItem, 'id'> & { id?: string };
    sortKey: string;
    letter: string;
  }
  const filed: Filed[] = [];
  const lessonMap: Record<string, LessonDefinition> = {};
  for (const e of entries) {
    const definitions: Definition[] = [];
    for (const part of partsOf(e)) {
      const where = `glossary entry "${e.id}"${part.sense === undefined ? '' : `, sense "${part.sense.id}"`}`;
      const text = part.definition.map((s) => s.text).join(' ');
      const links = sourcesOf(part, sources, where);
      definitions.push({ label: part.sense?.label, text, sources: links, tracks: tracksOf(part, lessons, trackTitles, where) });
      for (const tie of part.lessons) {
        lessonMap[`${tie.lesson}/${tie.term}`] = {
          ...(part.sense === undefined ? {} : { label: part.sense.label }),
          text,
          sources: links.map((l) => l.short),
        };
      }
    }
    filed.push({ item: { kind: 'entry', id: e.id, name: e.term, also: e.also ?? [], entryId: e.id, entryTerm: e.term, definitions }, sortKey: sortKeyOf(e.term), letter: letterOf(e.term) });
    for (const spelling of e.also ?? []) {
      filed.push({ item: { kind: 'pointer', name: spelling, also: [], entryId: e.id, entryTerm: e.term, definitions: [] }, sortKey: sortKeyOf(spelling), letter: letterOf(spelling) });
    }
  }

  // A to Z: base letters, numbers by value, a tie by code units.
  filed.sort((a, b) => COLLATOR.compare(a.sortKey, b.sortKey) || byCodeUnits(a.item.name, b.item.name));

  // A pointer's id, in page order: taken by a reserved id, any entry (before or after it) or an earlier pointer, it takes -2, -3.
  const taken = new Set<string>(entries.map((e) => e.id));
  for (const f of filed) {
    if (f.item.kind !== 'pointer') continue;
    const base = slugOf(f.item.name);
    // `letter-…` is reserved whole, so no suffix could free it: the spelling must change, as an entry id must.
    if (base.startsWith('letter-')) throw new Error(`The glossary spelling "${f.item.name}" makes the id "${base}", which the page reserves (letter-…); give the spelling another form.`);
    let id = base;
    for (let n = 2; taken.has(id) || isReserved(id); n++) id = `${base}-${n}`;
    taken.add(id);
    f.item.id = id;
  }

  const byLetter = new Map<string, GlossaryItem[]>();
  for (const f of filed) {
    const list = byLetter.get(f.letter) ?? [];
    list.push(f.item as GlossaryItem);
    byLetter.set(f.letter, list);
  }
  const order = [DIGITS, ...ALPHABET];
  const letters = order.filter((l) => byLetter.has(l)).map((letter) => ({ letter, id: letter === DIGITS ? 'letter-0-9' : `letter-${letter.toLowerCase()}`, items: byLetter.get(letter)! }));

  // The keys: the live letters; from 13 of them (the digit group counts as one), the whole alphabet, dashed where empty.
  const keys: GlossaryKey[] =
    letters.length >= FULL_ALPHABET_FROM
      ? [...(byLetter.has(DIGITS) ? [DIGITS] : []), ...ALPHABET].map((letter) => ({ letter, id: letter === DIGITS ? 'letter-0-9' : `letter-${letter.toLowerCase()}`, live: byLetter.has(letter) }))
      : letters.map(({ letter, id }) => ({ letter, id, live: true }));

  // The stamp: the latest date over the groups that have one.
  const dated = groups.map((g) => dates[g.id] ?? null).filter((d): d is string => d !== null);
  const latest = dated.length === 0 ? null : dated.reduce((a, b) => (b > a ? b : a));
  const stamp = latest === null || entries.length === 0 ? null : { count: entries.length, date: latest };

  return { letters, keys, stamp, lessonMap };
}

/** The `definitions` prop of one lesson's Learn: its entries of the map, keyed by term id. */
export function definitionsFor(lessonMap: Record<string, LessonDefinition>, slug: string): Record<string, LessonDefinition> {
  const prefix = `${slug}/`;
  return Object.fromEntries(Object.entries(lessonMap).flatMap(([key, def]) => (key.startsWith(prefix) ? [[key.slice(prefix.length), def]] : [])));
}
