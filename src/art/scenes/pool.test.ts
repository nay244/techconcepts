// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { figureIdSchema } from '../../content/schema';
import { DRIVERS } from '../../scenes/drivers';
import { spot } from '../figures/spots';
import { drawFigure } from './index';
import { FIGURE_PARTS } from './parts';
import { poolDriver } from '../../scenes/drivers/pool';
import { POOL_CHIPS, POOL_HEALTH_WORDS, POOL_READERS, POOL_ROUTES, POOL_SERVERS } from './pool-parts';
import { drawPool, POOL_DESCRIPTION, type PoolSceneData } from './pool';

// D13c / B15c (prototypes/d13-load-balancers.md §5 and §8; prototypes/d13-load-balancers-cases.md, F1, F3 to F7 and D1 to D5).

const drawn = drawPool();
const svg = drawn.svg;
const data = drawn.data as PoolSceneData;
const read = (path: string): string => readFileSync(path, 'utf8');

test('F1: the part and the spot are the approved files, byte for byte', () => {
  expect(`${svg}\n`).toBe(read('prototypes/d13-load-balancers-part-pool.svg'));
  expect(`${spot('load-balancers')}\n`).toBe(read('prototypes/d13-load-balancers-spot.svg'));
});

test('D1: every id the driver reads appears once; the pl- ids are all unique', () => {
  const want = ['pl-tag-request', 'pl-tag-check', 'pl-tag-ok', 'pl-trail'];
  for (const r of POOL_READERS) want.push(`pl-glow-${r}`);
  for (const p of [...POOL_READERS, 'balancer', ...POOL_SERVERS]) want.push(`pl-call-${p}`);
  for (const s of POOL_SERVERS) {
    want.push(`pl-pick-${s}`, `pl-quiet-${s}`, `pl-skip-${s}`, `pl-lamp-${s}-0`, `pl-lamp-${s}-1`, `pl-health-${s}`, `pl-health-t-${s}`);
    for (let i = 0; i < POOL_CHIPS; i++) want.push(`pl-chip-${s}-${i}`, `pl-chip-lit-${s}-${i}`);
  }
  expect(want).toHaveLength(59);
  for (const id of want) expect(svg.split(`id="${id}"`).length - 1, id).toBe(1);
  const all = [...svg.matchAll(/ id="(pl-[^"]+)"/g)].map((m) => m[1]);
  expect(new Set(all).size).toBe(all.length);
  expect([...all].sort()).toEqual([...want].sort());
});

test('D2: the root names the figure, is one image, says the spec’s words, and the box is -32 -49 589 335', () => {
  const root = /^<svg\b[^>]*>/.exec(svg)![0];
  expect(root.startsWith('<svg data-figure="pool"')).toBe(true);
  expect(root).toContain(' role="img"');
  expect(root).toContain(` aria-label="${POOL_DESCRIPTION}"`);
  expect(root).toContain('viewBox="-32 -49 589 335"');
  expect(POOL_DESCRIPTION).toBe(
    'A load balancer on one plate. In front, out on the internet, three readers’ laptops, their cables meeting at the balancer in the middle, whose address all three use. Behind it, in the pool, three servers, A, B and C, each cabled to the balancer, each with two lamps for its last two health checks.',
  );
});

test('D3 and H7: the legs have eight points each, from the screens and the balancer’s top to the chips; O is the plate’s origin', () => {
  expect(Object.keys(data.legs).sort()).toEqual(['a', 'b', 'c', 'laptop', 'reader2', 'reader3']);
  for (const leg of Object.values(data.legs)) expect(leg).toHaveLength(8);
  expect(data.legs.laptop[0]).toEqual([-75, 47, 29]);
  expect(data.legs.reader2[0]).toEqual([-13, 47, 29]);
  expect(data.legs.reader3[0]).toEqual([49, 47, 29]);
  for (const r of POOL_READERS) expect(data.legs[r].at(-1)).toEqual([13, -14, 18.2]);
  for (const s of POOL_SERVERS) expect(data.legs[s][0]).toEqual([13, -14, 18.2]);
  expect(data.legs.a.at(-1)).toEqual([-31, -59, 54.6]);
  expect(data.legs.b.at(-1)).toEqual([23, -59, 54.6]);
  expect(data.legs.c.at(-1)).toEqual([77, -59, 54.6]);
  expect(data.O).toEqual([224, 141.86]);
});

test('D4: with no script the figure is the Overview: green lamps, "Healthy", no chip, tag, trail, ring or mark showing, nothing lit', () => {
  const lamps = [...svg.matchAll(/<[^>]*id="pl-lamp-[abc]-[01]"[^>]*>/g)].map((m) => m[0]);
  expect(lamps).toHaveLength(6);
  for (const l of lamps) expect(l).toContain('data-check="ok"');
  for (const s of POOL_SERVERS) {
    const line = new RegExp(`<[^>]*id="pl-health-${s}"[^>]*>`).exec(svg)![0];
    expect(line).toContain('data-health="healthy"');
    expect(line).not.toContain('data-turning');
    expect(new RegExp(`id="pl-health-t-${s}"[^>]*>Healthy<`).test(svg)).toBe(true);
  }
  const hidden = [...svg.matchAll(/<[^>]*id="(pl-(?:chip|chip-lit|tag|trail|quiet|skip)[^"]*)"[^>]*>/g)];
  expect(hidden.length).toBe(4 * 3 * 2 + 3 + 1 + 3 + 3);
  for (const [tag, id] of hidden) expect(tag, id).toMatch(/opacity:\s*0/);
  for (const m of svg.matchAll(/<[^>]*id="pl-(?:glow|pick)-[^"]*"[^>]*>/g)) expect(m[0]).not.toMatch(/class="[^"]*\bon\b/);
});

test('D5: pool.css declares the fixed lights as .fw does, and the figure carries no token of its own', () => {
  const css = read('src/art/scenes/pool.css');
  expect(css).toMatch(/\.pl\s*\{[^}]*--fixed-allow:\s*#3ddc7c;[^}]*--fixed-deny:\s*#ff4f4f;/s);
  expect(read('src/styles/tokens.ts')).not.toMatch(/\bpl-|pool/i);
});

test('F3: the spot has one lit part, one light on, B’s two red lamps, four green, and §6’s words', () => {
  const s = spot('load-balancers');
  expect((s.match(/data-lit/g) ?? []).length).toBe(1);
  expect((s.match(/class="lm-led on"/g) ?? []).length).toBe(1);
  expect((s.match(/lm-rule-no/g) ?? []).length).toBe(2);
  expect((s.match(/lm-rule-ok/g) ?? []).length).toBe(4);
  expect(s).toContain('ONE ADDRESS · THREE SERVERS');
  expect(s).toContain('aria-label="A load balancer at the front with one cable coming in, and behind it a pool of three servers, A, B and C, each cabled to it. Server B’s two lamps are red. A lit request rides the cable to server C."');
  expect(s).toMatch(/viewBox="36 44 528 372"/);
});

test('F6: the word "proxy" is nowhere in the figure, the spot or their code', () => {
  for (const text of [svg, spot('load-balancers')]) expect(text).not.toMatch(/proxy/i);
  for (const f of ['src/art/scenes/pool.ts', 'src/art/scenes/pool.css', 'src/art/scenes/pool-parts.ts', 'src/scenes/drivers/pool.ts', 'src/content/batch3-fixtures.ts']) expect(read(f), f).not.toMatch(/proxy/i);
  expect(read('src/art/figures/spots.ts').slice(read('src/art/figures/spots.ts').indexOf('function loadBalancersSpot'))).not.toMatch(/proxy/i);
});

test('F7: the driver takes only types from the drawing, and the parts file imports nothing', () => {
  const imports = read('src/scenes/drivers/pool.ts').split('\n').filter((l: string) => /^import .*art\/scenes\/pool'/.test(l));
  expect(imports).toHaveLength(1);
  expect(imports[0]).toMatch(/^import type /);
  expect(read('src/art/scenes/pool-parts.ts')).not.toMatch(/^import /m);
});

test('the routes are the nine from a reader to a server, and a check and an answer for each server', () => {
  expect(POOL_ROUTES).toHaveLength(15);
  expect(POOL_ROUTES).toContain('reader3>c');
  expect(POOL_ROUTES).toContain('balancer>b');
  expect(POOL_ROUTES).toContain('a>balancer');
  expect(POOL_ROUTES.some((r) => r.includes('balancer>') && r.startsWith('laptop'))).toBe(false);
  expect(Object.keys(POOL_HEALTH_WORDS)).toEqual(['Healthy', '1 check missed', 'Unhealthy', '1 check passed']);
});

test('F4: the schema, FIGURE_PARTS and DRIVERS list the same seven figures, pool beside switch; pool draws and is driven', () => {
  const ids = ['dhcp', 'firewall', 'net-map', 'osi', 'pool', 'subnet', 'switch'];
  expect([...figureIdSchema.options].sort()).toEqual(ids);
  expect(Object.keys(FIGURE_PARTS).sort()).toEqual(ids);
  expect(Object.keys(DRIVERS).sort()).toEqual(ids);
  expect(DRIVERS.pool).toBe(poolDriver);
  expect(drawFigure('pool').svg.startsWith('<svg data-figure="pool"')).toBe(true);
  expect(FIGURE_PARTS.pool).toMatchObject({ layers: [], board: false, start: false, cues: { skip: 'text', 'no-answer': 'text' }, args: { skip: ['a', 'b', 'c'], 'no-answer': ['a', 'b', 'c'] } });
});

test('F9: types.ts says args and routes are for osi, switch and pool; dhcp, osi, switch and pool', () => {
  const t = read('src/art/scenes/types.ts');
  expect(t).toContain('(osi, switch and pool); a cue');
  expect(t).toContain('(dhcp, osi, switch and pool); absent');
});
