// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { drawSwitch, type SwitchSceneData } from './switch';
import { SWITCH_DESCRIPTION, SWITCH_DEVICES, SWITCH_PLUGS } from './switch-parts';

// D13b (prototypes/d13-switch.md §5 and §8): the figure carries every part its driver reaches for, by id.

test('prototypes/d13-switch-part-figure.svg is the figure the code draws', () => {
  const { svg } = drawSwitch();
  // The approved file's description still says "Port 5 is free."; the spec review's E19 drops it, so nothing else differs.
  const file: string = readFileSync('prototypes/d13-switch-part-figure.svg', 'utf8').replace(' Port 5 is free.', '');
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

// Case 1 and 2: the root, and every part, once.
test('1: the root names the figure, is one image, says what the spec says (without "Port 5 is free.") and has no grain', () => {
  const { svg } = drawSwitch();
  const root = /^<svg\b[^>]*>/.exec(svg)![0];
  expect(root).toContain(' data-figure="switch"');
  expect(root).toContain(' role="img"');
  expect(root).toContain(` aria-label="${SWITCH_DESCRIPTION}"`);
  expect(SWITCH_DESCRIPTION).not.toContain('Port 5 is free');
  expect(SWITCH_DESCRIPTION).toBe(
    'A wired home network on one plate: a switch with five numbered ports along its front, and a router, a laptop, a TV and a printer, each plugged into one port by its own cable. Beside each device, its name, its port and its MAC address.',
  );
  expect(root).toContain('viewBox="-85 4 703 316"');
  expect(svg).not.toMatch(/lm-grain/);
});

test('2: every id is unique and starts sw-; the moved cable is hidden, the others shown; every status light is off; the chips read PORT 1 to 4', () => {
  const { svg } = drawSwitch();
  const ids = [...svg.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]!);
  expect(new Set(ids).size).toBe(ids.length);
  for (const id of ids) expect(id.startsWith('sw-'), id).toBe(true);
  for (const id of ['sw-cable-laptop-5', 'sw-plug-laptop-5']) expect(svg).toMatch(new RegExp(`id="${id}"[^>]*display="none"`));
  for (const id of ['sw-cable-laptop-2', 'sw-plug-laptop-2']) expect(svg).not.toMatch(new RegExp(`id="${id}"[^>]*display=`));
  for (const id of [1, 2, 3, 4, 5].map((n) => `sw-led-${n}`).concat('sw-led-laptop', 'sw-led-tv', 'sw-led-printer', 'sw-rt-led-1', 'sw-rt-led-2')) {
    expect(svg, id).toMatch(new RegExp(`class="lm-led" id="${id}"`));
  }
  const chips = ['router', 'laptop', 'tv', 'printer'].map((d) => new RegExp(`id="sw-port-${d}"[^>]*>([^<]*)<`).exec(svg)![1]);
  expect(chips).toEqual(['PORT 1', 'PORT 2', 'PORT 3', 'PORT 4']);
  const words = (re: RegExp) => [...svg.matchAll(re)].map((m) => m[1]);
  expect(words(/id="sw-tag-(?:frame|to-all|copy-\d|to-all-\d)"[^>]*>[\s\S]*?<text[^>]*>([^<]*)</g)).toEqual(['FRAME', 'TO ALL', 'COPY', 'COPY', 'COPY', 'TO ALL', 'TO ALL', 'TO ALL']);
  for (const id of ['frame', 'to-all', 'copy-1', 'copy-2', 'copy-3', 'to-all-1', 'to-all-2', 'to-all-3']) expect(svg).toMatch(new RegExp(`id="sw-tag-${id}"[^>]*opacity:0`));
});

test('4: each cable runs from its device to its port', () => {
  const { cables } = drawSwitch().data as SwitchSceneData;
  expect(cables['laptop:2']!.at(-1)).not.toEqual(cables['laptop:5']!.at(-1));
  expect(cables['laptop:2']![0]).toEqual(cables['laptop:5']![0]);
  expect(cables['laptop:2']![0]).not.toEqual(cables['printer:4']![0]);
  // The ports sit on the switch, which is at the back: every cable ends higher on screen than it starts, except the router's, which starts behind it.
  for (const key of ['laptop:2', 'laptop:5', 'tv:3', 'printer:4']) expect(cables[key]!.at(-1)![1], key).toBeLessThan(cables[key]![0]![1]);
});
