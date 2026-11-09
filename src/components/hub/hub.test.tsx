// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import PartsMarker from './PartsMarker';
import TrackStrip from './TrackStrip';

test('the strip draws one square per state and shows the words', () => {
  const { container } = render(<TrackStrip states={['done', 'current', 'ready', '']} words="1 of 4 done" />);
  const squares = container.querySelectorAll('.strip__sq i');
  expect(squares).toHaveLength(4);
  expect(squares[0]).toHaveAttribute('data-state', 'done');
  expect(squares[1]).toHaveAttribute('data-state', 'current');
  expect(squares[2]).toHaveAttribute('data-state', 'ready');
  expect(squares[3]).not.toHaveAttribute('data-state');
  expect(container.querySelector('.strip__sq')).toHaveAttribute('aria-hidden', 'true');
  expect(container.querySelector('.strip__w')).toHaveTextContent('1 of 4 done');
});

test('the marker names the part you are in and flags each part', () => {
  const { container } = render(<PartsMarker parts={['done', 'now', '']} />);
  expect(screen.getByRole('img', { name: 'In progress, at Learn' })).toBeInTheDocument();
  const parts = container.querySelectorAll('.wlp__p');
  expect(parts).toHaveLength(3);
  expect(parts[0]).toHaveClass('is-done');
  expect(parts[1]).toHaveClass('is-now');
  expect(parts[2]).not.toHaveClass('is-done');
  expect(parts[2]).not.toHaveClass('is-now');
  expect(parts[2]).toHaveTextContent('Practice');
});

test('with no part marked now the label still renders', () => {
  render(<PartsMarker parts={['', '', '']} />);
  expect(screen.getByRole('img', { name: 'In progress' })).toBeInTheDocument();
});
