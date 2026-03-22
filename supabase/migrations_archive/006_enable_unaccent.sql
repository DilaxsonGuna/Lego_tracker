-- Enable unaccent extension for accent-insensitive search
-- This allows searching "pokemon" to find "Pokémon"
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Update get_popular_sets function to use unaccent for accent-insensitive search
CREATE OR REPLACE FUNCTION get_popular_sets(
  p_offset INTEGER DEFAULT 0,
  p_limit INTEGER DEFAULT 50,
  p_search TEXT DEFAULT NULL,
  p_theme_ids INTEGER[] DEFAULT NULL
)
RETURNS TABLE (
  set_num TEXT,
  name TEXT,
  year INTEGER,
  num_parts INTEGER,
  img_url TEXT,
  theme_name TEXT,
  owner_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ls.set_num,
    ls.name,
    ls.year,
    ls.num_parts,
    ls.img_url,
    t.name as theme_name,
    COUNT(DISTINCT us.user_id) as owner_count
  FROM lego_sets ls
  LEFT JOIN themes t ON ls.theme_id = t.id
  LEFT JOIN user_sets us ON ls.set_num = us.set_num
  WHERE
    -- Search filter with accent-insensitive matching
    (
      p_search IS NULL
      OR unaccent(lower(ls.name)) ILIKE '%' || unaccent(lower(p_search)) || '%'
      OR ls.set_num ILIKE '%' || p_search || '%'
      OR unaccent(lower(t.name)) ILIKE '%' || unaccent(lower(p_search)) || '%'
    )
    -- Theme filter (if provided)
    AND (
      p_theme_ids IS NULL
      OR ls.theme_id = ANY(p_theme_ids)
    )
  GROUP BY ls.set_num, ls.name, ls.year, ls.num_parts, ls.img_url, t.name
  ORDER BY owner_count DESC, ls.year DESC NULLS LAST
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_popular_sets TO authenticated;
GRANT EXECUTE ON FUNCTION get_popular_sets TO anon;

-- Create function for searching sets with date-based ordering (newest/oldest)
-- Uses unaccent for accent-insensitive search
CREATE OR REPLACE FUNCTION search_sets(
  p_offset INTEGER DEFAULT 0,
  p_limit INTEGER DEFAULT 50,
  p_search TEXT DEFAULT NULL,
  p_theme_ids INTEGER[] DEFAULT NULL,
  p_order_ascending BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
  set_num TEXT,
  name TEXT,
  year INTEGER,
  num_parts INTEGER,
  img_url TEXT,
  theme_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ls.set_num,
    ls.name,
    ls.year,
    ls.num_parts,
    ls.img_url,
    t.name as theme_name
  FROM lego_sets ls
  LEFT JOIN themes t ON ls.theme_id = t.id
  WHERE
    -- Search filter with accent-insensitive matching
    (
      p_search IS NULL
      OR unaccent(lower(ls.name)) ILIKE '%' || unaccent(lower(p_search)) || '%'
      OR ls.set_num ILIKE '%' || p_search || '%'
      OR unaccent(lower(t.name)) ILIKE '%' || unaccent(lower(p_search)) || '%'
    )
    -- Theme filter (if provided)
    AND (
      p_theme_ids IS NULL
      OR ls.theme_id = ANY(p_theme_ids)
    )
  ORDER BY
    CASE WHEN p_order_ascending THEN ls.year END ASC NULLS FIRST,
    CASE WHEN NOT p_order_ascending THEN ls.year END DESC NULLS LAST,
    ls.set_num ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION search_sets TO authenticated;
GRANT EXECUTE ON FUNCTION search_sets TO anon;
