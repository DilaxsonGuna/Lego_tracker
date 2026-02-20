import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {milestones.map((milestone) => (
          <Card
            key={milestone.id}
            className="bg-card/40 border-border hover:border-primary/40 transition-colors group"
          >
            <CardContent className="flex flex-col items-center gap-2 p-3 sm:p-4">
              <span className="text-3xl text-muted-foreground group-hover:text-primary transition-colors">
                {iconMap[milestone.icon] ?? "\u{2B50}"}
              </span>
              <span className="text-[9px] font-black text-center text-muted-foreground uppercase">
                {milestone.label}
              </span>
            </CardContent>
          </Card>
        ))}
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center h-auto p-4 rounded-xl border-dashed hover:border-muted-foreground group"
          aria-label="Add milestone"
        >
          <Plus className="size-5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
        </Button>
      </div>
    </div>
  );
}
