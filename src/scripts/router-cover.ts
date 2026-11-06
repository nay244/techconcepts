// The Networking cover's packets (NetworkingCover.astro). Ported from the approved mockup's routerLive (FIGS
// lumen-assets.mjs): a click, Enter or Space sends three packets along the cable into the router, each counted as it
// arrives while the router's lights flash. The drawing is static markup; this only moves the packets, toggles the
// lights and sets the count.

export interface RouterCover {
  /** Sends three more packets. */
  send(): void;
  /** Stops at once, lets go of the observer, the frame and the stage, and does nothing ever after. */
  destroy(): void;
}

const LABEL = 'Click to send packets';
// Seconds: one packet's trip along the cable, the wait before the next leaves, and how long the lights flash.
const TRIP = 1.8;
const GAP = 0.5;
const FLASH = 0.45;
// The longest step one frame may take, so a tab that was hidden does not jump ahead.
const MAX_FRAME = 0.05;
const PER_SEND = 3;

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
const easeIO = (x: number): number => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function must<E extends Element>(root: ParentNode, selector: string): E {
  const el = root.querySelector<E>(selector);
  if (el === null) throw new Error(`The router cover has no ${selector}.`);
  return el;
}

/**
 * Makes the cover in `root` (the element with `data-router-cover`, the packets' path as JSON) a button that sends
 * packets, and shows its hint and count. It runs only while something is moving and the cover is on screen (or near
 * it). Under reduced motion, as routerLive does, the packets do not travel: they are counted at once and the lights
 * flash once, briefly. The count is a polite live region. A cover taken off the page tears itself down on its next
 * frame.
 */
export function startRouterCover(root: HTMLElement): RouterCover {
  const raw = root.dataset.routerCover;
  if (raw === undefined) throw new Error('The router cover has no data-router-cover path.');
  const path = JSON.parse(raw) as number[][];
  const stage = must<HTMLElement>(root, '[data-stage]');
  const hint = must<HTMLElement>(root, '[data-hint]');
  const readout = must<HTMLElement>(root, '[data-readout]');
  const packets = [...root.querySelectorAll<SVGGElement>('.lm-pkt')];
  const leds = [...root.querySelectorAll<SVGElement>('[data-part="rleds"] .lm-led')];
  const calm = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');

  // ---------- One step of the packets ----------
  const flights: Array<{ el: SVGGElement; u: number }> = [];
  let queue = 0;
  let gap = 0;
  let count = 0;
  let flash = 0;

  function report(): void {
    const text = `${count} ${count === 1 ? 'packet' : 'packets'} received`;
    if (readout.textContent !== text) readout.textContent = text;
  }
  // A packet at u along the cable (0 the modem, 1 the router): it fades in as it leaves and shrinks into the port.
  function place(el: SVGGElement, u: number): void {
    const f = path.length - 1;
    const i = Math.min(f - 1, Math.floor(u * f));
    const w = u * f - i;
    const a = path[i]!;
    const b = path[i + 1]!;
    const end = clamp01((u - 0.92) / 0.08);
    const x = a[0]! + (b[0]! - a[0]!) * w;
    const y = a[1]! + (b[1]! - a[1]!) * w;
    el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(1 - 0.6 * end).toFixed(3)})`);
    el.style.opacity = (Math.min(1, u / 0.05) * (1 - end)).toFixed(3);
  }
  function arrived(): void {
    count++;
    flash = FLASH;
    report();
  }
  const busy = (): boolean => queue > 0 || flights.length > 0 || flash > 0;

  function step(dt: number, reduced: boolean): void {
    // Reduced motion: no travel, the packets simply arrive.
    if (reduced && (queue > 0 || flights.length > 0)) {
      count += queue + flights.length;
      queue = 0;
      for (const f of flights.splice(0)) f.el.style.opacity = '0';
      flash = FLASH;
      report();
    }
    if (queue > 0 && (gap -= dt) <= 0) {
      const el = packets.find((p) => !flights.some((f) => f.el === p));
      if (el !== undefined) {
        flights.push({ el, u: 0 });
        queue--;
        gap = GAP;
      }
    }
    for (const f of [...flights]) {
      f.u += dt / TRIP;
      if (f.u >= 1) {
        f.el.style.opacity = '0';
        flights.splice(flights.indexOf(f), 1);
        arrived();
      } else place(f.el, easeIO(f.u));
    }
    flash = Math.max(0, flash - dt);
    // The first light is always on; while a packet comes in, the second and one of the last three flash with it.
    leds.forEach((l, i) => l.classList.toggle('on', i === 0 || (flash > 0 && (i === 1 || i === 2 + (count % 3)))));
  }

  // ---------- The loop: only while something is moving, and only while the cover is seen ----------
  let frame: ReturnType<typeof requestAnimationFrame> | null = null;
  let last: number | null = null;
  let seen = typeof IntersectionObserver === 'undefined';
  let gone = false;
  let observer: IntersectionObserver | null = null;

  function tick(now: number): void {
    frame = null;
    if (gone) return;
    if (!root.isConnected) return destroy();
    const dt = last === null ? 1 / 60 : Math.min(MAX_FRAME, (now - last) / 1000);
    last = now;
    step(dt, calm?.matches ?? false);
    if (busy() && seen) frame = requestAnimationFrame(tick);
  }
  function kick(): void {
    if (gone || frame !== null || !seen || !busy()) return;
    last = null;
    frame = requestAnimationFrame(tick);
  }

  function send(): void {
    if (gone) return;
    queue += PER_SEND;
    gap = 0;
    kick();
  }
  function onKey(e: KeyboardEvent): void {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    // Space would scroll the page.
    e.preventDefault();
    send();
  }
  function destroy(): void {
    gone = true;
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    observer?.disconnect();
    observer = null;
    stage.removeEventListener('click', send);
    stage.removeEventListener('keydown', onKey);
  }

  // ---------- Start ----------
  stage.setAttribute('role', 'button');
  stage.setAttribute('tabindex', '0');
  stage.setAttribute('aria-label', LABEL);
  stage.addEventListener('click', send);
  stage.addEventListener('keydown', onKey);
  hint.hidden = false;
  readout.hidden = false;
  report();
  if (!seen) {
    observer = new IntersectionObserver(
      (entries) => {
        if (gone) return;
        seen = entries[entries.length - 1]!.isIntersecting;
        if (seen) kick();
      },
      { rootMargin: '80px' },
    );
    observer.observe(root);
  }

  return { send, destroy };
}
