import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { afterEach, expect, test } from 'vitest';
import { BUDGETS, checkBudgets, findBreaches, gzipSize, listPages, measurePage, scriptsIn, staticImports } from './check-budgets.mjs';

const SCRIPT = fileURLToPath(new URL('./check-budgets.mjs', import.meta.url));

/**
 * Runs `node` with `args`: the command, then its own arguments.
 * @param {string[]} args
 */
function run(args) {
  const { status, stdout, stderr } = spawnSync(process.execPath, args, { encoding: 'utf8' });
  return { status, stdout, stderr };
}

/** @type {string[]} */
let dirs = [];
afterEach(() => {
  for (const dir of dirs) rmSync(dir, { recursive: true, force: true });
  dirs = [];
});

/**
 * A throwaway `dist` holding `files` (path to contents).
 * @param {Record<string, string>} files
 */
function fixture(files) {
  const dist = mkdtempSync(join(tmpdir(), 'budgets-'));
  dirs.push(dist);
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(dirname(join(dist, path)), { recursive: true });
    writeFileSync(join(dist, path), text);
  }
  return dist;
}

/** @param {string} text */
const gz = (text) => gzipSync(text).length;

/**
 * Text that gzip cannot shrink much: `bytes` random bytes, as base64.
 * @param {number} bytes
 */
const noise = (bytes) => randomBytes(bytes).toString('base64');

/** @param {string} body */
const page = (body) => `<!doctype html><html><head><title>t</title></head><body>${body}</body></html>`;

/**
 * @param {string} component
 * @param {string} renderer
 */
const island = (component, renderer) =>
  `<astro-island uid="x" component-url="${component}" component-export="default" renderer-url="${renderer}" props="{&quot;a&quot;:[0,1]}" client="load"></astro-island>`;

// ---------------------------------------------------------------- pages

test('every page is listed with its route, in route order, and only a page under a track page is a lesson', () => {
  const dist = fixture({
    'index.html': page('home'),
    '404.html': page('lost'),
    'about/index.html': page('about'),
    'networking/index.html': page('track'),
    'networking/dhcp/index.html': page('lesson'),
    'networking/subnetting/index.html': page('lesson'),
    'notes/2026/index.html': page('a page two folders down, with no page above it'),
    '_astro/app.js': 'export {};',
  });
  expect(listPages(dist)).toEqual([
    { file: 'index.html', route: '/', lesson: false },
    { file: '404.html', route: '/404', lesson: false },
    { file: 'about/index.html', route: '/about/', lesson: false },
    { file: 'networking/index.html', route: '/networking/', lesson: false },
    { file: 'networking/dhcp/index.html', route: '/networking/dhcp/', lesson: true },
    { file: 'networking/subnetting/index.html', route: '/networking/subnetting/', lesson: true },
    { file: 'notes/2026/index.html', route: '/notes/2026/', lesson: false },
  ]);
});

test('a lesson page is found whether the build writes each page as a folder or as a file', () => {
  const dist = fixture({
    'index.html': page('home'),
    'networking.html': page('a track page as a file'),
    'networking/dhcp.html': page('a lesson page as a file'),
    'cloud/index.html': page('a track page as a folder'),
    'cloud/vpc.html': page('a lesson page as a file'),
    'security.html': page('a track page as a file'),
    'security/tls/index.html': page('a lesson page as a folder'),
    'notes/2026.html': page('a page one folder down, with no page above it'),
  });
  expect(listPages(dist).map((p) => [p.route, p.lesson])).toEqual([
    ['/', false],
    ['/cloud/', false],
    ['/cloud/vpc', true],
    ['/networking', false],
    ['/networking/dhcp', true],
    ['/notes/2026', false],
    ['/security', false],
    ['/security/tls/', true],
  ]);
});

// ---------------------------------------------------------------- what a page loads

test('scriptsIn finds script sources, island component and renderer URLs, and inline scripts that run', () => {
  const html = page(
    [
      '<script>document.documentElement.dataset.theme = "dark";</script>',
      '<script type="module" src="/_astro/page.js"></script>',
      '<script type="module">import "/_astro/hoisted.js"; console.log(1);</script>',
      '<script type="application/ld+json">{"@type":"WebSite"}</script>',
      island('/_astro/Console.js', '/_astro/client.js'),
    ].join(''),
  );
  expect(scriptsIn(html)).toEqual({
    urls: ['/_astro/page.js', '/_astro/Console.js', '/_astro/client.js'],
    inline: ['document.documentElement.dataset.theme = "dark";', 'import "/_astro/hoisted.js"; console.log(1);'],
  });
});

test('staticImports reads import and export-from statements, minified or not, and leaves dynamic imports alone', () => {
  const code = [
    'import{t as e}from"./react.js";import"./side.js";import x,{y as z}from "./both.js";',
    'export{a}from"./re.js";export*from"./all.js";',
    'const lazy=()=>import("./lazy.js");const u=import.meta.url;',
    "import * as ns from './ns.js'\n",
  ].join('');
  expect(staticImports(code)).toEqual(['./react.js', './side.js', './both.js', './re.js', './all.js', './ns.js']);
});

test('a chain of static imports is followed, each file counted once, through a cycle, and a dynamic import is not', () => {
  const files = {
    '_astro/Console.js': 'import{a}from"./shared.js";import{b}from"./b.js";export default ()=>import("./lazy.js");',
    '_astro/b.js': 'import{a}from"./shared.js";export const b=a+1;',
    '_astro/shared.js': 'import"./Console.js";export const a=1;',
    '_astro/client.js': 'import{a}from"./shared.js";export default a;',
    '_astro/lazy.js': `export const big="${noise(5000)}";`,
  };
  const dist = fixture({
    'networking/index.html': page('track'),
    'networking/dhcp/index.html': page(island('/_astro/Console.js', '/_astro/client.js')),
    ...files,
  });
  const result = measurePage(dist, { file: 'networking/dhcp/index.html', route: '/networking/dhcp/', lesson: true });
  expect(result.files.map((f) => f.url)).toEqual(['/_astro/Console.js', '/_astro/shared.js', '/_astro/b.js', '/_astro/client.js']);
  const counted = ['Console', 'shared', 'b', 'client'].map((name) => gz(files[`_astro/${name}.js`]));
  expect(result.js).toBe(counted.reduce((sum, n) => sum + n, 0));
  expect(result.html).toBe(gz(page(island('/_astro/Console.js', '/_astro/client.js'))));
});

test('an island’s component and renderer are both counted, and a renderer shared by two islands only once', () => {
  const files = {
    '_astro/A.js': 'export default 1;',
    '_astro/B.js': 'export default 2;',
    '_astro/client.js': 'export default function hydrate(){};',
  };
  const html = page(island('/_astro/A.js', '/_astro/client.js') + island('/_astro/B.js', '/_astro/client.js'));
  const dist = fixture({ 'index.html': html, ...files });
  const result = measurePage(dist, { file: 'index.html', route: '/', lesson: false });
  expect(result.files.map((f) => f.url)).toEqual(['/_astro/A.js', '/_astro/client.js', '/_astro/B.js']);
  expect(result.js).toBe(gz(files['_astro/A.js']) + gz(files['_astro/client.js']) + gz(files['_astro/B.js']));
});

test('an inline module script counts itself and the files it imports, resolved from the page’s address', () => {
  const inline = 'import "../_astro/hoisted.js"; document.body.dataset.ready = "yes";';
  const files = { '_astro/hoisted.js': 'import"./dep.js";export {};', '_astro/dep.js': 'export const dep = 1;' };
  const dist = fixture({ 'about/index.html': page(`<script type="module">${inline}</script>`), ...files });
  const result = measurePage(dist, { file: 'about/index.html', route: '/about/', lesson: false });
  expect(result.inline).toEqual([gz(inline)]);
  expect(result.files.map((f) => f.url)).toEqual(['/_astro/hoisted.js', '/_astro/dep.js']);
  expect(result.js).toBe(gz(inline) + gz(files['_astro/hoisted.js']) + gz(files['_astro/dep.js']));
});

test('a script address in the page is read from the page’s own address; an import of a bare name stops the check', () => {
  const dist = fixture({
    'about/index.html': page('<script src="local.js"></script><script type="module">import "react";</script>'),
    'about/local.js': 'window.x = 1;',
  });
  expect(() => measurePage(dist, { file: 'about/index.html', route: '/about/', lesson: false })).toThrow(
    '/about/ imports "react", which is not a path; the build should have bundled it.',
  );
  writeFileSync(join(dist, 'about/index.html'), page('<script src="local.js"></script>'));
  const result = measurePage(dist, { file: 'about/index.html', route: '/about/', lesson: false });
  expect(result.files.map((f) => f.url)).toEqual(['/about/local.js']);
  expect(result.js).toBe(gz('window.x = 1;'));
});

test('a script on another host is listed as external and not counted', () => {
  const dist = fixture({
    'index.html': page('<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon="{}"></script>'),
  });
  const result = measurePage(dist, { file: 'index.html', route: '/', lesson: false });
  expect(result.external).toEqual(['https://static.cloudflareinsights.com/beacon.min.js']);
  expect(result.js).toBe(0);
});

test('a script the page names that is not in dist stops the check, naming the page and the file', () => {
  const dist = fixture({ 'index.html': page(island('/_astro/Gone.js', '/_astro/client.js')), '_astro/client.js': '' });
  expect(() => measurePage(dist, { file: 'index.html', route: '/', lesson: false })).toThrow(
    'index.html loads /_astro/Gone.js, which is not in dist.',
  );
});

test('gzipSize is the size gzip gives at its default level, 6', () => {
  // Words picked by a fixed pseudo-random sequence: text on which levels 1, 6 and 9 give three different sizes.
  const words = ['packet', 'router', 'lease', 'the', 'sends', 'to', 'offer', 'ack', '192.168.1.', 'server'];
  let seed = 7;
  const next = () => (seed = (seed * 16_807) % 2_147_483_647);
  const text = Array.from({ length: 20_000 }, () => `${words[next() % words.length]}${next() % 7 === 0 ? next() % 256 : ''}`).join(' ');
  const sizes = [1, 6, 9].map((level) => gzipSync(text, { level }).length);
  expect(new Set(sizes).size).toBe(3);
  expect(gzipSize(text)).toBe(sizes[1]);
  expect(gzipSize(Buffer.from(text))).toBe(sizes[1]);
});

// ---------------------------------------------------------------- budgets

test('the budgets are 250 KB of HTML on every page and 200 KB of JS on every lesson page, gzipped, 1 KB being 1,000 bytes', () => {
  expect(BUDGETS).toEqual({ html: 250_000, lessonJs: 200_000 });
});

test('findBreaches names each page over a budget, and holds JS to its budget on lesson pages only', () => {
  const rows = [
    { file: 'index.html', route: '/', lesson: false, html: 1000, js: 300_000 },
    { file: 'a/b/index.html', route: '/a/b/', lesson: true, html: 250_001, js: 200_000 },
    { file: 'a/c/index.html', route: '/a/c/', lesson: true, html: 250_000, js: 200_001 },
  ];
  expect(findBreaches(rows)).toEqual([
    { route: '/a/b/', what: 'HTML', size: 250_001, budget: 250_000 },
    { route: '/a/c/', what: 'JS', size: 200_001, budget: 200_000 },
  ]);
  expect(findBreaches(rows, { html: 500, lessonJs: 1_000_000 }).map((b) => b.route)).toEqual(['/', '/a/b/', '/a/c/']);
});

test('checkBudgets measures every page of a dist and finds no breach in one that fits', () => {
  const dist = fixture({
    'index.html': page(island('/_astro/A.js', '/_astro/client.js')),
    'networking/index.html': page('track'),
    'networking/dhcp/index.html': page(island('/_astro/A.js', '/_astro/client.js')),
    '_astro/A.js': 'export default 1;',
    '_astro/client.js': 'export default 2;',
  });
  const { rows, breaches, text } = checkBudgets(dist);
  expect(rows.map((r) => r.route)).toEqual(['/', '/networking/', '/networking/dhcp/']);
  expect(breaches).toEqual([]);
  expect(text).toContain('/networking/dhcp/');
  expect(text).toContain('Every page is within budget (3 pages).');
});

test('a build with no lesson page stops the check, since the JS budget would check nothing', () => {
  const dist = fixture({ 'index.html': page('home'), 'networking/index.html': page('track'), 'notes/2026/index.html': page('no track page above it') });
  const message = `No lesson page in ${dist}, so the lesson JS budget would check nothing. A lesson page is /<track>/<lesson>, under a built /<track> page.`;
  expect(() => checkBudgets(dist)).toThrow(message);
  expect(run([SCRIPT, dist])).toEqual({ status: 1, stdout: '', stderr: `${message}\n` });
});

/** A small site that fits: Home, a track page and one lesson. */
const SMALL = { 'index.html': page('small'), 'networking/index.html': page('track'), 'networking/dhcp/index.html': page('lesson') };

test('the command exits 0 on a dist that fits, and 1 with each breach named on one that does not', () => {
  const fits = run([SCRIPT, fixture(SMALL)]);
  expect(fits.status).toBe(0);
  expect(fits.stdout).toContain('Every page is within budget (3 pages).');

  // 300,000 random bytes as base64 gzip to about 300 KB: past 250 KB of HTML, and past a lesson page's 200 KB of JS.
  const over = fixture({
    'index.html': page(island('/_astro/Big.js', '/_astro/client.js')),
    'networking/index.html': page(''),
    'networking/big/index.html': page(`<p>${noise(300_000)}</p>`),
    'networking/heavy/index.html': page(island('/_astro/Big.js', '/_astro/client.js')),
    '_astro/Big.js': `export default "${noise(300_000)}";`,
    '_astro/client.js': 'export {};',
  });
  const { status, stdout, stderr } = run([SCRIPT, over]);
  expect(status).toBe(1);
  const output = stdout + stderr;
  expect(output).toMatch(/\/networking\/big\/: HTML is [\d.]+ KB gzipped; the budget is 250 KB\./);
  expect(output).toMatch(/\/networking\/heavy\/: JS is [\d.]+ KB gzipped; the budget is 200 KB\./);
  // Home loads the same script, but Home is not a lesson page.
  expect(output).not.toMatch(/^\s*\/: JS/m);
  expect(output).toContain('Over budget (2):');
});

test('the command exits 1, saying so, when there is no built site', () => {
  const missing = join(fixture({}), 'dist');
  expect(run([SCRIPT, missing])).toEqual({ status: 1, stdout: '', stderr: `No built site at ${missing}. Run npm run build first.\n` });
});

test('the command runs when node is given a symlink to it, as a linked bin or a symlinked checkout does', () => {
  const link = join(fixture({}), 'check-budgets.mjs');
  symlinkSync(SCRIPT, link);
  const { status, stdout } = run([link, fixture(SMALL)]);
  expect(status).toBe(0);
  expect(stdout).toContain('Every page is within budget (3 pages).');
});
