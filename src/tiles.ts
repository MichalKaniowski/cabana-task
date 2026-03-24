import { TileType } from "@/types";
import { StaticImageData } from "next/image";
import arrowStraight from "../assets/arrowStraight.png";
import cabanaTile from "../assets/cabana.png";
import chaletTile from "../assets/houseChimney.png";
import emptyTile from "../assets/parchmentBasic.png";
import poolTile from "../assets/pool.png";

export const legendTileOrder: TileType[] = ["W", "p", "#", "c", "."];

export const tiles: Record<
  TileType,
  {
    asset: StaticImageData;
    label: string;
    legendCopy: string;
  }
> = {
  W: {
    asset: cabanaTile,
    label: "Cabana",
    legendCopy: "Poolside lounge spots ready for booking.",
  },
  p: {
    asset: poolTile,
    label: "Pool",
    legendCopy: "Water tiles around the central resort pool.",
  },
  "#": {
    asset: arrowStraight,
    label: "Path",
    legendCopy: "Walkways connecting the property.",
  },
  c: {
    asset: chaletTile,
    label: "Chalet",
    legendCopy: "Guest chalet buildings across the grounds.",
  },
  ".": {
    asset: emptyTile,
    label: "Empty space",
    legendCopy: "Open decorative space in the resort plan.",
  },
};

export function getTileAssetSrc(type: TileType) {
  return tiles[type].asset.src;
}
