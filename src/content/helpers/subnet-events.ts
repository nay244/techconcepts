import { formatIPv4, IPV4_ERROR, parseIPv4, type IPv4 } from '../../engine/net/ipv4';
import { maskFromPrefix, subnetInfo } from '../../engine/net/subnet';
import type { Board, Cue, Lesson, NoteEvent } from '../schema';

/**
 * Builders for the Subnetting lesson's notes, so every number the lesson shows
 * is worked out by the engine (src/engine/net), never typed in. A note's log
 * row names what was worked out (`row`), and `shown` says which value of the
 * board's address the Value column takes. `checkStated` then checks the
 * numbers the lesson's words state, against the same engine.
 */

/** Which value of the board's address a note's Value column shows. */
export type Shown =
  | 'address'
  | 'network-part'
  | 'host-part'
  | 'mask'
  | 'prefix'
  | 'network'
  | 'broadcast'
  | 'usable-count'
  | 'subnets'
  | 'compared'
  | 'usable-pair';

/** Parses an address, or throws naming it, so a typo fails the build. */
function address(addr: string): IPv4 {
  const parsed = parseIPv4(addr);
  if (!parsed.ok) throw new Error(`"${addr}": ${IPV4_ERROR}`);
  return parsed.value;
}

/** The board's prefix, or a throw when the board has none yet. */
function prefixOf(shown: Shown, board: Board): number {
  if (board.prefix === null) throw new Error(`"${shown}" needs a prefix, and ${board.who}’s board has none yet.`);
  return board.prefix;
}

/** The address's octets split at a byte-boundary prefix: the network part's and the host part's. */
function portions(shown: Shown, board: Board): [string, string] {
  const prefix = prefixOf(shown, board);
  if (prefix % 8 !== 0 || prefix === 0 || prefix === 32) {
    throw new Error(`"${shown}" splits the dotted address at a whole octet, and /${prefix} does not fall between two octets.`);
  }
  const octets = formatIPv4(address(board.addr)).split('.');
  return [octets.slice(0, prefix / 8).join('.'), octets.slice(prefix / 8).join('.')];
}

/** The value the log's Value column shows for `shown`, worked out from the board's address and prefix. */
export function subnetValue(shown: Shown, board: Board): string {
  const ip = address(board.addr);
  switch (shown) {
    case 'address':
      return formatIPv4(ip);
    case 'network-part':
      return portions(shown, board)[0];
    case 'host-part':
      return portions(shown, board)[1];
    case 'mask':
      return formatIPv4(maskFromPrefix(prefixOf(shown, board)));
    case 'prefix':
      return `/${prefixOf(shown, board)}`;
    case 'network':
      return formatIPv4(subnetInfo(ip, prefixOf(shown, board)).network);
    case 'broadcast':
      return formatIPv4(subnetInfo(ip, prefixOf(shown, board)).broadcast);
    case 'usable-count':
      return String(subnetInfo(ip, prefixOf(shown, board)).usableHosts);
    case 'subnets': {
      const prefix = prefixOf(shown, board);
      if (board.borrow === undefined)
        throw new Error(`"subnets" counts from where the borrowing starts, and ${board.who}’s board has no borrow.`);
      return `${2 ** (prefix - board.borrow)} × ${subnetInfo(ip, prefix).totalAddresses} addresses`;
    }
    case 'compared':
      if (board.third === undefined)
        throw new Error(`"compared" shows the address being compared, and ${board.who}’s board has no third row.`);
      return formatIPv4(address(board.third.addr));
    case 'usable-pair': {
      const info = subnetInfo(ip, prefixOf(shown, board));
      if (info.usableHosts !== 2)
        throw new Error(`"usable-pair" needs exactly 2 usable addresses, and /${info.prefix} has ${info.usableHosts}.`);
      return `${formatIPv4(info.firstHost)} and .${info.lastHost & 255}`;
    }
  }
}

/** Throws when the board's network or broadcast row is not what the engine works out for its address. */
function checkThird(id: string, board: Board): void {
  const third = board.third;
  if (third === undefined) return;
  const ip = address(third.addr);
  if (third.mode === 'cmp') return;
  const info = subnetInfo(address(board.addr), prefixOf(third.mode === 'net' ? 'network' : 'broadcast', board));
  const expected = third.mode === 'net' ? info.network : info.broadcast;
  if (ip !== expected) {
    const row = third.mode === 'net' ? 'network' : 'broadcast';
    throw new Error(
      `"${id}": the board’s ${row} row is ${third.addr}, but the engine works out ${formatIPv4(expected)} for ${board.addr}/${info.prefix}.`,
    );
  }
}

/**
 * A note whose log row is worked out by the engine: Worked out (`row`), Value
 * (`shown` of the board) and Prefix (once the board shows the mask).
 */
export function calc(o: { id: string; row: string; shown: Shown; plain: string; board: Board; cues?: Cue[] }): NoteEvent {
  checkThird(o.id, o.board);
  return {
    type: 'note',
    id: o.id,
    log: { worked: o.row, value: subnetValue(o.shown, o.board), prefix: o.board.mask ? `/${o.board.prefix}` : '' },
    plain: o.plain,
    board: o.board,
    ...(o.cues === undefined ? {} : { cues: o.cues }),
  };
}

/** A number the lesson's words state, exactly as written, and the engine's own wording of it. */
export interface Stated {
  text: string;
  value: () => string;
}

/** Every string in a value, wherever it sits. */
function stringsOf(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(stringsOf);
  if (typeof value === 'object' && value !== null) return Object.values(value).flatMap(stringsOf);
  return [];
}

const DIGIT = /\d/;

/** True when `text` sits in `s` as a whole number: not inside a longer number on either side. */
function containsWhole(s: string, text: string): boolean {
  for (let at = s.indexOf(text); at !== -1; at = s.indexOf(text, at + 1)) {
    const before = s[at - 1] ?? '';
    const after = s.slice(at + text.length, at + text.length + 2);
    const startOk = !DIGIT.test(text[0] ?? '') || !(DIGIT.test(before) || before === '.');
    const endOk = !DIGIT.test(text.at(-1) ?? '') || !(DIGIT.test(after[0] ?? '') || (after[0] === '.' && DIGIT.test(after[1] ?? '')));
    if (startOk && endOk) return true;
  }
  return false;
}

/**
 * Throws, listing every problem, when a stated number is not in the lesson's
 * text as a whole number, or is not what the engine works out.
 */
export function checkStated(lesson: Lesson, stated: Stated[]): void {
  const strings = stringsOf(lesson);
  const problems = stated.flatMap(({ text, value }) => {
    const found: string[] = [];
    const engine = value();
    if (engine !== text) found.push(`“${text}” is stated, but the engine works out “${engine}”.`);
    if (!strings.some((s) => containsWhole(s, text))) found.push(`“${text}” is not in the lesson’s text.`);
    return found;
  });
  if (problems.length > 0)
    throw new Error(`Lesson "${lesson.slug}" states numbers the engine does not:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
}
