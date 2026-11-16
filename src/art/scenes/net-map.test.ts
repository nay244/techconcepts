// @vitest-environment jsdom
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { normaliseFigure, sha256 } from '../../test/figure-hash';
import { CAFE_OPEN, groupsOf, HOME_OPEN, PHONE_OPEN, PROXIES_OPENS, SERVER_OPEN, STRANGER_OPEN, VOICE_OPEN, VPN_SERVER_OPEN, VPN_WEB_OPEN, withoutD11, withoutVpn } from '../../test/svg-groups';
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
/** D12's voice plate, as D11's three places are; and D15b's VPN server, both its sites. */
const D12_SITES = ['voice', 'vpn', 'vpn-out'];
/** D15's Proxies parts, as D11's are: the forward proxy, the reverse proxy and the site's own `origin` stop. */
const D15_SITES = ['proxy', 'origin', 'reverse'];
/** D15's two layers' groups taken out whole: the mockup never drew them. */
const withoutProxies = (svg: string): string => PROXIES_OPENS.reduce((out, open) => groupsOf(out, open).rest, svg);
/** The data without a route from or to D11's, D12's or D15's places. */
const withoutD11Routes = (routes: NetMapData['routes']): NetMapData['routes'] =>
  Object.fromEntries(Object.entries(routes).filter(([key]) => !key.split('>').some((p) => [...D11_SITES, ...D12_SITES, ...D15_SITES].includes(p))));

test('drawNetMap matches the mockup map', async () => {
  const { svg, data } = drawNetMap();
  expect(svg.split(TRAIL_EDGE)).toHaveLength(2);
  // D11's groups come out whole first: unwrapping the phone first would leave its parts in the hash.
  // D15b's come out the same way, and home's wrappers open, before Router's are unwrapped.
  expect(await sha256(normaliseFigure(withoutRouterParts(groupsOf(withoutVpn(withoutProxies(withoutD11(svg))), VOICE_OPEN).rest)))).toBe(EXPECTED.svg);
  const { tops, routes, bays, ...mockup } = data as NetMapData;
  expect(Object.keys(tops)).toEqual(['isp', 'a', 'b', 'c', 'd']);
  expect(await sha256(JSON.stringify({ ...mockup, routes: withoutD11Routes(routes) }))).toBe(EXPECTED.data);
});

// D13 / B15a, attack cases 2b and 3a to 3c: where a parked tag waits.
test('the bays: four at the laptop, four on the web server, one on each internet router, at the router’s top', () => {
  const { bays, routes } = drawNetMap().data as NetMapData;
  expect(Object.keys(bays)).toEqual(['laptop', 'web', 'isp', 'a', 'b', 'c', 'd']);
  expect(Object.values(bays).map((b) => b.length)).toEqual([4, 4, 1, 1, 1, 1, 1]);
  expect(bays.laptop![0]).toEqual([-62.5, 84.5, 0.4]);
  expect(bays.laptop![3]).toEqual([-62.5, 116.9, 0.4]);
  expect(bays.web![0]).toEqual([89, -88, 18.8]);
  expect(bays.web![3]).toEqual([89, -79, 5]);
  for (const r of ['isp', 'a', 'b', 'c', 'd']) {
    expect(bays[r]![0], r).toEqual(routes[`laptop>${r}`]!.at(-1));
    expect(bays[r]![0]![2], r).toBe(6.2);
  }
  for (const none of ['router', 'phone', 'resolver', 'mail']) expect(none in bays, none).toBe(false);
});

test('the bays do not depend on which layers the map draws', () => {
  expect((drawNetMap(['tcp:web']).data as NetMapData).bays).toEqual((drawNetMap().data as NetMapData).bays);
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

// D12 / B14, attack cases 2 and 5: the voice file is the art, and the code emits it.
test('prototypes/d12-part-voice.svg is the five groups the map draws for the voice plate, in order', () => {
  const { groups } = groupsOf(drawNetMap().svg, VOICE_OPEN);
  expect(groups).toHaveLength(5);
  const file: string = readFileSync('prototypes/d12-part-voice.svg', 'utf8');
  expect(file.startsWith(HEADER)).toBe(true);
  expect(file.endsWith('</svg>\n')).toBe(true);
  expect(file.slice(HEADER.length, -'</svg>\n'.length)).toBe(groups.join(''));
});

test('the voice plate has one light of its own, and a way to and from every base place', () => {
  const { svg, data } = drawNetMap();
  const ids = [...svg.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]!);
  expect(ids.filter((x) => x === 'nm-tcp-udp-busy-voice')).toHaveLength(1);
  expect(svg).toContain('CALL.EXAMPLE.NET');
  const { routes } = data as NetMapData;
  // Every base place has a way to the voice server and back (nine places, so 18 ways).
  const voice = Object.keys(routes).filter((key) => key.split('>').includes('voice'));
  expect(voice).toHaveLength(18);
  for (const place of NET_MAP_BASE_PLACES) {
    expect(routes[`${place}>voice`], place).toBeDefined();
    expect(routes[`voice>${place}`], place).toBeDefined();
  }
  expect(routes['voice>laptop']).toEqual([...routes['laptop>voice']!].reverse());
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
    expect([...callout.querySelectorAll('text')].map((t) => t.textContent), key).toEqual([...plate.lines, ...(plate.kind === 'site' ? plate.behind.flat() : [])].map((l) => l.text));
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

// D15a / B18a (prototypes/d15-proxies-cases.md, 1 and 2, with E2): the two Proxies layers add to the map and change nothing in it.
const NEW_ROUTE_ENDS = ['proxy', 'origin', 'reverse'];
const isNewRoute = (key: string): boolean => key.split('>').some((p) => NEW_ROUTE_ENDS.includes(p));
const isVpnRoute = (key: string): boolean => key.split('>').some((p) => p === 'vpn' || p === 'vpn-out');

test('1a: without the two proxies layers the map is today’s, character for character', async () => {
  const { svg } = drawNetMap();
  expect(PROXIES_OPENS.map((open) => groupsOf(svg, open).groups.length)).toEqual([5, 5]);
  // With VPN's groups cut and home opened too (D15b), it is the same string.
  const rest = withoutVpn(PROXIES_OPENS.reduce((out, open) => groupsOf(out, open).rest, svg));
  expect(rest).toHaveLength(870295);
  expect(await sha256(rest)).toBe('4327eb6509888bc8fc1ff02b50407c4b75ad079f05385cded0a6cc00b5237165');
});

test('1c: the frame, the busy ids and the parts the map hides', () => {
  const { svg } = drawNetMap();
  expect(/viewBox="[^"]+"/.exec(svg)![0]).toBe('viewBox="-98 -60 685 378"');
  const host = document.createElement('div');
  host.innerHTML = svg;
  const ids = [...host.querySelectorAll('[id]')].map((el) => el.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const id of ['nm-proxies-busy-proxy', 'nm-proxies-busy-reverse', 'nm-proxies-busy-origin']) expect(ids.filter((i) => i === id), id).toHaveLength(1);
  expect(host.querySelectorAll('[data-base="proxy"][data-hidden]')).toHaveLength(5);
  expect(host.querySelectorAll('[data-base="reverse"][data-hidden]')).toHaveLength(3);
  expect(host.querySelectorAll('[data-base="direct"]')).toHaveLength(1);
  expect(host.querySelectorAll('[data-base="direct"][data-hidden]')).toHaveLength(0);
});

test('1d: the still map for any layer set a lesson uses draws no part of Proxies, and a layer set of Proxies shows its parts', () => {
  expect(drawNetMap(['https:web']).svg).not.toMatch(/data-base="(proxy|reverse|direct)"/);
  expect(drawNetMap(['proxies:site']).svg).toMatch(/data-base="direct"/);
});

test('2a: every route of today’s map is there unchanged; the 60 new ones each end at the proxy, the site or the reverse proxy', async () => {
  const { data } = drawNetMap();
  const { routes } = data as NetMapData;
  const keys = Object.keys(routes).filter((key) => !isVpnRoute(key));
  expect(keys.filter(isNewRoute)).toHaveLength(60);
  expect(keys).toHaveLength(374);
  // The new keys come after the old ones, so the data without them is today's, key for key.
  expect(keys.slice(0, 314).some(isNewRoute)).toBe(false);
  const old = { ...(data as NetMapData), routes: Object.fromEntries(Object.entries(routes).filter(([key]) => !isNewRoute(key) && !isVpnRoute(key))) };
  expect(await sha256(JSON.stringify(old))).toBe('3f337f5faa941d632972e600c67bd6d65c550db9a2f7e2fabac29d7ceb94013c');
});

test('2b: the tunnel enters the forward proxy by its cable in and leaves by its cable out, at one point on its top', () => {
  const { routes } = drawNetMap().data as NetMapData;
  const inward = routes['laptop>proxy']!;
  const outward = routes['proxy>origin']!;
  expect(inward.at(-1)).toEqual([-96, -88, 8.6]);
  expect(outward[0]).toEqual([-96, -88, 8.6]);
  // The way in runs down the cable in (x of its port), and the way out leaves along the cable out (y of its port).
  expect(inward.at(-2)![0]).toBe(-104);
  expect(outward[1]![1]).toBe(-96);
});

test('2c: the reverse proxy’s own way to the web server is 4 points on the plate, and does not run out to router c', () => {
  const { routes } = drawNetMap().data as NetMapData;
  const way = routes['reverse>origin']!;
  expect(way).toHaveLength(4);
  expect([way[0], way.at(-1)]).toEqual([[66, -71, 8.6], [90, -71, 3.4]]);
  expect(way.map((p) => p.join())).not.toContain(routes['laptop>c']!.at(-1)!.join());
  expect(routes['origin>reverse']).toEqual([...way].reverse());
});

test('5: the two part files are the layers’ groups in draw order, shown', () => {
  const { svg } = drawNetMap();
  const part = (open: string): string => {
    const shown = open.replace(' display="none"', '');
    return `<svg xmlns="http://www.w3.org/2000/svg" class="lm-svg nm" viewBox="-98 -60 685 378">${groupsOf(svg, open).groups.map((g) => shown + g.slice(open.length)).join('')}</svg>\n`;
  };
  expect(part(PROXIES_OPENS[1]!)).toBe(readFileSync('prototypes/d15-proxies-part-proxy.svg', 'utf8'));
  expect(part(PROXIES_OPENS[0]!)).toBe(readFileSync('prototypes/d15-proxies-part-site.svg', 'utf8'));
});

// D15b, VPN: the files are the art, and the code emits them; the café takes home's place; the server has two sites.
test.each([
  ['server', VPN_SERVER_OPEN, 5],
  ['web', VPN_WEB_OPEN, 5],
  ['cafe', CAFE_OPEN, 3],
] as const)('prototypes/d15-vpn-part-%s.svg is exactly the whole groups the map draws for it, in order', (name, open, count) => {
  const { groups } = groupsOf(drawNetMap().svg, open);
  expect(groups).toHaveLength(count);
  const file: string = readFileSync(`prototypes/d15-vpn-part-${name}.svg`, 'utf8');
  expect(file.startsWith(HEADER)).toBe(true);
  expect(file.endsWith('</svg>\n')).toBe(true);
  expect(file.slice(HEADER.length, -'</svg>\n'.length)).toBe(groups.join(''));
});

test('the VPN server: one light for each of its two sites, a way between every base place and each, and the café drawn hidden', () => {
  const { svg, data } = drawNetMap();
  const ids = [...svg.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]!);
  expect(new Set(ids).size).toBe(ids.length);
  for (const id of ['nm-vpn-busy-vpn', 'nm-vpn-busy-vpn-out', 'nm-listener']) expect(ids.filter((x) => x === id), id).toHaveLength(1);
  const { routes } = data as NetMapData;
  for (const site of ['vpn', 'vpn-out']) for (const place of NET_MAP_BASE_PLACES) expect(routes[`${place}>${site}`], `${place}>${site}`).toBeDefined();
  // The tunnel's cable and the plain leg's are not the same: one leaves for router a, the other for router c.
  expect(routes['laptop>vpn']!.at(-2)).not.toEqual(routes['web>vpn-out']!.at(-2));
  expect(routes['vpn-out>web']).toBeDefined();
  const cafe = groupsOf(svg, CAFE_OPEN).groups.join('');
  expect(cafe).toContain('CAFÉ WI-FI · 192.168.1.0/24');
  expect(cafe).toContain('192.168.1.66');
  // The laptop keeps its address; example.net's plate shows no port.
  expect(svg).toContain('192.168.1.100');
  expect(groupsOf(svg, VPN_WEB_OPEN).groups.join('')).not.toMatch(/:(80|443)\b/);
});

// D15b / B18b (prototypes/d15-vpn-cases.md, 3, 3b and 5 to 8b, with E21): VPN's groups add to the map and change nothing in it.
const vpnHost = (): HTMLElement => {
  const host = document.createElement('div');
  host.innerHTML = drawNetMap().svg;
  return host;
};

test('3: the chain that hashes to the mockup needs `withoutVpn`: without it the hash is another', async () => {
  const { svg } = drawNetMap();
  const chain = (cut: (s: string) => string): string => normaliseFigure(withoutRouterParts(groupsOf(cut(withoutProxies(withoutD11(svg))), VOICE_OPEN).rest));
  expect(await sha256(chain(withoutVpn))).toBe(EXPECTED.svg);
  expect(await sha256(chain((s) => s))).not.toBe(EXPECTED.svg);
});

test('3b: the frame stays, and VPN’s five sites’ routes are the only ones its patch adds', () => {
  const { svg, data } = drawNetMap();
  expect(/viewBox="[^"]+"/.exec(svg)![0]).toBe('viewBox="-98 -60 685 378"');
  const { routes } = data as NetMapData;
  const vpnKeys = Object.keys(routes).filter((key) => key.split('>').some((p) => p === 'vpn' || p === 'vpn-out'));
  expect(vpnKeys.length).toBeGreaterThan(0);
  expect(Object.keys(routes).slice(-vpnKeys.length)).toEqual(vpnKeys);
});

test('5: the listener is one group with one head line and two body lines, once', () => {
  const host = vpnHost();
  const listener = host.querySelectorAll('#nm-listener');
  expect(listener).toHaveLength(1);
  expect(listener[0]!.querySelectorAll('.nm-hear-head')).toHaveLength(1);
  expect(listener[0]!.querySelectorAll('.nm-hear-body')).toHaveLength(1);
  expect(listener[0]!.querySelectorAll('.nm-hear-head > *, .nm-hear-head > path, .nm-hear-head > rect').length).toBeGreaterThanOrEqual(1);
});

test('6: the layers end with VPN’s two, the server first, and the server stands at NE', () => {
  expect(Object.keys(NET_MAP_LAYERS).slice(-5)).toEqual(['tcp-udp:voice', 'proxies:site', 'proxies:proxy', 'vpn:vpn', 'vpn:web']);
  expect(NET_MAP_LAYERS['vpn:vpn']!.slot).toBe('NE');
  expect(NET_MAP_LAYERS['vpn:web']!.slot).toBe('E');
});

test('7: the tunnel and the plain leg end at the pad’s centre by different cables, a on the left, c on the right', () => {
  const { routes } = drawNetMap().data as NetMapData;
  expect(routes['laptop>vpn']!.at(-1)).toEqual([-31, -145, 3]);
  expect(routes['web>vpn-out']!.at(-1)).toEqual([-31, -145, 3]);
  const [a, c] = [routes['isp>a'] ?? routes['laptop>a']!, routes['laptop>c']!];
  expect(routes['laptop>vpn']!.some((p) => a.some((q) => q.join() === p.join()))).toBe(true);
  expect(routes['laptop>vpn']!.some((p) => c.at(-1)!.join() === p.join())).toBe(false);
  expect(routes['vpn-out>web']!.some((p) => c.at(-1)!.join() === p.join())).toBe(true);
  expect(routes['vpn-out>web']!.some((p) => a.at(-1)!.join() === p.join())).toBe(false);
});

test('8: example.net’s plate says "Web server" and 203.0.113.80, with no port', () => {
  const web = groupsOf(drawNetMap().svg, VPN_WEB_OPEN).groups.join('');
  const words = [...web.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
  expect(words).toContain('Web server');
  expect(words).toContain('203.0.113.80');
  expect(web).not.toMatch(/:80\b|:443\b|port/i);
});

test('8b: the café’s engraving, the listener’s callout and home’s two groups', () => {
  const { svg } = drawNetMap();
  const cafe = groupsOf(svg, CAFE_OPEN).groups.join('');
  expect(cafe).toContain('CAFÉ WI-FI · 192.168.1.0/24');
  const calls = [...cafe.matchAll(/<text[^>]*x="-80"[^>]*y="(\d+)"[^>]*>([^<]*)<\/text>|<text[^>]*y="(\d+)"[^>]*x="-80"[^>]*>([^<]*)<\/text>/g)];
  expect(calls.map((m) => m[2] ?? m[4])).toEqual(['Someone listening', '192.168.1.66']);
  expect(calls.map((m) => m[1] ?? m[3])).toEqual(['280', '296']);
  expect(cafe).toMatch(/text-anchor="start"/);
  const home = groupsOf(svg, HOME_OPEN).groups;
  expect(home).toHaveLength(2);
  expect(home.join('')).toContain('YOUR HOME · 192.168.1.0/24');
});
