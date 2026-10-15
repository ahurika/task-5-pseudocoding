# A2 — AI Comparison: Difficult (`debounce`)

**Function:** `lodash.debounce`  
**First-Pass Document:** `part-a/open-source/03-difficult.md`  

---

## AI Explanation Provided

> *"Lodash's debounce function delays invoking a function until `wait` milliseconds have elapsed since the last invocation. If `maxWait` is configured, it starts an independent recurring interval timer to ensure the function executes periodically even under continuous calls. When `.cancel()` is called, it executes any pending trailing call before terminating the timers."*

---

## Comparison of Interpretations

| Aspect | Human First Pass | AI Explanation | Who Was Correct? | Source Verification & Explanation |
|---|---|---|:---:|---|
| **`maxWait` Timer Mechanism** | Discovered that Lodash uses a single `setTimeout` timer, dynamically adjusting the next delay via `remainingWait()`: `Math.min(timeWaiting, maxWait - timeSinceLastInvoke)`. | Claimed Lodash runs an independent recurring interval timer (`setInterval`) for `maxWait`. | **Human** | **AI was wrong.** Line 97: `timerId = startTimer(timerExpired, remainingWait(time));`. There is no `setInterval`. Lodash cleverly recalculates the shortest time remaining between the debounce delay and the `maxWait` deadline into a single `setTimeout`. |
| **`.cancel()` vs `.flush()` Behavior** | Correctly stated that `.cancel()` clears the timer and discards arguments/context without executing the function. | Claimed `.cancel()` executes the trailing call before cancelling. | **Human** | **AI was wrong.** Lines 109–115: `cancelTimer(timerId); lastInvokeTime = 0; lastArgs = lastCallTime = lastThis = timerId = undefined;`. It purges state immediately without calling `func`. Executing the trailing call is what `.flush()` does (Line 118). |
| **Clock Skew Check (`timeSinceLastCall < 0`)** | Noted the condition `timeSinceLastCall < 0` in `shouldInvoke()`. | Missed this condition entirely. | **Human** | Verified in Line 74: `timeSinceLastCall < 0`. This guards against system clock changes (e.g. system time rolled backwards). |

---

## Conclusion & Learning

The AI hallucinated a separate interval timer for `maxWait` and confused `.cancel()` with `.flush()`. Carefully tracing Lodash's closure state machines revealed how single-timer scheduling and clock-drift protection are implemented in production libraries.
