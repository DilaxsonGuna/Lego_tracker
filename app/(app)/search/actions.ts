"use server";

import { searchSets, searchUsers, searchThemes } from "@/lib/queries/search";
import type { SearchTab } from "@/types/search";

export async function performSearch(query: string, tab: SearchTab) {
  if (!query.trim()) return [];

  switch (tab) {
    case "sets":
      return searchSets(query);
    case "users":
      return searchUsers(query);
    case "themes":
      return searchThemes(query);
    default:
      return [];
  }
}
