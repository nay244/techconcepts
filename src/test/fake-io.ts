/**
 * An IntersectionObserver a test drives, to stand in for the browser's with `vi.stubGlobal('IntersectionObserver',
 * FakeObserver)`. Every one made is kept in `FakeObserver.all` (empty it before each test), with its options, the
 * targets it observes and whether it is still connected. Nothing is ever in view until the test says so.
 */
export class FakeObserver {
  static all: FakeObserver[] = [];
  targets: Element[] = [];
  connected = true;
  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    FakeObserver.all.push(this);
  }
  observe(target: Element): void {
    this.targets.push(target);
  }
  unobserve(): void {}
  disconnect(): void {
    this.connected = false;
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

/**
 * Tells each connected observer whether its targets are in view, all of them at once. `late`: also the disconnected
 * ones, as a callback the browser had already queued would.
 */
export function view(seen = true, { late = false } = {}): void {
  for (const o of FakeObserver.all.filter((x) => late || x.connected)) {
    const entries = o.targets.map((target) => ({ target, isIntersecting: seen, intersectionRatio: seen ? 1 : 0 }) as unknown as IntersectionObserverEntry);
    o.callback(entries, o as unknown as IntersectionObserver);
  }
}
