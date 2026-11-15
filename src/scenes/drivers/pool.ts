// Only types from the drawing module: its code is for the build, and stays out of the page.
import type { PoolSceneData } from '../../art/scenes/pool';
import { POOL_CHIPS, POOL_HEALTH, POOL_HEALTH_WORDS, POOL_KEY, POOL_READERS, POOL_REQUESTS, POOL_SERVERS, POOL_TABLE } from '../../art/scenes/pool-parts';
import type { MessageEvent, NoteEvent, Row, SceneEvent, TableEvent } from '../../content/schema';
import { applyTableEvent } from '../../engine/tables';
import type { DriverModule, PlayOptions, SceneDriver, SceneView } from '../driver';
import { along, animate, easeInOut, wait } from '../motion';

/**
 * Moves the Load Balancers figure (src/art/scenes/pool.ts).
 *
 * - A request rides from its reader's screen along its cable to the top of the balancer, waits there while the
 *   balancer picks (the server's light on the balancer's face comes on), then rides that server's cable to its top.
 *   A `skip` cue names a server the balancer passes over: its red mark shows over its port while the request waits.
 * - A check rides from the balancer to a server; an answer rides back. A note with a `no-answer` cue rings the server
 *   that did not answer in time with a dashed circle.
 * - The pool table is what the servers show: each Health cell lights the server's two lamps and writes its health
 *   line, and each Requests cell stacks that many chips on its top.
 *
 * Once a request has landed it stays on the figure: `show` lights the latest one's reader, its light on the balancer
 * and its server's newest chip; a no-answer note keeps its ring.
 */

type Point = [number, number, number];
type Flat = [number, number];
type Server = (typeof POOL_SERVERS)[number];
type Reader = (typeof POOL_READERS)[number];

/** Ms at 1×: a leg of a ride (half that for a `fast` one), the pick on the balancer and a skip's mark, a no-answer ring, the rest after an event and the gap before the next. */
const LEG_MS = 1000;
const PICK_MS = 450;
const SKIP_MS = 700;
const QUIET_MS = 1100;
const REST_MS = 300;
const GAP_MS = 200;

const isServer = (p: string): p is Server => (POOL_SERVERS as readonly string[]).includes(p);
const isReader = (p: string): p is Reader => (POOL_READERS as readonly string[]).includes(p);
const cueArg = (e: SceneEvent, cue: string): string | undefined => (e.type === 'table' ? undefined : e.cues?.find((c) => c.cue === cue)?.arg);

function duration(event: SceneEvent): number {
  // A table event has nothing to move, so it lands at once, with the event before it.
  if (event.type === 'table') return 0;
  if (event.type === 'note') return (cueArg(event, 'no-answer') === undefined ? 0 : QUIET_MS) + GAP_MS;
  const leg = event.fast === true ? LEG_MS / 2 : LEG_MS;
  const pick = isReader(event.from) ? leg + PICK_MS + (cueArg(event, 'skip') === undefined ? 0 : SKIP_MS) : 0;
  return pick + leg + REST_MS + GAP_MS;
}

function rowsAfter(rows: Row[], event: TableEvent): Row[] {
  const state = { rows: rows.map((row) => ({ ...row })), highlight: null, missed: [] };
  applyTableEvent(state, { keyColumn: POOL_KEY }, event);
  return state.rows;
}

function create(root: SVGSVGElement, data: unknown): SceneDriver {
  // Drawn by drawPool() at build time, beside this figure.
  const { M, O, legs } = data as PoolSceneData;
  const part = <T extends SVGElement = SVGElement>(id: string): T => {
    const found = root.querySelector<T>(`#${id}`);
    if (found === null) throw new Error(`The Load Balancers figure has no #${id}.`);
    return found;
  };
  const tags = new Map(['request', 'check', 'ok'].map((t) => [t, part(`pl-tag-${t}`)]));
  const trail = part<SVGPolylineElement>('pl-trail');
  const glow = Object.fromEntries(POOL_READERS.map((r) => [r, part(`pl-glow-${r}`)])) as Record<Reader, SVGElement>;
  const per = <T,>(make: (s: Server) => T): Record<Server, T> => Object.fromEntries(POOL_SERVERS.map((s) => [s, make(s)])) as Record<Server, T>;
  const pick = per((s) => part(`pl-pick-${s}`));
  const quiet = per((s) => part(`pl-quiet-${s}`));
  const skip = per((s) => part(`pl-skip-${s}`));
  const lamps = per((s) => [0, 1].map((n) => part(`pl-lamp-${s}-${n}`)));
  const health = per((s) => part(`pl-health-${s}`));
  const healthText = per((s) => part(`pl-health-t-${s}`));
  const chips = per((s) => Array.from({ length: POOL_CHIPS }, (_, i) => part(`pl-chip-${s}-${i}`)));
  const litChips = per((s) => Array.from({ length: POOL_CHIPS }, (_, i) => part(`pl-chip-lit-${s}-${i}`)));
  /** How many chips each server shows now, so a landed request lights its newest. */
  const count = per(() => 0);

  const [ax, bx, cx, ay, by, cy] = M as [number, number, number, number, number, number];
  const onScreen = ([x, y, z]: Point): Flat => [ax * x + bx * y + cx * z, ay * x + by * y + cy * z];
  const fade = (el: SVGElement, opacity: number): void => {
    el.style.opacity = String(opacity);
  };

  /** Nothing in flight: the tags, the trail and the marks gone. */
  function clearMoving(): void {
    for (const el of tags.values()) {
      fade(el, 0);
      el.removeAttribute('transform');
    }
    fade(trail, 0);
    trail.setAttribute('points', '');
    for (const s of POOL_SERVERS) fade(skip[s], 0);
  }
  /** Nothing in flight and nothing lit. */
  function clear(): void {
    clearMoving();
    for (const r of POOL_READERS) glow[r].classList.remove('on');
    for (const s of POOL_SERVERS) {
      pick[s].classList.remove('on');
      fade(quiet[s], 0);
      for (const el of litChips[s]) fade(el, 0);
    }
  }

  /** The pool table as the servers show it: two lamps and a health line from Health, chips from Requests. */
  function paint(rows: Row[]): void {
    for (const s of POOL_SERVERS) {
      const row = rows.find((r) => r[POOL_KEY]?.toLowerCase() === s);
      const word = row?.[POOL_HEALTH];
      // A word that is a key of Object.prototype (`constructor`) is not one of the figure's four (E28).
      const shown = word !== undefined && Object.hasOwn(POOL_HEALTH_WORDS, word) ? POOL_HEALTH_WORDS[word] : undefined;
      lamps[s].forEach((lamp, n) => (shown === undefined ? lamp.removeAttribute('data-check') : lamp.setAttribute('data-check', shown.lamps[n]!)));
      if (shown === undefined) health[s].removeAttribute('data-health');
      else health[s].setAttribute('data-health', shown.state);
      health[s].toggleAttribute('data-turning', shown?.turning === true);
      healthText[s].textContent = shown === undefined ? '' : word!;
      const n = Math.min(POOL_CHIPS, Math.max(0, Number.parseInt(row?.[POOL_REQUESTS] ?? '0', 10) || 0));
      count[s] = n;
      chips[s].forEach((chip, i) => fade(chip, i < n ? 1 : 0));
    }
  }
  const poolOf = (view: SceneView): Row[] => view.tables[POOL_TABLE]?.rows ?? [];

  /** A landed request: its reader's screen, its server's light on the balancer and its newest chip. */
  function lightRequest(e: MessageEvent): void {
    if (!isReader(e.from) || !isServer(e.to)) return;
    glow[e.from].classList.add('on');
    pick[e.to].classList.add('on');
    const top = count[e.to] - 1;
    if (top >= 0) fade(litChips[e.to][top]!, 1);
  }
  function lightLanded(landed: MessageEvent | NoteEvent | null): void {
    if (landed?.type === 'message') lightRequest(landed);
    const quietAt = landed === null ? undefined : cueArg(landed, 'no-answer');
    if (quietAt !== undefined && isServer(quietAt)) fade(quiet[quietAt], 1);
  }

  /** Rides `tag` along a leg of the plate, forwards or backwards, leaving a trail behind it. */
  async function ride(tag: SVGElement, leg: Point[], back: boolean, ms: number, o: PlayOptions): Promise<void> {
    const flat = (back ? [...leg].reverse() : leg).map(onScreen);
    // How far along the leg, by length on screen, each point is: the trail keeps the points the tag has passed.
    const cum = flat.map((_, i) => flat.slice(1, i + 1).reduce((sum, p, j) => sum + Math.hypot(p[0] - flat[j]![0], p[1] - flat[j]![1]), 0));
    const total = cum.at(-1) || 1;
    // Placed at the leg's start before it shows, so it never shows where it was drawn.
    tag.setAttribute('transform', `translate(${flat[0]![0].toFixed(1)} ${flat[0]![1].toFixed(1)})`);
    fade(tag, 1);
    fade(trail, 0.9);
    await animate(
      ms / o.speed,
      (k) => {
        const t = easeInOut(k);
        const [x, y] = along(flat, t);
        tag.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        const passed = flat.filter((_, i) => cum[i]! / total <= t);
        // The tags are drawn at the plate's origin, which sits at O on screen; the trail is drawn in the figure's own frame.
        trail.setAttribute('points', [...passed, [x, y]].map(([px, py]) => `${(px + O[0]).toFixed(1)},${(py + O[1]).toFixed(1)}`).join(' '));
      },
      o,
    );
  }

  async function play(event: SceneEvent, view: SceneView, o: PlayOptions): Promise<void> {
    if (event.type === 'table') {
      if (event.table !== POOL_TABLE) return;
      paint(rowsAfter(poolOf(view), event));
      // The newest chip of the request that has just landed lights as its count goes up.
      for (const s of POOL_SERVERS) for (const el of litChips[s]) fade(el, 0);
      if (view.landed?.type === 'message') lightRequest(view.landed);
      return;
    }
    clear();
    if (event.type === 'note') {
      const s = cueArg(event, 'no-answer');
      if (s === undefined || !isServer(s)) return;
      await animate(QUIET_MS / o.speed, (k) => fade(quiet[s], o.reducedMotion ? 1 : Math.min(1, k * 3)), o);
      return;
    }
    const tag = tags.get(event.tag.toLowerCase());
    if (tag === undefined) return;
    const leg = event.fast === true ? LEG_MS / 2 : LEG_MS;
    if (isReader(event.from) && isServer(event.to)) {
      glow[event.from].classList.add('on');
      await ride(tag, legs[event.from], false, leg, o);
      if (o.signal.aborted) return;
      const passed = cueArg(event, 'skip');
      if (passed !== undefined && isServer(passed)) {
        fade(skip[passed], 1);
        await wait(SKIP_MS / o.speed, o.signal);
        if (o.signal.aborted) return;
      }
      pick[event.to].classList.add('on');
      await wait(PICK_MS / o.speed, o.signal);
      if (o.signal.aborted) return;
      await ride(tag, legs[event.to], false, leg, o);
    } else if (event.from === 'balancer' && isServer(event.to)) {
      await ride(tag, legs[event.to], false, leg, o);
    } else if (isServer(event.from) && event.to === 'balancer') {
      await ride(tag, legs[event.from], true, leg, o);
    } else return;
    if (o.signal.aborted) return;
    await wait(REST_MS / o.speed, o.signal);
    if (o.signal.aborted) return;
    clearMoving();
  }

  return {
    show(view) {
      // Settled means no motion: the lamps and glows change at once, not over their fades (pool.css).
      root.setAttribute('data-settling', '');
      clear();
      paint(poolOf(view));
      lightLanded(view.landed);
      void root.getBoundingClientRect();
      root.removeAttribute('data-settling');
    },
    play,
    // Nothing to let go of: a play's timers and listeners end with its signal, which the panel aborts first.
    destroy() {},
  };
}

/** The Load Balancers figure's driver. */
export const poolDriver: DriverModule = { create, duration };
