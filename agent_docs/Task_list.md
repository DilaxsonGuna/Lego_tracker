# LegoFlex Development Task List

> Generated 2026-03-20 from full codebase audit + agent_docs analysis.
> Priority: P0 (blocks launch) > P1 (pre-launch) > P2 (post-launch) > P3 (growth phase)

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

- [x] Removed unused `FavoritesGrid` import (profile-client.tsx)
- [x] Removed unused `isInVault`, `hasChanges`, `inDialog` vars (discovery-card, theme-filter-modal, theme-selector)
- [x] Removed unused `searchParams` (search-page-client.tsx)
- [x] Suppressed `selectedSetNums` in vault-bulk-actions (kept in interface for caller)
- [x] Fixed 4x unescaped `"` → `&ldquo;`/`&rdquo;` (theme-filter-modal, theme-selector)
- [x] Fixed 2x `any` → `Record<string, unknown>` (explore.ts)
- [x] Fixed empty interface → type alias (onboarding-form.tsx)
- [x] Replaced `require()` → ES import (tailwind.config.ts)
- [x] Added eslint-disable for `<img>` in following-activity (external URLs, can't use next/image)
- [x] Build passes, lint clean (0 errors, 0 warnings)

**Why:** Clean lint = clean CI pipeline.

---

## P1 — Pre-Launch Quality (High Impact)

### T-010: Optimize `calculateGlobalPosition` N+1 query

- [ ] Replace the current implementation in `lib/queries/profile.ts` (loads ALL user_sets) with a SQL COUNT on `profiles.brick_score`
- [ ] Match the pattern already used in `lib/queries/leaderboard.ts`

**Why:** Profile page loads entire user_sets table into memory. Will crash at 1000+ users.

### T-011: Consolidate redundant `getUser()` calls

- [ ] Vault page: refactor to call `getUser()` once in page.tsx, pass `userId` to all queries
- [ ] Profile page: same pattern — single auth call, pass ID downstream
- [ ] Create `lib/supabase/auth.ts` helper: `getAuthenticatedUser()` returning `{ supabase, user }`

**Why:** 7+ redundant auth roundtrips per vault page load. Adds 200-300ms latency.

### T-012: Add missing database indexes

- [ ] `profiles(brick_score DESC)` — leaderboard sort
- [ ] `profiles(lower(username))` UNIQUE — username lookups
- [ ] `follows(following_id)` — "who follows me" queries
- [ ] `user_sets(collection_type, created_at DESC)` — recently added queries

**Why:** Leaderboard and feed queries will degrade as data grows.

### T-013: Add missing migration files

- [ ] Audit all schema elements vs existing migrations
- [ ] Create migration for `profiles` computed columns (`brick_score`, `sets_count`, `pieces_count`)
- [ ] Create migration for `profiles` settings columns (`profile_visible`, `default_grid_view`, `email_notifications`)
- [ ] Ensure `user_sets` base table has a migration (predates tracked migrations)
- [ ] Add CHECK constraint on `user_sets.collection_type IN ('collection', 'wishlist')`
- [ ] Add DB trigger for max-4-favorites enforcement

**Why:** Cannot reproduce database from migrations alone. New environments will fail.

### T-014: Document `NEXT_PUBLIC_SITE_URL` env var

- [ ] Add to `.env.example`
- [ ] Add to CLAUDE.md environment section
- [ ] Verify password reset emails use it correctly in production

**Why:** Password reset emails will contain `localhost:3000` URLs in production.

---

## P1 — UI/UX Polish (Pre-Launch)

### T-020: Add branding to auth pages

- [ ] Create shared auth layout wrapper with LegoFlex logo above card
- [ ] Add stud-pattern background with gradient overlay
- [ ] Add subtle `border-primary/20` on auth cards
- [ ] Update copy: "Welcome back, Builder" / "Join the Collection"

**Why:** Auth pages are the front door. Currently generic starter-kit appearance with zero brand identity.

### T-021: Replace Puzzle logo icon with brick/stud icon

- [ ] `components/shared/legoflex-logo.tsx` — replace `Puzzle` from Lucide with a brick SVG or `Box` icon

**Why:** Puzzle icon suggests jigsaw puzzles, not LEGO bricks. Most visible brand element.

### T-022: Remove misleading UI indicators

- [ ] `lib/queries/profile.ts` — remove `isOnline: true` hardcode (or remove online indicator from profile-hero)
- [ ] `lib/queries/profile.ts` — remove `isVerified: false` hardcode (or remove badge from profile-hero)
- [ ] `components/shared/footer.tsx` — change `2024` to `{new Date().getFullYear()}`

**Why:** Green "online" dot is always on (lying). Verified badge never appears. Copyright year outdated.

### T-023: Fix bio character limit inconsistency

- [ ] Create shared constant `MAX_BIO_LENGTH = 200` (or 160 — pick one)
- [ ] Use in both `onboarding-form.tsx` and `edit-profile-form.tsx`

**Why:** Onboarding allows 160 chars, edit profile allows 200. Confusing for users.

### T-024: Apply `default_grid_view` user setting

- [ ] Pass `default_grid_view` from server to `VaultPageClient` as prop
- [ ] Use as initial `viewMode` state instead of hardcoded `"grid"`

**Why:** Users toggle the setting in preferences but it's never applied. Broken setting = broken trust.

---

## P2 — Feature Gaps (Post-Launch Priority)

### T-030: Price data integration

- [ ] Research Rebrickable API for retail price data
- [ ] Add `retail_price` column to `lego_sets` table (migration)
- [ ] Create price sync script/cron (Rebrickable API -> lego_sets)
- [ ] Update vault queries to use real price data
- [ ] Update vault stats hero to show real "Collection Value"
- [ ] Update vault cards to show per-set price
- [ ] Gate advanced price analytics (market value, trends) behind Pro tier

**Why:** "#1 requested feature across all personas." Currently removed ($0 was worse than nothing).

### T-031: Set status tracking

- [ ] Add `status` column to `user_sets` table (migration): `CHECK (status IN ('built', 'in-box', 'missing-parts', 'for-sale'))`
- [ ] Create status selector UI (dropdown or context menu on vault cards)
- [ ] Add status filter to vault toolbar
- [ ] Ensure status badges in vault-card.tsx and vault-list.tsx read from DB

**Why:** UI already renders status badges but there's no DB column or setter. High-value for serious collectors.

### T-032: Followers/following list pages

- [ ] Create `app/(app)/u/[userId]/followers/page.tsx`
- [ ] Create `app/(app)/u/[userId]/following/page.tsx`
- [ ] Create reusable `UserList` component with follow/unfollow buttons
- [ ] Make follower/following/friends counts clickable in `profile-hero.tsx`
- [ ] Same for public profile `profile-client.tsx`

**Why:** Social graph exists in DB but is invisible in UX. Counts show but aren't clickable.

### T-033: Vault sort controls

- [ ] Add sort dropdown to vault toolbar: Date Added, Name A-Z, Year, Most Pieces, Favorites First
- [ ] Make sort work on both desktop and mobile (include in mobile filter sheet)
- [ ] Persist sort preference in URL params or localStorage

**Why:** Vault has no user-facing sort. Users with 100+ sets can't organize their collection.

### T-034: Milestone celebration modals

- [ ] Detect when user crosses a milestone threshold after adding a set
- [ ] Show celebration modal with confetti animation + milestone badge
- [ ] Add "Share" CTA in modal to generate milestone-specific shareable image
- [ ] Track `milestone_reached` and `milestone_shared` events

**Why:** Milestones appear silently on profile. No celebration = no share trigger = no viral loop.

### T-035: Collection analytics dashboard

- [ ] Theme distribution chart (donut/bar — join user_sets -> lego_sets -> themes)
- [ ] Year distribution chart (group by decade/year)
- [ ] Collection growth timeline (sets added over time from `created_at`)
- [ ] "Biggest Set" highlight (max num_parts)
- [ ] Consider gating behind Pro tier

**Why:** Data-driven collectors want insights. No competitor offers collection analytics.

### T-036: CSV/PDF export

- [ ] Add "Export" button to vault toolbar
- [ ] Generate CSV with: set_num, name, year, theme, pieces, collection_type, status, date_added
- [ ] Optional: PDF export with formatted layout
- [ ] Consider gating behind Pro tier

**Why:** Serious collectors maintain parallel spreadsheets. Export reduces friction.

---

## P2 — Infrastructure & Performance

### T-040: Add `robots.txt` and `sitemap.xml`

- [ ] Create `app/robots.ts` — allow indexing of public profiles and set pages
- [ ] Create `app/sitemap.ts` — include `/explore`, `/leaderboard`, public `/u/[userId]` pages

**Why:** SEO basics missing. Public profiles should be indexable.

### T-041: Set up monitoring (Sentry or Vercel Analytics)

- [ ] Install error tracking (Sentry recommended)
- [ ] Add to `app/layout.tsx` and server actions
- [ ] Configure source maps for production
- [ ] Set up error alerts

**Why:** No visibility into production errors. Flying blind.

### T-042: Parallelize sequential queries in vault

- [ ] `lib/queries/vault.ts` — run favorites + main query in `Promise.all()`
- [ ] `lib/queries/vault.ts:getVaultThemes` — use SQL DISTINCT instead of fetching all sets
- [ ] `lib/queries/user-themes.ts:getPopularThemes` — use SQL GROUP BY + COUNT instead of JS aggregation

**Why:** Vault page makes 9+ queries sequentially. Parallelizing saves 200-400ms.

### T-043: Add error logging to query functions

- [ ] Add `console.error("[functionName]", error.message, error.code)` to all `lib/queries/*.ts` functions
- [ ] Currently query failures return empty arrays silently — bugs are invisible

**Why:** Query failures show empty states instead of errors. Database timeouts look like "you have no sets."

---

## P2 — Analytics & Pre-Monetization

### T-050: Integrate PostHog analytics

- [ ] Install `posthog-js` + `posthog-node`
- [ ] Create PostHog provider component in `app/(app)/layout.tsx`
- [ ] Add cookie consent banner (block PostHog until consent)
- [ ] Implement `posthog.identify()` on login with user properties
- [ ] Track core events: signup, set_added, collection_shared, leaderboard_viewed
- [ ] Set up activation funnel dashboard
- [ ] Set up D1/D7/D30 retention cohorts

**Why:** No analytics = no data-driven decisions. PostHog free tier covers 1M events/month.

### T-051: Track North Star metric (WAC)

- [ ] Define Weekly Active Collectors: users with vault mutations in past 7 days
- [ ] Create Supabase SQL function for quick WAC queries
- [ ] Add to PostHog dashboard
- [ ] Set up weekly automated report

**Why:** WAC is the metric that best captures product-market fit for a collection tracker.

---

## P3 — Growth & Monetization

### T-060: AI set verification pipeline (Scan feature)

- [ ] Client-side: EXIF extraction with `exifr` (camera-specific fields only)
- [ ] Client-side: Canvas API image resize (max 1600px, JPEG 85%)
- [ ] Server: Presigned upload URL to Supabase Storage
- [ ] Server: Gemini 2.5 Flash API call for identification + fraud detection
- [ ] Server: 3-tier DB matching (direct lookup -> fuzzy search -> Rebrickable API)
- [ ] UI: Results page with confirmed/fuzzy/manual search states
- [ ] UI: `/scan` route with camera entry point
- [ ] Rate limiting: 10/hour, 50/day per user

**Why:** Core differentiator. Photo verification replaces manual "Add to Collection." Tested 6/6 correct.

### T-061: Pro tier (LegoFlex Pro)

- [ ] Stripe integration for payments ($4.99/mo or $39.99/yr)
- [ ] Pro badge on profile
- [ ] Feature gates: value tracking, analytics, export, unlimited collection cards
- [ ] Pricing page UI
- [ ] 14-day free trial flow
- [ ] Founding member pricing ($29.99/yr, locked for life, first 1000)

**Why:** Revenue. Target 3-5% conversion of MAU. Projected $18-39K ARR at Month 12.

### T-062: Theme completion tracking

- [ ] Query: count user's sets per theme vs total sets in theme
- [ ] UI: Progress bars per theme on analytics dashboard
- [ ] "You own 42 of 87 Star Wars sets (48%)"
- [ ] Consider gating behind Pro tier

**Why:** Completionist persona killer feature. No competitor offers this.

### T-063: PWA support

- [ ] Create `manifest.json` with app metadata and icons
- [ ] Add service worker for offline caching
- [ ] Add install prompt for mobile users

**Why:** Mobile-first audience. PWA enables "Add to Home Screen" for app-like experience.

### T-064: Email notification system

- [ ] Set up Resend (or similar) for transactional emails
- [ ] Welcome email on signup
- [ ] Weekly digest: activity from followed users
- [ ] Milestone congratulations
- [ ] Re-engagement: "You haven't visited in 2 weeks"
- [ ] Honor `email_notifications` user setting

**Why:** No re-engagement mechanism currently. Users who leave have no trigger to return.

### T-065: Landing page & pre-launch

- [ ] Create public landing page with email capture
- [ ] SEO-optimized for "lego collection tracker", "lego inventory app"
- [ ] Collection Card preview as visual hook
- [ ] "What's your LEGO rank?" headline

**Why:** Pre-launch email list for launch day blast. SEO long-game.

---

## P3 — Legal & Compliance

### T-070: Privacy policy & GDPR

- [ ] Create `/privacy` page (currently dead link)
- [ ] Document what data is collected and why
- [ ] Add "Delete my account" in settings (remove all user data)
- [ ] Add "Export my data" button (JSON/CSV of vault)
- [ ] Cookie consent before loading PostHog

**Why:** GDPR applies to any EU users. Currently no privacy policy, no data deletion, no export.

### T-071: Evaluate trademark risk

- [ ] Research LEGO Group Fair Play policy on "LegoFlex" name
- [ ] Prepare backup names: BrickVault, BrickFlex, StudTracker
- [ ] Add disclaimer: "Not affiliated with the LEGO Group"
- [ ] Ensure "LEGO" used only as adjective in all copy

**Why:** "LegoFlex" incorporates LEGO trademark. Could trigger cease-and-desist.

### T-072: Remove Date of Birth from onboarding

- [ ] Remove DOB field from `onboarding-form.tsx`
- [ ] Or move to Settings with clear justification
- [ ] GDPR data minimization: collecting DOB without stated purpose is a violation

**Why:** Users don't understand why a LEGO tracker needs their birthday. Privacy friction.

---

## Backlog — Nice to Have

### T-080: Image upload for avatars

Currently avatar is a color-based circle. Users need real profile photos for a social app.

### T-081: Bottom mobile navigation bar

5 core destinations (Home, Explore, Vault, Profile, Leaderboard) should be one tap away instead of behind hamburger menu.

### T-082: Vault "Select All" for bulk actions

Users with large collections must individually check each set. Add select-all checkbox.

### T-083: "Move to Wishlist" on collection tab

Currently only wishlist has "Move to Collection." Asymmetric — add reverse direction.

### T-084: Year range filter on Explore

"Star Wars sets from 2015-2020" — currently only theme + sort are available.

### T-085: Referral program

Unique referral URLs, reward for referrer (1 month free Pro per 3 referrals), extended trial for referee.

### T-086: "Year in Bricks" annual recap

Spotify Wrapped for LEGO — December event showing sets added, rank changes, top themes. Primary viral mechanic.

### T-087: Testing infrastructure

Set up Vitest + Testing Library. Priority test targets: user-favorites (max 4), user-themes (max 10), user-sets CRUD, vault queries.

### T-088: CI/CD pipeline

GitHub Actions: build + lint + test on PR. Preview deployments on Vercel.

---

## Progress Tracking

| Priority       | Total  | Done  | Remaining |
| -------------- | ------ | ----- | --------- |
| P0 Critical    | 4      | 4     | 0         |
| P1 Pre-Launch  | 10     | 0     | 10        |
| P2 Post-Launch | 10     | 0     | 10        |
| P3 Growth      | 6      | 0     | 6         |
| Backlog        | 9      | 0     | 9         |
| **Total**      | **39** | **4** | **35**    |

---

_Last updated: 2026-03-20_
