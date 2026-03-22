import { createClient } from "@/lib/supabase/server";
import type { VaultSet, VaultStats, CollectionStats, WishlistStats } from "@/types/vault";
import type { CollectionTab } from "@/types/lego-set";
import { PAGE_SIZE } from "@/lib/constants";

const DEFAULT_CURRENCY = "EUR";

interface GetVaultSetsParams {
  userId: string;
  collectionType: CollectionTab;
  offset?: number;
  search?: string;
  theme?: string;
}

export async function getVaultSets({
  userId,
  collectionType,
  offset = 0,
  search,
  theme,
}: GetVaultSetsParams): Promise<VaultSet[]> {
  const supabase = await createClient();

  // First, get user's favorite set numbers
  const { data: favoritesData } = await supabase
    .from("user_favorites")
    .select("set_num")
    .eq("user_id", userId);

  const favoriteSetNums = new Set(favoritesData?.map((f) => f.set_num) ?? []);

  let query = supabase
    .from("user_sets")
    .select(
      `
      quantity,
      notes,
      collection_type,
      lego_sets!inner(
        set_num,
        name,
        year,
        num_parts,
        img_url,
        themes(name)
      )
    `
    )
    .eq("user_id", userId)
    .eq("collection_type", collectionType);

  if (search) {
    // Sanitize search input by removing PostgREST special characters
    const sanitized = search.replace(/[%_(),.]/g, "");
    if (sanitized) {
      query = query.or(`name.ilike.%${sanitized}%,set_num.ilike.%${sanitized}%`, {
        referencedTable: "lego_sets",
      });
    }
  }

  if (theme && theme !== "all") {
    query = query.eq("lego_sets.themes.name", theme);
  }

  const { data, error } = await query
    .order("lego_sets(year)", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error || !data) return [];

  // Fetch prices for the returned sets
  const setNums = data.map((row) => {
    const set = row.lego_sets as unknown as { set_num: string };
    return set.set_num;
  });

  const priceMap = new Map<string, number>();
  if (setNums.length > 0) {
    const { data: pricesData } = await supabase
      .from("set_prices")
      .select("set_num, retail_price")
      .in("set_num", setNums)
      .eq("currency", DEFAULT_CURRENCY)
      .eq("source", "brickset");

    for (const p of pricesData ?? []) {
      priceMap.set(p.set_num, p.retail_price);
    }
  }

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
      themeName: set.themes?.name ?? "",
      collectionType: row.collection_type as CollectionTab,
      isFavorite: favoriteSetNums.has(set.set_num),
      retailPrice: priceMap.get(set.set_num) ?? null,
    };
  });
}

export async function getVaultStats(userId: string): Promise<VaultStats | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_sets")
    .select(
      `
      quantity,
      lego_sets!inner(num_parts, theme_id)
    `
    )
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
    totalPieces: totalParts.toLocaleString(),
    uniqueThemes: themeIds.size,
  };
}

export interface VaultTheme {
  id: number;
  name: string;
}

export async function getCollectionStats(userId: string): Promise<CollectionStats | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_sets")
    .select(
      `
      set_num,
      quantity,
      lego_sets!inner(num_parts)
    `
    )
    .eq("user_id", userId)
    .eq("collection_type", "collection");

  if (error || !data) return null;

  const totalParts = data.reduce((sum, row) => {
    const set = row.lego_sets as unknown as { num_parts: number };
    return sum + (set.num_parts ?? 0) * (row.quantity ?? 1);
  }, 0);

  // Fetch prices for collection sets
  const setNums = data.map((row) => row.set_num);
  let totalValue = 0;
  let hasAnyPrice = false;

  if (setNums.length > 0) {
    const { data: pricesData } = await supabase
      .from("set_prices")
      .select("set_num, retail_price")
      .in("set_num", setNums)
      .eq("currency", DEFAULT_CURRENCY)
      .eq("source", "brickset");

    const priceMap = new Map((pricesData ?? []).map((p) => [p.set_num, p.retail_price]));

    for (const row of data) {
      const price = priceMap.get(row.set_num);
      if (price) {
        totalValue += price * (row.quantity ?? 1);
        hasAnyPrice = true;
      }
    }
  }

  return {
    totalPieces: totalParts.toLocaleString(),
    setsOwned: data.length,
    totalValue: hasAnyPrice
      ? `€${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : null,
  };
}

export async function getWishlistStats(userId: string): Promise<WishlistStats | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_sets")
    .select(
      `
      set_num,
      quantity,
      lego_sets!inner(num_parts)
    `
    )
    .eq("user_id", userId)
    .eq("collection_type", "wishlist");

  if (error || !data) return null;

  const totalParts = data.reduce((sum, row) => {
    const set = row.lego_sets as unknown as { num_parts: number };
    return sum + (set.num_parts ?? 0) * (row.quantity ?? 1);
  }, 0);

  // Fetch prices for wishlist sets
  const setNums = data.map((row) => row.set_num);
  let totalValue = 0;
  let hasAnyPrice = false;

  if (setNums.length > 0) {
    const { data: pricesData } = await supabase
      .from("set_prices")
      .select("set_num, retail_price")
      .in("set_num", setNums)
      .eq("currency", DEFAULT_CURRENCY)
      .eq("source", "brickset");

    const priceMap = new Map((pricesData ?? []).map((p) => [p.set_num, p.retail_price]));

    for (const row of data) {
      const price = priceMap.get(row.set_num);
      if (price) {
        totalValue += price * (row.quantity ?? 1);
        hasAnyPrice = true;
      }
    }
  }

  return {
    targetPieces: totalParts.toLocaleString(),
    savedSets: data.length,
    totalValue: hasAnyPrice
      ? `€${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : null,
  };
}

export async function getCollectionCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("user_sets")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("collection_type", "collection");

  return count ?? 0;
}

export async function getWishlistCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("user_sets")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("collection_type", "wishlist");

  return count ?? 0;
}

export async function getVaultThemes(userId: string): Promise<VaultTheme[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_sets")
    .select(
      `
      lego_sets!inner(
        theme_id,
        themes!inner(id, name)
      )
    `
    )
    .eq("user_id", userId);

  if (error || !data) return [];

  // Extract unique themes
  const themesMap = new Map<number, string>();
  for (const row of data) {
    const set = row.lego_sets as unknown as {
      theme_id: number;
      themes: { id: number; name: string };
    };
    if (set.themes && !themesMap.has(set.themes.id)) {
      themesMap.set(set.themes.id, set.themes.name);
    }
  }

  return Array.from(themesMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
