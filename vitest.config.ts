/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// getViteConfig runs Vitest through Astro's own Vite config, so
// import.meta.glob and the React integration behave as they do in the build.
export default getViteConfig({
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.{ts,mjs}'],
    setupFiles: ['./src/test/setup.ts'],
  },
});
