"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { RankProgress } from "@/types/brick-score";

interface RankProgressCardProps {
  progress: RankProgress;
  brickScore: number;
}

export function RankProgressCard({ progress, brickScore }: RankProgressCardProps) {
  const { currentRank, nextRank, piecesToNextRank, setsToNextRank, overallProgress } =
    progress;

  // No rank yet - show call to action
  if (!currentRank) {
    return (
      <Card className="bg-card/50 border-border">
        <CardContent className="p-5">
          <div className="text-center">
            <div className="text-4xl mb-2">{"\ud83e\uddf1"}</div>
            <div className="text-sm font-medium text-foreground mb-1">
              Start Your Journey
            </div>
            <div className="text-xs text-muted-foreground">
              Add your first set to earn the New Recruit rank!
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // At max rank
  if (!nextRank) {
    return (
      <Card className="bg-card/50 border-border border-primary/50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentRank.icon}</span>
              <div>
                <div className="text-sm font-bold text-primary">
                  {currentRank.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  Maximum Rank Achieved!
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-foreground">
                {brickScore.toLocaleString()}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Brick Score
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show progress to next rank
  return (
    <Card className="bg-card/50 border-border">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentRank.icon}</span>
            <div>
              <div className="text-sm font-bold text-foreground">
                {currentRank.name}
              </div>
              <div className="text-xs text-muted-foreground">
                Next: {nextRank.icon} {nextRank.name}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-foreground">
              {brickScore.toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Brick Score
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          {piecesToNextRank > 0 && (
            <span>{piecesToNextRank.toLocaleString()} pieces to go</span>
          )}
          {setsToNextRank > 0 && <span>{setsToNextRank} sets to go</span>}
          {piecesToNextRank === 0 && setsToNextRank === 0 && (
            <span>Almost there!</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
