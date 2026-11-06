import type { Cue, LogDef, MessageEvent, SceneEvent, TableDef, TableEvent } from '../schema';

/**
 * Builders for How the Internet Works, whose 14 protocols are ported from the approved mockup (internet-v2.html,
 * FIGS/protocols.mjs). A protocol's messages are written as the mockup writes them, so its words and numbers are
 * kept as they are, and `msg` turns each one into the lesson's events: the message itself, then a table event for
 * each row of the panel it brings.
 */

/** A row a message brings to the panel, as the mockup writes it: its own name for the row, and its cells in column order. */
export interface MockupRow {
  key: string;
  cells: string[];
  /** The row is a miss: something looked for and not there. */
  miss?: boolean;
}

/** A message as the mockup writes it. */
export interface MockupMessage {
  /** The words on the moving tag. */
  tag: string;
  /** Places on the network map. */
  from: string;
  to: string;
  /** The log's Protocol cell. */
  proto: string;
  /** The carrier shown under the tag, such as UDP. */
  via: string;
  kind: 'request' | 'response' | 'control' | 'encrypted';
  /** Sent to everyone on the home network. */
  bcast?: boolean;
  /** A quick ride. */
  fast?: boolean;
  /** Lost on the way, this far along. */
  lost?: number;
  time: string;
  src: string;
  dst: string;
  size: string;
  /** The message in plain words. */
  sum: string;
  /** The log's Info cell. */
  info: string;
  /** The laptop's status once the message lands; `known` and `done` style it. */
  st?: string;
  known?: boolean;
  done?: boolean;
  /** A connection: opened, sealed or closed, on a route; `data` is FTP's second line. */
  conn?: ['open' | 'seal' | 'close', string] | ['open' | 'seal' | 'close', string, 'data'];
  /** The page on the laptop's screen: its text first, then all of it. */
  page?: 'text' | 'full';
  /** The padlock (`lock`, which only comes on), and letters on the mail servers' trays, by site. */
  hold?: Record<string, boolean>;
  /** The laptop's address, and its address bar. */
  addr?: string;
  url?: string;
  /** Rows the message brings to the panel's table. */
  rows?: MockupRow[];
}

/**
 * A unit's `msg`, for the panel table `table` (or null for a unit with none). Each message takes the unit's next
 * id (m1, m2, …) and each table event the table's (files-1, files-2, …). A row the mockup has brought before changes
 * that row; a new one is added. Throws for what the map or the table cannot show.
 */
export function messagesFor(table: TableDef | null): (m: MockupMessage) => SceneEvent[] {
  let messages = 0;
  let changes = 0;
  /** Each mockup row's key in the table's key column, and the other way round. */
  const keyOf = new Map<string, string>();
  const rowOf = new Map<string, string>();

  function tableEvent(r: MockupRow): TableEvent {
    if (table === null) throw new Error(`Row "${r.key}" needs a table, and this unit has no table.`);
    const { columns, keyColumn, title } = table;
    if (r.cells.length !== columns.length) {
      throw new Error(`Row "${r.key}" has ${r.cells.length} cells, and the table "${table.id}" has ${columns.length} columns.`);
    }
    const row = Object.fromEntries(columns.map((c, i) => [c.key, r.cells[i]!]));
    const key = row[keyColumn]!;
    const owner = rowOf.get(key);
    if (owner !== undefined && owner !== r.key) {
      const label = columns.find((c) => c.key === keyColumn)?.label ?? keyColumn;
      throw new Error(`duplicate key in column "${label}": row "${r.key}" has "${key}", and so does row "${owner}".`);
    }
    const before = keyOf.get(r.key);
    if (before !== undefined) rowOf.delete(before);
    keyOf.set(r.key, key);
    rowOf.set(key, r.key);
    const words = `${r.cells.join(', ')}.${r.miss === true ? ' A miss.' : ''}`;
    const id = `${table.id}-${++changes}`;
    const miss = r.miss === true ? { miss: true } : {};
    return before === undefined
      ? { type: 'table', id, table: table.id, op: 'add', row, ...miss, summary: `Added to ${title}: ${words}` }
      : { type: 'table', id, table: table.id, op: 'update', key: before, row, ...miss, summary: `Changed in ${title}: ${words}` };
  }

  return (m) => {
    if (m.known === true && m.st === undefined) throw new Error(`"${m.tag}" is known, which styles a status ("st"), and it sets none.`);
    if (m.done === true && m.st === undefined) throw new Error(`"${m.tag}" is done, which styles a status ("st"), and it sets none.`);
    const cues: Cue[] = [];
    if (m.st !== undefined) cues.push({ cue: 'status', arg: m.st });
    if (m.known === true) cues.push({ cue: 'status-known' });
    if (m.done === true) cues.push({ cue: 'status-done' });
    if (m.conn !== undefined) cues.push({ cue: 'conn', arg: m.conn.join(' ') });
    if (m.page !== undefined) cues.push({ cue: 'page', arg: m.page });
    const { lock, ...trays } = m.hold ?? {};
    if (lock === false) throw new Error(`"${m.tag}" takes the padlock away, and the map can only light it.`);
    if (lock === true) cues.push({ cue: 'lock' });
    for (const [site, on] of Object.entries(trays)) cues.push({ cue: 'tray', arg: `${site} ${on ? 'on' : 'off'}` });
    if (m.addr !== undefined) cues.push({ cue: 'addr', arg: m.addr });
    if (m.url !== undefined) cues.push({ cue: 'url', arg: m.url });

    const message: MessageEvent = {
      type: 'message',
      id: `m${++messages}`,
      from: m.from,
      to: m.to,
      tag: m.tag,
      kind: m.bcast === true ? 'broadcast' : m.kind,
      ...(m.lost === undefined ? {} : { outcome: 'dropped' as const, dropAt: m.lost }),
      over: m.via,
      ...(m.fast === true ? { fast: true } : {}),
      log: { time: m.time, source: m.src, destination: m.dst, protocol: m.proto, info: m.info, size: m.size },
      plain: m.sum,
      ...(cues.length === 0 ? {} : { cues }),
    };
    return [message, ...(m.rows ?? []).map(tableEvent)];
  };
}

/**
 * The packet log of internet-v2.html: its columns at the widths the mockup shows them at 1280 px, with Info wrapping
 * in the room left, and its legend. The mockup's table lays itself out to its cells, so its Source and Destination
 * (150 and 172 px as written) both grow to 176 px to fit an address with a port; the console's log keeps each width
 * as given, so it takes those 176 px. `extra` adds to the legend, such as a lost message's glyph. Every call is a
 * fresh copy.
 */
export function eventLog(...extra: LogDef['legend']): LogDef {
  return {
    title: 'Event log',
    columns: [
      { key: 'time', label: 'Time', width: 100 },
      { key: 'source', label: 'Source', width: 176 },
      { key: 'destination', label: 'Destination', width: 176 },
      { key: 'protocol', label: 'Protocol', width: 84 },
      { key: 'info', label: 'Info', prose: true },
      { key: 'size', label: 'Size', width: 76 },
    ],
    legend: [{ kind: 'request', label: 'Request' }, { kind: 'response', label: 'Reply' }, ...extra.map((l) => ({ ...l }))],
  };
}
