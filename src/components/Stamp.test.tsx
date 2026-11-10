// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Stamp } from './Stamp';

test('a checked lesson’s stamp says when, and how many sources', () => {
  render(<Stamp stamp={{ checked: '2026-11-08', sources: 6 }} href="/about#facts" />);
  const stamp = screen.getByRole('link', { name: 'Checked 8 Nov 2026, 6 sources' });
  expect(stamp).toHaveAttribute('href', '/about#facts');
  expect(stamp).toHaveAttribute('data-checked');
});

test('a lesson not checked yet says so, and a card leaves the count out', () => {
  const { container } = render(<Stamp stamp={{ checked: null, sources: 2 }} sources={false} />);
  expect(container.firstElementChild).toHaveTextContent(/^Not checked yet$/);
  expect(container.firstElementChild).not.toHaveAttribute('data-checked');
  expect(screen.queryByRole('link')).toBeNull();
});
