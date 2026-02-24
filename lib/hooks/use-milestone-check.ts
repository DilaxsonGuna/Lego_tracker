"use client";

import { useRef, useState, useCallback } from "react";
import type { Milestone } from "@/types/profile";

/**
 * Hook that compares current milestones against previously seen ones
 * to detect newly unlocked milestones.
 */
export function useMilestoneCheck() {
  const previousIds = useRef<Set<string>>(new Set());
  const [newMilestone, setNewMilestone] = useState<Milestone | null>(null);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const initialized = useRef(false);

  /**
   * Call this with the full list of milestones after a vault mutation.
   * On the first call, it seeds the baseline without triggering celebration.
   * On subsequent calls, it detects any newly achieved milestones.
   */
  const checkMilestones = useCallback((milestones: Milestone[]) => {
    const currentIds = new Set(milestones.map((m) => m.id));

    if (!initialized.current) {
      // First call: seed the baseline
      previousIds.current = currentIds;
      initialized.current = true;
      return;
    }

    // Find milestones that are new (present now but not before)
    const newOnes = milestones.filter((m) => !previousIds.current.has(m.id));

    // Update baseline
    previousIds.current = currentIds;

    if (newOnes.length > 0) {
      // Show the first new milestone (can be extended to queue multiple)
      setNewMilestone(newOnes[0]);
      setCelebrationOpen(true);
    }
  }, []);

  const dismissCelebration = useCallback(() => {
    setCelebrationOpen(false);
    setNewMilestone(null);
  }, []);

  return {
    newMilestone,
    celebrationOpen,
    setCelebrationOpen,
    checkMilestones,
    dismissCelebration,
  };
}
