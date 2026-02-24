"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Milestone } from "@/types/profile";

const iconMap: Record<string, string> = {
  diamond: "\u{1F48E}",
  history_edu: "\u{1F4DC}",
  architecture: "\u{1F3DB}",
  social_leaderboard: "\u{1F3C6}",
  verified_user: "\u{2705}",
};

interface MilestoneCelebrationProps {
  milestone: Milestone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MilestoneCelebration({
  milestone,
  open,
  onOpenChange,
}: MilestoneCelebrationProps) {
  const hasConfettiFired = useRef(false);

  useEffect(() => {
    if (open && milestone && !hasConfettiFired.current) {
      hasConfettiFired.current = true;

      // Fire confetti burst
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ["#ffd000", "#ffaa00", "#ff8800", "#ffffff"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ["#ffd000", "#ffaa00", "#ff8800", "#ffffff"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      // Initial big burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ffd000", "#ffaa00", "#ff8800", "#ffffff", "#ff6600"],
      });

      // Continuous side bursts
      requestAnimationFrame(frame);
    }

    if (!open) {
      hasConfettiFired.current = false;
    }
  }, [open, milestone]);

  if (!milestone) return null;

  const emoji = iconMap[milestone.icon] ?? "\u{2B50}";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="items-center">
          <div className="text-6xl mb-2">{emoji}</div>
          <DialogTitle className="text-2xl font-black">
            Milestone Unlocked!
          </DialogTitle>
          <DialogDescription className="text-base">
            Congratulations! You&apos;ve earned a new milestone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="inline-flex items-center gap-3 rounded-xl bg-primary/10 border border-primary/30 px-6 py-4">
            <span className="text-4xl">{emoji}</span>
            <div className="text-left">
              <div className="text-lg font-black text-foreground">
                {milestone.label}
              </div>
              <div className="text-sm text-muted-foreground">
                Achievement unlocked
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button onClick={() => onOpenChange(false)} className="min-w-[120px]">
            Awesome!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
