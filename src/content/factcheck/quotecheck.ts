import { evenWhitespace, keysNeedingQuotes, parseQuotes, quotesDigest, type Quote } from './quotes';
import { HEADER, parseRecheck, parseReport, type ReportHeader } from './report';
import { sha256 } from './sha256';
import { itemHashes, limitsHash, type ClaimSheet } from './sheet';

/**
 * The quote check: every passage a report quotes is looked for in the saved text of the source it names, and when all
 * are found the report's header gets the record of that (`quotes`, see report.ts). It reads no file: the command hands
 * it the report's text and the folder's files, so it runs the same in tests and in the script. See docs/content-model.md §8.
 */

/** A file in the fact-checker's folder: its name, and its text as read. */
export interface SourceFile {
  name: string;
  text: string;
}

/** Takes the text from a saved `.html` or `.xml` file (see pagetext.ts, which needs jsdom, so the command passes it in). */
export type PageText = (name: string, raw: string) => string;

export type QuoteRecord = NonNullable<ReportHeader['quotes']>;

/** On success: the record, the report's new text, and the items record too when the quote check wrote one (a full report whose hash is the sheet's). */
export type QuoteCheck = { issues: string[]; record?: undefined; report?: undefined; items?: undefined } | { issues: []; record: QuoteRecord; report: string; items?: Record<string, string> };

/** The extensions a source file may have: a web page or registry XML as saved, or plain text. */
const EXTENSIONS = ['txt', 'html', 'xml'] as const;

/** A line-end break is kept in the evened-out source as this mark, so each break can be joined or kept on its own. */
const BREAK = '';

const LIGATURES: Record<string, string> = { 'ﬀ': 'ff', 'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬃ': 'ffi', 'ﬄ': 'ffl', 'ﬅ': 'st', 'ﬆ': 'st' };

/** Every dash that is not the plain hyphen: the Unicode hyphens and dashes, the minus sign, and the small and wide forms. */
const DASHES = /[\u2010-\u2015\u2212\u2E3A\u2E3B\uFE58\uFE63\uFF0D]/g;

/**
 * Both sides of a search are evened out the same way: accents composed (NFC); every run of whitespace one space; soft
 * hyphens (except one that ends a line) and zero-width characters removed; ligatures written as their letters; curly
 * quotes and apostrophes straightened; every dash a hyphen. Nothing else is folded: a superscript, a prime or a
 * fraction stays as it is. A hyphen or a soft hyphen that ends a line, inside a word, becomes a break mark (see
 * `BREAK`), after the hyphen if it is a hyphen. A dash that ends a line is a dash, not a break, so the dashes are
 * folded only after the breaks are marked.
 */
function even(text: string): string {
  return evenWhitespace(
    text
      .normalize('NFC')
      .replaceAll(BREAK, '')
      .replace(/[\uFB00-\uFB06]/g, (c) => LIGATURES[c]!)
      .replace(/[\u200B\u200C\u200D\u2060\uFEFF]/g, '')
      .replace(/[\u2018-\u201B]/g, "'")
      .replace(/[\u201C-\u201F]/g, '"')
      .replace(/([\p{L}\p{M}])([-\u2010\u00AD])[ \t]*(?:\r\n|\n|\r)[ \t]*(?=\p{L})/gu, (_, letter: string, dash: string) => letter + (dash === '\u00AD' ? '' : '-') + BREAK)
      .replace(/\u00AD/g, '')
      .replace(DASHES, '-'),
  );
}

/** The words a passage leaves out are marked `…`, `...`, `[…]` or `[...]`. */
const OMISSION = /\[…\]|\[\.\.\.\]|…|\.\.\./;
const partsOf = (passage: string): string[] => passage.split(OMISSION).map((part) => even(part)).filter((part) => part !== '');
/** How many words a part has: a mark on its own (a dash, a bullet) is not one. */
const wordCount = (part: string): number => part.split(' ').filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
/** A quote is a sentence or two. Past this length a part is not searched for: the pattern for it would be too large to run. */
const LONGEST_PART = 600;

const escape = (char: string): string => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * A regular expression that finds a part in an evened-out source. Between two characters of a word the source may have
 * a line-end break: a hyphen the passage left out (the word was joined) or kept, each break on its own. A part that
 * begins or ends with a letter or a digit matches whole words and whole numbers only, and a line-end break beside the
 * match counts as a letter: the script cannot tell a split word from a compound there.
 */
function partPattern(part: string): RegExp {
  const chars = [...part];
  const body = chars.map((c, i) => (i > 0 && c !== ' ' && chars[i - 1] !== ' ' ? `(?:-?${BREAK})?` : '') + escape(c)).join('');
  const first = chars[0]!;
  const last = chars[chars.length - 1]!;
  const letter = /[\p{L}\p{M}]/u;
  const digit = /\p{N}/u;
  // A digit at the edge is part of a longer number when a point or a comma and another digit sit beside it: 1,500 or 2.5.
  const before = digit.test(first) ? `(?<![\\p{L}\\p{N}\\p{M}${BREAK}]|\\p{N}[.,])` : letter.test(first) ? `(?<![\\p{L}\\p{N}\\p{M}${BREAK}])` : '';
  const after = digit.test(last) ? `(?![\\p{L}\\p{N}\\p{M}]|-?${BREAK}|[.,]\\p{N})` : letter.test(last) ? `(?![\\p{L}\\p{N}\\p{M}]|-?${BREAK})` : '';
  return new RegExp(before + body + after, 'gu');
}

/** Which part, counted from 1, of a passage is not in the text, looking for the parts in order; 0 when all are. */
function missingPart(text: string, parts: readonly string[]): number {
  let from = 0;
  for (const [i, part] of parts.entries()) {
    const pattern = partPattern(part);
    pattern.lastIndex = from;
    const found = pattern.exec(text);
    if (found === null) return i + 1;
    from = found.index + found[0].length;
  }
  return 0;
}

const words = (text: string): string => (text.length > 60 ? `${text.slice(0, 57)}...` : text);

/** The day after a `YYYY-MM-DD` day. */
const dayAfter = (day: string): string => new Date(Date.parse(`${day}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);

/**
 * Every item that has citations and a passing verdict needs at least one quote: the keys that do not have one, in the
 * sheet's order. The quote check reports them, and the build's gate reuses the rule.
 */
export function keysMissingQuotes(sheet: ClaimSheet, verdicts: Readonly<Record<string, string>>, quotes: readonly Quote[]): string[] {
  const quoted = new Set(quotes.map((q) => q.key));
  return keysNeedingQuotes(sheet).filter((key) => verdicts[key] === '✅' && !quoted.has(key));
}

/** Past a JSON string that opens at `i`: the index after its closing quote. */
function afterString(json: string, i: number): number {
  let j = i + 1;
  while (json[j] !== '"') j += json[j] === '\\' ? 2 : 1;
  return j + 1;
}

/** Where the value of a top-level key sits in an object's JSON text, or `undefined` when the key is not there. */
function topLevelValue(json: string, key: string): { start: number; end: number } | undefined {
  let depth = 0;
  let valueStart = -1;
  for (let i = 0; i < json.length; ) {
    const ch = json[i]!;
    if (ch === '"') {
      const end = afterString(json, i);
      if (valueStart < 0 && depth === 1 && /^\s*:/.test(json.slice(end)) && JSON.parse(json.slice(i, end)) === key) {
        const colon = json.indexOf(':', end);
        valueStart = colon + 1 + /^\s*/.exec(json.slice(colon + 1))![0].length;
        i = valueStart;
        continue;
      }
      i = end;
      continue;
    }
    if (ch === '{' || ch === '[') depth++;
    else if (ch === '}' || ch === ']') depth--;
    // The value ends at the close of its own brackets, or at the comma or the object's close after a plain value.
    if (valueStart >= 0 && depth === 1 && (ch === '}' || ch === ']' || ch === ',')) return { start: valueStart, end: ch === ',' ? i : i + 1 };
    if (valueStart >= 0 && depth === 0) return { start: valueStart, end: valueStart + json.slice(valueStart, i).trimEnd().length };
    i++;
  }
  return undefined;
}

/** The header's JSON with `value` as the top-level `key`, replacing an earlier one; everything else as it was. */
function withValue(json: string, key: string, value: unknown): string {
  const eol = json.includes('\r\n') ? '\r\n' : '\n';
  const text = JSON.stringify(value, null, 2).replace(/\n/g, `${eol}  `);
  const old = topLevelValue(json, key);
  if (old !== undefined) return json.slice(0, old.start) + text + json.slice(old.end);
  const close = json.lastIndexOf('}');
  const head = json.slice(0, close);
  const kept = head.trimEnd();
  return `${kept},${eol}  ${JSON.stringify(key)}: ${text}${head.slice(kept.length)}${json.slice(close)}`;
}

/** The report with `value` as the header's top-level `key` and every other byte as it was. */
function withHeaderValue(raw: string, key: string, value: unknown): string {
  const match = HEADER.exec(raw)!;
  const start = match.index + match[0].indexOf('\n') + 1;
  return raw.slice(0, start) + withValue(match[1]!, key, value) + raw.slice(start + match[1]!.length);
}

/** A full report with the items record and the limits hash in its header, and every other byte as it was (`--stamp`). */
export function stampItems(raw: string, items: Readonly<Record<string, string>>, limits: string): string {
  return withHeaderValue(withHeaderValue(raw, 'items', items), 'limits', limits);
}

/**
 * Checks a report's quotes against the folder's files. Returns every problem, or, when there is none, the record and
 * the report's new text: the header with the record and every other byte as it was. `recheck` says the report is a
 * re-check, read by its own rules (`parseQuotes`). On a full report whose hash is the sheet's hash the header also gets
 * the `items` record (`itemHashes`) and the `limits` hash (`limitsHash`), which a later targeted re-check reads.
 */
export function checkQuotes(input: { raw: string; sheet: ClaimSheet; files: readonly SourceFile[]; today: string; pageText: PageText; recheck?: boolean }): QuoteCheck {
  const { raw, sheet, files, today, pageText, recheck = false } = input;
  const parsed = parseQuotes(raw, sheet, recheck ? 'recheck' : 'full');
  if (parsed.quotes === undefined) return { issues: parsed.issues };
  const quotes = parsed.quotes;
  const header = recheck ? parseRecheck(raw).header! : parseReport(raw).header!;
  const { verdicts, checked: reportChecked } = header;
  const issues: string[] = [];

  /** Each quoted source's file, its text as read (for the hash), and the text a reader sees of it, evened out. */
  const found = new Map<string, { name: string; read: string; text: string }>();
  for (const source of new Set(quotes.map((q) => q.source))) {
    const names = EXTENSIONS.map((ext) => `${source}.${ext}`);
    const here = files.filter((f) => names.includes(f.name));
    if (here.length === 0) {
      issues.push(`The folder has no file for the source "${source}"; save it as ${names[0]}, ${names[1]} or ${names[2]}`);
    } else if (here.length > 1) {
      issues.push(`The folder has more than one file for the source "${source}" (${here.map((f) => f.name).join(', ')}); keep one`);
    } else {
      const file = here[0]!;
      try {
        found.set(source, { name: file.name, read: file.text, text: even(file.name.endsWith('.txt') ? file.text : pageText(file.name, file.text)) });
      } catch (e) {
        issues.push(`The file ${file.name} could not be read as a page (${(e as Error).message.split('\n')[0]}); save the source as it is, or as text in ${source}.txt`);
      }
    }
  }

  for (const q of quotes) {
    const file = found.get(q.source);
    if (file === undefined) continue;
    const parts = partsOf(q.passage);
    const where = `"${q.key}", quote from ${q.source} §${q.section}`;
    if (parts.length === 0) {
      issues.push(`${where}, has no words besides its omission marks; quote the words themselves`);
      continue;
    }
    const short = parts.find((part) => wordCount(part) < 2);
    if (short !== undefined) {
      issues.push(`${where}, has a part of one word ("${words(short)}"); a passage, and each part of one, is at least two words, so quote more of it, or leave that part out`);
      continue;
    }
    const long = parts.find((part) => part.length > LONGEST_PART);
    if (long !== undefined) {
      issues.push(`${where}, has a part longer than a quote should be (${long.length} characters, "${words(long)}"; at most ${LONGEST_PART}); quote the sentence or two the claim rests on`);
      continue;
    }
    let part: number;
    try {
      part = missingPart(file.text, parts);
    } catch {
      issues.push(`${where}, could not be searched for ("${words(parts[0]!)}"); shorten the passage to the sentence or two the claim rests on`);
      continue;
    }
    if (part === 0) continue;
    const which = parts.length > 1 ? ` (part ${part} of ${parts.length}, "${words(parts[part - 1]!)}", is not found${part > 1 ? ' after the part before it' : ''})` : '';
    issues.push(`${where}, is not found in ${file.name}: "${words(parts[0]!)}"${which}; copy the passage again exactly from the saved file`);
  }

  for (const key of keysMissingQuotes(sheet, verdicts, quotes)) {
    issues.push(`"${key}" passes (✅) and cites sources but has no quote; quote the passage it rests on, or judge it again`);
  }
  if (issues.length > 0) return { issues };

  const record: QuoteRecord = {
    // The checker may date the header one day ahead of the local day (UTC), and a record older than its header is
    // refused. Further ahead than that is a mistake in the header: the record says today, so the gate names it.
    checked: reportChecked === dayAfter(today) ? reportChecked : today,
    count: quotes.length,
    digest: quotesDigest(quotes),
    files: Object.fromEntries([...found].map(([source, file]) => [source, sha256(file.read)])),
  };
  const items = !recheck && header.hash === sheet.hash ? itemHashes(sheet) : undefined;
  const written = withHeaderValue(raw, 'quotes', record);
  return { issues: [], record, report: items === undefined ? written : stampItems(written, items, limitsHash(sheet.overrides)), ...(items === undefined ? {} : { items }) };
}
