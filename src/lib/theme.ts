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

/** The theme in effect: the one applied to the page, else the system's (light when unknown). */
export function themeInEffect(): Theme {
  const applied = readAppliedTheme();
  if (applied !== null) return applied;
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/**
 * Inline `<head>` script that applies the theme before first paint, so there is
 * no flash of the wrong theme. It cannot import anything, so it holds the whole rule itself (a
 * saved choice wins, anything else follows the system), and it wraps every access: a blocked
 * `window.localStorage` getter throws, and so can `matchMedia`. Browsers that state no preference
 * (or have no matchMedia) get light, matching the CSS in tokens.ts, where light is the root's own block.
 */
export const themeBootScript = `(function () {
  var saved = null;
  try { saved = window.localStorage.getItem(${JSON.stringify(THEME_KEY)}); } catch (e) {}
  var prefersDark = false;
  try { prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches; } catch (e) {}
  var theme = saved === "light" || saved === "dark" ? saved : prefersDark ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
})();`;
