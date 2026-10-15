# A3 — Planted Bug: Bug Identification

**Function:** `calculateProratedRefund`  
**Bug Name:** Inverted Duration Anchor (Refunding Elapsed Days Instead of Remaining Days)  

---

## 1. The Difference Between Actual and Expected Pseudocode

The bug exists in **Step 5** of the pseudocode:

| Version | Step 5 Pseudocode | Resulting Formula |
|---|---|---|
| **Actual Behaviour (Buggy)** | Calculate `unusedDays` as the difference between `cancellationDate` and `cycleStartDate` divided by milliseconds per day. | `(cancellationDate - cycleStartDate) / msPerDay` |
| **Expected Behaviour (Correct)** | Calculate `unusedDays` as the difference between `cycleEndDate` and `cancellationDate` divided by milliseconds per day. | `(cycleEndDate - cancellationDate) / msPerDay` |

---

## 2. Bug Description & Mechanism

In a subscription cancellation workflow, a prorated refund must return the value of the **unconsumed, remaining duration** between the cancellation event and the end of the paid billing period.

In the supplied code:
```typescript
// BUGGY LINE:
const unusedDays = Math.round((cancellationDate.getTime() - cycleStartDate.getTime()) / msPerDay);
```

The author subtracted `cycleStartDate` from `cancellationDate`. This formula calculates the **elapsed/consumed days** that the customer has already enjoyed the service, but labels the variable `unusedDays`.

---

## 3. Business & Financial Impact

1. **Inverted Financial Fairness:**
   - A customer who cancels **early** (e.g., after 2 days of a 30-day month) should receive 28 days of refund (~93%). Under this bug, they receive only 2 days of refund (~7%).
   - A customer who cancels **late** (e.g., on day 29 of 30) should receive 1 day of refund (~3%). Under this bug, they receive 29 days of refund (~97%).
2. **Defect Type:** Semantic calculation inversion caused by variable misnaming and improper date anchoring.

---

## 4. Source Code Correction

Change line 59 in `calculateProratedRefund`:

```diff
-  const unusedDays = Math.round(
-    (cancellationDate.getTime() - cycleStartDate.getTime()) / msPerDay
-  );
+  const unusedDays = Math.round(
+    (cycleEndDate.getTime() - cancellationDate.getTime()) / msPerDay
+  );
```
