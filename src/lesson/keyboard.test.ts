// @vitest-environment jsdom
import { expect, test } from 'vitest';
import { shouldIgnoreShortcut } from './keyboard';

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

test('handles shortcuts on an anchor without an href and on a focusable scroll region', () => {
  expect(shouldIgnoreShortcut(document.createElement('a'))).toBe(false);
  expect(shouldIgnoreShortcut(make('<div role="region" tabindex="0"></div>'))).toBe(false);
});

test('handles shortcuts when the target is not an element', () => {
  expect(shouldIgnoreShortcut(null)).toBe(false);
  expect(shouldIgnoreShortcut(window)).toBe(false);
  expect(shouldIgnoreShortcut(document)).toBe(false);
});
