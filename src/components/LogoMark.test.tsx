// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import { logoMark } from '../art/logo';
import LogoMark from './LogoMark';

test('the React mark is the same drawing as the one the header and footer use', () => {
  const { container } = render(<LogoMark />);
  const fromString = document.createElement('div');
  fromString.innerHTML = logoMark();
  const drawn = (root: Element): string[][] =>
    [...root.querySelectorAll('path')].map((p) => ['d', 'fill', 'stroke', 'stroke-width', 'stroke-linejoin'].map((a) => p.getAttribute(a) ?? ''));
  expect(drawn(container)).toEqual(drawn(fromString));
  expect(drawn(container)).toHaveLength(3);
  const svg = container.querySelector('svg')!;
  expect(svg.getAttribute('viewBox')).toBe(fromString.querySelector('svg')!.getAttribute('viewBox'));
  expect(svg.getAttribute('aria-hidden')).toBe('true');
  expect(svg).toHaveClass('logo');
});
