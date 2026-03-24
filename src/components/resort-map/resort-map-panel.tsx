import Image from "next/image";
import { tiles } from "@/tiles";
import { Map } from "@/types";
import { TileType } from "@/types";

function getTileClassName(type: TileType) {
  const baseClassName =
    "relative aspect-square w-full min-w-[36px] overflow-hidden rounded-[14px] border border-[rgba(93,70,41,0.1)] bg-[#f5ecdd] shadow-[0_3px_8px_rgba(83,61,32,0.08)] max-sm:min-w-[30px]";

  switch (type) {
    case "W":
      return `${baseClassName} shadow-[0_3px_8px_rgba(83,61,32,0.08),inset_0_0_0_2px_rgba(19,90,73,0.18)]`;
    case "p":
      return `${baseClassName} shadow-[0_3px_8px_rgba(83,61,32,0.08),inset_0_0_0_2px_rgba(31,135,173,0.16)]`;
    case "c":
      return `${baseClassName} shadow-[0_3px_8px_rgba(83,61,32,0.08),inset_0_0_0_2px_rgba(140,103,52,0.16)]`;
    default:
      return baseClassName;
  }
}

type ResortMapPanelProps = {
  isError: boolean;
  isLoading: boolean;
  map?: Map;
};

export function ResortMapPanel({
  isError,
  isLoading,
  map,
}: ResortMapPanelProps) {
  const columns = map?.[0]?.length ?? 0;

  return (
    <section className="bg-[rgba(255,252,247,0.93)] shadow-[0_14px_38px_rgba(85,61,32,0.08)] p-4 max-sm:p-3 border border-[rgba(108,80,43,0.14)] rounded-[28px] max-sm:rounded-[22px] min-w-0">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h2 className="font-medium text-[#173946] text-[1.38rem] leading-none tracking-[-0.02em] max-sm:text-[1.24rem]">
            Resort view
          </h2>
          <p className="lg:hidden inline-flex bg-[#f3ead9] mt-2 px-3 py-1 rounded-full font-semibold text-[#8b6b43] text-[0.72rem] uppercase tracking-[0.12em]">
            Swipe sideways to explore the full map
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-[#edf5f7] mt-4 px-[1.1rem] py-4 rounded-[18px] text-[#49656a]">
          Loading resort map...
        </div>
      ) : null}

      {isError ? (
        <div className="bg-[#ffe4de] mt-4 px-[1.1rem] py-4 rounded-[18px] text-[#8c2d1f]">
          Couldn&apos;t load the resort map.
        </div>
      ) : null}

      {map ? (
        <div className="mt-2.5 pb-1 overflow-x-auto">
          <div
            className="gap-[0.14rem] max-sm:gap-[0.12rem] grid w-full min-w-max bg-[linear-gradient(180deg,rgba(255,251,243,0.96),rgba(247,238,224,0.96))] shadow-[inset_0_0_0_1px_rgba(109,82,45,0.08)] p-[0.16rem] max-sm:p-[0.12rem] rounded-[16px]"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(36px, 1fr))`,
            }}
          >
            {map.flatMap((row, rowIndex) =>
              row.map((element, columnIndex) => (
                <div
                  key={`${rowIndex}-${columnIndex}`}
                  className={getTileClassName(element.type)}
                >
                  <Image
                    src={element.assetSrc}
                    alt={tiles[element.type].label}
                    fill
                    sizes="36px"
                    className="object-cover"
                    style={{ transform: `rotate(${element.rotation}deg)` }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
