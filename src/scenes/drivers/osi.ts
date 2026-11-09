// Only types from the drawing module: its code is for the build, and stays out of the page.
import type { OsiSceneData } from '../../art/scenes/osi';
import { OSI_STACKS } from '../../art/scenes/osi-stacks';
import type { Cue, MessageEvent, NoteEvent, SceneEvent } from '../../content/schema';
import type { DriverModule, PlayOptions, SceneDriver, SceneView } from '../driver';
import { along, animate } from '../motion';

/**
 * Moves the OSI Model figure (src/art/scenes/osi.ts), as the approved mockup's `show`, `rideTag` and `tick` do
 * (osi-watch.mjs):
 *
 * - A note's cues light blocks. `layer <place>:<n>` lights that one block, and the callout of its machine turns
 *   current. `peer <n>` lights layer n in every stack that has it (its twins: two or three blocks, the one place
 *   the figure lights more than one), and shows its dashed peer line; the lines of the step's earlier `peer` cues
 *   stay shown, so the step's lines build up. A light needs no tween: a note's play shows it at once.
 * - A message rides the cable as the lit tag, from its route's start to its end (`<from>><to>`), and stays parked
 *   there, nothing lit, until the next machine's layer 1 takes it.
 *
 * `show` draws the latest note or message of the step (`view.landed`) and the step's peer lines from scratch, and
 * writes the unit's words (`view.labels`) into the figure's empty slots. A cue or a ride the figure cannot show is a
 * mistake in the lesson: it throws, before the figure changes.
 */

type Point = [number, number, number];
type Flat = [number, number];
type Place = keyof typeof OSI_STACKS;

/** The mockup's times (ms at 1×): a layer's turn waits 1100 ms; a ride takes 1300 ms and waits 500 ms after. */
export const LIGHT_MS = 1100;
export const RIDE_MS = 1300;
export const LAND_MS = 500;

/** The highest layer: one peer line for each layer, 1 to 7. */
const LAYERS = 7;
const PLACES = Object.keys(OSI_STACKS) as Place[];

function duration(event: SceneEvent): number {
  // A table event has nothing to move, so it lands at once, with the event before it.
  if (event.type === 'table') return 0;
  return event.type === 'message' ? RIDE_MS + LAND_MS : LIGHT_MS;
}

/** A cue, read: one block (`layer`), or a layer's twins and its peer line (`peer`). */
type Read = { kind: 'layer'; place: Place; n: number } | { kind: 'peer'; n: number };

/** Reads a cue the figure shows, or throws: anything else is a mistake in the lesson. */
function readCue({ cue, arg = '' }: Cue): Read {
  if (cue === 'layer') {
    const m = /^([a-z]+):(\d)$/.exec(arg);
    const place = m?.[1] as Place | undefined;
    const n = Number(m?.[2]);
    if (place === undefined || !Object.hasOwn(OSI_STACKS, place) || n < 1 || n > OSI_STACKS[place]) {
      throw new Error(`The OSI figure's layer cue needs "<place>:<n>" for a block it has, not "${arg}".`);
    }
    return { kind: 'layer', place, n };
  }
  if (cue === 'peer') {
    if (!/^\d$/.test(arg) || Number(arg) < 1 || Number(arg) > LAYERS) throw new Error(`The OSI figure's peer cue needs a layer from 1 to ${LAYERS}, not "${arg}".`);
    return { kind: 'peer', n: Number(arg) };
  }
  throw new Error(`The OSI figure has no "${cue}" cue.`);
}

/** A block: its group, which takes `on`, and its one slab, which takes the kit's lit state (`data-lit`). */
interface Block {
  group: SVGElement;
  solid: SVGElement;
}

/** What the figure shows at a moment, worked out before anything is drawn. */
interface Picture {
  lit: Block[];
  focus: SVGElement[];
  lines: SVGElement[];
  /** Where the tag is parked on screen, or null when it is hidden. */
  tag: Flat | null;
}

function create(root: SVGSVGElement, data: unknown): SceneDriver {
  // Drawn by drawOsi() at build time, beside this figure.
  const d = data as OsiSceneData;
  const { M, O } = d;
  const part = <T extends SVGElement = SVGElement>(id: string): T => {
    const found = root.querySelector<T>(`#${id}`);
    if (found === null) throw new Error(`The OSI figure has no #${id}.`);
    return found;
  };
  /** Each block by place and layer, `laptop:4`. */
  const blocks = new Map<string, Block>();
  for (const place of PLACES) {
    for (let n = 1; n <= OSI_STACKS[place]; n++) {
      const group = part(`osi-L-${place}-${n}`);
      const solid = group.querySelector<SVGElement>('.iso-solid');
      if (solid === null) throw new Error(`The OSI figure's block #osi-L-${place}-${n} has no slab.`);
      blocks.set(`${place}:${n}`, { group, solid });
    }
  }
  const lines = Array.from({ length: LAYERS }, (_, i) => part(`osi-peer-${i + 1}`));
  const calls = new Map(PLACES.map((place) => [place, part(`osi-call-${place}`)]));
  const tag = part('osi-tag');
  const slots = [...root.querySelectorAll<SVGElement>('[data-label]')];

  const [ax, bx, cx, ay, by, cy] = M as [number, number, number, number, number, number];
  /** A point of the plate on screen, in the figure's own coordinates. */
  const flatOf = ([x, y, z]: Point): Flat => [O[0] + ax * x + bx * y + cx * z, O[1] + ay * x + by * y + cy * z];
  /** A cable ride on screen, start then end. */
  function rideOf(e: MessageEvent): Flat[] {
    const name = `${e.from}>${e.to}`;
    if (!Object.hasOwn(d.routes, name)) throw new Error(`The OSI figure has no cable ride ${name}.`);
    return d.routes[name as keyof OsiSceneData['routes']].map(flatOf);
  }

  /** The twins of layer `n`: its block in every stack that has it. */
  const twins = (n: number): Block[] => PLACES.flatMap((place) => blocks.get(`${place}:${n}`) ?? []);

  /**
   * The figure once `landed` has landed, with `cues` played: the cues of the current step's `peer` events show their
   * lines; a landed note lights what its own cues say; a landed message is parked at the end of its cable.
   */
  function pictureOf(cues: readonly (Cue & { current: boolean })[], landed: MessageEvent | NoteEvent | null): Picture {
    const shown = new Set<number>();
    for (const c of cues) {
      const read = readCue(c);
      if (c.current && read.kind === 'peer') shown.add(read.n);
    }
    const picture: Picture = { lit: [], focus: [], lines: [...shown].map((n) => lines[n - 1]!), tag: null };
    if (landed?.type === 'message') return { ...picture, tag: rideOf(landed).at(-1)! };
    for (const read of (landed?.cues ?? []).map(readCue)) {
      if (read.kind === 'layer') {
        picture.lit.push(blocks.get(`${read.place}:${read.n}`)!);
        picture.focus.push(calls.get(read.place)!);
      } else picture.lit.push(...twins(read.n));
    }
    return picture;
  }

  const fade = (el: SVGElement, opacity: number): void => {
    el.style.opacity = String(opacity);
  };
  /** The tag is drawn at the plate's origin: it is moved from there to `at`. */
  function place(at: Flat): void {
    tag.setAttribute('transform', `translate(${(at[0] - O[0]).toFixed(2)} ${(at[1] - O[1]).toFixed(2)})`);
  }
  function light(b: Block, on: boolean): void {
    b.group.classList.toggle('on', on);
    if (on) b.solid.setAttribute('data-lit', '');
    else b.solid.removeAttribute('data-lit');
  }

  /** Nothing lit, no peer line, no callout current, and the tag hidden at the origin. */
  function clear(): void {
    for (const b of blocks.values()) light(b, false);
    for (const line of lines) line.classList.remove('on');
    for (const call of calls.values()) call.classList.remove('focus');
    fade(tag, 0);
    tag.removeAttribute('transform');
  }

  function paint(p: Picture): void {
    for (const b of p.lit) light(b, true);
    for (const line of p.lines) line.classList.add('on');
    for (const call of p.focus) call.classList.add('focus');
    if (p.tag !== null) {
      fade(tag, 1);
      place(p.tag);
    }
  }

  async function play(event: SceneEvent, view: SceneView, o: PlayOptions): Promise<void> {
    // Aborted before it starts: the panel's show has settled the figure already, and has the last word.
    if (o.signal.aborted) return;
    // The figure has no table to show.
    if (event.type === 'table') return;
    // Worked out first, so an event the figure cannot show fails before anything moves.
    const cues = [...view.cues, ...(event.cues ?? []).map((c) => ({ ...c, current: true }))];
    const end = pictureOf(cues, event);
    clear();
    if (event.type === 'note') {
      paint(end);
      return;
    }
    // The tag sets off from the start of its cable, and rides it at an even pace, as the mockup's `rideTag`.
    const ride = rideOf(event);
    paint({ ...end, tag: ride[0]! });
    await animate(RIDE_MS / o.speed, (k) => place(along(ride, k)), o);
  }

  return {
    show(view) {
      // Settled means no motion: the peer lines change at once, not over their fade.
      // The browser takes the new styles while data-settling turns the fades off (osi.css);
      // after that they are back on, so a play still fades its lines in.
      // Everything show paints is worked out first, so a mistake in the lesson throws before the figure changes.
      const picture = pictureOf(view.cues, view.landed);
      const words = slots.map((slot) => {
        const key = slot.getAttribute('data-label')!;
        return Object.hasOwn(view.labels, key) ? view.labels[key]! : '';
      });
      root.setAttribute('data-settling', '');
      try {
        slots.forEach((slot, i) => (slot.textContent = words[i]!));
        clear();
        paint(picture);
        void root.getBoundingClientRect();
      } finally {
        // Whatever happens, the fades come back on.
        root.removeAttribute('data-settling');
      }
    },
    play,
    // Nothing to let go of: a play's frames and listeners end with its signal, which the panel aborts first.
    destroy() {},
  };
}

/** The OSI Model figure's driver. */
export const osiDriver: DriverModule = { create, duration };
