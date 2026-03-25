import {
  bookCabana,
  getCabanaBooking,
} from "@/app/api/cabanas/book/cabana-bookings";
import { POST } from "@/app/api/cabanas/book/route";
import { readFile } from "node:fs/promises";

jest.mock("node:fs/promises", () => ({
  readFile: jest.fn(),
}));

const mockedReadFile = jest.mocked(readFile);

const makeRequest = (body: unknown) =>
  ({
    json: async () => body,
  } as Request);

const resetCabanaBookings = () => {
  (
    globalThis as typeof globalThis & {
      __cabanaBookings?: Map<string, { room: string; guestName: string }>;
    }
  ).__cabanaBookings?.clear();
};

describe("POST /api/cabanas/book", () => {
  beforeAll(() => {
    globalThis.Response = {
      json: (body: unknown, init?: ResponseInit) => ({
        status: init?.status ?? 200,
        json: async () => body,
      }),
    } as typeof Response;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    resetCabanaBookings();
  });

  it("returns 400 when required fields are missing", async () => {
    const response = await POST(
      makeRequest({
        cabanaId: "cabana-1-1",
        room: "",
        guestName: "Xavier Green",
      })
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      success: false,
      error: "Room number and guest name are required.",
    });
  });

  it("returns 409 when the cabana is already booked", async () => {
    bookCabana("cabana-1-1", {
      room: "101",
      guestName: "Alice Smith",
    });

    const response = await POST(
      makeRequest({
        cabanaId: "cabana-1-1",
        room: "204",
        guestName: "Xavier Green",
      })
    );

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      success: false,
      error: "This cabana is already booked.",
    });
  });

  it("returns 400 when room and guest name do not match any guest in bookings.json", async () => {
    mockedReadFile.mockResolvedValue(
      JSON.stringify([{ room: "204", guestName: "Xavier Green" }])
    );

    const response = await POST(
      makeRequest({
        cabanaId: "cabana-1-1",
        room: "204",
        guestName: "Wrong Name",
      })
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      success: false,
      error: "We couldn't find a current guest with that room number and name.",
    });
  });

  it("returns success and stores the booking when the request is valid", async () => {
    mockedReadFile.mockResolvedValue(
      JSON.stringify([{ room: "204", guestName: "Xavier Green" }])
    );

    const response = await POST(
      makeRequest({
        cabanaId: "cabana-1-1",
        room: "204",
        guestName: "Xavier Green",
      })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      success: true,
      error: "",
    });
    expect(getCabanaBooking("cabana-1-1")).toEqual({
      room: "204",
      guestName: "Xavier Green",
    });
  });
});
