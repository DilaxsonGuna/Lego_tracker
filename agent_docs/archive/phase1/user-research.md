# LegoFlex User Research Brief

**Date:** 2026-02-21
**Author:** User Research Agent
**Cross-reference:** `agent_docs/phase1/pm-roadmap.md` (PM audit)

---

## 1. Complete User Journey Maps

### Journey A: New User Signup & Onboarding

```
Landing (/) -> Login (/auth/login) -> "Sign up" link -> Sign Up (/auth/sign-up)
  -> Email + Password + Repeat Password -> Submit
  -> Sign Up Success page (/auth/sign-up-success)
  -> [User checks email, clicks confirmation link]
  -> Redirect to Onboarding (/auth/onboarding)
  -> Avatar color + Username (required) + Display Name + Bio + Location + DOB + Themes (optional)
  -> Submit -> Hard redirect to Home (/)
```

**Friction points identified:**

1. **No auth callback route exists.** There is no `app/auth/callback/route.ts` or `app/auth/confirm/route.ts`. The sign-up form sets `emailRedirectTo` to `/auth/onboarding` (line 47, `components/auth/sign-up-form.tsx`), but without a callback route to exchange the email token for a session, the redirect after email confirmation may fail silently. The user clicks the email link and arrives at `/auth/onboarding` without an active session, causing the `createProfile` action to return "Not authenticated."

2. **No middleware protecting routes.** `CLAUDE.md` says "middleware manages sessions, unauthenticated users -> /auth/login" but no `middleware.ts` file exists in the project root. An unauthenticated user can navigate directly to `/vault`, `/profile`, `/settings`, `/leaderboard`, or `/explore` and hit server actions that silently return null/empty arrays rather than redirecting to login. Only `/settings` has an explicit `redirect("/auth/login")` check (line 29, `app/(app)/settings/page.tsx`).

3. **Sign-up success page is a dead end.** After submitting the sign-up form, the user is redirected to `/auth/sign-up-success` (line 51, `components/auth/sign-up-form.tsx`). This page says "Check your email to confirm." There is no link back to login, no resend confirmation button, and no guidance on what to do if the email does not arrive. The user is stranded.

4. **Onboarding has no skip option for non-required fields.** The form has 7 fields (avatar, username, display name, bio, location, DOB, themes). Only username is required, but the form presents all fields with equal visual weight. A new user who just wants to start browsing faces a long form. There is no "Skip for now" affordance for the optional fields -- the user must scroll past all of them to reach the "Get Started" button.

5. **No branding on auth pages.** The login, sign-up, forgot-password, and sign-up-success pages are plain white cards with no LegoFlex logo or branding. The user has no visual confirmation they are on the right app. Compare to the main app which has the LegoFlex logo in the sidebar.

6. **Auth error page shows raw error codes.** The `/auth/error` page displays `Code error: {params.error}` (line 15, `app/auth/error/page.tsx`). Users see cryptic strings like `invalid_token` or `expired_link` with no human-readable explanation and no action to take.

### Journey B: Home Page (First Impression After Login)

```
Login -> Home (/)
  -> Stories carousel (mock data)
  -> Feed posts (mock data)
  -> Right sidebar: search (non-functional), trending sets (mock), suggested collectors (real)
```

**Friction points identified:**

7. **Home is 90% fake.** The home page (`app/(app)/page.tsx`) imports `mockStories`, `mockFeedPosts`, and `mockTrendingSets` from `lib/mockdata.ts`. The stories show users named "New Drops", "BrickFan", "SpaceLab", "ColorPop" -- none of these are real users. The feed shows posts from "BrickMaster99" and "StudsAndSnot" with fake images, fake like counts (1,200 and 856), and fake comments. A new user sees an apparently thriving community that does not exist.

8. **All feed interaction buttons are non-functional.** The Like toggle, Comment toggle, Share button, Bookmark button, and "More options" button in `components/home/feed-post.tsx` (lines 83-110) render but do nothing when clicked. No handlers are attached. A user who tries to interact with content on their first visit discovers immediately that the app is partially non-functional.

9. **Home search bar does nothing.** The search input in `components/home/right-sidebar.tsx` (lines 79-86) renders with placeholder "Search sets, users..." but has no `onChange` handler, no form submission, and no linked search functionality.

10. **"View All" trending sets link goes nowhere.** The "View All" link for trending sets (line 94, `components/home/right-sidebar.tsx`) uses `href="#"`.

11. **Footer links are all placeholder anchors.** About, Help, Press, API, Jobs, Privacy, Terms -- all 7 links point to `#` (lines 155-176, `components/home/right-sidebar.tsx`).

12. **Suggested collectors lack profile links.** The suggested users in the right sidebar show username and follow button, but the username text is not a link to their profile (`/u/{id}`). Users cannot tap a suggested collector to view their collection. The user object has `id` but it is not used for navigation.

### Journey C: Explore (Discovering Sets)

```
Sidebar -> Explore (/explore)
  -> Search bar (functional, accent-insensitive)
  -> Theme filter button + modal (functional, max 10)
  -> Theme quick chips (personalized if user has theme prefs, else "Add Favorite Themes" CTA)
  -> Sort: Most Popular / Most Recent / Least Recent
  -> Discovery grid with set cards
  -> Each card: Heart (add to wishlist), Plus (add to collection), Check->X (remove from collection)
  -> "Load More" pagination button
```

**Friction points identified:**

13. **Set cards are not clickable.** The `DiscoveryCard` component (`components/explore/discovery-card.tsx`) has no `onClick` handler on the card itself. There is no set detail page -- no route at `/set/{setNum}`. Users can see a set thumbnail, name, year, piece count, and theme badge, but cannot tap the card to learn more about the set. The card image area has `cursor-pointer` via the parent div on hover, which implies clickability but delivers nothing.

14. **No confirmation or undo on collection actions.** When a user taps the Plus button to add a set to their collection, a toast appears ("Added to collection"). But there is no undo option on the toast. If the user accidentally adds a set, they must find the X button (which only appears on hover of the check icon) to remove it. The interaction pattern is: tap Plus -> see Check -> hover Check to reveal X -> tap X to undo. This is 3 steps to undo a 1-step action.

15. **No feedback when maximum theme filters are reached.** The `ThemeChips` component allows toggling themes for filtering, capped at 10. When the user has 10 themes selected and taps an 11th, nothing happens (the condition `selectedThemes.length < 10` at line 63 of `components/explore/explore-header.tsx` silently prevents the addition). There is no toast or visual feedback.

16. **"Add Favorite Themes" CTA goes to settings, not back.** If the user has no theme preferences, the explore header shows an "Add Favorite Themes" button that links to `/settings/profile`. After setting themes there, the user must manually navigate back to Explore. There is no return URL or "back to Explore" affordance after saving theme preferences.

17. **Empty state for no search results is missing.** When the explore grid has no sets matching the current search + theme filter + sort combination, the grid simply renders empty with no message. There is no "No sets found" empty state component.

### Journey D: Vault (Managing Collection)

```
Sidebar -> Vault (/vault)
  -> Stats hero (Total Market Value: "$0", Total Pieces, Unique Sets)
  -> Collection / Wishlist tabs with counts
  -> Search within vault + theme filter dropdown + grid/list view toggle
  -> Grid view: cards with checkbox, favorite heart, year badge, price ("$0")
  -> List view: table rows (desktop only)
  -> Bulk selection -> bottom sticky bar: Remove, Move to Collection (wishlist only)
  -> Favorite toggle (max 4, collection tab only)
  -> "Load More" pagination
```

**Friction points identified:**

18. **"$0" value displayed prominently everywhere.** The vault stats hero shows "Total Market Value: $0" as the primary stat in large primary-colored text (`components/vault/vault-stats-hero.tsx`, line 76). Every vault card shows "$0" as the price (line 94, `components/vault/vault-card.tsx`). The wishlist stats show "Estimated Cost: $0". This is the single most prominent number on the page and it is always wrong. It creates an impression that the feature is broken rather than unimplemented.

19. **No way to set or change set status.** The `VaultCard` displays status badges (Built, In Box, Missing Parts, For Sale) defined in `STATUS_VARIANTS` and `STATUS_LABELS` (lines 19-31, `components/vault/vault-card.tsx`). But there is no UI to set the status on a set. The `user_sets` table has no `status` column. The status values in vault cards come from the `VaultSet` type but are never populated from the database -- they appear only in mock data.

20. **Vault is empty on first visit with no meaningful CTA.** A new user who visits Vault sees "0" for all stats and an empty grid. There is no "Browse sets to add" button, no link to Explore, no guidance. The user must independently discover the Explore page via the sidebar.

21. **List view is hidden on mobile.** The vault client (`app/(app)/vault/vault-client.tsx`, lines 260-278) uses CSS to force grid view on mobile (`<div className={viewMode === "grid" ? "block" : "sm:hidden"}>`). The list view is `hidden sm:block`. But the view mode toggle is visible on mobile, meaning the user can tap "List" and see no change. The grid stays visible.

22. **Favorite limit error is a toast, not inline.** When a user tries to favorite a 5th set, the error is returned as a string ("Maximum 4 favorites allowed") and displayed as a toast error. The user has no advance warning of the limit. The heart icons on all collection cards look equally available even when the limit is reached.

23. **Bulk actions bar has no "Select All" option.** The `VaultBulkActions` bar appears when sets are selected, but there is no "Select All" checkbox or button. Users with large collections must individually check each set they want to act on.

### Journey E: Profile (Viewing Own Profile)

```
Sidebar -> Profile (/profile)
  -> Avatar with glow + username + verified badge (always false) + role badge
  -> Followers / Following / Friends counts
  -> Favorites grid (max 4, or empty state)
  -> "Edit Selection" button on favorites (non-functional)
  -> Bio section (or empty state)
  -> Interest tags (always empty -- hardcoded [] in `lib/queries/profile.ts:36`)
  -> Rank progress card
  -> Stats row: Vault Value ("Coming Soon"), Total Parts, Global Rank
  -> Milestone vault (derived from collection data)
  -> Add milestone button (non-functional)
  -> Brand footer
```

**Friction points identified:**

24. **"Edit Selection" button on favorites does nothing.** The `FavoritesGrid` component (line 21, `components/profile/favorites-grid.tsx`) renders a "Edit Selection" button with `variant="link"` but no `onClick` handler. It suggests the user can curate their favorites display order, but tapping does nothing.

25. **Interest tags are permanently empty.** The `getUserProfile` function (`lib/queries/profile.ts`, line 36) hardcodes `interests: []`. The profile bio section (`components/profile/profile-bio.tsx`, line 30) conditionally renders interest tags only when `user.interests.length > 0`, so they never appear. The user's theme preferences (stored in `user_themes`) are not mapped to interests.

26. **"isOnline" and "isVerified" are hardcoded.** `getUserProfile` always returns `isOnline: true` and `isVerified: false` (lines 31-32, `lib/queries/profile.ts`). Every user appears "online" at all times (green dot on avatar). No user is ever verified. These are misleading UI elements.

27. **"Coming Soon" as vault value.** The stats row shows "Vault Value: Coming Soon" as a text string (`lib/queries/profile.ts`, line 81). This is better than "$0" (the vault page approach) because it sets expectations, but it still occupies a premium stat card position with no real data.

28. **"Add milestone" button does nothing.** The `MilestoneVault` component (`components/profile/milestone-vault.tsx`, line 40-48) renders a dashed-border button with a Plus icon and `aria-label="Add milestone"` that has no `onClick` handler. Users cannot manually add milestones.

29. **No link from Profile to Vault.** The profile shows collection stats but has no "View my Vault" button. The public profile (`/u/[userId]`) has a "View Vault" link (line 186, `app/(app)/u/[userId]/profile-client.tsx`) but the own profile page does not.

30. **No link from Profile to Edit Profile.** The profile page has no "Edit Profile" button. Users must navigate to Settings -> Edit Profile via the sidebar. This is 2 clicks away from the context where they see their profile data.

### Journey F: Public Profile & Social

```
User lands on /u/{userId} (from suggested collector or shared link)
  -> Same layout as own profile but with Follow/Unfollow button
  -> "View Vault" button links to /u/{userId}/vault
  -> Vault is read-only (no checkboxes, no favorite hearts)
```

**Friction points identified:**

31. **`profile_visible` setting is not enforced.** Users can toggle "Profile Visibility" in settings (`app/(app)/settings/settings-client.tsx`, line 68-75). This updates `profiles.profile_visible` in the database. But the public profile page (`app/(app)/u/[userId]/page.tsx`) and public vault page (`app/(app)/u/[userId]/vault/page.tsx`) never check this flag. A user who sets their profile to private expects it to be invisible, but it remains fully accessible.

32. **No way to discover other users' profiles from the app.** The only path to a public profile is via the "Suggested Collectors" widget on the home page right sidebar -- but the usernames there are not links (identified in friction point #12). There is no user search feature, no followers/following list page, and no clickable usernames anywhere in the app. The public profile route exists but is effectively unreachable through the UI.

33. **Clicking follower/following/friends counts does nothing.** The profile hero shows Followers, Following, and Friends counts (lines 55-79, `components/profile/profile-hero.tsx`) but they are plain text, not clickable. Users expect to be able to tap these to see lists of users. There is no followers list or following list page.

34. **Public profile responsive issues.** The public profile hero (`app/(app)/u/[userId]/profile-client.tsx`, line 70) uses a fixed `size-44` avatar with no responsive sizing, unlike the own profile hero which uses `size-28 sm:size-44`. On mobile, the public profile avatar may be disproportionately large. The outer padding also uses fixed `px-8 py-12` (line 86, `app/(app)/u/[userId]/page.tsx`) versus the own profile's responsive `px-4 sm:px-8 py-8 sm:py-12`.

### Journey G: Leaderboard

```
Sidebar -> Leaderboard (/leaderboard)
  -> Header with total users count
  -> If current user is ranked below visible list: current user position card
  -> Leaderboard table with rank, avatar, username, brick score, rank tier icon
  -> "Load More" pagination
  -> Empty state: "No collectors on the leaderboard yet."
```

**Friction points identified:**

35. **Leaderboard entries are not clickable.** The leaderboard table displays usernames but they are not links to `/u/{userId}`. Users cannot tap a competitor to view their collection or profile.

36. **No filtering or time-range selection.** The leaderboard shows a single global ranking by brick score with no ability to filter by theme, time period, region, or friend group.

### Journey H: Settings

```
Sidebar -> Settings (/settings)
  -> Account: Edit Profile link, Password Reset dialog
  -> Collection: Profile Visibility toggle, Default Grid View dialog
  -> Appearance: Theme Selector dialog (dark/light/system)
  -> System: Email Notifications toggle
  -> Sign Out button with confirmation
```

**Friction points identified:**

37. **Email Notifications toggle has no backend.** The toggle updates `profiles.email_notifications` in the database (`app/(app)/settings/actions.ts`), but no email service is configured. No `package.json` dependency on SendGrid, Resend, or any email provider. The user toggles a setting that does nothing.

38. **Default Grid View setting is not applied.** The `default_grid_view` flag is stored and toggled in settings, but the vault client (`app/(app)/vault/vault-client.tsx`, line 56) always initializes `viewMode` to `"grid"` regardless of the user's saved preference.

39. **Edit Profile has inconsistent bio length limit.** The onboarding form allows 160 characters for bio (`components/auth/onboarding-form.tsx`, line 197), while the edit profile form allows 200 characters (`components/settings/edit-profile-form.tsx`, line 40). A user who wrote a 200-char bio in settings would find it truncated if they somehow went through onboarding again.

40. **Edit Profile lacks username availability checking.** The onboarding form has debounced username availability checking (`components/auth/onboarding-form.tsx`, lines 57-81). The edit profile form (`components/settings/edit-profile-form.tsx`) has no such validation. A user could submit a username that conflicts with another user and only learn about it from a server error.

---

## 2. User Personas

### Persona 1: The Casual Collector ("Weekend Builder")

**Demographics:** 25-40, owns 5-20 LEGO sets, builds on weekends, browses LEGO content on Reddit/Instagram.
**Technical comfort:** Uses apps daily, expects modern mobile-first UX.

**Primary goal:** Track what sets I own so I stop accidentally buying duplicates, and show off my small-but-curated collection to friends.

**What delights them:**
- The Explore page with theme filtering makes browsing sets genuinely enjoyable.
- Adding sets to collection/wishlist with one tap from Explore is fast and satisfying.
- The brick score and rank system gives them a sense of progression even with a small collection.
- The favorites grid on the profile is a nice "top 4" showcase.
- The stud pattern background and Lego yellow theme feel authentic and fun.

**What frustrates them:**
- **The home page looks like a social media app with fake content.** They expected a collection tool and landed on what looks like a broken Instagram clone. First impression: "Is this finished?"
- **"$0" displayed prominently on their vault.** They added 10 sets and the app tells them their collection is worth nothing. Feels deflating, not aspirational.
- **They cannot tap a set card to see details.** They want to see piece count, year, and maybe what other people own this set. The card shows a thumbnail but goes nowhere.
- **The onboarding form asks for Date of Birth.** They do not understand why a LEGO tracker needs their birthday and feel uneasy entering it.
- **They cannot share their profile with friends** because there is no share button and no social meta tags for link previews.
- **They toggle "Profile Visibility" off for privacy, but their profile is still public.** This is a trust violation.

### Persona 2: The Serious Collector ("Vault Keeper")

**Demographics:** 30-55, owns 50-500+ sets, tracks value and completeness meticulously, may also use Brickset or BrickLink.
**Technical comfort:** Power user, wants data density and efficiency.

**Primary goal:** Comprehensive inventory management -- know exactly what I own, what it is worth, and organize by theme/status/year.

**What delights them:**
- Bulk selection and delete in the Vault saves time when cleaning up.
- Theme-based filtering in both Explore and Vault.
- The wishlist-to-collection "Move" workflow mirrors their real-world buying process.
- The rank system and milestones provide achievement markers they have not seen elsewhere.

**What frustrates them:**
- **No price data whatsoever.** This is deal-breaking for a serious collector. Brickset and BrickLink both provide market values. "$0" across the board makes the vault feel like a toy, not a tool.
- **No set status tracking.** They want to mark sets as Built, In Box, Missing Parts, or For Sale. The UI shows status badges in mock data but there is no way to set them. This is a critical missing feature for inventory management.
- **50 sets per page with "Load More" buttons.** A user with 200 sets must click "Load More" 4 times. There is no infinite scroll and no way to view all sets at once.
- **No export functionality.** They cannot export their collection data to CSV or PDF. They may maintain parallel spreadsheets.
- **Search is local-only in Vault.** The vault search filters the already-loaded sets on the client side. If sets have not been loaded yet (beyond the first PAGE_SIZE), they will not appear in search results.
- **Cannot sort vault by name, year, or piece count.** The vault only sorts by favorites-first, then whatever the server returns (year descending). There is no user-facing sort control.
- **No duplicate detection.** When adding a set from Explore that is already in the collection, the upsert silently succeeds (changes the collection_type if different). The user gets "Added to collection" toast even if they already owned it, with no "You already have this" warning.
- **The leaderboard ranks everyone globally but there is no way to compare with friends** or see collection overlap.

### Persona 3: The Social Browser ("Community Explorer")

**Demographics:** 20-35, may own a few sets or none, motivated by discovery, curation, and following interesting collectors.
**Technical comfort:** Heavy social media user, expects Instagram/TikTok-level interaction design.

**Primary goal:** Discover cool LEGO sets through other collectors, follow builders with great taste, and curate a public profile that expresses my LEGO identity.

**What delights them:**
- The follow/unfollow system works with optimistic updates and feels snappy.
- Public profiles with the rank badge and favorites grid create aspiration.
- The "Suggested Collectors" widget surfaces real users.
- The dark theme with Lego yellow accents looks great on mobile.

**What frustrates them:**
- **The feed is entirely fake.** This persona came for the social features and the feed is the centerpiece of their experience. Stories, posts, likes, comments -- none of it works. They cannot see what other collectors are actually doing.
- **There is no activity feed showing real actions.** When someone they follow adds a set or hits a milestone, there is no way to know.
- **They cannot browse other people's collections.** Even though public profiles exist, there is no discovery mechanism beyond the 5 suggested users. No search-by-username, no followers list to browse.
- **No notifications.** They follow someone but never learn when that person adds sets or reaches milestones.
- **Clicking a suggested collector does nothing** (username is not a link).
- **"Add Build" story bubble promises creation features that do not exist.** The first story bubble has a Plus icon and says "Add Build" (`mockStories[0]` in `lib/mockdata.ts`). Tapping it does nothing.
- **The comment on the feed post ("The details on the roof are insane! Best set of 2023.") is fake.** When this persona tries to reply, there is no way to do so.

### Persona 4: The Completionist ("Data Collector")

**Demographics:** 35-60, collects specific themes comprehensively (e.g., all Star Wars, all Technic), tracks every piece, wants analytics.
**Technical comfort:** Detail-oriented, values accuracy and completeness over aesthetics.

**Primary goal:** Track my theme-specific collection progress, know exactly what percentage of a theme I own, and identify missing sets.

**What delights them:**
- The `lego_sets` table contains real Rebrickable data with accurate piece counts and theme IDs.
- Theme filtering in Explore shows real theme hierarchies (parent + child themes).
- The milestone system recognizes their collection size (1k, 10k, 100k bricks).
- Piece count totals in the vault are accurate.

**What frustrates them:**
- **No theme completion tracking.** They want to see "You own 42 of 87 Star Wars sets (48%)" but no such feature exists.
- **No per-set detail page.** They want to see the full metadata for each set: original retail price, piece count, theme, sub-theme, year, minifigure count, owner count. None of this is viewable.
- **Interest tags on profile are always empty** (hardcoded `interests: []`). They want their theme specialization displayed publicly.
- **No year-range or piece-count filtering in Explore.** They want to filter by "Star Wars sets from 2015-2020 with 1000+ pieces" -- the current UI only supports theme and sort.
- **Vault stats are aggregate only.** No per-theme breakdown, no per-year chart, no trend over time.
- **No quantity tracking feedback.** The `user_sets` table has a `quantity` column but the UI never displays or allows editing it. A completionist who owns 3 copies of a set has no way to record this.
- **Milestones are derived but not celebratory.** When the user crosses the 10k bricks threshold, the milestone silently appears on their profile. There is no notification, no congratulations modal, no confetti. The achievement is discovered passively.

---

## 3. Cross-Persona Pain Points (Affecting All Users)

### P-1: Broken First Impression (Home Page)
Every user's first authenticated experience is a page of fake data. The home page at `app/(app)/page.tsx` uses `mockStories`, `mockFeedPosts`, and `mockTrendingSets` from `lib/mockdata.ts`. This damages trust immediately.

### P-2: No Set Detail Page
There is no route at `/set/{setNum}`. Set cards in Explore, Vault, and the Feed are visual dead ends. Every competitor (Brickset, BrickLink, Rebrickable) has a set detail page as their core content unit. Its absence makes the app feel incomplete.

### P-3: No Global Search
The home page search bar is non-functional. There is no unified search in the sidebar or header that lets users search for sets, users, or themes from any page.

### P-4: No Notification System
There are no in-app notifications. Users who follow others never learn about their activity. Users who hit milestones are never congratulated. The `email_notifications` toggle in settings is a facade.

### P-5: Privacy Setting Not Enforced
The `profile_visible` toggle in settings creates a false sense of security. See friction point #31.

---

## 4. Top 5 UX Improvement Recommendations (Ranked by User Impact)

### Recommendation 1: Replace Home with a Real Dashboard (Impact: ALL personas, CRITICAL)

**The problem:** The home page is the first thing every user sees after login. It is 90% mock data with non-functional interactions. It destroys first impressions and trust.

**The solution:** Replace the Instagram-style feed with a personal dashboard:
- **Your Collection at a Glance:** Recent adds (last 5 sets), total sets, total pieces, brick score trend.
- **Suggested Sets for You:** Based on theme preferences, show sets from favorite themes not yet in collection.
- **Activity from People You Follow:** Derived from `user_sets.created_at` and `follows` -- "UserX added [Set] to their vault 2h ago." No new tables needed.
- **Your Rank:** Current rank, progress to next tier, position on leaderboard.
- **Quick Actions:** "Browse Sets" (link to Explore), "View Vault" (link to Vault).

**Why #1:** This is the entry point. Every user hits this page first. Getting it right determines whether they stay or leave. The PM roadmap (P0 item #2) also flags this as the top priority.

**Files affected:** `app/(app)/page.tsx`, `lib/queries/home.ts` (replace TODO stubs), `components/home/*` (replace mock components), `lib/mockdata.ts` (remove).

---

### Recommendation 2: Build the Set Detail Page (Impact: ALL personas, HIGH)

**The problem:** There is no page to view individual set details. Set cards in Explore and Vault look clickable but go nowhere. This is the core content page for a set tracker.

**The solution:** Create `/set/[setNum]` route with:
- Large set image
- Name, year, theme, piece count, set number
- Owner count (how many LegoFlex users own this set -- derived from `user_sets`)
- "Add to Collection" / "Add to Wishlist" / "Remove" buttons (same as Explore card actions)
- For sets in the user's vault: show status, favorite toggle, notes
- Related sets from the same theme

**Why #2:** Every set card, every trending set, every vault entry, every leaderboard mention should link to a detail page. Without it, the app is a catalog of thumbnails with no depth. This is the single feature that converts browsing into engagement.

**Files to create:** `app/(app)/set/[setNum]/page.tsx`, `app/(app)/set/[setNum]/actions.ts`, `lib/queries/set-detail.ts`, `components/set-detail/*`.

---

### Recommendation 3: Fix the Value Display Problem (Impact: Serious Collectors + Casual Collectors, HIGH)

**The problem:** "$0" is displayed as the primary stat in the vault stats hero, on every vault card, and in the wishlist stats. This is the single most visible data point in the Vault and it is always wrong.

**The solution (immediate):** Replace "$0" with a meaningful alternative:
- Option A: Remove the dollar value entirely from the vault stats hero and vault cards until price data is available. Show only piece count and set count.
- Option B: Replace "$0" with a "Coming Soon" label (the profile page already uses this approach at `lib/queries/profile.ts:81`).
- Option C: Use Rebrickable's estimated retail price data (they have a price field in their API) as a rough proxy.

**Why #3:** Seeing "$0" prominently displayed undermines the perceived value of the entire vault feature. It is the difference between "my collection tracker" and "a broken collection tracker." This is also flagged in the PM roadmap as P1 item #8.

**Files affected:** `lib/queries/vault.ts` (lines 89, 115, 146, 172), `components/vault/vault-card.tsx` (line 94), `components/vault/vault-stats-hero.tsx`.

---

### Recommendation 4: Make Users Discoverable (Impact: Social Browsers + ALL personas, HIGH)

**The problem:** There is no way to navigate to another user's profile through the UI. Suggested collectors are not linked. Follower/following counts are not clickable. There is no user search. The social layer exists in the database but is invisible in the UX.

**The solution:**
- Make suggested collector usernames link to `/u/{userId}` in the right sidebar.
- Make follower/following/friends counts on profiles clickable, linking to a `/u/{userId}/followers` and `/u/{userId}/following` list page.
- Add usernames in the leaderboard as links to public profiles.
- Add a user search feature to Explore or as a global search.
- Add a share button on profiles that copies the `/u/{userId}` URL with a toast confirmation.

**Why #4:** The social layer is LegoFlex's primary differentiator vs. competitors. But if users cannot discover each other, follows are meaningless, the leaderboard is voyeuristic without connection, and the app fails as a social network. The PM roadmap identifies this as P1 item #13 (share profile).

**Files affected:** `components/home/right-sidebar.tsx` (wrap usernames in `Link`), `components/profile/profile-hero.tsx` (make counts clickable), leaderboard table component, new followers/following list pages.

---

### Recommendation 5: Enforce Privacy and Remove Fake Interactions (Impact: ALL personas, HIGH -- Trust)

**The problem:** Two trust violations exist: (1) the `profile_visible` setting does not actually hide profiles, and (2) non-functional UI elements (like/comment/share/bookmark buttons, "Edit Selection", "Add milestone", search bar) suggest features that do not exist.

**The solution:**
- **Enforce `profile_visible`:** In `app/(app)/u/[userId]/page.tsx` and `app/(app)/u/[userId]/vault/page.tsx`, check the `profile_visible` flag on the target user's profile. If false, show a "This profile is private" message instead of the profile content.
- **Remove or disable non-functional buttons:** Either remove Like/Comment/Share/Bookmark buttons from the feed entirely (since the feed is being replaced per Recommendation 1), or add `disabled` state with a tooltip "Coming soon."
- **Remove "Edit Selection" button** from `FavoritesGrid` until it has a handler.
- **Remove "Add milestone" button** from `MilestoneVault` until manual milestones are supported.
- **Remove the home page search bar** until global search is implemented.

**Why #5:** Trust is the foundation of user retention. A user who discovers that privacy settings do not work will not return. A user who encounters multiple non-functional buttons will assume the entire app is broken. Removing fake interactions is a net positive -- fewer features that work is better than more features that do not.

**Files affected:** `app/(app)/u/[userId]/page.tsx`, `app/(app)/u/[userId]/vault/page.tsx` (add `profile_visible` check), `components/home/feed-post.tsx` (remove or disable action buttons), `components/profile/favorites-grid.tsx` (remove "Edit Selection"), `components/profile/milestone-vault.tsx` (remove "Add milestone"), `components/home/right-sidebar.tsx` (remove search input and footer links).

---

## 5. Additional Findings (Not in Top 5 but Worth Noting)

### Empty State Gaps

| Page/Component | Has Empty State | Notes |
|---|---|---|
| Vault (empty collection) | No | Shows empty grid with no guidance |
| Vault (empty wishlist) | No | Shows empty grid with no guidance |
| Explore (no search results) | No | Shows empty grid with no message |
| Profile favorites | Yes | Good: `EmptyState` with "Mark up to 4 sets as favorites" |
| Profile bio | Yes | Good: `EmptyState` with "Tell the community about yourself" |
| Leaderboard (empty) | Yes | Good: "No collectors on the leaderboard yet" |
| Public vault (empty) | Yes | Shows "No sets in collection/wishlist yet" |

### Navigation Dead Ends

1. After editing profile in settings, user is redirected to `/settings` but may want to go to `/profile` to see the result.
2. The sidebar footer shows "@username / Collector" but is not a link to `/profile`.
3. The `LegoFlexLogo` in the sidebar is not clickable -- it should link to Home.
4. On mobile, after navigating via the sheet menu, the sheet closes but there is no breadcrumb or context for where the user is.

### Performance Concerns for User Experience

1. `calculateGlobalPosition` in `lib/queries/profile.ts` (lines 84-125) fetches ALL users' collection data to calculate rank position. For a database with 1000+ users each having 50+ sets, this query will be slow and the profile page will feel sluggish.
2. The explore page loads 50 sets initially with a full join on themes. The pagination is offset-based, which degrades with large datasets.

### Accessibility Gaps Affecting User Experience

1. The story carousel (`components/home/stories-carousel.tsx`) has no keyboard navigation and no ARIA roles. Screen reader users cannot interact with it.
2. The favorite heart button on vault cards uses color alone (filled yellow vs. unfilled white) to indicate state. This fails WCAG color-only indicators.
3. The "More options" button on feed posts has `aria-label="More options"` but no dropdown menu -- it does nothing on activation.
4. The theme filter chips in Explore have no `aria-pressed` state to indicate active selection for screen readers.

---

## 6. Summary

LegoFlex has strong bones: real data in the Explore/Vault/Profile/Leaderboard pipeline, a working social graph (follows + mutual friends), an engaging gamification system (brick score + ranks + milestones), and a polished design system. The core collect-and-track loop (Explore -> Add to Vault -> View in Vault -> Showcase on Profile) functions end-to-end with real data.

The critical failures are all about **the gaps between the real features:** a fake home page as the first impression, clickable-looking cards that go nowhere, prominent $0 values, non-functional buttons that break trust, and a social layer that exists in the database but is unreachable through the UI.

The top 5 recommendations above focus on fixing these gaps rather than building new features. The app does not need more features -- it needs the features it has to be connected, honest, and complete.
