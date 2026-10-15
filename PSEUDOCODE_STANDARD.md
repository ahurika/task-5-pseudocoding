# Pseudocode Standard

Every function begins with:

```text
FUNCTION name
INPUTS: each input with its type and what it means
OUTPUT: what is returned with its type
SIDE EFFECTS: anything written, sent, or changed outside the function, or NONE
FAILS WHEN: every condition under which this function cannot succeed
```

Then use numbered steps. One action per step. Plain English, present tense, no code syntax.

Branches:
```text
IF condition is true
    RETURN result
OTHERWISE
    continue
```

Loops:
```text
FOR EACH item in collection
    process item
END FOR
```

Every early exit is named.

External calls are marked:
```text
CALL payment provider to create checkout session (may fail, may be slow)
```

State changes are marked:
```text
WRITE order record with status pending
```

Good pseudocode lets someone who has never seen the code predict normal, edge, invalid and failure behaviour.

### Final check
- inputs + type + meaning;
- output + type + meaning;
- side effects;
- every failure condition;
- numbered actions;
- explicit branches;
- explicit loops;
- explicit early exits;
- external calls marked;
- state changes marked;
- no disguised code syntax.
