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
- Root level - Auth forms, theme switcher, layout components

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

The application uses a custom design system based on the BrickBox theme with Lego yellow as the primary accent color.

**Design Tokens (CSS Variables in `globals.css`):**
- Primary: `#ffd000` (Lego yellow) - used for accents, buttons, highlights
- Background: Light `#f8f8f5` / Dark `#212121`
- Card/Surface: Light `#ffffff` / Dark `#2c2c2c`
- Border radius: `0.75rem` (12px) default

**Typography:**
- Font family: Inter (via `font-display` utility)
- Weights: 400-800 for various text hierarchy

## Type Definitions (`/types`)

- `profile.ts` - `UserProfile`, `UserStats` interfaces
- `lego-set.ts` - `LegoSet`, `ThemeFilter` interfaces
- `navigation.ts` - `NavItem` interface
- `supabase.ts` - Auto-generated Supabase database types

## Mock Data (`/lib/mockdata.ts`)

Development mock data exports:
- `mockUser` - Sample user profile (BrickMaster99)
- `mockUserStats` - User statistics (sets, pieces, rank)
- `mockNavItems` - Navigation menu items
- `mockLegoSets` - Array of 6 sample Lego sets
- `mockThemeFilters` - Theme filter options

## Profile Components (`/components/profile`)

Compound components for the profile page:

| Component | Description |
|-----------|-------------|
| `header.tsx` | Top navigation with logo, nav links, notification bell, avatar |
| `profile-header.tsx` | User avatar, name, bio, verified badge, stats, follow button |
| `stats-bar.tsx` | Sets/Pieces/Rank display with highlight styling |
| `search-filter-bar.tsx` | Search input + theme filter chips |
| `filter-chip.tsx` | Individual filter chip button (active/inactive states) |
| `lego-set-card.tsx` | Card with image, favorite button, piece count, metadata |
| `lego-set-grid.tsx` | Responsive grid layout for cards |
| `brickbox-logo.tsx` | BrickBox SVG logo component |
| `index.ts` | Barrel export for all components |

## Routes

- `/profile` - User profile page with collection display (auth required)
