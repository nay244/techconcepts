# D21a: the Glossary in the "Card stack" look

Job 22, design unit D21a (direction 2.84, 2.110, 2.111; `plan.md` decisions 1 to 8). The Glossary page (`src/pages/glossary.astro`, at `/glossary`) in Card stack, colour variant A, as on Home (D17), Tracks (D18) and the track page (D20). Two layouts, for the owner to choose between at the gate: **layout 1, Ledger** (today's structure, restyled, fixed where measured; **recommended**) and **layout 2, Card file** (one letter's card on show at a time).

The prototype is `prototypes/d21-glossary.html`: one self-contained file, built from the page as it is today (`dist/glossary/index.html` at revamp 3f0e47c): its header, footer, fonts and Patch's tokens, then `src/styles/card-stack.css` as it is, then one block headed "D21". The dark bar at its top is the prototype's own: **Layout** (1 Ledger, 2 Card file) and **Theme**. The layout switch is two radio buttons read by CSS, so it works with JavaScript off; the theme switch and the header's two buttons (theme, menu) are worked by a short script after the header, and none of it is built. With JavaScript off the theme follows the system's. Site links in the header and footer point nowhere (the file has no server behind it); every link inside the page works. Resize the window for the widths.

(Written in parts as the work went; every section below is final.)

## 1. What the page must still say, and what it said badly

Fixed by the brief, whatever the layout: every term (105) and every definition (110), word for word; each definition's sources as links and its "Described in" line; the 48 spelling pointers; the 26 letters, the six with no term dashed (G, Q, V, X, Y, Z); the stamp and its link to `/about#facts`; every anchor (`#letters`, `#letter-x`, each entry's id, each pointer's target) landing clear of whatever is stuck to the top of the window; no `<script>` in the page, and the same HTML and the same look with JavaScript off. The header and footer do not change, nor `src/styles/tokens.ts`, nor one rule of `card-stack.css`.

Measured today (revamp 3f0e47c, the built page served from `dist/`, headless Chromium, light, fonts loaded):

| | 1440 × 900 | 768 × 1024 | 390 × 844 | 375 × 812 | 320 × 640 |
|---|---|---|---|---|---|
| Page height | 20,847px | 30,929px | 48,737px | 50,158px | 57,255px |
| Sideways scroll | none | none | none | none | none |
| The definitions' own text | 11,853px | 13,851px | 21,060px | 22,059px | 26,865px |
| The 110 "Sources" lines | 5,408px | 6,116px | 8,712px | 9,064px | 10,932px |
| The 48 pointers | 2,151px (43 each) | 2,776px | 4,529px | 4,529px (95 each) | 4,620px |
| The 20 letter bars | 1,120px | 1,200px | 1,200px | 1,200px (60 each) | 1,200px |
| Tab stops in `main` | 473 | 493 | 493 | 493 | 493 |

Of the 493 stops, 404 are source links (3.7 a definition), 48 are pointers, 20 are keys, 20 are "All letters" (not shown from 1280px) and one is the stamp. The page is 34.6 KB gzipped (213,197 bytes raw).

What is wrong besides the look:

- **The phone's page is 62 screens long** (50,158px at 375 × 812). 44% of it is the definitions' text, 18% the "Sources" lines (a line of links is 44px tall to a finger, and only 42 of the 110 lines fit one line at 375), 9% the pointers, each of which spends 95px to say "see another word".
- **The page's side gutter is 32px at every width**, so a 375px phone gives the definitions 311px. Tracks gives its cards a 14px gutter at the same width.
- **The held test `e2e/glossary.spec.ts:143` cannot pass on today's page, and not for the reason on record.** It scrolls the window until the middle of the last letter's section is at the top of the window, then wants that letter's bar at 68px. Measured at 375 × 812: W's section is 147.8px tall (a 60px bar and one pointer row); the scroll asked for is 18px beyond the page's end, so the window stops at 49,346px; the section then spans −56px to 92px, wholly behind the 69px header, and its bar is at 31.6px. Even on a longer page the bar would be at 13.6px. A sticky bar cannot leave its own section: for the test's scroll to find it at 68px a section must be at least twice (68px + the bar's height) tall, 256px today. The test's premise fails for any short letter; the bar is doing what a letter's bar should (section 5.3 rules on it).
- **Keyboard focus has no rule keeping it clear of the sticky header and the sticky bar** (2.89's follow-up): the page's scroll padding is `auto`.
- The term's name is on "label tape" (a bordered tile), the letter is a filled tile and the source links are Patch's blue: Patch's parts, on a page that is to wear Card stack.

## 2. The two layouts

Both wear the same parts (section 5) and share every rule of layout 1; layout 2 adds about 20 lines of CSS, one key and one class.

### Layout 1, Ledger (recommended)

**The idea: today's page, each letter a card with its letter on an index tab.** The head, then the 26 keys, then one card a letter, one row a term: the term, its definitions, their sources and "Described in". The whole glossary is on the page.

```
375                                1440
┌───────────────────────┐          Glossary
│ Glossary              │          lead, note, stamp
│ lead, note, stamp     │          [A][B][C][D] … [Z]   26 keys, one row, stuck under the header
│ [A][B][C][D][E][F][G] │          ┌─┐
│ [H][I][J][K][L][M][N] │          │A│
│ [O][P][Q][R][S][T][U] │          ├─┴──────────────────────────────────────────────┐
│ [V][W][X][Y][Z]       │          │ A record   An A record is a DNS …   Sources …  │
│ ┌──┐      All letters │          │                                     Described in│
│ │A │                  │ stuck    ├────────────────────────────────────────────────┤
│ ├──┴────────────────┐ │ under    │ ACK        In TCP …                 Sources …  │
│ │ A record          │ │ the      │            ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│ │ An A record is a… │ │ header   │            In DHCP …                Sources …  │
│ │ Sources RFC 1035… │ │          ├────────────────────────────────────────────────┤
│ │ Described in …    │ │          │ Address Resolution Protocol   See ARP          │
│ ├───────────────────┤ │          └────────────────────────────────────────────────┘
│ │ ACK …             │ │
```

What changes from today, besides the look:

- **The markup of `main` does not change by a character.** Every change is in the page's `<style>`, plus the page's scroll padding.
- A pointer is one line (the spelling, then "See" and its link) at every width: 45px on a phone, from 95px.
- The page's gutter is 14px to 599px wide (Tracks' number), from 32px; the letter bar is 48px, from 60px; the definition's line is 26px, from 27px.
- The letter's bar and the keys keep where and when they stick (the bar below 1280px, the keys from 1280px).
- Keyboard focus has a rule: nothing focused lies under the header, the bar or the keys (section 5.6).

### Layout 2, Card file

**The idea: an index-card file. One letter's card is on show; the keys are its dividers.** With nothing chosen the file is open at the first letter, and its key is the ink tile. A key shows that letter's card and nothing else. A pointer ("See TTL") or an address with a term in it (`/glossary#ttl`) shows that term's letter, the term tinted. "All letters", which is also the last key, lays every card out as in layout 1. There is no script: the address says what is on show, read by CSS (`:target` and `:has()`), so the HTML is the same with JavaScript off, and Back steps through the letters visited.

```
375, on arrival                    375, after the T key
│ [■A][B][C][D][E][F][G]│          │  (the keys have scrolled away)   │
│ [H][I][J][K][L][M][N] │          │ ┌──┐                 All letters │
│ [O][P][Q][R][S][T][U] │          │ │T │                             │
│ [V][W][X][Y][Z][All letters]│    │ ├──┴───────────────────────────┐ │
│ ┌──┐      All letters │          │ │ TCP …                        │ │
│ │A │                  │          │ │ … T's 14 rows, then the foot │ │
│ ├──┴────────────────┐ │
│ │ A's 6 rows        │ │
│ └───────────────────┘ │
│ footer                │
```

### What each fixes, measured

Headless Chromium, light, the prototype's own bar subtracted. Layout 2's figures are on arrival unless marked.

| | Today | Layout 1 | Layout 2 |
|---|---|---|---|
| Page height, 1440 × 900 | 20,847px | 20,300px | 1,966px (longest letter, P: 3,615px; all letters: 20,300px) |
| Page height, 768 × 1024 | 30,929px | 30,972px | 2,604px (P: 5,118px) |
| Page height, 390 × 844 | 48,737px | 43,702px | 3,348px (P: 7,149px) |
| Page height, 375 × 812 | 50,158px | **45,324px** | **3,425px** (P: 7,347px; W: 1,445px; all letters: 45,324px) |
| Page height, 320 × 640 | 57,255px | 52,004px | 3,773px (P: 8,313px) |
| Sideways scroll, 320 to 1440 | none | none | none |
| Tab stops in `main`, 375 | 493 | 493 | 40 on arrival (all letters: 494) |
| Terms the browser's own "find in page" can reach | 153 of 153 rows | 153 of 153 | 6 of 153 on arrival (all 153 after "All letters") |
| Works without `:has()` | yes | yes | falls back to every letter shown, no key marked |
| `main`'s HTML the same with JavaScript off | yes | yes | yes |

### The recommendation: layout 1, and what layout 2 buys

**Layout 1.** A glossary is used two ways: to look a word up, and to be searched. To look a word up the two layouts cost the same: one key, then a scroll inside that letter. To be searched they do not: on layout 2 the browser's find reaches only the letter on show (6 of 153 rows on arrival), and it fails without saying why. Layout 1 also keeps the page's markup as it is, needs no CSS that an older browser lacks, and reads on from one letter to the next.

**What layout 2 buys:** a phone's page of 3,425px on arrival instead of 45,324px (the longest letter 7,347px), 40 Tab stops instead of 493, the footer one or two swipes from any term, and a key that shows where you are. Its price is the find above, a state held in the address (a reader who shares `/glossary#letter-t` shares T alone), and that a screen reader is not told which key is on show (CSS cannot set `aria-current`; the card's heading says the letter).

## 3. Tokens, and the shared Card stack stylesheet

**No new token, no new colour, and no line of `src/styles/card-stack.css` changes.** The page imports it and reads its `--cs-*` names and Patch's tokens; nothing goes into `src/styles/tokens.ts`. The ground is `--ground`.

| Part of `card-stack.css` | Result on this page |
|---|---|
| The tokens (`--cs-edge`, `--cs-card`, `--cs-quiet`, `--cs-hair`, `--cs-r`, `--cs-r-in`, `--cs-here`, `--cs-here-wash`) | read by the page's own rules; `--cs-edge` is the ink in the light and the light line in the dark, so every edge here follows |
| `main .btn`, `main .btn--primary` | reach nothing: the page has no button |
| The figure tint (`main, .lm-defs { … }`, `#main .lm-svg { … }`) | reaches nothing: `main` holds no drawing. The stamp's tick is not a figure and keeps `--allowed-text` |
| `.cs-card`, `.cs-tab` (opt-in classes) | not used: see below |

**The brief says `card-stack.css` re-tints buttons and links in `main`. It re-tints buttons and figures; it has no rule for a link.** On Home, Tracks and the track page each page's own styles make its links ink with an underline. This page does the same in its own `<style>` (`a.gl-src`, `.gl-see a`, `.gl-up`): `--ink-strong`, underlined in `--cs-hair` at 1.5px, 3px under the words, the underline turning ink on hover. Patch's blue (`--link`) leaves the page.

**The letter's card and tab are the page's own rules, with the stylesheet's values, not its classes.** `.cs-card` draws a whole edge with four round corners and `.cs-tab` hangs above it, outside the card's box. Here the tab must stay under the header while its card scrolls (section 5.3), so the tab stands in a sticky bar, on a rule that is the card's top edge, and the card (`dl.gl-list`) has no top edge of its own. Same numbers: a 2px `--cs-edge` edge, `--cs-r` (10px) corners on the card, `--cs-r-in` (8px) on the tab and the keys, `--cs-card` paper. Nothing is added to `card-stack.css` (as D20 ruled for the track page).

## 4. Type

The site's families in their Patch roles, as D17, D18 and D20. No mono on this page.

| Use | Face | Size / line | Colour |
|---|---|---|---|
| h1 "Glossary" | Barlow Semi Condensed 700 | 64px / 1, `-0.012em` (44px to 599px wide) | `--ink-strong` |
| The lead | Atkinson Hyperlegible Next 400 | 20px / 1.4, max 30em (18px to 599px) | `--ink-strong` |
| The note | Atkinson 400 | 16px / 1.55, max 40em | `--ink` (was `--muted`) |
| The stamp | Barlow 600 | 15px / 1.3 (`site.css`'s `.stamp`, sized by this page as today) | `--ink`, its tick `--allowed-text` |
| A key | Barlow 700 | 19px / 1 | `--ink-strong`; an empty letter 600, `--muted` |
| "All letters" as a key (layout 2) | Barlow 600 | 16px / 1, `0.01em` | `--ink-strong` |
| The letter on its tab (h2) | Barlow 700 | 24px / 1 | `--ink-strong` |
| "All letters" in the bar | Barlow 600 | 15px / 1, `0.02em`, underlined | `--ink-strong` |
| A term's name | Barlow 700 | 20px / 26px, `0.005em` (was 19px on a tile) | `--ink-strong` |
| "Also called" and the spellings | Atkinson 400; the spellings 500 | 15px / 1.4 | `--muted`; the spellings `--ink` |
| A meaning's name ("In TCP") | Barlow 700 | 17px / 1.25, `0.01em` | `--ink-strong` |
| A definition | Atkinson 400 | 17px / 26px, max 36em (the line was 27px) | `--ink-strong` |
| "Sources", "Described in", "See" | Barlow 600 | 15px / 20px, `0.02em` | `--muted` |
| A source, a pointer's target | Barlow 600 | 15px / 20px, underlined | `--ink-strong` (was `--link`) |
| The tracks | Barlow 600 | 15px / 20px | `--ink` |
| A pointer's spelling | Barlow 600 | 18px / 26px | `--ink` |

The definition stays at 17px, the site's reading size. At 16px / 25px the phone's page would be 2,057px shorter at 375 (4.5%, measured); that is not worth a smaller reading size on the one page that is all reading.

## 5. Components and their states

The class names are today's. Sizes are CSS pixels; the exact rules are the D21 block of the prototype.

### 5.1 The head (`div.gl-head`)

The h1, the lead, the note and the stamp, in today's order and words, left-aligned. `.gl` has 40px above it (28px to 599px wide) and 80px below. The stamp is today's link to `/about#facts`, 44px tall; hover underlines it (`site.css`, unchanged).

### 5.2 The keys (`nav#letters.gl-az`)

Twenty-six keys in a grid: 6 columns to 374px wide (4px gap), 7 from 375px (5px), 13 from 600px (6px), 26 in one row from 1280px (2px). A key is 44px tall and at least 44px wide in layout 1 at every width measured (45.3 at 320 and 375, 48.6 at 768, 44.8 at 1280, 45.8 at 1440).

| State | Looks |
|---|---|
| A letter with terms (`a.gl-key`) | `--cs-card` paper, a 2px `--cs-edge` edge, 8px corners, the letter in `--ink-strong` |
| Hover | the paper turns `--cs-quiet` |
| Pressed | moves 1px right and down (no transition) |
| Focus | the site's ring: 2px `--focus`, 3px off |
| A letter with no term (`span.gl-key--none`) | the look's "not there yet": the edge dashed, no paper, the letter 600 in `--muted`; not a link, and "G, no terms" to a screen reader, as today |
| On show (layout 2 only) | the ink tile: `--cs-edge` fill, the letter in `--cs-card` |

From 1280px the keys stick under the header (`top: 68px`, `z-index: 6`), on a full-width strip of `--ground` with 10px above and below and a 1px `--cs-hair` line under it: 65px tall, its foot at 133px. Below 1280px they scroll away, and "All letters" brings them back.

### 5.3 A letter's tab and bar (`div.gl-bar`), and how it leaves

`section.gl-letter` holds the bar and the card, 28px under the card before it. The bar is 48px tall, a full-width strip of `--ground`: at its left the letter on an index tab (`h2`: 38px tall, at least 48px wide, a 2px edge on three sides, 8px top corners, `--cs-card` paper), at its right "All letters" (a 44px link to `#letters`), and along its foot a 2px `--cs-edge` rule as wide as the card. The tab stands on the rule and covers it, so the tab and the card are one piece of paper. The rule is the card's top edge.

**Below 1280px the bar sticks at 68px** (`position: sticky; top: 68px; z-index: 5`), so the letter and the way back to the keys stay in sight while that letter's rows pass under it. **From 1280px it does not stick** (the keys do), and "All letters" is not shown.

**At the end of a letter the bar leaves with its card.** It stays at 68px for as long as its section still reaches 48px below the header; then it rides out on the card's last edge. It is never over another letter's rows, and no row of its own letter shows while the bar is hidden: the bar covers the last row as both go. Walked every 5px through A (2,073px tall), J (305px), P (5,996px, the tallest) and W (94px, the shortest) at 375 × 812 and 320 × 640: 0 positions out of 1,870 and 2,116 break the rule. A short letter gets the same bar for less time: W's sticks for 45px of scroll.

**So `e2e/glossary.spec.ts:143` is answered by changing the test once, not the bar** (plan decision 5). As written it cannot pass on a 94px section: with the section's middle at the window's top the whole section is behind the header (it would need to be 232px tall), and at 375 × 812 the scroll it asks for is 36px past the page's end (bar at 35.3px, measured on the prototype). No design should pad a one-row letter to four rows to satisfy it. The test becomes these three, at 375 × 812:

1. **A long letter holds its bar.** Find the tallest `section.gl-letter` by measuring. Scroll its middle to the window's top. Its `.gl-bar` is at 68px, within 1px. (Prototype: P, 68.0px.)
2. **The last letter's bar is reachable and works.** Click the last letter's key. That letter's `.gl-bar` is wholly below the header's foot and inside the window (prototype: 80px). Click "All letters" in it: `#letters` is in the window.
3. **The last letter's bar leaves with its card.** Scroll from 200px above the last section to the page's end in 8px steps. At each step, with `s` the section's box and `b` the bar's: if `s.bottom − 68 ≥ b.height`, then `b.top` is `max(68, s.top)` within 1px; otherwise `b.bottom` is `s.bottom` within 1px.

Layout 2 uses the same bar and the same three tests; test 3 then runs with "All letters" on show (`/glossary#letters`), and test 2's click shows W alone.

### 5.4 The card (`dl.gl-list`) and a row (`div.gl-entry`)

The card: `--cs-card` paper, a 2px `--cs-edge` edge at the sides and foot, none at the top (the bar's rule), 10px corners at the foot. Rows are divided by a 1px `--line` rule; the first row has none.

A row, to 639px wide: 14px padding (6px under), the term (`.gl-name`: plain bold words, no tile), "Also called" under it when the term has other spellings, then each definition 6px under: the meaning's name when there are two ("In TCP"), the definition, the "Sources" line, the "Described in" line. Two meanings are divided by a 1px dashed `--cs-hair` rule. Each source is a 44px-tall link that opens in a new tab, with today's `title` and `aria-label`. "Described in" is plain words, 26px for one line and 20px a line more, as today.

From 640px the term stands in a column of its own (180px; 220px from 960px; 280px from 1200px) with the definitions beside it, and the row's padding is 14px by 20px. From 960px each definition is two columns: the words (to 36em), and the "Sources" and "Described in" lines beside them (220px; 300px from 1200px). With a mouse from 960px a source link is 26px tall and "Described in" is 4px under "Sources", as today; a finger keeps 44px.

**A pointer** (`div.gl-entry--see`) is one line at every width: the spelling (600, 18px, `--ink`: lighter than a term, since it is not one) and then "See" and the term it points to, a 44px link (34px with a mouse from 960px). 45px a row on a phone where it fits one line (it wraps to 73px for the longest spellings at 375); 35px from 1200px.

| State | Looks |
|---|---|
| A row | as above |
| **Landed on** (`.gl-entry:target`: a pointer followed, or an address with the term in it) | the row's paper turns `--cs-here-wash` and a 4px `--cs-here` bar runs down its left edge (an inset shadow, as today; 3px today) |
| Link hover | the underline turns from `--cs-hair` to the words' colour |
| Link focus | the site's ring |

### 5.5 Layout 2 only: what is on show

Read from the address, by CSS, inside `@supports selector(:has(a))`:

| The address | On show | Key marked |
|---|---|---|
| `/glossary` (nothing chosen, or a target outside the letters, such as the skip link's `#main`) | the first letter's card | the first letter's (`.gl-key--first`) |
| `#letter-t` (a key) | T's card | T |
| `#ttl` (a pointer followed, or a shared address) | T's card, TTL tinted | T |
| `#letters` ("All letters": the last key, and the link in every bar) | every card, as layout 1 | "All letters" |

The "All letters" key is a 27th item in the keys' list: it spans 4 columns to 374px, 2 from 375px (filling the last row beside Z), 3 from 600px (a third row), and is its own column at the right from 1280px (where the letter keys narrow to 41.4px at 1280 and 42.4px at 1440; 44px tall). A browser without `:has()` shows every card and marks no key.

### 5.6 Keyboard and focus

Tab order is the page's order: the stamp, the keys, then for each letter its "All letters" (below 1280px), and each row's links. Nothing is added to it or taken out in layout 1 (493 stops in `main` below 1280px, 473 from 1280px); layout 2 has 40 on arrival at 375.

**The rule: nothing focused lies under the header, a stuck bar or the stuck keys.** `html` has `scroll-padding-top: 80px` (the header's 69px and 11px, the number `/tracks` and the track pages use), and 403px while the header's menu is open (the open header measures 391px from 320 to 959px wide on this page: five links and "Start learning"; if the menu's links change, this number changes with them). Each thing that can be scrolled to adds what else is stuck above it: a row and each link in a row `scroll-margin-top: 56px` (the 48px bar and 8px) below 1280px and 66px (the 65px keys) from 1280px; a letter 0 below 1280px (its bar lands at 80px) and 58px from 1280px; the keys 4px.

Measured by walking every stop with Tab from the stamp and with Shift+Tab from the footer, at 320 × 640, 375 × 812, 390 × 844, 768 × 1024 and 1440 × 900, the menu closed and (below 960px) open: **0 focused elements hidden, in both layouts** (layout 2 on arrival and with all letters on show). The same walk on today's page with Shift+Tab hides 163 of 493 at 375 and 139 of 473 at 1440.

Where anchors land (measured, both layouts, 320 to 1440): a key puts its letter's bar at 80px below 1280px (the test at `:112` wants 68 to 80) and at 138px from 1280px, under the keys' foot at 133px; a row lands at 136px (the stuck bar's foot is 116px) and at 146px from 1280px; "All letters" puts the keys at 84px.

## 6. The layout, by width

| Width | Gutter | Keys | Bar | A row |
|---|---|---|---|---|
| 320 to 374 | 14px | 6 columns | sticks at 68px | stacked; text 260px wide at 320 |
| 375 to 599 | 14px | 7 columns | sticks | stacked; text 315px wide at 375 (311px today) |
| 600 to 639 | 32px | 13 columns | sticks | stacked |
| 640 to 959 | 32px | 13 columns | sticks | term 180px, definitions beside |
| 960 to 1199 | 32px | 13 columns | sticks | term 220px, words, sources 220px |
| 1200 to 1279 | 32px | 13 columns | sticks | term 280px, words, sources 300px |
| 1280 and up | 32px (`.wrap` to 1304px) | 26 in a row, stuck at 68px | does not stick; no "All letters" | as 1200; the words 552px wide at 1440 |

Every breakpoint is one of today's, except that the keys go to 6 columns below 375px (today below 360px), so a key is never narrower than 44px. No sideways scroll at 320, 375, 390, 768, 1280 or 1440, at the top or the foot of the page, in either layout, with JavaScript on or off.

Light and dark are the same drawing: every edge is `--cs-edge`, which is the ink in the light and the light line in the dark.

## 7. The page's length and weight: ruled

**Length on a phone (plan decision 4). Layout 1 is 45,324px at 375 × 812, from 50,158px: 4,834px shorter (9.6%). It stays a long page, on purpose.** What it is made of now, and what was and was not cut:

| At 375 | Today | Layout 1 | How |
|---|---|---|---|
| The definitions' text | 22,059px | 20,982px | a 14px gutter gives the words 315px, not 311px; the line is 26px, not 27px |
| The 110 "Sources" lines | 9,064px | 9,064px | not cut (below) |
| The 48 pointers | 4,529px | 2,270px | one line each |
| The 20 bars | 1,200px | 960px | 48px, not 60px |
| The head | 319px | 294px | the gutter |
| The rest (terms' names, "Also called", "Described in", padding, the keys, the gaps, the footer) | 12,987px | 11,754px | no tile round a name; tighter rows |

**Sources do not fold.** Folding each definition's sources behind a "Sources" control would save 4,224px at 375 (9,064px less 110 controls of 44px: 9.3% of the page) and take 404 Tab stops down to 110. It would also hide, on every definition, the one thing the page's lead promises ("each one checked against its sources"), and add a tap to see what a definition stands on. The names themselves ("RFC 1035", "ITU-T X.200") tell a reader what kind of ground a definition has before any tap. Not worth 9%.

**The reading size stays 17px.** 16px / 25px would save 2,057px at 375 (4.5%).

**Why a long page is right here:** it is a reference, entered by a key and left by "All letters", which the stuck bar keeps in reach on every screen of it; no reader is asked to scroll it end to end. Keeping it whole is what lets the browser's find reach every term. If the owner wants the phone's page short above all, that is layout 2 (3,425px on arrival), at the price in section 2.

**Weight.** The page's HTML does not change in layout 1 (`main` is today's markup): 213,197 bytes, 34.6 KB gzipped, as measured by S23. Layout 2 adds one list item and one class, about 110 bytes. The page's own CSS goes from 4,744 bytes minified (1.35 KB gzipped) to about 5,470 bytes (1.54 KB), plus about 2,680 bytes (0.6 KB) for layout 2; and the page now loads `card-stack.css` (3,405 bytes minified, 1.1 KB gzipped). No script, no figure, no new font. Far inside the 250 KB budget either way. (The prototype file is 387 KB, 144 KB gzipped, because it carries six fonts and both stylesheets inline.)

## 8. Contrast, measured from what is drawn

Read from the prototype's computed colours, each over the paper it sits on (a wash is blended first). Light, then dark.

| Words | On | Light | Dark |
|---|---|---|---|
| h1, the lead, "All letters" in the bar | ground | 14.51 | 17.05 |
| The note, the stamp | ground | 10.45 | 11.59 |
| A key's letter, the tab's letter, a term, a definition, a source link, a pointer's link | card | 17.39 | 15.34 |
| An empty key's letter (`--muted`) | ground | 5.03 | 6.83 |
| The key on show (layout 2) | the ink tile | 17.39 | 10.43 |
| "Also called", "Sources", "Described in", "See" (`--muted`) | card | 6.02 | 6.14 |
| The spellings, a pointer's spelling, the tracks (`--ink`) | card | 12.53 | 10.43 |
| Landed on: the term, the meaning's name, the definition, a source link | the wash | 15.08 | 12.87 |
| Landed on: the tracks | the wash | 10.86 | 8.75 |
| Landed on: "Also called", "Sources", "Described in" (`--muted`) | the wash | 5.22 | 5.15 |

Every word is 4.5:1 or better in both themes; the lowest is the empty key's letter at 5.03.

| Not words | Against | Light | Dark |
|---|---|---|---|
| The card's, the tab's and a key's edge (`--cs-edge`) | ground | 14.51 | 11.59 |
| The landed-on bar (`--cs-here`) | card | 5.42 | 5.64 |
| The stamp's tick (`--allowed-text`) | ground | 4.76 | 10.97 |
| **A link's underline (`--cs-hair`)** | card | **2.16** | **2.26** |

The underline is under 3:1. It is the look's own underline, the same on Home, Tracks and the track page, and here a link is also told from the grey label before it by its ink colour and weight. Changing it is a decision about the look on all four pages, not about this one: open question 3.

## 9. Every word: new, changed, moved, removed

**Layout 1: none.** Not a word of the page is new, changed, moved or removed, to the eye or to a screen reader: "Glossary", the lead, the note, the stamp's line, the 26 letters and "X, no terms", "All letters", every term, "Also called", every definition, "Sources" and each source's name, title and label, "Described in" and the tracks, "See". The page's title and description are as they are.

**Layout 2: one.**

| | Words | Where |
|---|---|---|
| New | "All letters" | a second place for words the page has: the last key in the keys' list, a link to `#letters` (the first place, each letter's bar, stays) |

No definition's word changes in either layout, so no fact-check is needed.

## 10. For the builder

Files: `src/pages/glossary.astro` (its `<style is:global>` and one import), and the tests named below. `GlossaryEntry.astro` and `GlossaryStamp.astro` do not change; `GlossaryKeys.astro` changes only for layout 2. No change to `src/lib/glossary*.ts`, the content, `site.css`, `card-stack.css`, the header or the footer.

**Layout 1 (if chosen):**

- `glossary.astro`: add `import '../styles/card-stack.css';` after `site.css`. Replace the whole `<style is:global>` block (`:44-152`) with the prototype's D21 block: everything from the comment `D21: the Glossary in the Card stack look` down to, and not including, the comment `layout 2`. Copy it as it stands; it is written for this file. The markup (`:18-41`) does not change.
- The two `html` rules at the top of the block are the page's scroll padding. They are global by `is:global`, and they reach only this page because Astro ships the block with this page alone (as today's block is). Check 14 pins it.
- Nothing else: no script, no island, no new component.

**Layout 2 (if chosen): layout 1, and then:**

- Add the prototype's `layout 2` rules after the D21 block, without the prototype's wrapper (`:root:has(#p-l2:checked) { … }` is the prototype's switch; the rules inside it are the page's, as they stand).
- `GlossaryKeys.astro`: after the last letter's `<li>`, add `<li class="gl-az__all"><a class="gl-key gl-key--all" href="#letters">All letters</a></li>`; and give the first key that is a link the class `gl-key--first`.
- The 26 selectors that mark the key on show are written out for a to z in the block (one rule, a list of selectors); a "0–9" group, if the glossary ever gets one (`src/lib/glossary.ts:105-111`), needs its own line.
- The prototype's rules `.gl-az__all { display: none }` and `:root:has(#p-l1:checked) .gl-az__all { … }` are the prototype's own and are not built.

**Tests that change, once each, with the reason:**

| Test | Change | Why |
|---|---|---|
| `e2e/glossary.spec.ts:143-154` | replaced by the three tests of section 5.3; no longer held | the scroll it asks for cannot find any bar on a section under 232px, and W is 94px |
| `e2e/tracks-card-stack.spec.ts:612-621` | `/glossary` moves from the `auto` list to a line of its own: `80px` | the page now has the rule the test is about |
| `e2e/glossary.spec.ts`, the `@visual` loop | new snapshots | the look |
| `src/lib/glossary-page.test.ts` (21) | any test that reads the old style block's text (the tile's border, `--link`, `margin-inline: -16px`, `repeat(…)` at 359px, `scroll-margin-top` values) is changed to the new values | the block is replaced |
| Layout 2 only: `:51-71` (links in `main`), `:112-141` (keys), `:289-314` (no JavaScript) | counts and reads are taken with `#letters` in the address, or rewritten for one letter on show | most rows are not rendered on arrival |

**Tests that should pass unchanged in layout 1** (each number re-measured on the prototype): `:73-82` and `:98-110` ("See TTL" lands `#ttl` at 136px under a 116px foot at 375, 146px under 133px at 1440, tinted by an inset shadow); `:112-141` (a key puts the bar at 80px at 375; Tab from the bar reaches "All letters"; at 1440 the bar is under the keys); `:156-164` (no sideways scroll); `:166-169`; `:171-201` (stacked at 375; the term beside the definition at 768; the words 552px wide at 1440; a 220px term column at 960; 280px and a 300px sources column at 1200); `:203-262` (every link, the stamp and "All letters" 44px to a finger at 375, 768 and 1024, no two link boxes overlapping; "Described in" 26px and 20px a line more; keys 44px or more at 375); `:264-269` (26px links and a 34px pointer link with a mouse at 1440); `:271-287` ("Described in" 4px under "Sources", `--ink`, 600, no underline); `:289-314` (the same `main` with JavaScript off); `:316-322`. If one of them fails, the build is wrong, not the test.

**Keyboard, motion, waits (plan decision 7).** The page has no transition and no animation (the keys' 150ms hover fade is gone; a pressed key moves with no transition), so a `reduced-motion` run reads the same page; use `transitionsDone` after a click, scroll or focus change all the same. The walks of section 5.6 are checks 9 and 10.

## 11. Acceptance checks

Each can be tried on the prototype (layout by the bar's switch) and turned into a test. "Foot" means the lowest edge of whatever is stuck to the window's top: the header, plus a letter's bar or the keys when stuck.

**Both layouts**

1. `main`'s HTML holds 105 terms, 110 definitions, 48 pointers, 404 source links, 20 keys that are links and 6 that are not (G, Q, V, X, Y, Z), and the stamp linking to `/about#facts`. Every definition's text equals the data's, character for character.
2. `main` has no `<script>` and no `astro-island`, and its HTML with JavaScript off equals its HTML with it on. The page has as many `<script>` elements as today (2).
3. No sideways scroll at 320, 375, 390, 768, 1280 and 1440, at the top and at the foot of the page, light and dark, JavaScript on and off.
4. Page height in layout 1, light, within 1%: 20,300px at 1440 × 900; 45,324px at 375 × 812; 52,004px at 320 × 640 (30,972px at 768 × 1024; 43,702px at 390 × 844).
5. At 375, 768 and 1024 with a finger: every source link, pointer link, "All letters" and the stamp is 44px tall or more, and no two link boxes overlap. Every key is 44px tall, and 44px wide or more at 320, 375, 768, 1280 and 1440 in layout 1.
6. A pointer row is one line: 45px tall at 375 where its words fit one line (the first, "Address Resolution Protocol", is), and its spelling and its "See" share a baseline row.
7. Anchors, at 320, 375, 390, 768, 1280 and 1440: after a key (the first, D, J and the last), that letter's bar is wholly below the header (and below the keys from 1280px) and inside the window; after "See TTL", `#ttl` is in the address, the row's top is below the foot, inside the first screen, and the row has an inset shadow; `#web-address`, `#a-record` and `#url` typed into the address land below the foot; "All letters" puts `#letters` in the window.
8. The bar, at 375 × 812: the three tests of section 5.3.
9. Keyboard, Tab from the stamp to the page's end, at 320 × 640, 375 × 812, 390 × 844 and 1440 × 900 (the first letter, D, J and the last letter's stops at least; the prototype was walked whole): every focused element in `main` has its top at or below the foot and its foot inside the window. The same with the header's menu open, at the widths that have a menu.
10. The same with Shift+Tab from the footer's first link up to the stamp, menu closed and open.
11. `getComputedStyle(document.documentElement).scrollPaddingTop` on `/glossary` is `80px`; with the menu open, `403px`; and the open header is 391px tall at 320, 375 and 768 (if this fails, the menu changed: the 403 changes with it).
12. Colour: a source link's colour is `--ink-strong` (not `--link`), its underline `--cs-hair`; "Described in" is `--ink`, 600, not underlined; a card's edge is 2px `--cs-edge`; an empty key's edge is dashed; in the dark every edge reads `--ink`.
13. Contrast: every pair in section 8 is at or above its figure there, less 0.1, in both themes.
14. Home, Tracks, the track pages, About and a lesson have the scroll padding they had before the build (`tracks-card-stack.spec.ts:612`), and Home, Tracks and the track page render the same before and after (the job's own check).
15. `card-stack.css` is byte-identical before and after.
16. The built page's HTML is at most 36 KB gzipped.

**Layout 2 only**

17. On `/glossary`, one `section.gl-letter` is rendered, the first, and its key alone has the ink tile (its background equals `--cs-edge`). Page height within 1%: 3,425px at 375 × 812, 1,966px at 1440 × 900.
18. After the T key: only `#letter-t` is rendered, the address ends `#letter-t`, T's key alone has the ink tile. After "See TTL" from `#time-to-live`: only `#letter-t`, `#ttl` tinted.
19. After "All letters" (the key, and the link in a bar): 20 sections rendered, the page as tall as layout 1's within 1%, and the "All letters" key alone has the ink tile. Checks 5, 7, 9 and 10 pass in this state as well as on arrival.
20. Back, after A then T then "All letters", shows T and then A.
21. With `:has()` unsupported (test by removing the `@supports` block's rules), 20 sections are rendered and no key has the ink tile.

## 12. Decisions, one line each

- Layout 1 keeps `main`'s markup to the character: the page is pinned by 33 end-to-end tests and a no-JavaScript equality test, and nothing measured needed a new element.
- The letter is on an index tab that stands in the sticky bar: the tab is the look's signature, and a tab on a rule can stick where a tab hung outside its card cannot.
- The card's top edge is the bar's rule: so the tab is always seen standing on its card, stuck or not.
- The page's own rules, not `.cs-card` and `.cs-tab`: those classes cannot stick, and D20 set the precedent of a page's parts being its own.
- The bar leaves with its card, and the test changes: measured, the bar never misleads (0 of 3,986 positions); the test's scroll cannot work on a short letter.
- No padding to make W taller: a blank band to satisfy a test is a fault a reader would see.
- A term's name loses its tile: the tile is Patch's label tape; inside a card the name is the row's heading.
- A pointer is one line and lighter than a term: it is not an entry, and 48 of them cost 4,529px on a phone.
- Links are ink with an underline: the look's rule on the three pages before this one.
- The note moves from `--muted` to `--ink`: it tells the reader how to read every row; 10.45:1 from 5.0:1.
- Empty keys take the look's dashed "not there yet" edge: one meaning for dashed across the site.
- Keys flat, no offset edge: 26 offset edges in a row is noise; the offset edge means "press to act" on a button.
- Scroll padding 80px on `html`, the bar's height on each row and link: the site's number, and no negative margins; measured 0 hidden stops where today hides 163.
- 14px gutter to 599px: Tracks' gutter; 4px more for every line of every definition.
- 6 key columns below 375px, not 360px: at 360 to 374 seven keys would be 43px wide.
- The keys' hover fade goes: the page then has no transition, so nothing for a test to wait on.
- Sources not folded, 17px kept: section 7.
- Layout 2 is read from the address by CSS: the brief allows no script, and `:target` with `:has()` needs none.
- Layout 2 opens at the first letter, not at all letters: otherwise it is layout 1 until a key is pressed, and buys nothing on arrival.
- "All letters" means the same in both layouts' bars (go to `#letters`); in layout 2 that address is also what shows every card, so the words are true twice.
- Layout 1 is recommended: section 2.

## 13. Open questions for the owner

1. **Which layout?** Recommended: 1, Ledger. Layout 2, Card file, buys a 3,425px phone page and 40 Tab stops on arrival, and costs the browser's find across letters.
2. **`glossary.spec.ts:143` is changed, not passed as written** (section 5.3). Plan decision 5 allows either; this names which, with the measure. Say if the bar should instead be kept at 68px by giving a short letter empty height.
3. **The look's link underline is 2.16:1 (light) and 2.26:1 (dark)** on a card, under the 3:1 asked of a mark that says "this is a link". It is `--cs-hair`, as on Home, Tracks and the track page. Left as the look has it; changing it (to `--muted`, 6.0:1) is a change to four pages.
4. **The brief's note that `card-stack.css` re-tints links in `main` is not so** (section 3): it has no link rule. The page draws its own, as the other three pages do. No action unless the owner wants the rule shared.
5. **Sources folded on a phone?** Not drawn. It would save 4,224px (9.3%) and 294 Tab stops, and hide each definition's sources behind a tap.
6. **If layout 2:** should it open at the first letter (as drawn) or with every letter laid out? And is losing the marked key and the one-letter view in a browser without `:has()` (Firefox before 121, Safari before 15.4) acceptable? It falls back to layout 1's page.
