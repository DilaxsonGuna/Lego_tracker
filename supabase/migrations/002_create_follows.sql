-- Create follows table for the social follow system
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  -- Prevent self-follows
  CONSTRAINT follows_no_self_follow CHECK (follower_id != following_id),
  -- Prevent duplicate follows
  CONSTRAINT follows_unique UNIQUE (follower_id, following_id)
);

-- Create indexes for efficient queries
-- Index for looking up who a user follows
CREATE INDEX follows_follower_id_idx ON follows(follower_id);

-- Index for looking up a user's followers
CREATE INDEX follows_following_id_idx ON follows(following_id);

-- Composite index for checking if a specific follow relationship exists
CREATE INDEX follows_relationship_idx ON follows(follower_id, following_id);

-- Enable Row Level Security
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Everyone can view follow relationships (for displaying follower/following counts)
CREATE POLICY "Anyone can view follow relationships"
  ON follows FOR SELECT
  USING (true);

-- Users can only create follows where they are the follower
CREATE POLICY "Users can follow others"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Users can only delete their own follows (unfollow)
CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);
