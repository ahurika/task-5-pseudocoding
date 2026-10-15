# A2 — AI Comparison: Short (`clamp`)

**Function:** `lodash.clamp`  
**First-Pass Document:** `part-a/open-source/01-short.md`  

---

## AI Explanation Provided

> *"The `clamp` function takes a number and constrains it within the lower and upper bounds. If the number is smaller than the lower bound, it returns lower. If it is larger than upper, it returns upper. If lower is greater than upper, the function automatically swaps them to ensure valid boundaries. If non-numeric inputs are passed, it coerces them or throws a TypeError."*

---

## Comparison of Interpretations

| Aspect | Human First Pass | AI Explanation | Who Was Correct? | Source Verification & Explanation |
|---|---|---|:---:|---|
| **Boundary Swapping (`lower > upper`)** | Preserved literal logic: caps at `upper` then floors at `lower` without swapping. | Claimed `clamp` automatically swaps `lower` and `upper` if `lower > upper`. | **Human** | **AI was wrong.** Looking at lines 15–16: `number = number <= upper ? number : upper; number = number >= lower ? number : lower;`. There is no check `if (lower > upper) swap(lower, upper)`. If `lower = 10` and `upper = 5`, `clamp(7, 10, 5)` yields `10`, not `5`. |
| **`NaN` Fallback Handling** | Identified that `lower === lower ? lower : 0` uses JavaScript's `NaN !== NaN` self-comparison to default `NaN` to `0`. | Vaguely claimed it "coerces non-numeric inputs or throws". | **Human** | **AI was wrong.** Lodash never throws a TypeError. It uses the unary `+` operator and the `val === val` idiom to cleanly fallback `NaN` bounds to `0`. |
| **Return on `NaN` input** | Recognized that if `number` is `NaN`, the check `if (number === number)` evaluates to `false`, returning `NaN` directly. | Implied `number` would be clamped to `0`. | **Human** | Looking at line 14: `if (number === number) { ... }`. If `number` is `NaN`, the block is bypassed and `NaN` is returned untouched. |

---

## Conclusion & Learning

The AI made two clear technical errors:
1. It assumed defensive ergonomics (swapping inverted bounds) that do not exist in the source code.
2. It hallucinated that the function throws a `TypeError` on invalid arguments, whereas Lodash's implementation relies on silent IEEE 754 float coercion and NaN checks.
