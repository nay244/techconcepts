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
  // A page whose mockup balances a title sets that itself, in its own styles.
  expect(globalCss).not.toMatch(/text-wrap:\s*balance/);
  // Two exceptions: the scene's title, which wraps to two lines while a desktop reader has Learn or Practice (D1), and the
  // forward button's words (D19), which wrap between words and are never cut.
  const balanced = consoleCss.match(/[^{}]*\{[^{}]*text-wrap:\s*balance[^{}]*\}/g) ?? [];
  expect(balanced.map((rule) => rule.split('{')[0]!.trim())).toEqual(['.console[data-reading] .stage__title', '.guide__foot .go__label']);
});

test('the lesson’s bar gives its spare room to the timeline, and the track’s cell has the column’s width and half the gap', () => {
  expect(consoleCss).toMatch(/\.timeline \{[^}]*flex: 1 1 0;[^}]*min-width: 0;/);
  expect(consoleCss).toMatch(/\.top__lesson \{[^}]*flex: 0 0 calc\(var\(--track\) \+ 5px\);/);
});

test('the faces have one name each: data is set in --mono, and the old --font-mono alias is gone', () => {
  expect(globalCss).not.toMatch(/--font-mono/);
  expect(globalCss).toMatch(/table\.data \{\s*font-family: var\(--mono\);/);
});

test('the Lesson page’s skip link is lifted over its header by console.css alone (B30), and global.css keeps its own layer', () => {
  const bare = consoleCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const rule = /body:has\(\.console\) \.skip-link \{\s*z-index: 21;\s*\}/g;
  expect(bare.match(rule)?.length).toBe(1);
  expect(bare).not.toMatch(/\.skip-link[^{}]*\{[^}]*!important/);
  expect(globalCss.match(/\.skip-link \{[^}]*\}/)![0]).toMatch(/z-index: 10;/);
});
