# B34: spec review (job 28), holes and attack cases

Reviewer, 2026-11-20, from plan.md "Job 28" at f31e3bd and the trial in `.superpowers/wt/diag28` (246e33a + `trial-0s.diff`).
Commands assume the B34 worktree and `E2E_PORT=4521`; "0.01ms back" means `src/styles/global.css`'s reduced-motion
`transition-duration` set back to `0.01ms !important` for the check only, then restored.

## Holes (worst first)

H1. `npm test` cannot pass with any change to `global.css`. Three unit guards assert `git diff --name-only <base> -- ... src/styles/global.css ...` is empty:
    `src/lib/glossary-page.test.ts:282` (base f30e876), `src/lib/not-found-page.test.ts:58` (base 1d8e446), `src/scripts/about-page.test.ts:269` (f30e876).
    Measured on the trial: `npx vitest run` on those files: 3 failed, 64 passed. The plan names neither these files nor how they change.
    Answer (one, by precedent): job 24's grant pattern (`src/lib/card-stack-guards.ts` `tracksGrant`/`TRACKS_GRANT`): take
    `src/styles/global.css` out of the three name-only lists and add one `globalGrant(base)` that allows exactly the
    one changed declaration (`-    transition-duration: 0.01ms !important;` / `+    transition-duration: 0s !important;`)
    plus comment-only lines, used by all three. Not acceptable: dropping global.css from the lists with no grant (see case 3).
H2. The Tracks probe guards nothing unless it sets reduced motion itself. `.upnext__n` has no transition of its own
    (`src/pages/tracks.astro:230-258`); only the reduced-motion rule makes one. `tracks-card-stack.spec.ts` runs in every
    desktop project, and CI's pass (`d1440-dark`) never emulates reduce, so a probe without its own `reducedMotion: 'reduce'`
    is green there whatever global.css says. Answer: the probe sets `reducedMotion: 'reduce'` (test.use or
    `emulateMedia` before the first load), as tablet.spec's `openAt` does; its red check names the project it ran in.
H3. `vpn.spec.ts:116-117` does not pin `1e-05s`: it asserts `parseFloat(d) < 0.001`, which `1e-05s` passes too, so
    "1e-05s becomes 0s" there has nothing to change and the test would not see a revert. Its comment is also wrong today
    ("0.00001ms"; the rule says 0.01ms). Answer: assert each duration `=== '0s'` and reword the comment; red with 0.01ms back.
H4. `glossary.spec.ts:937-938`: the comment's reason ("every change runs a 0.01ms transition") is the reason for the
    `running` gate that skips two `getAnimations().length === 0` reads in the `reduced-motion` project. Rewording the
    comment alone leaves a gate with no stated reason. Answer measured (see case 27): drop the gate (the reads hold in
    every project; it tightens, not loosens), or keep it with a comment that says why; see case 27 for the run.
H5. The tablet probe's non-vacuity check cannot be "an entry after the turn". Measured on the trial (`diag-0s-trial.log`):
    Table chosen gives no IntersectionObserver entry after the turn at all (the table stays at ratio 1, y 611 -> 488, no
    threshold crossed); Log chosen gives exactly one (`rw 1024, r 1`). Answer: assert the initial entry arrived before the
    turn and that the observed `.tpanel` is still `isConnected` and the same node as `document.querySelector('.tpanel')`
    after the turn; for Log, additionally one entry at width 1024 with ratio 1.
H6. Where the cases live: plan.md's B34 row says `prototypes/b34-cases.md`; CLAUDE.md says, for a unit with no prototype,
    under the unit in plan.md; the brief said `.superpowers/job28/b34-cases.md` (git-ignored). Answer: the orchestrator's
    erratum; this file is the brief's path. If they must be tracked, copy into plan.md under B34 (CLAUDE.md's rule).
H7. Which project each red/green check runs in is not stated. Answer: case 18 and the tablet probe: `--project=tablet`
    (its `openAt` sets reduce; the `reduced-motion` project ignores tablet.spec). `:371` and the Tracks probe:
    `--project=reduced-motion` (and the probe also red in `d1440-dark` once H2 is closed).

## Attack cases

### Decision 1: the rule in global.css

1. The one declaration changes, nothing else in the block. Right build: `transition-duration: 0s !important;` in the
   `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { ... } }` block; `animation-duration: 0.01ms`,
   `animation-iteration-count: 1`, `scroll-behavior: auto` (all `!important`) and the selectors as they were.
   Check: `git diff revamp -- src/styles/global.css` shows one `-`/`+` declaration pair and comment lines only.
2. Nearest wrong rule that looks right: `transition: none !important` (computes duration `0s`, so every e2e duration pin
   passes) or the declaration moved outside the media query (kills every transition with motion on).
   Check: the unit test (case 13) is red on each; with it outside the query, `site-chrome.spec.ts` `61` (no-preference
   expects `'0.08s, 0.08s'` / `'0.12s, 0.15s'`) is red in `d1440-dark`.
3. The guards stay guards (H1). Right build: the three unit guards pass with B34's change and go red on any other.
   Check: with B34's change only, `npx vitest run src/lib/glossary-page.test.ts src/lib/not-found-page.test.ts src/scripts/about-page.test.ts` green;
   add an unrelated rule to global.css (e.g. `.skip-link { top: 1px; }`) or change `animation-duration` -> all three red.
4. The comment says why: a 0.01ms transition paints its start value for a frame; 0s makes none. Check: read it; it
   names no line numbers of other files (they move).
5. Nothing in the page waits on a transition. Measured: no `transitionend`/`transitionrun`/`transitionstart`/
   `animationend`/`getAnimations`/`transition-delay`/`allow-discrete`/`@starting-style`/view transitions in `src` or
   `public`; no shorthand with a delay. Check: `grep -rnE "transition(end|run|start)|animationend|getAnimations|transition-delay|allow-discrete|starting-style|startViewTransition" src public` prints test files only.
   (A delay would matter: with 0s duration a nonzero delay still creates a transition.)
6. Motion on is untouched. Check: `site-chrome.spec.ts:487` and `:1288-1289` keep `'0.08s, 0.08s'` / `'0.12s, 0.15s'`
   for no-preference, and `npx playwright test --grep-invert @visual --project=d1440-dark --project=phone` green.

### Decision 2: the specs that pin the old duration

7. `not-found.spec.ts:884`: `every((d) => d === '0s')`. Check: red with 0.01ms back (project `d1440-dark` is enough: the test emulates reduce itself).
8. `site-chrome.spec.ts:487` (`reduced()` true -> `'0s'`): Check: `--project=reduced-motion -g "<that test's title>"` red with 0.01ms back.
9. `site-chrome.spec.ts:1288-1289`: `'0s'` for `start` and `theme` under reduce. Check: red with 0.01ms back in `d1440-dark`.
10. `vpn.spec.ts:113-117` (H3): exact `'0s'`. Wrong build: keeps `parseFloat(d) < 0.001` and only rewrites the comment.
    Check: red with 0.01ms back.
11. No stale duration words left. Check: `grep -rnE "0\.01 ?ms|1e-05|0\.00001|frame at a time" e2e src --include=*.ts --include=*.tsx`
    finds nothing about transitions (the `animation-duration` mention in global.css itself is the only 0.01ms allowed).
    Reworded: `about.spec.ts:150`, `lesson-layout-small.spec.ts:565`, `lesson-layout.spec.ts:837`, `glossary.spec.ts:937`,
    `site.spec.ts:1816`, `site-chrome.spec.ts:486`, `vpn.spec.ts:116`.
12. Every `transitionsDone` stays: they also wait in the motion-on projects, where transitions of 80-300ms run.
    Wrong build: deletes them as "no transitions under reduce". Check: `git diff revamp -- e2e | grep -c '^-.*transitionsDone'` is 0.

### Decision 3: the unit test

13. It reads the reduced-motion block of global.css and asserts its `transition-duration` declaration is exactly
    `0s !important`. Check each red: (a) 0.01ms back; (b) 0.01ms back with "0s" written in the block's comment;
    (c) `transition: none !important` in place of the declaration; (d) the right declaration plus a later
    `@media (prefers-reduced-motion: reduce) { * { transition-duration: 0.01ms !important; } }` appended to the file;
    (e) the declaration moved out of the media block. A test like `toMatch(/transition-duration:\s*0/)` passes (a), so it is wrong.
14. It lives in `src/styles/global.test.ts` beside the file's other guards and passes `npx vitest run src/styles/global.test.ts`.

### Decision 3: the tablet probe (beside case 18)

15. Red on the cause, green on the build. Check: `E2E_PORT=4521 npx playwright test e2e/tablet.spec.ts --project=tablet -g "<probe title>" --repeat-each=20 --trace=off --workers=3`:
    green on the build; red 20 of 20 (each theme) with 0.01ms back. Measured on the diag copy: 40 of 40 turns wrong on
    revamp (Table: one entry `r 0.335, y 724`; Log: one entry `r 0.119, y 756`), 0 of 40 on the trial.
16. Thresholds that see the wrong frame. The wrong frames are at ratio 0.119 (Log) and 0.335 (Table); an observer
    with the default threshold `[0]` never fires for them (no crossing of 0) and is green on 0.01ms. Right build: a
    threshold list that includes 1 and values below 0.119 (the diag used `[0, 0.25, 0.5, 0.75, 0.99, 1]`).
    Check: case 15's red, for Log as well as Table.
17. Both choices, both themes. Case 18 turns with Log and with Table; the probe must too, inside the `for theme` loop.
    Wrong build: Table only. Check: with 0.01ms back the failure message names Log as well (Log's wrong frame has the
    table 12% in view).
18. Entries are read after they are delivered. IO callbacks run in a task after the rendering step; a read straight after
    `setViewportSize` (or after one `requestAnimationFrame`) can see no entry yet and be green on 0.01ms.
    Right build: after the turn, `settledFrame` (or poll until the observer has delivered for width 1024) before reading.
    Check: case 15's 20 of 20 red, not fewer.
19. Entries after the turn are told apart by `rootBounds.width === 1024` (or a flag set before `setViewportSize`), not by
    count: the observer's initial entry (Table: `rw 768, r 1`; Log: `rw 0, r 0`, the table hidden) comes before the turn
    and is not a failure. Wrong build: "no entry with r < 1" over all entries is red on the build for Log (initial r 0).
    Check: probe green 20 of 20 on the build with Log.
20. Not vacuous (H5). The probe asserts the initial entry arrived, and after the turn the observed node is still the
    document's `.tpanel` (`isConnected`, same node); for Log, one entry at width 1024 with ratio 1.
    Wrong build: requires an entry after the turn for Table too (measured: none comes, so red on a right build), or
    observes a selector that matches nothing (green always). Check: point the observer at `.tpanel-x` -> red.
21. Case 18 itself is byte-for-byte unchanged (`tablet.spec.ts:289-302` on revamp). Check:
    `git diff revamp -- e2e/tablet.spec.ts` has no `-` line; case 18 at `--repeat-each=20 --trace=off --workers=3` green
    (measured on the trial: 40 of 40) and red on the plan's seed (the sideways rule that lands Explain removed).

### Decision 3: the Tracks probe (beside `:371`)

22. Red on the cause, green on the build, in the project it runs in (H2). Check:
    `npx playwright test e2e/tracks-card-stack.spec.ts --project=reduced-motion -g "<probe title>" --repeat-each=20 --trace=off --workers=3`
    red 20 of 20 with 0.01ms back, green on the build; the same in `--project=d1440-dark` once the probe sets reduce
    itself. Measured on the diag copy: 20 of 20 loads with one or two wrong frames (`fs 14px` at t 38-56ms) on revamp,
    0 of 10 on the trial.
23. The frames are read after the wrong one could have been drawn. The wrong frame is the one after the hydration commit;
    reading the record straight after `toHaveAttribute('data-state', 'done')` can miss it (the case's own read caught it
    9 of 20). Right build: wait (poll until at least ~5 frames with `done`, or `settledFrame`) before reading.
    Check: case 22's 20 of 20.
24. Not vacuous, and not over-strict. Assert at least one frame with `data-state="done"` was recorded (measured 26 to 28
    per load). Do not require an `ahead` frame first: measured, the first frame already showed `done` in 1 of 10 trial
    loads and 2 of 20 revamp loads. Wrong build: a probe that never sees the chip (wrong selector, script added after the
    load) is green. Check: change the probe's selector to `.upnext__nn` -> red.
25. The init script is added before the reseeded load (the second `open`), and reads the card the case reads
    (`main article.panel#how-the-internet-works .upnext__n`). Check: read the code; case 22.
26. `:371` itself is unchanged (`tracks-card-stack.spec.ts:371-418` on revamp). Check: `git diff revamp -- e2e/tracks-card-stack.spec.ts`
    has no `-` line; `:371` at `--repeat-each=20 --trace=off --workers=3 --project=reduced-motion` green (measured on the trial: 20 of 20),
    red on the plan's seed (`.upnext__n[data-state='done'] { font-size: 0 }` removed; the probe is then red too).

### Pages a change to global.css could break under reduced motion (the trial, measured)

27. `glossary.spec.ts:936` with the `running` gate removed (`const running = true`) on the trial:
    `--project=reduced-motion --repeat-each=10 --workers=3`: 10 of 10 green. So H4's answer: drop the gate and say in the
    comment that no transition runs under reduced motion. Check: the same command on the build, 10 of 10; with 0.01ms back
    the "no transition on hover" read goes red in that project (it is the read the gate hid).
28. The whole `reduced-motion` project on the trial (`.superpowers/job28/b34-review-rm-trial.log`, 4 workers, 22.7 min):
    1120 passed, 151 skipped, 3 failed, each one of the pins of decision 2 and nothing else:
    `not-found.spec.ts:857` (53, the `1e-05s` at :884), `site-chrome.spec.ts:449` (27, 28, `'1e-05s'` at :487),
    `site-chrome.spec.ts:1273` (61, `'1e-05s'` at :1288). `vpn.spec.ts` 32 passed on both values (H3).
    Check: the build runs the whole project once and gets 0 failed; any other failure is new and comes back.
29. Reads that relied on a frame of the old value, or on a transition existing: none in `src` (case 5); in `e2e` only the
    glossary gate (case 27). The `tl-fill` reads (`lesson-layout.spec.ts:369`, `controls.spec.ts:186`) are animations,
    untouched (animation-duration stays). Check: those specs green in `reduced-motion` (they were in case 28).
30. The other reduced-motion readers: the `tablet` project (every `openAt` emulates reduce) and `phone`. Check:
    `--project=tablet` and `--project=phone` green on the build; case 18 at `--repeat-each=20` green (case 21).
31. The unit suite. Check: `npm test` green (H1 closed), `npm run build` green.

## Notes (nothing for B34 to change)

- The track page's chip (`src/pages/[track]/index.astro:251`, the same `font-size: 0` done chip) painted the same late
  frame under reduced motion; the rule fixes it there too, untested.
- CI's end-to-end pass (`d1440-dark`, `phone`) runs neither case 18 (tablet.spec is ignored there) nor the
  `reduced-motion` project; only a probe that sets reduce itself (H2) is guarded in CI.
