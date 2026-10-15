# A1 — Own Work: Most Complex

**Project/Repository:** The Payment and Subscription Slice
**Source Path:** lib/payments/webhook.ts
**Function Name:** processWebhook
**Why Selected:** Most complex  

## Original Code
```
export async function processWebhook(
  rawBody: Buffer,
  signature: string
): Promise<WebhookProcessResult> {
  // ── Step 1: Verify signature ─────────────────────────────────────────────
  let isValid: boolean;
  try {
    isValid = verifyWebhookSignature(rawBody, signature);
  } catch (err) {
    return { outcome: 'error', message: err instanceof Error ? err.message : String(err) };
  }

  if (!isValid) {
    return { outcome: 'invalid_signature' };
  }

  // ── Step 2: Parse event ──────────────────────────────────────────────────
  let webhookEvent;
  try {
    webhookEvent = parseWebhookEvent(rawBody);
  } catch (err) {
    return { outcome: 'error', message: err instanceof Error ? err.message : String(err) };
  }

  // Only process charge.success events for now
  if (webhookEvent.event !== 'charge.success') {
    return { outcome: 'unsupported_event', event: webhookEvent.event };
  }

  const { reference } = webhookEvent;

  // ── Step 3: Idempotency check ────────────────────────────────────────────
  const alreadyFulfilled = await isFulfilmentAlreadyProcessed(reference);
  if (alreadyFulfilled) {
    // Record the duplicate delivery but do NOT fulfil again
    await recordDuplicate(reference, webhookEvent.amountMinor, webhookEvent.currency);
    return { outcome: 'duplicate', reference };
  }

  // ── Step 4: Look up checkout attempt to get userId, plan, interval ───────
  const attempt = await prisma.checkoutAttempt.findUnique({
    where: { id: reference },
  });

  if (!attempt) {
    return {
      outcome: 'verification_failed',
      reference,
      reason: 'Checkout attempt not found for this reference',
    };
  }

  // ── Step 5: Record the webhook event in the payment log ──────────────────
  await recordPaymentEvent({
    userId: attempt.userId,
    reference,
    eventType: PaymentEventType.VERIFICATION,
    status: PaymentEventStatus.SUCCESS,
    amountMinor: webhookEvent.amountMinor,
    currency: webhookEvent.currency,
    plan: attempt.plan,
    interval: attempt.interval,
    metadata: {
      event: webhookEvent.event,
      paidAt: webhookEvent.paidAt?.toISOString() ?? null,
      source: 'webhook',
    },
  });

  // ── Step 6: Fulfil subscription ──────────────────────────────────────────
  try {
    await fulfilSubscription({
      userId: attempt.userId,
      reference,
      plan: attempt.plan as Plan,
      interval: attempt.interval as BillingInterval,
      amountMinor: attempt.amountMinor,
      currency: attempt.currency,
      paidAt: webhookEvent.paidAt ?? new Date(),
    });
  } catch (err) {
    await recordPaymentEvent({
      userId: attempt.userId,
      reference,
      eventType: PaymentEventType.FAILURE,
      status: PaymentEventStatus.FAILED,
      amountMinor: attempt.amountMinor,
      currency: attempt.currency,
      plan: attempt.plan,
      interval: attempt.interval,
      metadata: { error: err instanceof Error ? err.message : String(err) },
    });

    return {
      outcome: 'error',
      message: `Fulfilment failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  // Update checkout attempt status
  await prisma.checkoutAttempt.update({
    where: { id: reference },
    data: { status: 'COMPLETED' },
  });

  return { outcome: 'fulfilled', reference };
}

```

## Pseudocode
FUNCTION processWebhook

INPUTS:
- rawBody: Buffer, containing the raw webhook request body
- signature: string, containing the webhook signature

OUTPUT:
-WebhookProcessResult describing the outcome of processing the webhook

SIDE EFFECTS:
- Reads checkout and payment records from the database.
- Writes payment event records to the database.
- May fulfil a subscription.
- May update the checkout attempt status.
- May record a duplicate webhook delivery.

FAILS WHEN:
- Signature verification throws an error
- The webhook signature is invalid
- Parsing the webhook event throws an error
- The webhook event is not a charge.success event
- The checkout attempt does not exist for the payment reference
- Subscription fulfilment throws an error

1. Verify the webhook signature using the raw body and signature.

2. If signature verification causes an error
    RETURN an error result.

3. If the signature is not valid
    RETURN an invalid-signature result.

4. Parse the raw webhook body into a webhook event.

5. If parsing causes an error
    RETURN an error result.

6. Check whether the webhook event is a charge.success event.

7. If the event is not a charge.success event
    RETURN an unsupported-event result.

8. Get the payment reference from the webhook event.

9. Check whether fulfilment for the payment reference has already been processed.

10. IF fulfilment has already been processed
    record the duplicate webhook delivery
    RETURN a duplicate result.

11. Find the checkout attempt using the payment reference.

12. IF the checkout attempt does not exist
    RETURN a verification-failed result.

13. Record the successful webhook verification in the payment log.

14. Attempt to fulfil the subscription using the checkout and webhook payment information.

15. IF subscription fulfilment fails
    record the fulfilment failure in the payment log
    RETURN an error result.

16. Update the checkout attempt status to COMPLETED.

17. RETURN a fulfilled result containing the payment reference.

## Hand Traces

### Normal Input
- **Input:** Reference:
TEST-WEBHOOK-NORMAL-001

User ID:
test-user-001

Plan:
PRO

Interval:
MONTHLY

Amount:
500000

Currency:
NGN

Checkout status:
PENDING

Webhook event:
charge.success

Signature:
valid

- **Trace Table:**

| Input | Category | Step | Expected state/result | Actual state/result | Match? |
TEST-WEBHOOK-NORMAL-001	Normal	1	Signature is verified successfully	Not executed yet	Pending execution
TEST-WEBHOOK-NORMAL-001	Normal	2	Webhook event is parsed successfully	Not executed yet	Pending execution
TEST-WEBHOOK-NORMAL-001	Normal	3	Event is charge.success	Not executed yet	Pending execution
TEST-WEBHOOK-NORMAL-001	Normal	4	No previous fulfilment exists	Not executed yet	Pending execution
TEST-WEBHOOK-NORMAL-001	Normal	5	Checkout attempt is found	Not executed yet	Pending execution
TEST-WEBHOOK-NORMAL-001	Normal	6	Verification event is recorded	Not executed yet	Pending execution
TEST-WEBHOOK-NORMAL-001	Normal	7	Subscription is fulfilled	Not executed yet	Pending execution
TEST-WEBHOOK-NORMAL-001	Normal	8	Checkout attempt status becomes COMPLETED	Not executed yet	Pending execution
TEST-WEBHOOK-NORMAL-001	Normal	9	Function returns fulfilled with the reference	Not executed yet	Pending execution

### Edge Input
- **Input:** 

Reference:
TEST-WEBHOOK-DUPLICATE-001

Webhook event:
charge.success

Signature:
valid

Previous fulfilment:
Already exists for this reference

- **Trace Table:**

| Input | Category | Step | Expected state/result | Actual state/result | Match? |
TEST-WEBHOOK-DUPLICATE-001	Edge	1	Signature is verified successfully	Not executed yet	Pending execution
TEST-WEBHOOK-DUPLICATE-001	Edge	2	Webhook event is parsed successfully	Not executed yet	Pending execution
TEST-WEBHOOK-DUPLICATE-001	Edge	3	Event is charge.success	Not executed yet	Pending execution
TEST-WEBHOOK-DUPLICATE-001	Edge	4	Existing fulfilment is detected	Not executed yet	Pending execution
TEST-WEBHOOK-DUPLICATE-001	Edge	5	Duplicate webhook delivery is recorded	Not executed yet	Pending execution
TEST-WEBHOOK-DUPLICATE-001	Edge	6	Subscription is not fulfilled again	Not executed yet	Pending execution
TEST-WEBHOOK-DUPLICATE-001	Edge	7	Function returns duplicate with the reference	Not executed yet	Pending execution

### Invalid Input
- **Input:** 

Reference: TEST-WEBHOOK-INVALID-001
Webhook event: charge.failure
Signature: invalid-signature

- **Trace Table:**

| Input | Category | Step | Expected state/result | Actual state/result | Match? |
TEST-WEBHOOK-INVALID-001	Invalid	1	Signature verification fails	Not executed yet	Pending execution
TEST-WEBHOOK-INVALID-001	Invalid	2	Function returns invalid_signature	Not executed yet	Pending execution
TEST-WEBHOOK-INVALID-001	Invalid	3	Webhook event is not parsed	Not executed yet	Pending execution
TEST-WEBHOOK-INVALID-001	Invalid	4	Database is not checked	Not executed yet	Pending execution
TEST-WEBHOOK-INVALID-001	Invalid	5	Subscription is not fulfilled	Not executed yet	Pending execution

## Real Execution Comparison
**Execution Results:** The database currently contains no checkout attempts or payment fulfilment records, so the normal and duplicate database paths have not yet been executed against real records.  
**Discrepancy:** None identified during the hand trace. 
**Correction:** No correction made. The pseudocode will be compared against actual execution after suitable test data is available.  
