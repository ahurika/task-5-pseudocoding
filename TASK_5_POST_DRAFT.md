# Task 5 Post Draft — Writing for Verification

Task 5 was about something that looks simple until you have to prove you understand every branch: **pseudocode**.

I worked through code I had written across previous payment slices, analyzed three functions of increasing difficulty from `lodash`, diagnosed a subtle duration-inversion bug in a prorated refund function, and specified a discount engine before writing any code.

The most enlightening part was **Part C**. I gave an AI coding agent my B1 pseudocode with the strict instruction: *"Implement this exactly, one function per pseudocode block, no additional behaviour."* Then I reverse-engineered the AI's code line-by-line without looking back at my original specification.

It exposed three key realities of working with AI:
- **Something the AI added that wasn't in the code:** In Part A2, AI explanations repeatedly hallucinated runtime `TypeError` and `RangeError` exceptions in `lodash.chunk` and automatic bounds-swapping in `lodash.clamp` that simply do not exist in the source code.
- **Something the AI missed:** In Part C1, the AI omitted case normalization (`.toUpperCase()`), executing literal string matching against database keys because the pseudocode didn't explicitly instruct it to sanitize case.
- **An ambiguity in my own specification:** In Step 9 of my discount logic, I wrote `calculate discountAmount as (cart subtotalAmount * percentage) / 100`. Because I didn't specify integer rounding, the AI produced floating-point cents (`555.5¢` for a 5,555¢ cart at 10%), whereas my human implementation rounded to whole integer minor units (`556¢`).

I compared both implementations across **10 inputs** (5 existing + 5 boundary cases). When they disagreed on lowercase codes and fractional amounts, I adjudicated correctness by tracing the pseudocode rather than picking my own preference.

The lesson was straightforward: **better AI engineering does not start with "build this feature." It starts with unambiguous behavioural specification.**

And verification does not end when the code compiles. It starts there.
