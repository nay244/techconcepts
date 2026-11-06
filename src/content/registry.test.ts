import { expect, test, vi } from 'vitest';
import { CERT_TAGS } from './certs';
import { validateLesson } from './define';
import { estimateMinutes } from './estimate';
import {
  buildEntries,
  getEntries,
  getLesson,
  getTrack,
  groupLessonModules,
  neighbors,
  trackTotals,
} from './registry';
import { makeLesson, makeTwoUnitLesson } from './test-fixtures';
import { comingSoonTracks, networkingTrack, tracks } from './tracks';

// No lesson files exist yet, so available entries are built from fixtures, which
// need the stand-in figure parts to validate.
// The real lessons load here too (through the registry), so the fixture's parts are added to the real ones.
vi.mock('../art/scenes/parts', async (importOriginal) => ({
  FIGURE_PARTS: (await import('./test-fixtures')).withFixtureParts(
    (await importOriginal<typeof import('../art/scenes/parts')>()).FIGURE_PARTS,
  ),
}));

const lessonFor = (slug: string, title: string) => validateLesson(makeLesson({ slug, title })).lesson;

const SLUGS = [
  'how-the-internet-works', 'osi-model', 'packets',
  'ip-address', 'mac-address', 'switch', 'arp',
  'subnetting', 'router', 'dhcp',
  'ports', 'tcp-udp', 'nat', 'dns',
  'http-https', 'tls',
  'firewalls', 'proxies', 'load-balancers', 'vpn',
];

test('the networking track has 20 lessons in order, How the Internet Works first', () => {
  const e = buildEntries(networkingTrack, {});
  expect(e.map((x) => x.slug)).toEqual(SLUGS);
  expect(e.map((x) => x.number)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
  expect(e[0]).toMatchObject({ title: 'How the Internet Works', partTitle: 'The big picture' });
  expect(e.every((x) => !x.available)).toBe(true);
});

test('lesson numbers: how-the-internet-works 1, subnetting 8, dhcp 10, firewalls 17', () => {
  const number = (slug: string) => buildEntries(networkingTrack, {}).find((x) => x.slug === slug)?.number;
  expect([number('how-the-internet-works'), number('subnetting'), number('dhcp'), number('firewalls')]).toEqual([1, 8, 10, 17]);
});

test('networking track metadata, parts and titles', () => {
  expect(networkingTrack).toMatchObject({ id: 'networking', title: 'Networking Concepts', level: 'beginner' });
  expect(networkingTrack.parts.map((p) => [p.id, p.title, p.lessons.length])).toEqual([
    ['big-picture', 'The big picture', 3],
    ['local-network', 'Addresses & the local network', 4],
    ['between-networks', 'Getting between networks', 3],
    ['across-internet', 'Talking across the internet', 4],
    ['web', 'The web', 2],
    ['protect-scale', 'Protecting & scaling traffic', 4],
  ]);
  expect(networkingTrack.parts.flatMap((p) => p.lessons.map((l) => l.title))).toEqual([
    'How the Internet Works', 'OSI Model', 'Packets', 'IP Address', 'MAC Address', 'Switch', 'ARP', 'Subnetting', 'Router',
    'DHCP', 'Ports', 'TCP/UDP', 'NAT', 'DNS', 'HTTP/HTTPS', 'TLS', 'Firewalls', 'Proxies', 'Load Balancers', 'VPN',
  ]);
  const e = buildEntries(networkingTrack, {});
  expect(e.find((x) => x.slug === 'arp')).toMatchObject({ partTitle: 'Addresses & the local network' });
  expect(e.find((x) => x.slug === 'vpn')).toMatchObject({ partTitle: 'Protecting & scaling traffic', number: 20 });
});

test('tracks and coming-soon tracks', () => {
  expect(tracks).toEqual([networkingTrack]);
  expect(comingSoonTracks.map((t) => t.title)).toEqual([
    'How the Web Works', 'Cryptography', 'AI Concepts', 'Privilege Escalation', 'Threat & Vulnerability Management',
  ]);
  expect(comingSoonTracks.every((t) => t.blurb.length > 10)).toBe(true);
});

test('cert tags', () => {
  expect(CERT_TAGS).toEqual({
    'a-plus': 'CompTIA A+',
    'network-plus': 'CompTIA Network+',
    'security-plus': 'CompTIA Security+',
    'cysa-plus': 'CompTIA CySA+',
    ccna: 'Cisco CCNA',
    helpdesk: 'Helpdesk',
    'soc-analyst': 'SOC Analyst',
  });
});

// ------------------------------------------------------------ available entries

test('an available entry reports units, subtitle and maxPosition', () => {
  // One unit of five steps: Overview, 5 steps, Learn, Practice is 8 positions, 0 to 7.
  const dhcp = lessonFor('dhcp', 'DHCP');
  expect(buildEntries(networkingTrack, { dhcp }).find((x) => x.slug === 'dhcp')).toEqual({
    available: true,
    key: 'networking/dhcp',
    trackId: 'networking',
    slug: 'dhcp',
    url: '/networking/dhcp',
    number: 10,
    title: 'DHCP',
    subtitle: dhcp.subtitle,
    partTitle: 'Getting between networks',
    summary: dhcp.summary,
    minutes: estimateMinutes(dhcp),
    certTags: dhcp.certTags,
    stepCount: 5,
    units: 1,
    maxPosition: 7,
  });

  // Two units of five steps: 16 positions, 0 to 15.
  const internet = validateLesson(makeTwoUnitLesson({ slug: 'how-the-internet-works', title: 'How the Internet Works' })).lesson;
  expect(buildEntries(networkingTrack, { 'how-the-internet-works': internet })[0]).toMatchObject({
    available: true,
    number: 1,
    units: 2,
    stepCount: 10,
    maxPosition: 15,
    minutes: estimateMinutes(internet),
  });
});

test('unavailable entries carry only identity', () => {
  expect(buildEntries(networkingTrack, {})[0]).toEqual({
    available: false,
    key: 'networking/how-the-internet-works',
    trackId: 'networking',
    slug: 'how-the-internet-works',
    number: 1,
    title: 'How the Internet Works',
    partTitle: 'The big picture',
  });
});

test('neighbors skip unavailable lessons', () => {
  const e = buildEntries(networkingTrack, { dhcp: lessonFor('dhcp', 'DHCP'), firewalls: lessonFor('firewalls', 'Firewalls') });
  expect(neighbors(e, 'dhcp')).toMatchObject({ prev: null, next: { slug: 'firewalls' }, nextPlanned: true });
});

test('neighbors: prev and next are the nearest available lessons', () => {
  const lessons = {
    packets: lessonFor('packets', 'Packets'),
    dhcp: lessonFor('dhcp', 'DHCP'),
    dns: lessonFor('dns', 'DNS'),
  };
  const e = buildEntries(networkingTrack, lessons);
  expect(neighbors(e, 'dhcp')).toMatchObject({ prev: { slug: 'packets' }, next: { slug: 'dns' }, nextPlanned: true });
  expect(neighbors(e, 'packets')).toMatchObject({ prev: null, next: { slug: 'dhcp' }, nextPlanned: true });
  expect(neighbors(e, 'dns')).toMatchObject({ prev: { slug: 'dhcp' }, next: null, nextPlanned: true });
});

test('neighbors: nextPlanned is false when the next entry is available, or there is none', () => {
  const a = buildEntries(networkingTrack, { 'osi-model': lessonFor('osi-model', 'OSI Model'), packets: lessonFor('packets', 'Packets') });
  expect(neighbors(a, 'osi-model')).toMatchObject({ next: { slug: 'packets' }, nextPlanned: false });
  const last = buildEntries(networkingTrack, { vpn: lessonFor('vpn', 'VPN') });
  expect(neighbors(last, 'vpn')).toEqual({ prev: null, next: null, nextPlanned: false });
});

test('neighbors of an unknown slug are empty, and an unavailable lesson can be asked about', () => {
  expect(neighbors(buildEntries(networkingTrack, {}), 'nope')).toEqual({ prev: null, next: null, nextPlanned: false });
  const e = buildEntries(networkingTrack, { dhcp: lessonFor('dhcp', 'DHCP') });
  expect(neighbors(e, 'ports')).toMatchObject({ prev: { slug: 'dhcp' }, next: null, nextPlanned: true });
});

test('a title that differs from the track, a lesson not in the track, or a mismatched slug throws', () => {
  expect(() => buildEntries(networkingTrack, { dhcp: lessonFor('dhcp', 'Wrong') })).toThrow(/title/);
  expect(() => buildEntries(networkingTrack, { gopher: lessonFor('gopher', 'Gopher') })).toThrow(/gopher/);
  expect(() => buildEntries(networkingTrack, { dhcp: lessonFor('router', 'Router') })).toThrow(/slug/);
});

test('trackTotals counts planned (all entries), available and minutes', () => {
  const dhcp = lessonFor('dhcp', 'DHCP');
  const fw = lessonFor('firewalls', 'Firewalls');
  expect(trackTotals(buildEntries(networkingTrack, {}))).toEqual({ available: 0, planned: 20, minutes: 0 });
  expect(trackTotals(buildEntries(networkingTrack, { dhcp, firewalls: fw }))).toEqual({
    available: 2,
    planned: 20,
    minutes: estimateMinutes(dhcp) + estimateMinutes(fw),
  });
});

// ------------------------------------------------------------ module-level wiring

test('getTrack, getEntries and getLesson answer from the registry', () => {
  expect(getTrack('networking')).toBe(networkingTrack);
  expect(getTrack('nope')).toBeUndefined();
  expect(getEntries('networking')).toHaveLength(20);
  expect(getEntries('nope')).toEqual([]);
  expect(getLesson('networking', 'not-written-yet')).toBeUndefined();
  expect(getLesson('nope', 'dhcp')).toBeUndefined();
});

test('every lesson file that exists is available in the registry under its slug', () => {
  for (const entry of getEntries('networking')) {
    if (entry.available) expect(getLesson(entry.trackId, entry.slug)?.slug).toBe(entry.slug);
    else expect(getLesson(entry.trackId, entry.slug)).toBeUndefined();
  }
});

test('groupLessonModules groups by folder (track id) and file name (slug)', () => {
  const dhcp = lessonFor('dhcp', 'DHCP');
  const router = lessonFor('router', 'Router');
  const grouped = groupLessonModules({
    './lessons/networking/dhcp.ts': dhcp,
    './lessons/networking/router.ts': router,
    './lessons/crypto/hash.ts': lessonFor('hash', 'Hash'),
  });
  expect(Object.keys(grouped).sort()).toEqual(['crypto', 'networking']);
  expect(grouped.networking).toEqual({ dhcp, router });
});

test('groupLessonModules requires the file name to equal the slug', () => {
  expect(() => groupLessonModules({ './lessons/networking/dhcp.ts': lessonFor('router', 'Router') })).toThrow(/dhcp.*router/s);
});

test('groupLessonModules rejects a default export that is not a lesson', () => {
  expect(() => groupLessonModules({ './lessons/networking/dhcp.ts': undefined as never })).toThrow(/defineLesson/);
});

test('a file one folder deeper (a unit of lesson 1) is not a lesson path', () => {
  const http = lessonFor('http', 'HTTP');
  expect(() => groupLessonModules({ './lessons/networking/how-the-internet-works/http.ts': http })).toThrow(/Unexpected lesson file path/);
});
