# D20: the track page in the "Card stack" look

Job 21, design unit D20 (direction 2.84, 2.103 to 2.105). The track page (`src/pages/[track]/index.astro`, at `/how-the-internet-works` and `/networking`) in Card stack, colour variant A, as on Home (D17) and Tracks (D18), with its layout open at the owner's word: "Go, layout open". Two layouts; the owner picks one at the gate.

The prototype is `prototypes/d20-track-page-card-stack.html`: one self-contained file, built from the two track pages as they are today (`dist/` at revamp fb02521): their header, footer, fonts, Patch's tokens and every lesson's figure, then `src/styles/card-stack.css` as it is, then one block headed "D20". The dark bar at its top is the prototype's own: **Layout 1 Route / 2 Index**, **Track**, **Progress** (First visit, Part way, Track finished, No JavaScript, Storage blocked) and **Theme**. The markup in the file is a first visit, as the server renders it; a short script at the foot works the bar's switches and the header's two buttons (theme, menu), and none of it is built. Resize the window for the widths (375 and 1440; it holds at 320).

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

## 2. The two layouts

Both are Card stack, colour variant A, with the same parts (§5), the same words (§9), the same two islands and one markup; they differ in which element wears the card and in the layout's rules. Both let the page scroll (no box inside the page), so the header is the site's sticky one.

### Layout 1, Route: today's structure

**The idea: the side column beside the route of parts, as the owner drew it on 2026-11-09, restyled and fixed where measured.** The side column (crumb, name, who it is for, the strip, the lesson up next) stays put while the page scrolls the route past it. The route is a rail: a filled square at each part, each lesson's number on the rail, each lesson a card with its figure at the left. On a phone the side column comes first, the rail goes, and each lesson is a small card with its number beside its name.

```
1440                                                      375
Tracks / Networking Concepts   ■ The big picture  2 less.  Tracks / Networking…
Networking                     │ ┌─────┬────────────────┐  Networking
Concepts                      [01]│ fig │ OSI Model      │  Concepts
How devices find …             │ │     │ One big job …  │  How devices find …
□□□□□□□□□□□□□□□□□□□□           │ │     │ Not st.  ✓ Chk │  □□□□□□□□□□□□□□□□□□□□
0 of 20 lessons done           │ └─────┴────────────────┘  0 of 20 lessons done
[First lesson]                [02]┌─────┬────────────────┐  [First lesson]
┌──────────────────┐┐          │ │ fig │ Packets        │  ┌──────────────────┐┐
│[01] OSI Model    ││          │ └─────┴────────────────┘  │[01] OSI Model    ││
│ One big job …    ││          ■ Addresses & the local …   │[     Start      ]││
│[     Start      ]││          │ …                         └──────────────────┘┘
└──────────────────┘┘          (the side column stays;     The big picture 2 les.
                                the page scrolls)          ┌──────────────────┐
                                                           │fig [01] OSI Model│
                                                           │    One big job … │
                                                           │Not started ✓ Chk │
                                                           └──────────────────┘
```

### Layout 2, Index: the track as a card file (recommended)

**The idea: the whole track on a desk in two screens. The head across the top, the lesson up next at its right; under it one tabbed card a part, three across, each lesson a row.** A part is the thing Card stack's index tab was made for: the tab is the part's name, the card holds its lessons, and a reader sees the track's shape (six parts, what is in each, what is done) before reading a single row. On a phone the cards run down the page, one a part.

```
1440                                                        375
Tracks / Networking Concepts              [First lesson]    Tracks / Networking…
Networking Concepts                       ┌─────────────┐┐  Networking
How devices find each other …             │[01] OSI Mod.││  Concepts
□□□□□□□□□□□□□□□□□□□□ 0 of 20 lessons done │[   Start   ]││  How devices find …
                                          └─────────────┘┘  □□□□□□ 0 of 20 …
[The big picture] 2 l.  [Addresses & …] 4 l.  [Getting …]   [First lesson]
┌──────────────────┐    ┌──────────────────┐  ┌──────────┐  ┌─────────────────┐┐
│fig [01] OSI Model│    │fig [03] IP Addr. │  │fig [07] …│  │[01] OSI Model   ││
│    One big job … │    │    Where a dev … │  │          │  │[     Start     ]││
│Not started ✓ Chk │    │Not started ✓ Chk │  │          │  └─────────────────┘┘
├──────────────────┤    ├──────────────────┤  ├──────────┤  [The big picture] 2
│fig [02] Packets  │    │fig [04] MAC Addr.│  │fig [08] …│  ┌──────────────────┐
└──────────────────┘    ├──────────────────┤  ├──────────┤  │fig [01] OSI Model│
                        │fig [05] Switch   │  │fig [09] …│  │Not started ✓ Chk │
[Talking across …]      │fig [06] ARP      │  └──────────┘  ├──────────────────┤
…                       └──────────────────┘                │fig [02] Packets  │
                                                            └──────────────────┘
```

### What each fixes, measured

Chromium, the prototype with its bar left out, a first visit (No JavaScript, Storage blocked and Track finished measure the same, to the pixel).

| | Today | Layout 1, Route | Layout 2, Index |
|---|---|---|---|
| Page, 1440 × 900 (How the Internet Works / Networking) | one screen, a route of 3,861 / 5,018px in an 831px box | **2,783 / 3,513px**, the page's own scroll (3.1 / 3.9 screens) | **1,729 / 1,977px** (1.9 / 2.2 screens) |
| Page, 375 × 812 | 7,129 / 9,544px | **3,613 / 4,647px** (−49% / −51%) | **3,346 / 4,184px** (−53% / −56%) |
| Page, 320 × 640 | 7,257 / 9,897px | 3,785 / 4,975px | 3,437 / 4,402px |
| Page, 390 × 844 | | 3,589 / 4,567px | 3,321 / 4,104px |
| Page, 768 × 1024 | | 3,243 / 3,973px | 2,248 / 2,801px (two cards across) |
| One lesson, 1440 | 179px | 110px (752 wide, figure 150 × 106) | 114 to 134px (391 wide, figure 88 × 62) |
| One lesson, 375 | 347 to 371px | 118 to 136px | 114 to 134px |
| Whole lessons on the first screen, 1440 | 3 | 5 | 8 / 9, and every part's name on How the Internet Works |
| The filled button's foot, 1440 | y 782 | y 618 / 665, and it stays on screen at every scroll (screens 1024 wide and 700 tall, or more) | y 307; it leaves the screen after 240px of scroll |
| The filled button's foot, 375 | y 570 / 595 | y 617 | y 617 |
| Sideways scroll at 320, 375, 390, 768, 1024, 1440 | none | none | none |
| Tab stops in `main` | 31 / 43, two a lesson | **17 / 23, one a lesson** | **17 / 23, one a lesson** |
| Focus under the sticky header (Tab and Shift+Tab, §11 check 30) | the root has no scroll padding | never: 11px or more clear, menu closed and open | never: 17px or more clear, menu closed and open |
| Part way: what moves when progress loads | the side card's figure swaps | on a desk nothing; below 700px the stop in progress grows 22px (44px at 320) | the row in progress grows 22px (44px at 320) |

**Layout 2 is recommended.** Measured: on a desk the whole track is two screens against three to four, eight or nine lessons are whole on the first screen against five (today three), and on How the Internet Works all six parts are named on it; on a phone it is 7 to 10% shorter than layout 1. It also puts the look's own device to its use: an index tab names what a card holds. **Layout 1 buys** two things: it is the owner's own structure, strictly one column in order; and on a desk the lesson up next and its button never leave the screen. It costs a page nearly twice as long on a desk. In both, the filled button's foot on a phone is 22 to 47px lower than today's (the card's index tab is 34px), still on the first screen at 375 × 812; at 320 × 640 its foot is at y 642, 2px under the fold.

The keyboard figures come from focusing every stop in `main` in order and back from script, which scrolls as Tab does, at 320, 375, 390, 768 and 1440 (and 1280 × 720), the menu closed and, below 960, open; one walk was repeated with the Tab key. The footer's own links are not this page's: going forward, a footer link's ring can end 5px under the window's foot, as on every page.

In layout 2 the parts read across, then down (parts 1, 2, 3 in the first row). The cards in a row are as tall as their own lessons, so a row's feet are ragged; nothing is stretched to fill.

## 3. Tokens, and the shared Card stack stylesheet

**No new token, no new colour, and no line of `src/styles/card-stack.css` changes.** The page imports it (it is Part 1 of the prototype's D20 block, copied as it stands) and reads its `--cs-*` names and Patch's tokens; nothing goes into `src/styles/tokens.ts`. The ground is `--ground`.

**What importing it does to this page, drawn so in the prototype:**

| Part of `card-stack.css` | Reaches | Result on this page |
|---|---|---|
| `main .btn`, `main .btn--primary` | the page's one button | 48px, 2px edge, 3px offset edge, pressed in when pressed |
| `main, .lm-defs { --fig-bg … }`, `#main .lm-svg { --anatomy-… }` | every lesson's drawn spot | white faces on paper, no glow, no rings, the lit part in `--cs-here`; no figure is redrawn |
| `.cs-card`, `.cs-card--beneath`, `.cs-tab`, `.cs-tab--here` | opt-in by class | the up-next card and its tab in both layouts; each lesson's card in layout 1; each part's card and tab in layout 2 |

The name tiles and the stamp are not reached by the figure tint (they read `site.css`): the stamp is as on Home; the tiles are re-tinted by two of the page's own rules (§5.5).

**Nothing is added to `card-stack.css` (plan decision 5).** Every part this page adds is its own: the stop, the rail, the part's count, the marks. Two parts look like Tracks' and stay separate on purpose: the strip (Tracks' rules are under `.tp` in `tracks.astro` and stay Tracks'; this page restates the same values under `.tk`) and the up-next card (here a tabbed card with a chip that keeps its number; on Tracks a quiet box with a tick). Home and Tracks do not change by a pixel: no shared rule is edited.

**`hub.css` after B25** holds only what `TrackStrip` and Tracks still read: the seven `.strip…` rules as they are today (Tracks reads them under its own) and `.wholetrack`. Its `.wlp…`, `.panel__cta`, `.next…`, `.side-now…`, `.route…` and `.stop…` rules go; this page's rules are in `[track]/index.astro`'s `<style>`, written `.tk :global(…)` where they reach an island's markup. The prototype includes today's `.strip…` rules before the D20 block, so the cascade shown is the cascade built.

## 4. Type

The site's three families in their Patch roles, as D17 and D18.

| Use | Face | Size / line | Colour |
|---|---|---|---|
| Crumb | Atkinson Hyperlegible Next 400 | 15px / 1.4 | link `--ink-strong`, underlined `--cs-hair` 1.5px; the slash `--muted`; the page's name `--ink` |
| h1, the track's name | Barlow Semi Condensed 700 | `clamp(40px, 4.6vw, 60px)` / 0.98, `-0.012em`, `text-wrap: balance` (60 at 1440, 40 at 375); in layout 1's side column 52px, and 44px where the screen is 820px tall or less | `--ink-strong` |
| Who it is for | Atkinson 400 | 16.5px / 1.5, max 36em | `--ink` |
| Progress words ("5 of 20 lessons done") | Atkinson 400 | 15px / 1.3 | `--muted` |
| Up-next tab (the kicker) | Barlow 600 | 16px / 1 (`.cs-tab`) | `--ink-strong` |
| Up-next title | Barlow 700 | 24px / 1.15 | `--ink-strong` |
| Up-next line (the lesson's subtitle) | Atkinson 400 | 15px / 1.45, two lines kept | `--muted` |
| Lesson number, on a chip | Atkinson Hyperlegible Mono 700 | 14px | by state (§5.4) |
| Button | Barlow 600 | 18px / 1.2 | as D17 |
| Part's name (h2) | Barlow 700; in layout 2 the tab, Barlow 600 | layout 1: 28px / 1.15 (24px at 860 and below); layout 2: 16px / 1 (15px below 360) | `--ink-strong` |
| Part's count ("4 lessons") | Atkinson 400 | 15px / 1.3 (layout 2: 14.5px) | `--muted` |
| Lesson's name (h3, the link) | Barlow 700 | 21px / 1.2, underlined `--cs-hair` 2px | `--ink-strong` |
| Lesson's subtitle | Atkinson 400 | 15px / 1.45 | `--muted` |
| Status | Barlow 600 | 15px / 1.3, `0.01em` | Not started `--muted`; In progress `--ink-strong`; ✓ Done `--cs-done-text` |
| Watch, Learn, Practice | Atkinson 400; the part you are at 700 | 13.5px / 1.3 | `--muted`; the part you are at `--ink-strong` |
| Stamp | Barlow 600 | 14px / 1.3 (`site.css`, unchanged) | `--ink`, its tick `--allowed-text` |
| The line on to the other track | Atkinson 400 | 16.5px / 1.5 | `--ink`, link `--ink-strong` |

No word is picked out in a colour: the `<em>` on each name's last word (the h1, every part) goes, as on Home and Tracks.

## 5. Components and their states

### 5.1 The head (`div.side`)

In markup order: the crumb (`nav.crumbs`, as today: "Tracks", a slash, the track's name with `aria-current="page"`), the `h1`, who it is for (`p.lede`, the track's description as it is), then the `TrackSide` island: the strip and the up-next card. `.tk` has `padding-top: clamp(24px, 3vw, 40px)` and `padding-bottom: 8px`. The crumb's link is `inline-block` with `padding: 4px 0` (29px tall). h1 `margin-top: 8px`; who it is for `margin-top: 14px`.

### 5.2 How far this browser has got (`TrackStrip`, unchanged markup)

As on Tracks (D18 §5.3), the same numbers: one square a lesson, 10 × 10px, 2px corners, 3px apart (2px below 360px wide, so twenty squares stay on one line at 320), each with a 1.5px `--cs-edge` ring; the words 12px to their right, or under them where they do not fit.

| Square | Fill | Size |
|---|---|---|
| Not done (`ready`) | none | 10 × 10 |
| Done | `--cs-done` | 10 × 10 |
| Up next (`current`, only when the kind is not "start") | `--cs-here` | 10 × 14 |
| Not ready (none today) | none, a `--cs-hair` ring | 10 × 10 |

Every row of squares is 14px tall in every state. `margin-top: 16px`.

### 5.3 The lesson up next and its way in (`div.upnext.cs-card.cs-card--beneath`)

A card with one card beneath it; **its index tab is the kicker**; inside, the lesson's number chip and name on one line, the lesson's subtitle under the name (46px in), and the page's one filled button, as wide as the card. It shows **no figure** (§7), so nothing in it swaps when progress loads. Padding `18px 18px 20px`; `max-width: 480px`; `margin-top: 58px` (50px at 860 and below), of which 34px is the tab. Two lines are always kept for the subtitle (`min-height: 2.9em`), so the card is 186px tall for every lesson, in every state, at every width (Tracks' E9).

| Island state | Tab | Chip | Button | Strip |
|---|---|---|---|---|
| First visit (and No JavaScript, and Storage blocked: the server's render) | First lesson | paper, the number in ink | Start | all hollow |
| Part way, the lesson up next in progress | Up next, with the 9px here marker (`.cs-tab--here`) | `--cs-here`, the number in `--cs-here-ink` | Continue (to `?step=`) | done green; the lesson's square orange and tall |
| Part way, the next lesson not started | Up next, with the marker | `--cs-here` | Start | the same |
| Every ready lesson done | ✓ Done so far | `--cs-done`, the number in `--cs-card` | Watch again | all green |

The chip reads "Lesson 05" to a screen reader (`<span class="sr-only">Lesson </span>05`). The line under the name is the lesson's subtitle alone: the chip gives the number, so `lessonLine`'s "Lesson 05 · " is not repeated (as on Tracks).

### 5.4 A lesson (`li.stop`)

One link: the lesson's name, underlined, whose `::after` covers the whole stop, so the stop is one target (343 × 114px or more on a phone, 110px tall on a desk in layout 1) and **one Tab stop**. The figure is no longer a second link; it is a `span`, `aria-hidden` as today. There is no button on a stop.

Its parts: the number chip (`span.stop__node`, 34 × 34px, 6px corners, 2px edge, read as "Lesson 03"); the figure (`.stop__art`, `aspect-ratio: 528 / 372`); the name (`h3 > a`); the subtitle; and the foot (`div.stop__foot`): the status at the left, with Watch, Learn, Practice after it once the lesson is begun, and the stamp at the right. Where the two do not fit on a line the stamp goes under.

| Lesson's state | `li` class | Chip | Status | Marks | Link |
|---|---|---|---|---|---|
| Not started | `stop` | paper, the number in ink | Not started (`--muted`) | none | the lesson |
| In progress, and the lesson up next | `stop stop--now` | `--cs-here`, number in `--cs-here-ink` | In progress (`--ink-strong`) | shown | the lesson at `?step=` |
| In progress, another lesson opened later | `stop` | paper | In progress | shown | the lesson at `?step=` |
| Not started, and the lesson up next after a first visit | `stop stop--now` | `--cs-here` | Not started | none | the lesson |
| Done | `stop stop--done` | `--cs-done`, the number in `--cs-card` | ✓ Done (`--cs-done-text`) | none | the lesson |
| Not ready (none today) | `stop stop--soon` | dashed edge, the number `--muted` | Not ready yet | none | no link; no figure; in layout 1 the card's edge is dashed |

`stop--now` also has the pale orange wash over the whole stop (`background-image: linear-gradient(var(--cs-here-wash), var(--cs-here-wash))`, so the paper stays under it), as a step on show has on Home. Colour is never the only signal: the status is a word, and the chip keeps its number in every state.

Hover: the name's underline turns ink. Keyboard focus: the link itself has no outline; the stop has it (`.stop:has(h3 a:focus-visible)`: 2px `--focus`, 3px outside the card in layout 1; 4px inside the row in layout 2, 7px corners). The link has `scroll-margin: 24px 0 150px`, so a focused stop is wholly on screen, clear of the header.

**Two forms.** The wide form (layout 1 at 700px and up): the figure 150px wide at the card's left with a 2px rule at its right, the words beside it (padding `12px 18px`), the foot at the bottom, the chip on the rail. The narrow form (layout 2 at every width; layout 1 below 700px): a grid `88px minmax(0,1fr)`, 12px apart, padding `12px 14px`; the figure 88 × 62px with a 1.5px `--cs-hair` ring and 6px corners; the chip beside the name (the name is `padding-left: 44px`, `min-height: 34px`, and the chip sits at `left: 114px; top: 12px`); the subtitle under the name; the foot across the whole stop, 8px under.

### 5.5 A lesson's figure

Each stop shows its lesson's figure as today's page gives it: a drawn spot (Networking's 16 own lessons) or a name tile (How the Internet Works' 14, and Networking's 4 shared lessons). The spots are re-tinted by `card-stack.css`. The tiles are re-tinted by the page: the rule under the name is `--cs-edge`, not orange (on this page orange is "here" and "do this" only), and **the full name under it is not drawn** (`.nt-full { display: none }`; it stays in the markup): at these sizes it would be 4 to 6px. The dotted ground behind a tile goes; a figure sits on paper.

### 5.6 Watch, Learn, Practice (`PartsMarker`, unchanged markup)

Three marks in the strip's language, each with its name: a 14 × 8px box with a 1.5px `--cs-edge` ring; done is `--cs-done`; the part you are at is `--cs-here`, 12px tall, its name bold in `--ink-strong`. 10px apart, 5px between a box and its name. Shown only for a lesson in progress. The `role="img"` label is today's ("In progress, at Learn").

### 5.7 A part (`section.route-stage`)

Its name (`h2`, `id="stage-<n>"`), its count (`p.route-stage__count`: "2 lessons", "1 lesson"), its lessons (`ol.route-stops`). Layout 1: the name is a heading on the ground with a 16px filled square on the rail, the count beside it. Layout 2: the section is the card and the name is its index tab; the count sits at the right above the card's edge.

### 5.8 Buttons, links, the line on

One filled button on the page (the up-next card's). Links are ink, underlined in `--cs-hair`, ink on hover, as Home and Tracks; a focused link has 3px corners, a focused button 8px. The crumb's link, the button and the last line's link have `scroll-margin-block: 12px`. The last line (`p.route__end`) is today's words, `margin-top: 36px`.

## 6. The layouts, section by section

Measured at 1440 × 900 and 375 × 812, light, the prototype's bar left out.

**Both layouts.** `html { scroll-padding-top: 80px }` and, while the header's menu is open, `341px` (§10). Cards outside the wrap's 32px gutter at 860 and below sit 14px in from the screen's edges, as on Tracks: the up-next card `margin-inline: -18px calc(-18px + var(--cs-stack))`.

**Layout 1, Route**

| | 1024 and up | 700 to 1023 | below 700 |
|---|---|---|---|
| Page | grid `minmax(300px, 360px) minmax(0, 1fr)`, column gap `clamp(40px, 5vw, 72px)`, `align-items: start` | one column: the head, then the route 40px under | the same |
| Side column | column 1, both rows; `position: sticky; top: 92px` where the screen is 700px tall or more (below that it scrolls with the page); h1 52px (44px at 820px tall or less) | on top, full width | on top |
| Route | column 2; `padding-left: 56px`; the rail a 2px `--cs-hair` line at `left: 16px` from 12px under the top to 24px above the foot | the same | no rail, no padding |
| A part | 36px after the last; the name 28px with a 16px `--cs-edge` square on the rail (`left: -47px; top: 0.28em`, a 5px `--ground` ring), the count beside it (12px) | the same | the name 24px, no square |
| Lessons | `display: grid; gap: 12px`, 14px under the name; each `li.stop.cs-card`, the wide form, 752 × 110px; the chip on the rail (`left: -58px`, centred on the card, a 4px `--ground` ring) | the same | the narrow form, each card `margin-inline: -18px` (347px wide at 375), the chip beside the name |
| The last line | column 2, `padding-left: 56px` | under the route | under the route |

Measured: the side column is 360 × 578px (Networking, 1440 × 900, its foot at y 687); at 1280 × 720 its foot is at y 669 and at 1024 × 700 at y 660 (the card beneath included), so the button is on screen wherever the column is sticky.

**Layout 2, Index**

| | 1100 and up | 861 to 1099 | 700 to 860 | below 700 |
|---|---|---|---|---|
| Head | grid `minmax(0, 1fr) minmax(320px, 400px)`, column gap `clamp(32px, 5vw, 80px)`: crumb, name, who, strip in column 1; the up-next card in column 2 across all four rows, `align-self: end`, `margin-top: 34px` | the same | one column, the card under the strip | the same |
| Parts (`div.route`) | grid, three columns, gap `62px 28px` (34px of the row gap is the tabs), `align-items: start`, `margin-top: 76px` | two columns | two columns | one column, gap 54px, `margin-top: 70px`, each card `margin-inline: -18px` |
| A part | `section.route-stage.cs-card`, its `h2.cs-tab`; the count `position: absolute; right: 2px; bottom: 100%`, `line-height: 30px` | the same | the same | the same; below 360 the tab is 15px with 10px padding, so the longest name and its count share the line (18px apart at 320) |
| Lessons | rows in the narrow form, a 1.5px `--cs-hair` line between rows; 391px wide | | | 343px wide at 375 |
| The last line | under the grid | | | |

The prototype's `html[data-pl='1']` and `html[data-pl='2']` prefixes are the switch's only; the chosen layout's rules are written under `.tk` alone and the other layout's are left out. The prototype's script also moves three classes with the switch, which the build writes once: layout 1 has `cs-card` on each `li.stop`; layout 2 has `cs-card` on each `section.route-stage` and `cs-tab` on its `h2`.

## 7. The page's weight: ruled

**Each stop keeps its lesson's figure, once. The up-next card shows no figure. The islands are sent only what they draw.**

Measured on today's built pages (gzip level 9 of `dist/<track>/index.html`; the build's own table reads about 1% higher, 221.9 KB for the first row):

| | `/networking` | `/how-the-internet-works` |
|---|---|---|
| Today | 220.3 KB | 11.6 KB |
| The side card's figure out (OSI Model is no longer in the HTML twice) | 209.0 KB (−11.3) | 11.5 KB |
| And the islands' props without `summary`, `meta`, `metaLabel`, `tags` and each place's `note`, which neither island reads (S22 Part 2) | **205.6 KB** (−3.4) | **9.4 KB** (−2.1) |
| For comparison, no lesson figure at all | 10.7 KB | 8.9 KB |

So `/networking` will be **about 207 KB by the build's measure, 43 KB under the budget** (the builder to measure), and How the Internet Works about 9.5 KB.

Why the figures stay: this page is now the only place a lesson's drawn spot is shown outside its lesson (Tracks dropped them in job 18, on the ground that "a lesson's figure is the track page's job", D18 §7); eleven lesson specs check each spot on this page (`checkCard`); and a list of twenty lessons with no picture is a table of contents for a site whose lessons are pictures. Why the up-next card has none: it was the one figure sent twice, it needed a copy made in the browser for any lesson but the first (`BorrowedArt`), and it swapped when progress loaded.

What this does not fix, said plainly: a spot is about 13 KB gzipped (40 to 86 KB raw) however small it is shown, because it is drawn geometry, not a picture file; rounding its numbers saves nothing (they are already at one decimal). Networking has all 20 of its lessons, so the page does not grow; a track with more than about 18 drawn lessons would cross 250 KB, which is A+'s question when it has lessons. Taking the figures off this page is the one move that changes the weight (to about 11 KB), and it is open question 2.

Not taken: figures as separate lazy files (an image cannot read the page's theme or fonts, so each would need a light and a dark file and its lettering would change face); a cover in the head (about 17 KB more, for a picture the reader has just clicked on Tracks).

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
| The rail, the line between rows, a figure's ring (`--cs-hair`; decoration: the chips and the words carry it) | 2.12 to 2.17 | 2.20 to 2.24 |

Every pair of words passes in both themes.

## 9. Every word: new, changed, moved, removed

| | Today | D20 |
|---|---|---|
| Changed | the side card's kicker on a first visit: "Start here" | **"First lesson"**, as on Tracks. Ruling on 2.87: "Start here" leaves this page. On Home and Tracks it is the first track's tab; on `/networking`, the track those pages call "Then go deeper", it said the opposite |
| Moved | the kickers "Up next" and "✓ Done so far", inside the side card | the same words, on the card's index tab |
| Removed | "Lesson 05 · " before the up-next line | the chip shows the number; the line is the subtitle alone (as on Tracks) |
| Removed | the button on every stop: "Start" (20 on a first visit to Networking), "Continue", "Watch again" | nothing in its place: the lesson's name is the link and the status says where it stands. The three words stay on the up-next card's button |
| New, for screen readers only | | "Lesson " before each chip's number (the up-next card's and every stop's) |
| Not drawn | a name tile's full name ("Hypertext Transfer Protocol"), 7px on a desk today and hidden from screen readers | still in the markup, not shown (§5.5; open question 4) |
| Kept, never shown today | "Lessons not ready yet stay on the route, so you can see what is coming." (only when a lesson is not ready) | kept as written in layout 1. In layout 2 nothing is called a route, so: "Lessons not ready yet stay in their part, so you can see what is coming." |
| Kept | "Tracks", the two names, the two descriptions, "N of M lessons done", "Up next", "✓ Done so far", "Start", "Continue", "Watch again" (the card), the twelve part names, "N lessons" and "1 lesson", every lesson's name and subtitle, "Not started", "In progress", "✓ Done", "Watch", "Learn", "Practice", "Checked D Mon YYYY", "Ready for more? Networking Concepts goes deeper.", "New to IT? How the Internet Works is the gentler start.", the labels "Breadcrumb" and "In progress, at Learn" | |

No lesson word changes. No time figure, no score, no exam tag.

## 10. For the builder

- **The prototype's D20 block is the CSS.** Part 1 is `src/styles/card-stack.css`, unchanged: import it, edit nothing in it. Part 2 is the page's own rules: the chosen layout's `html[data-pl='N']` prefix is dropped (its rules are then under `.tk` alone), the other layout's rules are left out, and both "narrow form" blocks become one for the chosen layout. Part 3 and the script are the prototype's and are not built. Where this document and the block differ, the block is right and this is an erratum.
- **`[track]/index.astro`.** Import `card-stack.css`. `<BaseLayout … current="tracks">` with no `split` and no `footer={false}`: the page scrolls and the layout renders the footer after `main`, as on every other page. Inside `main`: `<div class="wrap tk">` holding, in this order, `div.side` (the crumb as today; `<h1 class="disp">{track.title}</h1>` with no `<em>`; `p.lede`; the `TrackSide` island with **no slots**), the `TrackRoute` island with every `art<n>` slot as today, and `p.route__end` (today's words; its "stay on the route" sentence as §9 says). No `.routebox`, no `.routebox__in`. Drop `head` and `last`. Astro's `astro-island { display: contents }` keeps the islands' roots as the grid's items, as today.
- **`split` is then used by no page.** Remove the prop from `BaseLayout.astro` and the `body.split` rules from `global.css` (`:190-205`); they are this change's orphans. `grep -rn "split" src/pages src/layouts src/styles` shows no user left.
- **Scroll padding** (in the page's `<style>`): `:global(html) { scroll-padding-top: 80px; }` and `:global(html:has(#menu-panel:not([hidden]))) { scroll-padding-top: 341px; }`. The open header measures 329px at 320 to 959px wide on this page (five links, no Start learning button); 341 is that and 12px. If the menu's links change, this number changes with them: check 31 pins it.
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
    <section class="route-stage" aria-labelledby="stage-1">          <!-- layout 2: + cs-card -->
      <h2 class="disp" id="stage-1">The big picture</h2>              <!-- layout 2: + cs-tab; no <em> -->
      <p class="route-stage__count">2 lessons</p>
      <ol class="route-stops" role="list">
        <li class="stop">                                             <!-- layout 1: + cs-card; + stop--now | stop--done as today -->
          <span class="stop__node"><span class="sr-only">Lesson </span>01</span>
          <div class="stop__tile">
            <span class="stop__art l-art" aria-hidden="true"><span class="stop__slot">{art}</span></span>
            <div class="stop__info">
              <h3 class="disp"><a href="{lessonHref}">OSI Model</a></h3>
              <p class="stop__sub">One big job, split into seven layers</p>
              <div class="stop__foot">
                <p class="stop__state"><span class="stop__k [go|done]">Not started</span>{PartsMarker, in progress only}</p>
                <Stamp stamp={lesson.stamp} sources={false} />
              </div>
            </div>
          </div>
        </li>
  ```

  Gone: `header.route-stage__head`, `span.route-stage__mark`, `Named` and its `<em>`, `a.stop__art` (now a `span`), `data-art`, `div.stop__acts` and its button. `actionLabel` stays for the up-next card. The slot stays keyed by lesson. A lesson not ready: `li.stop.stop--soon` with the chip, no `.stop__art`, the name in an `h3` with no link, and `stop__k` "Not ready yet"; no stamp. In the prototype each `h2`'s id has a track prefix and each `li` a `data-n`, only because both tracks are in one file.
- **Selectors the suite reads still match:** `main .route li.stop:not(.stop--soon)` with its `h3 a` and `.stamp` (`e2e/global-setup.ts:22-40`, `support.ts:39-42`, `lesson-layout.spec.ts:543`); `main .route .route-stage li.stop`, `main .route .route-stage h2`, `main .side .strip__w`, `.stop__k` (`site.spec.ts:53-64`); each stop's `svg[role="img"]` and its index (`e2e/batch1.ts:85-96`, `router.spec.ts:186`), so `checkCard` does not change; `svg.name-tile` on each How the Internet Works stop and two `.nt-full` in TLS's (`site.spec.ts:648-650`; counted in the DOM, not shown).
- **The islands are sent only what they draw** (§7): at the page, give `TrackRoute` and `TrackSide` no `summary`, `meta`, `metaLabel` or `tags`, and each place only its `parts`. `trackParts` and its nine tests stay as they are; the page picks the fields.
- **`hub.css`** keeps its `.strip…` rules and `.wholetrack` as they are and loses the rest (§3). Check Tracks after: its squares are 10px with Tracks' own rules, as before.
- **Motion.** The page adds no transition of its own; the button's is `card-stack.css`'s. Under `prefers-reduced-motion` nothing differs.
- **Tests that pin today's page move, once:** `src/lib/tracks-render.test.ts:197-208` (the importers of `card-stack.css` are now three; the track page, `hub.css` and `hub.ts` leave the "not in the diff" list); `e2e/tracks-card-stack.spec.ts:612-621` (`/networking`'s scroll padding is 80px), `:776-792` and `:793-798` (the track page now reads `--cs-edge`, 10px squares, the button's 2px edge; "Start here" is not on it); `TrackSide.test.tsx` (the kicker, the figure tests at `:62-79` and `:126-155` go); `TrackRoute.test.tsx` (the `em`, the figure link, the buttons, `data-art`); `TrackPanelProgress.test.tsx:56`; `hub.test.ts` (`lessonLine`, the kicker); `e2e/site.spec.ts:588` (the first Start, "Start here", the side button's selector), `:639`, `:661` (the window now scrolls; the route box is gone: in layout 1 the test becomes "the side card's button stays on screen while the page scrolls to the last stop"), `:687` (1280 × 720: the button on screen; no `.side-now__art`); the `@visual` `track` and `track-internet` shots, by design.

## 11. Acceptance checks

**B** needs a real browser; **U** can be a unit test (vitest, the page or an island rendered). Unless said, each holds on both tracks at 375 × 812 and 1440 × 900, light and dark, for the chosen layout. A read after a state or focus change waits with `transitionsDone`.

*What the page says*

1. **U** `main` holds one `div.wrap.tk` with, in order: `nav.crumbs` (a link "Tracks" to `/tracks`, then the track's name with `aria-current="page"`), the `h1` (the track's title, no `em`), `p.lede` (the track's description), `.strip`, `.upnext`, `div.route`, `p.route__end`. No `em` anywhere in `main`. No `.routebox`.
2. **U** `/networking` has six `section.route-stage` and twenty `li.stop` in the order of `networking.ts`; `/how-the-internet-works` six and fourteen. Each section's `h2` is the part's title and its `p.route-stage__count` reads "N lessons" ("1 lesson" for The seal).
3. **U** Each ready `li.stop` holds exactly one `a`, inside its `h3`, to the lesson; no `button`, no `.btn`; a `span.stop__node` whose text content is "Lesson NN"; `p.stop__sub`; `.stop__k`; a `.stamp` reading "Checked D Mon YYYY".
4. **B** "Start here" appears nowhere on either page. On a first visit the up-next tab reads "First lesson".
5. **B** `main` has one `.btn`, the up-next card's, and it is as wide as the card's inside.
6. **U** `p.route__end` reads "Ready for more? Networking Concepts goes deeper." on How the Internet Works and "New to IT? How the Internet Works is the gentler start." on Networking, each with its link.
7. **B** Each How the Internet Works stop has an `svg.name-tile`; TLS/SSL's has two `.nt-full`, neither shown; each of Networking's 16 own lessons has its drawn `svg[role="img"]` with today's `aria-label`, at today's index (`checkCard` unchanged).
8. **U** The page has as many `<script>` elements as today (4). The `TrackSide` island has no `astro-slot`; each lesson's figure is in the HTML once (`/networking`: 16 SVGs over 5,000 bytes, not 17).
9. **U** No island's `props` attribute contains `summary`, `metaLabel`, `tags` or `note`.
10. **B** The built `/networking` is at most 212 KB gzipped by the build's table (expected about 207), and `/how-the-internet-works` at most 12 KB.

*The islands' states* (U with seeded progress; B for the look)

11. **U** First visit, and storage blocked: tab "First lesson" without `cs-tab--here`; chip `data-state="ahead"` reading "Lesson 01"; button "Start" to the first lesson; every square `ready`; "0 of N lessons done"; every `.stop__k` "Not started"; no `.stop--now`, no `.stop--done`, no `.wlp`.
12. **U** A lesson in progress: tab "Up next" with `cs-tab--here`; chip `here` with that lesson's number; button "Continue" to `?step=<furthest>`; one `current` square; that `li` is `stop--now`, its `.stop__k` is "In progress" with class `go`, it holds a `.wlp` labelled "In progress, at <part>", and its link ends `?step=<furthest>`.
13. **U** A lesson finished and the next not started: tab "Up next"; chip `here`; button "Start"; the next lesson's `li` is `stop--now` with "Not started" and no `.wlp`; the finished one is `stop--done` with "✓ Done".
14. **U** Every lesson finished: tab "✓ Done so far"; chip `done` with the last lesson's number; button "Watch again"; every square `done`; every `li` `stop--done`.
15. **U** The up-next line is the lesson's subtitle with no "Lesson NN ·"; the up-next card has no `svg`.
16. **B** JavaScript off: the page is check 11 in full, every lesson link works, and the header's theme button is hidden as today.
17. **B** The up-next card is 186px tall (±1) in checks 11 to 14, at 320, 375, 768 and 1440. The page's height is the same (±1px) on a first visit, with every lesson finished, with JavaScript off and with storage blocked; with one lesson in progress it is at most 24px more (48px at 320), and in layout 1 at 700px wide and up it is the same.

*The look*

18. **B** The up-next card: 2px solid border in `--cs-edge`, radius `0 10px 10px 10px`, the box-shadow pair of one card beneath; its tab 34px tall with no bottom border, its foot on the card's top edge.
19. **B** Layout 1: every `li.stop` has a 2px `--cs-edge` border and 10px corners; no `section.route-stage` has a border. Layout 2: every `section.route-stage` has the border, its `h2` is a 34px tab, and no `li.stop` has a border but the 1.5px line above every row after the first.
20. **B** Chips: 34 × 34px, 2px `--cs-edge` border. Not started: `--cs-card` ground. `stop--now` and the card's `here`: `--cs-here` ground, `--cs-here-ink` number. `stop--done` and `done`: `--cs-done` ground, `--cs-card` number. The number's text is shown in every state.
21. **B** Strip squares: 10px wide; `ready` has no fill; `done` fills `--cs-done`; `current` fills `--cs-here` and is 14px tall; each has the inset 1.5px `--cs-edge` ring; a row of squares is 14px tall; at 320 Networking's twenty are on one line. The words are 15px in the sans face.
22. **B** `stop--now` has the wash (a `background-image`) and no other stop has; in layout 1 its paper is still under it (the card's `background-color` is `--cs-card`).
23. **B** The button: at least 48px tall, 2px border, a `3px 3px 0` shadow; pressed, it moves 2px and its shadow is `1px 1px`.
24. **B** Every link in `main` that is not the button is underlined, and none computes to `--link`.
25. **B** In every drawn figure in `main`, `--pool-op` and `--halo-op` compute to 0 and `.lm-orbit` is not displayed; a name tile's `.nt-rule` fills `--cs-edge`.
26. **B** Contrast: every pair in §8 at or above its figure (±0.05).
27. **B** The header's and the footer's computed styles on both pages equal today's (ground, borders, nav, radii); the header is `position: sticky` at every width.
28. **B** Home and Tracks: full-page screenshots at 375 and 1440, light and dark, are the same before and after; `/tracks` strip squares are 10px and its up-next kicker reads "First lesson".

*Layout, scroll and the keyboard*

29. **B** At 320, 375, 390, 768, 1024 and 1440 the document's `scrollWidth` equals its `clientWidth`, in every state; `main` holds no element that scrolls on its own.
30. **B** Tab from the top of the page to the footer, then Shift+Tab back, at 320 × 640, 375 × 812, 390 × 844 and 1440 × 900, with a lesson in progress: `main` has 17 Tab stops on How the Internet Works and 23 on Networking (the crumb, the button, one a lesson, the last line's link); at every stop in `main` the focus ring's top (the stop's own box for a lesson, 5px outside it in layout 1) is at or below the header's foot and its foot at or above the window's. Measured: 11px or more clear of the header in layout 1, 17px in layout 2.
31. **B** The same walk at 320, 375 and 390 with the header's menu open (opened, then Tab on through it into `main`): the open header is 329px tall (±2) and no focused element in `main` is under it. Measured: 12px or more clear in both layouts.
32. **B** A focused lesson shows its ring round the whole stop (an outline on the `li`, none on the link), and clicking anywhere on a stop opens its lesson.
33. **B** Page height, first visit, light (±40px): layout 1 2,783 / 3,513px at 1440 and 3,613 / 4,647px at 375; layout 2 1,729 / 1,977px and 3,346 / 4,184px (How the Internet Works / Networking).
34. **B** Layout 1, 1440 × 900 and 1280 × 720: scrolled to the last stop, the up-next button is wholly on screen and has not moved; `window.scrollY` is more than 0 (the window scrolls). At 1024 × 650 the side column is not sticky.
35. **B** Layout 1, 375: no rail; each lesson card's left edge 14px from the screen's (±1); the chip beside the name. Layout 1, 1440: the chip's centre on the rail's line (±1).
36. **B** Layout 2: three part cards across at 1440, two at 1024 and 768, one at 375; each card's left edge 14px from the screen's at 375 (±1); at 320 no tab overlaps its count.
37. **B** The Lesson page's crumb and "Back to the track" land on the page's top; `/networking/how-the-internet-works` still forwards to `/how-the-internet-works`.

## 12. Decisions, one line each

1. The page scrolls and the box inside it goes, in both layouts: scroll keys, the wheel, find-in-page and the sticky header then work as on every other page.
2. In layout 1 the side column is sticky instead of fixed, and only where the screen can hold all of it, so the button is never cut off.
3. A lesson is one link, its name, covering the whole stop: one Tab stop a lesson, a target at least 110px tall, and twenty "Start" buttons fewer.
4. The page has one filled button, on the up-next card: the way in is in one place, as on Tracks.
5. The up-next card's kicker is its index tab, because a tab is a card's name in this look.
6. "First lesson" replaces "Start here": the phrase belongs to the first track's tab on Home and Tracks.
7. The chip keeps its number in every state (paper, orange, green), because this page is where a lesson's number is read; Tracks' box, which shows one lesson, keeps its tick.
8. The up-next lesson's stop has the orange chip and the wash; done is a green chip and a green word; colour is never alone.
9. Watch, Learn, Practice are drawn as the strip's squares are, so "where you are" is one language from the track down to the part.
10. Each stop keeps its figure and the up-next card has none: every drawing once, nothing swapped on load, and the spots keep their one place outside the lessons.
11. A name tile shows its short name only, and its rule is ink: a 4 to 6px line of capitals is noise, and orange has two jobs here already.
12. In layout 2 a part is the card and its name the tab; the cards are as tall as their lessons and nothing is stretched.
13. In layout 2 the parts read across then down, the way the Tracks page's rows and every grid on the site read.
14. The stop in progress may grow by one line where its marks and its stamp do not fit side by side; keeping a spare line on every stop would cost about 440px on a phone for every reader.
15. Scroll padding is 80px, and 341px while the menu is open: the only way a page can keep focus clear of a header it may not change.
16. Nothing goes into `card-stack.css`, and Tracks' strip rules stay Tracks': no shared rule is edited, so Home and Tracks cannot move.
17. The islands are sent only what they draw: 3.4 KB less for no change a reader can see.
18. No cover in the head: the reader has just chosen this track from its picture.

## 13. Open questions for the owner

1. **Layout 1 (Route) or layout 2 (Index)?** 2 is recommended (§2): the whole track in two desk screens instead of three to four, eight or nine lessons whole on the first screen instead of five, 7 to 10% shorter on a phone. 1 is your own structure, one column in order, and on a desk the Start button never leaves the screen.
2. **Each lesson keeps its drawing on this page** (§7), so `/networking` is about 207 KB of its 250 KB budget, from 221.9. Taking the drawings off, as Tracks did, would make it about 11 KB, and leave the sixteen spots shown nowhere but inside their lessons.
3. **"First lesson" instead of "Start here"** on the up-next card, as on Tracks (2.87 kept "Start here" until this page moved).
4. **A name tile's full name ("Hypertext Transfer Protocol") is not drawn.** It is 7px on a desk today. Showing it legibly means writing it as a line of text in the stop, under the subtitle: a new line on the page for 14 lessons (18 with Networking's shared ones), about 20px each.
5. **The buttons on every stop go** ("Start", "Continue", "Watch again"): the name is the link and the whole stop can be pressed. The three words stay on the up-next card.
6. **The stop in progress is one line taller on a phone** (22px; in layout 2 on a desk too), so the lessons under it move by that much when progress loads. The other choice is a spare line on every stop, about 440px more on a phone.
7. **If layout 2:** the sentence shown when a lesson is not ready (never shown today) would say "stay in their part" for "stay on the route".
