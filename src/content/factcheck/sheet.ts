import { backedPartsOf, citedPartsOf } from '../cited';
import type { Backing, Lesson } from '../schema';
import type { Citation, SourceEntry, SourceRegistry } from '../sources';
import { sha256 } from './sha256';

/**
 * A lesson's claim sheet (fact-checker design §6.1): every item the fact-checker checks, with a stable key, and a
 * hash of exactly those items. It lists everything a reader can read, or watch happen, in the lesson:
 * - every part that cites (a claim, or an analogy);
 * - the OSI badge;
 * - every part of Watch and the scene, by its backing (traced, example data, or analogy);
 * - the parts that carry no backing at all: the title, the unit's name and each question's prompt.
 *
 * Settings that change only how something looks are left out (`DISPLAY_ONLY`), and so are the lesson's level, cert
 * tags and figure. So a layout tweak, or a new schema field with a default, leaves a lesson's report current, while
 * any change to what a reader can read makes it stale.
 */

export type ItemKind = 'claim' | 'osi' | 'traced' | 'example' | 'analogy' | 'unbacked';

export interface SheetItem {
  /** Where the item sits, as the cited rules name it: `units[0].learn.lead[1] ("lead-2")`. */
  key: string;
  kind: ItemKind;
  /** What a reader reads or sees, with citations, backing, ids and display-only settings taken out. */
  content: unknown;
  cite: Citation[];
  /** The Learn ids a traced item repeats; empty for any other kind. */
  traces: string[];
}

export interface ClaimSheet {
  slug: string;
  items: SheetItem[];
  /** The registry entry of every source the items cite, by id. */
  sources: SourceEntry[];
  overrides: Lesson['overrides'];
  /** SHA-256, lowercase hex, of the slug, items, sources and overrides. */
  hash: string;
}

/** Keys that set only how something looks: a column's width and face, a message's speed and drop point, a cue, a glyph. */
export const DISPLAY_ONLY: readonly string[] = ['width', 'prose', 'strong', 'fast', 'dropAt', 'cues', 'glyph', 'pick', 'keyColumn', 'hiddenKey'];

/** Keys every item carries in its own fields or its key, so never in its content. */
const OWN_FIELDS = ['cite', 'backing', 'hookBacking', 'id', 'analogy'];

/** What each kind of backed part leaves to the items of its own. */
const NESTED: Record<string, readonly string[]> = {
  step: ['deep', 'facts', 'events'],
  scene: ['packets', 'views', 'layers', 'start'],
};

/** A value with the given keys taken out at every depth, and with no undefined values. */
function strip(value: unknown, drop: ReadonlySet<string>): unknown {
  if (Array.isArray(value)) return value.map((v) => strip(v, drop));
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k, v]) => !drop.has(k) && v !== undefined)
        .map(([k, v]) => [k, strip(v, drop)]),
    );
  }
  return value;
}

const STRIPPED = new Set([...DISPLAY_ONLY, ...OWN_FIELDS]);

/** The value with its own nested items taken out first (only at its top level), then stripped. */
function contentOf(value: unknown, nested: readonly string[] = []): unknown {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return strip(value, STRIPPED);
  const top = Object.fromEntries(Object.entries(value).filter(([k]) => !nested.includes(k)));
  return strip(top, STRIPPED);
}

function backedKind(backing: Backing | undefined): { kind: ItemKind; traces: string[] } {
  if (backing === undefined) return { kind: 'unbacked', traces: [] };
  if ('traces' in backing) return { kind: 'traced', traces: [...backing.traces] };
  return { kind: 'analogy' in backing ? 'analogy' : 'example', traces: [] };
}

/** JSON with every object's keys sorted, at every depth: the same value always gives the same text. */
function canonical(value: unknown): string {
  const sorted = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(sorted);
    if (typeof v === 'object' && v !== null) {
      return Object.fromEntries(
        Object.keys(v)
          .sort()
          .filter((k) => (v as Record<string, unknown>)[k] !== undefined)
          .map((k) => [k, sorted((v as Record<string, unknown>)[k])]),
      );
    }
    return v;
  };
  return JSON.stringify(sorted(value));
}

export function claimSheet(lesson: Lesson, sources: SourceRegistry): ClaimSheet {
  const items: SheetItem[] = [{ key: 'title', kind: 'unbacked', content: { title: lesson.title }, cite: [], traces: [] }];
  lesson.units.forEach((u, i) => {
    items.push({ key: `units[${i}].name`, kind: 'unbacked', content: { name: u.name }, cite: [], traces: [] });
    items.push(
      u.osi === 'spans'
        ? { key: `units[${i}].osi`, kind: 'osi', content: 'spans', cite: [], traces: [] }
        : { key: `units[${i}].osi`, kind: 'osi', content: { layers: u.osi.layers }, cite: u.osi.cite, traces: [] },
    );
  });
  for (const part of backedPartsOf(lesson)) {
    const nested = part.at.includes('.scene.backing') ? NESTED.scene : /\.steps\[\d+\] \(step /.test(part.at) ? NESTED.step : [];
    items.push({ key: part.at, ...backedKind(part.backing), content: contentOf(part.value, nested), cite: [] });
  }
  for (const part of citedPartsOf(lesson)) {
    items.push({ key: part.at, kind: part.analogy === true ? 'analogy' : 'claim', content: contentOf(part.value), cite: part.cite, traces: [] });
  }
  lesson.units.forEach((u, i) => {
    u.practice.forEach((q, j) => {
      items.push({ key: `units[${i}].practice[${j}].prompt (question "${q.id}")`, kind: 'unbacked', content: { prompt: q.prompt }, cite: [], traces: [] });
    });
  });

  const ids = [...new Set(items.flatMap((item) => item.cite.map((c) => c.source)))].sort();
  const cited = ids.flatMap((id) => (Object.hasOwn(sources, id) ? [sources[id]!] : []));
  const body = { slug: lesson.slug, items, sources: cited, overrides: lesson.overrides };
  return { ...body, hash: sha256(canonical(body)) };
}

/** The sheet as Markdown, for the fact-checker to read: the sources, then every item, then the overrides. */
export function renderSheet(sheet: ClaimSheet): string {
  const lines = [`# Claim sheet: ${sheet.slug}`, '', `Hash: \`${sheet.hash}\``, '', '## Sources', ''];
  for (const s of sheet.sources) {
    lines.push(`- \`${s.id}\` (${s.kind}${s.version ? `, version ${s.version}` : ''}): ${s.short}, ${s.title}. ${s.publisher}. ${s.url}`);
  }
  if (sheet.sources.length === 0) lines.push('- None.');
  lines.push('', `## Items (${sheet.items.length})`);
  for (const item of sheet.items) {
    lines.push('', `### ${item.key}`, '', `Kind: ${item.kind}`, '', '```json', JSON.stringify(item.content, null, 2), '```');
    if (item.cite.length > 0) {
      lines.push('', 'Citations:');
      for (const c of item.cite) lines.push(`- ${c.label}: ${c.url}${c.defining === true ? ' (defining standard)' : ''}`);
    }
    if (item.traces.length > 0) lines.push('', `Traces: ${item.traces.join(', ')}`);
  }
  lines.push('', '## Limit overrides', '');
  for (const o of sheet.overrides) lines.push(`- ${o.limit}: ${o.reason}`);
  if (sheet.overrides.length === 0) lines.push('- None.');
  return `${lines.join('\n')}\n`;
}
