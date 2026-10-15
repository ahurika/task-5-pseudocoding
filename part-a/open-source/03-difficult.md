# A2 — Open Source: Difficult

**Library:** `lodash`  
**Source Path:** `lodash/debounce.js`  
**Function Name:** `debounce`  
**Why Selected:** High complexity (~150 lines) managing concurrent timer state, `maxWait` guarantees, `leading`/`trailing` invocation edges, closure state resets, and cancellation controls.  

---

## Source Code

```javascript
/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @returns {Function} Returns the new debounced function.
 */
function debounce(func, wait, options) {
  let lastArgs,
    lastThis,
    maxWait,
    result,
    timerId,
    lastCallTime;

  let lastInvokeTime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  wait = +wait || 0;
  if (options && typeof options === 'object') {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function startTimer(pendingFunc, wait) {
    return setTimeout(pendingFunc, wait);
  }

  function cancelTimer(id) {
    clearTimeout(id);
  }

  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = startTimer(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = startTimer(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait);
    }
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
```

---

## Pseudocode (First Pass — Human Independent)

```text
FUNCTION debounce

INPUTS:
- func: function to execute with delayed throttling
- wait: number of milliseconds to delay (defaults to 0)
- options: object with optional flags: leading (boolean), trailing (boolean), maxWait (number)

OUTPUT:
- debounced: a wrapped wrapper function with .cancel() and .flush() properties

SIDE EFFECTS:
- Schedules and clears system timers via setTimeout and clearTimeout

FAILS WHEN:
- func is not a callable function (throws TypeError)

1. IF func is not a function
    THROW TypeError: Expected a function
OTHERWISE
    continue

2. Convert wait to positive number defaulting to 0.

3. Extract configuration options:
    set leading to options.leading boolean flag or false
    set trailing to options.trailing boolean flag or true
    IF maxWait is provided in options
        set maxWait to maximum of numeric maxWait and wait, and enable maxing flag
    OTHERWISE
        set maxing flag to false

4. Initialize internal state tracking:
    lastArgs, lastThis, lastCallTime, timerId as undefined, and lastInvokeTime as 0.

5. Define inner helper invokeFunc(time):
    extract lastArgs and lastThis into temporary variables
    clear lastArgs and lastThis to undefined
    set lastInvokeTime to time
    execute func with temporary arguments and context
    record and RETURN execution result

6. Define inner helper shouldInvoke(time):
    calculate timeSinceLastCall as (time - lastCallTime)
    calculate timeSinceLastInvoke as (time - lastInvokeTime)
    RETURN true IF lastCallTime is undefined OR timeSinceLastCall >= wait OR timeSinceLastCall < 0 OR (maxing is true AND timeSinceLastInvoke >= maxWait)
    OTHERWISE RETURN false

7. Define inner helper timerExpired():
    retrieve current time
    IF shouldInvoke(currentTime) is true
        execute trailingEdge(currentTime)
    OTHERWISE
        schedule timerExpired after remainingWait(currentTime) milliseconds

8. Define inner helper trailingEdge(time):
    clear timerId to undefined
    IF trailing is true AND lastArgs is defined
        RETURN invokeFunc(time)
    OTHERWISE
        clear lastArgs and lastThis to undefined
        RETURN result

9. Define inner debounced function(...args):
    retrieve currentTime as Date.now()
    check isInvoking as shouldInvoke(currentTime)
    store args in lastArgs, context in lastThis, and currentTime in lastCallTime
    IF isInvoking is true
        IF timerId is undefined
            execute and RETURN leadingEdge(lastCallTime)
        IF maxing is true
            schedule timerExpired after wait milliseconds
            execute and RETURN invokeFunc(lastCallTime)
    IF timerId is undefined
        schedule timerExpired after wait milliseconds
    RETURN cached result

10. Attach cancel and flush methods to debounced function to allow clearing timer or immediately flushing pending calls.

11. RETURN debounced function
```

---

## Hand Traces

### Normal Input (Single Debounced Call with Trailing Execution)
- **Input:** `func = fn, wait = 100ms, options = { leading: false, trailing: true }`. Call at `t = 0ms`.

| Step | Pseudocode Action | Evaluation | State / Outcome |
|---:|---|---|---|
| 1 | `debounced()` called at `t = 0` | `shouldInvoke(0)` is true (`lastCallTime` undefined) | `lastCallTime = 0, lastArgs = args` |
| 2 | Check `timerId` | `timerId` is undefined | Enters `leadingEdge` |
| 3 | `leadingEdge` logic | `leading` is false | Does NOT invoke `func`; schedules `timerExpired` for `t = 100`; returns undefined |
| 4 | Timer fires at `t = 100` | No subsequent calls (`timeSinceLastCall = 100 >= 100`) | Calls `trailingEdge` |
| 5 | `trailingEdge` logic | `trailing` is true and `lastArgs` exists | Executes `invokeFunc(100)` -> `func` called with args; resets `lastArgs` |

---

### Edge Input (`maxWait` Exceeded During Continuous Rapid Calls)
- **Input:** `wait = 100ms, maxWait = 150ms`. Rapid calls at `t = 0, 40, 80, 120, 160ms`.

| Step | Pseudocode Action | Evaluation | State / Outcome |
|---:|---|---|---|
| 1 | Call at `t = 0` | First call | Schedules timer; `lastInvokeTime = 0` |
| 2 | Calls at `t = 40, 80, 120` | Each call updates `lastCallTime` | `timeSinceLastCall < 100`, timer keeps resetting delay |
| 3 | Call at `t = 160` | `timeSinceLastInvoke = 160 - 0 = 160ms >= maxWait (150ms)` | `shouldInvoke(160)` evaluates to **true** due to `maxWait` breach! |
| 4 | Forced invocation | `maxing` is true | Forces execution of `invokeFunc(160)` even though calls were continuous! Resets `lastInvokeTime = 160`. |

---

### Invalid Input (`func` is not a Function)
- **Input:** `func = null, wait = 100`

| Step | Pseudocode Action | Evaluation | State / Outcome |
|---:|---|---|---|
| 1 | Validate `typeof func` | `typeof null !== 'function'` is true | **Throws TypeError: Expected a function** |

---

## Real Execution Comparison

**Execution Results:** TBD  
**Discrepancy:** TBD  
**Correction:** TBD  
