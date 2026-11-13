// E1 (check 37): without JavaScript a lesson serves only its Overview, so no lesson's HTML holds Learn's term list or a
// definition; `no-script.test.ts` and `lesson.spec.ts`'s no-JavaScript test hold the rest unchanged.
import { getContainerRenderer } from '@astrojs/react/container-renderer';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
// @ts-expect-error - no @types/jsdom in this project; jsdom is already here for the component tests
import { JSDOM } from 'jsdom';
import { expect, test } from 'vitest';
import { getEntries, getLesson, neighbors, type AvailableSummary } from '../content/registry';
import { tracks } from '../content/tracks';
import { definitionsFor } from '../lib/glossary';
import { siteGlossary } from '../lib/glossary-site';
import LessonPage from '../pages/[track]/[lesson].astro';

const slugs = [...new Set(tracks.flatMap((t) => getEntries(t.id)).flatMap((e) => (e.available ? [e.slug] : [])))];

test.each(slugs)('%s: the HTML has no term list and no definition', async (slug) => {
  const track = tracks.find((t) => getEntries(t.id).some((e) => e.slug === slug))!;
  const entries = getEntries(track.id);
  const entry = entries.find((e): e is AvailableSummary => e.available && e.slug === slug)!;
  const props = { track, entry, entries, lesson: getLesson(slug)!, next: neighbors(entries, slug).next };
  const container = await AstroContainer.create({ renderers: await loadRenderers([getContainerRenderer()]) });
  const html = await container.renderToString(LessonPage, { params: { track: track.id, lesson: slug }, props });
  const doc: Document = new JSDOM(html).window.document;
  expect(doc.querySelectorAll('.explain__terms, .explain__def, .explain__hint')).toHaveLength(0);
});

test('the ICMP lesson is given the definitions of its tied terms', () => {
  expect(Object.keys(definitionsFor(siteGlossary().lessonMap, 'what-is-icmp')).length).toBeGreaterThanOrEqual(9 - 1);
});
