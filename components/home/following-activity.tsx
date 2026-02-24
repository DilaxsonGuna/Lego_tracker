"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { FollowingActivityItem } from "@/lib/queries/home";

interface FollowingActivityProps {
  items: FollowingActivityItem[];
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function FollowingActivity({ items }: FollowingActivityProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground font-bold text-sm">Following Activity</h2>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl bg-card border border-border p-3"
          >
            <Link href={`/u/${item.userId}`}>
              <Avatar className="size-8 flex-shrink-0">
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                  {item.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground">
                <Link
                  href={`/u/${item.userId}`}
                  className="font-semibold hover:text-primary transition-colors"
                >
                  @{item.username}
                </Link>
                {" added "}
                <span className="font-medium">{item.setName}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatTimeAgo(item.addedAt)}
              </p>
            </div>
            {item.setImgUrl && (
              <div className="size-10 rounded-lg bg-card border border-border overflow-hidden flex-shrink-0">
                <img
                  src={item.setImgUrl}
                  alt={item.setName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
