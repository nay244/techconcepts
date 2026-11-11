# D5: Home's demo with a long source list

Spec for build unit H1. Prototype: `prototypes/d5-home-sources.html` (one file, no script, opens from the file system). It is the Home page as built at commit 46afa6b, with its styles, fonts and map inlined and the demo's source line replaced. Switches at the foot of the window choose the variant, the number of sources and the theme.

## The problem, measured

Home's demo lists every source of lesson 1 in one line of full labels. With 2 sources that line is 23px tall on a desktop and 46px on a phone. Fed What is UDP's sources, today's page gives:

| Sources | Learn panel, 375 wide | Learn panel, 1440 wide |
|---|---|---|
| 2 (today) | 752px | 593px |
| 12 | 1,100px | 802px |
| 31 | 1,796px | 1,220px |

At 31 the source line alone is 1,090px on a phone, taller than the lead, the terms and the HTTPS pointer together (571px). Every link in it is 19px tall.

Today's built page also prints "Sources:RFC 9110" with no space after the colon. Both variants remove that line, so the fault goes with it.

## The design

Learn's last block becomes three rows:

1. **The lesson's stamp**, in the lesson's own words: "Checked 11 Nov 2026, 31 sources" or "Not checked yet, 2 sources". It replaces the word "Sources:" and states how many there are in all.
2. **The sources by their short names** ("RFC 768"), three across, with the lesson's numbers when the lesson numbers them.
3. **When the list is shortened, the way to the rest.**

Two variants differ only in row 3.

- **A, open in place (recommended).** A native `<details>`: "Show the other 28". Opening it lists sources 4 to 31 under it, on Home, with no script. "Hide the other 28" closes it.
- **B, link to the lesson.** A link: "See all 31 in the lesson", to the lesson's Learn part.

**Why A.** The lesson page draws its Learn part with script: the built `what-is-udp/index.html` holds no source list, and says "This lesson needs JavaScript to play." So with JavaScript off, B's link leads to a page that does not show the list, and Home would be saying something it cannot keep. A keeps every source one press away on the page the reader is on.

**What B buys.** The panel has one height whatever the reader does, there is no new state, Home carries 3 source links for a long list and not 31 (0.3 KB gzipped against 1.8 KB), and the reader lands in the real lesson. Its cost is the paragraph above, and that the link lands at the top of Learn while the list is at its foot.

## What changes and what stays

**Stays:** everything on Home outside `.demo__src`. The demo's parts, the scene, the lead, the six terms, the HTTPS pointer, "Go to Practice", their order and their sizes. The demo's radio buttons and the generated state CSS. No script is added: the page's script stays as it is.

**Changes in `src/lib/home.ts`:**

- `HomeDemo.learn.sources` becomes `{ name: string; label: string; url: string }[]`, every source in the order of `numberedSources(unit).list`. `label` is the source's label as today. `name` is the label up to its first `": "` (for a cited source that is the registry's `short`); a label with no `": "` is its own name. It does not throw.
- `HomeDemo.learn.numbered: boolean`: `numberedSources(unit).numberOf.size > 0`.
- `HomeDemo.learn.stamp: LessonStamp`: `lessonStamp(lesson)` from `src/lib/checked.ts`.
- `homeDemo` throws, by name, when `stamp.sources !== sources.length`. The demo lists the first unit's sources under the lesson's count, and the two must agree for the stamp to be true.
- A pure, exported `foldSources(sources)` returns `{ shown, folded }` by the rule below. The page calls it; unit tests cover it.

**Changes in `src/pages/index.astro`:**

- The `<p class="demo__src">` is replaced by the markup below. `Stamp` (`src/components/Stamp.tsx`) is rendered with no `client:` directive and no `href`, so it is static words.
- In the page's `<style>`: `.demo__src` leaves the two rules it shares with `.demo__after` and `.facts a`, and the rules under "Sizes" are added.

**Tests that restate the old line (H1 changes them):** `src/lib/home.test.ts:69-76` and `:149-158`; `e2e/site.spec.ts:200-202`.

## The rule for shortening

Two numbers: **6** and **3**.

- A lesson with **6 sources or fewer** shows them all. No control, no link.
- A lesson with **7 or more** shows the **first 3** and folds the others.

| Sources | Shown | Folded | Row 3 (A) |
|---|---|---|---|
| 0 | none | none | none: the stamp alone, "Not checked yet, 0 sources" |
| 1 | 1 | 0 | none; the stamp reads "1 source" |
| 2 | 2 | 0 | none |
| 6 | 6, in two rows | 0 | none |
| 7 | 3 | 4 | "Show the other 4" |
| 12 | 3 | 9 | "Show the other 9" |
| 31 | 3 | 28 | "Show the other 28" |

Why 6 and not 3: the control costs a row. Folding three or fewer would spend a row to save a row, and would put "Show the other 1" on the page. So the fewest ever folded is 4.

The numbers are the lesson's own: source 4 on Home is source 4 at the foot of the lesson's Learn. A lesson that cites nothing yet has no numbers on either page.

## States

1. **Checked or not.** The stamp's two forms, as `Stamp` draws them: ringed green tick and ink words; dashed ring and muted words.
2. **Numbered or not.** `<ol>` with a number before each name; `<ul>` with none, its names starting under the stamp's words.
3. **Whole or shortened**, by the rule.
4. **Variant A, shortened: closed (the start) or open.** The state is the `<details>` element's own. It is not remembered, and switching the demo's part and back keeps it.
5. **Hover and focus.** Hover underlines the control's words. Focus draws the page's 2px `--focus` ring, 2px out, around the whole row.

There is no loading, empty-error or script-off state: the block is static HTML.

## Every word of new copy

| Where | Words |
|---|---|
| Stamp | `stampWords(stamp)` unchanged: "Checked 11 Nov 2026, 31 sources", "Not checked yet, 2 sources", "…, 1 source" |
| A, closed | "Show the other {folded}" |
| A, open | "Hide the other {folded}" |
| B | "See all {total} in the lesson" |
| First list's label for assistive tech | `aria-label="Sources"` |
| Folded list's label | `aria-label="Sources 4 to {total}"` |
| A source link | its `name`; `title` is its full `label` |

"Sources:" is gone. Nothing else on the page changes its words.

## Markup (variant A, 7 sources)

```html
<div class="demo__src">
  <p class="demo__stamp"><Stamp stamp={demo.learn.stamp} /></p>
  <ol class="demo__list" role="list" aria-label="Sources">
    <li><span class="demo__num">1</span><a href="…" title="RFC 768: User Datagram Protocol">RFC 768</a></li>
    … 2, 3
  </ol>
  <details class="demo__more">
    <summary><span class="demo__closed">Show the other 4</span><span class="demo__open">Hide the other 4</span></summary>
    <ol class="demo__list" role="list" start="4" aria-label="Sources 4 to 7">
      <li><span class="demo__num">4</span><a href="…" title="…">RFC 9293</a></li>
      … 5, 6, 7
    </ol>
  </details>
</div>
```

- Not numbered: `<ul>` for both lists, no `.demo__num`, no `start`.
- Not shortened: no `<details>`. No sources: the stamp's `<p>` only.
- `role="list"` keeps the list a list where `list-style: none` would drop it (Safari).
- Source links open in the same tab, as today.
- Variant B puts `<p class="demo__all"><a href={demo.parts.learn}>See all 7 in the lesson</a></p>` in place of the `<details>`, and the folded sources are not in the page.

## Sizes

All colours are tokens. The CSS in the prototype's `<style>` that starts "D5: Learn's foot" is the build's, to be scoped as the page's other rules are.

| Part | Desktop (861px and up) | Phone (860px and down) |
|---|---|---|
| Block | margin-top 12px | same |
| Stamp | `.stamp` as it is: 14px/1.3 display 600; row 19px | same |
| List | grid, 3 equal columns, column gap 10px, 2px under the stamp; 14.5px/1.3 sans | shown list: 3 columns, gap 6px. Folded list: **2 columns**, gap 10px |
| List row | 28px at least | **44px** at least |
| Number | 12px mono 600, `--muted`, right-aligned in 15px, 6px before the name | shown list: its own width, 5px before the name. Folded list: 15px and 6px |
| Name | `--link`, underline offset 2px, wraps inside its cell (`overflow-wrap: anywhere`); link box 27px tall | link box **44px** tall |
| Not numbered | list padded 21px on the left (the stamp's 14px mark and 7px gap) | same |
| Control (A) | 4px under the list; 1px `--line` on top; row **44px**; 14px square marker (1.5px `--line-strong`, 2px corners, a 7px plus in `--ink-strong`, a minus when open), 7px gap; words 15px/1.2 display 600 `--ink-strong`, letter-spacing 0.01em | same |
| Folded list (A) | starts right under the control; 4px under it | same |
| Link row (B) | 4px under the list; 1px `--line` on top; padded 21px left; link 44px tall, 14.5px sans, `--link` | same |

The one breakpoint is the page's own, 860px. Why the folded list is two across on a phone: three columns of 87px cannot hold a two-figure number and a name like "NIST SP 800-77r1"; at three across, numbers ran into the names before them.

## Keyboard, assistive tech, no script

- Tab order: the HTTPS link, each shown source, the control, then (open) sources 4 onward. Folded sources are not reachable while closed.
- The control is a `<summary>`: Enter and Space toggle it, and it reports expanded or collapsed itself.
- With JavaScript off the block is the same: nothing in it runs script.
- No motion is added.

## Measured: before and after

Learn showing. "Before" is today's built page with its 2 sources; "after" is the prototype. Variants A and B are within 1px of each other when closed.

| | Learn panel, 375 | Page, 375 | Learn panel, 1440 | Page, 1440 |
|---|---|---|---|---|
| Before, 2 sources | 752 | 4,537 | 593 | 3,903 |
| Before's rule with 31 | 1,796 | 5,580 | 1,220 | 4,529 |
| After, 2 sources | 771 (+19) | 4,556 | 619 (+26) | 3,929 |
| After, 6 sources | 815 | 4,600 | 647 | 3,957 |
| After, 7 to 31, closed | 819 (+67) | 4,604 | 667 (+74) | 3,977 |
| After A, 12, open | 1,039 | 4,824 | 769 | 4,078 |
| After A, 31, open | 1,435 | 5,220 | 983 | 4,292 |

The source block itself: 113px (375) and 97px (1440) when shortened; 65 and 49 with 2 sources; 19 with none. The lead, terms and HTTPS pointer keep their sizes. No sideways scroll at 320, 360, 375, 430, 768, 860, 861, 1024, 1280, 1440 or 1920, open or closed, and no name overlaps another. On a phone every source link and the control are 44px tall; on a desktop the control is 44px.

Home's HTML with 31 sources: +6.0 KB, +1.8 KB gzipped (113.0 to 114.8 KB; the budget is 250).

## Acceptance checks

Unit, in `src/lib/home.test.ts`:

1. `foldSources` for 0, 1, 2, 6 sources: all shown, none folded. For 7: 3 and 4. For 12: 3 and 9. For 31: 3 and 28. Order kept.
2. `name` is the label up to its first `": "`; "RFC 3550: RTP: A Transport Protocol…" is "RFC 3550"; a label with no `": "` is whole.
3. `learn.sources` has every source, in `numberedSources` order, with `label` and `url` as today.
4. `learn.numbered` is false for a lesson that cites nothing and true for a cited one.
5. `learn.stamp` equals `lessonStamp(lesson)`; a lesson whose count differs from the list's length makes `homeDemo` throw.

End to end, in `e2e/site.spec.ts`, on Home's Learn part, at 375×812 and 1440×900:

6. `.demo__src .stamp` reads `stampWords` of the lesson's stamp, and its number equals the count of `.demo__src a` (variant A) and the count on the lesson's own top bar.
7. The paragraph "Sources:" is gone: `.demo__src` holds no text but the stamp, the numbers, the names and the control.
8. With 7 or more sources: 3 source links are visible; the control reads "Show the other N"; pressing it shows every source and it reads "Hide the other N"; pressing again returns the panel to its first height.
9. The visible numbers run 1 to the total with none missing or repeated, and match the order at the foot of the lesson's Learn.
10. Each link's `href` is the source's URL and its `title` its full label.
11. From the HTTPS link, Tab reaches source 1, 2, 3, then the control; Enter opens it; Space closes it.
12. At 375: every visible `.demo__src a` and the `summary` are at least 44px tall. At 1440: the `summary` is at least 44px tall.
13. `scrollWidth` equals `clientWidth` on the document, closed and open, at both sizes.
14. Closed, `.demo__src` is at most 115px tall at 375 and 99px at 1440.
15. Checks 8, 11 and 13 pass in a context with JavaScript off.
16. Both themes: the block draws with no colour outside the tokens (the page's existing colour checks, if they scan Home, still pass).

**Only on the built page** (the prototype uses sample data and has the site's links off): the stamp's real date and count for What is HTTP (6, 9); the comparison with the lesson's own list (9); that `Stamp` renders with no island and the page's script and HTML budgets hold (`npm run budgets`); for variant B, that the link opens the lesson's Learn part.

Every other check can be tried on the prototype by hand, with JavaScript off too.

## Decisions

- **The stamp is on Home, in full.** The demo is the lesson in small, and the count is the fact a shortened list must state. It is plain words here, not a link: "Where the facts come from" is two sections down, and a link would be one more 44px control.
- **Short names, not full labels.** Three full labels do not fit a row; "RFC 8445: Interactive Connectivity Establishment (ICE): A Protocol for…" is 113 characters. The full label is the link's `title`.
- **The lesson's numbers show.** They make "the first 3" visibly true and tie Home's list to the lesson's.
- **`<details>`, not a fourth group of radio buttons.** It is in place in the tab order, toggles with Enter and Space, announces its own state and needs no generated CSS.
- **The control sits between the first three and the rest.** It stays where it was pressed, and it heads the block it governs.
- **6 and 3.** See the rule.
- **The control is 44px at every width,** like the demo's other controls. Source links are 44px on a phone only; on a desktop they are 27px rows, taller than today's 19px.
- **Two across for the folded list on a phone.** See Sizes.
- **No motion on opening.** The panel's height change is the feedback.

## Open questions for the owner

1. **A or B.** A is recommended.
2. **Short names.** Home now says "RFC 9110" where it said "RFC 9110: HTTP Semantics". Is the name alone enough on Home?
3. **The stamp on Home** is new. Until a demo lesson is checked it would read "Not checked yet" on the front page; What is HTTP will be checked before this ships.
4. **If B:** the link lands at the top of the lesson's Learn; the list is at its foot. Landing on the list needs an anchor on the Lesson page, which is outside this unit.
5. **An upright tablet** (768 wide) gets the phone's rules, so the folded list is two across in a 666px column. Three across there needs a second breakpoint; left out as not worth a rule.

## About the prototype

- The switches (`.proto`, the `pv-`, `pc-` and `pt-` radio buttons, `data-v` and `data-c` on `.demo__src`) are scaffolding. They use `:has()`; the design does not.
- The demo opens on Learn in the prototype. On the site it opens on Watch.
- Counts 0, 1 and 2 are What is HTTP as it is today: not checked, not numbered. Counts 6 to 31 are What is UDP's sources in its numbered order, standing in for HTTP's.
- Site links are off (`href="#off"`, the real path in `data-href`). Source links open the real sources.
- The header's theme and menu buttons need the site's script and do nothing here; the theme switch is in the bar.
