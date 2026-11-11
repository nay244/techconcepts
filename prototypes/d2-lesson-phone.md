# D2: the lesson on a phone, the leftovers

The spec for unit D2 of `plan.md`. The prototype is `prototypes/d2-lesson-phone.html` (one file, no network). Designed 2026-11-10 against the site as it ran that day and `prototypes/s1-lesson-facts.md`.

The phone layout of `docs/direction.md` §7 stays as built: the scene pinned under a 52px top bar, the tabs, Back, Play and Next pinned at the bottom, no page scroll. This unit finishes four things in it. Every rule below lives in the phone block of `src/lesson/console.css` (`@media (max-width: 760px)`, under `:root.js`). Nothing changes above 760px, or with JavaScript off.

**The design's CSS is the `<style id="d2">` block of the prototype.** Copy it; it is written against the real class names. In it, `[data-place='tab']` marks variant A's rules and `[data-place='words']` variant B's: keep the chosen one and drop the attribute. The changes to markup are listed per fix below, and marked `D2 markup` in the prototype's script.

## What changes, in one table

| | Today | D2 |
|---|---|---|
| 1. The lesson's table | Under the scene, below the fold of the scene's own area. A scroll inside that area (276px tall, 146px in Learn) reaches it; nothing says it is there. Wider than the screen. | **A (recommended):** a fourth tab, named for what it holds. One tap, no scroll, no sideways scroll. **B:** in Explain, under a step's words. |
| 2. The log's rows | Values flow one after another, each with its column's name before it. Source starts at x 187 or 220, Destination at 76 or 180, from row to row. | Names in one 84px column, values in the next. Every Source and Destination starts at x 138. |
| 3. The band above the scene | 40px, empty, on a lesson with one view. | Gone. On OSI Model its room goes to the message strip, now pinned in view. |
| 4. The stamp | Foot of Learn only. | Also at the end of the Overview's first line, the first thing the lesson shows. |

## What stays

- The top bar (52px), the scene's height (34% of the screen, 18% in Learn and Practice), the tab row (48px), the controls (64px), and the order Explain, Steps, Log.
- The scene's drawing: 235px at 375×812 and 246px at 390×844 while watching, on all three lessons.
- Explain, Steps and the log's head (its name and legend) are untouched.
- Every lesson word. No new lesson words are needed.
- The desktop layout, the 761px to 1099px layout, and the page with JavaScript off.

## 1. A place for the lesson's table

Applies to the panel a lesson draws under its scene (`src/lesson/panels/UnitPanel.tsx`): a table (16 lessons), the rule list (Firewalls), the bits board (Subnetting). OSI Model's message strip is a different case, in fix 3.

### Both variants

- **The scene's area no longer scrolls.** `.console__stage` is `overflow: hidden`; `.console__scene` is `flex: 1 1 0; height: auto; min-height: 0; overflow: hidden`, so the figure is cut at the scene's edges. The panel leaves the stage's flow.
- **A table with three columns or fewer stays a table**, fitted to the width: cells `padding: 6px 8px`, headings may wrap, words wrap (`overflow-wrap: break-word`). Checked on the running site for SSH, TLS, UDP, FTP and TCP at 375px: no sideways scroll.
- **A table with four columns or more becomes entries**, one per row (`.tpanel__table:has(thead th:nth-child(4))`): each value on its own line with its column's name before it. The names share one 84px column, so every value starts at the same place. The headings stay in the page for a screen reader, visually hidden.
  - Name: `600 12.5px/1.4` display face, `letter-spacing: 0.02em`, muted; ink on a marked row.
  - Value: the cell's own style (13px mono, or 13.5px sans for a prose column). The first value is in strong ink.
  - Line: `padding: 2px 8px 2px 11px`; 9px above the first line and below the last. A 1px line between entries.
  - A marked row keeps its tint and pulse; its 3px bar runs down the whole entry.
  - The DHCP lease entry is 108px tall. Checked on the running site for ICMP, IP and DNS.
  - **Markup:** each `td` in `TablePanel.tsx` gets `data-label={column.label}`, as the log's cells have.
  - Why four: at 375px no four-column table fits with its values whole (the lease row needs 395px, IP's 471px). The rule is by column count, not by measuring, so a table never changes form in the middle of a lesson.
- **The rule list (Firewalls) is two lines a rule.** First line: number, action, port, source, in a grid of `26px 72px 74px 1fr`. Second line: what the rule is for, starting under the action, and what the check found, at the right. Cells `padding: 6px 6px 3px`, second line `0 6px 7px`. A rule is 52px tall. The "For" and "Check" headings are visually hidden. "Connections it remembers" follows 14px under the list; a chip may wrap. The row's state colours are unchanged.
- **The bits board (Subnetting)** takes the same place, as it is. It is 470px wide, so it still scrolls sideways there (224px at 375px). Fitting it is not designed here: see open questions.

### Variant A (recommended): a tab of its own

- **A fourth tab**, after Log, when the lesson's panel is a table, a rule list or the bits board. Its label is by the panel's kind: `Table`, `Rules`, `Bits`. A lesson whose panel is the message strip (OSI Model) keeps three tabs.
- The tab row's columns are equal: 93.75px each at 375px with four, 125px with three (`grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr)`). Type unchanged (`600 17px` display face).
- **The part under the tabs** shows the panel when the tab is chosen: `position: fixed`, the same box as Explain, Steps and Log, `padding: 14px 14px 20px`, card background, scrolls inside itself. It is 372px tall at 375×812 and 393px at 390×844; 502px and 528px in Learn. The panel stays where it is in the markup (inside the stage): only the CSS moves it. `data-tab="table"` on `.console`.
- **Back, Play and Next keep the tab**, as they do today. So a reader can stay on the table and watch it change beside the drawing. Choosing a step in Steps returns to Explain, as today.
- **The tab is there on every slot**, the Overview, Learn and Practice included, and shows the table as it stands.
- **The mark on the tab.** A 7px square in `--selected` (the colour of the row's own mark), 7px after the label.
  - It shows when an event of the current step has changed the panel and the reader has not opened the tab since: a table row added, changed or matched; for the rule list, a visit checked against it, or a connection remembered or matched.
  - It goes when the reader opens the tab, and does not come back for that event. It also goes on moving to a step that has not changed the panel.
  - It never shows on the chosen tab.
  - A screen reader hears `Table, changed`: while the mark shows, the button's `aria-label` is its label and `, changed`; with no mark the button has no `aria-label`. The mark is `aria-hidden`. The words on the tab do not change.
  - State: one key in `LessonConsole.tsx`, the id of the last change the reader has seen. Not stored.
  - Contrast on the tab row's ground: 3.9:1 light, 12.9:1 dark.
- Opening the tab brings the marked row into view (`scrollIntoView({ block: 'nearest' })`), and the row pulses once as it shows.

### Variant B: under the words

- No fourth tab. On a step of Watch, the panel is drawn in Explain after the step's last paragraph and before Go deeper, in a band the width of the screen: `margin: 2px -22px 18px`, a 1px strong line above and below, `--card-2` ground, the panel's own `padding: 12px 14px 14px`.
- Not shown on the Overview, in Learn or in Practice.
- The same table, entry and rule-list forms as above.
- **Markup:** the panel is drawn in `Explanation.tsx` at phone width and in the stage above it, so it is drawn in two places or moved.

### Which, and why

| | A: its own tab | B: under the words |
|---|---|---|
| To reach it | 1 tap; 0 scrolls | 0 taps; a scroll in Explain |
| DHCP, step 4, at 375×812 | Whole table in view | Top edge after 28px of scroll, whole after 150px |
| Firewalls, step 2, at 375×812 | Whole rule list in view | Top edge after 56px, whole after 305px |
| Seen with the drawing | Yes | Yes |
| Seen with the step's words | No | Yes |
| Says when it has changed | The mark on the tab | No |
| In Learn and Practice | Yes | No |
| Cost | A fourth tab, 93.75px wide | Explain grows by the table's height (162px DHCP, 289px Firewalls); the panel is drawn in two places |

**A.** The table gets a fixed place with a name, it is always whole, and the tab says when to look. B keeps the words beside the table, and costs no tab, but on most steps the table starts below the fold again, which is the fault being fixed.

## 2. The log's rows

Every entry is the same three columns: the number (40px), the column's name (84px), the value.

- Row: `padding: 9px 14px 9px 54px`, lines 2px apart. The glyph and number sit at the top left (`left: 14px; top: 9px`).
- **A value with a name** (a column that is not prose): its own line, name then value, `grid-template-columns: 84px minmax(0, 1fr)`. The value may wrap. Values start at x 138 on every row, at 375px and 390px.
- **The words** (a prose column, or the one keyed `plain`): their own line, no name, as today. They start at x 54.
- **A short value** (a column the lesson gives a `width` of 100 or less: Time, Protocol, Size, Prefix): these share the entry's last line, name before value, in muted ink, 14px apart.
  - **Markup:** `LogPanel.tsx` adds the class `log__short` to those cells. No lesson file changes.
- The order on screen: named values, words, then the short values. The order in the markup is unchanged.
- The row that has just played pulses as one entry: the animation moves from the cells to the row.
- The idle line ("Nothing has happened yet…") keeps the full width.

What each log looks like:

```
◎ 3   Source       0.0.0.0:68                       DHCP and the 14 lessons that share its log
      Destination  255.255.255.255:67
      DHCP Request: I’ll take 192.168.1.100, please
      Time 0.006s   Protocol DHCP   Size 342 B

⊗ 2   Source       203.0.113.50:50433                Firewalls
      Destination  10.0.0.10:22
      Service      TCP 22 · SSH
      Decision     Denied · rule 3
      BLOCKED The visitor tries the login door.

ⓘ 26  Laptop ↔ Router ↔ Web server                  OSI Model
      Layer        3 Network
      Layer 3 works with its twin one hop at a time, through the router.
```

Row heights at 375px: DHCP 100px (104px today), 118px when the sentence wraps; Firewalls 120px (84px to 125px today); OSI Model 79px or 98px (106px or 125px today).

## 3. No empty band above the scene

- **A lesson with one view has no band.** `.stage__head:not(:has(.stage__views)) { display: none }`. Two lessons: OSI Model and Subnetting. A lesson with the Network and Sequence switch keeps its 40px band.
- **OSI Model's message strip is pinned under the scene**, always in view: one line, 40px with its top line, which is the band's height. So the drawing keeps today's height (235px and 246px) and the strip no longer needs a scroll.
  - `.labels { padding: 4px 12px 5px }`; the row is 30px tall and does not wrap; chips `padding: 3px 5px`, 12.5px, 4px apart.
  - The note at the right ("6 headers, outermost first") shows whole or not at all: when the chips leave it no room it is cut, with no ellipsis. At 375px it shows up to step 2 (two headers) and from step 9. The sentence a screen reader gets is unchanged.
- **In Learn and Practice the strip is hidden** at phone width: the message is delivered and the strip only says "No headers left". The drawing takes its room: 145px at 375×812 and 151px at 390×844, from 105px and 111px.
- **Subnetting**: the scene grows by the band's 40px (275px at 375×812, measured with the D2 CSS on the running site).

## 4. The stamp

- **Where:** at the end of the Overview's first line, opposite the word "Overview". It is the first line of words a lesson shows, so a reader sees whether the lesson is checked before reading it. It stays at the foot of Learn, as today. Not in the phone top bar: the title, "Step 2 of 5" and the theme button fill it.
- **What:** the same stamp as the desktop top bar, with the source count, linking to About's "Where the facts come from": "Checked 8 Nov 2026, 6 sources" or "Not checked yet, 2 sources". `600 13.5px` display face; the ringed tick or the dashed ring.
- **Only where the top bar's stamp is hidden:** `display: none` by default, shown in the phone block. On a desktop, and with JavaScript off, the page is as it is today.
- **Markup:** on the Overview, `Explanation.tsx` wraps the kicker in `<div class="explain__lead">` and adds `<Stamp stamp={stamp} href="/about#facts" />` after it.
- Layout: `display: flex; align-items: center; justify-content: space-between; gap: 6px 12px; flex-wrap: wrap; margin: 0 0 10px`; the kicker's own margin is 0. The link is 32px tall to the finger (7px of padding above and below, taken back with a negative margin). A stamp too long for the line wraps under the kicker; at 320px wide both of today's stamps still fit on it.
- At 375px: the kicker ends at x 91, the stamp runs from x 159 to 353 ("Checked 8 Nov 2026, 6 sources", 194px).

## New copy

| Where | Words |
|---|---|
| Fourth tab, a table | `Table` |
| Fourth tab, the rule list | `Rules` |
| Fourth tab, the bits board | `Bits` |
| The tab's name while its mark shows, for a screen reader (`aria-label`) | the tab's label and `, changed`: `Table, changed`, `Rules, changed`, `Bits, changed` |

Nothing else is new. The stamp's words are the `Stamp` component's.

## States

| State | In the prototype |
|---|---|
| Table tab, an entry just added | DHCP, step 4, Table |
| Table tab, an entry changed | DHCP, step 5, Table |
| Table tab, empty | DHCP, step 1, Table |
| Table tab in Learn | DHCP, Learn, Table |
| The mark on the tab, and it going | DHCP, step 4, Explain; then open Table |
| No mark | DHCP, step 2 |
| Rule list: rules read, one fits | Firewalls, step 2, Rules |
| Rule list: connections remembered, one known | Firewalls, step 5, Rules |
| Rule list after a change | Firewalls, step 6, Rules |
| Three tabs (no table) | OSI Model |
| Log: idle | any Overview, Log |
| Log: packet rows; a blocked row; a row of dashes | DHCP step 5; Firewalls step 6 |
| Strip with six headers, a new one filled | OSI Model, step 6 |
| Strip with its note | OSI Model, Overview and step 10 |
| Strip hidden while reading | OSI Model, Learn |
| Stamp, checked and not | OSI Model and DHCP, Overview |
| Variant B | the Version switch, then any step of DHCP or Firewalls |
| Today | the Version switch |

## Measurements

Light and dark give the same numbers. "Scene" is `.console__scene`.

| | 375×812 today | 375×812 D2 | 390×844 today | 390×844 D2 |
|---|---|---|---|---|
| Page scroll, all three lessons | none | none | none | none |
| Tabs, DHCP | Explain, Steps, Log | + Table (A) | same | + Table (A) |
| Tabs, Firewalls | Explain, Steps, Log | + Rules (A) | same | + Rules (A) |
| Tabs, OSI Model | Explain, Steps, Log | the same three | same | the same three |
| Scene, watching, DHCP and Firewalls | 235px | 235px | 246px | 246px |
| Scene, watching, OSI Model | 235px | 235px | 246px | 246px |
| Scene, Learn, DHCP and Firewalls | 105px | 105px | 111px | 111px |
| Scene, Learn, OSI Model | 105px | 145px | 111px | 151px |
| Band above OSI Model's scene | 40px, empty | 0 | 40px, empty | 0 |
| DHCP's table: where | y 327, under the scene's area (which ends at 328) | y 376, the part under the tabs | y 338 (area ends 339) | y 387 |
| DHCP's table: to reach it | 0 taps; scroll the scene's area 100px. In Learn: 65px, then 45px more inside the table, 86px sideways | A: 1 tap, 0 scrolls. B: 0 taps, 28px to its top, 150px to all of it | 100px. In Learn 68px, 42px, 71px sideways | A: 1 tap. B: 0px to its top, 102px to all |
| Firewalls' rules: to reach them | Scroll 124px, then 60px more inside the list, and 71px sideways | A: 1 tap, 0 scrolls. B: 56px to the top, 305px to all | 129px, 55px, 56px sideways | A: 1 tap. B: 7px, 256px |
| OSI Model's strip: to reach it | Scroll the scene's area 79px | in view | 79px | in view |
| Log, where Source starts (DHCP) | x 187 or 220 | x 138 | | |
| Log, where Destination starts (Firewalls) | x 76 or 180 | x 138 | | |

At 1440px the prototype shows the phone screen in a frame of 390×844 (or 375×812, by the Screen switch); the numbers inside the frame are those above.

## Acceptance checks

For the phone project (`e2e/site.spec.ts`, the `@phone` block), at 375×812 and 390×844, in both themes unless said.

1. DHCP, OSI Model, Firewalls and Subnetting: the page does not scroll (`scrollHeight` equals the screen's height, `scrollWidth` its width), on the Overview, a step, Learn and Practice.
2. `.console__stage` does not scroll: its `scrollHeight` equals its `clientHeight` on every slot of the four lessons, from the moment the page loads (while the figure draws in, too).
3. DHCP has four tabs, the last labelled `Table`; Firewalls has four, the last `Rules`; Subnetting four, the last `Bits`; OSI Model has three.
4. Each tab, when pressed, shows its part and only its part, and `aria-pressed` follows. The scene's box does not move when a tab changes.
5. DHCP, step 4, Table tab: the lease table is inside the part under the tabs, its bottom above the controls; the part does not scroll down or sideways. The four names (IP address, MAC address, Device, Expires) are visible, and the four values start at the same x.
6. Firewalls, step 2, Rules tab: three rules and "Connections it remembers" are in view without scrolling; no sideways scroll; rule 3 reads "Fits → deny".
7. A three-column table (What is TCP?) is still a table in its tab (`display: table`), with no sideways scroll at 375px.
8. The mark: on DHCP, go to step 4 and stay on Explain; once the step has played the Table tab holds `.tab__mark`, its accessible name is exactly "Table, changed" (its `aria-label`) and the words on it are still "Table". Open Table: the mark and the `aria-label` are gone. Return to Explain: it stays gone. Go to step 2: no mark.
9. Back and Next keep the Table tab chosen. Choosing a step in Steps returns to Explain.
10. The log, DHCP at step 5: on every row, the Source value and the Destination value start at the same x, and that x is the same on every row. The same for Source, Destination, Service and Decision on Firewalls.
11. The log, DHCP: Time, Protocol and Size share one line, the row's last; their cells have the class `log__short`. The log's part does not scroll sideways.
12. OSI Model and Subnetting: `.stage__head` is not displayed. DHCP and Firewalls: it is, 40px tall, with the switch.
13. OSI Model on a step: the message strip is inside the stage and in view, 40px tall, on one line at step 6 (six headers). The scene is 235px tall at 375×812 and 246px at 390×844.
14. OSI Model in Learn and in Practice: the strip is not displayed; the scene is 145px at 375×812 and 151px at 390×844.
15. The Overview of each lesson: a `.stamp` link is on the same line as the kicker, to its right, inside the screen's width, at least 24px tall, and its text is the top bar's. On a step it is not there. At 1440px it is not displayed and the top bar's is.
16. With JavaScript off at 375px, and at 1024px and 1440px with it on, the page is as before: no fourth tab shown, the table under the scene.
17. The existing phone tests still pass; the one that counts the tabs (`e2e/site.spec.ts`, "the tabs show the steps and the log…") changes to expect the fourth on a lesson with a table.

All but 7, 16 and 17 can be tried on the prototype, and were, at both sizes in both themes: all pass. The prototype's figure does not draw in, so check 2's first moments can be tried only on the built page. Subnetting's part of 1 and 12, and check 7, were tried on the running site with the D2 CSS laid over it.

## Noticed, not changed

- The log's head (its name and a legend of two lines) takes 86px of the 372px under the tabs on DHCP, so under three rows show. Not part of this unit.
- Firewalls' "Rule change" row shows three lines of "–" (Source, Destination, Service). It does today too, across one line.
- Firewalls' log rows are 120px each, from mostly 104px, because each of the four values now has its line.
- Table and panel headings in the built page are spaced capitals (`.tpanel__title`, `th`), where §6 asks for sentence case. They are as built; this unit adds no capitals.
- The prototype's Play moves on one step. The real run, and the scene's motion, are not in it. Practice's answers do not respond.
- Only Chromium was run. Playwright's WebKit and Firefox are not installed on this machine.

## Open questions

1. **A or B** for the table's place. A is recommended.
2. **The tab's name.** `Table` for the 16 lessons with a table, `Rules` for Firewalls, `Bits` for Subnetting. One word for all would be simpler to build and vaguer to read.
3. **Subnetting's bits board** is 470px wide and still scrolls sideways in its tab. Fitting 32 bits to 375px is a design of its own (two rows of 16, or smaller cells). In this job, or later?
4. **OSI Model's strip is hidden in Learn and Practice** on a phone, for 40px more drawing. It stays on a desktop.
5. **`:has()`** carries two of the rules (the band, the four-column table). Every current browser has it; if the build must do without, `ScenePanel.tsx` and `TablePanel.tsx` each add a data attribute.

## How the prototype is made

The lesson's markup, its CSS and each scene were copied from the running site (DHCP, OSI Model and Firewalls, every slot, once the step had played), and the fonts are the Latin files in `node_modules/@fontsource`. The page's own CSS is unchanged; the design is the one `<style id="d2">` block. The scripts that capture and assemble it are in the git-ignored `.superpowers/revamp/design/d2/` (`capture.mjs`, `build.mjs`), with the checks (`verify.mjs`, `logcheck.mjs`, `others.mjs`) and their screenshots.

## Errata, 2026-11-11

Two places where the approved spec contradicted itself, found when the build was reviewed. Variant A is otherwise as approved.

1. **The scene is cut at its edges**: `overflow: hidden` on `.console__scene`, in the phone block. Without it check 2 fails: as a page loads the figure slides up 6px (`lm-draw-in`), and for a quarter of a second its box reaches up to 6px past the scene's, so the stage can scroll on DHCP, Firewalls and Subnetting. The prototype's figure does not draw in, so it never showed this. At rest the clip keeps the figure's pool (its soft shadow, a glow in dark) off the band above the scene in Learn and Practice (about 5px of it on DHCP, up to 12px on Firewalls) and off OSI Model's strip (all 40px), where it lay over the switch and the headers at no more than 7 levels of 255 in light and 14 in dark. Nothing inside the scene's box changes. Changed: the scene's rule under "Both variants", check 2 and the note after the checks; the prototype's scene rule.
2. **The tab says it has changed with an `aria-label`**, not a hidden span. Chromium puts a space before the text of an absolutely positioned span, so the name came out as "Table , changed" and check 8 could not pass with the markup the spec gave. An `aria-label` gives one name in every browser, starts with the words on the tab, and leaves those words as they are. Changed: the mark's screen reader line, the last row of "New copy" and check 8; the prototype's tab script.
