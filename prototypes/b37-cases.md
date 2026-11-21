# B37: spec review (job 29), holes and attack cases

Reviewer, 2026-11-20, from plan.md "Job 29" (decision 3, the B37 row) at a7985bd and S26 (`prototypes/s26-job-29-facts.md` A and B).
Measured in `.superpowers/wt/spec29` (a7985bd), Chromium headless, light scheme, scripts git-ignored in its `zz-measure/`:
`head.mjs` (the open header), `walk.mjs` (the site-chrome walk's `readStop`, copied), `land.mjs` and `fine.mjs` (where each demo
input lands from ten start positions), `anchors.mjs`. "Trial" below is the CSS of decision 3 as measured; the real edits are in
`.superpowers/job29/trial-b37-spec.diff` (session folder), run through the specs named in each case.

## What was measured

- **Home's open header, every width 320 to 959** (menu open, 1px steps, 640 tall): **391px at all 640 widths**, the same as
  About and 404 (Tracks and the track pages: 329). So Home's open-menu padding is **403px** (391 + 12), About's value.
- **Home's stops under the header today** (the walk's own `readStop`, reduced motion): 320 closed 0, open 23 (11 forth, 12 back:
  the hero's two buttons, HTTP, the Watch tab radio, step 1, the "Get started" links, the closing button and three footer
  links); 375 closed 2 (back: "Start with lesson 1", "See the tracks"), open 13; 390 closed 1, open 5; 959 closed 1 (back:
  the Watch tab radio at 65), open 4; 960 and 1440 closed 1 (the Watch tab radio). Cut at the foot: 375 closed 1, open 2;
  390 closed 2, open 3; 1440 1. These match direction 2.125/2.126 (23 at 320 open; 375 closed 2).
- **The same with decision 3 as measured below (H1 and H3 closed)**: 0 under and 0 cut at the foot at every size and menu
  state in the walk's six sizes, reduced motion and smooth; confirmed by `site-chrome.spec.ts` "44 to 49" for Home with
  `strict: 'all'` in `d1440-dark` and `reduced-motion` on the real edits.
- **Footer rings, Tracks and both track pages, 12px at the foot** (the walk's six sizes, both menu states): cut today on Tracks
  5/4/4/1/3/2/0/2 (320 closed/open, 375, 390, 959 open), networking 1/1/3/1/2/1, how-the-internet-works 1/4/0/3/0/1;
  with `scroll-padding-bottom: 12px`: **0 everywhere**, under the header 0 everywhere.
- **Anchors**: `#try` and `#sources` land at 87.5 to 88.5px today; with 80px padding and `section[id]` at 8px, **identical
  to 0.1px** at 320, 375, 390, 959, 960 and 1440, reduced motion and smooth, by three routes: loading `/#try`, the open menu's
  link on Home (the panel's click handler closes the menu before the fragment scroll, so the scroll uses 80, not 403), and
  `scrollIntoView()` (site-chrome case 17's route).
- **Other scroll margins on Home**: none besides `index.astro:348-349` and `:458-482`; no `scrollIntoView`/`scrollTo` in Home's,
  the header's or the footer's scripts (`grep` of `src`). The skip link's target `#main` is the one other scroll target (case 14).
- **The skip link on Home** (trial, 375 and 1440, from 1500px down): Enter lands the page at `scrollY` 0 (`#main`'s top, 69, less 80,
  clamped), and the next Tab is "Start with lesson 1: HTTP", clear. Without the padding the target is aligned at 69.

Trial edits: `.superpowers/job29/trial-b37-spec.diff` (decision 3 as written, the walk's rows set to `'all'`) and
`trial-b37-spec-tall.diff` (H1's answer; its `readStop` edit is the first try of H2 and is wrong: it took the name from the
ringed element, so the pinned stop names failed; H2 says how). Scripts and logs: `.superpowers/job29/spec-measure/`.

## Holes (worst first)

B37-H1. **Decision 3 as written breaks D17's approved "a tap moves nothing".** Built as written (80px root padding, every top margin
    less 80), `site.spec.ts` B20 cases 22 and 26 go red, 7 of 35 in `d1440-dark` (`.superpowers/job29/spec-measure/e2e-b37-site.txt`): "after Go to Learn"
    708 -> 517 at 375 and 682 -> 475 at 390; "after Next 5" 486 -> 251 at 1440 (D17's table: "Go to Learn, the tabs at y 70: moves 0").
    The B37 row's check list does not run `site.spec.ts`, so the build would pass its own check and break an approved design.
    Cause, measured with `fine.mjs`: Chrome scrolls a focused element only when its own box (margins not counted) is outside the
    scroll port less the scroll padding, and then centres it. The radios are 1px boxes at the top of their grid areas; one that sits
    in the window's top 80px (the tabs at 70, as D17 lands them) is now outside the port and is centred, where today it is inside
    the window and is left alone or aligned to 70. No margin value can change that (margins are not in the test).
    Also measured: lowering only the top margins moves most landings (same as today 16 to 51 of 110 per size; the bottom margins
    add to the new 12px, and a centred landing moves by half the difference), lowering the bottom ones by 12 as well gives 99 of 110
    (only the 80px band differs).
    Answer (measured, one that keeps decision 3 and every landing): each radio's own box is 81px tall from its area's top
    (`.demo__in { height: 81px; scroll-margin-top: -10px; }`; still `opacity: 0`, `pointer-events: none`, `top: 0`), so it is
    inside the padded port whenever today's 1px box is inside the window; the bottom margins take the 80 extra pixels and the 12px
    away: part `268px` (was 360), step `-12px` (80), answer `232px` (324). Measured: **110 of 110 landings the same as a7985bd at
    320, 375, 390, 959, 960 and 1440 by focus, and at 375 and 1440 by a label's click** (ten start positions per radio, the 80px
    band and the foot's 12px included); `site.spec.ts` B20 (all its describes), "Home: How a lesson works and Sources", case 17
    and `card-stack-home.spec.ts`: **green in `d1440-dark` and `reduced-motion`** (390 passed, 4 failed: case 15 twice, H4, and Home's walk twice, from the
    first, wrong try of H2's `readStop`; `e2e-b37-tall.txt`). This is a mechanism value, as D17's E1 was: nothing a reader sees moves. If the orchestrator prefers not to
    reshape the radios, the alternative measured is no root padding on Home and the margins on its own stops
    (`main :is(a, button, summary), .site-foot a { scroll-margin: 80px 0 12px }`, 403px with the menu open): walk 0 under bar H2's
    radio, landings untouched; but Home would not take the site's rule and the four pins of H4 would stay `auto`.
B37-H2. **The walk counts a radio by a ring nobody sees.** At 959, 960 and 1440 with the menu closed, Shift+Tab from step 1 lands the
    Watch radio at 70 (as D17 designs, and as H1 keeps); the walk's `readStop` grows the radio's own 1px box by its outline (2 + 3)
    and calls it under the header (64.7 against 69): today it is the 1 stop counted at those sizes, and `strict: 'all'` cannot pass
    on any build that keeps D17's landing. The radio is `opacity: 0`; the ring a reader sees is on the tab (`label[for="demo-watch"]`,
    outline offset -7px), measured at **74.7**, clear (case 28 measures the same element). Answer (one): `readStop` measures a
    `.demo__in` stop by the element its ring is drawn on: the visible element in `main .demo` with `outline-style` not `none`
    other than the radio (`getClientRects().length > 0`: hidden panes have rings at 0,0); the stop's **name stays the radio's**
    (`aria-label`), so `site-chrome-stops.ts` is unchanged. Measured with that rule and H1's build: closed menu, **0 under and 0 cut
    at the foot at all six sizes**, reduced motion and smooth.
B37-H3. **The open menu and the radios.** With 403px padding the radios' -10px top margin lands the Watch radio's box at 393 (ring
    388, under the 391 header) and at 320 x 640 the back walk centres a 350px margin box in a 225px port (2 under at 320 open).
    Measured: `:global(html:has(#menu-panel:not([hidden]))) .demo__in { scroll-margin: 0; }` inside the 959px query gives 0 under
    at 320, 375, 390 and 959 open by the radio's own box. **By the drawn ring (H2) it is not enough**: step 1's tile is drawn
    162 to 358px above the step radio (`.demo__n` on the phone, `.demo__row` from 861px), and with the menu open the walk finds it
    under the header at 320 x 640 (275) and 959 x 900 (248), 2 stops each; at 320 x 640 the port is 225px, so no margin brings
    both in. Needs a decision (taste: the demo with the menu covering 391 of 640px): (a) the walk asserts Home's open-menu rows
    with step radios counted, not asserted, recorded as an erratum (2 at 320 and 2 at 959; 23 today); (b) at 959, an open-state
    `scroll-margin-top` on `.demo__in--step` of the tile's distance plus 5 (363 at 959 x 900, port 485) and (a) for 320 only;
    (c) designer. No landing is pinned with the menu open today (every stop there lands under the header).
B37-H4. **Five pins, not two.** Home's padding is pinned `auto` by `tracks-card-stack.spec.ts:649`, `glossary.spec.ts:443`,
    `about.spec.ts:81` (S26 missed it), and `site-chrome.spec.ts:220-237` case 15 (S26 missed it): `'/': ['auto','auto']` closed,
    `'auto'` open and after 1440, and Tracks and both track pages `['80px','auto']`. Case 15 was red on the trial in both projects.
    Answer (one): Home `['80px','12px']`, `'403px'` open, `'80px'` opened at 375 then 1440; Tracks and both track pages
    `['80px','12px']`; the titles that say "auto elsewhere" / "auto on Home" / "/ is auto" say what is pinned.
B37-H5. **Guards and their counts.** (a) `index.astro` and `src/pages/[track]` leave the name-only lists of
    `not-found-page.test.ts:58`, `about-page.test.ts:269`, `glossary-page.test.ts:282` and get one grant each in
    `card-stack-guards.ts` (exact hunks, removed and added lines, job 24's form), used by all three; `TRACKS_GRANT` gains the one
    line `scroll-padding-bottom: 12px;` (a second hunk; the old one stays `-116,0`). (b) `track-page-render.test.ts:196` matches
    `:global(html) { scroll-padding-top: 80px;` at the block's start: the bottom padding goes after the top one, in the same block.
    (c) `not-found-page.test.ts:116` (test 61) counts `expect(` lines removed against added since 1d8e446 in `about.spec.ts`,
    `glossary.spec.ts` and `tracks-card-stack.spec.ts`: change each `auto` pin in place; deleting `for (const path of ['/'])`'s line
    without an added `expect(` turns it red. (d) The B37 row's check runs no `site.spec.ts`: add `site.spec.ts -g "B20|Home: How a
    lesson works"` in `d1440-dark` and `reduced-motion` (H1), and `about.spec.ts`'s padding test.
B37-H6. **The track page's own bottom margins.** `[track]/index.astro:104` (`scroll-margin-block: 12px` on the crumb, the route's end and
    Up next) and `:325` (stop links `24px 0 160px`) add to the new 12px: a focused stop centred by the browser lands 6px higher
    (`:954`'s Load Balancers 394 -> 388). The track-page walks (`track-page-card-stack.spec.ts:1133`, `:1156`, both projects) were
    green with them as they are. Answer: keep them (each is air the stop wants, not the bar's); no landing is pinned. Tracks'
    `.panel` has no bottom margin.
B37-H7. **Comments that go false.** `index.astro:456-459` ("The top margin is the header's height, and no more"), `:348` (88px),
    `tracks.astro:111-113,117` and `[track]/index.astro:82-84` (80px top only): each says what is there (80 + -10 = 70, the 81px box
    and why, 12px at the foot for the footer's rings).
B37-H8. **Dead branches.** With every row `'all'`, `strict`'s `'no-foot' | 'none'` and the two branches at `site-chrome.spec.ts:976-979`
    (and the E6/E7 comment) are dead: the field and the branches go, and `under` and `cutFoot` are asserted for every row.

## Attack cases

### Home's padding (decision 3)

1. The values. Closed: `scroll-padding-top` 80px, `-bottom` 12px at 320, 375, 1440. Open at 320, 375, 390, 768, 959: top 403px;
   closed again, and after Escape: 80px; opened at 959 then widened to 960: 80px (the media query, not the panel's state).
   Wrong builds to catch: the rule in `index.astro`'s scoped style without `:global(html)` (Astro scopes it to an attribute the
   root never has: computed `auto`); the rule in `global.css` or `card-stack.css` (reaches the Lesson page: its 69px pin, and
   `globalGrant`/`cardStackGrant` go red); 391 or 341 open (Tracks' number) in place of 403.
2. 403 is the open header plus 12: Home's open header is 391px at every width 320 to 959 (measured, 640 widths). A test pins
   `.site-head`'s height open at 320, 375 and 959 at 391 ± 1 on Home (as About's does), so a menu change shows up there first.
3. Anchors unchanged: `#try` and `#sources` at 88 ± 1 (`site-chrome.spec.ts` 17) by `scrollIntoView`, by loading `/#try` and
   `/#sources`, and by the open menu's link on Home at 375 (the panel closes before the scroll: 88, not 411); `site.spec.ts`
   "Home: How a lesson works and Sources" green. Wrong build: `section[id]` left at 88px (lands at 168): case 17 red.
4. Demo landings unchanged (H1). A test, for each of the 11 radios at 375 and 1440 (at least), from start positions with the radio
   far below, just below, in the window's top 80px (k = -60, 0) and far above, records `scrollY` after `focus()` and compares with
   numbers measured on `revamp`, within 1px. Red on decision 3 as written (16 to 51 of 110 the same per size) and on "bottom margins
   less 12" alone (99 of 110: the band); green on H1's answer (110 of 110).
5. D17's own cases: `site.spec.ts` B20 22 to 30 (`-g "B20"`), `d1440-dark` and `reduced-motion`: 0 failed. Red on decision 3 as written (7).
6. The radios stay drawn nowhere and catch nothing: `.demo__in` keeps `opacity: 0` and `pointer-events: none`; a tap at the centre
   of each tab, tile and answer still checks its own radio (cases 22, 23 green); `document.documentElement.scrollHeight` at 320,
   375 and 1440 the same as `revamp`'s (the 81px boxes stay inside the card).
7. Smooth and reduced motion land alike: case 4 run in `d1440-dark` (Home's `scroll-behavior: smooth`, wait with `scrollSettled`)
   and `reduced-motion`.

### The walk (H2, H3, H8)

8. Home's rows `strict: 'all'` and green at the six walk sizes, menu closed and open, `d1440-dark` and `reduced-motion`, with
   radios measured by their drawn ring (H2) and the open-menu decision of H3 applied. Before the change: 23 under at 320 open,
   2 at 375 closed (direction 2.125, 2.126; measured).
9. The stop names and order are `revamp`'s (`site-chrome-stops.ts` unchanged): a `readStop` that takes the name from the ringed
   element ("Watch" for "Watch part") turns every Home key red (measured on the first try).
10. The ring rule is not vacuous: with `outline: none` on `.demo__parts label` in a throwaway copy, the walk can no longer find a
    drawn ring for the Watch radio; it falls back to the radio and counts it at 959 (red), it does not skip it.
11. Tracks, networking and how-the-internet-works rows `'all'`: 0 cut at the foot at every size and state (measured; today Tracks
    5/4 at 320, networking 1/1, how-the-internet-works 1/4). Wrong build: the bottom padding inside the 959px media block only
    (1440 keeps its cut ring on Home: measured 1 today).
12. The track-page walks stay green: `track-page-card-stack.spec.ts` "Tab and Shift+Tab never leave focus under the header"
    (1133, 1156, 1170, 1182, 1203), both projects (measured green with 12px).
13. `:954` (B40's test) still green with the stop 6px higher (388).

### The guards and pins (H4, H5)

14. `npm test` green; then in a throwaway copy, each red: a word changed in `index.astro`'s markup; a second rule added to
    `[track]/index.astro`; `scroll-padding-bottom` moved before `scroll-padding-top` in the track page (H5 b); a fourth line in
    `tracks.astro`'s grant.
15. The four e2e pins take the new values (H4), and nothing else in those tests changes; test 61 green.
16. The skip link on Home: Enter on it from 1500px down lands `scrollY` 0 and the next Tab on "Start with lesson 1: HTTP" below the
    header (measured on the trial; no test pins it today; add one in `site-chrome.spec.ts` beside 35 to 37 if it is cheap).

### The checks of the B37 row

17. `site-chrome.spec.ts` 44 to 49 and 15, 17 in `d1440-dark` and `reduced-motion`; `tracks-card-stack`, `track-page-card-stack`,
    `card-stack-home`, `glossary`, `about` (its padding test) specs; `site.spec.ts -g "B20|Home: How a lesson works"` (H5 d);
    `npm test`; `npm run build`. Each run's counts in the report.
