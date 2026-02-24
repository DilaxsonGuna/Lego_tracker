# Lego Tracker (LegoFlex) -- Product Audit & Roadmap

**Date:** 2026-02-21
**Author:** Product Manager Agent

---

## 1. Current Feature Inventory

### Authentication & Onboarding
| Feature | Status | Files | Notes |
|---------|--------|-------|-------|
| Email/password login | Working | `app/auth/login/page.tsx`, `components/auth/login-form.tsx` | Standard Supabase auth |
| Sign up | Working | `app/auth/sign-up/page.tsx`, `components/auth/sign-up-form.tsx` | Email confirmation flow |
| Sign up success page | Working | `app/auth/sign-up-success/page.tsx` | Confirmation message |
| Forgot password | Working | `app/auth/forgot-password/page.tsx` | Sends reset email |
| Update password | Working | `app/auth/update-password/page.tsx` | After reset flow |
| Onboarding | Working | `app/auth/onboarding/page.tsx`, `components/auth/onboarding-form.tsx` | Username, bio, avatar color, location, DOB, themes |
| Auth error page | Working | `app/auth/error/page.tsx` | Generic error handler |

### Home Feed (`/`)
| Feature | Status | Files | Notes |
|---------|--------|-------|-------|
| Stories carousel | **Mock data only** | `components/home/stories-carousel.tsx` | Uses `mockStories` from `lib/mockdata.ts`. No DB table. No real stories. |
| Feed posts | **Mock data only** | `components/home/feed-post.tsx`, `components/home/feed.tsx` | Uses `mockFeedPosts`. No feed_posts table. Like/comment/share/bookmark buttons are non-functional. |
| Right sidebar - search | **Non-functional** | `components/home/right-sidebar.tsx` | Input renders but has no handler |
| Right sidebar - trending sets | **Mock data only** | `components/home/right-sidebar.tsx` | Uses `mockTrendingSets`. `lib/queries/home.ts` has all TODO stubs. |
| Right sidebar - suggested collectors | Working | `components/home/right-sidebar.tsx` | Real data from `lib/queries/social.ts`. Follow/unfollow works. |
| Footer links | **Placeholder** | `components/home/right-sidebar.tsx` | About/Help/Press/API/Jobs/Privacy/Terms all link to `#` |

### Explore (`/explore`)
| Feature | Status | Files | Notes |
|---------|--------|-------|-------|
| Set discovery grid | Working | `components/explore/discovery-grid.tsx`, `discovery-card.tsx` | Real data from `lego_sets` table |
| Search by name/ID | Working | `components/explore/explore-header.tsx`, `lib/queries/explore.ts` | Accent-insensitive via RPC |
| Theme filtering (chips + modal) | Working | `components/explore/theme-chips.tsx`, `theme-filter-modal.tsx` | Parent themes + child rollup |
| Sort (newest/oldest/most-popular) | Working | `components/explore/explore-header.tsx` | Popularity via `get_popular_sets` RPC |
| Add to collection/wishlist | Working | `app/(app)/explore/actions.ts` | Upsert with conflict handling |
| Remove from collection | Working | `app/(app)/explore/actions.ts` | Direct delete |
| Personalized theme chips | Working | `lib/queries/explore.ts:getFeaturedThemes` | Falls back to hardcoded top 5 themes |
| Infinite scroll / pagination | Working | Explore client | Offset-based, `PAGE_SIZE = 50` |

### Vault (`/vault`)
| Feature | Status | Files | Notes |
|---------|--------|-------|-------|
| Collection tab | Working | `components/vault/collection-tabs.tsx` | With count |
| Wishlist tab | Working | `components/vault/collection-tabs.tsx` | With count |
| Stats hero (collection) | Working | `components/vault/vault-stats-hero.tsx` | Total value shows "$0" -- price data missing |
| Stats hero (wishlist) | Working | `components/vault/vault-stats-hero.tsx` | Estimated cost shows "$0" -- price data missing |
| Grid view | Working | `components/vault/vault-grid.tsx` | Responsive grid |
| List view | Working | `components/vault/vault-list.tsx` | Recently added per git history |
| Search within vault | Working | `components/vault/vault-toolbar.tsx` | Filters by name/set_num |
| Theme filter | Working | `components/vault/vault-toolbar.tsx` | Dropdown of user's themes |
| Favorite toggle | Working | `app/(app)/vault/actions.ts` | Max 4 enforced |
| Bulk selection | Working | `components/vault/vault-bulk-actions.tsx` | Checkbox per card |
| Bulk delete | Working | `components/vault/vault-bulk-actions.tsx` | Multi-select + remove |
| Bulk move to collection | Working | `components/vault/vault-bulk-actions.tsx` | Wishlist -> collection |
| Set price display | **Hardcoded "$0"** | `lib/queries/vault.ts:getVaultStats` | `lego_sets` table has no price column |

### Profile (`/profile`)
| Feature | Status | Files | Notes |
|---------|--------|-------|-------|
| Profile hero (avatar, username, role) | Working | `components/profile/profile-hero.tsx` | Avatar is color-based, not image |
| Follow counts (followers/following/friends) | Working | `components/profile/profile-hero.tsx`, `lib/queries/social.ts` | Friends = mutual follows |
| Favorites grid (4 sets) | Working | `components/profile/favorites-grid.tsx` | Real data from `user_favorites` |
| Bio section | Working | `components/profile/profile-bio.tsx` | But interests array always empty |
| Rank progress card | Working | `components/profile/rank-progress-card.tsx` | 5-tier system based on pieces + sets |
| Stats row (sets, pieces, brick score, rank, value) | Working | `components/profile/profile-stats-row.tsx` | Vault value shows "Coming Soon" |
| Milestone vault | Working | `components/profile/milestone-vault.tsx` | Derived from collection stats (1k/10k/100k bricks, 10/50 sets, decade span) |
| Stud pattern background | Working | `components/profile/stud-pattern-bg.tsx` | Decorative |
| Profile footer | Working | `components/profile/profile-footer.tsx` | Brand footer |

### Public Profile (`/u/[userId]`)
| Feature | Status | Files | Notes |
|---------|--------|-------|-------|
| View other user's profile | Working | `app/(app)/u/[userId]/page.tsx` | Same components as own profile |
| Follow/unfollow button | Working | `app/(app)/u/[userId]/profile-client.tsx` | Optimistic updates |
| View other user's vault | Working | `app/(app)/u/[userId]/vault/page.tsx` | Read-only view |

### Leaderboard (`/leaderboard`)
| Feature | Status | Files | Notes |
|---------|--------|-------|-------|
| Global ranking by brick score | Working | `lib/queries/leaderboard.ts` | Uses pre-calculated `profiles.brick_score` |
| Current user position | Working | `lib/queries/leaderboard.ts` | Highlighted in list |
| Rank icons per user | Working | Leaderboard client | Based on tier system |

### Settings (`/settings`)
| Feature | Status | Files | Notes |
|---------|--------|-------|-------|
| Settings hub | Working | `app/(app)/settings/page.tsx` | Links to sub-pages |
| Edit profile | Working | `app/(app)/settings/profile/page.tsx` | Username, bio, avatar, location, themes |
| Profile visibility toggle | Working | `app/(app)/settings/actions.ts` | `profile_visible` flag |
| Default grid view toggle | Working | `app/(app)/settings/actions.ts` | `default_grid_view` flag |
| Email notifications toggle | Working | `app/(app)/settings/actions.ts` | `email_notifications` flag (no email system) |
| Password reset from settings | Working | `app/(app)/settings/actions.ts` | Sends reset email |
| Sign out | Working | `components/settings/settings-sign-out.tsx` | With confirmation |

### Navigation & Layout
| Feature | Status | Files | Notes |
|---------|--------|-------|-------|
| Desktop sidebar | Working | `components/shared/sidebar.tsx` | 6 nav items, user footer |
| Mobile header + drawer | Working | `components/shared/mobile-header.tsx` | Sheet-based slide-out menu |
| Responsive breakpoints | Working | Layout + components | md: sidebar, xl: right sidebar |

---

## 2. Competitor Analysis

### Brickset (brickset.com)
**What they have that we don't:**
- Comprehensive set database with prices, instructions, reviews, and ratings
- Set price history and market value tracking
- Barcode/QR scanning to add sets
- Advanced filtering (year range, price range, piece count range, minifig count)
- Set instructions viewer
- Minifigure database and collection tracking
- Want/Have/Own status tracking (more granular than collection/wishlist)
- Annual statistics and collection analytics over time
- Community forums and discussions
- Set alerts for new releases and price drops
- Export collection data (CSV, PDF)

### BrickLink (bricklink.com)
**What they have that we don't:**
- Marketplace (buy/sell individual pieces, sets, minifigs)
- Part inventory per set
- Price guide with current market values
- Condition tracking (new, used, incomplete)
- Seller/buyer ratings
- Custom MOC (My Own Creation) designs
- Wanted lists with price alerts
- Studio integration for digital building

### Rebrickable (rebrickable.com)
**What they have that we don't:**
- Part-level inventory tracking
- "Build from parts you own" feature -- suggests sets you can build
- MOC designs with instructions
- Set compatibility/alternate builds
- Parts list comparison between sets
- Robust API for third-party integrations
- Color-specific part tracking

### What LegoFlex has that competitors DON'T:
- **Social-first design**: Follow system, feed, profiles -- competitors are databases, not social networks
- **Gamification**: Brick score, rank tiers, milestones, leaderboard -- no competitor does this
- **Modern mobile-first UI**: Competitors look like they were designed in 2008
- **Onboarding personalization**: Theme preferences that customize the experience immediately

---

## 3. Prioritized Roadmap

### P0 -- Must-Have for Launch (Deployment Blockers)

1. **Fix root layout metadata** -- ✅ DONE
   - Updated to "LegoFlex — Social Lego Collection Tracker" with proper SEO description
   - File: `app/layout.tsx`

2. **Replace all mock data on Home feed with real data OR redesign Home** -- ✅ DONE
   - Home page replaced with a real dashboard using `getDashboardStats`, `getRecentlyAddedSets`, `getFollowingActivity`, `fetchSuggestedUsers`
   - Components: `DashboardStatsCard`, `RecentlyAdded`, `FollowingActivity`, `SuggestedCollectors`, `DashboardWelcome`, `QuickActions`
   - No more mock data imports

3. **Remove or hide non-functional UI elements** -- ✅ DONE
   - Old feed components (feed-post, stories-carousel, right-sidebar) replaced with functional dashboard components
   - No dead buttons or placeholder links remain on Home

4. **Add middleware for auth protection** -- ✅ DONE
   - Implemented via `proxy.ts` in project root, which calls `updateSession` from `@/lib/supabase/proxy`
   - Protects all routes except static files and images

5. **Privacy: `profile_visible` setting is not enforced** -- ✅ DONE
   - Both `/u/[userId]/page.tsx` and `/u/[userId]/vault/page.tsx` call `checkProfileAccess`/`checkVaultAccess`
   - Returns private profile message if `access.isPrivate` is true

6. **`email_notifications` toggle has no backend** -- ✅ DONE
   - Toggle now shows "Email Notifications (Coming soon)" with disabled state and explanatory description

### P1 -- High Impact (User Acquisition & Retention)

7. **Set detail page** -- ✅ DONE
   - Route implemented at `app/(app)/set/[setNum]/page.tsx`
   - Includes hero section, stats, action buttons (add to collection/wishlist/favorite), and related sets

8. **Price data integration**
   - `lego_sets` table has no price column
   - Options: Rebrickable API, BrickLink API, or manual curation
   - This is the #1 feature users will expect: "What is my collection worth?"

9. **Image upload for avatars**
   - Currently avatar is a solid color circle picked from 6 presets (`components/auth/avatar-selector.tsx`)
   - No Supabase Storage bucket configured for user uploads
   - Users need real profile photos for a social app

10. **Notifications system** -- ✅ DONE
    - Database table `notifications` exists with query functions (`getNotifications`, `getUnreadCount`)
    - Notification bell component integrated in sidebar via `NotificationBellWrapper`
    - Supports multiple notification types with actor profiles

11. **Improve search with set detail results** -- ✅ DONE
    - Global search route at `app/(app)/search/page.tsx`
    - Accessible from sidebar nav items
    - Supports searching sets, users, and themes with tab switching

12. **Activity feed from REAL data** -- ✅ DONE
    - Home dashboard shows real activity via `getFollowingActivity()` from `lib/queries/home.ts`
    - Displays "X added Y to vault" with actual user data from followed users

13. **Share profile / collection link** -- ✅ DONE
    - Share button: `components/profile/share-profile-button.tsx`
    - Share collection card: `components/profile/share-collection-card.tsx`
    - OG image generation route: `app/api/og/collection/route.tsx`
    - Uses Web Share API with fallback to clipboard

### P2 -- Nice-to-Have (Polish)

14. **Interests/tags on profile** -- ✅ DONE
    - `getUserProfile()` now maps user themes as interests, returning `interests: string[]`
    - Pulls from user's theme preferences via `user_themes` table

15. **Dark/light theme toggle in sidebar** -- ✅ DONE
    - `ThemeProvider` from next-themes set up in `app/layout.tsx`
    - Theme selector wired into settings and onboarding

16. **Set status tracking**
    - `VaultSetStatus` type defines `built`, `in-box`, `missing-parts`, `for-sale`
    - Cards display status badges BUT no UI to set/change status
    - `user_sets` table has no `status` column -- status is currently unused

17. **Pagination on leaderboard** -- ✅ DONE
    - `leaderboard-client.tsx` implements "Load More" button pattern with offset-based pagination
    - Shows current user position card if not in visible list

18. **Collection analytics dashboard**
    - Theme distribution chart
    - Year distribution chart
    - Brick count over time
    - Value trend (once prices exist)

19. **PWA support**
    - No `manifest.json`, no service worker
    - Mobile-first UI is ready for it
    - Add install prompt for mobile users

20. **Accessibility improvements**
    - Many interactive elements lack proper ARIA labels
    - Color contrast may not meet WCAG AA on dark theme
    - Keyboard navigation not tested

---

## 4. Features to CUT or Defer

### CUT from v1 entirely:

1. **Instagram-style feed with stories** -- ✅ DONE (CUT). Home page replaced with real dashboard. Old feed/stories components removed.

2. **Post creation ("Post Build" CTA in sidebar)** -- Deferred until feed infrastructure exists.

3. **Stories system** -- ✅ DONE (CUT). Removed with the Home page redesign.

4. **Review system with ratings** -- Deferred. No tables, no UI, no infrastructure.

5. **Email notifications** -- ✅ DONE (labeled "Coming soon" and disabled in settings).

### DEFER to v2:

1. **Marketplace / trading** -- BrickLink owns this. Don't compete.
2. **Part-level tracking** -- Rebrickable owns this. Don't compete.
3. **MOC designs** -- Out of scope for collection tracker.
4. **Barcode scanning** -- Nice but not essential for web app.
5. **Set instructions** -- Licensed content, legal issues.

---

## 5. User Acquisition Hook

**The single feature that will make someone share this app:**

### "My Lego Collection Card" -- a shareable profile card image -- ✅ DONE

Implemented with:
- OG image generation route at `app/api/og/collection/route.tsx`
- Share Collection Card component with preview and share button (`components/profile/share-collection-card.tsx`)
- Web Share API with fallback to clipboard

**Secondary hook**: The **leaderboard + rank system** is already built and unique. Promote it as "What's your Lego rank?" -- competitive collectors will compare and share.

---

## Summary

LegoFlex has a solid foundation: the Explore, Vault, Profile, and Leaderboard features work with real data. The social layer (follows, suggested users, public profiles) is functional. The design system is cohesive and mobile-ready.

The biggest risk is the Home page -- it's 90% mock data creating a broken first impression. The fix is to simplify it into a dashboard rather than building out an Instagram-clone feed.

The app differentiates on three axes competitors ignore: **social features**, **gamification**, and **modern UI**. The roadmap should double down on these rather than chasing database completeness (prices, parts, instructions) where Brickset and Rebrickable have decade-long head starts.

**Critical path to launch: ~~P0 items (1-6)~~ ✅ -> ~~Set detail page (#7)~~ ✅ -> ~~Share card (#acquisition hook)~~ ✅ -> Remaining items (#8, #9, #16, #18, #19, #20) -> Ship.**
