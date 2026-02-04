import { createClient } from "@/lib/supabase/server";
import type { UserProfile, UserStats, FavoriteSet, Milestone } from "@/types/profile";

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    username: data.username ?? "",
    fullName: data.full_name ?? "",
    avatarUrl: data.avatar_url ?? "",
    bio: "",
    isVerified: false,
    role: "Collector",
    isOnline: true,
    followers: 0,
    following: 0,
    friends: 0,
    interests: [],
  };
}

// TODO: Implement when stats tracking is added
export async function getUserStats(userId: string): Promise<UserStats | null> {
  const supabase = await createClient();
  // Placeholder - will aggregate user_sets data
  void supabase;
  void userId;
  return null;
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
