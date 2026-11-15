# Product

<!-- impeccable:product-schema 1 -->

This file is the product record the `impeccable` design skill reads. It holds product truth only. Every revamp decision, the roadmap and the look live in [docs/direction.md](docs/direction.md), which wins wherever the two differ; lesson content rules live in [docs/content-model.md](docs/content-model.md).

## Platform

web

## Users

**Primary: a beginner** (the owner, 2026-11-15). Someone new to IT who wants to understand how a piece of technology works: what happens when a page loads, what a router does, why a firewall drops a message. They arrive with no account, on a phone or a desktop, and take one short lesson at a time, untimed.

**Also served: certification candidates** (CompTIA A+, Network+, Security+, CySA+), who include the owner studying for their own exams. Each lesson carries exam tags, and exam-level detail sits in Go deeper, closed by default. When the two audiences pull apart, the beginner wins.

## Product Purpose

TechConcepts is a set of short visual lessons on how technology works, starting with networking. A lesson runs Overview, Watch, Learn, Practice: the reader watches a small scene play, reads what happened in plain words and then by name, and tries a few questions.

Success is a reader who can say truthfully what happened and why, and who was told nothing false on the way. A wrong lesson is worse than a missing one. The launch bar is the owner's: all three tracks complete, every lesson verified, phone layouts done.

## Positioning

Accuracy first, then the scene (the owner, 2026-11-15).

1. Every claim in a lesson is cited to a primary source, down to the section, and each lesson is checked claim by claim against those sources by an independent fact-checker before it counts as verified. The site shows its sources and says how many lessons have passed.
2. The reader watches the mechanism work before reading about it: each Watch step plays real events on a figure, with a log of what was sent.

When the two conflict, accuracy wins: a scene shows only what a cited Learn statement backs.

## Operating Context

- Free, static, no account, no sign-in, no site search. Served at `techconcepts.app` over HTTPS.
- Phone (375px) and desktop (1440px) are both first-class; every screen is designed for the two together.
- Lessons are grouped into tracks. A lesson may be shared by two tracks; its progress is saved once.
- Progress and the theme are saved in the reader's own browser storage and nowhere else. The site works fully when storage is blocked or full.
- Light and dark themes; a reader who states no preference gets light.
- Analytics, when switched on, is Cloudflare's cookieless Web Analytics, and the About page says so.

## Capabilities and Constraints

- **Lesson shape:** Overview, Watch (a few steps, each playing events on one figure), Learn, Practice. Practice is never scored or saved. Lessons are untimed.
- **Content rules:** every fact cites a registered primary source; every Watch part traces to a cited Learn statement; the build fails on a breach. Per-track limits cap steps, facts, questions and word counts.
- **Voice in lessons:** second person, warm, beginner first. The everyday idea, then the precise term. One new idea per step.
- **Not a game:** no gamified words or mechanics. Not a study planner.
- **Stack:** Astro static site with React islands, deployed to Cloudflare Workers static assets. Figures are drawn at build time as inline SVG; nothing is drawn at runtime.
- **Page weight:** a page's HTML stays at or under 250 KB gzipped, and the JavaScript a lesson page loads at or under 200 KB gzipped. The build fails on a breach.
- **Terms:** track, lesson, unit, step, event, figure, scene, position, Go deeper. The README defines each.
- **Undecided or held (the owner's):** when the revamp goes live; the rest of the Glossary (paused 2026-11-14); the standalone Practice page (held); translations (deferred).

## Brand Commitments

- The name is TechConcepts; the domain is `techconcepts.app`.
- All art is original. Figures, track covers and the logo are drawn in this repository's own illustration system.
- The look is "Patch" and the logo is "Lifted lid". Their tokens and rules are in the direction doc (§6 and §8) and are not repeated here.
- A design is approved by the owner, from a prototype, before it is built.

## Evidence on Hand

- The primary-source registry: `src/content/sources.ts`.
- The fact-check reports, one per lesson: `docs/fact-checks/`.
- Every changed sentence of each lesson moved to the cited shape: `docs/lesson-changes/`.
- Measurements the lesson redesign started from: the direction doc §4.
- The lessons and tracks themselves: `src/content/lessons/`, `src/content/tracks/`. Lesson and track counts are worked out from the content at build time; take them from there, not from memory.

There are no testimonials, user numbers, customers, press, pricing or endorsements, and no affiliation with CompTIA or any other exam body. Future work must not invent any.

## Product Principles

1. **Accuracy outranks everything.** Speed, lesson count and polish all give way to it.
2. **Beginner first.** Plain words before the term; depth is offered, never required.
3. **Watch, then read.** The scene carries the idea; the words name what the reader just saw.
4. **Nothing asked of the reader.** No account, no cost, no tracking that follows them, nothing that fails when storage does.
5. **Phone and desktop alike.** Neither is the afterthought.

## Accessibility & Inclusion

**WCAG 2.2 level AA is the required standard for every page, on phone and desktop** (the owner, 2026-11-15).

Already enforced in the repo, and kept:

- Colour comes only from the semantic tokens, which meet AA contrast in both themes; a test checks them.
- Colour is never the only signal: a label, icon or text always goes with it.
- Under reduced motion nothing travels or pulses, and each event still ends in the same settled state.
- Screen readers hear each event's plain sentence as it plays; every figure carries `role="img"` and a label.
- The lesson console has keyboard shortcuts.

A full audit of the site against WCAG 2.2 AA has not been run; this section names the bar, not a result.
