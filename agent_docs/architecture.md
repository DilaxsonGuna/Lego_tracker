# Architecture

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage feed: stories carousel, posts, trending sets, suggested collectors with follow buttons |
| `/explore` | Discovery catalog: search, theme filtering, sort (newest/oldest/most-popular), add to collection/wishlist |
| `/vault` | User collection: Collection/Wishlist tabs, search, grid/list views, bulk selection, favorites (max 4) |
| `/profile` | Digital ID: avatar, follow counts, favorites grid, bio, vault stats, milestones |
| `/settings` | Account, collection, appearance, system settings |
| `/auth/*` | Authentication pages (no sidebar): login, sign-up, forgot-password, onboarding |

## Layout System

- All sidebar pages live under `app/(app)/` route group → single shared `layout.tsx`
- `(app)/layout.tsx` provides Sidebar (desktop) + MobileHeader (mobile)
- Sidebar uses `usePathname()` for active state — no per-route config needed
- Auth pages (`/auth/*`) live outside the route group, no sidebar
- Page-specific content stays in each `page.tsx`
- New users redirect to `/auth/onboarding` after email confirmation if profile incomplete

## Component Catalog

### Shared (`components/shared/`)
- `sidebar.tsx` — Desktop sidebar with nav, Post Build CTA, user footer with color avatar
- `sidebar-wrapper.tsx` — Server component that fetches user and passes to Sidebar
- `mobile-header.tsx` — Mobile sticky header with logo and hamburger menu
- `footer.tsx` — Brand footer with logo, copyright, links
- `theme-selector.tsx` — Theme multi-select with popular themes, "View More" modal with search (max 10). Import directly, not from barrel (SSR issues)
- `legoflex-logo.tsx` — Logo component

### Home (`components/home/`)
- `stories-carousel.tsx` — Scrollable story bubbles with gradient borders
- `feed-post.tsx` — Post card with user header, image, rating badge, actions
- `feed.tsx` — Feed list with loading spinner
- `right-sidebar.tsx` — Right sidebar (xl+): search, trending sets, suggested collectors

### Explore (`components/explore/`)
- `explore-header.tsx` — Sticky header with search, sort, theme filter chips
- `theme-chips.tsx` — Scrollable filter buttons
- `discovery-card.tsx` — Set card with image, add-to-vault button, metadata
- `discovery-grid.tsx` — Responsive 1/2/3/4 column grid

### Vault (`components/vault/`)
- `vault-stats-hero.tsx` — Stats hero for collection or wishlist
- `vault-toolbar.tsx` — Search input + view mode toggle
- `collection-tabs.tsx` — Collection/Wishlist tab switcher with counts
- `vault-card.tsx` — Set card with checkbox, favorite heart, year badge
- `vault-grid.tsx` — Responsive grid with favorite state
- `vault-bulk-actions.tsx` — Bottom sticky bar for bulk operations

### Profile (`components/profile/`)
- `profile-hero.tsx` — Avatar with border/glow, verified badge, role, follow stats
- `favorites-grid.tsx` — 4-column grid of favorite set images
- `profile-bio.tsx` — Bio text + interest chips
- `profile-stats-row.tsx` — Vault Value, Total Parts, Global Rank cards
- `milestone-vault.tsx` — Achievement badges grid
- `stud-pattern-bg.tsx` — Decorative Lego stud background

### Settings (`components/settings/`)
- `settings-section.tsx` — Section wrapper with title
- `settings-link-item.tsx` — Nav link with icon, title, description, chevron
- `settings-toggle-item.tsx` — Toggle switch with icon, title, description
- `settings-sign-out.tsx` — Sign out button with confirmation

### Auth (`components/auth/`)
- `login-form.tsx`, `sign-up-form.tsx`, `forgot-password-form.tsx`, `update-password-form.tsx`
- `onboarding-form.tsx` — Profile setup: username, bio, avatar color, optional themes
- `avatar-selector.tsx` — 8 preset color picker, includes `getAvatarColor` helper

## Data Layers

### Queries (`lib/queries/`) — Read Operations
- `explore.ts` — getDiscoverySets, getThemeCategories
- `home.ts` — getFeedPosts, getStories, getTrendingSets
- `profile.ts` — getUserProfile, getUserStats, getFavoriteSets, getFollowCounts
- `vault.ts` — getVaultSets, getVaultStats, getVaultThemes, getUserFavoriteSetNums
- `social.ts` — getSuggestedUsersWithFollowStatus, getFollowCounts, isFollowing
- `user-themes.ts` — getUserThemes, getUserThemeIds, getPopularThemes

### Commands (`lib/commands/`) — Write Operations
- `user-sets.ts` — addUserSet, deleteUserSet, getUserSetNums, updateUserSetCollection
- `user-favorites.ts` — addFavorite, removeFavorite, getUserFavoriteSetNums (max 4)
- `user-themes.ts` — setUserThemes, getUserThemesCount (max 10)
- `follows.ts` — followUser, unfollowUser, isFollowing, getFollowCounts

## Type Definitions (`types/`)

- `profile.ts` — UserProfile, UserStats, FavoriteSet, Milestone
- `lego-set.ts` — LegoSet, CollectionTab
- `vault.ts` — VaultSet, VaultStats, VaultSetStatus, VaultViewMode, CollectionStats, WishlistStats
- `explore.ts` — ThemeCategory, DiscoverySet, OrderByOption
- `feed.ts` — FeedPost, Story, TrendingSet, SuggestedUser, PostType
- `social.ts` — FollowRelationship, SuggestedUserWithFollowStatus, FollowCounts
- `navigation.ts` — NavItem
- `supabase.ts` — Auto-generated database types
