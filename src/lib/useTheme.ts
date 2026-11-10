import { useSyncExternalStore } from 'react';
import { themeInEffect, type Theme } from './theme';

/** The root element's `data-theme` is the one source of truth; every theme control subscribes to it. */
function subscribeTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

/** The server cannot know the visitor's theme. */
const noThemeOnServer = (): Theme | null => null;

/**
 * The theme in effect, kept in step with the page however it changes: the
 * applied `data-theme`, else the system preference (so with no saved choice the
 * page follows the OS). Null while server rendering and hydrating.
 *
 * It lives apart from theme.ts so that file imports no React: the site header's plain script uses it too.
 */
export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribeTheme, themeInEffect, noThemeOnServer);
}
