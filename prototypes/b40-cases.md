# B40: spec review (job 29), holes and attack cases

Reviewer, 2026-11-20, from plan.md "Job 29" (decision 1, the B40 row) at a7985bd, the diagnosis (`.superpowers/job29/diag954-a.log`,
`diag954-b.log`, `.superpowers/wt/diag29/e2e/zz-diag29-954.spec.ts`). Measured in `.superpowers/wt/spec29` with a script that runs the
fixed test's steps (`.superpowers/job29/spec-measure/pd.mjs`, session folder), Chromium, 1440 x 900, reduced motion, on a build that
carries B37's trial (the track page with 12px at the foot; it moves the stop's landing by 6px, 394 -> 388, and nothing else here).

The test is `e2e/track-page-card-stack.spec.ts:954`, "Page Down and Space scroll the window at 1440 x 900, and a focused stop is brought on screen".

## Holes (worst first)

B40-H1. `scrollSettled` can return before a key's scroll has begun. It returns on three equal reads 16ms apart (about 35ms with the
    round trips); in the diagnosis the first frame that moved came 21 to 25ms after the keydown (`diag954-a.log`: keydown 141.4,
    first move 166.3). A build that replaces the `> 300` poll with `scrollSettled` can read 0, 0, 0 and go on with the animation
    still to come: the same fault, rarer. Answer (one): keep each `expect.poll(scrollY).toBeGreaterThan(300)` where it is, and
    add `await scrollSettled(page)` after it (the poll proves the scroll began; the settle that it ended).
B40-H2. "Red on a seed it guards" names no seed. Measured (2 runs each, all red every run; unseeded 0 red of 2, the stop's top at 388):
    (a) Space swallowed: `page.addInitScript(() => addEventListener('keydown', (e) => { if (e.key === ' ') e.preventDefault(); }, true))` -> the second poll times out;
    (b) Page Down swallowed, the same with `'PageDown'` -> the first poll times out;
    (c) the page moves after the focus: `addEventListener('focusin', (e) => { if (e.target.closest?.('li.stop')) requestAnimationFrame(() => scrollBy(0, -600)); })` -> the stop at 988 to 1069, not in view;
    (d) a stop that cannot be wholly in view: `li.stop { padding-bottom: 900px !important }` (`page.addStyleTag` after the load) -> red, so the check keeps `ratio: 1`.
    Seeds that are not red and must not be used as proof: scroll-margin changes on `.stop h3 a` (0; `-200px 0 0`; `24px 0 -400px`; `0 0 1200px`):
    focus still brings the stop in. A `HTMLElement.prototype.focus` patch does nothing: Playwright's `locator.focus()` runs in its own world.
    Answer: (a), (b) and (c), each in a throwaway copy of the test, red at `--repeat-each=3`; the copies are not committed.
B40-H3. Workers. The B40 row says `--repeat-each=30 --workers=4`; this session's brief caps the machine at three workers while
    another session runs the full suite. Answer: `--workers=3` while that run lasts (90 runs a project, as many as planned).
B40-H4. `scrollSettled` is not imported by the spec today (imports at `track-page-card-stack.spec.ts:6`: `hydrated, open,
    readyLessons, requireLessons, settledFrame, transitionsDone`). Import it from `./support`; `e2e/support.ts` is not changed
    (it is in `not-found-page.test.ts:58`'s untouched list: a change there turns `npm test` red).

## Attack cases

1. The fixed order, nothing else changed in what is checked:
   `PageDown` -> poll `> 300` -> `scrollSettled` -> `scrollTo(0, 0)` -> `settle` (and `scrollSettled`) -> `Space` -> poll `> 300` ->
   `scrollSettled` -> focus the Load Balancers stop's `h3 a` -> `settle` -> `toBeInViewport({ ratio: 1 })` on the `li.stop`.
   Check: `git diff revamp -- e2e/track-page-card-stack.spec.ts` touches only that test and the import line; it removes no `expect(`.
2. The window is at 0 before Space. Right build: after `scrollTo(0, 0)` and the settle, the window's `scrollY` is 0, so the second
   poll can only pass on Space's own scroll. Measured with the fix: 0 every run (as written it read 127 in `diag954-a.log`: what was
   left of Page Down's animation). Recommended: `expect(await page.evaluate(() => scrollY)).toBe(0)` before Space (an added check
   that cannot fail on a right page).
3. Not a fixed wait. Wrong build: `waitForTimeout(200)` in place of `scrollSettled`. Check: `grep -n waitForTimeout` in the test's body prints nothing.
4. Seeds (H2 a, b, c): each red in `reduced-motion` and in `d1440-dark`.
5. Green where it flaked: `E2E_PORT=4536 npx playwright test e2e/track-page-card-stack.spec.ts -g "Page Down and Space" --project=reduced-motion --project=d1440-dark --repeat-each=30 --workers=3`: 60 passed, 0 flaky
   (the as-written test failed 1 in 20, `diag954-b.log`).
6. The whole spec once at `reduced-motion`: `E2E_PORT=4536 npx playwright test e2e/track-page-card-stack.spec.ts --project=reduced-motion --workers=3`, 0 failed.
7. The page is unchanged: `git diff revamp...job29/b40 --name-only` lists the spec alone (and the unit's report). `npm test` green.
8. B37 lands first or after: the check does not pin the stop's top (394 on revamp, 388 with B37's 12px at the track page's foot);
   it asserts only that the stop is wholly in view. A build that adds `expect(top).toBe(394)` goes red on B37's merge.
