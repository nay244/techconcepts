import { describe, expect, test } from 'vitest';
import { checkCitation, cite, defineSources, sourceListOf, type SourceEntry } from './sources';

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
  test('an unknown source throws, naming it', () => {
    expect(() => cite('nope', '1', { sources })).toThrow(/Unknown source "nope".*section 1/);
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
  test('an unknown source is reported', () => {
    expect(checkCitation({ source: 'x', section: '1', url: 'https://a.b/', label: 'x' }, sources, 'content')).toEqual([
      expect.stringMatching(/Unknown source "x"/),
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
});
