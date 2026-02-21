import type { CollectionTab } from "./lego-set";

export type VaultSetStatus = "built" | "in-box" | "missing-parts" | "for-sale";

export interface VaultSet {
  setNum: string;
  name: string;
  year: number;
  numParts: number;
  setImgUrl: string;
  themeName: string;
  collectionType: CollectionTab;
  isFavorite: boolean;
  status?: VaultSetStatus;
}

export interface VaultStats {
  totalPieces: string;
  uniqueThemes: number;
}

export type VaultViewMode = "grid" | "list";

export type VaultSortOption =
  | "recently-added"
  | "name-asc"
  | "name-desc"
  | "year-newest"
  | "year-oldest"
  | "pieces-most"
  | "pieces-least";

export interface CollectionStats {
  totalPieces: string;
  setsOwned: number;
}

export interface WishlistStats {
  targetPieces: string;
  savedSets: number;
}
