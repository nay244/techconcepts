import { chromium, type FullConfig } from '@playwright/test';
import { isChecked, LESSONS_ENV, nodeEnv, type ReadyLesson } from './support';

/**
 * Finds the ready lessons on the built site, so no spec keeps a list of its own: the Tracks page links to each track
 * with lessons, and each track page's route links to them from its ready stops. Which are checked comes from the closed legacy list, not from the page; the page's stamps
 * only have to agree with it. Playwright starts the web server (which builds the site) before this runs, and loads the specs after it, so they read the list from the environment
 * as they are collected.
 */
export default async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use.baseURL;
  if (baseURL === undefined) throw new Error('playwright.config.ts gives no baseURL.');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ baseURL });
    await page.goto('/tracks');
    const trackPaths = await page.locator('main article.panel h2 a').evaluateAll((links) =>
      links.map((link) => new URL((link as HTMLAnchorElement).href).pathname),
    );
    if (trackPaths.length === 0) throw new Error('The Tracks page links to no track.');
    const lessons: ReadyLesson[] = [];
    for (const path of trackPaths) {
      await page.goto(path);
      const found: (Omit<ReadyLesson, 'checked'> & { stamp: string })[] = await page.locator('main .route li.stop:not(.stop--soon)').evaluateAll((stops) =>
        stops.map((stop) => {
          const link = stop.querySelector<HTMLAnchorElement>('h3 a');
          if (link === null) throw new Error('A ready lesson stop has no link.');
          const lessonPath = new URL(link.href).pathname;
          return {
            slug: lessonPath.split('/').filter(Boolean).at(-1) ?? '',
            title: link.textContent?.trim() ?? '',
            path: lessonPath,
            stamp: stop.querySelector('.stamp')?.textContent?.trim() ?? '',
          };
        }),
      );
      if (found.length === 0) throw new Error(`The track page at ${path} links to no ready lesson.`);
      // The truth is the closed legacy list; the page only has to agree with it.
      for (const { stamp, ...lesson } of found) {
        const checked = isChecked(lesson.slug);
        if (/^Checked\b/.test(stamp) !== checked) {
          throw new Error(`${lesson.path} is ${checked ? 'off' : 'on'} the legacy list but its stop says "${stamp}".`);
        }
        lessons.push({ ...lesson, checked });
      }
    }
    for (const lesson of lessons) {
      if (lesson.slug === '' || lesson.title === '') {
        throw new Error(`Could not read a ready lesson's stop: ${JSON.stringify(lesson)}`);
      }
    }
    nodeEnv[LESSONS_ENV] = JSON.stringify(lessons);
  } finally {
    await browser.close();
  }
}
