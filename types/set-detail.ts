export interface SetDetail {
  setNum: string;
  name: string;
  year: number | null;
  numParts: number;
  imgUrl: string;
  themeId: number;
  themeName: string;
}

export interface UserSetStatus {
  inCollection: boolean;
  inWishlist: boolean;
  isFavorite: boolean;
}
