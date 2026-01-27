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
- `/auth/*` - Authentication pages (login, sign-up, forgot-password, etc.)
- `/profile` - User profile page with collection display
- Root layout handles theme provider and global styles
- All routes except `/`, `/login`, and `/auth/*` are protected by middleware

**Supabase Integration (`/lib/supabase`)**
- `client.ts` - Browser client for client components
- `server.ts` - Server client for server components/actions
- `proxy.ts` - Middleware proxy handling session cookies and auth redirects

**Components (`/components`)**
- `/ui` - shadcn/ui primitives (button, input, card, etc.)
- `/shared` - Shared layout components (sidebar, mobile header, logo)
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

**Typography:**
- Font family: Inter (via `font-display` utility)
- Weights: 400-800 for various text hierarchy

## Type Definitions (`/types`)

- `profile.ts` - `UserProfile` (id, username, fullName, avatarUrl, bio, isVerified, role, isOnline), `UserStats` (setsCount, piecesCount, rank, rankNumber)
- `lego-set.ts` - `LegoSet` (setNum, name, year, themeId, numParts, setImgUrl, price?), `CollectionTab` type ("collection" | "wishlist")
- `navigation.ts` - `NavItem` (label, href, icon, isActive?)
- `supabase.ts` - Auto-generated Supabase database types

## Mock Data (`/lib/mockdata.ts`)

Development mock data exports:
- `mockUser` - Sample user profile (Legoman, Master Builder role)
- `mockUserStats` - User statistics (setsCount, piecesCount, rank, rankNumber)
- `mockNavItems` - Sidebar navigation items with icons (Home, Explore, My Shelf/Vault, Profile)
- `mockLegoSets` - Array of 6 sample Lego sets with prices

## Layout

- Sidebar is the only component shared between pages
- Each route that uses the sidebar has its own `layout.tsx` that imports `Sidebar` and `MobileHeader` from `@/components/shared`
- Page-specific content (main area, footer) stays in `page.tsx`

## Shared Components (`/components/shared`)

| Component | Description |
|-----------|-------------|
| `legoflex-logo.tsx` | LegoFlex Puzzle icon logo component |
| `sidebar.tsx` | Desktop sidebar with nav items, Post Build CTA, user footer |
| `mobile-header.tsx` | Mobile-only sticky header with logo and hamburger menu |
| `index.ts` | Barrel export for all shared components |

## Profile Components (`/components/profile`)

Page-specific components for the profile page:

| Component | Description |
|-----------|-------------|
| `profile-hero.tsx` | Centered avatar with glow effect, @username, role badge, bio |
| `stats-card.tsx` | 3-column stats card: Sets Owned, Total Bricks, World Rank with trend |
| `collection-tabs.tsx` | My Collection / My Wishlist toggle, sort button, search bar |
| `lego-set-card.tsx` | Set card with cover image, set# overlay badge, title, year/pieces, price |
| `lego-set-grid.tsx` | Responsive 1/2/3 column grid layout for cards |
| `footer.tsx` | Brand footer with copyright and Privacy/Terms/Help links |
| `stud-pattern-bg.tsx` | Decorative Lego stud radial-gradient background with overlay |
| `index.ts` | Barrel export for all profile components |

## Routes

- `/profile` - User profile page with collection/wishlist display (auth required, has `layout.tsx` with sidebar)
