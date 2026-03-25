"use client";

import { useCabanaBookingForm } from "@/hooks/use-cabana-booking-form";
import { CabanaElement } from "@/types";

interface CabanaBookingCardProps {
  cabana: CabanaElement;
  onClose: () => void;
}

export const CabanaBookingCard = ({
  cabana,
  onClose,
}: CabanaBookingCardProps) => {
  const {
    room,
    guestName,
    errorMessage,
    isBooked,
    isPending,
    isSuccess,
    closeCard,
    submitBooking,
    setRoom,
    setGuestName,
  } = useCabanaBookingForm({ cabana, onClose });

  if (isSuccess) {
    return (
      <div className="bg-[#e7f5ec] mt-4 px-4 py-3 rounded-[18px] text-[#1b5c3b] text-[0.94rem]">
        Booking successful!
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#f6eedf] mt-4 p-4 border border-[rgba(108,80,43,0.14)] rounded-[20px]">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h3 className="font-semibold text-[#173946] text-[1.05rem]">
              {isBooked ? "Cabana unavailable" : "Book this cabana"}
            </h3>
            <p className="mt-1 text-[#49656a] text-[0.94rem] leading-5">
              {isBooked
                ? "This cabana is already booked."
                : "Enter the room number and guest name to reserve it."}
            </p>
          </div>

          <button
            type="button"
            onClick={closeCard}
            className="text-[#6b5a46] text-[0.88rem] underline underline-offset-3 cursor-pointer"
          >
            Back to map
          </button>
        </div>

        {!isBooked && (
          <form className="gap-3 grid mt-4" onSubmit={submitBooking}>
            <input
              required
              value={room}
              onChange={(event) => setRoom(event.target.value)}
              placeholder="Room number"
              className="bg-[rgba(255,252,247,0.92)] px-3.5 py-3 border border-[rgba(108,80,43,0.16)] focus:border-[#1e7260] rounded-[14px] outline-none"
            />

            <input
              required
              value={guestName}
              onChange={(event) => setGuestName(event.target.value)}
              placeholder="Guest name"
              className="bg-[rgba(255,252,247,0.92)] px-3.5 py-3 border border-[rgba(108,80,43,0.16)] focus:border-[#1e7260] rounded-[14px] outline-none"
            />

            {errorMessage ? (
              <div className="bg-[#ffe4de] px-3.5 py-3 rounded-[14px] text-[#8c2d1f] text-[0.92rem] leading-5">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="bg-[#1d6c5c] disabled:opacity-60 px-4 py-2.5 rounded-[14px] w-fit font-semibold text-white cursor-pointer"
            >
              {isPending ? "Booking..." : "Confirm booking"}
            </button>
          </form>
        )}
      </div>
    </>
  );
};
