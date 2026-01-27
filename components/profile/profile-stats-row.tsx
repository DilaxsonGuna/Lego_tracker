import type { UserStats } from "@/types/profile";

interface ProfileStatsRowProps {
  stats: UserStats;
}

export function ProfileStatsRow({ stats }: ProfileStatsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-card/50 border border-border p-5 rounded-2xl">
        <div className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">
          Vault Value
        </div>
        <div className="text-xl font-bold text-foreground">
          {stats.vaultValue}
        </div>
      </div>
      <div className="bg-card/50 border border-border p-5 rounded-2xl">
        <div className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">
          Total Parts
        </div>
        <div className="text-xl font-bold text-foreground">
          {stats.piecesCount.toLocaleString()}
        </div>
      </div>
      <div className="bg-card/50 border border-border p-5 rounded-2xl">
        <div className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">
          Global Rank
        </div>
        <div className="text-xl font-bold text-primary">
          #{stats.rankNumber}
        </div>
      </div>
    </div>
  );
}
