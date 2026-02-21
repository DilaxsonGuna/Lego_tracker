"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toggleFollow } from "@/app/(app)/actions";
import type { SuggestedUserWithFollowStatus } from "@/types/social";

interface SuggestedCollectorsProps {
  users: SuggestedUserWithFollowStatus[];
}

function FollowButton({
  userId,
  isFollowing,
  onToggle,
}: {
  userId: string;
  isFollowing: boolean;
  onToggle: (userId: string, newState: boolean) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      onToggle(userId, !isFollowing);

      const result = await toggleFollow(userId, isFollowing);

      if (result.error) {
        onToggle(userId, isFollowing);
        toast.error("Failed to update follow status");
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className={`text-xs font-bold px-3 h-7 ${
        isFollowing
          ? "text-muted-foreground hover:text-foreground"
          : "text-primary hover:text-foreground"
      }`}
    >
      {isPending ? "..." : isFollowing ? "Following" : "Follow"}
    </Button>
  );
}

export function SuggestedCollectors({ users }: SuggestedCollectorsProps) {
  const [optimisticUsers, setOptimisticUsers] = useOptimistic(
    users,
    (state, { userId, isFollowing }: { userId: string; isFollowing: boolean }) =>
      state.map((user) =>
        user.id === userId ? { ...user, isFollowing } : user
      )
  );

  const handleToggleFollow = (userId: string, newState: boolean) => {
    setOptimisticUsers({ userId, isFollowing: newState });
  };

  if (optimisticUsers.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground font-bold text-sm">
          Suggested Collectors
        </h2>
      </div>
      <div className="space-y-3">
        {optimisticUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-xl bg-card border border-border p-3"
          >
            <Link
              href={`/u/${user.id}`}
              className="flex items-center gap-2 min-w-0"
            >
              <Avatar className="size-8 flex-shrink-0">
                <AvatarImage src={user.avatarUrl} alt={user.username} />
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-foreground hover:text-primary transition-colors truncate">
                @{user.username}
              </span>
            </Link>
            <FollowButton
              userId={user.id}
              isFollowing={user.isFollowing}
              onToggle={handleToggleFollow}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
