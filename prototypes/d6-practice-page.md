# D6: the Practice page

Spec for build units B8 (the list's store and the list of questions) and B9 (the page). Prototype: `prototypes/d6-practice-page.html`, one file that opens from the file system with no server and no network. Its 40 questions were printed from `src/content` by a throwaway script (the registry, `numberedSources` and `sourceMarks`), not retyped. Screenshots: `.superpowers/revamp/job-9/shots/d6-*.png` (on this machine only, git-ignored).

The yellow "Prototype" panel at the foot of the window is not part of the design. It switches the variant, the theme, the list (empty, one, nine), storage (works, blocked) and JavaScript (on, off), and "First visit" clears everything. The address can set a state too: `?v=b`, `?theme=dark`, `?list=0|1|many`, `?view=kept`, `?blocked=1`, `?nojs=1`, `?bare=1` (hides the panel), `?pick=<key>:<option>,...`. No link leaves the prototype; a "Read the lesson" link shows its real address as a tooltip.

## 1. The design in one paragraph

`/practice` has two views behind one control: **All questions** and **To try again**. All questions lists the two tracks, and under each its lessons as rows; a row opens to that lesson's questions, drawn as the lesson draws them, with a link back to the lesson. A wrong pick keeps the question: a line under its feedback says "Kept to try again." and the control's second half shows how many are kept. To try again shows the kept questions as cards, newest first, each naming its lesson and track. A right pick, or "Remove", lets a question go; it stays where it is on the screen, marked "No longer kept.", until the reader leaves the view. Nothing is scored, counted or timed.

## 2. Variants

Both are in the prototype behind the "Variant" switch. They differ in one thing: which lesson rows start open.

- **A, lessons folded (recommended).** The first lesson (HTTP) starts open, the other 17 closed. The page is 3,155px tall at 375 wide and 2,570px at 1440.
- **B, everything open.** All 18 rows start open, and a line under the control jumps to each track. 13,249px at 375 wide, 7,137px at 1440.

**Why A.** At 375 wide B is four times as long, and two and a half times About, the longest page the site has (5,179px at 390). In A the rows are the way to choose: 18 lesson names fit in two screens, and the first row, open, shows what a question looks like before the reader presses anything.

**What B buys.** Every question is on the page with no press, so a reader can scroll the whole sheet and the browser's find-in-page reaches every question in every browser. Its cost is the length, and that the track "Networking Concepts" starts 8,778px down a phone.

Not drawn, and why: **one question at a time**. It needs a place marker ("2 of 9"), which sits against the rule that the page shows no tally; it cannot reuse the lesson's `Practice`; and the list could not be read at a glance.

## 3. What the page is made of

Top to bottom. Class names are the prototype's; the builder may rename them, the sizes and words hold.

| Part | What it is |
|---|---|
| Header | `SiteHeader` with a fifth link (section 9). `current="practice"`, so "Practice" has `aria-current="page"`. "Start learning" shows. |
| Head (`.pp-head`) | `h1` "Check yourself", then one paragraph of intro. |
| The control (`.pp-tabs`) | Two tabs: "All questions" and "To try again", the second with the count when the list is not empty. |
| Jump line (`.pp-jump`) | Variant B only. |
| View 1 (`#view-all`) | For each track: an `h2` with the track's title, then one `<details>` row a lesson, in the track's order. |
| View 2 (`#view-kept`) | `h2` "To try again", how many, "Empty the list", one paragraph, then the cards, or the empty box. |
| Footer | `SiteFooter` with "Practice" added (section 9). |

No drawing. The page's picture is the questions; a new figure of the family (direction §8) cannot be specified for a builder and is a job of its own.

### A lesson's row (`details.pl`)

- `<summary>`: a 16px square marker (a plus when closed, a minus when open), the lesson's title, its subtitle, and at the right `questionsTitle(count)` from `src/lesson/Practice.tsx` ("Two questions", "Three questions").
- Open: the lesson's `Practice` list, then the link back.
- Rows open and close independently. Nothing closes a row but the reader. A row's open state and the picks inside it survive a visit to the other view.
- Variant A: the first row of the first track has `open` in the HTML; no other has. Variant B: all have.

### A question

The lesson's `Practice` component, unchanged in markup, with three page-level differences (section 8). Picking an option shows that option's feedback and its source marks, exactly as in the lesson: "Right." in green words, "Not quite." in strong ink, the picked option outlined in green or in ink. Another pick replaces it.

### The kept line (`.pp-kept`)

One line inside the question's `<li>`, after the feedback. It has three states:

| State | When | Marker | Words | Button |
|---|---|---|---|---|
| none | the question has not been on the list at any moment of this visit | none | none; the line takes no room | none |
| kept | its key is on the list | filled 9px square, strong ink | "Kept to try again." | "Remove" |
| off | its key was on the list during this visit and is not now | empty 9px square, muted | "No longer kept." | "Keep it" |

- "Remove" takes the key off the list. "Keep it" puts it back, at the front. It is one `<button>` whose label changes, so focus stays on it.
- The marker and words are ink. Not the orange (it means "here" and "do this") and not green (it means done and right).
- A question drawn in both views shows the same state and the same pick in both.

### The way back to the lesson

- Words: "Read the lesson: {lesson title}", for example "Read the lesson: HTTP".
- It lands on the lesson's **Learn** part: `{canonical lesson address}?step={positionOf(lesson, 0, 'learn')}`, for example `/how-the-internet-works/what-is-http?step=6`. Learn is where the lesson says in words what the question asks about; Watch is one press back from there in the lesson's own contents.
- View 1: one link at the foot of each open row, for the row's questions. View 2: one link at the foot of each card, with the track's name added for screen readers only (", in Networking Concepts"), because two lessons are called DHCP.
- A plain link in the same tab.

### A card in To try again (`li.pk`)

1. Where it is from: the lesson's title on a strip of label tape (the look of `.eyebrow`), then the track's title in muted words.
2. The question, with no number (one question to a card).
3. The kept line. In this view it always shows, since every card's question has been on the list.
4. The way back.

### The empty box (`.pk-none`)

A dashed outline (as the stamp's "not yet" ring is dashed), an `h3`, one paragraph, and the button "See all questions", which opens view 1 and moves focus to its tab.

## 4. States

Every one is in the prototype.

| # | State | How to see it in the prototype | What shows |
|---|---|---|---|
| 1 | First visit | "First visit" | View 1. HTTP open, 17 rows closed. No count on the control. No kept line anywhere. |
| 2 | A question unanswered | any open row | Prompt, options, no feedback, no kept line. |
| 3 | Answered right, never kept | pick the right option | The option in green, "Right. ..." (or the lesson's own "Yes."), marks. No kept line. |
| 4 | Answered wrong | pick a wrong option | The option outlined in ink, "Not quite. ...", marks, the kept line in "kept". The count goes up by one. |
| 5 | List empty | "The list: Empty", or open To try again on a first visit | `h2`, no count, no "Empty the list", no paragraph; the empty box. |
| 6 | List with one | "The list: One" | "1 question", "Empty the list", the paragraph, one card. |
| 7 | List with many | "The list: Many (9)" | "9 questions", nine cards, newest first. |
| 8 | A kept question answered right | in To try again, pick a card's right option | The card stays in place. Kept line "No longer kept." with "Keep it". The count goes down by one. On leaving and reopening the view the card is gone. |
| 9 | Every card let go | answer or remove them all | The cards stay. Beside the `h2`: "Nothing left on the list". No "Empty the list". On reopening: the empty box. |
| 10 | Asking to empty | press "Empty the list" | The button gives way, in place, to "Empty the list?" with "Empty it" and "Cancel". Focus is on "Empty it". Escape or "Cancel" restores the button and its focus. |
| 11 | Emptied | press "Empty it" | The cards go at once, the empty box shows, focus moves to its heading, and "Your list is empty." is announced. In view 1 every kept line that showed "kept" now shows "off". |
| 12 | Storage blocked | "Storage: Blocked" | Everything works for the visit. Three sentences change (section 5, rows 13, 16 and 20). |
| 13 | JavaScript off | "JavaScript: Off" | The `h1`, then "Practice needs JavaScript" and two sentences. No intro, no control, no questions, no theme button. |
| 14 | Light and dark | "Theme", or the header's button | The tokens only. |

### When a card goes from view

**While To try again stays open, no card is added, moved or taken away, whatever happens to the list.** The cards are the list as it was when the view was opened (on load with `#to-try-again`, or when the tab is chosen). The one exception is "Empty it", which the reader has just confirmed. So a question answered right, or removed, never moves under the finger; it goes the next time the view is opened.

### Opening To try again forgets the picks of its questions

When the view opens, the pick of every question on the list is cleared, in both views, so each card starts unanswered: it is a list of questions to try, and a card that already shows the reader's wrong answer and its feedback has nothing left to try. The kept line in view 1 still says "Kept to try again."

## 5. Every word of new copy

Sentence case. No word here says anything about technology beyond the name "JavaScript", which the Lesson page's own no-script note already uses.

| # | Where | Words |
|---|---|---|
| 1 | Header link, phone menu link, footer link | Practice |
| 2 | `BaseLayout` `title` | Practice |
| 3 | `BaseLayout` `description` | Every Practice question from the TechConcepts lessons in one place. Each answer says why it’s right or not. Nothing is scored. |
| 4 | `h1` | Check yourself |
| 5 | Intro | The questions from every lesson, in one place. Each answer says why it’s right or not. Nothing is scored. A question you miss is kept for you to try again. |
| 6 | The control's label (`aria-label`) | Questions to show |
| 7 | Tab 1 | All questions |
| 8 | Tab 2 | To try again |
| 9 | Tab 2's accessible name | "To try again" when the list is empty; "To try again, 1 question"; "To try again, 9 questions" |
| 10 | Variant B's jump line | Jump to (then each track's title as a link) |
| 11 | A row's count | `questionsTitle(count)`: "Two questions", "Three questions" |
| 12 | Kept line, kept | Kept to try again. |
| 13 | Kept line, kept, storage blocked | Kept to try again, for this visit. |
| 14 | Kept line, off | No longer kept. |
| 15 | Kept line's button | Remove / Keep it |
| 16 | The way back | Read the lesson: {lesson title} (screen readers, in a card: ", in {track title}") |
| 17 | View 2 `h2` | To try again |
| 18 | Beside it | "1 question" / "{n} questions"; "Nothing left on the list" when cards show and the list is empty; nothing when the box shows |
| 19 | View 2's paragraph (only when cards show) | Questions you miss are kept here until you get them right or remove them. The list is saved in this browser only. |
| 20 | The same, storage blocked | Questions you miss are kept here until you get them right or remove them. This browser is not letting the site save anything, so the list lasts only for this visit. |
| 21 | The button | Empty the list |
| 22 | Asking | Empty the list? / Empty it / Cancel |
| 23 | Empty box, `h3` | Your list is empty |
| 24 | Empty box, paragraph | A question you miss, here or in a lesson, is kept on this list until you get it right. It is saved in this browser only. |
| 25 | The same, storage blocked | A question you miss, here or in a lesson, is kept on this list until you get it right. This browser is not letting the site save anything, so the list lasts only for this visit. |
| 26 | Empty box, button | See all questions |
| 27 | Announced after emptying | Your list is empty. |
| 28 | JavaScript off, `h2` | Practice needs JavaScript |
| 29 | JavaScript off, paragraph 1 | This page checks your answers and keeps your list in your browser. It can do neither while JavaScript is off. |
| 30 | JavaScript off, paragraph 2 | One question works without it, in How a lesson works on Home. ("How a lesson works" links to `/#try`.) |

Row 24's "or in a lesson" becomes true with B10 (D7). If B9 ships before B10, the words still ship as written, since both are one job.

## 6. Sizes and spacing

Tokens are `src/styles/tokens.ts`; none is added. Fonts are the site's three. Measured on the prototype.

| Thing | Value |
|---|---|
| Page wrap | the site's `.wrap` (1240px, 32px gutters), `padding-top: 36px; padding-bottom: 72px` as Tracks |
| `h1` | `.disp`, 64px; 44px at 560 wide and under |
| Intro | 17px/1.55, muted, `max-width: 37em`, 12px under the `h1` |
| Control | 28px under the head. The header's `.pillnav` box (3px padding, 2px gap, inset 1px `line-strong`). A tab: 44px tall, `0 18px`, Barlow 600 17px. Selected: `bg-soft` ground and a 2px `here` line at its foot. At 560 and under: full width, two equal halves. |
| Count | a 22px-tall square-cornered chip (2px), 1px `line-strong`, `card` ground, strong ink, Barlow 700 14px, 8px after the words. Hidden at zero. |
| A view | 28px under the control |
| Track `h2` | 32px (26px at 720 and under); 40px above (0 for the first), 14px below |
| Row | 1px `line-strong`, 6px corners, `card` ground, 8px between rows |
| Row summary | at least 56px tall, padding `8px 20px`; grid `16px, 1fr, auto`, 14px gaps. Title Barlow 700 20px. Subtitle 15px muted, on the title's line, wrapping under it when short of room. Count Barlow 600 14px muted. Measured 56px at 1440, 66px at 375 (two lines). |
| Row body | padding `6px 20px 8px 50px` (the questions start under the title); `4px 16px 6px` at 560 and under |
| Questions in a row | grid `repeat(auto-fit, minmax(min(348px, 100%), 1fr))`, gaps 24px down and 40px across. A question is at most 560px wide. A row of two is at most 1160px. |
| Option | as the lesson's, with `min-height: 44px` and its words centred in that height |
| Kept line | at least 44px tall when it shows, 6px above it (10px in a card), a 1px dashed `line-strong` rule on top. Words Barlow 600 14px; marker 9px, 9px before the words. Button: no box, underlined, Barlow 600 14px, 44px by at least 44px to the finger. |
| Way back | 15px, weight 600, the site's link style, 44px tall to the finger; 12px above in a row, 0 in a card |
| View 2 head | `h2` 32px (26px at 720 and under), the count 15px muted on its baseline, "Empty the list" at the right as an underlined text button, wrapping under the heading when short of room |
| View 2 paragraph | 15.5px/1.5 muted, `max-width: 37em`, 10px above |
| Cards | grid `repeat(auto-fill, minmax(min(320px, 100%), 1fr))`, 16px gaps (12px at 560 and under), 24px above, each card at its own height (`align-items: start`) |
| Card | padding `18px 20px 8px` (`16px 16px 6px` at 560 and under), 1px `line-strong`, 6px corners, `card` ground. Label tape: `3px 9px`, 1px `line-strong`, 2px corners, `bg-soft`, Barlow 600 14px; 14px under the label row. |
| Empty box | `max-width: 37em`, 1.5px dashed `line-strong`, 6px corners, padding `22px 24px 24px`; `h3` 22px; paragraph 15.5px; the button is the site's `.btn` |
| Asking to empty | "Empty the list?" Barlow 600 15px; two boxed buttons, 44px tall, `0 14px`, 12px apart |
| Phone bleed | at 560 and under, rows, cards and the empty box reach 16px past the text on each side (`margin-inline: -16px`), so with their 16px padding their words stand at 32px, under the `h1` |

Motion: the lesson's own option transitions, and the row marker's 150ms turn. Nothing moves on load. `prefers-reduced-motion` is already handled site-wide.

## 7. Breakpoints, and what each width shows

| Width | Header | A row's questions | Cards |
|---|---|---|---|
| 375 | menu button; five links and "Start learning" in the menu, each 45px tall | one column, 309px | one column, 343px cards, 309px questions |
| 768 | menu button (section 9) | one column, 560px | two across, 344px cards |
| 960, 1024 | five links on one line, "Start learning" | two across (392px, 424px); a third question goes under | two across |
| 1280 | the same | two across at 552px, or three at 355px | three across, 395px |
| 1440 | the same | two across at 560px, or three at 363px | three across, 403px |

No width from 375 to 1440 scrolls sideways (measured at each width above, both views, the empty box and the no-script state).

## 8. What is reused, and what differs

- **`BaseLayout`, `SiteHeader`, `SiteFooter`, `site.css`**: as they are, with section 9's changes.
- **`Practice` (`src/lesson/Practice.tsx`) and `Marks`**: the question, its options, its feedback, its live region and its marks are the lesson's, in markup and in words. Three differences, none of which changes what a lesson draws:
  1. `Practice` gains one optional prop, a function from a question to what is drawn at the end of that question's `<li>` (the kept line). Without the prop its output is byte for byte today's.
  2. The rules for `.practice*` and `.explain__marks` now live in `src/lesson/console.css`, which only the Lesson page loads. They move, values unchanged, to a stylesheet both pages load.
  3. Page rules, scoped to this page: the grid of questions, `min-height: 44px` on an option, a question's 560px limit, and in a card no number and no limit.
- **`questionsTitle`**: a row's count.
- **`createSafeStorage`**: the only door to storage, as everywhere.
- **Saved progress is not read.** A "Done" mark beside a lesson's questions would read as a mark on the questions, and Practice has none. A reader who has finished no lesson sees the same page as anyone.
- **The page keeps picks in memory, by question key, for the visit.** A reload clears them. They are never stored.

## 9. The header and footer

Drawn here as part of the page. D7 carries them to every page and must match.

- **The link.** `{ key: 'practice', href: '/practice', label: 'Practice' }`, second: Tracks, **Practice**, How a lesson works, Sources, About. Tracks and Practice are the two places to do something; the next two are parts of Home. The `current` union gains `'practice'` in `SiteHeader` and `BaseLayout`.
- **The phone's menu** lists the same five in the same order, then "Start learning".
- **One change to the header's styles: the menu takes over below 960px.** `@media (max-width: 720px)` becomes `@media (max-width: 959px)` in `SiteHeader.astro`. From the measured widths, five links, the brand and "Start learning" need 912px of page; today's four already break at 768, where "How a lesson works" and "Start learning" each wrap to two lines and the nav is 54px tall. At 960 the five sit on one line (32px each). The footer's own 720px rule does not change.
- **Footer.** "Practice" joins the Learn list, after "All tracks" and before "How a lesson works". The foot line "Your progress is saved only in this browser." stays.

## 10. The data the page needs (B8)

Worked out when the site is built, from the registry; nothing is copied into a file.

- **Tracks** in `tracks` order. For each: `id`, `title`, and its lessons.
- **Lessons**: each `available` lesson, once, under its home track (the first track that lists it), in that track's order. For each: `slug`, `title`, `subtitle`, its canonical address (`/{home track}/{slug}`), its Learn address (that plus `?step={positionOf(lesson, 0, 'learn')}`), its unit's `practice` questions as they are, and the unit's source numbers (`numberedSources(unit).numberOf`), so `Marks` draws the lesson's own numbers.
- **Questions**: `id`, the key `{lesson slug}/{question id}`, `prompt`, `options` (`text`, `feedback`, `cite`), `answer`.
- Today that is 2 tracks, 18 lessons and 40 questions. The page must not state any of those counts.
- A lesson with no question gets no row. A track with no row gets no heading.
- Weight: the 40 questions with their marks are 70 KB as JSON and 14 KB gzipped, well inside the 250 KB page budget.

## 11. The list, as rules (B8)

A pure module over `createSafeStorage()`. The Lesson page (D7) uses the same module.

1. **Where.** Key `techconcepts:missed:v1`. Value `{"version":1,"keys":["dhcp/why-shout","what-is-http/more-files"]}`. Nothing else is stored: no option, no date, no count.
2. **Load.** Read the value and keep, in order, each entry that is a string, is the key of a question that exists now, and has not appeared earlier in the list. Anything else is dropped. A value that is missing, is not JSON, is not version 1, or whose `keys` is not an array gives an empty list. Loading writes nothing.
3. **Join.** A wrong pick puts the question's key at the front. If the key is already on the list, nothing changes: it keeps its place.
4. **Leave.** A right pick takes the key off. So does "Remove".
5. **Keep it.** Puts the key at the front.
6. **Empty.** The list becomes `[]` and is written as `{"version":1,"keys":[]}`.
7. **Order.** Newest first.
8. **Write.** Every change writes the whole list.
9. **Blocked.** When `storage.available` is false at load, or any write returns false, the list lives in memory for the rest of the visit, every rule above still holds, and the page shows the blocked words (section 5, rows 13, 20 and 25).
10. **Other windows.** The page reads the list when it loads and each time To try again opens. It does not listen for changes made elsewhere.
11. **The count** on the control is the list's length, updated on every change. It is the only number on the page, it appears nowhere else on the site, and at zero it is not shown.

## 12. Keyboard and screen readers

- **Focus order:** skip link; brand; the five links; theme; "Start learning" (on a phone: brand, theme, menu); the control; the open view; the footer.
- **The control** is a tab list: `role="tablist"`, two `role="tab"` buttons with `aria-selected` and `aria-controls`, the views `role="tabpanel"` with `aria-labelledby`. It is one stop: Left and Right move between the tabs and open them, Home and End go to the first and last. Choosing a tab keeps focus on the tab.
- **The address.** Opening To try again sets `#to-try-again` with `history.replaceState`; All questions clears it. Loading the page with that hash, or a `hashchange` to it, opens the view. D7 links to it.
- **A row** is a native `<details>`; its `<summary>` is the stop, and Enter or Space opens it.
- **A question:** each option is a stop, a `<button>` with `aria-pressed`, in a group labelled by the prompt, as in the lesson. After a pick, focus stays on the option, and the feedback's words are announced by the lesson's own polite live region. The marks are outside it.
- **The kept line's words** are in a second polite live region that is in the page from the start, so "Kept to try again." is announced after the feedback, and "No longer kept." when it changes. Its button is described by the question's prompt (`aria-describedby`).
- **Asking to empty:** a `role="group"` labelled "Empty the list?". Focus goes to "Empty it". Escape or "Cancel" brings back "Empty the list" and focuses it. After "Empty it", focus goes to the empty box's heading (`tabindex="-1"`) and a `role="status"` says "Your list is empty."
- **The count** is `aria-hidden`; the tab's accessible name carries it in words (section 5, row 9).
- **Targets:** every button, tab, summary and way-back link in `main` is at least 44px tall (measured: the smallest is 44). The source marks are the lesson's 11.2px inline links, unchanged, as D1 approved them.
- **Focus ring:** the site's `:focus-visible`.

## 13. JavaScript off

A plain statement, not working questions. The lesson's `Practice` is drawn by script and its options are buttons, so questions that work without script would need a second copy of all 40 in other markup (radio buttons, as Home's demo), kept in step with the first by hand; and the list, which is half the page, could not work at all. The Lesson page already says the same of itself ("This lesson needs JavaScript to play.").

- With script off the page shows the header, the `h1`, rows 28 to 30 of section 5, and the footer.
- The intro, the control and both views are not shown, so no dead button is on the page and no sentence promises feedback or a list. Do it as `BaseLayout` does: the page's `<noscript>` holds the statement and a `<style>` that hides those parts.
- Paragraph 2 points to Home's sample question, which works without script today (`src/pages/index.astro:235-260`).

## 14. Acceptance checks

Each can be tried on the prototype and turned into a test. "Stored" means the value under `techconcepts:missed:v1` (the prototype uses `d6-proto:missed:v1`).

**The page**

1. `/practice` has one `h1`, "Check yourself", and the title "Practice · TechConcepts".
2. On a first visit All questions is selected, exactly one row is open (the first lesson of the first track), and the control shows no number. (Variant B: every row is open.)
3. The rows are, in order, every available lesson of each track, under its track's `h2`; each row's count is `questionsTitle` of its questions. The questions drawn across all rows are every question of every available lesson, 40 today.
4. Each prompt, option and feedback on the page is, character for character, the lesson's.
5. The page's text holds no "score", no "%", no "streak", no "of 40", and no digit that counts answers. The only number that changes as the reader answers is the count on the control and beside "To try again".
6. At 375, 768, 960, 1024, 1280 and 1440 wide, in both views, with the empty box and with script off, `scrollWidth` equals the window's width.
7. At 375 wide a question is 309px wide; at 1440 a row of two questions puts them side by side at 560px each, and a row of three at 363px each (within 1px).
8. Every button, tab, summary and "Read the lesson" link in `main` is at least 44px tall at 375 wide.
9. In both themes the page uses only token colours.

**A question**

10. Picking an option shows its feedback and its marks; a mark's `href`, number and label are the ones the lesson shows for that option.
11. A right pick on a question that was never kept shows no kept line and stores nothing.
12. A wrong pick shows "Not quite.", shows "Kept to try again." with "Remove", stores the question's key at the front, and raises the count by one. The stored value holds keys only: no option index, no date, no count.
13. A wrong pick on a question already on the list changes neither the stored order nor the count.
14. A right pick on a kept question shows "No longer kept." with "Keep it", takes its key out of the stored list, and lowers the count by one.
15. "Remove" does the same as check 14 without changing the pick; "Keep it" puts the key back at the front. Focus stays on the button through both.
16. After a reload the picks are gone and the list is as stored.

**To try again**

17. With an empty list the view shows "Your list is empty", its paragraph and "See all questions", and neither a count nor "Empty the list". "See all questions" opens All questions.
18. With keys stored, the cards are those questions, newest first, each with its lesson's title, its track's title, an unanswered question and "Read the lesson: {title}".
19. A card's link goes to the lesson's Learn part (`?step=` the lesson's Learn position); so does a row's.
20. Answering a card right leaves the card where it is, with "No longer kept."; the number of cards does not change until the view is left and opened again, when the card is gone.
21. When every card has been let go, "Nothing left on the list" shows beside the heading and "Empty the list" does not.
22. Opening the view clears the picks of the questions on the list in both views; their kept lines in All questions still read "Kept to try again."
23. "Empty the list" shows "Empty the list?" with focus on "Empty it"; Escape and "Cancel" each restore the button with focus on it and change nothing.
24. "Empty it" stores `{"version":1,"keys":[]}`, shows the empty box with focus on its heading, puts "Your list is empty." in a `role="status"`, and removes the count.
25. Loading `/practice#to-try-again` opens To try again. Choosing a tab sets or clears that hash without adding a history entry.

**The list's store (unit tests, B8)**

26. Each rule of section 11 is a test: join at the front; a repeated join keeps the place; leave; keep it; empty; unknown keys, repeats and non-strings dropped on load; a missing, malformed or wrong-version value loads as empty; loading writes nothing.
27. With storage blocked (a getter that throws, and a `setItem` that throws), every rule still holds for the visit and the module reports blocked.

**Storage blocked, script off, keyboard**

28. With storage blocked, a wrong pick shows "Kept to try again, for this visit." and To try again shows row 20's paragraph (or row 25's in the empty box); nothing throws.
29. With JavaScript off the page shows the `h1`, "Practice needs JavaScript" and its two paragraphs; no option button, no tab and no "Empty the list" is visible; the link goes to `/#try`.
30. With JavaScript off, Home's sample question at `/#try` still shows feedback when an answer is chosen.
31. Left and Right on the control move between and open the two tabs; only the selected tab is in the tab order.
32. After a wrong pick the feedback's live region holds the feedback's words and the kept line's live region holds "Kept to try again."; neither holds a mark.

**Header and footer**

33. The header's links are Tracks, Practice, How a lesson works, Sources, About, in that order; on `/practice` "Practice" has `aria-current="page"`. The phone's menu lists the same five, then "Start learning".
34. At 768 wide the header shows the menu button and no link row; at 960 the five links are each on one line and "Start learning" is on one line.
35. The footer's Learn list is How the Internet Works, Networking Concepts, All tracks, Practice, How a lesson works.

## 15. Open questions for the owner

1. **The count.** The control shows how many questions are kept ("To try again 3"), and the view says it in words. It is there so the reader can see a missed question land on the list, and can see something is waiting without opening the view. It is plain ink, on this page only, and absent at zero. Should it stay?
2. **The name of the list.** "To try again" for the view, "Kept to try again." for a question. The word "missed" appears only in sentences ("A question you miss..."). Is that the right voice for your list?
3. **The heading.** The link says "Practice"; the `h1` says "Check yourself", About's own words for the Practice part, as Tracks says "Pick a track". Or should the `h1` be "Practice"?
4. **Variant A or B.**
5. **Where "Read the lesson" lands.** Learn, where the lesson says it in words. The alternative is the lesson's first screen.
6. **JavaScript off** is a statement, not working questions (section 13). Working questions would mean a second copy of the 40 in other markup.
7. **The header's menu takes over below 960px**, on every page, not 720px. Five links do not fit beside "Start learning" under 912px, and today's four already wrap at 768.
8. **No drawing on the page.** A figure for Practice would be a new member of the family and a unit of its own.
9. **Source marks keep the lesson's numbers** (a "4" is source 4 of that lesson) with no list of sources on this page; the mark's label names the place, and the link opens it. Enough, or should the page say which lesson's list the number belongs to?
