# Part B Specification

## B1 — Specify before building
Choose a new feature with real logic. The brief examples are:
- discount code: expiry, minimum spend, one-use-per-customer;
- delivery fee: distance, time of day, order size.

You may choose another feature that has comparable real logic.

Create:
```text
part-b/pseudocode/feature.md
part-b/traces/01-hand-traces.md
```

The pseudocode must define every input, output, side effect, failure, branch, state change and external call.

Hand-trace at least 5 inputs before writing code. Include relevant awkward cases such as an expired code, reused code, negative quantity, or an equivalent invalid case appropriate to the selected feature.

## B2 — Independent implementation
Implement without AI in:
```text
part-b/implementation/
```

Each numbered pseudocode step must map to identifiable code. If code has no pseudocode equivalent, stop and resolve the specification first.

Create:
```text
part-b/implementation/STEP_MAPPING.md
part-b/traces/02-trace-vs-execution.md
```

Run the same five cases used for hand tracing. Every result should match or have an explained discrepancy.
