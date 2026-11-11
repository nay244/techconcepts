import { itemHashes, itemLines, sourceLine, type ClaimSheet, type SheetItem } from './sheet';

/**
 * The targeted re-check (plan.md, "Targeted re-checks"; docs/content-model.md §8): after a near-pass, the next check
 * judges only the items that changed since the full check, and every item that traces to one of them. This module
 * decides which items those are and prints the sheet for them; `gate.ts` holds the rules the build applies.
 */

/** A full check is a near-pass when no more than this many items did not pass, and none is wrong (❌). */
export const NEAR_PASS_MAX_FAILING = 3;
/** A re-check judges at most this many items; more needs a full check. */
export const RECHECK_MAX_ITEMS = 12;

/** Where a lesson's re-check report lives, next to its full report. */
export function recheckPath(slug: string): string {
  return `docs/fact-checks/${slug}.recheck.md`;
}

/** A key with its index numbers taken out: `units[0].learn.lead[2] ("lead-3")` becomes `units[].learn.lead[] ("lead-3")`. */
export const withoutIndexes = (key: string): string => key.replace(/\[\d+\]/g, '[]');

/** Whether a full report's verdicts are a near-pass, and how many items did not pass, and how many are wrong. */
export function nearPass(verdicts: Readonly<Record<string, string>>): { ok: boolean; notPassing: number; wrong: number } {
  const failing = Object.values(verdicts).filter((v) => v !== '✅');
  const wrong = failing.filter((v) => v === '❌').length;
  return { ok: failing.length <= NEAR_PASS_MAX_FAILING && wrong === 0, notPassing: failing.length, wrong };
}

export interface Judging {
  /** The items that changed since the full check, in the sheet's order. */
  changed: string[];
  /** The items that did not change but trace to a part that did, in the sheet's order. */
  pulled: string[];
  /** Every item to judge, changed or pulled, in the sheet's order. */
  judge: string[];
}

/**
 * Which item of the full report's `items` record each unchanged item of the sheet is, by key: an item is unchanged when
 * the record has its hash under its key, or, where an inserted or removed part has shifted the index numbers in keys,
 * under the same key with the index numbers taken out. The value is the key the full report knew it by, which is the
 * key of its verdict there. An item that has no entry is changed.
 *
 * Two entries of the record can have the same index-free key and the same hash (two facts of one step with the same
 * label and value, say). Each entry of the record matches at most one item of the sheet: items whose own key has that
 * hash match first, then the others take what is left, in the sheet's order and the record's. So a third copy of
 * something that was there twice is new, and taking one copy out changes nothing.
 */
export function matchBase(items: Readonly<Record<string, string>>, sheet: ClaimSheet): Map<string, string> {
  const now = itemHashes(sheet);
  const matched = new Map<string, string>();
  for (const item of sheet.items) {
    if (Object.hasOwn(items, item.key) && items[item.key] === now[item.key]) matched.set(item.key, item.key);
  }
  const taken = new Set(matched.values());
  const left = new Map<string, string[]>();
  for (const [key, hash] of Object.entries(items)) {
    if (taken.has(key)) continue;
    const slot = `${withoutIndexes(key)}\n${hash}`;
    left.set(slot, [...(left.get(slot) ?? []), key]);
  }
  for (const item of sheet.items) {
    if (matched.has(item.key)) continue;
    const from = left.get(`${withoutIndexes(item.key)}\n${now[item.key]}`)?.shift();
    if (from !== undefined) matched.set(item.key, from);
  }
  return matched;
}

/**
 * Which items the sheet has now that a re-check judges, given the full report's `items` record (key to hash): those
 * `matchBase` finds no entry for (changed), and every traced item that traces to a part that is changed.
 */
export function itemsToJudge(items: Readonly<Record<string, string>>, sheet: ClaimSheet): Judging {
  const unchanged = matchBase(items, sheet);
  const changed = sheet.items.filter((item) => !unchanged.has(item.key)).map((item) => item.key);
  const changedSet = new Set(changed);
  const targets = traceTargets(sheet);
  const pulled = sheet.items
    .filter((item) => !changedSet.has(item.key) && item.traces.some((id) => changedSet.has(targets.get(id)?.key ?? '')))
    .map((item) => item.key);
  const pulledSet = new Set(pulled);
  return { changed, pulled, judge: sheet.items.filter((item) => changedSet.has(item.key) || pulledSet.has(item.key)).map((item) => item.key) };
}

/** A Learn part's id, as its key writes it: `units[0].learn.lead[1] ("lead-2")`, `units[0].learn.deep[0] ("deep-1", Learn's Go deeper)`. */
const LEARN_ID = /^units\[\d+\]\.learn\.\S+ \("([^"]+)"/;

/** The Learn items a trace may name, by id; the first of two units that use the same id, as the lesson's own check reads it. */
function traceTargets(sheet: ClaimSheet): Map<string, SheetItem> {
  const targets = new Map<string, SheetItem>();
  for (const item of sheet.items) {
    const id = LEARN_ID.exec(item.key)?.[1];
    if (id !== undefined && !targets.has(id)) targets.set(id, item);
  }
  return targets;
}

/** The Learn parts a traced item traces to, in the order it names them; one that is not on the sheet is left out. */
function contextOf(sheet: ClaimSheet, item: SheetItem): SheetItem[] {
  const targets = traceTargets(sheet);
  return item.traces.flatMap((id) => (targets.has(id) ? [targets.get(id)!] : []));
}

const clip = (hash: string): string => `${hash.slice(0, 12)}…`;

/** Each message the re-check commands and the gate share, for the path of the file they speak of. */
export const recheckMessages = {
  noItems: (path: string, slug: string): string =>
    `${path}: has no items record, so a re-check cannot tell what changed; run npm run fact-check -- ${slug} --stamp at the commit it was checked on, or run a full check (docs/content-model.md §8).`,
  notNearPass: (path: string, near: { notPassing: number; wrong: number }): string =>
    `${path}: the full check was not a near-pass (${near.notPassing} ${near.notPassing === 1 ? 'item' : 'items'} did not pass, ${near.wrong} wrong (❌); a re-check needs at most ${NEAR_PASS_MAX_FAILING} not passing and none wrong); fix the lesson, then run a full check (docs/content-model.md §8).`,
  tooMany: (path: string, count: number): string =>
    `${path}: ${count} items to judge, more than ${RECHECK_MAX_ITEMS}; a re-check is for a few changed items, so run a full check (docs/content-model.md §8).`,
  overrides: (path: string, lesson: string, report: string): string =>
    `${path}: the lesson's limit overrides are not those of the full report (the lesson has ${lesson}; the report lists ${report}); a re-check does not judge a limit, so run a full check (docs/content-model.md §8).`,
  changedSince: (path: string, then: string, now: string): string =>
    `${path}: the lesson changed since it was re-checked (re-check ${clip(then)}, lesson ${clip(now)}); run the re-check again, against the same full check (docs/content-model.md §8).`,
};

/** The limit overrides as a short list for a message. */
export const overridesText = (overrides: readonly { limit: string; reason: string }[]): string =>
  overrides.length === 0 ? 'none' : overrides.map((o) => `${o.limit} (${o.reason})`).join('; ');

/** Whether two lists of overrides are the same: a report lists each one's limit and reason. */
export function sameOverrides(a: readonly { limit: string; reason: string }[], b: readonly { limit: string; reason: string }[]): boolean {
  const form = (list: readonly { limit: string; reason: string }[]) => list.map((o) => JSON.stringify([o.limit, o.reason])).sort();
  return JSON.stringify(form(a)) === JSON.stringify(form(b));
}

/**
 * The re-check sheet, for the fact-checker to read: the sources the items to judge cite, then each of those items in
 * the sheet's usual form. Under a traced item the words of the parts it traces to come as context: they give no verdict.
 */
export function renderRecheck(sheet: ClaimSheet, base: string, judging: Judging, path: string): string {
  const judge = new Set(judging.judge);
  const changed = new Set(judging.changed);
  const items = sheet.items.filter((item) => judge.has(item.key));
  const cited = new Set(items.flatMap((item) => item.cite.map((c) => c.source)));
  const lines = [`# Re-check sheet: ${sheet.slug}`, '', `Hash: \`${sheet.hash}\``, `Base: \`${base}\``, ''];
  lines.push(
    'A re-check judges only the items below: those that changed since the full check, and those that trace to a part that did. Judge each by every rule in your instructions. A part shown as context is for reading only: it gets no verdict, no heading and no quote in your report. Write `base` into your header as the Base above, and no `overrides` (the limit overrides are the full check\'s).',
    '',
    '## Sources',
    '',
  );
  const sources = sheet.sources.filter((s) => cited.has(s.id));
  for (const s of sources) lines.push(sourceLine(s));
  if (sources.length === 0) lines.push('- None.');
  lines.push('', `## Items to judge (${items.length})`);
  if (items.length === 0) {
    lines.push('', 'No item changed, and none traces to a part that did, so there is nothing to judge: the sheet changed only by what was taken out. Write the report with an empty `verdicts` and an empty `sources`.');
  }
  for (const item of items) {
    lines.push(...itemLines(item));
    for (const part of contextOf(sheet, item)) {
      lines.push('', `Context (no verdict): ${part.key} (${changed.has(part.key) ? 'changed' : 'not changed'} since the full check)`, '', '```json', JSON.stringify(part.content, null, 2), '```');
    }
  }
  lines.push('', `Write your report to: ${path}`);
  return `${lines.join('\n')}\n`;
}
