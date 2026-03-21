-- Index for leaderboard sorting by brick score (descending)
-- Used by: lib/queries/leaderboard.ts, lib/queries/profile.ts (calculateGlobalPosition)
CREATE INDEX IF NOT EXISTS profiles_brick_score_idx
  ON profiles(brick_score DESC)
  WHERE brick_score > 0;

-- Unique index for case-insensitive username lookups
-- Used by: lib/queries/profile.ts (isUsernameAvailable), auth/onboarding
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_idx
  ON profiles(lower(username))
  WHERE username IS NOT NULL;
