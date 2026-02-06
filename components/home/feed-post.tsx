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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
    <Card className="rounded-2xl overflow-hidden shadow-xl shadow-black/10">
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
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground size-8"
          aria-label="More options"
        >
          <MoreHorizontal className="size-5" />
        </Button>
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
          <Badge variant="outline" className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border-white/10">
            <Star className="size-3.5 text-primary fill-primary mr-1" />
            {post.rating}/10 Rating
          </Badge>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="group text-muted-foreground hover:text-foreground h-auto px-2 py-1">
            <Grid2X2 className="size-5 group-hover:text-primary transition-colors mr-1.5" />
            <span className="text-sm font-medium">
              {formatCount(post.likes)} Likes
            </span>
          </Button>
          <Button variant="ghost" size="sm" className="group text-muted-foreground hover:text-foreground h-auto px-2 py-1">
            <MessageCircle className="size-5 group-hover:text-blue-400 transition-colors mr-1.5" />
            <span className="text-sm font-medium">
              {formatCount(post.comments)} Comments
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="group text-muted-foreground hover:text-foreground ml-auto size-8"
            aria-label="Share post"
          >
            <Share2 className="size-5 group-hover:text-green-400 transition-colors" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="group text-muted-foreground hover:text-foreground size-8"
            aria-label="Bookmark post"
          >
            <Bookmark className="size-5 group-hover:text-yellow-400 transition-colors" />
          </Button>
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
    </Card>
  );
}
