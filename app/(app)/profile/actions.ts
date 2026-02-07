"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserProfile, getUserStats, getFavoriteSets, getMilestones } from "@/lib/queries/profile";

export async function fetchProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return getUserProfile(user.id);
}

export async function fetchUserStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return getUserStats(user.id);
}

export async function fetchFavoriteSets() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  return getFavoriteSets(user.id);
}

export async function fetchMilestones() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  return getMilestones(user.id);
}

export async function updateProfile(data: {
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  themeIds?: number[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const updateData: Record<string, string | undefined> = {};
  if (data.username !== undefined) updateData.username = data.username;
  if (data.fullName !== undefined) updateData.full_name = data.fullName;
  if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.location !== undefined) updateData.location = data.location;

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) return { error: error.message };

  // Update themes if provided
  if (data.themeIds !== undefined) {
    const { setUserThemes } = await import("@/lib/commands/user-themes");
    const themeResult = await setUserThemes(data.themeIds);
    if (themeResult.error) return { error: themeResult.error };
  }

  return { success: true };
}
