# D18: the Tracks page in the "Card stack" look

Job 18, design unit D18 (direction 2.84 to 2.86). The Tracks page (`/tracks`) in Card stack, colour variant A, as approved on Home (D17), with its layout open at the owner's word: "Redesign the layout too". Two layouts, genuinely different in structure; the owner picks one at the gate.

The prototype is `prototypes/d18-tracks-card-stack.html`: one self-contained file, built from the Tracks page as it is today (`dist/tracks/index.html`, revamp a12276a) with its header, footer, fonts and Patch's tokens, then one `<style>` block headed "D18". The dark bar at its top is the prototype's own: **Layout 1 / 2**, **Light / Dark**, and the island's states **First visit / Part way / A track finished / No JavaScript**. It has no `<script>`: the switches are radio buttons and CSS. The header's theme and menu buttons are script on the site and do nothing here. Resize the window for the two widths (375 and 1440; it holds at 320).

(Written in parts as the work went; every section below is final.)

## 1. What the page must still say, and what it said badly

Fixed by the brief, whatever the layout: each track's name and who it is for; how far this browser has got; the way in (Start or Continue, and the whole track); the lesson up next; A+ not ready yet, with no link and no control; the order to take the tracks in. Home's links `/tracks#how-the-internet-works`, `#networking` and `#comptia-a-plus` land on their track clear of the 68px header. The page does not list every lesson (the owner, 2026-11-09). Header, footer, the Lesson page and `src/styles/tokens.ts` do not change. No new `<script>`.

Measured today (revamp a12276a, the dev server, Chromium):

| | 1440 × 900 | 375 × 812 |
|---|---|---|
| Page height | 1,886px | 3,335px |
| Each track | 302, 302, 311px tall | 734, 755, 695px tall (a screen each) |
| Gzipped HTML | 213 KB (1.04 MB raw) | |
| Tab stops in a ready track | 4: the name, Start, See the whole track, the up-next card (the card and Start go to the same lesson) | |

What was wrong besides the look: the phone layout was never designed (`tracks.astro:183`, "not designed yet (task 8)"); the up-next card and the Start button are two links to the same place; the order of the tracks is said only in the last line of the page, under all three; "Start here" means two things on one screen (the first track, on Home, and the first lesson, in each card); A+ has a span dressed as a button ("Lessons on the way") that cannot be pressed; `.panel` names `shadow-sm`, which paints nothing; and 180 of the page's 213 KB is one figure for each of the 34 ready lessons, sent so the up-next card can show whichever lesson is next.

## 2. The two layouts

Both are Card stack, colour variant A, with the same parts (§4), the same words (§9) and the same island; they differ in how the three tracks are laid out. The prototype's switch changes only the layout's rules; the markup is one.

### Layout 1, Stack (recommended)

**The idea: one card a track, down the page, in the order to take them, each with its index tab.** The page reads like a short card file: "Start here", "Then go deeper", "Not ready yet". On a desk each card is a row of three: the track's drawing, the track (name, who it is for, how far you have got), and the lesson up next with the way in. On a phone the card drops its drawing and is only what a reader acts on.

```
1440                                                    375
Pick a track          Each track is ... in order.       Pick a track
                      New to IT? Start with ...         Each track is ...
[■ Start here]                                          New to IT? ...
┌────────────┬───────────────────────┬────────────┐     [■ Start here]
│  drawing   │ How the Internet Works│ First less.│     ┌──────────────────┐
│  (Home's   │ Meet the 14 ...       │ [01] HTTP  │     │How the Internet W│
│   cover)   │ □□□□□□□□  0 of 14 done│ Asking ... │     │Meet the 14 ...   │
│            │                       │[Start] See…│     │□□□□□□ 0 of 14 ...│
└────────────┴───────────────────────┴────────────┘┐    │┌ First lesson ──┐│
 └─────────────────────────────────────────────────┘    ││[01] HTTP       ││
[Then go deeper]  … the same                            ││[Start]         ││
[Not ready yet]  ┌ ─ dashed ─ ┐ no strip, no button     ││See the whole tr││
                                                        │└────────────────┘│
                                                        └──────────────────┘┘
```

### Layout 2, Spread

**The idea: the tracks dealt side by side on the desk, in order from the left, so a reader compares them at a glance; on a phone, the same cards as a deck to swipe.** Each card is a column: the drawing, the name, who it is for, the progress, and at its foot the lesson up next with the way in, so the three ways in line up across the page. On a phone the cards sit in a row that scrolls sideways (scroll-snap), one card in view and the next card's edge and tab showing at the right; the page itself never scrolls sideways.

```
1440                                                     375
Pick a track             Each track is ... in order.     Pick a track
                         New to IT? Start with ...       Each track is ...
[■ Start here]     [Then go deeper]    [Not ready yet]   [■ Start here]   [Th
┌─────────────┐┐   ┌─────────────┐┐   ┌ ─ ─ ─ ─ ─ ─ ┐   ┌──────────────┐┐ ┌──
│   drawing   ││   │   drawing   ││   │   drawing   │   │   drawing    ││ │
├─────────────┤│   ├─────────────┤│   ├ ─ ─ ─ ─ ─ ─ ┤   ├──────────────┤│ │
│How the Inter││   │Networking Co││   │CompTIA A+   │   │How the Intern││ │
│Meet the 14..││   │How devices..││   │Hardware, .. │   │Meet the 14 ..││ │
│□□□□ 0 of 14 ││   │□□□□ 0 of 20 ││   │             │   │□□□□ 0 of 14  ││ │
│┌First less.┐││   │┌First less.┐││   │┌Lesson 1 is┐│   │┌First lesson┐││ │
││[01] HTTP  │││   ││[01] OSI   │││   ││being writ.│ │   ││[01] HTTP   │││ │
││[Start] See│││   ││[Start] See│││   │└ ─ ─ ─ ─ ─┘│   ││[Start]     │││ │
│└───────────┘││   │└───────────┘││   └ ─ ─ ─ ─ ─ ─ ┘   │└────────────┘││ │
└─────────────┘┘   └─────────────┘┘                     └──────────────┘┘ └──
```

### What each fixes, measured

Chromium, the prototype with its bar left out of the figures, every state (first visit, part way, a track finished, no JavaScript): each height is the same in all four states, to the pixel, so nothing moves when progress loads.

| | Today | Layout 1, Stack | Layout 2, Spread |
|---|---|---|---|
| Page, 1440 × 900 | 1,886px | **1,598px** (−15%) | **1,411px** (−25%) |
| Page, 375 × 812 | 3,335px | **2,325px** (−30%) | **1,713px** (−49%) |
| Page, 320 | | 2,511px | 1,828px |
| Page, 768 | | 1,902px | 1,434px (the deck, 400px cards) |
| A ready track, 1440 | 302px | 228px | 622px (a column, 387px wide) |
| A ready track, 375 | 734 / 755px, a screen each | 445px, half a screen | 659px, one card of the deck in view (303px wide) |
| A+, 1440 / 375 | 311 / 695px | 214 / 272px | 622 / 659px (the row's height) |
| 1440, the first screen holds | the head, track 1, most of track 2 | the head, track 1, most of track 2 | all three tracks side by side |
| 1440, the two Start buttons' feet | y 506, 834 | y 472, 770 | y 866, 866 |
| 375, the first Start button's foot | y 592 | y 753 (still on the first screen) | y 968 (below it) |
| Sideways scroll at 320, 375, 768, 1440 | none | none | none (the deck scrolls inside itself) |
| Tab stops in a ready track | 4 | 3: the name, the button, See the whole track | 3 |

**Layout 1 is recommended.** Every track is in view by scrolling down, as on every other page of the site; it shortens each track rather than moving it sideways (half a screen on a phone, from a whole one); it keeps the one-panel-a-track structure the owner kept on 2026-11-10, so the track page, which shares its parts, can follow it later. **Layout 2 buys** the shortest pages and the best desk view: the three tracks compared side by side, each with its way in, above the fold at 1440. It costs two things on a phone: two of the three tracks start off screen (their tab and edge show, and the head's two links jump to them), and a sideways deck is one more gesture a beginner must find. Its phone card is not shorter than today's track; the page is shorter because the tracks sit side by side. In both, the first Start sits lower on a phone than today's (592px): the order sentence now comes before the cards, and the button now sits with the lesson it opens.

## 3. Tokens, and the shared Card stack stylesheet

**No new token and no new colour.** Tracks reads D17's `--cs-*` names (D17 §2, A column) and Patch's tokens, as Home does; nothing goes into `src/styles/tokens.ts`. The page ground is `--ground`.

**The shared stylesheet (plan decision 5): `src/styles/card-stack.css`**, imported by `index.astro` and `tracks.astro` only. It is Part 1 of the prototype's D18 block:

| Part | Selector | From | Notes |
|---|---|---|---|
| Tokens | `:root { --cs-… }`, the dark `--cs-edge`, the 860px `--cs-stack` | Home's TOKENS block, moved as is | names only `--cs-*`, so it changes nothing on a page that does not read them |
| Buttons | `main .btn`, `main .btn--primary`, `:hover`, `:active`, `:focus-visible` | Home's `.btn` rules | scoped to `main`, so the header's "Start learning" (outside `main`) keeps Patch (D17 check 3) |
| Figure tint | `main, .lm-defs { --fig-bg … }`, `#main .lm-svg { --anatomy-… }`, its dark twins, `#main .lm-led.on`, `#main .lm-orbit` | Home's FIGURE TINT block, moved as is | Home keeps its own `.nm-trail`, `.nm-trail-edge` and `.nm-glow` rules: they are the demo's |
| Card | `.cs-card`, `.cs-card--beneath`, `.cs-card--soon`, `.cs-card:has(> .cs-tab)` | new names for what Home's `.leg` draws | opt-in by class |
| Index tab | `.cs-tab`, `.cs-tab--here::before`, `.cs-card--soon > .cs-tab` | new names for Home's `.leg__order` | opt-in by class |

Home's B21 commit moves the tokens, the buttons and the figure tint, and **renders the same**: its `.leg` and `.leg__order` keep their own rules this job (they may move to `.cs-card` and `.cs-tab` later, a change Home's screenshots must show as none). Because the parts are opt-in classes or scoped to `main`, the file cannot reach the header, the footer, or a page that does not import it.

**One device is new: the dashed edge.** `.cs-card--soon` (and its tab) has a 2px **dashed** edge and nothing beneath it: a card that is not there yet. It is used once, on A+. It comes from Patch's own language (the cable's dashed run is "not ready", §6). In the dark it is the light ink, as every edge.

**Tracks' own rules stay scoped** (plan decision 6). Every rule in Part 2 is in `tracks.astro`'s `<style>`, which Astro scopes to the page; the rules that reach the island's markup and `TrackStrip` (`.strip`, `.strip__sq i`, `.strip__w`, `.upnext…`, `.wholetrack`) are written `.tp :global(.strip)` and so on, under the page's own `.tp` wrapper. `hub.css` is not edited: the track page (`/networking`) keeps its strip (9 × 12px squares, mono caption), its `.next`, `.panel__cta`, `.side-now` and `.stop` as they are, in Patch. The island's new up-next box uses new class names (`upnext…`), so no rule of `hub.css`'s `.next` reaches it.

## 4. Type

The site's three families in their Patch roles, as D17.

| Use | Face | Size / line | Colour |
|---|---|---|---|
| h1 "Pick a track" | Barlow Semi Condensed 700 | `clamp(44px, 5vw, 72px)` / 0.95, `-0.012em` (72 at 1440, 44 at 375) | `--ink-strong` |
| The head's two paragraphs | Atkinson Hyperlegible Next 400 | 18px / 1.55 (17px at 860 and below), max 34em | `--ink`, links `--ink-strong` |
| Track name (h2) | Barlow 700 | 28px / 1.1 (24px at 860 and below) | `--ink-strong`; A+ `--muted` |
| Who it is for | Atkinson 400 | 16.5px / 1.5, max 36em | `--ink` |
| Progress words ("3 of 14 lessons done") | Atkinson 400 | 15px / 1.3 | `--muted` (was mono 13px: it is a sentence, not data) |
| Up-next kicker | Barlow 600 | 15px / 1.2, `0.01em` | `--ink` |
| Up-next title | Barlow 700 | 22px / 1.15 | `--ink-strong` |
| Up-next line (the lesson's subtitle) | Atkinson 400 | 15px / 1.45 | `--muted` |
| Lesson number chip | Atkinson Hyperlegible Mono 700 | 14px | real data: the lesson's number |
| Button | Barlow 600 | 18px / 1.2 | as D17 |
| See the whole track | Atkinson 400 | 15.5px | `--ink-strong`, underline `--cs-hair` 1.5px |
| Tab | Barlow 600 | 16px | `--ink-strong`; A+ `--muted` |
| A+ note: "Lesson 1 is being written." / the rest | Barlow 700 20px / 1.2; Atkinson 400 15px / 1.5 | | `--ink-strong`; `--muted` |

No word is picked out in a colour: the old `<em>` on each name's last word ("How the Internet <em>Works</em>", "Pick a <em>track</em>") goes, as on Home.

## 5. Components and their states

### 5.1 The head

A two-column grid at 861px and up (`5fr 7fr`, gap `clamp(24px, 4vw, 64px)`, bottom-aligned): the h1 at the left, the two paragraphs at the right. One column below. `margin-bottom` 76px (62px at 860 and below), of which 34px is the row of tabs. `.tp` has `padding-top: clamp(32px, 4vw, 48px)` and `padding-bottom: 8px` (the footer keeps its own space above it).

### 5.2 A track's card (`article.panel.cs-card`)

- Ready: `.cs-card.cs-card--beneath`: 2px `--cs-edge`, corners `0 10px 10px 10px`, one card beneath (6px, 4px at 860 and below). A+: `.cs-card.cs-card--soon`: dashed, nothing beneath.
- The tab (`p.cs-tab`, after the drawing in the markup, before the name): "Start here" with the 9px here marker (`.cs-tab--here`); "Then go deeper"; "Not ready yet" (dashed, `--muted`). 34px tall, `left: -2px; bottom: 100%`.
- `scroll-margin-top: 114px` (the 68px header, the 34px tab, 12px of air) and `scroll-margin-inline: 16px` (the deck). Measured: Home's three anchors leave the tab's top at y 82, under the header's foot at 69, in both layouts at 1440 and 375; in the deck the card lands wholly in view (left ≥ 16, right ≤ 359).
- The drawing (`.trk__art`, `aria-hidden`): the track's own cover, `coverStill(id, 'tracks-<id>')` cropped as Home crops it (`cropViewBox(…, '30 20 540 378')`), with `preserveAspectRatio="xMidYMid slice"` on its root `<svg>` so a box of another shape crops it from the middle. Covers: `web`, `networking` (`TRACK_COVERS`), `aplus`. Re-tinted by the shared figure tint.
- The name: `h2 > a` to the track's page, underlined 2px `--cs-hair`, ink on hover. A+: `h2` with no link.

### 5.3 How far this browser has got (`TrackStrip`, unchanged markup)

One square a lesson, 10 × 10px, 2px corners, 3px apart, each with a 1.5px `--cs-edge` ring:

| Square | Fill | Size |
|---|---|---|
| Not done (`ready`) | none | 10 × 10 |
| Done | `--cs-done` | 10 × 10 |
| Up next (`current`, only when the kind is "next") | `--cs-here` | 10 × 14 (it stands taller) |

Every square has 2px of margin above and below and the current one none, so a row is 14px tall in every state (the strip does not grow when an orange square appears). Colour is not the only signal: filled against hollow is done against not; the taller square is the one named in the box below; the words say the count.

### 5.4 The lesson up next and the way in (the island's new markup)

A quiet box (`--cs-quiet`, 8px corners, padding `14px 16px 16px`): the kicker, the lesson's number chip and title on one line, the lesson's subtitle under the title (46px in, under the title), then the button and "See the whole track". The box is **not a link**: the button is the one way to the lesson (today the card and the button were two links to the same place).

| Island state | Kicker | Chip (34px, 6px corners, 2px edge) | Button | Strip |
|---|---|---|---|---|
| First visit (and no JavaScript, and storage blocked: the server's render) | First lesson | paper, the number in ink | Start | all hollow |
| Part way, the lesson up next in progress | Up next | `--cs-here`, the number in `--cs-here-ink` | Continue (to `?step=`) | done green, the lesson's square orange and tall |
| Part way, the next lesson not started | Up next | `--cs-here` | Start | the same |
| Every ready lesson done | ✓ Done so far | paper, the number hidden (`font-size: 0`, still in the markup and read as "Lesson 14"), a drawn tick: 13 × 7px, 3px `--cs-done` strokes, as Home's steps | Watch again | all green |

The chip reads "Lesson 04" to a screen reader (`<span class="sr-only">Lesson </span>04`). The line under the title is the lesson's **subtitle** alone ("Quick, no guarantees"): the chip already gives the number, so `lessonLine`'s "Lesson 04 · " is not repeated.

The button row: flex, wrap, gap `12px 20px`, `margin-top: 16px`; the button `padding: 0 24px`. **At 480px and below** the button and the link stack (gap 14px) in every state, so the card is as tall with "Watch again" as with "Start" and does not move when progress loads.

### 5.5 A+

The card, the dashed tab "Not ready yet", the A+ cover, the name (no link, `--muted`), who it is for, and where a lesson would be, a note in a dashed box (2px dashed `--cs-hair`, 8px corners): "**Lesson 1 is being written.** Each lesson will follow the A+ exam objectives." No strip, no button, no link, no Tab stop.

### 5.6 Buttons and links

Buttons as D17 §4.2 (48px, 2px edge, 3px offset edge, pressed in when pressed, Patch's focus ring). One filled button a card. Links are ink, underlined in `--cs-hair`, ink on hover, as Home.

## 6. The layouts, section by section

Positions measured at 1440 × 900 and 375 × 812, light, the prototype's bar left out.

**Layout 1, Stack**

| | 1440 (861 and up) | 861 to 1,140 | 860 and below |
|---|---|---|---|
| Cards | one column, 70px apart (the tab's 34 in it) | the same | 62px apart; each card 14px in from the screen's left (`margin: 0 calc(-18px + var(--cs-stack)) 0 -18px`), words from 32px |
| Inside a card | grid `300px minmax(0,1fr) minmax(320px,380px)`, rows `auto auto 1fr`, column gap 32px, right padding 22px | `240px minmax(0,1fr)`; the up-next box under the strip in column 2 (`margin: 18px 0 24px`) | one column, padding `0 16px 18px` |
| Drawing | column 1 across all rows, a 2px rule at its right (dashed on A+), the whole drawing (`svg { height: auto }`) centred, min-height 210px | the same, 240px | not shown |
| Name, who, strip | column 2: name `margin-top: 24px`; strip at the foot, `margin-bottom: 24px` | strip under who | name `margin-top: 18px`; strip `margin-top: 16px` |
| Up next / A+ note | column 3 across all rows, centred, `margin: 20px 0` | see above | `margin-top: 16px` |
| Card size | 1,240 × 228 (A+ 214) | | 343 × 445 (A+ 272) |

**Layout 2, Spread**

| | 861 and up | 860 and below: the deck |
|---|---|---|
| Cards | grid `repeat(auto-fit, minmax(300px, 1fr))`, gap `70px 40px`, rows stretch (three across from 1,044px wide; two, then A+ under, from 861 to 1,043) | a flex row, gap 14px, `overflow-x: auto`, `scroll-snap-type: x mandatory`, `scroll-padding-inline: 16px`, `overscroll-behavior-x: contain`, `scrollbar-width: thin`; `margin: -34px -32px 0; padding: 34px 16px 14px` (screen edge to edge, room for the tabs and the cards beneath) |
| A card | a flex column, padding `0 20px 20px` | `flex: 0 0 min(calc(100vw - 72px), 400px)`, `scroll-snap-align: start`, padding `0 16px 18px`; 303px wide at 375, the next card's 38px showing |
| Drawing | full width, `aspect-ratio: 540 / 290` (cropped from the middle), a 2px rule under it | 168px tall, the rule under it |
| Up next | at the card's foot (`margin-top: auto`), so the three boxes line up | the same |
| A+ note | at the foot, level with the boxes | straight after who it is for (18px) |
| Card size | 387 × 622 | 303 × 659 |

The prototype's `:root:has(#pl-1:checked) .tp` and `:root:has(#pl-2:checked) .tp` prefixes are the switch's only; the chosen layout's rules are written under `.tp` alone.

## 7. The page's weight: ruled

**The up-next box shows no lesson figure; each track shows its own cover once.** Today the page sends a figure for every ready lesson (34, 873 KB raw in `<template>`s, about 180 KB of the 213 KB gzipped) so the card can show whichever lesson is next. Measured on today's build: the page without those templates and the two server-rendered slots is 23.4 KB gzipped; Home's two cover drawings are 17.1 and 16.5 KB gzipped. So the page will be **about 57 KB gzipped (−73%)**, the builder to measure. The reasons: the cover is the picture of the track a reader is choosing, and the same one they clicked on Home; a lesson's figure is the track page's job (it shows every lesson's); the box no longer swaps a figure when progress loads, so nothing in it can jump; and the island takes no slots.

## 8. Contrast, measured from what is drawn

Computed in the browser over the real backgrounds (WCAG 2.2 AA: 4.5:1 for words, 3:1 for a control's parts and meaningful graphics).

| Pair | Light | Dark |
|---|---|---|
| h1, head links (`--ink-strong` on `--ground`) | 14.51 | 17.05 |
| Head words (`--ink` on `--ground`) | 10.45 | 11.59 |
| Who it is for (`--ink` on `--card`) | 12.53 | 10.43 |
| Progress words, A+ name and note (`--muted` on `--card`) | 6.02 | 6.14 |
| Track name, tab words, chip number (`--ink-strong` on `--card`) | 17.39 | 15.34 |
| Up-next kicker (`--ink` on `--tile`) | 11.04 | 9.37 |
| Up-next title, See the whole track (`--ink-strong` on `--tile`) | 15.32 | 13.78 |
| Up-next line (`--muted` on `--tile`), the lowest words on the page | 5.31 | 5.52 |
| Button words (`--accent-ink` on `--accent`) | 5.62 | 6.40 |
| Button fill on the quiet box | 4.78 | 5.07 |
| Chip number on here (`--here-ink` on `--here`) | 5.62 | 6.40 |
| Here: up-next square, chip, tab marker on paper | 5.42 | 5.64 |
| Done: square and tick on paper | 4.64 | 9.17 |
| Square ring, card edge on paper | 17.39 | 10.43 |
| Card edge on the ground | 14.51 | 11.59 |
| Chip edge on the quiet box | 15.32 | 9.37 |
| A+ note's dashed edge (`--cs-hair` on `--card`; decoration, the words carry it) | 2.16 | 2.26 |

Every pair of words passes in both themes.

## 9. Every word: new, changed, moved, removed

| | Today | D18 |
|---|---|---|
| Moved | the closing line under the panels: "New to IT? Start with How the Internet Works, then go deeper with Networking Concepts. Every lesson is Watch, Learn, then Practice." | the same words and links, as the head's second paragraph, above the cards |
| Changed | the up-next kicker on a first visit: "Start here" | **"First lesson"** (on this page only: "Start here" is the first track's tab, as on Home; it meant two things on one screen) |
| Moved | the A+ chip "Not ready yet" | the A+ card's tab, same words |
| New (reused) | | the tabs "Start here" and "Then go deeper", Home's own words |
| Changed | "Lesson 1 is being written" (a title) | "Lesson 1 is being written." (a sentence, with its period, then "Each lesson will follow the A+ exam objectives.") |
| Removed | "Lessons on the way" (a span dressed as a button) | nothing in its place: the note says it |
| Removed | "Coming soon" (A+'s kicker) | nothing: the tab says "Not ready yet" |
| Removed | "Lesson 04 · " before the up-next line | the chip shows the number; the line is the subtitle alone |
| New, for screen readers only | | "Lesson " before the chip's number |
| Kept | "Pick a track", "Each track is a set of short visual lessons, taken in order.", the three names and blurbs, "N of M lessons done", "Up next", "✓ Done so far", "Start", "Continue", "Watch again", "See the whole track", "Each lesson will follow the A+ exam objectives." | |

No time figure, no score, no "Continue" outside a track's own box, no exam tag beyond A+'s own line (as today).

## 10. For the builder

- **The prototype's D18 block is the CSS.** Part 1 is `src/styles/card-stack.css`; Part 2 is `tracks.astro`'s `<style>`, with the chosen layout's prefix replaced by `.tp`; Part 3 is the prototype's own and is not built. Where this document and the block differ, the block is right and this is an erratum.
- **`tracks.astro`.** The head: `h1` "Pick a track" (no `<em>`), then a `div` with the two paragraphs; the outro `p` goes. Each card: `<article class="panel trk cs-card cs-card--beneath" id={id} aria-labelledby={id}-h>` (A+: `trk--soon cs-card cs-card--soon`), holding in this order the drawing `div.trk__art[aria-hidden]`, the tab `p.trk__tab.cs-tab` (`cs-tab--here` on the first), `h2.trk__name#{id}-h` (with `a` for a ready track), `p.trk__who`, then the island (ready) or `p.trk__soon` (A+). **`main article.panel h2 a` still matches the two ready names**, so `e2e/global-setup.ts:16-20` is unchanged. Drop `head`/`last`, `soonArt` and the `STATUS_WORDS` import; the tab words are the page's.
- **The covers.** `tracks-page.ts` gives each card a `cover` (`TRACK_COVERS[track.id]`, already there for Home) instead of `figures`; the page draws `cropViewBox(coverStill(cover, 'tracks-' + cover), '30 20 540 378')` and adds `preserveAspectRatio="xMidYMid slice"` to its root `<svg>`. `lessonFigure` is no longer imported by `tracks-page.ts` (the track page still uses it).
- **The island (`TrackPanelProgress`).** Props: `entries`, `known`, `trackUrl` (no `art<n>` slots, no children). It renders, as two siblings so they stay the panel's grid items through Astro's `display: contents` wrapper: `TrackStrip` (unchanged), then

  ```html
  <div class="upnext" data-kind="start|next|done-so-far">
    <p class="upnext__k">First lesson | Up next | ✓ Done so far</p>
    <p class="upnext__l"><span class="upnext__n" data-state="ahead|here|done"><span class="sr-only">Lesson </span>01</span><b class="upnext__t">HTTP</b></p>
    <p class="upnext__s">Asking for web pages</p>
    <p class="upnext__go"><a class="btn btn--primary" href="…">Start</a><a class="wholetrack" href="/how-the-internet-works">See the whole track</a></p>
  </div>
  ```

  `data-state` is `ahead` for kind `start`, `here` for `next`, `done` for `done-so-far`. The kicker words come from a Tracks-only map (`start: 'First lesson'`, the other two `UP_NEXT_KICKER`'s), so `hub.ts` and the track page's "Start here" do not change. `upnext__s` is `entry.subtitle`. No `.lift`, no `a.next`, no `.panel__cta`. With no ready lesson, the strip alone, as today.
- **Scoping.** `.tp :global(.strip)`, `.tp :global(.strip__sq i)` and so on; `hub.css` is not edited. Check the track page after: its strip squares are still 9 × 12px with a mono caption, and its side card is unchanged.
- **The deck (layout 2 only)** needs no script: scroll-snap and fragment links do it. Keyboard focus on a card's link scrolls the deck to it.
- **Remove**: `shadow-sm` from the page (it is gone with `.panel`'s old rules); the "task 8" narrow-screen rules.
- **Tests that pin today's page will move, once:** `tracks-page.test.ts:10,20` (figures → a cover), `:36` stays; `TrackPanelProgress.test.tsx` (`a.next`, `.lift`, "Start here", the figure tests at `:82` and `:91` go, the slot props); `e2e/site.spec.ts:482` (the outro → the head; the h1's `em`), `:528` ("Start here" → "First lesson", the card's link → the button), `:562` (the chip → the tab; "Coming soon", "Lessons on the way" gone; no `.btn` in the panel), `:784`, `:816`, `:832` (the kicker on a first visit), `:858` (unchanged). The `@visual` `tracks` shots change, by design.

## 11. Acceptance checks

**B** needs a real browser; **U** can be a unit test (vitest, the page rendered or the island). Unless said, each holds at 375 × 812 and 1440 × 900, light and dark, for the chosen layout.

*What the page says*

1. **U** `main` has the `h1` "Pick a track", then two paragraphs (the second with links to `#how-the-internet-works` and `#networking`), then three `article.panel` with ids `how-the-internet-works`, `networking`, `comptia-a-plus` in that order; no `p.outro`; no `em` in `main`.
2. **U** Each article's tab reads "Start here", "Then go deeper", "Not ready yet"; only the first has `cs-tab--here`.
3. **B** `main article.panel h2 a` matches exactly two links, to `/how-the-internet-works` and `/networking`; the A+ `h2` has no link.
4. **B** The A+ article has no `a`, `button`, `[tabindex]`, `.strip` or `.btn`; it shows "Lesson 1 is being written." and "Each lesson will follow the A+ exam objectives."; "Coming soon" and "Lessons on the way" appear nowhere on the page.
5. **B** Each ready article has exactly three focusable elements, in Tab order: the name, the button, "See the whole track".
6. **U** The page has as many `<script>` elements as today's, and no `<template data-astro-template`; `main` holds exactly three `.lm-svg` (the covers).
7. **B** The built page is at most 70 KB gzipped (expected about 57).

*The island's states* (U, the island rendered with seeded progress; B for the look)

8. **U** First visit (and storage blocked): kicker "First lesson", chip `data-state="ahead"` showing "01", button "Start" to the first lesson's URL, strip all `ready`, words "0 of 14 lessons done".
9. **U** A lesson in progress: kicker "Up next", chip `here` with its number, button "Continue" to `?step=<furthest>`, exactly one `current` square.
10. **U** A lesson finished, the next not started: kicker "Up next", chip `here`, button "Start".
11. **U** Every ready lesson finished: kicker "✓ Done so far", chip `done`, button "Watch again", no `current` square, every square `done`.
12. **U** The up-next line is the lesson's subtitle with no "Lesson NN ·"; the chip's text content is "Lesson NN".
13. **B** The box is not a link (`.upnext` has no `a` ancestor) and holds one `.btn--primary`.
14. **B** A ready article's height is the same (±1px) in the four states, at 320, 375, 768 and 1440.

*The look*

15. **B** Each ready `article.panel`: 2px solid border in `--cs-edge`, radius `0 10px 10px 10px`, a box-shadow pair (the card beneath); A+: 2px dashed, no box-shadow.
16. **B** The tab: 34px tall, 2px border with none at the bottom, its bottom within 2px of the card's top edge; the first tab's marker 9 × 9px in `--cs-here`.
17. **B** Strip squares: 10px wide; `ready` has no fill; `done` fills `--cs-done`; `current` fills `--cs-here` and is 14px tall; every row of squares is 14px tall.
18. **B** Every `main .btn` is at least 48px tall, has a 2px border and an offset shadow; pressed, it moves 2px and its shadow is `1px 1px`.
19. **B** Every link in `main` that is not a `.btn` is underlined and none computes to `--link`.
20. **B** In every figure in `main`: `--pool-op` and `--halo-op` compute to 0 and `.lm-orbit` is not displayed.
21. **B** Contrast: every pair in §8 at or above its figure (±0.05).
22. **B** The header's computed styles on `/tracks` equal today's (its ground, bottom border, nav line and radii), and the footer's.
23. **B** `/networking` after the change: `.strip__sq i` is 9 × 12px, `.strip__w` is in the mono face, `.side-now` unchanged: the track page is untouched.

*Layout and anchors*

24. **B** At 320, 375, 768 and 1440 the document's `scrollWidth` equals its `clientWidth`.
25. **B** Page height, first visit, light: layout 1 1,598 ± 40px at 1440 and 2,325 ± 40px at 375; layout 2 1,411 ± 40 and 1,713 ± 40.
26. **B** Going to `/tracks#how-the-internet-works`, `#networking` and `#comptia-a-plus` leaves that card's tab top at or below the header's bottom (69px) and within 200px of it (unless the page's end is reached); in layout 2 at 375 the card also lies wholly between x 0 and the window's width.
27. **B** Layout 1, 375: each card's left edge 14px from the screen's (±1), its words from 32px (±1); no drawing shown.
28. **B** Layout 2, 375: `.panels` scrolls on x with `scroll-snap-type: x mandatory`; each card is `min(100vw − 72px, 400px)` wide; the second card's left edge is inside the window.
29. **B** JavaScript off: the page shows the first-visit state in full (checks 8, 15 to 17), every link works, and the header's theme button is hidden as today.

## 12. Decisions, one line each

1. The tracks' order is said twice, by the tabs on the cards and by the sentence above them, and the closing line moves up into that sentence: order first, then the cards.
2. The tabs reuse Home's words, so the card a reader clicked on Home ("Start here") is the card they land on.
3. On a first visit the box says "First lesson", not "Start here": one phrase, one meaning, on one screen.
4. The up-next box holds the button: the lesson and the way into it are one object, and a track has three Tab stops, not four.
5. The box shows the lesson's number in a chip with the demo's three states (number, here, tick), so Home and Tracks say "where you are" the same way.
6. The track's cover replaces the lesson figure: the picture is of what is being chosen, and the page drops to about 57 KB.
7. A+ is a dashed card with nothing beneath: "not there yet" is drawn, not dressed as a disabled button.
8. Progress words are Atkinson, not mono: "3 of 14 lessons done" is a sentence.
9. Done squares are filled and the next one stands taller, so colour is never the only signal.
10. Layout 1 drops the drawing on a phone: it is decoration there, and without it a track is half a screen.
11. Layout 2's phone is a deck, not a stack, because the spread's idea (side by side) only survives on a phone as a row you swipe.
12. Every height is fixed against the state (14px strip rows, a stacked button row under 480px), so nothing moves when progress loads.
13. Tracks' rules stay in the page's scoped style and `hub.css` is not touched, so the track page stays Patch.
14. The shared stylesheet holds only what both pages draw the same way: tokens, buttons, figure tint, and the card and tab as opt-in classes.

## 13. Open questions for the owner

1. **Layout 1 (Stack) or layout 2 (Spread)?** 1 is recommended (§2): every track in view by scrolling down, each half a screen on a phone. 2 shows all three side by side on a desk with their way in above the fold, and is the shortest page, but on a phone two tracks start off screen in a deck to swipe.
2. **The lesson figure leaves this page** (§7): the box shows the lesson's number and name, and the track's cover is the picture. Keeping a figure for whichever lesson is next costs about 150 KB more on every visit.
3. **"First lesson" instead of "Start here" in the box on a first visit** (Tracks only). The track page's side card still says "Start here"; it changes when that page moves to Card stack, if you agree.
4. **A dashed edge as Card stack's "not ready yet"**, used once, on A+. It is new to the look.
5. **Layout 1 shows no drawing on a phone.** If the covers should stay, each track grows by about 150px (2,325 → about 2,780).
6. **Removed words:** "Lessons on the way" and "Coming soon" on A+; "Lesson 04 ·" before the up-next line.
