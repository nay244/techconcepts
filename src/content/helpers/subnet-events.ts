import { formatIPv4, IPV4_ERROR, parseIPv4, type IPv4 } from '../../engine/net/ipv4';
import { maskFromPrefix, subnetInfo } from '../../engine/net/subnet';
import type { Board, Cue, Fact, Lesson, NoteEvent, Paragraph } from '../schema';

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
 * The log's glyph for a note, from what the figure does with it, as
 * subnet-v1.html's three kinds: a ring is a broadcast, a route is sent (the
 * reply's arrow), and anything else is worked out (the request's square).
 */
function glyphOf(cues: Cue[] | undefined): NonNullable<NoteEvent['glyph']> {
  const names = (cues ?? []).map((c) => c.cue);
  if (names.includes('ring')) return 'broadcast';
  if (names.includes('route')) return 'response';
  return 'request';
}

/**
 * A note whose log row is worked out by the engine: Worked out (`row`), Value
 * (`shown` of the board) and Prefix (once the board shows the mask; a dash
 * before, as the mockup's). Its glyph follows its cues (`glyphOf`). A board
 * that shows the mask before it has a prefix throws: the schema allows it, but
 * there is no mask to show.
 */
export function calc(o: { id: string; row: string; shown: Shown; plain: string; board: Board; cues?: Cue[] }): NoteEvent {
  const { board } = o;
  if (board.mask && board.prefix === null) throw new Error(`"${o.id}": ${board.who}’s board shows the mask, but it has no prefix yet.`);
  checkThird(o.id, board);
  return {
    type: 'note',
    id: o.id,
    log: { worked: o.row, value: subnetValue(o.shown, board), prefix: board.mask ? `/${board.prefix}` : '–' },
    plain: o.plain,
    board,
    glyph: glyphOf(o.cues),
    ...(o.cues === undefined ? {} : { cues: o.cues }),
  };
}

/** A place in a lesson where the learner reads words, and the words there. */
export interface Prose {
  /** Its path in the unit, by id where there is one: `steps.borrowing-bits.narrative`, `practice.usable-26.options.0.text`. */
  place: string;
  text: string;
}

/**
 * Every place in the lesson where a learner reads words: the titles, the
 * overview, each step's words, facts and events' plain words (a table event's
 * summary), Learn, and Practice's prompts, options and feedback. Not the log's
 * cells, the boards, ids, cues, urls or the figure's tags: those are the
 * engine's or the page's, not words a lesson states. A lesson with more than one
 * unit puts the unit's id before each place: `alpha:steps.hello.narrative`.
 * Learn's statements (`learn.lead`, `learn.why`) are one place, read as one
 * paragraph; so is each Go deeper (`learn.deep`, `steps.hello.deep`), a line
 * per paragraph.
 */
export function learnerProse(lesson: Lesson): Prose[] {
  const out: Prose[] = [];
  const add = (place: string, text: string | undefined): void => {
    if (text !== undefined) out.push({ place, text });
  };
  const joined = (items: readonly Paragraph[], between: ' ' | '\n'): string => items.map((item) => item.text).join(between);
  const addFacts = (at: string, facts: readonly Fact[]): void =>
    facts.forEach((f, i) => {
      add(`${at}.facts.${i}.label`, f.label);
      add(`${at}.facts.${i}.value`, f.value);
    });
  add('title', lesson.title);
  add('subtitle', lesson.subtitle);
  add('summary', lesson.summary);
  for (const unit of lesson.units) {
    const u = lesson.units.length > 1 ? `${unit.id}:` : '';
    add(`${u}name`, unit.name);
    add(`${u}fullName`, unit.fullName);
    add(`${u}purpose`, unit.purpose);
    add(`${u}scene.title`, unit.scene.title);
    add(`${u}overview.hook`, unit.overview.hook);
    add(`${u}overview.description`, unit.overview.description);
    addFacts(`${u}overview`, unit.overview.facts);
    for (const step of unit.steps) {
      const s = `${u}steps.${step.id}`;
      add(`${s}.title`, step.title);
      add(`${s}.sub`, step.sub);
      add(`${s}.narrative`, step.narrative);
      add(`${s}.deep`, joined(step.deep, '\n'));
      add(`${s}.status`, step.status);
      add(`${s}.idle`, step.idle);
      addFacts(s, step.facts);
      for (const e of step.events) {
        if (e.type === 'table') add(`${s}.events.${e.id}.summary`, e.summary);
        else add(`${s}.events.${e.id}.plain`, e.plain);
      }
    }
    const { learn } = unit;
    add(`${u}learn.lead`, joined(learn.lead, ' '));
    learn.terms.forEach((t, i) => {
      add(`${u}learn.terms.${i}.idea`, t.idea);
      add(`${u}learn.terms.${i}.name`, t.name);
    });
    learn.pattern.names.forEach((name, i) => add(`${u}learn.pattern.names.${i}`, name));
    add(`${u}learn.pattern.note`, learn.pattern.note);
    add(`${u}learn.why`, joined(learn.why, ' '));
    add(`${u}learn.deep`, joined(learn.deep, '\n'));
    addFacts(`${u}learn`, learn.facts);
    for (const q of unit.practice) {
      const p = `${u}practice.${q.id}`;
      add(`${p}.prompt`, q.prompt);
      q.options.forEach((o, i) => {
        add(`${p}.options.${i}.text`, o.text);
        add(`${p}.options.${i}.feedback`, o.feedback);
      });
    }
  }
  return out;
}

/**
 * A number the lesson's words state, pinned to where it is written: the
 * phrase as written, with enough of its sentence round the number to stand
 * for that place, and the engine's own wording of the same phrase.
 */
export interface Stated {
  /** The place it is written (a `Prose` place), or every place it stands for. */
  at: string | readonly string[];
  text: string;
  value: () => string;
}

const DIGIT = /\d/;
const NUMBER = /\d+(?:\.\d+)*/g;

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
 * Throws, listing every problem, unless each stated phrase is the engine's
 * wording and is written, whole, in each place it names and in no other place
 * the learner reads (`learnerProse`). Log cells, boards and ids are never
 * searched, so a number the engine put in the log cannot stand in for one the
 * words state.
 */
export function checkStated(lesson: Lesson, stated: readonly Stated[]): void {
  const prose = learnerProse(lesson);
  const textAt = new Map(prose.map((p) => [p.place, p.text]));
  const problems = stated.flatMap(({ at, text, value }) => {
    const found: string[] = [];
    const places: readonly string[] = typeof at === 'string' ? [at] : at;
    const engine = value();
    if (engine !== text) found.push(`“${text}” is stated, but the engine works out “${engine}”.`);
    const numbers = (text.match(NUMBER) ?? []).join(', ');
    for (const place of places) {
      const written = textAt.get(place);
      if (written === undefined) found.push(`${place}: the lesson has no such place for “${text}”.`);
      else if (!containsWhole(written, text)) found.push(`${place} should say “${text}”, with the engine’s ${numbers}, and does not.`);
    }
    const elsewhere = prose.filter((p) => !places.includes(p.place) && containsWhole(p.text, text)).map((p) => p.place);
    if (elsewhere.length > 0) found.push(`“${text}” is also in ${elsewhere.join(', ')}: name each place it stands for.`);
    return found;
  });
  if (problems.length > 0)
    throw new Error(`Lesson "${lesson.slug}" states numbers the engine does not:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
}
