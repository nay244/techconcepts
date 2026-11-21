# B39: spec review (job 29), holes and attack cases

Reviewer, 2026-11-20, from plan.md "Job 29" (decision 2, the B39 row) at a7985bd, the diagnosis (`.superpowers/job29/diag-fit-a.log`,
`diag-fit-trial.log`, `diag-fit-load.log`, `.superpowers/wt/diag29/e2e/zz-diag29-fit.spec.ts`) and job 28's trial
(`.superpowers/job28/trial-flushsync.diff`, main folder). Measured in `.superpowers/wt/spec29` with `zz-measure/fit.mjs` (copied to `.superpowers/job29/spec-measure/fit.mjs`, session folder):
Chromium, the six lessons of the diagnosis, each turned 768 x 1024 -> 1024 x 768 and back, and a sweep 1120 -> 740 -> 1120 in 7px steps.

## Holes (worst first)

B39-H1. The diagnosis never showed the second half of decision 2 ("the short words are never painted where the full ones fit")
    green: its ResizeObserver probe was red on the flushSync trial too (`diag-fit-trial.log`: `ro-wrong` at 896 and 901 for all six
    lessons and on all twelve turns). The cause is the probe, not the fix: resize observers run in the order they were made, and
    the diagnosis made its observer on the server's button, before hydration, so it ran before the page's and read the old form
    every time. The page's observer is also made again whenever its effect re-runs (`PlaybackControls.tsx:64-80`, deps
    `[mode, fullWords]`: a step change, or crossing 760 or 1099 where `mode` changes), which puts any earlier probe first again.
    Answer (one, measured): the probe's ResizeObserver is made after hydration and settle, and made again (the old one
    disconnected) right before each resize, so it is the last in the list; in its callback it reads the button's room and
    `.go__measure`'s width as the page's check does and records whether the shown label (`.go__label`) is the form that fits.
    Measured on a7985bd with that probe: wrong form on 12 of 12 turns (both directions), cut label on 6 of 12 (768 -> 1024 only);
    sweep: wrong at 896 and 901, cut at 901, nothing elsewhere. On the trial: see "Measured on the trial" below.

B39-H2. An IntersectionObserver cannot see the second direction: short words where the full ones fit cut nothing, so every ratio is 1.
    It sees the first (full words cut). Its callback also runs in a later task, after React may have committed: the ratio is the
    painted frame's, but a `textContent` read in the callback can be a later frame's (measured: `io 0.858 "Next: step 3"` on revamp,
    the cut frame showed "Next: DHCP Request"). Answer: two probes, both installed as H1 says: the IntersectionObserver rooted on
    the button (label and arrow, thresholds up to 1) for "no cut frame", the late ResizeObserver for "the form that fits, in the
    frame the size changed". Neither reads text in an IntersectionObserver callback for its verdict.
B39-H3. Which flushSync. Answer (one): exactly the trial's line, `new ResizeObserver(() => flushSync(check))`, with
    `import { flushSync } from 'react-dom'` (the console already imports it, `LessonConsole.tsx:1`). Not around the first `check()`
    inside `useLayoutEffect` (a layout effect's state update already commits before paint; flushSync there is React's
    "flushSync was called from inside a lifecycle method" in development) and not around `fonts.ready.then(check)` (a different
    frame, not this job's).
B39-H4. The probe must start after hydration. Before it, the server's markup is painted, with the first step's full words cut
    from 901 to 1099 (`diag-fit-load.log`, "Found on the way", not this job's). A probe installed by `addInitScript` sees that and
    is red on a right build. Answer: install after `hydrated(page)`, `document.fonts.ready` and two frames; assert the
    IntersectionObserver's first entry (ratio 1) arrived before the turn, so the probe is not vacuous.
B39-H5. Where the probe lives and which project runs it. `tablet.spec.ts` sets its own sizes and has its own project (`tablet`),
    which the B39 row names. Answer: a test in `tablet.spec.ts` (all six lessons, both directions in one test or one each), run
    by `--project=tablet`; red on `revamp`: run the same spec file against a build of a7985bd (the spec is new there, so copy it in).

## Measured on the trial

Job 28's `trial-flushsync.diff` applied to a7985bd (`.superpowers/job29/trial-b39-spec.diff`), built, the same probe:
**12 turns: 0 with a cut label, 0 with the wrong form; sweep of 110 widths: 0 cut, 0 wrong**, three runs (two with motion, one
with reduced motion). On a7985bd, the same probe: 6 cut, 12 wrong; sweep: 896 wrong, 901 cut and wrong. So decision 2 holds in
both directions once the probe is made after the page's observer.

## Attack cases

### The fix

1. One line changes in `src/lesson/PlaybackControls.tsx` and one import is added. Check: `git diff revamp -- src/lesson/PlaybackControls.tsx`
   is the trial's diff, with at most a comment that says why (the observer's update is committed in the frame it was measured in).
2. Focus stays on the forward button across a turn (no remount): focus `.cbtn--go` at 768 x 1024, turn, `document.activeElement`
   is the same node, and its `aria-label` is `forward.names` of the form shown (the same commit sets both).
3. Modes that do not fit are untouched: at 1100 and above (`full`) and 760 and below (`short`) the effect returns before making
   an observer; a turn 1366 x 1024 -> 1024 x 1366 (full -> fit) and 760 -> 761 still gives the right form in the first frame
   (the `mode` change commits before paint: `useMediaQuery`'s `change` event is discrete).
4. A step change at 900 wide (Next pressed) shows the fitting form for the new step in its first frame: the effect re-runs
   (`fullWords` changed) and `check()` in the layout effect commits before paint.

### The probe (H1, H2, H4, H5)

5. Red on `revamp`, both directions: the six lessons (`/networking/dhcp?step=2`, `/networking/firewalls?step=2`,
   `/networking/load-balancers?step=1`, `/how-the-internet-works/what-is-https?step=3`, `/networking/subnetting?step=1`,
   `/networking/proxies?step=3`), 768 x 1024 -> 1024 x 768: a label ratio under 1 (51 to 93% shown) and the full words shown where
   they do not fit; 1024 x 768 -> 768 x 1024: the short words shown where the full ones fit (room 222, measured). Every lesson red.
6. Green on the build: no ratio under 1 for the label or the arrow after the turn, and the late ResizeObserver records the fitting
   form, in both directions, six lessons, `--project=tablet --repeat-each=10 --workers=3`.
7. Not vacuous: the label's text before the turn differs from after it (the form changed), the late observer fired at least once
   after the resize, and the IntersectionObserver's entry at install was ratio 1.
8. A wrong probe to refuse: one ResizeObserver made at load (or by `addInitScript`) and kept: on a right build it is still red
   (measured, `diag-fit-trial.log`); one that only waits two frames and reads the label: green on `revamp` too (the next frame is right).
9. The sweep: 1120 -> 740 -> 1120 by 7px on one lesson, the probe made again before each step: 0 cut and 0 wrong frames on the build;
   on `revamp` wrong at 896 and 901, cut at 901 and nowhere else.
10. `npm test`; `npm run build`; the lesson specs in `d1440-dark` (`npx playwright test --project=d1440-dark lesson`), and `tablet` whole.
