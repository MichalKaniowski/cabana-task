import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { ResponsePromise } from "ky";
import { kyInstance } from "../lib/ky";
import { ResortMap } from "../types";
import Home from "./page";

jest.mock("ky", () => ({
  __esModule: true,
  default: {
    create: () => ({
      get: jest.fn(),
      post: jest.fn(),
    }),
  },
}));

const sampleMap: ResortMap = [
  [
    {
      type: "W",
      elementType: "cabana",
      assetSrc: "/cabana.png",
      rotation: 0,
      id: "cabana-1",
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
  [
    {
      type: "#",
      elementType: "normal",
      assetSrc: "/path.png",
      rotation: 0,
    },
    {
      type: "c",
      elementType: "normal",
      assetSrc: "/chalet.png",
      rotation: 0,
    },
  ],
];

const createDeferred = <T,>() => {
  let resolvePromise: (value: T) => void = () => undefined;
  const promise = new Promise<T>((resolve) => {
    resolvePromise = resolve;
  });

  return {
    promise,
    resolve: resolvePromise,
  };
};

const createMockResponse = <T,>(
  getJsonResult: () => Promise<T>
): ResponsePromise<T> => {
  return {
    json: async <J = T,>() => (await getJsonResult()) as J,
  } as unknown as ResponsePromise<T>;
};

const renderHomePage = (options?: { retry?: boolean }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: options?.retry,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
};

describe("Home initial load", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows the loading state and then renders the map with the legend", async () => {
    const deferredMapResponse = createDeferred<{ map: ResortMap }>();

    jest
      .mocked(kyInstance.get)
      .mockReturnValue(
        createMockResponse(async () => deferredMapResponse.promise)
      );

    renderHomePage();

    expect(screen.getByText("Loading resort map...")).toBeInTheDocument();

    deferredMapResponse.resolve({ map: sampleMap });

    expect(
      await screen.findByRole("heading", { name: "Legend" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Resort view" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Loading resort map...")).not.toBeInTheDocument();
  });

  it("shows an error message when fetching the map fails", async () => {
    jest.mocked(kyInstance.get).mockReturnValue(
      createMockResponse(async () => {
        throw new Error("Map request failed");
      })
    );

    renderHomePage({ retry: false });

    expect(screen.getByText("Loading resort map...")).toBeInTheDocument();

    expect(
      await screen.findByText("Couldn't load the resort map.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Loading resort map...")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Legend" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Resort view" })
    ).not.toBeInTheDocument();
  });
});
