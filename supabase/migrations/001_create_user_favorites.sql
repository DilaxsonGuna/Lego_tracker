-- Create user_favorites table for storing up to 4 favorite sets per user
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  set_num TEXT NOT NULL REFERENCES lego_sets(set_num) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_favorites_user_set_unique UNIQUE (user_id, set_num)
);

-- Create index for faster lookups by user_id
CREATE INDEX user_favorites_user_id_idx ON user_favorites(user_id);

-- Create index for faster lookups by created_at (for ordering)
CREATE INDEX user_favorites_created_at_idx ON user_favorites(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites"
  ON user_favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own favorites
CREATE POLICY "Users can insert own favorites"
  ON user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites"
  ON user_favorites FOR DELETE
  USING (auth.uid() = user_id);
