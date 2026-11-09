// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import { contrastRatio } from '../../lib/contrast';
import { tokens } from '../../styles/tokens';
import { headersSentence, LabelsPanel } from './LabelsPanel';

// Read from the project root: under jsdom import.meta.url is not a file URL.
const labelsCss: string = readFileSync('src/lesson/panels/labels.css', 'utf8');
/** The body of the first rule whose selector is exactly `selector`. */
const rule = (selector: string) => labelsCss.split(`\n${selector} {`)[1]?.split('}')[0] ?? '';

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

test('a new chip is filled with the accent and its ink, a read chip outlined in the here colour', () => {
  expect(rule('.labels-chip.is-new')).toMatch(/background:\s*var\(--accent\);/);
  expect(rule('.labels-chip.is-new')).toMatch(/color:\s*var\(--accent-ink\);/);
  expect(rule('.labels-chip.is-read')).toMatch(/border:\s*2px solid var\(--here\);/);
  expect(rule('.labels-chip.is-read')).toMatch(/color:\s*var\(--ink-strong\);/);
});

test.each(['light', 'dark'] as const)('every chip word reaches 4.5:1 and the read mark 3:1 in the %s theme', (theme) => {
  const t = tokens[theme];
  // The panel sits on the card colour; a new chip's word sits on its own fill.
  expect(contrastRatio(t['accent-ink'], t.accent), 'new chip word').toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio(t.ink, t.card), 'chip word').toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio(t['ink-strong'], t.card), 'read chip word').toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio(t.here, t.card), 'read mark').toBeGreaterThanOrEqual(3);
});
