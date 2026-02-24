"use server";

import { createClient } from "@/lib/supabase/server";
import { getFollowing } from "@/lib/queries/social";
import { toggleFollow } from "@/lib/commands/follows";
import { revalidatePath } from "next/cache";

export async function fetchFollowing(userId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return getFollowing(userId, user?.id ?? null);
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
  const result = await toggleFollow(targetUserId, isCurrentlyFollowing);

  if ("error" in result) {
    return { error: result.error };
  }

  revalidatePath("/");
  return { success: true };
}
