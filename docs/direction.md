# TechConcepts revamp: direction and roadmap

- **Started:** 2026-11-10, from `main` at `bcf1cfe`, on the branch `revamp`
- **Status:** living document. It is the source of truth for the revamp.
- **Supersedes:** `superpowers/specs/2026-11-07-techconcepts-direction.md` wherever the two differ. That document's accuracy system (§3), content model (§4) and lesson workflow (§5) still hold and are not repeated here.

## How these decisions were made

The previous session opened an interview with the owner: eight questions (Q1–Q8), each with a recommendation, and a list of follow-ups. Before answering, the owner handed the decisions over on 2026-11-10: "This codebase is yours: what it's for and how it's built are your call, and you'll keep building on it."

So the decisions below were made by Claude under that handover, and each names the question it answers. The owner can reopen any of them, and has reopened one: a decision marked **(owner)** is the owner's own. An owner decision sets the direction; how it is carried out is still Claude's call. §5 lists what stays with the owner.

The owner's framing of the revamp: "We will be making improvements to the app from UI/UX redesign to content delivery and planning."

## 1. What the revamp is for

| # | Decision | From |
|---|---|---|
| 1.1 | **Make what exists excellent and trustworthy. Adding lessons waits.** 18 lessons are live and 1 has been fact-checked, so the site's own promise (every claim cited and checked) is unmet for 17 of them. Closing that gap is worth more than a 19th lesson. | Q3 |
| 1.2 | **The redesign revamps the look and the layouts of the whole site** (owner, 2026-11-10; this replaces Claude's first answer, which kept the look). The look (colour, type and art style) is reopened for every page. Home, the track page behind "See the whole track", About and 404 get new layouts, with the shared header and footer. **The Tracks page and the Lesson page are the two layouts worth starting from, not a policy:** the owner named them as the ones to keep, then said the same day that both "can also be modified to fit our design needs". | Q4 |
| 1.3 | **Phones are first-class.** Every screen is designed for a 375px phone and a 1440px desktop together. This reverses "desktop first, phones later". | Q5 |
| 1.4 | **"Content delivery" means two things:** how a lesson reaches the reader (the lesson page, its sources, its proof of checking), and how verified lessons get made (the citing and fact-checking path). | Q6 |
| 1.5 | **"Planning" means this project's own roadmap** (§3), kept in this document. It is not a study planner for learners. | Q7 |
| 1.6 | **One direction document**, this one. | Q2 |
| 1.7 | **Earlier owner decisions carry over**, each in force until reopened here. §2 lists the one this revamp changes and the ones it leans on. | Q8 |

## 2. How it is built

| # | Decision | From |
|---|---|---|
| 2.1 | **The folder started as a fresh clone of the GitHub repo at the latest `main`.** The original folder stays as an untouched reference. | Q1 |
| 2.2 | **Same GitHub repo, long-lived `revamp` branch.** Each roadmap item is its own branch off `revamp`. Nothing has been pushed; pushing is the owner's call (§5). | after Q1 |
| 2.3 | **The live preview stays as it is** until the revamp is merged to `main`. | after Q1 |
| 2.4 | **The stack stays** Astro with React islands, static, on Cloudflare Workers. The audit found the code healthy and no bug; a rewrite would spend the revamp on plumbing. | after Q1 |
| 2.5 | **Audit plans 001–004 run first, inside the revamp** (roadmap phase 1). They are small, already dry-run, and two of them correct things the site says that are not true. Plan 005 is carried out inside the track page's new layout (phase 2). | after Q2, Q3 |
| 2.6 | **Direction options taken: 1, 2, 3, 4 and 5.** Show readers the proof; one fact-check path for all cited content; design the Practice page; a worklist for the uncited lessons; check the fact-checker's quotes mechanically. Option 6 (the packet inspector) is decided inside the lesson redesign, where its space is. | after Q2, Q3 |
| 2.7 | **How the Internet Works reaches launch quality first.** It is the beginner entry, the Home button opens it, and all 14 of its lessons exist, so it can be the first track that is complete *and* verified. | after Q2, Q3 |
| 2.8 | **The Lesson page starts from what it has: a lesson contents sidebar, the network visual, the event log and Learn**, on one screen on desktop. **The Tracks page starts from one panel per track.** Both are changed wherever the design is better for it: a region can move, merge, shrink or go. A change to either is recorded here with what it fixed. | after Q4 |
| 2.11 | **The new look is chosen from prototypes, not from talk.** Two or three directions are built with the `frontend-design` skill on the Lesson page and Home, at phone and desktop sizes, and one is taken. Art stays original whatever the style. | after Q4 |
| 2.12 | **The look is "Patch": the equipment room** (2026-11-10, from three prototypes; §6 has the tokens). It was taken over "Standard" (a white, serif, document look) and "Signal" (dark graphite with amber). Patch comes from the subject itself, network gear and cable pairs; it looks least like the old site and least like a stock template; and its condensed headings keep the lesson outline short. | after Q4 |
| 2.13 | **Figures are light in the light theme and charcoal in the dark one.** Until now they were charcoal in both. The drawing kit already carries both sets of tones, so no figure is redrawn. | after Q4 |
| 2.14 | **Light is the theme a new visitor with no system preference sees.** The old site fell back to dark. | after Q4 |
| 2.15 | **The work is divided between agents, behind a design gate** (owner, 2026-11-10). The main session orchestrates; `scout` (Haiku) finds, `designer` (Fable) designs and prototypes, `builder` (Sonnet) builds, `reviewer` (Opus) reviews the diff against the approved prototype. The owner approves each design, and each new plan, before it is built. Until then Claude designed and built in one session and showed the owner the result. The rules are in `CLAUDE.md` (Team); `plan.md` holds the current job and `team.md` the ledger. | owner |
| 2.16 | **Phase 3 checks quotes by script, and guards the kinds it has no path for** (2026-11-11; `plan.md` has the formats). A report's quotes become data, a script confirms each passage is in the source text the checker fetched, and the build needs the record that script writes. Glossary entries and objective mappings get no checking path yet: none of either exists, so a path could not be tried on anything; the build refuses them until a job needs them and builds one. Sources are not committed: several are copyrighted and the repo is public. | after S2 (scout) |
| 2.17 | **Who writes lesson content** (owner, 2026-11-11): Sonnet writes lessons and step-by-step breakdowns of subjects and analogies; Opus is called for deep analysis or a more comprehensive breakdown of a concept. This is for Phase 4. | owner |
| 2.9 | **On a phone the starting hypothesis is tabs over the lesson's regions, with the step controls pinned at the bottom**, from the earlier direction doc §6.3. It is tested with a throwaway prototype before it is built. | after Q5 |
| 2.10 | **Carried-over decisions this revamp changes:** "desktop first" (see 1.3); the living-blueprint look and its illustration style; and the 2026-11-09 Home and track-page layouts (see 1.2). **Leaned on unchanged:** accuracy outranks speed, lesson count and polish; the beginner-first voice; Watch › Learn › Practice with Practice unscored; no Continue on Home or in the header; original art; no accounts, gamification or site search; translations deferred. | after Q8 |

## 3. Roadmap

One phase at a time, in this order. Each item is its own branch off `revamp` and is done when `npm test`, `npm run build` and `npm run e2e` pass. Status: TODO, IN PROGRESS, DONE.

### Phase 0: foundation — DONE 2026-11-10

- Folder seeded from `main` at `bcf1cfe`; 1,322 tests pass and all 25 pages build within budget.
- `CLAUDE.md` written (the audit found the repo had none).
- This document.

### Phase 1: an honest baseline — DONE 2026-11-10

Four of the five audit plans, kept in the original project's `plans/` folder. Bring each plan's text into the branch that carries it out. Plan 005 (the track page draws each lesson figure once) moves to phase 2: that page gets a new layout there, and the new one is built to the plan's target from the start.

| Item | Branch | Result |
|---|---|---|
| 001 CI on every pull request and push to `main` or `revamp` | `chore/ci-workflow` | The workflow parses and each command in it passes here. It has not run on GitHub: nothing is pushed. |
| 002 The About page says only what the site does today | `fix/about-claims` | About counts 7 tracks and says "So far 1 of 18 lessons has also been through an independent check", worked out from the content. |
| 003 README and deploy doc match the code | `docs/readme-refresh` | All 17 stale statements corrected. |
| 004 Header theme button without React | `feat/theme-button-without-react` | Home and 404 load 1.3 KB of JavaScript, down from 73.0 KB. |
| `workers.dev` addresses tell search engines to stay away | `chore/preview-noindex` | `public/_headers` sends `X-Robots-Tag: noindex` on every `workers.dev` host. Not yet seen on Cloudflare: check with `curl -I` on the preview after the first push. |

The canonical links still name `techconcepts.app`. That is right once the domain is connected and has no effect on a page that is not indexed, so they stay. Known and left for launch: `og:image` and `og:url` also name that domain, so a link to the preview shared today shows no picture.

Each branch is merged into `revamp` here. After all five: 1,334 unit tests pass, all 25 pages build within budget, and the full end-to-end run across the seven projects ends with 778 passed and none failed (141 skipped by design: playback checks run in two projects only).

### Phase 2: a new look and new layouts, on phone and desktop together — DONE 2026-11-11

Each numbered step is its own branch.

1. **Baseline.** DONE 2026-11-10. 96 screenshots (24 pages, 1440×900 and 375×812, both themes) and the lesson's measurements, in §4.
2. **The look.** DONE 2026-11-10. Three directions prototyped on the Lesson page and Home; Patch taken (2.12). Its tokens are in §6 and the Lesson page changes it showed are in §7.
3. **The shell.** DONE 2026-11-10. The Patch tokens, the heading face, light as the default theme, the figures' two finishes, the header and footer, and the new logo and favicon, in both themes. Every page wears it. What it left for the page steps is at the end of §6.
4. **The Lesson page.** The owner keeps the current page (§10): its layout stays, and it already wears the new look from the shell. The owner then asked for the phone layout ("Add phone layout", 2026-11-10): DONE that day, as §7 records. The owner then asked for the sources and the stamp ("Add sources and stamp", 2026-11-10): DONE that day, as §7 records. The owner then approved D1, reading a lesson on a desktop, variant B (2026-11-10): DONE, as §7 records. On 2026-11-11 the rest of the approved designs were built by the team (2.15; `plan.md`, `team.md`): the phone leftovers (D2), the tablet widths (D3) and the share image (D4). Left open, for the owner: `plan.md`'s last section. What follows was the plan before those decisions. Start from today's layout (2.8), fix what §4 measured, and give it the new look. Add the phone layout (2.9) and the proof (option 1): numbered citation links that open the exact section, and a "Verified [date] · N sources" stamp on the lesson and on its cards. An unchecked lesson says so. Decide here: the packet inspector (option 6), and whether exam tags are shown or their fields deleted.
5. **The Tracks page.** The owner keeps the current page (§10): one panel per track, already in the new look from the shell. Its labels ("Start here", "Up next") are sentence case since 2026-11-10 (§11).
6. **Home, the track page, About and 404.** DONE 2026-11-10. Home is an original page (§9). The track page keeps its layout and is lighter; About and 404 have new layouts (§11).

Done when every page wears the one new look in both themes, a reader on a 375px phone can do a whole lesson without the page scrolling past the scene, and every cited claim is one tap from its source.

### Phase 3: one fact-check path — IN PROGRESS

- The claim sheet and gate accept glossary entries, objective mappings and Practice questions as well as lessons (option 2).
- A script confirms that each passage a fact-check report quotes appears in the fetched source (option 5).

Done when the build fails for any cited content without a current all-pass report, whatever its kind.

Status: the build now fails for a cited lesson whose report has no quote record, a record that does not match its quotes, or a passing claim with citations and no quote (unit B4), and refuses any glossary entry or objective mapping outright until a path is built for that kind (decision 2.16). Still to come: the canary run (unit B5), which proves the changed fact-checker gives the verdicts on record with confirmed quotes.

### Phase 4: How the Internet Works, verified — TODO

- A worklist of the 17 uncited lessons, the 14 tour lessons first (option 4).
- Each lesson is moved to the cited shape and passes a fresh fact-checker, one lesson per branch. For scale: OSI Model took 127 checked items and at least six checker runs.
- Then DHCP, Subnetting and Firewalls.

Done when every live lesson's stamp says "Checked" with its date (§7).

### Phase 5: the Practice page — TODO

Design and build the standalone Practice page (option 3) over the 40 existing questions, with the private missed-questions list from the earlier direction doc §6.6.

### After the revamp

Finish Networking Concepts (15 lessons to write), CompTIA A+, the glossary and concept links, exporting saved progress, and the multi-unit dead code the audit listed.

## 4. Evidence the lesson redesign starts from

Measured on `revamp` on 2026-11-10, on the built site, at 1440×900 and 375×812.

- Learn and Practice read in a column 389px wide. The scene beside them is 733×398.
- The explanation scrolls on the DHCP Overview. The outline scrolls on OSI Model.
- The log is 1136×234, a quarter of the screen's height, and empty until the first message.
- On a 375px phone the DHCP lesson is a 2,412px stack: the outline first (658px), the scene 913px down and only 168px tall, and the Play button 2,273px down.
- Other pages on a phone: Home 7,722px, the Networking track page 6,353px, About 6,457px, Tracks 3,211px.
- Every claim in a cited lesson carries an exact-section link, and the lesson page renders only the text (`src/lesson/Explanation.tsx`); the Sources list is per document.
- Exam tags are computed (`src/lib/track.ts`) and shown on no page.

## 5. What stays with the owner

- **Pushing `revamp` to GitHub.** The repo is public and a pushed branch gets a Cloudflare preview build. Until the owner says so, the revamp exists only on this machine.
- **Merging to `main`,** which deploys the live site.
- **The launch bar and the domain.** The bar carries over unchanged: all three tracks complete, every lesson verified, phone layouts done. Under 1.1 no lessons are being added, so that bar cannot be met by the revamp alone. Proposal for the owner: connect `techconcepts.app` when phases 1–4 are done, with How the Internet Works complete and verified and the unfinished tracks marked "Not ready yet".
- Sign-ins, accounts and credentials.

## 6. The look: Patch

The equipment room: a faceplate-grey ground, graphite ink, and the colours of the cable pairs. One accent, cable orange, means "you are here" and "do this", and nothing else.

The values below are the ones in `src/styles/tokens.ts`, which is the source; its tests check contrast and that the colours can be told apart. Four moved from the prototype when they went in, each for a measured reason.

| Role | Light | Dark |
|---|---|---|
| Ground | `#e4e7e8` | `#101315` |
| Panel | `#fafbfa` | `#1a1e21` |
| Ink / strong ink | `#2b3238` / `#12171b` | `#c6cdd1` / `#f3f5f6` |
| Muted | `#57626a` | `#949ea4` |
| Accent and "here" (orange pair) | `#b04617`, white ink | `#f0702e`, ink `#1c0c03` |
| Link and request (blue pair) | `#1b56b0` / `#1f63c0` | `#86b4ff` / `#5aa9ff` |
| Done (green pair) | `#23824a`, words `#207243` | `#5fd68a`, words `#75db9a` |
| Response (brown pair) | `#7a4a2b` | `#cfa37c` |
| Blocked | `#bd2140` | `#ff7a7a` |
| Figure ground | `#eef1f1` | `#0d1012` |

- **The light orange is `#b04617`, not the prototype's `#c8501a`.** Orange is drawn as words, and `#c8501a` reaches only 3.7:1 on the grey ground. `#b04617` is the brightest of that hue that reaches 4.5:1.
- **Response is brown and light blocked is crimson.** Response was an orange a hair from the new accent. Blocked red sat 0.054 from the orange in OKLab; crimson is 0.081, past the 0.08 the lesson colours keep from each other.
- **Dark muted is `#949ea4`.** The prototype's `#8e989e` fell to 4.46:1 on a firewall rule's green tint.
- **Done is green everywhere.** It was the accent while the accent was blue. Orange now means "here", so a finished lesson, step or segment is green.
- The other five lesson colours (control, broadcast, allowed, encrypted, selected) are unchanged.

- **Type.** Headings, step titles, buttons and labels: Barlow Semi Condensed, 600 and 700 (new; to be self-hosted like the others). Running text: Atkinson Hyperlegible Next. Addresses, ports and other real data: Atkinson Hyperlegible Mono, and only those.
- **Labels** are sentence case, with one exception: the sidebar's group headings keep the current site's small spaced capitals (§7). The Event log's name and the step marker sit in a small bordered strip, like label-maker tape.
- **Shape.** Panels have a 1px strong line, 6px corners and no shadow. Controls have 4px corners. Markers are small squares.
- **The cable.** Progress is drawn as a striped pair: a dashed run under the lesson's top bar, filled in orange as far as the learner has got; striped green segments for the lessons of a track that are ready.
- **Headlines are one colour.** No word is picked out in the accent.
- **Figures** follow 2.13 and §8. The lit part is the orange pair.
- **Not in the prototype:** the scene's motion, the Tracks page, the track page, About and 404.

**What the shell left for the page steps.** The old layouts now wear the new look, so each of these goes when its page is rebuilt:

- Small capitals in page-level styles (Tracks' "Start here", the track page's stop labels, About's table headings). Shared labels are already sentence case.
- The Home header that sits clear over the hero until the page scrolls.
- The `shadow-sm` and `btn-shadow` tokens, which now paint nothing, and the rules that still name them.
- ~~The share image~~ Built (B4, 2026-11-10): `public/og-default.png` is the 1200×630 card of D4 variant A (the Lifted lid mark and name, "See how technology really works.", and the `inside` figure, on the light theme's ground). `scripts/generate-og-image.mjs` draws it from the logo, the figure, `lumen.css` and the tokens. The dark ground (variant B) is not built. B6 (2026-11-11): `BaseLayout` writes `og:image:alt` right after `og:image`, with the designer's words ("TechConcepts. See how technology really works. A home router with its lid lifted, one message lit on the board inside."); it takes an optional `imageAlt`, and a page that passes its own `image` without one gets no tag.

The prototypes and screenshots are on this machine only, in the git-ignored `.superpowers/revamp/` (`look/` the pages, `look/shots/compare.png` the three side by side, `baseline/` the old site). `.claude/launch.json` serves them as `look-prototypes`.

## 7. What the prototype changed on the Lesson page, and what each change fixed

Each starts from the layout in 2.8.

| Change | What it fixed |
|---|---|
| **The log stays under the scene while watching** (owner's question, 2026-11-10: "why not place the event log below the Watch?"). Claude's first prototype moved it under the explanation; measuring both settled it, below. Each message is a short entry (from, to, time, then one sentence) and no longer a seven-column table. Until the first message the log is one line; from then on it keeps one height (216px at 900 tall) and scrolls to the newest. | The wire and its record share a column, and the words have the other. The log no longer holds a quarter of the screen empty before anything has happened. The same entry works at phone width. |
| The explanation column runs the full height of the page, at the old width (389px at 1440). | The DHCP Overview no longer scrolls: it has 826px, from 550px. |
| In Learn and Practice the columns swap: the words take the wide middle column at a 66-character measure, and the scene, its table and the log step to the right. | Reading no longer happens in a 389px column beside a dimmed scene. Sources sit at the foot of the text, numbered to match the claims. |
| **The sidebar keeps the current site's design** (owner, 2026-11-10: "more similar to the design of the current page"). Claude's first prototype had flattened it to one list with square markers and a second line only on the current step. Kept from the current site: the three named groups (Watch with its step count, Learn, Practice) in small spaced capitals, a round marker with the step's number, a title with a line under it on every row, the current place in an outlined box, the 268px width, and "All 19 lessons" at the foot. In Patch's colours and type. | The sidebar reads as the lesson's map again: what kind of thing each row is, and what it says, without clicking. Rows are 55px, on a phone too. |
| The sidebar's list scrolls by itself, to the step you are on; its heading and the all-lessons link stay put. | OSI Model's outline (10 steps) is 908px in a 719px list at 900 tall, so it scrolls, as it does today (960px in 794px). Now the link at the foot is always in reach. |
| The step controls sit under the scene; the theme button and OSI badge are not in the prototype's top bar. | To settle in the build: where the theme button and the layer badge go. |
| On a phone the scene is pinned under the top bar (a third of the screen), the rest is three tabs (Explain, Steps, Log), and Back and Next are pinned at the bottom. | The whole lesson fits one 812px screen with nothing above the scene, from a 2,412px stack. Hypothesis 2.9 holds. |
| The stamp in the top bar reads "Not checked yet, 2 sources" for DHCP. | An unchecked lesson says so, in the same place a checked one will say "Verified" with its date. |

**Why the log is under the scene.** The drawing is as wide as its column allows and no taller, so height given to the scene's box buys nothing. Measured at 1440×900 on the DHCP lesson:

| | Drawing | Words column | Empty space while watching |
|---|---|---|---|
| Log under the explanation (first prototype) | 648×308 | 446px wide | 328px inside the log at step 2, 107px at step 5 |
| Log under the scene (taken) | 705×336 | 389px wide | about 570px under a step's two short paragraphs |

With the sidebar back at 268px (the table above), the drawing is 685×326.

The first prototype's "bigger scene" was a taller box around a smaller drawing; this document said the scene grew, and that was wrong. Under the scene, the drawing was 9% wider, and is 6% wider with the wider sidebar. The cost is the empty space under a step's words. That space is the natural home for a look inside the current message (direction option 6, the packet inspector), still to be decided in step 4.

**The phone layout, as built (2026-11-10).** Below 761px wide, with JavaScript on:

- The lesson is one screen with no page scroll. Measured at 390×844 on DHCP: the top bar is 52px, the scene runs from 92px to 338px, and Back, Play and Next fill the last 64px. Before, the page was a 2,412px stack with the scene 913px down.
- Under the scene, tabs choose what shows: **Explain** (the words, first), **Steps** (the lesson's outline), **Log**, and, when the lesson has a panel of its own, a fourth named for it: **Table** (16 lessons), **Rules** (Firewalls) or **Bits** (Subnetting). OSI Model's message strip is not a tab, so it keeps three. Choosing a step returns to Explain; Back and Next keep the tab. Each part scrolls inside itself.
- In Learn and Practice the scene shrinks to 18% of the screen's height, from 34%, and the words take the room.
- The log's rows are stacked entries in three columns (the number, the column's name in 84px, the value), so every Source and Destination starts at the same x from row to row. The words take a line of their own, and the short values (a column of 100px or less: Time, Protocol, Size) share the entry's last line. The table states its roles, so it is still read as a table.
- The top bar keeps the mark, the lesson's name, "Step 2 of 5" and the theme button. The track's name, the row of step segments and the OSI layer chips are not shown at this width.
- The lesson's own table (D2, variant A, owner-approved) has the fourth tab, always there, on every slot. The scene's area no longer scrolls. A table of three columns or fewer stays a table, fitted to the width; four or more become entries with the column's name beside each value; Firewalls' rules are two lines a rule. A small square on the tab says the table changed since the reader last opened it (the name then reads "Table, changed"); opening the tab brings the marked row into view. Subnetting's bits board is 470px wide and still scrolls sideways in its tab: fitting it is not built.
- A lesson with one view (OSI Model, Subnetting) has no empty band above its scene. OSI Model's message strip is pinned under the scene on one line, and hidden in Learn and Practice, where the drawing takes its room.
- The stamp is at the end of the Overview's first line, opposite the word "Overview", and at the foot of Learn.
- On a phone with JavaScript off, the page keeps the older stacked layout.
- The desktop layout is unchanged from 1100px. The tabs exist in the page at every width and are hidden where the desktop layout shows its three parts at once.

**The lesson between 761px and 1099px, as built (B3, from D3 variant A, owner-approved, 2026-11-10).** With JavaScript on, a window in this range gets one of its two neighbours, chosen by its shape:

- **An upright window, or one under 900px wide and 600px tall or more: the phone layout, grown.** The phone's rules apply as they are (the fourth tab and the stamp on the Overview's first line included), with five tunings: the scene is 40% of the window's height while watching (18% in Learn and Practice, as on the phone); the explanation, outline, log and controls share one centred column 520px wide; Play's mark and word sit together; the top bar shows the step segments and the stamp again. The track's crumbs, "Lesson 9 of 19", the OSI chips and the scene's title stay hidden. DHCP at 768×1024: the scene is 52px to 462px with a 768px-wide figure, and the page does not scroll.
- **A window on its side, 900 to 1099px wide and 600px tall or more: the desktop layout with the outline folded into a tab.** The outline column is gone. The tabs on top of the explanation's column are Explain and Steps only, because the log and the lesson's table are on screen as on a desktop; a reader who arrives with Log or Table chosen (by turning the screen) lands on Explain. The bar drops the brand's word, the "Tracks" crumb and "Lesson 9 of 19" to keep the lesson's name whole. Back, Play, Next and the speed button are 44px tall. The Overview and Watch steps keep the 348px column and the open log; Learn and Practice take D1's reading layout (decided by the owner 2026-11-11, built in B5): words `max(348px, min(560px, 100% - 496px))` (380px at 900 wide, 504px at 1024, 560px at 1099), the tabs on that column, and the log folded to its head (its head's own height, 62px, with its usual 8px padding around the 44px buttons) with the "Show log" button. DHCP Watch at 1024×768: figure 638×300, words 348×404, log 1000×200; Learn at 1024×768: words 504px, log 62px; no page scroll.
- **The tabs' focus ring is drawn inside the button** in the layout on its side (`outline-offset: -3px`): the tab row clips its corners, which cut the usual outside ring to a line between the two tabs.
- **Decided:** a tablet on its side gets D1's wider words and folded log in Learn and Practice (owner, 2026-11-11; the question this line held).
- **Under 600px tall** (a phone on its side) and **with JavaScript off**, the range keeps the stacked page.
- The edges are unchanged: up to 760px is the phone layout at its own sizes, and from 1100px the desktop. Not solved here (D3 open questions): the scene beside the tabs for a phone on its side, and the desktop's top bar squeezing the lesson's name at 1100px.

Still to fix in the build: Subnetting's bits board does not fit a phone's width (a design of its own); the scene moves up once, by 85px, when the first message opens the log.

**Sources and the stamp, as built (2026-11-10).**

- **The stamp says "Checked", not "Verified".** A checked lesson reads "Checked 8 Nov 2026, 6 sources"; one that has not been through the fact-check reads "Not checked yet, 2 sources". "Checked" is the word Home and About already use for the independent check, it pairs with "Not checked yet", and it claims what happened: a check on a date, which a reader can weigh. The date is the report's (`docs/fact-checks/<slug>.md`); the count is the lesson's listed sources.
- **Where it shows.** In the lesson's top bar, at the end of the title line, linking to About's "Where the facts come from". At the foot of Learn, above the sources (date only). On every ready lesson's card on the track page (date only). Not on the small up-next cards (Tracks, the track page's side card, the end of a lesson): their job is what to open next.
- **The mark is a shape, not a colour.** A ringed tick for checked, a dashed ring for not yet; only the tick is green, so it does not read as the card's own "Done".
- **Sources moved to the foot of Learn**, out of Go deeper, so the numbers in the words have a list in view. A cited lesson's list is numbered in the order Learn first cites each source; a lesson that cites nothing yet keeps a plain list.
- **A claim carries one number for each source it cites.** The number opens the first place the claim cites in that source (the exact section or page), in a new tab, and its label names every place. OSI Model's lead cites up to seven places in four sources per statement; one number per place would have put seven numbers after a sentence.
- Numbers show in Learn (lead, terms, pattern, why, Go deeper, facts), in each Watch step's Go deeper and, since D1, after Practice's feedback.
- On a phone the top bar has no room for the stamp; it is at the end of the Overview's first line and at the foot of Learn. Measured at 1280 wide on DHCP (the OSI chips beside it): the title is whole.

**Reading on a desktop, as built (2026-11-10, D1 variant B; spec `prototypes/d1-lesson-reading.md`).** At 1100px wide and up, in Learn and Practice only:

- The words column is `max(348px, min(560px, 100% - 496px))`: 560px from 1360 wide, 480px at 1280, today's 348px up to 1148. The scene keeps at least 484px, so the widest lesson table fits. OSI Model's lead runs a median of 66 characters a line at 1440 wide (it was 44) and 56 at 1280 (it was 39). The scene's title wraps to two lines in its 50px head instead of being cut.
- The log folds to its head (52px) with a "Show log" / "Hide log" button; the words and the scene take the height (730px of words at 900 tall, from 548px). It starts folded, and stays as the reader leaves it for the visit, in memory. The Overview, Watch and everything under 1100px are as before, except a tablet on its side (§7: 62px folded). The step controls keep their left edge.
- Practice's feedback ends with the source marks of the option's `cite`, the same `sup.explain__marks` as Learn, 11.2px; the live region is the feedback's words alone. `src/lesson/Marks.tsx` is the one component for both.
- The guard that kept `text-wrap: balance` out of `console.css` now allows the one rule that balances the scene's title. The no-script style hides `.log__fold`.
- Checked by `e2e/reading.spec.ts` (the spec's 16 checks, the line length at 1440 and 1280) and unit tests in `Practice.test.tsx` and `LessonConsole.test.tsx`.

## 8. Illustrations and logo

The owner asked on 2026-11-10 for a new pass of illustrations for the whole project, from three reference drawings (a desk robot, a dashboard, a 404 scene) and the Anatomy skill, and for new logo ideas.

### The family

- **Same kit, plate and camera.** Every figure is drawn in code with the vendored Anatomy kit (`src/art/kit/`, MIT) on the one 224×148 plate and the one camera in `src/art/common.ts`. A figure is a function that returns SVG; nothing is traced or imported.
- **The references set the finish, never the subject.** From them: one solid object, many small true parts, a single lit part, an engraved label on the plate's edge. Our subjects are our own: none of the three reference objects is drawn.
- **Two finishes, one drawing.** Light theme: porcelain-white solids with graphite lines and dark glass. Dark theme: charcoal solids, pulled to neutral grey so they carry no blue cast. The tones are CSS variables, so the 19 drawings that already exist (7 covers, 7 small figures, 5 lesson scenes) take the new finish with no redrawing.
- **The lit part is the orange pair**, in both themes (light `#ffc48f` to `#d9541c`, dark `#ffd3a8` to `#f0702e`). It is the thing to look at, the same meaning orange has everywhere else in Patch. This replaces blue.
- **No film grain**, as before. The references carry it; ours do not.
- **Bigger and denser than the older figures.** The older ones leave most of the plate bare. A new figure's object fills the plate, and every face has something true on it.

The finish went into the site with the shell on 2026-11-10 (`src/art/lumen.css`).

### Page figures, first pass (`src/art/figures/pages.ts`)

| Figure | What it shows | For | Lit part |
|---|---|---|---|
| `inside` | A home router with its lid lifted on four rods, the board showing: sockets, a switch chip, a processor, memory, traces | Home, and wherever the site says what it is | One message on the trace from a socket to the switch chip |
| `sources` | A report sheet under a stand loupe, three bound standards stacked beside it, a check stamp on its pad | About, and "Where the facts come from" | The one claim under the loupe |
| `notFound` | A patch panel, ports 401 to 408, seven linked; port 404 is empty and dark | The 404 page | The loose plug that stops short of port 404 |
| `notReady` | An assembly stand under a hoist: two layers of a lesson stacked, the third on the hook | "Not ready yet" tracks and lessons | The layer still on the hoist |

Each has a sentence-long description for screen readers and tests beside it. None is on a page yet; they go in as each page is rebuilt (phase 2, steps 4 to 6).

Not done in this pass: motion (the references animate on click; these are still); the 4× close-up review the Anatomy skill asks for, done properly on every junction; redrawing any of the 19 older figures to the denser standard.

### The logo: Lifted lid

The owner chose "Lifted lid" on 2026-11-10 from six ideas. Claude then drew five refinements of it and took the one called "Solid tray".

- **The mark** is three shapes on a 2:1 isometric grid: a solid lid, a solid tray of the same width, and one orange message in the gap, touching neither. The site opens things up so you can see inside. It matches the `inside` figure.
- **Why solid tray.** The first drawing had two thin rims under the lid, which read as the common "layers" icon. Two solid halves read as one case pulled apart, and hold at 16 pixels.
- **One source.** `src/art/logo.ts` is the only drawing: `logoMark()` for pages, where the ink is the text colour and the message is `--logo-accent`; `logoTile()` for the favicon and app icon, on a dark tile with fixed colours, because a browser tab can be light or dark.
- **Beside the name.** "TechConcepts" in Barlow Semi Condensed 700, one colour. The mark is 1.3 times the type size and sits 0.36 of the type size from the name.
- **Clear space** is half the mark's width on every side. **Smallest size** is 16 pixels.
- **One ink.** Where only one colour prints, the message takes the ink colour too.

Wired in with the shell on 2026-11-10: the header and footer through `logoMark()`, the lesson's top bar through `src/components/LogoMark.tsx`, and `public/favicon.svg` written by `scripts/generate-favicon.mjs`, with a test that fails when the file and the drawing differ. Still to follow: the share image (`scripts/generate-og-image.mjs`).

The five passed over, so nobody redraws them: Port (a socket with its link light; the runner-up), Twisted pair (muddy at 16 pixels), Message on the wire (read as a tool), Under the loupe (read as a search icon), Step marker (read as a video button). The sheets are in the ignored `.superpowers/revamp/look/art/`.

## 9. Home

**Adopted by the owner, 2026-11-10**, with the three changes listed below.

The owner, 2026-11-10: "Do not reference the old homepage layout. Create your own original homepage for this web site with your own design ideas." So this page starts from the site's job, not from the page it replaces.

**The idea: the page is a small lesson.** A beginner should not have to take the site's word for what a lesson is. Under the headline they can do one: lesson 1, how a web page arrives over HTTP. It is that lesson's own map and words, worked out from the content when the page is built, so it cannot drift from the lesson.

| Section | What it is | Why |
|---|---|---|
| The opening | The site's line set very large, one sentence, two buttons, and three plain facts: free, no account, progress stays in this browser | The line is the promise; the facts answer the three things a newcomer asks before clicking |
| Try one, right here | Lesson 1 in small, with three parts: Watch, Learn and Practice. Watch has the lesson's five steps: type the address, look up the name, open the connection, ask for the page, draw it. The map follows: the way each message takes lights up, the server at work lights up, and the page reaches the laptop's screen. Each step lists the messages it sends. Learn ends by pointing on to HTTPS, the next lesson | It shows the product by being it, and explains Watch, Learn and Practice without a paragraph about them |
| Get started with the basics | The two tracks that have lessons, as stops along one cable: start here, then go deeper. Each links to its panel on the Tracks page | A newcomer needs the way in, not the whole catalogue |
| Where the facts come from | The `sources` figure and how many lessons have been checked so far, counted from the content | The site says what is and is not verified, on its front page |
| Lift the lid | The `inside` figure and the way into lesson 1 | The last thing on the page is the first step |

**The owner's changes to the first version, 2026-11-10.**

- The demo shows "a simple HTTP/HTTPS exchange of how a web connection works". It was the DHCP lesson. It is now lesson 1, HTTP, which is also where the Start button leads; HTTPS is named in Learn, in that lesson's own words, with a link.
- "Or start from something you have wondered", four questions that each opened a lesson, is removed.
- "Three tracks, in the order to take them" is "Get started with the basics", and CompTIA A+ is not listed there. It is still on the Tracks page.

**How the demo works.** It has no script. Three groups of radio buttons (the part, the step, the answer) come before its panel, and CSS shows, hides and lights things from which are checked. The map is drawn with only this lesson's layer (`drawNetMap(['http:web'])`), and the way each step's messages take is drawn into it at build time from the map's own routes. So it works with JavaScript off, from the keyboard (arrow keys move between steps), and adds nothing to the page's 1.3 KB of script.

**What went, and where its content lives now.**

- The questions list (FAQ). Its answers are in the opening's three facts, the tracks' order words, the sources section, and "Nothing is scored" in the demo.
- The separate Watch, Learn and Practice cards. The demo is all three.
- The header's "How it works" and "Questions" links are now "How a lesson works" (the demo) and "Sources".

**Measured, 1440×900 and 375×812.** The page is 3,761px tall on desktop and 4,176px on a phone, from 5,530px and 7,722px. Its HTML is 114 KB gzipped, from 145 KB; the map is most of it. No sideways scroll at either size; every control in the demo is at least 44px tall.

**Kept from the owner's earlier decisions:** no Continue or resume link, nothing that reads progress, no exam tags, no time figures.

**Not done:** the demo has no motion beyond a 200ms fade (the real lesson moves each message along its way). The header's small Start learning button is 40px tall, as before.

## 10. Claude's own takes on the Lesson and Tracks pages (not adopted)

**Decided by the owner, 2026-11-10, after the side by side: "Let's adopt the new homepage and keep our current track and lesson page."** The two takes below are not built. They stay here so nobody proposes them again.

The owner had asked: the Lesson and Tracks pages "are fine but have a go at your own take on them with your original design idea and show a side by side." These were the prototypes for that comparison. No site code changed.

One idea runs through both, and through Home's tracks: **a sequence is drawn as a cable with stops.** Tracks on Home, lessons on Tracks, steps in a lesson.

**Lesson: a stage and a line.**

- The stage has no panels. The step's words sit on the same ground as the scene they describe, at the left; the scene has the rest.
- The lesson's line runs along the bottom: one stop per place (Overview, each step, Learn, Practice). Under each step are the messages it sent, appearing as the lesson reaches them. The outline and the event log become one object, because a lesson's steps and its messages are the same sequence.
- In Learn and Practice the words take the stage and the scene steps aside, as in §7.
- On a phone: the line is a strip of squares under the bar, the scene is pinned, the words scroll, and Back and Next are pinned at the bottom. A watch step fits one 812px screen; the current page is a 2,309px stack.

What the take leaves out or has not placed, each of which the current page has: the log's addresses, ports, protocol and size columns; Play and the speed control; the Network and Sequence views; the OSI layer chips; Go deeper; the lesson's own table (files, leases, rules); the list of all the track's lessons; the theme button.

**Tracks: every track is a cable.**

- Each track is a heading and one cable. Every lesson is a stop on it: filled if it can be opened, dashed if it is not ready, green once done, orange for the one to take next. The track's parts are labelled over the stops they hold.
- The next lesson hangs from its own stop as a card with Start or Continue and "See the whole track".
- A track with no lessons yet is a heading and a short stub of cable.
- It shows where the gaps are: Networking's four ready lessons are stops 1, 7, 9 and 16 of 19.

Against an earlier decision: on 2026-11-09 the owner rejected listing every lesson on the Tracks page. This take shows every lesson as a small stop, not as a card, and is offered knowing that.

The page is 1,508px tall at 1440 wide without a footer; the current one is 1,851px with its footer, so the heights are not like for like.

The prototypes and the two side-by-side sheets are in the ignored `.superpowers/revamp/look/take/` (`lesson.html`, `tracks.html`, `tracks-returning.html`, `shots/side-by-side-*.png`), served as `look-prototypes`.

## 11. The track page, About and 404 (built 2026-11-10)

**The track page keeps its layout.** The owner designed it on 2026-11-09 (a fixed side column, a route that scrolls) and has since kept the Tracks and Lesson pages as they are, so this page was not redrawn. What changed is what was measured:

- **Each lesson's figure is in the HTML once** (audit plan 005). The side card is given only the figure a first visit shows and borrows any other from the route on the same page. `/networking` is 65.8 KB gzipped, from about 101 KB; each new lesson now costs about half of what it did.
- **Labels are sentence case**: "Start here", "Up next", "Not ready yet", on this page and on Tracks.
- **On a phone a lesson that is not ready is two short lines**, with no placeholder tile. Networking has 15 of them: the page is 4,821px tall at 390 wide, from 6,444px.

**404: the address leads nowhere.** The words on the left, the `notFound` figure on the right: a patch panel with every port linked but 404. Under the buttons the page says what the number means (the server is working, and has nothing at this address) and links to lesson 1, HTTP, where status codes are met. Buttons: Go to Home, See the tracks.

**About: plain, and the same words.** Every sentence and every section of the old page is kept; the layout is new.

- The opening is the line set large, the one-paragraph description, and the three counts as large figures: tracks planned, lessons ready, accounts needed. The eyebrow chip, the accent-coloured half of the headline and the mock "How the web works" plate are gone.
- Under it, the list of sections stays beside a reading column. On a phone the list is a row to swipe.
- "How a lesson works" is three rows in order, each with its small figure.
- "Where the facts come from" has the `sources` figure beside the count of checked lessons.
- Credits now names the heading face, Barlow Semi Condensed, beside the Atkinson faces, credited as its licence credits it: the Barlow Project Authors.
- `src/components/page-hero.css`, which only this page still used, is deleted.

The page is 5,179px tall at 390 wide, from 6,377px.

