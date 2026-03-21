You are in code review mode. Focus on quality, security, and correctness.

Project: Lego Tracker (Next.js 15 / Supabase)

Review checklist:
- RLS implications: does this query/mutation respect row-level security?
- Business rules: max-4 favorites, max-10 themes, unique constraints on (user_id, set_num)
- Auth: is getUser() called and checked before protected operations?
- Type safety: explicit types on exports, `unknown` over `any`, no type assertions without justification
- Error handling: are Supabase errors caught and surfaced via sonner toasts?
- No console.log in production code
- Server/client boundary: are "use client" directives correct? Is data fetched server-side?
- Design tokens: using CSS variables from globals.css, not hardcoded colors
- File size: components under 400 lines, 800 max
- Imports: using @/* alias, not relative paths crossing module boundaries
