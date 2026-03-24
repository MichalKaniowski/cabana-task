export type TileType = "." | "#" | "c" | "W" | "p";
export interface Element {
  type: TileType;
  assetSrc: string;
  rotation: number;
}

export type Map = Element[][];
