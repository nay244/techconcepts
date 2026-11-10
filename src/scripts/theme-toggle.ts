// The theme button in the site header (SiteHeader.astro), on every page but the lesson. It runs without React, so a
// page whose only moving part is this button loads no framework. The lesson console's button is the React one
// (src/components/ThemeToggle.tsx); both read and write the same two things: the root element's data-theme and the
// saved choice.
import { createSafeStorage, type SafeStorage } from '../lib/storage';
import { THEME_KEY, applyTheme, themeInEffect, type Theme } from '../lib/theme';

/** The button's label names the theme it switches to. */
export function themeToggleLabel(theme: Theme): string {
  return theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
}

/**
 * Makes `button` flip the theme and save the choice, and keeps its label in step with the page's theme however it
 * changes (another button, another script). Returns a function that stops it.
 */
export function wireThemeToggle(button: HTMLElement, storage: SafeStorage = createSafeStorage()): () => void {
  const relabel = (): void => button.setAttribute('aria-label', themeToggleLabel(themeInEffect()));
  const flip = (): void => {
    // Unknown counts as dark, as it does for the page.
    const next: Theme = themeInEffect() === 'light' ? 'dark' : 'light';
    applyTheme(next);
    // A blocked or full storage only means the choice is not remembered: the page still switches.
    storage.set(THEME_KEY, next);
    relabel();
  };
  // The root element's data-theme is the one source of truth, so a change made anywhere relabels the button.
  const observer = new MutationObserver(relabel);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  button.addEventListener('click', flip);
  relabel();
  return () => {
    observer.disconnect();
    button.removeEventListener('click', flip);
  };
}
