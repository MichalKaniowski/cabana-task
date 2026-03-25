import { cn } from "@/lib/utils";
import { tiles } from "@/tiles";
import { CabanaElement, ResortMapElement } from "@/types";
import Image from "next/image";

function assertNever(value: never): never {
  throw new Error(`Unhandled tile type: ${value}`);
}

function getTileClassName(element: ResortMapElement) {
  const baseClassName =
    "relative aspect-square w-full min-w-[36px] overflow-hidden rounded-[14px] border border-[rgba(93,70,41,0.1)] bg-[#f5ecdd] shadow-[0_3px_8px_rgba(83,61,32,0.08)] max-sm:min-w-[30px]";

  if (
    element.type === "W" &&
    element.elementType === "cabana" &&
    element.cabanaState?.isBooked
  ) {
    return `${baseClassName} bg-[#efe2d4] shadow-[0_3px_8px_rgba(83,61,32,0.08),inset_0_0_0_2px_rgba(140,76,44,0.32)] opacity-80`;
  }

  switch (element.type) {
    case "W":
      return `${baseClassName} shadow-[0_3px_8px_rgba(83,61,32,0.08),inset_0_0_0_2px_rgba(19,90,73,0.18)]`;
    case "p":
      return `${baseClassName} shadow-[0_3px_8px_rgba(83,61,32,0.08),inset_0_0_0_2px_rgba(31,135,173,0.16)]`;
    case "c":
      return `${baseClassName} shadow-[0_3px_8px_rgba(83,61,32,0.08),inset_0_0_0_2px_rgba(140,103,52,0.16)]`;
    case ".":
    case "#":
      return baseClassName;
  }

  return assertNever(element.type);
}

interface MapTileProps {
  element: ResortMapElement;
  onCabanaClick?: (element: CabanaElement) => void;
}

export const MapTile = ({ element, onCabanaClick }: MapTileProps) => {
  const isElementCabana = element.elementType === "cabana";

  const handleClick = () => {
    if (element.elementType !== "cabana") return;

    onCabanaClick?.(element);
  };

  return (
    <div
      className={cn(
        getTileClassName(element),
        isElementCabana && "cursor-pointer"
      )}
      onClick={handleClick}
    >
      <Image
        src={element.assetSrc}
        alt={tiles[element.type].label}
        fill
        sizes="36px"
        className="object-cover"
        style={{ transform: `rotate(${element.rotation}deg)` }}
      />
      {isElementCabana ? (
        <span
          className={cn(
            "right-1 bottom-1 absolute px-1 py-0.5 rounded-full font-semibold text-[0.55rem] uppercase tracking-[0.06em]",
            element.cabanaState?.isBooked
              ? "bg-[rgba(115,126,139,0.92)] text-white"
              : "bg-[rgba(191,235,206,0.95)] text-[#1f5c37]"
          )}
        >
          {element.cabanaState?.isBooked ? "Booked" : "Open"}
        </span>
      ) : null}
    </div>
  );
};
