# D10 / B12: the spec review's holes, errata and attack cases (job 11, 2026-11-14)

The reviewer (Opus) read `prototypes/d10-router.md` (approved by the owner, 2026-11-14) and its prototype. The orchestrator ruled each hole; all have one right answer except where noted. These errata bind the builder and the build review; they change no approved look.

## Errata

- **E1 (where marks live).** Candidates, matches and the no-match row are set only for the current step's events, next to the highlight (`src/engine/timeline.ts:233`), never in `applyTableEvent` (`src/engine/tables.ts:42`). Every `match` sets all three afresh (as the prototype, `d10-router.html:3330-3333`); a `replace` clears them; the no-match row only when `key === ''`. `by` goes through `applyTableEvent`, so it carries into later steps.
- **E2 (proof without the lesson).** B12 proves its parts on a fixture: What is IP's lesson with Router's §3 unit swapped in, checked by `checkStructure` (`define.ts:350`) in a new test file that does **not** swap `FIGURE_PARTS`; `deriveState`, `TablePanel` and the net-map driver are driven from the same fixture. Checks that need a page (12, 13, the overlap check in a browser, 22–24, the 375 and 1440 look) go in `e2e/router.spec.ts`, written in B12 and run once `router.ts` exists. The count tests (plan decision 7) move with the lesson too: the B12 builder, continued, runs `e2e/router.spec.ts` and updates the counts after L18-b (unit **B12b** in `plan.md`).
- **E3 (timing order).** The engine's order stays (wait, then apply: `src/scenes/driver.ts:124-127`, `src/engine/playback.ts:160`); the prototype's order (change, then wait) is not drift. The drop mark paints when its play starts; its log row lands 900ms later.
- **E4 (pinned hashes).** `src/art/scenes/net-map.test.ts:23-26,39-40` check the map with the strips, the mark and their wrappers removed against `EXPECTED.svg`, as the trail edge already is; puck tops go in `data.tops` (the prototype's `DATA.tops`) and the data without `tops` is checked against `EXPECTED.data`.
- **E5 (validator).** A `match` needs `key` or `keys` (`define.ts:71`); `checkCues` (`define.ts:168`) rejects `hide` outside the start, `drop` in the start, a message to or from `resolver` while it is hidden, and a second `drop` in one event.
- **E6 (aria-label).** The panel's label is `${title}, ${state.by}` only when `state.by` is set, otherwise the title (as `d10-router.html:3352`); no other lesson's panel is renamed.
- **E7 (the figure's text while the resolver is hidden).** The figure's description (`net-map.ts:361`) drops its sentence about the DNS resolver while the resolver is hidden: text describes what is drawn. Ruled by the orchestrator as one right answer (accessibility), not sent back to the designer; it changes nothing a sighted reader sees.
- **E8 (name).** The new spot's function is `routerSpot` under the key `router` (`spots.ts:32` already has a `router()`).
- **E9 (no script).** Without JavaScript, Router's map shows the start of the net-map figure (the resolver at 192.0.2.53, no strips) and no step plays, so 192.0.2.77 never appears beside it. Accepted.
- **E10 (strip length).** No length limit now; Router's labels are short and the overlap case below covers them. A limit comes with the first lesson that needs longer labels.

## Attack cases (each a test)

**Schema (1–4)**, in `src/content/define.router.test.ts`, with the real parts:
- `by` passes on `replace` and fails on `match`, `add`, `update`.
- `keys` of one item fails; `keys: ['x', 'x']` fails; a `key` not in `keys` fails; a match with neither fails; `key: ''` alone passes.
- A note glyph `dropped` passes; `blocked` fails; `dropped` with no legend entry raises the legend issue (`define.ts:231`).
- `hide resolver` passes; `hide a` fails; `drop resolver` fails; `drop d` passes; `hide` on an event fails; a message to `resolver` while hidden fails; two `drop`s fail.
- The fixture's `checkStructure` returns `[]`.

**Engine and panel (5–13)**, in `tables.test.ts`, `timeline.test.ts`, `TablePanel.test.tsx`:
- The by-line follows the latest `replace`; step 2's start reads "kept by your laptop".
- No by-line, and aria-label "Routing table", before any replace.
- Exactly two `[data-candidate]` after the first match; after the second, the winner matched with no tag, the loser with a tag and no candidate mark.
- Step 4's start has no candidate, tag or highlight.
- The no-match row is last, its colspan the column count, gone at the overview; a `keys`-only match shows no no-match row.
- Contrast ≥ 4.5:1 for `--ink-strong` on a 10% `--blocked` mix and for `--blocked` on `--card`, both themes.
- DHCP's and What is IP's rendered panel HTML, with the new fields absent, equals today's.
- (11) Under reduced motion a candidate cell's `animationName` is `none` (e2e).
- (12–13) A `keys`-only match and a `key: ''` match each set "Table, changed" (`LessonConsole.test.tsx`); `scrollWidth ≤ clientWidth` at 375 (`e2e/router.spec.ts`).

**Figure (14–19)**, in `src/scenes/drivers/net-map.test.ts`, a Router run added to `scenarios()`:
- Play and show give the same result under full and reduced motion, the drop note and the ICMP message after it included.
- `#nm-discard` stays at opacity 1 during the ICMP ride (`clear()` does not reset it).
- A hidden-resolver start, then an empty start, removes `data-hidden`; labels then none hide the strips again.
- Strip and mark boxes, from attributes, do not overlap; the mark sits at (214.7, 108.3); `drop zz` throws.
- What is IP's view shows no strip and no `data-hidden`; Home's still copy shows neither (`src/lib/home.test.ts`).
- The viewBox stays `-98 -60 685 378` (`net-map.test.ts:48`).

**Timing (20–21):** `duration` is 600 for a replace, 900 for a match, 900 for a note with `drop`, 0 for a note without, 0 for add and update (the 14 net-map lessons keep their timing); at 2× the wait is 300 or 450; candidates are on screen ≥ 900ms.

**Log (22–23):** a note with glyph `dropped` draws `data-glyph="dropped"` (`LogPanel.test.tsx`); `LogRow.glyph` (`timeline.ts:117`) takes it.

**Card (24–25):** `spot('router')` pinned in `figures.test.ts:62` with its aria text from §6; exactly two `lm-led on` and one `data-lit`; `lessonFigure({ slug: 'router' })` does not throw. The track page, Tracks page and next-lesson card are checked in B12b.

**Unchanged:** `reports.unchanged.test.ts` passes with no edit (no new optional field gets a `.default()`, so no checked lesson's claim-sheet hash moves); `e2e/site.spec.ts:1218-1299` passes; `npm run build` passes `check-budgets`, each net-map page's growth reported.

## Erratum after the read before the check (L18-p)

- **E11 (a table cell's words).** Step 3's provider-router row reads "directly (link to your router)", not the spec's "directly (customers)": no Learn part states "customers", and the cell traces to `fact-home`. The spec's words were the outline's placeholders (§7 says the author writes the lesson's own); the row, its place and its look are unchanged. Ruled by the orchestrator, 2026-11-14 (L18-p ruling 6).
