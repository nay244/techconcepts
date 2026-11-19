# D21 cases: the spec review of B26 (the Glossary) and B27 (About), job 22

The spec review of `prototypes/d21-glossary.md` and `.html` (layout 1, Ledger) and `prototypes/d21-about.md` and `.html` (layout 2, Folders), frozen at `d0c312e` (direction 2.112), by `reviewer` (Opus), 2026-11-18, read on `revamp` at `fee2625`. Glossary layout 2 and About layout 1 are not built and are not reviewed, except where a rule of theirs is shared.

Verdict: **HOLES (14)**: 11 with one answer (S1 to S3 for both units, G1 to G5 the Glossary, A1 to A3 About) and 3 that need taste (T1, the Glossary's "All letters" ring under the header; T2 and T3 low stakes). None changes what the owner approved on screen at the drawn widths; G1, G2 and T1 change where focus and its ring land. 95 attack cases: 68 end-to-end that only a real browser can try, 2 end-to-end on the served HTML, 20 unit, 5 on the build. Every acceptance check of both specs is under a case or a hole; the layouts not built (Glossary 2, About 1) have none.

Measured in headless Chromium (Playwright from the main folder's `node_modules`) on the two prototypes served at `localhost:4479`: the Glossary with its `.pbar` removed (layout 1, `#p-l1`), About at `#pl=2&bar=0` (layout 2); fonts loaded; and from the source, the tests and `dist/` (built 2026-11-18 from `revamp`) in the main folder. Keyboard walks are real `Tab` and `Shift+Tab` presses (not `focus()` in tab order), every stop in `main`, read after the scroll had settled; a stop "fails" when the focus ring's box (the element's box grown by 5px: the 2px outline at 3px offset) has its top above the foot of what is stuck, or its foot below the window's, or `elementFromPoint` at its top finds something else.

What the prototypes already survive, measured (a build that matches them passes these): every page height in Glossary check 4 and About check 13 to the pixel; no sideways scroll on About at every width 320 to 400, then every 16px to 1440, and 860, 861, 959, 960, with the counts 7, 30, 0 and with 12, 1000, 0 (150 widths each), and a five-digit figure (30000) breaks inside its cell at 320 with no overflow; About's five section links land the tab's top at 92px (±0.5) at 320, 375, 390, 768 and 1440; About's Tab and Shift+Tab walks (11 stops; 24 with the fold open) at 320 × 640, 375 × 812, 390 × 844, 768 × 1024 and 1440 × 900, the menu closed and open: 0 fails, the ring 19px or more under the header (5.6 going back with the fold open; 6.7 under the open header) and 6.6px or more above the window's foot, **once the smooth scroll has ended** (A2); the Glossary's three replacement tests of §5.3 at 375 × 812, 390 × 844 and 320 × 640: 0 bad positions (P's bar at 68.0; W's bar 80.3 after its key; `#letters` at 84 after "All letters"); every Glossary anchor of check 7 at 320, 375, 390, 768, 1280 and 1440, with JavaScript on and off; the open header 390.95px tall at 320, 375, 390, 600, 768, 900 and 959 on both pages; no element of About's `main` is sticky.

## Holes

Verdict: **HOLES (14)**: 11 with one answer, 3 that need taste (two low-stakes). S-holes concern both units, G the Glossary (B26), A About (B27).

### One right answer

- **S1. Three shared tests must change on both branches, so no single owner can make both green.** Each unit's own change turns them red on its own branch: `src/lib/tracks-render.test.ts:196-202` (the importers of `card-stack.css` are exactly Home, Tracks and the track page; B26 adds `glossary.astro`, B27 `about.astro`); `e2e/tracks-card-stack.spec.ts:618` (`/about` and `/glossary` have `scroll-padding-top` `auto`; each becomes `80px`); `e2e/tracks-card-stack.spec.ts:797` (`--cs-edge` is empty on `/about` and `/glossary`; each page now imports it). If B26 owns them, B27's branch is red, and the reverse; if both edit them, the second merge conflicts on the same line. **Answer:** one prep commit by the orchestrator on `revamp`, before either worktree is made: `:196-202` reads "the three, plus `src/pages/glossary.astro` and `src/pages/about.astro` when they import it, and nothing else" (every importer is in the five; the three are in it); `:618` drops `/about` and `/glossary` (leaving `/`); `:797` drops `/about` and `/glossary` (leaving `/does-not-exist` and `/networking/dhcp`). Each unit pins its own page's padding, `--cs-edge` and import in its own tests (cases 0.2 to 0.4). F22 makes `:196-202` exact (five) after both merge. After the prep commit neither unit edits either file.

- **S2. Glossary check 15 and About §10 contradict each other on `card-stack.css`.** The Glossary's check 15 wants the file "byte-identical before and after"; About's §10 says "add About to that file's opening comment". Merged, check 15 (as a test) goes red, and a comment naming About but not the Glossary is wrong (the D20 review filed this kind as a fix, H11). **Answer:** B27 owns the comment and names both new importers (lines 1 to 4 list Home, Tracks, the track page, About and the Glossary); B26 does not touch the file; both units' check reads as `track-page-render.test.ts:206` does: "`git diff -U0 e6441c2 -- src/styles/card-stack.css` has hunks only at lines 1 to 4, and no rule, selector, declaration or `@media` changes".

- **S3. Glossary check 14 says About keeps the scroll padding it had (`auto`); B27 gives it `80px`.** **Answer:** Glossary check 14 reads "Home, Tracks, the track pages and a lesson"; About's padding is B27's (About check 17).

- **G1. The 403px scroll padding outlives the menu on a wide window (D20's H10 again).** The Glossary block writes `html:has(#menu-panel:not([hidden])) { scroll-padding-top: 403px }` with no media query (About's block puts the same rule inside `@media (max-width: 959px)`). Measured: menu opened at 900 × 800, window widened to 1200: the header is 69px, the panel still not `[hidden]`, the padding still `403px`; every later Tab lands focus 403px down. **Answer:** the 403px rule sits inside `@media (max-width: 959px)`, as About's and the track page's (E10 of job 21).

- **G2. The focus ring is cut by the window's foot going forward.** The Glossary sets no bottom padding or margin, so a forward Tab scrolls a stop's own box flush with the window's foot and its ring (5px) hangs below it. Measured with real Tab presses: 17 (320 × 640) to 78 (390 × 844) stops a walk have the ring's foot 5.1 to 5.5px below the window, the menu closed and open, at every width (25 at 1440). The element's box is clear in all of them, so check 9 as written ("its foot inside the window") passes; About (`scroll-padding-bottom: 12px`, its check 18 measures the ring) and the track page (`scroll-margin-block: 12px`, D20 case 30 measures the ring) do not have this fault. **Answer:** the Glossary's `html` rule gains `scroll-padding-bottom: 12px`, as About's; checks 9 and 10 measure the ring's box (the element's grown by 5px), as About's check 18 does. Nothing a reader sees changes until a key is pressed.

- **G3. `glossary.spec.ts:112-141` cannot pass unchanged at 375.** It wants the last letter's bar at 68 to 80px after its key; the design lands a letter's top at the 80px padding, and the scroll is a whole pixel while the section's top is not: W's bar is at **80.30px** at 375 × 812 (A 80.36, D 80.48, J 80.17; 79.52 to 80.48 across 320 to 768). §10 lists `:112-141` as "pass unchanged". **Answer:** its bound becomes 68 to 81 (the bar wholly below the header's foot, 69, and within 1px of 80), changed once with that reason.

- **G4. The Glossary's spec, as `glossary.spec.ts` is gated, never runs in `reduced-motion`.** `glossary.spec.ts:30-33` skips every project but `d1440-light` and `d1440-dark`, so the plan's "its specs at d1440-dark, phone and reduced-motion" proves nothing for this file at `reduced-motion` (33 skipped). **Answer:** the page's `describe` (`:38-323`, and the new tests) runs in `reduced-motion` too: the gate lists `d1440-light`, `d1440-dark`, `reduced-motion`; the Learn tests (`:325-570`) keep their gate. A new About spec file carries the same three-project gate.

- **G5. Two of the tests §10 hands B26 have nothing to change, and one is missing.** `src/lib/glossary-page.test.ts` reads no style text (none of its 21 tests opens the `<style>`; they read the rendered markup, which layout 1 keeps), so it passes unchanged; the new rules that need a text pin (the 403px rule inside its media query, G1; `scroll-padding-bottom`, G2; no `transition` and no `--link` in the block) are new unit tests in it. Missing from §10: G3's `:112-141` and G4's gate. **Answer:** B26's report lists `glossary-page.test.ts` as unchanged plus the new tests, and `:112-141` and `:30-33` as changed once.

- **A1. About's "Tests that change" names two that do not, and misses three that do.** `src/lib/about.test.ts` tests `src/lib/about.ts`, which §10 keeps as it is: unchanged. `e2e/site.spec.ts:754-757` (was `:727`, "30 lessons ready") reads `.stats > div` with `dt` "lessons ready", which the new `dl.stats.cs-card` keeps: unchanged. `src/scripts/about-page.test.ts` passes unchanged (it uses `toContain` on `#facts`, and reads `.stats > div`, `#what`, `.a-note p`, `#privacy p`); the fold gets new tests there. Missing: `src/styles/green-text.test.ts:89` checks "Progress cleared" on the page's ground (`tokens.bg`), but in Folders it sits on a section's card (§8: "5.7 / 9.9 on the card"); `README.md:51` names `about-toc.ts` as one of `src/scripts/`; `about.astro:2-5` says "a small module script marks the section being read". **Answer:** `green-text.test.ts:89`'s ground becomes `tokens[theme].card` (the rule's selector and token unchanged); `README.md:51` drops About's list; the page's head comment says no script runs on the page but the header's and the Reset island; `about.test.ts`, `site.spec.ts:754` and `about-page.test.ts`'s five tests stay as they are.

- **A2. About scrolls smoothly, and `transitionsDone` does not wait for it.** `html { scroll-behavior: smooth }` stays (§5.9), so outside `reduced-motion` every scroll on About is animated: a Tab, a list link, a fragment on load. Measured on today's page (the same rule) at 375 × 812: `goto('/about#facts')` resolves with `scrollY` 0 and lands at 2,445 about a second later; a click on "Credits" reads `scrollY` 0 two frames later and 4,702 after. On the prototype, a walk read two frames after each Tab fails 5 to 11 of 11 stops at every width (the stop is still thousands of pixels down); the same walk read once `scrollY` has stopped fails none. `transitionsDone` counts CSS transitions only and returns at once. Checks 15, 16, 18, 19, 20 say "`transitionsDone` after each press". **Answer:** every read after a scroll on About (a Tab, a click on a list link, a `goto` with a fragment, a fold opened) waits with `transitionsDone` and then a `scrollSettled` (polled from Node, so it works with JavaScript off: `scrollY` read until it is the same on three polls in a row, 16ms apart, at most 3s), which B27 adds to `e2e/support.ts`. The Glossary sets no `scroll-behavior` (it computes `auto`, measured), so B26 needs no such wait, and a case pins that it stays so.

- **A3. Check 9's "third cell's right edge at x 288" measures the card, not the cell.** At 320 the card is 256px wide from x 32, so its border box ends at 288; its third cell ends at **286** (the card's 2px edge is outside the cells; measured 202 to 286). **Answer:** check 9 reads "the card is 256px wide, its right edge at x 288 (±1), the third cell's right edge at 286 (±1), each figure's text inside its cell".

### Taste (to `designer`)

- **T1. "All letters" loses the top of its focus ring under the header when its bar is stuck.** Going back with Shift+Tab, focus reaches a letter's "All letters" while its bar is stuck at 68px: the link's box is at 70px (clear of the 69px header by 1px), its ring's top at 65px, so the ring's top side is drawn under the header. Measured: 7 to 14 times a walk below 1280px (320, 375, 390, 768; the menu closed; none with it open, where the bar is under the header anyway). Check 10 (the element's box) passes; a ring-box check fails by 4px. Options: draw that link's ring inside it (`outline-offset: -3px`, as About's list rows draw theirs 4px inside, §5.3 of D21b), or a taller bar (which moves every landing number in §5.6 with it). If unanswered: the inside ring, `.gl-up:focus-visible { outline-offset: -3px }`, and the ring-box check exempts nothing.

- **T2. The keys are under 44px wide from 600 to 707px.** At 600 the keys go to 13 columns with a 32px gutter: 35.7px wide (38.8 at 640, 43.9 at 707, 44 from 708). Check 5 names only 320, 375, 768, 1280 and 1440, and §5.2's "at least 44px wide at every width measured" did not measure here. Today's page is about 37.5px there; 24px is the WCAG 2.2 minimum, so nothing fails a rule. Low stakes: if unanswered, as drawn.

- **T3. A section tab that wraps grows upward into the gap above its card (About).** `h2.cs-tab` may wrap (§5.4) and the look's tab hangs from the card's top (`bottom: 100%`), so a two-line tab (about 65px) would take 21px of the 28px gap above the card and land 21px higher (about 71px, against check 15's 92). No tab wraps at any width measured from 320 (the longest, "Your progress stays with you", is 281px in a 288px card at 320), so only a reader's larger text or a longer heading would meet it. Low stakes: if unanswered, as drawn, and check 11 guards the measured widths.

## Errata

Closed by the orchestrator, 2026-11-18; where an erratum and a spec differ, the erratum wins, and the cases below already read this way.

- **E1** (S1): the three shared tests are loosened on `revamp` in one prep commit before either build (`tracks-render.test.ts`'s importers may include the Glossary and About; `tracks-card-stack.spec.ts:618` and `:797` drop `/about` and `/glossary`); each unit pins its own page's padding, `--cs-edge` and import; F22 makes the importers exact.
- **E2** (S2): B27 owns `card-stack.css`'s opening comment and names both new importers; B26 does not touch the file; both checks read "hunks only at lines 1 to 4, no rule changes".
- **E3** (S3): the Glossary's check 14 reads "Home, Tracks, the track pages and a lesson"; About's padding is B27's.
- **E4** (G1): the Glossary's 403px menu padding sits inside `@media (max-width: 959px)`.
- **E5** (G2): the Glossary's `html` gains `scroll-padding-bottom: 12px`; checks 9 and 10 measure the ring's box.
- **E6** (G3): `glossary.spec.ts:112-141`'s bound becomes 68 to 81px, changed once with that reason.
- **E7** (G4): `glossary.spec.ts`'s page `describe` runs in `reduced-motion` too (gate: `d1440-light`, `d1440-dark`, `reduced-motion`); the Learn tests keep theirs; a new About spec carries the same gate.
- **E8** (G5): `glossary-page.test.ts` passes unchanged and gains the new rule tests; `:112-141` and `:30-33` are listed as changed once.
- **E9** (A1): About's changed tests as A1 lists them (`about.test.ts` and `site.spec.ts:754-757` unchanged; `green-text.test.ts:89`'s ground the card; `README.md:51`; `about.astro:2-5`'s comment).
- **E10** (A2): every read after a scroll on About waits for the scroll to stop (`scrollSettled`, added to `e2e/support.ts` by B27), then `transitionsDone`.
- **E11** (A3): About's check 9 as A3 answers (the card 256px wide to x 288, the third cell to 286, ±1).
- **E12** (T1, the designer's ruling): `.gl-up:focus-visible { outline-offset: -3px }`, an inside ring; the bar stays 48px; the ring's top at or below 69px with the bar stuck, 3:1 on the ground in both themes.
- **E13** (T2, the designer's ruling): as drawn; check 5 adds "44px or more wide from 708px".
- **E14** (T3, the designer's ruling): as drawn; for a wrapped tab check 15 asserts only that its top is at or below the header's foot.

## Which unit owns which file

Each file both units would touch has one owner. A unit does not edit a file the other owns, nor one marked "neither".

| File | Owner | What |
|---|---|---|
| `src/lib/tracks-render.test.ts:196-202` (importers of `card-stack.css`) | **neither** (the orchestrator's prep commit, S1; F22 makes it exact) | the three, plus `glossary.astro` and `about.astro` when they import it |
| `e2e/tracks-card-stack.spec.ts` (`:618` padding `auto`, `:797` `--cs-edge` empty; `:751-772` header and footer as on About) | **neither** (prep commit, S1) | `:618` keeps `/` only; `:797` keeps `/does-not-exist` and `/networking/dhcp`; `:751-772` unchanged and must stay green on B27 |
| `src/styles/card-stack.css` (lines 1 to 4, the comment) | **B27** | names About and the Glossary among the importers (S2); no rule changes |
| `e2e/support.ts` | **B27** | adds `scrollSettled` (A2); B26 writes any helper of its own inside `glossary.spec.ts` |
| `e2e/site.spec.ts` | **B27**, if anything | About's tests there pass unchanged (A1); B26 edits nothing in it (its Glossary tests, `:427-483`, pass unchanged) |
| `e2e/track-page-card-stack.spec.ts` (`:970-987`, header and footer as on About) | **neither** | unchanged; must stay green on B27 |
| `e2e/visual.spec.ts`, `playwright.config.ts` | **neither** | the shots change by design; each spec gates its own projects (G4) |
| `README.md` | **B27** | `:51` (A1) |
| `src/styles/green-text.test.ts` | **B27** | `:89` (A1) |
| `src/components/site.css` | **neither** | `.toc-h` and `.card` lose About as a user and stay, as leftovers (D21b §5.3) |
| `src/styles/tokens.ts`, `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/pages/index.astro`, `src/pages/tracks.astro`, `src/pages/[track]/index.astro` | **neither** | unchanged (case 0.1) |
| `src/pages/glossary.astro`, `e2e/glossary.spec.ts`, `src/lib/glossary-page.test.ts` | **B26** | |
| `src/pages/about.astro`, `src/scripts/about-toc.ts` and `.test.ts` (deleted), `src/scripts/about-page.test.ts`, a new `e2e/about.spec.ts` | **B27** | |
| `src/components/Glossary*.astro`, `src/lib/glossary*.ts`, `src/lib/about.ts`, `src/components/ResetProgress.tsx` | **neither** | unchanged (Glossary §10; About §10) |
| `docs/direction.md`, `team.md`, `plan.md` | the orchestrator (F22) | |

## Attack cases

**How to read the tags.** **[E2E·B]**: an end-to-end test that only a real browser can try (layout, computed styles, focus and Tab order, scroll, sticky, contrast, `:has()`, `:target`, `:focus-visible`, `:active`, a native `<details>`, hydration, JavaScript off). **[E2E]**: an end-to-end test that needs the served site but no rendering (`page.request`, the HTML's text). **[UNIT]**: vitest: the page rendered with `experimental_AstroContainer` and JSDOM (as `glossary-page.test.ts` and `about-page.test.ts` do), or a file's text. **[BUILD]**: reads `dist/` after `npm run build`, no browser. B26 or B27 after the tag says whose test it is.

**Viewports and themes.** Every 320, 375, 390, 768 and 1280 case sets its own window inside a desktop `describe` (`test.use({ viewport, isMobile: false, hasTouch: false, colorScheme })`); the touch cases set `isMobile: true, hasTouch: true` as `glossary.spec.ts:203` does. "Light and dark" is two `colorScheme` runs; "dark, JavaScript off" (`javaScriptEnabled: false`, `colorScheme: 'dark'`: no `data-theme`, `card-stack.css`'s `:root:not([data-theme])` twin alone) is a third path. Measure after `document.fonts.ready`. Resolve a token through a probe element (`el.style.color = 'var(--cs-edge)'`, then its computed colour). "The ring's box" is the focused element's border box grown by 5px. "The foot" is the lowest edge of what is stuck to the window's top: the header (69px, 391 with the menu open), plus, on the Glossary, the stuck bar of the focused element's letter below 1280px when the element is not in that bar, or the keys' strip (foot 133) from 1280px when the element is not a key.

### 0. Both units: what neither may change

**0.1 Home, Tracks and the track page are untouched.**
- [UNIT] B26 and B27: `git diff --name-only revamp -- src/pages/index.astro src/pages/tracks.astro 'src/pages/[track]' src/styles/tokens.ts src/styles/global.css src/layouts src/components/SiteHeader.astro src/components/SiteFooter.astro src/components/site.css src/components/hub` prints nothing. A build that "fixes" `.toc-h` or `.btn--small` in `site.css` goes red.
- [UNIT] B27: `git diff -U0 e6441c2 -- src/styles/card-stack.css` has hunks only at lines 1 to 4 (as `track-page-render.test.ts:206`), and the comment names About and the Glossary (S2). B26: its branch's diff of `card-stack.css` against `revamp` is empty.
- [E2E·B] F22, not a unit: screenshots of `/`, `/tracks`, `/networking`, `/how-the-internet-works`, full page, 375 × 812 and 1440 × 900, light and dark, `animations: 'disabled'`, before B26 and B27 and after both merges: a pixel diff of 0.

**0.2 The scroll padding reaches only its page (S1, S3).**
- [E2E·B] B26: `getComputedStyle(document.documentElement).scrollPaddingTop` is `80px` on `/glossary` and `scrollPaddingBottom` `12px` (G2). B27: `80px` and `12px` on `/about`. Each also asserts `auto` on `/` and `80px` on `/tracks` (the prep commit left those in `tracks-card-stack.spec.ts:617-618`; reading them again in the unit's own spec catches a rule written in `global.css` or `BaseLayout`, which would also set `/`).
- [E2E·B] B26 and B27: `/networking/dhcp` still `69px`.

**0.3 Each page reads the Card stack's names.**
- [E2E·B] B26 on `/glossary`, B27 on `/about`: `getPropertyValue('--cs-edge')` on `:root` is not empty; `/does-not-exist` and `/networking/dhcp` still empty (the prep commit's list, `:797`).

**0.4 Each page imports the stylesheet, once, and nothing else does.**
- [UNIT] B26: `glossary.astro` has `import '../styles/card-stack.css';` on the line after `import '../components/site.css';`. B27: the same in `about.astro`. A build that imports it in `BaseLayout`, `GlossaryEntry` or `ResetProgress` (so it reaches every page) goes red on the prep commit's `tracks-render.test.ts:196-202` (an importer outside the five).

**0.5 The header and footer are as on Tracks.**
- [E2E·B] B27: `tracks-card-stack.spec.ts:751-772`, `track-page-card-stack.spec.ts:970-987` and `site.spec.ts:1860-1882` (`/about` against `/tracks`, `/networking` and `/`) pass unchanged on B27's branch, light and dark, at each of their sizes. B26: the same computed-style comparison (`.site-head`, its `/glossary` link, `.brand`, `.site-foot`, a footer link) between `/glossary` and `/tracks` at 375 × 812 and 1440 × 900, light and dark, in `glossary.spec.ts`. A page rule written unscoped (`a { … }`, `.btn { … }`, `h2 { … }` in an `is:global` block) changes the footer's links or the header's and goes red.

### The Glossary, B26 (D21a §11, layout 1)

Checks 17 to 21 are layout 2's, which is not built (2.112), and have no case.

**G-1. What `main` holds (check 1).**
- [UNIT] The container render: 105 `.gl-entry:not(.gl-entry--see)`, 110 `.gl-def`, 48 `.gl-entry--see`, 153 `dt`, 404 `a.gl-src`, exactly 20 `a.gl-key` and 6 `span.gl-key--none` (G, Q, V, X, Y, Z, each with ", no terms" in `.sr-only`), one `a.stamp[href="/about#facts"]`; each `.gl-def` equals its statements joined by a space (the existing `12.` and `13.` tests). A build that copies layout 2's "All letters" key (`li.gl-az__all`, `a.gl-key--all`) has 21 `a.gl-key` and goes red; one that adds `gl-key--first` goes red on G-1's next case.
- [BUILD] "`main`'s markup does not change by a character": the `<main …>…</main>` slice of `dist/glossary/index.html` equals the same slice of a build of `fee2625`, byte for byte (the page's styles are `is:global` and its components have none, so no `data-astro-cid` attribute moves). Record both builds' hashes in the report. A build that adds a class, a wrapper or an attribute anywhere in `main` goes red.

**G-2. No script; the same page with JavaScript off (check 2).**
- [E2E·B] `glossary.spec.ts:289-314`, unchanged, and the same at 375 × 812: `main`'s `innerHTML` with JavaScript on equals it with JavaScript off; no `astro-island`, no `<script` in it; with JavaScript off a key, `#ttl` typed and "See TTL" each land below the foot (measured on the prototype, off: `#ttl` 136.2 at 375, 146.4 at 1440; `#letter-w` 80.3; `#letters` 84.4 at 375).
- [BUILD] `dist/glossary/index.html` has 2 `<script` (the theme boot and the header's module, as today).
- [E2E·B] JavaScript off, dark by the system: `dl.gl-list`'s border colour and a key's resolve to `--ink` (`rgb(198, 205, 209)`), a source link's colour to `--ink-strong` of the dark theme. A build that writes a dark edge under `[data-theme='dark']` only goes red here.

**G-3. No sideways scroll (check 3).**
- [E2E·B] At 320, 359, 360, 374, 375, 390, 599, 600, 639, 640, 768, 959, 960, 1199, 1200, 1279, 1280 and 1440, light and dark, at the page's top and its foot: `scrollWidth === clientWidth`; JavaScript off at 320, 375 and 1440 too. A bar that keeps today's `margin-inline: -32px` with the 14px phone gutter overflows by 18px a side and goes red at 320.

**G-4. Page height (check 4).**
- [E2E·B] Light, within 1%: 20,300 at 1440 × 900; 30,972 at 768 × 1024; 43,702 at 390 × 844; 45,324 at 375 × 812; 52,004 at 320 × 640 (the prototype: these to the pixel). W's section is 94px (±1) at 375 and 84px at 1440: a build that gives a short letter a `min-height` so that the old `:143` passes goes red here.

**G-5. Targets (check 5).**
- [E2E·B] `glossary.spec.ts:203-262`, unchanged (touch, 375 and 768: every `.gl-row a`, the stamp and every `.gl-up` 44px or more and no two boxes overlapping; "Described in" 26px plus 20px a line; 1024 keeps 44px). Every key 44px tall at every width of G-3; 44px wide or more at 320, 359, 360, 374, 375, 708, 768, 1280 and 1440 (measured 45.3, 51.8, 52.0, 54.3, 45.3, 44.0, 48.6, 44.8, 45.8). A build that keeps today's 6-column break at 359 (not 374) has 43.1px keys at 360 and goes red. From 600 to 707 the keys are 35.7 to 43.9px (T2): recorded, not asserted.

**G-6. A pointer is one line (check 6).**
- [E2E·B] 375 × 812: `#address-resolution-protocol` is 45px tall (±1); its `.gl-name` and its `.gl-see` have equal text baselines (the bottoms of their first line boxes, ±1); 1440 with a mouse: 35px (±1); 768: one row, 55px (measured 55.2: the row is the 640px grid, the spelling in the term's column). The 48 pointers together: 2,270px (±2%) at 375 (4,529 today). A build that leaves the pointer stacked goes red (95px).
- [E2E·B] At 320 the longest spellings wrap (73px, measured): "See" and its link stay on one line together (the `.gl-see` row is one line box).

**G-7. Anchors (check 7).**
- [E2E·B] At 320 × 640, 375 × 812, 390 × 844, 768 × 1024, 1280 × 800 and 1440 × 900: click the keys for A, D, J and W in turn (from the top each time). Below 1280 the letter's bar's top is 80px (±1, measured 79.5 to 80.5) unless the page has ended (W at 768: 326), and from 1280 138px (±1, under the keys' foot at 133) unless the page has ended (W at 1440: 237); the bar is wholly inside the window. "See TTL" from `#time-to-live`: the address ends `#ttl`, the row's top is 136px (±1) under the bar's foot (116) below 1280 and 146px (±1) under 133 from 1280, inside the first screen, `box-shadow` inset. `#web-address`, `#a-record`, `#url` and `#ping` typed into the address: each row's top below the foot. "All letters" in a bar: `#letters`'s top 84px (±1). From 1280, `/glossary#letters` puts the stuck keys at 68px, in the window.
- [E2E·B] Every id at once, 375 × 812 and 1440 × 900: for each of the 153 `.gl-entry` ids and the 20 `#letter-x`, set `location.hash`, `settledFrame`: its top is at or below the foot and above the window's foot, or the page is at its end. For each of the 48 pointers, click its link: the target's id is in the address and its row's top is below the foot. One page load, 173 reads; no walk of every entry by `goto`.
- [E2E·B] JavaScript off: the same for A, W, `#ttl` and `#letters`.

**G-8. The bar (check 8, the three tests replacing `:143`).**
- [E2E·B] At 375 × 812, and at 320 × 640 and 390 × 844 too (measured: 0 bad positions at each): (1) the tallest `section.gl-letter`, found by measuring (P today), scrolled so its middle is at the window's top: its `.gl-bar` at 68px (±1). (2) Click the last letter's key: its bar wholly below the header's foot and inside the window (80.3); click its "All letters": `#letters` in the window. (3) From 200px above the last section to the page's end in 8px steps, `settledFrame` each: if `s.bottom − 68 ≥ b.height` then `b.top = max(68, s.top)` (±1), else `b.bottom = s.bottom` (±1). The test names say what is checked ("a long letter's bar sticks at 68px", not "the last letter's"). `:143-154` is deleted, with the reason in the commit.
- [E2E·B] Test 3 must be able to fail: run it once with `.gl-bar { position: fixed; top: 68px }` injected (the bar no longer leaves its section): red. Run (1) with the tallest letter replaced by the last (W): red (the bar at 35.3, the old test's failure).
- [E2E·B] While a bar is stuck, rows pass under it, not over: at 375, scrolled into A, `elementFromPoint(20, 100)` is the bar or inside it (the bar is `--ground` paper at `z-index: 5`).
- [E2E·B] The tab stands on the card's top edge: at 320, 375, 768 and 1440, `.gl-bar::after`'s left and right equal `dl.gl-list`'s border box's (±0.5), and the `h2`'s bottom equals the bar's bottom (±0.5); from 1280 the bar computes `position: relative` and `.gl-up` `display: none`; below 1280 `sticky`, `top: 68px`.

**G-9 and G-10. Keyboard (checks 9 and 10): see "Keyboard walks" below.**

**G-11. Scroll padding and the open header (check 11, G1).**
- [E2E·B] 320, 375, 390, 768 and 959 wide: click `#menu`, `transitionsDone`: `.site-head` 391px (±1); `scrollPaddingTop` `403px`; Escape: `80px`. JavaScript off: `80px`, and `#menu` does nothing.
- [E2E·B] G1: at 900 × 800 open the menu, resize to 1200 × 800, `transitionsDone`: `80px` (red on the prototype as drawn: `403px`).
- [UNIT] The page's style text: the 403px rule is inside `@media (max-width: 959px)`; `html { … scroll-padding-top: 80px; scroll-padding-bottom: 12px; }`.

**G-12. Colour and edges (check 12).**
- [E2E·B] 1440 and 375, light, dark, and dark with JavaScript off: `#ping a.gl-src` colour equals `--ink-strong`'s and not `--link`'s; `text-decoration-line` underline, `text-decoration-color` `--cs-hair`'s, thickness 1.5px, `text-underline-offset` 3px; hovered (`transitionsDone`) its decoration colour equals its colour. `.gl-see a` and `.gl-up` the same. "Described in" `--ink`, 600, no underline (`:271-287`). `dl.gl-list`: left, right and bottom `2px solid` `--cs-edge`, top 0, bottom radii 10px; the tab `h2` 2px on three sides, 8px top radii, `--cs-card`; `.gl-bar::after` 2px `--cs-edge`; `a.gl-key` 2px `--cs-edge`, 8px radii, `--cs-card`; `span.gl-key--none` `border-style` dashed, background transparent, colour `--muted`. In the dark every edge resolves to `--ink`. `.gl-name` has no border and a transparent background (no tile). `.gl-note` colour `--ink`.
- [E2E·B] `/glossary#ttl`: `#ttl` background `--cs-here-wash`'s, `box-shadow` `rgb(…) 4px 0px 0px 0px inset` in `--cs-here`.
- [E2E·B] A key: hover with the mouse, `transitionsDone`: background `--cs-quiet`'s; `mouse.down()` on it: `transform` `matrix(1, 0, 0, 1, 1, 1)`; `getAnimations()` on the key is empty during both (no transition: a build that keeps today's 150ms fade, or `site.css`'s `.btn` look, goes red).
- [UNIT] The page's style text holds no `var(--link)`, no `transition`, no `--here-soft`, `--line-strong` or `--r-tile`, and none of the prototype's own parts: `.pbar`, `#p-l1`, `#p-l2`, `.gl-az__all`, `gl-key--all`, `gl-key--first`, `:root:has(`.

**G-13. Contrast (check 13).**
- [E2E·B] 1440 and 375, light and dark: every pair of D21a §8 from the drawn colours (the wash composited over `--cs-card`), each at or above its figure less 0.1; every displayed text node in `main` 4.5:1 or more on its composited ground (the lowest: an empty key's letter, 5.03 light); the edges against `--ground` 3:1 or more; the focus outline (`--focus`) 3:1 or more on `--ground`, `--cs-card` and the wash. The underline (`--cs-hair`, 2.16:1 light, 2.26 dark) is recorded, not asserted (approved, 2.112).

**G-14. The other pages' padding (check 14, S3).** Case 0.2.

**G-15. `card-stack.css` (check 15, S2).** Case 0.1.

**G-16. Weight (check 16).**
- [BUILD] `gzipSync` at the default level (`scripts/check-budgets.mjs:33`, 1 KB = 1,000 bytes): `dist/glossary/index.html` ≤ 36,000 bytes (34,148 on today's build; the HTML does not change, G-1); the build ends "Every page is within budget". Record the page's CSS file before (4,744 bytes) and after.

**G-17. What the page must not gain.**
- [E2E·B] `getComputedStyle(document.documentElement).scrollBehavior` is `auto` on `/glossary` (A2: a build that copies About's `smooth` makes every read after a key racy).
- [E2E·B] The skip link: the first Tab on `/glossary` is "Skip to content"; Enter, then Tab: focus is on the stamp, its ring's box below the header.
- [E2E·B] The stamp's link is 44px tall (±0.5) at 320 and 375 (measured 44), and its tick keeps `--allowed-text`.

### About, B27 (D21b §11, layout 2 and "B")

Checks 12, 21, 22, 25 and 26 are layout 1's, which is not built (2.112), and have no case. Every read on About after a scroll waits with `transitionsDone` and then `scrollSettled` (A2), outside `reduced-motion` as well as in it.

**A-1. Words and order (check 1).**
- [UNIT] Before the first commit, capture today's words: the container render of `about.astro` at `fee2625`, each `section.a-sec`'s and `section.a-open`'s `textContent` with white space collapsed, into a fixture (as `home-words.fixture.json`). After: each section's words, with the fold's two spans' words taken out once, equal the fixture's, in order. A build that drops or reorders a sentence while moving it into `.a-cols`, `.a-after`, `.a-two` or `.a-keep` goes red (the likeliest: "The example networks use addresses…", which moves into `.a-after`; "To start fresh…" after the table).
- [UNIT] The summary holds exactly "Show the other 13" and "Hide the other 13", in two spans (`.a-src__closed`, `.a-src__open`); the folded list's `aria-label` is "Sources 4 to 16".

**A-2. Headings (check 2).**
- [UNIT] One `h1` "Watch it happen, then learn its name."; five `h2`, each `cs-tab`, each its section's first child and `aria-labelledby` target, in order "What TechConcepts is", "How a lesson works", "Where the facts come from", "Credits", "Your progress stays with you"; three `h3` in `ol.a-steps` ("See it happen", "Get the idea, then the name", "Check yourself"); `h3` "Sources in the DHCP lesson" in `div.a-src`. Each part's `span.n` is `<b>1</b> Watch` (and 2 Learn, 3 Practice): `textContent` "1 Watch".

**A-3. The counts (check 3).**
- [UNIT] `about-page.test.ts:33-45`, unchanged: 7, 30, 0, computed. `dl.stats` has `cs-card`; each `div` is `dt` then `dd` in the markup.
- [E2E] `site.spec.ts:754-757`, unchanged.

**A-4. The list (check 4, and check 27's mark).**
- [UNIT] `nav.a-toc.cs-card[aria-label="On this page"]` is inside `div.a-open__side`, after `dl.stats`; `p.a-toc__h.cs-tab` "On this page"; five links to `#what`, `#lessons`, `#facts`, `#credits`, `#privacy` in that order, words unchanged; no `aria-current` on any.
- [E2E·B] 1440 and 375: scroll to the page's foot and back: no link in the list ever has `aria-current` (a build that keeps the script goes red).

**A-5. The fold (check 5).**
- [UNIT] The facts `ul` (not the fold's) has 3 `li`; `details.a-src__more` has no `open`; its `ul` has 13 `li`; the 16 links in order and with their `href`s equal `sourceRows(dhcp…)`'s. With `../lib/about`'s `sourceRows` mocked (as the test file mocks `analytics`): 6 rows give one `ul` of 6 and no `details`; 7 give 3 and a fold of 4 ("Show the other 4", "Sources 4 to 7"); 4 give 4 and no fold. A build that writes "13" into the page goes red at 7.
- [E2E·B] 1440 and 375: 3 source links visible, 13 hidden; the summary's visible words "Show the other 13", its accessible name the same; click: `open`, 16 visible, "Hide the other 13", the marker's minus (one gradient layer); click again: closed. Keyboard: focus the summary, Enter, then Space: open, closed. JavaScript off: the same (native). A build that makes the fold a button with a script goes red with JavaScript off.

**A-6. Links (check 6).**
- [E2E·B] 1440 and 375, light and dark: no `main a` computes `--link`'s colour; every `main a` but the crumb's and the list's has `text-decoration-line` underline; the crumb's and the list's `none` (hovered, the crumb's underline). The summary is not a link and is not counted.

**A-7. The look's names, the header and the footer (check 7).** Cases 0.3 and 0.5.

**A-8. No sideways scroll (check 8).**
- [E2E·B] Light: each width from 320 to 400, then every 16px to 1440, and 860, 861, 959, 960: `scrollWidth === clientWidth` (measured: 150 widths clean). Then, at 320, 356, 375 and 860, set the three `dd`s' text to 12, 1000, 0 and to 7, 30000, 0 in the page and measure again: no overflow, each figure's text box inside its cell (measured at 320: 1000 leaves 13px and 15px; 30000 breaks inside its cell, the card 126px tall). Dark, and JavaScript off, at 320 and 1440. Today's page fails at 320 to 356 (357px wide): the case is red on `revamp`.

**A-9. The counts card at 320 (check 9, A3).**
- [E2E·B] 320 × 640: `dl.stats` 256px wide (±1) from x 32, its right edge at 288; the third cell's right edge at 286 (±1); each `dd`'s text inside its cell; the figure 30.24px (12cqi of 252).

**A-10. The counts' words (check 10).**
- [E2E·B] At 320, 375, 390, 768 and 1440 each `dt` is two lines (its text's line boxes), "tracks" over "planned".

**A-11. The tabs (check 11).**
- [E2E·B] At 320, 375 and 860: each section's `h2.cs-tab` is no wider than its card plus 4px and 44px tall (one line); "Your progress stays with you" 281px at 320 in a 288px card (measured).

**A-13. Heights (check 13).**
- [E2E·B] As loaded, light, ±40px: 3,364 at 1440 × 900; 4,233 at 768 × 1024; 5,377 at 390 × 844; 5,587 at 375 × 812; 6,344 at 320 × 640 (the prototype: these to the pixel). Dark: the same.

**A-14. JavaScript off (check 14, and §11 "B" with JavaScript off).**
- [E2E·B] `javaScriptEnabled: false`, 320 and 1440, light and dark-by-the-system: no `button` in `main`; the page is 48px shorter (±2) than with JavaScript on at 320 (6,296), and no taller at 1440; the five list links land as A-15; the fold opens; the theme button is hidden; `card-stack.css`'s dark twin gives every card edge `--ink`.
- [E2E·B] With storage blocked (`Storage.prototype.getItem` throws, and the `SecurityError` form of the D20 cases' S5b): no Reset button, the sentence above it unchanged, no page error.

**A-15. Section addresses (check 15).**
- [E2E·B] At 320 × 640, 375 × 812, 390 × 844, 768 × 1024, 861 × 900, 960 × 900 and 1440 × 900: `goto('/about#what')` (and `#lessons`, `#facts`, `#credits`, `#privacy`), `scrollSettled`: the section's tab top 92px (±2), the section's own top 134 (±2), or the page at its foot. The same by clicking each list link from the top. A build that keeps today's `scroll-margin-top: 92px` on the section lands the tab at 130px, and one that leaves out the root's padding lands it at 12px, under the header: both go red; one that reads two frames after the `goto` reads `scrollY` 0 outside `reduced-motion` (A2) and is a wrong test.

**A-16. Into `#facts` from the other pages (check 16).**
- [E2E·B] From `/glossary`, click the stamp; from `/`, click "How a lesson is made and checked": on `/about#facts`, `scrollSettled`, the facts tab's top 92px (±2) at 375 × 812 and 1440 × 900.

**A-17. Scroll padding (check 17).**
- [E2E·B] `scrollPaddingTop` `80px`, `scrollPaddingBottom` `12px`; at 320, 375, 768 and 959 with the menu open `403px`, the open header 391 (±1); at 900 opened, resized to 1200: `80px`. `scrollBehavior` `smooth`, and `auto` in `reduced-motion`.
- [UNIT] The style text: the 403px rule is inside `@media (max-width: 959px)`.

**A-18 to A-20. Keyboard (checks 18 to 20): see "Keyboard walks" below.**

**A-23. Nothing sticks but the header (check 23).**
- [E2E·B] 375 and 1440: no element in `main` computes `position: sticky` or `fixed` (measured: 0).

**A-24. Targets (check 24).**
- [E2E·B] 375 and 1440: the crumb's link 44px tall; the list's links 44px at 860 and down, 40 at 1440; each source link 44px at 860 and down (the three, and the thirteen with the fold open); the summary 48px; Reset progress, Reset and Cancel 48px. A build where `.btn--small` wins (40px) goes red.

**A-27. Scripts (check 27).**
- [BUILD] `dist/about/index.html` has 4 `<script` (the theme boot, the header's module, Astro's two island scripts) and none whose text holds `markSectionInView`, `followSections` or `aria-current`.
- [UNIT] `src/scripts/about-toc.ts` and `about-toc.test.ts` do not exist; `git grep -n "about-toc\|followSections"` finds nothing in `src`, `e2e` or `README.md` (A1; `docs/` and `prototypes/` keep their history); `about.astro` has no `<script`.

**A-28. Reset progress (check 28).**
- [E2E·B] 1440 and 375, light and dark, with one lesson in progress seeded: one `button` in `main`, "Reset progress", 48px tall, `border-width` 2px in `--cs-edge`, `box-shadow` `3px 3px 0px 0px <edge>`, 18px Barlow. `mouse.down()`, `transitionsDone`: `transform` `matrix(1, 0, 0, 1, 2, 2)`; up, back. Press it: focus on the group named "Reset all progress on this device?" (`toBeFocused`), its `outline-offset` 6px; "Reset" background `--cs-act`'s, "Cancel" `--cs-card`'s; Cancel: "Reset progress" again, focused. Press, then Reset: the status reads "Progress cleared" in `--allowed-text`, focus on "Reset progress", `localStorage` holds no lesson. `site.spec.ts:850-857` and `:943-965` pass unchanged.
- [E2E·B] At 1440 the table is in the second column (`.a-savedbox`'s left is right of the paragraph's right) and Reset is in the first, under "To start fresh" (`.a-reset`'s top below that sentence's bottom, their lefts equal ±1). The island is an `astro-island` (`display: contents`), not the prototype's bare `div`: so this is measured on the build. Then insert a `<p>` before "To start fresh" in the page (the analytics sentence's place; the e2e build has no token): Reset still in the first column, under it.
- [UNIT] The markup's order in `#privacy` is the paragraph, `div.a-savedbox`, the analytics sentence (with a token), "To start fresh…", the island; the table's caption, rows and words as today.

**A-29. No button (check 29).** A-14.

**A-30. Cards and tabs (check 30).**
- [E2E·B] 1440 and 375, light and dark: each `.cs-card` in `main` (the counts, the list, five sections) has a 2px `--cs-edge` edge and 10px radii, the top-left 0 where it has a `.cs-tab` child (the list and the sections; the counts card 10px all round); "On this page"'s tab 34px; each section's tab 44px or more; each tab's left equals its card's left (±1) and its bottom its card's top border edge plus 2 (±1).
- [E2E·B] At 860 and down each section card's left is 16px from the window's and its right 16px from the window's right (±1); the paragraphs' left 32px (±1); at 861 the cards are the `.wrap`'s width.

**A-31. Figures (check 31).**
- [E2E·B] Light and dark: `--pool-op` and `--halo-op` computed 0 on `main .lm-svg`; `.lm-orbit` `display: none`; each `.a-steps .art`'s background `--cs-card`'s. At 1440 the three parts' `li` tops are equal (±1), and stacked at 860.

**A-32. Contrast (check 32).**
- [E2E·B] 1440 and 375, light and dark, as loaded and after Reset (the green status on the card): every pair of D21b §8, layout 2 column, at or above its figure less 0.1; every displayed text node in `main` 4.5:1 or more on its composited ground; the note on `--cs-quiet`.

**A-33. Weight (check 33).**
- [BUILD] `gzipSync` default level: `dist/about/index.html` ≤ 52,000 bytes (51,394 today; about 49,100 expected). Record the build's table rows before and after.

**A-34. Home, Tracks and the track pages (check 34).** Case 0.1.

**A-35. No time figure (check 35).** `site.spec.ts:364`, unchanged.

### Keyboard walks (plan decision 7; Glossary checks 9 and 10, About checks 18 to 20)

Real `Tab` and `Shift+Tab` presses (`page.keyboard.press`), never `focus()` in tab order: Chromium scrolls a real Tab "nearest", which is what put the ring at the window's foot (G2) and the stuck "All letters" under the header (T1), and a scripted walk saw neither. After each press: `transitionsDone`, then a `settledFrame` (the Glossary) or `scrollSettled` (About, A2). At each stop in `main`: the ring's box has its top at or below the foot and its foot at or above `innerHeight`, and `elementFromPoint` 4px inside its top edge is the element or inside it. Each walk asserts its stop count, so a walk that leaves `main` early, or never enters it, goes red rather than passing on nothing. Each walk test is proved with `--trace=off --repeat-each=10` in `reduced-motion` and in `d1440-dark`.

**K-1. The Glossary, menu closed.** B26.
- [E2E·B] At 320 × 640, 375 × 812, 390 × 844 and 1440 × 900 (and 768 × 1024), light. Sampled, not whole (the plan's "What could go wrong"): (a) from the brand, Tab through the stamp, the 26 keys' 20 links and all of A's stops to B's first; (b) for D and J, focus the last stop before the letter with `focus()`, then Tab through the letter to the next letter's first stop; (c) the same into W and on to the footer's first link; then (a′, b′, c′) the same three in reverse with Shift+Tab, starting from the stop after each letter (the footer's first link for W). A letter's stops are its `a` elements, "All letters" left out from 1280. Expected counts: the letter's own `a` count (measured whole: 493 stops in `main` below 1280, 473 at 1440).
- [E2E·B] Measured on the prototype with the whole walk (493 / 473 stops): forward, every ring 217px or more under the foot, and **17 to 78 rings a walk 5.1 to 5.5px below the window's foot** (G2: red until `scroll-padding-bottom: 12px`; then 7px or more clear); back, every ring 6.7px or more under the foot except **"All letters" with its bar stuck, its ring's top 4px under the header** (T1: red until its ring is drawn inside or the designer rules otherwise), 7 to 14 a walk below 1280, none at 1440.
- [E2E·B] Wrong builds this catches: the root's padding left out (back: every row's link under the 69px header); a row's or a link's `scroll-margin-top` left at 0 (back: the link at 80, its ring's top at 75, under the stuck bar's foot at 116); from 1280, `scroll-margin-top` left at 56 (back: under the 65px keys, foot 133, ring at 131).

**K-2. The Glossary, menu open.** B26.
- [E2E·B] At 320 × 640, 375 × 812, 390 × 844 and 768 × 1024: click `#menu`, focus `#menu`, Tab through its five links and "Start learning" into `main`, then the samples of K-1 (the menu stays open: only Escape or a link's click closes it). Every ring under the open header's foot (391) and above the window's foot: measured, back 6.7px or more clear of the header; forward, the same G2 failures until the fix (22 to 76 a walk). A build with no 403px rule, or with it at 80px, goes red (every stop under the open header).

**K-3. About, menu closed.** B27.
- [E2E·B] At 320 × 640, 375 × 812, 390 × 844, 768 × 1024 and 1440 × 900, light: Tab from the brand until focus leaves `main` for the footer; the stops in `main` are exactly, in order, "Home" (the crumb), the five list links, the three source links, the fold's summary, "Reset progress": **11**. Then Shift+Tab from the footer's first link back to "Home". Measured on the prototype, after `scrollSettled`: 0 fails at every width; the ring 19px or more under the header (25.7 at 768, 43 at 1440) and 6.6px or more above the window's foot.
- [E2E·B] The same walk read two frames after each press, outside `reduced-motion`, fails 5 to 11 of 11 (A2): the test must not be written that way. In `reduced-motion` the scroll is instant and both reads agree.
- [E2E·B] Storage blocked and JavaScript off: **10** stops (no Reset), the same reads.

**K-4. About, menu open, and the fold open.** B27.
- [E2E·B] At 320 × 640, 375 × 812, 390 × 844 and 768 × 1024: open the menu, Tab from `#menu` through its six links into `main` and on, then back: 11 stops, every ring under 391 and above the window's foot; measured 6.9px or more clear of the open header, 6.6px of the foot.
- [E2E·B] Open the fold first (click the summary, then `scrollSettled`): **24** stops (the 13 links between the summary and Reset), at 320 × 640, 375 × 812 and 1440 × 900, the menu closed and (below 960) open: measured 0 fails, 5.6px or more under the header going back.

**K-5. Both pages: the way in.**
- [E2E·B] The first Tab is "Skip to content"; Enter; the next Tab is the first stop in `main` (the Glossary's stamp, About's crumb), its ring below the header.
- [E2E·B] A mouse click on a source link, a key or a list link draws no ring (`:focus-visible` only).
- [E2E·B] Glossary: after a key's Enter at 375, the next Tab is that letter's "All letters", and at 1440 the first link in its card (`glossary.spec.ts:112-141`, G3's bound).

### The tests that pin today's pages, each changed once

Each line: where, what it asserts today, what it asserts after. A build review checks each changed expectation against the spec: an expectation dropped rather than moved is a blocker. A test not on this list is not in the unit's diff; if one fails, the build is wrong.

**B26**
- [E2E·B] `e2e/glossary.spec.ts:143-154`: the last letter's bar at 68px with its middle at the window's top → deleted; G-8's three tests in its place.
- [E2E·B] `e2e/glossary.spec.ts:112-141`: the bar 68 to 80px after the last key at 375 → 68 to 81 (G3); the rest unchanged.
- [E2E·B] `e2e/glossary.spec.ts:30-33`: the page's tests run in `d1440-light` and `d1440-dark` → and `reduced-motion` (G4).
- [E2E·B] Unchanged, and green on the build (each re-measured on the prototype): `:39-49`, `:51-71`, `:73-82`, `:98-110`, `:156-164`, `:166-169`, `:171-201`, `:203-262`, `:264-269`, `:271-287`, `:289-314`, `:316-322`, and the Learn tests `:325-570`.
- [UNIT] `src/lib/glossary-page.test.ts`: its 21 tests unchanged (G5); new: the style-text cases of G-11 and G-12, the import of case 0.4.
- [E2E·B] `e2e/visual.spec.ts`'s `glossary` shots change by design; they assert nothing.

**B27**
- [UNIT] `src/scripts/about-toc.test.ts` (8 tests): deleted with `about-toc.ts`.
- [UNIT] `src/styles/green-text.test.ts:89`: "Progress cleared" on `tokens.bg` → on `tokens[theme].card` (A1).
- [UNIT] `src/scripts/about-page.test.ts`: its 5 tests unchanged; new: A-1 (the words fixture), A-2, A-4, A-5, A-28's order, A-27's file checks.
- [UNIT] `src/lib/about.test.ts` (9): unchanged (A1).
- [E2E] `e2e/site.spec.ts:754-757` ("30 lessons ready"), `:850-857` and `:943-965` (the Reset flow), `:364-370` (no time figure), `:1860-1882` (the header as on Home): unchanged.
- [E2E·B] `e2e/tracks-card-stack.spec.ts:751-772` and `e2e/track-page-card-stack.spec.ts:970-987`: unchanged, and green with About in Card stack.
- [E2E·B] `e2e/visual.spec.ts`'s `about` shots change by design.
- Doc: `README.md:51` (A1).

**The orchestrator, before both (S1)**: `src/lib/tracks-render.test.ts:196-202`; `e2e/tracks-card-stack.spec.ts:618` and `:797`. After both merge (F22): `:196-202` exact, the five importers.

### Reads that need `transitionsDone` in the `reduced-motion` project

Under `prefers-reduced-motion: reduce` every transition still runs, for 0.01ms (`global.css:179-188`), so a read straight after a change can see the old value; `transitionsDone` polls from Node, so it serves with JavaScript off too.

**The Glossary** has no transition in `main` once built (the keys' 150ms fade goes; G-12 pins it) and no `scroll-behavior`. A wait is still owed, because a wrong build can bring a transition back (Patch's `.btn` and today's `a.gl-key`), and the header's own buttons have transitions (`.icon-btn`, 120ms and 150ms; the header's "Start learning", `site.css`'s `.btn`):
- after a key, a source link or "All letters" is hovered (G-12) and after `mouse.down()` on a key;
- after each Tab and Shift+Tab of K-1 and K-2 (then a `settledFrame` for the scroll);
- after `#menu` opens or closes, and after G1's resize, before reading the header's height or the padding (G-11, K-2);
- after the header's theme button, before any colour or contrast read (G-12, G-13);
- after a click on a key, a pointer or "All letters", and after `location.hash` is set (G-7, G-8; then a `settledFrame`).

**About** has two kinds of motion: `main .btn`'s transform and shadow (80ms, from `card-stack.css`) and the root's `scroll-behavior: smooth` (A2), which `transitionsDone` does not see:
- after `mouse.down()` and `mouse.up()` on Reset progress, Reset or Cancel, and after each is hovered (A-28);
- after each press of K-3 and K-4, and after the fold's summary is clicked or toggled by key (A-5, K-4): `transitionsDone`, then `scrollSettled`;
- after `goto('/about#…')`, after a list link is clicked, after the Glossary's stamp or Home's link is followed (A-15, A-16): `scrollSettled`;
- after the Reset flow moves focus (A-28: focus to the group, then back to the button, can scroll);
- after `#menu` opens or closes and after the resize (A-17), after the theme button (A-30, A-32).

Each such test is proved with `--trace=off --repeat-each=10` in `reduced-motion` and in `d1440-dark` (where About's scroll is smooth: the run that catches a missing `scrollSettled`).

### Every end-to-end measure the designs change

What a test of today's page measures, today's value (`revamp`, built 2026-11-18), and the build's (the prototypes'), for the job's before-and-after table.

**The Glossary (B26)**

| Measure | Today | B26 |
|---|---|---|
| Page height, 1440 × 900 / 768 × 1024 / 390 × 844 / 375 × 812 / 320 × 640 | 20,847 / 30,929 / 48,737 / 50,158 / 57,255 | 20,300 / 30,972 / 43,702 / 45,324 / 52,004 |
| Root `scroll-padding-top` | `auto` | `80px`; `403px` with the menu open below 960 (G1) |
| Root `scroll-padding-bottom` | `auto` | `12px` (G2) |
| `--cs-edge` on `:root` | empty | `--ink-strong` (light), `--ink` (dark) |
| A letter's bar | 60px, a filled ink tile, a 1px rule | 48px, an index tab on a 2px rule (the card's top edge) |
| Where a key puts its bar, 375 / 1440 | 72 / 140 (`scroll-margin-top`) | 80.3 / 138 |
| Where "See TTL" puts `#ttl`, 375 / 1440 | 136 / 134 | 136 / 146 |
| Where "All letters" puts `#letters`, 375 | 84 | 84 |
| W's section, 375 | 147.8 | 94 |
| A pointer row, 375 / 1440 | 95 / 43 | 45 / 35 |
| The 48 pointers, 375 | 4,529 | 2,270 |
| The page's side gutter, to 599px | 32 | 14 |
| Key columns | 6 below 360, 7 to 599, 13, 26 from 1280 | 6 below 375, 7 to 599, 13, 26 from 1280 |
| A key | 1px `--line-strong`, `--r-tile`, 18px, a 150ms fade, `scale(0.96)` pressed | 2px `--cs-edge`, 8px, 19px, no transition, `translate(1px, 1px)` pressed |
| A term's name | 19px on label tape (a bordered tile) | 20px, no tile |
| A source link | `--link`, underline offset 2px | `--ink-strong`, a 1.5px `--cs-hair` underline 3px under |
| Landed on (`:target`) | `--here-soft`, a 3px `--here` inset | `--cs-here-wash`, a 4px `--cs-here` inset |
| The note's colour | `--muted` | `--ink` |
| The keys' strip from 1280 | sticky, its foot at 133 | sticky, 65px, its foot at 133 |
| Tab stops in `main`, below 1280 / from 1280 | 493 / 473 | 493 / 473 |
| Rings hidden on a Shift+Tab walk, 375 / 1440 (D21a §5.6) | 163 / 139 | 0 (and T1's "All letters", 4px) |
| `main`'s HTML; `<script>` elements; gzipped HTML | today's; 2; 34,148 bytes | the same (G-1); 2; the same |
| The page's CSS file | 4,744 bytes | about 5,470, plus `card-stack.css` |
| `glossary.spec.ts:143` | held (red) | deleted; three tests (G-8) |

**About (B27)**

| Measure | Today | B27 |
|---|---|---|
| Page height, 1440 × 900 / 768 × 1024 / 390 × 844 / 375 × 812 / 320 × 640 | 4,826 / 4,852 / 6,483 / 6,883 / 8,466 | 3,364 / 4,233 / 5,377 / 5,587 / 6,344 |
| Sideways scroll | 37px at 320 (357px wide) to 356 | none, 320 to 1440 |
| Root `scroll-padding-top` / `-bottom` | `auto` / `auto` | `80px` (`403px` open, below 960) / `12px` |
| `scroll-behavior` | `smooth` (`auto` reduced) | the same |
| A section's address lands | the section's top at 92 | the tab's top at 92, the section's box at 134 |
| `--cs-edge` on `:root` | empty | set |
| The list of sections | sticky beside the column from 861 (`top: 96px`); a row to swipe below, "On this page" hidden | not sticky; a card in the opening at every width, "On this page" on its tab |
| `aria-current="location"` in the list | one link, moved by the script | none |
| `<script>` elements | 5 | 4 |
| Tab stops in `main` | 23 | 11 (24 with the fold open; 10 with storage blocked or JavaScript off) |
| Source rows shown | 16 | 3, and a fold of 13 |
| "Where the facts come from", 1440 / 375 | 1,538 / 2,257 | 393 / 766 |
| Reset progress | 40px, a 1px edge, no shadow | 48px, a 2px `--cs-edge` edge, a 3px offset edge |
| Links in the sections | `--link` | ink, underlined |
| A section's name | `h2`, `clamp(30px, …, 42px)` | `h2.cs-tab`, 24px (21px at 860 and down) |
| The counts | a row, `nowrap`, 325px | a 3-cell card, the figure `clamp(30px, 12cqi, 56px)`, 256px wide at 320 |
| The figures' ground | `--fig-bg` `#eef1f1` (light) | `--cs-card` |
| The crumb's link | one line of 15px text | 44px tall |
| Gzipped HTML | 51,394 bytes | about 49,100 |
| A ring hidden on a walk, 375 / 320 (menu open) | 11 / 12 (36 / 43) | 0 / 0 (0 / 0) |

## Notes

- **The prototype's figures for the Glossary's walk were scripted** (`focus()` in tab order, §5.6); this review's real presses found G2 and T1 there. About's prototype walk was scripted too, and holds with real presses once the smooth scroll has ended.
- **At 768 a pointer row is the 640px grid** (the term's column, then "See" in the second), 55px tall: one line, as §5.4 says, but not the 45px of a phone; G-6 records it.
- **`site.css`'s `.toc-h` and `.card` lose About** (About is the last page that uses either; no other file in `src` names them); left as leftovers by D21b, for a later tidy.
- **The keys' strip from 1280 sits 1px under the header's border** (the strip's top 68, the header's foot 69), as today.
- **The Reset button appears after hydration** (the server cannot know whether there is progress), so About grows 48px at its foot when the island loads with progress stored, as today; nothing above it moves.
- **A browser's larger text** could wrap a section tab on About (T3) or the "All letters" link on the Glossary; neither was measured above 100%.
- **Measured in Chromium only**, as the designs were (D21b open question 5): WebKit and Firefox are the builds' to try, the fold's `summary` laid out as `display: flex` and the Glossary's sticky bar among them.
