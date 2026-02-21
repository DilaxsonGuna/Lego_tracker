import { createClient } from "@/lib/supabase/server";
import { calculateBrickScore, getCurrentRank, calculateRankProgress } from "@/lib/brick-score";

export interface DashboardStats {
  totalSets: number;
  totalPieces: number;
  brickScore: number;
  rankNumber: number;
  rankName: string | null;
  rankIcon: string | null;
  rankProgress: {
    overallProgress: number;
    piecesToNextRank: number;
    setsToNextRank: number;
    nextRankName: string | null;
  };
}

export interface RecentlyAddedSet {
  setNum: string;
  name: string;
  year: number;
  numParts: number;
  setImgUrl: string;
  themeName: string;
  addedAt: string;
}

export interface FollowingActivityItem {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  setNum: string;
  setName: string;
  setImgUrl: string;
  addedAt: string;
}

/**
 * Get dashboard stats for the current user
 */
export async function getDashboardStats(userId: string): Promise<DashboardStats | null> {
  const supabase = await createClient();

  // Fetch user's collection with set details
  const { data, error } = await supabase
    .from("user_sets")
    .select(`
      quantity,
      lego_sets!inner(num_parts)
    `)
    .eq("user_id", userId)
    .eq("collection_type", "collection");

  if (error) return null;

  let totalPieces = 0;
  const totalSets = data?.length ?? 0;

  for (const row of data ?? []) {
    const set = row.lego_sets as unknown as { num_parts: number };
    const qty = row.quantity ?? 1;
    totalPieces += (set.num_parts ?? 0) * qty;
  }

  const brickScore = calculateBrickScore(totalPieces, totalSets);
  const currentRank = getCurrentRank(totalPieces, totalSets);
  const progress = calculateRankProgress(totalPieces, totalSets);

  // Calculate global position using brick_score from profiles
  let rankNumber = 0;
  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gt("brick_score", brickScore);
  rankNumber = (count ?? 0) + 1;

  return {
    totalSets,
    totalPieces,
    brickScore,
    rankNumber,
    rankName: currentRank?.name ?? null,
    rankIcon: currentRank?.icon ?? null,
    rankProgress: {
      overallProgress: progress.overallProgress,
      piecesToNextRank: progress.piecesToNextRank,
      setsToNextRank: progress.setsToNextRank,
      nextRankName: progress.nextRank?.name ?? null,
    },
  };
}

/**
 * Get recently added sets for the current user
 */
export async function getRecentlyAddedSets(
  userId: string,
  limit: number = 6
): Promise<RecentlyAddedSet[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_sets")
    .select(`
      created_at,
      lego_sets!inner(
        set_num,
        name,
        year,
        num_parts,
        img_url,
        themes(name)
      )
    `)
    .eq("user_id", userId)
    .eq("collection_type", "collection")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => {
    const set = row.lego_sets as unknown as {
      set_num: string;
      name: string;
      year: number;
      num_parts: number;
      img_url: string;
      themes: { name: string } | null;
    };

    return {
      setNum: set.set_num,
      name: set.name,
      year: set.year,
      numParts: set.num_parts ?? 0,
      setImgUrl: set.img_url ?? "",
      themeName: set.themes?.name ?? "",
      addedAt: row.created_at,
    };
  });
}

/**
 * Get recent vault additions from users the current user follows
 */
export async function getFollowingActivity(
  userId: string,
  limit: number = 10
): Promise<FollowingActivityItem[]> {
  const supabase = await createClient();

  // Get list of user IDs this user follows
  const { data: following, error: followError } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);

  if (followError || !following || following.length === 0) return [];

  const followingIds = following.map((f) => f.following_id);

  // Get recent set additions from those users
  const { data, error } = await supabase
    .from("user_sets")
    .select(`
      id,
      user_id,
      created_at,
      lego_sets!inner(
        set_num,
        name,
        img_url
      )
    `)
    .in("user_id", followingIds)
    .eq("collection_type", "collection")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  // Get profile info for those users
  const userIds = [...new Set(data.map((row) => row.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .in("id", userIds);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, { username: p.username ?? "Anonymous", avatarUrl: p.avatar_url ?? "" }])
  );

  return data.map((row) => {
    const set = row.lego_sets as unknown as {
      set_num: string;
      name: string;
      img_url: string;
    };
    const profile = profileMap.get(row.user_id) ?? { username: "Anonymous", avatarUrl: "" };

    return {
      id: row.id,
      userId: row.user_id,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      setNum: set.set_num,
      setName: set.name,
      setImgUrl: set.img_url ?? "",
      addedAt: row.created_at,
    };
  });
}
