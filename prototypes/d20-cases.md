# D20 cases: the spec review of B25 (job 21)

The spec review of `prototypes/d20-track-page-card-stack.md` and `.html` (revision 1, layout 1 Route, no lesson figures; frozen at `4d727c6`, direction 2.107), by `reviewer` (Opus), 2026-11-18, read on `revamp` at `9fe85f4`. Verdict: **HOLES (12)**: 11 with one answer, 1 that needs taste (low stakes: no track shows it today). None of them changes what the owner approved on screen at the drawn widths; H2 changes what a reader sees at 392 to 398px and 473 to 481px wide, back to what the spec promises.

Measured in headless Chromium (Playwright from the repo's `node_modules`) on the prototype served at `localhost:4479`, with its bar hidden (`#bar=0`), fonts loaded, and from the source and `dist/` at `9fe85f4`. The measuring scripts set each stop and the up-next card to every real lesson's words in turn, put the widest marks (Watch and Learn done, Practice bold) on every stop in turn, and swept the width 1px at a time. The holes come first, each with its answer or its question; the orchestrator numbers the errata. The attack cases follow, grouped by §11's checks, then the topics the brief named.

What the prototype already survives, measured (so a build that matches it passes these): the up-next card is 185.5px for every lesson of both tracks, in all three kinds, at every width from 320 to 1440; no stop changes height when progress loads at any width from 700 to 1440 (1px sweep, every lesson, in progress and done); no sideways scroll at any width from 320 to 1440 in first visit, part way and finished; a stop in progress grows 22.2px at 360 to 699 and 43.7px at 320; the Tab and Shift+Tab walks at 320 × 640, 375 × 812, 390 × 844, 1024 × 700 and 1440 × 900, the menu closed and (below 960) open, keep every focused stop's ring 13px or more under the header (14 with the menu open) and 10px or more above the window's foot, with 17 and 23 stops in `main`; page heights at 320, 375, 390 and 1440 are §11 check 33's to the pixel.

## Holes

### One right answer

- **H1. Check 4 cannot pass on How the Internet Works.** "'Start here' appears nowhere on either page", but that track's description, which `p.lede` shows as it is (§5.1, and no track word changes), reads "… one short lesson each. **Start here** if you are new to IT: Networking Concepts goes deeper." (`src/content/tracks/how-the-internet-works.ts:14`). **Answer:** the description stays; check 4 reads "'Start here' is in no element of `main` but `p.lede`: not the up-next tab, the button, a stop or the strip; on a first visit the tab reads 'First lesson'".

- **H2. The strip's words wrap by the count, so the page moves when progress loads at two bands of phone widths (§5.2, §12.13, check 16).** The strip's words are proportional figures and wrap under the squares when they no longer fit beside them. Measured, the `.strip` box is 19.5px (one line) or 41.5px (two):
  - How the Internet Works, **392 to 398px**: "0 of 14" one line at 393 to 397, "10 of 14" and "14 of 14" two lines (at 392 "0 of 14" wraps and "9 of 14" does not; `0` is wider than `9` in Atkinson).
  - Networking, **473 to 481px**: "0 of 20" one line, "10 of 20" or "20 of 20" two lines.
  
  393px is a common phone width (Pixel 7 and 8, several Galaxy models). There a returning reader's page grows 22px under the strip when the island loads, on top of the accepted 22px of the stop in progress; check 16's "same height on a first visit and with every lesson finished" and "at most 24px more" both fail at 393 (+22 and +44). §3 says the strip "restates Tracks' values under `.tk`", and Tracks fixed this exact fault as D18's E3 (`tracks.astro:189-199`: `font-variant-numeric: tabular-nums` and a hidden copy of the longest form, `--strip-longest`, on the card). The prototype's `.tk .strip__w` has neither. **Answer:** as Tracks' E3: the words keep the width of their longest form for that track ("14 of 14 lessons done", "20 of 20 lessons done"; with " · R ready" when some lesson is not ready, as `stripWords` writes it), tabular figures, so the wrap point does not depend on progress. Nothing changes at 320, 375, 390, 768, 1024 or 1440 (the words wrap at all of them in every state but How the Internet Works from 1200 up, where the longest form fits, 339.5px of 360).

- **H3. Check 34's "has not moved" cannot pass, and its "scrolled to the last stop" is not one scroll.** Measured on the prototype, the up-next button's top and foot (window y):

  | | scrollY 0 | stuck (any scroll from 16px until the end nears) | last stop `scrollIntoView({block:'end'})` | at the page's end |
  |---|---|---|---|---|
  | Networking 1440 × 900 | 617–665 | 600–648 | 600–648 | 324–372 |
  | How the Internet Works 1440 × 900 | 570–618 | 553–601 | 553–601 | 323–371 |
  | Networking 1280 × 720 | 599–647 | 584–632 | 584–632 | 143–191 |
  | Networking 1024 × 700 | 592–640 | 584–632 | 584–632 | 123–171 |
  
  The column starts 16px below its sticky top (header 68 + the page's 40px top padding = 108, against `top: 92px`), so it moves up 16px as soon as the page scrolls; and the column's grid area ends with the route, so at the page's end the column is pushed up (247px at 1440 × 900). The button is on screen and clear of the header in every one of these. **Answer:** check 34 (and §10's rewrite of `site.spec.ts:661`) reads: scroll the window from 0 to its end in steps of at most 150px; at every step the button is wholly on screen and its top is at or below the header's foot; from the first step past 16px until the last stop is in view, the button's top is constant (±1); `window.scrollY` reaches more than 0. At 1024 × 650 and 1440 × 699 the side column computes `position: static`; at 1440 × 700 `sticky`.

- **H4. Check 20 cannot pass against the block: the chip is 2px right of the rail, and inside the phone card it is 16px from the card's edge.** At 700 and up the rail is at `left: 16px`, 2px wide, so its middle is 17px into `.route`; each part's square's middle is at 17 too; but the chip's `left: -56px` is measured from the stop's padding box, which starts 58px in (56 of padding and the card's 2px border), so the chip's middle is at **19** (measured at 1440 on both tracks). Below 700 the chip's `left: 14px` is inside the 2px border: **16px** from the card's outer left edge (measured at 320, 375 and 390). §10: where this document and the block differ, the block is right. **Answer:** check 20 reads "each chip's middle is 2px right of the rail's (±1), level with its card's middle (±1)" and "below 700 the chip's left edge is 16px from its card's outer left edge (±1)". If the orchestrator would rather have the chip on the line, that is a design change (`left: -58px` and the tie at `left: -24px`), back to `designer`; the build reproduces the block.

- **H5. `lessonLine` has a user left: the Lesson page.** §10: "`lessonLine` has no user left and goes with its tests." `src/lesson/Explanation.tsx:8` and `:207` draw the Lesson page's up-next line with it ("Lesson 09 · …"), and the Lesson page is out of this job. **Answer:** `lessonLine` and its test (`src/lib/hub.test.ts:136-140`) stay; only `TrackSide` stops importing it.

- **H6. The not-ready square's rule never matches.** The block draws a not-ready lesson's square with `.tk .strip__sq i[data-state='']`, but `TrackStrip` (markup unchanged) writes `data-state={state || undefined}` (`TrackStrip.tsx:9`): a not-ready square has **no** `data-state` attribute, so it would take the `ready` look (a `--cs-edge` ring), not §5.2's `--cs-hair` ring. Tracks keys its three states on `[data-state]` for the same reason (`tracks.astro:176`). **Answer:** the selector is `.tk :global(.strip__sq i:not([data-state]))`. (Which look it gets is T1.)

- **H7. Removing `split`: the grep in §10 cannot come back empty, and a unit test pins the prop.** `grep -rn "split" src/pages src/layouts src/styles` still finds `src/pages/index.astro:42` (`text.split(…)`), `src/styles/global.test.ts:19` (`rule.split('{')`) and `src/layouts/BaseLayout.test.ts:1-28`, which renders `split: true` and expects `class="split"` on the body. **Answer:** `BaseLayout.test.ts`'s `split` test goes with the prop (its footer test and the `footer` prop stay: the Lesson page passes `footer={false}`, `[lesson].astro:48`); the `footer` prop's doc comment (`BaseLayout.astro:37-38`) loses "A split page turns it off"; the `body.split` block and its comment go from `global.css` (`:190-209`, the file's end). The check is `grep -rnE "\bsplit\b" src/pages src/layouts src/styles | grep -v "\.split("` printing nothing.

- **H8. Check 8 cannot pass as a substring test, and leaves out `meta`.** Today every entry in both islands' props also carries `certTags` (40 times on `/networking`; and `units`, `canonical`, `partTitle`, `stepCount`, `trackId`, `slug`), which §10 does not drop; "contains `tags`" is true of `certTags`. Check 8 also omits `meta`, which §10 drops. §12.17 says "only what they draw"; §10 and §7's measured 10.7 KB name five fields. **Answer:** by §10: no prop **key** `summary`, `meta`, `metaLabel`, `tags` or `note` (in the built HTML, `&quot;(summary|meta|metaLabel|tags|note)&quot;:` occurs 0 times); the other entry fields may stay or go, within check 9's bound. The fields the islands read must stay: an entry's `key`, `available`, `url`, `maxPosition`, `number`, `title`, `subtitle`; a lesson's `n`, `key`, `number`, `title`, `subtitle`, `ready`, `stamp`, `places[].parts`.

- **H9. §10's list of tests that pin today's page leaves some out.** Each goes red on a right build and changes once in B25: `e2e/site.spec.ts:599` (`.route-stage__head p`, the part's count), `:796` (`.stop__acts .btn` "Watch again"), `:873-886` (`.side-now__t`, `.side-now__art svg.name-tile`, the stop's `.stop__art svg.name-tile`), `:997-1001` (JavaScript off: `.stop__acts .btn` "Start"), the helpers `:59` (`routeBox`) and `:62` (`sideButton`, `.side-now__btn`); `e2e/load-balancers.spec.ts:177-182` (E5: `.stop__acts .btn` "Start", and its name "with its spot … and Start"); `src/components/progress-islands.test.tsx:56` (`.side-now` and "Start here"); `src/layouts/BaseLayout.test.ts` (H7); `src/lib/hub.test.ts:133` (the kicker map). The path is `src/lib/tracks-render.test.ts` (there is no `src/pages/tracks-render.test.ts`). **Answer:** each changes once, as the cases under "The tests that pin today's page" say, each listed in B25's report with what it asserted and what it asserts now.

- **H10. The 341px scroll padding outlives the menu on a wide window.** `html:has(#menu-panel:not([hidden]))` holds whenever the panel is open, but from 960px up the panel is `display: none` whatever its `hidden` (`SiteHeader.astro:160-163`) and the header is 68px. Open the menu at 900, widen the window to 1200 (or turn a tablet), and every Tab after that lands focus 341px down the window. **Answer:** the 341px rule sits inside `@media (max-width: 959px)`.

- **H11. Two comments go false, and §3 says no line of `card-stack.css` changes.** `card-stack.css:2-3` says it is "Imported by Home … and the Tracks page … only"; `tracks.astro:159-160` says "hub.css is not edited: the track page keeps its own strip". After B25 both are wrong, and a build review files a wrong comment as a fix. **Answer:** each of those two comments is corrected (the track page is the third importer; `hub.css` now holds only the strip and `.wholetrack`, and each page draws its own strip); no rule, selector or declaration of either file changes, and Home and Tracks render the same. The check on `card-stack.css` is "its diff touches only lines 1 to 4", not "its diff is empty".

### Taste (to `designer`)

- **T1. A lesson that is not ready: which look in the strip?** §5.2 draws it 10 × 10 with a `--cs-hair` ring at full opacity; Tracks keeps `hub.css`'s faint look (opacity 0.6, the `--line-strong` ring, D18's E10), and §3 says the strip "restates Tracks' values". No track has a lesson not ready today, so no reader sees either. If unanswered, build §5.2's look (the block, with H6's selector).

## Errata (the orchestrator, 2026-11-18)

Closed from the holes above; where an erratum and the spec differ, the erratum wins, and the cases below already read this way.

- **E1** (H1): check 4 as H1 answers: "Start here" only in `p.lede` (How the Internet Works' description, unchanged).
- **E2** (H2): the strip's words keep the width of their longest form for the track, with tabular figures, as Tracks' D18 E3, so the wrap point does not move with progress.
- **E3** (H3): check 34 and `site.spec.ts:661`'s rewrite as H3 answers (stepped scroll; on screen and clear of the header at every step; constant once stuck; `static` below 700px tall).
- **E4** (H4): the chip's middle is **on** the rail (±1), as the designer's last edit meant ("chip moved 2px to centre on the rail"): `left: -58px` and the tie from `-24px`, measured from the stop's padding box; below 700 the chip's left edge is 16px from the card's outer edge (±1), as drawn. A 2px correction to the drawn intent, not a change to the look.
- **E5** (H5): `lessonLine` and its test stay (the Lesson page uses it); only `TrackSide` stops importing it.
- **E6** (H6): the not-ready square's selector is `:not([data-state])`; its look is E12.
- **E7** (H7): `split` goes as H7 answers, with `BaseLayout.test.ts`'s `split` test and `global.css`'s `body.split` block; the `footer` prop stays; the grep as H7 gives it.
- **E8** (H8): check 8 as H8 answers: no prop key `summary`, `meta`, `metaLabel`, `tags` or `note`; the fields the islands read stay.
- **E9** (H9): every test H9 lists changes once, each named in B25's report with what it asserted before and after; the path is `src/lib/tracks-render.test.ts`.
- **E10** (H10): the 341px scroll padding sits inside `@media (max-width: 959px)`.
- **E11** (H11): the two comments (`card-stack.css:2-3`, `tracks.astro:159-160`) are corrected; no rule of either file changes; `card-stack.css`'s diff touches only lines 1 to 4.
- **E12** (T1, the designer's ruling): a lesson not ready keeps Tracks' faint square (D18's E10): 10 × 10, the `--line-strong` ring, opacity 0.6, so the strip means one thing on both pages; §5.2's full-opacity square is the designer's own erratum.

## Attack cases

**How to read the tags.** **[E2E·B]**: an end-to-end test that only a real browser can try (layout, computed styles, pseudo-elements, focus and Tab order, scroll, sticky, contrast, `:has()`, `:focus-visible`, `:active`, hydration, JavaScript off). **[E2E]**: an end-to-end test that needs the served site but no rendering (`page.request`, a redirect, the HTML's text). **[UNIT]**: vitest: an island rendered with seeded progress (as `TrackSide.test.tsx` does), the page rendered with `experimental_AstroContainer` and JSDOM (as `src/lib/home-page.test.ts` does), or a file's text. **[BUILD]**: reads `dist/` after `npm run build`, no browser.

**Viewports and themes.** The `phone` project (390 × 844) runs only `@phone` tests, so every 320, 375, 393 and 768 case sets its own window inside a desktop `describe`: `test.use({ viewport: { width, height }, isMobile: false, hasTouch: false, colorScheme })`. "Light and dark" is two `colorScheme` runs; "dark, JavaScript off" (`javaScriptEnabled: false`, `colorScheme: 'dark'`: no `data-theme`, the media query alone) is a third path, named where it matters. Measure after `document.fonts.ready`. Resolve a token through a probe element (`el.style.color = 'var(--cs-edge)'`, then `getComputedStyle(el).color`), never by string-matching `getPropertyValue`. Every read after a state, focus, scroll or theme change waits with `transitionsDone(page)` (and, after a scroll, a `settledFrame`), and each such test is proved with `--trace=off --repeat-each=10` in the `reduced-motion` project and one default project.

**Progress seeds** (`localStorage['techconcepts:v2']`, keyed by slug, set before the page loads with `addInitScript`, or by one `goto('/')` then `evaluate` where a test reloads; each record `{ status, furthestPosition, lastOpened }`):
- **S0 first visit**: nothing stored.
- **S1 part way**: `what-is-http`, `what-is-https`, `what-is-tcp` finished; `what-is-udp` in progress at 4 (`site.spec.ts:861`'s state). How the Internet Works: "3 of 14 lessons done", tab "Up next" with the marker, chip `here` "Lesson 04", title "UDP", button "Continue" to `/how-the-internet-works/what-is-udp?step=4`, UDP's stop `stop--now` with its marks. Networking, which shares HTTP and HTTPS (its 14 and 15): "2 of 20 lessons done", "Up next", chip `here` "Lesson 01", **Start** to `/networking/osi-model`, OSI Model's stop `stop--now` with "Not started" and no marks.
- **S2 next not started**: `what-is-http` to `what-is-tcp` finished only: chip 04 `here`, **Start** to `…/what-is-udp` with no `?step=`.
- **S3 finished**: all 14 How the Internet Works slugs finished (S3n: all 20 Networking slugs): "14 of 14", chip `done` "Lesson 14", "✓ Done so far", "Watch again".
- **S4 shared lesson**: `what-is-http` in progress at 2: How the Internet Works chip "Lesson 01", Networking chip "Lesson **14**", each "Continue" to its own track's URL with `?step=2`.
- **S5 storage blocked**: `Storage.prototype.getItem` throws; **S5b**: reading `window.localStorage` itself throws a `SecurityError` (`Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('denied', 'SecurityError'); } })`).
- **S6 two in progress**: `what-is-tcp` in progress (`lastOpened` 10:00) and `what-is-dns` in progress (11:00): DNS is up next; TCP's stop says "In progress" with its marks, plain `stop`, paper chip, no wash.
- **S7 two-digit count**: the first ten lessons of the track finished, the eleventh in progress ("10 of 14", "10 of 20").
- **S8 Networking part way, as the prototype draws it**: `osi-model`, `packets`, `ip-address`, `mac-address`, `router` finished; `switch` in progress at a Watch place: "5 of 20", chip `here` "Lesson 05", "Continue".

### What the page says (checks 1 to 9)

**1. One `div.wrap.tk`, in order, no `em`, no box.**
- [UNIT] Container render of each track page: `main` has exactly one child element `div.wrap.tk` (ignoring the islands' inline `<script>`); in document order `nav.crumbs`, `h1`, `p.lede`, `.strip`, `.upnext`, `div.route`, `p.route__end`; `main em`, `.routebox`, `.routebox__in`, `.side-now`, `.site-foot` inside `main`: 0. The footer is `main`'s next sibling (the layout's, not the page's). A build that keeps `footer={false}` and renders `<SiteFooter />` inside `.tk` goes red.
- [UNIT] `h1` has one text node, equal to the title ("Networking Concepts", "How the Internet Works"); the crumb is the link "Tracks" to `/tracks`, the `/` separator `aria-hidden`, then the title with `aria-current="page"` (`site.spec.ts:708`'s test, unchanged, green).
- [UNIT] The `BaseLayout` call: `<body>` has no `split` class; `main` is `#main`. A build that leaves `split` on (the window locks to one screen at 1024 and up) goes red here and on check 34.

**2. Six parts, in order, with their counts.**
- [UNIT] `/networking`: 6 `section.route-stage`, each `aria-labelledby` an `h2` that exists, h2 texts "The big picture", "Addresses & the local network", "Getting between networks", "Talking across the internet", "The web", "Protecting & scaling traffic"; counts "2 lessons", "4 lessons", "3 lessons", "4 lessons", "3 lessons", "4 lessons"; 20 `li.stop` in `networking.ts`'s order. `/how-the-internet-works`: `INTERNET_PARTS`, counts ending "1 lesson" for The seal (a build that writes "1 lessons" goes red); 14 stops.
- [UNIT] Each `p.route-stage__count` is the `h2`'s next sibling and the `ol.route-stops` the count's; no `header.route-stage__head`, no `.route-stage__mark`.

**3. One link a stop, the chip, the stamp.**
- [UNIT] Each ready `li.stop` (S0 and S1): `li a` count 1, inside `h3`, its `href` the lesson (S1's UDP: `?step=4`); `li button, li .btn` 0; `span.stop__node` `textContent` "Lesson NN" with `span.sr-only` "Lesson " inside; `p.stop__sub` equal to the lesson's subtitle; one `.stop__k`; one `.stamp` matching `/^Checked \d{1,2} [A-Z][a-z]{2} \d{4}$/` with no `a` inside. A build that keeps the figure's `a.stop__art` (even `tabindex=-1`) goes red (two links).
- [UNIT] The four shared lessons on `/networking` link to `/networking/<slug>`, not to the tour's (`site.spec.ts:604`).
- [UNIT] A partly ready track (the fixture of `progress-islands.test.tsx` or `track.test.ts`): a not-ready `li.stop.stop--soon` has the chip, an `h3` with no `a`, `.stop__k` "Not ready yet", no `.stamp`, no `::after` target; `p.route__end` then starts "Lessons not ready yet stay on the route, so you can see what is coming. ".

**4. "Start here" (H1).**
- [E2E·B] Both pages, S0, S1, S3: no element of `main` but `p.lede` contains "Start here"; S0's `.upnext__k` is "First lesson"; How the Internet Works' `p.lede` still contains "Start here if you are new to IT" (the description untouched). A build that blanks the lede's phrase goes red; one that keeps `UP_NEXT_KICKER.start` "Start here" goes red.
- [UNIT] S1 on Networking (kind `next`, the next lesson 01): the tab is "Up next", not "First lesson". A build that picks the words by "is the lesson up next lesson 1" goes red.

**5. One button.**
- [E2E·B] 1440 and 375, S0 to S3: `main .btn` count 1, it is `.upnext__btn`, an `a`; its border box's width equals the card's content box (card width − 2 × 2px border − 2 × 18px padding, ±1); `main button` 0 (`site.spec.ts:698`'s check stays).

**6. The last line.**
- [UNIT] How the Internet Works: `p.route__end` text "Ready for more? Networking Concepts goes deeper.", its one `a` to `/networking`; Networking: "New to IT? How the Internet Works is the gentler start.", `a` to `/how-the-internet-works`. White space: exactly one space before and after the link (a build that breaks the paragraph over lines so Astro drops the space before the link goes red: "Ready for more?Networking").

**7. No drawing, no slot, four scripts.**
- [UNIT] Container render: in `main`, `svg.name-tile`, `.lm-svg`, `svg[role="img"]`, `.nt-full`, `[data-art]`, `.stop__slot`, `.stop__art`, `.side-now__art`: 0; `main svg` count = ready lessons (14 / 20), each inside a `.stamp`. No `astro-slot`, no `<template data-astro-template`.
- [BUILD] `dist/networking/index.html` and `dist/how-the-internet-works/index.html`: `<script` occurs 4 times each (as on `revamp` `9fe85f4`: the theme boot, the header's module, Astro's two island scripts); `<template`, `astro-slot`, `data-astro-template`, `name-tile`, `lm-svg`, `routebox`, `side-now` occur 0 times. A build that hides the figures with CSS (`display: none`) goes red here and on check 9.
- [UNIT] `[track]/index.astro` imports neither `lessonFigure` nor `figures`; `src/lib/figures.ts` is still imported by `src/pages/[track]/[lesson].astro` (the Lesson page's next-lesson figure). `TrackSide`'s and `TrackRoute`'s `Props` have no `art${number}` index signature and no `children`; `BorrowedArt` is gone.

**8. The props (H8).**
- [BUILD] In each built page, `&quot;(summary|meta|metaLabel|tags|note)&quot;:` occurs 0 times. A build that drops `tags` but keeps `meta` goes red; a substring test for `tags` that is red on `certTags` is a wrong test.
- [E2E·B] S1 on the built pages: the button's `href` is `/how-the-internet-works/what-is-udp?step=4`; S4 on `/networking`: `/networking/what-is-http?step=2`; S3: "Watch again" to `…/what-is-tls` with `?step=<maxPosition>` if its record has a position. A build that trims `url` (an `href` of `undefined?step=4`) or `maxPosition` (`?step=NaN`, or no cap: a record at position 99 must give `?step=<maxPosition>`) goes red.
- [UNIT] The page's container render's `props` for each island, parsed, rendered into the island with S1 seeded: the same hrefs. This tests the page's field picker, not a hand-made fixture.

**9. The weight.**
- [BUILD] `gzipSync` at the default level (the build's own measure, `scripts/check-budgets.mjs:34`; 1 KB = 1,000 bytes): `dist/networking/index.html` ≤ **16,000** bytes (expected about 11,000; 221,900 today), `dist/how-the-internet-works/index.html` ≤ **13,000** (about 9,000; 11,800 today). Record the build's table rows before and after in the report. A build that keeps one figure in the up-next card (OSI Model's spot is about 13 KB gzipped) goes red on Networking.
- [BUILD] `npm run build` ends "Every page is within budget".

### The islands' states (checks 10 to 16)

**10. First visit, storage blocked.**
- [UNIT] `TrackSide` and `TrackRoute`, S0, How the Internet Works' entries: `.upnext[data-kind="start"]`; `.upnext__k` "First lesson" with no `cs-tab--here`; `.upnext__n[data-state="ahead"]` `textContent` "Lesson 01"; `.upnext__t` "HTTP"; `.upnext__s` "Asking for web pages"; one `a.btn.btn--primary.upnext__btn` "Start" to `/how-the-internet-works/what-is-http`; 14 `.strip__sq i[data-state="ready"]`, none `current`; `.strip__w` "0 of 14 lessons done"; every `.stop__k` "Not started" with no `go` or `done` class; `.stop--now`, `.stop--done`, `.wlp`: 0. Networking: "Lesson 01", "OSI Model", Start to `/networking/osi-model`, "0 of 20 lessons done".
- [UNIT] S5 and S5b: the same render, nothing thrown, nothing logged to `console.error`.
- [E2E·B] S5 and S5b on the built pages at 375 and 1440: the page's height equals S0's (±1), the same words as S0, no page error.

**11. A lesson in progress.**
- [UNIT] S1: `.upnext__k` "Up next" with `cs-tab--here`; chip `here` "Lesson 04"; "UDP", "Quick, no guarantees"; "Continue" to `…/what-is-udp?step=4`; squares 1 to 3 `done`, the fourth `current`, the rest `ready`; UDP's `li` has `stop stop--now` and not `stop--done`; its `.stop__k` "In progress" with class `go`; it holds one `.wlp` with `role="img"` and `aria-label` "In progress, at <part>" (the part of position 4 in UDP's `places`), whose three `.wlp__p` read "Watch", "Learn", "Practice" with exactly one `is-now`; its `h3 a` ends `?step=4`.
- [UNIT] In progress at position 0: "Continue" and the stop's link go to the plain URL (no `?step=`); the marks' label is "In progress" with no "at".
- [UNIT] S6: DNS is up next (the later `lastOpened`), whatever the order in the track; TCP's `li` is `stop` only (no `stop--now`, no wash), "In progress" with its own `.wlp`; one `current` square, DNS's. A build that marks every in-progress lesson `stop--now` goes red.
- [UNIT] S4: How the Internet Works' chip "Lesson 01", Networking's "Lesson 14", each Continue to its own track's URL. A build that numbers by the slug's home track goes red on Networking.

**12. One finished, the next not started.**
- [UNIT] S2: "Up next" with the marker; chip `here` "Lesson 04"; button **"Start"** to `…/what-is-udp`, no `?step=`; UDP's `li` `stop--now`, "Not started", no `.wlp`; TCP's `li` `stop--done`, `.stop__k` "✓ Done" with class `done`. A build that maps kind `next` straight to "Continue" goes red.

**13. Everything finished.**
- [UNIT] S3: `data-kind="done-so-far"`; "✓ Done so far" with no marker; chip `data-state="done"` with "Lesson 14" in its text (the number is kept on this page, unlike Tracks' tick); "TLS/SSL"; "Watch again"; 14 `done` squares, 0 `current`; every `li` `stop--done`; no `.stop--now`. A build that copies Tracks' done chip (`font-size: 0` and a tick) goes red on check 19's "the number's text is shown".

**14. The up-next line.**
- [UNIT] In S0 to S4, `.upnext__s` equals the lesson's `subtitle` exactly (no "Lesson", no "·"); `lessonLine` is still exported and `hub.test.ts:136-140` is green (H5); `TrackSide.tsx` does not import it.

**15. JavaScript off.**
- [E2E·B] `javaScriptEnabled: false`, 375 and 1440, light, dark, dark by the system: check 10 in full on both pages; every lesson link's `href` is its lesson (follow three, each 200 and the right `h1`); the button goes to the first lesson; the header's `.theme-toggle` is hidden; `button:visible` 0 (`site.spec.ts:987`'s test, rewritten for the stop's one link).
- [E2E·B] JavaScript off, dark system: card edges and the button's edge compute to `--ink` (`card-stack.css`'s `:root:not([data-theme])` twin): a build that writes its own dark edge under `[data-theme='dark']` only goes red.
- [E2E·B] JavaScript off at 1024 × 768 and 1440 × 900: the side column is sticky and the page scrolls (`astro-island`'s `display: contents` is in the static HTML, so `.route` is still the grid's item): the route sits in column 2, right of the side column (`.route` left > `.side` right).

**16. What moves when progress loads (the accepted 22px below 700px, nothing at 700 and up).**
- [E2E·B] **The server's render against the hydrated one**, S1 stored: hold the islands' scripts (`page.route('**/_astro/TrackSide*.js')` and `'**/_astro/TrackRoute*.js'`, released after the first read, as `tracks-card-stack.spec.ts`'s arrival test does), record every `li.stop`'s top and height, `.upnext`'s and `.strip`'s boxes, `document.documentElement.scrollHeight`; release; `hydrated`; `transitionsDone`; read again:
  - at 700, 768, 1024, 1200 and 1440: every box and the page's height equal (±1);
  - at 375 and 390: UDP's stop is 22px taller (±2), every box above it unchanged, every box below it 22px lower (±2), the page 22px taller (±2); at 320 the same with 44px (±2). `.upnext` and `.strip` unchanged at every width.
  
  The browser's scroll anchoring can hide a shift from `scrollY`, so the boxes are read, not the scroll position.
- [E2E·B] **H2**: How the Internet Works at 393 × 852 and 395, Networking at 476 and 480, S0 against S7 (and against S3, S3n): `.strip`'s height equal (±1) and the page's height equal (±1) apart from the stop in progress. Against the prototype as drawn this case is red (19.5 against 41.5px).
- [E2E·B] Sweep, 1px from 320 to 1440, both tracks, S0 against S3 / S3n (no lesson in progress, so nothing may move at any width): the page's height equal (±1). Red on the prototype at 392 to 398 and 473 to 481 (H2); green everywhere else.
- [E2E·B] The up-next card is 186px (±1) for every lesson of both tracks put up next in turn (seed the lessons before it finished, it in progress; then it not started), at 320, 360, 375, 390, 412, 768, 1024 and 1440, in each of the three kinds. Measured on the prototype: 185.5 at all of them. A build that drops `min-height: 2.9em` goes red for every lesson whose subtitle fits one line.
- [E2E·B] Every lesson put in progress in turn (S-style seed, its marks at Practice, the widest), at 700, 767, 768, 1023, 1024, 1199, 1200 and 1440: its stop's height equals its first-visit height (±1). A build that puts the two-line form at 700 to 767 or 1024 to 1199 goes red at 700 and 1024 (measured with the two-line form forced: 4 and 7 of Networking's stops grow when their marks appear).
- [E2E·B] First visit, S5, S5b and JavaScript off: the page's height equal (±1) at 320, 375, 390, 768 and 1440, light.

### The look (checks 17 to 27)

**17. The up-next card.**
- [E2E·B] 1440 and 375, light, dark, dark by the system: `.upnext` every side `2px solid` in `--cs-edge`; radii `0 10px 10px 10px`; `box-shadow` the pair `6px 6px 0px -2px <card>, 6px 6px 0px 0px <edge>` at 1440 and `4px` at 375 (and at 860; 6px at 861); its tab 34px tall (±0.5), `border-bottom-width` 0, its foot within 2px of the card's top border edge, its left = the card's left (±1); `elementFromPoint` at the tab's centre returns the tab (a build with `overflow: hidden` on the card hides the tab and goes red). S1: the tab's `::before` 9 × 9 in `--cs-here`; S0 and S3: `content: none`.
- [E2E·B] 375: the card's left 14px (±1) from the window's left; at 1440 its width ≤ 480px; at 700 to 860, 14px from the window's left and at most 480px wide.

**18. A stop.**
- [E2E·B] 1440, 1024 and 375, light and dark: every `li.stop` has a 2px `--cs-edge` border, 10px corners, `background-color` `--cs-card`, `box-shadow: none`. Heights, first visit: 1440 and 1200: 81 (±2), name and subtitle left (the `h3`'s left = the subtitle's left), status and stamp right-aligned in one column (`.stop__state`'s right and `.stamp`'s right = the content box's right ±1, the state above the stamp); 1024 and 700: 108 (±2), status left and stamp right on one line under the subtitle (same top ±2); 768: 81; 375: 110 (±2); 320: 110 or 132 by lesson (Networking's 1, 2, 3, 5, 7, 8, 9 and 20 take two subtitle lines at 320, measured).

**19. Chips.**
- [E2E·B] Every `.stop__node` and `.upnext__n`: 34 × 34, a 2px `--cs-edge` border; S0: `--cs-card` ground, `--ink-strong` number; S1's `stop--now` and the card's `here`: `--cs-here` ground, `--cs-here-ink` number; `stop--done` and `done`: `--cs-done` ground, `--cs-card` number; `font-size` 14px and the number's text visible (not 0, not transparent) in every state.

**20. The rail (H4).**
- [E2E·B] At 700, 768, 1024 and 1440: `.route::before` 2px wide, `--cs-hair`; each part's `h2::before` 16 × 16 in `--cs-edge`, its middle on the rail's middle (±1); each chip's middle 2px right of the rail's middle (±1, as the block draws it) and level with its card's middle (±1); `.stop::before` 20 × 2px in `--cs-edge` from the chip's right edge to the card's left edge (±1). Below 700 (699, 375, 320): `.route::before`, `h2::before` and `.stop::before` compute `content: none` (or zero size); each chip's left edge is 16px from its card's outer left edge (±1) and its top 14px below the card's top (12 + 2, ±1).
- [E2E·B] 699 against 700: one has no rail and the chip inside the card, the other the rail; no sideways scroll at either.

**21. The strip.**
- [E2E·B] 1440 and 375, S1, light and dark: `ready` squares 10 × 10, `background-color` transparent, `opacity` 1, an inset 1.5px `--cs-edge` ring; `done` 10 × 10 in `--cs-done` with the same ring; the `current` one 10 × 14 in `--cs-here` with the ring; each row 14px tall in S0 and S1 alike. A build that lets `hub.css`'s 9 × 12 or its `box-shadow: none` on `done` win (a rule not under `.tk`, or not `:global`) goes red.
- [E2E·B] 320: Networking's 20 squares on one row (2px gaps below 360: the row's height 14). 360: 3px gaps.
- [E2E·B] `.strip__w`: the sans face (`font-family` starts with Atkinson Hyperlegible Next, not the mono), 15px, `--muted`, tabular figures (`font-variant-numeric` `tabular-nums`, H2).
- [UNIT] A partly ready track (the `progress-islands.test.tsx` fixture): a not-ready square has no `data-state` attribute (TrackStrip as it is) and the page's not-ready rule is written `:not([data-state])` (H6, read from the page's `<style>`). [E2E·B] cannot try it: no built track has a lesson not ready.

**22. The wash.**
- [E2E·B] S1 and S2, light and dark: the `stop--now` `li`'s `background-image` is a `linear-gradient` of `--cs-here-wash`, its `background-color` still `--cs-card`; every other `li`'s `background-image` is `none`. S6: TCP (in progress, not up next) has no wash.

**23. The button.**
- [E2E·B] 1440 and 375, light and dark: ≥ 48px tall, `border-width` 2px, `--cs-edge`, radius 8px, `box-shadow` `3px 3px 0px 0px <edge>`; `mouse.down()` at its centre, then `transitionsDone`: `transform` `matrix(1, 0, 0, 1, 2, 2)`, `box-shadow` `… 1px 1px 0px 0px`; after `mouse.up()` and `transitionsDone`, back. A build that lets `site.css`'s `.btn:active { transform: scale(0.97) }` win goes red (a scale matrix). This is the one read on the page that a CSS transition can race (80ms; 0.01ms in `reduced-motion`): it must not read on a guessed frame.
- [E2E·B] Focused by keyboard: radius 8px (not 3px: the page's `a:not(.btn):focus-visible` rule must not reach it), an outline ≥ 2px.

**24. Links.**
- [E2E·B] 1440 and 375, light and dark: the crumb's link, every stop's `h3 a`, the last line's link: `text-decoration-line` underline, a decoration colour with alpha > 0, `color` not `--link` resolved; hover on a stop (anywhere on the card) turns its name's underline to `currentColor`. Focused by keyboard, the crumb's and the last line's link have 3px corners.

**25. Contrast.**
- [E2E·B] 1440 and 375, light and dark, S0, S1 and S3: every pair in §8 from the drawn colours (walk up and composite: the wash over the paper), each at or above its figure −0.05; every displayed text node in `main` ≥ 4.5:1 against its composited ground, the lowest being the done chip's number in light (4.64) and the stamp's tick on the wash (4.93); graphics ≥ 3:1 (the done square on the ground 3.87 light); the focus outline (`--focus`) ≥ 3:1 on `--ground` and on the wash.

**26. Header and footer.**
- [E2E·B] 1440 and 375, light and dark: on `/networking` and on `/about` (which also has no lesson figure; `/tracks` for the "Start learning" button's absence) the `.site-head`'s background, `border-bottom`, nav links' colour and radius, and `.site-foot`'s background, border and link colours are equal; `.site-head` computes `position: sticky` at 375, 1023, 1024 and 1440 (today `relative` at 1024 and up). A card part written unscoped (`.btn` rather than `main .btn`, a bare `a {…}`) changes the header or footer and goes red.
- [E2E·B] The footer is after `main` (`main + footer.site-foot`), its full width, at the page's end.

**27. Home and Tracks are unchanged (what `card-stack.css` may and may not gain).**
- [UNIT] `git diff revamp -- src/styles/card-stack.css` touches only its header comment (lines 1 to 4, H11): no selector, declaration, token or `@media` added, removed or edited; no rule in it names `.tk`, `.stop`, `.route`, `.upnext`, `.strip` or `.wlp`. A build that adds the stop or the strip to the shared file (it is the track page's alone, §3) goes red.
- [UNIT] `tracks-render.test.ts:197-203` rewritten: `card-stack.css`'s importers are exactly `src/pages/[track]/index.astro`, `src/pages/index.astro`, `src/pages/tracks.astro` (no island, no layout, no `.css` importing it). A build that imports it in `TrackSide.tsx` (so it lands on every page that ever shows the strip) goes red.
- [UNIT] `tracks-render.test.ts:205-208` rewritten: `git diff --name-only e6441c2 -- src/components/hub/TrackStrip.tsx src/components/hub/useUpNext.ts src/styles/tokens.ts src/components/SiteHeader.astro src/components/SiteFooter.astro` prints nothing (the track page, `hub.css` and `hub.ts` leave the list; `useUpNext.ts`, `TrackStrip.tsx` stay on it: plan decision 6 keeps the islands' progress logic).
- [UNIT] `hub.css` after B25 holds exactly the seven `.strip…` rules, as they are today byte for byte, and `.wholetrack` with its hover; no `.wlp`, `.panel__cta`, `.next`, `.side-now`, `.route`, `.stop`. Tracks still imports it.
- [UNIT] `UP_NEXT_KICKER` is `{ start: 'First lesson', next: 'Up next', 'done-so-far': '✓ Done so far' }`; `TrackPanelProgress`'s render on a first visit reads "First lesson" with or without its own `KICKER` (if the override goes, `TrackPanelProgress.test.tsx`'s kicker tests stay green unchanged); `Explanation.tsx` (the Lesson page) still reads `UP_NEXT_KICKER.next` and `lessonLine`.
- [E2E·B] **Screenshots**: `/` and `/tracks`, full page, 375 × 812 and 1440 × 900, light and dark, S0 and (for `/tracks`) S1, `animations: 'disabled'`, after `document.fonts.ready`: taken on `revamp` before B25's first commit and after its last, pixel-identical (a diff of 0). Then the same for `/about`, `/glossary` and one lesson page (`/networking/dhcp`) at 1440 dark: the `BaseLayout` and `global.css` edits (H7) reach every page.
- [E2E·B] `/tracks`, 1440 and 375, S1: strip squares 10 × 10 (`current` 10 × 14), the words 15px sans; its up-next kicker "First lesson" in S0. A Lesson page at its end (`/how-the-internet-works/what-is-http`, "That’s the whole lesson."): `.explain__end .upnext__k` "Up next" and `.upnext__line` "Lesson 02 · " then HTTPS's subtitle (the Lesson page keeps `lessonLine`, H5).
- [E2E·B] `--cs-edge` on `:root` is still empty on `/about`, `/glossary`, `/does-not-exist` and `/networking/dhcp` (`tracks-card-stack.spec.ts:793-798` with `/networking` taken out of its list), and set on `/networking` and `/how-the-internet-works`.

### Layout, scroll and the keyboard (checks 28 to 36)

**28. The open header, and the scroll padding (H10).**
- [E2E·B] 320, 375, 390 and 959 wide: click `#menu`; `.site-head`'s height 329 (±2); `getComputedStyle(document.documentElement).scrollPaddingTop` `341px`; Escape: `80px` again. With JavaScript off the menu never opens and the padding is `80px`.
- [E2E·B] **H10**: at 900 open the menu, resize to 1200, `transitionsDone`: the padding is `80px` (the header 68px); Tab from the header into `main`: the crumb's top is under 200px. Against the prototype as drawn this case is red (341px).
- [E2E·B] `tracks-card-stack.spec.ts:612-621` rewritten: `scroll-padding-top` is `80px` on `/tracks`, `/networking` and `/how-the-internet-works`; `auto` on `/`, `/about`, `/glossary`; `69px` on `/networking/dhcp`. The page's `:global(html)` rule reaches no other page (a build that writes it in `global.css` or `BaseLayout` goes red on `/about`); one that writes `html { … }` without `:global` (scoped to an attribute `html` never carries) goes red on `/networking`.

**29. No sideways scroll; nothing scrolls inside `main`.**
- [E2E·B] At 320, 359, 360, 375, 390, 393, 699, 700, 767, 768, 860, 861, 1023, 1024, 1199, 1200, 1280 and 1440, S0, S1 and S3, light: `scrollWidth === clientWidth` at the top and at the page's end; no element in `main` has a right edge beyond the window (the up-next card's card beneath included: 357 at 375); no element in `main` has `overflow` `auto` or `scroll` with `scrollHeight > clientHeight`. Measured on the prototype at every width from 320 to 1440: none.

**30. The Tab and Shift+Tab walk, the menu closed** (direction 2.89's follow-up, on this page).
- [E2E·B] At 320 × 640, 375 × 812, 390 × 844, 1024 × 700 and 1440 × 900, both tracks, S1 (and S0 at 375 and 1440), light: from the page's top press Tab until focus leaves `main` for the footer, `transitionsDone` and a `settledFrame` after each press. The stops in `main` are exactly, in order: "Tracks" (the crumb), the up-next button, each lesson's `h3 a` in route order, the last line's link: **17** on How the Internet Works, **23** on Networking. At every stop the focus ring's box (a lesson: its `li`'s border box grown by 5px, the outline's offset and width; otherwise the element's box grown by its own outline) has its top ≥ `.site-head`'s bottom and its foot ≤ `innerHeight`. Then from the footer's first link press Shift+Tab back to the crumb, the same reads. Measured on the prototype: forward ≥ 22px clear of the header (38 at 1440); back ≥ 13px (15 at 1024 and 1440); the foot ≥ 10px clear of the window's.
- [E2E·B] A build that writes the stop's `scroll-margin` on the `li` instead of the `a` (focus scrolls by the focused element's own margin) goes red at 320 × 640 going forward (the card's foot under the window's); one that leaves out the root's scroll padding goes red going back at every width (each lesson's ring under the 68px header).
- [E2E·B] At 1440 × 900 and 1024 × 700 the button is in the sticky column: Shift+Tab from the first lesson to the button and on to the crumb leaves `scrollY` where the first lesson put it or less, and both are wholly on screen below the header.
- [E2E·B] The skip link ("Skip to content") is the first Tab; Enter on it, then Tab: focus is on the crumb, clear of the header.

**31. The same walk with the menu open.**
- [E2E·B] At 320 × 640, 375 × 812 and 390 × 844, both tracks, S1: click `#menu`, focus `#menu`, press Tab through its five links into `main` and on to the footer, then Shift+Tab back to the crumb (the menu stays open: only a link's click or Escape closes it). At every stop in `main` the ring's top ≥ the open header's bottom (≈ 329) and its foot ≤ `innerHeight`. Measured on the prototype: ≥ 14px clear (22 forward); the foot ≥ 10px clear. A build with no 341px rule, or with it set to 80px, goes red.

**32. A card is one target.**
- [E2E·B] Keyboard focus on a lesson: the `li`'s `outline-style` solid, 2px, `--focus`, offset 3px; the `a`'s `outline-style` none. Mouse click on a stop's link: no ring (`:focus-visible` only).
- [E2E·B] Click at a stop's subtitle, at its stamp, at its status word, and 4px in from its bottom-right corner (1440 and 375): each navigates to that lesson (the `h3 a::after` covers the card above the stamp: `z-index: 1`). On a phone, a click on the chip inside the card also opens the lesson; at 1440 a click on the chip on the rail does nothing (it is outside the card), and is not an error.
- [E2E·B] A screen reader's names (the accessibility tree, `page.accessibility.snapshot()` or `getByRole`): each stop's link is named by the lesson's title alone ("OSI Model", not "Lesson 01 OSI Model Not started…"); the list item contains, in order, the text "Lesson 01", the heading level 3 "OSI Model", the subtitle, "Not started", the stamp's words; `.wlp` is an image named "In progress, at <part>"; the headings are one `h1`, six `h2`, one `h3` a lesson.

**33. Page heights.**
- [E2E·B] S0, light, ±40px: How the Internet Works / Networking 2,365 / 2,910 at 1440 × 900; 3,499 / 4,330 at 375 × 812; 3,652 / 4,686 at 320 × 640; 3,474 / 4,305 at 390 × 844 (measured on the prototype: these to the pixel). Record 768 × 1024 (2,825 / 3,371) and 1024 × 700 (2,740 / 3,451) in the report, beside today's 7,129 / 9,544 at 375.

**34. The sticky side column at short windows (H3).**
- [E2E·B] At 1440 × 900, 1280 × 720, 1200 × 700, 1024 × 700 and 1920 × 1080, both tracks, S0 and S1: `.side` computes `position: sticky`, `top` 92px; the window scrolls (`scrollY` > 0 after a wheel of 600 over the side column, which today does nothing); scroll from 0 to the end in steps of at most 150px, `settledFrame` after each: the button is wholly on screen at every step with its top ≥ the header's bottom; from the first step past 16px until the last stop is in view, its top is constant (±1); at the end it may have risen (to 323–372 at 1440 × 900, measured) and is still on screen.
- [E2E·B] At 1440 × 699, 1024 × 650 and 1440 × 600: `position: static`; at the page's end the button is above the window (it scrolls away with the column). At 1440 × 700: sticky (the boundary is inclusive).
- [E2E·B] At 1023 × 900: one column (the head above the route), not sticky, the route 40px under the head.
- [E2E·B] `site.spec.ts:661` and `:687` rewritten as these two cases (no `.routebox`, no `.side-now__art`, `pageOverflow(page).down` > 0 at 1440 × 900). A build that keeps `split` on the body (the window locked to one screen, `overflow: hidden`) goes red on `scrollY` > 0.
- [E2E·B] Page Down and Space with focus on the page's body scroll the window at 1440 × 900 (today they do nothing until the route box has focus); the browser's find (`window.find('Load Balancers')`, or the stop scrolled into view by its link's `focus()`) brings the stop on screen.

**35. The phone cards' edges.**
- [E2E·B] 375 and 320, light: each `li.stop`'s left 14 (±1) and right `innerWidth − 14` (±1); the up-next card's left 14 and its card beneath's right edge ≤ `innerWidth`; the `h1`, the lede and the part names start at 32 (±1).

**36. Ways into the page.**
- [E2E·B] From a lesson (`/networking/dhcp`), click the Lesson page's crumb link to the track (`.track__title`) and, at the lesson's end, "Back to the track": each lands on `/networking` with `scrollY` 0 and the `h1` in view. A test that claims "arriving from the lesson" clicks the link; it does not `goto` the track page.
- [E2E] `/networking/how-the-internet-works`, `…?step=7` and `…/` forward to `/how-the-internet-works` (`site.spec.ts:718`, unchanged, green).
- [E2E] `lesson-layout.spec.ts:661` (case 36) still lists every lesson from `/networking`'s HTML: its regex on `href="/networking/…"` and its `Set` give the 20 lesson paths (one link a lesson now, and the button's, which repeats the first).
- [E2E·B] From `/tracks`, click Networking's name: `/networking`, `scrollY` 0 (`site.spec.ts:531`).

### The tests that pin today's page, each changed once (§10's last bullet, with H9)

Each line: where, what it asserts today, what it asserts after B25. The build review checks each changed expectation against the spec: a test changed to agree with a wrong build (an expectation dropped rather than moved to the new markup) is a blocker. Everything not on this list is not in the diff.

- [UNIT] `src/lib/tracks-render.test.ts:197-203`: importers of `card-stack.css` are Home and Tracks → the three pages (check 27). `:205-208`: the track page, `hub.css`, `hub.ts` leave the "not in the diff since `e6441c2`" list; the other five stay.
- [UNIT] `src/layouts/BaseLayout.test.ts:1-28`: `split` puts `class="split"` on the body → that test goes; the footer test stays (H7).
- [UNIT] `src/components/hub/TrackSide.test.tsx`: "Start here" (`:28-38`) → "First lesson" in the tab; the figure tests (`:62-66`, `:67-79`, `:126-142`, `:143-155`) go; Continue and Watch again (`:39-54`) move to `.upnext__btn`, with the chip's `data-state` and "Lesson NN"; blocked storage and hydration (`:80-125`) kept for the new markup; "no route on the page" (`:156-164`) kept.
- [UNIT] `src/components/hub/TrackRoute.test.tsx`: the `em` (`:56-66`) → the `h2` is one text node and the count is `p.route-stage__count`; the figure link (`:83-92`), the keyed figure (`:128-136`), `data-art` (`:186-…`) go; every assertion on a stop's button goes, replaced by "one `a`, in the `h3`" (check 3); the in-progress stop (`:93-107`) keeps `stop--now`, `.stop__k.go` and the `.wlp`; the not-ready stop (`:67-82`) gets the chip and loses `.stop__tile` and `.stop__art`.
- [UNIT] `src/components/progress-islands.test.tsx:56`: "Start here" inside `.side-now` → "First lesson" in `.upnext__k`; the rest of the test (the strip and DHCP's stop cleared at once) unchanged.
- [UNIT] `src/components/hub/TrackPanelProgress.test.tsx:56-60`: `UP_NEXT_KICKER.start` is "Start here" ("the track page keeps it") → it is "First lesson"; the box's "not Start here" half stays.
- [UNIT] `src/lib/hub.test.ts:133`: the kicker map → `start: 'First lesson'`. `:136-140` (`lessonLine`) unchanged (H5).
- [E2E·B] `e2e/site.spec.ts:59` and `:62`: `routeBox` goes; `sideButton` becomes `main .side .upnext__btn`.
- [E2E·B] `e2e/site.spec.ts:588`: `h1 em` "Concepts" → `h1 em` count 0 and the `h1` "Networking Concepts"; `:599`'s `.route-stage__head p` → `.route-stage__count`; the first stop's `.stop__acts .btn` "Start", its `href` and `btn--primary` (`:611-613`), and `main .route .btn--primary` count 1 (`:614`) → the first stop's `h3 a` to `OSI_PATH`, `main .route .btn` count 0; `.side-now__k` "Start here" (`:615`) → `.upnext__k` "First lesson"; the side button's words and `href` kept with the new selector; `main button` 0 kept.
- [E2E·B] `e2e/site.spec.ts:639`: "a name tile on each of 14 stops" (`:648-650`: `svg.name-tile`, its `aria-label`, two `.nt-full`) → no `svg` in any stop but the stamp's, and the test's name loses "and a name tile"; `h1 em` "Works" → count 0.
- [E2E·B] `e2e/site.spec.ts:661` and `:687`: the window does not scroll, the route box scrolls; `.side-now__art` hidden at 1280 × 720 → check 34's two cases (H3).
- [E2E·B] `e2e/site.spec.ts:796`: DHCP's `.stop__acts .btn` "Watch again" → DHCP's `.stop__k` "✓ Done" (already there) and its `h3 a` to `/networking/dhcp` with `?step=` as `lessonHref` gives; the button is the up-next card's, which then reads "Start" to the next lesson.
- [E2E·B] `e2e/site.spec.ts:873-886`: `.side-now__t` "UDP" → `.upnext__t`; the two `svg.name-tile` reads (`:881-882`) go (no drawing on the page; the borrowed figure is gone); `sideButton` "Continue" to `…?step=4` and UDP's `stop--now` kept.
- [E2E·B] `e2e/site.spec.ts:997-1001` (JavaScript off): the first stop's `.stop__acts .btn` "Start" and `href` → its `h3 a`'s `href`; the side button kept with the new selector; `button:visible` 0 kept.
- [E2E·B] `e2e/load-balancers.spec.ts:177-182` (E5): `.stop__acts .btn` "Start" → `.stop__k` "Not started"; the test's name loses "with its spot" and "and Start"; its `h3` and subtitle reads stay.
- [E2E·B] `e2e/batch1.ts:85-96` `checkCard`: `svg[role="img"]` with its `aria-label` → `toHaveCount(0)`; the stop once and its index kept; its 11 callers (`arp`, `ip-address`, `nat`, `load-balancers`, `packets`, `mac-address`, `proxies`, `ports`, `switch`, `tcp-udp`, `vpn`) unchanged if `aria` is kept and unread. A build that drops the index check (the one guard on each lesson's place in the track) goes red at review. Each spot's description is still checked in its lesson's own spec on the lesson page: `grep` shows each of the 11 `ariaOf(…)` values still asserted there.
- [E2E·B] `e2e/router.spec.ts:186`: the same one assertion → count 0; the name loses "shows Router's spot … with its description"; index 7 kept.
- [E2E·B] `e2e/tracks-card-stack.spec.ts:612-621`: `/networking` `auto` → `80px`, `/how-the-internet-works` added (check 28). `:776-792`: "the track page keeps its Patch strip and buttons" (9 × 12, mono 13px, "Start here", no 2px edge) → the track page wears Card stack: 10 × 10 squares, 15px sans words, "First lesson", the button's 2px edge and `3px 3px 0` shadow, light and dark. `:793-798`: `/networking` leaves the "no Card stack names" list.
- [E2E·B] `e2e/visual.spec.ts`'s `track` and `track-internet` shots change by design; they assert nothing.

### Reads that need `transitionsDone` in the `reduced-motion` project

Under `prefers-reduced-motion: reduce` every transition still runs, for 0.01ms (`global.css:179-188`), so a read right after a change can see the old value. On this page the only transition is the button's (`main .btn`: `transform` and `box-shadow`, 80ms, from `card-stack.css`); nothing else animates, and the page sets no `scroll-behavior` (a case: `getComputedStyle(document.documentElement).scrollBehavior` is `auto` on both track pages, so focus and `scrollTo` move the window at once). A wait is still owed after every change, because a wrong build can add a transition (Patch's `.btn` has `background-color 150ms`):

- the button pressed (`mouse.down`) and let go (check 23): the one read a transition races today;
- the button hovered (its fill, check 23), a stop hovered (its underline, check 24);
- after each Tab and Shift+Tab of checks 30 and 31, before reading the ring and the boxes (plus a `settledFrame` for the scroll);
- after opening and closing the menu (check 28) and after the resize of H10;
- after the theme button (light to dark on the same page) before any colour or contrast read (checks 17 to 25);
- after hydration with seeded progress (`hydrated`, then `transitionsDone`) before any state, box or height read (checks 10 to 16, 22);
- after each scroll step of check 34 (`settledFrame` too);
- JavaScript off: `transitionsDone` polls from Node, so it serves there too.

Each such test is proved with `--trace=off --repeat-each=10` in `reduced-motion` and in `d1440-dark`, and the `phone`-tagged ones in `phone`.

### Every end-to-end measure the design changes

What a test of today's page measures, today's value, and B25's (the before-and-after table of the job's report):

| Measure | Today | B25 |
|---|---|---|
| Page height, How the Internet Works / Networking, 1440 × 900 | 900 / 900 (one screen) | 2,365 / 2,910 |
| The same, 375 × 812 | 7,129 / 9,544 | 3,499 / 4,330 |
| 320 × 640 | 7,257 / 9,897 | 3,652 / 4,686 |
| 390 × 844 | | 3,474 / 4,305 |
| `pageOverflow().down` at 1440 × 900 | 0 | > 0 |
| `window.scrollY` after scrolling to the last stop, 1440 | 0 (the route box scrolls) | > 0 |
| `.routebox` scrollHeight / clientHeight, 1440 | 3,861 / 5,018 in 831 | no `.routebox` |
| `.site-head` `position` at 1024 and up | `relative` | `sticky` |
| The footer | inside `.routebox` | after `main` |
| Root `scroll-padding-top` | `auto` | `80px`; `341px` with the menu open (below 960) |
| Tab stops in `main` | 31 / 43 | 17 / 23 |
| A stop's height | 179 at 1440; 347 to 371 at 375 | 81 at 1440 (108 at 1024 and 700); 110 at 375 (132 at 320 for 8 Networking lessons); +22 in progress below 700 (+44 at 320) |
| Whole lessons on the first screen, 1440 × 900 | 3 | 6 |
| The up-next button's foot, 1440 × 900 | y 782 | y 618 / 665 at the top, 601 / 648 once stuck |
| The up-next card's height | varies (figure) | 186 in every state, every lesson, every width |
| Strip squares | 9 × 12 | 10 × 10 (`current` 10 × 14) |
| Strip words | mono 13px | sans 15px, tabular (H2) |
| Up-next kicker, first visit | "Start here" | "First lesson", on the card's tab |
| Up-next line | "Lesson NN · subtitle" | the subtitle; "Lesson NN" in the chip |
| `main .btn` count (How the Internet Works / Networking) / its border / its shadow | 15 / 21, 1px, none | 1 / 1, 2px `--cs-edge`, `3px 3px 0` |
| `main .btn--primary` in the route | 1 | 0 |
| `--cs-edge` on `:root` | empty | `--ink-strong` (light), `--ink` (dark) |
| `h1 em` | "Concepts" / "Works" | none |
| Lesson figures in `main` (`svg[role="img"]`, `svg.name-tile`) | one a stop and one in the side card (OSI Model's and HTTP's, each twice) | 0 |
| `main svg` | figures and stamps | the stamps' ticks only (14 / 20) |
| Gzipped HTML, the build's table | 11.8 / 221.9 KB | ≤ 13 / ≤ 16 KB (about 9 / 11) |
| `<script>` elements | 4 / 4 | 4 / 4 |
| Sideways scroll | none | none |

## Notes

- **The side column slides up at the page's end** (H3's table): at 1440 × 900 the column's top goes 155px above the window as the footer arrives, so the crumb, the name and the strip leave the screen while the button stays. That is how the prototype behaves, and §2's "stays on screen at every scroll" is about the button; a build that matches it is right.
- **Two lessons in progress** (S6) on a phone grow two stops, 44px: the owner accepted 22px a stop in progress.
- **"Watch again" goes to `?step=`** when the finished lesson's record has a position (`lessonHref`, today's behaviour), on the up-next card and on a done stop's link.
- **Networking's up-next card says "Up next" on a first visit to Networking** when the reader has finished a lesson the tour shares (S1): today's `upNext`, as on Tracks; not this unit's to change.
- **`hub.css`'s first line** ("The lesson console's track strip") is out of date already; B25 rewrites the file, so its comment can say what it holds now.
- **The `@visual` shots** of the two track pages change by design and are for a person.
