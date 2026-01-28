import { createClient } from "@/lib/supabase/server";
import type { VaultSet, VaultStats, VaultSetStatus } from "@/types/vault";
import { PAGE_SIZE } from "@/lib/constants";

interface GetVaultSetsParams {
  userId: string;
  offset?: number;
  search?: string;
  theme?: string;
  status?: VaultSetStatus;
}

export async function getVaultSets({
  userId,
  offset = 0,
  search,
  theme,
  status,
}: GetVaultSetsParams): Promise<VaultSet[]> {
  const supabase = await createClient();

  let query = supabase
    .from("user_sets")
    .select(`
      quantity,
      notes,
      lego_sets!inner(
        set_num,
        name,
        year,
        num_parts,
        img_url,
        themes(name)
      )
    `)
    .eq("user_id", userId);

  if (search) {
    query = query.or(
      `lego_sets.name.ilike.%${search}%,lego_sets.set_num.ilike.%${search}%`
    );
  }

  if (theme && theme !== "all") {
    query = query.eq("lego_sets.themes.name", theme);
  }

  // TODO: Add status filtering when status column is added to user_sets
  void status;

  const { data, error } = await query
    .order("lego_sets(year)", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error || !data) return [];

  return data.map((row) => {
    const set = row.lego_sets as unknown as {
      set_num: string;
      name: string;
      year: number;
      num_parts: number;
      img_url: string;
      themes: { name: string } | null;
    };
    return {
      setNum: set.set_num,
      name: set.name,
      year: set.year,
      numParts: set.num_parts ?? 0,
      setImgUrl: set.img_url ?? "",
      price: "$0", // TODO: Add price when available
      status: "built" as VaultSetStatus,
    };
  });
}

export async function getVaultStats(userId: string): Promise<VaultStats | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_sets")
    .select(`
      quantity,
      lego_sets!inner(num_parts, theme_id)
    `)
    .eq("user_id", userId);

  if (error || !data) return null;

  const totalParts = data.reduce((sum, row) => {
    const set = row.lego_sets as unknown as { num_parts: number };
    return sum + (set.num_parts ?? 0) * (row.quantity ?? 1);
  }, 0);

  // Count unique themes
  const themeIds = new Set<number>();
  for (const row of data) {
    const set = row.lego_sets as unknown as { theme_id: number };
    if (set.theme_id) themeIds.add(set.theme_id);
  }

  return {
    totalValue: "$0", // TODO: Calculate when prices are added
    totalPieces: totalParts.toLocaleString(),
    uniqueThemes: themeIds.size,
  };
}
