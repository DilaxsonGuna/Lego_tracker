"use server";

import { createClient } from "@/lib/supabase/server";
import { getFollowingPaginated } from "@/lib/queries/social";
import { toggleFollow } from "@/lib/commands/follows";
import { revalidatePath } from "next/cache";
import type { FollowListCursor, PaginatedFollowList } from "@/types/social";

export async function fetchFollowing(
  userId: string,
  cursor: FollowListCursor | null = null
): Promise<PaginatedFollowList> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return getFollowingPaginated(userId, user?.id ?? null, cursor);
}

export async function getCurrentUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function handleToggleFollow(targetUserId: string, isCurrentlyFollowing: boolean) {
  const result = await toggleFollow(targetUserId, isCurrentlyFollowing);

  if ("error" in result) {
    return { error: result.error };
  }

  revalidatePath(`/u/${targetUserId}`);
  revalidatePath(`/u/${targetUserId}/followers`);
  revalidatePath(`/u/${targetUserId}/following`);
  return { success: true };
}
