# S26 facts for job 29 (read-only scout, revamp at e9d0fe2)

Method: Grep and read only; no build, no e2e, no tracked file changed. Line numbers are from the working tree at e9d0fe2.

## A. Home's root scroll padding

### A1. Who sets `scroll-padding` on `html`

- Home sets none. `src/pages/index.astro` has no `scroll-padding` and no `scroll-margin` on `html` (grep of `src`, `e2e`, `scripts` for `scroll-padding` lists no Home file). Its `:global(html)` rule sets only `scroll-behavior: smooth` (`src/pages/index.astro:330-336`, `prefers-reduced-motion` at 333-335 sets `auto`).
- `src/styles/card-stack.css`, `src/styles/global.css` (`html` at 48-51 sets only `-webkit-text-size-adjust` and `text-size-adjust`), and `src/components/site.css` set no `scroll-padding`.
- Comparison (every `scroll-padding` in `src`):
  - Tracks, `src/pages/tracks.astro:111-113` comment: "The 68px sticky header must not hide what has keyboard focus (WCAG 2.4.11): the root keeps 80px (the header, and room for the focus ring) above anything scrolled into view on this page. The cards' margin is the 114px Home's links need (the header, the 34px tab, 12px of air) less that, so the anchors land where they always have." Rule `:global(html) { scroll-padding-top: 80px; }` at 114-115. Comment `tracks.astro:117`: "While the header's menu is open (below 960px) it is 329px on this page; the root keeps that and 12px above what has focus, as the track page does." `@media (max-width: 959px)` at 118, `html:has(#menu-panel:not([hidden]))` `scroll-padding-top: 341px` at 119-120. No bottom padding.
  - Track page, `src/pages/[track]/index.astro:82-84` comment: "...the root keeps 80px above anything scrolled into view ... its height, 329px at 320 to 959 wide on this page, plus 12px." `:global(html) { scroll-padding-top: 80px }` at 85-87; `@media (max-width: 959px)` at 88, `341px` at 90. No bottom padding.
  - About, `src/pages/about.astro:253-257`: comment "Keyboard focus and every anchor stop clear of the 68px sticky header (as /tracks), and a focus ring clear of the window's foot." `html { scroll-padding-top: 80px; scroll-padding-bottom: 12px; }` at 254-256 (rule lines 255-256). Comment 258-259: "...the header is 391px tall on this page (five links and Start learning): its height plus 12px." `@media (max-width: 959px)` 260-261; `scroll-padding-top: 403px` at 262.
  - Glossary, `src/pages/glossary.astro:48-50` comment: "...as /tracks and the track pages, E11...the page's scroll padding is the header's, each thing that can be scrolled to adds the bar's." Rule line 50: `html { scroll-padding-top: 80px; scroll-padding-bottom: 12px; }`. Comment 51: "The open menu is 391px tall below 960px only ... so the 403px goes with the media query." Line 52-53: `@media (max-width: 959px)` / `html:has(#menu-panel:not([hidden])) { scroll-padding-top: 403px; }`.
  - 404, `src/pages/404.astro:36-37` comment: "Keyboard focus stays clear of the sticky header, as on Tracks, the track page, About and the Glossary. 403px is the open header on this page (391px) plus 12px." Rule 39-41: `scroll-padding-top: 80px; scroll-padding-bottom: 12px;`. `@media (max-width: 959px)` at 43, `403px` at 44.
  - Lesson, `src/lesson/console.css:42-46`: `:root:has(.console) { scroll-padding-top: 69px; }` with comment "The site's header is sticky and 69px tall ...".
- The numbers: 80 = the 68px sticky header plus room for the ring (tracks.astro:111-112; 404.astro:36). 341 = 329px open header (track page `[track]/index.astro:82-84`, tracks.astro:117) plus 12. 403 = 391px open header (about.astro:258-259, 404.astro:37) plus 12. 12 = bottom air (about.astro:255-256, glossary.astro:50, 404.astro:40). The 329 and 391 are the open-menu header heights the comments state; the 114 is `tracks.astro:112`.

### A2. Tests that pin Home's lack of it

- Unit: none reads Home's style for scroll padding. `src/lib/home.test.ts:329-375` reads `src/pages/index.astro` but scans for colour values and named strings only.
- e2e, the explicit pins of Home as `auto`:
  - `e2e/tracks-card-stack.spec.ts:642-650`: test "the root scroll-padding-top is 80px on /tracks and on both track pages, 69px on a lesson (the site header, E14), auto elsewhere"; line 649 `for (const path of ['/']) expect(await padding(path), path).toBe('auto');`.
  - `e2e/glossary.spec.ts:434-444`: test "the scroll padding is the Glossary's alone: 80px and 12px here, auto on Home, 80px on Tracks, 69px on a lesson"; line 443 `expect((await padding('/'))[0]).toBe('auto');`.
- e2e, keyboard walks on Home (`e2e/site-chrome.spec.ts`):
  - Walk cases 44 to 49 loop over `WALK_PAGES` at lines 952-958; Home is `{ path: '/', label: 'Home', strict: 'none' }` at line 958. The walk's test is at 961 (`test(\`44 to 49: the keyboard walk on ${label}, closed and open\``). Its checks at 976-979: `// E6, E7: at the window's foot and on Home the faults are counted in the report, not asserted.` then `if (strict !== 'none') expect.soft(t.under, ...)`; `if (strict === 'all') expect.soft(t.cutFoot, ...)`; `if (strict === 'none' && !menuOpen) expect.soft(all.filter((s) => s.where === 'foot' && s.under).length, ...).toBe(0)`.
  - So Home's "stops under the header" counts are not asserted (`strict: 'none'`), only logged (`console.log` at 972 `WALK ...`), and its stop names and order are pinned by `e2e/site-chrome-stops.ts` (the `"Home WxH open|closed"` keys; names only, no under counts).
  - `e2e/site-chrome.spec.ts:1124-1141` case 55 walks `/about` and `/tracks` only (list at 1126), and asserts the first stop of main is not under the header.
- Counts 23 and 1 → 2: no test asserts them. They are recorded in `docs/direction.md:152` (2.125: "Home has no root scroll padding, so with the menu open 23 focus stops land under the header at 320") and `docs/direction.md:153` (2.126: "Home at 375 with the menu closed has one more focus stop under the header (1 → 2, from Home's missing scroll padding)"). Tracks' numbers, same line: "9 / 4 / 2 / 2 → 0 at 320 / 375 / 390 / 959".

### A3. scroll-margin on Home

- `src/pages/index.astro:348-349`: `section[id] { /* Clear of the sticky header when a link lands here. */ scroll-margin-top: 88px; }`.
- `src/pages/index.astro:456-459` comment on the radio inputs: "...focusing it (a tap on a label does) scrolls nowhere when that place is on screen, and only as far as that place when it is not. The top margin is the header's height, and no more." Rules: `.demo__in { scroll-margin-top: 70px; }` at 467; `.demo__in--part { scroll-margin-bottom: 360px; }` at 472; `.demo__in--step { scroll-margin-bottom: 80px; }` at 477 (comment at 474 "the top of the narration, clear of the phone's Next bar"); `.demo__in--answer { scroll-margin-bottom: 324px; }` at 482 (comment at 479 "the question, its three answers and the hint below them.").
- Home's cards: none. The Home track cards are linked to `/tracks#<id>` (`src/lib/home.test.ts:124`), and Tracks carries the margins: `tracks.astro:111-113` (quoted in A1) and `tracks.astro:124-125` `.panel { scroll-margin-top: 34px; scroll-margin-inline: 16px; }`.
- What the `tracks.astro` comment says Home's links need: "The cards' margin is the 114px Home's links need (the header, the 34px tab, 12px of air) less that" (`tracks.astro:112-113`). 114 = 68 header + 34 tab + 12 air; the Tracks root is 80, so the card margin is 114 - 80 = 34 (`tracks.astro:124`).
- Tests: `e2e/tracks-card-stack.spec.ts:680-684`: describe "Home's links land the card with its tab clear of the header", loops over `/tracks#how-the-internet-works`, `#networking`, `#comptia-a-plus`.

### A4. Unit guards that would fail if `src/pages/index.astro` gains a rule

- Git-diff guards (mechanism: `git diff --name-only <commit> -- <files>` must print nothing, so any change to the file since that commit fails):
  - `src/lib/not-found-page.test.ts:54` describe "0. what the build may not change"; test "1: the shared files are untouched" (line 56) runs `git diff --name-only ${BASE} -- src/pages/index.astro 'src/pages/[track]' ...` with `BASE = '1d8e446'` (line 17) and expects `''` (line 59 area).
  - `src/scripts/about-page.test.ts:253` test "card-stack.css changes only its opening comment ..."; line 269 runs `git diff --name-only f30e876 -- src/pages/index.astro 'src/pages/[track]' ...` and expects `''`.
  - `src/lib/glossary-page.test.ts:276-283` test "Home, the track pages, the header, the footer and the tokens are untouched ..."; line 282 runs the same diff against `f30e876` and expects `''`.
  - Current state: `git diff --name-only 1d8e446 -- src/pages/index.astro` and the same against `f30e876` both print nothing (run on e9d0fe2), so these pass today.
- Colour scan: `src/lib/home.test.ts:329-337` reads `src/pages/index.astro` and expects `colourValues(homeCode(page))` to equal `[]`. `homeCode` (`home.test.ts` top, the frontmatter plus the `<style>` onward) is scanned for hex, rgb, hsl and named colours only, so a `scroll-padding` rule with no colour would not fail it.
- `src/lib/home.test.ts:365-375`: "Home no longer declares what moved to the shared Card stylesheet": checks for `--cs-edge:`, `--anatomy-hi:`, the `.leg {` and other strings, and `a:not(.btn):focus-visible`. A new scroll rule would not fail it.
- `src/lib/home-page.test.ts:11` renders `Home` via the component and checks `main` text and the demo (lines 26-104); it reads no style text, so a new rule would not fail it.
- `src/styles/card-stack.css` head (`card-stack.css` lines 1-4, asserted by `not-found-page.test.ts`, `about-page.test.ts` and `track-page-render.test.ts` via `src/lib/card-stack-guards.ts`) names `src/pages/index.astro` as an importer (`card-stack-guards.ts` `CARD_STACK_GRANT` / the `head` check at `not-found-page.test.ts:83` list it). Not affected by an index.astro rule.
- `src/lib/card-stack-guards.ts`: `cardStackGrant`, `tracksGrant`, `globalGrant` read only `card-stack.css`, `tracks.astro` and `global.css` (lines 18-96); none reads `index.astro`.
- `tracks-render.test.ts:207-214` checks which files import `card-stack.css` (including `src/pages/index.astro`); a Home rule would not change that list.
- e2e that would fail: `e2e/tracks-card-stack.spec.ts:649` (`'/'` must be `auto`) and `e2e/glossary.spec.ts:443` (`padding('/')[0]` must be `'auto'`). The Home walks (`e2e/site-chrome.spec.ts:44-49`, `strict: 'none'`) pin names and order (`e2e/site-chrome-stops.ts`), not under-counts, so a scroll-padding rule would change their logged counts but not their pins.

## B. Bottom padding on Tracks and the track pages

### B1. Bottom padding set by these pages

- Tracks: `src/pages/tracks.astro:66-68` `.tp { padding-top: clamp(32px, 4vw, 48px); padding-bottom: 8px; /* the footer keeps its own space above it */ }`. No `scroll-padding-bottom` anywhere in `tracks.astro`.
- Track page: `src/pages/[track]/index.astro:94-96` `.tk { padding-top: clamp(24px, 3vw, 40px); padding-bottom: 8px; }`. No `scroll-padding-bottom`.
- `main` and body: `src/styles/global.css:53-63` `body { display: flex; flex-direction: column; min-height: 100vh; margin: 0; ... }` and `global.css:66-68` `main { flex: 1; }`. No padding on `main` or `body` in `global.css`, `site.css` or `card-stack.css` (grep for `padding` under `main`/`body`/`html` in those files gives none). `src/layouts/BaseLayout.astro:101` renders `<main id="main">` with no class or style.
- Only the `html` padding of About (`about.astro:255-256`), the Glossary (`glossary.astro:50`) and the 404 (`404.astro:40`) sets `scroll-padding-bottom: 12px`.
- Home sets no bottom padding either (`index.astro` has no `padding-bottom` on `html`, `body` or `main`).

### B2. E2E tests that assert footer rings at the foot, and the skips

- Direction erratum E6 (`docs/direction.md:152`, quoted): "rings at the window's foot asserted only where the page has bottom padding, and Home's `main` stops under the header counted, not pinned (E6, E7)".
- `e2e/site-chrome.spec.ts:952-958` `WALK_PAGES`: `{ path: '/about', label: 'About', strict: 'all' }` (line 953), `{ path: '/does-not-exist', label: '404', strict: 'all' }` (954), `{ path: '/tracks', label: 'Tracks', strict: 'no-foot' }` (955), `{ path: '/networking', label: 'networking', strict: 'no-foot' }` (956), `{ path: '/how-the-internet-works', label: 'how-the-internet-works', strict: 'no-foot' }` (957), `{ path: '/', label: 'Home', strict: 'none' }` (958).
- The assertions, `e2e/site-chrome.spec.ts:974-979` (the walk test starts at 961):
  - `// E6, E7: at the window's foot and on Home the faults are counted in the report, not asserted.` (976)
  - `if (strict !== 'none') expect.soft(t.under, ...)` (977)
  - `if (strict === 'all') expect.soft(t.cutFoot, ...).toBe(0);` (978). This is the footer ring at the window's foot, and it is skipped for `no-foot` pages (Tracks, networking, how-the-internet-works) and for Home.
  - `if (strict === 'none' && !menuOpen) expect.soft(all.filter((s) => s.where === 'foot' && s.under).length, ...)` (979)
- `e2e/site-chrome.spec.ts:985` and `:996`: the Glossary walk (test 45, `test('45: the Glossary’s walk ...')` at 985) asserts `expect(t.cutFoot, ...).toBe(0)` without a skip; the Glossary has 12px bottom padding.
- Other footer-adjacent checks: `e2e/tracks-card-stack.spec.ts:655-672` (Shift+Tab from `.site-foot a` on `/tracks`, 4 widths) checks only `r.top < r.head` (the header) and never the bottom. `e2e/about.spec.ts:820-885` (`focusRead`, `expectClear`) asserts `clearBottom` for main stops; its walk stops at the footer (`about.spec.ts:851` `if (...closest('footer') != null)) break;`), so footer rings are not in its assertions. `e2e/track-page-card-stack.spec.ts:1085-1163` does the same (break at 1110), asserting `clearBottom` for `main` stops only (1143, 1147, 1163).
- So footer rings "at the foot" are asserted only by `site-chrome.spec.ts:978` (About, 404) and `:996` (Glossary). Tracks, networking, how-the-internet-works, and Home are not asserted (line 978 skip, and 977 / 979 for Home).

### B3. Unit tests pinning the Tracks and track-page style blocks

- Track page, `src/lib/track-page-render.test.ts:186-200`:
  - Line 188-190: "the page asks for no split, no footer={false} and no Footer of its own; the layout has no split prop"; `expect(page).not.toMatch(/\bsplit\b|footer=\{false\}|SiteFooter|routebox/)`.
  - Line 194-200: "the scroll padding is 80px, and 341px only while the menu is open below 960px (H10)": regexes at 196-197 pin `:global(html) { scroll-padding-top: 80px;` and the 959px media block with `scroll-padding-top: 341px;`.
  - Lines 63-64: "The footer is the layout's, after main"; `expect(main().nextElementSibling!.matches('footer.site-foot')).toBe(true);`.
  - Line 209: `cardStackGrant('1d8e446')` (the shared sheet). `tracksGrant` is imported at line 18 but not called in this file (grep `tracksGrant(` finds no call).
- Tracks, exact grant: `src/lib/card-stack-guards.ts:57-73`: `tracksGrant(commit)` returns the `git diff -U0` hunks, removed lines and added lines of `src/pages/tracks.astro`; `TRACKS_GRANT` (line 69-75) = `hunks: ['@@ -116,0 +N']`, `removed: []`, `added: ['@media (max-width: 959px) {', ':global(html:has(#menu-panel:not([hidden]))) {', 'scroll-padding-top: 341px;', '}', '}']`.
  - Pinned by: `src/lib/not-found-page.test.ts:70-73` (against `BASE` 1d8e446), `src/lib/glossary-page.test.ts:278-281` (against `f30e876`), `src/scripts/about-page.test.ts:260-263` (against `f30e876`). Each expects exactly that one insertion, nothing removed.
- Track page and Tracks, `git diff --name-only` guards: `not-found-page.test.ts:58`, `glossary-page.test.ts:282`, `about-page.test.ts:269` each list `'src/pages/[track]'` and expect no change; so any edit to the track page fails three tests. Tracks is not in those lists; its edits go through `tracksGrant`.
- `src/lib/tracks-render.test.ts` tests the page's text and structure. Its style-related assertions are the `shadow-sm` / `task 8` / `.isl` / `scroll-snap` / `pl-1` / `var(--link)` absences (lines 217-224) and no style-block equality.
- Conclusion for the orchestrator: a bottom padding on Tracks or the track page would need a new grant (`TRACKS_GRANT` in `card-stack-guards.ts:69-75` for Tracks; for the track page, the `'src/pages/[track]'` entries in the three git-diff tests above) plus `track-page-render.test.ts:196-197` if the scroll block changes. Those files are facts only; I did not change anything.

## C. Dead code

### C1. `overHero`
- Declared and passed: `src/layouts/BaseLayout.astro:29` (prop), `:46` (`overHero = false` default), `:99` (`<SiteHeader current={current} overHero={overHero} />`).
- Declared and used: `src/components/SiteHeader.astro:9-10` (doc: "Home: the header sits over the hero, clear at the top of the page and solid once it scrolls (home-v6)"), `:13` (destructure), `:29` (`data-over-hero={overHero ? '' : undefined}`), `:84` comment ("Home's header turns solid once the page has scrolled a little"), `:85` (`document.querySelector('.site-head[data-over-hero]')`), `:164-183` CSS (`.site-head[data-over-hero]`, `.solid`, `:has(.menu-panel...)`, `.icon-btn`).
- No page passes it: `grep overHero src/pages` returns 0 lines. No test or e2e file references it. Repo-wide, the only other mentions are in `prototypes/d7-practice-site.md:315` ("`overHero` is dead code ... no page uses it") and `prototypes/s25-header-footer-facts.md:41, 77`.

### C2. `src/scripts/site-head.ts`
- Imported by a page's script: `src/components/SiteHeader.astro:61` (`import { solidOnScroll } from '../scripts/site-head';`, inside the header's `<script>`). Runs at lines 85-86 only `if (head)`, where `head` is `.site-head[data-over-hero]`, which no page renders. So in source the function is shipped with every chrome page and never runs. (Built output not checked; I did not build.)
- Test: `src/scripts/site-head.test.ts:3` (`import { solidOnScroll } from './site-head';`).
- `site-head.ts` line 1 comment: "Home's header sits clear over the hero and turns solid once the page has scrolled a little (SiteHeader.astro)."

### C3. `src/components/ThemeToggle.tsx` (dead), with its CSS and script
- `ThemeToggle.tsx`: imported by no source file except its test, `src/components/ThemeToggle.test.tsx:8` (`import ThemeToggle from './ThemeToggle';`). Other mentions are comments: `ThemeToggle.tsx:12` (its own), `src/scripts/theme-toggle.ts:3` ("(src/components/ThemeToggle.tsx); both read and write the same two things ..."). No e2e file loads it. The header's button is the Astro one: `src/components/SiteHeader.astro:39` `<button type="button" class="icon-btn theme-toggle" id="theme-toggle" ...>`.
- `ThemeToggle.css`: live. Imported by `src/components/SiteHeader.astro:3` (`import './ThemeToggle.css';`) and by `ThemeToggle.tsx:5`. No test imports it. `src/styles/card-stack.css:199` names it in a comment ("ThemeToggle.css ... are the base").
- `src/scripts/theme-toggle.ts`: live. Imported by `SiteHeader.astro:62` (`import { wireThemeToggle } from '../scripts/theme-toggle';`) and called at `SiteHeader.astro:89-90`. Test: `src/scripts/theme-toggle.test.ts:4`. Its comment at line 3 names the dead `ThemeToggle.tsx`.

### C4. `src/components/LogoMark.tsx` (dead) and `src/art/logo.ts` (live)
- `LogoMark.tsx`: imported only by `src/components/LogoMark.test.tsx:5` (`import LogoMark from './LogoMark';`). Its own import of the art is `LogoMark.tsx:1` (`import { LOGO_ACCENT, LOGO_BOX, LOGO_SHAPES } from '../art/logo';`). Its comment `LogoMark.tsx:4-5` says it draws "the same three shapes as `logoMark()` in src/art/logo.ts, which the Astro header and footer use" (accurate: see below).
- `src/art/logo.ts`: live. Imported by `src/components/SiteHeader.astro:2` (`logoMark`), `src/components/SiteFooter.astro:2` (`logoMark`), `scripts/generate-favicon.mjs:6` (`logoTile`), `scripts/generate-og-image.mjs:10` (`LOGO_SHAPES, LOGO_BOX`), `src/components/LogoMark.tsx:1`. Tests: `src/art/logo.test.ts` (own), `src/components/LogoMark.test.tsx:4`, `scripts/og-image.test.mjs:4`. Comments: `logo.ts:21` ("The React mark (src/components/LogoMark.tsx) draws these too"), `src/styles/global.css:19` ("(src/art/logo.ts)").

### C5. Stale comments
- `src/components/SiteFooter.astro:4-6` (quoted exactly):
  - line 4: "// The brand rules (.brand) come with SiteHeader, which always renders alongside this."
  - lines 5-6: "// The role is said outright: a split page (the track page) renders this footer at the end of its scrolling route, / inside main, where a plain <footer> would stop being the page's contentinfo landmark."
  - Line 4 is still true (`src/components/SiteHeader.astro:110` `.brand {`). Lines 5-6 describe a "split" page with the footer inside `main`. What is there: `BaseLayout.astro:101-107` renders `<main id="main"><slot/></main>` and then `{footer && <SiteFooter />}` outside it, and the track page uses the default (`[track]/index.astro:59` `<BaseLayout title=... current="tracks" ...>`, no `footer=` prop). `src/lib/track-page-render.test.ts:63-64` asserts "The footer is the layout's, after main" (`main().nextElementSibling!.matches('footer.site-foot')`), and `:188-190` asserts the track page has no `split`, `footer={false}` or `SiteFooter`. The `role="contentinfo"` (`SiteFooter.astro:9`) is still on the element.
- `src/components/SiteHeader.astro:9` and `:84` describe Home's solid-on-scroll header that no page now uses (see C1).
- `src/art/logo.ts:21` mentions `src/components/LogoMark.tsx`, which only a test imports (C4).
- `src/scripts/theme-toggle.ts:3` mentions `src/components/ThemeToggle.tsx` (C3).

### C6. Tests that import each dead file
- `overHero`: none.
- `src/scripts/site-head.ts`: `src/scripts/site-head.test.ts:3`.
- `src/components/ThemeToggle.tsx`: `src/components/ThemeToggle.test.tsx:8`.
- `src/components/LogoMark.tsx`: `src/components/LogoMark.test.tsx:5`.
- The live files, for contrast: `src/scripts/theme-toggle.ts` (`src/scripts/theme-toggle.test.ts:4`), `src/art/logo.ts` (`src/art/logo.test.ts`, `src/components/LogoMark.test.tsx:4`, `scripts/og-image.test.mjs:4`), `ThemeToggle.css` (no test).

### C7. The legacy lesson path
- `git cat-file -e HEAD:src/content/legacy.ts` fails: the file is not in HEAD. `ls src/content/legacy.ts` says no such file.
- `git log --diff-filter=D --format='%h %ad %s' -- src/content/legacy.ts`: `925d15d Fri Nov 13 2026 ... refactor: the legacy lesson path, its closed list and the not-checked exemption are gone (job 9, B7)`. `git log --oneline -- src/content/legacy.ts` lists earlier commits that changed the list (e.g. `45382d3`, `fc5647c`, `bd47046`, `8b7d504`, `9abb179`).
- `docs/orchestrator-handbook.md:16` (quoted): "the legacy list (`src/content/legacy.ts`) is empty. Its path is dead code, to remove in a unit of its own (`plan.md`, \"After this job\")." Stale on the first count: the file is gone since `925d15d`. `plan.md` has no "legacy" and no "After this job" heading (grep -i returns nothing for "legacy" in `plan.md`). `plan.md:70` instead names "the dead code of 2.126".
- Remnants (grep `legacy`, `notChecked`, `isLegacy`, `LEGACY_`, `defineLegacyLesson`, `Unchecked` in `src`, `scripts`, `e2e`, `docs/content-model.md`):
  - `src/progress/store.ts:7` `export const LEGACY_PROGRESS_KEY = 'techconcepts:v1';`, used at `store.ts:241, 250, 256` (stored-progress migration, not the lesson path). Also `src/progress/useProgress.ts:4, 67`, `src/test/progress.ts:1,22` and tests.
  - `docs/content-model.md:173` is the record of the removal ("The legacy path ... was removed in job 9, B7").
  - No `notChecked`, `isLegacy`, `defineLegacyLesson` anywhere in these folders. `src/content/registry.ts:236` and `src/lib/checked.test.ts:25-28` use "unchecked" in other senses.
  - Outside the four folders: `docs/briefs/author-lesson.md:27` still tells the author to edit "`src/content/legacy.ts`: your slug's line goes. `src/content/legacy.test.ts`: the count in the title". That file does not exist, so this brief is stale. `docs/briefs/analyst-report.md:3` uses "legacy shape" as the name of the pre-citation shape (prose).
  - NIST URLs containing `Legacy/SP` (e.g. `src/content/sources.ts:2177`) are the publisher's path, not this path.

## D. E2E specs that load each file's page

Matching is by the path string each spec visits (`visit`, `open`, `goto`, or a path list). A few hits are incidental (a link target, a list of routes); each is marked. Counts are not exhaustive for the lesson specs that only navigate lesson URLs under `/networking/`.

- `src/pages/index.astro` (Home): `e2e/about.spec.ts:80, 412`; `e2e/card-stack-home.spec.ts:19-88` (whole file, Home); `e2e/glossary.spec.ts:443` (scroll padding only); `e2e/lesson-layout.spec.ts:546`; `e2e/nat.spec.ts:96` (loop over `/`); `e2e/og-image.spec.ts:45` (request to `/`); `e2e/site.spec.ts:81` (loop) and many `open(page, '/')` calls from `:91` on; `e2e/site-chrome.spec.ts:15` (`SEVEN`), `:198`, `:273`, `:325`, `:452`, `:559`, `:568`, walk `:958`; `e2e/tracks-card-stack.spec.ts:649` (scroll padding `auto`), `:702` (`open(page, '/')`); `e2e/not-found.spec.ts:146-149, 949` (links to `/`, incidental).
- `src/pages/tracks.astro`: `e2e/about.spec.ts`, `e2e/glossary.spec.ts`, `e2e/lesson-layout.spec.ts`, `e2e/lesson-layout-small.spec.ts`, `e2e/not-found.spec.ts`, `e2e/site.spec.ts`, `e2e/site-chrome.spec.ts` (SEVEN, walk, and case 55 `:1126`), `e2e/tablet.spec.ts`, `e2e/track-page-card-stack.spec.ts`, `e2e/tracks-card-stack.spec.ts` (the main file, incl. `:642-650`, `:655-672`, `:680-684`), `e2e/support.ts`, `e2e/global-setup.ts`.
- `src/pages/[track]/index.astro` (track page, `/networking`, `/how-the-internet-works`): `e2e/track-page-card-stack.spec.ts` (main file; `TRACKS` list, walks `:1085-1163`), `e2e/tracks-card-stack.spec.ts:642-650`, `e2e/site-chrome.spec.ts` (SEVEN, walk rows `:955-957`), `e2e/site.spec.ts:81` and the Track page tests near `:586-761`, `e2e/lesson-layout.spec.ts`, `e2e/tablet.spec.ts`, `e2e/batch1.ts` (list), `e2e/router.spec.ts` (lesson under `/networking/`, incidental).
- `src/pages/about.astro`: `e2e/about.spec.ts` (main file, walks `:820-900`), `e2e/site-chrome.spec.ts` (SEVEN, walk row `:953`, case 55 `:1126`), `e2e/site.spec.ts:81`, `e2e/not-found.spec.ts`, `e2e/glossary.spec.ts`, `e2e/track-page-card-stack.spec.ts` and `e2e/tracks-card-stack.spec.ts` (path string match only; context not read), `e2e/lesson-layout.spec.ts`, `e2e/lesson-layout-small.spec.ts`, `e2e/support.ts`.
- `src/pages/glossary.astro`: `e2e/glossary.spec.ts` (main file, scroll padding `:434-444`, walks `:1047`), `e2e/about.spec.ts`, `e2e/site-chrome.spec.ts` (SEVEN `:15`; test 45, the Glossary walk, `:985`), `e2e/site.spec.ts`, `e2e/not-found.spec.ts`, `e2e/lesson-layout.spec.ts`, `e2e/lesson-layout-small.spec.ts`, `e2e/tracks-card-stack.spec.ts`, `e2e/track-page-card-stack.spec.ts`, `e2e/support.ts`.
- `src/pages/404.astro` (`/does-not-exist`): `e2e/not-found.spec.ts` (main file; scroll padding `:102`, `:427-438` widths, `:464-471`), `e2e/site-chrome.spec.ts` (SEVEN `:15`, walk row `:954`, walks `:961`), `e2e/site.spec.ts:81` (`/this-page-does-not-exist`), `e2e/about.spec.ts`, `e2e/glossary.spec.ts`, `e2e/tracks-card-stack.spec.ts`, `e2e/support.ts`.
- `src/styles/card-stack.css` (linked on the seven Card stack pages: Home, Tracks, track page, About, Glossary, 404): all of the above; main specs `e2e/card-stack-home.spec.ts`, `e2e/tracks-card-stack.spec.ts`, `e2e/track-page-card-stack.spec.ts`, `e2e/about.spec.ts`, `e2e/glossary.spec.ts`, `e2e/not-found.spec.ts`, `e2e/site-chrome.spec.ts`.
- `src/components/SiteHeader.astro`, `SiteFooter.astro`, `src/scripts/site-head.ts`, `src/scripts/theme-toggle.ts`, `src/components/ThemeToggle.css`, `src/art/logo.ts` (all chrome pages; header and footer): `e2e/site-chrome.spec.ts` (`#theme-toggle` at `:39`, `:390-416`, `:1214-1254`), `e2e/site.spec.ts:413-422, 1012-1013`, `e2e/not-found.spec.ts:404, 925`, `e2e/about.spec.ts:286`, `e2e/lesson-layout.spec.ts:68-81, 201`, `e2e/lesson-layout-small.spec.ts:72`, `e2e/track-page-card-stack.spec.ts:266`, `e2e/tracks-card-stack.spec.ts:864`.
- `src/components/ThemeToggle.tsx`, `src/components/LogoMark.tsx`, `overHero`: no e2e spec loads them (no e2e reference to the component; `.theme-toggle` in e2e is the Astro button at `SiteHeader.astro:39`). `overHero` is in no page, so no spec can exercise it.
- Legacy path: no e2e reference.

## Open points for the orchestrator (facts only)
- Home's scroll padding is pinned as `auto` by `e2e/tracks-card-stack.spec.ts:649` and `e2e/glossary.spec.ts:443`; a fix on Home changes both, and changes the `git diff` guards on `index.astro` (A4).
- `tracksGrant` is imported in `src/lib/track-page-render.test.ts:18` but not called there (grep `tracksGrant(` finds no call in that file).
- The handbook (`docs/orchestrator-handbook.md:16`) and `docs/briefs/author-lesson.md:27` still name `src/content/legacy.ts`, which was deleted in `925d15d`.

