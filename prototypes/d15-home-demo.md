# D15: Home's demo, readable and steady on a phone, honest to the keyboard

Job 16, design unit D15. Findings A, B and C of the Home critique of 2026-11-15 (the owner's scope, "A, B and C"); E only where B's layout touches it. The prototype is `prototypes/d15-home-demo.html`: the built Home page (hero, the demo, the tracks) copied from `dist/index.html`, with the D15 changes in its last-but-one `<style>` block, headed "D15". It has no `<script>` at all, so it is also the JavaScript-off path. The dark bar at its top (Light / Dark) is the prototype's own theme switch and not part of the design.

One design, no variants: A has one good answer inside Home's container (below, "Decisions").

## 1. What stays

- **No script.** The demo is still three radio groups and CSS. The radios keep their ids, names, `aria-label`s, their order and their place in the DOM: before `.demo__ui`, inside `.demo`. Every generated rule keeps its form `#id:checked ~ … ~ .demo__ui X` (`index.astro:41`). Home keeps exactly two `<script>` elements (`e2e/site.spec.ts:1710-1714`).
- **Every word.** Lesson 1's words, Home's own words ("Next step", "Go to Learn", "Go to Practice", "Nothing is scored.", the part names) and the five steps are unchanged. The new words are the three key hints (§6). The phone's key shows the drawing's own callout words, moved, not retyped.
- **`net-map.ts`, its frame (`viewBox="-98 -60 685 378"`), `net-map.css` and the Lesson page:** untouched. Home draws its leaders into its own copy of the SVG at build time, as it already draws its trails (`home.ts:141-150`).
- **Desktop (861px and up) looks as it does today.** Same two columns, same 452px panel minimum, same rows, same Next, same drawing with its callouts. Measured at 1440×900, the frame is 585 / 638 / 674 / 686 / 710px through Watch's steps, 718 in Learn and 503 in Practice, as today. What changes on desktop: the Tab stops (C), the rings on the tabs (inset), the key hints, and where each radio sits (B), none of which moves anything the reader sees.
- Learn's foot (D5) is unchanged. On a phone its block is 113px tall, under the 115px limit (`site.spec.ts:1651`).
- The 860px breakpoint. Phone rules apply at `max-width: 860px`, as now.

## 2. What changes, and which finding each change answers

### 2.1 The frame becomes the grid (enables A and B)

`.demo` is now the grid; `.demo__ui` is `display: contents`, and so is the Watch pane while Watch is on show. The panes' children become grid items of `.demo`, so a radio (an absolutely positioned child of `.demo`) can be placed in a grid area: an absolutely positioned grid child whose containing block is the grid takes that area as its containing block. That is how the radios move without leaving their place in the DOM, so every sibling selector still reaches what it lights.

- `.demo`: `position: relative; display: grid; overflow: clip;` and the border, radius and background `.demo__ui` had. `overflow: clip`, not `hidden`: `hidden` makes a scroll box and the phone's Next would not stick.
- Desktop areas, columns `minmax(0, 1.5fr) minmax(300px, 1fr)`, rows `auto auto auto auto auto 1fr`, `min-height: 503px` (today's frame: 1 + 48 + 1 + 452 + 1):
  ```
  'scene parts'
  'scene hint'     the part hint (C)
  'scene rows'     the five steps
  'scene keys'     the step hint (C)
  'scene says'     the narration and its messages
  'scene nexts'    Next
  ```
- Phone areas, one column `minmax(0, 1fr)`: `'parts' 'hint' 'scene' 'rows' 'keys' 'says' 'nexts'`.
- Learn and Practice panes: `grid-row: rows-start / nexts-end` (column 2 on desktop, 1 on a phone), `min-height: 0`.
- The pane's old padding moves to the Watch pane's children: desktop `.demo__rows` padding `16px 18px 0`, `.demo__says` margin `12px 18px 0`, `.demo__nexts` margin `14px 18px 18px`, `align-self: start`.
- Generated CSS: `when('demo-watch') .demo__pane--watch{display:block}` becomes `{display:contents}`. Nothing else in the generated CSS changes form.
- New class per radio group: `demo__in--part`, `demo__in--step`, `demo__in--answer` (or the builder selects by `name`; the spec's selectors use the classes).

The exact CSS is the prototype's D15 block. The builder copies it into `index.astro`'s `<style>` (its selectors there drop the `.try` prefix the prototype needed to win over the built CSS), with these exceptions: the C rules (`visibility: hidden`) and the per-step rules are generated from `PARTS` and `demo.steps`, not written by hand; and the tabs' inset ring goes into the generated `focus()` rule for parts (`outline-offset: -5px`) instead of the prototype's `!important`.

### 2.2 A: the phone's figure (critique P1 "The phone demo scene is unreadable")

At 860px and below:

1. **The frame opens to the screen's edges.** `.demo` gets `margin-inline: -32px` (the `.wrap` gutter, `global.css:158`), `border-inline: 0`, `border-radius: 0`. The tabs, figure and panel run edge to edge, as the Lesson page's stage does on a phone.
2. **The drawing is cropped to lesson 1's layer.** A `<div class="demo__crop">` wraps the SVG: `overflow: hidden; aspect-ratio: 604 / 232`. The SVG inside is `width: calc(100% * 685 / 604)`, `margin: calc(-100% * 38 / 604) 0 0 calc(-100% * 20 / 604)`, `max-width: none; max-height: none`. That shows viewBox units x −78 to 526, y −22 to 210, the extent of the layer's plates (measured: x −75 to 523, y −19 to 206) with 3 to 4 units to spare. The SVG's `viewBox` attribute is not changed, so desktop and the tests that pin the frame are untouched. The crop's four numbers are constants in Home (`CROP = { x: -78, y: -22, w: 604, h: 232 }`), turned into the CSS above when the page is built.
   - Inside the crop, measured in the browser: every trail (steps 2 to 5), every busy part (`nm-busy-laptop`, `nm-busy-resolver`, `nm-http-busy-web`) and `#nm-page`. Their extent is x −25 to 447, y −4 to 158.
   - The figure's own `place-items: center` must be reset (`place-items: normal`) once the figure is a block: Chrome applies `justify-items` to block children and centred the key at 344px wide.
3. **The callouts move out of the drawing into a key**, one band above it and one below, at 12px and 13px. `.nm-call` (the callout groups, text and leader) is `display: none` inside `.demo__scene` at 860px and below; above 860px the key is `display: none` and the callouts show as today.

   | Band | Left column | Right column |
   |---|---|---|
   | Above, `.demo__key--above` | Your laptop / 192.168.1.100 / Wants example.net (left-aligned) | DNS resolver / turns names into numbers / 192.0.2.53 (left-aligned) |
   | Below, `.demo__key--below` | The internet / routers pass messages along (right-aligned) | Web server / 203.0.113.80 · port 80 (right-aligned) |

   - Each band: `display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 12px;` padding `10px 16px 4px` above, `4px 16px 10px` below. Each callout is a `<p class="demo__call">` (`demo__call--end` for right-aligned), `aria-hidden="true"` on the band: the SVG's `role="img"` and `aria-label` already name the map.
   - Lines, in the drawing's own order and type: the name `b`, 700 12px/1.4 mono, `letter-spacing: .1em`, uppercase, `--ink-strong` (the drawing's callout name, as on the Lesson page); an address `.demo__addr`, 500 12px/1.4 mono, `--ink`; a sub-line `span` or the laptop's state `i` (italic), 400 13px/1.35 sans, `--muted`.
   - An address breaks only at its ` · `: each piece is a `nowrap` span (`<span>203.0.113.80 ·</span> <span>port 80</span>`). At 375px it takes two lines; at 768px one.
   - **Where the words come from:** Home reads them out of the drawn SVG at build time, from the four `<g class="nm-call">` groups whose first `<text>` is "Your laptop", "DNS resolver", "The internet" and "Web server", skipping empty `<text>`s. A fixed table in Home gives each its band and column; Home's build throws if one of the four is missing, so the key cannot drift from the drawing.
4. **Home's leaders.** For each of the four callouts, Home appends to its SVG a `<g class="home-leads" aria-hidden="true">` with a vertical path from the callout's own lead dot (`nm-lead-dot` cx, cy) to the crop's edge (y −22 for the band above, 210 for the band below) and a dot `r="3"` at the start. Shown only at 860px and below. Stroke `--line-strong` 1px non-scaling, dot `--muted`. Lesson 1's dots: laptop (−25.7, 75.8), resolver (266, 0.2), internet (222.8, 179.3), web server (438.7, 161.9). Measured at 375px, each leader lands on its label: x 32 in the laptop's 16–182, 214 in the resolver's 194–359, 187 against the internet's right edge 182, 321 in the web server's 194–359. The same holds at 320 and 768px.
5. The plates' engravings ("YOUR HOME · 192.168.1.0/24", "RESOLVER · 192.0.2.53", "EXAMPLE.NET", "THE INTERNET", 3.4 units) and the address on the laptop's screen (2.3 units) stay what they are: texture of the drawing, about 2px on a phone today and after, and on the Lesson page too. The key repeats what they say. They are not labels under the 12px rule (open question 2).

### 2.3 B: on a phone, the narration under the figure and Next in view (critique P1 "Next step pulls the phone view away from the narration")

Two parts: the radios sit where the reader is looking, and on a phone the step's words come straight under the figure.

**Where each radio sits** (all widths). Each radio is `position: absolute; top: 0; left: 0` in a grid area, with a `scroll-margin` that says what must show around it when focus brings it into view:

| Group | Grid area | `scroll-margin-top` | `scroll-margin-bottom` | So a focus shows |
|---|---|---|---|---|
| Part | `parts` (the tabs) | 88px (the 68px sticky header, and air) | 360px | the tabs, the figure, the top of the part |
| Step | `says` (the narration's top) | 88px | 80px (the phone's Next bar) | the new step's first lines |
| Answer | `rows` (the question) | 88px | 300px | the question, its three answers and the hint |

A tap on a label focuses its radio (Chrome, Firefox), and focus scrolls only when the radio is not already in view. A tap on Next or a step tile changes the step, focuses the step radio at the top of the narration, which is where the reader already is, and nothing moves. Safari does not focus a radio on a tap, so nothing moves there today or after.

**The phone's Watch** (860px and below), top to bottom:

1. The tabs, 48px, unchanged.
2. The figure with its key (§2.2), 276px at 375.
3. **The step strip**: the five steps as five tiles in one row, each 44px tall, `1fr` wide (63px at 375, 53 at 320), gap 6px, padding `14px 16px 0`. Each tile is the row's own number (`.demo__n`): 4px corners, the existing 1.5px border, 700 15px mono. States, from the existing generated rules: the step on show has the orange border and number and a `--here-soft` fill (new generated custom property `--tile-bg`, harmless on desktop); steps before it are green with `--accent-ink` numbers (as today's done circles); later ones are plain. The column count comes from the number of steps (`style="--steps:5"` on the list, from `demo.steps.length`).
   - How: on a phone the rows' `<li>` and `<label class="demo__row">` are `display: contents`, so each row lends its number and its words to the list's grid. A tap on a tile is a tap inside the label. The numbers fill row 1 by auto-placement; each row's words (`<span class="demo__t">`, a new class on the existing span) sit in row 2 across all columns, and only the step on show displays (new generated rule `when(id) .demo__row[for=id] .demo__t{display:block}`; static phone rule `.demo__t{display:none}`).
4. **The step on show, named**: its title, 600 20px/1.2 display, and its sub-line, 14px muted, 10px below the tiles. These are the rows' own words, not a copy.
5. The step hint (C), only while a step radio has keyboard focus.
6. The narration and its messages, as today, margin `12px 16px 0`.
7. **Next, kept in view**: `.demo__nexts` is `position: sticky; bottom: 0; z-index: 2`, `background: --card`, a 1px `--line-strong` top edge, padding `10px 16px calc(10px + env(safe-area-inset-bottom))`, the button full width (48px tall, as the button is today). It sits at the foot of the screen while the frame is on it and settles under the narration at the frame's end, as the Lesson page's controls sit at the foot of a phone. Learn's "Go to Practice" does the same inside the Learn pane (margin `14px -16px -18px`, so it reaches the pane's edges). Practice has no Next.

Learn and Practice panes on a phone: padding `16px 16px 18px` (was `16px 18px 18px`).

Desktop keeps its five rows, its narration and its Next where they are; only the radios move (above).

### 2.4 C: Tab stops only for the part on show, a ring on what the reader sees, and a hint (critique P1 "Keyboard focus lands on answer radios that cannot be seen", WCAG 2.4.7)

1. **A group whose part is not on show is not a Tab stop.** Generated from `PARTS`:
   ```
   #demo-learn:checked ~ .demo__in--step, #demo-practice:checked ~ .demo__in--step,
   #demo-watch:checked ~ .demo__in--answer, #demo-learn:checked ~ .demo__in--answer { visibility: hidden; }
   ```
   `visibility`, not `display`: a hidden radio keeps its checked state (the step in Watch, the answer in Practice) and its rules, so the page on the laptop stays drawn through Learn and Practice as today (`site.spec.ts:1738-1760`), and the answer picked is still picked when Practice comes back. A hidden radio leaves the accessibility tree too, which is right: a screen reader is not offered the steps while Learn is on show.
2. **Every stop rings what the reader sees** (`outline: 2px solid var(--focus)`):
   - a part: its tab, ring inset (`outline-offset: -5px`), because at the frame's top edge an outside ring was cut off by the frame's clip;
   - a step: its row on desktop (as today); on a phone its tile (new generated rule inside `@media (max-width: 860px)`: `#demo-sN:focus-visible ~ .demo__ui .demo__row[for="demo-sN"] .demo__n{outline:2px solid var(--focus);outline-offset:2px}`), because a `display: contents` label draws no ring;
   - an answer: its option (as today).
3. **The key hints.** A strip of label tape (Patch §6: "a small bordered strip, like label-maker tape") by each group, shown only while that group has keyboard focus (`:focus-visible`; a tap or a click does not show it). `aria-hidden="true"`: a screen reader announces a radio group's arrow keys itself.

   | Hint | Where | Words |
   |---|---|---|
   | `.demo__hint--part` | area `hint`, under the tabs | ← → Arrow keys switch between Watch, Learn and Practice. |
   | `.demo__hint--step` | area `keys`, under the steps | ← → Arrow keys move between the steps. |
   | `.demo__hint--answer` | in the Practice pane, under the answers | ↑ ↓ Arrow keys choose an answer. |

   Tape: `width: fit-content`, padding `5px 10px 5px 8px`, 1px `--line-strong` border, 2px corners, `--tile` ground, 600 15px/1.25 display, `--ink-strong`. Each arrow is a `<kbd>`: 20px tall, min 20px wide, 1px border with a 2px foot, 3px corners, `--card`, 700 12px mono. Margins: part `12px 18px 0` (phone `10px 16px 0`), step `12px 18px 0` (phone `12px 16px 0`), answer `12px 0 0`. The tape appears in the flow, so what is under it moves down 33px (51px when it takes two lines at 375) while the keyboard is in the group, and back when it leaves; a pointer never shows it.

## 3. Every state

| State | Phone (≤860) | Desktop |
|---|---|---|
| Watch, step 1 (on load) | Tile 1 orange, "Client Request" named, narration, Next bar. No trail; laptop busy | As today |
| Watch, steps 2–4 | Earlier tiles green; trail and busy parts per step | As today |
| Watch, step 5 | Page on the laptop drawn; "Go to Learn" in the bar | As today |
| Learn | Learn pane from the figure down; "Go to Practice" sticky in the pane; page stays drawn | As today |
| Practice, no answer | Prompt, three options, "Nothing is scored." | As today |
| Practice, an answer | Its option bordered (green if right); its feedback below | As today |
| Learn's sources open | As D5 | As D5 |
| Keyboard on a part / step / answer | Ring on the tab / tile / option; that group's hint | Ring on the tab / row / option; that group's hint |
| Dark theme | Same, from the tokens | Same |

## 4. Tab order, per part (same at every width)

| Part on show | Stops in the demo, in order | After the demo |
|---|---|---|
| Watch | the part group (the checked tab), the step group (the checked step) | the tracks' first link |
| Learn | the part group, "Lesson 2: HTTPS", the three shown sources, "Show the other 17" (and, open, the 17) | the tracks' first link |
| Practice | the part group, the answer group (the checked answer, or the first when none is) | "Open the whole lesson", then the tracks |

Arrow keys move within a group (and check, as radios do). Shift+Tab walks the same stops back.

## 5. What happens on a tap at 375×812 (measured in the prototype, Chrome)

Starting with the frame's top just under the header (scroll 686, tabs at y 71):

| Tap | Page moves | Where things are after it |
|---|---|---|
| Next step (1→2, 2→3, 3→4, 4→5) | 0px each | Narration starts at y 544 (step 1: 520); Next bar 743–812 |
| A step tile (1→4) | 0px | Narration at 533 |
| Go to Learn | 0px | Learn's lead at 423 |
| Go to Practice | 0px | Options at 488, 542, 597 |
| An answer (the third) | 0px | Its feedback at 655–722 |
| The Watch tab, from Practice | 0px | — |

Two cases that move, by design:

- Narration's top hidden under the header (at y 40), then Next: the page moves back 60px so the new narration starts at y 100, below the header.
- The tabs scrolled off the top at step 5, then Go to Learn: the page moves 300px so the tabs are at y 270 and Learn's lead at 611.

## 6. Copy

New words, Home's own (sentence case, no time figures):

- "Arrow keys switch between Watch, Learn and Practice."
- "Arrow keys move between the steps."
- "Arrow keys choose an answer."

The arrows (← →, ↑ ↓) are `<kbd>` keys before the words. No other word is added, removed or changed. The key's words are the drawing's.

## 7. Sizes and breakpoints

- Breakpoint: 860px (`max-width`), the existing one. Checked at 320, 375, 768, 1440: no sideways scroll at any (`scrollWidth` 320, 375, 753 + scrollbar, 1440).
- Phone controls: tabs 48px, tiles 44px, Next 48px, options 46px, source links 44px (D5). Desktop unchanged.
- Phone frame at 375: Watch 739 / 793 / 828 / 865 / 864px by step (today 875 at step 1); Learn 1,106; Practice 616. Desktop: as today (§1).
- Figure at 375: 276px tall (key above 51, drawing 375×144, key below 52; today 177px with a 297×164 drawing).

## 8. JavaScript off

Nothing in D15 needs script; the prototype has none. Every state in §3, the Tab order in §4 and the taps in §5 are the same with JavaScript off. `site.spec.ts:969-1012` and `:1665-1681` keep passing as written.

## 9. Measurements, before (today, `dist/` of `070cce6`) and after (the prototype)

Measured in the browser pane (Chromium), light theme unless said.

**A, the phone's scene**

| | Before, 375×812 | After, 375×812 | 1440×900 (both) |
|---|---|---|---|
| Drawing | 297×164px, 0.434px a unit | 375×144px, 0.621px a unit (×1.43) | 718×396, 1.048px a unit |
| Callout names | 5.0px | 12px | 12.1px |
| Addresses | 5.4px | 12px | 13.1px |
| Sub-lines, the laptop's state | 5.6px | 13px | 13.6px |
| Median label (text box height) | 7px (17 texts, engravings included) | 17px (10 key texts); font median 12px, minimum 12px | 16–18px |
| Engravings, the laptop's address bar | 1.5px, 1px | the same (texture, §2.2.5) | |

**B, the page after Next on a phone**

| | Before, 375×812 | After, 375×812 |
|---|---|---|
| Scroll after Next, tapped with Next at y 732–780 (scroll 794) | moves to 312.5: **−481.5px** | **0px**, at every step |
| Step 2's narration after it | y 960–1229, wholly below the 812px screen | y 544–790, starts in view |
| Next after it | y 1243, off screen | y 743–812, in view |
| Scroll after Next at 1440×900 | 0px | 0px |

**C, Tab stops in the demo**

| Part on show | Before | After |
|---|---|---|
| Watch | part, step, answer: 3 stops, 1 with nothing seen (the answer, its option hidden) | part, step: 2 stops, both ringed |
| Learn | part, step, answer, then the links: 2 with nothing seen | part, then the links: 0 unseen |
| Practice | part, step, answer: 1 with nothing seen (the step) | part, answer: 0 unseen |
| A hint while a group has focus | none | under the tabs, the steps and the answers; visible on screen at each stop (375: e.g. part ring at y 434–482, hint 493–544; step ring 267–311, hint 377–410; answer ring 652–698) |

**E, the frame's height by part:** not taken. Desktop keeps today's 452px panel minimum (frame 585 / 718 / 503). A phone's frame follows its content, as today.

## 10. Acceptance checks

**B** = needs a real browser (focus, scroll, Tab, sizes, layout): an end-to-end test in `e2e/site.spec.ts` (job 15's lesson). **U** = a unit test (`src/lib/home.test.ts`). Each check names its width. Playwright clicks are real pointer clicks, so a `.click()` on a label stands for a tap in Chromium.

1. **B, 375×812 and 1440×900:** Home has exactly two `<script>` elements, and no `astro-island` (`site.spec.ts:1710-1714`, kept).
2. **B, 375×812:** each `.demo__call` text (`b`, `.demo__addr`, the sub-line `span`, `i`) has a computed `font-size` ≥ 12px, and there are 10 of them, in the order of §2.2.3.
3. **B, 375×812:** every `.nm-call` inside `.demo__scene` is not displayed; at 1440×900 the `.demo__key` bands are not displayed and the four callouts are.
4. **B, 375×812, at each step 1–5:** every `.home-trail` lit at that step, every busy part lit at that step (opacity 1), and `#nm-page` have bounding boxes inside `.demo__crop`'s box (±0.5px).
5. **B, 375×812:** the SVG's width over 685 is ≥ 0.6 (the drawing's scale); `.demo` is as wide as the window (375) and `document.documentElement.scrollWidth` is 375. The same no-sideways check at 320×640.
6. **B, 375×812:** each `.home-leads path`'s x lies within its callout's box, or within 8px of its right edge for a right-aligned one (the internet).
7. **U:** Home's key words are the drawn callouts' words (the four names, in the bands of §2.2.3); a drawing without one of the four makes `homeDemo()` throw; the crop's numbers hold every trail point and every lead dot of lesson 1.
8. **U:** the SVG's `viewBox` stays `-98 -60 685 378` (`net-map.test.ts:155`, kept).
9. **B, 375×812:** scroll so `.demo` is 70px from the top; for each step 1→2, 2→3, 3→4, 4→5 click the visible Next: `scrollY` does not change, the new `.demo__say` top is between 69 and 812, and the visible `.demo__next` is between 69 and 812.
10. **B, 375×812:** from step 1, click step 4's tile (`.demo__row[for="demo-s4"] .demo__n`): `#demo-s4` is checked, `scrollY` does not change, step 4's narration starts on screen.
11. **B, 375×812:** at step 5, click "Go to Learn", then "Go to Practice", then the third option: `scrollY` never changes when the tabs are on screen; Learn's lead, the options and the feedback start on screen.
12. **B, 375×812:** with the narration's top under the header (y 40), click Next: afterwards the narration's top is ≥ 69 (below the header).
13. **B, 375×812:** scroll so the demo's middle is on screen; the visible `.demo__next` has `position: sticky` and its bottom is the window's bottom (±1px) while the frame's end is below the window.
14. **B, 1440×900:** at each step and part, `.demo`'s height equals today's: Watch 585 / 638 / 674 / 686 / 710, Learn 718, Practice 503 (±1px).
15. **B, 375×812 and 1440×900:** Tab from the demo intro's "HTTP" link with Watch on show: the stops are `#demo-watch`, the checked step radio, then a link outside `.demo`. With Learn on show: `#demo-learn`, then "Lesson 2: HTTPS". With Practice on show: `#demo-practice`, an answer radio, then "Open the whole lesson". No focus lands on a radio of a part not on show.
16. **B, 1440×900:** `getByRole('radio', { name: /^Answer: / })` has 0 while Watch or Learn is on show and 3 while Practice is; `getByRole('radio', { name: /^Watch, step / })` has 5 while Watch is on show and 0 otherwise (replaces `site.spec.ts:250`).
17. **B, 375×812 and 1440×900:** at each stop of check 15 that is a radio, the label or tile it rings has a computed outline that is not `none`, and that box lies inside the window, below the header (top ≥ 69) and above the window's bottom.
18. **B, 375×812 and 1440×900:** while a part / step / answer radio has keyboard focus (reached by Tab or an arrow key), exactly that group's `.demo__hint` is displayed and lies inside the window; with no keyboard focus in the demo, none is displayed; after a click on a tab, a step and an option, none is displayed.
19. **B, 1440×900:** the step `#demo-s5` stays checked through Learn and Practice, and the page on the laptop stays drawn (`site.spec.ts:1738-1760`, kept); a picked answer is still checked after Practice → Watch → Practice.
20. **B, 375×812 and 1440×900, JavaScript off:** the demo steps, shows Learn and answers a question (`site.spec.ts:1001-1011`), and check 15's Tab stops hold.
21. **B, 375×812:** the tabs (48px), the five tiles, Next and the three options are each ≥ 44px tall.
22. **U:** `index.astro`'s D15 rules hold no colour value except tokens (as `home.test.ts:281-287` checks D5's).
23. **B, 375×812 and 1440×900, dark theme:** checks 2, 9 and 17 hold.

## 11. Tests that change (for the builder)

- `site.spec.ts:250`: the count of answer radios while Learn is on show becomes 0 (check 16).
- `site.spec.ts:183-187` and `:1724-1732` click `.demo__row`. At 1440 they keep working. At a phone width a `display: contents` label has no box: click `.demo__row[for=…] .demo__n`.
- `site.spec.ts:148` reads `.demo__row b`: at 1440 unchanged; at a phone width only the step on show displays its words (the others are in the DOM, not displayed).
- Anything that measures `.demo__ui`'s box gets zeros now (`display: contents`); measure `.demo`. The scout found none.

## 12. Decisions, one line each

1. One design for A, no variants: a crop alone gives ×1.1 (labels ~6px), and a figure opened wider (scrolled sideways) loses the way from laptop to server at steps 3–5; moving the callouts into a key is the only answer that reaches 12px.
2. The key keeps the drawing's callout style (uppercase spaced mono names), not Patch's sentence case, so it reads as the same callouts the Lesson page shows.
3. The frame runs edge to edge on a phone: 64px more drawing (×1.21 on its own), and the Lesson page's stage already does.
4. Steps become a strip of five tiles on a phone so the figure, the step, its narration and Next fit one 812px screen (step 1: tabs at 71, Next bar ends at 808).
5. Next sticks to the foot of the screen on a phone, as the Lesson page's controls do, so it is in view whatever the narration's length (192 to 318px at 343 wide).
6. Radios are anchored by grid area, not moved in the DOM, so every generated selector keeps its form; `display: contents` on `.demo__ui` makes that possible.
7. Part radios anchor at the tabs, not at the pane: anchored at the pane, a Tab from above left the tab's ring under the sticky header (measured: ring at y 23–71).
8. `scroll-margin` carries what must show around each anchor (header above; Next bar, the figure, the answers below), so no anchor needs to be as tall as what it shows.
9. Hidden groups use `visibility: hidden`, not `display: none` or `inert`: no script, and the checked state and its lights survive.
10. The tabs' ring is inset, because the frame's clip cut the outside ring's top edge.
11. One hint per group, by that group, shown only on `:focus-visible`, so a pointer never sees it and the keyboard sees it where its ring is (a single hint under the tabs was off screen at the step's ring, measured y −12).
12. E is not taken: B's layout changes no desktop height, and a phone's frame follows its content by nature; the desktop minimum stays 503px.

## 13. Open questions for the owner

1. **The key's capitals.** The phone's key keeps the drawing's spaced uppercase names ("YOUR LAPTOP"), against Patch's sentence-case rule, so Home and the Lesson page show the same callouts. Sentence case on Home only would be one rule in the key.
2. **The engravings.** The plates' small engraved words (about 2px on a phone) stay texture and are not counted as labels. If the owner counts them, no crop reaches 12px; they would have to be hidden on Home's phone figure.
3. **A full-width Next on a tablet.** Between 600 and 860px the sticky Next is the full frame width (735px at 768). It reads as a bar; a cap (for example 420px) would add a second width rule.

## 14. Risks the build must watch

- **Browser focus rules.** B rests on "focus scrolls only when the radio is out of view", true in Chromium (measured) and Firefox; Safari does not focus a radio on a tap, so it never jumped. The end-to-end checks run in Chromium.
- **`display: contents` on a `<label>`**: hit-testing reaches its children, so a tap on a tile checks the radio (measured). The label draws no outline, hence the tile's ring rule.
- **Chrome's `justify-items` on block children** (§2.2.2): keep `place-items: normal` on the phone's figure.
- **`overflow: clip`** on `.demo` (supported in Chrome 90+, Firefox 81+, Safari 16+); with `hidden`, the sticky Next stops sticking.
