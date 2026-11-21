// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { execSync } from 'node:child_process';

// One stamp for the whole build: the commit it is made from, else the build's time when git is not there.
const buildStamp = (() => {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return new Date().toISOString();
  }
})();

// https://astro.build/config
export default defineConfig({
  site: 'https://techconcepts.app',
  integrations: [react()],
  vite: { define: { __BUILD_STAMP__: JSON.stringify(buildStamp) } },
  // How the Internet Works was lesson 1 of Networking before it became its own track (2026-11-08).
  redirects: { '/networking/how-the-internet-works': '/how-the-internet-works' },
});
