import { expect, test, vi } from 'vitest';
import { CERT_TAGS } from './certs';
import { defineTrack, validateLesson } from './define';
import { LEGACY_LESSONS, validateLegacyLesson } from './legacy';
import { checkLimits } from './limits';
import {
  buildEntries,
  checkLegacyList,
  checkFactCheckReports,
  checkTracks,
  getEntries,
  getLesson,
  getTrack,
  checkLessonFolders,
  checkListings,
  lessonsFromModules,
  neighbors,
  tracksOf,
  trackTotals,
} from './registry';
import { lessonSchema, type Lesson, type Track } from './schema';
import type { SourceRegistry } from './sources';
import { FIXTURE_LIMITS, FIXTURE_SOURCES, liftedFixture, makeCertTrack, makeCitedLesson, makeLesson, makeTwoUnitLesson } from './test-fixtures';
import { comingSoonTracks, internetTrack, networkingTrack, tracks } from './tracks';

const lessonFor = (slug: string, title: string) => liftedFixture(makeLesson({ slug, title }));

/**
 * Drops a fixture's cues. This file loads the real lessons through the registry, so it cannot swap the fixture parts in
 * for the real ones, and the real dhcp figure takes no cues.
 */
function withoutCues<L extends { units: { steps: { events: { id: string; cues?: unknown }[] }[] }[] }>(l: L): L {
  for (const u of l.units) for (const step of u.steps) for (const e of step.events) delete e.cues;
  return l;
}

/** A fixture as a lesson file makes it, through the legacy path's validator, so the registry accepts it. */
const definedFor = (slug: string, title: string) => validateLegacyLesson(withoutCues(makeLesson({ slug, title })));

/** A lone track is its own home. */
const home = () => 'networking';

const SLUGS = [
  'osi-model', 'packets',
  'ip-address', 'mac-address', 'switch', 'arp',
  'subnetting', 'router', 'dhcp',
  'ports', 'tcp-udp', 'nat', 'dns',
  'http-https', 'tls',
  'firewalls', 'proxies', 'load-balancers', 'vpn',
];

test('the networking track has 19 lessons in order, OSI Model first', () => {
  const e = buildEntries(networkingTrack, {}, home);
  expect(e.map((x) => x.slug)).toEqual(SLUGS);
  expect(e.map((x) => x.number)).toEqual(Array.from({ length: 19 }, (_, i) => i + 1));
  expect(e[0]).toMatchObject({ title: 'OSI Model', partTitle: 'The big picture' });
  expect(e.every((x) => !x.available)).toBe(true);
});

test('lesson numbers: subnetting 7, dhcp 9, firewalls 16', () => {
  const number = (slug: string) => buildEntries(networkingTrack, {}, home).find((x) => x.slug === slug)?.number;
  expect([number('subnetting'), number('dhcp'), number('firewalls')]).toEqual([7, 9, 16]);
});

test('networking track metadata, parts and titles', () => {
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
    'OSI Model', 'Packets', 'IP Address', 'MAC Address', 'Switch', 'ARP', 'Subnetting', 'Router',
    'DHCP', 'Ports', 'TCP/UDP', 'NAT', 'DNS', 'HTTP/HTTPS', 'TLS', 'Firewalls', 'Proxies', 'Load Balancers', 'VPN',
  ]);
  const e = buildEntries(networkingTrack, {}, home);
  expect(e.find((x) => x.slug === 'arp')).toMatchObject({ partTitle: 'Addresses & the local network' });
  expect(e.find((x) => x.slug === 'vpn')).toMatchObject({ partTitle: 'Protecting & scaling traffic', number: 19 });
});

test('tracks and coming-soon tracks', () => {
  // How the Internet Works comes first: it is where a newcomer starts.
  expect(tracks).toEqual([internetTrack, networkingTrack]);
  expect(comingSoonTracks.map((t) => t.title)).toEqual([
    'Cryptography', 'AI Concepts', 'Privilege Escalation', 'Threat & Vulnerability Management',
  ]);
  expect(comingSoonTracks.every((t) => t.blurb.length > 10)).toBe(true);
  // Home's cards: each wears its approved cover under its kind of track. 'networking' and 'web' are taken by the
  // Networking and How the Internet Works cards.
  expect(comingSoonTracks.map((t) => t.cover)).toEqual(['crypto', 'ai', 'privesc', 'tvm']);
  expect(comingSoonTracks.map((t) => t.kind)).toEqual(['Security', 'AI', 'Security', 'Security']);
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

test('an entry’s key is its lesson slug', () => {
  expect(getEntries('networking').find((e) => e.slug === 'dhcp')!.key).toBe('dhcp');
});

test('an available entry reports units, subtitle and maxPosition', () => {
  // One unit of five steps: Overview, 5 steps, Learn, Practice is 8 positions, 0 to 7.
  const dhcp = lessonFor('dhcp', 'DHCP');
  expect(buildEntries(networkingTrack, { dhcp }, home).find((x) => x.slug === 'dhcp')).toEqual({
    available: true,
    key: 'dhcp',
    trackId: 'networking',
    slug: 'dhcp',
    url: '/networking/dhcp',
    canonical: '/networking/dhcp',
    number: 9,
    title: 'DHCP',
    subtitle: dhcp.subtitle,
    partTitle: 'Getting between networks',
    summary: dhcp.summary,
    certTags: dhcp.certTags,
    stepCount: 5,
    units: 1,
    maxPosition: 7,
  });

  // Two units of five steps: 16 positions, 0 to 15.
  const http = liftedFixture(makeTwoUnitLesson({ slug: 'what-is-http', title: 'HTTP' }));
  expect(buildEntries(internetTrack, { 'what-is-http': http }, () => 'how-the-internet-works')[0]).toMatchObject({
    available: true,
    url: '/how-the-internet-works/what-is-http',
    number: 1,
    units: 2,
    stepCount: 10,
    maxPosition: 15,
  });
});

test('unavailable entries carry only identity', () => {
  expect(buildEntries(networkingTrack, {}, home)[0]).toEqual({
    available: false,
    key: 'osi-model',
    trackId: 'networking',
    slug: 'osi-model',
    number: 1,
    title: 'OSI Model',
    partTitle: 'The big picture',
  });
});

test('neighbors skip unavailable lessons', () => {
  const e = buildEntries(networkingTrack, { dhcp: lessonFor('dhcp', 'DHCP'), firewalls: lessonFor('firewalls', 'Firewalls') }, home);
  expect(neighbors(e, 'dhcp')).toMatchObject({ prev: null, next: { slug: 'firewalls' }, nextPlanned: true });
});

test('neighbors: prev and next are the nearest available lessons', () => {
  const lessons = {
    packets: lessonFor('packets', 'Packets'),
    dhcp: lessonFor('dhcp', 'DHCP'),
    dns: lessonFor('dns', 'DNS'),
  };
  const e = buildEntries(networkingTrack, lessons, home);
  expect(neighbors(e, 'dhcp')).toMatchObject({ prev: { slug: 'packets' }, next: { slug: 'dns' }, nextPlanned: true });
  expect(neighbors(e, 'packets')).toMatchObject({ prev: null, next: { slug: 'dhcp' }, nextPlanned: true });
  expect(neighbors(e, 'dns')).toMatchObject({ prev: { slug: 'dhcp' }, next: null, nextPlanned: true });
});

test('neighbors: nextPlanned is false when the next entry is available, or there is none', () => {
  const a = buildEntries(networkingTrack, { 'osi-model': lessonFor('osi-model', 'OSI Model'), packets: lessonFor('packets', 'Packets') }, home);
  expect(neighbors(a, 'osi-model')).toMatchObject({ next: { slug: 'packets' }, nextPlanned: false });
  const last = buildEntries(networkingTrack, { vpn: lessonFor('vpn', 'VPN') }, home);
  expect(neighbors(last, 'vpn')).toEqual({ prev: null, next: null, nextPlanned: false });
});

test('neighbors of an unknown slug are empty, and an unavailable lesson can be asked about', () => {
  expect(neighbors(buildEntries(networkingTrack, {}, home), 'nope')).toEqual({ prev: null, next: null, nextPlanned: false });
  const e = buildEntries(networkingTrack, { dhcp: lessonFor('dhcp', 'DHCP') }, home);
  expect(neighbors(e, 'ports')).toMatchObject({ prev: { slug: 'dhcp' }, next: null, nextPlanned: true });
});

test('a title that differs from the track, or a mismatched slug, throws; another track’s lesson is skipped', () => {
  expect(() => buildEntries(networkingTrack, { dhcp: lessonFor('dhcp', 'Wrong') }, home)).toThrow(/title/);
  expect(() => buildEntries(networkingTrack, { gopher: lessonFor('gopher', 'Gopher') }, home)).not.toThrow();
  expect(() => buildEntries(networkingTrack, { dhcp: lessonFor('router', 'Router') }, home)).toThrow(/slug/);
});

test('trackTotals counts planned (all entries), and available', () => {
  const dhcp = lessonFor('dhcp', 'DHCP');
  const fw = lessonFor('firewalls', 'Firewalls');
  expect(trackTotals(buildEntries(networkingTrack, {}, home))).toEqual({ available: 0, planned: 19 });
  expect(trackTotals(buildEntries(networkingTrack, { dhcp, firewalls: fw }, home))).toEqual({
    available: 2,
    planned: 19,
  });
});

test('entries carry no minutes', () => {
  for (const e of getEntries('networking')) expect(e).not.toHaveProperty('minutes');
});

// ------------------------------------------------------------ module-level wiring

test('getTrack, getEntries and getLesson answer from the registry', () => {
  expect(getTrack('networking')).toBe(networkingTrack);
  expect(getTrack('nope')).toBeUndefined();
  expect(getEntries('networking')).toHaveLength(19);
  expect(getTrack('how-the-internet-works')).toBe(internetTrack);
  expect(getEntries('how-the-internet-works')).toHaveLength(14);
  expect(getEntries('nope')).toEqual([]);
  expect(getLesson('not-written-yet')).toBeUndefined();
  expect(getLesson('nope')).toBeUndefined();
});

test('every lesson file that exists is available in the registry under its slug', () => {
  for (const entry of tracks.flatMap((t) => getEntries(t.id))) {
    if (entry.available) expect(getLesson(entry.slug)?.slug).toBe(entry.slug);
    else expect(getLesson(entry.slug)).toBeUndefined();
  }
});

// ------------------------------------------------------------ the closed legacy list

test('the 17 ready lessons are legacy, and every legacy lesson is listed', () => {
  const legacy = LEGACY_LESSONS.map((s) => getLesson(s));
  expect(legacy.map((l) => l?.origin)).toEqual(LEGACY_LESSONS.map(() => 'legacy'));
  const ready = tracks.flatMap((t) => getEntries(t.id)).filter((e) => e.available).map((e) => getLesson(e.slug)!);
  expect(ready).toHaveLength(17);
  for (const lesson of ready.filter((l) => l.origin === 'legacy')) expect(LEGACY_LESSONS, lesson.slug).toContain(lesson.slug);
});

test('the build stops on a legacy lesson off the list, and on a listed slug whose lesson is not legacy', () => {
  const ready = LEGACY_LESSONS.map((slug) => liftedFixture(makeLesson({ slug })));
  expect(() => checkLegacyList(ready)).not.toThrow();
  // A new lesson cannot take the legacy path.
  expect(() => checkLegacyList([...ready, liftedFixture(makeLesson({ slug: 'osi-model' }))])).toThrow(
    /"osi-model" is a legacy lesson, but it is not on the legacy list/,
  );
  // A lesson that has moved to the cited shape leaves the list: the list only shrinks.
  const migrated = ready.map((l) => (l.slug === 'dhcp' ? { ...l, origin: 'cited' as const } : l));
  expect(() => checkLegacyList(migrated)).toThrow(/"dhcp" is on the legacy list, but its lesson is cited/);
  // So does a slug no lesson has any more.
  expect(() => checkLegacyList(ready.filter((l) => l.slug !== 'dhcp'))).toThrow(/"dhcp" is on the legacy list, but no lesson has that slug/);
});

test('lessonsFromModules keys lessons by file name (slug)', () => {
  const dhcp = definedFor('dhcp', 'DHCP');
  const router = definedFor('router', 'Router');
  expect(lessonsFromModules({ './lessons/dhcp.ts': dhcp, './lessons/router.ts': router })).toEqual({ dhcp, router });
});

test('lessonsFromModules requires the file name to equal the slug', () => {
  expect(() => lessonsFromModules({ './lessons/dhcp.ts': definedFor('router', 'Router') })).toThrow(/dhcp.*router/s);
});

test('lessonsFromModules accepts a cited lesson checked against the source list it is given', () => {
  const cited = validateLesson(withoutCues(makeCitedLesson()), FIXTURE_SOURCES);
  expect(lessonsFromModules({ './lessons/cited-lesson.ts': cited }, FIXTURE_SOURCES)['cited-lesson']).toBe(cited);
});

const OTHER_LIST =
  'the lesson was checked against a different source list; use defineLesson, which checks against SOURCES in src/content/sources.ts.';

test('a lesson checked against the test sources is rejected with the real ones, and accepted with the test sources', () => {
  const cited = validateLesson(withoutCues(makeCitedLesson()), FIXTURE_SOURCES);
  expect(() => lessonsFromModules({ './lessons/cited-lesson.ts': cited })).toThrow(`./lessons/cited-lesson.ts: ${OTHER_LIST}`);
  expect(lessonsFromModules({ './lessons/cited-lesson.ts': cited }, FIXTURE_SOURCES)).toEqual({ 'cited-lesson': cited });
});

test('a lesson checked against a hand-built source list that allows Wikipedia never reaches the site', () => {
  const RFC_PAGE = 'https://www.rfc-editor.org/rfc/rfc9999.html';
  const WIKI_PAGE = 'https://en.wikipedia.org/wiki/Example';
  // Written by hand, not through defineSources, so nothing checked its hosts.
  const handBuilt: SourceRegistry = {
    ...FIXTURE_SOURCES,
    'rfc-example': { ...FIXTURE_SOURCES['rfc-example']!, url: WIKI_PAGE, anchor: `${WIKI_PAGE}#section-{n}` },
  };
  const input: unknown = JSON.parse(JSON.stringify(withoutCues(makeCitedLesson())).replaceAll(RFC_PAGE, WIKI_PAGE));
  const lesson = validateLesson(input, handBuilt);
  // It passes its own list, so its unit would list Wikipedia among its sources.
  expect(lesson.units[0]!.references.map((s) => s.url)).toContain(WIKI_PAGE);
  expect(() => lessonsFromModules({ './lessons/cited-lesson.ts': lesson })).toThrow(`./lessons/cited-lesson.ts: ${OTHER_LIST}`);
});

test('a legacy lesson passes, whichever source list the registry checks against', () => {
  const dhcp = definedFor('dhcp', 'DHCP');
  expect(lessonsFromModules({ './lessons/dhcp.ts': dhcp })).toEqual({ dhcp });
  expect(lessonsFromModules({ './lessons/dhcp.ts': dhcp }, FIXTURE_SOURCES)).toEqual({ dhcp });
});

const NOT_DEFINED =
  'the lesson was not made with defineLesson (or defineLegacyLesson for a lesson on the legacy list); wrap it so every rule runs.';

test('lessonsFromModules rejects a lesson object built by hand, which skipped every rule', () => {
  // A hand-built lesson in the cited shape with an uncited Learn statement: only the gate stops it.
  const raw: Lesson = { ...lessonSchema.parse(makeCitedLesson()), origin: 'cited' };
  raw.units[0]!.learn.lead[0]!.cite = [];
  expect(() => lessonsFromModules({ './lessons/cited-lesson.ts': raw })).toThrow(`./lessons/cited-lesson.ts: ${NOT_DEFINED}`);
  // A legacy lesson lifted without its checks is stopped too.
  expect(() => lessonsFromModules({ './lessons/dhcp.ts': lessonFor('dhcp', 'DHCP') })).toThrow(`./lessons/dhcp.ts: ${NOT_DEFINED}`);
});

test('lessonsFromModules rejects a copy of a defined lesson, since a copy can be changed after its checks', () => {
  const defined = definedFor('dhcp', 'DHCP');
  expect(() => lessonsFromModules({ './lessons/dhcp.ts': { ...defined } })).toThrow(`./lessons/dhcp.ts: ${NOT_DEFINED}`);
});

test('lessonsFromModules rejects a default export that is not a lesson', () => {
  expect(() => lessonsFromModules({ './lessons/dhcp.ts': undefined as never })).toThrow(/defineLesson/);
});

test('a file one folder deeper (a part of a lesson) is not a lesson path, nor is a track folder', () => {
  const http = lessonFor('http', 'HTTP');
  expect(() => lessonsFromModules({ './lessons/how-the-internet-works/http.ts': http })).toThrow(/Unexpected lesson file path/);
  expect(() => lessonsFromModules({ './lessons/networking/dhcp.ts': definedFor('dhcp', 'DHCP') })).toThrow(/Unexpected lesson file path/);
});

// ------------------------------------------------------------ shared lessons

const part = (...lessons: [string, string][]) => [{ id: 'p', title: 'Part', lessons: lessons.map(([slug, title]) => ({ slug, title })) }];
const concept = (id: string, parts: Track['parts'], limits = FIXTURE_LIMITS): Track => ({
  type: 'concept',
  id,
  title: id,
  description: 'A fixture track.',
  level: 'beginner',
  limits,
  parts,
});
const alpha = concept('alpha', part(['other', 'Other'], ['shared', 'Shared']));
const beta = concept('beta', part(['shared', 'Shared']));
const tightLimits = { ...FIXTURE_LIMITS, steps: { min: 4, max: 4 } };
const shared = liftedFixture(makeLesson({ slug: 'shared', title: 'Shared' }));
const homeAlpha = () => 'alpha';

test('a lesson listed by two tracks has one key, a URL in each, and one canonical URL', () => {
  const a = buildEntries(alpha, { shared }, homeAlpha).find((e) => e.slug === 'shared')!;
  const b = buildEntries(beta, { shared }, homeAlpha).find((e) => e.slug === 'shared')!;
  if (!a.available || !b.available) throw new Error('the lesson should be available in both tracks');
  expect([a.key, b.key]).toEqual(['shared', 'shared']);
  expect([a.url, b.url]).toEqual(['/alpha/shared', '/beta/shared']);
  expect([a.canonical, b.canonical]).toEqual(['/alpha/shared', '/alpha/shared']);
});

test('numbers count within each track', () => {
  const number = (track: Track) => buildEntries(track, { shared }, homeAlpha).find((e) => e.slug === 'shared')!.number;
  expect([number(alpha), number(beta)]).toEqual([2, 1]);
});

test('it must fit every listing track’s limits, and the error names the track', () => {
  const tight = concept('beta', part(['shared', 'Shared']), tightLimits);
  expect(() => buildEntries(alpha, { shared }, homeAlpha)).not.toThrow();
  expect(() => buildEntries(tight, { shared }, homeAlpha)).toThrow(/Lesson "shared" does not fit the beta track's limits:\n {2}- .*steps/);
});

test('a second track that lists another title for the lesson fails', () => {
  const retitled = concept('beta', part(['shared', 'Another title']));
  expect(() => buildEntries(retitled, { shared }, homeAlpha)).toThrow(/title "Shared".*beta track lists the title "Another title"/);
});

test('a lesson file no track lists fails', () => {
  expect(() => checkListings({ shared }, [networkingTrack])).toThrow(
    'Lesson "shared" is not listed in any track; add it to a part\'s lessons in src/content/tracks/<track>.ts.',
  );
  expect(() => checkListings({ shared }, [alpha, beta])).not.toThrow();
});

test('an override is unneeded unless some listing track needs it', () => {
  const tight = concept('beta', part(['shared', 'Shared']), tightLimits);
  const reasoned = { ...shared, overrides: [{ limit: 'steps' as const, max: 5, reason: 'Needs a fifth step.' }] };
  // alpha alone (max 6) does not need it; beta (max 4) does, so a listing in both keeps it.
  expect(() => checkListings({ shared: reasoned }, [alpha])).toThrow(/"shared".*steps.*not needed/s);
  expect(() => checkListings({ shared: reasoned }, [alpha, tight])).not.toThrow();
});

test('a lesson file in a folder fails the build; a folder named after a lesson holds its parts', () => {
  expect(() => checkLessonFolders(['./lessons/networking/osi-model.ts'], ['how-the-internet-works'])).toThrow(
    './lessons/networking/osi-model.ts: lesson files live directly in src/content/lessons/; a folder there holds the parts of the lesson it is named after, and no lesson is named "networking".',
  );
  expect(() => checkLessonFolders(['./lessons/how-the-internet-works/dns.ts'], ['how-the-internet-works'])).not.toThrow();
});

test('the registry re-checks each track against SOURCES, so a certification track checked against other sources fails', () => {
  const cert = defineTrack(makeCertTrack(), FIXTURE_SOURCES);
  expect(() => checkTracks([networkingTrack, cert])).toThrow(
    /^Track "example-cert" is invalid:\n {2}- The exam source "example-objectives" is not in the source registry\./,
  );
  expect(() => checkTracks([networkingTrack, cert], FIXTURE_SOURCES)).not.toThrow();
  // A track written as a plain object never ran defineTrack; the re-check runs its rules.
  const plain = makeCertTrack();
  plain.exam.version = 'V2';
  expect(() => checkTracks([plain], FIXTURE_SOURCES)).toThrow(/pins exam version "V2"/);
});

test('every track passes the re-check against the real sources', () => {
  expect(() => checkTracks(tracks)).not.toThrow();
});

test('tracksOf lists the tracks that list a slug, in tracks order', () => {
  expect(tracksOf('dhcp').map((t) => t.id)).toEqual(['networking']);
  expect(tracksOf('not-a-lesson')).toEqual([]);
});

test('the real lessons load from one folder', () => {
  expect(getLesson('dhcp')!.slug).toBe('dhcp');
  expect(tracksOf('dhcp').map((t) => t.id)).toEqual(['networking']);
  const e = getEntries('networking').find((x) => x.slug === 'dhcp')!;
  expect(e.available && e.canonical).toBe('/networking/dhcp');
});

test('Networking is a concept track with today’s limits', () => {
  expect(getTrack('networking')).toMatchObject({ type: 'concept', limits: FIXTURE_LIMITS });
});

test('none of the four real lessons carries a backing', () => {
  for (const slug of LEGACY_LESSONS) expect(JSON.stringify(getLesson(slug)), slug).not.toContain('"backing"');
});

test('the four real lessons fit Networking’s limits with no overrides', () => {
  for (const slug of LEGACY_LESSONS) {
    const lesson = getLesson(slug)!;
    expect(lesson.overrides, slug).toEqual([]);
    expect(checkLimits(lesson, networkingTrack.limits), slug).toEqual([]);
  }
});

test('the build stops on a lesson that does not fit its track’s limits, naming the lesson, the track and the limit', () => {
  const l = makeLesson({ slug: 'dhcp', title: 'DHCP' });
  l.units[0]!.steps[0]!.narrative = 'word '.repeat(130).trim();
  const long = liftedFixture(l);
  expect(() => buildEntries(networkingTrack, { dhcp: long }, home)).toThrow(
    /Lesson "dhcp" does not fit the networking track's limits:\n {2}- .*narrative is 130 words; the limit is 120/,
  );
  const reasoned = { ...long, overrides: [{ limit: 'narrativeWords' as const, max: 140, reason: 'Names all four messages in one step.' }] };
  expect(() => buildEntries(networkingTrack, { dhcp: reasoned }, home)).not.toThrow();
});

const ORPHAN = { '../../docs/fact-checks/no-such-lesson.md': 'No header.' };

test('a fact-check issue stops the build and the tests', () => {
  for (const mode of ['production', 'test']) {
    expect(() => checkFactCheckReports([], ORPHAN, FIXTURE_SOURCES, mode), mode).toThrow(/^Fact checks:\n- .*no-such-lesson/);
  }
  expect(() => checkFactCheckReports([], {}, FIXTURE_SOURCES, 'production')).not.toThrow();
});

test('astro dev warns of a fact-check issue instead, so a draft lesson can be previewed', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  try {
    expect(() => checkFactCheckReports([], ORPHAN, FIXTURE_SOURCES, 'development')).not.toThrow();
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/^Fact checks:\n- .*no-such-lesson[\s\S]*npm run build/));
  } finally {
    warn.mockRestore();
  }
});
