import { createClient } from "@/lib/supabase/server";
import type {
  FollowCounts,
  FollowListCursor,
  FollowListUser,
  PaginatedFollowList,
  SuggestedUserWithFollowStatus,
} from "@/types/social";

const FOLLOW_LIST_PAGE_SIZE = 20;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

function validateCursor(cursor: FollowListCursor): void {
  if (!UUID_RE.test(cursor.id)) throw new Error("Invalid cursor id");
  if (!ISO_DATE_RE.test(cursor.createdAt)) throw new Error("Invalid cursor createdAt");
}

/**
 * Get the follower and following counts for a user.
 * Uses denormalized columns on profiles (maintained by trigger).
 */
export async function getFollowCounts(userId: string): Promise<FollowCounts> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("follower_count, following_count")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return { followers: 0, following: 0 };
  }

  return {
    followers: data.follower_count ?? 0,
    following: data.following_count ?? 0,
  };
}

/**
 * Get just the follower count for a user.
 * Uses denormalized column on profiles (maintained by trigger).
 */
export async function getFollowerCount(userId: string): Promise<number> {
  const counts = await getFollowCounts(userId);
  return counts.followers;
}

/**
 * Get just the following count for a user.
 * Uses denormalized column on profiles (maintained by trigger).
 */
export async function getFollowingCount(userId: string): Promise<number> {
  const counts = await getFollowCounts(userId);
  return counts.following;
}

/**
 * Check if a user is following another user
 */
export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
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
      isFollowedByCurrentUser: currentUserId !== null && currentUserFollowingIds.has(profile.id),
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
      isFollowedByCurrentUser: currentUserId !== null && currentUserFollowingIds.has(profile.id),
    };
  });
}

/**
 * Get a paginated list of followers with cursor-based pagination.
 */
export async function getFollowersPaginated(
  userId: string,
  currentUserId: string | null,
  cursor: FollowListCursor | null = null
): Promise<PaginatedFollowList> {
  const supabase = await createClient();

  let query = supabase
    .from("follows")
    .select(
      "id, created_at, follower_id, profiles!follows_follower_id_fkey(id, username, full_name, avatar_url)"
    )
    .eq("following_id", userId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(FOLLOW_LIST_PAGE_SIZE + 1);

  if (cursor) {
    validateCursor(cursor);
    query = query.or(
      `created_at.lt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.lt.${cursor.id})`
    );
  }

  const [result, currentUserFollowingIds] = await Promise.all([
    query,
    currentUserId ? getFollowingIds(currentUserId) : Promise.resolve(new Set<string>()),
  ]);

  if (result.error || !result.data) {
    return { users: [], nextCursor: null, hasMore: false };
  }

  const hasMore = result.data.length > FOLLOW_LIST_PAGE_SIZE;
  const pageData = hasMore ? result.data.slice(0, FOLLOW_LIST_PAGE_SIZE) : result.data;

  const users: FollowListUser[] = pageData.map((row) => {
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
      isFollowedByCurrentUser: currentUserId !== null && currentUserFollowingIds.has(profile.id),
    };
  });

  const lastRow = pageData[pageData.length - 1];
  const nextCursor: FollowListCursor | null =
    hasMore && lastRow ? { createdAt: lastRow.created_at!, id: lastRow.id } : null;

  return { users, nextCursor, hasMore };
}

/**
 * Get a paginated list of following with cursor-based pagination.
 */
export async function getFollowingPaginated(
  userId: string,
  currentUserId: string | null,
  cursor: FollowListCursor | null = null
): Promise<PaginatedFollowList> {
  const supabase = await createClient();

  let query = supabase
    .from("follows")
    .select(
      "id, created_at, following_id, profiles!follows_following_id_fkey(id, username, full_name, avatar_url)"
    )
    .eq("follower_id", userId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(FOLLOW_LIST_PAGE_SIZE + 1);

  if (cursor) {
    validateCursor(cursor);
    query = query.or(
      `created_at.lt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.lt.${cursor.id})`
    );
  }

  const [result, currentUserFollowingIds] = await Promise.all([
    query,
    currentUserId ? getFollowingIds(currentUserId) : Promise.resolve(new Set<string>()),
  ]);

  if (result.error || !result.data) {
    return { users: [], nextCursor: null, hasMore: false };
  }

  const hasMore = result.data.length > FOLLOW_LIST_PAGE_SIZE;
  const pageData = hasMore ? result.data.slice(0, FOLLOW_LIST_PAGE_SIZE) : result.data;

  const users: FollowListUser[] = pageData.map((row) => {
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
      isFollowedByCurrentUser: currentUserId !== null && currentUserFollowingIds.has(profile.id),
    };
  });

  const lastRow = pageData[pageData.length - 1];
  const nextCursor: FollowListCursor | null =
    hasMore && lastRow ? { createdAt: lastRow.created_at!, id: lastRow.id } : null;

  return { users, nextCursor, hasMore };
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
 * Get suggested users to follow using friends-of-friends + shared theme overlap.
 * Scores candidates by: (mutual follows * 3) + (shared themes * 2) + 1 (base).
 * Falls back to random profiles if no social signal exists.
 */
export async function getSuggestedUsers(
  currentUserId: string,
  limit: number = 5
): Promise<SuggestedUserWithFollowStatus[]> {
  const supabase = await createClient();

  // Get current user's following list and themes in parallel
  const [followingIds, currentUserThemes] = await Promise.all([
    getFollowingIds(currentUserId),
    supabase.from("user_themes").select("theme_id").eq("user_id", currentUserId),
  ]);

  const currentThemeIds = new Set((currentUserThemes.data ?? []).map((t) => t.theme_id));

  // Get friends-of-friends: users followed by people the current user follows
  const friendsOfFriendsScores = new Map<string, number>();

  if (followingIds.size > 0) {
    const { data: fofData } = await supabase
      .from("follows")
      .select("following_id")
      .in("follower_id", [...followingIds])
      .neq("following_id", currentUserId)
      .limit(500);

    for (const row of fofData ?? []) {
      if (!followingIds.has(row.following_id)) {
        friendsOfFriendsScores.set(
          row.following_id,
          (friendsOfFriendsScores.get(row.following_id) ?? 0) + 3
        );
      }
    }
  }

  // Get candidate user IDs (friends-of-friends + some random profiles)
  const candidateIds = new Set(friendsOfFriendsScores.keys());

  // Fetch random profiles as fallback if not enough candidates
  if (candidateIds.size < limit * 2) {
    const { data: randomProfiles } = await supabase
      .from("profiles")
      .select("id")
      .neq("id", currentUserId)
      .limit(limit * 3);

    for (const p of randomProfiles ?? []) {
      if (!followingIds.has(p.id)) {
        candidateIds.add(p.id);
      }
    }
  }

  if (candidateIds.size === 0) return [];

  // Fetch profiles and theme data for candidates
  const candidateArray = [...candidateIds].slice(0, 50);
  const [profilesResult, themesResult] = await Promise.all([
    supabase.from("profiles").select("id, username, avatar_url").in("id", candidateArray),
    currentThemeIds.size > 0
      ? supabase.from("user_themes").select("user_id, theme_id").in("user_id", candidateArray)
      : Promise.resolve({ data: [] as Array<{ user_id: string; theme_id: number }> }),
  ]);

  if (!profilesResult.data) return [];

  // Count shared themes per candidate
  const themeOverlapScores = new Map<string, number>();
  for (const row of themesResult.data ?? []) {
    if (currentThemeIds.has(row.theme_id)) {
      themeOverlapScores.set(row.user_id, (themeOverlapScores.get(row.user_id) ?? 0) + 2);
    }
  }

  // Score and sort candidates
  const scored = profilesResult.data.map((profile) => ({
    id: profile.id,
    username: profile.username ?? "Anonymous",
    avatarUrl: profile.avatar_url ?? "",
    isFollowing: false,
    score:
      (friendsOfFriendsScores.get(profile.id) ?? 0) + (themeOverlapScores.get(profile.id) ?? 0) + 1,
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ score: _score, ...user }) => user);
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

/**
 * Get mutual followers between the current user and a target user.
 * Returns users that the current user follows who also follow the target user.
 */
export async function getMutualFollowers(
  currentUserId: string,
  targetUserId: string,
  limit: number = 3
): Promise<{
  users: Array<{ id: string; username: string; avatarUrl: string | null }>;
  totalCount: number;
}> {
  const supabase = await createClient();

  // Get IDs the current user follows (bounded to 1000)
  const { data: currentFollowing } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", currentUserId)
    .limit(1000);

  if (!currentFollowing || currentFollowing.length === 0) {
    return { users: [], totalCount: 0 };
  }

  const followingArray = currentFollowing
    .map((f) => f.following_id)
    .filter((id) => id !== currentUserId);

  // Server-side intersection: followers of target who are also followed by current user
  const [countResult, displayResult] = await Promise.all([
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", targetUserId)
      .in("follower_id", followingArray),
    supabase
      .from("follows")
      .select("follower_id, profiles!follows_follower_id_fkey(id, username, avatar_url)")
      .eq("following_id", targetUserId)
      .in("follower_id", followingArray)
      .limit(limit),
  ]);

  const totalCount = countResult.count ?? 0;
  if (totalCount === 0) return { users: [], totalCount: 0 };

  const users = (displayResult.data ?? []).map((row) => {
    const profile = row.profiles as unknown as {
      id: string;
      username: string | null;
      avatar_url: string | null;
    };
    return {
      id: profile.id,
      username: profile.username ?? "Anonymous",
      avatarUrl: profile.avatar_url,
    };
  });

  return { users, totalCount };
}

/**
 * Get collection overlap between two users.
 * Returns shared set count and Jaccard similarity score.
 */
export async function getCollectionOverlap(
  userAId: string,
  userBId: string
): Promise<{ sharedCount: number; similarity: number }> {
  const supabase = await createClient();
  const MAX_SETS = 2000;

  // Fetch both users' collection set_nums in parallel (bounded)
  const [resultA, resultB] = await Promise.all([
    supabase
      .from("user_sets")
      .select("set_num")
      .eq("user_id", userAId)
      .eq("collection_type", "collection")
      .limit(MAX_SETS),
    supabase
      .from("user_sets")
      .select("set_num")
      .eq("user_id", userBId)
      .eq("collection_type", "collection")
      .limit(MAX_SETS),
  ]);

  if (!resultA.data || !resultB.data) return { sharedCount: 0, similarity: 0 };

  const setsA = new Set(resultA.data.map((r) => r.set_num));
  const setsB = new Set(resultB.data.map((r) => r.set_num));

  if (setsA.size === 0 || setsB.size === 0) return { sharedCount: 0, similarity: 0 };

  let sharedCount = 0;
  for (const setNum of setsA) {
    if (setsB.has(setNum)) sharedCount++;
  }

  const unionSize = setsA.size + setsB.size - sharedCount;
  const similarity = unionSize > 0 ? sharedCount / unionSize : 0;

  return { sharedCount, similarity };
}

/**
 * Get how many users the current user follows who own a specific set.
 * Returns count and up to `limit` usernames for display.
 */
export async function getFollowersWhoOwnSet(
  currentUserId: string,
  setNum: string,
  limit: number = 3
): Promise<{ users: Array<{ username: string }>; totalCount: number }> {
  const supabase = await createClient();

  // Get IDs the current user follows (bounded)
  const { data: following } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", currentUserId)
    .limit(1000);

  if (!following || following.length === 0) return { users: [], totalCount: 0 };

  const followingArray = following.map((f) => f.following_id);

  // Count + display in parallel, server-side filtered
  const [countResult, displayResult] = await Promise.all([
    supabase
      .from("user_sets")
      .select("*", { count: "exact", head: true })
      .eq("set_num", setNum)
      .eq("collection_type", "collection")
      .in("user_id", followingArray),
    supabase
      .from("user_sets")
      .select("user_id, profiles!inner(username)")
      .eq("set_num", setNum)
      .eq("collection_type", "collection")
      .in("user_id", followingArray)
      .limit(limit),
  ]);

  const totalCount = countResult.count ?? 0;
  if (totalCount === 0) return { users: [], totalCount: 0 };

  const users = (displayResult.data ?? []).map((row) => {
    const profile = row.profiles as unknown as { username: string | null };
    return { username: profile.username ?? "Anonymous" };
  });

  return { users, totalCount };
}
