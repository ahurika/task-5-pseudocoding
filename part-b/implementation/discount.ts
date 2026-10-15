export interface Cart {
  subtotalAmount: number; // in cents
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

// In-memory mock database matching your 5 test cases
export const MOCK_CODES: Record<string, DiscountCodeRecord> = {
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
    expiryDate: new Date('2026-10-01'), // Expired
    minimumSpendAmount: 5000,
    type: 'percentage',
    percentage: 10,
  },
};

// In-memory customer redemptions (customerId:code)
export const MOCK_REDEMPTIONS = new Set<string>(['A123:SALE10']);

/**
 * Applies a discount code to a cart according to the 12 pseudocode steps.
 */
export function applyDiscountCode(cart: Cart, code: string, currentDate: Date): DiscountResult {
  // Step 1: Validate cart subtotal
  if (cart.subtotalAmount <= 0) {
    return {
      status: 'REJECTED',
      discountAmount: 0,
      newTotal: cart.subtotalAmount,
      reason: 'cart subtotal must be greater than zero',
    };
  }

  // Step 2: Look up discount code in database
  const discount = MOCK_CODES[code.toUpperCase()];

  // Step 3: Check if discount code exists
  if (!discount) {
    return {
      status: 'REJECTED',
      discountAmount: 0,
      newTotal: cart.subtotalAmount,
      reason: 'code does not exist',
    };
  }

  // Step 4: Check if discount code is active
  if (!discount.isActive) {
    return {
      status: 'REJECTED',
      discountAmount: 0,
      newTotal: cart.subtotalAmount,
      reason: 'code is disabled',
    };
  }

  // Step 5: Check expiry date
  if (currentDate > discount.expiryDate) {
    return {
      status: 'REJECTED',
      discountAmount: 0,
      newTotal: cart.subtotalAmount,
      reason: 'code has expired',
    };
  }

  // Step 6 & 7: Check if customer has already redeemed this code
  if (MOCK_REDEMPTIONS.has(`${cart.customerId}:${discount.code}`)) {
    return {
      status: 'REJECTED',
      discountAmount: 0,
      newTotal: cart.subtotalAmount,
      reason: 'code already used by customer',
    };
  }

  // Step 8: Check minimum spend
  if (cart.subtotalAmount < discount.minimumSpendAmount) {
    return {
      status: 'REJECTED',
      discountAmount: 0,
      newTotal: cart.subtotalAmount,
      reason: 'minimum spend not met',
    };
  }

  // Step 9: Calculate discount amount based on type
  let discountAmount = 0;
  if (discount.type === 'percentage') {
    discountAmount = Math.round((cart.subtotalAmount * (discount.percentage ?? 0)) / 100);
  } else {
    discountAmount = discount.fixedAmount ?? 0;
  }

  // Step 10: Cap discount amount at cart subtotal
  if (discountAmount > cart.subtotalAmount) {
    discountAmount = cart.subtotalAmount;
  }

  // Step 11: Compute new total
  const newTotal = cart.subtotalAmount - discountAmount;

  // Step 12: Return success result
  return {
    status: 'SUCCESS',
    discountAmount,
    newTotal,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Test runner for the 5 hand-traced test cases
// ─────────────────────────────────────────────────────────────────────────────
export function runTests(): void {
  const cases = [
    {
      id: 1,
      category: 'Normal',
      cart: { subtotalAmount: 10000, customerId: 'A121' },
      code: 'SALE10',
      date: new Date('2026-10-15'),
      expected: 'SUCCESS, discount: 1000, newTotal: 9000',
    },
    {
      id: 2,
      category: 'Edge (Exact Threshold)',
      cart: { subtotalAmount: 5000, customerId: 'A124' },
      code: 'SAVE50',
      date: new Date('2026-10-15'),
      expected: 'SUCCESS, discount: 500, newTotal: 4500',
    },
    {
      id: 3,
      category: 'Invalid (Expired)',
      cart: { subtotalAmount: 10000, customerId: 'A125' },
      code: 'EXPIRED10',
      date: new Date('2026-10-15'),
      expected: 'REJECTED: code has expired',
    },
    {
      id: 4,
      category: 'Invalid (Already Used)',
      cart: { subtotalAmount: 10000, customerId: 'A123' },
      code: 'SALE10',
      date: new Date('2026-10-15'),
      expected: 'REJECTED: code already used by customer',
    },
    {
      id: 5,
      category: 'Invalid (Below Minimum)',
      cart: { subtotalAmount: 3000, customerId: 'A126' },
      code: 'SAVE50',
      date: new Date('2026-10-15'),
      expected: 'REJECTED: minimum spend not met',
    },
  ];

  console.log('=== RUNNING 5 HAND-TRACED CASES ===\n');
  for (const tc of cases) {
    const result = applyDiscountCode(tc.cart, tc.code, tc.date);
    console.log(`Case ${tc.id} (${tc.category}):`);
    console.log(`  Expected: ${tc.expected}`);
    console.log(`  Actual:   status=${result.status}, discountAmount=${result.discountAmount}, newTotal=${result.newTotal}, reason=${result.reason ?? 'none'}`);
  }
}

runTests();
