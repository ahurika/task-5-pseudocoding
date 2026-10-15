# A1 — Own Work: Handles an Error

**Project/Repository:** The Payment and Subscription Slice  
**Source Path:** `lib/payments/verification.ts`  
**Function Name:** `verifyCheckoutPayment`  
**Why Selected:** Handles an error (implements defensive error handling across three layers: missing database attempt records, external payment gateway exceptions caught via try/catch, and downstream provider business failures like declined or abandoned transactions).  

---

## Original Code

```typescript
import { prisma } from '@/lib/db/prisma';
import { verifyPayment } from '@/lib/payments/provider';
import { Plan, BillingInterval, PaymentEventType, PaymentEventStatus } from '@prisma/client';

export interface VerificationResult {
  verified: boolean;
  reference: string;
  amountMinor: number;
  currency: string;
  plan: Plan | null;
  interval: BillingInterval | null;
  userId: string | null;
  reason?: string;
}

/**
 * Verifies a payment by its reference (the CheckoutAttempt.id used as the
 * Paystack reference).
 *
 * Steps:
 * 1. Look up the CheckoutAttempt to retrieve userId, plan, interval, and
 *    server-authoritative expected amount.
 * 2. Call the provider adapter to verify the transaction.
 * 3. Record a VERIFICATION PaymentLog event.
 * 4. Return the result — the caller decides whether to fulfil.
 *
 * This function does NOT fulfil the subscription.
 * Fulfilment is handled by the subscription service after this returns verified=true.
 */
export async function verifyCheckoutPayment(reference: string): Promise<VerificationResult> {
  // 1. Look up the checkout attempt
  const attempt = await prisma.checkoutAttempt.findUnique({
    where: { id: reference },
  });

  if (!attempt) {
    return {
      verified: false,
      reference,
      amountMinor: 0,
      currency: '',
      plan: null,
      interval: null,
      userId: null,
      reason: 'Checkout attempt not found',
    };
  }

  // 2. Call provider to verify
  let providerResult;
  try {
    providerResult = await verifyPayment(reference);
  } catch (err) {
    // Record failure
    await recordPaymentEvent({
      userId: attempt.userId,
      reference,
      eventType: PaymentEventType.VERIFICATION,
      status: PaymentEventStatus.FAILED,
      amountMinor: attempt.amountMinor,
      currency: attempt.currency,
      plan: attempt.plan,
      interval: attempt.interval,
      metadata: { error: err instanceof Error ? err.message : String(err) },
    });

    return {
      verified: false,
      reference,
      amountMinor: attempt.amountMinor,
      currency: attempt.currency,
      plan: attempt.plan,
      interval: attempt.interval,
      userId: attempt.userId,
      reason: 'Provider verification request failed',
    };
  }

  const amountMatches = providerResult.amountMinor >= attempt.amountMinor;
  const verified = providerResult.status === 'success' && amountMatches;

  // 3. Record verification event
  await recordPaymentEvent({
    userId: attempt.userId,
    reference,
    eventType: PaymentEventType.VERIFICATION,
    status: verified ? PaymentEventStatus.SUCCESS : PaymentEventStatus.FAILED,
    amountMinor: providerResult.amountMinor,
    currency: providerResult.currency,
    plan: attempt.plan,
    interval: attempt.interval,
    metadata: {
      providerStatus: providerResult.status,
      paidAt: providerResult.paidAt?.toISOString() ?? null,
      expectedAmountMinor: attempt.amountMinor,
    },
  });

  if (!verified) {
    const reason = providerResult.status !== 'success'
      ? `Provider status: ${providerResult.status}`
      : `Amount mismatch: expected at least ${attempt.amountMinor}, got ${providerResult.amountMinor}`;

    return {
      verified: false,
      reference,
      amountMinor: attempt.amountMinor,
      currency: attempt.currency,
      plan: attempt.plan,
      interval: attempt.interval,
      userId: attempt.userId,
      reason,
    };
  }

  return {
    verified: true,
    reference,
    amountMinor: providerResult.amountMinor,
    currency: providerResult.currency,
    plan: attempt.plan,
    interval: attempt.interval,
    userId: attempt.userId,
  };
}
```

---

## Pseudocode

```text
FUNCTION verifyCheckoutPayment

INPUTS:
- reference: string, unique checkout attempt identifier used as provider reference

OUTPUT:
- VerificationResult object containing:
  - verified: boolean, indicating whether payment verification succeeded
  - reference: string, checkout reference
  - amountMinor: integer, amount paid or expected in minor units
  - currency: string, ISO currency code
  - plan: Plan or null, associated subscription plan
  - interval: BillingInterval or null, associated billing frequency
  - userId: string or null, user identifier
  - reason: optional string, descriptive reason for failure

SIDE EFFECTS:
- Reads checkout attempt records from the database.
- CALL external payment provider to verify transaction status (may fail, may be slow).
- WRITE verification event to payment log in database with status SUCCESS or FAILED.

FAILS WHEN:
- Database read fails when looking up checkout attempt.
- Database write fails when recording payment log event.
- External payment provider status is not "success".
- Provider amount is less than expected checkout attempt amount.

1. LOOK UP checkout attempt in database by reference.

2. IF checkout attempt does not exist
    RETURN failure result with verified false, zero amount, empty currency, null plan, interval, and user, and reason "Checkout attempt not found"
OTHERWISE
    continue

3. CALL external payment provider to verify payment for reference (may fail, may be slow).

4. IF payment provider verification call throws an error
    WRITE payment event to database with status FAILED and error message in metadata
    RETURN failure result with verified false, checkout attempt amount, currency, plan, interval, user, and reason "Provider verification request failed"
OTHERWISE
    continue

5. Check whether the provider response status equals "success" AND provider amount is at least expected checkout attempt amount.

6. WRITE payment event to database with provider amount, currency, plan, interval, expected amount metadata, and status SUCCESS if both conditions hold or status FAILED otherwise.

7. IF provider status does not equal "success" OR provider amount is less than expected amount
    determine reason based on whether provider status failed or amount mismatched
    RETURN failure result with verified false, checkout attempt amount, currency, plan, interval, user, and failure reason
OTHERWISE
    continue

8. RETURN success result with verified true, reference, provider amount, provider currency, plan, interval, and user identifier.
```

---

## Hand Traces

### Normal Input (Successful Verification)
- **Input:** `reference: "att_succ_001"`
- **Database state:** Attempt exists (`userId: "usr_010"`, `plan: PRO`, `interval: MONTHLY`, `amountMinor: 500000`, `currency: "NGN"`).
- **Provider state:** Returns `{ status: "success", amountMinor: 500000, currency: "NGN", paidAt: 2026-10-15T12:00:00Z }`.

| Input | Category | Step | Expected state/result | Actual state/result | Match? |
|---|---|---:|---|---|---|
| `att_succ_001` (Success) | Normal | 1 | Queries DB for attempt `att_succ_001` | Not executed yet | Pending execution |
| `att_succ_001` (Success) | Normal | 2 | Attempt found; continue execution | Not executed yet | Pending execution |
| `att_succ_001` (Success) | Normal | 3 | Calls provider to verify reference | Not executed yet | Pending execution |
| `att_succ_001` (Success) | Normal | 4 | No exception thrown; continue | Not executed yet | Pending execution |
| `att_succ_001` (Success) | Normal | 5 | Evaluates `status === "success"` (true) | Not executed yet | Pending execution |
| `att_succ_001` (Success) | Normal | 6 | Writes payment event with status SUCCESS | Not executed yet | Pending execution |
| `att_succ_001` (Success) | Normal | 7 | `!verified` is false; continue | Not executed yet | Pending execution |
| `att_succ_001` (Success) | Normal | 8 | Returns `{ verified: true, reference: "att_succ_001", amountMinor: 500000, ... }` | Not executed yet | Pending execution |

---

### Edge Input (Provider Business Rejection: Abandoned / Declined)
- **Input:** `reference: "att_declined_002"`
- **Database state:** Attempt exists (`userId: "usr_011"`, `plan: PRO`, `interval: MONTHLY`, `amountMinor: 500000`, `currency: "NGN"`).
- **Provider state:** Customer closed checkout window; provider responds with `{ status: "abandoned", amountMinor: 500000, currency: "NGN" }`.

| Input | Category | Step | Expected state/result | Actual state/result | Match? |
|---|---|---:|---|---|---|
| `att_declined_002` (Abandoned) | Edge | 1 | Queries DB for attempt `att_declined_002` | Not executed yet | Pending execution |
| `att_declined_002` (Abandoned) | Edge | 2 | Attempt found; continue execution | Not executed yet | Pending execution |
| `att_declined_002` (Abandoned) | Edge | 3 | Calls provider to verify reference | Not executed yet | Pending execution |
| `att_declined_002` (Abandoned) | Edge | 4 | Provider responded (no exception); continue | Not executed yet | Pending execution |
| `att_declined_002` (Abandoned) | Edge | 5 | Evaluates `status === "success"` (false) | Not executed yet | Pending execution |
| `att_declined_002` (Abandoned) | Edge | 6 | Writes payment event with status FAILED and metadata `{ providerStatus: "abandoned" }` | Not executed yet | Pending execution |
| `att_declined_002` (Abandoned) | Edge | 7 | `!verified` is true; returns failure result with reason `"Provider status: abandoned"` | Not executed yet | Pending execution |
| `att_declined_002` (Abandoned) | Edge | 8 | Step 8 is skipped due to early exit at Step 7 | Not executed yet | Pending execution |

---

### Invalid Input (Provider Network Outage / Exception)
- **Input:** `reference: "att_err_003"`
- **Database state:** Attempt exists (`userId: "usr_012"`, `plan: PRO`, `interval: MONTHLY`, `amountMinor: 500000`, `currency: "NGN"`).
- **Provider state:** Provider API is down; `verifyPayment("att_err_003")` throws network timeout `Error("ETIMEDOUT")`.

| Input | Category | Step | Expected state/result | Actual state/result | Match? |
|---|---|---:|---|---|---|
| `att_err_003` (Network Error) | Invalid | 1 | Queries DB for attempt `att_err_003` | Not executed yet | Pending execution |
| `att_err_003` (Network Error) | Invalid | 2 | Attempt found; continue execution | Not executed yet | Pending execution |
| `att_err_003` (Network Error) | Invalid | 3 | Calls provider to verify reference | Not executed yet | Pending execution |
| `att_err_003` (Network Error) | Invalid | 4 | Provider throws `ETIMEDOUT`; try/catch intercepts, logs FAILED event with error, and returns failure result | Not executed yet | Pending execution |
| `att_err_003` (Network Error) | Invalid | 5 | Skipped (early exit at Step 4) | Not executed yet | Pending execution |
| `att_err_003` (Network Error) | Invalid | 6 | Skipped (early exit at Step 4) | Not executed yet | Pending execution |
| `att_err_003` (Network Error) | Invalid | 7 | Skipped (early exit at Step 4) | Not executed yet | Pending execution |
| `att_err_003` (Network Error) | Invalid | 8 | Skipped (early exit at Step 4) | Not executed yet | Pending execution |

---

## Real Execution Comparison

**Execution Results:** The live database and payment provider endpoints are pending execution in a dedicated test suite.  
**Discrepancy:** None between code logic and pseudocode. Notice that in the "attempt not found" error path (Step 2), no payment event is logged because there is no `userId` or amount available to construct a valid payment log row. In contrast, network timeouts (Step 4) and non-success statuses (Step 6) both write audit log rows.  
**Correction:** No correction needed; the pseudocode accurately captures the three error boundaries.
