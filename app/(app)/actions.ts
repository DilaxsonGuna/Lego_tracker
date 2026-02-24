"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { toggleFollow as toggleFollowCommand } from "@/lib/commands/follows";
import { getSuggestedUsers } from "@/lib/queries/social";
import { toggleFollowSchema, fetchSuggestedUsersSchema } from "@/lib/schemas";

/**
 * Toggle follow status for a user
 * Returns the new isFollowing state
 */
export async function toggleFollow(userId: string, isCurrentlyFollowing: boolean) {
  const parsed = toggleFollowSchema.safeParse({ userId, isCurrentlyFollowing });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, isFollowing: isCurrentlyFollowing };
  }

  const result = await toggleFollowCommand(parsed.data.userId, parsed.data.isCurrentlyFollowing);

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
  const parsed = fetchSuggestedUsersSchema.safeParse({ limit });
  if (!parsed.success) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  return getSuggestedUsers(user.id, parsed.data.limit);
}
