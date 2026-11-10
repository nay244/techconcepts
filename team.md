# Team ledger

One row per unit of `plan.md`, added when the unit ends. Tokens are the subagent's total for the unit, all tries together.

## Units

| Unit | Agent | Model | Tries | Tokens | Result |
|---|---|---|---|---|---|
| S1 | scout | Haiku | 1 | 137,061 | Done 2026-11-10. `prototypes/s1-lesson-facts.md`, 229 lines, every fact with a `path:line`; three spot-checked by the orchestrator. |
| D1 | designer | Fable | 1 | 315,291 | Done 2026-11-10. Two variants; check run at 1440×900 and 1280×720; photographed offline by the orchestrator. At the design gate. |
| D2 | designer | Fable | 1 | 369,814 | Done 2026-11-10. Two variants for the table's place, one design for the other three fixes; check run at 375×812 and 390×844. At the design gate. |
| D3 | designer | Fable | 1 | 259,496 | Done 2026-11-10. Two variants; check run at 768×1024 and 1024×768; photographed offline by the orchestrator. At the design gate. |
| D4 | designer | Fable | 1 | 193,973 | Done 2026-11-10. One layout on two grounds; check run at 1200×630, 600×315 and 300×158. At the design gate. |

The four agent types were added mid-session and were not loaded, so each unit ran as a general agent on its assigned model, told to follow its file in `.claude/agents/`. The designer's skill was loaded by instruction, and the scout's read-only limit was by instruction, not by its tool list.

## Designer spend

The designer runs on the orchestrator's model, the dearest on the team, so its spend is counted on its own.

| Unit | Variants | Tokens | Approved by the owner |
|---|---|---|---|
| D1 | 2 | 315,291 | waiting |
| D2 | 2 | 369,814 | waiting |
| D3 | 2 | 259,496 | waiting |
| D4 | 2 | 193,973 | waiting |

**Total:** 1,138,574 tokens for four screens, against 137,061 for the scout.

## Could go one model lower next time

Filled in when the job ends.
