import { isGroupSlug, itemHashes, itemLines, sourceLine, type ClaimSheet, type SheetItem } from './sheet';

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

/** Whether a full report's verdicts are a near-pass, and how many items did not pass, and how many are wrong. */
export function nearPass(verdicts: Readonly<Record<string, string>>): { ok: boolean; notPassing: number; wrong: number } {
  const failing = Object.values(verdicts).filter((v) => v !== '✅');
  const wrong = failing.filter((v) => v === '❌').length;
  return { ok: failing.length <= NEAR_PASS_MAX_FAILING && wrong === 0, notPassing: failing.length, wrong };
}

export interface Judging {
  /** The items that changed since the full check, in the sheet's order. */
  changed: string[];
  /** The items that did not change but are judged anyway (they trace to a changed part, or belong to a changed question, or rest on the whole lesson), in the sheet's order. */
  pulled: string[];
  /** Every item to judge, changed or pulled, in the sheet's order. */
  judge: string[];
}

/** An item's place in the lesson, read from its key: the list it is in and where, and the stable parent of that list. */
interface Slot {
  /** Which list the item is in, under which parent: a step is named by its id, a question by its id. `''` for an item that is in no list. */
  group: string;
  /** Where in the list. */
  index: number;
  /** What follows the path in the key: the item's id or label. */
  tail: string;
}

/** A step's or question's id by its place (`units[0].steps[1]`), read from keys: the stable name of a parent whose index can shift. */
function parentIds(keys: readonly string[]): Map<string, string> {
  const ids = new Map<string, string>();
  for (const key of keys) {
    const step = /^(units\[\d+\]\.steps\[\d+\]) \(step "([^"]+)"\)$/.exec(key);
    if (step !== null) ids.set(step[1]!, `${step[1]!.replace(/\.steps\[\d+\]$/, '')} step "${step[2]}"`);
    const question = /^(units\[\d+\]\.practice\[\d+\])\.(?:prompt|options\[\d+\]) \(question "([^"]+)"\)$/.exec(key);
    if (question !== null) ids.set(question[1]!, `${question[1]!.replace(/\.practice\[\d+\]$/, '')} question "${question[2]}"`);
  }
  return ids;
}

/**
 * Where a key puts an item. An item in a list (`...events[1] (event "m2")`) is in the list named by its path without the
 * last index, under its parent: a step or a question is named by its id, so the same list is the same list however the
 * numbers shifted, and an event under another step is in another list. An item in no list (`title`, `...prompt (question
 * "q1")`) has no group and only ever matches its own key.
 */
function slotOf(key: string, ids: ReadonlyMap<string, string>): Slot {
  const space = key.indexOf(' ');
  const path = space < 0 ? key : key.slice(0, space);
  const tail = space < 0 ? '' : key.slice(space);
  const dot = path.lastIndexOf('.');
  const last = /^(.*)\[(\d+)\]$/.exec(path.slice(dot + 1));
  if (dot < 0 || last === null) return { group: '', index: -1, tail };
  const parent = path.slice(0, dot).replace(/units\[\d+\]\.(?:steps|practice)\[\d+\]/g, (place) => ids.get(place) ?? place);
  return { group: `${parent}.${last[1]}`, index: Number(last[2]), tail };
}

/** Which question an item belongs to, with its unit: the prompt and every option of one are one unit. */
const QUESTION = /^(units\[\d+\])\.practice\[\d+\]\.(?:prompt|options\[\d+\]) \(question "([^"]+)"\)$/;
const questionOf = (key: string): string | undefined => {
  const m = QUESTION.exec(key);
  return m === null ? undefined : `${m[1]} ${m[2]}`;
};

/** Which entry of a glossary group an item belongs to: the id in `entry "<id>"`, so `ttl` and `ttl-dns` are two entries. */
const entryOf = (key: string): string | undefined => /^entry "([^"]+)"/.exec(key)?.[1];

/** The pairs (i, j) of a longest common subsequence of two lists of labels, earliest first. */
function commonSubsequence(a: readonly string[], b: readonly string[]): [number, number][] {
  const n = a.length;
  const m = b.length;
  const len = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) len[i]![j] = a[i] === b[j] ? len[i + 1]![j + 1]! + 1 : Math.max(len[i + 1]![j]!, len[i]![j + 1]!);
  }
  const pairs: [number, number][] = [];
  for (let i = 0, j = 0; i < n && j < m; ) {
    if (a[i] === b[j]) pairs.push([i++, j++]);
    else if (len[i + 1]![j]! >= len[i]![j + 1]!) i++;
    else j++;
  }
  return pairs;
}

/**
 * Which item of the full report's `items` record each unchanged item of the sheet is, by key (the value is the key the
 * full report knew it by, which is the key of its verdict there), and which entries of the record no item matched.
 *
 * An item in no list is unchanged when the record has its hash under its own key. An item in a list is unchanged when
 * it is in the same list of the same parent (a step or a question by its id; so an event under another step is in
 * another list), has the same hash and the same id, and is in the longest common subsequence of the list as it was and
 * as it is: the unchanged items of a list keep the order they had, so a moved item, or one of two reordered, is not
 * matched, and nothing can pair an item with a copy of itself elsewhere. Items whose index only shifted (a part
 * inserted or taken out before them) are matched, since the order holds. Two entries with the same id and hash in one list
 * are interchangeable: the earlier ones of each side pair first.
 */
function matchItems(items: Readonly<Record<string, string>>, sheet: ClaimSheet): { matched: Map<string, string>; removed: string[] } {
  const now = itemHashes(sheet);
  const baseIds = parentIds(Object.keys(items));
  const nowIds = parentIds(sheet.items.map((item) => item.key));
  const matched = new Map<string, string>();
  const taken = new Set<string>();
  const lists = (keys: readonly string[], ids: ReadonlyMap<string, string>) => {
    const groups = new Map<string, { key: string; slot: Slot }[]>();
    for (const key of keys) {
      const slot = slotOf(key, ids);
      if (slot.group === '') continue;
      groups.set(slot.group, [...(groups.get(slot.group) ?? []), { key, slot }].sort((x, y) => x.slot.index - y.slot.index));
    }
    return groups;
  };
  for (const item of sheet.items) {
    if (slotOf(item.key, nowIds).group === '' && Object.hasOwn(items, item.key) && items[item.key] === now[item.key]) {
      matched.set(item.key, item.key);
      taken.add(item.key);
    }
  }
  const before = lists(Object.keys(items), baseIds);
  for (const [group, current] of lists(sheet.items.map((item) => item.key), nowIds)) {
    const was = before.get(group) ?? [];
    const label = (side: { key: string; slot: Slot }, hash: string | undefined) => `${side.slot.tail}\n${hash}`;
    const pairs = commonSubsequence(
      was.map((w) => label(w, items[w.key])),
      current.map((c) => label(c, now[c.key])),
    );
    for (const [i, j] of pairs) {
      matched.set(current[j]!.key, was[i]!.key);
      taken.add(was[i]!.key);
    }
  }
  return { matched, removed: Object.keys(items).filter((key) => !taken.has(key)) };
}

/** Which item of the full report each unchanged item of the sheet is, by key; an item with no entry is changed (`matchItems`). */
export const matchBase = (items: Readonly<Record<string, string>>, sheet: ClaimSheet): Map<string, string> => matchItems(items, sheet).matched;

/**
 * Which items the sheet has now that a re-check judges, given the full report's `items` record (key to hash):
 * - the changed items, those `matchItems` finds no entry for;
 * - every traced item that traces to a part that is changed;
 * - a question is one unit: when its prompt or any option changed, or an option was taken out, its prompt and every option;
 * - when any Learn part is changed or was taken out, the items that cite nothing and rest on the whole lesson (the
 *   title, the unit's name, each question's prompt). A prompt judged for that reason alone does not bring its options.
 */
export function itemsToJudge(items: Readonly<Record<string, string>>, sheet: ClaimSheet): Judging {
  const { matched, removed } = matchItems(items, sheet);
  const changed = sheet.items.filter((item) => !matched.has(item.key)).map((item) => item.key);
  const changedSet = new Set(changed);
  const extra = new Set<string>();
  if (isGroupSlug(sheet.slug)) {
    // A group has no traces, questions or Learn parts: an entry is judged whole when any of its items changed or was taken out.
    const entries = new Set([...changed, ...removed].flatMap((key) => entryOf(key) ?? []));
    for (const item of sheet.items) if (entries.has(entryOf(item.key) ?? '')) extra.add(item.key);
  } else {
    const targets = traceTargets(sheet);
    for (const item of sheet.items) if (item.traces.some((id) => changedSet.has(targets.get(id)?.key ?? ''))) extra.add(item.key);
    const questions = new Set([...changed, ...removed].flatMap((key) => questionOf(key) ?? []));
    for (const item of sheet.items) if (questions.has(questionOf(item.key) ?? '')) extra.add(item.key);
    // A Learn part taken out counts too: what rested on the whole lesson rested on it.
    if ([...changed, ...removed].some((key) => LEARN_ID.test(key))) for (const item of sheet.items) if (item.kind === 'unbacked') extra.add(item.key);
  }
  const pulled = sheet.items.filter((item) => !changedSet.has(item.key) && extra.has(item.key)).map((item) => item.key);
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

/**
 * Each message the re-check commands and the gate share, for the path of the file they speak of. A message that speaks
 * of a lesson takes, for a glossary group (a `slug` that starts `glossary/`), the same words about the group
 * (docs/glossary-path-spec.md, E7); with no `slug` it is the lesson's, byte for byte.
 */
export const recheckMessages = {
  noItems: (path: string, slug: string): string =>
    `${path}: has no items record with a limits hash, so a re-check cannot tell what changed; run npm run fact-check -- ${slug} --stamp at the commit it was checked on, or run a full check (docs/content-model.md §8).`,
  notNearPass: (path: string, near: { notPassing: number; wrong: number }, slug = ''): string =>
    `${path}: the full check was not a near-pass (${near.notPassing} ${near.notPassing === 1 ? 'item' : 'items'} did not pass, ${near.wrong} wrong (❌); a re-check needs at most ${NEAR_PASS_MAX_FAILING} not passing and none wrong); fix the ${isGroupSlug(slug) ? 'group' : 'lesson'}, then run a full check (docs/content-model.md §8).`,
  tooMany: (path: string, count: number): string =>
    `${path}: ${count} items to judge, more than ${RECHECK_MAX_ITEMS}; a re-check is for a few changed items, so run a full check (docs/content-model.md §8).`,
  overrides: (path: string, lesson: string, report: string, slug = ''): string =>
    `${path}: the ${isGroupSlug(slug) ? 'group' : 'lesson'}'s limit overrides are not those of the full report (hash ${clip(lesson)}, the report's ${clip(report)}: a limit, a bound or a reason changed); a re-check does not judge a limit, so run a full check (docs/content-model.md §8).`,
  changedSince: (path: string, then: string, now: string, slug = ''): string =>
    isGroupSlug(slug)
      ? `${path}: the glossary group "${slug.slice('glossary/'.length)}" changed since it was re-checked (re-check ${clip(then)}, group ${clip(now)}); run the re-check again, against the same full check (docs/content-model.md §8).`
      : `${path}: the lesson changed since it was re-checked (re-check ${clip(then)}, lesson ${clip(now)}); run the re-check again, against the same full check (docs/content-model.md §8).`,
};

/**
 * The re-check sheet, for the fact-checker to read: the sources the items to judge cite, then each of those items in
 * the sheet's usual form. Under a traced item the words of the parts it traces to come as context: they give no verdict.
 * So do every cited Learn part, when an item that rests on the whole lesson is judged, and the list each judged item
 * sits in, with its parent's words, in the order it has now.
 */
export function renderRecheck(sheet: ClaimSheet, base: string, judging: Judging, path: string): string {
  const judge = new Set(judging.judge);
  const changed = new Set(judging.changed);
  const items = sheet.items.filter((item) => judge.has(item.key));
  const cited = new Set(items.flatMap((item) => item.cite.map((c) => c.source)));
  const group = isGroupSlug(sheet.slug);
  const lines = [`# Re-check sheet: ${sheet.slug}`, '', `Hash: \`${sheet.hash}\``, `Base: \`${base}\``, ''];
  lines.push(
    group
      ? 'Judge only the items below: those that changed since the full check, and every item of an entry any of whose items changed or was taken out. Every other item keeps its verdict from the full check.\n\nJudge each by every rule in your instructions. Write `base` into your header as the Base above, and no `overrides` (a group has none).'
      : 'A re-check judges only the items below: those that changed since the full check (an item that moved counts as changed, and is judged in its place), those that trace to a part that did, a whole question when any of it changed, and the items that rest on the whole lesson when a Learn part changed or was taken out. Judge each by every rule in your instructions. A part shown as context is for reading only: it gets no verdict, no heading and no quote in your report. Write `base` into your header as the Base above, and no `overrides` (the limit overrides are the full check\'s).',
    '',
    '## Sources',
    '',
  );
  const sources = sheet.sources.filter((s) => cited.has(s.id));
  for (const s of sources) lines.push(sourceLine(s));
  if (sources.length === 0) lines.push('- None.');
  lines.push('', `## Items to judge (${items.length})`);
  if (items.length === 0) {
    lines.push('', 'No item on the sheet changed since the full check, so there is nothing to judge. Write the report with an empty `verdicts` and an empty `sources`.');
  }
  for (const item of items) {
    lines.push(...itemLines(item));
    for (const part of contextOf(sheet, item)) {
      lines.push('', `Context (no verdict): ${part.key} (${changed.has(part.key) ? 'changed' : 'not changed'} since the full check)`, '', '```json', JSON.stringify(part.content, null, 2), '```');
    }
  }
  // An item that rests on the whole lesson is judged against every cited Learn part, which the checker reads and does not judge.
  if (!group && items.some((item) => item.kind === 'unbacked')) {
    lines.push('', '## Learn parts, as context (no verdict)');
    for (const part of sheet.items.filter((item) => LEARN_ID.test(item.key) && item.cite.length > 0)) {
      lines.push('', `Context (no verdict): ${part.key}`, '', '```json', JSON.stringify(part.content, null, 2), '```');
    }
  }
  // An item in a list is judged in its place: its parent's words and the list in the order it has now, since a key's
  // numbers do not say which step an event is under or what comes before it.
  const ids = parentIds(sheet.items.map((item) => item.key));
  const lists = new Map<string, SheetItem[]>();
  for (const item of sheet.items) {
    const { group } = slotOf(item.key, ids);
    if (group !== '') lists.set(group, [...(lists.get(group) ?? []), item]);
  }
  const places = group ? [] : [...lists.values()].filter((list) => list.some((item) => judge.has(item.key)));
  if (places.length > 0) {
    lines.push('', '## Where the items to judge sit, as context (no verdict)', '', 'An item in a list is judged in its place. Each list below is in the order it has now; an item marked "to judge" is printed in full above.');
    for (const list of places) {
      const parent = parentOf(sheet, list[0]!.key);
      // Not a heading: on this sheet a heading is an item to judge.
      lines.push('', parent === undefined ? `**The list of ${list[0]!.key.replace(/\[\d+\][^[]*$/, '')}**` : `**Under ${parent.key}**`);
      if (parent !== undefined) lines.push('', '```json', JSON.stringify(parent.content, null, 2), '```');
      lines.push('');
      for (const item of list) {
        if (judge.has(item.key)) lines.push(`- ${item.key} (to judge)`);
        else lines.push(`- ${item.key}`, '', '  ```json', ...JSON.stringify(item.content, null, 2).split('\n').map((line) => `  ${line}`), '  ```');
      }
    }
  }
  lines.push('', `Write your report to: ${path}`);
  return `${lines.join('\n')}\n`;
}

/** The step a step's part sits under, or the prompt of an option's question; undefined for a list with no parent on the sheet. */
function parentOf(sheet: ClaimSheet, key: string): SheetItem | undefined {
  const step = /^(units\[\d+\]\.steps\[\d+\])\./.exec(key);
  if (step !== null) return sheet.items.find((item) => item.key.startsWith(`${step[1]} (step "`));
  const question = /^(units\[\d+\]\.practice\[\d+\])\.options\[/.exec(key);
  if (question !== null) return sheet.items.find((item) => item.key.startsWith(`${question[1]}.prompt (question "`));
  return undefined;
}
