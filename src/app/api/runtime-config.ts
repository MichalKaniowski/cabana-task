import path from "node:path";

const resolveConfiguredPath = (
  configuredPath: string | undefined,
  defaultFileName: string
) => {
  const normalizedPath = configuredPath?.trim();

  if (!normalizedPath) {
    return path.join(process.cwd(), defaultFileName);
  }

  return path.isAbsolute(normalizedPath)
    ? normalizedPath
    : path.resolve(process.cwd(), normalizedPath);
};

export const getMapFilePath = () => {
  return resolveConfiguredPath(process.env.MAP_PATH, "map.ascii");
};

export const getBookingsFilePath = () => {
  return resolveConfiguredPath(process.env.BOOKINGS_PATH, "bookings.json");
};
