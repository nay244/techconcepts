# S24: what the 404 page is made of, and what pins it

Scout report for job 23 (the 404 page moves from Patch to the Card stack). Read-only: no source file, build, dev server or Playwright run. The only file written is this one.

**Checkout.** The worktree is at `b14f4d1` on `claude/job23-404-f9d693`, clean at the start. Paths below are relative to the worktree root `/Users/naaay/Developer/WebProjects/TechConcept/.claude/worktrees/job23-404-f9d693`.

## Part 1: the page's code

### The file

- `src/pages/404.astro`, 90 lines, 2677 bytes.
- Frontmatter (`404.astro:1-11`). The comment at `:2-3` says: "The page for an address the site does not have. Its picture is a patch panel with every port linked but 404 (src/art/figures/pages.ts), and its one fact is what the number means, with the lesson it comes from."
- Imports: `pageFigure` from `'../art/figures/pages'` (`:4`); `startLesson` from `'../lib/start'` (`:5`); `BaseLayout` from `'../layouts/BaseLayout.astro'` (`:6`); `'../components/site.css'` (`:7`). No other import.
- `const lesson = startLesson();` (`:10`), with the comment at `:9`: "Lesson 1 is HTTP, where status codes are met."

### Layout call

`404.astro:13`:
`<BaseLayout canonical={null} title="Page not found" description="That page does not exist. Head back to the TechConcepts home page or the tracks.">`

- `canonical={null}`: no canonical link (see Part 6).
- Default props not overridden: `chrome` true, `main` true, so `BaseLayout` wraps the page in `<main id="main">` (`src/layouts/BaseLayout.astro:100-101`), and renders the header and footer (`BaseLayout.astro:99`, `:107`; `SiteHeader` and `SiteFooter` imported at `:5-6`).
- The title becomes "Page not found · TechConcepts" (`src/layouts/BaseLayout.astro:48-49`: `${title} · ${SITE_NAME}`).

### Markup (`404.astro:14-31`)

```
div.wrap.notfound
  div.notfound__words
    p.notfound__code            "Error 404"
    h1                           "That page isn't here"
    p.notfound__lede            "The link may be old, or the address may have a typo."
    p.notfound__actions
      a.btn.btn--primary href="/"          "Go to Home"
      a.btn href="/tracks"                  "See the tracks"
    p.notfound__why
      "The server is working, but it has nothing at this address. That is what the number 404 means."
      a href={lesson.url}                   "Lesson {lesson.number}, {lesson.title}"
      "shows where it comes from."
  div.notfound__art
    Fragment set:html={pageFigure('notFound')}
```

Line map: `:14` wrap; `:15` words; `:16` "Error 404"; `:17` h1; `:18` lede; `:19-22` actions; `:20` "Go to Home"; `:21` "See the tracks"; `:23-26` why; `:24` the sentence "The server is working..."; `:25` the lesson link and "shows where it comes from."; `:28-30` art.

### Every word a reader sees, in page order

1. `Error 404` (`404.astro:16`)
2. `That page isn't here` (`:17`; straight apostrophe in the source)
3. `The link may be old, or the address may have a typo.` (`:18`)
4. `Go to Home` (`:20`), link to `/`
5. `See the tracks` (`:21`), link to `/tracks`
6. `The server is working, but it has nothing at this address. That is what the number 404 means.` (`:24`)
7. `Lesson {lesson.number}, {lesson.title}` (`:25`), link to `{lesson.url}`. The built words are "Lesson 1, HTTP" (`e2e/site.spec.ts:982`, which pins the link name and `START_PATH` `/how-the-internet-works/what-is-http`, `e2e/site.spec.ts:37`).
8. `shows where it comes from.` (`:25`)
9. Browser title: `Page not found · TechConcepts` (`404.astro:13` via `BaseLayout.astro:49`; pinned at `e2e/site.spec.ts:975`).
10. Meta description, not shown on the page: `That page does not exist. Head back to the TechConcepts home page or the tracks.` (`404.astro:13`)
11. Words inside the figure (drawn in SVG, not in the HTML text): the port numbers `401` to `408` (`src/art/figures/pages.ts:62`, `` `40${i + 1}` ``); the label passed to the plate, `PORT 404 · NO LINK` (`pages.ts:87`); the figure's `aria-label`, "A patch panel with eight numbered ports, 401 to 408. Seven have a cable plugged in and a link light on. Port 404 is empty and its light is off; its cable stops short on the plate, the plug lying loose." (`pages.ts:89`). Whether the label is painted on screen was not checked beyond its being passed to `base(label)` (`pages.ts:38-39`).
12. Header and footer words come from `SiteHeader.astro` and `SiteFooter.astro` through `BaseLayout`; not read for this report, except `Start learning` (`src/components/SiteHeader.astro:14`, `:48`, `:56`), which the header shows on the 404 page (`e2e/site.spec.ts:388`).

### The page's `<style>` (`404.astro:34-90`, scoped to the component)

| Lines | Selector | What it sets |
|---|---|---|
| 35-41 | `.notfound` | `display: grid`; `grid-template-columns: minmax(0, 5fr) minmax(0, 7fr)` (`:37`); `gap: clamp(24px, 4vw, 64px)`; `align-items: center`; `padding-block: clamp(32px, 6vw, 88px)` |
| 42-53 | `.notfound__code` | inline-block tag, `margin: 0 0 14px`, `padding: 4px 10px`, `border: 1px solid var(--line-strong)`, `border-radius: 2px`, `background: var(--card)`, `color: var(--ink-strong)`, `font: 600 15px/1.2 var(--display)`, `letter-spacing: 0.02em`. Comment at `:46`: "A strip of label tape, like the port's own label." |
| 54-59 | `.notfound h1` | `margin: 0`; `font-size: clamp(44px, 6.4vw, 88px)`; `line-height: 0.94`; `letter-spacing: -0.005em` |
| 60-65 | `.notfound__lede` | `max-width: 30em`; `margin: 18px 0 0`; `color: var(--ink-strong)`; `font-size: 19px` |
| 66-71 | `.notfound__actions` | flex, wrap, `gap: 10px`, `margin: 22px 0 0` |
| 72-78 | `.notfound__why` | `max-width: 32em`; `margin: 28px 0 0`; `padding-top: 16px`; `border-top: 1px solid var(--line-strong)`; `font-size: 16px` |
| 79-81 | `.notfound__why a` | `color: var(--link)` |
| 82-89 | `@media (max-width: 860px)` | `.notfound` becomes one column `minmax(0, 1fr)` (`:84`); `.notfound__art` gets `order: -1` (`:87`), so the figure comes first on a phone |

- `.notfound__words` and `.notfound__art` have no rule of their own outside the media query (`:86-88`).
- Tokens read by this block: `--line-strong`, `--card`, `--ink-strong`, `--display`, `--link`. No hex colour in the file.
- No `<script>` in the file. The page has no island.

## Part 2: the `notFound` figure

- Defined at `src/art/figures/pages.ts:45-91`. Comment `:45`: "Not found: a patch panel with every port linked but one, and the cable that stops short of it". Function `notFound(): string` at `:46`, closing at `:91`.
- Exported through `PAGE_FIGURES = { inside, sources, notFound, notReady }` (`pages.ts:282`).
- `pageFigure(name)` calls `PAGE_FIGURES[name]()` (`src/art/figures/pages.ts:286`); used at `404.astro:29`.
- Source size: `pages.ts` is 20857 bytes in all; lines 45-91 are 3203 bytes. **The SVG output's size in bytes was not measured** (no code was run).

### What it draws (from `pages.ts:46-90`)

- A patch panel: plan `PN` at `x -94, y -56, w 188, d 18, r 2` (`:48`), height 60 (`TOP = 60`, `:51`), base `Z0 = 14` (`:50`).
- Two stands under the panel, at `x = -88` and `x = 74` (`:55`).
- The panel body, `hi` tone, with two seams and a bevel of 0.8 (`:56`); a dot grid on its top (`:57`).
- The face (`:58-66`): an inlay strip (`lm-inlay`, `:59`); eight ports at `portX(i) = -77 + i * 22` (`:52`), each with a printed number `401`..`408` (`lm-pkt-t`, `:62`), a socket void (`lm-void`, `:63`) and a slot (`lm-void`, `:63`); four corner screws (`lm-dotc`, `:65`).
- Link lights: one LED per socket at the face (`:67-68`, `lm-leds` group, `led(..., i !== MISSING, 1.25)`). `MISSING = 3` (`:53`), which is port 404; its light is off. The comment at `:67` says "A link light under every socket. Port 404's is dark." The lit LEDs carry class `lm-led on`; the dark one carries class `lm-led`.
- Seven cables (`:69-78`): a boot (`slab`, `mid` tone) at each linked socket (`:72`), then a fillet route down to the cable bar (`run`, `:73-74`, radius 1.7 tubes). The eighth cable (`loose`, `:76-77`) leaves the bar, wanders and stops short of port 404.
- The loose plug (`PLUG`, `:79-80`) is the figure's one lit part: `slab(PLUG, 0, 9, 'hi', { lit: true, bevel: 0.9 })`. Four pin lines and a bar of symbols (`lm-sym-lit`, `:81`).
- The cable bar (`BAR`, `:70`): a slab with a seam and bevel (`:83`) and eight slot outlines (`:84`).
- The figure call (`:85-90`): `figure('notfound', 'PORT 404 · NO LINK', out.join(''), '<aria-label>')`.
- Tones named in the figure: `hi`, `mid`, `lo`, `faint` (kit tone names); classes: `lm-svg lm-notfound` (set by `figure()` at `:41`), `lm-body`, `lm-inlay`, `lm-void`, `lm-pkt-t`, `lm-dotc`, `lm-leds`, `lm-led`, `lm-led on`, `lm-sym-lit`. The function itself contains no hex colour and no CSS token. The colours come from the shared stylesheet `src/art/lumen.css` (`lm-` rules) and, on the Card stack, from `src/styles/card-stack.css:88-143` (see Part 4).

### viewBox

- The plate's crop is `const CROP = '36 30 528 386';` (`pages.ts:37`).
- `figure()` replaces `viewBox="0 0 ${W} ${H}"` with `viewBox="${crop}"` (`pages.ts:38-43`, the `.replace` at `:42`). So the figure's viewBox is `36 30 528 386`.

### Who uses `notFound`

- `src/art/figures/pages.ts:46` (definition), `:282` (export).
- `src/art/figures/pages.test.ts:11` (`expect(NAMES).toEqual(['inside', 'sources', 'notFound', 'notReady'])`), `:50-55` (the port test), `:51` (`pageFigure('notFound')`).
- `src/pages/404.astro:29` (`pageFigure('notFound')`).
- No other page or test uses it (`grep -rn notFound src e2e scripts` returned only these).

## Part 3: what `src/components/site.css` gives the page

- The page imports it at `src/pages/404.astro:7`.
- Rules the 404 markup uses (`src/components/site.css`):
  - `.btn` (`:3-21`): inline-flex, `min-height: 48px`, `padding: 0 22px`, `border: 1px solid var(--line-strong)`, `border-radius: var(--r-btn)`, `background: var(--card)`, `color: var(--ink-strong)`, `font: 600 17px/1.2 var(--display)`.
  - `.btn:hover` (`:22-24`), `.btn:active` (`:25-27`, `transform: scale(0.97)`).
  - `.btn--primary` (`:28-32`), `.btn--primary:hover` (`:33-35`). Used by "Go to Home" (`404.astro:20`).
  - `class="btn"` on "See the tracks" (`404.astro:21`) uses `.btn` alone.
- Defined in `site.css` but not used by the 404 markup: `.btn--small` (`:36-40`), `.eyebrow` (`:43-59`), `.accent` (`:61-63`), `.disp` (`:69-78`), `.label` (`:79-84`), `.h-chip` (`:88-98`), `.name-tile` (`:107-121`), `.card` (`:122-126`), `.badge` (`:127-160`), `.segbar` (`:163-179`), `.toc-h` (`:181-187`), `.stamp` (`:193-222`), `.lift` (`:224-235`). The 404 has its own `h1` and `p`s and none of these classes.
- `.wrap` is not in `site.css`. It is in `src/styles/global.css:155-159` (`max-width: calc(1240px + 64px)`, `margin: 0 auto`, `padding: 0 32px`), used by `404.astro:14`.
- Imports of `site.css` (`grep -rnE "import .*site\.css" src e2e`):
  - `src/components/SiteHeader.astro:4`. `BaseLayout` renders the header (`src/layouts/BaseLayout.astro:99`), so every page with the header loads `site.css`.
  - `src/components/Stamp.tsx:2`; `src/components/ResetProgress.tsx:3`; `src/components/hub/TrackRoute.tsx:5`; `src/components/hub/TrackPanelProgress.tsx:3`; `src/components/hub/TrackSide.tsx:3`; `src/lesson/Explanation.tsx:2`.
  - Pages: `src/pages/404.astro:7`, `src/pages/about.astro:16`, `src/pages/glossary.astro:9`, `src/pages/index.astro:20`, `src/pages/tracks.astro:13`, `src/pages/[track]/index.astro:20`.
  - So other pages still import `site.css`, directly and through the header.
- `src/components/site.css` is 240 lines, 6095 bytes. Its first line (`:1`): "/* Shared by the progress islands and the site pages. Colour comes from the tokens only. */"

## Part 4: what `src/styles/card-stack.css` gives

### Opening comment (lines 1-10, quoted exactly)

```
/* The Card stack's shared parts (prototypes/d17-home-card-stack.md, prototypes/d18-tracks-card-stack.md §3): cards with a
   hard edge on Patch's ground. Imported by Home (src/pages/index.astro), the Tracks page (src/pages/tracks.astro), the track page (src/pages/[track]/index.astro), About (src/pages/about.astro) and the Glossary (src/pages/glossary.astro)
   only. Every part is a `--cs-*` name, an opt-in `cs-` class, or scoped to `main`, so the file reaches neither the
   header, nor the footer, nor a page that does not import it. */

/* TOKENS BEGIN: the Card stack's own names, on :root. No Patch token is given a new value here, so the header
   and the footer, which read only Patch's, do not change. The page's ground stays Patch's ground. Colour variant A:
   Patch's own colours, so this block adds no colour value to the site. */
```

The comment names the five pages at `:1-3`. Line 2 is the one a sixth importer would make wrong.

### Size

- 196 lines, 5934 bytes (`wc -lc`).

### Parts (line ranges in `src/styles/card-stack.css`)

- **Tokens** (`:6-46`): a `:root` block of `--cs-*` names (`:9-31`): `--cs-edge: var(--ink-strong)` (`:11`), `--cs-card: var(--card)` (`:12`), `--cs-quiet: var(--tile)` (`:13`), `--cs-r: 10px` (`:15`), `--cs-r-in: 8px` (`:16`), `--cs-off: 3px` (`:17`), `--cs-stack: 6px` (`:18`), `--cs-act: var(--accent)` (`:21`), `--cs-here: var(--here)` (`:24`), `--cs-done: var(--allowed)` (`:27`), `--cs-request` and `--cs-response` (`:29-30`). Dark theme `:33-35`; `prefers-color-scheme` dark `:36-40`; `--cs-stack: 4px` at `max-width: 860px` (`:41-45`).
- **Offset-edge buttons** (`:48-82`): `main .btn` (`:50-64`): `border: 2px solid var(--cs-edge)` (`:53`), `border-radius: var(--cs-r-in)` (`:54`), `box-shadow: var(--cs-off) var(--cs-off) 0 var(--cs-edge)` (`:56`), `font: 600 18px/1.2 var(--display)` (`:58`); `main .btn:hover` (`:65-67`); `main .btn--primary` (`:68-72`, `box-shadow: var(--cs-act-edge)`); `main .btn--primary:hover` (`:73-75`); `main .btn:active` (`:76-79`, `transform: translate(2px, 2px)`); `main .btn:focus-visible` (`:80-82`). Scoped to `main`, so the header's "Start learning" keeps Patch (comment `:48-49`).
- **Figure re-tint** (`:84-143`): `main, .lm-defs` (`:87-94`); `#main .lm-svg` (`:95-109`, anatomy colour variables, `animation: none`); `[data-theme='dark'] #main .lm-svg` (`:110-121`); `prefers-color-scheme` dark (`:122-135`); `#main .lm-led.on` (`:136-138`, `filter: none`); `#main .lm-orbit` (`:140-142`, `display: none`).
- **Cards** (`:145-161`): `.cs-card` (`:146-151`, `border: 2px solid var(--cs-edge)`, `border-radius: var(--cs-r)`, `background: var(--cs-card)`); `.cs-card--beneath` (`:153-157`, stacked shadow); `.cs-card--soon` (`:159-161`, dashed border).
- **Index tabs** (`:162-196`): `.cs-card:has(> .cs-tab)` (`:163-165`); `.cs-tab` (`:166-184`, absolute, `bottom: 100%`, `height: 34px`, top corners rounded by `--cs-r-in`); `.cs-card--soon > .cs-tab` (`:185-188`); `.cs-tab--here::before` (`:189-196`, a small square in `--cs-here`).
- **Links**: none. The file has no rule for `a` or any link class.

### Which pages import it today

`grep -rnE "import .*card-stack" src` (import lines; the test files also match on their own text):
- `src/pages/index.astro:21` (Home)
- `src/pages/tracks.astro:15`
- `src/pages/[track]/index.astro:22`
- `src/pages/about.astro:17`
- `src/pages/glossary.astro:10`

The 404 page does not import it (`src/pages/404.astro:4-7` lists its imports).

### The test that pins "exactly five pages"

- Commit `9fa303a` ("test: card-stack.css is imported by exactly five pages: Home, Tracks, the track page, About and the Glossary (F22)"). `git show --stat 9fa303a` shows one file changed: `src/lib/tracks-render.test.ts` (8 insertions, 5 deletions).
- The test is in `src/lib/tracks-render.test.ts`: `:196` `describe('the shared Card stack stylesheet', ...)`; `:197` `test('is imported by Home, the Tracks page, the track page, About and the Glossary, and by nothing else', ...)`.
- Its grep, `:198`: `grep -rlE "import .*card-stack\.css" src || true`. `:200` drops `.test.ts` files; `:201` sorts.
- Its assertion, `:202-208`, quoted:
  ```
  expect(importers).toEqual([
    'src/pages/[track]/index.astro',
    'src/pages/about.astro',
    'src/pages/glossary.astro',
    'src/pages/index.astro',
    'src/pages/tracks.astro',
  ]);
  ```
- Two more tests pin the import's position: `src/lib/glossary-page.test.ts:264-268` (`expect(lines[site + 1]).toBe("import '../styles/card-stack.css';")` at `:268`) and `src/scripts/about-page.test.ts:238-239` (regex at `:239`).

## Part 5: tests that touch the 404

Search: `grep -rn -i '404\|notfound\|not found\|isn.t here' src e2e`, read through. Matches that are not about this page (status-code fixtures, `rfc-8404`, the factcheck "not found" messages, `Not Found` in a glossary term, pixel sizes) are left out.

### Unit tests (Vitest)

- `src/art/figures/pages.test.ts:11`: "there are four page figures" (`NAMES` includes `notFound`).
- `:14-21`: every page figure has `role="img"` and an aria-label over 80 characters.
- `:23-32`: every page figure stands on the shared plate: `class="iso-svg lm-svg lm-`, one `lm-pool`, one `lm-orbit lm-orbit2`.
- `:34-37`: exactly one `data-lit` per figure (`:36`; the 404's plug).
- `:39-48`: no film grain, no `id`, no `url(#…)` other than `lm-` gradients, no closing script, style, body or head tag.
- `:50-55`: "the not-found figure numbers its ports 401 to 408 and leaves only port 404 without a link light": `>${n}</text>` for 401 to 408 (`:52`), seven `class="lm-led on"` (`:53`), one `class="lm-led"` (`:54`).
- `:57-59`: a figure is the same drawing every time.
- `src/lib/tracks-render.test.ts:196-208`: the Card stack import list (Part 4). It does not name the 404 page.
- `src/lib/glossary-page.test.ts:264-268` and `src/scripts/about-page.test.ts:238-239`: import order (Part 4).
- `src/lib/glossary-page.test.ts:327-333`: counts `a.gl-src` as 404 (a source count, unrelated to the page).

### End-to-end (Playwright)

- `e2e/support.ts:44-52` `SITE_PAGES`: includes `{ name: '404', path: '/does-not-exist' }` (`:51`). Used by:
  - `e2e/visual.spec.ts:84-89`: the `@visual` screenshot loop, `for (const { name, path } of SITE_PAGES)`: opens the page, `shoot(page, name, ...)`, expects no errors. The 404 screenshot is `404-<size>-<theme>` in the screenshot output folder. The describe is `test.describe('screenshots', { tag: '@visual' }, ...)` (`:54`), run by `npm run e2e:visual` and left out of `npm run e2e` (`package.json:14-15`). The header comment at `visual.spec.ts:5-6` says "About and 404".
  - `e2e/site.spec.ts:449` (test at `:448`: "the footer lists Glossary after All tracks and opens /glossary on every page").
  - `e2e/site.spec.ts:1055-1060` (phone: "loads and scrolls with no errors"; `:1059` expects status 404 when `name === '404'`).
- `e2e/support.ts:44-52` also feeds `ALL_PAGES` (`e2e/site.spec.ts:28`), so these tests run on `/does-not-exist`:
  - `e2e/site.spec.ts:350` skip link is the first stop on every page (test `:349`).
  - `:372` header Tracks link and footer All tracks link open /tracks on every page (test `:370`).
  - `:390` "Start learning opens /tracks on Home, About and 404…" (test `:388`). The 404 is not in `hasNoStart` (`:389`), so it is expected to show Start learning.
  - `:426` header links (test `:425`).
  - `:440` Glossary is current on /glossary only (test `:439`).
  - `:462` menu button at 959px, row of five at 960px (test `:461`).
  - `:990` no page carries an analytics script without a token (test `:989`).
  - `:997` no page scrolls sideways, at the top or the bottom (test `:996`).
  - `:1010` no page shows the header's theme toggle without JavaScript (test `:1009`, inside `test.describe('without JavaScript')`).
- `e2e/site.spec.ts:971-986`: "/does-not-exist serves the 404 page, with the site header and footer". Asserts, in order:
  - status 404 (`:973`);
  - `hydrated(page)` (`:974`);
  - title `'Page not found · TechConcepts'` (`:975`);
  - level-1 heading `"That page isn't here"` (`:976`);
  - `main` link "Go to Home", exact, href `/` (`:978`);
  - link "See the tracks", exact, href `/tracks` (`:979`);
  - `main` contains "The server is working, but it has nothing at this address." (`:981`);
  - link "Lesson 1, HTTP", exact, href `START_PATH` (`:982`);
  - image in `main` named `/Port 404 is empty and its light is off/`, visible (`:984`);
  - `header.site-head` visible (`:985`) and `footer.site-foot` visible (`:986`).
- `e2e/site.spec.ts:78-89`: "the share image has its description…", on a page of every template. The list includes `/this-page-does-not-exist` (`:81`, comment `:80`): `og:image:alt` once, straight after `og:image`, with the default words.
- `e2e/tracks-card-stack.spec.ts:800-806`: `for (const path of ['/does-not-exist', '/networking/dhcp'])`, test `${path} does not read the Card stack's names` (`:801`), expects `--cs-edge` to be `''` (`:803`). **This pins the 404 as a page that does not read the Card stack**, and would fail once the page imports `card-stack.css`.
- `e2e/about.spec.ts:88-96`: "--cs-edge is set on /about and still empty on a missing page and on a lesson"; `page.goto('/does-not-exist')` (`:92`) and `expect(await edge()).toBe('')` (`:93`). **Also pins the 404 as having no `--cs-edge`.**
- `e2e/glossary.spec.ts:448-456`: "--cs-edge is set on /glossary and on no page that does not import the stylesheet"; `expect(await edge('/does-not-exist')).toBe('')` (`:454`). **Also pins it.**
- `e2e/support.ts:67-81` `collectErrors`: leaves out the 404's own console error "status of 404" for `/does-not-exist` (`:77`).
- `e2e/site.spec.ts:801` (`/networking/<old slug>` expects 404) is a different page: the removed lesson addresses, not the 404 page.
- `grep -rn notfound e2e` returned nothing.

### `e2e/global-setup.ts`

- Does not name 404 or `/does-not-exist`. It reads `/tracks` and each track page (`e2e/global-setup.ts:16-17`, `:23`).

### Budget script

- `scripts/check-budgets.mjs:39` comment: "`404.html` is `/404`."
- `scripts/check-budgets.mjs:71` `listPages(dist)`, which lists every `.html` under `dist`. So `dist/404.html` is weighed as route `/404` with `lesson: false`, and is checked against the HTML budget only.
- Budgets (`scripts/check-budgets.mjs:17`): `html: 250_000`, `lessonJs: 200_000`, in gzipped bytes.
- `scripts/check-budgets.test.mjs:67` (`'404.html': page('lost')`) and `:77` (`{ file: '404.html', route: '/404', lesson: false }`), in the test "every page is listed with its route, in route order".

## Part 6: how the 404 is served

- `astro.config.mjs:6-11`: `site: 'https://techconcepts.app'` (`:7`); `integrations: [react()]` (`:8`); `redirects: { '/networking/how-the-internet-works': '/how-the-internet-works' }` (`:10`). No 404 entry.
- `wrangler.jsonc:8-11` (Cloudflare Workers static assets):
  - `"assets": { "directory": "./dist", ... }` (`:8-9`);
  - comment `// An unknown address gets the site's own 404 page, with a 404 status.` (`:10`);
  - `"not_found_handling": "404-page"` (`:11`).
  - So an unknown path is answered with the built `404.html` and status 404. `e2e/site.spec.ts:972-973` pins the status.
- `public/_headers` (`:1-10`) has no 404 rule. It sets cache for `/_astro/*` (`:4-5`) and `X-Robots-Tag: noindex` for `https://:worker.:account.workers.dev/*` (`:10-11`).
- `public/_redirects`: does not exist (`ls public`: `_headers`, `favicon.svg`, `og-default.png`).
- No `_worker.js`, `functions/` or `wrangler.toml` in the worktree root. `wrangler.jsonc` is the only Cloudflare config found.
- `canonical={null}` in `src/layouts/BaseLayout.astro`:
  - Prop doc, `:30-34`: "`null` means no canonical link at all (the 404 page, which is no address to name); og:url stays the page's own."
  - `:35`: `canonical?: string | null;`
  - `:56`: `const pageUrl = canonicalUrl(canonical ?? Astro.url.pathname, Astro.site ?? Astro.url);`
  - `:87`: `{canonical !== null && <link rel="canonical" href={pageUrl} />}`. With `null`, the 404 has no `<link rel="canonical">`.
  - `:88`: `<meta property="og:url" content={pageUrl} />`, always. With `null`, `canonical ?? Astro.url.pathname` falls back to the request's own path.
  - `canonicalUrl` is in `src/lib/url` (not read).

## Part 7: what `docs/direction.md` says about 404

`grep -n '404' docs/direction.md` returns 11 lines: `:20, :96, :111, :165, :181, :270, :354, :382, :401, :495, :510`. Line `:354` matches only a pixel size, "348×404", and is not about the page.

- `:20` (§1, row 1.2): "...Home, the track page behind "See the whole track", About and 404 get new layouts, with the shared header and footer."
- `:96` (row 2.69): "...404 28 of 36; four Opus design reviewers..." (the critique score for the 404 page, 28 of 36).
- `:111` (row 2.84): "Card stack replaces Patch on every page but the Lesson page". Its rulings: "the pages move one job at a time, each through the design gate: Tracks first (job 18, 2.85), then the track page, About, the Glossary and 404, in an order set when each is planned".
- `:165` (performance table, row 004): "Home and 404 load 1.3 KB of JavaScript, down from 73.0 KB."
- `:181` (item 6): "**Home, the track page, About and 404.** DONE 2026-11-10. Home is an original page (§9). The track page keeps its layout and is lighter; About and 404 have new layouts (§11)."
- `:270` (the prototype's "Not in the prototype"): "the scene's motion, the Tracks page, the track page, About and 404."
- `:354`: not about the page (pixel size).
- `:382`: "...from three reference drawings (a desk robot, a dashboard, a 404 scene) and the Anatomy skill..." (the owner's 2026-11-10 reference drawings).
- `:401` (the figures table): "| `notFound` | A patch panel, ports 401 to 408, seven linked; port 404 is empty and dark | The 404 page | The loose plug that stops short of port 404 |".
- `:495`: "## 11. The track page, About and 404 (built 2026-11-10; the track page and About rebuilt 2026-11-18)".
- `:510` (§11): "**404: the address leads nowhere.** The words on the left, the `notFound` figure on the right: a patch panel with every port linked but 404. Under the buttons the page says what the number means (the server is working, and has nothing at this address) and links to lesson 1, HTTP, where status codes are met. Buttons: Go to Home, See the tracks."

No line in `docs/direction.md` says the 404 is already on the Card stack. `:111` puts it in a later job "in an order set when each is planned".

## Part 8: measured (the orchestrator)


Built on `revamp` b14f4d1 (`npm run build`, "Every page is within budget (42 pages)"), served from `dist/`, headless Chromium, fonts loaded, `/404.html`.

| | light | dark |
|---|---|---|
| 1440 × 900 | 1,245px | 1,245px |
| 390 × 844 | 1,440px | 1,440px |
| 375 × 812 | 1,454px | 1,454px |
| 320 × 640 | 1,519px | 1,519px |
| Sideways scroll | none at any of the four | none |
| The figure (x, y, w, h) | 1440: 650, 161, 690 × 504; 375: 32, 107, 311 × 227; 320: 32, 107, 256 × 187 | the same |
| The heading's top | 1440: y 239 (165px tall); 375: y 394; 320: y 354 | the same |
| HTML raw / gzipped | 128,649 / 31,158 bytes (31.3 KB in the build's table) | |
| `<script>` elements / JS | 2 / 1.2 KB in 2 files, 1 inline | |

Screenshots (full page, 1440 and 375, light and dark): `.superpowers/job23/look/before-404-*.png` (untracked).
