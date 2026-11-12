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
      { label: 'Microsoft DHCP: DHCP Server overview', url: vendor.url, source: 'ms-dhcp' },
      { label: 'RFC 2131: Dynamic Host Configuration Protocol', url: rfc.url, source: 'rfc2131' },
    ]);
  });
  test('an unknown source throws, naming it and saying what to do', () => {
    const unknown = { ...cite('rfc2131', '1', { sources }), source: 'nope' };
    expect(() => sourceListOf([unknown], sources)).toThrow(
      'Unknown source "nope" (section 1); add it to SOURCES in src/content/sources.ts, or fix the id.',
    );
  });
});

describe('the four source groups added by the owner on 2026-11-08', () => {
  // WHATWG's three hosts joined with What is HTTP, the first lesson to cite a standards body; W3C's has not.
  test('a standards-body source is allowed on a listed host and refused on any other', () => {
    const entry: SourceEntry = { id: 'example', kind: 'standards-body', short: 'W3C', title: 'Example page', publisher: 'W3C', url: 'https://www.w3.org/TR/WCAG22/' };
    expect(() => defineSources([entry])).toThrow(/www\.w3\.org is not an allowed host for standards-body/);
    expect(() => defineSources([{ ...entry, short: 'WHATWG', publisher: 'WHATWG', url: 'https://html.spec.whatwg.org/index.html' }])).not.toThrow();
    for (const id of ['whatwg-html', 'whatwg-url', 'whatwg-fetch']) expect(SOURCES[id]!.kind).toBe('standards-body');
  });
  // ICANN's host joined with What is DNS, the first lesson to cite an internet registry; the five regional registries' have not.
  test('an internet-registry source is allowed on a listed host and refused on any other', () => {
    const entry: SourceEntry = { id: 'example', kind: 'internet-registry', short: 'ARIN', title: 'Example page', publisher: 'ARIN', url: 'https://www.arin.net/resources/guide/ipv6/' };
    expect(() => defineSources([entry])).toThrow(/www\.arin\.net is not an allowed host for internet-registry/);
    expect(() => defineSources([{ ...entry, short: 'ICANN', publisher: 'ICANN', url: 'https://www.icann.org/en/rssac/faq' }])).not.toThrow();
    expect(SOURCES['icann-rssac-faq']!.kind).toBe('internet-registry');
  });
  // One real page per group; each publisher's host joins SOURCE_HOSTS with the first lesson that cites it.
  test.each([
    ['government', 'CISA', 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog'],
    ['security-reference', 'FIRST', 'https://www.first.org/cvss/v4.0/specification-document'],
  ] as const)('a %s source is a kind of its own, refused until its host is listed', (kind, publisher, url) => {
    const entry: SourceEntry = { id: 'example', kind, short: publisher, title: 'Example page', publisher, url };
    expect(() => defineSources([entry])).toThrow(
      new RegExp(`no host is allowed yet for ${kind}; add .+ to SOURCE_HOSTS in the change that first cites it`),
    );
  });
});

describe('community sources, added by the owner on 2026-11-09', () => {
  // Canonical's blog joined with What is DHCP, the first lesson to cite a community source; no other site has.
  test('a blog, forum or post is a community source, allowed on a listed host and refused on any other', () => {
    const entry: SourceEntry = {
      id: 'example-post',
      kind: 'community',
      short: 'Example blog',
      title: 'How DHCP works',
      publisher: 'Example blog',
      url: 'https://blog.example.com/how-dhcp-works',
    };
    expect(() => defineSources([entry])).toThrow(/blog\.example\.com is not an allowed host for community/);
    expect(() => defineSources([{ ...entry, url: 'https://canonical.com/blog/how-dhcp-works' }])).not.toThrow();
    expect(SOURCES['canonical-dhcp-concepts']!.kind).toBe('community');
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

  test('SOURCES holds the OSI Model lesson’s sources, then the UDP lesson’s, the HTTP lesson’s, then batch 1’s, batch 2’s, batch 3’s and batch 4’s', () => {
    expect(Object.keys(SOURCES)).toEqual([
      'itu-x200', 'rfc-1122', 'nist-sp800-77r1', 'microsoft-osi', 'cisco-ipip-decap', 'rfc-2003',
      'rfc-768', 'rfc-8085', 'rfc-3550', 'rfc-3551', 'rfc-9000', 'rfc-4787', 'rfc-9293', 'rfc-1035', 'rfc-2131', 'rfc-791', 'iana-ports',
      'itu-g114', 'itu-g711-appi', 'rfc-8836', 'rfc-8834', 'rfc-9114', 'rfc-7567', 'rfc-5681', 'rfc-6716', 'rfc-3417', 'rfc-9308', 'rfc-9312',
      'cloudflare-network-layers', 'microsoft-azure-lb', 'microsoft-gdk-udp',
      'rfc-3611', 'rfc-8445', 'rfc-9868', 'rfc-4961',
      'rfc-9110', 'rfc-9111', 'rfc-9112', 'rfc-9113', 'rfc-1034', 'rfc-9499', 'rfc-3986', 'rfc-6265', 'rfc-6335',
      'whatwg-html', 'whatwg-url', 'whatwg-fetch', 'iana-media-types', 'microsoft-app-gateway',
      // Batch 1: What is HTTPS's,
      'rfc-9846', 'rfc-6797', 'rfc-9849', 'rfc-6066', 'rfc-5280', 'rfc-9525', 'rfc-8484', 'rfc-7858', 'rfc-9076', 'rfc-9001', 'rfc-10024', 'rfc-7748', 'rfc-8555',
      'cloudflare-dns-encryption', 'cloudflare-pqc-support', 'cloudflare-mixed-content', 'cloudflare-lb-proxy-modes', 'cloudflare-cert-validity',
      'microsoft-edge-https-first', 'microsoft-edge-secure', 'google-chrome-secure', 'google-chrome-always-secure', 'letsencrypt-faq', 'letsencrypt-how',
      // What is TCP's,
      'rfc-2018', 'rfc-8985', 'rfc-6298', 'rfc-7413', 'rfc-4987', 'rfc-2914', 'rfc-9438', 'rfc-5321', 'rfc-959', 'microsoft-azure-tcpip-tuning',
      // and What is DNS's.
      'rfc-7766', 'rfc-9156', 'rfc-4033', 'rfc-3596', 'rfc-8305', 'rfc-8767', 'rfc-8806', 'rfc-7720', 'rfc-5625', 'rfc-2132', 'rfc-5452', 'rfc-3833',
      'iana-root-servers', 'iana-root-zone', 'iana-root-db-app', 'iana-root-zone-file', 'icann-rssac-faq',
      'microsoft-ipconfig', 'microsoft-365-add-domain', 'microsoft-traffic-manager',
      // and What is HTTPS's second round.
      'rfc-8404', 'rfc-9065',
      // Batch 2: What is IP's,
      'rfc-8200', 'rfc-826', 'rfc-894', 'rfc-1918', 'rfc-3022', 'rfc-1812', 'rfc-4632', 'rfc-4271', 'rfc-4861',
      'rfc-4864', 'rfc-6250', 'rfc-3704', 'rfc-5227', 'rfc-9724', 'rfc-7066', 'rfc-792', 'iana-ip-parameters', 'iana-protocol-numbers',
      'microsoft-route', 'microsoft-arp', 'cisco-route-command', 'cisco-dai',
      // What is DHCP's,
      'rfc-3927', 'rfc-9915', 'rfc-4862', 'rfc-7610', 'rfc-7513', 'iana-dhcp-parameters', 'microsoft-dhcp-troubleshoot',
      'microsoft-dhcp-basics', 'microsoft-dhcp-server', 'microsoft-dhcp-quickstart', 'microsoft-dhcp-training', 'microsoft-network-settings', 'google-nest-lan-ip', 'google-nest-dhcp-reservation',
      'paloalto-dhcp-overview', 'paloalto-dhcp-messages', 'cisco-dhcp-server', 'cisco-dhcp-troubleshoot', 'canonical-dhcp-concepts',
      // and What is ICMP's.
      'rfc-1191', 'rfc-2151', 'rfc-2923', 'rfc-4443', 'rfc-4890', 'rfc-9099', 'iana-icmp-parameters',
      'microsoft-ping', 'microsoft-tracert', 'cisco-ping-traceroute', 'cisco-traceroute-os', 'cloudflare-icmp', 'paloalto-icmp',      // Batch 3: What is SMTP's,
      'rfc-6409', 'rfc-8314', 'rfc-3207', 'rfc-4954', 'rfc-4616', 'rfc-1870', 'rfc-2920', 'rfc-5598',
      'rfc-7208', 'rfc-6376', 'rfc-9989', 'rfc-8461', 'rfc-7672', 'rfc-1939', 'rfc-9051',
      'google-lsa-oauth', 'google-app-passwords', 'microsoft-outlook-com-settings', 'microsoft-app-passwords', 'microsoft-azure-outbound-smtp', 'paloalto-layer-7', 'cloudflare-layer-7',
      // What is POP3's,
      'rfc-2595', 'rfc-5034', 'rfc-7817', 'rfc-5322', 'rfc-2046', 'microsoft-imap-pop', 'google-gmail-pop',
      // and What is IMAP's.
      'rfc-9208', 'rfc-7162', 'microsoft-exchange-pop-imap', 'google-gmail-imap-settings', 'google-storage', 'rfc-5550',
      // Batch 4: What is FTP's,
      'rfc-2228', 'rfc-2577', 'rfc-4217', 'rfc-2428', 'rfc-1579', 'rfc-3659', 'rfc-1350',
      'rfc-1635', 'microsoft-iis-ftp-firewall', 'microsoft-iis-ftp-ssl', 'microsoft-app-service-ftp', 'microsoft-azure-sftp', 'microsoft-sftp-connector', 'microsoft-iis-ftp-anonymous',
      'microsoft-pxe-winpe', 'cloudflare-spectrum-ftp', 'cloudflare-spectrum-glossary', 'google-merchant-sftp', 'cisco-asa-inspect-overview', 'cisco-asa-inspect-basic', 'cisco-router-upgrade',
      // What is SSH's,
      'rfc-4251', 'rfc-4252', 'rfc-4253', 'rfc-4254', 'rfc-9941', 'rfc-10042', 'rfc-8709',
      'rfc-5647', 'rfc-4256', 'rfc-9987', 'iana-ssh-parameters', 'nist-ir-7966', 'nist-sp800-123', 'microsoft-openssh-overview',
      'microsoft-openssh-get-started', 'microsoft-openssh-keys', 'microsoft-openssh-server-config', 'microsoft-azure-ssh-quick', 'microsoft-azure-ssh-detailed', 'microsoft-hdinsight-ssh-tunnel', 'cisco-ssh-configure',
      'openbsd-man-ssh-config', 'openbsd-man-sshd-config', 'openbsd-man-ssh', 'openbsd-man-sshd', 'openbsd-man-ssh-agent', 'openbsd-man-sftp', 'cloudflare-ssh',
      // and What is TLS's.
      'rfc-5869', 'rfc-5116', 'rfc-9162', 'rfc-6176', 'rfc-7568', 'rfc-8996', 'rfc-9325',
      'rfc-9852', 'nist-sp800-52r2', 'microsoft-tls-protocol', 'microsoft-sql-tls-1-3', 'microsoft-app-service-certificates', 'paloalto-tls-handshake', 'paloalto-tls-certificate',
      'cloudflare-client-certificates', 'microsoft-ms-sstp',
    ]);
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
