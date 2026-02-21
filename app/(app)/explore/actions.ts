"use server";

import { revalidateTag } from "next/cache";
import { getDiscoverySets } from "@/lib/queries/explore";
import { addUserSet, deleteUserSet } from "@/lib/commands/user-sets";
import type { OrderByOption } from "@/types/explore";

export async function fetchSets(params: {
  offset: number;
  search?: string;
  themeIds?: number[];
  orderBy?: OrderByOption;
}) {
  return getDiscoverySets(params);
}

export async function addSetToCollection(
  setNum: string,
  quantity: number = 1,
  collectionType: "collection" | "wishlist" = "collection"
) {
  const result = await addUserSet(setNum, quantity, collectionType);
  if (result.error) return result;

  // Invalidate popular sort cache since owner counts changed
  revalidateTag("popularity", "default");

  return result;
}

export async function removeSetFromCollection(setNum: string) {
  const result = await deleteUserSet(setNum);
  if (result.error) return result;

  // Invalidate popular sort cache since owner counts changed
  revalidateTag("popularity", "default");

  return result;
}
