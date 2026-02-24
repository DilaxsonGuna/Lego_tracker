export type SearchTab = "sets" | "users" | "themes";

export interface SearchParams {
  q: string;
  tab: SearchTab;
}

export interface SearchSet {
  setNum: string;
  name: string;
  year: number | null;
  numParts: number;
  setImgUrl: string;
  theme: string;
}

export interface SearchUser {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
}

export interface SearchTheme {
  id: number;
  name: string;
  parentName: string | null;
}
