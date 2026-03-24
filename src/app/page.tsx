"use client";

import { useQuery } from "@tanstack/react-query";
import { ResortLegend } from "@/components/resort-map/resort-legend";
import { ResortMapPanel } from "@/components/resort-map/resort-map-panel";
import { kyInstance } from "../lib/ky";
import { Map } from "../types";

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["map"],
    queryFn: () => kyInstance.get("/api/map").json<{ map: Map }>(),
  });

  const map = data?.map;

  return (
    <main className="mx-auto py-5 max-sm:pt-2 w-[min(1380px,calc(100vw-1.5rem))] max-sm:w-[min(100vw-0.75rem,1380px)]">
      <section className="bg-[rgba(255,251,244,0.8)] shadow-[0_18px_46px_rgba(82,57,26,0.08)] backdrop-blur-[12px] p-5 max-sm:p-4 border border-[rgba(112,82,46,0.14)] rounded-[28px] max-sm:rounded-[20px]">
        <div>
          <h1 className="mt-1.5 text-[#173946] text-[clamp(1.6rem,2.8vw,2.5rem)] leading-[0.98]">
            Interactive resort map
          </h1>
        </div>
      </section>

      <section className="gap-3 grid lg:grid-cols-[250px_minmax(0,1fr)] mt-3">
        <ResortLegend />
        <ResortMapPanel isLoading={isLoading} isError={isError} map={map} />
      </section>
    </main>
  );
}
