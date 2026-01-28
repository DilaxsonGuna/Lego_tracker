"use server";

import { getDiscoverySets } from "@/lib/queries/explore";
import type { OrderByOption } from "@/types/explore";

export async function fetchSets(params: {
  offset: number;
  search?: string;
  theme?: string;
  orderBy?: OrderByOption;
}) {
  return getDiscoverySets(params);
}
