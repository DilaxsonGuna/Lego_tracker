"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LeaderboardHeader,
  LeaderboardTable,
  CurrentUserCard,
} from "@/components/leaderboard";
import { fetchLeaderboard } from "./actions";
import type { LeaderboardData } from "@/types/leaderboard";

interface LeaderboardPageClientProps {
  initialData: LeaderboardData;
  currentUserId: string | null;
}

export function LeaderboardPageClient({
  initialData,
  currentUserId,
}: LeaderboardPageClientProps) {
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const hasMore = data.entries.length < data.totalUsers;

  const handleLoadMore = () => {
    startTransition(async () => {
      const moreData = await fetchLeaderboard(data.entries.length);
      setData((prev) => ({
        ...prev,
        entries: [...prev.entries, ...moreData.entries],
      }));
    });
  };

  return (
    <main className="flex-1 flex flex-col min-h-0">
      <LeaderboardHeader totalUsers={data.totalUsers} />

      <div className="flex-1 overflow-y-auto p-6 md:px-10 pb-20">
        {/* Current user position card (if not in visible list) */}
        {data.currentUserPosition &&
          data.currentUserPosition > data.entries.length && (
            <CurrentUserCard position={data.currentUserPosition} />
          )}

        {data.entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground">
              No collectors on the leaderboard yet.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Add sets to your collection to appear here!
            </p>
          </div>
        ) : (
          <LeaderboardTable entries={data.entries} currentUserId={currentUserId} />
        )}

        {hasMore && (
          <div className="flex justify-center py-10">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isPending}
              className="min-w-[140px]"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
