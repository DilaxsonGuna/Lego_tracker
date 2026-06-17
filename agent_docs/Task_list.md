# BrickMaster Development Task List

> Generated 2026-03-20 from full codebase audit + agent_docs analysis.
> Priority: P0 (blocks launch) > P1 (pre-launch) > P2 (post-launch) > P3 (growth phase)
>
> **V1 Scope:** Personal collection/wishlist tracker + friends can see your sets.
> No AI scanning. No leaderboard. No achievements. No monetization. Web only.

---

## P0 — Critical Fixes (Blocks Deployment)

### T-001: Fix stale Supabase type definitions ✅ DONE

- [x] Added `brick_score`, `sets_count`, `pieces_count` to `profiles` types
- [x] Added `notifications` table definition
- [x] Added `user_themes` table definition
- [x] Added `search_sets` RPC function definition
- [ ] Remove `as unknown as` casts (deferred to refactor pass)

**Why:** Leaderboard, profile stats, and user-stats commands reference columns missing from types.

### T-002: Fix `revalidateTag` invalid call signature ✅ NOT A BUG

- [x] Investigated: Next.js 16 `revalidateTag(tag, profile)` requires 2 args. `"default"` is the cache profile.
- [x] Original code was correct. CTO audit was based on Next.js 15 API.

**Why:** Was flagged as bug but is valid Next.js 16 API.

### T-003: Pin dependency versions in package.json ✅ DONE

- [x] `next`: `"latest"` → `"^16.0.7"`
- [x] `@supabase/ssr`: `"latest"` → `"^0.8.0"`
- [x] `@supabase/supabase-js`: `"latest"` → `"^2.86.2"`
- [x] Lock file updated, build verified

**Why:** Any `npm install` could pull breaking major versions.

### T-004: Fix ESLint errors (14 errors) ✅ DONE

- [x] Removed unused imports and vars
- [x] Fixed unescaped entities, `any` types, empty interfaces
- [x] Build passes, lint clean (0 errors, 0 warnings)

**Why:** Clean lint = clean CI pipeline.

---

## P1 — Pre-Launch Quality (High Impact)

### T-010: Optimize `calculateGlobalPosition` N+1 query ✅ DONE

- [x] Replaced O(n) JS aggregation with single SQL COUNT on `profiles.brick_score`

**Why:** Profile page loaded entire user_sets table into memory.

### T-011: Consolidate redundant `getUser()` calls ✅ DONE

- [x] Vault page: single `getUser()` in page.tsx, pass `userId` directly to all queries
- [x] Reduced auth roundtrips from 8 to 1 per vault page load

**Why:** 8 redundant auth HTTP roundtrips per vault page load.

### T-012: Add missing database indexes ✅ DONE

- [x] `profiles(brick_score DESC)` — leaderboard sort
- [x] `profiles(lower(username))` UNIQUE — username lookups
- [x] `follows(following_id)` — already existed

**Why:** Leaderboard and username queries now use indexes.

### T-013: Add missing migration files ✅ DONE

- [x] Migrations 010+011 created and pushed to remote

**Why:** Schema now fully reproducible from migrations.

### T-014: Document `NEXT_PUBLIC_SITE_URL` env var ✅ DONE

- [x] Added to `.env.example` and CLAUDE.md

**Why:** Password reset emails need correct redirect URL in production.

---

## P2 — UI/UX Polish (Pre-Launch)

### T-020: Add branding to auth pages ✅ DONE

- [x] Auth layout with logo, gradient, stud-bg

### T-021: Replace Puzzle logo icon with brick/stud icon ✅ DONE

- [x] Custom 2x2 brick SVG

### T-022: Remove misleading UI indicators ✅ DONE

- [x] `isOnline` set to `false`, dynamic copyright year

### T-023: Fix bio character limit inconsistency ✅ DONE

- [x] `MAX_BIO_LENGTH = 200` in constants

### T-024: Apply `default_grid_view` user setting ✅ DONE

- [x] Fetched from profiles, passed as initial vault state

---

## V1 Release — Blockers (NEW)

### T-090: Rename app LegoFlex → BrickMaster ✅ DONE

- [x] Renamed in 13 source files: layout, auth, sidebar, mobile header, login/signup forms, welcome, profile share, search, settings
- [x] Logo component renamed `LegoFlexLogo` → `BrickMasterLogo`
- [x] Meta title/description updated
- [x] Build verified

**Why:** "LegoFlex" contains LEGO trademark. C&D risk.

### T-091: Privacy policy page ✅ DONE

- [x] Created `app/privacy/page.tsx` (public route, no auth required)
- [x] 8 sections: data collection, usage, storage, rights, cookies, children, changes, contact
- [x] LEGO trademark disclaimer included

**Why:** Legal requirement. GDPR applies to any EU visitor.

### T-092: Terms of service page ✅ DONE

- [x] Created `app/terms/page.tsx` (public route, no auth required)
- [x] 9 sections: acceptance, service, accounts, acceptable use, data accuracy, termination, liability, trademarks, changes

**Why:** Protects the project legally.

### T-093: LEGO trademark disclaimer ✅ DONE

- [x] Added to sidebar footer (always visible on desktop)
- [x] Added to settings page footer
- [x] Added to both legal pages
- [x] Links to /privacy and /terms from sidebar + settings

**Why:** LEGO Fair Play policy requires disclaimer on fan sites.

### T-094: Delete account functionality ✅ DONE

- [x] `lib/commands/delete-account.ts` — deletes all user data in dependency order
- [x] `components/settings/delete-account-dialog.tsx` — confirmation dialog requiring username re-type
- [x] Wired into Settings page under "Danger Zone" section
- [x] Redirects to login after deletion

**Why:** GDPR requires users to be able to delete their data.

### T-095: Remove leaderboard from navigation ✅ DONE

- [x] Removed from `lib/constants.ts` nav items
- [x] Route files kept (not deleted, just unlinked)

**Why:** Out of v1 scope. No purpose without active community.

### T-096: Remove milestones/achievements from profiles ✅ DONE

- [x] Removed `MilestoneVault` from own profile page
- [x] Removed `MilestoneVault` from public profile page
- [x] Removed `fetchMilestones` / `fetchPublicMilestones` from data fetching
- [x] Brick score + rank progress card KEPT (still displayed)
- [x] Analytics dashboard KEPT (still linked from vault)

**Why:** Out of v1 scope. Brick score/analytics kept as personal tracking features.

---

## P3 — Feature Gaps (Post-Launch Priority)

### T-030: Price data integration

- [ ] Research Rebrickable API for retail price data
- [ ] Add `retail_price` column to `lego_sets` table (migration)
- [ ] Create price sync script/cron (Rebrickable API -> lego_sets)
- [ ] Update vault queries to use real price data
- [ ] Update vault stats hero to show real "Collection Value"

**Why:** "#1 requested feature across all personas."

### ~~T-031: Set status tracking~~ DEFERRED

> Will re-implement as a full feature later (DB column + setter UI + filter).

### T-032: Followers/following list pages ✅ DONE (all 4 phases)

- [x] Core pages, UX polish, cursor-based pagination, social features (mutual followers, collection overlap, follow suggestions)

### T-033: Vault sort controls ✅ DONE

### T-034: Milestone celebration modals ✅ DONE

- [x] Detect milestones, confetti animation, Web Share API
- [ ] Track events (deferred to T-050 PostHog)

### T-035: Collection analytics dashboard ✅ DONE (all 4 phases)

- [x] KPIs, theme/year distribution charts, growth chart, notable sets

### T-036: CSV/PDF export

- [ ] Add "Export" button to vault toolbar
- [ ] Generate CSV with set data

**Why:** Serious collectors maintain parallel spreadsheets.

---

## P4 — Infrastructure & Performance

### T-040: Add `robots.txt` and `sitemap.xml` ✅ DONE

- [x] Created `app/robots.ts` — allows indexing of `/explore`, `/set/*`, `/u/*`, `/privacy`, `/terms`; disallows `/vault`, `/settings`, `/profile`, `/auth/`, `/api/`
- [x] Created `app/sitemap.ts` — includes `/`, `/explore`, `/privacy`, `/terms`

**Why:** SEO basics. Public profiles and set pages should be indexable.

### T-041: Set up monitoring (Sentry) ✅ DONE

- [x] Installed `@sentry/nextjs`
- [x] Created `sentry.client.config.ts` — error tracking + session replay (1% sessions, 100% error sessions)
- [x] Created `sentry.server.config.ts` — server-side error tracking
- [x] Created `sentry.edge.config.ts` — edge/middleware error tracking
- [x] Created `app/global-error.tsx` — reports to Sentry + shows user-friendly error page
- [x] Wrapped `next.config.ts` with `withSentryConfig()` — source maps upload, tree-shaking
- [x] Added `NEXT_PUBLIC_SENTRY_DSN` to `.env.example`
- [ ] **USER ACTION:** Create Sentry project at sentry.io, add DSN to `.env.local`

**Why:** No visibility into production errors without this.

### T-042: Parallelize sequential queries in vault

- [ ] Run favorites + main query in `Promise.all()`
- [ ] Use SQL DISTINCT instead of fetching all sets for themes
- [ ] Use SQL GROUP BY + COUNT instead of JS aggregation

**Why:** Vault page makes 9+ queries sequentially. Parallelizing saves 200-400ms.

### T-043: Add error logging to query functions ✅ DONE

- [x] Created `lib/log-error.ts` utility (centralised, swap-ready for Sentry later)
- [x] Added `logError()` calls to 27 error return points across 6 query files:
  - `home.ts` (4), `social.ts` (7), `profile.ts` (6), `set-detail.ts` (3), `explore.ts` (5), `notifications.ts` (2)
- [x] Guarded compound conditions (`if (error || !data)`) to only log when error exists

**Why:** Query failures were returning empty arrays silently. Now all errors are logged with context.

---

## P5 — Analytics & Pre-Monetization

### T-050: Integrate PostHog analytics

- [ ] Install `posthog-js` + `posthog-node`
- [ ] Create PostHog provider component
- [ ] Cookie consent banner
- [ ] Track core events: signup, set_added, collection_shared
- [ ] Activation funnel + retention cohorts

**Why:** No analytics = no data-driven decisions. PostHog free tier covers 1M events/month. Add when you have 50+ users.

### T-051: Track North Star metric (WAC)

- [ ] Define Weekly Active Collectors: users with vault mutations in past 7 days
- [ ] Create Supabase SQL function for WAC queries

**Why:** WAC captures product-market fit for a collection tracker.

---

## P6 — Growth & Monetization

### T-060: AI set verification pipeline (Scan feature)

- [ ] Camera scan → Gemini Flash identification → DB matching
- [ ] Rate limiting: 10/hour, 50/day per user

**Why:** Core differentiator. Out of v1 scope.

### T-061: Pro tier (BrickMaster Pro)

- [ ] Stripe integration ($4.99/mo or $39.99/yr)
- [ ] Feature gates: value tracking, export, unlimited collection cards

**Why:** Revenue. Out of v1 scope.

### T-062: Theme completion tracking

- [ ] Progress bars per theme on analytics dashboard
- [ ] "You own 42 of 87 Star Wars sets (48%)"

**Why:** Completionist persona killer feature.

### T-063: PWA support

- [ ] `manifest.json`, service worker, install prompt

**Why:** Mobile-first audience. "Add to Home Screen" for app-like experience.

### T-064: Email notification system

- [ ] Welcome email, weekly digest, milestone congrats, re-engagement

**Why:** No re-engagement mechanism currently.

### T-065: Landing page & pre-launch

- [ ] Public landing page with email capture
- [ ] SEO-optimized for "lego collection tracker"

**Why:** Pre-launch email list for launch day blast.

---

## P7 — Legal & Compliance

### T-070: Privacy policy & GDPR ✅ MOSTLY DONE

- [x] Created `/privacy` page
- [x] Documented data collection
- [x] "Delete my account" in settings
- [ ] "Export my data" button (JSON/CSV of vault) — deferred
- [ ] Cookie consent before loading PostHog — deferred (PostHog not installed yet)

**Why:** GDPR applies to EU users.

### T-071: Evaluate trademark risk ✅ DONE

- [x] Renamed from "LegoFlex" to "BrickMaster" (no LEGO trademark in name)
- [x] Added disclaimer: "Not affiliated with the LEGO Group" (sidebar, settings, legal pages)
- [x] "LEGO" used only as adjective in copy

**Why:** "LegoFlex" incorporated LEGO trademark. Now resolved.

### T-072: Remove Date of Birth from onboarding

- [ ] Remove DOB field from `onboarding-form.tsx`
- [ ] GDPR data minimization: collecting DOB without stated purpose is a violation

**Why:** Users don't understand why a LEGO tracker needs their birthday.

---

## Backlog — Nice to Have

### T-080: Image upload for avatars

Currently avatar is a color-based circle. Users need real profile photos for a social app.

### T-081: Bottom mobile navigation bar ✅ DONE

- [x] Already implemented: Home, Explore, Vault, Profile

### T-082: Vault "Select All" for bulk actions

Users with large collections must individually check each set.

### T-083: "Move to Wishlist" on collection tab

Currently only wishlist has "Move to Collection." Add reverse direction.

### T-084: Year range filter on Explore

"Star Wars sets from 2015-2020" — currently only theme + sort.

### T-085: Referral program

Unique referral URLs, reward for referrer. Out of v1 scope.

### T-086: "Year in Bricks" annual recap

Spotify Wrapped for LEGO. Out of v1 scope.

### T-087: Testing infrastructure ✅ DONE

- [x] 271 tests total (258 unit/component + 13 E2E), all passing
- [x] Vitest 4.x + RTL 16.x + Playwright

### T-088: CI/CD pipeline

GitHub Actions: build + lint + test on PR. Preview deployments on Vercel.

---

## Progress Tracking

| Priority                | Total  | Done   | Remaining |
| ----------------------- | ------ | ------ | --------- |
| P0 Critical             | 4      | 4      | 0         |
| P1 Pre-Launch           | 5      | 5      | 0         |
| P2 UI/UX Polish         | 5      | 5      | 0         |
| **V1 Release Blockers** | **7**  | **7**  | **0**     |
| P3 Feature Gaps         | 7      | 5      | 2         |
| P4 Infrastructure       | 4      | 3      | 1         |
| P5 Analytics            | 2      | 0      | 2         |
| P6 Growth               | 6      | 0      | 6         |
| P7 Legal                | 3      | 2      | 1         |
| Backlog                 | 9      | 2      | 7         |
| **Total**               | **52** | **33** | **19**    |

### V1 Release Readiness

All blockers resolved. Remaining before deploying:

1. Add `NEXT_PUBLIC_SENTRY_DSN` to `.env.local` (user action — create Sentry project)
2. T-072: Remove DOB from onboarding (GDPR data minimization)
3. Verify `npm run build` on deployment target

---

_Last updated: 2026-03-27_
