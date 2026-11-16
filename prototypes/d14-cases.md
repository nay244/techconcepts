# D14 cases: the spec review of B17 (job 15)

The spec review of `prototypes/d14-lesson-flow.md`, approved part only (its "Approved: the controls only" section; direction 2.71), by `reviewer` (Opus), 2026-11-15, on `claude/job15-lesson-flow-a96bc5` at `5245451`. Verdict: HOLES (12). The errata below close them, numbered by the orchestrator; they win over the spec wherever the two differ. The attack cases follow, as the reviewer wrote them, with the errata applied. The builder turns each case into a test (shown failing first against today's code where it can fail); the build reviewer checks them.

## Errata

- **E1 (H1, focus).** The forward control is **always a `<button>`**, at every slot. At Practice with a next lesson, "Next lesson" navigates with `window.location.assign(next.url)`. One element for the whole lesson, so focus never drops when its label changes (`LessonConsole.test.tsx:488` keeps holding). The Up next card in today's end row stays the link a reader can open in a new tab. The spec's "`<a class="cbtn cbtn--go" href>`" line (§3) is void.
- **E2 (H2, replay's rule).** Replay is enabled on a Watch step with **at least one event**, not "message". Subnetting's and IP Address's steps, OSI Model's 1–6, 9 and 10, MAC Address's 2 and 3, Switch's 2 and Packets' 5 replay. Disabled: the Overview, Learn, Practice, and a step with no events (HTTP's step 1).
- **E3 (H3, reduced motion).** A hand move's "land complete" is decided **when the move is dispatched**, by reading `window.matchMedia('(prefers-reduced-motion: reduce)').matches` at that moment (one helper, `prefersReducedMotion()`, `false` where `matchMedia` is missing), carried on the action as `instant: boolean`. Never from a React render or the hydration snapshot. It covers `go`, `next`, `prev`, Resume, the outline, the following-unit jump and `?step=`; a `?step=3` first load under reduced motion lands complete. Replay and Play all ignore it (they keep their waits). `usePlayback`'s signature may change; update the pin at `playback.test.ts:374-388` to say what it now takes.
- **E4 (H4, which layouts get the phone bar).** The phone bar (48px, icon-only play button, five controls, the forward button `flex: 1`) applies **exactly inside the site's phone query** (`console.css:1347`: `(max-width: 760px), (max-width: 899px) and (min-height: 600px), (max-width: 1099px) and (orientation: portrait)`), not the prototype's `(max-width: 1099px)`. The narrow rules (≤374: no ›, words centred; ≤359: 44px controls, 16px words, 6px gaps) sit inside that query. Everything else, including the stacked page with JavaScript on (a phone on its side, 844×390), gets the desktop row at its own size.
- **E5 (H5, the row and the legend at 1100–1145px).** Answered by D14's designer in the spec (§3 and §10, "Erratum E5"): the play button drops its words (a 36×34 icon, its name still "Play all"/"Pause") while the log head's content box is under 830px (about 1164px wide); the row goes from 418px to 336px. Pass bar at 1100–1280 on a desktop and at 900, 1024 and 1099 on its side, DHCP Learn, log open: the legend at least 8px clear of the speed button, the row on one line, nothing clipped, the play button 36px or 118px. The orchestrator measured the prototype: 36 wide at 1100 and 1163, 118 at 1165 and 1440.
- **E6 (H6, check 14).** HTTP step 3 has three messages. Replay's log reads **2, 3, 4, 5** rows, a message's wait apart. A test asserts each count in turn, never "5 one message after 3".
- **E7 (H7, check 6).** Check 6 measures the **three real end cases** (a next lesson: HTTP; a track's last lesson; a last ready lesson). The following-unit case is unit-tested on the `THREE` fixture only. "Unclipped" means, after `document.fonts.ready`: `button.scrollWidth <= button.clientWidth`; the label's right edge ≤ the › svg's left edge − 6 (when the › shows); the svg's right edge ≤ the button's right edge − 8.
- **E8 (H8, a following unit from another phone tab).** "Next step" to a following unit switches the phone's tabs to **Explain** (as `goFromOutline` does), then focuses the explanation.
- **E9 (H9, many units).** "Play all" runs from **the current unit's first step** and stops on **that unit's last step** (today's `toggle` start and `settle` stop). The spec's "from step 1" means the unit's first step.
- **E10 (H10, `ended`).** `ended` is removed from the state, with every test literal that sets it (`ScenePanel.test.tsx:42`, `ScenePanel.packets.test.tsx:23`, `ScenePanel.switch.test.tsx:22`, `announce.test.ts`, `playback.test.ts`). Dead state goes with the change that killed it.
- **E11 (H11, a unit with no steps).** Play all and replay are `aria-disabled="true"`, like Back and the disabled "Next lesson", not native `disabled`; a press changes nothing and focus stays. `playback.test.ts:264` is updated to say so.
- **E12 (H12, `src/scenes/`).** B17 may edit **one test file** there, `src/scenes/drivers/net-map.test.ts` (:896-897, :920-921, :1086-1087): drop the `toggle` after `go`, since arriving now plays the step. No other file under `src/scenes/`, and no scene, figure, panel or driver code, changes.

## Attack cases, by acceptance check

"Fake timers" means the unit tests' `wait()` with `durationOf`; "real" means an end-to-end check on the built site.

**1. The row**
- Exact names. At 1440 on HTTP step 2, `.console__controls` children in order: speed, "Previous step", `.cbtn--alt`, "Replay step", `.cbtn--go`. `getByRole('button', {name: 'Replay'})` matches "Replay step" and `{name: 'Play'}` matches "Play all": both need `exact: true`.
- `.console__controls .cbtn` count is exactly 5 on the Overview, a step, Learn, and Practice in each end case, all `<button>` (E1). No `.cbtn--play` remains; no icon-only › remains.
- Replay's `innerText` is `''`.

**2. The forward button's name**
- "Next step" on the Overview, steps 1–5 and Learn; "Next lesson" on HTTP's Practice, a `<button>` (E1); pressing it calls `location.assign` with the Up next card's `href`.
- The same label whether Practice is reached by clicks or by `?step=7`.
- In the `THREE` fixture, unit 1's Practice reads "Next step" and unit 3's "Next lesson" (catches a label keyed on `position >= last`).

**3. Seven presses**
- Kickers in order: Overview, Step 1 … Step 5, Learn, Practice.
- By keyboard, Enter ×7 on the focused forward button: focus stays on it the whole way (E1).

**4. Play all when no run is going**
- On step 3 during its own play (mode `step`, 3 of 5 rows): the play button's name is "Play all", icon ▶, title "Play all (Space)".
- Pressing it moves to Step 1 and reads "Pause" (today's build runs from step 3 and fails).

**5. Only the forward button is orange**
- Computed `background-color` equals the accent only on `.cbtn--go`, light (#b04617) and dark (#f0702e), the disabled "Next lesson" included (opacity 0.4, ground still the accent).
- `.cbtn--alt` takes `.cbtn`'s tile (catches old `.cbtn--play` styles carried over).

**6 and 6a. Sizes and places** (E4, E7)
- 375×812, both themes: five controls 48 tall at x 12, 68, 124, 180, 236; the forward button 127 wide ending at 363. On the Overview, step 3, mid-run (Pause), Learn, and Practice in the three real end cases.
- Clipping as E7. `scrollWidth` is 375. The play button on a phone shows no words; its name is "Play all" or "Pause".
- 390×844 (the CI phone project): forward button 142 wide.
- At 375 the › shows; at 374 it does not. 360×780: 112 wide, no ›, words centred (gaps within 1px), "Next lesson" unclipped. At 360 the controls are 48px; at 359, 44px. 320×640: five 44×44 controls 6px apart; forward button 96 wide, 16px words, unclipped; bar 64px tall.
- 768×1024: controls from left 124 to right 644, all 48 tall (`tablet.spec.ts:113-120` holds); play button icon-only; forward button about 296 wide with the › at its right end.
- 820×1180 portrait: the same, inside the 520px column.
- 1024×768 and 900×700 on their side: the desktop row at 44px; the play button shows words; forward ≥152; Learn with the log open: no legend item overlaps a control (E5's pass bar).
- 1100×800, DHCP Learn, log open: E5's rule holds (no `.log__legend li` right edge past the speed button's left edge, or as E5 says).
- 844×390 with JavaScript on: the desktop row (E4), one line, no sideways scroll.
- 1440×900: speed x 1053, play 1095 (118 wide), replay 1219, forward 1261 (152 wide), all 34 tall (unless E5 changes them; then E5's numbers).

**7. Titles**
- Exact strings: "Next step (→)" with U+2192; "Play all (Space)" and "Pause (Space)", switching with state; "Previous step (←)"; "Replay step"; "Next lesson".
- Back's accessible name stays "Previous step" (a build that copies the title into `aria-label` fails, and so does `e2e/support.ts`'s `button[aria-label="Previous step"]`).

**8. Play all from the Overview** (fake timers)
- HTTP step 1 has no events, so the run moves to step 2 at exactly 2600 ms (not 2599); at 2×, 1300 ms.
- After step 5's last event: mode idle; 60 s later still step 5, never Learn. The forward button reads "Next step", the play button "Play all".
- In `THREE`, the run does not cross into unit 2 (E9).

**9. Pause**
- On step 3 at event 1 of 3: Pause gives 5 rows and "Play all"; 30 s later nothing has changed.
- During the hold after step 3: the position stays step 3 (not 4), and no `.topbar__fill` is left.
- "Play all" next goes to step 1 (a build that resumes fails).

**10. Play all from elsewhere**
- On step 3 after its play, on Learn, and on Practice: Play all leads to "Step 1 of 5" and "Pause". From Practice the forward button reads "Next step" again and the URL does not change.

**11. Hand moves stop a run**
- Mid-run on step 2, each on its own: the forward button, →, ←, Back, an outline item. After each: "Play all", and 30 s later still where the move landed.
- Not stopping a run: the speed button (the hold is rescaled), a phone tab switch.

**12. Nothing moves on unasked**
- On the Overview, press `.cbtn--go` (today's orange is Play, which runs) and wait 30 s at 1×: still step 1.
- Forward to step 2, wait for its 2 messages plus 30 s: still step 2, 2 rows, "Play all", no `.topbar__fill`.

**13. Replay on HTTP step 3** (fake timers; E6)
- After its play: rows drop to 2 at once, then 3, 4, 5, a message's wait apart; the kicker stays Step 3.
- Pressed mid-play (at 3 rows): back to 2, plays again from its first message.
- Back then "Next step" gives the same sequence.
- DHCP step 4 (the table remount): after a replay ends, `figureSnapshot` equals a fresh `?step=4` arrival's (guards "scene untouched").

**13a. Replay disabled** (E2)
- HTTP: `aria-disabled="true"` on the Overview, step 1, Learn, Practice; `"false"` on steps 2–5. On step 1 a click changes no state and focus stays on it. Opacity 0.4.
- Subnetting step 1 (3 events, 0 messages): enabled; a press replays it.
- After "Next step" from step 5 to Learn, replay is disabled.

**13b. Replay during a run**
- Play all, then replay on step 3 mid-message: "Play all", rows refill from 2, and 10 s later still step 3.
- During the hold after step 3: replays step 3, not step 4. (A build that sets mode `run` on replay moves on and fails.)

**14. Reduced motion** (`emulateMedia` reduce; E3, E6)
- Forward to step 3: 5 rows in the first frame (≤100 ms), no `.topbar__fill`. Back then Next step: 5 rows at once again.
- Also land complete: a fresh `?step=3` load, an outline click to step 4, Resume to step 3.
- Replay: 2, 3, 4, 5, a message's wait apart, nothing moving on the figure.
- Unit test with `matchMedia` stubbed to reduce: `go(3)` gives `eventIndex === count`, mode `idle`, `vi.getTimerCount() === 0`.
- The setting turned off mid-page: the next hand move plays with its waits.

**15. Play all keeps its pace under reduced motion**
- Fake timers: step 2 lasts d(m1) + d(m2) + 2600 ms.
- Real: DHCP's run under reduced motion is within 25% of the normal run (`lesson.spec.ts:306`, its end signal changed from "Replay" to "Pause" → "Play all" with the kicker on the last step). A build that sends the run's steps through the hand-move path comes out far shorter and fails.

**16. → follows the forward button**
- With `<body>` focused, → moves on the Overview, a step and Learn.
- On Practice it does nothing in the next-lesson, track's-last and last-ready cases: the URL is unchanged after 1 s, no navigation, the kicker still Practice, state unchanged in a unit test.
- In `THREE`, → on unit 1's Practice leads to "Beta · Overview" with the explanation focused (and on a phone, the Explain tab: E8).

**17. ← and Space**
- ← on the Overview does nothing; from step 1, ← goes to the Overview.
- Space with `<body>` focused on the Overview starts a run ("Pause"); Space again gives "Play all". A repeat Space (`repeat: true`) calls nothing.
- Space during a hand step's own play runs from step 1. Space on Practice moves to step 1; the URL does not change.
- Space on the focused forward button moves exactly one place and starts no run.
- r, R and Enter with `<body>` focused change nothing.

**19, its first two sentences** (`THREE` fixture; E8)
- Unit 1's Practice: the forward button reads "Next step", title "Next step (→)"; clicking it leads to "Beta · Overview" with the explanation focused; on a phone with the Log tab showing, the tabs switch to Explain first.
- The end row's "Next: Beta, …" and "Go to Beta" are unchanged.

**20, the bar's part**
- `number === total`, `next === null`: the forward button is `<button aria-disabled="true">` "Next lesson", titled "There is no next lesson: this is the track’s last." (U+2019). Click, Enter and Space change no URL, position or focus. Width as on Learn (127 at 375, ≥152 at 1440).
- The end row unchanged: "That’s the whole lesson, and the last lesson of this track." and "Back to the track" to the track, visible at 375 (Explain) and 1440.

**21, the bar's part**
- `next === null`, `number < total`: the title is "No next lesson is ready yet." The end row's "…the last ready one for now. Lessons a to b are coming soon." unchanged, and "Lesson 20 is coming soon." when `total = number + 1`.

**29. Speed**
- Four clicks go 1× → 1.5× → 2× → 0.5× → 1×, label "Speed 1×. Click for 1.5×". During a run a speed change rescales the hold and does not stop the run.

**The deferred parts stay as they are**
- The empty log still reads "Nothing has happened yet. Press Play to start."
- The idle words at `firewalls.test.ts:266` and `subnetting.test.ts:166` are unchanged.
- With JavaScript off, `.console__controls` stays hidden (`no-script.test.ts:52`) and the end row shows.

## Every test file the build must update (the reviewer's list)

Unit tests:
- `src/engine/playback.test.ts`: `toggle` :101-162; the no-steps case and holds :242-264; timers :291-356; :374-388 (`usePlayback.length`, E3); `playLabel` and `ended` (E10).
- `src/lesson/LessonConsole.test.tsx`: :98 regex; :204 → walk; :237-272 Play / Pause / Replay; :287-295 Watch again; :460 Space; :473 focus (add the forward button); :488 end focus.
- `src/lesson/LessonConsole.storage.test.tsx`: :20, :65-74.
- `src/lesson/useLessonShortcuts.test.tsx`: only if `toggle` is renamed.
- `src/lesson/announce.test.ts`: :53-66 (`createPlaybackReducer`, `toggle`, `ended`).
- `src/lesson/ScenePanel.test.tsx:42`, `ScenePanel.packets.test.tsx:23`, `ScenePanel.switch.test.tsx:22`: `ended` (E10).
- `src/scenes/drivers/net-map.test.ts`: :896-897, :920-921, :1086-1087 (E12).

End-to-end:
- `e2e/support.ts`: :101 `playButton` → `.cbtn--alt`; :102 `nextButton` (the forward button now; E1 keeps it a button at Practice); :149 `atEnd = disabled('Next step')` is never true now; `pressKey` waits 10 s for a move → no longer makes at Practice.
- `e2e/lesson.spec.ts`: :52-57 `playToReplay`; :86, :135, :262 loop on `atEnd`; :144-162; :209-233 (a fresh `?step=N` then Play, which now runs from the unit's first step); :306-338 (the reduced-motion run time, its `MutationObserver` on "Replay", `.cbtn--play`).
- `e2e/batch1.ts:24-29` (`playToEnd`, used by `arp`, `nat`, `switch`, `load-balancers` and `batch2.ts`'s `mac-address`).
- `e2e/switch.spec.ts:118-126`, `e2e/load-balancers.spec.ts:138-146` ("Replay").
- `e2e/router.spec.ts`: :27-32, :170-180 (`?step=3` then Play).
- `e2e/subnetting.spec.ts:91-96`; `e2e/ports.spec.ts:58-63` (`?step=4` then Play).
- `e2e/site.spec.ts`: :64-70 `finishLesson`; :1163 `played()`; :1203 `atEnd` loop; the @phone tests 6, 7, 8 and 9, 8 Bits, 8 Rules (:1346-1347), 10 and 11 (:1358, :1386), 13 and 14 (:1412): each opens `?step=N` and presses Play to play step N; the step now plays on arrival, so the click goes.
- `e2e/visual.spec.ts:42-56` (step 3 via Play → Pause → Play) and its screenshots.
- `e2e/reading.spec.ts:305-315`: the forward button's x at 1440 moves from 1377 to 1261 (§12).
- Re-run, should still pass: `e2e/tablet.spec.ts` :113-120 and :211; `e2e/glossary.spec.ts:410`.

Leave alone: `e2e/site.spec.ts:786` and the hub tests (`TrackPanelProgress`, `TrackRoute`, `TrackSide`, `hub.test.ts:127`; "Watch again" there is the track card's link); `LogPanel.test.tsx:193`; `keyboard.test.ts`.

Where CI runs these: the `phone` project runs only `site.spec.ts` @phone, and `lesson.spec.ts` runs at d1440-dark. Check 6's 375, 360 and 320 measurements live in `site.spec.ts`'s @phone block or set their own viewport inside a d1440-dark spec. The `tablet` project (`tablet.spec.ts`) is not in CI's pass; run it by hand for this unit.
