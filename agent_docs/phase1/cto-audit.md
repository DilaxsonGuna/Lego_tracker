# CTO Technical Audit -- LegoFlex (Lego Tracker)

**Date:** 2026-02-21
**Author:** CTO Agent
**Scope:** Full codebase security, performance, scalability, code quality, and deployment readiness audit

---

## Executive Summary

LegoFlex has a well-structured Next.js 15 / Supabase codebase with clean separation of concerns (queries vs commands, server vs client components). However, the audit reveals **3 critical deployment blockers**, **7 high-severity issues**, and **12 moderate issues** across security, performance, and code quality. The most urgent are: a missing middleware.ts file that leaves all routes unprotected, RLS policies that break the public profile feature entirely, and a stale Supabase type definition that will cause runtime failures on the leaderboard.

---

## Table of Contents

1. [Critical -- Deployment Blockers](#1-critical----deployment-blockers)
2. [Security Audit](#2-security-audit)
3. [Performance Audit](#3-performance-audit)
4. [Database & Schema Audit](#4-database--schema-audit)
5. [Code Quality Audit](#5-code-quality-audit)
6. [Deployment Readiness](#6-deployment-readiness)
7. [Technical Roadmap](#7-technical-roadmap)

---

## 1. Critical -- Deployment Blockers

### CRIT-1: No middleware.ts -- All Routes Are Unprotected

**Severity:** CRITICAL
**Files:** `/middleware.ts` (missing), `/lib/supabase/proxy.ts` (exists but unused)

The CLAUDE.md documentation states: "middleware manages sessions, unauthenticated users -> /auth/login." However, **no `middleware.ts` file exists** in the project root.

The proxy logic exists at `/lib/supabase/proxy.ts` and implements session refresh + auth checks + onboarding redirect, but it is never imported or invoked by any file in the project.

**Impact:**
- Unauthenticated users can access every `/(app)/*` route directly
- Supabase auth cookies are never refreshed server-side between requests, causing random session logouts
- The onboarding redirect for incomplete profiles (lines 57-72 of `proxy.ts`) never fires
- Any URL typed directly into the browser bypasses all auth checks

**Fix:**
Create `/middleware.ts`:
```typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

---

### CRIT-2: RLS Policies Block Public Profile Feature Entirely

**Severity:** CRITICAL
**Files:** `/supabase/migrations/001_create_user_favorites.sql`, `/app/(app)/u/[userId]/vault/page.tsx`, `/app/(app)/u/[userId]/page.tsx`

The `user_favorites` table has a SELECT policy: `USING (auth.uid() = user_id)` -- users can only read their OWN favorites.

The `user_sets` table's RLS policies (documented as "own" for SELECT) enforce the same restriction.

But the public profile pages at `/u/[userId]` call:
- `getUserProfile(userId)` -- fetches another user's profile (profiles are public SELECT, OK)
- `getFavoriteSets(userId)` -- reads `user_favorites` for another user (**BLOCKED by RLS**)
- `getUserStats(userId)` -- reads `user_sets` for another user (**BLOCKED by RLS**)
- `getMilestones(userId)` -- reads `user_sets` for another user (**BLOCKED by RLS**)
- `getVaultSets(userId)` -- reads `user_sets` for another user (**BLOCKED by RLS**)

**Impact:** Public profiles show ZERO sets, ZERO favorites, ZERO stats, ZERO milestones for any user other than the currently authenticated one. The entire public profile and public vault features are silently broken.

**Fix:** Add public SELECT policies to `user_sets` and `user_favorites`:

```sql
-- Allow public read on user_sets (for public profiles, leaderboard)
CREATE POLICY "Anyone can view user sets"
  ON user_sets FOR SELECT
  USING (true);

-- Allow public read on user_favorites (for public profiles)
CREATE POLICY "Anyone can view user favorites"
  ON user_favorites FOR SELECT
  USING (true);
```

Alternatively, if privacy is preferred, tie visibility to the `profiles.profile_visible` flag via a subquery:
```sql
CREATE POLICY "Public can view user sets if profile is visible"
  ON user_sets FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = user_sets.user_id
      AND profiles.profile_visible = true
    )
  );
```

---

### CRIT-3: Stale Supabase Type Definitions -- Runtime Failures

**Severity:** CRITICAL
**Files:** `/types/supabase.ts`, `/lib/queries/leaderboard.ts`, `/lib/commands/user-stats.ts`

The generated `types/supabase.ts` is out of date. It is missing:

1. **`profiles` table columns:** `brick_score`, `sets_count`, `pieces_count` -- these are used by the leaderboard query (`/lib/queries/leaderboard.ts:26`) and the stats recalculation command (`/lib/commands/user-stats.ts:52-54`).

2. **`search_sets` RPC function** -- defined in migration `006_enable_unaccent.sql` but absent from `types/supabase.ts:Functions`.

3. **`user_themes` table** -- migration `005_create_user_themes.sql` is documented in `agent_docs/database.md` but the migration file does not exist in `supabase/migrations/`. The table may have been created directly in the Supabase dashboard. It IS present in the live database (implied by working user-themes queries) but is entirely absent from `types/supabase.ts:Tables`.

**Impact:**
- TypeScript will not catch type errors on queries to these columns/functions
- If running `supabase gen types` it would overwrite the current file and still miss manually-added columns
- The leaderboard queries `profiles.brick_score`, `profiles.sets_count`, `profiles.pieces_count` -- if these columns don't exist in the database, the entire leaderboard page crashes with a Postgres error

**Fix:**
1. Run `npx supabase gen types typescript` to regenerate `types/supabase.ts` from the live schema
2. Ensure all schema changes are tracked in migration files (add missing `005_create_user_themes.sql`, add migration for `brick_score`/`sets_count`/`pieces_count`/`profile_visible`/`default_grid_view`/`email_notifications` columns on profiles)

---

## 2. Security Audit

### SEC-1: SQL Injection Vector in Vault Search

**Severity:** HIGH
**File:** `/lib/queries/vault.ts:50-52`

```typescript
if (search) {
  query = query.or(
    `lego_sets.name.ilike.%${search}%,lego_sets.set_num.ilike.%${search}%`
  );
}
```

The `search` parameter is interpolated directly into the PostgREST filter string. A crafted search value containing commas or PostgREST operators could alter the query logic. While Supabase's PostgREST layer provides some escaping, this is not safe practice.

**Fix:** Use parameterized `.ilike()` calls instead:
```typescript
if (search) {
  query = query.or(
    `name.ilike.%${search}%,set_num.ilike.%${search}%`,
    { referencedTable: 'lego_sets' }
  );
}
```
Or better, sanitize input by stripping special PostgREST characters before interpolation.

---

### SEC-2: No Input Validation on Server Actions

**Severity:** HIGH
**Files:** All `actions.ts` files, `/lib/commands/*.ts`

No validation library (Zod, Yup, etc.) is used anywhere. Server actions accept raw parameters without validation:

- `/app/(app)/explore/actions.ts:17` -- `addSetToCollection(setNum: string)` -- no validation that setNum matches expected format
- `/app/(app)/vault/actions.ts:91` -- `addSetToVault(setNum, quantity, collectionType)` -- quantity could be negative, collectionType could be any string
- `/app/(app)/profile/actions.ts:42` -- `updateProfile(data)` -- accepts arbitrary strings for username, bio, etc. with no length/format validation (onboarding validates, but edit-profile does not)
- `/app/(app)/settings/actions.ts:40` -- `updateProfileSetting(data: Partial<ProfileSettings>)` -- raw `...data` spread into the Supabase update

**Impact:** Malformed data can be written to the database. While RLS prevents cross-user writes and Postgres types prevent type mismatches, there is no protection against:
- Extremely long strings (bio of 100KB)
- Negative quantities
- Invalid `collectionType` values (no CHECK constraint exists on the column)
- XSS payloads stored in `bio`, `username`, `notes` fields (React auto-escapes on render, but this is defense-in-depth concern)

**Fix:** Add Zod schemas for all server action inputs:
```bash
npm install zod
```
```typescript
import { z } from "zod";

const addSetSchema = z.object({
  setNum: z.string().min(1).max(20).regex(/^[a-zA-Z0-9-]+$/),
  quantity: z.number().int().min(1).max(999).default(1),
  collectionType: z.enum(["collection", "wishlist"]).default("collection"),
});
```

---

### SEC-3: `SECURITY DEFINER` Functions Bypass RLS

**Severity:** MEDIUM
**Files:** `/supabase/migrations/get_popular_sets.sql`, `/supabase/migrations/006_enable_unaccent.sql`

Both `get_popular_sets` and `search_sets` are `SECURITY DEFINER` functions. This means they execute with the privileges of the function OWNER (typically the `postgres` superuser), completely bypassing RLS policies on all tables they touch.

While this is intentional for aggregating `user_sets` data across users (counting owners), it means:
- Any user (including `anon`) can call these RPCs to enumerate ALL user_sets data in aggregate
- The `GRANT EXECUTE ON FUNCTION ... TO anon` line allows unauthenticated users to call these functions

**Impact:** Low risk currently (functions only return set metadata and owner counts, not user IDs). But any future modification that exposes user-level data in these functions would leak it publicly.

**Recommendation:** Change to `SECURITY INVOKER` and add a dedicated public view for the aggregate data, or accept the current design and add a comment documenting the intentional RLS bypass.

---

### SEC-4: `profile_visible` Setting Is Not Enforced

**Severity:** HIGH
**Files:** `/app/(app)/u/[userId]/page.tsx`, `/app/(app)/u/[userId]/vault/page.tsx`, `/app/(app)/u/[userId]/actions.ts`

The settings page allows users to toggle `profile_visible` to false. However:
- `fetchPublicProfile(userId)` at line 13 of `/app/(app)/u/[userId]/actions.ts` calls `getUserProfile(userId)` with NO check on the `profile_visible` flag
- The public vault page also ignores this flag entirely
- The suggested users query at `/lib/queries/social.ts:96-132` returns users regardless of their visibility setting

**Fix:** Add visibility check to all public-facing queries:
```typescript
export async function fetchPublicProfile(userId: string) {
  const profile = await getUserProfile(userId);
  if (profile && !(await isProfileVisible(userId))) {
    return null; // Will trigger notFound()
  }
  return profile;
}
```

---

### SEC-5: Open Redirect Prevention Is Incomplete

**Severity:** LOW
**File:** `/app/auth/confirm/route.ts:11-12`

```typescript
const rawNext = searchParams.get("next") ?? "/auth/onboarding";
const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/auth/onboarding";
```

Good: prevents `//evil.com` protocol-relative redirects. However, it does not prevent path traversal patterns like `/\evil.com` which some browsers may interpret differently. Consider using `new URL(rawNext, origin)` and checking the resulting hostname matches.

---

### SEC-6: Password Policy Not Enforced Client-Side

**Severity:** LOW
**Files:** `/components/auth/sign-up-form.tsx`, `/components/auth/update-password-form.tsx`

No minimum password length, complexity, or strength requirements are shown to the user. Supabase enforces a minimum of 6 characters server-side by default, but the client-side form accepts any non-empty string, leading to confusing error messages when the server rejects weak passwords.

**Fix:** Add client-side password validation with visible requirements (min 8 chars, etc.).

---

## 3. Performance Audit

### PERF-1: N+1 Query -- Global Position Calculation Loads ALL Users

**Severity:** CRITICAL
**File:** `/lib/queries/profile.ts:84-125`

```typescript
async function calculateGlobalPosition(userId, userBrickScore, supabase) {
  const { data } = await supabase
    .from("user_sets")
    .select(`user_id, quantity, lego_sets!inner(num_parts)`)
    .eq("collection_type", "collection");
  // ... loops through ALL users' sets to calculate everyone's brick score
}
```

This function fetches EVERY row from `user_sets` (across ALL users), then aggregates per-user in JavaScript, sorts, and finds the position. With 1,000 users averaging 50 sets each, this is 50,000 rows loaded into memory on EVERY profile page view.

**Impact:** O(n) where n = total rows in user_sets. Will crash or timeout at scale.

**Fix:** The `profiles` table already has pre-calculated `brick_score`. Use a simple COUNT query:
```typescript
async function calculateGlobalPosition(userId: string, supabase) {
  const { data: userProfile } = await supabase
    .from("profiles")
    .select("brick_score")
    .eq("id", userId)
    .single();

  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gt("brick_score", userProfile?.brick_score ?? 0);

  return (count ?? 0) + 1;
}
```
This is already done correctly in the leaderboard query -- apply the same pattern here.

---

### PERF-2: Redundant `getUser()` Calls Per Request

**Severity:** HIGH
**Files:** Multiple `actions.ts` files, `/components/shared/sidebar-wrapper.tsx`, `/components/shared/mobile-header-wrapper.tsx`

Every server action calls `supabase.auth.getUser()` independently. In a single page load:
- `SidebarWrapper` calls `getUser()` once
- `MobileHeaderWrapper` calls `getUser()` again
- The page's `actions.ts` calls `getUser()` for each data-fetching action

For the Vault page, this means 7 separate `supabase.auth.getUser()` calls (lines 30, 39, 48, 65, 75, 84, 97 of `/app/(app)/vault/actions.ts`), each making an HTTP roundtrip to Supabase Auth. The profile page has 4 actions, each calling `getUser()`.

**Impact:** Adds 100-300ms of unnecessary latency per page load (each `getUser()` is ~30-50ms).

**Fix:** For server actions that are called during page rendering (not mutations), pass the user ID from the page-level query:
```typescript
// In page.tsx - call getUser() ONCE
const { data: { user } } = await supabase.auth.getUser();

// Pass user.id to all data-fetching functions
const [sets, stats, themes] = await Promise.all([
  getVaultSets({ userId: user.id, ... }),
  getCollectionStats(user.id),
  getVaultThemes(user.id),
]);
```
The vault page actually does this partially (queries accept userId), but the actions.ts wrapping layer re-fetches the user for each call.

---

### PERF-3: Vault Page Makes 9 Parallel Supabase Queries

**Severity:** MEDIUM
**File:** `/app/(app)/vault/page.tsx:13-30`

```typescript
const [collectionStats, wishlistStats, themes, collectionCount,
  wishlistCount, collectionSets, wishlistSets] = await Promise.all([
  fetchCollectionStats(),    // getUser() + query
  fetchWishlistStats(),      // getUser() + query
  fetchVaultThemes(),        // getUser() + query
  fetchCollectionCount(),    // getUser() + query
  fetchWishlistCount(),      // getUser() + query
  fetchVaultSets({ collectionType: "collection" }), // getUser() + favorites query + main query
  fetchVaultSets({ collectionType: "wishlist" }),    // getUser() + favorites query + main query
]);
```

Each `fetchVault*` action creates a new Supabase client and calls `getUser()`. The `fetchVaultSets` call internally makes TWO queries (favorites + main). Total: at least 7 `getUser()` calls + 9 Supabase data queries = 16 HTTP roundtrips.

**Fix:** Consolidate into a single page-level data fetch:
```typescript
async function VaultContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [collectionStats, wishlistStats, ...rest] = await Promise.all([
    getCollectionStats(user.id),
    getWishlistStats(user.id),
    // ... all queries with user.id passed directly
  ]);
}
```

---

### PERF-4: `getVaultSets` Makes 2 Sequential Queries

**Severity:** MEDIUM
**File:** `/lib/queries/vault.ts:14-87`

```typescript
export async function getVaultSets({ userId, ... }) {
  // Query 1: Get favorites (sequential)
  const { data: favoritesData } = await supabase
    .from("user_favorites").select("set_num").eq("user_id", userId);

  // Query 2: Get vault sets (depends on nothing from Query 1)
  const { data } = await query...;

  // Merge favorite status in JS
  return data.map(row => ({ ...row, isFavorite: favoriteSetNums.has(set.set_num) }));
}
```

These two queries are independent and should run in parallel. When called twice (collection + wishlist), the favorites query is duplicated.

**Fix:**
```typescript
const [favoritesData, setsData] = await Promise.all([
  supabase.from("user_favorites").select("set_num").eq("user_id", userId),
  query.order(...).range(...),
]);
```

---

### PERF-5: `getVaultThemes` Fetches All User Sets to Extract Themes

**Severity:** MEDIUM
**File:** `/lib/queries/vault.ts:200-230`

The function fetches ALL of a user's sets with theme joins just to get the unique theme list. For a user with 500 sets, this returns 500 rows when a SQL `DISTINCT` would return maybe 15.

**Fix:** Use a more efficient query:
```sql
SELECT DISTINCT t.id, t.name
FROM user_sets us
JOIN lego_sets ls ON us.set_num = ls.set_num
JOIN themes t ON ls.theme_id = t.id
WHERE us.user_id = $1
ORDER BY t.name;
```

---

### PERF-6: `getPopularThemes` Fetches All `user_themes` Rows

**Severity:** LOW
**File:** `/lib/queries/user-themes.ts:44-82`

```typescript
const { data: popularData } = await supabase
  .from("user_themes")
  .select("theme_id, themes(id, name)")
  .order("theme_id");
```

This fetches ALL rows from `user_themes` to count popularity in JavaScript. Should use a SQL GROUP BY + COUNT + ORDER BY LIMIT instead.

**Fix:** Create an RPC function or use a raw query:
```sql
SELECT theme_id, t.name, COUNT(*) as user_count
FROM user_themes ut
JOIN themes t ON ut.theme_id = t.id
GROUP BY theme_id, t.name
ORDER BY user_count DESC
LIMIT 10;
```

---

### PERF-7: No Error Boundaries (error.tsx)

**Severity:** MEDIUM
**Files:** No `error.tsx` files found anywhere

If any server component throws an error, Next.js will show its default error page (in production, a generic 500 page). There are no route-level `error.tsx` files to provide graceful degradation.

**Fix:** Add `error.tsx` at minimum to:
- `/app/(app)/error.tsx` -- catches errors in all app routes
- `/app/error.tsx` -- root error boundary

---

### PERF-8: No Loading States (loading.tsx)

**Severity:** LOW
**Files:** No `loading.tsx` files found

The codebase uses `<Suspense>` with inline fallbacks in each page.tsx, which works. However, Next.js `loading.tsx` files would provide instant loading UI during route transitions without requiring `Suspense` wrappers in every page.

This is a minor ergonomics issue, not a bug -- the current Suspense approach is valid.

---

## 4. Database & Schema Audit

### DB-1: Missing Migration Files

**Severity:** HIGH

The following schema elements are referenced in code but have no migration files:

| Element | Referenced In | Migration File |
|---------|--------------|----------------|
| `user_themes` table | `lib/commands/user-themes.ts`, `lib/queries/user-themes.ts` | **MISSING** (005 documented but not found) |
| `profiles.brick_score` column | `lib/queries/leaderboard.ts:28`, `lib/commands/user-stats.ts:55` | **MISSING** |
| `profiles.sets_count` column | `lib/queries/leaderboard.ts:28` | **MISSING** |
| `profiles.pieces_count` column | `lib/queries/leaderboard.ts:28` | **MISSING** |
| `profiles.profile_visible` column | `app/(app)/settings/actions.ts:34` | **MISSING** |
| `profiles.default_grid_view` column | `app/(app)/settings/actions.ts:35` | **MISSING** |
| `profiles.email_notifications` column | `app/(app)/settings/actions.ts:36` | **MISSING** |
| `user_sets` table + RLS | `lib/commands/user-sets.ts` | **MISSING** (predates tracked migrations) |

**Impact:** Cannot reproduce the database from migration files alone. New environments or developers will have schema mismatches.

**Fix:** Create comprehensive migration files for all missing schema, or dump the current live schema as a baseline migration.

---

### DB-2: No CHECK Constraint on `user_sets.collection_type`

**Severity:** MEDIUM
**File:** Database schema (no migration)

`collection_type` is a plain `string` column with no CHECK constraint or ENUM type. Any string value can be inserted. The application treats it as `"collection" | "wishlist"` but nothing prevents `"garbage"` from being written.

**Fix:**
```sql
ALTER TABLE user_sets
  ADD CONSTRAINT user_sets_collection_type_check
  CHECK (collection_type IN ('collection', 'wishlist'));
```

---

### DB-3: Missing Indexes for Common Query Patterns

**Severity:** MEDIUM

| Query Pattern | File | Missing Index |
|---|---|---|
| `user_sets WHERE user_id = X AND collection_type = Y` | vault.ts, user-stats.ts, profile.ts | Composite index on `(user_id, collection_type)` |
| `profiles WHERE brick_score > X ORDER BY brick_score DESC` | leaderboard.ts:25-30 | Index on `brick_score DESC` |
| `profiles WHERE username = X` | profile.ts:236, onboarding actions.ts | Unique index on `username` (lowercase) |
| `themes WHERE parent_id IS NULL` | explore.ts:92 | Partial index on `parent_id IS NULL` |

**Fix:**
```sql
CREATE INDEX user_sets_user_collection_idx ON user_sets(user_id, collection_type);
CREATE INDEX profiles_brick_score_idx ON profiles(brick_score DESC) WHERE brick_score > 0;
CREATE UNIQUE INDEX profiles_username_lower_idx ON profiles(lower(username));
CREATE INDEX themes_parent_null_idx ON themes(id) WHERE parent_id IS NULL;
```

---

### DB-4: `user_favorites` SELECT Policy Blocks Profile Features

**Severity:** HIGH (covered in CRIT-2, listed here for completeness)

The favorites SELECT policy is `USING (auth.uid() = user_id)`. This blocks:
- Viewing another user's favorite sets on their public profile
- The `get_popular_sets` SECURITY DEFINER function already bypasses this for aggregation, but direct queries from public profile pages fail silently (return empty arrays)

---

### DB-5: Max 4 Favorites Not Enforced at Database Level

**Severity:** LOW
**File:** `/lib/commands/user-favorites.ts`

The max-4-favorites rule is only enforced in application code (`/app/(app)/vault/actions.ts:163-166`). A direct Supabase client or API call could insert unlimited favorites.

**Fix:** Add a database-level trigger:
```sql
CREATE OR REPLACE FUNCTION check_max_favorites()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM user_favorites WHERE user_id = NEW.user_id) >= 4 THEN
    RAISE EXCEPTION 'Maximum 4 favorites allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_max_favorites
  BEFORE INSERT ON user_favorites
  FOR EACH ROW EXECUTE FUNCTION check_max_favorites();
```

---

### DB-6: `avatar_color` Column Documented But Doesn't Exist

**Severity:** LOW
**Files:** `agent_docs/database.md:8` mentions "avatar_color" in profiles table, `supabase/migrations/004_add_profile_fields.sql` does NOT create it

The application uses `avatar_url` to store the color name (e.g., "blue", "red") instead. The documentation is stale. The `avatar_color` column name appears ONLY in `agent_docs/database.md`.

**Fix:** Update documentation to reflect actual schema.

---

## 5. Code Quality Audit

### CQ-1: `revalidateTag` Called with Invalid Arguments

**Severity:** HIGH (will throw at runtime)
**File:** `/app/(app)/explore/actions.ts:41,61`

```typescript
revalidateTag("popularity", "default");
```

`revalidateTag()` accepts exactly ONE argument (a string tag). Passing two arguments will cause a TypeScript error (or silent behavior if TS is not strict). The second argument `"default"` is ignored.

**Fix:**
```typescript
revalidateTag("popularity");
```

---

### CQ-2: Duplicated Supabase Client Creation + Auth Check Pattern

**Severity:** MEDIUM
**Files:** All `actions.ts` files

The pattern of creating a Supabase client and checking auth is repeated 28+ times across the codebase:

```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) return { error: "Not authenticated" };
```

**Fix:** Create a helper:
```typescript
// lib/supabase/auth.ts
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}
```

---

### CQ-3: Duplicated Data-Fetching in `explore/actions.ts` vs `lib/commands/user-sets.ts`

**Severity:** LOW
**Files:** `/app/(app)/explore/actions.ts:17-43`, `/lib/commands/user-sets.ts:8-38`

Both `addSetToCollection` (explore action) and `addUserSet` (command) do the same upsert with slightly different signatures. The explore action bypasses the command layer entirely, duplicating logic and missing the `recalculateUserStats` call that the command includes.

**Impact:** Adding a set from the Explore page does NOT update the user's `brick_score` in the profiles table. The leaderboard will show stale data.

**Fix:** Have the explore action call the command:
```typescript
export async function addSetToCollection(setNum: string, ...) {
  const result = await addUserSet(setNum, quantity, collectionType);
  if (result.error) return result;
  revalidateTag("popularity");
  return result;
}
```

---

### CQ-4: `removeSetFromCollection` in explore/actions.ts Does Not Recalculate Stats

**Severity:** MEDIUM
**File:** `/app/(app)/explore/actions.ts:46-64`

When a user removes a set from the Explore page, `recalculateUserStats` is never called. The user's `brick_score`, `sets_count`, and `pieces_count` in the profiles table become stale.

Same issue: the removal does not check if the set was in "collection" vs "wishlist" before deciding whether to recalculate.

**Fix:** Call `deleteUserSet` from the commands layer (which already handles recalculation).

---

### CQ-5: Unsafe Type Assertions (`as unknown as`)

**Severity:** LOW
**Files:** `/lib/queries/vault.ts` (6 occurrences), `/lib/queries/profile.ts` (4 occurrences), `/lib/queries/user-themes.ts` (2 occurrences)

The codebase frequently uses `as unknown as` to cast Supabase query results:

```typescript
const set = row.lego_sets as unknown as {
  set_num: string;
  name: string;
  year: number;
  // ...
};
```

This bypasses TypeScript's type safety entirely. If the query shape changes (e.g., a column is renamed), there will be no compile-time error.

**Fix:** Regenerate Supabase types and use the generated types directly. If joins produce complex types, create proper type helpers.

---

### CQ-6: Unused Imports and Dead Code

**Severity:** LOW

- `/lib/queries/vault.ts:186` -- `error` variable is declared but never used in `getCollectionCount`
- `/lib/queries/vault.ts:196` -- same in `getWishlistCount`
- `/lib/queries/home.ts` -- all 4 functions are unused stubs that only create a client and void it
- `/lib/mockdata.ts` -- still imported in production code (`app/(app)/page.tsx`)

---

### CQ-7: Inconsistent Error Handling Patterns

**Severity:** MEDIUM

Two different error patterns are used:

**Pattern A (commands):** Return `{ error: string }` or `{ success: true }`
```typescript
if (!user) return { error: "Not authenticated" };
```

**Pattern B (queries):** Return empty arrays or null silently
```typescript
if (error || !data) return [];
```

Pattern B means query failures are invisible -- the UI shows "empty state" instead of an error. A database timeout, network error, or permission error all look like "you have no sets."

**Fix:** Add error logging at minimum to all query functions:
```typescript
if (error) {
  console.error("[getVaultSets]", error.message, error.code);
  return [];
}
```

---

### CQ-8: Leaderboard Position Query Is Inefficient (Nested Await)

**Severity:** MEDIUM
**File:** `/lib/queries/leaderboard.ts:39-53`

```typescript
.gte(
  "brick_score",
  (
    await supabase
      .from("profiles")
      .select("brick_score")
      .eq("id", user.id)
      .single()
  ).data?.brick_score ?? 0
);
```

This nested `await` inside a method chain is difficult to read and error-prone (the inner query's error is unchecked). The result is also semantically wrong: it counts users with `brick_score >= currentUser.score`, which means the position equals the count of users at or above the current score (not the rank).

**Fix:** Split into two clean queries:
```typescript
const { data: userProfile } = await supabase
  .from("profiles")
  .select("brick_score")
  .eq("id", user.id)
  .single();

const { count } = await supabase
  .from("profiles")
  .select("*", { count: "exact", head: true })
  .gt("brick_score", userProfile?.brick_score ?? 0);

currentUserPosition = (count ?? 0) + 1;
```

---

## 6. Deployment Readiness

### DEP-1: Root Layout Metadata Is Placeholder

**Severity:** HIGH
**File:** `/app/layout.tsx:16-19`

```typescript
export const metadata: Metadata = {
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};
```

This is the default starter template metadata. Search engines and social sharing will display this text.

**Fix:**
```typescript
export const metadata: Metadata = {
  title: "LegoFlex - Track Your Lego Collection",
  description: "The social Lego collection tracker. Manage your vault, discover sets, climb the leaderboard, and connect with collectors worldwide.",
};
```

---

### DEP-2: Pinned to `latest` for Critical Dependencies

**Severity:** HIGH
**File:** `/package.json:18-19`

```json
"@supabase/ssr": "latest",
"@supabase/supabase-js": "latest",
"next": "latest",
```

Using `latest` means every `npm install` could pull a new major version with breaking changes. Supabase and Next.js both ship breaking changes in major versions.

**Fix:** Pin to specific versions:
```json
"@supabase/ssr": "^0.6.1",
"@supabase/supabase-js": "^2.49.0",
"next": "^15.3.1",
```

---

### DEP-3: No `NEXT_PUBLIC_SITE_URL` Environment Variable Documented

**Severity:** MEDIUM
**File:** `/app/(app)/settings/actions.ts:84`

```typescript
redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/update-password`,
```

`NEXT_PUBLIC_SITE_URL` is used but not listed in the `.env.local` requirements in CLAUDE.md. In production, if this is unset, password reset emails will contain `http://localhost:3000` URLs.

**Fix:** Add to CLAUDE.md and `.env.local.example`:
```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

### DEP-4: `cacheComponents` in next.config.ts May Not Be Valid

**Severity:** LOW
**File:** `/next.config.ts:4`

```typescript
const nextConfig: NextConfig = {
  cacheComponents: true,
```

`cacheComponents` is not a documented Next.js configuration option as of Next.js 15. This may be silently ignored or could cause warnings. If this refers to the experimental PPR (Partial Prerendering) feature, the correct key is `experimental: { ppr: true }`.

**Fix:** Remove or replace with the correct configuration key.

---

### DEP-5: No `images.remotePatterns` for Supabase Storage

**Severity:** LOW
**File:** `/next.config.ts:5-11`

Only `lh3.googleusercontent.com` is configured for remote images. If Supabase Storage is used for user avatars in the future, the images domain will need to be added.

---

### DEP-6: Missing `robots.txt` and `sitemap.xml`

**Severity:** LOW

No `robots.txt` or sitemap configuration exists. Public profiles at `/u/[userId]` should be indexable for SEO.

---

## 7. Technical Roadmap

### Tier 1: Critical Fixes (Blocks Deployment)

| # | Issue | Effort | Files | Status |
|---|-------|--------|-------|--------|
| 1 | Create `middleware.ts` from existing `proxy.ts` (CRIT-1) | 1 hour | `/proxy.ts` | ✅ DONE (via `proxy.ts`) |
| 2 | Fix RLS policies for public profiles (CRIT-2) | 2 hours | Migration file | ✅ DONE (migration 007) |
| 3 | Regenerate Supabase types (CRIT-3) | 30 min | `/types/supabase.ts` | ❌ TODO -- `brick_score`, `sets_count`, `pieces_count`, `user_themes`, `search_sets` still missing |
| 4 | Create missing migration files (DB-1) | 3 hours | `/supabase/migrations/` | ❌ TODO |
| 5 | Fix `revalidateTag` call (CQ-1) | 5 min | `/app/(app)/explore/actions.ts` | ❌ TODO -- still passes 2 arguments |
| 6 | Fix explore actions to use command layer (CQ-3, CQ-4) | 30 min | `/app/(app)/explore/actions.ts` | ✅ DONE |
| 7 | Update root layout metadata (DEP-1) | 5 min | `/app/layout.tsx` | ✅ DONE |
| 8 | Pin dependency versions (DEP-2) | 15 min | `/package.json` | ❌ TODO -- still `"latest"` |

### Tier 2: Security & Performance (Pre-Launch)

| # | Issue | Effort | Files | Status |
|---|-------|--------|-------|--------|
| 9 | Add Zod validation to all server actions (SEC-2) | 4 hours | All `actions.ts` | ✅ DONE (Zod installed, schemas in `lib/schemas/`) |
| 10 | Enforce `profile_visible` on public routes (SEC-4) | 2 hours | `/app/(app)/u/[userId]/*` | ✅ DONE |
| 11 | Replace `calculateGlobalPosition` N+1 query (PERF-1) | 30 min | `/lib/queries/profile.ts` | ❌ TODO -- profile.ts still loads ALL users' sets; home.ts uses efficient approach but profile.ts does not |
| 12 | Consolidate `getUser()` calls per page (PERF-2, PERF-3) | 3 hours | All page.tsx + actions.ts | ❌ TODO |
| 13 | Add `error.tsx` boundaries (PERF-7) | 1 hour | `/app/error.tsx`, `/app/(app)/error.tsx` | ✅ DONE (`app/(app)/error.tsx` exists) |
| 14 | Add database CHECK constraint on collection_type (DB-2) | 15 min | Migration file | ❌ TODO |
| 15 | Add missing indexes (DB-3) | 30 min | Migration file | ❌ TODO |
| 16 | Document `NEXT_PUBLIC_SITE_URL` env var (DEP-3) | 10 min | CLAUDE.md, .env.local | ❌ TODO |
| 17 | Add `collection_type` CHECK constraint (DB-2) | 15 min | Migration file | ❌ TODO (duplicate of #14) |

### Tier 3: Infrastructure Improvements (Post-Launch)

| # | Issue | Effort | Files | Status |
|---|-------|--------|-------|--------|
| 18 | Add database trigger for max-4-favorites (DB-5) | 30 min | Migration file | ❌ TODO |
| 19 | Optimize `getVaultThemes` with DISTINCT query (PERF-5) | 30 min | `/lib/queries/vault.ts` | ❌ TODO |
| 20 | Optimize `getPopularThemes` with SQL aggregation (PERF-6) | 1 hour | `/lib/queries/user-themes.ts` | ❌ TODO |
| 21 | Create `getAuthenticatedUser()` helper (CQ-2) | 2 hours | `/lib/supabase/auth.ts` + refactor | ❌ TODO |
| 22 | Replace `as unknown as` casts with proper types (CQ-5) | 3 hours | `/lib/queries/*.ts` | ❌ TODO |
| 23 | Add error logging to all query functions (CQ-7) | 2 hours | `/lib/queries/*.ts` | ❌ TODO |
| 24 | Add `robots.txt` and sitemap (DEP-6) | 1 hour | `/app/robots.ts`, `/app/sitemap.ts` | ❌ TODO |
| 25 | Set up monitoring (Sentry or Vercel Analytics) | 2 hours | Config + package | ❌ TODO |
| 26 | Add rate limiting on auth endpoints | 3 hours | Middleware or Supabase config | ❌ TODO |
| 27 | Parallelize sequential queries in `getVaultSets` (PERF-4) | 30 min | `/lib/queries/vault.ts` | ❌ TODO |

### Estimated Total Effort

| Tier | Items | Effort |
|------|-------|--------|
| Tier 1 (Blockers) | 8 | ~7 hours |
| Tier 2 (Pre-Launch) | 9 | ~12 hours |
| Tier 3 (Post-Launch) | 10 | ~16 hours |
| **Total** | **27** | **~35 hours** |

---

## Cross-Reference with PM Roadmap

The PM identified 6 P0 items. Here is the technical alignment:

| PM P0 | CTO Finding | Status |
|-------|-------------|--------|
| P0-1: Fix root layout metadata | DEP-1 | ✅ DONE |
| P0-2: Replace mock data on Home | Not a CTO concern (product decision) | ✅ DONE -- replaced with real dashboard |
| P0-3: Remove non-functional UI | Not a CTO concern (product decision) | ✅ DONE |
| P0-4: Add middleware | CRIT-1 | ✅ DONE -- wired via `proxy.ts` |
| P0-5: Enforce profile_visible | SEC-4 | ✅ DONE -- both profile and vault pages check flag |
| P0-6: email_notifications toggle | Not a CTO concern | ✅ DONE -- labeled "Coming soon" and disabled |

**Additional CTO-only blockers the PM did not identify:**
- CRIT-2: RLS policies silently break public profiles -- ✅ DONE (migration 007)
- CRIT-3: Stale Supabase types -- ❌ STILL TODO (leaderboard may crash in production)
- CQ-3/CQ-4: Explore page mutations bypass stat recalculation -- ✅ DONE (now uses command layer)

---

## Appendix: File Index

All files audited in this review:

**Migrations:** `001_create_user_favorites.sql`, `002_create_follows.sql`, `003_profiles_insert_policy.sql`, `004_add_profile_fields.sql`, `get_popular_sets.sql`, `006_enable_unaccent.sql`

**Lib/Supabase:** `server.ts`, `client.ts`, `proxy.ts`

**Lib/Queries:** `explore.ts`, `home.ts`, `vault.ts`, `profile.ts`, `social.ts`, `user-themes.ts`, `leaderboard.ts`

**Lib/Commands:** `user-sets.ts`, `user-favorites.ts`, `user-themes.ts`, `follows.ts`, `user-stats.ts`, `index.ts`

**Lib/Other:** `utils.ts`, `constants.ts`, `brick-score.ts`, `mockdata.ts`, `hooks/use-user.ts`

**Pages:** `app/(app)/page.tsx`, `explore/page.tsx`, `vault/page.tsx`, `profile/page.tsx`, `settings/page.tsx`, `settings/profile/page.tsx`, `leaderboard/page.tsx`, `u/[userId]/page.tsx`, `u/[userId]/vault/page.tsx`

**Actions:** `app/(app)/actions.ts`, `explore/actions.ts`, `vault/actions.ts`, `profile/actions.ts`, `settings/actions.ts`, `leaderboard/actions.ts`, `u/[userId]/actions.ts`, `u/[userId]/vault/actions.ts`, `auth/onboarding/actions.ts`

**Auth:** `login/page.tsx`, `sign-up/page.tsx`, `forgot-password/page.tsx`, `update-password/page.tsx`, `error/page.tsx`, `sign-up-success/page.tsx`, `onboarding/page.tsx`, `confirm/route.ts`

**Components:** `login-form.tsx`, `sign-up-form.tsx`, `sidebar-wrapper.tsx`, `mobile-header-wrapper.tsx`

**Config:** `package.json`, `next.config.ts`, `app/layout.tsx`, `app/(app)/layout.tsx`

**Types:** `supabase.ts`, `profile.ts`, `vault.ts`, `explore.ts`, `leaderboard.ts`, `brick-score.ts`
