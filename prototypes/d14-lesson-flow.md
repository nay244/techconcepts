# D14: the lesson's flow

This is the spec for unit D14 of job 15 (`plan-job15.md`, decisions 1 to 5). It is revised at the owner's word at the design gate (2026-11-15): "I like the idea of a one step a a time, however only keep "Next Step" and "Next Lesson", and "Play All"". Variant A, step by step, is taken. The control row has three labels: "Next step", "Next lesson" and "Play all". It also has "Pause", while a run is going (§4). After the owner asked about a replay button at the same gate, an icon-only replay (↺, named "Replay step") sits between Play all and the forward button (§3, §4).

The prototype is `prototypes/d14-lesson-flow.html`. It is one file with no network. It plays through a whole lesson (HTTP) at any width, with a panel that switches the end case, the theme and reduced motion. It was designed against the site at `abc1646` and against `prototypes/s17-lesson-flow-facts.md` (S17).

The Lesson page keeps its layout:

- the top bar, the outline, the scene, the explanation and the log;
- on a phone, the scene pinned under the top bar, the four tabs, and the controls pinned at the bottom at 48px.

What changes:

- what the buttons say and do;
- the end of Practice;
- how a wrong answer reads;
- one line of keys.

The figure in the prototype is a stand-in (three boxes and a moving dot); the figure is not this job. The event timings are a stand-in too: 1.9 s a message at 1×, which reproduces S17's measured times within 0.5 s. The real driver times each event by its route.

## 1. What changes, in one table

| # | Today | D14 | Decision it touches |
|---|---|---|---|
| 1 | Play runs every step with a 2.6 s hold. HTTP's step 1 is on screen 2.8 s. | Nothing moves on unless the reader asks. Each step plays once when the reader arrives, then waits. "Play all" keeps today's run, from step 1. | The build spec's playback row, `docs/superpowers/specs/2026-11-05-techconcepts-redesign-build-design.md:41` (**owner, 2026-11-05**). Reopened by the owner's word above. |
| 2 | The orange button reads Play, Pause, Replay or Watch again. Going on takes the icon-only › (36×34 on a desktop). | The orange button always goes forward. It reads "Next step" inside the lesson and "Next lesson" at its end. The › button is gone, because the orange button is the forward button. "Play all" and "Pause" move to a smaller button beside it, and replaying a step moves to an icon-only ↺ button. | The same row (Play, Pause, Replay). Direction §7 ("Back and Next are pinned at the bottom", as built). |
| 3 | Practice ends on "That's the whole lesson." in small grey text. Practice is never ticked. Watch again stays orange. | A closing block: "That's the whole lesson." as a heading, the lesson's own pattern as a row of lit tapes, and the way on (the Up next card, or "Back to the track"). Practice is ticked in the outline once every question has an answer. | Build spec §6.3 end row, `:153` (no owner mark). `Explanation.tsx` EndRow. |
| 4 | A wrong pick changes only the border to ink. | The option says it: a ✕ and "Not this one" on the option, a light hatch, the same ✕ before the feedback's "Not quite.", and a way back to Learn. No error colour (`console.css:1088` is kept). A right pick keeps its green and gains a ✓ and "Right". | D1 §6 (the feedback's source numbers, kept). `console.css:1088`. |
| 5 | The keys work and nothing says so. Watch › Learn › Practice are boxed like buttons, though they are not buttons. | One line in the log's head names Space, ← and →, where a keyboard is likely. Watch, Learn and Practice lose their boxes and read as words. The empty log says what it is for. | None. |

## 2. What stays

- **The layout at every width** (direction §7, D1, D2, D3):
  - the top bar, the outline's 268px, the scene, the words' column, and the log under both;
  - D1's reading layout, and its folded log in Learn and Practice;
  - on a phone: the 52px top bar, the scene at 34% (18% when reading), the 48px tabs, the four parts, and the 64px control bar.
- **The phone's control bar:** 64px tall, controls 48px tall, 8px apart, 12px from the edges.
  - Today: four controls. Speed 48, ‹ 48, Play 183, › 48.
  - D14: five controls. Speed 48, ‹ 48, the play button 48, replay 48, the forward button 127 (at 375).
  - The widest button stays the widest. It moves under the thumb at the right, where › was.
  - No control changes size or place with its label or state, at any slot. Disabled controls stay in their slots.
- **The speed button:** one button that cycles 0.5×, 1×, 1.5×, 2× (owner, 2026-11-05).
- **Words that stay:**
  - the narration and every lesson word (copied from `src/content/lessons/what-is-http.ts`);
  - the stamp and the numbered sources;
  - Practice's heading and "Just for you. Nothing is scored or saved.";
  - the feedback's words and their source marks (D1 §6).
- **Moving by hand plays the step once.** This is the build spec row "Moving by hand stops the run".
- **What else is kept:**
  - the outline, Resume, `?step=` links, and the progress store;
  - the top bar's segments, and their fill during a run's hold (hidden under reduced motion, as today).

## 3. The control row

Touches:

- the build spec's playback row (owner, 2026-11-05: Play, Pause, Replay);
- direction §7 ("Back and Next are pinned at the bottom", as built, no owner mark);
- `PlaybackControls.tsx`.

**Order, left to right, at every width:** speed, Back (‹), the play button, replay (↺), the forward button.

- The › button is removed. The forward button is the old Next, labelled and wide.
- Today's order is speed, ‹, Play, ›. The widest button moves to the right end, under the thumb, where › was.
- Replay sits next to the forward button. The two buttons that act on "this step, then the next" are together, and the run's button (Play all) is between Back and replay.

| Control | Class | Desktop (≥1100, in the log head) | Tablet on its side (900–1099) | Phone layouts (≤1099 otherwise) |
|---|---|---|---|---|
| Speed | `cbtn cbtn--speed` | 52×34, unchanged | 52×44 | 48×48 |
| Back | `cbtn`, aria-label "Previous step" | 36×34, icon, unchanged | 44×44 | 48×48 |
| Play button (new role) | `cbtn cbtn--alt` | 13px icon and words; `min-width: 118px; padding: 0 12px`; start-aligned | as desktop, 44 tall | **icon only**, 48×48, 16px icon; its words are its `aria-label` |
| Replay (new) | `cbtn cbtn--replay`; `aria-label` and `title` "Replay step" | 36×34, 14px ↺ icon, no words: Back's tile | 44×44 | 48×48 |
| Forward button (new) | `cbtn cbtn--go` | `min-width: 152px; padding: 0 12px 0 16px`; words `600 16px/1 var(--display)`, sentence case; a 14px › icon at the right end | as desktop, 44 tall | `flex: 1` (127px at 375 wide); words 17px; `gap: 6px; padding: 0 10px 0 12px` |

**The phone's forward button, measured** (Practice, "Next lesson", the longer label):

| Viewport | Forward button | What it shows |
|---|---|---|
| 390 (the e2e `phone` project) | 142×48 | words 17px and › |
| 375 | 127×48 | words 17px (80px) and ›; 13px left, 11px right, border included |
| 374 to 360 | 112×48 at 360 | words 17px, centred, **no ›** (`@media (max-width: 374px)`): words and › would need 124px |
| 359 to 320 | 96×44 at 320 | all five controls 44×44, 6px apart; words 16px (76px), centred, no › (`@media (max-width: 359px)`) |

No document names a narrowest phone. The e2e phone is 390 and the design width is 375, so the two narrower rules are a fallback: below 360, the 48px targets give way to 44px (WCAG 2.5.5's size) rather than clip the words. "Next step" is shorter than "Next lesson" at every width.

- **Gaps:** 6px on a desktop and 8px on a phone, both as today. The phone bar stays 64px with 8px/12px padding.
- **Colours:** only the forward button is orange.
  - The forward button takes the accent pair: `--accent` ground and border, `--accent-ink` words.
  - Light: white on `#b04617`, 5.9:1. Dark: `#1c0c03` on `#f0702e`.
  - The play button takes `.cbtn`'s tile.
- **Type:** the forward button's words move from the old Play's `700 13px` mono capitals to the display face in sentence case. Direction §6 says "buttons and labels: Barlow Semi Condensed" and "labels are sentence case". The speed button keeps its mono figures.
- **Titles** (the hover tip on a desktop) name the key:
  - "Next step (→)"
  - "Play all (Space)" or "Pause (Space)"
  - "Previous step (←)"
  - "Replay step" (no key)
  - "Next lesson" has no key in its title.
- **Back** is `aria-disabled` on the Overview, as today.
- **Replay** is `aria-disabled` wherever there is nothing to replay: the Overview, a step with no messages (HTTP's step 1), Learn and Practice. Its disabled look is Back's on the Overview: `.cbtn[aria-disabled='true']`, 40% opacity, no press scale. It stays in its slot.

**The forward button.** It has two labels, and neither changes the button's size.

| Slot | Label | Does | Element |
|---|---|---|---|
| Overview | Next step | A hand move to step 1. | `<button>` |
| Step 1 to the last step | Next step | A hand move to the next step. From the last step, a hand move to Learn. | `<button>` |
| Learn | Next step | A hand move to Practice. | `<button>` |
| Practice, with a following unit | Next step | Goes to that unit's Overview and moves focus to the explanation, as EndRow's `jump` does today. | `<button>` |
| Practice, with a next ready lesson | Next lesson | Opens the next lesson (`next.url`). | `<a class="cbtn cbtn--go" href>` |
| Practice, at the track's last lesson | Next lesson, `aria-disabled="true"` | Nothing. The title gives the reason: "There is no next lesson: this is the track’s last." | `<button aria-disabled>` |
| Practice, at the last ready lesson | Next lesson, `aria-disabled="true"` | Nothing. The title gives the reason: "No next lesson is ready yet." | `<button aria-disabled>` |

- **A disabled forward button** has `.cbtn[aria-disabled='true']`'s 40% opacity, as Back has on the Overview. It keeps its place, its width and its words.
- **The way on when there is no next lesson** is in the end block, which says why and offers "Back to the track" (§7).
- **Fit:** "Next lesson" is the longer label. It fits the phone's 127px at 17px with its › (measured below). On a desktop both labels sit in the 152px minimum.

**Why these labels** (point 4 of the revision):

- **A following unit reads "Next step".** Its Overview is the next place in the same lesson. "Next lesson" would be false, and "Next step" goes on as it did everywhere before.
- **No next lesson keeps "Next lesson", disabled.** Only the three labels are allowed. The disabled button keeps the bar's slots and the forward button's width in place, and it says plainly that this is the end. The end block's "Back to the track" carries the way on.

**Keys** (`useLessonShortcuts.ts`, with its ignore rules unchanged):

- → does what the forward button does whenever that button reads "Next step". When it reads "Next lesson", → does nothing, because a key never leaves the page.
- ← does Back.
- Space presses the play button.
- A held Space does nothing more, because repeats are ignored.
- Replay has no key. R would be the only letter key on the page and would need a fourth item in the key line; Back then Next step (← →) already replays a step from the keyboard (§4).

## 4. The play button: Play all, or Pause

Nothing moves on by itself unless the reader asks for the run. Arriving at a step plays it once, and then it waits there.

| When | Words, icon | Does |
|---|---|---|
| Every slot, no run going (Overview, any step, Learn, Practice) | "Play all", ▶ | Today's run, **always from step 1**. It goes through every step, holds 2.6 s between steps (÷ speed), and stops on the last step. From Learn or Practice it first moves to step 1. |
| While a run is going (playing a step, or holding before the next) | "Pause", ❚❚ | Stops the run. The step is shown complete, as today's pause. The button reads "Play all" again. |

**Why Pause, and only during a run.** A run moves on by itself, so the reader needs a way to stop it in the place they pressed to start it. Space has to stop it too. During a run, "Play all" would mean "start again from step 1", which is never what a reader pressing that button mid-run wants. Outside a run, nothing moves on by itself, so there is nothing to pause. A step reached by hand plays its messages once, and the button still reads "Play all" during that play.

**Other rules:**

- **After Pause,** "Play all" starts again from step 1; there is no resume. Going on from the paused step is "Next step". This holds one rule for the button ("Play all is the whole run") and keeps the bar to the three labels.
- **The end of a run.** A run ends on the last step. The forward button there reads "Next step" (to Learn), and the play button reads "Play all".
- **Hand moves stop a run,** as today. These include the forward button, →, ←, Back, replay, the outline, a `?step=` link and "Back to Learn".
- **Speeds.** A message's wait and the 2.6 s hold are divided by the speed, as today. A step a reader waits on has no timer, so the speed changes only how fast its messages play.

**To see a step again: the replay icon (↺).**

- **What it does:** it plays the current Watch step again from its first message. The step's log rows go, then come back one message at a time, with the step's waits at the current speed. The position does not change.
- **During a run** it is a hand action: it stops the run (the play button reads "Play all") and replays this step. The step then waits, as any step reached by hand does.
- **During the step's own play** it starts the step again from its first message.
- **Disabled** where there is nothing to replay: the Overview, a step with no messages (HTTP's step 1), Learn and Practice.
- **Back, then Next step, still works.** Arriving at a step plays it once, so arriving on it again replays it. That is the keyboard's way (← →).
- "Watch again" is gone; "Replay step" is now the icon's name, not a label.

**Reduced motion:**

- **A step reached by hand lands complete at once.** All its messages are applied, with no waits and no pulse.
  - Today it waits out each message with the motion skipped (`playback.ts:143-144`).
  - The build spec, §5 (`:89`), says "everything jumps to its end state", so this follows the spec.
- **Replay plays with its waits.** Under reduced motion the replay icon plays the step's messages with their waits and no motion (no dot, no pulse), so the log fills one row at a time. It is the reader's way to see a step's messages arrive in order.
- **Back, then Next step,** lands the step complete, every log row at once.
- **Play all keeps its pace.** Each message keeps its wait and the hold stays 2.6 s, because the run is a timer, not motion.
- The top bar's fill is hidden, as today.
- This was measured in the prototype on HTTP step 3:
  - Normal motion: replay, or Back then Next step, shows 2 rows, then 3 after one message, then 5.
  - Reduced motion: replay shows 2, then 3, then 5; Back then Next step shows 5 at once.

**Space** presses the play button: Play all, or Pause during a run.

**Engine:**

- `toggle` becomes `playAll`, which is today's `runFrom(first step)` at every position, or `pause` while the mode is `run` or `hold`.
- `go` under reduced motion sets `eventIndex` to the step's count and the mode to `idle`.
- `playLabel` is replaced by two functions:
  - `forwardButton(lesson, state, end)`, returning `{ words: 'Next step' | 'Next lesson', disabled, href? }`;
  - `playButton(state)`, returning `{ words: 'Play all' | 'Pause', icon }`.
- `replayStep` (mode `step` from event 0 at the current position; plays with its waits even under reduced motion; stops a run) and `canReplay(lesson, state)` (a Watch step with at least one event).
- `HOLD_MS` stays 2600.

## 5. Variant B: drawn, not taken

A second variant, a paced run, was drawn and shown at the gate. It kept the run and paced each step to its words (200 words a minute at 1×), with a countdown on the forward button. The owner chose step by step. B's prototype and spec are in commit `ef39c54` (`prototypes/d14-lesson-flow.*`) if the run's pace is ever reopened.

## 6. Why step by step

A reader cannot be outrun by something that waits for them, and the bar needs one rule: the orange button goes on.

- HTTP's step 1 is on screen for 2.8 s today. Now it stays until the reader moves.
- A reader who wants the lesson hands-free has Play all, at today's pace.

## 7. The lesson's ending

Touches:

- `Explanation.tsx` EndRow (`:189-230`);
- build spec §6.3 `:153` ("End row", no owner mark);
- `Outline.tsx` `Item` (`:46`);
- direction §7 (the stamp is not on up-next cards; kept).

The end block replaces EndRow, after the questions, in all four cases EndRow has today.

```
That's the whole lesson.                              ← h3, 700 24px/1.15 display, --ink-strong
[Client Request]┄[DNS Resolution]┄[TCP Connection]┄[HTTP Exchange]┄[Render]   ← Learn's pattern, as tapes
┌──────────────────────────────────────────────────┐
│ [HTTPS art]  UP NEXT                         [›] │  ← the Up next card
│              HTTPS                               │
│              Lesson 02 · Web pages, sealed       │
└──────────────────────────────────────────────────┘
```

**The block** (`div.end`): `display: grid; gap: 14px; margin-top: 4px; padding-top: 20px; border-top: 1px solid var(--line)`.

- **Heading** (`h3.end__title`): `700 24px/1.15 var(--display)`, `letter-spacing: .005em`, `--ink-strong`.
- **The line** (`p.end__line`, two cases only): `400 15px/1.5 var(--sans)`, `--ink`, `margin-top: -6px`.
- **The pattern** (`ol.end__pattern`, `aria-label="The lesson’s pattern"`): the unit's `learn.pattern.names`, the lesson's own checked words.
  - Each name is an `li > span` tape: `padding: 5px 6px; border: 1px solid; border-radius: 2px; 600 13.5px/1.1 var(--display); letter-spacing: .02em; white-space: nowrap`.
  - Between tapes there is an 8×3px striped cable (`li + li::before`, striped 3px on, 2px off).
  - The row wraps, and a wrapped line starts with its cable piece. HTTP's five names fit one line in the 560px column (499px) and take two lines at 375 wide.
  - **Not yet done:** tapes have a `--card-2` ground, a `--line-strong` edge and `--muted` words; the cable is `--line-strong`.
  - **Done** (`.end[data-done]`, when every question has an answer): tapes have an `--allowed` edge, a `color-mix(in srgb, var(--allowed) 12%, var(--card))` ground and `--ink-strong` words; the cable is `--allowed`.
  - They light left to right, 220ms each, 70ms apart (`transition-delay: calc(var(--i) * 70ms)`), or at once under reduced motion.
  - This is the page's one moment of its own: the lesson's run drawn as a lit patch cable, in the colour that means done (direction §6).
- **The way on:**
  - **A next lesson:** the Up next card as today: art 104×76, the kicker "Up next", the title and `lessonLine`.
    - It gains a `1.5px solid var(--accent)` border and an `--accent-soft` hover ground.
    - It gains a 32×32 square at its right end: an `--accent` ground with the › icon in `--accent-ink`.
    - The whole card is the link, as today.
  - **A following unit:** the same card without art. It has the kicker "Next in this lesson", the unit's name and its `purpose`. It is a button that goes to that unit's Overview and moves focus to the explanation (today's `jump`).
  - **The track's last lesson, and the last ready one:** a link styled as the forward button (`a.cbtn.cbtn--go`), "Back to the track", to the track's page. **It shows at every width.** It is the only way on there, because the bar's "Next lesson" is disabled.

| Case (EndRow's branch) | Heading | Line | The block's way on | The bar's forward button |
|---|---|---|---|---|
| A next ready lesson | That’s the whole lesson. | none | Up next card | Next lesson (a link) |
| A following unit | That’s the whole of HTTP. (the current unit's name) | none | "Next in this lesson" card | Next step |
| The track's last lesson (`number === total`) | That’s the whole lesson. | And the last lesson of this track. | Back to the track | Next lesson, disabled |
| The last ready one for now | That’s the whole lesson. | And the last ready one for now. Lessons 15 to 20 are **coming soon**. (`comingSoon()` as today; "Lesson 20 is **coming soon**." for one) | Back to the track | Next lesson, disabled |

**Practice is ticked in the outline:**

- The Practice row's mark shows the green tick once every question of the current unit has a pick, right or wrong. The tick is `data-done`: an `--allowed` ring and an `--allowed-text` ✓.
- The row keeps its current box while the reader is there.
- The tick comes from the console's in-memory picks (`LessonConsole.tsx:185-191`), so it is gone on reload, like the picks. Nothing is stored or scored.
- `Item` gains a `done` prop. It is true for `target < position` (as today), or for the unit's Practice when its picks are complete. `aria-current` stays.

## 8. A wrong answer

Touches:

- `Practice.tsx`;
- `console.css:1081-1111` (the "no error colour" choice at `:1088` is kept);
- D1 §6 (the feedback's marks, kept).

**The option** gets a third column (`grid-template-columns: 22px 1fr auto; align-items: baseline`). The column holds a tag (`span.practice__tag`, `600 13.5px/1 var(--display)`), with a 12px icon 5px before the words.

- **Right:** ✓ "Right", in `--allowed-text`. The option keeps today's green border and tint.
- **Wrong:** ✕ "Not this one", in `--ink-strong`.
  - The option keeps today's `--ink` border and strong letter.
  - It gains a hatch: `background-image: repeating-linear-gradient(135deg, transparent 0 6px, var(--line) 6px 7px)` over `--tile`.
  - The hatch uses the line token, so it is no colour of its own in either theme.
- **Narrow widths:** up to 400px wide, the tag drops under the option's words (`grid-column: 2; margin-top: 4px`), so the words keep the width.
- **Visibility:** the tag shows only on the picked option. `aria-pressed` stays as today.
- **Reading:** the tag's words are read with the button ("The server is too busy to answer. Not this one").

**The feedback** leads with the same ✕ (11px) before "Not quite." on a wrong pick. A right pick's lead word is unchanged. The live region and the marks are as today (D1 §6).

**The way back to Learn** (`button.practice__see`) comes after the feedback, on a wrong pick only.

- **Words:** the ↩ icon (14px), then "Back to Learn: <term name>" when the question names a Learn term, or "Back to Learn" when it does not.
- **Style:** `600 14px/1.3 var(--sans)`, `--ink-strong`, with the site's underline. It is 32px tall on a desktop and 44px on a phone.
- **What it does:** it is a hand move to the unit's Learn, so it stops a run.
- **The term:** when it names a term, it brings that term's row to the middle of the panel. The row has the `--here-soft` ground until the next move, with no animation.
- **The picks stay** (in memory, as today), so "Next step" from Learn brings the reader back to their answers.

**Data:**

- A question may carry `see?: string`, the id of one of its unit's Learn terms.
- In the schema the field is optional. `defineLesson` checks that it names a term of the same unit.
- No lesson word changes.
- In the prototype, HTTP's first question names "Status code" (`term-status`) and its second names none, to show both forms.
- Adding `see` to the lessons is an author's task (open question 1).

## 9. The keys, the chips and the empty log

**The key line** (`p.log__keys`, in the log head between the legend and the controls):

- **Text:** `<kbd>Space</kbd> play all or pause <kbd>←</kbd> back <kbd>→</kbd> next step`.
- **Style:**
  - The text is muted `400 13px/1.2 var(--sans)`, with 6px between items.
  - Each `kbd` is 22px tall, `min-width: 22px; padding: 0 6px`.
  - It has a 1px `--line-strong` border with a 2px foot, 4px corners and a `--tile` ground.
  - Its key is `500 11.5px` mono in `--ink-strong`.
- **Where it shows:** only where a keyboard is likely and there is room.
  - It is limited to the desktop layouts: `(min-width: 1100px)`, or the tablet-on-its-side query of `console.css:76`.
  - It also needs `(hover: hover) and (pointer: fine)`.
  - The log head is a size container (`container-type: inline-size`), and `@container (min-width: 970px)` shows the line.
- **Measured:**
  - The line is 310px wide.
  - On a desktop it shows from about 1300px wide (1290: hidden, log head 984px; 1310: shown, 1004px; 1440: shown, 1134px).
  - Below that, and in every phone layout, the keys are only in the buttons' titles (§3).
- **Reading:** it is plain text in reading order after the legend, and needs no `aria-hidden`.

**The chips.** "This lesson: Watch › Learn › Practice" on the Overview keeps its words and loses its boxes.

- The three words are `600 16px/1.2 var(--display)` in `--ink-strong`.
- The line is `400 14.5px/1.4`, muted.
- Nothing about them now looks pressable. The outline is the lesson's map, and it is the part that can be pressed.

**The empty log.**

- "Nothing has happened yet. Press Play to start." (`LessonConsole.tsx:84`, IDLE) becomes "Nothing has happened yet. Messages show here as they’re sent."
- It no longer names a button, and it says what the log is for (the critique's third point under finding 5).
- A step's or unit's own idle words are lesson words, and they are unchanged. Three of them name Play (open question 2).

## 10. Breakpoints

| Width | Layout (direction §7) | D14 |
|---|---|---|
| ≤359 | phone, narrowest | Five controls at 44×44, 6px apart; the forward button's words 16px, no › (96px at 320). |
| 360–374 | phone, narrow | As the phone; the forward button drops its › and centres its words (112px at 360). |
| ≤760 | phone | The control bar: speed, ‹, the play button (icon), replay (icon), the forward button (127px at 375). No key line. The end block's "Back to the track" shows. Option tags drop under the words up to 400px. |
| 761–1099, upright or under 900 | the phone layout, grown (520px column) | As the phone. The bar sits inside the 520px column. |
| 900–1099 on its side | desktop, with the outline in a tab | The desktop row at 44px. The key line shows when the container query passes. With the outline folded, the log head is the window less 24px, so the line shows only near the top of this range (about 1024 wide). This layout is not drawn in the prototype, which shows the phone layout up to 1099, so the builder measures it. |
| ≥1100 | desktop | The desktop row at 34px. The key line shows from about 1300px. |

With JavaScript off, the page keeps its stacked layout and has no controls, as today.

## 11. Every word of new copy

| Where | Words |
|---|---|
| Forward button | Next step · Next lesson |
| Forward button's title when disabled | There is no next lesson: this is the track’s last. · No next lesson is ready yet. |
| Play button | Play all · Pause |
| Replay (name and title only, not shown) | Replay step |
| Button titles | Next step (→) · Play all (Space) · Pause (Space) · Previous step (←) · Replay step · Next lesson |
| End block | That’s the whole lesson. · That’s the whole of <unit>. · And the last lesson of this track. · And the last ready one for now. Lessons <a> to <b> are coming soon. · Next in this lesson · Up next (kept) · Back to the track |
| Option tags | Right · Not this one |
| Back to Learn | Back to Learn · Back to Learn: <term name> |
| Key line | Space play all or pause ← back → next step |
| Empty log | Nothing has happened yet. Messages show here as they’re sent. |
| Pattern list's label (read only) | The lesson’s pattern |

**Removed:**

- "Play" and "Replay" as button words.
- "Watch again".
- "That’s the whole lesson, and the last lesson of this track." and "…, and the last ready one for now." as one sentence. Each is split into the heading and the line.
- "Press Play to start."
- From the first pass: "Watch step 1", "Go to Learn", "Go to Practice", "Go to <unit>", "Replay step" as a visible label, and "Back to the track" as the bar's words.

No new words state a fact about a protocol. The pattern's names are Learn's own checked words.

## 12. Measurements

"Today" is the dev server at `abc1646` (`/how-the-internet-works/what-is-http/`) and S17's timings. "D14" is the prototype, in the same browser, measured with scripts on the page.

| | Today | D14 |
|---|---|---|
| HTTP step 1 on screen at 1× | 2.8 s, reached by Play (S17) | until the reader moves; 2.7 s if they choose Play all (measured) |
| Step 1 at 0.5× / 1.5× / 2× | 5.2 / 1.7 / 1.3 s (hold ÷ speed) | no timer; under Play all, 5.2 / 1.7 / 1.3 s |
| Forward action, 1440 | › icon, 36×34, no words | "Next step" or "Next lesson", 152×34, orange |
| Forward action, 375 | › icon, 48×48 | "Next step" or "Next lesson", 127×48, orange ("Next lesson" 80px at 17px, with its ›) |
| Replay, 1440 / 375 | Replay 112×34 / 183×48, orange, in Play's place | ↺ icon, 36×34 / 48×48, tile |
| Play button, 1440 | Play 112×34, orange | "Play all" or "Pause", 118×34, tile |
| Play button, 375 | Play 183×48, orange | icon, 48×48 |
| Phone control bar | speed 48, ‹ 48, Play 183, › 48, at x 12/68/124/315 | speed 48, ‹ 48, play 48, replay 48, forward 127, at x 12/68/124/180/236, the same at every slot and end case |
| Desktop control row, 1440 | speed, ‹ 36, Play 112, › 36 | speed 52, ‹ 36 (x 1053), play 118 (1095), replay 36 (1219), forward 152 (1261) |
| Tap targets on the phone | all ≥48×48 | all ≥48×48; Back to Learn 44 tall; the Up next card 104px tall |
| Page width at 375 | 375 (no sideways scroll) | 375 |
| Key line, 1440 | none | 310×22; log head 1134px; 24px to the speed button. Still shows from about 1305px, with the replay icon in the row (20px gaps at 1310) |
| Practice's words, 1440, nothing picked | the end row fits | 748px in a 729px panel (19px of scroll); end block 206px |
| Practice's Explain tab, 375, both answers wrong | 714px of words in a 502px tab | 1,060px |

**The orange button's words at each slot.**

- Today: Play, Pause, Replay, Watch again, Watch again.
- D14: "Next step" on the Overview, steps 1–5, Learn, and Practice with a following unit. "Next lesson" at Practice otherwise: a link to the next lesson, or disabled at the track's last or last ready lesson.
- The play button reads "Play all" everywhere, and "Pause" only during a run.

## 13. Acceptance checks

Each check can be a unit test (`playback.test.ts`, `LessonConsole.test.tsx`, `Practice.test.tsx`, `Outline` tests) or an end-to-end check (`e2e/lesson.spec.ts`, d1440-dark and phone). HTTP is the example lesson. "Forward button" means `.cbtn--go` in the control row; "play button" means `.cbtn--alt`.

**The row**

1. The controls are, in order, the speed button, "Previous step", the play button, "Replay step" and the forward button. No control in the row is named "Replay", "Watch again", "Play", "Go to Learn", "Go to Practice" or "Back to the track", and "Replay step" has no visible text.
2. The forward button's accessible name is "Next step" on the Overview, on each of steps 1–5 and on Learn, and "Next lesson" on Practice (HTTP has a next lesson).
3. Pressing the forward button seven times from the Overview reaches Practice through every slot in order (Overview → step 1 … step 5 → Learn → Practice).
4. When no run is going, the play button's accessible name is "Play all" on the Overview, on a step (during and after the step's own play) and on Learn and Practice.
5. The forward button is the only control with the `--accent` background.
6. At 375×812 the five controls are 48px tall at x 12, 68, 124, 180 and 236, and the forward button is 127px wide and ends 12px from the right edge. The same holds on every slot, in all four end cases, and during a run. The page does not scroll sideways. The forward button's words and › are not clipped (`scrollWidth` equals `clientWidth` for its words, and the › ends at least 8px inside the button).
6a. At 360×780 the forward button shows "Next lesson" unclipped with no ›; at 320×640 the controls are 44px and "Next lesson" is unclipped.
7. Titles: the forward button has "Next step (→)", or "Next lesson" with no key; the play button has "Play all (Space)" or "Pause (Space)"; Back has "Previous step (←)"; replay has "Replay step".

**Play all and Pause**

8. "Play all" from the Overview runs the steps with a hold of 2600 ms ÷ speed and stops on step 5. The forward button then reads "Next step" and the play button "Play all".
9. During the run the play button reads "Pause". Pressing it stops the run, shows the step complete, and the button reads "Play all".
10. "Play all" on step 3, on Learn or on Practice moves to step 1 and runs from there.
11. Any hand move during a run stops it: the forward button, →, ←, Back, the outline, or "Back to Learn".
12. Pressing the forward button on the Overview shows step 1 and starts no timer. After 30 s at 1× the page is still on step 1.
13. On step 3, after its messages have played, "Replay step" leaves 2 log rows and then refills to 5, one message at a time, and the position stays step 3. Back then Next step does the same.
13a. "Replay step" is `aria-disabled` on the Overview, step 1, Learn and Practice, and enabled on steps 2–5; pressing it while disabled changes nothing. It has Back's disabled opacity.
13b. During a Play all run on step 3, "Replay step" stops the run (the play button reads "Play all"), replays step 3, and the page is still on step 3 after 10 s at 1×.
14. With reduced motion, a step reached by the forward button shows all its log rows at once (HTTP step 3: five rows), and Back then Next step shows five rows at once again. "Replay step" shows 2, then 3, then 5 rows, a message's wait apart, with no dot on the figure.
15. With reduced motion, "Play all" keeps its pace: step 2 lasts its two messages' durations plus 2600 ms.

**Keys**

16. → does what the forward button does on the Overview, a step, Learn, and on Practice with a following unit. On Practice with "Next lesson", whether enabled or disabled, → does nothing and the URL does not change.
17. ← goes back. Space presses the play button. A repeated Space does nothing more. No key presses "Replay step".
18. At 1440×900 on a fine pointer, the log head shows "Space", "←" and "→" in `kbd`, with the words "play all or pause", "back" and "next step". At 1100×800 and at 375×812 it does not.

**The ending**

19. A lesson whose unit has a following unit shows "Next step" on its Practice. Pressing it shows that unit's Overview and focuses the explanation. The block shows the "Next in this lesson" card.
20. The track's last lesson shows:
    - the heading "That’s the whole lesson.";
    - the line "And the last lesson of this track.";
    - in the block, a link "Back to the track" to the track's URL, visible at 375 and at 1440;
    - in the bar, "Next lesson" with `aria-disabled="true"` and the title "There is no next lesson: this is the track’s last.", where pressing it does nothing.
21. The last ready lesson shows:
    - "And the last ready one for now." with the coming-soon words;
    - the block's "Back to the track";
    - in the bar, "Next lesson" disabled, with the title "No next lesson is ready yet."
22. Practice shows the `h3` "That’s the whole lesson." and an `ol` of the unit's pattern names in order (HTTP: Client Request, DNS Resolution, TCP Connection, HTTP Exchange, Render).
23. Before every question has a pick, `.end` has no `data-done` and the outline's Practice row is not done. After the last pick, right or wrong, both are done, and the Practice row shows ✓ and keeps `aria-current="step"`. After a reload neither is done.

**The wrong answer, the chips, the log**

24. Picking a wrong option shows:
    - "Not this one" in that option;
    - a ✕ before "Not quite.";
    - a button "Back to Learn: Status code" (HTTP Q1, which names `term-status`), or "Back to Learn" for a question with no `see`.

    A right pick shows "Right" and no "Back to Learn".
25. The wrong option's border is `--ink`, and no part of it uses `--blocked`. The right option's border is `--allowed`.
26. "Back to Learn: Status code" shows Learn, with the Status code row in view on the `--here-soft` ground. The picks are still there after "Next step" back to Practice.
27. On the Overview the words Watch, Learn and Practice have no border.
28. The empty log reads "Nothing has happened yet. Messages show here as they’re sent." unless the step or unit has its own idle words. HTTP step 1 keeps "Nothing on the network yet. The browser is still getting ready."
29. The speed button still cycles 0.5×, 1×, 1.5×, 2×, and its label names the next speed.

## 14. Decisions

1. The forward button replaces ›, and the forward action gets the widest slot (measured above). With the replay icon the phone has five 48px-tall slots.
2. Step by step is taken, at the owner's word. Variant B is kept in `ef39c54` only.
3. Play all keeps today's 2.6 s hold, because the plan defines it as today's run.
4. Play all always starts at step 1, so the button means one thing everywhere. Going on from a step is the forward button's job.
5. Pause shows only during a run, because only a run moves on by itself, and Space must be able to stop it.
6. Seeing a step again is the replay icon, at the owner's word. It has no words, so the bar keeps three labels, and it sits beside the forward button so the step's two actions are together. Back, then Next step, also works.
6a. Replay is present at every slot and disabled where there is nothing to replay, so the bar never shifts.
6b. Replay has no key: one letter key would be the page's only one, and ← → already replay.
6c. The phone's forward button narrows to 127px at 375. Its words stay 17px; its padding and gap tighten so "Next lesson" and › fit. Below 375 the › goes; below 360 the controls go to 44px.
7. A following unit reads "Next step", because its Overview is the next place in the same lesson.
8. With no next lesson, "Next lesson" stays and is disabled. This keeps the bar's geometry and the three labels, and the end block offers "Back to the track".
9. The end block's "Back to the track" now shows at every width, because it is the only way on there.
10. Reduced motion lands a hand-reached step complete, as the build spec's §5 says. Play all keeps its pace.
11. The end block uses Learn's pattern names, so its only fact-like words are already checked.
12. Practice is ticked when every question has a pick, right or wrong: answering is the practice, and nothing is scored.
13. A wrong option is hatched in the line token and tagged in words, keeping `console.css:1088`'s choice of no error colour.
14. The pointer to Learn is per question and optional, so a lesson without it still gets "Back to Learn".
15. The key line shows only with a fine pointer and room. Elsewhere the titles carry the keys.
16. The chips become plain words rather than boxes, because the outline is already the map a reader can press.
17. The forward button's words move to the display face in sentence case (direction §6). Mono stays for the speed's figures.

## 15. Open questions for the owner

1. **The pointer's data.** Each question may name the Learn term that covers it (`see`). Should the authors add it to every lesson's questions? No lesson words would change. Or should every wrong answer say only "Back to Learn"?
2. **Three lessons' idle words name Play.** IP address, Firewalls and Subnetting say "Press Play, or pick a step." The bar has no button called Play now. The nearest is "Play all", which runs from step 1, while "Next step" is what most readers will press. These are lesson words, so they need the owner's word to change, for example to "Press Play all, or pick a step." (an author's change, fact-checked as usual).
3. **The Lesson page stays close to its design** (the owner, 2026-11-10). The › button goes, and the orange button moves one place right. The measured gain is in §12. This is the only rearrangement.

## 16. The prototype

`prototypes/d14-lesson-flow.html` opens from the file system.

**The panel.** The yellow "Prototype" button (bottom left on a desktop, top right on a phone) opens a panel that is not part of the design. It holds:

- the end case: next lesson, next unit, track's last, last ready;
- theme;
- reduced motion;
- a readout of how long the current place and step 1 have been on screen;
- Start over.

**The address** can set the same things:

- `?end=next|unit|last|soon`
- `?theme=dark`
- `?rm=1`
- `?step=0..7` (as the site's `?step=`)
- `?picks=status-404:1,more-files:1`
- `?panel=1` opens the panel; `?panel=0` hides it.

Actions that leave the page (Next lesson, Back to the track, the next unit) show a note instead of navigating.

**What is left out:**

- The figure is a stand-in (three boxes and a moving dot), and messages take 1.9 s at 1×.
- Learn's facts and the Watch steps' Go deeper marks are left out. Everything else in the explanation is the lesson's words.
- The prototype draws the phone layout up to 1099px. The tablet-on-its-side layout is not drawn.
