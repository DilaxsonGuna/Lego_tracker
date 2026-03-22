"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserPlus, UserMinus, Users, Search, Loader2 } from "lucide-react";
import type { FollowListCursor, FollowListUser, PaginatedFollowList } from "@/types/social";

interface FollowListProps {
  initialUsers: FollowListUser[];
  initialCursor: FollowListCursor | null;
  initialHasMore: boolean;
  currentUserId: string | null;
  toggleFollowAction: (
    targetUserId: string,
    isCurrentlyFollowing: boolean
  ) => Promise<{ success?: boolean; error?: string }>;
  loadMoreAction: (cursor: FollowListCursor) => Promise<PaginatedFollowList>;
  emptyMessage?: string;
  badgeLabel?: string;
}

function FollowListItem({
  user,
  currentUserId,
  toggleFollowAction,
  onFollowToggled,
  badgeLabel,
}: {
  user: FollowListUser;
  currentUserId: string | null;
  toggleFollowAction: FollowListProps["toggleFollowAction"];
  onFollowToggled: (userId: string) => void;
  badgeLabel: string;
}) {
  const [isPending, startTransition] = useTransition();

  const isOwnProfile = currentUserId === user.id;
  const showButton = currentUserId && !isOwnProfile;

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleFollowAction(user.id, user.isFollowedByCurrentUser);
      if (result.error) {
        toast.error("Failed to update follow status");
        return;
      }
      onFollowToggled(user.id);
    });
  };

  return (
    <div className="flex items-center justify-between rounded-xl bg-card border border-border p-4">
      <Link href={`/u/${user.id}`} className="flex items-center gap-3 min-w-0">
        <Avatar className="size-10 flex-shrink-0">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.username} />
          <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-bold text-foreground truncate">@{user.username}</p>
            {currentUserId && !isOwnProfile && user.isFollowedByCurrentUser && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                {badgeLabel}
              </Badge>
            )}
          </div>
          {user.displayName && (
            <p className="text-xs text-muted-foreground truncate">{user.displayName}</p>
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
  initialUsers,
  initialCursor,
  initialHasMore,
  currentUserId,
  toggleFollowAction,
  loadMoreAction,
  emptyMessage = "No users to show.",
  badgeLabel = "Follows you",
}: FollowListProps) {
  const [users, setUsers] = useState(initialUsers);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, startLoadMore] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.displayName?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const handleLoadMore = () => {
    if (!cursor || !hasMore) return;
    startLoadMore(async () => {
      const result = await loadMoreAction(cursor);
      setUsers((prev) => [...prev, ...result.users]);
      setCursor(result.nextCursor);
      setHasMore(result.hasMore);
    });
  };

  const handleFollowToggled = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isFollowedByCurrentUser: !u.isFollowedByCurrentUser } : u
      )
    );
  }, []);

  if (initialUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <Users className="size-8 text-primary" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
          <p className="text-xs text-muted-foreground">Find collectors who share your interests</p>
        </div>
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Discover collectors
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.length > 5 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            aria-label="Search users"
            placeholder="Search by username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <p className="text-sm text-muted-foreground">
            No users matching &ldquo;{searchQuery}&rdquo;
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <FollowListItem
              key={user.id}
              user={user}
              currentUserId={currentUserId}
              toggleFollowAction={toggleFollowAction}
              onFollowToggled={handleFollowToggled}
              badgeLabel={badgeLabel}
            />
          ))}
        </div>
      )}

      {hasMore && !searchQuery.trim() && (
        <div className="flex justify-center pt-2">
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Loading...
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
