# Step-to-Code Mapping

**Function:** `applyDiscountCode`  
**Pseudocode Source:** `part-b/pseudocode/discount-code.md`  
**Implementation:** `part-b/implementation/discount.ts`

| Pseudocode Step # | Pseudocode Action | Code Line(s) | Verification Note |
|---|---|---|---|
| Step 1 | Validate cart subtotal > 0 | Lines 58–61 | Returns REJECTED if `subtotalAmount <= 0` |
| Step 2 | Look up code in database | Lines 63–64 | In-memory lookup in `MOCK_CODES` dictionary |
| Step 3 | Check if code exists | Lines 66–69 | Returns REJECTED with `"code does not exist"` |
| Step 4 | Check if code is active | Lines 71–74 | Returns REJECTED with `"code is disabled"` |
| Step 5 | Check expiry date | Lines 76–79 | Compares `currentDate > discount.expiryDate` |
| Step 6 | Check previous redemption | Lines 81–82 | Checks `MOCK_REDEMPTIONS` set for `customerId:code` |
| Step 7 | Branch on already used | Lines 82–84 | Returns REJECTED with `"code already used by customer"` |
| Step 8 | Check minimum spend | Lines 86–89 | Compares `subtotalAmount < minimumSpendAmount` |
| Step 9 | Calculate discount amount | Lines 91–97 | Evaluates percentage vs fixedAmount |
| Step 10 | Cap discount at subtotal | Lines 99–102 | Prevents discount from exceeding cart subtotal |
| Step 11 | Compute new total | Lines 104–105 | `subtotalAmount - discountAmount` |
| Step 12 | Return SUCCESS result | Lines 107–108 | Returns `{ status: 'SUCCESS', discountAmount, newTotal }` |