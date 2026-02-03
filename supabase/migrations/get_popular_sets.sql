-- Create a function to get sets ordered by popularity (owner count)
-- This performs aggregation at the database level for better performance

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
    -- Search filter (if provided)
    (
      p_search IS NULL
      OR ls.name ILIKE '%' || p_search || '%'
      OR ls.set_num ILIKE '%' || p_search || '%'
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
