# Task 5 Pseudocoding — PRD

**Time budget:** 16–20 hours  
**Source of truth:** Product Engineering Bootcamp Task 5 brief

## Purpose
Prove that the learner can read code independently, express behaviour as precise pseudocode, implement from pseudocode, direct an AI coding agent from pseudocode, verify AI output, and explain an implementation without relying on source code.

## Mandatory boundaries
- A2 first pass: **no AI**. AI comparison happens only after the first pass.
- B2 implementation: **no AI**.
- C1: give AI the completed B1 pseudocode and only it, with: `Implement this exactly, one function per pseudocode block, no additional behaviour.`
- C2: reverse-engineer AI code without looking at the original pseudocode.
- C3: compare both implementations on 10 inputs.
- C4: maximum 5-minute explanation, using only pseudocode as notes.

## Required repository
```text
task-5-pseudocoding/
├── part-a/
│   ├── own/
│   ├── open-source/
│   └── planted-bug/
├── part-b/
│   ├── pseudocode/
│   ├── implementation/
│   └── traces/
├── part-c/
│   ├── ai-implementation/
│   ├── reverse-engineered-pseudocode/
│   ├── difference-table/
│   ├── comparison/
│   └── recording/
├── README.md
└── evidence/
```

## Part A
### A1
Choose 3 functions from previous work:
1. most complex;
2. touches money or authorisation;
3. handles an error.

For each: pseudocode + normal/edge/invalid hand traces + real execution comparison + discrepancies/corrections.

### A2
Choose 3 functions from an open-source library actually used:
1. short;
2. medium;
3. difficult.

First pass must be without AI. Afterwards compare against AI explanation, re-read source, and record every difference and who was correct.

### A3
A reviewer/partner provides a function with one planted bug. Write pseudocode for:
1. what it actually does;
2. what it should do;
3. the bug represented by the difference.

## Part B
Choose a new feature with real logic. The brief examples are discount-code rules (expiry, minimum spend, one-use-per-customer) or delivery-fee calculation (distance, time of day, order size).

Write complete pseudocode before code: inputs, failures, branches, state changes. Hand-trace at least 5 inputs including relevant awkward cases. Implement without AI. Each numbered pseudocode step must map to identifiable code. Run the same 5 cases and compare.

## Part C
### C1
Give B1 pseudocode to AI with the exact instruction above.

### C2
Reverse-engineer the AI implementation without looking at B1. Classify every difference:
- AI added something;
- AI omitted something;
- AI interpreted ambiguity.

For ambiguity, rewrite the specification so it cannot be misread.

### C3
Run both implementations against the same 5 previous inputs plus 5 new inputs. For disagreements, determine correctness by tracing the pseudocode.

### C4
Record a maximum-five-minute explanation using only pseudocode as notes, with no code on screen. Then have a non-technical person explain the feature back. Record what they understood.

## Definition of done
All Part A, B and C artifacts exist; required traces and comparisons are real; A2 first-pass boundary is preserved; Part B was implemented without AI; C2 differences are classified; C3 has 10 inputs; C4 recording and listener feedback exist; README explains the standard and learning; defence questions are rehearsed.
