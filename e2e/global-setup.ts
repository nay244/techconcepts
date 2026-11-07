import { chromium, type FullConfig } from '@playwright/test';
import { LESSONS_ENV, nodeEnv, type ReadyLesson } from './support';

/**
 * Finds the ready lessons on the built site, so no spec keeps a list of its own: the track page's lesson cards link
 * to them. Playwright starts the web server (which builds the site) before this runs, and loads the specs after it,
 * so they read the list from the environment as they are collected.
 */
export default async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use.baseURL;
  if (baseURL === undefined) throw new Error('playwright.config.ts gives no baseURL.');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ baseURL });
    await page.goto('/networking');
    const lessons: ReadyLesson[] = await page.locator('main .lesson').evaluateAll((cards) =>
      cards.map((card) => {
        const link = card.querySelector<HTMLAnchorElement>('a.l-link');
        if (link === null) throw new Error('A ready lesson card has no link.');
        const path = new URL(link.href).pathname;
        const minutes = /^(\d+) min$/.exec(card.querySelector('.l-meta li')?.textContent?.trim() ?? '');
        return {
          slug: path.split('/').filter(Boolean).at(-1) ?? '',
          title: link.textContent?.trim() ?? '',
          path,
          minutes: minutes === null ? Number.NaN : Number(minutes[1]),
        };
      }),
    );
    if (lessons.length === 0) throw new Error('The track page at /networking links to no ready lesson.');
    for (const lesson of lessons) {
      if (lesson.slug === '' || lesson.title === '' || Number.isNaN(lesson.minutes)) {
        throw new Error(`Could not read a ready lesson's card: ${JSON.stringify(lesson)}`);
      }
    }
    nodeEnv[LESSONS_ENV] = JSON.stringify(lessons);
  } finally {
    await browser.close();
  }
}
