# S17: the lesson's flow, Play, the way forward and the ending (job 15, 2026-11-15)

Two parts. Part 1 is the findings this job answers, from the `impeccable critique` of the Lesson page run on 2026-11-15 on `revamp` at `2bb68f5` (one Opus design reviewer through DHCP, HTTP and Subnetting at 375×812 and 1440×900 in both themes; the headline numbers re-measured by the session's orchestrator with a headless browser on the built site). Part 2 is the scout's report (Haiku), on `revamp` at `c368520`, saved by the orchestrator as written, with the machine's folder taken off the paths (the scout's own rules let it write no file). Paths are repo-relative. Evidence is path:line. Nothing was edited.

## Part 1: what the critique found on the Lesson page

Score: 27 of 40 on Nielsen's ten heuristics (Acceptable). Lowest: user control and freedom 2, recognition rather than recall 2, help and documentation 2.

| # | Severity | Finding | Evidence |
|---|---|---|---|
| 1 | P1 (the reviewer said P0; Pause and stepping by hand exist) | **Autoplay outruns reading.** Play runs every step with a 2.6 s hold. A beginner at about 200 words a minute needs 20 to 35 s a step. | Re-measured on `/how-the-internet-works/what-is-http/` at 1440×900, 1×: step 1 on screen 2.8 s, step 2 6.4 s, step 3 8.6 s, step 4 6.9 s, step 5 8.1 s, then Replay. The reviewer counted 84 words in HTTP's step 1, 59 to 81 in DHCP's steps (about 4.5 s each) and 116 in Subnetting's step 1 (8.3 s). Reduced motion keeps the same pace. `src/engine/playback.ts:10` |
| 2 | P1 | **The way forward is unlabelled, and the primary button points back.** After the last step the orange button reads Replay; in Learn and Practice it reads Watch again. Going on to Learn takes the icon-only Next step chevron, 36×34. | `src/engine/playback.ts:118`, `src/lesson/PlaybackControls.tsx:72-92` |
| 3 | P2 | **The ending has no ending.** "That's the whole lesson." is small grey text; Practice is never ticked in the outline; Watch again stays the primary button. | `src/lesson/Explanation.tsx:206` |
| 4 | P2 | **A wrong answer reads as merely selected.** Only the border colour changes; a right answer gets a green fill. | `src/lesson/console.css:1089` |
| 5 | in heuristics 6 and 10 | **The keys are invisible.** Space and the arrow keys work and nothing on screen says so. The Watch › Learn › Practice chips look like buttons and are not. Nothing explains what the log is. | not re-measured |

Also found on the Lesson page, and **not in this job** (they need figure work; the critique's second group): on a phone the figure's labels render at an effective 1.3 to 7.3 px and the Sequence view at about 5 px; Subnetting's bits board sits behind a fourth tab that never shows a change mark.

What the reviewer said works, to keep: the narration's voice (the everyday idea, then the term, one idea a step); the stamp, the numbered sources and "Nothing is scored or saved"; the phone's controls in the thumb zone at 48px, staying put through every stage.

## Part 2: the scout's report

1. Playback model (`src/engine/playback.ts`). Modes: idle, step, run, hold (:22). Actions: go, next, prev, toggle, tick, holdDone, cycleSpeed (:34-43). go/next/prev stop any run and set mode 'step' if the position has events, else idle (:63-65). toggle during run or hold sets idle and eventIndex to the step's count, so the step shows complete (:88). Otherwise on a step not yet ended it runs from that step; on Overview, Learn, Practice or after an ended run it runs from the unit's first step (:89-93). HOLD_MS = 2600 (:10). settle() sets 'hold' when the next slot is a step of the same unit (:82-83). holding() returns ms HOLD_MS/speed (:126-127). usePlayback starts a timer that dispatches holdDone (:155-157), which runs the next step (:110). TopBar fills the hold segment (`src/lesson/TopBar.tsx:54`), but not under reduced motion. After a unit's last step settle sets ended: true, mode idle (:84). playLabel (:118-123): 'Pause' if run or hold; 'Watch again' if the position is learn or practice; otherwise 'Replay' if ended, else 'Play'. Mode 'step' is set only by a hand move (go, next, prev, reached through the outline, Resume, ?step= links) and plays once, then goes idle (:80). No action plays exactly one step and stops: toggle in mode 'step' starts a run through the unit (:90). While mode is 'step', the label reads 'Play' (:118-123).

2. Controls (`src/lesson/PlaybackControls.tsx`), in order: (a) speed button, text "1×", aria-label "Speed 1×. Click for 1.5×", not icon-only (:52-58). (b) "Previous step", icon-only, aria-disabled at the start (:62-69). (c) Play, not icon-only: a path icon plus visible text from playLabel, disabled when the unit has no steps (:72-80). (d) "Next step", icon-only, aria-disabled at the end (:84-91). Last Watch step to Learn: the Next step button (also ArrowRight); Play does not move. Learn to Practice: Next step. Slot order is Overview, steps, Learn, Practice (`src/engine/timeline.ts:22-29`).

3. Keyboard. Defined in `src/lesson/useLessonShortcuts.ts:27-45` (wired at `src/lesson/LessonConsole.tsx:197-201`): Space toggles (repeats ignored), ArrowRight next, ArrowLeft prev. Ignored with Alt, Ctrl, Meta or Shift (:29), inside a dialog (:30), and on controls, links and scroll regions per `src/lesson/keyboard.ts:7-49`. On-screen text: none found. Only code comments mention the keys (`LessonConsole.tsx:102`, `PlaybackControls.tsx:35`, `keyboard.ts:2`). The idle log line says "Press Play to start." (`LessonConsole.tsx:84`).

4. Lesson end (`src/lesson/Explanation.tsx`). Rendered only in the Practice branch (:385). EndRow (:189-217): "<p>That’s the whole lesson.</p>" (:206) appears only when there is no following unit and a next lesson exists. The card is an `<a class="upnext lift">` whose kicker is UP_NEXT_KICKER.next = "Up next" (`src/lib/hub.ts:108`), then the title and lessonLine (`hub.ts:101-103`). Other cases: "Next: <unit>" with "Go to <unit>" (:194-199); on the track's last lesson, "That’s the whole lesson, and the last lesson of this track." (:224). The outline (`src/lesson/Outline.tsx:46`) marks an item done only when target < position. On Practice, Practice is current (aria-current="step"), not done.

5. Practice answers (`src/lesson/Practice.tsx:53-75`). The picked button gets aria-pressed and data-result 'right' or 'wrong'. `src/lesson/console.css`: right is border var(--allowed) with a tint and allowed-text letter (:1081-1087); wrong is border var(--ink) and ink-strong letter (:1089-1094). The feedback has data-result (:1095-1111). A wrong pick always opens "Not quite." (`Practice.tsx:21`, 24-27). The CSS comment says wrong is not an error colour (`console.css:1088`).

6. Phone tabs (`src/lesson/LessonConsole.tsx`). Explain, Steps, Log (:26-31). A fourth tab from PANEL_TAB (:37): Table, Rules or Bits; none for the OSI message strip. Added at :165. The changed mark (:278-282) shows on the fourth tab only: aria-label "<name>, changed" and span.tab__mark. panelChange never marks bits (:52-53). On a tablet on its side, the Log and Table tabs drop out (:155-160).

7. Decisions.
   - Build spec, §3 table, row "Playback" (`docs/superpowers/specs/2026-11-05-techconcepts-redesign-build-design.md:41`, source "owner, 2026-11-05"): "One speed button that cycles 0.5×, 1×, 1.5×, 2× (default 1×). **Play runs every Watch step** from the current one to the last, holding about 2.6 s between steps, then shows Pause, then Replay. Moving by hand stops the run". Owner-marked; it covers speed, the hold, Pause, Replay, and hand moves.
   - Launch spec, :83 (§6.2, no owner mark): "Controls are play/pause, next step, previous step, replay and speed (0.5×, 1×, 2×)." Superseded by build :41 on speeds.
   - Build spec :153 (§6.3, no owner mark): "End row: 'Next ready lesson: <title>, lesson N' and a button." The code differs (Up next card).
   - Reduced motion: build spec :89 (§5, no owner mark): "With reduced motion, everything jumps to its end state..." Code: `playback.ts:143-144`, "Reduced motion changes no wait ... a run keeps its pace."
   - Back and Next: no spec names them. `docs/direction.md:242`, :258 (§7, "as built 2026-11-10", no owner mark) say "Back and Next are pinned at the bottom". The code has no "Back" label, only "Previous step" (`PlaybackControls.tsx:62`).
   - "Watch again": not in any spec or in `docs/direction.md` (grep). It appears only in code and tests.
   - `docs/direction.md` §2 has no playback row. §7 owner-decided bullet at :274 concerns Learn and Practice on a tablet, not playback.

8. Prototypes (names and one line each): `d1-lesson-reading.html`/`.md`, Learn and Practice reading layout at 1100px+ and feedback source numbers. `d2-lesson-phone.html`/`.md`, the lesson on a phone. `d3-lesson-tablet.html`/`.md`, the lesson 761 to 1099px. `d6-practice-page.html`/`.md`, the /practice page. `d7-practice-site.html`/`.md`, site changes for Practice, incl. a Lesson: Practice screen. `s1-lesson-facts.md`, a scout fact sheet of the built Lesson page. d10 to d13 `.html`/`.md`, per-lesson scene designs, no playback. No file named console or b1 to b3.

9. Tests pinning behaviour.
   - `src/engine/playback.test.ts`: :71-80 initial labels; :101-116 run, Pause, Replay; :118-123 HOLD_MS = 2600; :125-149 pause, Play restarts the step; :152-156 "Watch again" on Learn; :245-258 hold and Replay.
   - `src/lesson/LessonConsole.test.tsx`: :98 button name regex; :237-272 Play, Pause, Replay with waits of HOLD_MS; :287-295 Watch again; :463-465.
   - `src/lesson/LessonConsole.storage.test.tsx:20`, :65-70.
   - `src/lesson/useLessonShortcuts.test.tsx:38-46` (Space and arrows; held Space). `src/lesson/keyboard.test.ts:15-86`.
   - `e2e/lesson.spec.ts:52-57` (playToReplay), :144-149, :209-220, :257-261 (arrows), :307-335 (reduced-motion timing). Also `e2e/batch1.ts:24-29`, `e2e/router.spec.ts:27-32`, `e2e/subnetting.spec.ts:94-95`, `e2e/visual.spec.ts:52-54` (Pause, then Play), `e2e/site.spec.ts:1355` and :1383 (Replay|Watch again|Play), :239 and :246 (ArrowRight).
   - Not the console: `e2e/site.spec.ts:783` "Watch again" is a track-card button.

10. `git diff --stat revamp...job14/batch` on `src/lesson`, `src/engine`, `src/scenes/driver.ts`, `src/scenes/motion.ts`: 4 files, 248 insertions, no deletions. All four are tests: `src/lesson/ScenePanel.packets.test.tsx` (35), `src/lesson/ScenePanel.switch.test.tsx` (44), `src/lesson/panels/pool.test.tsx` (87), `src/lesson/panels/switch.test.tsx` (82). None of `src/engine`, `src/scenes/driver.ts` or `src/scenes/motion.ts` changes.

Not found: any "Back" label in `src/lesson`; any spec or direction text for "Watch again"; on-screen key hints; a mode or action that plays one step and stops from Play.
