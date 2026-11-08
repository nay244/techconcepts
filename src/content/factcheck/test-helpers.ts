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
