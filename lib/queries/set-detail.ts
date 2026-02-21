import { createClient, createAnonClient } from "@/lib/supabase/server";
import type { SetDetail, UserSetStatus } from "@/types/set-detail";
import type { DiscoverySet } from "@/types/explore";

export async function getSetDetail(setNum: string): Promise<SetDetail | null> {
  const supabase = createAnonClient();

  const { data, error } = await supabase
    .from("lego_sets")
    .select("set_num, name, year, num_parts, img_url, theme_id, themes(name)")
    .eq("set_num", setNum)
    .single();

  if (error || !data) return null;

  const theme = data.themes as unknown as { name: string } | null;

  return {
    setNum: data.set_num,
    name: data.name,
    year: data.year,
    numParts: data.num_parts ?? 0,
    imgUrl: data.img_url ?? "",
    themeId: data.theme_id,
    themeName: theme?.name ?? "Unknown",
  };
}

export async function getSetOwnerCount(setNum: string): Promise<number> {
  const supabase = createAnonClient();

  const { count, error } = await supabase
    .from("user_sets")
    .select("*", { count: "exact", head: true })
    .eq("set_num", setNum)
    .eq("collection_type", "collection");

  if (error) return 0;
  return count ?? 0;
}

export async function getRelatedSets(
  themeId: number,
  excludeSetNum: string,
  limit: number = 6
): Promise<DiscoverySet[]> {
  const supabase = createAnonClient();

  const { data, error } = await supabase
    .from("lego_sets")
    .select("set_num, name, year, num_parts, img_url, themes(name)")
    .eq("theme_id", themeId)
    .neq("set_num", excludeSetNum)
    .order("year", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => {
    const theme = row.themes as unknown as { name: string } | null;
    return {
      setNum: row.set_num,
      name: row.name,
      year: row.year,
      numParts: row.num_parts ?? 0,
      setImgUrl: row.img_url ?? "",
      theme: theme?.name ?? "",
    };
  });
}

export async function getUserSetStatus(
  userId: string,
  setNum: string
): Promise<UserSetStatus> {
  const supabase = await createClient();

  const [setResult, favResult] = await Promise.all([
    supabase
      .from("user_sets")
      .select("collection_type")
      .eq("user_id", userId)
      .eq("set_num", setNum)
      .maybeSingle(),
    supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("set_num", setNum)
      .maybeSingle(),
  ]);

  const collectionType = setResult.data?.collection_type as string | null;

  return {
    inCollection: collectionType === "collection",
    inWishlist: collectionType === "wishlist",
    isFavorite: !!favResult.data,
  };
}
