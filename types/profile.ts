export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  isVerified: boolean;
  role: string;
  isOnline: boolean;
}

export interface UserStats {
  setsCount: number;
  piecesCount: number;
  rank: string;
  rankNumber: number;
}
