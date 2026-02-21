"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getUserProfile,
  getUserStats,
  getFavoriteSets,
  getMilestones,
} from "@/lib/queries/profile";
import { isFollowing } from "@/lib/queries/social";
import { toggleFollow } from "@/lib/commands/follows";

async function isProfileVisible(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("profile_visible")
    .eq("id", userId)
    .single();

  return data?.profile_visible !== false;
}

export async function checkProfileAccess(userId: string): Promise<{
  isPrivate: boolean;
  isOwner: boolean;
}> {
  const currentUserId = await getCurrentUserId();
  const isOwner = currentUserId === userId;

  // Owners can always see their own profile
  if (isOwner) return { isPrivate: false, isOwner: true };

  const visible = await isProfileVisible(userId);
  return { isPrivate: !visible, isOwner: false };
}

export async function fetchPublicProfile(userId: string) {
  return getUserProfile(userId);
}

export async function fetchPublicStats(userId: string) {
  return getUserStats(userId);
}

export async function fetchPublicFavorites(userId: string) {
  return getFavoriteSets(userId);
}

export async function fetchPublicMilestones(userId: string) {
  return getMilestones(userId);
}

export async function fetchIsFollowing(targetUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  return isFollowing(user.id, targetUserId);
}

export async function getCurrentUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export async function handleToggleFollow(
  targetUserId: string,
  isCurrentlyFollowing: boolean
) {
  return toggleFollow(targetUserId, isCurrentlyFollowing);
}
