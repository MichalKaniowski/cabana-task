import Image from "next/image";
import { legendTileOrder, tiles } from "@/tiles";

export function ResortLegend() {
  return (
    <aside className="bg-[rgba(255,252,247,0.93)] shadow-[0_14px_38px_rgba(85,61,32,0.08)] p-4 max-sm:p-3.5 border border-[rgba(108,80,43,0.14)] rounded-[24px] max-sm:rounded-[20px]">
      <h2 className="text-[#173946] text-[1.1rem]">Legend</h2>

      <div className="gap-3 grid mt-3">
        {legendTileOrder.map((type) => (
          <div
            key={type}
            className="items-center gap-3 grid grid-cols-[48px_minmax(0,1fr)]"
          >
            <div className="relative bg-[#f6efdf] border border-[rgba(93,70,41,0.14)] rounded-[14px] w-12 aspect-square overflow-hidden">
              <Image src={tiles[type].asset} alt="" fill sizes="48px" />
            </div>
            <div>
              <strong className="text-[#173946] text-sm">
                {tiles[type].label}
              </strong>
              <p className="mt-0.5 text-[#61767b] text-sm leading-5">
                {tiles[type].legendCopy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
