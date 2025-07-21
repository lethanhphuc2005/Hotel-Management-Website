import { Service } from "@/types/service";
import { HotelServiceItem } from "./Item";

interface HotelServiceListProps {
  services: Service[];
}

export function HotelServiceList({ services }: HotelServiceListProps) {
  return (
    <>
      <div className="tw-grid tw-gap-6 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4">
        {services.map((service: Service) => (
          <div key={service.id}>
            <HotelServiceItem item={service} />
          </div>
        ))}
      </div>
    </>
  );
}
