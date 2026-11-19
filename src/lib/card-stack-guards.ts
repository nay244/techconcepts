// @ts-expect-error - no @types/node in this project; vitest runs under node
import { execSync } from 'node:child_process';
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';

/*
 * The two checks the guards pinned to an old commit share (job 24, prototypes/d23-cases.md Part 8). Not a test file: it
 * reads, and the tests that use it (not-found-page.test.ts, about-page.test.ts, glossary-page.test.ts and
 * track-page-render.test.ts) assert on what it returns, so each says in its own lines what it expects.
 */

const git = (cmd: string): string => execSync(`${cmd} || true`, { encoding: 'utf8' }) as string;

/**
 * G(C): how `src/styles/card-stack.css` differs from its text at commit `commit`. The grant is three comments (lines 1 to
 * 4, 6 to 8 and 48 to 49, each keeping its line count) and the header and footer block appended after the old last line.
 */
export function cardStackGrant(commit: string): {
  /** The line numbers (1-based) outside the three comments, up to the old last line, that are not the old text. */
  changed: number[];
  /** Each of the three comments: begins as it must, ends where a comment ends, and is one comment. */
  comments: boolean[];
  /** The old text's entries (196 lines and the final newline), the blank line, the block's first line, its last two entries. */
  frame: [number, string, string, string, string];
  /** How many times the block's two markers appear. */
  markers: [number, number];
} {
  const now = (readFileSync('src/styles/card-stack.css', 'utf8') as string).split('\n');
  const then = git(`git show ${commit}:src/styles/card-stack.css`).split('\n');
  const comments = new Set([0, 1, 2, 3, 5, 6, 7, 47, 48]);
  const changed: number[] = [];
  for (let i = 0; i <= 195; i++) if (!comments.has(i) && now[i] !== then[i]) changed.push(i + 1);
  const ok = ([from, to, begins]: readonly [number, number, string]): boolean => {
    const text = now.slice(from, to).join('\n');
    return text.startsWith(begins) && text.endsWith('*/') && text.split('*/').length === 2;
  };
  const text = now.join('\n');
  return {
    changed,
    comments: ([[0, 4, '/*'], [5, 8, '/* TOKENS BEGIN'], [47, 49, '/* ---------- Buttons']] as const).map(ok),
    frame: [then.length, now[196]!, now[197]!.slice(0, 26), now[now.length - 2]!, now[now.length - 1]!],
    markers: [text.split('HEADER AND FOOTER BEGIN').length - 1, text.split('HEADER AND FOOTER END').length - 1],
  };
}
/** What G(C) must return. */
export const CARD_STACK_GRANT = {
  changed: [],
  comments: [true, true, true],
  frame: [197, '', '/* HEADER AND FOOTER BEGIN', '/* HEADER AND FOOTER END */', ''],
  markers: [1, 1],
} as const;

/**
 * T(C): how `src/pages/tracks.astro` differs from its text at commit `commit`: the hunk headers, the removed lines, and the
 * added lines with whole-line comments and blank lines dropped.
 */
export function tracksGrant(commit: string): { hunks: string[]; removed: string[]; added: string[] } {
  const diff = git(`git diff -U0 ${commit} -- src/pages/tracks.astro`).split('\n');
  return {
    hunks: diff.filter((l) => l.startsWith('@@')).map((l) => /^@@ -\d+(?:,\d+)? \+\d+/.exec(l)![0].replace(/\+\d+$/, '+N')),
    removed: diff.filter((l) => l.startsWith('-') && !l.startsWith('---')),
    added: diff
      .filter((l) => l.startsWith('+') && !l.startsWith('+++'))
      .map((l) => l.slice(1).trim())
      .filter((l) => l !== '' && !/^\/\*.*\*\/$/.test(l)),
  };
}
/** What T(C) must return: one insertion after line 116 (`-116,0`), nothing removed, the track page's five lines. */
export const TRACKS_GRANT = {
  hunks: ['@@ -116,0 +N'],
  removed: [],
  added: ['@media (max-width: 959px) {', ':global(html:has(#menu-panel:not([hidden]))) {', 'scroll-padding-top: 341px;', '}', '}'],
} as const;
