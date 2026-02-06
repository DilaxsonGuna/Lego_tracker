import { createClient } from "@/lib/supabase/server";

/**
 * Add a set to user's favorites
 */
export async function addUserFavorite(setNum: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("user_favorites").insert({
    user_id: user.id,
    set_num: setNum,
  });

  if (error) return { error: error.message };
  return { success: true };
}

/**
 * Remove a set from user's favorites
 */
export async function removeUserFavorite(setNum: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("set_num", setNum);

  if (error) return { error: error.message };
  return { success: true };
}

/**
 * Get all favorited set numbers for a user as a Set
 */
export async function getUserFavoriteSetNums(userId: string): Promise<Set<string>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_favorites")
    .select("set_num")
    .eq("user_id", userId);

  if (error || !data) return new Set();

  return new Set(data.map((row) => row.set_num));
}

/**
 * Get count of user's favorites for validation
 */
export async function getUserFavoritesCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("user_favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) return 0;
  return count ?? 0;
}
