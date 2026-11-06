import { useState, type CSSProperties } from 'react';
import type { Board } from '../../content/schema';
import { formatIPv4, IPV4_ERROR, parseIPv4, toOctetBits, type IPv4 } from '../../engine/net/ipv4';
import { maskFromPrefix, sameSubnet, subnetInfo } from '../../engine/net/subnet';
import './bits.css';

export interface BitsBoardProps {
  /** The latest board a note has set, or null before any. */
  board: Board | null;
}

const TITLE = 'The address in bits';
/** Before step 1's first note sets the board. */
const NO_BOARD = 'The Sales laptop’s address appears here in step 1';
const NO_PREFIX = '32 bits, in four groups of 8';
const MASK = 'Mask';
const ROWS = 3;

type Kind = 'addr' | 'mask' | 'net' | 'bcast' | 'cmp';

/** A row of the board: what it is, its label, and its 32 bits as the engine has them. */
interface BitRow {
  kind: Kind;
  label: string;
  value: IPv4;
}

function parse(addr: string): IPv4 {
  const parsed = parseIPv4(addr);
  if (!parsed.ok) throw new Error(`The bits board cannot show "${addr}": ${IPV4_ERROR}`);
  return parsed.value;
}

/**
 * The board's three rows, or null for a row it does not show: the address, the
 * mask once it shows, and a third address. A network or broadcast row is the
 * engine's own, with the host bits all 0 or all 1.
 */
function rowsOf(board: Board): (BitRow | null)[] {
  const ip = parse(board.addr);
  const p = board.prefix;
  if (board.mask && p === null) throw new Error(`The bits board cannot show ${board.who}’s mask before it has a prefix.`);
  const mask: BitRow | null = board.mask && p !== null ? { kind: 'mask', label: MASK, value: maskFromPrefix(p) } : null;
  const t = board.third;
  let third: BitRow | null = null;
  if (t !== undefined) {
    if (t.mode === 'cmp') third = { kind: 'cmp', label: t.who, value: parse(t.addr) };
    else {
      if (p === null) throw new Error(`The bits board cannot show ${board.who}’s ${t.mode} row before it has a prefix.`);
      const info = subnetInfo(ip, p);
      third = { kind: t.mode, label: t.who, value: t.mode === 'net' ? info.network : info.broadcast };
    }
  }
  return [{ kind: 'addr', label: board.who, value: ip }, mask, third];
}

const bitsOf = (value: IPv4): string[] => toOctetBits(value).join('').split('');

/** The marks on bit `i` (from 0) of a row: which part it is in, and whether it is picked, borrowed, or matches the address. */
function marksOf(
  board: Board,
  row: BitRow,
  index: number,
  address: string[],
  bits: string[],
  i: number,
): Record<string, string | undefined> {
  const p = board.prefix;
  if (p === null) return {};
  const net = i < p;
  const borrowed = board.borrow !== undefined && i >= board.borrow && net;
  const pick = board.pick;
  const picked =
    (index === 0 && ((pick === 'net' && net) || (pick === 'host' && !net))) ||
    (row.kind === 'mask' && pick === 'mask') ||
    ((row.kind === 'net' || row.kind === 'bcast') && !net) ||
    (pick === 'borrow' && borrowed && row.kind !== 'cmp');
  const compared = row.kind === 'cmp' && net;
  const on = (yes: boolean): string | undefined => (yes ? '' : undefined);
  return {
    'data-part': net ? 'net' : 'host',
    'data-picked': on(picked),
    'data-borrowed': on(borrowed),
    'data-matches': on(compared && bits[i] === address[i]),
    'data-differs': on(compared && bits[i] !== address[i]),
  };
}

/** What the caption says beside the title. */
function noteOf(board: Board | null, rows: (BitRow | null)[]): string {
  if (board === null) return NO_BOARD;
  const p = board.prefix;
  if (p === null) return NO_PREFIX;
  const third = rows[2];
  if (third?.kind === 'cmp') {
    return sameSubnet(rows[0]!.value, third.value, p)
      ? `/${p}: the network parts match, so it’s the same subnet`
      : `/${p}: the network parts differ, so it’s another subnet`;
  }
  return `/${p}: ${p} network bits, ${32 - p} host bits`;
}

/** What the board showed last, and the rows (and line) that came in then, each with its own beat so the next change restarts it. */
interface Seen {
  board: Board | null;
  fresh: (string | null)[];
  line: string | null;
}

const NOTHING_FRESH: (string | null)[] = [null, null, null];
const beat = (was: string | null): string => (was === '1' ? '2' : '1');

/** Which rows are new or changed since `before`, as the mockup's board decides it. */
function changedRows(before: Board | null, after: Board): boolean[] {
  const was = before === null ? [false, false, false] : rowsOf(before).map((r) => r !== null);
  const now = rowsOf(after).map((r) => r !== null);
  return [
    before === null || before.addr !== after.addr || before.who !== after.who,
    now[1]! && (!was[1] || before?.prefix !== after.prefix),
    now[2]! && (!was[2] || before?.third?.addr !== after.third?.addr || before?.third?.who !== after.third?.who),
  ];
}

function advance(seen: Seen, board: Board | null): Seen {
  if (board === null) return { board, fresh: NOTHING_FRESH, line: null };
  const changed = changedRows(seen.board, board);
  const hadLine = seen.board !== null && seen.board.prefix !== null;
  return {
    board,
    fresh: seen.fresh.map((was, i) => (changed[i] ? beat(was) : was)),
    line: board.prefix !== null && !hadLine ? beat(seen.line) : seen.line,
  };
}

/**
 * Subnetting's board under the scene: "The address in bits". Up to three rows
 * of 32 bits in four octets: the address, the mask once it shows, and a third
 * address (the network's, the broadcast's, or one being compared). A marigold
 * line stands where the network part ends; bits borrowed from the host part are
 * underlined. Every bit is the engine's (src/engine/net).
 *
 * It is a real table: a caption, a header for each column and each row, and
 * each row's bits read out as four groups of 8. Rows it does not show keep
 * their place, hidden from a screen reader too, so the panel never jumps.
 *
 * Within a step, a row that changes comes in, and the line slides to its new
 * place; the console remounts the board for each new step, so a step's board
 * starts out settled.
 */
export function BitsBoard({ board }: BitsBoardProps) {
  const [seen, setSeen] = useState<Seen>({ board, fresh: NOTHING_FRESH, line: null });
  let shown = seen;
  if (seen.board !== board) {
    shown = advance(seen, board);
    setSeen(shown);
  }

  const rows = board === null ? [null, null, null] : rowsOf(board);
  const address = rows[0] === null || rows[0] === undefined ? [] : bitsOf(rows[0].value);
  const p = board?.prefix ?? null;
  const lastShown = rows.reduce((last, row, i) => (row === null ? last : i), -1);
  const borrowed =
    board !== null && p !== null && board.borrow !== undefined && board.borrow < p
      ? `Bits ${board.borrow + 1} to ${p} are borrowed.`
      : null;

  return (
    <div className="bits">
      <table className="bits__table">
        <caption>
          <span className="bits__title">{TITLE}</span> <span className="bits__note">{noteOf(board, rows)}</span>
          {borrowed === null ? null : <span className="sr-only"> {borrowed}</span>}
        </caption>
        <colgroup>
          <col className="bits__col-label" />
          <col className="bits__col-bits" />
          <col />
        </colgroup>
        <thead>
          <tr>
            {['Row', 'Bits', 'Address'].map((name) => (
              <th key={name} scope="col">
                <span className="sr-only">{name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: ROWS }, (_, index) => {
            const row = rows[index] ?? null;
            if (board === null || row === null) {
              return (
                <tr key={index} data-off="" aria-hidden="true">
                  <th scope="row" />
                  <td className="bits__bits">
                    <span className="bits__cells">
                      {[0, 1, 2, 3].map((octet) => (
                        <span key={octet} className="bits__octet">
                          {Array.from({ length: 8 }, (_, i) => (
                            <span key={i} className="bits__cell" />
                          ))}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className="bits__dec" />
                </tr>
              );
            }
            const bits = bitsOf(row.value);
            return (
              <tr key={index} data-kind={row.kind} data-fresh={shown.fresh[index] ?? undefined}>
                <th scope="row">
                  <span className="bits__label">{row.label}</span>
                </th>
                <td className="bits__bits">
                  <span className="bits__cells" aria-hidden="true">
                    {[0, 1, 2, 3].map((octet) => (
                      <span key={octet} className="bits__octet">
                        {bits.slice(octet * 8, octet * 8 + 8).map((bit, k) => (
                          <span key={k} className="bits__cell" {...marksOf(board, row, index, address, bits, octet * 8 + k)}>
                            {bit}
                          </span>
                        ))}
                      </span>
                    ))}
                    {index === 0 && p !== null ? (
                      <span
                        className="bits__line"
                        data-after={p}
                        data-picked={board.pick === 'line' ? '' : undefined}
                        data-fresh={shown.line ?? undefined}
                        style={{ '--octets': Math.floor(p / 8), '--bits': p % 8, '--rows': lastShown + 1 } as CSSProperties}
                      />
                    ) : null}
                  </span>
                  <span className="sr-only">{toOctetBits(row.value).join(' ')}</span>
                </td>
                <td className="bits__dec">{formatIPv4(row.value)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
