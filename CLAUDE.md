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
- `/protected/*` - Routes requiring authentication
- Root layout handles theme provider and global styles

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
