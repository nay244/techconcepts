// Only types from the drawing module: its code is for the build, and stays out of the page.
import type { SwitchSceneData } from '../../art/scenes/switch';
import { SWITCH_DEVICES, SWITCH_PLUGS, type SwitchDevice } from '../../art/scenes/switch-parts';
import type { Cue, MessageEvent, SceneEvent } from '../../content/schema';
import type { DriverModule, PlayOptions, SceneDriver, SceneView } from '../driver';
import { along, animate, easeInOut, wait } from '../motion';

/**
 * Moves the Switch figure (src/art/scenes/switch.ts): four devices plugged into a five-port switch.
 *
 * A frame's tag rides the sender's cable into its port, and the port's light comes on. The switch then sends it out:
 * - out of the one port the receiver is plugged into, the same tag going on (a frame the switch knows where to send);
 * - or, for a broadcast (`kind: 'broadcast'`, to `all`) or a frame with the `flood` cue, a copy out of every other
 *   port a device is plugged into, all at once: COPY tags, or TO ALL for a broadcast. Never back down the sender's
 *   cable, and never out of a free port.
 * Each device that gets a copy says what it did with it, as MAC Address's do: the receiver (or, for a broadcast,
 * everyone) "Keeps it", the others "Ignores it"; the sender "Sent it". A device that gets no copy says nothing and
 * its cable stays dark. Once the frame has landed, its way stays traced along the cables and its ports stay lit.
 *
 * `plug laptop 5` (a message's cue) moves the laptop's cable from port 2 to port 5 before that frame sets off; from
 * then on the laptop is on port 5. A step with no frame yet that adds or changes a MAC table row lights that row's
 * port and the cable plugged into it (the switch learning where a device is).
 */

type Flat = [number, number];

/** A frame at 1×: the ride in, the switch's look-up, the ride out, the rest, and the gap after it. A re-plug comes first. */
const IN_MS = 900;
const LOOK_MS = 500;
const OUT_MS = 900;
const REST_MS = 450;
const GAP_MS = 200;
const PLUG_MS = 1200;
/** A MAC table event waits this long, so the learner sees the table before the next thing happens. */
const TABLE_MS = 900;

/** The MAC table, keyed on the MAC address; the figure reads its port column. */
const TABLE = 'mac-table';
const PORT = 'port';
const DEVICES = Object.keys(SWITCH_DEVICES) as SwitchDevice[];
const VERDICT: Record<'sent' | 'keeps' | 'ignores', string> = { sent: 'Sent it', keeps: 'Keeps it', ignores: 'Ignores it' };

const hasPlug = (e: MessageEvent): boolean => (e.cues ?? []).some((c) => c.cue === 'plug');

function duration(event: SceneEvent): number {
  if (event.type === 'table') return event.table === TABLE ? TABLE_MS : 0;
  if (event.type !== 'message') return 0;
  return (hasPlug(event) ? PLUG_MS : 0) + IN_MS + LOOK_MS + OUT_MS + REST_MS + GAP_MS;
}

/** Which port each device is plugged into, after the `plug` cues so far, in order. */
function plugsAfter(cues: readonly Cue[]): Record<SwitchDevice, number> {
  const plugs = { ...SWITCH_PLUGS };
  for (const c of cues) {
    if (c.cue !== 'plug') continue;
    const [device, port] = (c.arg ?? '').split(' ');
    plugs[device as SwitchDevice] = Number(port);
  }
  return plugs;
}

/** A frame's way through the switch: the port it comes in on, and the ports it goes out of, each with its device. */
interface Way {
  from: SwitchDevice;
  inPort: number;
  out: { device: SwitchDevice; port: number }[];
  flood: boolean;
}
function wayOf(e: MessageEvent, plugs: Record<SwitchDevice, number>): Way {
  const from = e.from as SwitchDevice;
  const flood = e.kind === 'broadcast' || (e.cues ?? []).some((c) => c.cue === 'flood');
  const out = flood
    ? DEVICES.filter((d) => d !== from).map((device) => ({ device, port: plugs[device] }))
    : [{ device: e.to as SwitchDevice, port: plugs[e.to as SwitchDevice] }];
  return { from, inPort: plugs[from], out: out.sort((a, b) => a.port - b.port), flood };
}

/** What a device does with the copy it gets: a broadcast, or a frame with its address on it, it keeps. */
const keeps = (e: MessageEvent, d: SwitchDevice): boolean => e.kind === 'broadcast' || e.to === d;

/** The part of a line on screen from its start to `t` of the way along it. */
function partOf(path: Flat[], t: number): Flat[] {
  if (t >= 1) return path;
  const lengths = path.slice(1).map(([x, y], i) => Math.hypot(x - path[i]![0], y - path[i]![1]));
  let left = Math.max(t, 0) * lengths.reduce((a, b) => a + b, 0);
  const out: Flat[] = [path[0]!];
  for (const [i, length] of lengths.entries()) {
    if (left <= length) {
      out.push(along([path[i]!, path[i + 1]!], length > 0 ? left / length : 0));
      return out;
    }
    out.push(path[i + 1]!);
    left -= length;
  }
  return out;
}
const pointsOf = (list: Flat[]): string => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

function create(root: SVGSVGElement, data: unknown): SceneDriver {
  // Drawn by drawSwitch() at build time, beside this figure.
  const { cables } = data as SwitchSceneData;
  const part = <T extends SVGElement = SVGElement>(id: string): T => {
    const found = root.querySelector<T>(`#${id}`);
    if (found === null) throw new Error(`The Switch figure has no #${id}.`);
    return found;
  };
  const tag = (id: string): SVGElement => part(`sw-tag-${id}`);
  const allTags = ['frame', 'to-all', 'copy-1', 'copy-2', 'copy-3', 'to-all-1', 'to-all-2', 'to-all-3'].map(tag);
  const leds = [1, 2, 3, 4, 5].map((n) => part(`sw-led-${n}`));
  const traces = Object.fromEntries(Object.keys(cables).map((key) => [key, part<SVGPolylineElement>(`sw-trace-${key.replace(':', '-')}`)]));
  const verdicts = Object.fromEntries(DEVICES.map((d) => [d, part(`sw-v-${d}`)])) as Record<SwitchDevice, SVGElement>;
  const chips = Object.fromEntries(DEVICES.map((d) => [d, part(`sw-port-${d}`)])) as Record<SwitchDevice, SVGElement>;
  // Each device's status light (the router's two), on while it keeps a frame: a light, as MAC Address's devices have,
  // not a lit screen or paper slot, which would say the frame is shown or printed.
  const keepLights: Record<SwitchDevice, SVGElement[]> = {
    laptop: [part('sw-led-laptop')],
    tv: [part('sw-led-tv')],
    printer: [part('sw-led-printer')],
    router: [part('sw-rt-led-1'), part('sw-rt-led-2')],
  };
  // The laptop's cable and plug at port 2, and at port 5 once moved.
  const laptopAt = (port: number): SVGElement[] => [part(`sw-cable-laptop-${port}`), part(`sw-plug-laptop-${port}`)];

  const fade = (el: SVGElement, opacity: number): void => {
    el.style.opacity = String(opacity);
  };
  const moveTo = (el: SVGElement, [x, y]: Flat): void => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
  const cableOf = (device: SwitchDevice, port: number): Flat[] => {
    const path = cables[`${device}:${port}`];
    if (path === undefined) throw new Error(`The Switch figure has no cable from the ${device} to port ${port}.`);
    return path;
  };
  /** A cable's trace: `ride` while a frame is on it, `trace` once it has landed; drawn from the device to `t` (or from the port, backwards). */
  function trace(device: SwitchDevice, port: number, state: 'ride' | 'trace' | null, t = 1, fromPort = false): void {
    const el = traces[`${device}:${port}`]!;
    if (state === null) {
      el.removeAttribute('data-on');
      el.setAttribute('points', '');
      return;
    }
    const path = cableOf(device, port);
    el.setAttribute('data-on', state);
    el.setAttribute('points', pointsOf(fromPort ? partOf([...path].reverse(), t) : partOf(path, t)));
  }
  function verdict(d: SwitchDevice, v: keyof typeof VERDICT | null): void {
    const g = verdicts[d];
    if (v === null) g.removeAttribute('data-v');
    else g.setAttribute('data-v', v);
    g.querySelector('.sw-v-t')!.textContent = v === null ? '' : VERDICT[v];
    for (const el of keepLights[d]) el.classList.toggle('on', v === 'keeps');
  }

  /** Nothing in flight: every tag back where the figure drew it, hidden. */
  function clearMoving(): void {
    for (const el of allTags) {
      fade(el, 0);
      el.removeAttribute('transform');
    }
  }
  /** Nothing in flight, no trace, no port light, no verdict. */
  function clear(): void {
    clearMoving();
    for (const el of Object.values(traces)) {
      el.removeAttribute('data-on');
      el.setAttribute('points', '');
    }
    for (const led of leds) led.classList.remove('on');
    for (const d of DEVICES) verdict(d, null);
  }
  /** The cables as plugged: the laptop's at port 2 or 5, and the port in each device's callout. */
  function paintPlugs(plugs: Record<SwitchDevice, number>): void {
    for (const port of [2, 5]) for (const el of laptopAt(port)) {
      el.removeAttribute('data-ghost');
      // A re-plug stopped part-way leaves its fade on the cable and plug (E14).
      el.style.removeProperty('opacity');
      if (plugs.laptop === port) el.removeAttribute('display');
      else el.setAttribute('display', 'none');
    }
    for (const d of DEVICES) {
      chips[d].textContent = `PORT ${plugs[d]}`;
      chips[d].classList.toggle('moved', plugs[d] !== SWITCH_PLUGS[d]);
    }
  }
  /** A frame that has landed: its way traced, its ports lit, and every verdict. */
  function paintLanded(e: MessageEvent, plugs: Record<SwitchDevice, number>): void {
    const way = wayOf(e, plugs);
    trace(way.from, way.inPort, 'trace');
    leds[way.inPort - 1]!.classList.add('on');
    verdict(way.from, 'sent');
    for (const { device, port } of way.out) {
      trace(device, port, 'trace');
      leds[port - 1]!.classList.add('on');
      verdict(device, keeps(e, device) ? 'keeps' : 'ignores');
    }
  }
  /** A step with no frame yet: a row the MAC table has just gained or changed lights its port and the cable there. */
  function paintLearned(port: number, plugs: Record<SwitchDevice, number>): void {
    leds[port - 1]?.classList.add('on');
    const device = DEVICES.find((d) => plugs[d] === port);
    if (device !== undefined) trace(device, port, 'trace');
  }
  const portOfRow = (view: SceneView): number | null => {
    const table = view.tables[TABLE];
    const h = table?.highlight;
    if (table === undefined || h === null || h === undefined || (h.type !== 'added' && h.type !== 'updated')) return null;
    const row = table.rows.find((r) => r['mac'] === h.key);
    return row === undefined ? null : Number(row[PORT]);
  };

  /** Rides one tag along a cable, laying its trace behind it: in from the device, or out from the port. */
  async function ride(el: SVGElement, device: SwitchDevice, port: number, outward: boolean, o: PlayOptions, t: number): Promise<void> {
    const path = outward ? [...cableOf(device, port)].reverse() : cableOf(device, port);
    fade(el, 1);
    moveTo(el, path[0]!);
    await animate(t, (k) => {
      const f = easeInOut(k);
      moveTo(el, along(path, f));
      trace(device, port, 'ride', f, outward);
    }, o);
  }

  async function play(event: SceneEvent, view: SceneView, o: PlayOptions): Promise<void> {
    if (event.type === 'table') {
      if (event.table === TABLE && view.landed === null && (event.op === 'add' || event.op === 'update') && event.row?.[PORT] !== undefined) {
        clear();
        paintLearned(Number(event.row[PORT]), plugsAfter(view.cues));
      }
      return;
    }
    if (event.type !== 'message') return;
    clear();
    let plugs = plugsAfter(view.cues);
    // A re-plug first: the old cable fades to a ghost while the new one comes in, then the ghost goes.
    if (hasPlug(event)) {
      const next = plugsAfter([...view.cues, ...(event.cues ?? [])]);
      const [from, to] = [laptopAt(plugs.laptop), laptopAt(next.laptop)];
      for (const el of from) el.setAttribute('data-ghost', '');
      for (const el of to) {
        el.removeAttribute('display');
        fade(el, 0);
      }
      await animate(PLUG_MS / o.speed, (k) => {
        for (const el of to) fade(el, Math.min(1, k * 1.6));
        for (const el of from) fade(el, Math.max(0, 1 - k * 1.4));
      }, o);
      if (o.signal.aborted) return;
      for (const el of [...from, ...to]) el.style.removeProperty('opacity');
      plugs = next;
      paintPlugs(plugs);
      leds[plugs.laptop - 1]!.classList.add('on');
    }
    const way = wayOf(event, plugs);
    verdict(way.from, 'sent');
    const inTag = tag(event.kind === 'broadcast' ? 'to-all' : 'frame');
    await ride(inTag, way.from, way.inPort, false, o, IN_MS / o.speed);
    if (o.signal.aborted) return;
    leds[way.inPort - 1]!.classList.add('on');
    trace(way.from, way.inPort, 'trace');
    // The switch looks the address up; the frame waits at its port.
    if (way.flood) fade(inTag, 0);
    await wait(LOOK_MS / o.speed, o.signal);
    if (o.signal.aborted) return;
    const outTags = way.flood ? way.out.map((_, i) => tag(`${event.kind === 'broadcast' ? 'to-all' : 'copy'}-${i + 1}`)) : [inTag];
    for (const { port } of way.out) leds[port - 1]!.classList.add('on');
    await Promise.all(way.out.map(({ device, port }, i) => ride(outTags[i]!, device, port, true, o, OUT_MS / o.speed)));
    if (o.signal.aborted) return;
    for (const { device, port } of way.out) {
      trace(device, port, 'trace');
      verdict(device, keeps(event, device) ? 'keeps' : 'ignores');
    }
    await wait(REST_MS / o.speed, o.signal);
    if (o.signal.aborted) return;
    clearMoving();
  }

  return {
    show(view) {
      // Settled means no motion: the lights change at once, not over their fades (switch.css).
      root.setAttribute('data-settling', '');
      clear();
      const plugs = plugsAfter(view.cues);
      paintPlugs(plugs);
      if (view.landed?.type === 'message') paintLanded(view.landed, plugs);
      else {
        const port = portOfRow(view);
        if (port !== null) paintLearned(port, plugs);
      }
      void root.getBoundingClientRect();
      root.removeAttribute('data-settling');
    },
    play,
    // Nothing to let go of: a play's timers and listeners end with its signal, which the panel aborts first.
    destroy() {},
  };
}

/** The Switch figure's driver. */
export const switchDriver: DriverModule = { create, duration };
