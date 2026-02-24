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
import { userIdSchema, toggleFollowSchema } from "@/lib/schemas";

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
  const parsed = userIdSchema.safeParse({ userId });
  if (!parsed.success) return { isPrivate: true, isOwner: false };

  const currentUserId = await getCurrentUserId();
  const isOwner = currentUserId === parsed.data.userId;

  // Owners can always see their own profile
  if (isOwner) return { isPrivate: false, isOwner: true };

  const visible = await isProfileVisible(parsed.data.userId);
  return { isPrivate: !visible, isOwner: false };
}

export async function fetchPublicProfile(userId: string) {
  const parsed = userIdSchema.safeParse({ userId });
  if (!parsed.success) return null;

  return getUserProfile(parsed.data.userId);
}

export async function fetchPublicStats(userId: string) {
  const parsed = userIdSchema.safeParse({ userId });
  if (!parsed.success) return null;

  return getUserStats(parsed.data.userId);
}

export async function fetchPublicFavorites(userId: string) {
  const parsed = userIdSchema.safeParse({ userId });
  if (!parsed.success) return [];

  return getFavoriteSets(parsed.data.userId);
}

export async function fetchPublicMilestones(userId: string) {
  const parsed = userIdSchema.safeParse({ userId });
  if (!parsed.success) return [];

  return getMilestones(parsed.data.userId);
}

export async function fetchIsFollowing(targetUserId: string) {
  const parsed = userIdSchema.safeParse({ userId: targetUserId });
  if (!parsed.success) return false;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  return isFollowing(user.id, parsed.data.userId);
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
  const parsed = toggleFollowSchema.safeParse({ userId: targetUserId, isCurrentlyFollowing });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  return toggleFollow(parsed.data.userId, parsed.data.isCurrentlyFollowing);
}
