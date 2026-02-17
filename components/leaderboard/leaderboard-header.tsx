import { Trophy } from "lucide-react";

interface LeaderboardHeaderProps {
  totalUsers: number;
}

export function LeaderboardHeader({ totalUsers }: LeaderboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-background/95 backdrop-blur-md px-6 md:px-10 py-5">
      <div className="flex items-center gap-3">
        <Trophy className="size-6 text-primary" />
        <h1 className="text-xl font-black tracking-tight text-foreground">
          Global Leaderboard
        </h1>
      </div>
      <span className="text-sm text-muted-foreground">
        {totalUsers.toLocaleString()} collectors
      </span>
    </header>
  );
}
