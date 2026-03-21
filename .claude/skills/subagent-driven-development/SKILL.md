---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks — dispatches fresh subagent per task with two-stage review (spec compliance then code quality)
---

# Subagent-Driven Development

Execute plan by dispatching fresh subagent per task, with two-stage review after each: spec compliance review first, then code quality review.

**Core principle:** Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration

## When to Use

- Have an implementation plan (from `/plan` or concise-planning)
- Tasks are mostly independent
- Want automated quality gates between tasks

## The Process

```
Read plan → Extract all tasks → Create task list

For each task:
  1. Dispatch IMPLEMENTER subagent
     → Implements, writes tests, commits, self-reviews
     → Can ask questions before/during work
  2. Dispatch SPEC REVIEWER subagent
     → Verifies code matches requirements (nothing more, nothing less)
     → If issues: implementer fixes → re-review until ✅
  3. Dispatch CODE QUALITY REVIEWER subagent
     → Checks architecture, testing, production readiness
     → If issues: implementer fixes → re-review until ✅
  4. Mark task complete

After all tasks:
  → Final code review of entire implementation
  → npm run build verification
  → Present completion options
```

## Prompt Templates

### Implementer Subagent

Dispatch via Agent tool (general-purpose):

```
You are implementing Task N: [task name]

## Task Description
[FULL TEXT of task from plan — paste it, don't make subagent read file]

## Context
[Where this fits in the project, dependencies, architectural context]

## Project Rules
- Next.js 15 App Router, React 19, TypeScript, Supabase
- Server components fetch data → pass to client components
- lib/queries/ = reads, lib/commands/ = writes — never mix
- Use createClient() from @/lib/supabase/server in server code
- Use @/* path alias for imports
- shadcn/ui primitives in components/ui/
- Toasts via sonner
- Business rules: max 4 favorites, max 10 themes, RLS on all user tables

## Before You Begin
If you have questions about requirements, approach, or dependencies — ask now.

## Your Job
1. Implement exactly what the task specifies
2. Write tests if applicable
3. Verify with npm run build
4. Commit your work
5. Self-review: completeness, quality, YAGNI, testing
6. Report: what you implemented, files changed, test results, concerns
```

### Spec Reviewer Subagent

Dispatch via Agent tool (general-purpose):

```
You are reviewing whether an implementation matches its specification.

## What Was Requested
[FULL TEXT of task requirements]

## What Implementer Claims They Built
[From implementer's report]

## CRITICAL: Do Not Trust the Report
Verify everything independently by reading actual code.

Check for:
- Missing requirements (skipped or incomplete)
- Extra/unneeded work (over-engineering, unrequested features)
- Misunderstandings (wrong interpretation of requirements)
- Lego Tracker specifics: RLS policies present? Business rule constraints respected?

Report:
- ✅ Spec compliant (after code inspection)
- ❌ Issues: [what's missing or extra, with file:line references]
```

### Code Quality Reviewer Subagent

Dispatch via Agent tool (code-reviewer subagent type):

```
Review code changes for production readiness.

## What Was Implemented
[From implementer's report]

## Git Range
Base: [BASE_SHA]  Head: [HEAD_SHA]

## Review Checklist
- Type safety: explicit types on exports, unknown over any
- Error handling: Supabase errors caught and surfaced via sonner
- RLS: queries respect row-level security
- Server/client boundary: "use client" directives correct, data fetched server-side
- Design tokens: CSS variables from globals.css, not hardcoded colors
- File size: under 400 lines
- No console.log in production code
- Tests verify behavior (not just mocks)

## Output
### Strengths (specific, with file:line)
### Issues
#### Critical (Must Fix) — bugs, security, data loss
#### Important (Should Fix) — architecture, missing features, test gaps
#### Minor (Nice to Have) — style, optimization
### Assessment: Ready to merge? [Yes/No/With fixes]
```

## Red Flags

**Never:**
- Skip either review (spec OR quality)
- Proceed with unfixed issues
- Dispatch parallel implementer subagents (conflicts)
- Make subagent read plan file (paste full text)
- Start quality review before spec compliance is ✅
- Accept "close enough" on spec compliance

**If reviewer finds issues:**
- Implementer fixes → reviewer re-reviews → repeat until approved
- Don't skip the re-review

## Integration

Works with:
- `/plan` or concise-planning → creates the plan this skill executes
- `/code-review` → final review after all tasks
- verification-before-completion → evidence before claims
