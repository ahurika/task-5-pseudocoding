# C4 — Explanation Recording Notes

**Objective:** Maximum 5-minute recording explaining the discount code feature using ONLY pseudocode as notes (no source code on screen). Then have a non-technical person listen and explain back what they understood.

---

## Recording Metadata

- **Recording Date:** 15/10/2026
- **Recording File / Link:** `c:\Users\USER\AppData\Local\Packages\Microsoft.ScreenSketch_8wekyb3d8bbwe\TempState\Recordings\20261015-2123-46.4700899.mp4`
- **Duration:** T3 minute
- **Notes Used On Screen:** `part-b/pseudocode/discount-code.md` 

---

## Script / Speaking Outline (From Pseudocode Only)

1. **Introduction & Purpose (30 sec):**
   - Explain what `applyDiscountCode` is: a business logic service that safely calculates discounts and enforces promotional boundaries.
2. **Inputs & Safety Pre-conditions (1 min):**
   - Walk through the cart, customer identifier, entered code, and current date.
   - Explain the immediate guardrail: rejecting carts with subtotal <= 0.
3. **Lookup & Validation Rules (2 min):**
   - Walk through the database lookup and the four failure checks: code existence, active status, expiration date check, and single-use redemption per customer.
   - Explain minimum spend requirement (e.g., must spend at least $50).
4. **Calculation & Floor Guarantees (1 min):**
   - Explain calculating percentage vs. fixed amount.
   - Explain the cap: discount can never exceed the cart subtotal.
   - Explain calculating new total.
5. **Success Return (30 sec):**
   - Explain returning the new total and discount amount.

---

## Non-Technical Listener Feedback

- **Listener Name / Relationship:** fRIEND
- **Listener Background:** Non-technical (does not code)
- **What the Listener Explained Back:** They have a bit understanding now of how coupons and discount codes work
- **Where the Listener Understood Well:** how discount works especially when it is expired or disabled or already used by the customer
- **Where the Listener Was Confused (if any):** I think they understand all of the steps and the logic.
- **Conclusion:** Did the explanation and pseudocode communicate the logic clearly without code?   yes it did
