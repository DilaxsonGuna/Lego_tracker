---
description: Deep growth routing — analyzes a marketing/launch/content task and recommends the optimal ECC skills, Agency Agent personas, and docs to reference
---

Analyze the current non-coding task and provide a detailed routing recommendation.

## Instructions

1. **Identify task type**: content, growth, research, SEO, brand, feedback, launch, fundraising
2. **Recommend tools**:
   - Which ECC skill(s) to invoke
   - Which Agency Agent persona(s) to load
   - Which Impeccable commands (if UI-related)
3. **Reference docs**: Point to relevant `agent_docs/` files
   - `agent_docs/go-to-market.md` — launch checklists and workflows
   - `agent_docs/phase4/monetization-strategy.md` — pricing, projections, viral mechanics
   - `agent_docs/phase4/business-analytics.md` — metrics framework, PostHog schema
   - `agent_docs/phase1/user-research.md` — personas, friction points
4. **Sequence**: Order the tools/agents for optimal execution

## Output Format

```
TASK: [one-line summary]
TYPE: content | growth | research | SEO | brand | feedback | launch | fundraising
TOOLS:
  1. [ECC skill or Agency persona] — [what it does for this task]
  2. [next tool] — [purpose]
DOCS TO READ: [specific agent_docs/ files]
APPROACH: [brief strategy, 2-3 sentences]
```

Reference the growth-ops skill for the full tool registry and decision tree.
