---
name: requesting-code-review
description: Use when completing tasks or before merging — dispatches code-reviewer subagent with git SHA range and structured review template
---

# Requesting Code Review

Dispatch code-reviewer subagent to catch issues before they cascade.

**Core principle:** Review early, review often.

## When to Request Review

**Mandatory:**
- After each task in subagent-driven development
- After completing major feature
- Before merge to main

**Optional but valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bug

## How to Request

**1. Get git SHAs:**
```bash
BASE_SHA=$(git rev-parse HEAD~1)  # or origin/main for full feature
HEAD_SHA=$(git rev-parse HEAD)
```

**2. Dispatch code-reviewer subagent:**

Use Agent tool with code-reviewer subagent type, using the review template below.

**3. Act on feedback:**
- Fix Critical issues immediately
- Fix Important issues before proceeding
- Note Minor issues for later
- Push back if reviewer is wrong (with reasoning)

## Review Template

```
Review code changes for production readiness.

## What Was Implemented
{DESCRIPTION}

## Requirements
{PLAN_OR_REQUIREMENTS}

## Git Range
Base: {BASE_SHA}  Head: {HEAD_SHA}

## Lego Tracker Review Checklist
- RLS: queries respect row-level security (auth.uid() = user_id)
- Business rules: max-4 favorites, max-10 themes enforced
- Auth: getUser() called and checked before protected operations
- Type safety: explicit types on exports, unknown over any
- Error handling: Supabase errors caught, surfaced via sonner toasts
- Server/client: "use client" directives correct, data fetched server-side
- Design tokens: CSS variables from globals.css, not hardcoded
- No console.log in production code
- File size: under 400 lines (800 max)
- Imports: @/* alias, not relative paths crossing modules

## Output Format
### Strengths (specific, file:line)
### Issues
#### Critical (Must Fix) — bugs, security, data loss
#### Important (Should Fix) — architecture, missing features, test gaps
#### Minor (Nice to Have) — style, optimization

For each issue: file:line, what's wrong, why it matters, how to fix

### Assessment
Ready to merge? [Yes/No/With fixes]
Reasoning: [1-2 sentences]
```

## Integration with Workflows

**Subagent-Driven Development:**
- Review after EACH task (two-stage: spec then quality)

**Ad-Hoc Development:**
- Review before commit or merge

**Never:**
- Skip review because "it's simple"
- Ignore Critical issues
- Proceed with unfixed Important issues
