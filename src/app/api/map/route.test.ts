import { GET } from "@/app/api/map/route";
import { readFile } from "node:fs/promises";

jest.mock("node:fs/promises", () => ({
  readFile: jest.fn(),
}));

const mockedReadFile = jest.mocked(readFile);

describe("GET /api/map", () => {
  beforeAll(() => {
    globalThis.Response = {
      json: (body: unknown, init?: ResponseInit) => ({
        status: init?.status ?? 200,
        json: async () => body,
      }),
    } as typeof Response;
  });

  it("returns code 200 and a 2D map with the expected normal and cabana tile data", async () => {
    mockedReadFile.mockResolvedValue("W.\n.#");

    const response = await GET();
    const { map } = (await response.json()) as { map: Array<Array<unknown>> };
    const cabanaTile = map[0][0] as {
      id: string;
      cabanaState: { isBooked: boolean; booking?: unknown };
    };

    expect(response.status).toBe(200);
    expect(Array.isArray(map)).toBe(true);
    expect(Array.isArray(map[0])).toBe(true);
    expect(map[0][0]).toEqual(
      expect.objectContaining({
        type: expect.any(String),
        assetSrc: expect.any(String),
        rotation: expect.any(Number),
        elementType: expect.any(String),
      })
    );
    expect(cabanaTile).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        cabanaState: expect.objectContaining({
          isBooked: false,
        }),
      })
    );
  });
});
