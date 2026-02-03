export interface ThemeCategory {
  id: number | "all";
  label: string;
}

export interface DiscoverySet {
  setNum: string;
  name: string;
  numParts: number;
  setImgUrl: string;
  theme: string;
  year: number | null;
  ownerCount?: number;
}

export type OrderByOption = "newest" | "oldest" | "most-popular";
