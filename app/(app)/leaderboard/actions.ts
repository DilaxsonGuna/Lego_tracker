"use server";

import { getLeaderboard } from "@/lib/queries/leaderboard";

export async function fetchLeaderboard(offset: number = 0, limit: number = 50) {
  return getLeaderboard(offset, limit);
}
