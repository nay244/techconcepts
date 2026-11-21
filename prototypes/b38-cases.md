# B38: spec review (job 29), holes and attack cases

Reviewer, 2026-11-20, from plan.md "Job 29" (decision 4, the B38 row) at a7985bd and S26 (`prototypes/s26-job-29-facts.md` C1 to C7).
Measured in `.superpowers/wt/spec29` (a7985bd): a trial of the removal (`.superpowers/job29/trial-b38-spec.diff`, the layout and
header part; the six files deleted with `git rm`), built and compared with a build of a7985bd. Two builds of the same commit are
byte-identical (`diff -r` of two `dist/` folders prints nothing), so a whole-`dist` comparison is a fair check.

## Holes (worst first)

B38-H1. S26 missed an `overHero` part, and it is in every page's HTML. `src/layouts/BaseLayout.astro:80`, the head's `<noscript><style>`, ends
    with `:root .site-head[data-over-hero] { background: var(--ground); }` (the over-hero header made solid without JavaScript; the
    comment at `SiteHeader.astro:84` refers to it). Left in, `overHero` is not gone; taken out, every one of the 41 chrome pages'
    HTML differs from `revamp` in that inline style, which "only the header's script and style" does not allow as written.
    Answer (one): the rule goes, and the noscript style keeps its other selectors exactly; the allowed difference is listed in H2.
B38-H2. "The built pages differ only by the header's script and style" is not checkable as written: the header's `is:global` style is
    bundled into the shared `_astro/BaseLayout.<hash>.css`, its script into `_astro/SiteHeader.astro_astro_type_script_index_0_lang.<hash>.js`,
    and both file names change, so every page's `<link>` and `<script src>` change too; the minifier also renames the script's
    variables, so the script's text differs on lines that did not change. Measured on the trial: `diff -rq` lists 41 of 42 HTML files
    (only `networking/how-the-internet-works/index.html`, the redirect, is the same) and those two assets, nothing else.
    Answer (one, measured): the comparison is, against a build of B37's merge:
    (a) the same file list in `dist/` except the two renamed assets;
    (b) every HTML file the same once the two asset names are replaced by a placeholder and the noscript rule of H1 is taken out of the old one;
    (c) the CSS asset's rules (split on `}`) the old ones less exactly the four `.site-head[data-over-hero]` rules, none added;
    (d) the script asset contains no `solid`, `scrollY` or `data-over-hero`, and is smaller; what it does is proved by the e2e
        (menu, Escape, theme button: `site-chrome.spec.ts` and `site.spec.ts` in `d1440-dark`).
    Every other file byte-identical (`_headers`, images, every lesson's own assets).
B38-H3. Four unit guards break, not three, and on files the plan does not name. B38 changes `src/layouts/BaseLayout.astro`,
    `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro` (comment) and `src/art/logo.ts` (comment), and these
    name-only diffs list them and must print nothing:
    `src/lib/not-found-page.test.ts:58` (base 1d8e446: `src/layouts`, `SiteHeader.astro`, `SiteFooter.astro`, `src/art`),
    `src/scripts/about-page.test.ts:269` and `src/lib/glossary-page.test.ts:282` (f30e876: `src/layouts`, `SiteHeader.astro`, `SiteFooter.astro`),
    and `src/lib/tracks-render.test.ts:213` (e6441c2: `SiteHeader.astro`, `SiteFooter.astro`).
    Answer (one, job 24's pattern as decision 3 says): each file leaves the name-only lists and gets one grant in
    `src/lib/card-stack-guards.ts` (`git diff -U0 <base> -- <file>`: hunk headers, removed lines, added lines), pinned to exactly
    B38's lines (and, for the files B37 also grants, B37's lines as well), used by every guard that listed the file. Not acceptable:
    dropping a file from a list with no grant, or moving a guard's base commit forward.
B38-H4. Stale words the plan does not list, still naming the deleted files after B38:
    `README.md:44` ("the lesson's top bar (through `src/components/LogoMark.tsx`)"),
    `docs/orchestrator-handbook.md:52` (the merge rule names `src/content/legacy.ts` and `legacy.test.ts` as live collision points) and `:104`
    (batch 5's history, "the comment in `src/content/legacy.ts` ... goes with this job"),
    `src/scripts/theme-toggle.ts:1-4` says the lesson console's button is "the React one (`ThemeToggle.tsx`)": measured, the lesson page
    renders the same Astro `#theme-toggle` (`dist/networking/dhcp/index.html` has one, from `SiteHeader.astro`).
    Answer: README:44 and handbook:52 say what is there; handbook:104 is a job's record and may stay (it says "goes with this job");
    `theme-toggle.ts`'s comment says it wires the one theme button there is, the header's, on every page with the header (the lesson's included).
    `docs/direction.md:445` and `docs/superpowers/plans/*` are records; they stay.
B38-H5. `SiteHeader.astro:84`'s comment goes with the code it describes; `:88` ("Without JavaScript it cannot work, so BaseLayout's
    <noscript> style hides it") stays true and stays. `card-stack.css:199` names `ThemeToggle.css`, which is live: it stays (and
    `card-stack.css` lines are pinned by `cardStackGrant`: any edit there is red in four guards).

## Attack cases

### The removal

1. Every `overHero` part goes, nothing near it. Right build: `grep -rn "overHero\|over-hero\|solidOnScroll\|site-head'" src` prints nothing;
   `BaseLayout.astro`'s Props, its destructuring and the `<SiteHeader current={current} />` call keep every other prop
   (`title, description, image, imageAlt, chrome, main, current, canonical, footer`) in their order.
   Wrong build to catch: the destructuring keeps `overHero = false` (unused, `astro check` may not flag it), or the noscript rule stays (H1).
2. The header's other `<script>` work survives: the menu opens and closes, a link in the panel closes it, Escape closes it and focuses
   `#menu`, the theme button wires. Check: `site-chrome.spec.ts` (cases 15, 50, 51, the theme cases) and `site.spec.ts` green in `d1440-dark`.
   Nearest wrong build: the regex that cut `solidOnScroll` also cut the theme block (`const themeButton ...`): `#theme-toggle` keeps
   `aria-label="Switch theme"` forever; `site-chrome.spec.ts`'s `headerReady` times out on every page.
3. The CSS removal stops at the over-hero rules. Right build: the four rules `.site-head[data-over-hero] {…}`, `….solid, …:has(.menu-panel…) {…}`,
   `… .icon-btn {…}`, `… .icon-btn:hover {…}` go; `.menu-btn, .menu-panel { display: none; }` before them and the rule after them stay.
   Check: H2 (c), the CSS asset's rule list less exactly those four.
4. Six files deleted, and only those: `src/scripts/site-head.ts`, `site-head.test.ts`, `src/components/ThemeToggle.tsx`,
   `ThemeToggle.test.tsx`, `LogoMark.tsx`, `LogoMark.test.tsx`. Live and kept: `ThemeToggle.css` (imported at `SiteHeader.astro:3`),
   `src/scripts/theme-toggle.ts` and its test, `src/art/logo.ts`, `logo.test.ts`, `scripts/og-image.test.mjs`.
   Check: `git diff --name-status revamp...job29/b38 | grep ^D` lists the six; `npm test` file count falls by exactly 3.
   Nearest wrong build: deleting `ThemeToggle.css` because its React user went; the header loses its button styles
   (`site-chrome.spec.ts` 43, forced colours, border 2px on `#theme-toggle`, goes red).
5. `logo.test.ts` does not import `LogoMark`; if a shape test moved there from `LogoMark.test.tsx` is wanted, it tests `logoMark()`'s SVG,
   not React. Check: `npm test` green with no `react` import in `src/art`.

### The words

6. `SiteFooter.astro:5-6` says what is there: the footer is the layout's, after `main` (BaseLayout), and the role is said outright
   (a `<footer>` that is a direct child of `body` would be contentinfo anyway; say why the role stays, or that it is belt and braces). No
   "split", no "inside main". Line 4 (the `.brand` rules come with SiteHeader) is true and stays.
   Check: `grep -n "split\|inside main" src/components/SiteFooter.astro` prints nothing; `track-page-render.test.ts:188-190`
   (no `\bsplit\b` in `src/pages`, `src/layouts`, `src/styles`) still green.
7. `src/art/logo.ts:21`: the React mark goes from the sentence; the list of users is the header, the footer, the favicon and the share
   image (`SiteHeader.astro:2`, `SiteFooter.astro:2`, `scripts/generate-favicon.mjs:6`, `scripts/generate-og-image.mjs:10`).
   The favicon test (`public/favicon.svg` against the drawing) and `scripts/og-image.test.mjs` unchanged and green.
8. The handbook (`docs/orchestrator-handbook.md:16`) and the author's brief (`docs/briefs/author-lesson.md:27`) stop naming
   `src/content/legacy.ts`: the brief's bullet goes whole (both files it names are gone); the handbook says the legacy path was removed
   in job 9 (`925d15d`). Check: `grep -rn "legacy\.ts\|legacy\.test" docs/orchestrator-handbook.md docs/briefs` prints at most
   handbook:104's record (H4). `docs/briefs/analyst-report.md:3` and `.claude/agents/author.md:9` say "legacy shape", a name for the
   pre-citation lesson, not the file: they stay.
9. No word a reader sees changes. Check: H2 (b), every HTML page the same once the asset names and the noscript rule are set aside.

### The guards (H3)

10. Each guard still guards. With B38's change only, `npx vitest run src/lib/not-found-page.test.ts src/scripts/about-page.test.ts
    src/lib/glossary-page.test.ts src/lib/tracks-render.test.ts src/lib/track-page-render.test.ts` is green; then, one at a time:
    add `/* x */` to `SiteHeader.astro`'s style, add a prop to `BaseLayout.astro`, change a word in `SiteFooter.astro`'s markup,
    change a word in `logo.ts`'s code: each run red in every guard that listed that file.
11. The grants hold B37's lines too (B38 runs after B37's merge): `index.astro`, `[track]/index.astro` and `tracks.astro` grants
    unchanged by B38. Check: `git diff job29/int...job29/b38 -- src/lib/card-stack-guards.ts` adds, removes no B37 grant line.
12. Test 61 at `not-found-page.test.ts:116` (no `expect(` dropped from four files since 1d8e446) is green: B38 deletes whole test files
    but none of those four.

### The checks

13. `npm test`; `npm run build` (astro check passes with the prop gone: no page passes `overHero`, measured `grep -rn overHero src/pages`);
    `site-chrome.spec.ts` and `site.spec.ts` in `d1440-dark`; the build comparison of H2, run and pasted in the report.
14. Budgets: `npm run build`'s budget table, every chrome page's script and CSS the same or smaller than B37's.
