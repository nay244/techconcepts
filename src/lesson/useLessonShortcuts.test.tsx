// @vitest-environment jsdom
import { fireEvent, renderHook } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { useLessonShortcuts, type LessonShortcutsOptions } from './useLessonShortcuts';

function setup(options: Partial<LessonShortcutsOptions> = {}) {
  const dispatch = vi.fn();
  const closeInspector = vi.fn();
  renderHook(() => useLessonShortcuts({ dispatch, canPlay: true, inspectorOpen: false, closeInspector, ...options }));
  return { dispatch, closeInspector };
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
  const { dispatch } = setup();
  expect(fireEvent.keyDown(document.body, { key: ' ' })).toBe(false);
  fireEvent.keyDown(document.body, { key: 'ArrowRight' });
  fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
  expect(dispatch.mock.calls).toEqual([[{ type: 'toggle' }], [{ type: 'next' }], [{ type: 'prev' }]]);
});

test('a held Space toggles once', () => {
  const { dispatch } = setup();
  fireEvent.keyDown(document.body, { key: ' ' });
  fireEvent.keyDown(document.body, { key: ' ', repeat: true });
  expect(dispatch).toHaveBeenCalledTimes(1);
});

test('in a playground Space is left to the page, and the arrows still move between positions', () => {
  const { dispatch } = setup({ canPlay: false });
  expect(fireEvent.keyDown(document.body, { key: ' ' })).toBe(true);
  fireEvent.keyDown(document.body, { key: 'ArrowRight' });
  expect(dispatch.mock.calls).toEqual([[{ type: 'next' }]]);
});

test('Escape closes an open inspector from anywhere, its own buttons included', () => {
  const { closeInspector } = setup({ inspectorOpen: true });
  fireEvent.keyDown(place('<button type="button">Next packet</button>'), { key: 'Escape' });
  fireEvent.keyDown(document.body, { key: 'Escape' });
  expect(closeInspector).toHaveBeenCalledTimes(2);
});

test('Escape does nothing while the inspector is closed', () => {
  const { dispatch, closeInspector } = setup();
  fireEvent.keyDown(document.body, { key: 'Escape' });
  expect(closeInspector).not.toHaveBeenCalled();
  expect(dispatch).not.toHaveBeenCalled();
});

test('nothing fires inside the outline drawer, a modal dialog with keys of its own', () => {
  const { dispatch, closeInspector } = setup({ inspectorOpen: true });
  const inside = place('<dialog open><p tabindex="-1">Contents</p></dialog>').querySelector('p')!;
  for (const key of [' ', 'ArrowRight', 'Escape']) fireEvent.keyDown(inside, { key });
  expect(dispatch).not.toHaveBeenCalled();
  expect(closeInspector).not.toHaveBeenCalled();
});

test('a modifier leaves the key to the browser', () => {
  const { dispatch } = setup();
  for (const modifier of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'])
    fireEvent.keyDown(document.body, { key: 'ArrowRight', [modifier]: true });
  expect(dispatch).not.toHaveBeenCalled();
});

test('a key another handler has already taken is left alone', () => {
  const { dispatch } = setup();
  const text = place('<p tabindex="-1">text</p>');
  text.addEventListener('keydown', (event) => event.preventDefault());
  fireEvent.keyDown(text, { key: 'ArrowRight' });
  expect(dispatch).not.toHaveBeenCalled();
});

test('form controls and buttons keep their keys', () => {
  const { dispatch } = setup();
  fireEvent.keyDown(place('<input type="range" />'), { key: 'ArrowRight' });
  fireEvent.keyDown(place('<button type="button">Go</button>'), { key: ' ' });
  expect(dispatch).not.toHaveBeenCalled();
});

test('a region that scrolls sideways keeps the arrows; Space there still plays', () => {
  const { dispatch } = setup();
  const log = scrollRegion({ x: true });
  fireEvent.keyDown(log, { key: 'ArrowRight' });
  fireEvent.keyDown(log, { key: 'ArrowLeft' });
  expect(dispatch).not.toHaveBeenCalled();
  expect(fireEvent.keyDown(log, { key: ' ' })).toBe(false);
  expect(dispatch.mock.calls).toEqual([[{ type: 'toggle' }]]);
});

test('a region that scrolls downwards keeps Space, unprevented so it pages down; the arrows still move', () => {
  const { dispatch } = setup();
  const explanation = scrollRegion({ y: true });
  expect(fireEvent.keyDown(explanation, { key: ' ' })).toBe(true);
  fireEvent.keyDown(explanation, { key: 'ArrowRight' });
  expect(dispatch.mock.calls).toEqual([[{ type: 'next' }]]);
});

test('a focusable region with nothing to scroll leaves every key to the lesson', () => {
  const { dispatch } = setup();
  const panel = scrollRegion({});
  fireEvent.keyDown(panel, { key: ' ' });
  fireEvent.keyDown(panel, { key: 'ArrowRight' });
  expect(dispatch.mock.calls).toEqual([[{ type: 'toggle' }], [{ type: 'next' }]]);
});

test('stops listening when the console goes away', () => {
  const dispatch = vi.fn();
  const { unmount } = renderHook(() => useLessonShortcuts({ dispatch, canPlay: true, inspectorOpen: false, closeInspector: vi.fn() }));
  unmount();
  fireEvent.keyDown(document.body, { key: 'ArrowRight' });
  expect(dispatch).not.toHaveBeenCalled();
});
