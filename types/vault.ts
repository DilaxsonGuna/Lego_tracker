import type { CollectionTab } from "./lego-set";

export type VaultSetStatus = "built" | "in-box" | "missing-parts" | "for-sale";

export interface VaultSet {
  setNum: string;
  name: string;
  year: number;
  numParts: number;
  setImgUrl: string;
  price: string;
  themeName: string;
  collectionType: CollectionTab;
  isFavorite: boolean;
}

export interface VaultStats {
  totalValue: string;
  totalPieces: string;
  uniqueThemes: number;
}

export type VaultViewMode = "grid" | "list";
