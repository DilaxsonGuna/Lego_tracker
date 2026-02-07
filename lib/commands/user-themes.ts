import { createClient } from "@/lib/supabase/server";

const MAX_USER_THEMES = 10;

/**
 * Replace all user's theme preferences (max 10)
 */
export async function setUserThemes(themeIds: number[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Enforce max limit
  const limitedIds = themeIds.slice(0, MAX_USER_THEMES);

  // Delete existing themes
  const { error: deleteError } = await supabase
    .from("user_themes")
    .delete()
    .eq("user_id", user.id);

  if (deleteError) return { error: deleteError.message };

  // Insert new themes with display_order
  if (limitedIds.length > 0) {
    const { error: insertError } = await supabase.from("user_themes").insert(
      limitedIds.map((themeId, index) => ({
        user_id: user.id,
        theme_id: themeId,
        display_order: index,
      }))
    );

    if (insertError) return { error: insertError.message };
  }

  return { success: true };
}

/**
 * Get count of user's theme preferences
 */
export async function getUserThemesCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("user_themes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) return 0;
  return count ?? 0;
}
