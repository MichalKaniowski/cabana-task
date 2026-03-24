"use client";

import { CabanaElement, Map } from "@/types";
import { useState } from "react";
import { CabanaBookingCard } from "./cabana-booking-card";
import { MapTile } from "./map-tile";

type ResortMapPanelProps = {
  map: Map;
};

export function ResortMapPanel({ map }: ResortMapPanelProps) {
  const [selectedCabanaId, setSelectedCabanaId] = useState<string | null>(null);
  const selectedCabana = map
    .flat()
    .find(
      (element) =>
        element.elementType === "cabana" && element.id === selectedCabanaId
    ) as CabanaElement;

  const handleCabanaClick = (
    element: Extract<Map[number][number], { elementType: "cabana" }>
  ) => {
    setSelectedCabanaId(element.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="bg-[rgba(255,252,247,0.93)] shadow-[0_14px_38px_rgba(85,61,32,0.08)] p-4 max-sm:p-3 border border-[rgba(108,80,43,0.14)] rounded-[28px] max-sm:rounded-[22px] min-w-0">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h2 className="font-medium text-[#173946] text-[1.38rem] max-sm:text-[1.24rem] leading-none tracking-[-0.02em]">
            Resort view
          </h2>
          <p className="lg:hidden inline-flex bg-[#f3ead9] mt-2 px-3 py-1 rounded-full font-semibold text-[#8b6b43] text-[0.72rem] uppercase tracking-[0.12em]">
            Swipe sideways to explore the full map
          </p>
        </div>
      </div>

      {selectedCabana && (
        <CabanaBookingCard
          cabana={selectedCabana}
          onClose={() => setSelectedCabanaId(null)}
        />
      )}

      <div className="mt-2.5 pb-1 overflow-x-auto">
        <div
          className="gap-[0.14rem] max-sm:gap-[0.12rem] grid bg-[linear-gradient(180deg,rgba(255,251,243,0.96),rgba(247,238,224,0.96))] shadow-[inset_0_0_0_1px_rgba(109,82,45,0.08)] p-[0.16rem] max-sm:p-[0.12rem] rounded-[16px] w-full min-w-max"
          style={{
            gridTemplateColumns: `repeat(${map[0].length}, minmax(36px, 1fr))`,
          }}
        >
          {map.map((row, rowIndex) =>
            row.map((element, columnIndex) => (
              <MapTile
                key={`${rowIndex}-${columnIndex}`}
                element={element}
                onCabanaClick={handleCabanaClick}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
