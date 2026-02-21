# UX Design Audit & Improvement Plan -- LegoFlex

**Date:** 2026-02-21
**Author:** UX Designer Agent
**Cross-references:** `pm-roadmap.md`, `user-research.md`, `cto-audit.md`, `qa-report.md` (all in `agent_docs/phase1/`)

---

## Executive Summary

LegoFlex has a visually appealing design system (BrickBox theme, Lego yellow primary, warm dark palette) and strong functional bones in the Explore-to-Vault-to-Profile pipeline. However, the user experience suffers from five systemic problems:

1. **A deceptive first impression** -- the Home page is 90% fabricated content that erodes trust within seconds.
2. **Dead-end interactions** -- clickable-looking elements (set cards, suggested usernames, follower counts, story circles) that go nowhere, creating a pattern of learned helplessness.
3. **Missing feedback loops** -- no undo on destructive actions, no confirmation on bulk operations, no celebration of milestones, no progress indicators during long operations.
4. **A disconnected social graph** -- the follow/followers system exists in the database but users cannot navigate to other users from most of the UI.
5. **Mobile-second design in practice** -- despite mobile-first CSS, critical controls (vault filters, view toggle, list view) are hidden on mobile, the primary device for Lego collectors.

This document audits every user flow, identifies missing micro-interactions, proposes wireframe-level improvements for the top 5 flows, and provides screen-by-screen state descriptions. Every recommendation references exact files and line numbers.

---

## Table of Contents

1. [Flow Audit: Onboarding](#1-flow-audit-onboarding)
2. [Flow Audit: Adding Sets to Vault](#2-flow-audit-adding-sets-to-vault)
3. [Flow Audit: Social Discovery & Following](#3-flow-audit-social-discovery--following)
4. [Flow Audit: Profile & Storytelling](#4-flow-audit-profile--storytelling)
5. [Flow Audit: Vault Management](#5-flow-audit-vault-management)
6. [Flow Audit: Leaderboard](#6-flow-audit-leaderboard)
7. [Flow Audit: Settings](#7-flow-audit-settings)
8. [Missing Micro-Interactions Inventory](#8-missing-micro-interactions-inventory)
9. [Top 5 Flow Improvements (Wireframe-Level)](#9-top-5-flow-improvements-wireframe-level)
10. [Mobile-First Audit](#10-mobile-first-audit)
11. [Phase 1 Cross-Reference: Agreements & Disagreements](#11-phase-1-cross-reference)
12. [Summary of All Recommendations](#12-summary-of-all-recommendations)
13. [Dependencies & Conflicts](#13-dependencies--conflicts)

---

## 1. Flow Audit: Onboarding

### Current Flow (Tap Count: 15+ taps minimum)

```
Landing (/) -> notice nothing is actionable -> find Login
  -> Enter email + password -> Submit (3 taps)
  -> OR: click "Sign up" link -> Sign Up page
  -> Enter email + password + repeat password -> Submit (4 taps)
  -> Sign Up Success page (dead end, no next action)
  -> [Check email, open email, click link] (3+ taps outside app)
  -> Arrive at Onboarding (no guarantee of active session)
  -> Scroll through 7 fields, fill username (required) -> Submit (2+ taps)
  -> Arrive at Home page (fake data, disappointment)
```

### Usability Findings

**F-1: Auth pages lack any branding or identity** (Critical)
- Files: `app/auth/login/page.tsx`, `app/auth/sign-up/page.tsx`, `app/auth/forgot-password/page.tsx`
- The login and sign-up pages are plain white cards with generic titles "Login" and "Sign up." No LegoFlex logo, no color, no illustration. A user arriving from a shared link has zero visual confirmation they are on the right app.
- The login card title at `components/auth/login-form.tsx:54` says just "Login" and description says "Enter your email below to login to your account." This is boilerplate starter kit language.
- **Recommendation:** Add the LegoFlex logo + brand name above the card, use the primary yellow as an accent line or background gradient, and write personality-infused copy ("Welcome back, Builder" / "Join the Collection").
- **Priority:** Critical -- this is the front door.

**F-2: Sign-up success page is a dead end** (High)
- File: `app/auth/sign-up-success/page.tsx`
- After sign-up, the user sees "Check your email to confirm" with no link back to login, no "Resend email" button, and no guidance on checking spam. The card at lines 14-27 has a `CardContent` with a single paragraph and nothing else.
- **Recommendation:** Add a "Back to Login" link, a "Resend Confirmation Email" button with a cooldown timer, and a tip about checking spam/promotions folders. Add an email icon illustration.
- **Priority:** High -- this is where most users get stuck.

**F-3: Auth error page shows raw error codes with no recovery path** (High)
- File: `app/auth/error/page.tsx`, lines 13-21
- The error page renders `Code error: {params.error}` which shows strings like `invalid_token`. No human-readable mapping, no "Try again" link, no "Back to login" button.
- **Recommendation:** Map common error codes to user-friendly messages (e.g., `expired_link` -> "Your confirmation link has expired. Request a new one.") and always show a "Back to Login" link.
- **Priority:** High

**F-4: Onboarding form presents 7 fields with equal visual weight** (Medium)
- File: `components/auth/onboarding-form.tsx`, lines 124-257
- The form has: avatar selector, username (required), display name, bio, location, date of birth, favorite themes. Only username is required, but all fields are presented in a single scrolling column with no visual hierarchy.
- Date of Birth (line 218) is particularly concerning -- users do not understand why a Lego tracker needs their birthday, and it creates privacy friction. The field has no explanation of its purpose.
- **Recommendation:** Split onboarding into 2-3 steps: Step 1 (required): avatar + username. Step 2 (optional, skippable): bio + display name + location. Step 3 (optional, skippable): favorite themes. Remove Date of Birth entirely, or move it to Settings with a clear explanation ("Used for age-appropriate content" or similar).
- **Priority:** Medium

**F-5: After onboarding, user lands on the fake Home page** (Critical)
- File: `components/auth/onboarding-form.tsx`, line 108 -- `window.location.href = "/"`
- A brand-new user who just completed onboarding lands on a page full of fake stories, fake posts from "BrickMaster99," and fake trending sets. Their vault is empty, they follow nobody, and the first thing they see is a fabricated community.
- **Recommendation:** After onboarding, redirect to `/explore` (the page with real data and immediate value) instead of Home. Or better: redirect to a one-time "Welcome" screen that says "Start by browsing sets" with a prominent Explore CTA.
- **Priority:** Critical -- agrees with PM roadmap P0-2, user research Recommendation 1.

### Onboarding State Diagram

| State | Current Behavior | Recommended Behavior |
|-------|-----------------|---------------------|
| Landing (unauthenticated) | Sees fake feed with no CTA | Redirect to `/auth/login` (requires middleware) |
| Sign-up form | 3 fields, no password strength indicator | Add password strength meter, 8-char minimum visible |
| Sign-up success | Dead end card | "Resend email" button + "Back to login" link + spam tip |
| Email confirmed | May fail silently (no callback route) | Ensure callback route works, show "Email confirmed!" toast |
| Onboarding | 7-field monolith form | Multi-step wizard with skip affordances |
| Post-onboarding | Lands on fake Home | Lands on Explore with a welcome banner |

---

## 2. Flow Audit: Adding Sets to Vault

### Current Flow from Explore (Tap Count: 1 tap to add)

```
Explore page -> Browse grid -> Tap Heart icon (wishlist) or Plus icon (collection)
  -> Toast appears "Added to wishlist" / "Added to collection"
  -> Icon state changes (Heart fills / Plus becomes Check)
  -> To undo: hover the Check icon -> it becomes X -> tap X
  -> Toast appears (none for remove)
```

### Usability Findings

**F-6: Adding a set is fast and satisfying -- this is the app's best interaction** (Positive)
- File: `components/explore/discovery-card.tsx`, lines 48-77 (wishlist heart), 104-148 (collection plus)
- File: `app/(app)/explore/explore-client.tsx`, lines 87-191 (optimistic updates)
- One-tap add with immediate visual feedback (icon state change), optimistic UI, and a success toast. The loading spinner during pending state (Loader2 at line 69 of discovery-card) is appropriate. The error handling reverts the optimistic update correctly.
- This is the gold standard interaction in the app. Other flows should match this quality.

**F-7: Set cards in Explore are not clickable for detail viewing** (Critical)
- File: `components/explore/discovery-card.tsx` -- the outer `div` at line 31 has `cursor-pointer` via `group` hover but no `onClick` handler and no `Link` wrapper. The entire card area is a visual dead end except for the two action buttons.
- A user who wants to learn more about a set before adding it cannot. They see a thumbnail, name, year, piece count, and theme badge -- but no route to see the full set image, related sets, or how many people own it.
- **Recommendation:** Make the card image and title area clickable, linking to a set detail page at `/set/[setNum]`. Keep the heart and plus buttons as distinct click targets that do NOT navigate.
- **Priority:** Critical -- agrees with PM P1-7, user research Recommendation 2.

**F-8: No undo on the success toast after adding a set** (Medium)
- File: `app/(app)/explore/explore-client.tsx`, line 117 -- `toast.success("Added to wishlist")` and line 151 -- `toast.success("Added to collection")`
- The toast library (sonner) supports an `action` prop for undo functionality, but it is not used. After adding a set, the only undo path is: hover the check icon, wait for the X to appear, tap X. This is a 3-step undo for a 1-step action.
- **Recommendation:** Add an "Undo" button on the success toast: `toast.success("Added to collection", { action: { label: "Undo", onClick: () => handleRemove(setNum) } })`.
- **Priority:** Medium

**F-9: No duplicate detection when adding a set already in vault** (Low)
- The upsert behavior in the server action silently succeeds if the set already exists with a different collection_type (it changes the type). If the same type, it is a no-op. The user gets "Added to collection" even if they already had it.
- **Recommendation:** Check the local `userSets` map before adding. If the set exists, show "Already in your collection" or "Moved from wishlist to collection" instead of the generic success toast.
- **Priority:** Low

**F-10: No feedback when 10 theme filters are reached** (Medium)
- File: `components/explore/explore-header.tsx`, line 62 -- `if (selectedThemes.length < 10)` silently prevents adding an 11th theme.
- **Recommendation:** When the user taps a chip and the limit is reached, show a brief toast: "Maximum 10 theme filters reached."
- **Priority:** Medium

**F-11: "Add Favorite Themes" CTA navigates away without return path** (Medium)
- File: `components/explore/explore-header.tsx`, lines 122-130 -- clicking "Add Favorite Themes" navigates to `/settings/profile`. After saving themes there, the user must manually find their way back to Explore.
- **Recommendation:** Either open a theme selection inline (a modal, like the existing `ThemeFilterModal`) or add a `?returnTo=/explore` query parameter to the settings link and handle the redirect after save.
- **Priority:** Medium

### Add-to-Vault State Diagram

| State | Visual | Behavior |
|-------|--------|----------|
| Not in vault | Heart (outline) + Plus (outline) | Heart adds to wishlist, Plus adds to collection |
| In wishlist | Heart (filled, yellow) + Plus (outline) | Heart removes from wishlist, Plus moves to collection |
| In collection | Heart (hidden) + Check (yellow, solid) | Hover check -> X appears, X removes from collection |
| Pending | Loader spinner replaces icon | Buttons disabled |
| Error | Reverts to previous state | Error toast appears |
| Success | New state applied | Success toast (needs undo action) |

---

## 3. Flow Audit: Social Discovery & Following

### Current Flow (Tap Count: Impossible for most paths)

```
Home page right sidebar (xl+ only) -> See "Suggested Collectors"
  -> Tap "Follow" button -> Optimistic follow (works)
  -> Want to view their profile? -> Cannot -- username is plain text, not a link

Profile page -> See "312 Followers" count -> Tap it -> Nothing happens
  -> Want to see who follows you? -> No page exists

Leaderboard -> See @username in list -> Tap row -> Navigate to /u/{userId} (works!)
  -> This is the ONLY functional navigation to public profiles
```

### Usability Findings

**F-12: Suggested collectors usernames are not links** (Critical)
- File: `components/home/right-sidebar.tsx`, line 139 -- the username is a plain `<span>` element, not wrapped in a `<Link>` to `/u/{user.id}`. The user can follow someone but cannot view their profile.
- **Recommendation:** Wrap the avatar + username in a `<Link href={'/u/${user.id}'}>`
- **Priority:** Critical

**F-13: Follower/Following/Friends counts are not interactive** (High)
- File: `components/profile/profile-hero.tsx`, lines 55-80 -- the counts are plain `<div>` text elements. Tapping them does nothing. Every social app makes these counts clickable to show the list of users.
- File: `app/(app)/u/[userId]/profile-client.tsx`, lines 123-148 -- same issue on public profiles.
- **Recommendation:** Make each count a `<Link>` to `/u/{userId}/followers`, `/u/{userId}/following`, `/u/{userId}/friends`. These pages show a scrollable list of users with follow/unfollow buttons.
- **Priority:** High

**F-14: No user search anywhere in the app** (High)
- The only way to find a specific user is to know their user ID and type the URL manually. There is no user search in the sidebar, the explore page, or anywhere else.
- **Recommendation:** Add a user search tab or toggle within the Explore header, or add a unified search in the sidebar/mobile header that searches both sets and users.
- **Priority:** High

**F-15: Follow confirmation feedback is minimal** (Medium)
- File: `components/home/right-sidebar.tsx`, line 37 -- on follow error, there is a `toast.error`. On success, there is no toast. The button text changes from "Follow" to "Following" but there is no celebratory feedback.
- File: `app/(app)/u/[userId]/profile-client.tsx`, line 57 -- the follow toggle calls `router.refresh()` after success, which causes a full page data refetch. No success toast.
- **Recommendation:** Add `toast.success("You're now following @username")` on follow, and `toast("Unfollowed @username")` on unfollow. Consider a brief confetti animation on follow for delight.
- **Priority:** Medium

**F-16: No share profile button anywhere** (High)
- Neither the own-profile page (`app/(app)/profile/page.tsx`) nor the public profile page (`app/(app)/u/[userId]/page.tsx`) has a share button. The public profile URL exists but is not surfaced.
- **Recommendation:** Add a "Share Profile" button on both pages that copies the `/u/{userId}` URL to the clipboard with a toast: "Profile link copied!" On mobile, use the native Web Share API if available.
- **Priority:** High -- agrees with PM P1-13 (share profile / viral loop).

**F-17: Suggested Collectors widget is only visible on xl+ screens** (High)
- File: `components/home/right-sidebar.tsx`, line 77 -- `className="hidden xl:flex"`. On tablets and mobile (the majority of Lego collector devices), the ONLY social discovery mechanism is completely invisible.
- **Recommendation:** On mobile/tablet, show a horizontal scrollable "Suggested Collectors" row either at the top of the (new) Home dashboard or as a card within the feed. The follow button should be visible on each card.
- **Priority:** High

---

## 4. Flow Audit: Profile & Storytelling

### Current Flow

```
Sidebar -> Profile
  -> See avatar with glow + @username + rank badge
  -> See Followers/Following/Friends counts (non-clickable)
  -> See Favorites grid (4 slots, may be empty)
  -> See "Edit Selection" button (non-functional)
  -> See Bio (may be empty)
  -> See Interest tags (always empty)
  -> See Rank Progress card with progress bar
  -> See Vault Value ("Coming Soon") + Total Parts + Global Rank
  -> See Milestone vault with achievement badges
  -> See "Add milestone" button (non-functional)
```

### Usability Findings

**F-18: Profile has no "Edit Profile" shortcut** (High)
- File: `app/(app)/profile/page.tsx` -- there is no edit button anywhere on the profile page. To edit, users must navigate to Settings (sidebar) -> Edit Profile (link item). That is 2 clicks away from the context where they see the problem.
- The public profile page (`app/(app)/u/[userId]/profile-client.tsx`) DOES show a follow button for non-owners, but the own-profile page does not show an edit button for the owner.
- **Recommendation:** Add an "Edit Profile" button (pencil icon) next to or below the username on the own-profile page. It should link to `/settings/profile`.
- **Priority:** High

**F-19: Profile has no link to Vault** (Medium)
- File: `app/(app)/profile/page.tsx` -- the profile shows collection stats (sets, pieces, brick score) but has no "View my Vault" button. The public profile (`profile-client.tsx`, line 186) has a "View Vault" link, but the own profile omits it.
- **Recommendation:** Add a "View Vault" button or make the stats cards (Total Parts, sets) clickable links to `/vault`.
- **Priority:** Medium

**F-20: "Edit Selection" button on favorites does nothing** (High)
- File: `components/profile/favorites-grid.tsx`, line 20-22 -- the button renders with no `onClick` handler. It appears on both own-profile and the duplicated version in `profile-client.tsx` (line 159-164).
- This is a trust violation: a visible, styled, primary-colored button that silently fails.
- **Recommendation:** Remove the button entirely until the edit flow is built. When built, it should open a modal that lets users reorder or swap their top 4 from their vault favorites.
- **Priority:** High -- remove the dead button immediately.

**F-21: "Add milestone" button does nothing** (Medium)
- File: `components/profile/milestone-vault.tsx`, lines 40-47 -- a dashed-border button with a Plus icon and no handler.
- **Recommendation:** Remove the button. Milestones are derived from collection data (1k bricks, 10k bricks, etc.) and should not be manually added. The empty slot creates confusion about what milestones even are.
- **Priority:** Medium -- remove to reduce confusion.

**F-22: Interest tags are permanently empty** (Medium)
- File: `lib/queries/profile.ts`, line 36 -- `interests: [] as string[]`
- The user's theme preferences (stored in `user_themes`) are the obvious data source for interests, but they are not mapped.
- **Recommendation:** Populate `interests` from the user's `user_themes` records by joining to `themes.name`. Display them as interest tags on the profile.
- **Priority:** Medium

**F-23: "isOnline" green dot is always on, "isVerified" badge never appears** (Medium)
- File: `lib/queries/profile.ts`, lines 31-32 -- `isOnline: true`, `isVerified: false`
- File: `components/profile/profile-hero.tsx`, lines 32-34 -- the green dot always renders because `isOnline` is always true.
- **Recommendation:** Remove the online indicator entirely. Real-time presence tracking is expensive and out of scope. Remove the verified badge from the UI until a verification system is designed.
- **Priority:** Medium -- misleading UI elements erode trust.

**F-24: Profile does not tell a compelling collector "story"** (Medium)
- The profile page is a collection of data cards, but it lacks narrative flow. A great collector profile should answer: "What do they collect? What are they proud of? How far have they come?"
- Current order: Avatar -> Counts -> Favorites -> Bio -> Rank -> Stats -> Milestones. The bio (the personal narrative) is buried below the favorites grid.
- **Recommendation:** Reorder: Avatar -> Rank Badge + Quick Stats (compact) -> Bio + Interests (the story) -> Favorites (the showcase) -> Rank Progress (the journey) -> Milestones (the achievements). Place the most human elements first, data-dense elements after.
- **Priority:** Medium

---

## 5. Flow Audit: Vault Management

### Current Flow

```
Sidebar -> Vault
  -> See Stats Hero: "Total Market Value: $0" (prominent, yellow, large)
  -> See Collection / Wishlist tabs with counts
  -> Use search (works, client-side filter)
  -> Use theme filter (desktop only, hidden on mobile)
  -> Switch grid/list view (desktop only, hidden on mobile)
  -> Select sets via checkboxes -> Bulk actions bar appears at bottom
  -> Bulk Remove: immediate deletion, no confirmation
  -> Bulk Move to Collection: works with toast
  -> Favorite toggle: works, max 4 enforced via toast error
```

### Usability Findings

**F-25: "$0" is the most prominent visual on the vault page** (Critical)
- File: `components/vault/vault-stats-hero.tsx`, lines 74-79 -- the `isPrimary: true` stat gets `text-primary` (Lego yellow) styling at `text-3xl md:text-4xl font-black`. This makes "$0" the single largest, boldest, most eye-catching element on the entire page.
- File: `components/vault/vault-card.tsx`, line 94 -- every card shows `{set.price}` which is always "$0".
- File: `components/vault/vault-list.tsx`, line 77 -- the list view shows `{set.price}` in `text-primary` (yellow, bold).
- **Recommendation:** Replace "$0" with a contextual alternative. Option A (recommended): Remove the value stat entirely from the hero and cards, replace with "Total Themes" or simply hide the row. Display "Vault Value" only after price data exists. Option B: Show "Coming Soon" as the profile page does. Never show "$0" -- it reads as "your collection is worthless."
- **Priority:** Critical -- agrees with PM P1-8, user research Recommendation 3.

**F-26: Vault is empty on first visit with no actionable CTA** (High)
- File: `components/vault/vault-grid.tsx`, lines 16-23 -- the empty state says "Your vault is empty. Head to Explore to start adding sets to your collection." but it does NOT include a link or button to Explore. The `EmptyState` component at `components/shared/empty-state.tsx` supports a `children` prop for action buttons but it is not used here.
- **Recommendation:** Add a "Browse Sets" button as a child of the empty state that links to `/explore`.
- **Priority:** High

**F-27: Bulk delete has no confirmation dialog** (Critical)
- File: `components/vault/vault-bulk-actions.tsx`, lines 52-65 -- the "Remove" button directly calls `onRemove` which executes `handleBulkRemove` in `vault-client.tsx` (line 196). There is no `AlertDialog` or confirmation step. A misclick deletes multiple sets instantly.
- File: `app/(app)/vault/vault-client.tsx`, lines 196-227 -- the optimistic removal is immediate. The revert-on-error logic exists, but a successful deletion cannot be undone.
- **Recommendation:** Wrap the Remove button in an `AlertDialog` (already installed in `components/ui/alert-dialog.tsx`): "Remove {n} set(s) from your vault? This action cannot be undone." with Cancel and Remove buttons.
- **Priority:** Critical -- data loss risk.

**F-28: No "Select All" for bulk operations** (Medium)
- File: `components/vault/vault-bulk-actions.tsx` -- the bulk bar shows the count and actions but there is no "Select All" affordance. Users with 100 sets must individually check each one.
- **Recommendation:** Add a "Select All" checkbox in the toolbar (or at the top of the grid/list) that selects all currently-filtered sets.
- **Priority:** Medium

**F-29: View mode toggle is visible on mobile but list view is hidden** (Medium)
- File: `components/vault/vault-toolbar.tsx`, lines 72-101 -- the view mode toggle is wrapped in `hidden sm:flex`, so it is desktop-only. BUT even if it were visible on mobile, the list view at `vault-client.tsx` line 270 is `hidden sm:block`. This is inconsistent but at least not actively misleading since both are hidden.
- **Recommendation:** On mobile, keep only grid view and hide the toggle entirely. Alternatively, design a mobile-appropriate list view (cards in a single column with compact info).
- **Priority:** Medium

**F-30: Vault search only filters already-loaded sets** (Medium)
- File: `app/(app)/vault/vault-client.tsx`, lines 118-140 -- the `filteredSets` memo applies search to the client-side `sets` array. If a user has 200 sets and only 50 are loaded, searching for set #51+ returns no results.
- **Recommendation:** Either load all sets on initial page load (acceptable for most collectors -- 500 sets is ~50KB), or implement server-side search like Explore does.
- **Priority:** Medium

**F-31: Vault has no sort controls** (Medium)
- File: `app/(app)/vault/vault-client.tsx`, lines 135-139 -- the only sort is favorites-first. Users cannot sort by name, year, piece count, or date added.
- **Recommendation:** Add a sort dropdown in the toolbar (same pattern as Explore's sort) with options: Favorites First, Newest Added, Oldest Added, Name A-Z, Most Pieces, Year (Newest), Year (Oldest).
- **Priority:** Medium

**F-32: Favorite limit error is a surprise** (Low)
- File: `app/(app)/vault/vault-client.tsx`, lines 106-114 -- when the user tries to favorite a 5th set, the optimistic UI toggles the heart, then reverts it when the error comes back, and a toast says "Maximum 4 favorites allowed."
- **Recommendation:** Show the current favorite count near the top of the collection tab: "Favorites: 3/4". When 4/4, show hearts on non-favorited sets as dimmed/disabled with a tooltip "Maximum 4 favorites reached."
- **Priority:** Low

**F-33: Status badges exist in the UI but cannot be set by users** (High)
- File: `components/vault/vault-card.tsx`, lines 19-31 (STATUS_VARIANTS, STATUS_LABELS) and line 77-81 (rendering).
- File: `components/vault/vault-list.tsx`, lines 14-22 and 80-88.
- The UI renders "Built", "In Box", "Missing Parts", "For Sale" badges but the database has no `status` column on `user_sets` and there is no UI to set the status.
- **Recommendation:** Either remove status badge rendering entirely until the feature is built, OR build it now (it is a high-value feature for serious collectors). If building: add a status column to `user_sets`, add a dropdown or context menu on each card to set status, and show status filter in the toolbar.
- **Priority:** High -- remove the vestigial UI, or implement.

---

## 6. Flow Audit: Leaderboard

### Current Flow

```
Sidebar -> Leaderboard
  -> See header with total users count
  -> See list of users with rank, avatar, username, sets, pieces, brick score
  -> Each row is clickable -> navigates to /u/{userId} (works!)
  -> Current user row is highlighted with primary background
  -> "Load More" pagination
```

### Usability Findings

**F-34: Leaderboard rows link to public profiles -- this is the best social navigation in the app** (Positive)
- File: `components/leaderboard/leaderboard-table.tsx`, line 33 -- `<Link href={'/u/${entry.userId}'}>`
- This is the ONLY place in the app (besides typing a URL) where users can navigate to another user's profile. The leaderboard accidentally became the social discovery hub.

**F-35: Leaderboard has no filtering** (Low)
- No ability to filter by theme, time period, friends only, or region.
- **Recommendation:** Add a "Friends Only" toggle as a first step (filter to users you follow + mutuals). Additional filters are v2.
- **Priority:** Low

**F-36: Current user position card could be more motivating** (Low)
- File: `components/leaderboard/current-user-card.tsx` -- shows position number but not the gap to the next rank or the user above you.
- **Recommendation:** Show "You are #47. Add 230 more pieces to pass @username at #46." This creates a tangible goal.
- **Priority:** Low

---

## 7. Flow Audit: Settings

### Current Flow

```
Sidebar -> Settings
  -> Account: Edit Profile (link to /settings/profile), Password Reset (dialog)
  -> Collection: Profile Visibility (toggle), Default Grid View (dialog)
  -> Appearance: Theme Selector (dialog)
  -> System: Email Notifications (toggle)
  -> Sign Out (no confirmation)
```

### Usability Findings

**F-37: Email Notifications toggle pretends to do something** (High)
- File: `app/(app)/settings/settings-client.tsx`, lines 89-101 -- the toggle updates the database column but there is no email infrastructure.
- **Recommendation:** Add a "Coming Soon" badge next to the toggle, or disable it with explanatory text.
- **Priority:** High -- false functionality erodes trust. Agrees with PM P0-6.

**F-38: Default Grid View setting is not applied** (Medium)
- File: `app/(app)/vault/vault-client.tsx`, line 56 -- `const [viewMode, setViewMode] = useState<VaultViewMode>("grid")`. This always starts at "grid" regardless of the `default_grid_view` setting.
- **Recommendation:** Pass the user's `default_grid_view` preference as a prop to `VaultPageClient` and use it as the initial state.
- **Priority:** Medium

**F-39: Sign-out has no confirmation** (Medium)
- File: `components/settings/settings-sign-out.tsx` -- the QA report (MAJ-11) confirms there is no confirmation dialog despite documentation claiming there is.
- **Recommendation:** Add an `AlertDialog` before sign-out: "Are you sure you want to sign out?"
- **Priority:** Medium

**F-40: After editing profile, user goes to /settings, not /profile** (Low)
- File: `components/settings/edit-profile-form.tsx` -- after successful save, the router navigates to `/settings`. The user just edited their profile and wants to see the result, but they land on the settings hub instead.
- **Recommendation:** After saving profile edits, navigate to `/profile` to show the updated result.
- **Priority:** Low

---

## 8. Missing Micro-Interactions Inventory

### Confirmation Feedback

| Action | Current Feedback | Missing Feedback | Priority |
|--------|-----------------|------------------|----------|
| Add set to collection (Explore) | Toast "Added to collection" | No undo action on toast | Medium |
| Add set to wishlist (Explore) | Toast "Added to wishlist" | No undo action on toast | Medium |
| Remove set from vault (Explore) | No toast | Should show "Removed from vault" toast | Medium |
| Follow user (right sidebar) | Button text changes | No success toast, no name mentioned | Medium |
| Follow user (public profile) | Button changes, full page refresh | No success toast | Medium |
| Unfollow user | Button changes | No confirmation toast | Medium |
| Toggle favorite (vault) | Heart fills/unfills optimistically | No success feedback on favorite, only error on max | Low |
| Bulk move to collection | Toast "Sets moved to collection" | Works well | -- |
| Bulk remove | Toast "Sets removed from vault" | No confirmation dialog before action! | Critical |
| Sign out | Immediate sign out | No confirmation dialog | Medium |
| Save profile edits | Toast on error only | No success toast, navigates to wrong page | Medium |
| Toggle setting | Optimistic toggle | No success feedback, only reverts on error | Low |
| Reach milestone | Milestone silently appears on profile | No notification, no celebration, no confetti | Medium |
| Reach new rank | Rank silently updates | No notification, no "You've been promoted!" modal | High |

### Progress Indicators

| Situation | Current Indicator | Missing Indicator | Priority |
|-----------|-------------------|-------------------|----------|
| Page loading (all pages) | Spinner or "Loading..." text | No skeleton screens matching layout | Medium |
| Set card loading (Explore) | Full page spinner | No card skeleton placeholders | Low |
| Load More button pressed | Spinner in button | Works adequately | -- |
| Profile loading | "Loading profile..." text | No skeleton matching profile layout | Low |
| Vault loading | Full page spinner | No skeleton matching vault layout | Low |
| Onboarding theme fetch | No indicator | Themes section appears suddenly when loaded | Low |
| Explore search debounce | No visual debounce indicator | User types and nothing happens for 300ms | Low |

### Undo Capabilities

| Destructive Action | Undo Available? | Recommended Undo | Priority |
|--------------------|----------------|------------------|----------|
| Remove set from vault (Explore) | No | Undo button on toast (re-add with same type) | Medium |
| Bulk remove sets (Vault) | No | Undo button on toast (re-add all, 10s window) | High |
| Unfollow user | No | Undo button on toast (re-follow) | Low |
| Remove from favorites | No (optimistic toggle, but no explicit undo) | Heart toggles back, acceptable | -- |
| Sign out | No | Confirmation dialog before action | Medium |

---

## 9. Top 5 Flow Improvements (Wireframe-Level)

### Improvement 1: Home Page Dashboard (Replaces Fake Feed)

**Affected files:**
- `app/(app)/page.tsx` (complete rewrite)
- `lib/queries/home.ts` (replace TODO stubs with real queries)
- `components/home/*` (replace stories-carousel.tsx, feed.tsx, feed-post.tsx, right-sidebar.tsx)
- `lib/mockdata.ts` (remove entirely)

**Screen States:**

**Empty state (new user, no sets, no follows):**
```
+--------------------------------------------------+
|  Welcome to LegoFlex, @username!                  |
|  Your collection journey starts here.             |
|                                                   |
|  [ Browse Sets ]  (primary CTA -> /explore)       |
|  [ Complete Your Profile ]  (secondary -> /settings/profile) |
|                                                   |
|  --- Suggested Collectors (horizontal scroll) --- |
|  [avatar] @user1 [Follow]                         |
|  [avatar] @user2 [Follow]                         |
|  [avatar] @user3 [Follow]                         |
|                                                   |
|  --- Your Rank ---                                |
|  Start adding sets to earn your first rank!       |
+--------------------------------------------------+
```

**Loading state:**
```
+--------------------------------------------------+
|  [skeleton: 3 stat cards in a row]                |
|  [skeleton: 5 horizontal card placeholders]       |
|  [skeleton: 3 activity items]                     |
+--------------------------------------------------+
```

**Populated state (has sets, has follows):**
```
+--------------------------------------------------+
|  --- Your Collection at a Glance ---              |
|  [Total Sets: 42] [Total Pieces: 18,340] [Rank: #12] |
|                                                   |
|  --- Recently Added (last 5) ---                  |
|  [set card] [set card] [set card] -> horizontal   |
|  "View All in Vault" link                         |
|                                                   |
|  --- Rank Progress ---                            |
|  [compact rank card with progress bar]            |
|                                                   |
|  --- Activity from People You Follow ---          |
|  @user1 added "Millennium Falcon" 2h ago          |
|  @user2 reached 10k bricks! 5h ago               |
|  @user3 started following you 1d ago              |
|  "See more" link                                  |
|                                                   |
|  --- Suggested Collectors ---                     |
|  [avatar] @user [Follow] [View Profile]           |
|  [avatar] @user [Follow] [View Profile]           |
+--------------------------------------------------+
```

**Error state:**
```
+--------------------------------------------------+
|  Something went wrong loading your dashboard.     |
|  [ Try Again ]                                    |
+--------------------------------------------------+
```

**Transitions & Animations:**
- Stats cards: counter animation from 0 to actual value on first load (CSS `@keyframes count-up`)
- Recently added sets: fade-in stagger (each card 100ms delay)
- Activity feed items: slide-in-from-left stagger
- Rank progress bar: animate width from 0 to actual percentage
- All animations should respect `prefers-reduced-motion`

**Key design decisions:**
- NO mock data. Every element is derived from real tables: `user_sets`, `follows`, `profiles`.
- Activity feed derives from `user_sets.created_at` (set additions) and `follows.created_at` (new follows). No new tables needed.
- "Recently Added" uses the existing `getVaultSets` query with `limit: 5, orderBy: "created_at desc"`.
- Suggested Collectors reuses `getSuggestedUsersWithFollowStatus` but adds a "View Profile" link.
- The entire right sidebar concept is removed. Content flows in a single column, mobile-friendly by default.

---

### Improvement 2: Set Detail Page

**Affected files (new):**
- `app/(app)/set/[setNum]/page.tsx`
- `app/(app)/set/[setNum]/actions.ts`
- `lib/queries/set-detail.ts`
- `components/set-detail/set-detail-hero.tsx`
- `components/set-detail/set-actions.tsx`
- `components/set-detail/related-sets.tsx`

**Screen States:**

**Loading state:**
```
+--------------------------------------------------+
|  [skeleton: large image area 50vh]                |
|  [skeleton: title bar]                            |
|  [skeleton: 4 stat pills]                         |
|  [skeleton: 2 action buttons]                     |
+--------------------------------------------------+
```

**Populated state:**
```
+--------------------------------------------------+
|  [Large set image -- full width, max-h 50vh]      |
|                                                   |
|  LEGO Technic Bugatti Chiron                      |
|  #42083 | Technic | 2018                          |
|                                                   |
|  [3,599 pcs] [Year: 2018] [42 Collectors]         |
|                                                   |
|  [ Add to Collection ]  [ Add to Wishlist ]       |
|  (or: [ In Your Collection (check) ] [ Remove ])  |
|                                                   |
|  --- About This Set ---                           |
|  Theme: Technic                                   |
|  Pieces: 3,599                                    |
|  Year: 2018                                       |
|  Set Number: 42083-1                              |
|  Owned by: 42 LegoFlex collectors                 |
|                                                   |
|  --- More from Technic ---                        |
|  [related set card] [related set card] [card]     |
+--------------------------------------------------+
```

**Not found state:**
```
+--------------------------------------------------+
|  Set Not Found                                    |
|  This set does not exist in our database.         |
|  [ Browse All Sets ]  (-> /explore)               |
+--------------------------------------------------+
```

**Mobile layout:**
- Image takes full width with a 1:1 aspect ratio
- Title and stats stack vertically
- Action buttons are full-width, stacked (collection on top, wishlist below)
- "More from Theme" section uses horizontal scrolling cards
- Sticky bottom bar with the primary action button (Add to Collection / In Collection) on scroll

**Key design decisions:**
- Owner count is derived from `SELECT COUNT(*) FROM user_sets WHERE set_num = $1 AND collection_type = 'collection'`
- Related sets: same theme, limit 8, excluding current set
- All set cards across the app (Explore, Vault, Profile favorites) should link here
- Open Graph meta tags for social sharing: set image, name, piece count

---

### Improvement 3: Vault Value Fix & Stats Redesign

**Affected files:**
- `components/vault/vault-stats-hero.tsx` (redesign)
- `components/vault/vault-card.tsx` (remove price, line 94)
- `components/vault/vault-list.tsx` (remove value column, line 39 and 77)
- `lib/queries/vault.ts` (remove `price: "$0"` from lines 81, 115, 146, 172)
- `lib/queries/vault.ts` (remove `totalValue: "$0"` from line 89 and `estimatedCost: "$0"` from line 146)
- `types/vault.ts` (remove price from VaultSet, remove dollar values from stats types)

**Before (current stats hero):**
```
Total Market Value    Total Pieces    Unique Sets
$0                    18,340          42
(yellow, giant)       (white)         (white)
```

**After (redesigned stats hero):**
```
+--------------------------------------------------+
|  VAULT / SHELF                                    |
|  Your private collection inventory.               |
|                                                   |
|  [42 Sets] [18,340 Pieces] [7 Themes]            |
|  (all equal weight, white text, medium size)      |
+--------------------------------------------------+
```

**For wishlist:**
```
+--------------------------------------------------+
|  VAULT / WISHLIST                                 |
|  Track sets you want to add to your collection.   |
|                                                   |
|  [12 Sets] [8,200 Target Pieces]                  |
+--------------------------------------------------+
```

**Card redesign (remove price):**
```
Before: [Image] Set Name | 2018 * 3,599 pcs | $0
After:  [Image] Set Name | 2018 * 3,599 pcs
```

**Key design decisions:**
- Remove ALL dollar values from the UI until real price data is available
- Replace the primary stat position (previously "$0" in yellow) with set count or piece count
- Add a "Themes" stat (count of unique themes in collection) -- easy to derive, adds meaning
- When price data is eventually available, re-add the value stat with proper formatting

---

### Improvement 4: Mobile Controls for Vault

**Affected files:**
- `components/vault/vault-toolbar.tsx` (make filters responsive)
- `app/(app)/vault/vault-client.tsx` (mobile-aware view mode)
- New: `components/vault/vault-mobile-filters.tsx` (filter sheet)

**Current mobile vault experience:**
```
[Search bar -- works]
[Theme filter -- HIDDEN]
[View toggle -- HIDDEN]
[Grid of cards]
[Bulk actions bar -- works but small on mobile]
```

**Improved mobile vault experience:**
```
+--------------------------------------------------+
|  [Search bar]  [Filter icon button]               |
|                                                   |
|  (tapping Filter opens a bottom sheet:)           |
|  +----------------------------------------------+|
|  | Theme: [All Themes v]                         ||
|  | Sort:  [Favorites First v]                    ||
|  | [ Apply ]  [ Reset ]                          ||
|  +----------------------------------------------+|
|                                                   |
|  [Grid of cards -- 1 column on small, 2 on md]   |
|                                                   |
|  [Sticky bottom: bulk actions when items selected]|
+--------------------------------------------------+
```

**Screen states:**

**Filter sheet (closed):** Filter icon in toolbar shows a dot badge if any filter is active.

**Filter sheet (open):**
```
+--------------------------------------------------+
|  Filters                                    [X]   |
|                                                   |
|  Theme                                            |
|  [All Themes]  [Star Wars]  [Technic] ...         |
|  (horizontal scrollable chips)                     |
|                                                   |
|  Sort By                                          |
|  ( ) Favorites First                              |
|  ( ) Newest Added                                 |
|  ( ) Most Pieces                                  |
|  ( ) Name A-Z                                     |
|                                                   |
|  [ Apply Filters ]  (primary, full width)         |
|  [ Reset ]          (ghost)                       |
+--------------------------------------------------+
```

**Key design decisions:**
- Use shadcn's `Sheet` component (already installed) for the mobile filter panel
- Sort is new functionality -- add it for both mobile and desktop
- The filter icon button uses a `Badge` dot when filters are active
- List view is removed from mobile entirely -- grid is the only option
- Bulk actions bar should be sized for thumb reach (taller touch targets on mobile)

---

### Improvement 5: Social Navigation Mesh

**Affected files:**
- `components/home/right-sidebar.tsx` (wrap usernames in Links)
- `components/profile/profile-hero.tsx` (make counts clickable)
- `app/(app)/u/[userId]/profile-client.tsx` (make counts clickable)
- New: `app/(app)/u/[userId]/followers/page.tsx`
- New: `app/(app)/u/[userId]/following/page.tsx`
- New: `components/social/user-list.tsx` (reusable user list component)

**Current social navigation:**
```
Suggested Collectors -> Follow (no profile link)
Leaderboard -> Profile (works!)
Profile counts -> Nothing
```

**Improved social navigation:**
```
Suggested Collectors -> Follow + View Profile (Link)
Leaderboard -> Profile (already works)
Profile counts -> Followers list / Following list / Friends list
Profile page -> Share button (copy link)
Home dashboard -> Activity feed with @username links -> Profile
Set detail page -> "42 Collectors" link -> list of users who own this set
```

**Followers/Following list page:**
```
+--------------------------------------------------+
|  @username's Followers (42)                       |
|  [Back button]                                    |
|                                                   |
|  [avatar] @follower1   [Follow]                   |
|  [avatar] @follower2   [Following]                |
|  [avatar] @follower3   [Follow]                   |
|  ...                                              |
|  [ Load More ]                                    |
+--------------------------------------------------+
```

**Loading state:** Skeleton rows with avatar circle + text line + button placeholder.

**Empty state:** "No followers yet" / "Not following anyone yet" with a CTA to explore/browse.

**Key design decisions:**
- Every username displayed anywhere in the app should be a `<Link>` to `/u/{userId}`
- The followers/following pages reuse the same `UserList` component
- Each user row shows: avatar, username, rank badge (small), follow/unfollow button
- The follow button uses the same optimistic toggle pattern as the right sidebar

---

## 10. Mobile-First Audit

LegoFlex's CSS is technically mobile-first (base styles, then `sm:` / `md:` / `lg:` breakpoints), but several design decisions actively disadvantage mobile users:

### Mobile Issues

| Issue | File | Line(s) | Impact | Fix Priority |
|-------|------|---------|--------|--------------|
| Vault theme filter hidden on mobile | `vault-toolbar.tsx` | 52 (`hidden sm:flex`) | Mobile users cannot filter by theme | High |
| Vault view toggle hidden on mobile | `vault-toolbar.tsx` | 72 (`hidden sm:flex`) | Invisible, but list view also hidden so no visual bug | Medium |
| Vault list view hidden on mobile | `vault-client.tsx` | 270 (`hidden sm:block`) | Mobile users have grid only (acceptable, but remove toggle) | Low |
| Right sidebar (only social discovery) hidden below xl | `right-sidebar.tsx` | 77 (`hidden xl:flex`) | No social features on mobile/tablet | High |
| Public profile fixed padding on mobile | `u/[userId]/page.tsx` | 86 (`px-8 py-12`) | Excessive padding, cramped content | Medium |
| Public profile avatar not responsive | `profile-client.tsx` | 70 (`size-44` fixed) | Too large on small screens, no `sm:` breakpoint | Medium |
| Leaderboard stats (Sets, Pieces) hidden on mobile | `leaderboard-table.tsx` | 76 (`hidden sm:flex`) | Mobile users see only rank + name + score | Low |
| Explore sort label hidden on mobile | `explore-header.tsx` | 138 (`hidden sm:inline`) | Sort still works, just no label -- acceptable | -- |
| Mobile header has no active page indicator | `mobile-header.tsx` | 32-35 | After navigating, no breadcrumb or page title visible | Medium |
| Sidebar footer (user info) not a link | `sidebar.tsx` | 58-78 | Desktop: user block not clickable to profile; Mobile: same | Low |

### Mobile Design Recommendations

1. **Add a bottom navigation bar on mobile** instead of relying on the hamburger menu. The 5 core destinations (Home, Explore, Vault, Profile, Leaderboard) should be one tap away at all times. The hamburger sheet menu is acceptable for Settings and overflow items.
   - **Priority:** High
   - **Pattern:** Fixed bottom bar, 5 icon tabs, active state highlight with primary color. Hides on scroll down, shows on scroll up.

2. **Show page title in mobile header.** Currently the mobile header just shows "LegoFlex" logo + hamburger. The user has no visual context for which page they are on.
   - **Priority:** Medium
   - **Fix:** Add a dynamic `<h1>` in the header based on current pathname.

3. **Vault mobile filter sheet.** Detailed in Improvement 4 above.
   - **Priority:** High

4. **Suggested Collectors on mobile Home.** Show as a horizontal scroll card row in the dashboard (Improvement 1).
   - **Priority:** High

---

## 11. Phase 1 Cross-Reference

### Agreements with Phase 1 Findings

| Phase 1 Finding | Source | UX Assessment |
|-----------------|--------|---------------|
| Home page must be replaced (P0-2) | PM, User Research, QA | **Strongly agree.** The fake feed is the #1 UX problem. The dashboard approach (PM/Research Rec 1) is correct. |
| Set detail page is critical (P1-7) | PM, User Research | **Strongly agree.** Every card is a dead end without it. This is the #2 priority. |
| "$0" values must be fixed (P1-8) | PM, User Research, QA | **Strongly agree.** But I go further: remove ALL dollar values, not just replace with "Coming Soon." "$0" is worse than nothing. |
| Privacy toggle must be enforced (P0-5) | PM, CTO, User Research, QA | **Strongly agree.** This is a trust and potentially legal issue. |
| Remove non-functional UI elements (P0-3) | PM, QA | **Strongly agree.** Every dead button trains users not to trust the app. |
| No middleware (P0-4) | PM, CTO, QA | **Strongly agree** from UX perspective. Unauthenticated users hitting protected routes see broken pages. |
| Email notifications toggle is misleading (P0-6) | PM, QA | **Agree.** Either label "Coming Soon" or remove. |
| Social discovery is broken (Research Rec 4) | User Research | **Strongly agree.** The social graph is invisible. Making usernames linkable is the quickest win. |

### Disagreements with Phase 1 Findings

| Phase 1 Finding | Source | UX Disagreement |
|-----------------|--------|-----------------|
| "Kill the Instagram-style feed entirely" (PM Cut List #1) | PM | **Partially disagree.** The Instagram-style feed with stories, posts, and comments should indeed be cut. But an activity feed (real actions by people you follow) should replace it as part of the Home dashboard. This is not the same as building a content creation system -- it is a derived activity log from existing data. |
| "Stories system should be killed" (PM Cut List #3) | PM | **Agree**, but with a caveat. Stories are wrong, but the *horizontal scrollable element* at the top of Home is good UX real estate. Repurpose it as "Recently Added by People You Follow" -- a horizontal scroll of set thumbnails from your followees' recent additions. |
| User Research suggests "Theme completion tracking" for Completionist persona | User Research | **Defer.** While high-value, this is a v2 feature. The v1 priority should be making the existing data honest and connected, not adding new data dimensions. |
| CTO suggests "Change `calculateGlobalPosition` to use COUNT" (PERF-1) | CTO | **Agree** technically, but also recommend a UX change: show rank as a range ("Top 10%") for users beyond position 100, which reduces the need for exact rank calculation at all. |

### New Findings Not in Phase 1

| Finding | Description | Priority |
|---------|-------------|----------|
| F-24: Profile lacks narrative flow | Bio is buried below favorites; data-dense elements precede personal elements | Medium |
| F-1: Auth pages have zero branding | Login/signup look like generic starter kit pages | Critical |
| Mobile bottom navigation bar needed | Hamburger-only navigation makes core features 2 taps away | High |
| No celebration for milestones/rank-ups | Achievements appear silently with no delight moment | Medium |
| Sidebar user block is not a link to profile | User must navigate to Profile separately | Low |

---

## 12. Summary of All Recommendations

### Critical Priority (Must fix before any launch)

| # | Recommendation | Flow | Effort |
|---|---------------|------|--------|
| R-1 | Replace Home page with real data dashboard | Home | 8-12h |
| R-2 | Add branding to auth pages (logo, colors, copy) | Onboarding | 2-3h |
| R-3 | Remove "$0" values from entire vault UI | Vault | 1-2h |
| R-4 | Add confirmation dialog on bulk delete | Vault | 30min |
| R-5 | Make Explore set cards link to a set detail page | Explore | 8-12h (includes building /set/[setNum]) |
| R-6 | Make suggested collector usernames link to profiles | Social | 15min |
| R-7 | Redirect post-onboarding to /explore instead of / | Onboarding | 5min |

### High Priority (Should fix before launch)

| # | Recommendation | Flow | Effort |
|---|---------------|------|--------|
| R-8 | Remove all non-functional buttons ("Edit Selection", "Add milestone", dead search bar, dead footer links) | All | 1h |
| R-9 | Make follower/following/friends counts clickable with list pages | Social | 4-6h |
| R-10 | Add "Edit Profile" button on own profile page | Profile | 15min |
| R-11 | Add share profile button (copy link + Web Share API) | Profile/Social | 1-2h |
| R-12 | Add mobile vault filter sheet (theme + sort) | Vault | 3-4h |
| R-13 | Build mobile bottom navigation bar (5 tabs) | Navigation | 4-6h |
| R-14 | Add "Browse Sets" CTA button in vault empty state | Vault | 15min |
| R-15 | Remove status badges from vault cards (or implement status feature) | Vault | 30min (remove) or 6-8h (implement) |
| R-16 | Label email notifications toggle as "Coming Soon" | Settings | 15min |
| R-17 | Add sign-up success page recovery actions (back to login, resend email) | Onboarding | 1h |
| R-18 | Map error codes to user-friendly messages on auth error page | Onboarding | 1h |
| R-19 | Show "Suggested Collectors" on mobile (not just xl+) | Social | 2h |
| R-20 | Remove or qualify "isOnline" indicator and "isVerified" badge | Profile | 30min |
| R-21 | Add undo action to add-to-vault success toasts | Explore | 1h |
| R-22 | Add rank-up notification/celebration modal when user reaches new rank | Profile | 3-4h |

### Medium Priority (Polish before public launch)

| # | Recommendation | Flow | Effort |
|---|---------------|------|--------|
| R-23 | Split onboarding into multi-step wizard | Onboarding | 4-6h |
| R-24 | Remove Date of Birth from onboarding or justify its presence | Onboarding | 15min (remove) |
| R-25 | Add vault sort controls (name, year, pieces, date added) | Vault | 2-3h |
| R-26 | Apply default_grid_view setting on vault load | Vault | 30min |
| R-27 | Navigate to /profile after saving profile edits (not /settings) | Settings | 15min |
| R-28 | Add page title to mobile header (dynamic based on route) | Navigation | 1h |
| R-29 | Fix public profile responsive issues (padding, avatar size) | Profile | 30min |
| R-30 | Populate interest tags from user_themes data | Profile | 1-2h |
| R-31 | Reorder profile sections: Bio before Favorites for better narrative | Profile | 30min |
| R-32 | Add "Select All" to vault bulk actions | Vault | 1h |
| R-33 | Add feedback when 10 theme filter limit is reached (Explore) | Explore | 15min |
| R-34 | Add success toast on follow/unfollow with @username | Social | 30min |
| R-35 | Add skeleton loading screens matching page layouts | All | 3-4h |
| R-36 | Add sign-out confirmation dialog | Settings | 30min |
| R-37 | Add user search capability (in Explore or global) | Social | 4-6h |

### Low Priority (Post-launch polish)

| # | Recommendation | Flow | Effort |
|---|---------------|------|--------|
| R-38 | Add duplicate detection on add-to-vault ("Already in collection") | Explore | 30min |
| R-39 | Add "returnTo" parameter on "Add Favorite Themes" CTA | Explore | 30min |
| R-40 | Add "Friends Only" toggle to leaderboard | Leaderboard | 2-3h |
| R-41 | Add motivational text to leaderboard position card | Leaderboard | 1h |
| R-42 | Show favorite count indicator on vault (3/4 favorites used) | Vault | 30min |
| R-43 | Make sidebar user block a link to /profile | Navigation | 15min |
| R-44 | Add vault list empty state to match grid empty state | Vault | 15min |
| R-45 | Make vault search server-side for large collections | Vault | 3-4h |

---

## 13. Dependencies & Conflicts

### Dependencies (order matters)

1. **Middleware (CTO CRIT-1) must be done first** -- many UX fixes assume unauthenticated users are redirected. Without middleware, post-onboarding redirects and auth-gated pages do not work properly.

2. **RLS policy fix (CTO CRIT-2) must precede social navigation** -- building followers/following list pages and public profile improvements will show empty data if the RLS policies block cross-user reads.

3. **Set detail page (R-5) must exist before making set cards clickable** -- the link target must exist before adding links.

4. **Home dashboard (R-1) should be done AFTER set detail page (R-5)** -- the dashboard's "Recently Added" cards should link to set detail pages. Building the dashboard first means those cards are still dead ends.

5. **Mobile bottom nav (R-13) should be done with the Home dashboard (R-1)** -- changing the navigation structure while also changing the Home page avoids two rounds of layout adjustments.

6. **Auth branding (R-2) and sign-up success fixes (R-17) should be done together** -- they are both in the auth flow and benefit from a single design pass.

### Recommended Implementation Order

```
Phase A (Foundation, ~2 days):
  Middleware (CTO) + RLS fix (CTO) + Auth branding (R-2) +
  Sign-up success fix (R-17) + Error page fix (R-18) +
  Post-onboarding redirect change (R-7)

Phase B (Core content, ~3 days):
  Set detail page (R-5) + Remove $0 values (R-3) +
  Remove dead buttons (R-8) + Remove misleading indicators (R-20)

Phase C (Home + Navigation, ~3 days):
  Home dashboard (R-1) + Mobile bottom nav (R-13) +
  Mobile header page title (R-28)

Phase D (Social, ~2 days):
  Suggested collectors links (R-6) + Follower counts clickable (R-9) +
  Share profile (R-11) + Follow success toasts (R-34) +
  Suggested collectors on mobile (R-19)

Phase E (Vault polish, ~2 days):
  Bulk delete confirmation (R-4) + Empty state CTA (R-14) +
  Mobile filter sheet (R-12) + Sort controls (R-25) +
  Remove status badges (R-15) + Apply default_grid_view (R-26)

Phase F (Profile + Settings polish, ~1 day):
  Edit Profile button (R-10) + Profile to vault link (R-19) +
  Profile reorder (R-31) + Interests from themes (R-30) +
  Settings fixes (R-16, R-27, R-36)
```

### Conflicts

1. **Conflict: Removing feed vs. building activity feed.** The PM recommends cutting the Instagram feed entirely. I agree with cutting stories/posts/comments but recommend keeping a simpler activity feed derived from real data. This is a scope discussion -- the activity feed is significantly less work than a full social media feed, but it is still new development. If timeline is tight, the Home dashboard can launch without the activity section and add it in a fast-follow.

2. **Conflict: Status badges -- remove or implement?** The PM puts status tracking at P2 (nice-to-have). The QA report flags it as Minor. I flag it as High because the badges RENDER on vault cards creating confusion. The minimum fix is removing the badge rendering (30 minutes). The ideal fix is implementing the feature (6-8h). These are different work items with different priorities.

3. **Conflict: Mobile bottom nav vs. existing hamburger.** Adding a bottom nav is a navigation paradigm shift. It will coexist with the hamburger (which moves to overflow items like Settings). This needs careful design to avoid having two competing navigation systems. The bottom nav should contain: Home, Explore, Vault, Profile, Leaderboard. The hamburger menu should contain only: Settings, Sign Out.

---

*End of UX Design Audit*
