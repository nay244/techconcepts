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
/** What T(C) must return: one insertion after line 115 (`-115,0`), nothing removed, the root's 12px below (job 29) and the track page's five lines. */
export const TRACKS_GRANT = {
  hunks: ['@@ -115,0 +N'],
  removed: [],
  added: ['scroll-padding-bottom: 12px;', '}', '@media (max-width: 959px) {', ':global(html:has(#menu-panel:not([hidden]))) {', 'scroll-padding-top: 341px;', '}'],
} as const;

/**
 * P(C, file): how a page differs from its text at commit `commit` with block comments, whole-line `//` comments and blank lines left out (job 29, B37):
 * the hunks (old start and count, the new side as N, counted in those lines), the removed lines and the added lines, each
 * trimmed. A small LCS, since `git diff` would count the comments.
 */
export function pageGrant(commit: string, file: string): { hunks: string[]; removed: string[]; added: string[] } {
  const lines = (text: string): string[] =>
    text
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l !== '' && !l.startsWith('// '));
  const a = lines(git(`git show ${commit}:'${file}'`));
  const b = lines(readFileSync(file, 'utf8') as string);
  const n = a.length;
  const m = b.length;
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) lcs[i]![j] = a[i] === b[j] ? lcs[i + 1]![j + 1]! + 1 : Math.max(lcs[i + 1]![j]!, lcs[i]![j + 1]!);
  const hunks: string[] = [];
  const removed: string[] = [];
  const added: string[] = [];
  let i = 0;
  let j = 0;
  let open: { start: number; count: number } | null = null;
  const close = (): void => {
    if (open) hunks.push(`@@ -${open.count === 0 ? open.start - 1 : open.start},${open.count} +N`);
    open = null;
  };
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) {
      close();
      i++;
      j++;
    } else if (j >= m || (i < n && lcs[i + 1]![j]! >= lcs[i]![j + 1]!)) {
      open ??= { start: i + 1, count: 0 };
      open.count++;
      removed.push(a[i]!);
      i++;
    } else {
      open ??= { start: i + 1, count: 0 };
      added.push(b[j]!);
      j++;
    }
  }
  close();
  return { hunks, removed, added };
}
/** What P(C, 'src/pages/index.astro') must return: the root's padding, the open menu's, the section anchors' 8px and the demo's radios. */
export const INDEX_GRANT = {
  hunks: ['@@ -309,0 +N', '@@ -320,1 +N', '@@ -421,1 +N', '@@ -425,1 +N', '@@ -429,1 +N', '@@ -433,1 +N', '@@ -437,1 +N'],
  removed: ['scroll-margin-top: 88px;', 'height: 1px;', 'scroll-margin-top: 70px;', 'scroll-margin-bottom: 360px;', 'scroll-margin-bottom: 80px;', 'scroll-margin-bottom: 324px;'],
  added: [
    ':global(html) {',
    'scroll-padding-top: 80px;',
    'scroll-padding-bottom: 12px;',
    '}',
    '@media (max-width: 959px) {',
    ':global(html:has(#menu-panel:not([hidden]))) {',
    'scroll-padding-top: 403px;',
    '}',
    '}',
    'scroll-margin-top: 8px;',
    'height: 81px;',
    'scroll-margin-top: -10px;',
    'scroll-margin-bottom: 268px;',
    'scroll-margin-bottom: -12px;',
    'scroll-margin-bottom: 232px;',
  ],
} as const;
/** What P(C, 'src/pages/[track]/index.astro') must return: the root's 12px below. */
export const TRACK_PAGE_GRANT = {
  hunks: ['@@ -62,0 +N'],
  removed: [],
  added: ['scroll-padding-bottom: 12px;'],
} as const;

/**
 * Gl(C): how `src/styles/global.css` differs from its text at commit `commit`, comments and blank lines left out (job 28, B34):
 * the lines that differ, as [old, new] pairs, and whether the two have as many lines.
 */
export function globalGrant(commit: string): { changed: [string, string][]; sameLength: boolean } {
  const lines = (css: string): string[] =>
    css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l !== '');
  const now = lines(readFileSync('src/styles/global.css', 'utf8') as string);
  const then = lines(git(`git show ${commit}:src/styles/global.css`));
  const changed: [string, string][] = [];
  for (let i = 0; i < Math.max(now.length, then.length); i++) if (now[i] !== then[i]) changed.push([then[i] ?? '', now[i] ?? '']);
  return { changed, sameLength: now.length === then.length };
}
/** What Gl(C) must return: the one declaration of the reduced-motion rule, 0.01ms to 0s, and no other line. */
export const GLOBAL_GRANT = {
  changed: [['transition-duration: 0.01ms !important;', 'transition-duration: 0s !important;']],
  sameLength: true,
} as const;

/** What P(C, 'src/components/SiteHeader.astro') must return (job 29, B42; D25): the focusin rule after the Escape handler. */
export const SITE_HEADER_GRANT = {
  hunks: ['@@ -70,0 +N'],
  removed: [],
  added: ["document.addEventListener('focusin', (e) => {", "if (button.getAttribute('aria-expanded') !== 'true') return;", "if (e.target instanceof Element && e.target.closest('.site-head')) return;", 'setOpen(false);', '});'],
} as const;
