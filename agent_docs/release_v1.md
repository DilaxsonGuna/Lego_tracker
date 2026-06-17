# Release V1 — Personal Collection Tracker

> Scope: Collection/wishlist tracker. Friends can see your sets. That's it.
> No AI scanning. No leaderboard. No achievements. No monetization. Web only.

---

## What's IN scope for v1

- Auth (login, signup, password reset, email confirm)
- Browse/search LEGO sets
- Add sets to collection or wishlist
- Remove sets, bulk actions
- View your vault (collection + wishlist tabs, sort, filter, grid/list)
- Profile page (avatar, bio, username, favorite sets)
- Public profiles (friends can view your collection)
- Follow/unfollow users
- Followers/following lists
- Activity feed (see what friends added)
- Search users
- Settings (profile edit, privacy toggle, theme)
- Mobile-responsive layout

## What's OUT of scope (remove or hide for v1)

- Leaderboard page (`/leaderboard`)
- Brick Score display (profile hero, sidebar, everywhere)
- Rank progress card on profile
- Milestone vault on profile
- Milestone celebration modals
- Analytics dashboard (`/vault/analytics`)
- Notification bell (infrastructure stays, UI not built anyway)
- AI set scanning (T-060)
- Pro tier / monetization (T-061)
- Price data (T-030)
- CSV export (T-036)
- Theme completion tracking (T-062)
- Year in Bricks (T-086)
- Referral program (T-085)

---

## MUST FIX before release

### 1. Rename the app — BLOCKER

**Status:** NOT DONE
**Why:** "LegoFlex" contains the LEGO trademark. LEGO Group sends cease-and-desist letters aggressively. This will get you shut down.

**What to change:**

- `app/layout.tsx:18` — site title "LegoFlex — Social Lego Collection Tracker"
- `components/shared/legoflex-logo.tsx` — logo component
- `components/home/dashboard-welcome.tsx:18` — "Welcome to LegoFlex"
- `components/shared/sidebar.tsx` — sidebar branding
- `components/shared/mobile-header.tsx` — mobile header branding
- `components/auth/login-form.tsx` — auth page copy
- `components/auth/sign-up-form.tsx` — auth page copy
- `app/auth/layout.tsx` — auth layout branding
- `components/profile/milestone-celebration.tsx` — share text
- `components/profile/share-profile-button.tsx` — share text
- `components/search/search-page-client.tsx` — search placeholder
- `app/(app)/settings/settings-client.tsx` — settings copy
- `components/settings/edit-profile-form.tsx` — form copy
- OG images (`opengraph-image.png`, `twitter-image.png`)
- Favicon

**Backup names:** BrickVault, StudTracker, BrickFlex, SetShelf, BrickShelf
**Also add disclaimer:** "Not affiliated with the LEGO Group" in footer/about.

**Effort:** 1-2 hours (find-and-replace + new logo assets)

---

### 2. Hide leaderboard — REQUIRED (scope removal)

**Status:** NOT DONE
**Why:** Out of v1 scope. Leaderboard with no purpose adds confusion.

**What to do:**

- Remove `/leaderboard` link from sidebar navigation
- Remove from mobile bottom nav (if present)
- Keep the route files (don't delete — just unlink). Users can't navigate to it.

**Effort:** 15 minutes

---

### 3. Hide brick score, rank, milestones from profile — REQUIRED (scope removal)

**Status:** NOT DONE
**Why:** Without leaderboard, brick score and rank are meaningless. Milestones are out of scope.

**What to do:**

- `components/profile/` — remove or conditionally hide:
  - `rank-progress.tsx` — rank progress card
  - `milestone-vault.tsx` — milestone display
  - `milestone-celebration.tsx` — celebration modal
- `app/(app)/profile/page.tsx` — remove brick score / rank from profile hero stats
- Same for public profile `app/(app)/u/[userId]/page.tsx`
- Keep the code, just don't render it. Use `{false && <RankProgress />}` or remove the import.

**Effort:** 30 minutes

---

### 4. Hide analytics page — REQUIRED (scope removal)

**Status:** NOT DONE
**Why:** Out of v1 scope. Nice feature but not needed for "personal tracker + friends."

**What to do:**

- Remove "Analytics" link from vault toolbar
- Keep route files (don't delete)

**Effort:** 10 minutes

---

### 5. Privacy policy page — BLOCKER

**Status:** MISSING
**Why:** Legal requirement. You collect email, username, collection data. GDPR applies to any EU visitor. App stores and hosting providers can pull you for missing it.

**What to create:**

- `app/(app)/privacy/page.tsx` (or a public route outside auth)
- Content: what data you collect (email, username, collection data), why, how stored (Supabase), no selling to third parties, how to request deletion (email you)
- Link from footer/settings

**Effort:** 1-2 hours (use a generator as starting point, customize)

---

### 6. Terms of service page — BLOCKER

**Status:** MISSING
**Why:** Protects you legally. Users need to agree to terms on signup.

**What to create:**

- `app/(app)/terms/page.tsx` (or public route)
- Content: acceptable use, you can terminate accounts, no guarantees on data accuracy, LEGO trademarks belong to LEGO Group
- Link from footer/settings and signup page

**Effort:** 1-2 hours

---

### 7. "Not affiliated with LEGO" disclaimer — BLOCKER

**Status:** MISSING
**Why:** LEGO Fair Play policy requires this for any fan site using LEGO content.

**What to do:**

- Add to footer: "LEGO is a trademark of the LEGO Group. This site is not affiliated with or endorsed by the LEGO Group."
- Add to Privacy Policy and Terms
- You don't have a footer component — create a simple one or add text to sidebar bottom

**Effort:** 30 minutes

---

### 8. Delete account functionality — BLOCKER

**Status:** MISSING
**Why:** GDPR requires it. Users must be able to delete their data.

**What to create:**

- Button in `/settings` — "Delete my account"
- Confirmation modal ("This will permanently delete all your data")
- Server action: delete from `user_sets`, `user_favorites`, `user_themes`, `follows`, `notifications`, `profiles`, then Supabase auth user deletion
- Redirect to `/auth/login` after deletion

**Effort:** 2-3 hours

---

### 9. robots.txt and sitemap — SHOULD HAVE

**Status:** MISSING
**Why:** Without these, Google won't index public profiles or set pages. Zero organic discovery.

**What to create:**

- `app/robots.ts` — allow indexing of `/explore`, `/set/*`, `/u/*` (public profiles)
- `app/sitemap.ts` — include public routes

**Effort:** 30 minutes

---

### 10. Error logging in queries — SHOULD HAVE

**Status:** MISSING (T-043)
**Why:** Query failures return empty arrays silently. A database timeout looks like "you have no sets." You'll get bug reports you can't diagnose.

**What to do:**

- Add `console.error("[functionName]", error.message)` to all `lib/queries/*.ts` catch blocks
- Not full monitoring (that's post-v1), just don't swallow errors silently

**Effort:** 1-2 hours

---

### 11. Welcome copy cleanup — MINOR

**Status:** Stale copy references removed features
**Why:** Dashboard welcome says "track your brick score" — brick score is out of v1 scope.

**What to fix:**

- `components/home/dashboard-welcome.tsx:18` — change copy to something like "Your collection starts here. Browse sets to build your vault."
- Audit all user-facing copy for references to leaderboard, rank, brick score, achievements

**Effort:** 30 minutes

---

## Summary

| Task                                 | Priority    | Effort | Status   |
| ------------------------------------ | ----------- | ------ | -------- |
| Rename app (remove "Lego" from name) | BLOCKER     | 1-2h   | Not done |
| Privacy policy page                  | BLOCKER     | 1-2h   | Not done |
| Terms of service page                | BLOCKER     | 1-2h   | Not done |
| LEGO trademark disclaimer            | BLOCKER     | 30m    | Not done |
| Delete account (GDPR)                | BLOCKER     | 2-3h   | Not done |
| Hide leaderboard from nav            | REQUIRED    | 15m    | Not done |
| Hide brick score/rank/milestones     | REQUIRED    | 30m    | Not done |
| Hide analytics from vault            | REQUIRED    | 10m    | Not done |
| robots.txt + sitemap                 | SHOULD HAVE | 30m    | Not done |
| Error logging in queries             | SHOULD HAVE | 1-2h   | Not done |
| Copy cleanup (remove score refs)     | MINOR       | 30m    | Not done |

**Total effort: ~10-14 hours of work**

---

## What's already working (no changes needed)

- Auth flow (login, signup, password reset, onboarding)
- Browse/search sets
- Vault (collection + wishlist, sort, filter, bulk actions, grid/list)
- Profile (own + public, with favorites and bio)
- Social (follow/unfollow, followers/following lists, activity feed)
- Settings (profile edit, privacy toggle, dark/light theme)
- Mobile responsiveness (bottom nav, responsive grids)
- Error boundaries and loading states
- 271 tests passing

---

## After v1 (revisit later if users show up)

- Analytics dashboard (already built, just hidden)
- Leaderboard (already built, just hidden)
- Milestones (already built, just hidden)
- Price data
- CSV import/export
- Notification bell UI
- Monitoring (Sentry)
- PostHog analytics
