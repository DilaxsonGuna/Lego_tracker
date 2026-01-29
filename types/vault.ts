export type VaultSetStatus = "built" | "in-box" | "missing-parts" | "for-sale";

export interface VaultSet {
  setNum: string;
  name: string;
  year: number;
  numParts: number;
  setImgUrl: string;
  price: string;
  status: VaultSetStatus;
  themeName: string;
}

export interface VaultStats {
  totalValue: string;
  totalPieces: string;
  uniqueThemes: number;
}

export type VaultViewMode = "grid" | "list";
