# A3 — Planted Bug: Actual Behaviour

**Supplied by:** Reviewer / Bootcamp Partner  
**Function Name:** `calculateProratedRefund`  
**Purpose:** Calculates the refundable minor amount for a cancelled billing cycle.  

---

## Supplied Source Code

```typescript
export interface SubscriptionCycle {
  amountPaidMinor: number;
  cycleStartDate: Date;
  cycleEndDate: Date;
}

export interface RefundCalculationResult {
  eligibleForRefund: boolean;
  refundAmountMinor: number;
  unusedDays: number;
  totalCycleDays: number;
  reason?: string;
}

export function calculateProratedRefund(
  subscription: SubscriptionCycle,
  cancellationDate: Date
): RefundCalculationResult {
  const { amountPaidMinor, cycleStartDate, cycleEndDate } = subscription;
  const msPerDay = 1000 * 60 * 60 * 24;

  if (amountPaidMinor <= 0) {
    return {
      eligibleForRefund: false,
      refundAmountMinor: 0,
      unusedDays: 0,
      totalCycleDays: 0,
      reason: 'No charge paid for this cycle',
    };
  }

  if (cancellationDate >= cycleEndDate) {
    return {
      eligibleForRefund: false,
      refundAmountMinor: 0,
      unusedDays: 0,
      totalCycleDays: Math.round((cycleEndDate.getTime() - cycleStartDate.getTime()) / msPerDay),
      reason: 'Cancellation date is at or after cycle end',
    };
  }

  if (cancellationDate <= cycleStartDate) {
    const totalDays = Math.round((cycleEndDate.getTime() - cycleStartDate.getTime()) / msPerDay);
    return {
      eligibleForRefund: true,
      refundAmountMinor: amountPaidMinor,
      unusedDays: totalDays,
      totalCycleDays: totalDays,
    };
  }

  const totalCycleDays = Math.round(
    (cycleEndDate.getTime() - cycleStartDate.getTime()) / msPerDay
  );

  const unusedDays = Math.round(
    (cancellationDate.getTime() - cycleStartDate.getTime()) / msPerDay
  );

  const refundAmountMinor = Math.round(
    (amountPaidMinor * unusedDays) / totalCycleDays
  );

  return {
    eligibleForRefund: true,
    refundAmountMinor,
    unusedDays,
    totalCycleDays,
  };
}
```

---

## Pseudocode (What the Function ACTUALLY Does)

> *This pseudocode describes actual execution verbatim, without correcting the logic.*

```text
FUNCTION calculateProratedRefund

INPUTS:
- subscription: object containing amountPaidMinor (integer), cycleStartDate (Date), cycleEndDate (Date)
- cancellationDate: Date, the timestamp when cancellation occurred

OUTPUT:
- RefundCalculationResult object containing eligibleForRefund (boolean), refundAmountMinor (integer), unusedDays (integer), totalCycleDays (integer), and optional reason (string)

SIDE EFFECTS:
- NONE

FAILS WHEN:
- Does not throw; returns non-eligible result when amount is zero or cancellation is on or after cycle end

1. IF amountPaidMinor is less than or equal to 0
    RETURN not-eligible result with zero refund amount, zero days, and reason "No charge paid for this cycle"
OTHERWISE
    continue

2. IF cancellationDate is greater than or equal to cycleEndDate
    calculate total cycle days as difference between cycleEndDate and cycleStartDate in days
    RETURN not-eligible result with zero refund amount, zero unused days, calculated total cycle days, and reason "Cancellation date is at or after cycle end"
OTHERWISE
    continue

3. IF cancellationDate is less than or equal to cycleStartDate
    calculate total cycle days as difference between cycleEndDate and cycleStartDate in days
    RETURN eligible result with full amountPaidMinor, unused days equal to total cycle days, and total cycle days
OTHERWISE
    continue

4. Calculate totalCycleDays as the difference between cycleEndDate and cycleStartDate divided by milliseconds per day, rounded to nearest integer.

5. Calculate unusedDays as the difference between cancellationDate and cycleStartDate divided by milliseconds per day, rounded to nearest integer.

6. Calculate refundAmountMinor by multiplying amountPaidMinor by unusedDays, dividing by totalCycleDays, and rounding to nearest integer.

7. RETURN eligible result with eligibleForRefund true, calculated refundAmountMinor, calculated unusedDays, and totalCycleDays.
```

---

## Hand Trace (Demonstrating Actual Buggy Execution)

### Scenario: Customer Cancels Early on Day 3 of a 30-Day Cycle ($300 paid)
- `cycleStartDate`: 2026-10-01
- `cycleEndDate`: 2026-10-31 (30 days total)
- `cancellationDate`: 2026-10-04 (cancelled after 3 days; 27 days remaining)
- `amountPaidMinor`: 30,000 cents ($300)

| Step | Pseudocode Action | Evaluation | Actual State / Result |
|---:|---|---|---|
| 1 | Check `amountPaidMinor <= 0` | 30,000 <= 0 is false | Continue |
| 2 | Check `cancellationDate >= cycleEndDate` | Oct 4 >= Oct 31 is false | Continue |
| 3 | Check `cancellationDate <= cycleStartDate` | Oct 4 <= Oct 1 is false | Continue |
| 4 | Compute `totalCycleDays` | Oct 31 - Oct 1 = 30 days | `totalCycleDays = 30` |
| 5 | Compute `unusedDays` | Oct 4 - Oct 1 = **3 days** | **`unusedDays = 3`** *(Calculates consumed days!)* |
| 6 | Compute `refundAmountMinor` | (30,000 * 3) / 30 = **3,000 cents** | **`refundAmountMinor = 3,000 ($30)`** |
| 7 | Return result | Returns `{ eligible: true, refundAmountMinor: 3000, unusedDays: 3, totalCycleDays: 30 }` | Customer who cancelled after 3 days was refunded only $30 instead of $270! |
