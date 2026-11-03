/**
 * The only door to browser storage. Every access is wrapped so the site works
 * the same when storage is blocked, missing or full: reads give null, writes
 * give false, and nothing ever throws into the page.
 */
export interface SafeStorage {
  /** False once storage cannot be reached or has failed a read or write. */
  readonly available: boolean;
  get(key: string): string | null;
  /** True only when the value was actually stored. */
  set(key: string, value: string): boolean;
  remove(key: string): void;
}

/**
 * `backing` is called on every operation rather than once, so merely creating
 * a SafeStorage never touches `window` (it is safe during server rendering)
 * and a blocked `window.localStorage` getter is caught each time it throws.
 */
export function createSafeStorage(backing: () => Storage | undefined = () => window.localStorage): SafeStorage {
  // Set when any operation throws, e.g. a read denied or a write over quota.
  let failed = false;

  function open(): Storage | undefined {
    try {
      return backing() ?? undefined;
    } catch {
      failed = true;
      return undefined;
    }
  }

  return {
    get available() {
      return !failed && open() !== undefined;
    },
    get(key) {
      try {
        return open()?.getItem(key) ?? null;
      } catch {
        failed = true;
        return null;
      }
    },
    set(key, value) {
      try {
        const store = open();
        if (!store) return false;
        store.setItem(key, value);
        return true;
      } catch {
        failed = true;
        return false;
      }
    },
    remove(key) {
      try {
        open()?.removeItem(key);
      } catch {
        failed = true;
      }
    },
  };
}
