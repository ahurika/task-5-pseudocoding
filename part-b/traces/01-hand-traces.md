# B1 Hand Traces — Discount Code

**Function:** `applyDiscountCode`  
**Pseudocode Source:** `part-b/pseudocode/discount-code.md`

---

## Trace Summary Table

| Case # | Category | Input Summary | Expected Result | Reason / Notes |
|---:|---|---|---|---|
| 1 | Normal | Subtotal: 10,000¢ ($100), Customer: `A121`, Code: `SALE10` (10%) | SUCCESS: discount = 1,000¢ ($10), newTotal = 9,000¢ ($90) | Code is active, unexpired, unredeemed by user, spend >= $50 |
| 2 | Edge (Exact Threshold) | Subtotal: 5,000¢ ($50), Customer: `A124`, Code: `SAVE50` (10%, min $50) | SUCCESS: discount = 500¢ ($5), newTotal = 4,500¢ ($45) | Subtotal exactly meets the minimum spend boundary |
| 3 | Invalid (Expired) | Subtotal: 10,000¢ ($100), Customer: `A125`, Code: `EXPIRED10` | REJECTED: `CODE_EXPIRED`, discount = 0¢, newTotal = 10,000¢ | Expiry date is before current date |
| 4 | Invalid (Already Used) | Subtotal: 10,000¢ ($100), Customer: `A123`, Code: `SALE10` | REJECTED: `CODE_ALREADY_USED`, discount = 0¢, newTotal = 10,000¢ | Single-use code already in customer's redemption history |
| 5 | Invalid (Below Minimum) | Subtotal: 3,000¢ ($30), Customer: `A126`, Code: `SAVE50` (min $50) | REJECTED: `MINIMUM_SPEND_NOT_MET`, discount = 0¢, newTotal = 3,000¢ | Subtotal ($30) is strictly less than minimum spend ($50) |

---

## Detailed Hand Traces

### Case 1: Normal Input (10% off, subtotal $100)
- **Inputs:** `cart = { subtotalAmount: 10000, customerId: "A121" }`, `code = "SALE10"`, `currentDate = 2026-10-15`
- **Code attributes:** `exists: true, active: true, expiryDate: 2026-12-31, minimumSpendAmount: 5000, type: "percentage", percentage: 10`
- **Redemption history:** `A121` has not used `SALE10`

| Step | Pseudocode Action | Evaluation | State / Outcome |
|---:|---|---|---|
| 1 | Check subtotalAmount <= 0 | 10000 <= 0 is false | Continue |
| 2 | Look up code in DB | Found record for "SALE10" | Continue |
| 3 | Check if code not found | Code found | Continue |
| 4 | Check if code inactive | active == true | Continue |
| 5 | Check if currentDate > expiryDate | 2026-10-15 > 2026-12-31 is false | Continue |
| 6 | Check previous redemption | Query returns 0 redemptions | Continue |
| 7 | Branch on already used | Not redeemed | Continue |
| 8 | Check subtotal < minimumSpend | 10000 < 5000 is false | Continue |
| 9 | Calculate discount amount | type == percentage: (10000 * 10) / 100 | discountAmount = 1000 |
| 10 | Cap discount at subtotal | 1000 > 10000 is false | discountAmount = 1000 |
| 11 | Compute newTotal | 10000 - 1000 | newTotal = 9000 |
| 12 | Return result | Return SUCCESS | `{ status: "SUCCESS", discountAmount: 1000, newTotal: 9000 }` |

---

### Case 2: Edge Input (Exact Threshold: spend == minSpend)
- **Inputs:** `cart = { subtotalAmount: 5000, customerId: "A124" }`, `code = "SAVE50"`, `currentDate = 2026-10-15`
- **Code attributes:** `exists: true, active: true, expiryDate: 2026-12-31, minimumSpendAmount: 5000, type: "percentage", percentage: 10`
- **Redemption history:** `A124` has not used `SAVE50`

| Step | Pseudocode Action | Evaluation | State / Outcome |
|---:|---|---|---|
| 1 | Check subtotalAmount <= 0 | 5000 <= 0 is false | Continue |
| 2 | Look up code in DB | Found record for "SAVE50" | Continue |
| 3 | Check if code not found | Code found | Continue |
| 4 | Check if code inactive | active == true | Continue |
| 5 | Check if currentDate > expiryDate | 2026-10-15 > 2026-12-31 is false | Continue |
| 6 | Check previous redemption | Query returns 0 redemptions | Continue |
| 7 | Branch on already used | Not redeemed | Continue |
| 8 | Check subtotal < minimumSpend | 5000 < 5000 is false | Continue (exact threshold met) |
| 9 | Calculate discount amount | type == percentage: (5000 * 10) / 100 | discountAmount = 500 |
| 10 | Cap discount at subtotal | 500 > 5000 is false | discountAmount = 500 |
| 11 | Compute newTotal | 5000 - 500 | newTotal = 4500 |
| 12 | Return result | Return SUCCESS | `{ status: "SUCCESS", discountAmount: 500, newTotal: 4500 }` |

---

### Case 3: Invalid Input (Expired Code)
- **Inputs:** `cart = { subtotalAmount: 10000, customerId: "A125" }`, `code = "EXPIRED10"`, `currentDate = 2026-10-15`
- **Code attributes:** `exists: true, active: true, expiryDate: 2026-10-01, minimumSpendAmount: 5000, type: "percentage", percentage: 10`

| Step | Pseudocode Action | Evaluation | State / Outcome |
|---:|---|---|---|
| 1 | Check subtotalAmount <= 0 | 10000 <= 0 is false | Continue |
| 2 | Look up code in DB | Found record for "EXPIRED10" | Continue |
| 3 | Check if code not found | Code found | Continue |
| 4 | Check if code inactive | active == true | Continue |
| 5 | Check if currentDate > expiryDate | 2026-10-15 > 2026-10-01 is true | **RETURN REJECTED: code has expired** |

**Returned Result:** `{ status: "REJECTED", discountAmount: 0, newTotal: 10000, reason: "code has expired" }`

---

### Case 4: Invalid Input (Already Redeemed by Customer)
- **Inputs:** `cart = { subtotalAmount: 10000, customerId: "A123" }`, `code = "SALE10"`, `currentDate = 2026-10-15`
- **Redemption history:** Customer `A123` already redeemed `SALE10` on 2026-10-10

| Step | Pseudocode Action | Evaluation | State / Outcome |
|---:|---|---|---|
| 1 | Check subtotalAmount <= 0 | 10000 <= 0 is false | Continue |
| 2 | Look up code in DB | Found record for "SALE10" | Continue |
| 3 | Check if code not found | Code found | Continue |
| 4 | Check if code inactive | active == true | Continue |
| 5 | Check if currentDate > expiryDate | 2026-10-15 > 2026-12-31 is false | Continue |
| 6 | Check previous redemption | Record found in customer redemption history | Continue |
| 7 | Branch on already used | Already redeemed == true | **RETURN REJECTED: code already used by customer** |

**Returned Result:** `{ status: "REJECTED", discountAmount: 0, newTotal: 10000, reason: "code already used by customer" }`

---

### Case 5: Invalid Input (Subtotal Below Minimum Spend)
- **Inputs:** `cart = { subtotalAmount: 3000, customerId: "A126" }`, `code = "SAVE50"`, `currentDate = 2026-10-15`
- **Code attributes:** `minimumSpendAmount: 5000`

| Step | Pseudocode Action | Evaluation | State / Outcome |
|---:|---|---|---|
| 1 | Check subtotalAmount <= 0 | 3000 <= 0 is false | Continue |
| 2 | Look up code in DB | Found record for "SAVE50" | Continue |
| 3 | Check if code not found | Code found | Continue |
| 4 | Check if code inactive | active == true | Continue |
| 5 | Check if currentDate > expiryDate | 2026-10-15 > 2026-12-31 is false | Continue |
| 6 | Check previous redemption | Not redeemed | Continue |
| 7 | Branch on already used | Not redeemed | Continue |
| 8 | Check subtotal < minimumSpend | 3000 < 5000 is true | **RETURN REJECTED: minimum spend not met** |

**Returned Result:** `{ status: "REJECTED", discountAmount: 0, newTotal: 3000, reason: "minimum spend not met" }`
