import { Service } from "@/types/service";
import { HotelServiceItem } from "./Item";

interface HotelServiceListProps {
  services: Service[];
}

export function HotelServiceList({ services }: HotelServiceListProps) {
  return (
    <>
      <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-6">
        {services.map((service: Service) => (
          <HotelServiceItem item={service} key={service.id} />
        ))}
      </div>
    </>
  );
}
