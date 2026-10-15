# C3 — Ten-Input Comparison

**Human Implementation:** `part-b/implementation/discount.ts`  
**AI Implementation:** `part-c/ai-implementation/discount.ts`  
**Pseudocode Source:** `part-b/pseudocode/discount-code.md`  

---

## 10-Input Test Table

| # | Input Summary | Category | Expected from Pseudocode | Human Result (B2) | AI Result (C1) | Agree? | Correct Result | Reason / Resolution |
|:---:|---|---|---|---|---|:---:|---|---|
| 1 | Subtotal: 10,000¢, Cust: `A121`, Code: `SALE10` | Normal (from B1) | SUCCESS: discount = 1,000¢, newTotal = 9,000¢ | SUCCESS: 1,000¢ / 9,000¢ | SUCCESS: 1,000¢ / 9,000¢ | Yes | SUCCESS: 1,000¢ / 9,000¢ | Both implementations follow steps 1–12 identically. |
| 2 | Subtotal: 5,000¢, Cust: `A124`, Code: `SAVE50` | Edge: Threshold (from B1) | SUCCESS: discount = 500¢, newTotal = 4,500¢ | SUCCESS: 500¢ / 4,500¢ | SUCCESS: 500¢ / 4,500¢ | Yes | SUCCESS: 500¢ / 4,500¢ | Both correctly handle boundary condition (`subtotal >= minSpend`). |
| 3 | Subtotal: 10,000¢, Cust: `A125`, Code: `EXPIRED10` | Invalid: Expired (from B1) | REJECTED: code has expired | REJECTED: code has expired | REJECTED: code has expired | Yes | REJECTED: code has expired | Early exit at Step 5. |
| 4 | Subtotal: 10,000¢, Cust: `A123`, Code: `SALE10` | Invalid: Used (from B1) | REJECTED: code already used | REJECTED: code already used | REJECTED: code already used | Yes | REJECTED: code already used | Early exit at Step 7. |
| 5 | Subtotal: 3,000¢, Cust: `A126`, Code: `SAVE50` | Invalid: Low spend (from B1) | REJECTED: minimum spend not met | REJECTED: minimum spend not met | REJECTED: minimum spend not met | Yes | REJECTED: minimum spend not met | Early exit at Step 8. |
| 6 | Subtotal: 10,000¢, Cust: `A127`, Code: `sale10` (lowercase) | Edge: Case sensitivity (New) | Code look-up behavior depends on casing interpretation | SUCCESS (B2 normalized with `.toUpperCase()`) | REJECTED: code does not exist (C1 raw lookup) | **No** | Ambiguity in spec | B2 assumed customer input should be case-insensitive; C1 performed exact string matching as written. |
| 7 | Subtotal: 5,555¢, Cust: `A128`, Code: `SALE10` (10%) | Edge: Fractional cents (New) | Discount of 10% on 5555¢ = 555.5¢ | SUCCESS: discount = 556¢ (rounded via `Math.round`) | SUCCESS: discount = 555.5¢ (floating point) | **No** | Integer cents (B2) | Currency minor units must be whole integers. Pseudocode omitted explicit rounding instruction. |
| 8 | Subtotal: 0¢, Cust: `A129`, Code: `SALE10` | Invalid: Zero cart (New) | REJECTED: cart subtotal must be greater than zero | REJECTED: cart subtotal <= 0 | REJECTED: cart subtotal <= 0 | Yes | REJECTED: cart subtotal <= 0 | Early exit at Step 1. |
| 9 | Subtotal: -500¢, Cust: `A130`, Code: `SALE10` | Invalid: Negative cart (New) | REJECTED: cart subtotal must be greater than zero | REJECTED: cart subtotal <= 0 | REJECTED: cart subtotal <= 0 | Yes | REJECTED: cart subtotal <= 0 | Early exit at Step 1. |
| 10 | Subtotal: 10,000¢, Cust: `A131`, Code: `NONEXISTENT` | Invalid: Unknown code (New) | REJECTED: code does not exist | REJECTED: code does not exist | REJECTED: code does not exist | Yes | REJECTED: code does not exist | Early exit at Step 3. |

---

## Disagreement Resolutions by Tracing Pseudocode

1. **Input 6 (`sale10` lowercase):**
   - *Pseudocode step:* Step 2 states: `LOOK UP discount code in database`.
   - *Analysis:* The pseudocode did not instruct normalization to uppercase. The AI implementation followed the literal specification. However, real-world discount systems require case-insensitivity. The specification was ambiguous and has been rewritten in the difference table.
2. **Input 7 (5,555¢ fractional calculation):**
   - *Pseudocode step:* Step 9 states: `calculate discountAmount as (cart subtotalAmount * percentage) / 100`.
   - *Analysis:* Division produces `555.5`. The pseudocode did not state whether to round to an integer. Human B2 inferred currency constraints and rounded; AI C1 executed the mathematical formula verbatim. Resolution: Specification must state `calculate discountAmount as the rounded integer of ...`.
