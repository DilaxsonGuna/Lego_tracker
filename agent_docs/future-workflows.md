# Future Workflows Reference

Deferred ECC workflows not yet active, organized by when they become relevant.

---

## When Testing is Set Up (Vitest)

**Prerequisites:** `npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom`

| Workflow | What it does |
|----------|-------------|
| `/tdd` | Enforces RED → GREEN → REFACTOR cycle via `tdd-guide` agent (Sonnet) |
| `/e2e` | Generates Playwright E2E tests via `e2e-runner` agent |
| `/test-coverage` | Analyzes coverage gaps and generates tests for uncovered paths |
| Quality-gate hook with tests | PostToolUse hook runs test suite after file edits |

**Checkpoint-based verification:**
```
[Implement feature] → [Checkpoint #1: tests pass?]
    → yes → [Next task] → [Checkpoint #2: tests pass?]
    → no → [Fix] → [Re-verify]
```

**Priority test targets:**
- `lib/commands/user-favorites.ts` — max-4 constraint
- `lib/commands/user-themes.ts` — max-10 constraint
- `lib/commands/user-sets.ts` — add/delete operations
- `lib/queries/vault.ts` — query construction

---

## When CI/CD is Added

| Workflow | What it does |
|----------|-------------|
| GitHub Actions | Automated build + test + lint on PR |
| `/verify` with CI | Verification loop that checks CI status |
| PostToolUse observability | Hooks that log what Claude enacted and exact changes |

**Continuous eval pattern** (for long sessions):
```
[Work] → [Timer/Change trigger] → [Run Tests + Lint]
    → pass → [Continue]
    → fail → [Stop & Fix]
```
Runs every N minutes or after major changes. Full test suite, build status, lint. Reports regressions immediately.

---

## When Scaling (Multiple Claude Instances)

### Two-Instance Kickoff Pattern
Start with 2 terminals:
- **Instance 1 (Scaffolding):** Lays groundwork, creates structure, sets up configs
- **Instance 2 (Deep Research):** Connects to services, creates PRD, architecture diagrams, compiles references

Use `/rename` to name each: `/rename code` and `/rename research`

### Git Worktrees for Parallel Instances
```bash
git worktree add ../lego-tracker-feature-a feature-a
git worktree add ../lego-tracker-feature-b feature-b
cd ../lego-tracker-feature-a && claude
```
Benefits: no git conflicts, clean working directory per instance, easy to compare outputs.

### Cascade Method
- Open new tasks in new tabs to the right
- Sweep left-to-right, oldest to newest
- Max 3-4 parallel focuses — more increases mental overhead faster than productivity

### Rules for Parallelization
- Only add instances out of true necessity
- If you can do it with a script, use a script
- Choose orthogonal tasks (minimal code overlap)
- Use git worktrees when instances touch overlapping code
- For most work, 2-3 instances is sufficient

---

## When Deploying

| Workflow | What it does |
|----------|-------------|
| Docker patterns | Containerization skills for production deployment |
| Deployment patterns | CI/CD pipeline with staging/production environments |
| Vercel integration | Vercel CLI or MCP for preview deployments |
| Railway integration | Railway CLI for backend services |

---

## When Collaborating

| Workflow | What it does |
|----------|-------------|
| `/code-review` + PR | Code review agent with GitHub PR integration |
| `git-push-reminder` hook | Re-enable: review changes before pushing (currently disabled) |
| PR workflow commands | Automated PR creation with summary and test plan |

---

## Medium-Value Tools (Install When Needed)

### gstack (Garry Tan, 20K stars)
**What:** 15 skills that turn Claude into a virtual dev team — CEO product reviewer, eng manager, designer, QA lead, release engineer.
**Commands:** `/office-hours`, `/plan-ceo-review`, `/plan-design-review`, `/review`, `/ship`, `/qa`, `/retro`
**When:** When you want structured multi-perspective reviews before shipping features. Good for pre-launch quality passes.
**Install:** `git clone https://github.com/garrytan/gstack.git` and copy relevant skills.

### Playwright MCP
**What:** Browser automation via accessibility snapshots for E2E testing.
**When:** When you set up E2E tests (after Vitest in Phase 3). Enables testing user flows: sign up → add sets → share collection card.
**Install:** Add to MCP config: `npx @anthropic-ai/mcp-server-playwright`

### Sentry MCP
**What:** Brings production error tracking data directly into Claude's context.
**When:** After deploying to production. Go from error alert → root cause → fix without switching tools.
**Install:** Add Sentry MCP server to your config with your DSN.

### CC Notify (Desktop Notifications)
**What:** Desktop notifications when long-running Claude tasks complete.
**When:** When you're running long builds, multi-file implementations, or parallel workflows and want to be pinged.
**Install:** `git clone https://github.com/dazuiba/cc-notify` — adds Stop hook for notifications.

### ~~Context7 MCP~~ ✅ INSTALLED
Already connected. Powers `documentation-lookup` skill for Next.js 15, React 19, Supabase, Tailwind docs.

### ~~Exa MCP~~ ✅ INSTALLED
Already connected (HTTP transport). Powers `exa-search`, `deep-research`, and `market-research` skills. Free tier: 1,000 requests/month.

### find-skills (418K installs)
**What:** Skill discovery tool — helps browse and install skills from the marketplace.
**When:** When you want to explore more skills beyond what you have.
**Install:** `/skill install anthropic/find-skills`

---

## Future MCP Servers (Add When Needed)

### Firecrawl MCP
**What:** Web scraping and crawling. Complements Exa for `deep-research` skill — Exa searches, Firecrawl scrapes full pages.
**When:** When `deep-research` needs full page content beyond what `crawling_exa` provides. Or when you need to scrape competitor sites systematically.
**Free tier:** 500 credits/month (1 credit per page).
**Skills that use it:** `deep-research`
**Install:**
```bash
claude mcp add firecrawl -e FIRECRAWL_API_KEY=your-key -- npx -y firecrawl-mcp
```
**Get key:** https://www.firecrawl.dev/

### GitHub MCP
**What:** Read issues, manage PRs, trigger CI/CD, browse repos without leaving Claude Code.
**When:** When you set up CI/CD or want to manage GitHub issues/PRs from Claude Code. You already have `gh` CLI which covers most of this.
**Free tier:** Unlimited (uses your GitHub token).
**Skills that use it:** PR workflows, issue management
**Install:**
```bash
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=your-token -- npx -y @modelcontextprotocol/server-github
```

### Vercel MCP
**What:** Manage deployments, preview URLs, environment variables, and project settings.
**When:** When you deploy Lego Tracker to Vercel and want to manage deployments from Claude Code.
**Free tier:** Unlimited (uses your Vercel token).
**Install:**
```bash
claude mcp add vercel -e VERCEL_API_TOKEN=your-token -- npx -y @vercel/mcp
```

### PostgreSQL / Supabase MCP (Direct SQL)
**What:** Run SQL queries, explore schema, and manage data directly.
**When:** Already partially available via your existing Supabase MCP tools. Consider the raw PostgreSQL MCP if you need more direct database access for analytics queries.
**Install:**
```bash
claude mcp add postgres -e DATABASE_URL=your-supabase-connection-string -- npx -y @modelcontextprotocol/server-postgres
```

### Stripe MCP
**What:** Manage products, prices, subscriptions, and payment flows.
**When:** When you implement the Pro tier ($4.99/month) and need to set up Stripe billing.
**Free tier:** Unlimited (uses your Stripe API key).
**Skills that use it:** Payment integration, subscription management
**Install:**
```bash
claude mcp add stripe -e STRIPE_SECRET_KEY=your-key -- npx -y @stripe/mcp
```

### PostHog MCP (if available)
**What:** Query analytics data, manage feature flags, view session recordings.
**When:** After PostHog analytics integration (from your phase4 plan). Check if an official MCP exists at that time.
**Alternative:** Use PostHog API directly via skills or `curl` commands.

### Resend / Email MCP
**What:** Send transactional emails (welcome, notifications, Pro tier marketing).
**When:** When you implement email notifications or Pro tier onboarding emails.
**Install:** Check for `@resend/mcp` or use Resend API directly via skills.

### Cloudflare MCP
**What:** Manage DNS, Workers, R2 storage, and CDN settings.
**When:** If you use Cloudflare for CDN, image optimization, or edge functions.
**Install:**
```bash
claude mcp add cloudflare -- npx -y @cloudflare/mcp-server-cloudflare
```

---

## MCP Summary: Current vs Future

| MCP | Status | Powers |
|-----|--------|--------|
| **Supabase** | ✅ Connected | Database, auth, migrations |
| **Context7** | ✅ Connected | Real-time library docs |
| **Exa** | ✅ Connected | Web search, research, code search |
| **Chrome** | ✅ Available | Browser automation (via `/chrome`) |
| Firecrawl | Future | Deep web scraping for research |
| GitHub | Future | PR/issue management from Claude |
| Vercel | Future | Deployment management |
| Stripe | Future | Pro tier payment integration |
| Playwright | Future | E2E browser testing |
| Sentry | Future | Production error tracking |
| PostHog | Future | Analytics queries |
| Resend | Future | Transactional emails |

---

## Agent Teams (Experimental — Parallel Claude Sessions)

**What:** Multiple Claude Code instances working as a coordinated team. One session is the "lead," others are "teammates." They share a task list, message each other directly, and coordinate autonomously.

**Status:** Experimental, disabled by default. Requires Claude Code v2.1.32+.

**Cost:** High — each teammate is a full Claude session with its own context window. 3-5x more tokens than subagents.

**When to use (instead of subagent-driven-development):**
- Cross-layer features: frontend + backend + tests owned by different teammates in parallel
- Parallel code review: security reviewer + performance reviewer + test coverage reviewer simultaneously
- Debugging complex bugs: teammates test competing hypotheses and challenge each other
- Large features like Pro tier (billing + UI + database + API all at once)

**When NOT to use (stick with subagents):**
- Sequential tasks
- Same-file edits (causes conflicts)
- Simple features
- Day-to-day coding

### Enable
Add to `.claude/settings.json`:
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### Example: Cross-Layer Feature
```
Create an agent team to implement the Pro tier subscription:
- One teammate on Stripe billing integration (backend)
- One teammate on the pricing page UI (frontend)
- One teammate on database schema + RLS policies
- One teammate writing tests for all three layers
Use Sonnet for each teammate. Require plan approval before implementation.
```

### Example: Parallel Code Review
```
Create an agent team to review the last 5 commits:
- One focused on security (RLS, auth, secrets)
- One checking performance (N+1 queries, bundle size, waterfalls)
- One validating test coverage and edge cases
Have them report findings independently.
```

### Display Modes
- **In-process** (default): all teammates in one terminal, Shift+Down to cycle
- **Split panes**: each teammate in its own tmux/iTerm2 pane (requires tmux)

### Best Practices
- Start with 3-5 teammates (diminishing returns beyond that)
- 5-6 tasks per teammate for optimal productivity
- Break work so each teammate owns different files (avoid conflicts)
- Use `require plan approval` for risky changes
- Check in on teammates periodically — don't let them run unattended too long
- Start with research/review tasks before attempting parallel implementation

### Quality Gates via Hooks
- `TeammateIdle`: runs when teammate goes idle — exit code 2 sends feedback and keeps them working
- `TaskCompleted`: runs when task marked complete — exit code 2 prevents completion with feedback

### Limitations
- No session resumption for in-process teammates
- One team per session
- No nested teams (teammates can't spawn their own teams)
- Split panes not supported in VS Code terminal or Ghostty
- Permissions set at spawn (all teammates inherit lead's permissions)

---

## Advanced ECC (Power User)

### Continuous Learning v2
- `/instinct-status` — Check extracted instincts from session patterns
- `/instinct-import/export` — Share instincts across projects
- `/evolve` — Cluster instincts into reusable skills
- `/skill-create` — Generate skills from git history

### Benchmarking Workflows
Compare skill effectiveness using git worktrees:
```
[Same Task]
    ├── Worktree A (WITH skill)
    └── Worktree B (WITHOUT skill)
        → [git diff] → Compare logs, token usage, output quality
```

### Eval Metrics
- **pass@k**: At least ONE of k attempts succeeds (use when any working solution is fine)
- **pass^k**: ALL k attempts must succeed (use when consistency is essential)

### Eval Roadmap (from Anthropic)
1. Start with 20-50 simple tasks from real failures
2. Convert failures into test cases
3. Write unambiguous tasks (two experts → same verdict)
4. Build balanced sets (test when behavior should AND shouldn't occur)
5. Build robust harness (each trial from clean environment)
6. Grade output, not path
7. Read transcripts from many trials
8. Monitor saturation (100% pass = add harder tests)

### MCP → CLI Token Optimization
Replace heavy MCP operations with CLI-based skills:
```bash
# Instead of Supabase MCP for migrations:
supabase migration new description_here
supabase db push

# Instead of GitHub MCP for PRs:
gh pr create --title "..." --body "..."
```
MCP stays for convenience; CLI skills for token-heavy operations.

### Agent Abstraction Tierlist

**Tier 1: Direct Buffs (Start Here)**
- Subagents — prevents context rot, ad-hoc specialization
- Metaprompting — "3 minutes to prompt a 20-minute task"
- Asking user more at the beginning — clarify before building

**Tier 2: High Skill Floor (Graduate to Later)**
- Long-running agents — requires understanding 15min vs 1.5hr vs 4hr tradeoffs
- Parallel multi-agent — high variance, only useful on well-segmented tasks
- Role-based multi-agent — models evolve too fast for hard-coded heuristics
- Computer use agents — early paradigm, requires wrangling

### Orchestrator Sequential Phases
```
Phase 1: RESEARCH (Explore agent) → research-summary.md
Phase 2: PLAN (planner agent) → plan.md
Phase 3: IMPLEMENT (tdd-guide agent) → code changes
Phase 4: REVIEW (code-reviewer agent) → review-comments.md
Phase 5: VERIFY (build-error-resolver if needed) → done or loop back
```
Key rules:
1. Each agent: ONE input → ONE output
2. Outputs become inputs for next phase
3. Never skip phases
4. Use `/clear` between agents for fresh context
5. Store intermediate outputs in files, not just memory

### Iterative Retrieval Pattern (for subagents)
```
ORCHESTRATOR (has context)
    → dispatch with query + objective
SUB-AGENT (lacks context)
    → returns summary
EVALUATE: Sufficient?
    → no → FOLLOW-UP QUESTIONS → sub-agent fetches → return
    → yes → ACCEPT
(max 3 cycles)
```
Always pass objective context, not just the query.

### System Prompt Injection
For strict behavioral rules that need highest authority:
```bash
claude --system-prompt "$(cat ~/.claude/contexts/dev.md)"
```
System prompt > user messages > tool results in instruction hierarchy.

### Session File Pattern
Sessions stored as: `~/.claude/sessions/YYYY-MM-DD-topic.tmp`
Each file contains:
- What approaches worked (with evidence)
- What approaches were attempted but didn't work
- What approaches haven't been attempted
- What's left to do
