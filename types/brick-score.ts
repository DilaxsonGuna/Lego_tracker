export interface RankTier {
  id: string;
  name: string;
  icon: string;
  minPieces: number;
  minSets: number;
}

export interface RankProgress {
  currentRank: RankTier | null;
  nextRank: RankTier | null;
  piecesToNextRank: number;
  setsToNextRank: number;
  overallProgress: number; // 0-100 percentage
}
