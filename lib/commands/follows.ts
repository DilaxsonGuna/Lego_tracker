"use server";

import { createClient } from "@/lib/supabase/server";
import { createNotification } from "@/lib/commands/notifications";

/**
 * Follow a user
 */
export async function followUser(followingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Prevent self-follow (also enforced by DB constraint)
  if (user.id === followingId) return { error: "Cannot follow yourself" };

  const { error } = await supabase.from("follows").insert({
    follower_id: user.id,
    following_id: followingId,
  });

  if (error) {
    // Handle unique constraint violation (already following)
    if (error.code === "23505") {
      return { error: "Already following this user" };
    }
    return { error: error.message };
  }

  // Send a follow notification to the target user
  await createNotification({
    userId: followingId,
    type: "follow",
    actorId: user.id,
  });

  return { success: true };
}

/**
 * Unfollow a user
 */
export async function unfollowUser(followingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", followingId);

  if (error) return { error: error.message };

  return { success: true };
}

/**
 * Toggle follow status for a user
 */
export async function toggleFollow(followingId: string, isCurrentlyFollowing: boolean) {
  if (isCurrentlyFollowing) {
    return unfollowUser(followingId);
  } else {
    return followUser(followingId);
  }
}
