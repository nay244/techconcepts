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
  // The root zone file is IANA's, served from InterNIC: IANA's Root Files page names it the authoritative root zone
  // (What is DNS, batch 1).
  iana: ['www.iana.org', 'www.internic.net'],
  nist: ['csrc.nist.gov', 'nvlpubs.nist.gov', 'www.nist.gov'],
  // ITU-T Recommendations, free to read: X.200 defines the OSI model (owner, 2026-11-08).
  itu: ['www.itu.int'],
  // The four groups the owner added on 2026-11-08 (direction doc §3.2). No host is listed until a lesson cites one:
  // each publisher's own host joins here in that change.
  // W3C, WHATWG, Wi-Fi Alliance, ETSI, 3GPP, Unicode, Ecma, Bluetooth SIG, USB-IF, UEFI Forum, NVM Express.
  // WHATWG's three joined with What is HTTP: the HTML, URL and Fetch standards.
  'standards-body': ['html.spec.whatwg.org', 'url.spec.whatwg.org', 'fetch.spec.whatwg.org'],
  // CISA, the UK's NCSC, ENISA. NIST keeps its own kind.
  government: [],
  // MITRE's CVE, CWE and ATT&CK; FIRST's CVSS.
  'security-reference': [],
  // ICANN and the five regional internet registries: ARIN, RIPE NCC, APNIC, LACNIC, AFRINIC. IANA keeps its own kind.
  // ICANN's own site joined with What is DNS: its root server committee's FAQ counts the root servers' copies.
  'internet-registry': ['www.icann.org'],
  // Blogs (a vendor's included), forums and posts, readable without signing in (owner, 2026-11-09). Each site's host
  // joins here with the first lesson that cites it. Wikipedia, videos and AI output never count.
  // Canonical's blog joined with What is DHCP: with Microsoft's page it is the second publisher that calls the four
  // messages DORA.
  community: ['canonical.com'],
  // Three joined with What is HTTPS: what a browser shows and tries first is in its maker's own help pages
  // (Microsoft's and Google's), and what Let's Encrypt issues is in its own documentation.
  vendor: [
    'learn.microsoft.com', 'www.cisco.com', 'developers.cloudflare.com', 'docs.paloaltonetworks.com',
    'support.microsoft.com', 'support.google.com', 'letsencrypt.org',
    // Cloudflare's own explainer pages joined with What is ICMP: no other allowed host has a second vendor that places
    // ICMP at a layer. The site refuses a command-line read; the page reads in a browser.
    'www.cloudflare.com',
  ],
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
  {
    id: 'rfc-9868',
    kind: 'rfc',
    short: 'RFC 9868',
    title: 'Transport Options for UDP',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9868.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9868.html#section-{n}',
  },
  {
    id: 'rfc-4961',
    kind: 'rfc',
    short: 'RFC 4961',
    title: 'Symmetric RTP / RTP Control Protocol (RTCP)',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc4961.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc4961.html#section-{n}',
  },
  // What is HTTP's documents, registered before its author starts (plan.md, decision 6).
  {
    id: 'rfc-9110',
    kind: 'rfc',
    short: 'RFC 9110',
    title: 'HTTP Semantics',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9110.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9110.html#section-{n}',
  },
  {
    id: 'rfc-9111',
    kind: 'rfc',
    short: 'RFC 9111',
    title: 'HTTP Caching',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9111.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9111.html#section-{n}',
  },
  {
    id: 'rfc-9112',
    kind: 'rfc',
    short: 'RFC 9112',
    title: 'HTTP/1.1',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9112.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9112.html#section-{n}',
  },
  {
    id: 'rfc-9113',
    kind: 'rfc',
    short: 'RFC 9113',
    title: 'HTTP/2',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9113.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9113.html#section-{n}',
  },
  {
    id: 'rfc-1034',
    kind: 'rfc',
    short: 'RFC 1034',
    title: 'Domain Names - Concepts and Facilities',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc1034.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc1034.html#section-{n}',
  },
  {
    id: 'rfc-9499',
    kind: 'rfc',
    short: 'RFC 9499',
    title: 'DNS Terminology',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9499.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9499.html#section-{n}',
  },
  {
    id: 'rfc-3986',
    kind: 'rfc',
    short: 'RFC 3986',
    title: 'Uniform Resource Identifier (URI): Generic Syntax',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc3986.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc3986.html#section-{n}',
  },
  {
    id: 'rfc-6265',
    kind: 'rfc',
    short: 'RFC 6265',
    title: 'HTTP State Management Mechanism',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc6265.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc6265.html#section-{n}',
  },
  {
    id: 'rfc-6335',
    kind: 'rfc',
    short: 'RFC 6335',
    title: 'Internet Assigned Numbers Authority (IANA) Procedures for the Management of the Service Name and Transport Protocol Port Number Registry',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc6335.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc6335.html#section-{n}',
  },
  // The WHATWG standards are one page each, served at the host's root; the registry refuses a site root, so each is
  // named by its index.html, which serves the same page. A section is cited by its fragment.
  {
    id: 'whatwg-html',
    kind: 'standards-body',
    short: 'HTML Standard',
    title: 'HTML Standard',
    publisher: 'WHATWG',
    url: 'https://html.spec.whatwg.org/index.html',
  },
  {
    id: 'whatwg-url',
    kind: 'standards-body',
    short: 'URL Standard',
    title: 'URL Standard',
    publisher: 'WHATWG',
    url: 'https://url.spec.whatwg.org/index.html',
  },
  {
    id: 'whatwg-fetch',
    kind: 'standards-body',
    short: 'Fetch Standard',
    title: 'Fetch Standard',
    publisher: 'WHATWG',
    url: 'https://fetch.spec.whatwg.org/index.html',
  },
  {
    id: 'iana-media-types',
    kind: 'iana',
    short: 'IANA Media Types',
    title: 'Media Types',
    publisher: 'IANA',
    url: 'https://www.iana.org/assignments/media-types/media-types.xhtml',
  },
  {
    id: 'microsoft-app-gateway',
    kind: 'vendor',
    short: 'Microsoft Application Gateway',
    title: 'What is Azure Application Gateway?',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/azure/application-gateway/overview',
  },
  // Batch 1's documents, registered before its three authors start (plan.md, unit R1). What is HTTPS's first.
  {
    id: 'rfc-9846',
    kind: 'rfc',
    short: 'RFC 9846',
    title: 'The Transport Layer Security (TLS) Protocol Version 1.3',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9846.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9846.html#section-{n}',
  },
  {
    id: 'rfc-6797',
    kind: 'rfc',
    short: 'RFC 6797',
    title: 'HTTP Strict Transport Security (HSTS)',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc6797.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc6797.html#section-{n}',
  },
  {
    id: 'rfc-9849',
    kind: 'rfc',
    short: 'RFC 9849',
    title: 'TLS Encrypted Client Hello',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9849.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9849.html#section-{n}',
  },
  {
    id: 'rfc-6066',
    kind: 'rfc',
    short: 'RFC 6066',
    title: 'Transport Layer Security (TLS) Extensions: Extension Definitions',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc6066.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc6066.html#section-{n}',
  },
  {
    id: 'rfc-5280',
    kind: 'rfc',
    short: 'RFC 5280',
    title: 'Internet X.509 Public Key Infrastructure Certificate and Certificate Revocation List (CRL) Profile',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc5280.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc5280.html#section-{n}',
  },
  {
    id: 'rfc-9525',
    kind: 'rfc',
    short: 'RFC 9525',
    title: 'Service Identity in TLS',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9525.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9525.html#section-{n}',
  },
  {
    id: 'rfc-8484',
    kind: 'rfc',
    short: 'RFC 8484',
    title: 'DNS Queries over HTTPS (DoH)',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc8484.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc8484.html#section-{n}',
  },
  {
    id: 'rfc-7858',
    kind: 'rfc',
    short: 'RFC 7858',
    title: 'Specification for DNS over Transport Layer Security (TLS)',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc7858.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc7858.html#section-{n}',
  },
  {
    id: 'rfc-9076',
    kind: 'rfc',
    short: 'RFC 9076',
    title: 'DNS Privacy Considerations',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9076.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9076.html#section-{n}',
  },
  {
    id: 'rfc-9001',
    kind: 'rfc',
    short: 'RFC 9001',
    title: 'Using TLS to Secure QUIC',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9001.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9001.html#section-{n}',
  },
  {
    id: 'rfc-10024',
    kind: 'rfc',
    short: 'RFC 10024',
    title: 'Post-Quantum Traditional (PQ/T) Hybrid Key Agreement Mechanisms for TLS 1.3',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc10024.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc10024.html#section-{n}',
  },
  {
    id: 'rfc-7748',
    kind: 'rfc',
    short: 'RFC 7748',
    title: 'Elliptic Curves for Security',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc7748.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc7748.html#section-{n}',
  },
  {
    id: 'rfc-8555',
    kind: 'rfc',
    short: 'RFC 8555',
    title: 'Automatic Certificate Management Environment (ACME)',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc8555.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc8555.html#section-{n}',
  },
  {
    id: 'cloudflare-dns-encryption',
    kind: 'vendor',
    short: 'Cloudflare 1.1.1.1 encryption',
    title: 'Encrypt DNS traffic',
    publisher: 'Cloudflare',
    url: 'https://developers.cloudflare.com/1.1.1.1/encryption/',
  },
  {
    id: 'cloudflare-pqc-support',
    kind: 'vendor',
    short: 'Cloudflare PQC support',
    title: 'PQC support',
    publisher: 'Cloudflare',
    url: 'https://developers.cloudflare.com/ssl/post-quantum-cryptography/pqc-support/',
  },
  {
    id: 'cloudflare-mixed-content',
    kind: 'vendor',
    short: 'Cloudflare mixed content',
    title: 'Mixed content errors',
    publisher: 'Cloudflare',
    url: 'https://developers.cloudflare.com/ssl/troubleshooting/mixed-content-errors/',
  },
  {
    id: 'cloudflare-lb-proxy-modes',
    kind: 'vendor',
    short: 'Cloudflare proxy status',
    title: 'Proxy status',
    publisher: 'Cloudflare',
    url: 'https://developers.cloudflare.com/load-balancing/understand-basics/proxy-modes/',
  },
  {
    id: 'cloudflare-cert-validity',
    kind: 'vendor',
    short: 'Cloudflare certificate validity',
    title: 'Validity periods and renewal',
    publisher: 'Cloudflare',
    url: 'https://developers.cloudflare.com/ssl/reference/certificate-validity-periods/',
  },
  {
    id: 'microsoft-edge-https-first',
    kind: 'vendor',
    short: 'Microsoft Edge HTTPS-First Mode',
    title: 'Secure your web browsing with HTTPS-First Mode in Microsoft Edge',
    publisher: 'Microsoft',
    url: 'https://support.microsoft.com/en-us/edge/secure-your-web-browsing-with-https-first-mode-in-microsoft-edge',
  },
  {
    id: 'microsoft-edge-secure',
    kind: 'vendor',
    short: 'Microsoft Edge secure browsing',
    title: 'Securely browse the web in Microsoft Edge',
    publisher: 'Microsoft',
    url: 'https://support.microsoft.com/en-us/edge/securely-browse-the-web-in-microsoft-edge',
  },
  {
    id: 'google-chrome-secure',
    kind: 'vendor',
    short: 'Chrome Help, secure connection',
    title: "Check if a site's connection is secure",
    publisher: 'Google',
    url: 'https://support.google.com/chrome/answer/95617',
  },
  {
    id: 'google-chrome-always-secure',
    kind: 'vendor',
    short: 'Chrome Help, safety and security',
    title: 'Manage Chrome safety and security',
    publisher: 'Google',
    url: 'https://support.google.com/chrome/answer/10468685',
  },
  {
    id: 'letsencrypt-faq',
    kind: 'vendor',
    short: "Let's Encrypt FAQ",
    title: 'FAQ',
    publisher: 'Internet Security Research Group',
    url: 'https://letsencrypt.org/docs/faq/',
  },
  {
    id: 'letsencrypt-how',
    kind: 'vendor',
    short: "Let's Encrypt, how it works",
    title: 'How It Works',
    publisher: 'Internet Security Research Group',
    url: 'https://letsencrypt.org/how-it-works/',
  },
  // What is TCP's.
  {
    id: 'rfc-2018',
    kind: 'rfc',
    short: 'RFC 2018',
    title: 'TCP Selective Acknowledgment Options',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc2018.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc2018.html#section-{n}',
  },
  {
    id: 'rfc-8985',
    kind: 'rfc',
    short: 'RFC 8985',
    title: 'The RACK-TLP Loss Detection Algorithm for TCP',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc8985.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc8985.html#section-{n}',
  },
  {
    id: 'rfc-6298',
    kind: 'rfc',
    short: 'RFC 6298',
    title: "Computing TCP's Retransmission Timer",
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc6298.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc6298.html#section-{n}',
  },
  {
    id: 'rfc-7413',
    kind: 'rfc',
    short: 'RFC 7413',
    title: 'TCP Fast Open',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc7413.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc7413.html#section-{n}',
  },
  {
    id: 'rfc-4987',
    kind: 'rfc',
    short: 'RFC 4987',
    title: 'TCP SYN Flooding Attacks and Common Mitigations',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc4987.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc4987.html#section-{n}',
  },
  {
    id: 'rfc-2914',
    kind: 'rfc',
    short: 'RFC 2914',
    title: 'Congestion Control Principles',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc2914.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc2914.html#section-{n}',
  },
  {
    id: 'rfc-9438',
    kind: 'rfc',
    short: 'RFC 9438',
    title: 'CUBIC for Fast and Long-Distance Networks',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9438.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9438.html#section-{n}',
  },
  {
    id: 'rfc-5321',
    kind: 'rfc',
    short: 'RFC 5321',
    title: 'Simple Mail Transfer Protocol',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc5321.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc5321.html#section-{n}',
  },
  {
    id: 'rfc-959',
    kind: 'rfc',
    short: 'RFC 959',
    title: 'File Transfer Protocol',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc959.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc959.html#section-{n}',
  },
  {
    id: 'microsoft-azure-tcpip-tuning',
    kind: 'vendor',
    short: 'Microsoft Azure TCP/IP tuning',
    title: 'TCP/IP performance tuning for Azure VMs',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-tcpip-performance-tuning',
  },
  // What is DNS's. RFC 8484, 7858, 9076 and 8555 are above, with What is HTTPS's.
  {
    id: 'rfc-7766',
    kind: 'rfc',
    short: 'RFC 7766',
    title: 'DNS Transport over TCP - Implementation Requirements',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc7766.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc7766.html#section-{n}',
  },
  {
    id: 'rfc-9156',
    kind: 'rfc',
    short: 'RFC 9156',
    title: 'DNS Query Name Minimisation to Improve Privacy',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9156.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9156.html#section-{n}',
  },
  {
    id: 'rfc-4033',
    kind: 'rfc',
    short: 'RFC 4033',
    title: 'DNS Security Introduction and Requirements',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc4033.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc4033.html#section-{n}',
  },
  {
    id: 'rfc-3596',
    kind: 'rfc',
    short: 'RFC 3596',
    title: 'DNS Extensions to Support IP Version 6',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc3596.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc3596.html#section-{n}',
  },
  {
    id: 'rfc-8305',
    kind: 'rfc',
    short: 'RFC 8305',
    title: 'Happy Eyeballs Version 2: Better Connectivity Using Concurrency',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc8305.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc8305.html#section-{n}',
  },
  {
    id: 'rfc-8767',
    kind: 'rfc',
    short: 'RFC 8767',
    title: 'Serving Stale Data to Improve DNS Resiliency',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc8767.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc8767.html#section-{n}',
  },
  {
    id: 'rfc-8806',
    kind: 'rfc',
    short: 'RFC 8806',
    title: 'Running a Root Server Local to a Resolver',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc8806.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc8806.html#section-{n}',
  },
  {
    id: 'rfc-7720',
    kind: 'rfc',
    short: 'RFC 7720',
    title: 'DNS Root Name Service Protocol and Deployment Requirements',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc7720.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc7720.html#section-{n}',
  },
  {
    id: 'rfc-5625',
    kind: 'rfc',
    short: 'RFC 5625',
    title: 'DNS Proxy Implementation Guidelines',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc5625.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc5625.html#section-{n}',
  },
  {
    id: 'rfc-2132',
    kind: 'rfc',
    short: 'RFC 2132',
    title: 'DHCP Options and BOOTP Vendor Extensions',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc2132.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc2132.html#section-{n}',
  },
  {
    id: 'rfc-5452',
    kind: 'rfc',
    short: 'RFC 5452',
    title: 'Measures for Making DNS More Resilient against Forged Answers',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc5452.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc5452.html#section-{n}',
  },
  {
    id: 'rfc-3833',
    kind: 'rfc',
    short: 'RFC 3833',
    title: 'Threat Analysis of the Domain Name System (DNS)',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc3833.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc3833.html#section-{n}',
  },
  {
    id: 'iana-root-servers',
    kind: 'iana',
    short: 'IANA Root Servers',
    title: 'Root Servers',
    publisher: 'IANA',
    url: 'https://www.iana.org/domains/root/servers',
  },
  {
    id: 'iana-root-zone',
    kind: 'iana',
    short: 'IANA Root Zone',
    title: 'Root Zone Management',
    publisher: 'IANA',
    url: 'https://www.iana.org/domains/root',
  },
  {
    id: 'iana-root-db-app',
    kind: 'iana',
    short: 'IANA .app',
    title: '.app Top-Level Domain',
    publisher: 'IANA',
    url: 'https://www.iana.org/domains/root/db/app.html',
  },
  {
    id: 'iana-root-zone-file',
    kind: 'iana',
    short: 'IANA Root Zone File',
    title: 'The DNS root zone',
    publisher: 'IANA',
    url: 'https://www.internic.net/domain/root.zone',
  },
  {
    id: 'icann-rssac-faq',
    kind: 'internet-registry',
    short: 'ICANN RSSAC FAQ',
    title: 'RSSAC FAQ',
    publisher: 'ICANN',
    url: 'https://www.icann.org/en/rssac/faq',
  },
  {
    id: 'microsoft-ipconfig',
    kind: 'vendor',
    short: 'Microsoft ipconfig',
    title: 'ipconfig',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig',
  },
  {
    id: 'microsoft-365-add-domain',
    kind: 'vendor',
    short: 'Microsoft 365 add a domain',
    title: 'Add a Custom Domain to Microsoft 365',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/setup/add-domain',
  },
  {
    id: 'microsoft-traffic-manager',
    kind: 'vendor',
    short: 'Microsoft Traffic Manager',
    title: 'How Azure Traffic Manager Works',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/azure/traffic-manager/traffic-manager-how-it-works',
  },
  // What is HTTPS's failed items needed these two (what a watcher can see).
  {
    id: 'rfc-8404',
    kind: 'rfc',
    short: 'RFC 8404',
    title: 'Effects of Pervasive Encryption on Operators',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc8404.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc8404.html#section-{n}',
  },
  {
    id: 'rfc-9065',
    kind: 'rfc',
    short: 'RFC 9065',
    title: 'Considerations around Transport Header Confidentiality, Network Operations, and the Evolution of Internet Transport Protocols',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9065.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9065.html#section-{n}',
  },
  // Batch 2's documents, registered before its three authors start (plan.md, unit R2). What is IP's first.
  // RFC 826, 894 and 792 have no section ids, so they carry no anchor.
  {
    id: 'rfc-8200',
    kind: 'rfc',
    short: 'RFC 8200',
    title: 'Internet Protocol, Version 6 (IPv6) Specification',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc8200.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc8200.html#section-{n}',
  },
  {
    id: 'rfc-826',
    kind: 'rfc',
    short: 'RFC 826',
    title: 'An Ethernet Address Resolution Protocol: Or Converting Network Protocol Addresses to 48.bit Ethernet Address for Transmission on Ethernet Hardware',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc826.html',
  },
  {
    id: 'rfc-894',
    kind: 'rfc',
    short: 'RFC 894',
    title: 'A Standard for the Transmission of IP Datagrams over Ethernet Networks',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc894.html',
  },
  {
    id: 'rfc-1918',
    kind: 'rfc',
    short: 'RFC 1918',
    title: 'Address Allocation for Private Internets',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc1918.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc1918.html#section-{n}',
  },
  {
    id: 'rfc-3022',
    kind: 'rfc',
    short: 'RFC 3022',
    title: 'Traditional IP Network Address Translator (Traditional NAT)',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc3022.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc3022.html#section-{n}',
  },
  {
    id: 'rfc-1812',
    kind: 'rfc',
    short: 'RFC 1812',
    title: 'Requirements for IP Version 4 Routers',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc1812.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc1812.html#section-{n}',
  },
  {
    id: 'rfc-4632',
    kind: 'rfc',
    short: 'RFC 4632',
    title: 'Classless Inter-domain Routing (CIDR): The Internet Address Assignment and Aggregation Plan',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc4632.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc4632.html#section-{n}',
  },
  {
    id: 'rfc-4271',
    kind: 'rfc',
    short: 'RFC 4271',
    title: 'A Border Gateway Protocol 4 (BGP-4)',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc4271.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc4271.html#section-{n}',
  },
  {
    id: 'rfc-4861',
    kind: 'rfc',
    short: 'RFC 4861',
    title: 'Neighbor Discovery for IP version 6 (IPv6)',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc4861.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc4861.html#section-{n}',
  },
  {
    id: 'rfc-4864',
    kind: 'rfc',
    short: 'RFC 4864',
    title: 'Local Network Protection for IPv6',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc4864.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc4864.html#section-{n}',
  },
  {
    id: 'rfc-6250',
    kind: 'rfc',
    short: 'RFC 6250',
    title: 'Evolution of the IP Model',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc6250.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc6250.html#section-{n}',
  },
  {
    id: 'rfc-3704',
    kind: 'rfc',
    short: 'RFC 3704',
    title: 'Ingress Filtering for Multihomed Networks',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc3704.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc3704.html#section-{n}',
  },
  {
    id: 'rfc-5227',
    kind: 'rfc',
    short: 'RFC 5227',
    title: 'IPv4 Address Conflict Detection',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc5227.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc5227.html#section-{n}',
  },
  {
    id: 'rfc-9724',
    kind: 'rfc',
    short: 'RFC 9724',
    title: 'State of Affairs for Randomized and Changing Media Access Control (MAC) Addresses',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9724.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9724.html#section-{n}',
  },
  {
    id: 'rfc-7066',
    kind: 'rfc',
    short: 'RFC 7066',
    title: 'IPv6 for Third Generation Partnership Project (3GPP) Cellular Hosts',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc7066.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc7066.html#section-{n}',
  },
  {
    id: 'rfc-792',
    kind: 'rfc',
    short: 'RFC 792',
    title: 'Internet Control Message Protocol',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc792.html',
  },
  {
    id: 'iana-ip-parameters',
    kind: 'iana',
    short: 'IANA IP Parameters',
    title: 'Internet Protocol Version 4 (IPv4) Parameters',
    publisher: 'IANA',
    url: 'https://www.iana.org/assignments/ip-parameters/ip-parameters.xhtml',
  },
  {
    id: 'iana-protocol-numbers',
    kind: 'iana',
    short: 'IANA Protocol Numbers',
    title: 'Protocol Numbers',
    publisher: 'IANA',
    url: 'https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml',
  },
  {
    id: 'microsoft-route',
    kind: 'vendor',
    short: 'Microsoft route',
    title: 'route',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/route_ws2008',
  },
  {
    id: 'microsoft-arp',
    kind: 'vendor',
    short: 'Microsoft arp',
    title: 'arp',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/arp',
  },
  {
    id: 'cisco-route-command',
    kind: 'vendor',
    short: 'Cisco route command',
    title: 'Use the Route Command',
    publisher: 'Cisco',
    url: 'https://www.cisco.com/c/en/us/support/docs/voice-unified-communications/unified-intelligent-contact-management-enterprise/20524-route-command.html',
  },
  {
    id: 'cisco-dai',
    kind: 'vendor',
    short: 'Cisco DAI',
    title: 'Security Configuration Guide, Cisco IOS XE 17.18.x (Catalyst 9300 Switches) - Configuring Dynamic ARP Inspection',
    publisher: 'Cisco',
    url: 'https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-18/configuration_guide/sec/b_1718_sec_9300_cg/configuring_dynamic_arp_inspection.html',
  },
  // What is DHCP's. RFC 5227 is above, with What is IP's.
  {
    id: 'rfc-3927',
    kind: 'rfc',
    short: 'RFC 3927',
    title: 'Dynamic Configuration of IPv4 Link-Local Addresses',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc3927.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc3927.html#section-{n}',
  },
  {
    id: 'rfc-9915',
    kind: 'rfc',
    short: 'RFC 9915',
    title: 'Dynamic Host Configuration Protocol for IPv6 (DHCPv6)',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9915.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9915.html#section-{n}',
  },
  {
    id: 'rfc-4862',
    kind: 'rfc',
    short: 'RFC 4862',
    title: 'IPv6 Stateless Address Autoconfiguration',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc4862.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc4862.html#section-{n}',
  },
  {
    id: 'rfc-7610',
    kind: 'rfc',
    short: 'RFC 7610',
    title: 'DHCPv6-Shield: Protecting against Rogue DHCPv6 Servers',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc7610.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc7610.html#section-{n}',
  },
  {
    id: 'rfc-7513',
    kind: 'rfc',
    short: 'RFC 7513',
    title: 'Source Address Validation Improvement (SAVI) Solution for DHCP',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc7513.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc7513.html#section-{n}',
  },
  {
    id: 'iana-dhcp-parameters',
    kind: 'iana',
    short: 'IANA DHCP Parameters',
    title: 'Dynamic Host Configuration Protocol (DHCP) and Bootstrap Protocol (BOOTP) Parameters',
    publisher: 'IANA',
    url: 'https://www.iana.org/assignments/bootp-dhcp-parameters/bootp-dhcp-parameters.xhtml',
  },
  {
    id: 'microsoft-dhcp-troubleshoot',
    kind: 'vendor',
    short: 'Microsoft DHCP troubleshooting',
    title: 'Troubleshooting guide for Dynamic Host Configuration Protocol (DHCP)',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/windows-server/troubleshoot/troubleshoot-dhcp-issue',
  },
  {
    id: 'microsoft-dhcp-basics',
    kind: 'vendor',
    short: 'Microsoft DHCP basics',
    title: 'DHCP (Dynamic Host Configuration Protocol) Basics',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/windows-server/troubleshoot/dynamic-host-configuration-protocol-basics',
  },
  {
    id: 'microsoft-dhcp-server',
    kind: 'vendor',
    short: 'Microsoft DHCP Server',
    title: 'What is Dynamic Host Configuration Protocol (DHCP) Server in Windows Server?',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/dhcp-top',
  },
  {
    id: 'microsoft-dhcp-quickstart',
    kind: 'vendor',
    short: 'Microsoft DHCP quickstart',
    title: 'Install and configure DHCP Server on Windows Server',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/quickstart-install-configure-dhcp-server',
  },
  {
    id: 'microsoft-dhcp-training',
    kind: 'vendor',
    short: 'Microsoft Learn DHCP',
    title: 'Use DHCP to simplify IP configuration',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/training/modules/deploy-manage-dynamic-host-configuration-protocol/2-use-dynamic-host-configuration-protocol-simplify-ip-configuration',
  },
  {
    id: 'microsoft-network-settings',
    kind: 'vendor',
    short: 'Microsoft Windows network settings',
    title: 'Essential Network Settings and Tasks in Windows',
    publisher: 'Microsoft',
    url: 'https://support.microsoft.com/en-us/windows/experience/connectivity-networking/essential-network-settings-and-tasks-in-windows',
  },
  {
    id: 'google-nest-lan-ip',
    kind: 'vendor',
    short: 'Google Nest LAN IP',
    title: 'Set a custom LAN IP',
    publisher: 'Google',
    url: 'https://support.google.com/googlehome/answer/7571856',
  },
  {
    id: 'google-nest-dhcp-reservation',
    kind: 'vendor',
    short: 'Google Nest DHCP reservation',
    title: 'Set DHCP IP reservation or a Static IP address for a device',
    publisher: 'Google',
    url: 'https://support.google.com/googlehome/answer/6274660',
  },
  {
    id: 'paloalto-dhcp-overview',
    kind: 'vendor',
    short: 'Palo Alto DHCP',
    title: 'DHCP',
    publisher: 'Palo Alto Networks',
    url: 'https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-networking-admin/dhcp/dhcp-overview',
  },
  {
    id: 'paloalto-dhcp-messages',
    kind: 'vendor',
    short: 'Palo Alto DHCP messages',
    title: 'DHCP Messages',
    publisher: 'Palo Alto Networks',
    url: 'https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-networking-admin/dhcp/dhcp-messages',
  },
  {
    id: 'cisco-dhcp-server',
    kind: 'vendor',
    short: 'Cisco IOS XE DHCP Server',
    title: 'IP Addressing Configuration Guide, Cisco IOS XE 17.x: Configuring the Cisco IOS XE DHCP Server',
    publisher: 'Cisco',
    url: 'https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/ip-addressing/b-ip-addressing/m_config-dhcp-server-xe.html',
  },
  {
    id: 'cisco-dhcp-troubleshoot',
    kind: 'vendor',
    short: 'Cisco DHCP troubleshooting',
    title: 'Troubleshoot DHCP in Enterprise Networks',
    publisher: 'Cisco',
    url: 'https://www.cisco.com/c/en/us/support/docs/ip/dynamic-address-allocation-resolution/27470-100.html',
  },
  {
    id: 'canonical-dhcp-concepts',
    kind: 'community',
    short: 'Canonical blog',
    title: 'Basic DHCP concepts',
    publisher: 'Canonical',
    url: 'https://canonical.com/blog/basic-dhcp-concepts',
  },
  // What is ICMP's. RFC 792, 1812 and 4861 and the two IANA registries are above, with What is IP's.
  {
    id: 'rfc-1191',
    kind: 'rfc',
    short: 'RFC 1191',
    title: 'Path MTU Discovery',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc1191.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc1191.html#section-{n}',
  },
  {
    id: 'rfc-2151',
    kind: 'rfc',
    short: 'RFC 2151',
    title: 'A Primer On Internet and TCP/IP Tools and Utilities',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc2151.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc2151.html#section-{n}',
  },
  {
    id: 'rfc-2923',
    kind: 'rfc',
    short: 'RFC 2923',
    title: 'TCP Problems with Path MTU Discovery',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc2923.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc2923.html#section-{n}',
  },
  {
    id: 'rfc-4443',
    kind: 'rfc',
    short: 'RFC 4443',
    title: 'Internet Control Message Protocol (ICMPv6) for the Internet Protocol Version 6 (IPv6) Specification',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc4443.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc4443.html#section-{n}',
  },
  {
    id: 'rfc-4890',
    kind: 'rfc',
    short: 'RFC 4890',
    title: 'Recommendations for Filtering ICMPv6 Messages in Firewalls',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc4890.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc4890.html#section-{n}',
  },
  {
    id: 'rfc-9099',
    kind: 'rfc',
    short: 'RFC 9099',
    title: 'Operational Security Considerations for IPv6 Networks',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9099.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9099.html#section-{n}',
  },
  {
    id: 'iana-icmp-parameters',
    kind: 'iana',
    short: 'IANA ICMP Parameters',
    title: 'Internet Control Message Protocol (ICMP) Parameters',
    publisher: 'IANA',
    url: 'https://www.iana.org/assignments/icmp-parameters/icmp-parameters.xhtml',
  },
  {
    id: 'microsoft-ping',
    kind: 'vendor',
    short: 'Microsoft ping',
    title: 'ping',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ping',
  },
  {
    id: 'microsoft-tracert',
    kind: 'vendor',
    short: 'Microsoft tracert',
    title: 'tracert',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/tracert',
  },
  {
    id: 'cisco-ping-traceroute',
    kind: 'vendor',
    short: 'Cisco ping and traceroute',
    title: 'Understand Ping and Traceroute Commands',
    publisher: 'Cisco',
    url: 'https://www.cisco.com/c/en/us/support/docs/ios-nx-os-software/ios-software-releases-121-mainline/12778-ping-traceroute.html',
  },
  {
    id: 'cisco-traceroute-os',
    kind: 'vendor',
    short: 'Cisco traceroute on operating systems',
    title: 'Use the Traceroute Command on Operating Systems',
    publisher: 'Cisco',
    url: 'https://www.cisco.com/c/en/us/support/docs/ip/ip-routed-protocols/22826-traceroute.html',
  },
  {
    id: 'cloudflare-icmp',
    kind: 'vendor',
    short: 'Cloudflare ICMP',
    title: 'What is the Internet Control Message Protocol (ICMP)?',
    publisher: 'Cloudflare',
    url: 'https://www.cloudflare.com/learning/ddos/glossary/internet-control-message-protocol-icmp/',
  },
  {
    id: 'paloalto-icmp',
    kind: 'vendor',
    short: 'Palo Alto ICMP',
    title: 'ICMP',
    publisher: 'Palo Alto Networks',
    url: 'https://docs.paloaltonetworks.com/ngfw/networking/session-settings-and-timeouts/icmp',
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
