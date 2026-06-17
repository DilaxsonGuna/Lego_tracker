import { createClient } from "@/lib/supabase/server";

export async function deleteAccount(): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const userId = user.id;

  // Delete all user data in dependency order.
  // RLS ensures we can only delete our own rows.
  const tables = [
    "notifications",
    "user_favorites",
    "user_themes",
    "follows",
    "user_sets",
    "profiles",
  ] as const;

  for (const table of tables) {
    const column =
      table === "follows" ? "follower_id" : table === "notifications" ? "user_id" : "id";
    const filterColumn = table === "profiles" ? "id" : column === "id" ? "user_id" : column;

    const { error } = await supabase.from(table).delete().eq(filterColumn, userId);

    if (error) {
      console.error(`[deleteAccount] Failed to delete from ${table}:`, error.message);
      return { error: `Failed to delete ${table} data. Please try again.` };
    }
  }

  // Also delete follows where this user is being followed
  await supabase.from("follows").delete().eq("following_id", userId);

  // Also delete notifications where this user is the actor
  await supabase.from("notifications").delete().eq("actor_id", userId);

  // Sign the user out (this invalidates their session)
  const { error: signOutError } = await supabase.auth.signOut();

  if (signOutError) {
    console.error("[deleteAccount] Sign out failed:", signOutError.message);
  }

  return { success: true };
}
