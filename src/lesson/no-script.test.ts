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
  const track = tracks[0]!;
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
function hiddenWithoutScript(doc: Document, declaration: 'display: none' | 'visibility: hidden' = 'display: none'): string {
  const styles = [...doc.querySelectorAll('head noscript style')].map((s) => s.textContent ?? '').join('\n');
  const [property, value] = declaration.split(': ');
  const rule = new RegExp(`([^{}]+)\\{\\s*${property}:\\s*${value}\\s*!important;?\\s*\\}`).exec(styles);
  if (rule === null) throw new Error(`The head has no no-script rule that sets ${declaration} !important.`);
  return rule[1]!.trim();
}

const words = (el: Element | null | undefined): string => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

test.each(['dhcp', 'how-the-internet-works'])('without JavaScript, %s says it needs JavaScript and hides every control', async (slug) => {
  const doc = await lessonPage(slug);
  const hidden = hiddenWithoutScript(doc);
  // Kept in the layout, so the grid does not move, but out of sight and out of the accessibility tree.
  const blanked = hiddenWithoutScript(doc, 'visibility: hidden');
  const isHidden = (el: Element): boolean => el.closest(hidden) !== null || el.closest(blanked) !== null;

  // The controls that cannot work: the console's theme switch, the view switch, the playback controls and the
  // outline, whose places are buttons. Every button on the page is under one of them.
  for (const selector of ['.theme-toggle', '.topbar__seg', '.stage__views', '.console__controls']) expect(hidden).toContain(selector);
  const buttons = [...doc.querySelectorAll('body button')];
  expect(buttons.length).toBeGreaterThan(5);
  for (const button of buttons) expect(isHidden(button), button.outerHTML.slice(0, 120)).toBe(true);
  expect(isHidden(doc.querySelector('.topbar__seg')!)).toBe(true);
  expect(isHidden(doc.querySelector('.console__controls')!)).toBe(true);

  // The whole outline goes, its heading too, so no empty "This lesson" landmark is left. It keeps its grid cell.
  const outline = doc.querySelector('nav.console__outline')!;
  expect(outline.matches(blanked), blanked).toBe(true);
  expect(outline.closest(hidden), 'the outline keeps its cell: it is not display: none').toBeNull();
  expect(isHidden(outline.querySelector('.outline__head')!)).toBe(true);

  // The note stands where the log would say "Press Play", whose words are hidden.
  const idle = doc.querySelector('.console__log td[data-idle]')!;
  expect(words(idle.querySelector('noscript'))).toBe(NOTE);
  expect(isHidden(idle.querySelector('.log__idle-words')!)).toBe(true);
  expect(isHidden(idle.querySelector('noscript')!)).toBe(false);
  expect(doc.querySelectorAll('noscript .log__nojs')).toHaveLength(1);

  // What stays: the Overview's words, the figure, the lesson's title and the way back to the track.
  for (const selector of ['.console__explain', '.explain__title', '.console__stage svg[data-figure]', '.topbar__crumb h1', '.topbar__crumb a'])
    expect(isHidden(doc.querySelector(selector)!), selector).toBe(false);
  expect(words(doc.querySelector('.explain__title'))).not.toBe('');
});
