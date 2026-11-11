import { z } from 'zod';
import { httpsUrl, slugSchema, text } from './primitives';
import type { Source } from './schema';

/**
 * The primary-source registry and exact-section citations (direction doc §3.1, §3.2). Every factual statement
 * cites a source in this registry at the section it comes from. Primary sources are preferred: RFCs, IEEE,
 * IANA, NIST, ITU-T, the four groups the owner added on 2026-11-08 (other standards bodies, government security
 * agencies, security reference programmes, internet registries) and official vendor documentation. Since 2026-11-09
 * blogs, forums and posts count too, as `community` sources. Official certification objective documents are for exam
 * tags and objective mapping only.
 */

export const SOURCE_KINDS = [
  'rfc',
  'ieee',
  'iana',
  'nist',
  'itu',
  'standards-body',
  'government',
  'security-reference',
  'internet-registry',
  'community',
  'vendor',
  'cert-objectives',
] as const;
export type SourceKind = (typeof SOURCE_KINDS)[number];

/** Exact hosts each kind may live on. No wildcards. */
export const SOURCE_HOSTS: Record<SourceKind, readonly string[]> = {
  rfc: ['www.rfc-editor.org', 'datatracker.ietf.org'],
  ieee: ['standards.ieee.org', 'ieeexplore.ieee.org'],
  iana: ['www.iana.org'],
  nist: ['csrc.nist.gov', 'nvlpubs.nist.gov', 'www.nist.gov'],
  // ITU-T Recommendations, free to read: X.200 defines the OSI model (owner, 2026-11-08).
  itu: ['www.itu.int'],
  // The four groups the owner added on 2026-11-08 (direction doc §3.2). No host is listed until a lesson cites one:
  // each publisher's own host joins here in that change.
  // W3C, WHATWG, Wi-Fi Alliance, ETSI, 3GPP, Unicode, Ecma, Bluetooth SIG, USB-IF, UEFI Forum, NVM Express.
  'standards-body': [],
  // CISA, the UK's NCSC, ENISA. NIST keeps its own kind.
  government: [],
  // MITRE's CVE, CWE and ATT&CK; FIRST's CVSS.
  'security-reference': [],
  // ICANN and the five regional internet registries: ARIN, RIPE NCC, APNIC, LACNIC, AFRINIC. IANA keeps its own kind.
  'internet-registry': [],
  // Blogs (a vendor's included), forums and posts, readable without signing in (owner, 2026-11-09). Each site's host
  // joins here with the first lesson that cites it. Wikipedia, videos and AI output never count.
  community: [],
  vendor: ['learn.microsoft.com', 'www.cisco.com', 'developers.cloudflare.com', 'docs.paloaltonetworks.com'],
  'cert-objectives': ['www.comptia.org', 'partners.comptia.org', 'learningnetwork.cisco.com'],
};

const sourceEntrySchema = z.strictObject({
  id: slugSchema,
  kind: z.enum(SOURCE_KINDS),
  /** About splits a source list label at ": ", so a short name may not contain it. */
  short: text.refine((v) => !v.includes(': '), 'must not contain ": "'),
  title: text,
  publisher: text,
  url: httpsUrl,
  anchor: httpsUrl.optional(),
  version: text.optional(),
});
export type SourceEntry = z.infer<typeof sourceEntrySchema>;
export type SourceRegistry = Readonly<Record<string, SourceEntry>>;

function hostOf(url: string): string | undefined {
  try {
    return new URL(url).host;
  } catch {
    return undefined;
  }
}

function parse(url: string): URL | undefined {
  try {
    return new URL(url);
  } catch {
    return undefined;
  }
}

/** Why a registry url does not name a document, or undefined when it does. */
function documentProblem(url: string): string | undefined {
  const u = parse(url);
  if (!u) return 'url cannot be read';
  if (u.pathname === '/') return 'url must name a document, not a site root';
  if (u.href !== url) return 'url must be in normal form (no "..", default port or upper-case host)';
  if (u.username || u.password) return 'url must not include a user name or password';
  if (u.hash) return 'url must not include a fragment';
  return undefined;
}

/** True when `url` is the document or something below it: same origin, same page with a fragment, or a sub-path. */
function insideDocument(url: string, doc: string): boolean {
  const u = parse(url);
  const d = parse(doc);
  if (!u || !d || u.href !== url || u.username || u.password || u.origin !== d.origin) return false;
  if (u.pathname === d.pathname && u.search === d.search) return true;
  const base = d.pathname.endsWith('/') ? d.pathname : `${d.pathname}/`;
  return u.pathname.startsWith(base) && u.pathname.length > base.length;
}

/** True when `url` is the document itself, with no fragment and no sub-path. */
function isWholeDocument(url: string, doc: string): boolean {
  const u = parse(url);
  const d = parse(doc);
  if (!u || !d || u.search !== d.search || u.hash) return false;
  const base = d.pathname.endsWith('/') ? d.pathname : `${d.pathname}/`;
  return u.pathname === d.pathname || u.pathname === base;
}

/** True when `url` is the document's own page plus a fragment. */
function isFragmentOf(url: string, doc: string): boolean {
  const u = parse(url);
  const d = parse(doc);
  return !!u && !!d && u.pathname === d.pathname && u.search === d.search && u.hash.length > 1;
}

/** Validates every entry and returns the registry keyed by id. Throws one Error listing every issue. */
/**
 * What document an entry names, for telling one document from two: an RFC by its number on any RFC host, anything
 * else by its url. Two entries for one document would count as two sources under the two-source rule.
 */
function documentOf(e: SourceEntry): string {
  const rfc = e.kind === 'rfc' ? /\brfc(\d+)\b/i.exec(parse(e.url)?.pathname ?? '') : null;
  return rfc ? `rfc:${Number(rfc[1])}` : e.url;
}

export function defineSources(entries: SourceEntry[]): SourceRegistry {
  const issues: string[] = [];
  const registry: Record<string, SourceEntry> = {};
  for (const [i, raw] of entries.entries()) {
    const name = `source ${typeof raw?.id === 'string' ? `"${raw.id}"` : `#${i + 1}`}`;
    const parsed = sourceEntrySchema.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) issues.push(`${name}: ${issue.path.join('.') || 'entry'} ${issue.message}`);
      continue;
    }
    const e = parsed.data;
    if (Object.hasOwn(registry, e.id)) {
      issues.push(`Duplicate source id "${e.id}"`);
      continue;
    }
    const same = Object.values(registry).find((other) => documentOf(other) === documentOf(e));
    if (same !== undefined) {
      issues.push(`${name}: names the same document as source "${same.id}"; cite that one, since one document is one source (docs/content-model.md §3)`);
    }
    registry[e.id] = e;
    const allowed = SOURCE_HOSTS[e.kind];
    const host = hostOf(e.url);
    const docIssue = documentProblem(e.url);
    if (docIssue) issues.push(`${name}: ${docIssue}`);
    if (!host) issues.push(`${name}: the host of url cannot be read`);
    else if (allowed.length === 0) {
      issues.push(`${name}: no host is allowed yet for ${e.kind}; add ${host}, if it is the publisher's own, to SOURCE_HOSTS in the change that first cites it`);
    } else if (!allowed.includes(host)) {
      issues.push(`${name}: ${host} is not an allowed host for ${e.kind} (allowed: ${allowed.join(', ')})`);
    }
    if (e.anchor !== undefined) {
      const prefix = `${e.url}#`;
      if (!e.anchor.startsWith(prefix) || !e.anchor.slice(prefix.length).includes('{n}')) {
        issues.push(`${name}: anchor must be the url plus a fragment that contains {n}, the section number (${prefix}...{n})`);
      }
    }
    if (e.kind === 'cert-objectives' && e.version === undefined) {
      issues.push(`${name}: a cert-objectives source needs a version (the objectives edition it pins)`);
    }
  }
  if (issues.length) throw new Error(`Invalid sources:\n- ${issues.join('\n- ')}`);
  return Object.freeze(registry);
}

/** The registry. The OSI Model lesson brought these entries; later lessons add theirs. */
export const SOURCES: SourceRegistry = defineSources([
  {
    id: 'itu-x200',
    kind: 'itu',
    short: 'ITU-T X.200',
    title: 'Information technology – Open Systems Interconnection – Basic Reference Model: The basic model',
    publisher: 'ITU-T',
    url: 'https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-X.200-199407-I!!PDF-E&type=items',
  },
  // No anchor: rfc1122.html has ids for its top-level sections and its pages (`#page-N`) only, so a section is cited
  // by the page it starts on.
  {
    id: 'rfc-1122',
    kind: 'rfc',
    short: 'RFC 1122',
    title: 'Requirements for Internet Hosts – Communication Layers',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc1122.html',
  },
  {
    id: 'nist-sp800-77r1',
    kind: 'nist',
    short: 'NIST SP 800-77r1',
    title: 'Guide to IPsec VPNs',
    publisher: 'NIST',
    url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-77r1.pdf',
  },
  {
    id: 'microsoft-osi',
    kind: 'vendor',
    short: 'Microsoft Learn',
    title: 'Windows network architecture and the OSI model',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/windows-hardware/drivers/network/windows-network-architecture-and-the-osi-model',
  },
  {
    id: 'cisco-ipip-decap',
    kind: 'vendor',
    short: 'Cisco',
    title: 'IP-in-IP Decapsulation',
    publisher: 'Cisco',
    url: 'https://www.cisco.com/c/en/us/td/docs/iosxr/cisco8000/interfaces-and-hardware-component/configuration-guide/interfaces-and-hardware-component-config-cisco8000/ip-in-ip-tunnels-overview/ip-in-ip-decapsulation.html',
  },
  {
    id: 'rfc-2003',
    kind: 'rfc',
    short: 'RFC 2003',
    title: 'IP Encapsulation within IP',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc2003.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc2003.html#section-{n}',
  },
  // RFC 768 has no ids in its html (only its pages 2 and 3), so a section is cited by a text fragment of the passage.
  {
    id: 'rfc-768',
    kind: 'rfc',
    short: 'RFC 768',
    title: 'User Datagram Protocol',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc768.html',
  },
  {
    id: 'rfc-8085',
    kind: 'rfc',
    short: 'RFC 8085',
    title: 'UDP Usage Guidelines',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc8085.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc8085.html#section-{n}',
  },
  {
    id: 'rfc-3550',
    kind: 'rfc',
    short: 'RFC 3550',
    title: 'RTP: A Transport Protocol for Real-Time Applications',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc3550.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc3550.html#section-{n}',
  },
  {
    id: 'rfc-3551',
    kind: 'rfc',
    short: 'RFC 3551',
    title: 'RTP Profile for Audio and Video Conferences with Minimal Control',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc3551.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc3551.html#section-{n}',
  },
  {
    id: 'rfc-9000',
    kind: 'rfc',
    short: 'RFC 9000',
    title: 'QUIC: A UDP-Based Multiplexed and Secure Transport',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9000.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9000.html#section-{n}',
  },
  {
    id: 'rfc-4787',
    kind: 'rfc',
    short: 'RFC 4787',
    title: 'Network Address Translation (NAT) Behavioral Requirements for Unicast UDP',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc4787.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc4787.html#section-{n}',
  },
  {
    id: 'rfc-9293',
    kind: 'rfc',
    short: 'RFC 9293',
    title: 'Transmission Control Protocol (TCP)',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9293.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9293.html#section-{n}',
  },
  {
    id: 'rfc-1035',
    kind: 'rfc',
    short: 'RFC 1035',
    title: 'Domain Names - Implementation and Specification',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc1035.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc1035.html#section-{n}',
  },
  {
    id: 'rfc-2131',
    kind: 'rfc',
    short: 'RFC 2131',
    title: 'Dynamic Host Configuration Protocol',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc2131.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc2131.html#section-{n}',
  },
  {
    id: 'rfc-791',
    kind: 'rfc',
    short: 'RFC 791',
    title: 'Internet Protocol',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc791.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc791.html#section-{n}',
  },
  {
    id: 'iana-ports',
    kind: 'iana',
    short: 'IANA Port Numbers',
    title: 'Service Name and Transport Protocol Port Number Registry',
    publisher: 'IANA',
    url: 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml',
  },
  {
    id: 'itu-g114',
    kind: 'itu',
    short: 'ITU-T G.114',
    title: 'One-way transmission time',
    publisher: 'ITU-T',
    url: 'https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-G.114-200305-I!!PDF-E&type=items',
  },
  {
    id: 'itu-g711-appi',
    kind: 'itu',
    short: 'ITU-T G.711 Appendix I',
    title: 'A high quality low-complexity algorithm for packet loss concealment with G.711',
    publisher: 'ITU-T',
    url: 'https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-G.711-199909-I!AppI!PDF-E&type=items',
  },
  {
    id: 'rfc-8836',
    kind: 'rfc',
    short: 'RFC 8836',
    title: 'Congestion Control Requirements for Interactive Real-Time Media',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc8836.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc8836.html#section-{n}',
  },
  {
    id: 'rfc-8834',
    kind: 'rfc',
    short: 'RFC 8834',
    title: 'Media Transport and Use of RTP in WebRTC',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc8834.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc8834.html#section-{n}',
  },
  {
    id: 'rfc-9114',
    kind: 'rfc',
    short: 'RFC 9114',
    title: 'HTTP/3',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9114.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9114.html#section-{n}',
  },
  {
    id: 'rfc-7567',
    kind: 'rfc',
    short: 'RFC 7567',
    title: 'IETF Recommendations Regarding Active Queue Management',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc7567.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc7567.html#section-{n}',
  },
  {
    id: 'rfc-5681',
    kind: 'rfc',
    short: 'RFC 5681',
    title: 'TCP Congestion Control',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc5681.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc5681.html#section-{n}',
  },
  {
    id: 'rfc-6716',
    kind: 'rfc',
    short: 'RFC 6716',
    title: 'Definition of the Opus Audio Codec',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc6716.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc6716.html#section-{n}',
  },
  {
    id: 'rfc-3417',
    kind: 'rfc',
    short: 'RFC 3417',
    title: 'Transport Mappings for the Simple Network Management Protocol (SNMP)',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc3417.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc3417.html#section-{n}',
  },
  {
    id: 'rfc-9308',
    kind: 'rfc',
    short: 'RFC 9308',
    title: 'Applicability of the QUIC Transport Protocol',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9308.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9308.html#section-{n}',
  },
  {
    id: 'rfc-9312',
    kind: 'rfc',
    short: 'RFC 9312',
    title: 'Manageability of the QUIC Transport Protocol',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9312.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9312.html#section-{n}',
  },
  {
    id: 'cloudflare-network-layers',
    kind: 'vendor',
    short: 'Cloudflare',
    title: 'Network Layers',
    publisher: 'Cloudflare',
    url: 'https://developers.cloudflare.com/fundamentals/reference/network-layers/',
  },
  {
    id: 'microsoft-azure-lb',
    kind: 'vendor',
    short: 'Microsoft Azure',
    title: 'What is Azure Load Balancer?',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-overview',
  },
  {
    id: 'microsoft-gdk-udp',
    kind: 'vendor',
    short: 'Microsoft GDK',
    title: 'Preferred local UDP multiplayer port networking APIs',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/gaming/gdk/docs/features/console/networking/game-mesh/preferred-local-udp-multiplayer-port-networking',
  },
  {
    id: 'rfc-3611',
    kind: 'rfc',
    short: 'RFC 3611',
    title: 'RTP Control Protocol Extended Reports (RTCP XR)',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc3611.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc3611.html#section-{n}',
  },
  {
    id: 'rfc-8445',
    kind: 'rfc',
    short: 'RFC 8445',
    title: 'Interactive Connectivity Establishment (ICE): A Protocol for Network Address Translator (NAT) Traversal',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc8445.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc8445.html#section-{n}',
  },
]);

/**
 * One citation. `defining` marks the source as the defining standard for what the claim describes, such as the RFC
 * that defines a field: such a claim may rest on that one source. Any other claim needs a second, independent source.
 */
export const citationSchema = z.strictObject({
  source: slugSchema,
  section: text,
  url: httpsUrl,
  label: text,
  defining: z.literal(true).optional(),
});
export type Citation = z.infer<typeof citationSchema>;

const NUMBERED = /^(0|[1-9]\d*)(\.(0|[1-9]\d*))*$/;

/** What to do about a source the registry does not have, added to every message that names one. */
const UNKNOWN_SOURCE_FIX = 'add it to SOURCES in src/content/sources.ts, or fix the id.';

/** Builds a citation. A numbered section on a source with an anchor links straight to it; otherwise `opts.url` is required. */
export function cite(source: string, section: string, opts: { url?: string; sources?: SourceRegistry; defining?: true } = {}): Citation {
  const c = locate(source, section, opts);
  return opts.defining === true ? { ...c, defining: true } : c;
}

/** The citation `cite` builds, before any defining-standard marker. */
function locate(source: string, section: string, opts: { url?: string; sources?: SourceRegistry }): Citation {
  const registry = opts.sources ?? SOURCES;
  const entry = Object.hasOwn(registry, source) ? registry[source] : undefined;
  if (!entry) throw new Error(`Unknown source "${source}" (cited at section ${section}); ${UNKNOWN_SOURCE_FIX}`);
  if (NUMBERED.test(section) && entry.anchor) {
    return { source, section, url: entry.anchor.replaceAll('{n}', section), label: `${entry.short} §${section}` };
  }
  const where = `Source "${source}", section ${section}`;
  if (!opts.url) throw new Error(`${where}: needs a URL, because the section is not a numbered one on a source with an anchor`);
  if (!insideDocument(opts.url, entry.url)) {
    throw new Error(`${where}: URL ${opts.url} is outside the document ${entry.url}`);
  }
  if (entry.kind !== 'cert-objectives' && isWholeDocument(opts.url, entry.url)) {
    throw new Error(`${where}: the citation must point at the section, not the whole document (add a fragment or a sub-path)`);
  }
  if (entry.anchor && !NUMBERED.test(section) && !isFragmentOf(opts.url, entry.url)) {
    throw new Error(`${where}: on a source with an anchor, an unnumbered section needs the document URL plus a fragment`);
  }
  return { source, section, url: opts.url, label: `${entry.short}, ${section}` };
}

/** Problems with a citation, as readable messages; empty when it is sound. */
export function checkCitation(c: Citation, sources: SourceRegistry, use: 'content' | 'objectives'): string[] {
  const shape = citationSchema.safeParse(c);
  if (!shape.success) return shape.error.issues.map((i) => `Citation ${i.path.join('.') || 'value'} ${i.message}`);
  const entry = Object.hasOwn(sources, c.source) ? sources[c.source] : undefined;
  if (!entry) return [`Unknown source "${c.source}" (section ${c.section}); ${UNKNOWN_SOURCE_FIX}`];
  const problems: string[] = [];
  if (use === 'content' && entry.kind === 'cert-objectives') {
    problems.push(`Source "${c.source}" (section ${c.section}) is an objectives document, which may be cited only for objective mapping, not for content`);
  }
  if (use === 'objectives' && c.defining === true) {
    problems.push(`Source "${c.source}" (section ${c.section}): an objectives citation cannot be marked as a defining standard; remove the marker`);
  }
  if (use === 'objectives' && entry.kind !== 'cert-objectives') {
    problems.push(`Source "${c.source}" (section ${c.section}) is a source of kind "${entry.kind}"; objective mapping must cite a cert-objectives source`);
  }
  try {
    const expected = cite(c.source, c.section, { url: c.url, sources });
    if (expected.url !== c.url) problems.push(`Source "${c.source}", section ${c.section}: URL should be ${expected.url}, not ${c.url}`);
    if (expected.label !== c.label) problems.push(`Source "${c.source}", section ${c.section}: label should be "${expected.label}", not "${c.label}"`);
  } catch (e) {
    problems.push((e as Error).message);
  }
  return problems;
}

/** One `{ label: "<short>: <title>", url }` per source, in order of first citation. */
export function sourceListOf(citations: Citation[], sources: SourceRegistry): Source[] {
  const seen = new Set<string>();
  const list: Source[] = [];
  for (const c of citations) {
    if (seen.has(c.source)) continue;
    seen.add(c.source);
    const entry = Object.hasOwn(sources, c.source) ? sources[c.source] : undefined;
    if (!entry) throw new Error(`Unknown source "${c.source}" (section ${c.section}); ${UNKNOWN_SOURCE_FIX}`);
    list.push({ label: `${entry.short}: ${entry.title}`, url: entry.url, source: c.source });
  }
  return list;
}
