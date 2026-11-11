import { keysNeedingQuotes, quotesDigest, type Quote } from './quotes';
import { sha256 } from './sha256';
import type { ClaimSheet } from './sheet';

/** A report header as tests write it: the same shape `reportHeaderSchema` reads, loosely typed so a test can break it. */
export type LooseHeader = Record<string, unknown> & { verdicts: Record<string, string>; sources: Record<string, unknown>[] };

/**
 * A fact-check report for a sheet that passes the gate: every item ✅, every cited source current. `edit` changes the
 * header before it is written, so a test can break one thing at a time.
 */
export function reportFor(sheet: ClaimSheet, edit: (header: LooseHeader) => void = () => {}): string {
  const header: LooseHeader = {
    slug: sheet.slug,
    hash: sheet.hash,
    checked: '2026-11-08',
    checker: 'claude-opus-5-5',
    verdicts: Object.fromEntries(sheet.items.map((item) => [item.key, '✅'])),
    sources: sheet.sources.map((s) => ({ id: s.id, current: true, checked: '2026-11-08' })),
    overrides: sheet.overrides.map((o) => ({ limit: o.limit, reason: o.reason })),
  };
  edit(header);
  return ['# Fact check: ' + sheet.slug, '', '```json fact-check', JSON.stringify(header, null, 2), '```', '', 'Every item is supported.', ''].join('\n');
}

/**
 * A report in which every item with citations quotes its first citation (`passages` gives a key's lines; every other
 * quote is `Filler words.`), under a heading with the verdict the header gives it. No record in the header.
 */
export function reportQuoting(sheet: ClaimSheet, passages: Record<string, string[]> = {}, edit: (header: LooseHeader) => unknown = () => {}): string {
  const lines: string[] = [];
  let verdicts: Record<string, string> = {};
  const raw = reportFor(sheet, (h) => {
    void edit(h);
    verdicts = h.verdicts;
  });
  for (const key of keysNeedingQuotes(sheet)) {
    if (!Object.hasOwn(verdicts, key)) continue;
    const c = sheet.items.find((i) => i.key === key)!.cite[0]!;
    lines.push('', `### ${key} — ${verdicts[key]}`, '', `- \`${c.source}\` §${c.section}`, ...(passages[key] ?? ['Filler words.']).map((l) => `  > ${l}`));
  }
  return raw + lines.join('\n') + '\n';
}

/**
 * `reportQuoting` with a correct record in the header (count, digest and file hashes of its quotes, dated the header's
 * day), as the quote check would write it. `edit` runs after the record is set, so a test can break it.
 */
export function recordedReportFor(sheet: ClaimSheet, edit: (header: LooseHeader) => unknown = () => {}): string {
  const blank = { checked: '2026-11-08', count: 0, digest: '0'.repeat(64), files: {} };
  const seen = reportFor(sheet, (h) => {
    h.quotes = blank;
    void edit(h);
  });
  const verdicts: Record<string, string> = JSON.parse(/```json fact-check\n([\s\S]*?)\n```/.exec(seen)![1]!).verdicts;
  const quotes: Quote[] = keysNeedingQuotes(sheet)
    .filter((key) => Object.hasOwn(verdicts, key))
    .map((key) => {
      const c = sheet.items.find((i) => i.key === key)!.cite[0]!;
      return { key, source: c.source, section: c.section, passage: 'Filler words.' };
    });
  return reportQuoting(sheet, {}, (h) => {
    h.quotes = {
      checked: '2026-11-08',
      count: quotes.length,
      digest: quotesDigest(quotes),
      files: Object.fromEntries([...new Set(quotes.map((q) => q.source))].map((id) => [id, sha256(id)])),
    };
    edit(h);
  });
}
