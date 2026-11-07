// Only types from the drawing module: its code is for the build, and stays out of the page.
import type { NetMapData } from '../../art/scenes/net-map';
import { NET_MAP_LAPTOP_ADDR, NET_MAP_TAG_MAX } from '../../art/scenes/net-map-layers';
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
 * - `addr <text>`, `url <text>`: the laptop's address and its address bar.
 *
 * A unit's labels give the words before any cue: `laptop` (the status line), `laptopAddr`, `url`, and `router`,
 * the home router's callout in one or two lines (a line with a number is an address, a line of words a note).
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
const HOME = new Set(['laptop', 'router']);
/** FTP's data line is drawn this far above its control line. */
const DATA_LINE_LIFT = 'translate(0 -6)';

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

function parseTray(arg: string): { site: string; on: boolean } {
  const m = /^([a-z0-9-]+) (on|off)$/.exec(arg);
  if (m === null) throw new Error(`The network map's tray cue needs "<site> <on|off>", not "${arg}".`);
  return { site: m[1]!, on: m[2] === 'on' };
}

function routeOf(data: NetMapData, from: string, to: string): Point[] {
  const key = `${from}>${to}`;
  if (!Object.hasOwn(data.routes, key)) throw new Error(`The network map has no route ${key}.`);
  return data.routes[key]!;
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
  // A table event or a note has nothing to move, so it lands at once.
  if (event.type !== 'message') return 0;
  const travel = travelOf(event, lengthOf(routeOf(data as NetMapData, event.from, event.to)));
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
  const ring = part('nm-ring');

  const [ax, bx, cx, ay, by, cy] = map.M as [number, number, number, number, number, number];
  /** A point of the plates on screen, from the figure's origin, where the tags are drawn. */
  const onScreen = ([x, y, z]: Point): Flat => [ax * x + bx * y + cx * z, ay * x + by * y + cy * z];
  /** A point of the plates along the cables' tops, in the figure's own frame, where trails and lines are drawn. */
  const onCable = ([x, y]: Point): Flat => {
    const [sx, sy] = onScreen([x, y, map.TZ]);
    return [map.O[0] + sx, map.O[1] + sy];
  };
  const rideOf = (from: string, to: string): Ride => {
    const points = routeOf(map, from, to);
    const cum = [0];
    for (let i = 1; i < points.length; i++) cum.push(cum[i - 1]! + Math.hypot(points[i]![0] - points[i - 1]![0], points[i]![1] - points[i - 1]![1]));
    return { points, cum, total: cum.at(-1)!, flat: points.map(onCable) };
  };
  const moveTo = (el: SVGElement, [x, y]: Flat): void => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
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
        else if (cue === 'page') {
          if (arg !== 'text' && arg !== 'full') throw new Error(`The network map's page cue needs "text" or "full", not "${arg}".`);
          s.page = arg;
        } else if (cue === 'tray') {
          const { site, on } = parseTray(arg);
          if (!holds.has(site) || site === 'lock') throw new Error(`The network map has no tray "${site}".`);
          s.trays.set(site, on);
        } else if (cue === 'conn') connect(s, parseConn(arg));
      }
      if (own.some((c) => c.cue === 'status-done')) s.style = 'done';
      else if (own.some((c) => c.cue === 'status-known')) s.style = 'known';
    }
    return s;
  }

  function connect(s: MapState, c: ConnCue): void {
    const route = `${c.from}>${c.to}`;
    routeOf(map, c.from, c.to);
    const id = c.data ? `${route} data` : route;
    const line = s.conns.get(id);
    if (c.action === 'open') s.conns.set(id, { route, data: c.data, sealed: false });
    else if (line === undefined) throw new Error(`The conn cue ${c.action === 'seal' ? 'seals' : 'closes'} ${id}, which is not open.`);
    else if (c.action === 'seal') line.sealed = true;
    else s.conns.delete(id);
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

  async function play(event: SceneEvent, view: SceneView, o: PlayOptions): Promise<void> {
    // Aborted before it starts: the panel's show has settled the figure already, and has the last word.
    if (o.signal.aborted) return;
    const own = event.type === 'table' ? [] : (event.cues ?? []).map((c) => ({ ...c, eventId: event.id }));
    // Worked out first, so a cue the map cannot show fails before anything moves.
    const landed = settle(view, [...view.cues, ...own]);
    if (event.type !== 'message') {
      paint(landed);
      return;
    }
    const r = rideOf(event.from, event.to);
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
    // A letter leaves its tray as it is sent, not when it lands.
    for (const { cue, arg = '' } of own) {
      if (cue !== 'tray') continue;
      const t = parseTray(arg);
      if (t.site === event.from && !t.on) light(holds.get(t.site), false);
    }
    const travel = travelOf(event, r.total) / o.speed;
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
    // A page that lands draws itself in, top to bottom, over the rest at the laptop: the parts it did not show before.
    const fresh = own.some((c) => c.cue === 'page') ? page.filter((el) => wants(landed, el) && el.style.opacity !== '1') : [];
    paint(landed);
    const rest = pace.rest / o.speed;
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
