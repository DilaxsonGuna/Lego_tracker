"use client";

import { useOptimistic, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toggleFollow } from "@/app/(app)/actions";
import type { TrendingSet } from "@/types/feed";
import type { SuggestedUserWithFollowStatus } from "@/types/social";

interface RightSidebarProps {
  trendingSets: TrendingSet[];
  suggestedUsers: SuggestedUserWithFollowStatus[];
}

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onToggle: (userId: string, newState: boolean) => void;
}

function FollowButton({ userId, isFollowing, onToggle }: FollowButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      // Optimistically update the UI inside the transition
      onToggle(userId, !isFollowing);

      const result = await toggleFollow(userId, isFollowing);

      // If there was an error, revert the optimistic update
      if (result.error) {
        onToggle(userId, isFollowing);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className={`text-xs font-bold px-2 h-auto py-1 ${
        isFollowing
          ? "text-muted-foreground hover:text-foreground"
          : "text-primary hover:text-foreground"
      }`}
    >
      {isPending ? "..." : isFollowing ? "Following" : "Follow"}
    </Button>
  );
}

export function RightSidebar({
  trendingSets,
  suggestedUsers,
}: RightSidebarProps) {
  // Use optimistic state for suggested users
  const [optimisticUsers, setOptimisticUsers] = useOptimistic(
    suggestedUsers,
    (state, { userId, isFollowing }: { userId: string; isFollowing: boolean }) =>
      state.map((user) =>
        user.id === userId ? { ...user, isFollowing } : user
      )
  );

  const handleToggleFollow = (userId: string, newState: boolean) => {
    setOptimisticUsers({ userId, isFollowing: newState });
  };

  return (
    <aside className="hidden xl:flex flex-col w-80 flex-shrink-0 gap-8 py-2 sticky top-0 h-screen overflow-y-auto scrollbar-hide">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search sets, users..."
          className="w-full rounded-xl py-3 pl-10 pr-4 bg-card border-border text-sm"
        />
      </div>

      {/* Trending Sets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground font-bold text-sm">Trending Sets</h3>
          <a
            className="text-primary text-xs font-medium hover:underline"
            href="#"
          >
            View All
          </a>
        </div>
        <div className="flex flex-col gap-4">
          {trendingSets.map((set) => (
            <div
              key={set.setNum}
              className="flex gap-3 items-center group cursor-pointer"
            >
              <div
                className="size-12 rounded-lg bg-cover bg-center bg-card flex-shrink-0"
                style={{ backgroundImage: `url("${set.thumbnailUrl}")` }}
              />
              <div className="flex flex-col">
                <span className="text-foreground text-sm font-medium group-hover:text-primary transition-colors">
                  {set.name}
                </span>
                <span className="text-muted-foreground text-xs">
                  #{set.setNum} • {set.postCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Collectors */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground font-bold text-sm">
            Suggested Collectors
          </h3>
        </div>
        <div className="space-y-4">
          {optimisticUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarImage src={user.avatarUrl} alt={user.username} />
                  <AvatarFallback>
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground text-xs font-medium">
                  {user.username}
                </span>
              </div>
              <FollowButton
                userId={user.id}
                isFollowing={user.isFollowing}
                onToggle={handleToggleFollow}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-muted-foreground">
        <a className="hover:text-foreground transition-colors" href="#">
          About
        </a>
        <a className="hover:text-foreground transition-colors" href="#">
          Help
        </a>
        <a className="hover:text-foreground transition-colors" href="#">
          Press
        </a>
        <a className="hover:text-foreground transition-colors" href="#">
          API
        </a>
        <a className="hover:text-foreground transition-colors" href="#">
          Jobs
        </a>
        <a className="hover:text-foreground transition-colors" href="#">
          Privacy
        </a>
        <a className="hover:text-foreground transition-colors" href="#">
          Terms
        </a>
        <span>&copy; 2024 LegoFlex</span>
      </div>
    </aside>
  );
}
