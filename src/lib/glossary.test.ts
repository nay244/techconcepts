import { describe, expect, test } from 'vitest';
import { GLOSSARY, GLOSSARY_GROUPS } from '../content/glossary';
import { makeGroup, statement } from '../content/glossary-fixtures';
import { partsOf, type GlossaryGroupInput } from '../content/glossary-group';
import { cite } from '../content/sources';
import { FIXTURE_SOURCES, liftedFixture, makeLesson, makeTwoUnitLesson } from '../content/test-fixtures';
import { definitionsFor, glossaryData, stampLine, type GlossaryInput, type GlossaryLesson } from './glossary';
import { siteGlossary } from './glossary-site';

// The glossary page's data: D9 §9, the checks of §15 G, errata E7 to E11, and the attack cases of prototypes/d9-cases.md §3 G.

type Entry = GlossaryGroupInput['entries'][number];
let n = 0;
/** An entry with one fixture definition, with the statement ids made fresh. */
const entry = (id: string, term: string, more: Partial<Entry> = {}): Entry => ({ id, term, definition: [statement(`s-${id}-${n++}`, `${term} means something.`)], ...more });
const group = (entries: Entry[], id = 'pilot') =>
  makeGroup((i) => {
    i.id = id;
    i.entries = entries;
  });

const lesson = (slug: string, title: string, trackTitle = 'Track one', track = 'track-one'): GlossaryLesson => ({
  lesson: liftedFixture(makeLesson({ slug, title })),
  title,
  canonical: `/${track}/${slug}`,
  trackTitle,
});

const run = (groups: ReturnType<typeof group>[], extra: Partial<GlossaryInput> = {}) =>
  glossaryData({ groups, lessons: [], sources: FIXTURE_SOURCES, dates: Object.fromEntries(groups.map((g) => [g.id, '2026-11-13'])), ...extra });
const names = (d: ReturnType<typeof run>) => d.letters.flatMap((l) => l.items.map((i) => i.name));
const items = (d: ReturnType<typeof run>) => d.letters.flatMap((l) => l.items);

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

describe('7. lessons', () => {
  const ties = (...t: string[][]) => t.map(([lesson, term]) => ({ lesson: lesson!, term: term! }));
  const lessons = [lesson('what-is-ip', 'IP'), lesson('what-is-icmp', 'ICMP'), lesson('dhcp', 'DHCP', 'Networking Concepts', 'networking'), lesson('what-is-dhcp', 'DHCP', 'How the Internet Works', 'how-the-internet-works')];
  test('site order whatever the written order, Learn’s address by position, a track only where a title is shared, one link for two ties', () => {
    const d = run([group([entry('a', 'A', { lessons: ties(['what-is-icmp', 'term-1'], ['what-is-ip', 'term-2'], ['what-is-ip', 'term-3'], ['what-is-dhcp', 'term-1'], ['dhcp', 'term-2']) })])], { lessons });
    const learn = lessons[0]!.lesson.units[0]!.steps.length + 1;
    expect(items(d)[0]!.definitions[0]!.lessons).toEqual([
      { words: 'IP lesson', href: `/track-one/what-is-ip?step=${learn}` },
      { words: 'ICMP lesson', href: `/track-one/what-is-icmp?step=${learn}` },
      { words: 'DHCP lesson in Networking Concepts', href: `/networking/dhcp?step=${learn}` },
      { words: 'DHCP lesson in How the Internet Works', href: `/how-the-internet-works/what-is-dhcp?step=${learn}` },
    ]);
  });
  test('the step is the position of the unit that holds the term', () => {
    const two = { lesson: liftedFixture(makeTwoUnitLesson({ slug: 'two', title: 'Two' })), title: 'Two', canonical: '/t/two', trackTitle: 'T' };
    two.lesson.units[1]!.learn.terms[0]!.id = 'term-b';
    const second = 'term-b';
    const d = run([group([entry('a', 'A', { lessons: ties(['two', second]) })])], { lessons: [two] });
    const first = two.lesson.units[0]!.steps.length + 3;
    expect(items(d)[0]!.definitions[0]!.lessons[0]!.href).toBe(`/t/two?step=${first + two.lesson.units[1]!.steps.length + 1}`);
  });
  test('a tie to a lesson that is not ready, or a term it lacks, throws and is named', () => {
    expect(() => run([group([entry('a', 'A', { lessons: ties(['nope', 'term-1']) })])], { lessons })).toThrow('"nope"');
    expect(() => run([group([entry('a', 'A', { lessons: ties(['dhcp', 'term-99']) })])], { lessons })).toThrow('"term-99"');
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

describe('10. the lesson map', () => {
  test('keyed by lesson and term id; the sense the tie names; no key for an untied term', () => {
    const lessons = [lesson('what-is-dns', 'DNS'), lesson('what-is-icmp', 'ICMP'), lesson('what-is-ip', 'IP')];
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
    expect(d.lessonMap['what-is-dns/term-1']).toEqual({ entryId: 'ttl', entryTerm: 'TTL', label: 'In DNS', text: 'DNS text.', sources: ['RFC 9999'] });
    expect(d.lessonMap['what-is-icmp/term-1']!.label).toBe('In IP packets');
    expect(d.lessonMap['what-is-ip/term-1']!.label).toBe('In IP packets');
    expect(d.lessonMap['what-is-icmp/term-2']).toMatchObject({ entryId: 'latency', entryTerm: 'Latency' });
    expect('label' in d.lessonMap['what-is-icmp/term-2']!).toBe(false);
    expect(d.lessonMap['what-is-icmp/term-3']).toBeUndefined();
    expect(Object.keys(definitionsFor(d.lessonMap, 'what-is-icmp')).sort()).toEqual(['term-1', 'term-2']);
  });
});

describe('the real glossary (the pilot)', () => {
  const d = siteGlossary();
  const all = d.letters.flatMap((l) => l.items);
  test('item counts follow the groups; 6 letters D E I L P T; check 2’s order', () => {
    expect(all.filter((i) => i.kind === 'entry')).toHaveLength(GLOSSARY.length);
    expect(all.filter((i) => i.kind === 'pointer')).toHaveLength(GLOSSARY.reduce((s, e) => s + (e.also?.length ?? 0), 0));
    expect(all.flatMap((i) => i.definitions)).toHaveLength(GLOSSARY.reduce((s, e) => s + partsOf(e).length, 0));
    expect(d.letters.map((l) => l.letter).join('')).toBe('DEILPT');
    expect(d.keys.map((k) => k.letter).join('')).toBe('DEILPT');
    expect(all.map((i) => i.name)).toEqual(['Destination unreachable', 'Echo reply', 'Echo request', 'IP address', 'Latency', 'Packet loss', 'Ping', 'Time exceeded', 'Time to Live', 'Traceroute', 'TTL']);
  });
  test('every id on the list is used once, and the pointer is time-to-live', () => {
    const ids = all.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(all.find((i) => i.name === 'Time to Live')).toMatchObject({ id: 'time-to-live', kind: 'pointer', entryId: 'ttl' });
  });
  test('TTL, Echo request and IP address as the spec names them', () => {
    const ttl = all.find((i) => i.id === 'ttl')!;
    expect(ttl.definitions.map((x) => x.label)).toEqual(['In IP packets', 'In DNS']);
    expect(ttl.definitions[0]!.lessons.map((l) => l.href)).toEqual(['/how-the-internet-works/what-is-ip?step=6', '/how-the-internet-works/what-is-icmp?step=7']);
    expect(ttl.definitions[1]!.lessons.map((l) => l.words)).toEqual(['DNS lesson']);
    const echo = all.find((i) => i.id === 'echo-request')!.definitions[0]!;
    expect(echo.sources.map((s) => s.short)).toEqual(['RFC 792', 'RFC 1122', 'RFC 2151', 'Microsoft ping']);
    expect(echo.sources[0]!.places).toBe('RFC 792, Echo or Echo Reply Message, page 14; RFC 792, Echo or Echo Reply Message, page 15');
    expect(echo.sources[0]!.url).toBe('https://www.rfc-editor.org/rfc/rfc792.html#page-14');
    expect(all.find((i) => i.id === 'ip-address')!.definitions[0]!.lessons.map((l) => l.words)).toEqual(['HTTP lesson', 'IP lesson', 'DHCP lesson in How the Internet Works', 'DHCP lesson in Networking Concepts']);
  });
  test('the lesson map: the ICMP lesson’s TTL is the IP sense, the DNS lesson’s the DNS sense, Latency is its entry', () => {
    expect(d.lessonMap['what-is-icmp/term-ttl']!.label).toBe('In IP packets');
    expect(d.lessonMap['what-is-dns/term-ttl']!.label).toBe('In DNS');
    expect(d.lessonMap['what-is-ip/term-ttl']!.label).toBe('In IP packets');
    expect(d.lessonMap['what-is-icmp/term-latency']).toMatchObject({ entryId: 'latency', entryTerm: 'Latency' });
    expect(Object.keys(d.lessonMap).some((k) => k.startsWith('osi-model/'))).toBe(false);
  });
  test('the stamp counts the entries and carries the groups’ latest date', () => {
    expect(d.stamp).toMatchObject({ count: GLOSSARY.length });
    expect(d.stamp!.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(GLOSSARY_GROUPS.length).toBeGreaterThan(0);
  });
});
