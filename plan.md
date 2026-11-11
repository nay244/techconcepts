# Plan

How the work is divided is in `CLAUDE.md` (Team). The results are in `team.md`.

**Status: the first job is done (2026-11-11); two follow-up units from the owner's answers are being built** (last section).

## Inputs

| | |
|---|---|
| **The job** | Finish the Lesson page and close Phase 2 of the revamp (`docs/direction.md` §3, step 4): the reading layout in Learn and Practice, the phone leftovers, the tablet width, and the share image. Proposed by the orchestrator from the roadmap; the owner has not named a job yet. |
| **Done means** | Every build unit passed its reviewer against its approved prototype, and on `revamp` after the last merge `npm test`, `npm run build` and `npm run e2e` pass with their output in `team.md`. Nothing is pushed. |
| **Budget** | Not set by the owner. Until it is: at most two variants per screen, two builder tries and two reviews per unit. |
| **Design refs** | `docs/direction.md` §6 (the look, Patch), §7 (the Lesson page as built), §8 (illustrations and logo); `src/styles/tokens.ts`; the site as it runs; the `frontend-design` skill. |

## Phase 1: design

Every design unit ends in `prototypes/<id>-<name>.html` and `prototypes/<id>-<name>.md`. Then the design gate: the owner sees all of them, and build waits for approval.

| Unit | Owner | What | Check |
|---|---|---|---|
| S1 | scout | The Lesson page's fact sheet for the design briefs: each layout region's CSS rules and breakpoints in `src/lesson/console.css`, the components that draw Learn, Practice, the log and a lesson's own table, and what the phone layout hides. | Every fact has a `path:line`. |
| D1 | designer | **Reading on a desktop.** In Learn and Practice the words sit in a 389px column beside a dimmed scene (§7). Design the reading layout, and where a claim's source numbers go in Practice's feedback. | OSI Model's Learn (the longest) and DHCP's Practice at 1440×900 and 1280×720, both themes: the line length in characters, and no page scroll. |
| D2 | designer | **The lesson on a phone, the leftovers.** A place for a lesson's own table (leases, rules); the log's from-and-to column lined up from row to row; the empty band above OSI Model's scene; where the stamp shows. | DHCP, OSI Model and Firewalls at 375×812 and 390×844, both themes: one screen, no page scroll, every tab shown. |
| D3 | designer | **The lesson between 761px and 1099px.** Today it falls back to the old stacked page. | DHCP at 768×1024 and 1024×768, both themes: the scene and the controls in view without scrolling. |
| D4 | designer | **The share image.** `public/og-default.png` still shows the old wordmark. A 1200×630 card with the Lifted lid logo. | Readable at 600×315 (how a chat app shows it), on the light and the dark ground. |

D1 to D4 do not depend on each other and run in parallel, each after S1.

## Design gate

The orchestrator shows the owner the four prototypes and specs, with each one's recommendation and open questions, and stops. Approval freezes a design.

**Approved 2026-11-10 ("Approve all"):**

| Design | Approved variant | Where the designer's open questions stand |
|---|---|---|
| D1 | B: wider words, and the log folded while reading | The log starts folded, as the spec says. |
| D2 | A: the table in its own tab | Tabs are named by kind, and OSI Model's strip is hidden in Learn and Practice on a phone, both as the spec says. Subnetting's bits board is not in this job. |
| D3 | A: the phone layout grown, and the desktop layout with the outline in a tab | A phone on its side keeps today's stacked page. Above 760px the stamp shows in the top bar and, from D2, on the Overview's first line. |
| D4 | A: the light ground | A text description of the image (`og:image:alt`) is not in B4. |

The owner was shown these questions with the designs and approved without changing an answer, so each stands as its spec has it.

## Phase 2: build

One unit per branch off `revamp`, one builder at a time on the Lesson page's files. Each: builder, then reviewer on the diff; the orchestrator merges a PASS into `revamp`.

| Unit | Implements | Owner | Check, beside `npm test`, `npm run build` and `npm run e2e` |
|---|---|---|---|
| B1 | D1 | builder, reviewer | The spec's acceptance checks as tests; the line length measured in an end-to-end test at 1440 and 1280. |
| B2 | D2 | builder, reviewer | The spec's acceptance checks as tests in the phone project; every lesson still fits one phone screen. |
| B3 | D3 | builder, reviewer | The spec's acceptance checks as tests at 768 and 1024 wide; the layouts on both sides of the range are unchanged. |
| B4 | D4 | builder, reviewer | The image is 1200×630 and under 300 KB, and is the one every page's `og:image` names. |

B1, B2 and B3 all change `src/lesson/console.css`, so they run in that order. B4 can run beside any of them.

## Not in this job

- Phase 3 (one fact-check path), Phase 4 (cite and check the 17 legacy lessons) and Phase 5 (the Practice page): each is a job of its own.
- A look inside the current message (the packet inspector), and motion in Home's demo.
- Anything that leaves this machine: push, pull request, merge to `main`, deploy.

## Open for the owner

1. **Errata after approval.** D2: the phone scene clips its overflow; the tab says it has changed with an `aria-label`; a table row's tag sits under its value. D3: Learn and Practice keep the 348px column on a tablet on its side; the tabs' focus ring is drawn inside the button there. Each is in its spec's "Errata" section.
2. **Reading on a tablet on its side.** Should Learn and Practice there get D1's wider words and folded log?
3. **The Table tab's mark after turning a tablet.** A reader who watched the table change on its side sees the tab marked "changed" when they turn it upright.
4. **Subnetting's bits board** still scrolls sideways in its tab on a phone.
5. **A phone on its side** keeps the stacked page.
6. **A text description of the share image** (`og:image:alt`) is not set.

**The owner's answers, 2026-11-11:**

1. Errata approved.
2. Yes: a tablet on its side gets the wider words and folded log. Unit B5 below.
3. "Mark changed": read by the orchestrator as "leave it marked", so nothing changes. To confirm with the owner.
4. Good as it is.
5. Good as it is.
6. Set a description. Unit B6 below.

## Follow-up units, 2026-11-11

Both implement designs the owner has already approved, so there is no new design unit.

| Unit | Implements | Owner | Check, beside `npm test`, `npm run build` and `npm run e2e` |
|---|---|---|---|
| B5 | D1 variant B, in D3's desktop layout with the outline in a tab (both specs' last sections) | builder, reviewer | In Learn and Practice at 1024x768, 900x700 and 1099x800: the words column and the tabs as the spec's numbers give them, the scene 484px or more, the log folded with its button. The Overview, Watch, 1100px and wider, and the phone layouts unchanged. |
| B6 | D4: the share image described for a reader who cannot see it | builder, reviewer | Every page has `og:image:alt` with the designer's words: "TechConcepts. See how technology really works. A home router with its lid lifted, one message lit on the board inside." |

