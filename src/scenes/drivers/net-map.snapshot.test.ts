// @vitest-environment jsdom
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { createHash } from 'node:crypto';
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync, writeFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { drawNetMap, type NetMapData } from '../../art/scenes/net-map';
import { routerFixture } from '../../content/router-fixture';
import type { Lesson } from '../../content/schema';
import { deriveState, slotsFor, stepEvents } from '../../engine/timeline';
import { groupsOf, withoutVpn } from '../../test/svg-groups';
import { sceneViewOf } from '../driver';
import { netMapDriver } from './net-map';

/**
 * D15a / B18a (E10, E21): what every existing net-map lesson drew, counted and timed on 86d0bf6, BEFORE the Proxies
 * patch, kept in net-map.snapshot.json. For each lesson (Router's fixture included), at every position and every event
 * index: the SHA-256 of `deriveState` (check 4), of the driver's figure after `show` with every layer group the unit
 * does not show cut, and its aria-label (check 4g); every event's duration (check 3); and the SHA-256 of today's SVG
 * (check 1). Recorded with `WRITE_SNAPSHOT=1 npx vitest run src/scenes/drivers/net-map.snapshot.test.ts`.
 */
const lessonModules = import.meta.glob<Lesson>(['../../content/lessons/*.ts', '!../../content/lessons/*.test.ts'], { import: 'default', eager: true });
const sha = (text: string): string => createHash('sha256').update(text).digest('hex');
const drawn = drawNetMap();
const data = drawn.data as NetMapData;
const lessons = [...Object.values(lessonModules).filter((l) => l.figure === 'net-map'), routerFixture()];
/** Layer groups the patches added are not in 86d0bf6's drawing; cutting them whole leaves today's SVG. */
const NEW_LAYERS = ['<g data-layer="proxies:site" display="none">', '<g data-layer="proxies:proxy" display="none">'];
/**
 * D15b / B18b (E21): VPN's two layers and the café's groups are cut too, and home's wrappers opened, in the drawing and in
 * the driver's figure: what is left is what 86d0bf6 drew.
 */
const without = (svg: string): string => withoutVpn(NEW_LAYERS.reduce((out, open) => groupsOf(out, open).rest, svg));

interface Snapshot {
  svg: { sha256: string; length: number };
  durations: Record<string, number>;
  states: Record<string, string>;
  figures: Record<string, { aria: string; sha256: string }>;
  /** Case 1d: `drawNetMap(layers).svg`, the still copy Home draws, for each layer set a unit uses. */
  layerSets: Record<string, string>;
}

function take(): Snapshot {
  const svg = without(drawn.svg);
  const snap: Snapshot = { svg: { sha256: sha(svg), length: svg.length }, durations: {}, states: {}, figures: {}, layerSets: {} };
  for (const l of lessons) {
    for (const u of l.units) snap.layerSets[JSON.stringify(u.scene.layers)] = sha(withoutVpn(drawNetMap(u.scene.layers).svg));
    l.units.forEach((u, ui) => u.steps.forEach((s, si) => s.events.forEach((e) => (snap.durations[`${l.slug}/${ui}/${si}/${e.id}`] = netMapDriver.duration(e, data)))));
    const host = document.createElement('div');
    host.innerHTML = drawn.svg;
    document.body.append(host);
    const root = host.querySelector<SVGSVGElement>('svg[data-figure="net-map"]')!;
    const driver = netMapDriver.create(root, JSON.parse(JSON.stringify(data)));
    slotsFor(l).forEach((slot, p) => {
      const n = stepEvents(l, p).length;
      for (let i = -1; i <= n; i++) {
        const derived = deriveState(l, p, i);
        snap.states[`${l.slug}/${p}/${i}`] = sha(JSON.stringify(derived));
        if (i < 0) continue;
        const view = sceneViewOf(l.units[slot.unit]!, derived);
        driver.show(view);
        const copy = root.cloneNode(true) as SVGSVGElement;
        for (const g of copy.querySelectorAll('[data-layer]')) if (!view.layers.includes(g.getAttribute('data-layer')!)) g.remove();
        for (const g of copy.querySelectorAll('[data-base="cafe"]')) g.remove();
        for (const g of copy.querySelectorAll('[data-base="home"]')) g.replaceWith(...g.childNodes);
        snap.figures[`${l.slug}/${p}/${i}`] = { aria: root.getAttribute('aria-label') ?? '', sha256: sha(copy.outerHTML) };
      }
    });
    driver.destroy();
    host.remove();
  }
  return snap;
}

const LAYER_SETS = 17;
const FILE = 'src/scenes/drivers/net-map.snapshot.json';

test('every existing net-map lesson draws, derives and times exactly as it did before the Proxies and VPN patches', () => {
  const now = take();
  // @ts-expect-error - no @types/node in this project; vitest runs under node
  if (process.env.WRITE_SNAPSHOT === '1') writeFileSync(FILE, JSON.stringify(now, null, 1) + '\n');
  const before = JSON.parse(readFileSync(FILE, 'utf8')) as Snapshot;
  // The 20 lessons give 409 events and 745 states; Router's fixture adds 20 events and 36 states.
  const real = (keys: string[]): number => keys.filter((k) => !k.startsWith('router-fixture/')).length;
  expect(real(Object.keys(before.durations))).toBe(409);
  expect(real(Object.keys(before.states))).toBe(745);
  expect(now.svg, 'check 1: the SVG without the new layers').toEqual(before.svg);
  expect(now.durations, 'check 3: durations').toEqual(before.durations);
  expect(now.states, 'check 4: deriveState').toEqual(before.states);
  expect(now.layerSets, 'case 1d: the still map for each layer set').toEqual(before.layerSets);
  expect(Object.keys(before.layerSets)).toHaveLength(LAYER_SETS);
  expect(now.figures, 'check 4g: the driver’s figure and aria-label').toEqual(before.figures);
}, 120_000);
