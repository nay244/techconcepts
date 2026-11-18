# D21b: About in the "Card stack" look

Job 22, design unit D21b (direction 2.84, 2.110, 2.111). The About page (`src/pages/about.astro`, at `/about`) in Card stack, colour variant A, as on Home (D17), Tracks (D18) and the track page (D20). The owner opened the layout (2.111), so there are **two layouts** behind one switch: **1 Column**, today's structure restyled and fixed where measured, and **2 Folders**, a different structure. **Layout 2 is recommended** (§2).

The prototype is `prototypes/d21-about.html`: one self-contained file, built from today's `/about` (`dist/` at revamp 3f0e47c): its header, footer, fonts, figures and Patch's tokens as they are, then `src/styles/card-stack.css` as it is, then one block headed "D21 About". The dark bar at its top is the prototype's own: **Layout**, **Theme**, **State** (As loaded, Reset asked, Progress cleared, No JavaScript, Storage blocked), **Counts** (today's 7, 30, 0, or wider figures) and **Analytics line**. Each layout's markup sits in a `<template>` as the server would render it; a short script at the foot draws the chosen one, works the bar and the header's two buttons, plays the Reset island's three looks, and (layout 1) runs a copy of `src/scripts/about-toc.ts`. None of that script is built. `d21-about.html#pl=2&facts` opens layout 2 at a section; `#bar=0` hides the bar. Resize the window for the widths.

(Written in parts as the work went; every section below is final.)

## 1. What the page must still say, and what it said badly

Fixed by the brief (plan decisions 2 and 6), whatever the layout: every sentence and every section of today's page, word for word; the three counts (7 tracks planned, 30 lessons ready, 0 accounts needed, the first two computed); the figures, or a measured ruling on them; a way to each of the five sections; `#facts` (the Glossary's stamp and Home link to it) and every section's address landing clear of the sticky header; Reset progress and its three looks. The header and footer do not change, nor `card-stack.css`'s rules, nor `src/styles/tokens.ts`.

Measured today (revamp 3f0e47c, the built page, Chromium):

| | Today |
|---|---|
| Page height, 1440 × 900 | 4,826px |
| Page height, 768 × 1024 | 4,852px |
| Page height, 390 × 844 / 375 × 812 | 6,483 / 6,883px |
| Page height, 320 × 640 | 8,466px, and **the page scrolls sideways: it is 357px wide** (the third count ends at x 357) |
| "Where the facts come from" | 1,538px of the 4,826 at 1440; 2,257px of the 6,883 at 375: a third of the page |
| The list of sections on a phone | 2 of its 5 links whole on screen at 375 (the row is 624px in a 311px column) |
| Tab stops in `main` | 23: the crumb, 5 in the list, 16 sources, Reset |
| Keyboard walk, Tab then Shift+Tab (each stop's box grown by its 5px ring) | 1440: 5 reads fail (4 source links under the sticky header going back, 1 ring under the window's foot); 375: 11; 320: 12; with the menu open, 36 at 375 and 43 at 320 (every stop in `main` is under the open header) |
| A section's address | lands its top 92px down |
| Gzipped HTML | 51.4 KB (51.6 by the orchestrator's count); 5 `<script>` |

What was wrong besides the look:

- **The counts cannot shrink.** Their words are `white-space: nowrap` in a row that does not wrap, so the row is 325px whatever the window is: it overflows from 356px down.
- **One lesson's sources are a third of the page.** The example list has 16 rows, and its first column is 96px, so "Microsoft Windows network settings" stands four lines tall. On a phone a reader scrolls 2,257px of one example to reach Credits.
- **The list of sections lights a row nobody is looking at.** On a phone the row is not sticky, so once past it the script's mark is off screen. A browser also does not scroll that row to a chip that is partly in view, so a keyboard's focus can sit on a chip that is cut off.
- **Nothing keeps focus clear of the header.** The root has no scroll padding (2.89's follow-up, not yet taken for this page).
- The page's links are Patch's blue, which no Card stack page uses; `.a-toc .toc-h` repeats `site.css`; the Reset button is 40px tall.

## 2. The two layouts

Both wear the same parts (§5) and say the same words (§9). They differ in structure.

**Layout 1, Column: today's structure.** The opening is the line, a rule, the lede and the three counts. Under it the list of sections stands beside a 46rem reading column and sticks while the page scrolls; on a phone it is a row to swipe. The five sections are open prose on the page's ground, a hairline between them; the *things* inside them are cards, each named on its index tab: the three parts of a lesson ("1 Watch", "2 Learn", "3 Practice"), the sources ("Sources in the DHCP lesson"), the list itself ("On this page"). The script that lights the section being read stays.

```
1440                                              375
Home / About                                      Home / About
WATCH IT HAPPEN,                                  WATCH IT HAPPEN, …
THEN LEARN ITS NAME.                              ───────────────
──────────────────────────────────────────        lede
lede                          [ 7 | 30 | 0 ]      [ 7 | 30 | 0 ]
                                                  (What it is)(How a lesson…)(Wh→ swipe
┌On this page┐   What TechConcepts is             What TechConcepts is
│■ What it is│   prose                            prose
│  How a …   │   ─────────────                    ─────────────
│  Where …   │   How a lesson works               How a lesson works
│  Credits   │   ┌1 Watch┐                        ┌1 Watch┐
│  Your …    │   │ fig │ See it happen │          │fig│ See it happen │
└────────────┘   …                                …
```

**Layout 2, Folders: no side list; each section is a card named on its tab.** The opening holds everything that orients a reader: the line and the lede at the left, and at the right the counts and the list of sections as a card ("On this page"), all on the first screen. Then five full-width cards, each with its `h2` as a taller index tab on its top edge, so the page reads as five labelled folders. Inside a card the width is used: two columns of prose, the three parts of a lesson across with their figures large, the sources beside the words, the table beside Reset. On a phone the cards stack, each one column, and reach 16px past the text column on each side so their words keep the column's width. No section is lit, so the script goes.

```
1440                                              375
Home / About                  [ 7 | 30 | 0 ]      Home / About
WATCH IT HAPPEN,              ┌On this page┐      WATCH IT HAPPEN, …
THEN LEARN ITS NAME.          │ What it is │      lede
lede                          │ How a …    │      [ 7 | 30 | 0 ]
                              │ Where …    │      ┌On this page┐
                              │ Credits    │      │ five rows  │
                              │ Your …     │      └────────────┘
┌What TechConcepts is┐        └────────────┘     ┌What TechConcepts is┐
│ prose              │ prose                │    │ prose              │
└───────────────────────────────────────────┘    └────────────────────┘
┌How a lesson works┐                             ┌How a lesson works┐
│ [fig] 1 Watch │ [fig] 2 Learn │ [fig] 3 Practice│   │ fig │ 1 Watch …   │
│ note                    │ last sentence   │    …
└───────────────────────────────────────────┘
```

### What each fixes, measured

Chromium, the prototype with its bar hidden, light (dark is the same to the pixel), as loaded (the Reset button drawn).

| | Today | Layout 1, Column | Layout 2, Folders |
|---|---|---|---|
| Page height, 1440 × 900 | 4,826 | 4,063 | **3,364** |
| Page height, 768 × 1024 | 4,852 | 4,218 | 4,233 |
| Page height, 390 × 844 | 6,483 | 5,507 | **5,377** |
| Page height, 375 × 812 | 6,883 | 5,653 | **5,587** |
| Page height, 320 × 640 | 8,466 | 6,694 | **6,344** |
| The same with the 13 folded sources open: 1440 / 375 / 320 | (as above) | 4,849 / 6,851 / 7,978 | 4,104 / 6,752 / 7,594 |
| Sideways scroll, 320 to 1440 (80 widths, with the counts 7, 30, 0 and 12, 1000, 0) | from 356 down | none | none |
| "Where the facts come from", 1440 / 375 | 1,538 / 2,257 | 615 / 921 | 393 / 766 |
| The list's links whole on screen at 375 | 2 of 5 | 2 of 5 (5 of 5 while the keyboard is in the row) | **5 of 5** |
| Tab stops in `main` | 23 | 11 (24 with the sources open) | 11 (24) |
| Keyboard walk, closed and open menu, 320 / 375 / 390 / 768 / 1440 | fails at every width | 0 fails at 768 and 1440; on a phone the scripted walk still reads cut chips in the swipe row, which a real Tab does not see (§5.3) | **0 fails at every width, menu closed and open** |
| Least clearance of a focus ring under the header | under it | 6px (7px with the menu open) | 6px (7px) |
| A section's address lands | 92px | 92px, all five | 92px (the tab's top), all five |
| Gzipped HTML | 51.4 KB | 49.6 KB | 49.1 KB |
| `<script>` elements | 5 | 5 | **4** |

### Recommended: layout 2, Folders

The measured reason: it is the shorter page at every phone width and by 699px at 1440 (3,364 against 4,063; today 4,826), all five ways into the page are on screen at once at every width (the swipe row shows two), its keyboard walk is clean everywhere with no special rule, and it needs one script fewer. It also puts the counts and the list on the first screen beside the line at 1440, where layout 1 leaves about 170px at the right of its reading column empty all the way down (218px today).

**What layout 1 buys:** the page the owner already knows; on a desk the list stays in view and shows which section is being read; the section headings stay large (30 to 42px against the tab's 21 to 24px); prose runs in one column from top to bottom with no card around it.

## 3. Tokens, and the shared Card stack stylesheet

`about.astro` imports `src/styles/card-stack.css` (after `site.css`), as Home, Tracks and the track page do. **No line of that file changes** (its opening comment lists the pages that import it; adding About to that comment is the only edit, and it is not a rule). No token is added anywhere: every colour on the page is a Patch token or a `--cs-*` name.

What the file does to this page by being imported, and the design draws it so:

- **Buttons in `main`** (`main .btn`): Reset progress, Reset and Cancel are 48px tall with a 2px edge, 22px side padding, 18px Barlow and the 3px offset edge; `main .btn` outweighs `.btn--small`, so the island's `btn--small` no longer makes them 40px. `ResetProgress.tsx` does not change.
- **Figures in `main`** (`#main .lm-svg`, `main { --fig-bg … }`): the four drawings are re-tinted, not redrawn: white faces on the card's paper, ink line, no glow, no rings, the lit part in `--cs-here`.
- **Links**: `card-stack.css` holds no link colour. The page's own `.a-sec a { color: var(--link) }` is removed, so links are ink with the global underline, as on the other Card stack pages.

Classes taken from the file: `cs-card` (the counts, the list, each lesson part, the note, the sources figure, the sources and the table in layout 1; the counts, the list and each section in layout 2) and `cs-tab` (§5). `cs-card--beneath`, `cs-card--soon` and `cs-tab--here` are not used: nothing on this page lies behind another card, is not yet there, or is a place in a route.

Colour, one job each: **orange** (`--cs-here`) marks the section being read (layout 1 only); **orange** (`--cs-act`) fills the one button that does the thing, Reset, in the question; **green** (`--allowed-text`) is "Progress cleared". Nothing else on the page is coloured.

## 4. Type

The site's three faces, as today. No size on the page is below 14px.

| Part | Face, weight, size / line | Colour |
|---|---|---|
| The line, `h1` | Barlow Semi Condensed 700, `clamp(44px, 7.4vw, 104px)` / 0.92, `-0.008em`, balanced, at most 13em wide (layout 2: `clamp(44px, 6.6vw, 96px)`) | `--ink-strong` |
| The lede | Atkinson Next 400, 19 / 1.5, at most 34em | `--ink-strong` |
| The crumb | Atkinson Next 400, 15px | `--muted`; "About" `--ink-strong` |
| A count's figure | Barlow 700, `clamp(30px, 12cqi, 56px)` / 0.9 of the counts card's own width (30px in a 256px card, 43px in a 360px card) | `--ink-strong` |
| A count's words | Barlow 600, 15 / 1.2, `0.02em`, one word a line (`width: min-content`) | `--muted` |
| An index tab (`cs-tab`) | Barlow 600, 16 / 1, `0.01em`, 34px tall | `--ink-strong` |
| A section's name, layout 1 (`h2`) | Barlow 700, `clamp(30px, 3.4vw, 42px)` / 1.05 | `--ink-strong` |
| A section's name, layout 2 (`h2.cs-tab`) | Barlow 700, 24 / 1.1 (21px at 860 and down), at least 44px tall, may wrap | `--ink-strong` |
| Prose | Atkinson Next 400, 18 / 1.55; 14px between paragraphs | `--ink` |
| The list's links | Barlow 600, 16 / 1.25 (layout 2: 17px), no underline | `--ink` (layout 2 and the lit link: `--ink-strong`) |
| A part's heading, `h3` | Barlow 700, 24 / 1.1 | `--ink-strong` |
| A part's words, a source row, credits, the table | Atkinson Next 400, 16.5 / 1.55 | `--ink` |
| The note | Atkinson Next 400, 17 / 1.55; its first sentence 700 | `--ink`; bold `--ink-strong` |
| A source's short name | Atkinson Mono 500, 15 / 1.6 | `--ink-strong` |
| "Show the other 13" | Barlow 600, 16 / 1.2, `0.01em` | `--ink-strong` |
| "Figures", "Type"; the table's column heads; layout 2's "Sources in the DHCP lesson" and caption | Barlow 600, 15 / 1.2 to 1.7 (column heads 14px), `0.02em` | `--muted` |
| The question; "Progress cleared" | Atkinson Next 600, 18px; 400, 16px | `--ink-strong`; `--allowed-text` |

## 5. Components and their states

### 5.1 The opening (`section.wrap.a-open`)

Top padding `clamp(24px, 4vw, 48px)`, bottom the same from 28px. The crumb's link and its row are 44px tall (today the target is one line of 15px text).

- **Layout 1.** Crumb, the line, then `div.a-open__row`: a 2px `--cs-edge` rule above it, 20px of air, a grid of `minmax(0, 1fr)` and 360px with a gap of `clamp(24px, 5vw, 80px)`, the lede and the counts card bottom-aligned. At 860 and down: one column, the counts card full width under the lede, 24px between.
- **Layout 2.** A grid of `minmax(0, 1fr)` and 360px, the same gap, top-aligned. Left (`div.a-open__main`): crumb, the line, the lede `clamp(20px, 2.4vw, 32px)` under it. Right (`div.a-open__side`): the counts card, then the list card 54px lower (its 34px tab plus 20px). No rule. At 860 and down: one column, the side 24px under the lede.

### 5.2 The counts (`dl.stats.cs-card`), both layouts

One card, three equal cells (`repeat(3, minmax(0, 1fr))`), a 2px `--cs-edge` line between cells. A cell: the figure over its words (the `dt` stays first in the markup, as today), 6px between; padding 14px top, 12px bottom, `clamp(8px, 4.5cqi, 18px)` at the sides. The card is its own size container (`container-type: inline-size`), which is why it is given a width (360px on a desk, the column's on a phone) and never sized by its content. The words stand one over the other at every width ("tracks" over "planned"), so a cell is never wider than its figure.

**Wider figures.** The figure's size follows the card (12cqi). Tried in the prototype (Counts: 12, 1000, 0) at 320: "1000" at 30px sits in its 84px cell with 11px clear at its left and 15px at its right. A five-digit figure would break inside its cell (`overflow-wrap: anywhere`) and still not widen the page.

### 5.3 The list of sections (`nav.a-toc.cs-card[aria-label="On this page"]`)

`p.a-toc__h.cs-tab` "On this page", then the five links, as today. (`.toc-h` is no longer used by this page; `site.css` keeps it or loses it as a leftover, not in this unit.)

- **Layout 1, 861 and up.** A card 244px wide, `position: sticky; top: 114px` (its tab's top is then 82px down, just under the scroll padding's line), 6px padding. A link is a row at least 40px tall, 6px by 8px padding, 6px corners, 2px between rows, with a 9px square place at its left that is empty until the row is lit. States: rest `--ink`; hover `--cs-quiet` ground and `--ink-strong`; **lit** (`aria-current="location"`, set by the script) `--cs-here-wash` ground, `--ink-strong`, and the square filled `--cs-here` with a 1.5px `--cs-edge` ring; focus the site's 2px ring. A row's words do not move when it is lit.
- **Layout 1, 860 and down.** Not a card and not sticky: a row to swipe under the opening. The tab is hidden, as today. Each link is a chip 44px tall with a 2px `--cs-edge` edge, 8px corners, the card's paper, 8px between chips; the row runs to the screen's right edge (the nav's right margin is `-32px`), so a cut chip says there is more, and its scrollbar is not drawn. The lit chip shows the orange square before its words. **While the keyboard is in the row it wraps** (`ol:has(a:focus-visible) { flex-wrap: wrap; overflow: visible }`): Chromium does not scroll a row to a chip that is partly in view (measured: focus on "Credits" left it at x 272 to 349 in a 320px window), so without this a focused chip can be cut. With it, at 320, Tab through the five puts each chip whole between x 32 and 239, and the page is 156px taller only while focus is in the row. A finger never sees this.
- **Layout 2, every width.** A card, its tab on top, five rows with a 1px `--line` between them; a row is 40px tall on a desk and 44px at 860 and down, 18px side padding, `--ink-strong`; hover `--cs-quiet`; the focus ring is drawn 4px inside the row so the card's edge does not cut it. No lit state.

### 5.4 A section (`section.a-sec#what|lessons|facts|credits|privacy`)

- **Layout 1.** No card. `scroll-margin-top: 12px`; bottom padding `clamp(36px, 5vw, 64px)`; from the second on, a 1px `--cs-hair` line above and `clamp(28px, 4vw, 44px)` of air. The `h2` has 14px under it.
- **Layout 2.** `section.a-sec.cs-card`, 72px above each (the 44px tab plus 28px), padding `clamp(20px, 2.6vw, 36px)`; `scroll-margin-top: 54px`. Its `h2` is `cs-tab` with the page's own sizes (§4): `min-height: 44px`, 18px side padding, allowed to wrap, never wider than the card. Prose is at most 36em wide. At 860 and down the card's side margin is `-16px` and its padding 20px by 14px, so its edge is 16px from the screen's and its words stay on the column's own lines, 32px in, under the header's logo, and the tab's side padding is 14px.

### 5.5 How a lesson works

- **Layout 1.** `ol.a-steps`: 54px above the first card (its tab plus 20px), 48px between cards, 20px under. Each `li.cs-card` is a grid of 220px and the rest: `span.n.cs-tab` ("1 Watch"); `div.art` on the card's paper with a 2px `--cs-edge` line at its right; `div.body` with 18px by 22px padding. At 860 and down the figure's column is `clamp(110px, 22vw, 180px)` and the body's padding 14px by 16px. The note is `div.a-note.cs-card`: the clock, then the sentence, 14px by 16px padding, 14px under it.
- **Layout 2.** `ol.a-steps` is three equal columns with a 1px `--cs-hair` line above, below and between; 22px above, 26px under. Each `li`: the figure across the cell's top, then the body (4px by 22px padding, 20px under): `span.n` is a chip and a word, `<span class="n"><b>1</b> Watch</span>`, the `b` a 26px square with a 2px `--cs-edge` edge and 6px corners, 8px before the word; then the `h3` and the words. Under the three, `div.a-after`: two equal columns, the note at the left (`--cs-quiet` ground, 8px corners, no edge) and the last sentence at the right. At 860 and down: the parts stack, each a grid of `clamp(96px, 22vw, 180px)` for the figure and the rest, 14px above and below, a hairline between; the note, then the sentence.

### 5.6 Where the facts come from

**The sources fold, in both layouts.** The first three rows show; the other thirteen are behind a native `<details class="a-src__more">`, Home's pattern (D5): the summary is 48px tall with a 1px `--cs-hair` line above it, a 16px square with a plus (a minus once open), and the words "Show the other 13" (closed) or "Hide the other 13" (open). No script. The number is the list's length less three; with six sources or fewer there is no fold (as Home). A row is the short name (mono) and the title as the link; on a desk a grid of 11rem and the rest (the name was in 96px), 10px above and below, a 1px `--line` between rows; at 860 and down the name stands over the link, and the link's row is at least 44px tall.

- **Layout 1.** `div.a-facts`: the sentence beside the figure (260px), which is now in a flat card (`div.a-facts__art.cs-card`) because the re-tinted drawing is white paper on the grey ground; at 860 and down the figure is under the sentence, at most 340px wide. Then `div.a-src.cs-card`, 58px lower, with `h3.cs-tab` "Sources in the DHCP lesson", 6px by 22px padding (4px by 16px at 860 and down).
- **Layout 2.** `div.a-facts` is two equal columns: at the left the sentence, then the figure (at most 300px wide, no card: it is already on paper); at the right `div.a-src`, its `h3` a muted label, the rows, the fold. One column at 860 and down.

### 5.7 Credits

The paragraph, then `dl.a-credits` (96px for "Figures" and "Type", then the words; 12px above and below each row, a 1px `--line` between). Layout 1: the list is 18px under the paragraph with a `--cs-hair` line above it. Layout 2: `div.a-two`, two equal columns, the paragraph at the left and the list at the right; one column at 860 and down.

### 5.8 Your progress stays with you

The table keeps its markup, its caption and its words, and gains one wrapper, `div.a-savedbox`.

- **Layout 1.** The wrapper is a card (`cs-card`, `overflow: hidden`), 18px above and below. The caption is the card's head: `--cs-quiet` ground, 13px by 18px padding, a 2px `--cs-edge` line under it, Barlow 600 16px `--ink-strong`. Cells have 12px by 18px padding (12px at the sides at 860 and down).
- **Layout 2.** `div.a-two.a-keep`, two equal columns: at the left the paragraph, the analytics sentence when it is shown, "To start fresh…" and Reset; at the right the table, with no card (it is in one), its caption a muted label. The markup's order does not change (paragraph, table, sentences, Reset); the table is placed in the second column across the rows. One column at 860 and down, in the markup's order.
- **The marks**: "This browser only" a filled 9px `--ink-strong` square; "Not saved at all" an empty one with a 1.5px `--muted` edge. As today.
- **Reset progress** (the island, unchanged; `.a-reset` is 16px under the sentence in layout 1): **As loaded** one button, "Reset progress". **Asked** the question "Reset all progress on this device?" over "Reset" (filled orange) and "Cancel", 12px between; the group has the focus, its ring 6px out. **Cleared** the button again, with the focus, and "Progress cleared" 12px under it in green. **No JavaScript, or storage blocked**: no button; the sentence above still says clearing the browser's data does the same.

### 5.9 Focus, anchors, motion

`html { scroll-padding-top: 80px; scroll-padding-bottom: 12px }`, and below 960px `html:has(#menu-panel:not([hidden])) { scroll-padding-top: 403px }`: the open header is 391px tall on this page (five links and Start learning; the track page's is 329px), plus 12px. `html { scroll-behavior: smooth }` and its reduced-motion override stay as today. Nothing on the page moves by itself; the buttons press in as `card-stack.css` draws them.

## 6. The layout, by width

| Width | Layout 1, Column | Layout 2, Folders |
|---|---|---|
| 1440 | `.wrap` 1,240px. Opening: lede and a 360px counts card on one row. Body: 244px list, a gap of `clamp(28px, 6vw, 96px)`, a 46rem column. | Opening: the words and a 360px side column. Five cards 1,240px wide, two columns inside. |
| 961 to 1439 | The same; the gaps shrink with the window. | The same; the columns shrink. The three parts stay across down to 861. |
| 861 to 960 | The same; the header shows its menu button. | The same. |
| 860 and down | One column. Counts under the lede; the list a row to swipe; figures in a `clamp(110px, 22vw, 180px)` column. | One column. Counts, then the list card, under the lede; cards 16px past the column each side; figures in a `clamp(96px, 22vw, 180px)` column. |
| 375 | Column 311px. | Card 343px, its words 311px. |
| 320 | Column 256px; the counts card 256px, a cell 84px. | Card 288px, its words 256px. |

One breakpoint of the page's own, 860px, as today; 959px is the header's, used only for the open menu's scroll padding.

## 7. The page's length and weight, ruled (plan decision 4)

**The figures stay, all four, in both layouts.**

| | Gzipped HTML |
|---|---|
| Today | 51.4 KB |
| Layout 1 / layout 2, all four figures | 49.6 / 49.1 KB |
| Today's page without the three lesson figures | 21.2 KB |
| Today's page with no figure | 8.0 KB |

The four drawings are 43 KB of the page's 51 KB, and the page is a fifth of the 250 KB budget either way. They are kept because this is the one page that explains Watch, Learn and Practice and credits the drawings ("Figures: drawn for TechConcepts with Anatomy"); on Tracks and the track page they were dropped (2.89, 2.106) because each lesson's drawing repeated what its lesson shows, twenty at a time. Here each is in the HTML once.

What a reader cannot read in them, measured: each drawing's plate label ("WATCH · STEP 2 OF 4", "CHECKED · 2 SOURCES") is 0.7px tall at 110px wide, 1.4px at 220px and 1.9px in the sources figure at 300px. It is texture at every size the page draws, in both layouts and today. Each drawing's meaning is in its `aria-label` (the three parts) or is decoration beside the sentence it illustrates (`aria-hidden` on the sources figure's wrapper), as today. In layout 2 on a desk the three parts' figures are about 390px wide, the largest they are drawn anywhere on the site outside a lesson.

**The sources fold** (§5.6): the rule that takes the most length off the page. The thirteen folded rows are in the HTML and one press away; with them open the pages are 4,849 / 6,851px (layout 1, 1440 / 375) and 4,104 / 6,752px (layout 2), which for layout 1 at 1440 is today's length and 23px more, and is under today's everywhere else.

**The script.** Layout 1 keeps `src/scripts/about-toc.ts` as it is: its reading line (140px) is still under where a link lands a section (92px), and the list it lights is in view on a desk. Layout 2 removes it, with its eight tests and the page's `<script>` (5 elements become 4): no list stays in view to be lit.

## 8. Contrast, measured from what is drawn

Computed in the prototype from each element's own colour over the grounds actually behind it. Text needs 4.5 to 1; every pair passes.

| Pair | Layout 1, light / dark | Layout 2, light / dark |
|---|---|---|
| The line and the lede on the ground | 14.5 / 17.1 | 14.5 / 17.1 |
| The crumb's link on the ground | 5.0 / 6.8 | 5.0 / 6.8 |
| A count's figure / its words, on the card | 17.4 / 15.3; 6.0 / 6.1 | the same |
| An index tab's words | 17.4 / 15.3 | 17.4 / 15.3 (the section's name too) |
| The list's link; the lit link on its wash | 12.5 / 10.4; 15.1 / 12.9 | 17.4 / 15.3; no lit state |
| Prose | 10.5 / 11.6 on the ground | 12.5 / 10.4 on the card |
| A part's words; the note | 12.5 / 10.4 | 12.5 / 10.4; the note on `--cs-quiet` 11.0 / 9.4 |
| A source's name, its link, "Show the other 13" | 17.4 / 15.3 | 17.4 / 15.3 |
| "Sources in the DHCP lesson" | 17.4 / 15.3 (a tab) | 6.0 / 6.1 (a muted label) |
| "Figures", "Type" | 5.0 / 6.8 | 6.0 / 6.1 |
| The table's caption; its column heads; a cell | 15.3 / 13.8; 6.0 / 6.1; 12.5 / 10.4 | 6.0 / 6.1; 6.0 / 6.1; 12.5 / 10.4 |
| "Progress cleared" (`--allowed-text`) | 4.8 / 11.0 on the ground | 5.7 / 9.9 on the card |
| Reset progress, Cancel; Reset (white or dark on orange) | 17.4 / 15.3; 5.6 / 6.4 | the same |
| A card's edge against the ground (needs 3 to 1) | 14.5 / 11.6 | 14.5 / 11.6 |

The tightest pair is layout 1's "Progress cleared" on the ground in light, 4.76 to 1. `src/styles/green-text.test.ts` pins that colour against `tokens.bg`; in layout 1 it is drawn on `--ground`, as today.

## 9. Every word: new, changed, moved, removed

No sentence, heading, label, count or link of today's page is changed or removed.

| | Words | Where |
|---|---|---|
| **New** | "Show the other 13" and, once open, "Hide the other 13" (the number is the sources less three) | the fold's summary, both layouts; Home's words for the same control |
| **New**, not seen | "Sources 4 to 16", the folded list's `aria-label` | both layouts |
| **Moved** | "1 Watch", "2 Learn", "3 Practice" | layout 1: from a line inside each card to the card's tab. Layout 2: in place, the number in a chip |
| **Moved** | "Sources in the DHCP lesson" | layout 1: onto the card's tab |
| **Moved** | "On this page" | onto the list's tab. Layout 1 hides it at 860 and down, as today; **layout 2 shows it at every width** (new on a phone) |
| **Moved** | the five section names | layout 2: each `h2` is its card's tab |
| **Moved** | the list of sections | layout 2: from beside the sections into the opening |
| **Changed** | none | |
| **Removed** | none | |
| Not words | links are ink, not blue; the counts' words stand one over the other | both |
| Leaves the page's mark-up, not its words | `aria-current="location"` on the list | layout 2 (no script) |

The analytics sentence is unchanged and still shown only when the site has a token (the bar's "Analytics line" shows where it sits).

## 10. For the builder

The owner picks one layout at the gate; build that one only. The prototype's rules are in its third `<style>`: Part 1 is `card-stack.css` (import it, do not copy it), Part 2 is the page's own (the shared rules, then `.ab--1`, then `.ab--2`, then the 860px block), Part 3 is the prototype's bar (not built). Each layout's markup is in `<template id="pt-l1">` and `<template id="pt-l2">`, with `<!--fig:watch-->` where a figure goes.

**`src/pages/about.astro`, either layout**

- Import `../styles/card-stack.css` after `site.css`. Add About to that file's opening comment; change no rule in it.
- Replace the page's `<style is:global>` with Part 2's rules for the chosen layout (drop the other layout's block and the `.ab--N` prefix if you like; keep the values). `html { scroll-behavior }` stays; the two scroll paddings and the open-menu rule are new.
- Markup, as the template has it: `dl.stats.cs-card`; `nav.a-toc.cs-card` with `p.a-toc__h.cs-tab`; `div.a-savedbox` round the table; the sources as `ul` (first three) and `details.a-src__more` (the rest, with `aria-label` "Sources 4 to N"), `SHOWN = 3`, and no `details` when there are six sources or fewer; `.card` and `.toc-h` are no longer used here.
- The frontmatter's data does not change: `tracksPlanned`, `lessonsReady`, `coming`, `sources`, `factCheck`, `dhcp.title`. `src/lib/about.ts` does not change.
- `ResetProgress.tsx` does not change. `card-stack.css` draws its buttons.
- The header, the footer, `BaseLayout`, `global.css`, `site.css`, `tokens.ts` and `card-stack.css`'s rules do not change. Home, Tracks and the track page must render the same before and after.

**Layout 1 only**: `h3.cs-tab` on the sources card, `span.n.cs-tab` on each part, `cs-card` on each part, the note, the sources figure's wrapper, the sources and the table's wrapper. `src/scripts/about-toc.ts`, its tests and the page's `<script>` stay as they are.

**Layout 2 only**: the opening's two wrappers (`div.a-open__main`, `div.a-open__side`) with the `nav` inside the side; `section.a-sec.cs-card` with `h2.cs-tab`; `div.a-cols`, `div.a-after`, `div.a-two`, `div.a-keep`; `<span class="n"><b>1</b> Watch</span>`. Delete `src/scripts/about-toc.ts`, `src/scripts/about-toc.test.ts` and the page's `<script>`.

**Tests that change with the page** (for the spec review to hand out)

- `e2e/tracks-card-stack.spec.ts:618`: `/about`'s root scroll padding is `80px`, no longer `auto`. `:793-799`: `/about` now reads `--cs-edge`.
- `src/scripts/about-page.test.ts`: the facts section's sources are three rows and a fold; the counts' markup is unchanged.
- `e2e/site.spec.ts:907-935`: the table's and the reset flow's words are unchanged; a test that counts source links in view counts 3 (16 with the fold open).
- `src/styles/green-text.test.ts`: `.a-reset [role='status']` is still in `about.astro`'s styles, the same token.
- Layout 2: `about-toc.test.ts` goes with its script; the built page has 4 `<script>`.

**Things that look like choices and are not**

- The counts card must be given a width (it is a size container): 360px on a desk, the column's below 861. Sized by its content it collapses.
- The swipe row's wrap under keyboard focus (layout 1) uses `:has(a:focus-visible)`; it must not use `:focus-within`, which a tap would trigger.
- Layout 2's table is placed in the second column by `grid-column` and `grid-row: 1 / span 4`; the markup's order stays paragraph, table, sentences, Reset.
- The open menu's 403px is the header's height on this page plus 12px. If the menu's links change, the number changes with them (as the track page's 341px).

## 11. Acceptance checks

Each can be tried on the prototype (`#bar=0` hides the bar; `__d21.set({ pl, th, st, ct, an })` sets a state). **B** marks a check for both layouts, **1** and **2** one of them. Sizes are ±1px unless said.

**Words and structure**

1. **B** Every sentence of today's page is on the page, in today's order within its section: the text of each `section.a-sec`, with the fold open, equals today's, plus "Show the other 13" and "Hide the other 13".
2. **B** One `h1`, five `h2` in today's order with today's words, three `h3` in the parts, and "Sources in the DHCP lesson".
3. **B** The counts read 7, 30 and 0 with "tracks planned", "lessons ready", "accounts needed"; the first two equal the content's own counts.
4. **B** The list has five links, to `#what`, `#lessons`, `#facts`, `#credits`, `#privacy`, in that order, inside `nav[aria-label="On this page"]`.
5. **B** Three source rows are in view; the `details` is closed on load; opening it shows the other thirteen and its words become "Hide the other 13". With JavaScript off it opens the same way.
6. **B** No link in `main` computes to `--link`'s colour; every link is underlined except the list's and the crumb's.
7. **B** `getComputedStyle(document.documentElement).getPropertyValue('--cs-edge')` is not empty on `/about`; the header's and footer's computed styles equal `/tracks`'s.

**Width**

8. **B** At every width from 320 to 1440 (each pixel from 320 to 400, then every 16px, and 860, 861, 959, 960), light, `documentElement.scrollWidth` equals `clientWidth`. The same with the counts set to 12, 1000 and 0.
9. **B** At 320 the counts card is 256px wide and its third cell's right edge is at x 288; each figure's text is inside its cell.
10. **B** At 320, 375 and 390 the counts' words are two lines each; at 1440 too.
11. **2** At 320 no section's tab is wider than its card, and "Your progress stays with you" is on one line.

**Heights** (as loaded, light, ±40px; dark the same)

12. **1** 4,063 at 1440 × 900; 4,218 at 768 × 1024; 5,507 at 390 × 844; 5,653 at 375 × 812; 6,694 at 320 × 640.
13. **2** 3,364; 4,233; 5,377; 5,587; 6,344.
14. **B** With JavaScript off the page is shorter by the Reset row only (48px at 320: 6,646 and 6,296).

**Anchors and focus**

15. **B** At 320, 375, 390, 768 and 1440: opening `/about#what`, `#lessons`, `#facts`, `#credits` and `#privacy` puts the top of what is drawn for that section (layout 1: the section; layout 2: its tab) 92px from the window's top (±2), under the 68px header; or the page is at its foot.
16. **B** `/glossary`'s stamp and Home's "How a lesson is made and checked" land on `#facts` so.
17. **B** The root's `scroll-padding-top` is `80px`, and `403px` while `#menu-panel` is shown below 960px; `scroll-padding-bottom` is `12px`.
18. **B** Tab from the page's top to the footer, then Shift+Tab back, at 320 × 640, 375 × 812, 390 × 844, 768 × 1024 and 1440 × 900, `transitionsDone` after each press: the stops in `main` are, in order, the crumb, the list's five links, three source links, the fold's summary, Reset progress: **11**. At every stop the focus ring's box (the element's grown by 5px) has its top at or below the header's bottom and its foot at or above the window's. Measured: 6px or more clear.
19. **B** The same walk below 960 with the header's menu open (opened, then Tab on through its six links into `main`): no stop in `main` is under the open header (391px tall). Measured: 7px or more clear.
20. **B** With the fold open the walk has 24 stops in `main` and the same holds.
21. **1** At 320, 375 and 390, real Tab presses through the list's five chips: each focused chip's box is wholly between x 0 and the window's width (the row wraps while `:focus-visible` is in it); after focus leaves, the row is one line again. A tap on a chip does not wrap the row.
22. **1** At 1440 the list is sticky: scrolled to any section, its tab's top is 82px down, and no focused element in the reading column is under it (they are in different columns).
23. **2** No element on the page but the header is `position: sticky`.
24. **B** The crumb's link, each list link on a phone, each source link on a phone, the fold's summary and each button are at least 44px tall.

**The lit section (layout 1)**

25. **1** At 1440 exactly one list link has `aria-current="location"`: "What it is" at the top; each link once its section's top is 140px down or less; "Your progress" at the page's foot. The lit row has the orange square and the wash, and no row's words move when the mark does (each link's text keeps its x).
26. **1** With JavaScript off no link is lit and every link works.
27. **2** The built page has 4 `<script>` elements and no `aria-current` in the list.

**Reset progress**

28. **B** As loaded: one button, "Reset progress", 48px tall, a 2px edge and a 3px offset edge. Press it: focus is on the group named "Reset all progress on this device?", with "Reset" (filled `--cs-act`) and "Cancel". Cancel: the first button again, with the focus. Reset: "Progress cleared" in `--allowed-text` in the live region, focus on the button, and stored progress is gone.
29. **B** With JavaScript off, or storage blocked, there is no button and the sentence above it is unchanged.

**Look**

30. **B** Each card has a 2px `--cs-edge` edge and 10px corners (square at the top left under a tab); each tab is 34px tall (layout 2's section tabs at least 44px).
31. **B** The figures have no glow or rings (`--pool-op` and `--halo-op` are 0 in `main`), in light and dark.
32. **B** Every text pair in §8 is 4.5 to 1 or more, light and dark.
33. **B** Gzipped HTML is under 52 KB (measured 49.6 and 49.1 KB).
34. **B** Home, Tracks and both track pages are the same before and after, at 375 and 1440, light and dark.
35. **B** No time figure and no exam tag on the page (`site.spec.ts:365-370` still passes).

## 12. Decisions, one line each

1. Layout 2 is recommended: shorter at every phone width and by 699px at 1440, all five ways in on screen, a clean keyboard walk, one script fewer.
2. The counts are one card of three cells sized from the card's own width, their words one over the other: the only form that holds at 256px for any figure without a breakpoint.
3. The sources fold after three, with Home's control and words: one example was a third of the page.
4. The figures stay: 43 KB of a 250 KB budget, each in the HTML once, on the page that explains and credits them.
5. Things are cards and prose is not (layout 1); a section is a card and what is inside it is not (layout 2): no card stands inside another card in either.
6. Tabs carry names that are already on the page ("1 Watch", "On this page", a section's own heading): no word was written for a tab.
7. Orange is kept for the lit section and the one Reset button; the parts' numbers are ink, since they are an order, not a place.
8. Links are ink: `card-stack.css` has no link colour, and the other three pages have none.
9. The root's scroll padding is 80px, 403px under the open menu, and 12px at the foot: the only way a page can keep focus clear of a header it may not change (as the track page).
10. Section landings stay at 92px in both layouts, so `#facts` from the Glossary and Home lands where it does today.
11. The swipe row wraps only under keyboard focus (layout 1): a browser will not scroll it to a chip that is partly in view.
12. The lighting script stays untouched in layout 1 and goes in layout 2, where nothing stays in view to light.
13. The table keeps its `caption`; it is the card's head in layout 1, not an index tab, because a caption placed as a tab is not reliable across browsers.
14. The page's own breakpoint stays 860px.
15. On a phone layout 2's cards reach 16px past the column, so a card costs its words no width.

## 13. Open questions for the owner

1. **Which layout?** Layout 2, Folders, is recommended (§2).
2. **The sources fold** to three with "Show the other 13": new words on the page, and thirteen rows one press away. Unfolded, layout 1 is 4,849px at 1440 (today 4,826) and layout 2 4,104px. Keep the fold?
3. **In layout 2 the section names are 21 to 24px on their tabs** (30 to 42px today), and no section is lit while reading. Accepted with the layout?
4. **Links turn from blue to ink** on this page, as on the other Card stack pages. Said here because About and the Glossary are the pages with the most links.
5. **Not checked here:** the prototype was measured in Chromium only, in the app's browser pane; the keyboard walks were scripted (`focus()` in tab order) and the swipe row's wrap was tried with real Tab presses at 320 only. WebKit and Firefox are the build's to run.
