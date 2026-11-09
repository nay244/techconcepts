# Site layouts from the insideout study: design

Date: 2026-11-09. Status: for the owner's approval; the one open question is answered (§9).

## 1. Intent

The owner studied insideout.sh, had mockups made, and adopted their layout and flow for TechConcepts:
Home → Tracks → See the whole track → Lesson. This project builds those layouts into the real site so the owner can
try the flow on preview builds and keep adjusting it as the site grows. It is an experiment in layout and flow, not a
final redesign: each piece ships as a small PR the owner can look at before merging.

It runs **alongside** the Networking lessons (direction doc §10 task 9), which keep their own branches and PRs. It
takes the layout parts of §10 task 7 (Home, §6.1; the console's track strip, §6.2) and nothing else from that task.

The reference mockups are git-ignored in `.superpowers/brainstorm/insideout-study/content/` (run `python3 serve.py`
there with the dev server up; `compare.html` shows each live page beside its mockup). The site must never import from
that folder. This document records every value the build needs, so it stands without the mockups.

## 2. Goals

1. One shell for every page except the lesson: the same header and one content width.
2. Home rebuilt as the mockup Home.
3. Tracks rebuilt as one wide panel per track.
4. The track page rebuilt as a fixed left column and a scrolling route of lessons.
5. The lesson console kept, with its frame matched to the other pages and an Up next card at the end.
6. One vocabulary and one set of pieces across those pages: status words, the track strip, the Watch / Learn /
   Practice marker, Start and Continue, the card hover.

## 3. Non-goals

- **Practice.** The owner made it its own project (2026-11-09): a standalone page of knowledge-check quizzes, not tied
  to any track, with new questions written for it, each cited and fact-checked, plus the missed-questions list
  (§6.6). It needs its own design. Until its first quiz ships, the header has **no Practice link**.
- The rest of §10 task 7: time removal, sources and Verified stamps, the OSI badge rule, the glossary, Builds on /
  Leads to, collapsing the event log.
- Phone and tablet layouts (§10 task 8). The new layouts only have to **not break** on narrow screens (see §7).
- The four open look questions (surface colour, corners, serif headings, a tint per track). The build uses our
  defaults: blueprint ground, Atkinson headings, one accent. Corners follow the token scale in §5.1.
- A one-page lesson. The owner rejected it; the console stays.

## 4. Anti-goals

- Copying insideout's art, words or brand. Their structure is the reference; every picture is ours (the existing
  covers, scenes and name tiles).
- Gamification creeping in through the hubs: no scores, streaks, percentages as rewards or badges. Progress is shown as
  plain words and squares.
- A Continue or resume button on Home or in the header (owner, 2026-11-08). Continue lives on Tracks and the track
  page only.
- Changes that collide with the Networking lesson branches. Keep edits to lesson content files at zero, and to the
  console to the files named in §6.5.

## 5. The shared pieces

### 5.1 Tokens and container

- **Container:** content max width **1240px** with a **32px** side gutter, centred, so content starts at x=100 at
  1440 wide. Every page uses it except the lesson. The header uses the same edges.
- **Corners:** cards 12px, tiles and inner cards 10px, art frames and options 8px, buttons 6px. The lesson's panels
  take 10px.
- **Ground:** the blueprint dot grid behind every page, the lesson included: a radial gradient, 1px dots on a 22px grid,
  `rgba(31, 99, 192, 0.13)` in light and `rgba(127, 176, 234, 0.13)` in dark.
- **Type scale:** hub page titles (Tracks, track page) 64px; Home's hero keeps its own size (80px in the mockup); track
  names on Tracks 44px; route stages 32px; route stops 26px; lesson cards (Up next / Start here) 24px; not-ready stops
  22px.
- Colours stay as today's tokens: accent blue, `--here` amber for "you are here" (one meaning: current), the existing
  dark theme.

### 5.2 Header

- Brand on the left (logo and name, **no tagline**), a centred **pill nav**, and on the right a round theme button
  and **Start learning**.
- Nav: **Tracks**, **How it works** (Home's Watch / Learn / Practice section), **Questions** (Home's FAQ), **About**.
  No Practice link until Practice ships. The current section's pill is filled.
- **Start learning goes to /tracks** on every page (owner, 2026-11-09), and is **hidden on /tracks and the track
  pages**, where you are already choosing. (Today it opens the first lesson; the e2e test that says so changes.)
- The narrow-screen menu button and panel keep working as today.

### 5.3 Status words

Everywhere a lesson or track has a status, use only: **Not started**, **In progress**, **✓ Done**, **Not ready yet**.
CompTIA A+ is **Not ready yet** until it has a lesson. (This replaces "Coming soon", "Being written", "In progress"
for A+, "Finished" and "Not started yet".)

### 5.4 Track strip

The lesson console's row of squares, one per lesson in track order, reused on Tracks and the track page:

- done: filled accent; current (the lesson you would continue): filled amber; ready: outlined in the muted colour;
  not ready: faint outline.
- Squares about 9×12px with 3px gaps, wrapping if needed.
- Words beside or under it: **"N of M lessons done"**, plus **" · K ready"** when some lessons are not ready
  (e.g. "0 of 19 lessons done · 4 ready").
- It replaces the progress bars of the mockups' first version.

### 5.5 Watch / Learn / Practice marker

For a lesson **In progress**, three short bars labelled Watch, Learn, Practice: parts before yours filled accent,
yours amber and bold, later ones grey. It is worked out from the saved position (`furthestPosition`) against the
lesson's own layout, the way `resumePlaces` already words it. For a lesson of several units, use the unit the saved
position is in. No percentages.

### 5.6 Start and Continue

- **Start** opens a lesson at its Overview.
- **Continue** opens it at the saved step, `?step=<position>`, using the existing resume logic (`resumeOf`, its
  `href`).
- **Watch again** for a lesson that is Done.
- Progress is read from this browser as today (`useProgress`); with storage blocked the hubs show Not started and
  Start, as a first visit.

### 5.7 Card hover

One rule for every card that is a link: it lifts 2px and gets a 1.5px accent ring, over about 180ms. Respect reduced
motion (no lift).

## 6. The pages

### 6.1 Home (`/`)

As the mockup Home, with §6.1 of the direction doc:

1. **Hero:** centred title, a short subtitle, our track covers on both sides. The hero button opens **How the
   Internet Works lesson 1** (owner, 2026-11-09, as §6.1 says), not Tracks.
2. **Tracks:** three cards in order (How the Internet Works, Networking Concepts, CompTIA A+), each with its cover,
   who it's for, a lesson count (or "Not ready yet") and a button to its panel on Tracks (`/tracks#<id>`). A+'s card
   goes to its panel too but has no lesson link.
3. **See a lesson from the inside:** a two-page sheet of the OSI Model lesson with layer 7 lit, and a link to open the
   whole lesson.
4. **Watch, learn, then practice:** three large alternating cards, each with a button into the OSI lesson at that part
   (`?step=1`, the Learn position, the Practice position, worked out at build time, not hard-coded).
5. **Questions:** an FAQ. The builder drafts it in the beginner-first voice; the owner approves the wording in the PR.
6. The site footer stays.

Gone from today's Home: the playing DHCP hero scene, the "Learn by watching it happen" log card, the numbered timeline,
and the roadmap cards. No Continue or resume line.

### 6.2 Tracks (`/tracks`)

- Head: **"Pick a track"** (64px) and the line "Each track is a set of short visual lessons, taken in order."
- One wide panel per track, stacked, in Home's order, each with an `id` of the track id for Home's links. Grid
  `1fr 500px`, gap 40px, padding 40px 44px, card corners.
- **Left:** the track name (44px, links to the track page), who it's for, the track strip (§5.4), a **Start** or
  **Continue** button (§5.6) for the lesson up next, and a plain link **See the whole track** to the track page.
- **Right:** one lesson card (§5.7 hover) for the lesson up next: its art, a kicker **Start here** (nothing started) or
  **Up next** (amber, once started), the title, and "Lesson 0N · subtitle". The card opens the same place as the
  button.
- **The lesson up next:** the lesson in progress; else the first ready lesson not done. *(Builder's call, recorded
  here:)* when every ready lesson is done, the card shows the last lesson done, kicker **✓ Done so far**, and the
  button reads **Watch again**. The same rule holds on the track page.
- **A+:** the same panel with "Not ready yet", a disabled "Lessons on the way" button, and a card "Lesson 1 is being
  written" with our PC art and no link.
- A short closing line: new to IT, start with How the Internet Works, then Networking Concepts.

### 6.3 Track page (`/<track>`)

- **Split layout, desktop:** the window does not scroll. The header sits on top; below it, a fixed **left column**
  (360px plus the left edge) and a **route** on the right that is its own scroll pane, its scrollbar at the window's
  right edge, with a short fade (about 22px) at its top edge.
- **Left column:** breadcrumb **Tracks / <Track>**, the track title (64px, last word in the accent), who it's for, the
  track strip (§5.4), and one card for the lesson up next: its art (128px tall), **Start here** or **Up next**, title,
  "Lesson 0N · subtitle", and a full-width **Start** or **Continue**. On screens under 820px tall the card drops its
  art, so the button stays in view down to 1280×720.
- **Route:** a dashed line down the left with the track's **parts** as stages (a square mark, the part's name, "N
  lessons") and each **lesson** as a numbered stop (a 44px circle). Each ready lesson is a tile: art (168×124), a
  status (§5.3; In progress adds the §5.5 marker), the title (links to the lesson), the subtitle, and one button:
  Start, Continue or Watch again. The current stop's circle and tile ring are amber; done stops' circles are filled
  accent. Not-ready lessons are short outline tiles with their number and **Not ready yet**, in order.
- After the last stop, one line pointing between the tracks: How the Internet Works is the gentler start; Networking
  Concepts goes deeper.
- Gone from today's track page: the big cover with "Click to send packets", the lesson and ready counts block, "Every
  lesson: Watch › Learn › Practice", the Your progress box and Parts list, each card's long paragraph, and **Clear my
  progress** (it stays on About), and the exam filter (see §9).

### 6.4 About and 404

Take the shared header and container. Content unchanged.

### 6.5 Lesson console (`/<track>/<lesson>`)

The console's structure and behaviour stay; only its frame changes. Files: `src/lesson/console.css`,
`src/lesson/TopBar.tsx`, `src/lesson/Explanation.tsx` (the `EndRow`).

- **Ground and gaps:** the dot grid shows between the panels; padding and gaps 12px instead of 8px.
- **Panels:** 10px corners, the lighter line colour, the card shadow. Buttons 6px; segmented switches 6px outside,
  4px inside.
- **Top bar:** brand without the tagline; breadcrumb **Tracks / <Track> / <Lesson>** with one "/" separator and
  "Lesson N of M" after it (Tracks → `/tracks`, the track → its track page); the Light / Dark switch becomes the round
  theme button the other headers use.
- **Track strip leaves the top bar** (direction doc §6.2, owner Q31). The console keeps the lesson's own step
  segments. The strip lives on Tracks and the track page.
- **Theme button:** reuse the site's `ThemeToggle`, so the lesson and the other pages switch theme the same way.
- **End of Practice:** when the next ready lesson exists, "That's the whole lesson." and an **Up next** card: the next
  lesson's art, the kicker Up next, its title and "Lesson 0N · subtitle", the whole card a link, with the §5.7 hover.
  The other two endings (next unit; last ready lesson) keep their wording with the new button style.
- Unchanged: one screen, nothing scrolls but the explanation, Play, the outline, the log, `?step=`, progress saving.

## 7. Constraints

- **Direction doc and rules:** each PR its own branch to main, merged only with the owner's OK; `npx vitest run`,
  `npm run build` and `npm run e2e` pass before saying anything is done, with failures reported as they are; no new
  npm dependencies; never run prettier; no absolute paths in tracked files; all art original.
- **Desktop first:** design and check at 1280×800, 1366×768, 1440×900 and 1920×1080 (`npm run e2e:visual`), light
  and dark.
- **Narrow screens must not break:** the split track page applies only at **≥ 1024px wide and ≥ 600px tall**; below
  that the page scrolls normally with the left column stacked above the route. The phone e2e checks (loads, scrolls,
  no sideways scroll) keep passing. Real phone layouts are task 8.
- **Without JavaScript:** pages render with lessons listed and links working; progress-dependent parts show the
  first-visit state (Not started, Start). The theme button stays hidden without JavaScript, as today.
- **Accessibility:** the route pane is reachable by keyboard; the strip and marker have text equivalents (the words
  beside them, and an `aria-label` on the marker); focus rings stay; reduced motion turns off lifts.
- **Tests that encode today's behaviour change with it** and are updated in the same PR, never deleted to get green:
  Home's "4 of 19 lessons ready" and track-card tests, Start learning opening the first lesson, Tracks' "Being
  written" and "Start here" wording, the track page's cover and counts, and the exam-tag and `?for=` tests (§9).

## 8. Order

Five PRs. The first comes first; the other four can follow in any order, one at a time.

1. **Shared shell:** tokens (§5.1), header (§5.2), container on every non-lesson page, status words (§5.3), the hover
   (§5.7), and the shared strip and marker pieces (§5.4, §5.5) with unit tests.
2. **Home** (§6.1).
3. **Tracks** (§6.2).
4. **Track page** (§6.3).
5. **Lesson frame** (§6.5).

## 9. Decided by the owner

1. **The exam filter is dropped** (owner, 2026-11-09). Home's track cards lose their exam tags (e.g. Network+) that
   opened the track filtered with `?for=`, and the track page loses its "Show lessons for" filter. The certification
   data itself (`certTags`, objective mapping) stays in the content model; only these two pieces of UI go. Old
   `?for=` links open the track page unfiltered.
2. The hero button opens How the Internet Works lesson 1; Start learning goes to Tracks (owner, 2026-11-09).
3. Practice is its own project (owner, 2026-11-09).

## 10. Left to the builder

- Component structure, naming, and which existing pieces to reuse (`resumeOf`, `useProgress`, `trackParts`,
  `cardPlaces`, the covers and name tiles).
- Exact spacing within the values above, the fade, and the wording of the FAQ draft (owner approves in the PR).
- How the track page's split is built (the mockup used a flex column body with `overflow: hidden` and a grid of the
  left column and an `overflow-y: auto` route), as long as the behaviour in §6.3 and §7 holds.
