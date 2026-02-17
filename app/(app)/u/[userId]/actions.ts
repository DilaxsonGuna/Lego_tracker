"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getUserProfile,
  getUserStats,
  getFavoriteSets,
} from "@/lib/queries/profile";
import { isFollowing } from "@/lib/queries/social";
import { toggleFollow } from "@/lib/commands/follows";

export async function fetchPublicProfile(userId: string) {
  return getUserProfile(userId);
}

export async function fetchPublicStats(userId: string) {
  return getUserStats(userId);
}

export async function fetchPublicFavorites(userId: string) {
  return getFavoriteSets(userId);
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
