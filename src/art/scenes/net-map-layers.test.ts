import { expect, test } from 'vitest';
import { NAME_SERVER_SITES, NET_MAP_BASE_PLACES, NET_MAP_LAYERS, plateSites } from './net-map-layers';
import { FIGURE_PARTS } from './parts';

const SITES = ['web', 'call', 'root', 'tld', 'auth', 'out', 'in', 'mail', 'files', 'host'];

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
  ]);
  for (const [key, plate] of Object.entries(NET_MAP_LAYERS)) {
    // The name servers have no one site: the plate is keyed by its kind.
    expect(key.split(':')[1], key).toBe(plate.kind === 'names' ? 'names' : plate.site);
    expect(['E', 'SE'], key).toContain(plate.slot);
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
  expect(NET_MAP_BASE_PLACES).toEqual(['laptop', 'router', 'resolver', 'isp', 'a', 'b', 'c', 'd']);
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
    },
    layers: Object.keys(NET_MAP_LAYERS),
    board: false,
  });
});
