export type TileType = "." | "#" | "c" | "W" | "p";

export interface CabanaState {
  isBooked: boolean;
  booking?: {
    room: string;
    guestName: string;
  };
}

export interface NormalElement {
  elementType: "normal";
  type: TileType;
  assetSrc: string;
  rotation: number;
}
export interface CabanaElement {
  elementType: "cabana";
  id: string;
  cabanaState: CabanaState;
  type: TileType;
  assetSrc: string;
  rotation: number;
}

export type Element = NormalElement | CabanaElement;
export type Map = Element[][];
