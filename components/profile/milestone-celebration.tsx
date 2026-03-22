"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
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

const iconMap: Partial<Record<string, string>> = {
  diamond: "\u{1F48E}",
  history_edu: "\u{1F4DC}",
  architecture: "\u{1F3DB}",
  social_leaderboard: "\u{1F3C6}",
  verified_user: "\u{2705}",
} as const;

interface MilestoneCelebrationProps {
  milestone: Milestone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MilestoneCelebration({ milestone, open, onOpenChange }: MilestoneCelebrationProps) {
  useEffect(() => {
    if (!open || !milestone) return;

    // Initial big burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ffd000", "#ffaa00", "#ff8800", "#ffffff", "#ff6600"],
    });

    // Continuous side bursts
    const end = Date.now() + 2000;
    let rafId: number;

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
        rafId = requestAnimationFrame(frame);
      }
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      confetti.reset();
    };
  }, [open, milestone]);

  if (!milestone) return null;

  const emoji = iconMap[milestone.icon] ?? "\u{2B50}";

  const handleShare = () => {
    const shareText = `${emoji} I just unlocked the "${milestone.label}" milestone on LegoFlex!`;
    const shareUrl = `${window.location.origin}/profile`;

    const doShare = async () => {
      if (navigator.share) {
        await navigator.share({
          title: `${milestone.label} — LegoFlex Milestone`,
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast.success("Milestone copied to clipboard!");
      }
    };

    doShare().catch((err) => {
      if (err instanceof Error && err.name === "AbortError") return;
      toast.error("Failed to share milestone");
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="items-center">
          <div className="text-6xl mb-2">{emoji}</div>
          <DialogTitle className="text-2xl font-black">Milestone Unlocked!</DialogTitle>
          <DialogDescription className="text-base">
            Congratulations! You&apos;ve earned a new milestone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="inline-flex items-center gap-3 rounded-xl bg-primary/10 border border-primary/30 px-6 py-4">
            <span className="text-4xl">{emoji}</span>
            <div className="text-left">
              <div className="text-lg font-black text-foreground">{milestone.label}</div>
              <div className="text-sm text-muted-foreground">Achievement unlocked</div>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-center gap-3">
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="size-4" />
            Share
          </Button>
          <Button onClick={() => onOpenChange(false)} className="min-w-[120px]">
            Awesome!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
