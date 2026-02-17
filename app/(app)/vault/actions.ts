"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getVaultSets,
  getVaultStats,
  getVaultThemes,
  getCollectionStats,
  getWishlistStats,
  getCollectionCount,
  getWishlistCount,
} from "@/lib/queries/vault";
import {
  getUserFavoriteSetNums,
  getUserFavoritesCount,
  addUserFavorite,
  removeUserFavorite,
  recalculateUserStats,
} from "@/lib/commands";
import type { CollectionTab } from "@/types/lego-set";
import type { VaultSetStatus } from "@/types/vault";

export async function fetchVaultSets(params: {
  collectionType: CollectionTab;
  offset?: number;
  search?: string;
  theme?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  return getVaultSets({ userId: user.id, ...params });
}

export async function fetchVaultStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return getVaultStats(user.id);
}

export async function fetchCollectionStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return getCollectionStats(user.id);
}

export async function fetchWishlistStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return getWishlistStats(user.id);
}

export async function fetchCollectionCount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return 0;

  return getCollectionCount(user.id);
}

export async function fetchWishlistCount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return 0;

  return getWishlistCount(user.id);
}

export async function fetchVaultThemes() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  return getVaultThemes(user.id);
}

export async function addSetToVault(
  setNum: string,
  quantity: number = 1,
  collectionType: CollectionTab = "collection"
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_sets")
    .upsert({
      user_id: user.id,
      set_num: setNum,
      quantity,
      collection_type: collectionType,
    }, {
      onConflict: "user_id,set_num",
    });

  if (error) return { error: error.message };

  // Recalculate stats if added to collection
  if (collectionType === "collection") {
    await recalculateUserStats(user.id);
  }

  return { success: true };
}

export async function moveToCollection(setNum: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_sets")
    .update({
      collection_type: "collection",
    })
    .eq("user_id", user.id)
    .eq("set_num", setNum);

  if (error) return { error: error.message };

  // Recalculate stats (set moved to collection)
  await recalculateUserStats(user.id);

  return { success: true };
}

export async function removeSetFromVault(setNum: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_sets")
    .delete()
    .eq("user_id", user.id)
    .eq("set_num", setNum);

  if (error) return { error: error.message };

  // Recalculate stats after removal
  await recalculateUserStats(user.id);

  return { success: true };
}

export async function updateSetQuantity(setNum: string, quantity: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_sets")
    .update({ quantity })
    .eq("user_id", user.id)
    .eq("set_num", setNum);

  if (error) return { error: error.message };

  // Recalculate stats (quantity affects pieces count)
  await recalculateUserStats(user.id);

  return { success: true };
}

export async function toggleFavorite(setNum: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Check if already favorited
  const favoriteSetNums = await getUserFavoriteSetNums(user.id);
  const isFavorited = favoriteSetNums.has(setNum);

  if (isFavorited) {
    // Remove from favorites
    const result = await removeUserFavorite(setNum);
    if (result.error) return { error: result.error };
    return { success: true };
  } else {
    // Check if user already has 4 favorites
    const count = await getUserFavoritesCount(user.id);
    if (count >= 4) {
      return { error: "Maximum 4 favorites allowed" };
    }

    // Add to favorites
    const result = await addUserFavorite(setNum);
    if (result.error) return { error: result.error };
    return { success: true };
  }
}
