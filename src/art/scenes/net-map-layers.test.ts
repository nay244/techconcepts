import { expect, test } from 'vitest';
import { NAME_SERVER_SITES, NET_MAP_BASE_PLACES, NET_MAP_LAYERS, NET_MAP_OPTIONAL, plateSites } from './net-map-layers';
import { FIGURE_PARTS } from './parts';

const SITES = ['web', 'call', 'root', 'tld', 'auth', 'out', 'in', 'mail', 'files', 'host', 'server', 'stranger', 'voice'];

test('the layers are every protocol’s servers, keyed <protocol>:<site>, in the lesson’s order', () => {
  expect(Object.keys(NET_MAP_LAYERS)).toEqual([
    'http:web',
    'https:web',
    'tcp:web',
    'udp:call',
    'ip:web',
    'dns:names',
    'icmp:web',
    'smtp:out',
    'smtp:in',
    'pop3:mail',
    'imap:mail',
    'ftp:files',
    'ssh:host',
    'tls:web',
    'ports:server',
    'nat:stranger',
    'tcp-udp:voice',
  ]);
  for (const [key, plate] of Object.entries(NET_MAP_LAYERS)) {
    // The name servers have no one site: the plate is keyed by its kind.
    expect(key.split(':')[1], key).toBe(plate.kind === 'names' ? 'names' : plate.site);
    expect(['E', 'SE', 'N'], key).toContain(plate.slot);
    expect(plate.lines[0]?.cls, key).toBe('nm-name');
  }
});

test('each plate keeps the mockup’s words, slot and callout', () => {
  expect(NET_MAP_LAYERS['http:web']).toEqual({
    kind: 'web',
    slot: 'E',
    site: 'web',
    label: 'EXAMPLE.NET',
    lines: [
      { cls: 'nm-name', text: 'Web server' },
      { cls: 'nm-addr', text: '203.0.113.80 · port 80' },
    ],
  });
  expect(NET_MAP_LAYERS['smtp:in']).toEqual({
    kind: 'mail',
    slot: 'SE',
    site: 'in',
    puck: 'd',
    label: 'MX.EXAMPLE.ORG',
    at: [220, 280],
    lines: [
      { cls: 'nm-name', text: 'Sam’s mail server' },
      { cls: 'nm-addr', text: 'mx.example.org' },
    ],
  });
  expect(NET_MAP_LAYERS['dns:names']!.lines.map((l) => l.text)).toEqual([
    'Name servers',
    'root · 192.0.2.10',
    '.app · 192.0.2.20',
    'ns1 · 198.51.100.40',
  ]);
});

test('a plate’s sites are the places a message can stop on it', () => {
  expect(plateSites(NET_MAP_LAYERS['ftp:files']!)).toEqual(['files']);
  expect(plateSites(NET_MAP_LAYERS['dns:names']!)).toEqual(NAME_SERVER_SITES);
  expect(NAME_SERVER_SITES).toEqual(['root', 'tld', 'auth']);
});

test('FIGURE_PARTS["net-map"] lists home, the internet, the resolver and every site, the cues, and the layers', () => {
  expect(NET_MAP_BASE_PLACES).toEqual(['laptop', 'router', 'resolver', 'isp', 'a', 'b', 'c', 'd', 'phone']);
  expect(FIGURE_PARTS['net-map']).toEqual({
    places: [...NET_MAP_BASE_PLACES, ...SITES],
    cues: {
      status: 'text',
      conn: 'text',
      page: 'text',
      lock: 'flag',
      tray: 'text',
      'status-known': 'flag',
      'status-done': 'flag',
      addr: 'text',
      url: 'text',
      drop: 'text',
      hide: 'text',
      show: 'text',
      park: 'text',
      unpark: 'text',
    },
    // Router's: a packet dropped at one of the internet's routers, and the resolver left off the map; D11's: the phone shown.
    args: { drop: ['isp', 'a', 'b', 'c', 'd'], hide: ['resolver'], show: ['phone'] },
    layers: Object.keys(NET_MAP_LAYERS),
    board: false,
    start: true,
  });
});

test('D12’s voice layer: a call plate on slot N behind the internet, cabled to router a, its callout ending at the left of the plate', () => {
  expect(NET_MAP_LAYERS['tcp-udp:voice']).toEqual({
    kind: 'call',
    slot: 'N',
    site: 'voice',
    puck: 'a',
    label: 'CALL.EXAMPLE.NET',
    describe: 'Behind the internet, the voice server the call goes through.',
    at: [290, -22],
    align: 'end',
    lines: [
      { cls: 'nm-name', text: 'Voice server' },
      { cls: 'nm-addr', text: '203.0.113.90 · port 16384' },
    ],
  });
});

test('D11’s two layers: Ports’ server on slot E with no port in its callout, and NAT’s stranger on slot N, drawing nothing of its description', () => {
  expect(NET_MAP_LAYERS['ports:server']).toEqual({
    kind: 'host',
    slot: 'E',
    site: 'server',
    label: 'EXAMPLE.NET',
    lines: [
      { cls: 'nm-name', text: 'A server' },
      { cls: 'nm-addr', text: '203.0.113.80' },
    ],
  });
  expect(NET_MAP_LAYERS['nat:stranger']).toMatchObject({
    kind: 'pc',
    slot: 'N',
    site: 'stranger',
    puck: 'a',
    label: 'ANOTHER NETWORK',
    describe: 'Behind the internet, someone else’s computer, on another network.',
    lines: [
      { cls: 'nm-name', text: 'Someone else' },
      { cls: 'nm-addr', text: '192.0.2.66' },
    ],
  });
  expect(NET_MAP_OPTIONAL).toEqual(['phone']);
  // Only the stranger and D12's voice server describe themselves.
  expect(Object.entries(NET_MAP_LAYERS).filter(([, p]) => p.describe !== undefined).map(([k]) => k)).toEqual(['nat:stranger', 'tcp-udp:voice']);
});
