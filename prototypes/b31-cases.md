# B31 spec review: holes and attack cases

Unit B31 (job 26, decision 1): `e2e/site-chrome.spec.ts:178` (case 13) takes `test.setTimeout(120_000)` and a comment saying why; nothing it asserts changes. Reviewer (Opus), 2026-11-19, against `revamp` 5a7348e. Measured from a throwaway worktree on port 4509 (`.superpowers/job26/b31-spec-*.log`, `*.json`).

## Facts the cases rest on (read, not assumed)

- Case 13 runs in three projects, not one: `PAGE_PROJECTS = ['d1440-light', 'd1440-dark', 'reduced-motion']` (`site-chrome.spec.ts:14`, skip in `beforeEach` `:29-31`). The budget applies in all three; the full `npm run e2e` (before deploy) runs all three.
- Every `expect` wait in the case is bounded by its own 5s, whatever the test's budget: no `expect.timeout` in `playwright.config.ts`, so `expect.poll` (`transitionsDone`, `support.ts:90`), `toBeVisible`, `toBeHidden`, `toBeFocused`, `toHaveAttribute` (`headerReady`) each fail at 5,000ms (`node_modules/playwright/lib/matchers/expect.js:13178`, `:13392`). A transition that never ends is red in about 5s under 30s or 120s alike.
- Bounded only by the test's budget (no `actionTimeout` or `navigationTimeout` set): `page.goto` (in `open`), `locator('#menu').click()` (`openMenu`, `:51`), `page.evaluate(() => document.fonts.ready)` (`visit`, `:45`), `emulateMedia`, `setViewportSize`, `keyboard.press`. A hang in one of these goes red at 120s instead of 30s, with "Test timeout of 120000ms exceeded" naming the call: slower, still red, not hidden.
- What the larger budget can hide is a slowdown, not a hang: (120 - 27.4) / 56 visits = about 1.65s more per visit (for example the header script taking 3s to label the theme button, or a header transition stretched to 1.5s) passes at 120s and would fail at 30s. Case 13 asserts no duration; `:484` pins Start learning's 0.08s only. This is the cost decision 1 accepts; see H4.
- Job 25's failure (`.superpowers/job25/f25-e2e.log:717-735`): "Expected: 0, Received: 1 ... Test timeout of 30000ms exceeded" inside `transitionsDone` called from `openMenu` (`:183`). Because the poll's own limit is 5s, the poll started with under 5s of the test's 30s left: consistent with a budget, not a stuck transition (a stuck one fails the poll at 5s with "Timeout 5000ms exceeded" and no test-timeout line).
- The open heights come from `src/styles/card-stack.css:307-310` (`.site-head .menu-panel { padding: 8px clamp(...) 18px; }`, comment `:306` "260px; with Start learning 322px"). Case 13's tolerance is 0.5 (`near(..., 0.5, ...)`).

- Measured on `revamp` 5a7348e (port 4509, case 13 unchanged, default 30s): d1440-dark `--repeat-each=20 --trace=off --workers=3` **20 passed**, 25.6 to 26.2s (`b31-spec-base20.log`); the same at `--workers=8 --repeat-each=16`: 16 passed, 25.4 to 25.8s (`b31-spec-base-w8.log`); at 3 workers under 12 busy CPU loops: 6 passed, 25.7 to 25.9s (`b31-spec-base-burn.log`); d1440-light 25.3 and 25.4s, reduced-motion 10.5 and 10.6s (`b31-spec-base-other.log`); d1440-dark at `--timeout=20000`: **red**, "Test timeout of 20000ms exceeded" at `:188` (`b31-spec-base-t20.log`). The time is wall-clock, not CPU: about 15 of the 26s are the header's transitions running in real time (reduced motion cuts them to 0.01ms), so neither more workers nor a busy CPU moves it.

## Holes

**H1. The proof of done cannot fail on `revamp`, so it cannot show the fix.** The B31 check's `--repeat-each=20 --trace=off --workers=3` at d1440-dark is 20 of 20 green on `revamp` without the change (max 26.2s), and stays green at 8 workers and under a busy CPU: the job-25 overrun needs the full run's load, which a one-test repeat does not make. A build that adds nothing, or adds the call where it never runs, passes it. **Answer:** keep it as the no-regression check, and add one that discriminates: `E2E_PORT=4508 npx playwright test e2e/site-chrome.spec.ts:178 --project=d1440-dark --trace=off --timeout=20000` is red on `revamp` (measured: "Test timeout of 20000ms exceeded") and green on the build, because the in-test `test.setTimeout(120_000)` overrides the command line's limit. The builder reports both (red on `revamp`, green on `job26/b31`). That the 120s is enough under the full load is shown only by F26's CI pass; F26 records case 13's duration there (`--reporter=list,json` or the list reporter's line), so the margin is a number and not a pass.

**H2. Where the comment goes is unstated, and one place breaks every citation of the case.** `plan.md:14`, `docs/direction.md` 2.129 and 2.130 and `team.md:1399` cite `site-chrome.spec.ts:178`. A comment above `test('13: …` moves the case to `:179` or `:180`. **Answer:** inside the body: line 178 stays the `test('13: …'` line, the comment on the line(s) straight after it, then `test.setTimeout(120_000);` before the first `for` (the first statement, as at `:297`, `:319`, `:345`, `:708`). The title is unchanged byte for byte (`prototypes/d23-cases.md` 13 cites it).

**H3. "A comment saying why" has no content set, and the plan's numbers are not today's.** The plan says 27.4s alone; measured today 25.3 to 26.2s at 1440 (light and dark), 10.5s under reduced motion. **Answer (facts fixed, words the builder's, one or two `//` lines):** it does 56 visits (two schemes, four widths, seven pages), each opening the menu and closing it with Escape, whose transitions run in real time: about 26s alone, against Playwright's 30s default, which a full run's load overran (job 25). No exact second count past "about 26s"; no word "race" or "flake in `transitionsDone`" (the diagnosis found a budget, not a race).

**H4. Needs taste: what the 120s gives up.** The 30s caught any one-off stall over about 4s; 120s catches only stalls over about 94s in the calls bounded by the test's budget alone (`page.goto`, `#menu` click, `document.fonts.ready`, `emulateMedia`, `setViewportSize`), and lets through up to about 1.65s more per visit spread across all 56. A stuck transition and every `expect` stay red at 5s whatever the budget (facts above). Recommended: accept and record it in the plan's decision 1: case 13 asserts heights, not time; a slowdown on every page would also push cases 12, 14 and 15 (each under the default 30s, fewer visits) and the other budgeted cases; no per-visit guard is added, since that would change what the case checks. The orchestrator's call.

**H5. The proof runs one of the case's three projects.** Case 13 runs in d1440-light, d1440-dark and reduced-motion (`:14`, `:29-31`); the full `npm run e2e` runs all three, and `d23-cases.md` 75 proved this file's waits in d1440-dark and reduced-motion. **Answer:** the builder also runs case 13 once in d1440-light and once in reduced-motion and reports the times (on `revamp`: about 25.4s and 10.6s).

**H6. The seed's place is unstated, and a seed can go red for the wrong reason.** "The header 1px taller open" can be made where it also changes the closed header (then a closed-height check goes red, which case 13 also reads after Escape) or by a slower page (then the red is a timeout). **Answer:** `src/styles/card-stack.css:309`, the panel's bottom padding `18px` to `19px` (open header 392 and 330, panel 323 and 261; closed 69 unchanged). Red must be the first visit's header assertion within seconds: "/ 320 header light: 392 against 391", not "Test timeout". Reverted after; `git diff revamp...job26/b31 -- src` empty.

## Attack cases

### Decision 1: the budget is case 13's own, and nothing it asserts changes

1. **One file, additions only.** `git diff --stat revamp...job26/b31` lists `e2e/site-chrome.spec.ts` alone; `git diff -U0 revamp...job26/b31` has no `-` line, and every `+` line sits between `:178` and the first `for` of case 13. Refuse: any edit to `support.ts`, `playwright.config.ts`, `package.json`, another case, the helpers (`visit`, `openMenu`, `near`), the loops, `SCHEMES`, `SEVEN`, `NO_START`, the widths, the 391/329/322/260/69 numbers or the 0.5 tolerances.
2. **The exact call.** Accept `test.setTimeout(120_000);` only. Refuse the near misses that also make the flake go away: `test.setTimeout(0)` (no limit: a real hang never ends), `test.slow()` (90s, not the decision), `test.setTimeout(testInfo.timeout * 4)` (follows any `--timeout`, so H1's check stays red), `test.describe.configure({ timeout })` or `{ retries }` (reaches every case or hides failures), a config or CLI timeout, `test.fixme`/`skip`.
3. **The call runs before the work.** H1's check: `npx playwright test e2e/site-chrome.spec.ts:178 --project=d1440-dark --trace=off --timeout=20000` red on `revamp` (measured), green on the build. A call placed after the loops, or in a branch that does not run, stays red.
4. **The case keeps its place and name.** `grep -n "test('13: open the header is 391px" e2e/site-chrome.spec.ts` prints `178:`, and the title is byte-identical to `revamp`'s (H2). Refuse: a split into per-scheme or per-width cases (decision 1 rejects it) or a renamed case.
5. **No other case's budget moves.** `grep -n "setTimeout" e2e/site-chrome.spec.ts` gives `revamp`'s seven calls (`:297`, `:319`, `:345`, `:708`, `:959`, `:983`, `:1048`, each shifted by the lines added) plus one at case 13: eight in all.

### The comment says why

6. **True and sufficient.** The comment names the 56 visits (two schemes, four widths, seven pages), the open and Escape at each, the transitions running in real time, about 26s alone against the 30s default, and the full run's load as what overran it (H3). Refuse: a comment that says "race", blames `transitionsDone`, cites 27.4s as today's time, or promises a retry; a comment above line 178 (H2).

### Case 13 alone, its time reported

7. **Alone, three projects.** `E2E_PORT=4508 npx playwright test e2e/site-chrome.spec.ts:178 --project=d1440-dark --project=d1440-light --project=reduced-motion --trace=off` green, each time reported; expected near `revamp`'s 25.7s, 25.4s and 10.6s (H5). A time far above those (say over 35s at 1440 alone) means the build changed the work, not the budget: stop and report.

### `--repeat-each=20 --trace=off --workers=3` at d1440-dark green

8. **Twenty of twenty, with the spread.** `E2E_PORT=4508 npx playwright test e2e/site-chrome.spec.ts:178 --project=d1440-dark --repeat-each=20 --trace=off --workers=3` 20 passed; the report gives the min and max time (on `revamp`: 25.6 to 26.2s, also 20 of 20, so this proves no regression only; H1's check is the one that discriminates).

### A seed (the header 1px taller open) red, reported, not kept

9. **The height seed goes red on its assertion, fast.** H6's seed (`card-stack.css:309`, bottom padding 19px): case 13 red at the first visit with "/ 320 header light: 392 against 391" (or the panel's 323 against 322), within a few seconds of the test's start, not "Test timeout of 120000ms exceeded". The nearest seed that must stay green: `18.4px` (open header 391.4, inside the 0.5 tolerance) leaves case 13 green; a build that went red on it has tightened the tolerance. (Optional; the 19px half is the required one.)
10. **A stuck transition is still red in about 5s.** Seed, d1440-dark: `.site-head .menu-btn { transition: background-color 600s linear; }` in `card-stack.css`. Case 13 red at `openMenu`'s `transitionsDone` with "Expected: 0, Received: 1" and the poll's own 5,000ms limit, the whole test under about 10s, no "Test timeout" line: the 120s hides no transition that never ends. (Under reduced-motion the seed is cut to 0.01ms by `global.css:185`, so run it at d1440-dark.)
11. **Seeds not kept.** After the seeds, `git diff revamp...job26/b31 -- src` is empty and `git status` in the worktree is clean but for the spec.

### `npm test`

12. **Unit tests and the build.** `npm test` green with `revamp`'s counts (the change reaches no unit test); `npm run build` green (it runs `astro check`, which type-checks the e2e files: a typo such as `test.setTimeOut` is red here).

### Done means (F26, for the record)

13. **Under the full load.** On `revamp` after the merge, CI's pass (`npx playwright test --grep-invert @visual --project=d1440-dark --project=phone`) shows case 13 passed and its duration (H1); a duration over 60s (half the budget) is reported to the orchestrator as a thin margin, even though green.

## Coverage

Every check of the B31 row is under a case or a hole: decision 1's budget and "nothing it asserts changes" → 1 to 5 (H1, H2, H4); the comment → 6 (H2, H3); case 13 alone, its time → 7 (H5); `--repeat-each=20` at d1440-dark → 8 (H1); the seed red, reported, not kept → 9, 10, 11 (H6); `npm test` → 12; the job's CI pass → 13.
