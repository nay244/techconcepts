// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { batch2Fixtures } from '../content/batch2-fixtures';
import { batch3Fixtures } from '../content/batch3-fixtures';
import type { Lesson } from '../content/schema';
import { deriveState } from '../engine/timeline';
import { ScenePanel } from './ScenePanel';

// D13 / B15a, attack case 19a: Packets' scene is network only, so the panel has no Network / Sequence switch.
const stand = vi.hoisted(() => {
  const driver = { show: vi.fn(), play: vi.fn(), destroy: vi.fn() };
  return { module: { create: vi.fn(() => driver), duration: vi.fn(() => 1000) } };
});
vi.mock('../scenes/drivers', () => ({ DRIVERS: { 'net-map': stand.module } }));

const panel = (lesson: Lesson) => (
  <ScenePanel
    unit={lesson.units[0]!}
    figure={<svg data-figure="net-map" role="img" aria-label="Fixture figure" />}
    figureData={{ routes: {} }}
    derived={deriveState(lesson, 1, 0)}
    playback={{ position: 1, eventIndex: 0, mode: 'idle', ended: false, speed: 1 }}
    reducedMotion={false}
  />
);

test('19a: the Packets scene renders no View switch; a scene with a Sequence view does', () => {
  const { container, unmount } = render(panel(batch3Fixtures.packets()));
  expect(container.querySelector('.stage__views')).toBeNull();
  expect(screen.queryByRole('group', { name: 'View' })).toBeNull();
  unmount();
  render(panel(batch2Fixtures['tcp-udp']()));
  expect(screen.getByRole('group', { name: 'View' })).toBeTruthy();
});
