# B32 spec review: holes and attack cases

Reviewer (Opus), 2026-11-19, on `revamp` c63d650. Spec: `plan.md` Job 26, "What the diagnosis found" (20c), decision 2, the B32 row.
Read: `src/lesson/ScenePanel.tsx`, `src/lesson/ScenePanel*.test.tsx`, `src/engine/playback.ts` (usePlayback), `src/scenes/motion.ts`,
the drivers' `show`/`play` (`src/scenes/drivers/*.ts`), `e2e/proxies.spec.ts:151`, `playwright.config.ts`, `.superpowers/job26/diag-*`.
React 19.3.1 (no StrictMode anywhere in `src`; Testing Library's `reactStrictMode` is off; React 19 has no server warning for `useLayoutEffect`,
and `SequenceView.tsx:128`, `PlaybackControls.tsx:65` already use it in the same island).

Facts the holes rest on (read from `node_modules/react-dom/cjs/react-dom-client.development.js:20016`):
- A Sync-lane commit (a click, a key: discrete) flushes its passive effects synchronously at the end of the commit, before paint.
  So a click on Next, a step in the list or a shortcut was already gap-free; only a timer's update (Play all's `tick`/`holdDone`, Default lane) had the gap.
- `act()` (Testing Library's `render`/`rerender`) flushes passive effects before it returns. So a unit test that renders, then asserts `show` was called,
  passes with `useEffect` too: it cannot fail.

## Holes

### H1. The unit test "that the figure is shown in the commit" has no method, and the obvious ones cannot fail (worst)

The B32 row asks for it without saying how. `render`/`rerender` run inside `act()`, which flushes passive effects before returning, and a
`userEvent.click` is a Sync-lane commit, whose passive effects React flushes before paint anyway. So "rerender, then expect `show` called"
or "click, then expect `show` called" is green with `useEffect`: it cannot go red against the seed.
**One right answer (measured):** a probe in the same commit. A wrapper (or a later sibling) with a `useLayoutEffect` and no deps records
`driver.show` and `driver.play` call counts each time it runs; ancestors' and later siblings' layout effects run after ScenePanel's, before
any passive effect. Assert the counts after the mount (`show` 1, `play` 1 at a `step` state) and after a rerender to the next step (`show` 2,
`play` 2). Measured in a throwaway copy: green with both effects `useLayoutEffect`; red with both back to `useEffect`; red with only the
show/play effect back. Put it in `src/lesson/ScenePanel.test.tsx` (its fake driver is already there).

### H2. The seed's red on 20c is a chance, not a proof

On the seed (today's `revamp`), 20c fails only when a frame happens to be painted inside the gap: job 25 saw 1 of 10
(`.superpowers/job25/f25-proxies-base.log`), the diagnosis 6 of 48 first frames at six workers. At three workers and 20 repeats
a red is likely but not certain. **Measured** (this review, port 4512, 20c and the diag together, `--repeat-each=20 --trace=off --workers=3`, d1440-dark, `b32-spec-seed.log`): 20c red 2 of 20 on the seed, so a seed run of 20 stays all green about one time in eight (0.9^20). A seed run that comes back green would not mean the build is unproven, and a builder
should not loop on it.
**One right answer:** the seed's required reds are the deterministic ones: H1's probe test, and the diag spec's GAPS (below). 20c on the seed
at `--repeat-each=20 --trace=off --workers=3` is run once and its count reported as measured, red or not; it is not a pass condition.

### H3. "The diag spec's gap 0" is not a check as written

`.superpowers/job26/diag-20c.spec.ts` ends `expect(true).toBe(true)`: it always passes. It imports `./batch1` and `./support`, so it
runs only when copied into `e2e/` (the diagnosis ran it as `e2e/zz-diag.spec.ts`), and it must not be committed. Its "gap" is milliseconds
from the words' mutation to the map's next one, per step change; step 1 is 0 on the seed too (the Play click is a Sync-lane commit), and the
trial measured 0.1 ms at step 5, so "0" read literally fails a right build.
**One right answer:** copy it to `e2e/zz-diag.spec.ts`, run `--repeat-each=12 --trace=off --workers=3 --project=d1440-dark`, delete the copy.
Build: in every run, no GAPS entry has `!` (a frame painted between) and every entry is ≤ 1.0 ms. Seed: entries for steps 2 to 5 are ≥ 5 ms
in every run. **Measured:** seed 80 of 80 entries for steps 2 to 5 between 10.1 and 28.0 ms, 10 with `!`; trial (both effects `useLayoutEffect`)
100 of 100 entries ≤ 0.1 ms, none with `!` (`b32-spec-trial.log`, `b32-spec-seed.log`). Report the GAPS lines.

### H4. "Every lesson's spec at d1440-dark" names no files, and leaves out the reduced-motion project

The change moves every Play all's first frame on every lesson, with motion and without. Under reduced motion `animate` jumps to `frame(1)`
inside `play` (`src/scenes/motion.ts:46`), so the first event's end now lands in the step's first painted frame. Playback behaviour is checked
in d1440-dark **and** reduced-motion (`e2e/lesson.spec.ts:43-45`), and `lesson.spec.ts` has a reduced-motion-only timing test.
**Measured on the trial** (both effects `useLayoutEffect`, this review): the list below at d1440-dark, 439 passed, 1 skipped, 0 failed
(12.2 min, `b32-spec-lessons.log`); `lesson.spec.ts` at reduced-motion, 213 passed (8.1 min, `b32-spec-rm.log`). So a right build is not
held up by these; the hole is only that the check must name them.
**One right answer:** at d1440-dark, `arp ip-address load-balancers mac-address nat packets ports proxies router subnetting switch tcp-udp vpn
lesson controls lesson-layout lesson-layout-small reading figure-floor` (`e2e/<name>.spec.ts`); and `e2e/lesson.spec.ts` at
`--project=reduced-motion`. Report the counts as they are.

## Attack cases

Each: the setup, and what a right build does. "Seed" = the build with the named effect(s) back to `useEffect`.

### The unit test: the figure is shown in the commit (H1)

- **A1. Mount.** A wrapper renders ScenePanel at `at(1, 0, 'step')` and records, in its own `useLayoutEffect`, the fake driver's `show` and
  `play` call counts. Right build: `create` 1, `show` 1, `play` 1 at that moment. Seed (both): 0 and 0. (Measured: red on the seed.)
- **A2. A timer's step change.** Same wrapper, `rerender` to `at(2, 0, 'step')` (a Default-lane update, as Play all's `holdDone` is).
  Right build: the wrapper's layout effect sees `show` 2, `play` 2, and the first play's signal already aborted. Seed: 1 and 1.
- **A3. Half the seed: only the show/play effect back to `useEffect`.** A1/A2 go red (measured). A test that only checks the driver is made
  in the commit lets this through.
- **A4. The other half: only the driver's effect back to `useEffect`.** At mount the play effect runs with `driver.current === null`, so
  nothing is shown or played until some dependency changes. Right build: A1 holds. Measured: 7 of the 10 existing tests in `ScenePanel.test.tsx` go red too. (A3's half, by contrast, leaves all 10 green: only the probe catches it.)
- **A5. Order swapped: both `useLayoutEffect`, the show/play effect declared first.** New figure data: the play effect's cleanup, then the
  driver's, then the play effect runs with no driver, and the new driver never shows. Right build: `['abort', 'destroy', 'create', 'show']`
  (the existing "new figure data" test). Measured: 7 existing tests red on this seed; keep them as they are.

### The contract ScenePanel already keeps (its existing tests stay green, unchanged)

- **A6. Same state again** (`rerender` with an equal `PlaybackState` object): no `show`, no `play`.
- **A7. Leaving the page mid-play:** the play's signal aborts before `destroy` (`['abort', 'destroy']`). With layout effects the cleanup now
  runs before the figure's DOM is removed; every driver's `destroy` is empty today, so nothing reads a detached node.
- **A8. New figure data mid-play:** `['abort', 'destroy', 'create', 'show']`, one play in all (no replay), the new driver made on the same svg.
- **A9. Sequence view:** switching to Sequence aborts the play; a tick while Sequence is up neither shows nor plays; back on Network,
  exactly one `show` of the state as it stands and no replay; the next event plays.
- **A10. Marks (Firewalls):** marks reported during the play reach the panel; the rerender that applies the event hands the panel `[]`
  in every render since; a late `onMark` from the aborted play changes nothing. The layout cleanup's `setMarks(NO_MARKS)` now re-renders
  inside the commit; with marks already `NO_MARKS` React bails out, so no extra `UnitPanel` render with stale marks may appear.
- **A11. A new speed** restarts the play with the new speed; **reduced motion** reaches `play` as `reducedMotion: true`.
- **A12. A driver whose play throws or rejects** is caught and the panel carries on (the error now surfaces inside the commit; it must
  still not reach an error boundary).

### 20c at `--repeat-each=20 --trace=off --workers=3`, d1440-dark, green; `e2e/proxies.spec.ts` unchanged

- **A13.** `git diff revamp -- e2e/` is empty after the build (20c is not loosened, re-timed or retried).
- **A14.** 20 of 20 green on the build. Measured on the trial: 20 of 20 green (with the diag's 20 alongside, 40 passed in 4.3 min). Any red is a fail, not a flake to re-run.

### The seed red (H2)

- **A15.** The seed: both effects back to `useEffect`, nothing else. A1 and A2 red; the diag's GAPS for steps 2 to 5 ≥ 5 ms in every run;
  20c's count on the seed reported. The seed is not kept.

### The diag's gap (H3)

- **A16.** Build: 12 runs, no `!` anywhere, every gap ≤ 1.0 ms, step 1 included. A build that moves only `show` into the commit and leaves
  `play` passive still passes the gap (the map's first mutation is `show`'s) but fails A1/A2: both checks are needed.

### Every lesson's spec (H4)

- **A17. The play now leads the wait.** `usePlayback`'s timer stays a passive effect (`src/engine/playback.ts:252`); the play starts in the
  commit, the wait one passive flush later (11 to 31 ms under load). A play that runs to its own end (net-map's `clear()` after the rest,
  `src/scenes/drivers/net-map.ts:741`) now ends before the tick more often. Right build: every lesson spec at d1440-dark green, in particular
  the samplers that watch a play: `e2e/batch1.ts`'s watch, `load-balancers.spec.ts`'s `watchUnhealthy`, `vpn.spec.ts`'s lock.
  Measured green on the trial (H4). Every driver's play ends on the event's landed picture, the state reduced motion already reaches early,
  so the earlier end is by design; moving the wait as well (`playback.ts`) is outside B32 and not needed.
- **A18. Reduced motion.** `e2e/lesson.spec.ts --project=reduced-motion` green, its timing test included (the waits are unchanged).
- **A19. A click is unchanged.** Next, a step in the list, a shortcut: Sync-lane commits whose passive effects already ran before paint;
  `controls.spec.ts` and `lesson-layout.spec.ts` green.
- **A20. JavaScript off and the server render.** The server does not run layout effects: the built HTML of a lesson matches
  `revamp`'s once asset file names (their content hashes, which change with the island's code) are masked (compare `dist/networking/proxies/index.html`), `npm run build` prints no new warning, and the proxies "without JavaScript" test
  is green.
- **A21. Hydration.** The driver is made and `show` runs in the hydration commit: opening any lesson shows no console error
  (every lesson spec's `collectErrors` stays `[]`).

### Scope and words

- **A22.** The diff touches `src/lesson/ScenePanel.tsx` and `src/lesson/ScenePanel*.test.tsx` only.
- **A23.** The comment at `ScenePanel.tsx:79` ("React runs this effect's cleanup before the play effect's") stays true and names layout
  effects; a comment at the effects says why they are layout effects (the words and the figure in one frame during Play all), so a later
  tidy-up does not turn them back.

## Notes (nothing in B32 changes)

- The same one-frame lag remains in other passive effects during Play all: the log's scroll to its last row (`src/lesson/LogPanel.tsx:140`),
  the explanation's scroll to top on a new step (`src/lesson/Explanation.tsx:257`), and the guide table's row into view
  (`src/lesson/LessonConsole.tsx:190`). No spec samples them; a later unit could.
- No `StrictMode` anywhere; if one is added, the double mount runs both layout effects' cleanups in declaration order, and `playedFor`
  keeps the second mount from replaying.
- The unit suite on the trial: 174 files, 2572 tests, all green (`npx vitest run --maxWorkers=3`, 88 s): no existing test leans on passive
  timing, and none can tell the two apart, which is why H1's probe is needed.
- `show` forces a layout (`getBoundingClientRect`) in every driver. In the commit it now runs before the words' first paint instead of
  after: for a click nothing moves (its passive effects already ran in the same task); for a timer's tick the words paint at most `show`'s
  time later, together with the figure. Same work, one task instead of two.

Totals: 4 holes, 23 attack cases.
