// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { THEME_KEY } from '../lib/theme';
import { themeToggleLabel, wireThemeToggle } from './theme-toggle';

/** A button on the page, wired; `stops` lets each test undo its own wiring. */
const stops: (() => void)[] = [];
function wired(): HTMLButtonElement {
  const button = document.createElement('button');
  document.body.append(button);
  stops.push(wireThemeToggle(button));
  return button;
}
/** MutationObserver callbacks run after the current task. */
const settled = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  document.documentElement.dataset.theme = 'dark';
  window.localStorage.clear();
});

afterEach(() => {
  for (const stop of stops.splice(0)) stop();
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test('the label names the theme the button switches to', () => {
  expect(themeToggleLabel('dark')).toBe('Switch to light theme');
  expect(themeToggleLabel('light')).toBe('Switch to dark theme');
  expect(wired().getAttribute('aria-label')).toBe('Switch to light theme');
});

test('in the light theme it offers the dark one', () => {
  document.documentElement.dataset.theme = 'light';
  expect(wired().getAttribute('aria-label')).toBe('Switch to dark theme');
});

test('with no theme applied it follows the system preference', () => {
  delete document.documentElement.dataset.theme;
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('light'), media: q }));
  expect(wired().getAttribute('aria-label')).toBe('Switch to dark theme');
});

test('clicking flips the theme, saves it and updates the label', () => {
  const button = wired();
  button.click();
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(window.localStorage.getItem(THEME_KEY)).toBe('light');
  expect(button.getAttribute('aria-label')).toBe('Switch to dark theme');
  button.click();
  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(window.localStorage.getItem(THEME_KEY)).toBe('dark');
  expect(button.getAttribute('aria-label')).toBe('Switch to light theme');
});

test('every button on the page stays in step, and follows a change made elsewhere', async () => {
  const [first, second] = [wired(), wired()];
  second.click();
  await settled();
  expect(first.getAttribute('aria-label')).toBe('Switch to dark theme');
  expect(second.getAttribute('aria-label')).toBe('Switch to dark theme');

  document.documentElement.dataset.theme = 'dark';
  await settled();
  expect(first.getAttribute('aria-label')).toBe('Switch to light theme');
});

test('still flips the theme when localStorage throws', () => {
  vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
    throw new DOMException('blocked', 'SecurityError');
  });
  const button = wired();
  button.click();
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(button.getAttribute('aria-label')).toBe('Switch to dark theme');
});

test('once stopped, the button no longer flips the theme or follows it', async () => {
  const button = document.createElement('button');
  wireThemeToggle(button)();
  button.click();
  expect(document.documentElement.dataset.theme).toBe('dark');
  document.documentElement.dataset.theme = 'light';
  await settled();
  expect(button.getAttribute('aria-label')).toBe('Switch to light theme');
});
