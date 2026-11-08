// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://techconcepts.app',
  integrations: [react()],
  // How the Internet Works was lesson 1 of Networking before it became its own track (2026-11-08).
  redirects: { '/networking/how-the-internet-works': '/how-the-internet-works' },
});
