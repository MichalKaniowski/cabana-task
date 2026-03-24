"use client";

import { useCabanaBook } from "@/hooks/use-cabana-book";
import { CabanaElement } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface CabanaBookingCardProps {
  cabana: CabanaElement;
  onClose: () => void;
}

export function CabanaBookingCard({
  cabana,
  onClose,
}: CabanaBookingCardProps) {
  const queryClient = useQueryClient();
  const [room, setRoom] = useState("");
  const [guestName, setGuestName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {
    mutate: bookingMutate,
    isPending: isBookingMutationPending,
    error: bookingMutationError,
    isSuccess: isBookingMutationSuccess,
  } = useCabanaBook();
  const error = bookingMutationError?.message || errorMessage;

  const handleCabanaBookingFormSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const normalizedRoom = room.trim();
    const normalizedGuestName = guestName.trim();

    if (!normalizedRoom || !normalizedGuestName) {
      setErrorMessage("Room number and guest name are required.");
      return;
    }

    if (cabana.cabanaState.isBooked) {
      setErrorMessage("This cabana is already booked.");
      return;
    }

    setErrorMessage("");
    bookingMutate(
      {
        cabanaId: cabana.id,
        room: normalizedRoom,
        guestName: normalizedGuestName,
      },
      {
        onSuccess: async () => {
          onClose();
          setRoom("");
          setGuestName("");
          await queryClient.invalidateQueries({ queryKey: ["map"] });
        },
      }
    );
  };

  return (
    <>
      {isBookingMutationSuccess ? (
        <div className="bg-[#e7f5ec] mt-4 px-4 py-3 rounded-[18px] text-[#1b5c3b] text-[0.94rem]">
          Booking successful!
        </div>
      ) : null}

      <div className="bg-[#f6eedf] mt-4 p-4 border border-[rgba(108,80,43,0.14)] rounded-[20px]">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h3 className="font-semibold text-[#173946] text-[1.05rem]">
              {cabana.cabanaState.isBooked
                ? "Cabana unavailable"
                : "Book this cabana"}
            </h3>
            <p className="mt-1 text-[#49656a] text-[0.94rem] leading-5">
              {cabana.cabanaState.isBooked
                ? "This cabana is already booked."
                : "Enter the room number and guest name to reserve it."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              setErrorMessage("");
            }}
            className="text-[#6b5a46] text-[0.88rem] underline underline-offset-3 cursor-pointer"
          >
            Back to map
          </button>
        </div>

        {!cabana.cabanaState.isBooked ? (
          <form className="gap-3 grid mt-4" onSubmit={handleCabanaBookingFormSubmit}>
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

            {error ? (
              <div className="bg-[#ffe4de] px-3.5 py-3 rounded-[14px] text-[#8c2d1f] text-[0.92rem] leading-5">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isBookingMutationPending}
              className="bg-[#1d6c5c] disabled:opacity-60 px-4 py-2.5 rounded-[14px] w-fit font-semibold text-white cursor-pointer"
            >
              {isBookingMutationPending ? "Booking..." : "Confirm booking"}
            </button>
          </form>
        ) : null}
      </div>
    </>
  );
}
