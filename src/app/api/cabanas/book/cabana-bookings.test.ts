import {
  bookCabana,
  getCabanaBooking,
  isGuestBookingValid,
} from "@/app/api/cabanas/book/cabana-bookings";

const resetCabanaBookings = () => {
  (
    globalThis as typeof globalThis & {
      __cabanaBookings?: Map<string, { room: string; guestName: string }>;
    }
  ).__cabanaBookings?.clear();
};

describe("cabana-bookings", () => {
  beforeEach(() => {
    resetCabanaBookings();
  });

  it("stores and returns a cabana booking", () => {
    bookCabana("cabana-1-1", {
      room: "204",
      guestName: "Xavier Green",
    });

    expect(getCabanaBooking("cabana-1-1")).toEqual({
      room: "204",
      guestName: "Xavier Green",
    });
  });

  it("validates guest bookings using trimmed room and case-insensitive guest name", () => {
    expect(
      isGuestBookingValid(
        [{ room: "204", guestName: "Xavier Green" }],
        " 204 ",
        "xavier green"
      )
    ).toBe(true);
  });

  it("returns false when room and guest name do not match the same booking", () => {
    expect(
      isGuestBookingValid(
        [{ room: "204", guestName: "Xavier Green" }],
        "204",
        "Wrong Name"
      )
    ).toBe(false);
  });
});
