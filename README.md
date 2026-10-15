# Task 5 — Pseudocoding

This repository contains the evidence for Task 5 of the Product Engineering Bootcamp.

## Goal
Demonstrate independent code reading, precise pseudocode, implementation from specification, AI direction, AI verification, and explanation.

## Structure
```text
part-a/own/                               # 3 own functions (most complex, money/auth, error handling)
part-a/open-source/                        # 3 Lodash functions (short, medium, difficult) + AI comparisons
part-a/planted-bug/                        # Prorated refund bug (actual vs expected pseudocode + bug identification)
part-b/pseudocode/                         # B1 feature specification (applyDiscountCode)
part-b/implementation/                     # B2 independent implementation + STEP_MAPPING.md
part-b/traces/                             # 5 hand traces + real execution comparison
part-c/ai-implementation/                  # C1 AI generation record + prompt + executable discount.ts
part-c/reverse-engineered-pseudocode/      # C2 independent reverse-engineered pseudocode
part-c/difference-table/                   # C2 classified difference table with rewritten ambiguities
part-c/comparison/                         # C3 10-input comparison table resolving disagreements
part-c/recording/                          # C4 5-min explanation recording notes & listener feedback
evidence/                                  # Supporting run logs and traces
```

## Assessment Boundaries
- **A2 first pass:** Completed independently without AI before comparing with AI explanations.
- **B2 implementation:** Coded independently without AI assistance.
- **C1:** AI prompted with B1 pseudocode only: `Implement this exactly, one function per pseudocode block, no additional behaviour.`
- **C2:** Reverse-engineered without referencing original B1 pseudocode.
- **C3:** Evaluated on 10 inputs (5 from B1 + 5 new boundary cases).
- **C4:** Five-minute maximum explanation using only pseudocode as notes.

## Pseudocode Standard
Every function begins with `FUNCTION`, `INPUTS`, `OUTPUT`, `SIDE EFFECTS`, and `FAILS WHEN`, followed by numbered plain-English steps, explicit `IF/OTHERWISE` branches, explicit loops, named early exits, and marked external calls/state changes. See [PSEUDOCODE_STANDARD.md](file:///c:/Users/USER/Desktop/Pseudocoding/PSEUDOCODE_STANDARD.md).

## What I Learned
- **What precise pseudocode changed:** Strict header requirements (`FAILS WHEN`, `SIDE EFFECTS`) forced edge-case identification (e.g. zero subtotal, negative values, expired dates, and missing records) upfront before writing a single line of implementation code.
- **What AI added:** In Part A2, AI explanations repeatedly hallucinated runtime `TypeError`/`RangeError` exceptions and automatic bound-swapping in `lodash.clamp` and `lodash.chunk` that do not exist in the defensive, silent-fallback implementation of the actual source code.
- **What AI omitted:** In Step C1, the AI implementation adhered so literally to the pseudocode that it omitted case-normalization (`.toUpperCase()`), exposing that human developers intuitively add ergonomics that AI will not unless specified.
- **What ambiguity I found:** In Step C2, I discovered two genuine ambiguities in `discount-code.md`:
  1. *Fractional Cents:* Step 9 stated `calculate discountAmount as (subtotal * percentage) / 100` without declaring integer rounding, causing AI to emit floating-point cents (`555.5¢`) for fractional totals like 5,555¢.
  2. *Case Sensitivity:* Step 2 stated `LOOK UP discount code in database` without specifying case normalization.
- **What verification caught:** The 10-input comparison in C3 caught that lowercase codes (`sale10`) and fractional amounts produced different results between the two implementations, proving that correctness must be adjudicated by pseudocode trace rather than assumption.
- **What I would change next time:** Always explicitly specify rounding direction (`round`, `floor`, `ceil`) for financial arithmetic, and explicitly state string normalization rules in the input section.
