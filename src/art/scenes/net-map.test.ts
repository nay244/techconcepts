// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { normaliseFigure, sha256 } from '../../test/figure-hash';
import { groupsOf, PHONE_OPEN, SERVER_OPEN, STRANGER_OPEN, withoutD11 } from '../../test/svg-groups';
import { drawFigure } from './index';
import { drawNetMap, type NetMapData } from './net-map';
import { NET_MAP_BASE_PLACES, NET_MAP_LAYERS, NET_MAP_TAG_MAX, plateSites } from './net-map-layers';

// SHA-256 of the mockup's map, recorded once by a one-off script (never read by this test). FIGS/net-map.mjs has no
// buildMap(): FIGS/lesson-internet2.mjs builds internet-v2.html's map from its buildBase(), buildScene(), frameOf() and
// mapSvg(), and swaps one protocol's parts into the empty nm-l-* groups as the learner moves. The script fills those
// groups with every protocol at once, from the same calls:
// - each server of FIGS/protocols.mjs alone, `buildScene({ laptop: '', servers: [server], tags: [] })`, its under,
//   plates, cables, things and own callouts each wrapped in `<g data-layer="<protocol>:<site>" display="none">` in its
//   nm-l-* group, its `nm-busy-`/`nm-hold-` ids given the protocol (`nm-http-busy-web`), as six layers draw a web server;
// - the laptop's, the resolver's and the internet's callouts from `buildScene({ laptop: '', servers: [], ... })`, with
//   a router callout (`Your router` and two empty lines, `nm-router-1` and `nm-router-2`) wrapped in a hidden `#nm-router`;
// - one tag for each label length from 1 to 16, its words left empty (`nm-tag-1` … `nm-tag-16`);
// - the frame from `frameOf()` over all of these; the root's `id="nm-svg"` as `data-figure="net-map"`;
// - two site additions no FIGS part draws: the carrier under the tag (`#nm-over`) and the word LOST on the drop mark.
// Then normaliseFigure(). The data is `{ ...camera(), routes }`, with `buildScene(protocol's servers).route(a, b)` for
// every ordered pair of places each protocol uses, as `JSON.stringify`.
// The lost trail's edge (`#nm-trail-edge`, net-map.css) came later; the map is checked without it, and it on its own.
const EXPECTED = {
  svg: '5146c02dcb7efbddf0c50d500c1db6a098d32e9ef2148ce5af87726fd5fd7132',
  data: '9206d017007b801efb42ea2777fc4faccf9a9229c993083ebc4d5d2888439b6f',
};

/** The protocols of lesson 1, in its order. DHCP draws no server of its own. */
const PROTOCOLS = ['http', 'https', 'tcp', 'udp', 'ip', 'dns', 'dhcp', 'icmp', 'smtp', 'pop3', 'imap', 'ftp', 'ssh', 'tls'];
/** The groups a server's parts are drawn in, back to front, as the mockup's map draws one protocol's. */
const SLOTS = ['nm-l-under', 'nm-l-plates', 'nm-l-cables', 'nm-l-things', 'nm-l-calls'];

/** The figure's background under a lost trail, so the red always has its own edge: a plain stroke, hidden at first. */
const TRAIL_EDGE = '<polyline class="nm-trail-edge" id="nm-trail-edge" points="" style="opacity:0"/>';

/**
 * What Router added to the map, as the hash of the mockup's map leaves it out: the name strips and the DROPPED mark
 * (hidden parts at the end of the figure), the groups that let a unit hide the resolver (each holds the parts the
 * mockup drew, in the same order), and the routers' tops in the data.
 */
const STRIPS = /<g id="nm-names">.*?<\/text><\/g><\/g>/;
const DISCARD = /<g class="nm-drop nm-discard" id="nm-discard".*?<\/text><\/g>/;
function withoutRouterParts(svg: string): string {
  let out = svg.replace(TRAIL_EDGE, '').replace(STRIPS, '').replace(DISCARD, '');
  // Unwrap each `<g data-base="…">`: drop its opening tag and the `</g>` that closes it.
  for (let at = out.indexOf('<g data-base="'); at !== -1; at = out.indexOf('<g data-base="')) {
    const open = out.indexOf('>', at) + 1;
    let depth = 1;
    let i = open;
    while (depth > 0) {
      const next = out.slice(i).search(/<g[\s>]|<\/g>/);
      i += next;
      depth += out.startsWith('</g>', i) ? -1 : 1;
      i += out.startsWith('</g>', i) ? 4 : 2;
    }
    out = out.slice(0, at) + out.slice(open, i - 4) + out.slice(i);
  }
  return out;
}

const D11_SITES = ['phone', 'server', 'stranger'];
/** The data without a route from or to D11's places. */
const withoutD11Routes = (routes: NetMapData['routes']): NetMapData['routes'] =>
  Object.fromEntries(Object.entries(routes).filter(([key]) => !key.split('>').some((p) => D11_SITES.includes(p))));

test('drawNetMap matches the mockup map', async () => {
  const { svg, data } = drawNetMap();
  expect(svg.split(TRAIL_EDGE)).toHaveLength(2);
  // D11's groups come out whole first: unwrapping the phone first would leave its parts in the hash.
  expect(await sha256(normaliseFigure(withoutRouterParts(withoutD11(svg))))).toBe(EXPECTED.svg);
  const { tops, routes, ...mockup } = data as NetMapData;
  expect(Object.keys(tops)).toEqual(['isp', 'a', 'b', 'c', 'd']);
  expect(await sha256(JSON.stringify({ ...mockup, routes: withoutD11Routes(routes) }))).toBe(EXPECTED.data);
});

// D11 / B13, attack cases 1 to 4: the six SVG files are the art, and the code emits them.
const FILE = (name: string): string => readFileSync(`prototypes/d11-${name}.svg`, 'utf8');
const HEADER = '<svg xmlns="http://www.w3.org/2000/svg" class="lm-svg nm" viewBox="-98 -60 685 378">';

test.each([
  ['phone', PHONE_OPEN, 2],
  ['stranger', STRANGER_OPEN, 5],
  ['server', SERVER_OPEN, 5],
] as const)('the %s’s file is exactly the whole groups the map draws for it, in order', (name, open, count) => {
  const { groups } = groupsOf(drawNetMap().svg, open);
  expect(groups).toHaveLength(count);
  const file = FILE(`part-${name}`);
  expect(file.startsWith(HEADER)).toBe(true);
  expect(file.endsWith('</svg>\n')).toBe(true);
  expect(file.slice(HEADER.length, -'</svg>\n'.length)).toBe(groups.join(''));
});

test('the phone’s groups are hidden whatever the layers; a description on a layer draws nothing', () => {
  expect(PHONE_OPEN).toContain('data-hidden=""');
  const plain = drawNetMap().svg;
  const described = NET_MAP_LAYERS['nat:stranger']!.describe;
  expect(described).toBeDefined();
  expect(plain).not.toContain(described!);
  expect(groupsOf(plain, STRANGER_OPEN).groups.join('')).not.toContain('someone else’s computer');
});

test('the map keeps its frame and its ids are unique, with one light for each new part', () => {
  const { svg } = drawNetMap();
  expect(svg).toContain('viewBox="-98 -60 685 378"');
  const ids = [...svg.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]!);
  expect(new Set(ids).size).toBe(ids.length);
  for (const id of ['nm-busy-phone', 'nm-ports-busy-server', 'nm-nat-busy-stranger']) expect(ids.filter((x) => x === id), id).toHaveLength(1);
});

test('the phone’s way to the router, and back', () => {
  const { routes } = drawNetMap().data as NetMapData;
  expect(routes['phone>router']).toEqual([[-55.5, 93, 3.2], [-66, 83, 2.6], [-74, 71, 14]]);
  expect(routes['router>phone']).toEqual([...routes['phone>router']!].reverse());
});

test('the stranger’s way to your router is over two internet routers’ tops, from its box to the router’s top', () => {
  const route = (drawNetMap().data as NetMapData).routes['stranger>router']!;
  expect(route).toHaveLength(11);
  expect(route[0]).toEqual([-32, -173, 3]);
  const at = (p: number[]): number => route.findIndex((q) => q[0] === p[0] && q[1] === p[1] && q[2] === p[2]);
  expect(at([-28, -20, 6.2])).toBeGreaterThan(0);
  expect(at([-30, 26, 6.2])).toBeGreaterThan(at([-28, -20, 6.2]));
  expect(route.at(-1)).toEqual([-74, 71, 14]);
});

test('the server’s way from the laptop is the web server’s, for its first 13 points, then its own', () => {
  const { routes } = drawNetMap().data as NetMapData;
  expect(routes['laptop>server']!.slice(0, 13)).toEqual(routes['laptop>web']!.slice(0, 13));
  expect(routes['laptop>server']![13]).not.toEqual(routes['laptop>web']![13]);
});

test('the lost trail’s edge is drawn just under the trail, so the red sits on the figure’s background', () => {
  expect(drawNetMap().svg).toContain(`${TRAIL_EDGE}<polyline class="nm-trail" id="nm-trail" points="" style="opacity:0"/>`);
});

test('the map keeps the mockup’s one fixed frame', () => {
  expect(drawNetMap().svg).toMatch(/^<svg data-figure="net-map" class="lm-svg nm" viewBox="-98 -60 685 378" role="img" aria-label="[^"]*\S[^"]*">/);
});

test('the figure keeps its ids to itself, with no grain and no closing tag an HTML parser would act on', () => {
  const { svg } = drawNetMap();
  const ids = [...svg.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]!);
  expect(ids.length).toBeGreaterThan(0);
  expect(ids.filter((id) => !id.startsWith('nm-'))).toEqual([]);
  expect(new Set(ids).size).toBe(ids.length);
  expect(svg).not.toMatch(/lm-grain/);
  expect(svg).not.toMatch(/<\/(script|style|body|html|head)/i);
});

test('every layer key is drawn exactly once and hidden by default', () => {
  const host = document.createElement('div');
  host.innerHTML = drawNetMap().svg;
  const keys = Object.keys(NET_MAP_LAYERS);
  const all = [...host.querySelectorAll('[data-layer]')];
  // A server's parts are spread over the five groups the mockup draws them in: once in each, and nowhere else.
  expect(all).toHaveLength(keys.length * SLOTS.length);
  for (const slot of SLOTS) {
    const drawn = [...host.querySelectorAll(`#${slot} > [data-layer]`)];
    expect(drawn.map((g) => g.getAttribute('data-layer')), slot).toEqual(keys);
    for (const g of drawn) expect(g.getAttribute('display'), `${slot} ${g.getAttribute('data-layer')}`).toBe('none');
  }
  // Each layer draws its own plate: its engraved label is in its plates group.
  for (const [key, plate] of Object.entries(NET_MAP_LAYERS)) {
    expect(host.querySelector(`#nm-l-plates > [data-layer="${key}"]`)!.textContent, key).toContain(plate.label);
    const callout = host.querySelector(`#nm-l-calls > [data-layer="${key}"]`)!;
    expect([...callout.querySelectorAll('text')].map((t) => t.textContent), key).toEqual(plate.lines.map((l) => l.text));
  }
});

test('a route exists between every pair of places a protocol uses', () => {
  const { routes } = drawNetMap().data as NetMapData;
  for (const protocol of PROTOCOLS) {
    const own = Object.entries(NET_MAP_LAYERS).filter(([key]) => key.startsWith(`${protocol}:`));
    const places = [...NET_MAP_BASE_PLACES, ...own.flatMap(([, plate]) => plateSites(plate))];
    for (const from of places) {
      for (const to of places) {
        if (from === to) continue;
        const route = routes[`${from}>${to}`];
        expect(route, `${protocol}: ${from}>${to}`).toBeDefined();
        expect(route!.length, `${protocol}: ${from}>${to}`).toBeGreaterThan(1);
        for (const point of route!) expect(point).toHaveLength(3);
      }
    }
  }
});

test('a message from the laptop to the web server rides over the home router, the provider, router b and router c', () => {
  const { routes } = drawNetMap().data as NetMapData;
  // Routers are hopped over: the tag climbs above each one it passes (6.2 high), and rides the cables (2.6) between.
  const hops = routes['laptop>web']!.filter(([, , z]) => z > 5);
  expect(hops.map(([x, y]) => [x, y])).toEqual([
    [-74, 71],
    [-30, 26],
    [6, 4],
    [32, -24],
  ]);
  // The laptop and the home router never leave home.
  expect(routes['laptop>router']!.every(([x, y]) => x < -50 && y > 50)).toBe(true);
});

test('one tag for each label length, its words left for the driver', () => {
  const host = document.createElement('div');
  host.innerHTML = drawNetMap().svg;
  const tags = [...host.querySelectorAll('#nm-l-tags > .nm-tag')];
  expect(tags.map((t) => t.id)).toEqual(Array.from({ length: NET_MAP_TAG_MAX }, (_, i) => `nm-tag-${i + 1}`));
  for (const tag of tags) expect(tag.querySelector('.nm-tag-t')!.textContent).toBe('');
  expect(NET_MAP_TAG_MAX).toBe(16);
});

test('drawFigure draws the network map', () => {
  expect(drawFigure('net-map')).toEqual(drawNetMap());
});

test('asked for some layers only, the map holds just those, shown, in the same frame and with the same routes', () => {
  const whole = drawNetMap();
  const part = drawNetMap(['http:web']);
  expect(part.data).toEqual(whole.data);
  expect(/viewBox="[^"]+"/.exec(part.svg)![0]).toBe(/viewBox="[^"]+"/.exec(whole.svg)![0]);
  const layers = [...part.svg.matchAll(/<g data-layer="([^"]+)"([^>]*)>/g)];
  expect(new Set(layers.map((m) => m[1]))).toEqual(new Set(['http:web']));
  // Shown: no display="none" on the layer's groups, unlike the whole map's.
  expect(layers.every((m) => !m[2]!.includes('display'))).toBe(true);
  expect(whole.svg).toContain('<g data-layer="http:web" display="none">');
  // And much smaller: the other thirteen layers are not there.
  expect(part.svg.length).toBeLessThan(whole.svg.length / 2);
});
