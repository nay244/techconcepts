// The lesson page without JavaScript: it says plainly that the lesson needs JavaScript to play, and hides every control
// that cannot work, while the Overview's words and the figure stay. The page is rendered with Astro's container (which
// needs this file's default node environment, and the React renderer for the console island) and parsed with jsdom,
// which runs no scripts, so it reads each <noscript> as a browser with JavaScript off does.
import { getContainerRenderer } from '@astrojs/react/container-renderer';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
// @ts-expect-error - no @types/jsdom in this project; jsdom is already here for the component tests
import { JSDOM } from 'jsdom';
import { expect, test } from 'vitest';
import { getEntries, getLesson, neighbors, type AvailableSummary } from '../content/registry';
import { tracks } from '../content/tracks';
import LessonPage from '../pages/[track]/[lesson].astro';

const NOTE = 'This lesson needs JavaScript to play.';

async function lessonPage(slug: string): Promise<Document> {
  // The lesson's own track: the tracks' slugs differ, so a slug names one.
  const track = tracks.find((t) => getEntries(t.id).some((e) => e.slug === slug))!;
  const entries = getEntries(track.id);
  const entry = entries.find((e): e is AvailableSummary => e.available && e.slug === slug)!;
  const props = { track, entry, entries, lesson: getLesson(slug)!, next: neighbors(entries, slug).next };
  const container = await AstroContainer.create({ renderers: await loadRenderers([getContainerRenderer()]) });
  const html = await container.renderToString(LessonPage, { params: { track: track.id, lesson: slug }, props });
  return new JSDOM(html).window.document;
}

/**
 * The selectors the head's no-script style hides with `declaration`. The rule must be `!important`: the page's own
 * stylesheets load after it, and their `display` (the switches' inline-flex, the controls' flex) would win at the
 * same specificity.
 */
function hiddenWithoutScript(doc: Document, declaration: 'display: none' = 'display: none'): string {
  const styles = [...doc.querySelectorAll('head noscript style')].map((s) => s.textContent ?? '').join('\n');
  const [property, value] = declaration.split(': ');
  const rule = new RegExp(`([^{}]+)\\{\\s*${property}:\\s*${value}\\s*!important;?\\s*\\}`).exec(styles);
  if (rule === null) throw new Error(`The head has no no-script rule that sets ${declaration} !important.`);
  return rule[1]!.trim();
}

const words = (el: Element | null | undefined): string => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

test.each(['dhcp', 'what-is-http', 'osi-model'])('without JavaScript, %s says it needs JavaScript and hides every control', async (slug) => {
  const doc = await lessonPage(slug);
  const hidden = hiddenWithoutScript(doc);
  const isHidden = (el: Element): boolean => el.closest(hidden) !== null;

  // The controls that cannot work: the theme button, the view switch, the playback controls, the timeline's buttons, the
  // bar's lessons button, the sheet with its Close, the key line. Every button on the page is under one of them, but the
  // header's menu button under 960px, which does nothing without JavaScript on every page (E6).
  for (const selector of ['.theme-toggle', '.stage__views', '.console__controls', '.timeline__nav', '.top__lessons', '.sheet', '.keys'])
    expect(hidden).toContain(selector);
  const buttons = [...doc.querySelectorAll('body button:not(.site-head .menu-btn)')];
  expect(buttons.length).toBeGreaterThan(5);
  for (const button of buttons) expect(isHidden(button), button.outerHTML.slice(0, 120)).toBe(true);
  expect(isHidden(doc.querySelector('.theme-toggle')!)).toBe(true);
  expect(isHidden(doc.querySelector('.console__controls')!)).toBe(true);
  expect(isHidden(doc.querySelector('.sheet .cbtn')!)).toBe(true);

  // The track's lessons are links: the column is not blanked, and each link stays and works (E5).
  const column = doc.querySelector('.console__track')!;
  expect(column.matches(hidden)).toBe(false);
  expect(hidden).not.toContain('.console__track');
  const links = [...column.querySelectorAll('nav a[href]')];
  expect(links.length).toBeGreaterThan(5);
  for (const link of links) expect(isHidden(link), link.outerHTML.slice(0, 100)).toBe(false);
  expect(doc.querySelector('.console__track [aria-current="page"]')).not.toBeNull();

  // The timeline is a list to read: its names stand in a <noscript>, headed "In this lesson".
  expect(words(doc.querySelector('noscript .timeline__plain h2'))).toBe('In this lesson');
  expect(doc.querySelectorAll('noscript .timeline__plain li').length).toBeGreaterThan(3);
  // The stacked page (under 1100px) lists them again, one a line, after the Overview's words, and the row's copy has no list.
  expect(words(doc.querySelector('noscript .timeline__stack h2'))).toBe('In this lesson');
  expect(doc.querySelectorAll('noscript .timeline__stack li').length).toBe(doc.querySelectorAll('noscript .timeline__plain li').length);
  expect(doc.querySelector('.timeline--row noscript')).toBeNull();

  // The note stands where the log would say "Press Play", whose words are hidden.
  const idle = doc.querySelector('.console__log td[data-idle]')!;
  expect(words(idle.querySelector('noscript'))).toBe(NOTE);
  expect(isHidden(idle.querySelector('.log__idle-words')!)).toBe(true);
  expect(isHidden(idle.querySelector('noscript')!)).toBe(false);
  expect(doc.querySelectorAll('noscript .log__nojs')).toHaveLength(1);

  // What stays: the Overview's words, the figure, the lesson's title and the way back to the track.
  for (const selector of ['.console__explain', '.explain__title', '.console__stage svg[data-figure]', '.track__lesson h1', '.top__trk a'])
    expect(isHidden(doc.querySelector(selector)!), selector).toBe(false);
  expect(words(doc.querySelector('.explain__title'))).not.toBe('');
  // The page shows no stamp, and it has one banner: the site's header.
  expect(doc.querySelector('.stamp')).toBeNull();
  expect(doc.querySelectorAll('header')).toHaveLength(1);
});

test('without JavaScript, the OSI figure shows its words', async () => {
  const doc = await lessonPage('osi-model');
  const text = words(doc.querySelector('svg[data-figure="osi"]'));
  for (const part of ['APPLICATION', 'PHYSICAL', 'Your laptop', 'passes it on', 'Web server', 'OSI REFERENCE MODEL · SEVEN LAYERS']) expect(text).toContain(part);
});

test.each(['dhcp', 'what-is-http'])('%s: one main, one #main after the bar and the track column, and the site’s header is the one banner (D19 case 50)', async (slug) => {
  const doc = await lessonPage(slug);
  expect(doc.querySelectorAll('main')).toHaveLength(1);
  expect(doc.querySelectorAll('[id="main"]')).toHaveLength(1);
  const before = (a: Element, b: Element) => Boolean(a.compareDocumentPosition(b) & 4);
  const main = doc.querySelector('main#main')!;
  expect(before(doc.querySelector('.console__top')!, main)).toBe(true);
  expect(before(doc.querySelector('.console__track')!, main)).toBe(true);
  expect(main.contains(doc.querySelector('.console__top'))).toBe(false);
  expect(doc.querySelectorAll('header')).toHaveLength(1);
  expect(doc.querySelector('header')!.classList.contains('site-head')).toBe(true);
  expect(doc.querySelectorAll('footer')).toHaveLength(0);
  expect(doc.querySelectorAll('h1')).toHaveLength(2);
  // Both homes of the lesson's name are in the markup; the width's CSS shows one of them (E3).
  expect([...doc.querySelectorAll('h1')].map((h) => h.textContent)).toEqual([...doc.querySelectorAll('h1')].map(() => getLesson(slug)!.title));
  expect(doc.querySelector('.site-head a[aria-current="true"]')!.textContent).toBe('Tracks');
  expect(doc.querySelectorAll('.site-head a.btn--primary')).toHaveLength(0);
});
