import { defineConfig } from '@playwright/test';

/**
 * End-to-end checks run against the built site (`astro preview`), in Chromium,
 * at the sizes and preferences the lesson page has to handle.
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
  },
  webServer: {
    // --ignore-lock keeps the server in the foreground: Astro moves `preview` into the background
    // when it detects an AI agent, and Playwright would then see the command exit.
    command: 'npm run build && npm run preview -- --port 4321 --ignore-lock',
    port: 4321,
    reuseExistingServer: true,
    // `npm run build` runs astro check first.
    timeout: 240_000,
  },
  projects: [
    { name: 'desktop-dark', use: { viewport: { width: 1440, height: 900 }, colorScheme: 'dark' } },
    { name: 'desktop-light', use: { viewport: { width: 1440, height: 900 }, colorScheme: 'light' } },
    { name: 'phone', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: 'reduced-motion', use: { reducedMotion: 'reduce' } },
    { name: 'short-desktop', use: { viewport: { width: 1280, height: 650 } } },
  ],
});
