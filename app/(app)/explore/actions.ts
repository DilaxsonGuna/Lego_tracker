"use server";

import { revalidateTag } from "next/cache";
import { getDiscoverySets } from "@/lib/queries/explore";
import { addUserSet, deleteUserSet } from "@/lib/commands/user-sets";
import { fetchSetsSchema, addSetToCollectionSchema, setNumSchema } from "@/lib/schemas";
import type { OrderByOption } from "@/types/explore";

export async function fetchSets(params: {
  offset: number;
  search?: string;
  themeIds?: number[];
  orderBy?: OrderByOption;
}) {
  const parsed = fetchSetsSchema.safeParse(params);
  if (!parsed.success) return [];

  return getDiscoverySets(parsed.data);
}

export async function addSetToCollection(
  setNum: string,
  quantity: number = 1,
  collectionType: "collection" | "wishlist" = "collection"
) {
  const parsed = addSetToCollectionSchema.safeParse({ setNum, quantity, collectionType });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const result = await addUserSet(parsed.data.setNum, parsed.data.quantity, parsed.data.collectionType);
  if (result.error) return result;

  // Invalidate popular sort cache since owner counts changed
  revalidateTag("popularity", "default");

  return result;
}

export async function removeSetFromCollection(setNum: string) {
  const parsed = setNumSchema.safeParse({ setNum });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const result = await deleteUserSet(parsed.data.setNum);
  if (result.error) return result;

  // Invalidate popular sort cache since owner counts changed
  revalidateTag("popularity", "default");

  return result;
}
