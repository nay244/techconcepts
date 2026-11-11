# D3: the lesson between 761px and 1099px

Design unit D3 of `plan.md`. The prototype is `prototypes/d3-lesson-tablet.html`: open it from the file system and resize the window. It is the DHCP lesson, with the markup, the drawing and the styles copied from the running site, and the design's own rules in the one style element marked `data-d3`. The strip at the top edge ("Prototype: A, B, Today") is the prototype's switch and is not part of the design; `?chrome=0` hides it. `?step=0` to `7`, `?theme=dark`, `?variant=b` and `?tab=steps` open a state.

## The problem, measured

Between 761px and 1099px wide the lesson is the old stack: top bar, outline, scene, explanation, log, in one scrolling column. On DHCP at step 2:

| Window | Page height | The scene starts | Back, Play, Next | Drawing |
|---|---|---|---|---|
| 768×1024 | 1,714px | 914px down | 1,558px down | 353×168 |
| 1024×768 | 1,567px | 865px down | 1,447px down | 353×168 |

In Learn the page is 2,775px tall at 768×1024 and 2,397px at 1024×768.

## The design

No third layout. Each window in the range gets one of its two neighbours:

- **An upright window, or one under 900px wide: the phone layout, grown.** The scene is pinned under the compact top bar, the three tabs (Explain, Steps, Log) choose what shows under it, and Back, Play and Next are pinned at the bottom. Five things are tuned for the larger screen (below).
- **A window on its side, 900px wide or more: the desktop layout with the outline folded into a tab.** The same panels as at 1100px: the scene with its table, the explanation beside it, the log under both with the controls in its head. The 268px outline column is gone; the outline is the second of two tabs (Explain, Steps) on top of the explanation's column.
- **A window under 600px tall** (a phone on its side, a very short laptop window) keeps today's stacked page. Neither layout fits it: see the open questions.
- **With JavaScript off** the range keeps today's stacked page, as the phone does, because both layouts need the tabs.

Which layout a window gets (variant A, recommended):

| Width | Upright (taller than wide) | On its side, 600px tall or more | Under 600px tall |
|---|---|---|---|
| up to 760px | phone (unchanged) | phone (unchanged) | phone (unchanged) |
| 761 to 899px | phone, grown | phone, grown | stacked, as today |
| 900 to 1099px | phone, grown | desktop, outline in a tab | stacked, as today |
| 1100px and up | desktop (unchanged) | desktop (unchanged) | desktop (unchanged) |

As media queries:

- The phone layout: `(max-width: 760px), (max-width: 899px) and (min-height: 600px), (max-width: 1099px) and (orientation: portrait)`. Today it is `(max-width: 760px)`.
- "Grown" (the five tunings): `(min-width: 761px) and (max-width: 899px) and (min-height: 600px), (min-width: 761px) and (max-width: 1099px) and (orientation: portrait)`.
- The desktop layout with the outline in a tab: `(min-width: 900px) and (max-width: 1099px) and (orientation: landscape) and (min-height: 600px)`.
- All three apply only under `:root.js`.

**Why the split is on shape as well as width.** The drawing is as wide as its column and no taller. Upright, the stacked phone layout gives it the whole width; on its side, the desktop's columns give it more than a band across the top would.

| Window | Phone layout, grown | Desktop, outline in a tab |
|---|---|---|
| 768×1024 | **768×366** | 382×182 (computed: the scene's column would be 384px) |
| 1024×768 | 559×266 | **630×300** |
| 1024×1366 (a large tablet upright) | **924×440** | 638×304 in a panel about 1,000px tall (computed) |
| 900×700 | 502×239 at 899px | **488×232**, with the table, the log and 80px more of the words in view |

### Layout 1: the phone layout, grown

Everything is the phone layout as built (`docs/direction.md` §7), and as unit B2 leaves it. Five things change above 760px:

1. **The scene is 40% of the window's height** while watching, from 34%. In Learn and Practice it stays 18%. (`--ph-stage: 40dvh`.) At 768×1024 the drawing then fills the width.
2. **One centred column, 520px wide**, holds what is under the tabs: the explanation, the outline, the log, and the row of controls. The top bar, the scene and the tabs keep the full width. The explanation's side padding is `max(22px, (100vw - 520px) / 2)`; the outline's is that less 8px and the log's that less 14px, so their words start on the same line as the explanation's.
3. **Play's triangle and word sit together** in the middle of the button (`justify-content: center`). On the phone they drift apart as the button widens.
4. **The top bar shows the step segments again**, before "Step 2 of 5".
5. **The top bar shows the stamp again**, at the right end of the title's line, before the theme button.

Still hidden, as on the phone: the brand's word, the "Tracks" and track crumbs, "Lesson 9 of 19", the OSI chips, the scene's title.

Regions on DHCP, step 2 (px from the top of the window):

| Region | 768×1024 | 899×1200 | 768×600 |
|---|---|---|---|
| Top bar | 0 to 52 | 0 to 52 | 0 to 52 |
| Scene (head 40px, then the figure) | 52 to 462; figure 768×369 | 52 to 532; figure 899×439 | 52 to 292; figure 768×199 |
| Drawing | 768×366 | 899×428 | 418×199 |
| Tabs | 462 to 510 | 532 to 580 | 292 to 340 |
| The part on show | 510 to 960 (450px) | 580 to 1136 (556px) | 340 to 536 (196px) |
| Controls | 960 to 1024 | 1136 to 1200 | 536 to 600 |
| Words column | x 124 to 644 | x 190 to 710 | x 124 to 644 |

In Learn at 768×1024 the scene is 52 to 236, the drawing 301×143, and the words have 284 to 960 (676px).

The lesson's own table (DHCP's leases) is under the figure and the scene's area scrolls to it, as on the phone today. Whatever place unit D2 gives it on the phone, it has here.

### Layout 2: the desktop layout with the outline in a tab

Everything is the desktop layout as built (`prototypes/s1-lesson-facts.md` §1), and as unit B1 leaves it. What changes below 1100px:

1. **No outline column.** `.console` is one column; `.console__main` has the full width inside the 12px padding. Its columns stay `minmax(0, 1fr)` and 348px, its rows `minmax(0, 1fr)` and `clamp(200px, 26vh, 252px)`.
2. **Two tabs on top of the explanation's column: Explain and Steps.** They are the phone's tabs (the same element, the same look: 48px tall, Barlow Semi Condensed 600 at 17px, the chosen one on the panel colour with a 3px orange line under it, the other on `--bg-soft`). The row has the panel's 1px line and its corners at the top; the panel under it has no top line and square top corners, so the two read as one panel. The Log button is not shown: the log is on screen.
3. **Steps shows the outline** in the explanation's place, in the same box, scrolling inside itself. Choosing a step returns to Explain, as on the phone.
4. **A reader who arrives with Log chosen** (by turning a tablet from upright) sees Explain, and Explain is the pressed tab (`aria-pressed="true"`). The prototype resets the tab when the layout changes.
5. **The top bar keeps the lesson's name whole.** Not shown: the brand's word (the mark stays, and still links home), the "Tracks" crumb and its "/", and "Lesson 9 of 19". Shown: the track's name, the lesson's name, the stamp, the segments and "Step 2 of 5", the OSI chips, the theme button. The bar stays 68px, on one line.
6. **Back, Play, Next and the speed button are 44px tall and at least 44px wide**, from 34px: a tablet on its side is the usual screen here.

Regions on DHCP, step 2 (x, y, width, height in px):

| Region | 1024×768 | 900×700 | 1099×800 |
|---|---|---|---|
| Top bar | 12, 12, 1000×68 | 12, 12, 876×68 | 12, 12, 1075×68 |
| Scene panel | 12, 92, 640×452 | 12, 92, 516×384 | 12, 92, 715×476 |
| Figure inside it | 638×300 | 514×232 | 713×324 |
| Drawing | 630×300 | 488×232 | 681×324 |
| Lease table, under the figure | 638×100 | 514×100 | 713×100 |
| Tabs | 664, 92, 348×48 | 540, 92, 348×48 | 739, 92, 348×48 |
| Explanation, or the outline | 664, 140, 348×404 | 540, 140, 348×336 | 739, 140, 348×428 |
| Log | 12, 556, 1000×200 | 12, 488, 876×200 | 12, 580, 1075×208 |
| Controls, in the log's head | 242×44 | 242×44 | 242×44 |

Learn and Practice keep this layout, as the desktop does today: the words are in the 348px column (37 characters a line). Unit D1 is designing the desktop's reading layout. Its main area at 1168px to 1367px wide is as wide as this layout's at 900px to 1099px (876px to 1075px), so D1's layout could apply here as it is. It does not yet: see the errata at the end.

### The rules

Written against `src/lesson/console.css` as it is today. The tabs and the outline are placed here with `position: absolute` inside `.console`, the way the phone layout places its regions; any way that lands the boxes in the table above is fine. The builder also changes the phone block's own query to the first one above, and moves the tab buttons' look out of the phone block so that both layouts share it.

```css
@media (min-width: 761px) and (max-width: 899px) and (min-height: 600px),
  (min-width: 761px) and (max-width: 1099px) and (orientation: portrait) {
  /* The scene takes more of a taller screen. The words, the outline, the log and the controls share one centred
     column, narrow enough to read. */
  :root.js .console {
    --ph-stage: 40dvh;
    --ph-col: 520px;
    --ph-side: max(22px, calc((100vw - var(--ph-col)) / 2));
  }
  :root.js .console__explain {
    padding-inline: var(--ph-side);
  }
  :root.js .console__outline {
    padding-inline: calc(var(--ph-side) - 8px);
  }
  :root.js .console__log {
    padding-inline: calc(var(--ph-side) - 14px);
  }
  :root.js .console__controls {
    padding-inline: var(--ph-side);
  }
  /* Play is wide here: its mark and its word stay together in the middle. */
  :root.js .console__controls .cbtn--play {
    justify-content: center;
  }
  /* The top bar has room again for the two things the phone drops for want of it. */
  :root.js .topbar__segments {
    display: flex;
  }
  :root.js .topbar__crumb > a.stamp {
    display: inline-flex;
  }
}

/* 900 to 1099px wide, on its side, at least 600px tall: the desktop layout with the outline folded into a tab. */
@media (min-width: 900px) and (max-width: 1099px) and (orientation: landscape) and (min-height: 600px) {
  :root.js .console {
    --mid-words: 348px;
    --mid-tabs: 48px;
    --mid-log: clamp(200px, 26vh, 252px);
    position: relative;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: 68px minmax(0, 1fr);
    height: 100vh;
    height: 100dvh;
    min-height: 0;
    overflow: hidden;
  }
  :root.js .console__top {
    flex-wrap: nowrap;
  }
  :root.js .console__top > * {
    padding-block: 0;
  }
  :root.js .topbar__brand {
    min-width: 0;
  }
  /* The bar is 268px narrower than the narrowest desktop's. The lesson's name stays whole: the brand's word, the
     "Tracks" crumb and the lesson's number give way. */
  :root.js .topbar__brand b,
  :root.js .topbar__crumb > a:first-child,
  :root.js .topbar__crumb > a:first-child + span,
  :root.js .topbar__crumb > em {
    display: none;
  }
  :root.js .console__main {
    grid-column: 1;
    grid-row: 2;
    grid-template-columns: minmax(0, 1fr) var(--mid-words);
    grid-template-rows: minmax(0, 1fr) var(--mid-log);
  }
  :root.js .console__stage {
    grid-column: 1;
    grid-row: 1;
    min-height: 0;
  }
  :root.js .console__explain {
    grid-column: 2;
    grid-row: 1;
    margin-top: var(--mid-tabs);
    border-top-width: 0;
    border-start-start-radius: 0;
    border-start-end-radius: 0;
  }
  :root.js .console__log {
    grid-column: 1 / -1;
    grid-row: 2;
    max-height: none;
  }
  :root.js .log__head {
    flex-wrap: nowrap;
  }
  /* A tablet on its side is the usual screen here: Back, Play and Next are sized for a finger. */
  :root.js .console__controls .cbtn {
    height: 44px;
    min-width: 44px;
  }

  /* The tabs sit on top of the words' column: Explain and Steps. The log is on show under both, so it needs no tab. */
  :root.js .console__tabs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    position: absolute;
    top: 92px;
    right: 12px;
    width: var(--mid-words);
    height: var(--mid-tabs);
    overflow: hidden;
    border: 1px solid var(--line);
    border-bottom-color: var(--line-strong);
    border-radius: var(--r-tile) var(--r-tile) 0 0;
    background: var(--bg-soft);
  }
  :root.js .console__tabs button {
    border: 0;
    border-bottom: 3px solid transparent;
    background: none;
    color: var(--ink);
    font: 600 17px/1 var(--display);
    letter-spacing: 0.01em;
    cursor: pointer;
  }
  :root.js .console__tabs button + button {
    border-left: 1px solid var(--line);
  }
  :root.js .console__tabs button:nth-child(3) {
    display: none;
  }
  :root.js .console__tabs button[aria-pressed='true'] {
    border-bottom-color: var(--here);
    background: var(--card);
    color: var(--ink-strong);
  }
  :root.js .console__outline {
    position: absolute;
    top: calc(92px + var(--mid-tabs));
    right: 12px;
    bottom: calc(24px + var(--mid-log));
    width: var(--mid-words);
    border-top-width: 0;
    border-start-start-radius: 0;
    border-start-end-radius: 0;
  }
  :root.js .console:not([data-tab='steps']) .console__outline,
  :root.js .console[data-tab='steps'] .console__explain {
    display: none;
  }
}
```

## States

All in the prototype, in both themes:

- Overview, each of the five steps, Learn, Practice: Back and Next, the arrow keys, or the outline.
- Layout 1: Explain, Steps and Log tabs. Choosing a step from Steps returns to Explain.
- Layout 2: Explain and Steps tabs. Choosing a step from Steps returns to Explain.
- Network and Sequence views of the scene.
- "Go deeper" open and closed.
- Turning the window: 768×1024 to 1024×768 and back keeps the place in the lesson; with Log chosen it lands on Explain.
- Under 600px tall, and the "Today" setting of the switch: the stacked page.

Not in the prototype, because the design does not touch them: Play's animation (Play moves on one step), Practice's answers, and the "All 19 lessons" dialog.

## Words

No new words. The tabs are the phone's: "Explain", "Steps", "Log".

## Variant B: the phone layout all the way to 1099px

One layout below 1100px: Layout 1 above, for every window 600px tall or more. The phone block's query becomes `(max-width: 760px), (max-width: 1099px) and (min-height: 600px)`, the five tunings apply from 761px to 1099px, and there is no Layout 2.

**What it buys.** Less to build and keep: one query changes and the five tunings are added; the 110 lines of Layout 2, its two-tab state and its top bar are not needed. Words at 68 characters a line everywhere, where Layout 2 has 37.

**What it costs**, at 1024×768 on DHCP:

| | A | B |
|---|---|---|
| Drawing at a step | 630×300 | 559×266 |
| Drawing in Learn | 638×304 | 204×97 |
| Words | 348×404, 37 characters a line | 520px column, 297px tall, 68 characters a line |
| Lease table | in view | under the scene: scroll the scene's area |
| Log | in view | behind a tab |
| Track's name, OSI chips | shown | not shown |
| Growing the window to 1100px | the outline takes its column; nothing else moves | every region moves |

**Recommended: A.** On its side, a tablet has the room for what the desktop shows at once, and the step from 1099px to 1100px changes one thing.

## Acceptance checks

On `/networking/dhcp`, with JavaScript on, in the light and the dark theme alike. "In view" means the element's box is wholly inside the window. Sizes are within 1px.

Layout 1, at 768×1024:

1. At `?step=2` the page does not scroll (`scrollHeight` is 1024). `.console__scene` and `.console__controls` are in view.
2. `.console__stage` is 410px tall and starts at 52px. The drawing is 768px wide: the svg's box is 768×369.
3. `.console__tabs` shows three buttons. `.console__outline` and `.console__log` are not shown; `.console__explain` is.
4. `.explain__narr` is 520px wide and starts at x 124. A line of it holds 80 characters or fewer.
5. `.console__controls` buttons run from x 124 to x 644; each is 48px tall.
6. In the top bar `.topbar__segments` and `.stamp` are shown; `.topbar__brand b`, `.topbar__osi` and the crumb's links to Tracks and to the track are not.
7. Steps shows the outline and hides the explanation; choosing "DHCP Request" shows the explanation for step 3 with Explain pressed. Log shows the log.
8. At `?step=6` (Learn) the page does not scroll, `.console__stage` is 184px tall, and the scene and the controls are in view.
9. At 761×1024 and at 899×1200 checks 1 and 3 hold. At 1024×1366 they hold too, and the svg's box is 1024×505.

Layout 2, at 1024×768:

10. At `?step=2` the page does not scroll. `.console__scene` and `.console__controls` are in view.
11. `.console__stage` is at 12, 92 and is 640×452. `.console__explain` is at 664, 140 and is 348×404. `.console__log` is at 12, 556 and is 1000×200. The svg's box is 638×300.
12. `.console__tabs` is at 664, 92 and is 348×48, with two buttons shown: Explain (pressed) and Steps. `.console__outline` is not shown.
13. Steps shows `.console__outline` at 664, 140, 348×404, and hides the explanation. The log, the scene and the controls stay in view. Choosing "Lease Renewal" shows the explanation for step 5 with Explain pressed.
14. Each `.console__controls .cbtn` is 44px tall and at least 44px wide.
15. In the top bar the `h1` is not cut (`scrollWidth` is no more than `clientWidth`) at 1024px and at 900px. `.topbar__brand b`, the "Tracks" link and "Lesson 9 of 19" are not shown; the track's link, `.stamp`, `.topbar__segments` and `.topbar__osi` are.
16. At `?step=6` (Learn) and `?step=7` (Practice) checks 10 and 12 hold.
17. At 900×700 and at 1099×800 checks 10 and 12 hold.
18. Starting at 768×1024 with Log chosen, then resizing to 1024×768: the explanation is shown and Explain has `aria-pressed="true"`.

The edges:

19. At 760×1024 and at 1100×800 the page is as it is before this unit (the existing visual tests pass unchanged).
20. At 844×390 and at 1000×599 the page is the stacked page, as today: `.console__tabs` is not shown and the page scrolls.
21. With JavaScript off, at 768×1024 and at 1024×768, the page is the stacked page, as today.
22. `/networking/osi-model?step=3`, `/networking/subnetting?step=2` and `/networking/firewalls?step=2` pass checks 1 and 10.

## Measurements

DHCP. "Today" is the running site; "after" is the prototype, variant A. Light and dark give the same numbers.

| Window, place | | Page scrolls | Scene in view | Controls in view | Drawing |
|---|---|---|---|---|---|
| 768×1024, step 2 | today | yes, 1,714px | no, 914px down | no, 1,558px down | 353×168 |
| | after | no | yes | yes | 768×366 |
| 768×1024, Learn | today | yes, 2,775px | no, 914px down | no, 2,185px down | 372×177 |
| | after | no | yes | yes | 301×143 |
| 1024×768, step 2 | today | yes, 1,567px | no, 865px down | no, 1,447px down | 353×168 |
| | after | no | yes | yes | 630×300 |
| 1024×768, Learn | today | yes, 2,397px | no, 865px down | no, 2,101px down | 372×177 |
| | after | no | yes | yes | 638×304 |

At the edges of the range, step 2:

| Window | Today | After |
|---|---|---|
| 760×1024 | phone layout, drawing 645×307 | the same |
| 761×1024 | stacked, 1,752px, drawing 353×168 | Layout 1, no scroll, drawing 761×362 |
| 899×1200 | stacked | Layout 1, drawing 899×428 |
| 900×1200 (upright) | stacked, 1,647px | Layout 1, drawing 900×428 |
| 900×700 (on its side) | stacked, 1,647px | Layout 2, drawing 488×232 |
| 1099×800 | stacked, 1,568px | Layout 2, drawing 681×324 |
| 1100×800 | desktop, drawing 434×207 | the same |
| 844×390 | stacked, 1,697px | the same |

At 375px and 1440px wide the prototype and the running site give the same boxes (375×812: drawing 375×179, no scroll; 1440×900: drawing 733×349, no scroll).

The rules were also tried on the running site's own pages by injecting them: OSI Model, Subnetting and Firewalls fit one screen at 768×1024 and 1024×768, with drawings of 540×369 and 514×351, 674×369 and 545×298, 753×369 and 441×216. OSI Model's outline (925px) scrolls inside the Steps tab's 404px, as it does in the desktop's column.

## Open questions

1. **Should the outline stay in a tab above 1100px?** At 1099×800 the drawing is 681×324; at 1100×800 the desktop layout takes over and it is 434×207, a third narrower for one more pixel of window. At 800px tall the desktop's drawing does not catch up until about 1350px wide. Moving the desktop's edge is outside this unit and touches the sidebar the owner asked to keep.
2. **A phone on its side** (844×390 and the like) is inside this range by width and keeps the stacked page, because neither layout fits 390px of height: the phone layout would leave the words 70px. Phones narrower than 761px on their side already get that today: at 667×375 the words have 84px and the drawing is 182×87. A third arrangement, the scene beside the tabs, would fit, and is a design of its own.
3. **Learn and Practice in Layout 2** read in the 348px column until D1's reading layout is built. If D1's layout is not approved, should Learn and Practice on a tablet on its side use Layout 1?
4. **The stamp in Layout 1's top bar** assumes D2 has not given the stamp another place on the phone that also shows above 760px. If it has, one of the two goes.
5. **At 1100px the lesson's name is squeezed out of today's desktop top bar** (the `h1` is 0px wide on DHCP at 1100×800). Layout 2's bar drops three things to keep the name whole; the desktop's bar may want the same: DHCP's name is whole from about 1180px, and a longer name later. Not part of this unit.

## Errata, 2026-11-11

Found when the build was reviewed. Variant A is otherwise as approved. Both are the orchestrator's rulings, shown to the owner.

1. **Learn and Practice keep the 348px column in the desktop-with-tab layout.** This spec said D1's reading layout "applies here as it is", while its own check 16, its prototype and D1's spec (761px to 1099px "unchanged", the "Show log" button hidden at 1024) all keep the 348px column. The owner approved the prototype and three of the four statements, so those stand. Whether a tablet on its side should get D1's wider words and folded log is an open question for the owner (it was this spec's open question 3).
2. **The tabs' focus ring is drawn inside the button** in the desktop-with-tab layout: `outline-offset: -3px` on `.console__tabs button:focus-visible`. The tab row has `overflow: hidden` (to round its corners into the panel), which cut the lesson's usual ring, 2px outside the button, down to one 2px line between the two tabs: a keyboard user could not tell which tab had focus.

**Approved by the owner on 2026-11-11**, with one change: erratum 1 is reversed. Asked whether a tablet on its side should get D1's wider words and folded log in Learn and Practice, the owner said yes. So in the desktop-with-tab layout (900px to 1099px wide, on its side, 600px tall or more) D1's reading layout applies as it is, as this spec first said:

- In Learn and Practice the words column is D1's: `max(348px, min(560px, 100% - 496px))` of the main area, which is the window less 24px. That is 380px at 900 wide, 504px at 1024 and 560px at 1099; the scene keeps the rest, never under 484px.
- The tabs (Explain, Steps) stay on the words column: as wide as it, at the same right edge, 48px tall.
- The log folds to its head, with D1's "Show log" / "Hide log" button, folded at first and kept for the visit, as on a desktop. Back, Play and Next stay in the log's head.
- At the Overview and on Watch steps nothing changes: the 348px column and the open log.
- Check 16 changes with it: in Learn and Practice at 1024x768 the tabs' box is 508, 92, 504x48 and `.console__explain` is 504px wide; the log is 62px tall until "Show log" is pressed. (Folded, the log is its head and nothing more. On a desktop that is 52px, around 34px controls; here the controls are 44px, so the head is 62px with its usual 8px padding. This line first said 52px, which could only hold by squeezing the head's padding to 3px.)

