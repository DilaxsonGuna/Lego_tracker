# CLAUDE.md

Lego Tracker — a social Lego collection tracker. Users browse sets, manage a vault (collection + wishlist), follow other collectors, and curate a profile.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · shadcn/ui (new-york) · Supabase (Postgres + Auth + RLS)

## Commands

```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Production build (use to verify before committing)
npm run lint     # ESLint
```

## Project Structure

```
app/
  (app)/          # Sidebar pages: /, /explore, /vault, /profile, /settings
  auth/           # Auth pages (no sidebar): login, sign-up, onboarding
components/
  ui/             # shadcn/ui primitives
  shared/         # Sidebar, mobile header, logo, footer, theme-selector
  {page}/         # Page-specific components with index.ts barrel exports
lib/
  queries/        # Read operations (Supabase → typed data)
  commands/       # Write operations (mutations with error handling)
  hooks/          # Client-side hooks (useUser)
  supabase/       # Client/server/proxy Supabase clients
types/            # TypeScript type definitions per domain
```

## Data Flow

```
page.tsx (server) → actions.ts → lib/queries/*.ts → Supabase
                  → actions.ts → lib/commands/*.ts → Supabase
```

- Server components fetch data, pass to client components for interactivity
- Client components call server actions for mutations, then `router.refresh()`
- `lib/queries/` = reads, `lib/commands/` = writes — never mix

## Key Conventions

- **New sidebar page:** create folder in `app/(app)/`, add `page.tsx` + `actions.ts`, create matching `lib/queries/`, `components/`, and `types/` files
- **New component:** add to `components/{page}/`, export from its `index.ts` barrel
- **Supabase clients:** use `lib/supabase/server.ts` in server components/actions, `lib/supabase/client.ts` in client components
- **Auth:** cookie-based via `@supabase/ssr`, middleware manages sessions, unauthenticated users → `/auth/login`
- **Imports:** use `@/*` path alias (maps to project root)
- **UI primitives:** `npx shadcn@latest add <component-name>`
- **Toasts:** use `sonner` (already configured)

## Business Rules

- Max **4** favorite sets per user (enforced in `lib/commands/user-favorites.ts`)
- Max **10** theme preferences per user (enforced in `lib/commands/user-themes.ts`)
- Unique constraint on (user_id, set_num) in user_sets and user_favorites
- Unique constraint on (follower_id, following_id) in follows
- All user data tables have RLS: users can only CRUD their own records

## Environment

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

## Design System

BrickBox theme — Lego yellow (`#ffd000`) primary, warm dark palette. Design tokens defined as CSS variables in `globals.css`. See `agent_docs/design-system.md` for full token reference.

## Deeper Reference

Detailed documentation lives in `agent_docs/` — read these when working on specific areas:

- `agent_docs/architecture.md` — Routes, component catalog, layout system
- `agent_docs/database.md` — Full schema, relationships, RLS policies, migrations
- `agent_docs/design-system.md` — Color tokens, custom utilities, typography
