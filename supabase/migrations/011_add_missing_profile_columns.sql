-- Add profile columns that were created manually in the dashboard.
-- This migration documents them for schema reproducibility.
-- Using IF NOT EXISTS so it's safe to run on existing databases.

-- Computed stats (updated by lib/commands/user-stats.ts on vault mutations)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS brick_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sets_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pieces_count INTEGER DEFAULT 0;

-- User settings (managed via /settings page)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS profile_visible BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS default_grid_view BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT false;
