import { Service } from "@/types/service";
import { HotelServiceItem } from "./Item";

interface HotelServiceListProps {
  title?: string;
  services: Service[];
}

export function HotelServiceList({ title, services }: HotelServiceListProps) {
  return (
    <>
      {" "}
      <h4 className=" tw-mb-4 tw-font-bold tw-text-white tw-text-xl sm:tw-text-2xl">
        {title || "DỊCH VỤ KHÁCH SẠN"}
      </h4>
      <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-6">
        {" "}
        {services.map((service: Service) => (
          <HotelServiceItem item={service} key={service.id} />
        ))}
      </div>
    </>
  );
}
