"use client";

import { Package, Puzzle, Hash, Trophy } from "lucide-react";
import type { DashboardStats } from "@/lib/queries/home";

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStatsCard({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatItem
        icon={<Package className="size-4 text-primary" />}
        label="Sets"
        value={stats.totalSets.toLocaleString()}
      />
      <StatItem
        icon={<Puzzle className="size-4 text-primary" />}
        label="Pieces"
        value={stats.totalPieces.toLocaleString()}
      />
      <StatItem
        icon={<Trophy className="size-4 text-primary" />}
        label="Brick Score"
        value={stats.brickScore.toLocaleString()}
      />
      <StatItem
        icon={<Hash className="size-4 text-primary" />}
        label="Global Rank"
        value={stats.rankNumber > 0 ? `#${stats.rankNumber}` : "--"}
      />
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-card border border-border p-4">
      <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-lg font-bold text-foreground truncate">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
