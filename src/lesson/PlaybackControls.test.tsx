// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { liftedFixture, makeLesson } from '../content/test-fixtures';
import { forwardButton, initialPlayback } from '../engine/playback';
import { PlaybackControls } from './PlaybackControls';

const lesson = liftedFixture(makeLesson({ slug: 'dhcp', title: 'DHCP' }));
const state = { ...initialPlayback(), position: 2 };
const forward = forwardButton(lesson, state, { next: null, number: 9, total: 20 });

const controls = (form: 'full' | 'short' | 'fit') =>
  render(<PlaybackControls lesson={lesson} state={state} dispatch={() => undefined} unit={lesson.units[0]!} forward={forward} form={form} onForward={() => undefined} />);

test('the forward button shows the form it is told: full, short, or (jsdom measures nothing, so it fits) full', () => {
  for (const form of ['full', 'short', 'fit'] as const) {
    const { container, unmount } = controls(form);
    const label = container.querySelector('.go__label')!.textContent;
    expect(label).toBe(form === 'short' ? forward.words.short : forward.words.full);
    unmount();
  }
});

test('only the fit form carries the hidden measuring copy of the full words, and it is never read out', () => {
  const fit = controls('fit');
  const measure = fit.container.querySelector('.go__measure')!;
  expect(measure).toHaveAttribute('aria-hidden', 'true');
  expect(measure.textContent).toBe(forward.words.full);
  fit.unmount();
  for (const form of ['full', 'short'] as const) {
    const { container, unmount } = controls(form);
    expect(container.querySelector('.go__measure')).toBeNull();
    unmount();
  }
  expect(screen.queryByText(forward.words.full)).toBeNull();
});
