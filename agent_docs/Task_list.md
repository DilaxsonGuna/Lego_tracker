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

### T-010: Optimize `calculateGlobalPosition` N+1 query ✅ DONE

- [x] Replaced O(n) JS aggregation with single SQL COUNT on `profiles.brick_score`
- [x] Removed unused `_userId` parameter

**Why:** Profile page loaded entire user_sets table into memory.

### T-011: Consolidate redundant `getUser()` calls ✅ DONE

- [x] Vault page: single `getUser()` in page.tsx, pass `userId` directly to all queries
- [x] Reduced auth roundtrips from 8 to 1 per vault page load
- [x] Helper approach rejected after /simplify review — restructured page.tsx instead

**Why:** 8 redundant auth HTTP roundtrips per vault page load.

### T-012: Add missing database indexes ✅ DONE

- [x] `profiles(brick_score DESC)` — leaderboard sort (migration 010)
- [x] `profiles(lower(username))` UNIQUE — username lookups (migration 010)
- [x] `follows(following_id)` — already existed from migration 002

**Why:** Leaderboard and username queries now use indexes.

### T-013: Add missing migration files ✅ DONE

- [x] Created migration 011 for `profiles` computed columns (brick_score, sets_count, pieces_count)
- [x] Created migration 011 for `profiles` settings columns (profile_visible, default_grid_view, email_notifications)
- [x] Repaired migration history (001-009 marked as applied on remote)
- [x] Pushed 010+011 to remote via `supabase db push`
- [x] CHECK constraint + triggers already in migration 008

**Why:** Schema now fully reproducible from migrations.

### T-014: Document `NEXT_PUBLIC_SITE_URL` env var ✅ DONE

- [x] Added to `.env.example`
- [x] Added to CLAUDE.md environment section

**Why:** Password reset emails need correct redirect URL in production.

---

## P2 — UI/UX Polish (Pre-Launch)

### T-020: Add branding to auth pages ✅ DONE

- [x] Auth layout already had logo + stud-bg (from previous work)
- [x] Added gradient overlay to auth layout
- [x] Added `border-primary/20` to all 8 auth cards
- [x] Updated login copy: "Welcome back, Builder"
- [x] Updated sign-up copy: "Join the Collection"

**Why:** Auth pages are the front door.

### T-021: Replace Puzzle logo icon with brick/stud icon ✅ DONE

- [x] Replaced Puzzle with custom 2x2 brick SVG (4 studs top-view)

**Why:** Puzzle icon suggested jigsaw puzzles, not LEGO bricks.

### T-022: Remove misleading UI indicators ✅ DONE

- [x] `isOnline` set to `false` (was hardcoded `true`)
- [x] Dynamic copyright year `{new Date().getFullYear()}`
- [ ] `isVerified: false` — kept as-is (no verification system planned for v1)

**Why:** Green "online" dot was always on. Copyright was 2024.

### T-023: Fix bio character limit inconsistency ✅ DONE

- [x] Created `MAX_BIO_LENGTH = 200` in `lib/constants.ts`
- [x] Used in both `onboarding-form.tsx` and `edit-profile-form.tsx`

**Why:** Was 160 in onboarding, 200 in settings.

### T-024: Apply `default_grid_view` user setting ✅ DONE

- [x] Fetched from profiles in vault page.tsx (single query in Promise.all)
- [x] Passed as prop to VaultPageClient
- [x] Used as initial `viewMode` state

**Why:** Setting was toggled but never applied.

---

## P3 — Feature Gaps (Post-Launch Priority)

### T-030: Price data integration

- [ ] Research Rebrickable API for retail price data
- [ ] Add `retail_price` column to `lego_sets` table (migration)
- [ ] Create price sync script/cron (Rebrickable API -> lego_sets)
- [ ] Update vault queries to use real price data
- [ ] Update vault stats hero to show real "Collection Value"
- [ ] Update vault cards to show per-set price
- [ ] Gate advanced price analytics (market value, trends) behind Pro tier

**Why:** "#1 requested feature across all personas." Currently removed ($0 was worse than nothing).

### ~~T-031: Set status tracking~~ DEFERRED

> Removed status badge rendering from vault-card and vault-list. VaultSetStatus type removed.
> Will re-implement as a full feature later (DB column + setter UI + filter).

### T-032: Followers/following list pages

#### Phase 1 — Core pages ✅ DONE

- [x] Create `app/(app)/u/[userId]/followers/page.tsx`
- [x] Create `app/(app)/u/[userId]/following/page.tsx`
- [x] Create reusable `FollowList` component with follow/unfollow buttons
- [x] Make follower/following counts clickable in `profile-hero.tsx`
- [x] Same for public profile `profile-client.tsx`

#### Phase 2 — Quick wins (UX polish) ✅ DONE

- [x] Add "Follows you" badge to `FollowListItem` (data already in `isFollowedByCurrentUser`)
- [x] Add search/filter bar within follower/following lists (client-side filter by username)
- [x] Improve empty states with LEGO-themed illustration + "Discover collectors" CTA

#### Phase 3 — Performance ✅ DONE

- [x] Cursor-based pagination for `getFollowers`/`getFollowing` with "Load more" button
- [x] Denormalized `follower_count`/`following_count` on `profiles` via PostgreSQL trigger (migration 014)
- [x] Compound indexes: `(following_id, created_at DESC, id DESC)` and `(follower_id, created_at DESC, id DESC)`
- [x] Cursor input validation (prevent PostgREST filter injection)
- [x] Optimistic follow/unfollow state updates (no pagination truncation)

#### Phase 4 — Engagement ✅ DONE

- [x] Mutual followers indicator on profile pages ("Followed by X, Y you follow")
- [x] Collection overlap score (Jaccard similarity: "N sets in common (X% match)")
- [x] Social proof on set pages ("X, Y you follow own this set")
- [x] Follow suggestions algorithm (friends-of-friends _ 3 + shared themes _ 2 scoring)

**Why:** Social graph exists in DB but was invisible in UX. Phase 1 shipped; phases 2-4 optimize UX, performance, and engagement.

### T-033: Vault sort controls ✅ DONE

- [x] Add sort dropdown to vault toolbar: Date Added, Name A-Z, Year, Most Pieces, Favorites First
- [x] Make sort work on both desktop and mobile (include in mobile filter sheet)
- [x] Persist sort preference in URL params

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

## P4 — Infrastructure & Performance

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

## P5 — Analytics & Pre-Monetization

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

## P6 — Growth & Monetization

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

## P7 — Legal & Compliance

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

| Priority          | Total  | Done   | Remaining |
| ----------------- | ------ | ------ | --------- |
| P0 Critical       | 4      | 4      | 0         |
| P1 Pre-Launch     | 5      | 5      | 0         |
| P2 UI/UX Polish   | 5      | 5      | 0         |
| P3 Feature Gaps   | 7      | 0      | 7         |
| P4 Infrastructure | 4      | 0      | 4         |
| P5 Analytics      | 2      | 0      | 2         |
| P6 Growth         | 6      | 0      | 6         |
| P7 Legal          | 3      | 0      | 3         |
| Backlog           | 9      | 0      | 9         |
| **Total**         | **45** | **14** | **31**    |

---

_Last updated: 2026-03-20_
