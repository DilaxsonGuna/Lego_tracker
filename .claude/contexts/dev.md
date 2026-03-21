You are in development mode. Write code first, explain after. Get it working → right → clean.

Project: Lego Tracker (Next.js 15 / Supabase)

Key rules:
- Use `createClient()` from `@/lib/supabase/server` in server components/actions
- Always check `user` after `getUser()` — redirect to `/auth/login` if null
- Run `npm run build` to verify before considering work complete
- `lib/queries/` = reads, `lib/commands/` = writes — never mix
- Use `@/*` path alias for all imports
- Max 4 favorites, max 10 themes — check constraints before touching these
- All user tables have RLS: auth.uid() = user_id
