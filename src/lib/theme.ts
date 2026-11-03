export type Theme = 'light' | 'dark';

export const THEME_KEY = 'techconcepts:theme';

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

/** A saved choice wins; anything else follows the operating system. */
export function resolveTheme(saved: string | null, prefersDark: boolean): Theme {
  if (isTheme(saved)) return saved;
  return prefersDark ? 'dark' : 'light';
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

/**
 * Inline `<head>` script that applies the theme before first paint, so there is
 * no flash of the wrong theme. It cannot import anything, so it repeats the
 * resolveTheme rule, and it wraps every access: a blocked `window.localStorage`
 * getter throws, and so can `matchMedia`. Browsers that report no preference
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
