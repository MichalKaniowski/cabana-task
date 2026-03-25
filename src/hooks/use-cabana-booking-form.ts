"use client";

import { useBookCabana } from "@/hooks/use-book-cabana";
import { CabanaElement } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type BookingFormValues = {
  room: string;
  guestName: string;
};

type UseCabanaBookingFormParams = {
  cabana: CabanaElement;
  onClose: () => void;
};

const emptyFormValues: BookingFormValues = {
  room: "",
  guestName: "",
};

export const useCabanaBookingForm = ({
  cabana,
  onClose,
}: UseCabanaBookingFormParams) => {
  const queryClient = useQueryClient();
  const [formValues, setFormValues] =
    useState<BookingFormValues>(emptyFormValues);
  const [validationError, setValidationError] = useState("");
  const {
    mutate: bookCabana,
    isPending,
    error: mutationError,
    isSuccess,
    reset,
  } = useBookCabana();

  const setFieldValue = (field: keyof BookingFormValues, value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormValues(emptyFormValues);
    setValidationError("");
  };

  const closeCard = () => {
    resetForm();
    reset();
    onClose();
  };

  const submitBooking = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const room = formValues.room.trim();
    const guestName = formValues.guestName.trim();

    if (!room || !guestName) {
      setValidationError("Room number and guest name are required.");
      return;
    }

    if (cabana.cabanaState.isBooked) {
      setValidationError("This cabana is already booked.");
      return;
    }

    setValidationError("");
    bookCabana(
      {
        cabanaId: cabana.id,
        room,
        guestName,
      },
      {
        onSuccess: async () => {
          resetForm();
          await queryClient.invalidateQueries({ queryKey: ["map"] });
        },
      }
    );
  };

  return {
    room: formValues.room,
    guestName: formValues.guestName,
    errorMessage: mutationError?.message || validationError,
    isBooked: cabana.cabanaState.isBooked,
    isPending,
    isSuccess,
    closeCard,
    submitBooking,
    setRoom: (value: string) => setFieldValue("room", value),
    setGuestName: (value: string) => setFieldValue("guestName", value),
  };
};
