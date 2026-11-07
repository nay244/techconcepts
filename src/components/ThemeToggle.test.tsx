// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { THEME_KEY } from '../lib/theme';
import ThemeToggle from './ThemeToggle';

beforeEach(() => {
  document.documentElement.dataset.theme = 'dark';
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test('its label names the theme it switches to', () => {
  render(<ThemeToggle />);
  expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
});

test('in the light theme it offers the dark one', () => {
  document.documentElement.dataset.theme = 'light';
  render(<ThemeToggle />);
  expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument();
});

test('with no theme applied it follows the system preference', () => {
  delete document.documentElement.dataset.theme;
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('light'), media: q }));
  render(<ThemeToggle />);
  expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument();
});

test('clicking flips the theme, saves it and updates the label', async () => {
  const user = userEvent.setup();
  render(<ThemeToggle />);
  await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(window.localStorage.getItem(THEME_KEY)).toBe('light');
  await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(window.localStorage.getItem(THEME_KEY)).toBe('dark');
});

test('every toggle on the page stays in sync', async () => {
  const user = userEvent.setup();
  render(
    <>
      <ThemeToggle />
      <ThemeToggle />
    </>,
  );
  await user.click(screen.getAllByRole('button')[1]);
  expect(screen.getAllByRole('button', { name: 'Switch to dark theme' })).toHaveLength(2);
});

test('follows a theme change made outside the component', async () => {
  render(<ThemeToggle />);
  await act(async () => {
    document.documentElement.dataset.theme = 'light';
    await Promise.resolve();
  });
  expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument();
});

test('still flips the theme when localStorage throws', async () => {
  const user = userEvent.setup();
  vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
    throw new DOMException('blocked', 'SecurityError');
  });
  render(<ThemeToggle />);
  await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument();
});

test('server-renders without warnings, then hydrates to the applied theme', async () => {
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  const container = document.createElement('div');
  container.innerHTML = renderToString(<ThemeToggle />);
  document.body.append(container);

  document.documentElement.dataset.theme = 'light';
  let root!: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, <ThemeToggle />);
  });
  expect(container.querySelector('button')).toHaveAttribute('aria-label', 'Switch to dark theme');
  expect(errors).not.toHaveBeenCalled();

  act(() => root.unmount());
  container.remove();
});
