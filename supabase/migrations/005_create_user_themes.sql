-- Create user_themes table for storing theme preferences (max 10 per user)
CREATE TABLE user_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  theme_id INTEGER NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_themes_user_theme_unique UNIQUE (user_id, theme_id)
);

-- Create index for faster lookups by user_id
CREATE INDEX user_themes_user_id_idx ON user_themes(user_id);

-- Enable Row Level Security
ALTER TABLE user_themes ENABLE ROW LEVEL SECURITY;

-- Users can view their own theme preferences
CREATE POLICY "Users can view own themes"
  ON user_themes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own theme preferences
CREATE POLICY "Users can insert own themes"
  ON user_themes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own theme preferences
CREATE POLICY "Users can update own themes"
  ON user_themes FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own theme preferences
CREATE POLICY "Users can delete own themes"
  ON user_themes FOR DELETE
  USING (auth.uid() = user_id);
