# D26: a lesson change without a page load, what the reader sees, hears and can reach

Job 30, decision 10. Designer: `designer` on Opus 5.5, 2026-11-21. Prototype: `prototypes/d26-lesson-change.html` (open it from the file system; the strip above the page switches variant, width, theme, reduced motion and the network).

The engineering is decided in `plan.md` (job 30, decisions 1 to 11) and is not reopened here. This spec rules what decision 10 leaves open: the slow case and its limit, focus, the live region's words, motion, the lessons sheet on a phone, the reader's own row, Networking's two kinds of change, and which of the reader's state carries over. Every place this spec says "a load" it means today's page load of that lesson's address, fresh.

The example throughout is How the Internet Works: What is TCP (lesson 3 of 14) to What is UDP (lesson 4 of 14), by each of the three controls, and Back. Both draw `net-map`.

## 1. What changes and what stays

**Stays exactly as today:** every part of the Lesson page's look and layout at every width (direction §6, §7); the three controls' look at rest, their words and their names; every link's `href`; the site's header; the page load for every change that is not a swap (decision 1) and for every press that is not a plain primary click or Enter (decision 7); what a load shows.

**New, and only during or right after a swap:**

1. The pressed outline row's **going mark** (§3.1), from the press to the swap.
2. The **signal**: the cable under the lesson's bar runs (§3.2), from 100 ms after the press to the swap.
3. The **"Opening UDP" tape** under the bar's right end (§3.3), and the live region's "Opening UDP.", from 400 ms after the press to the swap.
4. At the swap: focus placed by §4, the live region's lesson line (§5), and in variant B only, 180 ms of motion on the new words (§6).

Nothing else is added: no spinner, no overlay, no dimming of the old lesson, no skeleton.

## 2. The sequence of a change

Times are from the press (the `click` that the console takes, or the `popstate` for Back and Forward).

| Time | What the reader sees | What a screen reader hears |
|---|---|---|
| 0 ms | The old lesson, whole and live. An outline row that was pressed takes the going mark (§3.1). The "Next lesson" button and the Up next card show nothing new: the button keeps focus; the card keeps its pressed look only as long as the browser shows `:active`. | Nothing new. |
| 100 ms, if the data has not arrived | The signal starts (§3.2). | Nothing new. |
| 400 ms, if the data has not arrived | The tape "Opening UDP" appears (§3.3). | "Opening UDP." (the live region, polite) |
| The data arrives and is good (decision 8) | **The swap**, in one frame: the whole new lesson as a load of it shows it, with §7's carry-overs; the going mark, the signal and the tape are gone in that same frame; the address, title and meta change (decisions 5, 6). | The lesson line (§5), e.g. "UDP. Lesson 4 of 14. Overview." |
| 2000 ms, if the data has not arrived | The fall-back (decision 8): the console goes to the address the old way. The signal and the tape stay up until the browser replaces the page. | What the browser and the screen reader say for any page load. |
| Any time before 2000 ms: the fetch fails, is not a 200, or carries another build's stamp | The fall-back at once, as above. | As above. |

**The limit is 2000 ms** (decision 8's number). Reason: the lesson's data takes a median of 243 ms on slow 4G with the CPU 4× slower, and the whole page load on the same phone takes 966 ms (`plan.md`, "What the measurement found"). Past 2000 ms (8× the data's median, about twice a full page load) the data is no longer the slow part: something is stuck, and the browser's own load, with its own progress and its own Stop, is the better bet. A shorter limit would throw away a fetch that is nearly there on a slow phone and start a 152 KB download from nothing.

**Why 100 and 400 ms.** The signal waits 100 ms so that on a desktop (the data in 4 ms) and on fast 4G (83 ms, median) it never paints: a swap there is one frame with nothing in between. The words wait 400 ms so the slow-4G median (243 ms) never shows them, and a reader whose press has not answered within about half a second is told what is happening.

**No minimum.** Nothing waits for a state to have been shown for some time: the swap happens on the first frame after the data is good.

## 3. The three new marks

All values are tokens from `src/styles/tokens.ts`; nothing new is added to it.

### 3.1 The going mark (the pressed outline row, column and sheet)

From the press to the swap, the row pressed shows where the reader is going: the row's "here" look with its edge drawn as the cable's dashes instead of a solid line.

- Background `--here-soft` (the "here" row's own).
- Left edge: 3px wide, the full height of the row, dashes of `--here` 4px long with 3px gaps, running top to bottom (`repeating-linear-gradient(to bottom, var(--here) 0 4px, transparent 4px 7px)`), inside the row's 3px corner like today's inset bar. It never moves.
- Text, number and status: unchanged.
- The old lesson's row keeps its solid "here" look until the swap. For the moment between, two rows are marked: the solid one is where the reader is, the dashed one where they are going.
- `aria-current` does not move until the swap. The going mark is visual only: no attribute a screen reader reads changes.

### 3.2 The signal (the cable under the lesson's bar)

A 2px run of `--accent` dashes along the bottom edge of the lesson's bar (`.console__top`), over its 1px border, the bar's full width inside its 3px corners: at 1440 from the track column's left edge to the scene's right edge (x 12 to 1027 at 1440 × 900); at 375 the full width (0 to 375). The dashes are 6px long with 4px gaps. They march to the right at 50px a second (the pattern moves one 10px period every 200 ms, linear, for as long as the signal is up).

While the lessons sheet is open (§8) the signal runs along the bottom edge of the sheet's head (`.outline__dialog-head`), the full width of the sheet, instead.

**Reduced motion:** the same dashes, still. Nothing marches.

The signal is `aria-hidden` and takes no space: it is drawn over the edge (an absolutely placed 2px strip, `bottom: -1px`), so nothing in the layout moves when it comes or goes.

### 3.3 The tape: "Opening UDP"

A label tape like the Event log's name (the `.console__ptitle` look) set on the page under the bar's right end.

- Words: `Opening <title>`, where `<title>` is the new lesson's title as the outline lists it ("Opening UDP"). Shown in capitals by CSS, as every tape is; the source text is sentence case.
- Font: 700 11.5px/1.2 Atkinson Hyperlegible Mono, letter-spacing 0.12em, `text-transform: uppercase`, colour `--accent`.
- Box: height 22px, padding 0 8px, 1px solid `--accent-line`, radius 4px, background `--card`; a single line, `white-space: nowrap`.
- Place: absolutely placed, so the layout does not move. Its top is 4px below the bar's bottom edge; its right edge is 12px inside the bar's right edge (1440: over the scene panel's top-right corner, above the scene's title line; 375: over the empty right end of the Network / Sequence row). While the sheet is open, the same 4px under the sheet's head, 12px from its right edge.
- It is `aria-hidden`: the live region says the same words once (§5).
- It never overlaps a control or a word: at 1440 × 900 the bar ends at y 149 and the scene's title line starts at y 180, so the tape (y 153 to 175) sits in the gap and on the scene panel's top edge, right of the Network / Sequence switch; at 375 the Network / Sequence switch ends at x 165 and the tape, for the longest lesson title in both tracks ("Load Balancers", 14 characters), starts right of x 190.

## 4. Where focus goes

**The rule:** focus stays on the control the reader pressed when that control is still on the page after the swap; when it is gone, focus goes to the new lesson's name, the page's `h1`.

| How the change came | 1440 (track column) | 375 (lessons sheet) |
|---|---|---|
| An outline row | **The row pressed**, now "UDP, current page". Where a row's node is made again (its part changed from `details` to `section`), focus is put on the new node of the same lesson's row. | The sheet closes at the swap (§8), so the row is gone: **the `h1`** ("UDP", in the lesson's bar). |
| The Up next card | The card is gone (the new lesson is at its Overview): **the `h1`** ("UDP", in the column's head). | **The `h1`** in the lesson's bar. |
| "Next lesson: UDP" (the forward button) | **The forward button**, the same node, now "Next: Connectionless Send". | **The forward button**, now "Next: step 1". |
| Back or Forward (the browser's) | **The `h1`**. No control on the page was pressed. | **The `h1`**. |
| The fall-back (a page load) | As a page load. | As a page load. |

- **The `h1` takes focus with `tabindex="-1"`** set while it holds it and removed on `blur`, so it never joins the Tab order. At 1440 the visible `h1` is the column's `.top__name`; under 1100px it is the bar's. The one that is rendered takes focus (`display: none` on the other).
- **Its ring** is the site's `:focus-visible` ring (2px `--focus`, offset 3px, radius 4px), so it shows after a keyboard press and not after a pointer press or a tap.
- **Focus is placed in the same frame as the swap**, after the sheet's `close()` where the sheet was open (the dialog's own return of focus to the "3 of 14" button is overridden).
- **Nothing scrolls the window on purpose.** Where focus moves to the `h1`, `focus()` brings it into view as the browser does (the default, not `preventScroll`).
- **During the wait, focus does not move.** The old lesson is live: Tab, Space, ← and → work on it as before (§10).

Why not always the `h1`: a reader moving through the outline with the keyboard keeps their place in the list, and a reader pressing "Next" through a lesson keeps pressing "Next" into the following one, as they do between steps. Why not always stay: the Up next card and the sheet's row leave the page, and focus on a removed node falls to the `body`, where a keyboard user starts again from the page's top.

## 5. What a screen reader hears

The console's one live region (`p.sr-only[aria-live="polite"][data-announce]`) says every word below. No other region is added and none of the marks in §3 is read.

| When | The live region's text |
|---|---|
| 400 ms into a wait | `Opening <title>.` e.g. "Opening UDP." |
| The swap | `<title>. Lesson <n> of <total>. <place>.` e.g. "UDP. Lesson 4 of 14. Overview." |
| Back to TCP | "TCP. Lesson 3 of 14. Overview." |
| Networking, Ports to TCP/UDP | "TCP/UDP. Lesson 11 of 20. Overview." |
| A lesson of many units | `<place>` is `resumeLabel(lesson, 0)`, which names the first unit: `<title>. Lesson <n> of <total>. <unit name>, Overview.` |
| The next move inside the new lesson | As today (`stepAnnouncement` or the place's name). |
| The fall-back | Nothing more from the console. |

- `<title>` is `lesson.title`; `<n>` is `entry.number`; `<total>` is the track's total, as the column's "Lesson 4 of 14" shows them. `<place>` is the place the swapped lesson opens at, always its first unit's Overview (the position starts again, decision 5).
- The lesson line is written in the same commit as the swap, so it is the first thing said about the new lesson and is never the same text as the line before it (the old lesson's place).
- When the swapped lesson is finished or in progress, the Overview shows "Done" or "Resume at …" as a load does; the line does not say it.

## 6. What moves: two variants

The drawing never moves and is never redrawn by the change (decision 4): the driver's `show` repaints its labels and layers for the new lesson in the swap's frame, as it does between units. Whatever the lesson's own opening plays on a load plays after a swap the same way (decision 5; the spec review settles what plays for 600 ms as a lesson opens). The two variants differ only in what the change itself adds.

### Variant A, "Cut" (recommended)

The new lesson is painted whole in one frame. The change adds no motion of its own. Under reduced motion it is the same.

### Variant B, "Settle"

In the swap's frame the new lesson is whole and in place, and two blocks of new words settle into it:

- the guide's words (`.console__guide`'s explanation: the badge, the place, the Overview's text, down to its foot; not the controls and not the key line), and
- the column's head (the `h1`, "Lesson 4 of 14", the strip and "n of 14 done"; under 1100px, the bar's first cell instead).

Each goes from `opacity: 0.4; transform: translateY(6px)` to `opacity: 1; transform: none` over 180 ms, `cubic-bezier(0.2, 0, 0, 1)`, both starting in the swap's frame. Nothing else moves. Under reduced motion, B is A.

**Why A.** It is what decision 5 asks for (a swapped lesson is a loaded one, and a load does not fade its words in), the film probe counts no frame between the two lessons, there is nothing to time or to test for, and reduced motion is not a second design. **What B buys:** a reader whose eyes are on the outline at 1440 (the row is 800px from the guide) gets a cue in the corner of their eye that the words beside them changed; with a cut, the change on the far side of the screen can be missed. It costs 11 frames in which the words are not yet fully drawn, which the film probe must then allow, and a CSS animation the build must start in the swap's frame and nowhere else (not on a load, not on a step).

## 7. What carries over and what starts again

"Starts again" means: as a load of the new lesson's address shows it. "Carries over" means the value the reader had in the old lesson stays.

| State (scout A3 and the page) | Ruling | Reason |
|---|---|---|
| The position, `seen`, `picks`, open definitions, `deepLinked` | Starts again | Decided (decision 5). |
| Playback speed (0.5×, 1×, 1.5×, 2×) | **Carries over** | How fast to watch is the reader's setting, not the lesson's; a reader who slowed TCP to 0.5× wants UDP at 0.5×. |
| Playback mode (playing, paused) | Starts again: idle | A load is idle; Play all never runs into a lesson the reader has not started. |
| The chosen view (Network or Sequence) | **Carries over** | It already carries from one unit to the next inside a lesson (`ScenePanel.tsx:121-122`); the next lesson is the same step at a larger scale. A lesson whose unit has no Sequence view shows Network, as today. |
| The tab on a phone (Explain, Log, Table / Rules / Bits) | Starts again: Explain | A new lesson begins with its Overview's words; at an Overview the log and the table are empty. |
| The table's "changed" mark (`changeSeen`) | Starts again | It marks a change in the old lesson's table. |
| The deeper box (`deeperOpen`) | Starts again: closed | It belongs to one place's words. |
| The log's fold in Learn and Practice (`logOpen`) | Starts again: closed | It folds one lesson's log; a load has it closed. |
| The lessons sheet (`sheetOpen`) | Closes at the swap (§8) | The reader chose a lesson to read it. |
| The scene's marks, `playedFor`, `hold` | Start again | So the opening plays as on a load. |
| The outline's filter (lessons of many units) | Starts again: all | It filters the old lesson's own places. |
| The outline's folds (the parts the reader opened) | **Carry over**; the new lesson's part is open and cannot close; the old lesson's part becomes a `details`, **open** | Nothing in the list moves under the reader's pointer or eye: a part that was open stays open, so the row pressed does not jump. |
| The outline column's scroll (1100px and up) | **Carries over**, then the new row is put wholly in view by the load's rule (8px clear) if it is not | The list stays where the reader left it; "Next lesson" into another part still shows the new row. |
| The explanation's scroll, the guide's scroll | Start again: top | As at any change of place. |
| The log's scroll | Starts again: top | The new log is empty. |
| The window's scroll | Not set by the swap | Only §4's `focus()` may bring the `h1` into view. |
| `?step=` in the address | None: the new address is the lesson's own | The new lesson opens at its Overview, with "Resume at …" when the reader has a place in it, as a load offers it. |
| The theme, the header's menu, the skip link | Untouched | They are outside the island. |
| Progress | Recorded for the new lesson as a load records it (decision 6) | |

Decision 5's equality checks leave out exactly the rows marked **Carries over**: the speed button's text and name, the view switch's pressed button, the open `details`, and the column's `scrollTop`.

## 8. The lessons sheet on a phone

- **A tap on a row leaves the sheet open** while the data is on its way. The row takes the going mark; the signal runs under the sheet's head from 100 ms; the tape sits under the sheet's head from 400 ms.
- **The sheet closes at the swap**, in the swap's frame, onto the new lesson. The reader sees one change: the sheet over TCP, then UDP. (Closing at the tap would show the old lesson again for the length of the wait, then change it under the reader.)
- **Focus lands on the `h1`** in the lesson's bar (§4), after the dialog's `close()`.
- **On the fall-back** the sheet stays open until the browser replaces the page.
- **A second row tapped during the wait** takes over (§10); the sheet stays open.
- **"Close", Escape or the backdrop during the wait** closes the sheet as today and does not cancel the change; when the swap comes, focus goes to the `h1` as above.
- **Android's back gesture with the sheet open** closes the sheet (Chrome's dialog close request) and is not a Back through the history; nothing in this spec changes that.

## 9. The reader's own row

- **At the swap**, in the same frame: `aria-current="page"` and the "here" look (`--here-soft` ground, the 3px solid `--here` inset edge) move from TCP's row to UDP's; the going mark goes.
- TCP's row keeps the status progress gives it ("Done" after reaching its Practice, "Started" in progress, nothing before).
- The column's head changes with it: the `h1` "UDP", "Lesson 4 of 14", the strip's orange segment moves from the 3rd to the 4th, and "n of 14 done" counts as progress has it. Under 1100px the bar's button reads "4 of 14" and its name "4 of 14: all 14 lessons, this is lesson 4".
- **The current lesson's own row is not a swap.** A plain click on it loads the page as today (decision 1 is a change to a *new* lesson; a reader asking for the same lesson again gets exactly a load).

## 10. Interruptions and odd cases

- **Another lesson control pressed during a wait:** the newest press wins. The earlier fetch is aborted, its going mark goes, and the timings of §2 start again from the new press (the signal, if up, stays up without a gap).
- **The old lesson's own controls during a wait** work as before (a stop, ← →, Space, the speed, the view, a tab); they do not cancel the change.
- **Play all running when the change is pressed** keeps running until the swap; the new lesson starts idle.
- **Back or Forward during a wait:** the newest wins, as above. A Back that leaves this document is the browser's own and ends everything.
- **The fall-back after Back or Forward** loads the address the browser now shows, without adding a history entry (`location.reload()`, not `assign`).
- **A modified click, a middle click, or "Open in new tab"** is the browser's (decision 7): no going mark, no signal.
- **A press before the island is listening** is a page load (decision 2).

## 11. Networking: 6 changes swap, 13 load a page

**The reader sees no difference before the press, and none is designed.** The three controls look the same, are named the same and say nothing about how they will open. Reason: which drawing the next lesson uses is not the reader's concern, and a mark that only some links carry would teach a distinction they can do nothing with.

**After the press** the two differ as the plan expects: a swap shows the marks of §2 and §3 (normally none, since the data comes fast) and then the new lesson in one frame; a change of drawing is today's page load, with no going mark and no signal (the console does not take that click). Making the 13 loads feel like the 6 swaps is the "not in this job" item of swapping across drawings.

## 12. The address and the title during a wait

- **A press:** the address, the title and the meta stay the old lesson's until the swap; `pushState` happens in the swap's commit (decision 6). A fall-back never pushes: the browser's own load adds the entry.
- **Back or Forward:** the browser has already shown the new address when `popstate` fires; the title and the meta follow at the swap. During the wait the page is the old lesson under the new address, with the signal and the tape saying what is coming.

## 13. Every word of new copy

| Where | Words | Notes |
|---|---|---|
| The tape (visible, `aria-hidden`) | `Opening <title>` | e.g. "Opening UDP". Capitals by CSS only. |
| The live region, 400 ms into a wait | `Opening <title>.` | e.g. "Opening UDP." |
| The live region, at the swap | `<title>. Lesson <n> of <total>. <place>.` | e.g. "UDP. Lesson 4 of 14. Overview." `<place>` from `resumeLabel(lesson, 0)`. |

No other word is new. The forward button, the Up next card, the rows, the bar's button, the column's head and the guide say what a load of the new lesson says.

## 14. Sizes and timings, in one place

| | Value |
|---|---|
| Signal starts | 100 ms after the press, if the data has not arrived |
| Tape and "Opening …" start | 400 ms after the press |
| The limit (fall-back) | 2000 ms after the press |
| A failed, non-200 or other-build fetch | fall-back at once |
| Signal | 2px, `--accent`, dashes 6px / gaps 4px, over the bar's bottom edge, inset 3px each side; marches 10px per 200 ms, linear; still under reduced motion |
| Going mark | row ground `--here-soft`; left edge 3px, `--here` dashes 4px / gaps 3px, top to bottom, still |
| Tape | 22px high, padding 0 8px, 1px `--accent-line`, radius 4px, `--card`; 700 11.5px/1.2 mono, 0.12em, uppercase, `--accent`; top 4px under the bar, right 12px inside it |
| Variant B | 180 ms, `cubic-bezier(0.2, 0, 0, 1)`, from `opacity: 0.4; translateY(6px)`; off under reduced motion |
| Breakpoint | 1100px, as today: the column and the column's `h1` from 1100px; the bar's `h1`, the bar's button and the sheet under it |

## 15. Acceptance checks

Each can be tried on the prototype and turned into a test (`e2e/lesson-change.spec.ts` unless a unit test says it better). "Swap" means a lesson change between two lessons that draw the same figure. Run at 1440 × 900 and 375 × 812 unless one is named.

**Timing and the slow case**

1. With the data answered in under 100 ms, no frame between the press and the swap shows the signal, the tape or an empty stage; the swap's first frame shows the new lesson whole.
2. With the data held 300 ms: the signal is present from 100 ms (±1 frame) to the swap and absent after; the tape is never shown; the live region never says "Opening".
3. With the data held 1000 ms: the tape reads "Opening UDP" from 400 ms (±1 frame) to the swap; the live region's text is "Opening UDP." from 400 ms and "UDP. Lesson 4 of 14. Overview." after the swap.
4. With the data never answered: at 2000 ms (±50) the browser loads `/how-the-internet-works/what-is-udp`; no `pushState` was called; until the new document paints, the old lesson, the signal and the tape are on screen.
5. With the data answered 404, or with another build's stamp, or the fetch rejected: the page load starts at once (before 100 ms after the answer), and the signal never shows if the answer came under 100 ms.
6. Under reduced motion, the signal's `animation-name` is `none` and its dashes are present; in variant B the settle has `animation-name: none`.

**The marks**

7. An outline row pressed (column and sheet) has the going mark from the press until the swap, and the old lesson's row keeps `aria-current="page"` and its solid edge until the swap; after the swap no row has the going mark.
8. "Next lesson" and the Up next card give no going mark; the signal and tape behave as in 1 to 3.
9. While the sheet is open, the signal and the tape sit on the sheet's head, not on the bar.
10. The signal and the tape are `aria-hidden` and change no element's box: the bounding boxes of the bar, the scene, the column and the guide are equal with and without them.
11. At 375 the tape for "Load Balancers" does not overlap the Network / Sequence switch; at 1440 it does not overlap the scene's title line.

**Focus**

12. Column row (1440), keyboard: focus the UDP row, press Enter; after the swap `document.activeElement` is the UDP row link, with `aria-current="page"`.
13. Column row whose part changes (HTTPS to TCP in How the Internet Works): after the swap focus is on TCP's row, even though the part's element changed.
14. Sheet row (375): after the swap the sheet is closed and focus is on the bar's `h1` "UDP", with `tabindex="-1"`; after Tab moves on, the `h1` has no `tabindex`.
15. Up next card, Enter (1440 and 375): focus is on the visible `h1`; it matches `:focus-visible`. With a pointer click it does not.
16. "Next lesson" (1440 and 375): focus is on the forward button, the same node as before, now named "Next: Connectionless Send, step 1".
17. Back and Forward: focus is on the visible `h1`.
18. During a wait, focus does not move, and Space, ← and → still act on the old lesson.

**What is heard**

19. After a swap from TCP to UDP the live region's text is exactly "UDP. Lesson 4 of 14. Overview."; after Back, "TCP. Lesson 3 of 14. Overview."
20. The live region is the console's existing `[data-announce]`; there is exactly one `aria-live` element in the console.

**The sheet and the row**

21. A sheet row tapped leaves the sheet open until the swap and closes it in the swap's frame; on the fall-back it stays open until unload.
22. After a swap the "here" look and `aria-current="page"` are on the new lesson's row only; the old row's status is progress's.
23. The current lesson's own row, plain click: a page load (the console does not take the click).
24. A second row pressed during a wait: one fetch is left (the first aborted), the going mark is on the second row only, and the swap is to the second lesson.

**What carries over**

25. Set 1.5× and Sequence in TCP, change to UDP: UDP shows 1.5× (its speed button named "Speed 1.5×. Click for 2×") and Sequence pressed.
26. With the Log tab chosen at 375, change: UDP shows Explain.
27. With Email's part opened in the column, change TCP to UDP: Email is still open; with HTTPS's part, change HTTPS to TCP: "Loading a web page" is an open `details` and "Getting the data there" is the `section`.
28. Everything else in §7's "starts again" rows equals UDP loaded fresh: position 0, Overview, no picks, the deeper box and every definition closed, the log's fold closed, the table's mark clear, the guide scrolled to the top, idle.
29. "Next lesson" from IP to DNS (the next part): DNS's row is wholly inside the column's list box after the swap.

**Networking**

30. Ports to TCP/UDP (both `net-map`) swaps with the marks above; TCP/UDP to NAT swaps; Subnetting's "Next lesson" to Router (`subnet` to `net-map`) is a page load with no going mark and no signal.

## 16. Measurements

**Before (today, `revamp` at 4b02873, from the plan's measurement and the dev server):** a lesson change is a page load. At 1440 × 900 with no throttle it shows 36 frames that are neither lesson over 600 ms, the first an empty stage at 61 ms; on the phone at fast 4G 37 or 38 such frames, still at 724 to 768 ms. Focus after it is the new document's start (the `body`); the live region starts as the new page's "Overview" and says nothing about the change (a screen reader reads the new page's title as it does for any load). A Back from UDP to TCP on the dev server is a page load too and opens TCP at its Overview.

**After (the prototype, played in the browser at 1440 × 900 and 375 × 812, light and dark):**

| | 1440 | 375 |
|---|---|---|
| Data in 4 ms, "Next lesson" | swap at 11 ms; no mark painted; focus on "Next: Connectionless Send, step 1" | the same; the button reads "Next: step 1" |
| Data in 243 ms, Up next by Enter | signal at 102 ms, swap at 253 ms; focus on `h1` "UDP" with its ring; heard "UDP. Lesson 4 of 14. Overview." | the same, the bar's `h1` |
| Data in 1100 ms, outline row | going mark at 0, signal at 102, tape and "Opening UDP." at 402, swap at 1111; focus stays on the UDP row (column) | sheet row: the same marks on the sheet's head, the sheet closes at the swap, focus on the bar's `h1` |
| Back, Forward | swap at 254 ms; focus on `h1`; heard "TCP. Lesson 3 of 14. Overview." / "UDP. …" | the same |
| Never answered | fall-back at 2002 ms | the same |
| Fails | fall-back at 121 ms (the fetch's answer at 120) | the same |
| The drawing | the same `svg` node from the first open through every swap, Back and Forward | the same |
| Horizontal scroll | none | none (document 375 wide) |

The prototype's own timers run up to 50 ms late when its browser tab is in the background; the numbers above are from a tab in front.

## 17. Open questions for the owner

1. **Back returns to a lesson's Overview, not to where the reader left it.** Decision 5 starts the position again on every swap, and Back is a swap (decision 6). Today, a Back that the browser serves from its page cache can restore TCP exactly as it was (at its Practice, picks and all); a swap cannot. Keeping each history entry's position in `history.state` would give that back, and would be a change to decision 5 for Back and Forward only. The design is drawn without it; say if you want it.
2. **Variant A or B.** A is recommended (§6).

## 18. The prototype

`prototypes/d26-lesson-change.html` opens from the file system with no network. Its strip (folded on a phone) sets the variant, the width (1440 or 375; the page also lays out at a phone's own width), the theme, reduced motion (it starts from the system's setting), how long the data takes (4 ms, 243 ms, 1100 ms, never, fails), and where to start (TCP's Overview, or TCP's Practice at its end with the Up next card). "Browser Back" and "Browser Forward" use the real history, so the browser's own Back works too. The readout shows the address, the title, where focus is, the live region's text, and whether the drawing is the same `svg` node; the line under it lists each event with its time.

What it leaves out: only TCP and UDP open (other rows say so); the steps between the Overview and Practice are not drawn; the drawing is a simplified original of the network map, not `net-map`; the page load of the fall-back is acted out (60 ms of the old page, 600 ms of today's empty stage, then the lesson fresh). The sheet is a positioned panel, not a `<dialog>`, so it can be shown inside the 375 frame.
