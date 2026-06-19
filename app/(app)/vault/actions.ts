"use server";

import { createClient } from "@/lib/supabase/server";
import { getVaultSets } from "@/lib/queries/vault";
import {
  getUserFavoriteSetNums,
  getUserFavoritesCount,
  addUserFavorite,
  removeUserFavorite,
  recalculateUserStats,
  deleteUserSet,
} from "@/lib/commands";
import { fetchVaultSetsSchema, setNumSchema } from "@/lib/schemas";
import { getMilestones } from "@/lib/queries/profile";
import type { CollectionTab } from "@/types/lego-set";

export async function fetchVaultSets(params: {
  collectionType: CollectionTab;
  offset?: number;
  search?: string;
  theme?: string;
}) {
  const parsed = fetchVaultSetsSchema.safeParse(params);
  if (!parsed.success) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  return getVaultSets({ userId: user.id, ...parsed.data });
}

export async function moveToCollection(setNum: string) {
  const parsed = setNumSchema.safeParse({ setNum });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_sets")
    .update({
      collection_type: "collection",
    })
    .eq("user_id", user.id)
    .eq("set_num", parsed.data.setNum);

  if (error) return { error: error.message };

  // Recalculate stats (set moved to collection)
  await recalculateUserStats(user.id);

  return { success: true };
}

export async function removeSetFromVault(setNum: string) {
  const parsed = setNumSchema.safeParse({ setNum });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  return deleteUserSet(parsed.data.setNum);
}

export async function toggleFavorite(setNum: string) {
  const parsed = setNumSchema.safeParse({ setNum });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Check if already favorited
  const favoriteSetNums = await getUserFavoriteSetNums(user.id);
  const isFavorited = favoriteSetNums.has(parsed.data.setNum);

  if (isFavorited) {
    // Remove from favorites
    const result = await removeUserFavorite(parsed.data.setNum);
    if (result.error) return { error: result.error };
    return { success: true };
  } else {
    // Check if user already has 4 favorites
    const count = await getUserFavoritesCount(user.id);
    if (count >= 4) {
      return { error: "Maximum 4 favorites allowed" };
    }

    // Add to favorites
    const result = await addUserFavorite(parsed.data.setNum);
    if (result.error) return { error: result.error };
    return { success: true };
  }
}

export async function checkMilestones() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  return getMilestones(user.id);
}
