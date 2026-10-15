# C1 — AI Prompt Record

**Timestamp:** 2026-10-15T21:55:00Z  
**Model / Agent:** Gemini 3.8 Flash (Antigravity IDE)  
**Target Specification:** `part-b/pseudocode/discount-code.md`  

---

## Exact Prompt Given

```text
Implement this exactly, one function per pseudocode block, no additional behaviour.

FUNCTION applyDiscountCode

INPUTS:
- cart: object containing subtotalAmount (integer in cents/minor units), customerId (string)
- code: string, the entered coupon code
- currentDate: Date/timestamp representing when the checkout is attempted

OUTPUT:
- An object or result containing status (SUCCESS or REJECTED), discountAmount (integer), newTotal (integer), and reason (string, if rejected)

SIDE EFFECTS:
- No state changes; no database updates or modifications to cart/customer records

FAILS WHEN:
- Discount code does not exist
- Discount code has expired
- Discount code is disabled/inactive
- Cart subtotal is below the minimum spend requirement
- Customer has already redeemed this code
- Cart subtotal is zero or negative

1. IF cart subtotalAmount is less than or equal to zero
    RETURN error result: cart subtotal must be greater than zero
OTHERWISE
    continue

2. LOOK UP discount code in database (may fail or be slow)

3. IF discount code is not found in database
    RETURN rejected result: code does not exist
OTHERWISE
    continue

4. IF discount code is inactive
    RETURN rejected result: code is disabled
OTHERWISE
    continue

5. IF currentDate is after discount code expiryDate
    RETURN rejected result: code has expired
OTHERWISE
    continue

6. CHECK database to see if customerId has already redeemed this code (may fail or be slow)

7. IF customerId has already redeemed this code
    RETURN rejected result: code already used by customer
OTHERWISE
    continue

8. IF cart subtotalAmount is less than discount code minimumSpendAmount
    RETURN rejected result: minimum spend not met
OTHERWISE
    continue

9. IF discount code type is percentage
    calculate discountAmount as (cart subtotalAmount * percentage) / 100
OTHERWISE
    set discountAmount to fixedAmount

10. IF calculated discountAmount is greater than cart subtotalAmount
    set discountAmount to cart subtotalAmount
OTHERWISE
    continue

11. Calculate newTotal by subtracting discountAmount from cart subtotalAmount

12. RETURN success result with status SUCCESS, discountAmount, and newTotal
```
