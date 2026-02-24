"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getVaultSets,
  getCollectionStats,
  getWishlistStats,
  getVaultThemes,
  getCollectionCount,
  getWishlistCount,
} from "@/lib/queries/vault";
import { userIdSchema, publicVaultSetsSchema } from "@/lib/schemas";
import type { CollectionTab } from "@/types/lego-set";

export async function checkVaultAccess(userId: string): Promise<{
  isPrivate: boolean;
}> {
  const parsed = userIdSchema.safeParse({ userId });
  if (!parsed.success) return { isPrivate: true };

  const supabase = await createClient();

  // Check if viewer is the profile owner
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.id === parsed.data.userId) return { isPrivate: false };

  // Check profile_visible flag
  const { data } = await supabase
    .from("profiles")
    .select("profile_visible")
    .eq("id", parsed.data.userId)
    .single();

  return { isPrivate: data?.profile_visible === false };
}

export async function fetchPublicVaultSets(
  userId: string,
  collectionType: CollectionTab
) {
  const parsed = publicVaultSetsSchema.safeParse({ userId, collectionType });
  if (!parsed.success) return [];

  return getVaultSets({ userId: parsed.data.userId, collectionType: parsed.data.collectionType });
}

export async function fetchPublicCollectionStats(userId: string) {
  const parsed = userIdSchema.safeParse({ userId });
  if (!parsed.success) return null;

  return getCollectionStats(parsed.data.userId);
}

export async function fetchPublicWishlistStats(userId: string) {
  const parsed = userIdSchema.safeParse({ userId });
  if (!parsed.success) return null;

  return getWishlistStats(parsed.data.userId);
}

export async function fetchPublicVaultThemes(userId: string) {
  const parsed = userIdSchema.safeParse({ userId });
  if (!parsed.success) return [];

  return getVaultThemes(parsed.data.userId);
}

export async function fetchPublicCollectionCount(userId: string) {
  const parsed = userIdSchema.safeParse({ userId });
  if (!parsed.success) return 0;

  return getCollectionCount(parsed.data.userId);
}

export async function fetchPublicWishlistCount(userId: string) {
  const parsed = userIdSchema.safeParse({ userId });
  if (!parsed.success) return 0;

  return getWishlistCount(parsed.data.userId);
}
