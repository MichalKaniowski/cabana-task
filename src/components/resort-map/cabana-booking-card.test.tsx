import { CabanaElement } from "@/types";
import { render, screen } from "@testing-library/react";
import { useCabanaBookingForm } from "../../hooks/use-cabana-booking-form";
import { CabanaBookingCard } from "./cabana-booking-card";

jest.mock("../../hooks/use-cabana-booking-form", () => ({
  useCabanaBookingForm: jest.fn(),
}));

const mockUseCabanaBookingForm = jest.mocked(useCabanaBookingForm);

const availableCabana: CabanaElement = {
  type: "W",
  elementType: "cabana",
  assetSrc: "/cabana.png",
  rotation: 0,
  id: "cabana-1",
  cabanaState: {
    isBooked: false,
  },
};

describe("CabanaBookingCard", () => {
  beforeEach(() => {
    mockUseCabanaBookingForm.mockReturnValue({
      room: "204",
      guestName: "Wrong Name",
      errorMessage:
        "We couldn't find a current guest with that room number and name.",
      isBooked: false,
      isPending: false,
      isSuccess: false,
      closeCard: jest.fn(),
      submitBooking: jest.fn(),
      setRoom: jest.fn(),
      setGuestName: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows a human-readable error message when booking fails", () => {
    render(<CabanaBookingCard cabana={availableCabana} onClose={jest.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Book this cabana" })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Room number")).toHaveValue("204");
    expect(screen.getByPlaceholderText("Guest name")).toHaveValue("Wrong Name");
    expect(
      screen.getByText(
        "We couldn't find a current guest with that room number and name."
      )
    ).toBeInTheDocument();
  });
});
