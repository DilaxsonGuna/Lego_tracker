import type { RankTier, RankProgress } from "@/types/brick-score";

/**
 * Rank tiers ordered from highest to lowest.
 * User must meet BOTH piece AND set requirements.
 */
export const RANK_TIERS: readonly RankTier[] = [
  {
    id: "living-legend",
    name: "Living Legend",
    icon: "\ud83d\udc8e",
    minPieces: 500_000,
    minSets: 500,
  },
  {
    id: "brick-architect",
    name: "Brick Architect",
    icon: "\ud83d\udcd0",
    minPieces: 100_000,
    minSets: 150,
  },
  {
    id: "master-builder",
    name: "Master Builder",
    icon: "\ud83d\udc51",
    minPieces: 25_000,
    minSets: 50,
  },
  {
    id: "junior-builder",
    name: "Junior Builder",
    icon: "\ud83d\udd34",
    minPieces: 5_000,
    minSets: 10,
  },
  {
    id: "new-recruit",
    name: "New Recruit",
    icon: "\ud83e\uddf1",
    minPieces: 0,
    minSets: 1,
  },
] as const;

/**
 * Calculate Brick Score from pieces and sets.
 * Formula: Score = (Total Pieces * 1) + (Unique Sets * 100)
 */
export function calculateBrickScore(piecesCount: number, setsCount: number): number {
  return piecesCount + setsCount * 100;
}

/**
 * Get the current rank tier based on pieces and sets.
 * User must meet BOTH piece AND set requirements.
 * Returns null if user has 0 sets.
 */
export function getCurrentRank(piecesCount: number, setsCount: number): RankTier | null {
  if (setsCount === 0) return null;

  // Tiers are ordered highest to lowest, find first matching
  for (const tier of RANK_TIERS) {
    if (piecesCount >= tier.minPieces && setsCount >= tier.minSets) {
      return tier;
    }
  }

  return null;
}

/**
 * Get the next rank tier after the current one.
 * Returns null if already at highest rank or no current rank.
 */
export function getNextRank(currentRank: RankTier | null): RankTier | null {
  if (!currentRank) {
    // No rank yet, next rank is New Recruit
    return RANK_TIERS[RANK_TIERS.length - 1]; // new-recruit
  }

  const currentIndex = RANK_TIERS.findIndex((t) => t.id === currentRank.id);
  if (currentIndex <= 0) return null; // Already at highest or not found

  return RANK_TIERS[currentIndex - 1];
}

/**
 * Calculate progress toward the next rank.
 */
export function calculateRankProgress(
  piecesCount: number,
  setsCount: number
): RankProgress {
  const currentRank = getCurrentRank(piecesCount, setsCount);
  const nextRank = getNextRank(currentRank);

  if (!nextRank) {
    // At max rank or no rank possible
    return {
      currentRank,
      nextRank: null,
      piecesToNextRank: 0,
      setsToNextRank: 0,
      overallProgress: 100,
    };
  }

  // Calculate progress percentages
  const currentPiecesBase = currentRank?.minPieces ?? 0;
  const currentSetsBase = currentRank?.minSets ?? 0;

  const piecesRange = nextRank.minPieces - currentPiecesBase;
  const setsRange = nextRank.minSets - currentSetsBase;

  const piecesInRange = Math.min(piecesCount - currentPiecesBase, piecesRange);
  const setsInRange = Math.min(setsCount - currentSetsBase, setsRange);

  const piecesProgress =
    piecesRange > 0 ? Math.floor((piecesInRange / piecesRange) * 100) : 100;
  const setsProgress =
    setsRange > 0 ? Math.floor((setsInRange / setsRange) * 100) : 100;

  // Overall progress is the minimum of the two (both requirements must be met)
  const overallProgress = Math.max(0, Math.min(100, Math.min(piecesProgress, setsProgress)));

  return {
    currentRank,
    nextRank,
    piecesToNextRank: Math.max(0, nextRank.minPieces - piecesCount),
    setsToNextRank: Math.max(0, nextRank.minSets - setsCount),
    overallProgress,
  };
}

/**
 * Get rank tier by ID.
 */
export function getRankById(id: string): RankTier | undefined {
  return RANK_TIERS.find((t) => t.id === id);
}
