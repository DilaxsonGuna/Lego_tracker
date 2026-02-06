import { Plus } from "lucide-react";
import type { Milestone } from "@/types/profile";

interface MilestoneVaultProps {
  milestones: Milestone[];
}

const iconMap: Record<string, string> = {
  diamond: "\u{1F48E}",
  history_edu: "\u{1F4DC}",
  architecture: "\u{1F3DB}",
  social_leaderboard: "\u{1F3C6}",
  verified_user: "\u{2705}",
};

export function MilestoneVault({ milestones }: MilestoneVaultProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
        Milestone Vault
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/40 border border-border hover:border-primary/40 transition-colors group"
          >
            <span className="text-3xl text-muted-foreground group-hover:text-primary transition-colors">
              {iconMap[milestone.icon] ?? "\u{2B50}"}
            </span>
            <span className="text-[9px] font-black text-center text-muted-foreground uppercase">
              {milestone.label}
            </span>
          </div>
        ))}
        <button
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-border hover:border-muted-foreground transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Add milestone"
        >
          <Plus className="size-5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
        </button>
      </div>
    </div>
  );
}
