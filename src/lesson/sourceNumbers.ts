import type { Source, Unit } from '../content/schema';
import type { Citation } from '../content/sources';

/** One numbered mark after a claim: the source's number, the exact place it opens, and every place the claim cites in it. */
export interface SourceMark {
  n: number;
  url: string;
  /** 'ITU-T X.200, 6.1.2; ITU-T X.200, 7.4.2.1'. */
  places: string;
}

export interface NumberedSources {
  /** The unit's sources, in the order Learn first cites them; one cited only in Watch or Practice comes after. */
  list: Source[];
  /** A source's number in `list`, by its id in the registry. Empty for a lesson that cites nothing yet. */
  numberOf: ReadonlyMap<string, number>;
}

/**
 * A unit's sources numbered for the reader: 1 is the first source Learn cites, top to bottom. A unit whose references are not
 * all identified by a source id keeps its written order and gets no numbers.
 */
export function numberedSources(unit: Unit): NumberedSources {
  const byId = new Map(unit.references.flatMap((r) => (r.source === undefined ? [] : [[r.source, r] as const])));
  if (byId.size < unit.references.length) return { list: unit.references, numberOf: new Map() };
  const { lead, terms, pattern, why, deep, facts } = unit.learn;
  const inLearn = [...lead, ...terms, pattern, ...why, ...deep, ...facts].flatMap((part) => part.cite.map((c) => c.source));
  const order = [...new Set([...inLearn.filter((id) => byId.has(id)), ...byId.keys()])];
  return { list: order.map((id) => byId.get(id)!), numberOf: new Map(order.map((id, i) => [id, i + 1])) };
}

/**
 * A claim's marks, one for each source it cites, in number order. A mark opens the first place the claim cites in
 * that source, and names every one. A citation of a source that has no number gets no mark.
 */
export function sourceMarks(cite: readonly Citation[], numberOf: ReadonlyMap<string, number>): SourceMark[] {
  const marks = new Map<number, SourceMark>();
  for (const c of cite) {
    const n = numberOf.get(c.source);
    if (n === undefined) continue;
    const mark = marks.get(n);
    if (mark === undefined) marks.set(n, { n, url: c.url, places: c.label });
    else mark.places += `; ${c.label}`;
  }
  return [...marks.values()].sort((a, b) => a.n - b.n);
}
