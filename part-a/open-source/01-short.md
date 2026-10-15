# A2 — Open Source: Short

**Library:** `lodash`  
**Source Path:** `lodash/clamp.js`  
**Function Name:** `clamp`  
**Why Selected:** Short utility function (~15 lines) containing subtle edge cases around numeric coercion and `NaN` boundary checks.  

---

## Source Code

```javascript
/**
 * Clamps `number` within the inclusive `lower` and `upper` bounds.
 *
 * @param {number} number The number to clamp.
 * @param {number} lower The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 */
function clamp(number, lower, upper) {
  number = +number;
  lower = +lower;
  upper = +upper;
  lower = lower === lower ? lower : 0;
  upper = upper === upper ? upper : 0;
  if (number === number) {
    number = number <= upper ? number : upper;
    number = number >= lower ? number : lower;
  }
  return number;
}
```

---

## Pseudocode (First Pass — Human Independent)

> *Write your first-pass pseudocode below according to [PSEUDOCODE_STANDARD.md](file:///c:/Users/USER/Desktop/Pseudocoding/PSEUDOCODE_STANDARD.md) before consulting AI explanation.*

```text
FUNCTION clamp

INPUTS:
- number: any value, the candidate number to constrain
- lower: any value, the lower boundary
- upper: any value, the upper boundary

OUTPUT:
- number: the clamped value, or NaN if the input number cannot be evaluated as a valid number

SIDE EFFECTS:
- NONE

FAILS WHEN:
- Does not throw; returns NaN if number is NaN

1. Convert number, lower, and upper to numeric values.

2. IF lower is NaN
    set lower to 0
OTHERWISE
    continue

3. IF upper is NaN
    set upper to 0
OTHERWISE
    continue

4. IF number is a valid number (not NaN)
    IF number is greater than upper
        set number to upper
    OTHERWISE
        continue
    IF number is less than lower
        set number to lower
    OTHERWISE
        continue
OTHERWISE
    continue

5. RETURN number
```

---

## Hand Traces

### Normal Input
- **Input:** `number = 7, lower = 0, upper = 5`

| Input | Category | Step | Expected state/result | Actual state/result | Match? |
|---|---|---:|---|---|---|
| `clamp(7, 0, 5)` | Normal | 1 | Numeric conversions: `7, 0, 5` | Not executed yet | Pending execution |
| `clamp(7, 0, 5)` | Normal | 2 | `lower` is 0 (valid); continue | Not executed yet | Pending execution |
| `clamp(7, 0, 5)` | Normal | 3 | `upper` is 5 (valid); continue | Not executed yet | Pending execution |
| `clamp(7, 0, 5)` | Normal | 4 | `7 <= 5` is false -> number becomes 5; `5 >= 0` is true -> number remains 5 | Not executed yet | Pending execution |
| `clamp(7, 0, 5)` | Normal | 5 | Return 5 | Not executed yet | Pending execution |

---

### Edge Input (Value Equals Boundary)
- **Input:** `number = 0, lower = 0, upper = 10`

| Input | Category | Step | Expected state/result | Actual state/result | Match? |
|---|---|---:|---|---|---|
| `clamp(0, 0, 10)` | Edge | 1 | Numeric conversions: `0, 0, 10` | Not executed yet | Pending execution |
| `clamp(0, 0, 10)` | Edge | 2 | `lower` is 0; continue | Not executed yet | Pending execution |
| `clamp(0, 0, 10)` | Edge | 3 | `upper` is 10; continue | Not executed yet | Pending execution |
| `clamp(0, 0, 10)` | Edge | 4 | `0 <= 10` is true -> number remains 0; `0 >= 0` is true -> number remains 0 | Not executed yet | Pending execution |
| `clamp(0, 0, 10)` | Edge | 5 | Return 0 | Not executed yet | Pending execution |

---

### Invalid Input (Input is NaN or String Invalid)
- **Input:** `number = NaN, lower = 5, upper = 10`

| Input | Category | Step | Expected state/result | Actual state/result | Match? |
|---|---|---:|---|---|---|
| `clamp(NaN, 5, 10)` | Invalid | 1 | `number` is NaN, `lower` is 5, `upper` is 10 | Not executed yet | Pending execution |
| `clamp(NaN, 5, 10)` | Invalid | 2 | `lower` is 5; continue | Not executed yet | Pending execution |
| `clamp(NaN, 5, 10)` | Invalid | 3 | `upper` is 10; continue | Not executed yet | Pending execution |
| `clamp(NaN, 5, 10)` | Invalid | 4 | `number === number` is false (NaN check); clamping logic is bypassed | Not executed yet | Pending execution |
| `clamp(NaN, 5, 10)` | Invalid | 5 | Return NaN | Not executed yet | Pending execution |

---

## Real Execution Comparison

**Execution Results:** TBD  
**Discrepancy:** TBD  
**Correction:** TBD  
