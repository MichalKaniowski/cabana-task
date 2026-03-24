import {
  getCabanaBooking,
  getCabanaId,
} from "@/app/api/cabanas/book/cabana-bookings";
import { getTileAssetSrc } from "@/tiles";
import { ResortMap, TileType } from "@/types";
import arrowCornerSquare from "../../assets/arrowCornerSquare.png";
import arrowCrossing from "../../assets/arrowCrossing.png";
import arrowEnd from "../../assets/arrowEnd.png";
import arrowSplit from "../../assets/arrowSplit.png";
import arrowStraight from "../../assets/arrowStraight.png";

type Direction = "top" | "right" | "bottom" | "left";

const directions: Record<Direction, readonly [number, number]> = {
  top: [-1, 0],
  right: [0, 1],
  bottom: [1, 0],
  left: [0, -1],
};

function getTileAt(rows: string[], rowIndex: number, columnIndex: number) {
  return rows[rowIndex]?.[columnIndex] ?? ".";
}

function isConnectedTile(
  rows: string[],
  rowIndex: number,
  columnIndex: number
) {
  return getTileAt(rows, rowIndex, columnIndex) !== ".";
}

function getConnectedDirections(
  rows: string[],
  rowIndex: number,
  columnIndex: number
) {
  return (Object.keys(directions) as Direction[]).filter((direction) => {
    const [rowOffset, columnOffset] = directions[direction];

    return isConnectedTile(
      rows,
      rowIndex + rowOffset,
      columnIndex + columnOffset
    );
  });
}

function getArrowTileAsset(
  rows: string[],
  rowIndex: number,
  columnIndex: number
) {
  const connectedDirections = getConnectedDirections(
    rows,
    rowIndex,
    columnIndex
  );
  const connectionCount = connectedDirections.length;

  if (connectionCount === 4) {
    return {
      assetSrc: arrowCrossing.src,
      rotation: 0,
    };
  }

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
}

function buildMapTile(
  rows: string[],
  tileType: TileType,
  rowIndex: number,
  columnIndex: number
) {
  const tile =
    tileType === "#"
      ? {
          type: tileType,
          ...getArrowTileAsset(rows, rowIndex, columnIndex),
        }
      : {
          type: tileType,
          assetSrc: getTileAssetSrc(tileType),
          rotation: 0,
        };

  if (tileType !== "W") {
    return { ...tile, elementType: "normal" as const };
  }

  const cabanaId = getCabanaId(rowIndex, columnIndex);
  const booking = getCabanaBooking(cabanaId);

  return {
    ...tile,
    elementType: "cabana" as const,
    id: cabanaId,
    cabanaState: {
      isBooked: !!booking,
      booking,
    },
  };
}

export function buildResortMap(asciiMap: string): ResortMap {
  const rows = asciiMap.trimEnd().split("\n");

  return rows.map((row, rowIndex) =>
    (row.split("") as TileType[]).map((tileType, columnIndex) =>
      buildMapTile(rows, tileType, rowIndex, columnIndex)
    )
  );
}
