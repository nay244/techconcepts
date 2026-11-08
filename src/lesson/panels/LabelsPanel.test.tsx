// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import { headersSentence, LabelsPanel } from './LabelsPanel';

const chips = (container: HTMLElement) => [...container.querySelectorAll('.labels-chip')].map((c) => c.textContent);
const note = (container: HTMLElement) => container.querySelector('.labels-note')!.textContent;

test('chips in order, then the data', () => {
  const { container } = render(<LabelsPanel labels={{ list: [5, 6, 7] }} />);
  expect(chips(container)).toEqual(['L5', 'L6', 'L7', 'data']);
  expect(container.querySelector('.labels-chip.is-data')!.textContent).toBe('data');
  const group = container.querySelector('[role="group"]')!;
  expect(group.getAttribute('aria-label')).toBe('The message');
  expect(group.querySelector('[aria-hidden="true"]')).not.toBeNull();
});

test('a new mark fills its chip and a read mark outlines it', () => {
  const a = render(<LabelsPanel labels={{ list: [6, 7], mark: { n: 7, kind: 'new' } }} />);
  expect(a.container.querySelectorAll('.is-new')).toHaveLength(1);
  expect(a.container.querySelector('.is-new')!.textContent).toBe('L7');
  expect(a.container.querySelector('.is-read')).toBeNull();
  a.unmount();
  const b = render(<LabelsPanel labels={{ list: [2, 3], mark: { n: 2, kind: 'read' } }} />);
  expect(b.container.querySelector('.is-read')!.textContent).toBe('L2');
  expect(b.container.querySelector('.is-new')).toBeNull();
});

test('the note counts the headers', () => {
  const text = (labels: Parameters<typeof LabelsPanel>[0]['labels']) => {
    const { container, unmount } = render(<LabelsPanel labels={labels} />);
    const t = note(container);
    unmount();
    return t;
  };
  expect(text({ list: [7] })).toBe('1 header, outermost first');
  expect(text({ list: [4, 5, 6, 7] })).toBe('4 headers, outermost first');
  expect(text(null)).toBe('No headers yet');
  expect(text({ list: [] })).toBe('No headers left');
});

test('headersSentence', () => {
  expect(headersSentence({ list: [4, 5, 6, 7], mark: { n: 4, kind: 'new' } })).toBe('Headers on the message: layer 4 (just added), 5, 6, 7, then the data.');
  expect(headersSentence({ list: [2, 3], mark: { n: 3, kind: 'read' } })).toBe('Headers on the message: layer 2, 3 (being read), then the data.');
  expect(headersSentence({ list: [7], mark: { n: 7, kind: 'new' } })).toBe('Headers on the message: layer 7 (just added), then the data.');
  expect(headersSentence(null)).toBe('Headers on the message: none yet, just the data.');
  expect(headersSentence({ list: [] })).toBe('Headers on the message: none left, just the data.');
});

test('the panel has no live region of its own', () => {
  const { container } = render(<LabelsPanel labels={{ list: [7], mark: { n: 7, kind: 'new' } }} />);
  expect(container.querySelector('[aria-live]')).toBeNull();
});
