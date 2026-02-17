import { createClient } from "@/lib/supabase/server";
import type { LeaderboardData, LeaderboardEntry } from "@/types/leaderboard";
import { getCurrentRank } from "@/lib/brick-score";

const LEADERBOARD_PAGE_SIZE = 50;

export async function getLeaderboard(
  offset: number = 0,
  limit: number = LEADERBOARD_PAGE_SIZE
): Promise<LeaderboardData> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get total count of users with sets
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gt("brick_score", 0);

  // Fetch leaderboard directly from profiles table (pre-calculated stats)
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, brick_score, sets_count, pieces_count")
    .gt("brick_score", 0)
    .order("brick_score", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error || !profiles) {
    return { entries: [], currentUserPosition: null, totalUsers: 0 };
  }

  // Find current user position
  let currentUserPosition: number | null = null;
  if (user) {
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gt("brick_score", 0)
      .gte(
        "brick_score",
        (
          await supabase
            .from("profiles")
            .select("brick_score")
            .eq("id", user.id)
            .single()
        ).data?.brick_score ?? 0
      );
    currentUserPosition = count ?? null;
  }

  // Build entries
  const entries: LeaderboardEntry[] = profiles.map((profile, index) => ({
    position: offset + index + 1,
    userId: profile.id,
    username: profile.username ?? "Anonymous",
    avatarUrl: profile.avatar_url ?? "",
    avatarColor: profile.avatar_url ?? "#3b82f6",
    brickScore: profile.brick_score ?? 0,
    setsCount: profile.sets_count ?? 0,
    piecesCount: profile.pieces_count ?? 0,
    rank: getCurrentRank(profile.pieces_count ?? 0, profile.sets_count ?? 0),
  }));

  return {
    entries,
    currentUserPosition,
    totalUsers: totalUsers ?? 0,
  };
}
