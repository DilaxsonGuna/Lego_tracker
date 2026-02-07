"use server";

import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDiscoverySets } from "@/lib/queries/explore";
import type { OrderByOption } from "@/types/explore";

export async function fetchSets(params: {
  offset: number;
  search?: string;
  themeId?: number;
  orderBy?: OrderByOption;
}) {
  return getDiscoverySets(params);
}

export async function addSetToCollection(
  setNum: string,
  quantity: number = 1,
  collectionType: "collection" | "wishlist" = "collection"
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

  // Invalidate popular sort cache since owner counts changed
  revalidateTag("popularity", "default");

  return { success: true };
}

export async function removeSetFromCollection(setNum: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_sets")
    .delete()
    .eq("user_id", user.id)
    .eq("set_num", setNum);

  if (error) return { error: error.message };

  // Invalidate popular sort cache since owner counts changed
  revalidateTag("popularity", "default");

  return { success: true };
}
