# TechConcepts Redesign Build: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the approved redesign mockups into the real Astro site: new look and type, Anatomy figures drawn at build time, a Watch › Learn › Practice lesson console, four ready lessons (How the Internet Works, Subnetting, DHCP, Firewalls), a 20-lesson track, and new Home, track, About and 404 pages, ready for the owner to approve the deploy.

**Architecture:** Still a static Astro site with React islands. Figures are drawn in TypeScript at build time with the vendored Anatomy kit and land in the HTML as inline SVG. A lesson's content file holds its words and events. The console island derives everything it shows from `(position, eventIndex)` by a pure function, as today, and hands that state to a small per-figure *driver* that only moves named SVG parts and toggles classes. Lessons are made of *units*: every lesson has one, except How the Internet Works, which has one per protocol (14).

**Tech Stack:** Astro 7, `@astrojs/react`, React 19, TypeScript (strict), zod 4, `@fontsource/atkinson-hyperlegible-next` and `@fontsource/atkinson-hyperlegible-mono` (both 5.3.0, OFL-1.1). Dev: Vitest 5, Testing Library, jsdom, Playwright, `@astrojs/check`, wrangler.

**Spec:** `docs/superpowers/specs/2026-11-05-techconcepts-redesign-build-design.md` (the build design, "§" below), which builds on `docs/superpowers/specs/2026-11-03-techconcepts-networking-launch-design.md` ("launch §"). Executors read both alongside this plan.

**Reference material (not in any worktree):** the mockups and the scripts that drew them live only in the main checkout, which is git-ignored:

- Mockups: `/Users/naaay/Developer/WebProjects/LevelUp/.superpowers/brainstorm/2830-1793891117/content/` (`MOCKUPS` below).
- Figure and content scripts: `/Users/naaay/Developer/WebProjects/LevelUp/.superpowers/brainstorm/2830-1793891117/figs/` (`FIGS` below).
- The Anatomy kit: `/Users/naaay/Developer/WebProjects/LevelUp/.superpowers/brainstorm/2830-1793891117/anatomy-src/repo/kit/` (`KIT` below), MIT, by Ryan (github.com/wheresryan22/anatomy).

Open a mockup in the built-in browser by serving `MOCKUPS` with any static server (for example `npx http-server MOCKUPS -p 5055`), or open the file directly. The scripts are the best record of geometry, routes, timings and words. Port what they do into the site's TypeScript, with tests; never import from `FIGS` or `KIT` at runtime or in tests.

## Global Constraints

- Site name **TechConcepts**, one word with capital T and C, everywhere. Domain `techconcepts.app`, HTTPS only.
- Fully static output: no server code, no API routes, no database.
- Lesson flow is **Overview, Watch, Learn, Practice** (owner). Try is gone everywhere: no Try code, schema, copy or tests remain.
- Voice is beginner-first: the everyday idea, then the term. Exam-level detail sits in a **Go deeper** section that is closed by default (owner).
- Watch step titles are **Title Case technical terms**; plain words go in the sub line; Learn's pattern box uses the same names (owner).
- Playback (owner): **one speed button that cycles 0.5×, 1×, 1.5×, 2× (default 1×)**. **Play runs every Watch step** from the current one to the last, holding about **2.6 s** between steps, then shows Pause, then Replay. **Moving by hand stops the run.**
- Track: **20 lessons**. How the Internet Works is lesson **1**, Subnetting **8**, DHCP **10**, Firewalls **17**; these four are ready, the other 16 are "Coming soon" (owner).
- Minutes (§7.5): words read ÷ 200, plus 0.5 per Watch step, plus 1 for Practice, rounded up; lesson 1 counts 0.5 of Practice per protocol. Results: **How the Internet Works 96, Subnetting 10, DHCP 8, Firewalls 10, 124 in all**. Lessons are capped at 15 minutes (build fails above 15, warns above 12); lesson 1 is exempt as a whole and each of its protocols is capped at 15 instead.
- Lesson limits (launch §7.1, kept): 4–6 Watch steps per unit; narrative ≤ 120 words; hook ≤ 80 words; 2–4 facts per step; 2–3 Practice questions (lesson 1: exactly 2 per protocol) with 2–4 options each; at least 1 source per unit; at least 1 cert tag per lesson.
- Desktop only for now: designed for 1280 to 1440 px wide, checked up to 1920. Small screens are not designed but must load and scroll without errors (owner).
- Illustrations: Anatomy kit figures in the lumen finish. Charcoal solids with fine light edges, one gradient-lit part per figure in our blue (`--lit-a #a8e8ff`, `--lit-b #2f7bff`, pool `#2f7bff`), a soft glow pool, dashed orbit rings, a rounded plate with corner screws and one engraved label. **No film grain:** the `#lm-grain` filter is left out of the markup entirely. Figures stay charcoal in both themes. Art is original; never copy or trace (owner).
- Fixed-meaning lights keep their colours in both themes, whatever the accent: alarm red; severity red, orange, yellow, then green once patched; Firewalls' allow `#3ddc7c` and deny `#ff4f4f`.
- Colour meanings (§5): marigold `--here` means only "you are here / current"; lost, dropped and denied things use the **blocked** red; a cache miss is neutral with a "miss" label. The eight semantic tokens stay (request, response, control, broadcast, allowed, blocked, encrypted, selected), WCAG AA in both themes, and colour is never the only signal.
- Type: Atkinson Hyperlegible Next for prose, Atkinson Hyperlegible Mono for data, self-hosted (no Google Fonts requests).
- English only; no language menu.
- Example network data (launch §5): public-looking hosts use `192.0.2.0/24`, `198.51.100.0/24` or `203.0.113.0/24`; private networks use RFC 1918 ranges; MACs use `00:00:5E:00:53:xx`.
- No gamification: no points, scores, badges or streaks. Practice is never scored or saved.
- Browser storage holds only `techconcepts:theme` and `techconcepts:v1`, always through `SafeStorage`; every page works when storage throws.
- Page weight: every page's HTML ≤ **250 KB gzipped** on first load; JS per lesson page ≤ **200 KB gzipped** (launch §11).
- No packet inspector UI (owner). Packet data may stay in content where it already exists.
- Runtime dependencies allowed: `astro`, `@astrojs/react`, `react`, `react-dom`, `zod`, `@fontsource/atkinson-hyperlegible-next`, `@fontsource/atkinson-hyperlegible-mono`. Anything else needs a written reason in its commit message.
- Not a Protocol Explorer copy: take only the structure and order of lesson 1's protocols; never its colours, branding, text or art.
- Work on a feature branch in a worktree cut from `redesign` (which holds the spec and this plan). **Never merge into `main` or push without the owner's explicit OK, each time.**
- Commits follow the repo's style (`feat:`, `fix:`, `test:`, `docs:`, `chore:`, `refactor:`), one or more per task.
- Until Task 21 rewrites the end-to-end suite, a task is green when `npx vitest run` and `npm run build` pass. `npm run e2e` is expected to fail from Task 5 to Task 20.

## Review Focus

1. **Input during a Play run:** pressing → or ←, clicking the outline, toggling the view or cycling the speed while a step plays or during the 2.6 s hold. The late timer must be ignored, the run must stop on a hand move, and the scene, panel and log must equal a fresh derivation of the new position, with no tag left halfway along a cable. *Pinned in Task 7 (stale `tick` and `holdDone`) and Task 9 (driver `play` aborts and settles).*
2. **Switching Network ↔ Sequence mid-step:** the Network figure re-shows the settled state when it comes back, and the Sequence rows always equal the log rows. *Pinned in Task 9.*
3. **Saved progress from the live site:** records written by the old console (DHCP positions up to 8, Firewalls and Subnetting up to 9) load into the new, shorter lessons: positions clamp to the new last position, finished stays finished, nothing crashes. *Pinned in Task 6.*
4. **Odd `?step=` links:** `?step=abc`, `?step=2.5`, `?step=-1` open the Overview; `?step=999` opens the last Practice; in lesson 1 a valid number lands in the right protocol. *Pinned in Task 6.*
5. **Reduced motion with storage blocked:** a Play run still advances at its normal pace (waits still wait, only motion is skipped), and the lesson plays end to end with no storage. *Pinned in Task 7 and Task 21.*

---

## File Structure

New or rewritten (✱ marks a file that replaces an existing one):

```
src/art/kit/iso-kit.ts  lathe.mjs  tube.mjs  LICENSE  SOURCE.md      vendored Anatomy kit (MIT)
src/art/common.ts            camera, scale, plate and drawing helpers (port of FIGS/common.mjs)
src/art/lumen.css            the lumen finish, figure tokens, small-figure parts (no grain)
src/art/defs.ts              lumenDefs(): the shared gradient <defs>
src/art/ids.ts               scopeIds(), cropViewBox()
src/art/figures/covers.ts    the six track covers
src/art/figures/spots.ts     six small figures: watch, learn, practice, subnet, dhcp, firewall
src/art/figures/hero-web.ts  the home hero (How the Web Works cover, animated)
src/art/figures/internet-thumb.ts  lesson 1's track thumbnail
src/art/scenes/types.ts      FigureId, FigureParts, DrawnFigure
src/art/scenes/parts.ts      FIGURE_PARTS: places, cues and layers each scene figure supports
src/art/scenes/index.ts      drawFigure(id)
src/art/scenes/dhcp.ts  subnet.ts  firewall.ts  net-map.ts  net-map-layers.ts
src/scenes/driver.ts         SceneDriver contract, DriverModule, SceneView
src/scenes/motion.ts         along(), ease, animate() with AbortSignal
src/scenes/drivers/dhcp.ts  subnet.ts  firewall.ts  net-map.ts  index.ts   (each: create() and duration())
src/scenes/SequenceView.tsx ✱
src/styles/tokens.ts ✱  global.css ✱  src/components/site.css ✱ (page styles from the mockups)
src/content/schema.ts ✱  define.ts ✱  estimate.ts ✱  registry.ts ✱
src/content/tracks/networking.ts ✱
src/content/helpers/firewall-events.ts  internet-events.ts  subnet-events.ts
src/content/lessons/networking/how-the-internet-works.ts  (+ how-the-internet-works/<protocol>.ts × 14)
src/content/lessons/networking/subnetting.ts ✱  dhcp.ts ✱  firewalls.ts ✱
src/engine/tables.ts (moved out of timeline.ts)  timeline.ts ✱  playback.ts ✱
src/lesson/LessonConsole.tsx ✱  TopBar.tsx ✱  Outline.tsx ✱  Explanation.tsx  Practice.tsx
src/lesson/LogPanel.tsx  PlaybackControls.tsx ✱  ScenePanel.tsx  Rich.tsx  console.css ✱
src/lesson/panels/TablePanel.tsx (moved from src/scenes/table/DeviceTablePanel.tsx)  RulesPanel.tsx  BitsBoard.tsx
src/components/SiteHeader.astro ✱  SiteFooter.astro ✱  ThemeToggle.tsx ✱  Figure.astro  LumenDefs.astro
src/components/HeroCta.tsx  TrackCardProgress.tsx  TrackHeroCta.tsx  TrackSidebar.tsx  TrackLessons.tsx
src/components/HeroWeb.astro  NetworkingCover.astro  ResetProgress.tsx ✱
src/scripts/hero-web.ts  router-cover.ts  about-toc.ts
src/pages/index.astro ✱  [track]/index.astro ✱  [track]/[lesson].astro ✱  about.astro ✱  404.astro ✱
scripts/check-budgets.mjs
e2e/site.spec.ts ✱  e2e/lesson.spec.ts ✱  e2e/visual.spec.ts
```

Removed in Task 5 (so `astro check` passes on the new content model): the old lessons `src/content/lessons/networking/{dhcp,subnetting,firewalls}.ts(+tests)`; every file in `src/lesson/` except `keyboard.ts`, `useLessonShortcuts.ts`, `useReducedMotion.ts` and their tests; `src/engine/timeline.ts`, `src/engine/playback.ts` and their tests (Tasks 6–7 write new ones); `src/scenes/inspector/`, `src/scenes/playground/`, `src/scenes/flow/`; `firewallScenario`, `FIREWALL_COLUMNS` and `Probe` in `src/engine/net/firewall.ts` with their tests (`evaluateRules` and `ruleRows` stay); `src/components/ContinueCard.tsx` and its cases in `progress-islands.test.tsx`. Removed later: `TrackLessonList.tsx`, `TrackProgress.tsx` (Task 18). Tests sit beside their source as `*.test.ts(x)`; component tests start with `// @vitest-environment jsdom`.

---

## Phase 1: Look and art

### Task 1: Fonts, tokens and base styles

**Files:**
- Modify: `package.json` (remove `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono`; add `@fontsource/atkinson-hyperlegible-next@5.3.0`, `@fontsource/atkinson-hyperlegible-mono@5.3.0`), `src/styles/tokens.ts`, `src/styles/tokens.test.ts`, `src/styles/global.css`, `src/components/site.css` (the existing page stylesheet; later tasks rewrite its rules page by page)

**Interfaces:**
- Produces: `TokenName` becomes the site tokens the mockups use: `bg`, `bg-soft`, `card`, `card-2`, `tile`, `line`, `line-strong`, `ink`, `ink-strong`, `muted`, `accent`, `accent-ink`, `accent-soft`, `accent-line`, `here`, `here-soft`, `focus`, `dot`, `hero-bg`, `hero-glow`, `shadow-sm`, `shadow-lg`, `btn-shadow`, plus the eight semantic tokens. The mockups' drawing tokens (`--world-*`, `--iso-*`, `--plate-*`, `--screen*`, `--ready-top`) are not site tokens: Tasks 17–18 copy any that the ported markup still uses into the CSS that uses them. `tokensToCss(): string` emits `:root,[data-theme="light"]{…}` and `[data-theme="dark"]{…}` (the selectors the mockups use; check `src/lib/theme.ts` sets `data-theme` on `<html>`, and keep it that way). CSS custom properties are named `--<token>`.

- [ ] **Step 1: Write the failing token tests.** Replace the token-name assertions in `tokens.test.ts`; keep its contrast and OKLab helpers.

```ts
test('every theme defines the same tokens, including the eight semantic ones', ...) // keys equal across themes; SEMANTIC ⊂ keys
test('the mockup palette is used as given', () => {
  expect(tokens.light).toMatchObject({ bg: '#ffffff', 'ink-strong': '#0b1a33', accent: '#1f63c0', here: '#a86a00', allowed: '#23824a', request: '#1f63c0', response: '#b4540a', broadcast: '#b23a8e' });
  expect(tokens.dark).toMatchObject({ bg: '#060c17', 'ink-strong': '#f2f7ff', accent: '#5aa9ff', here: '#f5b83d', allowed: '#5fd68a', request: '#5aa9ff', response: '#ff9f5a', broadcast: '#ff7fc4' });
});
test('ink, muted, accent, here and every semantic token reach 4.5:1 on bg and card in both themes', ...)
test('the eight semantic hues stay apart: OKLab distance ≥ 0.08 between any two, in each theme', ...)
test('blocked is red in both themes: dark #ff7a7a, light #c22f2b', ...)
test('tokensToCss emits [data-theme="dark"] and a light block that also covers :root', ...)
```

- [ ] **Step 2: Run them to see them fail:** `npx vitest run src/styles` → FAIL (old graphite palette).
- [ ] **Step 3: Rewrite `tokens.ts`.** Copy every site token's light and dark value from the `[data-theme="light"]` and `[data-theme="dark"]` blocks at the top of `MOCKUPS/home-v6.html` (the shared values are the same in `track-v2.html`; `tile`, `hero-bg` and `hero-glow` come from home-v6, `dot` from track-v2). `request`, `response`, `broadcast`, `allowed` are the mockups' values; `blocked` is `#ff7a7a` dark / `#c22f2b` light (from `firewalls-v1.html`). Choose new `control`, `encrypted` and `selected` values (§5: the mockups don't define them) that pass the tests. Drop graphite-only tokens (`panel`, `panel-raised`, `ink-muted`): grep `src/` for `var(--panel`, `var(--ink-muted` and map them to `card`, `card-2`, `muted` in the CSS that remains.
- [ ] **Step 4: Fonts and base styles.** In `global.css` import `@fontsource/atkinson-hyperlegible-next/{400,500,600,700}.css` and `@fontsource/atkinson-hyperlegible-mono/{400,500,700}.css`; set `--sans: 'Atkinson Hyperlegible Next', system-ui, sans-serif`, `--mono: 'Atkinson Hyperlegible Mono', ui-monospace, monospace`, `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`; body `17px/1.6 var(--sans)` on `var(--bg)`; the mockups' `:focus-visible`, `.sr-only`, `.wrap` (max-width 1180px, padding 0 24px), skip link. Remove every IBM Plex reference (`grep -rn "Plex" src` returns nothing).
- [ ] **Step 5: Run** `npm install`, `npx vitest run src/styles` → PASS; `npm run build` → PASS.
- [ ] **Step 6: Commit** `feat: Atkinson Hyperlegible type and the redesign palette`.

### Task 2: Vendor the Anatomy kit and port the shared figure helpers

**Files:**
- Create: `src/art/kit/iso-kit.ts` (copy of `KIT/iso-kit.ts`), `src/art/kit/lathe.mjs`, `src/art/kit/tube.mjs` (copies; change only their import paths), `src/art/kit/LICENSE` (the repo's MIT licence, from `KIT/../LICENSE`), `src/art/kit/SOURCE.md` (where the files came from, that only these three are vendored, and that they are unchanged apart from import paths)
- Create: `src/art/common.ts`, `src/art/lumen.css`, `src/art/defs.ts`, `src/art/ids.ts`, `src/components/LumenDefs.astro`, tests `src/art/common.test.ts`, `src/art/ids.test.ts`

**Interfaces:**
- Produces: `src/art/common.ts` exports every name `FIGS/common.mjs` exports, with the same behaviour (`k`, `G`, `tubePieces`, `tubeSvg`, `W` 600, `H` 420, `PLATE` `{x:-112,y:-74,w:224,d:148,r:10}`, `PLATE_H` 9, `FOOT_H` 4, `FLOOR`, `P`, `V`, `at`, `S`, `L`, `D`, `n1`, `depth`, `byDepth`, `pts`, `poly`, `tubeOf`, `faceY`, `onFaceY`, `faceX`, `onFaceX`, `onTopAt`, and the plate builder `base(label)`), typed.
- `lumenDefs(): string`: the `<svg class="lm-defs" …><defs>…</defs></svg>` block from `MOCKUPS/track-v2.html` (gradients `lm-top`, `lm-s0`…`lm-s3`, `lm-pool-g`), with no `<filter id="lm-grain">`.
- `scopeIds(svg: string, tag: string): string`: removes `data-part` attributes, suffixes every `id="x"` with `-<tag>` and rewrites `url(#x)` and `href="#x"` to match, leaving `lm-` gradient ids alone (they live in the shared defs). `cropViewBox(svg: string, box: string): string` replaces `viewBox="0 0 600 420"`.
- `lumen.css`: `isoCss` (from `KIT/iso.css` via `k.ISO_CSS`), the finish (`FIGS/lumen-assets.mjs` `finishCss`, with the grain rules removed), `lumenVars`, and `spotCss`, as one stylesheet, plus the mockups' one-time draw-in of figures (§5; none under `prefers-reduced-motion: reduce`). Pages import it once; `LumenDefs.astro` prints `lumenDefs()` once per page, right after `<body>`.

- [ ] **Step 1: Write the failing tests.**

```ts
test('the camera matches the mockups', () => {   // values printed by FIGS/common.mjs
  expect(at([0, 0, 0]).map(n1)).toEqual(['300', '248.9']);
  expect(at([100, 0, 0]).map(n1)).toEqual(['433.2', '315.5']);
  expect(at([0, 0, 50]).map(n1)).toEqual(['300', '167.4']);
});
test('base() draws a plate with four screws and one engraved label', ...)
test('scopeIds gives every id and reference the tag, and keeps lm- gradients shared', () => {
  const out = scopeIds('<g id="a" data-part="x"><use href="#a"/><path fill="url(#a)"/><path fill="url(#lm-top)"/></g>', 't');
  expect(out).toBe('<g id="a-t"><use href="#a-t"/><path fill="url(#a-t)"/><path fill="url(#lm-top)"/></g>');
});
test('lumenDefs has the six gradients and no grain filter', ...)
test('lumen.css has no lm-grain rule', ...) // read the file with fs
```

- [ ] **Step 2: Run** `npx vitest run src/art` → FAIL.
- [ ] **Step 3: Copy the kit and port the helpers.** Prefer the kit's own `iso-kit.ts` over `iso-kit.mjs`. If `lathe.mjs` or `tube.mjs` imports fail type checking under `astro check`, add a hand-written `.d.mts` beside each declaring only the functions `common.ts` and the figures use; do not edit the kit's code.
- [ ] **Step 4: Run** `npx vitest run src/art` → PASS; `npm run build` → PASS.
- [ ] **Step 5: Commit** `feat: vendor the Anatomy kit (MIT) and the shared figure helpers`.

### Task 3: Still figures: covers, small figures and the hero figures

**Files:**
- Create: `src/art/figures/covers.ts`, `spots.ts`, `hero-web.ts`, `internet-thumb.ts`, `src/components/Figure.astro`, test `src/art/figures/figures.test.ts`

**Interfaces:**
- Consumes: `src/art/common.ts`, `scopeIds`, `cropViewBox` (Task 2).
- Produces:
  - `type CoverId = 'networking' | 'web' | 'crypto' | 'ai' | 'privesc' | 'tvm'`; `cover(id: CoverId): string` (the figure as drawn in `MOCKUPS/illustrations-v3.html`, with `data-part` hooks kept for animation); `coverStill(id: CoverId, tag: string): string` = `scopeIds(cover(id), tag)`.
  - `spot(kind: 'watch' | 'learn' | 'practice' | 'subnet' | 'dhcp' | 'firewall'): string` (port of `FIGS/spots.mjs`, crop `"36 44 528 372"`).
  - `heroWebSvg(): string` and `HERO_WEB: HeroWebData` (routes, timings and caption steps; port of `FIGS/hero-web.mjs` `heroSvg`, `heroData`).
  - `internetThumb(): string` (port of `FIGS/hero.mjs` `heroSvg` with `FIGS/track2.mjs` `internetArt()`'s changes: callouts and you-are-here removed, the page drawn on the screen, ids prefixed `la-`, viewBox `40 36 1198 476`, its aria-label).
  - `Figure.astro`: props `{ svg: string; class?: string }`, prints the SVG with `set:html`.

Port order: `FIGS/covers.mjs` (the four newer covers) and the router and padlock from `FIGS/build3.mjs`, then `spots.mjs`, `hero.mjs`, `hero-web.mjs`. Keep geometry and numbers identical.

- [ ] **Step 1: Write the failing tests.**

```ts
const ALL = () => [...COVER_IDS.map(cover), ...SPOTS.map(spot), heroWebSvg(), internetThumb()];
test('every figure has role="img" and a non-empty aria-label', ...)
test('no figure carries film grain', () => ALL().forEach((s) => expect(s).not.toMatch(/lm-grain/)));
test('no figure holds a closing tag an HTML parser would act on', () => ALL().forEach((s) => expect(s).not.toMatch(/<\/(script|style|body|html|head)/i)));
test('two still copies of the same cover share no ids', ...)
test('the figures match the mockups', ...) // compare a checksum of each output with a value recorded from FIGS once (see step 3)
```

- [ ] **Step 2: Run** `npx vitest run src/art/figures` → FAIL.
- [ ] **Step 3: Port the figures.** To pin the port, run each `FIGS` function once with node and record a SHA-256 of its output as the expected value in the test, next to a comment naming the script it came from. When an output differs only because ids were prefixed, compare after normalising ids. Drawing must be identical, not merely similar.
- [ ] **Step 4: Run** `npx vitest run src/art/figures` → PASS.
- [ ] **Step 5: Commit** `feat: covers, small figures and hero figures drawn at build time`.

### Task 4: Site frame: layout, header, footer, theme button and 404

**Files:**
- Modify: `src/layouts/BaseLayout.astro`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/components/ThemeToggle.tsx`, `src/components/ThemeToggle.css`, `src/components/ThemeToggle.test.tsx`, `src/pages/404.astro`, `src/components/site.css`

**Interfaces:**
- Produces: `BaseLayout` props unchanged (`title`, `description`, `image?`, `chrome?`), plus `current?: 'tracks' | 'how' | 'about'` for the header's `aria-current="page"`. It imports `src/art/lumen.css` and renders `LumenDefs` after `<body>`. `ThemeToggle` is the mockups' 40×40 icon button (moon in light, sun in dark) with `aria-label` "Switch to dark theme" / "Switch to light theme"; it still uses `applyTheme` and `SafeStorage`.

Markup and CSS come from `MOCKUPS/track-v2.html`'s `<header class="site-head">` and `<footer class="site-foot">`: logo (the diamond mark, "TechConcepts"), Tracks (`/networking`), How it works (`/#how`), About (`/about`), the theme button, "Start learning" (`/networking/how-the-internet-works`). Footer: brand line "Short guided lessons on how technology works.", Learn (Networking Concepts, All tracks `/networking`, How a lesson works `/#how`), Site (About), and "Your progress is saved only in this browser." The mockup's menu button and panel are for narrow screens: keep them working, unstyled beyond the mockup's rules.

- [ ] **Step 1: Update the failing tests** in `ThemeToggle.test.tsx`: the button's label names the theme it switches to; clicking flips `data-theme` and saves it; with storage throwing it still flips.
- [ ] **Step 2: Run** `npx vitest run src/components/ThemeToggle.test.tsx` → FAIL.
- [ ] **Step 3: Build the frame and restyle 404.** The 404 keeps its links (Home, the track) in the new header, footer, tokens and type (designer's call, §6.4). Remove the old site.css rules the header and footer used.
- [ ] **Step 4: Run** the test → PASS; `npm run build` → PASS. Open `/about` and `/404` in the dev server at 1280×800 in both themes and compare the header and footer with `track-v2.html`.
- [ ] **Step 5: Commit** `feat: new site header, footer, theme button and 404`.

---

## Phase 2: Content model and engines

### Task 5: Content model v2, and the removal of Try, the inspector, the playground and the old lessons

**Files:**
- Rewrite: `src/content/schema.ts`, `src/content/define.ts`, `src/content/estimate.ts`, `src/content/registry.ts`, `src/content/test-fixtures.ts`, `src/content/tracks/networking.ts` and their tests (`define.test.ts`, `estimate.test.ts`, `registry.test.ts`)
- Create: `src/art/scenes/types.ts`, `src/art/scenes/parts.ts`
- Create: `src/engine/tables.ts` and `tables.test.ts`: `TableState`, `initialTables(defs: TableDef[]): Record<string, TableState>`, `applyTableEvent` and `highlightFor`, moved out of the old `timeline.ts` (from `40abd4b`) and fitted to the v2 types; `src/scenes/table/DeviceTablePanel.tsx` now imports `TableState` from here.
- Delete: everything in "Removed in Task 5" above. Port the old lessons' events and packets later from `git show 40abd4b:<path>` (Tasks 10, 11, 16).
- Modify: `src/lesson/useLessonShortcuts.ts(+test)`: it takes `{ toggle(): void; next(): void; prev(): void }` instead of a `PlaybackAction` dispatch, so it no longer depends on playback; its key rules are unchanged. `src/pages/index.astro` and `src/pages/[track]/index.astro`: only what keeps them building (Home loses the continue card until Task 17). `src/pages/[track]/[lesson].astro`: `getStaticPaths` from the registry (no lessons yet, so no pages) and a plain placeholder body until Task 9.

**Interfaces:**
- Produces (`src/art/scenes/types.ts`):

```ts
export type FigureId = 'dhcp' | 'subnet' | 'firewall' | 'net-map';
export interface FigureParts {
  places: readonly string[];                         // ids a message's from/to may name
  cues: Readonly<Record<string, 'flag' | 'text'>>;   // cue names; 'text' cues need an arg
  layers: readonly string[];                         // swappable layers (net-map only)
  board: boolean;                                    // accepts note.board (subnet only)
}
export interface DrawnFigure { svg: string; data: unknown }   // data is JSON for the driver
```
  `FIGURE_PARTS: Record<FigureId, FigureParts>` in `parts.ts` starts with all four ids present and empty lists; Tasks 10–16 fill each one.

- Produces (`schema.ts`), all `z.strictObject`:

```ts
text = non-empty string; source = { label: text, url: https URL }; fact = { label: text, value: text }
row = Record<string, string>
cue = { cue: text, arg?: string }
messageKind = 'request' | 'response' | 'control' | 'broadcast' | 'encrypted'
message event = { type: 'message', id, from: text, to: text, tag: text, kind: messageKind,
  outcome?: 'delivered' | 'dropped' | 'blocked',   // default delivered; dropped = lost on the way; blocked = stopped by a firewall
  dropAt?: number (0.1–0.9),                        // required when dropped: how far along it is lost
  over?: text,                                      // the carrier shown on the tag, e.g. 'UDP'
  fast?: boolean,
  check?: { table: text, read: int ≥ 1, match: int ≥ 1 | null, action: 'allow' | 'deny' },  // firewall rule evaluation
  known?: { table: text, key: text },               // a reply let through because the firewall remembers it
  packet?: text,                                    // id in unit.scene.packets (DHCP keeps its packets)
  log: row, plain: text, cues?: cue[] }
note event = { type: 'note', id, log: row, plain: text, cues?: cue[], board?: board }
table event = { type: 'table', id, table: text, op: 'add'|'update'|'remove'|'match'|'clear'|'replace', row?, rows?, key?, summary: text }
board = { addr: text, who: text, prefix: int 0–32 | null, borrow?: int, mask?: boolean,
  pick?: 'net' | 'host' | 'mask' | 'line' | 'borrow', third?: { who: text, addr: text, mode: 'net' | 'bcast' | 'cmp' } }
tableDef = { id, title, by?: text, columns: {key,label}[] ≥ 1, keyColumn, initialRows: row[], empty: text }
panel = { type: 'table', table: tableDef } | { type: 'rules', rules: tableDef, conns: tableDef } | { type: 'bits' }
log = { title: text, columns: {key,label}[] ≥ 1, legend: { kind: messageKind | 'blocked' | 'dropped' | 'change' | 'note', label }[] }
party = { place: text, label: text, addr: string }
unitScene = { title: text, views: ['network'] | ['network','sequence'], layers: text[] (default []),
  labels: Record<string,string> (default {}), panel: panel | null, log, parties: party[], packets?: Record<string, packet> }
step = { id, title, sub, narrative, deep, facts: fact[], events: event[], status?: text, idle?: text }
learn = { lead, terms: { idea: text, name: text }[], pattern: { names: text[], note: text }, why, deep, facts: fact[] }
question = { id, prompt, options: { text: text, feedback: text }[], answer: int }
unit = { id: slug, name, fullName, purpose: text, group?: 'core' | 'app' | 'security', osiLayers: int 1–7 [],
  references: source[], scene: unitScene, overview: { hook, description, facts: fact[] }, steps: step[], learn, practice: question[] }
lesson = { slug, title, subtitle, level, certTags, summary, figure: FigureId, units: unit[] ≥ 1 }
```
  Keep `packetSchema`, `layerSchema`, `fieldSchema` and `src/content/helpers/packets.ts` unchanged (DHCP keeps its packets). Export the inferred types (`Lesson`, `Unit`, `Step`, `SceneEvent`, `MessageKind`, `MessageEvent`, `NoteEvent`, `TableEvent`, `Board`, `TableDef`, `Panel`, `LogDef`, `Party`, `Question`, `Cue`, `Track`, `Part`, `LessonInput`).
  Prose fields mark key terms with `**term**`; nothing else is markup.
  A log column whose key is `plain` shows the event's `plain` text; an event's `log` never holds a `plain` key.

- Produces (`estimate.ts`): `WORDS_PER_MINUTE = 200`, `MINUTES_PER_STEP = 0.5`, `PRACTICE_MINUTES = 1`, `PRACTICE_MINUTES_PER_UNIT = 0.5`, `MAX_MINUTES = 15`, `WARN_MINUTES = 12`; `countWords(text)` removes `**` then counts whitespace-separated tokens; `countUnitWords(u: Unit)` counts the overview hook and description, every narrative, Learn's lead, every term's idea and name, the pattern note, why, and every question's prompt, option texts and feedback (not titles, subs, deep, facts or labels); `estimateUnitMinutes(u, practiceMinutes)` = `ceil(words/200 + 0.5 × steps + practiceMinutes)`; `estimateMinutes(l)` = the unit's minutes with `PRACTICE_MINUTES` when there is one unit, else `ceil(Σwords/200 + 0.5 × Σsteps + 0.5 × units)`.
- Produces (`define.ts`): `validateLesson(input): { lesson; warnings }`, `defineLesson(input): Lesson`, `defineTrack(t)`, `LessonValidationError` as today, with these rules, every one reported together:
  - steps 4–6 per unit; facts 2–4 per step; narrative ≤ 120 words; hook ≤ 80 words; practice 2–3 per unit (exactly 2 when the lesson has more than one unit); options 2–4; answer in range; terms 3–10; pattern names 2–6; ≥ 1 reference per unit; ≥ 1 cert tag;
  - ids unique: units in the lesson, steps in a unit, events across a unit's steps, questions in a unit;
  - every `from`/`to`/`party.place` is in `FIGURE_PARTS[figure].places`; every cue is in `cues` and has an `arg` exactly when its type is `'text'`; every `layers` entry is in `layers`; `board` only when `FIGURE_PARTS[figure].board`;
  - every `log` key is a column of the unit's log (`#` is added by the console and never written); `outcome: 'dropped'` needs `dropAt`; `check.table` names the rules table and `known.table` the conns table of a `rules` panel; table events name a table of the unit's panel and carry the fields their op needs (today's `TABLE_OP_FIELDS`); `packet` names a packet whose size matches;
  - `views` includes `'sequence'` only when `parties` has ≥ 2 entries; a `net-map` scene title is ≤ 51 characters;
  - minutes: a one-unit lesson fails above 15 and warns above 12; in a multi-unit lesson each unit fails above 15 (`estimateUnitMinutes(u, 0.5)`).
- Produces (`registry.ts`): `LessonSummary` (available) gains `subtitle: string`, `units: number`, and `maxPosition` = number of positions − 1 (Task 6's `slotsFor`; until then compute `Σ(steps + 3) − 1` inline and replace it in Task 6). `buildEntries`, `neighbors`, `trackTotals`, `groupLessonModules`, `getTrack`, `getEntries`, `getLesson` keep their signatures. The lesson glob stays `./lessons/*/*.ts`, so files in `lessons/networking/how-the-internet-works/` are never picked up as lessons.
- Produces (`networking.ts`): 20 lessons; "The big picture" is `how-the-internet-works` "How the Internet Works", then `osi-model`, `packets`; the other parts are unchanged.

- [ ] **Step 1: Write the failing tests.**

```ts
// define.test.ts (uses fixtures from test-fixtures.ts: makeUnit(), makeLesson(), a FIGURE_PARTS test double via vi.mock)
test('a valid one-unit lesson passes and comes back unchanged', ...)
test('a lesson with Try, check or recap fields is rejected as a shape error', ...)
test('reports every broken rule together', ...) // 3 steps + unknown place + cue missing its arg + log key not a column → 4 issues
test('a message from a place the figure does not have is named in the issue', ...)
test('dropped needs dropAt', ...)
test('sequence view needs two parties', ...)
test('a multi-unit lesson needs exactly 2 questions per unit and checks minutes per unit', ...)
test('net-map scene titles over 51 characters are rejected', ...)
// estimate.test.ts
test('countWords ignores ** markers', () => expect(countWords('a **Discover** b.')).toBe(3));
test('countUnitWords counts exactly the read fields', ...) // a unit whose counted fields hold 1 word each, uncounted fields 50 words
test('one unit: ceil(words/200 + 0.5 × steps + 1)', ...)   // 816 words, 5 steps → 8
test('many units: ceil(Σ/200 + 0.5 × Σsteps + 0.5 × units)', ...) // 9829 words, 78 steps, 14 units → 96
// registry.test.ts
test('the networking track has 20 lessons in order, How the Internet Works first', ...)
test('lesson numbers: how-the-internet-works 1, subnetting 8, dhcp 10, firewalls 17', ...)
test('an available entry reports units, subtitle and maxPosition', ...)
```

- [ ] **Step 2: Run** `npx vitest run src/content` → FAIL.
- [ ] **Step 3: Implement** schema, estimate, define, registry and the 20-lesson track; delete the removed files. Then `grep -rniE "tryIt|try it|inspector|playground|recap|checkYourself" src e2e` must find only the e2e files (Task 21 rewrites them).
- [ ] **Step 4: Run** `npx vitest run` → PASS; `npm run build` → PASS (no lesson pages yet; Home and the track page build).
- [ ] **Step 5: Commit** `refactor!: Watch, Learn, Practice content model; remove Try, the inspector and the playground`.

### Task 6: Timeline v2: positions, derivation, labels and deep links

**Files:**
- Create: `src/engine/timeline.ts`, `src/engine/timeline.test.ts` (Task 5 deleted the old ones)
- Modify: `src/content/registry.ts` (use `slotsFor`), `src/progress/store.test.ts` (old-record cases)

**Interfaces:**
- Consumes: Task 5's types; `TableState`, `initialTables`, `applyTableEvent`, `highlightFor` from `src/engine/tables.ts`.
- Produces:

```ts
export type Position = number;                      // flat index over every unit's slots
export type SlotKind = 'overview' | 'step' | 'learn' | 'practice';
export interface Slot { unit: number; kind: SlotKind; step: number }   // step is 1-based for 'step', else 0
export function slotsFor(lesson: Lesson): Slot[];   // per unit: overview, steps…, learn, practice
export function positionOf(lesson: Lesson, unit: number, kind: SlotKind, step?: number): Position;
export function positionLabel(lesson: Lesson, p: Position): string;    // 'Overview' | step title | 'Learn' | 'Practice'
export function resumeLabel(lesson: Lesson, p: Position): string;      // one unit: 'Overview' | 'step 3 of 6' | 'Learn' | 'Practice'; many: 'DNS, step 2 of 5', 'DNS, Learn'
export interface LogRow { n: number; eventId: string; type: 'message' | 'note'; kind: MessageKind | null;
  outcome: 'delivered' | 'dropped' | 'blocked' | null; from: string | null; to: string | null; cells: Row; plain: string }
export interface AppliedCue { cue: string; arg?: string; eventId: string; current: boolean }
export interface DerivedState { unit: number; slot: Slot; log: LogRow[]; tables: Record<string, TableState>;
  cues: AppliedCue[]; board: Board | null; active: SceneEvent | null; events: SceneEvent[] }
export function stepEvents(lesson: Lesson, p: Position): SceneEvent[];   // the events that play at p ([] off a step)
export function deriveState(lesson: Lesson, p: Position, eventIndex: number): DerivedState;
export function parseStepParam(search: string, lesson: Lesson): Position | null;
```
  Derivation: only the current unit's events count. At its Overview nothing is applied (tables at `initialRows`); at step k, steps 1…k−1 in full then the first `eventIndex` events of step k; at Learn and Practice, every step. Message and note events add a log row (numbered from 1 within the unit); table events change tables with `applyTableEvent` and `highlightFor` and highlight only when they belong to the current step; cues accumulate in order with `current` marking the current step's; `board` is the latest applied note's board; `active` is the last applied event of the current step, or null.

- [ ] **Step 1: Write the failing tests** (on fixtures with two units):

```ts
test('slotsFor lists overview, steps, learn, practice for each unit in order', ...)
test('positionOf and slotsFor agree for every slot', ...)
test('deriving at step 3 equals applying steps 1–2 then step 3 up to eventIndex, from scratch', ...)
test('units never share state: unit 2 starts from initial rows and an empty log', ...)
test('Learn and Practice show every step applied', ...)
test('only the current step highlights a table row', ...)
test('board is the latest note board, null before any', ...)
test('parseStepParam: abc, 2.5, -1 → null; 999 → last position; 9 lands in unit 2 of the fixture', ...)
test('resumeLabel names the protocol in a multi-unit lesson', ...)
// store.test.ts
test('an old record past the new last position clamps to it and keeps finished', ...) // furthestPosition 8, maxPosition 7
```

- [ ] **Step 2: Run** `npx vitest run src/engine/timeline.test.ts src/progress` → FAIL.
- [ ] **Step 3: Implement.** `recordVisit`, `resumePosition`, `sanitizeProgress` keep their behaviour (the Overview is never recorded, reaching `maxPosition` finishes the lesson, which is the last Practice in every lesson); only the callers' `maxPosition` changes. The storage key stays `techconcepts:v1`: the saved shape doesn't change (§9).
- [ ] **Step 4: Run** `npx vitest run` → PASS.
- [ ] **Step 5: Commit** `feat: timeline over units, with Learn and Practice positions`.

### Task 7: Playback v2: Play runs, holds and the speed button

**Files:**
- Create: `src/engine/playback.ts`, `src/engine/playback.test.ts` (Task 5 deleted the old ones)

**Interfaces:**
- Consumes: `slotsFor`, `stepEvents` (Task 6).
- Produces:

```ts
export const SPEEDS = [0.5, 1, 1.5, 2] as const; export type Speed = (typeof SPEEDS)[number];
export const HOLD_MS = 2600;
export type DurationOf = (e: SceneEvent) => number;   // ms at 1×; supplied by the lesson's driver (Task 9), because the mockups time events by route length
export type Mode = 'idle' | 'step' | 'run' | 'hold';
export interface PlaybackState { position: Position; eventIndex: number; mode: Mode; ended: boolean; speed: Speed }
export type PlaybackAction =
  | { type: 'go'; position: Position } | { type: 'next' } | { type: 'prev' } | { type: 'toggle' }
  | { type: 'tick'; position: Position; eventIndex: number } | { type: 'holdDone'; position: Position } | { type: 'cycleSpeed' };
export function initialPlayback(): PlaybackState;                 // position 0, idle, speed 1
export function createPlaybackReducer(lesson: Lesson): (s: PlaybackState, a: PlaybackAction) => PlaybackState;
export function playLabel(lesson: Lesson, s: PlaybackState): 'Play' | 'Pause' | 'Replay' | 'Watch again';
export function holding(s: PlaybackState): { next: Position; ms: number } | null;  // for the top bar's filling segment
export function pendingEvent(lesson: Lesson, s: PlaybackState): SceneEvent | null;  // stepEvents(position)[eventIndex] in 'step'/'run', else null
export function usePlayback(lesson: Lesson, durationOf: DurationOf): [PlaybackState, Dispatch<PlaybackAction>];
```
  Rules, from `MOCKUPS/lesson-v3.html` (`go`, `runWatch`, `pause`, `togglePlay`):
  - `go` (and `next`/`prev` = `go(position ± 1)`, clamped): a hand move. `eventIndex` 0, `ended` false; mode `'step'` if the slot is a step with events, else `'idle'`.
  - `toggle` in `'run'` or `'hold'`: pause. Mode `'idle'`, `eventIndex` = the step's event count (the step shown complete).
  - `toggle` in `'idle'` or `'step'`: start a run. On a step of a unit that hasn't `ended`, from that step's first event; otherwise from the unit's first step (moving there). Mode `'run'`, `ended` false.
  - The pending event (`pendingEvent`) is the one playing: the scene animates it during its wait, and the `tick` that ends the wait applies it, so its log row lands when its animation ends, as in the mockups.
  - `tick` with a matching `position` and `eventIndex` advances `eventIndex`; anything else is stale and ignored. When the step completes: `'step'` → `'idle'`; `'run'` → `'hold'` if the next slot is a step of the same unit, else `'idle'` with `ended` true.
  - `holdDone` with a matching `position` in `'hold'`: move to the next step, `eventIndex` 0, mode `'run'`. A step with no events completes at once (lesson 1's first steps have none).
  - `cycleSpeed`: next value in `SPEEDS`, wrapping. It never restarts anything.
  - `playLabel`: `'Pause'` in `'run'`/`'hold'`; `'Watch again'` on Learn or Practice; `'Replay'` when `ended`; else `'Play'`.
  - `usePlayback` waits `durationOf(pending event) / speed` in `'step'`/`'run'` and `HOLD_MS / speed` in `'hold'`, cancelling and restarting on every state change and on unmount. Reduced motion changes no duration (waits still wait).
  - A run covers the current unit's steps only (designer's call for lesson 1).

- [ ] **Step 1: Write the failing tests** (fake timers for the hook):

```ts
test('go plays that step once, then idles', ...)
test('toggle from idle runs every step of the unit with a hold between, then ends with Replay', ...)
test('toggle during a run pauses with the current step complete', ...)
test('toggle on Learn runs from step 1 and the label was Watch again', ...)
test('a hand move during a hold stops the run, and the late holdDone is ignored', ...)
test('a stale tick from another position or eventIndex is ignored', ...)
test('cycleSpeed goes 1 → 1.5 → 2 → 0.5 → 1 and leaves the run alone', ...)
test('timers: each event waits durationOf(event)/speed ms and a hold waits 2600/speed', ...) // durationOf is a test stub returning 1000
test('the pending event is the one not yet applied, and null between steps', ...)
test('a step with no events completes at once in a run', ...)
test('reduced motion leaves every duration unchanged', ...) // the hook takes no reduced-motion input; assert the API
```

- [ ] **Step 2: Run** `npx vitest run src/engine/playback.test.ts` → FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `feat: Play runs every Watch step, with holds and a cycling speed button`.

---

## Phase 3: Console

### Task 8: Console shell: top bar, outline, explanation, Practice, log and controls

**Files:**
- Create (Task 5 deleted the old console): `src/lesson/LessonConsole.tsx`, `TopBar.tsx`, `Outline.tsx`, `Explanation.tsx`, `Practice.tsx`, `LogPanel.tsx`, `PlaybackControls.tsx`, `Rich.tsx`, `console.css`, tests `LessonConsole.test.tsx`, `Explanation.test.tsx`, `Practice.test.tsx`, `LogPanel.test.tsx`, `Outline.test.tsx`
- Uses unchanged: `src/lesson/useLessonShortcuts.ts` (Task 5's callback form), `keyboard.ts`, `useReducedMotion.ts`

**Interfaces:**
- Consumes: `usePlayback`, `playLabel`, `holding` (Task 7), `deriveState`, `slotsFor`, `resumeLabel`, `parseStepParam` (Task 6), `useProgress`, `recordVisit`, `resumePosition`, `knownFrom`, `wrapAtDots`.
- Produces:
  - `LessonConsoleProps = { trackId; trackTitle; lesson: Lesson; entry: AvailableSummary; total: number; next: AvailableSummary | null; entries: LessonSummary[]; figure?: ReactNode; figureData?: unknown }`. `figure` is the Astro named slot (static SVG, Task 9); this task renders an empty scene box when it is absent and passes `() => 1000` as `durationOf` (Task 9 swaps in the driver's).
  - `Rich({ text }: { text: string })` renders `**x**` as `<b>x</b>` and everything else as text (no HTML from content, ever).
  - The layout, sizes and words of `MOCKUPS/lesson-v3.html` (and `firewalls-v1.html` for the end row):
    - **TopBar:** logo and "See how technology works"; breadcrumb "<track> › <lesson>", "Lesson N of 20"; step segments for the current unit (done, current in marigold, and the next one filling over `holding().ms` while held); "Step n of N" (never the title), "Overview", "Learn" or "Practice"; the OSI chips 1–7 with the unit's layers lit and the heading "OSI layer(s) …"; track progress (a 20-place bar, the current lesson marigold, ready lessons outlined, "n of 20 complete"); the Light/Dark segmented switch.
    - **Outline:** "This lesson": Overview, "Watch · N steps" with each step's title and sub, "Learn" ("What happened and why", "In plain words, then the names"), "Practice" ("N questions", "Just for you, nothing is scored"); done/current marks; "All 20 lessons" opens the track list in a `<dialog>`. With more than one unit: one row per unit (name and purpose) under All / Core / Apps / Security filter chips, the current unit opened to show its parts (from `MOCKUPS/internet-v2.html`).
    - **Explanation:** Overview (kicker, name, full name, hook, description, facts); Watch step (kicker "Watch · Step n of N", title, sub, narrative, closed `<details>` "Go deeper" with "the technical details", facts); Learn ("What happened and why", lead, term pairs "idea → **name**", the pattern box with names uppercased by CSS and its note, why, closed Go deeper ending with "Sources", facts); Practice (questions; picking an option shows its feedback at once, marks right or "Not quite", never scores or saves); end row: "Next ready lesson: <title>, lesson N" with a button, or the last-lesson text "That’s the whole lesson, and the last ready one for now. Lessons 18 to 20 are coming soon." with "Back to the track". Resume button ("Resume at …") or "Finished" as today. A polite live region announces each step's title and the latest log row's `plain`.
    - **LogPanel:** the unit's `log.title` (uppercase), its legend, then a real `<table>` with "#" plus the log's columns; rows from `derived.log` (glyph by kind or outcome; blocked and dropped rows in the blocked colour with a text label too); the step's `idle` text when the unit's log is empty. Playback controls sit in its header: the speed button (shows "1×", `aria-label` "Speed 1×. Click for 1.5×"), previous, the Play button (label from `playLabel`, play or pause icon), next.
  - Keyboard: Space toggles, → next, ← prev, ignored in form controls and on buttons or links, as today.
  - No page scroll at 1280×800 and above; the explanation scrolls inside itself.

- [ ] **Step 1: Write the failing tests** with a fixture lesson (one unit, figure `'dhcp'`) and a two-unit fixture:

```tsx
test('renders the Overview first, then follows ?step= after mount', ...)
test('the top bar says Step 2 of 5, never the step title', ...)
test('ArrowRight walks Overview → steps → Learn → Practice and records progress; Practice finishes the lesson', ...)
test('Play runs the steps: the log fills step by step and the button says Pause, then Replay', ...) // fake timers
test('on Learn the button says Watch again', ...)
test('Go deeper is closed by default on steps and Learn', ...)
test('Practice shows the chosen option’s feedback, and nothing is saved', ...)
test('Rich renders **x** as bold and never as HTML', () => { /* '<img src=x>' renders as text */ })
test('the log has # plus the unit’s columns, and a blocked row says Blocked in text', ...)
test('the speed button cycles and names the next speed', ...)
test('a multi-unit lesson shows protocol rows with filters, and the current one opened', ...)
test('the end row names the next ready lesson, or says the last ready one for now', ...)
test('with storage blocked the lesson still plays end to end', ...)
```

- [ ] **Step 2: Run** `npx vitest run src/lesson` → FAIL.
- [ ] **Step 3: Implement**, porting the console CSS from `lesson-v3.html` (grid, panels, outline, explanation, log, controls) into `console.css` with the new tokens.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `feat: the Watch, Learn, Practice console`.

### Task 9: Scene host, the driver contract, the Sequence view, the table panel and the lesson route

**Files:**
- Create: `src/scenes/driver.ts`, `src/scenes/motion.ts`, `src/scenes/drivers/index.ts`, `src/lesson/ScenePanel.tsx`, `src/scenes/SequenceView.tsx`, `src/art/scenes/index.ts`, tests `src/scenes/motion.test.ts`, `src/lesson/ScenePanel.test.tsx`, `src/scenes/SequenceView.test.tsx`
- Move: `src/scenes/table/DeviceTablePanel.tsx`, its test and `table.css` to `src/lesson/panels/TablePanel.tsx`, `TablePanel.test.tsx`, `table.css` (`git mv`), then fit and restyle them
- Modify: `src/lesson/LessonConsole.tsx` (durations and the figure), `src/pages/[track]/[lesson].astro` (the real page)

**Interfaces:**
- Consumes: `DerivedState` (Task 6), `PlaybackState`, `pendingEvent`, `DurationOf` (Task 7), `LessonConsole` (Task 8).
- Produces:

```ts
// src/scenes/driver.ts
export interface SceneView { unit: number; layers: string[]; labels: Record<string, string>; cues: AppliedCue[];
  tables: Record<string, TableState>; board: Board | null; active: SceneEvent | null }
export interface SceneDriver {
  show(view: SceneView): void;      // the settled scene, no motion
  play(event: SceneEvent, view: SceneView, o: PlayOptions): Promise<void>;   // each segment takes its 1× time / speed
  destroy(): void;
}
export interface PanelMark { row: number; state: 'check' | 'miss' | 'allow' | 'deny' }   // a row of the panel under the scene, as the driver reads it
export interface PlayOptions { speed: number; reducedMotion: boolean; signal: AbortSignal; onMark?: (m: PanelMark) => void }
export interface DriverModule {
  create(root: SVGSVGElement, data: unknown): SceneDriver;
  duration(event: SceneEvent, data: unknown): number;   // ms at 1×: the sum of the mockup's waits and tweens for that event, including the gap after it
}
// src/scenes/drivers/index.ts
export const DRIVERS: Record<FigureId, DriverModule>;   // a no-op module (duration 1000) for each id until Tasks 10–16 fill them
// src/scenes/motion.ts
export function along(path: [number, number][], t: number): [number, number];
export function easeInOut(t: number): number;
export function animate(ms: number, frame: (k: number) => void, o: { reducedMotion: boolean; signal: AbortSignal }): Promise<void>;
// reduced motion: frame(1) at once, resolve at once. Aborted: frame(1), resolve.
// src/art/scenes/index.ts
export function drawFigure(id: FigureId): DrawnFigure;   // throws until a figure exists; Tasks 10–16 fill it
```
  - `ScenePanel` props `{ unit: Unit; figure: ReactNode; figureData: unknown; derived: DerivedState; playback: PlaybackState; reducedMotion: boolean }`. It shows the scene title, the Network / Sequence toggle (`role="group"`, `aria-pressed`) when the unit's `views` has both, the figure (the static slot; the driver finds `svg[data-figure]` inside it), and the panel below (`TablePanel` for `type: 'table'`; Tasks 11 and 16 add the others). On every derived change it calls `driver.show(view)`; when `pendingEvent` becomes a new event it calls `driver.play(pending, view, { speed, reducedMotion, signal, onMark })` with a fresh `AbortController`, aborting the previous play first, so the animation fills the wait `usePlayback` makes. `onMark` collects the playing event's marks in state for the panel; they clear when the event is applied. Coming back to Network re-calls `show`. `LessonConsole` now passes `(e) => DRIVERS[lesson.figure].duration(e, figureData)` to `usePlayback` in place of Task 8's fixed 1000 ms.
  - `SequenceView` props `{ parties: Party[]; rows: LogRow[]; current: LogRow | null }`: the SVG of `lesson-firewall.mjs`'s `renderSeq`, generalised. Lifelines evenly spaced in a 720-wide viewBox, party names and addresses in a fixed header SVG, rows in a scrolling body at `ROW_H = 42` that keeps the latest row in view. A request or response is an arrow from party to party labelled with the tag; blocked stops at the `to` party with a ✕ in the blocked colour and "Denied · rule n" (`cells.decision` when present); dropped stops halfway with a ✕; a note is a box across the middle lifeline. The current row draws in once (none under reduced motion). `aria-label` "The messages so far, as a sequence".
  - `TablePanel` props `{ def: TableDef; state: TableState }`: titled region (`tabIndex=0`, `aria-label` = title), real table, the `empty` text when there are no rows, a highlighted row pulsing once (`data-highlight`), and the focus kept when a table event remounts it (the `focusedTable` logic in `git show 40abd4b:src/lesson/LessonConsole.tsx`, which the 2026-11-04 e2e test covers). Its caption names `def.by`. Keep its highlighted-row contrast test.
  - `[lesson].astro` calls `drawFigure(lesson.figure)` at build time and renders `<LessonConsole client:load … figureData={data}><Fragment slot="figure" set:html={svg} /></LessonConsole>`. Check that Astro passes the named slot to React as the `figure` prop and keeps it static (it does for React; if not, render the SVG outside the island and give the island its element id instead).

- [ ] **Step 1: Write the failing tests:**

```ts
test('animate under reduced motion calls frame(1) once and resolves at once', ...)
test('an aborted animate settles on frame(1)', ...)
test('ScenePanel calls show on every change, and aborts the running play when the learner moves', ...)
test('marks a driver reports reach the panel while the event plays and clear when it is applied', ...)
test('switching to Sequence and back re-shows the settled Network state', ...)
test('the toggle is hidden when views has only network', ...)
test('SequenceView draws one row per log row, in order, blocked rows ending in ✕ with their decision text', ...)
test('TablePanel shows its empty text, highlights the matched row, and keeps focus across a remount', ...)
```

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run** `npx vitest run` → PASS; `npm run build` → PASS.
- [ ] **Step 5: Commit** `feat: scene host with drivers, a generic Sequence view and the table panel`.

---

## Phase 4: Lessons

Each lesson task ports words that are final in the mockups (§7). Convert them with a throwaway script in the session scratchpad that reads the `FIGS` data (or the mockup's inline JSON) and prints TypeScript; commit only the generated, formatted content. Turn `<b>x</b>` into `**x**`, drop `<span class="ltr">` wrappers, keep the words exactly. Pattern names are stored in Title Case (the box uppercases them). The minutes test in each task doubles as a check that nothing was dropped.

### Task 10: DHCP (lesson 10): scene, driver and content

**Files:**
- Create: `src/art/scenes/dhcp.ts`, `src/scenes/drivers/dhcp.ts`, `src/content/lessons/networking/dhcp.ts`, tests `src/art/scenes/dhcp.test.ts`, `src/scenes/drivers/dhcp.test.ts`, `src/content/lessons/networking/dhcp.test.ts`
- Modify: `src/art/scenes/parts.ts`, `src/art/scenes/index.ts`, `src/scenes/drivers/index.ts`

**Interfaces:**
- Produces: `drawDhcp(): DrawnFigure` (port of `FIGS/dhcp-scene.mjs`: plate, router with the standing lease-table board, laptop, phone, the dotted arc, the broadcast rings, the five tags discover/offer/request/ack/renew, callouts off the plate; `<svg data-figure="dhcp" role="img" aria-label=…>`; `data` = the mockup's `SC`: projection, arc, ring sizes). `FIGURE_PARTS.dhcp = { places: ['laptop', 'router', 'phone'], cues: {}, layers: [], board: false }`.
- `duration`: a message is 1300 (travel) + 350 + 200 = 1850 ms, as `FIGS/lesson3.mjs` waits; a table event is 0 ms, so it lands with the message before it.
- The driver (from `lesson-v3.html` `send`, `apply`, `clearScene`): the tag for the event's label rides the arc for 1300 ms of the message's time (laptop → router or back); a broadcast also spreads the ring and lights the phone's glow and "ignores" note past 55 %; the laptop's screen glows on send, the router's LEDs on reply; the board shows the lease table's rows (from `view.tables`).
- Content, from `MOCKUPS/lesson-v3.html` (`CONTENT`, `LEARN`, `QUIZ`, `MSGS`) and the events and packets of `git show 40abd4b:src/content/lessons/networking/dhcp.ts`: one unit, `id` `dhcp`; title "DHCP", subtitle "Getting an address automatically", certTags `['a-plus', 'network-plus', 'ccna', 'helpdesk']`, summary "Watch a laptop join a Wi-Fi network and get an address, plus the other settings it needs to go online, from the router in four short messages."; steps DHCP Discover, DHCP Offer, DHCP Request, DHCP Acknowledge, Lease Renewal (subs from `CONTENT.steps[].sub`); Learn with pattern names Discover, Offer, Request, Acknowledge and the `dora` text as its note; 3 questions; references RFC 2131 (`https://www.rfc-editor.org/rfc/rfc2131`) and RFC 2132 (`https://www.rfc-editor.org/rfc/rfc2132`); panel `{ type: 'table' }` with the lease table (IP address, MAC address, Device, Expires); log "Event log" with columns time, source, destination, protocol, info, size (labels Time, Source, Destination, Protocol, Info, Size); parties Laptop, Router, Phone; views network and sequence.

- [ ] **Step 1: Write the failing tests:**

```ts
test('drawDhcp matches the mockup scene', ...)          // checksum recorded from FIGS/dhcp-scene.mjs, ids normalised
test('the driver moves the Offer tag from the router toward the laptop and leaves it hidden when done', ...) // jsdom SVG, fake rAF
test('duration: 1850 for a message, 0 for a table event', ...)
test('DHCP validates, has 5 steps, 3 questions and takes 8 minutes', () => expect(estimateMinutes(dhcp)).toBe(8));
test('step titles are the technical terms, in order', ...)
test('the lease table ends with the laptop’s lease after step 4 and its renewed expiry after step 5', ...)
test('every message’s packet size still matches its packet', ...)
```

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run** `npx vitest run` → PASS; `npm run build` → PASS. Open `/networking/dhcp` at 1280×800 and 1440×900 in both themes next to `lesson-v3.html`; fix differences.
- [ ] **Step 5: Commit** `feat: DHCP in the new console`.

### Task 11: Subnetting (lesson 8): scene, driver, bits board and content

**Files:**
- Create: `src/art/scenes/subnet.ts`, `src/scenes/drivers/subnet.ts`, `src/lesson/panels/BitsBoard.tsx`, `src/content/helpers/subnet-events.ts`, `src/content/lessons/networking/subnetting.ts`, with tests beside each
- Modify: `parts.ts`, `src/art/scenes/index.ts`, `drivers/index.ts`, `ScenePanel.tsx` (panel `bits`)

**Interfaces:**
- Produces: `drawSubnet(): DrawnFigure` (port of `FIGS/subnet-scene.mjs`, data = its `sceneData()`: projection, routes `local`/`remote`/`link`, ring sizes). `FIGURE_PARTS.subnet = { places: ['laptop', 'printer', 'pc', 'router', 'provider'], cues: { glow: 'text', focus: 'text', 'one-net': 'flag', cut: 'flag', link: 'flag', pulse: 'text', ring: 'text', route: 'text', busy: 'text' }, layers: [], board: true }` (the cue names are the mockup's `fx` keys; `oneNet` becomes `one-net`).
- `BitsBoard({ board }: { board: Board | null })`: "The address in bits", up to three rows of 32 bits in four octets (the address; the mask when `mask`; then `third` as network, broadcast or compared address), a marigold line after bit `prefix`, borrowed bits (from `borrow` to `prefix`) underlined, `pick` highlighting the named part; a real table with a caption. Every bit comes from `src/engine/net` (`parseIPv4`, `toOctetBits`, `maskFromPrefix`), never from content.
- `subnet-events.ts`:

```ts
export type Shown = 'address' | 'network-part' | 'host-part' | 'mask' | 'prefix' | 'network' | 'broadcast'
  | 'usable-count' | 'subnets' | 'compared' | 'usable-pair';
export function subnetValue(shown: Shown, board: Board): string;   // e.g. 'network' → '192.168.1.64', 'subnets' → '4 × 64 addresses', 'usable-pair' → '203.0.113.5 and .6'
export function calc(o: { id: string; row: string; shown: Shown; plain: string; board: Board; cues?: Cue[] }): NoteEvent;
// log { worked: row, value: subnetValue(shown, board), prefix: board.mask ? '/' + board.prefix : '' }
export function checkStated(lesson: Lesson, stated: { text: string; value: () => string }[]): void;
// throws if a stated number is missing from the lesson's text or differs from the engine's value
```
  Every value comes from `src/engine/net` (`parseIPv4`, `formatIPv4`, `maskFromPrefix`, `subnetInfo`, `sameSubnet`) and the board, never typed in; a `third` address with mode `net` or `bcast` must equal the engine's network or broadcast, or `calc` throws. Numbers that only appear in prose (narratives, facts, `plain`, questions) are listed in `subnetting.ts` as `STATED` with the engine call that produces each, and the file ends with `checkStated(subnetting, STATED)`, so a wrong number stops the build (§7.2).
- `duration` (from `FIGS/lesson-subnet.mjs` `play`): a note with a `ring` cue 1500 + 500 ms; with a `route` cue 700 + 7 × the route's length + 500 ms; any other note 1100 + 700 ms.
- Content from `FIGS/subnet-lesson.mjs` (6 steps, 17 events, 3 questions); title "Subnetting", subtitle "Splitting networks into smaller ones", certTags `['network-plus', 'ccna']`, summary "See how one big network is cut into smaller ones, how many devices fit in each, and how a device tells whether another device is its neighbour."; steps Network and Host Portions, Subnet Mask, Network and Broadcast Addresses, Borrowing Bits, Local vs. Remote Delivery, Point-to-Point Subnet; every `calc`, `broadcast` and `sent` row is a `calc(...)` note (a broadcast carries a `ring` cue, a sent row `route` and `busy` cues, as its `fx` says); references from the live lesson (`git show 40abd4b:src/content/lessons/networking/subnetting.ts`); log "Working" with columns worked, value, prefix, plain (Worked out, Value, Prefix, In plain words); views network only; panel bits.
- Delete `src/engine/net` code only the playground used, if any; keep `ipv4.ts` and `subnet.ts`.

- [ ] **Step 1: Write the failing tests:**

```ts
test('drawSubnet matches the mockup scene', ...)
test('BitsBoard draws the /26 mask with the line after bit 26 and bits 25–26 underlined', ...)
test('Subnetting validates and takes 10 minutes', ...)
test('every number in narratives and facts is one the engine computes', ...) // checkStated passes; a copy with one number changed throws
test('subnetValue gives the mockup values for every event', ...) // e.g. ('usable-count', /24) → '254', ('mask', /26) → '255.255.255.192'
test('duration: ring 2000, the local route 700 + 7 × its length + 500, a calc 1800', ...)
test('192.168.1.10 and 192.168.1.70 are in different /26 subnets, and the text says so', ...)
test('the lesson hides the Sequence toggle', ...)
```

- [ ] **Steps 2–5:** run → FAIL; implement; run `npx vitest run` and `npm run build` → PASS; compare with `subnet-v1.html` at 1280×800 and 1440×900 in both themes; commit `feat: Subnetting as a Watch lesson with the bits board`.

### Task 12: How the Internet Works (lesson 1): the network map and its driver

**Files:**
- Create: `src/art/scenes/net-map.ts`, `src/art/scenes/net-map-layers.ts`, `src/scenes/drivers/net-map.ts`, tests beside each
- Modify: `parts.ts`, `src/art/scenes/index.ts`, `drivers/index.ts`

**Interfaces:**
- Produces: `drawNetMap(): DrawnFigure`, a port of `FIGS/net-map.mjs` `buildMap()`: one fixed frame; home (laptop and router), the internet plate (five routers), the DNS resolver with its card-index drawer; every server plate of every protocol drawn as a hidden layer `<g data-layer="<protocol>:<site>">` in slot E or SE; routes worked out at build time between every pair of places; `data` = routes, anchors, tray and padlock positions.
- `net-map-layers.ts`: `NET_MAP_LAYERS: Record<string, ServerPlate>` keyed `<protocol>:<site>` (for example `http:web`, `smtp:out`, `smtp:in`, `ftp:files`), the `scene.servers` entries of every protocol in `FIGS/protocols*.mjs` with their kind, slot, label and callout lines.
- `FIGURE_PARTS['net-map'] = { places: [laptop, router, resolver, the five internet routers by their names in net-map.mjs, and every site id], cues: { status: 'text', conn: 'text', page: 'text', lock: 'flag', tray: 'text', 'status-known': 'flag', 'status-done': 'flag', addr: 'text', url: 'text' }, layers: Object.keys(NET_MAP_LAYERS), board: false }`.
- Driver (from `lesson-internet2.mjs`): the lit tag rides the route `from → to` (hopping over routers), shows `over` under the tag; `dropped` stops at `dropAt` with a drop mark and a **blocked-red** trail (§5 changes the mockup's marigold); a broadcast spreads a ring across the home plate; cues: `status` sets the laptop's status line; `conn` takes `"<open|seal|close> <from>><to>[ data]"` and lights, seals (brighter) or clears that connection, `data` drawing FTP's dashed second line above; `page text|full` draws the page on the laptop; `lock` shows the padlock in the address bar; `tray "<site> <on|off>"` shows or clears a waiting letter on a mail tray (the mockup's `hold.out/in/mail`); `status-known` and `status-done` style the laptop's status line (the mockup's `known` and `done`; the names avoid a clash with the firewall's `known` field); `addr` and `url` set the laptop's address-bar texts; routers light when a message stops on them. `show()` sets `view.layers` visible and everything else hidden, and settles every applied cue.
- `duration` (from `lesson-internet2.mjs` `send`): travel = `fast ? 320 + 2.2 × length : 500 + 4 × length` over the route; delivered adds `fast ? 300 : 450`; dropped is `travel × dropAt + 380 + 650`; a table event is 0 ms.

- [ ] **Step 1: Write the failing tests:**

```ts
test('drawNetMap matches the mockup map', ...)       // checksum from FIGS/net-map.mjs, ids normalised
test('every layer key is drawn exactly once and hidden by default', ...)
test('a route exists between every pair of places a protocol uses', ...)
test('conn open, then seal, then close leaves no lit connection', ...)   // driver on jsdom
test('a dropped message leaves a blocked-red trail and a drop mark at dropAt', ...)
test('show() with layers ["http:web"] shows only that server plate', ...)
test('duration: a slow message on a 100-long route takes 500 + 400 + 450; dropped at 0.5 takes 450 + 380 + 650', ...)
```

- [ ] **Steps 2–5:** run → FAIL; implement; run → PASS; commit `feat: the How the Internet Works network map and driver`.

### Task 13: How the Internet Works: the lesson, with HTTP, DNS, TCP and SMTP

**Files:**
- Create: `src/content/helpers/internet-events.ts`, `src/content/lessons/networking/how-the-internet-works.ts`, `src/content/lessons/networking/how-the-internet-works/{http,dns,tcp,smtp}.ts`, `src/content/lessons/networking/how-the-internet-works.test.ts`

**Interfaces:**
- Produces: `internet-events.ts`: `msg(m: MockupMessage): SceneEvent[]` turns one mockup message into a message event (`tag`, `from`, `to`, `kind` (`bcast` → `'broadcast'`), `over` from `via`, `fast`, `outcome: 'dropped'` with `dropAt` from `lost`, `log` `{ time, source: src, destination: dst, protocol: proto, info, size }`, `plain: sum`, cues from `st` (`status`), `conn`, `page`, `hold` (`lock`, `tray`), `known` (`status-known`), `done` (`status-done`), `addr`, `url`) followed by one `table` `add` (or `update` when the key exists) per entry of its `rows`. A `miss: true` row gets the neutral "miss" style, not marigold (§5). `MockupMessage` is the typed shape of the `FIGS` messages.
- The lesson: slug `how-the-internet-works`, title "How the Internet Works", subtitle "The protocols behind every page", certTags `['a-plus', 'network-plus', 'security-plus', 'ccna', 'helpdesk']`, summary "Meet the 14 protocols the internet runs on, from HTTP and DNS to email, SSH and TLS. Each one gets its own short walkthrough of what it does.", figure `'net-map'`, `units` imported from the protocol files in this order: `UNIT_ORDER = ['http','https','tcp','udp','ip','dns','dhcp','icmp','smtp','pop3','imap','ftp','ssh','tls']` (Protocol Explorer's order, owner), listing only the units that exist so far.
- Each protocol file default-exports a `Unit` built from its `FIGS/protocols.mjs` entry: `id`, `name`, `fullName` (`full`), `purpose`, `group`, `osiLayers` (`osi`); scene title (`sceneTitle`), layers (its server sites as `<id>:<site>`), labels (`laptop`, `laptopAddr`, `router`), panel `{ type: 'table' }` from `table` (`title`, `by`, `cols` → columns, `empty`), log "Event log" with the packet columns (as DHCP), parties from `names` with their addresses; overview; steps with `status` (`st`) and `idle` (`log`); Learn; 2 questions; references drafted from the RFCs its fact rows name (§7.5), reviewed by the owner with the built lesson: HTTP RFC 9110 and RFC 9112; DNS RFC 1034 and RFC 1035; TCP RFC 9293; SMTP RFC 5321 (all `https://www.rfc-editor.org/rfc/rfcNNNN`).

- [ ] **Step 1: Write the failing tests:**

```ts
test('units follow UNIT_ORDER', ...)
test('each protocol validates, has 5–6 steps and 2 questions, and takes at most 15 minutes', ...)
test('HTTP: step titles are Client Request, DNS Resolution, TCP Connection, HTTP Exchange, Render Page', ...)
test('every message names places the map has, and every unit’s layers exist', ...)
test('TCP’s lost piece is dropped with dropAt, and its row is marked missing', ...)
```

- [ ] **Steps 2–5:** run → FAIL; implement; `npx vitest run` and `npm run build` → PASS; open `/networking/how-the-internet-works` next to `internet-v2.html` for HTTP and DNS; commit `feat: How the Internet Works with HTTP, DNS, TCP and SMTP`.

### Task 14: How the Internet Works: HTTPS, UDP, IP, DHCP and ICMP

**Files:** Create `src/content/lessons/networking/how-the-internet-works/{https,udp,ip,dhcp,icmp}.ts` from `FIGS/protocols-core.mjs`; modify the lesson file and its test.

**Interfaces:** as Task 13. References: HTTPS RFC 2818 and RFC 9110; UDP RFC 768; IP RFC 791; DHCP RFC 2131; ICMP RFC 792. HTTPS uses the table "What someone watching can see" (contrast with FTP's "can read", Task 15). The overlap between this DHCP unit and lesson 10 stays as it is (owner: deferred).

- [ ] **Step 1: Extend the tests:** each new unit validates and is ≤ 15 minutes; HTTPS ends with the padlock cue applied; ICMP's traceroute stops light routers (messages whose `to` is an internet router).
- [ ] **Steps 2–5:** run → FAIL; implement; run → PASS; check HTTPS and ICMP in the browser; commit `feat: How the Internet Works with HTTPS, UDP, IP, DHCP and ICMP`.

### Task 15: How the Internet Works: POP3, IMAP, FTP, SSH and TLS; the whole lesson

**Files:** Create `.../how-the-internet-works/{pop3,imap,ftp,ssh,tls}.ts` from `FIGS/protocols-apps.mjs`; modify the lesson file and its test.

**Interfaces:** as Task 13. References: POP3 RFC 1939; IMAP RFC 9051; FTP RFC 959; SSH RFC 4251 and RFC 4253; TLS RFC 8446.

- [ ] **Step 1: Extend the tests:**

```ts
test('all 14 protocols are present, in UNIT_ORDER', ...)
test('78 Watch steps in all, 28 questions', ...)
test('the lesson takes 96 minutes', () => expect(estimateMinutes(internet)).toBe(96));
test('FTP draws its data line dashed and closes it; SSH and TLS seal their connections', ...)
```

- [ ] **Steps 2–5:** run → FAIL; implement; run → PASS; walk all 14 protocols in the browser; commit `feat: How the Internet Works, all 14 protocols`.

### Task 16: Firewalls (lesson 17): scene, driver, rule list and content

**Files:**
- Create: `src/art/scenes/firewall.ts`, `src/scenes/drivers/firewall.ts`, `src/lesson/panels/RulesPanel.tsx`, `src/content/helpers/firewall-events.ts`, `src/content/lessons/networking/firewalls.ts`, tests beside each
- Modify: `parts.ts`, `src/art/scenes/index.ts`, `drivers/index.ts`, `ScenePanel.tsx` (panel `rules`)

**Interfaces:**
- Produces: `drawFirewall(): DrawnFigure`, a port of `FIGS/firewall-scene.mjs`: the wall with the gate, the boom's two arms (down and up groups), the light bar, the rule board on W2's face with three rows and "RULES · TOP DOWN", the two laptops and their screen glows, the server with its busy overlay, the cables, the stop mark, the trail, the masks that put tags behind the wall (`#fw-behind`, `fw-layer-behind`, `fw-layer-front`), the callouts and the floor texts "THE INTERNET" and "OFFICE", the plate label "FIREWALL · FIRST MATCH WINS". `data` = its `sceneData()` (`M`, `O`, `wallFront`, routes `visitor`, `admin`, `inside`). Allow and deny lights use `#3ddc7c` and `#ff4f4f` in both themes.
- `FIGURE_PARTS.firewall = { places: ['visitor', 'admin', 'firewall', 'web'], cues: { rules: 'text' }, layers: [], board: false }`.
- `firewall-events.ts` (uses `evaluateRules` and `ruleRows`):

```ts
export const ADDR = { visitor: '203.0.113.50', admin: '198.51.100.7', web: '10.0.0.10' };
export const RULES: Record<'https' | 'ssh' | 'rest', FirewallRule>;           // 443 any "Website (HTTPS)"; 22 198.51.100.7/32 "Admin login (SSH)"; deny any "Block everything else"
export const RULESETS = { base: ['https', 'ssh', 'rest'], shadow: ['rest', 'https', 'ssh'] } as const;
export function visit(o: { id: string; who: 'visitor' | 'admin'; tag: string; port: number; svc: string; sport: number; rules: keyof typeof RULESETS; plain: string }): SceneEvent[];
// one message to 'web' (blocked at 'firewall' when denied) with check { table: 'rules', read, match, action } from evaluateRules,
// log { source: 'addr:sport', destination: '10.0.0.10:port', service: 'TCP port · svc', decision: 'Allowed · rule n' | 'Denied · rule n' },
// and, when allowed, a table add to 'conns' keyed `${who}:${port}`.
export function reply(o: { id: string; of: string; tag: string; plain: string }): SceneEvent[];   // web → visitor, known { table: 'conns', key }, decision 'Allowed · known connection'
export function change(o: { id: string; rules: keyof typeof RULESETS; plain: string }): SceneEvent[]; // note 'Rules changed', table replace 'rules', table clear 'conns', cue rules=<set>
export function checkResults(lesson: Lesson): void;   // throws if a step's "Result" fact disagrees with the decision of that step's visit or reply
```
  `firewalls.ts` ends with `checkResults(firewalls)`, so a decision that changes stops the build (§7.4).
- `RulesPanel({ panel, tables, marks, active }: { panel: Extract<Panel, { type: 'rules' }>; tables: Record<string, TableState>; marks: PanelMark[]; active: SceneEvent | null })`: "Rule list" / "read from the top, first match wins", a table (#, Action, Port, Source, For, Check). While a visit plays, the Check column follows `marks` (from the driver): `check` is the row being read, in marigold, "Checking…"; `miss` "Doesn’t fit"; `allow`/`deny` "Fits → allow"/"Fits → deny". Once the visit is applied it shows the same marks worked out from `active.check`; Action text DENY in the blocked colour and ALLOW in the allowed colour, each with its word. Under it, "Connections it remembers" with one chip per row ("Visitor → port 443 rule 1", the full addresses in its `title`) or "None yet. Each allowed visit is remembered here."; the chip a reply uses pulses. Rows animate in once after a change.
- Driver (from `lesson-firewall.mjs` `playVisit`, `playReply`, `playChange`): the tag rides to the gate and waits while the board's rows are checked, calling `onMark` for each row as it reads it (`check`, then `miss`, and the match's action); allow lifts the arms, lights the bar green and rides inside to the top of the server (busy lights on); deny turns the trail red and pops the stop mark; a reply rides `inside` reversed, then out to the visitor, whose screen glows; a change reorders the board's rows. Tags past the gate move into the masked layer.
- `duration`, with ride(route) = 600 + 9 × the route's length: a visit is ride(visitor or admin) + 700 × `check.read` + (allow ? 380 + ride(inside) : 900) + 500 + 200; a reply is ride(inside, reversed) + 800 + 300 + ride(visitor, reversed) + 500 + 200; a change is 300 + 1300 + 500 + 200; a table event is 0.
- Content from `FIGS/firewall-lesson.mjs`: title "Firewalls", subtitle "Deciding what gets in", certTags `['network-plus', 'security-plus', 'ccna', 'soc-analyst']`, summary "Watch a firewall check each connection against its list of rules, from the top down, and see why the order of the rules matters."; steps Rule Evaluation, First-Match Rule, Source Filtering, Default Deny, Stateful Inspection, Rule Shadowing (7 events); Learn with its 8 terms and the pattern Rule Evaluation, First-Match Rule, Default Deny, Stateful Inspection; 3 questions, worded with rule names as in the mockup; reference NIST SP 800-41 Rev. 1 (`https://csrc.nist.gov/pubs/sp/800/41/r1/final`); panel rules; log "Firewall log" with columns source, destination, service, decision, plain (Source, Destination, Service, Decision, In plain words), legend Visit, Reply, Blocked, Rule change; parties Visitor, Admin, Firewall, Web server with their addresses; views network and sequence; scene title "Office firewall · web server 10.0.0.10".

- [ ] **Step 1: Write the failing tests:**

```ts
test('drawFirewall matches the mockup scene', ...)
test('the decisions are allow 1, deny 3, allow 2, deny 3, the reply, the change, deny 1', ...) // recomputed by evaluateRules
test('each step’s Result fact agrees with the decision the engine makes', ...)
test('a visit reads rules until the first fit: read 3 for the Telnet visit', ...)
test('after the change the rule list is DENY, ALLOW 443, ALLOW 22, and no connections are remembered', ...)
test('RulesPanel shows Checking…, Doesn’t fit and Fits → deny as marks arrive, and the same marks once applied', ...)
test('the driver reports marks in reading order; a visit reading 3 rules lasts 1400 ms longer than one reading 1 on the same route', ...)
test('Firewalls validates and takes 10 minutes', ...)
test('checkResults throws on a copy whose Result fact says allowed for a denied visit', ...)
// src/art/scenes/index.test.ts, now that all four exist:
test('every scene figure draws with data-figure, role="img", a non-empty aria-label and no grain', ...)
test('the Sequence view stops denied visits at the firewall with their rule', ...)
```

- [ ] **Steps 2–5:** run → FAIL; implement; `npx vitest run` and `npm run build` → PASS; compare with `firewalls-v1.html` at 1280×800, 1440×900 and 1920×1080 in both themes, in both views; commit `feat: Firewalls in the new console`.

---

## Phase 5: Pages

The page tasks port markup and CSS from the mockups into Astro pages and components, with page styles in `src/components/site.css` (or component `<style>` blocks). Numbers on pages are computed: ready count, planned count and minutes come from `getEntries()`/`trackTotals()` (4, 20, 124).

### Task 17: Home

**Files:**
- Rewrite: `src/pages/index.astro`
- Create: `src/components/HeroWeb.astro`, `src/scripts/hero-web.ts`, `src/components/HeroCta.tsx`, `src/components/TrackCardProgress.tsx`, tests `HeroCta.test.tsx`, `TrackCardProgress.test.tsx`, `src/scripts/hero-web.test.ts`
- Modify: `src/content/tracks/index.ts`: each `comingSoonTracks` entry gains `cover: CoverId` (`web`, `crypto`, `ai`, `privesc`, `tvm`, in the current order), and the Networking card uses `networking`

**Interfaces:**
- Consumes: `heroWebSvg`, `HERO_WEB`, `coverStill`, `spot` (Task 3), the registry, `tracks`, `comingSoonTracks`, `useProgress`, `trackCompletion`, `resumePosition`, `resumeLabel`.
- Produces (from `MOCKUPS/home-v6.html`, §6.1):
  - Hero: eyebrow "Free visual lessons, no sign-up"; `<h1>` "See how technology <span class="accent">really works.</span>"; lede "Short, visual lessons on networks, the web, security and AI. Watch each idea happen one step at a time, explained in plain words."; two buttons; the hero figure on the right with the caption card (four plain-words steps, ending "That request and reply are called HTTP.") and Pause / Play / Replay. `hero-web.ts` exports `startHero(root: HTMLElement): { pause(): void; play(): void; replay(): void }`: it starts when the hero comes into view (IntersectionObserver), plays once and stops; it announces each caption step politely; under reduced motion it shows the last frame and a "Play it" button.
  - `HeroCta`: first visit "Start learning" (to lesson 1) and "See the lessons"; a returning visitor gets "Continue <lesson>" as the primary button and an eyebrow saying where they are (launch §10.1).
  - Exams strip "Each lesson shows which exams and jobs it helps with" over the six tags, each linking to `/networking?for=<tag>`.
  - "Learn by watching it happen." with three cards; the big one shows a sample of the DHCP message log (its first four rows, from the DHCP lesson's derived log at its Learn position).
  - `id="how"`: "Watch, learn, then practice." timeline with the Watch, Learn and Practice figures.
  - "Start with networking.": six track cards with the approved covers, still; Networking reads "4 of 20 lessons ready, 124 min" (computed); `TrackCardProgress` swaps in "n of 20 done, m in progress" with a 20-segment bar for a returning visitor; the other five are "Coming soon", not links.

- [ ] **Step 1: Write the failing tests:** `HeroCta` first visit vs returning; `TrackCardProgress` texts; `startHero` plays once, Pause holds the frame, Replay restarts, reduced motion shows the last frame and "Play it" (jsdom with a fake IntersectionObserver and fake timers).
- [ ] **Steps 2–5:** run → FAIL; implement; `npx vitest run` and `npm run build` → PASS; compare with `home-v6.html` at all four sizes in both themes; commit `feat: the new Home page`.

### Task 18: Track page

**Files:**
- Rewrite: `src/pages/[track]/index.astro`
- Create: `src/components/NetworkingCover.astro`, `src/scripts/router-cover.ts`, `src/components/TrackHeroCta.tsx`, `src/components/TrackSidebar.tsx`, `src/components/TrackLessons.tsx`, tests beside the islands
- Delete: `src/components/TrackLessonList.tsx`, `TrackProgress.tsx` and their tests

**Interfaces:**
- Produces (from `MOCKUPS/track-v2.html`, §6.2):
  - Hero: breadcrumb Home / Networking Concepts; eyebrow "Track 1 · Beginner"; title; description; stats "lessons planned 20", "ready now 4", "minutes in all 124" (computed); `TrackHeroCta` "Start with How the Internet Works" or "Continue <lesson>"; "Every lesson: Watch › Learn › Practice"; the Networking cover, live: `router-cover.ts` `startRouterCover(root)` sends packets along the cable on click or Enter/Space (`role="button"`, `tabindex="0"`, "Click to send packets"), with the readout "n packets received" (port of `FIGS/lumen-assets.mjs` `routerLive`).
  - `TrackSidebar`: "Your progress" ("n of 20 complete", a 20-segment bar, "Clear my progress" asking "Clear all progress on this device?" with Clear and Keep it), then "Parts" with each part's ready count.
  - `TrackLessons`: "Show lessons for" chips synced to `?for=<tag>` (an unknown tag shows everything), then the six parts. A ready lesson is a card: its figure (`internetThumb()` for lesson 1, `spot('subnet' | 'dhcp' | 'firewall')`), "Lesson NN", title, subtitle, summary, "<minutes> min", "14 protocols" for lesson 1 (`units > 1`), its exam tags, and Watch / Learn / Practice progress for a returning visitor. A coming-soon lesson is a compact row.

- [ ] **Step 1: Write the failing tests:** chips sync the URL and filter; an unknown `?for=` shows all; lesson 1's card shows "96 min" and "14 protocols"; Clear asks first and then empties progress; the cover counts packets and answers Enter.
- [ ] **Steps 2–5:** run → FAIL; implement; run → PASS; compare with `track-v2.html` at all four sizes in both themes; commit `feat: the new track page`.

### Task 19: About

**Files:**
- Rewrite: `src/pages/about.astro`, `src/components/ResetProgress.tsx` (same steps and words, new look), its tests
- Create: `src/scripts/about-toc.ts`, test `src/scripts/about-toc.test.ts`

**Interfaces:**
- Produces (from `MOCKUPS/about-v1.html` and `FIGS/about.mjs`, §6.4): hero "Watch it happen, <accent>then learn its name.</accent>", the lede, stats "tracks planned 6" (`tracks.length + comingSoonTracks.length`), "lessons ready 4" (computed), "accounts needed 0"; the How the Web Works cover, still; "On this page" list (`about-toc.ts` `markSectionInView(links, sections)` sets `aria-current` on the link of the section under the header, and on the last one at the bottom of the page); the five sections with the mockup's words; the lesson-length note uses the computed lesson 1 minutes; the analytics sentence only when `analyticsToken` is set; `ResetProgress` with "Reset progress", "Reset all progress on this device?", Reset and Cancel, "Progress cleared".

- [ ] **Step 1: Write the failing tests:** `markSectionInView` marks the right link while scrolling and the last at the bottom; ResetProgress keeps its focus moves and words.
- [ ] **Steps 2–5:** run → FAIL; implement; run → PASS; compare with `about-v1.html` at all four sizes in both themes; commit `feat: the new About page`.

---

## Phase 6: Finish

### Task 20: Clean-up, budgets and docs

**Files:**
- Create: `scripts/check-budgets.mjs`; modify `package.json` (script `"budgets": "node scripts/check-budgets.mjs"`), `README.md` (layout, Adding a lesson for v2: units, figures, drivers, minutes), `docs/deploy.md` if anything changed

**Interfaces:**
- `check-budgets.mjs` reads `dist/`: for every `.html`, gzip size ≤ 250 KB; for every lesson page, the gzip sizes of the JS it loads (its module scripts and every `astro-island` `component-url`/`renderer-url`, following static `import` statements in those chunks) sum to ≤ 200 KB. It prints a table and exits non-zero on any breach.

- [ ] **Step 1:** `npm run build && npm run budgets` → every page under both budgets (expected about: Home 152 KB, track 124 KB, lesson 1 ≈ 231 KB, Firewalls ≈ 43 KB, About ≈ 63 KB of HTML). If lesson 1 is over, share repeated parts with `<symbol>`/`<use>` before considering on-demand layers (§8).
- [ ] **Step 2:** dead-code sweep: `grep -rniE "tryIt|Try it|inspector|playground|recap|CheckYourself|ibm-plex|Plex" src scripts README.md` finds nothing; `npx astro check` reports no unused files you created; remove leftovers.
- [ ] **Step 3:** `npx vitest run` → PASS.
- [ ] **Step 4: Commit** `chore: page and script budgets, docs for the new lesson model`.

### Task 21: End-to-end and visual checks

**Files:**
- Rewrite: `e2e/site.spec.ts`, `e2e/lesson.spec.ts`, `playwright.config.ts`
- Create: `e2e/visual.spec.ts`

**Interfaces:**
- `playwright.config.ts` projects: `d1280` (1280×800), `d1366` (1366×768), `d1440-dark` (1440×900, dark), `d1440-light` (1440×900, light), `d1920` (1920×1080), `reduced-motion` (1440×900, `reducedMotion: 'reduce'`), `phone` (390×844). `visual.spec.ts` is tagged `@visual` and run on its own (`npx playwright test --grep @visual`).
- `site.spec.ts`: Home is titled TechConcepts and says "4 of 20 lessons ready, 124 min"; coming-soon cards are not links; exam tags link to `?for=`; the skip link reaches main; the track lists 20 lessons, 16 Coming soon, lesson 1 first with "14 protocols"; `?for=` filters; finishing DHCP shows Finished on the track and "Continue" on Home, and Reset clears both; About states where progress lives, credits the inspirations and the kit, and resets; `/does-not-exist` serves the 404; no analytics script without a token; no page has sideways scroll at any desktop size; the phone project loads every page and scrolls without errors.
- `lesson.spec.ts`, for each ready lesson: no page errors walking Overview → every step → Learn → Practice with → and back with ←, and again by clicking the outline and the next button; Play runs to the last step and the button says Replay, with the log filled; it fits one screen at 1280×800 and wider with the explanation scrolling inside; the Sequence toggle is present except in Subnetting, and switching mid-run and back leaves the scene settled; under reduced motion a run takes as long as normal; with `localStorage` throwing (an init script) the lesson still plays end to end; a focused table keeps focus while playback adds a row (the existing DHCP case, kept); Firewalls' matched rule row is visible at every step at 1280×800.
- `visual.spec.ts`: full-page screenshots of Home, the track, each lesson at Overview, step 3, Learn and Practice, About and 404, at the four desktop sizes in both themes, saved to `test-results/visual/<page>-<size>-<theme>.png`.

- [ ] **Step 1:** write the specs; **Step 2:** `npm run e2e` → fix until PASS.
- [ ] **Step 3:** run `@visual`, then put each screenshot beside its mockup in the browser at the same size and theme. List every difference that isn't a deliberate change (§5's red lost packets; "Step n of N" in the DHCP top bar) and fix it. Repeat until the list is empty; keep the final list (empty, or with reasons) for the owner.
- [ ] **Step 4: Commit** `test: end-to-end and visual checks for the redesign`.

### Task 22: Owner review, merge and deploy (owner-gated)

- [ ] **Step 1:** `npx vitest run`, `npm run e2e`, `npm run build && npm run budgets` all pass on the feature branch.
- [ ] **Step 2: Stop and ask the owner** to review the built site (`npm run preview`), naming: the pages and lessons to check; the references drafted for lesson 1, Subnetting and Firewalls (§7.5); the 404 page (no mockup); the visual-check list from Task 21; and any rulings recorded during execution. Make the changes they ask for.
- [ ] **Step 3: Only with the owner's explicit OK to merge:** merge the feature branch into `redesign`, then `redesign` into `main` (`git merge --no-ff`), and run the full suite on `main`.
- [ ] **Step 4: Only with the owner's separate, explicit OK to push:** `git push origin main`. Cloudflare Workers Builds deploys `main` to the preview (§10). Open the preview and check Home, one lesson and About in both themes; report the result.
