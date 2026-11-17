# D19: the Lesson page's layout, rearranged in Patch

Unit D19 of job 19 (`plan.md`; direction 2.90 to 2.93). Drawn on Fable 5.2 by the owner's word (2.93), 2026-11-17, from `revamp` at `e2fe20f`.

- **Prototype:** `prototypes/d19-lesson-layout.html`. One file, no network. It holds both layouts, both themes, every place of the DHCP lesson (Networking, lesson 9 of 20) and the 20-lesson track list. The yellow button at the bottom left ("D19: layout, theme, states") switches layout, theme, place and the timeline's stress cases, and prints the measures this spec quotes. The same switches work in the address: `?layout=line|spine&theme=light|dark&place=0..7|learn|practice|end&titles=dhcp|osi|tcp&keys=show&panel=open`.
- **What is real in it.** The words, the figure at each step, the lease table, the log's rows, the stamp, the Sequence view (a still of step 4) and the site's own CSS for those parts are copied from the built page by a script; nothing was retyped. The layout, the timeline, the track column, the forward button's words and the key line are D19's.
- **What is not drawn:** the page with JavaScript off (§7 specifies it), a lesson with more than one unit (none exists; §4.9), a phone on its side under 600px tall (unchanged: the stacked page).

## 1. What the page must still say, and what it said badly

Everything the page tells a reader today stays (2.91): the scene with Network and Sequence, the explanation with Go deeper and numbered sources, the event log, the lesson's own table, Learn and Practice at D1's width, the stamp, the OSI badge, job 15's five controls, the theme button. No lesson word changes. Every place is one press away. The phone is one screen.

Measured on `revamp` on 2026-11-17, at 1440×900 unless a size is given:

| # | Today | Measure |
|---|---|---|
| 1 | The left column is this lesson's outline. The track is behind "All 20 lessons", in a dialog. | Two presses to another lesson; none of the track on screen. |
| 2 | The forward button reads "Next step" at every place. | It never says where it goes. |
| 3 | The keys are named only in `title` attributes. | Not visible (S21 fault 8). |
| 4 | The drawing is narrower than its column on 30 of the 34 lesson pages by the last Watch step; on 29 of them because the lesson's table grows under it (OSI Model is held by the figure's 440px cap). | TLS, ICMP, UDP: 456×251 in a 733px column. What is DHCP: 721×398 at step 3, 521×288 at step 4. Median over 34 pages: 629×347. |
| 5 | Room is left under a short step's words while the drawing is squeezed. | DHCP step 4: 149px empty of 548. |
| 6 | The Overview already scrolls. | 857px of words in 548. |
| 7 | On a phone the bar does not say which lesson of the track this is, and the track cannot be reached. | S21 fault 11. |

A correction to the brief: "685×326 on DHCP" is the 2026-11-10 measure (§7) and no longer holds. Today Networking's DHCP draws 733×349 in a 733×407 scene; What is DHCP draws 521×288 at step 4. This spec measures against today's page, not against 685×326.

## 2. The two layouts

Both carry the three ideas: a numbered timeline of every place in place of the outline, a forward button that names its place with a line naming the keys, and the track's lessons in the left column. Both keep the top bar to one line (52px, from 68px). They differ in where the timeline, the words' column, the lesson's table, the log and the controls go.

### Layout 1, Line (recommended)

```
┌ bar 52 ────────────────────────────────────────────────────────────────┐
├ track 232 ┬ scene 771 × 550 ───────────────────┬ guide 389 × 812 ──────┤
│ parts,    │ Network | Sequence          title  │ the words             │
│ lessons   │                                    │                       │
│           │        the drawing                 │ the lesson's table    │
│           │                                    │ 1×  ‹  Play all  ↻    │
├───────────┴────────────────────────────────────┤ [Next: Lease Renewal] │
│ the line: ▪Overview │1│2│3│[4]│5│ ▪Learn ▪Practice 44 │ Space ← →     │
│ event log, legend, rows            1015 × 250  │                       │
└────────────────────────────────────────────────┴───────────────────────┘
```

- **The timeline lies under the scene** as one row of numbered stops with their titles (the reference's place for it), and it is the head of the event log's panel: the lesson's steps over the messages they sent.
- **The right column is a guide, the full height of the page:** the words, then the lesson's table, then job 15's controls in their order with the forward button on a line of its own, then the key line.
- **The log runs under the track and the scene** (1015px), not under the words.
- **The track column is 232px** and holds the lessons only.

### Layout 2, Spine

```
┌ bar 52 ────────────────────────────────────────────────────────────────┐
├ track 268 ┬ scene 735 × 566 ───────────────────┬ words 389 × 566 ──────┤
│ parts     │ Network | Sequence          title  │ the words             │
│  9 DHCP   │        the drawing                 │                       │
│  │▪Overview                                    │                       │
│  │✓1 …    │ the lesson's table                 │ Space ← →             │
│  │[4] …   ├────────────────────────────────────┴───────────────────────┤
│  │ 5 …    │ event log, legend     1× ‹ Play all ↻ [Next: Lease Renewal]│
│  │▪Learn  │ rows                                         1136 × 234    │
└───────────┴────────────────────────────────────────────────────────────┘
```

- **The timeline stands in the track column**, under the lit lesson: track, lesson, place in one tree. Every stop shows its title; the current one shows its sub line.
- **The scene, its table, the words and the log are where they are today.** The controls stay in the log's head; the forward button names its place when the name fits. The key line is the foot of the words' panel, directly over the controls.

### What each buys, measured at 1440×900 (Networking's DHCP, step 4, unless named)

| | Today | 1 Line | 2 Spine |
|---|---|---|---|
| Top bar | 68px | 52px | 52px |
| Left column | 268px: this lesson's outline | 232×550: the track | 268×812: the track and the timeline |
| Scene's panel | 735×550 | 771×550 | 735×566 |
| Scene (the drawing's box) | 733×407 | 769×498 | 733×423 |
| Drawing, DHCP | 733×349 | 769×366 (+5%) | 733×349 (0) |
| Drawing, What is DHCP, step 4 | 521×288 | 769×424 (+48%) | 551×304 (+6%) |
| Drawing, all 34 pages at their last Watch step | median 629×347 | wider on 33, the same on 1 (OSI Model, 645×440); median +22%, most +69% (456×251 to 769×424) | wider on 29, the same on 5; median +5%, most +6% |
| Drawing's size from step to step | changes as the table fills (What is DHCP: 721 to 521 wide) | fixed | changes, as today |
| Words' column | 387px | 387px | 387px |
| Words' room | 548px | 525px beside DHCP's table (150px); 587px at the Overview; 675px when a lesson has no table | 525px |
| Empty under the step's words | 149px | 127px | 127px |
| The Overview's words (857px) | scroll in 548 | scroll in 587 | scroll in 525 |
| Log | 1136×234 under scene and words; 4.6 rows | 1015×250 under track and scene, the line in its head; 4.4 rows | 1136×234; 4.6 rows |
| Controls | log head, 34px, forward 152px | foot of the guide; forward 355×40 on its own line | log head; forward up to 300px |
| Forward button names its place | never | always, in full; the longest (41 characters) takes two lines, 355×53 | in full when it fits (§4.4); else "Next: step 4". At 1280 DHCP shows both forms |
| Key line | none | under the forward button | foot of the words' panel (39px of the words' column) |
| Presses to another lesson of the open part / of another part | 2 / 2 | 1 / 2 | 1 / 2 |
| Learn: words' column and room | 558×730 | 558×675 | 558×706 |

At 375×812:

| | Today | 1 Line | 2 Spine |
|---|---|---|---|
| Bar / scene / tabs / controls | 52 / 276 (drawing's box 375×235) / 48 / 64 | 52 / 276 (375×235) / strip 36 + tabs 44 / 64 | 52 / 276 (375×235) / 48 / 64 |
| Words' room, a Watch step | 372px | 340px (−32) | 372px |
| Words' room, Learn | 502px | 470px | 502px |
| Tabs | Explain, Steps, Log, Table | Explain, Log, Table | Explain, Steps, Log, Table |
| Presses to any place | 2 (Steps, then the row) | 1 (the strip) | 2 |
| Which lesson of the track, and the way to the others | not shown | "9 of 20" button in the bar | "9 of 20" button in the bar |
| Forward button, 127×48 | "Next step" | "Next: step 5" | "Next: step 5" |
| Page scroll | none | none | none |

**Recommendation: Line.** It is the only one of the two with a gain on the page's main fault: the drawing grows on 33 of 34 pages (median +22%) and stops changing size as the table fills, because the table leaves the scene's panel for the guide. It also gives the forward button a full line, so the place is always named. Its costs, stated: the log shows 0.2 fewer rows; Learn's room is 55px less than today (the controls' foot); on a phone the strip costs 32px of words; a table of four columns or more becomes entries in the guide (§4.6); in a window under 860px tall the table stays under the scene, so the drawing gains only its 5% of width there (§4.6).

**What Spine buys instead:** every stop's title is on screen at every count of places (Line shows numbers only from ten places, and on phones and tablets); the lesson's table keeps its full width; the phone loses no words; and the build moves far fewer measures (§10). Its gain for the drawing is the bar's 16px.

The phone halves are independent of the desktop halves: Line's desktop with Spine's phone (the Steps tab, no strip) is a valid pick (open question 2).

## 3. Tokens and type

No token is added or changed; `src/styles/tokens.ts` and `src/art/lumen.css` are untouched. Every colour below is a token already in use on the page.

| Part | Type |
|---|---|
| Track's title | Barlow Semi Condensed 700, 19px/1.15 |
| Part's name | Barlow Semi Condensed 600, 14px/1.2, sentence case as authored |
| Part's count ("2 of 3") | Atkinson Hyperlegible Mono 500, 11.5px |
| Lesson row | as "All N lessons" today: Atkinson Hyperlegible Next 500, 14px/1.3; status 12.5px |
| Stop's name, Line | Barlow Semi Condensed 600, 13px/1.12, two lines at most |
| Stop's name, Spine | Atkinson Hyperlegible Next 600 (700 when current), 14px/1.3; sub line 400, 13px/1.35 |
| Stop's mark | Atkinson Hyperlegible Mono 700, 11px, in a 22px square, 3px corners, 1.5px border |
| Forward button | unchanged: Barlow Semi Condensed 600, 16px (17px on a phone, 15px under 375px wide, 14px under 360px) |
| Key line | D14 §9: Atkinson Hyperlegible Next 400, 13px muted; keycaps mono 500 11.5px, 22px tall |
| Lesson's name in the bar | Atkinson Hyperlegible Next 700, 17px (16px on a phone) |

## 4. Components and their states

### 4.1 The top bar (both layouts)

One line, 52px. Left to right: the mark and "TechConcepts" (its cell is as wide as the track column, so the rule under it lines up); the lesson's name as the page's `h1`; "Lesson 9 of 20"; the stamp, pushed to the right; the OSI badge when the unit names a layer (label and chips on one line); the theme button.

- **Gone from the bar:** the crumbs "Tracks / Networking Concepts /" (they are the track column's head now), the step segments and "Step 4 of 5" (the timeline says both; the words' kicker still reads "Watch · Step 4 of 5").
- **Under 1100px wide** (no track column): a button, 40px tall on a phone and 44px on a tablet, with a list icon and "9 of 20", accessible name "All 20 lessons. This is lesson 9". It opens the lessons sheet (§4.8). "Lesson 9 of 20" and the brand's word are hidden there. On a phone the bar's second line keeps "Step 4 of 5" (or "Overview", "Learn", "Practice"), as today.

### 4.2 The track's lessons (`nav`, labelled by the track's title)

From the data "All N lessons" uses today (`Outline.tsx:124-155`: `entries`, `byPart`, `progress`, `currentKey`).

- **Head, fixed:** "Tracks /" (a link to `/tracks`, 12.5px muted); the track's title (a link to the track page); a cable of one segment a lesson (5px tall, 2px apart: green done, orange this lesson, dashed ahead) and "6 of 20 done".
- **Parts.** The part that holds this lesson is always open and its name is a heading, not a button. Every other part is a `<details>`, closed by default, with a chevron, its name and its count ("2 of 4"; "✓ 2 of 2" in green when all are done). A reader may open any; it is not remembered.
- **Lesson rows:** number, title, status ("✓ Done", "In progress", or "Not ready yet" on a row that is not a link), 30px tall. The lesson on this page has `aria-current="page"`, the orange inset bar and the orange tint, as in today's dialog.
- **The list scrolls inside the column** when it must; the head stays. On load the current lesson is in view.
- **Ruled, the 20-lesson column at 900 tall:** Line: the list has 447px and needs 447px with one part open; with every part open it needs 944px and scrolls. Spine: the list has 717px; with DHCP's timeline it needs 717px, with every part open 1,228px and scrolls; with OSI Model's 13 places it needs 841px and scrolls, the current stop kept in view.
- **States:** a lesson done, in progress, not started, not ready; a part complete; a part open or closed; hover (the tile ground); focus (the page's 2px ring).

### 4.3 The timeline

One `nav` labelled "This lesson", holding an `ol` of buttons, one a place, in order: Overview, each Watch step, Learn, Practice.

- **Names.** Overview is "Overview". A step is its number and its existing title. Learn is "Learn" and Practice is "Practice". In Spine the current stop also shows today's sub line: the unit's purpose for the Overview, the step's `sub`, "What happened and why" for Learn, the questions' title ("Three questions") for Practice.
- **Marks.** A 22px square. A step shows its number; Overview, Learn and Practice show a 6px square dot. Before the current place: a green tick on a green border. Current: orange fill, the number in `here-ink`. Ahead: muted on the strong line.
- **The cable.** Dashed in `line-strong` ahead; solid orange up to and including the current stop. Line: the top 4px of each stop. Spine: a 2px line through the marks.
- **Accessible name:** "Step 4, DHCP Acknowledge", with ", done" when passed; the current stop has `aria-current="step"`. The stop's `title` is its name.
- **Pressing a stop** goes to that place, as an outline row does today. Focus stays on the pressed stop.

**Line** (`.pg__line`, 44px, the first row of the log's panel):

- Steps share the width equally; Overview, Learn and Practice take only what their words need. A thin rule stands before step 1, before Learn and before Practice.
- A name takes two lines at most and breaks at a hyphen when a word is too long; a third line is cut with an ellipsis (TCP/UDP's two longest titles at 1440; the whole title is the stop's `title` and its accessible name).
- **Ten places or more** (OSI Model's 13), **or a line under 760px wide** (Learn and Practice at 1280): stops are their marks only, 38px each, and the current stop takes the room left and shows its name on one line. Measured at 1440 with 13 places: the current stop is 554px.
- Measured at 1440 with DHCP: the stops are 99, 148, 147, 147, 147, 147, 81 and 95px.

**Spine** (inside the track column, under the lit lesson, indented 14px):

- One row a stop, 34px; the current row is 52px with its sub line, in the orange outline and tint today's outline uses.
- A 5px gap stands before step 1, before Learn and before Practice.
- A long title wraps; it is never cut.

### 4.4 The forward button's words

The button is job 15's: one `<button>`, orange, focus stays on it. Its words:

| Going to | Full | Short |
|---|---|---|
| a Watch step | Next: DHCP Acknowledge | Next: step 4 |
| Learn | Next: Learn | Next: Learn |
| Practice | Next: Practice | Next: Practice |
| the next lesson (from Practice) | Next lesson: Ports | Next lesson |
| nothing (the track's last lesson, or none ready) | Next lesson, disabled, with today's reason in its `title` | the same |

- **Accessible name, always:** "Next: step 4, DHCP Acknowledge" (or the full form for the others). **`title`:** the same, with " (→)" inside a lesson.
- **Line, 1100px and up:** the full form, always. The button is as wide as the guide less 32px (355px at 1440, 314px at 1280) and 40px tall; its words may take a second line (the button is then 53px); they wrap between words and are never cut. Measured: the longest title on the site, "UDP: Packet Loss, No Retransmission" (35 characters, 41 with "Next: "), takes two lines at every width from 1100.
- **Spine, 1100px and up, and both layouts on a tablet on its side:** one line. The full form when all three hold: it fits a button of 300px at most (260px on a tablet); the row does not overflow; the log's legend takes no more lines than it does with the short form, or two, whichever is more (two lines cost the head nothing: 52px either way). Otherwise the short form. Tried again when the place, the window or the fonts change. Measured in Spine at 1440: DHCP's five steps are all full (182 to 243px); "UDP: Connectionless Send" is full (295px); "UDP: Packet Loss, No Retransmission" is short. At 1280: "DHCP Discover", "DHCP Offer", "DHCP Request" and "Lease Renewal" are full, "DHCP Acknowledge" is short, and TCP/UDP's five are all short. So in Spine one lesson can show both forms.
- **A phone (under 761px):** the short form, always, with no chevron: its room goes to the words. Measured: "Next: Practice" and "Next: step 10" fit 127px at 375, 112px at 360 and 96px at 320.
- **An upright tablet:** the full form when it fits the button (246px at 768), else the short.

### 4.5 The key line

`<kbd>Space</kbd> play all or pause <kbd>←</kbd> back <kbd>→</kbd> next` (D14 §9's line; "next step" is now "next"). Styled as D14 §9. It shows only at 1100px wide and up and with `(hover: hover) and (pointer: fine)`. Line: the last row of the guide's foot. Spine: the foot of the words' panel (39px with its rule); with a coarse pointer the foot is not drawn and the words keep the room. Plain text in reading order; no `aria-hidden`.

### 4.6 The guide and the lesson's table (Line)

The guide is one panel, a column: the words (scroll inside), the lesson's table, the foot.

- **The foot** is 135px: 12px, the row of speed, back, Play all and replay (34px), 8px, the forward button (40px), 8px, the key line (22px), 12px, and a rule above. The DOM order is job 15's: speed, back, play, replay, forward.
- **The table sits in the guide** while watching, in a window 860px tall or more. It is as tall as its content up to `clamp(120px, 28%, 232px)` of the guide, then scrolls inside itself with the marked row in view. It takes the forms the page already has under 640px: three columns or fewer stay a table; four or more become entries (DHCP's lease is one entry of four lines, 150px with its caption); Firewalls' rules are two lines a rule; the bits board is the fitted one (302px).
- **Under the scene instead,** as today: in Learn and Practice (D1: the scene and its table step aside together), in a window under 860px tall, and under 1100px wide. Measured at 1280×800: the words have 575px (today 476) and the drawing is 650×309 (today 614×292).
- OSI Model's message strip is not a table and stays under the scene at every size.
- **The scene's panel is exactly as tall as today's at every window size:** the log's panel is `clamp(216px, calc(26vh + 16px), 268px)`, today's log plus the 16px the bar gave up.

### 4.7 The log

- **Line:** the panel is the line (44px), then the log's head (32px: the "Event log" tape and the legend), then the rows. In Learn and Practice it folds to the line and the head with "Show log" (89px), as D1 folds it today.
- **Spine:** unchanged, 52px head with the controls; folded, 53px.
- The log's table, its columns and its rows are unchanged in both.

### 4.8 The lessons sheet (under 1100px wide)

A modal `<dialog>` from the bar's "9 of 20" button: full height, up to 448px wide, at the left edge. Its bar: "All 20 lessons" and a 44px "× Close". Under it, the same head and list as the track column, every part open, rows 44px tall. Escape, the Close button or a press on the backdrop closes it; focus returns to the button.

### 4.9 A lesson with more than one unit

None exists (30 of 30 have one). The timeline shows the current unit's places. `Outline`'s unit list and its filters keep today's markup and sit above the track's list in the left column, and above the timeline in the Steps tab. Not drawn.

## 5. The layouts by width

| Window | Line | Spine |
|---|---|---|
| **1100px and up** | Columns 232, 1fr, `clamp(348px, 27vw, 392px)`; rows 52, 1fr, the log's panel; 12px gaps and padding. The guide spans the two lower rows; the log's panel spans the track and the scene. | Columns 268, 1fr, the same clamp; the track spans the two lower rows; the log spans the scene and the words; log `clamp(200px, 26vh, 252px)`, as today. |
| Learn and Practice there | Guide `max(348px, min(560px, 100vw - 764px))`: 560px from 1324 wide, 516px at 1280; the scene keeps 484px. | Words `max(348px, min(560px, 100vw - 800px))`: today's numbers (560 at 1440, 480 at 1280). |
| **900 to 1099px, on its side, 600px tall or more** | No track column. Scene and words (348px) side by side; under both, one row 60px tall holds the line (marks only, 56px a stop at most) and the five controls at 44px; then the log. No tabs. The table is under the scene. At 1024×768: scene's panel 640×452 (as today), drawing 638×304, words 346×450 (today 404), 2.8 log rows (today 3.3). | Today's layout: Explain and Steps tabs over the words; the Steps tab holds the timeline. At 1024×768: drawing 638×304, words 346×418, 3.3 rows. |
| **Upright, or under 900px wide, 600px tall or more** | The phone layout, grown (D3's five tunings stay): scene 40dvh, one centred 520px column, a 40px strip, 48px tabs. At 768×1024 the words have 410px. | The same with the Steps tab and no strip: 450px, as today. |
| **Up to 760px** | Bar 52; scene 34dvh (18dvh in Learn and Practice); the strip 36px (marks 24px; a stop is 44×35 with 8 places and 27×35 with 13); tabs 44px: Explain, Log, Table; the tab's part; controls 64px. | Bar 52; scene 34dvh; tabs 48px: Explain, Steps, Log, Table; controls 64px. As today. |
| Controls on a phone | Job 15's row and sizes: 48px buttons at x 12, 68, 124, 180 and the forward button from 236 (127px at 375). Under 360px: 44px buttons. | The same. |
| **Under 600px tall and under 1100px wide** | The stacked page, as today. | The same. |

On a phone, choosing a stop in Spine's Steps tab returns to Explain and moves focus to the words' panel, as today. Line's strip keeps the tab the reader is on.

## 6. Reading order, keyboard and what is said

**DOM order, which is the Tab order:**

1. The skip link; the bar (home, the stamp, the lessons button under 1100px, the theme button).
2. The track's lessons (1100px and up). In Spine the timeline's stops follow the lit lesson's link.
3. The scene: Network, Sequence.
4. Line only: the timeline's stops.
5. The tabs, where they show.
6. The words: Go deeper, sources, Practice's options.
7. The lesson's table (focusable when it scrolls, as today).
8. Line: the controls in job 15's order. Spine: the log's fold button where it shows, then the controls.
9. The log's rows region.

Today the controls come after the outline and every link in the words (S21 fault 10). Line keeps them after the words and before the log; Spine leaves them where they are.

- **Keys:** unchanged (`useLessonShortcuts.ts`): → forward, ← back, Space plays all or pauses, with today's ignore rules. No key is added.
- **Focus:** the forward button keeps focus when its words change, in both forms. A pressed stop keeps focus. The lessons sheet returns focus to its button.
- **Live region:** unchanged. A change of the forward button's words is not announced on its own; the place's announcement covers it.
- **Targets:** every new target is at least 24×24. The lessons button, the sheet's rows and its Close are 40 to 44px tall.

## 7. Without JavaScript

The page keeps today's rules (`no-script.test.ts`): the note "This lesson needs JavaScript to play.", the Overview's words and the figure, and no control that cannot work.

- **The track's lessons stay and work:** they are links. The current part is open; the others are `<details>` and open without script. At 1100px and up they are the left column; under that they are a plain list at the foot of the stacked page (the sheet's button is hidden with the other controls).
- **The timeline is a list to read, not to press:** a `<noscript>` ordered list of the places' names in the timeline's home (Line: the row over the log; Spine: under the lit lesson; the stacked page: after the Overview's words), with the heading "In this lesson". The interactive list is hidden by the head's no-script style, beside the selectors it hides today.
- The key line, the forward button and the tabs are hidden, as the controls are today.

## 8. Every word: new, changed, moved, removed

| Words | Where | Status |
|---|---|---|
| Next: <step's title> / Next: step <n> / Next: Learn / Next: Practice | forward button | new; replaces "Next step" |
| Next lesson: <lesson's title> | forward button at Practice, 761px and up | new; "Next lesson" stays on a phone and when disabled |
| Next: step <n>, <title> | forward button's accessible name and `title` | new |
| Space play all or pause ← back → next | key line | D14 §9's line, "next step" shortened to "next" |
| <n> of <N> done | track column's head and the sheet | new |
| <n> of <N> (a part's count; "✓" before it when complete) | each part | new |
| <n> of <N> | the bar's lessons button under 1100px | new |
| All <N> lessons. This is lesson <n> | that button's accessible name | new |
| Step <n>, <title>; ", done" | a stop's accessible name | new |
| In this lesson | the no-script list's heading | new |
| This lesson | the timeline's `nav` label | kept (it was the outline's heading) |
| Tracks / | track column's head | moved from the bar |
| All <N> lessons, × Close | the sheet's bar | kept from the dialog |
| ✓ Done, In progress, Not ready yet | lesson rows | kept (`STATUS_WORDS`) |
| Overview, Learn, Practice | stops | kept |
| Watch · 5 steps, the group labels "Learn" and "Practice", "Just for you, nothing is scored" | the outline | removed with the outline; Practice's page still says "Just for you. Nothing is scored or saved." |
| ▸ All 20 lessons | the outline's foot | removed at 1100px and up; under that, the bar's button |
| Step 4 of 5 | the bar | removed at 761px and up; kept on a phone and in the words' kicker |

No time figure, no score, no lesson word.

## 9. Measures at the other sizes (the prototype, DHCP step 4)

| Window | | Scene's panel | Drawing | Words: width, room | Log rows |
|---|---|---|---|---|---|
| 1920×1080 | Line | 1248×712 | 924×440 | 390, 705 | 4.9 |
| | Spine | 1212×728 | 924×440 | 390, 687 | 5.2 |
| 1366×768 | Line | 717×452 | 649×309 | 367, 543 | 3.3 |
| | Spine | 681×468 | 679×323 | 367, 427 | 3.6 |
| 1280×800 | Line | 652×476 | 650×309 | 346, 575 | 3.6 |
| | Spine | 616×492 | 614×292 | 346, 451 | 3.8 |
| 1100×700 | Line | 472×384 | 470×224 | 346, 475 | 3.3 |
| | Spine | 436×400 | 434×207 | 346, 359 | 3.0 |

No page scroll at any size tried: 1920×1080, 1440×900, 1366×768, 1280×800, 1100×700 and 1100×800, 1024×768, 768×1024, 375×812, 360×640, 320×568, both layouts, both themes, every place.

## 10. For the builder

**Files that change (both layouts):**

- `src/lesson/console.css`: the grid (columns, rows, areas), the 52px bar, the phone and tablet blocks' offsets, the no-script and stacked rules for the new parts. Take the prototype's second `<style>` block as the reference for every number; its `data-mode` attribute stands for the page's own media queries (`console.css:1384` for the phone, `:1950` for the tablet on its side).
- `src/lesson/Outline.tsx` becomes two parts: the track's lessons (from `AllLessons` and `LessonLink`, which already hold the data and the row) and the timeline (from `Item`). The dialog stays as the sheet under 1100px. `Outline.test.tsx` follows.
- `src/lesson/TopBar.tsx`: one line; the crumbs, the segments and `topbar__where` leave at 761px and up; the lessons button arrives. `holding` and the segment fill go with the segments. `TopBar.test.ts` follows.
- `src/lesson/PlaybackControls.tsx` and `src/engine/playback.ts` (`forwardButton`): the words of §4.4, the full and short forms, the accessible name. `playback.test.ts` follows.
- `src/lesson/LessonConsole.tsx`: where the parts mount; `TABS` (Line: no Steps tab; Spine: unchanged); the measured fit of the forward button's words (a `ResizeObserver`, tried again after `document.fonts.ready`).
- `src/lesson/Explanation.tsx`: no change to words. `src/lesson/LogPanel.tsx`: Line only, the controls leave its head and the line mounts above it.
- `src/pages/[track]/[lesson].astro` and the head's no-script style: the `<noscript>` list and the new selectors.

**Line only:** the lesson's table is one instance whose home follows §4.6 (the guide, or under the scene). `useFocusAcrossRemounts` already keeps a table's focus across a remount. The guide's entry form reuses the rules at `console.css` for `.tpanel__table:has(thead th:nth-child(4))`, and `rules.css` and `bits.css` under 640px, keyed on the guide as well as on the width.

**Units.** As planned: B22 the shared parts and 1100px and up; B23 the phone and 761 to 1099px.

**End-to-end measures the layout changes:**

| Spec | Line | Spine |
|---|---|---|
| `lesson.spec.ts` | the outline walk becomes a walk of the timeline's stops; the phone walk uses the strip, not the Steps tab | the walk's selector changes; the Steps tab stays |
| `controls.spec.ts` | the row at 1440 is in the guide: four buttons on one line, the forward button under them; its words and `title`; the phone's x positions stay (12, 68, 124, 180, 236) | the forward button's words and `title` only |
| `reading.spec.ts` | words 516px at 1280 (was 480); the folded log is 89px (was 52); Learn's room 675px at 1440 | the folded log is 53px; Learn's room 706px |
| `tablet.spec.ts` | 1024×768: no tabs, words 346×450, the line's row; 768×1024: the strip, three tabs, words 410px | 1024×768: words 418px; the Steps tab's content |
| Figure boxes at 1440: `load-balancers` (733×347), `ip-address` (396px), `tcp-udp` (346px), `ports` (316px), `mac-address` (316px) | each becomes 769px wide and about 498px tall (the table has left); the specs' panel checks move to the guide | each grows by 16px in height |
| `subnetting.spec.ts`, `ip-address.spec.ts` at 1440 | the board is the fitted one in the guide; "the line is where it always was" needs a new measure | unchanged |
| `router.spec.ts`, `arp.spec.ts`, `nat.spec.ts`, `vpn.spec.ts`, `proxies.spec.ts` | the 1440 panel checks move to the guide; `proxies` reaches steps from the timeline | `proxies` reaches steps from the timeline |
| `site.spec.ts` @phone | the tab count | none |
| Unit tests | `LessonConsole*.test.tsx` (tabs, where the controls and the table mount), `Outline`, `TopBar`, `playback`, `no-script` | `Outline`, `TopBar`, `playback`, `no-script` |

## 11. Acceptance checks

Each can be tried on the prototype; "L" is Line, "S" is Spine.

**Both**

1. At 1440×900 and 375×812, light and dark, at every place, the page does not scroll.
2. The bar is 52px tall at 1100px and up; it holds no crumb, no segments and no "Step n of N".
3. The track's list shows every part of the track and, in the open part, this lesson with `aria-current="page"`, the orange bar and its status. A done lesson reads "✓ Done"; one in progress reads "In progress".
4. With one part open the 20-lesson list does not scroll at 1440×900 (L: 447px; S: 717px with DHCP's timeline). With every part open it scrolls inside the column and the head stays.
5. The part that holds this lesson cannot be closed. Every other part opens and closes with a press, and with Enter or Space.
6. The timeline has one stop for every place, in order: 8 for DHCP, 13 for OSI Model. Exactly one has `aria-current="step"`. Stops before it show a tick; the cable is orange up to it.
7. Pressing any stop goes to that place in one press; focus stays on the stop (S on a phone: focus goes to the words' panel).
8. A stop's accessible name is "Step 4, DHCP Acknowledge", with ", done" when passed.
9. The forward button's accessible name names the place at every place ("Next: step 4, DHCP Acknowledge"; "Next lesson: Ports" at Practice).
10. The forward button's words are never cut: at every place of every lesson, at 1440, 1280, 1100, 1024, 768, 375, 360 and 320 wide, the label's `scrollWidth` is at most its `clientWidth`, and the button is inside the window.
11. Focus stays on the forward button through a walk from the Overview to Practice.
12. →, ← and Space do what they do today.
13. The key line reads "Space play all or pause ← back → next" and shows only at 1100px and up with a fine pointer.
14. Under 1100px the bar's button reads "9 of 20", opens the sheet with every part open, and Escape, Close and the backdrop close it with focus back on the button.
15. On a phone the controls' x positions and sizes are today's (48px at 12, 68, 124, 180; the forward button 127×48 at 375).
16. At 375 the forward button reads "Next: step 5", "Next: Learn", "Next: Practice" and "Next lesson", with no chevron.
17. In Learn and Practice the words' column is 558 to 560px at 1440 and the log is folded until "Show log".
18. Without JavaScript the track's links work, the places are a plain list under "In this lesson", and no button shows.
19. No lesson word differs from `src/content/`.

**Line**

20. At 1440×900 the scene's panel is 771×550 and the drawing is 769×366 on Networking's DHCP at every step.
21. At 1440×900 the drawing is at least as wide as today's on every lesson page at its last Watch step: 769px wide on every page but OSI Model (645×440, as today).
22. The scene's panel is as tall as today's at 1440×900 (550px), 1280×800 (476px), 1366×768 (452px) and 1024×768 (452px).
23. The line is 44px tall. With DHCP at 1440 every stop shows its whole name. With 13 places only the current stop shows a name. With TCP/UDP no name is cut inside a word.
24. The forward button is on a line of its own, 355×40 at 1440, and shows the full form at every place; "Next: UDP: Packet Loss, No Retransmission" takes two lines and is whole.
25. In a window 860px tall or more, while watching, the lesson's table is in the guide between the words and the controls, and scrolls inside itself past its cap. In Learn and Practice, under 860px tall and under 1100px wide it is under the scene.
26. At 1440×900 the words' room at DHCP step 4 is at least 520px and the words do not scroll.
27. The log's panel spans the track and the scene (1015px at 1440) and shows at least 4 rows at 900 tall.
28. At 375×812 the strip is 36px, the tabs are Explain, Log and Table at 44px, and the words have 340px. Every stop is at least 24px wide and 35px tall with 13 places.
29. At 1024×768 there are no tabs; the line and the five controls share one 60px row; the words have 450px.

**Spine**

30. At 1440×900 the scene's panel is 735×566, the log is 1136×234 and shows 4.6 rows, and the controls are in its head.
31. The timeline is under the lit lesson; every stop shows its title, and the current one its sub line. A 35-character title wraps and is whole.
32. With 13 places the track's list scrolls and the current stop is in view after every move.
33. At 1440, DHCP's five steps show the full form on the forward button; "UDP: Packet Loss, No Retransmission" shows "Next: step 5"; at 1280 "DHCP Acknowledge" shows "Next: step 4"; the log's head is never taller with the full form than with the short one.
34. The key line is the foot of the words' panel (39px); with a coarse pointer the foot is not drawn.
35. At 375×812 the tabs are Explain, Steps, Log and Table at 48px, the Steps tab holds the timeline, and the words have 372px.
36. At 1024×768 the tabs are Explain and Steps, and the words have 418px.

## 12. Decisions, one line each

1. The bar goes to one line: the track column and the timeline now say what its crumbs and segments said, and 16px goes to the scene.
2. Stops are numbered squares on a cable: Patch's markers are squares and its progress is a cable (§6); the reference's circles are not copied.
3. Overview, Learn and Practice are stops with a dot, not numbers: only the Watch steps are numbered today, and "Step 4 of 5" must stay true.
4. Parts fold, except the one this lesson is in: 20 lessons and 6 parts do not fit 550px, and a `<details>` works without script.
5. Line's log runs under the track, not under the words: it needs about 1000px for its seven columns, and the guide needs the full height.
6. Line's table goes to the guide only in a window 860px tall or more: under that, the words of a short step would scroll (measured at 1280×800: 425px of room for 452px of words).
7. Line's scene panel is pinned to today's height: the drawing never shrinks at any window size.
8. The forward button never truncates: it wraps in Line and falls back to the step's number elsewhere, because a cut title names nothing.
9. On a phone the forward button names the step by its number: 127px holds "Next: step 5", not a title; the chevron gives its room to the words.
10. No new key: R for replay was ruled out in D14 and stays out.
11. The key line is D14's, deferred then, placed now where each layout has a quiet line beside the controls.
12. The sheet is today's dialog with the track column's content: one component, two homes.
13. Spine keeps today's regions on purpose: it is the choice for the smallest change.

## 13. Open questions for the owner

1. **Line or Spine?** Line is recommended for the drawing (+22% median); Spine for the smallest change.
2. **With Line, the strip on a phone (32px of words for one-press places and three wider tabs), or Spine's phone (the Steps tab, no words lost)?** The prototype draws the strip.
3. **Line moves the lesson's table beside the words** in a tall window. A table of four columns or more becomes entries there, as on a phone. Is that acceptable, or should the table stay under the scene always (the drawing's gain then falls to +5%)?
4. **"Next lesson: Ports"** at Practice, or the shorter "Next: Ports"?
