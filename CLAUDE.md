# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 + Supabase starter kit for building the Lego Tracker application. It uses React 19, TypeScript, Tailwind CSS, and shadcn/ui components.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server
```

## Architecture

**App Router Structure (`/app`)**
- `(app)/` - Route group for all sidebar pages (single shared layout with Sidebar + MobileHeader)
  - `page.tsx` - Homepage feed (`/`)
  - `explore/` - Discovery catalog (`/explore`)
    - `page.tsx` - Server component with Suspense
    - `explore-client.tsx` - Client component for interactivity
    - `actions.ts` - Server actions for data fetching
  - `profile/` - User profile page (`/profile`)
    - `page.tsx` - Page component
    - `actions.ts` - Server actions for profile CRUD
  - `vault/` - User collection vault (`/vault`)
    - `page.tsx` - Server component with data fetching
    - `vault-client.tsx` - Client component for interactivity and state management
    - `actions.ts` - Server actions (fetchVaultSets, fetchVaultStats, fetchVaultThemes, addSetToVault, removeSetFromVault, updateSetQuantity)
- `/auth/*` - Authentication pages (login, sign-up, forgot-password, etc.) — no sidebar
- Root layout handles theme provider and global styles
- All routes except `/`, `/login`, and `/auth/*` are protected by middleware

**Data Flow Pattern**
```
page.tsx → actions.ts → lib/queries/*.ts → Supabase
```
- Pages call server actions for data mutations
- Server actions delegate to query functions in `lib/queries/`
- Query functions handle Supabase client creation and data transformation

**Supabase Integration (`/lib/supabase`)**
- `client.ts` - Browser client for client components
- `server.ts` - Server client for server components/actions
- `proxy.ts` - Middleware proxy handling session cookies and auth redirects

**Data Fetching Layer (`/lib/queries`)**
- `explore.ts` - Discovery page queries (getDiscoverySets, getThemeCategories)
- `home.ts` - Homepage feed queries (getFeedPosts, getStories, getTrendingSets)
- `profile.ts` - Profile queries (getUserProfile, getUserStats, getFavoriteSets)
- `vault.ts` - Vault queries (getVaultSets, getVaultStats, getVaultThemes)

**Commands Layer (`/lib/commands`)**
- `user-sets.ts` - CRUD operations for user_sets table (addUserSet, deleteUserSet, getUserSetNums)
- `index.ts` - Barrel export

**Client Hooks (`/lib/hooks`)**
- `use-user.ts` - Hook to get current authenticated user with auth state listener
- `index.ts` - Barrel export

**Components (`/components`)**
- `/ui` - shadcn/ui primitives (button, input, card, etc.)
- `/shared` - Shared layout components (sidebar, mobile header, logo, footer)
- `/auth` - Authentication forms (login, sign-up, forgot-password, update-password, auth-button, logout-button)
- `/home` - Homepage feed-specific components
- `/explore` - Explore/Discovery page components
- `/profile` - Profile page-specific components
- `/vault` - Vault page-specific components

**Authentication Flow**
- Cookie-based auth via `@supabase/ssr`
- Middleware intercepts requests to manage sessions
- Unauthenticated users redirected to `/auth/login`
- Protected routes check session in server components

## Database Schema (Supabase)

**Tables:**
- `profiles` - Extends Supabase auth.users (id, username, full_name, avatar_url, updated_at)
- `lego_sets` - Cached set data from Rebrickable API (set_num PK, name, year, theme_id, num_parts, img_url)
- `themes` - Lego theme hierarchy (id PK, name, parent_id → self-referential for sub-themes)
- `user_sets` - Join table tracking user collections (id, user_id → profiles, set_num → lego_sets, quantity, notes, created_at)

**Key Relationships:**
- `user_sets.user_id` → `profiles.id` (cascade delete)
- `user_sets.set_num` → `lego_sets.set_num` (cascade delete)
- `lego_sets.theme_id` → `themes.id`
- `themes.parent_id` → `themes.id` (self-referential for theme hierarchy)
- Unique constraint on (user_id, set_num) prevents duplicate entries

**Row Level Security (RLS):**
- Profiles: Public read, users update own
- Lego sets: Public read (cached data)
- User sets: Full CRUD only for own records (`auth.uid() = user_id`)

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<supabase-anon-or-publishable-key>
```

## UI Components

Uses shadcn/ui with "new-york" style variant. Add new components with:
```bash
npx shadcn@latest add <component-name>
```

Path alias `@/*` maps to project root.

## BrickBox Design System

The application uses a custom design system based on the BrickBox theme with Lego yellow as the primary accent color and a warm dark palette.

**Design Tokens (CSS Variables in `globals.css`):**
- Primary: `#ffd000` (Lego yellow) - used for accents, buttons, highlights
- Primary Ghost: `--primary-ghost` - 10% opacity primary, used for hover backgrounds (e.g. tabs, buttons)
- Background: Light `#f8f8f5` / Dark `#18150c` (warm)
- Card/Surface: Light `#ffffff` / Dark `#231f0f` (warm)
- Surface Accent: `--surface-accent` - subtle accent surface for hover states
- Border: Dark `#36301a` (warm)
- Border radius: `0.75rem` (12px) default

**Custom Utilities (in `globals.css`):**
- `.scrollbar-hide` - Hides scrollbars across browsers (used for stories carousel)
- `.stud-bg` - Lego stud pattern background using radial gradient (24px grid)

**Typography:**
- Font family: Inter (via `font-display` utility)
- Weights: 400-800 for various text hierarchy

## Type Definitions (`/types`)

- `profile.ts` - `UserProfile` (id, username, fullName, avatarUrl, bio, isVerified, role, isOnline, followers, following, friends, interests), `UserStats` (setsCount, piecesCount, rank, rankNumber, vaultValue), `FavoriteSet` (setNum, name, imageUrl), `Milestone` (id, icon, label)
- `lego-set.ts` - `LegoSet` (setNum, name, year, themeId, numParts, setImgUrl, price?), `CollectionTab` type ("collection" | "wishlist")
- `navigation.ts` - `NavItem` (label, href, icon, isActive?)
- `feed.ts` - `FeedPost` (id, user, type, actionText, timeAgo, imageUrl, likes, comments, rating?, topComment?), `Story` (id, username, avatarUrl, isAddStory, hasUnviewed), `TrendingSet` (setNum, name, thumbnailUrl, postCount), `SuggestedUser` (id, username, avatarUrl), `PostType` ("build" | "review" | "haul" | "moc")
- `explore.ts` - `ThemeCategory` (id, label), `DiscoverySet` (setNum, name, numParts, setImgUrl, theme), `OrderByOption` ("newest" | "oldest")
- `vault.ts` - `VaultSet` (setNum, name, year, numParts, setImgUrl, price, status), `VaultStats` (totalValue, totalPieces, uniqueThemes), `VaultSetStatus` ("built" | "in-box" | "missing-parts" | "for-sale"), `VaultViewMode` ("grid" | "list")
- `supabase.ts` - Auto-generated Supabase database types

## Mock Data (`/lib/mockdata.ts`)

Development mock data exports:
- `mockUser` - Sample user profile (Legoman, Master Builder role, social stats, interests)
- `mockUserStats` - User statistics (setsCount, piecesCount, rank, rankNumber, vaultValue)
- `mockFavoriteSets` - Array of 4 favorite set images for profile display
- `mockMilestones` - Array of 5 achievement milestones (100k Bricks, 10 Years, Designer, Top 100, Verified)
- `mockNavItems` - Sidebar navigation items with icons (Home, Explore, Vault, Profile)
- `mockLegoSets` - Array of 6 sample Lego sets with prices
- `mockStories` - Array of 5 story items (1 "Add Build" + 4 user stories, some viewed/unviewed)
- `mockFeedPosts` - Array of 2 feed posts (build addition + review with rating and comment)
- `mockTrendingSets` - Array of 3 trending sets with post counts
- `mockSuggestedUsers` - Array of 2 suggested collectors
- `mockThemeCategories` - Array of 8 theme filter categories (All, Star Wars, Technic, Icons, Ideas, Architecture, Marvel, Harry Potter)
- `mockDiscoverySets` - Array of 8 discovery catalog sets with theme tags
- `mockVaultStats` - Vault statistics (totalValue, totalPieces, uniqueThemes)
- `mockVaultSets` - Array of 4 vault sets (Millennium Falcon, Eiffel Tower, Titanic, Lion Knights' Castle)

## Layout

- All sidebar pages live under the `(app)` route group which has a single shared `layout.tsx`
- The `(app)/layout.tsx` provides Sidebar (desktop) + MobileHeader (mobile) wrapping all children
- Sidebar uses `usePathname()` to automatically highlight the active nav item — no per-route config needed
- To add a new sidebar page, create a folder under `app/(app)/` with a `page.tsx`
- Auth pages (`/auth/*`) live outside the route group and have no sidebar
- Page-specific content (main area, footer) stays in `page.tsx`

## Shared Components (`/components/shared`)

| Component | Description |
|-----------|-------------|
| `legoflex-logo.tsx` | LegoFlex Puzzle icon logo component |
| `sidebar.tsx` | Desktop sidebar with nav items, Post Build CTA, user footer. Uses `usePathname()` for active state |
| `mobile-header.tsx` | Mobile-only sticky header with logo and hamburger menu |
| `footer.tsx` | Brand footer with LegoFlex logo, copyright, and Privacy/Terms/Help links |
| `index.ts` | Barrel export for all shared components |

## Home Components (`/components/home`)

Page-specific components for the homepage feed:

| Component | Description |
|-----------|-------------|
| `stories-carousel.tsx` | Horizontal scrollable story bubbles with gradient borders for unviewed, dashed "Add Build" button |
| `feed-post.tsx` | Social feed post card: user header, image with optional rating badge, like/comment/share/bookmark actions, comment preview |
| `feed.tsx` | Feed list container mapping posts + loading spinner |
| `right-sidebar.tsx` | Right contextual sidebar (xl+ only): search input, trending sets, suggested collectors, footer links |
| `index.ts` | Barrel export for all home components |

## Explore Components (`/components/explore`)

Page-specific components for the explore/discovery page:

| Component | Description |
|-----------|-------------|
| `explore-header.tsx` | Sticky header with "Discovery" title, search input, sort select (newest/oldest), theme filter chips |
| `theme-chips.tsx` | Horizontal scrollable theme category filter buttons with active state |
| `discovery-card.tsx` | Set card with 4:3 contained image, add-to-vault button with loading state, title, set#, piece count |
| `discovery-grid.tsx` | Responsive 1/2/3/4 column grid of discovery cards with user's collection context |
| `index.ts` | Barrel export for all explore components |

## Profile Components (`/components/profile`)

Page-specific components for the profile "Digital ID" page:

| Component | Description |
|-----------|-------------|
| `profile-hero.tsx` | Large avatar (size-44) with primary border + glow, verified badge, role pill, follower/following/friends stats row |
| `favorites-grid.tsx` | 4-column grid of favorite set images with grayscale hover effect and gradient overlay |
| `profile-bio.tsx` | Bio text + interest hashtag chips |
| `profile-stats-row.tsx` | 3-card row: Vault Value, Total Parts, Global Rank |
| `milestone-vault.tsx` | 3-column grid of achievement badges with emoji icons + add placeholder |
| `profile-footer.tsx` | Digital Identity UUID + Vault Guide/Privacy Protocol/Support links |
| `stud-pattern-bg.tsx` | Decorative Lego stud radial-gradient background with overlay |
| `index.ts` | Barrel export for all profile components |

## Vault Components (`/components/vault`)

Page-specific components for the vault/collection page:

| Component | Description |
|-----------|-------------|
| `vault-header.tsx` | Header with search input |
| `vault-filters.tsx` | Theme/status/view-mode filter controls with dynamic theme loading |
| `vault-card.tsx` | Set card for vault display with selection checkbox |
| `vault-grid.tsx` | Responsive grid of vault cards |
| `vault-bulk-actions.tsx` | Bottom sticky action bar for bulk operations (wishlist, remove) with loading states |
| `index.ts` | Barrel export for all vault components |

## Auth Components (`/components/auth`)

Authentication form components:

| Component | Description |
|-----------|-------------|
| `login-form.tsx` | Email/password login form with error handling |
| `sign-up-form.tsx` | Registration form with password confirmation |
| `forgot-password-form.tsx` | Password reset request form |
| `update-password-form.tsx` | New password form for reset flow |
| `auth-button.tsx` | Server component showing login/logout based on session |
| `logout-button.tsx` | Client logout button with redirect |
| `index.ts` | Barrel export for all auth components |

## Routes

- `/` - Homepage social feed with stories carousel, posts, trending sets, suggested collectors
- `/explore` - Discovery catalog with real Lego sets, search, theme filtering, sort options (newest/oldest), and add-to-vault functionality
- `/profile` - User Digital ID page with avatar, social stats, favorites grid, bio, vault stats, milestones
- `/vault` - User's Lego collection with search, theme/status filters, grid/list view modes, bulk selection, and remove operations
- `/auth/*` - Authentication pages (no sidebar)

## Adding New Features

**To add a new sidebar page:**
1. Create folder under `app/(app)/your-page/`
2. Add `page.tsx` for the page component
3. Add `actions.ts` for server actions
4. Create `lib/queries/your-page.ts` for data fetching functions
5. Create `components/your-page/` for page-specific components with `index.ts` barrel export
6. Add types to `types/your-page.ts`

**To add a new component to an existing page:**
1. Create the component in the appropriate `components/{page}/` directory
2. Export it from the `index.ts` barrel file
3. Import using `import { Component } from "@/components/{page}"`

## Recent Features

**Vault Page (Latest):**
- Theme filtering with dynamic theme loading from user's collection
- Bulk selection of sets with multi-select capability
- Bulk remove operation with loading states and optimistic UI updates
- Client-side state management via `vault-client.tsx`
- Server actions for all vault CRUD operations (add, remove, update quantity)
- Router refresh pattern for data synchronization after mutations

**Explore Page:**
- Real Lego sets fetched from Supabase `lego_sets` table
- Theme filtering with `themes` table relationship
- Sort by newest/oldest release year
- Add sets directly to vault from explore page
- User collection context to show which sets are already owned
- Search functionality across set names

**Data Patterns:**
- Server components fetch initial data, pass to client components for interactivity
- Client components use `router.refresh()` after mutations to re-fetch server data
- Server actions handle authentication and database operations
- Query functions in `lib/queries/` encapsulate complex joins and transformations
