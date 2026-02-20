import { createClient } from "@/lib/supabase/server";
import type { UserProfile, UserStats, FavoriteSet, Milestone } from "@/types/profile";
import { getFollowCounts, getMutualFollowsCount } from "./social";
import {
  calculateBrickScore,
  getCurrentRank,
  calculateRankProgress,
} from "@/lib/brick-score";

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient();

  // Fetch profile data and follow counts in parallel
  const [profileResult, followCounts, mutualCount] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    getFollowCounts(userId),
    getMutualFollowsCount(userId),
  ]);

  if (profileResult.error || !profileResult.data) return null;

  const data = profileResult.data;

  return {
    id: data.id,
    username: data.username ?? "",
    fullName: data.full_name ?? "",
    avatarUrl: data.avatar_url ?? "",
    bio: data.bio ?? "",
    isVerified: false,
    role: "Collector",
    isOnline: true,
    followers: followCounts.followers,
    following: followCounts.following,
    friends: mutualCount,
    interests: [],
  };
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
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

  if (error || !data) return null;

  // Calculate total parts
  let totalParts = 0;
  const setsCount = data.length;

  for (const row of data) {
    const set = row.lego_sets as unknown as { num_parts: number };
    const qty = row.quantity ?? 1;
    totalParts += (set.num_parts ?? 0) * qty;
  }

  // Calculate brick score and rank using the new system
  const brickScore = calculateBrickScore(totalParts, setsCount);
  const rank = getCurrentRank(totalParts, setsCount);
  const rankProgress = calculateRankProgress(totalParts, setsCount);

  // Calculate global position by brick score
  const globalPosition = await calculateGlobalPosition(userId, brickScore, supabase);

  return {
    setsCount,
    piecesCount: totalParts,
    brickScore,
    rank,
    rankProgress,
    rankNumber: globalPosition,
    vaultValue: "Coming Soon",
  };
}

async function calculateGlobalPosition(
  userId: string,
  userBrickScore: number,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<number> {
  // Get all users' stats for ranking by brick score
  const { data, error } = await supabase
    .from("user_sets")
    .select(`
      user_id,
      quantity,
      lego_sets!inner(num_parts)
    `)
    .eq("collection_type", "collection");

  if (error || !data) {
    return 0;
  }

  // Aggregate stats per user: pieces and set count
  const userStats = new Map<string, { pieces: number; sets: number }>();
  for (const row of data) {
    const set = row.lego_sets as unknown as { num_parts: number };
    const parts = (set.num_parts ?? 0) * (row.quantity ?? 1);
    const existing = userStats.get(row.user_id) ?? { pieces: 0, sets: 0 };
    userStats.set(row.user_id, {
      pieces: existing.pieces + parts,
      sets: existing.sets + 1,
    });
  }

  // Calculate brick scores and sort
  const scores = [...userStats.entries()]
    .map(([id, stats]) => ({
      id,
      score: calculateBrickScore(stats.pieces, stats.sets),
    }))
    .sort((a, b) => b.score - a.score);

  const position = scores.findIndex((s) => s.id === userId) + 1;
  return position || 0;
}

export async function getFavoriteSets(userId: string): Promise<FavoriteSet[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_favorites")
    .select(`
      set_num,
      lego_sets!inner(
        set_num,
        name,
        img_url
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error || !data) return [];

  return data.map((row) => {
    const set = row.lego_sets as unknown as {
      set_num: string;
      name: string;
      img_url: string;
    };
    return {
      setNum: set.set_num,
      name: set.name,
      imageUrl: set.img_url ?? "",
    };
  });
}

/**
 * Derive milestones from a user's actual collection stats.
 * Each milestone is unlocked when the user crosses a threshold.
 */
export async function getMilestones(userId: string): Promise<Milestone[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_sets")
    .select(`
      quantity,
      lego_sets!inner(num_parts, year)
    `)
    .eq("user_id", userId)
    .eq("collection_type", "collection");

  if (error || !data || data.length === 0) return [];

  let totalParts = 0;
  const years = new Set<number>();

  for (const row of data) {
    const set = row.lego_sets as unknown as { num_parts: number; year: number };
    totalParts += (set.num_parts ?? 0) * (row.quantity ?? 1);
    if (set.year) years.add(set.year);
  }

  const setsCount = data.length;
  const yearSpan = years.size > 0 ? Math.max(...years) - Math.min(...years) : 0;

  const milestones: Milestone[] = [];

  if (totalParts >= 1000)
    milestones.push({ id: "m-1k", icon: "diamond", label: "1k Bricks" });
  if (totalParts >= 10000)
    milestones.push({ id: "m-10k", icon: "diamond", label: "10k Bricks" });
  if (totalParts >= 100000)
    milestones.push({ id: "m-100k", icon: "diamond", label: "100k Bricks" });
  if (setsCount >= 10)
    milestones.push({ id: "m-10s", icon: "architecture", label: "10 Sets" });
  if (setsCount >= 50)
    milestones.push({ id: "m-50s", icon: "architecture", label: "50 Sets" });
  if (yearSpan >= 10)
    milestones.push({ id: "m-decade", icon: "history_edu", label: "10 Years" });

  return milestones;
}

/**
 * Check if a user's profile is complete (has username set)
 */
export async function isProfileComplete(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();

  if (error || !data) return false;
  return Boolean(data.username && data.username.trim().length > 0);
}

/**
 * Check if a username is available
 */
export async function isUsernameAvailable(
  username: string,
  excludeUserId?: string
): Promise<boolean> {
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select("id")
    .eq("username", username.toLowerCase());

  if (excludeUserId) {
    query = query.neq("id", excludeUserId);
  }

  const { data } = await query.maybeSingle();
  return !data;
}
