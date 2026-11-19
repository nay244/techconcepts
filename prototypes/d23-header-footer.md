# D23: the header and footer in the "Card stack" look

Job 24, design unit D23 (direction 2.81, 2.84, 2.121 to 2.123). The site's header (`src/components/SiteHeader.astro`, with `ThemeToggle.css` and the `site.css` buttons) and footer (`SiteFooter.astro`) in Card stack, colour variant A, on the six pages that wear the look: Home, Tracks, the track pages, About, the Glossary and 404. The owner kept the layout (2.123), so there is **one layout**: today's parts in today's order, the breakpoints 960px and 720px, the header 69px closed and 391px (329px without Start learning) open. **The Lesson page's header keeps Patch, unchanged.** One part is drawn two ways, the five links at 960px and up (§5.3): **A, a strip** (recommended) and **B, tabs**.

The prototype is `prototypes/d23-header-footer.html`: one self-contained file, built from the built pages of `revamp` 39fc4c8 (`dist/about/index.html`, `dist/tracks/index.html`, `dist/networking/dhcp/index.html`): their markup, tokens, styles and the header's own script as built, the fonts inlined, then on About and Tracks one block, `<style id="d23">`, which is the block for `card-stack.css` (§10). The lesson page in it has no such block. The dark bar at the top is the prototype's own:

- **Page**: About (has Start learning), Tracks (has none), A lesson (Patch, unchanged).
- **Beside it**: The lesson puts the lesson page next to (or under) the chosen page at the same width, so the step a reader takes into a lesson can be seen.
- **Width**: 320, 375, 959, 960, 1440. The page is shown at exactly that width, scaled down if the window is narrower.
- **Theme**, **Menu** (below 960px), **Focus rings** (every stop of the header and footer ringed at once), **The five links** (A or B, at 960px and up).

The header's own theme button and menu button work inside each page, as do Escape and a click on a link in the open menu. Links lead nowhere (the prototype stops them). Addresses: `d23-header-footer.html#page=tracks&w=375&th=dark&menu=open&rings=1&nav=b&beside=1` sets the switches; adding `solo=1` shows that one page alone at the window's own width, with no bar, which is what every measurement here was taken on. From a script inside a page: `__d23.set({ th: 'dark', menu: 'open', rings: true, nav: 'b' })`. In a window 700px wide or narrower the bar is hidden and the page fills the window. None of the prototype's own script or frame is built.

## 1. What must stay, and what was measured today

Fixed by the brief (plan decisions 1 to 9, direction 2.123): every word and accessible name (§9); the parts and their order; 960px and 720px; the header's heights; what the header and footer do (the menu and its script, Escape, the panel hidden without JavaScript, the theme button and its storage, the skip link, `aria-current`, sticky, z-index 20, every link and its target); no new `<script>`; the Lesson page byte-identical.

Measured today (the built pages in the prototype's harness, headless Chromium, fonts loaded; light and dark the same in every figure; they agree with S25 Part 8):

| | Today |
|---|---|
| Header, closed, every width | 69px |
| Header, menu open, 320 / 375 / 959 | 391px with Start learning (390.95), 329px without (328.95) |
| Footer, 320 / 375 / 1440 | 600 / 553 / 371px |
| The header's ground | `--ground` at 88% with a 10px blur |
| The skip link when focused | under the header (z-index 10 under 20): a ghost through the 88% ground |
| Theme and menu buttons | 40 × 40px |
| Start learning in the row | 40px tall |
| A footer link's target | 20px tall (the words' own box), 34.8px apart |
| The open menu's left line | links at 20px, Start learning at 16px, the brand at 32px |
| Keyboard walk on About, Tab to the footer and Shift+Tab back, stops outside the header with their ring under it | 0 at 320, 375, 960 and 1440, menu closed and open |
| The same on Tracks | 0 closed at all four; menu open 9 at 320 and 4 at 375 (Tracks has no scroll padding for the open menu; the page's, not the header's) |

What was wrong besides the look:

- **The focused skip link is nearly invisible.** It is drawn under the header, and only what the 88% ground lets through shows.
- **Three controls are under 44px** on a phone: the theme button, the menu button (40px) and each footer link (20px).
- **The open menu has three left lines** (16, 20 and 32px).
- **Start learning in the open menu has no bottom edge** (`.menu-panel .btn { border-bottom: 0 }` takes it off).

## 2. The layout: kept, and what changed inside it

```
1440
┌──────────────────────────────────────────────────────────────────────────────┐
│ ◆ TechConcepts      ┌ Tracks  Glossary  How a lesson works  Sources ▪About ┐ │   [☾] [Start learning]▚
│                     └──────────────────────────────────────────────────────┘ │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   2px ink, the ground solid
   the page, on Patch's ground
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   2px ink
  ◆ TechConcepts                          Learn              Site                  the footer: card paper,
  Guided visual lessons …                 five links         About                 as wide as the page
  ──────────────────────────────────────────────────────────────────
  Your progress is saved only in this browser.

375, menu open
┌───────────────────────────┐
│ ◆ TechConcepts    [☾] [≡] │  the menu button filled in while open
│───────────────────────────│
│  Tracks                   │  five rows of 45px, one left line with the brand
│  Glossary                 │
│  How a lesson works       │
│  Sources                  │
│  ▪ About                  │  the orange marker: where you are
│  [     Start learning    ]▚│
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

The parts, their order, the grid (`1fr auto 1fr`; two columns below 960px), the footer's three columns (two below 721px, the brand across both) and both breakpoints are today's. Changed inside, each for a measured reason:

| Change | Measured |
|---|---|
| The header's row is 67px with a 2px edge (today 68px and a 1px rule) | 69px closed at 320, 375, 959, 960 and 1440; 391px and 329px open at 320, 375 and 959 (today 390.95 and 328.95) |
| The row has 1px of padding on top | The 44px controls sit on whole pixels, at y 12 to 56: 12px above, 11px and the 2px edge below. Without it they sit at y 11.5 and their edges blur |
| The ground is solid, with no blur | The header's colour equals the page's exactly (`site.spec.ts:1911` allows 1 channel) |
| The skip link is lifted over the header (z-index 21) | Focused, it is whole and readable (today a ghost) |
| Theme and menu buttons 44 × 44px | 40 × 40 today |
| Start learning 44px tall in the row | 40 today (§9 of the direction doc lists it under "Not done") |
| Below 342px the row's and the panel's side padding give way evenly, 32px down to 21px at 320 | At 320 the brand is at 21px and the menu button ends 21px from the right. Today the row is 14px too wide for its column and the button ends 18px from the right with the brand at 32px. From 342px up the padding is 32px, as today |
| The open menu's rows, its button and the brand share one left line | 32px at 375 (today 20, 16 and 32) |
| The open menu's rows are 45px (44px and a hair), its foot padding 18px (today 45.4px and 16px) | The panel is 322px, 260px without Start learning (today 321.95 and 259.95), so every scroll padding that counts the open header still holds |
| A footer link is a 32.8px target at 721px and up, 44.8px on a phone | 20px today; the links stay 34.8px apart at 721px and up, so the footer there grows only by its edge |
| The footer's grid has 40px above and 28px below on a phone (today 56 and 40) | Gives back 28px of what the larger targets take |

## 3. Where the styles live, and how they win

One new block at the end of `src/styles/card-stack.css`, between `/* HEADER AND FOOTER BEGIN` and `/* HEADER AND FOOTER END */` (§10 has it whole). The six pages already import the file; the Lesson page does not, so its header keeps Patch with no prop and no change. **No component file changes**: `SiteHeader.astro`, `SiteFooter.astro`, `ThemeToggle.css` and `site.css` stay byte-identical, their Patch rules the base the block restyles, so the Lesson page builds byte-identical by construction.

How the block wins without `!important`: the components' styles are global and unscoped in the build (`<style is:global>`; `dist/_astro/BaseLayout.*.css` holds them as `.site-head`, `.pillnav a`, `.icon-btn`, `.btn--primary:hover` and so on, with no Astro attribute). Every rule of the block starts at `header.site-head`, `.site-head`, `footer.site-foot` or `.site-foot` and so carries one more class or element than the rule it restyles:

| The component's rule | Its weight | The block's rule | Its weight |
|---|---|---|---|
| `.site-head` | 0,1,0 | `header.site-head` | 0,1,1 |
| `.site-head .wrap` | 0,2,0 | `header.site-head .wrap` | 0,2,1 |
| `.wrap` (`global.css`) | 0,1,0 | the same | 0,2,1 |
| `.pillnav`, `.pillnav a` | 0,1,0; 0,1,1 | `.site-head .pillnav`, `.site-head .pillnav a` | 0,2,0; 0,2,1 |
| `.pillnav a:not([aria-current]):hover` | 0,3,1 | `.site-head .pillnav a:not([aria-current]):hover` | 0,4,1 |
| `.pillnav a[aria-current]` | 0,2,1 | `.site-head .pillnav a[aria-current]` | 0,3,1 |
| `.icon-btn`, `.icon-btn:hover`, `.icon-btn svg` | 0,1,0; 0,2,0; 0,1,1 | `.site-head .icon-btn`, `…:hover`, `… svg` | 0,2,0; 0,3,0; 0,2,1 |
| `.btn`, `.btn--primary`, `.btn--small` | 0,1,0 | `.site-head .btn`, `.site-head .btn--primary`, `.site-head .btn--small` | 0,2,0 |
| `.btn--primary:hover`, `.btn:active` | 0,2,0 | `.site-head .btn--primary:hover`, `.site-head .btn:active` | 0,3,0 |
| `.menu-panel` (in the 959px query) | 0,1,0 | `.site-head .menu-panel` | 0,2,0 |
| `.menu-panel a` | 0,1,1 | `.site-head .menu-panel a` | 0,2,1 |
| `.menu-panel .btn` | 0,2,0 | `.site-head .menu-panel .btn` | 0,3,0 |
| `.site-foot` | 0,1,0 | `footer.site-foot` | 0,1,1 |
| `.foot-grid`, `.foot-grid p`, `.foot-grid ul`, `.foot-grid ul a`, `.foot-grid ul a:hover` | 0,1,0 to 0,2,1 | each with `.site-foot` before it | one class more |
| `.foot-base` | 0,1,0 | `.site-foot .foot-base` | 0,2,0 |
| `.skip-link` (`global.css`) | 0,1,0 | `a.skip-link` | 0,1,1 |
| `:focus-visible { border-radius: 4px }` (`global.css`) | 0,1,0 | every block rule that sets a radius | 0,2,0 or more |

Checked: with the block moved to the very start of each page's `<head>`, before every other stylesheet, the computed style of 23 parts (28 properties each, About and Tracks, 375 and 1440, light and dark, the menu open at 375) is the same as with the block last. `main .btn` (the pages' Card stack buttons) does not reach the header, and the block does not reach `main`.

No token is added and no colour value is written: every colour in the block is a Patch token or a `--cs-*` name (`src/lib/home.test.ts:328-346` stays green). The one `color-mix` is the Card stack buttons' own hover.

## 4. Colour, one job each

- **Orange, here** (`--cs-here`): the 9px marker before the section you are in, in the five links and in the open menu; with it, in the strip, the pale orange wash (`--cs-here-wash`) the Home demo gives the step on show. The logo's message stays orange (`--logo-accent`), as today.
- **Orange, do this** (`--cs-act`): Start learning, in the row and in the open menu.
- **Ink** (`--cs-edge`): every hard edge. The header's foot, the footer's top, the strip, the two square buttons, Start learning and its offset edge.
- Green, blue and brown have no job in the header or footer (nothing there is done, a request or a response), so they are not used. The footer carries no colour but the logo's.

## 5. The parts and their states

No markup changes: every element, class, id and attribute is today's.

### 5.1 The header's ground and edge (`header.site-head`)

Solid `--ground`; no backdrop filter; a 2px `--cs-edge` edge at its foot. Sticky, `top: 0`, z-index 20, as today. The row (`.wrap`) is 67px tall with `padding-top: 1px`; the grid, its 16px gap and its centring are today's. With the menu open the edge is under the panel, at the header's foot.

### 5.2 The brand

Unchanged: the mark and "TechConcepts" in Barlow Semi Condensed 700, 22px, `--ink-strong`, 163.9 × 28.6px. Focus: the site's ring, 4px corners.

### 5.3 The five links (`nav.pillnav.site-nav`), 960px and up: two variants

**A, a strip (recommended).** One small card holding the five links, where today's pill is.

- The strip: a 2px `--cs-edge` edge, 8px corners (`--cs-r-in`), `--cs-card` paper, 2px of padding, 2px between links, no shadow. 44px tall (today 38), 470.6px wide (today 471.6).
- A link: 36px tall, 12px side padding, 4px corners, Barlow Semi Condensed 600, 16px / 1, `0.01em` (today's type), `--ink`. Hover: `--cs-quiet` ground, `--ink-strong`.
- The section you are in (`[aria-current]`, "page" or "true" alike, as today): the 9px orange marker (2px corners, a 1.5px `--cs-edge` ring: `.cs-tab--here`'s own) 8px before the word, on the `--cs-here-wash` ground, `--ink-strong`. Today's orange underline goes. On Home and 404 no link is current and the strip has no marker.
- Focus: the site's ring round the link, 4px corners; it lies inside the header (y 11 to 57 of 69).

**B, tabs.** No strip. The five links stand on the header's edge, and the section you are in is an index tab, the look's own mark for "where you are".

- The row of links is at the header's foot (`align-self: end`), 2px between them. A link: 38px tall (y 29 to 67), 12px side padding, a 2px transparent edge on three sides so nothing moves when it becomes the tab, `--ink` on the ground; hover: `--ink-strong`, underlined 2px, 5px under the words.
- The section you are in: a tab of `--cs-card` paper with a 2px `--cs-edge` edge on three sides, 8px top corners, standing on the header's edge, with the same orange marker. 482.6px wide in all.
- The words sit 15px lower than the brand's and the buttons', which is what a row of tabs does.

**Which, and why.** A is recommended: it is today's nav in the look's materials ("Keep our current top navbar style and add a few colours", 2.81), the links, the theme button and Start learning are one 44px band, the section mark is there on every page that has one, and the step into a lesson is small (a strip to a pill, in the same place). B buys the look's strongest mark, the index tab, and makes the page read as the card under its tab; it costs a second baseline in the header, a nav of bare words on Home and 404, and a larger step into a lesson. Everything else in this spec is the same for both.

### 5.4 The theme and menu buttons (`.icon-btn`)

44 × 44px, a 2px `--cs-edge` edge, 8px corners, `--cs-card` paper, the icon 20px in `--ink-strong`. No offset edge: the offset edge is for a button that takes you on, and these two change the page you are on. Hover: `--cs-quiet`. Pressed: today's `scale(0.96)`. **The menu button while the menu is open** (`[aria-expanded='true']`): filled `--cs-edge`, the icon `--cs-card`. Today the open button looks the same as the closed one. The moon and sun, the labels and the hiding without JavaScript are today's.

### 5.5 Start learning (`a.btn.btn--primary`)

The Card stack button, as in `main`: a 2px `--cs-edge` edge, 8px corners, `--cs-act` fill, `--cs-act-ink` words, a `3px 3px 0` offset edge in `--cs-edge` that closes to `1px 1px 0` as the button moves 2px down and right when pressed (80ms). Hover: the fill darkens by 12% toward the edge colour. It never wraps (`white-space: nowrap`). 3px of margin at its right, so its offset edge ends on the column's line.

- In the row (`.btn--small`), 960px and up: 44px tall, 16px side padding, Barlow Semi Condensed 600, 17px / 1.2 (today 40px and 16px). 130.5px wide (today 122.9).
- In the open menu: 48px tall, 18px (as `main .btn`), the row's full width less the 3px, 12px above it. Its edge is whole (today its bottom border is taken off).

### 5.6 The open menu (`nav.menu-panel`), below 960px

On the header's solid ground. A 1px `--cs-hair` line under the row; padding 8px above, 18px below, and at the sides the row's own (32px; `clamp(16px, (100vw - 278px) / 2, 32px)`). Five rows, 2px between them: each 45px (`min-height: 45px` with its 1px `--cs-hair` foot), the words centred on it, Barlow Semi Condensed 600, 18px / 1.2, `0.01em`, `--ink-strong` (today Atkinson 600, 17px). The section you are in: the orange marker 10px before the word, and weight 700. Then Start learning (§5.5). Height: 1 + 8 + 5 × 45 + 4 × 2 + 18 = 260px; with Start learning 2 + 12 + 48 more, 322px.

On the Lesson page the panel is `console.css`'s and Patch's, unchanged.

### 5.7 The skip link (`a.skip-link`)

`z-index: 21`, nothing else. It is the one rule of the block that is not inside the header or footer, and it is there because the header is: a solid header would hide the focused skip link whole. On the Lesson page it stays as today (open question 3).

### 5.8 The footer (`footer.site-foot`)

The last card, as wide as the page: `--cs-card` paper with a 2px `--cs-edge` edge on top (today the ground's own colour and a 1px rule). Its margin above (128px; 96px at 720px and down), the grid and the brand are today's.

- The line under the brand: `--ink` (today `--muted`); 15.5px, as today.
- "Learn" and "Site": unchanged (Barlow Semi Condensed 600, 17px, `--ink-strong`).
- A link: `--ink` (today `--muted`), 15.5px as today, `display: inline-block` with 4px above and below (a 32.8px target), 2px between links, so links are 34.8px apart, as today. Hover: `--ink-strong`, underlined 2px, 4px under the words. Focus: the site's ring. At 720px and down: 10px above and below (a 44.8px target), nothing between.
- The base line: unchanged but for its rule, now `--cs-hair` (14px, `--muted`).
- At 720px and down the grid's padding is 40px above and 28px below (today 56 and 40 at every width).

### 5.9 Focus and motion

Every stop keeps the site's ring (`:focus-visible`: 2px `--focus`, 3px out). The block's own radii hold while focused (8px on the three buttons, 4px on a link of the strip). The Tab order is today's: skip link, brand, the five links (960px and up), theme, Start learning (960px and up, where shown), menu (below 960px), then the open panel's links, then `main`, then the footer's brand, six links.

Nothing moves by itself. Start learning presses in over 80ms; the square buttons keep today's 120ms press and 150ms ground change; the site's reduced-motion rule covers all three. The menu opens and closes at once, as today.

## 6. Computed values, light and dark

Read from the prototype with `getComputedStyle` (About and Tracks; the same on both but where said). `--cs-edge` is `--ink-strong` in light and `--ink` in dark, as on every Card stack page.

| Part | Property | Light | Dark |
|---|---|---|---|
| `header.site-head` | `background-color` | `rgb(228, 231, 232)` | `rgb(16, 19, 21)` |
| | `backdrop-filter` | `none` | `none` |
| | `border-bottom` | `2px solid rgb(18, 23, 27)` | `2px solid rgb(198, 205, 209)` |
| | `position`, `z-index`, height | `sticky`, `20`, `69px` | the same |
| `.site-head .wrap` | height, `padding-top`, side padding | `67px`, `1px`, `32px` (21px at 320 wide) | the same |
| The strip, `.site-nav` (A) | `border` | `2px solid rgb(18, 23, 27)` | `2px solid rgb(198, 205, 209)` |
| | `background-color`, `border-radius`, `box-shadow` | `rgb(250, 251, 250)`, `8px`, `none` | `rgb(26, 30, 33)`, `8px`, `none` |
| | height, `padding`, `gap` | `44px`, `2px`, `2px` | the same |
| A link, `.site-nav a` (A) | `color` | `rgb(43, 50, 56)` | `rgb(198, 205, 209)` |
| | height, `padding`, `border-radius`, font | `36px`, `0 12px`, `4px`, 600 `16px` / `16px` Barlow Semi Condensed | the same |
| The current link (A) | `background-color` | `rgba(176, 70, 23, 0.1)` | `rgba(240, 112, 46, 0.13)` |
| | `color`, `box-shadow` | `rgb(18, 23, 27)`, `none` | `rgb(243, 245, 246)`, `none` |
| Its marker, `::before` | size, `border-radius` | `9px` × `9px`, `2px` | the same |
| | `background-color` | `rgb(176, 70, 23)` | `rgb(240, 112, 46)` |
| | `box-shadow` | `rgb(18, 23, 27) 0px 0px 0px 1.5px` | `rgb(198, 205, 209) 0px 0px 0px 1.5px` |
| A link (B) | height, `border` | `38px`, `2px` transparent on top and sides, none below | the same |
| The current link (B) | `background-color`, `border-color`, `border-radius` | `rgb(250, 251, 250)`, `rgb(18, 23, 27)`, `8px 8px 0 0` | `rgb(26, 30, 33)`, `rgb(198, 205, 209)`, `8px 8px 0 0` |
| `.icon-btn` (theme, menu) | size, `border-radius` | `44px` × `44px`, `8px` | the same |
| | `border`, `background-color`, `color` | `2px solid rgb(18, 23, 27)`, `rgb(250, 251, 250)`, `rgb(18, 23, 27)` | `2px solid rgb(198, 205, 209)`, `rgb(26, 30, 33)`, `rgb(243, 245, 246)` |
| | its `svg` | `20px` × `20px` | the same |
| `#menu[aria-expanded="true"]` | `background-color`, `color` | `rgb(18, 23, 27)`, `rgb(250, 251, 250)` | `rgb(198, 205, 209)`, `rgb(26, 30, 33)` |
| Start learning, the row | height, width, `padding`, `margin-right` | `44px`, `130.5px`, `0 16px`, `3px` | the same |
| | `border`, `border-radius` | `2px solid rgb(18, 23, 27)`, `8px` | `2px solid rgb(198, 205, 209)`, `8px` |
| | `background-color`, `color` | `rgb(176, 70, 23)`, `rgb(255, 255, 255)` | `rgb(240, 112, 46)`, `rgb(28, 12, 3)` |
| | `box-shadow` | `rgb(18, 23, 27) 3px 3px 0px 0px` | `rgb(198, 205, 209) 3px 3px 0px 0px` |
| | font, `white-space` | 600 `17px` / `20.4px` Barlow Semi Condensed, `nowrap` | the same |
| `#menu-panel`, open | height | `322px` (About), `260px` (Tracks) | the same |
| | `border-top`, `padding` | `1px solid rgba(18, 23, 27, 0.34)`, `8px 32px 18px` | `1px solid rgba(243, 245, 246, 0.26)`, the same |
| A row of it | height, `border-bottom`, font, `color` | `45px`, `1px solid rgba(18, 23, 27, 0.34)`, 600 `18px` / `21.6px` Barlow Semi Condensed, `rgb(18, 23, 27)` | `45px`, `1px solid rgba(243, 245, 246, 0.26)`, the same, `rgb(243, 245, 246)` |
| Its current row | `font-weight`; the marker as above | `700` | `700` |
| Start learning, the panel | height, width at 375, `margin-top`, `margin-right` | `48px`, `308px`, `12px`, `3px` | the same |
| | `border-bottom-width`, font | `2px`, 600 `18px` | the same |
| `a.skip-link` | `z-index` | `21` | `21` |
| `footer.site-foot` | `background-color`, `border-top` | `rgb(250, 251, 250)`, `2px solid rgb(18, 23, 27)` | `rgb(26, 30, 33)`, `2px solid rgb(198, 205, 209)` |
| `.foot-grid p` | `color`, `font-size` | `rgb(43, 50, 56)`, `15.5px` | `rgb(198, 205, 209)`, `15.5px` |
| `.foot-grid h3` | `margin-bottom` | `10px` | `10px` |
| `.foot-grid ul a` | `color`, `display`, `padding` | `rgb(43, 50, 56)`, `inline-block`, `4px 0` (`10px 0` at 720 and down) | `rgb(198, 205, 209)`, the same |
| `.foot-base` | `border-top`, `color`, `font-size` | `1px solid rgba(18, 23, 27, 0.34)`, `rgb(87, 98, 106)`, `14px` | `1px solid rgba(243, 245, 246, 0.26)`, `rgb(148, 158, 164)`, `14px` |

Hover and pressed (not shown at rest): a link of the strip `--cs-quiet` (`rgb(234, 237, 237)` / `rgb(34, 39, 43)`); a square button the same; Start learning `color-mix(in srgb, var(--cs-act) 88%, var(--cs-edge))`, and pressed `transform: translate(2px, 2px)` with `box-shadow: 1px 1px 0` in the edge colour.

## 7. The layout, by width

Positions are x from the window's left, on About (Start learning shown) unless said.

| Width | |
|---|---|
| 1440 | `.wrap` 1,304px (32px padding). Brand at 100. The strip 470.6px wide, centred (484.7 to 955.3). Theme button 1,152.5 to 1,196.5; Start learning 1,206.5 to 1,337, its offset edge ending at 1,340, the column's line. On Tracks the theme button is last, 1,296 to 1,340. Footer: three columns of 588, 294 and 294px. |
| 960 | The row of five still shows. Brand at 32; the strip centred, 244.7 to 715.3; theme 740.5 to 784.5; Start learning 794.5 to 925, its offset edge at 928. Nothing wraps: the right-hand parts need 187.5px of the 196.7px their column has (9px to spare; Start learning does not wrap if a longer word ever takes it, the strip moves left instead). In B the links are 482.6px wide, centred, 238.7 to 721.3, with 3px to spare. |
| 959 | The menu button takes over: brand at 32, theme 829 to 873, menu 883 to 927. Open: the panel's rows 32 to 927; Start learning 32 to 924, its offset edge at 927. |
| 721 to 958 | The same. The footer keeps three columns. |
| 720 and down | The footer is two columns, the brand across both; its links are 44.8px targets. |
| 375 | Brand 32 to 196; theme 245 to 289; menu 299 to 343. The panel's rows 32 to 343 (311px). Footer columns 139.5px. |
| 342 and down | The row's and the panel's side padding is `(100vw - 278px) / 2`, never under 16px. |
| 320 | Padding 21px: brand 21 to 185; theme 201 to 245; menu 255 to 299. The panel's rows 21 to 299 (278px). Footer columns 112px (the footer's own padding stays 32px). |

No breakpoint is added: 959 / 960px (the header) and 720 / 721px (the footer) are today's.

## 8. Heights, weight, contrast and the keyboard walk, measured

Headless Chromium on the prototype's pages alone (`#solo=1`), fonts loaded. "Today" is the same three built pages in the same harness without the block. Light and dark are the same to the pixel in every height. A and B are the same in every height.

**Heights**

| | Today | D23 | S25 Part 8 |
|---|---|---|---|
| Header, closed: About and Tracks at 320, 375, 959, 960, 1440 | 69 | **69** | 69 |
| Header, menu open, About at 320, 375, 959 | 390.95 | **391** | 391 |
| Header, menu open, Tracks at 320, 375, 959 | 328.95 | **329** | 329 |
| The panel alone, About / Tracks | 321.95 / 259.95 | **322 / 260** | |
| After Escape | 69, the panel hidden, focus on the menu button | the same | |
| The Lesson page's header, closed and open, 320 to 1440 | 69 (the panel, 261px, lies over the lesson) | 69, unchanged | 69 |
| Footer, 320 | 600 | **629** (+29) | 600 |
| Footer, 375 | 553 | **582** (+29) | 553 |
| Footer, 390 / 720 | 528 / 478 | 557 / 507 (+29) | |
| Footer, 721 and 768 | 396 | 401 (+5) | |
| Footer, 959, 960 and 1440 | 371 | **376** (+5) | 371 |
| About, the whole page, 320 / 375 / 1440 | 6,296 / 5,539 / 3,344 | 6,325 / 5,568 / 3,349 | |
| Tracks, the whole page, 320 / 375 / 1440 | 2,533 / 2,368 / 1,599 | 2,562 / 2,397 / 1,604 | |
| Sideways scroll: About and Tracks at 25 widths (every 8px from 320 to 400, every 128px to 1440, and 719, 720, 721, 959, 960), top and foot, menu closed and open: 176 reads | none | none | |

The footer's 29px on a phone: the longer column's five links go from 24.8px lines 10px apart to 44.8px targets (+60px), the heading's margin gives back 4px, the edge adds 1px, and the grid's padding gives back 28px. At 721px and up the links stay 34.8px apart; the 5px is the first and last link's padding (+8px), the heading's 4px back, and the edge. (In this harness About's whole page reads 6,296px at 320 where S25 has 6,344: the prototype's islands are not hydrated. The header's and footer's figures agree with S25.)

**Weight.** The block is 2,926 bytes minified (902 gzipped alone). Worked out on the built pages by adding it, minified, to the `card-stack.css` each already inlines, at `gzip -9`:

| Page | Today | D23 | |
|---|---|---|---|
| Home | 118,576 | 119,100 | +524 |
| Tracks | 59,560 | 60,104 | +544 |
| A track page (`/networking`) | 10,669 | 11,214 | +545 |
| About | 52,179 | 52,764 | +585 |
| The Glossary | 35,145 | 35,719 | +574 |
| 404 | 32,169 | 32,723 | +554 |
| A lesson page | unchanged | unchanged | 0 |

About half a kilobyte a page, a fifth of one percent of the 250 KB budget. With B: 488 bytes more minified, +586 to +655 a page. No script is added; `<script>` elements per page are unchanged.

**Contrast**, each colour over the ground actually behind it (the wash over the card's paper). Text needs 4.5 to 1; an edge, a marker or a ring 3 to 1. Every pair passes.

| Pair | Light | Dark |
|---|---|---|
| The brand, the open menu's rows, on the ground | 14.5 | 17.1 |
| A link on the strip | 12.5 | 10.4 |
| A link of the strip, hovered (on `--cs-quiet`) | 15.3 | 13.8 |
| The current link on its wash | 15.1 | 12.9 |
| The marker against the wash; against the ground (the open menu); B, against the tab's paper (needs 3) | 4.7; 4.5; 5.4 | 4.7; 6.3; 5.6 |
| The header's edge, the strip's edge, the buttons' edges against the ground (needs 3) | 14.5 | 11.6 |
| The strip's and the buttons' edges against their own paper (needs 3) | 17.4 | 10.4 |
| The moon, sun and menu icons on the button | 17.4 | 15.3 |
| The menu icon on the filled, open button | 17.4 | 10.4 |
| Start learning's words on its fill; hovered | 5.6; 6.6 | 6.4; 6.8 |
| Start learning's fill against the ground (needs 3) | 4.5 | 6.3 |
| B: a link on the ground; the tab's words on its paper | 10.5; 17.4 | 11.6; 15.3 |
| The footer's brand and headings on its paper | 17.4 | 15.3 |
| The footer's line and links; a link hovered | 12.5; 17.4 | 10.4; 15.3 |
| The footer's base line (`--muted`) | 6.0 | 6.1 |
| The footer's edge against the ground above it; against its paper (needs 3) | 14.5; 17.4 | 11.6; 10.4 |
| The focus ring against the ground; against the footer's paper (needs 3) | 14.5; 17.4 | 18.6; 16.8 |

The two hair lines (`--cs-hair`: under the row in the open menu and between its rows; over the footer's base line) are 2.1 and 2.2 to 1 against the ground and the paper in light, 2.2 and 2.3 in dark. They are today's lines in the Card stack's own hair token; they separate and carry no meaning.

**The keyboard walk.** Real Tab presses from the page's top to the footer's last link, then Shift+Tab back, with reduced motion so each scroll is done before it is read; with the menu open, from the menu button on through the panel. A stop outside the header fails when its ring (its box grown by 5px) starts above the header's foot. The header's own stops fail when their ring leaves the window.

| Page, width | Stops, there and back | Under the header: today | Under the header: D23 | Header stops cut: today / D23 |
|---|---|---|---|---|
| About, 320 × 640, closed | 21 + 20 | 0 | **0** | 0 / 0 |
| About, 320 × 640, open | 23 + 23 | 0 | **0** | 0 / 0 |
| About, 375 × 812, closed | 21 + 20 | 0 | **0** | 0 / 0 |
| About, 375 × 812, open | 23 + 23 | 0 | **0** | 0 / 0 |
| About, 960 × 900 | 26 + 25 | 0 | **0** | 0 / 0 |
| About, 1440 × 900 | 26 + 25 | 0 | **0** | 0 / 0 |
| Tracks, 320 × 640, closed | 19 + 18 | 0 | **0** | 0 / 0 |
| Tracks, 320 × 640, open | 20 + 20 | 9 | 6 | 0 / 0 |
| Tracks, 375 × 812, closed | 19 + 18 | 0 | **0** | 0 / 0 |
| Tracks, 375 × 812, open | 20 + 20 | 4 | 4 | 0 / 0 |
| Tracks, 960 × 900 | 23 + 22 | 0 | **0** | 0 / 0 |
| Tracks, 1440 × 900 | 23 + 22 | 0 | **0** | 0 / 0 |

Least clearance of a ring under the header on About: 5.9px closed (at 320), 6.9px open (today 19px and 6.9px). The stops and their order are today's at every width. The Escape key closes the menu and returns focus to the menu button, as today.

The fails on Tracks with the menu open are the page's and today's: Tracks sets `scroll-padding-top: 80px` and nothing for the open menu, so a stop can land under the 329px header (by up to 237px today, 199px with D23). The header's height did not change, so neither did this; it is open question 7. Tracks also has no scroll padding at the foot, so a stop reached going down can have the last 5px of its ring under the window's foot: 1 and 3 stops today at 320 and 375, 5 and 4 with D23 (the footer's links, now taller); on About, which has 12px there, none. The same follow-up.

## 9. Every word: new, changed, moved, removed

**None new, none changed, none moved, none removed.** S25 Parts 1 and 2, as they are:

| | Words | Where |
|---|---|---|
| 1 | TechConcepts | the brand, header and footer |
| 2 | Tracks, Glossary, How a lesson works, Sources, About | the five links, in the row and in the open menu |
| 3 | Start learning | the row (960px and up) and the open menu, on every page but Tracks, the track pages and the Lesson page |
| 4 | Guided visual lessons on how technology works. | the footer, under the brand |
| 5 | Learn | the footer's first heading |
| 6 | How the Internet Works, Networking Concepts, All tracks, Glossary, How a lesson works | its five links |
| 7 | Site | the footer's second heading |
| 8 | About | its link |
| 9 | Your progress is saved only in this browser. | the footer's base line |
| 10 | Skip to content | the skip link (`BaseLayout`) |

Names for assistive technology, kept: "TechConcepts home" (the brand, twice), "Site" (the row's `nav`), "Switch theme" and the script's "Switch to dark theme" / "Switch to light theme", "Menu", "Site menu" (the panel's `nav`); `role="contentinfo"`; `aria-current="page"` / `"true"`; `aria-expanded`, `aria-controls="menu-panel"`.

Not words: the section mark is a marker and a wash, not an underline; the menu button is filled in while its menu is open (its `aria-expanded` already says so). No word is proposed for change.

## 10. The block for `src/styles/card-stack.css`

Appended after the file's last rule (`.cs-tab--here::before`), as written here. It is the prototype's `<style id="d23">`, character for character.

```css
/* HEADER AND FOOTER BEGIN: the site's header and footer in the Card stack look (prototypes/d23-header-footer.md).
   The components' own Patch styles (SiteHeader.astro, SiteFooter.astro, ThemeToggle.css, site.css) are the base; this
   block restyles them on the pages that import this file. The Lesson page does not, so its header keeps Patch.
   Every selector starts at header.site-head, .site-head, footer.site-foot or .site-foot and carries one more class or
   element than the rule it restyles, so it wins in any order, with no !important. The header stays 69px: a 67px row
   and a 2px edge. Open below 960px it stays 391px (329px without Start learning): a 322px (260px) panel. */
/* The header is solid now, so the skip link, which sat under it (z-index 10 under 20), is lifted over it. */
a.skip-link {
  z-index: 21;
}
header.site-head {
  border-bottom: 2px solid var(--cs-edge);
  background: var(--ground);
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}
/* 1px of padding on top puts the 44px controls on whole pixels (12px above, 11px and the edge below). Below 342px the
   side padding gives way evenly, so the brand and the two 44px buttons fit: 278px is 164 + 16 + 44 + 10 + 44. */
header.site-head .wrap {
  height: 67px;
  padding: 1px clamp(16px, (100vw - 278px) / 2, 32px) 0;
}
/* The five links: one strip of card. The section you are in has the orange marker and the pale orange wash. */
.site-head .pillnav {
  gap: 2px;
  padding: 2px;
  border: 2px solid var(--cs-edge);
  border-radius: var(--cs-r-in);
  background: var(--cs-card);
  box-shadow: none;
}
.site-head .pillnav a {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  border-radius: 4px;
  color: var(--ink);
  white-space: nowrap;
}
.site-head .pillnav a:not([aria-current]):hover {
  background: var(--cs-quiet);
  color: var(--ink-strong);
}
.site-head .pillnav a[aria-current] {
  background: var(--cs-here-wash);
  box-shadow: none;
  color: var(--ink-strong);
}
.site-head .pillnav a[aria-current]::before,
.site-head .menu-panel a[aria-current]::before {
  content: '';
  flex: none;
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background: var(--cs-here);
  box-shadow: 0 0 0 1.5px var(--cs-edge);
}
/* The theme and menu buttons: 44px, a hard edge, no offset edge (they change the page you are on, they do not take you on). */
.site-head .icon-btn {
  flex: none;
  width: 44px;
  height: 44px;
  border: 2px solid var(--cs-edge);
  border-radius: var(--cs-r-in);
  background: var(--cs-card);
}
.site-head .icon-btn:hover {
  background: var(--cs-quiet);
}
.site-head .icon-btn svg {
  width: 20px;
  height: 20px;
}
/* The menu is open: the button is filled in. */
.site-head .menu-btn[aria-expanded='true'] {
  background: var(--cs-edge);
  color: var(--cs-card);
}
/* Start learning: the Card stack button, 44px in the row and 48px in the menu. Its offset edge ends on the column's line. */
.site-head .btn {
  margin-right: var(--cs-off);
  border: 2px solid var(--cs-edge);
  border-radius: var(--cs-r-in);
  box-shadow: var(--cs-act-edge);
  white-space: nowrap;
  transition:
    transform 80ms var(--ease-out),
    box-shadow 80ms var(--ease-out);
}
.site-head .btn--primary {
  background: var(--cs-act);
  color: var(--cs-act-ink);
}
.site-head .btn--primary:hover {
  background: color-mix(in srgb, var(--cs-act) 88%, var(--cs-edge));
}
.site-head .btn--small {
  min-height: 44px;
  font-size: 17px;
}
.site-head .btn:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 var(--cs-edge);
}
@media (max-width: 959px) {
  /* 1 + 8 + five rows of 45 + their gaps + 18 = 260px; with Start learning (2 + 12 + 48) 322px. */
  .site-head .menu-panel {
    border-top: 1px solid var(--cs-hair);
    padding: 8px clamp(16px, (100vw - 278px) / 2, 32px) 18px;
  }
  .site-head .menu-panel a {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 45px;
    padding: 0;
    border-bottom: 1px solid var(--cs-hair);
    font: 600 18px/1.2 var(--display);
    letter-spacing: 0.01em;
  }
  .site-head .menu-panel a[aria-current] {
    font-weight: 700;
  }
  .site-head .menu-panel .btn {
    min-height: 48px;
    margin-top: 12px;
    border: 2px solid var(--cs-edge);
    color: var(--cs-act-ink);
  }
}

/* The footer: the last card, as wide as the page. */
footer.site-foot {
  border-top: 2px solid var(--cs-edge);
  background: var(--cs-card);
}
.site-foot .foot-grid p {
  color: var(--ink);
}
/* A link's own 4px of padding stands in for 4px of the heading's margin, so heading to words is 14px, as before. */
.site-foot .foot-grid h3 {
  margin-bottom: 10px;
}
.site-foot .foot-grid ul {
  gap: 2px;
}
.site-foot .foot-grid ul a {
  display: inline-block;
  padding: 4px 0;
  color: var(--ink);
}
.site-foot .foot-grid ul a:hover {
  color: var(--ink-strong);
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}
.site-foot .foot-base {
  border-top: 1px solid var(--cs-hair);
}
/* On a phone each link is a 44.8px target, and the grid gives back 28px of its padding. */
@media (max-width: 720px) {
  .site-foot .foot-grid {
    padding: 40px 0 28px;
  }
  .site-foot .foot-grid ul {
    gap: 0;
  }
  .site-foot .foot-grid ul a {
    padding: 10px 0;
  }
}
/* HEADER AND FOOTER END */
```

**Variant B**, if the owner chooses it: these four rules go inside the block, right after its own four `.site-head .pillnav` rules, which they outweigh by coming later at the same weight (the builder may fold each pair into one rule; §6's values are the check). The marker's rule and everything else stay. It is the prototype's `<style id="d23-b">`.

```css
.site-head .pillnav {
  align-self: end;
  gap: 2px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: none;
  box-shadow: none;
}
.site-head .pillnav a {
  height: 38px;
  padding: 0 12px;
  border: 2px solid transparent;
  border-bottom: 0;
  border-radius: var(--cs-r-in) var(--cs-r-in) 0 0;
}
.site-head .pillnav a:not([aria-current]):hover {
  background: none;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 5px;
}
.site-head .pillnav a[aria-current] {
  border-color: var(--cs-edge);
  background: var(--cs-card);
}
```

## 11. For the builder

The prototype's `<style id="d23">` (inside each of its About and Tracks pages) is the block; §10 has it whole. `<style id="d23-b">` is variant B. `<style id="proto">`, `<script id="proto-js">`, the fonts' `<style id="proto-fonts">` and the outer frame are the prototype's and are not built.

**`src/styles/card-stack.css`**, the only file of `src/` that changes besides tests:

- Append §10's block after the last rule, as written. No rule above it changes.
- Rewrite the opening comment's last sentence (line 3 to 4), which says the file reaches "neither the header, nor the footer". Proposed: "Every part is a `--cs-*` name, an opt-in `cs-` class, scoped to `main`, or, in the block at the file's end, scoped to the header and the footer (`.site-head`, `.site-foot`; prototypes/d23-header-footer.md), so the file reaches no page that does not import it; the Lesson page does not, and its header keeps Patch." A comment, not a word a reader sees.
- Two comments outside the block go stale (open question 6). Leave them unless the orchestrator says otherwise.

**Nothing else changes**: `SiteHeader.astro`, `SiteFooter.astro`, `ThemeToggle.css`, `site.css`, `global.css`, `tokens.ts`, `BaseLayout.astro`, `console.css`, every page. No `<script>`. Every page's `main` builds byte-identical, and the Lesson pages build byte-identical whole (their HTML and `_lesson_.*.css`; `BaseLayout.*.css` too, since no component style changes).

**Things that look like choices and are not**

- `header.site-head` and `footer.site-foot`, with the element, are what outweigh the components' `.site-head` and `.site-foot` in any order. Do not drop the element or add `!important`.
- The row is `height: 67px` with `padding-top: 1px`, and the edge is 2px: 69 in all. Do not make the row 68.
- `clamp(16px, (100vw - 278px) / 2, 32px)` is written twice, on the row and on the panel, so the two share a left line at every width. 278 is the brand's 164px, the grid's 16px gap, and 44 + 10 + 44.
- A panel row is `min-height: 45px` with `padding: 0` and its own 1px foot inside it (the site's `box-sizing: border-box`): 45px a row. With the panel's 8px and 18px that is 260px and 322px exactly. If a link is added to or taken from the menu, the pages' open-menu scroll paddings (403px, 341px) change with it, as today.
- `.site-head .menu-panel .btn` sets `border` whole: it puts back the bottom edge `SiteHeader.astro`'s `.menu-panel .btn { border-bottom: 0 }` takes off.
- `.site-head .btn { margin-right: var(--cs-off) }` is what puts the offset edge on the column's line, in the row and in the panel.
- `white-space: nowrap` on Start learning and `flex: none` on the square buttons: without them, at 960px the grid squeezes the right-hand parts and "Start learning" breaks in two.
- The marker's rule is shared by the row and the panel (`.pillnav a[aria-current]::before, .menu-panel a[aria-current]::before`); both links are flex rows, which is what places it.
- `a.skip-link { z-index: 21 }` is the block's one rule outside the header and footer; it stays inside the block's BEGIN and END.
- The footer's links keep 15.5px. At 16px "Networking Concepts" wraps at 390px.

**Tests the design turns red, and the value each takes** (S25 Part 6; the spec review hands out the rest)

| Test | Today | With D23 |
|---|---|---|
| `e2e/site.spec.ts:1884` Start learning's `box-shadow` on Home and About | `none` | `rgb(18, 23, 27) 3px 3px 0px 0px` (light; dark `rgb(198, 205, 209) 3px 3px 0px 0px`). The test's reason (a page's `.btn` leaking into the header) is gone: the header's button is now the same Card stack button on purpose. `home` still equals `about` |
| `e2e/site.spec.ts:1885` its `border-top-width` | `1px` | `2px` |
| `e2e/site.spec.ts:470` every `.site-nav a` on every page | 32 | 36 on the six kinds of page that wear Card stack (38 if B is chosen); still 32 on the Lesson pages, so the loop splits by path |
| `e2e/site.spec.ts:473` Start learning at least 122px wide | 122.9 | 130.5: stays green |
| `e2e/site.spec.ts:1911` the header's ground within 1 channel of the page's | 0.88 alpha of the same colour | the same colour, solid: stays green |
| Page heights pinned within 20 or 40px: `e2e/about.spec.ts:268`, `e2e/tracks-card-stack.spec.ts:598`, `e2e/track-page-card-stack.spec.ts:859`, `e2e/not-found.spec.ts` (D22's check 22, ±20), and Home's and the Glossary's if pinned | | each page grows by the footer's growth: 29px at 320, 29px at 375, 390 and up to 720, 5px at 721 and up. Inside ±40 unless a page already sits near its limit; the 404's ±20 at 320, 375 and 390 goes red by 9px and takes the new heights. Re-measure each on the build |
| The guards pinned to old commits: `src/lib/not-found-page.test.ts:54-80`, `src/scripts/about-page.test.ts:252-265`, `src/lib/glossary-page.test.ts:276-287`, `src/lib/track-page-render.test.ts:206-212`, `src/lib/tracks-render.test.ts:197-215` | `card-stack.css` may differ only at or before line 4; 197 lines | granted exactly: the opening comment, and lines appended after the old last line between the block's BEGIN and END. `SiteHeader.astro`, `SiteFooter.astro`, `site.css`, `global.css`, `tokens.ts`, `src/layouts` stay pinned and unchanged: this design needs none of them |
| `src/lib/home.test.ts:328-346` no colour value outside TOKENS and TINT | green | stays green: the block holds no colour value |
| Comparisons between pages (`not-found.spec.ts:203-230`, `glossary.spec.ts:460-478`, `tracks-card-stack.spec.ts:753-770`, `track-page-card-stack.spec.ts:964-990`) | green | stay green: all six change together |
| Header 69 / 391 / 329 and the scroll paddings (S25 Part 6) | green | stay green |
| The Lesson page's specs (`lesson-layout*.spec.ts`, `tablet.spec.ts`) | green | stay green: nothing it loads changes |

New tests the cases should ask for: the Lesson page's header computes today's Patch values (the row 68px, the edge 1px, `backdrop-filter` set, the pill's inset shadow, the buttons 40px) while About's computes §6's; the focused skip link is the topmost element at its own centre (`document.elementFromPoint`) on a Card stack page.

## 12. Acceptance checks

Each can be tried on the prototype: `d23-header-footer.html#solo=1&page=about` (or `tracks`, `lesson`) is that page alone at the window's width; add `&th=dark`, `&menu=open`, `&nav=b`, `&rings=1`. Sizes are ±0.5px unless said. On the built site, run "Card stack pages" checks on `/`, `/tracks`, `/networking`, `/about`, `/glossary` and an unknown address, and "Lesson" checks on `/networking/dhcp`.

**Words and structure**

1. The header's and footer's text, links, `href`s, ids, classes and accessible names are today's (§9; `site.spec.ts:370-482` passes unchanged but for line 470).
2. Each built page has the same number of `<script>` elements as before, and `SiteHeader.astro`, `SiteFooter.astro`, `ThemeToggle.css` and `site.css` are unchanged against `revamp`.
3. `card-stack.css` differs from before only in its opening comment and by lines appended after its old last line, between `HEADER AND FOOTER BEGIN` and `HEADER AND FOOTER END`. The block holds no `!important` and no colour value.

**Heights** (light and dark the same)

4. The header is 69px at 320, 375, 959, 960 and 1440 on every Card stack page.
5. Below 960px with the menu open the header is 391px where Start learning shows (Home, About, the Glossary, 404) and 329px where it does not (Tracks, the track pages); the panel is 322px and 260px. After Escape the header is 69px, the panel is hidden and focus is on the menu button.
6. Each page's scroll padding and the Glossary's sticky bars (`top: 68px`) are unchanged, and `about.spec.ts:76-86`, `glossary.spec.ts:434-447`, `track-page-card-stack.spec.ts:1004-1020` and `not-found.spec.ts:99-102` pass unchanged.
7. The footer is 629px at 320, 582px at 375 and 376px at 960 and 1440 (±2).
8. `documentElement.scrollWidth` equals `clientWidth` at every width tried from 320 to 1440 (every 8px to 400, every 128px after, and 719, 720, 721, 959, 960), at the top and the foot, the menu closed and (below 960) open.

**The header's look** (§6 has every value, light and dark)

9. `header.site-head`: `background-color` equals the `body`'s, `backdrop-filter` is `none`, `border-bottom-width` is `2px` in `--cs-edge`, `position` `sticky`, `z-index` `20`.
10. The theme and menu buttons are 44 × 44px with a 2px `--cs-edge` edge, 8px corners and `--cs-card` ground; their tops are at y 12 (a whole pixel). With the menu open the menu button's ground is `--cs-edge` and its icon `--cs-card`.
11. Start learning in the row is 44px tall with a 2px edge, 8px corners, `--cs-act` ground, a `3px 3px 0` offset edge and 17px type, on one line at 960 and at 1440; its right edge plus 3px is the column's right edge (928 at 960, 1,340 at 1440). Pressed, it moves 2px down and right and its offset edge is `1px 1px 0`.
12. A: the strip is 44px tall with a 2px `--cs-edge` edge, 8px corners and `--cs-card` ground; each link is 36px tall. On About the About link, on Tracks and on a track page the Tracks link, on the Glossary the Glossary link has a `::before` 9px square in `--cs-here` and a `--cs-here-wash` ground and no inset shadow; on Home and 404 no link has. (B: no strip; each link is 38px tall with its foot on the header's edge at y 67; the current one has a 2px edge on three sides, `--cs-card` ground and the marker.)
13. At 960 on About nothing in the header wraps or overlaps: the brand, the links and the right-hand parts are 16px or more apart.
14. The open menu: five rows of 45px, each with a 1px `--cs-hair` foot, 18px Barlow Semi Condensed 600; the current row is 700 with the marker; the rows' left edge, Start learning's left edge and the brand's left edge are the same x (32 at 375, 21 at 320); Start learning is 48px tall with a 2px edge on all four sides, and its right edge plus 3px is the rows' right edge.
15. At 320 the brand's left edge and the menu button's distance from the window's right edge are both 21px.
16. Focused, the skip link is the element at its own centre point (it is over the header), in light and dark.

**The footer's look**

17. `footer.site-foot`: `--cs-card` ground, a 2px `--cs-edge` top edge; `main`'s next sibling still; three columns at 721 and up, two at 720 and down with the brand across both.
18. Each footer link is `--ink`, 15.5px, 32.8px tall at 721 and up and 44.8px tall at 720 and down (a link on two lines taller); the line under the brand is `--ink`; the base line is `--muted`, 14px.

**Contrast**

19. Every text pair of §8 is 4.5 to 1 or more and every edge and marker 3 to 1 or more, light and dark.

**Focus**

20. Tab from the page's top to the footer's last link and Shift+Tab back, at 320 × 640, 375 × 812, 960 × 900 and 1440 × 900, `transitionsDone` after each press: every stop of the header and footer shows the site's ring whole inside the window; on About no stop outside the header has its ring (its box grown by 5px) above the header's foot, menu closed and (at 320 and 375) open. The stops are today's, in today's order.
21. A focused link of the strip keeps 4px corners, a focused square button or Start learning 8px.
22. With `prefers-reduced-motion: reduce` every check above holds.

**The Lesson page**

23. `/networking/dhcp` and every other lesson page build byte-identical before and after, with `_lesson_.*.css`. Its header computes today's values: the row 68px, a 1px `--line` edge, the 88% ground with the blur, the pill with its inset shadow and the orange underline on Tracks, the theme button 40px; with the menu open below 960px the header stays 69px and the panel lies over the lesson.
24. `getComputedStyle(document.documentElement).getPropertyValue('--cs-edge')` is still empty on `/networking/dhcp`.

**The rest of the site**

25. Every page's `main` builds byte-identical before and after (the islands' random ids aside): a command at merge time.
26. Each Card stack page's gzipped HTML grows by under 700 bytes (worked out: 524 to 585), and the build's budget check passes.

## 13. Decisions, one line each

1. The header's ground is solid and the blur goes: a hard-edged look has no glass, a card scrolling under 88% ground reads as a smudge, and the header now matches the page's colour exactly.
2. The header's foot is the look's 2px ink edge, and the row gives up 1px for it, so the header stays 69px.
3. 1px of padding on top of the row: 44px controls in a 67px row would sit on half pixels and their 2px edges would blur.
4. The five links stay one strip where the pill is (A): the owner's "current top navbar style", in the look's materials.
5. The section you are in is the look's own orange marker with the Home demo's pale wash, not an underline: one mark for "here" across the site.
6. The theme and menu buttons have a hard edge and no offset edge: the offset edge is kept for buttons that take you on, and three offset edges in a 375px row would crowd it.
7. The open menu's button is filled in: today nothing but the panel says the menu is open.
8. The square buttons and Start learning are 44px: the site's phone standard, and with the 44px strip one band across the header.
9. Start learning is the Card stack button whole, edge and offset edge: it is the header's one "do this", and the same button a reader meets in `main`.
10. The open menu's rows are 45px in Barlow: whole pixels, the same face as the row of five, and the panel exactly 322 and 260px.
11. One left line in the open menu, the brand's.
12. Below 342px the header's side padding gives way evenly: the alternative is a row 22px wider than its column at 320.
13. The footer is card paper as wide as the page: the page ends on a card, and the two ink edges (header's foot, footer's top) bracket the ground.
14. The footer has no cards inside it, no tabs and no colour but the logo's: nothing in it is here, to do or done, and the header is where the boldness is spent.
15. Footer links are ink, not muted, and keep 15.5px: they are the footer's content; at 16px "Networking Concepts" wraps at 390px, a line more.
16. Footer links are 44.8px targets on a phone, and the grid gives back 28px of padding there.
17. The skip link is lifted over the header inside this block: the solid header would otherwise hide it, and `global.css` is the Lesson page's too.
18. No component file changes: the block does it all, so the Lesson page is byte-identical by construction.
19. Green, blue and brown are not used: variant A gives each colour one job, and none of those jobs occurs here.

## 14. Open questions for the owner

1. **The five links: A (a strip) or B (tabs)?** A is recommended (§5.3). B is in the prototype behind "The five links".
2. **The header's ground is solid; the blur is gone.** The other way keeps today's 88% ground and blur under the hard edge.
3. **The skip link on the Lesson page stays a ghost under its header** (today's fault, found here; the Lesson page is not this job's). One line in `global.css` (`z-index: 21`) would fix it everywhere and change the Lesson page's stylesheet by that line. Say if it should be its own small unit.
4. **Below 342px the brand sits left of the page's column** (at 21px, the page at 32px, at 320 wide), so that both buttons can be 44px and the row fits. The other way: 40px buttons below 342px and today's overhang.
5. **The footer is 29px taller on a phone and 5px at 721px and up** (§8), all of it the larger link targets. The other way keeps 20px targets and today's height.
6. **Two comments in `card-stack.css` outside the new block go stale**: the TOKENS block's "so the header and the footer, which read only Patch's, do not change" and the buttons' "Scoped to main, so the header's 'Start learning' keeps Patch". The plan lets this job change the opening comment and the new block only. Rewording those two sentences changes no rule; it needs the orchestrator's or the owner's word.
7. **Tracks has no scroll padding for the open menu** (found, not this job's): on Tracks with the menu open, 9 stops at 320 and 4 at 375 take focus under the open header today, and the same stops do with this design. About, the Glossary, 404 and the track page have the rule.
8. **Not checked here:** measured in headless Chromium only (Playwright), with real Tab and Shift+Tab presses under reduced motion. WebKit and Firefox are the build's to run. The weight is worked out on the built pages, not built. Home, the Glossary, 404 and the track pages were not drawn; they get the same block and the same header and footer markup.
