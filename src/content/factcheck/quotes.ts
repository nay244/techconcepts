import { sha256 } from './sha256';
import type { ClaimSheet } from './sheet';

/**
 * The quotes in a fact-check report. Under a claim's heading, `### <key> — <verdict>`, each quote is a bullet naming
 * the source and the section, then the passage as one or more lines that start with `>`:
 *
 *     - `itu-x200` §6.1.2 (defining standard)
 *       > The Reference Model contains seven layers: …
 *
 * The id is the source's id in the registry; the section follows `§` and runs to the end of the line or to a note in
 * parentheses. The passage is the `>` lines joined by single spaces. Any other bullet under a claim heading must begin
 * `Note:`, so a badly written quote cannot pass as a comment. Text outside claim headings is left alone.
 * See docs/content-model.md §8.
 */

export interface Quote {
  /** The claim's key, as the heading writes it and the sheet lists it. */
  key: string;
  /** The source's id in the registry. */
  source: string;
  /** The section the passage is in, as the item's citation writes it. */
  section: string;
  /** The passage, its `>` lines joined by single spaces. `…` marks words left out. */
  passage: string;
}

const CLAIM_HEADING = /^###[ \t]+(.+?)[ \t]+—[ \t]+\S.*$/;
const ANY_HEADING = /^#{1,6}[ \t]/;
const BULLET = /^[-*][ \t]+(.*)$/;
const QUOTE_BULLET = /^`([^`]+)`[ \t]+§[ \t]*(.*?)(?:[ \t]+\([^)]*\))?[ \t]*$/;
const PASSAGE_LINE = /^[ \t]*>[ \t]?(.*)$/;

/** Every run of whitespace made one space, and the ends trimmed. */
export const evenWhitespace = (text: string): string => text.replace(/\s+/g, ' ').trim();

/** Reads a report's quotes in order, or names every problem that stops a quote being read. */
export function parseQuotes(raw: string, sheet: ClaimSheet): { quotes: Quote[]; issues: [] } | { quotes?: undefined; issues: string[] } {
  const items = new Map(sheet.items.map((item) => [item.key, item]));
  const quotes: Quote[] = [];
  const issues: string[] = [];
  const lines = raw.split(/\r?\n/);

  let key: string | undefined;
  let item = undefined as ClaimSheet['items'][number] | undefined;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const heading = CLAIM_HEADING.exec(line);
    if (heading !== null) {
      key = heading[1]!;
      item = items.get(key);
      if (item === undefined) issues.push(`"${key}" is not an item on the claim sheet; fix the heading to a key the sheet lists, or remove the section`);
      continue;
    }
    if (ANY_HEADING.test(line)) {
      key = undefined;
      continue;
    }
    if (key === undefined || item === undefined) continue;
    const bullet = BULLET.exec(line);
    if (bullet === null) continue;
    const text = bullet[1]!;
    if (text.startsWith('Note:')) continue;
    const quote = QUOTE_BULLET.exec(text);
    if (quote === null) {
      issues.push(`"${key}" has a bullet that is not a quote and does not begin "Note:" (${clip(text)}); write it as - \`<source id>\` §<section>, then the passage on lines that start with ">", or begin it "Note:"`);
      continue;
    }
    const source = quote[1]!;
    const section = quote[2]!.trim();
    const passage: string[] = [];
    while (i + 1 < lines.length && PASSAGE_LINE.test(lines[i + 1]!)) passage.push(PASSAGE_LINE.exec(lines[++i]!)![1]!);
    const words = evenWhitespace(passage.join(' '));
    const where = `"${key}", quote from ${source} §${section}`;
    if (passage.length === 0) {
      issues.push(`${where}, has no passage; put the source's words on the lines after the bullet, each starting with ">"`);
    } else if (words === '') {
      issues.push(`${where}, has an empty passage; put the source's words after the ">"`);
    }
    const cited = item.cite.filter((c) => c.source === source);
    if (cited.length === 0) {
      issues.push(`${where}, is from a source this item does not cite (it cites ${list(item.cite.map((c) => c.source))}); quote one of its citations, or take the quote out`);
    } else if (!cited.some((c) => c.section === section)) {
      issues.push(`${where}, is from a section this item does not cite in ${source} (it cites ${list(cited.map((c) => `§${c.section}`))}); use one of those sections, or take the quote out`);
    }
    if (words !== '') quotes.push({ key, source, section, passage: words });
  }
  return issues.length > 0 ? { issues } : { quotes, issues: [] };
}

/** The first words of a line, for a message. */
const clip = (text: string): string => (text.length > 60 ? `${text.slice(0, 57)}...` : text);
const list = (values: readonly string[]): string => [...new Set(values)].join(', ');

/**
 * SHA-256, lowercase hex, of the quotes in order: each one's key, source, section and passage, the passage with every
 * run of whitespace made one space. Changing a word, a section, the order or a key changes it; line breaks do not.
 */
export function quotesDigest(quotes: readonly Quote[]): string {
  return sha256(JSON.stringify(quotes.map((q) => [q.key, q.source, q.section, evenWhitespace(q.passage)])));
}
