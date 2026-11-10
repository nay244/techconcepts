# D4: the share image

The picture a chat app or social site shows when someone shares any page of TechConcepts: `public/og-default.png`, 1200×630.

Prototype: `prototypes/d4-share-image.html`. Open it from the file system; it needs no server and no network.

## 1. What changes and what stays

| | Today | After |
|---|---|---|
| The picture | The word "TechConcepts" in Atkinson Hyperlegible Next 600 and a short rule, centred, on `#060c17` (a colour no token has any more) | The name with the Lifted lid mark, the site's line, and the `inside` figure, on Patch's ground |
| The file | `public/og-default.png`, 1200×630, 22 KB | The same path and size; 157 KB (A) or 156 KB (B) |
| How it is made | `scripts/generate-og-image.mjs` draws a page with the tokens and photographs it with Playwright | The same script and the same method, drawing the card below |
| Which pages use it | Every page: `src/layouts/BaseLayout.astro` defaults `image` to `/og-default.png` | Unchanged |

Nothing else changes: no page, no meta tag, no token, no new art.

## 2. The card

One layout. The two variants differ only in ground (§3).

```
0                 72                           552                    1157  1200
+------------------------------------------------------------------------------+ 0
|                                                                              |
|                 [mark] TechConcepts                      __                  | 60
|                                                     ____/  \____             | 91  top of the figure
|                                                    /   the lid   \           |
|                 See how                           |   lifted on   |          | 287 top of the line's letters
|                 technology                   ____/|   four rods   |\____     |
|                 really works.               \_____   the plate    _____/     |
|                                                    \____________/            | 535 foot of the figure
|                                                                              | 582 foot of the line's "y"
+------------------------------------------------------------------------------+ 630
```

Everything is left-aligned on one edge, 72px in. The name is top left, the line bottom left, the figure fills the right half and touches neither.

### The parts, as numbers

The card is a 1200×630 box, `overflow: hidden`, positioned children.

| Part | Position | Type and size |
|---|---|---|
| **Lockup** (mark, then name) | `left: 72px; top: 60px`; a flex row, centred on the cross axis, `gap: 0.36em` (21.6px) | `font-size: 60px` |
| The mark | 78×78px (1.3 × the type size), first in the row | Drawn from `LOGO_SHAPES` in `src/art/logo.ts`: lid and tray in the ink colour, message in the accent |
| The name | After the mark | Barlow Semi Condensed 700, 60px, `letter-spacing: 0.005em`, `line-height: 1` |
| **The line** | `left: 72px; bottom: 64px` | Barlow Semi Condensed 700, 108px, `line-height: 0.9` (97.2px), `letter-spacing: -0.01em`. Three rows, broken by hand |
| **The figure** | `left: 552px; top: 80px; width: 640px` (it is then 498px tall) | `PAGE_FIGURES.inside()` from `src/art/figures/pages.ts`, as it is drawn: its own `viewBox="30 0 540 420"`, its glow, its two dotted rings and its engraved label |

The lockup follows direction §8 exactly: the mark at 1.3 times the type size, 0.36 of the type size from the name, the name in one colour. The line's weight, tracking and line height are Home's `h1`.

Paint order: the figure first, then the lockup and the line, so nothing of the figure's glow sits over a letter.

### Every word

- `TechConcepts`
- `See how` / `technology` / `really works.` (one sentence, Home's `h1`, broken after "how" and after "technology", as Home breaks it at 1440 wide)

The figure carries its own engraved label, `LID OFF · 1 MESSAGE`, about 4px tall on the plate's edge. It is part of the drawing and is not legible below full size.

No other words. No time figure, exam tag, count or score.

## 3. The two variants

| | A, light ground (recommended) | B, dark ground |
|---|---|---|
| Ground | `bg-soft` light, `#e4e7e8` | `bg-soft` dark, `#101315` |
| Name, line, lid and tray | `ink-strong` light, `#12171b` | `ink-strong` dark, `#f3f5f6` |
| The mark's message | `accent` light, `#b04617` | `accent` dark, `#f0702e` |
| The figure's finish | Light: porcelain solids (`src/art/lumen.css`, the `:root` and `[data-theme="light"]` values) | Dark: charcoal solids (the `[data-theme="dark"]` values) |

All values are the ones in `src/styles/tokens.ts` and `src/art/lumen.css`. None is new.

**A is recommended.** The site's idea is "lift the lid and see inside", and in the light finish the inside is black in a white case: at 300×158 the figure's darkest part is 19.8:1 against its lightest. In the dark finish the figure is charcoal on near-black, 1.8:1, and only its hairlines and the orange message hold it together when the image is small.

**What B buys.** More weight in a feed (a dark block with white words), and a match with the favicon's dark tile and with today's dark image. On a dark chat background its edge is the app's border and nothing else.

## 4. States

The card is a still picture: it has none.

The prototype page has three:

- **Which image**: A, B, or today's image (for the before and after). One group of radio buttons; the arrow keys move it.
- **The page's theme**: light or dark, the system's until the button is pressed. It changes the page around the card, never the card.
- **One card alone**: open the file with `#only=a`, `#only=b` or `#only=today` and the page is that card at 0,0 with nothing else, for a script to photograph at a 1200×630 viewport. The cards are `#card-a`, `#card-b` and `#card-today`.

The page shows the chosen image at full size (the element itself, 1200×630), then at 600×315 and at 300×158 inside a stand-in chat app's link preview, on a light and on a dark chat background. The small ones are the photograph of the card, scaled by the browser as a chat app scales the file; they are not the card drawn again smaller. The chat app's colours are the stand-in's own, not the site's.

Breakpoints of the prototype page only: the two chat backgrounds sit side by side from 1380px and stack below it; below 761px the switch takes a row of its own. Below 1266px the full-size card is shown scaled to fit, and the page says by how much; the element stays 1200×630.

## 5. For the builder

`scripts/generate-og-image.mjs` keeps its method (a page drawn with the tokens, photographed at 1200×630, the fonts checked as loaded). It draws the card in §2 in the chosen variant's colours.

- **One source for each part.** The mark from `LOGO_SHAPES` (`src/art/logo.ts`); the figure from `PAGE_FIGURES.inside()`; the figure's styles from `src/art/lumen.css`; its gradients from `lumenDefs()` (`src/art/defs.ts`); the colours from `tokens` (`src/styles/tokens.ts`). Checked on this machine (Node 26.12): a `.mjs` script can import `src/art/figures/pages.ts` directly, and what it returns is the figure on Home.
- **Pick the finish with the page's theme**: `<html data-theme="light">` for A, `"dark"` for B. That is all `lumen.css` needs. The prototype holds both grounds in one page, so it keys them on `data-ground` and gives the dark card its own copy of the gradients; the script draws one ground and needs neither.
- **Stop the draw-in.** `lumen.css` fades every figure up over 600ms from `opacity: 0`. A photograph taken at once would catch the figure half drawn or missing. Emulate reduced motion in Playwright (`lumen.css` then sets `animation: none`), or set it on the figure.
- **Fonts on the card**: Barlow Semi Condensed 700 for the name and the line; Atkinson Hyperlegible Mono 400 for the figure's engraved label, with `--mono` defined as `global.css` defines it. Both from `node_modules/@fontsource`, inlined as today. Atkinson Hyperlegible Next is no longer on the card.
- **`--logo-accent`** is the variant's `accent`.
- No `-webkit-font-smoothing` (the site sets none, and tests for that).

## 6. Acceptance checks

Each can be tried on the prototype (`#only=a` or `#only=b` at a 1200×630 viewport) and turned into a test on the script's page or on the file.

1. `public/og-default.png` is a PNG, 1200×630, under 300 KB.
2. The card's box is 0, 0, 1200, 630.
3. The name reads `TechConcepts`. The line reads `See how technology really works.` and is the same sentence as Home's `h1`.
4. The name and the line compute to Barlow Semi Condensed 700, and that face reports loaded before the photograph. Name: 60px, line height 60px, letter spacing 0.3px. Line: 108px, line height 97.2px, letter spacing -1.08px.
5. Boxes: the mark is 78×78 at 72, 60. The line's box starts at x 72 and ends at y 566 (64 above the foot). The figure's SVG is 640 wide at 552, 80.
6. The card's ground is the variant's `bg-soft`; the name and line are its `ink-strong`. In the photograph the pixel at 10, 10 is the ground (`#e4e7e8` for A, `#101315` for B) and the pixel at 111, 106, the middle of the mark's message, is the accent (`#b04617` for A, `#f0702e` for B).
7. The words reach at least 4.5:1 against the ground (A 14.5:1, B 17.1:1).
8. Nothing drawn solid is within 40px of an edge: the mark, the name, the line's letters and the figure's solid parts (`.lm-body`). The figure's glow and dotted rings may run closer; they are meant to fade out.
9. The figure is present and whole: the photograph differs from one taken with `.lm-body` hidden across a box of about 570×444 starting near 587, 91. (This is the check that catches the draw-in.)
10. The mark and the figure are the repo's drawings: the card's HTML holds the three paths of `LOGO_SHAPES` and the output of `PAGE_FIGURES.inside()`.
11. Every page's `og:image` still names `/og-default.png`.

## 7. Measured

From photographs at 1200×630, device scale 1, and the same files scaled by the browser to 600×315 and 300×158. Scripts and pictures are in the ignored `.superpowers/revamp/design/d4/` (`build.mjs` builds the page and measures; `check.mjs` runs the checks; `d4-a-*.png`, `d4-b-*.png`, `d4-today-*.png` are the photographs).

| | Today's image | A, light ground | B, dark ground |
|---|---|---|---|
| The name at 600×315 | Letters 65px tall; the name is the whole image | 30px type, letters 28px tall from the top of "T" to the foot of "p" | The same |
| The name at 300×158 | Letters 33px tall | 15px type, letters 14px tall | The same |
| The mark at 300×158 | No mark | 19.5px box, the drawing 16.5px wide. The logo's smallest size is 16px (direction §8). Lid, message and tray are three separate shapes in the photograph | The same |
| The line | None | 54px type at 600×315, 27px at 300×158 | The same |
| Words against the ground | 18.2:1 | 14.5:1; 14.3:1 at the least favourable pixel behind a letter | 17.1:1; 16.5:1 at the least favourable pixel |
| The mark's message against the ground | None | 4.5:1 | 6.3:1 |
| Nearest an edge | The name, 142px | 43px. Mark 64 (top), name 79 (top), line 48 (foot of the "y") and 73 (left), figure 43 (right), 91 (top), 95 (foot) | The same |
| The figure's tones at 300×158, darkest part against lightest | No figure | 19.8:1 | 1.8:1 |
| File | 22 KB | 157 KB | 156 KB |

The prototype page itself: no sideways scroll at 375 or 1440 wide in either theme; every control is 44px tall; it makes no network request; the card photographed through `#only=a` and `#only=b` is byte for byte the picture the chat mocks use.

## 8. Not in this unit

- A picture for each lesson or track. One card serves every page.
- A square or centre-cropped version. The card is laid out for the wide preview (`twitter:card` is `summary_large_image`). An app that crops the middle square (x 285 to 915) loses the mark and cuts through the name, the line and the figure.
