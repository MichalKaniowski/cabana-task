import { getTileAssetSrc } from "@/tiles";
import { Map, TileType } from "@/types";
import { readFile } from "node:fs/promises";
import path from "node:path";

const mapPath = path.join(process.cwd(), "map.ascii");

export async function GET() {
  const asciiMap = await readFile(mapPath, "utf8");
  const formattedMap: Map = asciiMap.split("\n").map((row) => {
    const rowElements = row.split("");

    return rowElements.map((element) => ({
      type: element as TileType,
      assetSrc: getTileAssetSrc(element as TileType),
    }));
  });

  return Response.json({ map: formattedMap });
}
