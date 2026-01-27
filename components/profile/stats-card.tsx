import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UserStats } from "@/types/profile";

interface StatsCardProps {
  stats: UserStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}m`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toLocaleString();
  };

  return (
    <Card className="grid grid-cols-1 divide-y divide-border rounded-2xl border border-border shadow-xl shadow-black/20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      <div className="flex flex-col items-center justify-center p-6 transition-colors hover:bg-surface-accent/50 first:rounded-t-2xl sm:first:rounded-l-2xl sm:first:rounded-tr-none">
        <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Sets Owned
        </span>
        <span className="mt-1 text-3xl font-bold text-foreground">
          {stats.setsCount}
        </span>
      </div>
      <div className="flex flex-col items-center justify-center p-6 transition-colors hover:bg-surface-accent/50">
        <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Total Bricks
        </span>
        <span className="mt-1 text-3xl font-bold text-foreground">
          {formatNumber(stats.piecesCount)}
        </span>
      </div>
      <div className="flex flex-col items-center justify-center p-6 transition-colors hover:bg-surface-accent/50 last:rounded-b-2xl sm:last:rounded-r-2xl sm:last:rounded-bl-none">
        <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          World Rank
        </span>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-3xl font-bold text-primary">
            #{stats.rankNumber}
          </span>
          <TrendingUp className="size-5 text-green-500" />
        </div>
      </div>
    </Card>
  );
}
