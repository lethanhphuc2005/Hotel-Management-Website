import { Service } from "@/types/service";
import { HotelServiceItem } from "./Item";

interface HotelServiceListProps {
  services: Service[];
}

export function HotelServiceList({ services }: HotelServiceListProps) {
  return (
   <>
  <div className="tw-flex tw-flex-wrap tw-gap-6">
    {services.map((service: Service) => (
      <div
        key={service.id}
        className="tw-flex-1 tw-min-w-[280px] sm:tw-basis-[calc(50%-12px)] lg:tw-basis-[calc(25%-18px)]"
      >
        <HotelServiceItem item={service} />
      </div>
    ))}
  </div>
</>

  );
}
