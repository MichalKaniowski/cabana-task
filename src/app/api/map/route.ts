import { getTileAssetSrc } from "@/tiles";
import { Map, TileType } from "@/types";
import { readFile } from "node:fs/promises";
import path from "node:path";
import arrowCornerSquare from "../../../../assets/arrowCornerSquare.png";
import arrowCrossing from "../../../../assets/arrowCrossing.png";
import arrowEnd from "../../../../assets/arrowEnd.png";
import arrowSplit from "../../../../assets/arrowSplit.png";
import arrowStraight from "../../../../assets/arrowStraight.png";

const mapPath = path.join(process.cwd(), "map.ascii");
type Direction = "top" | "right" | "bottom" | "left";

export async function GET() {
  const asciiMap = await readFile(mapPath, "utf8");
  const rows = asciiMap.trimEnd().split("\n");

  const directions = {
    top: [-1, 0],
    right: [0, 1],
    bottom: [1, 0],
    left: [0, -1],
  } as const;

  const checkIfTileNotEmpty = (
    direction: Direction,
    rowIdx: number,
    colIdx: number
  ) =>
    rows[rowIdx + directions[direction][0]][
      colIdx + directions[direction][1]
    ] !== ".";

  const getTileForArrow = (rowIdx: number, colIdx: number) => {
    const connectedDirections = (Object.keys(directions) as Direction[]).filter(
      (direction) => checkIfTileNotEmpty(direction, rowIdx, colIdx)
    );
    const connectionCount = connectedDirections.length;

    // arrow crossing
    if (connectionCount === 4) {
      return {
        assetSrc: arrowCrossing.src,
        rotation: 0,
      };
    }

    // arrow end
    if (connectionCount === 1) {
      const rotationByDirection: Record<Direction, number> = {
        top: 0,
        right: 90,
        bottom: 180,
        left: 270,
      };

      return {
        assetSrc: arrowEnd.src,
        rotation: rotationByDirection[connectedDirections[0]],
      };
    }

    // arrow straight and arrow corner
    if (connectionCount === 2) {
      const isStraightRoad =
        (connectedDirections.includes("top") &&
          connectedDirections.includes("bottom")) ||
        (connectedDirections.includes("left") &&
          connectedDirections.includes("right"));

      if (isStraightRoad) {
        return {
          assetSrc: arrowStraight.src,
          rotation: connectedDirections.includes("left") ? 90 : 0,
        };
      }

      const cornerKey = connectedDirections.join("-");
      const rotationByCorner: Record<string, number> = {
        "top-right": 0,
        "right-bottom": 90,
        "bottom-left": 180,
        "top-left": 270,
      };

      return {
        assetSrc: arrowCornerSquare.src,
        rotation: rotationByCorner[cornerKey],
      };
    }

    // arrow split
    const missingDirection = (Object.keys(directions) as Direction[]).find(
      (direction) => !connectedDirections.includes(direction)
    );
    const rotationByMissingDirection: Record<Direction, number> = {
      left: 0,
      top: 90,
      right: 180,
      bottom: 270,
    };

    return {
      assetSrc: arrowSplit.src,
      rotation: missingDirection
        ? rotationByMissingDirection[missingDirection]
        : 0,
    };
  };

  const formattedMap: Map = rows.map((row, rowIdx) => {
    const rowElements = row.split("") as TileType[];

    return rowElements.map((element, colIdx) => ({
      type: element,
      ...(element === "#"
        ? getTileForArrow(rowIdx, colIdx)
        : { assetSrc: getTileAssetSrc(element as TileType), rotation: 0 }),
    }));
  });

  return Response.json({ map: formattedMap });
}
