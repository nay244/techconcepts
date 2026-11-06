// The home hero's movement (HeroWeb.astro). Ported from the approved mockup's page script (hero-web.mjs heroJs and
// home-v6's playback): one frame of the scene is worked out from the time alone, so it can be paused, replayed or
// shown at its end. The drawing is static markup; this only moves named parts, toggles classes and sets the caption.
import type { HeroWebData } from '../art/figures/hero-web';

export interface HeroControls {
  play(): void;
  pause(): void;
  /** From the start. */
  replay(): void;
  /** Stops at once, lets go of the observer, the frame and the button, and does nothing ever after. */
  destroy(): void;
}

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
const easeOut = (x: number): number => 1 - Math.pow(1 - x, 3);
const easeIO = (x: number): number => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const fade = (t: number, t0: number, ms = 250): number => clamp01((t - t0) / ms);

// What the shuttle's tag says: the request on the way out, the reply on the way back.
const REQUEST = 'GET /';
const REPLY = '200 OK';
// The longest step one frame may take, so a tab that was hidden does not jump ahead.
const MAX_FRAME_MS = 64;

const ICON = {
  pause: '<path d="M5 3v10M11 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  play: '<path d="M5 3l8 5-8 5z" fill="currentColor"/>',
  replay:
    '<path d="M3.5 8a4.5 4.5 0 1 0 1.4-3.3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M4.6 1.8v3.2h3.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
};

function must<E extends Element>(root: ParentNode, selector: string): E {
  const el = root.querySelector<E>(selector);
  if (el === null) throw new Error(`The hero has no ${selector}.`);
  return el;
}

/**
 * Plays the hero in `root` (the element with `data-hero`) once, when its figure comes into view, and stops on the
 * last frame. Under reduced motion it shows the last frame at once, with a "Play it" button. Each caption line is
 * shown in a polite live region. Nothing is left running once it is paused, finished or torn down; a hero taken off
 * the page tears itself down on its next frame.
 */
export function startHero(root: HTMLElement): HeroControls {
  const raw = root.dataset.hero;
  if (raw === undefined) throw new Error('The hero has no data-hero.');
  const { DRAW, T, PATH, ZERO, TAG_DY, STEPS } = JSON.parse(raw) as HeroWebData;
  const figure = must<SVGSVGElement>(root, 'svg.lm-hero');
  const drawIn = [...figure.querySelectorAll<SVGGElement>('.hin')].map((el) => ({ el, at: Number(el.dataset.in) }));
  const cart = must<SVGGElement>(figure, '[data-part="cart"]');
  const tag = must<SVGGElement>(figure, '#hw-tag');
  const tagText = must<SVGTextElement>(figure, '#hw-tag-t');
  const leds = [...figure.querySelectorAll<SVGElement>('[data-part="sleds"] .lm-led')];
  const blocks = [...figure.querySelectorAll<SVGElement>('.lm-px')];
  const hud = must<HTMLElement>(root, '[data-hud]');
  const stepEl = must<HTMLElement>(hud, '[data-hud-step]');
  const textEl = must<HTMLElement>(hud, '[data-hud-text]');
  const ticks = [...hud.querySelectorAll<HTMLElement>('[data-hud-ticks] i')];
  const button = must<HTMLButtonElement>(hud, '[data-hud-play]');
  const icon = must<SVGSVGElement>(button, '[data-hud-icon]');
  const label = must<HTMLElement>(button, '[data-hud-label]');
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  // ---------- One frame, from the time alone ----------
  // Each write is skipped when it would change nothing, so a held frame touches nothing.
  const written = new WeakMap<Element, Record<string, string>>();
  function write(el: Element, what: string, value: string, apply: () => void): void {
    const seen = written.get(el) ?? {};
    if (seen[what] === value) return;
    seen[what] = value;
    written.set(el, seen);
    apply();
  }
  const setOpacity = (el: SVGElement, v: number): void => {
    const s = v.toFixed(3);
    write(el, 'opacity', s, () => (el.style.opacity = s));
  };
  const toggle = (el: Element, cls: string, on: boolean): void => write(el, cls, String(on), () => el.classList.toggle(cls, on));
  const setText = (el: Element, s: string): void => {
    if (el.textContent !== s) el.textContent = s;
  };

  // A point along the shuttle's path, u from 0 (the laptop) to 1 (the server).
  function pathAt(u: number): [number, number] {
    const f = PATH.length - 1;
    const x = clamp01(u) * f;
    const i = Math.min(f - 1, Math.floor(x));
    const w = x - i;
    const a = PATH[i]!;
    const b = PATH[i + 1]!;
    return [a[0]! + (b[0]! - a[0]!) * w, a[1]! + (b[1]! - a[1]!) * w];
  }
  function placeCart(u: number): void {
    const [x, y] = pathAt(u);
    const at = `${x.toFixed(1)} ${y.toFixed(1)}`;
    write(cart, 'transform', at, () => {
      cart.setAttribute('transform', `translate(${at})`);
      tag.setAttribute('transform', `translate(${(x + ZERO[0]!).toFixed(1)} ${(y + ZERO[1]! + TAG_DY).toFixed(1)})`);
    });
  }

  let drawnIn = false;
  function render(t: number): void {
    // The figure draws in once, part by part.
    if (!drawnIn || t < DRAW + 600) {
      for (const g of drawIn) {
        const e = easeOut(fade(t, g.at, 520));
        setOpacity(g.el, e);
        const shift = `translate(0px,${((1 - e) * 14).toFixed(1)}px)`;
        write(g.el, 'transform', shift, () => (g.el.style.transform = shift));
      }
      drawnIn = t >= DRAW + 600;
    }
    // The shuttle: out to the server with the request, a wait while the server works, then home with the reply.
    const u = t < T.req ? 0 : t < T.at ? easeIO((t - T.req) / (T.at - T.req)) : t < T.back ? 1 : t < T.home ? 1 - easeIO((t - T.back) / (T.home - T.back)) : 0;
    placeCart(u);
    // Its tag says what it carries, and hides while the server works.
    const out = t < T.back;
    setText(tagText, out ? REQUEST : REPLY);
    setOpacity(tag, out ? fade(t, T.req - 300, 300) * (1 - fade(t, T.at + 150, 250)) : fade(t, T.back - 200, 250) * (1 - fade(t, T.home + 100, 300)));
    // The server's lights flicker while it finds the page.
    leds.forEach((l, i) => toggle(l, 'on', t >= T.at && t < T.back ? Math.floor((t - T.at) / 170 + i) % 2 === 0 : true));
    // The browser draws the page block by block.
    blocks.forEach((b, i) => toggle(b, 'on', t >= T.draw + ((i + 1) / (blocks.length + 1)) * (T.done - T.draw)));
    // The caption, and the ticks: done in the accent, the current one in marigold.
    const step = t < T.req - 200 ? 0 : t < T.at ? 1 : t < T.back ? 2 : t < T.home ? 3 : t < T.done ? 4 : 5;
    const [title, line] = STEPS[step]!;
    setText(stepEl, title);
    setText(textEl, line);
    toggle(hud, 'done', step === STEPS.length - 1);
    ticks.forEach((el, i) => {
      toggle(el, 'done', step > i + 1 || step === STEPS.length - 1);
      toggle(el, 'on', step === i + 1);
    });
  }

  // ---------- Playback: once on its own, pausable, and still on the last frame ----------
  let now = 0;
  let playing = false;
  let last: number | null = null;
  let frame: ReturnType<typeof requestAnimationFrame> | null = null;
  let gone = false;
  let observer: IntersectionObserver | null = null;

  function setButton(): void {
    const mode = now >= T.end ? 'replay' : playing ? 'pause' : 'play';
    write(icon, 'icon', mode, () => (icon.innerHTML = ICON[mode]));
    const [text, name] =
      mode === 'pause'
        ? ['Pause', 'Pause the animation']
        : mode === 'play'
          ? ['Play', 'Play the animation']
          : reduced
            ? ['Play it', 'Play it from the start']
            : ['Replay', 'Replay the animation'];
    setText(label, text);
    button.setAttribute('aria-label', name);
  }

  function stopFrame(): void {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
  }
  // Once the visitor or the observer has started it, the observer has nothing more to do.
  function stopWatching(): void {
    observer?.disconnect();
    observer = null;
  }

  function tick(ts: number): void {
    frame = null;
    if (gone || !playing) return;
    if (!root.isConnected) return destroy();
    if (last !== null) now = Math.min(T.end, now + Math.min(MAX_FRAME_MS, ts - last));
    last = ts;
    render(now);
    if (now >= T.end) {
      playing = false;
      setButton();
      return;
    }
    frame = requestAnimationFrame(tick);
  }

  function play(): void {
    if (gone) return;
    stopWatching();
    if (now >= T.end) now = 0;
    playing = true;
    last = null;
    setButton();
    stopFrame();
    frame = requestAnimationFrame(tick);
  }
  function pause(): void {
    if (gone) return;
    stopWatching();
    playing = false;
    stopFrame();
    setButton();
  }
  function replay(): void {
    if (gone) return;
    now = 0;
    render(now);
    play();
  }
  function destroy(): void {
    gone = true;
    playing = false;
    stopFrame();
    stopWatching();
    button.removeEventListener('click', onClick);
  }
  function onClick(): void {
    if (playing) pause();
    else if (now >= T.end) replay();
    else play();
  }

  // ---------- Start ----------
  button.addEventListener('click', onClick);
  button.hidden = false;
  if (reduced) {
    now = T.end;
    render(now);
  } else {
    render(0);
    if (typeof IntersectionObserver === 'undefined') play();
    else {
      observer = new IntersectionObserver(
        (entries) => {
          if (observer !== null && entries.some((e) => e.isIntersecting)) play();
        },
        { threshold: 0.35 },
      );
      observer.observe(figure);
    }
  }
  setButton();

  return { play, pause, replay, destroy };
}
