import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

export const THEME_KEY = 'techconcepts:theme';

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

/** Sets the theme on the root element, where the CSS tokens are keyed. */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

/** The theme currently applied to the page, or null before anything set it. */
export function readAppliedTheme(): Theme | null {
  const value = document.documentElement.dataset.theme;
  return isTheme(value) ? value : null;
}

/** The root element's `data-theme` is the one source of truth; every theme control subscribes to it. */
function subscribeTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

/** The theme in effect: the one applied to the page, else the system's (dark when unknown). */
function themeInEffect(): Theme {
  const applied = readAppliedTheme();
  if (applied !== null) return applied;
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

/** The server cannot know the visitor's theme. */
const noThemeOnServer = (): Theme | null => null;

/**
 * The theme in effect, kept in step with the page however it changes: the
 * applied `data-theme`, else the system preference (so with no saved choice the
 * page follows the OS). Null while server rendering and hydrating.
 */
export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribeTheme, themeInEffect, noThemeOnServer);
}

/**
 * Inline `<head>` script that applies the theme before first paint, so there is
 * no flash of the wrong theme. It cannot import anything, so it holds the whole rule itself (a
 * saved choice wins, anything else follows the system), and it wraps every access: a blocked
 * `window.localStorage` getter throws, and so can `matchMedia`. Browsers that report no preference
 * (or have no matchMedia) get dark, matching the CSS fallback in tokens.ts.
 */
export const themeBootScript = `(function () {
  var saved = null;
  try { saved = window.localStorage.getItem(${JSON.stringify(THEME_KEY)}); } catch (e) {}
  var prefersDark = true;
  try { prefersDark = !window.matchMedia("(prefers-color-scheme: light)").matches; } catch (e) {}
  var theme = saved === "light" || saved === "dark" ? saved : prefersDark ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
})();`;
