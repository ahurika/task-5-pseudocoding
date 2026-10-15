# C2 AI Difference Table

**Original Pseudocode:** `part-b/pseudocode/discount-code.md`  
**AI Implementation:** `part-c/ai-implementation/discount.ts`  
**Reverse-Engineered Pseudocode:** `part-c/reverse-engineered-pseudocode/feature.md`  

---

## Difference Table

| ID | Original pseudocode step | Reverse-engineered behaviour | Classification | Evidence | Correctness impact | Action |
|---|---|---|---|---|---|---|
| D-001 | Step 9: `calculate discountAmount as (cart subtotalAmount * percentage) / 100` | Code performs floating-point division `(subtotal * percentage) / 100` without rounding (`Math.round` / integer coercion). | AI interpreted ambiguity | `discount.ts` line 102: `(cart.subtotalAmount * (discountCode.percentage ?? 0)) / 100` | Can yield fractional cents (e.g. 33.333¢) if subtotal * percentage is not divisible by 100. | Revise Step 9 in B1 specification to explicitly require rounding to the nearest integer cent. |
| D-002 | Step 2: `LOOK UP discount code in database` | Looked up via exact case without `.toUpperCase()`, whereas human B2 added `.toUpperCase()`. | AI interpreted ambiguity | `discount.ts` line 61: `DISCOUNT_CODES_DB[code]` vs B2 `MOCK_CODES[code.toUpperCase()]` | Lowercase inputs like `"sale10"` fail in AI code but pass in human B2 code. | Clarify in pseudocode whether code lookup is case-insensitive. |

---

## Ambiguity Analysis

### Ambiguity 1: Rounding of Percentage Discount
- **Original wording:** `calculate discountAmount as (cart subtotalAmount * percentage) / 100`
- **Why ambiguous:** The mathematical formula `(subtotal * percentage) / 100` does not specify whether to round, truncate, or preserve floating-point fractions when dividing integers in minor units (cents).
- **Intended behaviour:** Discount amounts in currency minor units must always be whole integers (rounded to the nearest whole cent using standard rounding).
- **Revised wording:** `calculate discountAmount as the rounded integer of (cart subtotalAmount * percentage) / 100`
- **Why revised wording is unambiguous:** Explicitly designates rounding to an integer, leaving no discretion to the implementer or compiler.

### Ambiguity 2: Case Sensitivity of Code String
- **Original wording:** `LOOK UP discount code in database`
- **Why ambiguous:** Did not specify whether the discount code string should be matched case-sensitively or normalized to uppercase before lookup.
- **Intended behaviour:** Promotional codes entered by customers should be normalized (case-insensitive).
- **Revised wording:** `Convert code to uppercase and LOOK UP discount code in database`
- **Why revised wording is unambiguous:** Prescribes the exact normalization step before the database query.
