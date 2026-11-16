# D14: the lesson's flow

The spec for unit D14 of job 15 (`plan-job15.md`, decisions 1 to 5). The prototype is `prototypes/d14-lesson-flow.html`: one file, no network, playable through a whole lesson (HTTP) at any width, with a panel that switches the Play variant (A or B), the end case, the theme and reduced motion. Designed 2026-11-15 against the site at `abc1646` and `prototypes/s17-lesson-flow-facts.md` (S17).

The Lesson page keeps its layout: the top bar, the outline, the scene, the explanation and the log, and on a phone the scene pinned under the top bar, the four tabs and the controls pinned at the bottom at 48px. What changes is what the buttons say and do, the end of Practice, how a wrong answer reads, and one line of keys.

The figure in the prototype is a stand-in (three boxes and a moving dot); the figure is not this job. The event timings are a stand-in too (1.9 s a message at 1×, which reproduces S17's measured times within 0.5 s); the real driver times each event by its route.

## 1. What changes, in one table

| # | Today | D14 | Decision it touches |
|---|---|---|---|
| 1 | Play runs every step with a 2.6 s hold; HTTP's step 1 is on screen 2.8 s. | **A:** nothing runs unless asked; each step plays once on arrival and waits. "Play all" keeps today's run. **B:** the run stays, and each step's time is paced to its words (200 words a minute at 1×), shown as a countdown on the forward button; Pause stops it. | Build spec playback row, `docs/superpowers/specs/2026-11-05-techconcepts-redesign-build-design.md:41` (**owner, 2026-11-05**). Both variants reopen it. |
| 2 | The orange button reads Play, Pause, Replay or Watch again; going on takes the icon-only › (36×34 on a desktop). | The orange button always goes forward and says where: "Next step", "Go to Learn", "Go to Practice", "Next lesson". The › button is gone: the orange button is the forward button. Playing and replaying move to a smaller button beside it. | The same row (Play, Pause, Replay); direction §7 ("Back and Next are pinned at the bottom", as built). |
| 3 | Practice ends on "That's the whole lesson." in small grey text; Practice is never ticked; Watch again stays orange. | A closing block: "That's the whole lesson." as a heading, the lesson's own pattern as a row of lit tapes, and Up next as the primary action, in the block and in the controls. Practice is ticked in the outline once every question has an answer. | Build spec §6.3 end row, `:153` (no owner mark); `Explanation.tsx` EndRow. |
| 4 | A wrong pick changes only the border to ink. | The option says it: a ✕ and "Not this one" on the option, a light hatch, the feedback's "Not quite." led by the same ✕, and a way back to Learn. No error colour (`console.css:1088` kept). A right pick keeps its green, with a ✓ and "Right". | D1 §6 (the feedback's source numbers, kept); `console.css:1088`. |
| 5 | The keys work and nothing says so. Watch › Learn › Practice are boxed like buttons and are not. | One line in the log's head names Space, ← and →, where a keyboard is likely. Watch, Learn and Practice lose their boxes and read as words. The empty log says what it is for. | None. |

## 2. What stays

- The layout of every width (direction §7, D1, D2, D3): the top bar, the outline's 268px, the scene, the words' column, the log under both, D1's reading layout and folded log in Learn and Practice; on a phone the 52px top bar, the scene at 34% (18% reading), the 48px tabs, the four parts, and the 64px control bar.
- The control bar's geometry on a phone: four controls, 48px tall, 8px apart, 12px from the edges. Today: speed 48, ‹ 48, Play 183, › 48. D14: speed 48, ‹ 48, the play button 48, the forward button 183. The widest button stays the widest and moves under the thumb at the right, where › was.
- The speed button: one button that cycles 0.5×, 1×, 1.5×, 2× (owner, 2026-11-05).
- The narration and every lesson word (copied from `src/content/lessons/what-is-http.ts`); the stamp; the numbered sources; Practice's heading and "Just for you. Nothing is scored or saved."; the feedback's words and their source marks (D1 §6).
- Moving by hand plays the step once (build spec row, "Moving by hand stops the run"), except as variant B says for its forward button during a run.
- The outline, Resume, `?step=` links, the progress store; the top bar's segments, and their fill during a hold or countdown (hidden under reduced motion, as today).

## 3. The control row, both variants

Touches: the build spec's playback row (owner, 2026-11-05: Play, Pause, Replay); direction §7 ("Back and Next are pinned at the bottom", as built, no owner mark); `PlaybackControls.tsx`.

**Order, left to right, at every width:** speed, Back (‹), the play button, the forward button. The › button is removed: the forward button is the old Next, labelled and wide. Today's order was speed, ‹, Play, ›; the widest button moves one place right, under the thumb, where › was.

| Control | Class | Desktop (≥1100, in the log head) | Tablet on its side (900–1099) | Phone layouts (≤1099 otherwise) |
|---|---|---|---|---|
| Speed | `cbtn cbtn--speed` | 52×34, unchanged | 52×44 | 48×48 |
| Back | `cbtn` (aria-label "Previous step") | 36×34, icon, unchanged | 44×44 | 48×48 |
| Play button (new role) | `cbtn cbtn--alt` | icon 13px + words, `min-width: 118px; padding: 0 12px`, start-aligned | as desktop, 44 tall | **icon only**, 48×48, icon 16px; its words are its `aria-label` |
| Forward button (new) | `cbtn cbtn--go` | `min-width: 152px; padding: 0 12px 0 16px`; words `600 16px/1 var(--display)`, sentence case; the › icon (14px) at the right end | as desktop, 44 tall | `flex: 1` (183px at 375 wide), words 17px |

- Gaps: 6px on a desktop (as today), 8px on a phone (as today). The phone bar stays 64px with 8px/12px padding.
- The forward button takes the accent pair: `--accent` ground and border, `--accent-ink` words (white on `#b04617`, 5.9:1; `#1c0c03` on `#f0702e`). The play button takes `.cbtn`'s tile. Only the forward button is orange.
- The words of the forward button move from the old Play's `700 13px` mono capitals to the display face in sentence case (direction §6: "buttons and labels: Barlow Semi Condensed"; "labels are sentence case"). The speed button keeps its mono figures.
- Titles (the hover tip on a desktop) name the key: "Next step (→)", "Pause (Space)", "Previous step (←)". The forward button at Practice has no key in its title.
- Back is `aria-disabled` on the Overview, as today. The forward button is never disabled.
- The forward button is a `<button>` everywhere except Practice's "Next lesson" and "Back to the track", which are `<a class="cbtn cbtn--go" href>` (they leave the page).

**The forward button's words, both variants:**

| Slot | Words | Does |
|---|---|---|
| Overview | A: "Watch step 1". B: "Play the steps" | A: a hand move to step 1. B: starts the run at step 1. |
| Step 1 to n−1 | "Next step" | A hand move to the next step (B, during a run: skips the countdown; §5). |
| Step n (the unit's last) | "Go to Learn" | A hand move to Learn. |
| Learn | "Go to Practice" | A hand move to Practice. |
| Practice: a next lesson | "Next lesson" | Opens the next ready lesson (`next.url`). |
| Practice: a following unit | "Go to <unit name>" (e.g. "Go to HTTPS") | Goes to that unit's Overview; focus to the explanation, as EndRow does today. |
| Practice: the track's last lesson, or the last ready one | "Back to the track" | Opens the track page. |

The words fit the phone's 183px at 17px: the longest, "Back to the track", is 118px, 140px with its icon, in the 153px inside the padding. On a desktop the button grows past 152px to fit.

**Keys, both variants** (`useLessonShortcuts.ts`, the ignore rules unchanged): → does what the forward button does, except at Practice, where it does nothing (it never leaves the page). ← does Back. Space presses the play button (§4, §5); nothing when that button is `aria-disabled`. A held Space still does nothing more (repeats ignored).

## 4. Variant A: step by step

Nothing moves on by itself unless the reader asks for the run. Arriving at a step plays it once and it waits there.

**The play button, A:**

| Where | Words, icon | Does |
|---|---|---|
| Overview | "Play all", ▶ | Today's run, from step 1: every step, holding 2.6 s between steps (÷ speed), stopping on the last step. |
| A step that is playing (by hand or in the run) | "Pause", ❚❚ | Stops; the step is shown complete (today's pause). |
| A step that has finished | "Replay step", ↺ | Plays this step again from its first message. `aria-disabled` on a step with no messages (HTTP's step 1). |
| Learn, Practice | "Watch again", ↺ | Play all, from step 1 (the position moves to step 1, as today's Watch again). |

- A run ends on the last step; the forward button then reads "Go to Learn" and the play button "Replay step". Nothing reads "Replay" any more.
- Any hand move during a run stops it, as today: the forward button, →, ←, Back, the outline, a `?step=` link, "Back to Learn".
- **Speeds.** A message's wait and the 2.6 s hold are divided by the speed, as today. A step a reader waits on has no timer, so speed changes only how fast its messages play.
- **Reduced motion.** A step reached by hand lands complete at once: all its messages applied, no waits, no pulse. (Today it waits out each message with the motion skipped, `playback.ts:143-144`; build spec §5, `:89`, says "everything jumps to its end state", so this follows the spec.) "Replay step" plays the messages with their waits and no motion, so the log fills one row at a time. Play all keeps its pace: the run is a timer, not motion. The top bar's fill is hidden, as today.
- **Space:** the play button: Play all on the Overview, Pause or Replay step on a step, Watch again in Learn and Practice.

**Engine (A):** `toggle` splits into two actions. `replayStep` (mode `step` from event 0, waits even under reduced motion) and `playAll` (today's `runFrom(first step)`). `go` under reduced motion sets `eventIndex` to the step's count and mode `idle`. `playLabel` is replaced by two functions, `forwardLabel(lesson, state, end)` and `playButton(lesson, state)` returning `{ words, icon, disabled }`. `HOLD_MS` stays 2600.

## 5. Variant B: the paced run

The run stays, and each step stays long enough to read. A countdown on the forward button shows how long, and Pause stops it.

**The pace, and why.** A step of a run stays on screen for its **dwell**: the longer of (its messages' time + 2.6 s) and (its words × 300 ms), divided by the speed. Its words are the step's title, sub line and narration (Go deeper is closed). 300 ms a word is **200 words a minute at 1×**: below the 238 a minute adults average on non-fiction (Brysbaert, 2019, *Journal of Memory and Language* 109), because a beginner is reading new terms and watching a figure at once. It is still too slow for some and too fast for others, so the number is never hidden: the countdown shows the seconds, the speed button's label states the pace ("Speed 1×, paced for 200 words a minute. Click for 1.5×"), and the four speeds are 100, 200, 300 and 400 words a minute.

| HTTP step | Words | Messages at 1× | Dwell 0.5× | 1× | 1.5× | 2× |
|---|---|---|---|---|---|---|
| 1 Client Request | 73 | 0 s | 43.8 s | **21.9 s** | 14.6 s | 10.9 s |
| 2 DNS Resolution | 55 | 3.8 s | 33.0 s | 16.5 s | 11.0 s | 8.3 s |
| 3 TCP Connection | 62 | 5.7 s | 37.2 s | 18.6 s | 12.4 s | 9.3 s |
| 4 HTTP Exchange | 97 | 3.8 s | 58.2 s | 29.1 s | 19.4 s | 14.5 s |
| 5 Render Page | 68 | 7.6 s | the run ends when its messages end; no countdown | | | |

(The words: split on white space, the `**` marks removed. S17 counted 84 for step 1 by taking the whole panel, kicker and Go deeper's line included.)

**The countdown.** From a step's start to its end, while the run is going and the next slot is a step:

- The forward button reads "Next step" and, after a 1px divider (`--accent-ink` at 40%), the seconds left: `700 12.5px` mono, tabular figures, "21 s", rounded up, padded 9px from the divider. It is `aria-hidden`; the button's name stays "Next step".
- A 3px bar along the button's foot fills left to right over the dwell (`--accent-ink` at 55%). Hidden under reduced motion; the seconds still count.
- The top bar's next segment fills over the same dwell (today's hold fill, stretched); hidden under reduced motion, as today.
- A change of speed during a dwell rescales what is left (the clock counts 1× time, decremented by elapsed × speed).

**The play button, B:**

| Where | Words, icon | Does |
|---|---|---|
| Overview | "Step by step", ▶\| | A hand move to step 1, no run. |
| A step, the run going | "Pause", ❚❚ | Stops the run and the countdown; the step is shown complete; the seconds left are kept. |
| A step, after Pause | "Play", ▶ | The countdown goes on from where it stopped; the step does not play again. |
| A step reached by hand | "Play", ▶ | Starts the run from this step. |
| The last step after the run, Learn, Practice | "Watch again", ↺ | The run from step 1. |

- **Hand moves in B.** The forward button and → *during a run* skip the rest of the dwell: the next step starts and the run goes on. Without a run they are hand moves as in A. Back, ←, the outline, a `?step=` link and "Back to Learn" stop the run, as today.
- **Go deeper pauses the run.** Opening Go deeper during a run is a Pause (the reader is reading more); a short note says so: "Paused while you read Go deeper." (`role="status"`, 2.6 s). Closing it does not restart the run.
- The run ends on the last step when its messages end: the forward button reads "Go to Learn" with no countdown, and the run never moves into Learn by itself.
- **Reduced motion.** As A for hand moves (a step lands complete). The run keeps its dwell: the dwell is reading time, not motion. The seconds count; the bar and the segment's fill are hidden.
- **Space:** the play button: Step by step on the Overview, Pause or Play on a step, Watch again after the run, in Learn and in Practice.

**Engine (B):** the state gains `budget` (1× ms left in the step's dwell) and `saved` (the budget kept by Pause, for the same position). `holding()` returns the dwell's remaining time instead of `HOLD_MS / speed`. `dwell(lesson, position)` is a pure function of the step's words and its events' durations, tested on its own.

## 6. Which, and why

| | A: step by step | B: paced run |
|---|---|---|
| HTTP's step 1 at 1×, unasked | stays until the reader moves | 21.9 s, with the seconds shown |
| HTTP's step 1 in the run at 1× | 2.7 s (Play all, today's pace, measured) | 21.9 s |
| Pressing the orange button over and over | one step a press, each played once | the same (Overview: starts the run; then each press skips ahead) |
| Hands-free watching | Play all, at today's pace | the default on the Overview, at a reading pace |
| What moves on its own | nothing, unless Play all | the countdown, every step |
| New rules | Replay step; reduced motion lands complete | the dwell, the countdown, Play resumes, Go deeper pauses, the forward button skips |
| Engine change | small: split `toggle`, change labels | larger: a dwell per step and a kept budget |

**Recommended: A.** A reader cannot be outrun by something that waits for them, and A needs one rule ("the orange button goes on"). B buys a hands-free lesson at a pace most beginners can read, which today's Play promised and did not keep; its price is a number that moves on every step and four more rules. If the owner wants the run itself to keep the reader's pace, A's Play all can take B's dwell without the rest of B; that is a third option, so it is listed under open questions, not drawn.

## 7. The lesson's ending, both variants

Touches: `Explanation.tsx` EndRow (`:189-230`); build spec §6.3 `:153` ("End row", no owner mark); `Outline.tsx` `Item` (`:46`); direction §7 (the stamp is not on up-next cards, kept).

The end block replaces EndRow, after the questions, in all four cases EndRow has today.

```
That's the whole lesson.                              ← h3, 700 24px/1.15 display, --ink-strong
[Client Request]┄[DNS Resolution]┄[TCP Connection]┄[HTTP Exchange]┄[Render]   ← Learn's pattern, as tapes
┌──────────────────────────────────────────────────┐
│ [HTTPS art]  UP NEXT                         [›] │  ← the Up next card, now the block's primary action
│              HTTPS                               │
│              Lesson 02 · Web pages, sealed       │
└──────────────────────────────────────────────────┘
```

**The block** (`div.end`): `display: grid; gap: 14px; margin-top: 4px; padding-top: 20px; border-top: 1px solid var(--line)`.

- **Heading** `h3.end__title`: `700 24px/1.15 var(--display)`, `letter-spacing: .005em`, `--ink-strong`.
- **The line** `p.end__line` (two cases only): `400 15px/1.5 var(--sans)`, `--ink`, `margin-top: -6px`.
- **The pattern** `ol.end__pattern` (`aria-label="The lesson’s pattern"`): the unit's `learn.pattern.names`, the lesson's own checked words, each an `li > span` tape: `padding: 5px 6px; border: 1px solid; border-radius: 2px; 600 13.5px/1.1 var(--display); letter-spacing: .02em; white-space: nowrap`. Between tapes, an 8×3px striped cable (`li + li::before`, a 3px-on 2px-off stripe). It wraps; a wrapped line starts with its cable piece. HTTP's five fit one line in the 560px column (499px) and take two lines at 375 wide.
  - **Not yet done:** tapes `--card-2` ground, `--line-strong` edge, `--muted` words; cable `--line-strong`.
  - **Done** (`.end[data-done]`, every question has an answer): tapes `--allowed` edge, `color-mix(in srgb, var(--allowed) 12%, var(--card))` ground, `--ink-strong` words; the cable `--allowed`. They light left to right, 220ms each, 70ms apart (`transition-delay: calc(var(--i) * 70ms)`); at once under reduced motion. This is the page's one moment of its own: the lesson's run drawn as a lit patch cable, done in the colour that means done (direction §6).
- **The action:**
  - **A next lesson:** the Up next card as today (art 104×76, kicker "Up next", title, `lessonLine`), now with a `1.5px solid var(--accent)` border, an `--accent-soft` hover ground, and a 32×32 square at its right end (`--accent` ground, the › icon in `--accent-ink`). The whole card is the link, as today.
  - **A following unit:** the same card without art: kicker "Next in this lesson", the unit's name, its `purpose`. A button; it goes to that unit's Overview and moves focus to the explanation (today's `jump`).
  - **The track's last lesson, and the last ready one:** a forward button (`cbtn cbtn--go`, a link) "Back to the track", in the block. **Hidden in the phone layouts** (`display: none` ≤1099, phone rules), where the bar's forward button, 64px below, already says it.

| Case (EndRow's branch) | Heading | Line | Action | Forward button |
|---|---|---|---|---|
| A next ready lesson | That’s the whole lesson. | none | Up next card | Next lesson |
| A following unit | That’s the whole of HTTP. (the current unit's name) | none | "Next in this lesson" card | Go to HTTPS (the next unit's name) |
| The track's last lesson (`number === total`) | That’s the whole lesson. | And the last lesson of this track. | Back to the track | Back to the track |
| The last ready one for now | That’s the whole lesson. | And the last ready one for now. Lessons 15 to 20 are **coming soon**. (`comingSoon()` as today; "Lesson 20 is **coming soon**." for one) | Back to the track | Back to the track |

**Practice ticked in the outline.** The Practice row's mark shows the green tick (`data-done`: `--allowed` ring, `--allowed-text` ✓) once every question of the current unit has a pick, right or wrong; the row keeps its current box while the reader is there. It comes from the console's in-memory picks (`LessonConsole.tsx:185-191`), so it is gone on reload, like the picks. Nothing is stored or scored. `Item` gains a `done` prop that is true for `target < position` (as today) or for the unit's Practice when its picks are complete; the `aria-current` stays.

## 8. A wrong answer, both variants

Touches: `Practice.tsx`; `console.css:1081-1111` (the "no error colour" choice at `:1088` is kept); D1 §6 (the feedback's marks, kept).

- **The option** gets a third column, `grid-template-columns: 22px 1fr auto; align-items: baseline`, holding a tag (`span.practice__tag`, `600 13.5px/1 var(--display)`, a 12px icon 5px before the words):
  - right: ✓ "Right", in `--allowed-text`; the option keeps today's green border and tint.
  - wrong: ✕ "Not this one", in `--ink-strong`; the option keeps today's `--ink` border and strong letter, and gains a hatch: `background-image: repeating-linear-gradient(135deg, transparent 0 6px, var(--line) 6px 7px)` over `--tile`. The hatch is the line token, so it is no colour of its own in either theme.
  - Up to 400px wide the tag drops under the option's words (`grid-column: 2; margin-top: 4px`), so the words keep the width.
  - The tag is visible only on the picked option; `aria-pressed` stays as today. The tag's words are read with the button ("The server is too busy to answer. Not this one").
- **The feedback** leads with the same ✕ (11px) before "Not quite." on a wrong pick; a right pick's lead word is unchanged. The live region and the marks are as today (D1 §6).
- **The way back to Learn** (`button.practice__see`), after the feedback, on a wrong pick only: the ↩ icon (14px), then "Back to Learn: <term name>" when the question names a Learn term, else "Back to Learn". `600 14px/1.3 var(--sans)`, `--ink-strong`, the site's underline; 32px tall on a desktop, 44px on a phone. It is a hand move to the unit's Learn (it stops a run); when it names a term it brings that term's row to the middle of the panel and gives it the `--here-soft` ground until the next move (no animation). The picks stay (in memory, as today), so "Go to Practice" brings the reader back to their answers.
- **Data.** A question may carry `see?: string`, the id of one of its unit's Learn terms (schema: optional; `defineLesson` checks that it names a term of the same unit). No lesson word changes. In the prototype, HTTP's first question names "Status code" (`term-status`) and its second names none, to show both forms. Adding `see` to the lessons is an author's task (open question 2).

## 9. The keys, the chips and the empty log, both variants

- **The key line** (`p.log__keys`, in the log head between the legend and the controls): `<kbd>Space</kbd> play or pause <kbd>←</kbd> back <kbd>→</kbd> next`. Muted `400 13px/1.2 var(--sans)`; each `kbd` 22px tall, `min-width: 22px; padding: 0 6px`, 1px `--line-strong` border with a 2px foot, 4px corners, `--tile` ground, `500 11.5px` mono in `--ink-strong`; 6px between items. It shows only where a keyboard is likely and there is room: in the desktop layouts (`(min-width: 1100px)`, or the tablet-on-its-side query of `console.css:76`) and with `(hover: hover) and (pointer: fine)`, the log head is a size container (`container-type: inline-size`), and `@container (min-width: 925px)` shows the line. On a desktop that is from about 1260px wide (the line needs 264px; at 1100 the head has 766px for 920px of parts; at 1280 it has 946px). Below that, and in every phone layout, the keys are in the buttons' titles only (§3). It is not announced (`aria-hidden` is not needed: it is plain text in reading order after the legend).
- **The chips.** "This lesson: Watch › Learn › Practice" on the Overview keeps its words and loses its boxes: the three words are `600 16px/1.2 var(--display)` in `--ink-strong`, the line `400 14.5px/1.4` muted. Nothing about them now looks pressable; the outline is the lesson's map that can be pressed.
- **The empty log.** "Nothing has happened yet. Press Play to start." (`LessonConsole.tsx:84`, IDLE) becomes "Nothing has happened yet. Messages show here as they’re sent." It no longer names a button, and it says what the log is for (the critique's third point under finding 5). A step's or unit's own idle words (lesson words) are unchanged; three of them name Play (open question 3).

## 10. Breakpoints

| Width | Layout (direction §7) | D14 |
|---|---|---|
| ≤760 | phone | The control bar: speed, ‹, the play button (icon), the forward button (183px at 375). No key line. The end block's own "Back to the track" hidden. Option tags drop under the words up to 400px. |
| 761–1099, upright or under 900 | the phone layout, grown (520px column) | As the phone; the bar inside the 520px column. |
| 900–1099 on its side | desktop with the outline in a tab | The desktop row at 44px. The key line when the container query passes: with the outline folded the log head is the window less 24px, so it shows from about 980px wide (1024: yes; 900: no). Not drawn in the prototype, which shows the phone layout up to 1099. |
| ≥1100 | desktop | The desktop row at 34px; the key line from about 1260px. |

With JavaScript off the page keeps its stacked layout and has no controls, as today.

## 11. Every word of new copy

| Where | Words |
|---|---|
| Forward button | Watch step 1 (A) · Play the steps (B) · Next step · Go to Learn · Go to Practice · Next lesson · Go to <unit> · Back to the track |
| Forward button, B's countdown | <n> s |
| Play button | Play all (A) · Step by step (B) · Pause · Play (B) · Replay step (A) · Watch again |
| Button titles | <words> (→) · <words> (Space) · Previous step (←) |
| Speed button, B only | Speed <x>×, paced for <200 × x> words a minute. Click for <next>× |
| Note, B | Paused while you read Go deeper. |
| End block | That’s the whole lesson. · That’s the whole of <unit>. · And the last lesson of this track. · And the last ready one for now. Lessons <a> to <b> are coming soon. · Next in this lesson · Up next (kept) |
| Option tags | Right · Not this one |
| Back to Learn | Back to Learn · Back to Learn: <term name> |
| Key line | Space play or pause ← back → next |
| Empty log | Nothing has happened yet. Messages show here as they’re sent. |
| Pattern list's label (read only) | The lesson’s pattern |

Removed: "Replay"; "Watch again" as the orange button's words; "That’s the whole lesson, and the last lesson of this track." and "…, and the last ready one for now." as one sentence (split into the heading and the line); "Press Play to start."

No new words state a fact about a protocol. The pattern's names are Learn's own checked words.

## 12. Measurements

Today: the dev server at `abc1646` (`/how-the-internet-works/what-is-http/`), and S17's timings. D14: the prototype, in the same browser, measured with scripts on the page.

| | Today | D14 A | D14 B |
|---|---|---|---|
| HTTP step 1 on screen at 1×, reached by Play | 2.8 s (S17) | until the reader moves; 2.7 s if they choose Play all | **22.1 s** (measured; dwell 21.9 s) |
| Step 1 at 0.5× / 1.5× / 2× | 5.2 / 1.7 / 1.3 s (hold ÷ speed) | no timer (Play all: 5.2 / 1.7 / 1.3 s) | 43.8 / 14.6 / 10.9 s |
| Forward action, 1440 | › icon, 36×34, no words | "Next step", 152×34, orange | the same, with "21 s" |
| Forward action, 375 | › icon, 48×48 | "Next step", 183×48, orange | the same, with "21 s" |
| Play/replay, 1440 | Play 112×34, orange | play button 118–122×34, tile | the same |
| Play/replay, 375 | Play 183×48, orange | play button 48×48 | the same |
| Phone control bar | speed 48, ‹ 48, Play 183, › 48 at x 12/68/124/315 | speed 48, ‹ 48, play 48, forward 183 at x 12/68/124/180 | the same |
| Tap targets on the phone | all ≥48×48 | all ≥48×48; Back to Learn 44 tall; the Up next card 104px tall | the same |
| Page width at 375 | 375 (no sideways scroll) | 375 | 375 |
| Practice's words, 1440, nothing picked | the end row fits | 748px in a 729px panel (19px of scroll); end block 206px | the same |
| Practice's Explain tab, 375, both answers wrong | 714px of words in a 502px tab | 1,060px | the same |

**The orange button's words at each slot (both variants unless marked):** Overview "Watch step 1" (A) / "Play the steps" (B); steps 1–4 "Next step"; step 5 "Go to Learn"; Learn "Go to Practice"; Practice "Next lesson", "Go to HTTPS", or "Back to the track". Today: Play, Pause, Replay, Watch again, Watch again.

## 13. Acceptance checks

Each can be a unit test (`playback.test.ts`, `LessonConsole.test.tsx`, `Practice.test.tsx`, `Outline` tests) or an end-to-end check (`e2e/lesson.spec.ts`, d1440-dark and phone). HTTP is the example lesson. "Forward button" is `.cbtn--go`; "play button" is `.cbtn--alt`.

**Both variants**

1. The controls are, in order, the speed button, "Previous step", the play button and the forward button; there is no button named "Next step" other than the forward button, and none named "Replay".
2. On the Overview, after step 5 has played, on Learn and on Practice, the forward button's accessible name is respectively the variant's Overview words, "Go to Learn", "Go to Practice", and "Next lesson" (HTTP has a next lesson).
3. The forward button is the only control with the `--accent` background; on Learn and Practice the play button reads "Watch again" and is not orange.
4. At 375×812 the four controls are 48px tall, the forward button is the widest and ends 12px from the right edge, and the page does not scroll sideways.
5. → does what the forward button does on the Overview, a step and Learn, and nothing on Practice (the URL does not change). ← goes back. Space presses the play button; a repeated Space does nothing more.
6. With reduced motion, a step reached by the forward button shows all its log rows at once (HTTP step 3: three rows of its own, five in all).
7. A lesson whose unit has a following unit shows "Go to <unit>" on its Practice; pressing it shows that unit's Overview and focuses the explanation.
8. The track's last lesson shows the heading "That’s the whole lesson.", the line "And the last lesson of this track.", and a forward link "Back to the track" to the track's URL; the last ready one shows "And the last ready one for now." and the coming-soon words.
9. Practice shows `h3` "That’s the whole lesson." and an `ol` of the unit's pattern names in order (HTTP: Client Request, DNS Resolution, TCP Connection, HTTP Exchange, Render).
10. Before every question has a pick, `.end` has no `data-done` and the outline's Practice row is not done; after the last pick (right or wrong) both are, the Practice row shows ✓ and keeps `aria-current="step"`. After a reload neither is.
11. Picking a wrong option shows "Not this one" in that option, a ✕ before "Not quite.", and a button "Back to Learn: Status code" (HTTP Q1, which names `term-status`) or "Back to Learn" (a question with no `see`). A right pick shows "Right" and no Back to Learn.
12. The wrong option's border is `--ink` and no part of it uses `--blocked`; the right option's border is `--allowed`.
13. "Back to Learn: Status code" shows Learn, the Status code row is in view with the `--here-soft` ground, and the picks are still there after "Go to Practice".
14. At 1440×900 on a fine pointer the log head shows "Space", "←" and "→" in `kbd`; at 1100×800 and at 375×812 it does not; the buttons' titles name the keys at every width.
15. On the Overview the words Watch, Learn and Practice have no border.
16. The empty log reads "Nothing has happened yet. Messages show here as they’re sent." unless the step or unit has its own idle words (HTTP step 1 keeps "Nothing on the network yet. The browser is still getting ready.").
17. The speed button still cycles 0.5×, 1×, 1.5×, 2× and its label names the next speed.

**Variant A only**

18. Pressing the forward button on the Overview shows step 1 and starts no timer: after 30 s at 1× the page is still on step 1.
19. On a step with messages, the play button reads "Pause" while it plays and "Replay step" when it has finished; "Replay step" plays the step again from its first message (the log loses that step's rows, then refills them). On HTTP step 1 it is `aria-disabled`.
20. "Play all" on the Overview runs the steps with a hold of 2600 ms ÷ speed and stops on step 5 with the forward button "Go to Learn"; any hand move during it stops it.
21. With reduced motion, "Play all" keeps its pace (step 2 lasts its two messages' durations plus 2600 ms).

**Variant B only**

22. `dwell(HTTP, step 1)` is 21,900 ms at 1× (73 words × 300 ms); step 2 is 16,500 ms; a step's dwell is never less than its messages' time plus 2600 ms.
23. "Play the steps" shows step 1 with the forward button "Next step" and "22 s"; step 1 stays 21.9 s (± 0.2 s) at 1× and 10.9 s at 2×, then step 2 starts.
24. Pause stops the count; Play continues it from the same number without replaying the step's messages.
25. The forward button during a run starts the next step and the count continues there; Back during a run stops it (the play button reads "Play").
26. Opening Go deeper during a run pauses it and shows "Paused while you read Go deeper."
27. The run ends on step 5 when its messages end, with no count, and never moves into Learn by itself.
28. Changing speed during a count rescales what is left (at 1× with 20 s left, 2× shows 10 s).
29. With reduced motion the count still runs and the run keeps its dwell; the bar on the forward button and the top bar's fill are not shown.
30. The speed button's label in B is "Speed 1×, paced for 200 words a minute. Click for 1.5×".

## 14. Decisions

1. The forward button replaces ›, not a fifth control: the phone's four 48px slots stay, and the forward action gets the widest one (measured above).
2. Both variants share every change but Play, so the owner compares one thing.
3. A keeps Play all at today's 2.6 s hold, because the plan defines it as today's run.
4. B paces by title, sub and narration only, because Go deeper is closed while a run goes.
5. B's countdown rides on the forward button, because that is what will happen when it ends, and pressing it does it now.
6. B's Overview offers "Step by step" as its other button, so each variant's Overview offers both ways in, its own as the orange one.
7. Opening Go deeper pauses B's run, so a countdown never runs out under someone reading more.
8. Reduced motion lands a hand-reached step complete, as the build spec's §5 says; runs keep their pace in both.
9. The end block uses Learn's pattern names, so its only fact-like words are already checked.
10. Practice is ticked when every question has a pick, right or wrong: answering is the practice; nothing is scored.
11. A wrong option is hatched in the line token and tagged in words, keeping `console.css:1088`'s choice of no error colour.
12. The pointer to Learn is per question and optional, so a lesson without it still gets "Back to Learn".
13. The key line shows only with a fine pointer and room; elsewhere the titles carry the keys.
14. The chips become words rather than links: the outline is already the map you can press.
15. The forward button's words move to the display face in sentence case (direction §6), mono stays for the speed's figures.

## 15. Open questions for the owner

1. **A or B** (or neither): the playback decision of 2026-11-05 stands until then. A is recommended. A third option, not drawn: A, with Play all paced as B's run.
2. **The pointer's data.** Each question may name the Learn term that covers it (`see`). Should the authors add it to every lesson's questions (no lesson words change), or should every wrong answer say only "Back to Learn"?
3. **Three lessons' idle words name Play:** IP address, Firewalls and Subnetting say "Press Play, or pick a step." Under A there is no button called Play (the Overview's is "Play all"). They are lesson words, so they need the owner's word to change; under B they stay true.
4. **The Lesson page stays close to its design** (the owner, 2026-11-10): the › button goes and the orange button moves one place right. The measured gain is above (§12); it is the only rearrangement.

## 16. The prototype

`prototypes/d14-lesson-flow.html` opens from the file system. The yellow "Prototype" button (bottom left on a desktop, top right on a phone) opens a panel that is not part of the design: Play (A or B), the end case (next lesson, next unit, track's last, last ready), theme, reduced motion, a readout of how long the current place and step 1 have been on screen, and Start over. The address can set them: `?v=a|b`, `?end=next|unit|last|soon`, `?theme=dark`, `?rm=1`, `?step=0..7` (as the site's `?step=`), `?picks=status-404:1,more-files:1`, `?panel=1` (opens the panel), `?panel=0` (hides it). Leaving actions (Next lesson, Back to the track, the next unit) show a note instead of navigating.

The figure is a stand-in (three boxes and a moving dot), messages take 1.9 s at 1×, and the Learn facts and Watch steps' Go deeper marks are left out; everything else in the explanation is the lesson's words. The prototype draws the phone layout up to 1099px; the tablet-on-its-side layout is not drawn.
