export type PostType = "build" | "review" | "haul" | "moc";

export interface FeedPost {
  id: string;
  user: {
    username: string;
    avatarUrl: string;
  };
  type: PostType;
  actionText: string;
  timeAgo: string;
  imageUrl: string;
  aspectRatio?: "4/3" | "16/9";
  rating?: number;
  legoSet?: {
    setNum: string;
    name: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  topComment?: {
    username: string;
    text: string;
  };
}

export interface Story {
  id: string;
  username: string;
  avatarUrl: string;
  isAddStory: boolean;
  hasUnviewed: boolean;
}

export interface TrendingSet {
  setNum: string;
  name: string;
  thumbnailUrl: string;
  postCount: string;
}

export interface SuggestedUser {
  id: string;
  username: string;
  avatarUrl: string;
}
