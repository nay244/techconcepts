import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { expect } from 'vitest';

/*
 * The two checks the guards pinned to an old commit share (job 24, prototypes/d23-cases.md Part 8). Not a test file: the
 * tests that use it are in not-found-page.test.ts, about-page.test.ts, glossary-page.test.ts and track-page-render.test.ts.
 */

const git = (cmd: string): string => execSync(`${cmd} || true`, { encoding: 'utf8' }) as string;

/**
 * G(C): `src/styles/card-stack.css` differs from its text at commit `commit` only in three comments (lines 1 to 4, 6 to 8
 * and 48 to 49, each keeping its line count) and by the header and footer block appended after the old last line.
 */
export function expectCardStackGrant(commit: string): void {
  const now = readFileSync('src/styles/card-stack.css', 'utf8').split('\n');
  const then = git(`git show ${commit}:src/styles/card-stack.css`).split('\n');
  expect(then).toHaveLength(197); // 196 lines and the final newline
  const comments = new Set([0, 1, 2, 3, 5, 6, 7, 47, 48]);
  for (let i = 0; i <= 195; i++) if (!comments.has(i)) expect(now[i], `line ${i + 1}`).toBe(then[i]);
  for (const [from, to, begins] of [[0, 4, '/*'], [5, 8, '/* TOKENS BEGIN'], [47, 49, '/* ---------- Buttons']] as const) {
    const text = now.slice(from, to).join('\n');
    expect(text.startsWith(begins), `lines ${from + 1} to ${to}`).toBe(true);
    expect(text.endsWith('*/'), `lines ${from + 1} to ${to}`).toBe(true);
    expect(text.split('*/').length - 1, `lines ${from + 1} to ${to}: one comment`).toBe(1);
  }
  expect(now[196]).toBe('');
  expect(now[197]!.startsWith('/* HEADER AND FOOTER BEGIN')).toBe(true);
  expect(now[now.length - 2]).toBe('/* HEADER AND FOOTER END */');
  expect(now[now.length - 1]).toBe('');
  const text = now.join('\n');
  expect(text.split('HEADER AND FOOTER BEGIN')).toHaveLength(2);
  expect(text.split('HEADER AND FOOTER END')).toHaveLength(2);
}

/**
 * T(C): `src/pages/tracks.astro` differs from its text at commit `commit` by one insertion after line 116: the track
 * page's open-menu rule, with at most whole-line comments besides.
 */
export function expectTracksGrant(commit: string): void {
  const diff = git(`git diff -U0 ${commit} -- src/pages/tracks.astro`).split('\n');
  const hunks = diff.filter((l) => l.startsWith('@@'));
  expect(hunks).toHaveLength(1);
  expect(hunks[0]).toMatch(/^@@ -116,0 \+117,\d+ @@/);
  const removed = diff.filter((l) => l.startsWith('-') && !l.startsWith('---'));
  expect(removed).toEqual([]);
  const added = diff
    .filter((l) => l.startsWith('+') && !l.startsWith('+++'))
    .map((l) => l.slice(1).trim())
    .filter((l) => !/^\/\*.*\*\/$/.test(l) && l !== '');
  expect(added).toEqual(['@media (max-width: 959px) {', ':global(html:has(#menu-panel:not([hidden]))) {', 'scroll-padding-top: 341px;', '}', '}']);
}
