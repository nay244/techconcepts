# D19: the Lesson page's layout, rearranged in Patch

Unit D19 of job 19 (`plan.md`; direction 2.90 to 2.94). Drawn on Fable 5.2 by the owner's word (2.93). **Revision 1, 2026-11-17, after the owner's gate (2.94).**

- **Prototype:** `prototypes/d19-lesson-layout.html`. One file, no network. Both themes, every place of the DHCP lesson (Networking, lesson 9 of 20) and the 20-lesson track list. The yellow button at the bottom left ("D19: theme, states") switches theme, place and the timeline's stress cases, and prints the measures this spec quotes. The same switches work in the address: `?theme=light|dark&place=0..7|learn|practice|end&titles=dhcp|osi|tcp&keys=show&panel=open`.
- **What is real in it.** The words, the figure at each step, the lease table, the log's rows, the stamp, the Sequence view (a still of step 4) and the site's own CSS for those parts are copied from the built page by a script; nothing was retyped. The layout, the timeline, the track column, the forward button's words and the key line are D19's.
- **What is not drawn:** the page with JavaScript off (§7), a lesson with more than one unit (none exists; §4.9), a phone on its side under 600px tall (unchanged: the stacked page).

## What revision 1 changed

The owner's answers at the gate (2.94): the timeline "in similar design and style as the reference on top of the scene next to \"Lesson 9 of 20\""; the phone's stops row as drawn; the lesson's table beside the words; "Next lesson: Ports" at Practice.

- **Spine is dropped.** The base is the first revision's Line: the track column, the scene, the full-height guide (words, the lesson's table, the controls on their own line, the key line), the log under the track and the scene.
- **The timeline left the log's head and stands in the top bar, over the scene.** The bar is 68px again (today's height) and has three cells, one over each column: the lesson's name with "Lesson 9 of 20" over the track; the timeline over the scene; the stamp, the OSI badge and the theme button over the guide.
- **The timeline is drawn in the reference's manner, in Patch:** numbered stops on one line joined by a rule, the place's name under each, the current stop filled, passed ones ticked, the count at the end.
- **The log gets its head back as a slim one** (32px): 5.2 rows at 900 tall, from 4.4 in the first revision and 4.6 today.
- **A tablet on its side** keeps the timeline in the bar and today's controls in the log's head; the first revision's shared row is gone.
- The phone is as it was drawn.

## 1. What the page must still say, and what it said badly

Everything the page tells a reader today stays (2.91): the scene with Network and Sequence, the explanation with Go deeper and numbered sources, the event log, the lesson's own table, Learn and Practice at D1's width, the stamp, the OSI badge, job 15's five controls, the theme button. No lesson word changes. Every place is one press away. The phone is one screen.

Measured on `revamp` on 2026-11-17, at 1440×900 unless a size is given:

| # | Today | Measure |
|---|---|---|
| 1 | The left column is this lesson's outline. The track is behind "All 20 lessons", in a dialog. | Two presses to another lesson; none of the track on screen. |
| 2 | The forward button reads "Next step" at every place. | It never says where it goes. |
| 3 | The keys are named only in `title` attributes. | Not visible (S21 fault 8). |
| 4 | The drawing is narrower than its column on 30 of the 34 lesson pages by the last Watch step; on 29 of them because the lesson's table grows under it. | TLS, ICMP, UDP: 456×251 in a 733px column. What is DHCP: 721×398 at step 3, 521×288 at step 4. Median over 34 pages: 629×347. |
| 5 | Room is left under a short step's words while the drawing is squeezed. | DHCP step 4: 149px empty of 548. |
| 6 | The Overview already scrolls. | 857px of words in 548. |
| 7 | On a phone the bar does not say which lesson of the track this is, and the track cannot be reached. | S21 fault 11. |

The brief's "685×326 on DHCP" is the 2026-11-10 measure (§7 of the direction doc) and no longer holds. Today Networking's DHCP draws 733×349 in a 733×407 scene. This spec measures against today's page.

## 2. The layout

```
┌ bar 68 ────────────────────────────────────────────────────────────────────┐
│ ◆ DHCP        │ ✓───✓───✓───✓───[4]┄┄┄5┄┄┄▪┄┄┄▪    Step 4 │ ✓ Checked …   ☾ │
│ Lesson 9 of 20│ Over DHCP DHCP DHCP DHCP Lease Learn Prac   of 5 │ OSI layer … 1-7 │
├ track 232 ────┼ scene 771 × 550 ───────────────────┬ guide 389 × 796 ──────┤
│ Tracks /      │ Network | Sequence          title  │ the words             │
│ Networking …  │                                    │                       │
│ parts,        │        the drawing                 │ the lesson's table    │
│ lessons       │                                    │ 1×  ‹  Play all  ↻    │
├───────────────┴────────────────────────────────────┤ [Next: Lease Renewal] │
│ event log, legend, rows               1015 × 234   │ Space ← →             │
└────────────────────────────────────────────────────┴───────────────────────┘
```

- **The bar's three cells stand over the three columns.** The lesson's name and "Lesson 9 of 20" sit over the track's list, so the place in the track reads straight down into the track. The timeline sits over the scene and is exactly as wide as it. The stamp and the badge sit over the guide.
- **The right column is a guide** under the bar to the foot of the page: the words, then the lesson's table, then job 15's controls in their order with the forward button on a line of its own, then the key line.
- **The log runs under the track and the scene** (1015px), not under the words.

**Why "Lesson 9 of 20" stays in the bar, and the timeline joins it there.** A band of its own above the scene costs its height and a 12px gap, about 72px. At 1440×900 the scene could give that up, but in a window under 860px tall the lesson's table is back under the scene (§4.6) and the drawing would shrink on every page whose drawing is held by its height, by about 15%. The bar is the one row that is already above the scene. At today's 68px it holds the timeline's two lines of names with no height taken from anything: the scene's panel is exactly as tall as today's at every window size, and the log is today's log. The price is the brand's word (decision 2).

### Measured at 1440×900 (Networking's DHCP, step 4, unless named)

| | Today | First revision (Line) | Revision 1 |
|---|---|---|---|
| Top bar | 68px | 52px | 68px, the timeline in it |
| Left column | 268px: this lesson's outline | 232×550: the track | 232×550: the track |
| Scene's panel | 735×550 | 771×550 | 771×550 |
| Scene (the drawing's box) | 733×407 | 769×498 | 769×498 |
| Drawing, DHCP | 733×349 | 769×366 (+5%) | 769×366 (+5%) |
| Drawing, What is DHCP, step 4 | 521×288 | 769×424 (+48%) | 769×424 (+48%) |
| Drawing, all 34 pages at their last Watch step | median 629×347 | wider on 33, the same on OSI Model (645×440); median +22%, most +69% | the same: median +22%, most +69% (456×251 to 769×424) |
| Drawing's size from step to step | changes as the table fills | fixed | fixed |
| Timeline | none (an outline, 268px) | under the scene, 1013×44, names beside the marks | over the scene, 782×66: 8 stops of 82px, names under the marks, "Step 4 of 5" at the end |
| Words' column | 387px | 387px | 387px |
| Words' room, step 4 (beside DHCP's 150px table) | 548px | 525px | 509px |
| Words' room, the Overview; a lesson with no table | 548px | 587px; 675px | 571px; 659px |
| Empty under the step's words | 149px | 127px | 111px |
| Log | 1136×234; 4.6 rows | 1015×250, the line in its head; 4.4 rows | 1015×234; 5.2 rows |
| Controls | log head, forward 152px | foot of the guide; forward 355×40 | the same |
| Forward button names its place | never | always, in full | always, in full; the longest (41 characters) takes two lines, 355×53 |
| Key line | none | under the forward button | the same |
| Learn: words' column and room | 558×730 | 558×675 | 558×659 |

### At the other sizes

| Window | | Scene's panel | Drawing, DHCP step 4 | Words: width, room | Log rows | Timeline |
|---|---|---|---|---|---|---|
| 1920×1080 | today | 1212×712 | 924×440 | 390, 710 | 5.2 | |
| | revision 1 | 1248×712 | 924×440 | 390, 689 | 5.8 | names, 141px a stop, the count |
| 1366×768 | today | 681×452 | 649×309 | 367, 450 | 3.6 | |
| | revision 1 | 717×452 | 649×309 | 367, 527 | 4.2 | names, 88px a stop, no count |
| 1280×800 | today | 616×476 | 614×292 | 346, 474 | 3.8 | |
| | revision 1 | 652×476 | 650×309 (+6%) | 346, 559 | 4.4 | names, 79px a stop, no count |
| 1024×768 | today | 640×452 | 638×300 | 348, 404 | 3.3 | |
| | revision 1 | 640×452 | 638×304 | 346, 450 | 3.3 | marks, the count and the place's name |
| 768×1024 | today | 768×410 | 768×366 | 520, 450 | | |
| | revision 1 | 768×410 | 768×366 | 520, 410 | | a row of marks, 40px |
| 375×812 | today | 375×276 | 375×179 | 375, 372 | | |
| | revision 1 | 375×276 | 375×179 | 375, 340 | | a row of marks, 36px |

Today's rows at 1920, 1366 and 1280 are worked from `console.css`'s rules; 1440, 1024, 768 and 375 are measured. At 1366×768 DHCP's figure is held by its height (309px) today and after, so it does not grow there. The drawing is never smaller than today's, because the scene's panel is never shorter or narrower.

**The costs, stated.** Learn's room is 71px less than today (the controls' foot); the words' room beside a table is 39px less at 1440×900, with 111px still empty under a short step; on a phone the stops row costs 32px of words; a table of four columns or more becomes entries in the guide (§4.6); in a window under 860px tall the table stays under the scene, so the drawing gains only its 5% of width there; the brand's word leaves the bar.

## 3. Tokens and type

No token is added or changed; `src/styles/tokens.ts` and `src/art/lumen.css` are untouched.

| Part | Type |
|---|---|
| Lesson's name in the bar | Atkinson Hyperlegible Next 700, 18px/1.15 (16px on a phone) |
| "Lesson 9 of 20" | Atkinson Hyperlegible Next 400, 13px muted |
| Stop's name | Barlow Semi Condensed 600, 12.5px/1.12, centred, two lines at most |
| Stop's mark | Atkinson Hyperlegible Mono 700, 11px, in a 22px square (24px on a phone), 3px corners, 1.5px border |
| The count ("Step 4 of 5") | Atkinson Hyperlegible Mono 500, 12.5px muted (today's `topbar__where`) |
| The current place's name beside the count (marks-only form) | Barlow Semi Condensed 600, 14px |
| OSI badge's label | Barlow Semi Condensed 600, 13.5px, sentence case ("OSI layer 7, Application"); chips 16×18px, 2px apart |
| Track's title | Barlow Semi Condensed 700, 19px/1.15 |
| Part's name | Barlow Semi Condensed 600, 14px/1.2, sentence case as authored |
| Part's count ("2 of 3") | Atkinson Hyperlegible Mono 500, 11.5px |
| Lesson row | as "All N lessons" today: 14px/1.3; status 12.5px |
| Forward button | unchanged: Barlow Semi Condensed 600, 16px (17px on a phone, 15px under 375px wide, 14px under 360px) |
| Key line | D14 §9: 13px muted; keycaps mono 500 11.5px, 22px tall |

## 4. Components and their states

### 4.1 The top bar

68px, one panel, three cells with a rule between them. At 1100px and up:

1. **Over the track** (the track's width and half the gap, 237px): the mark, a link home with the accessible name "TechConcepts home"; the lesson's name as the page's `h1`; under it "Lesson 9 of 20". The word "TechConcepts" is not shown on this page (it is already hidden under 1100px today).
2. **Over the scene:** the timeline (§4.3).
3. **Over the guide** (the guide's width and half the gap, 395px): the stamp; under it, when the unit names a layer, the OSI badge on one line (label, then the seven chips); at the right the theme button. With no badge the stamp is centred on the bar's height. Measured: the longest label, "OSI layer 6, Presentation", is 267px with its chips; the cell has 271px beside the theme button at its narrowest (1100 to 1288 wide).

Gone from the bar: the crumbs "Tracks / Networking Concepts /" (they are the track column's head now) and the row of segments (the timeline is the segments, made pressable and named).

**Under 1100px:** a button with a list icon and "9 of 20" (40px tall on a phone, 44px on a tablet), accessible name "All 20 lessons. This is lesson 9", opens the lessons sheet (§4.8); "Lesson 9 of 20" is hidden there. On a phone and an upright tablet the bar is 52px, as today: the mark, the name, "Step 4 of 5" under it (or "Overview", "Learn", "Practice"), the lessons button, the theme button; an upright tablet also shows the stamp.

### 4.2 The track's lessons (`nav`, labelled by the track's title)

From the data "All N lessons" uses today (`Outline.tsx:124-155`: `entries`, `byPart`, `progress`, `currentKey`).

- **Head, fixed:** "Tracks /" (a link to `/tracks`); the track's title (a link to the track page); a cable of one segment a lesson (5px tall: green done, orange this lesson, dashed ahead) and "6 of 20 done".
- **Parts.** The part that holds this lesson is always open and its name is a heading, not a button. Every other part is a `<details>`, closed by default, with a chevron, its name and its count ("2 of 4"; "✓ 2 of 2" in green when all are done). A reader may open any; it is not remembered.
- **Lesson rows:** number, title, status ("✓ Done", "In progress", or "Not ready yet" on a row that is not a link), 30px tall. The lesson on this page has `aria-current="page"`, the orange inset bar and tint, as in today's dialog.
- **The list scrolls inside the column** when it must; the head stays. On load the current lesson is in view.
- **Ruled, the 20-lesson column at 900 tall:** the list has 455px and needs 455px with one part open; with every part open it needs 944px and scrolls.
- **States:** a lesson done, in progress, not started, not ready; a part complete; a part open or closed; hover; focus.

### 4.3 The timeline

One `nav` labelled "This lesson", holding an `ol` of buttons, one a place, in order: Overview, each Watch step, Learn, Practice; then the count.

- **Names.** "Overview"; a step's existing title; "Learn"; "Practice".
- **Marks.** A 22px square on the rule. A step shows its number; Overview, Learn and Practice show a 6px square dot. Passed: a green tick on a green border. Current: orange fill, the number in `here-ink`. Ahead: muted on the strong line.
- **The rule** joins the marks at their middle, 2px: dashed in `line-strong` ahead, solid orange up to the current mark.
- **The count** stands at the end: "Step 4 of 5" on a Watch step, else the place's name ("Overview", "Learn", "Practice"). It is `placeLabel`'s text, as the bar shows today.
- **Accessible name of a stop:** "Step 4, DHCP Acknowledge", with ", done" when passed; the current stop has `aria-current="step"`; its `title` is its name.
- **Pressing a stop** goes to that place, as an outline row does today. Focus stays on the pressed stop. The whole slot is the target (82×66 at 1440).

**Three forms, chosen by the room each name has** (the line's own width, a container query; a name needs 80px):

| Form | When | What shows |
|---|---|---|
| Names and the count | 8 places or fewer, and a line of 740px or more (1440 wide and up) | every name under its mark; the count at the end |
| Names | 8 places in a line of 632 to 739px (1280 and 1366 wide); 9 places in a line of 712px or more (1440 wide and up) | every name; no count (the words' kicker still reads "Watch · Step 4 of 5") |
| Marks | 10 places or more at any width (OSI Model's 13); 9 places under 712px; any count under 632px (under 1280 wide, and Learn and Practice, where the scene is narrower) | marks 34px apart; at the end the count and, under it, the current step's name on one line |

- **A long name** takes two lines and breaks inside a word only when the word alone is wider than its slot; what is left over after two lines ends in an ellipsis. Measured at 1440 with TCP/UDP: "TCP: Three-Way Handshake", "TCP: Packet Loss" and "TCP: Retransmission" are whole; "UDP: Connectionless Send" and "UDP: Packet Loss, No Retransmission" end in an ellipsis. The whole title is the stop's `title`, its accessible name, the words' heading and, in the marks form, the line's end.
- **Thirteen places** (OSI Model), measured at 1440: 13 marks take 442px; the count and "Presentation Layer" have the 300px left. At 1024 the same fits beside a 378px stamp cell.
- Of the 34 lesson pages, 21 have 8 places, 12 have 9 and one has 13.

### 4.4 The forward button's words

The button is job 15's: one `<button>`, orange, focus stays on it.

| Going to | Full | Short |
|---|---|---|
| a Watch step | Next: DHCP Acknowledge | Next: step 4 |
| Learn | Next: Learn | Next: Learn |
| Practice | Next: Practice | Next: Practice |
| the next lesson (from Practice) | Next lesson: Ports | Next lesson |
| nothing (the track's last lesson, or none ready) | Next lesson, disabled, with today's reason in its `title` | the same |

- **Accessible name, always:** "Next: step 4, DHCP Acknowledge" (or the full form for the others). **`title`:** the same, with " (→)" inside a lesson.
- **1100px and up:** the full form, always. The button is as wide as the guide less 32px (355px at 1440, 314px at 1280) and 40px tall; its words may take a second line (53px); they wrap between words and are never cut. The longest title on the site, "UDP: Packet Loss, No Retransmission" (35 characters), takes two lines.
- **A tablet on its side** (the button is in the log's head): one line. The full form when it fits a button of 260px at most, the row does not overflow, and the log's legend takes no more lines than with the short form, or two, whichever is more. Otherwise the short form. Tried again when the place, the window or the fonts change. Measured at 1024: DHCP's five are full; three of TCP/UDP's five are short.
- **A phone (under 761px):** the short form, always, with no chevron: its room goes to the words. "Next: Practice" and "Next: step 10" fit 127px at 375, 112px at 360 and 96px at 320.
- **An upright tablet:** the full form when it fits the button (246px at 768), else the short.

### 4.5 The key line

`<kbd>Space</kbd> play all or pause <kbd>←</kbd> back <kbd>→</kbd> next` (D14 §9's line; "next step" is now "next"). Styled as D14 §9. It shows only at 1100px wide and up and with `(hover: hover) and (pointer: fine)`, as the last row of the guide's foot. Plain text in reading order; no `aria-hidden`.

### 4.6 The guide and the lesson's table

The guide is one panel, a column: the words (scroll inside), the lesson's table, the foot.

- **The foot** is 135px: 12px, the row of speed, back, Play all and replay (34px), 8px, the forward button (40px), 8px, the key line (22px), 12px, and a rule above. The DOM order is job 15's: speed, back, play, replay, forward.
- **The table sits in the guide** while watching, in a window 860px tall or more (the owner's choice, 2.94). It is as tall as its content up to `clamp(120px, 28%, 232px)` of the guide, then scrolls inside itself with the marked row in view. It takes the forms the page already has under 640px: three columns or fewer stay a table; four or more become entries (DHCP's lease is one entry of four lines, 150px with its caption); Firewalls' rules are two lines a rule; the bits board is the fitted one (302px).
- **Under the scene instead,** as today: in Learn and Practice (D1: the scene and its table step aside together), in a window under 860px tall, and under 1100px wide. Under 860px the words of a short step would otherwise scroll (at 1280×800 there would be 409px for 452px of words).
- OSI Model's message strip is not a table and stays under the scene at every size.

### 4.7 The log

The panel is today's log, `clamp(200px, 26vh, 252px)`, under the track and the scene. Its head is 32px: the "Event log" tape and the legend; the controls have left it. In Learn and Practice it folds to its head with "Show log" (45px with the button), as D1 folds it today. The table, its columns and its rows are unchanged. On a tablet on its side the head holds the controls, as today (61px).

### 4.8 The lessons sheet (under 1100px wide)

A modal `<dialog>` from the bar's "9 of 20" button: full height, up to 448px wide, at the left edge. Its bar: "All 20 lessons" and a 44px "× Close". Under it, the same head and list as the track column, every part open, rows 44px tall. Escape, the Close button or a press on the backdrop closes it; focus returns to the button.

### 4.9 A lesson with more than one unit

None exists (30 of 30 have one). The timeline shows the current unit's places. `Outline`'s unit list and its filters keep today's markup and sit above the track's list in the left column, and in the lessons sheet under 1100px. Not drawn.

## 5. The layouts by width

| Window | Layout |
|---|---|
| **1100px and up** | Columns 232, 1fr, `clamp(348px, 27vw, 392px)`; rows 68, 1fr, the log (`clamp(200px, 26vh, 252px)`); 12px gaps and padding. The guide spans the two lower rows; the log spans the track and the scene. |
| Learn and Practice there | Guide `max(348px, min(560px, 100vw - 764px))`: 560px from 1324 wide, 516px at 1280; the scene keeps 484px. The timeline is in its marks form (its cell is 537px at 1366). |
| **900 to 1099px, on its side, 600px tall or more** | No track column; the bar's "9 of 20" button. The bar is 68px: the mark and the name; the timeline in its marks form with the count and the place's name; the stamp; the two buttons. Scene and words (348px) side by side; no tabs (the Steps tab's job is the bar's); the table under the scene; the log across the foot with the five controls in its head at 44px, as today. At 1024×768: scene's panel 640×452, words 346×450 (today 404), 3.3 log rows. |
| **Upright, or under 900px wide, 600px tall or more** | The phone layout, grown (D3's tunings stay): bar 52; scene 40dvh; the stops row 40px; tabs 48px: Explain, Log, Table; one centred 520px column. At 768×1024 the words have 410px (today 450). |
| **Up to 760px** | Bar 52; scene 34dvh (18dvh in Learn and Practice); the stops row 36px (marks 24px; a stop is 44×35 with 8 places, 27×35 with 13 at 375 wide, 26×35 at 360); tabs 44px: Explain, Log, Table; the tab's part; controls 64px. |
| Controls on a phone | Job 15's row and sizes: 48px buttons at x 12, 68, 124, 180 and the forward button from 236 (127px at 375). Under 360px: 44px buttons. |
| **Under 600px tall and under 1100px wide** | The stacked page, as today. |

**The phone's stops row stays under the scene; it does not move up with the desktop's.** Three reasons. The owner chose it as drawn (2.94). The scene stays pinned straight under the bar, so the drawing does not move down 36px from where it is today. And the row sits against the tabs it works with and nearer the thumb than the top of the screen. On a phone the bar's cell for the timeline is that row: one element, placed by the width.

## 6. Reading order, keyboard and what is said

**DOM order, which is the Tab order:**

1. The skip link; the bar: home, then the timeline's stops (1100px and up, and a tablet on its side), the stamp, the lessons button under 1100px, the theme button.
2. The track's lessons (1100px and up).
3. The scene: Network, Sequence.
4. Under 900px or upright: the stops row, then the tabs. The timeline is mounted here, after the scene, at these widths, so the order follows the screen.
5. The words: Go deeper, sources, Practice's options.
6. The lesson's table (focusable when it scrolls, as today).
7. The controls in job 15's order (a tablet on its side: after the log's fold button, in the log's head).
8. The log's rows region.

Today the controls come after the outline and every link in the words (S21 fault 10); they still follow the words, and now come before the log.

- **Keys:** unchanged (`useLessonShortcuts.ts`): → forward, ← back, Space plays all or pauses, with today's ignore rules. No key is added.
- **Focus:** the forward button keeps focus when its words change. A pressed stop keeps focus. The lessons sheet returns focus to its button.
- **Live region:** unchanged.
- **Targets:** every new target is at least 24×24 at 360px wide and up. With 13 places at 320px wide a stop is 23×35.

## 7. Without JavaScript

The page keeps today's rules (`no-script.test.ts`): the note "This lesson needs JavaScript to play.", the Overview's words and the figure, and no control that cannot work.

- **The track's lessons stay and work:** they are links. The current part is open; the others are `<details>` and open without script. At 1100px and up they are the left column; under that they are a plain list at the foot of the stacked page (the sheet's button is hidden with the other controls).
- **The timeline is a list to read, not to press:** a `<noscript>` ordered list of the places' names, with the heading "In this lesson". At 1100px and up it stands in the bar's middle cell, the names on one line, cut to what fits; in the stacked page it stands after the Overview's words, one place a line. The interactive list is hidden by the head's no-script style, beside the selectors it hides today.
- The key line, the forward button and the tabs are hidden, as the controls are today.

## 8. Every word: new, changed, moved, removed

| Words | Where | Status |
|---|---|---|
| Next: <step's title> / Next: step <n> / Next: Learn / Next: Practice | forward button | new; replaces "Next step" |
| Next lesson: <lesson's title> ("Next lesson: Ports") | forward button at Practice, 761px and up | new (the owner's choice, 2.94); "Next lesson" stays on a phone and when disabled |
| Next: step <n>, <title> | forward button's accessible name and `title` | new |
| Space play all or pause ← back → next | key line | D14 §9's line, "next step" shortened to "next" |
| <n> of <N> done | track column's head and the sheet | new |
| <n> of <N> (a part's count; "✓" before it when complete) | each part | new |
| <n> of <N> | the bar's lessons button under 1100px | new |
| All <N> lessons. This is lesson <n> | that button's accessible name | new |
| Step <n>, <title>; ", done" | a stop's accessible name | new |
| In this lesson | the no-script list's heading | new |
| This lesson | the timeline's `nav` label | kept (it was the outline's heading) |
| Step 4 of 5; Overview; Learn; Practice | the timeline's end | kept (`placeLabel`), moved within the bar |
| Lesson 9 of 20 | the bar, under the lesson's name | kept, moved one line down |
| OSI layer 7, Application | the bar, under the stamp | kept; set in sentence case |
| Tracks / | track column's head | moved from the bar |
| All <N> lessons, × Close | the sheet's bar | kept from the dialog |
| ✓ Done, In progress, Not ready yet | lesson rows | kept (`STATUS_WORDS`) |
| TechConcepts | the bar | not shown on this page; kept as the home link's accessible name |
| Watch · 5 steps, the group labels "Learn" and "Practice", the outline's sub lines, "Just for you, nothing is scored" | the outline | removed with the outline; Practice's page still says "Just for you. Nothing is scored or saved." |
| ▸ All 20 lessons | the outline's foot | removed at 1100px and up; under that, the bar's button |

No time figure, no score, no lesson word.

## 9. No page scroll

None at any size tried: 1920×1080, 1440×900, 1366×768, 1280×800, 1100×700, 1024×768, 768×1024, 375×812, 360×640 and 320×568, both themes, every place, with 8 and 13 places and with TCP/UDP's titles. The forward button's words were never cut and the button never left the window.

## 10. For the builder

**Files that change:**

- `src/lesson/console.css`: the grid (columns, rows, areas), the bar's three cells, the timeline, the guide and its foot, the phone and tablet blocks' offsets, the no-script and stacked rules for the new parts. Take the prototype's second `<style>` block as the reference for every number; its `data-mode` attribute stands for the page's own media queries (`console.css:1384` for the phone, `:1950` for the tablet on its side).
- `src/lesson/TopBar.tsx`: the three cells; the timeline in place of the segments (from `Outline`'s `Item`: the same targets, states and `onGo`); the crumbs leave; `topbar__where` becomes the line's end; the lessons button arrives. `holding` and the segment fill leave with the segments (open question 2). `TopBar.test.ts` follows.
- `src/lesson/Outline.tsx` becomes the track's lessons (from `AllLessons` and `LessonLink`, which already hold the data and the row). The dialog stays as the sheet under 1100px. `Outline.test.tsx` follows.
- `src/lesson/PlaybackControls.tsx` and `src/engine/playback.ts` (`forwardButton`): the words of §4.4, the full and short forms, the accessible name. `playback.test.ts` follows.
- `src/lesson/LessonConsole.tsx`: where the parts mount (the controls in the guide at 1100px and up, in the log's head on a tablet on its side, the bar at the foot on a phone; the timeline after the scene under 900px or upright); `TABS` loses Steps at every width, and `TABLET_SIDEWAYS` has no tabs left; the measured fit of the forward button's words on a tablet (a `ResizeObserver`, tried again after `document.fonts.ready`).
- `src/lesson/LogPanel.tsx`: the controls leave its head at 1100px and up.
- The lesson's table is one instance whose home follows §4.6 (the guide, or under the scene). `useFocusAcrossRemounts` already keeps a table's focus across a remount. The guide's entry form reuses the rules at `console.css` for `.tpanel__table:has(thead th:nth-child(4))`, and `rules.css` and `bits.css` under 640px, keyed on the guide as well as on the width.
- `src/pages/[track]/[lesson].astro` and the head's no-script style: the `<noscript>` list and the new selectors.
- `src/lesson/Explanation.tsx`: no change.

**Units.** As planned: B22 the shared parts and 1100px and up; B23 the phone and 761 to 1099px.

**End-to-end measures the layout changes:**

| Spec | What changes |
|---|---|
| `lesson.spec.ts` | the outline walk becomes a walk of the timeline's stops; on a phone it uses the stops row, not the Steps tab |
| `controls.spec.ts` | the row at 1440 is in the guide: four buttons on one line, the forward button under them; its words and `title`; the phone's x positions stay (12, 68, 124, 180, 236) |
| `reading.spec.ts` | words 516px at 1280 (was 480); the folded log is 45px (was 52); Learn's room 659px at 1440 (was 730) |
| `tablet.spec.ts` | 1024×768: no tabs, words 346×450, the timeline in the bar; 768×1024: the stops row, three tabs, words 410px; the bar's checks (the name whole, the stamp's place) |
| Figure boxes at 1440: `load-balancers` (733×347), `ip-address` (396px), `tcp-udp` (346px), `ports` (316px), `mac-address` (316px) | each scene becomes 769px wide and 498px tall (the table has left); the specs' panel checks move to the guide |
| `subnetting.spec.ts`, `ip-address.spec.ts` at 1440 | the board is the fitted one in the guide; "the line is where it always was" needs a new measure |
| `router.spec.ts`, `arp.spec.ts`, `nat.spec.ts`, `vpn.spec.ts`, `proxies.spec.ts` | the 1440 panel checks move to the guide; `proxies` reaches steps from the timeline |
| `site.spec.ts` @phone | the tab count (three, or two for OSI Model) |
| Unit tests | `LessonConsole*.test.tsx` (tabs, where the controls, the table and the timeline mount), `Outline`, `TopBar`, `playback`, `no-script` |

## 11. Acceptance checks

Each can be tried on the prototype.

**The page**

1. At 1440×900, 1280×800, 1024×768, 768×1024 and 375×812, light and dark, at every place, the page does not scroll.
2. At 1440×900 the scene's panel is 771×550 and the drawing is 769×366 on Networking's DHCP at every step.
3. The scene's panel is as tall as today's at 1440×900 (550px), 1280×800 (476px), 1366×768 (452px) and 1024×768 (452px).
4. At 1440×900 the drawing is at least as wide as today's on every lesson page at its last Watch step: 769px wide on every page but OSI Model (645×440, as today).
5. The log's panel spans the track and the scene (1015×234 at 1440×900), its head is 32px and holds no control, and it shows at least 5 rows.
6. No lesson word differs from `src/content/`.

**The bar and the timeline**

7. At 1100px and up the bar is 68px with three cells; the first is as wide as the track column and the last as wide as the guide, each within 6px.
8. The bar holds the lesson's name as the `h1`, "Lesson 9 of 20" under it, the stamp, the OSI badge when the unit names a layer, and the theme button; it holds no crumb and no segments. The home link's accessible name is "TechConcepts home".
9. The timeline has one stop for every place, in order: 8 for DHCP, 13 for OSI Model. Exactly one has `aria-current="step"`. Stops before it show a tick; the rule is orange up to it and dashed after.
10. At 1440 with DHCP every stop shows its name under its mark, no name is cut, and the line ends with "Step 4 of 5". At the Overview it ends with "Overview".
11. At 1280 with DHCP every stop shows its name and the count is not shown.
12. With 13 places, at every width, the stops are marks 34px apart and the line ends with the count and the current step's name, whole.
13. With TCP/UDP's titles at 1440 no name takes more than two lines, and the bar is 68px.
14. Pressing any stop goes to that place in one press; focus stays on the stop.
15. A stop's accessible name is "Step 4, DHCP Acknowledge", with ", done" when passed.

**The track**

16. The track's list shows every part of the track and, in the open part, this lesson with `aria-current="page"`, the orange bar and its status. A done lesson reads "✓ Done"; one in progress reads "In progress".
17. With one part open the 20-lesson list does not scroll at 1440×900. With every part open it scrolls inside the column and the head stays.
18. The part that holds this lesson cannot be closed. Every other part opens and closes with a press, and with Enter or Space.

**The guide**

19. In a window 860px tall or more, while watching, the lesson's table is in the guide between the words and the controls, and scrolls inside itself past its cap. In Learn and Practice, under 860px tall and under 1100px wide it is under the scene.
20. At 1440×900 the words' room at DHCP step 4 is at least 500px and the words do not scroll.
21. The forward button is on a line of its own, 355×40 at 1440, and shows the full form at every place; "Next: UDP: Packet Loss, No Retransmission" takes two lines and is whole. At Practice it reads "Next lesson: Ports".
22. The forward button's accessible name names the place at every place ("Next: step 4, DHCP Acknowledge").
23. The forward button's words are never cut: at every place of every lesson, at 1440, 1280, 1100, 1024, 768, 375, 360 and 320 wide, the label's `scrollWidth` is at most its `clientWidth`, and the button is inside the window.
24. Focus stays on the forward button through a walk from the Overview to Practice.
25. →, ← and Space do what they do today.
26. The key line reads "Space play all or pause ← back → next" and shows only at 1100px and up with a fine pointer.
27. In Learn and Practice the words' column is 558 to 560px at 1440 and the log is folded until "Show log".

**Under 1100px**

28. The bar's button reads "9 of 20", opens the sheet with every part open, and Escape, Close and the backdrop close it with focus back on the button.
29. At 1024×768 there are no tabs; the timeline is in the bar as marks with the count and the place's name; the five controls are in the log's head at 44px; the words have 450px.
30. At 375×812 the stops row is 36px, under the scene and over the tabs; the tabs are Explain, Log and Table at 44px; the words have 340px. Every stop is at least 24px wide and 35px tall with 13 places at 360px wide and up.
31. On a phone the controls' x positions and sizes are today's (48px at 12, 68, 124, 180; the forward button 127×48 at 375).
32. At 375 the forward button reads "Next: step 5", "Next: Learn", "Next: Practice" and "Next lesson", with no chevron.
33. Without JavaScript the track's links work, the places are a plain list under "In this lesson", and no button shows.

## 12. Decisions, one line each

1. The timeline goes into the bar, not into a band of its own: the bar is the only row over the scene that costs the drawing nothing, at any window height.
2. The brand's word leaves the Lesson page's bar: the first cell must be as narrow as the track column for the timeline to stand over the scene, and the mark stays as the way home.
3. "Lesson 9 of 20" stays in the bar, under the lesson's name and over the track's list: it is the lesson's place in the track, so it heads the track's column.
4. The stamp and the OSI badge stack in the cell over the guide: side by side they took 517px of the timeline's row.
5. Stops are numbered squares on a rule: the reference's manner (one line, names under, the count at the end) in Patch's shapes; its circles, colours and words are not copied.
6. Overview, Learn and Practice are stops with a dot, not numbers: only the Watch steps are numbered today, and "Step 4 of 5" must stay true.
7. The count gives up its room before any name does, and names give way to marks before any name is squeezed under 80px: a cut name names nothing.
8. In the marks form the line's end carries the current step's name: every place is still one press away, and the place the reader is in is still named.
9. The log keeps today's height and gets a slim head: the 20px the controls leave behind become rows (5.2 from 4.6).
10. Parts fold, except the one this lesson is in: 20 lessons and 6 parts do not fit 550px, and a `<details>` works without script.
11. The table goes to the guide only in a window 860px tall or more: under that, the words of a short step would scroll.
12. The forward button never truncates: it wraps at 1100px and up and falls back to the step's number on a tablet and a phone.
13. A tablet on its side keeps today's controls in the log's head: a 135px foot in a 452px guide would leave the words 315px.
14. The phone's stops row stays under the scene (§5).
15. No new key: R for replay was ruled out in D14 and stays out.
16. The sheet is today's dialog with the track column's content: one component, two homes.

## 13. Open questions for the owner

1. **The brand's word.** "TechConcepts" is not shown in the Lesson page's bar (the mark stays and links home), so that the timeline stands exactly over the scene. Keeping the word would take about 120px from the timeline: at 1440 the count would go, and at 1280 the names would give way to marks.
2. **Play all's fill.** Today a segment in the bar fills while a run holds on a step. The timeline has no fill; during "Play all" the current mark moves on at each step. Say if the fill should come back as the rule filling toward the next mark.
