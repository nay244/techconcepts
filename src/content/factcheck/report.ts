import { z } from 'zod';

/**
 * A fact-check report, `docs/fact-checks/<slug>.md` (fact-checker design §6.2), is written only by the fact-checker
 * agent. The build reads its header: the first fenced block whose info string is exactly `json fact-check`. The rest
 * of the file is for people: each item's quoted passages and how each source was found current.
 */

/** The three verdicts, exactly: ✅ supported, ⚠️ imprecise (U+26A0 U+FE0F), ❌ wrong. Nothing else is read as one. */
export const VERDICTS = ['✅', '⚠️', '❌'] as const;
export type Verdict = (typeof VERDICTS)[number];

export const REPORT_FENCE = '```json fact-check';

const hex64 = z.string().regex(/^[0-9a-f]{64}$/, 'must be 64 lowercase hex digits');
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be a date like 2026-11-08');

/** What the quote check found, written by the script and never by hand: see `quotes.ts`. */
const quotesRecord = z.strictObject({
  checked: day,
  count: z.number().int().nonnegative(),
  /** SHA-256 of the report's quotes in order (`quotesDigest`). */
  digest: hex64,
  /** SHA-256 of each source text the passages were found in, by source id. */
  files: z.record(z.string(), hex64),
});

/** Every cited source, and whether it was found current, on what day. */
const sourcesList = z.array(z.strictObject({ id: z.string().min(1), current: z.boolean(), checked: day, note: z.string().optional() }));

export const reportHeaderSchema = z.strictObject({
  slug: z.string().min(1),
  /** The claim sheet's hash when it was checked. */
  hash: hex64,
  checked: day,
  /** The model that checked it. */
  checker: z.string().min(1),
  /** A verdict for every item of the claim sheet, by key. */
  verdicts: z.record(z.string(), z.enum(VERDICTS)),
  sources: sourcesList,
  /** The lesson's limit overrides, as the report lists them. */
  overrides: z.array(z.strictObject({ limit: z.string().min(1), reason: z.string().min(1) })),
  quotes: quotesRecord.optional(),
  /**
   * Each item's own hash by its key, as the sheet had it when the report's hash was the sheet's hash (`itemHashes`).
   * Written by the script and never by hand (the quote check, or `--stamp`): a targeted re-check reads it to see which
   * items changed. See `recheck.ts`.
   */
  items: z.record(z.string(), hex64).optional(),
  /** SHA-256 of the lesson's limit overrides, every field of each, written beside `items` (`limitsHash`). */
  limits: hex64.optional(),
});
export type ReportHeader = z.infer<typeof reportHeaderSchema>;

/**
 * A targeted re-check's header (`docs/fact-checks/<slug>.recheck.md`): the same form as a full report's, for the items it
 * judged only, with `base`, the full report's hash, and without `overrides` (the lesson's are the full report's) or
 * an `items` record.
 */
export const recheckHeaderSchema = z.strictObject({
  slug: z.string().min(1),
  /** The hash of the full report this re-check was made against. */
  base: hex64,
  /** The claim sheet's hash when it was re-checked. */
  hash: hex64,
  checked: day,
  checker: z.string().min(1),
  /** A verdict for each item it judged, by key. */
  verdicts: z.record(z.string(), z.enum(VERDICTS)),
  sources: sourcesList,
  quotes: quotesRecord.optional(),
});
export type RecheckHeader = z.infer<typeof recheckHeaderSchema>;

export const HEADER = /^```json fact-check[ \t]*\r?\n([\s\S]*?)\r?\n```/m;

/** Reads a full report's header, or says why it cannot be read. */
export function parseReport(raw: string): { header: ReportHeader; issues: [] } | { header?: undefined; issues: string[] } {
  return parseWith(reportHeaderSchema, raw);
}

/** Reads a re-check report's header, or says why it cannot be read. */
export function parseRecheck(raw: string): { header: RecheckHeader; issues: [] } | { header?: undefined; issues: string[] } {
  return parseWith(recheckHeaderSchema, raw);
}

function parseWith<T extends { verdicts: Record<string, string>; sources: { id: string }[] }>(
  schema: z.ZodType<T>,
  raw: string,
): { header: T; issues: [] } | { header?: undefined; issues: string[] } {
  const match = HEADER.exec(raw);
  if (match === null) return { issues: [`it has no header: a fenced block opening with ${REPORT_FENCE}`] };
  let json: unknown;
  try {
    json = JSON.parse(match[1]!);
  } catch (e) {
    return { issues: [`its header is not valid JSON (${(e as Error).message})`] };
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return {
      issues: parsed.error.issues.map((i) =>
        i.code === 'unrecognized_keys' ? `its header has ${i.keys.map((k) => `"${k}"`).join(', ')}, which it cannot have; take ${i.keys.length === 1 ? 'it' : 'them'} out` : `its header's ${i.path.join('.') || 'value'} ${i.message}`,
      ),
    };
  }
  const twice = [
    ...repeated(keysIn(match[1]!, 'verdicts')).map((k) => `its header's verdicts list "${k}" more than once`),
    ...repeated(keysIn(match[1]!, 'items')).map((k) => `its header's items list "${k}" more than once`),
    ...repeated(parsed.data.sources.map((s) => s.id)).map((id) => `its header's sources list "${id}" more than once`),
    ...repeated(topLevelKeys(match[1]!)).map((k) => `its header has "${k}" more than once`),
  ];
  if (twice.length > 0) return { issues: twice };
  return { header: parsed.data, issues: [] };
}

/** The values that appear more than once, in first-seen order. */
function repeated(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const again = new Set<string>();
  for (const v of values) (seen.has(v) ? again : seen).add(v);
  return [...again];
}

/**
 * The keys the header's JSON text writes in the object that is the value of its top-level `field`, in order, decoded.
 * `JSON.parse` keeps only the last of two equal keys, so a ❌ followed by a ✅ for the same item would read as ✅. Only
 * that object is read: the same claim-sheet key is a key of `verdicts` and of `items`, and that is not a repeat.
 */
function keysIn(json: string, field: string): string[] {
  const keys: string[] = [];
  let depth = 0;
  let current: string | undefined;
  for (let i = 0; i < json.length; i++) {
    const ch = json[i]!;
    if (ch === '"') {
      let j = i + 1;
      while (json[j] !== '"') j += json[j] === '\\' ? 2 : 1;
      if (/^\s*:/.test(json.slice(j + 1))) {
        const key = JSON.parse(json.slice(i, j + 1)) as string;
        if (depth === 1) current = key;
        else if (depth === 2 && current === field) keys.push(key);
      }
      i = j;
    } else if (ch === '{' || ch === '[') depth++;
    else if (ch === '}' || ch === ']') depth--;
  }
  return keys;
}

/** The keys the header's JSON text writes directly in its own object, in order, decoded; `JSON.parse` keeps only the last of two equal ones. */
function topLevelKeys(json: string): string[] {
  const keys: string[] = [];
  let depth = 0;
  for (let i = 0; i < json.length; i++) {
    const ch = json[i]!;
    if (ch === '"') {
      let j = i + 1;
      while (json[j] !== '"') j += json[j] === '\\' ? 2 : 1;
      if (depth === 1 && /^\s*:/.test(json.slice(j + 1))) keys.push(JSON.parse(json.slice(i, j + 1)) as string);
      i = j;
    } else if (ch === '{' || ch === '[') depth++;
    else if (ch === '}' || ch === ']') depth--;
  }
  return keys;
}
