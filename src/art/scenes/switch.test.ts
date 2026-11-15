// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { drawSwitch, type SwitchSceneData } from './switch';
import { SWITCH_DEVICES, SWITCH_PLUGS } from './switch-parts';

// D13b (prototypes/d13-switch.md §5 and §8): the figure carries every part its driver reaches for, by id.

test('prototypes/d13-switch-part-figure.svg is the figure the code draws', () => {
  const { svg } = drawSwitch();
  const file: string = readFileSync('prototypes/d13-switch-part-figure.svg', 'utf8');
  expect(file).toBe(`${svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')}\n`);
});

test('the figure has each port light, each device’s port chip and verdict, each cable’s trace and the tags', () => {
  const { svg } = drawSwitch();
  for (let n = 1; n <= 5; n++) expect(svg).toContain(`id="sw-led-${n}"`);
  // Each device's status light, off at rest; no lit screen or paper slot.
  for (const id of ['sw-led-laptop', 'sw-led-tv', 'sw-led-printer', 'sw-rt-led-1', 'sw-rt-led-2']) expect(svg).toMatch(new RegExp(`class="lm-led" id="${id}"`));
  expect(svg).not.toMatch(/sw-glow/);
  for (const d of Object.keys(SWITCH_DEVICES)) {
    expect(svg).toContain(`id="sw-port-${d}"`);
    expect(svg).toContain(`id="sw-v-${d}"`);
    expect(svg).toContain(SWITCH_DEVICES[d as keyof typeof SWITCH_DEVICES]);
  }
  for (const [d, n] of [...Object.entries(SWITCH_PLUGS), ['laptop', 5]]) expect(svg).toContain(`id="sw-trace-${d}-${n}"`);
  for (const id of ['frame', 'to-all', 'copy-1', 'copy-2', 'copy-3', 'to-all-1', 'to-all-2', 'to-all-3']) expect(svg).toContain(`id="sw-tag-${id}"`);
  // The moved cable and its plug are drawn, hidden, until step 5's `plug` cue.
  expect(svg).toMatch(/id="sw-cable-laptop-5"[^>]*display="none"/);
  expect(svg).toMatch(/id="sw-plug-laptop-5"[^>]*display="none"/);
});

test('the data has one cable per plug, each a line from the device to its port', () => {
  const { data } = drawSwitch();
  const { cables } = data as SwitchSceneData;
  expect(Object.keys(cables).sort()).toEqual(['laptop:2', 'laptop:5', 'printer:4', 'router:1', 'tv:3']);
  for (const line of Object.values(cables)) {
    expect(line.length).toBeGreaterThan(3);
    for (const p of line) expect(p.every(Number.isFinite)).toBe(true);
  }
});
