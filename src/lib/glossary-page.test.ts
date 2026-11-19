// The Glossary page rendered with Astro's container and parsed with jsdom, as `no-script.test.ts` renders the lesson page
// (E2: the data-exact parts of D9's checks 3, 11, 12, 13, 15, 16, 18, 19 and 20, as D9a changes them, run here, from the glossary itself).
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { execSync } from 'node:child_process';
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
// @ts-expect-error - no @types/jsdom in this project; jsdom is already here for the component tests
import { JSDOM } from 'jsdom';
import { beforeAll, describe, expect, test } from 'vitest';
import GlossaryEntry from '../components/GlossaryEntry.astro';
import GlossaryKeys from '../components/GlossaryKeys.astro';
import GlossaryStamp from '../components/GlossaryStamp.astro';
import { GLOSSARY, GLOSSARY_GROUPS } from '../content/glossary';
import { partsOf } from '../content/glossary-group';
import { SOURCES } from '../content/sources';
import { tracks } from '../content/tracks';
import { siteGlossary } from './glossary-site';
import { stampLine } from './glossary';
import GlossaryPage from '../pages/glossary.astro';
import { expectCardStackGrant, expectTracksGrant } from './card-stack-guards';

const words = (el: Element | null | undefined): string => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
let html = '';
let doc: Document;
beforeAll(async () => {
  const container = await AstroContainer.create();
  html = await container.renderToString(GlossaryPage);
  doc = new JSDOM(html).window.document;
});

const LEAD = 'Definitions written for this site, each one checked against its sources.';
const NOTE =
  'Under each definition are the sources it was checked against and the tracks whose lessons describe the term. A term with two meanings has a definition for each. New definitions are added once they pass the same check.';

describe('11. the head', () => {
  test('title, description, one h1, the lead and note word for word', () => {
    expect(doc.title).toBe('Glossary · TechConcepts');
    expect(doc.querySelector('meta[name="description"]')!.getAttribute('content')).toBe(LEAD);
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    expect(words(doc.querySelector('h1'))).toBe('Glossary');
    expect(words(doc.querySelector('.gl-lead'))).toBe(LEAD);
    expect(words(doc.querySelector('.gl-note'))).toBe(NOTE);
  });
  test('the stamp links to /about#facts and reads the glossary’s own count and date, not the lesson stamp’s words', () => {
    const stamp = doc.querySelector('.gl-stamp a')!;
    expect(stamp.getAttribute('href')).toBe('/about#facts');
    expect(stamp.hasAttribute('data-checked')).toBe(true);
    const { stamp: s } = siteGlossary();
    expect(words(stamp)).toBe(stampLine(s!));
    expect(words(stamp)).toMatch(/^\d+ terms? checked/);
    expect(words(stamp)).not.toMatch(/^Checked /);
  });
});

describe('3. ids', () => {
  test('every id in the rendered page, the shell’s and the letters’ included, is used once', () => {
    const ids = [...doc.querySelectorAll('[id]')].map((e) => e.id);
    expect(ids.length).toBeGreaterThan(10);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });
});

describe('12. entries', () => {
  test('each entry’s element holds its term and one dd for each definition, each .gl-def exactly the statements joined by a space', () => {
    for (const e of GLOSSARY) {
      const el = doc.getElementById(e.id)!;
      expect(el, e.id).not.toBeNull();
      expect(words(el.querySelector('dt .gl-name')), e.id).toBe(e.term);
      const parts = partsOf(e);
      const dds = [...el.querySelectorAll('dd')];
      expect(dds, e.id).toHaveLength(parts.length);
      parts.forEach((p, i) => {
        expect(dds[i]!.querySelector('.gl-def')!.textContent, e.id).toBe(p.definition.map((s) => s.text).join(' '));
        expect(dds[i]!.querySelector('.gl-sense')?.textContent, e.id).toBe(p.sense?.label);
      });
    }
  });
  test('TTL: Also called, then each sense and its definition in DOM order; the pointer has one dd and no .gl-def', () => {
    const ttl = doc.getElementById('ttl')!;
    const order = [...ttl.querySelectorAll('.gl-also, .gl-sense, .gl-def')].map((e) => e.className);
    expect(order).toEqual(['gl-also', 'gl-sense', 'gl-def', 'gl-sense', 'gl-def']);
    expect(words(ttl.querySelector('.gl-also'))).toBe('Also called Time to Live');
    expect([...ttl.querySelectorAll('.gl-sense')].map((e) => e.textContent)).toEqual(['In IP packets', 'In DNS']);
    const dds = [...ttl.querySelectorAll('dd')];
    expect(dds).toHaveLength(2);
    for (const dd of dds) expect(dd.querySelectorAll('.gl-row--tracks')).toHaveLength(1);
    expect(ttl.querySelectorAll('.gl-row--tracks')).toHaveLength(2);
    expect(dds.map((dd) => words(dd.querySelector('.gl-row--tracks')))).toEqual(['Described in How the Internet Works', 'Described in How the Internet Works, Networking Concepts']);
    const pointer = doc.getElementById('time-to-live')!;
    expect(pointer.classList.contains('gl-entry--see')).toBe(true);
    expect(pointer.querySelectorAll('dd')).toHaveLength(1);
    expect(pointer.querySelector('.gl-def')).toBeNull();
    expect(words(pointer.querySelector('dd'))).toBe('See TTL');
    expect(pointer.querySelector('dd a')!.getAttribute('href')).toBe('#ttl');
    expect(pointer.textContent).not.toMatch(/Sources|Described in/);
    expect(pointer.querySelector('.gl-row--tracks')).toBeNull();
  });
  test('a definition is plain text: no element inside a .gl-def', () => {
    for (const def of doc.querySelectorAll('.gl-def')) expect(def.children).toHaveLength(0);
  });
});

describe('13. source links', () => {
  test('short name only, new tab, the first citation’s address, the places in title and aria-label', () => {
    let count = 0;
    for (const e of GLOSSARY) {
      const dds = [...doc.getElementById(e.id)!.querySelectorAll('dd')];
      partsOf(e).forEach((part, i) => {
        const links = [...dds[i]!.querySelectorAll('a.gl-src')];
        const cited = [...new Set(part.definition.flatMap((s) => s.cite.map((c) => c.source)))];
        expect(links, e.id).toHaveLength(cited.length);
        cited.forEach((id, j) => {
          const first = part.definition.flatMap((s) => s.cite).find((c) => c.source === id)!;
          const places = [...new Set(part.definition.flatMap((s) => s.cite).filter((c) => c.source === id).map((c) => c.label))].join('; ');
          const a = links[j]!;
          expect(a.textContent).toBe(SOURCES[id]!.short);
          expect(a.getAttribute('target')).toBe('_blank');
          expect(a.getAttribute('rel')).toBe('noopener');
          expect(a.getAttribute('href')).toBe(first.url);
          expect(a.getAttribute('title')).toBe(places);
          expect(a.getAttribute('aria-label')).toBe(`${SOURCES[id]!.short}: ${places} (opens in a new tab)`);
          count++;
        });
        // The comma is text outside the link.
        const row = dds[i]!.querySelector('.gl-row')!;
        expect(row.textContent).toBe(`Sources ${links.map((l) => l.textContent).join(', ')}`);
      });
    }
    expect(count).toBeGreaterThan(30);
  });
  test('Echo request’s RFC 792 link names both pages, and opens page 14, not the bare document', () => {
    const a = doc.querySelector('#echo-request a.gl-src')!;
    expect(a.getAttribute('aria-label')).toBe('RFC 792: RFC 792, Echo or Echo Reply Message, page 14; RFC 792, Echo or Echo Reply Message, page 15 (opens in a new tab)');
    expect(a.getAttribute('href')).toBe('https://www.rfc-editor.org/rfc/rfc792.html#page-14');
    for (const l of doc.querySelectorAll('a.gl-src')) expect(Object.values(SOURCES).map((s) => s.url)).not.toContain(l.getAttribute('href'));
  });
});

describe('14 and 16. no link to a lesson or a track; the "Described in" row (E4, E5, E7)', () => {
  const rows = (): Element[] => [...doc.querySelectorAll('.gl-row--tracks')];
  const expectedRows = siteGlossary().letters.flatMap((l) => l.items.flatMap((i) => i.definitions)).filter((d) => d.tracks.length > 0);
  test('no `a` in main reaches /tracks or any track, whatever the href is written as (resolved, not read)', () => {
    const origin = 'https://site.test';
    const ids = tracks.map((t) => t.id);
    expect(ids.length).toBeGreaterThan(1);
    const links = [...doc.querySelectorAll('main a')];
    expect(links.length).toBeGreaterThan(40);
    for (const a of links) {
      const url = new URL(a.getAttribute('href')!, `${origin}/glossary`);
      if (url.origin !== origin) continue;
      const path = url.pathname.replace(/\/+$/, '');
      expect(path === '/tracks' || path.startsWith('/tracks/') || ids.some((id) => path === `/${id}` || path.startsWith(`/${id}/`)), a.outerHTML).toBe(false);
    }
  });
  test('no link of a lesson in any form: no .gl-lesson, no ?step= href', () => {
    expect(doc.querySelectorAll('a.gl-lesson')).toHaveLength(0);
    for (const a of doc.querySelectorAll('main a')) expect(a.getAttribute('href')).not.toMatch(/\?step=/);
  });
  test('every definition with tracks has one row of plain text: one label, one .gl-tracks, no link, title, href or tabindex', () => {
    // Every definition with tracks has its row; the pilot group's rows are 11 (B10: a count of the pilot, not of the glossary).
    expect(rows()).toHaveLength(expectedRows.length);
    const pilot = new Set(GLOSSARY_GROUPS.find((g) => g.id === 'pilot')!.entries.map((e) => e.id));
    expect(rows().filter((r) => pilot.has(r.closest('.gl-entry')!.id))).toHaveLength(11);
    for (const row of rows()) {
      expect(row.querySelector('a, [href], [title], [tabindex]'), row.outerHTML).toBeNull();
      expect(row.querySelectorAll('span.gl-label')).toHaveLength(1);
      expect(row.querySelectorAll('span.gl-tracks')).toHaveLength(1);
      expect(row.classList.contains('gl-row')).toBe(true);
      expect(row.querySelector('.gl-label')!.textContent).toBe('Described in');
    }
  });
  test('the row’s raw text has one space between the label and the names; the names are the tracks joined by ", "', () => {
    expect(doc.querySelector('#ping .gl-row--tracks')!.textContent).toBe('Described in How the Internet Works');
    expect(doc.querySelector('#ip-address .gl-row--tracks')!.textContent).toBe('Described in How the Internet Works, Networking Concepts');
    expect(doc.querySelector('#ip-address .gl-tracks')!.textContent).toBe('How the Internet Works, Networking Concepts');
  });
});

describe('18. keys', () => {
  test('the keys are the letters that have a term; with 13 or more letters the rest of A to Z is dashed, with fewer none is', () => {
    const letters = siteGlossary().letters;
    const keys = [...doc.querySelectorAll('a.gl-key')];
    expect(keys.map((k) => k.getAttribute('href'))).toEqual(letters.map((l) => `#${l.id}`));
    expect(keys.map((k) => k.textContent!.trim())).toEqual(letters.map((l) => l.letter));
    // 0–9 counts as one of the 13 but is not one of A to Z.
    const alphabet = letters.filter((l) => l.letter !== '0–9').length;
    expect(doc.querySelectorAll('.gl-key--none')).toHaveLength(letters.length >= 13 ? 26 - alphabet : 0);
    for (const k of keys) expect(doc.querySelector(k.getAttribute('href')!)).not.toBeNull();
  });
  test('with 13 letters the markup is A to Z, a span with "{letter}, no terms" where empty', async () => {
    const keys = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((letter) => ({ letter, id: `letter-${letter.toLowerCase()}`, live: 'ABCDEFGHIJKLM'.includes(letter) }));
    const container = await AstroContainer.create();
    const d: Document = new JSDOM(await container.renderToString(GlossaryKeys, { props: { keys } })).window.document;
    expect(d.querySelectorAll('li')).toHaveLength(26);
    expect(d.querySelectorAll('a.gl-key')).toHaveLength(13);
    const empty = d.querySelectorAll('span.gl-key--none');
    expect(empty).toHaveLength(13);
    expect(empty[0]!.hasAttribute('tabindex')).toBe(false);
    expect(words(empty[0]!.querySelector('.sr-only'))).toBe('N, no terms');
    expect(d.querySelector('nav')!.getAttribute('aria-label')).toBe('Jump to a letter');
  });
  test('each letter has an h2, "All letters", and a dl', () => {
    for (const s of doc.querySelectorAll('section.gl-letter')) {
      expect(s.querySelector('h2')!.textContent).toBe(siteGlossary().letters.find((l) => l.id === s.id)!.letter);
      expect(s.querySelector('a.gl-up')!.getAttribute('href')).toBe('#letters');
      expect(s.querySelector('dl.gl-list')).not.toBeNull();
    }
  });
});

describe('the parts, given fixtures', () => {
  const render = async (component: Parameters<AstroContainer['renderToString']>[0], props: Record<string, unknown>): Promise<Document> =>
    new JSDOM(await (await AstroContainer.create()).renderToString(component, { props })).window.document;
  const item = { kind: 'entry' as const, id: 'a', name: 'A', also: [], entryId: 'a', entryTerm: 'A', definitions: [{ label: undefined, text: 'a < b & c', sources: [{ short: 'S', url: 'https://x.test/#p', places: 'p' }], tracks: [] as string[] }] };
  test('a definition with no tracks has no "Described in" row (E7); its text shows as text', async () => {
    const d = await render(GlossaryEntry, { item });
    expect(d.querySelector('.gl-def')!.textContent).toBe('a < b & c');
    expect(d.querySelector('.gl-def')!.children).toHaveLength(0);
    expect(d.body.textContent).not.toContain('Described in');
    expect(d.querySelector('.gl-row--tracks')).toBeNull();
    expect(d.querySelector('.gl-sense')).toBeNull();
    expect(d.querySelector('.gl-also')).toBeNull();
    const tied = await render(GlossaryEntry, { item: { ...item, definitions: [{ ...item.definitions[0]!, tracks: ['One', 'Two'] }] } });
    expect(words(tied.querySelectorAll('.gl-row')[1])).toBe('Described in One, Two');
    expect(tied.querySelector('.gl-row--tracks a')).toBeNull();
  });
  test('no date, no stamp; the stamp with one term reads "1 term checked on …"', async () => {
    expect((await render(GlossaryStamp, { stamp: null })).querySelector('.gl-stamp')).toBeNull();
    expect(words((await render(GlossaryStamp, { stamp: { count: 1, date: '2026-11-13' } })).querySelector('.gl-stamp a'))).toBe('1 term checked on 13 Nov 2026');
  });
});

describe('19 and 20. words, and the page without JavaScript', () => {
  test('"Taught in" is nowhere in main, and no .gl-row speaks of a lesson (check 19)', () => {
    expect(doc.querySelector('main')!.textContent).not.toMatch(/Taught in/);
    for (const row of doc.querySelectorAll('.gl-row')) expect(row.textContent).not.toMatch(/lesson/i);
  });
  test('no time figure anywhere on the page', () => {
    expect(doc.body.textContent).not.toMatch(/\b\d+ ?min\b|\bminutes\b|one sitting|Short guided/i);
  });
  test('the head says nothing but the spec’s words', () => {
    const head = words(doc.querySelector('.gl-head'));
    expect(head).toBe(`Glossary${LEAD}${NOTE}${stampLine(siteGlossary().stamp!)}`);
  });
  test('no island and no script inside main', () => {
    expect(html).not.toContain('astro-island');
    expect(doc.querySelector('main script')).toBeNull();
  });
});

// ---------------------------------------------------------------- the Card stack look (job 22, B26; prototypes/d21-glossary.md, prototypes/d21-cases.md)

const source = readFileSync('src/pages/glossary.astro', 'utf8') as string;
const style = /<style is:global>([\s\S]*)<\/style>/.exec(source)![1]!;
/** The rule that opens at `selector`, its body, taken from the page's own style text (comments out). */
const stripped = style.replace(/\/\*[\s\S]*?\*\//g, '');
const ruleOf = (css: string, selector: string): string => {
  const at = css.indexOf(`${selector} {`);
  expect(at, `${selector} is in the style text`).toBeGreaterThanOrEqual(0);
  return css.slice(css.indexOf('{', at) + 1, css.indexOf('}', at));
};

describe('D21, 0.4: the stylesheet and the page', () => {
  test('the page imports card-stack.css on the line after site.css, once', () => {
    const lines = source.split('\n');
    const site = lines.indexOf("import '../components/site.css';");
    expect(site).toBeGreaterThan(-1);
    expect(lines[site + 1]).toBe("import '../styles/card-stack.css';");
    expect(source.match(/card-stack\.css/g)).toHaveLength(1);
  });
  test('no component of the page and not the layout imports it, so it reaches no other page', () => {
    for (const file of ['src/components/GlossaryEntry.astro', 'src/components/GlossaryKeys.astro', 'src/components/GlossaryStamp.astro', 'src/layouts/BaseLayout.astro']) {
      expect(readFileSync(file, 'utf8') as string, file).not.toContain('card-stack.css');
    }
  });
  test('Home, the track pages, the header, the footer and the tokens are untouched, and Tracks gains one rule (job 24)', () => {
    expectTracksGrant('f30e876');
    const touched = (execSync("git diff --name-only f30e876 -- src/pages/index.astro 'src/pages/[track]' src/styles/tokens.ts src/styles/global.css src/layouts src/components/SiteHeader.astro src/components/SiteFooter.astro src/components/site.css src/components/hub src/components/GlossaryEntry.astro src/components/GlossaryKeys.astro src/components/GlossaryStamp.astro src/lib/glossary.ts src/lib/glossary-site.ts || true", { encoding: 'utf8' }) as string).trim();
    expect(touched).toBe('');
  });
  test('card-stack.css changes only its opening comment (About’s and the Glossary’s, E2), two reworded comments and the header and footer block (job 24)', () => {
    expectCardStackGrant('f30e876');
  });

});

describe('D21, G-11 and G-12: the page’s style text', () => {
  test('the page’s scroll padding: 80px above and 12px below; the 403px of the open menu sits inside a media query at 959px', () => {
    const root = ruleOf(stripped, 'html');
    expect(root).toMatch(/scroll-padding-top:\s*80px/);
    expect(root).toMatch(/scroll-padding-bottom:\s*12px/);
    const at = stripped.indexOf('html:has(#menu-panel:not([hidden]))');
    expect(at).toBeGreaterThan(-1);
    const media = stripped.lastIndexOf('@media', at);
    expect(stripped.slice(media, at)).toMatch(/^@media \(max-width: 959px\)\s*\{\s*$/);
    // The media block's own braces close after the rule, so the rule is inside it and not after it.
    const rule = stripped.slice(at, stripped.indexOf('}', at) + 1);
    expect(rule).toMatch(/scroll-padding-top:\s*403px/);
    expect(stripped.slice(media, at).match(/\}/g)).toBeNull();
  });
  test('"All letters" draws its ring inside: a stuck bar sits under the header, so the ring may not grow above it', () => {
    expect(stripped).toMatch(/\.gl-up:focus-visible\s*\{\s*outline-offset:\s*-3px/);
    // And so does a pointer link flush under its bar (a card whose first row is a pointer).
    expect(stripped).toMatch(/\.gl-entry--see:first-child \.gl-see a:focus-visible\s*\{\s*outline-offset:\s*-3px/);
    // And so does a pointer link flush under its bar (a card whose first row is a pointer).
    expect(stripped).toMatch(/\.gl-entry--see:first-child \.gl-see a:focus-visible\s*\{\s*outline-offset:\s*-3px/);
  });
  test('no transition, no Patch parts and none of the prototype’s own', () => {
    for (const part of ['var(--link)', 'transition', '--here-soft', '--line-strong', '--r-tile', '.pbar', '#p-l1', '#p-l2', '.gl-az__all', 'gl-key--all', 'gl-key--first', ':root:has(', 'scroll-behavior']) {
      expect(stripped, part).not.toContain(part);
    }
  });
  test('the card’s edge, the keys’ and the tab’s read the stylesheet’s names, and a pressed key moves 1px', () => {
    expect(ruleOf(stripped, '.gl-list')).toMatch(/border:\s*2px solid var\(--cs-edge\)/);
    expect(ruleOf(stripped, '.gl-key')).toMatch(/border:\s*2px solid var\(--cs-edge\)/);
    expect(ruleOf(stripped, '.gl-bar::after')).toMatch(/background:\s*var\(--cs-edge\)/);
    expect(ruleOf(stripped, 'a.gl-key:active')).toMatch(/translate\(1px, 1px\)/);
  });
  test('the keys go to 6 columns below 375px and the phone’s gutter is 14px', () => {
    expect(stripped).toMatch(/@media \(max-width: 374px\)\s*\{\s*\.gl-az ul \{ grid-template-columns: repeat\(6,/);
    expect(stripped).toMatch(/@media \(max-width: 599px\)[\s\S]*?\.gl \{[^}]*padding-inline: 14px/);
  });
});

describe('D21, G-1: what main holds, counted', () => {
  test('105 terms, 110 definitions, 48 pointers, 153 names, 404 sources, 20 live keys and 6 empty, one stamp, no layout-2 key', () => {
    const main = doc.querySelector('main')!;
    expect(main.querySelectorAll('.gl-entry:not(.gl-entry--see)')).toHaveLength(105);
    expect(main.querySelectorAll('.gl-def')).toHaveLength(110);
    expect(main.querySelectorAll('.gl-entry--see')).toHaveLength(48);
    expect(main.querySelectorAll('dt')).toHaveLength(153);
    expect(main.querySelectorAll('a.gl-src')).toHaveLength(404);
    expect(main.querySelectorAll('a.gl-key')).toHaveLength(20);
    expect([...main.querySelectorAll('span.gl-key--none')].map((k) => words(k.querySelector('.sr-only')))).toEqual(['G, no terms', 'Q, no terms', 'V, no terms', 'X, no terms', 'Y, no terms', 'Z, no terms']);
    expect(main.querySelectorAll('a.stamp[href="/about#facts"]')).toHaveLength(1);
    expect(main.querySelector('.gl-az__all, .gl-key--all, .gl-key--first')).toBeNull();
    expect(html).not.toContain('data-astro-cid');
  });
});
