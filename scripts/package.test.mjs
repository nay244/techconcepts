import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

/** @type {{ scripts: Record<string, string>, engines: { node: string } }} */
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

// Workers Builds runs `npm run build`, so a page over its budget must fail the build itself, not a separate step.
test('npm run build checks the size budgets after astro build, so a breach fails the build', () => {
  expect(pkg.scripts.build).toBe('astro check && astro build && node scripts/check-budgets.mjs');
  expect(pkg.scripts.budgets).toBe('node scripts/check-budgets.mjs');
});

// generate-og-image.mjs imports src/styles/tokens.ts, which needs Node's type stripping: on by default from 22.18.
test('engines asks for Node 22.18 or later, and .node-version meets it', () => {
  expect(pkg.engines.node).toBe('>=22.18');
  const [major = 0, minor = 0] = readFileSync(new URL('../.node-version', import.meta.url), 'utf8').trim().split('.').map(Number);
  expect(major > 22 || (major === 22 && minor >= 18)).toBe(true);
  expect(readFileSync(new URL('./generate-og-image.mjs', import.meta.url), 'utf8')).toMatch(/type stripping/);
});
