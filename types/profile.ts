export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  isVerified: boolean;
  role: string;
  isOnline: boolean;
  followers: number;
  following: number;
  friends: number;
  interests: string[];
}

import type { RankTier, RankProgress } from "./brick-score";

export interface UserStats {
  setsCount: number;
  piecesCount: number;
  brickScore: number;
  rank: RankTier | null;
  rankProgress: RankProgress;
  rankNumber: number;
  vaultValue: string;
}

export interface FavoriteSet {
  setNum: string;
  name: string;
  imageUrl: string;
}

export interface Milestone {
  id: string;
  icon: string;
  label: string;
}
