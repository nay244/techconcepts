# TechConcepts (revamp)

Short visual lessons on how technology works: a free, static, no-account site. This checkout is the **revamp**. Its goal is to make the lessons that exist excellent and trustworthy, on phone and desktop alike.

[docs/direction.md](docs/direction.md) holds every revamp decision and the living roadmap. Read it before planning work. When a decision or the roadmap moves, update it in the same change.

## Ownership

On 2026-11-10 the owner handed product and build decisions to Claude: what the site is for and how it is built are your call. Decide, record the decision and its reason in the direction doc, then build.

The owner keeps:

- anything that leaves this machine: push, pull request, merge, deploy, the domain
- sign-ins, accounts and credentials
- installing skills or plugins
- the original folder (below)

## Boundaries

- **Two folders.** Work here. The sibling folder with the plural name is the frozen original: read it, change nothing in it. Ask the owner before moving, renaming or copying a whole folder.
- **Public repo, live `main`.** `origin` is public and Cloudflare deploys `main`. Work on branches off `revamp`.
- **Repo-relative paths** in every tracked file, so the machine's folder names stay out of the repo.
- **Named stashes:** `git stash push -m "<why>"`.

## Accuracy outranks everything

A wrong lesson is worse than a missing one. A change to lesson content, a glossary entry or an objective mapping follows [docs/content-model.md](docs/content-model.md) (§8 is the workflow) and ends with an all-pass report from a fresh `fact-checker` agent.

## UI work

Load the `frontend-design` skill for every design decision. Design phone (375px) and desktop (1440px) together, and look at both in the browser before calling a screen done.

The owner set the redesign's scope on 2026-11-10: the look and the layouts of the whole site are revamped. The Tracks page (one panel per track) and the Lesson page (contents sidebar, network visual, event log, Learn) are the layouts to start from; change them wherever the design is better for it. All art stays original.

## Done means verified

Run `npm test` and `npm run build` before calling work done, plus `npm run e2e` for anything a reader can see. Report failures as they are.

## How to work

Adapted from the Karpathy guidelines (`github.com/multica-ai/andrej-karpathy-skills`). They bias toward caution over speed; for trivial tasks, use judgment.

### 1. Think before coding

**State assumptions. Surface confusion and tradeoffs.**

- State your assumptions before implementing.
- When a request has more than one reading, name the readings and say which you took and why.
- When a simpler approach exists, say so, and push back when warranted.
- When something the owner keeps is unclear, stop, name what is confusing, and ask. Everything else is yours to decide and record.

### 2. Simplicity first

**Minimum code that solves the problem. Nothing speculative.**

- Build only what the task needs.
- Write an abstraction on its second use, a setting when someone needs to change it, and error handling for failures that can happen.
- If 200 lines could be 50, rewrite it.

The test: would a senior engineer call this overcomplicated? If yes, simplify.

### 3. Surgical changes

**Touch only what you must. Clean up only your own mess.**

- Leave adjacent code, comments and formatting as they are, and match the existing style.
- Mention unrelated dead code you notice; removing it is its own task.
- Remove the imports, variables and functions your own change orphaned.

The test: every changed line traces to the task.

### 4. Goal-driven execution

**Define success criteria. Loop until verified.**

Turn each task into a goal you can check:

- "Add validation" → write tests for invalid inputs, then make them pass
- "Fix the bug" → write a test that reproduces it, then make it pass
- "Refactor X" → tests pass before and after

For multi-step work, state a brief plan with a check per step:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
```

Strong criteria let you loop on your own. Weak ones ("make it work") need constant clarification.
