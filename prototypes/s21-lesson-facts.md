# S21: the Lesson page, facts (2026-11-17)

Scout report for job 19's unit S21, on `revamp` at `aa6d838`. Read-only; nothing edited. Repo-relative paths, evidence as path:line. Facts only; the one-line status of each old fault is stated against the code, not judged.

## Part 1: the page's code (Q1)

Route file and its imports: `src/pages/[track]/[lesson].astro` (66 lines). It builds one page per available lesson (`getStaticPaths`, :16-30), draws the figure at build time (`drawFigure`, :38), writes the figure's first-unit labels (`fillLabels`, :43), and renders `BaseLayout` with `chrome={false}` (:49) around one island, `<LessonConsole client:load …>` (:50-51). It passes the SVG as the `figure` slot (:64).

Lesson UI, `src/lesson/` (non-test files, line counts):

| File | Lines | What it does |
|---|---|---|
| `LessonConsole.tsx` | 347 | The page: top bar, outline, tabs, scene, explanation, log, controls; state, playback, keys, tab logic. Imports `./console.css` (:24) |
| `Explanation.tsx` | 406 | The right-hand words: Overview, Watch, Learn, Practice, the end row ("That's the whole lesson", Up next) |
| `Outline.tsx` | 289 | The left outline (units, parts, lesson list, filters) |
| `LogPanel.tsx` | 236 | The event log; mounts `PlaybackControls` as its `controls` (LessonConsole.tsx:337) |
| `ScenePanel.tsx` | 156 | The scene: title, Network/Sequence switch, the figure or `SequenceView`, the unit's panel |
| `TopBar.tsx` | 120 | Mark, lesson name, step segments, stamp, theme button |
| `PlaybackControls.tsx` | 124 | Speed, Previous step, Play all/Pause, Replay step, forward button (Next step / Next lesson) |
| `Practice.tsx` | 105 | The Practice questions and feedback ("Not quite.", :16-17) |
| `Marks.tsx` | 23 | Source marks |
| `Rich.tsx` | 20 | Inline text with emphasis |
| `announce.ts` | 29 | Text for the polite live region |
| `keyboard.ts` | 49 | Which targets ignore a key shortcut |
| `useLessonShortcuts.ts` | 49 | Space, ArrowRight, ArrowLeft |
| `useReducedMotion.ts` | 23 | Reduced-motion hook |
| `placeLabel.ts` | 20 | Places a label in a figure slot |
| `sourceNumbers.ts` | 46 | Numbers sources for Explanation |
| `console.css` | 2068 | All console layout, desktop and phone rules (see Part 2) |

`src/lesson/panels/` (the lesson's own panel, shown as the fourth phone tab):

| File | Lines | What it does |
|---|---|---|
| `UnitPanel.tsx` | 69 | Picks the panel by type: table, rules, bits, labels |
| `TablePanel.tsx` | 109 | A table panel (imports `./table.css`, :5) |
| `RulesPanel.tsx` | 160 | Firewall rules panel (imports `./rules.css`, :6) |
| `BitsBoard.tsx` | 253 | Subnetting's bits board (imports `./bits.css`, :5) |
| `LabelsPanel.tsx` | 50 | OSI Model's message strip, not a tab (imports `./labels.css`, :2) |
| `useFocusAcrossRemounts.ts` | 33 | Keeps focus across remounts (used by Table and Rules) |
| `table.css` | 162 | |
| `rules.css` | 243 | |
| `bits.css` | 298 | Desktop 470px board (`.bits__col-label` 94px, :26; `.bits__col-bits` 376px, :29); phone block at :211 (`max-width: 639px`) |
| `labels.css` | 60 | |

Islands: the only `client:` directive on the page is `client:load` on `LessonConsole` (`src/pages/[track]/[lesson].astro:51`). `TopBar` imports `ThemeToggle` (`src/lesson/TopBar.tsx:7`) without its own directive; it is inside the same island.

Other files the console imports: `src/lesson/LessonConsole.tsx:3-24` (content types, `src/engine/playback`, `src/engine/timeline`, `src/lib/entries`, `src/lib/hub`, `src/progress/store`, `src/progress/useProgress`, `src/scenes/drivers`, and the child components).

CSS the page loads (by the module graph of `[lesson].astro`):

| File | Lines | Loaded by |
|---|---|---|
| `src/lesson/console.css` | 2068 | `LessonConsole.tsx:24` |
| `src/components/site.css` | 240 | `src/lesson/Explanation.tsx:2` |
| `src/styles/global.css` | 209 | `src/layouts/BaseLayout.astro:2` |
| `src/art/lumen.css` | 230 | `src/layouts/BaseLayout.astro:3` |
| `src/lesson/panels/table.css` | 162 | `TablePanel.tsx:5` |
| `src/lesson/panels/rules.css` | 243 | `RulesPanel.tsx:6` |
| `src/lesson/panels/bits.css` | 298 | `BitsBoard.tsx:5` |
| `src/lesson/panels/labels.css` | 60 | `LabelsPanel.tsx:2` |
| `src/scenes/sequence.css` | 141 | `src/scenes/SequenceView.tsx:4` |
| `src/art/scenes/net-map.css` | 74 | `src/art/scenes/net-map.ts:12` (reached via `drawFigure`, `[lesson].astro:4`) |
| `src/art/scenes/{dhcp,firewall,osi,pool,subnet,switch}.css` | not counted | `src/art/scenes/dhcp.ts:10`, `firewall.ts:11`, `osi.ts:15`, `pool.ts:12`, `subnet.ts:10`, `switch.ts:10` (reached via `src/art/scenes/index.ts`) |

Not loaded by the Lesson page: `src/components/hub/hub.css` (imported only by `src/pages/[track]/index.astro:21` and `src/pages/tracks.astro:14`); `src/styles/card-stack.css` (imported only by `src/pages/index.astro:21` and `src/pages/tracks.astro:15`). `src/components/SiteHeader.astro` and `SiteFooter.astro` are not rendered (`BaseLayout.astro:100-112`, `chrome ? … : <slot />`).

Scene and engine modules the page uses (non-test files):

- `src/scenes/drivers/index.ts` (20 lines), the `DRIVERS` map (`LessonConsole.tsx:13`, `ScenePanel.tsx:7`).
- `src/scenes/drivers/`: `net-map.ts` 776, `dhcp.ts`, `firewall.ts`, `osi.ts`, `pool.ts`, `subnet.ts`, `switch.ts` (the seven drivers; line counts not taken).
- `src/scenes/driver.ts` (131): `sceneViewOf`, `marksOf`, `landedEvent` (`ScenePanel.tsx:6`, `UnitPanel.tsx:3`, `RulesPanel.tsx:4`).
- `src/scenes/SequenceView.tsx` (184) and `src/scenes/sequence.css` (141), used by `ScenePanel.tsx:8`.
- `src/scenes/motion.ts` (92): importer not traced.
- `src/engine/playback.ts` (225), `src/engine/timeline.ts` (274), `src/engine/tables.ts` (124) (`driver.ts`, `RulesPanel.tsx:3`, `TablePanel.tsx:3`).
- `src/engine/net/subnet.ts` (52) and `src/engine/net/ipv4.ts` (55), imported by `src/lesson/panels/BitsBoard.tsx:3-4`.
- `src/engine/net/firewall.ts` (59): imported only by `src/content/helpers/firewall-events.ts` (not the page).
- `src/art/scenes/index.ts` (24, `drawFigure`), `src/art/scenes/net-map.ts` (652, `drawNetMap` at :648), `src/art/scenes/labels.ts` (14, `fillLabels`).
- `src/lib/figures.ts` (42, `lessonFigure`, for the Up next card), `src/lib/checked.ts` (23), `src/lib/glossary-site.ts` (30), `src/lib/entries.ts` (27), `src/lib/hub.ts` (110), `src/components/Stamp.tsx` (39), `src/components/LogoMark.tsx` (17), `src/components/ThemeToggle.tsx` (44).
- `src/progress/store.ts` (257), `src/progress/useProgress.ts` (98).

## Part 2: layout regions at 375 and 1440 (Q2)

Breakpoints are the console's own media queries. Three bands matter: the desktop grid (the base rules, active at 1100px and up), the tablet and phone blocks (`max-width` rules, with the phone rules gated by `:root.js`), and the stacked fallback (`max-width: 1099px` without `:root.js`). `:root.js` is set by the boot script (`src/lesson/console.css:1381-1384` comments).

**Desktop (1100px and up), the base rules:**

- The console is a grid of 268px and 1fr columns, 68px and 1fr rows, 12px gap, `height: 100vh` (`src/lesson/console.css:20-34`; columns at :22, rows at :23).
- Top bar `.console__top`: row 1 across, flex, z-index 5 (`console.css:125-131`).
- Outline `.console__outline`: column 1, row 2, `padding: 16px 12px`, `overflow: auto` (`console.css:336-344`).
- Scene `.console__stage` (column 1, row 1, flex column; :599-607). Head `.stage__head` (`min-height: 50px`, `padding: 8px 12px`; :609-616). `.console__scene` (:623-628). The figure `.stage__figure > svg` is `position: absolute; inset: 0; max-width: 940px; max-height: 440px; margin: auto` (:629-650 region).
- Main area `.console__main` (:63-74): columns `minmax(0, 1fr) clamp(348px, 27vw, 392px)`, rows `minmax(0, 1fr) clamp(200px, 26vh, 252px)`, 12px gap.
- Explanation `.console__explain`: column 2, row 1, `overflow: auto`, `padding: 20px 22px 24px` (:653-658 region).
- Log `.console__log`: row 2, spanning the grid (:1116-1122). Its controls `.console__controls` (:1174); `.cbtn` is `height: 34px; min-width: 34px` (:94-95 region).
- Learn and Practice on desktop (`data-reading`): words column `max(348px, min(560px, 100% - 496px))` (`console.css:76-87`, the block that also covers the tablet-on-its-side range).

**Phone (up to 760px; up to 899px wide at 600px tall or more; up to 1099px upright), JS on:** the block at `console.css:1384` (`@media (max-width: 760px), (max-width: 899px) and (min-height: 600px), (max-width: 1099px) and (orientation: portrait)`). Under `:root.js .console`:

- `--ph-top: 52px`, `--ph-stage: 34dvh`, `--ph-tabs: 48px`, `--ph-ctl: calc(64px + env(safe-area-inset-bottom))` (`console.css:1386-1389`). The console is `height: 100dvh; overflow: hidden` (:1390-1393).
- Reading (Learn, Practice): `--ph-stage: 18dvh` (:1398-1400).
- Top bar fixed, `height: var(--ph-top)` (:1408-1414). Hidden at this width: the brand word (`.topbar__brand b`), the crumbs, the OSI chips (`.topbar__osi`) (:1420-1437 region). The step segments are hidden too (`.topbar__segments { display: none }`, :1591-1593). Kept: the mark, the lesson's name, "Step 2 of 5" and the theme button (`docs/direction.md:284`, the 2026-11-10 phone layout).
- Scene `.console__stage`: fixed, `inset: var(--ph-top) 0 auto`, `height: var(--ph-stage)` (:1438-1445). `.stage__head`: `min-height: 40px; padding: 4px 12px` (:1446-1449). `.stage__title` hidden (:1450-1453). A lesson with one view has no head (:1454-1456).
- `.console__scene`: `flex: 1 1 0`, `overflow: hidden` (:1457-1464).
- Tabs `.console__tabs`: fixed under the scene, a grid with one column per tab, `height: var(--ph-tabs)` (48px) (:1466-1476). Tab text `font: 600 17px/1 var(--display)` (the block at :1897-1917, shared with the tablet blocks).
- The three parts (`.console__outline`, `.console__explain`, `.console__log`): fixed, `inset: calc(var(--ph-top) + var(--ph-stage) + var(--ph-tabs)) 0 var(--ph-ctl)`, each scrolling inside itself (:1486-1494). Only the part whose tab is pressed shows (`data-tab`, :1496-1502).
- Controls `.console__controls`: fixed at the bottom, `height: var(--ph-ctl)` (:1596-1606). Buttons `height: 48px; min-width: 48px` (:1607-1612). Under 375px the forward button's arrow goes first (`@media (max-width: 374px)`, :1643-1652). Under 360px the controls are 44px (`@media (max-width: 359px)`, :1653-1663).
- Tables, rules and bits (the fourth tab's panel): fixed in the same band as the parts, `padding: 14px 14px 20px` (:1711-1718); hidden unless that tab is pressed (:1720-1722).
- The log's rows are stacked entries on a phone (`.log__table` rules, :1503-1590).
- The OSI strip (`.labels`) is `padding: 4px 12px 5px` with 30px rows (:1677-1703); `.console[data-reading] .labels` is hidden (:1704-1706).

**Tabs** (`src/lesson/LessonConsole.tsx`): `TABS` = Explain, Steps, Log (:28-32). The fourth tab comes from `PANEL_TAB` (:38): `table` gives "Table", `rules` gives "Rules", `bits` gives "Bits". A labels panel (OSI Model's strip) has no entry, so it has no fourth tab. The tab list is built at :167 (`[...TABS, { id: 'table', label: panelTab }]`). The tab row is `role="group" aria-label="Show"` (:293-303). A tab not on offer falls back to Explain (:145).

**Tablet, 761px to 1099px:**

- Upright, or under 900px wide and at least 600px tall: the phone layout grown (`console.css:1897-1917` and `:1919-1947`, `min-width: 761px` rules). `--ph-stage: 40dvh; --ph-col: 520px` (:1924-1925). The explanation, outline, log and controls share one centred column (:1926-1946). The top bar shows the segments and the stamp again (:1941-1947 region).
- On its side, 900px to 1099px wide and at least 600px tall: the desktop layout with the outline folded into a tab (`console.css:1950-1960` region: `--mid-words: 348px; --mid-tabs: 48px; --mid-log: clamp(200px, 26vh, 252px)` at :1952-1954). The tabs are Explain and Steps only: `TABLET_SIDEWAYS` at `LessonConsole.tsx:35`, and the effect at :157-161 moves Log or Table to Explain. Learn and Practice: words `max(348px, min(560px, 100vw - 24px - 496px))` (`console.css:1960-1963` region).
- Under 600px tall (a phone on its side): the stacked page (`console.css:1331-1357`).

**Stacked fallback** (`console.css:1331-1357`, `@media (max-width: 1099px)`, no `:root.js`): one column, `.console { height: auto; min-height: 100vh; overflow: visible }`, `.console__stage { min-height: 320px }`, `.console__log { max-height: 70vh }`. Used with JavaScript off at every width under 1100px, and on a tablet or phone on its side under 600px tall. The no-JS tests are `src/lesson/no-script.test.ts` (82 lines) and `src/lesson/definitions.no-script.test.ts` (32 lines), and `e2e/lesson.spec.ts:418` ("without JavaScript").

**Fixed sizes in px** (from the rules above): desktop top bar 68px (`console.css:23`), sidebar 268px (:22), explanation column `clamp(348px, 27vw, 392px)` (:66), log row `clamp(200px, 26vh, 252px)` (:68), stage head 50px minimum (:611), figure max 940×440 (:629-650 region), desktop buttons 34px (:94). Phone: top bar 52px, scene 34dvh (18dvh in reading), tabs 48px, controls 48px buttons (`--ph-*` at :1386-1389, buttons at :1608).

## Part 3: the phone figures (Q3)

**The network map's frame.** `drawNetMap` is at `src/art/scenes/net-map.ts:648` (it returns the SVG and its driver's data). The frame is not a fixed width. The map takes every point any protocol shows (`net-map.ts:604-606`, "One frame for every protocol, so the map never jumps in size between them"), then `PAD = 18` (:607) and `vb = [minX − PAD, minY − PAD, width + 2·PAD, height + 2·PAD]`, each rounded (:608). The SVG is written at :613 as `<svg data-figure="net-map" class="lm-svg nm" viewBox="…" role="img">`, with no `preserveAspectRatio` attribute (so the default, `xMidYMid meet`, applies).

**The 685 figure.** "685" is not in the code or the tests. The only place it appears is `docs/direction.md:274`: "With the sidebar back at 268px (the table above), the drawing is 685×326." That is a 2026-11-10 measurement in the layout-decision text, not a constant. The same section gives 705×336 for the under-scene variant (:273, the "taken" row).

**How the figure is scaled into the phone's scene box.** The figure's wrapper `.stage__figure` is `position: absolute; inset: 0` (`src/lesson/console.css:629-632`), and its `svg` is `width: 100%; height: 100%; max-width: 940px; max-height: 440px; margin: auto` (`console.css:639-650` region). On a phone the box is `.console__scene`, `flex: 1 1 0; overflow: hidden` inside `.console__stage` (`console.css:1438-1464`), whose height is `var(--ph-stage)` (34dvh, or 18dvh in Learn and Practice; `console.css:1387`, `:1399`), less the stage head (`min-height: 40px`, :1446-1447, shown only when the lesson has two views). With `meet`, the drawing's scale is the smaller of box width ÷ viewBox width and box height ÷ viewBox height. The viewBox width is computed at build time from the point set, so the scale is not fixed in this code and was not measured here.

**Label sizes in the map.** The map's text is drawn in viewBox units, so the on-screen size is the CSS size times that scale. The sizes are `src/art/scenes/net-map.css:6-9` (`.nm-name` 11.5px, `.nm-sub` 13px, `.nm-addr` 12.5px, `.nm-state` 13px), `:19` (`.nm-url` 2.3px), `:26` (`.nm-tag-t` 3.9px), `:33` (`.nm-over-t` 3.2px), `:45` (`.nm-drop-t` 7px), `:63` (`.nm-strip text` 12px). `net-map.css` has one `@media` rule, reduced motion (`:70`). `src/lesson/console.css` has no `nm-` rule (grep count 0). So no phone rule changes the map's label size.

**The Sequence view on a phone.** `src/scenes/SequenceView.tsx`: `WIDTH = 720` (:7), `HEAD_HEIGHT = 54` (:10), `CHAR_WIDTH = 6.6` (:22); the header SVG is `viewBox="0 0 720 54"` (:136) and the messages' SVG `viewBox="0 0 720 {height}"` (:154). `src/scenes/sequence.css`: `.seq` is `position: absolute; inset: 0; max-width: 940px; padding: 10px 16px 0` (:8-16), `.seq svg` is `width: 100%; height: auto` (:31-35), and the only `@media` is reduced motion (:124). Its text sizes are `.seq__name` 11.5px (:36-38), `.seq__addr` 12px (:44), 11px (:53), 12px (:104), 11.5px (:109), 12px (:121). So the drawing's scale on a phone is the content width ÷ 720 (the `.seq` padding is 16px at each side). At 375px that is (375 − 32) ÷ 720 ≈ 0.48 by this arithmetic, which would make 12px text about 5.7px. This is computed from the CSS, not measured here.

**Tests that measure label size on a phone.**

- `e2e/switch.spec.ts:57-62`, `calloutSizes`: the smallest rendered font size of the switch figure's MAC words and names, times the scale (`scale = svg width ÷ viewBox width`, :59). Used by test 15c (`e2e/switch.spec.ts:90-100`): "at 375 the MAC words are at least 6.6px and the names 6.0px". This covers the Switch lesson's figure only.
- No e2e test measures the network map's or the Sequence view's label size on a phone. The `grep` for `nm-` and `seq__` in `e2e/` found only opacity and visibility checks (`e2e/router.spec.ts:129`, `e2e/nat.spec.ts:42`, `e2e/tcp-udp.spec.ts:34`) and Sequence switch checks (`e2e/lesson.spec.ts:204-215`).
- The font-size checks in `e2e/site.spec.ts:2472-2560` are on Home's demo (`.demo__scene`, B20), not on a lesson.
- `e2e/reading.spec.ts:151` checks the Practice marks at 11.2px (not a figure).

## Part 4: Subnetting's bits board (Q4)

**Where it is.** The board is `src/lesson/panels/BitsBoard.tsx` (253 lines; its root `<div className="bits">` at :174, a `<table className="bits__table">` at :175). Styles are `src/lesson/panels/bits.css` (298 lines). It is chosen by `UnitPanel.tsx` (`BitsBoard` import at :4, used for `panel.type === 'bits'`). The lessons that declare `panel: { type: 'bits' }` are `src/content/lessons/subnetting.ts:204` and `src/content/lessons/ip-address.ts` (the grep of `panel:` shows `type: 'bits'` for both; the ip-address line was matched but not shown in full).

**On a phone.** The Bits tab is the fourth tab (`src/lesson/LessonConsole.tsx:38`, `bits: 'Bits'`). It fills the band under the tabs (`console.css:1711-1718`) and is shown only when its tab is pressed (`console.css:1720-1722`). Its visibility, and the rest of the tab rules, are in Part 2.

**`panelChange` never marks bits.** `src/lesson/LessonConsole.tsx:40-44` is the doc comment: "The bits board never changes it: its tab is not marked." The function `panelChange` (:45-56) handles only `table` (:48) and `rules` (:49-52); any other type reaches `return false` (:53). So the Bits tab never shows the `tab__mark` change square (`LessonConsole.tsx:294-300`, `console.css:1477` region).

**What was approved, and whether it is built.**

- `docs/direction.md:87` (decision 2.60, owner, 2026-11-15): "The owner approved D12 … with variant B of §2.1 (the bits board fitted under 640px, Subnetting's phone board with it, its marigold line checked at 375 by the build's reviewer)". The design is in `prototypes/d12-batch-2.md:52-54` ("**B. Fitted (recommended).** Under 640px each row becomes two lines: the label at the left and the address at the right, then the 32 bits in 8px cells … 302px") and `prototypes/d12-batch-2.md:244` ("Under 640px: the fitted bits board (variant B)").
- Built. `src/lesson/panels/bits.css:204-211`: the comment says "On a phone (under 640 px) the board fits the screen", and the block is `@media (max-width: 639px)` (:211), with `--bit-w: 8px` (:212-214). Its tbody rows are a grid (:227-235). The commit that built it is `d6714fa` ("feat: the Bits board fits a phone (a segment in each row's bits under 640px)", 2026-11-15 12:16).
- Its test: `e2e/subnetting.spec.ts:106`, "at 375 the Bits tab never scrolls, the line is a segment in each shown row's bits between the right two bits, and the column headers stay". The desktop size is unchanged at 640px and up (`bits.css:26`, `:29`: 94px and 376px columns, 470px total).
- Stale text: `docs/direction.md:274` ("Subnetting's bits board is 470px wide and still scrolls sideways in its tab: fitting it is not built") and `docs/direction.md:300` ("Still to fix in the build: Subnetting's bits board does not fit a phone's width"). Both are in the 2026-11-10 phone section and were not updated by 2.60 or the build.
- Not built: the critique's fix "show the bits under the figure by default on Subnetting" (`.impeccable/critique/2026-11-15T23-18-00Z__src-pages-track-lesson-astro.md`, P1 "The phone figure is illegible…"). The Bits board is still behind its tab, and the tab is not marked (see above).

## Part 5: tests that pin the page (Q5)

Counts are `it(` / `test(` declarations by grep (`^\s*(it|test)(\.each(…))?(\.only|\.skip)?\(`), not run counts. Loops over lessons multiply them at run time.

**Unit tests (Vitest), by folder:**

- `src/lesson/`, root files and the panels' folder: 263 declarations (`src/lesson/panels/` 96 of them).
- Console-rendering files (they render `LessonConsole`): `src/lesson/LessonConsole.test.tsx` 33, `src/lesson/LessonConsole.flow.test.tsx` 30, `src/lesson/LessonConsole.storage.test.tsx` 1: 64 declarations.
- Other root tests in `src/lesson/`: `Explanation.test.tsx` 23, `ScenePanel.test.tsx` 10, `LogPanel.test.tsx` 10, `useLessonShortcuts.test.tsx` 12, `keyboard.test.ts` 16, `announce.test.ts` 8, `Practice.test.tsx` 6, `Outline.test.tsx` 4, `TopBar.test.ts` 4, `sourceNumbers.test.ts` 3, `no-script.test.ts` 2, `definitions.no-script.test.ts` 2, `ScenePanel.packets.test.tsx` 1, `ScenePanel.switch.test.tsx` 1, `placeLabel.test.ts` 1.
- `src/engine/`: 107 declarations (`timeline.test.ts` 40, `playback.test.ts` 24, `tables.test.ts` 22, `net/firewall.test.ts` 8, `net/ipv4.test.ts` 6, `timeline.vpn.test.tsx` 5, `net/subnet.test.ts` 2).
- `src/scenes/`: 274 declarations (`drivers/net-map.test.ts` 53, `drivers/net-map.packets.test.ts` 31, `drivers/dhcp.frames.test.ts` 24, `drivers/pool.test.ts` 25, `drivers/switch.motion.test.ts` 22, `drivers/subnet.test.ts` 14, `drivers/net-map.proxies.test.ts` 13, `drivers/net-map.vpn.test.ts` 13, `drivers/osi.test.ts` 13, `drivers/firewall.test.ts` 12, `motion.test.ts` 12, `drivers/net-map.batch2.test.ts` 9, `drivers/dhcp.test.ts` 9, `drivers/switch.test.ts` 8, `SequenceView.test.tsx` 6, `driver.test.ts` 5, and five files with one or two each).
- Totals: 263 + 107 + 274 = 644 across the three folders (the same grep the orchestrator's brief asks for).

**End-to-end specs that visit a lesson page** (Playwright; `e2e/` has 27 files, one of them `support.ts` with no tests; the `batch1.ts` and `batch2.ts` files declare no tests):

| File | Test declarations | What it covers (from the test titles) |
|---|---|---|
| `e2e/lesson.spec.ts` | 16 (six per lesson, looped over every ready lesson, :69-; plus "lesson specifics" :276-, and "without JavaScript" :418-) | Walk Overview, every step, Learn, Practice; the outline reaches every place; Play all; one screen; the Network/Sequence switch (`NO_SEQUENCE` set, :34); localStorage throwing; canonical URL; reduced motion; DHCP's table focus; OSI's Data Link step; Firewalls' matched row; no-JS message |
| `e2e/controls.spec.ts` | 10 | The row at 1440 (five buttons, orange forward, titles name the keys), replay, reduced motion, the 375 and 1440 phone bar (48px buttons at x 12, 68, 124, 180, 236, :217), a run keeps its places |
| `e2e/reading.spec.ts` | 14 | Learn and Practice fit the window; words column 560px at 1440 and 480px at 1280; Practice's feedback takes no room until a pick and its marks are 11.2px (:143-151); phone one screen; the log folds in Learn and Practice |
| `e2e/tablet.spec.ts` | 21 | 768×1024, 1024×768, 760×1024 and 1100×800 breakpoints; phone layout at 760; stacked page at 1024×599 (:369), and in tests 20 and 21 (:362, :401); test 22 (:383) is one screen for OSI, Subnetting and Firewalls; focus rings on tabs; stamp placement |
| `e2e/subnetting.spec.ts` | 2 | 375: the Bits tab never scrolls, the line is a segment in each row's bits (:106); 1440: the line is where it always was (:152) |
| `e2e/ip-address.spec.ts` | 3 | 375: the Bits tab never scrolls at any step (:7 `WATCH` uses `.bits`); 1440: the board never scrolls and the figure box keeps 396px; the Track page's IP Address spot |
| `e2e/mac-address.spec.ts` | 6 | 375: Table tab never scrolls; 1440: panel fixed, figure box 316px; H10: the frames setup with JS off |
| `e2e/arp.spec.ts` | 3 | 375: the Table tab; 1440: the panel and the run's last row; the Networking track page's ARP spot |
| `e2e/packets.spec.ts` | 5 | 375 and 1440, both themes: no sideways scroll; a parked tag's contrast (4.5:1); Packets has no Switch view |
| `e2e/tcp-udp.spec.ts` | 4 | 375 Table tab; 1440 figure box 346px and the voice plate; Network and Sequence views |
| `e2e/nat.spec.ts` | 7 | 375 Table tab; 1440 phone and stranger on the map; the phone about 17×9px and no overlapping callouts at 375 |
| `e2e/ports.spec.ts` | 4 | 375 Table tab; 1440 map never under 316px tall; the Networking track page's Ports spot |
| `e2e/proxies.spec.ts` | 7 | Proxy and reverse proxy shown at steps 2 to 5, from the outline and the Steps tab; every step in both themes |
| `e2e/router.spec.ts` | 7 | Table tab marked when an event plays under another tab; 375 panel never scrolls; 1440 device names in turn |
| `e2e/load-balancers.spec.ts` | 8 | 1440 stage 733×347 (±4); 375 stage 375×275 (±4); reduced motion ends on Play all |
| `e2e/vpn.spec.ts` | 13 | Every step opened never scrolls sideways at 1440 and 375; 375 Table tab's mark word; the listener's head and body per step |
| `e2e/switch.spec.ts` | 7 | 15a: 375 and 1440, light and dark, every step played, no overlapping callouts; 15c: at 375 the MAC words ≥6.6px and the names ≥6.0px (:90-100); the Track page's switch spot |
| `e2e/visual.spec.ts` | 2 (the `@visual` describe, :54) | Screenshots of each ready lesson at four desktop sizes (1280×800, 1366×768, 1440×900, 1920×1080), both themes, at Overview, step 3, Learn and Practice; written to `test-results/visual/` (:1-12) |
| `e2e/site.spec.ts` | 122 in total | Not read in full: it matches "lesson" 187 times; its B20 blocks (:2472-2560) measure Home's demo, not a lesson |

- `@visual` snapshots: `e2e/visual.spec.ts` is the only spec with the `@visual` tag (`grep -n "@visual" e2e/*.ts`: lines 9 and 54). Run with `npm run e2e:visual`; excluded from `npm run e2e` (`visual.spec.ts:9-10`), and from CI's pass by `--grep-invert @visual` (CLAUDE.md, "Done means verified"). It writes screenshots; it does not compare them.
- `e2e/global-setup.ts`: no fixed lesson list. It goes to `/tracks`, reads `main article.panel h2 a` for the track links, then each track page's ready stops (`global-setup.ts:5-7` comment and `:17-25`), and records the ready lessons in an environment variable (`LESSONS_ENV`, `e2e/support.ts:15`). `readyLessons()` (`support.ts:27`) and `requireLessons()` (:33) read it. So the e2e lesson list depends on the Tracks page and the track pages, not on a named lesson.

## Part 6: what the page shares with other pages (Q6)

- **Layout:** `src/layouts/BaseLayout.astro` (114 lines). The Lesson page passes `chrome={false}` (`[lesson].astro:49`); the layout then renders only `<slot />` (`BaseLayout.astro:100-112`, `chrome ? … : <slot />`), with no `SiteHeader`, `<main id="main">` or `SiteFooter`. The console has its own `<main id="main">` (`LessonConsole.tsx:304`). BaseLayout still loads `global.css` (:2) and `lumen.css` (:3), injects the tokens (`<style is:inline set:html={tokensToCss()} />`, :72), and has the skip link (`BaseLayout.astro:98` region). `BaseLayout.test.ts` is in `src/layouts/` (not read).
- **Header and footer:** `src/components/SiteHeader.astro` (219 lines) and `src/components/SiteFooter.astro` (96 lines) are not rendered on the Lesson page (above). The page's own top bar is `src/lesson/TopBar.tsx` (120 lines), which uses `Stamp` (`src/components/Stamp.tsx`) and `ThemeToggle` (`src/components/ThemeToggle.tsx`) and `LogoMark` (`src/components/LogoMark.tsx`, through `src/lesson/TopBar.tsx:1-7`).
- **`src/styles/tokens.ts`** (155 lines): imported only by `src/layouts/BaseLayout.astro:10` (`tokensToCss`). Other mentions are comments (`src/art/lumen.css:194`, `src/lesson/console.css:9`) and tests (`src/styles/tokens.test.ts`). Token values: `ink: '#2b3238'` (`tokens.ts:71`), `'ink-strong': '#12171b'` (:72), `link: '#1b56b0'` (:81).
- **Where the Lesson page's colours come from:** custom properties. `console.css` uses `var(--ink)`, `var(--card)`, `var(--line)` and others. They come from `tokensToCss()` (inline `<style>` in BaseLayout, :72), from `src/art/lumen.css` (the `:root` and `[data-theme="light"]` blocks at :196-198, which define the figure's `--lit-*`, `--pool*`, `--halo`, and `--fig-bg` is defined in that file too), and from `src/styles/global.css` (the page's ground and `--ink` usage, :59-99).
- **`src/components/hub/hub.css`** (94 lines): not loaded on the Lesson page (imported by `src/pages/[track]/index.astro:21` and `src/pages/tracks.astro:14`). None of its class selectors (`.next`, `.route`, `.stop`, `.strip`, `.wholetrack`, `.wlp`, `.side-now`, …) appear in `src/lesson/` or `src/layouts/` as class names; the grep hits for `next`, `route`, `stop` and `strip` are ordinary words.
- **`.upnext`** is defined in `src/lesson/console.css:967` (and `.upnext__art` 982, `.upnext__text`, `.upnext:focus-visible` 978). The end row uses `className="upnext lift"` (`src/lesson/Explanation.tsx:207`).
- **`.lift`** is defined in `src/components/site.css:224` and `:230` (`.lift:hover`), and `src/components/site.css` is imported by `src/lesson/Explanation.tsx:2`. `hub.css` has a comment about `.lift` (`hub.css:24`, "`.lift` owns its resting shadow and hover").
- **`src/styles/card-stack.css`** (196 lines): imported only by `src/pages/index.astro:21` and `src/pages/tracks.astro:15` (plus a string in `src/lib/home.ts`, which is a comment or a path in the Home code). Its selectors are `:root`, `[data-theme='dark']`, `main .btn`, `#main .lm-svg` (:95, :110), `#main .lm-led.on`, `.cs-card`, `.cs-card--beneath`, `.cs-card--soon`, `.cs-tab`, `.cs-tab--here::before`. The `#main .lm-svg` rule (:95) is scoped under `#main`, and the Lesson page has `<main id="main">` (`LessonConsole.tsx:304`), so it can match the Lesson page's `.lm-svg` figures if the stylesheet were loaded. It is not loaded there (grep above). No `.cs-*` class is used in `src/lesson/` (not separately grepped beyond the import check).
- **`src/components/site.css`** (240 lines) is also imported by the 404, About, Glossary, and Tracks pages, and by `src/pages/[track]/index.astro` (see the grep in Part 1).

## Part 7: the built page's size (Q7)

`dist/` exists at `/Users/naaay/Developer/WebProjects/TechConcept/dist` (mtime Nov 17 10:19). Its build revision is not recorded in the folder, and it was not compared with `aa6d838`. Gzip of each page's `index.html` (`gzip -c | wc -c`):

| Page | Path | Raw bytes | Gzipped bytes |
|---|---|---|---|
| What is DHCP | `dist/how-the-internet-works/what-is-dhcp/index.html` | 1,350,986 | 151,771 |
| Subnetting | `dist/networking/subnetting/index.html` | 382,649 | 69,734 |
| OSI Model | `dist/networking/osi-model/index.html` | 312,343 | 53,662 |

## Part 8: known open faults that concern the Lesson page (Q8)

Sources: `docs/direction.md` (grep for "phone figure", "685", "bits board", "Still to fix", "Not solved", "not built", "deferred", "open question"); `prototypes/s17-lesson-flow-facts.md` Part 1 (lines 1-17); and `.impeccable/critique/2026-11-15T23-18-00Z__src-pages-track-lesson-astro.md`. Job 15 is direction 2.71 and 2.72 (`docs/direction.md:98-99`). Its own deferred list (2.72, the closing block, wrong answer, key line, chips and empty-log words) is marked below. "Open" means the code as read shows it. Nothing here is a judgment on whether it matters.

| # | Fault | Source | Status in the code now |
|---|---|---|---|
| 1 | Autoplay outruns reading (2.6 s hold per step) | critique P1; s17 Part 1 #1; `docs/direction.md:300` region | **Partly fixed by job 15.** A step plays once on arrival and waits (2.72). "Play all" is the explicit run and still uses the 2.6 s hold: `HOLD_MS = 2600` (`src/engine/playback.ts:10`), `playButton` returns "Play all" or "Pause" (:131-133) |
| 2 | Primary button points back: "Replay" / "Watch again", chevron icon-only to Learn | critique P1; s17 #2 | **Fixed by job 15.** Forward button is labelled "Next step" or "Next lesson" (`playback.ts:142-143`; `PlaybackControls.tsx:109-119`, text in `go__label`). Replay is an icon-only "Replay step" (`PlaybackControls.tsx:99-100`). "Watch again" remains only in `src/lib/hub.ts:94-96`, which is the track page's status |
| 3 | Phone figure labels illegible (1.3–7.3px; Sequence about 5px) | critique P1; s17 Part 1 "not in this job" | **Open.** No phone rule changes the map's or the Sequence view's label size (`src/art/scenes/net-map.css`, `src/scenes/sequence.css`, `src/lesson/console.css` have no phone label rule; Part 3). The Switch e2e test checks only the switch figure (`e2e/switch.spec.ts:90-100`) |
| 4 | Subnetting's bits hidden behind a fourth tab that never marks a change | critique P1; s17 Part 1 "not in this job" | **Open** for the tab and the mark: `panelChange` never marks bits (`LessonConsole.tsx:40-56`); the board is under its tab only (`console.css:1720-1722`). The fitting part is **fixed** (`bits.css:204-211`, commit `d6714fa`), see Part 4 |
| 5 | Bits board does not fit a phone; "not built" | `docs/direction.md:274`, `:300` | **Stale text.** Built in `d6714fa` (`bits.css:211`, `e2e/subnetting.spec.ts:106`). The docs still say it is not built |
| 6 | The ending: "That's the whole lesson." small grey text; Practice not ticked; Watch again primary | critique P2; s17 #3; `Explanation.tsx:206` | **Open** (the closing block was deferred, 2.72). The text is at `Explanation.tsx:206`. Outline ticks an item done only when `target < position` (`Outline.tsx:46`), so Practice is "current", not done, at Practice. The primary button no longer says "Watch again" |
| 7 | Wrong answer reads as merely selected | critique P2; s17 #4; `console.css:1089` | **Partly.** A wrong option takes `border-color: var(--ink)` (`console.css:1089-1091`), and its letter `ink-strong` (:1092-1094). The feedback line leads with "Not quite." (`Practice.tsx:16-17`, :27, :86). No icon on the option, and job 15 deferred "wrong answer" (2.72) |
| 8 | Keys are invisible; "Press Play to start." and "Watch › Learn › Practice" | critique heuristics 6 and 10; s17 #5 and Part 2 #3; 2.72 deferred "key line", "chips", "empty-log words" | **Open.** The only key mentions are in `title` attributes: "(Space)" (`PlaybackControls.tsx:85`), "Previous step (←)" (`PlaybackControls.tsx`, the back button's `title`), "Next step (→)" (:111). The idle log line "Press Play to start." (`LessonConsole.tsx:87`) still says Play while the button reads "Play all". The chips are `<p class="explain__flow">` with `<b>` and `<i>›</i>` (`Explanation.tsx:280-290`); they are not buttons |
| 9 | Go deeper closed on reload; no expand-all (up to 7 disclosures) | critique persona "CompTIA candidate" | **Open.** "Go deeper" is `<span>` in the summary (`Explanation.tsx:148`); its closed state on load is in `Explanation.tsx:242`. No expand-all control found (`grep` for "expand" and "open all" in `src/lesson/` found only `aria-expanded`, `Explanation.tsx:340`) |
| 10 | Keyboard: playback controls come after the outline and the whole explanation in tab order | critique persona "Keyboard" | **Open by DOM order.** The page's order is TopBar, Outline, tabs, `<main>` (`LessonConsole.tsx:304`) with ScenePanel, Explanation, and LogPanel, whose `controls` prop is `PlaybackControls` (`LessonConsole.tsx:337`) |
| 11 | Phone: the track and "Lesson N of M" are not shown; "no sign of which lesson of the track" | critique persona "Beginner on a phone" | **Open by code.** On a phone the brand word, the crumbs and the OSI chips are hidden (`console.css:1420-1437`); the top bar keeps the mark, the lesson's name, the step's place and the theme button (`console.css:1408-1437`). The desktop shows the crumbs (`TopBar.tsx`, comment at :46 "10 of 20") |
| 12 | Persona "text replaced every few seconds" | critique persona "Beginner on a phone" | **Changed by job 15.** A step waits for Next step, so the words no longer change on a timer unless Play all is pressed (2.72) |
| 13 | Up next card art is a text placeholder (HTTP) | critique Minor | **Open by code.** `lessonFigure` returns `nameTile(...)` for lessons whose first track is How the Internet Works (`src/lib/figures.ts:32-37`) |
| 14 | Answer feedback 14px under a 16.5px body | critique Minor | **Open by code.** `.practice__feedback` `font: 400 14px/1.5` (`console.css:1098`); `.explain__narr` `font: 400 16.5px/1.65` (`console.css:688`) |
| 15 | Desktop text column about 43 characters per line | critique Minor | Not checked: a measurement in the critique; the code sets the words column at `clamp(348px, 27vw, 392px)` (`console.css:66`) and `max(348px, min(560px, 100% - 496px))` in Learn and Practice (:76-87) |
| 16 | Subnetting's outline overflows on desktop (798 against 794) | critique Minor | Not checked (a measurement in the critique) |
| 17 | "The scene moves up once, by 85px, when the first message opens the log" | `docs/direction.md:300` | Not checked (a layout measurement) |
| 18 | "The scene beside the tabs for a phone on its side" and "the desktop's top bar squeezing the lesson's name at 1100px" | `docs/direction.md:298` ("Not solved here (D3 open questions)") | Not checked here; the tablet e2e test 15 (`e2e/tablet.spec.ts:222`) asserts the name is whole at the widths it lists |
| 19 | The critique's "Questions to consider" (figure advancing while reading; full log for a beginner) | critique "Questions to Consider" | Not facts; listed for completeness. The figure no longer advances on a timer by default (row 1) |

## Part 9: lessons and their scenes (Q9)

- **Lesson files:** 30 (`src/content/lessons/*.ts`, excluding `*.test.ts`). **Pages built:** 34 in `dist/`, one per (track, lesson): 14 under `how-the-internet-works` and 20 under `networking` (`dist/` listing; the track's stops come from `src/content/tracks/how-the-internet-works.ts:22-64` and `src/content/tracks/networking.ts:31-80`). Four slugs appear in both tracks: `what-is-dns`, `what-is-http`, `what-is-https`, `what-is-tls`. One more `dist` entry, `dist/networking/how-the-internet-works/index.html`, is a redirect page ("Redirecting to: /how-the-internet-works"), not a lesson.
- **Pages are built only for available entries** (`src/pages/[track]/[lesson].astro:16-30`).
- **Network map** (`figure: 'net-map'`): 22 lesson files: `arp`, `nat`, `packets`, `ports`, `proxies`, `router`, `tcp-udp`, `vpn`, and the fourteen `what-is-*` lessons for DHCP, DNS, FTP, HTTP, HTTPS, ICMP, IMAP, IP, POP3, SMTP, SSH, TCP, TLS and UDP (`grep "figure:" src/content/lessons/*.ts`).
- **Other figures:** `dhcp` (`dhcp`, `mac-address`), `firewall` (`firewalls`), `subnet` (`ip-address`, `subnetting`), `pool` (`load-balancers`), `osi` (`osi-model`), `switch` (`switch`): 8 files.
- **Fourth phone tab** (from each lesson's `panel: { type }`; `src/lesson/LessonConsole.tsx:38`): `table` on 26 lessons (`arp`, `dhcp`, `load-balancers`, `mac-address`, `nat`, `packets`, `ports`, `proxies`, `router`, `switch`, `tcp-udp`, `vpn`, and the 14 `what-is-*` lessons listed above); `rules` on `firewalls` ("Rules"); `bits` on `ip-address` and `subnetting` ("Bits"); `labels` on `osi-model`, which has no fourth tab (its message strip stays under the scene). Panel declarations: `src/content/lessons/subnetting.ts:204`, `osi-model.ts:136`, `firewalls.ts:170`, `dhcp.ts:186`, `what-is-http.ts:108`.
- **Sequence view** (`views: ['network', 'sequence']`): 17 files: `dhcp`, `firewalls`, `tcp-udp`, and the 14 `what-is-*` lessons for DHCP, DNS, FTP, HTTP, HTTPS, ICMP, IMAP, IP, POP3, SMTP, SSH, TCP, TLS and UDP. The other 13 declare `views: ['network']` (`grep "views:" src/content/lessons/*.ts`). The Network/Sequence switch appears when the unit has more than one view (`ScenePanel.tsx:66` and `:133-141`). The e2e list of lessons without a switch is `NO_SEQUENCE` (`e2e/lesson.spec.ts:34`), which names the same 13 slugs.
- **Lessons with no tab for their panel:** `osi-model` only.
- **Lessons on phones with a Bits tab:** `ip-address`, `subnetting`. **With a Rules tab:** `firewalls`.
