"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Users } from "lucide-react";
import type { FollowListUser } from "@/types/social";

interface FollowListProps {
  users: FollowListUser[];
  currentUserId: string | null;
  toggleFollowAction: (
    targetUserId: string,
    isCurrentlyFollowing: boolean
  ) => Promise<{ success?: boolean; error?: string }>;
  emptyMessage?: string;
}

function FollowListItem({
  user,
  currentUserId,
  toggleFollowAction,
}: {
  user: FollowListUser;
  currentUserId: string | null;
  toggleFollowAction: FollowListProps["toggleFollowAction"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isOwnProfile = currentUserId === user.id;
  const showButton = currentUserId && !isOwnProfile;

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleFollowAction(
        user.id,
        user.isFollowedByCurrentUser
      );
      if (result.error) {
        toast.error("Failed to update follow status");
      }
      router.refresh();
    });
  };

  return (
    <div className="flex items-center justify-between rounded-xl bg-card border border-border p-4">
      <Link
        href={`/u/${user.id}`}
        className="flex items-center gap-3 min-w-0"
      >
        <Avatar className="size-10 flex-shrink-0">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.username} />
          <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground truncate">
            @{user.username}
          </p>
          {user.displayName && (
            <p className="text-xs text-muted-foreground truncate">
              {user.displayName}
            </p>
          )}
        </div>
      </Link>

      {showButton && (
        <Button
          onClick={handleToggle}
          disabled={isPending}
          variant={user.isFollowedByCurrentUser ? "outline" : "default"}
          size="sm"
          className="gap-1.5 flex-shrink-0"
        >
          {user.isFollowedByCurrentUser ? (
            <>
              <UserMinus className="size-3.5" />
              Unfollow
            </>
          ) : (
            <>
              <UserPlus className="size-3.5" />
              Follow
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export function FollowList({
  users,
  currentUserId,
  toggleFollowAction,
  emptyMessage = "No users to show.",
}: FollowListProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Users className="size-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <FollowListItem
          key={user.id}
          user={user}
          currentUserId={currentUserId}
          toggleFollowAction={toggleFollowAction}
        />
      ))}
    </div>
  );
}
