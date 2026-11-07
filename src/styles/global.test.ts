// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const globalCss: string = readFileSync(new URL('./global.css', import.meta.url), 'utf8');
const consoleCss: string = readFileSync(new URL('../lesson/console.css', import.meta.url), 'utf8');

test('text is smoothed the browser’s way, as in the approved mockups, so it keeps their weight on a Mac', () => {
  // `-webkit-font-smoothing: antialiased` drew every word on macOS visibly thinner than the mockups.
  expect(globalCss).not.toMatch(/font-smoothing/);
});

test('headings and the lesson’s titles wrap where the mockups’ do, not balanced', () => {
  // Only the home hero's title is balanced in its mockup, and it sets that itself (HeroWeb.astro).
  expect(globalCss).not.toMatch(/text-wrap:\s*balance/);
  expect(consoleCss).not.toMatch(/text-wrap:\s*balance/);
});

test('the lesson’s top bar gives its spare room to the crumb, as the three newest lesson mockups do', () => {
  // internet-v2, subnet-v1 and firewalls-v1 set `.top > .now { flex: 1 0 auto; }`, which puts the OSI and progress
  // blocks beside the theme switch; the crumb still gives way first when the bar is short of room.
  expect(consoleCss).toMatch(/\.topbar__now \{[^}]*flex: 1 1 auto;[^}]*min-width: 340px;/);
});

test('the faces have one name each: data is set in --mono, and the old --font-mono alias is gone', () => {
  expect(globalCss).not.toMatch(/--font-mono/);
  expect(globalCss).toMatch(/table\.data \{\s*font-family: var\(--mono\);/);
});
