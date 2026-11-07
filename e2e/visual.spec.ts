import { expect, test, type Page } from '@playwright/test';
import { SITE_PAGES, collectErrors, kicker, open, playButton, readyLessons, requireLessons, settledFrame, stepCount } from './support';

/**
 * Full-page screenshots for the visual check against the mockups (spec §11.1): Home, the track, each ready lesson
 * at its Overview, step 3, Learn and Practice, About and 404, at the four desktop sizes in both themes. They go to
 * `test-results/visual/<page>-<size>-<theme>.png` (git-ignored) for a person to put beside the mockups.
 *
 * Run on its own with `npm run e2e:visual` (`--grep @visual`); `npm run e2e` leaves it out. The spec sets each size
 * and theme itself, so it runs in one project only (d1440-dark; playwright.config.ts has the others ignore it).
 */

const SIZES = [
  { width: 1280, height: 800 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const;
const THEMES = ['dark', 'light'] as const;
type Theme = (typeof THEMES)[number];

const LESSONS = readyLessons();

/** Where in a lesson each screenshot is taken. */
const PLACES = ['overview', 'step3', 'learn', 'practice'] as const;
type Place = (typeof PLACES)[number];

/** The position `?step=` takes for a place in the lesson's first unit, which has `steps` Watch steps. */
function positionOf(place: Place, steps: number): number {
  return { overview: 0, step3: 3, learn: steps + 1, practice: steps + 2 }[place];
}

/** Waits until every finite animation on the page has finished; looping ones are left to the screenshot to stop. */
async function animationsDone(page: Page): Promise<void> {
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== 'running' || a.effect?.getComputedTiming().endTime === Infinity),
  );
  await settledFrame(page);
}

/** Opens a lesson at a place, settled: a step is played to its end and paused there, so the scene is complete. */
async function openLessonAt(page: Page, path: string, place: Place): Promise<void> {
  await open(page, path);
  if (place === 'overview') return;
  const steps = await stepCount(page);
  await open(page, `${path}?step=${positionOf(place, steps)}`);
  const label = { step3: `Step 3 of ${steps}`, learn: 'Learn', practice: 'Practice' }[place];
  await expect(kicker(page)).toContainText(label);
  if (place === 'step3') {
    // Play runs on from step 3; pausing at once shows step 3 complete, with every one of its events applied.
    await playButton(page).click();
    await expect(playButton(page)).toHaveText('Pause');
    await playButton(page).click();
    await expect(playButton(page)).toHaveText('Play');
    await expect(kicker(page)).toContainText(label);
  }
}

test.describe('screenshots', { tag: '@visual' }, () => {
  requireLessons(LESSONS);

  for (const size of SIZES) {
    for (const theme of THEMES) {
      test.describe(`${size.width}x${size.height} ${theme}`, () => {
        test.use({ viewport: size, colorScheme: theme });
        test.describe.configure({ timeout: 90_000 });

        test.beforeEach(async ({ page }) => {
          // The site reads a saved theme before the system's; a fresh browser has none, but say the same thing twice.
          await page.addInitScript((t: Theme) => {
            try {
              window.localStorage.setItem('techconcepts:theme', t);
            } catch {
              // A page without storage (about:blank) follows colorScheme.
            }
          }, theme);
        });

        const shoot = async (page: Page, name: string, outputDir: string): Promise<void> => {
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
          await animationsDone(page);
          await page.screenshot({
            path: `${outputDir}/visual/${name}-${size.width}x${size.height}-${theme}.png`,
            fullPage: true,
            animations: 'disabled',
          });
        };

        for (const { name, path } of SITE_PAGES) {
          test(name, async ({ page }, testInfo) => {
            const errors = collectErrors(page);
            await open(page, path);
            if (name === 'home') {
              // The hero plays once as it comes into view: shoot its last frame, as the mockup ends.
              await expect(page.locator('[data-hero] [data-hud-play]')).toHaveAttribute('aria-label', 'Replay the animation', { timeout: 60_000 });
            }
            await shoot(page, name, testInfo.project.outputDir);
            expect(errors).toEqual([]);
          });
        }

        for (const lesson of LESSONS) {
          for (const place of PLACES) {
            test(`${lesson.slug} ${place}`, async ({ page }, testInfo) => {
              const errors = collectErrors(page);
              await openLessonAt(page, lesson.path, place);
              await shoot(page, `${lesson.slug}-${place}`, testInfo.project.outputDir);
              expect(errors).toEqual([]);
            });
          }
        }
      });
    }
  }
});
