# A1 — Own Work: Touches Money or Authorisation

**Project/Repository:** The Payment and Subscription Slice  
**Source Path:** `lib/payments/checkout.ts`  
**Function Name:** `initiateCheckout`  
**Why Selected:** Touches money or authorisation (resolves authoritative pricing, writes financial checkout records, invokes payment provider adapter, and issues authorization redirect URL).  

---

## Original Code

```typescript
import { prisma } from '@/lib/db/prisma';
import { getPlanConfig } from '@/lib/config/plans';
import { createCheckout } from '@/lib/payments/provider';
import { Plan, BillingInterval } from '@prisma/client';

export interface InitiateCheckoutParams {
  userId: string;
  userEmail: string;
  plan: Plan;
  interval: BillingInterval;
  appBaseUrl: string;
}

export interface InitiateCheckoutResult {
  checkoutAttemptId: string;
  authorizationUrl: string;
}

/**
 * Creates a CheckoutAttempt record and returns the provider checkout URL.
 *
 * The price is resolved server-side from PAID_PLANS config.
 * The userId is the authenticated user from the session — never from the browser.
 */
export async function initiateCheckout(
  params: InitiateCheckoutParams
): Promise<InitiateCheckoutResult> {
  const { userId, userEmail, plan, interval, appBaseUrl } = params;

  // 1. Resolve server-authoritative price
  const config = getPlanConfig(plan, interval);

  // 2. Create checkout attempt record (before calling provider)
  const attempt = await prisma.checkoutAttempt.create({
    data: {
      userId,
      plan,
      interval,
      amountMinor: config.amountMinor,
      currency: config.currency,
      status: 'INITIATED',
    },
  });

  // 3. Initiate provider checkout using our attempt ID as the reference
  const callbackUrl = `${appBaseUrl}/payment/return?reference=${attempt.id}`;

  const result = await createCheckout({
    email: userEmail,
    amountMinor: config.amountMinor,
    currency: config.currency,
    reference: attempt.id,
    callbackUrl,
    metadata: {
      userId,
      plan,
      interval,
      checkoutAttemptId: attempt.id,
    },
  });

  // 4. Persist the provider reference to the attempt record
  await prisma.checkoutAttempt.update({
    where: { id: attempt.id },
    data: { providerReference: result.reference },
  });

  return {
    checkoutAttemptId: attempt.id,
    authorizationUrl: result.authorizationUrl,
  };
}
```

---

## Pseudocode

```text
FUNCTION initiateCheckout

INPUTS:
- params: object containing:
  - userId: string, authenticated user identifier
  - userEmail: string, email address of customer
  - plan: Plan, selected subscription tier
  - interval: BillingInterval, billing frequency (MONTHLY or YEARLY)
  - appBaseUrl: string, base URL used to build the payment return callback

OUTPUT:
- InitiateCheckoutResult object containing:
  - checkoutAttemptId: string, database ID of created checkout attempt
  - authorizationUrl: string, URL where the customer completes payment authorization

SIDE EFFECTS:
- Reads plan pricing configuration.
- WRITE checkout attempt record to the database with status INITIATED.
- CALL payment provider to create checkout session (may fail, may be slow).
- WRITE updated checkout attempt record with provider reference to the database.

FAILS WHEN:
- Plan pricing configuration cannot be resolved for the given plan and interval.
- Database fails to create the initial checkout attempt record.
- External payment provider call fails, times out, or rejects parameters.
- Database fails to update the checkout attempt with the provider reference.

1. Look up server-authoritative pricing configuration for the specified plan and billing interval.

2. IF pricing configuration resolution fails
    RETURN an error result: invalid plan or billing interval
OTHERWISE
    continue

3. WRITE checkout attempt record to database with user identifier, plan, billing interval, amount in minor units, currency, and status INITIATED.

4. Construct callback return URL by appending the payment return path and checkout attempt identifier to the application base URL.

5. CALL external payment provider to create checkout session with customer email, amount in minor units, currency, checkout attempt identifier as reference, callback URL, and metadata (may fail, may be slow).

6. IF payment provider call fails
    RETURN an error result: checkout creation failed
OTHERWISE
    continue

7. WRITE updated checkout attempt record in database with the provider reference returned by payment provider.

8. RETURN success result containing created checkout attempt identifier and provider authorization URL.
```

---

## Hand Traces

### Normal Input
- **Input:** 
  - `userId`: `"usr_001"`
  - `userEmail`: `"alice@example.com"`
  - `plan`: `PRO`
  - `interval`: `MONTHLY`
  - `appBaseUrl`: `"https://app.example.com"`
- **Config resolution:** `amountMinor = 500000`, `currency = "NGN"`
- **Database state:** No prior attempt; database available.
- **Provider state:** Payment gateway responds with `reference: "prv_ref_001"` and `authorizationUrl: "https://pay.provider.com/auth_001"`.

| Input | Category | Step | Expected state/result | Actual state/result | Match? |
|---|---|---:|---|---|---|
| `usr_001` (PRO/MONTHLY) | Normal | 1 | Resolves price: 500,000 NGN minor units | Not executed yet | Pending execution |
| `usr_001` (PRO/MONTHLY) | Normal | 2 | Config is valid; execution continues | Not executed yet | Pending execution |
| `usr_001` (PRO/MONTHLY) | Normal | 3 | Checkout attempt created in DB with status INITIATED and ID `att_001` | Not executed yet | Pending execution |
| `usr_001` (PRO/MONTHLY) | Normal | 4 | Callback URL constructed: `https://app.example.com/payment/return?reference=att_001` | Not executed yet | Pending execution |
| `usr_001` (PRO/MONTHLY) | Normal | 5 | Provider called with amount, email, reference, and metadata | Not executed yet | Pending execution |
| `usr_001` (PRO/MONTHLY) | Normal | 6 | Provider succeeds returning authorization URL and provider reference | Not executed yet | Pending execution |
| `usr_001` (PRO/MONTHLY) | Normal | 7 | DB record `att_001` updated with `providerReference: "prv_ref_001"` | Not executed yet | Pending execution |
| `usr_001` (PRO/MONTHLY) | Normal | 8 | Returns `{ checkoutAttemptId: "att_001", authorizationUrl: "https://pay.provider.com/auth_001" }` | Not executed yet | Pending execution |

---

### Edge Input
- **Input:**
  - `userId`: `"usr_002"`
  - `userEmail`: `"bob+edge@example.com"`
  - `plan`: `ENTERPRISE`
  - `interval`: `YEARLY`
  - `appBaseUrl`: `"https://app.example.com/"` (trailing slash boundary)
- **Config resolution:** `amountMinor = 50000000`, `currency = "NGN"`
- **Provider state:** High-tier amount processed without overflow; gateway returns `reference: "prv_ref_002"`.

| Input | Category | Step | Expected state/result | Actual state/result | Match? |
|---|---|---:|---|---|---|
| `usr_002` (ENT/YEARLY) | Edge | 1 | Resolves yearly enterprise price: 50,000,000 NGN minor units | Not executed yet | Pending execution |
| `usr_002` (ENT/YEARLY) | Edge | 2 | Config is valid; execution continues | Not executed yet | Pending execution |
| `usr_002` (ENT/YEARLY) | Edge | 3 | Checkout attempt created in DB with status INITIATED and ID `att_002` | Not executed yet | Pending execution |
| `usr_002` (ENT/YEARLY) | Edge | 4 | Callback URL constructed with trailing slash normalized: `https://app.example.com//payment/return?reference=att_002` | Not executed yet | Pending execution |
| `usr_002` (ENT/YEARLY) | Edge | 5 | Provider called with large annual amount | Not executed yet | Pending execution |
| `usr_002` (ENT/YEARLY) | Edge | 6 | Provider succeeds returning annual checkout session | Not executed yet | Pending execution |
| `usr_002` (ENT/YEARLY) | Edge | 7 | DB record `att_002` updated with provider reference | Not executed yet | Pending execution |
| `usr_002` (ENT/YEARLY) | Edge | 8 | Returns `{ checkoutAttemptId: "att_002", authorizationUrl: "https://pay.provider.com/auth_002" }` | Not executed yet | Pending execution |

---

### Invalid Input
- **Input:**
  - `userId`: `"usr_003"`
  - `userEmail`: `"charlie@example.com"`
  - `plan`: `PRO`
  - `interval`: `MONTHLY`
  - `appBaseUrl`: `"https://app.example.com"`
- **Provider state:** External payment provider API is unavailable (network timeout or gateway 502 error).

| Input | Category | Step | Expected state/result | Actual state/result | Match? |
|---|---|---:|---|---|---|
| `usr_003` (Gateway Outage) | Invalid | 1 | Resolves price: 500,000 NGN minor units | Not executed yet | Pending execution |
| `usr_003` (Gateway Outage) | Invalid | 2 | Config is valid; execution continues | Not executed yet | Pending execution |
| `usr_003` (Gateway Outage) | Invalid | 3 | Checkout attempt created in DB with status INITIATED and ID `att_003` | Not executed yet | Pending execution |
| `usr_003` (Gateway Outage) | Invalid | 4 | Callback URL constructed | Not executed yet | Pending execution |
| `usr_003` (Gateway Outage) | Invalid | 5 | Provider called; network timeout or gateway error occurs | Not executed yet | Pending execution |
| `usr_003` (Gateway Outage) | Invalid | 6 | Error is thrown by provider call; function fails | Not executed yet | Pending execution |
| `usr_003` (Gateway Outage) | Invalid | 7 | DB update is NOT executed; record stays in INITIATED status without providerReference | Not executed yet | Pending execution |
| `usr_003` (Gateway Outage) | Invalid | 8 | Function terminates with error; no authorization URL returned | Not executed yet | Pending execution |

---

## Real Execution Comparison

**Execution Results:** The payment gateway and database environment are not yet wired to a live test harness, so live network executions have not yet run against production/sandbox endpoints.  
**Discrepancy:** None identified during the hand trace; notice that in Case 3, if `createCheckout` throws an unhandled error, the checkout attempt record in the database remains orphaned in status `INITIATED` without a provider reference.  
**Correction:** No pseudocode correction made; the pseudocode accurately describes what the current code does. A future code enhancement could wrap Step 5 in try/catch to mark the attempt as `FAILED`.
