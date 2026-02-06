"use client";

import {
  Grid2X2,
  MessageCircle,
  Share2,
  Bookmark,
  Star,
  MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { FeedPost as FeedPostType } from "@/types/feed";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return n.toString();
}

interface FeedPostProps {
  post: FeedPostType;
}

export function FeedPost({ post }: FeedPostProps) {
  return (
    <article className="bg-card rounded-2xl overflow-hidden shadow-xl shadow-black/10 border border-border">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-10 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage src={post.user.avatarUrl} alt={post.user.username} />
            <AvatarFallback>
              {post.user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <h3 className="text-foreground font-bold text-sm cursor-pointer hover:underline">
                {post.user.username}
              </h3>
              <span className="text-muted-foreground text-xs">
                • {post.timeAgo}
              </span>
            </div>
            <p className="text-muted-foreground text-xs leading-tight">
              {post.actionText}
            </p>
          </div>
        </div>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
          aria-label="More options"
        >
          <MoreHorizontal className="size-5" />
        </button>
      </div>

      {/* Image */}
      <div
        className="w-full bg-card bg-cover bg-center relative group cursor-pointer"
        style={{
          aspectRatio: post.aspectRatio ?? "4/3",
          backgroundImage: `url("${post.imageUrl}")`,
        }}
      >
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {post.rating != null && (
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
            <Star className="size-3.5 text-primary fill-primary" />
            {post.rating}/10 Rating
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center gap-6">
          <button className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Grid2X2 className="size-6 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium">
              {formatCount(post.likes)} Likes
            </span>
          </button>
          <button className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <MessageCircle className="size-6 group-hover:text-blue-400 transition-colors" />
            <span className="text-sm font-medium">
              {formatCount(post.comments)} Comments
            </span>
          </button>
          <button
            className="group text-muted-foreground hover:text-foreground transition-colors ml-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            aria-label="Share post"
          >
            <Share2 className="size-6 group-hover:text-green-400 transition-colors" />
          </button>
          <button
            className="group text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            aria-label="Bookmark post"
          >
            <Bookmark className="size-6 group-hover:text-yellow-400 transition-colors" />
          </button>
        </div>

        {/* Comment preview */}
        {post.topComment && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex gap-2 text-sm">
              <span className="font-bold text-foreground text-xs">
                {post.topComment.username}
              </span>
              <span className="text-muted-foreground text-xs">
                {post.topComment.text}
              </span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
