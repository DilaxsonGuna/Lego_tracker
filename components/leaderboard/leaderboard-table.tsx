"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { LeaderboardEntry } from "@/types/leaderboard";
import { cn } from "@/lib/utils";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId: string | null;
}

function PositionBadge({ position }: { position: number }) {
  if (position === 1) return <span className="text-2xl">🥇</span>;
  if (position === 2) return <span className="text-2xl">🥈</span>;
  if (position === 3) return <span className="text-2xl">🥉</span>;
  return (
    <span className="text-lg font-bold text-muted-foreground w-8 text-center">
      {position}
    </span>
  );
}

function LeaderboardRow({
  entry,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}) {
  return (
    <Link href={`/u/${entry.userId}`}>
      <div
        className={cn(
          "flex items-center gap-4 rounded-xl border p-4 transition-all hover:border-primary/50 cursor-pointer",
          isCurrentUser
            ? "bg-primary/10 border-primary/30"
            : "bg-card border-border"
        )}
      >
      {/* Position */}
      <div className="w-12 flex justify-center shrink-0">
        <PositionBadge position={entry.position} />
      </div>

      {/* Avatar & Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar
          className="size-10 ring-2 ring-surface-accent shrink-0"
          style={{ backgroundColor: entry.avatarColor }}
        >
          <AvatarFallback
            style={{ backgroundColor: entry.avatarColor }}
            className="text-white font-bold"
          >
            {entry.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-foreground truncate">
            @{entry.username}
          </span>
          {entry.rank && (
            <Badge
              variant="outline"
              className="w-fit text-xs font-bold px-2 py-0 mt-0.5"
            >
              {entry.rank.icon} {entry.rank.name}
            </Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6 text-sm shrink-0">
        <div className="text-center">
          <div className="font-bold text-foreground">{entry.setsCount}</div>
          <div className="text-xs text-muted-foreground uppercase">
            Sets
          </div>
        </div>
        <div className="text-center">
          <div className="font-bold text-foreground">
            {entry.piecesCount.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground uppercase">
            Pieces
          </div>
        </div>
      </div>

      {/* Brick Score */}
      <div className="text-right min-w-[80px] shrink-0">
        <div className="text-lg font-black text-primary">
          {entry.brickScore.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground uppercase">
          Brick Score
        </div>
      </div>
      </div>
    </Link>
  );
}

export function LeaderboardTable({
  entries,
  currentUserId,
}: LeaderboardTableProps) {
  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <LeaderboardRow
          key={entry.userId}
          entry={entry}
          isCurrentUser={entry.userId === currentUserId}
        />
      ))}
    </div>
  );
}
