import { parseReport, VERDICTS } from './report';
import { sha256 } from './sha256';
import type { ClaimSheet } from './sheet';

/**
 * The quotes in a fact-check report. Under a claim's heading, `### <key> — <verdict>`, each quote is a bullet naming the
 * source and the section, then the passage as lines that start with `>`:
 *
 *     - `itu-x200` §6.1.2
 *       > The Reference Model contains seven layers: …
 *
 * The id is the source's id in the registry; the section is everything after `§`. The passage is the `>` lines
 * straight after the bullet, joined by single spaces. A comment is its own bullet beginning `Note:`; plain text lines
 * are allowed. Everything else under a claim's heading is a problem, so a badly written quote cannot pass as a comment.
 * Every `###` heading is a claim's heading, and outside one nothing is quoted. See docs/content-model.md §8.
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

const CLAIM_HEADING = new RegExp(`^###[ \\t]+(.+)[ \\t]+—[ \\t]+(${VERDICTS.join('|')})[ \\t]*$`);
const ANY_HEADING = /^#{1,6}[ \t]/;
const BULLET_LIKE = /^[ \t]*(?:[-*+]|\d+[.)])[ \t]/;
const QUOTE_BULLET = /^- `([^`]+)` §(.*)$/;
const PASSAGE_LINE = /^[ \t]*>[ \t]?(.*)$/;

/** Every run of whitespace made one space, and the ends trimmed. */
export const evenWhitespace = (text: string): string => text.replace(/\s+/g, ' ').trim();

/** The sheet keys that need a quote when their verdict passes: every item that has citations. */
export const keysNeedingQuotes = (sheet: ClaimSheet): string[] => sheet.items.filter((item) => item.cite.length > 0).map((item) => item.key);

/** Reads a report's quotes in order, or names every problem that stops them being read. */
export function parseQuotes(raw: string, sheet: ClaimSheet): { quotes: Quote[]; issues: [] } | { quotes?: undefined; issues: string[] } {
  const parsed = parseReport(raw);
  if (parsed.header === undefined) return { issues: parsed.issues };
  const verdicts = parsed.header.verdicts;
  const items = new Map(sheet.items.map((item) => [item.key, item]));
  const seen = new Set<string>();
  const quotes: Quote[] = [];
  const issues: string[] = [];
  const lines = raw.split(/\r?\n/);

  /** The claim whose heading the lines belong to; undefined outside one, or under a heading that could not be read. */
  let key: string | undefined;
  /** Under a `###` heading that could not be read: its own problem is named, so its lines are not named again. */
  let unread = false;
  let item: ClaimSheet['items'][number] | undefined;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (/^###[ \t]/.test(line)) {
      key = item = undefined;
      unread = true;
      const heading = CLAIM_HEADING.exec(line);
      if (heading === null) {
        issues.push(`The heading "${clip(line)}" is not a claim heading; write it as "### <key> — <verdict>" with the verdict ✅, ⚠️ or ❌ after an em dash`);
        continue;
      }
      const [, name, verdict] = heading as unknown as [string, string, string];
      if (!items.has(name)) {
        issues.push(`"${name}" is not an item on the claim sheet; fix the heading to a key the sheet lists, or remove the section`);
      } else if (seen.has(name)) {
        issues.push(`"${name}" has two headings; merge them into one`);
      } else {
        if (Object.hasOwn(verdicts, name) && verdicts[name] !== verdict) {
          issues.push(`"${name}" is headed ${verdict} but the header's verdict for it is ${verdicts[name]}; make them the same`);
        }
        key = name;
        item = items.get(name);
        unread = false;
      }
      seen.add(name);
      continue;
    }
    if (ANY_HEADING.test(line)) {
      if (key !== undefined && line.startsWith('####')) issues.push(`"${key}" has a deeper heading (${clip(line)}); a claim's section has no sub-headings, so make it text or a "Note:" bullet`);
      else if (!line.startsWith('####')) {
        key = item = undefined;
        unread = false;
      }
      continue;
    }
    if (key === undefined || item === undefined) {
      // Outside every claim's heading nothing is quoted: a passage there would never be checked.
      if (!unread && (PASSAGE_LINE.test(line) || QUOTE_BULLET.test(line))) {
        issues.push(`A quote outside a claim's heading (${clip(line)}); a source's words are quoted only under the heading of the claim they support, so move it there or say it in your own words`);
      }
      continue;
    }
    if (PASSAGE_LINE.test(line)) {
      issues.push(`"${key}" has a ">" line that is not part of a quote (${clip(line)}); put it straight after its quote's bullet with no blank line between, or take the ">" off`);
      continue;
    }
    if (!BULLET_LIKE.test(line)) continue;
    const quote = QUOTE_BULLET.exec(line);
    if (quote === null && line.startsWith('- ')) {
      if (!line.startsWith('- Note:')) {
        issues.push(`"${key}" has a bullet that is not a quote and does not begin "Note:" (${clip(line)}); write it as - \`<source id>\` §<section>, then the passage on lines that start with ">", or begin it "Note:"`);
      }
      continue;
    }
    if (quote === null) {
      issues.push(`"${key}" has a bullet that is indented, nested, numbered or not "- " (${clip(line)}); a quote or a note starts its line with "- "`);
      continue;
    }
    const source = quote[1]!;
    const section = quote[2]!.trim();
    const passage: string[] = [];
    while (i + 1 < lines.length && PASSAGE_LINE.test(lines[i + 1]!)) passage.push(PASSAGE_LINE.exec(lines[++i]!)![1]!);
    // A reader sees a plain line straight after a ">" line as more of the quote (Markdown runs it on), so it must be one.
    const after = lines[i + 1] ?? '';
    if (passage.length > 0 && after.trim() !== '' && !ANY_HEADING.test(after) && !BULLET_LIKE.test(after)) {
      issues.push(`"${key}", quote from ${quote[1]} §${quote[2]!.trim()}, is followed by a line that does not start with ">" (${clip(after)}); start it with ">" if it is part of the passage, or put a blank line before it`);
    }
    const words = evenWhitespace(passage.join(' '));
    const where = `"${key}", quote from ${source} §${section}`;
    if (item.cite.length === 0) {
      issues.push(`${where}: this item cites nothing, so it quotes nothing; write the line as a "Note:" bullet, or take it out`);
      continue;
    }
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
