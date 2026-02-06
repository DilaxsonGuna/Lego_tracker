import { createClient } from "@/lib/supabase/server";
import type { FollowCounts, SuggestedUserWithFollowStatus } from "@/types/social";

/**
 * Get the follower and following counts for a user
 */
export async function getFollowCounts(userId: string): Promise<FollowCounts> {
  const supabase = await createClient();

  // Run both count queries in parallel
  const [followersResult, followingResult] = await Promise.all([
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", userId),
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId),
  ]);

  return {
    followers: followersResult.count ?? 0,
    following: followingResult.count ?? 0,
  };
}

/**
 * Get just the follower count for a user
 */
export async function getFollowerCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", userId);

  if (error) return 0;
  return count ?? 0;
}

/**
 * Get just the following count for a user
 */
export async function getFollowingCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId);

  if (error) return 0;
  return count ?? 0;
}

/**
 * Check if a user is following another user
 */
export async function isFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();

  if (error) return false;
  return data !== null;
}

/**
 * Get a list of user IDs that the current user is following
 */
export async function getFollowingIds(userId: string): Promise<Set<string>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);

  if (error || !data) return new Set();
  return new Set(data.map((row) => row.following_id));
}

/**
 * Get suggested users to follow (users the current user is not following)
 */
export async function getSuggestedUsers(
  currentUserId: string,
  limit: number = 5
): Promise<SuggestedUserWithFollowStatus[]> {
  const supabase = await createClient();

  // Get users the current user is already following
  const followingIds = await getFollowingIds(currentUserId);

  // Fetch profiles excluding the current user
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .neq("id", currentUserId)
    .limit(limit + followingIds.size); // Fetch extra to account for filtering

  if (error || !data) return [];

  // Filter out users already being followed and map to the expected type
  const suggestedUsers: SuggestedUserWithFollowStatus[] = [];

  for (const profile of data) {
    if (suggestedUsers.length >= limit) break;

    const isAlreadyFollowing = followingIds.has(profile.id);

    // Include user - they can appear with isFollowing: true if already followed
    suggestedUsers.push({
      id: profile.id,
      username: profile.username ?? "Anonymous",
      avatarUrl: profile.avatar_url ?? "",
      isFollowing: isAlreadyFollowing,
    });
  }

  return suggestedUsers;
}

/**
 * Get mutual friends count (users that both follow each other)
 */
export async function getMutualFollowsCount(userId: string): Promise<number> {
  const supabase = await createClient();

  // Get users this person follows
  const { data: following } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);

  if (!following || following.length === 0) return 0;

  const followingIds = following.map((f) => f.following_id);

  // Count how many of those users follow back
  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", userId)
    .in("follower_id", followingIds);

  if (error) return 0;
  return count ?? 0;
}
