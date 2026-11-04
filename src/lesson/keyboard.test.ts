// @vitest-environment jsdom
import { expect, test } from 'vitest';
import { scrollRegionOwnsKey, shouldIgnoreShortcut } from './keyboard';

const make = (html: string): HTMLElement => {
  const host = document.createElement('div');
  host.innerHTML = html;
  return host.firstElementChild as HTMLElement;
};

test.each(['input', 'textarea', 'select', 'button'])('ignores shortcuts in <%s>', (tag) =>
  expect(shouldIgnoreShortcut(document.createElement(tag))).toBe(true),
);

test('ignores range slider and links', () => {
  const r = document.createElement('input');
  r.type = 'range';
  expect(shouldIgnoreShortcut(r)).toBe(true);
  const a = document.createElement('a');
  a.href = '/x';
  expect(shouldIgnoreShortcut(a)).toBe(true);
});

test('handles shortcuts on body and plain divs', () => {
  expect(shouldIgnoreShortcut(document.body)).toBe(false);
  expect(shouldIgnoreShortcut(document.createElement('div'))).toBe(false);
});

test('ignores editable regions, sliders and radios built from ARIA roles', () => {
  expect(shouldIgnoreShortcut(make('<div contenteditable="true">x</div>'))).toBe(true);
  expect(shouldIgnoreShortcut(make('<div role="slider" tabindex="0"></div>'))).toBe(true);
  expect(shouldIgnoreShortcut(make('<div role="radio" tabindex="0"></div>'))).toBe(true);
});

test('ignores a disclosure summary and anything inside it', () => {
  const details = make('<details><summary><span>More</span></summary><p>Body</p></details>');
  expect(shouldIgnoreShortcut(details.querySelector('summary'))).toBe(true);
  expect(shouldIgnoreShortcut(details.querySelector('span'))).toBe(true);
  // The open disclosure's body is ordinary content.
  expect(shouldIgnoreShortcut(details.querySelector('p'))).toBe(false);
});

test('ignores anything inside a button, such as its icon', () => {
  const button = make('<button><svg><path /></svg></button>');
  expect(shouldIgnoreShortcut(button.querySelector('path'))).toBe(true);
});

test('handles shortcuts on an anchor without an href', () => {
  expect(shouldIgnoreShortcut(document.createElement('a'))).toBe(false);
});

// ---- focusable scroll regions (ruling R27)

/** A focusable region that scrolls, with layout sizes jsdom cannot work out for itself. */
function region(
  size: { scrollWidth?: number; clientWidth?: number; scrollHeight?: number; clientHeight?: number },
  html = '',
): HTMLElement {
  const el = make(`<div role="region" tabindex="0" style="overflow-x: auto; overflow-y: auto">${html}</div>`);
  const sizes = { scrollWidth: 300, clientWidth: 300, scrollHeight: 200, clientHeight: 200, ...size };
  for (const [name, value] of Object.entries(sizes)) Object.defineProperty(el, name, { configurable: true, value });
  return el;
}

const KEYS = [' ', 'ArrowLeft', 'ArrowRight'];

test('a focusable region with nothing to scroll leaves every shortcut to the lesson', () => {
  const el = region({});
  for (const key of KEYS) expect(shouldIgnoreShortcut(el, key)).toBe(false);
});

test('a region that scrolls sideways keeps the arrow keys and leaves Space to the lesson', () => {
  const el = region({ scrollWidth: 1024 });
  expect(shouldIgnoreShortcut(el, 'ArrowLeft')).toBe(true);
  expect(shouldIgnoreShortcut(el, 'ArrowRight')).toBe(true);
  expect(shouldIgnoreShortcut(el, ' ')).toBe(false);
});

test('a region that scrolls downwards keeps Space and leaves the arrow keys to the lesson', () => {
  const el = region({ scrollHeight: 900 });
  expect(shouldIgnoreShortcut(el, ' ')).toBe(true);
  expect(shouldIgnoreShortcut(el, 'ArrowLeft')).toBe(false);
  expect(shouldIgnoreShortcut(el, 'ArrowRight')).toBe(false);
});

test('what sits inside a scroll region counts as the region', () => {
  const el = region({ scrollWidth: 1024, scrollHeight: 900 }, '<table><tr><td>cell</td></tr></table>');
  const cell = el.querySelector('td');
  for (const key of KEYS) expect(scrollRegionOwnsKey(cell, key)).toBe(true);
});

test('content that overflows a region which does not scroll leaves the keys to the lesson', () => {
  const el = region({ scrollWidth: 1024, scrollHeight: 900 });
  el.style.overflowX = 'visible';
  el.style.overflowY = 'visible';
  for (const key of KEYS) expect(shouldIgnoreShortcut(el, key)).toBe(false);
});

test('only Space and the arrow keys are ever left to a region', () => {
  const el = region({ scrollWidth: 1024, scrollHeight: 900 });
  expect(scrollRegionOwnsKey(el, 'Escape')).toBe(false);
  expect(scrollRegionOwnsKey(el, 'Enter')).toBe(false);
});

test('without a key, only the elements that own their keys are checked', () => {
  expect(shouldIgnoreShortcut(region({ scrollWidth: 1024, scrollHeight: 900 }))).toBe(false);
});

test('an element outside any focusable region leaves the keys to the lesson', () => {
  const plain = make('<div style="overflow-x: auto; overflow-y: auto"><p>text</p></div>');
  Object.defineProperty(plain, 'scrollHeight', { configurable: true, value: 900 });
  for (const key of KEYS) expect(scrollRegionOwnsKey(plain.querySelector('p'), key)).toBe(false);
});

test('handles shortcuts when the target is not an element', () => {
  expect(shouldIgnoreShortcut(null)).toBe(false);
  expect(shouldIgnoreShortcut(window, ' ')).toBe(false);
  expect(shouldIgnoreShortcut(document, 'ArrowRight')).toBe(false);
});
