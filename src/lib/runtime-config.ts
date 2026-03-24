import path from "node:path";

function resolveConfiguredPath(
  configuredPath: string | undefined,
  defaultFileName: string
) {
  const normalizedPath = configuredPath?.trim();

  if (!normalizedPath) {
    return path.join(process.cwd(), defaultFileName);
  }

  return path.isAbsolute(normalizedPath)
    ? normalizedPath
    : path.resolve(process.cwd(), normalizedPath);
}

export function getMapFilePath() {
  return resolveConfiguredPath(process.env.MAP_PATH, "map.ascii");
}

export function getBookingsFilePath() {
  return resolveConfiguredPath(process.env.BOOKINGS_PATH, "bookings.json");
}
