"use server";

import { createClient } from "@/lib/supabase/server";
import type { CollectionTab } from "@/types/lego-set";

// CREATE - Add set to user's collection or wishlist
export async function addUserSet(
  setNum: string,
  quantity: number = 1,
  collectionType: CollectionTab = "wishlist"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("user_sets").upsert(
    {
      user_id: user.id,
      set_num: setNum,
      quantity,
      collection_type: collectionType,
    },
    { onConflict: "user_id,set_num" }
  );

  if (error) return { error: error.message };
  return { success: true };
}

// DELETE - Remove set from user's collection
export async function deleteUserSet(setNum: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_sets")
    .delete()
    .eq("user_id", user.id)
    .eq("set_num", setNum);

  if (error) return { error: error.message };
  return { success: true };
}

// READ - Get user's collection set numbers
export async function getUserSetNums(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("user_sets")
    .select("set_num")
    .eq("user_id", user.id);

  return data?.map((row) => row.set_num) ?? [];
}

// READ - Get user's sets with collection type info
export async function getUserSetsWithType(): Promise<
  { setNum: string; collectionType: CollectionTab }[]
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("user_sets")
    .select("set_num, collection_type")
    .eq("user_id", user.id);

  return (
    data?.map((row) => ({
      setNum: row.set_num,
      collectionType: (row.collection_type as CollectionTab) || "collection",
    })) ?? []
  );
}
