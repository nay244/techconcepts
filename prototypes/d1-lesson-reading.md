# D1: reading a lesson on a desktop

Design unit D1 of `plan.md`, 2026-11-10. The prototype is `prototypes/d1-lesson-reading.html`. Facts about today's page come from `prototypes/s1-lesson-facts.md` and from the site as it ran that day.

This spec covers two things:

1. The layout of Learn and Practice at 1100px wide and up.
2. Where a claim's source numbers go in Practice's feedback, at every width.

## 1. The problem, measured

On a desktop, Learn and Practice are read in the right-hand column, which no rule changes when the reader arrives there (`src/lesson/console.css:67`; `data-reading` is used only by the phone layout, line 1293).

| Today | 1440×900 | 1280×720 |
|---|---|---|
| Words column (`.console__explain`), width by the height inside its border | 389 × 548px | 348 × 402px |
| A full line of OSI Model's lead | 44 characters | 39 characters |
| OSI Model's Learn, top to bottom | 2,830px | 3,118px |
| Of it on screen at once | 19% | 13% |
| Scroll to reach its end | 2,282px | 2,716px |

Two things are short: the line (39 to 44 characters) and the window the words are read through (402px tall at 1280×720, about 14 lines).

## 2. The two variants

Both keep every region where it is today. Neither swaps columns.

| | A: wider words | B: wider words, log folded |
|---|---|---|
| What changes in Learn and Practice | The line between the scene and the words moves left. Words 560px, scene the rest. | A, and the log folds to its head. The words and the scene take its height. A button brings the rows back. |
| New controls | none | one button, "Show log" / "Hide log" |
| New state | none | whether the log is open while reading |
| What moves | nothing | Back, Play and Next sit lower while the log is folded: 182px lower at 900 tall, 148px at 720 |

**Recommended: B.** A fixes the line. Only B fixes the window: at 1280×720 A still shows the site's longest text through 402px. B is A plus a few rules and one button, so A can ship first and B after with no rework.

**What A buys instead:** nothing new to learn and nothing that moves. It is one grid rule and one title rule.

**Not proposed: swapping the columns** (the earlier prototype, `docs/direction.md` §7, third row). With the split moved in place, a swap adds no characters to the line and no height to the window. Its one gain, the words next to the outline, has no number, so it does not meet the owner's rule.

## 3. What stays

- Overview and every Watch step: unchanged at every width.
- Below 1100px: unchanged, except the source numbers in Practice's feedback (§6).
- The top bar, the outline (268px), the 12px gaps, the log's place and its table, the step controls' order.
- All type sizes, weights, colours and spacing inside the explanation. No token is added.
- The lesson's words.
- No motion is added. The split and the fold change in one frame, at the moment the panel's words change.

## 4. Both variants: the reading split

In `src/lesson/console.css`, with the other desktop rules (not inside any `max-width` block):

```css
@media (min-width: 1100px) {
  .console[data-reading] .console__main {
    grid-template-columns: minmax(0, 1fr) max(348px, min(560px, 100% - 496px));
  }
  .console[data-reading] .stage__title {
    white-space: normal;
    text-align: end;
    text-wrap: balance;
  }
}
```

- `100%` is the width of `.console__main`. `496px` is 484px, the least the scene keeps, plus the 12px gap.
- **560px** is the words column at its widest. With the panel's 22px side padding the text is 516px wide: a median of 66 characters a line in 16.5px Atkinson Hyperlegible Next.
- **484px** is the least the scene keeps. The widest lesson table (What is SMTP's, 482px) then fits with no sideways scroll.
- **348px** is today's width, kept where the window is too narrow for both limits.

| Window width | Words column | Scene column | A full line of the lead |
|---|---|---|---|
| 1100 to 1148 | 348px (today's) | 436 to 484px | 39 characters |
| 1200 | 400px | 484px | 45 |
| 1280 | 480px | 484px | 56 |
| 1360 and up | 560px | 484px and up (564 at 1440, 1044 at 1920) | 66 |

Between 1148 and 1360 the words column is the window's width less 800px.

**The scene's title.** The scene is narrower while reading, so its title may take two lines. They fit the head's 50px (two lines of 11.5px at 1.2 are 28px in a 34px box); the head does not grow and the title is never cut with an ellipsis. The Network and Sequence switch stays at the left.

**The scene's drawing** scales to its column as today (`console.css:625-634`). Nothing in it changes.

## 5. Variant B only: the log folds

### What the reader sees

In Learn and Practice, at 1100px and up, the log shows only its head: the log's title, a button "Show log", and the step controls at the right, in their usual order. The legend and the rows are not shown. The head is 50px tall (52px with the panel's border) and has no line under it.

"Show log" opens the log to today's height, with its legend and rows, scrolled to its newest row. The button then reads "Hide log". Open, the page is variant A.

### States

| State | When | Log | Button |
|---|---|---|---|
| Watching | Overview and every Watch step | As today | Not shown |
| Reading, folded | Learn and Practice, until the reader opens it | Head only, 52px | "Show log", `aria-expanded="false"` |
| Reading, open | After "Show log" | As today: `clamp(200px, 26vh, 252px)` | "Hide log", `aria-expanded="true"` |
| Below 1100px | Any place | As today | Not shown |

- The choice is one value for the visit, kept in memory with the Practice picks (`src/lesson/LessonConsole.tsx`): folded at first, then as the reader left it, across Learn, Practice and back from Watch. Nothing is stored.
- Focus stays on the button after a press.
- With JavaScript off the page shows the Overview, where the button is not shown.

### Markup

The button goes in the log's head, straight after the title (`src/lesson/LogPanel.tsx:139-141`), before the legend:

```html
<button type="button" class="cbtn log__fold" aria-expanded="false" aria-controls="[id of .log__scroll]">Show log</button>
```

`.log__scroll` gets an id. The console's root carries `data-log="open"` while the log is open in reading; it carries nothing otherwise.

### CSS

```css
.log__fold {
  display: none;
  flex: none;
  padding: 0 12px;
  white-space: nowrap;
}
@media (min-width: 1100px) {
  .console[data-reading] .log__fold {
    display: inline-grid;
  }
  .console[data-reading]:not([data-log='open']) .console__main {
    grid-template-rows: minmax(0, 1fr) auto;
  }
  .console[data-reading]:not([data-log='open']) :is(.log__scroll, .log__legend) {
    display: none;
  }
  .console[data-reading]:not([data-log='open']) .log__head {
    border-bottom: 0;
  }
}
```

The button is a `.cbtn` as it stands (34px tall, 13.5px, 4px corners). The head's 20px gap separates it from the title and the legend.

### Sizes, folded

| | 1440×900 | 1280×720 |
|---|---|---|
| Words column, width by the height inside its border | 560 × 730px | 480 × 550px |
| Scene column, width | 564px | 484px |
| Log, height with its border | 52px | 52px |
| Next's top edge, from a Watch step to Learn | 663px to 845px | 517px to 665px |

## 6. Both variants: source numbers in Practice's feedback

Each Practice option cites its sources (`option.cite`, `src/content/schema.ts:361`) and today's page shows none (`src/lesson/Practice.tsx`).

### Where they go

**After the feedback's last word, as the same marks Learn uses** (`sup.explain__marks`, `src/lesson/Explanation.tsx:60-72`). One set of marks for a feedback: the option's `cite` list is for the whole feedback.

- A mark's number is the source's number in the list at the foot of Learn (`numberedSources`, `src/lesson/sourceNumbers.ts`), so a source has one number everywhere in the lesson.
- One mark for each source the option cites, in number order. A mark opens the first place the option cites in that source, in a new tab. Its `title` names every place; its `aria-label` is "Source 1: ITU-T X.200, 5.6.1.3 (opens in a new tab)". All as in Learn (`sourceMarks`).
- Right and wrong picks both show their marks.
- An option that cites nothing shows no marks. A lesson that cites nothing yet (DHCP today) shows none anywhere, and its Practice looks as it does today.
- No Sources list is added to Practice. The mark is the link to the source; the list stays at the foot of Learn. A Watch step's Go deeper already shows marks this way.

### Markup

```html
<p class="practice__feedback" data-result="right">
  <span class="practice__say" aria-live="polite"><b>Right.</b> Going down, a layer adds … in front.</span><sup class="explain__marks"><a …>1</a><a …>3</a><a …>4</a></sup>
</p>
```

- The paragraph and the span are always in the page; the span is empty until a pick. The live region moves from the paragraph to the span, so a pick announces the feedback's words and not three link names. The marks are reached with Tab, after the question's options.
- The marks are outside the option buttons.

### CSS

```css
.practice__feedback .explain__marks {
  font-size: 0.8em;
}
.practice__feedback:not([data-result]) {
  margin: 0;
}
```

- 0.8em of the feedback's 14px is 11.2px: the size the marks have in Learn's lead (0.68em of 16.5px). At the default 0.68em they would be 9.5px.
- The second rule replaces `.practice__feedback:empty` (`console.css:1059-1061`), which no longer matches once the span is always there.
- Everything else comes from `.explain__marks` as it is: mono, 600, the link blue, 3px by 2px of padding on each number.

### OSI Model's marks, for the tests

| Question | A | B | C | D |
|---|---|---|---|---|
| 1 Going down the layers | 1 3 4 | 1 | 1 | |
| 2 A router passes your message on | 1 3 | 1 | 1 3 | |
| 3 Which layer is layer 4? | 1 | 1 | 1 | 1 |

Question 1, option A: mark 1 opens X.200 at `#page=19`, mark 3 opens NIST SP 800-77r1 at `#page=20` and names two places, mark 4 opens RFC 1122 at `#page-17`.

## 7. New copy, every word

| Where | Words |
|---|---|
| Fold button, log folded (B) | Show log |
| Fold button, log open (B) | Hide log |

No other words are new. Mark labels reuse Learn's.

## 8. Breakpoints

| Width | Layout |
|---|---|
| 1100px and up | This spec |
| 761 to 1099px | Unchanged (unit D3) |
| 760px and down | Unchanged (unit D2). The fold button is not shown; the source marks are. |

## 9. Measurements

Taken from the prototype with its switch bar hidden, offline, in Chromium. "Today" in the prototype matches the running site at every number below. Light and dark give the same figures.

**OSI Model's Learn**

| | Today | A | B |
|---|---|---|---|
| **1440×900** | | | |
| A full line of the lead, median (least to most) | 44 (36 to 49) | 66 (57 to 72) | 66 (57 to 72) |
| Words column | 389 × 548 | 560 × 548 | 560 × 730 |
| Learn, top to bottom | 2,830px | 2,043px | 2,043px |
| On screen at once | 19% | 27% | 36% |
| Scroll to the end | 2,282px | 1,495px | 1,313px |
| Page scroll | none | none | none |
| **1280×720** | | | |
| A full line of the lead, median (least to most) | 39 (27 to 45) | 56 (42 to 61) | 56 (42 to 61) |
| Words column | 348 × 402 | 480 × 402 | 480 × 550 |
| Learn, top to bottom | 3,118px | 2,365px | 2,365px |
| On screen at once | 13% | 17% | 23% |
| Scroll to the end | 2,716px | 1,963px | 1,815px |
| Page scroll | none | none | none |

**DHCP's Practice**, nothing picked

| | Today | A | B |
|---|---|---|---|
| **1440×900**: words column | 389 × 548 | 560 × 548 | 560 × 730 |
| Practice, top to bottom | 987px | 941px | 941px |
| On screen at once | 56% | 58% | 78% |
| Scroll to the end | 439px | 393px | 211px |
| Page scroll | none | none | none |
| **1280×720**: words column | 348 × 402 | 480 × 402 | 480 × 550 |
| Practice, top to bottom | 1,090px | 941px | 941px |
| On screen at once | 37% | 43% | 58% |
| Scroll to the end | 688px | 539px | 391px |
| Page scroll | none | none | none |

**Also checked.** The rules above were laid over all 18 lessons of the running site, in Learn and in Practice: B at 1148×720, 1280×720, 1366×768, 1440×900 and 1920×1080, A at 1280×720 and 1440×900. In every one: no page scroll, no lesson table scrolling sideways, no scene title cut, the scene's head 50px tall.

**How a line was counted.** Each character of the lead's first paragraph is placed by its box; characters sharing a top edge are a line; source marks are left out; the last line is dropped; the median of the rest is the figure.

## 10. Acceptance checks

Each can be tried on the prototype (hide its bar with B first) and turned into a test.

**Both variants**

1. At 1440×900 and 1280×720, in both themes, on OSI Model's Learn and DHCP's Practice: `document.scrollingElement` is no taller and no wider than the window.
2. In Learn and Practice `.console__explain` is 560px wide at 1440 and 480px at 1280. `.console__stage` is 564px and 484px.
3. On OSI Model's Learn the median full line of the first `.explain__narr` is 62 to 70 characters at 1440×900 and 52 to 60 at 1280×720, counted as in §9.
4. At the Overview and on every Watch step `.console__explain` is as wide as today: 389px at 1440, 348px at 1280.
5. At 1100×700 Learn's `.console__explain` is 348px wide, as today.
6. On every lesson, in Learn at 1280×720: no `.tpanel` or `.rpanel` is wider inside than its box; `.stage__title` is not wider or taller inside than its box; `.stage__head` is 50px tall.
7. OSI Model's Practice, question 1, option A: the feedback ends with three links reading 1, 3 and 4, in `sup.explain__marks`, each with `target="_blank"` and the `href` of §6. Every other option's marks match §6's table.
8. DHCP's Practice: no feedback contains a link.
9. `.practice__say` has `aria-live="polite"` and holds no link. `.practice__feedback` has no `aria-live`. Before a pick the feedback takes no room (its height is 0).
10. A mark in Practice's feedback is 11.2px (`font-size` computed).
11. At 375×812 the page is one screen as today, and question 1, option A shows its three marks.

**Variant B, as well**

12. In Learn and Practice at 1440×900: `.log__scroll` and `.log__legend` are not displayed; `.console__log` is 52px tall; `.console__explain` is 730px tall inside its border (`clientHeight`). At 1280×720 it is 550px.
13. The button reads "Show log" with `aria-expanded="false"`. Pressed: it reads "Hide log" with `aria-expanded="true"`, the root has `data-log="open"`, the log is 234px tall at 900 (200px at 720), its last row is in view, and focus is on the button. Pressed again: folded.
14. Open the log in Learn, go to Practice: still open. Go to a Watch step and back to Learn: still open.
15. At the Overview and on Watch steps the button is not displayed and the log is as today. At 1024×768 and 375×812 the button is not displayed.
16. The step controls keep their left edge between a Watch step and Learn (Next at 1377px at 1440 wide).

## 11. Decisions

- **The words column stops at 560px.** That is 66 characters, the middle of the 45 to 75 range for a single column. A wider window gives the rest to the scene.
- **The scene keeps 484px.** Below that, four lessons' tables (DHCP, Firewalls, What is DNS, What is SMTP) scroll sideways. This holds the line to 56 characters at 1280 wide; 527px of words there would give 62 and bring the sideways scroll back.
- **Nothing changes up to 1148px wide.** Both limits cannot be met there, and today's 348px is the safer of the two.
- **The scene's title wraps instead of being cut.** In a 564px scene 9 lessons' titles would end in an ellipsis; two lines fit the head as it is.
- **Type is untouched.** 16.5px at 1.65 reads well at 66 characters; the fault was the column, not the type.
- **No transition.** The panel's words change in the same frame, and a 2,000px text reflowing through an animation would stutter.
- **B folds the log and leaves it in place.** Moving it under the scene (`docs/direction.md` §7's prototype) leaves a 484px log, where a seven-column table does not fit, and moves the step controls sideways.
- **B's log opens with one button, and stays as left.** The record of the lesson is one press away, as the Log tab is on a phone.
- **"Show log", not the log's own title.** The title differs by lesson ("Event log", "What each layer did"); the phone's tab already calls it Log.
- **Practice's marks follow the feedback, as Learn's follow a claim.** One convention for the whole lesson, and the number is the link.
- **No Sources list in Practice.** It would repeat Learn's list under three questions; a Watch step's Go deeper already shows marks with the list in Learn.
- **Marks are not announced with the feedback.** A pick would otherwise read out up to three link names after the answer.
- **Marks are 11.2px in feedback.** The default would make them 9.5px.

## 12. Open questions

1. **A or B?** B is recommended. Its cost is one new button and the step controls sitting 148 to 182px lower while the log is folded.
2. **In B, should the log start folded?** The spec says yes: that is where the height comes from. Starting open makes B look like A until the reader presses "Hide log".
3. **OSI Model's lead is one paragraph of 36 lines**, even at 66 characters. A break before each layer's name would make it short paragraphs. The content model sets a lead's statements as one paragraph (`docs/content-model.md`; `Statements` in `src/lesson/Explanation.tsx`), so this is a content-model change and is not in this design.
4. **Between 1100 and 1147px wide, today's page already lets lesson tables scroll sideways in Learn and Practice** (five lessons at 1100, where the scene is 436px). D1 changes nothing at those widths, so it neither causes nor fixes this.

## 13. The prototype

`prototypes/d1-lesson-reading.html` opens from the file system with no network. The page under its bar is the real Lesson page, copied from the running site: markup, drawings, styles and the nine font files, inline. It opens on OSI Model's Learn in variant B, in the system's theme.

- **The bar:** Lesson (OSI Model, DHCP), Place (Watch's last step, Learn, Practice), Layout (Today, A, B), Theme. At the right it shows the line length and how much is on screen, measured live. Press **B** to hide or show it; hidden, the page fills the window as the real one does.
- **What works in the page:** Back and Next, the outline's last three rows, the theme button, a Practice pick, Go deeper, "Show log", DHCP's Network and Sequence switch, and the phone's three tabs. Source links open the real sources. Site links, Play and the other outline rows are off.
- **The address keeps the state:** `#l=osi|dhcp&p=watch|learn|practice&v=today|a|b&t=light|dark`, with `&log=open`, `&bar=off` and `&pick=0.0,1.2` (question.option) as wanted.
- **The design's rules** are the block headed "D1, reading on a desktop: THE DESIGN" in the file's last `<style>`, each keyed on the layout switch. §4 to §6 give them as they go into the site.
- **Not real in the prototype:** the "Watch" place is DHCP's and OSI Model's last step as a link to it lands, before it plays.

## Errata, 2026-11-11

**The reading layout also applies on a tablet on its side** (owner, 2026-11-11). This spec left 761px to 1099px to unit D3 and said "below 1100px: unchanged". D3's desktop layout with the outline in a tab (900px to 1099px wide, on its side, 600px tall or more) now takes variant B as it is: the same words-column rule, the same fold and button. `prototypes/d3-lesson-tablet.md`, last section, has the numbers. Check 15 changes with it: at 1024x768 the button is displayed in Learn and Practice, and not at the Overview or on a Watch step. At 375x812, and in the phone layout grown (upright, or under 900px wide), nothing changes.

