// B43: each lesson page's data file is what the page's island is given. Reads dist/, so it runs after `npm run build`
// and is skipped (loudly named) when there is no build yet.
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { join } from 'node:path';

declare const process: { cwd(): string };
import { describe, expect, test } from 'vitest';

const dist = join(process.cwd(), 'dist');
const built = existsSync(join(dist, 'networking', 'vpn.json'));
const suite = built ? describe : describe.skip;

function decode(v: unknown): unknown {
  if (!Array.isArray(v)) {
    if (v !== null && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, decode(x)]));
    return v;
  }
  const [kind, value] = v as [number, unknown];
  if (kind === 1) return (value as unknown[]).map(decode);
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, x]) => [k, decode(x)]));
  }
  return value;
}

const read = (p: string) => JSON.parse(readFileSync(join(dist, p), 'utf8')) as Record<string, any>;
const KEYS = ['lesson', 'entry', 'next', 'nextFigure', 'definitions'] as const;

function pairs(): string[] {
  const out: string[] = [];
  for (const track of readdirSync(dist, { withFileTypes: true })) {
    if (!track.isDirectory()) continue;
    for (const f of readdirSync(join(dist, track.name))) if (f.endsWith('.json')) out.push(`${track.name}/${f.slice(0, -5)}`);
  }
  return out.sort();
}

suite('lesson data files', () => {
  test('34 files; each equals its page island props, five keys plus one stamp', () => {
    const all = pairs();
    expect(all).toHaveLength(34);
    const stamps = new Set<string>();
    for (const p of all) {
      const html = readFileSync(join(dist, p, 'index.html'), 'utf8');
      const m = html.match(/<astro-island[^>]*\sprops="([^"]*)"/);
      expect(m, p).not.toBeNull();
      const props = decode(JSON.parse(m![1]!.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&'))) as Record<string, any>;
      const file = read(`${p}.json`);
      expect(Object.keys(file).sort(), p).toStrictEqual([...KEYS, 'stamp'].sort());
      for (const k of KEYS) expect(file[k], `${p} ${k}`).toStrictEqual(props[k]);
      expect(typeof file.stamp).toBe('string');
      stamps.add(file.stamp);
    }
    expect(stamps.size).toBe(1);
  });

  test('plain JSON, not Astro form; figureData and page extras are left out', () => {
    const udp = read('networking/tcp-udp.json');
    expect(udp.lesson.title).toBe('TCP/UDP');
    for (const k of ['entries', 'figureData', 'trackId', 'trackTitle', 'total']) expect(k in udp).toBe(false);
  });

  test('a lesson in two tracks is one file a track, with the track\'s own entry and next', () => {
    const net = read('networking/what-is-tls.json');
    const hiw = read('how-the-internet-works/what-is-tls.json');
    expect(net.next.slug).toBe('firewalls');
    expect(typeof net.nextFigure).toBe('string');
    expect(net.entry.number).toBe(16);
    expect(net.entry.url).toBe('/networking/what-is-tls');
    expect(hiw.entry.number).toBe(14);
    expect(hiw.next).toBeNull();
    expect(hiw.nextFigure).toBeNull();
    expect(net.entry.canonical).toBe('/how-the-internet-works/what-is-tls');
    expect(hiw.entry.canonical).toBe('/how-the-internet-works/what-is-tls');
    const dnsN = read('networking/what-is-dns.json');
    const dnsH = read('how-the-internet-works/what-is-dns.json');
    expect([dnsN.entry.number, dnsN.next.slug]).toStrictEqual([13, 'what-is-http']);
    expect([dnsH.entry.number, dnsH.next.slug]).toStrictEqual([6, 'what-is-dhcp']);
  });

  test('nulls stay present; empty definitions stay an object; real nulls inside the lesson survive', () => {
    const vpn = read('networking/vpn.json');
    expect('next' in vpn && vpn.next === null && 'nextFigure' in vpn && vpn.nextFigure === null).toBe(true);
    const imap = read('how-the-internet-works/what-is-imap.json');
    expect(imap.definitions).toStrictEqual({});
    for (const s of ['subnetting', 'ip-address']) expect(JSON.stringify(read(`networking/${s}.json`).lesson)).toContain('"prefix":null');
  });

  test('no other json is built, and no redirect or page json', () => {
    const found: string[] = [];
    const walk = (d: string) => {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        if (e.isDirectory()) walk(join(d, e.name));
        else if (e.name.endsWith('.json')) found.push(join(d, e.name));
      }
    };
    walk(dist);
    expect(found).toHaveLength(34);
    expect(existsSync(join(dist, 'networking', 'how-the-internet-works.json'))).toBe(false);
    for (const p of ['tracks', 'glossary', 'about', 'index']) expect(existsSync(join(dist, `${p}.json`))).toBe(false);
  });
});
