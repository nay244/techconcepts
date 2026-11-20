# B33 spec review: holes and attack cases

Reviewer (Opus), 2026-11-20, on `revamp` 0a636f0 (React 19.3.1, jsdom 30). Spec: `plan.md` Job 27, decisions 1, 2 and 4, the B33 row.
The reviewer built a trial to the letter of the decisions (the three effects `useLayoutEffect`; the guide's effect moved into `ScenePanel` as a
dependency-free `useLayoutEffect` guarded by `panelHome !== null`) and a probe file of nine tests. Both are kept, git-ignored, in
`.superpowers/job27/` (`b33-trial.diff`, `b33probe.test.tsx`). On the trial: `npx vitest run --maxWorkers=3` 2,578 passed; `diag-27` at 1440 and
390 and `diag-27b`, three repeats each, 0 wrong for every effect, Firewalls 0 frames out of view (was 47 in 3 of 3); the `phone` project green.

Facts the cases rest on: a click or a key is a Sync-lane commit, whose passive effects React flushes before paint, so only a timer's update
(Play all's `tick`/`holdDone`) has the gap; `render`/`rerender` run inside `act()`, which flushes passive effects, so "rerender, then assert"
passes either way. `<Profiler onRender>` is called in the commit's layout phase: after every layout effect in its subtree and before any passive
effect, for any commit in the subtree.

## Holes, closed as errata (plan.md, "B33's spec review")

- **H1 → E11.** B32's sibling probe sees only updates made from the top. The Table tab's effect runs on the console's own playback state, the
  guide's (moved) on `ScenePanel`'s own `setMarks`: a sibling never re-renders, and a probe inside runs before its ancestor's effect. Probes:
  P1 (log) and P2 (explanation) a later sibling; P3 (Table tab) and P4b (guide, timer tick) `<Profiler>` around `LessonConsole`; P4a (guide,
  marks) `<Profiler>` around `ScenePanel`, reading the DOM in `onRender`. Each single seed turns only its own probe red (measured); P4a is the
  one that proves the move (red with the effect left in `LessonConsole`, passive or layout, or in `ScenePanel` with deps `[panelHome, derived]`).
- **H2 → E12.** jsdom stubs, or every probe passes on the seed: `scrollHeight` (`vi.spyOn(Element.prototype, 'scrollHeight', 'get')`,
  100 × rows) with `scrollTop` set to 0 before the rerender; the explanation's `scrollTop` set to 300 before; `Element.prototype.scrollIntoView =
  vi.fn()` assigned and deleted after (`restoreAllMocks` does not remove it); `getBoundingClientRect` stubbed (panel 100–200, body row i at
  240 + 40i minus the panel's `scrollTop`), following `scrollTop` so the dependency-free effect cannot creep; assert "inside the box", not a number.
- **H3 → E13.** The diagnosis's trial left the guide's effect in `LessonConsole` (Firewalls still 47 frames); the move itself is now measured:
  Firewalls 0 frames out of view in 3 of 3.
- **H4 → E14.** `MARKED_ROW` is exported from `ScenePanel.tsx` and imported by `LessonConsole.tsx` for `:151`: one definition, its comment naming
  both uses. (`LessonConsole` imports `ScenePanel`; the other way would be a cycle.)
- **H5 → E15.** The diag specs always pass; "0 wrong" is read from their lines. They import `./batch1` and `./support`: copied to
  `e2e/zz-diag27.spec.ts` and `e2e/zz-diag27b.spec.ts` for the run, deleted after, never committed; `--project=d1440-dark --repeat-each=3
  --trace=off --workers=3`; `diag-27` once plain (1440) and once with `DIAG_SIZE=phone` (390); `diag-27b` sets its own size. Each `RESULT` line:
  `log: 0/N`, `explain: … 0/M`, `guide: 0/K mark changes out of view, 0 frames out of view`; each `RESULT27b` line: `0/N, frames out of view 0`.
  The explanation can fail only at 390 (0 of 6 at 1440 before the fix too).
- **H6 → E16.** "The lesson specs" are B32's E10 list at d1440-dark (`arp ip-address load-balancers mac-address nat packets ports proxies router
  subnetting switch tcp-udp vpn lesson controls lesson-layout lesson-layout-small reading figure-floor`), `lesson.spec.ts` at `reduced-motion`,
  and the `phone` and `tablet` projects (the Table tab works there). `tablet.spec.ts:289` (case 18) is flaky on `revamp` (16 of 110, 15%: its
  `inView('.tpanel')` reads straight after `setViewportSize`; an instrumented copy saw the same unsettled box on seed and trial) and on the trial
  (33 of 140, 24%); its count is reported, not a pass condition.
- **H7 → E17.** Decision 1's sentence on the tab's mark is wrong: the mark is drawn only when `tab !== 'table'` (`:399`) and the effect runs only
  when `tab === 'table'`. The Table tab effect's comment says the row is brought into view in the commit that marks it, nothing about the mark.
- **H8 → E18.** The new effect goes after `ScenePanel`'s play effect (`:105`–`:130`): B32's pair stays together and in order, and the effect's
  layout reads follow `show`'s SVG writes. B32's tests and probe stay green there (measured).
- **H9 (taste, not in B33).** The selector leaves out the rule being read (`[data-state="check"]`): at Firewalls step 2, rule 3 reads "Checking"
  below the guide's edge for about 700 ms at 1× (350 at 2×; from `firewall.ts`'s `READ_MS`, not measured) before "Fits → deny" scrolls it in.
  Should the guide follow the rule being read? Decision 2 keeps the selector; a question for the owner and a later job.

## What the move keeps (reviewer, measured where marked)

`panelHome` is `tableInGuide ? guideTable : null` (`LessonConsole.tsx:385`), so `panelHome !== null` is today's guard. The known chip: the same
selector (measured, Firewalls step 5). Under the scene and labels: `panelHome` null, nothing happens (measured). The bits board: no row, returns.
A deep link: the commit that creates the portal runs the effect after the portal's DOM is in (case 32, load-balancers `?step=2`, 3 of 3 at
d1440-dark, 2 of 2 at reduced-motion). A resize: the media query re-renders the console and so `ScenePanel`. Reduced motion: each mark arrives
after an `await` (`firewall.ts:317`), its own commit. New: the effect also runs on `setMarks` and `setChosen`, so a reader who scrolls the guide's
table by hand during a visit is brought back at each mark, not only at each tick.

For a click or a key nothing changes on screen (passive effects were already flushed before paint); each scroll now runs before that commit's
passive effects (`recordVisit`, `useMediaQuery`), neither of which reads a scroll. The log's fold exists only from 1100px; on a phone the log is
`visibility: hidden` when not its tab (its scroll is kept), and the explanation `display: none` (setting `scrollTop` does nothing either way). The
server runs no layout effect and React 19 does not warn; hydration runs them once (an empty log, the words at their top). `setChangeSeen` in a
layout effect re-renders before paint; the same value bails out, so it cannot loop.

## Attack cases

"Seed" means the named effect back to `useEffect`, or the guide's effect back in `LessonConsole`.

### Check 1: the four probes, red on the seeds and green on the build

- **C1 (P1).** `LogPanel` with a later-sibling probe reading `.log__scroll`'s `scrollTop`, `scrollHeight` stubbed 100 × rows. Mount with 1 row:
  100. Set 0, rerender with 3 rows: 300. Seed: 0. *Measured.*
- **C2.** Same, set 0, rerender with the same 3 rows and `fold.open` true: 300. Seed: 0.
- **C3 (P2).** `Explanation` with a sibling probe. Region `scrollTop` 300, rerender at the next position: 0. Seed: 300. *Measured.*
- **C4 (P3).** `<Profiler>` around `LessonConsole`, `scrollIntoView` stubbed, click Table, Play all on fake timers. At every commit where
  `.tpanel [data-highlight]` changes, `onRender` already sees one more call. Seed: not yet. *Measured.*
- **C5.** In C4, the last call's `this` (`mock.contexts.at(-1)`) is that marked row.
- **C6 (P4a).** `<Profiler>` around `ScenePanel` with the real Firewalls lesson at step 2 and `panelHome` a div in the body. Fire `onMark` for
  check/miss on rows 0 and 1, then check and deny on row 2. At the first commit with `[data-state="deny"]` the row is inside the panel's box.
  Red with today's code, with the effect as `useEffect` in `ScenePanel`, with deps `[panelHome, derived]`, and with a layout effect left in
  `LessonConsole`. *Measured, except the last, which follows (`ScenePanel` then has no effect).*
- **C7 (P4b).** `<Profiler>` around `LessonConsole`, `matchMedia` true for `(min-width: 1100px) and (min-height: 890px)`, Play all on fake
  timers. At every commit where `.guide__table .tpanel [data-highlight]` changes, the row is inside. Seed and a passive `ScenePanel` effect: red.
  *Measured.* (It passes with a layout effect left in `LessonConsole`; C6 catches that.)

### Check 1, continued: what the build keeps

- **C8.** No `panelHome`, the deny row outside the stubbed box: `.rpanel`'s `scrollTop` stays 0, `scrollIntoView` never called. *Measured.*
- **C9.** Firewalls step 5 landed: `.rpanel__chip[data-known]` inside the box in that commit (chip at 400–430 gives `scrollTop` 234). *Measured.*
- **C10.** Panel scrolled to 300 with row 0 marked: `scrollTop` drops until the row's top is 4px below the panel's (stubbed, 136).
- **C11.** A marked row already inside: `scrollTop` unchanged across three rerenders (no 4px creep a render).
- **C12.** Only the panel's own box moves: `window.scrollY` and `.console__guide`'s `scrollTop` unchanged; the guide's effect calls no
  `scrollIntoView`.
- **C13.** Labels (OSI) and bits (Subnetting) in the guide: no row, no throw, no scroll.
- **C14.** A `[data-state="check"]` row out of view does not scroll (the selector is kept; H9).
- **C15.** B32's `ScenePanel` tests unchanged and green: the `show`/`play` order, `['abort','destroy','create','show']` on new figure data, B32's
  probe. The new effect is declared after the play effect.
- **C16.** `MARKED_ROW` defined once, in `ScenePanel.tsx`; `ScenePanel.tsx` does not import `./LessonConsole`; `LessonConsole.tsx` has no
  `getBoundingClientRect`.
- **C17.** Log: rerender with the same row count and a new `fresh` or `idle`: a reader's `scrollTop` of 0 is kept. *Measured.*
- **C18.** Log: the row count drops (a step back): the log is at its bottom in that commit.
- **C19.** Explanation: rerender at the same position (a pick, Go deeper, an event tick): `scrollTop` 300 kept. *Measured.*
- **C20.** Explanation without a `panelRef` (its own ref): reset to 0 in the commit.
- **C21.** Table tab while `tab` is `'explain'`, or `change` null: no `scrollIntoView`.
- **C22.** After the Table tab has seen a change and the reader leaves: no "changed" mark for that change, a mark for the next (existing tests green).

### Check 2: the diag specs (E15)

- **C23.** `diag-27` at 1440, three repeats: every line `log: 0/`, `guide: 0/… 0 frames out of view`; Firewalls 0 frames (was 47). *Measured.*
- **C24.** `diag-27` with `DIAG_SIZE=phone`, three repeats: `log: 0/`, `explain … 0/M` with M > 0 (4 or 5 a lesson). *Measured.*
- **C25.** `diag-27b`, three repeats: `0/N, frames out of view 0` for all seven lessons. *Measured.*

### Check 3: the specs (E16)

- **C26.** E16's list at d1440-dark, `lesson.spec.ts` at reduced-motion, `phone` and `tablet`, counts reported; `lesson-layout.spec.ts` case 32,
  `lesson.spec.ts` "Firewalls: the matched rule row", `reading.spec.ts` "Show log" (`:198`) and `lesson-layout-small.spec.ts` case 47 green.

### Check 4

- **C27.** `npm test` and `npm run build` green.
