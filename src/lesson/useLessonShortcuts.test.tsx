// @vitest-environment jsdom
import { fireEvent, renderHook } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { useLessonShortcuts } from './useLessonShortcuts';

/** Records every call in one list, in order, as 'toggle', 'next' or 'prev'. */
function setup() {
  const calls: string[] = [];
  const actions = {
    toggle: vi.fn(() => void calls.push('toggle')),
    next: vi.fn(() => void calls.push('next')),
    prev: vi.fn(() => void calls.push('prev')),
  };
  const hook = renderHook(() => useLessonShortcuts(actions));
  return { calls, actions, hook };
}

/** Puts `html` on the page and returns its first element. */
function place(html: string): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = html;
  document.body.append(host);
  return host.firstElementChild as HTMLElement;
}

/** A focusable region whose content overflows it, in the way given. */
function scrollRegion(overflow: { x?: boolean; y?: boolean }): HTMLElement {
  const el = place('<div role="region" tabindex="0" style="overflow-x: auto; overflow-y: auto"></div>');
  const sizes = { clientWidth: 300, scrollWidth: overflow.x ? 1024 : 300, clientHeight: 200, scrollHeight: overflow.y ? 900 : 200 };
  for (const [name, value] of Object.entries(sizes)) Object.defineProperty(el, name, { configurable: true, value });
  return el;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('Space toggles playback and is kept from scrolling the page; the arrows move between positions', () => {
  const { calls } = setup();
  expect(fireEvent.keyDown(document.body, { key: ' ' })).toBe(false);
  fireEvent.keyDown(document.body, { key: 'ArrowRight' });
  fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
  expect(calls).toEqual(['toggle', 'next', 'prev']);
});

test('a held Space toggles once', () => {
  const { actions } = setup();
  fireEvent.keyDown(document.body, { key: ' ' });
  fireEvent.keyDown(document.body, { key: ' ', repeat: true });
  expect(actions.toggle).toHaveBeenCalledTimes(1);
});

test('Escape and other keys do nothing', () => {
  const { calls } = setup();
  for (const key of ['Escape', 'Enter', 'ArrowUp', 'a']) expect(fireEvent.keyDown(document.body, { key })).toBe(true);
  expect(calls).toEqual([]);
});

test('nothing fires inside the outline drawer, a modal dialog with keys of its own', () => {
  const { calls } = setup();
  const inside = place('<dialog open><p tabindex="-1">Contents</p></dialog>').querySelector('p')!;
  for (const key of [' ', 'ArrowRight', 'ArrowLeft']) fireEvent.keyDown(inside, { key });
  expect(calls).toEqual([]);
});

test('a modifier leaves the key to the browser', () => {
  const { calls } = setup();
  for (const modifier of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'])
    fireEvent.keyDown(document.body, { key: 'ArrowRight', [modifier]: true });
  expect(calls).toEqual([]);
});

test('a key another handler has already taken is left alone', () => {
  const { calls } = setup();
  const text = place('<p tabindex="-1">text</p>');
  text.addEventListener('keydown', (event) => event.preventDefault());
  fireEvent.keyDown(text, { key: 'ArrowRight' });
  expect(calls).toEqual([]);
});

test('form controls, buttons and links keep their keys', () => {
  const { calls } = setup();
  fireEvent.keyDown(place('<input type="range" />'), { key: 'ArrowRight' });
  fireEvent.keyDown(place('<button type="button">Go</button>'), { key: ' ' });
  fireEvent.keyDown(place('<a href="/networking">Track</a>'), { key: 'ArrowLeft' });
  expect(calls).toEqual([]);
});

test('a region that scrolls sideways keeps the arrows; Space there still plays', () => {
  const { calls } = setup();
  const log = scrollRegion({ x: true });
  fireEvent.keyDown(log, { key: 'ArrowRight' });
  fireEvent.keyDown(log, { key: 'ArrowLeft' });
  expect(calls).toEqual([]);
  expect(fireEvent.keyDown(log, { key: ' ' })).toBe(false);
  expect(calls).toEqual(['toggle']);
});

test('a region that scrolls downwards keeps Space, unprevented so it pages down; the arrows still move', () => {
  const { calls } = setup();
  const explanation = scrollRegion({ y: true });
  expect(fireEvent.keyDown(explanation, { key: ' ' })).toBe(true);
  fireEvent.keyDown(explanation, { key: 'ArrowRight' });
  expect(calls).toEqual(['next']);
});

test('a focusable region with nothing to scroll leaves every key to the lesson', () => {
  const { calls } = setup();
  const panel = scrollRegion({});
  fireEvent.keyDown(panel, { key: ' ' });
  fireEvent.keyDown(panel, { key: 'ArrowRight' });
  expect(calls).toEqual(['toggle', 'next']);
});

test('calls the latest callbacks after a re-render, without listening twice', () => {
  const first = { toggle: vi.fn(), next: vi.fn(), prev: vi.fn() };
  const second = { toggle: vi.fn(), next: vi.fn(), prev: vi.fn() };
  const add = vi.spyOn(window, 'addEventListener');
  const { rerender } = renderHook((actions) => useLessonShortcuts(actions), { initialProps: first });
  rerender(second);
  fireEvent.keyDown(document.body, { key: 'ArrowRight' });
  expect(first.next).not.toHaveBeenCalled();
  expect(second.next).toHaveBeenCalledTimes(1);
  expect(add.mock.calls.filter(([type]) => type === 'keydown')).toHaveLength(1);
  add.mockRestore();
});

test('stops listening when the console goes away', () => {
  const { actions, hook } = setup();
  hook.unmount();
  fireEvent.keyDown(document.body, { key: 'ArrowRight' });
  expect(actions.next).not.toHaveBeenCalled();
});
