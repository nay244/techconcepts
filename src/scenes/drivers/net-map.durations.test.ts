// @vitest-environment jsdom
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { drawNetMap, type NetMapData } from '../../art/scenes/net-map';
import { routerFixture } from '../../content/router-fixture';
import type { Lesson } from '../../content/schema';
import { netMapDriver } from './net-map';

/**
 * E13: every event of every net-map lesson, by slug, unit, step and event id, with the duration the driver gave BEFORE
 * the Packets change (park, unpark, via). The list in net-map.durations.json was recorded from the unchanged driver.
 */
const lessonModules = import.meta.glob<Lesson>(['../../content/lessons/*.ts', '!../../content/lessons/*.test.ts'], { import: 'default', eager: true });
const data = drawNetMap().data as NetMapData;

function durations(): Record<string, number> {
  const out: Record<string, number> = {};
  const lessons = [...Object.values(lessonModules).filter((l) => l.figure === 'net-map'), routerFixture()];
  for (const l of lessons)
    l.units.forEach((u, ui) => u.steps.forEach((s, si) => s.events.forEach((e) => (out[`${l.slug}/${ui}/${si}/${e.id}`] = netMapDriver.duration(e, data)))));
  return out;
}

test('every event of every existing net-map lesson takes exactly the time it took before park, unpark and via', () => {
  const before = JSON.parse(readFileSync('src/scenes/drivers/net-map.durations.json', 'utf8')) as Record<string, number>;
  expect(Object.keys(before).length).toBeGreaterThan(200);
  // Only the events the snapshot knew: a lesson merged since (Packets) is new, not changed. Every recorded event must still be there.
  const now = durations();
  for (const key of Object.keys(before)) expect(now, key).toHaveProperty([key]);
  expect(Object.fromEntries(Object.keys(before).map((k) => [k, now[k]]))).toEqual(before);
});
