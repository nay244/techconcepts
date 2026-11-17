# D18 cases: the spec review of B21 (job 18)

The spec review of `prototypes/d18-tracks-card-stack.md` and `.html`, **layout 1, Stack, only** (approved as drawn, direction 2.87), by `reviewer` (Opus), 2026-11-16, on `claude/elated-haibt-d4bd88` at `8d9f2bc`. Layout 2's rules are ignored except where they share markup. Verdict: **HOLES (10)**: 8 with one answer, 2 that need taste. One of the taste holes (H9) touches what the owner approved: the spec's promise that nothing moves when progress loads does not hold for every lesson on a phone.

Measured in headless Chromium on the prototype (its bar removed), with every real lesson's title and subtitle (read from today's built `/tracks`) put into the up-next box in turn, and from `dist/` and the source at `8d9f2bc`. The holes come first, each with its answer or its question; the orchestrator numbers the errata. The attack cases follow, grouped by §11's checks, then the topics the brief named.

## Holes

### One right answer

- **H1. Home's tests cannot stay unchanged (plan, decision 5; spec §3).** `src/lib/home.test.ts:311-346` (case 15) and `:348-360` cut the `TOKENS BEGIN … TOKENS END */` and `FIGURE TINT BEGIN … FIGURE TINT END */` blocks out of `src/pages/index.astro` and `expect` both to be there (`:316-317`, `:324-325`), and the first test wants `--cs-edge` in the token block and `#12171b` / `#f3f5f6` in the tint. Moving the two blocks to `src/styles/card-stack.css` turns both tests red. **Answer:** the two blocks keep their marking comments in `card-stack.css`; the two tests read the blocks from `card-stack.css` and scan the rest of **both** files for colour values (so a hex cannot slip into the shared file's card, tab or button parts); `var(--link)` is absent from both. These two tests are the only Home tests that change, and they keep what they assert. `src/lib/home.ts:322`'s comment ("tokens of the Card stack (src/pages/index.astro)") points at the new file.
- **H2. The prototype's Part 1 lacks Home's dark twins (§3 against §10).** Part 1 (`.html:159`, `:210`) writes dark only as `[data-theme=dark]`. Home's blocks also have `@media (prefers-color-scheme: dark) { :root:not([data-theme]) … }` for `--cs-edge` (`index.astro:359-363`) and for the figure tint (`:1381-1394`). §10 says the block wins where they differ; §3 says "moved as is". **Answer:** Home's blocks, moved as is, twins included. Without them Home with JavaScript off in a dark system draws `--ink-strong` edges, and Home is no longer the same.
- **H3. The strip's words can wrap in one state and not another (§5.3, §12.12, check 14).** The caption's width grows by a digit as lessons are done ("0 of 14" to "14 of 14"), and the strip wraps its words to a second line when they no longer fit. Measured on the prototype, How the Internet Works at **400px**: 423px tall at a first visit, **445px** with "14 of 14 lessons done"; Networking at **480px**: 423 to **445**, at **485px**: 384 to **406**. Check 14 only looks at 320, 375, 768 and 1440, where it holds. **Answer:** the words keep the width of their longest form whatever the count (e.g. `.strip__w` with `font-variant-numeric: tabular-nums` and a `min-width` equal to "M of M lessons done" for that track), so the wrap point does not depend on progress. Nothing changes at the drawn widths.
- **H4. The focused button's corners (§5.6 against the block).** In the prototype the focused Start button computes `border-radius: 3px`: `.tp a:focus-visible` (`.html:233`) ties `main .btn:focus-visible` (`.html:175`) at (0,2,1) and comes later. §5.6 says buttons are as D17 §4.2: `--cs-r-in`, 8px. In the build the scoped `.tp a:focus-visible` will not reach the island's anchors at all (they carry no Astro scope attribute), so the build will differ from the prototype either way. **Answer:** focused `.btn` 8px; focused links that are not buttons (the head's two, the track names, "See the whole track") 3px, which for "See the whole track" needs the rule written `.tp :global(a:not(.btn):focus-visible)` (otherwise it takes `global.css`'s 4px).
- **H5. The move can change Home's focused buttons (§3, "renders the same").** Today Home's `.btn:focus-visible` is scoped: `.btn[data-astro-cid-lcdefpme]:focus-visible`, (0,3,0), and beats Home's own scoped `a[data-astro-cid-lcdefpme]:focus-visible { border-radius: 3px }`, (0,2,1) (both in `dist/_astro/index.*.css`). Moved as `main .btn:focus-visible`, (0,2,1), it ties that rule, and the page's own stylesheet comes after an imported one, so the opening's two buttons and the closing section's go from 8px to 3px corners when focused. The plan's screenshots do not show focus. **Answer:** Home's focused anchor buttons keep 8px (e.g. Home's rule becomes `a:not(.btn):focus-visible`, or the shared rule keeps its weight). It is the only scoped Home rule that targets `a` or `label` at a weight the move ties (read from the built CSS); nothing else of Home's button rules changes winner.
- **H6. `.tp .isl { display: none; }` (`.html:247`) is the prototype's.** It sits in Part 2 but serves the state switch (Part 3). **Answer:** not built. A build that copies it and names a wrapper `isl` hides the island.
- **H7. Check 6 gives no number.** "As many `<script>` elements as today's" does not say how many, and the container render and the built page count differently. **Answer:** count both on `revamp` at `8d9f2bc` before the change and pin each number in its test.
- **H8. `useUpNext` does not change.** The plan names `useUpNext` with the island, but the spec puts the new kicker map in the island and changes nothing in the hook; `TrackSide` and `TrackRoute` (the track page) read it. **Answer:** `src/components/hub/useUpNext.ts`, `TrackStrip.tsx`, `hub.ts` and `hub.css` are not in the diff.

### Taste (to `designer`)

- **H9. The up-next box's height depends on which lesson is next (§12.12, check 14).** The prototype measures the four states with short subtitles only (and Networking shows the OSI Model in all four). With every real lesson put in the box in turn, How the Internet Works is the same height for all 14 at every width, but **Networking is not**:
  - 375: 445px for lessons 1, 3, 4, 6, 9 to 19; **466px** for 2 (Packets), 5 (Switch), 7 (Subnetting), 8 (Router) and 20 (VPN), whose subtitles take two lines.
  - 360: 491 (1, 2, 3, 5, 7, 8, 9, 20) or 469 (the rest); 320: 508 or 486 (13 to 17); 390: 466 for 5 and 20; 412: 466 for 20. 430, 768, 1000 and 1440: the same for all 20.
  
  So a reader who comes back part way through Networking on a phone sees the card grow or shrink 21 to 22px when progress loads, and A+ moves with it. Check 14 passes or fails by which lesson a test seeds. Ways out: the subtitle kept to one line (ellipsis, the whole in a `title` or not); room for two lines always (the box 21px taller than drawn wherever the subtitle fits one line); or the promise narrowed to "moves only when the next lesson's words need another line". **This changes what the owner approved**: the drawn heights, the subtitle's words, or the spec's "nothing moves".
- **H10. A lesson that is not ready has no look in the strip (§5.3).** `stripStates` gives it `''`; `hub.css` draws it faint (opacity 0.6); Part 2's `.tp .strip__sq i` sets `opacity: 1` and the same 1.5px ring as `ready`, so on Tracks a lesson not written yet looks exactly like one not done. No track has one today (14 of 14, 20 of 20 ready), but `tracks-page.test.ts:20` covers a partly ready track and A+ will become one. How should it look?

## Attack cases

**How to read the tags.** **[E2E]**: only a real browser can try it (focus, Tab order, scroll, computed sizes and styles, pseudo-elements, contrast, `:focus-visible`, `:active`, hydration, JavaScript off): a test in `e2e/site.spec.ts`. **[UNIT]**: vitest, on `trackCards()`, the island rendered with seeded progress (as `TrackPanelProgress.test.tsx` does), the page rendered with `experimental_AstroContainer` and JSDOM (as `src/lib/home-page.test.ts` does), or a file's text. **[BUILD]**: reads `dist/` after the build, no browser (an e2e spec can do it, since Playwright's web server builds first).

**Viewports and themes.** As D17's cases: the `phone` project (390 × 844) runs only `@phone` tests, so every 320, 375 and 768 case sets its own window inside a desktop `describe`: `test.use({ viewport: { width: 375, height: 812 }, isMobile: false, hasTouch: false, colorScheme })`; the 1440 cases set `{ width: 1440, height: 900 }`. "Light and dark" is two `colorScheme` runs; "dark, JavaScript off" (`javaScriptEnabled: false`, `colorScheme: 'dark'`: no `data-theme`, the media query alone) is a third path, named where it matters. Measure after `document.fonts.ready`. Resolve a token through a probe element (`el.style.color = 'var(--cs-edge)'`, then `getComputedStyle(el).color`), never by string-matching `getPropertyValue`.

**Progress seeds** (`localStorage['techconcepts:v2']`, keyed by lesson **slug**, set before the page loads with `addInitScript`; each record `{ status, furthestPosition, lastOpened }`):
- **S0 first visit**: nothing stored.
- **S1 in progress**: `what-is-http`, `what-is-https`, `what-is-tcp` finished, `what-is-udp` in progress at position 4 (the state `site.spec.ts:858` ends in): IHW "3 of 14", chip 04 here, Continue to `/how-the-internet-works/what-is-udp?step=4`.
  Networking, which shares HTTP and HTTPS, reads "2 of 20 lessons done", "Up next", chip 01 here, **Start** to `/networking/osi-model` (the next-not-started state on the other card).
- **S2 next not started**: `what-is-http` to `what-is-tcp` finished only: IHW "3 of 14", chip 04 here, **Start** to `/how-the-internet-works/what-is-udp`.
- **S3 all done**: all 14 IHW slugs finished: "14 of 14", chip 14 done, Watch again.
- **S4 shared lesson**: `what-is-http` in progress at position 2. Both tracks show it (progress follows the slug): IHW chip **01**, Networking chip **14** (its own number), each Continue to its own track's URL.
- **S5 storage blocked**: `localStorage.getItem` throws (as `TrackPanelProgress.test.tsx:113`).
- **S6 long subtitle**: `osi-model` finished, so Networking's next is 02 Packets ("Cut up, sent apart, put back together").

### What the page says (checks 1 to 7)

**1. The head, the paragraphs, three articles, no outro, no `em`.**
- [UNIT] Render the page: `main h1` reads "Pick a track" and holds no element; then a `div` with exactly two `p`; the second's text is today's outro word for word ("New to IT? Start with How the Internet Works, then go deeper with Networking Concepts. Every lesson is Watch, Learn, then Practice.") with its two links to `#how-the-internet-works` and `#networking`; then `article.panel` ids `how-the-internet-works`, `networking`, `comptia-a-plus` in that order. A build that keeps the outro at the foot as well (the sentence twice) goes red: the sentence occurs once in `main`.
- [UNIT] `main em` count 0 (today's `Pick a <em>track</em>` and each name's `<em>` last word are gone). A build that keeps `head`/`last` and wraps the last word in `<span>` passes this but goes red on the name text (next case).
- [UNIT] Each `h2.trk__name`'s text equals the track's title exactly ("How the Internet Works", "Networking Concepts", "CompTIA A+"), with one text node (no split word).

**2. The tabs.**
- [UNIT] `.cs-tab` texts in order "Start here", "Then go deeper", "Not ready yet"; `.cs-tab--here` count 1, on the first. Each tab is the article's second child, after `.trk__art` and before the `h2` (§10's order). A build that takes the tab words from `STATUS_WORDS` passes the words; one that marks every tab `--here` goes red.
- [UNIT] "Start here" occurs exactly once in `main` on a first visit (the tab), and "Not ready yet" exactly once (A+'s tab, no `.h-chip`). A build that keeps `UP_NEXT_KICKER.start` in the box goes red (twice).

**3. Two name links (and `e2e/global-setup.ts:16-20`).**
- [E2E] 1440: `main article.panel h2 a` resolves to exactly `['/how-the-internet-works', '/networking']`, in order; A+'s `h2` has no `a`. A build that gives A+'s `h2` a link (even to `#comptia-a-plus`) goes red (three).
- [E2E] `e2e/global-setup.ts` is not in the diff, and the full CI pass starts (it throws "The Tracks page links to no track." otherwise). Break it to see: rename `h2` to `h3` on the names and the whole run stops at setup.
- [E2E] Clicking the Networking name goes to `/networking` (kept from `:524`).

**4. A+ has nothing to press.**
- [E2E] 1440 and 375: inside `#comptia-a-plus`: `a, button, [tabindex], .strip, .btn, input, select` count 0; `.trk__soon` reads "Lesson 1 is being written. Each lesson will follow the A+ exam objectives." (collapsed white space: a period, then one space; the first sentence in `b`). A build that writes "Lesson 1 is being written" without its period, or runs the two sentences together with no space, goes red.
- [E2E] "Coming soon", "Lessons on the way" and `·` before a subtitle occur nowhere in `main` (`toContainText` inverted on `main`), in S0 and S1.
- [E2E] Tabbing through the whole page never lands inside `#comptia-a-plus` (record `document.activeElement.closest('article')?.id` at each Tab).

**5. Three Tab stops a ready track, in order.**
- [E2E] 1440, 1000 and 375, S0 and S1: from the head's second link, Tab visits exactly: IHW name, its `.btn`, its "See the whole track", Networking name, its `.btn`, its "See the whole track", then the footer's first link. A build that leaves the box a link (`a.upnext`) adds a fourth stop and goes red.
- [UNIT] The island's markup order is the strip, then `.upnext`; inside it the kicker, the line, the subtitle, then `.upnext__go` with the `.btn` before `.wholetrack`. A build that puts "See the whole track" first (and floats it right) goes red.
- [E2E] Each stop shows a focus ring (`outline-style` not `none`, width ≥ 2px); the `.btn`'s `border-radius` is **8px** focused and the name's and "See the whole track"'s **3px** (H4). A build with `global.css`'s 4px on "See the whole track" goes red.
- [E2E] Focus is never hidden under the sticky header: at 375, Shift+Tab back up from the footer, each focused element's top ≥ the header's bottom (68). If today's page fails this too, it is a note for the site, not this unit's blocker.

**6. Scripts, templates, three drawings.**
- [UNIT] The container render has the number of `<script` measured on `revamp` before the change (H7), no `<template data-astro-template`, no `astro-slot`, and exactly three `.lm-svg` in `main`, one per `article`, inside `.trk__art[aria-hidden="true"]`. A build that keeps one figure in the box (a fourth and fifth `.lm-svg`) goes red.
- [UNIT] The three covers are `lm-web`, `lm-networking`, `lm-aplus`, in article order; each root `<svg>` has `preserveAspectRatio="xMidYMid slice"` exactly once and `viewBox="30 20 540 378"`; no nested `<svg>` got the attribute. A build that string-replaces every `<svg ` goes red if the cover has a nested one; one that adds it twice (an invalid duplicate attribute, first wins) goes red.
- [UNIT] Every `id` in the rendered page is unique (the `tracks-<cover>` tags on each cover; `<id>-h` on each `h2`), and each `article[aria-labelledby]` points at an `h2` that exists.
- [UNIT] `trackCards()`: each ready card has `cover` (`web`, `networking`) and no `figures`; `tracks-page.ts` no longer imports `lessonFigure`; `:36`'s A+ object is unchanged.
- [UNIT] The island takes no `art<n>` and no `children` props (its `Props` type), and renders with `entries`, `known`, `trackUrl` alone.

**7. The page's weight.**
- [BUILD] `gzip -9` of `dist/tracks/index.html` ≤ **70,000 bytes** (spec: about 57 KB; today 213,329). Also record the build's own budget table's row for `/tracks/` before and after (it counts differently: 214.9 KB today). A build that keeps the 34 lesson figures in hidden markup goes red (about 200 KB).
- [BUILD] `dist/tracks/index.html` holds no `<template` and the strings `data-astro-template` and `astro-slot` 0 times.

### The island's states (checks 8 to 14)

**8. First visit, storage blocked, no JavaScript.**
- [UNIT] Island, S0, IHW entries: `.upnext[data-kind="start"]`; `.upnext__k` "First lesson"; `.upnext__n[data-state="ahead"]` text "Lesson 01"; `.upnext__t` "HTTP"; `.upnext__s` "Asking for web pages"; one `a.btn.btn--primary` "Start" to `/how-the-internet-works/what-is-http`; `.wholetrack` "See the whole track" to `/how-the-internet-works`; 14 `i[data-state="ready"]`; `.strip__w` "0 of 14 lessons done". Networking: "Lesson 01", "OSI Model", "0 of 20 lessons done", Start to `/networking/osi-model`.
- [UNIT] S5 (storage throws): the same render, no error thrown or logged.
- [UNIT] `UP_NEXT_KICKER.start` is still "Start here" (`hub.test.ts`), and the track page's side card says "Start here" (e2e `:613` unchanged). A build that edits `hub.ts` to "First lesson" goes red on both.
- [UNIT] The server render, hydrated with S1 stored: no hydration mismatch warning, then the S1 state (`:128`'s test, rewritten for the new markup).

**9. In progress: Continue to the furthest step.**
- [UNIT] S1: kicker "Up next"; chip `here` "Lesson 04"; title "UDP"; subtitle "Quick, no guarantees"; button "Continue" to `…/what-is-udp?step=4`; exactly one `current` square, the fourth; squares 1 to 3 `done`; words "3 of 14 lessons done".
- [UNIT] In progress at position 0: "Continue" to the plain URL, no `?step=` (today's `lessonHref`); at a position above the lesson's `maxPosition`: `?step=<maxPosition>`.
- [UNIT] Two lessons in progress: the one with the later `lastOpened` is the box's, whatever their order in the track.
- [UNIT] S4: IHW chip "Lesson 01", Continue to `/how-the-internet-works/what-is-http?step=2`; Networking chip "**Lesson 14**", Continue to `/networking/what-is-http?step=2`. A build that numbers the chip from the slug's home track goes red on Networking.

**10. Finished one, next not started.**
- [UNIT] S2: kicker "Up next", chip `here` "Lesson 04", button **"Start"** (not "Continue") to `…/what-is-udp` with no `?step=`; one `current` square. A build that maps kind `next` straight to "Continue" goes red.

**11. Everything ready finished.**
- [UNIT] S3: `data-kind="done-so-far"`; kicker "✓ Done so far"; chip `data-state="done"`, its text still "Lesson 14" (number in the markup, hidden by `font-size: 0`); title "TLS/SSL"; button "Watch again"; 14 `done`, 0 `current`. A build that drops the number from the markup to draw the tick goes red; one that marks the last square `current` (the hook returns its key as `current`) goes red.
- [E2E] 1440 and 375, light and dark, S3: the chip's `font-size` 0px; `::after` 13 × 7px, `border-left-width` and `border-bottom-width` 3px in `--cs-done`, top and right 0; background `--cs-card`. S0: `::after` `content` none and `font-size` 14px.

**12. The line is the subtitle; the chip says "Lesson NN".**
- [UNIT] In every state, `.upnext__s` equals `entry.subtitle` exactly (no "Lesson", no `·`); `.upnext__n`'s `textContent` is "Lesson " + two digits; `.sr-only` inside it is "Lesson ". A build that keeps `lessonLine(entry)` goes red; one that writes `aria-label="Lesson 04"` on the chip with no text passes a screen reader but goes red on the "number in the markup" case (11).
- [UNIT] `lessonLine` is unchanged in `hub.ts` (`hub.test.ts:136` green): the track page still uses it.

**13. The box is not a link, one filled button.**
- [E2E] 1440 and 375, S0 to S3: `.upnext` has no `a` ancestor and is not an `a`; it holds exactly one `.btn--primary` and one `.wholetrack`; no `.next`, `.lift` or `.panel__cta` anywhere in `main`. A build that keeps `class="next lift"` on the box (so `hub.css`'s `.next` padding and `site.css`'s `.lift` hover apply) goes red.
- [E2E] Clicking the box's title text does not navigate (URL unchanged after the click).

**14. The same height in every state (and H9, H3).**
- [E2E] At 320, 375, 768, 1000 and 1440, light: each ready article's `getBoundingClientRect().height` in S0, S1, S2 and S3 is equal ±1. Seeded both ways: S0 is the server render, S1 to S3 are the hydrated render.
- [E2E] **No shift when progress loads**: load with S1 stored; record each article's top and height in the server render (block the island's script, or read before `astro:hydrate`), then after hydration: every article's top and height equal ±1, and a `PerformanceObserver('layout-shift')` started at load reports 0 after the fonts are ready.
- [E2E] H9, once designer has answered: Networking with S6 (02 Packets) and with lesson 05 Switch next, at 320, 360, 375, 390 and 412, has the same height as S0 ±1 (measured on the prototype: 466 against 445 at 375). Against the prototype as drawn this case is red.
- [E2E] H3: IHW at 400px and Networking at 480 and 485px: S0 and an all-done seed have the same height ±1 (measured on the prototype: +22px). Better as a sweep: every 4px from 320 to 1440, S0 against S3, for both ready cards.
- [E2E] At 480 and below the button and "See the whole track" stack in S0 and S3 alike (the link's top > the button's bottom); at 481 they sit on one row.

### The look (checks 15 to 23)

**15. The card and the card beneath.**
- [E2E] 1440 and 375, light, dark, and dark with JavaScript off: each ready article: every side `2px solid` in `--cs-edge` (dark: `--ink`, `rgb(198, 205, 209)` per D17's cases; light `rgb(18, 23, 27)`); radii top-left 0, the rest 10px; `box-shadow` is two shadows, `6px 6px 0px -2px <card>, 6px 6px 0px 0px <edge>` at 1440 and `4px` at 375 (and at 860; 6px at 861). A+: `border-style` dashed on all four sides, `box-shadow: none`, top-left 0. A build that writes the dark edge as `[data-theme=dark]` only (the prototype's Part 1, H2) goes red in dark with JavaScript off.
- [E2E] No `shadow-sm` and no `--r-card` on the page: each article's computed `background-color` is `--cs-card` and `border-radius` is not `--r-card`'s value.

**16. The tab.**
- [E2E] 1440 and 375: each tab 34px tall (±0.5), `border-top`, `-left`, `-right` 2px, `border-bottom-width` 0; its bottom within 2px of the article's top border edge, its left = the article's left (±1, `left: -2px` over the 2px border). The first tab's `::before` 9 × 9 with background `--cs-here`; the other two tabs' `::before` `content: none`. A+'s tab: dashed, colour `--muted`.
- [E2E] The tab is not clipped: `elementFromPoint` at the tab's centre returns the tab (a build that puts `overflow: hidden` on the article, to clip the drawing's corner, hides every tab and goes red).

**17. The strip.**
- [E2E] 1440 and 375, S1, light and dark: `ready` squares 10 × 10, `background-color` transparent (`rgba(0, 0, 0, 0)`), `opacity` 1; `done` 10 × 10, background `--cs-done`; the one `current` 10 × 14, background `--cs-here`; every square's `box-shadow` an inset 1.5px ring in `--cs-edge`. Each row of squares is 14px tall in S0 and S1 alike (the `.strip__sq` height is 14 × rows + 3 × (rows − 1)). A build that lets `hub.css`'s `9 × 12` or its `box-shadow: none` on `done` win (a rule not under `.tp`, or not `:global`) goes red.
- [E2E] `.strip__w`: Atkinson Hyperlegible Next (`font-family` starts with the `--sans` family), 15px, `--muted`; not the mono face. A build that leaves `hub.css`'s mono 13px goes red.

**18. Buttons.**
- [E2E] 1440 and 375, light and dark: each `main .btn` ≥ 48px tall, `border-width` 2px, colour `--cs-edge`, `border-radius` 8px, `box-shadow` `3px 3px 0px 0px <edge>`, `padding-left` and `-right` 24px (the box's own value). Press without release (`mouse.down()` at its centre, poll for the 80ms transition): `transform` `matrix(1, 0, 0, 1, 2, 2)`, `box-shadow` `… 1px 1px 0px 0px`; after `mouse.up()`, back. A build that lets `site.css`'s `.btn:active { transform: scale(0.97) }` win goes red (the matrix is a scale).
- [E2E] Hover: the primary button's background is `color-mix(… --cs-act 88%, --cs-edge)`, not `--cs-quiet` (the order of `main .btn:hover` and `main .btn--primary:hover` kept).

**19. Links are ink, underlined.**
- [E2E] 1440 and 375, light and dark: each `main a:not(.btn)` (the head's two, the two names, the two "See the whole track") has `text-decoration-line: underline`, a decoration colour with alpha > 0, and a `color` that is not `--link` resolved. "See the whole track" is `--ink-strong`, not `hub.css`'s `--muted`.

**20. The figures re-tinted.**
- [E2E] 1440, light and dark: on each of the three covers, `--pool-op` and `--halo-op` compute to `0`, `--fig-bg` to `--cs-card`, and every `.lm-orbit` inside them has `display: none`. 375: the covers are `display: none` (layout 1) and still in the DOM.
- [E2E] 1440: each cover is drawn whole (`svg { height: auto }`): the `svg`'s height = its width × 378 / 540 (±1), and it is centred in `.trk__art` (top gap = bottom gap ±1); `.trk__art`'s right border 2px, dashed on A+.

**21. Contrast, both themes.**
- [E2E] 1440 and 375, light and dark, S0 and S1 (S3 for the tick): compute each pair in §8 from the drawn colours (walk up and composite the background): every pair at or above its figure −0.05. Words: every displayed text node in `main` outside `svg` ≥ 4.5:1 against its composited background, including the `--muted` subtitle on `--tile` (5.31 / 5.52, the lowest), the tab's `--muted` on A+, and the button words on `--accent`. Graphics ≥ 3:1: the square ring, the `done` square and tick (4.64 light), the here square and chip, the card edge on the ground. The focus outline (`--focus`) on `--cs-quiet` ≥ 3:1 in both themes.
- [E2E] Hovered primary button: its words still ≥ 4.5:1 on the mixed fill, both themes.

**22. Header and footer are today's.**
- [E2E] 1440 and 375, light and dark: on `/tracks` and on `/about` (compare with `/about`, as D17's E3: `/tracks` has no "Start learning"), `.site-head`'s background, `border-bottom`, the nav link's colour and radius, and `.site-foot`'s background, border and link colours are equal. A build that writes a card part unscoped (`.btn` rather than `main .btn`, or `article {…}`) changes the header's or the footer's look and goes red.

**23. The track page is untouched.**
- [E2E] `/networking` at 1440 and 375, light and dark, S0 and S1: `.strip__sq i` 9 × 12, `.strip__w` in the mono face, 13px; the side card's kicker "Start here" (S0); `.side-now`'s background, radius and shadow equal today's (captured on `revamp` before the change); every `main .btn`'s border width, radius and `box-shadow` equal today's (Patch: no 2px edge, no 3px offset); `--cs-edge` on `:root` computes to the empty string. A build that imports `card-stack.css` in `TrackStrip.tsx` or `site.css` (so it reaches every page with a strip) goes red on every one of these.
- [E2E] The same `--cs-edge` empty check on `/about`, `/glossary`, `/404` and one lesson page. (On `/about` and `/404` the header's "Start learning" exists and must keep Patch.)
- [UNIT] `git diff revamp -- src/components/hub/hub.css src/components/hub/TrackStrip.tsx src/components/hub/useUpNext.ts src/lib/hub.ts src/pages/[track]/index.astro src/styles/tokens.ts` is empty (a check the build review runs; H8).

### Layout and anchors (checks 24 to 29)

**24. No sideways scroll, 320 to 1440.**
- [E2E] At 320, 360, 375, 414, 480, 768, 860, 861, 1000, 1140, 1141 and 1440, light, S0 and S3: `document.documentElement.scrollWidth === clientWidth`, and no element in `main` has a right edge beyond the window (the card beneath included: its right edge at 375 is 361). The prototype passes at every one of these. A build whose phone card bleeds to the screen's edge on both sides (`margin: 0 -32px`) puts the card beneath at 379 and goes red.
- [E2E] At 320, Networking's 20 squares wrap to two rows (19 then 1 in the prototype's 252px): each row 14px, the same in S0 and S3.

**25. Page height.**
- [E2E] S0, light: 1,598 ± 40px at 1440 × 900 and 2,325 ± 40px at 375 × 812 (measured on the prototype without its bar; the site's footer included). Record 320 (2,511) and 768 (1,902) too, as the plan asks for the before-and-after figures.

**26. Home's three anchors land clear of the header.**
- [E2E] 1440 and 375, light, S0: `goto('/tracks#how-the-internet-works')`, `#networking`, `#comptia-a-plus`; wait until `scrollY` is still for two reads 120ms apart (as `:505-523`); then **the tab's** top (not the article's) ≥ the header's bottom (69) and ≤ header bottom + 200, unless `scrollY` is at its maximum. Measured on the prototype: the tab's top at y 82. Today's test measures the article's top, which passes with the tab hidden under the header: a build with `scroll-margin-top: 80px` passes today's test and goes red on this one.
- [E2E] The same three by clicking Home's links (`/` then the track card's link; `site.spec.ts:266-279`), so the arrival from Home is tried, not only the URL; and with S1 stored, so the arrival survives hydration (the target's top unchanged ±1 after the island loads).
- [E2E] `/tracks#comptia-a-plus` at 1440: the page's end is reached (`scrollY` = `scrollHeight − innerHeight`) and the A+ tab is wholly in view.

**27. The phone card's edges.**
- [E2E] 375 and 320: each article's left 14 ±1; its `h2`'s left 32 ±1; its right = window − 18 + 4 (357 at 375) ±1; `.trk__art` `display: none`; the tab's left 14. At 860: 4px beneath; at 861 the desktop grid (three columns from 1141, two from 861 to 1140).
- [E2E] 861 to 1140 (try 861, 1000, 1140): the box sits under the strip in column 2 (`.upnext` top > `.strip` bottom, same left as the `h2` ±1); 1141 and 1440: the box is right of the words (`.upnext` left > `.strip` right) and vertically centred in the card (top gap = bottom gap ± 1).

**28. Layout 2's deck.** Not built (layout 1 approved). [E2E] At 375, `.panels` has `overflow-x` `visible` and no `scroll-snap-type`: a build that copied layout 2's rules goes red.

**29. JavaScript off.**
- [E2E] `javaScriptEnabled: false`, 1440 and 375, light and dark (dark = the media query): the page shows S0 in full (checks 8, 15, 16, 17 hold); the two `.btn` and four other card links work (follow each, 200, right path); the header's theme button is not displayed. The cards' heights equal the S0 heights with JavaScript on (±1).
- [E2E] JavaScript off, dark system: the card edge and button edge are `--ink` (the `:root:not([data-theme])` twin, H2); the covers use the dark tint (`--anatomy-hi` `#f3f5f6` on a cover's `.lm-svg`).

### Home unchanged after the move (B21's first commit)

- [UNIT] H1: `home.test.ts`'s two colour-scan tests pass, reading the token and tint blocks from `card-stack.css` and scanning the rest of `index.astro` **and** of `card-stack.css`. Break it to see: put `color: #fff` in `card-stack.css`'s `.cs-tab` rule and the scan goes red. Every other Home test (`home.test.ts`, `home-page.test.ts`, Home's blocks of `site.spec.ts`) is not in the diff.
- [UNIT] `card-stack.css` is imported by `src/pages/index.astro` and `src/pages/tracks.astro` and by nothing else (grep `src` for `card-stack.css`: two hits). A third importer, a `.tsx`, or `BaseLayout` goes red.
- [UNIT] `index.astro` no longer holds `--cs-edge:` or `--anatomy-hi:` declarations (the blocks moved, not copied: one source for the tokens), and still holds `.leg`, `.leg__order`, `.nm-trail`, `.nm-trail-edge`, `.nm-glow` rules (they stay Home's this job, §3).
- [E2E] **Focused buttons (H5)**: on `/`, 1440 and 375, light and dark, focus each `main .btn` by keyboard (the opening's "Start with lesson 1: HTTP" and "See the tracks", and the closing section's "Start with lesson 1"; Learn's "Go to Practice" is a `label` and takes no focus): `border-radius` 8px, as on `revamp` today. A build that moves `.btn:focus-visible` as `main .btn:focus-visible` and leaves Home's `a:focus-visible { border-radius: 3px }` goes red on all three.
- [E2E] **Every button in four states**: on `/`, 1440 and 375, light and dark, for each displayed `main .btn` at rest, hovered, focused and pressed: `border`, `border-radius`, `background-color`, `color`, `box-shadow`, `transform`, `padding`, `min-height`, `font` equal a fixture captured on `revamp` at `8d9f2bc` before the change. This is what the plan's screenshots cannot see.
- [E2E] **Tokens on `:root`**: on `/`, light, dark, and dark with JavaScript off: each of the 19 `--cs-*` names resolves (through a probe) to the same colour or length as on `revamp`; `--cs-stack` 6px at 861, 4px at 860. A build that drops the `prefers-color-scheme` twin (H2) goes red only in dark with JavaScript off.
- [E2E] **Figures**: on `/`, light and dark: the demo's drawing and the covers keep `--pool-op` 0, `--halo-op` 0, no displayed `.lm-orbit`, `.nm-trail` stroke `--cs-here` 3.5px, `.nm-glow` hidden; `--anatomy-hi` `#12171b` light and `#f3f5f6` dark on a cover.
- [E2E] **Header's "Start learning" on Home** keeps Patch: `box-shadow: none`, 1px border, as D17's check 3 (`site.spec.ts`'s existing test, unchanged, still green).
- [E2E] **Screenshots** (the plan's): `/` full page at 375 × 812 and 1440 × 900, light and dark, before and after the first commit, pixel-identical (`toHaveScreenshot` against a baseline taken on `revamp`, or a pixel diff of the two PNGs = 0). Take them with `animations: 'disabled'`, after `document.fonts.ready`, S0.
- [BUILD] The built Home's CSS: the same set of rules and declarations as before, give or take selector text (`.btn[data-astro-cid-…]` → `main .btn`); the page's gzipped size within 1 KB of today's.

### §9's words, row by row

- [UNIT] **Moved**: the outro's exact words are the head's second `p` (check 1), and no `p.outro` exists; the sentence occurs once in `main`.
- [UNIT] **Changed**: on a first visit each box's kicker is "First lesson"; "Start here" occurs once in `main` (the tab); on S1 and S2 the kicker is "Up next" and "First lesson" occurs nowhere. A build that shows "First lesson" whenever the up-next lesson is lesson 1 (S1's Networking card, whose next is 01 but kind `next`) goes red: there it is "Up next".
- [UNIT] **Moved**: "Not ready yet" is A+'s tab; no `.h-chip` in `main`.
- [UNIT] **New (reused)**: "Start here" and "Then go deeper" are the first two tabs, the same words as Home's `.leg__order` (`site.spec.ts:264`): read both from the one source if there is one, or compare the strings.
- [UNIT] **Changed**: `.trk__soon b` is "Lesson 1 is being written." (with its period), followed by " Each lesson will follow the A+ exam objectives."
- [E2E] **Removed**: "Lessons on the way", "Coming soon" and any `Lesson \d\d ·` absent from `main` in S0, S1 and S3; no `span.btn` or `.panel__off`.
- [UNIT] **New, screen readers**: each chip holds `<span class="sr-only">Lesson </span>` then the two digits.
- [UNIT] **Kept**: "Pick a track", "Each track is a set of short visual lessons, taken in order.", the three names and blurbs (from `trackCards()`), "N of M lessons done", "Up next", "✓ Done so far", "Start", "Continue", "Watch again", "See the whole track", "Each lesson will follow the A+ exam objectives."; the page's `<title>` "Tracks · TechConcepts" and its meta description are unchanged.
- [E2E] **No time figure, score or exam tag** on `/tracks` (`site.spec.ts:364`, unchanged); no link named /continue|resume/i on a first visit (`:554`).
- [UNIT] **Every text in `main`** (the container render, S0, white space collapsed, `svg` text excluded) equals a list written from §9: the head's two sentences and two link texts, the three tabs, three names, three blurbs, two captions, two kickers, two "Lesson 01" chips, two titles and subtitles, two "Start", two "See the whole track", A+'s two sentences. A build that adds a word (a "Recommended" badge, "3 tracks") or keeps one (the outro, "Coming soon") goes red.

### The tests that pin today's page (§10's last bullet)

- [UNIT] The diff changes `tracks-page.test.ts:10,20` (a cover, not figures) and leaves `:6` and `:36`; drops `TrackPanelProgress.test.tsx:82` and `:91` and rewrites the rest for the new markup; `e2e/site.spec.ts:482`, `:528`, `:562`, `:784` (its Tracks lines), `:816`, `:832` follow §9; `:858` keeps its three expectations (adds the chip "Lesson 04" here). The build review checks each changed expectation against §9: a test changed to agree with a wrong build (e.g. `:832` expecting "Start here" in the tab and dropping the kicker check) is a blocker.

## Notes

- **The done chip's tick sits low.** In the prototype the chip's grid has two rows, 13px and 17px: the hidden number's anonymous item takes the first, so the tick centres about 5px below the chip's middle. The build reproduces it by copying the markup; if a builder centres it (e.g. with `grid-area: 1 / 1` on `::after`), that is drift to report, or a designer's fix to ask for. Compare with Home's done chips before deciding.
- **No ready lesson** ("the strip alone, as today"): on a desk the card's third column (`minmax(320px, 380px)`) would stand empty. No track reaches it today.
- **"Watch again" goes to `?step=`** when the finished lesson's record has a position (today's `lessonHref`); the spec keeps it.
- **The `@visual` `tracks` shots** change by design and assert nothing; they are for a person.
