// @vitest-environment jsdom
import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { drawSwitch } from '../art/scenes/switch';
import { batch3Fixtures } from '../content/batch3-fixtures';
import type { PlaybackState } from '../engine/playback';
import { deriveState, positionOf } from '../engine/timeline';
import { ScenePanel } from './ScenePanel';

// D13b / B15b, attack case 14c: the panel's Pause during step 5's re-plug leaves the laptop on its cable (the real
// driver, the real panel; E14).

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
});
afterEach(() => vi.useRealTimers());

const lesson = batch3Fixtures.switch();
const drawn = drawSwitch();
const figure = <div dangerouslySetInnerHTML={{ __html: drawn.svg }} />;
const position = positionOf(lesson, 0, 'step', 5);
const state = (mode: PlaybackState['mode']): PlaybackState => ({ position, eventIndex: 0, mode, ended: false, speed: 1 });
const panel = (mode: PlaybackState['mode']) => (
  <ScenePanel unit={lesson.units[0]!} figure={figure} figureData={drawn.data} derived={deriveState(lesson, position, 0)} playback={state(mode)} reducedMotion={false} />
);

test('14c: Pause 500 ms into step 5’s re-plug shows the laptop’s cable at port 2, with no fade left on it', async () => {
  const { container, rerender } = render(panel('step'));
  const el = (id: string) => container.querySelector<SVGElement>(`#${id}`)!;
  await act(async () => {
    await vi.advanceTimersByTimeAsync(500);
  });
  // Mid-crossfade: the old cable is on its way out.
  expect(el('sw-cable-laptop-2').hasAttribute('data-ghost')).toBe(true);
  await act(async () => {
    rerender(panel('idle'));
  });
  for (const id of ['sw-cable-laptop-2', 'sw-plug-laptop-2']) {
    expect(el(id).style.opacity, id).toBe('');
    expect(el(id).hasAttribute('display'), id).toBe(false);
    expect(el(id).hasAttribute('data-ghost'), id).toBe(false);
  }
  for (const id of ['sw-cable-laptop-5', 'sw-plug-laptop-5']) expect(el(id).getAttribute('display'), id).toBe('none');
});
