import {
  bookCabana,
  getCabanaBooking,
  isGuestBookingValid,
  readGuestBookings,
} from "@/app/api/cabanas/book/cabana-bookings";

type BookingRequestBody = {
  cabanaId?: string;
  room?: string;
  guestName?: string;
};

export const POST = async (request: Request) => {
  const { cabanaId, room, guestName } =
    (await request.json()) as BookingRequestBody;

  if (!cabanaId?.trim() || !room?.trim() || !guestName?.trim()) {
    return Response.json(
      { success: false, error: "Room number and guest name are required." },
      { status: 400 }
    );
  }
  if (getCabanaBooking(cabanaId)) {
    return Response.json(
      { success: false, error: "This cabana is already booked." },
      { status: 409 }
    );
  }

  const guestBookings = await readGuestBookings();

  if (!isGuestBookingValid(guestBookings, room, guestName)) {
    return Response.json(
      {
        success: false,
        error:
          "We couldn't find a current guest with that room number and name.",
      },
      { status: 400 }
    );
  }

  const booking = {
    room: room.trim(),
    guestName: guestName.trim(),
  };

  bookCabana(cabanaId, booking);

  return Response.json({
    success: true,
    error: "",
  });
};
