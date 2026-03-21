# Workflow Guide

Your day-to-day ECC-powered development workflow for Lego Tracker.

---

## Starting a Session

### Default (most sessions)
```bash
claude
```
Valterian skill is always loaded — it will proactively route you to the right workflow.

### Mode-specific sessions (use CLI aliases)
```bash
claude-dev        # Implementation mode — code first, explain after
claude-review     # Review mode — quality/security focused
claude-research   # Research mode — explore before acting
```

### Resuming previous work
SessionStart hook auto-loads your last session context from `~/.claude/sessions/`. Just start a new session and it picks up where you left off.

---

## Feature Development Flow

### Simple feature (1-2 files)
```
1. Describe the feature
2. Valterian suggests: implement directly
3. Code → /code-review → commit
```

### Complex feature (3+ files)
```
1. Describe the feature
2. Valterian suggests: /plan first
3. /plan → review plan → approve
4. If tasks are independent → subagent-driven-development:
   Per task: IMPLEMENTER → SPEC REVIEWER → CODE QUALITY REVIEWER
   → Loop until both reviewers approve
5. If tasks are coupled → implement sequentially
6. Final /code-review → fix issues
7. npm run build → verify (evidence before claims!)
8. /learn (if you solved something non-trivial)
9. Commit
```

### Subagent-driven development (maximum quality)
```
1. /plan → creates plan with independent tasks
2. Claude reads plan, extracts all tasks
3. For each task:
   a. Dispatches IMPLEMENTER subagent (builds, tests, commits, self-reviews)
   b. Dispatches SPEC REVIEWER subagent (verifies code matches requirements)
      → If issues: implementer fixes → re-review until ✅
   c. Dispatches CODE QUALITY REVIEWER subagent (architecture, testing, readiness)
      → If issues: implementer fixes → re-review until ✅
   d. Mark task complete
4. Final review of entire implementation
5. npm run build → verify
6. Commit
```

### New page
```
1. /new-page → provide page name
2. Claude scaffolds: page.tsx, actions.ts, queries, components, types
3. Implement the actual logic
4. /code-review → commit
```

### Database change
```
1. /db-migrate → describe what you need
2. Claude creates migration + updates agent_docs/database.md
3. Run migration locally
4. Update TypeScript types if needed
```

---

## Bug Fixing Flow

### Build error
```
1. npm run build fails
2. /build-fix → build-error-resolver agent reads errors and fixes
3. Verify build passes
```

### Runtime bug
```
1. Describe the bug
2. Valterian suggests: investigate first
3. Claude explores → identifies root cause → fixes
4. /code-review → commit
```

---

## Maintenance Flow

### Refactoring
```
1. /refactor-clean → Claude identifies dead code, patterns to clean
2. Review changes → commit
```

### Code review (standalone)
```
1. /code-review → reviewer agent checks all recent changes
2. Fix flagged issues
3. Commit
```

---

## Context Management

### During long sessions
- `/checkpoint` at natural milestones (after completing a feature, before starting next)
- Manual `/compact` at phase transitions (after exploration → before execution)
- Don't let auto-compact choose when — disable it and compact strategically

### Ending a session
- Stop hook automatically persists session state to `~/.claude/sessions/`
- evaluate-session hook extracts patterns worth keeping

### Mid-session learning
- `/learn` after solving something non-trivial — extracts pattern into a reusable skill
- Don't wait for session end if you just cracked something useful

---

## Using /valterian

### Passive (automatic)
Valterian skill is always loaded. When you describe a task, Claude will proactively suggest the right workflow without you asking.

### Active (explicit)
```
/valterian [describe your task]
```
Returns structured routing: task type, complexity, commands, agents, docs to read, constraints, approach.

---

## Growth & Launch Workflows

### Market research
```
/growth-ops → market-research or deep-research skill
```

### Content creation
```
/growth-ops → article-writing (blog) or content-engine (social) → crosspost (distribute)
```

### Growth strategy
```
/growth-ops → growth-hacker persona → design experiment → content-engine → measure
```

### Launch execution
```
See agent_docs/go-to-market.md for full checklists and timelines
```

---

## Quick Reference

| I want to... | Do this |
|-------------|---------|
| Build a new feature (simple) | implement → `/code-review` → commit |
| Build a new feature (complex) | `/plan` → subagent-driven-development → commit |
| Fix a build error | `/build-fix` |
| Add a new page | `/new-page` |
| Change the database | `/db-migrate` |
| Clean up code | `/refactor-clean` |
| Review before commit | requesting-code-review (structured, with git SHAs) |
| Verify work is done | verification-before-completion (run command, THEN claim) |
| Save my progress | `/checkpoint` |
| Extract a pattern | `/learn` |
| Get workflow advice | `/valterian` |
| Switch to review mode | Use `claude-review` alias |
| Switch to research mode | Use `claude-research` alias |
| Market research | `/growth-ops` → `market-research` or `deep-research` |
| Create content | `/growth-ops` → `content-engine` + `article-writing` |
| Growth strategy | `/growth-ops` → `growth-hacker` persona |
| Launch prep | `/growth-ops` → see `agent_docs/go-to-market.md` |
| SEO strategy | `/growth-ops` → `seo-specialist` persona |
| User feedback analysis | `/growth-ops` → `feedback-synthesizer` persona |
