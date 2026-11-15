import type { DhcpSceneData } from '../../art/scenes/dhcp';
import { FRAMES_DESCRIPTION, FRAMES_LAPTOP_IP } from '../../art/scenes/dhcp-frames';
import type { Row, SceneEvent, TableEvent } from '../../content/schema';
import { applyTableEvent } from '../../engine/tables';
import type { DriverModule, PlayOptions, SceneDriver, SceneView } from '../driver';
import { animate, easeInOut, wait } from '../motion';

/**
 * Moves the DHCP figure (src/art/scenes/dhcp.ts), as the approved mockup's
 * `send`, `apply` and `clearScene` do (lesson-v3.html): a message's tag rides
 * the dotted arc between the laptop and the router, a broadcast also spreads a
 * ring of light across the plate, and the lease table shows on the router's
 * board, on the laptop's screen and in its callout.
 *
 * A scene that starts with the `frames` cue (MAC Address) shows the same plate as a home Wi-Fi with a TV in place of
 * the lease board. Every frame there rings out from whoever sends it, each device says what it did with the frame in
 * the air (a verdict beside its MAC address), and the "Who keeps the frame" table is what those verdicts read.
 */

/** A message: the tag's ride, its rest at the far end, and the gap before the next one (ms at 1×). */
const RIDE_MS = 1300;
const REST_MS = 350;
const GAP_MS = 200;
/** How far along the ride a broadcast reaches the phone, which lights up and ignores it. */
const PHONE_HEARS_AT = 0.55;

/**
 * The panel table the figure shows, and the columns it reads. The lease table
 * is keyed on the IP address. The board has one lit row: the table's first
 * lease, which in this lesson is the laptop's.
 */
const LEASES = 'leases';
const IP = 'ip';
const DEVICE = 'device';

/**
 * The frames table the verdicts read: keyed on the MAC address, which is how each device's row is found. The device
 * is the place whose callout draws that address; its cell in `frame` is the verdict, in the words the table has.
 */
const FRAMES = 'frames';
const MAC = 'mac';
const FRAME = 'frame';
const MACS = { router: '00:00:5E:00:53:01', laptop: '00:00:5E:00:53:10', phone: '00:00:5E:00:53:11', tv: '00:00:5E:00:53:12' } as const;
type Place = keyof typeof MACS;
const PLACES = Object.keys(MACS) as Place[];
const VERDICTS: Record<string, string> = { 'Sent it': 'sent', 'Hears it': 'hears', 'Keeps it': 'keeps', 'Ignores it': 'ignores' };
/** How long a frames table event waits before the next: a row changing hands (`update`, `replace`), and the match that splits the address. */
const FRAMES_ROW_MS = 400;
const FRAMES_MATCH_MS = 900;

function duration(event: SceneEvent): number {
  // A lease event has nothing to move, so it lands at once, with the message before it.
  if (event.type === 'table' && event.table === FRAMES) return event.op === 'match' ? FRAMES_MATCH_MS : FRAMES_ROW_MS;
  return event.type === 'message' ? RIDE_MS + REST_MS + GAP_MS : 0;
}

/**
 * A table's rows once `event` has landed: the lease table's (keyed on `ip`, the default) or the frames table's (pass
 * `mac`). The figure has no table definition, only the key column it knows each table by.
 */
function rowsAfter(rows: Row[], event: TableEvent, keyColumn = IP): Row[] {
  const state = { rows: rows.map((row) => ({ ...row })), highlight: null, missed: [] };
  applyTableEvent(state, { keyColumn }, event);
  return state.rows;
}

function create(root: SVGSVGElement, data: unknown): SceneDriver {
  // Drawn by drawDhcp() at build time, beside this figure.
  const { M, arc, ringMax, ringAt, places } = data as DhcpSceneData;
  const part = <T extends SVGElement = SVGElement>(id: string): T => {
    const found = root.querySelector<T>(`#${id}`);
    if (found === null) throw new Error(`The DHCP figure has no #${id}.`);
    return found;
  };
  const tags = new Map(['discover', 'offer', 'request', 'ack', 'renew', 'frame', 'to-all'].map((label) => [label, part(`dh-tag-${label}`)]));
  const trail = part('dh-arc');
  const shadow = part('dh-tag-shadow');
  const rings = part('dh-ring-g');
  const ring = part('dh-ring');
  const ring2 = part('dh-ring2');
  const laptopGlow = part('dh-lap-glow');
  const phoneGlow = part('dh-ph-glow');
  const tvGlow = part('dh-tv-glow');
  const ignores = part('dh-ignore');
  // The power light stays on; the other three light while the router replies.
  const routerLeds = [1, 2, 3].map((i) => part(`dh-led-${i}`));
  const leaseRow = part('dh-lease-row');
  const leaseText = leaseRow.querySelector('text')!;
  const noAddress = part('dh-lap-noip');
  const address = part('dh-lap-ip');
  const callout = part('dh-laptop-ip');
  const noAddressCallout = callout.textContent ?? '';
  const verdictOf = Object.fromEntries(PLACES.map((place) => [place, part(`dh-v-${place}`)])) as Record<Place, SVGElement>;
  // What each device lights while it keeps a frame: its screen, or the router's three lights.
  const lightsOf: Record<Place, SVGElement[]> = { laptop: [laptopGlow], phone: [phoneGlow], tv: [tvGlow], router: routerLeds };

  const [ax, bx, cx, ay, by, cy] = M as [number, number, number, number, number, number];
  /** A point of the plate on screen, from the figure's origin, where the moving parts are drawn. */
  const onScreen = ([x, y, z]: [number, number, number]): [number, number] => [ax * x + bx * y + cx * z, ay * x + by * y + cy * z];
  /** The point `k` of the way along the arc, laptop (0) to router (1). */
  const onArc = (k: number): [number, number, number] => {
    const f = k * (arc.length - 1);
    const i = Math.min(arc.length - 2, Math.floor(f));
    const r = f - i;
    const [a, b] = [arc[i]!, arc[i + 1]!];
    return [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r, a[2] + (b[2] - a[2]) * r];
  };
  const moveTo = (el: SVGElement, [x, y]: [number, number]): void =>
    el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
  const fade = (el: SVGElement, opacity: number): void => {
    el.style.opacity = String(opacity);
  };

  /** Nothing in flight: every tag, the trail and the ring back where the figure drew them (the ring at the laptop, as small as it goes). */
  function clearMoving(): void {
    for (const el of [...tags.values(), shadow]) {
      fade(el, 0);
      el.removeAttribute('transform');
    }
    fade(trail, 0);
    fade(rings, 0);
    for (const circle of [ring, ring2]) {
      circle.setAttribute('cx', String(ringAt.laptop[0]));
      circle.setAttribute('cy', String(ringAt.laptop[1]));
      circle.setAttribute('r', '1');
    }
  }

  /** Nothing in flight and every light off. */
  function clear(): void {
    clearMoving();
    for (const el of [laptopGlow, phoneGlow, tvGlow, ignores, ...routerLeds]) el.classList.remove('on');
  }

  /** The lease table as the figure shows it: the board's row, the laptop's screen and its callout. */
  function paintLeases(rows: Row[]): void {
    const lease = rows[0];
    fade(leaseRow, lease ? 1 : 0);
    fade(noAddress, lease ? 0 : 1);
    fade(address, lease ? 1 : 0);
    if (lease === undefined) {
      callout.textContent = noAddressCallout;
      callout.setAttribute('class', 'dh-addr none');
      return;
    }
    const ip = lease[IP] ?? '';
    // '.100  LAPTOP': the address's last number and the device, as the board's narrow row fits them.
    leaseText.textContent = `.${ip.split('.').at(-1)}  ${(lease[DEVICE] ?? '').toUpperCase()}`;
    address.textContent = ip;
    callout.textContent = ip;
    callout.setAttribute('class', 'dh-addr new');
  }

  const leasesOf = (view: SceneView): Row[] => view.tables[LEASES]?.rows ?? [];

  /** The frames setup (the start cue `frames`): the TV in, the lease board and DHCP's callouts out, the laptop online. */
  function setUp(): void {
    for (const g of root.querySelectorAll('[data-setup="frames"]')) g.removeAttribute('display');
    for (const g of root.querySelectorAll('[data-setup="addresses"]')) g.setAttribute('display', 'none');
    fade(noAddress, 0);
    fade(address, 1);
    address.textContent = FRAMES_LAPTOP_IP;
    root.setAttribute('aria-label', FRAMES_DESCRIPTION);
  }
  const framed = (view: SceneView): boolean => view.start.some((c) => c.cue === 'frames');
  const framesOf = (view: SceneView): Row[] => view.tables[FRAMES]?.rows ?? [];

  /** One device's verdict and light. Anything but the four words leaves no verdict. */
  function verdict(place: Place, word: string | undefined, lit = word === 'Keeps it'): void {
    const g = verdictOf[place];
    const v = word === undefined ? undefined : VERDICTS[word];
    if (v === undefined) {
      g.removeAttribute('data-v');
      g.querySelector('.dh-v-t')!.textContent = '';
    } else {
      g.setAttribute('data-v', v);
      g.querySelector('.dh-v-t')!.textContent = word!;
    }
    for (const el of lightsOf[place]) el.classList.toggle('on', lit);
  }

  /** The verdicts and the lights of the frames table's rows: each device's "This frame" cell. */
  function paintFrames(rows: Row[], split: boolean): void {
    for (const place of PLACES) verdict(place, rows.find((row) => row[MAC] === MACS[place])?.[FRAME]);
    // The split is the laptop's address matched, and nothing else: an update never leaves it on.
    if (split) root.setAttribute('data-split', '');
    else root.removeAttribute('data-split');
  }
  const splitAfter = (e: TableEvent): boolean => e.op === 'match' && e.key === MACS.laptop;

  async function play(event: SceneEvent, view: SceneView, o: PlayOptions): Promise<void> {
    const frames = framed(view);
    if (event.type === 'table') {
      if (event.table === LEASES && !frames) paintLeases(rowsAfter(leasesOf(view), event));
      if (event.table === FRAMES && frames) paintFrames(rowsAfter(framesOf(view), event, MAC), splitAfter(event));
      return;
    }
    const tag = event.type === 'message' ? tags.get(event.tag.toLowerCase().replace(' ', '-')) : undefined;
    if (event.type !== 'message' || tag === undefined) return;

    const out = event.from === 'laptop';
    // In the frames setup every frame rings, one for one device or for all, from whoever sends it.
    const spreads = event.kind === 'broadcast' || frames;
    const from = event.from as Place;
    clear();
    fade(tag, 1);
    fade(trail, 0.9);
    fade(shadow, 0.5);
    if (frames) {
      for (const circle of [ring, ring2]) {
        circle.setAttribute('cx', String(ringAt[from as 'laptop' | 'router'][0]));
        circle.setAttribute('cy', String(ringAt[from as 'laptop' | 'router'][1]));
      }
      // The sender says so at once; the others hear it as the ring reaches them.
      for (const place of PLACES) verdict(place, place === from ? 'Sent it' : undefined, place === from);
    } else if (out) laptopGlow.classList.add('on');
    else for (const led of routerLeds) led.classList.add('on');
    if (spreads) fade(rings, 1);
    const [sx, sy] = frames ? ringAt[from as 'laptop' | 'router'] : ringAt.laptop;
    /** How far along the ride the ring has reached each device, in ring widths. */
    const reach = Object.fromEntries(PLACES.map((place) => [place, Math.hypot(places[place][0] - sx, places[place][1] - sy) / ringMax])) as Record<Place, number>;
    const hear = (k: number): void => {
      for (const place of PLACES) if (place !== from && k >= reach[place] && verdictOf[place].getAttribute('data-v') === null) verdict(place, 'Hears it', true);
    };

    await animate(
      RIDE_MS / o.speed,
      (k) => {
        const p = onArc(out ? easeInOut(k) : 1 - easeInOut(k));
        moveTo(tag, onScreen(p));
        moveTo(shadow, onScreen([p[0], p[1], 0]));
        if (!spreads) return;
        const r = ringMax * k;
        ring.setAttribute('r', r.toFixed(1));
        ring2.setAttribute('r', Math.max(1, r * 0.7).toFixed(1));
        // Under reduced motion the ring never spreads: it is motion, not a state.
        fade(rings, o.reducedMotion ? 0 : 1 - k * 0.85);
        if (frames) {
          hear(k);
          return;
        }
        if (k > PHONE_HEARS_AT) {
          phoneGlow.classList.add('on');
          ignores.classList.add('on');
        }
      },
      o,
    );
    if (o.signal.aborted) return;
    await wait(REST_MS / o.speed, o.signal);
    if (o.signal.aborted) return;
    // In the frames setup what the ride leaves stays: the verdicts and their lights, until the table says otherwise.
    if (frames) clearMoving();
    else clear();
  }

  return {
    show(view) {
      // Settled means no motion: the glows and the note change at once, not over their fades.
      // The browser takes the new styles while data-settling turns the fades off (dhcp.css);
      // after that they are back on, so a play still fades its lights in and out.
      root.setAttribute('data-settling', '');
      clear();
      if (framed(view)) {
        setUp();
        const matched = view.tables[FRAMES]?.highlight;
        paintFrames(framesOf(view), matched?.type === 'matched' && matched.key === MACS.laptop);
      } else paintLeases(leasesOf(view));
      void root.getBoundingClientRect();
      root.removeAttribute('data-settling');
    },
    play,
    // Nothing to let go of: a play's timers and listeners end with its signal, which the panel aborts first.
    destroy() {},
  };
}

/** The DHCP figure's driver. */
export const dhcpDriver: DriverModule = { create, duration };
