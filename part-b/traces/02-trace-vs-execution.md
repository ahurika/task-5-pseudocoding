# B2 Trace vs Execution Comparison

**Feature:** `applyDiscountCode`  
**Pseudocode Source:** `part-b/pseudocode/discount-code.md`  
**Implementation:** `part-b/implementation/discount.ts`

---

## Comparison Table

| Case # | Category | Input Summary | Hand-Trace Expected Outcome | Real Code Execution Output | Match? | Discrepancy / Explanation |
|:---:|---|---|---|---|:---:|---|
| 1 | Normal | Subtotal: 10,000¢ ($100), Customer: `A121`, Code: `SALE10` (10%) | SUCCESS: discount = 1,000¢, newTotal = 9,000¢ | `status: "SUCCESS", discountAmount: 1000, newTotal: 9000` | Yes | Perfect match. Percentage discount applied correctly. |
| 2 | Edge (Exact Threshold) | Subtotal: 5,000¢ ($50), Customer: `A124`, Code: `SAVE50` (10%, min $50) | SUCCESS: discount = 500¢, newTotal = 4,500¢ | `status: "SUCCESS", discountAmount: 500, newTotal: 4500` | Yes | Perfect match. Boundary condition (`subtotal >= minimumSpendAmount`) evaluated correctly. |
| 3 | Invalid (Expired) | Subtotal: 10,000¢ ($100), Customer: `A125`, Code: `EXPIRED10` | REJECTED: code has expired, discount = 0¢, newTotal = 10,000¢ | `status: "REJECTED", discountAmount: 0, newTotal: 10000, reason: "code has expired"` | Yes | Perfect match. Early exit at Step 5. |
| 4 | Invalid (Already Used) | Subtotal: 10,000¢ ($100), Customer: `A123`, Code: `SALE10` | REJECTED: code already used by customer, discount = 0¢, newTotal = 10,000¢ | `status: "REJECTED", discountAmount: 0, newTotal: 10000, reason: "code already used by customer"` | Yes | Perfect match. Customer usage check at Step 7 blocked redemption. |
| 5 | Invalid (Below Minimum) | Subtotal: 3,000¢ ($30), Customer: `A126`, Code: `SAVE50` (min $50) | REJECTED: minimum spend not met, discount = 0¢, newTotal = 3,000¢ | `status: "REJECTED", discountAmount: 0, newTotal: 3000, reason: "minimum spend not met"` | Yes | Perfect match. Early exit at Step 8 due to subtotal under threshold. |

---

## Observations & Corrections

- **Discrepancies identified:** During initial execution, Case 1 shared customer ID `A123` with Case 4, causing Case 1 to fail against the mock redemption database. Distinguishing the new customer as `A121` resolved the collision.
- **Pseudocode or code corrections:** None needed in core logic; all 12 numbered pseudocode steps translated directly to code without syntax ambiguity or logic drift.
