# C2 Reverse-Engineered Pseudocode

**Source:** `part-c/ai-implementation/discount.ts`  
**Notice:** This pseudocode must be reverse-engineered directly from reading the AI implementation code without referencing the original B1 pseudocode.

---

```text
FUNCTION applyDiscountCode

INPUTS:
- cart: object containing subtotalAmount (number), customerId (string)
- code: string
- currentDate: Date

OUTPUT:
- DiscountResult object containing status (SUCCESS or REJECTED), discountAmount (number), newTotal (number), reason (optional string)

SIDE EFFECTS:
- Reads DISCOUNT_CODES_DB and REDEEMED_CODES_DB

FAILS WHEN:
- cart subtotalAmount <= 0
- code not in DISCOUNT_CODES_DB
- discountCode isActive is false
- currentDate > discountCode expiryDate
- customerId:discountCode.code in REDEEMED_CODES_DB
- cart subtotalAmount < discountCode minimumSpendAmount

1. ...
```
