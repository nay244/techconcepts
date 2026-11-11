# Team ledger

One row per unit of `plan.md`, added when the unit ends. Tokens are the subagent's total for the unit, all tries together.

## Units

| Unit | Agent | Model | Tries | Tokens | Result |
|---|---|---|---|---|---|
| S1 | scout | Haiku | 1 | 137,061 | Done 2026-11-10. `prototypes/s1-lesson-facts.md`, 229 lines, every fact with a `path:line`; three spot-checked by the orchestrator. |
| D1 | designer | Fable | 1 | 315,291 | Done 2026-11-10. Two variants; check run at 1440×900 and 1280×720; photographed offline by the orchestrator. Approved 2026-11-10. |
| D2 | designer | Fable | 1 | 369,814 | Done 2026-11-10. Two variants for the table's place, one design for the other three fixes; check run at 375×812 and 390×844. Approved 2026-11-10. |
| D3 | designer | Fable | 1 | 259,496 | Done 2026-11-10. Two variants; check run at 768×1024 and 1024×768; photographed offline by the orchestrator. Approved 2026-11-10. |
| D4 | designer | Fable | 1 | 193,973 | Done 2026-11-10. One layout on two grounds; check run at 1200×630, 600×315 and 300×158. Approved 2026-11-10. |
| B1 | builder | Sonnet | 1 | 165,335 | Done 2026-11-10, implements D1 variant B. `npm test` 1,387 passed; build within budget; `npm run e2e` 835 passed, 231 skipped; `e2e/reading.spec.ts` 18 passed, line length 62 to 70 characters at 1440 and 52 to 60 at 1280. |
| B1 | reviewer | Opus, high | 1 | 124,073 | PASS: no blockers, no drift, all 16 acceptance checks traced to a test. Noted: the test for marks 3 and 4 checks only the end of each link. Merged into `revamp`. |
| B2 | builder | Sonnet | 1 | 216,112 | Built 2026-11-10 on `build/b2-lesson-phone` (942050a), implements D2 variant A. `npm test` 1,392 passed; build within budget; `npm run e2e` 882 passed, 231 skipped. **Not reviewed, not merged.** The builder reports four differences from the spec for the reviewer to judge: `overflow: hidden` on the scene, an `aria-label` for "Table, changed", a mark on the Bits tab, and how check 13 is tested. |

The four agent types were added mid-session and were not loaded, so each unit ran as a general agent on its assigned model, told to follow its file in `.claude/agents/`. The designer's skill was loaded by instruction, and the scout's read-only limit was by instruction, not by its tool list.

## Designer spend

The designer runs on the orchestrator's model, the dearest on the team, so its spend is counted on its own.

| Unit | Variants | Tokens | Approved by the owner |
|---|---|---|---|
| D1 | 2 | 315,291 | 2026-11-10 |
| D2 | 2 | 369,814 | 2026-11-10 |
| D3 | 2 | 259,496 | 2026-11-10 |
| D4 | 2 | 193,973 | 2026-11-10 |

**Total:** 1,138,574 tokens for four screens, against 137,061 for the scout.

## Could go one model lower next time

Filled in when the job ends.
