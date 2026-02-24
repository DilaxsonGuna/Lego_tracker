import { createClient } from "@/lib/supabase/server";
import type { FollowCounts, FollowListUser, SuggestedUserWithFollowStatus } from "@/types/social";

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
 * Get the list of users who follow a given user, with profile data
 * and whether the current user follows them back.
 */
export async function getFollowers(
  userId: string,
  currentUserId: string | null
): Promise<FollowListUser[]> {
  const supabase = await createClient();

  // Get followers with their profile data
  const { data, error } = await supabase
    .from("follows")
    .select("follower_id, profiles!follows_follower_id_fkey(id, username, full_name, avatar_url)")
    .eq("following_id", userId);

  if (error || !data) return [];

  // If there's a current user, check which of these followers they follow
  let currentUserFollowingIds = new Set<string>();
  if (currentUserId) {
    currentUserFollowingIds = await getFollowingIds(currentUserId);
  }

  return data.map((row) => {
    const profile = row.profiles as unknown as {
      id: string;
      username: string | null;
      full_name: string | null;
      avatar_url: string | null;
    };
    return {
      id: profile.id,
      username: profile.username ?? "Anonymous",
      displayName: profile.full_name,
      avatarUrl: profile.avatar_url,
      isFollowedByCurrentUser:
        currentUserId !== null && currentUserFollowingIds.has(profile.id),
    };
  });
}

/**
 * Get the list of users a given user follows, with profile data
 * and whether the current user follows them too.
 */
export async function getFollowing(
  userId: string,
  currentUserId: string | null
): Promise<FollowListUser[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("follows")
    .select("following_id, profiles!follows_following_id_fkey(id, username, full_name, avatar_url)")
    .eq("follower_id", userId);

  if (error || !data) return [];

  let currentUserFollowingIds = new Set<string>();
  if (currentUserId) {
    currentUserFollowingIds = await getFollowingIds(currentUserId);
  }

  return data.map((row) => {
    const profile = row.profiles as unknown as {
      id: string;
      username: string | null;
      full_name: string | null;
      avatar_url: string | null;
    };
    return {
      id: profile.id,
      username: profile.username ?? "Anonymous",
      displayName: profile.full_name,
      avatarUrl: profile.avatar_url,
      isFollowedByCurrentUser:
        currentUserId !== null && currentUserFollowingIds.has(profile.id),
    };
  });
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
