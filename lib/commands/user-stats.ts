"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateBrickScore } from "@/lib/brick-score";

/**
 * Recalculate and update user's stats (sets_count, pieces_count, brick_score)
 * in the profiles table. Call this after any change to user_sets.
 */
export async function recalculateUserStats(userId?: string) {
  const supabase = await createClient();

  // Get user ID if not provided
  let targetUserId = userId;
  if (!targetUserId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };
    targetUserId = user.id;
  }

  // Fetch user's collection sets (not wishlist)
  const { data, error } = await supabase
    .from("user_sets")
    .select(
      `
      quantity,
      lego_sets!inner(num_parts)
    `
    )
    .eq("user_id", targetUserId)
    .eq("collection_type", "collection");

  if (error) return { error: error.message };

  // Calculate stats
  let piecesCount = 0;
  const setsCount = data?.length ?? 0;

  for (const row of data ?? []) {
    const set = row.lego_sets as unknown as { num_parts: number };
    const qty = row.quantity ?? 1;
    piecesCount += (set.num_parts ?? 0) * qty;
  }

  const brickScore = calculateBrickScore(piecesCount, setsCount);

  // Update profiles table
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      sets_count: setsCount,
      pieces_count: piecesCount,
      brick_score: brickScore,
    })
    .eq("id", targetUserId);

  if (updateError) return { error: updateError.message };

  return { success: true, setsCount, piecesCount, brickScore };
}
