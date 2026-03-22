import { createClient } from "@/lib/supabase/server";

const DEFAULT_CURRENCY = "EUR";
const MAX_COLLECTION_SIZE = 2000;

export interface ThemeDataPoint {
  theme: string;
  count: number;
}

export interface YearDataPoint {
  year: number;
  count: number;
}

export interface GrowthDataPoint {
  month: string;
  added: number;
  cumulative: number;
}

export interface NotableSet {
  setNum: string;
  name: string;
  imgUrl: string;
  value: number;
  label: string;
}

export interface CollectionKPIs {
  totalSets: number;
  totalPieces: number;
  totalValue: number | null;
  avgPricePerPiece: number | null;
  setsAddedThisMonth: number;
}

/**
 * Get set count per theme, sorted descending.
 */
export async function getThemeDistribution(userId: string): Promise<ThemeDataPoint[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_sets")
    .select("lego_sets!inner(themes!inner(name))")
    .eq("user_id", userId)
    .eq("collection_type", "collection")
    .limit(MAX_COLLECTION_SIZE);

  if (error || !data) return [];

  const counts = new Map<string, number>();
  for (const row of data) {
    const set = row.lego_sets as unknown as { themes: { name: string } | null };
    const theme = set.themes?.name ?? "Unknown";
    counts.set(theme, (counts.get(theme) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get set count per year, sorted by year ascending.
 */
export async function getYearDistribution(userId: string): Promise<YearDataPoint[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_sets")
    .select("lego_sets!inner(year)")
    .eq("user_id", userId)
    .eq("collection_type", "collection")
    .limit(MAX_COLLECTION_SIZE);

  if (error || !data) return [];

  const counts = new Map<number, number>();
  for (const row of data) {
    const set = row.lego_sets as unknown as { year: number };
    if (set.year) {
      counts.set(set.year, (counts.get(set.year) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);
}

/**
 * Get collection growth over time — sets added per month with cumulative total.
 */
export async function getCollectionGrowth(userId: string): Promise<GrowthDataPoint[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_sets")
    .select("created_at")
    .eq("user_id", userId)
    .eq("collection_type", "collection")
    .order("created_at", { ascending: true })
    .limit(MAX_COLLECTION_SIZE);

  if (error || !data || data.length === 0) return [];

  const monthlyCounts = new Map<string, number>();
  for (const row of data) {
    if (!row.created_at) continue;
    const date = new Date(row.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlyCounts.set(key, (monthlyCounts.get(key) ?? 0) + 1);
  }

  const sortedMonths = Array.from(monthlyCounts.keys()).sort();
  let cumulative = 0;

  return sortedMonths.map((month) => {
    const added = monthlyCounts.get(month) ?? 0;
    cumulative += added;
    return { month, added, cumulative };
  });
}

/**
 * Get notable sets: largest (most pieces), oldest, newest, most valuable.
 */
export async function getNotableSets(userId: string): Promise<NotableSet[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_sets")
    .select("lego_sets!inner(set_num, name, year, num_parts, img_url)")
    .eq("user_id", userId)
    .eq("collection_type", "collection")
    .limit(MAX_COLLECTION_SIZE);

  if (error || !data || data.length === 0) return [];

  type SetRow = {
    set_num: string;
    name: string;
    year: number;
    num_parts: number;
    img_url: string;
  };

  const sets = data.map((row) => row.lego_sets as unknown as SetRow);

  const largest = sets.reduce((a, b) => (b.num_parts > a.num_parts ? b : a));
  const oldest = sets.reduce((a, b) => (b.year < a.year ? b : a));
  const newest = sets.reduce((a, b) => (b.year > a.year ? b : a));

  const toNotable = (set: SetRow, label: string, value: number): NotableSet => ({
    setNum: set.set_num,
    name: set.name,
    imgUrl: set.img_url ?? "",
    value,
    label,
  });

  const notables = [
    toNotable(largest, "Largest", largest.num_parts),
    toNotable(oldest, "Oldest", oldest.year),
    toNotable(newest, "Newest", newest.year),
  ];

  // Try to find most valuable
  const setNums = sets.map((s) => s.set_num);
  const { data: prices } = await supabase
    .from("set_prices")
    .select("set_num, retail_price")
    .in("set_num", setNums)
    .eq("currency", DEFAULT_CURRENCY)
    .eq("source", "brickset");

  if (prices && prices.length > 0) {
    const mostValuable = prices.reduce((a, b) =>
      (b.retail_price ?? 0) > (a.retail_price ?? 0) ? b : a
    );
    const mvSet = sets.find((s) => s.set_num === mostValuable.set_num);
    if (mvSet) {
      notables.push(toNotable(mvSet, "Most Valuable", mostValuable.retail_price ?? 0));
    }
  }

  // Deduplicate by set_num (e.g., single-set collections show same set for all)
  const seen = new Set<string>();
  return notables.filter((n) => {
    if (seen.has(n.setNum)) return false;
    seen.add(n.setNum);
    return true;
  });
}

/**
 * Get KPI summary: total sets, pieces, value, avg price/piece, sets added this month.
 */
export async function getCollectionKPIs(userId: string): Promise<CollectionKPIs> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_sets")
    .select("set_num, quantity, created_at, lego_sets!inner(num_parts)")
    .eq("user_id", userId)
    .eq("collection_type", "collection")
    .limit(MAX_COLLECTION_SIZE);

  if (error || !data) {
    return {
      totalSets: 0,
      totalPieces: 0,
      totalValue: null,
      avgPricePerPiece: null,
      setsAddedThisMonth: 0,
    };
  }

  const totalSets = data.length;
  let totalPieces = 0;
  for (const row of data) {
    const set = row.lego_sets as unknown as { num_parts: number };
    totalPieces += (set.num_parts ?? 0) * (row.quantity ?? 1);
  }

  // Count sets added this month
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const setsAddedThisMonth = data.filter((row) => {
    if (!row.created_at) return false;
    return new Date(row.created_at) >= thisMonthStart;
  }).length;

  // Calculate total value
  const setNums = data.map((r) => r.set_num);
  let totalValue: number | null = null;

  if (setNums.length > 0) {
    const { data: prices } = await supabase
      .from("set_prices")
      .select("set_num, retail_price")
      .in("set_num", setNums)
      .eq("currency", DEFAULT_CURRENCY)
      .eq("source", "brickset");

    if (prices && prices.length > 0) {
      const priceMap = new Map(prices.map((p) => [p.set_num, p.retail_price ?? 0]));
      totalValue = 0;
      for (const row of data) {
        const price = priceMap.get(row.set_num);
        if (price) totalValue += price * (row.quantity ?? 1);
      }
    }
  }

  const avgPricePerPiece = totalValue !== null && totalPieces > 0 ? totalValue / totalPieces : null;

  return { totalSets, totalPieces, totalValue, avgPricePerPiece, setsAddedThisMonth };
}
