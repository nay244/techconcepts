# D19: the Lesson page's layout, rearranged in Patch

Unit D19 of job 19 (`plan.md`; direction 2.90 to 2.97). Drawn on Fable 5.2 by the owner's word (2.93). **Approved revision 2 (2.96), amended 2.97, 2026-11-17.**

- **Prototype:** `prototypes/d19-lesson-layout.html`. One file, no network. Both themes, every place of the DHCP lesson (Networking, lesson 9 of 20) and the 20-lesson track list. The yellow button at the bottom left ("D19: theme, states") switches theme, place and the timeline's stress cases, and prints the measures this spec quotes. The same switches work in the address: `?theme=light|dark&place=0..7|learn|practice|end&titles=dhcp|osi|tcp&keys=show&panel=open`.
- **What is real in it.** The words, the figure at each step, the lease table, the log's rows, the Sequence view (a still of step 4) and the site's own CSS for those parts are copied from the built page by a script; nothing was retyped. The layout, the timeline, the track column, the forward button's words and the key line are D19's.
- **What is not drawn:** the page with JavaScript off (§7), a lesson with more than one unit (none exists; §4.9), a phone on its side under 600px tall (unchanged: the stacked page).

## Amendment 2.97: the stamp leaves the Lesson page

The owner, after approval: "On the lesson's page remove the section noting \"Checked \"date\", \"x\" sources\""; to where: "Everywhere on the lesson".

- **Removed:** the stamp ("Checked 12 Nov 2026, 16 sources", or "Not checked yet, 2 sources") from the lesson's bar, from the Overview's first line on a phone and an upright tablet, and from the foot of Learn ("Checked 12 Nov 2026" under the "Sources" heading).
- **Kept:** the numbered source marks in the words and after Practice's feedback, and the sources list at the foot of Learn under its "Sources" heading. `Stamp` stays on the track page and About.
- **The bar's third cell holds the OSI badge alone.** In the 68px bar it keeps its place and width over the guide, so the timeline stays exactly over the scene, 782px at 1440, the same on every lesson; where the unit names no layer (8 of the 30 lessons, DHCP among them) the cell is empty and its rule is not drawn. The timeline is not widened into it: its stops would then stand at different widths from one lesson of a track to the next, and no longer over the scene they step through.
- **In the one-line bar** (under 890px tall, and a tablet on its side) the cell was already only as wide as its content. It is now the badge alone, 310px, and is not drawn where there is no layer. The timeline's cell there grows: at 1280 wide 707px beside a badge (it was 633px beside the stamp and the chips) and 1,017px with none; at 1100 wide 527px beside a badge. So the badge keeps its label at every width from 1100px (revision 2 cut it to its chips under 1440px), and 13 marks keep their 34px at 1100px and up. On a tablet on its side the badge is its chips, as before; the timeline's cell is 670px beside them at 1024 wide.
- **Nothing else moves:** the drawing, the words' room, the log's rows and every other measure are revision 2's.

## What revision 2 changed

The owner at the second gate (2.95): "Let's also insert of website top navbar onto the Lesson page. Current how would a user go back to our page's tab from the lesson page"; the brand's word leaves the lesson's bar; Play all's fill comes back.

- **The site's own header stands on top of the Lesson page**, as `SiteHeader.astro` writes it: 68px and its 1px rule, the mark and "TechConcepts", Tracks, Glossary, How a lesson works, Sources, About, the theme button; under 960px its menu button. The page has no footer.
- **The lesson's bar under it lost what the header now carries:** the mark and the theme button. It keeps the lesson's name with "Lesson 9 of 20", the timeline, the count and the OSI badge (and, until 2.97, the stamp).
- **The header's 69px come out of the log, not the scene.** The scene's panel is exactly as tall as today's at every window size, so the drawing is never smaller than today's and keeps revision 1's gain. The log shows 3.1 rows at 1440×900 (today 4.6; revision 1 5.2).
- **The bar has two forms by the window's height.** 890px tall or more: 68px, the names under the marks, as revision 1 drew it. Under 890px, and on a tablet on its side: one line, 44px, the timeline as marks with the count and the current place's name beside them.
- **Play all's fill is back:** while a step holds, the rule fills from the current mark to the next.
- **A tablet on its side** has the five controls on one row at the foot of the words (revision 1 had them in the log's head).
- **A phone** carries the header (69px) over a one-line lesson bar (36px). The words have 287px at 375×812 (today 372; revision 1 340).

Kept from revision 1 (2.94): the Line layout (the track column, the scene, the full-height guide with the words, the lesson's table, the controls on their own line and the key line; the log under the track and the scene); the timeline over the scene beside "Lesson 9 of 20", in the reference's manner; the phone's stops row; "Next lesson: Ports".

## 1. What the page must still say, and what it said badly

Everything the page tells a reader today stays (2.91): the scene with Network and Sequence, the explanation with Go deeper and numbered sources, the event log, the lesson's own table, Learn and Practice at D1's width, the OSI badge, job 15's five controls, the theme button. No lesson word changes. Every place is one press away. The phone is one screen.

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
┌ the site's header 69 ──────────────────────────────────────────────────────┐
│ ◆ TechConcepts      [Tracks] Glossary  How a lesson works  Sources  About ☾ │
├ the lesson's bar 68 ───────────────────────────────────────────────────────┤
│ DHCP          │ ✓───✓───✓───✓───[4]┄┄┄5┄┄┄▪┄┄┄▪    Step 4 │                 │
│ Lesson 9 of 20│ Over DHCP DHCP DHCP DHCP Lease Learn Prac   of 5 │ OSI layer … 1-7 │
├ track 232 ────┼ scene 771 × 550 ───────────────────┬ guide 389 × 727 ──────┤
│ Tracks /      │ Network | Sequence          title  │ the words             │
│ Networking …  │                                    │                       │
│ parts,        │        the drawing                 │ the lesson's table    │
│ lessons       │                                    │ 1×  ‹  Play all  ↻    │
├───────────────┴────────────────────────────────────┤ [Next: Lease Renewal] │
│ event log, legend, rows               1015 × 165   │ Space ← →             │
└────────────────────────────────────────────────────┴───────────────────────┘
```

- **The header answers the owner's question:** from a lesson, Tracks, the Glossary, About and home are one press away.
- **The bar's three cells stand over the three columns.** The lesson's name and "Lesson 9 of 20" sit over the track's list. The timeline sits over the scene and is exactly as wide as it. The OSI badge sits over the guide.
- **The right column is a guide** under the bar to the foot of the page: the words, then the lesson's table, then job 15's controls in their order with the forward button on a line of its own, then the key line.
- **The log runs under the track and the scene** (1015px), not under the words.

**Where the header's height comes from.** The page is one screen, so 69px had to come from somewhere. Three places could give it:

| Taken from | At 1440×900 | Why not, or why |
|---|---|---|
| The scene's panel | OSI Model's drawing 645×440 to 586×400 (−9%); under 890px tall every drawing held by its height shrinks | The scene is the lesson (`plan.md`: a layout that shrinks the drawing is not a gain). Not taken. |
| The lesson's bar (dropped, or cut to one line) | The names under the marks go | The owner asked for the timeline in this form (2.94). Kept at 68px where the window is 890px tall or more; one line under that. |
| **The log** | 234px to 165px: 3.1 rows from 4.6 | **Taken.** The log scrolls to its newest row, a step sends one or two messages, and the whole DHCP lesson sends six. |

So the scene's panel is exactly as tall as today's at every window size, and the drawing is never smaller than today's.

**Does the header cost the drawing its gain? No.** At 1440×900 the drawing's gain is the same as revision 1's, to the pixel. What the header costs is log rows (below), 69px of the words' room, and on a phone 53px of words more than revision 1.

**The gain needs a window 890px tall or more.** Under that the lesson's table stays under the scene (§4.6), and the drawing is today's on 33 of 34 pages. That was true of revision 1 from 860px; the header moved the line by 30px.

### Measured at 1440×900 (Networking's DHCP, step 4, unless named)

| | Today | Revision 1 | Revision 2 |
|---|---|---|---|
| Site header | none | none | 69px |
| Lesson's bar | 68px | 68px, the timeline in it | 68px, the timeline in it |
| Left column | 268px: this lesson's outline | 232×550: the track | 232×550: the track |
| Scene's panel | 735×550 | 771×550 | 771×550 |
| Scene (the drawing's box) | 733×407 | 769×498 | 769×498 |
| Drawing, DHCP | 733×349 | 769×366 (+5%) | 769×366 (+5%) |
| Drawing, What is DHCP, step 4 | 521×288 | 769×424 (+48%) | 769×424 (+48%) |
| Drawing, all 34 pages at their last Watch step | median 629×347 | median 769×424 (+22%); wider on 33, the same on OSI Model | the same: median 769×424 (+22%), most +69%; wider on 33, the same on OSI Model (645×440) |
| Drawing's size from step to step | changes as the table fills | fixed | fixed |
| Timeline | none (an outline, 268px) | 782×66: 8 stops of 82px, names under the marks, the count | the same |
| Words' column | 387px | 387px | 387px |
| Words' room, step 4 (beside DHCP's 150px table) | 548px | 509px | 440px |
| Words' room, the Overview; a lesson with no table | 548px | 571px; 659px | 502px; 590px |
| Empty under the step's words (398px) | 149px | 111px | 42px |
| Log | 1136×234; 4.6 rows | 1015×234; 5.2 rows | 1015×165; 3.1 rows |
| Controls | log head, forward 152px | foot of the guide; forward 355×40 | the same |
| Forward button names its place | never | always, in full | always, in full |
| Learn: words' column and room | 558×730 | 558×659 | 558×590 |

### At 1280×800 and the other sizes

| Window | | Scene's panel | Drawing, DHCP step 4 | Drawing, 34 pages' median | Words: width, room | Log rows | Timeline |
|---|---|---|---|---|---|---|---|
| 1920×1080 | today | 1212×712 | 924×440 | | 390, 710 | 5.2 | |
| | revision 1 | 1248×712 | 924×440 | | 390, 689 | 5.8 | names, the count |
| | revision 2 | 1248×712 | 924×440 | | 390, 620 | 3.7 | names, the count |
| 1366×768 | today | 681×452 | 649×309 | 451×249 | 367, 450 | 3.6 | |
| | revision 1 | 717×452 | 649×309 | 451×249 | 367, 527 | 4.2 | names |
| | revision 2 | 717×452 | 649×309 | 451×249 | 367, 482 | 2.8 | marks, one line |
| 1280×800 | today | 616×476 | 614×292 | 495×273 | 346, 474 | 3.8 | |
| | revision 1 | 652×476 | 650×309 (+6%) | 495×273 | 346, 559 | 4.4 | names |
| | revision 2 | 652×476 | 650×309 (+6%) | 495×273 (the same on 33 pages; DHCP +6%) | 346, 514 | 3.1 | marks, one line |
| 1024×768 | today | 640×452 | 638×300 | | 348, 404 | 3.3 | |
| | revision 1 | 640×452 | 638×304 | | 346, 450 | 3.3 | marks |
| | revision 2 | 640×452 | 638×304 | | 346, 381 | 2.8 | marks, one line |
| 768×1024 | today | 768×410 | 768×366 | | 520, 450 | | |
| | revision 1 | 768×410 | 768×366 | | 520, 410 | | a row of marks, 40px |
| | revision 2 | 768×410 | 768×366 | | 520, 349 | | a row of marks, 40px |
| 375×812 | today | 375×276 | 375×179 | | 375, 372 | | |
| | revision 1 | 375×276 | 375×179 | | 375, 340 | | a row of marks, 36px |
| | revision 2 | 375×276 | 375×179 | | 375, 287 | | a row of marks, 36px |

Today's rows at 1920, 1366 and 1280, and the 34-page medians at 1366 and 1280, are worked from `console.css`'s rules and each page's measured table height; the rest is measured.

**The costs, stated.** The log shows 3.1 rows at 1440×900 and 1280×800, and 2.8 at 1366×768 and 1024×768 (today 4.6, 3.8, 3.6, 3.3). Learn's room is 140px less than today at 1440×900. Beside a table the words' room is 108px less than today, with 42px still empty under a short step. On a phone the words have 287px, 85px less than today: 32px for the stops row and 53px for the header. On a tablet on its side the words have 381px, 23px less than today. A table of four columns or more becomes entries in the guide (§4.6). Under 890px tall the bar is one line and the drawing gains only on pages held by their width.

## 3. Tokens and type

No token is added or changed; `src/styles/tokens.ts` and `src/art/lumen.css` are untouched.

| Part | Type |
|---|---|
| Lesson's name in the bar | Atkinson Hyperlegible Next 700, 18px/1.15 (16px on a phone) |
| The site's header | unchanged: `SiteHeader.astro`'s own styles |
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

### 4.0 The site's header

`SiteHeader.astro`, used as it is, with `current="tracks"`:

- **Tracks is the current section.** A lesson sits inside a track, as a track page does, so the Tracks link carries `aria-current="true"` (the component writes "page" only on `/tracks` itself) and the orange underline. With `current="tracks"` the component leaves out "Start learning", as it does on Tracks and on a track page: the reader has already started.
- **One theme button on the page:** the header's. The lesson's bar no longer has one.
- **One way home:** the header's mark and word. The lesson's bar no longer has a mark.
- It is 68px tall with a 1px rule (69px), at every width. It keeps its own 1304px wrap, so at 1440 wide its mark starts 100px from the edge while the lesson's panels start at 12px; that is the header as it is on every page.
- Under 960px it shows the theme button and the menu button; the menu's panel closes on Escape, on a link, or on a second press, as on every page. **One rule is added for this page only:** the open panel lies over the lesson (`position: absolute` under the header, on the page's ground) instead of pushing the page down, because the page is one screen and must not start to scroll.
- No footer: the page is one screen.

### 4.1 The lesson's bar

One panel under the header, three cells with a rule between them. At 1100px and up:

1. **Over the track** (the track's width and half the gap, 237px): the lesson's name as the page's `h1`; "Lesson 9 of 20".
2. **Over the scene:** the timeline (§4.3).
3. **Over the guide** (the guide's width and half the gap, 395px): the OSI badge (label, then the seven chips) when the unit names a layer; otherwise empty, with no rule before it.

**Two forms, by the window's height** (`@media (min-height: 890px)`):

| | 890px tall or more | Under 890px tall |
|---|---|---|
| Height | 68px | 44px |
| First cell | the name; under it "Lesson 9 of 20" | the name, then "Lesson 9 of 20", on one line |
| Timeline | names under the marks (§4.3's three forms) | marks, then the count and the current place's name, on one line |
| Last cell | the OSI badge, centred on the bar's height | the OSI badge with its label; the cell is as wide as the badge needs (310px), and is not drawn where the unit names no layer |

Measured: the longest badge label, "OSI layer 6, Presentation", is 267px with its chips; the cell has 324px at its narrowest in the 68px bar.

Gone from the bar since today: the mark and "TechConcepts" (the header's), the theme button (the header's), the crumbs "Tracks / Networking Concepts /" (the track column's head, and the header's Tracks), and the row of segments (the timeline is the segments, made pressable and named).

**Under 1100px:** a button with a list icon and "9 of 20" (28px tall on a phone, 34px on a tablet), accessible name "All 20 lessons. This is lesson 9", opens the lessons sheet (§4.8); "Lesson 9 of 20" is hidden there. On a tablet on its side the bar is the 44px form. On a phone it is one line, 36px: the name, "Step 4 of 5" (or "Overview", "Learn", "Practice") and the button. On an upright tablet it is the same at 44px.

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

**The fill.** During "Play all", while a step holds before the next, the rule fills in orange from the current mark to the next one over the hold (2.6s at 1×, as `HOLD_MS`), left to right: first the current stop's half, then the next stop's. It is today's segment fill (`topbar__fill`, `holding`), on the rule. Not with reduced motion, as today. In the prototype a hold is 1.4s.

**Three forms in the 68px bar, chosen by the room each name has** (the line's own width, a container query; a name needs 80px). In the 44px bar the form is always marks:

| Form | When | What shows |
|---|---|---|
| Names and the count | 8 places or fewer, and a line of 740px or more (1440 wide and up) | every name under its mark; the count at the end |
| Names | 8 places in a line of 632 to 739px; 9 places in a line of 712px or more (1440 wide and up) | every name; no count (the words' kicker still reads "Watch · Step 4 of 5") |
| Marks | 10 places or more at any width (OSI Model's 13); 9 places under 712px; any count under 632px (Learn and Practice, where the scene is narrower) | marks 34px apart; at the end the count and, under it, the current step's name on one line |

- **A long name** takes two lines and breaks inside a word only when the word alone is wider than its slot; what is left over after two lines ends in an ellipsis. Measured at 1440 with TCP/UDP: "TCP: Three-Way Handshake", "TCP: Packet Loss" and "TCP: Retransmission" are whole; "UDP: Connectionless Send" and "UDP: Packet Loss, No Retransmission" end in an ellipsis. The whole title is the stop's `title`, its accessible name, the words' heading and, in the marks form, the line's end.
- **Thirteen places** (OSI Model), measured at 1440×900: 13 marks take 442px; the count and "Presentation Layer" have the 300px left. In the 44px bar 13 marks keep their 34px at 1100px wide and up (442px of the 499px beside the badge at 1100) and on a tablet on its side; were a cell ever narrower, the marks may close up to 24px apart, and the place's name is cut with an ellipsis when it has no room.
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
- **A tablet on its side** (the five controls are one row at the foot of the words; the forward button has what the four 44px buttons leave, 114px at 1024): one line, no chevron. The full form when it fits the button, else the short. Tried again when the place, the window or the fonts change. Measured at 1024: every step shows the short form ("Next: step 4"); "Next: Learn" and "Next: Practice" fit; in Learn and Practice the guide is wider and "Next lesson: Ports" fits.
- **A phone (under 761px):** the short form, always, with no chevron: its room goes to the words. "Next: Practice" and "Next: step 10" fit 127px at 375, 112px at 360 and 96px at 320.
- **An upright tablet:** the full form when it fits the button (246px at 768), else the short.

### 4.5 The key line

`<kbd>Space</kbd> play all or pause <kbd>←</kbd> back <kbd>→</kbd> next` (D14 §9's line; "next step" is now "next"). Styled as D14 §9. It shows only at 1100px wide and up and with `(hover: hover) and (pointer: fine)`, as the last row of the guide's foot. Plain text in reading order; no `aria-hidden`.

### 4.6 The guide and the lesson's table

The guide is one panel, a column: the words (scroll inside), the lesson's table, the foot.

- **The foot** is 135px: 12px, the row of speed, back, Play all and replay (34px), 8px, the forward button (40px), 8px, the key line (22px), 12px, and a rule above. The DOM order is job 15's: speed, back, play, replay, forward.
- **The table sits in the guide** while watching, in a window 890px tall or more (the owner's choice, 2.94). It is as tall as its content up to `clamp(120px, 24%, 200px)` of the guide (174px at 900 tall), then scrolls inside itself with the marked row in view. It takes the forms the page already has under 640px: three columns or fewer stay a table; four or more become entries (DHCP's lease is one entry of four lines, 150px with its caption); Firewalls' rules are two lines a rule; the bits board is the fitted one (302px).
- **Under the scene instead,** as today: in Learn and Practice (D1: the scene and its table step aside together), in a window under 890px tall, and under 1100px wide. Under 890px the words of a short step would otherwise scroll (at 1280×800 there would be 364px for 452px of words).
- OSI Model's message strip is not a table and stays under the scene at every size.

### 4.7 The log

Under the track and the scene. Its height is today's less the header's share, so the scene's panel is today's:

- window 890px tall or more: `clamp(131px, calc(26vh - 69px), 183px)` (today's `clamp(200px, 26vh, 252px)` less 69px): 165px at 900 tall.
- under 890px tall, and a tablet on its side: `clamp(155px, calc(26vh - 45px), 207px)` (less 45px: the bar gave 24px): 163px at 800 tall, 155px at 768.

Its head is 32px: the "Event log" tape and the legend; the controls have left it at every width. In Learn and Practice it folds to its head with "Show log" (45px with the button), as D1 folds it today. The table, its columns and its rows are unchanged; it scrolls to the newest row, as today.

### 4.8 The lessons sheet (under 1100px wide)

A modal `<dialog>` from the bar's "9 of 20" button: full height, up to 448px wide, at the left edge. Its bar: "All 20 lessons" and a 44px "× Close". Under it, the same head and list as the track column, every part open, rows 44px tall. Escape, the Close button or a press on the backdrop closes it; focus returns to the button.

### 4.9 A lesson with more than one unit

None exists (30 of 30 have one). The timeline shows the current unit's places. `Outline`'s unit list and its filters keep today's markup and sit above the track's list in the left column, and in the lessons sheet under 1100px. Not drawn.

## 5. The layouts by width

The header is 69px at the top at every width. Everything below is the lesson, in the window's height less 69px.

| Window | Layout |
|---|---|
| **1100px and up** | Columns 232, 1fr, `clamp(348px, 27vw, 392px)`; rows: the bar (68px, or 44px under 890px tall), 1fr, the log (§4.7); 12px gaps and padding. The guide spans the two lower rows; the log spans the track and the scene. |
| Learn and Practice there | Guide `max(348px, min(560px, 100vw - 764px))`: 560px from 1324 wide, 516px at 1280; the scene keeps 484px. The timeline is in its marks form. |
| **900 to 1099px, on its side, 600px tall or more** | No track column; the bar's "9 of 20" button. The bar is the 44px form: the name; the marks, the count and the place's name; the OSI badge's chips; the button. Scene and words (348px) side by side; no tabs (the Steps tab's job is the bar's); the table under the scene. The five controls are one row of 44px buttons at the foot of the words (68px with its padding). The log across the foot, with its 32px head. At 1024×768: scene's panel 640×452 (as today), words 346×381 (today 404), 2.8 log rows (today 3.3). |
| **Upright, or under 900px wide, 600px tall or more** | The phone layout, grown (D3's tunings stay): header 69; bar 44; scene 40dvh; the stops row 40px; tabs 48px: Explain, Log, Table; one centred 520px column; controls 64px. At 768×1024 the words have 349px (today 450). |
| **Up to 760px** | Header 69; bar 36; scene 34dvh (18dvh in Learn and Practice); the stops row 36px (marks 24px; a stop is 44×35 with 8 places, 27×35 with 13 at 375 wide, 26×35 at 360); tabs 44px: Explain, Log, Table; the tab's part; controls 64px. At 375×812: 69 + 36 + 276 + 36 + 44 + 287 + 64. In Learn the words have 417px (today 502). |
| Controls on a phone | Job 15's row and sizes: 48px buttons at x 12, 68, 124, 180 and the forward button from 236 (127px at 375). Under 360px: 44px buttons. |
| **Under 600px tall and under 1100px wide** | The stacked page, as today, under the header. |

**The phone keeps one screen, and pays for the header in words.** The scene keeps 34dvh, so no drawing is smaller on a phone. The lesson's bar gave what it could: from 52px and two lines to 36px and one. The rest, 53px, comes from the words: 287px at 375×812, where a Watch step's words are 423px tall, so a reader scrolls the words a little more than today. On a short phone it is tighter: 173px at 360×640 (today 258).

**The phone's stops row stays under the scene; it does not move up with the desktop's.** The owner chose it as drawn (2.94). The scene stays straight under the bars. And the row sits against the tabs it works with and nearer the thumb than the top of the screen.

## 6. Reading order, keyboard and what is said

**DOM order, which is the Tab order:**

1. The skip link; the site's header: home, the five links (or, under 960px, the menu button after the theme button), the theme button. Then the lesson's bar: the timeline's stops (1100px and up, and a tablet on its side), the lessons button under 1100px.
2. The track's lessons (1100px and up).
3. The scene: Network, Sequence.
4. Under 900px or upright: the stops row, then the tabs. The timeline is mounted here, after the scene, at these widths, so the order follows the screen.
5. The words: Go deeper, sources, Practice's options.
6. The lesson's table (focusable when it scrolls, as today).
7. The controls in job 15's order.
8. The log's rows region.

Today the controls come after the outline and every link in the words (S21 fault 10); they still follow the words, and now come before the log.

- **Keys:** unchanged (`useLessonShortcuts.ts`): → forward, ← back, Space plays all or pauses, with today's ignore rules. No key is added. The header's links are links, so Space and the arrows on them keep their browser meaning, as the ignore rules already provide for links.
- **The skip link** ("Skip to content") lands on the lesson's `main`, past the header and the bar's stops.
- **Focus:** the forward button keeps focus when its words change. A pressed stop keeps focus. The lessons sheet returns focus to its button.
- **Live region:** unchanged.
- **Targets:** every new target is at least 24×24 at 360px wide and up. With 13 places at 320px wide a stop is 23×35.

## 7. Without JavaScript

The page keeps today's rules (`no-script.test.ts`): the note "This lesson needs JavaScript to play.", the Overview's words and the figure, and no control that cannot work. The header is as on every page without script: its links work, its theme button is hidden by `BaseLayout`'s `<noscript>` style, and under 960px its menu button does nothing (the track's links below are then the way to other lessons, and the mark the way home).

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
| OSI layer 7, Application | the bar's third cell | kept; set in sentence case |
| Checked <date>, <n> sources; Not checked yet, <n> sources | the bar; the Overview's first line on a phone | removed from the Lesson page (2.97) |
| Checked <date>; Not checked yet | the foot of Learn, under "Sources" | removed from the Lesson page (2.97); the "Sources" heading and the list stay |
| Tracks / | track column's head | moved from the bar |
| All <N> lessons, × Close | the sheet's bar | kept from the dialog |
| ✓ Done, In progress, Not ready yet | lesson rows | kept (`STATUS_WORDS`) |
| TechConcepts; Tracks, Glossary, How a lesson works, Sources, About; Menu; Switch theme | the site's header | the header's own words, new to this page |
| Start learning | the site's header | not shown here (`current="tracks"`), as on Tracks and a track page |
| Watch · 5 steps, the group labels "Learn" and "Practice", the outline's sub lines, "Just for you, nothing is scored" | the outline | removed with the outline; Practice's page still says "Just for you. Nothing is scored or saved." |
| ▸ All 20 lessons | the outline's foot | removed at 1100px and up; under that, the bar's button |

No time figure, no score, no lesson word.

## 9. No page scroll

None at any size tried, with the header on: 1920×1080, 1440×900, 1440×889, 1366×768, 1280×800, 1100×700, 1024×768, 768×1024, 375×812, 360×640 and 320×568, both themes, every place, with 8 and 13 places and with TCP/UDP's titles. The forward button's words were never cut and the button never left the window.

## 10. For the builder

**The header.**

- `src/pages/[track]/[lesson].astro:49`: stop passing `chrome={false}`; pass `current="tracks"` and `footer={false}`. Do not pass `split`: its rules start at 1024px wide (`global.css:190-209`), and the lesson sets its own height at every width.
- `src/layouts/BaseLayout.astro:100-112`: with `chrome` on, the layout wraps the page in `<main id="main">`. `LessonConsole.tsx:304` has its own `<main id="main">`: one of the two must go, so the page has one `main` and one `#main` for the skip link. The lesson's becomes a `div`, or the layout gets a way to leave its wrapper out; the builder picks and says which.
- `src/components/SiteHeader.astro`: used as it is; no change to its markup, script or styles. The one added rule (the open menu's panel laid over the lesson, §4.0) lives in `console.css`. It is sticky and 69px tall; the lesson's console is `calc(100dvh - 69px)` tall under it (`console.css:20-34` is `100vh` today), and the phone and tablet blocks' fixed offsets (`console.css:1384` on) start 69px lower.
- `src/lesson/TopBar.tsx` drops `LogoMark`, the brand link and `ThemeToggle`: the header has both, and its theme button is wired by `wireThemeToggle` as on every page. `BaseLayout`'s `<noscript>` style already hides it.

**The rest.**

- `src/lesson/console.css`: the grid (columns, rows, areas), the bar's three cells and its two heights, the timeline and its fill, the guide and its foot, the log's two heights, the phone and tablet blocks, the no-script and stacked rules for the new parts. Take the prototype's second `<style>` block as the reference for every number; its `data-mode` attribute stands for the page's own media queries (`console.css:1384` for the phone, `:1950` for the tablet on its side), and `data-short` stands for `(max-height: 889px)` at 1100px and up, and for the tablet on its side.
- `src/lesson/TopBar.tsx`: the three cells; the timeline in place of the segments (from `Outline`'s `Item`: the same targets, states and `onGo`); the crumbs leave; `topbar__where` becomes the line's end; the lessons button arrives; `holding` now drives the rule's fill between two marks (`topbar__fill`'s job), off under reduced motion as today. `TopBar.test.ts` follows.
- `src/lesson/Outline.tsx` becomes the track's lessons (from `AllLessons` and `LessonLink`, which already hold the data and the row). The dialog stays as the sheet under 1100px. `Outline.test.tsx` follows.
- `src/lesson/PlaybackControls.tsx` and `src/engine/playback.ts` (`forwardButton`): the words of §4.4, the full and short forms, the accessible name. `playback.test.ts` follows.
- `src/lesson/LessonConsole.tsx`: where the parts mount (the controls in the guide at 900px and up, the bar at the foot on a phone; the timeline after the scene under 900px or upright); `TABS` loses Steps at every width, and `TABLET_SIDEWAYS` has no tabs left; the measured fit of the forward button's words on a tablet (a `ResizeObserver`, tried again after `document.fonts.ready`).
- `src/lesson/LogPanel.tsx`: the controls leave its head at every width.
- The lesson's table is one instance whose home follows §4.6 (the guide, or under the scene). `useFocusAcrossRemounts` already keeps a table's focus across a remount. The guide's entry form reuses the rules at `console.css` for `.tpanel__table:has(thead th:nth-child(4))`, and `rules.css` and `bits.css` under 640px, keyed on the guide as well as on the width.
- The head's no-script style: the `<noscript>` list and the new selectors.
- **The stamp (2.97).** `Stamp` is used on the Lesson page in three places, and all three go: `TopBar.tsx:88` (the bar); `Explanation.tsx:396` (the Overview's first line, `.explain__lead`, shown on a phone and an upright tablet); `Explanation.tsx:117-118` (`p.explain__stamp` in `Sources`, the foot of Learn). The `stamp` prop then has no reader on this page: it leaves `TopBarProps`, `Explanation`'s props and `LessonConsole`'s (`LessonConsole.tsx:74-75`, `:277`, `:327`), and `[lesson].astro` stops passing it. `.explain__lead` keeps the kicker alone. `src/components/Stamp.tsx` and `src/lib/stamp.ts` stay for the track page's cards and About. The `console.css` rules for `.topbar__crumb .stamp`, `.explain__lead .stamp` and `.explain__stamp` go; `.stamp` itself is in `site.css` and stays.
- `src/lesson/Explanation.tsx`: no change to words; the two stamps above leave it.

**Units.** As planned: B22 the header, the shared parts and 1100px and up; B23 the phone and 761 to 1099px.

**End-to-end specs that assume no header on a lesson, or measure what moves:**

| Spec | What changes |
|---|---|
| `site.spec.ts` | its header checks loop over the site's pages: the lesson pages join them, among the pages with no "Start learning" (`:392`), the theme button's checks (`:410-419`, `:975-976`: one `.site-head .theme-toggle`, hidden without script), the menu's (`:462-478`) and the header's place (`:126`, `:512`); the @phone "one screen with its tabs" check now has the header above the lesson, and the tab count is three (two for OSI Model); any check that a lesson shows "Checked" or "Not checked yet" is dropped for lesson pages and kept for the track page and About |
| `lesson.spec.ts` | "one screen" with the header; the outline walk becomes a walk of the timeline's stops; on a phone it uses the stops row, not the Steps tab; the lesson page has one `main` |
| `controls.spec.ts` | the row at 1440 is in the guide: four buttons on one line, the forward button under them; its words and `title`; the phone's x positions stay (12, 68, 124, 180, 236) and its y is unchanged (pinned at the foot) |
| `reading.spec.ts` | words 516px at 1280 (was 480); the folded log is 45px (was 52); Learn's room 590px at 1440×900 (was 730) |
| `tablet.spec.ts` | `.topbar__brand b` (`:128`, `:226`, `:355`) is gone: the header's `.brand b` shows at every width; 1024×768: no tabs, words 346×381, the 44px bar, the controls' row at the foot of the words; 768×1024: the header, the 44px bar, the stops row, three tabs, words 349px, the scene from 113px to 523px (was 52 to 462); its stamp-placement checks (the stamp in the bar at 761px and up, on the Overview's first line under that) become checks that the lesson page has no `.stamp` at any size |
| Figure boxes at 1440×900: `load-balancers` (733×347), `ip-address` (396px), `tcp-udp` (346px), `ports` (316px), `mac-address` (316px) | each scene becomes 769px wide and 498px tall (the table has left); the specs' panel checks move to the guide |
| `subnetting.spec.ts`, `ip-address.spec.ts` at 1440 | the board is the fitted one in the guide; "the line is where it always was" needs a new measure |
| `router.spec.ts`, `arp.spec.ts`, `nat.spec.ts`, `vpn.spec.ts`, `proxies.spec.ts` | the 1440 panel checks move to the guide; `proxies` reaches steps from the timeline |
| `visual.spec.ts` | screenshots only; at 1280×800 and 1366×768 they now show the 44px bar and the table under the scene |
| Unit tests | `BaseLayout.test.ts` and `no-script.test.ts` (the lesson page now has `.site-head`; its buttons are hidden without script); `LessonConsole*.test.tsx` (tabs, where the controls, the table and the timeline mount); `Outline`, `TopBar`, `playback`; `TopBar.test.ts:53-55` ("the bar carries the lesson's stamp") and `Explanation.test.tsx:269-277` ("the Overview's first line holds the kicker and the stamp") turn into "no stamp"; the `stamp=` prop leaves the fixtures in `LessonConsole*.test.tsx`, `Explanation.test.tsx` and `TopBar.test.ts` |

## 11. Acceptance checks

Each can be tried on the prototype.

**The header**

1. The lesson page shows the site's header at the top, 69px tall with its rule, at every width; the page has no footer.
2. At 960px and up the header's links read Tracks, Glossary, How a lesson works, Sources, About, and there is no "Start learning". Tracks has `aria-current="true"`; no other link has `aria-current`.
3. Under 960px the header shows the theme button and the menu button; the menu's panel lists the five links, opens over the lesson without making the page scroll, and closes on Escape.
4. The page has exactly one theme button, in the header, and exactly one link named "TechConcepts home".
5. The page has exactly one `main`, and the skip link lands in it.

**The page**

6. At 1440×900, 1280×800, 1024×768, 768×1024 and 375×812, light and dark, at every place, the page does not scroll.
7. At 1440×900 the scene's panel is 771×550 and the drawing is 769×366 on Networking's DHCP at every step.
8. The scene's panel is as tall as today's at 1440×900 (550px), 1280×800 (476px), 1366×768 (452px) and 1024×768 (452px).
9. At 1440×900 the drawing is at least as wide as today's on every lesson page at its last Watch step: 769px wide on every page but OSI Model (645×440, as today). At 1280×800 no page's drawing is smaller than today's.
10. The log's panel spans the track and the scene (1015×165 at 1440×900), its head is 32px and holds no control, and it shows at least 3 rows at 1440×900 and 1280×800.
11. No lesson word differs from `src/content/`.

**No stamp (2.97)**

40. At every size, at every place, the lesson page has no `.stamp` and shows neither "Checked" nor "Not checked yet".
41. Learn still ends with the "Sources" heading and the numbered list (16 sources on DHCP), and the words still carry their numbered source marks.
42. The track page's lesson cards and About still show the stamp.

**The lesson's bar and the timeline**

12. At 1100px wide and up, in a window 890px tall or more, the bar is 68px with three cells; the first is as wide as the track column and the last as wide as the guide, each within 6px. Under 890px tall it is 44px.
13. The bar holds the lesson's name as the `h1`, "Lesson 9 of 20", and the OSI badge when the unit names a layer; it holds no stamp, no mark, no theme button, no crumb and no segments. Where the unit names no layer the 68px bar's third cell is empty with no rule, and the timeline's cell is the same width as on a lesson with a badge (782px at 1440).
14. The timeline has one stop for every place, in order: 8 for DHCP, 13 for OSI Model. Exactly one has `aria-current="step"`. Stops before it show a tick; the rule is orange up to it and dashed after.
15. At 1440×900 with DHCP every stop shows its name under its mark, no name is cut, and the line ends with "Step 4 of 5". At the Overview it ends with "Overview".
16. At 1280×800 and 1366×768 the stops are marks on one line, followed by the count and the current step's name.
17. With 13 places, at every size, the stops are marks, every mark is inside the timeline's cell, and none is under 24px wide.
18. With TCP/UDP's titles at 1440×900 no name takes more than two lines, and the bar is 68px.
19. Pressing any stop goes to that place in one press; focus stays on the stop.
20. A stop's accessible name is "Step 4, DHCP Acknowledge", with ", done" when passed.
21. During "Play all" the rule between the current mark and the next fills from left to right over the hold, and is full when the next step arrives. With reduced motion nothing fills.

**The track**

22. The track's list shows every part of the track and, in the open part, this lesson with `aria-current="page"`, the orange bar and its status. A done lesson reads "✓ Done"; one in progress reads "In progress".
23. With one part open the 20-lesson list does not scroll at 1440×900. With every part open it scrolls inside the column and the head stays.
24. The part that holds this lesson cannot be closed. Every other part opens and closes with a press, and with Enter or Space.

**The guide**

25. In a window 890px tall or more, while watching, the lesson's table is in the guide between the words and the controls, and scrolls inside itself past its cap. In Learn and Practice, under 890px tall and under 1100px wide it is under the scene.
26. At 1440×900 the words' room at DHCP step 4 is at least 430px and the words do not scroll. At 1280×800 it is at least 500px.
27. The forward button is on a line of its own, 355×40 at 1440, and shows the full form at every place; "Next: UDP: Packet Loss, No Retransmission" takes two lines and is whole. At Practice it reads "Next lesson: Ports".
28. The forward button's accessible name names the place at every place ("Next: step 4, DHCP Acknowledge").
29. The forward button's words are never cut: at every place of every lesson, at 1440, 1280, 1100, 1024, 768, 375, 360 and 320 wide, the label's `scrollWidth` is at most its `clientWidth`, and the button is inside the window.
30. Focus stays on the forward button through a walk from the Overview to Practice.
31. →, ← and Space do what they do today.
32. The key line reads "Space play all or pause ← back → next" and shows only at 1100px and up with a fine pointer.
33. In Learn and Practice the words' column is 558 to 560px at 1440 and the log is folded until "Show log".

**Under 1100px**

34. The bar's button reads "9 of 20", opens the sheet with every part open, and Escape, Close and the backdrop close it with focus back on the button.
35. At 1024×768 there are no tabs; the bar is 44px with the timeline as marks; the five controls are one row of 44px buttons at the foot of the words; the words have 381px; the log's head holds no control.
36. At 375×812 the header is 69px, the lesson's bar 36px, the scene 276px, the stops row 36px, the tabs (Explain, Log, Table) 44px, the controls 64px, and the words have 287px. Every stop is at least 24px wide and 35px tall with 13 places at 360px wide and up.
37. On a phone the controls' x positions and sizes are today's (48px at 12, 68, 124, 180; the forward button 127×48 at 375).
38. At 375 the forward button reads "Next: step 5", "Next: Learn", "Next: Practice" and "Next lesson", with no chevron.
39. Without JavaScript the header's and the track's links work, the places are a plain list under "In this lesson", and no button shows.

## 12. Decisions, one line each

1. The header's 69px come out of the log: the scene is the lesson, the timeline's names were asked for, and the log scrolls to its newest row.
2. The header takes `current="tracks"`: a lesson is inside a track, as a track page is, and the component then leaves out "Start learning".
3. The lesson's bar drops its mark and its theme button: the header has both, and two of either would be two answers to one question.
4. The bar stays 68px where the window is 890px tall or more, and is one line under that: the names under the marks need the height, and a short window needs it more.
5. The timeline is in the bar, not in a band of its own: the bar is the only row over the scene that costs the drawing nothing.
6. "Lesson 9 of 20" stays in the bar, with the lesson's name and over the track's list: it is the lesson's place in the track.
7. The cell over the guide holds the OSI badge alone, and stays where it is with nothing in it on a lesson with no layer: the timeline is then the same width, over the scene, on every lesson (2.97).
8. Stops are numbered squares on a rule: the reference's manner (one line, names under, the count at the end) in Patch's shapes; its circles, colours and words are not copied.
9. Overview, Learn and Practice are stops with a dot, not numbers: only the Watch steps are numbered today, and "Step 4 of 5" must stay true.
10. The count gives up its room before any name does, and names give way to marks before any name is squeezed under 80px: a cut name names nothing.
11. In the marks form the line carries the current step's name beside the count: the place the reader is in is still named.
12. The fill is the rule filling between two marks: the same signal as today's segment, on the thing that replaced it.
13. Parts fold, except the one this lesson is in: 20 lessons and 6 parts do not fit 550px, and a `<details>` works without script.
14. The table goes to the guide only in a window 890px tall or more: under that, the words of a short step would scroll.
15. The forward button never truncates: it wraps at 1100px and up and falls back to the step's number on a tablet and a phone.
16. A tablet on its side has the controls on one row under the words: with the log at 155px, a 61px head with the controls in it would leave two rows.
17. On a phone the scene keeps 34dvh and the words pay for the header: at 31dvh the words would have 24px more and OSI Model's drawing 10% less.
18. The phone's stops row stays under the scene (§5).
19. No new key: R for replay was ruled out in D14 and stays out.
20. The sheet is today's dialog with the track column's content: one component, two homes.

## 13. Open questions for the owner

1. **The log's rows.** With the header on, the log shows 3.1 rows at 1440×900 (today 4.6), so that no drawing is smaller than today's. The other way keeps 4.6 rows and makes OSI Model's drawing 9% smaller at that size (645×440 to 586×400), the other 33 pages unchanged. This spec takes the first.
2. **The header on a phone.** It costs 53px of the words (287px at 375×812; today 372). If that is too dear, the phone could carry only the header's menu button inside the lesson's own bar (the words would have 340px, as revision 1); that would be a new form of the header, which 2.84 leaves unchanged, so it is the owner's call.
