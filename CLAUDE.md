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
  - `profile/page.tsx` - User profile page (`/profile`)
  - `explore/page.tsx` - Discovery catalog with search and theme filtering (`/explore`)
- `/auth/*` - Authentication pages (login, sign-up, forgot-password, etc.) — no sidebar
- Root layout handles theme provider and global styles
- All routes except `/`, `/login`, and `/auth/*` are protected by middleware

**Supabase Integration (`/lib/supabase`)**
- `client.ts` - Browser client for client components
- `server.ts` - Server client for server components/actions
- `proxy.ts` - Middleware proxy handling session cookies and auth redirects

**Components (`/components`)**
- `/ui` - shadcn/ui primitives (button, input, card, etc.)
- `/shared` - Shared layout components (sidebar, mobile header, logo, footer)
- `/home` - Homepage feed-specific components
- `/explore` - Explore/Discovery page components
- `/profile` - Profile page-specific components
- Root level - Auth forms, theme switcher

**Authentication Flow**
- Cookie-based auth via `@supabase/ssr`
- Middleware intercepts requests to manage sessions
- Unauthenticated users redirected to `/auth/login`
- Protected routes check session in server components

## Database Schema (Supabase)

**Tables:**
- `profiles` - Extends Supabase auth.users (id, username, full_name, avatar_url)
- `lego_sets` - Cached set data from Rebrickable API (set_num PK, name, year, theme_id, num_parts, images)
- `user_sets` - Join table tracking user collections (user_id → profiles, set_num → lego_sets, quantity, notes)

**Key Relationships:**
- `user_sets.user_id` → `profiles.id` (cascade delete)
- `user_sets.set_num` → `lego_sets.set_num` (cascade delete)
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

**Typography:**
- Font family: Inter (via `font-display` utility)
- Weights: 400-800 for various text hierarchy

## Type Definitions (`/types`)

- `profile.ts` - `UserProfile` (id, username, fullName, avatarUrl, bio, isVerified, role, isOnline), `UserStats` (setsCount, piecesCount, rank, rankNumber)
- `lego-set.ts` - `LegoSet` (setNum, name, year, themeId, numParts, setImgUrl, price?), `CollectionTab` type ("collection" | "wishlist")
- `navigation.ts` - `NavItem` (label, href, icon, isActive?)
- `feed.ts` - `FeedPost` (id, user, type, actionText, timeAgo, imageUrl, likes, comments, rating?, topComment?), `Story` (id, username, avatarUrl, isAddStory, hasUnviewed), `TrendingSet` (setNum, name, thumbnailUrl, postCount), `SuggestedUser` (id, username, avatarUrl), `PostType` ("build" | "review" | "haul" | "moc")
- `explore.ts` - `ThemeCategory` (id, label), `DiscoverySet` (setNum, name, numParts, setImgUrl, theme)
- `supabase.ts` - Auto-generated Supabase database types

## Mock Data (`/lib/mockdata.ts`)

Development mock data exports:
- `mockUser` - Sample user profile (Legoman, Master Builder role)
- `mockUserStats` - User statistics (setsCount, piecesCount, rank, rankNumber)
- `mockNavItems` - Sidebar navigation items with icons (Home, Explore, My Shelf/Vault, Profile)
- `mockLegoSets` - Array of 6 sample Lego sets with prices
- `mockStories` - Array of 5 story items (1 "Add Build" + 4 user stories, some viewed/unviewed)
- `mockFeedPosts` - Array of 2 feed posts (build addition + review with rating and comment)
- `mockTrendingSets` - Array of 3 trending sets with post counts
- `mockSuggestedUsers` - Array of 2 suggested collectors
- `mockThemeCategories` - Array of 8 theme filter categories (All, Star Wars, Technic, Icons, Ideas, Architecture, Marvel, Harry Potter)
- `mockDiscoverySets` - Array of 8 discovery catalog sets with theme tags

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
| `explore-header.tsx` | Sticky header with "Discovery" title, search input with filter icon, theme chips |
| `theme-chips.tsx` | Horizontal scrollable theme category filter buttons with active state |
| `discovery-card.tsx` | Set card with 4:3 contained image, hover favorite button, title, set#, piece count, add button |
| `discovery-grid.tsx` | Responsive 1/2/3/4 column grid of discovery cards |
| `index.ts` | Barrel export for all explore components |

## Profile Components (`/components/profile`)

Page-specific components for the profile page:

| Component | Description |
|-----------|-------------|
| `profile-hero.tsx` | Centered avatar with glow effect, @username, role badge, bio |
| `stats-card.tsx` | 3-column stats card: Sets Owned, Total Bricks, World Rank with trend |
| `collection-tabs.tsx` | My Collection / My Wishlist toggle, sort button, search bar |
| `lego-set-card.tsx` | Set card with cover image, set# overlay badge, title, year/pieces, price |
| `lego-set-grid.tsx` | Responsive 1/2/3 column grid layout for cards |
| `stud-pattern-bg.tsx` | Decorative Lego stud radial-gradient background with overlay |
| `index.ts` | Barrel export for all profile components (re-exports Footer from shared) |

## Routes

- `/` - Homepage social feed with stories carousel, posts, trending sets, suggested collectors
- `/explore` - Discovery catalog with search, theme filtering, and responsive set grid
- `/profile` - User profile page with collection/wishlist display
- `/auth/*` - Authentication pages (no sidebar)
