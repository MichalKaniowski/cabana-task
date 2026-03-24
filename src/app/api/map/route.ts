import { buildResortMap } from "@/app/api/map/build-resort-map";
import { getMapFilePath } from "@/lib/runtime-config";
import { readFile } from "node:fs/promises";

export async function GET() {
  const asciiMap = await readFile(getMapFilePath(), "utf8");
  const formattedMap = buildResortMap(asciiMap);

  return Response.json({ map: formattedMap });
}
