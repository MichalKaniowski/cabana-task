import { ResortMap } from "@/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResortMapPanel } from "./resort-map-panel";

jest.mock("ky", () => ({
  __esModule: true,
  default: {
    create: () => ({
      get: jest.fn(),
      post: jest.fn(),
    }),
  },
}));

const bookedCabanaMap: ResortMap = [
  [
    {
      type: "W",
      elementType: "cabana",
      assetSrc: "/cabana.png",
      rotation: 0,
      id: "cabana-1",
      cabanaState: {
        isBooked: true,
        booking: {
          room: "204",
          guestName: "Ada Lovelace",
        },
      },
    },
    {
      type: "W",
      elementType: "cabana",
      assetSrc: "/cabana.png",
      rotation: 0,
      id: "cabana-2",
      cabanaState: {
        isBooked: false,
      },
    },
  ],
];

const renderResortMapPanel = (map: ResortMap) => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <ResortMapPanel map={map} />
    </QueryClientProvider>
  );
};

beforeAll(() => {
  window.scrollTo = jest.fn();
});

describe("Booked cabana interaction", () => {
  it("shows the unavailable state instead of the booking form", async () => {
    const user = userEvent.setup();

    renderResortMapPanel(bookedCabanaMap);

    await user.click(screen.getByText("Booked"));

    expect(
      screen.getByRole("heading", { name: "Cabana unavailable" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("This cabana is already booked.")
    ).toBeInTheDocument();

    expect(
      screen.queryByPlaceholderText("Room number")
    ).not.toBeInTheDocument();
  });
});
