import type { DhcpSceneData } from '../../art/scenes/dhcp';
import type { Row, SceneEvent, TableEvent } from '../../content/schema';
import { applyTableEvent } from '../../engine/tables';
import type { DriverModule, PlayOptions, SceneDriver, SceneView } from '../driver';
import { animate, easeInOut } from '../motion';

/**
 * Moves the DHCP figure (src/art/scenes/dhcp.ts), as the approved mockup's
 * `send`, `apply` and `clearScene` do (lesson-v3.html): a message's tag rides
 * the dotted arc between the laptop and the router, a broadcast also spreads a
 * ring of light across the plate, and the lease table shows on the router's
 * board, on the laptop's screen and in its callout.
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

function duration(event: SceneEvent): number {
  // A table event has nothing to move, so it lands at once, with the message before it.
  return event.type === 'message' ? RIDE_MS + REST_MS + GAP_MS : 0;
}

/** Waits `ms`, or less if `signal` aborts first. Unlike a tween it also waits under reduced motion, so a step keeps its pace. */
function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve();
    const done = (): void => {
      clearTimeout(timer);
      signal.removeEventListener('abort', done);
      resolve();
    };
    const timer = setTimeout(done, ms);
    signal.addEventListener('abort', done);
  });
}

/** The lease rows once `event` has landed. The figure has no table definition, only the key it knows the lease table by. */
function rowsAfter(rows: Row[], event: TableEvent): Row[] {
  const state = { rows: rows.map((row) => ({ ...row })), highlight: null };
  applyTableEvent(state, { keyColumn: IP }, event);
  return state.rows;
}

function create(root: SVGSVGElement, data: unknown): SceneDriver {
  // Drawn by drawDhcp() at build time, beside this figure.
  const { M, arc, ringMax } = data as DhcpSceneData;
  const part = <T extends SVGElement = SVGElement>(id: string): T => {
    const found = root.querySelector<T>(`#${id}`);
    if (found === null) throw new Error(`The DHCP figure has no #${id}.`);
    return found;
  };
  const tags = new Map(['discover', 'offer', 'request', 'ack', 'renew'].map((label) => [label, part(`dh-tag-${label}`)]));
  const trail = part('dh-arc');
  const shadow = part('dh-tag-shadow');
  const rings = part('dh-ring-g');
  const ring = part('dh-ring');
  const ring2 = part('dh-ring2');
  const laptopGlow = part('dh-lap-glow');
  const phoneGlow = part('dh-ph-glow');
  const ignores = part('dh-ignore');
  // The power light stays on; the other three light while the router replies.
  const routerLeds = [1, 2, 3].map((i) => part(`dh-led-${i}`));
  const leaseRow = part('dh-lease-row');
  const leaseText = leaseRow.querySelector('text')!;
  const noAddress = part('dh-lap-noip');
  const address = part('dh-lap-ip');
  const callout = part('dh-laptop-ip');
  const noAddressCallout = callout.textContent ?? '';

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

  /** Nothing in flight: every tag, trail, ring and light back where the figure drew it. */
  function clear(): void {
    for (const el of [...tags.values(), shadow]) {
      fade(el, 0);
      el.removeAttribute('transform');
    }
    fade(trail, 0);
    fade(rings, 0);
    ring.setAttribute('r', '1');
    ring2.setAttribute('r', '1');
    for (const el of [laptopGlow, phoneGlow, ignores, ...routerLeds]) el.classList.remove('on');
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

  async function play(event: SceneEvent, view: SceneView, o: PlayOptions): Promise<void> {
    if (event.type === 'table') {
      if (event.table === LEASES) paintLeases(rowsAfter(leasesOf(view), event));
      return;
    }
    const tag = event.type === 'message' ? tags.get(event.tag.toLowerCase()) : undefined;
    if (event.type !== 'message' || tag === undefined) return;

    const out = event.from === 'laptop';
    const broadcast = event.kind === 'broadcast';
    clear();
    fade(tag, 1);
    fade(trail, 0.9);
    fade(shadow, 0.5);
    if (out) laptopGlow.classList.add('on');
    else for (const led of routerLeds) led.classList.add('on');
    if (broadcast) fade(rings, 1);

    await animate(
      RIDE_MS / o.speed,
      (k) => {
        const p = onArc(out ? easeInOut(k) : 1 - easeInOut(k));
        moveTo(tag, onScreen(p));
        moveTo(shadow, onScreen([p[0], p[1], 0]));
        if (!broadcast) return;
        const r = ringMax * k;
        ring.setAttribute('r', r.toFixed(1));
        ring2.setAttribute('r', Math.max(1, r * 0.7).toFixed(1));
        // Under reduced motion the ring never spreads: it is motion, not a state.
        fade(rings, o.reducedMotion ? 0 : 1 - k * 0.85);
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
    clear();
  }

  return {
    show(view) {
      // Settled means no motion: the glows and the note change at once, not over their fades.
      // The browser takes the new styles while data-settling turns the fades off (dhcp.css);
      // after that they are back on, so a play still fades its lights in and out.
      root.setAttribute('data-settling', '');
      clear();
      paintLeases(leasesOf(view));
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
