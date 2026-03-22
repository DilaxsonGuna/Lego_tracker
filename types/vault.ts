import type { CollectionTab } from "./lego-set";

export interface VaultSet {
  setNum: string;
  name: string;
  year: number;
  numParts: number;
  setImgUrl: string;
  themeName: string;
  collectionType: CollectionTab;
  isFavorite: boolean;
  retailPrice: number | null;
}

export interface VaultStats {
  totalPieces: string;
  uniqueThemes: number;
}

export type VaultViewMode = "grid" | "list";

export type VaultSortOption =
  | "recently-added"
  | "favorites-first"
  | "name-asc"
  | "name-desc"
  | "year-newest"
  | "year-oldest"
  | "pieces-most"
  | "pieces-least";

export interface CollectionStats {
  totalPieces: string;
  setsOwned: number;
  totalValue: string | null;
}

export interface WishlistStats {
  targetPieces: string;
  savedSets: number;
  totalValue: string | null;
}
