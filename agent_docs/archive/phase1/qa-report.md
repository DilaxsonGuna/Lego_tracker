# QA Report -- LegoFlex (Lego Tracker v0)

**Date:** 2026-02-21
**Auditor:** QA Engineer (AI)
**Scope:** Full codebase audit -- all routes, components, server actions, queries, commands, types, and configuration
**Build:** `npm run build` -- PASS (compiled successfully)
**Lint:** `npm run lint` -- 15 errors in application code (details in Section 3)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Critical Issues](#2-critical-issues)
3. [Major Issues](#3-major-issues)
4. [Minor Issues](#4-minor-issues)
5. [ESLint Errors](#5-eslint-errors)
6. [Build & Tooling](#6-build--tooling)
7. [PM Roadmap Cross-Reference](#7-pm-roadmap-cross-reference)

---

## 1. Executive Summary

| Severity | Count |
|----------|-------|
| Critical | 4 |
| Major | 16 |
| Minor | 17 |
| ESLint Errors | 15 |

The application builds and compiles without errors. However, there are **4 critical** issues related to security and data integrity, **16 major** issues affecting core functionality, and **17 minor** issues related to consistency, polish, and code quality. Additionally, there are **15 ESLint errors** in application source code.

---

## 2. Critical Issues

### CRIT-01: No Middleware -- App Routes Unprotected

**Severity:** Critical
**Category:** Security
**Location:** Project root (missing `middleware.ts`)

**Description:**
`CLAUDE.md` states "middleware manages sessions, unauthenticated users -> /auth/login" but **no `middleware.ts` file exists** anywhere in the project. All `/(app)/*` routes (home, explore, vault, profile, settings, leaderboard) are potentially accessible to unauthenticated users.

**Reproduction:**
1. Clear all cookies / open incognito window
2. Navigate to `localhost:3000/vault` or `localhost:3000/profile`
3. Observe that the page attempts to render (may error on missing auth, but no redirect to `/auth/login`)

**Expected:** Unauthenticated users should be redirected to `/auth/login` for all `/(app)/*` routes.

**Impact:** Users can potentially access protected routes without authentication. Server actions individually check auth in some places, but the route-level guard is entirely absent.

---

### CRIT-02: `profile_visible` Setting Not Enforced on Public Pages

**Severity:** Critical
**Category:** Privacy / Data Exposure
**Location:**
- `app/(app)/u/[userId]/page.tsx`
- `app/(app)/u/[userId]/actions.ts`
- `app/(app)/u/[userId]/vault/page.tsx`
- `app/(app)/u/[userId]/vault/actions.ts`

**Description:**
The settings page allows users to toggle `profile_visible` (stored in the `user_settings` table). However, the public profile page (`/u/[userId]`) and public vault page (`/u/[userId]/vault`) **never check this setting**. The only check is whether the profile exists (returns 404 if not).

**Reproduction:**
1. As User A, go to Settings and disable "Profile Visible"
2. As User B, navigate to `/u/{userA_id}`
3. Observe that User A's full profile, stats, favorites, and vault are fully visible

**Expected:** When `profile_visible` is `false`, public profile and vault pages should show a "This profile is private" message or return 404.

**Impact:** Users who believe they have made their profile private are still fully exposed.

---

### CRIT-03: `revalidateTag` Called with Invalid Signature

**Severity:** Critical
**Category:** Runtime Error
**Location:** `app/(app)/explore/actions.ts`, line 41

**Description:**
```typescript
revalidateTag("popularity", "default");
```
The Next.js `revalidateTag()` function accepts only a **single string argument**. Passing two arguments is an incorrect API call. This means cache revalidation after adding a set to vault from the explore page may silently fail or throw a runtime error.

**Reproduction:**
1. Go to `/explore`
2. Click "Add to Collection" or "Add to Wishlist" on any set
3. Check server logs for potential errors from `revalidateTag`

**Expected:** `revalidateTag("popularity")` (single argument).

**Impact:** Stale cache data on the explore page after mutations. Sets may not reflect updated vault status.

---

### CRIT-04: Home Page Entirely Mock Data in Production

**Severity:** Critical
**Category:** Data Integrity
**Location:**
- `app/(app)/page.tsx` (lines 4-5, imports `mockStories`, `mockFeedPosts`, `mockTrendingSets`)
- `lib/mockdata.ts` (full mock dataset)
- `lib/queries/home.ts` (all functions are TODO stubs returning `[]`)

**Description:**
The home page (`/`) imports and renders mock data directly. The corresponding query functions in `lib/queries/home.ts` are all TODO stubs:
```typescript
// TODO: Implement when feed tables are created
export async function getFeedPosts(): Promise<FeedPost[]> { ... return []; }
// TODO: Implement when stories table is created
export async function getStories(): Promise<Story[]> { ... return []; }
// TODO: Implement when analytics are tracked
export async function getTrendingSets(): Promise<TrendingSet[]> { ... return []; }
```
The page bypasses these queries entirely and uses mock imports.

**Impact:** Users see fabricated content (fake users, fake posts, fake trending sets) that does not reflect real data. This is the app's landing page.

---

## 3. Major Issues

### MAJ-01: Feed Post Interaction Buttons Non-Functional

**Severity:** Major
**Category:** Missing Functionality
**Location:** `components/home/feed-post.tsx`

**Description:**
The Like, Comment, Share, and Bookmark buttons on feed posts render as interactive `<Button>` elements but have **no `onClick` handlers**. They are purely visual.

**Reproduction:**
1. Navigate to home page
2. Click Like, Comment, Share, or Bookmark on any post
3. Nothing happens

**Expected:** Buttons should either perform actions or be visually indicated as coming-soon / disabled.

---

### MAJ-02: Home Page Search Bar Non-Functional

**Severity:** Major
**Category:** Missing Functionality
**Location:** `components/home/right-sidebar.tsx`

**Description:**
The search `<Input>` in the right sidebar has no `onChange`, `onSubmit`, or any event handler. Typing produces no results or navigation.

**Reproduction:**
1. Navigate to home page (desktop view)
2. Type in the search bar in the right sidebar
3. Nothing happens

**Expected:** Search should filter content or navigate to explore with query.

---

### MAJ-03: 13 Placeholder Links (`href="#"`)

**Severity:** Major
**Category:** Missing Functionality / UX
**Locations:**
- `components/home/right-sidebar.tsx` -- "View All" trending link + 7 footer links (About, Help, Privacy, Terms, Careers, Developers, More)
- `components/shared/footer.tsx` -- 3 links (Privacy, Terms, Contact)
- `components/profile/profile-footer.tsx` -- 3 links (Privacy, Terms, Contact)

**Reproduction:**
1. Click any of the above links
2. Page scrolls to top (anchor `#` behavior), no navigation occurs

**Expected:** Links should navigate to real pages or be removed/disabled until implemented.

---

### MAJ-04: No Set Detail Page

**Severity:** Major
**Category:** Missing Feature
**Location:** Application-wide

**Description:**
Multiple components reference set data (vault cards, explore cards, leaderboard) but there is no `/set/[setNum]` or equivalent detail page. Clicking a set card has no navigation to a detail view.

**Expected:** Users should be able to view full details of a Lego set (pieces, year, theme, image, price, retail links).

---

### MAJ-05: Price Data Hardcoded to "$0" Everywhere

**Severity:** Major
**Category:** Incorrect Data
**Location:** `lib/queries/vault.ts` -- lines 81, 115, 146, 172

**Description:**
All vault queries hardcode `price: "$0"` for every set:
```typescript
price: "$0",
```
This value propagates to vault cards, vault list items, and vault stats hero.

**Reproduction:**
1. Add any set to vault
2. View vault -- all sets show "$0" price
3. Stats hero shows "$0" total value

**Expected:** Either display real price data or hide the price field until data is available.

---

### MAJ-06: `interests` Array Always Returns Empty

**Severity:** Major
**Category:** Missing Data
**Location:** `lib/queries/profile.ts`, line 36

**Description:**
```typescript
interests: [] as string[],
```
The `interests` field is hardcoded to an empty array. The `ProfileBio` component renders an interests section, but it will always show the empty state.

**Reproduction:**
1. Navigate to `/profile`
2. Observe that the interests section is empty regardless of user data

**Expected:** Interests should be fetched from user data (e.g., theme preferences) or the section should be hidden.

---

### MAJ-07: "Edit Selection" Button Non-Functional on Favorites Grid

**Severity:** Major
**Category:** Missing Functionality
**Location:** `components/profile/favorites-grid.tsx`

**Description:**
The "Edit Selection" button renders but has **no `onClick` handler**. It appears on both the private profile and public profile (where it should not appear at all for non-owners).

**Reproduction:**
1. Navigate to `/profile`
2. Click "Edit Selection" in the favorites section
3. Nothing happens

**Expected:** Button should open a favorites editor or navigate to vault with filter.

---

### MAJ-08: `email_notifications` Toggle Has No Backend

**Severity:** Major
**Category:** Missing Functionality
**Location:** `app/(app)/settings/settings-client.tsx`, `app/(app)/settings/actions.ts`

**Description:**
The settings page shows an "Email Notifications" toggle. The `updateProfileSetting` action updates the `user_settings` table, but there is no email notification system. The toggle creates the illusion of a feature that does not exist.

**Reproduction:**
1. Go to Settings
2. Toggle "Email Notifications" on
3. Perform actions that would generate notifications (e.g., someone follows you)
4. No emails are sent

**Expected:** Either implement email notifications or remove/disable the toggle with a "Coming Soon" label.

---

### MAJ-09: VaultList Missing Empty State

**Severity:** Major
**Category:** Missing Empty State
**Location:** `components/vault/vault-list.tsx`

**Description:**
The `VaultGrid` component has a proper empty state using the `EmptyState` component when no sets match filters. However, `VaultList` (the list/table view) has **no empty state** -- it renders an empty table with just headers.

**Reproduction:**
1. Navigate to `/vault`
2. Switch to list view (desktop)
3. Search for a term that matches no sets
4. Empty table with headers and no rows, no message

**Expected:** Show the same `EmptyState` component as `VaultGrid`.

---

### MAJ-10: No Confirmation Dialog on Bulk Delete

**Severity:** Major
**Category:** UX / Data Safety
**Location:** `components/vault/vault-bulk-actions.tsx`

**Description:**
The "Remove" bulk action in vault immediately executes without a confirmation dialog. Users can accidentally delete multiple sets from their collection with a single click.

**Reproduction:**
1. Go to `/vault`
2. Select multiple sets
3. Click "Remove"
4. Sets are immediately removed with no confirmation

**Expected:** Show a confirmation dialog: "Are you sure you want to remove X sets from your vault?"

---

### MAJ-11: No Confirmation Dialog on Sign Out

**Severity:** Major
**Category:** UX
**Location:** `components/settings/settings-sign-out.tsx`

**Description:**
The sign-out button immediately signs the user out with no confirmation. The architecture documentation claims there is a confirmation dialog, but none is implemented.

**Reproduction:**
1. Go to Settings
2. Click "Sign Out"
3. Immediately signed out, no confirmation

**Expected:** Show a confirmation dialog before signing out.

---

### MAJ-12: Edit Profile Missing Username Format Validation

**Severity:** Major
**Category:** Validation Gap
**Location:** `components/settings/edit-profile-form.tsx`

**Description:**
The onboarding form validates usernames with the regex `/^[a-zA-Z0-9_]+$/` and enforces 3-20 character length. The edit profile form has **no such validation**. Users could update their username to contain invalid characters (spaces, special characters) after onboarding.

**Reproduction:**
1. Complete onboarding with a valid username
2. Go to Settings > Edit Profile
3. Change username to contain spaces or special characters
4. Submit -- may succeed depending on DB constraints

**Expected:** Same validation rules as onboarding.

---

### MAJ-13: No Password Strength Validation on Sign-Up

**Severity:** Major
**Category:** Security / Validation
**Location:** `components/auth/sign-up-form.tsx`

**Description:**
The sign-up form validates that passwords match but does **not** enforce any minimum length or complexity requirements. Users can sign up with a 1-character password (subject to Supabase defaults).

**Reproduction:**
1. Go to `/auth/sign-up`
2. Enter email and password "a" / confirm "a"
3. Submit -- only Supabase server-side validation (if any) prevents weak passwords

**Expected:** Client-side validation for minimum 8 characters and/or complexity requirements with visual feedback.

---

### MAJ-14: Root Layout Metadata Still Shows Starter Kit Branding

**Severity:** Major
**Category:** Branding
**Location:** `app/layout.tsx`, lines 18-21

**Description:**
```typescript
export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};
```

**Reproduction:**
1. Open the app
2. Check browser tab title: "Next.js and Supabase Starter Kit"

**Expected:** Title should be "LegoFlex" or "Lego Tracker" with an appropriate description.

---

### MAJ-15: `calculateGlobalPosition` Performance Issue

**Severity:** Major
**Category:** Performance
**Location:** `lib/queries/profile.ts`

**Description:**
The `calculateGlobalPosition` function fetches **all users** from the `profiles` table to compute a single user's rank:
```typescript
const { data, error } = await supabase.from("profiles").select("id, brick_score")...
```
This will degrade significantly as the user base grows.

**Expected:** Use a database function or window function (e.g., `RANK() OVER (ORDER BY brick_score DESC)`) to compute position without fetching all records.

---

### MAJ-16: Stories Carousel Click Does Nothing

**Severity:** Major
**Category:** Missing Functionality
**Location:** `components/home/stories-carousel.tsx`

**Description:**
Story items in the carousel render as clickable-looking elements but clicking them does nothing. They use mock data and have no click handler.

**Reproduction:**
1. Navigate to home page
2. Click on any story circle
3. Nothing happens

**Expected:** Either implement story viewing or indicate stories as a future feature.

---

## 4. Minor Issues

### MIN-01: `isOnline` Hardcoded to `true`

**Severity:** Minor
**Category:** Incorrect Data
**Location:** `lib/queries/profile.ts`, line 32

**Description:**
```typescript
isOnline: true,
```
All users appear as "online" regardless of actual status. The green online indicator on profile pages is always active.

**Expected:** Either implement real online status or remove the indicator.

---

### MIN-02: `isVerified` Hardcoded to `false`

**Severity:** Minor
**Category:** Incorrect Data
**Location:** `lib/queries/profile.ts`, line 30

**Description:**
```typescript
isVerified: false,
```
No user can ever appear as verified. If verification is not planned, the badge UI code should be removed.

---

### MIN-03: Bio Character Limit Inconsistency

**Severity:** Minor
**Category:** UX Inconsistency
**Location:**
- `components/auth/onboarding-form.tsx` -- 160 character limit
- `components/settings/edit-profile-form.tsx` -- 200 character limit

**Description:**
Users can write a 200-character bio in edit profile that would be rejected if they went through onboarding again. The limits should be consistent.

**Expected:** Use a single constant for bio max length across both forms.

---

### MIN-04: Update Password Handler Misnamed

**Severity:** Minor
**Category:** Code Quality
**Location:** `components/auth/update-password-form.tsx`

**Description:**
The form submit handler is named `handleForgotPassword` but it handles updating the password (not the forgot flow). This is a copy-paste artifact.

**Expected:** Rename to `handleUpdatePassword`.

---

### MIN-05: `console.error` Calls in Production Code

**Severity:** Minor
**Category:** Code Quality
**Locations:**
- `lib/commands/user-stats.ts`
- `lib/queries/profile.ts`
- `components/settings/edit-profile-form.tsx`

**Description:**
Three `console.error` calls exist in production code. These should use a proper logging service or be removed.

---

### MIN-06: 8 TODO Comments in Production Code

**Severity:** Minor
**Category:** Code Quality
**Locations:**
- `lib/queries/home.ts` -- 4 TODOs (feed, stories, trending, suggested users)
- `lib/queries/vault.ts` -- 4 TODOs (price data for each query)

**Description:**
TODO comments indicate unfinished features that are shipped as part of the production codebase.

---

### MIN-07: Auth Error Page Has No Recovery Link

**Severity:** Minor
**Category:** UX
**Location:** `app/auth/error/page.tsx`

**Description:**
The auth error page shows an error message but provides no "Go Back", "Try Again", or "Return to Login" link. Users who hit this page are stuck.

**Expected:** Add a link back to `/auth/login`.

---

### MIN-08: Public Profile Page Responsive Padding Inconsistency

**Severity:** Minor
**Category:** Responsive Design
**Location:** `app/(app)/u/[userId]/page.tsx`, line 86

**Description:**
```typescript
<div className="relative z-10 mx-auto max-w-[1100px] px-8 py-12">
```
The own-profile page uses `px-4 sm:px-8 py-8 sm:py-12` (responsive), but the public profile uses fixed `px-8 py-12` which causes excessive padding on mobile.

**Expected:** Match the responsive padding pattern: `px-4 sm:px-8 py-8 sm:py-12`.

---

### MIN-09: Vault Toolbar Filters Hidden on Mobile

**Severity:** Minor
**Category:** Responsive Design
**Location:** `components/vault/vault-toolbar.tsx`

**Description:**
The theme filter dropdown and view mode toggle are hidden on mobile (`hidden sm:flex`). Mobile users have no way to filter by theme or switch views.

**Expected:** Either show filters on mobile (possibly in a collapsible section) or document this as intentional.

---

### MIN-10: Status Badges Display with No Way to Set Status

**Severity:** Minor
**Category:** Incomplete Feature
**Location:** `components/vault/vault-card.tsx`, `components/vault/vault-list.tsx`

**Description:**
Vault cards and list items display status badges (e.g., "sealed", "built", "incomplete") but there is no UI anywhere to set or change the status of a set. The status field exists in the database schema but is inaccessible to users.

**Expected:** Add status management UI or hide the badge until the feature is complete.

---

### MIN-11: Public Vault Inconsistent Empty State

**Severity:** Minor
**Category:** UX Inconsistency
**Location:** `app/(app)/u/[userId]/vault/vault-client.tsx`

**Description:**
The public vault page uses inline text for its empty state:
```tsx
<p className="text-center text-muted-foreground py-12">No sets match your filters</p>
```
This is inconsistent with the private vault which uses the `EmptyState` component.

**Expected:** Use the shared `EmptyState` component for consistency.

---

### MIN-12: ESLint Config Missing `.next` Ignore

**Severity:** Minor
**Category:** Tooling
**Location:** `eslint.config.mjs`

**Description:**
The ESLint configuration does not include `.next` in its ignore patterns. Running `npm run lint` scans the build output directory, producing hundreds of false positive errors from compiled files.

**Reproduction:**
1. Run `npm run build`
2. Run `npm run lint`
3. Observe errors from `.next/` directory files

**Expected:** Add `{ ignores: [".next/**"] }` to the ESLint config.

---

### MIN-13: Large Mock Data File Shipped in Bundle

**Severity:** Minor
**Category:** Bundle Size
**Location:** `lib/mockdata.ts`

**Description:**
`lib/mockdata.ts` contains extensive mock data including unused exports (`mockUser`, `mockUserStats`, `mockFavoriteSets`, `mockMilestones`, `mockLegoSets`, `mockSuggestedUsers`, `mockThemeCategories`, `mockDiscoverySets`, `mockVaultStats`, `mockVaultSets`). Only 3 exports are used by the home page. Tree-shaking may not eliminate all unused data depending on build configuration.

**Expected:** Remove unused mock data exports. When real data replaces mocks, delete the file entirely.

---

### MIN-14: `onboarding-form.tsx` Empty Interface

**Severity:** Minor
**Category:** Code Quality
**Location:** `components/auth/onboarding-form.tsx`

**Description:**
```typescript
interface OnboardingFormProps {}
```
Empty interface triggers ESLint `@typescript-eslint/no-empty-object-type` error. The component does not take props.

**Expected:** Remove the interface and the props parameter from the component.

---

### MIN-15: View Mode State Not Persisted

**Severity:** Minor
**Category:** UX
**Location:** `app/(app)/vault/vault-client.tsx`

**Description:**
The vault view mode (grid/list) defaults to "grid" on every page load. If a user prefers list view, they must switch every time they visit the vault.

**Expected:** Persist view mode preference in localStorage or user settings.

---

### MIN-16: Leaderboard Not Behind Auth Check

**Severity:** Minor
**Category:** Access Control
**Location:** `app/(app)/leaderboard/actions.ts`

**Description:**
The leaderboard fetch action does not check authentication. While this may be intentional (leaderboard could be public), it is inconsistent with other `/(app)/*` routes that assume authenticated access.

**Expected:** Clarify whether leaderboard should be public or protected. If protected, add auth check.

---

### MIN-17: Missing `aria-label` on Icon-Only Buttons

**Severity:** Minor
**Category:** Accessibility
**Locations:**
- `components/home/feed-post.tsx` -- Like, Comment, Share, Bookmark buttons
- `components/vault/vault-toolbar.tsx` -- View mode toggle buttons
- `components/home/stories-carousel.tsx` -- Story items

**Description:**
Several icon-only buttons lack `aria-label` attributes. Screen readers cannot convey the purpose of these buttons.

**Expected:** Add descriptive `aria-label` to all icon-only interactive elements.

---

## 5. ESLint Errors

The following 15 errors were found in application source code when running `npx eslint . --ignore-pattern '.next'`:

| # | File | Rule | Description |
|---|------|------|-------------|
| 1 | `app/(app)/u/[userId]/profile-client.tsx` | `no-unused-vars` | `FavoritesGrid` imported but never used |
| 2 | `components/auth/onboarding-form.tsx` | `no-empty-object-type` | Empty interface `OnboardingFormProps` |
| 3 | `components/explore/discovery-card.tsx` | `no-unused-vars` | `isInVault` assigned but never used |
| 4 | `components/explore/theme-filter-modal.tsx` | `no-unused-vars` | `hasChanges` assigned but never used |
| 5 | `components/explore/theme-filter-modal.tsx` | `react/no-unescaped-entities` | Unescaped `'` in JSX (line 132) |
| 6 | `components/explore/theme-filter-modal.tsx` | `react/no-unescaped-entities` | Unescaped `'` in JSX |
| 7 | `components/shared/theme-selector.tsx` | `no-unused-vars` | `inDialog` assigned but never used |
| 8 | `components/shared/theme-selector.tsx` | `react/no-unescaped-entities` | Unescaped `'` in JSX (line 152) |
| 9 | `components/shared/theme-selector.tsx` | `react/no-unescaped-entities` | Unescaped `'` in JSX |
| 10 | `components/vault/vault-bulk-actions.tsx` | `no-unused-vars` | `selectedSetNums` destructured but never used |
| 11 | `lib/queries/explore.ts` | `no-explicit-any` | `any` type on line 48 |
| 12 | `lib/queries/explore.ts` | `no-explicit-any` | `any` type on line 75 |
| 13 | `lib/queries/vault.ts` | `no-unused-vars` | Unused `error` variable (line 180) |
| 14 | `lib/queries/vault.ts` | `no-unused-vars` | Unused `error` variable (line 191) |
| 15 | `tailwind.config.ts` | `no-require-imports` | `require()` used instead of ES import |

---

## 6. Build & Tooling

### Build Output

```
npm run build
```

**Result:** Compiled successfully. No errors.

**Warnings:**
- `npm warn`: `baseline-browser-mapping@1.0.0` is outdated (recommended update to `1.0.1`)

All routes compiled as expected. Static and dynamic route generation completed without issues.

### Lint Output

```
npm run lint
```

**Note:** Default `npm run lint` scans `.next/` build artifacts, producing hundreds of false errors. The ESLint config (`eslint.config.mjs`) should add `.next` to its ignore list. Running with `--ignore-pattern '.next'` yields the 15 real errors listed in Section 5.

---

## 7. PM Roadmap Cross-Reference

Cross-referencing the PM roadmap at `agent_docs/phase1/pm-roadmap.md` with QA findings:

| PM Roadmap Item | QA Report Reference | Status |
|----------------|---------------------|--------|
| P0: Middleware missing | CRIT-01 | Confirmed -- no `middleware.ts` exists |
| P0: Home page mock data | CRIT-04 | Confirmed -- `mockStories`, `mockFeedPosts`, `mockTrendingSets` imported directly |
| P0: Feed interactions non-functional | MAJ-01 | Confirmed -- Like, Comment, Share, Bookmark have no handlers |
| P0: Metadata branding | MAJ-14 | Confirmed -- still says "Next.js and Supabase Starter Kit" |
| P1: Privacy toggle unenforced | CRIT-02 | Confirmed -- `profile_visible` not checked on public routes |
| P1: Price data "$0" | MAJ-05 | Confirmed -- hardcoded in 4 places in `lib/queries/vault.ts` |
| P1: Set detail page missing | MAJ-04 | Confirmed -- no detail route exists |
| P1: Placeholder links | MAJ-03 | Confirmed -- 13 `href="#"` links across 3 files |
| P1: Email notifications toggle | MAJ-08 | Confirmed -- toggle exists, no backend |
| P1: Interests always empty | MAJ-06 | Confirmed -- hardcoded `[]` |
| P2: Edit Selection button | MAJ-07 | Confirmed -- no onClick handler |
| P2: Search bar non-functional | MAJ-02 | Confirmed -- no event handler |
| P2: Stories carousel | MAJ-16 | Confirmed -- click does nothing |

### Additional QA Findings Not in PM Roadmap

The following issues were discovered during QA audit but are **not listed** in the PM roadmap:

1. **CRIT-03:** `revalidateTag` called with invalid signature in explore actions
2. **MAJ-09:** VaultList missing empty state (VaultGrid has one)
3. **MAJ-10:** No confirmation dialog on bulk delete
4. **MAJ-11:** No confirmation dialog on sign out
5. **MAJ-12:** Edit profile missing username format validation
6. **MAJ-13:** No password strength validation on sign up
7. **MAJ-15:** `calculateGlobalPosition` fetches all users (perf issue)
8. **MIN-03:** Bio character limit inconsistency (160 vs 200)
9. **MIN-07:** Auth error page has no recovery link
10. **MIN-08:** Public profile responsive padding inconsistency
11. **MIN-09:** Vault toolbar filters hidden on mobile
12. **MIN-10:** Status badges display with no way to set status
13. **MIN-11:** Public vault inconsistent empty state style
14. **MIN-12:** ESLint config missing `.next` ignore
15. **MIN-15:** View mode state not persisted
16. **MIN-17:** Missing `aria-label` on icon-only buttons

---

*End of QA Report*
