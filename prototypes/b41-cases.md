# B41: spec review (job 29), holes and attack cases

Reviewer (Opus), 2026-11-20, from `plan.md` (job 29, B41), `prototypes/d24-firewalls-guide.md` and `.html` (variant A,
the hand hold and following under the scene, approved in direction 2.142), and the code at d68743a (`job29/int`).
Measured in `.superpowers/wt/spec41` (built, `astro preview` on 4539, Chromium through the Playwright library, a frame
recorder injected by `addInitScript`: every `requestAnimationFrame`, the box's `scrollTop`, and whether the `check` row
and the `allow`/`deny` row are wholly in its client area within 0.5px). "The trial" is the spec's §2.1 to §2.3 without the
hand hold (READ_ROW, KNOWN_CHIP, `keepRowInView` as §2.2, the guard gone, the root the section's ref):
`.superpowers/job29/spec41-trial-follow.diff`, reverted after measuring. Scripts and raw results:
the reviewer's scratchpad (not kept); the numbers below are what they printed.

## What was measured

| What | revamp | the trial (no hold) |
|---|---|---|
| Firewalls step 2 from step 1, 1440 × 900, 1× / 0.5× | rule 3 out 42 of 42 | 0 out at 1× and 0.5× (84 frames a rule); `scrollTop` 0 then 28 |
| 1100 × 890, 1920 × 1080, 1× | | 0 out; steps of 30 and 21 |
| Rules tab 375 × 667, 1× | rule 3 out 42 of 42; deny out 80 frames after its mark, then brought in **at landing** by `LessonConsole`'s tab effect (`scrollTop` 0 → 23) | 0 out; deny 0 out; one step of 27 |
| Rules tab 360 × 640, 0.5× | | 0 out (84 a rule) |
| `scrollIntoView` calls during the recording | phone: 3; desktop: 0 | phone: 1 (the tab effect, at landing); desktop: 0 |
| Under the scene, settled, reduced motion, every position of all 34 lesson pages (289 positions; 115 with a followed row: 114 marked, 1 known chip) | 1280 × 800 and 1024 × 768: 16 not wholly in (the spec's list exactly; Firewalls 5's chip is in) | 0 not wholly in; `scrollTop` differs from revamp on those 16 only |
| The guide, 1440 × 900, the same scan | 0 not wholly in | |
| Rules / Table tab, the same scan | 375 × 667: 13 not wholly in; 360 × 640: 34 | 360 × 640: 0 |
| Largest followed row against its box | guide 121 / 164; under the scene 68 / 176; tab 375 × 667 143 / 191; 360 × 640 143 / 173; **320 × 568: 163 / 126** (Proxies 1, 3, 5; Load Balancers 3; ICMP 6); **740 × 360 (a phone on its side): the box 20 to 34px, every row taller** | |
| Re-renders (the speed button pressed 6 times) at 320 × 568, Proxies step 5, Table tab | | `scrollTop` 339, 384, 339, 384, ... : the row 4..167 then −41..122 in a box of 126, flipping every commit; 740 × 360 Firewalls step 2: 158, 198, 158, ... |
| A box hidden by its tab (`display: none`) | `scrollTop` set to 60, Explain chosen: reads 0; Rules again: 0 | |
| Keys and wheel on the focused box, Chromium, with and without reduced motion | wheel(0, 400): one jump, 0 → 91. PageDown, Space, End: 9 to 10 values over about 150ms (0 3 11 24 41 58 73 84 90 91), under reduced motion too | |
| Taking the table on the trial (no hold), 1440 × 900, Replay | wheel(0, 400) at rule 1: 0 → 91 and constant to 3.6s (all later rows are in view at 91, so nothing pulls back); wheel(0, −400) at rule 3: 0, 28, 0, 28 (the deny mark pulls back); a click on the box at rule 1: 0, 28 | |
| `npx vitest run src/lesson src/scenes` on the trial | | 704 passed, 2 failed: X1 and C14 only (§2.6's two) |

The spec's §1 says "Fits → deny" is never brought into view at 375 × 667: it is out for 80 frames at 1× (about 1.3s,
from its mark to the landing), then the tab effect's `scrollIntoView` brings it in when the visit applies (`panelChange`
moves to the visit's id). Check 5 is still red on revamp; only the record is wrong.

## Holes (worst first)

H1. **A followed row taller than its box flips the box at every commit.** §2.2 steps 5 and 6 cannot both be satisfied
    when the row's height is more than the box's client height less 8: step 6 puts its foot 4px above the box's foot, which
    leaves its top above the box, so the next commit's step 5 puts its top 4px under the box's top, which leaves its foot
    below, and so on. The effect runs on every commit (marks, ticks, the speed button, a tab click), so the box jumps
    between two places while Play all runs. Measured on the trial: 320 × 568, Proxies step 5, Table tab, `scrollTop`
    339, 384, 339, 384 ... over six presses of the speed button; the same at 740 × 360 (a phone on its side, which is
    still the phone layout: its Rules box is 20px, every rule 52px). Rows taller than the box at 320 × 568: Proxies 1, 3,
    5, Load Balancers 3, ICMP 6. None in the guide, under the scene, or at 375 × 667 and 360 × 640. Today this cannot
    happen in the tab (its effect runs on open and on a change only), so it is new with B41.
    One right answer for the flip: a row that cannot fit with its 4px either side (`r.height > box.clientHeight - 8`) is
    brought top first: its top 4px under the box's top (or the box to 0 when it is the first row, step 4), and left where
    it is once its top is there within 0.5px; step 6 never applies to it. Which end shows (top recommended: the row's
    first line names it, and it matches step 5) is the only part that could go to `designer`.

H2. **The hold is a boolean, but the box it held can be replaced or reset under it.** Three ways, each measured or
    in the code: (a) `TablePanel` and `RulesPanel` are keyed by the last table event (`UnitPanel.tsx`), so a table event
    that lands remounts the box at `scrollTop` 0; table events play 600 to 900ms (`net-map.ts:78`, `switch.ts:35`), long
    enough to take the table during one; the new box then holds at 0 while its new marked row is out, until the next play;
    (b) the Table tab hidden and shown again: a `display: none` box loses its scroll (measured 60 → 0), so on reopening a
    held box sits at 0 with the row being read possibly out, and ScenePanel will not follow it; the prototype does follow
    on opening even when held (`follow('tab')`, `d24-firewalls-guide.html:801`, which only `'mark'` is held from); (c) a
    resize across 1100px or 890px moves the portal, a new box at 0.
    One right answer: hold the element, not a flag (`useRef<Element | null>`, the box the reader took), and follow when
    the box being followed is not that element, or was not drawn (height 0) at the previous commit. This keeps the
    prototype's "opening the tab brings the row being read in" and keeps the reader's place wherever it still exists.
    It replaces §2.4's "one `useRef<boolean>`" (an erratum, no change to what a reader sees in the prototype).

H3. **On the phone, `LessonConsole`'s tab effect moves a held table when the visit lands.** §2.3 keeps that effect "as it
    is"; §2.4 says a held table does not move "when the visit lands". The tab effect runs when `change` changes, which
    happens when the visit applies, and calls `scrollIntoView({ block: 'nearest' })` on the deciding rule (measured: one
    call at step 2's landing at 375 × 667, on the trial). If the reader has scrolled the deciding rule out, it is pulled
    back at landing. The prototype has no such call. Needs a decision (two approved statements disagree): recommended,
    accept it on the phone and record it as an erratum (the move happens only when the deciding rule is out of view, once,
    at landing), so the tab effect and its tests (P3, C5, C21, site.spec "8") stay as they are.

H4. **"A new play" is not one place in the code.** The play effect returns before starting a play in the Sequence view
    (`view !== 'network'`, Firewalls has both views) and when there is no driver, so a release written after those guards
    never happens in the Sequence view: a table taken there stays held through every event of the step. The speed button
    makes a new `PlaybackState`, so the play effect aborts the play, clears the marks and plays the event again from rule
    1; the prototype's speed button does not restart anything (it only changes the divisor).
    One right answer: let go when `playedFor.current !== playback && pending !== null` (a new playback state with an
    event to play), tested before the view and driver guards; the speed button and Resume therefore let go (the read starts
    again at rule 1 and the box goes to it), Pause does not (no event pending).

H5. **"Another place" needs its own check, in the follow's commit.** Under reduced motion a hand move lands at once and
    starts no play, so only the place change lets go. If it is noticed in a later effect, or by comparing `derived.slot` by
    identity, the first commit at the new step is still held (or every tick lets go). One right answer: keep the last
    `unit`, `kind` and `step` in a ref and compare the values inside the follow effect, before it decides to follow.

H6. **Where the hand listeners live and when they go.** "Listeners on the root, delegated" leaves the root changing
    between `panelHome` and the section (a resize, Learn and back) with no word on re-adding or removing them. One right
    answer, either of: (a) React handlers on the section (`onWheel`, `onTouchStart`, `onPointerDown`, `onKeyDown`):
    React bubbles events from the portal through the component tree, so the guide's box is covered, and React registers
    wheel and touchstart passive, so nothing is added or removed by hand; or (b) native listeners in a `useEffect` keyed on
    the root, removed in its cleanup. Either filters by `event.target.closest('.tpanel, .rpanel')`. The tests must take
    the table in the guide (portal) and under the scene.

H7. **Check 7 cannot fail on a build without the hold, and one of its takes cannot pass.** (a) A wheel or PageDown
    from rule 1 scrolls the box to its foot (91px), where rules 2 and 3 and the deciding rule are all in view, so a build
    with no hold never moves it either: measured on the trial, 0 → 91 and constant for 3.6s. (b) PageDown, Space and End
    scroll a focused box over about 150ms (nine values), with and without reduced motion, so "from the next frame,
    `scrollTop` has one value" is red on a right build. One right answer: take the table without leaving the rows in view:
    a `pointerdown` or `touchstart` at rule 1 with the box at 0 (held: 0 throughout, rule 3 out; no hold: 0 then 28,
    measured), and a `wheel(0, -400)` while rule 3 is read (held: stays 0; no hold: 0, 28, 0, 28, measured); for a key,
    PageUp or Home while rule 3 is read, then wait for the scroll to settle (three equal frames) and assert one value from
    there to 1s after landing.

H8. **Check 11's `scrollIntoView` count cannot be read in the browser for the phone.** In check 5 the tab effect calls it
    at landing (measured: 1 on the trial, 3 on revamp), and the built code cannot say which component called. One right
    answer: count it in the browser in checks 1 and 9 (desktop, measured 0), and leave the phone's "not called by
    ScenePanel" to the unit test C12.

H9. **Check 12 (e) cannot go red against a combined selector.** A `check` row comes before a `[data-known]` chip in
    document order, so one `querySelector` over all three finds the check row too. In real data a check row never stands
    with an allow/deny row or a known chip (while a visit plays `UnitPanel` passes `active: null`), so the order can only
    be tested on a hand-built root. One right answer: `keepRowInView` on markup where a `[data-state="deny"]` row 0 is out
    of view above and a `tr[aria-current="true"]` row 2 is out below; row 2 is brought in. Red with the combined query.

H10. **Two checks hold on any build.** Check 10's first half (Explain open, the rules box's `scrollTop` never changes): a
    hidden box reads 0 whatever is assigned (measured). Check 6 does not say the Rules tab is open; closed, it is 0 too.
    One right answer: check 6 with Rules open; check 10's first half as a unit probe (box height 0: `scrollTop` untouched
    and the row's `getBoundingClientRect` not read), or dropped.

H11. **§2's prose and §2.2 disagree on Replay.** §2: "When a read starts again at rule 1 with the box scrolled down, the
    box goes back to its top." §2.2 step 4, §3 ("to 0 if it was above") and the prototype (line 639) go to 0 only when rule
    1 is above the box. After step 2 lands at 1440 × 900 the box is at 28 and rule 1 at 33px, in view: a plain Replay
    leaves the box at 28 and the caption hidden. One right answer: §2.2 and the prototype govern; a build that zeroes the
    box at every first-row read is drift.

H12. **Where the new end-to-end checks run.** The `phone` project runs only `site.spec.ts`'s `@phone` tests; no project
    is 1100 × 890, 1024 × 768, 375 × 667, 360 × 640 or 375 × 812; `reduced-motion` is 1440 × 900. One right answer: one
    new spec file, gated to `d1440-dark` (so CI's pass runs it) and `reduced-motion` (check 4), each size by `test.use`
    or `setViewportSize`, the phones with `isMobile` and `hasTouch` in a `test.describe` of their own, reduced motion by
    `emulateMedia` for check 9; check 6's 390 × 844 run there too, not in the `phone` project.

H13. **Check 1's "proof it watched" floor has one frame of slack at 2×.** 20 / 2 × 2 = 20 frames against 21 measured; at
    three workers with other units on the machine, a dropped frame fails a right build. One right answer: half the
    frames a read lasts at 60 frames a second (84, 42, 28, 21 at 0.5×, 1×, 1.5×, 2×), so at least 42, 21, 14 and 10.

H14. **A resize during a read is not followed until the next mark.** The effect runs on commits; a resize that changes
    the box (the 24% cap, the phone's `dvh` as the address bar moves) commits nothing. One right answer: accept it (the
    spec's rule is "in the frame that row is marked"); no `ResizeObserver`. Stated so the builder adds none.

## Attack cases

Each line: the setup, then what a right build does. "Red on" names what it catches. "The recorder" is §7's, with the
check row's and the deciding row's wholly-in read against the box's client area. "Arrive" is §7's "arrive from step 1".
Unit cases (U) are `LayoutEffects.test.tsx` with `stubBoxes` and `<Profiler onRender>` unless said; browser cases (E) are
the new spec of H12.

### Check 1: the guide, every speed

1. E. 1440 × 900 dark and light, arrive at 0.5×, 1×, 1.5×, 2×: every frame with a `check` row has it wholly in; frames a rule at least 42, 21, 14, 10 (H13). Red on revamp: rule 3 out 84 / 42 / 28 / 21.
2. E. The same, the `scrollTop` values seen: exactly {0, 28} at every speed (one move, in rule 3's first frame). Red on an animated scroll (more values) and on a build that also zeroes for rule 1 when it is in view (H11; here 0 anyway, see 7).
3. E. The same, the first frame where rule 3 is `check` already has `scrollTop` 28 (not the next frame). Red on a passive effect or a `requestAnimationFrame` deferral.
4. E. The same, the deciding rule from its first frame to the recorder's end: 0 frames out, and `scrollTop` unchanged after the deny mark (rule 3 is already in). Red on a build that adds a second move at the deny mark.
5. U. `onMark({ row: 2, state: 'check' })` in the guide: in that commit's `onRender`, row 2 is inside and `scrollTop` is `r.bottom - p.bottom + 4` (with the stub: 240 + 80 + 40 − 200 + 4 = 164). Red with READ_ROW left out of the order (check 12a).

### Check 2: the guide, left scrolled

6. E. Step 2 landed, `scrollTop = 0` by script, Replay at 1×: 0 frames out; a script scroll does not take the table (rule 3 still moves the box to 28).
7. E. Step 2 landed (the box at 28 after the landing), Replay with nothing else: in the frame rule 1 turns `check`, `scrollTop` is still 28 (rule 1 at 33px, in view). Red on a build that zeroes at every first-row read (H11, drift from the prototype's line 639).
8. E. `scrollTop = scrollHeight` by script (91, or 121 with two connections), Replay: in the frame rule 1 turns `check`, `scrollTop` is exactly 0. Red with step 4 left out (step 5 alone gives 91 − 34 = 57).
9. U. Box scrolled to 300, `onMark({ row: 0, state: 'check' })`: `scrollTop` 0 in that commit (check 12c). Red with step 4 removed (300 − 164 = 136) and with READ_ROW left out (stays 300).
10. U. A row that is first and below the box (box scrolled to 0, the stub's rows start at 240): it is brought in by step 6, not sent to 0. Red on a build that tests "first row" before "above".

### Check 3: the other guide sizes

11. E. 1100 × 890 and 1920 × 1080, arrive at 1×: 0 out; one move each (measured 30 and 21 on the trial). 1099 × 890 and 1100 × 889 put the table under the scene: the case passes there too (rules one line, `scrollTop` 0).

### Check 4: reduced motion

12. E. `reduced-motion`, step 2 landed, Replay at 1× and 2×: 0 frames out; the distinct `scrollTop` values ≤ marks + 1; computed `scroll-behavior` of the box `auto`.
13. E. A build that uses `scrollTo({ behavior: 'smooth' })` or `scrollIntoView({ behavior: 'smooth' })`: values between 0 and 28 appear. Red.
14. E. Forward from step 1 under reduced motion: step 2 lands in one commit, no frame has a `check` row, and the deciding rule is wholly in from the first frame it exists (the move in the landing's commit).
15. E. Under reduced motion take the table at step 1 (a click on the box), press forward: step 2 lands with no play; in that commit the box follows the deciding rule (H5: the place change lets go in the follow's own commit). Red on a release written in a later effect or keyed on `derived.slot` by identity.

### Check 5: the Rules tab on short phones

16. E. 375 × 667 and 360 × 640, `isMobile`, `hasTouch`, open Rules, arrive at 1× and 2×: 0 frames with the `check` row out; from the deny row's first frame to the recorder's end, 0 out. Red on revamp: deny out 80 frames at 1× (it comes in only at landing).
17. E. 375 × 667: the single move is 27px (`scrollTop` {0, 27}); the tab effect's landing call finds the row in and moves nothing (values stay {0, 27}).
18. E. 360 × 640, arrive at 0.5×: 84 frames a rule, 0 out.
19. E. 320 × 568, Proxies step 5, Table tab, press the speed button six times: `scrollTop` takes one value (H1). Red on the spec as written: 339, 384, 339 ... measured.
20. E. 740 × 360 (phone on its side), Firewalls step 2 landed, Rules open, six speed presses: `scrollTop` one value, rule 3's top at 4px under the box's top (H1).
21. U. A row 150 tall in a box 100 tall (stub), re-rendered five times: `scrollTop` one value after the first commit. Red on steps 5 and 6 as written.

### Check 6: phones where the list fits

22. E. 375 × 812 and 390 × 844, `isMobile`, Rules open (H10), arrive at 1×: `scrollTop` 0 in every frame. Also 375 × 740 (fits per §1): 0.
23. E. The same with Rules closed is not a check (it passes on any build).

### Check 7: taking the table

24. E. 1440 × 900, Replay, at rule 1's `check` a `pointerdown` on a row (`mouse.down` / `up`) with the box at 0: `scrollTop` 0 in every frame to 1s after landing, rule 3 out for its read (by design). Red without the hold: 0 then 28 (measured).
25. E. The same with a `touchstart` dispatched on the box (`dispatchEvent(new TouchEvent(...))` or CDP touch in a `hasTouch` context): 0 throughout. Red without the hold.
26. E. While rule 3 is `check` (box at 28), `mouse.wheel(0, -400)` over the box: from the first frame at 0, `scrollTop` stays 0 through the deny mark and landing. Red without the hold: 0, 28, 0, 28 (measured).
27. E. While rule 3 is `check`, focus the box and press Home (or PageUp): wait until `scrollTop` is equal for three frames (Chromium animates keys about 150ms, H7), then one value to 1s after landing. Red without the hold.
28. E. A wheel to the foot at rule 1 is not a hold test (constant on a build with no hold); keep it only beside 24 to 27.
29. E. After any of 24 to 27, Replay: in the frame rule 1 turns `check`, the box follows (0 if rule 1 was above, else unchanged by H11's rule). Red on a hold that is never let go.
30. E. During the read, `box.scrollTop = 0` by script at rule 2, no hand: at rule 3's mark the box moves to 28. Red on a build that takes the table on the `scroll` event.
31. E. ArrowLeft or ArrowRight with focus in the box (not in the hold's key list): they move the lesson (shortcuts), which lets go by place; they never hold the next step's table.
32. E. A wheel on the figure, the log or the words (outside `.tpanel, .rpanel`): no hold; rule 3 still brings the box to 28. Red on listeners that do not filter by `closest`.
33. E. A wheel or click on a `.bits` board in the guide (Subnetting): nothing held, nothing thrown, nothing scrolls (C13 holds).
34. U. `fireEvent.wheel` on the guide's box (portal), then `onMark({ row: 2, state: 'check' })`: `scrollTop` unchanged; then a new `PlaybackState` with `eventIndex` 0 and a pending event: the next out-of-view mark is followed (check 12d). Red with the hold removed, and red with a release never reached (H4).
35. U. The same with `panelHome` null (under the scene): the wheel on the section's box holds it. Red on listeners attached to `panelHome` only (H6).
36. U. Unmount the console after a take: no listener left on `panelHome` (`removeEventListener` called for each one added, or React handlers). Red on native listeners with no cleanup.
37. U. The root changes (rerender with `panelHome` set, then null, then set): a take on whichever box is drawn holds it. Red on listeners added once to the first root.

### The hold's edges (§2.4; H2 to H5)

38. E. 1440 × 900, take the table during step 1's read (box to its foot), press forward: in the frame step 2's rule 1 turns `check`, `scrollTop` is 0 (check 8). Red on a hold kept across steps.
39. E. Play all from step 1 at 1×, take the table during step 1: step 2's first rule read follows again (a new play). Red on a hold released only by hand moves.
40. E. Take the table during rule 2, then Pause (Play all running): no move at landing or after; then Play all again: the unit's first step plays and the box follows. Pause does not let go; the restart does (H4).
41. E. Take the table at rule 1 (box at 0), press the speed button during rule 2: the read starts again at rule 1 and rule 3 then brings the box to 28 (the speed button lets go, H4). A build that keeps the hold across a speed press leaves rule 3 out: red.
42. E. Firewalls, Sequence view chosen, Play all; take the table (click) during step 1; at step 2 (a new place) the box follows its deciding rule; within one step the events after the take let it go too (H4: the release is before the view guard). Red on a release after `view !== 'network'`.
43. E. 375 × 667, Rules open, take the table at rule 1 (touch), switch to Explain and back during rule 3's read: in the first painted frame of the tab, rule 3 is wholly in (the box was not drawn at the last commit, H2; as the prototype's `follow('tab')`). Red on a boolean hold.
44. E. Switch (`switch.ts:35`, table events of 900ms) or ARP (net-map, `match` 900ms) at 1440 × 900 (DHCP's lease events land at once, so it cannot show this): click the guide's table while a table event plays; when it lands the panel remounts and its marked row is wholly in in that commit (H2a). Red on a boolean hold where the new row is below the fold of the box.
45. E. 1440 × 900 → 1440 × 880 during rule 2 with the table taken: the panel goes under the scene (rules one line, fit); back to 1440 × 900 during rule 3: the new guide box follows rule 3 (H2c).
46. E. 375 × 667, Rules open, take the table during rule 3 and scroll the deciding rule out of view (touch drag up): at landing the tab effect brings it back (one `scrollIntoView`). Expected per H3's recommendation; if the orchestrator rules otherwise, this case flips.
47. U. Take the table (wheel), then rerender with a different `derived.slot.step` and no pending event (reduced-motion hand move): the commit's follow runs (H5). Then rerender with the same slot values but a new `derived` object: still held. Red on identity comparison.

### Check 8: let go on a move

48. E. As case 38 under `reduced-motion` with Replay to read step 1: forward lands step 2 at once; the deciding rule is wholly in in the landing's commit.

### Check 9: under the scene

49. E. 1280 × 800 and 1024 × 768, `reduced-motion` emulated, each of the 16 steps of §1 (both tracks' copies): settled, the marked row wholly in. Red on revamp (16 of 16 out, measured).
50. E. The same sizes, every other position with a followed row (98 marked plus Firewalls step 5's chip): `scrollTop` 0, as on revamp (measured on the trial: equal on all). Red on a build that follows a row already in (creep) or zeroes on first rows.
51. E. 1366 × 768, Firewalls arrive at 1×: `scrollTop` 0 in every frame.
52. E. `window.scrollY` and `.console__guide`'s `scrollTop` constant in checks 1 and 9; `scrollIntoView` calls 0 there (H8).

### Check 10: a closed tab

53. U (replacing the browser half, H10). Phone media stubbed, Explain open, marks on rule 3: the box's `getBoundingClientRect` reports height 0; the row's is never read and `scrollTop` is never assigned (spy the setter). Red on a build that drops step 2's `p.height === 0` return.
54. E. 375 × 667, Explain open, arrive at 1×, open Rules while rule 3 is `check` (wait for `tr[data-state="check"]:nth-child(3)` attached, then click): in the first frame `.console[data-tab="table"]` is painted, rule 3 is wholly in. Red on revamp.
55. E. As 54, open Rules after the landing: the deciding rule is wholly in in the first painted frame (both effects agree; site.spec "8" unchanged).

### Check 11: the window and the guide never move

56. E. Checks 1 and 9 (desktop): `scrollY` and the guide's `scrollTop` one value each, `scrollIntoView` 0 calls. On the phone (check 5) `scrollY` one value; the count is not read (H8).
57. U. C12 as is, plus the same with `panelHome` null: the section's ancestors untouched, `scrollIntoView` not called.

### Check 12: unit probes

58. U (a) to (d) as the spec, each with the red named: (a) and (b) with READ_ROW out; (b) also with the `panelHome === null` guard kept; (c) with step 4 out; (d) with the hold removed.
59. U (e) replaced (H9): `keepRowInView` on hand-built markup, `.rpanel` with `tr[data-state="deny"]` first (above the box) and `tr[aria-current="true"]` third (below): the third is brought in. Red with `root.querySelector([READ_ROW, MARKED_ROW, KNOWN_CHIP].join())`.
60. U. `keepRowInView` on a root with a `.bits` board and a labels strip only: returns, nothing assigned, nothing thrown.
61. U. `READ_ROW` matches only `tbody tr`: a `[aria-current="true"]` on a chip, a caption or the Outline (`Outline.tsx:340`) is not followed. Today only `RulesPanel` sets `aria-current="true"`, on `check` rows only (`RulesPanel.test.tsx:61, 65` pin it).

### Check 13: job 27's checks hold

62. U. P1 to P4b, C2, C5, C9 to C13, C16, C18, C21 green unchanged; X1 and C14 rewritten as §2.6 (on the trial exactly these two fail, 704 pass).
63. E. Proxies step 3, 1440 × 900, Play all: the marked row 0 frames out.
64. U. C16 still holds: `LessonConsole.tsx` declares no selector and reads no `getBoundingClientRect`; `READ_ROW`, `MARKED_ROW`, `KNOWN_CHIP` and `keepRowInView` exported from `ScenePanel.tsx` only.

### Check 14 and what the build must not change

65. `npx vitest run --maxWorkers=3`, `npm run build`, CI's pass green; `git diff revamp -- src/lesson/LessonConsole.tsx` empty (§2.3), and no change to `console.css`, `rules.css`, `table.css` (A changes no size).
66. Visual baselines: `visual.spec.ts`'s `step3` shots at under-the-scene sizes change at 1280 × 800 for What is TLS step 3 (both tracks) and What is UDP step 3 (in §1's list). Not in CI's pass; the builder lists them for the orchestrator rather than updating baselines unasked.
