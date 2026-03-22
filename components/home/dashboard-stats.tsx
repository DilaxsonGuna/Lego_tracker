"use client";

import { Package, Puzzle, Hash, Trophy } from "lucide-react";
import type { DashboardStats } from "@/lib/queries/home";

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStatsCard({ stats }: DashboardStatsProps) {
  return (
    <div className="rounded-xl bg-card/50 border border-border px-4 py-3 sm:px-6">
      {/* Mobile: 2x2 grid */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
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
      {/* Desktop: inline bar with dividers */}
      <div className="hidden sm:flex items-center justify-between">
        <StatItem
          icon={<Package className="size-4 text-primary" />}
          label="Sets"
          value={stats.totalSets.toLocaleString()}
        />
        <Divider />
        <StatItem
          icon={<Puzzle className="size-4 text-primary" />}
          label="Pieces"
          value={stats.totalPieces.toLocaleString()}
        />
        <Divider />
        <StatItem
          icon={<Trophy className="size-4 text-primary" />}
          label="Brick Score"
          value={stats.brickScore.toLocaleString()}
        />
        <Divider />
        <StatItem
          icon={<Hash className="size-4 text-primary" />}
          label="Global Rank"
          value={stats.rankNumber > 0 ? `#${stats.rankNumber}` : "--"}
        />
      </div>
    </div>
  );
}

function Divider() {
  return <div className="hidden sm:block w-px h-8 bg-border" />;
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center size-7 rounded-md bg-primary/10">{icon}</div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-bold text-foreground truncate">{value}</span>
        <span className="text-xs text-muted-foreground leading-none">{label}</span>
      </div>
    </div>
  );
}
