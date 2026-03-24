export type TileType = "." | "#" | "c" | "W" | "p";

export interface CabanaState {
  isBooked: boolean;
  booking?: {
    room: string;
    guestName: string;
  };
}

export interface ResortMapElementBase {
  type: TileType;
  assetSrc: string;
  rotation: number;
}

export interface StaticResortMapElement extends ResortMapElementBase {
  elementType: "normal";
}

export interface CabanaElement extends ResortMapElementBase {
  elementType: "cabana";
  id: string;
  cabanaState: CabanaState;
}

export type ResortMapElement = StaticResortMapElement | CabanaElement;
export type ResortMap = ResortMapElement[][];
