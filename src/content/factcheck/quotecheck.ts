import { evenWhitespace, keysNeedingQuotes, parseQuotes, quotesDigest, type Quote } from './quotes';
import { HEADER, parseReport, type ReportHeader } from './report';
import { sha256 } from './sha256';
import type { ClaimSheet } from './sheet';

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

export type QuoteCheck = { issues: string[]; record?: undefined; report?: undefined } | { issues: []; record: QuoteRecord; report: string };

/** The extensions a source file may have: a web page or registry XML as saved, or plain text. */
const EXTENSIONS = ['txt', 'html', 'xml'] as const;

/** A line-end break is kept in the evened-out source as this mark, so each break can be joined or kept on its own. */
const BREAK = '';

const LIGATURES: Record<string, string> = { 'ﬀ': 'ff', 'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬃ': 'ffi', 'ﬄ': 'ffl', 'ﬅ': 'st', 'ﬆ': 'st' };

/**
 * Both sides of a search are evened out the same way: every run of whitespace one space; soft hyphens (except one that
 * ends a line) and zero-width characters removed; ligatures written as their letters; curly quotes and apostrophes
 * straightened; every dash a hyphen. Nothing else is folded: a superscript, a prime or a fraction stays as it is.
 * A hyphen or a soft hyphen that ends a line, inside a word, becomes a break mark (see `BREAK`), after the hyphen if
 * it is a hyphen.
 */
function even(text: string): string {
  return evenWhitespace(
    text
      .replaceAll(BREAK, '')
      .replace(/[ﬀ-ﬆ]/g, (c) => LIGATURES[c]!)
      .replace(/[​‌‍⁠﻿]/g, '')
      .replace(/[‘-‛]/g, "'")
      .replace(/[“-‟]/g, '"')
      .replace(/[‐-―]/g, '-')
      .replace(/(\p{L})(-|­)[ \t]*(?:\r\n|\n|\r)[ \t]*(?=\p{L})/gu, (_, letter: string, dash: string) => letter + (dash === '-' ? '-' : '') + BREAK)
      .replace(/­/g, ''),
  );
}

/** The words a passage leaves out are marked `…`, `...`, `[…]` or `[...]`. */
const OMISSION = /\[…\]|\[\.\.\.\]|…|\.\.\./;
const partsOf = (passage: string): string[] => passage.split(OMISSION).map((part) => even(part)).filter((part) => part !== '');
const wordCount = (part: string): number => part.split(' ').length;

const escape = (char: string): string => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * A regular expression that finds a part in an evened-out source. Between two characters of a word the source may have
 * a line-end break: a hyphen the passage left out (the word was joined) or kept, each break on its own. A part that
 * begins or ends with a letter or a digit matches whole words only.
 */
function partPattern(part: string): RegExp {
  const chars = [...part];
  const body = chars.map((c, i) => (i > 0 && c !== ' ' && chars[i - 1] !== ' ' ? `(?:-?${BREAK})?` : '') + escape(c)).join('');
  const word = /[\p{L}\p{N}]/u;
  const before = word.test(chars[0]!) ? '(?<![\\p{L}\\p{N}])' : '';
  const after = word.test(chars[chars.length - 1]!) ? '(?![\\p{L}\\p{N}])' : '';
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

/** The header's JSON with `record` as its `quotes` value, replacing an earlier one; everything else as it was. */
function withRecord(json: string, record: QuoteRecord): string {
  const eol = json.includes('\r\n') ? '\r\n' : '\n';
  const value = JSON.stringify(record, null, 2).replace(/\n/g, `${eol}  `);
  const old = topLevelValue(json, 'quotes');
  if (old !== undefined) return json.slice(0, old.start) + value + json.slice(old.end);
  const close = json.lastIndexOf('}');
  const head = json.slice(0, close);
  const kept = head.trimEnd();
  return `${kept},${eol}  "quotes": ${value}${head.slice(kept.length)}${json.slice(close)}`;
}

/**
 * Checks a report's quotes against the folder's files. Returns every problem, or, when there is none, the record and
 * the report's new text: the header with the record and every other byte as it was.
 */
export function checkQuotes(input: { raw: string; sheet: ClaimSheet; files: readonly SourceFile[]; today: string; pageText: PageText }): QuoteCheck {
  const { raw, sheet, files, today, pageText } = input;
  const parsed = parseQuotes(raw, sheet);
  if (parsed.quotes === undefined) return { issues: parsed.issues };
  const quotes = parsed.quotes;
  const verdicts = parseReport(raw).header!.verdicts;
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
      issues.push(`${where}, has a part of one word ("${words(short)}"); a part is at least two words, so quote more of it, or leave that part out`);
      continue;
    }
    const part = missingPart(file.text, parts);
    if (part === 0) continue;
    const which = parts.length > 1 ? ` (part ${part} of ${parts.length}, "${words(parts[part - 1]!)}", is not found${part > 1 ? ' after the part before it' : ''})` : '';
    issues.push(`${where}, is not found in ${file.name}: "${words(parts[0]!)}"${which}; copy the passage again exactly from the saved file`);
  }

  for (const key of keysMissingQuotes(sheet, verdicts, quotes)) {
    issues.push(`"${key}" passes (✅) and cites sources but has no quote; quote the passage it rests on, or judge it again`);
  }
  if (issues.length > 0) return { issues };

  const record: QuoteRecord = {
    checked: today,
    count: quotes.length,
    digest: quotesDigest(quotes),
    files: Object.fromEntries([...found].map(([source, file]) => [source, sha256(file.read)])),
  };
  const match = HEADER.exec(raw)!;
  const start = match.index + match[0].indexOf('\n') + 1;
  const report = raw.slice(0, start) + withRecord(match[1]!, record) + raw.slice(start + match[1]!.length);
  return { issues: [], record, report };
}
