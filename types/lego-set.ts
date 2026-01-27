export interface LegoSet {
  setNum: string;
  name: string;
  year: number;
  themeId: number;
  numParts: number;
  setImgUrl: string;
  isFavorite?: boolean;
}

export interface ThemeFilter {
  id: string;
  label: string;
  isActive?: boolean;
}
