export interface LegoSet {
  setNum: string;
  name: string;
  year: number;
  themeId: number;
  numParts: number;
  setImgUrl: string;
  price?: string;
}

export type CollectionTab = "collection" | "wishlist";
