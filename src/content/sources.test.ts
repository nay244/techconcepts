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
  test('an unknown source throws, naming it', () => {
    expect(() => cite('nope', '1', { sources })).toThrow(/Unknown source "nope".*section 1/);
  });
});

describe('defineSources', () => {
  test('rejects non-primary or malformed entries', () => {
    expect(() => defineSources([{ ...rfc, url: 'http://www.rfc-editor.org/rfc/rfc2131' }])).toThrow(/https/);
    expect(() => defineSources([{ ...vendor, url: 'https://en.wikipedia.org/wiki/DHCP' }])).toThrow(
      /en\.wikipedia\.org is not an allowed host for vendor/,
    );
    expect(() => defineSources([rfc, rfc])).toThrow(/Duplicate source id "rfc2131"/);
    expect(() => defineSources([{ ...rfc, anchor: 'https://www.rfc-editor.org/rfc/rfc2131.html' }])).toThrow(/\{n\}/);
    expect(() => defineSources([{ ...objectives, version: undefined }])).toThrow(/version/);
  });
  test('reports every issue in one error', () => {
    expect(() => defineSources([{ ...vendor, url: 'https://en.wikipedia.org/wiki/DHCP' }, rfc, rfc])).toThrow(
      /wikipedia[\s\S]*Duplicate/,
    );
  });
  test('an anchor must be on the same host as the url', () => {
    expect(() => defineSources([{ ...rfc, anchor: 'https://datatracker.ietf.org/doc/html/rfc2131#section-{n}' }])).toThrow(/same host/);
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
    const a = cite('ms-dhcp', 'a', { sources, url: vendor.url });
    const b = cite('rfc2131', '1', { sources });
    expect(sourceListOf([a, b, a], sources)).toEqual([
      { label: 'Microsoft DHCP: DHCP Server overview', url: vendor.url },
      { label: 'RFC 2131: Dynamic Host Configuration Protocol', url: rfc.url },
    ]);
  });
});
