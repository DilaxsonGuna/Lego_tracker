import { UserStats } from "@/types/profile";

interface StatsBarProps {
  stats: UserStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${Math.floor(num / 1000)}k`;
    }
    return num.toString();
  };

  return (
    <div className="flex w-full md:w-auto divide-x divide-border bg-card rounded-xl border border-border overflow-hidden">
      <div className="flex flex-1 md:flex-none flex-col items-center px-6 py-3 min-w-[100px]">
        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          Sets
        </span>
        <span className="text-foreground text-xl font-bold">
          {stats.setsCount}
        </span>
      </div>
      <div className="flex flex-1 md:flex-none flex-col items-center px-6 py-3 min-w-[100px]">
        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          Pieces
        </span>
        <span className="text-foreground text-xl font-bold">
          {formatNumber(stats.piecesCount)}
        </span>
      </div>
      <div className="flex flex-1 md:flex-none flex-col items-center px-6 py-3 min-w-[100px] bg-primary/10">
        <span className="text-primary text-xs font-semibold uppercase tracking-wider">
          Rank
        </span>
        <span className="text-primary text-xl font-bold">{stats.rank}</span>
      </div>
    </div>
  );
}
