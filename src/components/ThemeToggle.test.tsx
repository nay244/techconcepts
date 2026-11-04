// @vitest-environment jsdom
import { act, render, screen, within } from '@testing-library/react';
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
});

function pressed(group: HTMLElement): string[] {
  return within(group)
    .getAllByRole('button')
    .filter((b) => b.getAttribute('aria-pressed') === 'true')
    .map((b) => b.textContent ?? '');
}

test('renders a two-button group that reflects the current theme', () => {
  render(<ThemeToggle />);
  const group = screen.getByRole('group', { name: /theme/i });
  expect(within(group).getAllByRole('button')).toHaveLength(2);
  expect(pressed(group)).toEqual(['Dark']);
});

test('reads the theme the boot script applied', () => {
  document.documentElement.dataset.theme = 'light';
  render(<ThemeToggle />);
  expect(pressed(screen.getByRole('group'))).toEqual(['Light']);
});

test('choosing a theme applies it and saves it', async () => {
  const user = userEvent.setup();
  render(<ThemeToggle />);
  await user.click(screen.getByRole('button', { name: 'Light' }));
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(window.localStorage.getItem(THEME_KEY)).toBe('light');
  expect(pressed(screen.getByRole('group'))).toEqual(['Light']);
});

test('every toggle on the page stays in sync', async () => {
  const user = userEvent.setup();
  render(
    <>
      <div data-testid="header">
        <ThemeToggle />
      </div>
      <div data-testid="footer">
        <ThemeToggle />
      </div>
    </>,
  );
  const header = screen.getByTestId('header');
  const footer = screen.getByTestId('footer');
  await user.click(within(footer).getByRole('button', { name: 'Light' }));
  expect(pressed(within(header).getByRole('group'))).toEqual(['Light']);
  expect(pressed(within(footer).getByRole('group'))).toEqual(['Light']);
  await user.click(within(header).getByRole('button', { name: 'Dark' }));
  expect(pressed(within(header).getByRole('group'))).toEqual(['Dark']);
  expect(pressed(within(footer).getByRole('group'))).toEqual(['Dark']);
});

test('follows a theme change made outside the component', async () => {
  render(<ThemeToggle />);
  await act(async () => {
    document.documentElement.dataset.theme = 'light';
    await Promise.resolve();
  });
  expect(pressed(screen.getByRole('group'))).toEqual(['Light']);
});

test('still switches theme when localStorage throws', async () => {
  const user = userEvent.setup();
  vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
    throw new DOMException('blocked', 'SecurityError');
  });
  render(<ThemeToggle />);
  await user.click(screen.getByRole('button', { name: 'Light' }));
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(pressed(screen.getByRole('group'))).toEqual(['Light']);
});

test('server-renders with nothing pressed, then hydrates to the applied theme without warnings', async () => {
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  const container = document.createElement('div');
  container.innerHTML = renderToString(<ThemeToggle />);
  document.body.append(container);
  // The server cannot know the visitor's theme, so nothing is pressed yet.
  expect(container.querySelectorAll('[aria-pressed="true"]')).toHaveLength(0);

  document.documentElement.dataset.theme = 'light';
  let root!: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, <ThemeToggle />);
  });
  expect(pressed(within(container).getByRole('group'))).toEqual(['Light']);
  expect(errors).not.toHaveBeenCalled();

  act(() => root.unmount());
  container.remove();
});

test('compact marks the group for its icon-only style, and each button keeps its word as its name', async () => {
  const user = userEvent.setup();
  render(<ThemeToggle compact />);
  const group = screen.getByRole('group', { name: 'Color theme' });
  expect(group).toHaveAttribute('data-compact');
  expect(
    within(group)
      .getAllByRole('button')
      .map((b) => b.textContent),
  ).toEqual(['Light', 'Dark']);
  await user.click(screen.getByRole('button', { name: 'Light' }));
  expect(document.documentElement.dataset.theme).toBe('light');
});

test('is not compact unless asked', () => {
  render(<ThemeToggle />);
  expect(screen.getByRole('group', { name: 'Color theme' })).not.toHaveAttribute('data-compact');
});
