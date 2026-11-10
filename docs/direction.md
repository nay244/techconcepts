# TechConcepts revamp: direction and roadmap

- **Started:** 2026-11-10, from `main` at `bcf1cfe`, on the branch `revamp`
- **Status:** living document. It is the source of truth for the revamp.
- **Supersedes:** `superpowers/specs/2026-11-07-techconcepts-direction.md` wherever the two differ. That document's accuracy system (§3), content model (§4) and lesson workflow (§5) still hold and are not repeated here.

## How these decisions were made

The previous session opened an interview with the owner: eight questions (Q1–Q8), each with a recommendation, and a list of follow-ups. Before answering, the owner handed the decisions over on 2026-11-10: "This codebase is yours: what it's for and how it's built are your call, and you'll keep building on it."

So every decision below was made by Claude under that handover, and each names the question it answers. The owner can reopen any of them. §5 lists what stays with the owner.

The owner's framing of the revamp: "We will be making improvements to the app from UI/UX redesign to content delivery and planning."

## 1. What the revamp is for

| # | Decision | From |
|---|---|---|
| 1.1 | **Make what exists excellent and trustworthy. Adding lessons waits.** 18 lessons are live and 1 has been fact-checked, so the site's own promise (every claim cited and checked) is unmet for 17 of them. Closing that gap is worth more than a 19th lesson. | Q3 |
| 1.2 | **The redesign keeps the current look and spends its effort on the lesson.** The navy blueprint, Atkinson type, isometric art and the 2026-11-09 Home, Tracks and track-page layouts stay. The lesson page is where a reader spends their time and where the measured problems are (§4). | Q4 |
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
| 2.5 | **Audit plans 001–005 run first, inside the revamp** (roadmap phase 1). They are small, already dry-run, and two of them correct things the site says that are not true. | after Q2, Q3 |
| 2.6 | **Direction options taken: 1, 2, 3, 4 and 5.** Show readers the proof; one fact-check path for all cited content; design the Practice page; a worklist for the uncited lessons; check the fact-checker's quotes mechanically. Option 6 (the packet inspector) is decided inside the lesson redesign, where its space is. | after Q2, Q3 |
| 2.7 | **How the Internet Works reaches launch quality first.** It is the beginner entry, the Home button opens it, and all 14 of its lessons exist, so it can be the first track that is complete *and* verified. | after Q2, Q3 |
| 2.8 | **On desktop the lesson stays a one-screen console.** The owner rejected a one-page lesson on 2026-11-09 and that decision carries over. | after Q4 |
| 2.9 | **On a phone the starting hypothesis is tabs (Scene / Explain / Log) with the step controls pinned at the bottom**, from the earlier direction doc §6.3. It is tested with a throwaway prototype before it is built. | after Q5 |
| 2.10 | **Carried-over decisions this revamp changes:** only "desktop first" (see 1.3). **Leaned on unchanged:** accuracy outranks speed, lesson count and polish; the beginner-first voice; Watch › Learn › Practice with Practice unscored; no Continue on Home or in the header; original art in the one illustration system; no accounts, gamification or site search; translations deferred. | after Q8 |

## 3. Roadmap

One phase at a time, in this order. Each item is its own branch off `revamp` and is done when `npm test`, `npm run build` and `npm run e2e` pass. Status: TODO, IN PROGRESS, DONE.

### Phase 0: foundation — DONE 2026-11-10

- Folder seeded from `main` at `bcf1cfe`; 1,322 tests pass and all 25 pages build within budget.
- `CLAUDE.md` written (the audit found the repo had none).
- This document.

### Phase 1: an honest baseline — TODO

The five audit plans, kept in the original project's `plans/` folder. Bring each plan's text into the branch that carries it out.

| Item | Done when |
|---|---|
| 001 CI on every pull request and push to `main` | the workflow file parses and each command in it passes locally |
| 002 The About page says only what the site does today | About reads "1 of 18 lessons" checked, from the data |
| 003 README and deploy doc match the code | every stale passage plan 003 lists is corrected |
| 004 Header theme button without React | Home and 404 JavaScript drops from about 73 KB to about 1 KB |
| 005 Track page draws each lesson figure once | `/networking` HTML drops from about 101 KB to about 66 KB |
| The preview tells search engines to stay away | the `.workers.dev` build serves a noindex signal and the canonical links stop pointing at a domain that is not connected |

### Phase 2: the lesson, on phone and desktop together — TODO

1. Re-measure the lesson page at 1440×900 and 375px (the §4 figures predate PR #16).
2. Prototype the desktop console and the phone lesson side by side with the `frontend-design` skill; choose one direction.
3. Build it, with the proof built in (option 1): numbered citation links that open the exact section, and a "Verified [date] · N sources" stamp on the lesson and on its cards. An unchecked lesson says so.
4. Decide inside that design: the packet inspector (option 6), and whether exam tags are shown or their fields deleted.

Done when a reader on a 375px phone can do a whole lesson without the page scrolling past the scene, and every cited claim is one tap from its source.

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

Measured on the old `main` at 1440×900, before PR #16 changed the console's frame. Re-measure first (phase 2, step 1).

- Learn and Practice read in a column about 380px wide while a dimmed scene and the log fill the rest.
- The outline scrolls at 900px tall.
- On the Overview, the empty log takes the bottom third.
- On a 375px phone the lesson is a 2,282px stack with the outline before the scene.
- Every claim in a cited lesson carries an exact-section link, and the lesson page renders only the text (`src/lesson/Explanation.tsx`); the Sources list is per document.
- Exam tags are computed (`src/lib/track.ts`) and shown on no page.

## 5. What stays with the owner

- **Pushing `revamp` to GitHub.** The repo is public and a pushed branch gets a Cloudflare preview build. Until the owner says so, the revamp exists only on this machine.
- **Merging to `main`,** which deploys the live site.
- **The launch bar and the domain.** The bar carries over unchanged: all three tracks complete, every lesson verified, phone layouts done. Under 1.1 no lessons are being added, so that bar cannot be met by the revamp alone. Proposal for the owner: connect `techconcepts.app` when phases 1–4 are done, with How the Internet Works complete and verified and the unfinished tracks marked "Not ready yet".
- Sign-ins, accounts and credentials.
