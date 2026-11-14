import { describe, expect, test } from 'vitest';
import { GLOSSARY, GLOSSARY_GROUPS } from '../content/glossary';
import { makeGroup, statement } from '../content/glossary-fixtures';
import { partsOf, type GlossaryGroupInput } from '../content/glossary-group';
import { parseReport } from '../content/factcheck/report';
import { glossaryCheckedOn } from '../content/registry';
import { cite } from '../content/sources';
import { tracks } from '../content/tracks';
import pilotReport from '../../docs/fact-checks/glossary/pilot.md?raw';
import { FIXTURE_SOURCES, liftedFixture, makeLesson } from '../content/test-fixtures';
import { definitionsFor, glossaryData, stampLine, type Definition, type GlossaryInput, type GlossaryLesson } from './glossary';
import { siteGlossary } from './glossary-site';

// The glossary page's data: D9 §9 as D9a amends it (rule 6: a definition's tracks), the checks of §15 G, errata E7 to E11 and
// E1 to E3 of B8a, and the attack cases of prototypes/d9-cases.md §3 G and prototypes/d9a-cases.md §3.

type Entry = GlossaryGroupInput['entries'][number];
let n = 0;
/** An entry with one fixture definition, with the statement ids made fresh. */
const entry = (id: string, term: string, more: Partial<Entry> = {}): Entry => ({ id, term, definition: [statement(`s-${id}-${n++}`, `${term} means something.`)], ...more });
const group = (entries: Entry[], id = 'pilot') =>
  makeGroup((i) => {
    i.id = id;
    i.entries = entries;
  });

/** A ready fixture lesson listed by the given tracks (titles). */
const lesson = (slug: string, tracks: string[] = ['Track one']): GlossaryLesson => ({ lesson: liftedFixture(makeLesson({ slug })), tracks });

const SITE_ORDER = ['Track one', 'Track two', 'Track three'];
const run = (groups: ReturnType<typeof group>[], extra: Partial<GlossaryInput> = {}) =>
  glossaryData({ groups, lessons: [], trackTitles: SITE_ORDER, sources: FIXTURE_SOURCES, dates: Object.fromEntries(groups.map((g) => [g.id, '2026-11-13'])), ...extra });
const names = (d: ReturnType<typeof run>) => d.letters.flatMap((l) => l.items.map((i) => i.name));
const items = (d: ReturnType<typeof run>) => d.letters.flatMap((l) => l.items);
/** The pilot group's entry ids, from the group itself: the tests that mean the pilot count its items, not the whole glossary's (B10). */
const pilotIds = (): Set<string> => new Set(GLOSSARY_GROUPS.find((g) => g.id === 'pilot')!.entries.map((e) => e.id));
const pilotItems = (d: ReturnType<typeof run>) => items(d).filter((i) => pilotIds().has(i.entryId));

describe('1. items', () => {
  test('an entry is one item; each spelling is one more, a pointer to its entry; two groups give both', () => {
    const d = run([group([entry('a', 'Apple', { also: ['An one', 'A two'] }), entry('b', 'Berry')], 'g1'), group([entry('c', 'Cherry')], 'g2')]);
    expect(items(d).map((i) => [i.kind, i.name, i.entryId])).toEqual([
      ['pointer', 'A two', 'a'],
      ['pointer', 'An one', 'a'],
      ['entry', 'Apple', 'a'],
      ['entry', 'Berry', 'b'],
      ['entry', 'Cherry', 'c'],
    ]);
  });
});

describe('2. A to Z', () => {
  test('numbers by value, accents by base letter, leading marks dropped, digits first', () => {
    const d = run([group([entry('i9', 'Item 9'), entry('i10', 'Item 10'), entry('ec', 'Éclair'), entry('eh', 'Echo request'), entry('ok', '+OK'), entry('ot', 'Offer'), entry('vl', '802.1Q'), entry('a', 'Apple')])]);
    expect(names(d)).toEqual(['802.1Q', 'Apple', 'Echo request', 'Éclair', 'Item 9', 'Item 10', 'Offer', '+OK']);
    expect(d.letters.map((l) => l.letter)).toEqual(['0–9', 'A', 'E', 'I', 'O']);
    expect(d.letters[0]!.id).toBe('letter-0-9');
  });
  test('a tie at base strength is settled by code units, every time', () => {
    expect(names(run([group([entry('r2', 'Résumé'), entry('r1', 'Resume')])]))).toEqual(['Resume', 'Résumé']);
  });
  test('a pointer is filed by its own spelling, beside no entry', () => {
    const d = run([group([entry('tt', 'TTL', { also: ['Time to Live'] }), entry('te', 'Time exceeded'), entry('tr', 'Traceroute')])]);
    expect(names(d)).toEqual(['Time exceeded', 'Time to Live', 'Traceroute', 'TTL']);
  });
  test('a name with no letter or digit throws and is named', () => {
    expect(() => run([group([entry('x', '--')])])).toThrow('"--"');
  });
});

describe('3. ids', () => {
  test('an entry keeps its own id, not one made from its term', () => {
    expect(items(run([group([entry('ipv4-addr', 'IP address')])]))[0]!.id).toBe('ipv4-addr');
  });
  test.each(['letters', 'main', 'menu', 'menu-panel', 'theme-toggle', 'letter-q'])('the reserved entry id %s throws and is named', (id) => {
    expect(() => run([group([entry(id, 'Thing')])])).toThrow(`"${id}"`);
  });
  test('letter and lettering are not reserved', () => {
    expect(items(run([group([entry('letter', 'One'), entry('lettering', 'Two')])])).map((i) => i.id)).toEqual(['letter', 'lettering']);
  });
  test('a spelling whose id would start letter- throws and is named (it could never be freed by a suffix)', () => {
    expect(() => run([group([entry('a', 'Apple', { also: ['Letter box'] })])])).toThrow('"Letter box"');
  });
  test('a pointer id that is taken takes -2, then -3; an entry id that files later still wins', () => {
    const d = run([
      group([
        entry('l', 'Lease', { also: ['Letters'] }),
        entry('a', 'Apple', { also: ['Time-to-live'] }),
        entry('b', 'Berry', { also: ['Time to Live'] }),
        entry('c', 'Cherry', { also: ['Time To Live'] }),
        entry('z', 'Zed', { also: ['Wombat'] }),
        entry('wombat', 'Zzz'),
      ]),
    ]);
    const pointers = Object.fromEntries(items(d).filter((i) => i.kind === 'pointer').map((i) => [i.name, i.id]));
    expect(pointers['Letters']).toBe('letters-2');
    // The three spellings make one id; page order decides which gets which, the first keeping it.
    const order = items(d).filter((i) => i.name.toLowerCase().startsWith('time')).map((i) => i.id);
    expect(order).toEqual(['time-to-live', 'time-to-live-2', 'time-to-live-3']);
    expect(pointers['Wombat']).toBe('wombat-2');
    expect(items(d).find((i) => i.name === 'Zzz')!.id).toBe('wombat');
  });
});

describe('4. senses', () => {
  test('senses in written order, labels as written; an entry with one definition has label undefined', () => {
    const d = run([
      group([
        {
          id: 'ttl',
          term: 'TTL',
          senses: [
            { id: 'dns', label: 'In DNS', definition: [statement('s-dns')] },
            { id: 'ip', label: 'In IP', definition: [statement('s-ip')] },
          ],
        },
        entry('p', 'Ping'),
      ]),
    ]);
    expect(items(d).find((i) => i.id === 'ttl')!.definitions.map((x) => x.label)).toEqual(['In DNS', 'In IP']);
    expect(items(d).find((i) => i.id === 'p')!.definitions[0]!.label).toBeUndefined();
  });
});

describe('5. text', () => {
  test('statements joined by one space, as written, curly quotes kept', () => {
    const d = run([group([{ id: 'a', term: 'A', definition: [statement('s1', 'It’s a “thing”.'), statement('s2', ' second ', '4.4')] }])]);
    expect(items(d)[0]!.definitions[0]!.text).toBe('It’s a “thing”.  second ');
  });
});

describe('6. sources', () => {
  const vendor = (section: string, url: string) => cite('vendor-example', section, { url, sources: FIXTURE_SOURCES, defining: true });
  const rfc = (section: string, url?: string) => cite('rfc-example', section, { sources: FIXTURE_SOURCES, defining: true, ...(url === undefined ? {} : { url }) });
  test('one for each source id in the order first cited; the first citation’s address; every different place', () => {
    const e: Entry = {
      id: 'a',
      term: 'A',
      definition: [
        { id: 's1', text: 'One.', cite: [vendor('Intro', 'https://learn.microsoft.com/example#a'), rfc('2.1')] },
        { id: 's2', text: 'Two.', cite: [rfc('4.4'), vendor('Intro', 'https://learn.microsoft.com/example#a'), vendor('Other', 'https://learn.microsoft.com/example#b'), rfc('2.1')] },
      ],
    };
    const [def] = items(run([group([e])]))[0]!.definitions;
    expect(def!.sources).toEqual([
      { short: 'Example vendor', url: 'https://learn.microsoft.com/example#a', places: 'Example vendor, Intro; Example vendor, Other' },
      { short: 'RFC 9999', url: 'https://www.rfc-editor.org/rfc/rfc9999.html#section-2.1', places: 'RFC 9999 §2.1; RFC 9999 §4.4' },
    ]);
  });
  test('sources are not pooled across senses', () => {
    const d = run([
      group([
        {
          id: 'a',
          term: 'A',
          senses: [
            { id: 'one', label: 'One', definition: [{ id: 's1', text: 'x', cite: [rfc('2.1')] }] },
            { id: 'two', label: 'Two', definition: [{ id: 's2', text: 'y', cite: [vendor('I', 'https://learn.microsoft.com/example#c')] }] },
          ],
        },
      ]),
    ]);
    expect(items(d)[0]!.definitions.map((x) => x.sources.map((s) => s.short))).toEqual([['RFC 9999'], ['Example vendor']]);
  });
  test('two different sources with one short name in one definition throw; in two definitions they do not', () => {
    const same = { ...FIXTURE_SOURCES, 'vendor-example': { ...FIXTURE_SOURCES['vendor-example']!, short: 'Same' }, 'rfc-example': { ...FIXTURE_SOURCES['rfc-example']!, short: 'Same' } };
    const together = group([{ id: 'a', term: 'A', definition: [{ id: 's1', text: 'x', cite: [rfc('2.1'), vendor('I', 'https://learn.microsoft.com/example#c')] }] }]);
    expect(() => run([together], { sources: same })).toThrow('"Same"');
    const apart = group([
      {
        id: 'a',
        term: 'A',
        senses: [
          { id: 'one', label: 'One', definition: [{ id: 's1', text: 'x', cite: [rfc('2.1')] }] },
          { id: 'two', label: 'Two', definition: [{ id: 's2', text: 'y', cite: [vendor('I', 'https://learn.microsoft.com/example#c')] }] },
        ],
      },
    ]);
    expect(() => run([apart], { sources: same })).not.toThrow();
  });
});

describe('7. tracks of a definition (D9a rule 6; E1, E3, E7)', () => {
  const ties = (...t: string[][]) => t.map(([lesson, term]) => ({ lesson: lesson!, term: term! }));
  const lessons = [lesson('x', ['Track one', 'Track three']), lesson('y', ['Track two']), lesson('z', ['Track two', 'Track one'])];
  const tracksOf = (e: Entry, input: Partial<GlossaryInput> = { lessons }) => items(run([group([e])], input))[0]!.definitions[0]!.tracks;
  test('site order whatever the written order or the order of first sight (E1)', () => {
    // x is listed by tracks one and three, y by two only: first sight gives one, three, two; the site gives one, two, three.
    expect(tracksOf(entry('a', 'A', { lessons: ties(['x', 'term-1'], ['y', 'term-1']) }))).toEqual(['Track one', 'Track two', 'Track three']);
    expect(tracksOf(entry('a', 'A', { lessons: ties(['y', 'term-1'], ['x', 'term-1']) }))).toEqual(['Track one', 'Track two', 'Track three']);
  });
  test('every track that lists a tied lesson, not the home track only; the input order of a lesson’s tracks does not matter', () => {
    expect(tracksOf(entry('a', 'A', { lessons: ties(['z', 'term-1']) }))).toEqual(['Track one', 'Track two']);
  });
  test('one name per track: two ties in one lesson, and two lessons in one track, name it once', () => {
    expect(tracksOf(entry('a', 'A', { lessons: ties(['y', 'term-1'], ['y', 'term-2']) }))).toEqual(['Track two']);
    expect(tracksOf(entry('a', 'A', { lessons: ties(['y', 'term-1'], ['z', 'term-1']) }))).toEqual(['Track one', 'Track two']);
  });
  test('two ready lessons with one title in one track no longer throw', () => {
    const twin = [lesson('p', ['Track one']), lesson('q', ['Track one'])];
    expect(tracksOf(entry('a', 'A', { lessons: ties(['p', 'term-1'], ['q', 'term-1']) }), { lessons: twin })).toEqual(['Track one']);
  });
  test('a tie to a lesson that is not ready, or a term it lacks, throws and names the entry and the tie', () => {
    const bad = (t: string[][]) => () => run([group([entry('a', 'A', { lessons: ties(...t) })])], { lessons });
    expect(bad([['nope', 'term-1']])).toThrow(/glossary entry "a".*"nope"/);
    expect(bad([['x', 'term-99']])).toThrow(/glossary entry "a".*"term-99".*"x"/);
    const sense = () => run([group([{ id: 'a', term: 'A', senses: [{ id: 'one', label: 'One', definition: [statement('s1')], lessons: ties(['x', 'term-99']) }, { id: 'two', label: 'Two', definition: [statement('s2')] }] }])], { lessons });
    expect(sense).toThrow(/glossary entry "a", sense "one".*"term-99"/);
  });
  test('a lesson’s track that is not among the site’s tracks throws and names it', () => {
    expect(() => run([group([entry('a', 'A', { lessons: ties(['m', 'term-1']) })])], { lessons: [lesson('m', ['Elsewhere'])] })).toThrow('"Elsewhere"');
  });
  test('E7: a definition tied to nothing has no tracks', () => {
    expect(tracksOf(entry('a', 'A'))).toEqual([]);
    expect(tracksOf(entry('a', 'A', { lessons: ties(['y', 'term-1']) }), { lessons: [lesson('y', [])] })).toEqual([]);
  });
  const expectShape = (d: Definition, titles: readonly string[]) => {
    expect(Object.keys(d).sort()).toEqual(['label', 'sources', 'text', 'tracks']);
    expect(d.tracks.every((t) => titles.includes(t))).toBe(true);
    const strings = [d.label, d.text, ...d.tracks, ...d.sources.flatMap((s) => [s.short, s.places])].filter((v): v is string => typeof v === 'string');
    expect(strings.some((v) => /\?step=/.test(v) || v.startsWith('/'))).toBe(false);
  };
  test('E3: the shape — label, text, sources, tracks; no lesson field, title, address or step; on the fixture and on every definition of the glossary', () => {
    expectShape(items(run([group([entry('a', 'A', { lessons: ties(['x', 'term-1']) })])], { lessons }))[0]!.definitions[0]!, SITE_ORDER);
    const site = siteGlossary();
    const every = items(site).flatMap((i) => i.definitions);
    expect(every).toHaveLength(GLOSSARY.reduce((sum, e) => sum + partsOf(e).length, 0));
    expect(pilotItems(site).flatMap((i) => i.definitions)).toHaveLength(11);
    for (const d of every) expectShape(d, tracks.map((t) => t.title));
  });
});

describe('8. stamp', () => {
  const two = (a: string | null, b: string | null) => [group([entry('a', 'A')], 'g1'), group([entry('b', 'B')], 'g2')].map((g, i) => ({ g, d: [a, b][i] }));
  test('the count is the entries, not pointers or senses; the date is the latest, in either order', () => {
    const g = group([entry('a', 'A', { also: ['Aa'] }), { id: 't', term: 'T', senses: [{ id: 'x', label: 'X', definition: [statement('sx')] }, { id: 'y', label: 'Y', definition: [statement('sy')] }] }]);
    expect(run([g]).stamp).toEqual({ count: 2, date: '2026-11-13' });
    for (const [a, b] of [['2026-11-10', '2026-11-13'], ['2026-11-13', '2026-11-10']] as const) {
      const pair = two(a, b);
      expect(run(pair.map((p) => p.g), { dates: { g1: a, g2: b } }).stamp).toEqual({ count: 2, date: '2026-11-13' });
    }
  });
  test('a group with no date is ignored; none dated, no group or no entry: no throw and no stamp (E8)', () => {
    const pair = two(null, '2026-11-10');
    expect(run(pair.map((p) => p.g), { dates: { g1: null, g2: '2026-11-10' } }).stamp!.date).toBe('2026-11-10');
    expect(run(pair.map((p) => p.g), { dates: { g1: null, g2: null } }).stamp).toBeNull();
    const empty = run([]);
    expect(empty.stamp).toBeNull();
    expect(empty.keys).toEqual([]);
    expect(empty.letters).toEqual([]);
  });
  test('the words, in stampDate’s form', () => {
    expect(stampLine({ count: 10, date: '2026-11-13' })).toBe('10 terms checked, the latest on 13 Nov 2026');
    expect(stampLine({ count: 1, date: '2026-11-13' })).toBe('1 term checked on 13 Nov 2026');
  });
});

describe('9. keys', () => {
  const alphabet = (count: number, extra: Entry[] = []) =>
    group([...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, count)].map((l) => entry(`e-${l.toLowerCase()}`, `${l}ox`)).concat(extra));
  test('12 letters with an item: 12 keys; 13: 26 keys, dashed where empty', () => {
    expect(run([alphabet(12)]).keys).toHaveLength(12);
    const full = run([alphabet(13)]).keys;
    expect(full).toHaveLength(26);
    expect(full.filter((k) => k.live)).toHaveLength(13);
    expect(full.find((k) => k.letter === 'N')).toEqual({ letter: 'N', id: 'letter-n', live: false });
  });
  test('a letter that holds only a pointer still gets a key', () => {
    const keys = run([group([entry('a', 'Apple', { also: ['Quince'] })])]).keys;
    expect(keys.map((k) => k.letter)).toEqual(['A', 'Q']);
  });
  test('E11: the 0–9 group counts as one of the 13', () => {
    const twelveAndDigits = run([alphabet(12, [entry('v', '802.1Q')])]).keys;
    expect(twelveAndDigits).toHaveLength(27);
    expect(twelveAndDigits[0]).toEqual({ letter: '0–9', id: 'letter-0-9', live: true });
    expect(run([alphabet(11, [entry('v', '802.1Q')])]).keys).toHaveLength(12);
  });
});

describe('10. the lesson map (E2: values, not entryId)', () => {
  test('keyed by lesson and term id; the sense the tie names; no key for an untied term; only text, sources and a sense’s label', () => {
    const lessons = [lesson('what-is-dns'), lesson('what-is-icmp'), lesson('what-is-ip')];
    const d = run([
      group([
        {
          id: 'ttl',
          term: 'TTL',
          senses: [
            { id: 'dns', label: 'In DNS', definition: [statement('s1', 'DNS text.')], lessons: [{ lesson: 'what-is-dns', term: 'term-1' }] },
            { id: 'ip', label: 'In IP packets', definition: [statement('s2', 'IP text.')], lessons: [{ lesson: 'what-is-icmp', term: 'term-1' }, { lesson: 'what-is-ip', term: 'term-1' }] },
          ],
        },
        entry('latency', 'Latency', { lessons: [{ lesson: 'what-is-icmp', term: 'term-2' }] }),
      ]),
    ], { lessons });
    expect(d.lessonMap['what-is-dns/term-1']).toEqual({ label: 'In DNS', text: 'DNS text.', sources: ['RFC 9999'] });
    expect(d.lessonMap['what-is-icmp/term-1']).toEqual({ label: 'In IP packets', text: 'IP text.', sources: ['RFC 9999'] });
    expect(d.lessonMap['what-is-ip/term-1']).toEqual(d.lessonMap['what-is-icmp/term-1']);
    expect(d.lessonMap['what-is-icmp/term-2']).toEqual({ text: 'Latency means something.', sources: ['RFC 9999'] });
    expect('label' in d.lessonMap['what-is-icmp/term-2']!).toBe(false);
    expect(d.lessonMap['what-is-icmp/term-3']).toBeUndefined();
    expect(Object.keys(definitionsFor(d.lessonMap, 'what-is-icmp')).sort()).toEqual(['term-1', 'term-2']);
  });
});

describe('the real glossary (the pilot)', () => {
  const d = siteGlossary();
  const all = d.letters.flatMap((l) => l.items);
  test('item counts follow the groups; the letters are the items’ first letters; the pilot’s names in check 2’s order', () => {
    expect(all.filter((i) => i.kind === 'entry')).toHaveLength(GLOSSARY.length);
    expect(all.filter((i) => i.kind === 'pointer')).toHaveLength(GLOSSARY.reduce((s, e) => s + (e.also?.length ?? 0), 0));
    expect(all.flatMap((i) => i.definitions)).toHaveLength(GLOSSARY.reduce((s, e) => s + partsOf(e).length, 0));
    // The letters are the first letters of every item, whatever the groups; the live keys are those letters.
    const initial = (name: string) => (/^[0-9]/.test(name) ? '0–9' : name[0]!.toUpperCase());
    expect(d.letters.map((l) => l.letter)).toEqual([...new Set(all.map((i) => initial(i.name)))]);
    expect(d.keys.filter((k) => k.live).map((k) => k.letter)).toEqual(d.letters.map((l) => l.letter));
    expect(pilotItems(d).map((i) => i.name)).toEqual(['Destination unreachable', 'Echo reply', 'Echo request', 'IP address', 'Latency', 'Packet loss', 'Ping', 'Time exceeded', 'Time to Live', 'Traceroute', 'TTL']);
  });
  test('every id on the list is used once, and the pointer is time-to-live', () => {
    const ids = all.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(all.find((i) => i.name === 'Time to Live')).toMatchObject({ id: 'time-to-live', kind: 'pointer', entryId: 'ttl' });
  });
  test('TTL, Echo request and IP address as the spec names them', () => {
    const ttl = all.find((i) => i.id === 'ttl')!;
    expect(ttl.definitions.map((x) => x.label)).toEqual(['In IP packets', 'In DNS']);
    expect(ttl.definitions.map((x) => x.tracks)).toEqual([['How the Internet Works'], ['How the Internet Works']]);
    const echo = all.find((i) => i.id === 'echo-request')!.definitions[0]!;
    expect(echo.sources.map((s) => s.short)).toEqual(['RFC 792', 'RFC 1122', 'RFC 2151', 'Microsoft ping']);
    expect(echo.sources[0]!.places).toBe('RFC 792, Echo or Echo Reply Message, page 14; RFC 792, Echo or Echo Reply Message, page 15');
    expect(echo.sources[0]!.url).toBe('https://www.rfc-editor.org/rfc/rfc792.html#page-14');
    expect(all.find((i) => i.id === 'ip-address')!.definitions[0]!.tracks).toEqual(['How the Internet Works', 'Networking Concepts']);
  });
  test('every other pilot definition reads one track, How the Internet Works; each tracks list, of any definition, is in the order of `tracks`', () => {
    const titles = tracks.map((t) => t.title);
    const defs = all.flatMap((i) => i.definitions.map((x) => [i.id, x.tracks] as const));
    for (const [, t] of defs) expect(t).toEqual(titles.filter((x) => t.includes(x)));
    // The pilot's own rule; a later group's definitions may have other tracks, or none.
    const pilot = pilotItems(d).flatMap((i) => i.definitions.map((x) => [i.id, x.tracks] as const));
    expect(pilot.filter(([id]) => id !== 'ip-address').every(([, t]) => t.length === 1 && t[0] === 'How the Internet Works')).toBe(true);
    expect(pilot.filter(([, t]) => t.length > 0)).toHaveLength(pilot.length);
  });
  test('the lesson map: the ICMP lesson’s TTL is the IP sense, the DNS lesson’s the DNS sense, Latency is its entry’s text (E2)', () => {
    const def = (id: string, label?: string) => all.find((i) => i.id === id)!.definitions.find((x) => x.label === label)!;
    const value = (id: string, label?: string) => ({ ...(label === undefined ? {} : { label }), text: def(id, label).text, sources: def(id, label).sources.map((s) => s.short) });
    expect(d.lessonMap['what-is-icmp/term-ttl']).toEqual(value('ttl', 'In IP packets'));
    expect(d.lessonMap['what-is-dns/term-ttl']).toEqual(value('ttl', 'In DNS'));
    expect(d.lessonMap['what-is-ip/term-ttl']).toEqual(value('ttl', 'In IP packets'));
    expect(d.lessonMap['what-is-icmp/term-latency']).toEqual(value('latency'));
    expect(d.lessonMap['what-is-http/term-ip']).toEqual(value('ip-address'));
    // The map's keys are exactly the ties of the glossary: no tie without a key, no key without a tie.
    const ties = GLOSSARY.flatMap((e) => partsOf(e).flatMap((p) => p.lessons.map((t) => `${t.lesson}/${t.term}`)));
    expect(Object.keys(d.lessonMap).sort()).toEqual([...new Set(ties)].sort());
  });
  test('the pilot’s check date is its report’s own; the stamp’s date is the latest of the groups’; an unknown group has none', () => {
    expect(glossaryCheckedOn('pilot')).toBe(parseReport(pilotReport).header!.checked);
    expect(d.stamp!.date).toBe(GLOSSARY_GROUPS.map((g) => glossaryCheckedOn(g.id)!).sort().at(-1));
    expect(glossaryCheckedOn('no-such-group')).toBeNull();
  });
  test('the stamp counts the entries and carries the groups’ latest date', () => {
    expect(d.stamp).toMatchObject({ count: GLOSSARY.length });
    expect(d.stamp!.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(GLOSSARY_GROUPS.length).toBeGreaterThan(0);
  });
});
