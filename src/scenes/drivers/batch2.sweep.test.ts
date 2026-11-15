// @vitest-environment jsdom
import { expect, test } from 'vitest';
import { batch2Fixtures } from '../../content/batch2-fixtures';
import { showSweep } from '../../test/show-sweep';

// D12 / B14: the show sweep on the two fixtures whose figures B14 does not change (the subnet figure's office for IP
// Address, the network map for TCP/UDP): each drives its figure at every moment and leaves it as a fresh driver draws
// it. The MAC fixture's sweep is in dhcp.frames.test.ts.

test('IP Address: the subnet figure’s driver draws every moment of the scene, forwards, backwards and jumping, as a fresh driver does', () => {
  const lesson = batch2Fixtures.ip();
  expect(showSweep(lesson)).toBe(8 + lesson.units[0]!.steps.flatMap((s) => s.events).length);
});

test('TCP/UDP: the network map’s driver draws every moment of the scene as a fresh driver does', () => {
  const lesson = batch2Fixtures['tcp-udp']();
  expect(showSweep(lesson)).toBe(8 + lesson.units[0]!.steps.flatMap((s) => s.events).length);
});
