# Lego Tracker

A social LEGO collection tracker. Browse sets, manage a vault (collection + wishlist), follow other collectors, and curate a public profile. Branded **BrickMaster** with the **BrickBox** design theme.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Supabase (Postgres + Auth + RLS) · Sentry · PostHog

---

## Prerequisites

| Tool                                                      | Version | Notes                                |
| --------------------------------------------------------- | ------- | ------------------------------------ |
| [Node.js](https://nodejs.org)                             | 22+     | `node -v`                            |
| npm                                                       | 10+     | ships with Node                      |
| [Docker](https://www.docker.com/products/docker-desktop/) | latest  | required to run Supabase locally     |
| [Supabase CLI](https://supabase.com/docs/guides/cli)      | 2.78+   | `brew install supabase/tap/supabase` |

---

## Local setup

```bash
# 1. Install dependencies
git clone <repo-url> && cd Lego_tracker
npm install

# 2. Start the local Supabase stack (Postgres, Auth, Storage, Studio) via Docker
supabase start

# 3. Create your env file (see "Environment variables" below)
cp .env.example .env.local
#    then fill in the LOCAL values printed by `supabase status`

# 4. Build the database: migrations + seed (catalog + dev logins)
npm run db:reset

# 5. Run the app
npm run dev
```

The app runs at **[localhost:3000](http://localhost:3000)** and Supabase Studio at **[localhost:54323](http://127.0.0.1:54323)**.

### Local env values

After `supabase start`, run `supabase status` and copy the values into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<"Publishable key" from supabase status>
SUPABASE_SERVICE_ROLE_KEY=<"service_role key" from supabase status>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Seeded dev logins

`npm run db:reset` creates two local accounts (a copy of prod users, with a shared dev password):

| Email                    | Username | Password       |
| ------------------------ | -------- | -------------- |
| `dilax2001@gmail.com`    | dixi     | `Password123!` |
| `nicef98651@gopicta.com` | admin    | `Password123!` |

> These exist **only** in the local seed (`supabase/seed.sql`) and must never be used in production.

---

## Database workflow

Schema and data live under `supabase/`:

```
supabase/
  migrations/              Ordered SQL migrations (source of truth for the schema)
    000_production_schema.sql    Baseline schema (tables, RPCs, RLS)
    001_create_notifications.sql Notifications table + policies
    002_follows_performance.sql  Denormalized follow counts + trigger + indexes
  seed.sql                 Identity fixtures (auth users + profiles), auto-loaded on reset
  seeds/
    catalog/*.csv.gz        Large static catalog (themes, lego_sets, set_prices), gzipped
    fixtures/*.csv          Per-user collection data (depends on the catalog)
```

Seeding is split on purpose: `seed.sql` holds small, readable identity fixtures and loads automatically during `supabase db reset`. The bulk catalog (~57k rows) is stored compressed and loaded separately by `scripts/seed-local-data.sh` via `COPY` — this keeps the repo lean and avoids the seeder's limitations.

### Commands

| Command                | What it does                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| `npm run db:reset`     | Recreate the local DB from migrations, then load catalog + fixtures. **Wipes local data.** |
| `npm run db:seed-data` | Reload just the catalog + collection data (idempotent), without a full reset               |
| `supabase db reset`    | Migrations + `seed.sql` only (logins/profiles, no catalog)                                 |

### Adding a migration

```bash
supabase migration new <descriptive_name>   # creates supabase/migrations/<ts>_<name>.sql
# edit the SQL (follow the RLS conventions in agent_docs/database.md)
npm run db:reset                              # apply + verify locally
```

### Deploying schema to production

The repo is the single source of truth — local and prod migration history are aligned (`000`, `001`, `002`).

```bash
supabase link --project-ref <prod-ref>   # one-time (asks for the DB password)
supabase db push                          # applies any pending migrations to prod
```

Migrations are additive and never touch existing rows. After pushing, verify in the dashboard or via the REST API.

---

## Environment variables

Defined in `.env.local` (git-ignored). See `.env.example` for the full template.

| Variable                               | Required | Purpose                                                   |
| -------------------------------------- | -------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | ✅       | Supabase API URL (local: `http://127.0.0.1:54321`)        |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅       | Publishable/anon key                                      |
| `SUPABASE_SERVICE_ROLE_KEY`            | ✅       | Service-role key (server-only; price sync, admin scripts) |
| `NEXT_PUBLIC_SITE_URL`                 | ✅       | Base URL for auth redirects (`http://localhost:3000`)     |
| `NEXT_PUBLIC_SENTRY_DSN`               | —        | Sentry error monitoring                                   |
| `NEXT_PUBLIC_POSTHOG_KEY`              | —        | PostHog analytics project key                             |
| `NEXT_PUBLIC_POSTHOG_HOST`             | —        | PostHog ingestion host (`https://us.i.posthog.com`)       |
| `BRICKSET_API_KEY`                     | —        | Brickset API key for the price sync script                |

---

## Scripts & tooling

| Command                     | Description                                       |
| --------------------------- | ------------------------------------------------- |
| `npm run dev`               | Next.js dev server                                |
| `npm run build`             | Production build (run before committing)          |
| `npm run lint`              | ESLint                                            |
| `npm run test` / `test:run` | Vitest (watch / once)                             |
| `npm run test:coverage`     | Vitest with coverage                              |
| `npm run test:e2e`          | Playwright E2E tests                              |
| `npm run types:generate`    | Regenerate `types/supabase.ts` from the DB schema |

---

## Project structure

```
app/(app)/      Sidebar pages: /, /explore, /vault, /profile, /settings
app/auth/       Auth pages: login, sign-up, onboarding
components/     UI primitives (ui/), shared chrome (shared/), page-specific
lib/queries/    Reads  (Supabase → typed data)
lib/commands/   Writes (mutations with error handling)
lib/supabase/   Client/server Supabase clients
supabase/       Migrations + seed data
types/          TypeScript types per domain
```

Deeper documentation lives in [`CLAUDE.md`](./CLAUDE.md) and [`agent_docs/`](./agent_docs) — architecture, full database schema/RLS, and the design system.
