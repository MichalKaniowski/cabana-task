import { kyInstance } from "@/lib/ky";
import { useMutation } from "@tanstack/react-query";
import { HTTPError } from "ky";

type BookingResponse = {
  success: boolean;
  error: string;
};

export const useCabanaBook = () => {
  return useMutation({
    mutationFn: async ({
      cabanaId,
      room,
      guestName,
    }: {
      cabanaId: string;
      room: string;
      guestName: string;
    }) => {
      try {
        return await kyInstance
          .post("/api/cabanas/book", {
            json: { cabanaId, room, guestName },
          })
          .json<BookingResponse>();
      } catch (error) {
        if (error instanceof HTTPError) {
          const response = (await error.response.json()) as BookingResponse;
          throw new Error(response.error);
        }

        throw error;
      }
    },
  });
};
