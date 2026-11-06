import type { FirewallSceneData } from '../../art/scenes/firewall';
import type { MessageEvent, NoteEvent, Row, SceneEvent, TableEvent } from '../../content/schema';
import { applyTableEvent } from '../../engine/tables';
import { type DriverModule, marksOf, type PanelMark, type PlayOptions, type SceneDriver, type SceneView } from '../driver';
import { along, animate, easeInOut, wait } from '../motion';

/**
 * Moves the Firewalls figure (src/art/scenes/firewall.ts), as the approved
 * mockup's `playVisit`, `playReply`, `playChange`, `showFinal` and
 * `clearScene` do (firewalls-v1.html):
 *
 * - A visit (a message with a `check`) rides from its laptop to the gate and
 *   waits while the board's rows are read from the top, one every 700 ms,
 *   reporting each row to the panel (`onMark`). The rule that fits lights the
 *   bar over the gate. Allowed, the arms lift and the tag rides on, behind the
 *   wall, to the top of the server, which lights up; denied, its trail turns
 *   red and the stop mark pops.
 * - A reply (a message with `known`) rides back from the server to the gate,
 *   where the firewall finds its connection, then the gate opens and it rides
 *   out to its laptop, whose screen glows. It reads no rule.
 * - A change (a note with a `rules` cue) flashes the board's rows. The rows'
 *   words are the rule list's own (the panel table `rules`): its table event
 *   writes them as it lands, before the note plays.
 *
 * Once a visit or a reply has landed it stays on the figure, as the mockup
 * leaves it: `show` draws the step's latest one (`view.landed`) where it ended
 * up, with the rule that decided.
 */

type Point = [number, number, number];
type Flat = [number, number];
type MarkState = PanelMark['state'];
type Visit = MessageEvent & { check: NonNullable<MessageEvent['check']> };
type Reply = MessageEvent & { known: NonNullable<MessageEvent['known']> };

/** The mockup's times (ms at 1×): a ride is 600 ms and 9 for each unit of its route. */
const RIDE_MS = 600;
const RIDE_MS_PER_UNIT = 9;
/** A visit at the gate: each rule read, the arms going up before it rides on, or the stop mark's hold. */
const READ_MS = 700;
const ARMS_MS = 380;
const STOP_MS = 900;
/** A reply at the gate: the firewall finds its connection, then the gate opens. */
const KNOWN_MS = 800;
const OPEN_MS = 300;
/** A change: the rule list's callout turns current, then the board's rows flash. */
const CHANGE_MS = 300;
const FLASH_MS = 1300;
/** After an event, its log row lands and rests; then a gap before the next event. */
const LAND_MS = 500;
const GAP_MS = 200;

/** The panel table the board shows, keyed on its rows' places. Its rows carry the board's words (`board`). */
const RULES = 'rules';
const RULE_KEY = '#';
const BOARD_ROWS = 3;
const TRAIL_OPACITY = 0.9;
const STATES: readonly MarkState[] = ['check', 'miss', 'allow', 'deny'];
/** The callout each place on the figure has: the web server's is `server`, and the rule list has one too. */
const CALLOUTS: Record<string, string> = { visitor: 'visitor', admin: 'admin', firewall: 'firewall', web: 'server', rules: 'rules' };

const isVisit = (e: SceneEvent | null): e is Visit => e?.type === 'message' && e.check !== undefined;
const isReply = (e: SceneEvent | null): e is Reply => e?.type === 'message' && e.check === undefined && e.known !== undefined;
const isChange = (e: SceneEvent): e is NoteEvent => e.type === 'note' && (e.cues ?? []).some((c) => c.cue === 'rules');

/** A route's length on the plate: the sum of its segments, in 3D. */
function lengthOf(points: Point[]): number {
  return points.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - points[i]![0], p[1] - points[i]![1], p[2] - points[i]![2]), 0);
}
const rideMs = (points: Point[]): number => RIDE_MS + RIDE_MS_PER_UNIT * lengthOf(points);

function routeOf(data: FirewallSceneData, name: string): Point[] {
  if (!Object.hasOwn(data.routes, name)) throw new Error(`The Firewalls figure has no "${name}" route.`);
  return data.routes[name as keyof FirewallSceneData['routes']];
}

function duration(event: SceneEvent, data: unknown): number {
  const d = data as FirewallSceneData;
  // A table event has nothing to move, so it lands at once, with the event before it.
  if (event.type === 'table') return 0;
  if (isVisit(event)) {
    const { read, action } = event.check;
    const after = action === 'allow' ? ARMS_MS + rideMs(d.routes.inside) : STOP_MS;
    return rideMs(routeOf(d, event.from)) + READ_MS * read + after + LAND_MS + GAP_MS;
  }
  if (isReply(event)) return rideMs(d.routes.inside) + KNOWN_MS + OPEN_MS + rideMs(routeOf(d, event.to)) + LAND_MS + GAP_MS;
  if (isChange(event)) return CHANGE_MS + FLASH_MS + LAND_MS + GAP_MS;
  return LAND_MS + GAP_MS;
}

/** The rule list's rows once `event` has landed. The figure has no table definition, only the key it knows the list by. */
function rowsAfter(rows: Row[], event: TableEvent): Row[] {
  const state = { rows: rows.map((row) => ({ ...row })), highlight: null, missed: [] };
  applyTableEvent(state, { keyColumn: RULE_KEY }, event);
  return state.rows;
}

/** A route as a tag rides it, on screen: its plate points, their screen points, and how far along the screen each one is. */
interface Ride {
  world: Point[];
  flat: Flat[];
  cum: number[];
}

/** Where a tag is once it has come `t` of the way along a ride, by length on screen: on screen, on the plate, and the trail behind it. */
interface Pose {
  screen: Flat;
  world: Point;
  trail: Flat[];
}

/** What the figure shows once an event has landed, worked out before anything is drawn. */
interface Picture {
  tag: SVGElement | null;
  at: Pose | null;
  trail: { points: Flat[]; deny: boolean } | null;
  rows: (MarkState | null)[];
  bar: 'allow' | 'deny' | null;
  armsUp: boolean;
  stop: boolean;
  busy: boolean;
  glow: SVGElement | null;
}

const NOTHING: Omit<Picture, 'rows'> = { tag: null, at: null, trail: null, bar: null, armsUp: false, stop: false, busy: false, glow: null };

function create(root: SVGSVGElement, data: unknown): SceneDriver {
  // Drawn by drawFirewall() at build time, beside this figure.
  const d = data as FirewallSceneData;
  const { M, O, wallFront } = d;
  const part = <T extends SVGElement = SVGElement>(id: string): T => {
    const found = root.querySelector<T>(`#${id}`);
    if (found === null) throw new Error(`The Firewalls figure has no #${id}.`);
    return found;
  };
  // Each tag by the words on it, which are its message's own tag, in the order the figure draws them.
  const tagOrder = [...root.querySelectorAll<SVGGElement>('.fw-tag')];
  const tags = new Map(tagOrder.map((g) => [g.querySelector('.fw-tag-t')?.textContent ?? '', g]));
  const front = part('fw-layer-front');
  const behind = part('fw-layer-behind');
  const trail = part('fw-trail');
  const stop = part('fw-stop');
  const bar = part('fw-bar');
  const armsDown = part('fw-arms-down');
  const armsUp = part('fw-arms-up');
  const busy = part('fw-busy-server');
  const glows = new Map(['visitor', 'admin'].map((who) => [who, part(`fw-glow-${who}`)]));
  const brows = Array.from({ length: BOARD_ROWS }, (_, i) => part(`fw-brow-${i}`));
  const browTexts = Array.from({ length: BOARD_ROWS }, (_, i) => part(`fw-brow-t-${i}`));
  const calls = new Map(Object.entries(CALLOUTS).map(([place, id]) => [place, part(`fw-call-${id}`)]));

  const [ax, bx, cx, ay, by, cy] = M as [number, number, number, number, number, number];
  /** A point of the plate on screen, in the figure's own coordinates, where the trail is drawn. */
  const flatOf = ([x, y, z]: Point): Flat => [O[0] + ax * x + bx * y + cx * z, O[1] + ay * x + by * y + cy * z];
  const rideOf = (world: Point[]): Ride => {
    const flat = world.map(flatOf);
    const cum = [0];
    for (let i = 1; i < flat.length; i++) cum.push(cum[i - 1]! + Math.hypot(flat[i]![0] - flat[i - 1]![0], flat[i]![1] - flat[i - 1]![1]));
    return { world, flat, cum };
  };
  // Each route both ways: `inside<` and `visitor<` are a reply's.
  const rides = new Map<string, Ride>();
  for (const [name, points] of Object.entries(d.routes) as [string, Point[]][]) {
    rides.set(name, rideOf(points));
    rides.set(`${name}<`, rideOf([...points].reverse()));
  }
  const rideNamed = (name: string): Ride => {
    const r = rides.get(name);
    if (r === undefined) throw new Error(`The Firewalls figure has no "${name}" route.`);
    return r;
  };
  /** The tag `t` of the way along a ride: on screen (the shared `along`), on the plate under it, and the trail behind it. */
  function pose(r: Ride, t: number): Pose {
    const screen = along(r.flat, t);
    const at = Math.min(Math.max(t, 0), 1) * r.cum.at(-1)!;
    let i = 0;
    while (i < r.cum.length - 2 && r.cum[i + 1]! < at) i++;
    const length = r.cum[i + 1]! - r.cum[i]!;
    const f = length > 0 ? (at - r.cum[i]!) / length : 0;
    const [a, b] = [r.world[i]!, r.world[i + 1]!];
    const world: Point = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
    return { screen, world, trail: [...r.flat.slice(0, i + 1), screen] };
  }

  const fade = (el: SVGElement, opacity: number): void => {
    el.style.opacity = String(opacity);
  };
  const light = (el: SVGElement, on: boolean): void => {
    el.classList.toggle('on', on);
  };
  /** A tag behind the wall is drawn in the masked layer, so the wall and the beam hide it. Tags are drawn at the origin. */
  function place(tag: SVGElement, p: Pose): void {
    const layer = p.world[1] < wallFront ? behind : front;
    if (tag.parentNode !== layer) layer.append(tag);
    tag.setAttribute('transform', `translate(${(p.screen[0] - O[0]).toFixed(1)} ${(p.screen[1] - O[1]).toFixed(1)})`);
  }
  const drawTrail = (points: Flat[]): void => trail.setAttribute('points', points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '));
  function arms(up: boolean): void {
    fade(armsDown, up ? 0 : 1);
    fade(armsUp, up ? 1 : 0);
  }
  function lightBar(kind: 'allow' | 'deny' | null): void {
    bar.classList.toggle('allow', kind === 'allow');
    bar.classList.toggle('deny', kind === 'deny');
  }
  function markRow(i: number, state: MarkState | null): void {
    for (const s of STATES) brows[i]!.classList.toggle(s, s === state);
  }
  const focus = (place: string): void => calls.get(place)?.classList.add('focus');

  /** Nothing in flight and nothing decided: every tag back in the front layer, in the figure's order, and every light off. */
  function clear(): void {
    for (const tag of tagOrder) {
      fade(tag, 0);
      tag.removeAttribute('transform');
      front.append(tag);
    }
    fade(trail, 0);
    trail.setAttribute('points', '');
    trail.classList.remove('deny');
    fade(stop, 0);
    stop.classList.remove('pop');
    arms(false);
    lightBar(null);
    for (let i = 0; i < BOARD_ROWS; i++) markRow(i, null);
    light(busy, false);
    for (const glow of glows.values()) light(glow, false);
    for (const call of calls.values()) call.classList.remove('focus');
  }

  /** The board's three rows: each rule's place and its words, from the rule list. */
  function boardOf(rows: Row[]): string[] {
    if (rows.length > BOARD_ROWS) throw new Error(`The Firewalls figure's board has ${BOARD_ROWS} rows; the rule list has ${rows.length}.`);
    return Array.from({ length: BOARD_ROWS }, (_, i) => {
      const row = rows[i];
      return row === undefined ? '' : `${row[RULE_KEY] ?? ''}  ${row.board ?? ''}`;
    });
  }
  const paintBoard = (texts: string[]): void => texts.forEach((text, i) => (browTexts[i]!.textContent = text));
  const rulesOf = (view: SceneView): Row[] => view.tables[RULES]?.rows ?? [];

  function tagFor(words: string): SVGElement {
    const tag = tags.get(words);
    if (tag === undefined) throw new Error(`The Firewalls figure has no tag "${words}".`);
    return tag;
  }

  /** Where an event leaves the figure once it has landed, as the mockup's `showFinal` draws it, with the trail it rode. */
  function pictureOf(e: MessageEvent | NoteEvent | null): Picture {
    const rows: (MarkState | null)[] = Array.from({ length: BOARD_ROWS }, () => null);
    if (isVisit(e)) {
      const { read, match, action } = e.check;
      if (read > BOARD_ROWS) throw new Error(`The Firewalls figure's board has ${BOARD_ROWS} rows; visit "${e.id}" reads ${read}.`);
      if (match !== null && match > read) throw new Error(`Visit "${e.id}" matches rule ${match}, after the ${read} it read.`);
      const tag = tagFor(e.tag);
      const way = rideNamed(e.from);
      for (const m of marksOf(e.check)) rows[m.row] = m.state;
      if (action === 'deny') {
        return { ...NOTHING, rows, tag, at: pose(way, 1), trail: { points: way.flat, deny: true }, bar: 'deny', stop: true };
      }
      const inside = rideNamed('inside');
      return { ...NOTHING, rows, tag, at: pose(inside, 1), trail: { points: [...way.flat, ...inside.flat], deny: false }, bar: 'allow', armsUp: true, busy: true };
    }
    if (isReply(e)) {
      const tag = tagFor(e.tag);
      const [back, out] = [rideNamed('inside<'), rideNamed(`${e.to}<`)];
      const glow = glows.get(e.to) ?? null;
      return { ...NOTHING, rows, tag, at: pose(out, 1), trail: { points: [...back.flat, ...out.flat], deny: false }, bar: 'allow', armsUp: true, glow };
    }
    return { ...NOTHING, rows };
  }

  function paint(p: Picture): void {
    p.rows.forEach((state, i) => markRow(i, state));
    lightBar(p.bar);
    arms(p.armsUp);
    fade(stop, p.stop ? 1 : 0);
    light(busy, p.busy);
    if (p.glow !== null) light(p.glow, true);
    if (p.tag !== null && p.at !== null) {
      fade(p.tag, 1);
      place(p.tag, p.at);
    }
    if (p.trail !== null) {
      fade(trail, TRAIL_OPACITY);
      drawTrail(p.trail.points);
      trail.classList.toggle('deny', p.trail.deny);
    }
  }

  /** A tag rides `r` in `ms`, its trail growing from `before`. */
  function ride(tag: SVGElement, r: Ride, before: Flat[], o: PlayOptions): Promise<void> {
    const start = pose(r, 0);
    place(tag, start);
    drawTrail([...before, ...start.trail]);
    return animate(
      rideMs(r.world) / o.speed,
      (k) => {
        const p = pose(r, easeInOut(k));
        place(tag, p);
        drawTrail([...before, ...p.trail]);
      },
      o,
    );
  }

  async function playVisit(e: Visit, end: Picture, o: PlayOptions): Promise<void> {
    const { action } = e.check;
    const way = rideNamed(e.from);
    const tag = end.tag!;
    clear();
    focus(e.from);
    fade(tag, 1);
    fade(trail, TRAIL_OPACITY);
    await ride(tag, way, [], o);
    if (o.signal.aborted) return;
    // At the gate: the rules are read from the top until one fits, each one current while it is read.
    focus('firewall');
    for (const mark of marksOf(e.check)) {
      markRow(mark.row, 'check');
      o.onMark?.({ row: mark.row, state: 'check' });
      await wait(READ_MS / o.speed, o.signal);
      if (o.signal.aborted) return;
      markRow(mark.row, mark.state);
      o.onMark?.(mark);
    }
    lightBar(action);
    if (action === 'allow') {
      arms(true);
      await wait(ARMS_MS / o.speed, o.signal);
      if (o.signal.aborted) return;
      focus('web');
      await ride(tag, rideNamed('inside'), way.flat, o);
      if (o.signal.aborted) return;
      light(busy, true);
    } else {
      trail.classList.add('deny');
      fade(stop, 1);
      if (!o.reducedMotion) {
        // Restart the pop, so it plays again for a second visit turned away.
        stop.classList.remove('pop');
        void stop.getBoundingClientRect();
        stop.classList.add('pop');
      }
      await wait(STOP_MS / o.speed, o.signal);
      if (o.signal.aborted) return;
    }
    // Landed: the figure as show draws it once the visit is applied.
    clear();
    paint(end);
  }

  async function playReply(e: Reply, end: Picture, o: PlayOptions): Promise<void> {
    const [back, out] = [rideNamed('inside<'), rideNamed(`${e.to}<`)];
    const tag = end.tag!;
    clear();
    focus('web');
    fade(tag, 1);
    fade(trail, TRAIL_OPACITY);
    await ride(tag, back, [], o);
    if (o.signal.aborted) return;
    // The firewall finds the connection the reply belongs to, so it opens the gate without reading a rule.
    focus('firewall');
    await wait(KNOWN_MS / o.speed, o.signal);
    if (o.signal.aborted) return;
    lightBar('allow');
    arms(true);
    await wait(OPEN_MS / o.speed, o.signal);
    if (o.signal.aborted) return;
    await ride(tag, out, back.flat, o);
    if (o.signal.aborted) return;
    if (end.glow !== null) light(end.glow, true);
    clear();
    paint(end);
  }

  async function playChange(end: Picture, o: PlayOptions): Promise<void> {
    clear();
    focus('rules');
    await wait(CHANGE_MS / o.speed, o.signal);
    if (o.signal.aborted) return;
    // The rows have their new words already (the rule list's table event); they flash, except under reduced motion.
    if (!o.reducedMotion) for (const row of brows) row.classList.add('check');
    await wait(FLASH_MS / o.speed, o.signal);
    if (o.signal.aborted) return;
    clear();
    paint(end);
  }

  async function play(event: SceneEvent, view: SceneView, o: PlayOptions): Promise<void> {
    // Aborted before it starts: the panel's show has settled the figure already, and has the last word.
    if (o.signal.aborted) return;
    if (event.type === 'table') {
      if (event.table === RULES) paintBoard(boardOf(rowsAfter(rulesOf(view), event)));
      return;
    }
    // Worked out first, so an event the figure cannot show fails before anything moves.
    const end = pictureOf(event);
    if (isVisit(event)) return playVisit(event, end, o);
    if (isReply(event)) return playReply(event, end, o);
    if (isChange(event)) return playChange(end, o);
    clear();
    paint(end);
  }

  return {
    show(view) {
      // Settled means no motion: the lights, the marks and the tags change at once, not over their fades.
      // The browser takes the new styles while data-settling turns the fades off (firewall.css);
      // after that they are back on, so a play still fades its lights in and out.
      // Everything show paints is worked out first, so a mistake in the lesson throws before the figure changes.
      const picture = pictureOf(view.landed);
      const board = boardOf(rulesOf(view));
      root.setAttribute('data-settling', '');
      try {
        clear();
        paintBoard(board);
        paint(picture);
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

/** The Firewalls figure's driver. */
export const firewallDriver: DriverModule = { create, duration };
