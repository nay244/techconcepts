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

export type QuoteRecord = NonNullable<ReportHeader['quotes']>;

export type QuoteCheck = { issues: string[]; record?: undefined; report?: undefined } | { issues: []; record: QuoteRecord; report: string };

/** The extensions a source file may have: a web page or registry XML as saved, or plain text. */
const EXTENSIONS = ['txt', 'html', 'xml'] as const;

/** Tags that end a line of text, so the words either side of one are not run together. */
const BLOCK_TAG = /<\/?(?:p|div|br|hr|li|ul|ol|tr|td|th|table|thead|tbody|h[1-6]|section|article|header|footer|nav|aside|main|pre|blockquote|dl|dt|dd|figure|figcaption|form|title)\b[^>]*>/gi;

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '­', ndash: '–', mdash: '—', hellip: '…',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', laquo: '«', raquo: '»', bull: '•', middot: '·', copy: '©', reg: '®',
  trade: '™', sect: '§', para: '¶', times: '×', divide: '÷', deg: '°', plusmn: '±', minus: '−', hyphen: '‐', larr: '←',
  rarr: '→', harr: '↔', le: '≤', ge: '≥', ne: '≠', micro: 'µ', euro: '€', pound: '£', cent: '¢', yen: '¥',
};

const decodeEntities = (text: string): string =>
  text.replace(/&(?:#(\d+)|#[xX]([0-9a-fA-F]+)|([A-Za-z][A-Za-z0-9]*));/g, (whole, dec?: string, hex?: string, name?: string) => {
    if (name !== undefined) return NAMED_ENTITIES[name] ?? whole;
    const code = dec !== undefined ? Number(dec) : parseInt(hex!, 16);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : whole;
  });

/** The text of a source file: as it is for `.txt`; for `.html` and `.xml`, without tags, scripts and styles, entities decoded. */
export function sourceText(name: string, text: string): string {
  if (name.endsWith('.txt')) return text;
  const bare = text
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_, inner: string) => inner.replace(/&/g, '&amp;').replace(/</g, '&lt;'))
    .replace(BLOCK_TAG, ' ')
    .replace(/<[^>]*>/g, '');
  return decodeEntities(bare);
}

/**
 * Both sides of a search are evened out the same way: compatibility forms (a ligature is its letters), soft hyphens
 * gone, curly quotes straight, every dash a hyphen, every run of whitespace one space. `hyphen` says what a hyphen at
 * a line's end becomes: `''` joins the word, `'-'` keeps the hyphen, and without it the hyphen stays beside a space.
 */
function even(text: string, hyphen?: '' | '-'): string {
  const plain = text
    .normalize('NFKC')
    .replace(/­/g, '')
    .replace(/[‘’‚‛′]/g, "'")
    .replace(/[“”„‟″]/g, '"')
    .replace(/[‐-―−﹘﹣－]/g, '-');
  return evenWhitespace(hyphen === undefined ? plain : plain.replace(/(\p{L})-[ \t]*\r?\n[ \t]*(?=\p{L})/gu, `$1${hyphen}`));
}

/** The words a passage leaves out are marked `…`, `...` or `[…]`. Split before evening: NFKC turns `…` into `...`. */
const OMISSION = /\[…\]|\[\.\.\.\]|…|\.\.\./;
const partsOf = (passage: string): string[] => passage.split(OMISSION).map((part) => even(part)).filter((part) => part !== '');

/** Which part, counted from 1, of a passage is not in the text, looking for the parts in order; 0 when all are. */
function missingPart(text: string, parts: readonly string[]): number {
  let from = 0;
  for (const [i, part] of parts.entries()) {
    const at = text.indexOf(part, from);
    if (at < 0) return i + 1;
    from = at + part.length;
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
  const value = JSON.stringify(record, null, 2).replace(/\n/g, '\n  ');
  const old = topLevelValue(json, 'quotes');
  if (old !== undefined) return json.slice(0, old.start) + value + json.slice(old.end);
  const close = json.lastIndexOf('}');
  const head = json.slice(0, close);
  const kept = head.trimEnd();
  return `${kept},\n  "quotes": ${value}${head.slice(kept.length)}${json.slice(close)}`;
}

/**
 * Checks a report's quotes against the folder's files. Returns every problem, or, when there is none, the record and
 * the report's new text: the header with the record and every other byte as it was.
 */
export function checkQuotes(input: { raw: string; sheet: ClaimSheet; files: readonly SourceFile[]; today: string }): QuoteCheck {
  const { raw, sheet, files, today } = input;
  const parsed = parseQuotes(raw, sheet);
  if (parsed.quotes === undefined) return { issues: parsed.issues };
  const quotes = parsed.quotes;
  const verdicts = parseReport(raw).header!.verdicts;
  const issues: string[] = [];

  /** Each quoted source's file, its text as read (for the hash), and its text evened out the three ways. */
  const found = new Map<string, { name: string; read: string; variants: string[] }>();
  for (const source of new Set(quotes.map((q) => q.source))) {
    const names = EXTENSIONS.map((ext) => `${source}.${ext}`);
    const here = files.filter((f) => names.includes(f.name));
    if (here.length === 0) {
      issues.push(`The folder has no file for the source "${source}"; save it as ${names[0]}, ${names[1]} or ${names[2]}`);
    } else if (here.length > 1) {
      issues.push(`The folder has more than one file for the source "${source}" (${here.map((f) => f.name).join(', ')}); keep one`);
    } else {
      const file = here[0]!;
      const text = sourceText(file.name, file.text);
      found.set(source, { name: file.name, read: file.text, variants: [even(text), even(text, ''), even(text, '-')] });
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
    const misses = file.variants.map((text) => missingPart(text, parts));
    if (misses.includes(0)) continue;
    const part = Math.max(...misses);
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
