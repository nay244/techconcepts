# D25: the demo with the menu open (B37-H3)

Job 29, the hole `prototypes/b37-cases.md` B37-H3 sent to `designer`. No prototype: the answer is a behaviour of the
header's existing menu, measured on the built site, and nothing new is drawn.

## The question

Below 960px, with the header's menu open (391px tall on Home), a keyboard reader who tabs into Home's demo focuses a step
radio whose ring is drawn on step 1's tile, 162 to 358px above the radio. With B37's rules (E26) that tile stays under the
open header at 320 × 640 and 959 × 900, two stops each. At 320 × 640 the padded port below the open header is 225px
(640 less 403 and 12), so no scroll margin can bring the tile and the narration into view together.

## Decision: (c), the open menu closes when focus leaves the header, on every page

The menu is a way to get somewhere else. Once focus has moved past it into the page, the reader has chosen to stay, and
a panel covering 391 of 640px is in the way of every stop after it, not only the demo's. The Lesson page already works
this way (d19 E28). Closing the menu when focus leaves the header makes the whole menu-open walk a closed-menu walk after
its last link, so every landing B37 and D17 designed applies as drawn, with no extra margin and no stop exempted.

Rejected:
- (a), counting the stops and not asserting them: the reader still meets a ring under the header, and the walk would
  then pass with a fault in it.
- (b), a 363px open-state margin at 959 plus (a) at 320: it fixes one width, adds a number tied to the menu's height,
  and leaves 320 as it is.
- Home only: SiteHeader serves every page, and on Home alone this would need a page check in the shared header or a third
  `<script>` on Home, which `home-page.test.ts` "two scripts and no island" (D17) rules out. The same rule on every page
  keeps one menu behaviour across the site, and was measured clean on every page (below).

## The rule

`src/components/SiteHeader.astro`, inside the existing `if (button && panel)` block, after the Escape handler:

```ts
    // Below 960px the open menu lies over the page, so it closes when focus moves outside the header: Tab past its last
    // link, Shift+Tab past the brand to the skip link, or a tap on a control in the page. Focus stays where it went (D25).
    document.addEventListener('focusin', (e) => {
      if (button.getAttribute('aria-expanded') !== 'true') return;
      if (e.target instanceof Element && e.target.closest('.site-head')) return;
      setOpen(false);
    });
```

- The handler runs during `focusin`, before Chrome scrolls the focused element into view. The scroll therefore uses the
  closed header (69px) and the closed padding (80px top, 12px foot), so each stop lands where it lands with the menu closed.
- Focus does not move. The menu button reads `aria-expanded="false"`, so Shift+Tab from the page reaches Menu, not
  the panel's links.
- Escape, a link in the panel and a second press of Menu work as today.
- Nothing changes without JavaScript, because the menu cannot open without it.
- At 960px and wider nothing changes: the button and panel are not shown, and `aria-expanded` stays "false".

**B37's CSS:** the trial's open-state line `:global(html:has(#menu-panel:not([hidden]))) .demo__in { scroll-margin: 0; }`
is **not** added. With this rule it never applies when a scroll happens (measured: the walk is the same with and without
it). The 403px open padding stays as E28 pins it, and so does all of E26.

**The Lesson page:** `LessonConsole.tsx:203-215` (E28's own handler) is left as it is. It is now redundant and harmless:
whichever handler runs second finds `aria-expanded="false"` and returns. Removing it is a cleanup task of its own, so the
lesson stays untouched in this job.

## What a reader sees

| Reader, below 960px, menu open | Today (B37 trial) | With D25 |
|---|---|---|
| Tab past "Start learning" | Focus moves into the page while the panel stays over the top 391px; at 320 × 640 and 959 × 900 step 1's ring is hidden under it | The panel folds away as focus arrives. The header is 69px again and the focused stop is in view, clear of it |
| Shift+Tab back from the page | Reaches the panel's links, then Menu | Reaches Menu, now closed. Enter or Space opens the menu again |
| Shift+Tab past the brand | The skip link, with the panel open | The skip link, with the panel closed |
| Tap a demo control (Next step, a step row, a tab) | The demo changes and the panel stays; at 959 × 900 the page jumps 290 to 410px | The demo changes and the panel closes. The tapped place stays put, or the narration comes up to just under the 69px header (measured below) |
| Tap on plain text or background | The panel stays | The panel stays (no focus moves) |

There are no new words, and nothing is drawn.

## Measurements

Measured on `npm run build && npm run preview --port 4537` at ec80bf5 with the reviewer's trial
`.superpowers/job29/trial-b37-spec-tall.diff` applied (src only), in Chromium. The rule was added at run time with the
same five lines. The walk is `site-chrome.spec.ts`'s: Tab from the open Menu to the footer's About, then Shift+Tab back to
Menu, reading each demo radio by its drawn ring (E27).

**Home, menu open: stops under the header / stops cut at the foot**

| Size | Before B37 (2.143) | B37 trial | B37 trial + D25 | D25, reduced motion |
|---|---|---|---|---|
| 320 × 640 | 23 | 2 / 0 (step 1's ring at 275, header 391) | 0 / 0 | 0 / 0 |
| 375 × 812 | n/a | 0 / 0 | 0 / 0 | 0 / 0 |
| 390 × 844 | n/a | 0 / 0 | 0 / 0 | 0 / 0 |
| 959 × 900 | n/a | 2 / 0 (step 1's ring at 248) | 0 / 0 | 0 / 0 |

With D25 the open walk is 22 + 16 stops, against 22 + 22 today. Every stop after the panel has the closed walk's name, in
the closed walk's order. At 375, 390 and 959 every landing is identical to the closed walk's. At 320 × 640 the first three
land elsewhere ("Start with lesson 1" at 165, "See the tracks" at 227, HTTP at 480; closed: 444, 506, 338), all clear,
because the panel's links leave the page at a different scroll position. The back walk is identical to the closed
walk's, stop for stop and pixel for pixel. Step 1's ring is at 115 (320), 238 (375), 255 (390) and 87 (959), each
at least 18px below the 69px header's foot.

**Every other page, menu open, with D25** (Tracks, `/networking`, `/how-the-internet-works`, About, 404, Glossary; 320 × 640,
375 × 812, 390 × 844, 959 × 900): **0 under, 0 cut**. On the Glossary that covers the first 400 stops each way.

**A tap with the menu open** (step 2's control is Next step below 861px and the row from 861; the narration's top is
placed 20 or 140px below the open header's foot):

| Size, offset | Today: scroll moved, narration top after | D25: scroll moved, narration top after, header |
|---|---|---|
| 320 × 640, 20 | −4, 395 (header 391) | −4, 73 (header 69) |
| 320 × 640, 140 | 0, 511 | −322, 511 (held in place) |
| 375 × 812, 20 | −4, 415 | −4, 93 |
| 375 × 812, 140 | 0, 531 | −322, 531 (held in place) |
| 959 × 900, 20 | −410, 821 | −410, 499 |
| 959 × 900, 140 | −290, 821 | −290, 499 |

Where the narration moves (20px rows), it moves up into the space the panel gave back and lands fully in view under the
header. Nothing is lost from view in any row.

Seen at 320 × 640 (light) and 959 × 900 (dark): the panel folds as focus reaches "Start with lesson 1: HTTP", and step 1's
tile ring sits whole below the header.

Also noted, not D25's: one run of the B37 trial without the rule had the footer's "Networking Concepts" cut at the foot at
390 × 844 with the menu closed. It did not happen again on the next run of the same row. This may be a flake in the
trial's walk; the B37 reviewer should know.

## What it touches beyond Home

- `SiteHeader.astro`'s script, so every page's header script asset changes (it gets a new hash). No page's HTML changes,
  apart from that asset name.
- Tests that open the menu and then leave the header:
  - `site-chrome.spec.ts` cases 44 to 49: `STOPS` for every `open` key on the six walk pages (24 keys). The back list is
    the closed row's back list. Home's rows become `strict: 'all'` with the open rows asserted, with no exemption.
  - Case 45 (the Glossary walk) and case 51 (into and out of the panel, then Escape) are expected unchanged.
  - The specs that open the menu: `not-found.spec.ts` (11 uses, including `panelOpenAtEnd` at `:763` and `:910`),
    `about.spec.ts` (3), `track-page-card-stack.spec.ts` (3), `site.spec.ts` (1), `lesson-layout-small.spec.ts` (3; case 47
    stays green). A builder runs them and changes only the assertions that expected the panel still open after focus
    left the header.
- These were not run here. I measured with my own walk script, not the e2e suites.

## Acceptance checks

Run at 320 × 640, 375 × 812, 390 × 844 and 959 × 900, with the menu opened by clicking Menu, unless a check says otherwise.

1. On `/`, `/tracks`, `/networking`, `/about` and `/does-not-exist`: focus "Start learning" (the panel's last stop on
   Tracks and the track page, "About"), then press Tab. Then `#menu` has `aria-expanded="false"`, `#menu-panel` is
   hidden, `.site-head` is 69 ± 0.5px tall, and the focused element is the page's first stop in `main`. Its ring's top is
   at or below the header's foot and its bottom is inside the window.
2. On Home, walk from the open Menu to the footer's About and back (case 44's walk). At every size: 0 stops under the
   header and 0 cut at the foot, asserted, both in `d1440-dark` and in `reduced-motion`. The demo's step radios are read
   by their drawn ring (E27).
3. Home's open walk: forth is the six panel stops, then exactly the closed walk's stops from its first `main` stop on. Back
   equals the closed walk's back list. At 375, 390 and 959 each stop's ring top is within 1px of the closed walk's.
4. Shift+Tab from Home's first `main` stop, after the menu has closed by check 1: focus is on Menu,
   `aria-expanded="false"`. Enter opens the panel again, and Tab reaches "Tracks".
5. With the menu open, focus "TechConcepts home" (Shift+Tab from Menu), then Shift+Tab again: the skip link has focus, and
   the panel is hidden.
6. With the menu open and focus on Menu, Tab through all six panel links: the panel stays open at every one of them.
   Focus on the theme button (Shift+Tab from Menu) also leaves it open.
7. With the menu open on Home, click Next step (below 861px) or step 2's row (959): `#demo-s2` is checked, the panel is
   hidden, and `.demo__says`'s top is at or below the header's foot and above the window's foot.
8. With the menu open, click the hero's paragraph text, which takes no focus: the panel stays open.
9. Escape with the panel open closes it and puts focus on Menu (case 51, unchanged). Clicking "How a lesson works" in the
   panel lands `#try` as E26/2.143 measured (80px padding, not 403).
10. At 960 × 900 and 1440 × 900, Home's walk equals `revamp`'s, and no `aria-expanded` changes.
11. With JavaScript off, the menu does not open and nothing else changes.
12. `index.astro` gains no `.demo__in` rule inside an open-menu selector, and Home still has exactly two `<script>`
    elements (`home-page.test.ts` case 2).

## Open questions for the orchestrator

1. **Where it is built.** The cleanest place is B37: its Home walk becomes `strict: 'all'` and needs this rule to be
   green with the menu open. But it widens B37 into `SiteHeader.astro` and the open-menu tests of five more pages, so
   the spec review needs new cases. The alternative is a small unit of its own after B37 and before B38, which also edits
   the header's script. In that case B37 counts Home's four open step-1 stops, (a), until that unit merges.
2. **The Lesson page's own E28 handler** is now redundant. Should it go in a later cleanup task? Removing it would touch
   a lesson file.
