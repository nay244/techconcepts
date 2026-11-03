import { useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { createSafeStorage } from '../lib/storage';
import { THEME_KEY, applyTheme, readAppliedTheme } from '../lib/theme';
import type { Theme } from '../lib/theme';
import './ThemeToggle.css';

// Created at module scope, which is safe: the default backing store is only
// touched when a button is pressed, never while rendering on the server.
const storage = createSafeStorage();

/**
 * The root element's `data-theme` is the single source of truth. Every toggle
 * on the page (header, footer and later the lesson top bar) subscribes to it,
 * so they stay in sync however the theme changed.
 */
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

// The server cannot know the visitor's theme. The pressed look is therefore
// also keyed to the root attribute in ThemeToggle.css, so there is no flash
// before this island hydrates.
const getServerSnapshot = (): Theme | null => null;

const OPTIONS: { value: Theme; label: string; icon: ReactNode }[] = [
  {
    value: 'light',
    label: 'Light',
    icon: (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
        <circle cx="8" cy="8" r="3" fill="currentColor" />
        <path
          d="M8 1.5v1.8M8 12.7v1.8M1.5 8h1.8M12.7 8h1.8M3.4 3.4l1.3 1.3M11.3 11.3l1.3 1.3M3.4 12.6l1.3-1.3M11.3 4.7l1.3-1.3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
        <path d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8Z" fill="currentColor" />
      </svg>
    ),
  },
];

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readAppliedTheme, getServerSnapshot);

  function choose(next: Theme): void {
    applyTheme(next);
    storage.set(THEME_KEY, next);
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      {OPTIONS.map(({ value, label, icon }) => (
        <button key={value} type="button" data-theme-value={value} aria-pressed={theme === value} onClick={() => choose(value)}>
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
