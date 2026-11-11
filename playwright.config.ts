import { defineConfig } from '@playwright/test';
import { nodeEnv } from './e2e/support';

/**
 * End-to-end checks run against the built site (`astro preview`), in Chromium, at the desktop sizes the redesign is
 * made for (1280 to 1440 wide, checked up to 1920), with reduced motion, and on a phone: there every site page has to
 * load and scroll without errors, and every lesson has to fit one screen with its tabs.
 *
 * The server has a port of its own, and is never reused: 4321 is `astro dev`'s default, and a server already
 * running there could be another checkout's. A unit in its own worktree sets `E2E_PORT` to the port its brief gives
 * it, so two units can run their specs at the same time.
 *
 * `tablet.spec.ts` sets its window sizes itself, so it has a project of its own, and the others ignore it.
 *
 * `visual.spec.ts` (tagged @visual) takes the screenshots for the visual check: `npm run e2e:visual`. `npm run e2e`
 * leaves it out. It sets each size and theme itself, so only the d1440-dark project runs it; the other projects
 * ignore the file.
 *
 * `og-image.spec.ts` photographs the share image's card in a window of its own, so only the d1440-dark project runs
 * it (the one CI's e2e job runs); the other projects ignore the file.
 *
 * Phone and desktop tests go to their projects here, not by skipping: the phone project runs only site.spec.ts's
 * @phone tests, and every desktop project leaves them out. The skips left in the specs are deliberate gates: the
 * playback behaviour checks run in d1440-dark and reduced-motion only, and the reduced-motion timing in its project.
 */
const PORT = Number(nodeEnv.E2E_PORT) || 4471;
const desktop = { grepInvert: /@phone/ };
const notVisual = { ...desktop, testIgnore: /(visual|tablet|og-image)\.spec\.ts$/ };

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: 'list',
  // Finds the ready lessons on the built track page, for the specs to loop over.
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  webServer: {
    // --ignore-lock keeps the server in the foreground: Astro moves `preview` into the background
    // when it detects an AI agent, and Playwright would then see the command exit.
    command: `npm run build && npm run preview -- --port ${PORT} --ignore-lock`,
    port: PORT,
    reuseExistingServer: false,
    // `npm run build` runs astro check first and the budget check last.
    timeout: 240_000,
  },
  projects: [
    { name: 'd1280', ...notVisual, use: { viewport: { width: 1280, height: 800 } } },
    { name: 'd1366', ...notVisual, use: { viewport: { width: 1366, height: 768 } } },
    { name: 'd1440-dark', ...desktop, testIgnore: /tablet\.spec\.ts$/, use: { viewport: { width: 1440, height: 900 }, colorScheme: 'dark' } },
    { name: 'd1440-light', ...notVisual, use: { viewport: { width: 1440, height: 900 }, colorScheme: 'light' } },
    { name: 'd1920', ...notVisual, use: { viewport: { width: 1920, height: 1080 } } },
    { name: 'reduced-motion', ...notVisual, use: { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' } },
    // The phone: every site page loads and scrolls, and every lesson fits one screen with its tabs (site.spec.ts).
    { name: 'phone', testMatch: /site\.spec\.ts$/, grep: /@phone/, use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    // The lesson between 761px and 1099px (tablet.spec.ts): it sets each window size and theme itself.
    { name: 'tablet', testMatch: /tablet\.spec\.ts$/, use: { viewport: { width: 1024, height: 768 } } },
  ],
});
