"use server";

import { createClient } from "@/lib/supabase/server";
import { getVaultSets, getVaultStats } from "@/lib/queries/vault";
import type { VaultSetStatus } from "@/types/vault";

export async function fetchVaultSets(params: {
  offset?: number;
  search?: string;
  theme?: string;
  status?: VaultSetStatus;
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

export async function addSetToVault(setNum: string, quantity: number = 1) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_sets")
    .upsert({
      user_id: user.id,
      set_num: setNum,
      quantity,
    }, {
      onConflict: "user_id,set_num",
    });

  if (error) return { error: error.message };

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

  return { success: true };
}
