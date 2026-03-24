import { getBookingsFilePath } from "@/lib/runtime-config";
import { readFile } from "node:fs/promises";

type GuestRecord = {
  room: string;
  guestName: string;
};

type CabanaBooking = {
  room: string;
  guestName: string;
};

// using globalThis to avoid refreshing the state when modules reload
const state = globalThis as typeof globalThis & {
  __cabanaBookings?: Map<string, CabanaBooking>;
};
const cabanaBookings =
  state.__cabanaBookings ?? new Map<string, CabanaBooking>();
state.__cabanaBookings = cabanaBookings;

export function getCabanaId(rowIndex: number, columnIndex: number) {
  return `cabana-${rowIndex + 1}-${columnIndex + 1}`;
}

export function getCabanaBooking(cabanaId: string) {
  return cabanaBookings.get(cabanaId);
}

export function bookCabana(cabanaId: string, booking: CabanaBooking) {
  cabanaBookings.set(cabanaId, booking);
}

export async function readGuestBookings() {
  const contents = await readFile(getBookingsFilePath(), "utf8");
  return JSON.parse(contents) as GuestRecord[];
}

export function isGuestBookingValid(
  guestBookings: GuestRecord[],
  room: string,
  guestName: string
) {
  const normalizedRoom = room.trim();
  const normalizedGuestName = guestName.trim().toLocaleLowerCase();

  return guestBookings.some(
    (booking) =>
      booking.room === normalizedRoom &&
      booking.guestName.trim().toLocaleLowerCase() === normalizedGuestName
  );
}
