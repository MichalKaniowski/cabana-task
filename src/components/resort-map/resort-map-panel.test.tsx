import Home from "@/app/page";
import { kyInstance } from "@/lib/ky";
import { ResortMap } from "@/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResponsePromise } from "ky";
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

const resortMap: ResortMap = [
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
    {
      type: "p",
      elementType: "normal",
      assetSrc: "/pool.png",
      rotation: 0,
    },
  ],
];

const bookedResortMap: ResortMap = [
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
        isBooked: true,
        booking: {
          room: "204",
          guestName: "Ada Lovelace",
        },
      },
    },
    {
      type: "p",
      elementType: "normal",
      assetSrc: "/pool.png",
      rotation: 0,
    },
  ],
];

const createMockResponse = <T,>(
  getJsonResult: () => Promise<T>
): ResponsePromise<T> => {
  return {
    json: async <J = T,>() => (await getJsonResult()) as J,
  } as unknown as ResponsePromise<T>;
};

const renderResortMapPanel = (map: ResortMap) => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <ResortMapPanel map={map} />
    </QueryClientProvider>
  );
};

const renderHomePage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
};

beforeAll(() => {
  window.scrollTo = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Booked cabana interaction", () => {
  it("shows the unavailable state instead of the booking form", async () => {
    const user = userEvent.setup();

    renderResortMapPanel(resortMap);

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

describe("Available cabana booking flow", () => {
  it("shows the booking form when clicking an available cabana", async () => {
    const user = userEvent.setup();

    renderResortMapPanel(resortMap);

    await user.click(screen.getByText("Open"));

    expect(
      screen.getByRole("heading", { name: "Book this cabana" })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Room number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Guest name")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Confirm booking" })
    ).toBeInTheDocument();
  });

  it("shows booking success and updates the cabana to booked on the map", async () => {
    const user = userEvent.setup();
    let currentMap = resortMap;

    jest
      .mocked(kyInstance.get)
      .mockImplementation(() =>
        createMockResponse(async () => ({ map: currentMap }))
      );
    jest.mocked(kyInstance.post).mockImplementation((_, options) => {
      expect(options?.json).toEqual({
        cabanaId: "cabana-2",
        room: "204",
        guestName: "Ada Lovelace",
      });

      currentMap = bookedResortMap;

      return createMockResponse(async () => ({
        success: true,
        error: "",
      }));
    });

    renderHomePage();

    await user.click(await screen.findByText("Open"));
    await user.type(screen.getByPlaceholderText("Room number"), "204");
    await user.type(screen.getByPlaceholderText("Guest name"), "Ada Lovelace");
    await user.click(screen.getByRole("button", { name: "Confirm booking" }));

    expect(await screen.findByText("Booking successful!")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Open")).not.toBeInTheDocument();
    });
    expect(screen.getAllByText("Booked")).toHaveLength(2);
  });
});
