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
import { checkedOn, getEntries, trackTotals } from '../content/registry';
import { comingSoonTracks, plannedTracks, tracks } from '../content/tracks';
import { comingTracksSentence, factCheckSentence } from '../lib/about';
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

  expect(stat('tracks planned')).toBe(String(tracks.length + plannedTracks.length + comingSoonTracks.length));
  // A lesson two tracks list counts once: 9 ready in Networking, 14 in the tour, 4 shared.
  const distinct = new Set(tracks.flatMap((t) => getEntries(t.id)).flatMap((e) => (e.available ? [e.slug] : [])));
  expect(stat('lessons ready')).toBe(String(distinct.size));
  expect(stat('lessons ready')).toBe('19');
  expect(stat('lessons ready')).not.toBe(String(trackTotals(tracks.flatMap((t) => getEntries(t.id))).available));
  expect(stat('accounts needed')).toBe('0');
});

test('the tracks still to come start with CompTIA A+, the one being written', async () => {
  const doc = await about();
  const sentence = comingTracksSentence([...plannedTracks, ...comingSoonTracks].map((t) => t.title));
  expect(sentence).toContain('CompTIA A+');
  expect(words(doc.querySelector('#what'))).toContain(sentence);
});

test('the facts section says how many lessons have passed the fact-check, and makes no claim about exam tags', async () => {
  const doc = await about();
  const slugs = [...new Set(tracks.flatMap((t) => getEntries(t.id)).flatMap((e) => (e.available ? [e.slug] : [])))];
  const checked = slugs.filter((slug) => checkedOn(slug) !== null).length;
  const facts = words(doc.querySelector('#facts'));
  expect(facts).toContain('Each lesson lists the standards it draws on under Sources at the end of Learn.');
  expect(facts).toContain(factCheckSentence(checked, slugs.length));
  expect(facts).not.toContain('exams and jobs');
  expect(facts).not.toContain('is checked against the standards');
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
