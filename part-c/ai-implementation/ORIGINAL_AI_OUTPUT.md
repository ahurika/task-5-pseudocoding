# C1 — Original AI Output

**Agent/Model:** Gemini 3.8 Flash (Antigravity IDE)  
**Generation Timestamp:** 2026-10-15T21:55:00Z  
**Instruction:** `Implement this exactly, one function per pseudocode block, no additional behaviour.`  

---

## Generated Code

```typescript
export interface Cart {
  subtotalAmount: number;
  customerId: string;
}

export interface DiscountCodeRecord {
  code: string;
  isActive: boolean;
  expiryDate: Date;
  minimumSpendAmount: number;
  type: 'percentage' | 'fixed';
  percentage?: number;
  fixedAmount?: number;
}

export interface DiscountResult {
  status: 'SUCCESS' | 'REJECTED';
  discountAmount: number;
  newTotal: number;
  reason?: string;
}

// In-memory mock database representations for lookups (Step 2 and Step 6)
export const DISCOUNT_CODES_DB: Record<string, DiscountCodeRecord> = {
  SALE10: {
    code: 'SALE10',
    isActive: true,
    expiryDate: new Date('2026-12-31'),
    minimumSpendAmount: 5000,
    type: 'percentage',
    percentage: 10,
  },
  SAVE50: {
    code: 'SAVE50',
    isActive: true,
    expiryDate: new Date('2026-12-31'),
    minimumSpendAmount: 5000,
    type: 'percentage',
    percentage: 10,
  },
  EXPIRED10: {
    code: 'EXPIRED10',
    isActive: true,
    expiryDate: new Date('2026-10-01'),
    minimumSpendAmount: 5000,
    type: 'percentage',
    percentage: 10,
  },
};

export const REDEEMED_CODES_DB = new Set<string>(['A123:SALE10']);

/**
 * Implements applyDiscountCode strictly from the B1 pseudocode specification.
 * One function per pseudocode block, no additional behaviour.
 */
export function applyDiscountCode(
  cart: Cart,
  code: string,
  currentDate: Date
): DiscountResult {
  // 1. IF cart subtotalAmount is less than or equal to zero
  if (cart.subtotalAmount <= 0) {
    return {
      status: 'REJECTED',
      discountAmount: 0,
      newTotal: cart.subtotalAmount,
      reason: 'cart subtotal must be greater than zero',
    };
  }

  // 2. LOOK UP discount code in database
  const discountCode = DISCOUNT_CODES_DB[code];

  // 3. IF discount code is not found in database
  if (!discountCode) {
    return {
      status: 'REJECTED',
      discountAmount: 0,
      newTotal: cart.subtotalAmount,
      reason: 'code does not exist',
    };
  }

  // 4. IF discount code is inactive
  if (!discountCode.isActive) {
    return {
      status: 'REJECTED',
      discountAmount: 0,
      newTotal: cart.subtotalAmount,
      reason: 'code is disabled',
    };
  }

  // 5. IF currentDate is after discount code expiryDate
  if (currentDate > discountCode.expiryDate) {
    return {
      status: 'REJECTED',
      discountAmount: 0,
      newTotal: cart.subtotalAmount,
      reason: 'code has expired',
    };
  }

  // 6. CHECK database to see if customerId has already redeemed this code
  const hasRedeemed = REDEEMED_CODES_DB.has(`${cart.customerId}:${discountCode.code}`);

  // 7. IF customerId has already redeemed this code
  if (hasRedeemed) {
    return {
      status: 'REJECTED',
      discountAmount: 0,
      newTotal: cart.subtotalAmount,
      reason: 'code already used by customer',
    };
  }

  // 8. IF cart subtotalAmount is less than discount code minimumSpendAmount
  if (cart.subtotalAmount < discountCode.minimumSpendAmount) {
    return {
      status: 'REJECTED',
      discountAmount: 0,
      newTotal: cart.subtotalAmount,
      reason: 'minimum spend not met',
    };
  }

  // 9. IF discount code type is percentage
  let discountAmount = 0;
  if (discountCode.type === 'percentage') {
    discountAmount = (cart.subtotalAmount * (discountCode.percentage ?? 0)) / 100;
  } else {
    discountAmount = discountCode.fixedAmount ?? 0;
  }

  // 10. IF calculated discountAmount is greater than cart subtotalAmount
  if (discountAmount > cart.subtotalAmount) {
    discountAmount = cart.subtotalAmount;
  }

  // 11. Calculate newTotal by subtracting discountAmount from cart subtotalAmount
  const newTotal = cart.subtotalAmount - discountAmount;

  // 12. RETURN success result with status SUCCESS, discountAmount, and newTotal
  return {
    status: 'SUCCESS',
    discountAmount,
    newTotal,
  };
}
```
