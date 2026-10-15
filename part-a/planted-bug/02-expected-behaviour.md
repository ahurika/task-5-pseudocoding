# A3 — Planted Bug: Expected Behaviour

**Function:** `calculateProratedRefund`  
**Purpose:** Corrected pseudocode specifying how the prorated refund calculation ought to behave.  

---

## Corrected Pseudocode (What the Function SHOULD Do)

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

5. Calculate unusedDays as the difference between cycleEndDate and cancellationDate divided by milliseconds per day, rounded to nearest integer.

6. Calculate refundAmountMinor by multiplying amountPaidMinor by unusedDays, dividing by totalCycleDays, and rounding to nearest integer.

7. RETURN eligible result with eligibleForRefund true, calculated refundAmountMinor, calculated unusedDays, and totalCycleDays.
```

---

## Hand Trace (Expected Outcome on Same Scenario)

### Scenario: Customer Cancels Early on Day 3 of a 30-Day Cycle ($300 paid)
- `cycleStartDate`: 2026-10-01
- `cycleEndDate`: 2026-10-31 (30 days total)
- `cancellationDate`: 2026-10-04 (3 days used, 27 days remaining)
- `amountPaidMinor`: 30,000 cents ($300)

| Step | Pseudocode Action | Evaluation | Expected State / Result |
|---:|---|---|---|
| 1 | Check `amountPaidMinor <= 0` | 30,000 <= 0 is false | Continue |
| 2 | Check `cancellationDate >= cycleEndDate` | Oct 4 >= Oct 31 is false | Continue |
| 3 | Check `cancellationDate <= cycleStartDate` | Oct 4 <= Oct 1 is false | Continue |
| 4 | Compute `totalCycleDays` | Oct 31 - Oct 1 = 30 days | `totalCycleDays = 30` |
| 5 | Compute `unusedDays` | Oct 31 - Oct 4 = **27 days** | **`unusedDays = 27`** *(Remaining unconsumed period)* |
| 6 | Compute `refundAmountMinor` | (30,000 * 27) / 30 = **27,000 cents** | **`refundAmountMinor = 27,000 ($270)`** |
| 7 | Return result | Returns `{ eligible: true, refundAmountMinor: 27000, unusedDays: 27, totalCycleDays: 30 }` | Customer receives 90% of their subscription back for the 90% unused cycle. |
