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

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be a date like 2026-11-08');

export const reportHeaderSchema = z.strictObject({
  slug: z.string().min(1),
  /** The claim sheet's hash when it was checked. */
  hash: z.string().regex(/^[0-9a-f]{64}$/, 'must be 64 lowercase hex digits'),
  checked: day,
  /** The model that checked it. */
  checker: z.string().min(1),
  /** A verdict for every item of the claim sheet, by key. */
  verdicts: z.record(z.string(), z.enum(VERDICTS)),
  /** Every cited source, and whether it was found current, on what day. */
  sources: z.array(z.strictObject({ id: z.string().min(1), current: z.boolean(), checked: day, note: z.string().optional() })),
  /** The lesson's limit overrides, as the report lists them. */
  overrides: z.array(z.strictObject({ limit: z.string().min(1), reason: z.string().min(1) })),
});
export type ReportHeader = z.infer<typeof reportHeaderSchema>;

const HEADER = /^```json fact-check[ \t]*\r?\n([\s\S]*?)\r?\n```/m;

/** Reads a report's header, or says why it cannot be read. */
export function parseReport(raw: string): { header: ReportHeader; issues: [] } | { header?: undefined; issues: string[] } {
  const match = HEADER.exec(raw);
  if (match === null) return { issues: [`it has no header: a fenced block opening with ${REPORT_FENCE}`] };
  let json: unknown;
  try {
    json = JSON.parse(match[1]!);
  } catch (e) {
    return { issues: [`its header is not valid JSON (${(e as Error).message})`] };
  }
  const parsed = reportHeaderSchema.safeParse(json);
  if (!parsed.success) {
    return { issues: parsed.error.issues.map((i) => `its header's ${i.path.join('.') || 'value'} ${i.message}`) };
  }
  return { header: parsed.data, issues: [] };
}
