-- Additional indexes for query performance

-- user_sets indexes
CREATE INDEX IF NOT EXISTS user_sets_user_id_idx ON user_sets(user_id);
CREATE INDEX IF NOT EXISTS user_sets_user_id_collection_type_idx ON user_sets(user_id, collection_type);

-- user_favorites index (already created in 001 but included for completeness)
-- CREATE INDEX IF NOT EXISTS user_favorites_user_id_idx ON user_favorites(user_id);

-- user_themes index (already created in 005 but included for completeness)
-- CREATE INDEX IF NOT EXISTS user_themes_user_id_idx ON user_themes(user_id);

-- follows indexes (already created in 002 but included for completeness)
-- CREATE INDEX IF NOT EXISTS follows_follower_id_idx ON follows(follower_id);
-- CREATE INDEX IF NOT EXISTS follows_following_id_idx ON follows(following_id);

-- lego_sets theme lookup
CREATE INDEX IF NOT EXISTS lego_sets_theme_id_idx ON lego_sets(theme_id);

-- CHECK constraint on collection_type
ALTER TABLE user_sets
  ADD CONSTRAINT user_sets_collection_type_check
  CHECK (collection_type IN ('collection', 'wishlist'));

-- Trigger function: enforce max 4 favorites per user
CREATE OR REPLACE FUNCTION check_max_favorites()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM user_favorites WHERE user_id = NEW.user_id) >= 4 THEN
    RAISE EXCEPTION 'Maximum 4 favorites allowed per user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_max_favorites
  BEFORE INSERT ON user_favorites
  FOR EACH ROW
  EXECUTE FUNCTION check_max_favorites();

-- Trigger function: enforce max 10 themes per user
CREATE OR REPLACE FUNCTION check_max_themes()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM user_themes WHERE user_id = NEW.user_id) >= 10 THEN
    RAISE EXCEPTION 'Maximum 10 theme preferences allowed per user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_max_themes
  BEFORE INSERT ON user_themes
  FOR EACH ROW
  EXECUTE FUNCTION check_max_themes();
