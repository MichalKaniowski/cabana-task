import { bookCabana } from "@/app/api/cabanas/book/cabana-bookings";
import { buildResortMap } from "@/app/api/map/build-resort-map";

const resetCabanaBookings = () => {
  (
    globalThis as typeof globalThis & {
      __cabanaBookings?: Map<string, { room: string; guestName: string }>;
    }
  ).__cabanaBookings?.clear();
};

describe("buildResortMap", () => {
  beforeEach(() => {
    resetCabanaBookings();
  });

  it("builds normal and cabana tiles with the expected shape", () => {
    const map = buildResortMap("W.\n.#");

    expect(map[0][0]).toEqual(
      expect.objectContaining({
        type: "W",
        elementType: "cabana",
        id: "cabana-1-1",
        cabanaState: expect.objectContaining({
          isBooked: false,
        }),
      })
    );
    expect(map[1][1]).toEqual(
      expect.objectContaining({
        type: "#",
        elementType: "normal",
        assetSrc: expect.any(String),
        rotation: expect.any(Number),
      })
    );
  });

  it("marks a cabana as booked when it already has a booking", () => {
    bookCabana("cabana-1-1", {
      room: "204",
      guestName: "Xavier Green",
    });

    const map = buildResortMap("W.");

    expect(map[0][0]).toEqual(
      expect.objectContaining({
        type: "W",
        elementType: "cabana",
        id: "cabana-1-1",
        cabanaState: {
          isBooked: true,
          booking: {
            room: "204",
            guestName: "Xavier Green",
          },
        },
      })
    );
  });
});
