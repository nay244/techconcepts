// About's words that are worked out from the content, and its analytics sentence, checked in the page's own markup.
// The page is rendered with Astro's container (which needs this file's default node environment, and the React
// renderer for the page's ResetProgress island) and parsed with jsdom. Each expected value is worked out from the same
// sources the page uses, so a value written into the page by hand fails here once the content moves on.
import { getContainerRenderer } from '@astrojs/react/container-renderer';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
// @ts-expect-error - no @types/jsdom in this project; jsdom is already here for the component tests
import { JSDOM } from 'jsdom';
import { expect, test, vi } from 'vitest';
import { getEntries, trackTotals } from '../content/registry';
import { comingSoonTracks, tracks } from '../content/tracks';
import About from '../pages/about.astro';

// The build's analytics token, which each render here sets for itself.
const analytics = vi.hoisted(() => ({ token: undefined as string | undefined }));
vi.mock('../lib/analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../lib/analytics')>()),
  get analyticsToken() {
    return analytics.token;
  },
}));

async function about(token?: string): Promise<Document> {
  analytics.token = token;
  const container = await AstroContainer.create({ renderers: await loadRenderers([getContainerRenderer()]) });
  return new JSDOM(await container.renderToString(About)).window.document;
}

const words = (el: Element | null | undefined): string => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

test('the stats count the tracks planned and the lessons ready from the content', async () => {
  const doc = await about();
  const stat = (label: string): string =>
    words([...doc.querySelectorAll('.stats > div')].find((d) => words(d.querySelector('dt')) === label)?.querySelector('dd'));

  expect(stat('tracks planned')).toBe(String(tracks.length + comingSoonTracks.length));
  expect(stat('lessons ready')).toBe(String(trackTotals(tracks.flatMap((t) => getEntries(t.id))).available));
  expect(stat('accounts needed')).toBe('0');
});

test('the pace note says lessons are self-paced and gives no figure', async () => {
  const doc = await about();
  expect(words(doc.querySelector('.a-note p'))).toBe(
    'Lessons are self-paced. Take as long as you need. This browser remembers where you stopped, so you can pick up where you left off.',
  );
});

test('the analytics sentence is there only when the build was given a token', async () => {
  const sentence = 'The site counts page views with privacy-friendly analytics that use no cookies and know nothing about your progress.';
  const says = (doc: Document): boolean => [...doc.querySelectorAll('#privacy p')].some((p) => words(p) === sentence);

  expect(says(await about())).toBe(false);
  expect(says(await about('   '))).toBe(false);
  expect(says(await about('a-test-token'))).toBe(true);
});
