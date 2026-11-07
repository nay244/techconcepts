// @vitest-environment jsdom
import { expect, test } from 'vitest';
import { normaliseFigure, sha256 } from '../../test/figure-hash';
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

test('drawNetMap matches the mockup map', async () => {
  const { svg, data } = drawNetMap();
  expect(svg.split(TRAIL_EDGE)).toHaveLength(2);
  expect(await sha256(normaliseFigure(svg.replace(TRAIL_EDGE, '')))).toBe(EXPECTED.svg);
  expect(await sha256(JSON.stringify(data))).toBe(EXPECTED.data);
});

test('the lost trail’s edge is drawn just under the trail, so the red sits on the figure’s background', () => {
  expect(drawNetMap().svg).toContain(`${TRAIL_EDGE}<polyline class="nm-trail" id="nm-trail" points="" style="opacity:0"/>`);
});

test('the map keeps the mockup’s one fixed frame', () => {
  expect(drawNetMap().svg).toMatch(/^<svg data-figure="net-map" class="lm-svg nm" viewBox="-98 -60 685 378" role="img" aria-label="[^"]+">/);
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
