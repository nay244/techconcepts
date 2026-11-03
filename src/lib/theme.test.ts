// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { THEME_KEY, applyTheme, readAppliedTheme, resolveTheme, themeBootScript } from './theme';

test.each([
  ['light', true, 'light'],
  ['dark', false, 'dark'],
  [null, true, 'dark'],
  [null, false, 'light'],
  ['bogus', true, 'dark'],
] as const)('resolveTheme(%s, %s) = %s', (saved, prefersDark, expected) => {
  expect(resolveTheme(saved, prefersDark)).toBe(expected);
});

test('the theme key is namespaced', () => {
  expect(THEME_KEY).toBe('techconcepts:theme');
});

test('applyTheme sets data-theme on the root element', () => {
  applyTheme('light');
  expect(document.documentElement.dataset.theme).toBe('light');
  applyTheme('dark');
  expect(document.documentElement.dataset.theme).toBe('dark');
});

test('readAppliedTheme returns the applied theme, or null when unset or bogus', () => {
  delete document.documentElement.dataset.theme;
  expect(readAppliedTheme()).toBeNull();
  document.documentElement.dataset.theme = 'bogus';
  expect(readAppliedTheme()).toBeNull();
  applyTheme('light');
  expect(readAppliedTheme()).toBe('light');
});

// The boot script runs inline in <head>, before the app code exists, so it is
// tested by executing the exact string the layout will inline.
function runBootScript(): void {
  (0, eval)(themeBootScript);
}

function stubMatchMedia(prefersLight: boolean): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('light') ? prefersLight : !prefersLight,
    media: query,
  }));
}

beforeEach(() => {
  delete document.documentElement.dataset.theme;
  window.localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

test('boot script applies a saved theme', () => {
  stubMatchMedia(false);
  window.localStorage.setItem(THEME_KEY, 'light');
  runBootScript();
  expect(document.documentElement.dataset.theme).toBe('light');
});

test('boot script follows the OS when nothing is saved', () => {
  stubMatchMedia(true);
  runBootScript();
  expect(document.documentElement.dataset.theme).toBe('light');
  stubMatchMedia(false);
  runBootScript();
  expect(document.documentElement.dataset.theme).toBe('dark');
});

test('boot script ignores a bogus saved value', () => {
  stubMatchMedia(true);
  window.localStorage.setItem(THEME_KEY, 'neon');
  runBootScript();
  expect(document.documentElement.dataset.theme).toBe('light');
});

test('boot script is dark by default when the browser has no matchMedia', () => {
  vi.stubGlobal('matchMedia', undefined);
  runBootScript();
  expect(document.documentElement.dataset.theme).toBe('dark');
});

test('boot script survives window.localStorage throwing on access', () => {
  stubMatchMedia(true);
  vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
    throw new DOMException('blocked', 'SecurityError');
  });
  expect(runBootScript).not.toThrow();
  expect(document.documentElement.dataset.theme).toBe('light');
});
