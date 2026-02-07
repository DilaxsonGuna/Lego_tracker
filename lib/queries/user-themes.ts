import { createClient } from "@/lib/supabase/server";
import type { ThemeCategory } from "@/types/explore";

/**
 * Get user's theme preferences with names, ordered by display_order
 */
export async function getUserThemes(userId: string): Promise<ThemeCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_themes")
    .select("theme_id, display_order, themes(id, name)")
    .eq("user_id", userId)
    .order("display_order", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.theme_id,
    label: (row.themes as unknown as { id: number; name: string })?.name ?? "",
  }));
}

/**
 * Get just the theme IDs for a user (useful for forms)
 */
export async function getUserThemeIds(userId: string): Promise<number[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_themes")
    .select("theme_id")
    .eq("user_id", userId)
    .order("display_order", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => row.theme_id);
}

/**
 * Get the most popular themes based on user selections, limited to top N
 */
export async function getPopularThemes(limit: number = 10): Promise<ThemeCategory[]> {
  const supabase = await createClient();

  // Get theme IDs ordered by popularity (count of users who selected them)
  const { data: popularData, error: popularError } = await supabase
    .from("user_themes")
    .select("theme_id, themes(id, name)")
    .order("theme_id");

  if (popularError || !popularData) {
    // Fallback to featured themes if no user data
    return getFallbackPopularThemes(limit);
  }

  // Count occurrences and deduplicate
  const themeCountMap = new Map<number, { count: number; name: string }>();
  for (const row of popularData) {
    const themeId = row.theme_id;
    const themeName = (row.themes as unknown as { id: number; name: string })?.name ?? "";
    const existing = themeCountMap.get(themeId);
    if (existing) {
      existing.count++;
    } else {
      themeCountMap.set(themeId, { count: 1, name: themeName });
    }
  }

  // Sort by count descending and take top N
  const sorted = [...themeCountMap.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit);

  if (sorted.length < limit) {
    // Not enough user data, supplement with fallback
    return getFallbackPopularThemes(limit);
  }

  return sorted.map(([id, { name }]) => ({ id, label: name }));
}

async function getFallbackPopularThemes(limit: number): Promise<ThemeCategory[]> {
  const supabase = await createClient();

  // Use a curated list of popular themes
  const POPULAR_THEME_NAMES = [
    "Star Wars",
    "Technic",
    "City",
    "NINJAGO",
    "Creator Expert",
    "Icons",
    "Harry Potter",
    "Marvel Super Heroes",
    "Architecture",
    "Ideas",
    "Speed Champions",
    "Disney",
  ];

  const { data, error } = await supabase
    .from("themes")
    .select("id, name")
    .in("name", POPULAR_THEME_NAMES)
    .is("parent_id", null);

  if (error || !data) return [];

  // Sort by the order defined in POPULAR_THEME_NAMES and limit
  const sorted = POPULAR_THEME_NAMES
    .map((name) => data.find((t) => t.name === name))
    .filter((t): t is { id: number; name: string } => t !== undefined)
    .slice(0, limit);

  return sorted.map((theme) => ({ id: theme.id, label: theme.name }));
}
