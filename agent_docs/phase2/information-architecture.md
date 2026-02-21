# Information Architecture Audit & Proposal -- LegoFlex

**Date:** 2026-02-21
**Author:** Information Architect Agent
**Scope:** Navigation structure, information density, vault UX, content organization, search/filter taxonomy, labeling consistency, and sitemap proposal

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current Navigation Audit](#2-current-navigation-audit)
3. [Information Density Audit Per Page](#3-information-density-audit-per-page)
4. [Vault Deep Dive](#4-vault-deep-dive)
5. [Proposed Information Architecture](#5-proposed-information-architecture)
6. [Ideal Sitemap](#6-ideal-sitemap)
7. [Dependencies & Conflicts](#7-dependencies--conflicts)
8. [Phase 1 Cross-Reference](#8-phase-1-cross-reference)

---

## 1. Executive Summary

LegoFlex has six top-level sidebar routes competing for equal attention, a home page that serves no functional purpose, and a vault that buries its most useful tools behind responsive breakpoints. The navigation treats Settings (used rarely) and Leaderboard (used occasionally) with the same visual weight as Explore and Vault (used constantly). The information architecture suffers from three systemic problems:

1. **Flat hierarchy with no depth.** Every feature lives at the top level of the sidebar. There are no sub-pages, no progressive disclosure, and no set detail page. Users bounce between six flat surfaces with no way to drill into content.

2. **Home page is a liability, not an asset.** The `/` route is 90% mock data that actively damages trust. It occupies the most prominent position in navigation (first item, default landing) while delivering the least value of any page in the app.

3. **The vault lacks the organizational tools its users need most.** Sorting, advanced filtering, status management, and sort controls are either missing entirely or hidden on mobile. The "$0" value display dominates the visual hierarchy of a page where piece counts and set counts are the only accurate data.

The recommendations below reorganize navigation into a clear primary/secondary hierarchy, replace the home page with a functional dashboard, restructure the vault toolbar for mobile parity, introduce a set detail page as the missing content hub, and establish a consistent labeling vocabulary across the app.

**Priority summary:** 3 Critical, 5 High, 8 Medium, 4 Low recommendations.

---

## 2. Current Navigation Audit

### 2.1 Desktop Sidebar Structure

**File:** `/components/shared/sidebar.tsx` (lines 21-81)
**Nav items defined in:** `/lib/constants.ts` (lines 5-12)

```
LegoFlex logo + wordmark
---
Home         (/)           icon: Home
Explore      (/explore)    icon: Compass
Leaderboard  (/leaderboard) icon: Trophy
Vault        (/vault)      icon: Lock
Profile      (/profile)    icon: User
Settings     (/settings)   icon: Settings
---
@username / Collector (footer)
```

**Findings:**

| # | Finding | Severity | File:Line |
|---|---------|----------|-----------|
| NAV-01 | All 6 items have equal visual weight. No grouping, no dividers, no primary/secondary distinction. Explore and Vault (daily-use pages) sit alongside Settings (rare-use). | High | `/lib/constants.ts:5-12` |
| NAV-02 | The LegoFlex logo in the sidebar header is not a clickable link. Standard web convention is that the logo navigates to the home page. | Medium | `/components/shared/sidebar.tsx:27-30` |
| NAV-03 | The sidebar footer shows `@username / Collector` but is not a link to `/profile`. The user's own avatar and name appear as static text, missing an obvious navigation shortcut. | Medium | `/components/shared/sidebar.tsx:58-78` |
| NAV-04 | Active state detection uses `pathname.startsWith(item.href)` (line 38-39). This works for most routes but causes the Home item (`/`) to match only on exact equality, while other items match on prefix. The logic is correct but means `/u/[userId]` matches no sidebar item, leaving the user with no navigation context on public profile pages. | Low | `/components/shared/sidebar.tsx:36-39` |
| NAV-05 | The Vault icon is `Lock` (lucide). A lock icon suggests security/privacy, not a collection vault. The term "Vault" combined with a lock icon may confuse new users who expect a collection/inventory metaphor. | Low | `/components/shared/nav-icon-map.ts:8` |
| NAV-06 | No badge/counter on any nav item. Vault could show set count, Leaderboard could show rank. This is a missed opportunity for at-a-glance information scent. | Medium | `/components/shared/sidebar.tsx:33-55` |

### 2.2 Mobile Header + Drawer

**File:** `/components/shared/mobile-header.tsx` (lines 27-117)

The mobile header replicates the sidebar exactly in a sheet drawer. Same 6 items, same order, same footer.

**Findings:**

| # | Finding | Severity | File:Line |
|---|---------|----------|-----------|
| NAV-07 | Mobile drawer has no search affordance. On desktop, the home page right sidebar has a (non-functional) search bar. On mobile, there is zero search access from the navigation layer. | High | `/components/shared/mobile-header.tsx:66-89` |
| NAV-08 | No breadcrumb or page title visible in the mobile header after navigating. The header always shows "LegoFlex" + hamburger. The user has no persistent indicator of which page they are on beyond the drawer's active state. | Medium | `/components/shared/mobile-header.tsx:38-43` |
| NAV-09 | The mobile drawer opens from the left (SheetContent `side="left"`), matching the desktop sidebar position. This is correct. No issues with directional consistency. | -- | -- |

### 2.3 Page Hierarchy -- Current State

```
/ (Home)                          -- 90% mock data
/explore                          -- Functional, flat grid
/leaderboard                      -- Functional, flat list
/vault                            -- Functional, tabbed (collection/wishlist)
/profile                          -- Functional, own profile
/settings                         -- Hub page
  /settings/profile               -- Edit profile form
/u/[userId]                       -- Public profile (not in sidebar)
  /u/[userId]/vault               -- Public vault (not in sidebar)
/auth/*                           -- Login/signup/onboarding (no sidebar)
```

**Key observations:**

- **Depth = 1 everywhere.** The only two-level route is `/settings/profile`. Every other page is a single flat view.
- **No set detail page exists.** This is the most critical structural gap. Every set card in Explore, Vault, Leaderboard mentions, and profile favorites is a dead end. There is no `/set/[setNum]` route.
- **No followers/following list.** Profile shows follower/following/friends counts but they are not clickable. There is no `/u/[userId]/followers` or `/u/[userId]/following` route.
- **Public profiles are structurally isolated.** The `/u/[userId]` routes exist but are unreachable from the primary navigation. The only path to them is through suggested collectors on the home page right sidebar (and those usernames are not even links -- see Phase 1 user research friction point #12).

---

## 3. Information Density Audit Per Page

### 3.1 Home Page (`/`)

**File:** `/app/(app)/page.tsx`

| Zone | Content | Data Source | Functional | Density Assessment |
|------|---------|------------|------------|-------------------|
| Stories carousel | 7 story bubbles | `mockStories` from `lib/mockdata.ts` | No (not clickable) | Overwelming -- presents fake social signals |
| Feed posts | 2 detailed post cards | `mockFeedPosts` from `lib/mockdata.ts` | No (all buttons non-functional) | Overwhelming -- detailed fake content with interaction affordances that do nothing |
| Right sidebar: search | Search input | None | No (no handler) | Underwhelming -- empty affordance |
| Right sidebar: trending sets | 3 trending items | `mockTrendingSets` from `lib/mockdata.ts` | No (links to `#`) | Overwhelming -- fake data presented as real |
| Right sidebar: suggested collectors | 5 user cards with follow buttons | Real data from `lib/queries/social.ts` | Yes (follow/unfollow works) | Appropriate -- but usernames are not links |
| Right sidebar: footer links | 7 links + copyright | Hardcoded | No (all `href="#"`) | Underwhelming -- dead links |

**Verdict: This page has the worst information-to-noise ratio in the app.** Real data (suggested collectors) occupies ~15% of the content area. The other 85% is mock data or non-functional UI. A new user sees a thriving community that does not exist, tries to interact with it, discovers nothing works, and loses trust before ever reaching the useful pages.

### 3.2 Explore Page (`/explore`)

**File:** `/app/(app)/explore/page.tsx`, `/components/explore/explore-header.tsx`

| Zone | Content | Functional | Density Assessment |
|------|---------|------------|-------------------|
| Search bar | Full-width text input | Yes (accent-insensitive) | Appropriate |
| Theme filter button | Opens modal with all themes | Yes (max 10) | Appropriate |
| Theme quick chips | Scrollable tag row | Yes (toggle) | Appropriate, but no feedback at max limit |
| Sort selector | Dropdown: Recent/Oldest/Popular | Yes | Appropriate |
| Discovery grid | Responsive card grid | Yes (add/remove from vault) | Appropriate density |
| Individual cards | Image, year badge, theme badge, name, set#, piece count, vault actions | Yes | **Slightly overwhelmed on mobile** -- 6 data points + 2 action buttons on a small card |
| Load More | Pagination button | Yes | Appropriate |

**Verdict: The best-designed page in the app.** Information density is well-calibrated for discovery browsing. Two areas for improvement:

1. **Cards are not clickable** -- the card body has hover effects (`cursor-pointer` implied by `group-hover`) but no navigation. This is the single most impactful information architecture gap.
2. **No empty state** when search + filter returns zero results -- the grid just renders empty.

### 3.3 Vault Page (`/vault`)

**File:** `/app/(app)/vault/vault-client.tsx`, associated components

| Zone | Content | Functional | Density Assessment |
|------|---------|------------|-------------------|
| Toolbar: search | Text input | Yes (client-side filter) | **Underwhelming on mobile** -- theme filter and view toggle hidden on mobile (`hidden sm:flex` at line 52 and 72 of vault-toolbar.tsx) |
| Stats hero | 3 stats: Market Value / Total Pieces / Unique Sets (collection) or Estimated Cost / Target Bricks / Saved Sets (wishlist) | Partially -- value stats are "$0" | **Overwhelmingly misleading** -- the primary stat (market value) is always "$0", displayed in large primary-colored text |
| Collection/Wishlist tabs | Pill toggle with sliding indicator | Yes | Appropriate -- clear binary state |
| Grid view | Card grid with checkbox, favorite heart, image, name, year, pieces, price | Yes | **Slightly dense** -- checkbox + heart + status badge + year + price on each card is a lot of metadata |
| List view | Table with 9 columns | Yes (desktop only) | **Too dense** -- 9 columns including Value ($0) and Status (always empty) are wasted space |
| Bulk actions bar | Floating bar: count + Remove + Move to Collection | Yes | Appropriate when visible, but no "Select All" |
| Load More | Pagination button | Yes | Appropriate |

**Verdict: Functional but poorly calibrated.** The most-used organizational tools (theme filter, view toggle) disappear on mobile. The most prominent visual element (market value) is the most broken data point. The list view shows 9 columns where 3 of them (Value, Status, Image) provide no useful information. See Section 4 for the full deep dive.

### 3.4 Profile Page (`/profile`)

**File:** `/app/(app)/profile/page.tsx`

| Zone | Content | Functional | Density Assessment |
|------|---------|------------|-------------------|
| Hero: avatar + username + role badge | Large avatar with glow, verified badge (always false), role/rank | Partially -- `isOnline` always true, `isVerified` always false | **Misleading** -- green "online" dot is always on |
| Hero: social stats | Followers / Following / Friends counts | Display only (not clickable) | **Underwhelming** -- counts are visible but not interactive. Users expect to tap these to see lists. |
| Favorites grid | 4-column grid of favorite set images | Display only (Edit Selection button non-functional) | Appropriate density when populated; good empty state |
| Bio section | Bio text + interest tags (always empty) | Display only | **Underwhelming** -- interest tags never appear because `interests: []` is hardcoded |
| Rank progress card | Visual progress bar with tier info | Display only | Appropriate |
| Stats row | Vault Value ("Coming Soon"), Total Parts, Global Rank | Display only | **Underwhelming** -- 1 of 3 cards shows "Coming Soon" |
| Milestone vault | Badge grid + "Add milestone" button (non-functional) | Partially | Appropriate when milestones exist; "Add" button is misleading |
| Profile footer | UUID display + 3 dead links | No (all `href="#"`) | **Underwhelming** -- branded fluff |

**Verdict: Information-rich but interaction-poor.** The profile displays a lot of data but provides almost no actions. There is no "Edit Profile" button, no "View Vault" button, no clickable social stats, no link to settings. The user can look but not act. This is the opposite problem from the home page -- here the data is real but the agency is absent.

### 3.5 Leaderboard Page (`/leaderboard`)

**File:** `/app/(app)/leaderboard/leaderboard-client.tsx`

| Zone | Content | Functional | Density Assessment |
|------|---------|------------|-------------------|
| Header | Total users count | Display only | Appropriate |
| Current user card | Position indicator when user is below visible list | Display only | Appropriate |
| Leaderboard table | Rank + avatar + username + rank badge + sets + pieces + brick score per row | Yes (rows link to `/u/[userId]`) | Appropriate |
| Load More | Pagination | Yes | Appropriate |

**Verdict: The most focused page in the app.** Single purpose, appropriate density, and notably the leaderboard rows ARE clickable links to public profiles (line 33 of `leaderboard-table.tsx`) -- making this the only reliable path to discover other users. However, there are no filter/sort controls (no time range, no theme, no friend-only view).

### 3.6 Settings Page (`/settings`)

**File:** `/app/(app)/settings/settings-client.tsx`

| Zone | Content | Functional | Density Assessment |
|------|---------|------------|-------------------|
| Account section | Edit Profile link, Password Reset dialog | Yes | Appropriate |
| Collection section | Profile Visibility toggle, Default Grid View dialog | Partially -- visibility not enforced, grid view not applied | **Misleading** -- 2 of 2 settings do not actually work |
| Appearance section | Theme selector dialog | Yes | Appropriate |
| System section | Email Notifications toggle | No (no backend) | **Misleading** -- toggle exists for non-existent feature |
| Sign Out | Button | Yes | Appropriate |

**Verdict: Compact and well-organized, but 3 of 5 settings are broken or misleading.** The settings page itself is correctly structured as a hub with sections. The problem is downstream -- the settings it exposes are not enforced by the rest of the app.

---

## 4. Vault Deep Dive

### 4.1 Filtering Capabilities

| Filter | Location | Functional | Mobile | Notes |
|--------|----------|------------|--------|-------|
| Text search | Toolbar | Yes (client-side) | Yes | Filters by name, set_num, and theme name using accent-insensitive normalization. However, only searches within already-loaded sets -- if 200 sets exist and only 50 are loaded, the other 150 are invisible to search. |
| Theme filter | Toolbar dropdown | Yes | **No** (`hidden sm:flex` at `/components/vault/vault-toolbar.tsx:52`) | Filters by exact theme name match against loaded sets |
| Collection/Wishlist tab | Floating pill toggle | Yes | Yes | Binary filter between collection types |

**Missing filters (identified across Phase 1 reports):**

- **Year range** -- no way to filter by release year
- **Piece count range** -- no way to filter by set size
- **Status** -- no filter by built/in-box/missing-parts/for-sale (and no way to set status either)
- **Favorite** -- no way to filter to show only favorites
- **Sort control** -- vault has NO user-facing sort. Items are sorted favorites-first, then server order (year descending). Compare to Explore which has 3 sort options.

### 4.2 Sorting Capabilities

**Current sort logic** (from `/app/(app)/vault/vault-client.tsx:135-139`):

```typescript
.sort((a, b) => {
  if (a.isFavorite && !b.isFavorite) return -1;
  if (!a.isFavorite && b.isFavorite) return 1;
  return 0;
});
```

This is a stable sort that only prioritizes favorites. Beyond that, sets appear in whatever order the server returns them (set by the query's `.order("created_at", { ascending: false })` from `lib/queries/vault.ts`).

**Missing sort options:**
- Name (A-Z / Z-A)
- Year (newest/oldest)
- Piece count (most/least)
- Date added (newest/oldest -- currently the only implicit sort but not user-selectable)
- Theme (alphabetical grouping)

### 4.3 Grouping and Labeling

**Current grouping:** None. Sets are displayed as a flat list/grid with no section headers, no theme grouping, no year grouping.

**Tab labeling:**
- "Collection" (icon: Package) -- clear
- "Wishlist" (icon: Heart) -- clear

**Stats labeling:**
- Collection tab: "Total Market Value" / "Total Pieces" / "Unique Sets"
- Wishlist tab: "Estimated Cost" / "Target Bricks" / "Saved Sets"

**Labeling issues:**
| Issue | Severity | Location |
|-------|----------|----------|
| "Total Market Value" displays "$0" -- misleading label for non-existent data | Critical | `/components/vault/vault-stats-hero.tsx:18` |
| "Estimated Cost" displays "$0" -- same problem for wishlist | Critical | `/components/vault/vault-stats-hero.tsx:34` |
| "Target Bricks" is an unusual term. "Total Pieces" (used for collection) would be more consistent. | Low | `/components/vault/vault-stats-hero.tsx:38` |
| "Unique Sets" for collection vs "Saved Sets" for wishlist -- inconsistent terminology for the same concept (count of sets). | Low | `/components/vault/vault-stats-hero.tsx:22,42` |
| Card price displays "$0" in the bottom-right of every card -- occupies prime visual real estate with useless data | High | `/components/vault/vault-card.tsx:94` |
| List view "Value" column is always "$0" but styled in primary color (`text-primary`) drawing the eye to the most broken data point | High | `/components/vault/vault-list.tsx:77-79` |

### 4.4 Toolbar and Bulk Actions Clarity

**Toolbar** (`/components/vault/vault-toolbar.tsx`):

The toolbar is a sticky bar at the top with three zones: search (left), theme filter (center, desktop only), view toggle (right, desktop only).

| Issue | Severity | Location |
|-------|----------|----------|
| Theme filter is `hidden sm:flex` -- invisible on mobile | High | `/components/vault/vault-toolbar.tsx:52` |
| View toggle is `hidden sm:flex` -- invisible on mobile. Toggle is visible but switching to "list" on mobile does nothing (grid always shows on mobile). | High | `/components/vault/vault-toolbar.tsx:72` |
| No sort control anywhere in the toolbar | High | `/app/(app)/vault/vault-client.tsx:135-139` |
| Search placeholder says "Search sets..." -- vague. Could say "Search by name, theme, or set #..." | Low | `/components/vault/vault-toolbar.tsx:46` |

**Bulk Actions** (`/components/vault/vault-bulk-actions.tsx`):

The floating bottom bar appears when sets are selected. It shows:
- Item count: "X Item(s) Selected"
- Move to Collection button (wishlist tab only)
- Remove button (both tabs)

| Issue | Severity | Location |
|-------|----------|----------|
| No "Select All" / "Deselect All" action | Medium | `/app/(app)/vault/vault-client.tsx` (no select-all logic exists) |
| No confirmation dialog before bulk Remove | High | `/components/vault/vault-bulk-actions.tsx:52-65` (immediate execution) |
| No "Move to Wishlist" action on collection tab -- only wishlist has "Move to Collection" | Medium | `/components/vault/vault-bulk-actions.tsx:35-49` |
| `selectedSetNums` prop is received but never used (ESLint error confirmed in QA report) | Low | `/components/vault/vault-bulk-actions.tsx:10,19` |

### 4.5 Vault Summary: Before State

```
VAULT PAGE (current)
=====================
[Toolbar: Search __|__ Theme (desktop) | View (desktop)]
[Stats Hero: $0 value | pieces | sets]
[       Collection  |  Wishlist       ]
[Card][Card][Card][Card]
[Card][Card][Card][Card]
[        Load More         ]
[==== Bulk Actions (if selected) ====]

Problems:
- No sort control
- Theme/view hidden on mobile
- $0 dominates visual hierarchy
- No empty state guidance
- Cards are dead ends (no detail page)
- No status management
- No select all
- No confirmation on destructive bulk action
```

---

## 5. Proposed Information Architecture

### 5.1 Navigation Hierarchy Redesign

**Principle:** Group nav items by usage frequency. Primary actions (daily use) get prominent placement. Secondary actions (weekly/rare use) get deprioritized.

#### Before:
```
Sidebar (6 items, flat):
  Home | Explore | Leaderboard | Vault | Profile | Settings
```

#### After:
```
Sidebar (reorganized with grouping):

  [Logo - clickable, links to /]

  -- PRIMARY (daily use) --
  Dashboard       (/)           icon: LayoutDashboard
  Explore         (/explore)    icon: Compass
  My Vault        (/vault)      icon: Package

  -- SOCIAL --
  Leaderboard     (/leaderboard) icon: Trophy

  -- ACCOUNT (footer area) --
  [@username avatar - clickable, links to /profile]
  [Settings gear icon]
```

**Rationale:**
- "Home" renamed to "Dashboard" to reflect the PM roadmap recommendation to replace the feed with a dashboard (PM P0-2). The word "Home" suggests a landing page; "Dashboard" suggests an at-a-glance overview.
- "Vault" renamed to "My Vault" to reinforce ownership language. When viewing another user's vault at `/u/[userId]/vault`, the distinction matters.
- Icon for Vault changed from `Lock` to `Package` (already used in the collection tab). A package better represents a collection of items.
- Profile moved from the nav list to the sidebar footer. The user's avatar and username in the footer become a clickable link to `/profile`. This mirrors Slack, Discord, and Twitter's pattern of placing profile access in the account area, not the main nav.
- Settings becomes a gear icon next to the profile avatar in the footer, or accessible from the profile page. It does not need a dedicated nav slot.
- Leaderboard gets its own section label ("SOCIAL") to indicate it is a community feature, not a personal tool.

**Priority:** High
**Files affected:** `/lib/constants.ts`, `/components/shared/sidebar.tsx`, `/components/shared/mobile-header.tsx`, `/components/shared/nav-icon-map.ts`

#### Mobile Header Improvements:
```
[Page Title]           [Search icon] [Hamburger]
```

- Add a page title to the mobile header that reflects the current route
- Add a search icon that opens a search overlay (global search)
- Hamburger opens the same reorganized nav

**Priority:** High
**Files affected:** `/components/shared/mobile-header.tsx`, `/components/shared/mobile-header-wrapper.tsx`

### 5.2 Content Organization -- Key Pages

#### 5.2.1 Dashboard (replacing Home)

**Priority:** Critical

**Before:** Instagram-style feed with mock stories, mock posts, non-functional search, mock trending sets, real suggested collectors.

**After:**

```
DASHBOARD (/)
=============
[Welcome, @username]                    [Global Search Bar]

[Quick Stats Row]
  Sets: 42 | Pieces: 12,450 | Rank: #17 | Score: 2,890

[Recently Added]  ---- [View Vault ->]
  [Card] [Card] [Card] [Card] [Card]    (horizontal scroll, last 5 adds)

[Suggested Sets]  ---- [Explore ->]
  [Card] [Card] [Card] [Card]           (from favorite themes, not in vault)

[Following Activity]  ---- [Leaderboard ->]
  - @user1 added "Millennium Falcon" to their vault - 2h ago
  - @user2 reached 10k bricks milestone - 5h ago
  - @user3 started following you - 1d ago
  (derived from user_sets.created_at + follows.created_at, no new tables)

[Suggested Collectors]
  [user + follow btn] [user + follow btn] ...
  (existing real data from lib/queries/social.ts, with usernames as links)
```

This aligns with PM roadmap recommendation (P0-2) and user research recommendation #1. No mock data. Every element is either derived from real data or links to a functional page.

**Files to create/modify:** `app/(app)/page.tsx` (rewrite), `lib/queries/home.ts` (implement real queries), `components/home/` (replace all mock components with dashboard components), delete `lib/mockdata.ts`.

#### 5.2.2 Explore

**Priority:** Medium (already the best page -- incremental improvements only)

**Before:** Functional grid with search, theme filter, sort. Cards are not clickable.

**After:**
```
EXPLORE (/explore)
==================
[Search bar: "Search by set name, theme, or #ID..."]
[Theme Button] | [Quick Chips...] | [Sort: Recent / Popular / Oldest]

[Card][Card][Card][Card]     <-- cards are now clickable, navigate to /set/[setNum]
[Card][Card][Card][Card]
[        Load More         ]

Empty state: "No sets match your search. Try a different term or clear your filters."
```

Changes:
- Make cards clickable with navigation to `/set/[setNum]` (new page)
- Add empty state for zero-result searches
- Cards retain all existing vault action buttons (add to collection/wishlist) as overlays that stop propagation

**Priority for card click:** Critical (ties to set detail page)
**Files affected:** `/components/explore/discovery-card.tsx` (wrap in Link or add onClick navigation), new `/app/(app)/set/[setNum]/page.tsx`

#### 5.2.3 Vault (Redesigned)

**Priority:** High

**After:**
```
MY VAULT (/vault)
=================
[Toolbar: Search "Search by name, theme, or set #..." | Sort: [dropdown] | Theme: [dropdown] | View: [grid|list]]
  -- ALL controls visible on all breakpoints (mobile uses compact icons or a filter sheet)

[Stats Hero]
  Total Pieces: 12,450 | Unique Sets: 42
  -- Price/value stats REMOVED until real data is available

[       Collection (42)  |  Wishlist (8)       ]

[Card][Card][Card][Card]     <-- cards clickable to /set/[setNum]
[Card][Card][Card][Card]
[        Load More         ]

[==== Bulk Actions: Select All | Move | Remove (with confirmation) ====]

Empty state (vault empty):
  "Your collection is empty. [Browse Sets ->] to start adding."

Empty state (no filter match):
  "No sets match your search. Try adjusting your filters."
```

Specific changes:

1. **Add sort control to toolbar** -- Name, Year, Pieces, Date Added, Favorites First
2. **Make theme filter and view toggle visible on mobile** -- use a filter icon that opens a bottom sheet on mobile
3. **Remove $0 price data** -- hide "Total Market Value" / "Estimated Cost" from stats hero AND from individual cards until price data exists. Replace with accurate stats only (pieces, sets).
4. **Make cards clickable** -- navigate to `/set/[setNum]`
5. **Add "Select All" to bulk actions**
6. **Add confirmation dialog to bulk Remove**
7. **Add "Move to Wishlist" on collection tab** (currently only "Move to Collection" exists on wishlist tab)
8. **Add vault-empty CTA** linking to Explore
9. **Persist view mode** -- respect the `default_grid_view` setting from user preferences (currently ignored, see QA MIN-15 and user research friction #38)

**Files affected:** `/components/vault/vault-toolbar.tsx`, `/components/vault/vault-stats-hero.tsx`, `/components/vault/vault-card.tsx`, `/components/vault/vault-list.tsx`, `/components/vault/vault-bulk-actions.tsx`, `/app/(app)/vault/vault-client.tsx`, `/lib/queries/vault.ts`

#### 5.2.4 Profile

**Priority:** Medium

**Before:** Display-only profile with non-functional buttons and no navigation to related pages.

**After:**
```
PROFILE (/profile)
==================
[Stud pattern background]

[Avatar + Username + Rank Badge]
[Edit Profile button ->]

[Followers: 23 ->] [Following: 15 ->] [Friends: 8 ->]
  -- counts are clickable, navigate to /profile/followers, /profile/following

[Favorites Grid (max 4)]
  -- "Edit Selection" removed until implemented
  -- favorite set images are clickable to /set/[setNum]

[Bio + Interest Tags]
  -- interests populated from user_themes

[Rank Progress Card]
[Stats: Total Parts | Global Rank]
  -- "Vault Value" card removed until price data exists
  -- replace with "Total Sets" card

[View My Vault ->]    [Share Profile]

[Milestone Vault]
  -- "Add milestone" button removed until implemented
```

Changes:
1. **Add "Edit Profile" button** to profile hero area
2. **Make social stats clickable** -- link to followers/following list pages
3. **Remove non-functional buttons** ("Edit Selection", "Add milestone")
4. **Make favorite set images clickable** -- navigate to `/set/[setNum]`
5. **Populate interests from `user_themes`** instead of hardcoded empty array
6. **Replace "Vault Value: Coming Soon"** with "Total Sets" (real data)
7. **Add "View My Vault" button** and "Share Profile" button
8. **Remove hardcoded `isOnline: true`** and `isVerified: false` indicators

**Files affected:** `/components/profile/profile-hero.tsx`, `/components/profile/favorites-grid.tsx`, `/components/profile/profile-bio.tsx`, `/components/profile/profile-stats-row.tsx`, `/components/profile/milestone-vault.tsx`, `/lib/queries/profile.ts`

#### 5.2.5 Set Detail Page (NEW)

**Priority:** Critical

This is the single most important missing page in the app. Every set card across every page should link here.

```
SET DETAIL (/set/[setNum])
===========================
[Back to Explore / Back to Vault]

[Large Set Image]                    [Set Info Panel]
                                       Name: Millennium Falcon
                                       Set #: 75192-1
                                       Theme: Star Wars > Ultimate Collector Series
                                       Year: 2017
                                       Pieces: 7,541
                                       Owners on LegoFlex: 23

                                     [Add to Collection] [Add to Wishlist]
                                     -- or --
                                     [In Your Collection (checkmark)] [Remove]

[Related Sets from Same Theme]
  [Card] [Card] [Card] [Card]        (horizontal scroll)
```

**Files to create:**
- `/app/(app)/set/[setNum]/page.tsx`
- `/app/(app)/set/[setNum]/actions.ts`
- `/lib/queries/set-detail.ts`
- `/components/set-detail/set-detail-hero.tsx`
- `/components/set-detail/set-detail-actions.tsx`
- `/components/set-detail/related-sets.tsx`
- `/components/set-detail/index.ts`
- `/types/set-detail.ts`

### 5.3 Search and Filter Taxonomy

#### 5.3.1 Global Search (NEW)

**Priority:** High

Currently there is no working global search. The home page search bar is non-functional. The explore search only covers set names/IDs.

**Proposal:** Add a global search accessible from the sidebar header (desktop) and mobile header (search icon).

```
Global Search
=============
Input: "Search sets, themes, users..."

Results grouped by type:
  SETS (3 results)
    [set card] [set card] [set card]    -> link to /set/[setNum]

  USERS (2 results)
    [avatar + username + rank]          -> link to /u/[userId]

  THEMES (1 result)
    [theme name + set count]            -> link to /explore?theme=[themeId]
```

**Implementation:** A search overlay or page at `/search?q=...` that queries `lego_sets` (by name, set_num) and `profiles` (by username) and `themes` (by name). The existing `search_sets` RPC function handles set search with accent-insensitive matching.

**Files to create:** `/app/(app)/search/page.tsx`, `/lib/queries/search.ts`, `/components/search/*`

#### 5.3.2 Filter Taxonomy (Vault)

Standardize the vault filter controls into a consistent pattern:

| Filter | Type | Options | Mobile Access |
|--------|------|---------|--------------|
| Text search | Free text input | -- | Always visible |
| Theme | Single-select dropdown | "All Themes" + user's themes | Filter sheet |
| Sort | Single-select dropdown | Date Added (default), Name A-Z, Name Z-A, Year Newest, Year Oldest, Most Pieces, Fewest Pieces | Filter sheet |
| Status | Single-select dropdown (future) | All, Built, In Box, Missing Parts, For Sale | Filter sheet (when status feature implemented) |
| Favorites only | Toggle | On/Off | Filter sheet |

**Mobile filter sheet:** Replace `hidden sm:flex` filters with a filter icon button on mobile that opens a bottom sheet containing all filter controls. This ensures mobile/desktop parity.

**Priority:** High
**Files affected:** `/components/vault/vault-toolbar.tsx` (add sort, mobile filter sheet), `/app/(app)/vault/vault-client.tsx` (add sort state and logic)

#### 5.3.3 Filter Taxonomy (Explore)

The explore page filters are well-designed. Minor additions:

| Filter | Current State | Proposed Addition |
|--------|--------------|-------------------|
| Text search | Working | No change |
| Theme | Working (multi-select, max 10) | No change |
| Sort | Working (3 options) | Add "Most Pieces" / "Fewest Pieces" |
| Year range | Missing | Add year range picker (min year / max year) |
| Piece count range | Missing | Add piece count range (future, lower priority) |

**Priority for year range:** Medium
**Priority for piece count range:** Low

### 5.4 Labeling and Terminology Consistency

#### 5.4.1 Current Inconsistencies

| Term | Used In | Alternative Used | Recommendation |
|------|---------|-----------------|----------------|
| "Collection" | Vault tabs, bulk actions | "Shelf" (vault stats hero header) | Standardize to **"Collection"** everywhere. Remove "Shelf" from `vault-stats-hero.tsx:57`. |
| "Vault" | Sidebar, page title | "Collection" (tab label) | Vault = the container. Collection = one tab within it. Keep both but clarify: "My Vault" in nav, "Collection" and "Wishlist" as the two sub-categories within the vault. |
| "Unique Sets" | Collection stats | "Saved Sets" (wishlist stats) | Standardize to **"Sets"** with the count. The qualifier is unnecessary. |
| "Total Pieces" | Collection stats | "Target Bricks" (wishlist stats) | Standardize to **"Pieces"** for both. "Target Bricks" is confusing -- a wishlist is aspirational, but "target" implies a goal. |
| "Brick Score" | Leaderboard, profile | -- | Keep as-is. Unique branding term for the gamification metric. |
| "Identity Bio" | Profile bio section header | -- | Change to simply **"About"** or **"Bio"**. "Identity Bio" sounds like a government form. |
| "Digital Identity UUID: 75192-LF-2024" | Profile footer | -- | Remove. This is meaningless branded noise that occupies space without informing. |
| "Vault Guide" / "Privacy Protocol" / "Support" | Profile footer links | "About" / "Help" / "Privacy" / "Terms" (right sidebar footer) | Standardize footer links across the app. If no real pages exist, remove footer links entirely rather than having dead `href="#"` links. |
| "Collector" | Sidebar footer, role badge | -- | Keep as default role label. Clear and on-brand. |
| "Post Build" | Referenced in architecture docs as sidebar CTA | -- | Remove references. No post creation feature exists or is planned for v1. |

**Priority:** Medium
**Files affected:** `/components/vault/vault-stats-hero.tsx`, `/components/profile/profile-bio.tsx`, `/components/profile/profile-footer.tsx`, `/components/home/right-sidebar.tsx`, `/components/shared/footer.tsx`

#### 5.4.2 Recommended Vocabulary

| Concept | Standard Term | Avoid |
|---------|--------------|-------|
| The container for all user sets | Vault | Collection (when referring to the whole thing) |
| Sets the user owns | Collection | Shelf, Owned Sets |
| Sets the user wants | Wishlist | Want List, Saved Sets |
| The gamification score | Brick Score | Points, Score |
| Rank tiers | Rank | Level, Tier |
| Theme preferences | Favorite Themes | Theme Preferences, Interests |
| Other user's page | Profile | Public Profile (internally OK, not user-facing) |
| User's own page | My Profile | Profile (when disambiguation needed) |
| Adding a set to vault | "Add to Collection" / "Add to Wishlist" | "Save", "Collect" |
| Removing a set | "Remove" | "Delete" (sets are not deleted, just removed from vault) |

---

## 6. Ideal Sitemap

### 6.1 Proposed Page Structure

```
/                                    Dashboard (personal overview)
/explore                             Set discovery catalog
/explore?theme=123&sort=popular      Filtered explore (query params)
/set/[setNum]                        Set detail page (NEW)
/vault                               User's vault (collection + wishlist)
/vault?tab=wishlist                  Vault with tab selection (query params)
/leaderboard                         Global leaderboard
/search?q=...                        Global search results (NEW)
/profile                             Own profile
/profile/followers                   Own followers list (NEW)
/profile/following                   Own following list (NEW)
/settings                            Settings hub
/settings/profile                    Edit profile form
/u/[userId]                          Public profile
/u/[userId]/vault                    Public vault (read-only)
/u/[userId]/followers                Public followers list (NEW)
/u/[userId]/following                Public following list (NEW)
/auth/login                          Login
/auth/sign-up                        Registration
/auth/sign-up-success                Email confirmation prompt
/auth/onboarding                     Profile setup
/auth/forgot-password                Password reset request
/auth/update-password                Password reset form
/auth/confirm                        Email token exchange (route handler)
/auth/error                          Auth error display
```

### 6.2 Sitemap Diagram

```
LegoFlex
|
|-- / (Dashboard)
|     |-- Quick Stats (sets, pieces, rank, score)
|     |-- Recently Added (links to /set/[setNum])
|     |-- Suggested Sets (links to /set/[setNum], /explore)
|     |-- Following Activity (links to /u/[userId], /set/[setNum])
|     |-- Suggested Collectors (links to /u/[userId])
|
|-- /explore (Discovery)
|     |-- Search, Theme filter, Sort
|     |-- Discovery cards (links to /set/[setNum])
|     |-- Vault actions on cards (add/remove inline)
|
|-- /set/[setNum] (Set Detail) [NEW]
|     |-- Set metadata, image, vault actions
|     |-- Owner count
|     |-- Related sets (links to other /set/[setNum])
|
|-- /vault (My Vault)
|     |-- Toolbar: Search, Sort, Theme filter, View toggle
|     |-- Stats: Pieces, Sets
|     |-- Collection tab / Wishlist tab
|     |-- Set cards (links to /set/[setNum])
|     |-- Bulk actions
|
|-- /leaderboard (Leaderboard)
|     |-- Ranking table (links to /u/[userId])
|
|-- /search?q= (Global Search) [NEW]
|     |-- Sets results (links to /set/[setNum])
|     |-- Users results (links to /u/[userId])
|     |-- Themes results (links to /explore?theme=)
|
|-- /profile (My Profile)
|     |-- Hero, social stats
|     |-- Favorites (links to /set/[setNum])
|     |-- Bio, rank, milestones
|     |-- Links to /vault, /settings/profile
|     |-- /profile/followers [NEW]
|     |-- /profile/following [NEW]
|
|-- /settings (Settings Hub)
|     |-- /settings/profile (Edit Profile)
|
|-- /u/[userId] (Public Profile)
|     |-- Same layout as own profile, read-only
|     |-- Follow/Unfollow action
|     |-- /u/[userId]/vault (Public Vault)
|     |-- /u/[userId]/followers [NEW]
|     |-- /u/[userId]/following [NEW]
|
|-- /auth/* (Authentication, no sidebar)
      |-- /auth/login
      |-- /auth/sign-up
      |-- /auth/sign-up-success
      |-- /auth/onboarding
      |-- /auth/forgot-password
      |-- /auth/update-password
      |-- /auth/confirm (route handler)
      |-- /auth/error
```

### 6.3 Navigation Paths Between Pages

The current app has many dead ends. The proposed architecture ensures every entity (set, user, theme) is a link to a detail view:

| From | To | Via |
|------|------|------|
| Dashboard | Set detail | Click recently added set or suggested set card |
| Dashboard | Vault | "View Vault" link |
| Dashboard | Explore | "Browse Sets" link |
| Dashboard | Public profile | Click following activity username or suggested collector |
| Dashboard | Leaderboard | "View Leaderboard" link |
| Explore | Set detail | Click any discovery card |
| Explore | Settings (edit themes) | "Add Favorite Themes" CTA (existing) |
| Set detail | Explore | Back navigation or "More from [Theme]" |
| Set detail | Vault | "In Your Collection" indicator |
| Vault | Set detail | Click any vault card |
| Vault | Explore | Empty state CTA "Browse Sets" |
| Profile | Vault | "View My Vault" button |
| Profile | Settings | "Edit Profile" button |
| Profile | Set detail | Click favorite set image |
| Profile | Followers list | Click followers count |
| Profile | Following list | Click following count |
| Leaderboard | Public profile | Click any leaderboard row (already works) |
| Public profile | Public vault | "View Vault" button (already works) |
| Public profile | Set detail | Click favorite set image |
| Settings | Profile | Back button or sidebar |
| Settings | Edit profile | "Edit Profile" link (already works) |

---

## 7. Dependencies & Conflicts

### 7.1 Dependencies on Other Phase 2 Outputs

| Recommendation | Depends On | Notes |
|---------------|------------|-------|
| Dashboard redesign | PM confirming feed removal (PM P0-2) | PM roadmap already recommends this. No conflict expected. |
| Set detail page | Database has sufficient set data in `lego_sets` table | `lego_sets` has name, year, theme_id, num_parts, img_url. Sufficient for v1. Price data is NOT required for the detail page. |
| Global search | `search_sets` RPC already exists; user search needs new query | No schema changes needed. `profiles` table is publicly readable (SELECT). |
| Remove $0 prices | Requires touching vault queries, vault card, vault list, vault stats hero | Coordinated change across 5+ files. Should be a single PR. |
| Mobile filter sheet | shadcn/ui `Sheet` or `Drawer` component | Already used for mobile nav. No new dependency. |
| Followers/following lists | No new tables needed -- `follows` table has all data | Needs new query in `lib/queries/social.ts` and new page components. |

### 7.2 Conflicts with Phase 1 Findings

| Topic | Phase 1 Position | IA Position | Resolution |
|-------|-----------------|-------------|------------|
| Home page replacement | PM says "kill the Instagram-style feed" and replace with dashboard. User research agrees. CTO has no objection. | **Agree.** The dashboard proposal in Section 5.2.1 aligns with all Phase 1 recommendations. | No conflict. |
| Set detail page | PM lists as P1-7 (high impact). User research lists as recommendation #2. QA lists as MAJ-04. | **Agree, but I elevate to Critical.** The set detail page is the single most impactful structural change for information architecture. Every card, every mention, every reference to a set should link somewhere. Without it, the IA has no depth. | Escalate from High to Critical. |
| $0 price removal | PM lists as P1-8. User research as recommendation #3. QA as MAJ-05. | **Agree.** I further recommend removing price display entirely (not replacing with "Coming Soon") because it occupies prime visual real estate in the vault where accurate data (pieces, sets) should dominate. | Aligned, with stronger position on complete removal vs "Coming Soon" label. |
| Profile social stats | User research friction #33 says counts are not clickable. | **Agree.** I propose followers/following list pages as new routes. | Aligned, with specific route proposals. |
| Vault mobile filters | QA MIN-09 says toolbar filters hidden on mobile. | **Agree.** I propose a mobile filter sheet as the solution. | Aligned, with specific implementation approach. |
| Global search | PM lists as P1-11. User research as cross-persona pain P-3. | **Agree.** I propose a dedicated `/search` route with multi-entity results. | Aligned, with specific architecture proposal. |
| Sidebar reorganization | Not explicitly addressed in Phase 1. | **New recommendation.** No Phase 1 agent proposed nav restructuring, but the flat 6-item sidebar is a contributing factor to the wayfinding problems they identified. | No conflict -- additive recommendation. |
| Terminology standardization | Not explicitly addressed in Phase 1. | **New recommendation.** "Shelf", "Target Bricks", "Identity Bio", "Digital Identity UUID" are inconsistencies discovered during IA audit. | No conflict -- additive recommendation. |
| Leaderboard filtering | User research friction #36 mentions "no filtering or time-range selection." | **Partially agree.** I list this as Low priority. For v1, the global leaderboard is sufficient. Theme-based or friend-based filtering is a v2 feature. | Lower priority than user research implies. |

### 7.3 Implementation Order

Based on dependencies and impact, the recommended implementation order is:

```
Phase A: Foundation (Critical)
  1. Create /set/[setNum] set detail page
  2. Replace Home with Dashboard
  3. Remove $0 price display from vault

Phase B: Navigation (High)
  4. Reorganize sidebar hierarchy
  5. Add mobile filter sheet to vault
  6. Add sort control to vault
  7. Add global search (/search)
  8. Make cards clickable across Explore and Vault

Phase C: Social Paths (Medium)
  9. Make profile social stats clickable
  10. Create followers/following list pages
  11. Add "Edit Profile" and "View Vault" buttons to profile
  12. Remove non-functional buttons (Edit Selection, Add Milestone)
  13. Populate interests from user_themes

Phase D: Polish (Low)
  14. Standardize terminology across app
  15. Add nav badges (set count on vault, rank on profile)
  16. Add empty states for all filter-no-results scenarios
  17. Add year range filter to explore
```

---

## 8. Phase 1 Cross-Reference

### 8.1 Agreements

| Phase 1 Finding | Agent | IA Agreement | IA Reference |
|----------------|-------|-------------|--------------|
| Home page is 90% mock data, must be replaced | PM (P0-2), User Research (#1), QA (CRIT-04) | **Strongly agree.** Dashboard proposal in 5.2.1. | Section 5.2.1 |
| No set detail page is a critical gap | PM (P1-7), User Research (#2), QA (MAJ-04) | **Strongly agree.** Elevated to Critical in IA. | Section 5.2.5 |
| $0 price display is harmful | PM (P1-8), User Research (#3), QA (MAJ-05) | **Strongly agree.** Recommend full removal, not "Coming Soon". | Section 5.2.3, item 3 |
| Users cannot discover other profiles | User Research (#4) | **Strongly agree.** Proposed global search + clickable social stats + username links. | Sections 5.3.1, 5.2.4 |
| Non-functional buttons erode trust | User Research (#5), QA (MAJ-01, MAJ-07, MAJ-16) | **Strongly agree.** Remove all non-functional buttons. | Section 5.2.4 |
| Vault toolbar hidden on mobile | QA (MIN-09), User Research (#21) | **Strongly agree.** Proposed mobile filter sheet. | Section 5.2.3 |
| Profile_visible not enforced | PM (P0-5), CTO (SEC-4), QA (CRIT-02) | **Agree.** Not an IA concern directly, but the profile visibility check must be implemented before the followers/following list pages are built. | Section 7.1 |
| Suggested collector usernames not linked | User Research (#12, #32) | **Agree.** All usernames in the app should link to `/u/[userId]`. | Section 5.2.1 |

### 8.2 Disagreements / Reframing

| Phase 1 Finding | Agent | IA Position |
|----------------|-------|-------------|
| PM categorized set detail page as P1 (High Impact) | PM | **Disagree on priority.** I categorize this as Critical (P0). Without a set detail page, the entire information architecture lacks depth. Every card is a dead end. This is not a "nice to have" -- it is the missing content hub that every page depends on. |
| User Research recommended activity feed "derived from existing tables" | User Research | **Partially disagree on scope.** For the dashboard, a simple "recently added" list from `user_sets.created_at` joined with `follows` is sufficient. A full activity feed with "started following", "hit milestone", etc. is a v2 feature. Keep the dashboard simple. |
| PM proposed "My Lego Collection Card" as the user acquisition hook | PM | **Agree it is valuable but it is not an IA concern.** The shareable card is a feature, not an architectural element. It should be an action button on the profile page ("Share My Card") but does not change the page structure. |
| CTO flagged Leaderboard as potentially needing pagination improvements | CTO (PERF-related) | **Agree on backend, but from an IA perspective, the leaderboard is the best-structured page in the app.** It has a clear single purpose, appropriate density, and rows already link to profiles. Adding filters (theme, friends-only) would improve it but is Low priority for v1. |

### 8.3 New Findings Not in Phase 1

| Finding | Description | Priority |
|---------|-------------|----------|
| NAV-01: Flat sidebar hierarchy | All 6 nav items have equal weight with no grouping | High |
| NAV-02: Logo not clickable | Standard web convention violated | Medium |
| NAV-03: Sidebar footer not linked to profile | Missed navigation shortcut | Medium |
| NAV-06: No nav badges | Missed information scent opportunity | Medium |
| NAV-07: No mobile search access | Critical missing mobile affordance | High |
| NAV-08: No mobile page title | User loses context of current page | Medium |
| Vault has no sort control | Users cannot sort vault by name, year, pieces, or date added | High |
| Vault has no "Select All" for bulk actions | Users with large collections must select individually | Medium |
| Vault has no "Move to Wishlist" action | Asymmetric: wishlist has "Move to Collection" but not vice versa | Medium |
| Terminology inconsistency: "Shelf" vs "Collection" | Stats hero says "Shelf", tabs say "Collection" | Medium |
| Terminology inconsistency: "Total Pieces" vs "Target Bricks" | Different labels for the same concept across tabs | Low |
| "Identity Bio" section header | Overly formal branding that reads as jargon | Low |
| "Digital Identity UUID" in profile footer | Meaningless decorative text consuming footer space | Low |

---

## Appendix: Complete Recommendation Index

| # | Recommendation | Priority | Section |
|---|---------------|----------|---------|
| R01 | Create `/set/[setNum]` set detail page | Critical | 5.2.5 |
| R02 | Replace Home with Dashboard | Critical | 5.2.1 |
| R03 | Remove $0 price display from vault entirely | Critical | 5.2.3 |
| R04 | Reorganize sidebar: primary/secondary grouping, profile in footer | High | 5.1 |
| R05 | Add sort control to vault toolbar | High | 4.2, 5.2.3 |
| R06 | Make theme filter and view toggle visible on mobile (filter sheet) | High | 4.4, 5.2.3 |
| R07 | Implement global search at `/search` | High | 5.3.1 |
| R08 | Make set cards clickable across Explore, Vault, Dashboard | High | 5.2.2, 5.2.3 |
| R09 | Make profile social stats clickable (followers/following lists) | Medium | 5.2.4 |
| R10 | Create followers/following list pages | Medium | 6.1 |
| R11 | Add "Edit Profile" and "View Vault" buttons to profile | Medium | 5.2.4 |
| R12 | Remove non-functional buttons (Edit Selection, Add Milestone, feed actions) | Medium | 5.2.4 |
| R13 | Populate profile interests from `user_themes` | Medium | 5.2.4 |
| R14 | Add mobile page title to header | Medium | 5.1 |
| R15 | Make sidebar logo clickable (link to /) | Medium | 5.1 |
| R16 | Add "Select All" to vault bulk actions | Medium | 4.4 |
| R17 | Standardize terminology ("Collection" not "Shelf", "Pieces" not "Target Bricks") | Low | 5.4 |
| R18 | Add nav badges (set count, rank) | Low | 5.1 |
| R19 | Add empty states for all zero-result filter scenarios | Low | 5.2.2, 5.2.3 |
| R20 | Add year range filter to Explore | Low | 5.3.3 |

---

*End of Information Architecture Audit*
