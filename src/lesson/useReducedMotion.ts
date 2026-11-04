import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/** Null where there is no `matchMedia` (the server, jsdom): motion is then left on. */
function query(): MediaQueryList | null {
  return typeof window.matchMedia === 'function' ? window.matchMedia(QUERY) : null;
}

function subscribe(onChange: () => void): () => void {
  const list = query();
  list?.addEventListener('change', onChange);
  return () => list?.removeEventListener('change', onChange);
}

const getSnapshot = (): boolean => query()?.matches ?? false;
// The server cannot know the visitor's setting; the first client render corrects it.
const getServerSnapshot = (): boolean => false;

/** True while the learner has asked for less motion. Follows the setting if it changes. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
