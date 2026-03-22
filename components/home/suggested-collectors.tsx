"use client";

import { useOptimistic } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/shared/follow-button";
import type { SuggestedUserWithFollowStatus } from "@/types/social";

interface SuggestedCollectorsProps {
  users: SuggestedUserWithFollowStatus[];
}

export function SuggestedCollectors({ users }: SuggestedCollectorsProps) {
  const [optimisticUsers, setOptimisticUsers] = useOptimistic(
    users,
    (state, { userId, isFollowing }: { userId: string; isFollowing: boolean }) =>
      state.map((user) => (user.id === userId ? { ...user, isFollowing } : user))
  );

  const handleToggleFollow = (userId: string, newState: boolean) => {
    setOptimisticUsers({ userId, isFollowing: newState });
  };

  if (optimisticUsers.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground font-bold text-lg">Suggested Collectors</h2>
      </div>
      <div className="space-y-3">
        {optimisticUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-xl bg-card border border-border p-3"
          >
            <Link href={`/u/${user.id}`} className="flex items-center gap-2 min-w-0">
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
