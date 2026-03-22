"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleFollow } from "@/app/(app)/actions";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onToggle: (userId: string, newState: boolean) => void;
}

export function FollowButton({
  userId,
  isFollowing,
  onToggle,
}: FollowButtonProps) {
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
