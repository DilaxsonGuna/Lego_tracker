import { createClient } from "@/lib/supabase/server";
import type { SearchSet, SearchUser, SearchTheme } from "@/types/search";

const DEFAULT_LIMIT = 20;

export async function searchSets(
  query: string,
  limit: number = DEFAULT_LIMIT
): Promise<SearchSet[]> {
  if (!query.trim()) return [];

  const supabase = await createClient();
  const pattern = `%${query.trim()}%`;

  const { data, error } = await supabase
    .from("lego_sets")
    .select("set_num, name, year, num_parts, img_url, themes!inner(name)")
    .or(`name.ilike.${pattern},set_num.ilike.${pattern}`)
    .order("year", { ascending: false })
    .limit(limit);

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

export async function searchUsers(
  query: string,
  limit: number = DEFAULT_LIMIT
): Promise<SearchUser[]> {
  if (!query.trim()) return [];

  const supabase = await createClient();
  const pattern = `%${query.trim()}%`;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url")
    .or(`username.ilike.${pattern},full_name.ilike.${pattern}`)
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    username: row.username ?? "",
    fullName: row.full_name ?? "",
    avatarUrl: row.avatar_url ?? "",
  }));
}

export async function searchThemes(
  query: string,
  limit: number = DEFAULT_LIMIT
): Promise<SearchTheme[]> {
  if (!query.trim()) return [];

  const supabase = await createClient();
  const pattern = `%${query.trim()}%`;

  const { data, error } = await supabase
    .from("themes")
    .select("id, name, parent:themes!parent_id(name)")
    .ilike("name", pattern)
    .order("name", { ascending: true })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    parentName: (row.parent as unknown as { name: string } | null)?.name ?? null,
  }));
}
