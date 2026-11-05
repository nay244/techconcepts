import { useSyncExternalStore } from 'react';
import { createSafeStorage } from '../lib/storage';
import { THEME_KEY, applyTheme, readAppliedTheme } from '../lib/theme';
import type { Theme } from '../lib/theme';
import './ThemeToggle.css';

// Created at module scope, which is safe: the default backing store is only
// touched when the button is pressed, never while rendering on the server.
const storage = createSafeStorage();

/**
 * The root element's `data-theme` is the single source of truth. Every toggle
 * on the page subscribes to it, so they stay in sync however the theme changed.
 */
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

/** The theme in force: the one applied to the page, else the system preference (dark when unknown). */
function currentTheme(): Theme {
  const applied = readAppliedTheme();
  if (applied) return applied;
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

// The server cannot know the visitor's theme. The icon is keyed to the root
// attribute in ThemeToggle.css, so it is right before this island hydrates.
const getServerSnapshot = (): Theme | null => null;

/** The mockups' 40 x 40 icon button: a moon in the light theme, a sun in the dark one. */
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, currentTheme, getServerSnapshot);

  function flip(): void {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storage.set(THEME_KEY, next);
  }

  // The label names the theme the button switches to. Before hydration it is neutral.
  const label = theme === null ? 'Switch theme' : theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button type="button" className="icon-btn theme-toggle" aria-label={label} onClick={flip}>
      <svg className="i-moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
      <svg className="i-sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
