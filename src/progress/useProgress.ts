import { useCallback, useEffect, useRef, useState } from 'react';
import { createSafeStorage } from '../lib/storage';
import type { SafeStorage } from '../lib/storage';
import { LEGACY_PROGRESS_KEY, PROGRESS_KEY, clearProgress, emptyProgress, loadProgress, mergeProgress, sanitizeProgress, saveProgress } from './store';
import type { ProgressData } from './store';

// Shared by every island on the page. Creating it never touches `window`, so
// importing this module is safe while the page is rendered on the server.
const defaultStorage = createSafeStorage();

/**
 * The browser's `storage` event only reaches other documents, so a change made
 * here is announced on `window` for the other islands in this document. It is
 * a window event rather than module state so it works even if the module ends
 * up bundled more than once.
 */
const CHANGED_EVENT = 'techconcepts:progress-changed';

/** Every instance, the one that made the change included, then shows what is now in storage. */
function announce(): void {
  window.dispatchEvent(new Event(CHANGED_EVENT));
}

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
 * Browser-only learning progress. `known` maps each lesson key (its slug) to its last step
 * (`{ [entry.key]: entry.maxPosition }`). Saved positions of those lessons are
 * clamped to it. Saved records for other lessons (not in `known`)
 * stay in `data` as they are and are never dropped: `update` leaves them in storage exactly as they
 * were, and `reset` is the only thing that clears them. `known` is read when progress
 * loads or changes, so passing a fresh object each render is fine.
 *
 * Every instance in the document (and in other tabs) reloads when one of them
 * updates or resets, so islands on the same page never disagree.
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
      // A null key means another tab cleared all of storage. The old key counts: an old tab may still write it.
      if (event.key === null || event.key === PROGRESS_KEY || event.key === LEGACY_PROGRESS_KEY) load();
    };
    load();
    window.addEventListener('storage', onStorage);
    window.addEventListener(CHANGED_EVENT, load);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(CHANGED_EVENT, load);
    };
  }, [storage]);

  const update = useCallback(
    (fn: (d: ProgressData) => ProgressData) => {
      const known = knownRef.current;
      // Start from what is stored now, which may be newer than this island's copy.
      const stored = loadProgress(storage);
      // `fn` sees and changes only the lessons it was given...
      const next = sanitizeProgress(fn(sanitizeProgress(stored, known)), known);
      // ...and every other saved lesson is written back as it was.
      saveProgress(storage, mergeProgress(stored, next, known));
      announce();
    },
    [storage],
  );

  const reset = useCallback(() => {
    clearProgress(storage);
    announce();
  }, [storage]);

  return { ...snapshot, update, reset };
}
