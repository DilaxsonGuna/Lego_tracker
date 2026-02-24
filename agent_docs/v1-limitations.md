# V1 Limitations

Known limitations and placeholder implementations in the current version.

## Notifications
- Polling-based: clients must periodically fetch `/notifications` endpoint; no real-time Supabase Realtime subscriptions yet
- No push notifications or service-worker integration
- Notification creation is done inline in commands (e.g., follow); no background job queue

## Search
- Client-side filtering with `ILIKE` / `unaccent` in SQL
- No full-text search indexes (`tsvector` / GIN) on lego_sets or profiles
- Large result sets are loaded and filtered in memory on the client for vault/explore pages

## OG Images
- Basic template rendered at build time
- No per-set or per-profile dynamic OG images with caching strategy
- No edge-cached image generation (e.g., via `@vercel/og`)

## Milestone Celebrations
- Basic threshold check against user stats (e.g., 10 sets, 50 sets)
- No persistent milestone tracking table; milestones are recomputed on every profile load
- No unlock animations or toast celebrations beyond basic display

## Auth
- Auth forms (login, sign-up, forgot-password, update-password) are client-side components calling Supabase Auth directly, not server actions
- No rate limiting on auth endpoints beyond Supabase built-in limits
- No email verification enforcement before onboarding

## Profile Visibility
- Binary public/private toggle; no granular per-section visibility (e.g., hide vault but show profile)
- Private profiles return no data at all rather than a limited public subset

## Data Integrity
- Max favorites (4) and max themes (10) enforced at application layer; DB trigger enforcement added in migration 008 but may not be applied yet
- `collection_type` CHECK constraint added in migration 008 but may not be applied to existing data

## Leaderboard
- Simple query ordering by total sets/parts; no caching or materialized views
- Recomputed on every page load

## Image Handling
- Set images reference external Rebrickable URLs directly
- No image proxy, CDN caching, or fallback placeholder strategy
- Avatar colors are generated client-side; no server-side validation of color values
