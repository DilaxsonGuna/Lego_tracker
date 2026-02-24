import { Card, CardContent } from "@/components/ui/card";
import type { UserStats } from "@/types/profile";

interface ProfileStatsRowProps {
  stats: UserStats;
}

export function ProfileStatsRow({ stats }: ProfileStatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <Card className="bg-card/50 border-border">
        <CardContent className="p-4 sm:p-5">
          <div className="text-muted-foreground text-xs font-black uppercase tracking-widest mb-1">
            Vault Value
          </div>
          <div className="text-xl font-bold text-foreground">
            {stats.vaultValue}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 border-border">
        <CardContent className="p-4 sm:p-5">
          <div className="text-muted-foreground text-xs font-black uppercase tracking-widest mb-1">
            Total Parts
          </div>
          <div className="text-xl font-bold text-foreground">
            {stats.piecesCount.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 border-border">
        <CardContent className="p-4 sm:p-5">
          <div className="text-muted-foreground text-xs font-black uppercase tracking-widest mb-1">
            Global Rank
          </div>
          <div className="text-xl font-bold text-primary">
            {stats.rankNumber > 0 ? `#${stats.rankNumber}` : "—"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
