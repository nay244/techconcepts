# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f, its third (written definitions, the pilot, the page) at 92506f4, job 10's (the glossary's remaining entries, paused after batch 3) at ea144eb, job 11's (Router, the pilot; with the proposal for the other eleven in four batches) at 84cef62, job 12's (batch 1: ARP, Ports, NAT) at 77c72a8, and job 13's (batch 2: IP Address, MAC Address, TCP/UDP, with its result) at a783282, job 14's (batch 3: Packets, Switch, Load Balancers, with its result) at bc70815, and job 15's (the lesson's flow, with its result) at 070cce6.

# Job 17: Home in the Card stack look (it began as Home's critique findings)

**Status: D17 approved with colour variant A (the owner, 2026-11-16, direction 2.82); the build is next, run by a fresh orchestrator on Opus 5.5.** How the job got here: the owner chose findings A, B and C of the Home critique (2.79); D16 drew them; at D16's gate the owner asked for `impeccable`'s redesign of Home (2.80), and after five rounds chose the Card stack look with today's header and a few colours (2.81); D17 drew the whole page in that look with D16's fixes inside, and the owner approved it with variant A (2.82). The job's first plan, for the three fixes alone, is this file at `dbb9229`.

## Inputs

| | |
|---|---|
| **The job** | Build Home as `prototypes/d17-home-card-stack.html` and `.md` draw it, variant A: today's header, sections, order and words; cards with a hard edge, index tabs, offset-edge buttons, the figures re-tinted; no script; D16's three fixes (the phone scene readable, Next that does not move the page, Tab stops only on what shows). |
| **Done means** | B20 is merged into `revamp` with a build review of PASS (or PASS WITH FIXES, each "fixed when" run); on `revamp`, `npm test`, `npm run build` and CI's end-to-end pass (`npx playwright test --grep-invert @visual --project=d1440-dark --project=phone`) pass; the critique's three measures re-run on the built page and recorded (phone label px, scroll after Next, unseen Tab stops); `docs/direction.md` §9 rewritten for the new Home. Nothing pushed. |
| **Budget** | 1.0 to 1.5 million subagent tokens of growth for the build (estimate below), on top of about 2.29 million spent on the scout, the designs and the redesign rounds. A stop for the owner at 2.0 million for the build. |
| **References** | `docs/direction.md` 2.79 to 2.82, §6 (Patch, which the header and every other page keep), §9 (Home, to be rewritten); `prototypes/d17-home-card-stack.md` (§10 "For the builder", §11 the acceptance checks, §7 D16's fixes measured again) and `.html`; `prototypes/d16-home-demo.md` (the mechanism D17 keeps); `prototypes/s19-home-facts.md` (Home's code and the tests that pin it, Part 7); `src/pages/index.astro`, `src/lib/home.ts`, `src/lib/home.test.ts`, `e2e/site.spec.ts`. |

## Decisions in this plan

1. **The design is frozen** (2.82): D17 as drawn, variant A. The prototype's variant B, its theme and variant switches and its top bar are not part of the design. A change to the design goes back to `designer`, on the owner's model rule (no Fable without the owner's word).
2. **Home only.** The look is scoped to Home's own styles; the header, the footer, `src/styles/tokens.ts` and every other page stay Patch. If a token must change, the builder stops and reports.
3. **No script, no new words, no new island.** Home keeps exactly two `<script>` elements (`e2e/site.spec.ts:1710-1714`); the demo's words come from lesson 1 as today (`src/lib/home.ts`).
4. **`net-map.ts` and the Lesson page are untouched.** Home re-tints its figures in its own scope and draws its own leaders and crop, as D16 specified.
5. **One spec review, one builder (Sonnet), one build review**, on a branch off `revamp` in its own worktree, with an E2E port of its own (4486). The spec review marks every case only a real browser can try (focus, scroll, Tab order, sizes, contrast) as an end-to-end test. Fixes that are exactly what the reviewer names go to a Haiku `builder`, Sonnet if it fails.
6. **Tests that pin today's Home change once, in B20** (S19 Part 7): the tracks' `main .cable > li.leg` (`site.spec.ts:253-263`), the demo's step and Learn checks (`:142-231`), the keyboard checks (`:234-251`), D5's block heights (`:1647-1660`), and `home.test.ts`'s rule that D5's styles hold no colour value but tokens.

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| S19 | scout | scout (Haiku) | Done (`prototypes/s19-home-facts.md`). | |
| D16 | design | designer (Opus 5.5) | Done, superseded by D17, which carries its fixes (`prototypes/d16-home-demo.*`). | |
| R1 to R5 | design | designers (Opus 5.5, then Fable 5.2) | Done: `impeccable`'s five rounds of sketches (`team.md`). | |
| D17 | design | designer (Fable 5.2, at the owner's word) | Done and approved, variant A (`prototypes/d17-home-card-stack.*`). | The owner's words, direction 2.82. |
| B20 spec | build | reviewer (Opus) | Holes and attack cases for `d17-home-card-stack.md`, variant A: `prototypes/d17-cases.md`. | Holes with one right answer closed as errata; taste goes back to `designer`. |
| B20 | build | builder (Sonnet) | D17 in `src/pages/index.astro` and `src/lib/home.ts`, with the tests and specs that pin Home. | Each case a test; `npm test`; `npm run build`; `e2e/site.spec.ts` at d1440-dark and phone. |
| B20 review | build | reviewer (Opus) | The diff against the spec, the prototype and the cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| F17 | end | orchestrator (Opus 5.5) | The branch into `revamp`; CI's end-to-end pass; the critique's measures re-run; `impeccable critique` on the built Home if the owner wants the score again; §9 rewritten; the ledger; the owner's result with errata. | `npm test`, `npm run build`, CI's e2e pass on `revamp`. |

Order: the spec review; B20; its review; F17.

## Estimate

| Part | Growth, roughly |
|---|---|
| B20 spec review (a whole page, 13 sections of spec) | 0.2 to 0.3 million |
| B20: `index.astro`, `home.ts`, `site.spec.ts`, `home.test.ts` | 0.5 to 0.8 million |
| B20 review, and the fixes | 0.3 to 0.4 million |
| **Total for the build** | **1.0 to 1.5 million** |

## When the work stops for the owner

- A hole in the spec that needs taste and would change what the owner approved.
- A finding that the look cannot be met without script, without changing a token other pages use, or without touching the Lesson page.
- The build past 2.0 million tokens of growth.
- Anything `CLAUDE.md` says the owner keeps: push, merge to `main`, deploy, sign-ins, installs.

A build unit that fails two reviews comes back to the orchestrator with both reports.

## What could go wrong

- **The prototype's CSS was written to win over the built page's CSS** (selectors prefixed, `!important` in places). The builder moves the rules into `index.astro`'s own styles and the generated CSS, not the overrides.
- **The figures are re-tinted through custom properties** and three things did not fit by tokens alone (the lit colour on `.lm-defs`, the trail's casing, and the glow, rings and fade-in switched off): each needs a rule scoped to Home that cannot leak into a lesson.
- **The header stays Patch on a page that is not.** Its tests (`site.spec.ts:382-392`) must keep passing unchanged.
- **Phone tests run at 390, Home's demo tests at 375.** The spec's checks name their width.

## Not in this job

The look on any page but Home; the header and footer; the Lesson page's phone figures and Subnetting's hidden bits board; the critique's findings D (two "start" destinations) and E beyond what D17 draws, and its minor items; `net-map.ts`'s frame; lesson 1's words.

## Open, for the owner

Whether the Card stack look should replace Patch across the site (D17's question 1). The build does not wait for it.
