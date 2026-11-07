import { z } from 'zod';
import { httpsUrl, slugSchema, text } from './primitives';
import type { Source } from './schema';

/**
 * The primary-source registry and exact-section citations (direction doc §3.1, §3.2). Every factual statement
 * cites a source in this registry at the section it comes from. Only primary hosts are allowed: RFCs, IEEE,
 * IANA, NIST, official vendor documentation, and official certification objective documents (for exam tags and
 * objective mapping only).
 */

export const SOURCE_KINDS = ['rfc', 'ieee', 'iana', 'nist', 'vendor', 'cert-objectives'] as const;
export type SourceKind = (typeof SOURCE_KINDS)[number];

/** Exact hosts each kind may live on. No wildcards. */
export const SOURCE_HOSTS: Record<SourceKind, readonly string[]> = {
  rfc: ['www.rfc-editor.org', 'datatracker.ietf.org'],
  ieee: ['standards.ieee.org', 'ieeexplore.ieee.org'],
  iana: ['www.iana.org'],
  nist: ['csrc.nist.gov', 'nvlpubs.nist.gov', 'www.nist.gov'],
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
  return u.pathname.startsWith(base);
}

/** True when `url` is the document itself, with no fragment and no sub-path. */
function isWholeDocument(url: string, doc: string): boolean {
  const u = parse(url);
  const d = parse(doc);
  return !!u && !!d && u.pathname === d.pathname && u.search === d.search && !u.hash;
}

/** True when `url` is the document's own page plus a fragment. */
function isFragmentOf(url: string, doc: string): boolean {
  const u = parse(url);
  const d = parse(doc);
  return !!u && !!d && u.pathname === d.pathname && u.search === d.search && u.hash.length > 1;
}

/** Validates every entry and returns the registry keyed by id. Throws one Error listing every issue. */
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
    registry[e.id] = e;
    const allowed = SOURCE_HOSTS[e.kind];
    const host = hostOf(e.url);
    const docIssue = documentProblem(e.url);
    if (docIssue) issues.push(`${name}: ${docIssue}`);
    if (!host) issues.push(`${name}: the host of url cannot be read`);
    else if (!allowed.includes(host)) {
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

/** Real entries arrive with later tasks (direction doc §10 tasks 4-6). */
export const SOURCES: SourceRegistry = defineSources([]);

export const citationSchema = z.strictObject({ source: slugSchema, section: text, url: httpsUrl, label: text });
export type Citation = z.infer<typeof citationSchema>;

const NUMBERED = /^(0|[1-9]\d*)(\.(0|[1-9]\d*))*$/;

/** Builds a citation. A numbered section on a source with an anchor links straight to it; otherwise `opts.url` is required. */
export function cite(source: string, section: string, opts: { url?: string; sources?: SourceRegistry } = {}): Citation {
  const registry = opts.sources ?? SOURCES;
  const entry = Object.hasOwn(registry, source) ? registry[source] : undefined;
  if (!entry) throw new Error(`Unknown source "${source}" (cited at section ${section})`);
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
  if (!entry) return [`Unknown source "${c.source}" (section ${c.section})`];
  const problems: string[] = [];
  if (use === 'content' && entry.kind === 'cert-objectives') {
    problems.push(`Source "${c.source}" (section ${c.section}) is an objectives document, which may be cited only for objective mapping, not for content`);
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
    if (!entry) throw new Error(`Unknown source "${c.source}" (section ${c.section})`);
    list.push({ label: `${entry.short}: ${entry.title}`, url: entry.url });
  }
  return list;
}
