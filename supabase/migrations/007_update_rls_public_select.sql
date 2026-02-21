-- Update RLS SELECT policies on user_sets and user_favorites
-- to support: activity feed (followed users), public profiles (profile_visible), and own data.
--
-- Fixes CTO audit CRIT-2: public profiles showing empty data
-- Fixes home-dev activity feed returning empty results

-- ============================================================
-- user_sets: replace restrictive "own only" SELECT policy
-- ============================================================

-- Drop the existing restrictive SELECT policy (if it exists)
DROP POLICY IF EXISTS "Users can view own sets" ON user_sets;
DROP POLICY IF EXISTS "Users can read own sets" ON user_sets;
DROP POLICY IF EXISTS "user_sets_select_policy" ON user_sets;

-- New policy: users can read their own sets, sets of people they follow,
-- and sets of users whose profile is publicly visible
CREATE POLICY "Users can view sets"
  ON user_sets FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM follows
      WHERE follows.follower_id = auth.uid()
      AND follows.following_id = user_sets.user_id
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = user_sets.user_id
      AND profiles.profile_visible = true
    )
  );

-- ============================================================
-- user_favorites: replace restrictive "own only" SELECT policy
-- ============================================================

-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view own favorites" ON user_favorites;
DROP POLICY IF EXISTS "Users can read own favorites" ON user_favorites;
DROP POLICY IF EXISTS "user_favorites_select_policy" ON user_favorites;

-- New policy: same logic as user_sets
CREATE POLICY "Users can view favorites"
  ON user_favorites FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM follows
      WHERE follows.follower_id = auth.uid()
      AND follows.following_id = user_favorites.user_id
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = user_favorites.user_id
      AND profiles.profile_visible = true
    )
  );
