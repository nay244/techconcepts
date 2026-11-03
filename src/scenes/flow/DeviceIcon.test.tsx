// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import { actorKindSchema } from '../../content/schema';
import DeviceIcon from './DeviceIcon';

const KINDS = actorKindSchema.options;

test.each(KINDS)('draws a %s icon as a 1.5 px line drawing on a 48 px grid', (kind) => {
  const { container } = render(<DeviceIcon kind={kind} />);
  const svg = container.querySelector('svg')!;
  expect(svg).toHaveAttribute('viewBox', '0 0 48 48');
  expect(svg).toHaveAttribute('aria-hidden', 'true');
  expect(svg).toHaveAttribute('stroke', 'currentColor');
  expect(svg).toHaveAttribute('stroke-width', '1.5');
  expect(svg).toHaveAttribute('fill', 'none');
  expect(svg.querySelectorAll('path, rect, circle, line').length).toBeGreaterThan(0);
});

test('every kind has its own drawing', () => {
  const drawings = KINDS.map((kind) => render(<DeviceIcon kind={kind} />).container.innerHTML);
  expect(new Set(drawings).size).toBe(KINDS.length);
});
