---
description: Scaffold a new sidebar page with all required files following project conventions
---

Create a new sidebar page. The user will provide the page name/purpose.

## Steps

1. **Create folder** in `app/(app)/{page-name}/`
2. **Create `page.tsx`** — server component that fetches data and passes to client components
3. **Create `actions.ts`** — server actions for mutations, importing from `lib/commands/` and `lib/queries/`
4. **Create `lib/queries/{page-name}.ts`** — read operations using `createClient()` from `@/lib/supabase/server`
5. **Create `lib/commands/{page-name}.ts`** — write operations with error handling (if the page has mutations)
6. **Create `components/{page-name}/`** directory with:
   - Page-specific components
   - `index.ts` barrel export
7. **Create `types/{page-name}.ts`** — TypeScript type definitions for the domain

## Conventions

- Use `@/*` path alias for all imports
- Server components fetch data, client components handle interactivity
- Client components call server actions then `router.refresh()`
- Use shadcn/ui primitives from `components/ui/`
- Use `sonner` for toast notifications
- Follow BrickBox theme tokens from `agent_docs/design-system.md`
