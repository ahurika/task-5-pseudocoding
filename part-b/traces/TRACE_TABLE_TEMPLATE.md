# Trace Table Template

**Function/feature:**  
**Source/version:**  
**Pseudocode:**  

| Step | Pseudocode action | State before | Action/result | State after | Return/continue |
|---:|---|---|---|---|---|
| 1 |Normal Case (10% code, subtotal $100) | cart.subtotal = 10,000 cents, customerId = "A123", code = "SALE10" | Code "SALE10" exists, is not expired, is active, has not been used by customer "A123", and subtotal meets minimum spend requirement of $50. Code is applied, discount is $10 (10% of $100). | cart.subtotal = 9,000 cents, discountAmount = 1,000 cents, newTotal = 9,000 cents | Return SUCCESS with discount details |
| 2 |Edge Case (Exact Threshold) (code requires minimum spend of $50, cart subtotal is exactly $50) | cart.subtotal = 5,000 cents, customerId = "A124", code = "SAVE50" | Code "SAVE50" exists, is not expired, is active, has not been used by customer "A124", and subtotal exactly meets minimum spend requirement of $50. Code is applied, discount is $5 (10% of $50). | cart.subtotal = 4,500 cents, discountAmount = 500 cents, newTotal = 4,500 cents | Return SUCCESS with discount details |
| 3 |Invalid Case 1 (Expired Code) (Expiry date is yesterday, checkout date is today) | cart.subtotal = 10,000 cents, customerId = "A125", code = "EXPIRED10" | Code "EXPIRED10" exists, is expired (expiry date is yesterday), is active, has not been used by customer "A125", and subtotal meets minimum spend requirement of $50. Code cannot be applied because it is expired. | cart.subtotal = 10,000 cents, discountAmount = 0 cents, newTotal = 10,000 cents | Return REJECTED with reason "CODE_EXPIRED" |
| 4 |Invalid Case 2 (Already Used) (Customer has already used this single-use code) | cart.subtotal = 10,000 cents, customerId = "A123", code = "SALE10" | Code "SALE10" exists, is not expired, is active, but has been used by customer "A123" (single-use code). Code cannot be applied because it has already been used by this customer. | cart.subtotal = 10,000 cents, discountAmount = 0 cents, newTotal = 10,000 cents | Return REJECTED with reason "CODE_ALREADY_USED" |
| 5 |Invalid Case 3 (Below Minimum) (Cart subtotal is $30 when minimum is $50, or invalid negative subtotal) | cart.subtotal = 3,000 cents, customerId = "A126", code = "SAVE50" | Code "SAVE50" exists, is not expired, is active, has not been used by customer "A126", but subtotal ($30) is below the minimum spend requirement of $50. Code cannot be applied because the cart subtotal is too low. | cart.subtotal = 3,000 cents, discountAmount = 0 cents, newTotal = 3,000 cents | Return REJECTED with reason "MINIMUM_SPEND_NOT_MET" |

**Expected outcome:** TBD   
**Actual execution:** TBD  
**Match:** Yes / No  
**Discrepancy:** TBD  
**Correction:** TBD  
**Evidence:** TBD
