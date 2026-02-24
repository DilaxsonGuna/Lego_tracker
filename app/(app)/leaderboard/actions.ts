"use server";

import { getLeaderboard } from "@/lib/queries/leaderboard";
import { fetchLeaderboardSchema } from "@/lib/schemas";
import type { LeaderboardData } from "@/types/leaderboard";

const emptyLeaderboard: LeaderboardData = {
  entries: [],
  currentUserPosition: null,
  totalUsers: 0,
};

export async function fetchLeaderboard(offset: number = 0, limit: number = 50) {
  const parsed = fetchLeaderboardSchema.safeParse({ offset, limit });
  if (!parsed.success) return emptyLeaderboard;

  return getLeaderboard(parsed.data.offset, parsed.data.limit);
}
