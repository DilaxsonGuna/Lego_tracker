---
description: Create a new Supabase migration with proper conventions and RLS
---

Create a new Supabase migration. Follow these steps:

1. **Read** `agent_docs/database.md` to understand the current schema, relationships, and RLS patterns
2. **Create** the migration file in `supabase/migrations/` following the naming pattern: `YYYYMMDDHHMMSS_description.sql`
3. **Include**:
   - Table/column definitions with proper types
   - Foreign key relationships referencing existing tables
   - RLS policies matching the project pattern: users can only CRUD their own records
   - `enable row level security` on new tables
   - Indexes for frequently queried columns
4. **Update** `agent_docs/database.md` with the new schema additions
5. **Generate** TypeScript types if needed by updating `types/` files

Reference the existing RLS pattern: `auth.uid() = user_id` for all user-scoped tables.
