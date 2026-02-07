import { createClient } from "@/lib/supabase/server";
import type { DiscoverySet, ThemeCategory, OrderByOption } from "@/types/explore";
import { PAGE_SIZE } from "@/lib/constants";

interface GetDiscoverySetsParams {
  offset?: number;
  search?: string;
  themeId?: number;
  orderBy?: OrderByOption;
}

export async function getDiscoverySets({
  offset = 0,
  search,
  themeId,
  orderBy = "most-popular",
}: GetDiscoverySetsParams = {}): Promise<DiscoverySet[]> {
  const supabase = await createClient();

  // If filtering by theme, get the parent theme + all child theme IDs
  let themeIds: number[] = [];
  if (themeId !== undefined) {
    const { data: childThemes } = await supabase
      .from("themes")
      .select("id")
      .eq("parent_id", themeId);

    themeIds = [themeId, ...(childThemes?.map((t) => t.id) ?? [])];
  }

  // Conditional query based on orderBy for performance optimization
  let query;

  if (orderBy === "most-popular") {
    // For popularity sort: include user_sets for owner count
    query = supabase
      .from("lego_sets")
      .select("set_num, name, year, num_parts, img_url, themes(name), user_sets(user_id)");
  } else {
    // For date-based sorts: simpler query without user_sets
    query = supabase
      .from("lego_sets")
      .select("set_num, name, year, num_parts, img_url, themes(name)");
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,set_num.ilike.%${search}%`);
  }

  if (themeIds.length > 0) {
    query = query.in("theme_id", themeIds);
  }

  // Conditional ordering based on sort option
  if (orderBy === "most-popular") {
    // Use RPC to call a Postgres function for efficient aggregation
    const { data, error } = await supabase.rpc("get_popular_sets", {
      p_offset: offset,
      p_limit: PAGE_SIZE,
      p_search: search || null,
      p_theme_ids: themeIds.length > 0 ? themeIds : null,
    });

    if (error) {
      console.error("Most popular query error:", error);
      // Fallback to empty array if function doesn't exist yet
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
    // Standard date-based sorting
    const ascending = orderBy === "oldest";
    const { data, error } = await query
      .order("year", { ascending, nullsFirst: !ascending })
      .order("set_num", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error || !data) return [];

    return data.map((row) => ({
      setNum: row.set_num,
      name: row.name,
      year: row.year,
      numParts: row.num_parts ?? 0,
      setImgUrl: row.img_url ?? "",
      theme: (row.themes as unknown as { name: string } | null)?.name ?? "",
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

const FEATURED_THEMES = [
  "Star Wars",
  "Technic",
  "Harry Potter",
  "NINJAGO",
  "City",
];

export async function getFeaturedThemes(userId?: string): Promise<ThemeCategory[]> {
  const supabase = await createClient();

  // If user provided, try to get their themes first
  if (userId) {
    const { getUserThemes } = await import("./user-themes");
    const userThemes = await getUserThemes(userId);

    if (userThemes.length > 0) {
      return userThemes;
    }
  }

  // Fallback to hardcoded featured themes
  const { data, error } = await supabase
    .from("themes")
    .select("id, name")
    .in("name", FEATURED_THEMES)
    .is("parent_id", null);

  if (error || !data) return [];

  // Sort by the order defined in FEATURED_THEMES
  const sorted = FEATURED_THEMES
    .map((name) => data.find((t) => t.name === name))
    .filter((t): t is { id: number; name: string } => t !== undefined);

  return sorted.map((theme) => ({
    id: theme.id,
    label: theme.name,
  }));
}
