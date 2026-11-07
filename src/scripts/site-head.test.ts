// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { solidOnScroll } from './site-head';

function scrollTo(y: number): void {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  window.dispatchEvent(new Event('scroll'));
}

afterEach(() => scrollTo(0));

test('the header over the hero is clear at the top and solid once the page has scrolled past 24px', () => {
  const head = document.createElement('header');
  const stop = solidOnScroll(head);
  expect(head.classList.contains('solid')).toBe(false);

  scrollTo(24);
  expect(head.classList.contains('solid')).toBe(false);
  scrollTo(25);
  expect(head.classList.contains('solid')).toBe(true);
  scrollTo(0);
  expect(head.classList.contains('solid')).toBe(false);

  // Stopped, it no longer follows the page.
  stop();
  scrollTo(400);
  expect(head.classList.contains('solid')).toBe(false);
});

test('a page already scrolled when it starts gets the solid header at once', () => {
  scrollTo(600);
  const head = document.createElement('header');
  solidOnScroll(head)();
  expect(head.classList.contains('solid')).toBe(true);
});
