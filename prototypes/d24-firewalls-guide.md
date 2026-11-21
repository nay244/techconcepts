# D24: the rule being read, in the guide and in the Table tab

Job 29, item 1 (`plan.md`; direction 2.135, 2.136). Designer (Opus 5.5), 2026-11-20. Prototype: `prototypes/d24-firewalls-guide.html` (opens from the file system; a strip at its top switches the design, the width, the phone's height, the theme and the motion, and its probe counts the frames this spec's checks count). Built by B41 after the design gate and its spec review.

**Recommended: variant A, "follow the read".** Variant B adds one thing to A and costs the words 37px; §4 says what it buys.

## 1. What is wrong today, measured

Measured on `revamp` at e9d0fe2, built and served (`astro preview`), Chromium through Playwright. A frame callback (`requestAnimationFrame`) read, every frame, the row with `data-state="check"` and the panel's box: a row is **wholly in** when its `getBoundingClientRect()` lies inside the box's client area (`top + clientTop` to that plus `clientHeight`) within 0.5px. Step 2 was played the way a reader reaches it: `?step=1`, wait for it to land, set the speed, press the forward button. "Frames out" counts frames in which the row being read is not wholly in.

**The guide, 1440 × 900** (box 192px of client height; the panel's content 283px, 313 with two remembered connections):

| Rule being read | 0.5× | 1× | 1.5× | 2× | Least of it shown |
|---|---|---|---|---|---|
| Rule 1 | 0 of 84 | 0 of 42 | 0 of 28 | 0 of 21 | 100% |
| Rule 2 | 0 of 84 | 0 of 42 | 0 of 28 | 0 of 21 | 100% |
| Rule 3 | **84 of 84** (1400ms) | **42 of 42** (700ms) | **28 of 28** (467ms) | **21 of 21** (350ms) | 54%: its second line, "Block everything else" and "Checking", is below the box |

The deciding rule: 0 frames out at every speed (job 27's effect).

| Where | Window | What happens (1×; the other speeds scale as above) |
|---|---|---|
| Guide | 1100 × 890 (box 190) | Rule 3 out 42 of 42 frames, 50% shown |
| Guide | 1920 × 1080 (box 199) | Rule 3 out 42 of 42 frames, 67% shown |
| Guide | 1440 × 900, the table left at its top, Replay | Rule 3 out 42 of 42 |
| Guide | 1440 × 900, the table left at its foot, Replay | **Rule 1** out 42 of 42, 40% shown |
| Guide, reduced motion | 1440 × 900, Replay | Rule 3 out 42 of 42 (0.5×: 85; 1.5×: 29; 2×: 22). The forward button lands the step at once under reduced motion, so a hand move reads nothing (0 frames). |
| Rules tab | 375 × 812, 390 × 844, 414 × 896, 375 × 740 | 0: the list fits (box 287 at 812) |
| Rules tab | 375 × 700 | Rule 3 out 42 of 42, 98% shown; the deciding rule never wholly in |
| Rules tab | **375 × 667** (box 191) | Rule 3 out 84 / 42 / 28 / 21 frames at the four speeds, 55% shown; **"Fits → deny" is never brought into view**: 256 of 256 frames recorded over 4s after its mark. The tab's effect (`LessonConsole.tsx:149-153`) runs only when the tab opens or its table changes, and step 2 changes no table. |
| Rules tab | 360 × 640 | Rule 2 out 42 of 42 (31% shown), rule 3 out 42 of 42 (0% shown); the deciding rule never in |
| Under the scene | 1366 × 768, 1280 × 800, 1024 × 768, 1440 × 889 | 0: rules are one line each there and fit |

**Other lessons, under the scene** (no effect follows a table there today): settled at each step under reduced motion, 114 steps across the lessons have a marked row; at 1280 × 800 and at 1024 × 768 the marked row is not wholly in its box on 16 of them: Proxies 5; What is HTTPS 5, 6 (both tracks); What is TLS 3, 4 (both tracks); FTP 5; ICMP 5, 6; SSH 5; UDP 3, 4, 5.

**The guide's room at 1440 × 900:** guide 807px; words 477; table box 193 with its 1px top border (192 client); foot 135. In the panel: caption at 11 (19 tall), column names at 38 (23), rules at 61, 113 and 165 (52 each), the last rule's foot at 217, the panel's bottom padding 12.

## 2. The rule (both variants)

**A lesson's table keeps one row in its own box, in the frame that row is marked: the row being read; if there is none, the row the step marked or the rule that decided; if there is none, the connection a reply belongs to. Wherever the table is drawn (the guide, the Table tab, under the scene), only the table's own box moves, and it moves at once, never animated.**

What the reader sees on Firewalls' step 2 at 1440 × 900: rules 1 and 2 are read where they stand; as rule 3 turns marigold ("Checking") the box steps down 28px in that same frame, so rule 3's two lines are whole, rules 1 and 2 stay in view above it, and the caption's line leaves the top (as it does today once "Fits → deny" lands). At 375 × 667 in the Rules tab, the same step at rule 3, and "Fits → deny" stays in view. When a read starts again at rule 1 with the box scrolled down, the box goes back to its top, caption and column names with it.

### 2.1 Selectors (`src/lesson/ScenePanel.tsx`)

```ts
/** The row being read: a panel marks it current while the driver reads it (the rules panel, `aria-current="true"` on `data-state="check"`). */
export const READ_ROW = '.tpanel tbody tr[aria-current="true"], .rpanel tbody tr[aria-current="true"]';
/** Unchanged: the table's marked row, or the rule that allowed or denied. LessonConsole imports it. */
export const MARKED_ROW = '.tpanel [data-highlight], .rpanel [data-state="allow"], .rpanel [data-state="deny"]';
/** The connection a landed reply belongs to. */
export const KNOWN_CHIP = '.rpanel__chip[data-known]';
```

The row to follow is found by querying `READ_ROW`, then `MARKED_ROW`, then `KNOWN_CHIP`, **in that order**, taking the first that matches. One combined `querySelector` would return the first in document order, not by priority: today's code does that, and while rule 3 is read a combined query would find nothing (`check` is not in it) or, on another panel, an earlier row.

`aria-current` is the hook on purpose: the rules panel already sets it on the rule being read (`RulesPanel.tsx`, the row's `aria-current`), so a screen reader and the scroll follow the same row, and any later panel that marks a row current is followed with no new selector. The bits board (`.bits`) and the labels strip are not followed, as today.

### 2.2 The scroll (one function, exported for the tests)

```ts
export function keepRowInView(root: ParentNode): void
```

1. `row` = the first match of the order above inside `root`; `box` = `row.closest('.tpanel, .rpanel')`. Neither: return.
2. `p = box.getBoundingClientRect()`. `p.height === 0` (the box is not drawn: another tab is open, `display: none`): return.
3. `r = row.getBoundingClientRect()`.
4. If `r.top < p.top` and the row is its table's first row (`row.matches('tbody tr:first-child')`): `box.scrollTop = 0`.
5. Else if `r.top < p.top`: `box.scrollTop -= p.top - r.top + 4`.
6. Else if `r.bottom > p.bottom`: `box.scrollTop += r.bottom - p.bottom + 4`.
7. Else nothing (a row already in view never creeps).

Steps 5 and 6 are today's arithmetic (`ScenePanel.tsx:150-154`, the box's border box and 4px), kept so job 27's tests (C10, C11) keep their numbers. Step 4 is new. Nothing else scrolls: not the guide, not the window, and `scrollIntoView` is not called. `scrollTop` is set directly, so the move is instant in every motion setting.

### 2.3 When it runs

In `ScenePanel`'s existing row-into-view `useLayoutEffect` (no dependency list; declared after the play effect, E18), which runs in the commit of every mark, tick and event:

- **The `panelHome === null` guard goes.** The root is `panelHome` when the table is in the guide, and otherwise the scene's own `<section>` (a ref on it), which holds the panel under the scene and, on a phone and an upright tablet, in the Table tab.
- It calls `keepRowInView(root)`, unless the reader holds the table (§2.4).
- `LessonConsole`'s Table-tab effect (`LessonConsole.tsx:149-153`, `scrollIntoView` of `MARKED_ROW` when the tab opens or its table changes) **stays as it is.** When the tab opens, `ScenePanel` re-renders with `LessonConsole` and its effect runs first (a child's layout effects run before its parent's), bringing in the row being read; during a read there is no `MARKED_ROW` row in the rules panel, so the tab's effect finds nothing, and for every other table both effects pick the same row. `site.spec.ts` "8: opening the Rules tab brings the rule that decided into view" and the tab's unit tests (P3, C5, C21) keep passing unchanged.

### 2.4 A reader who takes the table

Today a reader who scrolls the guide's table during a visit is brought back at each mark (2.136). With A that would happen at every rule read, so:

- **The reader takes the table** with a `wheel`, a `touchstart` or a `pointerdown` on the box, or a `keydown` of ArrowUp, ArrowDown, PageUp, PageDown, Home, End or Space while focus is in the box. Listeners on the root, delegated (`event.target.closest('.tpanel, .rpanel')`); `wheel` and `touchstart` passive. A scroll made by script, by the browser restoring a position, or by this effect itself does not take the table.
- **While the table is taken**, the effect does not move it: not at the next rule read, not at the deciding mark, not when the visit lands.
- **It is let go** when the play effect starts a new play (the next event of the step, the next step of Play all, Replay) and when the console moves to another place (`derived.slot`'s unit, kind or step changes). From that commit it follows again, so the next read's first rule brings the box back to its top (§2.2 step 4).
- One `useRef<boolean>` in `ScenePanel`. No words or marks are shown for it.

### 2.5 Reduced motion

Nothing animates: the move is a `scrollTop` assignment and the panels set no `scroll-behavior` (and `global.css` keeps it off under reduced motion). As today, a hand move under reduced motion lands its step at once, so no rule is read and the landed marks show with the deciding rule in view; Replay and Play all read the rules with their waits and the box follows each read exactly as with motion. The rows' 200ms tint transition is already off under reduced motion (B34: `transition-duration: 0s`).

### 2.6 What changes on other lessons

- **The guide (`.tpanel` tables):** no change. They mark no row current, so the row followed is the marked one, as today. The new first-row rule applies only when the marked row is a table's first row and sits above the box, which a table that only grows at its foot does not produce; if it does, the box goes to 0 instead of 4px above the row.
- **Under the scene** (desktops under 890px tall, tablets): the table's box now brings its marked row into view, which nothing did. On the 16 steps of §1 the marked row comes into view; on the other 98 steps with a marked row the row is already in view and nothing moves.
- **The Table tab on a phone:** the box follows every mark of every lesson, in its commit, as the guide does since job 27; today it follows only when the tab opens or its table changes.
- **Job 27's tests that pin today's behaviour change on purpose:** `LayoutEffects.test.tsx` X1 ("under the scene (no panelHome) nothing scrolls") becomes "under the scene the box brings the deciding rule in, and the window does not move"; C14 ("a rule being read (check) out of view does not scroll") becomes "a rule being read out of view is brought in, in the commit of its mark". C10, C11, C12, C13, C16, P4a and P4b keep their assertions.

## 3. States (step 2, the box at 1440 × 900 and in the Rules tab at 375 × 667)

| State | The rules panel | The box (A) |
|---|---|---|
| Step 1 landed | Rule 1 "Fits → allow" (green); rules 2 and 3 unread; "Visitor → port 443 rule 1" remembered | At its top |
| Step 2 starts (forward button, Replay, Play all) | No marks while the tag rides to the gate | Unmoved; a taken table is let go |
| Rule 1 read | Rule 1 marigold, "Checking", `aria-current` | Rule 1 in view; to 0 if it was above |
| Rule 1 done | "Doesn’t fit", muted | Unmoved |
| Rule 2 read, done | As rule 1 | Rule 2 in view (it is, at both sizes) |
| Rule 3 read | Rule 3 marigold, "Checking" | Steps down so rule 3's foot is 4px above the box's foot: 28px at 1440 × 900, 27px at 375 × 667 |
| Rule 3 decides | "Fits → deny" (red) | Unmoved: already in view |
| Landed | Same marks; the log's row "Denied · rule 3" | Unmoved |
| Taken during the read | As above | Where the reader put it, until the next play or place |
| Rules tab closed | Not drawn | Never measured or moved; opening the tab brings the row being read (or the deciding rule) in, in the commit of the click |
| Speeds 0.5×, 1.5×, 2× | Each read lasts 1400, 467 or 350ms | The same moves, in the frame of each mark |

**Variant B** at 1440 × 900: the box is 229px of client height, the panel's caption, column names and three rules fit, and the box does not move during step 2 at all (0 moves; the connections row stays below the fold of the box, as now).

## 4. Variant B: the whole rule list in the guide

A's rule, and one more: **in the guide, a box holding a rule list is as tall as its last rule** (plus the panel's bottom padding), up to 40% of the guide, and never shorter than today's cap.

- `console.css`, after `.guide__table`: `.guide__table:has(> .rpanel) { max-height: max(clamp(120px, 24%, 200px), min(var(--rules-fit, 0px), 40%)); }`
- `ScenePanel`'s effect, before following, when `panelHome` holds a `.rpanel`: `--rules-fit` on `panelHome` = `ceil(lastRule.bottom − box.top + box.scrollTop + paddingBottom)` px, from `getBoundingClientRect()` of the last `tbody tr` and of the box (230 at 1440 × 900, 1100 × 890 and 1920 × 1080).
- **Buys:** the caption ("Rule list, read from the top, first match wins"), the column names and all three rules stay in one view while they are read: nothing moves at all on Firewalls at 890px tall and up.
- **Costs:** the words' room at 1440 × 900 goes from 477 to 440px. Firewalls' words then scroll on all six steps (by 27 to 54px), against today's one (step 1, by 17px); at 1100 × 890 from 469 to 430 (they scroll on every step there already); at 1920 × 1080 from 650 to 620 (they still fit). It is a second mechanism, and a measured height, for one lesson's panel; A's rule is still needed on phones and for any longer list.

**Why A:** one rule fixes every place a table is drawn, including the phone's tab where "Fits → deny" is never shown today, and it needs no change to the page's layout (the owner's standing rule for the Lesson page: rearrange only with a measured gain). At 1440 × 900 the only cost is the caption's line leaving the top while rule 3 is read, which already happens today from "Fits → deny" on.

## 5. Words

No new words, and no lesson words change. The panel's words ("Rule list", "read from the top, first match wins", "Checking", "Doesn’t fit", "Fits → deny", "Connections it remembers") and the lesson's are copied unchanged from `RulesPanel.tsx` and `src/content/lessons/firewalls.ts`.

## 6. Sizes and breakpoints

Nothing changes in A's sizes. The guide's table stays `clamp(120px, 24%, 200px)` from 1100 × 890; the Rules tab is the phone's panel (`--ph-top` 105, `--ph-stage` 34dvh, `--ph-line` 36, `--ph-tabs` 44, `--ph-ctl` 64); the rules are 52px each at both. The 4px margin is today's. B: §4.

## 7. Acceptance checks

Measure as §1 did, with a frame recorder added before the action (`page.evaluate` or `addInitScript`): every `requestAnimationFrame`, record `scrollTop` of the box and, for the row with `data-state="check"` and for the row with `data-state` `allow` or `deny`, whether it is **wholly in** (its `getBoundingClientRect()` inside the box's border box from `p.top + clientTop` to `p.bottom`, within 0.5px). An `IntersectionObserver` rooted on the box with `threshold: 1` may be used instead (its entries are computed just before paint). "Arrive from step 1" = `?step=1`, wait for `.rpanel tr[data-state="allow"]` and for the play to end (Play all's button idle, or 2.5s), set the speed with the speed button, start the recorder, press the forward button, stop the recorder 2s after `tr[data-state="deny"]` appears.

1. **The guide, every speed.** `d1440-dark` and `d1440-light` (1440 × 900), Firewalls, arrive from step 1 at 0.5×, 1×, 1.5× and 2×: in every frame with a `check` row, that row is wholly in `.guide__table .rpanel`; at least 20 / speed × 2 frames are recorded per rule (proof it watched). Red on `revamp`: rule 3 out 84, 42, 28, 21 frames.
2. **The guide, left scrolled.** Step 2 landed; set the box's `scrollTop` to 0 by script, press Replay at 1×: 0 frames out. Set it to `scrollHeight`, press Replay: 0 frames out, and in the frame rule 1 turns `check` the box's `scrollTop` is 0. Red on `revamp`: rule 3 out 42; rule 1 out 42.
3. **The other guide sizes.** 1100 × 890 and 1920 × 1080, arrive from step 1 at 1×: 0 frames out. Red on `revamp`: 42 each.
4. **Reduced motion** (`reduced-motion` project): step 2 landed, Replay at 1× and at 2×: 0 frames out; the box's computed `scroll-behavior` is `auto`; the distinct `scrollTop` values recorded during the play are at most one more than the number of marks (no value between two marks: no animated scroll). The forward button from step 1 lands step 2 with no frame holding a `check` row and the deciding rule wholly in.
5. **The Rules tab on short phones.** 375 × 667 and 360 × 640, `isMobile`, `hasTouch`: open Rules, arrive from step 1 at 1× and at 2×: 0 frames out for the `check` row, and from the frame the `deny` row appears to the recorder's end, 0 frames with it not wholly in. Red on `revamp`: rule 3 out (and rule 2 at 360 × 640); the deciding rule never in.
6. **Phones where the list fits.** 375 × 812 and the `phone` project (390 × 844): the box's `scrollTop` is 0 in every recorded frame of the play.
7. **Taking the table.** 1440 × 900, step 2 landed, Replay at 1×; when rule 1 is `check`, `page.mouse.wheel(0, 400)` over the box: from the next frame to 1s after the step lands, `scrollTop` has one value. Then Replay: in the frame rule 1 is `check`, `scrollTop` is 0. Repeat with a `touchstart` dispatched on the box, a `pointerdown` on a row, and PageDown pressed with focus in the box (each takes it). A `scrollTop` set by script during the read does not take it: the next mark brings the row in.
8. **Let go on a move.** Take the table during step 1's read (box at its foot), press the forward button: in the frame step 2's rule 1 turns `check`, `scrollTop` is 0.
9. **Under the scene.** 1280 × 800 and 1024 × 768, reduced motion, each of the 16 steps of §1: settled, the marked row is wholly in its box (red on `revamp`); on the other 98 steps with a marked row, `scrollTop` equals `revamp`'s. Firewalls' step 2 at 1366 × 768: `scrollTop` 0 throughout.
10. **A closed tab.** 375 × 667, Explain open, arrive from step 1: the rules box's `scrollTop` never changes. Open Rules during rule 3's read: in the first frame the tab is painted, rule 3 is wholly in.
11. **The window and the guide never move.** In checks 1, 5 and 9, `window.scrollY` and the guide's `scrollTop` are constant through the recording, and `Element.prototype.scrollIntoView` is not called by `ScenePanel` (stub and count it, as `LayoutEffects.test.tsx` C12 does).
12. **Unit probes** (`LayoutEffects.test.tsx`, `<Profiler onRender>` and `stubBoxes`, E11 and E12): (a) panel in the guide, `onMark({ row: 2, state: 'check' })`: in `onRender` of that commit the box has scrolled and rule 3 is inside; (b) the same with `panelHome` null (under the scene); (c) box scrolled to 300, `onMark({ row: 0, state: 'check' })`: `scrollTop` is 0; (d) a `wheel` on the box, then a `check` mark on an out-of-view row: `scrollTop` unchanged; a new playback state with a pending event: followed again; (e) the order: with a `check` row and a `[data-known]` chip both present, the `check` row is the one brought in. Each red on the seed with `READ_ROW` left out of the order (a–c, e) or with the hold removed (d). X1 and C14 change as §2.6 says.
13. **Job 27's checks hold.** `LayoutEffects.test.tsx` P1 to P4b, C2, C5, C9 to C13, C16, C18, C21 green; the guide's marked row 0 frames out on Proxies step 3 at 1440 × 900 during Play all.
14. `npx vitest run --maxWorkers=3`, `npm run build`, and CI's end-to-end pass green.

**Variant B only:** 15. At 1440 × 900, 1100 × 890 and 1920 × 1080 with Firewalls in the guide, the box's client height is 229 ± 1 and its `scrollTop` is 0 in every frame of step 2 arrived from step 1; the words' box is 440 ± 1 at 1440 × 900. 16. On a lesson with a `.tpanel` in the guide (DHCP step 4, Proxies step 5) the box is 192 at 1440 × 900, as today.

## 8. The prototype

`prototypes/d24-firewalls-guide.html`, one file, fonts inlined, no network. It draws the Lesson page at 1440 × 900 (its console fixed at 831px under the 69px header, so the guide's box is the live 192px whatever the window's height) and the phone at 375 wide (667 or 812 tall), and plays Firewalls' steps 1 and 2 with the driver's times (ride, 700ms a rule, the stop, landing) at the four speeds. The strip at the top: **Design** (Today, A, B), **Width** (1440 needs a window 1100px wide or more; under 1100 it shows the phone, and the strip moves under it), **Phone height**, **Theme**, **Motion** (Reduced lands hand moves at once, as the site does), and **Leave the table** at its top or foot (a script scroll, which does not take the table). Wheel, touch, click or keys on the table take it; the strip says when. Its probe counts, per play, the frames each rule was read and the frames it was not wholly in the box, as check 1 does; it reads, at 1440 × 900 and 1×: Today rule 3 42 of 42 out (54%), A and B 0 (B moves 0 times); at 375 × 667: Today rule 3 42 of 42 out (55%) and the deciding rule 97 frames out, A 0.

Simplified there, unchanged on the site: the figure is a flat stand-in drawn with the tokens (the site's drawing does not change); the track column, the bar and the header are static; the log shows the steps' rows; Play all stops after step 2; the source marks in Go deeper are left out.

## 9. Decisions

- Follow the row being read rather than size every table to fit: guide tables run to 791px of content (ICMP step 6) against a 200px cap, so only following is general.
- Query by priority, not in document order: the row being read must win over a chip or an earlier marked row.
- `aria-current` marks the row to follow: the panel already sets it for screen readers, so both follow one row and a new panel needs no new selector.
- Own box only, `scrollTop` set directly: the page and the guide never move, and a read of 350ms at 2× leaves no time for an animated scroll to arrive.
- Keep today's border-box arithmetic and 4px: job 27's tests keep their numbers.
- The first row brings the box to its top: when a read starts over, "read from the top, first match wins" comes back with rule 1.
- Run wherever the table is drawn: the phone's tab needs it (the deciding rule is never shown at 375 × 667), and the 16 steps under the scene gain.
- Leave `LessonConsole`'s tab effect alone: it still serves the tab's opening, and its tests stay as they are.
- A reader's hand holds the table until the next play or place: with every read followed, 2.136's pull-back would otherwise come three times a visit.
- No change to the page's layout in the recommendation: the Lesson page is rearranged only for a measured gain, and B's gain costs the words.

## 10. Open questions for the owner

1. **The hand hold changes 2.136.** `plan.md` lists "a reader who scrolls the guide's table by hand ... is brought back at each mark" as not in this job. A includes the hold because following every read would pull a reader back three times a visit. Keep it in B41 (recommended), or leave today's pull-back?
2. **Under the scene.** The general rule also brings the marked row into view under the scene, where nothing does today (16 of 114 steps at 1280 × 800 and 1024 × 768). Keep it in B41 (recommended), or limit B41 to the guide and the Table tab?
3. **A or B** (§4).
