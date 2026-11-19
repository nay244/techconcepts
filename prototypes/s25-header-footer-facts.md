# S25: what the header and footer are made of, and what pins them

Scout S25 (Haiku), job 24, on `revamp` a6589ba, 2026-11-19. Read-only; the scout's rules forbid it report files, so the orchestrator wrote this file from its report word for word where it quotes code, and measured Part 8. Every line number is on a6589ba.

## Part 1: the header (`src/components/SiteHeader.astro`, 219 lines)

### Markup (`:29-58`)

- `:29` `<header class="site-head" data-over-hero={overHero ? '' : undefined}>`, `:30` `.wrap`.
- `:31` `<a class="brand" href="/" aria-label="TechConcepts home">` with `logoMark()` (`:32`) and `<b>TechConcepts</b>` (`:33`).
- `:35` `<nav class="pillnav site-nav" aria-label="Site">`: one link per item of `links` (`:16-22`): Tracks `/tracks`, Glossary `/glossary`, How a lesson works `/#try`, Sources `/#sources`, About `/about`.
- `:38` `.head-end`: `:39` `<button type="button" class="icon-btn theme-toggle" id="theme-toggle" aria-label="Switch theme">` with two `aria-hidden` SVGs (`:40-46`); `:48` `{showStart && <a class="btn btn--primary btn--small" href="/tracks">Start learning</a>}`; `:49` `<button type="button" class="icon-btn menu-btn" id="menu" aria-expanded="false" aria-controls="menu-panel" aria-label="Menu">`.
- `:54-57` `<nav class="menu-panel" id="menu-panel" aria-label="Site menu" hidden>`: the same five links, then Start learning (`:56`).

### Words a reader sees, in order

"TechConcepts" (`:33`), "Tracks", "Glossary", "How a lesson works", "Sources", "About" (`:17-21`), "Start learning" (`:48`, `:56`). Names for assistive technology only: "TechConcepts home" (`:31`), "Site" (`:35`), "Switch theme" (`:39`; the script relabels it "Switch to dark theme" / "Switch to light theme", `src/scripts/theme-toggle.ts:9-11`), "Menu" (`:49`), "Site menu" (`:54`).

### Behaviour

- **Start learning**: href the literal `/tracks`; hidden when `current === 'tracks'` (`:15`), so not on Tracks, the track pages or the Lesson page.
- **`aria-current`** (`:23-26`): `"page"` when the link's href is the path, `"true"` for the current section's link elsewhere.
- **Script** (`:60-91`): the menu below 960px. `setOpen` sets `aria-expanded` and `panel.hidden` (`:68-71`); the button toggles (`:72`); a click on a link in the panel closes it (`:73-75`); Escape closes it when open and focuses the button (`:76-81`). No outside-click close, no focus trap. `solidOnScroll(head)` only for `.site-head[data-over-hero]` (`:84-86`). `wireThemeToggle(themeButton)` (`:88-90`).
- **Without JavaScript**: below 960px the menu button shows (`:195-197`) but does nothing and the panel stays `hidden`, so there are no header links below 960px; the theme button is hidden by `BaseLayout.astro:80`; the desktop nav works.
- **Theme toggle**: plain markup in the header, not the React island. `src/scripts/theme-toggle.ts:17-35` flips `data-theme`, saves it under `THEME_KEY`, relabels. `ThemeToggle.css:30-42` shows the right icon from `data-theme` or `prefers-color-scheme` before the script runs. `src/components/ThemeToggle.tsx` has no importer but its test.
- **Logo**: `src/art/logo.ts:46-49` `logoMark()`: `<svg class="logo" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">`, three paths (`:23-27`), the message `var(--logo-accent, #b04617)` (`:17`). `src/components/LogoMark.tsx` is a React copy whose only importer is `LogoMark.test.tsx`.
- **Skip link**: not in the header. `src/layouts/BaseLayout.astro:95` `<a class="skip-link" href="#main">Skip to content</a>`, before the header (`:99`); target `main#main` (`:101`, or the page's own when `main={false}`, `:104-106`); styles `src/styles/global.css:162-177`, z-index 10 (the header's is 20).

### Styles (scoped `<style>`)

| Lines | Selector | Sets |
|---|---|---|
| 94-102 | `.site-head` | `position: sticky; top: 0; z-index: 20`; `border-bottom: 1px solid var(--line)`; background `color-mix(in srgb, var(--ground) 88%, transparent)`; `backdrop-filter: blur(10px)` |
| 103-109 | `.site-head .wrap` | grid `1fr auto 1fr`, height 68px (69 with the rule), gap 16px |
| 110-120 | `.brand` | inline-flex, gap 0.36em, ink-strong, `700 22px/1 var(--display)` |
| 121-128 | `.brand b`, `.brand .logo` | font inherit; logo 1.3em square |
| 129-136 | `.pillnav` | flex, gap 2px, padding 3px, radius `--r-btn`, card at 70%, inset 1px `--line-strong` |
| 137-144 | `.pillnav a` | padding 8px 14px, radius 2px, ink, `600 16px/1 var(--display)`, no underline |
| 145-153 | `.pillnav a:hover`, `[aria-current]` | ink-strong; current: bg-soft, inset `0 -2px 0 var(--here)` |
| 154-163 | `.head-end`; `.menu-btn, .menu-panel` | end, flex, gap 10px; menu parts `display: none` |
| 164-185 | `.site-head[data-over-hero]` and `.solid` | fixed and clear over a hero; **no page passes `overHero`** (Part 4) |
| 187-218 | `@media (max-width: 959px)`, 7 blocks | two columns; nav and `.head-end .btn` hidden; menu button shown; panel: top rule, padding 8px 16px 16px, grid when open; panel links padding 12px 4px, bottom rule, ink-strong, `600 17px/1.2 var(--sans)`; panel button margin-top 12px |

15 top-level blocks and 7 in the one media query. **Icon button** (`ThemeToggle.css`): `.icon-btn` 40×40 (`:2-16`), hover bg-soft (`:17-19`), active scale 0.96 (`:20-22`), svg 18px (`:23-26`); two `prefers-color-scheme` queries (`:34-43`).

## Part 2: the footer (`src/components/SiteFooter.astro`, 96 lines)

- Comment `:4-6`: the brand rules come with SiteHeader; the explicit `role` is for "a split page (the track page) ... inside main". **Stale**: the track page passes no footer prop and `track-page-render.test.ts:63` asserts the footer is `main`'s next sibling (`plan.md` lists it as a deferred item).
- Markup `:9-38`: `<footer class="site-foot" role="contentinfo">`, `.wrap`, `.foot-grid` of three columns: the brand link and `<p>` (`:12-18`); `h3` Learn with five links (`:19-28`: How the Internet Works `/how-the-internet-works`, Networking Concepts `/networking`, All tracks `/tracks`, Glossary `/glossary`, How a lesson works `/#try`); `h3` Site with About `/about` (`:29-34`); `.foot-base` (`:36`).
- **Words, in order**: "TechConcepts", "Guided visual lessons on how technology works.", "Learn", "How the Internet Works", "Networking Concepts", "All tracks", "Glossary", "How a lesson works", "Site", "About", "Your progress is saved only in this browser."
- **Styles** (`:40-95`, `is:global`): `.site-foot` margin-top 128px, top rule, bg-soft (`:41-45`); `.foot-grid` `minmax(0, 2fr) repeat(2, minmax(0, 1fr))`, gap 32px, padding 56px 0 40px (`:46-51`); `p` muted 15.5px, max 24em (`:52-57`); `h3` `600 17px/1.2 var(--display)` ink-strong (`:58-62`); `ul` grid gap 10px (`:63-70`); links muted, no underline, hover ink-strong (`:71-77`); `.foot-base` top rule, padding 20px 0 28px, 14px muted (`:78-83`); `@media (max-width: 720px)`: margin-top 96px, two columns, the brand column the whole row (`:85-95`). 8 top-level blocks, 3 in the query. No script.

## Part 3: what they read from shared files

- **Header**: `--ground`, `--line`, `--card`, `--line-strong`, `--r-btn`, `--ink`, `--ink-strong`, `--display`, `--bg-soft`, `--here`, `--sans`, `--accent-ink`; through `ThemeToggle.css` also `--ease-out`; through `logo.ts` `--logo-accent`.
- **Footer**: `--bg-soft`, `--display`, `--ink-strong`, `--line`, `--muted`.
- **Where defined**: colours in `src/styles/tokens.ts` (light `:62-96`, dark `:97-132`), emitted by `tokensToCss()` (`:148-155`) and inlined by `BaseLayout.astro:69`. `--display`, `--sans`, `--mono`, `--ease-out`, `--logo-accent: var(--accent)`, `--r-btn: 4px` in `src/styles/global.css:13-40`. Global rules that reach them: `.wrap` (`global.css:155-159`), `:focus-visible` 2px ring, offset 3px (`:137-141`), `a` (`:98-107`).

| Token | Light | Dark |
|---|---|---|
| ground / bg-soft | `#e4e7e8` | `#101315` |
| card | `#fafbfa` | `#1a1e21` |
| line | `rgba(18, 23, 27, 0.14)` | `rgba(243, 245, 246, 0.10)` |
| line-strong | `rgba(18, 23, 27, 0.34)` | `rgba(243, 245, 246, 0.26)` |
| ink / ink-strong | `#2b3238` / `#12171b` | `#c6cdd1` / `#f3f5f6` |
| muted | `#57626a` | `#949ea4` |
| accent = here / accent-ink | `#b04617` / `#ffffff` | `#f0702e` / `#1c0c03` |

- **`site.css`** (imported by `SiteHeader.astro:4`, not by the footer): `.btn` (`:3-21`), `.btn--primary` (`:28-32`), `.btn--small` (`:36-40`), all on Start learning. The footer uses no `site.css` class. Neither file nor `ThemeToggle.css` reads a `--cs-*` name.

## Part 4: where they are rendered

Only `BaseLayout.astro` imports and renders them (`:5-6`, `:99`, `:107`); `chrome` (default true) controls the header and `footer` (default true) the footer.

| Page | Props |
|---|---|
| `index.astro:45-48` (Home) | none of note; **no `overHero`** (built `dist/index.html` has no `data-over-hero`), so `.site-head[data-over-hero]` and `src/scripts/site-head.ts` are unused |
| `tracks.astro:25`, `[track]/index.astro:59` | `current="tracks"` |
| `glossary.astro:18`, `about.astro:50-53` | `current="glossary"`, `current="about"` |
| `404.astro:14` | `canonical={null}` |
| `[track]/[lesson].astro:48` (the Lesson page) | `current="tracks" main={false} footer={false}`: the same header, **no footer** |

`current="how"` and `"sources"` are typed (`SiteHeader.astro:8`) but no page passes them.

**The Lesson page leans on the header's height**: `src/lesson/console.css:31` console height `calc(100vh - 69px)`; `:42-46` `:root:has(.console) { scroll-padding-top: 69px }`; `:47-53` `body:has(.console) .site-head .menu-panel { position: absolute; inset: 100% 0 auto; background: var(--ground); border-bottom: 1px solid var(--line-strong) }`; `LessonConsole.tsx:218-232` closes the menu on `focusin` outside `.site-head`.

**Pages that lean on it** (none styles `.site-head`, `.brand`, `.pillnav` or `.site-foot`): `tracks.astro:111-115` scroll-padding 80px; `[track]/index.astro:82-91` 80px, 341px with the menu open below 960px; `about.astro:251-264` 80/12px, 403px open; `glossary.astro:48-54` 80/12px, 403px open, sticky bars at `top: 68px` (`:74`, `:138`); `404.astro:35-46` 80/12px, 403px open; `index.astro:348` `section[id] { scroll-margin-top: 88px }`.

## Part 5: `card-stack.css` (197 lines)

Lines 1–4, verbatim:

```
/* The Card stack's shared parts (prototypes/d17-home-card-stack.md, prototypes/d18-tracks-card-stack.md §3): cards with a
   hard edge on Patch's ground. Imported by Home (src/pages/index.astro), the Tracks page (src/pages/tracks.astro), the track page (src/pages/[track]/index.astro), About (src/pages/about.astro), the Glossary (src/pages/glossary.astro) and the 404 page (src/pages/404.astro)
   only. Every part is a `--cs-*` name, an opt-in `cs-` class, or scoped to `main`, so the file reaches neither the
   header, nor the footer, nor a page that does not import it. */
```

TOKENS block (`:6-46`), its head: "No Patch token is given a new value here, so the header and the footer, which read only Patch's, do not change." 19 names on `:root` (`:9-31`): `--cs-edge: var(--ink-strong)`, `--cs-card: var(--card)`, `--cs-quiet: var(--tile)`, `--cs-hair: var(--line-strong)`, `--cs-r: 10px`, `--cs-r-in: 8px`, `--cs-off: 3px`, `--cs-stack: 6px`, `--cs-dither`, `--cs-act: var(--accent)`, `--cs-act-ink: var(--accent-ink)`, `--cs-act-edge: var(--cs-off) var(--cs-off) 0 var(--cs-edge)`, `--cs-here`, `--cs-here-ink`, `--cs-here-wash: var(--here-soft)`, `--cs-done`, `--cs-done-text`, `--cs-request`, `--cs-response`. Dark: `--cs-edge: var(--ink)` (`:33-40`); below 860px `--cs-stack: 4px` (`:41-45`).

Parts: **buttons** scoped to `main` (`:48-82`; comment: "Scoped to main, so the header's 'Start learning' keeps Patch"): 2px edge, radius `--cs-r-in`, offset shadow, `600 18px/1.2`, pressed translate 2px; **figure tint** scoped to `main`, `.lm-defs`, `#main` (`:84-143`; "the header and the footer keep Patch's"); **cards** by `cs-` class (`:145-196`: `.cs-card`, `--beneath`, `--soon`, `.cs-tab` 34px `600 16px/1`, `.cs-tab--here::before`). **No link selector** (links are styled per page: `index.astro:352-357`, `tracks.astro:107-110`, `[track]/index.astro:98-100`). No selector targets `.site-head`, `.site-foot`, `header`, `footer`, `.brand` or `.pillnav`.

## Part 6: tests that pin them

About 65 end-to-end and 45 unit tests read the header or footer (grep, approximate). No committed screenshot baselines (`e2e/visual.spec.ts` writes PNGs to `test-results/visual`; no `toHaveScreenshot`).

### Absolute pins (red on a change of colour, edge, shadow or height)

- `e2e/site.spec.ts:1884-1885` (test "3: the header is the same on Home and on /about", `:1860`): Start learning `box-shadow: none` and `border-top-width: 1px`.
- `site.spec.ts:1911` (test "4: one ground from the header down", `:1888`): the header's background within 1 channel of the body's.
- `site.spec.ts:470` `.site-nav a` 32px tall; `:473` Start learning at least 122px wide; `:1009-1013` without script one `.theme-toggle`, hidden.
- **Header 69px**: `lesson-layout.spec.ts:60`; `lesson-layout-small.spec.ts:62`, `:350` (`[0,0,375,69]`); `track-page-card-stack.spec.ts:1037` (closed at most 69).
- **Open header 391px**: `not-found.spec.ts:661`; `about.spec.ts:111`, `:915`; `glossary.spec.ts:821`. **329px** on the track page: `track-page-card-stack.spec.ts:1004-1012`, `:1134`.
- **Scroll padding** 80 / 341 / 403 / 69: `about.spec.ts:76-86`; `glossary.spec.ts:434-447`; `track-page-card-stack.spec.ts:1004-1020`; `not-found.spec.ts:99-102`.
- `track-page-card-stack.spec.ts:997` `.site-head` is `sticky` at 375, 1023, 1024, 1440; `:998` `main`'s next sibling is `footer.site-foot`.
- `src/components/LogoMark.test.tsx:7-19`: the React mark equals `logoMark()` path for path.
- `src/styles/tokens.test.ts:42-45`, `:110-113`, `:137-156`: token values and contrast (red on any token change).
- `src/lib/glossary.test.ts:75`: ids `menu`, `menu-panel`, `theme-toggle` reserved.

### Equal across pages (red only if pages differ from each other)

- `not-found.spec.ts:203-230` (test "17"): head, brand, Glossary link, foot, About link as on `/tracks` in style and `/about` in words.
- `glossary.spec.ts:460-478`: header and footer as on Tracks.
- `tracks-card-stack.spec.ts:753-770`: header and footer as on About.
- `track-page-card-stack.spec.ts:964-990`: "the header and the footer are the site's", `/networking` against `/about`.

### Behaviour and words

- `site.spec.ts:349-361` skip link first Tab on every `ALL_PAGES` page; `:370-386` Tracks link and `aria-current`; `:388-406` Start learning on Home, About and 404 only, footer order; `:408-423` the theme button's name and storage, kept on `/about`; `:425-437` header and menu links the same five; `:439-446` Glossary current; `:448-459` the footer's Learn list; `:461-482` menu at 959, nav at 960, six in the open menu; `:112-138` Home's anchors below the header; `:971-987` 404 has both; `:2670-2690`, `:2785-2810` the lesson's narration and focus ring at least 69px down.
- `not-found.spec.ts:656-662`, `:695-715`, `:763-790`, `:840-851`, `:900-926` (menu open, focus clear of the header, no script).
- `glossary.spec.ts:480-489`, `:815-821`; `about.spec.ts:104-112`, `:280-290`, `:826-855`, `:963-967`; `tracks-card-stack.spec.ts:362`, `:612-665`, `:826-836`; `track-page-card-stack.spec.ts:234`, `:1036-1037`, `:1133-1142`.
- `lesson-layout.spec.ts:56-70` (69px, no footer, no `btn--primary` in the header, one theme toggle), `:81`, `:87`, `:817-863`; `lesson-layout-small.spec.ts:59-83`, `:350-351`, `:601-610`; `tablet.spec.ts:132`, `:243`, `:353`.
- Unit: `src/lesson/no-script.test.ts:51-56`, `:109-115`; `src/lesson/TopBar.test.ts:44`; `src/lesson/LessonConsole.test.tsx:429`; `src/layouts/BaseLayout.test.ts:20-45`; `ThemeToggle.test.tsx:20-93` (8); `src/scripts/theme-toggle.test.ts:29-87` (7); `src/scripts/site-head.test.ts:12-34` (2).

### Guards pinned to old commits (red on any header or footer edit)

- `src/lib/not-found-page.test.ts:54-60` (test "1"): `git diff --name-only 1d8e446` over a list with `SiteHeader.astro`, `SiteFooter.astro`, `site.css`, `global.css`, `tokens.ts`, `src/layouts` must be empty. `:62-72` (test "2"): `card-stack.css` hunks at or before line 4, 197 lines, lines 5 on equal the base, the head names six importers. `:74-80` (test "3"): `BaseLayout.astro` must not contain `card-stack.css`.
- `src/scripts/about-page.test.ts:252-265`: hunks at most line 4 against f30e876; shared files incl. both components unchanged.
- `src/lib/glossary-page.test.ts:276-287`: the same against f30e876.
- `src/lib/track-page-render.test.ts:206-212`: `card-stack.css` hunks at most line 4 against e6441c2; `:187-188` no `footer={false}` on the track page.
- `src/lib/tracks-render.test.ts:197-203`: the importers are exactly the six pages; `:212-215` both components and `tokens.ts` unchanged against e6441c2.
- `src/lib/home.test.ts:328-346`: no colour value in `card-stack.css` outside the TOKENS and TINT blocks.
- `scripts/check-budgets.test.mjs:224`: 250 KB HTML, 200 KB JS a page; no header or footer pin.

## Part 7: what `docs/direction.md` says

- §6 (line 245): since 2.84 Patch is the Lesson page's look and the header's and footer's. Line 281: "The Home header that sits clear over the hero until the page scrolls" is listed to go.
- §7 (line 293): the header on top at every width on the Lesson page (69px; Tracks current; no footer); below 960px its menu lies over the lesson and closes when focus leaves the header (E28).
- §8 (line 425): says the lesson's top bar uses `LogoMark.tsx`; it has no importer.
- §9 (lines 451, 459, 467): Home on Patch's header and footer; the header's links renamed; "The header's small Start learning button is 40px tall, as before (the header stays Patch)".
- 2.81: "Keep our current top navbar style and add a few color's so that it is not simply black and white". 2.84: the header and footer keep their style until the last page has moved. 2.95, 2.96: the Lesson page has the site's header (no Start learning, no footer). 2.100: lesson scroll padding 69px. 2.101: B23's blocker was focus under the open menu. 2.89: no site rule keeps focus clear of the sticky header (follow-up). 2.119: header and footer compared in style with `/tracks`, in words with `/about`. 2.121: this job. §11 (lines 505, 521, 531): the header the only sticky thing on the track page; About's scroll padding.

## Part 8: measured (the orchestrator)

`npx astro build` of a6589ba, served from `dist`, headless Chromium, fonts loaded, light and dark identical in every figure.

| Page | Header closed | Open menu: its foot from the top, 320 and 375 | Footer 320 / 375 / 1440 | Page 320 / 375 / 1440 |
|---|---|---|---|---|
| `/` | 69 | 391 | 600 / 553 / 371 | 4,696 / 4,490 / 3,621 |
| `/tracks` | 69 | 329 (no Start learning) | 600 / 553 / 371 | 2,533 / 2,368 / 1,599 |
| `/networking` | 69 | 329 | 600 / 553 / 371 | 4,686 / 4,330 / 2,910 |
| `/about` | 69 | 391 | 600 / 553 / 371 | 6,344 / 5,587 / 3,364 |
| `/glossary` | 69 | 391 | 600 / 553 / 371 | 52,004 / 45,324 / 20,300 |
| `/404` | 69 | 391 | 600 / 553 / 371 | 1,430 / 1,423 / 1,201 |
| `/networking/dhcp` (Lesson) | 69 | 330 (the panel absolute, over the lesson; the header stays 69) | none | 640 / 812 / 900 (one screen) |

With the menu open the panel is inside the header, so the header itself is 391px (329 where there is no Start learning), as the tests pin; on the Lesson page the panel lies over the lesson (`console.css:47-53`). The header is sticky on every page; its background is `color(srgb 0.894 0.906 0.910 / 0.88)` in light. Screenshots (untracked) in `.superpowers/job24/look/`: `before-head-{about,lesson}-{375,1440}-{light,dark}.png`, `before-foot-{375,1440}-{light,dark}.png`, `before-menu-{about,lesson}-{light,dark}.png`.
