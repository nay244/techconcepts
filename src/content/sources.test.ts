import { describe, expect, test } from 'vitest';
import { checkCitation, cite, defineSources, SOURCES, sourceListOf, type SourceEntry } from './sources';

const rfc: SourceEntry = {
  id: 'rfc2131',
  kind: 'rfc',
  short: 'RFC 2131',
  title: 'Dynamic Host Configuration Protocol',
  publisher: 'IETF',
  url: 'https://www.rfc-editor.org/rfc/rfc2131.html',
  anchor: 'https://www.rfc-editor.org/rfc/rfc2131.html#section-{n}',
};
const vendor: SourceEntry = {
  id: 'ms-dhcp',
  kind: 'vendor',
  short: 'Microsoft DHCP',
  title: 'DHCP Server overview',
  publisher: 'Microsoft',
  url: 'https://learn.microsoft.com/windows-server/networking/technologies/dhcp/dhcp-top',
};
const objectives: SourceEntry = {
  id: 'aplus-objectives',
  kind: 'cert-objectives',
  short: 'A+ objectives',
  title: 'CompTIA A+ exam objectives',
  publisher: 'CompTIA',
  url: 'https://partners.comptia.org/docs/default-source/resources/aplus-objectives.pdf',
  version: 'V1',
};
const sources = defineSources([rfc, vendor, objectives]);

describe('cite', () => {
  test('an RFC section links to that section', () => {
    expect(cite('rfc2131', '3.1', { sources })).toEqual({
      source: 'rfc2131',
      section: '3.1',
      url: 'https://www.rfc-editor.org/rfc/rfc2131.html#section-3.1',
      label: 'RFC 2131 §3.1',
    });
  });
  test('a vendor page needs a URL inside the document', () => {
    expect(() => cite('ms-dhcp', 'DHCP lease', { sources })).toThrow(/needs a URL/);
    expect(() => cite('ms-dhcp', 'x', { sources, url: 'https://learn.microsoft.com/other' })).toThrow(/outside/);
    const c = cite('ms-dhcp', 'DHCP lease', { sources, url: `${vendor.url}#lease` });
    expect(c.label).toBe('Microsoft DHCP, DHCP lease');
  });
  test('a URL must be inside the document, at the section', () => {
    for (const url of [`${vendor.url}-v2`, `${vendor.url}/../../../other-doc`, vendor.url, `${vendor.url}x`]) {
      expect(() => cite('ms-dhcp', 'DHCP lease', { sources, url })).toThrow(/ms-dhcp.*DHCP lease/);
    }
    expect(() => cite('ms-dhcp', 'DHCP lease', { sources, url: vendor.url })).toThrow(/section, not the whole document/);
    expect(() => cite('ms-dhcp', 'x', { sources, url: `${vendor.url}/` })).toThrow(/ms-dhcp.*outside/);
    expect(() => cite('ms-dhcp', 'x', { sources, url: `${vendor.url}-v2` })).toThrow(/outside/);
    expect(() => cite('ms-dhcp', 'x', { sources, url: `${vendor.url}/../../../other-doc` })).toThrow(/outside/);
    expect(cite('ms-dhcp', 'DHCP lease', { sources, url: `${vendor.url}#lease` }).url).toBe(`${vendor.url}#lease`);
    expect(cite('ms-dhcp', 'Sub', { sources, url: `${vendor.url}/sub` }).url).toBe(`${vendor.url}/sub`);
  });
  test('an unnumbered section on an anchored source needs a fragment of the document', () => {
    expect(() => cite('rfc2131', 'Appendix A', { sources, url: rfc.url })).toThrow(/Appendix A/);
    expect(cite('rfc2131', 'Appendix A', { sources, url: `${rfc.url}#appendix-A` }).label).toBe('RFC 2131, Appendix A');
  });
  test('a section number with leading zeros does not take the anchor path', () => {
    expect(() => cite('rfc2131', '03.1', { sources })).toThrow(/needs a URL/);
  });
  test('an unknown source throws, naming it and saying what to do', () => {
    expect(() => cite('nope', '1', { sources })).toThrow(
      'Unknown source "nope" (cited at section 1); add it to SOURCES in src/content/sources.ts, or fix the id.',
    );
  });
});

describe('defineSources', () => {
  test('rejects non-primary or malformed entries', () => {
    expect(() => defineSources([{ ...rfc, url: 'http://www.rfc-editor.org/rfc/rfc2131' }])).toThrow(/must be an https URL/);
    expect(() => defineSources([{ ...vendor, url: 'https://en.wikipedia.org/wiki/DHCP' }])).toThrow(
      /en\.wikipedia\.org is not an allowed host for vendor/,
    );
    expect(() => defineSources([rfc, rfc])).toThrow(/Duplicate source id "rfc2131"/);
    expect(() => defineSources([{ ...rfc, anchor: 'https://www.rfc-editor.org/rfc/rfc2131.html' }])).toThrow(/\{n\}/);
    expect(() => defineSources([{ ...objectives, version: undefined }])).toThrow(/version/);
  });
  test('one document is one source, whatever its id', () => {
    expect(() => defineSources([rfc, { ...rfc, id: 'dhcp-rfc' }])).toThrow(
      /source "dhcp-rfc": names the same document as source "rfc2131"; cite that one, since one document is one source/,
    );
    const tracker = { ...rfc, id: 'rfc2131-tracker', url: 'https://datatracker.ietf.org/doc/html/rfc2131', anchor: undefined };
    expect(() => defineSources([rfc, tracker])).toThrow(/source "rfc2131-tracker": names the same document as source "rfc2131"/);
    expect(() => defineSources([rfc, { ...rfc, id: 'rfc2132', short: 'RFC 2132', url: 'https://www.rfc-editor.org/rfc/rfc2132.html', anchor: undefined }])).not.toThrow();
  });
  test('an entry url must name a document', () => {
    const iana: SourceEntry = { id: 'iana-x', kind: 'iana', short: 'IANA X', title: 'X', publisher: 'IANA', url: 'https://www.iana.org/assignments/x' };
    expect(() => defineSources([{ ...iana, url: 'https://www.iana.org' }])).toThrow(/iana-x.*document/);
    expect(() => defineSources([{ ...iana, url: 'https://www.iana.org/' }])).toThrow(/iana-x.*document/);
    expect(() => defineSources([{ ...iana, url: 'https://user:pw@www.iana.org/assignments/x' }])).toThrow(/user name or password/);
    expect(() => defineSources([{ ...iana, url: 'https://www.iana.org/assignments/x#frag' }])).toThrow(/fragment/);
    expect(() => defineSources([{ ...iana, url: 'https://www.iana.org/a/../x' }])).toThrow(/normal form/);
    expect(() => defineSources([iana])).not.toThrow();
  });
  test('an anchor must be the document plus a fragment holding {n}', () => {
    expect(() => defineSources([{ ...rfc, anchor: 'https://www.rfc-editor.org/rfc/rfc2132.html#section-{n}' }])).toThrow(/anchor must be/);
    expect(() => defineSources([{ ...rfc, anchor: 'https://x{n}@www.rfc-editor.org/rfc/rfc2131.html#s' }])).toThrow(/anchor must be/);
  });
  test('short may not contain a colon and space', () => {
    expect(() => defineSources([{ ...vendor, short: 'MS: DHCP' }])).toThrow(/short/);
  });
  test('reports every issue in one error', () => {
    expect(() => defineSources([{ ...vendor, url: 'https://en.wikipedia.org/wiki/DHCP' }, rfc, rfc])).toThrow(
      /wikipedia[\s\S]*Duplicate/,
    );
  });
  test('an anchor must be on the same host as the url', () => {
    expect(() => defineSources([{ ...rfc, anchor: 'https://datatracker.ietf.org/doc/html/rfc2131#section-{n}' }])).toThrow(/anchor must be/);
  });
});

describe('checkCitation', () => {
  test('catches edits and misuse', () => {
    const c = cite('rfc2131', '3.1', { sources });
    expect(checkCitation(c, sources, 'content')).toEqual([]);
    expect(checkCitation({ ...c, label: 'RFC 2131 §4' }, sources, 'content')).not.toEqual([]);
    expect(checkCitation({ ...c, url: 'https://www.rfc-editor.org/rfc/rfc2132.html#section-3.1' }, sources, 'content')).not.toEqual([]);
    expect(checkCitation(cite('aplus-objectives', '2.6', { sources, url: objectives.url }), sources, 'content')).toEqual([
      expect.stringMatching(/objectives document.*only.*objective mapping/),
    ]);
  });
  test('a malformed citation is reported as a shape problem', () => {
    const c = cite('rfc2131', '3.1', { sources });
    expect(checkCitation({ ...c, section: '' }, sources, 'content')).toEqual([expect.stringMatching(/section.*must not be empty/)]);
  });
  test('objectives use needs a cert-objectives source', () => {
    const c = cite('rfc2131', '3.1', { sources });
    expect(checkCitation(c, sources, 'objectives')).toEqual([expect.stringMatching(/cert-objectives/)]);
    expect(checkCitation(cite('aplus-objectives', '2.6', { sources, url: objectives.url }), sources, 'objectives')).toEqual([]);
  });
  test('an unknown source is reported, once, with what to do', () => {
    expect(checkCitation({ source: 'x', section: '1', url: 'https://a.b/', label: 'x' }, sources, 'content')).toEqual([
      'Unknown source "x" (section 1); add it to SOURCES in src/content/sources.ts, or fix the id.',
    ]);
  });
});

describe('sourceListOf', () => {
  test('lists each source once, in order of first citation', () => {
    const a = cite('ms-dhcp', 'a', { sources, url: `${vendor.url}#a` });
    const b = cite('rfc2131', '1', { sources });
    expect(sourceListOf([a, b, a], sources)).toEqual([
      { label: 'Microsoft DHCP: DHCP Server overview', url: vendor.url },
      { label: 'RFC 2131: Dynamic Host Configuration Protocol', url: rfc.url },
    ]);
  });
  test('an unknown source throws, naming it and saying what to do', () => {
    const unknown = { ...cite('rfc2131', '1', { sources }), source: 'nope' };
    expect(() => sourceListOf([unknown], sources)).toThrow(
      'Unknown source "nope" (section 1); add it to SOURCES in src/content/sources.ts, or fix the id.',
    );
  });
});

describe('ITU-T and the defining-standard marker', () => {
  const itu: SourceEntry = {
    id: 'itu-x200',
    kind: 'itu',
    short: 'ITU-T X.200',
    title: 'Open Systems Interconnection – Basic Reference Model',
    publisher: 'ITU-T',
    url: 'https://www.itu.int/rec/T-REC-X.200-199407-I/en',
  };
  test('an ITU-T Recommendation on www.itu.int is an allowed source', () => {
    expect(defineSources([itu])['itu-x200']?.kind).toBe('itu');
    expect(() => defineSources([{ ...itu, url: 'https://www.itu.org/rec/T-REC-X.200-199407-I/en' }])).toThrow(/www\.itu\.org/);
  });
  test('cite marks a defining standard only when asked', () => {
    expect(cite('rfc2131', '3.1', { sources, defining: true }).defining).toBe(true);
    expect('defining' in cite('rfc2131', '3.1', { sources })).toBe(false);
  });
  test('checkCitation accepts a defining citation', () => {
    expect(checkCitation(cite('rfc2131', '3.1', { sources, defining: true }), sources, 'content')).toEqual([]);
  });
  test('an objectives citation cannot be defining', () => {
    const c = cite('aplus-objectives', '2.6', { sources, url: objectives.url });
    expect(checkCitation({ ...c, defining: true }, sources, 'objectives')).toEqual([
      expect.stringContaining('objectives citation cannot be marked as a defining standard'),
    ]);
  });
});

describe('the OSI Model lesson’s sources', () => {
  const X200 = 'https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-X.200-199407-I!!PDF-E&type=items';
  const NIST = 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-77r1.pdf';

  test('SOURCES holds the OSI Model lesson’s sources', () => {
    expect(Object.keys(SOURCES)).toEqual(['itu-x200', 'rfc-1122', 'nist-sp800-77r1', 'microsoft-osi', 'cisco-ipip-decap', 'rfc-2003']);
    expect(SOURCES['microsoft-osi']!.publisher).not.toBe(SOURCES['cisco-ipip-decap']!.publisher);
  });

  test('an X.200 section is cited by its PDF page, as the defining standard', () => {
    expect(cite('itu-x200', '6.1.2', { url: `${X200}#page=32`, defining: true })).toEqual({
      source: 'itu-x200', section: '6.1.2', url: `${X200}#page=32`, label: 'ITU-T X.200, 6.1.2', defining: true,
    });
  });

  test('NIST SP 800-77r1 §2.1 is page 20; RFC 1122’s sections link by page, RFC 2003’s by anchor', () => {
    expect(cite('nist-sp800-77r1', '2.1', { url: `${NIST}#page=20` }).label).toBe('NIST SP 800-77r1, 2.1');
    // rfc1122.html has ids for its top-level sections and its pages only, so §1.3.3 is cited at page 17, where it starts.
    const RFC1122 = 'https://www.rfc-editor.org/rfc/rfc1122.html';
    expect(cite('rfc-1122', '1.3.3', { url: `${RFC1122}#page-17` })).toEqual({
      source: 'rfc-1122', section: '1.3.3', url: `${RFC1122}#page-17`, label: 'RFC 1122, 1.3.3',
    });
    expect(() => cite('rfc-1122', '1.3.3')).toThrow(/needs a URL/);
    expect(cite('rfc-2003', '1').url).toBe('https://www.rfc-editor.org/rfc/rfc2003.html#section-1');
  });
});
