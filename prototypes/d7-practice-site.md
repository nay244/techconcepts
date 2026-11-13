# D7: what the rest of the site changes for Practice

Spec for build unit B10. Prototype: `prototypes/d7-practice-site.html`, one file that opens from the file system with no server and no network. Screenshots: `.superpowers/revamp/job-9/shots/d7-*.png` (on this machine only, git-ignored). It rests on D6 (`prototypes/d6-practice-page.md`): the names "Practice" and "To try again", the kept line and its words, the list's rules, and the menu at 960px are D6's and are not reopened here.

**How the prototype was made.** Each screen is the page as the site builds it today: its markup and its stylesheets were read from the built site (`dist`, built 12 Nov 2026 after the last change to `src`), not redrawn, and this unit's changes were applied on top. So everything that is not listed below is today's page. Only the changed parts answer a press; the lesson's scene, steps and controls are still.

The yellow "Prototype" panel is not part of the design. It switches the screen (Header and footer; Lesson: Practice; About), the theme, and each screen's states. The address can set a state: `?screen=chrome|lesson|about`, `?theme=dark`, `?page=home|tracks|track|about|notfound|practice`, `?kept=1`, `?blocked=1`, `?menu=1`, `?pick=<key>:<option>,...`, `?reset=ask|done`, `?go=lessons|privacy`, `?bare=1` (hides the panel). No link leaves the prototype; a changed link shows its real address as a tooltip.

## 1. What changes, in one list

| # | Where | Change |
|---|---|---|
| 1 | Header, every page that has one | A fifth link, "Practice", second. The menu takes over below 960px (it was 720px). |
| 2 | Footer, every page that has one | "Practice" in the Learn list. |
| 3 | A lesson's Practice part | The line under its heading. The kept line after each question. A wrong pick keeps the question's key; a right pick lets it go. |
| 4 | About, the Practice card | Its last sentence. |
| 5 | About, "What the site remembers" | One row becomes two. |
| 6 | About, the reset row | The sentence above it, the question, and what is said after. "Reset progress" also empties the list. |

Nothing else on any page changes. Home changes only through the shared header and footer. The Lesson page keeps its layout.

## 2. The header and footer

### What changes in each file

**`src/components/SiteHeader.astro`**

1. `current?: 'tracks' | 'how' | 'about'` becomes `'tracks' | 'practice' | 'how' | 'about'`.
2. `links` gains `{ key: 'practice', href: '/practice', label: 'Practice' }` as its second entry. The row and the phone's menu both come from `links`, so both get it. Order: Tracks, Practice, How a lesson works, Sources, About.
3. `@media (max-width: 720px)` becomes `@media (max-width: 959px)`. No rule inside it changes.
4. Nothing else: `showStart`, `currentOf`, the script, the `overHero` rules.

**`src/components/SiteFooter.astro`**

1. `<li><a href="/practice">Practice</a></li>` goes into the Learn list after "All tracks" and before "How a lesson works".
2. Its own `@media (max-width: 720px)` stays 720px. The foot line "Your progress is saved only in this browser." stays.

**`src/layouts/BaseLayout.astro`**

1. `current?: 'tracks' | 'how' | 'about'` gains `'practice'`, to match the header. Nothing else.

### What each page shows

| Page | `current` passed | Link marked | "Start learning" |
|---|---|---|---|
| Home `/` | none | none | yes |
| Tracks `/tracks` | `tracks` | Tracks, `aria-current="page"` | no |
| A track page | `tracks` | Tracks, `aria-current="true"` | no |
| About `/about` | `about` | About, `aria-current="page"` | yes |
| 404 | none | none | yes |
| Practice `/practice` (D6) | `practice` | Practice, `aria-current="page"` | yes |
| A lesson | no site header | | |

All as today, plus the Practice row. `currentOf` already gives "page" on the link's own address and "true" inside its section, so it needs no change.

**Home.** Home's header is the same header as every other page's: `src/pages/index.astro` passes neither `current` nor `overHero`. So no link is current on Home, though "How a lesson works" and "Sources" lead to parts of it; that stays. The header that sat clear over Home's hero (`overHero`, `.site-head[data-over-hero]`, `solidOnScroll`) is still in `SiteHeader.astro` and `BaseLayout.astro`, and no page uses it: dead code, noted here and left alone.

**A track page** draws `SiteFooter` itself, inside its scrolling route; it gets the new link through the same component.

**A lesson** has no site header or footer. Its way to the Practice page is in its Practice part (section 3).

### Why 960px: the measurement

Measured on the built site, with the fifth link added to the real header and the 720px rule taken away, in a window with no scrollbar. "Fits" means every link is on one line and "Start learning" is at its full 123px.

| Header | Narrowest window where it fits |
|---|---|
| Today's four links, with "Start learning" (Home, About, 404) | 827px |
| Five links, with "Start learning" (Home, About, 404, Practice) | **912px** |
| Today's four links, without (Tracks, a track page) | 686px |
| Five links, without | 771px |

- **Today is already broken from 721px to 826px.** At 768 wide on About, "How a lesson works" wraps to two lines, so the row is 54px tall where it should be 38px, and "Start learning" is squeezed from 123px to 98px and wraps to two lines.
- **Five links at 768 wide:** "How a lesson works" wraps to three lines and the row is 70px tall, taller than the 68px header.
- 912px, plus a 15px scrollbar on a desktop, is 927px. 960px leaves 33px to spare and is one number for every page, so the header does not change shape between Tracks and About at the same width.
- Before Barlow loads, the fallback face is wider: with Arial Narrow the five fit from 907px, with a plain sans-serif from 1,012px. That is a moment on a slow connection and is not designed for.

### What each width shows

| Width | Header |
|---|---|
| 375 | Brand, theme button, menu button. The menu lists Tracks, Practice, How a lesson works, Sources, About (45px each), then "Start learning" (48px) where the page has it. |
| 768 | The same as 375: the menu button. This is the change; today it shows the squeezed row. |
| 959 | The menu button. |
| 960 | The row of five links, each 32px tall on one line; "Start learning" 123px wide. |
| 1440 | The same row, centred, as today. |

No page type scrolls sideways at 375, 768, 959, 960 or 1440 (measured on all six).

## 3. The lesson's Practice part

The Lesson page keeps its layout. At 1440 wide the words column is still 560px (the questions 514px wide); at 375 the Explain tab is as it is. Three things change, all inside the Practice part.

### 3.1 The line under the heading

`src/lesson/Explanation.tsx:340`.

- Today: "Just for you. Nothing is scored or saved."
- New: "Just for you. Nothing is scored. A question you miss is kept on the Practice page."
- "Practice page" is a link to `/practice#to-try-again`, in the same tab. That address opens D6's To try again view; with nothing kept it shows the box that says what the list is.
- The link takes the paragraph's size, strong ink, weight 600, and the site's underline.
- It is `p.explain__sub`, as today. It is two lines at both widths (46px tall; today one line, 23px), so the first question starts 23px lower.

This line is the lesson's way to the Practice page. There is no other new link in the lesson.

### 3.2 The kept line

D6's kept line (its spec, section 3, "The kept line"), in the same place: inside each question's `<li>`, after the feedback. Same three states, same words, same button, same sizes, same two live regions.

| State | When | Shows |
|---|---|---|
| none | the question has not been on the list at any moment of this visit | nothing; the line is 0px tall |
| kept | its key is on the list | filled square, "Kept to try again.", "Remove" |
| off | it was on the list during this visit and is not now | empty square, "No longer kept.", "Keep it" |

- **A question that was kept on an earlier visit** shows "Kept to try again." with "Remove" as soon as the Practice part is drawn, before any pick. Answered right, it shows "No longer kept." with "Keep it".
- Storage blocked: "Kept to try again, for this visit."
- The line is 45px tall when it shows (44px and its 1px dashed rule), 6px under the feedback. The button is 62px by 44px to the finger.
- The line's rules are D6's, from the stylesheet both pages load (D6's spec, section 8, point 2).

### 3.3 What a pick does

- The key is `{lesson slug}/{question id}`, for example `dhcp/why-shout`. Every lesson is one unit.
- A wrong pick: the store's "join" (D6's spec, section 11, rule 3). A right pick: "leave" (rule 4). "Remove" and "Keep it": rules 4 and 5.
- The lesson reads the list once, when the console starts in the browser. It does not listen for changes made in another window.
- **The picks stay in memory for the visit, per unit, as today** (`LessonConsole.tsx:185-191`). They are never stored. A reload clears the picks; the kept lines of questions on the list show again, unanswered.
- `Practice` gets the kept line through the one optional prop D6 adds to it (D6's spec, section 8, point 1). `Practice` itself still stores nothing: the console owns the list, as it owns the picks.

### 3.4 What stays

| Thing | Stays because |
|---|---|
| The sidebar's line, "Just for you, nothing is scored" (`Outline.tsx:230`) | It is still true, and it is the short form of the new line. |
| The heading, `questionsTitle(count)` | Unchanged. |
| The options at their lesson size (a one-line option is 40px) | The Lesson page keeps its layout; D1 and D2 approved it. |
| The marks, the feedback's words and its live region | Unchanged. |
| The reading layout, the folded log, the phone's tabs | Unchanged. The window still does not scroll at 1440 by 900 or 375 by 812 (measured: the page is exactly the window's height). |
| The end row ("That's the whole lesson.", up next) | Unchanged, after the questions. |

### 3.5 States, and how to see each in the prototype

Screen "Lesson: Practice". The lesson is DHCP (Networking Concepts), with its three real questions.

| # | State | How |
|---|---|---|
| 1 | Unanswered | as it opens |
| 2 | Wrong pick, kept | pick B or C of question 1 |
| 3 | Right pick, never kept | pick B of question 2: "That's it. ..." and no kept line |
| 4 | "Remove", then "Keep it" | press the kept line's button twice; focus stays on it |
| 5 | Kept on an earlier visit, unanswered | "The list: Question 1 kept on an earlier visit" |
| 6 | That question answered right in the lesson | then pick A of question 1: "No longer kept." |
| 7 | Storage blocked | "Storage: Blocked", then a wrong pick |
| 8 | Light and dark, 375 and 1440 | "Theme"; the window's width |

## 4. About

### 4.1 The Practice card (`src/pages/about.astro:119`)

- Today: "A few questions, just for you. Each answer says why it’s right or not. Nothing is scored or saved."
- New: "A few questions, just for you. Each answer says why it’s right or not. Nothing is scored. A question you miss is kept for you to try again, on the Practice page."
- "Practice page" links to `/practice`. It takes the card's own link style.
- The card's label ("3 Practice") and heading ("Check yourself") stay.

### 4.2 "What the site remembers" (`src/pages/about.astro:200-203`)

The row "Your Practice answers / Not saved at all" becomes two rows, in this order, after "Light or dark theme":

| What | Where it’s kept |
|---|---|
| Which Practice questions you missed | filled square, "This browser only" |
| The answers you picked | empty square, "Not saved at all" |

- Same markup as the rows beside them (`th scope="row"`, `.where`, `.dot`, `.dot.off`).
- The table has four rows. At 1440 each is 52px; at 375 they are 104, 52, 104 and 77px.
- The section's heading ("Your progress stays with you"), its first paragraph and the table's caption stay: they are still true.

### 4.3 The reset row (`src/pages/about.astro:207`, `src/components/ResetProgress.tsx`)

"Reset progress" now also empties the list (the store's "empty", D6's spec, section 11, rule 6).

| Part | Today | New |
|---|---|---|
| The sentence above | To start fresh, reset it here. Clearing your browser data does the same. | To start fresh, reset your progress and your To try again list here. Clearing your browser data does the same. |
| The button | Reset progress | Reset progress (stays) |
| The question, and the group's `aria-label` | Reset all progress on this device? | Reset all progress on this device? This also empties your To try again list. |
| Its buttons | Reset / Cancel | Reset / Cancel (stay) |
| Said after, in the `role="status"` | Progress cleared | Progress cleared and list emptied |

- One rule in About's styles: `.a-reset .q { flex-basis: 100%; }`, so the longer question takes a row of its own and "Reset" and "Cancel" always sit together under it. Without it, at 1440 "Reset" sits beside the question and "Cancel" drops alone to the next line. The question is one line at 1440 (28px) and three at 375 (84px).
- Focus and order are as today: to the question's group on asking, back to "Reset progress" after "Reset" or "Cancel".
- **A list but no lesson progress:** nothing differs. The button shows whenever storage can be reached, whether or not anything is saved, as today. Pressing "Reset" empties the list, and the same words are said.
- **Lesson progress but no list, or neither:** the same.
- **Storage blocked:** no button, as today. There is nothing saved to reset.
- The theme is not reset, as today.

## 5. Every sentence the site says about Practice being scored or saved

| # | Where | Words today | Verdict |
|---|---|---|---|
| 1 | `src/lesson/Explanation.tsx:340` | Just for you. Nothing is scored or saved. | **New:** Just for you. Nothing is scored. A question you miss is kept on the Practice page. |
| 2 | `src/lesson/Outline.tsx:230` | Just for you, nothing is scored | Stays, still true. |
| 3 | `src/pages/about.astro:119` | A few questions, just for you. Each answer says why it’s right or not. Nothing is scored or saved. | **New:** A few questions, just for you. Each answer says why it’s right or not. Nothing is scored. A question you miss is kept for you to try again, on the Practice page. |
| 4 | `src/pages/about.astro:201-202` | Your Practice answers / Not saved at all | **New, two rows:** Which Practice questions you missed / This browser only. The answers you picked / Not saved at all. |
| 5 | `src/pages/about.astro:183-184` | TechConcepts remembers a few things so you can pick up where you left off. They are saved only in this browser, on this device, and never sent to a server. There are no accounts. | Stays, still true. |
| 6 | `src/pages/about.astro:187` | What the site remembers | Stays. |
| 7 | `src/pages/about.astro:207` | To start fresh, reset it here. Clearing your browser data does the same. | **New:** To start fresh, reset your progress and your To try again list here. Clearing your browser data does the same. |
| 8 | `src/components/ResetProgress.tsx:45` | Reset progress | Stays. |
| 9 | `src/components/ResetProgress.tsx:49, 51` | Reset all progress on this device? | **New:** Reset all progress on this device? This also empties your To try again list. |
| 10 | `src/components/ResetProgress.tsx:58` | Progress cleared | **New:** Progress cleared and list emptied |
| 11 | `src/pages/about.astro:134` | Lessons are self-paced. ... This browser remembers where you stopped, so you can pick up where you left off. | Stays, still true. |
| 12 | `src/pages/index.astro:260` | Nothing is scored. | Stays, still true. |
| 13 | `src/pages/index.astro:95` | Free. No account. Your progress stays in this browser. | Stays, still true. |
| 14 | `src/pages/tracks.astro:73` | Every lesson is Watch, Learn, then Practice. | Stays, still true. |
| 15 | `src/components/SiteFooter.astro:35` | Your progress is saved only in this browser. | Stays, still true. |

Comments in code that say the same and become false (not shown to a reader; the builder makes them true):

| Where | Says today |
|---|---|
| `src/lesson/Practice.tsx:41-46` | "nothing is scored, counted, stored or sent anywhere" |
| `src/lesson/LessonConsole.tsx:97` | "Practice is never saved" |
| `src/lesson/LessonConsole.tsx:103-106` | "Two things live in memory only ... the Practice picks" (still true of the picks; the list is new) |
| `src/components/ResetProgress.tsx:12-15` | the row's words, quoted |
| `src/layouts/BaseLayout.astro:25` | the `current` values |

## 6. The tests that hold today's words

Each is rewritten to hold the new promise: a wrong pick stores the question's key and nothing else.

| Test | Holds today | Becomes |
|---|---|---|
| `src/lesson/Practice.test.tsx:31-60` | "nothing is saved": `setItem` not called, `localStorage` empty | `Practice` alone still stores nothing (it is given no store). Its no-score line (`:58`) stays. |
| `src/lesson/LessonConsole.test.tsx:540-560` | picks "are never saved": every `setItem` is for `PROGRESS_KEY` | A wrong pick writes `techconcepts:missed:v1` with the key only; no written value holds an option's words or index. The picks are still gone on reload. |
| `src/lesson/Outline.test.tsx:51` | "Just for you, nothing is scored" | Stays. |
| `src/components/progress-islands.test.tsx:50-127` | "Reset all progress on this device?" (`:79`, `:106`, `:108`), "Progress cleared" (`:84`, `:127`) | The new question and the new status; and that Reset empties the list. |
| `e2e/site.spec.ts:433-441` | the header's links are exactly four, and no link is named Practice | Five, in section 2's order, with `/practice` second. |
| `e2e/site.spec.ts:382-396` | Tracks is current only on `/tracks` and the track pages | Holds as written once `/practice` is in the page list; add that Practice is current on `/practice` only. |
| `e2e/site.spec.ts:398-414` | where "Start learning" shows; the footer's order | Holds; add "Practice" to the footer's list. |
| `e2e/site.spec.ts:824` | the row "Your Practice answers ... Not saved at all" | The two new rows. |
| `e2e/site.spec.ts:690-728`, `:834-838` | "Reset all progress on this device?", "Progress cleared" | The new question and status. |
| `e2e/site.spec.ts:215-223` | "Nothing is scored." on Home | Stays. |
| `e2e/reading.spec.ts:143-155` | before a pick the feedback takes no room | Holds: the kept line in "none" is 0px tall. Worth one more line in the test. |
| `e2e/support.ts:50-57` | `SITE_PAGES`, six pages | Gains `/practice` (B9 or B10, whichever lands the page in the list). |

No end-to-end project opens a site page between 721 and 959 wide today (`playwright.config.ts:49-59`: 1280 and up, the phone, and a tablet project that runs only the lesson's spec). B10 adds a check at 768 and at 960 (section 8, check 4).

## 7. Every word of new copy

| # | Where | Words |
|---|---|---|
| 1 | Header link, menu link, footer link | Practice |
| 2 | The lesson's line | Just for you. Nothing is scored. A question you miss is kept on the Practice page. ("Practice page" links to `/practice#to-try-again`.) |
| 3 | Kept line | Kept to try again. / Kept to try again, for this visit. / No longer kept. (D6's) |
| 4 | Kept line's button | Remove / Keep it (D6's) |
| 5 | About's card | A few questions, just for you. Each answer says why it’s right or not. Nothing is scored. A question you miss is kept for you to try again, on the Practice page. ("Practice page" links to `/practice`.) |
| 6 | About's table, row 3 | Which Practice questions you missed / This browser only |
| 7 | About's table, row 4 | The answers you picked / Not saved at all |
| 8 | Above the reset row | To start fresh, reset your progress and your To try again list here. Clearing your browser data does the same. |
| 9 | The reset question | Reset all progress on this device? This also empties your To try again list. |
| 10 | Said after a reset | Progress cleared and list emptied |

None of these words says anything about technology.

## 8. Acceptance checks

Each can be tried on the prototype and turned into a test.

**Header and footer**

1. On Home, Tracks, each track page, About, the 404 page and Practice, the header's links are Tracks, Practice, How a lesson works, Sources, About, with the addresses `/tracks`, `/practice`, `/#try`, `/#sources`, `/about`. The phone's menu lists the same five in the same order.
2. `aria-current` is as section 2's table: "page" on Tracks at `/tracks`, on About at `/about`, on Practice at `/practice`; "true" on Tracks on a track page; on no link on Home and the 404 page.
3. "Start learning" is in the header and the menu on Home, About, 404 and Practice, and in neither on Tracks and the track pages.
4. At 768 wide and at 959 wide the header shows the menu button and no row of links. At 960 wide it shows the row, every link is 32px tall, and "Start learning" is 123px wide (within 1px).
5. At 375, 768, 959, 960 and 1440 wide no page with the site header scrolls sideways.
6. The footer's Learn list is How the Internet Works, Networking Concepts, All tracks, Practice, How a lesson works, on every page that has the footer, a track page among them.
7. A lesson page has no site header and no site footer, as today.

**The lesson's Practice part**

8. Under the heading the line reads "Just for you. Nothing is scored. A question you miss is kept on the Practice page.", and its link goes to `/practice#to-try-again`. The words "or saved" are nowhere in the lesson.
9. The sidebar's line still reads "Just for you, nothing is scored".
10. Before any pick, with an empty list, no kept line shows and each question is as tall as today.
11. A wrong pick shows "Not quite.", shows "Kept to try again." with "Remove", and stores `{"version":1,"keys":["<slug>/<question id>"]}` under `techconcepts:missed:v1`. No stored value anywhere holds the option picked.
12. A right pick on a question that was never kept shows no kept line and writes nothing under that key.
13. With a question's key stored before the page loads, its kept line shows "Kept to try again." before any pick; a right pick then shows "No longer kept." with "Keep it" and takes the key out.
14. "Remove" takes the key out and shows "No longer kept."; "Keep it" puts it back at the front; focus stays on the button through both.
15. After a wrong pick the feedback's live region holds the feedback's words and the kept line's live region holds "Kept to try again."; neither holds a mark.
16. The picks survive a visit to another part of the lesson and are gone after a reload; after the reload the kept questions show their kept lines, unanswered.
17. With storage blocked a wrong pick shows "Kept to try again, for this visit." and nothing throws.
18. A question kept in a lesson is a card in To try again on `/practice`; answered right there, its key is gone when the lesson is next opened.
19. At 1440 by 900 and at 375 by 812 the lesson's Practice part does not make the window scroll, with every question answered wrong.
20. The kept line's button is at least 44px tall.

**About**

21. The Practice card's paragraph reads as section 7, row 5, and its link goes to `/practice`. "Nothing is scored or saved" is nowhere on the page.
22. "What the site remembers" has four rows: the two there today, then "Which Practice questions you missed / This browser only" and "The answers you picked / Not saved at all". No row is named "Your Practice answers".
23. The sentence above the reset row reads as section 7, row 8.
24. "Reset progress" asks "Reset all progress on this device? This also empties your To try again list."; the group's accessible name is the same words and it has focus; "Reset" and "Cancel" are on one line together, under the question, at 375 and at 1440.
25. "Reset" clears saved progress as today, empties the stored list, says "Progress cleared and list emptied" in the `role="status"`, and returns focus to "Reset progress". "Cancel" changes nothing.
26. With a list stored and no lesson progress, "Reset progress" shows and check 25 holds.
27. With storage blocked the row shows no button, as today.

**Every sentence**

28. Each row of section 5 marked "stays" still reads as written; each marked "new" reads as its new words.

## 9. Open questions for the owner

1. **The lesson's line.** "Just for you. Nothing is scored. A question you miss is kept on the Practice page." It is two lines where today's is one, so the questions start 23px lower. Is the trade right, or should the lesson say less and leave the rest to the kept line?
2. **Where the lesson's link lands.** `/practice#to-try-again`: the list itself, or its "Your list is empty" box. The other choice is `/practice`, the whole page.
3. **"Reset progress" keeps its name** though it now also empties the list; the sentence above it and the question say so. Or should the button read "Reset progress and list"?
4. **Two rows on About** ("Which Practice questions you missed", "The answers you picked") where one stood. One row could say it ("Which Practice questions you missed: this browser only"), but then nothing says the answers are not kept.
5. **The header's menu from 960px down**, on every page. Between 721px and 959px a reader now gets the menu button where the row of links was. The row was already broken from 721px to 826px.
6. **`overHero` is dead code** in the header and the layout: no page uses it. Removing it is a unit of its own.
7. **The lesson's options stay 40px tall** for a one-line option, under the 44px the Practice page gives them. Changing them is a change to the Lesson page's layout, which this unit does not make.
