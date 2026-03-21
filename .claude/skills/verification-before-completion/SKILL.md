---
name: verification-before-completion
description: Use before claiming work is complete — requires running verification commands and confirming output before any success claims. Evidence before assertions, always.
---

# Verification Before Completion

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

## The Gate Function

```
BEFORE claiming any status:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. ONLY THEN: Make the claim
```

## Lego Tracker Verification Commands

| Claim | Command | Not Sufficient |
|-------|---------|----------------|
| Build passes | `npm run build` exit 0 | "should pass", lint passing |
| Lint clean | `npm run lint` 0 errors | Partial check |
| Types correct | `npx tsc --noEmit` exit 0 | "looks right" |
| Tests pass | `npm test` 0 failures | Previous run, assumption |
| Bug fixed | Reproduce original → passes | Code changed, assumed fixed |
| Requirements met | Line-by-line checklist verified | Tests passing |

## Red Flags — STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Done!")
- About to commit/push/PR without verification
- Trusting agent success reports without checking
- Relying on partial verification
- ANY wording implying success without having run verification

## Rationalization Prevention

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence ≠ evidence |
| "Linter passed" | Linter ≠ build |
| "Agent said success" | Verify independently |

## When To Apply

**ALWAYS before:**
- Any success/completion claims
- Committing, PR creation, task completion
- Moving to next task
- Reporting to user

**No shortcuts. No exceptions.**

Run the command. Read the output. THEN claim the result.
