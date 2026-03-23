---
name: valterian
description: Workflow router — maps tasks to the right ECC commands, agents, and project docs. Always loaded for proactive routing.
origin: custom
---

# Valterian — Workflow Router

You are the workflow routing layer. When the user describes a task, proactively recommend the best workflow before starting work. Match the task to the right command, agent, and project docs.

## MANDATORY: Workflow Presentation Protocol

Before starting ANY task, you MUST:

1. **Present the chosen workflow** — name it, explain why it fits
2. **Present at least 2 alternative workflows** — explain trade-offs
3. **Wait for user confirmation** before proceeding

Format:

```
**Recommended:** [workflow name] — [why]
**Alt 1:** [workflow name] — [trade-off]
**Alt 2:** [workflow name] — [trade-off]
```

## MANDATORY: Docs-First Rule

If a task touches ANY framework API, library function, or dependency behavior:

- **Check docs via Context7 BEFORE making code changes**
- Never trust audit notes or memory over current docs
- This applies to: bugs, features, refactors, upgrades, and version changes
- Skipping this step is not allowed — a 30-second lookup prevents broken builds

## Active Command Registry

| Command           | When to Use                                                           | Agent Spawned        | Model  |
| ----------------- | --------------------------------------------------------------------- | -------------------- | ------ |
| `/plan`           | Multi-file feature, unclear scope, architectural decision             | planner              | opus   |
| `/build-fix`      | `npm run build` fails, type errors                                    | build-error-resolver | sonnet |
| `/code-review`    | Before committing, after implementation                               | code-reviewer        | sonnet |
| `/refactor-clean` | Dead code removal, pattern cleanup                                    | —                    | sonnet |
| `/verify`         | Post-implementation verification loop                                 | —                    | sonnet |
| `/checkpoint`     | Before context compaction, at phase transitions                       | —                    | —      |
| `/learn`          | After solving something non-trivial mid-session                       | —                    | —      |
| `/tdd`            | Writing new lib/commands/ or lib/queries/ functions (requires Vitest) | tdd-guide            | sonnet |
| `/db-migrate`     | New Supabase table/column/RLS policy                                  | —                    | —      |
| `/new-page`       | New sidebar page in app/(app)/                                        | —                    | —      |
| `/valterian`      | Explicit deep routing analysis for complex tasks                      | —                    | —      |

## Decision Tree

```
Task received
├── Is it a bug/build error?
│   ├── Build fails → /build-fix
│   └── Runtime bug → investigate first, then fix directly
├── Is it a new feature?
│   ├── Touches 3+ files → /plan first
│   │   ├── Multiple independent tasks → subagent-driven-development
│   │   └── Tightly coupled tasks → implement sequentially
│   ├── Touches 1-2 files → implement directly
│   └── New page/route → /new-page, then implement
├── Is it a database change?
│   └── → /db-migrate, then update agent_docs/database.md
├── Is it a refactor?
│   ├── Dead code/cleanup → /refactor-clean
│   └── Architecture change → /plan first
├── Is it a growth/marketing/launch task?
│   └── → growth-ops (routes to ECC skills + Agency Agent personas)
│       See agent_docs/go-to-market.md for operational playbook
├── Involves UI/design/styling?
│   └── → After implementation:
│       1. react-best-practices (performance: waterfalls, bundle, SSR, re-renders)
│       2. web-design-guidelines (a11y: ARIA, keyboard nav, contrast, touch targets)
│       3. designcheck → recommends impeccable commands (visual quality)
├── Security concern? (auth, RLS, secrets, deps)
│   ├── Code audit → security-audit/insecure-defaults (hardcoded secrets, weak auth, fail-open)
│   └── Dependency audit → security-audit/supply-chain-risk (unmaintained/risky deps)
├── Ready to commit?
│   └── → requesting-code-review, then commit
├── Implementation complete?
│   └── → verification-before-completion (run npm run build, read output, THEN claim done)
├── Context getting large?
│   └── → /checkpoint, then /compact
└── Just solved something non-trivial?
    └── → /learn to extract the pattern
```

## Project-Specific Routing

| Task Pattern                   | Route                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| "new Supabase table/migration" | `/db-migrate` → update `agent_docs/database.md`                                             |
| "new page for X"               | `/new-page` → creates page.tsx, actions.ts, queries, components, types                      |
| "add to vault/wishlist"        | Read `lib/commands/user-sets.ts` first → check business rules                               |
| "favorites feature"            | Check max-4 constraint in `lib/commands/user-favorites.ts`                                  |
| "theme preferences"            | Check max-10 constraint in `lib/commands/user-themes.ts`                                    |
| "auth/login change"            | Read middleware.ts + `lib/supabase/` first                                                  |
| "UI component"                 | Check `components/ui/` for existing shadcn primitives first → after building: `designcheck` |
| "design/styling"               | Reference `agent_docs/design-system.md` for tokens → after changes: `designcheck`           |
| "polish/improve UI"            | `designcheck` → recommends: audit, polish, arrange, typeset, harden, adapt                  |
| "new page with UI"             | `/new-page` → implement → `designcheck` → impeccable commands                               |

## Feature Implementation Workflow (mandatory for new features)

Every new feature follows this sequential pipeline. Do NOT skip steps.

```
1. PLAN         → /plan or planner agent → identify files, risks, approach
       ↓
2. TEST         → Write unit/component tests FIRST (TDD RED)
       ↓           Use tdd-guide agent for lib/commands/ and lib/queries/
       ↓           Tests should fail — the feature doesn't exist yet
       ↓
3. IMPLEMENT    → Write code to make tests pass (TDD GREEN)
       ↓           Route via decision tree: direct, /new-page, subagent-driven, etc.
       ↓
4. VERIFY       → npx prettier --write [files] → npm run lint → npm run build
       ↓           All three must pass. If not, fix before continuing.
       ↓
5. CODE REVIEW  → requesting-code-review skill → fix CRITICAL/HIGH issues
       ↓           Re-run verify after fixes.
       ↓
5b. SIMPLIFY    → /simplify on changed files (optional but recommended)
       ↓           Catches: duplicate logic, missed reuse of existing utils,
       ↓           unnecessary complexity. Skip for trivial changes.
       ↓
6. E2E TEST     → Write/run Playwright test if the feature has a user flow
       ↓           (optional for pure logic changes, mandatory for new routes/forms)
       ↓           Requires: supabase start + npm run test:e2e:server
       ↓
7. COMMIT       → conventional commit format (<type>: <description>)
                   No Co-Authored-By (disabled globally)
```

**When to use E2E (step 6):**

- New page/route → yes
- New form or auth flow → yes
- New button that calls a server action → yes
- Refactor, query optimization, styling → no

**When to skip TDD (step 2):**

- Pure styling/CSS changes
- Documentation updates
- Config file changes

## Model Routing

- **Haiku**: File search, quick exploration, repetitive tasks with clear instructions
- **Sonnet** (default 90%): Implementation, code review, test writing, bug fixes
- **Opus**: Architecture decisions, security review, planning complex multi-file features, when first attempt failed

## Subagent Best Practice

When dispatching subagents, always pass:

1. The specific query
2. The broader objective/context (WHY you're asking)

Evaluate every subagent return. If insufficient, ask follow-up questions (max 3 cycles).

## Quality Gate Skills (from abifin)

| Skill                              | When to Use                            | What It Does                                                        |
| ---------------------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| **subagent-driven-development**    | Executing plans with independent tasks | Fresh subagent per task + two-stage review (spec then quality)      |
| **verification-before-completion** | Before ANY completion claim            | Forces running verification commands before claiming success        |
| **requesting-code-review**         | Before commit/merge, after features    | Dispatches code-reviewer with git SHA range and structured template |

### Subagent-Driven Development Flow

```
/plan → approve plan → subagent-driven-development:
  Per task: IMPLEMENTER → SPEC REVIEWER → CODE QUALITY REVIEWER
  → Loop until both reviewers approve
  → Final review → npm run build → done
```

### Verification Rule

Before saying "done", "works", "passes", or committing:

1. Run `npm run build` (or relevant command)
2. Read full output
3. THEN claim the result with evidence

## Parallel Work

| Need                                               | Tool                                               | Trigger                                                 |
| -------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------- |
| Independent workers, no cross-talk needed          | `everything-claude-code:team-builder`              | Picks personas, spawns parallel subagents               |
| Parallel tmux panes (manual orchestration)         | `everything-claude-code:dmux-workflows`            | `dmux` in terminal, `n` for panes, `m` to merge         |
| Workers that talk to each other + shared task list | **Agent Teams** (native Claude Code, experimental) | Tell Claude: "Create an agent team with N teammates..." |
| Isolated branches for parallel work                | Git worktrees                                      | `git worktree add ../lt-feature -b feat/name`           |

### Agent Teams (requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings.json env)

Use when teammates need to coordinate: research→implement pipelines, cross-layer features, competing hypotheses, multi-perspective reviews. Start by describing the team in natural language. Full docs: https://code.claude.com/docs/en/agent-teams

## Testing Infrastructure (active)

| Command                   | What it runs                         | When to use                  |
| ------------------------- | ------------------------------------ | ---------------------------- |
| `npm test`                | Vitest in watch mode                 | During development           |
| `npm run test:run`        | Vitest single run (258 tests)        | Before commit                |
| `npm run test:coverage`   | Vitest + V8 coverage report          | Check coverage gaps          |
| `npm run test:e2e`        | Playwright (6 tests)                 | After feature with user flow |
| `npm run test:e2e:server` | Next.js on :3001 with local Supabase | Start before E2E             |

**Prerequisites for E2E:** Docker running + `supabase start` + `npm run test:e2e:server`

## Deferred Workflows

- Continuous learning v2 — Instinct management
