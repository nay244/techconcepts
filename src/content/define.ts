import type { z } from 'zod';
import { NET_MAP_BASE_PLACES, NET_MAP_BAY_COUNTS, NET_MAP_LAYERS, NET_MAP_LINKS, NET_MAP_ROUTERS, NET_MAP_TAG_MAX, plateSites } from '../art/scenes/net-map-layers';
import { FIGURE_PARTS } from '../art/scenes/parts';
import { POOL_READERS } from '../art/scenes/pool-parts';
import type { FigureParts } from '../art/scenes/types';
import { tablesOf } from '../engine/tables';
import { checkCitedRules, citationsOf } from './cited';
import { checkCitation, SOURCES, sourceListOf, type SourceRegistry } from './sources';
import { formatBytes } from '../lib/format';
import {
  lessonSchema,
  trackSchema,
  type CertificationTrack,
  type Cue,
  type Lesson,
  type MessageEvent,
  type Row,
  type SceneEvent,
  type TableDef,
  type TableEvent,
  type Track,
  type Unit,
} from './schema';

/** Longer titles overflow the net-map figure's fixed frame. */
const MAX_NET_MAP_TITLE = 51;

export class LessonValidationError extends Error {
  readonly issues: string[];

  constructor(issues: string[], lessonSlug?: string) {
    const who = lessonSlug === undefined ? 'Lesson' : `Lesson "${lessonSlug}"`;
    super(`${who} is invalid:\n${issues.map((issue) => `  - ${issue}`).join('\n')}`);
    this.name = 'LessonValidationError';
    this.issues = issues;
  }
}

// ---------------------------------------------------------------- helpers

/** "units[0].steps[1].narrative: ..." from a zod issue. */
function describeZodIssue(issue: { path: PropertyKey[]; message: string }): string {
  const where = issue.path.reduce<string>(
    (acc, part) => (typeof part === 'number' ? `${acc}[${part}]` : acc === '' ? String(part) : `${acc}.${String(part)}`),
    '',
  );
  return where === '' ? issue.message : `${where}: ${issue.message}`;
}

/** Each value that appears more than once, once. */
function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) (seen.has(value) ? repeated : seen).add(value);
  return [...repeated];
}

function slugOf(input: unknown): string | undefined {
  if (typeof input === 'object' && input !== null && 'slug' in input && typeof input.slug === 'string') return input.slug;
  return undefined;
}

/** The rows a unit's table events give the table `id`, whole: each row an add brings, and each a replace brings. */
function rowsGivenTo(u: Unit, id: string): Row[] {
  const events = u.steps.flatMap((step) => step.events).filter((e): e is TableEvent => e.type === 'table' && e.table === id);
  return events.flatMap((e) => (e.op === 'add' ? [e.row ?? {}] : e.op === 'replace' ? (e.rows ?? []) : []));
}

/** Which optional table-event fields each op reads. `clear` reads none. */
const TABLE_OP_FIELDS: Record<TableEvent['op'], ('row' | 'rows' | 'key')[]> = {
  add: ['row'],
  update: ['key', 'row'],
  remove: ['key'],
  match: [],
  replace: ['rows'],
  clear: [],
};

/** What a unit's events are checked against. */
interface UnitContext {
  figure: Lesson['figure'];
  parts: FigureParts;
  unit: Unit;
  /** The unit's log columns an event may write: all but `plain` (the event's own `plain`) and `#` (the console's). */
  logKeys: Set<string>;
  tables: TableDef[];
  issues: string[];
  /** The Switch figure only: the laptop has been moved to port 5 by an earlier frame of the unit. */
  laptopMoved?: boolean;
}

// ---------------------------------------------------------------- unit rules

function checkScene(c: UnitContext, at: string): void {
  const { unit: u, parts, figure, issues } = c;
  const scene = u.scene;

  for (const party of scene.parties) {
    if (!parts.places.includes(party.place)) {
      issues.push(`${at}: party "${party.label}" stands at place "${party.place}", which the ${figure} figure does not have.`);
    }
  }
  // Views are ['network'] or ['network', 'sequence'], so two views means the Sequence view is on.
  if (scene.views.length > 1 && scene.parties.length < 2) {
    issues.push(`${at}: the Sequence view needs at least 2 parties; this scene has ${scene.parties.length}.`);
  }
  for (const layer of scene.layers) {
    if (!parts.layers.includes(layer)) issues.push(`${at}: layer "${layer}" is not one the ${figure} figure has.`);
  }
  checkStart(c, at);
  if (parts.words !== undefined) {
    for (const word of parts.words) {
      if (!Object.hasOwn(scene.labels, word)) issues.push(`${at}: the scene's labels need "${word}" for the ${figure} figure.`);
    }
    for (const word of Object.keys(scene.labels)) {
      if (!parts.words.includes(word)) issues.push(`${at}: the scene's labels give "${word}", which the ${figure} figure does not show.`);
    }
  }
  if (scene.panel?.type === 'labels' && !parts.labels) {
    issues.push(`${at}: the labels panel needs a figure that shows a message's headers; the ${figure} figure does not.`);
  }
  if (figure === 'net-map' && scene.title.length > MAX_NET_MAP_TITLE) {
    issues.push(`${at}: the scene title is ${scene.title.length} characters; the limit is ${MAX_NET_MAP_TITLE} on the net-map figure.`);
  }

  for (const id of duplicates(c.tables.map((t) => t.id))) issues.push(`${at}: Duplicate table id "${id}".`);
  for (const table of c.tables) {
    // Rows are told apart by the key column: one of the table's columns or, for a table that says its key is
    // hidden, a field every row carries that no column shows.
    const shown = table.columns.some((column) => column.key === table.keyColumn);
    if (table.hiddenKey !== true) {
      if (!shown) issues.push(`${at}: table "${table.id}" key column "${table.keyColumn}" is not one of its columns.`);
      continue;
    }
    if (shown) issues.push(`${at}: table "${table.id}" hides its key, and key column "${table.keyColumn}" is one of its columns.`);
    if ([...table.initialRows, ...rowsGivenTo(u, table.id)].some((row) => row[table.keyColumn] === undefined)) {
      issues.push(`${at}: table "${table.id}" hides its key column "${table.keyColumn}", and not every row carries it.`);
    }
  }

  if (scene.log.columns.some((column) => column.key === '#')) {
    issues.push(`${at}: the log has a column keyed "#", but "#" is added by the console; leave it out.`);
  }

  for (const [id, packet] of Object.entries(scene.packets ?? {})) {
    const total = packet.layers.reduce((sum, layer) => sum + layer.size, 0);
    if (packet.size !== total) {
      issues.push(`${at}: Packet "${id}" size ${packet.size} does not equal the sum of its layer sizes (${total}).`);
    }
  }
}

/** The status cues: a start may not carry one, since it is settled before each step's own status and would beat it. */
const STATUS_CUES: readonly string[] = ['status', 'status-known', 'status-done'];

/**
 * A scene's start: only on a figure whose driver shows one (as a board is), then cues the figure has, and no
 * status, which is each step's own.
 */
function checkStart(c: UnitContext, at: string): void {
  const { start } = c.unit.scene;
  if (start.length === 0) return;
  if (!c.parts.start) {
    c.issues.push(`${at}: the scene has a start, but the ${c.figure} figure takes none.`);
    return;
  }
  const where = `${at}: the scene's start`;
  checkCues(start, where, c, true);
  for (const { cue } of start) {
    if (STATUS_CUES.includes(cue)) c.issues.push(`${where}: cue "${cue}" sets the status, and a start may not; each step sets its own.`);
  }
}

function checkCues(cues: Cue[] | undefined, where: string, c: UnitContext, atStart = false): void {
  // `hide` is for a scene's start alone; `drop` is for an event alone, and one to an event.
  if (!atStart && (cues ?? []).some((q) => q.cue === 'hide')) c.issues.push(`${where}: cue "hide" is for a scene's start; an event cannot hide a part.`);
  if (!atStart && (cues ?? []).some((q) => q.cue === 'show')) c.issues.push(`${where}: cue "show" is for a scene's start; an event cannot show a part.`);
  if (!atStart && (cues ?? []).some((q) => q.cue === 'frames')) c.issues.push(`${where}: cue "frames" is for a scene's start; an event cannot change the setup.`);
  if (atStart && (cues ?? []).some((q) => q.cue === 'drop')) c.issues.push(`${where}: cue "drop" is for an event; the start cannot drop a packet.`);
  if (atStart && (cues ?? []).some((q) => q.cue === 'park' || q.cue === 'unpark')) c.issues.push(`${where}: cues "park" and "unpark" are for an event; the start cannot park a tag.`);
  if ((cues ?? []).filter((q) => q.cue === 'drop').length > 1) c.issues.push(`${where}: an event has at most one "drop" cue.`);
  for (const { cue, arg } of cues ?? []) {
    const type = Object.hasOwn(c.parts.cues, cue) ? c.parts.cues[cue] : undefined;
    if (type === undefined) c.issues.push(`${where}: cue "${cue}" is not one the ${c.figure} figure has.`);
    else if (type === 'text' && arg === undefined) c.issues.push(`${where}: cue "${cue}" needs an arg.`);
    else if (type === 'flag' && arg !== undefined) c.issues.push(`${where}: cue "${cue}" is a flag and takes no arg.`);
    else if (type === 'text' && arg !== undefined) {
      const allowed = Object.hasOwn(c.parts.args ?? {}, cue) ? c.parts.args![cue] : undefined;
      if (allowed === undefined || allowed.includes(arg)) continue;
      if (allowed.length > 4) {
        c.issues.push(`${where}: cue "${cue}" arg "${arg}" is not one the ${c.figure} figure can show.`);
      } else {
        const quoted = allowed.map((a) => `"${a}"`);
        const list = quoted.length === 1 ? quoted[0]! : `${quoted.slice(0, -1).join(', ')} or ${quoted.at(-1)}`;
        c.issues.push(`${where}: cue "${cue}" takes ${list}, not "${arg}".`);
      }
    }
  }
}

function checkLogRow(log: Row, where: string, c: UnitContext): void {
  for (const key of Object.keys(log)) {
    if (key === '#') c.issues.push(`${where}: log key "#" is added by the console; leave it out.`);
    else if (key === 'plain') c.issues.push(`${where}: log key "plain" comes from the event's own "plain"; leave it out of log.`);
    else if (!c.logKeys.has(key)) {
      c.issues.push(`${where}: log key "${key}" is not a column of the unit's log (${[...c.logKeys].join(', ')}).`);
    }
  }
}

function checkEvent(e: SceneEvent, at: string, c: UnitContext): void {
  const { issues, figure } = c;

  if (e.type === 'table') {
    const where = `${at}: table event "${e.id}"`;
    if (!c.tables.some((t) => t.id === e.table)) {
      const names = c.tables.map((t) => `"${t.id}"`).join(', ');
      issues.push(`${where} names table "${e.table}", which the unit's panel does not have (${names === '' ? 'none' : names}).`);
    }
    // "Present" means not undefined: an empty key is a valid match that found nothing.
    for (const field of TABLE_OP_FIELDS[e.op]) {
      if (e[field] === undefined) issues.push(`${where} (${e.op}) needs "${field}".`);
    }
    // A match names the row it found (`key`, '' for none), or the rows that all match (`keys`), and the winner is one of them.
    if (e.op === 'match') {
      if (e.key === undefined && e.keys === undefined) issues.push(`${where} (match) needs "key" or "keys".`);
      if (e.keys !== undefined && e.key !== undefined && !e.keys.includes(e.key)) {
        issues.push(`${where} (match) has key "${e.key}", which is not one of its "keys".`);
      }
    }
    if (e.keys !== undefined) {
      if (e.op !== 'match') issues.push(`${where} (${e.op}) has "keys"; only a match names the rows that match.`);
      for (const key of duplicates(e.keys)) issues.push(`${where} lists "${key}" twice in "keys".`);
    }
    // Whose table it is now changes with a replace, which brings the new rows.
    if (e.by !== undefined && e.op !== 'replace') issues.push(`${where} (${e.op}) has "by"; only a replace says whose table it is.`);
    // Only a row an event adds or changes can be marked as a miss.
    if (e.miss !== undefined && e.op !== 'add' && e.op !== 'update') {
      issues.push(`${where} (${e.op}) has "miss"; only an add or an update marks its row as a miss.`);
    }
    return;
  }

  const where = `${at}: ${e.type} "${e.id}"`;
  checkLogRow(e.log, where, c);
  checkCues(e.cues, where, c);

  if (e.labels !== undefined) {
    if (!c.parts.labels) issues.push(`${where} has labels, but the ${figure} figure shows none.`);
    else if (c.unit.scene.panel?.type !== 'labels') issues.push(`${where} has labels, but the unit's panel is not a labels panel.`);
  }

  if (e.type === 'note') {
    // On the switch, a flood and a re-plug happen to a frame: only a message carries them. And the figure draws what a
    // frame did, never what a note says, so a note there would show nothing, or hide the frame before it.
    if (figure === 'switch') {
      issues.push(`${where} is a note; the switch figure draws frames only, so say it in the step's words.`);
      for (const { cue } of e.cues ?? []) if (cue === 'flood' || cue === 'plug') issues.push(`${where}: cue "${cue}" is for a message; a note sends no frame.`);
    }
    if (figure === 'pool') {
      for (const { cue } of e.cues ?? []) if (cue === 'skip') issues.push(`${where}: cue "skip" is for a reader's request; a note sends none.`);
    }
    if (e.board !== undefined && !c.parts.board) issues.push(`${where} has a board, but the ${figure} figure has none.`);
    // A glyph's colour and shape never say what it is alone: the legend says it in words.
    if (e.glyph !== undefined && !c.unit.scene.log.legend.some((entry) => entry.kind === e.glyph)) {
      issues.push(`${where} draws the ${e.glyph} glyph, which the unit's log legend does not explain.`);
    }
    return;
  }

  const place = (role: string, id: string) => {
    if (!c.parts.places.includes(id)) issues.push(`${where} ${role} "${id}", which the ${figure} figure does not have.`);
  };
  place('is sent from', e.from);
  place('is sent to', e.to);
  if (e.via !== undefined) checkVia(e, where, c);
  // A part the scene's start hides is not on the map, so no message can start or end there.
  for (const { cue, arg } of c.unit.scene.start) {
    if (cue === 'hide' && (e.from === arg || e.to === arg)) issues.push(`${where} is sent to or from "${arg}", which the scene's start hides.`);
  }
  // On the network map, the phone is drawn only once the start shows it, and any other server only with a layer that draws it.
  if (figure === 'net-map') {
    const shown = c.unit.scene.start.some((q) => q.cue === 'show' && q.arg === 'phone');
    for (const [role, id] of [['sent from', e.from], ['sent to', e.to]] as const) {
      if (id === 'phone' && !shown) issues.push(`${where} is ${role} "phone", which the scene's start does not show (cue "show phone").`);
      if (NET_MAP_BASE_PLACES.includes(id)) continue;
      // A site several layers draw (the web server, the mail server) is on the map when any one of them is in the scene.
      const drawn = Object.entries(NET_MAP_LAYERS).filter(([, plate]) => plateSites(plate).includes(id)).map(([layer]) => layer);
      if (drawn.length > 0 && !drawn.some((layer) => c.unit.scene.layers.includes(layer))) {
        const named = drawn.map((layer) => `"${layer}"`);
        issues.push(`${where} is ${role} "${id}", which needs ${named.length === 1 ? `the layer ${named[0]}` : `one of the layers ${named.join(', ')}`} in the scene.`);
      }
    }
  }
  if (c.parts.routes !== undefined && !c.parts.routes.includes(`${e.from}>${e.to}`)) {
    issues.push(`${where} rides from "${e.from}" to "${e.to}", a way the ${figure} figure does not have.`);
  }
  // On the switch, a frame to everyone is a broadcast and a broadcast is to everyone; a broadcast floods by itself.
  if (figure === 'switch') {
    if (e.kind === 'broadcast' && e.to !== 'all') issues.push(`${where} is a broadcast, so it is sent to "all".`);
    if (e.kind !== 'broadcast' && e.to === 'all') issues.push(`${where} is sent to "all", so its kind is "broadcast".`);
    if (e.kind === 'broadcast' && (e.cues ?? []).some((q) => q.cue === 'flood')) issues.push(`${where} is a broadcast, which floods by itself; leave out "flood".`);
    // The figure has no case for a frame that never arrives, so it would draw it as delivered.
    if (e.outcome === 'dropped') issues.push(`${where} is dropped, but the switch figure draws no drop; say it in words.`);
    // The laptop moves once; a second move to the port it is on would fade its cable out and back for nothing.
    if ((e.cues ?? []).some((q) => q.cue === 'plug' && q.arg === 'laptop 5')) {
      if (c.laptopMoved === true) issues.push(`${where}: cue "plug" moves the laptop to port 5, where it already is.`);
      c.laptopMoved = true;
    }
  }

  // On the pool, a skip is a reader's request passed over a server that is not the one it goes to, a no-answer is what a
  // note says, and every message arrives: the figure draws nothing else (E27).
  if (figure === 'pool') {
    for (const { cue, arg } of e.cues ?? []) {
      if (cue === 'skip') {
        if (!POOL_READERS.some((r) => r === e.from)) issues.push(`${where}: cue "skip" is for a reader's request; a message from "${e.from}" passes over no server.`);
        else if (arg === e.to) issues.push(`${where}: cue "skip" passes over "${arg}", the server the request goes to.`);
      }
      if (cue === 'no-answer') issues.push(`${where}: cue "no-answer" is for a note; a message sends something.`);
    }
    if (e.outcome !== undefined && e.outcome !== 'delivered') issues.push(`${where} is ${e.outcome}, but the pool figure draws every message arriving; say it in words.`);
  }

  if (e.outcome === 'dropped' && e.dropAt === undefined) issues.push(`${where} is dropped, so it needs "dropAt".`);
  if (e.outcome !== 'dropped' && e.dropAt !== undefined) issues.push(`${where} has "dropAt" but is not dropped.`);

  const panel = c.unit.scene.panel;
  if (e.check !== undefined) {
    if (panel?.type !== 'rules') issues.push(`${where}: check needs a rules panel.`);
    else if (e.check.table !== panel.rules.id) {
      issues.push(`${where}: check names table "${e.check.table}", not the rules table "${panel.rules.id}".`);
    }
  }
  if (e.known !== undefined) {
    if (panel?.type !== 'rules') issues.push(`${where}: known needs a rules panel.`);
    else if (e.known.table !== panel.conns.id) {
      issues.push(`${where}: known names table "${e.known.table}", not the conns table "${panel.conns.id}".`);
    }
  }

  if (e.packet !== undefined) {
    const packets = c.unit.scene.packets ?? {};
    const packet = Object.hasOwn(packets, e.packet) ? packets[e.packet] : undefined;
    if (packet === undefined) issues.push(`${where} names unknown packet "${e.packet}".`);
    else if (e.log.size !== undefined && e.log.size !== formatBytes(packet.size)) {
      issues.push(`${where}: log size "${e.log.size}" does not match packet "${e.packet}" (${formatBytes(packet.size)}).`);
    }
  }
}

// ---------------------------------------------------------------- the network map's parked tags and `via`

/** The first internet router a place's cable reaches, as the map draws it (src/art/scenes/net-map.ts, BASE_SITES and the plates' `puck`). */
function entryRouter(place: string): string | undefined {
  if (NET_MAP_ROUTERS.includes(place)) return place;
  if (place === 'resolver') return 'a';
  if (place === 'laptop' || place === 'router' || place === 'phone') return 'isp';
  for (const plate of Object.values(NET_MAP_LAYERS)) if (plateSites(plate).includes(place)) return 'puck' in plate ? plate.puck : 'c';
  return undefined;
}

/** The routers on the shortest way from one to another, both ends included. */
function hopsOf(a: string, b: string): string[] {
  const prev = new Map<string, string | null>([[a, null]]);
  const queue = [a];
  for (let n = queue.shift(); n !== undefined && n !== b; n = queue.shift()) {
    for (const [x, y] of NET_MAP_LINKS) {
      for (const [u, v] of [[x, y], [y, x]] as const) {
        if (u === n && !prev.has(v)) {
          prev.set(v, n);
          queue.push(v);
        }
      }
    }
  }
  const path: string[] = [];
  for (let n: string | null | undefined = b; n !== null && n !== undefined; n = prev.get(n)) path.unshift(n);
  return path;
}

/** A message's `via` (net-map): an internet router the ride passes through, neither end of it, on a delivered message, and not doubling back. */
function checkVia(e: MessageEvent, where: string, c: UnitContext): void {
  const via = e.via!;
  if (c.figure !== 'net-map') {
    c.issues.push(`${where}: "via" is for the network map; the ${c.figure} figure has no router to ride through.`);
    return;
  }
  if (!NET_MAP_ROUTERS.includes(via)) c.issues.push(`${where}: "via" is "${via}", which is not an internet router (${NET_MAP_ROUTERS.join(', ')}).`);
  if (via === e.from || via === e.to) c.issues.push(`${where}: "via" is "${via}", which is where the message is ${via === e.from ? 'sent from' : 'sent to'}; it must be another router.`);
  if (e.outcome === 'dropped') c.issues.push(`${where}: a dropped message cannot go "via" a router; a drop on a joined route is not designed.`);
  const [from, to] = [entryRouter(e.from), entryRouter(e.to)];
  if (!NET_MAP_ROUTERS.includes(via) || from === undefined || to === undefined) return;
  const way = [...hopsOf(from, via), ...hopsOf(via, to).slice(1)];
  if (new Set(way).size !== way.length) c.issues.push(`${where}: riding "via" ${via} passes router ${way.find((r, i) => way.indexOf(r) !== i)} twice, which the map does not draw.`);
}

/** Where a tag waits: its place, and its bay (from 1). */
interface Parked {
  place: string;
  bay: number;
}

/** `park <place> <bay> <TAG>`, read; the rules about the place, the bay and the tag are told in one issue each. */
function readPark(arg: string | undefined, where: string, c: UnitContext): { place: string; bay: number; tag: string } | null {
  const m = /^([a-z0-9-]+) ([1-9]) (.+)$/.exec(arg ?? '');
  if (m === null) {
    c.issues.push(`${where}: cue "park" needs "<place> <bay> <TAG>", not "${arg ?? ''}".`);
    return null;
  }
  const [place, bay, tag] = [m[1]!, Number(m[2]), m[3]!];
  const at = `${where}: cue "park ${arg}"`;
  let ok = true;
  const bays = Object.hasOwn(NET_MAP_BAY_COUNTS, place) ? NET_MAP_BAY_COUNTS[place]! : 0;
  if (bays === 0) {
    c.issues.push(`${at} names "${place}", which has no bays (${Object.keys(NET_MAP_BAY_COUNTS).join(', ')} do).`);
    ok = false;
  } else if (bay > bays) {
    c.issues.push(`${at} names bay ${bay}, but ${place} has ${bays === 1 ? 'one bay' : `${bays} bays`}.`);
    ok = false;
  }
  if (tag !== tag.trim()) {
    c.issues.push(`${at} has a tag with a space or other whitespace at its start or end.`);
    ok = false;
  } else if ([...tag].length > NET_MAP_TAG_MAX) {
    c.issues.push(`${at} has a tag of ${[...tag].length} characters; the limit is ${NET_MAP_TAG_MAX}.`);
    ok = false;
  }
  if (!ok) return null;
  if (place === 'web') {
    const drawn = Object.entries(NET_MAP_LAYERS).filter(([, plate]) => plateSites(plate).includes('web')).map(([layer]) => layer);
    if (!drawn.some((layer) => c.unit.scene.layers.includes(layer))) c.issues.push(`${at} needs a layer that draws the web server in the scene (${drawn.map((layer) => `"${layer}"`).join(', ')}).`);
  }
  if (place === 'laptop') {
    if (c.unit.scene.start.some((q) => q.cue === 'show' && q.arg === 'phone')) c.issues.push(`${at}: the laptop's column lies where the phone does, and the scene's start shows the phone.`);
    if (Object.hasOwn(c.unit.scene.labels, 'router')) c.issues.push(`${at}: the laptop's column lies under the home router's callout, and the scene's labels give "router".`);
  }
  return { place, bay, tag };
}

/**
 * The parked tags (net-map): `park` leaves a copy of a tag in a bay, and only a message with that tag takes it again
 * (it must park it where it lands), or `unpark laptop` sends the laptop's into its screen. Walks the unit's events in
 * step order, so the bays follow the story across steps.
 */
function checkParks(c: UnitContext, at: string): void {
  const parked = new Map<string, Parked>();
  const taken = (place: string, bay: number): string | undefined => [...parked].find(([, p]) => p.place === place && p.bay === bay)?.[0];
  for (const e of c.unit.steps.flatMap((s) => s.events)) {
    if (e.type === 'table') continue;
    const where = `${at}: ${e.type} "${e.id}"`;
    const cues = e.cues ?? [];
    const parks = cues.filter((q) => q.cue === 'park');
    const unparks = cues.filter((q) => q.cue === 'unpark');
    const drops = cues.filter((q) => q.cue === 'drop');
    if (e.type === 'note') {
      if (parks.length > 0 && unparks.length > 0) c.issues.push(`${where} carries both "park" and "unpark"; a note carries one of them.`);
      if ((parks.length > 0 || unparks.length > 0) && drops.length > 0) c.issues.push(`${where} carries "drop" with "park" or "unpark"; a note carries one of them.`);
      if (unparks.length > 1) c.issues.push(`${where} has more than one "unpark" cue.`);
    } else {
      if (unparks.length > 0) c.issues.push(`${where}: cue "unpark" is for a note; a message cannot send tags into the laptop's screen.`);
      if (parks.length > 0 && (e.outcome ?? 'delivered') !== 'delivered') c.issues.push(`${where}: cue "park" is for a message that is delivered; a ${e.outcome} one never reaches "${e.to}".`);
      if (parks.length > 1) c.issues.push(`${where}: a message parks its own tag once; it has ${parks.length} park cues.`);
      if (parks.length > 0 && cues.some((q) => q.cue === 'page')) c.issues.push(`${where}: a message that parks its own tag takes no "page" cue; the page would draw in over the tag's slide.`);
    }
    // A parked tag only moves by riding: the message with its tag leaves from where it waits, and parks it again where it lands.
    if (e.type === 'message') {
      const from = parked.get(e.tag);
      if (from !== undefined) {
        if (from.place !== e.from) c.issues.push(`${where}: "${e.tag}" is parked at ${from.place}; a parked tag only moves by riding from there, not from "${e.from}".`);
        parked.delete(e.tag);
        if (!parks.some((q) => readParkTag(q.arg) === e.tag)) c.issues.push(`${where} is sent from ${from.place} with the parked tag "${e.tag}", and must park it again where it lands (park ${e.to} <bay> ${e.tag}).`);
      }
    }
    for (const q of parks) {
      const p = readPark(q.arg, where, c);
      if (p === null) continue;
      if (e.type === 'message') {
        if (p.tag !== e.tag) c.issues.push(`${where}: a message parks only its own tag ("${e.tag}"), not "${p.tag}".`);
        if (p.place !== e.to) c.issues.push(`${where}: a message parks its own tag at where it lands ("${e.to}"), not at "${p.place}".`);
      } else if (parked.has(p.tag)) {
        c.issues.push(`${where}: "${p.tag}" is already parked at ${parked.get(p.tag)!.place}; one tag is never parked twice.`);
        continue;
      }
      const other = taken(p.place, p.bay);
      if (other !== undefined) {
        c.issues.push(`${where}: bay ${p.bay} at ${p.place} already holds "${other}"; two tags never share a bay.`);
        continue;
      }
      parked.set(p.tag, { place: p.place, bay: p.bay });
    }
    for (const q of unparks) {
      if (q.arg !== 'laptop') {
        c.issues.push(`${where}: cue "unpark" takes "laptop", not "${q.arg ?? ''}"; only the laptop's tags go into its screen.`);
        continue;
      }
      const here = [...parked].filter(([, p]) => p.place === q.arg).map(([tag]) => tag);
      if (here.length === 0) c.issues.push(`${where}: cue "unpark laptop" has nothing to take; no tag is parked at the laptop.`);
      for (const tag of here) parked.delete(tag);
    }
  }
}

/** The tag of a `park` cue's arg, or undefined when the arg is not one. */
const readParkTag = (arg: string | undefined): string | undefined => /^[a-z0-9-]+ [1-9] (.+)$/.exec(arg ?? '')?.[1];

function checkUnit(l: Lesson, u: Unit, issues: string[]): void {
  const at = `Unit "${u.id}"`;
  for (const id of duplicates(u.steps.map((s) => s.id))) issues.push(`${at}: Duplicate step id "${id}".`);
  for (const id of duplicates(u.practice.map((q) => q.id))) issues.push(`${at}: Duplicate question id "${id}".`);
  for (const q of u.practice) {
    if (q.answer < 0 || q.answer >= q.options.length) {
      issues.push(`${at}: Question "${q.id}" has answer ${q.answer}, but it has ${q.options.length} options (answers count from 0).`);
    }
  }

  const c: UnitContext = {
    figure: l.figure,
    parts: FIGURE_PARTS[l.figure],
    unit: u,
    logKeys: new Set(u.scene.log.columns.map((column) => column.key).filter((key) => key !== 'plain' && key !== '#')),
    tables: tablesOf(u),
    issues,
  };
  checkScene(c, at);

  // Events share one id space across the unit's steps.
  const owner = new Map<string, string>();
  for (const step of u.steps) {
    for (const e of step.events) {
      const first = owner.get(e.id);
      if (first !== undefined) {
        const where = first === step.id ? `twice in step "${first}"` : `in steps "${first}" and "${step.id}"`;
        issues.push(`${at}: Duplicate event id "${e.id}" ${where}; event ids must be unique across a unit's steps.`);
      } else {
        owner.set(e.id, step.id);
      }
      checkEvent(e, `${at}, step "${step.id}"`, c);
    }
  }
  if (l.figure === 'net-map') checkParks(c, at);
}

// ---------------------------------------------------------------- public API

/**
 * The lessons `validateLesson` has returned, each with the source registry it was checked against. The registry
 * accepts only these, and only when checked against the real `SOURCES`, so no lesson file can skip the rules or bring
 * its own sources.
 */
const defined = new WeakMap<object, SourceRegistry>();

/**
 * @internal Only `validateLesson` calls it: records a lesson it has just checked, with the registry it used, and
 * returns it. A lesson file never calls it.
 */
function markDefined(lesson: Lesson, checkedAgainst: SourceRegistry): Lesson {
  defined.set(lesson, checkedAgainst);
  return lesson;
}

/**
 * The source registry `validateLesson` checked `l` against when it returned `l`. Undefined for anything it did not
 * return, such as a copy or a lesson built by hand.
 */
export function definedWith(l: unknown): SourceRegistry | undefined {
  return typeof l === 'object' && l !== null ? defined.get(l) : undefined;
}

/**
 * Parses a lesson's shape with `schema`, or throws one LessonValidationError naming every shape problem (a missing
 * field, a wrong type, a key the schema does not know) with its path. Shape problems are reported on their own,
 * because the rules after them need a well-formed lesson to compare against.
 */
export function parseLessonShape<S extends z.ZodType>(schema: S, input: unknown): z.output<S> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) throw new LessonValidationError(parsed.error.issues.map(describeZodIssue), slugOf(input));
  return parsed.data;
}

/**
 * The structural rules every lesson keeps, whichever path it came by, as readable issues (empty when it has none): unique unit, step, question,
 * event and table ids; at most one override per limit; and a scene, events, tables and cues that fit the lesson's figure and each other.
 */
export function checkStructure(lesson: Lesson): string[] {
  const issues: string[] = [];
  for (const id of duplicates(lesson.units.map((u) => u.id))) issues.push(`Duplicate unit id "${id}".`);
  for (const limit of duplicates(lesson.overrides.map((o) => o.limit))) {
    issues.push(`Lesson "${lesson.slug}" overrides the ${limit} limit more than once; keep one override, with one reason.`);
  }
  for (const u of lesson.units) checkUnit(lesson, u, issues);
  return issues;
}

/**
 * What a cited lesson file writes. Its references are left out (they are listed from its citations); citation lists,
 * overrides and a scene's layers, labels and start may be.
 */
export type LessonInput = z.input<typeof lessonSchema>;

/**
 * Checks a lesson in the cited shape against `sources` and returns it, with each unit's references
 * listed from its citations in reading order. Its shape first (alone, as `parseLessonShape` reports it); then,
 * together, the cited rules (`cited.ts`: one unit, no written references, citations, the OSI badge, backing and
 * traces, sound citations, no lesson numbers) and the structural rules every lesson keeps (`checkStructure`). Throws
 * one LessonValidationError listing every problem. The numeric limits are the track's, checked in the registry.
 * Records `sources` with the lesson: the registry accepts a cited lesson only when that is the real `SOURCES`, so
 * another list is for tests alone.
 */
export function validateLesson(input: unknown, sources: SourceRegistry = SOURCES): Lesson {
  const lesson: Lesson = parseLessonShape(lessonSchema, input);
  const issues = [...checkCitedRules(lesson, sources), ...checkStructure(lesson)];
  if (issues.length > 0) throw new LessonValidationError(issues, lesson.slug);
  const units = lesson.units.map((u) => ({ ...u, references: sourceListOf(citationsOf(u), sources) }));
  return markDefined({ ...lesson, units }, sources);
}

/**
 * The entry point for every new lesson file: it validates at import against `SOURCES`, the real registry, so a bad
 * lesson, or one citing a source not in `SOURCES`, fails the build.
 */
export function defineLesson(input: LessonInput): Lesson {
  return validateLesson(input, SOURCES);
}

/** Issues with a certification track's pin and the objectives its lessons map to. */
function checkCertification(t: CertificationTrack, sources: SourceRegistry): string[] {
  const issues: string[] = [];
  const { exam } = t;
  const source = Object.hasOwn(sources, exam.source) ? sources[exam.source] : undefined;
  if (source === undefined) {
    issues.push(`The exam source "${exam.source}" is not in the source registry.`);
  } else {
    if (source.kind !== 'cert-objectives') {
      issues.push(`The exam source "${exam.source}" is a source of kind "${source.kind}", not cert-objectives.`);
    }
    if (source.version !== exam.version) {
      issues.push(
        `The track pins exam version "${exam.version}", but the registry's "${exam.source}" is version "${source.version ?? 'unversioned'}"; ` +
          'pin the version the registry holds, or update the registry first.',
      );
    }
  }
  for (const part of t.parts) {
    for (const lesson of part.lessons) {
      const seen = new Set<string>();
      for (const o of lesson.objectives) {
        const at = `Lesson "${lesson.slug}", objective ${o.exam} ${o.objective}`;
        if (!exam.codes.includes(o.exam)) {
          issues.push(`${at}: "${o.exam}" is not one of the track's exam codes (${exam.codes.join(', ')}).`);
        }
        if (seen.has(`${o.exam} ${o.objective}`)) issues.push(`Lesson "${lesson.slug}" lists objective ${o.exam} ${o.objective} twice.`);
        seen.add(`${o.exam} ${o.objective}`);
        if (o.cite.source !== exam.source) {
          issues.push(`${at}: the citation is from "${o.cite.source}", but the track's objectives document is "${exam.source}".`);
        }
        if (o.cite.section !== o.objective) {
          issues.push(`${at}: the citation is at section ${o.cite.section}, but the objective is ${o.objective}; cite the objective's own section.`);
        }
        for (const problem of checkCitation(o.cite, sources, 'objectives')) issues.push(`${at}: ${problem}`);
      }
    }
  }
  return issues;
}

/**
 * Validates a track's shape, that part ids and lesson slugs are unique and, for a certification track, its pin and
 * the objectives its lessons map to, checked against `sources`. Throws one Error listing every problem. The registry
 * checks every track again against the real `SOURCES` (`checkTracks`), so another list is for tests alone.
 */
export function defineTrack(t: Track, sources: SourceRegistry = SOURCES): Track {
  const parsed = trackSchema.safeParse(t);
  const issues = parsed.success ? [] : parsed.error.issues.map(describeZodIssue);
  if (parsed.success) {
    for (const id of duplicates(parsed.data.parts.map((p) => p.id))) issues.push(`Duplicate part id "${id}".`);
    const slugs = parsed.data.parts.flatMap((p) => p.lessons.map((x) => x.slug));
    for (const slug of duplicates(slugs)) issues.push(`Duplicate lesson slug "${slug}".`);
    if (parsed.data.type === 'certification') issues.push(...checkCertification(parsed.data, sources));
  }
  if (!parsed.success || issues.length > 0) {
    const name = typeof t?.id === 'string' ? ` "${t.id}"` : '';
    throw new Error(`Track${name} is invalid:\n${issues.map((issue) => `  - ${issue}`).join('\n')}`);
  }
  return parsed.data;
}
