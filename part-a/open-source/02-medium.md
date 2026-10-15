# A2 — Open Source: Medium

**Library:** `lodash`  
**Source Path:** `lodash/chunk.js`  
**Function Name:** `chunk`  
**Why Selected:** Medium complexity (~30 lines) handling array slicing, pre-allocation calculation, size truncation, and trailing chunk handling.  

---

## Source Code

```javascript
/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining elements.
 *
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk.
 * @returns {Array} Returns the new array of chunks.
 */
function chunk(array, size = 1) {
  size = Math.max(Math.trunc(+size) || 0, 0);
  const length = array == null ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }
  let index = 0;
  let resIndex = 0;
  const result = new Array(Math.ceil(length / size));

  while (index < length) {
    result[resIndex++] = array.slice(index, (index += size));
  }
  return result;
}
```

---

## Pseudocode (First Pass — Human Independent)

```text
FUNCTION chunk

INPUTS:
- array: list or null/undefined, the input collection to partition
- size: integer or number, desired chunk length (defaults to 1)

OUTPUT:
- list of lists containing the elements split into chunks of the given size, or an empty list

SIDE EFFECTS:
- NONE

FAILS WHEN:
- Does not fail; returns empty list if array is null, empty, or size is less than 1

1. Convert size to an integer truncated towards zero, defaulting to 0 if NaN, and take the maximum of that value and 0.

2. Determine length of array as 0 if array is null or undefined, or the array element count otherwise.

3. IF length is 0 OR size is less than 1
    RETURN an empty list
OTHERWISE
    continue

4. Allocate a new list with capacity equal to the ceiling of length divided by size.

5. Set reading index to 0 and writing index to 0.

6. WHILE reading index is less than length
    extract a slice of elements from array starting at reading index up to reading index plus size
    store the extracted slice into result at writing index
    advance writing index by 1
    advance reading index by size
END WHILE

7. RETURN result
```

---

## Hand Traces

### Normal Input (Even Division)
- **Input:** `array = ['a', 'b', 'c', 'd'], size = 2`

| Input | Category | Step | Expected state/result | Actual state/result | Match? |
|---|---|---:|---|---|---|
| `chunk(['a','b','c','d'], 2)` | Normal | 1 | `size = 2` | Not executed yet | Pending execution |
| `chunk(['a','b','c','d'], 2)` | Normal | 2 | `length = 4` | Not executed yet | Pending execution |
| `chunk(['a','b','c','d'], 2)` | Normal | 3 | `length > 0` and `size >= 1`; continue | Not executed yet | Pending execution |
| `chunk(['a','b','c','d'], 2)` | Normal | 4 | Allocate result of size `ceil(4 / 2) = 2` | Not executed yet | Pending execution |
| `chunk(['a','b','c','d'], 2)` | Normal | 5 | `index = 0, resIndex = 0` | Not executed yet | Pending execution |
| `chunk(['a','b','c','d'], 2)` | Normal | 6 | Loop 1: slice(0, 2) -> `['a', 'b']`. `index = 2, resIndex = 1`. Loop 2: slice(2, 4) -> `['c', 'd']`. `index = 4, resIndex = 2`. Loop terminates. | Not executed yet | Pending execution |
| `chunk(['a','b','c','d'], 2)` | Normal | 7 | Return `[['a', 'b'], ['c', 'd']]` | Not executed yet | Pending execution |

---

### Edge Input (Uneven Remainder / Chunk Larger than Array)
- **Input:** `array = [1, 2, 3], size = 2`

| Input | Category | Step | Expected state/result | Actual state/result | Match? |
|---|---|---:|---|---|---|
| `chunk([1, 2, 3], 2)` | Edge | 1 | `size = 2` | Not executed yet | Pending execution |
| `chunk([1, 2, 3], 2)` | Edge | 2 | `length = 3` | Not executed yet | Pending execution |
| `chunk([1, 2, 3], 2)` | Edge | 3 | Continue | Not executed yet | Pending execution |
| `chunk([1, 2, 3], 2)` | Edge | 4 | Allocate result of size `ceil(3 / 2) = 2` | Not executed yet | Pending execution |
| `chunk([1, 2, 3], 2)` | Edge | 5 | `index = 0, resIndex = 0` | Not executed yet | Pending execution |
| `chunk([1, 2, 3], 2)` | Edge | 6 | Loop 1: slice(0, 2) -> `[1, 2]`. Loop 2: slice(2, 4) -> `[3]` (slice clamps to end of array). Loop terminates. | Not executed yet | Pending execution |
| `chunk([1, 2, 3], 2)` | Edge | 7 | Return `[[1, 2], [3]]` | Not executed yet | Pending execution |

---

### Invalid Input (Null Array / Negative or Zero Size)
- **Input:** `array = null, size = 3`

| Input | Category | Step | Expected state/result | Actual state/result | Match? |
|---|---|---:|---|---|---|
| `chunk(null, 3)` | Invalid | 1 | `size = 3` | Not executed yet | Pending execution |
| `chunk(null, 3)` | Invalid | 2 | `length = 0` (null check) | Not executed yet | Pending execution |
| `chunk(null, 3)` | Invalid | 3 | `!length` is true -> Early return `[]` | Not executed yet | Pending execution |

---

## Real Execution Comparison

**Execution Results:** TBD  
**Discrepancy:** TBD  
**Correction:** TBD  
