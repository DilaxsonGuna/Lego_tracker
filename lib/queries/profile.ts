import { createClient } from "@/lib/supabase/server";
import type { UserProfile, UserStats, FavoriteSet, Milestone } from "@/types/profile";
import { getFollowCounts, getMutualFollowsCount } from "./social";

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

  // Calculate global rank by total parts
  const rankData = await calculateUserRank(userId, supabase);

  return {
    setsCount,
    piecesCount: totalParts,
    rank: rankData.title,
    rankNumber: rankData.position,
    vaultValue: "Coming Soon",
  };
}

async function calculateUserRank(
  userId: string,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<{ title: string; position: number }> {
  // Get all users' total parts for ranking
  const { data, error } = await supabase
    .from("user_sets")
    .select(`
      user_id,
      quantity,
      lego_sets!inner(num_parts)
    `)
    .eq("collection_type", "collection");

  if (error || !data) {
    return { title: "Newcomer", position: 0 };
  }

  // Aggregate parts per user
  const userTotals = new Map<string, number>();
  for (const row of data) {
    const set = row.lego_sets as unknown as { num_parts: number };
    const parts = (set.num_parts ?? 0) * (row.quantity ?? 1);
    userTotals.set(row.user_id, (userTotals.get(row.user_id) ?? 0) + parts);
  }

  // Sort users by total parts descending
  const sorted = [...userTotals.entries()].sort((a, b) => b[1] - a[1]);
  const position = sorted.findIndex(([id]) => id === userId) + 1;

  return {
    title: getRankTitle(position),
    position: position || 0,
  };
}

function getRankTitle(position: number): string {
  if (position === 0) return "Newcomer";
  if (position <= 10) return "Master Builder";
  if (position <= 50) return "Expert Builder";
  if (position <= 100) return "Advanced Builder";
  if (position <= 500) return "Builder";
  return "Collector";
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

// TODO: Implement when milestones feature is added
export async function getMilestones(userId: string): Promise<Milestone[]> {
  const supabase = await createClient();
  // Placeholder - will query user's earned milestones
  void supabase;
  void userId;
  return [];
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
