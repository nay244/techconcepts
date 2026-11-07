import type { SubnetSceneData } from '../../art/scenes/subnet';
import type { Cue, SceneEvent } from '../../content/schema';
import { formatIPv4, parseIPv4 } from '../../engine/net/ipv4';
import { subnetInfo } from '../../engine/net/subnet';
import type { AppliedCue } from '../../engine/timeline';
import type { DriverModule, PlayOptions, SceneDriver, SceneView } from '../driver';
import { animate, easeInOut, wait } from '../motion';

/**
 * Moves the Subnetting figure (src/art/scenes/subnet.ts), as the approved
 * mockup's `play`, `ring`, `ride`, `renderScene` and `clearScene` do
 * (subnet-v1.html). Every event is a note, and its cues say what happens:
 *
 * - `glow`, `focus`: a screen lights and a callout's name turns current while it plays.
 * - `one-net`, `cut`, `link`: what stays once it has played: one lit line round
 *   the floor, one round each pad once the floor is cut, the link to the provider.
 * - `pulse`: the line round the floor, the link, or each pad's line in turn, pulses.
 * - `ring`: a broadcast spreads across a network, and every screen on it lights.
 * - `route` (with `busy`): a message's tag rides the cables, and the device it reaches lights.
 */

type RouteName = keyof SubnetSceneData['routes'];
type RingName = keyof SubnetSceneData['rings'];
type Point = [number, number, number];

/** A note's beat and the read after it; a ring's or a ride's rest at the end (ms at 1×). */
const CALC_MS = 1100;
const CALC_REST_MS = 700;
const REST_MS = 500;
/** A broadcast's ring spreads in 1500 ms; a ride takes 700 ms plus 7 ms for each unit of cable. */
const RING_MS = 1500;
const RIDE_MS = 700;
const RIDE_MS_PER_UNIT = 7;
/** Each pad's line pulses 260 ms after the one before; the pulse and the new network's flash take their CSS times. */
const PAD_STAGGER_MS = 260;
const PULSE_MS = 900;
const FLASH_MS = 1100;
/** A ring lights the screens it reaches once it is 30 % of the way out. */
const RING_LIGHTS_AT = 0.3;
/** Under reduced motion a ring shows still, part of the way out. */
const STILL_RING = { a: 0.55, b: 0.4, opacity: 0.6 };
/** How close to the router, as a share of the ride, the tag lights it. */
const ROUTER_NEAR = 0.07;
/** The one route that goes through the router: a message to another subnet. */
const THROUGH_ROUTER: RouteName = 'remote';

/**
 * The teams, each on its own pad. The floor is one /24; step 4 cuts it into four /26s, one per pad. These are the
 * lesson's floor and cut: the driver's test checks them, and the callouts' addresses, against the lesson and the engine.
 */
const PADS = ['sales', 'design', 'servers', 'guests'] as const;
const FLOOR_PREFIX = 24;
const CUT_PREFIX = 26;

/** A route's length on the plate: the sum of its segments, in 3D. */
function lengthOf(points: Point[]): number {
  return points.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - points[i]![0], p[1] - points[i]![1], p[2] - points[i]![2]), 0);
}

const argOf = (cues: readonly Cue[], name: string): string | undefined => cues.find((c) => c.cue === name)?.arg;

function routeOf(data: SubnetSceneData, name: string): Point[] {
  if (!Object.hasOwn(data.routes, name)) throw new Error(`The Subnetting figure has no "${name}" route.`);
  return data.routes[name as RouteName] as Point[];
}

function duration(event: SceneEvent, data: unknown): number {
  if (event.type !== 'note') return 0;
  const cues = event.cues ?? [];
  if (argOf(cues, 'ring') !== undefined) return RING_MS + REST_MS;
  const route = argOf(cues, 'route');
  if (route !== undefined) return RIDE_MS + RIDE_MS_PER_UNIT * lengthOf(routeOf(data as SubnetSceneData, route)) + REST_MS;
  return CALC_MS + CALC_REST_MS;
}

/** A route as the tag rides it: its points, how far along each one is, and where it passes the router (or null). */
interface Ride {
  points: Point[];
  cum: number[];
  total: number;
  via: number | null;
}

function rideOf(name: RouteName, points: Point[]): Ride {
  const cum = [0];
  for (let i = 1; i < points.length; i++) {
    const [a, b] = [points[i - 1]!, points[i]!];
    cum.push(cum[i - 1]! + Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]));
  }
  const total = cum.at(-1)!;
  // The router is the highest point the route climbs over between its ends.
  let top = 0;
  for (let i = 1; i < points.length - 1; i++) if (points[i]![2] > points[top]![2]) top = i;
  return { points, cum, total, via: name === THROUGH_ROUTER && top > 0 ? cum[top]! / total : null };
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

/** Drops inline styles, and the style attribute once it is empty, so the part reads as the figure drew it. */
function unstyle(el: SVGElement, ...properties: string[]): void {
  for (const p of properties) el.style.removeProperty(p);
  if (el.style.length === 0) el.removeAttribute('style');
}

function create(root: SVGSVGElement, data: unknown): SceneDriver {
  // Drawn by drawSubnet() at build time, beside this figure.
  const { M, O, routes, rings } = data as SubnetSceneData;
  const part = <T extends SVGElement = SVGElement>(id: string): T => {
    const found = root.querySelector<T>(`#${id}`);
    if (found === null) throw new Error(`The Subnetting figure has no #${id}.`);
    return found;
  };

  const oneNet = part('sn-onenet');
  const link = part('sn-link');
  const padlines = PADS.map((pad) => part(`sn-padline-${pad}`));
  const nets = PADS.map((pad) => part(`sn-net-${pad}`));
  // Each team's network, worked out by the engine from its device's address on the callout ("Laptop 192.168.1.10").
  const networks = PADS.map((pad) => {
    const text = part(`sn-call-${pad}`).querySelector('.sn-addr')?.textContent ?? '';
    const parsed = parseIPv4(/\S+$/.exec(text)?.[0] ?? '');
    if (!parsed.ok) throw new Error(`The Subnetting figure's ${pad} callout has no address: "${text}".`);
    const label = (prefix: number) => `${formatIPv4(subnetInfo(parsed.value, prefix).network)}/${prefix}`;
    return { floor: label(FLOOR_PREFIX), cut: label(CUT_PREFIX) };
  });
  const calls = [...root.querySelectorAll<SVGElement>('.sn-call')];
  const glows = [...root.querySelectorAll<SVGElement>('.sn-glow')];
  const busies = [...root.querySelectorAll<SVGElement>('.sn-busy')];
  const routerLeds = [0, 1, 2, 3].map((i) => part(`sn-rled-${i}`));
  const routerBusy = part('sn-busy-router');
  const trail = part('sn-trail');
  const rides = Object.fromEntries(
    (Object.keys(routes) as RouteName[]).map((name) => [name, rideOf(name, routes[name] as Point[])]),
  ) as Record<RouteName, Ride>;
  const tags = (Object.keys(routes) as RouteName[]).map((name) => part(`sn-tag-${name}`));
  const ringNames = Object.keys(rings) as RingName[];
  const ringParts = ringNames.map((name) => ({ g: part(`sn-ring-${name}`), a: part(`sn-ring-${name}-a`), b: part(`sn-ring-${name}-b`) }));

  const [ax, bx, cx, ay, by, cy] = M as [number, number, number, number, number, number];
  /** A point of the plate on screen, from the figure's origin, where the tags are drawn. */
  const onScreen = ([x, y, z]: Point): [number, number] => [ax * x + bx * y + cx * z, ay * x + by * y + cy * z];
  /** A point of the plate in the figure's own coordinates, where the trail is drawn. */
  const onFigure = (p: Point): [number, number] => {
    const [x, y] = onScreen(p);
    return [O[0] + x, O[1] + y];
  };
  const moveTo = (el: SVGElement, [x, y]: [number, number]): void =>
    el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
  const fade = (el: SVGElement, opacity: number): void => {
    el.style.opacity = String(opacity);
  };
  const ms = (n: number): string => `${Math.round(n)}ms`;
  /** Plays a CSS animation from its start: off, a read of the box so the browser sees it off, then on again. */
  const restart = (el: SVGElement, cls: string, delay: number, length: number): void => {
    el.classList.remove(cls);
    void el.getBoundingClientRect();
    el.style.animationDelay = ms(delay);
    el.style.animationDuration = ms(length);
    el.classList.add(cls);
  };

  /** Nothing in flight: every tag, trail, ring, light and pulse back as the figure drew it. */
  function clear(): void {
    for (const tag of tags) {
      fade(tag, 0);
      tag.removeAttribute('transform');
    }
    fade(trail, 0);
    trail.setAttribute('points', '');
    for (const { g, a, b } of ringParts) {
      fade(g, 0);
      a.setAttribute('r', '1');
      b.setAttribute('r', '1');
    }
    for (const el of [...glows, ...busies, ...routerLeds]) el.classList.remove('on');
    for (const el of calls) el.classList.remove('focus');
    for (const el of [oneNet, link, ...padlines]) el.classList.remove('pulse');
    for (const el of nets) el.classList.remove('new');
    for (const el of [oneNet, link, ...padlines, ...nets]) unstyle(el, 'animation-delay', 'animation-duration');
  }

  /**
   * What stays once played: one lit line round the floor, or one round each pad
   * once it is cut, the link, and each team's network. A network that changes
   * flashes when `flash` gives the speed to flash at.
   */
  function paint(cues: readonly (Cue | AppliedCue)[], flash: number | null): void {
    const has = (name: string) => cues.some((c) => c.cue === name);
    const cut = has('cut');
    oneNet.classList.toggle('on', has('one-net') && !cut);
    link.classList.toggle('on', has('link'));
    PADS.forEach((_, i) => {
      padlines[i]!.classList.toggle('on', cut);
      const net = nets[i]!;
      const text = cut ? networks[i]!.cut : networks[i]!.floor;
      if (net.textContent !== text) {
        net.textContent = text;
        if (flash !== null) restart(net, 'new', 0, FLASH_MS / flash);
      }
      net.classList.toggle('cut', cut);
    });
  }

  /** Lights every screen in a network: the whole floor, or one pad. */
  function lightScreens(scope: string): void {
    for (const el of glows) if (scope === 'all' || el.dataset.pad === scope) el.classList.add('on');
  }

  function pulse(what: string, speed: number): void {
    if (what === 'onenet') restart(oneNet, 'pulse', 0, PULSE_MS / speed);
    else if (what === 'link') restart(link, 'pulse', 0, PULSE_MS / speed);
    else if (what === 'pads') padlines.forEach((el, i) => restart(el, 'pulse', (i * PAD_STAGGER_MS) / speed, PULSE_MS / speed));
  }

  /** A broadcast: a ring of light spreads from the sender across its whole network, and every screen on it lights. */
  async function spread(scope: string, o: PlayOptions): Promise<void> {
    if (!Object.hasOwn(rings, scope)) throw new Error(`The Subnetting figure has no "${scope}" ring.`);
    const { g, a, b } = ringParts[ringNames.indexOf(scope as RingName)]!;
    const max = rings[scope as RingName];
    fade(g, 1);
    if (o.reducedMotion) {
      // Still, part of the way out, for as long as it would have spread.
      a.setAttribute('r', (max * STILL_RING.a).toFixed(1));
      b.setAttribute('r', (max * STILL_RING.b).toFixed(1));
      fade(g, STILL_RING.opacity);
      lightScreens(scope);
      await wait(RING_MS / o.speed, o.signal);
      return;
    }
    await animate(
      RING_MS / o.speed,
      (k) => {
        const r = max * (1 - (1 - k) ** 3);
        a.setAttribute('r', r.toFixed(1));
        b.setAttribute('r', Math.max(1, r * 0.72).toFixed(1));
        fade(g, 1 - k * 0.8);
        if (k > RING_LIGHTS_AT) lightScreens(scope);
      },
      o,
    );
  }

  /** A message: its lit tag rides the cables, hops over the switch (and the router, to another subnet), and leaves a dotted trail. */
  async function ride(name: string, busy: string | undefined, o: PlayOptions): Promise<void> {
    if (!Object.hasOwn(rides, name)) throw new Error(`The Subnetting figure has no "${name}" route.`);
    const r = rides[name as RouteName];
    const tag = part(`sn-tag-${name}`);
    const time = (RIDE_MS + RIDE_MS_PER_UNIT * r.total) / o.speed;
    fade(tag, 1);
    fade(trail, 0.9);
    if (r.via !== null) for (const led of routerLeds) led.classList.add('on');
    await animate(
      time,
      (k) => {
        const f = easeInOut(k);
        moveTo(tag, onScreen(pointAt(r, f)));
        const [i] = seat(r, f);
        const points = [...r.points.slice(0, i).map(onFigure), onFigure(pointAt(r, f))];
        trail.setAttribute('points', points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '));
        if (r.via !== null) routerBusy.classList.toggle('on', Math.abs(f - r.via) < ROUTER_NEAR);
      },
      o,
    );
    if (o.signal.aborted) return;
    if (busy !== undefined) part(busy === 'pc' ? 'sn-glow-pc' : `sn-busy-${busy}`).classList.add('on');
    // Under reduced motion the tag lands at once, and rests there for as long as it would have ridden.
    if (o.reducedMotion) await wait(time, o.signal);
  }

  async function play(event: SceneEvent, view: SceneView, o: PlayOptions): Promise<void> {
    if (event.type !== 'note') return;
    const cues = event.cues ?? [];
    const arg = (name: string) => argOf(cues, name);
    clear();
    paint([...view.cues, ...cues], o.reducedMotion ? null : o.speed);
    const focus = arg('focus');
    if (focus !== undefined) part(`sn-call-${focus}`).classList.add('focus');
    const glow = arg('glow');
    if (glow !== undefined) part(`sn-glow-${glow}`).classList.add('on');
    const pulsed = arg('pulse');
    if (pulsed !== undefined && !o.reducedMotion) pulse(pulsed, o.speed);

    const ring = arg('ring');
    const route = arg('route');
    if (ring !== undefined) await spread(ring, o);
    else if (route !== undefined) await ride(route, arg('busy'), o);
    else await wait(CALC_MS / o.speed, o.signal);
    if (o.signal.aborted) return;
    await wait((ring !== undefined || route !== undefined ? REST_MS : CALC_REST_MS) / o.speed, o.signal);
    if (o.signal.aborted) return;
    clear();
  }

  return {
    show(view) {
      // Settled means no motion: the lights and the networks change at once, not over their fades.
      // The browser takes the new styles while data-settling turns the fades off (subnet.css);
      // after that they are back on, so a play still fades its lights in and out.
      root.setAttribute('data-settling', '');
      clear();
      paint(view.cues, null);
      void root.getBoundingClientRect();
      root.removeAttribute('data-settling');
    },
    play,
    // Nothing to let go of: a play's timers and listeners end with its signal, which the panel aborts first.
    destroy() {},
  };
}

/** The Subnetting figure's driver. */
export const subnetDriver: DriverModule = { create, duration };
