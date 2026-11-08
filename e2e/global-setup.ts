import { chromium, type FullConfig } from '@playwright/test';
import { LESSONS_ENV, nodeEnv, type ReadyLesson } from './support';

/**
 * Finds the ready lessons on the built site, so no spec keeps a list of its own: the Tracks page links to each track
 * with lessons, and each track page's lesson cards link to them. Playwright starts the web server (which builds the
 * site) before this runs, and loads the specs after it, so they read the list from the environment as they are
 * collected.
 */
export default async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use.baseURL;
  if (baseURL === undefined) throw new Error('playwright.config.ts gives no baseURL.');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ baseURL });
    await page.goto('/tracks');
    const trackPaths = await page.locator('main .tp-grid a.tcard').evaluateAll((cards) =>
      cards.map((card) => new URL((card as HTMLAnchorElement).href).pathname),
    );
    if (trackPaths.length === 0) throw new Error('The Tracks page links to no track.');
    const lessons: ReadyLesson[] = [];
    for (const path of trackPaths) {
      await page.goto(path);
      const found: ReadyLesson[] = await page.locator('main .lesson').evaluateAll((cards) =>
        cards.map((card) => {
          const link = card.querySelector<HTMLAnchorElement>('a.l-link');
          if (link === null) throw new Error('A ready lesson card has no link.');
          const lessonPath = new URL(link.href).pathname;
          return {
            slug: lessonPath.split('/').filter(Boolean).at(-1) ?? '',
            title: link.textContent?.trim() ?? '',
            path: lessonPath,
          };
        }),
      );
      if (found.length === 0) throw new Error(`The track page at ${path} links to no ready lesson.`);
      lessons.push(...found);
    }
    for (const lesson of lessons) {
      if (lesson.slug === '' || lesson.title === '') {
        throw new Error(`Could not read a ready lesson's card: ${JSON.stringify(lesson)}`);
      }
    }
    nodeEnv[LESSONS_ENV] = JSON.stringify(lessons);
  } finally {
    await browser.close();
  }
}
