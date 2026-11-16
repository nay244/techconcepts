# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f, its third (written definitions, the pilot, the page) at 92506f4, job 10's (the glossary's remaining entries, paused after batch 3) at ea144eb, job 11's (Router, the pilot; with the proposal for the other eleven in four batches) at 84cef62, job 12's (batch 1: ARP, Ports, NAT) at 77c72a8, and job 13's (batch 2: IP Address, MAC Address, TCP/UDP, with its result) at a783282, job 14's (batch 3: Packets, Switch, Load Balancers, with its result) at bc70815, and job 15's (the lesson's flow, with its result) at 070cce6.

# Job 16: Home's critique findings

**Status: planned (2026-11-15, direction 2.73); waiting for the owner's go and the owner's scope.** The owner picked Home as the next page to act on from the `impeccable critique` of 2026-11-15 (Home 22 of 32, the lowest of the seven pages). Nothing is designed until the owner says which findings the design covers (job 15's lesson: the owner kept only the controls of a five-part design).

## Inputs

| | |
|---|---|
| **The job** | Home's findings from the critique (`.impeccable/critique/2026-11-15T23-18-00Z__src-pages-index-astro.md` in the main folder; git ignores it). Three major: **A** the phone demo's scene can't be read (297×164px at 375, median label 7px, re-measured by the critique); **B** on a phone, Next step moves the page away from the narration; **C** Tab lands on answer radios that can't be seen (WCAG 2.4.7). Two lesser: **D** the header's "Start learning" goes to `/tracks` while the hero and the closing button go to lesson 1; **E** the demo frame changes height by part (Watch 638, Learn 718, Practice 503px). Minor: the header over the headings, "Guided visual lessons" in the footer against "Short visual lessons" elsewhere, the header's 40×40 icon buttons, the closing button repeating the hero's words. Facts: `prototypes/s18-home-facts.md` (S18). |
| **Done means** | The owner has approved D15 for the findings the owner chose; B18 is merged into `revamp` with a build review of PASS (or PASS WITH FIXES, each "fixed when" run); on `revamp`, `npm test`, `npm run build` and CI's end-to-end pass (`npx playwright test --grep-invert @visual --project=d1440-dark --project=phone`) pass. For each finding taken, the critique's measurement is re-run on the built page and recorded. Nothing pushed. |
| **Budget** | 0.9 to 1.5 million subagent tokens of growth for the three major findings (estimate below). A stop for the owner at 1.8 million. |
| **References** | `docs/direction.md` §9 (Home, adopted by the owner 2026-11-10; "How the demo works": no script, radio groups before the panel, CSS from what is checked, arrow keys), §6 (Patch), 2.22 and 2.23 (the demo follows lesson 1's words); `prototypes/d5-home-sources.md` and `d5-cases.md` (Learn's foot, approved); `src/pages/index.astro`, `src/lib/home.ts`, `src/art/scenes/net-map.ts`; `e2e/site.spec.ts:88-305, 969-1012, 1492-1760`; `src/lib/home.test.ts`. |

## What the scout found (S18)

- **Home's demo shares no code with the lesson console** job 15 changed (`playback.ts`, `PlaybackControls.tsx`, `console.css`). It shares `src/lesson/Rich.tsx`, `src/lesson/sourceNumbers.ts` and the timeline's `positionOf`. Job 15's controls ("Next step", "Play all", replay) are not on Home; Home's own "Next step" is a label.
- **C's cause:** the three radio groups sit before the panel (`index.astro:109-115`), hidden by size and opacity, never `display:none`, so each group is a Tab stop whichever part shows; the labels that would show the focus go with their hidden pane. No test pins the Tab stops.
- **B's cause:** a label moves focus to its radio, and the radios sit at the top of `.demo` (`index.astro:404-412`), so the page scrolls there. On a phone the order is tabs, scene, rows, narration, Next (`index.astro:829-833`).
- **A shares its cause with the Lesson page's phone figures.** Both draw `drawNetMap` in one 685-unit-wide frame made for every protocol (`net-map.ts:469`, pinned at `net-map.test.ts:155` and `:269`). Home draws only lesson 1's layer (`home.ts:133`) inside its own container, at about 0.43px a unit on a phone; the Lesson page at about 0.55 (both computed).
- **E:** desktop has a 452px minimum on the panel with no recorded basis (`index.astro:463-464`); a phone has none.
- **D** is an owner decision: "Start learning goes to /tracks on every page (owner, 2026-11-09)" (`docs/superpowers/specs/2026-11-09-site-layouts-design.md:74`), pinned at `e2e/site.spec.ts:382-392`.

## Decisions in this plan

1. **The owner chooses the scope before the design** (job 15's lesson). The orchestrator's recommendation: the three major findings, A, B and C, with E taken where B's layout touches it anyway. D reopens the owner's rule of 2026-11-09 and is the owner's to take or leave. The minor items wait.
2. **A is solved inside Home, and the Lesson page's phone figures stay a separate job.** The cause is shared (one 685-unit frame), but Home is a still, one-layer copy in its own container, so it can be cropped or recomposed for the phone without touching `net-map.ts`, the frame its tests pin, or the Lesson page. A fix in the map's frame itself would change every lesson and belongs to the Lesson page's job (the critique's second Lesson group). Labels on the phone at 12px or more, as the critique asks; the designer measures them in the browser.
3. **The demo stays script-free and keeps its words** (§9: no script, works with JavaScript off, 1.3 KB of script; two `<script>` elements, `e2e/site.spec.ts:1710-1714`). Every word comes from lesson 1 as it is (2.22, 2.23); the five steps stay. If a finding can't be met without script, the designer says so in the spec and it comes to the owner at the gate.
4. **One design unit, D15**, `prototypes/d15-home-demo.html` and `.md`: a clickable copy of Home's demo (and the header, if D is taken) at 375 and 1440, light and dark, keyboard and JavaScript-off paths, with before and after measurements of each finding taken. Two variants only where a finding has two good answers (likely A: a crop of the layer against a phone recomposition). The `designer` loads `frontend-design`; `impeccable` re-runs `critique` on the built page after B18, not before (2.68).
5. **C may have one right answer** (taking a hidden group out of the tab order, which CSS can do from the checked part radio). The designer still draws it, because the focus ring and any key hint are things a reader sees.
6. **One spec review, one builder, one build review** on this job's branch `claude/objective-taussig-eb7520` (its worktree `.claude/worktrees/objective-taussig-eb7520`, at `revamp` `070cce6`), E2E port 4486. The spec review marks every case that only a real browser can try (focus, scroll position, Tab order, sizes) as an end-to-end test (job 15's lesson). Fixes that are exactly what the reviewer names go to a Haiku `builder`, Sonnet if it fails.

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| S18 | scout | scout (Haiku) | Home's demo, its phone view, Next, the answers, the decisions and tests. Done (`prototypes/s18-home-facts.md`). | Every fact has a `path:line`. |
| **Scope** | plan | **the owner** | Which findings D15 covers. | The owner's words, in the direction doc. |
| D15 | design | designer (Opus 5.5) | The chosen findings: `prototypes/d15-home-demo.html` (self-contained, clickable, 375 and 1440, light and dark) and `.md` (each change with the decision it touches, every state, sizes, Tab order, JavaScript off, measurements, acceptance checks). | The designer's own look at both sizes and themes, measured; then the orchestrator walks it at 375 and 1440 in both themes, by touch and by keyboard, and records what it saw in `team.md`. |
| **Gate** | design | **the owner** | Approves D15, or parts of it. | The owner's words, in the direction doc. |
| B18 spec | build | reviewer (Opus) | Holes and attack cases for the approved part: `prototypes/d15-cases.md`. | Holes with one right answer closed as errata; taste goes back to `designer`. |
| B18 | build | builder (Sonnet) | The approved part in `src/pages/index.astro`, `src/lib/home.ts` (and `SiteHeader.astro`, if D is taken), with the tests and specs that pin them (S18 Part 7). | Each case a test; `npm test`; `npm run build`; `e2e/site.spec.ts` at d1440-dark and phone. |
| B18 review | build | reviewer (Opus) | The diff against the spec, the prototype and the cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| F16 | end | orchestrator | The branch into `revamp`; CI's end-to-end pass; the critique's measurements re-run; the ledger, the direction row, the owner's result with errata. | `npm test`, `npm run build`, CI's e2e pass on `revamp`. |

Order: the owner's scope; D15; the orchestrator's look; **the gate**; the spec review; B18; its review; F16.

## Estimate

From job 15: one designer's clickable prototype 0.35 million first pass, 0.13 to 0.19 million a later pass; a spec review 0.21 million; a builder 0.29 million plus 0.30 for fixes; a build review 0.13 million.

| Part | Growth, roughly (A, B and C) |
|---|---|
| D15: one designer, one or two variants for A | 0.3 to 0.5 million |
| B18 spec review | 0.1 to 0.2 million |
| B18: `index.astro`, `home.ts`, `site.spec.ts` | 0.3 to 0.55 million |
| B18 review, and the fixes | 0.15 to 0.25 million |
| **Total** | **0.9 to 1.5 million** |

Taking D and E adds about 0.1 million; A alone or C alone costs about half.

## When the work stops for the owner

- **The scope**, now, before the design.
- **The design gate**, after D15 and the orchestrator's look.
- A finding that can't be met without script, without changing lesson 1's words, or without touching the Lesson page.
- The job past 1.8 million tokens of growth.
- Anything `CLAUDE.md` says the owner keeps: push, merge to `main`, deploy, sign-ins, installs.

A build unit that fails two reviews comes back to the orchestrator with both reports.

## What could go wrong

- **A crop that leaves something out.** Lesson 1's layer must keep every part a step lights and every way a message takes, at each of the five steps; the page on the laptop appears at step 5 (2.23, `e2e/site.spec.ts:1716-1760`).
- **Moving the radios changes the CSS.** Every generated rule uses `#radio:checked ~ … .demo__ui` (`index.astro:41`); radios placed beside their rows would need a new way to reach the panel, without script.
- **Without script, a label still moves focus.** Keeping the narration in view on a phone may mean moving where focus lands, not stopping it.
- **Phone tests run at 390 (`playwright.config.ts:57`), Home's demo tests at 375 inside the desktop project.** The spec names the width each check runs at.

## Not in this job

The Lesson page's phone figures and Subnetting's hidden bits board (the critique's second Lesson group), every other page, `net-map.ts`'s frame, lesson 1's words, and any change under `src/` before the gate.
