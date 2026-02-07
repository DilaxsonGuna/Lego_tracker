import { unstable_cache } from "next/cache";
import { createClient, createAnonClient } from "@/lib/supabase/server";
import type { DiscoverySet, ThemeCategory, OrderByOption } from "@/types/explore";
import { PAGE_SIZE } from "@/lib/constants";

interface GetDiscoverySetsParams {
  offset?: number;
  search?: string;
  themeIds?: number[];
  orderBy?: OrderByOption;
}

export async function getDiscoverySets({
  offset = 0,
  search,
  themeIds: inputThemeIds,
  orderBy = "most-popular",
}: GetDiscoverySetsParams = {}): Promise<DiscoverySet[]> {
  const supabase = await createClient();

  // If filtering by themes, get the selected themes + all their child theme IDs
  let allThemeIds: number[] = [];
  if (inputThemeIds && inputThemeIds.length > 0) {
    const { data: childThemes } = await supabase
      .from("themes")
      .select("id")
      .in("parent_id", inputThemeIds);

    allThemeIds = [...inputThemeIds, ...(childThemes?.map((t) => t.id) ?? [])];
  }

  if (orderBy === "most-popular") {
    // Use RPC for popularity sort with accent-insensitive search
    const { data, error } = await supabase.rpc("get_popular_sets", {
      p_offset: offset,
      p_limit: PAGE_SIZE,
      p_search: search || null,
      p_theme_ids: allThemeIds.length > 0 ? allThemeIds : null,
    });

    if (error) {
      console.error("Most popular query error:", error);
      return [];
    }

    if (!data) return [];

    return data.map((row: any) => ({
      setNum: row.set_num,
      name: row.name,
      year: row.year,
      numParts: row.num_parts ?? 0,
      setImgUrl: row.img_url ?? "",
      theme: row.theme_name ?? "",
      ownerCount: row.owner_count ?? 0,
    }));
  } else {
    // Use RPC for date-based sorts with accent-insensitive search
    const ascending = orderBy === "oldest";
    const { data, error } = await supabase.rpc("search_sets", {
      p_offset: offset,
      p_limit: PAGE_SIZE,
      p_search: search || null,
      p_theme_ids: allThemeIds.length > 0 ? allThemeIds : null,
      p_order_ascending: ascending,
    });

    if (error) {
      console.error("Search sets query error:", error);
      return [];
    }

    if (!data) return [];

    return data.map((row: any) => ({
      setNum: row.set_num,
      name: row.name,
      year: row.year,
      numParts: row.num_parts ?? 0,
      setImgUrl: row.img_url ?? "",
      theme: row.theme_name ?? "",
    }));
  }
}

export async function getParentThemes(): Promise<ThemeCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("themes")
    .select("id, name")
    .is("parent_id", null)
    .order("name", { ascending: true });

  if (error || !data) return [{ id: "all", label: "All" }];

  return [
    { id: "all", label: "All" },
    ...data.map((theme) => ({
      id: theme.id,
      label: theme.name,
    })),
  ];
}

// Cached version of parent themes - 24h TTL
// Uses anon client to avoid cookies() inside cache
export const getCachedParentThemes = unstable_cache(
  async () => {
    const supabase = createAnonClient();

    const { data, error } = await supabase
      .from("themes")
      .select("id, name")
      .is("parent_id", null)
      .order("name", { ascending: true });

    if (error || !data) return [{ id: "all", label: "All" }];

    return [
      { id: "all", label: "All" },
      ...data.map((theme) => ({
        id: theme.id,
        label: theme.name,
      })),
    ];
  },
  ["themes", "parent"],
  { revalidate: 86400, tags: ["themes"] }
);

const FEATURED_THEMES = [
  "Star Wars",
  "Technic",
  "Harry Potter",
  "NINJAGO",
  "City",
];

// Cached fallback for featured themes (guests) - 24h TTL
// Uses anon client to avoid cookies() inside cache
const getCachedFeaturedThemesFallback = unstable_cache(
  async () => {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("themes")
      .select("id, name")
      .in("name", FEATURED_THEMES)
      .is("parent_id", null);

    if (error || !data) return [];

    const sorted = FEATURED_THEMES
      .map((name) => data.find((t) => t.name === name))
      .filter((t): t is { id: number; name: string } => t !== undefined);

    return sorted.map((theme) => ({
      id: theme.id,
      label: theme.name,
    }));
  },
  ["themes", "featured", "default"],
  { revalidate: 86400, tags: ["themes"] }
);

export async function getFeaturedThemes(userId?: string): Promise<ThemeCategory[]> {
  // If user provided, try to get their themes first (NOT cached - user-specific)
  if (userId) {
    const { getUserThemes } = await import("./user-themes");
    const userThemes = await getUserThemes(userId);

    if (userThemes.length > 0) {
      return userThemes;
    }
  }

  // Fallback to cached featured themes
  return getCachedFeaturedThemesFallback();
}

