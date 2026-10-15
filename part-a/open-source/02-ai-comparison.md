# A2 — AI Comparison: Medium (`chunk`)

**Function:** `lodash.chunk`  
**First-Pass Document:** `part-a/open-source/02-medium.md`  

---

## AI Explanation Provided

> *"The `chunk` function takes an array and a chunk size. It divides the array into sub-arrays of length `size`. If the array cannot be split evenly, the final chunk contains the remaining elements. If `size` is negative, zero, or invalid, it throws a RangeError because chunk size must be a positive integer. If `array` is null or undefined, it throws a TypeError."*

---

## Comparison of Interpretations

| Aspect | Human First Pass | AI Explanation | Who Was Correct? | Source Verification & Explanation |
|---|---|---|:---:|---|
| **Negative or Zero `size`** | Correctly identified that `Math.max(toInteger(size), 0)` and `size < 1` returns an empty array `[]`. | Claimed that a `RangeError` is thrown because chunk size must be positive. | **Human** | **AI was wrong.** Line 15: `if (!length || size < 1) { return []; }`. The source deliberately returns an empty array rather than throwing an exception. |
| **`null` / `undefined` array input** | Noted that `array == null ? 0 : array.length` safely guards against nullish inputs and returns `[]`. | Claimed that passing `null` or `undefined` throws a `TypeError`. | **Human** | **AI was wrong.** Line 14: `const length = array == null ? 0 : array.length`. Lodash is defensively designed to return `[]` when passed nullish values. |
| **Pre-allocation Optimization** | Noticed `new Array(Math.ceil(length / size))` pre-allocating the result container. | Missed the memory pre-allocation detail; described general dynamic pushing. | **Human** | Verified in line 19: `const result = new Array(Math.ceil(length / size));`. Pre-allocates for performance instead of dynamic resizing. |

---

## Conclusion & Learning

The AI hallucinated standard JavaScript runtime errors (`TypeError`, `RangeError`) where Lodash implements silent defensive fallbacks. Reading the exact source code reveals Lodash's philosophy of avoiding exceptions on boundary/invalid inputs.
