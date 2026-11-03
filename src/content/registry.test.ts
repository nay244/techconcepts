import { expect, test } from 'vitest';
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
  type AvailableSummary,
} from './registry';
import { fixtureLesson } from './test-fixtures';
import { comingSoonTracks, networkingTrack, tracks } from './tracks';
import { CERT_TAGS } from './certs';

const lessonFor = (slug: string, title: string) => validateLesson({ ...fixtureLesson(), slug, title }).lesson;

test('networking track lists 19 lessons in spec order', () => {
  const e = buildEntries(networkingTrack, {});
  expect(e.map((x) => x.slug)).toEqual([
    'osi-model', 'packets', 'ip-address', 'mac-address', 'switch', 'arp', 'subnetting', 'router', 'dhcp', 'ports',
    'tcp-udp', 'nat', 'dns', 'http-https', 'tls', 'firewalls', 'proxies', 'load-balancers', 'vpn',
  ]);
  expect(e.map((x) => x.number)).toEqual(Array.from({ length: 19 }, (_, i) => i + 1));
  expect(e.every((x) => !x.available)).toBe(true);
});

test('networking track metadata, parts and titles follow spec §8', () => {
  expect(networkingTrack).toMatchObject({ id: 'networking', title: 'Networking Concepts', level: 'beginner' });
  expect(networkingTrack.parts.map((p) => [p.id, p.title, p.lessons.length])).toEqual([
    ['big-picture', 'The big picture', 2],
    ['local-network', 'Addresses & the local network', 4],
    ['between-networks', 'Getting between networks', 3],
    ['across-internet', 'Talking across the internet', 4],
    ['web', 'The web', 2],
    ['protect-scale', 'Protecting & scaling traffic', 4],
  ]);
  expect(networkingTrack.parts.flatMap((p) => p.lessons.map((l) => l.title))).toEqual([
    'OSI Model', 'Packets', 'IP Address', 'MAC Address', 'Switch', 'ARP', 'Subnetting', 'Router', 'DHCP', 'Ports',
    'TCP/UDP', 'NAT', 'DNS', 'HTTP/HTTPS', 'TLS', 'Firewalls', 'Proxies', 'Load Balancers', 'VPN',
  ]);
  const e = buildEntries(networkingTrack, {});
  expect(e.find((x) => x.slug === 'arp')).toMatchObject({ partTitle: 'Addresses & the local network' });
  expect(e.find((x) => x.slug === 'vpn')).toMatchObject({ partTitle: 'Protecting & scaling traffic', number: 19 });
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

test('neighbors skip unavailable lessons', () => {
  const dhcp = lessonFor('dhcp', 'DHCP');
  const fw = lessonFor('firewalls', 'Firewalls');
  const e = buildEntries(networkingTrack, { dhcp, firewalls: fw });
  expect(neighbors(e, 'dhcp')).toMatchObject({ prev: null, next: { slug: 'firewalls' }, nextPlanned: true });
  expect(e.find((x) => x.slug === 'dhcp')).toMatchObject({ available: true, number: 9, url: '/networking/dhcp', maxPosition: 7 });
});

test('available entries carry the lesson summary', () => {
  const dhcp = lessonFor('dhcp', 'DHCP');
  const entry = buildEntries(networkingTrack, { dhcp }).find((x) => x.slug === 'dhcp') as AvailableSummary;
  expect(entry).toMatchObject({
    available: true,
    key: 'networking/dhcp',
    trackId: 'networking',
    title: 'DHCP',
    partTitle: 'Getting between networks',
    summary: dhcp.summary,
    certTags: dhcp.certTags,
    stepCount: dhcp.steps.length,
    minutes: estimateMinutes(dhcp),
    maxPosition: dhcp.steps.length + 3,
  });
});

test('unavailable entries carry only identity', () => {
  const entry = buildEntries(networkingTrack, {})[0]!;
  expect(entry).toEqual({
    available: false,
    key: 'networking/osi-model',
    trackId: 'networking',
    slug: 'osi-model',
    number: 1,
    title: 'OSI Model',
    partTitle: 'The big picture',
  });
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

test('neighbors of an unknown slug are empty', () => {
  expect(neighbors(buildEntries(networkingTrack, {}), 'nope')).toEqual({ prev: null, next: null, nextPlanned: false });
});

test('neighbors can be asked about an unavailable lesson', () => {
  const e = buildEntries(networkingTrack, { dhcp: lessonFor('dhcp', 'DHCP') });
  expect(neighbors(e, 'ports')).toMatchObject({ prev: { slug: 'dhcp' }, next: null, nextPlanned: true });
});

test('title mismatch with track throws', () => {
  const bad = validateLesson({ ...fixtureLesson(), slug: 'dhcp', title: 'Wrong' }).lesson;
  expect(() => buildEntries(networkingTrack, { dhcp: bad })).toThrow(/title/);
});

test('a lesson that is not in the track throws', () => {
  expect(() => buildEntries(networkingTrack, { gopher: lessonFor('gopher', 'Gopher') })).toThrow(/gopher/);
});

test('a lesson filed under a different slug than its own throws', () => {
  expect(() => buildEntries(networkingTrack, { dhcp: lessonFor('router', 'Router') })).toThrow(/slug/);
});

test('trackTotals counts planned (all entries), available and minutes', () => {
  const dhcp = lessonFor('dhcp', 'DHCP');
  const fw = lessonFor('firewalls', 'Firewalls');
  const none = trackTotals(buildEntries(networkingTrack, {}));
  expect(none).toEqual({ available: 0, planned: 19, minutes: 0 });
  const two = trackTotals(buildEntries(networkingTrack, { dhcp, firewalls: fw }));
  expect(two).toEqual({ available: 2, planned: 19, minutes: estimateMinutes(dhcp) + estimateMinutes(fw) });
});

// ------------------------------------------------------------ module-level wiring

test('getTrack, getEntries and getLesson answer from the registry', () => {
  expect(getTrack('networking')).toBe(networkingTrack);
  expect(getTrack('nope')).toBeUndefined();
  expect(getEntries('networking')).toHaveLength(19);
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
