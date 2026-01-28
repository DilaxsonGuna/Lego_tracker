import { createClient } from "@/lib/supabase/server";
import type { DiscoverySet, ThemeCategory, OrderByOption } from "@/types/explore";
import { PAGE_SIZE } from "@/lib/constants";

interface GetDiscoverySetsParams {
  offset?: number;
  search?: string;
  theme?: string;
  orderBy?: OrderByOption;
}

export async function getDiscoverySets({
  offset = 0,
  search,
  theme,
  orderBy = "newest",
}: GetDiscoverySetsParams = {}): Promise<DiscoverySet[]> {
  const supabase = await createClient();

  let query = supabase
    .from("lego_sets")
    .select("set_num, name, num_parts, img_url, themes!inner(name)");

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,set_num.ilike.%${search}%`
    );
  }

  if (theme && theme !== "all") {
    query = query.eq("themes.name", theme);
  } else {
    // When not filtering by theme, use a non-inner join
    query = supabase
      .from("lego_sets")
      .select("set_num, name, num_parts, img_url, themes(name)");

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,set_num.ilike.%${search}%`
      );
    }
  }

  // Order by release date (year)
  const ascending = orderBy === "oldest";

  const { data, error } = await query
    .order("year", { ascending })
    .order("set_num", { ascending: true })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error || !data) return [];

  return data.map((row) => ({
    setNum: row.set_num,
    name: row.name,
    numParts: row.num_parts ?? 0,
    setImgUrl: row.img_url ?? "",
    theme: (row.themes as unknown as { name: string } | null)?.name ?? "",
  }));
}

export async function getThemeCategories(): Promise<ThemeCategory[]> {
  const supabase = await createClient();

  // Get distinct theme names from sets that actually exist
  const { data, error } = await supabase
    .from("lego_sets")
    .select("themes(name)")
    .not("themes", "is", null);

  if (error || !data) return [{ id: "all", label: "All" }];

  // Extract unique theme names
  const themeNames = new Set<string>();
  for (const row of data) {
    const themeName = (row.themes as unknown as { name: string } | null)?.name;
    if (themeName) {
      themeNames.add(themeName);
    }
  }

  const sortedThemes = Array.from(themeNames).sort();

  return [
    { id: "all", label: "All" },
    ...sortedThemes.map((name) => ({
      id: name,
      label: name,
    })),
  ];
}
