import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

/** @type {{ scripts: Record<string, string>, engines: { node: string } }} */
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

// Workers Builds runs `npm run build`, so a page over its budget must fail the build itself, not a separate step.
test('npm run build checks the size budgets after astro build, so a breach fails the build', () => {
  expect(pkg.scripts.build).toBe('astro check && astro build && node scripts/check-budgets.mjs');
  expect(pkg.scripts.budgets).toBe('node scripts/check-budgets.mjs');
});
