# Part C Specification

## C1 — AI implementation
Give AI the completed B1 pseudocode and only this instruction:
```text
Implement this exactly, one function per pseudocode block, no additional behaviour.
```
Preserve:
- prompt;
- agent/model if available;
- original AI output;
- later edits separately.

Suggested files:
```text
part-c/ai-implementation/AI_PROMPT.md
part-c/ai-implementation/ORIGINAL_AI_OUTPUT.md
part-c/ai-implementation/POST_GENERATION_CHANGES.md
```

## C2 — Reverse engineer
Write pseudocode for the AI implementation without looking at the original B1 pseudocode.

Every difference must be:
1. AI added something not requested;
2. AI omitted something specified;
3. AI interpreted an ambiguous instruction.

For ambiguity, record original wording, interpretations, intended meaning and revised wording.

Create:
```text
part-c/reverse-engineered-pseudocode/feature.md
part-c/difference-table/differences.md
```

| # | Pseudocode location | AI behaviour | Classification | Evidence | Correct? | Action |
|---|---|---|---|---|---|---|
| 1 | TBD | TBD | Added/Omitted/Ambiguous | TBD | TBD | TBD |

## C3 — Ten-input comparison
Create:
```text
part-c/comparison/ten-input-comparison.md
```
Run:
- the same 5 Part B inputs;
- 5 new inputs.

| # | Input | Expected from pseudocode | Own result | AI result | Agree? | Correct result | Reason |
|---|---|---|---|---|---|---|---|
| 1 | TBD | TBD | TBD | TBD | TBD | TBD | TBD |

Resolve disagreements by tracing the pseudocode.

## C4 — Explanation
Record a maximum-five-minute explanation using only pseudocode as notes. No code on screen. Explain behaviour and failures.

Store:
```text
part-c/recording/
```
Record duration and non-technical listener feedback in `RECORDING_NOTES.md`.
