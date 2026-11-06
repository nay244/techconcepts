// Checks the built site against its page-weight budgets (launch spec §11, redesign spec §8):
//   - every page's HTML is at most 250 KB gzipped;
//   - on every lesson page, the JavaScript it loads is at most 200 KB gzipped in all.
// A page's JavaScript is every script it runs: its <script src> files, every astro-island's component-url and
// renderer-url, and its inline scripts, plus every file those reach through static import or export-from
// statements, each file counted once. Dynamic import() is not followed: it is not loaded with the page.
// Sizes are gzip at its default level, one file at a time; 1 KB is 1,000 bytes.
//
// Run `npm run build`, then `npm run budgets` (or `node scripts/check-budgets.mjs [dist]`). It prints a table and
// exits with 1 when any page is over a budget, or when the build has no lesson page for the JS budget to check.
import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

/** The budgets, in bytes gzipped. */
export const BUDGETS = Object.freeze({ html: 250_000, lessonJs: 200_000 });

/** Resolves a script's address against a page's; the host is never fetched, it only anchors the path. */
const ORIGIN = 'https://budgets.invalid';

/**
 * @typedef {{ file: string, route: string, lesson: boolean }} Page
 * @typedef {{ url: string, raw: number, gzip: number }} ScriptFile
 * @typedef {Page & { html: number, js: number, files: ScriptFile[], inline: number[], external: string[] }} Measured
 * @typedef {{ route: string, what: 'HTML' | 'JS', size: number, budget: number }} Breach
 * @typedef {{ html: number, lessonJs: number }} Budgets
 */

/**
 * The gzipped size of `data`, in bytes, at gzip's default level.
 * @param {string | Buffer} data
 */
export function gzipSize(data) {
  return gzipSync(data).length;
}

/**
 * The page a built file is: `about/index.html` is `/about/`, `404.html` is `/404`.
 * @param {string} file a path under dist, with `/` between folders
 */
function routeOf(file) {
  if (file === 'index.html') return '/';
  if (file.endsWith('/index.html')) return `/${file.slice(0, -'index.html'.length)}`;
  return `/${file.slice(0, -'.html'.length)}`;
}

/**
 * Every `.html` file under `dir`, as paths relative to `root` with `/` between folders.
 * @param {string} root
 * @param {string} dir
 * @returns {string[]}
 */
function htmlFiles(root, dir = root) {
  return readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return htmlFiles(root, path);
      return entry.name.endsWith('.html') ? [relative(root, path).split(sep).join('/')] : [];
    });
}

/**
 * Every page in `dist`, sorted by route. A lesson page is one at `/<track>/<lesson>` under a track page,
 * `/<track>`, that is itself built: the site's lessons live there, and nothing else does. Either may be built as a
 * folder (`networking/dhcp/index.html`, `/networking/dhcp/`) or as a file (`networking/dhcp.html`,
 * `/networking/dhcp`), as Astro's `build.format` says.
 * @param {string} dist
 * @returns {Page[]}
 */
export function listPages(dist) {
  const files = htmlFiles(dist);
  /** A route's folders and name: `/networking/dhcp/` and `/networking/dhcp` are both `networking`, `dhcp`. */
  const partsOf = (/** @type {string} */ route) => route.split('/').filter(Boolean);
  const tracks = new Set(files.map((file) => partsOf(routeOf(file))).flatMap((parts) => (parts.length === 1 ? [parts[0]] : [])));
  return files
    .map((file) => {
      const route = routeOf(file);
      const parts = partsOf(route);
      const lesson = parts.length === 2 && tracks.has(parts[0]);
      return { file, route, lesson };
    })
    .sort((a, b) => (a.route < b.route ? -1 : a.route > b.route ? 1 : 0));
}

/** Script types a browser runs; no type at all is a classic script. Anything else (JSON data) is not code. */
const RUNNABLE = new Set(['', 'module', 'text/javascript', 'application/javascript']);

/**
 * One attribute's value from a tag's attribute text, or undefined.
 * @param {string} attrs
 * @param {string} name
 */
function attr(attrs, name) {
  const match = new RegExp(`(?:^|\\s)${name}(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+)))?`, 'i').exec(attrs);
  if (match === null) return undefined;
  return match[1] ?? match[2] ?? match[3] ?? '';
}

/**
 * What a page runs: the addresses of the script files it names, in page order (script sources, then each island's
 * component and renderer in turn), and the text of its inline scripts.
 * @param {string} html
 * @returns {{ urls: string[], inline: string[] }}
 */
export function scriptsIn(html) {
  /** @type {{ at: number, urls: string[] }[]} */
  const found = [];
  /** @type {string[]} */
  const inline = [];
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    const attrs = match[1] ?? '';
    if (!RUNNABLE.has((attr(attrs, 'type') ?? '').trim().toLowerCase())) continue;
    const src = attr(attrs, 'src');
    if (src !== undefined && src !== '') found.push({ at: match.index, urls: [src] });
    else if ((match[2] ?? '').trim() !== '') inline.push(match[2] ?? '');
  }
  for (const match of html.matchAll(/<astro-island\b([^>]*)>/gi)) {
    const attrs = match[1] ?? '';
    const urls = ['component-url', 'renderer-url', 'before-hydration-url']
      .map((name) => attr(attrs, name))
      .filter((url) => url !== undefined && url !== '');
    found.push({ at: match.index, urls: /** @type {string[]} */ (urls) });
  }
  return { urls: found.sort((a, b) => a.at - b.at).flatMap((f) => f.urls), inline };
}

/**
 * The specifiers of a module's static imports, in order: `import … from "x"`, `import "x"`, `export … from "x"`
 * and `export * from "x"`, minified or not. `import("x")` and `import.meta` are not static imports.
 * @param {string} code
 * @returns {string[]}
 */
export function staticImports(code) {
  const statement =
    /(?<![\w$.])(?:import\s*(?:[\w$*{}\s,]+?\s*from\s*)?|export\s*(?:\*(?:\s*as\s+[\w$]+)?|\{[^}]*\})\s*from\s*)(["'])([^"'\n]+)\1/g;
  return [...code.matchAll(statement)].map((match) => match[2] ?? '');
}

/**
 * A script address as a path from the site's root, or null for a script on another host. In the page, any address
 * is relative to the page; in a module, an import must start with `/`, `./` or `../`, since a browser cannot load a
 * bare name such as `react`.
 * @param {string} spec
 * @param {string} base the address it is read from: a page's route, or the importing file's path
 * @param {boolean} fromModule
 */
function resolveUrl(spec, base, fromModule) {
  if (/^[a-z][a-z\d+.-]*:|^\/\//i.test(spec)) return null;
  if (fromModule && !/^\.{0,2}\//.test(spec)) {
    throw new Error(`${base} imports "${spec}", which is not a path; the build should have bundled it.`);
  }
  return new URL(spec, `${ORIGIN}${base}`).pathname;
}

/**
 * Measures one page: its HTML gzipped, and the JS it loads, gzipped and summed, each file once.
 * @param {string} dist
 * @param {Page} page
 * @returns {Measured}
 */
export function measurePage(dist, page) {
  const html = readFileSync(join(dist, page.file), 'utf8');
  const { urls, inline } = scriptsIn(html);
  /** @type {ScriptFile[]} */
  const files = [];
  /** @type {string[]} */
  const external = [];
  const seen = new Set();

  /** @param {string} spec @param {string} base @param {boolean} fromModule */
  const load = (spec, base, fromModule) => {
    const url = resolveUrl(spec, base, fromModule);
    if (url === null) {
      if (!external.includes(spec)) external.push(spec);
      return;
    }
    if (seen.has(url)) return;
    seen.add(url);
    const path = resolve(dist, `.${decodeURIComponent(url)}`);
    if (!path.startsWith(resolve(dist) + sep) || !existsSync(path)) {
      throw new Error(`${page.file} loads ${url}, which is not in dist.`);
    }
    const code = readFileSync(path);
    files.push({ url, raw: code.length, gzip: gzipSize(code) });
    for (const next of staticImports(code.toString('utf8'))) load(next, url, true);
  };

  for (const url of urls) load(url, page.route, false);
  const inlineSizes = inline.map((code) => {
    for (const next of staticImports(code)) load(next, page.route, true);
    return gzipSize(code);
  });

  const js = [...files.map((f) => f.gzip), ...inlineSizes].reduce((sum, n) => sum + n, 0);
  return { ...page, html: gzipSize(html), js, files, inline: inlineSizes, external };
}

/**
 * Every budget a page breaks: its HTML on any page, its JS on a lesson page.
 * @param {(Page & { html: number, js: number })[]} rows
 * @param {Budgets} budgets
 * @returns {Breach[]}
 */
export function findBreaches(rows, budgets = BUDGETS) {
  return rows.flatMap((row) => {
    /** @type {Breach[]} */
    const out = [];
    if (row.html > budgets.html) out.push({ route: row.route, what: 'HTML', size: row.html, budget: budgets.html });
    if (row.lesson && row.js > budgets.lessonJs) out.push({ route: row.route, what: 'JS', size: row.js, budget: budgets.lessonJs });
    return out;
  });
}

/** @param {number} bytes */
const kb = (bytes) => `${(bytes / 1000).toFixed(1)} KB`;
/** A budget, which is a whole number of KB. @param {number} bytes */
const budgetKb = (bytes) => `${bytes / 1000} KB`;

/**
 * The report: a table of every page, then the breaches or a line saying there are none.
 * @param {Measured[]} rows
 * @param {Breach[]} breaches
 * @param {Budgets} budgets
 */
export function formatReport(rows, breaches, budgets = BUDGETS) {
  const head = ['Page', 'Lesson', 'HTML', 'JS', 'JS files', 'Inline', 'Result'];
  const body = rows.map((row) => {
    const over = breaches.filter((b) => b.route === row.route).map((b) => `${b.what} over`);
    return [row.route, row.lesson ? 'yes' : 'no', kb(row.html), kb(row.js), String(row.files.length), String(row.inline.length), over.join(', ') || 'ok'];
  });
  const widths = head.map((h, i) => Math.max(h.length, ...body.map((cells) => (cells[i] ?? '').length)));
  const line = (/** @type {string[]} */ cells) =>
    cells.map((cell, i) => (i === 0 || i === cells.length - 1 ? cell.padEnd(widths[i] ?? 0) : cell.padStart(widths[i] ?? 0))).join('  ').trimEnd();

  const out = [
    `Gzipped sizes (1 KB = 1,000 bytes). Budgets: HTML ${budgetKb(budgets.html)} on every page; JS ${budgetKb(budgets.lessonJs)} on every lesson page.`,
    '',
    line(head),
    line(widths.map((w) => '-'.repeat(w))),
    ...body.map(line),
    '',
  ];
  const external = [...new Set(rows.flatMap((row) => row.external))];
  if (external.length > 0) out.push(`Not counted, from another host: ${external.join(', ')}`, '');
  if (breaches.length === 0) {
    out.push(`Every page is within budget (${rows.length} ${rows.length === 1 ? 'page' : 'pages'}).`);
  } else {
    out.push(`Over budget (${breaches.length}):`);
    for (const b of breaches) out.push(`  ${b.route}: ${b.what} is ${kb(b.size)} gzipped; the budget is ${budgetKb(b.budget)}.`);
  }
  return out.join('\n');
}

/**
 * Measures every page in `dist` against `budgets`. Throws when no page is a lesson page: the JS budget would
 * check nothing, and a change to how pages are built or found should not pass for one that fits.
 * @param {string} dist
 * @param {Budgets} budgets
 */
export function checkBudgets(dist, budgets = BUDGETS) {
  const pages = listPages(dist);
  if (!pages.some((page) => page.lesson)) {
    throw new Error(
      `No lesson page in ${dist}, so the lesson JS budget would check nothing. A lesson page is /<track>/<lesson>, under a built /<track> page.`,
    );
  }
  const rows = pages.map((page) => measurePage(dist, page));
  const breaches = findBreaches(rows, budgets);
  return { rows, breaches, text: formatReport(rows, breaches, budgets) };
}

/**
 * Whether node was asked to run this file, rather than a test importing it. Node runs a module from its real path,
 * so the path it was given is followed through any symlink (a linked bin, a symlinked checkout) before comparing.
 */
function isCommand() {
  const given = process.argv[1];
  if (given === undefined || !existsSync(given)) return false;
  return import.meta.url === pathToFileURL(realpathSync(given)).href;
}

// The command: a thin wrapper that prints the report, or why there is none, and sets the exit code.
if (isCommand()) {
  const dist = resolve(process.argv[2] ?? fileURLToPath(new URL('../dist', import.meta.url)));
  if (!existsSync(join(dist, 'index.html'))) {
    console.error(`No built site at ${dist}. Run npm run build first.`);
    process.exitCode = 1;
  } else {
    try {
      const { breaches, text } = checkBudgets(dist);
      (breaches.length === 0 ? console.log : console.error)(text);
      process.exitCode = breaches.length === 0 ? 0 : 1;
    } catch (error) {
      // A page that loads a file the build did not write, an import the build did not bundle, or no lesson page.
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  }
}
