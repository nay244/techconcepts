# D20: the track page in the "Card stack" look

Job 21, design unit D20 (direction 2.84, 2.103 to 2.106). The track page (`src/pages/[track]/index.astro`, at `/how-the-internet-works` and `/networking`) in Card stack, colour variant A, as on Home (D17) and Tracks (D18).

**Revision 1 (2026-11-18, direction 2.106).** The owner chose **layout 1, Route**, with **no lesson drawing on the page** (name tiles included), accepted the 22px shift of a stop in progress on a phone, and approved the rest as drawn ("First lesson", no button on each stop). Layout 2, Index, was not chosen and is not in the prototype or this document. This revision redraws the stop without its figure and re-measures; everything else is as first drawn.

The prototype is `prototypes/d20-track-page-card-stack.html`: one self-contained file, built from the two track pages as they are today (`dist/` at revamp fb02521): their header, footer, fonts and Patch's tokens, then `src/styles/card-stack.css` as it is, then one block headed "D20". The dark bar at its top is the prototype's own: **Track**, **Progress** (First visit, Part way, Track finished, No JavaScript, Storage blocked) and **Theme**. The markup in the file is a first visit, as the server renders it; a short script at the foot works the bar's switches and the header's two buttons (theme, menu), and none of it is built. Resize the window for the widths (375 and 1440; it holds at 320).

(Written in parts as the work went; every section below is final.)

## 1. What the page must still say, and what it said badly

Fixed by the brief (2.104), whatever the layout: the track's name and who it is for; how far this browser has got (the strip); the lesson up next and its way in (Start, Continue or Watch again); every lesson in its part and in order, with its number, name, subtitle, status and the day it was checked (the stamp); the Watch, Learn, Practice marks once a lesson is begun; the crumb back to Tracks; the line on to the other track. The header and footer do not change, nor the Lesson page, `src/styles/tokens.ts`, Home or Tracks. No new `<script>`. No lesson word changes.

Measured today (revamp fb02521, the built page, Chromium, a first visit; S22 Part 8 and this unit):

| | `/how-the-internet-works` | `/networking` |
|---|---|---|
| 1440 × 900 | one screen; the route box shows 831px of 3,861px | one screen; 831px of 5,018px |
| 375 × 812, page height | 7,129px | 9,544px |
| 320 × 640, page height | 7,257px | 9,897px |
| One stop | 179px tall at 1440; 347px at 375 | 179px; 347 to 371px |
| Whole lessons on the first screen, 1440 | 3 of 14 | 3 of 20 |
| Tab stops in `main` (the footer's 7 left out) | 31: two a lesson | 43: two a lesson |
| Gzipped HTML | 11.8 KB | 221.9 KB of a 250 KB budget |

What was wrong besides the look:

- **The phone layout was never designed** (`index.astro:205`, "not designed yet (task 8)"): each lesson is a screen-wide figure over its words, so a stop is 347px or more and Networking is almost twelve screens.
- **On a desk the window does not scroll; a box inside it does.** Page Down, Space and the arrow keys do nothing until the box has focus, a wheel over the side column does nothing, and the header is not the sticky header of every other page.
- **Every lesson is two links to the same place**: its name and its button. Twenty "Start" buttons stand in a column on a first visit, and the lesson up next has two filled buttons on one screen (its stop's and the side card's).
- **The side card says "Start here" on Networking**, the track Home and Tracks call "Then go deeper".
- **OSI Model's figure is in the HTML twice** (side card and stop), against the page's own comment; the side card swaps its figure when progress loads, by copying it out of the route.
- **A name tile's full name is 7px on a desk** (22 units of a 528-unit drawing shown 168px wide), and is hidden from a screen reader with its link (`aria-hidden`).
- Each name's last word is picked out with `<em>`; the strip's words are 13px mono; `.side-now` and `.stop__tile` name `shadow-sm`, which paints nothing; `hub.css` carries `.next…` and `.panel__cta` rules no markup uses.

## 2. The layout: Route

**The idea: the side column beside the route of parts, as the owner drew it on 2026-11-09, restyled and fixed where measured.** The page scrolls (no box inside it), so the header is the site's sticky one. The side column (crumb, name, who it is for, the strip, the lesson up next) stays put while the route passes it. The route is a rail: a filled square at each part, each lesson's number on the rail, tied to its card. **A lesson's card holds words only**: its name over its subtitle at the left, its status over its stamp at the right. On a phone the side column comes first, the rail goes, and the number sits inside the card beside the name.

```
1440                                                           375
Tracks / Networking Concepts   ■ The big picture  2 lessons    Tracks / Networking…
Networking                     │  ┌───────────────────────────┐ Networking
Concepts                      [01]┤ OSI Model       ✓ Done    │ Concepts
How devices find …             │  │ One big job …   ✓ Checked │ How devices find …
■■■■▮□□□□□□□□□□□□□□□           │  └───────────────────────────┘ ■■■■▮□□□□□□□□□□□□□□□
5 of 20 lessons done          [02]┤ Packets         ✓ Done    │ 5 of 20 lessons done
[■ Up next]                    │  └───────────────────────────┘ [■ Up next]
┌──────────────────┐┐          ■ Addresses & the local network  ┌──────────────────┐┐
│[05] Switch       ││          │  …                             │[05] Switch       ││
│ Learning which … ││         [05]┤ Switch  In progress ▮W ▯L ▯P│ │[    Continue    ]││
│[    Continue    ]││          │  │ Learning …      ✓ Checked │ └──────────────────┘┘
└──────────────────┘┘          │  └───── (the wash) ──────────┘ The big picture 2 les.
(stays; the page scrolls)                                       ┌──────────────────┐
                                                                │[01] OSI Model    │
                                                                │     One big job …│
                                                                │✓ Done   ✓ Checked│
                                                                └──────────────────┘
```

### What it fixes, measured

Chromium, the prototype with its bar left out. A first visit, Track finished, No JavaScript and Storage blocked measure the same, to the pixel.

| | Today | D20, revision 1 |
|---|---|---|
| Page, 1440 × 900 (How the Internet Works / Networking) | one screen, a route of 3,861 / 5,018px in an 831px box | **2,365 / 2,910px**, the page's own scroll (2.6 / 3.2 screens) |
| Page, 375 × 812 | 7,129 / 9,544px | **3,499 / 4,330px** (−51% / −55%) |
| Page, 320 × 640 | 7,257 / 9,897px | 3,652 / 4,686px |
| Page, 390 × 844 | | 3,474 / 4,305px |
| Page, 768 × 1024 | | 2,825 / 3,371px |
| Page, 1024 × 700 and 1280 × 720 | | 2,740 / 3,451px and 2,363 / 2,909px |
| One lesson, 1440 | 179px | 81px (752 wide) |
| One lesson, 375 | 347 to 371px | 110px (347 wide) |
| Whole lessons on the first screen, 1440 | 3 | 6 |
| The filled button's foot, 1440 | y 782 | y 618 / 665, and it stays on screen at every scroll (screens 1024 wide and 700 tall, or more) |
| The filled button's foot, 375 | y 570 / 595 | y 617 (at 320 × 640: y 642, 2px under the fold) |
| Sideways scroll at 320, 375, 390, 700, 768, 1024, 1200, 1280, 1440 | none | none |
| Tab stops in `main` | 31 / 43, two a lesson | **17 / 23, one a lesson** |
| Focus under the sticky header, Tab and Shift+Tab | the root has no scroll padding | never: 13px or more clear on a phone, 15px on a desk; 14px or more with the menu open |
| Part way: what moves when progress loads | the side card's figure swaps | at 700px wide and up, nothing; below, the stop in progress grows 22px (44px at 320), which the owner accepted |
| Gzipped HTML | 11.8 / 221.9 KB | about 9 / 11 KB (§7) |

The keyboard figures come from focusing every stop in `main` in order and back from script, which scrolls as Tab does, at 320 × 640, 375 × 812, 390 × 844, 700 × 900, 768 × 1024, 1024 × 700, 1200 × 800, 1280 × 720 and 1440 × 900, the menu closed and, below 960, open (the open header 329px); the first draft's walk was also repeated once with the Tab key. The footer's own links are not this page's.

## 3. Tokens, and the shared Card stack stylesheet

**No new token, no new colour, and no line of `src/styles/card-stack.css` changes.** The page imports it (Part 1 of the prototype's D20 block, copied as it stands) and reads its `--cs-*` names and Patch's tokens; nothing goes into `src/styles/tokens.ts`. The ground is `--ground`.

| Part of `card-stack.css` | Result on this page |
|---|---|
| `main .btn`, `main .btn--primary` | the page's one button: 48px, 2px edge, 3px offset edge, pressed in when pressed |
| `.cs-card`, `.cs-card--beneath`, `.cs-tab`, `.cs-tab--here` (opt-in) | the up-next card and its tab; each lesson's card |
| the figure tint (`main, .lm-defs { … }`, `#main .lm-svg { … }`) | reaches nothing: `main` holds no drawing |

**Nothing is added to `card-stack.css` (plan decision 5).** Every part this page adds is its own: the stop, the rail, the part's count, the marks. The strip restates Tracks' values under `.tk` (Tracks' rules stay under `.tp` in `tracks.astro`); the up-next card is this page's own (a tabbed card whose chip keeps its number). Home and Tracks do not change by a pixel: no shared rule is edited.

**`hub.css` after B25** holds only what `TrackStrip` and Tracks still read: the seven `.strip…` rules as they are today and `.wholetrack`. Its `.wlp…`, `.panel__cta`, `.next…`, `.side-now…`, `.route…` and `.stop…` rules go; this page's rules are in `[track]/index.astro`'s `<style>`, written `.tk :global(…)` where they reach an island's markup. The prototype includes today's `.strip…` rules before the D20 block, so the cascade shown is the cascade built.

## 4. Type

The site's three families in their Patch roles, as D17 and D18.

| Use | Face | Size / line | Colour |
|---|---|---|---|
| Crumb | Atkinson Hyperlegible Next 400 | 15px / 1.4 | link `--ink-strong`, underlined `--cs-hair` 1.5px; the slash `--muted`; the page's name `--ink` |
| h1, the track's name | Barlow Semi Condensed 700 | `clamp(40px, 4.6vw, 60px)` / 0.98, `-0.012em`, `text-wrap: balance` (40 at 375); in the side column 44px from 1024, 52px from 1200 (44px where the screen is 820px tall or less) | `--ink-strong` |
| Who it is for | Atkinson 400 | 16.5px / 1.5, max 36em | `--ink` |
| Progress words | Atkinson 400 | 15px / 1.3 | `--muted` |
| Up-next tab (the kicker) | Barlow 600 | 16px / 1 (`.cs-tab`) | `--ink-strong` |
| Up-next title | Barlow 700 | 24px / 1.15 | `--ink-strong` |
| Up-next line (the lesson's subtitle) | Atkinson 400 | 15px / 1.45, two lines kept | `--muted` |
| Lesson number, on a chip | Atkinson Hyperlegible Mono 700 | 14px | by state (§5.4) |
| Button | Barlow 600 | 18px / 1.2 | as D17 |
| Part's name (h2) | Barlow 700 | 28px / 1.15 (24px at 860 and below) | `--ink-strong` |
| Part's count ("4 lessons") | Atkinson 400 | 15px / 1.3 | `--muted` |
| Lesson's name (h3, the link) | Barlow 700 | 21px / 1.2, underlined `--cs-hair` 2px | `--ink-strong` |
| Lesson's subtitle | Atkinson 400 | 15px / 1.45 | `--muted` |
| Status | Barlow 600 | 15px / 1.3, `0.01em` | Not started `--muted`; In progress `--ink-strong`; ✓ Done `--cs-done-text` |
| Watch, Learn, Practice | Atkinson 400; the part you are at 700 | 13.5px / 1.3 | `--muted`; the part you are at `--ink-strong` |
| Stamp | Barlow 600 | 14px / 1.3 (`site.css`, unchanged) | `--ink`, its tick `--allowed-text` |
| The line on to the other track | Atkinson 400 | 16.5px / 1.5 | `--ink`, link `--ink-strong` |

No word is picked out in a colour: the `<em>` on each name's last word (the h1, every part) goes.

## 5. Components and their states

### 5.1 The head (`div.side`)

In markup order: the crumb (`nav.crumbs`, as today), the `h1`, who it is for (`p.lede`, the track's description as it is), then the `TrackSide` island: the strip and the up-next card. `.tk` has `padding-top: clamp(24px, 3vw, 40px)` and `padding-bottom: 8px`. The crumb's link is `inline-block` with `padding: 4px 0` (29px tall). h1 `margin-top: 8px`; who it is for `margin-top: 14px`.

### 5.2 How far this browser has got (`TrackStrip`, unchanged markup)

As on Tracks (D18 §5.3): one square a lesson, 10 × 10px, 2px corners, 3px apart (2px below 360px wide, so twenty squares stay on one line at 320), each with a 1.5px `--cs-edge` ring; the words 12px to their right, or under them where they do not fit. `margin-top: 16px`.

| Square | Fill | Size |
|---|---|---|
| Not done (`ready`) | none | 10 × 10 |
| Done | `--cs-done` | 10 × 10 |
| Up next (`current`, only when the kind is not "start") | `--cs-here` | 10 × 14 |
| Not ready (none today) | none, a `--cs-hair` ring | 10 × 10 |

Every row of squares is 14px tall in every state.

### 5.3 The lesson up next and its way in (`div.upnext.cs-card.cs-card--beneath`)

A card with one card beneath it; **its index tab is the kicker**; inside, the lesson's number chip and name on one line, the lesson's subtitle under the name (46px in), and the page's one filled button, as wide as the card. Padding `18px 18px 20px`; `max-width: 480px`; `margin-top: 58px` (50px at 860 and below), of which 34px is the tab. Two lines are always kept for the subtitle (`min-height: 2.9em`), so the card is 186px tall for every lesson, in every state, at every width.

| Island state | Tab | Chip | Button | Strip |
|---|---|---|---|---|
| First visit (and No JavaScript, and Storage blocked: the server's render) | First lesson | paper, the number in ink | Start | all hollow |
| Part way, the lesson up next in progress | Up next, with the 9px here marker (`.cs-tab--here`) | `--cs-here`, the number in `--cs-here-ink` | Continue (to `?step=`) | done green; the lesson's square orange and tall |
| Part way, the next lesson not started | Up next, with the marker | `--cs-here` | Start | the same |
| Every ready lesson done | ✓ Done so far | `--cs-done`, the number in `--cs-card` | Watch again | all green |

The chip reads "Lesson 05" to a screen reader (`<span class="sr-only">Lesson </span>05`). The line under the name is the lesson's subtitle alone.

### 5.4 A lesson (`li.stop.cs-card`)

A card of words: 2px `--cs-edge`, 10px corners, paper, nothing beneath it. **It holds five things and no picture**: the number (a chip), the name, the subtitle, the status (with Watch, Learn, Practice after it once the lesson is begun) and the stamp. One link: the lesson's name, underlined, whose `::after` covers the whole card, so the card is one target and **one Tab stop**. No button.

It reads as Card stack by its hard edge, its chip and its states; it reads as the rail because its number is not in the card but on the line beside it, tied to the card by a 20 × 2px `--cs-edge` bar.

| Lesson's state | `li` class | Chip | Status | Marks | Link |
|---|---|---|---|---|---|
| Not started | `stop` | paper, the number in ink | Not started (`--muted`) | none | the lesson |
| In progress, and the lesson up next | `stop stop--now` | `--cs-here`, number in `--cs-here-ink` | In progress (`--ink-strong`) | shown | the lesson at `?step=` |
| In progress, another lesson opened later | `stop` | paper | In progress | shown | the lesson at `?step=` |
| Not started, and the lesson up next after a first visit | `stop stop--now` | `--cs-here` | Not started | none | the lesson |
| Done | `stop stop--done` | `--cs-done`, the number in `--cs-card` | ✓ Done (`--cs-done-text`) | none | the lesson |
| Not ready (none today) | `stop stop--soon` | dashed edge, the number `--muted` | Not ready yet | none | no link, no stamp; the card's edge dashed |

`stop--now` also has the pale orange wash over the whole card (`background-image: linear-gradient(var(--cs-here-wash), var(--cs-here-wash))`, so the paper stays under it). Colour is never the only signal: the status is a word, and the chip keeps its number in every state.

Hover: the name's underline turns ink. Keyboard focus: the link has no outline; the card has it (`.stop:has(h3 a:focus-visible)`: 2px `--focus`, 3px outside). The link has `scroll-margin: 24px 0 160px`, so a focused card is wholly on screen, clear of the header.

**Three forms, by the card's width**, chosen so that the longest subtitle, a status with its three marks and the stamp always fit and no card changes height at 700px and up:

| Form | Where | What |
|---|---|---|
| Two lines | 768 to 1023, and 1200 and up (the card 633px wide or more) | a grid `minmax(0, 1fr) auto`, 24px apart, rows 3px apart, padding `13px 18px 14px`: the name over the subtitle at the left; the status (and marks) over the stamp at the right, both right-aligned. 81px tall. The chip on the rail |
| Three lines | 700 to 767, and 1024 to 1199 (the card 549 to 739px wide) | the name, the subtitle, then a foot 8px under: the status (and marks) at the left, the stamp at the right. 108px tall. The chip on the rail |
| Phone | below 700 | no rail: the chip inside the card at `left: 14px; top: 12px`; the name and subtitle 46px in (`padding: 12px 14px`; the name `padding-top: 3px`); the foot 10px under, across the card, the stamp going under the status where both do not fit. 110px tall at 375 (132px where a subtitle takes two lines at 320); a card in progress is 133px (154 to 176px at 320) |

### 5.5 Watch, Learn, Practice (`PartsMarker`, unchanged markup)

Three marks in the strip's language, each with its name: a 14 × 8px box with a 1.5px `--cs-edge` ring; done is `--cs-done`; the part you are at is `--cs-here`, 12px tall, its name bold in `--ink-strong`. 10px apart, 5px between a box and its name. Shown only for a lesson in progress, after its status word. The `role="img"` label is today's ("In progress, at Learn").

### 5.6 A part (`section.route-stage`)

Its name (`h2`, `id="stage-<n>"`), its count beside it (`p.route-stage__count`, 12px after: "2 lessons", "1 lesson"), its lessons (`ol.route-stops`: a grid, 10px apart, 14px under the name). 36px between parts.

### 5.7 Buttons, links, the line on

One filled button on the page. Links are ink, underlined in `--cs-hair`, ink on hover; a focused link has 3px corners, a focused button 8px. The crumb's link, the button and the last line's link have `scroll-margin-block: 12px`. The last line (`p.route__end`) is today's words, `margin-top: 36px`.

## 6. The layout, by width

`html { scroll-padding-top: 80px }` and, while the header's menu is open, `341px` (§10).

| | 1200 and up | 1024 to 1199 | 700 to 1023 | below 700 |
|---|---|---|---|---|
| Page | grid `360px minmax(0, 1fr)`, column gap `clamp(40px, 5vw, 72px)`, `align-items: start` | grid `300px minmax(0, 1fr)`, gap 40px | one column: the head, then the route 40px under | the same |
| Side column | column 1, both rows; `position: sticky; top: 92px` where the screen is 700px tall or more (below that it scrolls with the page); h1 52px (44px at 820px tall or less) | the same; h1 44px | on top, full width; the up-next card at most 480px wide, and from 860 down 14px in from the screen's left | on top |
| Route | column 2; `padding-left: 56px`; the rail a 2px `--cs-hair` line at `left: 16px`, from 12px under the top to 24px above the foot | the same | the same | no rail, no padding |
| A part's name | 28px, with a 16px `--cs-edge` square on the rail (`left: -47px; top: 0.28em`, a 5px `--ground` ring) | the same | the same (24px at 860 and below) | 24px, no square |
| A lesson | two lines, 752 × 81px at 1440; the chip on the rail (`left: -56px`, so its middle is on the line; centred on the card's height; a 4px `--ground` ring), the tie at `left: -22px` | three lines, 549 × 108px at 1024 | three lines to 767, two from 768 | the phone form; each card `margin-inline: -18px` (347px wide at 375, 14px from each edge) |
| The last line | column 2, `padding-left: 56px` | the same | under the route | under the route |

Measured: the side column with the card beneath it ends at y 693 at 1440 × 900 (Networking), y 675 at 1280 × 720 and y 668 at 1024 × 700, so the button is on screen wherever the column is sticky.

## 7. The page's weight: ruled by the owner (2.106)

**No lesson figure on the page: no drawn spot, no name tile, on a stop or on the up-next card. The islands are sent only what they draw.**

Measured on today's built pages (gzip level 9 of `dist/<track>/index.html` with every lesson figure taken out and the props trimmed; the build's own table reads about 1% higher):

| | `/networking` | `/how-the-internet-works` |
|---|---|---|
| Today | 220.3 KB (the build: 221.9) | 11.6 KB (the build: 11.8) |
| No lesson figure | 14.1 KB | 11.0 KB |
| And the islands' props without `summary`, `meta`, `metaLabel`, `tags` and each place's `note`, which neither island reads | **10.7 KB** | **8.9 KB** |

So both pages will be **about 11 KB and 9 KB, of a 250 KB budget** (the builder to measure: the measured files still hold today's twenty buttons and the empty slot wrappers, which go, and gain the chips' hidden "Lesson " words).

**What goes with the figures:** on the page, the `figures` constant, `lessonFigure`'s import and call (`[track]/index.astro:13`, `:54-60`) and every `art<n>` slot on both islands; in `TrackSide`, the `art<n>` props, `.side-now__art` and `BorrowedArt`; in `TrackRoute`, the `art<n>` props, `.stop__art`, `.stop__slot` and `data-art`. `src/lib/figures.ts` and the drawings stay: the Lesson page still draws the next lesson's figure (`[lesson].astro:44`).

## 8. Contrast, measured from what is drawn
Computed in the browser over the real backgrounds, the wash composited on the paper (WCAG 2.2 AA: 4.5:1 for words, 3:1 for a control's parts and meaningful graphics).

| Pair | Light | Dark |
|---|---|---|
| h1, part names in layout 1, crumb link (`--ink-strong` on `--ground`) | 14.51 | 17.05 |
| Who it is for, the last line (`--ink` on `--ground`) | 10.45 | 11.59 |
| Progress words, part counts, the crumb's slash (`--muted` on `--ground`), the lowest words on the ground | 5.03 | 6.83 |
| Lesson name, up-next title, tab words, chip number (`--ink-strong` on `--card`) | 17.39 | 15.34 |
| Subtitle, "Not started", Watch Learn Practice (`--muted` on `--card`) | 6.02 | 6.14 |
| The same on the wash (`--muted` on the wash) | 5.21 | 5.18 |
| "In progress", the name on the wash (`--ink-strong` on the wash) | 15.03 | 12.94 |
| Stamp words (`--ink` on `--card` / on the wash) | 12.53 / 10.82 | 10.43 / 8.80 |
| "✓ Done", the stamp's tick (`--allowed-text` on `--card`) | 5.70 | 9.87 |
| The stamp's tick on the wash | 4.93 | 8.33 |
| Button words (`--accent-ink` on `--accent`) | 5.62 | 6.40 |
| Chip number on here (`--here-ink` on `--here`) | 5.62 | 6.40 |
| Chip number on done (`--card` on `--allowed`), the lowest words on the page | 4.64 | 9.17 |
| Here: chip, mark, tab marker on paper | 5.42 | 5.64 |
| Here: the strip's square on the ground / a mark on the wash | 4.52 / 4.68 | 6.27 / 4.76 |
| Done: the strip's square on the ground / chip and mark on paper | 3.87 / 4.64 | 10.19 / 9.17 |
| Edges (`--cs-edge`) on the ground / on paper | 14.51 / 17.39 | 11.59 / 10.43 |
| The rail (`--cs-hair` on the ground; decoration: the chips and the words carry it) | 2.12 | 2.20 |

Every pair of words passes in both themes. Revision 1 changed no pair: the stop's words sit on the same paper and wash; the figure's ring and the name tile are gone.


## 9. Every word: new, changed, moved, removed

Revision 1 adds no word and changes none; it removes the drawings' words from view.

| | Today | D20 |
|---|---|---|
| Changed | the side card's kicker on a first visit: "Start here" | **"First lesson"**, as on Tracks (approved, 2.106). "Start here" leaves this page |
| Moved | the kickers "Up next" and "✓ Done so far", inside the side card | the same words, on the card's index tab |
| Removed | "Lesson 05 · " before the up-next line | the chip shows the number; the line is the subtitle alone |
| Removed | the button on every stop: "Start", "Continue", "Watch again" | the lesson's name is the link and the status says where it stands (approved). The three words stay on the up-next card's button |
| Removed with the drawings (2.106) | each name tile's short and full name ("HTTP", "Hypertext Transfer Protocol"), drawn in the tile and hidden from screen readers; each spot's description (its `aria-label`), also hidden on this page | nothing: the short name is the lesson's name beside it; the full name and the descriptions stay in the lessons |
| New, for screen readers only | | "Lesson " before each chip's number (the up-next card's and every stop's) |
| Kept, never shown today | "Lessons not ready yet stay on the route, so you can see what is coming." (only when a lesson is not ready) | kept as written |
| Kept | "Tracks", the two names, the two descriptions, "N of M lessons done", "Up next", "✓ Done so far", "Start", "Continue", "Watch again" (the card), the twelve part names, "N lessons" and "1 lesson", every lesson's name and subtitle, "Not started", "In progress", "✓ Done", "Not ready yet", "Watch", "Learn", "Practice", "Checked D Mon YYYY", "Ready for more? Networking Concepts goes deeper.", "New to IT? How the Internet Works is the gentler start.", the labels "Breadcrumb" and "In progress, at Learn" | |

No lesson word changes. No time figure, no score, no exam tag.

## 10. For the builder

- **The prototype's D20 block is the CSS.** Part 1 is `src/styles/card-stack.css`, unchanged: import it, edit nothing in it. Part 2 is the page's own rules, already written under `.tk` alone. Part 3 and the script are the prototype's and are not built. Where this document and the block differ, the block is right and this is an erratum.
- **`[track]/index.astro`.** Import `card-stack.css`. `<BaseLayout … current="tracks">` with no `split` and no `footer={false}`: the page scrolls and the layout renders the footer after `main`. Inside `main`: `<div class="wrap tk">` holding, in this order, `div.side` (the crumb as today; `<h1 class="disp">{track.title}</h1>` with no `<em>`; `p.lede`; the `TrackSide` island), the `TrackRoute` island, and `p.route__end` (today's words). **Neither island has a slot.** No `.routebox`, no `.routebox__in`. Drop `head`, `last`, `figures` and the `lessonFigure` import. Astro's `astro-island { display: contents }` keeps the islands' roots as the grid's items, as today.
- **`split` is then used by no page.** Remove the prop from `BaseLayout.astro` and the `body.split` rules from `global.css` (`:190-205`); they are this change's orphans. `grep -rn "split" src/pages src/layouts src/styles` shows no user left.
- **Scroll padding** (in the page's `<style>`): `:global(html) { scroll-padding-top: 80px; }` and `:global(html:has(#menu-panel:not([hidden]))) { scroll-padding-top: 341px; }`. The open header measures 329px at 320 to 959px wide on this page (five links, no Start learning button); 341 is that and 12px. If the menu's links change, this number changes with them: check 28 pins it.
- **`TrackSide`** renders, as two siblings: `TrackStrip` (unchanged), then, when a lesson is ready,

  ```html
  <div class="upnext cs-card cs-card--beneath" data-kind="start|next|done-so-far">
    <p class="upnext__k cs-tab">First lesson | Up next | ✓ Done so far</p>   <!-- + cs-tab--here when the kind is next -->
    <p class="upnext__l"><span class="upnext__n" data-state="ahead|here|done"><span class="sr-only">Lesson </span>05</span><b class="upnext__t">Switch</b></p>
    <p class="upnext__s">Learning which device is on which port</p>
    <a class="btn btn--primary upnext__btn" href="…">Start | Continue | Watch again</a>
  </div>
  ```

  No figure, no `BorrowedArt`, no `art<n>` props, no `.side-now…`. `data-state` is `ahead` for kind `start`, `here` for `next`, `done` for `done-so-far`. `UP_NEXT_KICKER.start` in `src/lib/hub.ts` becomes `'First lesson'`; Tracks' own `KICKER` override (`TrackPanelProgress.tsx:16`) then says the same thing and may go with it, Tracks rendering the same either way. `lessonLine` has no user left and goes with its tests.
- **`TrackRoute`** renders

  ```html
  <div class="route">
    <section class="route-stage" aria-labelledby="stage-1">
      <h2 class="disp" id="stage-1">The big picture</h2>              <!-- no <em> -->
      <p class="route-stage__count">2 lessons</p>
      <ol class="route-stops" role="list">
        <li class="stop cs-card">                                     <!-- + stop--now | stop--done as today -->
          <span class="stop__node"><span class="sr-only">Lesson </span>01</span>
          <div class="stop__info">
            <h3 class="disp"><a href="{lessonHref}">OSI Model</a></h3>
            <p class="stop__sub">One big job, split into seven layers</p>
            <div class="stop__foot">
              <p class="stop__state"><span class="stop__k [go|done]">Not started</span>{PartsMarker, in progress only}</p>
              <Stamp stamp={lesson.stamp} sources={false} />
            </div>
          </div>
        </li>
  ```

  Gone: `header.route-stage__head`, `span.route-stage__mark`, `Named` and its `<em>`, `div.stop__tile`, `a.stop__art` and `span.stop__slot` with `data-art`, the `art<n>` props, `div.stop__acts` and its button. `actionLabel` stays for the up-next card. A lesson not ready: `li.stop.cs-card.stop--soon` with the chip, the name in an `h3` with no link, and `stop__k` "Not ready yet"; no stamp. In the prototype each `h2`'s id has a track prefix and each `li` a `data-n`, only because both tracks are in one file.
- **Selectors the suite reads still match:** `main .route li.stop:not(.stop--soon)` with its `h3 a` and `.stamp` (`e2e/global-setup.ts:22-40`, `support.ts:39-42`, `lesson-layout.spec.ts:543`); `main .route .route-stage li.stop`, `main .route .route-stage h2`, `main .side .strip__w`, `.stop__k` (`site.spec.ts:53-64`).
- **The two checks that read a spot on `/networking` change, in one place each.** `e2e/batch1.ts:85-96` `checkCard` (called by eleven lesson specs): the line `await expect(card.locator('svg[role="img"]')).toHaveAttribute('aria-label', aria)` becomes `await expect(card.locator('svg[role="img"]')).toHaveCount(0)`, and the rest stays (the lesson's stop, once, at its index, no error); its `aria` parameter is kept and unread, so no caller changes, or dropped from the eleven calls if the builder prefers one sweep. `e2e/router.spec.ts:186`: the same one assertion, and the test's name loses "shows Router's spot … with its description". Each spot's description is still checked where the spot is drawn, in its lesson's own spec.
- **The islands are sent only what they draw** (§7): at the page, give `TrackRoute` and `TrackSide` no `summary`, `meta`, `metaLabel` or `tags`, and each place only its `parts`. `trackParts` and its nine tests stay as they are; the page picks the fields.
- **`hub.css`** keeps its `.strip…` rules and `.wholetrack` as they are and loses the rest (§3). Check Tracks after: its squares are 10px with Tracks' own rules, as before.
- **Motion.** The page adds no transition of its own; the button's is `card-stack.css`'s.
- **Tests that pin today's page move, once:** `src/lib/tracks-render.test.ts:197-208` (the importers of `card-stack.css` are now three; the track page, `hub.css` and `hub.ts` leave the "not in the diff" list); `e2e/tracks-card-stack.spec.ts:612-621` (`/networking`'s scroll padding is 80px), `:776-792` and `:793-798` (the track page now reads `--cs-edge`, 10px squares, the button's 2px edge; "Start here" is not on it); `TrackSide.test.tsx` (the kicker; the figure tests at `:62-79` and `:126-155` go); `TrackRoute.test.tsx` (the `em`, the figure link at `:83-92`, the keyed figure at `:128-136`, `data-art` at `:186`, the buttons); `TrackPanelProgress.test.tsx:56`; `hub.test.ts` (`lessonLine`, the kicker); `e2e/site.spec.ts:588` (the first Start, "Start here", the side button's selector), `:639` (no `svg.name-tile`, no `.nt-full`), `:661` (the window now scrolls and the route box is gone: the test becomes "the side card's button stays on screen while the page scrolls to the last stop"), `:687` (1280 × 720: the button on screen; no `.side-now__art`); the `@visual` `track` and `track-internet` shots, by design.

## 11. Acceptance checks

**B** needs a real browser; **U** can be a unit test (vitest, the page or an island rendered). Unless said, each holds on both tracks at 375 × 812 and 1440 × 900, light and dark. A read after a state or focus change waits with `transitionsDone`.

*What the page says*

1. **U** `main` holds one `div.wrap.tk` with, in order: `nav.crumbs` (a link "Tracks" to `/tracks`, then the track's name with `aria-current="page"`), the `h1` (the track's title, no `em`), `p.lede` (the track's description), `.strip`, `.upnext`, `div.route`, `p.route__end`. No `em` anywhere in `main`. No `.routebox`.
2. **U** `/networking` has six `section.route-stage` and twenty `li.stop` in the order of `networking.ts`; `/how-the-internet-works` six and fourteen. Each section's `h2` is the part's title and its `p.route-stage__count` reads "N lessons" ("1 lesson" for The seal).
3. **U** Each ready `li.stop` holds exactly one `a`, inside its `h3`, to the lesson; no `button`, no `.btn`; a `span.stop__node` whose text content is "Lesson NN"; `p.stop__sub`; `.stop__k`; a `.stamp` reading "Checked D Mon YYYY".
4. **B** "Start here" appears nowhere on either page. On a first visit the up-next tab reads "First lesson".
5. **B** `main` has one `.btn`, the up-next card's, and it is as wide as the card's inside.
6. **U** `p.route__end` reads "Ready for more? Networking Concepts goes deeper." on How the Internet Works and "New to IT? How the Internet Works is the gentler start." on Networking, each with its link.
7. **U** `main` holds no lesson figure: no `svg.name-tile`, no `.lm-svg`, no `svg[role="img"]`; its only `svg`s are the stamps' ticks (one a ready lesson). The page's HTML has no `astro-slot` and no `<template data-astro-template`. As many `<script>` elements as today (4).
8. **U** No island's `props` attribute contains `summary`, `metaLabel`, `tags` or `note`.
9. **B** The built `/networking` is at most 16 KB gzipped by the build's table (expected about 11) and `/how-the-internet-works` at most 13 KB (expected about 9).

*The islands' states* (U with seeded progress; B for the look)

10. **U** First visit, and storage blocked: tab "First lesson" without `cs-tab--here`; chip `data-state="ahead"` reading "Lesson 01"; button "Start" to the first lesson; every square `ready`; "0 of N lessons done"; every `.stop__k` "Not started"; no `.stop--now`, no `.stop--done`, no `.wlp`.
11. **U** A lesson in progress: tab "Up next" with `cs-tab--here`; chip `here` with that lesson's number; button "Continue" to `?step=<furthest>`; one `current` square; that `li` is `stop--now`, its `.stop__k` is "In progress" with class `go`, it holds a `.wlp` labelled "In progress, at <part>", and its link ends `?step=<furthest>`.
12. **U** A lesson finished and the next not started: tab "Up next"; chip `here`; button "Start"; the next lesson's `li` is `stop--now` with "Not started" and no `.wlp`; the finished one is `stop--done` with "✓ Done".
13. **U** Every lesson finished: tab "✓ Done so far"; chip `done` with the last lesson's number; button "Watch again"; every square `done`; every `li` `stop--done`.
14. **U** The up-next line is the lesson's subtitle with no "Lesson NN ·".
15. **B** JavaScript off: the page is check 10 in full, every lesson link works, and the header's theme button is hidden as today.
16. **B** The up-next card is 186px tall (±1) in checks 10 to 13, at 320, 375, 768 and 1440. The page's height is the same (±1px) on a first visit, with every lesson finished, with JavaScript off and with storage blocked. With one lesson in progress it is the same at 700, 768, 1024, 1200 and 1440 wide, and at most 24px more at 375 and 390 (48px at 320).

*The look*

17. **B** The up-next card: 2px solid border in `--cs-edge`, radius `0 10px 10px 10px`, the box-shadow pair of one card beneath; its tab 34px tall with no bottom border, its foot on the card's top edge.
18. **B** Every `li.stop`: a 2px `--cs-edge` border, 10px corners, a `--cs-card` ground, no box-shadow. At 1440 it is 81px tall (±2), its name and subtitle at the left and its status and stamp right-aligned in one column at the right; at 1024 it is 108px (±2) with the status and stamp on one line under the subtitle; at 375 it is 110px (±2).
19. **B** Chips: 34 × 34px, 2px `--cs-edge` border. Not started: `--cs-card` ground. `stop--now` and the card's `here`: `--cs-here` ground, `--cs-here-ink` number. `stop--done` and `done`: `--cs-done` ground, `--cs-card` number. The number's text is shown in every state.
20. **B** At 700 wide and up: the rail is 2px wide; each stop's chip is centred on it (±1) and level with its card's middle (±1), and a 2px bar joins chip and card. Each part's name has its 16px square on the rail. Below 700: no rail, no square, no bar; the chip is inside its card, 14px from its left edge.
21. **B** Strip squares: 10px wide; `ready` has no fill; `done` fills `--cs-done`; `current` fills `--cs-here` and is 14px tall; each has the inset 1.5px `--cs-edge` ring; a row of squares is 14px tall; at 320 Networking's twenty are on one line. The words are 15px in the sans face.
22. **B** `stop--now` has the wash (a `background-image`) and its `background-color` is still `--cs-card`; no other stop has the wash.
23. **B** The button: at least 48px tall, 2px border, a `3px 3px 0` shadow; pressed, it moves 2px and its shadow is `1px 1px`.
24. **B** Every link in `main` that is not the button is underlined, and none computes to `--link`.
25. **B** Contrast: every pair in §8 at or above its figure (±0.05).
26. **B** The header's and the footer's computed styles on both pages equal today's (ground, borders, nav, radii); the header is `position: sticky` at every width.
27. **B** Home and Tracks: full-page screenshots at 375 and 1440, light and dark, are the same before and after; `/tracks` strip squares are 10px and its up-next kicker reads "First lesson".

*Layout, scroll and the keyboard*

28. **B** With the header's menu open at 320, 375 and 390 the header is 329px tall (±2).
29. **B** At 320, 375, 390, 700, 768, 1024, 1200 and 1440 the document's `scrollWidth` equals its `clientWidth`, in every state; `main` holds no element that scrolls on its own.
30. **B** Tab from the top of the page to the footer, then Shift+Tab back, at 320 × 640, 375 × 812, 390 × 844 and 1440 × 900, with a lesson in progress: `main` has 17 Tab stops on How the Internet Works and 23 on Networking (the crumb, the button, one a lesson, the last line's link); at every stop in `main` the focus ring's top (for a lesson, 5px outside its card) is at or below the header's foot and its foot at or above the window's. Measured: 13px or more clear of the header.
31. **B** The same walk at 320, 375 and 390 with the header's menu open (opened, then Tab on through it into `main`): no focused element in `main` is under the open header, and each focused card's foot is on screen. Measured: 14px or more clear.
32. **B** A focused lesson shows its ring round the whole card (an outline on the `li`, none on the link), and clicking anywhere on a card opens its lesson.
33. **B** Page height, first visit, light (±40px), How the Internet Works / Networking: 2,365 / 2,910px at 1440 × 900; 3,499 / 4,330px at 375 × 812; 3,652 / 4,686px at 320 × 640; 3,474 / 4,305px at 390 × 844.
34. **B** At 1440 × 900, 1280 × 720 and 1024 × 700: scrolled to the last stop, the up-next button is wholly on screen and has not moved; `window.scrollY` is more than 0 (the window scrolls). At 1024 × 650 the side column is not sticky.
35. **B** At 375 each lesson card's left edge is 14px from the screen's (±1) and its right edge 14px from the screen's (±1).
36. **B** The Lesson page's crumb and "Back to the track" land on the page's top; `/networking/how-the-internet-works` still forwards to `/how-the-internet-works`.

## 12. Decisions, one line each

1. The page scrolls and the box inside it goes: scroll keys, the wheel, find-in-page and the sticky header then work as on every other page.
2. The side column is sticky instead of fixed, and only where the screen can hold all of it, so the button is never cut off.
3. A lesson is one link, its name, covering the whole card: one Tab stop a lesson, and twenty "Start" buttons fewer.
4. The page has one filled button, on the up-next card: the way in is in one place, as on Tracks.
5. The up-next card's kicker is its index tab, because a tab is a card's name in this look.
6. "First lesson" replaces "Start here": the phrase belongs to the first track's tab on Home and Tracks.
7. The chip keeps its number in every state (paper, orange, green), because this page is where a lesson's number is read.
8. The up-next lesson's card has the orange chip and the wash; done is a green chip and a green word; colour is never alone.
9. Watch, Learn, Practice are drawn as the strip's squares are, so "where you are" is one language from the track down to the part.
10. With no figure, the card is words in two columns: what the lesson is at the left, where it stands and when it was checked at the right, so a reader runs an eye down either column.
11. The number stays on the rail and is tied to its card by a short bar: without a picture the rail is what makes this page a route and not a list.
12. The card is flat, with nothing beneath: "more behind this one" is kept for the up-next card, the one to act on.
13. The card's form follows its width, not the screen's name: two lines only where the longest subtitle, the marks and the stamp fit, so nothing moves on a desk when progress loads.
14. On a phone the stop in progress grows by one line (22px), as the owner accepted; a spare line on every stop would cost about 440px.
15. Scroll padding is 80px, and 341px while the menu is open: the only way a page can keep focus clear of a header it may not change.
16. Nothing goes into `card-stack.css`, and Tracks' strip rules stay Tracks': no shared rule is edited, so Home and Tracks cannot move.
17. The islands are sent only what they draw.
18. `checkCard` keeps its place and its callers and now proves the stop has no drawing, so the eleven lesson specs still guard each lesson's place on the track.

## 13. Open questions for the owner

None from the design. One thing to know, not to decide: with the drawings off this page and off Tracks, a lesson's spot or name tile is drawn only inside the lessons (as the next lesson's picture); the drawings and `src/lib/figures.ts` are kept.
