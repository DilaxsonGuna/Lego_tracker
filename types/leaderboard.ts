import type { RankTier } from "./brick-score";

export interface LeaderboardEntry {
  position: number;
  userId: string;
  username: string;
  avatarUrl: string;
  avatarColor: string;
  brickScore: number;
  setsCount: number;
  piecesCount: number;
  rank: RankTier | null;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  currentUserPosition: number | null;
  totalUsers: number;
}
