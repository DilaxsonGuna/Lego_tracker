export interface FollowRelationship {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface SuggestedUserWithFollowStatus {
  id: string;
  username: string;
  avatarUrl: string;
  isFollowing: boolean;
}

export interface FollowCounts {
  followers: number;
  following: number;
}

export interface FollowListUser {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  isFollowedByCurrentUser: boolean;
}
