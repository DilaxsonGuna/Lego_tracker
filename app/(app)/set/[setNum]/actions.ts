"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  addUserFavorite,
  removeUserFavorite,
  getUserFavoriteSetNums,
  getUserFavoritesCount,
  deleteUserSet,
  recalculateUserStats,
} from "@/lib/commands";
import { setNumSchema } from "@/lib/schemas";

export async function addToCollection(setNum: string) {
  const parsed = setNumSchema.safeParse({ setNum });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_sets")
    .upsert(
      {
        user_id: user.id,
        set_num: parsed.data.setNum,
        quantity: 1,
        collection_type: "collection",
      },
      { onConflict: "user_id,set_num" }
    );

  if (error) return { error: error.message };

  await recalculateUserStats(user.id);
  revalidatePath(`/set/${parsed.data.setNum}`);

  return { success: true };
}

export async function addToWishlist(setNum: string) {
  const parsed = setNumSchema.safeParse({ setNum });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_sets")
    .upsert(
      {
        user_id: user.id,
        set_num: parsed.data.setNum,
        quantity: 1,
        collection_type: "wishlist",
      },
      { onConflict: "user_id,set_num" }
    );

  if (error) return { error: error.message };
  revalidatePath(`/set/${parsed.data.setNum}`);

  return { success: true };
}

export async function removeFromVault(setNum: string) {
  const parsed = setNumSchema.safeParse({ setNum });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const result = await deleteUserSet(parsed.data.setNum);
  if (result.error) return { error: result.error };

  revalidatePath(`/set/${parsed.data.setNum}`);
  return { success: true };
}

export async function toggleFavorite(setNum: string) {
  const parsed = setNumSchema.safeParse({ setNum });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const favoriteSetNums = await getUserFavoriteSetNums(user.id);
  const isFavorited = favoriteSetNums.has(parsed.data.setNum);

  if (isFavorited) {
    const result = await removeUserFavorite(parsed.data.setNum);
    if (result.error) return { error: result.error };
  } else {
    const count = await getUserFavoritesCount(user.id);
    if (count >= 4) {
      return { error: "Maximum 4 favorites allowed" };
    }

    const result = await addUserFavorite(parsed.data.setNum);
    if (result.error) return { error: result.error };
  }

  revalidatePath(`/set/${parsed.data.setNum}`);
  return { success: true };
}
