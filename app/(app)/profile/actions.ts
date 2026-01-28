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
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({
      username: data.username,
      full_name: data.fullName,
      avatar_url: data.avatarUrl,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  return { success: true };
}
