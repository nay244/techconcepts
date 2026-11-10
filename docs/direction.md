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

### Phase 2: a new look and new layouts, on phone and desktop together — TODO

Each numbered step is its own branch.

1. **Baseline.** DONE 2026-11-10. 96 screenshots (24 pages, 1440×900 and 375×812, both themes) and the lesson's measurements, in §4.
2. **The look.** DONE 2026-11-10. Three directions prototyped on the Lesson page and Home; Patch taken (2.12). Its tokens are in §6 and the Lesson page changes it showed are in §7.
3. **The shell.** Rebuild the tokens, header and footer in the new look, in both themes.
4. **The Lesson page.** Start from today's layout (2.8), fix what §4 measured, and give it the new look. Add the phone layout (2.9) and the proof (option 1): numbered citation links that open the exact section, and a "Verified [date] · N sources" stamp on the lesson and on its cards. An unchecked lesson says so. Decide here: the packet inspector (option 6), and whether exam tags are shown or their fields deleted.
5. **The Tracks page.** Start from one panel per track (2.8), in the new look, on phone and desktop.
6. **Home, the track page, About and 404, new layouts.** The track page puts each lesson's figure in its HTML once (audit plan 005). Home still has no Continue link.

Done when every page wears the one new look in both themes, a reader on a 375px phone can do a whole lesson without the page scrolling past the scene, and every cited claim is one tap from its source.

### Phase 3: one fact-check path — TODO

- The claim sheet and gate accept glossary entries, objective mappings and Practice questions as well as lessons (option 2).
- A script confirms that each passage a fact-check report quotes appears in the fetched source (option 5).

Done when the build fails for any cited content without a current all-pass report, whatever its kind.

### Phase 4: How the Internet Works, verified — TODO

- A worklist of the 17 uncited lessons, the 14 tour lessons first (option 4).
- Each lesson is moved to the cited shape and passes a fresh fact-checker, one lesson per branch. For scale: OSI Model took 127 checked items and at least six checker runs.
- Then DHCP, Subnetting and Firewalls.

Done when every live lesson shows a Verified stamp.

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

The equipment room: a faceplate-grey ground, graphite ink, and the colours of the cable pairs. One accent, cable orange, means "you are here" and "do this", and nothing else. Values are the prototype's; contrast is checked in `tokens.test.ts` when they go into the build (phase 2, step 3), and a value that fails moves.

| Role | Light | Dark |
|---|---|---|
| Ground | `#e2e6e7` | `#101315` |
| Surface (panels) | `#fafbfa` | `#1a1e21` |
| Ink / strong ink | `#2b3238` / `#12171b` | `#c6cdd1` / `#f3f5f6` |
| Muted | `#57626a` | `#8e989e` |
| Line / strong line | `#d0d5d7` / `#a3acb1` | `#2a3035` / `#47515a` |
| Accent and "here" (orange pair) | `#c8501a`, white ink | `#f0702e`, ink `#1c0c03` |
| Done (green pair) | `#1e7a45` | `#46c07a` |
| Link and request (blue pair) | `#1b56b0` | `#86b4ff` |
| Response (brown pair) | `#7a4a2b` | `#cfa37c` |
| Broadcast | `#6a3fb0` | `#b9a0ff` |
| Figure ground | `#eef1f1` | `#0d1012` |

- **Type.** Headings, step titles, buttons and labels: Barlow Semi Condensed, 600 and 700 (new; to be self-hosted like the others). Running text: Atkinson Hyperlegible Next. Addresses, ports and other real data: Atkinson Hyperlegible Mono, and only those.
- **Labels** are sentence case, with one exception: the sidebar's group headings keep the current site's small spaced capitals (§7). The Event log's name and the step marker sit in a small bordered strip, like label-maker tape.
- **Shape.** Panels have a 1px strong line, 6px corners and no shadow. Controls have 4px corners. Markers are small squares.
- **The cable.** Progress is drawn as a striped pair: a dashed run under the lesson's top bar, filled in orange as far as the learner has got; striped green segments for the lessons of a track that are ready.
- **Headlines are one colour.** No word is picked out in the accent.
- **Figures** follow 2.13. Lit parts are the blue pair.
- **Not in the prototype:** the scene's motion, the Tracks page, the track page, About and 404.

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

Still to fix in the build: the lease table has no place on a phone yet; the log's from-and-to column should line up from row to row; the scene moves up once, by 85px, when the first message opens the log.

