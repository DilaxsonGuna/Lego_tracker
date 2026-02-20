import { FeedPost } from "./feed-post";
import type { FeedPost as FeedPostType } from "@/types/feed";

interface FeedProps {
  posts: FeedPostType[];
}

export function Feed({ posts }: FeedProps) {
  return (
    <div className="flex flex-col gap-8 min-w-0">
      {posts.map((post) => (
        <FeedPost key={post.id} post={post} />
      ))}
    </div>
  );
}
