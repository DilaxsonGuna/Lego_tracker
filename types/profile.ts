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

export interface UserStats {
  setsCount: number;
  piecesCount: number;
  rank: string;
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
