"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserProfile, getUserStats, getFavoriteSets, getMilestones, isUsernameAvailable } from "@/lib/queries/profile";
import { updateProfileSchema } from "@/lib/schemas";

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
  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Check username availability (excluding current user)
  if (parsed.data.username !== undefined) {
    const available = await isUsernameAvailable(parsed.data.username, user.id);
    if (!available) {
      return { error: "Username already taken" };
    }
  }

  const updateData: Record<string, string | undefined> = {};
  if (parsed.data.username !== undefined) updateData.username = parsed.data.username;
  if (parsed.data.fullName !== undefined) updateData.full_name = parsed.data.fullName;
  if (parsed.data.avatarUrl !== undefined) updateData.avatar_url = parsed.data.avatarUrl;
  if (parsed.data.bio !== undefined) updateData.bio = parsed.data.bio;
  if (parsed.data.location !== undefined) updateData.location = parsed.data.location;

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) return { error: error.message };

  // Update themes if provided
  if (parsed.data.themeIds !== undefined) {
    const { setUserThemes } = await import("@/lib/commands/user-themes");
    const themeResult = await setUserThemes(parsed.data.themeIds);
    if (themeResult.error) return { error: themeResult.error };
  }

  return { success: true };
}

export async function checkUsernameAvailability(
  username: string
): Promise<{ available: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const trimmed = username.trim().toLowerCase();

  if (trimmed.length < 3) {
    return { available: false };
  }

  const available = await isUsernameAvailable(trimmed, user?.id);
  return { available };
}
