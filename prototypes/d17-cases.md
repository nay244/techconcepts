# D17 cases: the spec review of B20 (job 17)

The spec review of `prototypes/d17-home-card-stack.md`, colour variant A only (direction 2.82), by `reviewer` (Opus), 2026-11-16, on `claude/job17-home-card-stack-85bd4a` at `0c22bf2`. Verdict: HOLES (14), every one with one answer, measured from the prototype or read from the code; none needs taste or changes what the owner approved. The errata below close them, numbered by the orchestrator; they win over the spec wherever the two differ. The attack cases follow as the reviewer wrote them, with its measurements and its notes. The builder turns each case into a test; every case tagged **[E2E]** is an end-to-end test in `e2e/site.spec.ts`, **[UNIT]** a test in `src/lib/home.test.ts`. The build reviewer checks them.

## Errata

- **E1 (H1, check 28).** The answer radios' `scroll-margin-bottom` is **324px** (was D16's 300): D17's taller answers put the answer hint 321px below its anchor, so 300 leaves it below the window at 375 and 390. A mechanism value; nothing a reader sees moves, and check 22's taps still move the page 0px.
- **E2 (H2, Astro's scoping).** In `index.astro`'s scoped `<style>`, every selector whose subject is an element Home's template does not render carries `:global(…)`: `:global([data-theme="dark"])`, `:global(main)`, `:global(.lm-defs)`, every rule inside a figure, the stamp and the leaders. The figures' tint selectors outweigh `src/art/lumen.css` in any stylesheet order: `:global(#main .lm-svg)` for light, `:global([data-theme="dark"] #main .lm-svg)` and, inside the dark media query, `:global(:root:not([data-theme]) #main .lm-svg)` for dark. §10's "written without `#main`" applies to rules whose subject Home renders; `#main` stays where it gives a figure rule its weight.
- **E3 (H3, check 3).** The header is compared with **`/about`**, not `/tracks` (which has no "Start learning"). The nav's line and the radii are compared on a link that is current on neither page.
- **E4 (H4, check 12).** Read: "each link in `main` that is not a `.btn` has `text-decoration-line: underline` with a colour whose alpha is above 0, and none computes to `--link`".
- **E5 (H5, dark `--anatomy-paper`).** `--cs-card` in both themes, as §6 and the D17 block write it (the prototype shows lumen's `#1c1f22` in dark only by a selector accident).
- **E6 (H6, the trail's casing).** The `.nm-trail-edge` rule is written as the block has it, and **no casing polyline is added**: the lit way is `.home-trail`, `--cs-here`, 3.5px, no filter.
- **E7 (H7, check 9).** The first tab's left edge = `.demo__scene`'s right − 2 (the rule's left edge), ±1px, at 1440.
- **E8 (H8, check 4).** The header's background, its alpha ignored, has the same RGB as `body`'s (`--ground`); `main` is transparent. "No rule": every element whose box lies between the header's bottom and the `h1`'s top has zero border widths and a transparent background; the header's own 1px bottom border is allowed.
- **E9 (H9, check 1).** The words in `main` are today's, plus D16's three hints, plus the key's 10 texts, which equal the SVG's four callouts' texts in order. A **[UNIT]** test with `experimental_AstroContainer` and JSDOM; today's words are captured as a fixture from today's render before the change.
- **E10 (H10, check 15).** A colour value is what D5's regex matches (`#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(`) plus the named colours other than `transparent` and `currentColor`, over the whole of `index.astro` (its `<style>` and the generated rules). Excluded: the token block and the figures' tint block, each opened and closed by a marking comment. `home.test.ts`'s `toContain('var(--link)')` inverts: no `var(--link)` in `index.astro`.
- **E11 (H11, check 16).** Contrast covers every displayed, visible HTML text node in `main` outside `svg`, in Watch steps 1–5, Learn and Practice with a pick, at 375 and 1440, light and dark; the background is found by walking up and compositing (inside `.demo`, the card's `--cs-card`). The figures' engraved words are texture (D16's decision) and are not measured.
- **E12 (H12, D16's checks).** D16's checks 2, 4, 6, 7 and 22 are still owed (D17 replaced only D16's check 14); their cases are under checks 20, 21 and 15 below.
- **E13 (H13, check 24).** "At y 69 or lower" means the new narration's top is **≥ 69** (below the header's bottom).
- **E14 (H14, D5's block).** D5's height limits stay at 115 (375) and 99 (1440) (`site.spec.ts`); measured 113.1 and 97.1. What changes in the tests that pin today's Home: the answer-radio count in Learn (3 → 0), the `.demo__row` clicks at a phone width, and the colour assertions in S19 Part 7.

## Attack cases, by §11's checks

**How to read the tags.** **[E2E]**: only a real browser can try it (focus, scroll, Tab order, computed sizes and styles, pseudo-elements, sticky position, contrast, `:focus-visible`, `:active`, anything CSS decides): a test in `e2e/site.spec.ts`. **[UNIT]**: `src/lib/home.test.ts`, on `homeDemo()`'s output, the text of `index.astro`, or the page rendered with `experimental_AstroContainer` and JSDOM (vitest runs before any build, so not `dist/`).

**Viewports.** The Playwright `phone` project is 390×844 and runs only `@phone` tests; it is not the spec's phone. Every 375×812 (and 320, 768) case below sets its own window inside a desktop `describe`, as the H1 block does: `test.use({ viewport: { width: 375, height: 812 }, isMobile: false, hasTouch: false, colorScheme })`. The 1440 cases set `{ width: 1440, height: 900 }` and `colorScheme` themselves too, so they mean the same in every desktop project (CI runs `d1440-dark` and `phone`). "Light and dark" means two `colorScheme` runs; "dark, JavaScript off" is a third path (no `data-theme`, the media query alone) and is named where it matters. Measure after `document.fonts.ready`; set `html { scroll-behavior: auto }` or scroll with `behavior: 'instant'` before any scroll measure (Home's `html` is smooth). Compare colours by resolving a token through a probe element (`el.style.color = 'var(--cs-edge)'` then `getComputedStyle(el).color`), never by string-matching `getPropertyValue`.

### The look

**1. Five sections in today's order; words are today's plus D16's three hints.**
- [UNIT] Render Home; `main`'s `h1` then `h2`s read "See how technology really works.", "Try one, right here", "Get started with the basics", "Where the facts come from", "Lift the lid". A build that moves the facts card above the tracks goes red.
- [UNIT] Every text in `main`, collapsed for white space, equals today's (a fixture captured from today's render before the change), plus exactly "Arrow keys switch between Watch, Learn and Practice.", "Arrow keys move between the steps.", "Arrow keys choose an answer." and the arrows, plus the key's 10 texts (H9). A build that re-types the key (e.g. "Your Laptop", or "Web server, port 80") or adds a label like "Card 1 of 3" goes red; one that keeps everything passes.
- [UNIT] The key's texts appear once in `.demo__key` and are also still in the SVG (moved into a key, not deleted from the drawing: the 1440 drawing keeps its callouts).

**2. Exactly two `<script>` elements.**
- [UNIT] The rendered page has two `<script` and no `astro-island`. A build that adds a 1-line script to make the tabs sticky, or a `client:` component, goes red. ([E2E] `site.spec.ts:1710-1714` stays as it is.)

**3. The header equals another page's (H3: `/about`).**
- [E2E] 1440 and 375, light and dark: on `/` and `/about`, `.site-head`'s background, `border-bottom`, the nav's line and radius, and "Start learning"'s `background-color`, `border-radius`, `box-shadow` and `border-width` are equal. A build that writes `:global(.btn)` (so the header's button gets the 2px edge and the 3px offset shadow), or sets `--radius`/`--accent` on `:root`, goes red; Home's own `.btn` rules, scoped, pass.
- [E2E] "Start learning" on Home keeps `box-shadow: none` and its 1px border while every `main .btn` has the offset edge (the nearest leak: a rule written as `.btn` inside `:global(...)`).

**4. One ground from the header down; no rule above the opening.**
- [E2E] 1440 and 375, light and dark: the header's background RGB (alpha ignored) equals `body`'s (H8); `main` is transparent. A build that paints `main` or `.open` with `--card` goes red.
- [E2E] No element between the header's bottom and the `h1`'s top has a border width above 0 or a non-transparent background; `.try__head`'s `border-top-width` is 0. A build that keeps today's 2px rule over "Try one" goes red.

**5. Cards: 2px solid `--cs-edge`, 10px corners.**
- [E2E] 1440 and 375, light and dark: `getComputedStyle(.demo, '::before')`, each `.leg`, `.facts__grid`, `.close__grid`: every side `2px solid`, colour = `--cs-edge` resolved. Dark with JavaScript on: the edge is `rgb(198, 205, 209)` (`--ink`). A build with the dark block written as a bare `[data-theme="dark"]` (scoped dead, H2) goes red here only in dark with JavaScript on; with `--ink-strong` it would be `rgb(243, 245, 246)`.
- [E2E] Dark, JavaScript off (no `data-theme`): edge `rgb(198, 205, 209)` too. Light chosen while the system is dark (`colorScheme: 'dark'`, then `localStorage` theme `light`, reload): edge `rgb(18, 23, 27)`. A build that puts the dark edge under `@media (prefers-color-scheme: dark) { :root {…} }` without `:not([data-theme])` goes red here.
- [E2E] Radii: 1440: `.demo::before` all four 10px; 375: top-left and top-right 0, bottom 10px. Each `.leg`: top-left 0, the rest 10px. `.facts__grid`, `.close__grid`: 10px all round. A build that leaves the phone demo's top corners round goes red at 375 only.

**6. Cards beneath: two under the demo, one under each track, none under facts and close.**
- [E2E] `.demo::before` `box-shadow` is two shadows: `6px 6px 0 -2px <card>, 6px 6px 0 0 <edge>` at 1440, `4px 4px …` at 375 (and at 860), 6px at 861. A build whose `--cs-stack: 4px` is on a scoped `main` (dead, H2) keeps 6px at 375 and goes red.
- [E2E] `.demo::after`: `display` not none, `position: absolute`, `background-image` starts `conic-gradient(`, its two colours are the edge and the card (dark: `rgb(198, 205, 209)` and `rgb(26, 30, 33)`), its border 2px; its right and bottom edges lie 12px (1440) / 8px (375) beyond the card's (the card's own edges come from `.demo`'s box: `.demo::before` spans it, its 2px padding cancelled by the −2px margin); `elementsFromPoint` 1px inside its exposed bottom-right corner returns `.demo` (the pseudo's host), not the next section.
- [E2E] `.demo`'s `overflow-x` and `overflow-y` compute `visible`: the cards beneath lie outside `.demo`'s box (its 12px right margin is their room), so D16's `overflow: clip`, kept, would cut them off.
- [E2E] Each `.leg`: one shadow pair, no `::after` card; `.facts__grid` and `.close__grid`: `box-shadow: none`. A build that gives every card two beneath goes red.
- [E2E] The dithered card does not cover anything: at 1440 and 375, `elementsFromPoint` at the centre of the scene, the first row, Next and the tabs returns the real element first (its `z-index: -1` inside `.demo`'s `isolation: isolate`). A build without `isolation` (the dither drops behind `main`'s ground, so it vanishes) or with `z-index: 1` (it covers the card) goes red.

**7. Buttons: ≥ 48px, 2px border, offset shadow; pressed `1px 1px` and moved 2px.**
- [E2E] 1440 and 375: every displayed `main .btn` (the opening's two, the visible Next, "Go to Practice" in Learn, "Lift the lid"'s): height ≥ 48, all borders 2px, `box-shadow` offsets 3px 3px (A: the filled one too). A Next label left at today's 1px border goes red.
- [E2E] Press without release (`mouse.move` to its centre, `mouse.down()`), poll: `box-shadow` is `… 1px 1px 0px 0px`, `transform` is `matrix(1, 0, 0, 1, 2, 2)`; after `mouse.up()` back to 3px and `none`. Poll (80ms transition), and under `reducedMotion: 'reduce'` too. A build that keeps `site.css`'s `.btn:active { transform: scale(0.97) }` goes red (its matrix is a scale).
- [E2E] The hidden Next labels (`display: none`) are not counted; a test that counts all 5 `.demo__next` would fail a right build.

**8. One filled button showing per card.**
- [E2E] 1440 and 375, in Watch at each step, Learn and Practice: inside `.demo` the displayed `.btn--primary` count is 1, 1, 1, 1, 1, 1, 0; inside `.close__grid` 1; inside each `.leg` and `.facts__grid` 0; the opening (not a card) 1 primary and 1 plain. A build that shows Watch's Next and Learn's "Go to Practice" together (Learn pane over a `display: contents` Watch pane) goes red.

**9. The tabs.**
- [E2E] 1440 and 375, for each part on show: its label 52px tall (±0.5), `font-weight` 700, `border-bottom-width` 0, `::before` `display: block` 9×9; the other two 46px, 600, `border-bottom-width` 2px, `::before` `display: none`. A build that marks the tab by an inset line (today's generated rule kept) or keeps 600 on the tab on show goes red.
- [E2E] 1440: first tab's left = `.demo__scene`'s right − 2, ±1 (H7). A build that drops `.demo__parts`' `margin-left: -2px` (tab 2px right of the rule) passes a lax "within 2px" test: use ±1 against `right − 2`.
- [E2E] 1440 and 375: every tab's bottom = `.demo`'s top + 52 (the card's top + 2: each tab overlaps the card's 2px top edge); the tab on show has `border-bottom-width` 0 and the card's paper, so the card's edge does not show under it (`elementFromPoint` 1px above its bottom, at its centre, returns the label).
- [E2E] 375: three widths equal ±0.5 (measured 114.33); first tab's left = `.demo` left (14), last tab's right = card right (353); a build with `flex: 1` but no −2px margins leaves a 2px step at each end and goes red. At 390 (phone project width) the same holds: card 14 to 361.
- [E2E] 861 and 1024 (desktop layout): the tabs' boxes do not intersect the "Try one" heading or its intro (measured: no overlap at 861, 960, 1024, 1280, 1920); the heading is 57% wide. A build that pulls the tabs up with `margin-top: -50px` but leaves the heading full-width goes red at 861.

**10. Steps: the here chip, the ticks, the numbers.**
- [E2E] For N = 1 to 5 (1440 rows, 375 tiles), light and dark: chip N's `background-color` = `--cs-here` and its `color` = `--cs-here-ink`, its `::after` not displayed; each chip < N: `background-color` = `--cs-card`, `font-size` 0px, `::after` `display: block` with `border-left-width`/`border-bottom-width` 3px in `--cs-done`, `border-top-width` 0; each chip > N: `font-size` 14px (1440) / 16px (375), `::after` none, background `--cs-card`. An off-by-one build (`done.n <= step.n`) ticks the step on show and goes red at every N; one that keeps the green fill on done chips goes red.
- [E2E] 1440: row N `border-color` = `--cs-edge`, `background-color` = `--cs-here-wash` (light composites to `rgb(243, 233, 227)` on the card); the other rows' borders transparent and backgrounds transparent.
- [E2E] 375: the tile on show has `background-color` = `--cs-here`, not `--here-soft`: D16's generated `--tile-bg: var(--here-soft)` rule must not win (a build that sets only `--tile-bg` and lets the order of the two generated rules decide goes red).
- [UNIT] The number stays in the markup: each `.demo__n` in the rendered page holds its digit (`1` to `5`); a build that draws the tick by replacing the text goes red.

**11. Request and response bars; neither colour anywhere else in `main`.**
- [E2E] 1440, light and dark: for the displayed messages at steps 2 to 5, `li[data-kind=request]`'s `border-left` is 5px `--cs-request` (`rgb(31, 99, 192)` light, `rgb(90, 169, 255)` dark), response 5px `--cs-response`.
- [E2E] Walk every element in `main` (hidden ones too) and its `color`, `background-color`, `fill`, `stroke`, `stop-color`, `outline-color` (when the outline is not none) and each border colour whose width is above 0: only the 11 message `li` left borders equal either colour (measured: 11 hits in the prototype, all message bars). A build that leaves `.try__head a { color: var(--link) }` passes this one (`--link` is a different blue) and goes red at check 12; one that colours the "LOOKUP" code `--cs-request` goes red here.

**12. No link is `--link`; each link is underlined (H4).**
- [E2E] 1440 and 375, light and dark: every `main a` has `color` ≠ `--link` resolved (light `rgb(27, 86, 176)`, dark `rgb(134, 180, 255)`), including the ones in the hidden Learn and Practice panes and the folded sources. Each one in today's code: `.try__head a`, `.demo__sealed a`, `.demo__after a`, `.facts a`, `.demo__list a` (D5's block): one left at `var(--link)` goes red.
- [E2E] Each `main a:not(.btn)` has `text-decoration-line` containing `underline` and a `text-decoration-color` with alpha above 0 (measured `rgba(18, 23, 27, 0.34)` light). A build that keeps `.leg h3 a { text-decoration-color: transparent }` goes red; a test that demands an underline on `a.btn` fails a right build.
- [E2E] Hover a track title: `text-decoration-color` becomes the link's own colour (ink), not `--here` (today's hover).

**13. Practice: picked, right, wrong, feedback.**
- [E2E] 1440 and 375, light and dark: click the second answer: its label's `box-shadow` `1px 1px 0 <edge>`, `transform` `matrix(1, 0, 0, 1, 2, 2)` (poll), background `--cs-quiet`; its `::before` background `--cs-card` (no green), `::after` an 8×8 round box in `--cs-edge`; the feedback's `border-left` 5px `--cs-edge`. Then click the first: the same press; `::before` background and border `--cs-done`; `::after` a tick (`border-left`/`border-bottom` 2.5px in `--cs-card`, rotated); feedback `border-left` 5px `--cs-done`. The unpicked answers keep the 3px offset shadow and no transform.
- [UNIT] The right answer is the data's, not the first label: the generated rule that fills the ring names `demo-a${i+1}` where `options[i].right` (the prototype's own CSS hardcodes `demo-a1`). Test with the registry swapped (the file's `swapped` map) so the answer is option 3: the fill rule names `demo-a3`, and `demo-a1` gets the dot. This needs the generated CSS to be reachable from a test (e.g. built by a function in `home.ts` that `index.astro` calls); if the builder keeps it in the frontmatter, the [UNIT] reads the rendered page's inline `<style>` with real data only and cannot try the swap.

**14. Figures: no glow, no rings, the lit way in `--cs-here` (and the rest of §6).**
- [E2E] 1440 and 375, light and dark: each of the five `main svg.lm-svg`: `--pool-op` and `--halo-op` read `0`; `animation-name` `none`; `--fig-bg` = `--cs-card`. Each `main .lm-orbit` (8 in the prototype) and `.nm-glow` (2) `display: none`. A build with the tint on a scoped `main` (dead, H2) keeps `.38` and goes red.
- [E2E] At step 3 (1440): `.home-trail[data-step="3"]`'s `stroke` = `--cs-here`, `stroke-width` 3.5px, `filter` none (lumen's `drop-shadow` gone) (H6).
- [E2E] `.lm-defs` (outside `main`): its first `stop.la`'s `stop-color` = `--cs-here` (light `rgb(176, 70, 23)`, dark `rgb(240, 112, 46)`). A build that sets `--lit-a` on `main` only leaves the lit parts of the track covers and `inside` peach-to-orange and goes red.
- [E2E] Anatomy tint wins over `lumen.css` in all three theme paths: light: `--anatomy-hi` `#12171b`, `--anatomy-weight` `0.9px`, `--anatomy-paper` = `--cs-card`; dark with JavaScript on and dark with JavaScript off: `--anatomy-hi` `#f3f5f6` (lumen's is `#d2d8dc`), `--anatomy-face` `#1f2428` (lumen's `#1f2327`), `--anatomy-paper` = `--cs-card` `#1a1e21` (lumen's `#1c1f22`, H5). A build whose dark tint selector ties lumen's `(0,3,0)` in the media query and loses on order goes red in "dark, JavaScript off" only.
- [E2E] `.lm-led.on` inside `main`: `filter` none.
- [E2E] Nothing leaks: on `/how-the-internet-works/what-is-http` (1440, light), `.lm-defs stop.la` is `#ffc48f` (lumen's), the scene's `.lm-svg` has `animation-name: lm-draw-in`, `.nm-trail` keeps its `drop-shadow`, and `--fig-bg` on `main` is `#eef1f1`. A build that writes Home's tint into a global stylesheet goes red.

**15. No colour value outside the token block and the tint block (H10).**
- [UNIT] Read `index.astro`; cut out the text between the token block's opening and closing comments and the tint block's; what is left (styles and frontmatter) has no `#hex`, `rgb(`/`rgba(`, `hsl(`/`hsla(` and no named colour other than `transparent`/`currentColor`. Seed it: a test that passes on the file and fails when `#fff` is pasted into `.leg` or into a `css.push(...)` string.
- [UNIT] The two blocks exist and are non-empty; the token block's colour values are `var(--…)` only (A adds no colour value, §10); the tint block holds the §6 hexes. `index.astro` holds no `var(--link)`.

**16. Contrast (H11).**
- [E2E] 375 and 1440, light and dark, in Watch steps 1 and 3, Learn, and Practice with a wrong pick: every displayed, visible HTML text node in `main` outside `svg` is ≥ 4.5:1 against its composited background (inside `.demo`, the card). Measured minimum 5.03 light, 5.15 dark. A build that leaves the step sub-line at today's `--muted` 13px on `--here-soft` composited over the ground instead of the card is caught only if the walk stops at `.demo::before`: test that walk itself on one known pair.
- [E2E] §8's A pairs, each ≥ its figure − 0.05: e.g. filled button words on fill 5.62 / 6.40; step sub-line on the wash 5.22 / 5.15; here chip against its row 4.70 / 4.73; here marker against its tab 5.42 / 5.64; done tick on paper 4.64 / 9.17; request bar on a card 5.62 / 6.83; card edge on the ground 14.51 / 11.59. A build whose wash is drawn on the ground (no card under the row) lowers "title on the wash" and goes red.

**17. No sideways scroll at 320, 375, 768, 1440.**
- [E2E] At each width (height 800), light and dark, at the top and the bottom of the page, in Watch, Learn with the sources open, and Practice: `scrollWidth − clientWidth` is 0 (measured 0 at all four; Playwright's headless window has no classic scrollbar, so `innerWidth` = `clientWidth`, and `pageOverflow` works). A build whose dithered card or `.leg`'s right margin (`−18px + 4px`) overruns at 320 goes red at 320 only.
- [E2E] 320: nothing in `.demo__src` reaches past the card's right edge (`site.spec.ts:1575`'s "clipped" check, kept; its comment "The demo clips what overflows it" is no longer true with `overflow: visible`, the check still is).

**18. 375: cards 14px in, words at 32px.**
- [E2E] 375×812, light and dark: `.demo`'s left (the card is its `::before`, which spans it), each `.leg`'s left, `.facts__grid`'s and `.close__grid`'s left are 14 ±1 (measured 14, 14, 14, 14); the first text inside each starts at 32 ±1: the key's first `b` in the demo, each `.leg h3 a`, each card's `h2`. A build with `--out` on a scoped `main` (dead, H2) puts the demo and tracks at 32 and their words at 50, and goes red. A build that uses the `.wrap` gutter (32) minus 18 but forgets the cards' inner 16px puts words at 16+2 and goes red.
- [E2E] 390×844 (the phone project's width, run from a desktop `describe` or tagged `@phone`): the same 14 and 32 (the margins are fixed, so they hold).

**19. 1440×900 at the top: the tabs and ≥ 280px of the card on screen.**
- [E2E] 1440×900, light and dark, after `document.fonts.ready`, `scrollY` 0: the first tab's top ≥ 69 and its bottom ≤ 900; `900 − (.demo top + 50)` ≥ 280 (measured: tabs at 555.7, card from 605.7, 294px shown). A build with today's 132px headline (h1 `clamp(52px, 9.2vw, 132px)` left in place) pushes the card below the fold and goes red; one without `.demo`'s `margin-top: -50px` shows 244 and goes red.

### D16's fixes, in D17

**20. The phone's key and leaders; the desktop's drawn callouts.**
- [E2E] 375×812 and 320×640, light and dark: every displayed text element in `.demo__key` (`b`, `.demo__addr`, its `span`s, the sub-line `span`, `i`) has computed `font-size` ≥ 12px; there are 10 texts in D16 §2.2.3's order ("Your laptop", "192.168.1.100", "Wants example.net", "DNS resolver", "turns names into numbers", "192.0.2.53", "The internet", "routers pass messages along", "Web server", "203.0.113.80 · port 80") (D16 check 2); 4 `.demo__call`; 4 `.home-leads path` displayed; every `.nm-call` inside `.demo__scene` `display: none`.
- [E2E] 375×812, at each step 1 to 5: every lit `.home-trail`, every busy part at opacity 1 and `#nm-page` has a bounding box inside `.demo__crop`'s (±0.5) (D16 check 4). A build that keeps D16's crop numbers but changes the scene's padding or the SVG's width calc cuts the web server off and goes red at step 3.
- [E2E] 375×812: each `.home-leads path`'s x lies inside its callout's box, or within 8px of the right edge for the right-aligned "The internet" (D16 check 6). A build that draws the leaders in the viewBox's full frame instead of the crop's misses by tens of px.
- [E2E] 375×812: the drawing's scale (`svg` width / 685) is ≥ 0.55 (§7: 0.555; D16's own ≥ 0.6 is superseded by D17's 14px of desk each side); at 320, ≥ 0.46.
- [E2E] 1440×900: `.demo__key` `display: none` (both bands); the four callouts' `.nm-name` texts displayed, each `font-size × getScreenCTM().a` ≥ 12 (measured 12.1 with the scene's `padding: 12px 6px`). A build that keeps today's 12px side padding still passes (12.05); one that pads the scene 20px at the sides goes red.
- [E2E] 861×900: the key is not displayed and the callouts are (the breakpoint is `max-width: 860px`); 860×900: the reverse.

**21. The key's words are the drawing's; the viewBox stays.**
- [UNIT] `homeDemo()`'s key (whatever its shape) equals the texts read from `demo.scene`'s four `<g class="nm-call">` groups whose first `<text>` is "Your laptop", "DNS resolver", "The internet", "Web server", empty texts skipped, in the bands of D16 §2.2.3. Read them from the SVG in the test: a test against a hardcoded list passes a build that hardcodes the same list.
- [UNIT] With the registry swapped (`swapped`) to a lesson whose scene draws no "DNS resolver" callout, `homeDemo()` throws (D16 check 7).
- [UNIT] `demo.scene`'s `viewBox` is `-98 -60 685 378` (`net-map.test.ts:155` kept); `net-map.ts` is unchanged (`git diff revamp -- src/art/scenes/net-map.ts` empty, a review check).
- [UNIT] The crop `{ x: -78, y: -22, w: 604, h: 232 }` holds every point of every `home-trail` and every lead dot of lesson 1 (D16 check 7).
- [UNIT] The scene has one `<g class="home-leads" aria-hidden="true">` with 4 paths, each starting at its callout's `nm-lead-dot` (cx, cy) and ending at y −22 (laptop, resolver) or 210 (internet, web server), and 4 `r="3"` dots. A build that appends the leaders to every map (in `net-map.ts`) fails the `net-map.ts` check above.

**22. 375: taps move nothing.**
- [E2E] 375×812, light and dark (and once with JavaScript off): scroll (instant) so `.demo`'s top is 70; click the visible Next four times with `page.mouse.click` at its box's centre (not `locator.click`, whose own scroll-into-view would be counted), then "Go to Learn", "Go to Practice", the third answer, the Watch tab: `scrollY` unchanged after each; after each Next, the displayed `.demo__say`'s top and the visible `.demo__next`'s top and bottom are within 69 to 812 (measured: narration 560, Next 751-799). A build that keeps D16's `scroll-margin-top: 88px` moves 17px on "Go to Learn" (D17 §7) and goes red; one that anchors the step radio at the rows instead of `says` moves on Next.
- [E2E] 390×844: the same sequence moves nothing (the phone project's width).

**23. 375: a tile checks its step and moves nothing.**
- [E2E] 375×812: from step 1, `mouse.click` at `.demo__row[for="demo-s4"] .demo__n`'s centre: `#demo-s4` checked, `scrollY` unchanged, step 4's narration's top inside 69 to 812. (A `display: contents` label has no box, so click the tile, D16 §11.)

**24. 375: Next with the narration under the header comes back clear of it (H13).**
- [E2E] 375×812: step 1, scroll (instant) so `.demo__say--1`'s top is at y 40; click Next: `.demo__say--2`'s top ≥ 69 (measured 97, page back 57px). A build with `scroll-margin-top: 0` leaves it under the header and goes red; one with 88px gives 115 and passes (the 70px value is pinned by check 22's 0px on "Go to Learn").

**25. 375: Next sticks to the window's foot.**
- [E2E] 375×812: scroll so the middle of `.demo` is at the window's middle: the visible `.demo__nexts` has `position: sticky` and its bottom = 812 ±1 while `.demo`'s bottom > 812 (measured 812). A build that leaves `.demo` `overflow: hidden` (a scroll box) stops it sticking and goes red.
- [E2E] 375×812, Learn on show, the middle of the Learn pane on screen: Learn's `.demo__nexts` ("Go to Practice") is sticky with its bottom at 812 too (D16 §2.3.7).
- [E2E] 1440: `.demo__nexts` is `position: static` (the sticky bar is the phone's only).

**26. 1440: five Nexts move nothing.**
- [E2E] 1440×900, light and dark: scroll (instant) so `.demo`'s top is 70, then `mouse.click` the visible Next five times (four "Next step", then "Go to Learn"): `scrollY` unchanged each time (measured 486 → 486). Clicking from `scrollY` 0 with `locator.click` measures Playwright's own scroll, not the page's: a test written that way fails a right build.

**27. Tab order per part, also with JavaScript off.**
- [E2E] 375×812 and 1440×900, light and dark, scripts on and off (`javaScriptEnabled: false`): select the part with a pointer click on its tab, focus `.try__head a` ("HTTP"), press Tab, record `document.activeElement`: Watch → `#demo-watch`, the checked step (`#demo-s1`, or `#demo-s3` after choosing step 3), then "How the Internet Works" (outside `.demo`). Learn → `#demo-learn`, "Lesson 2: HTTPS". Practice → `#demo-practice`, `#demo-a1` with none picked (the checked one, `#demo-a2`, after picking it), "Open the whole lesson". Measured in the prototype at both widths.
- [E2E] Shift+Tab walks the same stops back. A build that hides the step radios with `aria-hidden` only (still focusable) puts a step stop in Learn and goes red; one that forgets the Learn rule for answers (`#demo-learn:checked ~ .demo__in--answer`) puts an answer stop in Learn.

**28. Rings and hints at each radio stop (H1).**
- [E2E] At each radio stop of check 27 (375 and 1440, light and dark, scripts on and off): the part's tab has `outline-style` solid, `outline-offset` −7px; the step's row (1440) or tile `.demo__n` (375) and the answer's option have `outline-style` solid, `outline-offset` 2px; that box's top ≥ 69 and bottom ≤ `innerHeight`. Exactly one `.demo__hint` is displayed, that group's, with top ≥ 69 and bottom ≤ `innerHeight` (fails at 375 and 390 for the answer hint with D16's 300px, passes with 324px; measured). A build that ties the tab ring to D16's −5px or keeps the generated `outline-offset: 2px` on tabs goes red.
- [E2E] After a pointer click (`mouse.click`) on a tab, then a step (row at 1440, tile at 375), then an option: no `.demo__hint` displayed. A build that shows the hints on `:focus` (not `:focus-visible`) goes red here; one that shows them on `:focus-within` of `.demo` goes red at the first stop (two hints).
- [E2E] With no keyboard focus in the demo (focus on "HTTP"), no hint is displayed.

**29. Radios a screen reader is offered per part.**
- [E2E] 375×812 and 1440×900: `getByRole('radio', { name: /^Watch, step / })` counts 5, 0, 0 and `getByRole('radio', { name: /^Answer: / })` 0, 0, 3 with Watch, Learn, Practice on show (replaces `site.spec.ts:250`'s 3 in Learn). A build that hides groups with `opacity: 0` alone keeps 5 and 3 everywhere and goes red.

**30. State survives a change of part.**
- [E2E] 1440×900 and 375×812: step 5, then Practice, pick the second answer, then Watch, then Practice: `#demo-s5` checked throughout, `#demo-a2` checked when Practice returns and its feedback displayed; `#nm-page [data-part="text"]` and `[data-part="pic"]` opacity 1 in Learn and Practice (`site.spec.ts:1738-1760` kept). A build that uses `display: none` plus a reset (e.g. a `<form>` and `type=reset` labels) would clear them.

**31. 375: touch sizes.**
- [E2E] 375×812: the three tabs (resting 46, on show 52), the five tiles (46), the visible Next (48), the three answers (≥ 48; the first is 69 when it wraps), the sources control (≥ 44) and every source link, closed and open (≥ 44: `site.spec.ts:1654-1659`) are each ≥ 44px tall. A build that keeps D16's 44px tiles passes 44 but fails §4.4's 46: assert 46 ±0.5 for the tiles and 46 / 52 for the tabs, not only ≥ 44.
- [E2E] D5's block stays ≤ 115 at 375 and ≤ 99 at 1440 (measured 113.1 and 97.1; H14).

**32. 1440: the demo's height through its states.**
- [E2E] 1440×900, light and dark, after fonts: `.demo`'s height 625 / 685 / 750 / 762 / 790 by step, 745 in Learn, 555 in Practice, ±2 (measured 625.1 / 685.5 / 750.5 / 762.1 / 790.0 / 745.2 / 555). A build that keeps D16's `min-height: 503px` (D17's is 555: D16's 503, the tabs' 50 and the two edges) gives Practice less than 555 and goes red; one that drops the two 2px edge rows gives 4px less everywhere and goes red at ±2.

**33. JavaScript off: the demo steps, shows Learn and answers.**
- [E2E] `site.spec.ts:1001-1011` kept, plus at 375×812 and 1440×900: Next steps to 2 and lights step 2's trail; the Learn tab shows `.demo__pane--learn`; Practice's first answer shows "Right." and its filled ring (check 13's computed `::before` background `--cs-done`). Dark with JavaScript off: the card edge is `--ink` (check 5).

## Notes for the builder and the orchestrator

- **Markup.** "Nothing beyond D16's" means D16's markup, which was never built: today's `index.astro` has no `.demo__in--part/--step/--answer` classes, no hints, no `.demo__crop`, no key, no `.demo__t`, no `--steps`; `home.ts` has no key reader, no crop and no leaders. B20 builds all of D16 §2 as well as D17.
- **The prototype's tracks count is stale.** It shows "18 of 20 lessons ready" and two empty pips; on `revamp` after batch 4 both tracks are complete ("14 lessons", "20 lessons", `site.spec.ts:264`). The words come from the data, so this is not drift. The pips' not-ready style (a 1.5px outline) cannot be seen on today's data; if it is to be tested, [E2E] inject an `<i>` without `data-ready` into `.leg__run` and read its `box-shadow` and `background`.
- **§5's "card from 608" at 1440** measures 605.7 (tabs at 555.7 plus the 50px tab row). Check 19's 280px holds (294).
- **The stamp.** `Stamp.tsx`'s output carries no cid, so the block's `.stamp[data-checked] svg` rule needs `:global`; in A it equals `site.css`'s own (`--allowed-text`), so either way the stamp's tick is right.
- **Generated rules.** §10's list for the tab on show omits the block's `box-shadow: none`; with today's inset line removed from the generated rule there is no shadow left to cancel, so the result is the same.
- **Page weight.** The key and the leaders add a few hundred bytes to Home's HTML; `npm run build` runs the 250 KB budget.
