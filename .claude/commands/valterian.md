---
description: Deep workflow routing — analyzes your current task and recommends the optimal workflow, agents, and docs
---

Analyze the current task context and provide a detailed routing recommendation.

## Instructions

1. **Identify the task type**: feature, bug fix, refactor, database change, UI work, maintenance
2. **Assess complexity**: single-file, multi-file, architectural
3. **Recommend workflow**:
   - Which command(s) to use and in what order
   - Which agent(s) will be spawned (and at what model tier)
   - Which project docs to reference (`agent_docs/`, `CLAUDE.md`, component files)
   - Whether to use `/plan` first or implement directly
4. **Flag constraints**: business rules (max-4 favorites, max-10 themes, RLS), auth requirements, design system tokens
5. **Estimate approach**: sequential phases if complex, direct if simple

## Output Format

```
TASK: [one-line summary]
COMPLEXITY: simple | moderate | complex
WORKFLOW: [ordered list of commands]
AGENTS: [which agents, which models]
DOCS TO READ: [specific files]
CONSTRAINTS: [business rules, RLS, design tokens]
APPROACH: [brief strategy]
```

Reference the Valterian skill for the full command registry and decision tree.
