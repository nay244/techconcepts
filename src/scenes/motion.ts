/** Helpers the scene drivers move their parts with. */

/**
 * The point `t` of the way along a path of straight segments, measured by
 * length: 0 is the first point, 1 the last. `t` outside 0 to 1 is held at the
 * ends. Throws a RangeError for a path with no points.
 */
export function along(path: [number, number][], t: number): [number, number] {
  if (path.length === 0) throw new RangeError('A path needs at least one point.');
  const lengths = path.slice(1).map(([x, y], i) => Math.hypot(x - path[i]![0], y - path[i]![1]));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let left = Math.min(Math.max(t, 0), 1) * total;
  for (const [i, length] of lengths.entries()) {
    if (left <= length && length > 0) {
      const [[x0, y0], [x1, y1]] = [path[i]!, path[i + 1]!];
      const f = left / length;
      return [x0 + (x1 - x0) * f, y0 + (y1 - y0) * f];
    }
    left -= length;
  }
  const [x, y] = path.at(-1)!;
  return [x, y];
}

/** Cubic ease in and out, as the mockups move their tags: slow at both ends. `t` is held between 0 and 1. */
export function easeInOut(t: number): number {
  const x = Math.min(Math.max(t, 0), 1);
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
}

/**
 * Calls `frame(k)` once an animation frame, with `k` running from 0 to 1 over
 * `ms`, and resolves after `frame(1)`. It never rejects.
 *
 * - Under reduced motion, or with no time to take, it skips straight to
 *   `frame(1)` and resolves at once.
 * - An abort during the tween ends it on `frame(1)`, inside the abort itself,
 *   and resolves; nothing is called after that. The abort comes before the
 *   panel's `show`, so `show` has the last word.
 * - Started on a signal that is already aborted, it calls nothing and resolves
 *   at once: `show` has already settled the figure, and must not be painted over.
 */
export function animate(ms: number, frame: (k: number) => void, o: { reducedMotion: boolean; signal: AbortSignal }): Promise<void> {
  const { reducedMotion, signal } = o;
  if (signal.aborted) return Promise.resolve();
  if (reducedMotion || !(ms > 0)) {
    frame(1);
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const start = performance.now();
    let request = requestAnimationFrame(tick);

    function finish(): void {
      signal.removeEventListener('abort', abort);
      frame(1);
      resolve();
    }
    function abort(): void {
      cancelAnimationFrame(request);
      finish();
    }
    function tick(now: number): void {
      const k = Math.min(Math.max((now - start) / ms, 0), 1);
      if (k === 1) return finish();
      frame(k);
      request = requestAnimationFrame(tick);
    }

    signal.addEventListener('abort', abort);
  });
}

/**
 * Resolves after `ms`, or at once when `signal` aborts first, and it never rejects. Unlike a tween it also waits
 * under reduced motion, so a step keeps its pace.
 *
 * - Started on a signal that is already aborted, it sets no timer and resolves at once.
 * - An abort during the wait clears its timer and resolves.
 */
export function wait(ms: number, signal: AbortSignal): Promise<void> {
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
