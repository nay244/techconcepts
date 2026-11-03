import { useCallback, useEffect, useRef, useState } from 'react';
import { createSafeStorage } from '../lib/storage';
import type { SafeStorage } from '../lib/storage';
import { PROGRESS_KEY, clearProgress, emptyProgress, loadProgress, sanitizeProgress, saveProgress } from './store';
import type { ProgressData } from './store';

// Shared by every island on the page. Creating it never touches `window`, so
// importing this module is safe while the page is rendered on the server.
const defaultStorage = createSafeStorage();

export interface UseProgress {
  /** False until the island has mounted, so the server render shows no progress. */
  ready: boolean;
  /** False when browser storage is blocked or full; progress features should then stay hidden. */
  available: boolean;
  data: ProgressData;
  /** Applies `fn` to the saved progress and stores the result. */
  update(fn: (d: ProgressData) => ProgressData): void;
  reset(): void;
}

type Snapshot = Pick<UseProgress, 'ready' | 'available' | 'data'>;

/**
 * Browser-only learning progress. `known` maps each lesson key to its last step
 * (`{ [entry.key]: entry.maxPosition }`); saved records for other lessons are
 * ignored and saved positions are clamped to it. It is read when progress loads
 * or changes, so passing a fresh object each render is fine.
 *
 * `storage` is for tests and must be the same object on every render; callers use the default.
 */
export function useProgress(known: Record<string, number>, storage: SafeStorage = defaultStorage): UseProgress {
  const [snapshot, setSnapshot] = useState<Snapshot>(() => ({ ready: false, available: false, data: emptyProgress() }));

  const knownRef = useRef(known);
  // Declared before the effect below so effects that run after it see the latest `known`.
  useEffect(() => {
    knownRef.current = known;
  });

  useEffect(() => {
    // `available` is read after the load, so a read that failed counts.
    const load = () => {
      const data = sanitizeProgress(loadProgress(storage), knownRef.current);
      setSnapshot({ ready: true, available: storage.available, data });
    };
    const onStorage = (event: StorageEvent) => {
      // A null key means another tab cleared all of storage.
      if (event.key === null || event.key === PROGRESS_KEY) load();
    };
    load();
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [storage]);

  const update = useCallback(
    (fn: (d: ProgressData) => ProgressData) => {
      // Start from what is stored now, which may be newer than this island's copy.
      const base = sanitizeProgress(loadProgress(storage), knownRef.current);
      const data = sanitizeProgress(fn(base), knownRef.current);
      saveProgress(storage, data);
      setSnapshot((prev) => ({ ...prev, available: storage.available, data }));
    },
    [storage],
  );

  const reset = useCallback(() => {
    clearProgress(storage);
    setSnapshot((prev) => ({ ...prev, available: storage.available, data: emptyProgress() }));
  }, [storage]);

  return { ...snapshot, update, reset };
}
