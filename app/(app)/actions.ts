"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { toggleFollow as toggleFollowCommand } from "@/lib/commands/follows";
import { getSuggestedUsers } from "@/lib/queries/social";

/**
 * Toggle follow status for a user
 * Returns the new isFollowing state
 */
export async function toggleFollow(userId: string, isCurrentlyFollowing: boolean) {
  const result = await toggleFollowCommand(userId, isCurrentlyFollowing);

  if ("error" in result) {
    return { error: result.error, isFollowing: isCurrentlyFollowing };
  }

  // Revalidate pages that display follow data
  revalidatePath("/");
  revalidatePath("/profile");

  return { success: true, isFollowing: !isCurrentlyFollowing };
}

/**
 * Fetch suggested users for the current user
 */
export async function fetchSuggestedUsers(limit: number = 5) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  return getSuggestedUsers(user.id, limit);
}
