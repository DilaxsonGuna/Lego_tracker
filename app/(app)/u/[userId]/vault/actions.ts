"use server";

import {
  getVaultSets,
  getCollectionStats,
  getWishlistStats,
  getVaultThemes,
  getCollectionCount,
  getWishlistCount,
} from "@/lib/queries/vault";
import type { CollectionTab } from "@/types/lego-set";

export async function fetchPublicVaultSets(
  userId: string,
  collectionType: CollectionTab
) {
  return getVaultSets({ userId, collectionType });
}

export async function fetchPublicCollectionStats(userId: string) {
  return getCollectionStats(userId);
}

export async function fetchPublicWishlistStats(userId: string) {
  return getWishlistStats(userId);
}

export async function fetchPublicVaultThemes(userId: string) {
  return getVaultThemes(userId);
}

export async function fetchPublicCollectionCount(userId: string) {
  return getCollectionCount(userId);
}

export async function fetchPublicWishlistCount(userId: string) {
  return getWishlistCount(userId);
}
