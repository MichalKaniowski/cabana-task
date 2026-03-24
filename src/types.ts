export type TileType = "." | "#" | "c" | "W" | "p";
export interface Element {
  type: TileType;
  assetSrc: string;
}

export type Map = Element[][];
