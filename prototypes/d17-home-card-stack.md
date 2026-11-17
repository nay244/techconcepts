# D17: Home in the "Card stack" look

Job 17, design unit D17 (direction 2.81). The whole Home page, every section in today's order with every word kept, in the look the owner chose: "Let's build on the concept of Card Stack. Keep our current top navbar style and add a few color's so that it is not simply black and white", after "Calmer, more refined" and "Let's not do a whole layout change".

The prototype is `prototypes/d17-home-card-stack.html`. It is the built Home page (`dist/index.html`) with D16's markup and rules, then one `<style>` block headed "D17". It has no `<script>`, so it is also the JavaScript-off path. The dark bar at its top is the prototype's own: **A: Patch colours / B: Highlighter** and **Light / Dark**. The header's theme button and menu button are script on the site and are disabled here.

**Two colour variants, one design.** Everything but nine colour values is the same in A and B.

- **A, Patch colours (recommended).** Orange is "here" and "do this", green is done, blue is a request, brown is a response: Patch's own values. The page's filled buttons match the header's, and the demo's colours are the lesson page's.
- **B, Highlighter.** Ink does "do this" (the filled button is black, as in the chosen sketch), one flat yellow marks "here", and the three lesson meanings keep their hue in calmer values. It buys a quieter page, closer to the black-and-white sketch. It costs two things while the header stays Patch: the header's orange button becomes the only orange on the page, so "do this" has two looks; and a reader who opens the lesson from Home meets slightly different blues, browns and greens there.

D16 is not built on its own: its three fixes are part of D17 (§7 measures them again).

## 1. The idea

**Patch is the desk; the cards lie on it.** The page's ground stays Patch's ground (`--ground`), so the header, the page and the footer are one surface, and the header's hairline is the desk's edge, not a seam between two looks. Everything Home says is on a card: paper (`--card`) with a hard 2px edge. A card that has more behind it shows the edges of the cards beneath; a tab names a card. No Patch token gets a new value; the header and the footer read only Patch's tokens and do not change.

What carries the look, and where each device is allowed:

| Device | Means | Used on |
|---|---|---|
| Hard 2px edge, 10px corners | this is a card | the demo, the two tracks, "Where the facts come from", "Lift the lid" |
| Edges of cards beneath | there is more behind this card | the demo (two beneath: the two parts not on show), each track (one beneath: its lessons). The facts and close cards are single cards and have none |
| Index tab on the top edge | the card's name | Watch, Learn, Practice (controls); "Start here", "Then go deeper" (labels) |
| Solid offset edge, 3px | you can press this | buttons, Practice's answers. Nothing else |
| Dither (one ink pixel in four, 2px grid) | shade | the deepest card under the demo, and nowhere else |
| A filled colour | you are here | one thing per card: the step on show, the marker on the tab on show, the lit way in a figure |
| 1px hairline (`--line-strong`) | a divider inside a card | above the narration, between Learn's terms, above the sources control |

## 2. Tokens

New names, set on Home's `:root`. Hex values in brackets are what the token resolves to.

### 2.1 Construction (both variants)

| Token | Light | Dark | Job |
|---|---|---|---|
| `--cs-edge` | `--ink-strong` (`#12171b`) | `--ink` (`#c6cdd1`) | every card, tab, button, chip and option edge; the offset edges |
| `--cs-card` | `--card` (`#fafbfa`) | `--card` (`#1a1e21`) | paper |
| `--cs-quiet` | `--tile` (`#eaeded`) | `--tile` (`#22272b`) | a tab at rest, a message, a note, a picked answer, a hint |
| `--cs-hair` | `--line-strong` | `--line-strong` | dividers inside a card, link underlines |
| `--cs-r` | 10px | | card corner |
| `--cs-r-in` | 8px | | buttons, tabs, the step on show, options, tiles; a corner inside a card's edge |
| `--cs-off` | 3px | | the offset edge of a pressable thing |
| `--cs-stack` | 6px (4px at 860px and below) | | how far each card beneath shows |
| `--cs-dither` | `conic-gradient(var(--cs-edge) 25%, var(--cs-card) 0) 0 0 / 2px 2px` | | the deepest card's fill |

The page ground is `--ground` (`#e4e7e8` / `#101315`), unchanged.

**The dark theme** is the same stack drawn in light line: slate cards (`#1a1e21`) on the darker ground (`#101315`), every hard edge in `--ink` (`#c6cdd1`, 11.6:1 on the ground; `--ink-strong` was tried and glared at 2px). The cards beneath are slate with the same light edge; the dither is the light edge on slate. A reader with no preference gets light, as today.

### 2.2 Colour jobs

| Token | Job | A light | A dark | B light | B dark |
|---|---|---|---|---|---|
| `--cs-act` / `--cs-act-ink` | do this: the filled button | `--accent` `#b04617` / `#ffffff` | `#f0702e` / `#1c0c03` | `--ink-strong` `#12171b` / `--card` `#fafbfa` | `#f3f5f6` / `#1a1e21` |
| `--cs-act-edge` | the filled button's offset edge | `3px 3px 0 var(--cs-edge)` | same | `4px 4px 0 -2px var(--cs-card), 4px 4px 0 0 var(--cs-edge)` (paper with a hard edge: an ink button's solid ink edge cannot be seen) | same |
| `--cs-here` / `--cs-here-ink` | you are here: the chip or tile of the step on show, the tab marker, "Start here"'s marker, the lit way and lit parts of a figure | `--here` `#b04617` / `#ffffff` | `#f0702e` / `#1c0c03` | `#f2cc4d` / `#12171b` | `#f2cc4d` / `#12171b` |
| `--cs-here-wash` | the row of the step on show (desktop) | `--here-soft` (drawn `#f3e9e3`) | `--here-soft` (drawn `#362923`) | `#fbf0c4` | `#302b1a` |
| `--cs-done` | done: the tick of a step behind you, the right answer's mark and its feedback bar | `--allowed` `#23824a` | `#5fd68a` | `#2c7a56` | `#7fcfa3` |
| `--cs-done-text` | the checked stamp's tick | `--allowed-text` `#207243` | `#75db9a` | `#266b4b` | `#8fd6ae` |
| `--cs-request` | a request: its message's bar | `--request` `#1f63c0` | `#5aa9ff` | `#2f55a4` | `#8fb0ee` |
| `--cs-response` | a response: its message's bar | `--response` `#7a4a2b` | `#cfa37c` | `#8f5b34` | `#d4a77f` |

Rules for colour, both variants:

1. A colour has the one job in its row and is never decoration.
2. Colour is never the only signal. Here: also the hard edge round the row, the bold taller tab, the number. Done: a tick, drawn. Request and response: the words ("Laptop to Web server"). Right and wrong: "Right." and "Not quite." and the tick or dot.
3. **Links are ink**, underlined (1.5px, `--cs-hair`; the underline turns ink on hover). Patch's blue link is not used on Home, so blue means a request and nothing else.
4. Request, response and done have the same colour wherever they appear on the page. In A they are also the lesson page's. In B they are near (the same hue, calmer); see open question 2.
5. The "And HTTPS?" note loses its teal bar (Patch's `encrypted`): it is a plain quiet note. That is a fifth colour removed, not a meaning recoloured.

## 3. Type

Three families, the site's own, in Patch's roles. No new face: the header's Barlow stays the page's display face, so the header cannot clash with the page, and the look gets its character from the cards, not from a font. The sketch's Viga was not taken: a fourth family, and its wide soft forms sit badly under Barlow's condensed ones.

| Use | Face | Size / line | Notes |
|---|---|---|---|
| h1 | Barlow Semi Condensed 700 | `clamp(50px, 7.4vw, 104px)` / 0.94, `-0.012em` | 104px at 1440 (today 132), 50px at 375 (today 52) |
| h2 (every section) | Barlow 700 | `clamp(28px, 2.6vw, 34px)` / 1.1 | 34 at 1440, 28 at 375. "Try one" was 26, the others up to 44 |
| h3 (track title) | Barlow 700 | 26px (24px at 860 and below) | |
| Opening sentence | Atkinson Hyperlegible Next 400 | 20px / 1.5 (19px at 860 and below), max 27em | `--ink-strong` |
| Card paragraphs (facts, close) | Atkinson 400 | 18px / 1.55 | `--ink` |
| Intro under "Try one", track blurb | Atkinson 400 | 17px / 1.6; 16.5px / 1.5 | `--ink` |
| Narration | Atkinson 400 | 16.5px / 1.55 | `--ink-strong` |
| Learn lead, Practice question | Atkinson 400 | 17px / 1.55 | `--ink-strong` |
| Step title | Barlow 600 | 17px / 1.25 (phone, the step named: 21px / 1.2) | |
| Step sub-line | Atkinson 400 | 14px (phone 14.5px) | `--muted` |
| Buttons | Barlow 600 | 18px / 1.2, `0.01em` | |
| Tabs | Barlow 600, 700 on show | 17px | |
| Track tab | Barlow 600 | 16px | |
| Small print (opening facts, counts, "Nothing is scored.") | Atkinson 400 | 15px | `--muted` |
| Chip and tile numbers, message codes | Atkinson Hyperlegible Mono 700 | 14px (tile 16px); 13px | real data and numerals only |
| The phone's key | as D16 §2.2.3 | 12px and 13px | unchanged |

Labels are sentence case. The one exception is D16's: the phone key repeats the drawing's spaced capitals (open question 5).

## 4. Components and their states

### 4.1 Card

`border: 2px solid var(--cs-edge); border-radius: 10px; background: var(--cs-card)`. No shadow other than the cards beneath.

- **One card beneath** (tracks): `box-shadow: 6px 6px 0 -2px var(--cs-card), 6px 6px 0 0 var(--cs-edge)`.
- **Two beneath** (the demo): the same, and a third box 12px down and right, `border: 2px solid var(--cs-edge)`, same corners, filled with `--cs-dither`, behind the card (`z-index: -1` inside the demo's own stacking context, `isolation: isolate`).
- At 860px and below the steps are 4px and 8px.

### 4.2 Button (`.btn`, also the demo's Next labels)

`min-height: 48px; padding: 0 22px; border: 2px solid var(--cs-edge); border-radius: 8px; box-shadow: 3px 3px 0 var(--cs-edge)`.

| State | Plain | Filled (`.btn--primary`) |
|---|---|---|
| Rest | `--cs-card`, ink words | `--cs-act`, `--cs-act-ink` words, `box-shadow: var(--cs-act-edge)` |
| Hover | `--cs-quiet` | `color-mix(in srgb, var(--cs-act) 88%, var(--cs-edge))` |
| Active | `transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--cs-edge)`, 80ms | the same |
| Focus | Patch's ring, 2px `--focus`, 3px out | the same |

One filled button per card (the opening has one filled and one plain). Buttons in a row are 16px apart (14px on a phone), so the offset edges do not touch.

### 4.3 Index tabs (Watch, Learn, Practice)

A row 52px tall standing on the card's top edge, overlapping it by 2px.

- At rest: 46px tall, `border: 2px solid var(--cs-edge)`, corners `8px 8px 0 0`, `--cs-quiet`, `--ink` words, 600. Neighbours share an edge (`margin-left: -2px`).
- **On show:** 52px tall, `--cs-card`, no bottom edge (it joins the card), 700, `--ink-strong`, and a 9px square marker before the word: `--cs-here`, 2px corners, a 1.5px `--cs-edge` ring.
- Keyboard focus: 2px `--focus` ring **inside** the tab, `outline-offset: -7px` (neighbouring tabs leave no room outside).
- Desktop: the tabs are as wide as their words (`padding: 0 22px`) and start on the rule between the figure and the words, so the first tab's left edge runs down into that rule.
- 860px and below: three equal tabs across the card; the card's top corners are square, because the first and last tab carry its edges up.

### 4.4 Steps

Desktop, five rows: `grid-template-columns: 30px 1fr; gap: 12px; padding: 6px 10px; border: 2px solid transparent; border-radius: 8px`; 56px tall, 2px apart. The chip is 30px square, 6px corners, `2px solid var(--cs-edge)`, `--cs-card`, the number in mono 700 14px.

| State | Row | Chip |
|---|---|---|
| Ahead | no edge, no fill | paper, ink number |
| **On show** | `border-color: var(--cs-edge); background: var(--cs-here-wash)` | `background: var(--cs-here); color: var(--cs-here-ink)` |
| Behind | no edge, no fill | paper, the number hidden (`font-size: 0`; it stays in the markup), a drawn tick: 13 × 7px, `border: solid var(--cs-done); border-width: 0 0 3px 3px`, rotated −45° |
| Keyboard focus | 2px `--focus` ring, 2px out (D16) | |

Phone, D16's strip of five tiles: each tile 46px tall (D16: 44), 8px apart, 8px corners, `2px solid var(--cs-edge)`, mono 700 16px. On show: `--cs-here` fill, `--cs-here-ink` number. Behind: paper, the tick. Ahead: paper, ink number. The step on show is named under the strip (D16). Focus rings the tile (D16).

### 4.5 Narration and messages

A 1px hairline, then the narration. Each message: `border-left: 5px solid var(--cs-request)` (response: `--cs-response`), corners `2px 6px 6px 2px`, `--cs-quiet`, padding `6px 10px 6px 11px`, 5px apart; the code in mono 700 13px at the right.

### 4.6 Learn

Lead; six terms divided by hairlines (the term's name in Barlow 600 16.5px at the right); the "And HTTPS?" note (`--cs-quiet`, 8px corners, no bar, padding `12px 14px`); D5's stamp and sources, unchanged in structure, links in ink, the fold control's box `2px solid var(--cs-edge)`, 16px, 4px corners; then the filled "Go to Practice".

### 4.7 Practice

Each answer is a pressable card: `min-height: 48px; padding: 10px 14px 10px 46px; border: 2px solid var(--cs-edge); border-radius: 8px; box-shadow: 3px 3px 0 var(--cs-edge)`, 12px apart, with a 20px ring (`2px solid var(--cs-edge)`, round) at the left.

| State | Option | Mark |
|---|---|---|
| Not picked | paper, offset edge; hover `--cs-quiet` | empty ring |
| Picked, not the right one | pressed in: `transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--cs-edge); background: var(--cs-quiet)` | an 8px ink dot in the ring |
| Picked, right | pressed in, the same | the ring filled `--cs-done` with a paper tick |
| Keyboard focus | 2px `--focus` ring, 2px out (D16) | |

Feedback: `border-left: 5px solid var(--cs-edge)` (right: `--cs-done`), `--cs-quiet`, corners `2px 6px 6px 2px`, padding `10px 12px`. Its words already say "Right." or "Not quite.".

### 4.8 Key hints (D16)

Unchanged in words, place and behaviour. Look: `1px solid var(--cs-hair)`, 6px corners, `--cs-quiet`; each key `1.5px solid var(--cs-edge)` with a 3px foot, 4px corners, 22px.

### 4.9 Track card and its tab

A card with one card beneath. Its top-left corner is square: the tab stands there (`left: -2px; bottom: 100%`), 34px tall, `padding: 0 14px`, `2px solid var(--cs-edge)` with no bottom edge, corners `8px 8px 0 0`, paper, Barlow 600 16px. The first track's tab ("Start here") carries the 9px here marker; "Then go deeper" has none. Inside: the art with a 2px edge under it; the title (a link, underlined 2px `--cs-hair`, ink on hover); the blurb; the count with its pips (10px squares, 2px corners: ready is filled `--cs-edge`, not ready is a 1.5px `--cs-edge` outline). Text margins 24px (16px on a phone). The cable, its dashes and its square markers are gone: the tabs carry the order.

## 5. The page, section by section

Measured at 1440×900 and 375×812, light, A. Positions are from the top of the page (the prototype's bar hidden).

| Section | What it is now | 1440 | 375 |
|---|---|---|---|
| Header | today's, untouched: Patch's ground at 88% with blur, the 1px hairline, the bordered nav, the theme button, the orange "Start learning" | 69px | 69px |
| The opening | not a card: the line on the desk at the left, the sentence, two buttons and the three facts at the right (below on a phone). The 2px rule under it is gone | h1 104px, three lines, 690 × 293 | h1 50px, three lines |
| Try one, right here | the heading and its intro, then the demo: a stack of three cards, the tabs on its top edge. On desktop the heading is 57% wide and the tabs rise beside its last line, so the first screen shows the card's top and its tabs (tabs at y 556, card from 608) | card 1,228 × 575 at step 1, plus 12px of stack | card 339 wide, 14px from the left edge, 8px of stack |
| Get started with the basics | two track cards, each with its tab; 40px apart (62px, stacked, on a phone) | 600 × 589 each | 343 × 428 |
| Where the facts come from | one card: the `sources` figure, a 2px rule, the words. The full-width white band is gone | 1,240 × 469 | 347 × 535, figure on top |
| Lift the lid | one card: the words and the button, a 2px rule, the `inside` figure | 1,240 × 496 | 347 × 527, figure on top |
| Footer | today's, untouched | | |

Spacing: between sections `--gap: clamp(56px, 7vw, 96px)` (96 at 1440, 56 at 375). The opening: `padding-top: clamp(40px, 5.6vw, 80px)`, `padding-bottom: clamp(44px, 5.2vw, 76px)`. The footer keeps its own 128px (96px) above it.

Page height: 3,621px at 1440 (today 3,878) and 4,490px at 375 (today 4,439). No sideways scroll at 320, 375, 768 or 1440.

### The demo's grid

D16's grid, with three rows added: the tabs' row above the card, and a 2px row at the card's top and foot that hold its edge.

- `.demo`: `isolation: isolate; padding: 0 2px; margin-right: 12px` (the stack's room), no border, no background, `overflow: visible` (D16's `clip` is not needed: nothing is clipped, and the sticky Next still sticks).
- Desktop: columns `minmax(0, 1.5fr) minmax(300px, 1fr)`; rows `50px 2px auto auto auto auto 1fr 2px`; areas `'. parts' 'top top' 'scene hint' 'scene rows' 'scene keys' 'scene says' 'scene nexts' 'foot foot'`; `min-height: 555px`; `margin-top: -50px`, so the tabs stand beside the heading.
- 860px and below: one column; rows `50px 2px auto auto auto auto auto auto 2px`; areas `'parts' 'top' 'hint' 'scene' 'rows' 'keys' 'says' 'nexts' 'foot'`; `margin: 0 -10px 0 -18px` (the card's edge is 14px from the screen's left edge; the words inside start at 32px, under the header's logo).
- The card is `.demo::before`, a grid item from `top` to `foot` across all columns, `margin: 0 -2px`. The dithered card is `.demo::after`, absolutely placed in the same area.
- The scene: paper, `padding: 12px 6px`, a 2px rule at its right (desktop) or under it (phone).
- Learn and Practice panes: `grid-row: rows-start / nexts-end` as in D16; padding `20px 20px 22px` (phone `18px 16px 20px`).
- The phone's sticky Next (D16): the card's foot, `border-top: 2px solid var(--cs-edge)`, paper, padding `10px 19px 13px 16px`, bottom corners 8px.

## 6. The figures

No figure is redrawn. All five (the scene, the two track drawings, `sources`, `inside`) are re-tinted inside Home.

| Token | Light | Dark | Was (light / dark) |
|---|---|---|---|
| `--fig-bg` | `--cs-card` | `--cs-card` | `#eef1f1` / `#0d1012` |
| `--lit-a`, `--lit-b` | both `--cs-here` (flat; the lit part's sides are the same colour, darker, by the drawings' own mixes) | the same | a peach-to-orange gradient |
| `--pool-op`, `--halo-op` | 0 (no glow, no soft shadow) | 0 | .38, .26 / .9, .9 |
| `--anatomy-paper` | `--cs-card` | `--cs-card` | `#f6f7f6` / `#1c1f22` |
| `--anatomy-face`, `--anatomy-top` | `#ffffff`, `#ffffff` | `#1f2428`, `#262b30` | |
| `--anatomy-shade-0` to `-3` | `#c6cdd0`, `#dde2e3`, `#eef1f1`, `#ffffff` | `#0c0f11`, `#121518`, `#171b1e`, `#1f2428` | |
| `--anatomy-hi`, `-mid`, `-lo`, `-faint` (the lines) | `#12171b`, `#2b3238`, `#57626a`, `#a6aeb2` | `#f3f5f6`, `#c6cdd1`, `#949ea4`, `#4d565c` | `#232a2f`, `#7a848a`, `#a6aeb2`, `#ccd2d4` |
| `--anatomy-weight` | 0.9px | 0.9px | 0.6px |

**What tokens alone could not do** (each is one rule in Home's style, not a new drawing):

1. The lit colour must also be set on `.lm-defs`, the shared gradients' element, which sits outside `<main>`: `main, .lm-defs { --lit-a: …; --lit-b: … }`.
2. The lit way: `.nm-trail { stroke: var(--cs-here); stroke-width: 3.5px; filter: none }` and its casing `.nm-trail-edge { stroke: var(--cs-edge); stroke-width: 7.5px }`, an ink-cased line that reads on paper in either variant (B's yellow needs the casing).
3. Three things switched off: the glow under a busy part (`.nm-glow`), the dotted rings round a plate (`.lm-orbit`, the old glow's edge), the lights' blur (`.lm-led.on { filter: none }`), and the drawings' fade-in on load (`.lm-svg { animation: none }`).
4. Left as drawn: the screens, slots and vents that the figure sheet paints with fixed near-blacks (`.lm-void`, `.lm-slot`, `.lm-face`). On paper they are the drawing's solid blacks; in the dark they sit into the slate. They have no token.
5. Not attempted: dither inside a figure. The drawings scale with the screen, and a 2px dither blurs to grey at 0.56px a unit on a phone; the side faces are flat greys instead.
6. As D16: the plates' engraved words stay texture (about 2px on a phone).

## 7. D16's three fixes, measured again in D17

Chromium, headless, the prototype's bar hidden. "Today" is `dist/` on this branch.

**A, the phone's scene is readable.**

| | Today, 375 | D16, 375 | D17, 375 | D17, 320 | 1440 (today / D17) |
|---|---|---|---|---|---|
| Drawing, px a unit | 0.434 (297px wide) | 0.621 | 0.555 (the crop is 335 × 129) | 0.464 | 1.048 / 1.052 |
| Callout names | 5.0px | 12px, in the key | 12px, in the key | 12px | 12.1 / 12.1px, drawn |
| Addresses | 5.4px | 12px | 12px | 12px | 13.1 / 13.1px |
| Sub-lines | 5.6px | 13px | 13px | 13px | 13.6 / 13.7px |

The drawing is 11% smaller than D16's because the card keeps its edges and 14px of desk each side (D16 ran the frame to the screen's edges). Every label is in the key at 12px or more, which is what A asked for.

**B, a tap on a phone does not move the page away from the narration.** 375×812, the demo 70px from the top (tabs at y 70 to 122):

| Tap | Today | D17: page moves | After it |
|---|---|---|---|
| Next step, 1→2, 2→3, 3→4, 4→5 | −482px (794 → 312), narration and Next off screen | 0px each | narration starts at y 560; Next at 751 to 799 |
| A step tile, 1→4 | | 0px | step 4 checked; narration at 560 |
| Go to Learn | | 0px (**D16's prototype moves 17px here**, below) | Learn's lead at 423 |
| Go to Practice | | 0px | the question at 423 |
| The third answer | | 0px | its feedback at 697 to 763 |
| The Watch tab | | 0px | |
| Next, with the narration's top under the header (y 40) | | back 57px, by design | the new narration starts at y 97, below the header |
| Desktop, Next ×5 | 0px | 0px | |

The sticky Next: `position: sticky`, its bottom at the window's bottom (812) while the card's end (974) is below it.

**One correction to D16.** D16 gave each anchor `scroll-margin-top: 88px`. Measured on D16's own prototype, "Go to Learn" with the tabs at y 70 moves the page 17px (the tabs settle at 88), though D16's table says 0. D17 sets `scroll-margin-top: 70px` on the three groups (the header is 69px), so nothing moves while the anchor is anywhere below the header.

**C, Tab stops only where something shows, each ringed, with the hint.** The same at 375 and 1440, light and dark, and with JavaScript off:

| Part on show | Today | D17 stops | Ringed | Hint shown |
|---|---|---|---|---|
| Watch | part, step, answer (nothing seen), then the tracks | part, step, then "How the Internet Works" | the tab (inside); the row (1440) or the tile (375) | part hint; step hint |
| Learn | part, step, answer, then links | part, then "Lesson 2: HTTPS", the sources | the tab | part hint |
| Practice | part, step (nothing seen), answer | part, answer, then "Open the whole lesson" | the tab; the option | part hint; answer hint |

Radios in the accessibility tree: 5 steps and 0 answers in Watch; 0 and 0 in Learn; 0 and 3 in Practice. No hint after a click. Step 5 and a picked answer stay checked through a change of part, and the page on the laptop stays drawn.

**Sizes.** Tabs 46px and 52px; tiles 46px; rows 56px; every button 48px; answers 48px or more; the sources control 44px; on a phone each source link 44px (D5). The card with its tabs at 1440: Watch 625 / 685 / 750 / 762 / 790px by step, Learn 745, Practice 555 (today's frame: 585 / 638 / 674 / 686 / 710, 718, 503). At 375: 811 / 872 / 911 / 974 / 950, Learn 1,183, Practice 671 (today 875 at step 1). D16's check 14 (desktop heights as today) is replaced by these.

## 8. Contrast, measured from what is drawn

Computed in the browser from each element's colour over its real background. The bar is WCAG 2.2 AA: 4.5:1 for words, 3:1 for the parts of a control and for graphics that carry meaning.

| Pair | A light | A dark | B light | B dark |
|---|---|---|---|---|
| Headline and strong words on the ground | 14.51 | 17.05 | 14.51 | 17.05 |
| Muted words on the ground (opening facts) | 5.03 | 6.83 | 5.03 | 6.83 |
| Body words on a card (`--ink`) | 12.53 | 10.43 | 12.53 | 10.43 |
| Muted words on a card | 6.02 | 6.14 | 6.02 | 6.14 |
| Filled button: words on fill | 5.62 | 6.40 | 17.39 | 15.34 |
| Filled button: fill on the ground | 4.52 | 6.27 | 14.51 | 17.05 |
| Card edge on the ground | 14.51 | 11.59 | 14.51 | 11.59 |
| Tab at rest: words | 11.04 | 9.37 | 11.04 | 9.37 |
| Step on show: title on the wash | 15.08 | 12.87 | 15.77 | 12.92 |
| Step on show: sub-line on the wash (lowest words on the page) | 5.22 | 5.15 | 5.46 | 5.17 |
| Step on show: number on its chip | 5.62 | 6.40 | 11.61 | 11.61 |
| Here chip against its row | 4.70 | 4.73 | **1.36** | 9.10 |
| Here marker against its tab | 5.42 | 5.64 | **1.50** | 10.80 |
| Done tick on paper | 4.64 | 9.17 | 5.03 | 9.07 |
| Request bar on a card | 5.62 | 6.83 | 6.85 | 7.68 |
| Response bar on a card | 7.12 | 7.34 | 5.45 | 7.70 |
| Words on a quiet fill (messages, notes, feedback) | 15.32 | 13.78 | 15.32 | 13.78 |
| Stamp tick | 5.70 | 9.87 | 6.16 | 9.91 |

Every pair of words passes in all four. The two bold figures are B's cost in the light theme: flat yellow is 1.4 to 1.5:1 against paper, so in B "here" is found by the ink edge round every yellow mark (17:1), the bold taller tab and the edged row, never by the yellow alone. In A the orange passes 3:1 on its own. A card against the ground is 1.2:1 (1.1:1 dark), as Patch's panels are; the 2px edge draws it.

## 9. What changes

**From today's Home**

- Kept: every word, the sections and their order, the header, the footer, the demo's mechanism (radios and CSS, no script), D5's sources block, the three type families, the figures, the 860px breakpoint, `--ground`.
- Changed: panels become cards with a hard edge; the demo's flat tab strip becomes index tabs on the card; the tracks' cable becomes two cards with tabs; the facts band and the close band become one card each; buttons get a hard edge and an offset edge; done steps show a tick, not a green disc; the step on show is an edged row with a filled chip; answers are pressable cards with a ring; links are ink, not blue; the headline is 104px, not 132px; the rule under the opening goes; the figures lose their glow, rings, soft shadows and fade-in, and gain ink lines.
- New words: none. (D16's three key hints are in.)

**From D16**

- Kept: the grid as the frame with `display: contents`; the radios placed by grid area; the phone's crop, key and leaders; the strip of five tiles and the step named under it; the sticky Next; `visibility: hidden` for the groups not on show; the hints; the inset tab ring.
- Changed: `scroll-margin-top` 88px → 70px (§7); the phone's frame keeps its side edges and sits 14px in (D16: edge to edge, no side borders), so the drawing is 335px wide, not 375; tiles 46px (44); `overflow: clip` dropped; the tab ring's inset −7px (−5); three grid rows added; D16's frame heights replaced (§7).

## 10. For the builder

- **Markup: nothing beyond D16's.** D17 is CSS. The tabs' marker, the ticks, the answers' rings and the cards beneath are pseudo-elements.
- **The prototype's `#main` prefix is the prototype's only.** It is there to win over the built page's rules. In `index.astro` the rules are written without it; rules that reach inside a figure need `:global`.
- **Tokens** go on `:root` in Home's own stylesheet. The dark values go under the selectors Patch's dark tokens use (`[data-theme="dark"]`, and `prefers-color-scheme: dark` on `:root:not([data-theme])`); the prototype's `:root:has(#pt-dark:checked)` stands for both. Only the chosen variant is built: its column of §2.2. A adds no colour value to the site. B adds nine; they then belong in `src/styles/tokens.ts` with its contrast tests.
- **The generated state rules** (`index.astro:41`) keep their selectors and get these declarations:
  - part on show, its tab: `height: calc(var(--tab) + 2px); border-bottom: 0; background: var(--cs-card); color: var(--ink-strong); font-weight: 700; z-index: 1`, and its `::before { display: block }` (was a card fill and an inset orange line);
  - part focus: `outline: 2px solid var(--focus); outline-offset: -7px`;
  - step on show, its row: `border-color: var(--cs-edge); background: var(--cs-here-wash)`; its chip: `--tile-bg: var(--cs-here); background: var(--cs-here); color: var(--cs-here-ink); border-color: var(--cs-edge)`;
  - steps behind, their chip: `background: var(--cs-card); border-color: var(--cs-edge); font-size: 0`, and `::after { display: block }` (was a green fill);
  - an answer picked: `border-color: var(--cs-edge); background: var(--cs-quiet); box-shadow: 1px 1px 0 var(--cs-edge); transform: translate(2px, 2px)`; the right answer (the one whose feedback has `data-right`) also gets the filled ring and tick, any other the dot (§4.7);
  - step, tile and answer focus: as D16.
- The exact CSS is the prototype's D17 block; where this document and that block differ, the block is right and this is an erratum.
- Tests that pin today's look will move: any that read the tabs' inset line, the green disc, the cable's pseudo-elements, the facts band's background, the frame heights (D16's check 14), or `.demo`'s own border and `overflow`.

## 11. Acceptance checks

**B** needs a real browser; **U** can be a unit test on the built HTML or the generated CSS. Unless said, each holds at 375×812 and 1440×900, light and dark.

*The look*

1. **U** Home's HTML has the five sections in today's order, and its visible words are today's plus D16's three hints: nothing added, nothing removed.
2. **U** Home has exactly two `<script>` elements, as today.
3. **B** The header's computed styles (ground, bottom border, the nav's inset line, the "Start learning" fill, both radii) equal those on `/tracks`.
4. **B** `main`'s ground and the header's ground are the same colour; no element between the header and the opening draws a rule.
5. **B** `.demo::before`, each `.leg`, `.facts__grid` and `.close__grid` have a 2px solid border in `--cs-edge` and a 10px radius (the demo's top corners 0 at 375; each `.leg`'s top-left 0).
6. **B** The demo shows two cards beneath (a box-shadow pair on `::before` and a dithered `::after`), each `.leg` one, the facts and close cards none.
7. **B** Every `.btn` in `main` is at least 48px tall with a 2px border and a non-zero offset shadow; while pressed its shadow is `1px 1px` and it has moved 2px.
8. **B** Each card has at most one `.btn--primary` showing.
9. **B** The tab on show is 52px tall, weight 700, has no bottom border and shows its marker; the others are 46px, weight 600, with none. 1440: the first tab's left edge is within 1px of the scene's right rule. 375: the three tabs are equal and span the card.
10. **B** At each step N: row (1440) or tile (375) N has the here fill on its chip; every chip before N shows a tick (`::after` displayed, its number's `font-size` 0) and no fill; every chip after N shows its number.
11. **B** Request messages have a left border in `--cs-request`, response messages in `--cs-response`; no other element in `main` uses either colour.
12. **B** No link in `main` computes to `--link`; each has an underline.
13. **B** Practice: a picked answer has the `1px 1px` shadow and the 2px move; the right one's ring is filled `--cs-done`; a wrong one's ring holds a dot and no green; the feedback's left border is `--cs-done` only for the right one.
14. **B** In every figure in `main`: `--pool-op` and `--halo-op` compute to 0, `.lm-orbit` and `.nm-glow` are not displayed, and the lit way's stroke is `--cs-here`.
15. **U** Home's stylesheet holds no colour value outside the token block and the figures' tint block (§6).
16. **B** Contrast: every pair in §8's table is at or above its figure (±0.05) for the built variant; all words ≥ 4.5:1.
17. **B** At 320, 375, 768 and 1440 the document's `scrollWidth` equals the window's width.
18. **B** 375: each card's left edge is 14px from the screen's and the first words inside it start at 32px (±1px).
19. **B** 1440×900 at the top of the page: the tabs and at least 280px of the demo card are on screen.

*D16's fixes, in D17*

20. **B** 375 and 320: every displayed text in `.demo__key` has a font size of 12px or more; `.nm-call` is not displayed; there are four key entries and four leaders. 1440: the key is not displayed, and the drawn callout names are 12px or more on screen.
21. **U** The key's words are the drawing's callout words; the SVG's `viewBox` is `-98 -60 685 378`.
22. **B** 375: with `.demo` 70px from the top, click the visible Next four times, then "Go to Learn", "Go to Practice", the third answer and the Watch tab: `scrollY` never changes; after each Next the narration's top is between 69 and 812 and the visible Next is too.
23. **B** 375: from step 1, a click on tile 4 checks `#demo-s4` and does not change `scrollY`.
24. **B** 375: with the narration's top at y 40 (under the header), Next leaves the new narration's top at y 69 or lower, clear of the header.
25. **B** 375: with the demo's middle on screen, the visible `.demo__nexts` is `position: sticky` with its bottom at the window's bottom (±1px).
26. **B** 1440: five clicks on Next do not change `scrollY`.
27. **B** Tab from the intro's "HTTP" link: Watch on show → `#demo-watch`, the checked step, then a link outside `.demo`. Learn → `#demo-learn`, "Lesson 2: HTTPS". Practice → `#demo-practice`, an answer radio, "Open the whole lesson". Also with JavaScript off.
28. **B** At each radio stop of check 27 the tab, row, tile or option has an outline that is not `none` and lies inside the window below the header; exactly that group's hint is displayed and on screen. After a pointer click on a tab, a step and an option, no hint is displayed.
29. **B** `getByRole('radio', { name: /^Watch, step / })` counts 5, 0, 0 and `/^Answer: /` counts 0, 0, 3 for Watch, Learn, Practice.
30. **B** `#demo-s5` and a picked answer stay checked through Practice → Watch → Practice, and the page on the laptop stays drawn in Learn and Practice.
31. **B** 375: tabs, tiles, Next, answers, the sources control and every source link are 44px tall or more.
32. **B** 1440: `.demo` is 625 / 685 / 750 / 762 / 790px tall through Watch's steps, 745 in Learn, 555 in Practice (±2px).
33. **B** JavaScript off: the demo steps, shows Learn and answers a question (`site.spec.ts:1001-1011`).

## 12. Decisions, one line each

1. The ground stays Patch's, so the join with the header is solved by not making one: one desk, one hairline.
2. Card edges are Patch's `--ink-strong`, not pure black: the header's own ink, so the page's black and the header's are the same black.
3. Dark is the stack in light line on slate, with `--ink` edges: a white-paper stack in the dark would undo the dark theme.
4. The opening is not a card: the promise sits on the desk, and the first card a reader meets is the lesson.
5. The rule under the opening goes: the card's own edge is the next hard line, and two were one too many.
6. Edges beneath a card are information, not style: two under the demo (the two parts not on show), one under a track, none under a single card.
7. Dither appears once, as the stack's shade: anywhere else it would be a prop.
8. Offset edges mean "press me" only, so the step on show is edged but flat.
9. Done is a drawn tick in green on paper, not a green fill: one filled thing per card, and a shape that does not need the colour.
10. Links are ink so that blue has one job.
11. The tracks' order words become the cards' tabs: they were labels above the art; now they are part of the object, and the cable goes.
12. The facts and close sections are cards inside the page's width: "one card, one idea", and the white band was the last full-bleed panel.
13. Three families, Patch's roles; the headline drops to 104px so the first screen holds the opening and the top of the lesson.
14. The phone's card keeps its edges and sits 14px in: a card without sides is not a card, and the labels are in the key at 12px either way.
15. Text inside a phone card starts at 32px, under the header's logo, so the outdented cards do not break the page's left edge.
16. `scroll-margin-top` is 70px: the header's height is all an anchor needs.
17. B's filled button is ink because any second colour for "do this" would sit under the header's orange button doing the same job.
18. B keeps the lesson's hues for request, response and done, so a reader who goes on to the lesson recognises them.
19. The figures' fade-in is off on Home: five entrances on one page is the opposite of calm.

## 13. Open questions for the owner

1. **Is this look for Home only, or does it replace Patch across the site?** Home only: Home is the cover and the lessons stay as they are; with A the colours and type are shared, so the step from Home to a lesson is a change of furniture, not of language. Across the site: the Lesson, Tracks, track, About, Glossary and 404 pages each need a design unit, and the header, which stays Patch for now, would then be the odd one out: its 1px lines and 4px corners would want the 2px edge and 8px corners, and "Start learning" the offset edge. Nothing in D17 forces that choice.
2. **A or B.** A is recommended: one orange for "do this" from the header down, and the demo's colours are the lesson's. B is calmer and nearer the sketch, at the two costs on the first page of this document, and with yellow that needs its ink edge to be seen (§8). The constraint that request, response and done "keep the same colours wherever they appear" is read here as "on the page"; if it means "the same as the lesson page", B's three calmer values go and B keeps Patch's.
3. **The tracks' tabs look like the demo's tabs but are labels.** They are single, smaller and not bold. If that still reads as something to press, the alternative is the order words inside the card, above the title.
4. **Links in ink, not Patch's blue,** on Home only. If the look stays Home's alone, links are blue on every other page.
5. **Carried from D16:** the phone key's spaced capitals; the plates' engraved words as texture; a full-width Next between 600 and 860px.
6. **Not in scope, still true:** between 861 and about 1,100px wide the drawing's own callouts are under 12px (9.7px at 960), as today. The phone's key could take over up to 1,023px; that moves D16's breakpoint and was not asked for.
7. **The "And HTTPS?" note has no teal bar.** If the owner wants the lesson's "encrypted" colour on Home, it is one rule back.
