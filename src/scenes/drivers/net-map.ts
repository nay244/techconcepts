// Only types from the drawing module: its code is for the build, and stays out of the page.
import type { NetMapData } from '../../art/scenes/net-map';
import { NET_MAP_LAPTOP_ADDR, NET_MAP_LAYERS, NET_MAP_OPTIONAL, NET_MAP_ROUTERS, NET_MAP_TAG_MAX } from '../../art/scenes/net-map-layers';
import type { Cue, MessageEvent, SceneEvent } from '../../content/schema';
import type { DriverModule, PlayOptions, SceneDriver, SceneView } from '../driver';
import { animate, easeInOut, wait } from '../motion';

/**
 * Moves How the Internet Works' network map (src/art/scenes/net-map.ts), as the approved mockup's `send`,
 * `renderState` and `clearScene` do (FIGS/lesson-internet2.mjs, internet-v2.html).
 *
 * A message's lit tag rides the cables from one place to another, hopping over each router, with its carrier
 * (`over`) under it and a trail of light behind it. The sender lights up as it goes, the receiver as it lands, and a
 * router lights when a message stops on it. A broadcast also spreads a ring across the home plate. A dropped message
 * stops at `dropAt`: its trail turns the blocked red, a drop mark says LOST, and the tag fades.
 *
 * What a message leaves once it lands are its cues, and `show` paints all of them that have played, in order:
 * - `status <text>`: the laptop's status line; `status-known` and `status-done` style it (with or without the
 *   status of the same event), and a new status without either is plain again;
 * - `conn <open|seal|close> <from>><to>[ data]`: a connection that stays lit, glows brighter once sealed, and goes
 *   once closed; `data` is FTP's dashed second line, drawn above the first;
 * - `page text|full`: the page on the laptop's screen, its text first, then all of it;
 * - `lock`: the padlock in the laptop's address bar;
 * - `tray <site> <on|off>`: a letter waiting on a mail server's tray, or gone from it (it leaves as it is sent);
 * - `addr <text>`, `url <text>`: the laptop's address and its address bar;
 * - `drop <router>`: a DROPPED mark on that router's top, which stays, for a packet a router threw away;
 * - `hide resolver` (a unit's start only): the DNS resolver, its cable and its callout are left off the map;
 * - `show phone` (a unit's start only): the phone, which every other map leaves off, lies on the home plate;
 * - `park <place> <bay> <TAG>`: a copy of the tag waits, unlit, in that bay (the laptop's four, the web server's four, a
 *   router's top) until a message with its tag takes it or `unpark <place>` sends that place's tags into the laptop's
 *   screen; a gap (a dashed outline) marks an empty bay with a parked tag before and after it. A note that parks takes
 *   600 ms, one that unparks 700; a message that parks its own tag slides it into its bay as it rests.
 *
 * A message `via` a router rides through it: from → via → to is one ride, over two routes the map already has.
 *
 * A unit's labels give the words before any cue: `laptop` (the status line), `laptopAddr`, `url`, and `router`,
 * the home router's callout in one or two lines (a line with a number is an address, a line of words a note), and
 * `isp`, `a`, `b`, `c` and `d`, the name on a strip at each internet router; a router without a label has no strip.
 * A unit's start (`view.start`) is cues already in place before any has played, at every position of the unit:
 * TLS's line, already open (`conn open laptop>web`), and the letters waiting in POP3's and IMAP's mailbox
 * (`tray mail on`). The cues that play go on from there, so TLS's handshake seals the line its start opened.
 * A step's own status (`view.status`, from `step.status`) takes over the status line from the `laptop` label as the
 * step starts, plain; a status cue that has played wins over both.
 * A cue the map cannot show, such as a connection with no route, is a mistake in the lesson: it throws.
 */

type Point = [number, number, number];
type Flat = [number, number];

/** A message's ride at 1×: a slow one takes 500 ms and 4 a unit of cable, a quick one 320 ms and 2.2 a unit. Then it rests. */
const SLOW = { ms: 500, perUnit: 4, rest: 450 };
const FAST = { ms: 320, perUnit: 2.2, rest: 300 };
/** A lost message's tag fades, then its drop mark stays a while. */
const LOST_FADE_MS = 380;
const LOST_REST_MS = 650;
/** How far along its ride a message is when the sender's light goes off. */
const LET_GO_AT = 0.25;
/** A broadcast's ring: its size as it sets off, how much it grows, and where it rests, still, under reduced motion. */
const RING = { start: 0.6, grow: 2.6, opacity: 0.95, still: 2.2, stillOpacity: 0.6 };
/** The trail and the tag as they set off. */
const TRAIL_OPACITY = 0.95;
/** Places at home: a message to or from one lights the home router's lights. */
const HOME = new Set(['laptop', 'router', 'phone']);
/** FTP's data line is drawn this far above its control line. */
const DATA_LINE_LIFT = 'translate(0 -6)';
/** A table event takes this long on the map, so the learner sees the table before the next thing happens; a drop note too. */
const TABLE_MS = { replace: 600, match: 900, remove: 600 } as const;
const DROP_NOTE_MS = 900;
/** A note that parks tags lands them one after another over this long; one that unparks sends them into the laptop's screen. */
const PARK_NOTE_MS = 600;
const UNPARK_NOTE_MS = 700;
/** A message that parks its own tag: the tag slides into its bay over the first part of its rest, shrinking to a parked tag's size. */
const SLIDE_MS = 250;
/** A parked tag is this size, unlit; an empty bay between two of them is outlined at the same size. */
const PARK_SCALE = 0.9;
/** The unpark's glide: the tags shrink to this much of a parked tag's size, and end 6 across, 14 back and 16 up from the end of the route into the laptop. */
const GLIDE = { shrink: 0.6, at: [-6, -14, 16] as const };
/** A tag's top face is this high, and its footprint this deep, in plate units (net-map.ts `tag`). */
const TAG_TOP = 3.2;
const TAG_DEPTH = 10;
/** A name strip's width: its letters, and the room round them. */
const stripWidth = (text: string): number => 11 + 7.4 * [...text].length;

/** The figure's description names its resolver; a map that hides it does not. */
const RESOLVER_SENTENCE = ' Behind it, the DNS resolver, a card-index cabinet.';
/** As drawn, home is a laptop and its router; a map that shows the phone says so. */
const HOME_SENTENCE = 'a laptop and its router.';
const HOME_WITH_PHONE = 'a laptop, a phone and their router.';

/** A `conn` cue, read. */
export interface ConnCue {
  action: 'open' | 'seal' | 'close';
  from: string;
  to: string;
  /** FTP's second line, for the data, beside the control line. */
  data: boolean;
}

/** Reads a `conn` cue's argument, `"<open|seal|close> <from>><to>[ data]"`, or throws: anything else is a mistake in the lesson. */
export function parseConn(arg: string): ConnCue {
  const m = /^(open|seal|close) ([a-z0-9-]+)>([a-z0-9-]+)( data)?$/.exec(arg);
  if (m === null) throw new Error(`The network map's conn cue needs "<open|seal|close> <from>><to>[ data]", not "${arg}".`);
  return { action: m[1] as ConnCue['action'], from: m[2]!, to: m[3]!, data: m[4] !== undefined };
}

/** A `park` cue, read: where a copy of the tag waits. */
export interface ParkCue {
  place: string;
  bay: number;
  tag: string;
}

/** Reads a `park` cue's argument, `"<place> <bay> <TAG>"`, or throws: anything else is a mistake in the lesson. */
export function parsePark(arg: string): ParkCue {
  const m = /^([a-z0-9-]+) ([1-9]) (.+)$/.exec(arg);
  if (m === null) throw new Error(`The network map's park cue needs "<place> <bay> <TAG>", not "${arg}".`);
  return { place: m[1]!, bay: Number(m[2]), tag: m[3]! };
}

function parseTray(arg: string): { site: string; on: boolean } {
  const m = /^([a-z0-9-]+) (on|off)$/.exec(arg);
  if (m === null) throw new Error(`The network map's tray cue needs "<site> <on|off>", not "${arg}".`);
  return { site: m[1]!, on: m[2] === 'on' };
}

function routeBetween(data: NetMapData, from: string, to: string): Point[] {
  const key = `${from}>${to}`;
  if (!Object.hasOwn(data.routes, key)) throw new Error(`The network map has no route ${key}.`);
  return data.routes[key]!;
}

/** A message's way: the route from one place to the other, or, `via` a router, the two routes joined at that router's top (shared, so once). */
export function routeOf(data: NetMapData, e: { from: string; to: string; via?: string }): Point[] {
  if (e.via === undefined) return routeBetween(data, e.from, e.to);
  return [...routeBetween(data, e.from, e.via), ...routeBetween(data, e.via, e.to).slice(1)];
}

/** A route's length on the plates, as the mockup measures it: across and along, not up. */
function lengthOf(points: Point[]): number {
  return points.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - points[i]![0], p[1] - points[i]![1]), 0);
}

const paceOf = (e: MessageEvent) => (e.fast === true ? FAST : SLOW);
const travelOf = (e: MessageEvent, length: number): number => paceOf(e).ms + paceOf(e).perUnit * length;

function dropAtOf(e: MessageEvent): number {
  if (e.dropAt === undefined) throw new Error(`The dropped message "${e.id}" needs "dropAt".`);
  return e.dropAt;
}

function duration(event: SceneEvent, data: unknown): number {
  // A table event takes the time to be seen (an add, an update or a clear lands at once), and
  // so does a note that drops a packet; every other note lands at once.
  if (event.type === 'table') return event.op === 'replace' || event.op === 'match' || event.op === 'remove' ? TABLE_MS[event.op] : 0;
  if (event.type === 'note') {
    const has = (cue: string): boolean => event.cues?.some((c) => c.cue === cue) === true;
    return has('drop') ? DROP_NOTE_MS : has('park') ? PARK_NOTE_MS : has('unpark') ? UNPARK_NOTE_MS : 0;
  }
  const travel = travelOf(event, lengthOf(routeOf(data as NetMapData, event)));
  if (event.outcome === 'dropped') return travel * dropAtOf(event) + LOST_FADE_MS + LOST_REST_MS;
  return travel + paceOf(event).rest;
}

/** Quick at first, slowing to a stop: how a lost message runs out of road. */
const easeOut = (x: number): number => 1 - (1 - x) ** 2;

/** A route as the tag rides it: its points, how far along the plates each one is, and the points along the cables on screen. */
interface Ride {
  points: Point[];
  cum: number[];
  total: number;
  flat: Flat[];
}

/** The segment `k` of the way along a ride is on, and how far along that segment. */
function seat(r: Ride, k: number): [number, number] {
  const d = Math.min(Math.max(k, 0), 1) * r.total;
  let i = 1;
  while (i < r.cum.length - 1 && r.cum[i]! < d) i++;
  return [i, (d - r.cum[i - 1]!) / (r.cum[i]! - r.cum[i - 1]! || 1)];
}

function pointAt(r: Ride, k: number): Point {
  const [i, f] = seat(r, k);
  const [a, b] = [r.points[i - 1]!, r.points[i]!];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

function flatAt(r: Ride, k: number): Flat {
  const [i, f] = seat(r, k);
  const [a, b] = [r.flat[i - 1]!, r.flat[i]!];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
}

const pointsOf = (list: Flat[]): string => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

/** The cable a ride has covered between `a` and `b` of the way along, on screen. */
function trailOf(r: Ride, a: number, b: number): string {
  const list = [flatAt(r, a)];
  for (let i = 1; i < r.points.length - 1; i++) {
    const k = r.cum[i]! / r.total;
    if (k > a && k < b) list.push(r.flat[i]!);
  }
  list.push(flatAt(r, b));
  return pointsOf(list);
}

/** What the map shows once its cues have played: the laptop's lines, the connections, the page, the padlock and the trays. */
interface MapState {
  status: string;
  style: '' | 'known' | 'done';
  addr: string;
  url: string;
  /** Lit connections in the order they opened, by id: the route, or the route and ` data`. */
  conns: Map<string, { route: string; data: boolean; sealed: boolean }>;
  page: '' | 'text' | 'full';
  lock: boolean;
  trays: Map<string, boolean>;
  /** The tags that wait in a bay, by tag, in the order they were parked. */
  parks: Map<string, { place: string; bay: number }>;
  /** The router a packet was dropped at, and the parts left off the map. */
  drop: string | null;
  hidden: Set<string>;
  /** The parts left off the map until a unit's start shows them, and the layers the unit shows, for the figure's words. */
  shown: Set<string>;
  layers: readonly string[];
}

/** A cue and the event that played it. */
type PlayedCue = Cue & { eventId: string };

function create(root: SVGSVGElement, data: unknown): SceneDriver {
  // Drawn by drawNetMap() at build time, beside this figure.
  const map = data as NetMapData;
  const part = <T extends SVGElement = SVGElement>(id: string): T => {
    const found = root.querySelector<T>(`#${id}`);
    if (found === null) throw new Error(`The network map has no #${id}.`);
    return found;
  };
  /** Parts named `…-<what>-<site>`, by site: each layer that draws a server draws its own. */
  const bySite = (what: string, selector: string): Map<string, SVGElement[]> => {
    const found = new Map<string, SVGElement[]>();
    for (const el of root.querySelectorAll<SVGElement>(selector)) {
      const site = el.id.slice(el.id.lastIndexOf(`-${what}-`) + what.length + 2);
      found.set(site, [...(found.get(site) ?? []), el]);
    }
    return found;
  };

  const layers = [...root.querySelectorAll<SVGGElement>('[data-layer]')];
  const status = part('nm-lapState');
  const addr = part('nm-lapAddr');
  const url = part('nm-url');
  const router = part('nm-router');
  const routerLines = [part('nm-router-1'), part('nm-router-2')];
  const conns = part('nm-conns');
  const page = [...part('nm-page').querySelectorAll<SVGElement>('[data-part]')];
  const busies = bySite('busy', '[id*="-busy-"]');
  const holds = bySite('hold', '.nm-hold');
  const lock = holds.get('lock') ?? [];
  const homeLeds = [1, 2, 3].map((i) => part(`nm-home-led-${i}`));
  const tags = Array.from({ length: NET_MAP_TAG_MAX }, (_, i) => part(`nm-tag-${i + 1}`));
  const over = part('nm-over');
  const overText = over.querySelector('text')!;
  const trail = part('nm-trail');
  /** The figure's background under a lost trail, so the red always has its own edge (net-map.css). */
  const edge = part('nm-trail-edge');
  const drop = part('nm-drop');
  const discard = part('nm-discard');
  /** What the map can leave off, by name (`hide`), and the figure's own words for it, which the hidden resolver is left out of. */
  const bases = new Set([...root.querySelectorAll<SVGElement>('[data-base]')].map((el) => el.dataset.base!));
  const strips = new Map(NET_MAP_ROUTERS.map((name) => [name, part<SVGGElement>(`nm-name-${name}`)] as const));
  const described = root.getAttribute('aria-label') ?? '';
  const ring = part('nm-ring');

  const [ax, bx, cx, ay, by, cy] = map.M as [number, number, number, number, number, number];
  /** A point of the plates on screen, from the figure's origin, where the tags are drawn. */
  const onScreen = ([x, y, z]: Point): Flat => [ax * x + bx * y + cx * z, ay * x + by * y + cy * z];
  /** A point of the plates along the cables' tops, in the figure's own frame, where trails and lines are drawn. */
  const onCable = ([x, y]: Point): Flat => {
    const [sx, sy] = onScreen([x, y, map.TZ]);
    return [map.O[0] + sx, map.O[1] + sy];
  };
  const rideOf = (from: string, to: string, via?: string): Ride => {
    const points = routeOf(map, { from, to, via });
    const cum = [0];
    for (let i = 1; i < points.length; i++) cum.push(cum[i - 1]! + Math.hypot(points[i]![0] - points[i - 1]![0], points[i]![1] - points[i - 1]![1]));
    return { points, cum, total: cum.at(-1)!, flat: points.map(onCable) };
  };
  /** Moves a part to a point on screen. A tag is drawn at the figure's origin, so a scaled one is scaled about that point. */
  const moveTo = (el: SVGElement, [x, y]: Flat, scale = 1): void =>
    el.setAttribute(
      'transform',
      scale === 1
        ? `translate(${x.toFixed(1)} ${y.toFixed(1)})`
        : `translate(${(x + map.O[0]).toFixed(1)} ${(y + map.O[1]).toFixed(1)}) scale(${scale.toFixed(3)}) translate(${-map.O[0]} ${-map.O[1]})`,
    );
  const fade = (el: SVGElement, opacity: number): void => {
    el.style.opacity = String(opacity);
  };
  const light = (els: SVGElement[] | undefined, on: boolean): void => {
    for (const el of els ?? []) el.classList.toggle('on', on);
  };
  const ringAt = (s: number): string =>
    `translate(${map.ring.at[0]} ${map.ring.at[1]}) scale(${s.toFixed(3)}) translate(${-map.ring.o[0]} ${-map.ring.o[1]})`;
  const tagFor = (label: string): SVGElement => tags[Math.min(Math.max([...label].length, 1), NET_MAP_TAG_MAX) - 1]!;
  const wants = (state: MapState, el: SVGElement): boolean => state.page === 'full' || (state.page === 'text' && el.dataset.part === 'text');

  /**
   * The map once the unit's start and then `played` have played, in order, over the unit's labels and the step's
   * own status (which takes over from the `laptop` label). Throws for a cue it cannot show.
   */
  function settle(view: SceneView, played: readonly PlayedCue[]): MapState {
    const { labels } = view;
    const s: MapState = {
      status: view.status ?? labels.laptop ?? '',
      style: '',
      addr: labels.laptopAddr ?? NET_MAP_LAPTOP_ADDR,
      url: labels.url ?? '',
      conns: new Map(),
      page: '',
      lock: false,
      trays: new Map(),
      parks: new Map(),
      drop: null,
      hidden: new Set(),
      shown: new Set(),
      layers: view.layers,
    };
    // The start first, as though it had played before the first event; then one event's cues at a time, so a status
    // and its style go together whatever their order.
    const groups: (readonly Cue[])[] = [view.start];
    for (let from = 0; from < played.length; ) {
      let end = from;
      while (end < played.length && played[end]!.eventId === played[from]!.eventId) end++;
      groups.push(played.slice(from, end));
      from = end;
    }
    for (const own of groups) {
      for (const { cue, arg = '' } of own) {
        if (cue === 'status') [s.status, s.style] = [arg, ''];
        else if (cue === 'addr') s.addr = arg;
        else if (cue === 'url') s.url = arg;
        else if (cue === 'lock') s.lock = true;
        else if (cue === 'drop') {
          if (!Object.hasOwn(map.tops, arg)) throw new Error(`The network map has no router "${arg}" to drop a packet at.`);
          s.drop = arg;
        } else if (cue === 'hide') {
          if (!bases.has(arg) || NET_MAP_OPTIONAL.includes(arg)) throw new Error(`The network map cannot hide "${arg}".`);
          s.hidden.add(arg);
        } else if (cue === 'show') {
          if (!NET_MAP_OPTIONAL.includes(arg)) throw new Error(`The network map cannot show "${arg}".`);
          s.shown.add(arg);
        } else if (cue === 'page') {
          if (arg !== 'text' && arg !== 'full') throw new Error(`The network map's page cue needs "text" or "full", not "${arg}".`);
          s.page = arg;
        } else if (cue === 'tray') {
          const { site, on } = parseTray(arg);
          if (!holds.has(site) || site === 'lock') throw new Error(`The network map has no tray "${site}".`);
          s.trays.set(site, on);
        } else if (cue === 'park') {
          const { place, bay, tag } = parsePark(arg);
          if (bayOf(place, bay) === undefined) throw new Error(`The network map has no bay ${bay} at "${place}" to park a tag in.`);
          s.parks.set(tag, { place, bay });
        } else if (cue === 'unpark') {
          if (!Object.hasOwn(map.bays, arg)) throw new Error(`The network map has no bays at "${arg}" to unpark.`);
          for (const [tag, at] of s.parks) if (at.place === arg) s.parks.delete(tag);
        } else if (cue === 'conn') connect(s, parseConn(arg));
      }
      if (own.some((c) => c.cue === 'status-done')) s.style = 'done';
      else if (own.some((c) => c.cue === 'status-known')) s.style = 'known';
    }
    return s;
  }

  function connect(s: MapState, c: ConnCue): void {
    const route = `${c.from}>${c.to}`;
    routeBetween(map, c.from, c.to);
    const id = c.data ? `${route} data` : route;
    const line = s.conns.get(id);
    if (c.action === 'open') s.conns.set(id, { route, data: c.data, sealed: false });
    else if (line === undefined) throw new Error(`The conn cue ${c.action === 'seal' ? 'seals' : 'closes'} ${id}, which is not open.`);
    else if (c.action === 'seal') line.sealed = true;
    else s.conns.delete(id);
  }

  const bayOf = (place: string, bay: number): Point | undefined => (Object.hasOwn(map.bays, place) ? map.bays[place]![bay - 1] : undefined);
  const layer = part('nm-l-tags');

  /**
   * The parked tags: copies of the tag their words fit, unlit, at a parked tag's size, in their bays, back to front and
   * behind the moving tags; and a dashed outline at each empty bay that has a parked tag before it and one after it.
   */
  function paintParks(parks: ReadonlyMap<string, { place: string; bay: number }>): void {
    const old = layer.querySelectorAll('.nm-park, .nm-gap');
    if (old.length === 0 && parks.size === 0) return;
    for (const el of old) el.remove();
    const list = [...parks].map(([tag, { place, bay }]) => ({ tag, place, bay, at: bayOf(place, bay)! }));
    list.sort((a, b) => a.at[0] + a.at[1] - (b.at[0] + b.at[1]));
    const behind = tags[0]!;
    for (const p of list) {
      const copy = tagFor(p.tag).cloneNode(true) as SVGElement;
      copy.removeAttribute('id');
      copy.removeAttribute('style');
      copy.setAttribute('class', 'nm-park');
      copy.querySelector('[data-lit]')?.removeAttribute('data-lit');
      copy.querySelector('.nm-tag-t')!.textContent = p.tag;
      copy.dataset.tag = p.tag;
      copy.dataset.place = p.place;
      copy.dataset.bay = String(p.bay);
      moveTo(copy, onScreen(p.at), PARK_SCALE);
      layer.insertBefore(copy, behind);
    }
    const places = new Set(list.map((p) => p.place));
    for (const place of places) {
      const here = list.filter((p) => p.place === place);
      const filled = here.map((p) => p.bay);
      for (let bay = 2; bay < Math.max(...filled); bay++) {
        if (filled.includes(bay) || !filled.some((b) => b < bay)) continue;
        // As wide as the nearest tag before it: the filled bay below it with the highest number.
        const near = here.filter((p) => p.bay < bay).reduce((a, b) => (b.bay > a.bay ? b : a));
        const w = Math.min(Math.max([...near.tag].length, 1), NET_MAP_TAG_MAX) * 2.9 + 8;
        const [x, y, z] = bayOf(place, bay)!;
        const corners = ([[-w / 2, -TAG_DEPTH / 2], [w / 2, -TAG_DEPTH / 2], [w / 2, TAG_DEPTH / 2], [-w / 2, TAG_DEPTH / 2]] as const).map(([u, v]) => {
          const [sx, sy] = onScreen([x + u * PARK_SCALE, y + v * PARK_SCALE, z + TAG_TOP * PARK_SCALE]);
          return [map.O[0] + sx, map.O[1] + sy] as Flat;
        });
        const gap = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        gap.setAttribute('class', 'nm-gap');
        gap.setAttribute('points', pointsOf(corners));
        gap.dataset.place = place;
        gap.dataset.bay = String(bay);
        layer.insertBefore(gap, behind);
      }
    }
  }

  /** What stays once played: the laptop's lines, the lit connections, the trays, the padlock and the page. */
  function paint(s: MapState): void {
    status.textContent = s.status;
    status.setAttribute('class', s.style === '' ? 'nm-state' : `nm-state ${s.style}`);
    addr.textContent = s.addr;
    url.textContent = s.url;
    conns.replaceChildren(
      ...[...s.conns.values()].map((c) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        line.setAttribute('class', `nm-conn${c.data ? ' alt' : ''}${c.sealed ? ' sealed' : ''}`);
        if (c.data) line.setAttribute('transform', DATA_LINE_LIFT);
        line.setAttribute('points', pointsOf(rideOf(...(c.route.split('>') as [string, string])).flat));
        return line;
      }),
    );
    for (const [site, els] of holds) if (site !== 'lock') light(els, s.trays.get(site) ?? false);
    light(lock, s.lock);
    for (const el of page) fade(el, wants(s, el) ? 1 : 0);
    if (s.drop === null) fade(discard, 0);
    else {
      moveTo(discard, map.tops[s.drop]!);
      fade(discard, 1);
    }
    paintParks(s.parks);
    for (const el of root.querySelectorAll<SVGElement>('[data-base]')) {
      const base = el.dataset.base!;
      el.toggleAttribute('data-hidden', s.hidden.has(base) || (NET_MAP_OPTIONAL.includes(base) && !s.shown.has(base)));
    }
    // What the figure says it draws is what it draws: no resolver, a phone and a stranger only when shown.
    let words = s.hidden.has('resolver') ? described.replace(RESOLVER_SENTENCE, '') : described;
    if (s.shown.has('phone')) words = words.replace(HOME_SENTENCE, HOME_WITH_PHONE);
    for (const key of s.layers) {
      const sentence = Object.hasOwn(NET_MAP_LAYERS, key) ? NET_MAP_LAYERS[key]!.describe : undefined;
      if (sentence !== undefined) words += ` ${sentence}`;
    }
    root.setAttribute('aria-label', words);
  }

  /** Each router's name on its strip, from the unit's labels: a router without one has none. */
  function paintNames(labels: Record<string, string>): void {
    for (const [name, strip] of strips) {
      const text = Object.hasOwn(labels, name) ? labels[name]! : null;
      if (text === null) {
        strip.setAttribute('display', 'none');
        continue;
      }
      strip.removeAttribute('display');
      const width = stripWidth(text);
      strip.querySelector('rect')!.setAttribute('width', width.toFixed(1));
      const label = strip.querySelector('text')!;
      label.setAttribute('x', (Number(strip.dataset.x) + width / 2).toFixed(1));
      label.textContent = text;
    }
  }

  /** Nothing in flight: every tag, trail, mark, ring and light back as the figure drew it. */
  function clear(): void {
    for (const el of [...tags, over]) {
      fade(el, 0);
      el.removeAttribute('transform');
    }
    for (const tag of tags) tag.querySelector('.nm-tag-t')!.textContent = '';
    overText.textContent = '';
    for (const line of [trail, edge]) {
      fade(line, 0);
      line.setAttribute('points', '');
    }
    trail.classList.remove('lost');
    for (const el of [drop, ring]) {
      fade(el, 0);
      el.removeAttribute('transform');
    }
    for (const els of busies.values()) light(els, false);
    light(homeLeds, false);
  }

  /** The home router's callout, read from the unit's label: none without one. Throws for more lines than it has. */
  function routerOf(label: string | undefined): string[] | null {
    if (label === undefined) return null;
    const lines = label.split('\n');
    if (lines.length > routerLines.length) throw new Error(`The network map's router label has at most ${routerLines.length} lines, not ${lines.length}.`);
    return lines;
  }

  /** The home router's callout: hidden without lines. */
  function paintRouter(lines: string[] | null): void {
    if (lines === null) router.setAttribute('display', 'none');
    else router.removeAttribute('display');
    routerLines.forEach((el, i) => {
      const text = lines?.[i] ?? '';
      el.textContent = text;
      el.setAttribute('class', text !== '' && !/\d/.test(text) ? 'nm-sub' : 'nm-addr');
    });
  }

  /** A note that parks tags: they land one after another over 600 ms, in the order of the note's cues. Under reduced motion they land together, and the time still passes. */
  async function parkNote(event: SceneEvent, view: SceneView, landed: MapState, o: PlayOptions): Promise<void> {
    const before = settle(view, view.cues).parks;
    paint(landed);
    const fresh = (event.type === 'table' ? [] : (event.cues ?? []))
      .filter((c) => c.cue === 'park')
      .map((c) => parsePark(c.arg ?? '').tag)
      .filter((tag) => !before.has(tag))
      .flatMap((tag) => [...layer.querySelectorAll<SVGElement>('.nm-park')].filter((el) => el.dataset.tag === tag));
    if (!o.reducedMotion) for (const el of fresh) fade(el, 0);
    const ms = PARK_NOTE_MS / o.speed;
    await animate(ms, (k) => fresh.forEach((el, i) => fade(el, k >= (i + 1) / (fresh.length + 1) ? 1 : 0)), o);
    if (o.signal.aborted) return;
    for (const el of fresh) fade(el, 1);
    if (o.reducedMotion) await wait(ms, o.signal);
  }

  /** A note that unparks the laptop's tags: they glide into its screen over 700 ms, shrinking and fading, and then the map is painted without them. Under reduced motion they stay still for the 700 ms. */
  async function unparkNote(own: readonly PlayedCue[], landed: MapState, o: PlayOptions): Promise<void> {
    const place = own.find((c) => c.cue === 'unpark')!.arg!;
    const going = [...layer.querySelectorAll<SVGElement>('.nm-park')].filter((el) => el.dataset.place === place);
    for (const gap of layer.querySelectorAll('.nm-gap')) gap.remove();
    const end = routeBetween(map, 'router', 'laptop').at(-1)!;
    const goal: Point = [end[0] + GLIDE.at[0], end[1] + GLIDE.at[1], end[2] + GLIDE.at[2]];
    const ms = UNPARK_NOTE_MS / o.speed;
    if (o.reducedMotion) await wait(ms, o.signal);
    else {
      await animate(
        ms,
        (k) => {
          const f = easeInOut(k);
          for (const el of going) {
            const from = bayOf(place, Number(el.dataset.bay))!;
            moveTo(el, onScreen([0, 1, 2].map((i) => from[i]! + (goal[i]! - from[i]!) * f) as Point), PARK_SCALE * (1 - GLIDE.shrink * f));
            fade(el, 1 - k * k);
          }
        },
        o,
      );
    }
    if (o.signal.aborted) return;
    paint(landed);
  }

  async function play(event: SceneEvent, view: SceneView, o: PlayOptions): Promise<void> {
    // Aborted before it starts: the panel's show has settled the figure already, and has the last word.
    if (o.signal.aborted) return;
    const own = event.type === 'table' ? [] : (event.cues ?? []).map((c) => ({ ...c, eventId: event.id }));
    // Worked out first, so a cue the map cannot show fails before anything moves.
    const landed = settle(view, [...view.cues, ...own]);
    if (event.type !== 'message') {
      if (own.some((c) => c.cue === 'park')) await parkNote(event, view, landed, o);
      else if (own.some((c) => c.cue === 'unpark')) await unparkNote(own, landed, o);
      else paint(landed);
      return;
    }
    const r = rideOf(event.from, event.to, event.via);
    const pace = paceOf(event);
    const broadcast = event.kind === 'broadcast';
    const tag = tagFor(event.tag);
    clear();
    tag.querySelector('.nm-tag-t')!.textContent = event.tag;
    overText.textContent = event.over ?? '';
    const carried = event.over === undefined ? 0 : 1;
    fade(tag, 1);
    fade(over, carried);
    fade(trail, TRAIL_OPACITY);
    if (HOME.has(event.from) || HOME.has(event.to)) light(homeLeds, true);
    light(busies.get(event.from), true);
    if (broadcast) {
      ring.setAttribute('transform', ringAt(RING.start));
      fade(ring, RING.opacity);
    }
    // A parked tag leaves its bay as its message is sent: the copy goes, and the gaps are drawn without it.
    const waiting = view.cues.some((c) => c.cue === 'park' || c.cue === 'unpark') ? settle(view, view.cues).parks : undefined;
    if (waiting?.get(event.tag)?.place === event.from) paintParks(new Map([...waiting].filter(([tag]) => tag !== event.tag)));
    // A letter leaves its tray as it is sent, not when it lands.
    for (const { cue, arg = '' } of own) {
      if (cue !== 'tray') continue;
      const t = parseTray(arg);
      if (t.site === event.from && !t.on) light(holds.get(t.site), false);
    }
    const travel = travelOf(event, r.total) / o.speed;
    const rest = pace.rest / o.speed;
    const ride = (f: number, k: number): void => {
      const at = onScreen(pointAt(r, f));
      moveTo(tag, at);
      moveTo(over, at);
      trail.setAttribute('points', trailOf(r, 0, f));
      if (k > LET_GO_AT && event.from !== 'laptop') light(busies.get(event.from), false);
    };

    if (event.outcome === 'dropped') {
      const stop = dropAtOf(event);
      await animate(travel * stop, (k) => ride(stop * easeOut(k), k), o);
      if (o.signal.aborted) return;
      trail.classList.add('lost');
      edge.setAttribute('points', trail.getAttribute('points') ?? '');
      fade(edge, TRAIL_OPACITY);
      moveTo(drop, flatAt(r, stop));
      fade(drop, 1);
      await animate(
        LOST_FADE_MS / o.speed,
        (k) => {
          fade(tag, 1 - k);
          fade(over, carried * (1 - k));
        },
        o,
      );
      if (o.signal.aborted) return;
      paint(landed);
      await wait(LOST_REST_MS / o.speed, o.signal);
      if (o.signal.aborted) return;
      clear();
      return;
    }

    await animate(
      travel,
      (k) => {
        ride(easeInOut(k), k);
        if (!broadcast) return;
        ring.setAttribute('transform', ringAt(RING.start + RING.grow * easeOut(k)));
        fade(ring, RING.opacity * (1 - k * k));
      },
      o,
    );
    if (o.signal.aborted) return;
    // Under reduced motion the ring never spreads: it shows still, part of the way out, while the message rests.
    if (broadcast && o.reducedMotion) {
      ring.setAttribute('transform', ringAt(RING.still));
      fade(ring, RING.stillOpacity);
    }
    if (event.to !== 'laptop') light(busies.get(event.to), true);
    // A tag that parks itself where it lands slides into its bay over the first part of the rest, and the map then
    // shows it parked: the moving tag, its trail and its lights are taken away as it does.
    const mine = own.find((c) => c.cue === 'park' && parsePark(c.arg ?? '').tag === event.tag);
    if (mine !== undefined) {
      const bay = parsePark(mine.arg!);
      const [from, to] = [r.points.at(-1)!, bayOf(bay.place, bay.bay)!];
      const slide = Math.min(SLIDE_MS / o.speed, rest);
      if (!o.reducedMotion) {
        fade(trail, TRAIL_OPACITY / 2);
        await animate(
          slide,
          (k) => {
            const f = easeInOut(k);
            moveTo(tag, onScreen([0, 1, 2].map((i) => from[i]! + (to[i]! - from[i]!) * f) as Point), 1 - (1 - PARK_SCALE) * f);
          },
          o,
        );
        if (o.signal.aborted) return;
      }
      clear();
      paint(landed);
      await wait(o.reducedMotion ? rest : rest - slide, o.signal);
      return;
    }
    // A page that lands draws itself in, top to bottom, over the rest at the laptop: the parts it did not show before.
    const fresh = own.some((c) => c.cue === 'page') ? page.filter((el) => wants(landed, el) && el.style.opacity !== '1') : [];
    paint(landed);
    if (fresh.length > 0 && !o.reducedMotion) {
      for (const el of fresh) fade(el, 0);
      await animate(rest, (k) => fresh.forEach((el, i) => fade(el, k >= (i + 1) / (fresh.length + 1) ? 1 : 0)), o);
    } else {
      await wait(rest, o.signal);
    }
    if (o.signal.aborted) return;
    clear();
  }

  return {
    show(view) {
      // Settled means no motion: the lights, the trays and the page change at once, not over their fades.
      // The browser takes the new styles while data-settling turns the fades off (net-map.css);
      // after that they are back on, so a play still fades its lights in and out.
      // Everything show paints is worked out first, so a mistake in the lesson throws before the figure changes.
      const settled = settle(view, view.cues);
      const routerLabel = routerOf(view.labels.router);
      root.setAttribute('data-settling', '');
      try {
        const shown = new Set(view.layers);
        for (const g of layers) {
          if (shown.has(g.getAttribute('data-layer') ?? '')) g.removeAttribute('display');
          else g.setAttribute('display', 'none');
        }
        paintRouter(routerLabel);
        paintNames(view.labels);
        clear();
        paint(settled);
        void root.getBoundingClientRect();
      } finally {
        // Whatever happens, the fades come back on.
        root.removeAttribute('data-settling');
      }
    },
    play,
    // Nothing to let go of: a play's timers and listeners end with its signal, which the panel aborts first.
    destroy() {},
  };
}

/** The network map's driver. */
export const netMapDriver: DriverModule = { create, duration };
