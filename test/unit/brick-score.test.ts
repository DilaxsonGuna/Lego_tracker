// Tests for lib/brick-score.ts
//
// These are all PURE FUNCTION tests — no mocking needed.
// The functions take numbers in and return values out.

import {
  calculateBrickScore,
  getCurrentRank,
  getNextRank,
  calculateRankProgress,
  getRankById,
  RANK_TIERS,
} from "@/lib/brick-score";

// ─── calculateBrickScore ────────────────────────────────────────────
// Formula: Score = Pieces + (Sets × 100)

describe("calculateBrickScore", () => {
  it("returns 0 for zero pieces and zero sets", () => {
    expect(calculateBrickScore(0, 0)).toBe(0);
  });

  it("applies the formula: pieces + (sets × 100)", () => {
    // 500 pieces + (5 sets × 100) = 1000
    expect(calculateBrickScore(500, 5)).toBe(1000);
  });

  it("counts pieces at weight 1", () => {
    expect(calculateBrickScore(1, 0)).toBe(1);
    expect(calculateBrickScore(999, 0)).toBe(999);
  });

  it("counts sets at weight 100", () => {
    expect(calculateBrickScore(0, 1)).toBe(100);
    expect(calculateBrickScore(0, 10)).toBe(1000);
  });

  it("handles large collections", () => {
    // Living Legend territory: 500k pieces, 500 sets
    expect(calculateBrickScore(500_000, 500)).toBe(550_000);
  });
});

// ─── getCurrentRank ─────────────────────────────────────────────────
// User must meet BOTH piece AND set requirements.
// Tiers (highest first): Living Legend, Brick Architect, Master Builder, Junior Builder, New Recruit

describe("getCurrentRank", () => {
  it("returns null for 0 sets (no rank possible)", () => {
    expect(getCurrentRank(999_999, 0)).toBeNull();
  });

  it("returns New Recruit for 1 set with any pieces", () => {
    const rank = getCurrentRank(0, 1);
    expect(rank?.id).toBe("new-recruit");
  });

  it("returns Junior Builder when BOTH thresholds met (5000 pieces, 10 sets)", () => {
    expect(getCurrentRank(5000, 10)?.id).toBe("junior-builder");
  });

  it("stays at New Recruit if pieces met but sets not met", () => {
    // Has enough pieces for Junior Builder (5000) but only 5 sets (needs 10)
    expect(getCurrentRank(5000, 5)?.id).toBe("new-recruit");
  });

  it("stays at New Recruit if sets met but pieces not met", () => {
    // Has enough sets for Junior Builder (10) but only 100 pieces (needs 5000)
    expect(getCurrentRank(100, 10)?.id).toBe("new-recruit");
  });

  it("returns Master Builder at 25k pieces and 50 sets", () => {
    expect(getCurrentRank(25_000, 50)?.id).toBe("master-builder");
  });

  it("returns Brick Architect at 100k pieces and 150 sets", () => {
    expect(getCurrentRank(100_000, 150)?.id).toBe("brick-architect");
  });

  it("returns Living Legend at 500k pieces and 500 sets", () => {
    expect(getCurrentRank(500_000, 500)?.id).toBe("living-legend");
  });
});

// ─── getNextRank ────────────────────────────────────────────────────
// Returns the tier above the current one, or null if already at max.

describe("getNextRank", () => {
  it("returns New Recruit when current rank is null (no rank yet)", () => {
    expect(getNextRank(null)?.id).toBe("new-recruit");
  });

  it("returns null when already at Living Legend (highest)", () => {
    const livingLegend = RANK_TIERS[0]; // first in array = highest
    expect(getNextRank(livingLegend)).toBeNull();
  });

  it("returns Junior Builder as next after New Recruit", () => {
    const newRecruit = RANK_TIERS.find((t) => t.id === "new-recruit")!;
    expect(getNextRank(newRecruit)?.id).toBe("junior-builder");
  });

  it("returns Master Builder as next after Junior Builder", () => {
    const juniorBuilder = RANK_TIERS.find((t) => t.id === "junior-builder")!;
    expect(getNextRank(juniorBuilder)?.id).toBe("master-builder");
  });
});

// ─── calculateRankProgress ──────────────────────────────────────────
// Returns progress % toward next rank. Uses MIN of pieces% and sets%
// (because BOTH requirements must be met).

describe("calculateRankProgress", () => {
  it("returns 100% progress when at max rank", () => {
    const progress = calculateRankProgress(500_000, 500);
    expect(progress.overallProgress).toBe(100);
    expect(progress.nextRank).toBeNull();
    expect(progress.piecesToNextRank).toBe(0);
    expect(progress.setsToNextRank).toBe(0);
  });

  it("returns 100% with null nextRank when user has 0 sets", () => {
    // No current rank, getNextRank(null) returns New Recruit
    // But New Recruit needs 1 set and 0 pieces
    const progress = calculateRankProgress(0, 0);
    expect(progress.nextRank?.id).toBe("new-recruit");
    expect(progress.setsToNextRank).toBe(1);
  });

  it("uses the LOWER of pieces% and sets% as overall progress", () => {
    // New Recruit (0 pieces, 1 set) → Junior Builder (5000 pieces, 10 sets)
    // With 2500 pieces (50% of 5000) and 3 sets (2 of 9 remaining ≈ 22%)
    const progress = calculateRankProgress(2500, 3);
    expect(progress.currentRank?.id).toBe("new-recruit");
    expect(progress.nextRank?.id).toBe("junior-builder");
    // Overall is bottlenecked by the lower one (sets progress)
    expect(progress.overallProgress).toBeLessThan(50);
  });

  it("calculates remaining pieces and sets to next rank", () => {
    // At New Recruit with 1000 pieces, 3 sets
    // Next is Junior Builder: 5000 pieces, 10 sets
    const progress = calculateRankProgress(1000, 3);
    expect(progress.piecesToNextRank).toBe(4000); // 5000 - 1000
    expect(progress.setsToNextRank).toBe(7); // 10 - 3
  });
});

// ─── getRankById ────────────────────────────────────────────────────

describe("getRankById", () => {
  it("finds a valid rank", () => {
    expect(getRankById("master-builder")?.name).toBe("Master Builder");
  });

  it("returns undefined for unknown ID", () => {
    expect(getRankById("nonexistent")).toBeUndefined();
  });
});
