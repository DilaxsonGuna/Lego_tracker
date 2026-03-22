-- Performance improvements for follows queries:
-- 1. Compound indexes for cursor-based pagination
-- 2. Denormalized follower/following counts on profiles
-- 3. Trigger to keep counts in sync on INSERT/DELETE

-- ============================================================
-- 1. Compound indexes for cursor-based pagination
-- ============================================================

-- For fetching a user's followers (ordered by follow date)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_follows_following_cursor
  ON follows (following_id, created_at DESC, id DESC);

-- For fetching who a user follows (ordered by follow date)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_follows_follower_cursor
  ON follows (follower_id, created_at DESC, id DESC);

-- ============================================================
-- 2. Denormalized count columns on profiles
-- ============================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS follower_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0;

-- Backfill existing counts
UPDATE profiles p
SET follower_count = (
  SELECT COUNT(*) FROM follows f WHERE f.following_id = p.id
);

UPDATE profiles p
SET following_count = (
  SELECT COUNT(*) FROM follows f WHERE f.follower_id = p.id
);

-- ============================================================
-- 3. Trigger to maintain counts on follows INSERT/DELETE
-- ============================================================

CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment following_count for the follower
    UPDATE profiles SET following_count = following_count + 1
    WHERE id = NEW.follower_id;
    -- Increment follower_count for the user being followed
    UPDATE profiles SET follower_count = follower_count + 1
    WHERE id = NEW.following_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement following_count for the follower
    UPDATE profiles SET following_count = GREATEST(following_count - 1, 0)
    WHERE id = OLD.follower_id;
    -- Decrement follower_count for the user being unfollowed
    UPDATE profiles SET follower_count = GREATEST(follower_count - 1, 0)
    WHERE id = OLD.following_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER follows_count_trigger
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW
  EXECUTE FUNCTION update_follow_counts();
