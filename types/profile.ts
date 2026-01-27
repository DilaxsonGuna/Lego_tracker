export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  isVerified: boolean;
}

export interface UserStats {
  setsCount: number;
  piecesCount: number;
  rank: string;
}
